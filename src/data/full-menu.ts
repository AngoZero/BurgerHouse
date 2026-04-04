import type { MenuCategory } from "../types";

export const fullMenu: MenuCategory[] = [
  {
    name: "Hamburguesas Clásicas",
    items: [
      {
        name: "La Clásica",
        description:
          "Carne angus 200g, lechuga, tomate, cebolla y nuestra salsa secreta.",
        price: 129,
      },
      {
        name: "Doble Queso",
        description:
          "Doble carne angus, doble cheddar fundido, pepinillos y salsa especial.",
        price: 159,
      },
      {
        name: "Crispy Chicken",
        description:
          "Pechuga de pollo crocante, coleslaw casero, pepinillos y mayo de ajo.",
        price: 139,
      },
    ],
  },
  {
    name: "Hamburguesas Especiales",
    items: [
      {
        name: "BBQ Bacon",
        description:
          "Carne angus, bacon crocante, aros de cebolla, queso gouda y salsa BBQ ahumada.",
        price: 189,
      },
      {
        name: "Mushroom Swiss",
        description:
          "Carne angus, champiñones salteados, queso suizo derretido y aioli de trufa.",
        price: 199,
      },
      {
        name: "Smoky Diablo",
        description:
          "Carne angus, jalapeños frescos, pepper jack, chipotle mayo y pico de gallo.",
        price: 199,
      },
    ],
  },
  {
    name: "Hamburguesas Premium",
    items: [
      {
        name: "Wagyu Deluxe",
        description:
          "Carne wagyu premium 250g, foie gras, rúcula, tomate confitado y brioche artesanal.",
        price: 349,
      },
      {
        name: "Truffle Burger",
        description:
          "Carne angus, crema de trufa negra, queso brie, cebolla crispy y pan de masa madre.",
        price: 299,
      },
      {
        name: "Royal Blue Cheese",
        description:
          "Carne angus 250g, queso azul importado, pera caramelizada, nueces y miel.",
        price: 279,
      },
    ],
  },
  {
    name: "Acompañamientos",
    items: [
      {
        name: "Papas Fritas Clásicas",
        description: "Papas fritas crujientes con sal de mar.",
        price: 59,
      },
      {
        name: "Aros de Cebolla",
        description: "Aros de cebolla rebozados con salsa ranch casera.",
        price: 69,
      },
      {
        name: "Nuggets Artesanales",
        description:
          "6 nuggets de pollo empanizados a mano con dip de mostaza y miel.",
        price: 79,
      },
      {
        name: "Ensalada Fresca",
        description: "Mix de hojas verdes, tomate cherry, aguacate y vinagreta.",
        price: 69,
      },
    ],
  },
  {
    name: "Bebidas",
    items: [
      {
        name: "Limonada Casera",
        description: "Limón natural, menta fresca y un toque de jengibre.",
        price: 45,
      },
      {
        name: "Milkshake Clásico",
        description: "Vainilla, chocolate o fresa con helado artesanal.",
        price: 69,
      },
      {
        name: "Cerveza Artesanal",
        description: "Selección de cervezas locales. Consulta disponibilidad.",
        price: 65,
      },
    ],
  },
];
