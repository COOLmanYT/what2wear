"use client";

type WeatherCondition = "rain" | "snow" | "sunny" | "default";

/** Classify a weather description string into a visual condition. */
export function getWeatherCondition(description: string): WeatherCondition {
  const d = description.toLowerCase();
  if (d.includes("snow") || d.includes("sleet") || d.includes("blizzard") || d.includes("ice"))
    return "snow";
  if (
    d.includes("rain") ||
    d.includes("drizzle") ||
    d.includes("shower") ||
    d.includes("thunder") ||
    d.includes("storm")
  )
    return "rain";
  if (
    d.includes("sunny") ||
    d.includes("clear")
  )
    return "sunny";
  return "default";
}

/** Deterministic pseudo-random from seed (0-1 range), using a simple LCG hash. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49999;
  return x - Math.floor(x);
}

function buildParticles(condition: WeatherCondition) {
  if (condition === "default") return null;

  const count = condition === "rain" ? 18 : condition === "snow" ? 14 : 6;
  return Array.from({ length: count }, (_, i) => {
    const r1 = seededRandom(i + 1);
    const r2 = seededRandom(i + 100);
    const r3 = seededRandom(i + 200);
    const left = `${(i / count) * 100 + r1 * (100 / count)}%`;
    const delay = `${(r2 * 2).toFixed(1)}s`;
    const duration =
      condition === "rain"
        ? `${0.5 + r3 * 0.4}s`
        : condition === "snow"
          ? `${3 + r3 * 2}s`
          : `${2 + r3 * 1}s`;
    return { left, delay, duration, key: i };
  });
}

interface WeatherEffectCardProps {
  condition: WeatherCondition;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** A card wrapper that renders subtle animated weather effects on its background. */
export default function WeatherEffectCard({
  condition,
  children,
  className = "",
  style,
}: WeatherEffectCardProps) {
  const particles = buildParticles(condition);

  const overlayClass =
    condition === "rain"
      ? "weather-overlay-rain"
      : condition === "snow"
        ? "weather-overlay-snow"
        : condition === "sunny"
          ? "weather-overlay-sunny"
          : "";

  return (
    <div className={`${className} weather-card weather-card-${condition}`} style={{ ...style, position: "relative", overflow: "hidden" }}>
      {/* Tinted background overlay */}
      {condition !== "default" && <div className={`weather-tint weather-tint-${condition}`} />}

      {/* Animated particles */}
      {particles && (
        <div className={`weather-particles ${overlayClass}`}>
          {particles.map((p) => (
            <span
              key={p.key}
              className="weather-particle"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* Card content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
