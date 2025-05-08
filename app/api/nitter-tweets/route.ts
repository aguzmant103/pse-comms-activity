import { NextResponse } from 'next/server';
import { fetchTweets } from 'nitter-scraper';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || 'PrivacyScaling';
    console.log(`\n========== [API] Fetching for username: @${username} ==========`);
    const tweets = await fetchTweets(username, 2);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let tweetCount = 0;
    let repostCount = 0;
    let filteredCount = 0;
    let tweetLines: string[] = [];
    let repostLines: string[] = [];
    tweets.forEach((t) => {
      const isRecent = t.timestamp && t.timestamp * 1000 >= oneWeekAgo;
      const isOwnPost = t.username === username;
      const ownSymbol = isOwnPost ? '🟢' : '⚪';
      const recentSymbol = isRecent ? '🕒' : '⏳';
      const line = `${ownSymbol}${recentSymbol} ${t.id} | ${t.created_at} | ${t.username} | ${t.text?.replace(/\s+/g, ' ').slice(0, 60)}`;
      if (isOwnPost && isRecent) {
        tweetLines.push(line);
        tweetCount++;
      } else if (!isOwnPost) {
        repostLines.push(line);
        repostCount++;
      } else {
        filteredCount++;
      }
    });
    if (tweetLines.length) {
      console.log("\n--- Original Tweets (🟢own, 🕒recent) ---");
      tweetLines.forEach((l) => console.log(l));
    }
    if (repostLines.length) {
      console.log("\n--- Filtered Reposts (⚪not own) ---");
      repostLines.forEach((l) => console.log(l));
    }
    if (filteredCount) {
      console.log(`\n--- Filtered (not recent): ${filteredCount}`);
    }
    console.log(`\n========== [SUMMARY] Originals: ${tweetCount} | Reposts: ${repostCount} | Not recent: ${filteredCount} ==========`);
    const recent = tweets.filter((t) => {
      const isRecent = t.timestamp && t.timestamp * 1000 >= oneWeekAgo;
      const isOwnPost = t.username === username;
      return isRecent && isOwnPost;
    });
    return NextResponse.json(recent);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 