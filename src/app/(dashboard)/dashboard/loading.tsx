import {
  CardSkeleton,
  ChartSkeleton,
  PageHeaderSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeaderSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <ChartSkeleton />
      <TableSkeleton rows={5} />
    </div>
  );
}
