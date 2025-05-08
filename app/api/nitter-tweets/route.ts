import { NextResponse } from 'next/server';
import { fetchTweets } from 'nitter-scraper';

export async function GET() {
  try {
    const tweets = await fetchTweets('PrivacyScaling', 2);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = tweets.filter((t) => {
      const isRecent = t.timestamp && t.timestamp * 1000 >= oneWeekAgo;
      const isOwnPost = t.username === 'PrivacyScaling';
      // Log for debugging
      console.log(
        `[TWEET] id: ${t.id}, created_at: ${t.created_at}, username: ${t.username}, isOwnPost: ${isOwnPost}, isRecent: ${isRecent}, text: ${t.text?.slice(0, 80)}`
      );
      if (!isOwnPost) {
        console.log(`[FILTERED REPOST] id: ${t.id}, username: ${t.username}, text: ${t.text?.slice(0, 80)}`);
      }
      return isRecent && isOwnPost;
    });
    return NextResponse.json(recent);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
} 