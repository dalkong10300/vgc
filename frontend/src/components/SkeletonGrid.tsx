export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
}
