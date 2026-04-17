// Interactive demo: mini POS + mini Dashboard with localStorage persistence per device.

interface DemoProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  color?: string;
  emoji?: string;
  initialStock: number;
  minStock: number;
}

interface CartItem {
  productId: string;
  qty: number;
}

type PaymentMethod = "cash" | "card" | "transfer";

interface Sale {
  id: string;
  ts: number;
  subtotal: number;
  tax: number;
  total: number;
  items: { productId: string; name: string; qty: number; price: number }[];
  paymentMethod: PaymentMethod;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
};

interface DemoState {
  cart: CartItem[];
  sales: Sale[];
  inventory: Record<string, number>;
}

const PRODUCTS: DemoProduct[] = [
  { id: "bestia", name: "La Bestia", price: 189, image: "/images/burger-bestia.png", initialStock: 24, minStock: 10 },
  { id: "smoky", name: "Smoky BBQ", price: 169, image: "/images/burger-smoky.png", initialStock: 8, minStock: 10 },
  { id: "royal", name: "Royal Cheese", price: 159, image: "/images/burger-royal.png", initialStock: 15, minStock: 10 },
  {
    id: "fries",
    name: "Papas Loaded",
    price: 79,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop",
    initialStock: 32,
    minStock: 15,
  },
  {
    id: "soda",
    name: "Coca-Cola 600ml",
    price: 35,
    image: "/images/coca-cola.jpg",
    initialStock: 48,
    minStock: 20,
  },
  {
    id: "brownie",
    name: "Brownie Fudge",
    price: 69,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop",
    initialStock: 18,
    minStock: 8,
  },
];

function buildInitialInventory(): Record<string, number> {
  const inv: Record<string, number> = {};
  for (const p of PRODUCTS) inv[p.id] = p.initialStock;
  return inv;
}

const TAX_RATE = 0.16;
const DEVICE_KEY = "burgerhouse-demo:device-id";
const statePrefix = "burgerhouse-demo:state:";

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

function loadState(id: string): DemoState {
  const fallback = (): DemoState => ({ cart: [], sales: [], inventory: buildInitialInventory() });
  try {
    const raw = localStorage.getItem(statePrefix + id);
    if (!raw) return fallback();
    const parsed = JSON.parse(raw) as DemoState;
    const sales = Array.isArray(parsed.sales) ? parsed.sales : [];
    // Backfill paymentMethod for older sales persisted before this field existed.
    for (const s of sales) {
      if (!s.paymentMethod) s.paymentMethod = "cash";
    }
    // Hydrate inventory: fill any missing product keys from initialStock.
    const inventory: Record<string, number> =
      parsed.inventory && typeof parsed.inventory === "object" ? { ...parsed.inventory } : {};
    for (const p of PRODUCTS) {
      if (typeof inventory[p.id] !== "number") inventory[p.id] = p.initialStock;
    }
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      sales,
      inventory,
    };
  } catch {
    return fallback();
  }
}

function saveState(id: string, state: DemoState): void {
  localStorage.setItem(statePrefix + id, JSON.stringify(state));
}

function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

function findProduct(id: string): DemoProduct | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

function computeTotals(cart: CartItem[]): { subtotal: number; tax: number; total: number } {
  const subtotal = cart.reduce((sum, item) => {
    const prod = findProduct(item.productId);
    return sum + (prod ? prod.price * item.qty : 0);
  }, 0);
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), tax, total };
}

