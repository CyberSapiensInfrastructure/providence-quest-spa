import React, { useEffect, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";
import { FaEthereum } from "react-icons/fa6";

interface BasicInputProps {
  disabled?: boolean;
  value: any;
  setValue: (value: any) => void;
}

const BasicInput: React.FC<BasicInputProps> = ({ disabled = false, value }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const turn = useMotionValue(0);

  useEffect(() => {
    animate(turn, 1, {
      ease: "linear",
      duration: 5,
      repeat: Infinity,
    });
  }, [turn]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        if (disabled) return;
        else inputRef.current?.focus();
      }}
      className={`${
        disabled ? "opacity-60 blur-[2px] user-select-none" : "opacity-100"
      } relative flex w-full items-center gap-2 border border-white/30 bg-gradient-to-br from-white/10 to-white/5 py-1.5 pl-6 pr-1.5 filter`}
    >
      <input
        disabled={disabled}
        value={value}
        ref={inputRef}
        type="number"
        defaultValue={0.1}
        placeholder="amount"
        className="w-full bg-transparent text-sm text-white placeholder-white/80 focus:outline-0"
      />
      {disabled ? (
        <button
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
          type="submit"
          className="group flex shrink-0 items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-400 px-4 py-3 text-sm font-medium text-gray-900"
        >
          <FaEthereum className="" />
        </button>
      ) : (
        <button
          disabled={disabled}
          onClick={(e) => e.stopPropagation()}
          type="submit"
          className="group flex shrink-0 items-center gap-1.5 bg-gradient-to-br from-gray-50 to-gray-400 px-4 py-3 text-sm font-medium text-gray-900 transition-transfor  m active:scale-[0.985]"
        >
          <span>max</span>
          <FaEthereum className="-mr-4 opacity-0 transition-all group-hover:-mr-0 group-hover:opacity-100 group-active:-rotate-45" />
        </button>
      )}
    </form>
  );
};

export default BasicInput;
