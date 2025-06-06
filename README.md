# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
npm i --legacy-peer-deps
```

## Local Development

```bash
yarn start
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Docs to PDF

Below are the commands to generate a PDF starting from Docusaurus. The plugin is a scraper which navigates the documentation using "next buttons" in the footer of the page.

https://github.com/jean-humann/docs-to-pdf

```
npm install -g docs-to-pdf
```

```
npx docs-to-pdf docusaurus --initialDocURLs="[url_of_page_you_want_scrape_from]" --contentSelector="article"  --paginationSelector="a.pagination-nav__link.pagination-nav__link--next"
``