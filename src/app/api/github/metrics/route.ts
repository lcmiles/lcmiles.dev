import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache per username
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const cache: Record<string, { expires: number; payload: any }> = {};

const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

function ghHeaders() {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'lcmiles.dev-metrics',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function ghFetch(url: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...ghHeaders(),
      ...(init.headers || {}),
    },
    // Avoid Next caching across users
    cache: 'no-store',
  });
  return res;
}

async function ghGraphQL<T = any>(query: string, variables: Record<string, any>): Promise<T | null> {
  if (!process.env.GITHUB_TOKEN) return null; // GraphQL requires auth
  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...ghHeaders(),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const json = await res.json();
  if (json.errors) {
    console.warn('GraphQL errors:', json.errors);
    return null;
  }
  return json.data as T;
}

function parseLinkHeader(link: string | null): Record<string, string> {
  const rels: Record<string, string> = {};
  if (!link) return rels;
  for (const part of link.split(',')) {
    const m = part.match(/<(.*)>; rel="(.*)"/);
    if (m) {
      rels[m[2]] = m[1];
    }
  }
  return rels;
}

async function fetchAllRepos(username: string) {
  const repos: any[] = [];
  let page = 1;
  while (true) {
    const res = await ghFetch(`${GITHUB_API}/users/${username}/repos?per_page=100&page=${page}&sort=updated`);
    if (!res.ok) throw new Error(`Failed to fetch repositories: ${res.status}`);
    const data = await res.json();
    repos.push(...data);
    const link = parseLinkHeader(res.headers.get('Link'));
    if (!link.next) break;
    page += 1;
  }
  return repos;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchCommitActivity(owner: string, repo: string, tries = 6): Promise<Array<{week:number,total:number}>> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/stats/commit_activity`;
  for (let i = 0; i < tries; i++) {
    const res = await ghFetch(url);
    if (res.status === 202) {
      // GitHub generating stats, wait with exponential backoff + jitter
      const base = 500 * Math.pow(2, i); // 0.5s,1s,2s,4s,8s,16s
      const jitter = Math.random() * 300;
      await sleep(base + jitter);
      continue;
    }
    if (!res.ok) return [];
    const json = await res.json();
    if (Array.isArray(json)) return json as Array<{week:number,total:number}>;
    return [];
  }
  return [];
}

async function fetchRepoLanguages(owner: string, repo: string) {
  const res = await ghFetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`);
  if (!res.ok) return {} as Record<string, number>;
  return (await res.json()) as Record<string, number>;
}

