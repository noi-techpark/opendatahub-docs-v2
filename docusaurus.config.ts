import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';


// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const isProd = process.env.NODE_ENV === 'production';

const config: Config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
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

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
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
        id: 'data',
        path: 'docs/data',
        routeBasePath: 'data',
        sidebarPath: require.resolve('./sidebarsData.ts'),
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Open Data Hub',
      hideOnScroll: true,
      logo: {
        alt: 'Open Data Hub Logo',
        src: 'img/logo.svg',
        href: isProd ? 'https://opendatahub.com' : 'https://opendatahub.testingmachine.eu',
        target: '_self',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'generalSidebar',
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
              label: 'Ingestion & Elaborations',
              items: [
                {
                  label: 'Getting Started',
                  sublabel: 'Deploy Open Data core locally',
                  to: 'data/getting-started/intro',
                  icon: 'FaRocket',
                  activeBaseRegex: '^/data/getting-started/*',
                },
                {
                  label: 'Development',
                  sublabel: 'Contribute creating new data pipelines',
                  to: 'data/development/intro',
                  icon: 'FaWrench',
                  activeBaseRegex: '^/data/development/*',
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
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,  
};

export default config;
