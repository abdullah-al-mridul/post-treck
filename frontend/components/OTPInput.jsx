"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function OTPInput({ value = "", onChange, length = 6 }) {
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // Prevent default backspace behavior
      const newOTP = value.split("");
      newOTP[index] = "";
      onChange(newOTP.join(""));

      // Move to previous input if current is empty
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleChange = (e, index) => {
    const newValue = e.target.value;
    if (newValue.match(/^[0-9]$/)) {
      const newOTP = value.split("");
      newOTP[index] = newValue;
      onChange(newOTP.join(""));

      // Move to next input
      if (index < length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (pastedData.match(/^[0-9]+$/)) {
      onChange(pastedData);
      // Focus last input after paste
      inputRefs.current[Math.min(pastedData.length, length) - 1]?.focus();
    }
  };

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex gap-2 sm:gap-4 justify-center px-4">
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-10 h-14 sm:w-12 sm:h-16 text-xl sm:text-2xl font-mono text-center border-2 border-black dark:border-white 
              bg-transparent dark:text-white outline-none rounded-lg
              focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] 
              transition-all duration-200"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black dark:bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform" />
          </motion.div>
        ))}
    </div>
  );
}
