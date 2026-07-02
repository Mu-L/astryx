// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {TopNav} from '@astryxdesign/core/TopNav';
import {SideNav} from '@astryxdesign/core/SideNav';
import {SideNavItem} from '@astryxdesign/core/SideNav';
import {SideNavSection} from '@astryxdesign/core/SideNav';
import {SideNavHeading} from '@astryxdesign/core/SideNav';
import {Text} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Theme} from '@astryxdesign/core/theme';
import {defineTheme} from '@astryxdesign/core/theme';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: 16,
    padding: 24,
    height: '100%',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
});

const adminTheme = defineTheme({
  name: 'admin',
  tokens: {
    '--color-accent': '#4f46e5',
  },
});

export default function AdminPanel() {
  return (
    <Theme theme={adminTheme} mode="light">
      <AppShell
        topNav={<TopNav title="Admin Panel" />}
        sideNav={
          <SideNav
            collapsible
            header={<SideNavHeading>Admin</SideNavHeading>}
          >
            <SideNavSection title="Overview">
              <SideNavItem label="Dashboard" isSelected />
              <SideNavItem label="Analytics" />
            </SideNavSection>
            <SideNavSection title="Management">
              <SideNavItem label="Users" />
              <SideNavItem label="Roles" />
              <SideNavItem label="Settings" />
            </SideNavSection>
          </SideNav>
        }
      >
        <div {...stylex.props(styles.content)}>
          <div {...stylex.props(styles.main)}>
            <Text type="display-3">Dashboard</Text>
            <Card padding={4}>
              <Text type="body">Main content area with metrics, charts, and data tables.</Text>
            </Card>
          </div>
          <div {...stylex.props(styles.details)}>
            <Text type="display-3">Details</Text>
            <Card padding={3}>
              <Text type="body">Right panel for context, detail views, or quick actions.</Text>
            </Card>
          </div>
        </div>
      </AppShell>
    </Theme>
  );
}
