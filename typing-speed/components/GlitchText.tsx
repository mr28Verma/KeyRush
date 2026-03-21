"use client";

import React from "react";

type GlitchTextProps = {
  text: string;
  className?: string;
};

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = "",
}) => {
  return (
    <div className={`glitch relative ${className}`} data-text={text}>
      <span>{text}</span>
    </div>
  );
};

export default GlitchText;