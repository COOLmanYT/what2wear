"use client";

import { useState } from "react";
import Link from "next/link";

const MAX_GENDER_LENGTH = 30;

function isGenderActive(option: string, gender: string): boolean {
  return (option === "Other" && gender === "N/A") || gender === option;
}

function getLocalStorage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

interface SettingsClientProps {
  initialUnitPreference: "metric" | "imperial";
}

export default function SettingsClient({ initialUnitPreference }: SettingsClientProps) {
  const [gender, setGender] = useState<string>(() => getLocalStorage("skystyle_gender", "N/A"));
  const [customGender, setCustomGender] = useState(() => getLocalStorage("skystyle_custom_gender", ""));
  const [unitPreference, setUnitPreference] = useState<"metric" | "imperial">(initialUnitPreference);
  const [shareLocation, setShareLocation] = useState(() => getLocalStorage("skystyle_location_consent", "false") === "true");
  const [weatherOnly, setWeatherOnly] = useState(() => getLocalStorage("skystyle_weather_only", "false") === "true");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function saveToLocalStorage() {
    try {
      localStorage.setItem("skystyle_gender", gender);
      localStorage.setItem("skystyle_custom_gender", customGender);
      localStorage.setItem("skystyle_location_consent", String(shareLocation));
      localStorage.setItem("skystyle_weather_only", String(weatherOnly));
    } catch { /* ignore */ }
  }

  async function handleSave() {
    saveToLocalStorage();
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unit_preference: unitPreference }),
      });
    } catch { /* ignore */ }
    setSavedMessage("Settings saved!");
    setTimeout(() => setSavedMessage(null), 2500);
  }

  async function handleUnitChange(unit: "metric" | "imperial") {
    setUnitPreference(unit);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Navigation */}
      <nav
        className="sticky-nav px-4 py-3"
        style={{ borderBottom: "1px solid var(--card-border)" }}
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm btn-interact rounded-xl px-3 py-2"
              style={{ color: "var(--foreground)", opacity: 0.6 }}
            >
              ← Dashboard
            </Link>
            <span className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
              ⚙️ Settings
            </span>
          </div>
          <button
            onClick={handleSave}
            className="rounded-xl px-4 py-2 text-sm font-medium btn-interact"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Save
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {savedMessage && (
          <div
            className="rounded-2xl p-4 text-sm text-center font-medium"
            style={{
              background: "#34c75915",
              border: "1px solid #34c75940",
              color: "#34c759",
            }}
          >
            ✅ {savedMessage}
          </div>
        )}

        {/* Gender */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            Gender (for outfit recommendations)
          </p>
          <div className="flex flex-wrap gap-2">
            {["Male", "Female", "Other", "Other - Manual"].map((opt) => (
              <button
                key={opt}
                onClick={() => setGender(opt === "Other" ? "N/A" : opt)}
                className="rounded-xl px-3 py-1.5 text-xs font-medium btn-interact"
                style={{
                  background: isGenderActive(opt, gender)
                    ? "var(--accent)"
                    : "var(--background)",
                  color: isGenderActive(opt, gender)
                    ? "#fff"
                    : "var(--foreground)",
                  border: "1px solid var(--card-border)",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {gender === "Other - Manual" && (
            <input
              type="text"
              value={customGender}
              onChange={(e) => setCustomGender(e.target.value.slice(0, MAX_GENDER_LENGTH))}
              placeholder={`Type your gender (max ${MAX_GENDER_LENGTH} chars)`}
              maxLength={MAX_GENDER_LENGTH}
              className="mt-2 w-full rounded-xl px-3 py-2 text-xs outline-none"
              style={{
                background: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--card-border)",
              }}
            />
          )}
        </div>

        {/* Units */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            Units
          </p>
          <div className="flex gap-2">
            {(["metric", "imperial"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => handleUnitChange(unit)}
                className="rounded-xl px-3 py-1.5 text-xs font-medium btn-interact capitalize"
                style={{
                  background: unitPreference === unit ? "var(--accent)" : "var(--background)",
                  color: unitPreference === unit ? "#fff" : "var(--foreground)",
                  border: "1px solid var(--card-border)",
                }}
              >
                {unit === "metric" ? "°C / km/h" : "°F / mph"}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{
            background: "var(--card)",
            border: "1px solid var(--card-border)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            Preferences
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shareLocation}
              onChange={(e) => setShareLocation(e.target.checked)}
              className="rounded"
            />
            <span
              className="text-xs"
              style={{ color: "var(--foreground)", opacity: 0.6 }}
            >
              Share my location with AI for more relevant recommendations
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={weatherOnly}
              onChange={(e) => setWeatherOnly(e.target.checked)}
              className="rounded"
            />
            <span
              className="text-xs"
              style={{ color: "var(--foreground)", opacity: 0.6 }}
            >
              Weather only (skip AI outfit recommendation)
            </span>
          </label>
        </div>

        <p
          className="text-xs text-center"
          style={{ color: "var(--foreground)", opacity: 0.4 }}
        >
          These settings apply to your outfit recommendations on the dashboard.
        </p>
      </div>
    </div>
  );
}
