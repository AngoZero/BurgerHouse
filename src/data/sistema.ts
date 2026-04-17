export interface SystemFeature {
  icon: string;
  title: string;
  description: string;
  mockup: string;
}

export interface SystemModule {
  icon: string;
  name: string;
  description: string;
  mockup: string;
}

export interface SystemRole {
  name: string;
  badge: string;
  badgeColor: string;
  permissions: string[];
}

export const features: SystemFeature[] = [
  {
    icon: "Monitor",
    title: "Punto de venta ágil",
    description:
      "Diseñado para cobrar en menos de 3 segundos. Busca productos por nombre o código sin complicaciones.",
    mockup: "pos-grid",
  },
  {
    icon: "BarChart3",
    title: "Métricas al instante",
    description:
      "Ve tus ventas del día, ticket promedio, productos más vendidos y alertas de stock sin esperar reportes.",
    mockup: "dashboard-stats",
  },
  {
    icon: "MapPin",
    title: "Varias sucursales, un solo sistema",
    description:
      "Cada sucursal lleva su propio inventario, caja y ventas. Cambia entre ellas con un clic.",
    mockup: "multi-branch",
  },
  {
    icon: "Package",
    title: "Control de inventario",
    description:
      "Stock por sucursal con avisos cuando baja del mínimo. Registra entradas y salidas con historial claro.",
    mockup: "inventory-table",
  },
  {
    icon: "CreditCard",
    title: "Pagos como quiera tu cliente",
    description:
      "Acepta efectivo, tarjeta o transferencia. Puedes combinar métodos en una misma orden. Pruébalo en el demo: te pregunta cómo pagar al cobrar.",
    mockup: "payment-chips",
  },
  {
    icon: "TrendingUp",
    title: "Reportes claros",
    description:
      "Filtra por fecha, sucursal o cajero y descarga todo en Excel con un clic para analizarlo a tu ritmo.",
    mockup: "reports-csv",
  },
];

export const posCapabilities: string[] = [
  "Cobro en menos de 3 segundos",
  "Busca cualquier producto por nombre o código",
  "Categorías con pestañas para filtrar rápido",
  "El carrito se guarda aunque te distraigas",
  "Paga con efectivo, tarjeta o transferencia",
  "Ticket con número único y desglose de impuestos",
  "Marca si es para llevar, comer aquí o domicilio",
  "Cada cajero opera solo en su sucursal, sin confusiones",
];

export const modules: SystemModule[] = [
  {
    icon: "Receipt",
    name: "Ventas",
    description:
      "Historial completo de cada venta con su ticket, cajero y método de pago. Filtra por fecha o sucursal cuando lo necesites.",
    mockup: "sales-table",
  },
  {
    icon: "Package",
    name: "Inventario",
    description:
      "Consulta el stock de cada sucursal, recibe avisos cuando baja y registra movimientos o traspasos entre tiendas.",
    mockup: "inventory-bars",
  },
  {
    icon: "CreditCard",
    name: "Caja",
    description:
      "Abre y cierra tu caja del día con control. El sistema compara lo esperado con lo contado y muestra la diferencia.",
    mockup: "cash-card",
  },
  {
    icon: "Layers",
    name: "Productos y Categorías",
    description:
      "Gestiona tu menú con precio, costo, foto y categoría. Actualiza un producto una vez y se refleja en todas las sucursales.",
    mockup: "products-tags",
  },
  {
    icon: "Users",
    name: "Usuarios",
    description:
      "Agrega a tu equipo, asígnales un rol y las sucursales donde pueden trabajar. Puedes darlos de alta o baja cuando quieras.",
    mockup: "users-list",
  },
  {
    icon: "GitBranch",
    name: "Sucursales",
    description:
      "Da de alta todas las ubicaciones que tengas. Cada una lleva su propio inventario, caja y ventas por separado.",
    mockup: "branches-list",
  },
  {
    icon: "Building2",
    name: "Empresa",
    description:
      "Tus datos fiscales, logo, moneda y zona horaria en un solo lugar. Edítalos cuando lo necesites.",
    mockup: "company-form",
  },
  {
    icon: "BarChart3",
    name: "Reportes",
    description:
      "Ventas por periodo, productos más vendidos y estado del inventario. Descarga todo en Excel con un clic.",
    mockup: "reports-pie",
  },
];

export const roles: SystemRole[] = [
  {
    name: "Administrador",
    badge: "Acceso total",
    badgeColor: "bg-primary text-white",
    permissions: [
      "Ve todas las sucursales",
      "Agrega y gestiona a su equipo",
      "Configura los datos de la empresa",
      "Reportes completos del negocio",
    ],
  },
  {
    name: "Supervisor",
    badge: "Intermedio",
    badgeColor: "bg-blue-500 text-white",
    permissions: [
      "Puede cancelar ventas",
      "Consulta reportes y métricas",
      "Gestiona el inventario",
      "Solo ve su sucursal",
    ],
  },
  {
    name: "Cajero",
    badge: "Operación",
    badgeColor: "bg-emerald-500 text-white",
    permissions: [
      "Cobra en el punto de venta",
      "Abre y cierra su caja",
      "Ve productos y ventas del día",
      "Solo ve su sucursal",
    ],
  },
];
