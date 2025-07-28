export default function GallerySkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="relative block rounded shadow overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ height: "200px" }}
        >
          <div className="absolute bottom-0 left-0 right-0 bg-gray-300/50 dark:bg-gray-600/50 h-6"></div>
        </div>
      ))}
    </div>
  );
}
