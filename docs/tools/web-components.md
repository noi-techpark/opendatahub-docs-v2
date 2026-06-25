---
sidebar_position: 4
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

For example, to embed the day-trip-map-widget:

```html
<meta charset="UTF-8">
<div>
  <script src="https://cdn.webcomponents.opendatahub.com/dist/137e4aa4-af69-4085-90be-b58299879cb4/day_trip_map_widget.min.js"></script>
  <day-trip-map-widget lang-and-locale="en-US" log-info="false"></day-trip-map-widget>
</div>
```

The `day-trip-map-widget` supports the following attributes:
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `lang-and-locale` | string | no | en-US | Sets the language and locale (e.g., `de-DE`, `it-IT`). |
| `log-info` | string | no | false | Enables logging output when set to `true`. |

## 2. Webcomponent Skiareas

The `odh-skiareas` Web Component displays real-time information about ski areas in South Tyrol. It supports multiple display modes, languages, and filtering options.

You can configure this component using parameters passed in the HTML tag.

### 2.1. Configuration Parameters

| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id-list` | string | no | - | Comma-separated list of ski area IDs to display. |
| `skiing-region-list` | string | no | - | Filters ski areas by region (e.g., `ortler`, `dolomiti`). |
| `language` | string | no | en | Language code: `de`, `it`, or `en`. |
| `sorting` | string | no | alphabetic | Sort order: `alphabetic`, `random`, or `by-region`. |
| `mode` | string | no | browse | Display mode: `browse` (Browsable Mode) or `display` (Kiosk Mode). |
| `page-size` | number | no | 10 | Number of ski areas shown per page. |
| `scroll-delay` | number | no | 5 | Seconds between auto-scrolling in Kiosk Mode. |
| `scroll-factor` | number | no | 1 | Number of items to scroll at once. |
| `enable-placeholder` | boolean | no | true | Shows placeholder content while loading. |
| `exclude-menus` | string | no | - | Comma-separated list of menu items to hide. |
| `font-name` | string | no | - | Custom font name. |
| `font-url` | string | no | - | URL to load a custom font from. |
| `attribs` | string | no | - | Additional display options (e.g., hide weather). |

### 2.2. Kiosk Mode

To enable Kiosk Mode, set the `mode` parameter to `display`. In this mode, the component can auto-scroll through ski areas.

Example:
```html
<odh-skiareas 
  mode="display" 
  id-list="123,456" 
  language="de" 
  scroll-delay="7" 
  scroll-factor="1">
</odh-skiareas>
```

This configuration shows specific ski areas in German, changing every 7 seconds.

You can also view any configuration in fullscreen using the "Open in new Tab" option in the Webcomponent Store.

## 3. Character Encoding and Emoji Support

Some Web Components, such as `day-trip-map-widget`, use emojis or special icons that require UTF-8 encoding to render correctly.

:::warning
Without UTF-8 encoding, emojis and special characters may appear as boxes or question marks.
:::

Ensure your HTML document includes the following in the `<head>` section:

```html
<meta charset="UTF-8">
```

This applies to all Web Components that display weather icons, trail symbols, or other Unicode glyphs.

## 4. Weather Data in Web Components

The `day-trip-map-widget` and similar components may consume weather data from the Open Data Hub. This data includes a `WeatherCode`, a single-character code representing current conditions.

Example weather data structure:
```json
{
  "Id": "123",
  "DistrictName": "Bolzano",
  "date": "2023-09-01",
  "TourismVereinIds": ["456"],
  "BezirksForecast": {
    "date": "2023-09-01",
    "WeatherCode": "c",
    "WeatherDesc": "Cloudy",
    "WeatherImgUrl": "https://example.com/cloudy.png",
    "MaxTemp": 22,
    "MinTemp": 15,
    "RainFrom": 0.1,
    "RainTo": 0.5,
    "Thunderstorm": false
  }
}
```

Valid `WeatherCode` values are case-sensitive and include:
- `c` = Cloudy
- `s` = Sunny
- `r` = Rainy
- `t` = Thunderstorm
- `f` = Foggy
- `p` = Partly cloudy

Ensure your component configuration handles these codes correctly when displaying weather information.

## Related

- [Content API reference](/use-data/content-api/reference)
- [Time Series API reference](/use-data/time-series-api/reference)
