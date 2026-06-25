---
sidebar_position: 2
---

# Data Browser

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Open Data Hub Data Browser is a web-based tool that allows users to explore, filter, and manage datasets through a user-friendly interface. It supports data inspection, content creation, and editing workflows for specific domains such as events and news articles. This guide covers key functionalities relevant to API users and ingestion creators who interact with the data model and structure visible in the Data Browser.

## 1. Data Exploration and Filtering

The Data Browser enables targeted data exploration through filtering capabilities available in **table view**. Filtering is not supported in other views.

### 1.1. Filter Application

Filters can be applied to narrow down results within a dataset. When multiple filters are used, they are combined using AND logic, meaning all conditions must be satisfied for a record to appear in the results.

While the interface allows filtering via column headers or dedicated tools, the resulting data aligns with how the **Content API** returns filtered responses. For example, a filter on a `title` field corresponds to the `search` parameter in the Content API:

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

  ```go
  // Example: Search for events with "conference" in the title
  resp, err := http.Get("https://tourism.api.opendatahub.com/v1/Event?search=conference")
  ```

  </TabItem>
  <TabItem value="curl" label="curl">

  ```bash
  curl "https://tourism.api.opendatahub.com/v1/Event?search=conference" \
    -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
  <TabItem value="python" label="Python">

  ```python
  import requests

  url = "https://tourism.api.opendatahub.com/v1/Event"
  params = {"search": "conference"}
  headers = {"Authorization": "Bearer <your-token>"}
  response = requests.get(url, params=params, headers=headers)
  print(response.json())
  ```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

  ```javascript
  fetch('https://tourism.api.opendatahub.com/v1/Event?search=conference', {
    headers: { 'Authorization': 'Bearer <your-token>' }
  })
    .then(response => response.json())
    .then(data => console.log(data));
  ```

  </TabItem>
</Tabs>

:::info
Filtering in the Data Browser reflects the same logical constraints as the **Content API**, where parameters like `search`, `tagfilter`, and field-specific filters (`$filter` in OData-style syntax) are used to refine results.
:::

## 2. Managing Event Data

Events are managed through structured forms in the Data Browser, but the underlying data model informs how event data should be structured for ingestion or consumption via the **Content API**.

### 2.1. Event Duration and Scheduling

For accurate representation across channels, event timing must be carefully defined:

- An event ending **before midnight** should have its end time set to `23:59` on the same date.
- An event ending **at midnight** should have its end time set to `00:00` on the next calendar day.

Setting an end time of `00:00` on the same day is incorrect, as it refers to the start of that day and may cause display issues or application errors.

| Example | End Date | End Time | Notes |
|--------|----------|----------|-------|
| July 11, 2024, ends at 23:59 | 2024-07-11 | 23:59 | Correct for pre-midnight end |
| July 11, 2024, ends at midnight | 2024-07-12 | 00:00 | Correct for exact midnight end |
| July 11, 2024, ends at 00:00 | 2024-07-11 | 00:00 | ❌ Incorrect — means start of day |

:::warning
Avoid setting event end times to `00:00` on the same day. Use `23:59` for same-day ends or `00:00` on the next day for true midnight boundaries.
:::

### 2.2. Multi-Day Events

Multi-day events must be represented as separate entries for each day, with individual room bookings created per day. This ensures correct scheduling visibility, especially on platforms like `today.noi.bz.it`, which rely on room-level data.

Additionally:
- Setup and dismantling periods require their own room bookings if they occur outside main event hours.
- The **Content API** returns event duration based on the `DateBegin` and `DateEnd` fields, while room assignments are handled under `EventDetails.VenueRoom`.

## 3. Image Handling in Content Records

Images associated with content such as events or articles follow specific formatting rules enforced by the Data Browser interface. These constraints ensure compatibility with downstream consumers of the **Content API**.

### 3.1. Image Requirements

| Property | Value |
|--------|-------|
| Accepted formats | `jpg`, `png` |
| Maximum file size | 4 MB |
| Recommended dimensions | 1170x780 pixels |
| Orientation | Landscape preferred |
| First image | Used as the main display image |

Images are uploaded through the Data Browser form interface using a "Browse" button, which triggers the browser's native file selector. Once uploaded, images can be reordered by drag-and-drop in the **Images** section.

:::info
The **Content API** returns image URLs in the `Images` array. The first entry is typically used as the primary image in client applications.
:::

## 4. Tag Management

Tags are used to classify content across datasets in the **Content API**. They support multilingual labels and are referenced in fields like `Tags` and `odhtagfilter`.

### 4.1. Creating New Tags

New tags can be added in the Data Browser by authorized users. Each tag must include:
- Names in German (`de`), Italian (`it`), and English (`en`)
- One or more types (e.g., `eventtopic`, `gastronomycategory`)
- A list of entities (from `_Meta.Type`) for which the tag is valid
- `Active on Source` set to `true`
- Source attribution (e.g., `NOI AG`)

To retrieve valid tag types:

```http
GET https://tourism.api.opendatahub.com/v1/Distinct?type=tag&fields=Types.[*]&getasarray=true
```

To retrieve valid entity types:

```http
GET https://tourism.api.opendatahub.com/v1/Distinct?odhtype=odhmetadata&fields=Type&getasarray=true
```

After creation, tags are available for use in filtering via the **Content API**:

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

  ```bash
  curl "https://tourism.api.opendatahub.com/v1/Event?odhtagfilter=Hiking" \
    -H "Authorization: Bearer $TOKEN"
  ```

  </TabItem>
</Tabs>

:::info
Tags created in the Data Browser become part of the shared vocabulary used by the **Content API** for filtering and classification.
:::

## 5. Publishing News Articles

News articles published via the Data Browser are consumed through the **Content API** under the `Article` entity type. Proper metadata ensures correct display in target applications such as the NOI Community App.

### 5.1. Required Article Properties

To publish an article:
- Set `MainType` to `newsfeednoi`
- Define `PublishedOn` to include `NOI Community App`
- Set `Highlight` to `true` for top placement
- Provide start and end dates for visibility
- Enter multilingual content using the language selector

Language-specific fields (`Title`, `BaseText`, etc.) are stored in the `TextInformation` object and returned by the **Content API** based on requested language.

### 5.2. Contact and Logo Information

Articles must include contact details:
- Name: e.g., `NOI Techpark`
- Email: e.g., `community@noi.bz.it`
- Web URL
- Logo: Use one of the predefined image URLs hosted on `images.opendatahub.com`

Example logo URL:
```
https://images.opendatahub.com/api/Image/GetImage?imageurl=NOI.png
```

These values ensure consistent branding and contact visibility in consuming applications.

:::info
The **Content API** returns article data including `TextInformation`, `Contact`, and `Images`, enabling clients to render news items with full context.
:::

## 6. Related

- [Content API reference](/use-data/content-api/reference)
- [Filtering and sorting](/use-data/content-api/filtering-and-sorting)
- [Tags and tag types](/use-data/content-api/reference)
