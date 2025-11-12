// Clean reimplementation after layout refactor corruption

interface ContributionMonth {
  name: string;
  year: number;
  firstDay: string;
  totalWeeks: number;
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  color?: string;
  weekday: number; // 0=Sunday
}

interface ContributionWeek {
  firstDay: string;
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
  months: ContributionMonth[];
  colors?: string[];
}

interface Props { calendar: ContributionCalendar; }

function getLevel(count: number, max: number): number {
  if (count === 0) return 0;
  const ratio = count / Math.max(max, 1);
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

// Dark blue -> lighter blue palette (ignore GitHub provided greens)
const LEVEL_CLASSES = [
  'bg-slate-800 border border-slate-700/40',           // 0 contributions
  'bg-blue-900/60 hover:bg-blue-900/80',               // low
  'bg-blue-800/70 hover:bg-blue-800/80',               // medium-low
  'bg-blue-700/80 hover:bg-blue-600/80',               // medium-high
  'bg-cyan-500/90 hover:bg-cyan-400/90',               // high
];

export const ContributionHeatmap: React.FC<Props> = ({ calendar }) => {
  const weeks = calendar.weeks.slice(-53);
  const allDays = weeks.flatMap(w => w.contributionDays);
  const maxDay = allDays.reduce((m, d) => Math.max(m, d.contributionCount), 0);

  // Compute month labels aligned to starting weeks
  const monthPositions: Array<{ label: string; weekIndex: number }> = [];
  let lastMonth = '';
  weeks.forEach((week, idx) => {
    const dateObj = new Date(week.firstDay + 'T00:00:00');
    const label = dateObj.toLocaleString('en-US', { month: 'short' });
    if (label !== lastMonth) {
      monthPositions.push({ label, weekIndex: idx });
      lastMonth = label;
    }
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header with total + legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-sm text-slate-400">{calendar.totalContributions.toLocaleString()} contributions in the last year</div>
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>Less</span>
          <div className="flex gap-1">
            {LEVEL_CLASSES.map((cls, i) => <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />)}
          </div>
          <span>More</span>
        </div>
      </div>
      {/* Heatmap with aligned weekday + month labels */}
      <div className="overflow-x-auto overflow-y-visible pb-2">
        <div className="inline-grid gap-y-2" style={{ gridTemplateColumns: '32px auto' }}>
          {/* Weekday labels */}
          <div className="grid grid-rows-7 gap-[3px] text-[10px] text-slate-500 pt-4 select-none w-8">
            <span className="row-start-2">Mon</span>
            <span className="row-start-4">Wed</span>
            <span className="row-start-6">Fri</span>
          </div>
          {/* Weeks */}
          <div className="grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, columnGap: '3px' }}>
            {weeks.map((week, wIdx) => (
              <div key={week.firstDay + wIdx} className="grid grid-rows-7 gap-[3px]">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const day: ContributionDay | undefined = week.contributionDays.find((d: ContributionDay) => d.weekday === dayIdx);
                  if (!day) return <div key={dayIdx} className="w-3 h-3" />;
                  const level = getLevel(day.contributionCount, maxDay);
                  const className = `w-3 h-3 rounded-sm group ${LEVEL_CLASSES[level]} transition-colors duration-200`;
                  return (
                    <div key={day.date} className={className} title={`${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'} on ${new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`}>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Spacer */}
          <div className="w-8" />
          {/* Month labels aligned under weeks */}
          <div className="grid text-[10px] text-slate-500 select-none" style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)`, columnGap: '3px' }}>
            {weeks.map((_, idx) => {
              const month = monthPositions.find(m => m.weekIndex === idx);
              return <div key={idx} className="h-4">{month ? month.label : ''}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
