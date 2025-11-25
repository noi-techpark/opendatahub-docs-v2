# Typesense Search Setup & Maintenance

This directory contains the configuration for the Typesense search engine integration with the Open Data Hub documentation.

## Documentation References

Before making changes, please consult the official documentation:

*   **Typesense API Reference**: https://typesense.org/docs/29.0/api/
*   **Typesense Guide**: https://typesense.org/docs/guide/
*   **DocSearch Scraper**: https://github.com/typesense/typesense-docsearch-scraper
*   **Docusaurus Theme Search Typesense**: https://github.com/typesense/docusaurus-theme-search-typesense

---

## Docusaurus Configuration

For the search scraper to function correctly in production, ensure the following configurations in `docusaurus.config.ts` are set:

1.  **Sitemap Generation**: The scraper relies on the sitemap to discover pages. This is already configured via the `classic` preset in `docusaurus.config.ts`.
2.  **Production URL**: The `url` field in `docusaurus.config.ts` must match your production domain (e.g., `https://docs.opendatahub.com`). The sitemap is generated using this URL, and the scraper will use these absolute URLs to crawl the site.
3.  **Indexing Enabled**: Ensure `noIndex` is set to `false`. If set to `true`, Docusaurus adds a `<meta name="robots" content="noindex, nofollow">` tag, which causes the scraper to ignore the pages.

---

## Production Setup Guide

The current setup in this repository is configured for **local development**. To deploy this to a production environment, follow these steps:

### 1. Typesense Server

A `docker-compose.yml` file is provided in this directory to quickly spin up a self-hosted Typesense instance.

1.  Navigate to the `typesense/` directory.
2.  Create or update the `.env` file (see `.env.example`) with the following variables:
    *   `TYPESENSE_API_KEY`: Set a strong admin API key.
    *   `CORS_DOMAINS`: Comma-separated list of allowed domains (e.g., `https://docs.opendatahub.com`).
3.  Start the service:

    ```bash
    docker compose up -d
    ```

### 2. Scraper Configuration (scraper.json)

Modify `typesense/scraper.json` to point to your production URL.

| Field | Local Value | Production Value (Example) |
| :--- | :--- | :--- |
| `start_urls` | `http://host.docker.internal:3000/` | `https://docs.opendatahub.com/` |
| `sitemap_urls` | `http://host.docker.internal:3000/sitemap.xml` | `https://docs.opendatahub.com/sitemap.xml` |
| `allowed_domains` | `host.docker.internal` | `docs.opendatahub.com` |

### 3. Scraper Environment (scraper.env)

Update the credentials used by the scraper to push data to Typesense.

| Variable | Description |
| :--- | :--- |
| `TYPESENSE_HOST` | Your production Typesense domain (e.g., `search.opendatahub.com`). |
| `TYPESENSE_API_KEY` | **Admin API Key**. This key needs write access to create collections and documents. |
| `TYPESENSE_PORT` | Usually `443` for HTTPS or `8108` for HTTP. |
| `TYPESENSE_PROTOCOL` | `https` (recommended for production). |

### 4. Frontend Configuration (.env)

Update the environment variables in the root `.env` file. These are used by the Docusaurus build to configure the search bar.

> **IMPORTANT**: Never expose your Admin API Key in the frontend `.env`. Use a **Search-Only API Key**.

| Variable | Description |
| :--- | :--- |
| `TYPESENSE_HOST` | Your production Typesense domain. |
| `TYPESENSE_SEARCH_ONLY_API_KEY` | A key with **only** `documents:search` permissions. See "Maintenance" below on how to generate this. |
| `TYPESENSE_PROTOCOL` | `https` |
| `TYPESENSE_PORT` | `443` |

### 5. CI/CD Integration

To keep the search index up-to-date, run the scraper in your CI/CD pipeline (e.g., GitHub Actions) after a successful deployment.

```yaml
# Example GitHub Action Step
- name: Run DocSearch Scraper
  run: |
    docker run -e CONFIG="$(cat typesense/scraper.json | jq -r tostring)" \
               --env-file typesense/scraper.env \
               typesense/docsearch-scraper:0.11.0
```

---

## Maintenance & Operations

Perform these operations using the Typesense API. You can use `curl` or Postman.

**Base URL**: `http://localhost:8108` (Local) or `https://your-production-host` (Prod)
**Header**: `X-TYPESENSE-API-KEY: <YOUR_ADMIN_API_KEY>`

*Note: The `X-TYPESENSE-API-KEY` header is required by Typesense for authentication.*

### 1. Health Check

Verify the server is running.

```bash
curl http://localhost:8108/health
# Response: {"ok":true}
```

### 2. Generate Search-Only API Key

For the frontend, you need a key that can only search.

*   [Documentation: API Keys](https://typesense.org/docs/latest/api/api-keys.html#create-an-api-key)

```bash
curl -X POST 'http://localhost:8108/keys' \
  -H 'X-TYPESENSE-API-KEY: xyz' \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "Search-only key for Docusaurus",
    "actions": ["documents:search"],
    "collections": ["opendatahub-docs"]
  }'
```

*Copy the `value` from the response into your root `.env` file as `TYPESENSE_SEARCH_ONLY_API_KEY`.*

### 3. List Collections

See what collections exist.

```bash
curl -H "X-TYPESENSE-API-KEY: xyz" \
     "http://localhost:8108/collections"
```

### 4. Delete Collection

If you need to completely reset the index (the scraper usually handles this automatically, but manual deletion is sometimes useful).

```bash
curl -X DELETE \
     -H "X-TYPESENSE-API-KEY: xyz" \
     "http://localhost:8108/collections/opendatahub-docs"
```

### 5. Test Search

Manually query the index to verify data.

```bash
curl -H "X-TYPESENSE-API-KEY: xyz" \
     "http://localhost:8108/collections/opendatahub-docs/documents/search?q=tutorial&query_by=content,hierarchy.lvl0"
```

---

## Selectors & Indexing

The `scraper.json` file defines **what** content is indexed. It maps HTML elements to Typesense fields.

*   [Documentation: Config File](https://typesense.org/docs/guide/docsearch.html#create-a-docsearch-scraper-config-file)

### How it works

The scraper traverses the DOM and extracts text based on CSS selectors.

| Field | Description |
| :--- | :--- |
| `lvl0` | The high-level category (e.g., "Tutorial", "Build"). |
| `lvl1` | The main page title. |
| `lvl2` | Sub-sections within the page. |
| `text` | The actual paragraph content. |

### query_by Configuration

In `docusaurus.config.ts`, the `query_by` parameter determines which of these fields are searched when a user types.

```typescript
// docusaurus.config.ts
typesenseSearchParameters: {
  query_by: 'content,hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,...'
}
```

*   **`content`**: Matches the paragraph text.
*   **`hierarchy.lvlX`**: Matches the titles/headers.

If you change the HTML structure of your site (e.g., by changing the Docusaurus theme), you must update the selectors in `scraper.json` to match the new classes/tags.
