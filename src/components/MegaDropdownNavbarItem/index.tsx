/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import {
  useCollapsible,
  Collapsible,
  isRegexpStringMatch,
//   useHideableNavbar,
  useThemeConfig,
} from '@docusaurus/theme-common';
import { useLocation } from 'react-router-dom';
import type { DesktopOrMobileNavBarItemProps } from '@theme/NavbarItem/DropdownNavbarItem';
import type { LinkLikeNavbarItemProps } from '@theme/NavbarItem';

import NavbarNavLink, {
  Props as NavbarNavLinkProps,
} from '@theme/NavbarItem/NavbarNavLink';
import NavbarItem from '@theme/NavbarItem';
import './styles.css';
import { useCurrentDocPlugins } from '@site/src/theme/NavbarItem/DocsVersionDropdownNavbarItem/utils';
import { useWikiPreferredVersion } from '@site/src/contexts/wikiPreferredVersion';

function isSamePath(currentPath, basePath) {
return currentPath === basePath || currentPath.startsWith(basePath + '/');
}

const dropdownLinkActiveClass = 'dropdown__link--active';

interface MegaDropdownCategory {
  label: string;
  items: LinkLikeNavbarItemProps[];
}

interface DesktopOrMobileMegaDropdownNavbarItemProps
  extends Omit<DesktopOrMobileNavBarItemProps, 'items'> {
  readonly items_: MegaDropdownCategory[];
  readonly layout?;
}

export interface Props extends DesktopOrMobileMegaDropdownNavbarItemProps {
  readonly mobile?: boolean;
}

function createItemCursor({ items, label, className, ...props }) {
  const cursor = { items: [], index: 0 };

  if (items) {
    if (label) {
      cursor.items.push({ label, className });
    }
    cursor.items.push(...items);
  } else {
    cursor.items.push({ label, className, ...props });
  }

  return cursor;
}

function MegaDropdownItem({
  className,
  to,
  href,
  label,
  ...props
}: NavbarNavLinkProps) {
  if (to || href) {
    return (
      <NavbarNavLink
        className={clsx('dropdown__link', className)}
        activeClassName={dropdownLinkActiveClass}
        to={to}
        href={href}
        label={label}
        {...props}
      />
    );
  }

  if (label) {
    return <div className='dropdown__label'>{label}</div>;
  }

  throw 'Mega dropdown item must be a link or a category header.';
}

/***
 * Loop through the megamenu's grouped items and return ungrouped items
 * @param groupedItems array
 * @returns array of ungrouped items
 */
function getUngroupedItemsList(groupedItems) {
  const items = [];
  groupedItems.map((itemList) => {
    itemList.items.map((item) => {
      items.push(item);
    });
  });
  return items;
}

/**
 Add support for a changing label in dropdowns
 according to the selected dropdown item
 **/
function getDropdownProps(props, items, localPathname) {
  const activeItem = items.filter((item) => isItemActive(item, localPathname));
  if (activeItem.length) {
    return {
      activeBaseRegex: activeItem[0].activeBaseRegex,
      label: props.label + ' | ' + activeItem[0].label,
    };
  }

  return props;
}

function isItemActive(
  item: LinkLikeNavbarItemProps,
  localPathname: string,
): boolean {
//   if (isSamePath(item.to, localPathname)) {
//     return true;
//   }
  if (isRegexpStringMatch(item.activeBaseRegex, localPathname)) {
    return true;
  }
  if (item.activeBasePath && localPathname.startsWith(item.activeBasePath)) {
    return true;
  }
  return false;
}

function containsActiveItems(
  items: readonly LinkLikeNavbarItemProps[],
  localPathname: string,
): boolean {
  return items.some((item) => isItemActive(item, localPathname));
}

