---
sidebar_position: 4
---



# Deprecations and datamodel migration

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 1. Introduction

The Content API regularly updates its data models to improve consistency, performance, and alignment with tagging standards. As part of this evolution, certain fields and endpoints are deprecated or removed. This page documents all deprecated and removed fields, structural model changes, and migration guidance specific to the Content API. If you consume data from the Content API, review this page to ensure your integrations remain compatible.

:::warning
Using deprecated fields or endpoints is discouraged. Deprecated elements may be removed after their `RemovedAfter` date, which can break existing integrations. Always migrate to recommended replacements as soon as possible.
:::

## 2. Deprecated and removed fields

The Content API has deprecated or removed several fields across key data models. These changes streamline data structure and promote the use of standardized tagging and metadata fields.

### 2.1. Events datamodel changes

The following fields have been removed from the Events datamodel and are no longer available in the JSON response:

- `Pdf`, `Ranc`, `PayMet`, `Type`, `GrpEvent`
- `LTSTags`, `Hashtag`
- `EventDate.GpsEast`, `EventDate.GpsNorth`, `EventDate.InscriptionTill`, `EventDate.EventDateAdditionalTime`
- `EventPrices`, `EventBenefit`, `EventCrossSelling`, `EventDescAdditional`, `EventOperationScheduleOverview`, `NextBeginDate`

The following fields are deprecated and will be removed in a future version. Transition to the recommended replacements:

| Deprecated Field | Replacement | Notes |
| :--- | :--- | :--- |
| `EventDate.EventCalculatedDay` | `EventDate.EventCalculatedDays` | Now returned as a list |
| `EventPrice` | `EventVariants` | Use variant-based pricing |
| `ODHTags` | `Tags` | Use the unified `Tags` field |
| `OdhActive` | `PublishedOn` | Indicates publication status |
| `EventBooking.BookableTo`, `BookableFrom`, `AccommodationAssignment` | `EventUrls` (type `bookingUrl`) | Booking URLs are now in `EventUrls` |
| `ClassificationRID` | `Tags` (type `eventclassification`) | Migrated to tagging system |
| `Topics`, `TopicRids` | `Tags` (type `eventcategory`) | Migrated to tagging system |
| `Gpstype`, `Latitude`, `Longitude`, `Altitude`, `AltitudeUnitofMeasure` | `GpsInfo` | Use the structured GPS object |
| `Ticket` | `EventProperty.TicketRequired` | Moved to property object |
| `SignOn` | `EventProperty.RegistrationRequired` | Moved to property object |
| `OrgRID` | `EventProperty.EventOrganizerId` | Moved to property object |
| `EventAdditionalInfos.Mplace` | `MeetingPoint` | Updated field name |
| `EventAdditionalInfos.Reg` | `Registration` | Updated field name |

### 2.2. ODHActivityPoi datamodel changes

The following fields will be removed from the ODHActivityPoi datamodel:

- `CustomId`, `SmgId`, `Type`, `SubType`, `PoiType`
- `AdditionalPoiInfos.MainType`, `AdditionalPoiInfos.SubType`, `AdditionalPoiInfos.PoiType`
- `Highlight`, `OwnerRid`, `ChildPoiIds`, `MasterPoiIds`, `PoiServices`, `ODHActivityPoiTypes`
- `LocationInfo.AreaInfo`

The following fields are deprecated and will be removed. Use the replacements listed:

| Deprecated Field | Replacement | Notes |
| :--- | :--- | :--- |
| `PoiProperty` | - | Obsolete, no replacement |
| `SyncSourceInterface`, `SyncUpdateMode` | - | Obsolete, no replacement |
| `GpsPoints` | `GpsInfo` | Use the structured GPS object |
| `OutdooractiveID`, `OutdooractiveElevationID` | `Mapping` | May be moved to `Mapping` field |
| `Difficulty` | `Ratings` | Use the corresponding field in `Ratings` |
| `LTSTags`, `SmgTags` | `Tags` | Use the unified `Tags` field |
| `SmgActive` | `PublishedOn` | Indicates publication status |
| `CustomId`, `SmgId`, `OwnerRid`, `ChildPoiIds`, `MasterPoiIds` | `Mapping` | May be preserved in `Mapping` |

:::info
The `GpsPoints` field is deprecated and should be replaced with `GpsInfo`. Although some sources previously suggested the reverse, the correct migration path is to use `GpsInfo` and phase out `GpsPoints`.
:::

### 2.3. General field replacements

Across multiple datamodels, the following deprecated fields should be replaced as indicated:

