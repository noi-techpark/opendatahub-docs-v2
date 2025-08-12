// SPDX-FileCopyrightText: 2024 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { type ReactNode } from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import FooterLayout from './Layout';

type CustomThemeConfig = {
  footer?: any;
  customFields?: {
    footer?: {
      cards?: Array<{
        URL: string;
        target_blank?: boolean;
        icon: string;
        alttext: string;
        text: string;
      }>;
      columns?: Array<{
        title: string;
        title_URL?: string;
        isSocial?: boolean;
        rows: Array<{
          text: string;
          URL: string;
          target_blank?: boolean;
          icon?: string;
        }>;
      }>;
    };
  };
};

function Footer(): ReactNode {
  const themeConfig = useThemeConfig() as CustomThemeConfig;
  const { footer, customFields } = themeConfig;

  if (!footer && !customFields?.footer) {
    return null;
  }

  const { style, copyright } = footer ?? {};
  const { cards, columns } = customFields?.footer ?? {};

  return (
    <FooterLayout
      style={style}
      cards={cards}
      columns={columns}
      copyright={copyright}
    />
  );
}

export default React.memo(Footer);