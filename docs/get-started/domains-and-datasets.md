---
sidebar_position: 3
---



# Domains and datasets

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Open Data Hub provides structured access to datasets across multiple domains through REST APIs. As an API user or ingestion creator, you interact with these datasets via standardized endpoints, metadata, and response formats. This guide covers the core concepts you need to navigate and retrieve data effectively.

## 1. Data domains and dataset organization

The Open Data Hub organizes data into **domains**, which group related datasets by social or economic categories. Each domain contains datasets that expose specific types of information.

Currently supported domains include:

- **Mobility**: data on public transportation, parking stations, and charging stations.
- **Tourism**: data on accommodations, events, points of interest, and activities.
- **Other**: a catch-all category for datasets that do not fit into the primary domains.

Datasets within a domain may overlap in relevance. For example, public transportation data is primarily in the Mobility domain but is also useful for Tourism applications. There is no strict separation between domains, so consider cross-domain data when building integrations.

Each dataset is accessible via a REST API endpoint. The endpoint URL is provided in the dataset's metadata and can be used to retrieve the full dataset or specific items.

## 2. Dataset metadata

Every dataset in the Open Data Hub includes metadata that describes its structure, source, and access properties. This metadata helps you understand how to use the data and what constraints apply.

Key metadata fields include:

| Field | Type | Description |
| :--- | :--- | :--- |
| `Id` | string | Unique identifier for the dataset. |
| `ApiIdentifier` | string | The endpoint name used in API calls. |
| `OdhType` | string | The domain-specific type of the dataset. |
| `Description` | string | A brief summary of the dataset's content. |
| `License` | string | The license under which the data is published (e.g., CC-BY, CC0). |
| `SwaggerUrl` | string | Link to the Swagger UI for exploring the API interactively. |
| `Self` | string | Direct link to the dataset's API endpoint. |
| `ApiAccess` | string | Indicates whether the dataset is `open` or `closed`. |
| `RecordCount` | number | Number of records available; only present for open datasets. |
| `SingleDataset` | boolean | `true` if the dataset is a single entity; `false` if composed of multiple sources. |
| `Deprecated` | boolean | `true` if the dataset is deprecated and should not be used. |
| `_Meta` | object | Contains core metadata about individual data objects. |

The `_Meta` section is included in each data object and contains:

| Field | Type | Description |
| :--- | :--- | :--- |
| `Id` | string | Unique identifier of the data object. |
| `Type` | string | The dataset type (e.g., `accommodation`, `eventshort`). |
| `Source` | string | Origin of the data (e.g., `noi`, `eurac`). |
| `LastUpdate` | string (ISO 8601) | Timestamp when the data was last imported or saved. |
| `Reduced` | boolean | `true` if the data has been reduced in scope or detail. |
| `UpdateInfo` | array | History of updates, including `UpdatedBy`, `UpdateSource`, and `LastUpdate`. |

:::warning
Check the `Deprecated` field before integrating a dataset. Using deprecated datasets may lead to broken functionality in the future.
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
