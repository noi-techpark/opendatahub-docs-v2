---
sidebar_position: 1
---



# Time Series API reference

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Time Series API provides access to mobility-related time series data through a unified endpoint structure. This reference describes the API's base structure, available representations, filtering capabilities, query parameters, and response format.

## 1. Base structure and endpoints

The Time Series API uses a single, consistent endpoint pattern to access all mobility datasets. The base host is `https://mobility.api.opendatahub.com`.

### 1.1. Endpoint pattern

The general path structure is:

```
/v2/{representation}/{stationTypes}/{dataTypes}
```

Optionally followed by:
- `/latest` to retrieve the most recent data point
- `/{from}/{to}` to retrieve data within a time range (half-open interval: `from` is included, `to` is excluded)

The `representation` parameter combines two aspects:
- Structure: `flat` or `tree`
- Type: `node`, `edge`, or `event` (optional, comma-separated)

For example: `flat,node`, `tree,edge`

### 1.2. Available endpoints

| Endpoint | Description |
| :--- | :--- |
| `GET /v2/{representation}` | Returns the list of available representations |
| `GET /v2/{representation}/{stationTypes}` | Returns metadata for stations of the given type(s) |
| `GET /v2/{representation}/{stationTypes}/{dataTypes}` | Returns time series data for the specified station and data types |
| `GET /v2/{representation}/{stationTypes}/{dataTypes}/latest` | Returns the latest data point |
| `GET /v2/{representation}/{stationTypes}/{dataTypes}/{from}/{to}` | Returns data within the specified time range |

Use `*` in the `{dataTypes}` (or `{stationTypes}`) segment to match all values. For example, `GET /v2/flat/ParkingStation/*/latest` returns the latest measurement for every data type of every parking station. The `{from}` and `{to}` bounds accept `yyyy-MM-dd` or a full `yyyy-MM-ddTHH:mm:ss` timestamp.

### 1.3. Example: Retrieve all ParkingStation data

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

```go
package main

import (
    "fmt"
    "net/http"
    "io"
)

func main() {
    url := "https://mobility.api.opendatahub.com/v2/flat/ParkingStation"
    resp, err := http.Get(url)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}
```

  </TabItem>
  <TabItem value="curl" label="curl">

```bash
curl "https://mobility.api.opendatahub.com/v2/flat/ParkingStation"
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

url = "https://mobility.api.opendatahub.com/v2/flat/ParkingStation"
response = requests.get(url)
print(response.json())
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
fetch('https://mobility.api.opendatahub.com/v2/flat/ParkingStation')
  .then(response => response.json())
  .then(data => console.log(data));
```

  </TabItem>
</Tabs>

:::info
The `.com` and `.bz.it` domains both serve data. Use `https://mobility.api.opendatahub.com` as the canonical host.
:::

## 2. Representations

The Time Series API supports different data representations to suit various use cases.

### 2.1. Structure: flat vs tree

- `flat`: All metadata and data fields are at the same level. Suitable for simple consumption and flat data models.
- `tree`: Preserves hierarchical relationships between data elements. Useful when parent-child relationships matter.

### 2.2. Type: node, edge, event

- `node`: Represents a measurement station (e.g., a parking sensor or charging station). Includes all associated metadata.
- `edge`: Represents a connection between two stations (e.g., a road segment). Includes start station, end station, and edge-specific metadata (prefixed with `e`, such as `eactive`).
- `event`: Represents discrete events in the mobility network.

The type can be combined with the structure using a comma, for example: `flat,node` or `tree,edge`.

:::info
The `node` representation is equivalent to the pre-2020.10 API output. For backward compatibility, the type can be omitted in requests.
:::

## 3. Query parameters

The Time Series API supports several query parameters to control the response.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `where` | string | no | - | Filter expression using DOT-NOTATION operators |
| `select` | string | no | - | Comma-separated list of fields to include in the response |
| `limit` | integer | no | 200 | Maximum number of results to return. Use -1 to disable limit |
| `offset` | integer | no | 0 | Number of results to skip (for pagination) |
| `distinct` | boolean | no | true | Whether to return distinct results |
| `shownull` | boolean | no | - | Whether to include null values in the response |
| `timezone` | string | no | - | Timezone for datetime fields |
| `origin` | string | no | - | Filter by data origin |

