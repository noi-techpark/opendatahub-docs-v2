---
sidebar_position: 1
---



# Transmodel API: NeTEx and SIRI-Lite

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Transmodel API provides standardized access to both static and real-time mobility data in compliance with European and Italian interoperability standards. It supports two key formats: NeTEx for scheduled data and SIRI-Lite for real-time updates. This API is part of the MaaS4Italy initiative and integrates with the Open Data Hub, enabling third-party applications to retrieve mobility information through the National Access Point (NAP).

## 1. NeTEx Endpoints

The Transmodel API delivers static mobility data in NeTEx (Network Timetable Exchange) format, the European standard for public transport schedules, infrastructure, and related services. These endpoints are designed for applications requiring consistent, planned data such as timetables, parking facilities, and shared mobility services.

The Transmodel API ensures compatibility with the NeTEx Italian profile, supporting national interoperability requirements under the MaaS4Italy initiative.

### 1.1. Available Endpoints

All NeTEx endpoints use the `GET` method and return data in XML format according to the NeTEx schema.

| Endpoint | Description |
| :--- | :--- |
| `/netex` | Returns a full NeTEx export of all available data from the Open Data Hub, including public transport schedules and infrastructure. |
| `/netex/parking` | Provides a partial NeTEx export focused on parking facilities, including locations, capacities, and metadata. |
| `/netex/flights` | Delivers flight-related data in NeTEx format. |
| `/netex/sharing` | Includes data on bike- or car-sharing services, such as station locations, available vehicles, and operator information. |

:::warning
The NeTEx format is intended for static, scheduled data and may not be suitable for real-time use cases. Parsing NeTEx XML responses requires familiarity with the schema structure and may involve additional processing on the client side.
:::

### 1.2. Example Request

Retrieve the full NeTEx dataset:

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    url := "https://transmodel.api.opendatahub.com/netex"
    resp, err := http.Get(url)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    fmt.Printf("Status: %s\n", resp.Status)
    // Handle XML response
}
```

</TabItem>
  <TabItem value="curl" label="curl">

```bash
curl "https://transmodel.api.opendatahub.com/netex"
```

</TabItem>
  <TabItem value="python" label="Python">

```python
import requests

url = "https://transmodel.api.opendatahub.com/netex"
response = requests.get(url)

print(f"Status: {response.status_code}")
print(response.text)  # XML content
```

</TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
fetch('https://transmodel.api.opendatahub.com/netex')
  .then(response => {
    console.log(`Status: ${response.status}`);
    return response.text();
  })
  .then(data => console.log(data)) // XML content
  .catch(error => console.error('Error:', error));
```

</TabItem>
</Tabs>

## 2. SIRI-Lite Endpoints

The Transmodel API includes SIRI-Lite (Service Interface for Real-Time Information) endpoints to deliver real-time mobility data. These RESTful APIs provide live updates on parking availability and shared mobility services, enabling dynamic applications such as journey planners and mobility dashboards.

The base URL for all SIRI-Lite services is `https://efa.sta.bz.it`.

### 2.1. Facility Monitoring Endpoints

These endpoints support real-time monitoring of parking and sharing facilities.

| Endpoint | Description |
| :--- | :--- |
| `/siri-lite/facility-monitoring` | General endpoint for real-time updates on both parking and sharing facilities, including status, occupancy, and availability. |
| `/siri-lite/facility-monitoring/parking` | Provides real-time data on parking facility status, available spaces, and occupancy. |
| `/siri-lite/facility-monitoring/sharing` | Delivers real-time data on shared mobility services, including available vehicles, operator details, and station status. |

### 2.2. Other SIRI-Lite Services

Additional SIRI-Lite services are published by STA and accessible under the same base URL.

| Endpoint | Description |
| :--- | :--- |
| `/siri-lite/estimated-timetable` | Exchanges estimated schedules in real time, including updates to planned departures and arrivals. |
| `/siri-lite/vehicle-monitoring` | Provides information about vehicle movement and progress against the scheduled timetable. |
| `/siri-lite/situation-exchange` | Delivers information about incidents, disruptions, or planned events affecting public transport. |

### 2.3. Filtering Options

The SIRI-Lite endpoints support flexible query parameters to refine results.

| Filter | Description |
| :--- | :--- |
| `facilityRef` | Filter by a specific facility identifier (e.g., parking lot or sharing station ID). |
| `location` | Retrieve data for facilities near a geographic point, specified as latitude and longitude (e.g., `46.4983,11.3548`). |
| `operator` | Narrow results by the operator of the service (e.g., bike-sharing provider). |

### 2.4. Example Request

Fetch real-time status for all parking facilities:

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    url := "https://efa.sta.bz.it/siri-lite/facility-monitoring/parking"
    resp, err := http.Get(url)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    fmt.Printf("Status: %s\n", resp.Status)
    // Handle XML or JSON response
}
```

</TabItem>
  <TabItem value="curl" label="curl">

```bash
curl "https://efa.sta.bz.it/siri-lite/facility-monitoring/parking"
```

</TabItem>
  <TabItem value="python" label="Python">

```python
import requests

url = "https://efa.sta.bz.it/siri-lite/facility-monitoring/parking"
response = requests.get(url)

print(f"Status: {response.status_code}")
print(response.text)
```

</TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
fetch('https://efa.sta.bz.it/siri-lite/facility-monitoring/parking')
  .then(response => {
    console.log(`Status: ${response.status}`);
    return response.text();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

</TabItem>
</Tabs>

:::warning
Authentication requirements and rate limits for the SIRI-Lite endpoints are not publicly documented. If you encounter access issues or need higher quotas, contact help@opendatahub.com for support.
:::

## 3. Additional Resources

- **Swagger Documentation**: Explore the Transmodel API interactively using the [Swagger interface](https://swagger.opendatahub.com/?url=https://transmodel.api.opendatahub.com/apispec#/).
- **GitHub Repository**: Access source code, validation scripts, and tools in the [Transmodel API GitHub repository](https://github.com/noi-techpark/transmodel-api).
- **National Access Point**: The Transmodel API is integrated with the Open Data Hub and accessible through the National Access Point (NAP), serving as the official gateway for MaaS4Italy data distribution. Visit the [NAP catalog](https://www.cciss.it/nap/mmtis/public/catalog/Organisation/1381) for published datasets.

For further assistance, contact the Open Data Hub team at [help@opendatahub.com](mailto:help@opendatahub.com).
