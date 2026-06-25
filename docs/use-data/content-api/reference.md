---
sidebar_position: 1
---



# Content API reference

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Content API provides access to tourism-related datasets such as accommodations, activities, events, weather, and more. It exposes a set of standardized endpoints for retrieving structured data, with consistent query parameters, response formats, and metadata across all entity types.

All endpoints follow a common pattern and return data in a uniform JSON envelope. This reference documents the shared conventions, available entity types, filtering capabilities, and utility endpoints.

## 1. Base URL and entry points

The base URL for the Content API is:

```
https://tourism.api.opendatahub.com/v1/
```

You can browse available endpoints directly at this URL. For interactive exploration, use the Swagger UI:

[https://tourism.api.opendatahub.com/swagger/index.html](https://tourism.api.opendatahub.com/swagger/index.html)

:::warning
A JSON browser plugin may be required to properly view raw API responses in your browser.
:::

## 2. Entity endpoints

The Content API exposes multiple entity types, each accessible via a dedicated endpoint. The general pattern is:

- `GET /v1/{EntityType}` — returns a paged list of items
- `GET /v1/{EntityType}/{id}` — returns a single item by ID

All list responses use the same JSON envelope structure:

```json
{
  "TotalResults": 150,
  "TotalPages": 15,
  "CurrentPage": 1,
  "Seed": null,
  "Items": [
    // Array of entity objects
  ]
}
```

### 2.1. Main entity types

| Entity Type | Endpoint | Description |
| :--- | :--- | :--- |
| `Accommodation` | `/v1/Accommodation` | Lodging facilities including hotels, guesthouses, and agriturismos |
| `ODHActivityPoi` | `/v1/ODHActivityPoi` | Activities, points of interest, and gastronomy venues |
| `Event` / `EventShort` | `/v1/Event`, `/v1/EventShort` | Cultural, sports, and seasonal events |
| `Article` | `/v1/Article` | Editorial content and stories |
| `Webcam` | `/v1/WebcamInfo` | Webcam streams and metadata |
| `Weather` | `/v1/Weather/District`, `/v1/Weather/Forecast`, `/v1/Weather/Realtime` | Weather data by district and forecast |
| `Region`, `Municipality`, `District`, `Area` | `/v1/Region`, etc. | Administrative and tourism regions |
| `SkiArea`, `SkiRegion` | `/v1/SkiArea`, `/v1/SkiRegion` | Ski resort areas |
| `TourismAssociation` | `/v1/TourismAssociation` | Local tourism organizations |

## 3. Shared query parameters

The following parameters are supported across most Content API endpoints.

### 3.1. Pagination

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `pagesize` | integer | no | 10 | Number of items per page (max 1000) |
| `pagenumber` | integer | no | 1 | Page number to retrieve |

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/Accommodation?pagesize=10&pagenumber=2"
```

</TabItem>
</Tabs>

### 3.2. Field selection

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `fields` | string | no | - | Comma-separated list of fields to include in response |

Supports nested fields and array indexing:

- `fields=Shortname` — include top-level field
- `fields=Detail.en.Title` — include localized title
- `fields=ODHTags.[*].Id` — return array of tag IDs

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?fields=Id,Shortname,Detail.en.Title"
```

</TabItem>
</Tabs>

### 3.3. Language handling

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `language` | string | no | - | Return only content in specified language (e.g., `en`, `de`, `it`) |
| `langfilter` | string | no | - | Filter results to those available in the specified language |

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?language=de&langfilter=de"
```

</TabItem>
</Tabs>

### 3.4. Search and filtering

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `searchfilter` | string | no | - | Full-text search on title fields across languages; accepts partial matches and IDs |
| `removenullvalues` | boolean | no | false | Exclude null fields from response to reduce payload size |
| `updatefrom` | date (yyyy-MM-dd) | no | - | Return only items updated on or after the given date |

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?searchfilter=hiking&removenullvalues=true&updatefrom=2023-01-01"
```

</TabItem>
</Tabs>

### 3.5. Geospatial filtering

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `latitude`, `longitude` | float | no | - | Coordinates for radius-based filtering |
| `radius` | integer | no | - | Radius in meters; returns items within the circle defined by latitude, longitude, and radius |
| `polygon` | string | no | - | Filter by geographic polygon using WKT, custom syntax, or GeoShapes ID |
| `areafilter` | string | no | - | Filter by area name (e.g., ski area); does not support wildcards |

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
# By radius
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?latitude=46.624975&longitude=11.369909&radius=2000"

# By polygon (GeoShapes ID)
curl "https://tourism.api.opendatahub.com/v1/WebcamInfo?polygon=8032_swisstopo"

# By polygon (WKT)
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?polygon=POLYGON((11.026805%2046.688285,11.083110%2046.690169,11.081394%2046.660723,11.035045%2046.655775,11.026805%2046.688285))"
```

</TabItem>
</Tabs>

:::info
The `polygon` parameter supports:
- `Country.Type.Id` or `Country.Type.Name` (e.g., `it.municipality.Bolzano/Bozen`)
- WKT format (POLYGON, LINESTRING, MULTIPOLYGON)
- BBC/BBI syntax
- Custom SRID via `;SRID=4326` suffix

Large polygons may exceed URL length limits.
:::

### 3.6. Tag-based filtering

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `tagfilter` | string | no | - | Filter by tag identifiers. Comma-separated values use OR logic; use `and(...)`/`or(...)` for explicit logic. |

Tag filtering is supported on the `ODHActivityPoi` endpoint. Tag values are case-sensitive lowercase identifiers (for example `hiking`), not display labels; discover the valid tags for an entity with the [`/v1/Tag`](#41-tags) endpoint. An unknown tag returns zero results rather than an error.

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
# OR logic (any of the listed tags)
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?tagfilter=hiking,bike"

# AND logic (all of the listed tags)
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?tagfilter=and(hiking,summer)"
```

</TabItem>
</Tabs>

:::info
Two tagging systems are used:
- `LTSTags`: original tags from data sources
- `ODHTags`: Open Data Hub standardized categories

Use `ODHTags` for consistent categorization. The `AdditionalPoiInfos.[language].Categories` field contains display-ready categories per language.
:::

## 4. Utility endpoints

### 4.1. Tags

Retrieve tags used for categorization.

- **Current endpoint**: `GET /v1/Tag`
- **Deprecated**: `/v1/ODHTag` (do not use)

Supports filtering by:
- `validforentity` (e.g., `odhactivitypoi`, `event`, `accommodation`)
- `source` (e.g., `lts`, `idm`)
- `types` (tag category)

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/Tag?validforentity=odhactivitypoi&source=lts"
```

</TabItem>
</Tabs>

### 4.2. Distinct values

Retrieve unique values for specific fields.

- `GET /v1/Distinct?type=tag&fields=Types.[*]&getasarray=true` — get all tag types
- `GET /v1/Distinct?odhtype=odhmetadata&fields=Type&getasarray=true` — get all entity types

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/Distinct?type=tag&fields=Types.[*]&getasarray=true"
```

</TabItem>
</Tabs>

### 4.3. GeoShapes

Access geographic boundaries for regions, municipalities, and other administrative units.

- `GET /v1/GeoShapes` — returns geometry data in GeoJSON format
- Supports `srid` parameter to transform coordinate systems (default: EPSG:4326)

Used in conjunction with the `polygon` filter parameter.

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/GeoShapes?polygon=it.region.Trentino-Alto%20Adige"
```

</TabItem>
</Tabs>

### 4.4. GeoConverter

Convert KML or GPX files to GeoJSON.

- `GET /v1/GeoConverter/KmlToGeoJson?url={url}`
- `POST /v1/GeoConverter/KmlToGeoJson` with file upload
- Similar endpoints for GPX conversion

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/GeoConverter/KmlToGeoJson?url=https://example.com/data.kml"
```

</TabItem>
</Tabs>

### 4.5. Location

Retrieve location metadata for use with `locfilter`.

- `GET /v1/Location?showall=true` — get all location types and IDs

Used to obtain `typ` and `id` values for location-based filtering.

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/Location?showall=true"
```

</TabItem>
</Tabs>

### 4.6. Search endpoints

- `GET /v1/Find` — search across multiple entity types
- `GET /v1/Filter` — advanced filtering with expression language

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/Find?q=hiking"
```

</TabItem>
</Tabs>

### 4.7. Source

Retrieve valid data sources.

- `GET /v1/Source` — list all source identifiers

The `Source` field in data records now contains a single value derived from this endpoint.

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/Source"
```

</TabItem>
</Tabs>

## 5. Response format and metadata

### 5.1. Content negotiation

The Content API supports multiple response formats via the `Accept` header:

- `application/json` (default)
- `text/csv`
- `application/ld+json` (JSON-LD with schema.org context)

### 5.2. _Meta section

Every entity includes a `_Meta` object with system metadata:

| Field | Description |
| :--- | :--- |
| `_Meta.Id` | Unique record identifier |
| `_Meta.Source` | Data origin (e.g., `lts`, `idm`) |
| `_Meta.LastUpdate` | Timestamp when data was last saved by Open Data Hub |
| `_Meta.LastChange` | Timestamp of last actual data modification |
| `_Meta.Reduced` | Indicates whether data has been reduced |

:::info
`_Meta.LastUpdate` reflects system import time, not data change time. Use `_Meta.LastChange` to detect actual content updates.
:::

## 6. Authentication

Some datasets require authentication to access full details.

- Include a valid access token in the `Authorization` header:
  
  ```
  Authorization: Bearer <your-token>
  ```

- Tokens can be obtained through the Swagger UI or OAuth2 flow.

:::warning
Accommodation room data and availability require authorized access. Without a token, only base data is returned.
:::

## 7. Example: Filtering ODHActivityPoi

The `ODHActivityPoi` endpoint supports rich filtering. This example combines multiple parameters:

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi\
?tagfilter=hiking\
&language=en\
&fields=Id,Shortname,Detail.en.Title,Tags\
&pagesize=10"
```

</TabItem>
</Tabs>

This request:
- Filters for hiking-related POIs
- Returns only English content
- Selects specific fields
- Pages results

## 8. Related

- [Authentication guide](/use-data/authentication-and-access/authentication)
- [Deprecations](/use-data/content-api/deprecations)
- [Filtering and sorting](/use-data/content-api/filtering-and-sorting)
