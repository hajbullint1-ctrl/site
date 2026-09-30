import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { f as submitBooking, r as getSitePayload } from "./site-api-BsASl74t.mjs";
import { a as Textarea, c as formatTenge, i as Label, l as telLink, n as Button, o as cn, r as Input, s as formatClock, t as BrandLockup, u as waLink } from "./logo-Ba3EM75a.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Phone, c as GraduationCap, i as Shield, l as Clock3, o as Menu, r as Timer, s as MapPin, t as X } from "../_libs/lucide-react.mjs";
import { n as Route$1 } from "./router-CCNnUllu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Cydike-5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LANG_KEY = "ae-lang";
function t(texts, key, lang, fallback = "") {
	const row = texts[key];
	if (!row) return fallback;
	return (lang === "kz" ? row.kz : row.ru) || row.ru || row.kz || fallback;
}
function field(row, lang, ruKey, kzKey) {
	const primary = lang === "kz" ? row[kzKey] : row[ruKey];
	const secondary = lang === "kz" ? row[ruKey] : row[kzKey];
	return String(primary || secondary || "");
}
var Ctx = (0, import_react.createContext)(null);
function LangProvider({ children }) {
	const [lang, setLangState] = (0, import_react.useState)("ru");
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem(LANG_KEY);
		if (stored === "kz" || stored === "ru") setLangState(stored);
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = lang === "kz" ? "kk" : "ru";
	}, [lang]);
	const setLang = (0, import_react.useCallback)((next) => {
		setLangState(next);
		window.localStorage.setItem(LANG_KEY, next);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		lang,
		setLang
	}), [lang, setLang]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value,
		children
	});
}
function useLang() {
	const ctx = (0, import_react.useContext)(Ctx);
	if (!ctx) throw new Error("useLang outside provider");
	return ctx;
}
function Badge({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted", className),
		children
	});
}
var LINKS = [
	{
		href: "#services",
		key: "nav.services"
	},
	{
		href: "#about",
		key: "nav.about"
	},
	{
		href: "#booking",
		key: "nav.booking"
	},
	{
		href: "#contacts",
		key: "nav.contacts"
	}
];
function SiteHeader({ payload }) {
	const { lang, setLang } = useLang();
	const [open, setOpen] = (0, import_react.useState)(false);
	const texts = payload.texts;
	const phone = payload.contacts.phone;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#top",
					className: "shrink-0",
					onClick: () => setOpen(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 md:flex",
					children: LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						className: "rounded-md px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-fg",
						children: t(texts, link.key, lang)
					}, link.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangSwitch, {
							lang,
							setLang
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: telLink(phone),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {}), t(texts, "hero.call", lang)]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-11 items-center justify-center rounded-md text-fg md:hidden",
							"aria-label": open ? "Close" : "Menu",
							onClick: () => setOpen((v) => !v),
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						})
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-surface px-4 py-3 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-col",
				children: LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: link.href,
					className: "flex h-12 items-center text-base text-fg",
					onClick: () => setOpen(false),
					children: t(texts, link.key, lang)
				}, link.href))
			})
		}) : null]
	});
}
function LangSwitch({ lang, setLang }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex rounded-full border border-border p-0.5",
		children: ["ru", "kz"].map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setLang(code),
			className: cn("h-9 min-w-11 rounded-full px-2.5 text-xs font-medium tracking-wide transition-colors duration-150", lang === code ? "bg-primary text-primary-foreground" : "text-muted hover:text-fg"),
			children: code === "ru" ? "RU" : "KZ"
		}, code))
	});
}
function WhatsAppIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": "true",
		fill: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.05 4.91A9.9 9.9 0 0 0 12.04 2C6.55 2 2.08 6.46 2.08 11.96c0 1.75.46 3.46 1.34 4.97L2 22l5.21-1.37a9.9 9.9 0 0 0 4.83 1.23h.01c5.49 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.96-7zM12.05 20.11h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.09.81.82-3.01-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.21-8.25 8.21zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.22-.08-.39-.12-.55.12-.16.25-.63.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29z" })
	});
}
var START_KEY = "ae-visit-start";
function hourBase(hour) {
	if (hour >= 9 && hour < 18) return 16;
	if (hour >= 18 && hour < 22) return 9;
	return 4;
}
function useOnlineCount() {
	const [n, setN] = (0, import_react.useState)(() => hourBase((/* @__PURE__ */ new Date()).getHours()) + 3);
	(0, import_react.useEffect)(() => {
		const boot = hourBase((/* @__PURE__ */ new Date()).getHours()) + Math.floor(Math.random() * 5);
		setN(boot);
		const tick = () => {
			setN((v) => {
				const next = v + (Math.random() < .55 ? 1 : -1);
				const min = hourBase((/* @__PURE__ */ new Date()).getHours());
				return Math.min(min + 14, Math.max(min, next));
			});
		};
		const id = window.setInterval(tick, 3800);
		return () => window.clearInterval(id);
	}, []);
	return n;
}
function useEnrolledCount(base, bookings) {
	const [jitter, setJitter] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			setJitter(Math.floor(Math.random() * 3) - 1);
		}, 7e3);
		return () => window.clearInterval(id);
	}, []);
	return Math.max(0, base + bookings + jitter);
}
function useVisitTimer() {
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const existing = sessionStorage.getItem(START_KEY);
		const start = existing ? Number(existing) : Date.now();
		if (!existing) sessionStorage.setItem(START_KEY, String(start));
		const tick = () => setSeconds(Math.floor((Date.now() - start) / 1e3));
		tick();
		const id = window.setInterval(tick, 1e3);
		return () => window.clearInterval(id);
	}, []);
	return formatClock(seconds);
}
function LiveStat({ label, value, pulse }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-2.5",
		children: [pulse ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative flex size-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-online opacity-60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-online" })]
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-sm tabular-nums tracking-tight text-fg",
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-[10px] uppercase tracking-[0.16em] text-muted",
				children: label
			})]
		})]
	});
}
function BookingForm({ payload, lang }) {
	const texts = payload.texts;
	const queryClient = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)(payload.services.find((s) => s.featured)?.code ?? "B");
	const [preferredDate, setPreferredDate] = (0, import_react.useState)("");
	const [comment, setComment] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const wa = payload.contacts.whatsapp || payload.contacts.phone;
	const prefill = [
		t(texts, "wa.prefill", lang),
		name && (lang === "kz" ? `Аты: ${name}` : `Имя: ${name}`),
		phone && `Tel: ${phone}`,
		category && (lang === "kz" ? `Санат: ${category}` : `Категория: ${category}`),
		preferredDate && (lang === "kz" ? `Күн: ${preferredDate}` : `Дата: ${preferredDate}`)
	].filter(Boolean).join("\n");
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		try {
			await submitBooking({ data: {
				name,
				phone,
				category,
				preferredDate,
				comment
			} });
			setDone(true);
			toast.success(t(texts, "booking.success", lang));
			queryClient.invalidateQueries({ queryKey: ["site"] });
		} catch {
			toast.error(t(texts, "booking.error", lang));
		} finally {
			setPending(false);
		}
	}
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-bg p-6 sm:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl",
			children: t(texts, "booking.success", lang)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			size: "lg",
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: waLink(wa, prefill),
				target: "_blank",
				rel: "noreferrer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "size-4" }), t(texts, "booking.whatsapp", lang)]
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "rounded-xl border border-border bg-bg p-5 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(texts, "booking.name", lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							minLength: 2,
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: t(texts, "booking.name.ph", lang),
							autoComplete: "name"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(texts, "booking.phone", lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							type: "tel",
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: t(texts, "booking.phone.ph", lang),
							autoComplete: "tel"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(texts, "booking.category", lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: "flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
							children: payload.services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: s.code,
								children: [
									s.code,
									" — ",
									lang === "kz" ? s.titleKz : s.titleRu
								]
							}, s.code))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: t(texts, "booking.date", lang),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: preferredDate,
							onChange: (e) => setPreferredDate(e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t(texts, "booking.comment", lang),
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: comment,
					onChange: (e) => setComment(e.target.value),
					placeholder: t(texts, "booking.comment.ph", lang),
					rows: 4
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				className: "mt-6 w-full",
				disabled: pending,
				children: t(texts, "booking.submit", lang)
			})
		]
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: className ? `grid gap-1.5 ${className}` : "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function HomeView({ payload }) {
	const { lang } = useLang();
	const texts = payload.texts;
	const online = useOnlineCount();
	const enrolled = useEnrolledCount(payload.contacts.enrolledBase, payload.bookingCount);
	const timer = useVisitTimer();
	const phone = payload.contacts.phone;
	const wa = payload.contacts.whatsapp || phone;
	const prefill = t(texts, "wa.prefill", lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { payload }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-surface/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-4 py-3 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStat, {
							pulse: true,
							label: t(texts, "ticker.online", lang),
							value: online
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-6 w-px shrink-0 bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStat, {
							label: t(texts, "ticker.authorized", lang),
							value: enrolled
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-6 w-px shrink-0 bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStat, {
							label: t(texts, "ticker.time", lang),
							value: timer
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "asphalt-grid relative overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stagger-in text-xs font-medium uppercase tracking-[0.22em] text-muted",
							style: { animationDelay: "40ms" },
							children: t(texts, "hero.kicker", lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "stagger-in mt-4 max-w-xl text-3xl text-fg",
							style: { animationDelay: "80ms" },
							children: t(texts, "hero.title", lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "stagger-in mt-5 max-w-lg text-base leading-relaxed text-muted",
							style: { animationDelay: "140ms" },
							children: t(texts, "hero.lead", lang)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "stagger-in mt-8 flex flex-col gap-3 sm:flex-row",
							style: { animationDelay: "200ms" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#booking",
									children: t(texts, "hero.cta", lang)
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: telLink(phone),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {}), phone]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trust, {
									label: "5.0",
									value: t(texts, "trust.rating", lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trust, {
									label: "A B C",
									value: t(texts, "trust.categories", lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trust, {
									label: "2",
									value: t(texts, "trust.languages", lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trust, {
									label: "У",
									value: t(texts, "trust.autodrome", lang)
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-2xl border border-border bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/hero.jpg",
								alt: "",
								className: "aspect-video h-full w-full object-cover"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -bottom-4 left-4 right-4 hidden items-center justify-between rounded-xl border border-border bg-elevated/95 px-4 py-3 sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "size-4" }), field(payload.contacts, lang, "hoursRu", "hoursKz")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4" }), "Туркестан"]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "services",
				className: "scroll-mt-20 border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						kicker: t(texts, "services.kicker", lang),
						title: t(texts, "services.title", lang),
						lead: t(texts, "services.lead", lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: payload.services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "flex flex-col rounded-xl border border-border bg-surface p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-xs tracking-[0.2em] text-muted",
										children: s.code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-1 text-lg font-medium",
										children: field(s, lang, "titleRu", "titleKz")
									})] }), s.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "border-primary/30 text-fg",
										children: "курс"
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 flex-1 text-sm leading-relaxed text-muted",
									children: field(s, lang, "descRu", "descKz")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 font-display text-xl tabular-nums tracking-tight",
									children: formatTenge(s.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										t(texts, "services.duration", lang),
										": ",
										field(s, lang, "durationRu", "durationKz")
									] }), s.hours ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										s.hours,
										" ",
										t(texts, "services.hours", lang)
									] }) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "secondary",
									className: "mt-5 w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `#booking`,
										"data-cat": s.code,
										children: t(texts, "services.book", lang)
									})
								})
							]
						}, s.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "about",
				className: "scroll-mt-20 border-t border-border bg-surface/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						kicker: t(texts, "about.kicker", lang),
						title: t(texts, "about.title", lang),
						lead: t(texts, "about.body", lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 space-y-5",
						children: [
							1,
							2,
							3
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-muted",
								children: n === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }) : n === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: t(texts, `about.p${n}.title`, lang)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: t(texts, `about.p${n}.body`, lang)
							})] })]
						}, n))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/autodrome.jpg",
							alt: "",
							className: "h-56 w-full rounded-xl object-cover sm:h-full"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/lesson.jpg",
								alt: "",
								className: "h-40 w-full rounded-xl object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/theory.jpg",
								alt: "",
								className: "h-40 w-full rounded-xl object-cover"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						kicker: t(texts, "steps.kicker", lang),
						title: t(texts, "steps.title", lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							1,
							2,
							3,
							4
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl border border-border bg-surface p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-sm tabular-nums text-muted",
									children: ["0", n]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 text-base font-medium",
									children: t(texts, `steps.${n}.title`, lang)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: t(texts, `steps.${n}.body`, lang)
								})
							]
						}, n))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border bg-surface/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						kicker: t(texts, "team.kicker", lang),
						title: t(texts, "team.title", lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4 sm:grid-cols-3",
						children: payload.instructors.map((person) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-xl border border-border bg-bg p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-12 items-center justify-center rounded-lg border border-border font-display text-sm tracking-wide",
									children: person.initials
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 text-base font-medium",
									children: field(person, lang, "nameRu", "nameKz")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: field(person, lang, "roleRu", "roleKz")
								})
							]
						}, person.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						kicker: t(texts, "reviews.kicker", lang),
						title: t(texts, "reviews.title", lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-4 lg:grid-cols-3",
						children: payload.reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "rounded-xl border border-border bg-surface p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-fg",
								children: field(review, lang, "bodyRu", "bodyKz")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
								className: "mt-4 text-xs uppercase tracking-[0.14em] text-muted",
								children: field(review, lang, "nameRu", "nameKz")
							})]
						}, review.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "booking",
				className: "scroll-mt-20 border-t border-border bg-surface/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						kicker: t(texts, "booking.kicker", lang),
						title: t(texts, "booking.title", lang),
						lead: t(texts, "booking.lead", lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: waLink(wa, prefill),
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "size-4" }), t(texts, "booking.whatsapp", lang)]
							})
						}), payload.contacts.telegram ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: `https://t.me/${payload.contacts.telegram.replace(/^@/, "")}`,
								target: "_blank",
								rel: "noreferrer",
								children: t(texts, "booking.telegram", lang)
							})
						}) : null]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingForm, {
						payload,
						lang
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "contacts",
				className: "scroll-mt-20 border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
						kicker: t(texts, "contacts.kicker", lang),
						title: t(texts, "contacts.title", lang)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-8 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
								label: t(texts, "contacts.phone", lang),
								value: phone,
								href: telLink(phone)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
								label: t(texts, "contacts.address", lang),
								value: field(payload.contacts, lang, "addressRu", "addressKz")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactRow, {
								label: t(texts, "contacts.hours", lang),
								value: field(payload.contacts, lang, "hoursRu", "hoursKz")
							})
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden rounded-xl border border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: t(texts, "contacts.map", lang),
							className: "h-72 w-full grayscale contrast-125 lg:h-full min-h-72",
							loading: "lazy",
							referrerPolicy: "no-referrer-when-downgrade",
							src: `https://www.openstreetmap.org/export/embed.html?bbox=${Number(payload.contacts.lng) - .01}%2C${Number(payload.contacts.lat) - .008}%2C${Number(payload.contacts.lng) + .01}%2C${Number(payload.contacts.lat) + .008}&layer=mapnik&marker=${payload.contacts.lat}%2C${payload.contacts.lng}`
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t(texts, "footer.rights", lang) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/admin",
						className: "text-subtle hover:text-fg",
						children: t(texts, "footer.admin", lang)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: waLink(wa, prefill),
				target: "_blank",
				rel: "noreferrer",
				className: "fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95",
				"aria-label": t(texts, "booking.whatsapp", lang),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "size-7" })
			})
		]
	});
}
function Trust({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "font-display text-lg tracking-tight",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 text-[11px] leading-snug text-muted",
		children: value
	})] });
}
function SectionHead({ kicker, title, lead }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-[0.22em] text-muted",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 text-2xl text-fg",
				children: title
			}),
			lead ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base leading-relaxed text-muted",
				children: lead
			}) : null
		]
	});
}
function ContactRow({ label, value, href }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs uppercase tracking-[0.16em] text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 text-base",
		children: href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href,
			className: "hover:underline",
			children: value
		}) : value
	})] });
}
function Home() {
	const initial = Route$1.useLoaderData();
	const { data } = useQuery({
		queryKey: ["site"],
		queryFn: () => getSitePayload(),
		initialData: initial,
		refetchInterval: 8e3
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, { payload: data }) });
}
//#endregion
export { Home as component };
