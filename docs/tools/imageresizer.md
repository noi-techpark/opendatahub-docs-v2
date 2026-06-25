---
sidebar_position: 5
---



# Imageresizer

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 1. Image Proxy Functionality

The Open Data Hub provides an image proxy service through the Content API to securely retrieve images hosted on HTTP endpoints and deliver them over HTTPS. This functionality is useful when consuming images from non-secure sources that must be displayed in secure contexts.

The proxy endpoint is:

```
https://images.opendatahub.com/api/Image/GetImageByUrl
```

To retrieve an image, pass the source URL as the `imageurl` parameter.

:::warning
The Image Proxy only accepts the `imageurl` parameter. Additional query parameters are not supported unless they are handled by the target server.
:::

### 1.1. Retrieve an image via proxy

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://images.opendatahub.com/api/Image/GetImageByUrl?imageurl=http://daten.buergernetz.bz.it/services/weather/graphics/icons/imgsource/wetter/icon_2.png" -o weather-icon.png
```

</TabItem>
</Tabs>

This request fetches the image from the given HTTP URL and serves it over HTTPS. You can use this method to embed external images securely in web applications or data visualizations.

## 2. Image Resizing Service

The Content API supports dynamic image resizing for images hosted on specific Open Data Hub domains. This feature allows clients to request appropriately sized images without downloading full-resolution assets.

### 2.1. Supported domains

Image resizing is available only for images hosted on the following domains:

- `https://tourism.images.opendatahub.com`
- `https://images.opendatahub.com`
- `https://images.tourism.testingmachine.eu`

:::warning
You cannot resize external images directly. To resize an image from an external source, first retrieve it via the Image Proxy, then host it on a supported domain.
:::

### 2.2. Resizing parameters

To resize an image, append either `width` or `height` (or both) as query parameters to the image URL.

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `width` | integer | no | original | Desired width in pixels |
| `height` | integer | no | original | Desired height in pixels |

<Tabs groupId="lang">
<TabItem value="curl" label="curl" default>

```bash
curl "https://tourism.images.opendatahub.com/path/to/image.jpg?width=300" -o resized-image.jpg
```

</TabItem>
</Tabs>

### 2.3. Aspect ratio behavior

- If you specify only `width` or only `height`, the image is scaled proportionally.
- If you specify both `width` and `height`, the image is resized to the exact dimensions, which may result in distortion if the aspect ratio does not match the original.

For example:

```
https://tourism.images.opendatahub.com/path/to/image.jpg?width=300&height=200
```

Use proportional values to avoid unintended stretching.

## 3. Use cases for API users and ingestion creators

- **API users** can leverage the image proxy to securely display weather icons or other HTTP-hosted media in HTTPS applications.
- **Ingestion creators** can use the resizing service to generate thumbnails or optimized assets for downstream consumers by referencing hosted images with size constraints.

For more information on consuming data, see [Content API Reference](/use-data/content-api/reference).
