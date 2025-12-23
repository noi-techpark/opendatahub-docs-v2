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
  // noIndex: process.env.TESTING === 'true',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'http://localhost:3000',
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
        path: 'docs/tutorial',
        routeBasePath: '/',
        sidebarPath: require.resolve('./sidebarsGeneral.ts'),
        // Only include root-level files (not core/ or data/)
        // include: ['intro.md', 'test-api.mdx'],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'core',
        path: 'docs/core',
        routeBasePath: 'core',
        sidebarPath: require.resolve('./sidebarsCore.ts'),
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
        {
          type: 'docSidebar',
          sidebarId: 'generalSidebar',
          docsPluginId: 'general',
          position: 'left',
          label: 'Tutorial',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          label: 'Build',
          to: '#',
          layout: [
            '0 1 2 3',
            '0 1 2 3',
            '0 1 2 3',
            '0 1 2 .',
          ],
          items_: [
            {
              label: 'Core',
              items: [
                {
                  label: 'Concepts',
                  sublabel: 'Explore Open Data Hub architecture and concepts',
                  to: 'core/concepts/intro',
                  icon: 'FaSitemap',
                  activeBaseRegex: '^/core/concepts/*',
                },
                {
                  label: 'Deploy & Operate in K8s',
                  sublabel: 'Deploy and operate Open Data Hub in production',
                  to: 'core/k8s/intro',
                  icon: 'PiGraph',
                  activeBaseRegex: '^/core/k8s/*',
                },
              ],
            },
            {
              label: 'Data Ingestion',
              items: [
                {
                  label: 'Getting Started',
                  sublabel: 'Deploy Open Data core locally and start ingesting data',
                  to: 'data-ingestion/getting-started',
                  icon: 'FaRocket',
                },
                {
                  label: 'Build a Collector',
                  sublabel: 'Contribute creating new Data Collector',
                  to: 'data-ingestion/data-collector-from-scratch',
                  icon: 'BiSolidCollection',
                },
                {
                  label: 'Build a Transformer',
                  sublabel: 'Contribute creating new Data Transformer',
                  to: 'data-ingestion/data-transformer-from-scratch',
                  icon: 'GiTransform',
                },
              ],
            },
            {
              label: 'Using our Data',
              items: [
                
              ],
            },
            {
              label: 'Tools',
              items: [
                
              ],
            },
          ],
        },
        {
          label: 'APIs',
          to: '#',
          layout: [
            '0 1 2 3',
            '0 1 2 3',
          ],
          items_: [
            {
              label: 'Content APIs',
              items: [
                {
                  label: 'Swagger',
                  sublabel: 'Try out our latest Content API schema with real data',
                  to: 'tutorial-basics/congratulations',
                  activeBaseRegex: '^/crossrefs/.*',
                },
              ],
            },
            {
              label: 'Timeseries APIs',
              items: [
                {
                  label: 'Swagger',
                  sublabel: 'Try out our latest Timeseries API schema with real data',
                  to: 'tutorial-basics/congratulations',
                  activeBaseRegex: '^/product/.*',
                },
                
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
      typesenseCollectionName: process.env.TYPESENSE_COLLECTION!,
      typesenseServerConfig: {
        nodes: [
          {
            host: process.env.TYPESENSE_HOST!,
            port: Number(process.env.TYPESENSE_PORT!),
            protocol: process.env.TYPESENSE_PROTOCOL! as 'http' | 'https',
          },
        ],
        apiKey: process.env.TYPESENSE_SEARCH_ONLY_API_KEY!,
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
