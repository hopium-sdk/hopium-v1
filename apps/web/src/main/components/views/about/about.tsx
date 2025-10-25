import { Hero } from "./components/hero/hero";
import { Stack } from "./components/stack/stack";
import { Detf } from "./components/detf/detf";

export const About = () => {
  return (
    <div className="flex flex-1 flex-col bg-bg overflow-y-auto">
      <div className="h-fit flex flex-1 flex-col">
        <div className="w-full h-full">
          <Hero />
        </div>
        <Detf />
        <Stack />
      </div>
    </div>
  );
};
