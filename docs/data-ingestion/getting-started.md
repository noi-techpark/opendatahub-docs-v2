---
sidebar_position: 1
slug: /getting-started
---

# Getting Started

This guide provides a comprehensive overview of setting up your local development environment for Open Data Hub data collectors and transformers, focusing on Go-based implementations. You'll learn how to leverage Docker Compose for infrastructure, interact with essential endpoints, handle authentication for the Timeseries Writer, and get hands-on with creating and testing a collector and a transformer.

## 1. Understanding the Data Integration Pipeline

A typical Open Data Hub data integration pipeline involves two primary microservices:

* **Data Collector**: Responsible for collecting raw data from external data providers and publishing it to a message queue.
* **Transformer**: Listens for raw data events from the message queue, transforms the raw data into the Open Data Hub API format, and pushes it to the `opendatahub-timeseries-writer` (BDP).

The data flow is as follows:

![ingestion flow](/img/documentation/ingestion-flow.svg)

Between the data collector and transformer, a raw data database and API are used. The transformer receives a notification event and requests the actual raw data from the raw data API. This interaction is fully handled by the SDK.

## 2. Setting up your Local Development Environment

The [infrastructure-v2](https://github.com/noi-techpark/infrastructure-v2) repository provides Docker Compose files to replicate the Open Data Hub infrastructure locally.

### Prerequisites

* Docker
* Docker Compose

### 2.1. Basic Infrastructure Setup

To start the core infrastructure without any domain-specific APIs:

```bash
git clone git@github.com:noi-techpark/infrastructure-v2.git
cd infrastructure-v2
docker compose -f docker-compose.yml up
````

:::info
You might see periodic error messages about `traces export: context deadline exceeded` due to telemetry systems not being active. These can be ignored.
:::

### 2.2. Timeseries API Integration Setup

For developing Timeseries API integrations (which your transformer will interact with), you also need to start `docker-compose.timeseries.yml`:

```bash
cd infrastructure-v2 # Ensure you are in the infrastructure-v2 repository
docker compose -f docker-compose.timeseries.yml up
```

Now, your locally running collectors and transformers should be able to connect to these local endpoints. When running collectors/transformers using Docker Compose, ensure they are configured with `network_mode: host`. The boilerplate for transformers should handle this by default. Collectors might need some configuration adjustments if they typically bring up their own RabbitMQ instance, as this would conflict with the `infrastructure-v2`'s RabbitMQ.

### 2.3. Useful Local Endpoints

  * **RabbitMQ Management Interface**: `http://localhost:15672` (credentials: `guest/guest`). Use this to monitor message queues.
  * **MongoDB**: `mongodb://localhost:27017/?directConnection=true`. You can use a tool like MongoDB Compass to connect.

## 3. Getting Hands-on: Collector and Transformer Development (Golang)

All new data collectors and transformers are currently developed in Go. An [in-house SDK](https://github.com/noi-techpark/opendatahub-go-sdk) simplifies development by standardizing concerns like messaging, raw data retrival, telemetry, logging, and configuration.

### 3.1. Data Collectors

See the `collectors` directory in the monorepo: [https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors](https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors).

There is currently no boilerplate generator for data collectors. You'll need to start from scratch or by copying an existing, up-to-date collector. For simplicity, `s3-poller` is a good starting point.

### 3.2. Transformers

See the `transformers` directory in the monorepo: [https://github.com/noi-techpark/opendatahub-collectors/tree/main/transformers](https://github.com/noi-techpark/opendatahub-collectors/tree/main/transformers).

For transformers, a boilerplate generator is available at `/transformers/boilerplate/setup_go.sh`. This script generates a minimal transformer service that you can extend. The wizard will ask for a two-part provider tuple and Origin, which need to match the tuple provided in the collectors.

#### Example: Using the Transformer Boilerplate (Conceptual)

```bash
cd opendatahub-collectors/transformers/boilerplate
./setup_go.sh
```

Follow the prompts. For instance, if your collector is `my-data-collector` and the origin is `MyOrigin`, you might enter:

  * Provider Tuple: `my-data-collector`
  * Origin: `MyOrigin`

This will generate a new directory (e.g., `transformers/my-data-transformer`) with a basic Go transformer structure.

#### Key Aspects of a Go Transformer

Transformers will:

1.  **Listen to a Message Queue**: Consume raw data events.
2.  **Fetch Raw Data**: Request the actual raw data from the raw data API (handled by SDK).
3.  **Transform Data**: Convert the raw data into the format expected by the `opendatahub-timeseries-writer`.
4.  **Push Data to Writer**: Use the `go-bdp-client` to send the transformed data.

### 3.3 Authentication for the Timeseries Writer (Transformers)

The Timeseries Writer API uses OAuth2 for authentication. Transformers need to obtain an access token to make authenticated requests.

#### OAuth2 Client Credentials

We provide shared OAuth client credentials for development:

  * **Host**: `https://auth.opendatahub.testingmachine.eu/auth/`
  * **Realm**: `noi`
  * **Token Endpoint**: `https://auth.opendatahub.testingmachine.eu/auth/realms/noi/protocol/openid-connect/token`
  * **Client ID**: `odh-mobility-datacollector-development`
  * **Client Secret**: `7bd46f8f-c296-416d-a13d-dc81e68d0830`

The `odh-mobility-datacollector-development` client is authorized to write to the writer client.

#### Using the Access Token in API Calls

Once you have the `access_token`, include it in the `Authorization` header of your HTTP requests to the Timeseries Writer API.

```bash
curl -X GET "http://localhost:8999/json/stations" \
    --header 'Content-Type: application/json' \
    --header 'Authorization: bearer YOUR_ACCESS_TOKEN'
```
