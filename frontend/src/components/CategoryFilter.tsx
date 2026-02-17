"use client";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (cat: string | null) => void;
}

const categories: { label: string; value: string | null }[] = [
  { label: "전체", value: null },
  { label: "유머", value: "HUMOR" },
  { label: "시사", value: "NEWS" },
  { label: "강아지", value: "DOG" },
  { label: "고양이", value: "CAT" },
];

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((cat) => {
        const isActive = selected === cat.value;
        return (
          <button
            key={cat.label}
            onClick={() => onSelect(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
