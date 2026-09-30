import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as removeBookingFn, c as saveInstructorsFn, d as saveTextsFn, i as listBookingsFn, l as saveReviewsFn, n as adminLogoutFn, o as removeServiceFn, r as getSitePayload, s as saveContactsFn, t as adminLoginFn, u as saveServiceFn } from "./site-api-BsASl74t.mjs";
import { a as Textarea, i as Label, n as Button, o as cn, r as Input, t as BrandLockup, u as waLink } from "./logo-Ba3EM75a.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-SQ5eQWsp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOKEN_KEY = "ae-admin-token";
function AdminApp() {
	const [token, setToken] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setToken(sessionStorage.getItem(TOKEN_KEY));
		setReady(true);
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-bg" });
	if (!token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Login, { onToken: (t) => {
		sessionStorage.setItem(TOKEN_KEY, t);
		setToken(t);
	} });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		token,
		onLogout: () => {
			sessionStorage.removeItem(TOKEN_KEY);
			adminLogoutFn({ data: { token } });
			setToken(null);
		}
	});
}
function Login({ onToken }) {
	const [password, setPassword] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function onSubmit(e) {
		e.preventDefault();
		setPending(true);
		setError("");
		try {
			onToken((await adminLoginFn({ data: { password } })).token);
		} catch {
			setError("Неверный пароль");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg px-4 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "w-full max-w-sm rounded-xl border border-border bg-surface p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-display text-xl",
					children: "Кабинет школы"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Пароль, чтобы править тексты, цены и заявки."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-6 grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Пароль" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						autoComplete: "current-password",
						required: true
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-danger",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-5 w-full",
					disabled: pending,
					children: "Войти"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-4 block text-center text-sm text-muted hover:text-fg",
					children: "На сайт"
				})
			]
		})
	});
}
function AdminShell({ token, onLogout }) {
	const queryClient = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("texts");
	const site = useQuery({
		queryKey: ["site"],
		queryFn: () => getSitePayload()
	});
	const bookings = useQuery({
		queryKey: ["bookings", token],
		queryFn: () => listBookingsFn({ data: { token } }),
		refetchInterval: 6e3
	});
	const payload = site.data;
	if (site.isLoading || !payload) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg text-muted",
		children: "Загрузка…"
	});
	const tabs = [
		{
			id: "texts",
			label: "Тексты"
		},
		{
			id: "services",
			label: "Цены"
		},
		{
			id: "contacts",
			label: "Контакты"
		},
		{
			id: "team",
			label: "Команда"
		},
		{
			id: "bookings",
			label: `Заявки (${bookings.data?.length ?? 0})`
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Сайт"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: onLogout,
						children: "Выйти"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3",
				children: tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(item.id),
					className: cn("h-10 shrink-0 rounded-full px-4 text-sm", tab === item.id ? "bg-primary text-primary-foreground" : "text-muted hover:text-fg"),
					children: item.label
				}, item.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [
				tab === "texts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextsEditor, {
					payload,
					token,
					onSaved: () => queryClient.invalidateQueries({ queryKey: ["site"] })
				}, Object.keys(payload.texts).length) : null,
				tab === "services" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicesEditor, {
					payload,
					token,
					onSaved: () => queryClient.invalidateQueries({ queryKey: ["site"] })
				}, payload.services.map((s) => s.id).join("-")) : null,
				tab === "contacts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactsEditor, {
					payload,
					token,
					onSaved: () => queryClient.invalidateQueries({ queryKey: ["site"] })
				}, payload.contacts.phone) : null,
				tab === "team" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamEditor, {
					payload,
					token,
					onSaved: () => queryClient.invalidateQueries({ queryKey: ["site"] })
				}, payload.instructors.map((i) => i.id).join("-")) : null,
				tab === "bookings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingsList, {
					token,
					items: bookings.data ?? [],
					onChanged: () => queryClient.invalidateQueries({ queryKey: ["bookings"] })
				}) : null
			]
		})]
	});
}
var TEXT_GROUPS = [
	{
		title: "Шапка и герой",
		keys: [
			"meta.title",
			"meta.description",
			"nav.services",
			"nav.about",
			"nav.booking",
			"nav.contacts",
			"ticker.online",
			"ticker.authorized",
			"ticker.time",
			"hero.kicker",
			"hero.title",
			"hero.lead",
			"hero.cta",
			"hero.call"
		]
	},
	{
		title: "Услуги и о школе",
		keys: [
			"services.kicker",
			"services.title",
			"services.lead",
			"about.kicker",
			"about.title",
			"about.body",
			"about.p1.title",
			"about.p1.body",
			"about.p2.title",
			"about.p2.body",
			"about.p3.title",
			"about.p3.body"
		]
	},
	{
		title: "Шаги, запись, подвал",
		keys: [
			"steps.kicker",
			"steps.title",
			"steps.1.title",
			"steps.1.body",
			"steps.2.title",
			"steps.2.body",
			"steps.3.title",
			"steps.3.body",
			"steps.4.title",
			"steps.4.body",
			"booking.kicker",
			"booking.title",
			"booking.lead",
			"booking.submit",
			"booking.success",
			"contacts.kicker",
			"contacts.title",
			"footer.rights"
		]
	}
];
function TextsEditor({ payload, token, onSaved }) {
	const [draft, setDraft] = (0, import_react.useState)(payload.texts);
	const [pending, setPending] = (0, import_react.useState)(false);
	const items = (0, import_react.useMemo)(() => Object.entries(draft).map(([key, v]) => ({
		key,
		ru: v.ru,
		kz: v.kz
	})), [draft]);
	async function save() {
		setPending(true);
		try {
			await saveTextsFn({ data: {
				token,
				items
			} });
			toast.success("Тексты сохранены — сайт обновится сразу");
			onSaved();
		} catch {
			toast.error("Не удалось сохранить");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Тексты RU / KZ"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => void save(),
			disabled: pending,
			children: "Сохранить"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8 space-y-10",
		children: TEXT_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm uppercase tracking-[0.16em] text-muted",
			children: group.title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-4",
			children: group.keys.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 font-mono text-xs text-subtle",
					children: key
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "RU" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: draft[key]?.ru ?? "",
							onChange: (e) => setDraft((d) => ({
								...d,
								[key]: {
									ru: e.target.value,
									kz: d[key]?.kz ?? ""
								}
							}))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "KZ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: draft[key]?.kz ?? "",
							onChange: (e) => setDraft((d) => ({
								...d,
								[key]: {
									ru: d[key]?.ru ?? "",
									kz: e.target.value
								}
							}))
						})]
					})]
				})]
			}, key))
		})] }, group.title))
	})] });
}
function ServicesEditor({ payload, token, onSaved }) {
	const [rows, setRows] = (0, import_react.useState)(payload.services);
	function patch(id, next) {
		setRows((list) => list.map((s) => s.id === id ? {
			...s,
			...next
		} : s));
	}
	async function saveOne(s) {
		try {
			await saveServiceFn({ data: {
				token,
				service: {
					id: s.id,
					code: s.code,
					titleRu: s.titleRu,
					titleKz: s.titleKz,
					descRu: s.descRu,
					descKz: s.descKz,
					price: Number(s.price),
					durationRu: s.durationRu,
					durationKz: s.durationKz,
					hours: s.hours,
					featured: s.featured,
					sortOrder: s.sortOrder
				}
			} });
			toast.success(`Категория ${s.code} сохранена`);
			onSaved();
		} catch {
			toast.error("Ошибка сохранения");
		}
	}
	async function addNew() {
		try {
			await saveServiceFn({ data: {
				token,
				service: {
					code: "D",
					titleRu: "Новая категория",
					titleKz: "Жаңа санат",
					descRu: "",
					descKz: "",
					price: 0,
					durationRu: "",
					durationKz: "",
					hours: 10,
					featured: false,
					sortOrder: 90
				}
			} });
			toast.success("Категория добавлена");
			onSaved();
		} catch {
			toast.error("Не удалось добавить");
		}
	}
	async function remove(id) {
		try {
			await removeServiceFn({ data: {
				token,
				id
			} });
			toast.success("Удалено");
			onSaved();
		} catch {
			toast.error("Не удалось удалить");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Цены и категории"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => void addNew(),
			children: "Добавить"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 space-y-4",
		children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-surface p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Код",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.code,
								onChange: (e) => patch(s.id, { code: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Цена, ₸",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: s.price,
								onChange: (e) => patch(s.id, { price: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Часы",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: s.hours ?? 0,
								onChange: (e) => patch(s.id, { hours: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Порядок",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: s.sortOrder,
								onChange: (e) => patch(s.id, { sortOrder: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Название RU",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.titleRu,
								onChange: (e) => patch(s.id, { titleRu: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Название KZ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.titleKz,
								onChange: (e) => patch(s.id, { titleKz: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Срок RU",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.durationRu,
								onChange: (e) => patch(s.id, { durationRu: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Срок KZ",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: s.durationKz,
								onChange: (e) => patch(s.id, { durationKz: e.target.value })
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Описание RU",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: s.descRu,
							onChange: (e) => patch(s.id, { descRu: e.target.value })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Описание KZ",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 2,
							value: s.descKz,
							onChange: (e) => patch(s.id, { descKz: e.target.value })
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: s.featured,
							onChange: (e) => patch(s.id, { featured: e.target.checked })
						}), "Популярный пакет"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => void remove(s.id),
							children: "Удалить"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => void saveOne(s),
							children: "Сохранить"
						})]
					})]
				})
			]
		}, s.id))
	})] });
}
function ContactsEditor({ payload, token, onSaved }) {
	const [c, setC] = (0, import_react.useState)(payload.contacts);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function save() {
		setPending(true);
		try {
			await saveContactsFn({ data: {
				token,
				contacts: {
					...c,
					enrolledBase: Number(c.enrolledBase)
				}
			} });
			toast.success("Контакты обновлены");
			onSaved();
		} catch {
			toast.error("Ошибка");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Контакты"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => void save(),
			disabled: pending,
			children: "Сохранить"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-3 sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Телефон",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.phone,
					onChange: (e) => setC({
						...c,
						phone: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "WhatsApp",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.whatsapp,
					onChange: (e) => setC({
						...c,
						whatsapp: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Telegram (@username)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.telegram,
					onChange: (e) => setC({
						...c,
						telegram: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Instagram",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.instagram,
					onChange: (e) => setC({
						...c,
						instagram: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Адрес RU",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.addressRu,
					onChange: (e) => setC({
						...c,
						addressRu: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Адрес KZ",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.addressKz,
					onChange: (e) => setC({
						...c,
						addressKz: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Часы RU",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.hoursRu,
					onChange: (e) => setC({
						...c,
						hoursRu: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Часы KZ",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.hoursKz,
					onChange: (e) => setC({
						...c,
						hoursKz: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Широта",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.lat,
					onChange: (e) => setC({
						...c,
						lat: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Долгота",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.lng,
					onChange: (e) => setC({
						...c,
						lng: e.target.value
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "База учеников (счётчик)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: c.enrolledBase,
					onChange: (e) => setC({
						...c,
						enrolledBase: Number(e.target.value)
					})
				})
			})
		]
	})] });
}
function TeamEditor({ payload, token, onSaved }) {
	const [instructors, setInstructors] = (0, import_react.useState)(payload.instructors);
	const [reviews, setReviews] = (0, import_react.useState)(payload.reviews);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Инструкторы"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: async () => {
					try {
						await saveInstructorsFn({ data: {
							token,
							items: instructors
						} });
						toast.success("Сохранено");
						onSaved();
					} catch {
						toast.error("Ошибка");
					}
				},
				children: "Сохранить"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-3",
			children: instructors.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Инициалы",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: p.initials,
							onChange: (e) => setInstructors((list) => list.map((x, i) => i === idx ? {
								...x,
								initials: e.target.value
							} : x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Имя RU",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: p.nameRu,
							onChange: (e) => setInstructors((list) => list.map((x, i) => i === idx ? {
								...x,
								nameRu: e.target.value
							} : x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Имя KZ",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: p.nameKz,
							onChange: (e) => setInstructors((list) => list.map((x, i) => i === idx ? {
								...x,
								nameKz: e.target.value
							} : x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Роль RU",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: p.roleRu,
							onChange: (e) => setInstructors((list) => list.map((x, i) => i === idx ? {
								...x,
								roleRu: e.target.value
							} : x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Роль KZ",
						className: "sm:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: p.roleKz,
							onChange: (e) => setInstructors((list) => list.map((x, i) => i === idx ? {
								...x,
								roleKz: e.target.value
							} : x))
						})
					})
				]
			}, p.id))
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Отзывы"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: async () => {
					try {
						await saveReviewsFn({ data: {
							token,
							items: reviews
						} });
						toast.success("Отзывы сохранены");
						onSaved();
					} catch {
						toast.error("Ошибка");
					}
				},
				children: "Сохранить"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-3",
			children: reviews.map((r, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 rounded-lg border border-border bg-surface p-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Имя RU",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: r.nameRu,
							onChange: (e) => setReviews((list) => list.map((x, i) => i === idx ? {
								...x,
								nameRu: e.target.value
							} : x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Имя KZ",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: r.nameKz,
							onChange: (e) => setReviews((list) => list.map((x, i) => i === idx ? {
								...x,
								nameKz: e.target.value
							} : x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Текст RU",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: r.bodyRu,
							onChange: (e) => setReviews((list) => list.map((x, i) => i === idx ? {
								...x,
								bodyRu: e.target.value
							} : x))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Текст KZ",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							rows: 3,
							value: r.bodyKz,
							onChange: (e) => setReviews((list) => list.map((x, i) => i === idx ? {
								...x,
								bodyKz: e.target.value
							} : x))
						})
					})
				]
			}, r.id))
		})] })]
	});
}
function BookingsList({ token, items, onChanged }) {
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Заявок пока нет. Они появятся после формы на сайте."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Заявки"
		}), items.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl border border-border bg-surface p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: b.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `tel:${b.phone}`,
						className: "text-sm text-muted hover:text-fg",
						children: b.phone
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-sm",
						children: b.category
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [b.preferredDate ? `Дата: ${b.preferredDate}` : "Дата не указана", b.comment ? ` · ${b.comment}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: waLink(b.phone, `Здравствуйте, ${b.name}! Авто-Эмир.`),
							target: "_blank",
							rel: "noreferrer",
							children: "WhatsApp"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: async () => {
							await removeBookingFn({ data: {
								token,
								id: b.id
							} });
							onChanged();
						},
						children: "Убрать"
					})]
				})
			]
		}, b.id))]
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("grid gap-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
function AdminPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminApp, {});
}
//#endregion
export { AdminPage as component };
