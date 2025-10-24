import { Cube } from "../../../../../../ui/graphics/cube/cube";
import { Sphere } from "../../../../../../ui/graphics/sphere/sphere";

export const Vault = () => {
  return (
    <div className="mt-20 relative isolation-isolate">
      <div className="relative z-10">
        <Coins />
      </div>
      <div className="relative z-0">
        <Cube />
      </div>
    </div>
  );
};

const Coins = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 mb-10 rotate-5 float">
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
