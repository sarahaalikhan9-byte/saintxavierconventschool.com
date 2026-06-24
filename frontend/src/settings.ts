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
  category?: string;
}

export interface CampusHubItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export const SOCIAL_LINKS_STORAGE_KEY = 'sxc_social_links';
export const CAMPUS_HUB_STORAGE_KEY = 'sxc_campus_hub_items';
export const SCHOOL_YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/channel/UCNKqREONoG_5xqG_qcOKqzQ';

export const DEFAULT_SOCIAL_LINKS: SocialLinkSetting[] = [
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com', color: '#1877F2', category: 'Social Networking' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com', color: '#E1306C', category: 'Photo & Video Sharing' },
  { id: 'whatsapp', label: 'WhatsApp', url: 'https://www.whatsapp.com', color: '#25D366', category: 'Messaging' },
  { id: 'youtube', label: 'YouTube', url: SCHOOL_YOUTUBE_CHANNEL_URL, color: '#FF0000', category: 'Video Sharing' },
  { id: 'x', label: 'X (Twitter)', url: 'https://x.com', color: '#111827', category: 'Microblogging' },
  { id: 'snapchat', label: 'Snapchat', url: 'https://www.snapchat.com', color: '#FFFC00', category: 'Photo Messaging' },
  { id: 'telegram', label: 'Telegram', url: 'https://telegram.org', color: '#0088CC', category: 'Messaging & Channels' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com', color: '#0A66C2', category: 'Professional Network' },
  { id: 'pinterest', label: 'Pinterest', url: 'https://www.pinterest.com', color: '#E60023', category: 'Image Sharing' },
  { id: 'reddit', label: 'Reddit', url: 'https://www.reddit.com', color: '#FF4500', category: 'Community Discussions' },
  { id: 'discord', label: 'Discord', url: 'https://discord.com', color: '#5865F2', category: 'Communities & Chat' },
  { id: 'threads', label: 'Threads', url: 'https://www.threads.net', color: '#111827', category: 'Text-Based Social App' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com', color: '#111827', category: 'Short Video Platform' },
  { id: 'koo', label: 'Koo', url: 'https://www.kooapp.com', color: '#F5C542', category: 'Indian Microblogging' },
  { id: 'sharechat', label: 'ShareChat', url: 'https://sharechat.com', color: '#F97316', category: 'Indian Social Network' },
  { id: 'moj', label: 'Moj', url: 'https://mojapp.in', color: '#F43F5E', category: 'Short Video App' },
  { id: 'josh', label: 'Josh', url: 'https://www.joshapp.com', color: '#7C3AED', category: 'Short Video Platform' },
  { id: 'chingari', label: 'Chingari', url: 'https://www.chingari.io', color: '#EF4444', category: 'Indian Video Sharing' },
  { id: 'tumblr', label: 'Tumblr', url: 'https://www.tumblr.com', color: '#36465D', category: 'Blogging & Social Network' },
  { id: 'quora', label: 'Quora', url: 'https://www.quora.com', color: '#B92B27', category: 'Questions & Answers' }
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
    case 'linkedin':
    case 'reddit':
    case 'discord':
    case 'threads':
    case 'koo':
    case 'sharechat':
    case 'quora':
      return Share2;
    case 'snapchat':
    case 'pinterest':
    case 'tiktok':
    case 'moj':
    case 'josh':
    case 'chingari':
    case 'tumblr':
      return Video;
    default:
      return Video;
  }
}
