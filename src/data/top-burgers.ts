export interface TopBurger {
  name: string;
  tagline: string;
  description: string;
  image: string;
  price: number;
  features: { icon: string; title: string; text: string }[];
}

export const topBurgers: TopBurger[] = [
  {
    name: "La Bestia",
    tagline: "Nuestra creación más imponente",
    description:
      "Doble carne angus de 200g, queso cheddar ahumado, bacon crocante, aros de cebolla y nuestra legendaria salsa bestia. Servida en pan brioche tostado con semillas.",
    image: "/images/burger-bestia.png",
    price: 249,
    features: [],
  },
  {
    name: "Smoky BBQ",
    tagline: "Ahumada a la perfección",
    description:
      "Carne angus ahumada en madera de nogal, queso gouda fundido, pulled pork, coleslaw casero y salsa BBQ artesanal. Un festival de sabores en cada bocado.",
    image: "/images/burger-smoky.png",
    price: 269,
    features: [
      {
        icon: "Home",
        title: "Hecha en Casa",
        text: "Cada salsa y aderezo es preparado artesanalmente en nuestra cocina con recetas propias.",
      },
      {
        icon: "Heart",
        title: "Ingredientes Premium",
        text: "Seleccionamos carne angus certificada y vegetales orgánicos de productores locales.",
      },
      {
        icon: "Award",
        title: "Receta Ganadora",
        text: "Nuestra hamburguesa mas premiada, reconocida en competencias gastronómicas nacionales.",
      },
      {
        icon: "Zap",
        title: "Cocción Express",
        text: "Lista en minutos sin perder calidad, gracias a nuestra técnica de parrilla a carbon natural.",
      },
    ],
  },
  {
    name: "Royal Cheese",
    tagline: "Para los amantes del queso",
    description:
      "Triple queso fundido: cheddar, gouda y mozzarella sobre carne angus jugosa, con tomate confitado, rúcula fresca y mayo trufada en pan de masa madre.",
    image: "/images/burger-royal.png",
    price: 289,
    features: [],
  },
];
