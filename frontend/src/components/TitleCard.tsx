import { Category } from "@/types";

interface TitleCardProps {
  title: string;
  category: Category;
}

const colorMap: Record<Category, { bg: string; text: string }> = {
  [Category.HUMOR]: { bg: "#FFE4B5", text: "#8B6914" },
  [Category.NEWS]: { bg: "#B0C4DE", text: "#2F4F4F" },
  [Category.DOG]: { bg: "#FFDAB9", text: "#8B4513" },
  [Category.CAT]: { bg: "#D8BFD8", text: "#4B0082" },
};

export default function TitleCard({ title, category }: TitleCardProps) {
  const colors = colorMap[category];

  return (
    <div
      className="aspect-square rounded-xl flex items-center justify-center p-6"
      style={{ backgroundColor: colors.bg }}
    >
      <p
        className="text-center font-semibold text-lg line-clamp-3 leading-relaxed"
        style={{ color: colors.text }}
      >
        {title}
      </p>
    </div>
  );
}
