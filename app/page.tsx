import Image from "next/image";
import { ActivityHeatmap } from "../components/activity-heatmap/activity-heatmap";
import { ActivityList } from "../components/activity-list/activity-list";
import type { ActivityItem } from "../components/activity-list/types";

const mockDays = Array.from({ length: 84 }, (_, i) => ({
  date: new Date(Date.now() - (83 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  count: Math.floor(Math.random() * 6),
}));

const mockItems: ActivityItem[] = [
  {
    id: "1",
    type: "x",
    title: "Announcing our new ZK blog post!",
    date: new Date().toISOString(),
    url: "https://x.com/pse_team/status/1",
    source: "@pse_team",
  },
  {
    id: "2",
    type: "blog",
    title: "How PSE is scaling privacy on Ethereum",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    url: "https://blog.pse.dev/scaling-privacy",
    source: "blog.pse.dev",
  },
  {
    id: "3",
    type: "x",
    title: "Join our next Twitter Space!",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    url: "https://x.com/pse_team/status/2",
    source: "@pse_team",
  },
];

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <ActivityHeatmap days={mockDays} />
        <ActivityList items={mockItems} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
