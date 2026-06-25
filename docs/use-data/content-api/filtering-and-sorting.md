---
sidebar_position: 2
---



# Filtering and sorting (Content API)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Content API provides a comprehensive set of query parameters to filter, sort, and shape the data returned from its endpoints. These tools allow API users to retrieve only the data they need, reduce payload size, and organize results effectively. This guide covers the core filtering and sorting capabilities available across Content API endpoints.

## 1. Field selection and null value handling

Control which fields are included in the response and manage null or empty values to optimize payload size and structure.

### 1.1 Selecting fields with `fields`

Use the `fields` parameter to specify which fields to include in the response. The `Id` field is always included, even if not explicitly requested.

You can select:
- Top-level fields: `Shortname`
- Nested object fields: `Detail.en.Title`
- Array elements: `ODHTags.[0]`, `ODHTags.[*].Id`

Multiple fields are comma-separated.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `fields` | string | no | all fields | Comma-separated list of fields to include in the response. Supports dot notation for nested fields and bracket notation for arrays. |

:::info
Field names in the `fields` parameter are case-sensitive and must match the API schema exactly.
:::

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

  ```go
  // Fetch only Shortname and German title
  url := "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?fields=Shortname,Detail.de.Title"
  ```

  </TabItem>
  <TabItem value="curl" label="curl">

  ```bash
  curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?fields=Shortname,Detail.de.Title" -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
  <TabItem value="python" label="Python">

  ```python
  import requests

  url = "https://tourism.api.opendatahub.com/v1/ODHActivityPoi"
  params = {"fields": "Shortname,Detail.de.Title"}
  headers = {"Authorization": "Bearer <your-token>"}
  response = requests.get(url, params=params, headers=headers)
  ```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

  ```javascript
  const url = new URL('https://tourism.api.opendatahub.com/v1/ODHActivityPoi');
  url.searchParams.append('fields', 'Shortname,Detail.de.Title');

  fetch(url, {
    headers: { 'Authorization': 'Bearer <your-token>' }
  });
  ```

  </TabItem>
</Tabs>

### 1.2 Handling null and empty values

Control how null and empty values appear in the response.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `removenullvalues` | boolean | no | false | If true, removes fields with `null` values from the JSON response. |
| `excludenulloremptyvalues` | boolean | no | false | If true, removes fields with `null` or empty string values. Used primarily in the Distinct Search endpoint. |

:::warning
The `excludenulloremptyvalues` parameter is specific to certain endpoints like Distinct Search and may not affect all Content API responses.
:::

## 2. Filtering data

Apply filters to narrow down results based on tags, text search, location, or custom conditions.

### 2.1 Tag-based filtering with `tagfilter`

Filter entries by associated tags using the `tagfilter` parameter. Tags can be from the Open Data Hub system or external sources.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `tagfilter` | string | no | - | Filters results by tag expression. Supports comma-separated values (OR logic) or explicit `and()`/`or()` syntax. |

- Comma-separated (OR logic): `tagfilter=hiking,bike`
- Explicit OR: `tagfilter=or(hiking,bike)`
- AND logic: `tagfilter=and(hiking,summer)`
- Source-specific: `tagfilter=idm.paragliding`

:::info
Tag values are case-sensitive identifiers in lowercase (for example `hiking`, not `Hiking`), not display labels. Use `tagfilter`; the `odhtagfilter` parameter does not match these values. Discover the valid tags for an entity with the [`/v1/Tag` endpoint](/use-data/content-api/reference#41-tags), for example `GET /v1/Tag?validforentity=odhactivitypoi`. A tag that does not exist returns zero results rather than an error.
:::

### 2.2 Text search with `searchfilter`

Search across title fields and IDs using the `searchfilter` parameter.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `searchfilter` | string | no | - | Searches title fields and IDs. Use with `language` to scope search. |
| `language` | string | no | en | Limits search to content in the specified language (e.g., `de`, `it`, `en`). |
| `searchbasetext` | boolean | no | false | If true, extends search to base text fields. Can significantly degrade performance. |
| `filteronfields` | string | no | - | Comma-separated list of nested field paths to search (e.g., `ContactInfos.en.CompanyName`). |

:::warning
Omitting the `language` parameter may result in excessive results and slower responses, as the search runs across all available languages.
:::

:::warning
Using `searchbasetext=true` can significantly degrade API performance. Use sparingly.
:::

### 2.3 Location-based filtering

Filter results by geographic area using coordinates, polygons, or location identifiers.

#### Radius-based filtering

Use `latitude`, `longitude`, and `radius` (in meters) to find items within a circular area. Results are automatically sorted by ascending distance.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `latitude` | number | yes (with `longitude`) | - | Decimal latitude of the search center. |
| `longitude` | number | yes (with `latitude`) | - | Decimal longitude of the search center. |
| `radius` | number | yes (with `latitude`, `longitude`) | - | Search radius in meters. |

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

  ```bash
  curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?latitude=46.624975&longitude=11.369909&radius=2000" -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
