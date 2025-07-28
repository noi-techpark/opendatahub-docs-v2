---
sidebar_position: 1
slug: /collector-blueprints/rest-push
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Rest Push Collector

The **Rest Push** collector acts as a generic endpoint where external data providers can **push** their data directly to the Open Data Hub. This means you, as a data provider, don't need to deploy any additional software or agents on your side. Instead, you'll be provided with specific credentials and a URL, and you can simply send your data via standard HTTP POST requests.

This collector is ideal for scenarios where:
* You have an existing system that can make HTTP requests.
* You want a straightforward way to send data without managing complex data pipelines or security configurations yourself.
* Your data naturally fits into a "push" model (e.g., event streams, periodic reports).

:::info
Implementation reference: 

[https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors/rest-push](https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors/rest-push)
:::

## Key Features

* **HTTP POST Endpoint**: A dedicated URL to receive incoming data.
* **Secure Authentication**: Leverages Keycloak for OAuth2-based authentication using client credentials.
* **Fine-grained Authorization**: Employs Keycloak UMA (User-Managed Access) to control access to specific data streams (`provider`/`dataset` paths).
* **Simple Data Ingestion**: Data is sent directly in the request body, supporting various content types.

## How to Configure and Use It (for Data Providers)

To utilize the Inbound REST API collector, you will primarily interact with the Open Data Hub through API calls. The Open Data Hub team will handle the underlying deployment and Keycloak setup, providing you with the necessary access details.

### 1. Obtain Credentials and Endpoint URL

Before you can push data, the Open Data Hub team will provide you with:
* A **Keycloak `client_id`** and `client_secret`.
* The **Keycloak authentication URL** (token endpoint).
* Your specific **`<provider>`** and **`<dataset>`** identifiers, which define the path for your data.

<Tabs>
<TabItem value="production" label="Production Environment">

For the **Production** environment, the base URL for the Inbound REST API collector is:

`https://push.api.opendatahub.com`

</TabItem>
<TabItem value="testing" label="Testing Environment">

For the **Testing** environment, the base URL for the Inbound REST API collector is:

`https://push.api.dev.opendatahub.testingmachine.eu`

</TabItem>
</Tabs>

### 2. Get an Access Token

All data pushes require an OAuth2 access token for authentication. You'll use the `client_credentials` grant type with your provided `client_id` and `client_secret`.

Here's how you can obtain an access token using `curl`:

```bash
# Replace with your actual Keycloak URL, Realm, Client ID, and Client Secret
KEYCLOAK_TOKEN_URL="YOUR_KEYCLOAK_AUTH_URL/realms/YOUR_KEYCLOAK_REALM/protocol/openid-connect/token"
CLIENT_ID="your-client-id"
CLIENT_SECRET="your-client-secret"

ACCESS_TOKEN=$(curl -s -X POST "${KEYCLOAK_TOKEN_URL}" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" | jq -r '.access_token')

echo "Obtained Access Token: ${ACCESS_TOKEN}"
````

  * **`YOUR_KEYCLOAK_AUTH_URL`**: The base URL of your Keycloak instance (e.g., `https://auth.opendatahub.example.com`).
  * **`YOUR_KEYCLOAK_REALM`**: The specific realm configured for your Open Data Hub environment.
  * **`your-client-id`**: The `client_id` provided by the Open Data Hub team.
  * **`your-client-secret`**: The `client_secret` associated with your `client_id`.
  * `jq -r '.access_token'`: This uses `jq` to parse the JSON response and extract only the access token. Make sure `jq` is installed on your system (`sudo apt-get install jq` or `brew install jq`).

The `ACCESS_TOKEN` variable will now hold your valid token, which typically expires after a short period (e.g., 5 minutes). You'll need to re-fetch a new token when it expires.

### 3. Push Your Data

Once you have an `ACCESS_TOKEN`, you can push your data to the collector's endpoint.

The endpoint format is:
`YOUR_COLLECTOR_BASE_URL/push/<provider>/<dataset>`

  * **`YOUR_COLLECTOR_BASE_URL`**: The base URL for the Inbound REST API collector.
  * **`<provider>`**: Your unique identifier as a data provider.
  * **`<dataset>`**: The identifier for the specific dataset you are pushing.

Here's a `curl` example for pushing JSON data:

```bash
# Replace with your actual collector base URL, provider, dataset, and your JSON payload
COLLECTOR_URL="YOUR_COLLECTOR_BASE_URL/push/your-provider-id/your-dataset-id"
DATA_PAYLOAD='{"timestamp": "2025-07-24T12:00:00Z", "value": 123.45, "unit": "°C"}'

curl -s -X POST "${COLLECTOR_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "${DATA_PAYLOAD}"
```

  * **`Content-Type` header**: Set this to match the format of your `DATA_PAYLOAD` (e.g., `application/json`, `text/csv`, etc.).
  * **`Authorization: Bearer ${ACCESS_TOKEN}`**: This header is crucial for authenticating your request.

Upon successful push, you will receive a `200 OK` response with a message confirming data acceptance and a unique ID for the pushed message.

### Understanding Authorization (Keycloak UMA)

The collector uses Keycloak's User-Managed Access (UMA) for fine-grained authorization. This means that even with a valid access token, your client needs specific *permissions* to push data to a particular `/<provider>/<dataset>` path.

The Open Data Hub team will configure these permissions in Keycloak for you. They will create a "resource" representing your data stream (e.g., `/provider-id/dataset-id`), define a "policy" that specifies who (your client) can access it, and then link them via a "permission". This ensures that only authorized clients can send data to designated endpoints.

### Other Endpoints

  * **`/health` (GET)**: A simple health check endpoint to verify if the collector service is running.
  * **`/apispec` (GET)**: Provides the OpenAPI 3.0 specification (YAML format) for the collector's API, which can be useful for developers integrating with the service.
