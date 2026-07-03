import {SideNav} from '@astryxdesign/core/SideNav';
import {SideNavItem} from '@astryxdesign/core/SideNav';
import {SideNavSection} from '@astryxdesign/core/SideNav';
import {MobileNav} from '@astryxdesign/core/MobileNav';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Text} from '@astryxdesign/core/Text';

export default function ResponsiveNav() {
  return (
    <AppShell
      sideNav={
        <SideNav>
          <SideNavSection label="Main">
            <SideNavItem label="Home" isSelected />
            <SideNavItem label="Dashboard" />
            <SideNavItem label="Projects" />
          </SideNavSection>
          <SideNavSection label="Settings">
            <SideNavItem label="Account" />
            <SideNavItem label="Preferences" />
          </SideNavSection>
        </SideNav>
      }
      mobileNav={
        <MobileNav>
          <SideNavItem label="Home" isSelected />
          <SideNavItem label="Dashboard" />
          <SideNavItem label="Projects" />
          <SideNavItem label="Account" />
          <SideNavItem label="Preferences" />
        </MobileNav>
      }
    >
      <Text>Main content area. The sidebar becomes a bottom sheet on mobile.</Text>
    </AppShell>
  );
}