"use client";
import Logo from "@/main/components/ui/logo";
import "./coin.css";
import { cn } from "@/main/shadcn/lib/utils";
import { useEffect, useRef, useState } from "react";

export const Coin = ({
  colorFrom,
  colorTo,
  spin = true,
  float = false,
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
  logoVariant = "fill",
}: {
  colorFrom?: string;
  colorTo?: string;
  spin?: boolean;
  float?: boolean;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  logoVariant?: "fill" | "outline";
}) => {
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
  }, [coinContainerRef.current]);

  const params = {
    size: size ?? 200,
    thickness: size ? size / 10 : 20,
    spin,
    float,
    spinSpeed: 5,
    segments: 16,
    faceFrom: colorFrom ?? "var(--rewards)",
    faceTo: colorTo ?? "var(--rewards-600)",
    edgeColor: colorFrom ?? "var(--rewards)",
    rotationX,
    rotationY,
    rotationZ,
  };

  const step = 180 / params.segments;
  const angles = Array.from({ length: params.segments }, (_, i) => step * (i + 1));

  const style = {
    ["--coin-size"]: `${params.size}px`,
    ["--coin-thickness"]: `${params.thickness}px`,
    ["--coin-half"]: `${params.size / 2}px`,
    ["--spoke-width"]: `${params.size / 10}px`,
    ["--spoke-height"]: `${params.size / 9}px`,
    ["--face-z"]: `${params.thickness / 2}px`,
    ["--side-translate-x"]: `0px`,
    ["--face-from"]: params.faceFrom,
    ["--face-to"]: params.faceTo,
    ["--edge-color"]: params.edgeColor,
    ["--spin-duration"]: `${params.spinSpeed}s`,
    // param-driven orientation
    ["--rotation-x"]: `${rotationX}deg`,
    ["--rotation-y"]: `${rotationY}deg`,
    ["--rotation-z"]: `${rotationZ}deg`,
  } as React.CSSProperties;

  return (
    <div className="w-full h-full flex flex-1 items-center justify-center overflow-hidden" ref={coinContainerRef}>
      {size && size > 0 && (
        <div className={cn("coin-root")} style={style} role="img" aria-label="Spinning coin">
          <div className="purse">
            {/* NEW: the rotator applies the param-based rotation */}
            <div className="coin-rotator">
              <div className={cn("coin", params.spin && "spincoin", params.float && "floatcoin")}>
                <div className="front face" style={{ transform: `translateZ(var(--face-z))` }}>
                  <CoinFace variant={logoVariant} />
                </div>
                <div className="back face" style={{ transform: `translateZ(calc(var(--face-z) * -1)) rotateY(180deg)` }}>
                  <CoinFace variant={logoVariant} />
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
        </div>
      )}
    </div>
  );
};

const CoinFace = ({ variant = "fill" }: { variant?: "fill" | "outline" }) => {
  return <Logo className="coin-icon w-[50%] h-[50%]" color="#fff" variant={variant} />;
};
