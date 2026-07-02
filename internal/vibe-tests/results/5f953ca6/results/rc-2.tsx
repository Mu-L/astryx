// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState, useEffect} from 'react';
import {SideNav} from '@astryxdesign/core/SideNav';
import {SideNavItem} from '@astryxdesign/core/SideNav';
import {SideNavSection} from '@astryxdesign/core/SideNav';
import {SideNavHeading} from '@astryxdesign/core/SideNav';
import {Button} from '@astryxdesign/core/Button';
import {Text} from '@astryxdesign/core/Text';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  layout: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    width: 280,
    borderRight: '1px solid var(--color-border-default)',
  },
  bottomSheet: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-background-surface)',
    borderTop: '1px solid var(--color-border-default)',
    borderRadius: '16px 16px 0 0',
    padding: 16,
    maxHeight: '60vh',
    overflowY: 'auto',
    zIndex: 100,
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 99,
  },
  main: {
    flex: 1,
    padding: 24,
  },
  mobileToggle: {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 50,
  },
});

export default function ResponsiveSidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const navContent = (
    <SideNav header={<SideNavHeading>Navigation</SideNavHeading>}>
      <SideNavSection title="Main">
        <SideNavItem label="Dashboard" isSelected />
        <SideNavItem label="Projects" />
        <SideNavItem label="Tasks" />
      </SideNavSection>
      <SideNavSection title="Settings">
        <SideNavItem label="Profile" />
        <SideNavItem label="Preferences" />
      </SideNavSection>
    </SideNav>
  );

  if (isMobile) {
    return (
      <div>
        <div {...stylex.props(styles.main)}>
          <Text type="display-3">Page Content</Text>
          <Text type="body">Resize the window below 768px to see the bottom sheet.</Text>
        </div>
        {isSheetOpen && (
          <>
            <div {...stylex.props(styles.overlay)} onClick={() => setIsSheetOpen(false)} />
            <div {...stylex.props(styles.bottomSheet)}>
              {navContent}
            </div>
          </>
        )}
        <div {...stylex.props(styles.mobileToggle)}>
          <Button label="Menu" variant="primary" onClick={() => setIsSheetOpen(!isSheetOpen)} />
        </div>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.layout)}>
      <div {...stylex.props(styles.sidebar)}>
        {navContent}
      </div>
      <div {...stylex.props(styles.main)}>
        <Text type="display-3">Page Content</Text>
        <Text type="body">Resize the window below 768px to see the bottom sheet.</Text>
      </div>
    </div>
  );
}
