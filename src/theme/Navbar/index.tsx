// SPDX-FileCopyrightText: 2024 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, {type ReactNode} from 'react';
import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type {WrapperProps} from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

type Props = WrapperProps<typeof NavbarType>;

export default function NavbarWrapper(props: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const testing = siteConfig.customFields.testing as boolean;

  return (
    <>
      {testing && (
        <div className={styles.testBanner}>
          TESTING
        </div>
      )}
      <Navbar {...props} />
    </>
  );
}