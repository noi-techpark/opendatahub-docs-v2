[![REUSE Compliance](https://github.com/noi-techpark/opendatahub-docs-v2/actions/workflows/reuse-lint.yml/badge.svg)](https://github.com/noi-techpark/opendatahub-docs/wiki/REUSE#badges)

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
```

## Deployment

### GitHub Actions

| Workflow | Trigger | Description |
| :--- | :--- | :--- |
| `deploy-typesense.yml` | Manual (environment: test/prod) | Deploy Typesense server to Docker runner |
| `index-docs.yml` | Manual / Tag `v*` (prod) / Tag `rc*` (test) | Run DocSearch scraper to index documentation |

### Required Secrets

| Secret | Description |
| :--- | :--- |
| `TYPESENSE_API_KEY_TEST/PROD` | Admin API key for Typesense |
| `TYPESENSE_HOST_TEST/PROD` | Typesense server hostname (DNS name, no protocol/port) |
| `SSH_PRIVATE_KEY` | SSH key for deployment |
| `GH_PERSONAL_ACCESS_TOKEN` | GitHub token for Docker registry |

### Deployment Flow

1. **Deploy Typesense**: Run `deploy-typesense.yml` manually, selecting environment
2. **Deploy Documentation**: Deploy the Docusaurus site (separate workflow)
3. **Index Documentation**:
   - Automatically triggered on `v*` tags (prod) or `rc*` tags (test)
   - Or run `index-docs.yml` manually after deployment