export default function Loading() {
  return (
    <main className="text-center py-20">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mx-auto"></div>
      </div>
    </main>
  );
}
