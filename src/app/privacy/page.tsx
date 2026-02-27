import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Sky Style",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-16 max-w-2xl mx-auto" style={{ background: "var(--background)" }}>
      <Link href="/" className="text-sm mb-8 inline-block hover:opacity-70" style={{ color: "var(--accent)" }}>
        ← Back to Sky Style
      </Link>

      <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        Privacy Policy
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--foreground)", opacity: 0.5 }}>
        Last updated: February 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.8 }}>
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>Our philosophy</h2>
          <p>
            We follow{" "}
            <a
              href="https://github.com/COOLmanYT/people-first-design"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--accent)" }}
            >
              People First Design
            </a>{" "}
            principles. We collect only the minimum data required for Sky Style to work. If we
            do not need it, we do not collect it. This policy is written in plain language, not
            legal jargon.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Account info</strong> — your name, email, and profile image from your
              GitHub or Google account. This is needed for authentication.
            </li>
            <li>
              <strong>Location</strong> — the coordinates you provide (GPS or typed) are sent to
              weather APIs to fetch weather data. We do not store your location history.
            </li>
            <li>
              <strong>Closet items</strong> — clothing descriptions you choose to add. Stored so
              the AI can make personalised recommendations.
            </li>
            <li>
              <strong>Settings</strong> — your unit preference, custom prompts, and custom weather
              source URLs if you set them.
            </li>
            <li>
              <strong>Usage counts</strong> — daily counters for rate limiting (AI uses,
              follow-ups, closet uses, source picks). No content is stored.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>What we do NOT collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do not track you across other websites.</li>
            <li>We do not sell your data to anyone.</li>
            <li>We do not use advertising trackers.</li>
            <li>We do not store your AI API keys (Bring Your Own Key is session-only).</li>
            <li>We do not store your location history or weather requests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>Third-party services</h2>
          <p>We use the following external services:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>
              <strong>Supabase</strong> — database hosting. Your account and settings data is
              stored here.
            </li>
            <li>
              <strong>OpenAI / Google Gemini</strong> — AI outfit recommendations. Your weather
              data and closet items are sent to the AI for each request. No data is retained by
              these providers beyond their standard API usage policies.
            </li>
            <li>
              <strong>OpenWeatherMap, Open-Meteo, Bureau of Meteorology</strong> — weather data
              providers. Only your coordinates are sent to these services.
            </li>
            <li>
              <strong>OpenStreetMap Nominatim</strong> — geocoding (converting city names to
              coordinates).
            </li>
            <li>
              <strong>Vercel</strong> — hosting and analytics. Vercel Analytics collects
              anonymous, aggregated page view data with no cookies.
            </li>
            <li>
              <strong>GitHub / Google OAuth</strong> — authentication providers. We only receive
              basic profile info that you authorise.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>Data retention</h2>
          <p>
            Your account data and settings are kept as long as your account exists. Daily usage
            counters are kept for rate limiting and are not linked to specific requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>Your rights</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You can request a copy of all data we hold about you.</li>
            <li>You can request deletion of your account and all associated data.</li>
            <li>
              To make a request, open an issue on{" "}
              <a
                href="https://github.com/COOLmanYT/what2wear/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--accent)" }}
              >
                GitHub
              </a>{" "}
              or contact us directly.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>Cookies</h2>
          <p>
            We use a single session cookie for authentication (managed by NextAuth). We do not
            use tracking cookies, advertising cookies, or any third-party cookie services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>Children</h2>
          <p>
            Sky Style is not directed at children under 13. We do not knowingly collect data from
            children. If you believe a child has provided us with personal data, please contact
            us so we can delete it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>Changes</h2>
          <p>
            If we change this policy, we will update this page and the date above. For material
            changes, we will notify users through the dashboard.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ opacity: 1 }}>Open source</h2>
          <p>
            This entire application, including how we handle data, is open source at{" "}
            <a
              href="https://github.com/COOLmanYT/what2wear"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--accent)" }}
            >
              github.com/COOLmanYT/what2wear
            </a>
            . You can verify everything we&apos;ve stated here by reading the code.
          </p>
        </section>
      </div>
    </div>
  );
}
