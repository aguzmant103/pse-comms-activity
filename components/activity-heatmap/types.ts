export interface ActivityDay {
  date: string; // ISO date string
  count: number;
}

export interface ActivityHeatmapProps {
  days: ActivityDay[];
} 