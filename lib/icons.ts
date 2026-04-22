import type { ComponentPropsWithoutRef, ComponentType } from 'react';

export {
  ArrowRightIcon as Send,
  BellIcon as Bell,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon as ChevronRight,
  ChevronUpIcon,
  DownloadIcon as Download,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  GalleryVerticalEndIcon as GalleryVerticalEnd,
  LayoutPanelTopIcon as LayoutDashboard,
  LockIcon as Lock,
  MailCheckIcon as Mail,
  MenuIcon as Menu,
  MessageCircleMoreIcon as MoreHorizontal,
  MicIcon as Mic,
  Share2 as FacebookIcon,
  PanelLeftCloseIcon as PanelLeft,
  SparklesIcon as Sparkles,
  Bird as TwitterIcon,
  Camera as InstagramIcon,
  UploadIcon as Upload,
  UsersIcon as Users,
  XIcon,
} from 'lucide-react';

type LucideIconProps = ComponentPropsWithoutRef<'svg'>;

export type AnimatedIcon = ComponentType<LucideIconProps>;
