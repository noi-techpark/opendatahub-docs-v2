---
sidebar_position: 7
slug: /sdks
---

# SDKs

The Open Data Hub provides Software Development Kits (SDKs) to streamline the development of data integration components, such as data collectors and transformers. These SDKs abstract away common concerns like messaging, telemetry, and interaction with the Timeseries Writer API, allowing developers to focus on the core business logic of data acquisition and transformation.

Below is an overview of the available SDKs, categorized by their primary functional area.

## Ingestion

The Ingestion SDKs provide frameworks and utilities for building microservices responsible for collecting raw data and transforming it into the Open Data Hub's standardized format. They offer abstractions for the lifecycle of data collectors and transformers, handling message consumption, raw data processing, and structured data output.

| Language | Git Repository | Official Support |
| :------- | :----------------------------------------------------------- | :--------------- |
| Go | [`github.com/noi-techpark/opendatahub-go-sdk/ingest/dc`](https://github.com/noi-techpark/opendatahub-go-sdk/tree/main/ingest/dc) | Yes |
| Go | [`github.com/noi-techpark/opendatahub-go-sdk/ingest/tr`](https://github.com/noi-techpark/opendatahub-go-sdk/tree/main/ingest/tr) | Yes |
| Go | [`github.com/noi-techpark/opendatahub-go-sdk/ingest/rdb`](https://github.com/noi-techpark/opendatahub-go-sdk/tree/main/ingest/rdb) | Yes |

## Messaging

The Messaging SDK facilitates interaction with the underlying message queue system (e.g., RabbitMQ). It provides standardized interfaces for publishing raw data from collectors and consuming raw data events in transformers, ensuring reliable and asynchronous data flow within the pipeline.

| Language | Git Repository | Official Support |
| :------- | :----------------------------------------------------------- | :--------------- |
| Go | [`github.com/noi-techpark/opendatahub-go-sdk/ingest/ms`](https://github.com/noi-techpark/opendatahub-go-sdk/tree/main/ingest/ms) | Yes |

## Telemetry

The Telemetry SDK integrates observability features into your data integration components. It provides tools for structured logging, distributed tracing (compatible with OpenTelemetry), and potentially metrics, enabling better monitoring, debugging, and performance analysis of your microservices.

| Language | Git Repository | Official Support |
| :------- | :----------------------------------------------------------- | :--------------- |
| Go | [`github.com/noi-techpark/opendatahub-go-sdk/tel`](https://github.com/noi-techpark/opendatahub-go-sdk/tree/main/tel) | Yes |
| Go | [`github.com/noi-techpark/opendatahub-go-sdk/tel/logger`](https://github.com/noi-techpark/opendatahub-go-sdk/tree/main/tel/logger) | Yes |

## Timeseries Writer API

The Timeseries Writer API SDK (also known as the BDP client) provides a convenient and type-safe way to interact with the `opendatahub-timeseries-writer` service. It simplifies operations such as authenticating, synchronizing data types and stations, and pushing time-series measurements in the Open Data Hub's standardized format.

| Language | Git Repository | Official Support |
| :------- | :----------------------------------------------------------- | :--------------- |
| Go | [`github.com/noi-techpark/go-bdp-client`](https://github.com/noi-techpark/go-bdp-client) | Yes |

## Testing

The Testing SDKs and utilities are designed to simplify the creation of robust unit and integration tests for your data integration components. They often provide mock implementations of external services, allowing for deterministic and isolated testing of transformation logic and API interactions.

| Language | Git Repository | Official Support |
| :------- | :----------------------------------------------------------- | :--------------- |
| Go | [`github.com/noi-techpark/go-bdp-client/bdpmock`](https://github.com/noi-techpark/go-bdp-client/tree/main/bdpmock) | Yes |
| Go | [`github.com/noi-techpark/opendatahub-go-sdk/testsuite`](https://github.com/noi-techpark/opendatahub-go-sdk/tree/main/testsuite) | Yes |