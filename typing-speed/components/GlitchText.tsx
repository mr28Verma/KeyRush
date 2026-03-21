"use client";

import React from "react";

const GlitchText = ({ text, className = "" }) => {
  return (
    <div className={`glitch relative ${className}`} data-text={text}>
      <span>{text}</span>
    </div>
  );
};

export default GlitchText;