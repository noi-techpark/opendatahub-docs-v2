---
sidebar_position: 2
---



# Quotas, CLI and the R package

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 1. API quotas and rate limiting

The Open Data Hub enforces quotas and rate limits to ensure fair usage and system stability. These limits vary based on your user type and affect both the historical data you can access and the number of requests you can make per second. The specific behavior described here applies to the **Time Series API** and **Content API**.

### 1.1. Quota limits by user type

Your access level determines your quota for historical data and request frequency. The following table summarizes the limits:

| User Type | Max historical data | Requests per second | Rate limiting criteria |
| :--- | :--- | :--- | :--- |
| Unregistered (no referrer) | 5 days | 10 | per IP and query path |
| Unregistered (with referrer) | 100 days | 20 | per referer, IP, and query path |
| Basic | 1,000 days | 50 | per user-id, referer, IP, and query path |
| Advanced | unlimited | 100 | per user-id, referer, IP, and query path |
| Premium | unlimited | 200 | per user-id, referer, IP, and query path |

:::warning
Unregistered users can significantly increase their historical data access from 5 to 100 days by providing a `Referer` header or `referer` query parameter. Always include this identifier to benefit from higher limits.
:::

### 1.2. Handling quota exhaustion

If you exceed your quota, the API returns an HTTP `429 Too Many Requests` error. The response body includes a message and a hint for further information.

Example `429` response:
```json
{
  "hint": "https://github.com/noi-techpark/odh-docs/wiki/Api-Quota",
  "message": "You have exhausted your API Request Quota"
}
```

:::warning
The `hint` URL in the error response points to a legacy wiki page. For up-to-date information, refer to the current Historical Data and Request Rate Limits documentation.
:::

## 2. Using the HTTP Referer

The **Time Series API** and **Content API** require the HTTP `Referer` header to support usage statistics, problem tracing, and improved rate limiting. Providing this header helps the Open Data Hub team understand how the APIs are used and assists in debugging issues.

### 2.1. Setting the Referer header

The `Referer` header should contain the URL of the application or webpage making the request. Browsers typically set this automatically, but you may need to set it manually in scripts or applications.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -H 'Referer: https://myapp.bz.it/weather' \
  'https://api.opendatahub.com/v1/stations'
```

  </TabItem>
</Tabs>

### 2.2. Using the referer query parameter

If you cannot set HTTP headers, use the `referer` query parameter as a fallback. The API gives precedence to the query parameter over the header if both are present. The value should be a unique identifier that describes your application.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl 'https://api.opendatahub.com/v1/stations?referer=myapp-unique-id'
```

  </TabItem>
</Tabs>

:::info
Always prefer setting the `Referer` header. Use the query parameter only when technical constraints prevent header usage. A meaningful identifier improves support and analytics.
:::

## 3. Command line access with curl

The **Time Series API** and **Content API** support command-line access via tools like `curl`, enabling non-interactive, scriptable data retrieval. This is useful for automation, data processing, and integration with third-party systems.

### 3.1. Retrieving data with curl

You can use `curl` to fetch data directly from the API. The Swagger interfaces for the APIs provide ready-to-use `curl` commands for every query.

<Tabs groupId="lang">
  <TabItem value="curl" label="curl" default>

```bash
curl -H 'Referer: https://myapp.bz.it' \
  'https://mobility.api.opendatahub.com/v2/stations'
```

  </TabItem>
</Tabs>

### 3.2. Alternative tools

While `curl` is the most common tool, you can use alternatives like `wget`. Ensure you adapt the parameters correctly for the tool you choose.

Example with `wget`:
```bash
wget --header='Referer: https://myapp.bz.it' \
  'https://api.opendatahub.com/v1/stations'
```

:::info
Command-line access is ideal for one-way data retrieval in scripts, automated updates, or feeding data into applications like kiosk displays. It is not suited for interactive workflows.
:::

## 4. Accessing BZ Analytics data with the bzar R package

The **bzar** R package, developed by the Open Data Hub team, provides an interface to **BZ Analytics** data. It allows R users to retrieve, analyze, and visualize data using R's extensive statistical and graphics capabilities.

### 4.1. Installing the bzar package

The package is hosted on GitHub and can be installed using the `devtools` package.

<Tabs groupId="lang">
  <TabItem value="r" label="R" default>

```r
# Install devtools if not already installed
# install.packages("devtools")

devtools::install_github('noi-techpark/it.bz.opendatahub.analytics.libs', subdir='api/R')
```

  </TabItem>
</Tabs>

:::warning
You must have R and the `devtools` package installed to use this method. The package is under active development, so functionality and API stability may change.
:::

### 4.2. Retrieving and visualizing data

After installation, use the `bz_data()` function to query BZ Analytics data. The result can be processed with standard R functions or visualized using `ggplot2`.

<Tabs groupId="lang">
  <TabItem value="r" label="R" default>

```r
library(bzar)

# Retrieve data
result <- bz_data(query = 'your_query')

# Basic plot
plot(result$timestamp, result$value)

# Or use ggplot2
library(ggplot2)
ggplot(result, aes(x = timestamp, y = value)) + geom_line()
```

  </TabItem>
</Tabs>

:::info
The `bzar` package is specifically designed for BZ Analytics data and may require authentication for certain endpoints. Refer to the [bzar repository](https://github.com/noi-techpark/it.bz.opendatahub.analytics.libs/tree/main/api/R) for detailed documentation and examples.
:::

**Related**: [Authentication and authorization](/use-data/authentication-and-access/authentication), [Time Series API reference](/use-data/time-series-api/reference)
