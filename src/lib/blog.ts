import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
};

/** Estimated human-readable reading time, e.g. "5 min read". */
export function getReadingTime(content: string): string {
  return readingTime(content).text;
}

/** Format an ISO date string as e.g. "May 28, 2026". Stable across server renders. */
export function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function parseFrontmatter(raw: string, slug: string): Post {
  const { data, content } = matter(raw);

  const frontmatter: PostFrontmatter = {
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "1970-01-01",
    author: typeof data.author === "string" ? data.author : "FreeLedger",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    image: typeof data.image === "string" ? data.image : "",
  };

  return {
    ...frontmatter,
    slug,
    readingTime: getReadingTime(content),
    content,
  };
}

function readPostFile(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return parseFrontmatter(raw, slug);
}

/** All published slugs derived from the .mdx files in content/blog. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function toMeta(post: Post): PostMeta {
  const { content, ...meta } = post;
  void content;
  return meta;
}

/** All posts, newest first. Returns metadata only (no MDX body). */
export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .map((slug) => readPostFile(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(toMeta);
}

/** A single post including its MDX body, or null when the slug is unknown. */
export function getPostBySlug(slug: string): Post | null {
  return readPostFile(slug);
}

/** Up to `limit` posts excluding `slug`, newest first — for "Related posts". */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.slug !== slug)
    .slice(0, limit);
}
