import { Coin } from "@/main/components/ui/graphics/coin/coin";
import { Sphere } from "@/main/components/ui/graphics/sphere/sphere";
import { cn } from "@/main/shadcn/lib/utils";

export const Detf = () => {
  const css = {
    brackets: "text-[200px]",
  };
  return (
    <div className="w-full h-fit flex flex-col items-center justify-center pb-15">
      <div className="pt-30 pb-14">
        <p className="text-center text-3xl">What are dETFs?</p>
        <p className="text-center text-lg mt-4 max-w-2xl">
          A dETF is a decentralized token that represents <span className="text-main">a collection of tokens.</span> It lets people invest in multiple assets
          through a single token.
        </p>
      </div>
      <div className="flex items-center gap-2 pt-10">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg">A collection of tokens</p>
          <p className="text-md text-subtext mt-1">BTC - ETH - SOL</p>
          <div className="flex items-center gap-2">
            <p className={css.brackets}>{`{`}</p>
            <div className="pl-8 mb-12">
              <Coins />
            </div>
            <p className={css.brackets}>{`}`}</p>
          </div>
        </div>
        <p className={cn(css.brackets, "px-15")}>{`=`}</p>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg">A dETF token</p>
          <p className="text-md text-subtext mt-1">CRYPTO-3</p>
          <div className="w-[225px] aspect-square mt-8">
            <Coin colorFrom="var(--main)" colorTo="var(--main-600)" spin={false} rotationX={30} rotationY={0} rotationZ={0} logoVariant="outline" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Coins = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 rotate-5 float -translate-x-5 mt-12">
      <div className="translate-y-8 translate-x-6">
        <Sphere size={40} color="#ffcf3b" />
      </div>
      <div className="-translate-y-3 translate-x-6">
        <Sphere size={40} color="#ff5454" />
      </div>
      <div className="translate-y-10 translate-x-2">
        <Sphere size={40} color="#9affbe" />
      </div>
      <div className="-translate-y-6">
        <Sphere size={40} color="#aaff3b" />
      </div>
      <div className="translate-y-10 -translate-x-4">
        <Sphere size={40} color="#a53bff" />
      </div>
      <div className="translate-y-0 -translate-x-5">
        <Sphere size={40} color="#ff9a9a" />
      </div>
    </div>
  );
};
