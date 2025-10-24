import React from "react";
import "./cube.css";
import Logo from "../../logo";

export function Cube({ size = 200 }: { size?: number }) {
  return (
    <div className="cube-stage">
      <div className="cube-scene" style={{ ["--size"]: `${size}px` } as React.CSSProperties}>
        <div className="cube box">
          <div className="face front">
            <div className="flap flap-front" />
            <div className="w-[30%] h-[30%] translate-y-[10%]">
              <Logo variant="outline" color="#fff" />
            </div>
          </div>
          <div className="face back">
            <div className="flap flap-back" />
          </div>
          <div className="face right">
            <div className="flap flap-right" />
          </div>
          <div className="face left">
            <div className="flap flap-left" />
          </div>
          <div className="face bottom" />
        </div>
      </div>
    </div>
  );
}
