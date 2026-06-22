import type { LucideIcon } from 'lucide-react';
import {
  Facebook,
  Instagram,
  MessageCircle,
  Send,
  Share2,
  Video,
  Youtube
} from 'lucide-react';

export interface SocialLinkSetting {
  id: string;
  label: string;
  url: string;
  color: string;
}

export interface CampusHubItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const SOCIAL_LINKS_STORAGE_KEY = 'sxc_social_links';
export const CAMPUS_HUB_STORAGE_KEY = 'sxc_campus_hub_items';

export const DEFAULT_SOCIAL_LINKS: SocialLinkSetting[] = [
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/919074322024', color: '#25D366' },
  { id: 'youtube', label: 'YouTube', url: 'https://youtube.com/@saintxavierkhajrana', color: '#FF0000' },
  { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/saintxavierkhajrana', color: '#E1306C' },
  { id: 'facebook', label: 'Facebook', url: 'https://facebook.com/saintxavierkhajrana', color: '#1877F2' },
  { id: 'telegram', label: 'Telegram', url: 'https://telegram.org/#', color: '#0088CC' },
  { id: 'x', label: 'X', url: 'https://x.com/#', color: '#111827' }
];

export const DEFAULT_CAMPUS_HUB_ITEMS: CampusHubItem[] = [
  {
    id: 'campus-entry',
    title: 'Smart Campus Entrance',
    description: 'Welcoming, secure entry experience with supervised visitor movement and parent-friendly guidance.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=900'
  },
  {
    id: 'digital-classroom',
    title: 'Digital Classrooms',
    description: 'Interactive classrooms designed for focused learning, live lessons, and practical demonstrations.',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=900'
  },
  {
    id: 'activity-zone',
    title: 'Activity & Play Zone',
    description: 'Open areas for games, assemblies, yoga, and student activities that build confidence beyond books.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=900'
  }
];

export function loadSettings<T>(key: string, defaults: T): T {
  const saved = localStorage.getItem(key);
  if (!saved) return defaults;
  try {
    const parsed = JSON.parse(saved);
    return parsed || defaults;
  } catch (e) {
    return defaults;
  }
}

export function saveSettings<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event('sxc_public_settings_changed'));
}

export function getSocialIcon(id: string): LucideIcon {
  switch (id) {
    case 'facebook':
      return Facebook;
    case 'instagram':
      return Instagram;
    case 'youtube':
      return Youtube;
    case 'whatsapp':
      return MessageCircle;
    case 'telegram':
      return Send;
    case 'x':
      return Share2;
    default:
      return Video;
  }
}
