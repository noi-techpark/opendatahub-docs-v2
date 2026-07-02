import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
require('dotenv').config();

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const isProd = process.env.NODE_ENV === 'production';

const config: Config = {
  title: 'Open Data Hub Documentation',
  tagline: 'Official Open Data Hub Documentation',
  favicon: 'img/favicon.ico',

  // Prevent search engines from indexing the site when TESTING environment variable is set
  noIndex: process.env.TESTING === 'true',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: process.env.DOCS_URL || 'http://localhost:3000',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields: {
    testing: process.env.TESTING === 'true',
  },

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'general',
        path: 'docs/get-started',
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebarsGeneral.ts'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'data-ingestion',
        path: 'docs/data-ingestion',
        routeBasePath: 'data-ingestion',
        sidebarPath: require.resolve('./sidebarsDataIngestion.ts'),
      },
    ],
    // --- Documentation areas (knowledge-base migration) ---
    [
      '@docusaurus/plugin-content-docs',
      { id: 'use-data', path: 'docs/use-data', routeBasePath: 'use-data',
        sidebarPath: require.resolve('./sidebarsArea.ts') },
    ],
    [
      '@docusaurus/plugin-content-docs',
      { id: 'tools', path: 'docs/tools', routeBasePath: 'tools',
        sidebarPath: require.resolve('./sidebarsArea.ts') },
    ],
    // The site is hosted as an S3 static website, whose error document is `error.html`.
    // Docusaurus emits the styled not-found page as `404.html`, so copy it to
    // `error.html` after the build; otherwise S3 returns its own default error for
    // every unknown URL.
    function emitErrorHtmlForS3() {
      return {
        name: 'emit-error-html-for-s3',
        async postBuild({outDir}: {outDir: string}) {
          const fs = require('fs');
          const path = require('path');
          const src = path.join(outDir, '404.html');
          const dest = path.join(outDir, 'error.html');
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
          }
        },
      };
    },
    // LLM-ready output: /llms.txt index, /llms-full.txt corpus, and per-page raw .md.
    // HTML-based, so it covers all four docs instances + the custom mega-menu.
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'Open Data Hub Documentation',
        siteDescription: 'APIs and data ingestion documentation for the Open Data Hub.',
        depth: 2,
        // Order the index by the reader's journey: Get Started, then Use the Data,
        // then Data Ingestion, then Tools.
        includeOrder: [
          '/',
          '/quickstart',
          '/domains-and-datasets',
          '/licensing',
          '/use-data/**',
          '/data-ingestion/**',
          '/tools/**',
        ],
        content: {
          enableMarkdownFiles: true,
          enableLlmsFullTxt: true,
          includeDocs: true,
          includeGeneratedIndex: false, // drop auto-generated category stubs
          excludeRoutes: ['/search'],    // drop the search page
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-search-typesense'],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Open Data Hub Docs',
      hideOnScroll: true,
      // logo: {
      //   alt: 'Open Data Hub Logo',
      //   src: 'img/logo.svg',
      //   href: isProd ? 'https://opendatahub.com' : 'https://opendatahub.testingmachine.eu',
      //   target: '_self',
      // },
      items: [
        {type: 'docSidebar', sidebarId: 'generalSidebar', docsPluginId: 'general', position: 'left', label: 'Get Started'},
        {
          label: 'Data Ingestion',
          to: '#',
          areaBasePath: '/data-ingestion',
          // NOTE: each column renders a header cell first, so a column with N items
          // needs N+1 rows. Columns: GetStarted=2, Build=2, Blueprints=4, Reference=3.
          layout: [
            '0 1 2 3',
            '0 1 2 3',
            '0 1 2 3',
            '. . 2 3',
            '. . 2 .',
          ],
          items_: [
            {
              label: 'Get started',
              items: [
                {label: 'Getting started', sublabel: 'Run the stack locally and ingest your first data', to: 'data-ingestion/getting-started', icon: 'FaRocket', activeBaseRegex: '^/data-ingestion/getting-started'},
                {label: 'Ingesting time series', sublabel: 'Transform raw data into time series measurements', to: 'data-ingestion/data-transformer-from-scratch/timeseries', icon: 'FaClock', activeBaseRegex: '^/data-ingestion/data-transformer-from-scratch/timeseries'},
              ],
            },
            {
              label: 'Build from scratch',
              items: [
                {label: 'Data collector', sublabel: 'Write a new collector step by step', to: 'data-ingestion/data-collector-from-scratch', icon: 'BiSolidCollection'},
                {label: 'Data transformer', sublabel: 'Write a new transformer step by step', to: 'data-ingestion/data-transformer-from-scratch', icon: 'GiTransform'},
              ],
            },
            {
              label: 'Collector blueprints',
              items: [
                {label: 'API crawler', sublabel: 'Poll a REST API on a schedule', to: 'data-ingestion/collector-blueprints/api-crawler', icon: 'FaSpider'},
                {label: 'MQTT client', sublabel: 'Subscribe to an MQTT broker', to: 'data-ingestion/collector-blueprints/mqtt-client', icon: 'FaWifi'},
                {label: 'REST push', sublabel: 'Receive data pushed over HTTP', to: 'data-ingestion/collector-blueprints/rest-push', icon: 'FaUpload'},
                {label: 'S3 poller', sublabel: 'Ingest files from an S3 bucket', to: 'data-ingestion/collector-blueprints/s3-poller', icon: 'FaAws'},
              ],
            },
            {
              label: 'Reference',
              items: [
                {label: 'Transformer boilerplate', sublabel: 'Starting point for a transformer', to: 'data-ingestion/transformer-blueprints/transformer-boilerplate', icon: 'GiGears'},
                {label: 'SDKs', sublabel: 'Ingestion SDKs and libraries', to: 'data-ingestion/sdks', icon: 'FaCode'},
                {label: 'Local development', sublabel: 'Develop and debug collectors locally', to: 'data-ingestion/development/intro', icon: 'FaTerminal'},
              ],
            },
          ],
        },
        {
          label: 'Using our Data',
          to: '#',
          areaBasePath: '/use-data',
          // Header cell first => N+1 rows per column. Columns: Content=6, TimeSeries=3,
          // Transmodel=2, Auth=2.
          layout: [
            '0 1 2 3',
            '0 1 2 3',
            '0 1 2 3',
            '0 1 . .',
            '0 . . .',
            '0 . . .',
            '0 . . .',
          ],
          items_: [
            {
              label: 'Content API',
              items: [
                {label: 'Reference', sublabel: 'Endpoints, fields and the datamodel', to: 'use-data/content-api/reference', icon: 'FaBook', activeBaseRegex: '^/use-data/content-api/reference'},
                {label: 'Filtering and sorting', sublabel: 'Search, filter, sort and paginate', to: 'use-data/content-api/filtering-and-sorting', icon: 'FaFilter'},
                {label: 'Output formats', sublabel: 'JSON, CSV and response shaping', to: 'use-data/content-api/output-formats', icon: 'FaFileExport'},
                {label: 'Deprecations', sublabel: 'Removed fields and datamodel migration', to: 'use-data/content-api/deprecations', icon: 'FaExclamationTriangle'},
                {label: 'AlpineBits', sublabel: 'Tourism data exchange standard', to: 'use-data/content-api/alpinebits', icon: 'FaExchangeAlt'},
                {label: 'Swagger', sublabel: 'Interactive Content API explorer', to: 'use-data/content-api/swagger', icon: 'FaFlask'},
              ],
            },
            {
              label: 'Time Series API',
              items: [
                {label: 'Reference', sublabel: 'Mobility and time series endpoints', to: 'use-data/time-series-api/reference', icon: 'FaChartLine', activeBaseRegex: '^/use-data/time-series-api/reference'},
                {label: 'Filtering', sublabel: 'Filter by station type, tags and operators', to: 'use-data/time-series-api/filtering', icon: 'FaFilter'},
                {label: 'Swagger', sublabel: 'Interactive Time Series API explorer', to: 'use-data/time-series-api/swagger', icon: 'FaFlask'},
              ],
            },
            {
              label: 'Transmodel API',
              items: [
                {label: 'NeTEx & SIRI-Lite', sublabel: 'Public transport data standards', to: 'use-data/transmodel-api/reference', icon: 'FaBus', activeBaseRegex: '^/use-data/transmodel-api/reference'},
                {label: 'Swagger', sublabel: 'Interactive Transmodel API explorer', to: 'use-data/transmodel-api/swagger', icon: 'FaFlask'},
              ],
            },
            {
              label: 'Authentication & access',
              items: [
                {label: 'Authentication', sublabel: 'Keycloak, OAuth2 tokens and RBAC', to: 'use-data/authentication-and-access/authentication', icon: 'FaKey', activeBaseRegex: '^/use-data/authentication-and-access/authentication'},
                {label: 'Quotas, CLI & R', sublabel: 'Rate limits, CLI access and the R package', to: 'use-data/authentication-and-access/quotas-and-tools', icon: 'FaTachometerAlt'},
              ],
            },
          ],
        },
        {
          label: 'Tools',
          to: '#',
          areaBasePath: '/tools',
          // Header cell first => N+1 rows per column. Columns: Explore=3, Integrate=2.
          layout: [
            '0 1',
            '0 1',
            '0 1',
            '0 .',
          ],
          items_: [
            {
              label: 'Explore data',
              items: [
                {label: 'Discovery', sublabel: 'Find datasets and inspect their schema', to: 'tools/discovery', icon: 'FaCompass', activeBaseRegex: '^/tools/discovery'},
                {label: 'Data Browser', sublabel: 'Browse, filter and manage content', to: 'tools/data-browser', icon: 'FaTable', activeBaseRegex: '^/tools/data-browser'},
                {label: 'Analytics', sublabel: 'Chart time series without code', to: 'tools/analytics', icon: 'FaChartLine', activeBaseRegex: '^/tools/analytics'},
              ],
            },
            {
              label: 'Integrate',
              items: [
                {label: 'Web Components', sublabel: 'Embeddable data widgets', to: 'tools/web-components', icon: 'BiSolidCollection', activeBaseRegex: '^/tools/web-components'},
                {label: 'Imageresizer', sublabel: 'Image proxy and resizing', to: 'tools/imageresizer', icon: 'FaImage', activeBaseRegex: '^/tools/imageresizer'},
              ],
            },
          ],
        },
        // // { to: 'tutorial-basics/congratulations', label: 'Community Blog', position: 'right' },
        // { to: 'tutorial-basics/congratulations', label: 'Team', position: 'right' },
        // {
        //   href: 'https://github.com/facebook/docusaurus',
        //   label: 'GitHub',
        //   position: 'right',
        // },
      ],
    },
    footer: {
      style: 'light',
      copyright: '@Open Data Hub | <a class="text-decoration-underline" href="https://noi.bz.it/en/privacy-cookie-policy" target="_blank">Privacy</a>',
      links: [],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    typesense: {
      // Fallback defaults so `npm run start`/`build` work without TYPESENSE_* env
      // (local search won't connect; set real env/.env in production).
      typesenseCollectionName: process.env.TYPESENSE_COLLECTION || 'odh-docs',
      typesenseServerConfig: {
        nodes: [
          {
            host: process.env.TYPESENSE_HOST || 'localhost',
            port: Number(process.env.TYPESENSE_PORT || '8108'),
            protocol: (process.env.TYPESENSE_PROTOCOL || 'http') as 'http' | 'https',
          },
        ],
        apiKey: process.env.TYPESENSE_SEARCH_ONLY_API_KEY || 'search-only-key',
      },
      typesenseSearchParameters: {
        query_by: 'content,hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,hierarchy.lvl4,hierarchy.lvl5,hierarchy.lvl6',
      },
      contextualSearch: true,
    },
    customFields: {
      footer: {
        cards: [
          {
            icon: '/img/footer/open-data-hub.svg',
            alttext: 'Open Data Hub',
            text: 'Place where data and<br />tech are shared',
            URL: 'https://opendatahub.com',
          },
          {
            icon: '/img/footer/noi.svg',
            alttext: 'NOI Techpark',
            text: 'Innovation hub in<br />Südtirol/ Alto Adige',
            URL: 'https://noi.bz.it',
            target_blank: true,
          },
        ],
        columns: [
          {
            title: 'Services',
            title_URL: 'https://opendatahub.com/services/',
            rows: [
              { text: 'Data Access', URL: 'https://opendatahub.com/services/data-access' },
              { text: 'Data Sharing', URL: 'https://opendatahub.com/services/data-sharing' },
              { text: 'Data Visualization', URL: 'https://opendatahub.com/services/data-visualization' },
              { text: 'Certification', URL: 'https://opendatahub.com/services/certification' },
            ],
          },
          {
            title: 'Quickstart',
            title_URL: 'https://opendatahub.com/quickstart/', 
            rows: [
              { text: 'Datasets', URL: 'https://opendatahub.com/datasets' },
              {
                text: 'Data Browser',
                URL: 'https://databrowser.opendatahub.com/',
                target_blank: true,
              },
              {
                text: 'Analytics Tool',
                URL: 'https://analytics.opendatahub.com/',
                target_blank: true,
              },
              {
                text: 'Web Components',
                URL: 'https://webcomponents.opendatahub.com/',
                target_blank: true,
              },
              {
                text: 'Access Open Data Hub data from R',
                URL: 'https://github.com/noi-techpark/it.bz.opendatahub.analytics.libs/tree/main/api/R',
                target_blank: true,
              },
            ],
          },
          {
            title: 'Community',
            title_URL: 'https://opendatahub.com/community/',
            rows: [
              { text: 'Community', URL: 'https://opendatahub.com/community/' },
              { text: 'Events', URL: 'https://opendatahub.com/events/' },
            ],
          },
          {
            title: 'Social Media',
            isSocial: true,
            rows: [
              {
                icon: '/img/footer/github.svg',
                text: 'GitHub',
                URL: 'https://github.com/noi-techpark',
              },
              {
                icon: '/img/footer/linkedin.png',
                text: 'LinkedIn',
                URL: 'https://www.linkedin.com/company/opendatahub',
              },
              {
                icon: '/img/footer/telegram.svg',
                text: 'Telegram',
                URL: 'https://t.me/OpenDataHub',
              },
              {
                icon: '/img/footer/element.svg',
                text: 'element.io',
                URL: 'https://app.element.io/#/room/#opendatahub:matrix.org',
              },
              {
                icon: '/img/footer/facebook.svg',
                text: 'Facebook',
                URL: 'https://www.facebook.com/opendatahub/',
              },
            ],
          },
        ],
      },
    },
  } satisfies Preset.ThemeConfig,  
};

export default config;
