import React, { useEffect, useRef } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";

interface BeamInputProps {
  placeholder?: string;
  buttonLabel?: string;
  setValue?: (value: any) => void;
  min?: number;
  max?: number;
  type?: string;
  value: any;
}

const AnimatedInputBasic: React.FC<BeamInputProps> = ({
  placeholder = "Enter your value",
  min = 0,
  max,
  type = "text",
  value,
  setValue,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const turn = useMotionValue(0);

  useEffect(() => {
    animate(turn, 1, {
      ease: "linear",
      duration: 5,
      repeat: Infinity,
    });
  }, [turn]);

  const backgroundImage = useTransform(
    turn,
    [0, 1],
    [
      "conic-gradient(from 0turn, #a78bfa00 75%, #a78bfa 100%)",
      "conic-gradient(from 1turn, #a78bfa00 75%, #a78bfa 100%)",
    ]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      type === "number" &&
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  };

  return (
    <form
      onClick={() => {
        inputRef.current?.focus();
      }}
      className="relative flex w-full items-center gap-2 border border-white/20 bg-gradient-to-br from-white/20 to-white/5 py-4 pl-6 pr-1.5"
    >
      <input
        ref={inputRef}
        type={type}
        value={value}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white placeholder-white/80 focus:outline-0"
        min={min}
        max={max}
        onChange={(e) => {
          if (setValue) {
            setValue(e.target.value);
          }
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="pointer-events-none absolute inset-0 z-10">
        <motion.div
          style={{
            backgroundImage,
          }}
          className="mask-with-browser-support absolute -inset-[1px] border border-transparent bg-origin-border"
        />
      </div>
    </form>
  );
};

export default AnimatedInputBasic;
