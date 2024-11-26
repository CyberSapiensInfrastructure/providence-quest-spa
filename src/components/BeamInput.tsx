import React, { useEffect, useRef } from "react";
import {
  animate,
  useMotionTemplate,
  useMotionValue,
  motion,
} from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

interface BeamInputProps {
  placeholder?: string;
  buttonLabel?: string;
  onSubmit?: (value: number) => void;
  min?: number;
  max?: number;
  type?: string;
}

const BeamInput: React.FC<BeamInputProps> = ({
  placeholder = "Enter your value",
  buttonLabel = "Submit",
  onSubmit,
  min = 0,
  max,
  type = "text",
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

  const backgroundImage = useMotionTemplate`conic-gradient(from ${turn}turn, #a78bfa00 75%, #a78bfa 100%)`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current && onSubmit) {
      const value = inputRef.current.value
        ? Number(inputRef.current.value)
        : min;
      if (value >= min && (!max || value <= max)) {
        onSubmit(value);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={() => {
        inputRef.current?.focus();
      }}
      className="relative flex w-full items-center gap-2 border border-white/20 bg-gradient-to-br from-white/20 to-white/5 py-1.5 pl-6 pr-1.5"
    >
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white placeholder-white/80 focus:outline-0"
        min={min}
        max={max}
        onKeyDown={(e) => {
          if (
            !/[0-9]/.test(e.key) &&
            e.key !== "Backspace" &&
            e.key !== "Delete" &&
            e.key !== "ArrowLeft" &&
            e.key !== "ArrowRight"
          ) {
            e.preventDefault();
          }
        }}
      />

      <button
        onClick={(e) => e.stopPropagation()}
        type="submit"
        className="group flex shrink-0 items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-400 px-4 py-3 text-sm font-medium text-gray-900 transition-transform active:scale-[0.985]"
      >
        <span>{buttonLabel}</span>
        <FiArrowRight className="-mr-4 opacity-0 transition-all group-hover:-mr-0 group-hover:opacity-100 group-active:-rotate-45" />
      </button>

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

export default BeamInput;
