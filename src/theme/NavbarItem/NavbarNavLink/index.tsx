/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type { Props as OriginalProps } from '@theme/NavbarItem/NavbarNavLink';
import IconExternalLink from '@site/src/components/ExternalLink/IconExternalLink';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { isRegexpStringMatch } from '@docusaurus/theme-common';
import './styles.css';
import * as FaIcons from 'react-icons/fa';

const dropdownLinkActiveClass = 'dropdown__link--active';

export interface Props extends OriginalProps {
  sublabel?: string;
  icon?: string;
}

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  sublabel,
  icon,
  activeClassName = '',
  prependBaseUrlToHref,
  ...props
}: Props): JSX.Element {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}
  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const isExternalLink = label && href && !isInternalUrl(href);
  const isDropdownLink = activeClassName === dropdownLinkActiveClass;
  const IconComponent = icon ? FaIcons[icon] : null;

  return (
    <Link
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            isNavLink: true,
            activeClassName: !props.className?.includes(activeClassName)
              ? activeClassName
              : '',
            to: toUrl,
            ...(activeBasePath || activeBaseRegex
              ? {
                  isActive: (_match, location) =>
                    activeBaseRegex
                      ? isRegexpStringMatch(activeBaseRegex, location.pathname)
                      : location.pathname.startsWith(activeBaseUrl),
                }
              : null),
          })}
      {...props}
    >
      <div className='link'>
        {IconComponent && <div className='link__icon'><IconComponent /></div>}
        <div className='link__body'>
          <div className='link__label'>
            {label}
            {isExternalLink && (
              <IconExternalLink
                {...(isDropdownLink && {
                  width: 12,
                  height: 12,
                })}
              />
            )}
          </div>
          {sublabel && <div className='link__sublabel'>{sublabel}</div>}
        </div>
      </div>
    </Link>
  );
}
