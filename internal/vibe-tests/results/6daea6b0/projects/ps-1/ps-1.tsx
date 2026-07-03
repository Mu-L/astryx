import {AppShell} from '@astryxdesign/core/AppShell';
import {TopNav} from '@astryxdesign/core/TopNav';
import {TopNavHeading} from '@astryxdesign/core/TopNav';
import {SideNav} from '@astryxdesign/core/SideNav';
import {SideNavItem} from '@astryxdesign/core/SideNav';
import {SideNavSection} from '@astryxdesign/core/SideNav';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {Card} from '@astryxdesign/core/Card';
import {Theme} from '@astryxdesign/core/theme';

export default function SettingsDashboard() {
  return (
    <AppShell
      topNav={
        <TopNav>
          <TopNavHeading>My App</TopNavHeading>
        </TopNav>
      }
      sideNav={
        <SideNav>
          <SideNavSection label="Settings">
            <SideNavItem label="General" isSelected />
            <SideNavItem label="Account" />
            <SideNavItem label="Notifications" />
            <SideNavItem label="Security" />
            <SideNavItem label="Integrations" />
          </SideNavSection>
        </SideNav>
      }
      contentPadding={4}
    >
      <Stack gap={4}>
        <Text variant="heading">General Settings</Text>
        <Card>
          <Stack gap={2}>
            <Text weight="bold">Application Name</Text>
            <Text color="secondary">Configure your application preferences.</Text>
          </Stack>
        </Card>
        <Card>
          <Stack gap={2}>
            <Text weight="bold">Language</Text>
            <Text color="secondary">Choose your preferred language for the interface.</Text>
          </Stack>
        </Card>
      </Stack>
    </AppShell>
  );
}