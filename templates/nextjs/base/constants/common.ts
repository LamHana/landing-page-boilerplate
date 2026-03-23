export const SITE_NAME = "__PROJECT_NAME__";
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  // __NAV_LINK_ABOUT__
  // __NAV_LINK_BLOG__
  // __NAV_LINK_CONTACT__
] as const;

export const SOCIAL_LINKS = {
  twitter: "#",
  github: "#",
  linkedin: "#",
} as const;
