---
sidebar_position: 3
---

# Analytics

[Open Data Hub Analytics](https://analytics.opendatahub.com) is a web tool for **visualizing Open Data Hub time series data** without writing code. It is useful for quickly seeing how a measurement behaves over time, comparing stations, and sharing a view with others.

Use it to inspect data visually before or alongside building requests against the [Time Series API](/use-data/time-series-api/reference).

## 1. What you can do

- **Build charts** from mobility datasets by selecting a data provider, a category, and the values to plot.
- **Choose a time range**: presets (today, yesterday and today, one week, one month) or a custom range.
- **Filter** by data provider and category to focus on the stations you care about.
- **Adjust the view**: change the plot height and toggle automatic refresh for live data.
- **Share a configuration**: generate a permanent link to a specific chart for colleagues.

## 2. How it fits your workflow

Analytics reads the same mobility data exposed by the Time Series API. A common pattern is to explore a measurement visually here, then reproduce it programmatically:

- Read the data in your application through the [Time Series API](/use-data/time-series-api/reference).
- For analysis in R, the [`bzar` R package](/use-data/authentication-and-access/quotas-and-tools) provides programmatic access to the same data.

## 3. Related

- [Discovery](/tools/discovery) and [Data Browser](/tools/data-browser)
- [Time Series API reference](/use-data/time-series-api/reference)
- [Quotas, CLI and the R package](/use-data/authentication-and-access/quotas-and-tools)
