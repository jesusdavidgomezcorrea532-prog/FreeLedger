import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { Footer } from "@/components/landing/footer";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and insights for freelancer finances — taxes, expenses, pricing, and the tools that make managing money simple.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
  openGraph: {
    title: "FreeLedger Blog",
    description: "Tips, guides, and insights for freelancer finances.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <LandingNav />

      <main className="flex-1 px-6 pb-24 pt-32">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            FreeLedger Blog
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Tips, guides, and insights for freelancer finances.
          </p>
        </header>

        <div className="mx-auto mt-14 max-w-6xl">
          {posts.length === 0 ? (
            <p className="text-center text-zinc-500">
              No posts yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
