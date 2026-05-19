import "./index.css";
import { Composition } from "remotion";
import { SovereignIntro } from "./SovereignIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SovereignIntro"
        component={SovereignIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
