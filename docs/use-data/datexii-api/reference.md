---
sidebar_position: 1
---

# DATEXII API reference

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The DATEX II API provides access to road traffic event data formatted according to the DATEX II European XML standard, exposing dynamic feeds such as announcements and traffic incidents. It features dedicated endpoints for service discovery and real-time XML data retrieval across supported regions and providers.

This reference documents the API architecture, supported endpoints, data format standards, and usage guidelines.

## 1. Base URL and entry points

The base URL for the DATEXII API is:

```
https://datex.api.opendatahub.com/
```

You can browse available endpoints directly at this URL. For interactive exploration, use the Swagger UI:

[https://datex.api.opendatahub.com/](https://datex.api.opendatahub.com/)

## 2. Entity endpoints

The DATEX II API exposes two main endpoints: a discovery endpoint to retrieve available providers and their feed URLs, and a specific XML feed endpoint for traffic situation publications.

- `GET /datex/2/` — returns the available providers, and the DATEX II files published for each.
- `GET /v1/{EntityType}/{id}` — returns the latest DATEX II SituationPublication XML for the given event provider.

The feed endpoint returns a standard DATEX II v2.0 XML payload (application/xml) wrapped in a d2LogicalModel root element.

## 8. Related

- [Authentication guide](/use-data/authentication-and-access/authentication)
- [Quickstart: your first request](/quickstart)
