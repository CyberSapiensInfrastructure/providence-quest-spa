import { useSelector } from "react-redux";
import { motion, Variants } from "framer-motion";

import { RootState } from "../app/store";

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
} as Variants;

const ShuffleLoader = () => {
  const open = useSelector((state: RootState) => state.loader.open);
  return open ? (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-90 z-[999] text-inherit">
      <motion.div
        transition={{
          staggerChildren: 0.25,
        }}
        initial="initial"
        animate="animate"
        className="flex gap-1"
      >
        <motion.div variants={variants} className="h-12 w-2 bg-white" />
        <motion.div variants={variants} className="h-12 w-2 bg-white" />
        <motion.div variants={variants} className="h-12 w-2 bg-white" />
        <motion.div variants={variants} className="h-12 w-2 bg-white" />
        <motion.div variants={variants} className="h-12 w-2 bg-white" />
      </motion.div>
    </div>
  ) : null;
};

export default ShuffleLoader;
