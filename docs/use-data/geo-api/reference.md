---
sidebar_position: 1
---


# Geo API

The Geo API provides fast, map-optimized access to Open Data Hub geospatial datasets — points of interest, hiking trails, cycleways, and more — served as vector tiles for efficient rendering at any zoom level.

It is designed specifically to solve performance and quota issues that come from loading large geometry-heavy datasets through the Content (REST) API. Use the Geo API to **display data on a map**; use the [Content API](../content-api/reference) to **fetch full detail records**.



## 1. Base URL and entry points

The base URL for the Geo API is:

```
https://geo.api.opendatahub.com/
```

For interactive exploration, use the Swagger UI:

[https://geo.api.opendatahub.com/swagger/index.html](https://geo.api.opendatahub.com/swagger/index.html)


Worked examples showing how to display Geo API data on a map:

[https://geo.api.opendatahub.com/examples/](https://geo.api.opendatahub.com/examples/)


Source code:

[https://github.com/noi-techpark/opendatahub-geo-api](https://github.com/noi-techpark/opendatahub-geo-api)




## 2. When to use the Geo API vs. the Content API

| Use case | Recommended API |
|---|---|
| Displaying points or geometries on a map | **Geo API** |
| Displaying the full detail of a single item | **Content (REST) API** |
| Weather forecast data | Content (REST) API only |
| People Counter / time series data | Content (REST) API only (Timeseries support on the Geo API is planned — see [Known limitations](#5-known-limitations)) |

## 3. Operation modes

The Geo API supports three `operationmode` values, which control how geometries are returned:

- `points` — returns point geometries only
- `tracks` — returns line/track geometries only
- `pointsandtracks` — returns both

By default, tracks become visible starting at **zoom level 12**. This can be overridden with the `displaytracksonzoomlevel` parameter.

## 4. Datasets

### 4.1. SpatialData endpoint (recommended)

For datasets such as HikingTrails, Cycleways, and similar geometry-based POIs, use the new `SpatialData` endpoint. It replaces the older `ODHActivityPoi` / `GeoShape` endpoints, which are now considered obsolete for this purpose.

The `Announcement` endpoint is unaffected by this change and continues to work as before.

### 4.2. Large datasets

Two datasets available through `SpatialData` are very large (roughly 600,000 records each):

- `euregio.roadnetwork`
- `euregio.routes`

These can still be retrieved, but response times may be slow. Caching for these sources is planned but not yet implemented (work in progress).

## 5. Known limitations

- **Weather forecasts** are served directly by the province and cannot currently be processed into vector tiles, so they remain available only through the Content (REST) API.
- **People Counter** data is only available via the Timeseries REST API. Timeseries support on the Geo API is planned for a future release.
- **Caching** for the large `euregio.roadnetwork` and `euregio.routes` sources has not yet been implemented, so expect slower responses for these two sources specifically.

## 6. Getting started

1. Browse available layers and try requests directly in [Swagger](https://geo.api.opendatahub.com/swagger).
2. Review the [worked examples](https://geo.api.opendatahub.com/examples/) for map integration patterns (e.g. MapLibre/Leaflet vector tile layers).
3. Choose an `operationmode` (`points`, `tracks`, or `pointsandtracks`) based on what you need to display.
4. For anything requiring full record detail rather than map display, switch to the corresponding Content API endpoint (e.g. `ODHActivityPoi/{id}`, `Announcement/{id}`).

## 7. Related

- [Content API reference](https://docs.opendatahub.com/use-data/content-api/reference)
- [Geo API GitHub repository](https://github.com/noi-techpark/opendatahub-geo-api)
- [Geo API Swagger UI](https://geo.api.opendatahub.com/swagger)
- [Geo API examples](https://geo.api.opendatahub.com/examples/)
