---
sidebar_position: 4
slug: /collector-blueprints/api-crawler
---

# API Crawler Collector

The API Crawler collector is designed to **pull** data from external APIs based on a declarative configuration. It allows for complex and dynamic API interactions, including multi-step calls, data transformations, and context-based processing. This collector is ideal for scenarios where data needs to be fetched from various API endpoints, potentially requiring pagination, authentication, or nested requests.

This collector is ideal for scenarios where:

  * You need to integrate with a third-party service that provides a REST API but does not offer a push or streaming mechanism.
  * Data needs to be fetched on a regular, predictable schedule (e.g., every 15 minutes, once a day).
  * The integration requires handling complex interactions like authentication, pagination, or simple data transformations defined in a configuration file.

:::info
Implementation reference:

[https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors/api-crawler](https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors/api-crawler)
:::

## Key Features

  * **Scheduled Execution**: Uses CRON expressions for flexible, automated polling of APIs.
  * **Pull-Based Model**: Actively fetches data from source APIs, making it independent of the source's ability to push.
  * **Highly Configurable Crawling**: Powered by the [go-apigorowler](https://github.com/noi-techpark/go-apigorowler) library, allowing for complex API interaction logic—including authentication, pagination, and dynamic requests—to be defined in a single YAML file.
  * **Batch and Stream Processing**: Can be configured to either wait for the entire crawl to finish and publish a single result, or to publish data items individually as they are discovered during the crawl.


## How it Works

The API Crawler operates by reading a `configuration_file.yaml` configuration file, which defines the sequence of API calls to be made, how to process their responses, and how to manage the data flow. The collector then periodically executes these defined crawls based on a cron schedule.

Data fetched and processed by the crawler is published to the Open Data Hub via the message queue (RabbitMQ) as raw JSON, similar to other collectors.

## Configuration

The API Crawler's behavior is primarily driven by environment variables and the `configuration_file.yaml` configuration.

### Environment Variables

The following environment variables are essential for configuring the API Crawler collector:

| Variable Name | Description | Example Value |
| :------------ | :---------- | :------------ |
| `MQ_URI` | The connection URI for the RabbitMQ instance. | `amqp://guest:guest@rabbitmq` |
| `MQ_CLIENT` | A unique identifier for the data collector client connecting to RabbitMQ. | `dc-api-crawler-client` |
| `MQ_EXCHANGE` | The RabbitMQ exchange to which the collected data will be published. | `ingress` |
| `LOGLEVEL` | The logging level for the collector. | `DEBUG` |
| `PROVIDER` | The unique identifier for the data provider and dataset. This value is included in the published data. | `myprovider/mydataset` |
| `CRON` | The cron schedule string defining how often the crawler should run, including seconds. | `0 * * * * *` |
| `CONFIG_PATH` | The file path to the API crawler's configuration file. | `configuration_file.yaml` |
| `SERVICE_NAME` | The name of the service for telemetry purposes. | `dc-api-crawler-myservice` |
| `TELEMETRY_TRACE_GRPC_ENDPOINT` | The gRPC endpoint for sending telemetry traces. | `localhost:4317` |

### `configuration_file.yaml` Configuration

The `CONFIG_PATH` environment variable points to the `configuration_file.yaml` file, which is the core of the API Crawler's functionality. This YAML file uses the `ApiGorowler` library's declarative syntax to define:

* **API requests**: URLs, HTTP methods, headers, and body content.
* **Authentication**: How to authenticate with the target APIs.
* **Data extraction and transformation**: Using `jq` for JSON parsing and transformation.
* **Flow control**: Using `foreach` loops for iterating over collections or paginated results.
* **Context management**: How data from different steps is combined and made available to subsequent steps.

For detailed information on configuring the `configuration_file.yaml`, please refer to the [ApiGorowler package documentation](https://github.com/noi-techpark/go-apigorowler#apigorowler). The documentation covers the schema for `request` and `foreach` steps, authentication methods, `jq` and Go template usage, and context management.

The `ApiGorowler` [configuration builder IDE](https://github.com/noi-techpark/go-apigorowler/releases) is highly recommended for developing and debugging your `configuration_file.yaml` files, allowing you to execute and inspect the configuration in real-time.
