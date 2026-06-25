---
sidebar_position: 2
---



# Filtering time series data

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Time Series API supports flexible filtering of mobility data using the `where` query parameter with dot-notation operators. This enables precise retrieval of station and time series data based on attribute values, spatial relationships, and logical combinations. Unlike SQL, the filter syntax uses a functional, dot-separated format that is both human-readable and URL-safe.

## 1. Filter syntax and operators

Filtering in the Time Series API is performed via the `where` parameter, which accepts expressions using dot-notation operators. These operators compare field values against literals or expressions and return matching records.

### 1.1 Supported operators

The following operators are available for constructing filter expressions:

| Operator | Description | Example |
| :--- | :--- | :--- |
| `eq` | Equal to | `scode.eq."P123"` |
| `neq` | Not equal to | `sorigin.neq."internal"` |
| `lt` | Less than | `mvalue.lt.50` |
| `gt` | Greater than | `mvalue.gt.100` |
| `lteq` | Less than or equal to | `smetadata.capacity.lteq.200` |
| `gteq` | Greater than or equal to | `smetadata.capacity.gteq.50` |
| `re` | Regular expression match | `sname.re."Parking.*"` |
| `ire` | Case-insensitive regex match | `sname.ire."parking.*"` |
| `in` | Value is in list | `scode.in.("P1","P2","P3")` |
| `nin` | Value is not in list | `scode.nin.("P4","P5")` |
| `bbi` | Bounding box intersects | `scoordinate.bbi.(11.1,46.1,11.4,46.5,4326)` |
| `bbc` | Bounding box contains | `scoordinate.bbc.(11.1,46.1,11.4,46.5,4326)` |
| `dlt` | Distance less than (meters) | `scoordinate.dlt.(3000,11.158682,46.668853,4326)` |
| `and(...)` | Logical AND of conditions | `and(scode.eq."P1",mvalue.gt.50)` |
| `or(...)` | Logical OR of conditions | `or(scode.eq."P1",scode.eq."P2")` |

:::info
Rules verified against the live API:
- String values must be wrapped in double quotes: `scode.eq."105"`. An unquoted string returns HTTP 400. Numeric values take no quotes: `mvalue.gt.50`. In a shell, wrap the whole URL in single quotes so the double quotes are sent literally.
- Geospatial and list operators use the form `field.operator.(args)` with a dot before the parenthesis (`scoordinate.bbi.(...)`, `scode.in.("P1","P2")`). Omitting the dot returns a parse error.
- Station metadata fields are addressed under `smetadata` (for example `smetadata.capacity`), not as bare names. Measurement fields such as `mvalue` are only available when the request targets a data endpoint (a `{dataTypes}` segment, for example `/v2/flat/ParkingStation/*`).
:::

:::warning
The `tagfilter` and `source` parameters are not supported in the Time Series API. These are specific to the Content API and will be ignored if used in Time Series API requests.
:::

### 1.2 Logical operators

You can combine multiple conditions using `and(...)` and `or(...)` functions. These accept comma-separated filter expressions as arguments.

For example, to retrieve measurements above 50 for the parking station with code `P123` (a `{dataTypes}` segment, here `*`, is required to filter on the measurement field `mvalue`):

<Tabs groupId="lang">
<TabItem value="go" label="Go" default>

```go
url := `https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation/*?where=and(scode.eq."P123",mvalue.gt.50)`
resp, err := http.Get(url)
```

</TabItem>
<TabItem value="curl" label="curl">

```bash
curl 'https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation/*?where=and(scode.eq."P123",mvalue.gt.50)'
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

url = "https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation/*"
params = {"where": 'and(scode.eq."P123",mvalue.gt.50)'}
response = requests.get(url, params=params)
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
fetch('https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation/*?where=and(scode.eq."P123",mvalue.gt.50)')
  .then(response => response.json())
  .then(data => console.log(data));
```

</TabItem>
</Tabs>

## 2. Spatial filtering

The Time Series API provides several operators for geographic filtering of station data.

### 2.1 Distance-based filtering with `dlt`

The `dlt` (distance less than) operator filters stations within a specified radius (in meters) from a geographic point. It uses the WGS84 coordinate system (SRID 4326) by default.

Syntax: `coordinate.dlt.(distance, longitude, latitude, SRID?)` (note the dot before the parenthesis)

- `distance`: radius in meters (required)
- `longitude`: point-x (required)
- `latitude`: point-y (required)
- `SRID`: spatial reference system (optional, defaults to 4326)

<Tabs groupId="lang">
<TabItem value="go" label="Go" default>

```go
resp, err := http.Get("https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation?where=scoordinate.dlt.(3000,11.158682,46.668853,4326)")
```

</TabItem>
<TabItem value="curl" label="curl">

```bash
curl "https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation?where=scoordinate.dlt.(3000,11.158682,46.668853,4326)" -H "Authorization: Bearer $TOKEN"
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

url = "https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation"
params = {"where": "scoordinate.dlt.(3000,11.158682,46.668853,4326)"}
headers = {"Authorization": "Bearer <your-token>"}
response = requests.get(url, params=params, headers=headers)
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
fetch('https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation?where=scoordinate.dlt.(3000,11.158682,46.668853,4326)', {
  headers: { 'Authorization': 'Bearer <your-token>' }
})
```

</TabItem>
</Tabs>

:::warning
Ensure the coordinate order is (longitude, latitude). Many mapping tools display coordinates as (latitude, longitude), which will produce incorrect results if used directly.
:::

### 2.2 Bounding box filtering

For rectangular area filtering, use `bbi` (bounding box intersects) or `bbc` (bounding box contains).

- `bbi`: returns stations whose coordinates intersect the box
- `bbc`: returns stations whose coordinates are fully contained in the box

Syntax: `coordinate.bbi.(minx,miny,maxx,maxy,SRID?)` or `coordinate.bbc.(...)` (note the dot before the parenthesis)

Example: retrieve stations within bounding box around Bolzano

```
https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation?where=scoordinate.bbi.(11.1,46.1,11.4,46.5,4326)
```

## 3. Field selection and pagination

In addition to filtering, you can control the response format and volume using other query parameters.

### 3.1 Selecting fields

Use the `select` parameter to specify which fields to include in the response. This reduces payload size and improves performance.

Example: retrieve only station code and capacity

```
https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation?select=scode,smetadata.capacity&where=smetadata.capacity.gteq.100
```

### 3.2 Pagination

Use `limit` and `offset` to paginate large result sets.

- `limit`: number of records per page (default varies by endpoint)
- `offset`: number of records to skip

Example: get second page of 50 records

```
https://mobility.api.opendatahub.com/v2/flat,node/ParkingStation?limit=50&offset=50
```

Other supported parameters include `distinct`, `shownull`, `timezone`, and `origin`.

## 4. Best practices and caveats

:::warning
Avoid overly restrictive filters that may return empty results. Complex `and(...)` conditions especially can exclude all data if any condition is unmet.
:::

- Test filters incrementally, starting with broad conditions and narrowing down
- Use `or(...)` when you need alternative conditions; `and(...)` requires all conditions to match
- Validate coordinate order when using spatial filters
- Be aware that field names (like `scoordinate`) may vary by station type; consult the API documentation for your specific dataset
- The `dlt` operator provides a more intuitive alternative to bounding box filters for proximity searches

For more information on available station types and data models, see the [Time Series API reference](/use-data/time-series-api/reference).
