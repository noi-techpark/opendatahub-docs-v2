---
sidebar_position: 1
slug: /
---

# What is the Open Data Hub?

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Open Data Hub is an open data platform for South Tyrol and beyond. It exposes datasets through REST APIs that return JSON, so you can pull live data into apps, websites, dashboards, and integrations. Most data is open and needs no authentication to read.

There are two ways people work with the Open Data Hub, and this documentation is organized around them:

- **Use the data**: call the APIs to read mobility and tourism data. Start with the [Quickstart](/quickstart), then the [Content API](/use-data/content-api/reference) and [Time Series API](/use-data/time-series-api/reference) references.
- **Bring data in**: build a collector and transformer to ingest a new data source. See [Data Ingestion](/data-ingestion/getting-started).

<div className="row">
  <div className="col col--4 margin-bottom--md">
    <a className="card padding--lg" href="/quickstart" style={{height: '100%'}}>
      <h3>Quickstart</h3>
      <p>Make your first API request and read the response.</p>
    </a>
  </div>
  <div className="col col--4 margin-bottom--md">
    <a className="card padding--lg" href="/tools/discovery" style={{height: '100%'}}>
      <h3>Discover datasets</h3>
      <p>Find the dataset and fields you need before you query.</p>
    </a>
  </div>
  <div className="col col--4 margin-bottom--md">
    <a className="card padding--lg" href="/use-data/content-api/reference" style={{height: '100%'}}>
      <h3>Content API</h3>
      <p>Read tourism content: accommodations, events, points of interest.</p>
    </a>
  </div>
  <div className="col col--4 margin-bottom--md">
    <a className="card padding--lg" href="/use-data/time-series-api/reference" style={{height: '100%'}}>
      <h3>Time Series API</h3>
      <p>Read mobility measurements from stations and sensors.</p>
    </a>
  </div>
  <div className="col col--4 margin-bottom--md">
    <a className="card padding--lg" href="/data-ingestion/getting-started" style={{height: '100%'}}>
      <h3>Bring data in</h3>
      <p>Build a collector and transformer to ingest a new source.</p>
    </a>
  </div>
  <div className="col col--4 margin-bottom--md">
    <a className="card padding--lg" href="/tools/data-browser" style={{height: '100%'}}>
      <h3>Inspect and visualize</h3>
      <p>Browse content in the Data Browser or chart it in Analytics.</p>
    </a>
  </div>
</div>

## 1. What data is available

Data is grouped into **domains**:

- **Mobility**: public transport, parking, e-charging stations, traffic, and other time series from sensors and stations.
- **Tourism**: accommodations, events, points of interest, activities, and related content.
- **Other**: datasets that do not fit the two main domains.

Domains overlap intentionally: public-transport data lives in Mobility but is useful for tourism apps too. See [Domains and datasets](/domains-and-datasets) for how datasets are addressed and what metadata each carries.

## 2. How you access it

Every dataset is a REST endpoint that returns JSON. You can open an endpoint in a browser to explore it, or call it from any HTTP client. For example, to fetch tourism points of interest from the Content API:

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

The two APIs differ in shape: the Content API serves tourism entities, while the Time Series API serves mobility measurements. Their references cover endpoints, parameters, filtering, and response formats.

## 3. Also see

- [Domains and datasets](/domains-and-datasets): how data is organized and addressed.
- [Data licensing](/licensing): what you can do with the data.
- [Tools](/tools/discovery): Discovery, Data Browser, and Analytics for finding and inspecting data.

## 4. Report an issue or contribute

The Open Data Hub is open source and community-driven.

- Found a bug in an API or a gap in a dataset? Open an issue in the [NOI Techpark GitHub organization](https://github.com/noi-techpark).
- Want to contribute data or build a collector? Start with the [Data Ingestion guide](/data-ingestion/getting-started).
- Documentation feedback: `help@opendatahub.com`.

:::info
APIs are designed for stability, but check the reference docs before relying on an endpoint in production, as the platform evolves.
:::
