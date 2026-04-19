import type { ComponentPropsWithoutRef, ComponentType } from 'react';
import { createElement, useEffect, useState } from 'react';

import {
  ArrowRightIcon as ArrowRightIconBase,
  BellIcon as BellIconBase,
  CheckIcon as CheckIconBase,
  ChevronDownIcon as ChevronDownIconBase,
  ChevronRightIcon as ChevronRightIconBase,
  ChevronUpIcon as ChevronUpIconBase,
  DownloadIcon as DownloadIconBase,
  EyeIcon as EyeIconBase,
  EyeOffIcon as EyeOffIconBase,
  GalleryVerticalEndIcon as GalleryVerticalEndIconBase,
  LayoutPanelTopIcon as LayoutPanelTopIconBase,
  LockIcon as LockIconBase,
  MailCheckIcon as MailCheckIconBase,
  MenuIcon as MenuIconBase,
  MicIcon as MicIconBase,
  MessageCircleMoreIcon as MessageCircleMoreIconBase,
  PanelLeftCloseIcon as PanelLeftCloseIconBase,
  SparklesIcon as SparklesIconBase,
  UploadIcon as UploadIconBase,
  UsersIcon as UsersIconBase,
  XIcon as XIconBase,
} from 'lucide-animated';

type AnimatedIconProps = ComponentPropsWithoutRef<typeof BellIconBase>;

export type AnimatedIcon = ComponentType<AnimatedIconProps>;

function resolveIconSize(className?: string, size?: number) {
  if (typeof size === 'number') {
    return size;
  }

  const sizeMatch = className?.match(/(?:^|\s)size-(\d+(?:\.\d+)?)/);
  if (sizeMatch?.[1]) {
    return Number(sizeMatch[1]) * 4;
  }

  const heightMatch = className?.match(/(?:^|\s)h-(\d+(?:\.\d+)?)/);
  if (heightMatch?.[1]) {
    return Number(heightMatch[1]) * 4;
  }

  const widthMatch = className?.match(/(?:^|\s)w-(\d+(?:\.\d+)?)/);
  if (widthMatch?.[1]) {
    return Number(widthMatch[1]) * 4;
  }

  return 16;
}

function createAnimatedIcon(IconComponent: ComponentType<AnimatedIconProps>) {
  function AnimatedIconWrapper({
    className,
    onMouseEnter,
    onMouseLeave,
    size,
    ...props
  }: AnimatedIconProps) {
    const [wrapperElement, setWrapperElement] =
      useState<HTMLSpanElement | null>(null);
    const resolvedSize = resolveIconSize(className, size);

    useEffect(() => {
      const iconElement =
        wrapperElement?.firstElementChild as HTMLElement | null;

      if (!wrapperElement || !iconElement) {
        return undefined;
      }

      const parentElement = wrapperElement.parentElement;
      const hoverTarget =
        parentElement?.closest(
          'button, a, [role="button"], [class~="group"]',
        ) ?? parentElement;

      if (!hoverTarget) {
        return undefined;
      }

      const handleParentEnter = () => {
        iconElement.dispatchEvent(
          new MouseEvent('mouseover', { bubbles: true, cancelable: true }),
        );
      };

      const handleParentLeave = () => {
        iconElement.dispatchEvent(
          new MouseEvent('mouseout', { bubbles: true, cancelable: true }),
        );
      };

      hoverTarget.addEventListener('pointerenter', handleParentEnter);
      hoverTarget.addEventListener('pointerleave', handleParentLeave);

      return () => {
        hoverTarget.removeEventListener('pointerenter', handleParentEnter);
        hoverTarget.removeEventListener('pointerleave', handleParentLeave);
      };
    }, [wrapperElement]);

    return createElement(
      'span',
      {
        ref: setWrapperElement,
        style: { display: 'contents' },
      },
      createElement(IconComponent as never, {
        ...props,
        className,
        onMouseEnter,
        onMouseLeave,
        size: resolvedSize,
      }),
    );
  }

  AnimatedIconWrapper.displayName = IconComponent.displayName;

  return AnimatedIconWrapper;
}

export const Send = createAnimatedIcon(ArrowRightIconBase);
export const Bell = createAnimatedIcon(BellIconBase);
export const CheckIcon = createAnimatedIcon(CheckIconBase);
export const ChevronDownIcon = createAnimatedIcon(ChevronDownIconBase);
export const ChevronRight = createAnimatedIcon(ChevronRightIconBase);
export const ChevronUpIcon = createAnimatedIcon(ChevronUpIconBase);
export const Download = createAnimatedIcon(DownloadIconBase);
export const Eye = createAnimatedIcon(EyeIconBase);
export const EyeOff = createAnimatedIcon(EyeOffIconBase);
export const GalleryVerticalEnd = createAnimatedIcon(
  GalleryVerticalEndIconBase,
);
export const LayoutDashboard = createAnimatedIcon(LayoutPanelTopIconBase);
export const Lock = createAnimatedIcon(LockIconBase);
export const Mail = createAnimatedIcon(MailCheckIconBase);
export const Menu = createAnimatedIcon(MenuIconBase);
export const Mic = createAnimatedIcon(MicIconBase);
export const MoreHorizontal = createAnimatedIcon(MessageCircleMoreIconBase);
export const PanelLeft = createAnimatedIcon(PanelLeftCloseIconBase);
export const Sparkles = createAnimatedIcon(SparklesIconBase);
export const Upload = createAnimatedIcon(UploadIconBase);
export const Users = createAnimatedIcon(UsersIconBase);
export const XIcon = createAnimatedIcon(XIconBase);
