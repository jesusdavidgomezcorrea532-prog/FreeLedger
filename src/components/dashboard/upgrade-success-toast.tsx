"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function UpgradeSuccessToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (searchParams.get("upgraded") !== "true") return;

    firedRef.current = true;
    toast.success(
      "Welcome to Pro! 🎉 Your upgrade is active. Enjoy unlimited tracking.",
      { duration: 6000 },
    );

    const params = new URLSearchParams(searchParams.toString());
    params.delete("upgraded");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return null;
}
