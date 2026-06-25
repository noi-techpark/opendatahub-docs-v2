---
sidebar_position: 5
---



# AlpineBits integration

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Content API supports integration with the AlpineBits standard, enabling access to tourism data through standardized endpoints. Open Data Hub implements two key datasets defined by the AlpineBits Alliance: HotelData and DestinationData. These datasets are served via separate endpoints and require specific request formatting to retrieve data successfully.

## 1. AlpineBits endpoints in the Content API

The Content API exposes two distinct AlpineBits endpoints, each dedicated to a specific dataset. Ensure you use the correct endpoint and parameters for your use case.

### 1.1. HotelData endpoint

The HotelData dataset provides information related to accommodations and booking, such as room inventory and availability. Access this dataset via the following endpoint:

- **URL**: `https://alpinebits.opendatahub.com/AlpineBits`

This endpoint supports actions like `FreeRooms`, `Inventory Basic`, and `Inventory HotelInfo`, depending on the protocol version used.

### 1.2. DestinationData endpoint

The DestinationData dataset offers structured information about tourism-related entities such as events, mountain areas, trails, and places. The Open Data Hub hosts the reference implementation of the AlpineBits DestinationData standard.

- **URL**: `https://destinationdata.alpinebits.opendatahub.com/`

DestinationData is built using modern web standards including JSON, REST API, Schema.org, and OntoUML. Its core output is the AlpineBits DestinationData Ontology, which defines named entities for consistent data modeling.

:::info
For full details on the DestinationData Ontology and API architecture, refer to the [official DestinationData specification](https://www.alpinebits.org/wp-content/uploads/2021/05/AlpineBits-DestinationData-2021-04.pdf).
:::

## 2. Request requirements

To retrieve data from either AlpineBits endpoint via the Content API, your requests must meet specific requirements.

### 2.1. HTTP method and content type

All requests must:
- Use the **POST** method
- Set the `Content-Type` header to `multipart/form-data`

### 2.2. Required headers

Include the following headers in every request:

| Header | Description |
| :--- | :--- |
| `Authorization` | Use Basic authentication. While not strictly required, provide your email address as the token to aid debugging and support. Example: `Basic user@example.com` |
| `X-AlpineBits-ClientProtocolVersion` | Specify a supported protocol version, such as `2017-10` or `2018-10` |
| `X-AlpineBits-ClientID` | A descriptive identifier for your client or request, e.g., `My test request` |

### 2.3. Action parameter

You must include an `action` parameter in the form data to specify the operation. Valid actions depend on the protocol version and dataset. For example:
- `action=getVersion` retrieves the server version
- `action=FreeRooms` queries available rooms (HotelData only)

See the protocol matrix in the source documentation for full action support by version.

## 3. Example request

The following example demonstrates how to query the HotelData endpoint using the `getVersion` action.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl --location --request POST 'https://alpinebits.opendatahub.com/AlpineBits' \
  --header 'Authorization: Basic user@example.com' \
  --header 'X-AlpineBits-ClientProtocolVersion: 2017-10' \
  --header 'X-AlpineBits-ClientID: My test request' \
  --header 'Content-Type: multipart/form-data' \
  --form 'action=getVersion'
```

</TabItem>
</Tabs>

:::warning
Ensure you use the correct action and headers. Mismatched protocol versions or missing parameters may result in empty or unauthorized responses.
:::

## 4. Additional resources

- [AlpineBits Alliance official website](https://www.alpinebits.org/)
- [DestinationData documentation](https://www.alpinebits.org/destinationdata/)
- [HotelData documentation](https://www.alpinebits.org/hoteldata/)

Related: Query the Content API
