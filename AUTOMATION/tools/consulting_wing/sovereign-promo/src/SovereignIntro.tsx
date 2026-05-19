import { AbsoluteFill, interpolate, useCurrentFrame, staticFile } from "remotion";

const BG = "#080808";

export const SovereignIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in: 0 → 30 frames
  const heartOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slow breathe zoom: 1.0 → 1.08 over 150 frames
  const heartScale = interpolate(frame, [0, 150], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill
        style={{
          opacity: heartOpacity,
          transform: `scale(${heartScale})`,
          transformOrigin: "center center",
        }}
      >
        <AbsoluteFill
          style={{
            backgroundImage: `url(${staticFile("assets/heart.jpg")})`,
            backgroundSize: "contain",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            WebkitMaskImage: "radial-gradient(circle, black 35%, transparent 72%)",
            maskImage: "radial-gradient(circle, black 35%, transparent 72%)",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
