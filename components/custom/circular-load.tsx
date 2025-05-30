"use client";
import React, { useEffect, useState } from "react";
import { AnimatedCircularProgressBar } from "../magicui/animated-circular-progress-bar";

function CircularLoad() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const handleIncrement = (prev: number) => {
      if (prev === 100) {
        return 0;
      }
      return prev + 10;
    };
    setValue(handleIncrement);
    const interval = setInterval(() => setValue(handleIncrement), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full h-screen absolute z-10 top-0 flex items-center justify-center bg-white">
      <AnimatedCircularProgressBar
        max={100}
        min={0}
        value={value}
        gaugePrimaryColor="rgb(79 70 229)"
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
      />
    </div>
  );
}

export default CircularLoad;
