---
sidebar_position: 2
---

# Quickstart: your first request

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide follows the path most developers take: find the dataset you need, inspect it, then read it from the API. Most Open Data Hub data is open and needs no authentication.

## 1. Discover the dataset

Start at [Discovery](https://discovery.opendatahub.com) to find the right dataset and understand its structure. You can search datasets by keyword, tag, or domain, inspect each dataset's schema (its fields and their types), and read field-level statistics that tell you whether a field is actually populated. See the [Discovery tool page](/tools/discovery) for details.

Knowing the dataset and the fields you need up front saves you from guessing at parameters later.

## 2. Inspect the data

Before (or instead of) writing code, you can look at the data directly:

- **[Data Browser](/tools/data-browser)**: browse and filter tourism content (events, accommodations, points of interest) in a table and see the exact fields the Content API returns.
- **[Analytics](/tools/analytics)**: chart mobility time series over a chosen time range to see how a measurement behaves before you query it.

## 3. Make your first request

Every dataset is a REST endpoint that returns JSON.

### 3.1. Content API

To retrieve activity points of interest (POIs), send a `GET` request to the `ODHActivityPoi` endpoint:

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

```go
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    resp, err := http.Get("https://tourism.api.opendatahub.com/v1/ODHActivityPoi")
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
curl "https://tourism.api.opendatahub.com/v1/ODHActivityPoi"
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

response = requests.get("https://tourism.api.opendatahub.com/v1/ODHActivityPoi")
print(response.json())
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
fetch('https://tourism.api.opendatahub.com/v1/ODHActivityPoi')
  .then(response => response.json())
  .then(data => console.log(data));
```

  </TabItem>
</Tabs>

:::info
The Content API returns a response envelope with `TotalResults`, `TotalPages`, `CurrentPage`, and an `Items` array. For the full list of endpoints, parameters, and filters, see the [Content API reference](/use-data/content-api/reference).
:::

### 3.2. Time Series API

To retrieve all parking stations, call the `flat` representation of the `ParkingStation` type:

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

```go
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    resp, err := http.Get("https://mobility.api.opendatahub.com/v2/flat/ParkingStation")
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

response = requests.get("https://mobility.api.opendatahub.com/v2/flat/ParkingStation")
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
The Time Series API returns an envelope with `offset`, `limit`, and a `data` array, and caps results at 200 by default. Page through more with `limit` and `offset`. For the full endpoint structure and the `where` filter, see the [Time Series API reference](/use-data/time-series-api/reference).
:::

### 3.3. Try it in Swagger

Both APIs publish an interactive Swagger UI where you can build and run requests in the browser:

- [Content API Swagger](https://tourism.api.opendatahub.com/swagger/index.html)
- [Time Series API Swagger](https://swagger.opendatahub.com/?url=https://mobility.api.opendatahub.com/v2/apispec)

## 4. Next steps

- Read the [Content API reference](/use-data/content-api/reference) for tourism entities, parameters, and filtering.
- Read the [Time Series API reference](/use-data/time-series-api/reference) for the mobility endpoint structure and the `where` filter.
- Learn about [authentication](/use-data/authentication-and-access/authentication) if you need access to restricted data.
- Explore [quotas, the CLI, and the R package](/use-data/authentication-and-access/quotas-and-tools) for alternative access methods.
