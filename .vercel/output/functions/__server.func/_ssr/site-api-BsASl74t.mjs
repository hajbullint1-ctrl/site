import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as boolean, o as string, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-api-BsASl74t.js
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
var getSitePayload = createServerFn({ method: "GET" }).handler(createSsrRpc("2b911563d1e75fdb3bb52d4b9c929e63be0cea0af6f38d591572f0d3b98a8b8e"));
var submitBooking = createServerFn({ method: "POST" }).validator(object({
	name: string().trim().min(2).max(80),
	phone: string().trim().min(10).max(24),
	category: string().trim().min(1).max(8),
	preferredDate: string().trim().max(32).optional(),
	comment: string().trim().max(500).optional()
})).handler(createSsrRpc("bac99c2f77d5a1802d1b9a8428405002bd23b59d65fdfe19d16a18ba94cbab7a"));
var adminLoginFn = createServerFn({ method: "POST" }).validator(object({ password: string().min(1).max(80) })).handler(createSsrRpc("2974eb6be5237db94721b37bfa530a6a4b2177b82708f74999ebcaad6be75e1b"));
var adminLogoutFn = createServerFn({ method: "POST" }).validator(object({ token: string() })).handler(createSsrRpc("dc7b4d53e4772df041d0ecbac67dad9c8a41bfc03aa44bd173ecc35d320a34a2"));
var saveTextsFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	items: array(object({
		key: string().min(1).max(80),
		ru: string().max(4e3),
		kz: string().max(4e3)
	}))
})).handler(createSsrRpc("2b3bea6c0ba9f12fba877ade057167e23cccce081d68047d7582255739824970"));
var saveContactsFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	contacts: object({
		phone: string().max(40),
		whatsapp: string().max(40),
		telegram: string().max(80),
		addressRu: string().max(240),
		addressKz: string().max(240),
		hoursRu: string().max(80),
		hoursKz: string().max(80),
		instagram: string().max(80),
		lat: string().max(24),
		lng: string().max(24),
		enrolledBase: number().int().min(0).max(1e5)
	})
})).handler(createSsrRpc("b5fd9eb0a11812b776e373286f59ea4c43bff6be130331e9587e492765dca487"));
var saveServiceFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	service: object({
		id: number().int().optional(),
		code: string().min(1).max(8),
		titleRu: string().min(1).max(80),
		titleKz: string().min(1).max(80),
		descRu: string().max(400),
		descKz: string().max(400),
		price: number().int().min(0).max(1e7),
		durationRu: string().max(40),
		durationKz: string().max(40),
		hours: number().int().min(0).max(200).nullable(),
		featured: boolean(),
		sortOrder: number().int()
	})
})).handler(createSsrRpc("47317282c95657807c2b1b2ca10a6484744aa12f69be3b0a1934917ea146f4fe"));
var removeServiceFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	id: number().int()
})).handler(createSsrRpc("1579260b445db440a7bc22fa87ea2cedee2600fd56422d2e1cda7ca9e9d4dd83"));
var listBookingsFn = createServerFn({ method: "POST" }).validator(object({ token: string().min(8) })).handler(createSsrRpc("b77d74b77707d725fbb876e2dfd79133fb10b0f7f1281ac1effd8008c13678a5"));
var removeBookingFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	id: number().int()
})).handler(createSsrRpc("dee5c9843b7898c335d89d66208bc9656e5b0ceb88734399c8aea89a2fd82e28"));
var saveInstructorsFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	items: array(object({
		id: number().int(),
		initials: string().max(4),
		nameRu: string().max(80),
		nameKz: string().max(80),
		roleRu: string().max(120),
		roleKz: string().max(120),
		sortOrder: number().int()
	}))
})).handler(createSsrRpc("b1e41efa12355682dddd80c8faf601c773ee0d72d6a68a17c34ac784b7eb1f08"));
var saveReviewsFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	items: array(object({
		id: number().int(),
		nameRu: string().max(80),
		nameKz: string().max(80),
		bodyRu: string().max(800),
		bodyKz: string().max(800),
		rating: number().int().min(1).max(5),
		sortOrder: number().int()
	}))
})).handler(createSsrRpc("3b1624b8958b05939756e2ae720af8f83ec6183de7320d9c68ba872aabfa2ab8"));
//#endregion
export { removeBookingFn as a, saveInstructorsFn as c, saveTextsFn as d, submitBooking as f, listBookingsFn as i, saveReviewsFn as l, adminLogoutFn as n, removeServiceFn as o, getSitePayload as r, saveContactsFn as s, adminLoginFn as t, saveServiceFn as u };
