import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Custom element mappings for MDX content. Styling mostly comes from the
 * `prose` wrapper on the page; here we only override behavior — e.g. routing
 * internal links through next/link for client-side navigation.
 */
export const mdxComponents = {
  a: ({ href = "", ...props }: ComponentProps<"a">) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return <Link href={href} {...props} />;
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    );
  },
};
