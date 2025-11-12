'use client';

import { Navigation } from '@/components/Navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GitHubStats {
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  total_forks: number;
  total_issues: number;
  total_prs: number;
  total_commits: number;
  contributions: number;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  open_issues_count: number;
}

interface LanguageStats {
  [key: string]: number;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  color?: string;
  weekday: number;
}

interface ContributionWeek {
  firstDay: string;
  contributionDays: ContributionDay[];
}

interface ContributionMonth {
  name: string;
  year: number;
  firstDay: string;
  totalWeeks: number;
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
  months: ContributionMonth[];
  colors?: string[];
}

import { ContributionHeatmap } from '../../components/ContributionHeatmap';

export default function MetricsPage() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [languages, setLanguages] = useState<LanguageStats>({});
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = 'lcmiles'; // Your GitHub username

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Fetch aggregated metrics from internal API route
  const fetchMetrics = async (force: boolean = false) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/github/metrics?username=${username}${force ? '&refresh=1' : ''}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to load metrics');
      }
      setStats({
        public_repos: json.stats.public_repos,
        followers: json.stats.followers,
        following: json.stats.following,
        total_stars: json.stats.total_stars,
        total_forks: json.stats.total_forks,
        total_issues: json.stats.total_issues,
        total_prs: json.stats.total_prs,
        total_commits: json.stats.total_commits,
        contributions: 0,
      });
      setRepos(json.repos);
      setLanguages(json.languages);
      setCalendar(json.contributionCalendar || null);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4">
              GitHub Metrics
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Real-time statistics from my GitHub profile
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              <p className="text-slate-400 mt-4">Loading GitHub data...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => fetchMetrics()}
                className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                {stats && [
                  { label: 'Total Stars', value: stats.total_stars, icon: '/icons/star.svg' },
                  { label: 'Total Commits', value: stats.total_commits, icon: '/icons/commit.svg' },
                  { label: 'Pull Requests', value: stats.total_prs, icon: '/icons/pull-request.svg' },
                  { label: 'Issues', value: stats.total_issues, icon: '/icons/issue.svg' },
                  { label: 'Repositories', value: stats.public_repos, icon: '/icons/repo.svg' },
                  { label: 'Followers', value: stats.followers, icon: '/icons/followers.svg' },
                  { label: 'Following', value: stats.following, icon: '/icons/following.svg' },
                  { label: 'Forks', value: stats.total_forks, icon: '/icons/fork.svg' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    <div className="mb-3">
                      <Image 
                        src={stat.icon} 
                        alt={stat.label}
                        width={32}
                        height={32}
                        className="brightness-0 invert"
                      />
                    </div>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Contribution Heatmap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-16 relative z-10"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-100">Contributions</h2>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 overflow-visible">
                  {calendar ? (
                    <ContributionHeatmap calendar={calendar} />)
                    : (
                      <div className="h-48 flex flex-col items-center justify-center text-xs text-slate-500 gap-2">
                        <span>No contribution data available.</span>
                        <span className="text-[10px]">Add a GitHub token to enable the contributions calendar.</span>
                      </div>
                    )
                  }
                </div>
              </motion.div>

              {/* Language Distribution */}
              {Object.keys(languages).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mb-16"
                >
                  <h2 className="text-3xl font-bold text-slate-100 mb-8">Languages</h2>
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">
                    {/* Language Bar */}
                    <div className="flex h-4 rounded-full overflow-hidden mb-6 -mx-8 px-8">
                      {(() => {
                        const entries = Object.entries(languages).sort(([,a],[,b]) => b - a);
                        const total = entries.reduce((s,[,v]) => s + v, 0);
                        // Generate a unique HSL color for each language using golden angle to avoid repeats.
                        return entries.map(([lang, bytes], idx) => {
                          const rawPct = (bytes / total) * 100;
                          const pct = Math.max(rawPct, 0.6); // ensure visibility for tiny slices
                          const hue = (idx * 137.508) % 360; // golden angle
                          const saturation = 65; // tuned for dark background
                          const lightness = 50; // mid lightness for contrast
                          const isFirst = idx === 0;
                          const isLast = idx === entries.length - 1;
                          return (
                            <div
                              key={lang}
                              className={`${isFirst ? 'rounded-l-full' : ''} ${isLast ? 'rounded-r-full' : ''}`}
                              style={{ width: `${pct}%`, backgroundColor: `hsl(${hue}deg ${saturation}% ${lightness}%)` }}
                              title={`${lang}: ${rawPct.toFixed(2)}%`}
                            />
                          );
                        });
                      })()}
                    </div>

                    {/* Language List */}
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {(() => {
                        const entries = Object.entries(languages).sort(([,a],[,b]) => b - a);
                        const total = entries.reduce((s,[,v]) => s + v, 0);
                        return entries.map(([lang, bytes], idx) => {
                          const pct = (bytes / total) * 100;
                          const hue = (idx * 137.508) % 360;
                          const saturation = 65;
                          const lightness = 50;
                          return (
                            <div key={lang} className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${hue}deg ${saturation}% ${lightness}%)` }}></span>
                              <span className="text-slate-300 text-sm font-medium">{lang}</span>
                              <span className="text-sm font-semibold" style={{ color: `hsl(${hue}deg ${saturation}% 70%)` }}>{pct.toFixed(2)}%</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Recent Repositories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-slate-100 mb-8">Recent Repositories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {repos.map((repo, index) => (
                    <motion.a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
                    >
                      <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
                        {repo.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {repo.description || 'No description provided'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Image src="/icons/star.svg" alt="Stars" width={14} height={14} className="brightness-0 invert" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Image src="/icons/fork.svg" alt="Forks" width={14} height={14} className="brightness-0 invert" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
