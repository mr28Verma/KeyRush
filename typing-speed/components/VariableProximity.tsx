"use client";

import React, {
  forwardRef,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { motion } from "framer-motion";

/* ------------------ TYPES ------------------ */
type Props = {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.RefObject<HTMLElement>;
  radius?: number;
  falloff?: string;
  className?: string;
  style?: React.CSSProperties;
};

/* ------------------ ANIMATION FRAME ------------------ */
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

/* ------------------ MOUSE POSITION ------------------ */
function useMousePositionRef(containerRef: React.RefObject<HTMLElement>) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = {
          x: x - rect.left,
          y: y - rect.top,
        };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);

  return positionRef;
}

/* ------------------ COMPONENT ------------------ */
const VariableProximity = forwardRef<HTMLSpanElement, Props>(
  (props, ref) => {
    const {
      label,
      fromFontVariationSettings,
      toFontVariationSettings,
      containerRef,
      radius = 100,
      className = "",
      style = {},
    } = props;

    /* ✅ FIXED TYPE */
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const mousePositionRef = useMousePositionRef(containerRef);

    /* ------------------ PARSE FONT SETTINGS ------------------ */
    const parsedSettings = useMemo(() => {
      const parse = (str: string) =>
        new Map(
          str.split(",").map((s) => {
            const [axis, val] = s.trim().split(" ");
            return [
              axis.replace(/['"]/g, ""),
              parseFloat(val),
            ];
          })
        );

      const from = parse(fromFontVariationSettings);
      const to = parse(toFontVariationSettings);

      return Array.from(from.entries()).map(([axis, fromVal]) => ({
        axis,
        fromVal,
        toVal: to.get(axis) ?? fromVal,
      }));
    }, [fromFontVariationSettings, toFontVariationSettings]);

    /* ------------------ ANIMATION LOOP ------------------ */
    useAnimationFrame(() => {
      if (!containerRef?.current) return;

      letterRefs.current.forEach((el) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();

        const dx =
          mousePositionRef.current.x -
          (rect.left + rect.width / 2);

        const dy =
          mousePositionRef.current.y -
          (rect.top + rect.height / 2);

        const dist = Math.sqrt(dx * dx + dy * dy);

        const strength = Math.max(0, 1 - dist / radius);

        const settings = parsedSettings
          .map(({ axis, fromVal, toVal }) => {
            const val =
              fromVal + (toVal - fromVal) * strength;
            return `'${axis}' ${val}`;
          })
          .join(", ");

        el.style.fontVariationSettings = settings;
      });
    });

    /* ------------------ RENDER ------------------ */
    const words = label.split(" ");
    let letterIndex = 0;

    return (
      <span
        ref={ref}
        className={`variable-proximity ${className}`}
        style={{ display: "inline", ...style }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} style={{ whiteSpace: "nowrap" }}>
            {word.split("").map((letter) => {
              const index = letterIndex++;

              return (
                <motion.span
                  key={index}
                  ref={(el) => {
                    letterRefs.current[index] = el; // ✅ FIXED
                  }}
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
  }
);

VariableProximity.displayName = "VariableProximity";

export default VariableProximity;