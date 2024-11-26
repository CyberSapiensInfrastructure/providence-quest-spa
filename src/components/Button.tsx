import React from "react";
import CornerDots from "./CornerDots";

interface ButtonProps {
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  label = "click",
  disabled = false,
  style = {},
}) => {
  return (
    <button
      style={style}
      disabled={disabled}
      className="transition ease-in-out duration-900 px-4 py-[5px] min-w-[200px] text-sm md:text-lg relative border border-white/50 text-center bg-opacity-50 z-10 disabled:opacity-40 disabled:border-white/50 hover:border-yellow-500 w-full"
    >
      {label}
      <CornerDots />
      {/* transparent bg */}
      <div className="bg-gradient-to-r from-cyan-700 to-gray-500 w-full h-full absolute top-0 left-0 z-[-1] opacity-30" />
    </button>
  );
};

export default Button;
