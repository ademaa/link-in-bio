"use client"

import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Github,
  Globe,
  Mail,
  Phone,
  MapPin,
  Music,
  Camera,
  Gamepad2,
  ShoppingBag,
  BookOpen,
  Briefcase,
  Heart,
  Star,
  Zap,
  ExternalLink,
} from "lucide-react"

interface LinkIconProps {
  icon?: string
  className?: string
  fallback?: boolean
}

const ICON_MAP = {
  // Social Media
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  website: Globe,
  email: Mail,
  phone: Phone,
  location: MapPin,

  // Custom Icons
  music: Music,
  camera: Camera,
  gaming: Gamepad2,
  shopping: ShoppingBag,
  blog: BookOpen,
  business: Briefcase,
  favorite: Heart,
  featured: Star,
  trending: Zap,
}

export function LinkIcon({ icon, className = "w-4 h-4", fallback = true }: LinkIconProps) {
  if (!icon) {
    return fallback ? <ExternalLink className={className} /> : null
  }

  const IconComponent = ICON_MAP[icon as keyof typeof ICON_MAP]

  if (!IconComponent) {
    return fallback ? <ExternalLink className={className} /> : null
  }

  return <IconComponent className={className} />
}

export function getIconColor(icon?: string): string {
  const colorMap: Record<string, string> = {
    twitter: "#1DA1F2",
    instagram: "#E4405F",
    facebook: "#1877F2",
    linkedin: "#0A66C2",
    youtube: "#FF0000",
    github: "#333333",
    website: "#6366F1",
    email: "#059669",
    phone: "#DC2626",
    location: "#EA580C",
  }

  return colorMap[icon || ""] || "#6B7280"
}