</Tabs>

#### Polygon filtering

Use the `polygon` parameter to filter by geographic area. Supports multiple formats:

- **WKT**: `POLYGON((11.026805 46.688285, ...))`
- **Custom syntax**: `bbc(...)` (bounding box closed), `bbi(...)` (bounding box intersected)
- **GeoShapes API reference**: `it.municipality.Bolzano/Bozen`

:::warning
Large polygon definitions may exceed URL length limits for GET requests. Consider using POST with a body if this occurs.
:::

#### Location identifier filtering (`locfilter`)

Filter by predefined location types using `locfilter`. Combine multiple values with commas (OR logic).

| Type prefix | Description |
| :--- | :--- |
| `tvs` | Tourism association |
| `mun` | Municipality |
| `fra` | Fraction |

Example: `locfilter=tvs522822D451CA11D18F1400A02427D15E,mun99A8B1D4A8D64303B1B965AA7C20FA60`

### 2.4 Custom filtering with `rawfilter`

Apply advanced filtering logic using the `rawfilter` parameter with a functional syntax.

| Function | Meaning |
| :--- | :--- |
| `eq(field, value)` | Equal |
| `ne(field, value)` | Not equal |
| `gt(field, value)` | Greater than |
| `ge(field, value)` | Greater than or equal |
| `lt(field, value)` | Less than |
| `le(field, value)` | Less than or equal |
| `and(...)` | Logical AND |
| `or(...)` | Logical OR |
| `isnull(field)` | Field is null |
| `isnotnull(field)` | Field is not null |
| `in(field, value)` | Value in array |
| `nin(field, value)` | Value not in array |
| `like(field, value)` | Case-insensitive substring match |
| `likein(field, value)` | Substring match within array elements |

Field paths support dot notation (`Detail.de.Title`) and array indexing (`ODHTags.[0].Id`, `ODHTags.[*].Id`).

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

  ```bash
  # Active hiking activities with non-null altitude
  curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?rawfilter=and(eq(Type,'Wandern'),isnotnull(Geo.0.Altitude))" -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
</Tabs>

:::warning
Negation (e.g., `not`) is not supported. Use `ne` or `isnotnull` instead.
:::

## 3. Sorting results

Control the order of results using built-in or custom sorting.

### 3.1 Pagination and consistent sorting

Use `pagesize` and `pagenumber` for pagination. The Content API does **not** use `limit`/`offset` (those belong to the Time Series API); supplying them has no effect.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `pagesize` | number | no | 10 | Number of items per page (max 1000). |
| `pagenumber` | number | no | 1 | Page number to retrieve (1-based). |
| `seed` | number | no | null | Ensures stable ordering across pages. Use `seed=0` to get a random seed, then reuse it. |

### 3.2 Custom sorting with `rawsort`

Sort results by any field using `rawsort`. Prefix with `-` for descending order.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `rawsort` | string | no | - | Comma-separated list of fields to sort by. Prefix with `-` for descending. |

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

  ```bash
  # Sort by German title ascending, then altitude descending
  curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi?rawsort=Detail.de.Title,-Geo.0.Altitude" -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
</Tabs>

:::warning
An active geofilter (e.g., `latitude`/`longitude`/`radius`) overrides the `rawsort` parameter, sorting results by distance instead.
:::

:::warning
The `rawsort` parameter only works on fields that are included in the selected output (via `fields` or full projection).
:::

## 4. Specialized endpoints

### 4.1 Distinct Search endpoint

Retrieve unique values for specified fields using the Distinct Search endpoint.

- **Endpoint**: `https://tourism.api.opendatahub.com/v1/Distinct`
- **Required parameters**:
  - `type`: Data type to search (e.g., `Accommodation`, `Event`)
  - `fields`: Field(s) to retrieve distinct values for

Supports `rawfilter`, `rawsort`, and `excludenulloremptyvalues`.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

  ```bash
  # Get distinct sources for webcams
  curl "https://tourism.api.opendatahub.com/v1/Distinct?type=webcam&fields=Source" -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
</Tabs>

:::warning
The Distinct Search endpoint is currently available on the test instance. Verify availability before using in production.
:::

:::info
Multiple fields in `fields` are only supported for non-array fields.
:::

## Related

- [Content API reference](/use-data/content-api/reference)
- [Output formats (Content API)](/use-data/content-api/output-formats)
- [Authentication and authorization](/use-data/authentication-and-access/authentication)
