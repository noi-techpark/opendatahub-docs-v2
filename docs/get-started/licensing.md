---
sidebar_position: 4
---

# Data licensing

The Open Data Hub provides open, freely accessible data under permissive licenses, ensuring compliance with open data principles. As an API user or ingestion creator, you can rely on structured license metadata to understand the terms under which data can be used.

## 1. License information in API responses

The Content API includes a `LicenseInfo` block in every dataset response. This block provides key metadata about the licensing of the data record and is present for all publicly exposed data.

### 1.1. Structure of `LicenseInfo`

The `LicenseInfo` object contains the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `Author` | string | The author of the data. May be empty. |
| `License` | string | The license type applied to the data (e.g., `CC0`, `Proprietary`). |
| `ClosedData` | boolean | Indicates whether the data is closed (`true`) or open (`false`). |
| `LicenseHolder` | string | URL or identifier of the entity holding the license. |

:::info
The `LicenseInfo` block applies **only** to the parent data node (the one identified by an `Id`). It does not extend to child nodes such as `Streamurl` or `Webcamurl`, which may link to external resources governed by different licensing terms.
:::

### 1.2. Common license values

- **`CC0`**: The data is in the public domain and can be freely reused without restrictions.
- **`Proprietary`**: The data is owned by a specific entity and may have usage limitations.

Only open data records are returned through the Content API. Even if source systems contain closed or proprietary data, these are filtered out during ingestion and not exposed in API responses.

### 1.3. Example `LicenseInfo` in a response

```json
{
  "Id": "D3659E1F111C4CDB2EC19F8FC95118B7",
  "Active": true,
  "Webcamurl": "https://webtv.feratel.com/webtv/?&pg=5EB12424-7C2D-428A-BEFF-0C9140CD772F",
  "LicenseInfo": {
    "Author": "",
    "License": "CC0",
    "ClosedData": false,
    "LicenseHolder": "https://www.lts.it"
  }
}
```

In this example, the `LicenseInfo` applies only to the parent record (e.g., the webcam metadata), not to the stream or image content accessible via `Webcamurl`.

## 2. Image licensing and availability

Images associated with data records are subject to additional licensing checks. The Content API only includes images that are licensed under permissive terms.

### 2.1. Image license requirements

- Images must have a `CC0` or `CC-BY` license to be included in API responses.
- Images with no license (`License == null`) or a proprietary license (e.g., `LTS`) are excluded.

This filtering ensures compliance with open data standards. As a result, not all accommodations or points of interest include images in their responses.

### 2.2. Per-image license details

When images are included, license information is provided in the `ImageGallery` object:

| Field | Type | Description |
| :--- | :--- | :--- |
| `ImageUrl` | string | URL of the image. |
| `License` | string | License type (e.g., `CC0`). |
| `CopyRight` | string | Copyright notice, if applicable. |
| `LicenseHolder` | string | Entity holding the license. |

Example:
```json
{
  "ImageUrl": "https://urltoanimage",
  "License": "CC0",
  "CopyRight": "© LTS",
  "LicenseHolder": "https://www.lts.it"
}
```

## 3. Access and usage considerations

### 3.1. No authentication required

Open Data Hub data can be accessed without authentication. You can make requests directly to the API endpoints.

:::warning
To avoid CORS errors in browser-based applications, always use `https://opendatahub.com` (not HTTP) when calling the API from JavaScript.
:::

### 3.2. Company details as open data

Company-related information such as names, addresses, and contact details are treated as open data and can be freely shared with third parties. These do not contain personal data and are published under open licensing terms.

## Related

- [Filtering and sorting (Content API)](/use-data/content-api/filtering-and-sorting)
- [Output formats (Content API)](/use-data/content-api/output-formats)
- [Quickstart: your first request](/quickstart)
