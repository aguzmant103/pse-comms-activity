export interface ActivityItem {
  id: string;
  type: "x" | "blog";
  title: string;
  date: string; // ISO date string
  url: string;
  source: string; // e.g., X handle or blog name
}

export interface ActivityListProps {
  items: ActivityItem[];
} 