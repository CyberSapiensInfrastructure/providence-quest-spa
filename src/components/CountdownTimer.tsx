import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-[#7042f88b]/5 border border-[#7042f88b]/20 rounded-sm p-4">
      <div className="text-center space-y-4">
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          Quest Ends In
        </div>
        <div className="flex justify-center items-center gap-4">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Min" },
            { value: timeLeft.seconds, label: "Sec" },
          ].map((item, index) => (
            <React.Fragment key={item.label}>
              <div className="text-center">
                <div className="text-2xl font-light bg-gradient-to-r from-[#7042f88b] to-[#9f7aea] bg-clip-text text-transparent font-mono min-w-[2ch] inline-block">
                  {item.value.toString().padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40 mt-1">
                  {item.label}
                </div>
              </div>
              {index < 3 && (
                <div className="text-xl text-[#7042f88b] font-light">:</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
