import React, { useRef, MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FaLock } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { ethers } from "ethers";
const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;
interface CardProps {
  amount: any;
  status: Boolean;
  timestamp: string;
}
const TiltedCard: React.FC<CardProps> = ({ amount, status, timestamp }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x);
  const ySpring = useSpring(y);
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-60 w-72 bg-yellow-100/10"
    >
      {status && (
        <div className=" absolute bottom-0 left-0 w-full tracking-[10px] text-sm  overflow-hidden text-center bg-yellow-100/20">
          claimed
        </div>
      )}
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-[20px] shadow-xl text-sm  z-0"
      >
        <div className="h-full w-full text-left flex flex-col gap-3 p-3">
          {status ? (
            <FaUnlock
              style={{
                transform: "translateZ(75px)",
              }}
              className="mx-auto text-4xl"
            />
          ) : (
            <FaLock
              style={{
                transform: "translateZ(75px)",
              }}
              className="mx-auto text-4xl"
            />
          )}

          <div className="text-[10px] text-center flex- items-center justify-center flex-col">
            <div>unlock time:</div>
            <div>{timestamp}</div>
          </div>
          <div className="text-[10px] text-center flex- items-center justify-center flex-col">
            <div>amount:</div>
            {/* {console.log(typeof amount)} */}

            <div>{ethers.utils.formatUnits(amount, 18)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TiltedCard;
