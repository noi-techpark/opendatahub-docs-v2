---
sidebar_position: 5
---

# Web Components

The Open Data Hub provides a collection of reusable Web Components for integrating real-time data into websites and applications. These components, covering domains such as tourism, weather, and mobility, are designed to be easily embedded and configured without requiring deep integration with the underlying APIs.

You can browse and use the available Web Components at [https://webcomponents.opendatahub.com/](https://webcomponents.opendatahub.com/). Each component includes a "Share" button that provides an embeddable code snippet for quick integration.

## 1. Implementing a Web Component

To use a Web Component from the Open Data Hub, follow these steps:

1. Visit the [Web Components library](https://webcomponents.opendatahub.com/).
2. Select the component you want to use.
3. Click the "Share" button to copy the embed code.
4. Paste the code into your HTML page.

:::info
Always place the Web Component code inside a `<div>` element to ensure proper rendering.
:::

For example, to embed the `day-trip-map-widget`:

```html
<meta charset="UTF-8">
<div>
  <script src="https://cdn.webcomponents.opendatahub.com/dist/137e4aa4-af69-4085-90be-b58299879cb4/day_trip_map_widget.min.js"></script>
  <day-trip-map-widget lang-and-locale="en-US" log-info="false"></day-trip-map-widget>
</div>
```

Each component accepts its own attributes, set on the HTML tag. For the `day-trip-map-widget`, for example:

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `lang-and-locale` | string | no | en-US | Sets the language and locale (e.g., `de-DE`, `it-IT`). |
| `log-info` | string | no | false | Enables logging output when set to `true`. |

Refer to each component's own page in the [Web Components library](https://webcomponents.opendatahub.com/) for its full list of attributes.

## 2. Character encoding and emoji support

Some Web Components, such as `day-trip-map-widget`, use emojis or special icons that require UTF-8 encoding to render correctly.

:::warning
Without UTF-8 encoding, emojis and special characters may appear as boxes or question marks.
:::

Ensure your HTML document includes the following in the `<head>` section:

```html
<meta charset="UTF-8">
```

This applies to all Web Components that display weather icons, trail symbols, or other Unicode glyphs.

## Related

- [Content API reference](/use-data/content-api/reference)
- [Time Series API reference](/use-data/time-series-api/reference)
