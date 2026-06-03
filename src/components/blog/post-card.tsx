import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog";

/** Deterministic gradient placeholder so cards look intentional before real cover images exist. */
function CoverPlaceholder({ title }: { title: string }) {
  const gradients = [
    "from-emerald-500/30 to-teal-500/10",
    "from-sky-500/30 to-indigo-500/10",
    "from-amber-500/30 to-rose-500/10",
    "from-violet-500/30 to-fuchsia-500/10",
  ];
  const index = title.length % gradients.length;
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[index]}`}
    >
      <span className="text-2xl font-semibold tracking-tight text-zinc-900/30 dark:text-zinc-100/30">
        FreeLedger
      </span>
    </div>
  );
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- cover art is optional/author-supplied; avoid next/image config for arbitrary paths
          <img
            src={post.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <CoverPlaceholder title={post.title} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-lg font-semibold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
          {post.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {post.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatPostDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
