import * as React from "react";
import { ActivityHeatmapProps } from "./types";
import * as Tooltip from "@radix-ui/react-tooltip";

const GITHUB_GREEN_SCALE = [
  "bg-[#161b22]", // 0 (empty)
  "bg-[#0e4429]", // 1
  "bg-[#006d32]", // 2
  "bg-[#26a641]", // 3
  "bg-[#39d353]", // 4 (max)
];

const DAYS = ["Mon", "Wed", "Fri"];
const MONTHS = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function getMonthLabels(days: { date: string }[]) {
  // Show month label at the first week of each month
  const labels: { index: number; label: string }[] = [];
  let lastMonth = -1;
  days.forEach((d, i) => {
    const month = new Date(d.date).getMonth() + 1;
    if (month !== lastMonth) {
      labels.push({ index: i, label: MONTHS[month] });
      lastMonth = month;
    }
  });
  return labels;
}
    
function getOrdinal(n: number): string {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatTooltip(dateStr: string, count: number): string {
  const date = new Date(dateStr);
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const dayWithOrdinal = `${day}${getOrdinal(day)}`;
  if (count > 0) {
    return `${count} contribution${count === 1 ? "" : "s"} on ${month} ${dayWithOrdinal}.`;
  }
  return `No contributions on ${month} ${dayWithOrdinal}.`;
}

export function ActivityHeatmap({ days }: ActivityHeatmapProps) {
  // 7 columns (days), N rows (weeks)
  const weeks = Math.ceil(days.length / 7);
  const grid: (typeof days)[] = Array.from({ length: weeks }, (_, w) =>
    days.slice(w * 7, w * 7 + 7)
  );
  const maxCount = days.reduce((max, d) => (d.count > max ? d.count : max), 0);

  function getColor(count: number) {
    if (!count) return GITHUB_GREEN_SCALE[0];
    if (maxCount === 0) return GITHUB_GREEN_SCALE[1];
    // 4 levels of intensity
    const idx = Math.min(4, Math.ceil((count / maxCount) * 4));
    return GITHUB_GREEN_SCALE[idx];
  }

  const monthLabels = getMonthLabels(days);

  return (
    <section
      aria-label="PSE Activity Heatmap"
      className="w-full max-w-4xl mx-auto bg-[#0d1117] p-6 rounded-lg border border-[#21262d]"
    >
      {/* Month labels */}
      <div className="flex ml-10 mb-1 text-xs text-gray-400">
        {monthLabels.map(({ index, label }, i) => (
          <div
            key={label + index}
            className="flex-1 min-w-[20px] text-center"
            style={{ marginLeft: i === 0 ? `${index * 20}px` : undefined }}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col justify-between mr-2 text-xs text-gray-400 h-[112px]">
          {DAYS.map((d, i) => (
            <span key={d} style={{ marginTop: i === 0 ? "0px" : "32px" }}>{d}</span>
          ))}
        </div>
        {/* Grid */}
        <div className="flex overflow-x-auto">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[2px]">
              {week.map((day, di) => (
                <Tooltip.Root key={day?.date ?? di} delayDuration={75}>
                  <Tooltip.Trigger asChild>
                    <div
                      className={`w-5 h-4 ${getColor(day?.count ?? 0)} border border-[#161b22] rounded-sm m-[2px] focus:outline-none`}
                      aria-label={`${day?.count ?? 0} interactions on ${day?.date}`}
                      tabIndex={0}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="z-50 select-none rounded px-3 py-1.5 text-xs bg-[#161b22] text-white shadow-lg border border-[#30363d]"
                    >
                      {day?.date ? formatTooltip(day.date, day.count) : ""}
                      <Tooltip.Arrow className="fill-[#161b22]" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 ml-10">
        <span>Less</span>
        {GITHUB_GREEN_SCALE.map((cls, i) => (
          <span key={i} className={`w-4 h-4 ${cls} border border-[#161b22] inline-block rounded-sm m-[2px]`} />
        ))}
        <span>More</span>
      </div>
    </section>
  );
} 