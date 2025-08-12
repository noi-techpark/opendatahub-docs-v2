// SPDX-FileCopyrightText: 2024 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

// types of custom footer elements
export type FooterCard = {
  URL: string;
  target_blank?: boolean;
  icon: string;
  alttext: string;
  text: string;
};

export type FooterColumn = {
  title: string;
  title_URL?: string;
  isSocial?: boolean;
  rows: {
    text: string;
    URL: string;
    target_blank?: boolean;
    icon?: string;
  }[];
};

// Extend the ThemeConfig type
declare module '@docusaurus/theme-common' {
  interface ThemeConfig {
    customFields?: {
      footer?: {
        cards?: FooterCard[];
        columns?: FooterColumn[];
      };
    };
  }
}
