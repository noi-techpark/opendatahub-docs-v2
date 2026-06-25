---
sidebar_position: 1
---



# Ingesting time series data

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

To ingest time-series data into the Open Data Hub, you must develop a data transformer that processes raw data and pushes standardized measurements to the Time Series API. This process involves authentication, metadata registration, and data publication using the Timeseries Writer API.

## 1. Authenticating with the Timeseries Writer API

The Timeseries Writer API requires OAuth2 authentication for data ingestion. Your transformer must obtain an access token from Keycloak and include it in the `Authorization` header of all requests.

### 1.1. Obtaining an access token

Use the client credentials grant type to request an access token from Keycloak. You must have valid `client_id` and `client_secret` credentials issued for your service.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -X POST -L "https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token" \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode 'client_id=odh-mobility-datacollector-development' \
  --data-urlencode 'client_secret=<your-client-secret>'
```

  </TabItem>
</Tabs>

The response includes a JSON object with the `access_token`. Extract this value and use it in subsequent API calls.

:::warning
Access tokens expire after a set period. Your transformer must handle token expiration by re-authenticating and refreshing the token to ensure continuous data ingestion.
:::

### 1.2. Making authenticated requests

Include the access token in the `Authorization` header of every request to the Timeseries Writer API.

```http
Authorization: Bearer <access_token>
```

Failure to include a valid token results in a `401 Unauthorized` response.

:::warning
Never expose client credentials or tokens in source code, logs, or version control. Store them securely using environment variables or a secrets manager.
:::

## 2. Registering metadata

Before pushing time-series data, you must register essential metadata: provenance, data types, and stations. These operations are typically performed once at startup and are idempotent.

### 2.1. Registering provenance

Provenance identifies the source of the data. Send a POST request to the provenance endpoint with your data collector details.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -X POST https://share.opendatahub.testingmachine.eu/json/provenance \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dataCollector": "MyCollector",
    "dataCollectorVersion": "1.0",
    "lineage": "Source XYZ"
  }'
```

  </TabItem>
</Tabs>

The response includes a UUID that must be stored and used in all data pushes to attribute the data correctly.

:::warning
Data submissions without a valid provenance UUID are rejected. Ensure you register provenance before attempting to push data.
:::

### 2.2. Registering data types

Define the types of measurements your transformer will publish. Each data type includes a name, unit, period, and other metadata.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -X POST https://share.opendatahub.testingmachine.eu/json/syncDataTypes \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "temperature",
    "description": "Ambient temperature",
    "period": 3600,
    "unit": "°C",
    "rtype": "raw",
    "metadata": {}
  }'
```

  </TabItem>
</Tabs>

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | string | yes | - | Unique identifier for the data type. |
| `description` | string | no | - | Human-readable description. |
| `period` | integer | yes | - | Expected time interval between measurements in seconds. |
| `unit` | string | yes | - | Unit of measurement (e.g., °C, km/h). |
| `rtype` | string | yes | - | Type of data; use `raw` for unprocessed measurements. |
| `metadata` | object | no | `{}` | Additional key-value pairs for context. |

Repeated registration of the same data type is safe and will not create duplicates.

### 2.3. Registering stations

Stations represent physical locations where measurements are taken. Synchronize station metadata to ensure consistency.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -X POST https://share.opendatahub.testingmachine.eu/json/stations \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "st001",
    "name": "Station One",
    "origin": "MyCollector",
    "latitude": 46.6,
    "longitude": 11.3,
    "municipality": "Bolzano"
  }'
```

  </TabItem>
</Tabs>

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | yes | - | Unique station identifier. |
| `name` | string | yes | - | Human-readable name. |
| `origin` | string | yes | - | Name of the data collector. |
| `latitude` | number | yes | - | Geographic latitude in decimal degrees. |
| `longitude` | number | yes | - | Geographic longitude in decimal degrees. |
| `municipality` | string | no | - | Administrative area. |

Station synchronization ensures the Open Data Hub has up-to-date location metadata.

## 3. Using the Go SDK for data ingestion

The official Go SDK simplifies interaction with the Timeseries Writer API by handling authentication, metadata synchronization, and data publication.

The `go-bdp-client` SDK provides type-safe methods for pushing time-series data and managing metadata lifecycle.

### 3.1. SDK installation

The SDK is available at [github.com/noi-techpark/go-bdp-client](https://github.com/noi-techpark/go-bdp-client). Import it into your Go project:

```go
import "github.com/noi-techpark/go-bdp-client"
```

### 3.2. Key features

The SDK handles:
- OAuth2 authentication and token refresh
- Provenance, data type, and station registration
- Idempotent data pushes
- Error handling and retries

Using the SDK reduces boilerplate code and ensures compliance with API requirements.

## 4. Pushing time-series measurements

After registering metadata, your transformer can push time-series data. The exact endpoint and payload structure depend on your data model, but all requests must include the `Authorization` header with a valid access token.

Ensure your transformer is idempotent: processing the same raw data multiple times should not create duplicates. The Timeseries Writer API discards older duplicate records, but your logic should avoid side effects.

For further development, refer to the Developing a Data Transformer from Scratch guide and the SDKs reference.
