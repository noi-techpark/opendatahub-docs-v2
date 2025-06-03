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
        docs: {
          routeBasePath: '/', // Serve the docs at the site's root
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
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
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
        {
          label: 'Build',
          to: '#',
          layout: [
            '0 1 2 3',
            '0 1 2 3',
            '. 1 2 3',
            '. 1 2 .',
          ],
          items_: [
            {
              label: 'Getting Started',
              items: [
                {
                  label: 'Getting Started',
                  sublabel: 'Open Data Hub development basics',
                  to: 'http://opendatahub.com/api/',
                  icon: 'FaRocket',
                },
              ],
            },
            {
              label: 'Protocols',
              items: [
                {
                  label: 'GraphQL',
                  sublabel: 'Access the Open Data Hub graph through GraphQL',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue908',
                  activeBaseRegex: '^/protocols/graphql.*',
                },
                {
                  label: 'gRPC',
                  sublabel: 'Efficiently integrate APIs via protobuf requests',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue908',
                  activeBaseRegex: '^/protocols/grpc.*',
                },
                {
                  label: 'REST',
                  sublabel: 'Access APIs via traditional JSON requests',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue908',
                  activeBaseRegex: '^/protocols/rest.*',
                },
              ],
            },
            {
              label: 'Authentication',
              items: [
                {
                  label: 'OAuth 2.0',
                  sublabel: 'Integrate applications with Open Data Hub',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue905',
                  activeBaseRegex: '^/authentication/oauth2.*',
                },
                {
                  label: 'OpenID Connect',
                  sublabel: 'Use Open Data Hub as identity provider',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue905',
                  activeBaseRegex: '^/authentication/openid-connect.*',
                },
                {
                  label: 'Service Accounts',
                  sublabel: 'Grant access to non-human accounts',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue905',
                  activeBaseRegex: '^/authentication/service-accounts.*',
                },
              ],
            },
            {
              label: 'Policies',
              items: [
                {
                  label: 'Rate-Limiting',
                  sublabel: 'Learn how requests frequency is limited',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue909',
                  activeBaseRegex: '^/policies/rate-limiting.*',
                },
                {
                  label: 'Quotas',
                  sublabel: 'Learn how resources consumption is limited',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue909',
                  activeBaseRegex: '^/policies/quotas.*',
                },
              ],
            },
          ],
        },
        {
          label: 'Products',
          to: '#',
          layout: [
            '0 2 5 7',
            '0 2 5 7',
            '0 2 5 7',
            '0 3 5 8',
            '1 3 6 8',
            '1 4 6 .',
            '1 4 6 .',
            // '0 2 5 7',
            // '0 2 5 7',
            // '0 2 5 7',
            // '0 3 5 7',
            // '0 3 5 7',
            // '1 4 6 7',
            // '1 4 6 7',
            // '1 . 6 8',
            // '1 . 6 8',
          ],
          items_: [
            {
              label: 'Knowledge-Base APIs',
              items: [
                // {
                //   label: 'Bridge',
                //   sublabel: 'Access links across external references',
                //   to: 'tutorial-basics/congratulations',
                //   icon: '\ue903',
                //   activeBaseRegex: '^/bridge/.*',
                // },
                {
                  label: 'Cross-Reference',
                  sublabel: 'Easily match internal and external resources',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/crossrefs/.*',
                },
                {
                  label: 'Knowledge',
                  sublabel: 'Contribute to the graph knowledge-base',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/knowledge/.*',
                },
                {
                  label: 'Multimedia',
                  sublabel: 'Open Data Hub source-of-truth for abstract resources',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/multimedia/.*',
                },
              ],
            },
            {
              label: 'Publishing APIs',
              items: [
                {
                  label: 'Product',
                  sublabel: 'Manage physical and digital goods',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/product/.*',
                },
                {
                  label: 'Release',
                  sublabel: 'Schedule and publish product releases',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/release/.*',
                },
                // {
                //   label: 'Payment',
                //   sublabel: 'Securely manage payments and subscriptions',
                //   to: 'tutorial-basics/congratulations',
                //   icon: '\ue903',
                //   activeBaseRegex: '^/payment/.*',
                // },
              ],
            },
            {
              label: 'User-Experience APIs',
              items: [
                {
                  label: 'Tracker',
                  sublabel: 'Track the progress of resources',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/tracker/.*',
                },
                {
                  label: 'Library',
                  sublabel: 'Manage custom collections of resources',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/library/.*',
                },
              ],
            },
            {
              label: 'Storage APIs',
              items: [
                {
                  label: 'Image',
                  sublabel: 'Store images and albums',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/image/.*',
                },
              ],
            },
            {
              label: 'AI & Analysis APIs',
              items: [
                {
                  label: 'Vision',
                  sublabel: 'Analyze and annotate images',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/vision/.*',
                },
              ],
            },
            {
              label: 'IAM & Security APIs',
              items: [
                {
                  label: 'Credentials',
                  sublabel: 'Securely store third-party credentials',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/credentials/.*',
                },
                {
                  label: 'Identity and Access Management',
                  sublabel: 'Manage service accounts and groups',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/iam/.*',
                },
                {
                  label: 'Identity',
                  sublabel: 'Manage user profile and settings',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/identity/.*',
                },
                // {
                //   label: 'Resource Manager',
                //   sublabel: 'Manage organizations and policies',
                //   to: 'tutorial-basics/congratulations',
                //   icon: '\ue903',
                //   activeBaseRegex: '^/resourcemanager/.*',
                // },
              ],
            },
            {
              label: 'Indexing APIs',
              items: [
                {
                  label: 'WebCache',
                  sublabel: 'Keep track of indexed resources',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/webcache/.*',
                },
                {
                  label: 'WebPage',
                  sublabel: 'Access indexed website pages',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue903',
                  activeBaseRegex: '^/webpage/.*',
                },
                // {
                //   label: 'WebSearch',
                //   sublabel: 'Search via images and keywords',
                //   to: 'websearctutorial-basics/congratulations',
                //   icon: '\ue903',
                //   activeBaseRegex: '^/websearch/.*',
                // },
              ],
            },
            {
              label: 'Libraries',
              items: [
                // {
                //   label: 'C#',
                //   sublabel: '.NET Client Libraries',
                //   to: 'dotnetutorial-basics/congratulations',
                //   icon: '\ue902',
                //   activeBaseRegex: '^/dotnet/.*',
                // },
                {
                  label: 'Go',
                  sublabel: 'Go Client Libraries',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue902',
                  activeBaseRegex: '^/go/.*',
                },
                // {
                //   label: 'Java',
                //   sublabel: 'Java Client Libraries',
                //   to: 'javtutorial-basics/congratulations',
                //   icon: '\ue902',
                //   activeBaseRegex: '^/java/.*',
                // },
                // {
                //   label: 'PHP',
                //   sublabel: 'PHP Client Libraries',
                //   to: 'phtutorial-basics/congratulations',
                //   icon: '\ue902',
                //   activeBaseRegex: '^/php/.*',
                // },
                // {
                //   label: 'Python',
                //   sublabel: 'Python Client Libraries',
                //   to: 'pythotutorial-basics/congratulations',
                //   icon: '\ue902',
                //   activeBaseRegex: '^/python/.*',
                // },
                {
                  label: 'TypeScript',
                  sublabel: 'Node.js Client Libraries',
                  to: 'tutorial-basics/congratulations',
                  icon: '\ue902',
                  activeBaseRegex: '^/nodejs/.*',
                },
              ],
            },
            {
              label: 'Applications',
              items: [
                {
                  label: 'gRBAC',
                  sublabel: 'Graph Role-Based Access Control',
                  href: 'https://github.com/grbac/grbac',
                  icon: '\ue90a',
                },
              ],
            },
          ],
        },
        // { to: 'tutorial-basics/congratulations', label: 'Community Blog', position: 'right' },
        { to: 'tutorial-basics/congratulations', label: 'Team', position: 'right' },
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
