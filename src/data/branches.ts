import type { BranchLocation } from "../types";

export const branches: BranchLocation[] = [
  {
    id: "centro",
    name: "Sucursal Centro",
    address: "Blvd. Hidalgo 1234, Col. Centro, Cd. Victoria",
    phone: "+52 834 123 4567",
    hours: ["Lun - Jue: 12:00 - 22:00", "Vie - Sáb: 12:00 - 00:00", "Domingo: 12:00 - 21:00"],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.6!2d-70.65!3d-33.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI2JzI0LjAiUyA3MMKwMzknMDAuMCJX!5e0!3m2!1ses!2scl!4v1",
  },
  {
    id: "norte",
    name: "Sucursal Norte",
    address: "Av. Tecnológico 567, Col. Sierra Vista, Cd. Victoria",
    phone: "+52 834 234 5678",
    hours: ["Lun - Jue: 12:00 - 22:00", "Vie - Sáb: 12:00 - 00:00", "Domingo: 12:00 - 21:00"],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.2!2d-70.64!3d-33.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI1JzEyLjAiUyA3MMKwMzgnMjQuMCJX!5e0!3m2!1ses!2scl!4v1",
  },
  {
    id: "plaza",
    name: "Sucursal Plaza",
    address: "Plaza Sendero, Local 42, Blvd. Tamaulipas, Cd. Victoria",
    phone: "+52 834 345 6789",
    hours: ["Lun - Dom: 11:00 - 22:00"],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.8!2d-70.66!3d-33.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI3JzAwLjAiUyA3MMKwMzknMzYuMCJX!5e0!3m2!1ses!2scl!4v1",
  },
];
