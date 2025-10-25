import "./hero.css";
import Logo from "@/main/components/ui/logo";
import { cn } from "@/main/shadcn/lib/utils";

export const Hero = () => {
  const css = {
    pHero: "text-6xl lg:text-7xl font-light text-white text-center",
    pHeroSub: "text-xl font-light text-white mt-8 max-w-2xl text-center",
  };
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-20 px-5 lg:p-0">
        <p className={css.pHero}>The New Standard</p>
        <p className={css.pHero}>For Investment</p>
        <p className={css.pHeroSub}>
          Hopium is a decentralized exchange that turns markets into living, breathing portfolios — on-chain dETFs (decentralized ETFs).
        </p>
      </div>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-bg z-10" />

      <div className="absolute inset-0 w-full h-full">
        <div id="container" className={cn("bg-gradient-to-tr from-indigo-500 to-indigo-600")}>
          <div id="container-inside">
            <Logo id="logo-small" className="absolute-centered" color="#000" variant="fill" />
            <Logo id="logo-medium" className="absolute-centered" color="#000" variant="fill" />
            <Logo id="logo-large" className="absolute-centered" color="#000" variant="fill" />
            <Logo id="logo-xlarge" className="absolute-centered" color="#000" variant="fill" />
            <Logo id="logo-xxlarge" className="absolute-centered" color="#000" variant="fill" />
          </div>
        </div>
      </div>
    </div>
  );
};
