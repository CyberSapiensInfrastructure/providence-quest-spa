import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";
import i18n from "../../i18";
import { LANGUAGES } from "../../constants";
const LanguageSelector: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <motion.div animate={open ? "open" : "closed"} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center px-4 py-[5px] text-sm md:text-lg h-full  text-white  transition-colors"
        >
          <span className="font-medium text-sm">{i18n.language}</span>
          <motion.span variants={iconVariants}>
            <FiChevronDown />
          </motion.span>
        </button>
        <motion.ul
          initial={wrapperVariants.closed}
          variants={wrapperVariants}
          style={{ originY: "top", translateX: "-50%" }}
          className="flex flex-col gap-1 px-5 absolute top-[120%] left-[70%]  overflow-hidden text-white"
        >
          {LANGUAGES.map(({ label, code }) => (
            <Option key={code} setOpen={setOpen} text={label} code={code} />
          ))}
        </motion.ul>
      </motion.div>
    </div>
  );
};

interface OptionProps {
  text: string;
  code: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Option: React.FC<OptionProps> = ({ text, code, setOpen }) => {
  const onChangeLang = (lang_code: string) => {
    i18n.changeLanguage(lang_code);
  };

  return (
    <motion.li
      variants={itemVariants}
      onClick={() => {
        setOpen(false);
        onChangeLang(code);
      }}
      className="flex items-center gap-2  p-2 text-xs font-medium whitespace-nowrap  hover:bg-indigo-100 text-white hover:text-black transition-colors cursor-pointer"
    >
      <span>{text}</span>
    </motion.li>
  );
};

export default LanguageSelector;

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
