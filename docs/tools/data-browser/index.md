import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Data Browser

The Open Data Hub [Data Browser](https://databrowser.opendatahub.com/) is a web-based tool for exploring, filtering, and managing Open Data Hub datasets through a user-friendly interface. For API users it is a convenient way to see the exact data model and fields the Content API returns; for content editors it is also where tourism content is created and maintained.

## 1. Exploring and filtering data

The Data Browser supports targeted exploration through filtering in **table view** (filtering is not available in other views). When multiple filters are applied, they are combined with AND logic, so all conditions must be satisfied for a record to appear.

The results align with how the **Content API** returns filtered responses. For example, a filter on a `title` field corresponds to the `search` parameter in the Content API:

<Tabs groupId="lang">
  <TabItem value="go" label="Go" default>

  ```go
  // Search for events with "conference" in the title
  resp, err := http.Get("https://tourism.api.opendatahub.com/v1/Event?search=conference")
  ```

  </TabItem>
  <TabItem value="curl" label="curl">

  ```bash
  curl "https://tourism.api.opendatahub.com/v1/Event?search=conference"
  ```

  </TabItem>
  <TabItem value="python" label="Python">

  ```python
  import requests

  response = requests.get("https://tourism.api.opendatahub.com/v1/Event", params={"search": "conference"})
  print(response.json())
  ```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

  ```javascript
  fetch('https://tourism.api.opendatahub.com/v1/Event?search=conference')
    .then(response => response.json())
    .then(data => console.log(data));
  ```

  </TabItem>
</Tabs>

:::info
Filtering in the Data Browser reflects the same constraints as the Content API, where parameters like `search`, `tagfilter`, and field-specific filters refine results. See [Filtering and sorting](/use-data/content-api/filtering-and-sorting).
:::

## 2. Managing content

The Data Browser is also where editors create and maintain tourism content: events, images, tags, and news articles. Those editorial workflows are documented separately, since they are not needed to consume the APIs.

See [Managing content in the Data Browser](/tools/data-browser/content-management).

## 3. Related

- [Content API reference](/use-data/content-api/reference)
- [Filtering and sorting](/use-data/content-api/filtering-and-sorting)
- [Discovery](/tools/discovery) and [Analytics](/tools/analytics)
