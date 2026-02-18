interface TitleCardProps {
  title: string;
  postId: number;
  likeCount: number;
  viewCount: number;
}

const palette = [
  { bg: "#FFE4B5", text: "#8B6914" },
  { bg: "#B0C4DE", text: "#2F4F4F" },
  { bg: "#FFDAB9", text: "#8B4513" },
  { bg: "#D8BFD8", text: "#4B0082" },
  { bg: "#B5EAD7", text: "#2D6A4F" },
  { bg: "#FCCDE2", text: "#8B2252" },
  { bg: "#C1E1FF", text: "#1B4965" },
  { bg: "#FFF3B0", text: "#7A6C00" },
  { bg: "#E2C9FF", text: "#5B2C8B" },
  { bg: "#FFD6D6", text: "#8B3A3A" },
];

export default function TitleCard({ title, postId, likeCount, viewCount }: TitleCardProps) {
  const colors = palette[postId % palette.length];

  return (
    <div
      className="aspect-[4/5] flex flex-col items-center justify-center p-4 relative"
      style={{ backgroundColor: colors.bg }}
    >
      <p
        className="text-center font-semibold text-sm sm:text-lg line-clamp-3 leading-relaxed"
        style={{ color: colors.text }}
      >
        {title}
      </p>
      <div
        className="absolute bottom-2 right-2 flex gap-2 text-[10px] sm:text-xs opacity-70"
        style={{ color: colors.text }}
      >
        <span>♥ {likeCount}</span>
        <span>👁 {viewCount}</span>
      </div>
    </div>
  );
}
