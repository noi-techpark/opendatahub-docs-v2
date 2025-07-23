import React, {type ReactNode} from 'react';
import Content from '@theme-original/Navbar/Content';
import type ContentType from '@theme/Navbar/Content';
import type {WrapperProps} from '@docusaurus/types';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../styles.module.css';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const testing = siteConfig.customFields.testing;

  const logoHref = testing
    ? 'https://opendatahub.testingmachine.eu'
    : 'https://opendatahub.com';

  return (
    <>
      <Content {...props} />
      <section className={styles.logoWrapper}>
        <a href={logoHref} target="_self" rel="noopener">
          <img
            src="img/logo.svg"
            alt="Open Data Hub Logo"
            className={styles.logoImage}
          />
        </a>
      </section>
    </>
  );
}
