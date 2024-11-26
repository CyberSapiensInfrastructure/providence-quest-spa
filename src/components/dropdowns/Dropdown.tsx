import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

interface DropdownProps {
  buttonLabel: string;
  items: DropdownItem[];
  onSelect: (code: string) => void;
  buttonClass?: string;
  itemClass?: string;
  menuClass?: string;
}

interface DropdownItem {
  label: string;
  code: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  buttonLabel,
  items,
  onSelect,
  buttonClass = "",
  itemClass = "",
  menuClass = "",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`flex items-center px-4 py-[5px] text-sm md:text-lg h-full text-white transition-colors ${buttonClass}`}
        >
          <span className="font-medium text-sm">{buttonLabel}</span>
          <motion.span variants={iconVariants}>
            <FiChevronDown />
          </motion.span>
        </button>
        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-50%" }}
          className={`flex flex-col gap-1 px-5 absolute top-[120%] left-[50%] overflow-hidden text-white ${menuClass}`}
        >
          {items.map(({ label, code }) => (
            <DropdownOption
              key={code}
              text={label}
              code={code}
              setOpen={setOpen}
              onSelect={onSelect}
              itemClass={itemClass}
            />
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
};

interface DropdownOptionProps {
  text: string;
  code: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (code: string) => void;
  itemClass: string;
}

const DropdownOption: React.FC<DropdownOptionProps> = ({
  text,
  code,
  setOpen,
  onSelect,
  itemClass,
}) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => {
        setOpen(false);
        onSelect(code);
      }}
      className={`flex items-center gap-2 p-2 text-xs font-medium whitespace-nowrap hover:bg-indigo-100 hover:text-black transition-colors cursor-pointer ${itemClass}`}
    >
      <span>{text}</span>
    </motion.li>
  );
};

export default Dropdown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};
