// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

import {useEffect, useState, type ComponentType} from 'react';
import {Center} from '@astryxdesign/core/Center';
import {Text} from '@astryxdesign/core/Text';
import {Spinner} from '@astryxdesign/core/Spinner';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {showcaseRegistry} from '../../generated/showcaseRegistry';
import {preventPreviewNavigation} from './previewNavigation';

interface ShowcasePreviewProps {
  name: string;
}

// Components that render a full-height sidebar (`height: 100%`) and anchor
// their content to the top. In the centered, fixed-ratio preview box they
// stretch to fill the box, which reads as "top-aligned with empty space
// below". These are previewed top-anchored at their intrinsic height instead.
const FULL_HEIGHT_COMPONENTS = new Set([
  'SideNav',
  'SideNavItem',
  'SideNavSection',
  'SideNavCollapseButton',
  'SideNavHeading',
]);

export function ShowcasePreview({name}: ShowcasePreviewProps) {
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState(false);
  const isSmall = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const loader = showcaseRegistry[name];
    if (!loader) {
      setError(true);
      return;
    }
    loader()
      .then(mod => setComponent(() => mod.default))
      .catch(() => setError(true));
  }, [name]);

  const isFullHeight = FULL_HEIGHT_COMPONENTS.has(name);
  const previewNavigationProps = isFullHeight
    ? {onClickCapture: preventPreviewNavigation}
    : {};

  const placeholderStyle = isSmall
    ? {minHeight: 160, width: '100%'}
    : {aspectRatio: '16 / 9', width: '100%'};

  if (error) {
    return (
      <Center style={placeholderStyle}>
        <Text type="supporting" color="secondary">
          Preview not available
        </Text>
      </Center>
    );
  }

  if (!Component) {
    return (
      <Center style={placeholderStyle}>
        <Spinner size="md" />
      </Center>
    );
  }

  if (isSmall) {
    return (
      <div
        style={{
          width: '100%',
          overflow: 'auto',
          minHeight: 160,
          display: 'flex',
          alignItems: isFullHeight ? 'flex-start' : 'center',
          justifyContent: 'center',
        }}
        {...previewNavigationProps}>
        <div style={{minWidth: 'fit-content'}}>
          <Component />
        </div>
      </div>
    );
  }

  // Full-height components (`height: 100%`) stretch to fill a fixed-ratio box
  // and read as top-aligned with empty space below. Let the box grow to the
  // sidebar's intrinsic height instead: with an auto container height,
  // `height: 100%` on the child resolves to `auto` (content-sized), and
  // top-anchoring keeps the sidebar reading as built.
  const containerSizing = isFullHeight
    ? {maxHeight: 480}
    : {aspectRatio: '16 / 9'};

  return (
    <div
      style={{
        width: '100%',
        ...containerSizing,
        overflow: 'auto',
        display: 'flex',
        alignItems: isFullHeight ? 'flex-start' : 'center',
        justifyContent: 'center',
      }}
      {...previewNavigationProps}>
      <Component />
    </div>
  );
}
