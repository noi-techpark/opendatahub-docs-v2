---
sidebar_position: 3
---



# Domains and datasets

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Open Data Hub provides structured access to datasets across multiple domains through REST APIs. As an API user or ingestion creator, you interact with these datasets via standardized endpoints, metadata, and response formats. This guide covers the core concepts you need to navigate and retrieve data effectively.

## 1. Data domains

Datasets are grouped into **domains**. **Mobility** and **Tourism** are the main focus right now, but other domains are covered as well:

- **Mobility**: public transport, parking, e-charging stations, and other station and sensor data.
- **Tourism**: accommodations, events, points of interest, and activities.
- **Other**: additional datasets that do not fall under the two main domains.

Each dataset is accessible through a REST API endpoint, described in its metadata (see the next section).

## 2. The Metadata API

The Open Data Hub publishes a catalog of every dataset through the **Metadata API**. It is the source the [Discovery tool](/tools/discovery) is built on, and you can query it directly:

- `GET https://tourism.api.opendatahub.com/v1/MetaData` returns the full catalog of datasets.
- `GET https://tourism.api.opendatahub.com/v1/MetaData/{id}` returns a single dataset's metadata.

Each record describes one dataset and tells you how to consume it. The most useful fields are:

| Field | Description |
| :--- | :--- |
| `Shortname` | Human-readable name of the dataset. |
| `BaseUrl` / `ApiUrl` | The API host and the endpoint URL where the dataset is served. |
| `ApiType` | Which API exposes the dataset (for example, content or timeseries). |
| `OdhType` / `Category` | The dataset's type and thematic categories. |
| `ApiAccess` | Whether the dataset is `open` or `closed` (closed datasets require authentication). |
| `RecordCount` | Record totals, for example `RecordCount.Total`. |
| `SwaggerUrl` | Link to the Swagger UI for the dataset's endpoint. |
| `LicenseInfo` | The license under which the data is published (see [Data licensing](/licensing)). |
| `Deprecated` | `true` if the dataset should no longer be used. |

:::info
Use the Metadata API, or the [Discovery tool](/tools/discovery) built on top of it, to find a dataset's endpoint, access level, and license before you start querying it.
:::

## 3. API structure and endpoints

APIs in the Open Data Hub follow consistent patterns within each domain, but the exact structure varies by API. Always refer to the Swagger documentation for the specific domain you are working with.

### 3.1. Content API

The Content API, which serves the Tourism domain, uses the following endpoint patterns:

- `GET /v1/{Name}`: Returns the full dataset.
- `GET /v1/{Name}/{Id}`: Returns a specific item by its ID.

Here, `{Name}` is the case-sensitive `ApiIdentifier` of the dataset (e.g., `ODHActivityPoi`), and `{Id}` is the unique identifier of a data object.

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

  ```go
  // Retrieve all accommodations
  resp, err := http.Get("https://tourism.api.opendatahub.com/v1/Accommodation")
  ```

  </TabItem>
  <TabItem value="curl" label="curl">

  ```bash
  curl "https://tourism.api.opendatahub.com/v1/Accommodation"
  ```

  </TabItem>
  <TabItem value="python" label="Python">

  ```python
  import requests
  response = requests.get("https://tourism.api.opendatahub.com/v1/Accommodation")
  ```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

  ```javascript
  fetch('https://tourism.api.opendatahub.com/v1/Accommodation')
    .then(response => response.json())
    .then(data => console.log(data));
  ```

  </TabItem>
</Tabs>

### 3.2. Time Series API

The Time Series API, which serves the Mobility domain, returns paginated responses with the following structure:

```json
{
  "offset": 0,
  "limit": 100,
  "data": [
    // Array of station or measurement objects
  ]
}
```

- `offset`: Number of items to skip (default: 0).
- `limit`: Maximum number of items to return (default: 200; use -1 to disable).
- `data`: The actual payload of the response.

This structure supports pagination. To simulate page-by-page results, increment the `offset` value by the `limit` in successive requests.

:::info
The `limit` parameter defaults to 200. Setting it to -1 disables the limit and returns all results, which may impact performance.
:::

## 4. Dataset type and filtering

The `Type` field in the `_Meta` section identifies the category of a data object and is used across APIs for filtering and validation.

- The `Type` is a string (e.g., `accommodation`, `eventshort`) and is unique per dataset.
- When using the Search API or Distinct Search API, you must provide a valid `type` parameter.
- Invalid or unregistered types result in an API error.

For example, to search for all accommodations:

```http
GET /v1/Search?type=accommodation
```

:::warning
The `type` parameter must match a valid Dataset Type exactly. Custom types are not allowed without registration.
:::

## 5. Access control and dataset availability

Dataset access is determined by the `ApiAccess` field:

- `open`: The dataset is publicly accessible.
- `closed`: The dataset requires authentication and appropriate role assignment.

Only open datasets include the `RecordCount` field in their metadata. For closed datasets, this field is omitted due to access restrictions. To read a closed dataset, see [Authentication and authorization](/use-data/authentication-and-access/authentication).

## 6. Related

- [Quickstart: your first request](/quickstart)
- [Content API reference](/use-data/content-api/reference) and [Filtering and sorting](/use-data/content-api/filtering-and-sorting)
- [Time Series API reference](/use-data/time-series-api/reference)
- [Authentication and authorization](/use-data/authentication-and-access/authentication)
