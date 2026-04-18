# GET /closet

Returns the clothing items saved in the closet of the API key owner. No parameters required — the key is used to identify the associated user account.

**Endpoint:** `GET https://skystyle.app/api/v1/closet`  
**Credit cost:** 1 per request

## Request

### Headers

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer sk_live_YOUR_API_KEY` |

No query parameters or request body needed.

## Response (200)

| Field | Type | Description |
|-------|------|-------------|
| `items` | `string[]` | Array of clothing item descriptions from the user's closet. |
| `count` | `number` | Total number of items. |

## Examples

### JavaScript (fetch)

```javascript
const response = await fetch("https://skystyle.app/api/v1/closet", {
  headers: { "Authorization": "Bearer sk_live_YOUR_API_KEY" },
});

const data = await response.json();
```

### curl

```bash
curl "https://skystyle.app/api/v1/closet" \
  -H "Authorization: Bearer sk_live_YOUR_API_KEY"
```

### Sample response

```json
{
  "items": [
    "White Oxford shirt",
    "Navy chinos",
    "Brown leather belt",
    "Grey wool sweater",
    "Black Chelsea boots"
  ],
  "count": 5
}
```

## Notes

- If the user's closet is empty, `items` will be an empty array and `count` will be `0`.
- Items are returned in the order they were added to the closet.
- This endpoint reflects the closet of the user who owns the API key — there is no way to query another user's closet.
