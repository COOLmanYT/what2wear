# Authentication

Every request to the Sky Style API must be authenticated with an API key passed as a Bearer token.

## Getting an API key

1. Log in to [skystyle.app](https://skystyle.app).
2. Navigate to **Dashboard → API**.
3. Click **Create new key**.
4. Copy the key immediately — it is shown **only once**.

API keys are prefixed with `sk_live_`.

## Sending the key

Include the key in the `Authorization` header of every request:

```
Authorization: Bearer sk_live_YOUR_API_KEY
```

### JavaScript (fetch)

```javascript
const response = await fetch("https://skystyle.app/api/v1/recommend", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ lat: 51.5074, lon: -0.1278 }),
});

const data = await response.json();
```

### curl

```bash
curl -X POST "https://skystyle.app/api/v1/recommend" \
  -H "Authorization: Bearer sk_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lat": 51.5074, "lon": -0.1278}'
```

## Security

::: warning Keep your key secret
Never expose your API key in client-side JavaScript, public repositories, or logs. If a key is compromised, revoke it immediately from the API Dashboard and generate a new one.
:::

## Error responses

| Status | Meaning |
|--------|---------|
| `401` | Key missing or malformed `Authorization` header. |
| `403` | Key has been revoked, or insufficient credits. |
| `429` | Rate limit exceeded (too many requests per minute). |
