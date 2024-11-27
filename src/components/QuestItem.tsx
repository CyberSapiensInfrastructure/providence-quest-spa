import React from "react";
import { QUESTS } from "../constants/quests";

type Quest = (typeof QUESTS)[keyof typeof QUESTS];

interface QuestItemProps {
  quest: Quest;
  isVerifying?: boolean;
  isCompleted?: boolean;
}

const QuestItem: React.FC<QuestItemProps> = ({
  quest,
  isVerifying,
  isCompleted,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 text-white/60">
      <div className="flex items-center gap-3">
        <div className="w-1 h-1 bg-[#7042f88b]" />
        <span className="text-sm font-light">{quest.title}</span>
      </div>

      {"tweetUrl" in quest && (
        <a
          href={quest.tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#7042f88b] hover:text-[#9f7aea] transition-all duration-300"
        >
          View Tweet
        </a>
      )}

      <div className="flex items-center gap-2">
        {isVerifying && (
          <span className="text-yellow-500 text-xs">Verifying...</span>
        )}
        {isCompleted && (
          <span className="text-green-500 text-xs">Completed ✓</span>
        )}
      </div>
    </div>
  );
};

export default QuestItem;
