import type { NavLink, SocialLink, BusinessInfo } from "../types";

export const navLinks: NavLink[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Menu", href: "#menu" },
  { label: "Destacados", href: "#destacados" },
  { label: "Carta", href: "#carta" },
  { label: "Reservas", href: "#reservas" },
  { label: "Contacto", href: "#contacto" },
];

export const socialLinks: SocialLink[] = [
  { name: "Instagram", href: "#", icon: "Instagram" },
  { name: "Facebook", href: "#", icon: "Facebook" },
  { name: "X", href: "#", icon: "X" },
  { name: "TikTok", href: "#", icon: "TikTok" },
];

export const businessInfo: BusinessInfo = {
  address: "Blvd. Hidalgo 1234, Cd. Victoria, Tamaulipas, México",
  phone: "+52 834 123 4567",
  email: "hola@burgerhouse.mx",
  hours: [
    "Lun - Jue: 12:00 - 22:00",
    "Vie - Sab: 12:00 - 00:00",
    "Domingo: 12:00 - 21:00",
  ],
};
