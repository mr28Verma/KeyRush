"use client";

import DarkVeil from "./DarkVeil";

const Background = () => {
  return (
    <div className="fixed inset-0 z-0">
      <DarkVeil />

      {/* Vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_85%)]" />
    </div>
  );
};

export default Background;