Pagination is handled using `limit` and `offset`. For example, to retrieve results 200 to 399, use `limit=200&offset=200`.

## 4. Filtering with the where parameter

The `where` parameter supports expressive filtering using DOT-NOTATION operators.

### 4.1. Comparison operators

| Operator | Meaning |
| :--- | :--- |
| `eq` | Equal to |
| `neq` | Not equal to |
| `lt` | Less than |
| `gt` | Greater than |
| `lteq` | Less than or equal to |
| `gteq` | Greater than or equal to |
| `re` | Regular expression match |
| `ire` | Case-insensitive regular expression match |
| `in` | In a list of values |
| `nin` | Not in a list of values |

### 4.2. Geospatial operators

| Operator | Meaning |
| :--- | :--- |
| `bbi` | Bounding box intersection: returns items partially within the box |
| `bbc` | Bounding box containment: returns items completely within the box |

Coordinates must be specified in **longitude, latitude** order. Geospatial operators use the form `field.operator.(args)` with a dot before the parenthesis, for example `scoordinate.bbi.(11.1,46.1,11.4,46.5,4326)`. Omitting that dot returns an HTTP 400 parse error.

### 4.3. Logical operators

- `and(...)` : Logical AND between conditions
- `or(...)` : Logical OR between conditions

### 4.4. Examples

:::warning
String values in a `where` expression must be wrapped in double quotes, for example `scode.eq."105"`. An unquoted string value returns an HTTP 400 error. Numeric values are written without quotes (`mvalue.gt.50`). In a shell, wrap the whole URL in single quotes so the double quotes are sent literally.
:::

#### Filter by station code

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl 'https://mobility.api.opendatahub.com/v2/flat/ParkingStation?where=scode.eq."105"'
```

  </TabItem>
  <TabItem value="go" label="Go">

```go
url := `https://mobility.api.opendatahub.com/v2/flat/ParkingStation?where=scode.eq."105"`
```

  </TabItem>
</Tabs>

#### Filter measurements and combine conditions

To filter on a measurement field such as `mvalue`, request a data endpoint by adding a `{dataTypes}` segment (`*` matches all data types). Retrieve measurements above 50 for the station with code `105`:

```bash
curl 'https://mobility.api.opendatahub.com/v2/flat/ParkingStation/*?where=and(scode.eq."105",mvalue.gt.50)'
```

#### Filter by bounding box

Geospatial operators use the form `field.operator.(args)` (note the dot before the parenthesis). Retrieve stations within a geographic area (longitude 11.1 to 11.4, latitude 46.1 to 46.5, SRID 4326):

```bash
curl "https://mobility.api.opendatahub.com/v2/flat/ParkingStation?where=scoordinate.bbi.(11.1,46.1,11.4,46.5,4326)"
```

:::warning
Always use longitude, latitude order. Using latitude, longitude will result in incorrect filtering.
:::

## 5. Response format

All Time Series API responses are JSON objects with a consistent envelope structure:

```json
{
  "offset": 0,
  "limit": 200,
  "data": [
    // Array of result objects
  ]
}
```

- `offset`: The number of skipped results
- `limit`: The maximum number of results returned
- `data`: The actual payload, an array of objects containing the requested data

When `limit` is set to `-1`, all results are returned without pagination.

## 6. OpenAPI specification

The complete API is documented in the OpenAPI specification, available at:

[https://mobility.api.opendatahub.com/v2/apispec](https://mobility.api.opendatahub.com/v2/apispec)

You can explore and test the API interactively using the Swagger UI at:

[https://swagger.opendatahub.com/?url=https://mobility.api.opendatahub.com/v2/apispec](https://swagger.opendatahub.com/?url=https://mobility.api.opendatahub.com/v2/apispec)

## 7. Example station types

The Time Series API supports multiple station types. Common examples include:
- `ParkingStation`: Parking facilities and sensors
- `EChargingStation`: Electric vehicle charging stations
- `Flight`: Flight-related mobility data

These are not separate APIs but different values for the `{stationTypes}` path parameter.

## 8. Related

- [Quickstart: your first request](/quickstart)
- [Filtering time series data](/use-data/time-series-api/filtering)
- [Authentication for protected datasets](/use-data/authentication-and-access/authentication)
