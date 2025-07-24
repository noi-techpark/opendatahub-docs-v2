---
sidebar_position: 3
slug: /collector-blueprints/s3-poller
---

# S3 Poller Collector

Designed for efficiently collecting data from AWS S3 buckets. This collector is ideal for scenarios where your data provider regularly uploads files to an S3 bucket, and you need to automatically retrieve these files and feed their content into the Open Data Hub pipeline.

:::info
Implementation reference: 

[https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors/s3-poller](https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors/s3-poller)
:::

## What is the S3 Poller?

The S3 Poller is a specialized data collector that periodically checks a configured AWS S3 bucket for a specific file. On a predefined schedule (using a cron expression), it downloads the content of this file and then publishes its raw body to an internal Open Data Hub message queue (RabbitMQ). From there, the data can be picked up by a transformer for further processing and standardization.

This collector operates on a "pull" model, actively polling the S3 bucket at regular intervals.

### Key Features

* **Scheduled Polling**: Configurable cron schedule to define how often the S3 bucket is checked.
* **AWS S3 Integration**: Connects to AWS S3 using provided credentials and region.
* **Specific File Retrieval**: Targets a single file within a specified S3 bucket.
* **Raw Data Forwarding**: Publishes the entire content of the S3 file as raw data to an Open Data Hub message queue.
* **Binary/Text Handling**: Can be configured to treat the S3 file content as raw binary data (e.g., for images, compressed files) or as a string (e.g., for JSON, CSV).

## How to Configure the S3 Poller

Configuring the S3 Poller is straightforward, primarily done through environment variables. This approach ensures flexibility and ease of deployment across different environments (development, testing, production) without requiring code changes.

You will typically configure these variables in your deployment setup (e.g., in a `.env` file for local development, or in Helm charts for Kubernetes deployments).

### Common Environment Variables

These variables are standard across many Open Data Hub collectors and define logging and basic messaging behavior.

| Variable Name | Description | Example Value |
| :------------ | :---------- | :------------ |
| `MQ_URI`      | The RabbitMQ connection URI. | `amqp://guest:guest@rabbitmq` |
| `MQ_CLIENT`   | A unique identifier for this collector client, used by RabbitMQ for connection naming. | `dc-meteorology-bz-forecast` |
| `MQ_EXCHANGE` | The RabbitMQ exchange where raw data messages will be published. | `ingress` |
| `LOGLEVEL`    | The minimum logging level (e.g., `DEBUG`, `INFO`, `WARN`, `ERROR`). | `DEBUG` |
| `PROVIDER`    | A unique identifier for the data source this collector is handling (e.g., `source-name/dataset-name`). This will be part of the raw data metadata. | `s3-poller/meteorology-bz-forecast` |

### S3 Poller-Specific Environment Variables

These variables are unique to the S3 Poller and define its connection to your AWS S3 bucket and the polling schedule.

| Variable Name         | Description                                                  | Example Value                                  |
| :-------------------- | :----------------------------------------------------------- | :--------------------------------------------- |
| `CRON`                | The cron schedule for polling the S3 bucket. Supports seconds precision. | `"0/10 * * * * *"` (every 10 seconds)          |
| `AWS_REGION`          | The AWS region where your S3 bucket is located.              | `eu-west-1`                                    |
| `AWS_S3_FILE_NAME`    | The exact name (key) of the file to be downloaded from S3.   | `SMOS_MCPL-WX_EXP_SIAG.JSON`                   |
| `AWS_S3_BUCKET_NAME`  | The name of the S3 bucket to poll.                           | `dc-meteorology-province-forecast`             |
| `AWS_ACCESS_KEY_ID`   | Your AWS Access Key ID.                                      | `AKIA...`                                      |
| `AWS_ACCESS_SECRET_KEY` | Your AWS Secret Access Key.                                  | `yn9v...`                                      |
| `RAW_BINARY`          | If `true`, the S3 file content is treated as raw binary data. If `false` (default), it's converted to a string. | `false`                                        |

