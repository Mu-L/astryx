import{ag as r,a0 as e,B as c,I as j,aK as C}from"./iframe-CLCIJs_f.js";import{M as s}from"./navItemStyles.stylex-DPKR_1Ck.js";import{a as n,S as M}from"./SideNavItem-CUPn_bvn.js";import{b as i,F as O,a as g,S as y}from"./FolderIcon-Di7u4bcg.js";import{N as F}from"./NavIcon-S9k9UH1X.js";import{F as v}from"./HomeIcon-C05L8q6d.js";import{F as l}from"./HomeIcon-Djj0OC-P.js";import{F as d}from"./FolderIcon-xEKNC9S9.js";import{F as N}from"./ChartBarIcon-31gBXkgg.js";import{F as f}from"./Cog6ToothIcon-C6OmnUkD.js";import{F as w}from"./CubeIcon-DCRuUVCX.js";import"./preload-helper-Ct5FWWRu.js";import"./Heading-FSLtzY38.js";import"./AppShellMobileContext-Bj_ejInS.js";import"./SideNavRenderContext-C_1VMUpE.js";import"./ResizeHandle-Bm0_jm6H.js";import"./usePopover-DTSMc4W5.js";import"./useFocusTrap-XoOuL5Wb.js";import"./Tooltip-82zXIYfq.js";import"./Link-DYvyqDfT.js";import"./computeTargetAndRel-BlG0ENK0.js";import"./useInteractiveRole-RG90hLuS.js";import"./useListFocus-Ci1p15J7.js";const Z={title:"Core/MobileNav",component:s,tags:["autodocs"],parameters:{layout:"centered"}},h={render:()=>{const[a,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Open Navigation",icon:e.jsx(j,{icon:"menu",color:"inherit"}),variant:"ghost",onClick:()=>t(!0),isIconOnly:!0}),e.jsxs(s,{isOpen:a,onOpenChange:o=>t(o),header:"Navigation",children:[e.jsxs(i,{title:"Main",children:[e.jsx(n,{label:"Dashboard",icon:l,selectedIcon:v,isSelected:!0,href:"/dashboard"}),e.jsx(n,{label:"Projects",icon:d,selectedIcon:O,href:"/projects"}),e.jsx(n,{label:"Analytics",icon:N,href:"/analytics"})]}),e.jsxs(i,{title:"Settings",children:[e.jsx(n,{label:"General",icon:f,href:"/settings"}),e.jsx(n,{label:"Team",icon:g,href:"/team"})]})]})]})}},m={name:"With SideNav Children",render:()=>{const[a,t]=r.useState(!1),o=e.jsxs(e.Fragment,{children:[e.jsxs(i,{title:"Main",children:[e.jsx(n,{label:"Dashboard",icon:l,selectedIcon:v,isSelected:!0,href:"/dashboard"}),e.jsx(n,{label:"Projects",icon:d,selectedIcon:O,href:"/projects"}),e.jsx(n,{label:"Analytics",icon:N,href:"/analytics"})]}),e.jsx(i,{title:"Settings",children:e.jsx(n,{label:"General",icon:f,href:"/settings"})})]});return e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Open Drawer",onClick:()=>t(!0)}),e.jsx(s,{isOpen:a,onOpenChange:p=>t(p),header:"My App",children:o})]})}},S={name:"Responsive Pattern",render:()=>{const a=C("(max-width: 768px)"),[t,o]=r.useState(!1),p=e.jsxs(e.Fragment,{children:[e.jsxs(i,{title:"Main",children:[e.jsx(n,{label:"Dashboard",icon:l,selectedIcon:v,isSelected:!0,href:"/"}),e.jsx(n,{label:"Projects",icon:d,selectedIcon:O,href:"/projects"}),e.jsx(n,{label:"Analytics",icon:N,href:"/analytics"})]}),e.jsxs(i,{title:"Settings",children:[e.jsx(n,{label:"General",icon:f,href:"/settings"}),e.jsx(n,{label:"Team",icon:g,href:"/team"})]})]});return a?e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Menu",icon:e.jsx(j,{icon:"menu",color:"inherit"}),variant:"ghost",onClick:()=>o(!0),isIconOnly:!0}),e.jsx(s,{isOpen:t,onOpenChange:x=>o(x),header:"My App",children:p})]}):e.jsx("div",{style:{width:280,height:600,border:"1px solid #e5e7eb"},children:e.jsx(M,{header:e.jsx(y,{icon:e.jsx(F,{icon:e.jsx(w,{style:{width:16,height:16}})}),heading:"My App",headingHref:"/"}),children:p})})}},u={name:"End Side",render:()=>{const[a,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Open from Right",onClick:()=>t(!0)}),e.jsx(s,{isOpen:a,onOpenChange:o=>t(o),header:"Settings",side:"end",children:e.jsxs(i,{title:"Settings",children:[e.jsx(n,{label:"General",icon:f,href:"/settings"}),e.jsx(n,{label:"Team",icon:g,href:"/team"})]})})]})}},I={name:"Custom Width",render:()=>{const[a,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Open Wide Drawer",onClick:()=>t(!0)}),e.jsx(s,{isOpen:a,onOpenChange:o=>t(o),header:"Wide Navigation",width:360,children:e.jsxs(i,{title:"Main",children:[e.jsx(n,{label:"Dashboard",icon:l,selectedIcon:v,isSelected:!0,href:"/dashboard"}),e.jsx(n,{label:"Projects",icon:d,href:"/projects"})]})})]})}},b={name:"Without Title",render:()=>{const[a,t]=r.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Open Navigation",icon:e.jsx(j,{icon:"menu",color:"inherit"}),variant:"ghost",onClick:()=>t(!0),isIconOnly:!0}),e.jsx(s,{isOpen:a,onOpenChange:o=>t(o),children:e.jsxs(i,{title:"Main",children:[e.jsx(n,{label:"Dashboard",icon:l,isSelected:!0,href:"/dashboard"}),e.jsx(n,{label:"Projects",icon:d,href:"/projects"})]})})]})}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button label="Open Navigation" icon={<Icon icon="menu" color="inherit" />} variant="ghost" onClick={() => setIsOpen(true)} isIconOnly />
        <MobileNav isOpen={isOpen} onOpenChange={open => setIsOpen(open)} header="Navigation">
          <SideNavSection title="Main">
            <SideNavItem label="Dashboard" icon={HomeIcon} selectedIcon={HomeIconSolid} isSelected href="/dashboard" />
            <SideNavItem label="Projects" icon={FolderIcon} selectedIcon={FolderIconSolid} href="/projects" />
            <SideNavItem label="Analytics" icon={ChartBarIcon} href="/analytics" />
          </SideNavSection>
          <SideNavSection title="Settings">
            <SideNavItem label="General" icon={Cog6ToothIcon} href="/settings" />
            <SideNavItem label="Team" icon={UserGroupIcon} href="/team" />
          </SideNavSection>
        </MobileNav>
      </>;
  }
}`,...h.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'With SideNav Children',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const navSections = <>
        <SideNavSection title="Main">
          <SideNavItem label="Dashboard" icon={HomeIcon} selectedIcon={HomeIconSolid} isSelected href="/dashboard" />
          <SideNavItem label="Projects" icon={FolderIcon} selectedIcon={FolderIconSolid} href="/projects" />
          <SideNavItem label="Analytics" icon={ChartBarIcon} href="/analytics" />
        </SideNavSection>
        <SideNavSection title="Settings">
          <SideNavItem label="General" icon={Cog6ToothIcon} href="/settings" />
        </SideNavSection>
      </>;
    return <>
        <Button label="Open Drawer" onClick={() => setIsOpen(true)} />
        <MobileNav isOpen={isOpen} onOpenChange={open => setIsOpen(open)} header="My App">
          {navSections}
        </MobileNav>
      </>;
  }
}`,...m.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Responsive Pattern',
  render: () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navSections = <>
        <SideNavSection title="Main">
          <SideNavItem label="Dashboard" icon={HomeIcon} selectedIcon={HomeIconSolid} isSelected href="/" />
          <SideNavItem label="Projects" icon={FolderIcon} selectedIcon={FolderIconSolid} href="/projects" />
          <SideNavItem label="Analytics" icon={ChartBarIcon} href="/analytics" />
        </SideNavSection>
        <SideNavSection title="Settings">
          <SideNavItem label="General" icon={Cog6ToothIcon} href="/settings" />
          <SideNavItem label="Team" icon={UserGroupIcon} href="/team" />
        </SideNavSection>
      </>;
    if (isMobile) {
      return <>
          <Button label="Menu" icon={<Icon icon="menu" color="inherit" />} variant="ghost" onClick={() => setDrawerOpen(true)} isIconOnly />
          <MobileNav isOpen={drawerOpen} onOpenChange={open => setDrawerOpen(open)} header="My App">
            {navSections}
          </MobileNav>
        </>;
    }
    return <div style={{
      width: 280,
      height: 600,
      border: '1px solid #e5e7eb'
    }}>
        <SideNav header={<SideNavHeading icon={<NavIcon icon={<CubeIcon style={{
        width: 16,
        height: 16
      }} />} />} heading="My App" headingHref="/" />}>
          {navSections}
        </SideNav>
      </div>;
  }
}`,...S.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'End Side',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button label="Open from Right" onClick={() => setIsOpen(true)} />
        <MobileNav isOpen={isOpen} onOpenChange={open => setIsOpen(open)} header="Settings" side="end">
          <SideNavSection title="Settings">
            <SideNavItem label="General" icon={Cog6ToothIcon} href="/settings" />
            <SideNavItem label="Team" icon={UserGroupIcon} href="/team" />
          </SideNavSection>
        </MobileNav>
      </>;
  }
}`,...u.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: 'Custom Width',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button label="Open Wide Drawer" onClick={() => setIsOpen(true)} />
        <MobileNav isOpen={isOpen} onOpenChange={open => setIsOpen(open)} header="Wide Navigation" width={360}>
          <SideNavSection title="Main">
            <SideNavItem label="Dashboard" icon={HomeIcon} selectedIcon={HomeIconSolid} isSelected href="/dashboard" />
            <SideNavItem label="Projects" icon={FolderIcon} href="/projects" />
          </SideNavSection>
        </MobileNav>
      </>;
  }
}`,...I.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: 'Without Title',
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <Button label="Open Navigation" icon={<Icon icon="menu" color="inherit" />} variant="ghost" onClick={() => setIsOpen(true)} isIconOnly />
        <MobileNav isOpen={isOpen} onOpenChange={open => setIsOpen(open)}>
          <SideNavSection title="Main">
            <SideNavItem label="Dashboard" icon={HomeIcon} isSelected href="/dashboard" />
            <SideNavItem label="Projects" icon={FolderIcon} href="/projects" />
          </SideNavSection>
        </MobileNav>
      </>;
  }
}`,...b.parameters?.docs?.source}}};const ee=["Default","WithSideNavChildren","ResponsivePattern","EndSide","CustomWidth","WithoutTitle"];export{I as CustomWidth,h as Default,u as EndSide,S as ResponsivePattern,m as WithSideNavChildren,b as WithoutTitle,ee as __namedExportsOrder,Z as default};
