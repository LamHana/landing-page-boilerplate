export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
}
