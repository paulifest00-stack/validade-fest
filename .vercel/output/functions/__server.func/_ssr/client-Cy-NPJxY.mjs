import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-Cy-NPJxY.js
function createSupabaseClient() {
	return createClient("https://qhqfnclbghrzgkmmbvui.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocWZuY2xiZ2hyemdrbW1idnVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MTcwNDQsImV4cCI6MjA5NzM5MzA0NH0._iMlZAvhf6A-1VTvHNWTIY_K5tSOT_7IwSZZ6xXdsEw", { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
