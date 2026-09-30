import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as boolean, o as string, t as array } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-api-BXYopQ6i.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getSitePayload_createServerFn_handler = createServerRpc({
	id: "2b911563d1e75fdb3bb52d4b9c929e63be0cea0af6f38d591572f0d3b98a8b8e",
	name: "getSitePayload",
	filename: "src/lib/site-api.ts"
}, (opts) => getSitePayload.__executeServer(opts));
var getSitePayload = createServerFn({ method: "GET" }).handler(getSitePayload_createServerFn_handler, async () => {
	const { loadSite } = await import("./site.server-DYS-IUCi.mjs");
	return loadSite();
});
var submitBooking_createServerFn_handler = createServerRpc({
	id: "bac99c2f77d5a1802d1b9a8428405002bd23b59d65fdfe19d16a18ba94cbab7a",
	name: "submitBooking",
	filename: "src/lib/site-api.ts"
}, (opts) => submitBooking.__executeServer(opts));
var submitBooking = createServerFn({ method: "POST" }).validator(object({
	name: string().trim().min(2).max(80),
	phone: string().trim().min(10).max(24),
	category: string().trim().min(1).max(8),
	preferredDate: string().trim().max(32).optional(),
	comment: string().trim().max(500).optional()
})).handler(submitBooking_createServerFn_handler, async ({ data }) => {
	const { createBooking } = await import("./site.server-DYS-IUCi.mjs");
	return createBooking({
		name: data.name,
		phone: data.phone,
		category: data.category,
		preferredDate: data.preferredDate ?? "",
		comment: data.comment ?? ""
	});
});
var adminLoginFn_createServerFn_handler = createServerRpc({
	id: "2974eb6be5237db94721b37bfa530a6a4b2177b82708f74999ebcaad6be75e1b",
	name: "adminLoginFn",
	filename: "src/lib/site-api.ts"
}, (opts) => adminLoginFn.__executeServer(opts));
var adminLoginFn = createServerFn({ method: "POST" }).validator(object({ password: string().min(1).max(80) })).handler(adminLoginFn_createServerFn_handler, async ({ data }) => {
	const { adminLogin } = await import("./site.server-DYS-IUCi.mjs");
	return adminLogin(data.password);
});
var adminLogoutFn_createServerFn_handler = createServerRpc({
	id: "dc7b4d53e4772df041d0ecbac67dad9c8a41bfc03aa44bd173ecc35d320a34a2",
	name: "adminLogoutFn",
	filename: "src/lib/site-api.ts"
}, (opts) => adminLogoutFn.__executeServer(opts));
var adminLogoutFn = createServerFn({ method: "POST" }).validator(object({ token: string() })).handler(adminLogoutFn_createServerFn_handler, async ({ data }) => {
	const { adminLogout } = await import("./site.server-DYS-IUCi.mjs");
	await adminLogout(data.token);
	return { ok: true };
});
var saveTextsFn_createServerFn_handler = createServerRpc({
	id: "2b3bea6c0ba9f12fba877ade057167e23cccce081d68047d7582255739824970",
	name: "saveTextsFn",
	filename: "src/lib/site-api.ts"
}, (opts) => saveTextsFn.__executeServer(opts));
var saveTextsFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	items: array(object({
		key: string().min(1).max(80),
		ru: string().max(4e3),
		kz: string().max(4e3)
	}))
})).handler(saveTextsFn_createServerFn_handler, async ({ data }) => {
	const { saveTexts } = await import("./site.server-DYS-IUCi.mjs");
	await saveTexts(data.token, data.items);
	return { ok: true };
});
var saveContactsFn_createServerFn_handler = createServerRpc({
	id: "b5fd9eb0a11812b776e373286f59ea4c43bff6be130331e9587e492765dca487",
	name: "saveContactsFn",
	filename: "src/lib/site-api.ts"
}, (opts) => saveContactsFn.__executeServer(opts));
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
})).handler(saveContactsFn_createServerFn_handler, async ({ data }) => {
	const { saveContacts } = await import("./site.server-DYS-IUCi.mjs");
	await saveContacts(data.token, data.contacts);
	return { ok: true };
});
var saveServiceFn_createServerFn_handler = createServerRpc({
	id: "47317282c95657807c2b1b2ca10a6484744aa12f69be3b0a1934917ea146f4fe",
	name: "saveServiceFn",
	filename: "src/lib/site-api.ts"
}, (opts) => saveServiceFn.__executeServer(opts));
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
})).handler(saveServiceFn_createServerFn_handler, async ({ data }) => {
	const { saveService } = await import("./site.server-DYS-IUCi.mjs");
	return saveService(data.token, data.service);
});
var removeServiceFn_createServerFn_handler = createServerRpc({
	id: "1579260b445db440a7bc22fa87ea2cedee2600fd56422d2e1cda7ca9e9d4dd83",
	name: "removeServiceFn",
	filename: "src/lib/site-api.ts"
}, (opts) => removeServiceFn.__executeServer(opts));
var removeServiceFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	id: number().int()
})).handler(removeServiceFn_createServerFn_handler, async ({ data }) => {
	const { removeService } = await import("./site.server-DYS-IUCi.mjs");
	await removeService(data.token, data.id);
	return { ok: true };
});
var listBookingsFn_createServerFn_handler = createServerRpc({
	id: "b77d74b77707d725fbb876e2dfd79133fb10b0f7f1281ac1effd8008c13678a5",
	name: "listBookingsFn",
	filename: "src/lib/site-api.ts"
}, (opts) => listBookingsFn.__executeServer(opts));
var listBookingsFn = createServerFn({ method: "POST" }).validator(object({ token: string().min(8) })).handler(listBookingsFn_createServerFn_handler, async ({ data }) => {
	const { listBookings } = await import("./site.server-DYS-IUCi.mjs");
	return listBookings(data.token);
});
var removeBookingFn_createServerFn_handler = createServerRpc({
	id: "dee5c9843b7898c335d89d66208bc9656e5b0ceb88734399c8aea89a2fd82e28",
	name: "removeBookingFn",
	filename: "src/lib/site-api.ts"
}, (opts) => removeBookingFn.__executeServer(opts));
var removeBookingFn = createServerFn({ method: "POST" }).validator(object({
	token: string().min(8),
	id: number().int()
})).handler(removeBookingFn_createServerFn_handler, async ({ data }) => {
	const { removeBooking } = await import("./site.server-DYS-IUCi.mjs");
	await removeBooking(data.token, data.id);
	return { ok: true };
});
var saveInstructorsFn_createServerFn_handler = createServerRpc({
	id: "b1e41efa12355682dddd80c8faf601c773ee0d72d6a68a17c34ac784b7eb1f08",
	name: "saveInstructorsFn",
	filename: "src/lib/site-api.ts"
}, (opts) => saveInstructorsFn.__executeServer(opts));
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
})).handler(saveInstructorsFn_createServerFn_handler, async ({ data }) => {
	const { saveInstructors } = await import("./site.server-DYS-IUCi.mjs");
	await saveInstructors(data.token, data.items);
	return { ok: true };
});
var saveReviewsFn_createServerFn_handler = createServerRpc({
	id: "3b1624b8958b05939756e2ae720af8f83ec6183de7320d9c68ba872aabfa2ab8",
	name: "saveReviewsFn",
	filename: "src/lib/site-api.ts"
}, (opts) => saveReviewsFn.__executeServer(opts));
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
})).handler(saveReviewsFn_createServerFn_handler, async ({ data }) => {
	const { saveReviews } = await import("./site.server-DYS-IUCi.mjs");
	await saveReviews(data.token, data.items);
	return { ok: true };
});
//#endregion
export { adminLoginFn_createServerFn_handler, adminLogoutFn_createServerFn_handler, getSitePayload_createServerFn_handler, listBookingsFn_createServerFn_handler, removeBookingFn_createServerFn_handler, removeServiceFn_createServerFn_handler, saveContactsFn_createServerFn_handler, saveInstructorsFn_createServerFn_handler, saveReviewsFn_createServerFn_handler, saveServiceFn_createServerFn_handler, saveTextsFn_createServerFn_handler, submitBooking_createServerFn_handler };
