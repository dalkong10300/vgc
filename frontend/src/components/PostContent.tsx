import React from "react";

interface PostContentProps {
  content: string;
}

const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/;
const URL_TEST_REGEX = /^https?:\/\/[^\s]+$/;
const YOUTUBE_REGEX =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})(?:[&?]\S*)?$/;

const SHORTS_REGEX = /youtube\.com\/shorts\//;

function extractYouTubeId(url: string): { id: string; isShorts: boolean } | null {
  const match = url.match(YOUTUBE_REGEX);
  if (!match) return null;
  return { id: match[1], isShorts: SHORTS_REGEX.test(url) };
}

function renderLine(line: string, lineIndex: number): React.ReactNode {
  const parts = line.split(URL_SPLIT_REGEX);

  if (parts.length === 1) {
    return <span key={lineIndex}>{line}</span>;
  }

  return (
    <span key={lineIndex}>
      {parts.map((part, i) => {
        if (!URL_TEST_REGEX.test(part)) {
          return <React.Fragment key={i}>{part}</React.Fragment>;
        }

        const yt = extractYouTubeId(part);
        if (yt) {
          return (
            <span
              key={i}
              className={`block my-3 ${yt.isShorts ? "flex justify-center" : ""}`}
            >
              <iframe
                src={`https://www.youtube.com/embed/${yt.id}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
                style={
                  yt.isShorts
                    ? { aspectRatio: "9 / 16", maxHeight: "480px", width: "auto", height: "480px" }
                    : { aspectRatio: "16 / 9", width: "100%" }
                }
              />
            </span>
          );
        }

        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {part}
          </a>
        );
      })}
    </span>
  );
}

export default function PostContent({ content }: PostContentProps) {
  const lines = content.split("\n");

  return (
    <div className="prose max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {renderLine(line, i)}
          {i < lines.length - 1 && "\n"}
        </React.Fragment>
      ))}
    </div>
  );
}
