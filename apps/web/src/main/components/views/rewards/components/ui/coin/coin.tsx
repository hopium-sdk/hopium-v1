"use client";
import Logo from "@/main/components/ui/logo";
import "./coin.css";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";
import { useEffect, useRef, useState } from "react";

export const Coin = () => {
  const coinContainerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    if (coinContainerRef.current) {
      const width = coinContainerRef.current.clientWidth;
      const height = coinContainerRef.current.clientHeight;
      const newSize = Math.min(width, height);

      console.log("newSize", newSize);
      setSize(newSize);
    }
  }, [coinContainerRef]);

  const params = {
    size: size ?? 200,
    thickness: size ? size / 10 : 20,
    spin: true,
    float: false,
    spinSpeed: 5,
    segments: 16,
    faceFrom: "var(--rewards)",
    faceTo: "var(--rewards-600)",
    edgeColor: "var(--rewards)",
  };

  const step = 180 / params.segments;

  const angles = Array.from({ length: params.segments }, (_, i) => step * (i + 1));

  const style = {
    ["--coin-size"]: `${params.size}px`,
    ["--coin-thickness"]: `${params.thickness}px`,
    ["--coin-half"]: `${params.size / 2}px`,
    ["--spoke-width"]: `${params.size / 10}px`,
    ["--spoke-height"]: `${params.size / 9}px`,
    ["--face-z"]: `${params.thickness / 1.9}px`,
    ["--side-translate-x"]: `${0}px`,
    ["--face-from"]: params.faceFrom,
    ["--face-to"]: params.faceTo,
    ["--edge-color"]: params.edgeColor,
    ["--spin-duration"]: `${params.spinSpeed}s`,
  } as React.CSSProperties;

  return (
    <div className="w-full h-full flex flex-1 items-center justify-center overflow-hidden" ref={coinContainerRef}>
      {size && size > 0 && (
        <div className={cn("coin-root")} style={style} role="img">
          <div className={cn("purse")}>
            <div className={cn("coin", params.spin && "spincoin", params.float && "floatcoin")}>
              <div className="front face" style={{ transform: `translateZ(var(--face-z))` }}>
                <CoinFace />
              </div>
              <div className="back face" style={{ transform: `translateZ(calc(var(--face-z) * -1)) rotateY(180deg)` }}>
                <CoinFace />
              </div>
              <div className="side" style={{ transform: `translateX(var(--side-translate-x))` }}>
                {angles.map((deg, ind) => (
                  <div
                    key={ind}
                    className="spoke"
                    style={{
                      width: "var(--spoke-width)",
                      height: "var(--coin-size)",
                      transform: `rotateY(90deg) rotateX(${deg}deg)`,
                      backgroundColor: "var(--edge-color)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CoinFace = () => {
  return <Logo className="coin-icon w-[50%] h-[50%]" color="#fff" variant="outline" />;
};