async function fetchCommitCount(owner: string, repo: string) {
  // Use Link header trick to get total commits without downloading all
  const res = await ghFetch(`${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=1`);
  if (!res.ok) return 0;
  const link = res.headers.get('Link');
  if (!link) {
    // Fallback to length of body
    try {
      const json = await res.json();
      return Array.isArray(json) ? json.length : 0;
    } catch {
      return 0;
    }
  }
  const m = link.match(/page=(\d+)>; rel="last"/);
  return m ? parseInt(m[1], 10) : 0;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || 'lcmiles';
    const refresh = searchParams.get('refresh') === '1';

    const cacheKey = username;
    const now = Date.now();
    const cached = cache[cacheKey];
    if (!refresh && cached && cached.expires > now) {
      return NextResponse.json({ cached: true, ...cached.payload }, { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=60' } });
    }

    // Fetch user and repos
    const userRes = await ghFetch(`${GITHUB_API}/users/${username}`);
    if (!userRes.ok) {
      const remaining = userRes.headers.get('X-RateLimit-Remaining');
      const reset = userRes.headers.get('X-RateLimit-Reset');
      return NextResponse.json({ error: 'Failed to fetch user data', rateLimit: { remaining, reset } }, { status: userRes.status });
    }
    const user = await userRes.json();

    const repos = await fetchAllRepos(username);

    // Aggregate star/fork/issues
    const totalStars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((a, r) => a + (r.forks_count || 0), 0);
    const totalIssues = repos.reduce((a, r) => a + (r.open_issues_count || 0), 0);

  // Languages across ALL repos with limited concurrency
    const allLangs: Record<string, number> = {};
    const owner = username;
    const concurrency = 5;
    for (let i = 0; i < repos.length; i += concurrency) {
      const slice = repos.slice(i, i + concurrency);
      const results = await Promise.allSettled(slice.map((r: any) => fetchRepoLanguages(owner, r.name)));
      for (const res of results) {
        if (res.status === 'fulfilled') {
          for (const [lang, bytes] of Object.entries(res.value)) {
            allLangs[lang] = (allLangs[lang] || 0) + (bytes as number);
          }
        }
      }
    }

    // Total commits (limit to top 30 updated repos to keep requests sane)
    let totalCommits = 0;
    const commitTargets = repos.slice(0, 30);
    for (let i = 0; i < commitTargets.length; i += concurrency) {
      const slice = commitTargets.slice(i, i + concurrency);
      const results = await Promise.allSettled(slice.map((r: any) => fetchCommitCount(owner, r.name)));
      for (const res of results) {
        if (res.status === 'fulfilled') totalCommits += res.value;
      }
    }

    // Contribution calendar via GraphQL (GitHub-style heatmap)
    let contributionCalendar: null | {
      totalContributions: number;
      weeks: Array<{
        firstDay: string;
        contributionDays: Array<{ date: string; contributionCount: number; color?: string; weekday: number }>;
      }>;
      months: Array<{ name: string; year: number; firstDay: string; totalWeeks: number }>;
      colors?: string[];
    } = null;
    if (process.env.GITHUB_TOKEN) {
      const to = new Date();
      const from = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      const toISO = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59).toISOString();
      const fromISO = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 0, 0, 0).toISOString();
      const query = `
        query($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                colors
                months { name year firstDay totalWeeks }
                weeks {
                  firstDay
                  contributionDays { date contributionCount color weekday }
                }
              }
            }
          }
        }
      `;
      type GQL = { user: { contributionsCollection: { contributionCalendar: {
        totalContributions: number;
        colors?: string[];
        months: Array<{ name: string; year: number; firstDay: string; totalWeeks: number }>;
        weeks: Array<{ firstDay: string; contributionDays: Array<{ date: string; contributionCount: number; color?: string; weekday: number }> }>;
      } } } };
      const data = await ghGraphQL<GQL>(query, { login: username, from: fromISO, to: toISO });
      if (data?.user?.contributionsCollection?.contributionCalendar) {
        const cal = data.user.contributionsCollection.contributionCalendar;
        contributionCalendar = {
          totalContributions: cal.totalContributions,
          colors: cal.colors,
          months: cal.months,
          weeks: cal.weeks.map(w => ({
            firstDay: w.firstDay,
            contributionDays: w.contributionDays.map(d => ({
              date: d.date,
              contributionCount: d.contributionCount,
              color: d.color,
              weekday: d.weekday,
            })),
          })),
        };
      }
    }

    // PRs authored by the user (requires auth to be reliable)
    let totalPRs = 0;
    if (process.env.GITHUB_TOKEN) {
      const prRes = await ghFetch(`${GITHUB_API}/search/issues?q=is:pr+author:${encodeURIComponent(username)}`);
      if (prRes.ok) {
        const prJson = await prRes.json();
        totalPRs = prJson.total_count || 0;
      }
    }

    const recentRepos = [...repos].sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).slice(0, 6);

    const payload = {
      stats: {
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        total_stars: totalStars,
        total_forks: totalForks,
        total_issues: totalIssues,
        total_prs: totalPRs,
        total_commits: totalCommits,
      },
      repos: recentRepos,
      languages: allLangs,
      contributionCalendar,
    };

    cache[cacheKey] = { expires: now + CACHE_TTL_MS, payload };

    return NextResponse.json(payload, { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=60' } });
  } catch (e: any) {
    console.error('Metrics API error:', e);
    return NextResponse.json({ error: e?.message || 'Metrics API failed' }, { status: 500 });
  }
}
