"use client";

import { forwardRef, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef: any) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      }
    };

    const handleMouseMove = (e: MouseEvent) =>
      updatePosition(e.clientX, e.clientY);

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef<any, any>((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 100,
    falloff = "linear",
    className = "",
    style = {}
  } = props;

  const letterRefs = useRef<any[]>([]);
  const mousePositionRef = useMousePositionRef(containerRef);

  const parsedSettings = useMemo(() => {
    const parse = (str: string) =>
      new Map(
        str.split(",").map(s => {
          const [axis, val] = s.trim().split(" ");
          return [axis.replace(/['"]/g, ""), parseFloat(val)];
        })
      );

    const from = parse(fromFontVariationSettings);
    const to = parse(toFontVariationSettings);

    return Array.from(from.entries()).map(([axis, fromVal]) => ({
      axis,
      fromVal,
      toVal: to.get(axis) ?? fromVal
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  useAnimationFrame(() => {
    if (!containerRef?.current) return;

    letterRefs.current.forEach((el) => {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const dx = mousePositionRef.current.x - (rect.left + rect.width / 2);
      const dy = mousePositionRef.current.y - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      const strength = Math.max(0, 1 - dist / radius);

      const settings = parsedSettings
        .map(({ axis, fromVal, toVal }) => {
          const val = fromVal + (toVal - fromVal) * strength;
          return `'${axis}' ${val}`;
        })
        .join(", ");

      el.style.fontVariationSettings = settings;
    });
  });

  const words = label.split(" ");
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`variable-proximity ${className}`}
      style={{ display: "inline", ...style }}
    >
      {words.map((word: string, wordIndex: number) => (
        <span key={wordIndex} style={{ whiteSpace: "nowrap" }}>
          {word.split("").map((letter: string) => {
            const index = letterIndex++;
            return (
              <motion.span
                key={index}
                ref={(el) => (letterRefs.current[index] = el)}
                style={{ display: "inline-block" }}
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
});

VariableProximity.displayName = "VariableProximity";
export default VariableProximity;