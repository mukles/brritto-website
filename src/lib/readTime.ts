export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  // Strip HTML tags and split by whitespace to count words
  const text = content.replace(/<[^>]*>/g, "");
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}
