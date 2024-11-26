import React from "react";

interface Props {
  children: React.ReactNode;
  hover: boolean;
}
const BoxWithDots: React.FC<Props> = ({ children, hover = true }) => {
  return (
    <div
      className={`w-full flex gap-2 text-sm items-center justify-center md:flex-row flex-col bg-white/10 p-3   relative ${
        hover && "hover:bg-yellow-200/20"
      }  transition-all`}
    >
      {children}
    </div>
  );
};

export default BoxWithDots;
