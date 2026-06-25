---
sidebar_position: 1
---

# Discovery

[Open Data Hub Discovery](https://discovery.opendatahub.com) is a web tool for **exploring and understanding the datasets** in the Open Data Hub before you query them. It automatically discovers datasets from the Metadata API, infers their schema, and computes field-level statistics, so you can find the right dataset and the right fields without writing any code.

It is the natural first step of a typical workflow: discover a dataset here, inspect it in the [Data Browser](/tools/data-browser) or [Analytics](/tools/analytics), then read it through the [Content API](/use-data/content-api/reference) or [Time Series API](/use-data/time-series-api/reference).

## 1. What you can do

- **Search datasets** by keyword, tag, or domain (Mobility, Tourism).
- **Inspect a dataset's schema**: the full list of fields with their paths and types.
- **Read field-level statistics**: how often a field is populated (null percentage), how many distinct values it has, and its most common values, so you can tell whether a field is actually usable before building a request.
- **Browse tags** used across datasets to understand how content is classified.

## 2. AI chatbot assistant

Discovery includes an **AI chatbot assistant** that lets you explore datasets in natural language: ask which datasets exist, what fields they expose, or which values a field contains, and it answers using the Discovery data directly.

:::info
Access to the chatbot can be arranged on request. Contact the Open Data Hub team at `help@opendatahub.com` to enable it for your use.
:::

## 3. From discovery to a request

Once you have found a dataset and the fields you need, read it through the APIs:

- Tourism content (accommodations, events, points of interest): [Content API reference](/use-data/content-api/reference).
- Mobility time series (stations and measurements): [Time Series API reference](/use-data/time-series-api/reference).

Each API also offers an interactive Swagger UI for trying requests directly in the browser.

## 4. Related

- [Quickstart: your first request](/quickstart)
- [Data Browser](/tools/data-browser) and [Analytics](/tools/analytics)
- [Content API reference](/use-data/content-api/reference) and [Time Series API reference](/use-data/time-series-api/reference)
