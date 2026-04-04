import type { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  {
    id: "clasica",
    name: "Hamburguesa Clásica",
    description:
      "Carne angus 200g, lechuga, tomate, cebolla caramelizada y nuestra salsa secreta.",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    category: "clasicas",
  },
  {
    id: "doble-queso",
    name: "Doble Queso",
    description:
      "Doble carne angus, doble cheddar fundido, pepinillos y salsa especial.",
    price: 159,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop",
    category: "clasicas",
    badge: "Popular",
  },
  {
    id: "bbq-bacon",
    name: "BBQ Bacon",
    description:
      "Carne angus, bacon crocante, aros de cebolla, queso gouda y salsa BBQ ahumada.",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop",
    category: "especiales",
  },
  {
    id: "mushroom-swiss",
    name: "Mushroom Swiss",
    description:
      "Carne angus, champiñones salteados, queso suizo derretido y aioli de trufa.",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
    category: "especiales",
  },
  {
    id: "wagyu-deluxe",
    name: "Wagyu Deluxe",
    description:
      "Carne wagyu premium 250g, foie gras, rúcula, tomate confitado y brioche artesanal.",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
    category: "premium",
    badge: "Chef's Choice",
  },
  {
    id: "truffle-burger",
    name: "Truffle Burger",
    description:
      "Carne angus, crema de trufa negra, queso brie, cebolla crispy y pan de masa madre.",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
    category: "premium",
  },
];
