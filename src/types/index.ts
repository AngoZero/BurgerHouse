export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "clasicas" | "especiales" | "premium";
  badge?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface BusinessInfo {
  address: string;
  phone: string;
  email: string;
  hours: string[];
}

export interface SpecialItem {
  name: string;
  ingredients: string[];
  image: string;
}

export interface FullMenuItem {
  name: string;
  description: string;
  price: number;
}

export interface MenuCategory {
  name: string;
  items: FullMenuItem[];
}