function MegaDropdownNavbarItemDesktop({
  items_: items,
  layout,
  position,
  className,
  ...props
}: DesktopOrMobileMegaDropdownNavbarItemProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const localPathname = useLocation().pathname;

  const {
    navbar: { hideOnScroll },
  } = useThemeConfig();
//   const { isNavbarVisible } = useHideableNavbar(hideOnScroll);

  const itemCursors = items.map(createItemCursor);
  /**
   Added consts to get the dropdown label if a dropdown item is selected
   **/
  const ungroupedItems = getUngroupedItemsList(items);
  const dropdownProps = getDropdownProps(
    props,
    ungroupedItems,
    useLocation().pathname,
  );
  const containsActive = containsActiveItems(ungroupedItems, localPathname);

  // Layout is in row major order due to CSS grid area syntax
  const rowCount = layout.length;
  const columnCount = Math.max(...layout.map((row) => row.split(/\s+/).length));

  // Place indexes in column major order.
  const gridIndexes = [];
  layout.forEach((row, rowOffset) => {
    row.split(/\s+/).forEach((column, columnOffset) => {
      if (column && column !== '.') {
        gridIndexes[rowOffset + columnOffset * rowCount] = column;
      }
    });
  });

  // Resolve items in column major order.
  const gridItems = gridIndexes.map((index) => {
    const cursor = itemCursors[index];
    if (cursor) {
      return cursor.items[cursor.index++] ?? null;
    }
  });

  // Place items in grid in row major order.
  const grid = [];
  let lastItem = null;
  for (let rowOffset = 0; rowOffset < rowCount; rowOffset++) {
    const rows = [];
    for (let columnOffset = 0; columnOffset < columnCount; columnOffset++) {
      const item = gridItems[rowOffset + columnOffset * rowCount];
      rows.push(item);
      if (item) {
        lastItem = item;
      }
    }
    grid.push(rows);
  }

  // Add tab behavior to last item
  lastItem.onKeyDown = (e) => {
    if (e.key === 'Tab') {
      setShowDropdown(false);
    }
  };

//   useEffect(() => {
//     if (!isNavbarVisible) {
//       setShowDropdown(false);
//     }
//   }, [isNavbarVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        !dropdownRef.current ||
        dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setShowDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
      ref={dropdownRef}
      className={clsx('dropdown', 'dropdown--hoverable', 'dropdown--mega', {
        'dropdown--right': position === 'right',
        'dropdown--show': showDropdown,
      })}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <NavbarNavLink
        className={clsx('navbar__item navbar__link', className, {
          'navbar__link--active': containsActive,
        })}
        {...dropdownProps}
        onClick={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            setShowDropdown(!showDropdown);
          }
        }}
        onMouseEnter={() => setShowDropdown(true)}
      >
        {props.children ?? props.label}
      </NavbarNavLink>
      <div className='dropdown__container'>
        <div className='dropdown__menu'>
          {grid.map((row, rowKey) => (
            <div className='row row--no-gutters dropdown__row' key={rowKey}>
              {row.map((column, columnKey) => (
                <div
                  className='col margin-horiz--xs dropdown__col'
                  key={columnKey}
                >
                  {column ? <MegaDropdownItem {...column} /> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MegaDropdownNavbarItemMobile({
  items_: items,
  className,
  ...props
}: DesktopOrMobileMegaDropdownNavbarItemProps) {
  // Delete props to not pass them on
  delete props.position;
  delete props.layout;

  const ungroupedItems = getUngroupedItemsList(items);

  const localPathname = useLocation().pathname;
  const containsActive = containsActiveItems(ungroupedItems, localPathname);

  /**
   Added const to get the dropdown label if a dropdown item is selected
   **/
  const dropdownProps = getDropdownProps(props, ungroupedItems, localPathname);

  const { collapsed, toggleCollapsed, setCollapsed } = useCollapsible({
    initialState: () => !containsActive,
  });

  // Expand/collapse if any item active after a navigation
  useEffect(() => {
    if (containsActive) {
      setCollapsed(!containsActive);
    }
  }, [localPathname, containsActive, setCollapsed]);

  return (
    <li
      className={clsx('menu__list-item', {
        'menu__list-item--collapsed': collapsed,
      })}
    >
      <NavbarNavLink
        role='button'
        className={clsx('menu__link menu__link--sublist', className)}
        {...props}
        onClick={(e) => {
          e.preventDefault();
          toggleCollapsed();
        }}
      >
        {dropdownProps}
      </NavbarNavLink>
      <Collapsible lazy as='ul' className='menu__list' collapsed={collapsed}>
        {items.map((childItemProps, i) => (
          <NavbarItem
            mobile
            onClick={props.onClick}
            activeClassName='menu__link--active'
            {...childItemProps}
            key={i}
          />
        ))}
      </Collapsible>
    </li>
  );
}

function resolveVersion(
  item: LinkLikeNavbarItemProps,
): LinkLikeNavbarItemProps {
  if (item.to !== undefined) {
    // TODO: Not rely on `{projectId}/{docsPath}` formatted url
    const [projectId, ...docsPathItems] = item.to.split('/');
    const docsPath = docsPathItems.join('/');
    const pathname = `/${projectId}/${docsPath}`;
    const pluginIds = useCurrentDocPlugins(pathname);

    const { preferredVersion } = useWikiPreferredVersion(pathname, pluginIds);

    if (preferredVersion !== null) {
      return {
        ...item,
        to: `${preferredVersion.path}/${docsPath}`,
      };
    }
  }

  return item;
}

export default function MegaDropdownNavbarItem({
  mobile = false,
  items_: megamenuItems,
  ...props
}: Props): JSX.Element {
  // TODO: change mega dropdown implementation to accept Docusaurus provided navbar items
  // and do version resolving in the proper places.
  const items_ = megamenuItems.map((megamenuItem) => ({
    ...megamenuItem,
    items: megamenuItem.items.map(resolveVersion),
  }));

  const Comp = mobile
    ? MegaDropdownNavbarItemMobile
    : MegaDropdownNavbarItemDesktop;
  return <Comp items_={items_} {...props} />;
}