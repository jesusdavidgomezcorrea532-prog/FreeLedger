import {
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons";

export default function IncomeLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeaderSkeleton />
      <TableSkeleton rows={8} />
    </div>
  );
}
