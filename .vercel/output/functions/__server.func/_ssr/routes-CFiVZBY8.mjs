import { o as __toESM } from "../_runtime.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-Dc5ADZCw.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-LXsWQ0pR.mjs";
import { t as supabase } from "./client-Cy-NPJxY.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { C as Calendar, S as Camera, _ as CircleCheck, a as Settings2, b as ChevronDown, c as ScanLine, d as Pencil, f as Package, g as Clock, h as ImagePlus, i as Sparkles, l as RefreshCw, m as Keyboard, n as TriangleAlert, o as Search, p as LoaderCircle, r as Trash2, s as ScanSearch, t as X, u as Plus, v as CircleAlert, w as Barcode, x as Check, y as ChevronUp } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CFiVZBY8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function daysUntil(dateStr) {
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const target = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
	return Math.round((target.getTime() - today.getTime()) / 864e5);
}
function getStatus(dateStr) {
	const d = daysUntil(dateStr);
	if (d < 0) return "danger";
	if (d < 7) return "critical";
	if (d <= 14) return "soon";
	if (d <= 30) return "warn";
	return "ok";
}
var statusMeta = {
	danger: {
		label: "Vencido",
		color: "var(--status-danger)",
		bg: "color-mix(in oklab, var(--status-danger) 14%, transparent)",
		rank: 0
	},
	critical: {
		label: "Crítico",
		color: "var(--status-critical)",
		bg: "color-mix(in oklab, var(--status-critical) 16%, transparent)",
		rank: 1
	},
	soon: {
		label: "Vence em breve",
		color: "var(--status-soon)",
		bg: "color-mix(in oklab, var(--status-soon) 18%, transparent)",
		rank: 2
	},
	warn: {
		label: "Atenção",
		color: "var(--status-warn)",
		bg: "color-mix(in oklab, var(--status-warn) 22%, transparent)",
		rank: 3
	},
	ok: {
		label: "Em dia",
		color: "var(--status-ok)",
		bg: "color-mix(in oklab, var(--status-ok) 16%, transparent)",
		rank: 4
	}
};
function formatDateBR(dateStr) {
	const [y, m, d] = dateStr.split("-");
	return `${d}/${m}/${y}`;
}
function relativeLabel(dateStr) {
	const d = daysUntil(dateStr);
	if (d < 0) return `Vencido há ${Math.abs(d)} dia${Math.abs(d) === 1 ? "" : "s"}`;
	if (d === 0) return "Vence hoje";
	if (d === 1) return "Vence amanhã";
	return `Vence em ${d} dias`;
}
function ProductCard({ product, category, onEdit, onDelete }) {
	const meta = statusMeta[getStatus(product.expiration_date)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		layout: true,
		initial: {
			opacity: 0,
			y: 10
		},
		animate: {
			opacity: 1,
			y: 0
		},
		whileHover: { y: -2 },
		transition: {
			type: "spring",
			stiffness: 280,
			damping: 24
		},
		className: "group relative overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute left-0 top-0 h-full w-1.5",
			style: { background: meta.color }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3 p-3 pl-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-2",
				children: product.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.photo_url,
					alt: product.name,
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full w-full place-items-center text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-7 w-7" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "line-clamp-2 font-display font-semibold leading-tight",
							children: product.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "chip shrink-0 text-[0.68rem]",
							style: {
								background: meta.bg,
								color: meta.color
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-1.5 w-1.5 rounded-full",
								style: { background: meta.color }
							}), meta.label]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground",
						children: [
							category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground/80",
								children: category.name
							}),
							product.barcode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "h-3 w-3" }),
									" ",
									product.barcode
								]
							}),
							product.quantity != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Qtd: ", product.quantity] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-end justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }),
								" ",
								formatDateBR(product.expiration_date)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-sm font-semibold",
							style: { color: meta.color },
							children: relativeLabel(product.expiration_date)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onEdit,
								className: "grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition active:scale-95 hover:bg-surface-2 hover:text-foreground",
								"aria-label": "Editar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: onDelete,
								className: "grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground transition active:scale-95 hover:bg-destructive/10 hover:text-destructive",
								"aria-label": "Excluir",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					})
				]
			})]
		})]
	});
}
var Sheet = Dialog$1;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
function useProducts() {
	return useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const { data, error } = await supabase.from("products").select("*").order("expiration_date", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
}
function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });
			if (error) throw error;
			return data;
		}
	});
}
function useSaveProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			if (input.id) {
				const { id, created_at, updated_at, ...rest } = input;
				const { error } = await supabase.from("products").update(rest).eq("id", id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("products").insert(input);
				if (error) throw error;
			}
			if (input.barcode && /^\d+$/.test(input.barcode.trim())) {
				const { error: catalogError } = await supabase.from("product_catalog").upsert({
					barcode: input.barcode.trim(),
					name: input.name || "",
					photo_url: input.photo_url || null
				}, { onConflict: "barcode" });
				if (catalogError) console.error("Erro ao atualizar product_catalog:", catalogError);
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] })
	});
}
function useDeleteProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] })
	});
}
function useSaveCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (input) => {
			if (input.id) {
				const { error } = await supabase.from("categories").update({ name: input.name }).eq("id", input.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("categories").insert({ name: input.name });
				if (error) throw error;
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] })
	});
}
function useDeleteCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("categories").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["categories"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		}
	});
}
async function compressImageToDataUrl(source, maxDim = 800, quality = .78) {
	const url = typeof source === "string" ? source : URL.createObjectURL(source);
	try {
		const img = await loadImage(url);
		const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
		const w = Math.round(img.width * scale);
		const h = Math.round(img.height * scale);
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		canvas.getContext("2d").drawImage(img, 0, 0, w, h);
		return canvas.toDataURL("image/jpeg", quality);
	} finally {
		if (typeof source !== "string") URL.revokeObjectURL(url);
	}
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}
async function fetchOpenFoodFacts(barcode) {
	try {
		const json = await (await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`)).json();
		if (json.status === 1 && json.product) {
			const p = json.product;
			return {
				found: true,
				name: p.product_name_pt || p.product_name || p.generic_name || void 0,
				imageUrl: p.image_front_url || p.image_url || void 0
			};
		}
		return { found: false };
	} catch {
		return { found: false };
	}
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Tenta identificar o produto pelo EAN usando Gemini (texto). */
var aiLookupByBarcode = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ barcode: stringType().trim().min(4).max(32) }).parse(data)).handler(createSsrRpc("2cb5bb5badd91eb59ddf99bcb347efe2a237a2b7de914d1b02a36543c7b7eb1b"));
/** Lê o rótulo da foto e devolve o nome comercial (último recurso). */
var aiVisionReadLabel = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ imageDataUrl: stringType().startsWith("data:image/").max(25e5) }).parse(data)).handler(createSsrRpc("be51d8903f65e500c2900f8ec3c883be8117f5953b6a3f11382999fa77594b24"));
var localCatalogMap = new Map((/* @__PURE__ */ JSON.parse("[{\"barcode\":\"7898070347841\",\"name\":\"Juju 170g\"},{\"barcode\":\"7898070347858\",\"name\":\"Palito com cobertura de chocolate 170g\"},{\"barcode\":\"7898070347827\",\"name\":\"Rosca de Nata 130g\"},{\"barcode\":\"7897384301365\",\"name\":\"Balas india Banana 500g\"},{\"barcode\":\"7898070347834\",\"name\":\"Biscoito de Polvilho 170g\"},{\"barcode\":\"7898070347803\",\"name\":\"Bolo de Chocolate 180g\"},{\"barcode\":\"7898070347810\",\"name\":\"Bolo de Milho 180g\"},{\"barcode\":\"7898070347796\",\"name\":\"Bolo de Cenoura 180g\"},{\"barcode\":\"7898070347789\",\"name\":\"Bolo de Coco 180g\"},{\"barcode\":\"7898070347772\",\"name\":\"Bolo de Chocolate com Gotas 180g\"},{\"barcode\":\"7898070347765\",\"name\":\"Bolo de Milho com Gotas 180g\"},{\"barcode\":\"7898070347758\",\"name\":\"Bolo de Cenoura com Gotas 180g\"},{\"barcode\":\"7898070347741\",\"name\":\"Bolo de Coco com Gotas 180g\"},{\"barcode\":\"7898070347734\",\"name\":\"Bolo de Chocolate Belga 200g\"},{\"barcode\":\"7898070347727\",\"name\":\"Bolo de Milho Belga 200g\"},{\"barcode\":\"7898070347710\",\"name\":\"Bolo de Cenoura Belga 200g\"},{\"barcode\":\"7898070347703\",\"name\":\"Bolo de Coco Belga 200g\"},{\"barcode\":\"7898070347696\",\"name\":\"Bolo de Chocolate Premium 250g\"},{\"barcode\":\"7898070347689\",\"name\":\"Bolo de Milho Premium 250g\"},{\"barcode\":\"7898070347672\",\"name\":\"Bolo de Cenoura Premium 250g\"},{\"barcode\":\"7898070347665\",\"name\":\"Bolo de Coco Premium 250g\"},{\"barcode\":\"7898070347658\",\"name\":\"Biscoito de Polvilho com Queijo 170g\"},{\"barcode\":\"7898070347641\",\"name\":\"Biscoito de Polvilho com Bacon 170g\"},{\"barcode\":\"7898070347634\",\"name\":\"Biscoito de Polvilho com Alho 170g\"},{\"barcode\":\"7898070347627\",\"name\":\"Biscoito de Polvilho com Pimenta 170g\"},{\"barcode\":\"7898070347610\",\"name\":\"Rosca de Nata com Chocolate 130g\"},{\"barcode\":\"7898070347603\",\"name\":\"Rosca de Nata com Goiaba 130g\"},{\"barcode\":\"7898070347596\",\"name\":\"Rosca de Nata com Doce de Leite 130g\"},{\"barcode\":\"7898070347589\",\"name\":\"Rosca de Nata com Banana 130g\"},{\"barcode\":\"7898070347572\",\"name\":\"Palito com cobertura de chocolate branco 170g\"},{\"barcode\":\"7898070347565\",\"name\":\"Palito com cobertura de chocolate ao leite 170g\"},{\"barcode\":\"7898070347558\",\"name\":\"Palito com cobertura de chocolate preto 170g\"},{\"barcode\":\"7898070347541\",\"name\":\"Palito com cobertura de chocolate com avelã 170g\"},{\"barcode\":\"7898070347534\",\"name\":\"Balas india Morango 500g\"},{\"barcode\":\"7898070347527\",\"name\":\"Balas india Melancia 500g\"},{\"barcode\":\"7898070347510\",\"name\":\"Balas india Abacaxi 500g\"},{\"barcode\":\"7898070347503\",\"name\":\"Balas india Uva 500g\"},{\"barcode\":\"7898070347496\",\"name\":\"Balas india Morango e Banana 500g\"},{\"barcode\":\"7898070347489\",\"name\":\"Balas india Melancia e Morango 500g\"},{\"barcode\":\"7898070347472\",\"name\":\"Balas india Abacaxi e Uva 500g\"},{\"barcode\":\"7898070347465\",\"name\":\"Balas india Mista 500g\"},{\"barcode\":\"7898070347458\",\"name\":\"Doce de Leite Cremoso 200g\"},{\"barcode\":\"7898070347441\",\"name\":\"Doce de Leite com Chocolate 200g\"},{\"barcode\":\"7898070347434\",\"name\":\"Doce de Leite com Nozes 200g\"},{\"barcode\":\"7898070347427\",\"name\":\"Doce de Leite com Amendoim 200g\"},{\"barcode\":\"7898070347410\",\"name\":\"Geleia de Morango 200g\"},{\"barcode\":\"7898070347403\",\"name\":\"Geleia de Uva 200g\"},{\"barcode\":\"7898070347396\",\"name\":\"Geleia de Goiaba 200g\"},{\"barcode\":\"7898070347389\",\"name\":\"Geleia de Abacaxi 200g\"},{\"barcode\":\"7898070347372\",\"name\":\"Mel Puro 250g\"},{\"barcode\":\"7898070347365\",\"name\":\"Mel com Gengibre 250g\"},{\"barcode\":\"7898070347358\",\"name\":\"Mel com Limão 250g\"},{\"barcode\":\"7898070347341\",\"name\":\"Mel com Própolis 250g\"},{\"barcode\":\"7898070347334\",\"name\":\"Chocolate em Pó 200g\"},{\"barcode\":\"7898070347327\",\"name\":\"Chocolate em Pó Premium 200g\"},{\"barcode\":\"7898070347310\",\"name\":\"Chocolate em Pó com Açúcar 200g\"},{\"barcode\":\"7898070347303\",\"name\":\"Chocolate em Pó Integral 200g\"},{\"barcode\":\"7898070347296\",\"name\":\"Café Torrado 250g\"},{\"barcode\":\"7898070347289\",\"name\":\"Café Torrado Premium 250g\"},{\"barcode\":\"7898070347272\",\"name\":\"Café Torrado com Chocolate 250g\"},{\"barcode\":\"7898070347265\",\"name\":\"Café Torrado com Canela 250g\"},{\"barcode\":\"7898070347258\",\"name\":\"Chá Verde 100g\"},{\"barcode\":\"7898070347241\",\"name\":\"Chá Preto 100g\"},{\"barcode\":\"7898070347234\",\"name\":\"Chá Branco 100g\"},{\"barcode\":\"7898070347227\",\"name\":\"Chá de Camomila 100g\"},{\"barcode\":\"7898070347210\",\"name\":\"Açúcar Cristal 1kg\"},{\"barcode\":\"7898070347203\",\"name\":\"Açúcar Demerara 1kg\"},{\"barcode\":\"7898070347196\",\"name\":\"Açúcar Mascavo 1kg\"},{\"barcode\":\"7898070347189\",\"name\":\"Açúcar Orgânico 1kg\"},{\"barcode\":\"7898070347172\",\"name\":\"Sal Fino 1kg\"},{\"barcode\":\"7898070347165\",\"name\":\"Sal Grosso 1kg\"},{\"barcode\":\"7898070347158\",\"name\":\"Sal do Himalaia 500g\"},{\"barcode\":\"7898070347141\",\"name\":\"Sal Marinho 500g\"},{\"barcode\":\"7898070347134\",\"name\":\"Óleo de Soja 900ml\"},{\"barcode\":\"7898070347127\",\"name\":\"Óleo de Girassol 900ml\"},{\"barcode\":\"7898070347110\",\"name\":\"Óleo de Canola 900ml\"},{\"barcode\":\"7898070347103\",\"name\":\"Óleo de Coco 500ml\"},{\"barcode\":\"7898070347096\",\"name\":\"Vinagre Branco 500ml\"},{\"barcode\":\"7898070347089\",\"name\":\"Vinagre de Maçã 500ml\"},{\"barcode\":\"7898070347072\",\"name\":\"Vinagre Balsâmico 250ml\"},{\"barcode\":\"7898070347065\",\"name\":\"Vinagre de Vinho Tinto 250ml\"},{\"barcode\":\"7898070347058\",\"name\":\"Molho de Tomate 300g\"},{\"barcode\":\"7898070347041\",\"name\":\"Molho de Tomate Premium 300g\"},{\"barcode\":\"7898070347034\",\"name\":\"Molho de Tomate com Alho 300g\"},{\"barcode\":\"7898070347027\",\"name\":\"Molho de Tomate com Cebola 300g\"},{\"barcode\":\"7898070347010\",\"name\":\"Macarrão Integral 500g\"},{\"barcode\":\"7898070346303\",\"name\":\"Macarrão Comum 500g\"},{\"barcode\":\"7898070346296\",\"name\":\"Macarrão Penne 500g\"},{\"barcode\":\"7898070346289\",\"name\":\"Macarrão Fusilli 500g\"},{\"barcode\":\"7898070346272\",\"name\":\"Arroz Branco 5kg\"},{\"barcode\":\"7898070346265\",\"name\":\"Arroz Integral 5kg\"},{\"barcode\":\"7898070346258\",\"name\":\"Arroz Arbóreo 1kg\"},{\"barcode\":\"7898070346241\",\"name\":\"Arroz Selvagem 500g\"},{\"barcode\":\"7898070346234\",\"name\":\"Feijão Carioca 1kg\"},{\"barcode\":\"7898070346227\",\"name\":\"Feijão Preto 1kg\"},{\"barcode\":\"7898070346210\",\"name\":\"Feijão Vermelho 1kg\"},{\"barcode\":\"7898070346203\",\"name\":\"Lentilha 500g\"},{\"barcode\":\"7898070346196\",\"name\":\"Grão de Bico 500g\"},{\"barcode\":\"7898070346189\",\"name\":\"Ervilha 500g\"},{\"barcode\":\"7898070346172\",\"name\":\"Milho 500g\"},{\"barcode\":\"7898070346165\",\"name\":\"Amendoim 500g\"},{\"barcode\":\"7898070346158\",\"name\":\"Castanha de Caju 500g\"},{\"barcode\":\"7898070346141\",\"name\":\"Castanha do Pará 500g\"},{\"barcode\":\"7898070346134\",\"name\":\"Nozes 500g\"},{\"barcode\":\"7898070346127\",\"name\":\"Amêndoas 500g\"},{\"barcode\":\"7898070346110\",\"name\":\"Avelã 500g\"},{\"barcode\":\"7898070346103\",\"name\":\"Pistache 500g\"},{\"barcode\":\"7898070346096\",\"name\":\"Semente de Girassol 500g\"},{\"barcode\":\"7898070346089\",\"name\":\"Semente de Abóbora 500g\"},{\"barcode\":\"7898070346072\",\"name\":\"Semente de Melancia 500g\"},{\"barcode\":\"7898070346065\",\"name\":\"Semente de Linhaça 500g\"},{\"barcode\":\"7898070346058\",\"name\":\"Chia 500g\"},{\"barcode\":\"7898070346041\",\"name\":\"Aveia em Flocos 500g\"},{\"barcode\":\"7898070346034\",\"name\":\"Aveia em Pó 500g\"},{\"barcode\":\"7898070346027\",\"name\":\"Farinha de Trigo 1kg\"},{\"barcode\":\"7898070346010\",\"name\":\"Farinha Integral 1kg\"},{\"barcode\":\"7898070345303\",\"name\":\"Farinha de Milho 1kg\"},{\"barcode\":\"7898070345296\",\"name\":\"Farinha de Aveia 500g\"},{\"barcode\":\"7898070345289\",\"name\":\"Fermento em Pó 100g\"},{\"barcode\":\"7898070345272\",\"name\":\"Fermento Biológico 500g\"},{\"barcode\":\"7898070345265\",\"name\":\"Amido de Milho 500g\"},{\"barcode\":\"7898070345258\",\"name\":\"Polvilho Doce 500g\"},{\"barcode\":\"7898070345241\",\"name\":\"Polvilho Azedo 500g\"},{\"barcode\":\"7898070345234\",\"name\":\"Goma de Tapioca 500g\"},{\"barcode\":\"7898070345227\",\"name\":\"Gelatina Incolor 25g\"},{\"barcode\":\"7898070345210\",\"name\":\"Gelatina Vermelha 25g\"},{\"barcode\":\"7898070345203\",\"name\":\"Gelatina Amarela 25g\"},{\"barcode\":\"7898070345196\",\"name\":\"Gelatina Verde 25g\"},{\"barcode\":\"7898070345189\",\"name\":\"Pó para Pudim 100g\"},{\"barcode\":\"7898070345172\",\"name\":\"Pó para Bolo 400g\"},{\"barcode\":\"7898070345165\",\"name\":\"Pó para Brownie 200g\"},{\"barcode\":\"7898070345158\",\"name\":\"Pó para Pavê 300g\"},{\"barcode\":\"7898070345141\",\"name\":\"Leite em Pó 400g\"},{\"barcode\":\"7898070345134\",\"name\":\"Leite em Pó Integral 400g\"},{\"barcode\":\"7898070345127\",\"name\":\"Leite em Pó Desnatado 400g\"},{\"barcode\":\"7898070345110\",\"name\":\"Leite Condensado 395g\"},{\"barcode\":\"7898070345103\",\"name\":\"Creme de Leite 200ml\"},{\"barcode\":\"7898070345096\",\"name\":\"Requeijão 200g\"},{\"barcode\":\"7898070345089\",\"name\":\"Queijo Meia Cura 500g\"},{\"barcode\":\"7898070345072\",\"name\":\"Queijo Meia Cura Ralado 200g\"},{\"barcode\":\"7898070345065\",\"name\":\"Queijo Parmesão 200g\"},{\"barcode\":\"7898070345058\",\"name\":\"Queijo Parmesão Ralado 100g\"},{\"barcode\":\"7898070345041\",\"name\":\"Manteiga 200g\"},{\"barcode\":\"7898070345034\",\"name\":\"Manteiga com Sal 200g\"},{\"barcode\":\"7898070345027\",\"name\":\"Margarina 500g\"},{\"barcode\":\"7898070345010\",\"name\":\"Margarina com Sal 500g\"}]")).map((entry) => [entry.barcode, entry.name]));
/** Cascata por código de barras (sem foto). */
async function lookupByBarcode(barcode) {
	const code = barcode.trim();
	if (!code) return {
		name: null,
		imageDataUrl: null,
		source: "none"
	};
	const localName = localCatalogMap.get(code);
	if (localName) return {
		name: localName,
		imageDataUrl: null,
		source: "local_catalog"
	};
	try {
		const { data } = await supabase.from("products").select("name, photo_url").eq("barcode", code).limit(1).maybeSingle();
		if (data?.name) return {
			name: data.name,
			imageDataUrl: data.photo_url ?? null,
			source: "cache"
		};
	} catch {}
	try {
		const off = await fetchOpenFoodFacts(code);
		if (off.found && off.name) {
			let img = null;
			if (off.imageUrl) try {
				img = await compressImageToDataUrl(off.imageUrl);
			} catch {
				img = off.imageUrl;
			}
			return {
				name: off.name,
				imageDataUrl: img,
				source: "openfoodfacts"
			};
		}
	} catch {}
	try {
		const ai = await aiLookupByBarcode({ data: { barcode: code } });
		if (ai?.name) return {
			name: ai.name,
			imageDataUrl: null,
			source: "ai_text"
		};
	} catch {}
	return {
		name: null,
		imageDataUrl: null,
		source: "none"
	};
}
/** Último recurso: lê rótulo da foto via IA de visão. */
async function lookupByPhoto(imageDataUrl) {
	try {
		const ai = await aiVisionReadLabel({ data: { imageDataUrl } });
		if (ai?.name) return {
			name: ai.name,
			imageDataUrl,
			source: "ai_vision"
		};
	} catch {}
	return {
		name: null,
		imageDataUrl,
		source: "none"
	};
}
var ITEM_H = 44;
var VISIBLE = 5;
var PAD = Math.floor(VISIBLE / 2);
function WheelColumn({ items, value, onChange, ariaLabel }) {
	const ref = (0, import_react.useRef)(null);
	const settleRef = (0, import_react.useRef)(null);
	const lastEmitted = (0, import_react.useRef)(value);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const idx = items.findIndex((i) => i.value === value);
		if (idx < 0) return;
		const target = idx * ITEM_H;
		if (Math.abs(el.scrollTop - target) > 1) el.scrollTo({
			top: target,
			behavior: "auto"
		});
		lastEmitted.current = value;
	}, [value, items]);
	function onScroll() {
		const el = ref.current;
		if (!el) return;
		if (settleRef.current) window.clearTimeout(settleRef.current);
		settleRef.current = window.setTimeout(() => {
			const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)));
			const target = idx * ITEM_H;
			if (Math.abs(el.scrollTop - target) > .5) el.scrollTo({
				top: target,
				behavior: "smooth"
			});
			const v = items[idx].value;
			if (v !== lastEmitted.current) {
				lastEmitted.current = v;
				onChange(v);
			}
		}, 90);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		role: "listbox",
		"aria-label": ariaLabel,
		onScroll,
		className: "relative flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar",
		style: {
			height: ITEM_H * VISIBLE,
			scrollSnapType: "y mandatory",
			WebkitOverflowScrolling: "touch",
			overscrollBehavior: "contain",
			touchAction: "pan-y",
			maskImage: "linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)",
			WebkitMaskImage: "linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { height: PAD * ITEM_H },
				"aria-hidden": true
			}),
			items.map((it) => {
				const selected = it.value === value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center snap-center select-none transition-[color,transform] duration-150",
					style: {
						height: ITEM_H,
						fontFamily: "var(--font-display)",
						fontWeight: selected ? 700 : 500,
						fontSize: selected ? 22 : 18,
						color: selected ? "var(--foreground)" : "color-mix(in oklab, var(--foreground) 35%, transparent)"
					},
					children: it.label
				}, it.value);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { height: PAD * ITEM_H },
				"aria-hidden": true
			})
		]
	});
}
function pad(n) {
	return n < 10 ? `0${n}` : String(n);
}
var MONTHS = [
	"jan",
	"fev",
	"mar",
	"abr",
	"mai",
	"jun",
	"jul",
	"ago",
	"set",
	"out",
	"nov",
	"dez"
];
function DateWheel({ value, onChange }) {
	const today = /* @__PURE__ */ new Date();
	const init = (0, import_react.useMemo)(() => {
		if (value) {
			const [y, m, d] = value.split("-").map(Number);
			return {
				y,
				m,
				d
			};
		}
		return {
			y: today.getFullYear(),
			m: today.getMonth() + 1,
			d: today.getDate()
		};
	}, []);
	const yearNow = today.getFullYear();
	const years = (0, import_react.useMemo)(() => Array.from({ length: 12 }, (_, i) => yearNow - 1 + i).map((y) => ({
		value: y,
		label: String(y)
	})), [yearNow]);
	const months = (0, import_react.useMemo)(() => MONTHS.map((label, i) => ({
		value: i + 1,
		label
	})), []);
	const cur = (0, import_react.useMemo)(() => {
		if (!value) return init;
		const [y, m, d] = value.split("-").map(Number);
		return {
			y,
			m,
			d
		};
	}, [value, init]);
	const daysInMonth = new Date(cur.y, cur.m, 0).getDate();
	const days = (0, import_react.useMemo)(() => Array.from({ length: daysInMonth }, (_, i) => ({
		value: i + 1,
		label: pad(i + 1)
	})), [daysInMonth]);
	function emit(y, m, d) {
		const dim = new Date(y, m, 0).getDate();
		const day = Math.min(d, dim);
		onChange(`${y}-${pad(m)}-${pad(day)}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative rounded-lg border border-border bg-surface-2/40 p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute left-2 right-2 rounded-xl",
			style: {
				top: `calc(50% - ${ITEM_H / 2}px)`,
				height: ITEM_H,
				background: "color-mix(in oklab, var(--primary) 12%, transparent)",
				boxShadow: "inset 0 1px 0 color-mix(in oklab, var(--primary) 35%, transparent), inset 0 -1px 0 color-mix(in oklab, var(--primary) 35%, transparent)"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelColumn, {
					ariaLabel: "Dia",
					items: days,
					value: cur.d,
					onChange: (d) => emit(cur.y, cur.m, d)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelColumn, {
					ariaLabel: "Mês",
					items: months,
					value: cur.m,
					onChange: (m) => emit(cur.y, m, cur.d)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WheelColumn, {
					ariaLabel: "Ano",
					items: years,
					value: cur.y,
					onChange: (y) => emit(y, cur.m, cur.d)
				})
			]
		})]
	});
}
var SOURCE_LABEL = {
	local_catalog: "Catálogo local",
	cache: "Cache local",
	openfoodfacts: "OpenFoodFacts",
	ai_text: "IA (código)",
	ai_vision: "IA (foto do rótulo)",
	none: "Manual"
};
function ProductForm({ open, onClose, initial, categories, defaultCategoryId }) {
	const save = useSaveProduct();
	const [name, setName] = (0, import_react.useState)("");
	const [barcode, setBarcode] = (0, import_react.useState)("");
	const [categoryId, setCategoryId] = (0, import_react.useState)();
	const [expiration, setExpiration] = (0, import_react.useState)("");
	const [quantity, setQuantity] = (0, import_react.useState)("");
	const [photo, setPhoto] = (0, import_react.useState)(null);
	const [lookingUp, setLookingUp] = (0, import_react.useState)(false);
	const [visioning, setVisioning] = (0, import_react.useState)(false);
	const [notFoundNotice, setNotFoundNotice] = (0, import_react.useState)(false);
	const [source, setSource] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setName(initial?.name ?? "");
		setBarcode(initial?.barcode ?? "");
		setCategoryId(initial?.category_id ?? defaultCategoryId);
		setExpiration(initial?.expiration_date ?? defaultISO());
		setQuantity(initial?.quantity != null ? String(initial.quantity) : "");
		setPhoto(initial?.photo_url ?? null);
		setNotFoundNotice(false);
		setSource(null);
		if (!initial?.id && initial?.barcode && !initial?.name) runBarcodeLookup(initial.barcode);
	}, [open, initial?.id]);
	async function runBarcodeLookup(code) {
		setLookingUp(true);
		setNotFoundNotice(false);
		try {
			const r = await lookupByBarcode(code);
			if (r.name) {
				setName((prev) => prev || r.name);
				if (r.imageDataUrl) setPhoto((prev) => prev || r.imageDataUrl);
				setSource(r.source);
			} else {
				setNotFoundNotice(true);
				setSource("none");
			}
		} finally {
			setLookingUp(false);
		}
	}
	async function runVisionOnPhoto(dataUrl) {
		setVisioning(true);
		try {
			const r = await lookupByPhoto(dataUrl);
			if (r.name) {
				setName((prev) => prev || r.name);
				setSource("ai_vision");
				setNotFoundNotice(false);
				toast.success("Nome identificado pelo rótulo");
			} else toast.message("Rótulo ilegível — preencha manualmente.");
		} finally {
			setVisioning(false);
		}
	}
	async function onPickPhoto(file) {
		try {
			const data = await compressImageToDataUrl(file);
			setPhoto(data);
			if (!name.trim()) runVisionOnPhoto(data);
		} catch {
			toast.error("Não foi possível processar a foto.");
		}
	}
	async function onSubmit() {
		if (!name.trim()) return toast.error("Informe o nome do produto.");
		if (!expiration) return toast.error("Informe a data de validade.");
		if (!categoryId) return toast.error("Escolha uma categoria.");
		const trimmedBarcode = barcode.trim() || null;
		await save.mutateAsync({
			id: initial?.id,
			name: name.trim(),
			barcode: trimmedBarcode,
			category_id: categoryId,
			expiration_date: expiration,
			quantity: quantity ? Number(quantity) : null,
			photo_url: photo
		});
		toast.success(initial?.id ? "Produto atualizado" : "Produto cadastrado");
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "bottom",
			className: "h-[92vh] rounded-t-3xl border-border bg-background p-0 shadow-[0_-20px_60px_-20px_rgba(60,30,10,0.25)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center pt-3 pb-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-12 rounded-full bg-foreground/15" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
					className: "px-5 pt-2 pb-3 text-left",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
						className: "font-display text-2xl tracking-tight",
						children: initial?.id ? "Editar produto" : "Novo produto"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-y-auto px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]",
					style: { maxHeight: "calc(92vh - 5.5rem)" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-2 border border-border",
									children: [photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: photo,
										alt: "",
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-full w-full items-center justify-center text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-7 w-7" })
									}), (lookingUp || visioning) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 grid place-items-center bg-foreground/40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin text-background" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											className: "w-full touch-min rounded-xl",
											onClick: () => fileRef.current?.click(),
											children: photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 mr-2" }), " Trocar foto"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-4 w-4 mr-2" }), " Adicionar foto"] })
										}),
										photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "ghost",
											size: "sm",
											className: "w-full text-muted-foreground",
											onClick: () => setPhoto(null),
											children: "Remover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileRef,
											type: "file",
											accept: "image/*",
											capture: "environment",
											className: "hidden",
											onChange: (e) => {
												const f = e.target.files?.[0];
												if (f) onPickPhoto(f);
												e.target.value = "";
											}
										})
									]
								})]
							}),
							notFoundNotice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border border-primary/25 bg-[color-mix(in_oklab,var(--primary)_8%,white)] p-3 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-display text-sm font-semibold text-foreground",
												children: "Não achei esse código nas bases."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-0.5 text-muted-foreground",
												children: photo ? "Posso ler o rótulo da foto enviada para preencher o nome." : "Tire ou envie uma foto da embalagem que eu leio o rótulo pra você."
											}),
											photo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												className: "mt-2 h-9 rounded-lg border-primary/40 text-primary hover:bg-primary/10",
												onClick: () => runVisionOnPhoto(photo),
												disabled: visioning,
												children: [visioning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "mr-2 h-3.5 w-3.5" }), "Identificar pela foto"]
											})
										]
									})]
								})
							}),
							source && source !== "none" && name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "-mt-2 text-[11px] text-muted-foreground",
								children: [
									"Identificado por ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground/80",
										children: SOURCE_LABEL[source]
									}),
									" — confira antes de salvar."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nome" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "Ex.: Chocolate ao leite 90g",
									className: "h-12 rounded-xl"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Código de barras" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: barcode,
										inputMode: "numeric",
										onChange: (e) => setBarcode(e.target.value),
										placeholder: "Opcional",
										className: "h-12 rounded-xl"
									}), barcode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "icon",
										className: "h-12 w-12 rounded-xl",
										onClick: () => runBarcodeLookup(barcode),
										disabled: lookingUp,
										children: lookingUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-end justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Validade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-sm font-semibold text-primary",
										children: expiration ? formatDateBR(expiration) : "—"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateWheel, {
									value: expiration || void 0,
									onChange: setExpiration
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										inputMode: "numeric",
										min: 0,
										value: quantity,
										onChange: (e) => setQuantity(e.target.value),
										placeholder: "—",
										className: "h-12 rounded-xl"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoria" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: categoryId,
										onValueChange: setCategoryId,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-12 rounded-xl",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.id,
											children: c.name
										}, c.id)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sticky bottom-0 -mx-5 mt-2 flex gap-2 border-t border-border bg-background/95 px-5 py-3 backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									className: "flex-1 h-12 rounded-xl",
									onClick: onClose,
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "flex-1 h-12 rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-[var(--primary-hover)]",
									onClick: onSubmit,
									disabled: save.isPending,
									children: save.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Salvar"
								})]
							})
						]
					})
				})
			]
		})
	});
}
function defaultISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function BarcodeScanner({ open, onClose, onDetected, title }) {
	const containerId = "barcode-reader-region";
	(0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	const scannerRef = (0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [manual, setManual] = (0, import_react.useState)("");
	const [manualMode, setManualMode] = (0, import_react.useState)(false);
	const [isScanning, setIsScanning] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open || manualMode) return;
		let cancelled = false;
		(async () => {
			try {
				const { default: Quagga } = await import("../_libs/@ericblade/quagga2+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
				if (cancelled) return;
				const el = document.getElementById(containerId);
				if (!el) return;
				setIsScanning(true);
				setError(null);
				await Quagga.init({
					inputStream: {
						name: "Live",
						type: "LiveStream",
						target: el,
						constraints: {
							width: { min: 640 },
							height: { min: 480 },
							facingMode: "environment"
						}
					},
					decoder: {
						readers: [
							"ean_reader",
							"ean_8_reader",
							"code_128_reader",
							"code_39_reader",
							"code_39_vin_reader",
							"codabar_reader",
							"upc_reader",
							"upc_e_reader",
							"i2of5_reader"
						],
						debug: {
							showCanvas: false,
							showPatternLabels: false,
							showFrequency: false,
							showSkeleton: false,
							showScatter: false,
							logLevel: 0
						}
					},
					locator: {
						halfSample: true,
						patchSize: "medium"
					},
					numOfWorkers: 2,
					frequency: 10
				}, (err) => {
					if (err) {
						console.error("Quagga init error:", err);
						if (!cancelled) {
							setError("Não foi possível inicializar a câmera. Tente novamente.");
							setIsScanning(false);
						}
					}
				});
				if (cancelled) {
					await Quagga.stop();
					return;
				}
				const onDetected = (result) => {
					if (result && result.codeResult && result.codeResult.code) {
						const code = result.codeResult.code.trim();
						if (code && code.length > 0) handleDetected(code);
					}
				};
				Quagga.onDetected(onDetected);
				scannerRef.current = {
					Quagga,
					onDetected
				};
				Quagga.start();
			} catch (e) {
				console.error("Scanner error:", e);
				if (!cancelled) {
					setError("Câmera indisponível. Digite o código manualmente ou verifique as permissões.");
					setIsScanning(false);
				}
			}
		})();
		const handleDetected = (code) => {
			onDetected(code);
			stop();
		};
		const stop = async () => {
			try {
				if (scannerRef.current?.Quagga) {
					const { Quagga } = scannerRef.current;
					if (scannerRef.current.onDetected) Quagga.offDetected(scannerRef.current.onDetected);
					await Quagga.stop();
				}
			} catch (e) {
				console.error("Error stopping scanner:", e);
			}
			scannerRef.current = null;
			setIsScanning(false);
		};
		return () => {
			cancelled = true;
			stop();
		};
	}, [
		open,
		manualMode,
		onDetected
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md p-0 overflow-hidden border-border bg-surface",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "px-5 pt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-xl",
					children: manualMode ? "Digitar código" : title ?? "Escanear código de barras"
				})
			}), !manualMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "scanner-frame relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-black",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								id: containerId,
								className: "absolute inset-0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4/5 h-1/3 border-2 border-green-500 rounded-lg opacity-60" })
							}),
							isScanning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute top-3 right-3 flex items-center gap-2 bg-green-500/80 text-white px-3 py-1 rounded-full text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }), "Escaneando"]
							})
						]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "flex-1",
							onClick: () => setManualMode(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "h-4 w-4 mr-2" }), " Digitar manualmente"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5 pt-3 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					autoFocus: true,
					inputMode: "numeric",
					placeholder: "Código de barras",
					value: manual,
					onChange: (e) => setManual(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter" && manual.trim()) onDetected(manual.trim());
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						className: "flex-1",
						onClick: () => setManualMode(false),
						children: "Voltar à câmera"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1",
						onClick: () => manual.trim() && onDetected(manual.trim()),
						children: "Confirmar"
					})]
				})]
			})]
		})
	});
}
function CategoryManager({ open, onClose, categories }) {
	const save = useSaveCategory();
	const del = useDeleteCategory();
	const [newName, setNewName] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	async function add() {
		const n = newName.trim();
		if (!n) return;
		try {
			await save.mutateAsync({ name: n });
			setNewName("");
			toast.success("Categoria criada");
		} catch (e) {
			toast.error(e.message?.includes("duplicate") ? "Já existe uma categoria com esse nome." : "Erro ao salvar");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => !v && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md bg-surface border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-xl",
					children: "Categorias"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Nova categoria",
						value: newName,
						onChange: (e) => setNewName(e.target.value),
						onKeyDown: (e) => e.key === "Enter" && add()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: add,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2 max-h-72 overflow-y-auto pr-1",
					children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-surface-2/60 px-3 py-2",
						children: editingId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: editName,
								onChange: (e) => setEditName(e.target.value),
								className: "h-8",
								autoFocus: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8",
								onClick: async () => {
									if (editName.trim()) {
										await save.mutateAsync({
											id: c.id,
											name: editName.trim()
										});
										setEditingId(null);
									}
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8",
								onClick: () => setEditingId(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 font-medium",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 text-muted-foreground",
								onClick: () => {
									setEditingId(c.id);
									setEditName(c.name);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 text-destructive",
								disabled: c.name === "Geral",
								onClick: async () => {
									if (confirm(`Excluir categoria "${c.name}"?`)) {
										await del.mutateAsync(c.id);
										toast.success("Categoria excluída");
									}
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						] })
					}, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					children: "Fechar"
				})
			]
		})
	});
}
var LOGO_URL = "/paulifest-logo.png";
function Home() {
	const products = useProducts();
	const categories = useCategories();
	const del = useDeleteProduct();
	const [search, setSearch] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("all");
	const [scanIntent, setScanIntent] = (0, import_react.useState)(null);
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [formInitial, setFormInitial] = (0, import_react.useState)(null);
	const [catOpen, setCatOpen] = (0, import_react.useState)(false);
	const categoryMap = (0, import_react.useMemo)(() => new Map((categories.data ?? []).map((c) => [c.id, c])), [categories.data]);
	const geralId = (categories.data ?? []).find((c) => c.name === "Geral")?.id;
	const filtered = (0, import_react.useMemo)(() => {
		const list = products.data ?? [];
		const s = search.trim().toLowerCase();
		return list.filter((p) => categoryFilter === "all" ? true : p.category_id === categoryFilter).filter((p) => !s ? true : p.name.toLowerCase().includes(s) || (p.barcode ?? "").includes(s)).map((p) => ({
			p,
			rank: statusMeta[getStatus(p.expiration_date)].rank
		})).sort((a, b) => a.rank - b.rank || a.p.expiration_date.localeCompare(b.p.expiration_date)).map((x) => x.p);
	}, [
		products.data,
		search,
		categoryFilter
	]);
	const counts = (0, import_react.useMemo)(() => {
		const list = products.data ?? [];
		let danger = 0, critical = 0, soon = 0, warn = 0, ok = 0;
		for (const p of list) {
			const s = getStatus(p.expiration_date);
			if (s === "danger") danger++;
			else if (s === "critical") critical++;
			else if (s === "soon") soon++;
			else if (s === "warn") warn++;
			else ok++;
		}
		return {
			danger,
			critical,
			soon,
			warn,
			ok,
			urgent: danger + critical
		};
	}, [products.data]);
	function openNew(barcode) {
		setFormInitial(barcode ? {
			barcode,
			category_id: geralId
		} : { category_id: geralId });
		setFormOpen(true);
	}
	function handleScanned(code) {
		const intent = scanIntent;
		setScanIntent(null);
		if (intent === "search") setSearch(code);
		else openNew(code);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 mx-auto min-h-screen w-full max-w-2xl px-4 pb-36 pt-[max(env(safe-area-inset-top),0.75rem)] sm:pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-3 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: LOGO_URL,
					alt: "Paulifest",
					className: "h-9 w-auto max-w-[60%] select-none object-contain object-left",
					draggable: false
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCatOpen(true),
					className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-surface text-muted-foreground shadow-[var(--shadow-press)] transition active:scale-95 hover:text-foreground",
					"aria-label": "Categorias",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-4.5 w-4.5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-3 grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Vencidos",
						value: counts.danger,
						color: "var(--status-danger)",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Próximos",
						value: counts.critical + counts.soon + counts.warn,
						color: "var(--status-critical)",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Em dia",
						value: counts.ok,
						color: "var(--status-ok)",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: counts.urgent > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: -6
				},
				animate: {
					opacity: 1,
					y: 0
				},
				exit: { opacity: 0 },
				className: "mb-3 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display font-semibold text-foreground",
					children: [
						counts.urgent,
						" produto",
						counts.urgent === 1 ? "" : "s",
						" vencendo / vencido",
						counts.urgent === 1 ? "" : "s"
					]
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Buscar por nome ou código",
						className: "rounded-lg border-border bg-surface pl-10 pr-20 text-base shadow-[var(--shadow-press)] focus-visible:ring-2 focus-visible:ring-primary",
						style: { height: 44 }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1",
						children: [search && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearch(""),
							className: "grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition active:scale-95 hover:text-foreground",
							"aria-label": "Limpar busca",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setScanIntent("search"),
							className: "grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-95 hover:bg-[var(--primary-hover)]",
							"aria-label": "Escanear código para buscar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-4.5 w-4.5" })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-4 mb-3 overflow-x-auto px-4 no-scrollbar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChip, {
						label: "Todos",
						active: categoryFilter === "all",
						onClick: () => setCategoryFilter("all")
					}), (categories.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryChip, {
						label: c.name,
						active: categoryFilter === c.id,
						onClick: () => setCategoryFilter(c.id)
					}, c.id))]
				})
			}),
			products.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 animate-pulse rounded-lg bg-surface" }, i))
			}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { onAdd: () => openNew() }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupedList, {
				items: filtered,
				categoryMap,
				onEdit: (p) => {
					setFormInitial(p);
					setFormOpen(true);
				},
				onDelete: async (p) => {
					if (confirm(`Excluir "${p.name}"?`)) {
						await del.mutateAsync(p.id);
						toast.success("Produto excluído");
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-20 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto flex max-w-2xl items-center justify-end gap-2 px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
						whileTap: { scale: .96 },
						onClick: () => setScanIntent("add"),
						className: "group flex items-center gap-2 rounded-lg bg-primary px-5 font-display text-base font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:bg-[var(--primary-hover)]",
						style: { height: 52 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-5 w-5" }), "Escanear / Adicionar"]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BarcodeScanner, {
				open: scanIntent !== null,
				onClose: () => setScanIntent(null),
				onDetected: handleScanned,
				title: scanIntent === "search" ? "Buscar por código" : "Escanear código de barras"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
				open: formOpen,
				onClose: () => setFormOpen(false),
				initial: formInitial,
				categories: categories.data ?? [],
				defaultCategoryId: geralId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryManager, {
				open: catOpen,
				onClose: () => setCatOpen(false),
				categories: categories.data ?? []
			})
		]
	});
}
function StatCard({ label, value, color, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-lg border border-border bg-surface px-3 py-2 shadow-[var(--shadow-press)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute -right-3 -top-3 h-12 w-12 rounded-full blur-2xl opacity-40",
			style: { background: color }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color },
						children: icon
					}),
					" ",
					label
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 font-display text-xl font-bold leading-tight",
				style: { color },
				children: value
			})]
		})]
	});
}
function CategoryChip({ label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: `chip touch-min border transition active:scale-95 ${active ? "chip-active border-transparent" : "border-border bg-surface text-muted-foreground hover:text-foreground"}`,
		children: label
	});
}
function EmptyState({ onAdd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 rounded-xl border border-dashed border-border bg-surface/60 p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-12 w-12 place-items-center rounded-lg bg-primary/15 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-base font-semibold",
				children: "Nenhum produto cadastrado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Escaneie um código de barras ou adicione manualmente para começar."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3 h-11 rounded-lg bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]",
				onClick: onAdd,
				children: "Adicionar produto"
			})
		]
	});
}
function GroupedList({ items, categoryMap, onEdit, onDelete }) {
	const urgent = [];
	const soon = [];
	const okList = [];
	for (const p of items) {
		const s = getStatus(p.expiration_date);
		if (s === "danger" || s === "critical") urgent.push(p);
		else if (s === "soon" || s === "warn") soon.push(p);
		else okList.push(p);
	}
	const groups = [];
	if (urgent.length) groups.push({
		key: "u",
		title: "Resolver agora",
		tone: "var(--status-danger)",
		list: urgent
	});
	if (soon.length) groups.push({
		key: "s",
		title: "Vence em breve",
		tone: "var(--status-soon)",
		list: soon
	});
	if (okList.length) groups.push({
		key: "o",
		title: "Em dia",
		tone: "var(--status-ok)",
		list: okList
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 w-1.5 rounded-full",
							style: { background: g.tone }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-[11px] font-bold uppercase tracking-[0.14em]",
							style: { color: g.tone },
							children: g.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-medium text-muted-foreground",
							children: ["· ", g.list.length]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ml-2 h-px flex-1 bg-border" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: g.list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						category: p.category_id ? categoryMap.get(p.category_id) : void 0,
						onEdit: () => onEdit(p),
						onDelete: () => onDelete(p)
					}, p.id))
				})]
			}, g.key))
		})
	});
}
//#endregion
export { Home as component };
