//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-LXsWQ0pR.js
var manifest = {
	"2cb5bb5badd91eb59ddf99bcb347efe2a237a2b7de914d1b02a36543c7b7eb1b": {
		functionName: "aiLookupByBarcode_createServerFn_handler",
		importer: () => import("./_ssr/ai-lookup.functions-B_VwtBCR.mjs")
	},
	"be51d8903f65e500c2900f8ec3c883be8117f5953b6a3f11382999fa77594b24": {
		functionName: "aiVisionReadLabel_createServerFn_handler",
		importer: () => import("./_ssr/ai-lookup.functions-B_VwtBCR.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
