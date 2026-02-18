"use client";

import { useState, useEffect } from "react";
import { CategoryInfo } from "@/types";
import { getCategories } from "@/lib/api";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (cat: string | null) => void;
}

const FALLBACK_CATEGORIES: CategoryInfo[] = [
  { id: 0, name: "HUMOR", label: "유머", color: "yellow" },
  { id: 0, name: "NEWS", label: "시사", color: "blue" },
  { id: 0, name: "DOG", label: "강아지", color: "orange" },
  { id: 0, name: "CAT", label: "고양이", color: "purple" },
  { id: 0, name: "CHAT", label: "잡담", color: "green" },
];

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<CategoryInfo[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    getCategories()
      .then((cats) => {
        if (cats.length > 0) setCategories(cats);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
          selected === null
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
        }`}
      >
        전체
      </button>
      {categories.map((cat) => {
        const isActive = selected === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
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
