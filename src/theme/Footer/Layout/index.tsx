// SPDX-FileCopyrightText: 2024 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { type FooterCard, type FooterColumn } from '../../../theme.d';
import styles from './styles.module.css';

type Props = {
  style?: 'light' | 'dark';
  cards?: FooterCard[];
  columns?: FooterColumn[];
  copyright?: string;
};

// Sub-component for the cards
function PromoCard({ card }: { card: FooterCard }) { 
  return (
    <div className={clsx(styles.col, styles.col12, styles.colXl6)}>
      <Link
        href={card.URL}
        target={card.target_blank ? '_blank' : undefined}
        className={styles.promoCard}>
        <div className={styles.promoCardIcon}>
          <img src={card.icon} alt={card.alttext} />
        </div>
        <span dangerouslySetInnerHTML={{ __html: card.text }} />
      </Link>
    </div>
  );
}

// Sub-component for the link columns
function LinkColumn({ column }: { column: FooterColumn }) { // Use the imported type
  const TitleTag = column.title_URL ? Link : 'div';
  
  return (
    <div className={clsx(styles.col, styles.col12, styles.colLg3)}>
      <div className={styles.linkColumn}>
        <TitleTag
          className={styles.linkColumnTitle}
          {...(column.title_URL && { to: column.title_URL })}>
          <strong>{column.title}</strong>
        </TitleTag>

        {column.rows.map((item, i) => (
          <Link
            key={i}
            href={item.URL}
            target={item.target_blank || column.isSocial ? '_blank' : undefined}
            className={clsx(styles.linkColumnItem, {
              [styles.socialLink]: column.isSocial,
            })}>
            {column.isSocial && item.icon && <img src={item.icon} alt={item.text} />}
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function FooterLayout({ style, cards, columns, copyright }: Props): ReactNode {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, {
        'footer--dark': style === 'dark',
      })}>
      <div className={styles.footerContainer}>
        <div className={styles.container}>
          {cards && cards.length > 0 && (
            <div className={clsx(styles.row, styles.gy2, styles.textSemiBold)}>
              {cards.map((card, i) => <PromoCard key={i} card={card} />)}
            </div>
          )}
          <div className={styles.hrBold}></div>
          {columns && columns.length > 0 && (
            <div className={clsx(styles.row, styles.gy3)}>
              {columns.map((column, i) => <LinkColumn key={i} column={column} />)}
            </div>
          )}
        </div>
      </div>
      {copyright && (
        <div className={styles.copyrightSection}>
          <div
            dangerouslySetInnerHTML={{ __html: copyright }}
          />
        </div>
      )}
    </footer>
  );
}