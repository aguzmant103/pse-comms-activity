"use client";
import * as React from "react";

interface Tweet {
  id: string;
  text: string;
  username: string;
  created_at: string | null;
  timestamp: number | null;
}

interface NitterFetcherProps {
  onFetchStart: () => void;
  onFetchComplete: (tweets: Tweet[]) => void;
}

export function NitterFetcher({ onFetchStart, onFetchComplete }: NitterFetcherProps) {
  const [tweets, setTweets] = React.useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState<string | undefined>(undefined);
  const [username, setUsername] = React.useState("PrivacyScaling");
  const [lastCount, setLastCount] = React.useState<number | null>(null);

  async function handleFetch() {
    setIsLoading(true);
    setHasError(undefined);
    setTweets([]);
    setLastCount(null);
    onFetchStart(); // Call the onFetchStart callback
    console.log(`[NitterFetcher] Fetching tweets for @${username} via /api/nitter-tweets...`);
    try {
      const res = await fetch(`/api/nitter-tweets?username=${encodeURIComponent(username)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch from API");
      }
      const recent: Tweet[] = await res.json();
      setTweets(recent);
      setLastCount(recent.length);
      onFetchComplete(recent); // Call the onFetchComplete callback with the fetched tweets
      console.log(`[NitterFetcher] Tweets from last week (originals only): ${recent.length}`);
    } catch (e) {
      console.error("[NitterFetcher] Error fetching tweets:", e);
      setHasError((e as Error).message || "Failed to fetch tweets");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center gap-4">
      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded border border-gray-600 bg-[#161b22] text-white focus:outline-none"
          placeholder="Enter X username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
          onClick={handleFetch}
          disabled={isLoading || !username.trim()}
        >
          {isLoading ? "Loading..." : `Fetch last week of X posts`}
        </button>
      </div>
      {hasError && (
        <div className="text-red-500 text-sm">{hasError}</div>
      )}
      {lastCount !== null && !isLoading && !hasError && (
        <div className="text-green-400 text-base mt-2">Total tweets scraped: {lastCount}</div>
      )}
    </section>
  );
} 