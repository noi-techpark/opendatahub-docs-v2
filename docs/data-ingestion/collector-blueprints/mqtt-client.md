---
sidebar_position: 2
slug: /collector-blueprints/mqtt-client
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MQTT Client Collector

A pre-built microservice designed to easily integrate with data sources that publish information via the MQTT protocol.

This blueprint is perfect for scenarios where your data provider or IoT devices send real-time updates to an MQTT broker. Instead of developing a custom collector from scratch, you can deploy and configure this reusable component to automatically receive these messages and forward them into the Open Data Hub pipeline.

:::info
Implementation reference: 

[https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors/mqtt-client](https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors/mqtt-client)
:::

## What is the MQTT Listener?

The MQTT Listener is a specialized data collector that acts as a subscriber to an MQTT broker. It listens for messages on a specified MQTT topic, captures the raw payload of these messages, and then publishes this raw data to an internal Open Data Hub message queue (RabbitMQ). From there, the data can be picked up by a transformer for further processing and standardization.

This collector operates on a "listen" model, meaning it continuously waits for new messages on the configured MQTT topic.

### Key Features

* **MQTT Subscription**: Connects to an MQTT broker and subscribes to a defined topic.
* **Real-time Data Capture**: Captures message ID, topic, and payload from incoming MQTT messages.
* **Raw Data Forwarding**: Publishes the raw MQTT message content directly to an Open Data Hub message queue (RabbitMQ).
* **Configurable Credentials**: Supports MQTT username/password authentication.
* **Flexible Routing**: Allows configuration of RabbitMQ exchange and routing keys.

## How to Configure the MQTT Listener

Configuring the MQTT Listener is primarily done through environment variables. This allows for easy deployment and management across different environments (development, testing, production) without modifying the code.

You will typically configure these variables in your deployment setup (e.g., in a `.env` file for local development, or in Helm charts for Kubernetes deployments).

### Common Environment Variables

These variables are standard across many Open Data Hub collectors and define logging and basic messaging behavior.

| Variable Name | Description | Example Value |
| :------------ | :---------- | :------------ |
| `LOG_LEVEL`   | The minimum logging level (e.g., `DEBUG`, `INFO`, `WARN`, `ERROR`). | `INFO` |
| `MQ_EXCHANGE` | The RabbitMQ exchange where raw data messages will be published. | `ingress` |
| `MQ_CLIENT`   | A unique identifier for this collector client, used by RabbitMQ for connection naming. | `dc-mqtt-client-dev` |
| `PROVIDER`    | A unique identifier for the data source this collector is handling (e.g., `source-name/dataset-name`). This will be part of the raw data metadata. | `test/mqtt` |

### MQTT-Specific Environment Variables

These variables are unique to the MQTT Listener and define its connection to your MQTT broker.

| Variable Name | Description | Example Value |
| :------------ | :---------- | :------------ |
| `MQTT_URI`    | The URI of your MQTT broker (e.g., `tcp://broker.example.com:1883` or `ssl://broker.example.com:8883`). | `xsona-broker.axians.it:8883` |
| `MQTT_USER`   | The username for connecting to the MQTT broker. | `my_mqtt_user` |
| `MQTT_PASS`   | The password for connecting to the MQTT broker. | `my_mqtt_password` |
| `MQTT_CLIENTID` | A unique client ID for this MQTT subscriber. | `airQuinoLinearizationDev` |
| `MQTT_TOPIC`  | The MQTT topic to subscribe to for incoming messages. | `AirQuino/RawData` |
