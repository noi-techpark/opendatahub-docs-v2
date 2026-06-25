---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Managing content in the Data Browser

This guide covers the editorial workflows in the [Data Browser](https://databrowser.opendatahub.com/): maintaining events, images, tags, and news articles. It is aimed at content editors and authorized users. If you only need to read data through the APIs, see the [Data Browser overview](/tools/data-browser) instead.

## 1. Managing event data

Events are managed through structured forms in the Data Browser, but the underlying data model informs how event data should be structured for consumption via the **Content API**.

### 1.1. Event duration and scheduling

For accurate representation across channels, event timing must be carefully defined:

- An event ending **before midnight** should have its end time set to `23:59` on the same date.
- An event ending **at midnight** should have its end time set to `00:00` on the next calendar day.

Setting an end time of `00:00` on the same day is incorrect, as it refers to the start of that day and may cause display issues or application errors.

| Example | End Date | End Time | Notes |
|--------|----------|----------|-------|
| July 11, 2024, ends at 23:59 | 2024-07-11 | 23:59 | Correct for pre-midnight end |
| July 11, 2024, ends at midnight | 2024-07-12 | 00:00 | Correct for exact midnight end |
| July 11, 2024, ends at 00:00 | 2024-07-11 | 00:00 | Incorrect: refers to the start of the day |

:::warning
Avoid setting event end times to `00:00` on the same day. Use `23:59` for same-day ends or `00:00` on the next day for true midnight boundaries.
:::

### 1.2. Multi-day events

Multi-day events must be represented as separate entries for each day, with individual room bookings created per day. This ensures correct scheduling visibility, especially on platforms like `today.noi.bz.it`, which rely on room-level data.

Additionally:
- Setup and dismantling periods require their own room bookings if they occur outside main event hours.
- The **Content API** returns event duration based on the `DateBegin` and `DateEnd` fields, while room assignments are handled under `EventDetails.VenueRoom`.

## 2. Image handling in content records

Images associated with content such as events or articles follow specific formatting rules enforced by the Data Browser interface. These constraints ensure compatibility with downstream consumers of the **Content API**.

### 2.1. Image requirements

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

## 3. Tag management

Tags are used to classify content across datasets in the **Content API**. They support multilingual labels and are referenced in fields like `Tags` and `tagfilter`.

### 3.1. Creating new tags

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
  curl "https://tourism.api.opendatahub.com/v1/Event?tagfilter=hiking"
  ```

  </TabItem>
</Tabs>

:::info
Tags created in the Data Browser become part of the shared vocabulary used by the **Content API** for filtering and classification.
:::

## 4. Publishing news articles

News articles published via the Data Browser are consumed through the **Content API** under the `Article` entity type. Proper metadata ensures correct display in target applications such as the NOI Community App.

### 4.1. Required article properties

To publish an article:
- Set `MainType` to `newsfeednoi`
- Define `PublishedOn` to include `NOI Community App`
- Set `Highlight` to `true` for top placement
- Provide start and end dates for visibility
- Enter multilingual content using the language selector

Language-specific fields (`Title`, `BaseText`, etc.) are stored in the `TextInformation` object and returned by the **Content API** based on the requested language.

### 4.2. Contact and logo information

Articles must include contact details:
- Name: e.g., `NOI Techpark`
- Email: e.g., `community@noi.bz.it`
- Web URL
- Logo: use one of the predefined image URLs hosted on `images.opendatahub.com`

Example logo URL:
```
https://images.opendatahub.com/api/Image/GetImage?imageurl=NOI.png
```

:::info
The **Content API** returns article data including `TextInformation`, `Contact`, and `Images`, enabling clients to render news items with full context.
:::

## Related

- [Data Browser overview](/tools/data-browser)
- [Content API reference](/use-data/content-api/reference)
- [Filtering and sorting](/use-data/content-api/filtering-and-sorting)
