import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-Dc5ADZCw.mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-lookup.functions-B_VwtBCR.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
async function callAI(body) {
	const apiKey = process.env.LOVABLE_API_KEY;
	if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");
	const res = await fetch(AI_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`AI gateway ${res.status}: ${text.slice(0, 200)}`);
	}
	return await res.json();
}
/** Tenta identificar o produto pelo EAN usando Gemini (texto). */
var aiLookupByBarcode_createServerFn_handler = createServerRpc({
	id: "2cb5bb5badd91eb59ddf99bcb347efe2a237a2b7de914d1b02a36543c7b7eb1b",
	name: "aiLookupByBarcode",
	filename: "src/lib/ai-lookup.functions.ts"
}, (opts) => aiLookupByBarcode.__executeServer(opts));
var aiLookupByBarcode = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ barcode: stringType().trim().min(4).max(32) }).parse(data)).handler(aiLookupByBarcode_createServerFn_handler, async ({ data }) => {
	try {
		const raw = (await callAI({
			model: "google/gemini-2.5-flash",
			messages: [{
				role: "system",
				content: "Você identifica produtos vendidos no Brasil pelo código de barras (EAN/GTIN). Responda APENAS um JSON no formato {\"name\": string|null}. Se não tiver alta confiança, retorne {\"name\": null}. NUNCA invente nome de produto."
			}, {
				role: "user",
				content: `Qual o nome comercial completo (marca + produto + variante/sabor + peso/volume) do produto com EAN ${data.barcode}? Responda só o JSON.`
			}],
			response_format: { type: "json_object" }
		})).choices?.[0]?.message?.content ?? "{}";
		const parsed = JSON.parse(raw);
		const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
		return { name: name && name.length > 1 ? name : null };
	} catch (err) {
		console.error("[aiLookupByBarcode]", err);
		return { name: null };
	}
});
var aiVisionReadLabel_createServerFn_handler = createServerRpc({
	id: "be51d8903f65e500c2900f8ec3c883be8117f5953b6a3f11382999fa77594b24",
	name: "aiVisionReadLabel",
	filename: "src/lib/ai-lookup.functions.ts"
}, (opts) => aiVisionReadLabel.__executeServer(opts));
var aiVisionReadLabel = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ imageDataUrl: stringType().startsWith("data:image/").max(25e5) }).parse(data)).handler(aiVisionReadLabel_createServerFn_handler, async ({ data }) => {
	try {
		const text = ((await callAI({
			model: "google/gemini-2.5-flash",
			messages: [{
				role: "system",
				content: "Você lê rótulos de embalagens de produtos. Retorne SOMENTE o nome comercial exato visível na embalagem (marca + nome + variante/sabor + peso/volume, quando visíveis). Se a imagem estiver ilegível, cortada ou não for uma embalagem, responda exatamente: ilegível. Não invente informações."
			}, {
				role: "user",
				content: [{
					type: "text",
					text: "Leia o rótulo desta embalagem e retorne só o nome comercial do produto."
				}, {
					type: "image_url",
					image_url: { url: data.imageDataUrl }
				}]
			}]
		})).choices?.[0]?.message?.content ?? "").trim();
		if (!text || /^ileg[íi]vel/i.test(text)) return { name: null };
		return { name: text.split("\n")[0].replace(/^["'`]+|["'`]+$/g, "").trim() || null };
	} catch (err) {
		console.error("[aiVisionReadLabel]", err);
		return { name: null };
	}
});
//#endregion
export { aiLookupByBarcode_createServerFn_handler, aiVisionReadLabel_createServerFn_handler };
