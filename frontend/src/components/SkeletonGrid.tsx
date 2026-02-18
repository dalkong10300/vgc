export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[4/5] bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
}