- `LTSTags`, `SmgTags`, `Type` → use `Tags`
- `GpsPoints` → use `GpsInfo`
- `LocationInfo.AreaInfo` → use the `AreaIds` array
- `MainEntity` → use `ValidForEntity`
- `IDMCategoryMapping` → obsolete, do not use
- `LTSTaggingInfo` → replaced by the `Mapping` field

## 3. Viewing deprecation status

The Content API provides multiple ways to identify deprecated fields and endpoints.

### 3.1. Deprecated endpoint (deprecated)

The Content API previously exposed a route to list all deprecated fields:

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.api.opendatahub.com/v1/Deprecated" -H "Authorization: Bearer $TOKEN"
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
// Example: Fetch deprecated fields
resp, _ := http.Get("https://tourism.api.opendatahub.com/v1/Deprecated")
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
url = "https://tourism.api.opendatahub.com/v1/Deprecated"
headers = {"Authorization": "Bearer <your-token>"}
response = requests.get(url, headers=headers)
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
fetch('https://tourism.api.opendatahub.com/v1/Deprecated', {
  headers: { 'Authorization': 'Bearer <your-token>' }
})
```

  </TabItem>
</Tabs>

Example response:
```json
{
  "weatherdistrict": [
    {
      "Name": "date",
      "Type": "DateTime",
      "Description": "Obsolete, use Date instead",
      "DeprecationDate": "2022-01-01",
      "RemovedAfter": "2023-01-01"
    }
  ]
}
```

:::warning
The `/v1/Deprecated` endpoint is itself deprecated and may be removed in a future version. Rely on schema annotations and the Data Browser for up-to-date deprecation status.
:::

### 3.2. API schemas

In the Content API Swagger documentation, deprecated fields and endpoints are marked with a visual indicator. You can inspect the schema definitions directly to see deprecation metadata such as `DeprecationDate` and `RemovedAfter`.

### 3.3. Data Browser

In the [Open Data Hub Data Browser](https://databrowser.opendatahub.com), deprecated fields are visually marked with an orange dot or outline. Clicking the marker reveals additional information, including the reason for deprecation and the recommended replacement.

:::info
Deprecation markers in the Data Browser require user interaction to view details. Regularly check the Data Browser to stay informed about upcoming changes.
:::

## 4. Data migration and structural model changes

The Open Data Hub is transitioning from a Legacy Instance (`service.suedtirol.info`) to the Main Instance (`tourism.api.opendatahub.com`). Most data types have been fully migrated.

### 4.1. Fully migrated data types

The following data types are fully migrated to the Main Instance and should be edited there:

- Event, Gastronomy, Activity, Poi, Accommodation
- Webcams, Measuringpoints, Venues, ODHTags
- District, Municipality, TV, Region
- Skiarea/Skiregion, Wine Companies, Availability Search

### 4.2. Partially migrated data types

- **Snow Report**: Partially migrated. Some functionality may still reside on the Legacy Instance, but all data can now be edited on the Main Instance.

:::info
If Save/Delete functionality is unavailable on the Legacy Instance, you must edit the data on the Main Instance.
:::

### 4.3. Structural changes: AdditionalProperties

For LTS-sourced data types (Gastronomy, POI, Activity), several root-level properties are being moved into the `AdditionalProperties` object to improve data organization.

These changes are backward-compatible for several months, but you should update your code to access the new locations.

#### Gastronomy (LTS)
The following fields are moving to `AdditionalProperties.GastronomyLtsDataProperties`:
- `CategoryCodes`, `DishRates`, `CapacityCeremony`, `Facilities`, `MaxSeatingCapacity`

#### POI (LTS)
- `AgeFrom`, `AgeTo` → `AdditionalProperties.PoiAgeDataProperties`
- `IsOpen`, `HasFreeEntrance` → `AdditionalProperties.PoiLtsDataProperties`

#### Activity (LTS)
- `AltitudeDifference`, `AltitudeHighestPoint`, `AltitudeLowestPoint`, `AltitudeSumUp`, `AltitudeSumDown`, `DistanceDuration`, `DistanceLength`, `Highlight`, `IsPrepared`, `RunToValley`, `IsWithLigth`, `HasRentals`, `LiftAvailable`, `FeetClimb`, `BikeTransport`, `WayNumber`, `Number`, `IsOpen`, `HasFreeEntrance`

### 4.4. Supported schema.org types

The Content API supports retrieving data in JSON-LD format using schema.org types. The following types are currently supported:
- `Hotel`, `Restaurant`, `Event`, `TouristAttraction`, `Recipe`, `SkiResort`, `Place`

To retrieve data in JSON-LD format, set the `Accept` header:
```http
Accept: application/ld+json
```

## 5. Related

- [Content API reference](/use-data/content-api/reference)
- [Filtering and sorting (Content API)](/use-data/content-api/filtering-and-sorting)
- [Data Browser](/tools/data-browser)
