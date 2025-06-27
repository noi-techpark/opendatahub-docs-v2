/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { lazy, Suspense } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type { Props as OriginalProps } from '@theme/NavbarItem/NavbarNavLink';
import IconExternalLink from '@site/src/components/ExternalLink/IconExternalLink';
import isInternalUrl from '@docusaurus/isInternalUrl';
import { isRegexpStringMatch } from '@docusaurus/theme-common';
import './styles.css';
import * as FaIcons from 'react-icons/fa';
import * as Fa6Icons from 'react-icons/fa6';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from 'react-icons/gi';
import * as HiIcons from 'react-icons/hi';
import * as BsIcons from 'react-icons/bs';
import * as TbIcons from 'react-icons/tb';
import * as RiIcons from 'react-icons/ri';
import * as SiIcons from 'react-icons/si';
import * as BiIcons from 'react-icons/bi';
import * as PiIcons from 'react-icons/pi';

const dropdownLinkActiveClass = 'dropdown__link--active';

const iconPacks: Record<string, Record<string, any>> = {
  fa: FaIcons,
  fa6: Fa6Icons,
  md: MdIcons,
  io: IoIcons,
  ai: AiIcons,
  gi: GiIcons,
  hi: HiIcons,
  bs: BsIcons,
  tb: TbIcons,
  ri: RiIcons,
  si: SiIcons,
  bi: BiIcons,
  pi: PiIcons,
};

export const getIconComponent = (iconName: string): React.ComponentType | null => {
  if (!iconName) return null;

  const match = iconName.match(/^([A-Za-z]+?)([A-Z].*)$/);
  if (!match) return null;

  const [, prefix] = match;
  const pack = iconPacks[prefix.toLowerCase()];
  if (!pack) return null;

  return pack[iconName] || null;
};

// // Lazy-load a React icon component by dynamic import
// const getIconComponent = (iconPath: string): React.ComponentType | null => {
//   if (!iconPath) return null;

//   // Match the prefix using regex (e.g., Fa, Fa6, Md, etc.)
//   const match = iconPath.match(/^([A-Za-z]+?)([A-Z].*)$/);
//   if (!match) return null;

//   const [, prefix, iconName] = match;

//   // Map package prefix to import path
//   const packMap: Record<string, () => Promise<any>> = {
//     fa: () => import('react-icons/fa'),
//     fa6: () => import('react-icons/fa6'),
//     md: () => import('react-icons/md'),
//     io: () => import('react-icons/io'),
//     ai: () => import('react-icons/ai'),
//     gi: () => import('react-icons/gi'),
//     hi: () => import('react-icons/hi'),
//     bs: () => import('react-icons/bs'),
//     tb: () => import('react-icons/tb'),
//     ri: () => import('react-icons/ri'),
//     si: () => import('react-icons/si'),
//     bi: () => import('react-icons/bi'),
//     pi: () => import('react-icons/pi'),
//   };

//   const loader = packMap[prefix.toLowerCase()];
//   if (!loader) return null;

//   const Icon = lazy(async () => {
//     const module = await loader();
//     return { default: module[iconPath] || (() => null) };
//   });

//   return Icon;
// };

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
  console.log(icon)
  const IconComponent = getIconComponent(icon);

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
        {/* {IconComponent && (
          <Suspense fallback={null}>
            <div className='link__icon'><IconComponent /></div>
          </Suspense>
        )} */}
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
