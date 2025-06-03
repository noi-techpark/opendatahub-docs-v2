/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import {
  useThemeConfig,
} from '@docusaurus/theme-common';
import type { Props as NavbarItemConfig } from '@theme/NavbarItem';
import NavbarItem from '../../../NavbarItem';

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

// The primary menu displays the navbar items
export default function NavbarMobilePrimaryMenu() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const items = useNavbarItems();

  function toggleMobileSidebar() {
    setMobileSidebarOpen(!mobileSidebarOpen);
    // You can also do other side effects here if needed
  }

  return (
    <ul className="menu__list">
      {items.map((item, i) => (
        <NavbarItem
          mobile
          {...item}
          onClick={() => toggleMobileSidebar()}
          key={i}
        />
      ))}
    </ul>
  );
}
