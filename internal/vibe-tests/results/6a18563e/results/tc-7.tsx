import {Theme} from '@astryxdesign/core/theme';
import {AppShell} from '@astryxdesign/core/AppShell';
import {SideNav} from '@astryxdesign/core/SideNav';
import {SideNavItem} from '@astryxdesign/core/SideNav';
import {SideNavSection} from '@astryxdesign/core/SideNav';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {Card} from '@astryxdesign/core/Card';
import {defineTheme} from '@astryxdesign/core/theme';

const darkSidebarTheme = defineTheme({
  tokens: {
    '--color-background-surface': '#1a1a2e',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#a0a0b0',
  },
});

export default function NestedThemeLayout() {
  return (
    <AppShell
      sideNav={
        <Theme theme={darkSidebarTheme} mode="dark">
          <SideNav>
            <SideNavSection label="Navigation">
              <SideNavItem label="Dashboard" isSelected />
              <SideNavItem label="Analytics" />
              <SideNavItem label="Reports" />
            </SideNavSection>
          </SideNav>
        </Theme>
      }
      contentPadding={4}
    >
      <Stack gap={4}>
        <Text variant="heading">Light Content Area</Text>
        <Card>
          <Text>This content uses the default light theme while the sidebar has a dark theme applied via nested Theme provider.</Text>
        </Card>
      </Stack>
    </AppShell>
  );
}