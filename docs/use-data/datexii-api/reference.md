---
sidebar_position: 1
---

# DATEXII API reference

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The DATEX II API provides access to road traffic event data formatted according to the DATEX II European XML standard, exposing dynamic feeds such as announcements and traffic incidents. It features dedicated endpoints for service discovery and real-time XML data retrieval across supported regions and providers.

This reference documents the API architecture, supported endpoints, data format standards, and usage guidelines.

## 1. Base URL and entry points

The base URL for the DATEXII API is:

```
https://datex.api.opendatahub.com/
```

You can browse available endpoints directly at this URL. For interactive exploration, use the Swagger UI:

[https://datex.api.opendatahub.com/](https://datex.api.opendatahub.com/)

## 2. Entity endpoints

The DATEX II API exposes two main endpoints: a discovery endpoint to retrieve available providers and their feed URLs, and a specific XML feed endpoint for traffic situation publications.

- `GET /datex/2/` — returns the available providers, and the DATEX II files published for each.
- `GET /v1/{EntityType}/{id}` — returns the latest DATEX II SituationPublication XML for the given event provider.

The feed endpoint returns a standard DATEX II v2.0 XML payload (application/xml) wrapped in a d2LogicalModel root element.

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

## 5. Response format and metadata

### 5.1. Content negotiation

The Content API supports multiple response formats via the `Accept` header:

- `application/json` (default)
- `text/csv`
- `application/ld+json` (JSON-LD with schema.org context)

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
