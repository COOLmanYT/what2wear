export const dynamic = "force-dynamic";

/**
 * POST /api/v1/recommend
 *
 * Public API endpoint for outfit recommendations, authenticated via API key.
 *
 * Authentication:
 *   Authorization: Bearer sk_live_<token>
 *
 * Request body (JSON):
 *   lat           number  required  Latitude  (-90 to 90)
 *   lon           number  required  Longitude (-180 to 180)
 *   unit          string  optional  "metric" (default) | "imperial"
 *   gender        string  optional  Gender context for recommendations (max 30 chars)
 *
 * Response (200):
 *   outfit        string  Outfit recommendation text
 *   reasoning     string  Explanation linking weather to choices
 *   weather       object  Key weather conditions used for the recommendation
 *   model         string  AI model used
 *   generated_at  string  ISO-8601 UTC timestamp
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyApiKey } from "@/lib/api-keys";
import { getWeather } from "@/lib/weather";
import { getStyleRecommendation } from "@/lib/ai";
import { canUseFeature, incrementUsage } from "@/lib/daily-usage";
import { getCredits, deductCredit } from "@/lib/credits";

const API_KEY_PREFIX = "sk_live_";
// key_preview is "sk_live_" (8 chars) + 4 chars = 12 chars total
const KEY_PREVIEW_LENGTH = 12;

function extractBearerToken(req: NextRequest): string | null {
  // Support both "Authorization" and "Authorisation" (British spelling)
  const header =
    req.headers.get("authorization") ?? req.headers.get("authorisation") ?? "";
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  return match?.[1] ?? null;
}

/** Verify the API key and return the associated user_id, or null if invalid. */
async function resolveApiKeyUser(apiKey: string): Promise<string | null> {
  if (!apiKey.startsWith(API_KEY_PREFIX)) return null;

  const preview = apiKey.slice(0, KEY_PREVIEW_LENGTH);

  // Narrow candidates by preview before doing the expensive scrypt verify
  const { data: candidates } = await supabaseAdmin
    .from("api_keys")
    .select("user_id, key_hash")
    .eq("key_preview", preview)
    .eq("revoked", false);

  if (!candidates?.length) return null;

  for (const row of candidates) {
    if (verifyApiKey(apiKey, row.key_hash as string)) {
      return row.user_id as string;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  // 1. Extract and verify API key
  const rawToken = extractBearerToken(req);
  if (!rawToken) {
    return NextResponse.json(
      { error: "Missing or malformed Authorization header. Use: Authorization: Bearer <api_key>" },
      { status: 401 }
    );
  }

  const userId = await resolveApiKeyUser(rawToken);
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid or revoked API key." },
      { status: 401 }
    );
  }

  // 2. Parse and validate request body
  let body: { lat?: unknown; lon?: unknown; unit?: unknown; gender?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { lat, lon } = body;
  if (
    typeof lat !== "number" || typeof lon !== "number" ||
    lat < -90 || lat > 90 || lon < -180 || lon > 180
  ) {
    return NextResponse.json(
      { error: "lat must be a number between -90 and 90, and lon between -180 and 180." },
      { status: 400 }
    );
  }

  const unit: "metric" | "imperial" =
    body.unit === "imperial" ? "imperial" : "metric";

  const gender =
    typeof body.gender === "string" && body.gender.trim()
      ? body.gender.trim().slice(0, 30)
      : undefined;

  // 3. Load user profile for rate-limit tier
  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("is_pro, is_dev")
    .eq("id", userId)
    .single();

  const isPro = profile?.is_pro ?? false;
  const isDev = profile?.is_dev ?? false;

  // 4. Rate-limit check
  if (!isDev) {
    if (isPro) {
      const balance = await getCredits(userId);
      if (balance <= 0) {
        return NextResponse.json(
          { error: "Insufficient credits. Your weekly credits reset in a few days." },
          { status: 402 }
        );
      }
    } else {
      const { allowed, used, limit } = await canUseFeature(userId, "ai_uses", isPro, isDev);
      if (!allowed) {
        return NextResponse.json(
          { error: `Daily AI limit reached (${used}/${limit}). Upgrade to Pro for more.` },
          { status: 429 }
        );
      }
    }
  }

  // 5. Fetch weather
  let weather;
  try {
    weather = await getWeather(lat, lon);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Weather fetch failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // 6. Get AI recommendation
  let recommendation;
  try {
    recommendation = await getStyleRecommendation({
      weather,
      closetItems: [],
      unitPreference: unit,
      gender,
      shareLocation: false,
      forceCloset: false,
      isDev,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // 7. Deduct credit / increment daily usage
  if (!isDev) {
    if (isPro) {
      await deductCredit(userId);
    } else {
      await incrementUsage(userId, "ai_uses", isPro, isDev);
    }
  }

  // 8. Return clean public response
  return NextResponse.json({
    outfit: recommendation.outfit,
    reasoning: recommendation.reasoning,
    weather: {
      temp_c: weather.temp,
      feels_like_c: weather.feelsLike,
      humidity_pct: weather.humidity,
      wind_kmh: weather.windSpeed,
      wind_dir: weather.windDir,
      description: weather.description,
      rain_chance_pct: weather.rainChance,
      uv_index: weather.uvIndex,
      is_day: weather.isDay,
      alerts: weather.alerts,
    },
    model: recommendation.modelUsed ?? "unknown",
    generated_at: new Date().toISOString(),
  });
}
