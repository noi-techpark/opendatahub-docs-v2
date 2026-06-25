---
sidebar_position: 3
---



# Output formats (Content API)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 1. JSON and JSON-LD response formats

The Content API returns data primarily in JSON format. You can optionally receive responses in JSON-LD format, which models data using the schema.org vocabulary, by setting the appropriate HTTP header.

To request JSON-LD output, set the `Accept` header to `application/ld+json`. The Content API will return structured data compatible with schema.org types when available.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

  ```bash
  curl "https://tourism.api.opendatahub.com/v1/Hotel/123" \
    -H "Accept: application/ld+json" \
    -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
  <TabItem value="go" label="Go">

  ```go
  req, _ := http.NewRequest("GET", "https://tourism.api.opendatahub.com/v1/Hotel/123", nil)
  req.Header.Set("Accept", "application/ld+json")
  req.Header.Set("Authorization", "Bearer "+token)
  ```

  </TabItem>
</Tabs>

:::warning
JSON-LD format is not supported for all data types. Currently, the Content API supports JSON-LD for the following types:
- Hotel
- Restaurant
- Event
- TouristAttraction
- Recipe
- SkiResort
- Place

For unsupported types, the API returns standard JSON regardless of the `Accept` header.
:::

## 2. Response structure and metadata

All Content API responses include metadata that describes the result set, along with the actual data in the `Items` array.

### 2.1. Search and list response metadata

When using endpoints like `/v1/Filter` or `/v1/Find`, the response includes pagination and summary metadata:

| Field | Type | Description |
| :--- | :--- | :--- |
| `TotalResults` | integer | Total number of results matching the query |
| `TotalPages` | integer | Total number of pages available |
| `CurrentPage` | integer | Current page number in the result set |
| `Seed` | string | Random seed used for consistent pagination |
| `Items` | array | Array of result objects |

Example response:
```json
{
  "TotalResults": 10564,
  "TotalPages": 705,
  "CurrentPage": 1,
  "OnlineResults": -1,
  "Seed": "43",
  "Items": [
    {
      "Id": "AF3EA703C8563631497597C0ADAF75B6",
      "AccoDetail.en.Name": "Appartement Drei Zinnen/Three Peaks",
      "_Meta.Type": "accommodation",
      "Self": "https://tourism.api.opendatahub.com/v1/Accommodation/AF3EA703C8563631497597C0ADAF75B6"
    }
  ]
}
```

The `Seed` parameter ensures consistent sorting across paginated requests. If you retrieve the first page with `Seed: "43"`, use that same seed value when requesting subsequent pages to avoid duplicate or missing results.

### 2.2. Individual result fields

Each item in the `Items` array contains core fields:

| Field | Description |
| :--- | :--- |
| `Id` | Unique identifier for the resource |
| `Type` or `_Meta.Type` | Content type of the resource |
| `Title` or language-specific title field | Display name of the resource |
| `Link` or `Self` | Direct URL to retrieve the full resource |

## 3. CSV export

The Content API supports CSV output for flat data structures. You can request CSV format either via query parameter or HTTP header.

### 3.1. Requesting CSV format

Use one of these methods to receive CSV output:

- Add `format=csv` to the query string
- Set the `Accept` header to `text/csv`

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

  ```bash
  curl "https://tourism.api.opendatahub.com/v1/Accommodation?fields=Id,AccoDetail.en.Name,AccoType.Id&format=csv" \
    -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
  <TabItem value="go" label="Go">

  ```go
  req, _ := http.NewRequest("GET", "https://tourism.api.opendatahub.com/v1/Accommodation", nil)
  q := req.URL.Query()
  q.Add("fields", "Id,AccoDetail.en.Name,AccoType.Id")
  q.Add("format", "csv")
  req.URL.RawQuery = q.Encode()
  req.Header.Set("Authorization", "Bearer "+token)
  ```

  </TabItem>
</Tabs>

### 3.2. Field selection and flattening

Use the `fields` parameter to specify which fields to include in the CSV output. This helps create flat, tabular data suitable for spreadsheet applications.

Example request:
```
https://tourism.api.opendatahub.com/v1/Accommodation?fields=Id,AccoDetail.en.Name,AccoType.Id&format=csv
```

:::warning
CSV export requires flat data structures. Nested objects may not export correctly or may be omitted. For complex data, use JSON format and transform locally if needed.
:::

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `format` | string | no | json | Output format; use `csv` for CSV export |
| `fields` | string | no | all fields | Comma-separated list of fields to include in the response |
| `Accept` | header | no | application/json | Set to `text/csv` to request CSV format |

:::warning
Not all endpoints support CSV export. If the `format=csv` parameter or `Accept: text/csv` header is not honored, the endpoint only supports JSON output.
:::

## 4. Data licensing

All responses from the Content API are provided under an Open Data license. However, resources linked within the data (such as images, websites, or documents) may have different licensing terms.

Always verify the license of linked external resources before reuse. The Open Data license applies only to the structured data returned by the API, not to third-party content referenced within it.

Related: [Authentication](/use-data/authentication-and-access/authentication), Query parameters (Content API)
