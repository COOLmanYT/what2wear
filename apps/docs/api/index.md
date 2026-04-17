# API Overview

Sky Style exposes a versioned REST API for external developers. All endpoints are under the `v1` base path.

## Base URL

```
https://skystyle.app/api/v1
```

## Available Endpoints

| Method | Path | Description | Credits |
|--------|------|-------------|---------|
| `POST` | [`/recommend`](./recommend) | AI outfit recommendation | 2 |
| `POST` | [`/recweather`](./recweather) | Recommendation + full weather in one call | 3 |
| `GET`  | [`/weather`](./weather) | Raw weather data for coordinates | 1 |
| `GET`  | [`/closet`](./closet) | Your saved closet items | 1 |

## Authentication

All requests require an API key as a Bearer token. See the [Authentication guide](./authentication) for setup instructions.

```http
Authorization: Bearer sk_live_YOUR_API_KEY
```

## Response format

All responses are `application/json`. Error responses always include a top-level `error` field:

```json
{ "error": "lat must be a number between -90 and 90, and lon between -180 and 180." }
```

See the full [Error Reference](./errors) for status codes.