function init(): void {
  const root = document.getElementById("demo-widget");
  if (!root) return;

  const deviceId = getDeviceId();
  let state = loadState(deviceId);

  const deviceDisplay = root.querySelector("[data-device-id]");
  if (deviceDisplay) deviceDisplay.textContent = deviceId.slice(0, 8);

  type TabName = "pos" | "dashboard" | "inventory";
  let activeTab: TabName = "pos";

  function persist(): void {
    saveState(deviceId, state);
  }

  function cartQtyOf(productId: string): number {
    return state.cart.find((i) => i.productId === productId)?.qty ?? 0;
  }

  function availableStock(productId: string): number {
    return (state.inventory[productId] ?? 0) - cartQtyOf(productId);
  }

  function addToCart(productId: string): void {
    if (availableStock(productId) <= 0) {
      flashToast("Sin stock disponible");
      return;
    }
    const existing = state.cart.find((i) => i.productId === productId);
    if (existing) existing.qty += 1;
    else state.cart.push({ productId, qty: 1 });
    persist();
    render();
  }

  function updateQty(productId: string, delta: number): void {
    const item = state.cart.find((i) => i.productId === productId);
    if (!item) return;
    if (delta > 0 && availableStock(productId) <= 0) {
      flashToast("Sin stock disponible");
      return;
    }
    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter((i) => i.productId !== productId);
    }
    persist();
    render();
  }

  function adjustInventory(productId: string, delta: number): void {
    const current = state.inventory[productId] ?? 0;
    state.inventory[productId] = Math.max(0, current + delta);
    persist();
    render();
  }

  function resetInventory(): void {
    if (!confirm("¿Restaurar el stock inicial de todos los productos?")) return;
    state.inventory = buildInitialInventory();
    persist();
    flashToast("Stock reiniciado");
    render();
  }

  function removeItem(productId: string): void {
    state.cart = state.cart.filter((i) => i.productId !== productId);
    persist();
    render();
  }

  function clearCart(): void {
    if (state.cart.length === 0) return;
    state.cart = [];
    persist();
    render();
  }

  function checkout(): void {
    if (state.cart.length === 0) return;
    openPaymentModal();
  }

  function openPaymentModal(): void {
    const modal = root!.querySelector<HTMLDivElement>("[data-payment-modal]");
    const totalEl = root!.querySelector("[data-payment-total]");
    if (!modal) return;
    if (totalEl) totalEl.textContent = formatMoney(computeTotals(state.cart).total);
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closePaymentModal(): void {
    const modal = root!.querySelector<HTMLDivElement>("[data-payment-modal]");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  function cancelPayment(): void {
    closePaymentModal();
  }

  function selectPaymentMethod(method: PaymentMethod): void {
    if (state.cart.length === 0) {
      closePaymentModal();
      return;
    }
    const totals = computeTotals(state.cart);
    const sale: Sale = {
      id: `D-${String(state.sales.length + 1).padStart(5, "0")}`,
      ts: Date.now(),
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      items: state.cart.map((item) => {
        const prod = findProduct(item.productId)!;
        return { productId: prod.id, name: prod.name, qty: item.qty, price: prod.price };
      }),
      paymentMethod: method,
    };
    // Decrement inventory by each item sold.
    for (const item of sale.items) {
      const current = state.inventory[item.productId] ?? 0;
      state.inventory[item.productId] = Math.max(0, current - item.qty);
    }
    state.sales.push(sale);
    state.cart = [];
    persist();
    closePaymentModal();
    flashToast(`Venta ${sale.id} · ${formatMoney(sale.total)} · ${PAYMENT_LABELS[method]}`);
    render();
  }

  function resetDemo(): void {
    if (!confirm("¿Reiniciar el demo? Se perderán el carrito, las ventas y se restaurará el stock inicial.")) return;
    state = { cart: [], sales: [], inventory: buildInitialInventory() };
    persist();
    render();
  }

  function switchTab(tab: TabName): void {
    activeTab = tab;
    render();
  }

  function flashToast(msg: string): void {
    const toast = root!.querySelector<HTMLDivElement>("[data-toast]");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove("opacity-0", "translate-y-2");
    toast.classList.add("opacity-100", "translate-y-0");
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      toast.classList.remove("opacity-100", "translate-y-0");
    }, 2200);
  }

  function renderTabs(): void {
    root!.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((btn) => {
      const tab = btn.dataset.tab as TabName;
      const active = tab === activeTab;
      btn.classList.toggle("bg-yellow", active);
      btn.classList.toggle("text-dark", active);
      btn.classList.toggle("text-white/60", !active);
    });
    root!.querySelectorAll<HTMLDivElement>("[data-panel]").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.panel !== activeTab);
    });
  }

  function renderPos(): void {
    // Products grid
    const grid = root!.querySelector<HTMLDivElement>("[data-products]");
    if (grid) {
      grid.innerHTML = PRODUCTS.map((p) => {
        const media = p.image
          ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy" />`
          : `<div class="w-full h-full flex items-center justify-center text-3xl" style="background:${p.color}20;">${p.emoji ?? ""}</div>`;
        const stock = state.inventory[p.id] ?? 0;
        const available = availableStock(p.id);
        const isOut = stock <= 0;
        const isLow = stock > 0 && stock <= p.minStock;
        const stockBadge = isOut
          ? `<span class="absolute top-1 right-1 bg-primary text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">Agotado</span>`
          : `<span class="absolute top-1 right-1 ${isLow ? "bg-primary/90" : "bg-black/55"} text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">${stock}</span>`;
        const overlay = isOut
          ? `<div class="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none"><span class="text-white font-bold text-[11px] uppercase tracking-widest">Agotado</span></div>`
          : "";
        const disabled = isOut || available <= 0 ? "data-disabled" : "";
        const disabledClasses = isOut ? "opacity-50 cursor-not-allowed" : "";
        return `
          <button type="button" data-add="${p.id}" ${disabled} class="relative group rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-yellow/50 transition-colors text-left ${disabledClasses}">
            <div class="relative aspect-square overflow-hidden">${media}${stockBadge}${overlay}</div>
            <div class="p-2">
              <p class="text-white text-[11px] font-semibold truncate">${p.name}</p>
              <p class="text-yellow text-[11px] font-bold">${formatMoney(p.price)}</p>
            </div>
          </button>
        `;
      }).join("");
      grid.querySelectorAll<HTMLButtonElement>("[data-add]").forEach((btn) => {
        btn.addEventListener("click", () => addToCart(btn.dataset.add!));
      });
    }

    // Cart
    const cartList = root!.querySelector<HTMLDivElement>("[data-cart]");
    const emptyMsg = root!.querySelector<HTMLDivElement>("[data-cart-empty]");
    if (cartList && emptyMsg) {
      if (state.cart.length === 0) {
        cartList.innerHTML = "";
        emptyMsg.classList.remove("hidden");
      } else {
        emptyMsg.classList.add("hidden");
        cartList.innerHTML = state.cart
          .map((item) => {
            const prod = findProduct(item.productId)!;
            const thumb = prod.image
              ? `<img src="${prod.image}" alt="${prod.name}" class="w-9 h-9 rounded-md object-cover shrink-0" loading="lazy" />`
              : `<div class="w-9 h-9 rounded-md shrink-0 flex items-center justify-center text-base" style="background:${(prod.color ?? "#333")}30;">${prod.emoji ?? ""}</div>`;
            return `
              <div class="rounded-lg bg-white/5 p-2 group">
                <div class="flex items-center gap-2">
                  ${thumb}
                  <div class="min-w-0 flex-1">
                    <p class="text-white text-[11px] font-medium truncate">${prod.name}</p>
                    <p class="text-white/40 text-[10px]">${formatMoney(prod.price)} c/u</p>
                  </div>
                  <span class="text-yellow text-[11px] font-bold shrink-0">${formatMoney(prod.price * item.qty)}</span>
                </div>
                <div class="mt-1.5 flex items-center gap-1.5">
                  <button type="button" data-dec="${prod.id}" aria-label="Restar" class="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white text-sm leading-none font-bold">−</button>
                  <span class="text-white text-[11px] min-w-[18px] text-center font-semibold">${item.qty}</span>
                  <button type="button" data-inc="${prod.id}" aria-label="Sumar" class="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white text-sm leading-none font-bold">+</button>
                  <button type="button" data-remove="${prod.id}" aria-label="Quitar del carrito" title="Eliminar producto" class="ml-auto w-5 h-5 rounded bg-white/5 hover:bg-primary/80 text-white/50 hover:text-white transition-colors flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </div>
            `;
          })
          .join("");
        cartList.querySelectorAll<HTMLButtonElement>("[data-inc]").forEach((btn) => {
          btn.addEventListener("click", () => updateQty(btn.dataset.inc!, 1));
        });
        cartList.querySelectorAll<HTMLButtonElement>("[data-dec]").forEach((btn) => {
          btn.addEventListener("click", () => updateQty(btn.dataset.dec!, -1));
        });
        cartList.querySelectorAll<HTMLButtonElement>("[data-remove]").forEach((btn) => {
          btn.addEventListener("click", () => removeItem(btn.dataset.remove!));
        });
      }
    }

    // Clear-all button visibility
    const clearBtn = root!.querySelector<HTMLButtonElement>("[data-clear]");
    if (clearBtn) {
      clearBtn.classList.toggle("hidden", state.cart.length === 0);
    }

    // Totals
    const totals = computeTotals(state.cart);
    const subtotalEl = root!.querySelector("[data-subtotal]");
    const taxEl = root!.querySelector("[data-tax]");
    const totalEl = root!.querySelector("[data-total]");
    if (subtotalEl) subtotalEl.textContent = formatMoney(totals.subtotal);
    if (taxEl) taxEl.textContent = formatMoney(totals.tax);
    if (totalEl) totalEl.textContent = formatMoney(totals.total);

    const checkoutBtn = root!.querySelector<HTMLButtonElement>("[data-checkout]");
    if (checkoutBtn) {
      checkoutBtn.disabled = state.cart.length === 0;
      checkoutBtn.classList.toggle("opacity-40", state.cart.length === 0);
      checkoutBtn.classList.toggle("cursor-not-allowed", state.cart.length === 0);
    }
  }

  function renderDashboard(): void {
    const sales = state.sales;
    const ticketCount = sales.length;
    const totalRevenue = sales.reduce((s, x) => s + x.total, 0);
    const avgTicket = ticketCount > 0 ? totalRevenue / ticketCount : 0;
    const productsSold = sales.reduce((s, x) => s + x.items.reduce((a, i) => a + i.qty, 0), 0);

    const setStat = (attr: string, val: string): void => {
      const el = root!.querySelector(`[data-stat="${attr}"]`);
      if (el) el.textContent = val;
    };
    setStat("revenue", formatMoney(totalRevenue));
    setStat("tickets", String(ticketCount));
    setStat("avg", ticketCount > 0 ? formatMoney(avgTicket) : "—");
    setStat("items", String(productsSold));

    // Bar chart: revenue per sale (last 10)
    const chart = root!.querySelector<HTMLDivElement>("[data-chart]");
    if (chart) {
      const last = sales.slice(-10);
      if (last.length === 0) {
        chart.innerHTML = `<p class="text-white/30 text-xs self-center">Sin ventas todavía. Registra ventas en el POS para ver tu grafica.</p>`;
      } else {
        const max = Math.max(...last.map((s) => s.total), 1);
        chart.innerHTML = last
          .map((s) => {
            const h = Math.max(6, (s.total / max) * 100);
            return `<div class="flex-1 flex flex-col items-center gap-1 min-w-0">
              <div class="w-full rounded-t bg-yellow hover:bg-yellow-dark transition-colors" style="height:${h}%" title="${s.id}: ${formatMoney(s.total)}"></div>
              <span class="text-[8px] text-white/40 font-mono">${s.id.slice(-3)}</span>
            </div>`;
          })
          .join("");
      }
    }

    // Top products
    const topEl = root!.querySelector<HTMLDivElement>("[data-top]");
    if (topEl) {
      const counts = new Map<string, { name: string; qty: number }>();
      for (const s of sales) {
        for (const it of s.items) {
          const cur = counts.get(it.productId);
          if (cur) cur.qty += it.qty;
          else counts.set(it.productId, { name: it.name, qty: it.qty });
        }
      }
      const top = [...counts.values()].sort((a, b) => b.qty - a.qty).slice(0, 3);
      if (top.length === 0) {
        topEl.innerHTML = `<p class="text-white/30 text-xs">Aún sin productos vendidos.</p>`;
      } else {
        const max = top[0].qty;
        topEl.innerHTML = top
          .map((p, i) => {
            const pct = (p.qty / max) * 100;
            return `<div>
              <div class="flex items-center justify-between mb-0.5">
                <span class="text-[11px] font-medium text-white flex items-center gap-1.5">
                  <span class="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${i === 0 ? "bg-yellow text-dark" : "bg-white/10 text-white/70"}">${i + 1}</span>
                  ${p.name}
                </span>
                <span class="text-[10px] text-white/50">${p.qty} uds</span>
              </div>
              <div class="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div class="h-full rounded-full ${i === 0 ? "bg-yellow" : "bg-primary/70"}" style="width:${pct}%"></div>
              </div>
            </div>`;
          })
          .join("");
      }
    }
  }

  function renderInventory(): void {
    // Summary pills
    const totalEl = root!.querySelector("[data-inv-total]");
    const lowEl = root!.querySelector<HTMLElement>("[data-inv-low]");
    const lowCount = PRODUCTS.filter((p) => (state.inventory[p.id] ?? 0) <= p.minStock).length;

    if (totalEl) totalEl.textContent = `${PRODUCTS.length} productos`;
    if (lowEl) {
      lowEl.textContent = `${lowCount} con stock bajo`;
      lowEl.classList.toggle("bg-primary/20", lowCount > 0);
      lowEl.classList.toggle("border-primary/30", lowCount > 0);
      lowEl.classList.toggle("text-primary", lowCount > 0);
      lowEl.classList.toggle("bg-white/5", lowCount === 0);
      lowEl.classList.toggle("border-white/10", lowCount === 0);
      lowEl.classList.toggle("text-white/70", lowCount === 0);
    }

    const list = root!.querySelector<HTMLDivElement>("[data-inventory]");
    if (!list) return;
    list.innerHTML = PRODUCTS.map((p) => {
      const stock = state.inventory[p.id] ?? 0;
      const isOut = stock <= 0;
      const isLow = stock > 0 && stock <= p.minStock;
      const rowBg = isOut ? "bg-primary/15" : isLow ? "bg-primary/5" : "bg-white/[0.02]";
      const statusBadge = isOut
        ? `<span class="inline-block px-1.5 py-0.5 rounded-full bg-primary text-white text-[8px] font-bold uppercase">Agotado</span>`
        : isLow
        ? `<span class="inline-block px-1.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[8px] font-bold uppercase">Stock bajo</span>`
        : `<span class="inline-block px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[8px] font-bold uppercase">OK</span>`;
      const thumb = p.image
        ? `<img src="${p.image}" alt="${p.name}" class="w-9 h-9 rounded-md object-cover shrink-0" loading="lazy" />`
        : `<div class="w-9 h-9 rounded-md shrink-0 flex items-center justify-center text-base" style="background:${(p.color ?? "#333")}30;">${p.emoji ?? ""}</div>`;
      return `
        <div class="grid grid-cols-[auto_1fr_auto] gap-3 items-center px-3 py-2.5 ${rowBg}">
          <div class="flex items-center gap-2.5 min-w-0">
            ${thumb}
            <div class="min-w-0">
              <p class="text-white text-xs font-semibold truncate">${p.name}</p>
              <p class="text-white/40 text-[10px]">Mín: ${p.minStock} · ${formatMoney(p.price)}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <p class="text-white text-base font-bold leading-none">${stock}</p>
            ${statusBadge}
          </div>
          <div class="flex gap-1">
            <button type="button" data-inv-adjust="${p.id}:-1" aria-label="Restar 1" class="w-7 h-7 rounded-md bg-white/5 border border-white/10 hover:bg-white/15 text-white text-xs font-bold">−1</button>
            <button type="button" data-inv-adjust="${p.id}:1" aria-label="Sumar 1" class="w-7 h-7 rounded-md bg-white/5 border border-white/10 hover:bg-white/15 text-white text-xs font-bold">+1</button>
            <button type="button" data-inv-adjust="${p.id}:10" aria-label="Sumar 10" class="w-9 h-7 rounded-md bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 text-[10px] font-bold">+10</button>
          </div>
        </div>
      `;
    }).join("");

    list.querySelectorAll<HTMLButtonElement>("[data-inv-adjust]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [productId, deltaStr] = (btn.dataset.invAdjust ?? "").split(":");
        const delta = parseInt(deltaStr, 10);
        if (!productId || Number.isNaN(delta)) return;
        adjustInventory(productId, delta);
      });
    });
  }

  function render(): void {
    renderTabs();
    renderPos();
    renderDashboard();
    renderInventory();
  }

  // Wire tab buttons
  root.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab as TabName));
  });

  // Wire inventory reset
  root.querySelector<HTMLButtonElement>("[data-inv-reset]")?.addEventListener("click", resetInventory);

  // Wire checkout, clear-cart, and reset
  root.querySelector<HTMLButtonElement>("[data-checkout]")?.addEventListener("click", checkout);
  root.querySelector<HTMLButtonElement>("[data-clear]")?.addEventListener("click", clearCart);
  root.querySelector<HTMLButtonElement>("[data-reset]")?.addEventListener("click", resetDemo);

  // Wire payment modal
  root.querySelectorAll<HTMLButtonElement>("[data-pay]").forEach((btn) => {
    btn.addEventListener("click", () => selectPaymentMethod(btn.dataset.pay as PaymentMethod));
  });
  root.querySelector<HTMLButtonElement>("[data-pay-cancel]")?.addEventListener("click", cancelPayment);
  root.querySelector<HTMLDivElement>("[data-payment-backdrop]")?.addEventListener("click", cancelPayment);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const modal = root!.querySelector<HTMLDivElement>("[data-payment-modal]");
    if (modal && !modal.classList.contains("hidden")) cancelPayment();
  });

  render();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
