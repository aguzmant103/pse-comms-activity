import * as React from "react";
import { ActivityListProps } from "./types";

export function ActivityList({ items }: ActivityListProps) {
  return (
    <section aria-label="Publishing Activity List" className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4">Recent Publishing Activity</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center gap-2 border border-gray-100 dark:border-gray-800">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${item.type === "x" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{item.type === "x" ? "X" : "Blog"}</span>
            <div className="flex-1">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                {item.title}
              </a>
              <div className="text-xs text-gray-500 mt-1">
                {item.source} • {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
} 