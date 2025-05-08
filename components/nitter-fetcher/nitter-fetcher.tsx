"use client";
import * as React from "react";

interface Tweet {
  id: string;
  text: string;
  username: string;
  created_at: string | null;
  timestamp: number | null;
}

export function NitterFetcher() {
  const [tweets, setTweets] = React.useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState<string | undefined>(undefined);

  async function handleFetch() {
    setIsLoading(true);
    setHasError(undefined);
    setTweets([]);
    console.log("[NitterFetcher] Fetching tweets for @PrivacyScaling via /api/nitter-tweets...");
    try {
      const res = await fetch("/api/nitter-tweets");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch from API");
      }
      const recent: Tweet[] = await res.json();
      // Filter again in the UI for extra safety
      const ownPosts = recent.filter((tweet) => tweet.username === "PrivacyScaling");
      console.log(`[NitterFetcher] Tweets from last week (originals only): ${ownPosts.length}`);
      setTweets(ownPosts);
    } catch (e) {
      console.error("[NitterFetcher] Error fetching tweets:", e);
      setHasError((e as Error).message || "Failed to fetch tweets");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto mt-8">
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
        onClick={handleFetch}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Fetch last week of X posts (@PrivacyScaling)"}
      </button>
      {hasError && (
        <div className="mt-4 text-red-500 text-sm">{hasError}</div>
      )}
      <ul className="mt-6 space-y-4">
        {tweets.map((tweet) => (
          <li key={tweet.id} className="bg-[#161b22] rounded p-4 border border-[#30363d] text-white">
            <div className="text-xs text-gray-400 mb-2">
              {tweet.created_at ? new Date(tweet.created_at).toLocaleString() : "Unknown date"}
            </div>
            <div className="whitespace-pre-line text-sm">{tweet.text}</div>
          </li>
        ))}
        {tweets.length === 0 && !isLoading && !hasError && (
          <li className="text-gray-400 text-sm">No tweets found for the last week.</li>
        )}
      </ul>
    </section>
  );
} 