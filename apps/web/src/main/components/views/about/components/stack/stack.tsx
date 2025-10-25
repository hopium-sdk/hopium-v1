import "./stack.css";
import { Vault } from "./components/vault/vault";
import { Coin } from "../../../../ui/graphics/coin/coin";

export const Stack = () => {
  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-center pb-40">
      <div className="pt-20 pb-14 px-5 lg:px-0">
        <p className="text-center text-3xl">
          dETFs are <span className="text-main">backed 1:1</span> by
          <br />
          underlying assets in vaults
        </p>
      </div>
      <div className="w-full h-[500px] flex flex-1 flex-col lg:flex-row items-center justify-center">
        <div className="w-1/2 h-full flex flex-col items-center justify-center pt-24">
          <p className="text-center text-lg">
            When you buy a <span className="text-main">dETF token</span> for $1,000...
          </p>
          <div className="w-[275px] aspect-square mt-16">
            <Coin colorFrom="var(--main)" colorTo="var(--main-600)" spin={false} rotationX={30} rotationY={0} rotationZ={0} logoVariant="outline" />
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center pt-30 lg:pt-0">
          <p className="text-center text-lg">
            ...the underlying assets worth $1,000 are deposited into <span className="text-main">its vault</span>
          </p>
          <Vault />
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full items-center justify-center hidden lg:flex">
        <div className="flex flex-col items-center justify-center pt-60">
          {/* <Icons.ArrowLeftRight className="size-10 text-subtext" /> */}
          <p className="text-center text-4xl mt-4">{`<  >`}</p>
          <p className="text-center text-sm text-subtext mt-4">
            $1,000 worth of CRYPTO-3 <br />=<br /> $1,000 worth of BTC + ETH + SOL
          </p>
        </div>
      </div>
    </div>
  );
};
