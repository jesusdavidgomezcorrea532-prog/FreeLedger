import {
  ListSkeleton,
  PageHeaderSkeleton,
} from "@/components/dashboard/skeletons";

export default function ClientsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeaderSkeleton />
      <ListSkeleton rows={6} />
    </div>
  );
}
