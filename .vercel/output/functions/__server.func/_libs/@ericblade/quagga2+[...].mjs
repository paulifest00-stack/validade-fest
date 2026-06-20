import { i as __require, t as __commonJSMin } from "../../_runtime.mjs";
//#region node_modules/.pnpm/iota-array@1.0.0/node_modules/iota-array/iota.js
var require_iota = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function iota(n) {
		var result = new Array(n);
		for (var i = 0; i < n; ++i) result[i] = i;
		return result;
	}
	module.exports = iota;
}));
//#endregion
//#region node_modules/.pnpm/is-buffer@1.1.6/node_modules/is-buffer/index.js
var require_is_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* Determine if an object is a Buffer
	*
	* @author   Feross Aboukhadijeh <https://feross.org>
	* @license  MIT
	*/
	module.exports = function(obj) {
		return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
	};
	function isBuffer(obj) {
		return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
	}
	function isSlowBuffer(obj) {
		return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
	}
}));
//#endregion
//#region node_modules/.pnpm/ndarray@1.0.19/node_modules/ndarray/ndarray.js
var require_ndarray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var iota = require_iota();
	var isBuffer = require_is_buffer();
	var hasTypedArrays = typeof Float64Array !== "undefined";
	function compare1st(a, b) {
		return a[0] - b[0];
	}
	function order() {
		var stride = this.stride;
		var terms = new Array(stride.length);
		var i;
		for (i = 0; i < terms.length; ++i) terms[i] = [Math.abs(stride[i]), i];
		terms.sort(compare1st);
		var result = new Array(terms.length);
		for (i = 0; i < result.length; ++i) result[i] = terms[i][1];
		return result;
	}
	function compileConstructor(dtype, dimension) {
		var className = [
			"View",
			dimension,
			"d",
			dtype
		].join("");
		if (dimension < 0) className = "View_Nil" + dtype;
		var useGetters = dtype === "generic";
		if (dimension === -1) {
			var code = "function " + className + "(a){this.data=a;};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return -1};proto.size=0;proto.dimension=-1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function(){return new " + className + "(this.data);};proto.get=proto.set=function(){};proto.pick=function(){return null};return function construct_" + className + "(a){return new " + className + "(a);}";
			var procedure = new Function(code);
			return procedure();
		} else if (dimension === 0) {
			var code = "function " + className + "(a,d) {this.data = a;this.offset = d};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return this.offset};proto.dimension=0;proto.size=1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function " + className + "_copy() {return new " + className + "(this.data,this.offset)};proto.pick=function " + className + "_pick(){return TrivialArray(this.data);};proto.valueOf=proto.get=function " + className + "_get(){return " + (useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]") + "};proto.set=function " + className + "_set(v){return " + (useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v") + "};return function construct_" + className + "(a,b,c,d){return new " + className + "(a,d)}";
			var procedure = new Function("TrivialArray", code);
			return procedure(CACHED_CONSTRUCTORS[dtype][0]);
		}
		var code = ["'use strict'"];
		var indices = iota(dimension);
		var args = indices.map(function(i) {
			return "i" + i;
		});
		var index_str = "this.offset+" + indices.map(function(i) {
			return "this.stride[" + i + "]*i" + i;
		}).join("+");
		var shapeArg = indices.map(function(i) {
			return "b" + i;
		}).join(",");
		var strideArg = indices.map(function(i) {
			return "c" + i;
		}).join(",");
		code.push("function " + className + "(a," + shapeArg + "," + strideArg + ",d){this.data=a", "this.shape=[" + shapeArg + "]", "this.stride=[" + strideArg + "]", "this.offset=d|0}", "var proto=" + className + ".prototype", "proto.dtype='" + dtype + "'", "proto.dimension=" + dimension);
		code.push("Object.defineProperty(proto,'size',{get:function " + className + "_size(){return " + indices.map(function(i) {
			return "this.shape[" + i + "]";
		}).join("*"), "}})");
		if (dimension === 1) code.push("proto.order=[0]");
		else {
			code.push("Object.defineProperty(proto,'order',{get:");
			if (dimension < 4) {
				code.push("function " + className + "_order(){");
				if (dimension === 2) code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})");
				else if (dimension === 3) code.push("var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);if(s0>s1){if(s1>s2){return [2,1,0];}else if(s0>s2){return [1,2,0];}else{return [1,0,2];}}else if(s0>s2){return [2,0,1];}else if(s2>s1){return [0,1,2];}else{return [0,2,1];}}})");
			} else code.push("ORDER})");
		}
		code.push("proto.set=function " + className + "_set(" + args.join(",") + ",v){");
		if (useGetters) code.push("return this.data.set(" + index_str + ",v)}");
		else code.push("return this.data[" + index_str + "]=v}");
		code.push("proto.get=function " + className + "_get(" + args.join(",") + "){");
		if (useGetters) code.push("return this.data.get(" + index_str + ")}");
		else code.push("return this.data[" + index_str + "]}");
		code.push("proto.index=function " + className + "_index(", args.join(), "){return " + index_str + "}");
		code.push("proto.hi=function " + className + "_hi(" + args.join(",") + "){return new " + className + "(this.data," + indices.map(function(i) {
			return [
				"(typeof i",
				i,
				"!=='number'||i",
				i,
				"<0)?this.shape[",
				i,
				"]:i",
				i,
				"|0"
			].join("");
		}).join(",") + "," + indices.map(function(i) {
			return "this.stride[" + i + "]";
		}).join(",") + ",this.offset)}");
		var a_vars = indices.map(function(i) {
			return "a" + i + "=this.shape[" + i + "]";
		});
		var c_vars = indices.map(function(i) {
			return "c" + i + "=this.stride[" + i + "]";
		});
		code.push("proto.lo=function " + className + "_lo(" + args.join(",") + "){var b=this.offset,d=0," + a_vars.join(",") + "," + c_vars.join(","));
		for (var i = 0; i < dimension; ++i) code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){d=i" + i + "|0;b+=c" + i + "*d;a" + i + "-=d}");
		code.push("return new " + className + "(this.data," + indices.map(function(i) {
			return "a" + i;
		}).join(",") + "," + indices.map(function(i) {
			return "c" + i;
		}).join(",") + ",b)}");
		code.push("proto.step=function " + className + "_step(" + args.join(",") + "){var " + indices.map(function(i) {
			return "a" + i + "=this.shape[" + i + "]";
		}).join(",") + "," + indices.map(function(i) {
			return "b" + i + "=this.stride[" + i + "]";
		}).join(",") + ",c=this.offset,d=0,ceil=Math.ceil");
		for (var i = 0; i < dimension; ++i) code.push("if(typeof i" + i + "==='number'){d=i" + i + "|0;if(d<0){c+=b" + i + "*(a" + i + "-1);a" + i + "=ceil(-a" + i + "/d)}else{a" + i + "=ceil(a" + i + "/d)}b" + i + "*=d}");
		code.push("return new " + className + "(this.data," + indices.map(function(i) {
			return "a" + i;
		}).join(",") + "," + indices.map(function(i) {
			return "b" + i;
		}).join(",") + ",c)}");
		var tShape = new Array(dimension);
		var tStride = new Array(dimension);
		for (var i = 0; i < dimension; ++i) {
			tShape[i] = "a[i" + i + "]";
			tStride[i] = "b[i" + i + "]";
		}
		code.push("proto.transpose=function " + className + "_transpose(" + args + "){" + args.map(function(n, idx) {
			return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)";
		}).join(";"), "var a=this.shape,b=this.stride;return new " + className + "(this.data," + tShape.join(",") + "," + tStride.join(",") + ",this.offset)}");
		code.push("proto.pick=function " + className + "_pick(" + args + "){var a=[],b=[],c=this.offset");
		for (var i = 0; i < dimension; ++i) code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){c=(c+this.stride[" + i + "]*i" + i + ")|0}else{a.push(this.shape[" + i + "]);b.push(this.stride[" + i + "])}");
		code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}");
		code.push("return function construct_" + className + "(data,shape,stride,offset){return new " + className + "(data," + indices.map(function(i) {
			return "shape[" + i + "]";
		}).join(",") + "," + indices.map(function(i) {
			return "stride[" + i + "]";
		}).join(",") + ",offset)}");
		var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"));
		return procedure(CACHED_CONSTRUCTORS[dtype], order);
	}
	function arrayDType(data) {
		if (isBuffer(data)) return "buffer";
		if (hasTypedArrays) switch (Object.prototype.toString.call(data)) {
			case "[object Float64Array]": return "float64";
			case "[object Float32Array]": return "float32";
			case "[object Int8Array]": return "int8";
			case "[object Int16Array]": return "int16";
			case "[object Int32Array]": return "int32";
			case "[object Uint8Array]": return "uint8";
			case "[object Uint16Array]": return "uint16";
			case "[object Uint32Array]": return "uint32";
			case "[object Uint8ClampedArray]": return "uint8_clamped";
			case "[object BigInt64Array]": return "bigint64";
			case "[object BigUint64Array]": return "biguint64";
		}
		if (Array.isArray(data)) return "array";
		return "generic";
	}
	var CACHED_CONSTRUCTORS = {
		"float32": [],
		"float64": [],
		"int8": [],
		"int16": [],
		"int32": [],
		"uint8": [],
		"uint16": [],
		"uint32": [],
		"array": [],
		"uint8_clamped": [],
		"bigint64": [],
		"biguint64": [],
		"buffer": [],
		"generic": []
	};
	function wrappedNDArrayCtor(data, shape, stride, offset) {
		if (data === void 0) {
			var ctor = CACHED_CONSTRUCTORS.array[0];
			return ctor([]);
		} else if (typeof data === "number") data = [data];
		if (shape === void 0) shape = [data.length];
		var d = shape.length;
		if (stride === void 0) {
			stride = new Array(d);
			for (var i = d - 1, sz = 1; i >= 0; --i) {
				stride[i] = sz;
				sz *= shape[i];
			}
		}
		if (offset === void 0) {
			offset = 0;
			for (var i = 0; i < d; ++i) if (stride[i] < 0) offset -= (shape[i] - 1) * stride[i];
		}
		var dtype = arrayDType(data);
		var ctor_list = CACHED_CONSTRUCTORS[dtype];
		while (ctor_list.length <= d + 1) ctor_list.push(compileConstructor(dtype, ctor_list.length - 1));
		var ctor = ctor_list[d + 1];
		return ctor(data, shape, stride, offset);
	}
	module.exports = wrappedNDArrayCtor;
}));
//#endregion
//#region node_modules/.pnpm/uniq@1.0.1/node_modules/uniq/uniq.js
var require_uniq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function unique_pred(list, compare) {
		var ptr = 1, len = list.length, a = list[0], b = list[0];
		for (var i = 1; i < len; ++i) {
			b = a;
			a = list[i];
			if (compare(a, b)) {
				if (i === ptr) {
					ptr++;
					continue;
				}
				list[ptr++] = a;
			}
		}
		list.length = ptr;
		return list;
	}
	function unique_eq(list) {
		var ptr = 1, len = list.length, a = list[0], b = list[0];
		for (var i = 1; i < len; ++i, b = a) {
			b = a;
			a = list[i];
			if (a !== b) {
				if (i === ptr) {
					ptr++;
					continue;
				}
				list[ptr++] = a;
			}
		}
		list.length = ptr;
		return list;
	}
	function unique(list, compare, sorted) {
		if (list.length === 0) return list;
		if (compare) {
			if (!sorted) list.sort(compare);
			return unique_pred(list, compare);
		}
		if (!sorted) list.sort();
		return unique_eq(list);
	}
	module.exports = unique;
}));
//#endregion
//#region node_modules/.pnpm/cwise-compiler@1.1.3/node_modules/cwise-compiler/lib/compile.js
var require_compile = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var uniq = require_uniq();
	function innerFill(order, proc, body) {
		var dimension = order.length, nargs = proc.arrayArgs.length, has_index = proc.indexArgs.length > 0, code = [], vars = [], idx = 0, pidx = 0, i, j;
		for (i = 0; i < dimension; ++i) vars.push([
			"i",
			i,
			"=0"
		].join(""));
		for (j = 0; j < nargs; ++j) for (i = 0; i < dimension; ++i) {
			pidx = idx;
			idx = order[i];
			if (i === 0) vars.push([
				"d",
				j,
				"s",
				i,
				"=t",
				j,
				"p",
				idx
			].join(""));
			else vars.push([
				"d",
				j,
				"s",
				i,
				"=(t",
				j,
				"p",
				idx,
				"-s",
				pidx,
				"*t",
				j,
				"p",
				pidx,
				")"
			].join(""));
		}
		if (vars.length > 0) code.push("var " + vars.join(","));
		for (i = dimension - 1; i >= 0; --i) {
			idx = order[i];
			code.push([
				"for(i",
				i,
				"=0;i",
				i,
				"<s",
				idx,
				";++i",
				i,
				"){"
			].join(""));
		}
		code.push(body);
		for (i = 0; i < dimension; ++i) {
			pidx = idx;
			idx = order[i];
			for (j = 0; j < nargs; ++j) code.push([
				"p",
				j,
				"+=d",
				j,
				"s",
				i
			].join(""));
			if (has_index) {
				if (i > 0) code.push([
					"index[",
					pidx,
					"]-=s",
					pidx
				].join(""));
				code.push([
					"++index[",
					idx,
					"]"
				].join(""));
			}
			code.push("}");
		}
		return code.join("\n");
	}
	function outerFill(matched, order, proc, body) {
		var dimension = order.length, nargs = proc.arrayArgs.length, blockSize = proc.blockSize, has_index = proc.indexArgs.length > 0, code = [];
		for (var i = 0; i < nargs; ++i) code.push([
			"var offset",
			i,
			"=p",
			i
		].join(""));
		for (var i = matched; i < dimension; ++i) {
			code.push([
				"for(var j" + i + "=SS[",
				order[i],
				"]|0;j",
				i,
				">0;){"
			].join(""));
			code.push([
				"if(j",
				i,
				"<",
				blockSize,
				"){"
			].join(""));
			code.push([
				"s",
				order[i],
				"=j",
				i
			].join(""));
			code.push([
				"j",
				i,
				"=0"
			].join(""));
			code.push([
				"}else{s",
				order[i],
				"=",
				blockSize
			].join(""));
			code.push([
				"j",
				i,
				"-=",
				blockSize,
				"}"
			].join(""));
			if (has_index) code.push([
				"index[",
				order[i],
				"]=j",
				i
			].join(""));
		}
		for (var i = 0; i < nargs; ++i) {
			var indexStr = ["offset" + i];
			for (var j = matched; j < dimension; ++j) indexStr.push([
				"j",
				j,
				"*t",
				i,
				"p",
				order[j]
			].join(""));
			code.push([
				"p",
				i,
				"=(",
				indexStr.join("+"),
				")"
			].join(""));
		}
		code.push(innerFill(order, proc, body));
		for (var i = matched; i < dimension; ++i) code.push("}");
		return code.join("\n");
	}
	function countMatches(orders) {
		var matched = 0, dimension = orders[0].length;
		while (matched < dimension) {
			for (var j = 1; j < orders.length; ++j) if (orders[j][matched] !== orders[0][matched]) return matched;
			++matched;
		}
		return matched;
	}
	function processBlock(block, proc, dtypes) {
		var code = block.body;
		var pre = [];
		var post = [];
		for (var i = 0; i < block.args.length; ++i) {
			var carg = block.args[i];
			if (carg.count <= 0) continue;
			var re = new RegExp(carg.name, "g");
			var ptrStr = "";
			var arrNum = proc.arrayArgs.indexOf(i);
			switch (proc.argTypes[i]) {
				case "offset":
					var offArgIndex = proc.offsetArgIndex.indexOf(i);
					arrNum = proc.offsetArgs[offArgIndex].array;
					ptrStr = "+q" + offArgIndex;
				case "array":
					ptrStr = "p" + arrNum + ptrStr;
					var localStr = "l" + i;
					var arrStr = "a" + arrNum;
					if (proc.arrayBlockIndices[arrNum] === 0) if (carg.count === 1) if (dtypes[arrNum] === "generic") if (carg.lvalue) {
						pre.push([
							"var ",
							localStr,
							"=",
							arrStr,
							".get(",
							ptrStr,
							")"
						].join(""));
						code = code.replace(re, localStr);
						post.push([
							arrStr,
							".set(",
							ptrStr,
							",",
							localStr,
							")"
						].join(""));
					} else code = code.replace(re, [
						arrStr,
						".get(",
						ptrStr,
						")"
					].join(""));
					else code = code.replace(re, [
						arrStr,
						"[",
						ptrStr,
						"]"
					].join(""));
					else if (dtypes[arrNum] === "generic") {
						pre.push([
							"var ",
							localStr,
							"=",
							arrStr,
							".get(",
							ptrStr,
							")"
						].join(""));
						code = code.replace(re, localStr);
						if (carg.lvalue) post.push([
							arrStr,
							".set(",
							ptrStr,
							",",
							localStr,
							")"
						].join(""));
					} else {
						pre.push([
							"var ",
							localStr,
							"=",
							arrStr,
							"[",
							ptrStr,
							"]"
						].join(""));
						code = code.replace(re, localStr);
						if (carg.lvalue) post.push([
							arrStr,
							"[",
							ptrStr,
							"]=",
							localStr
						].join(""));
					}
					else {
						var reStrArr = [carg.name], ptrStrArr = [ptrStr];
						for (var j = 0; j < Math.abs(proc.arrayBlockIndices[arrNum]); j++) {
							reStrArr.push("\\s*\\[([^\\]]+)\\]");
							ptrStrArr.push("$" + (j + 1) + "*t" + arrNum + "b" + j);
						}
						re = new RegExp(reStrArr.join(""), "g");
						ptrStr = ptrStrArr.join("+");
						if (dtypes[arrNum] === "generic") throw new Error("cwise: Generic arrays not supported in combination with blocks!");
						else code = code.replace(re, [
							arrStr,
							"[",
							ptrStr,
							"]"
						].join(""));
					}
					break;
				case "scalar":
					code = code.replace(re, "Y" + proc.scalarArgs.indexOf(i));
					break;
				case "index":
					code = code.replace(re, "index");
					break;
				case "shape":
					code = code.replace(re, "shape");
					break;
			}
		}
		return [
			pre.join("\n"),
			code,
			post.join("\n")
		].join("\n").trim();
	}
	function typeSummary(dtypes) {
		var summary = new Array(dtypes.length);
		var allEqual = true;
		for (var i = 0; i < dtypes.length; ++i) {
			var t = dtypes[i];
			var digits = t.match(/\d+/);
			if (!digits) digits = "";
			else digits = digits[0];
			if (t.charAt(0) === 0) summary[i] = "u" + t.charAt(1) + digits;
			else summary[i] = t.charAt(0) + digits;
			if (i > 0) allEqual = allEqual && summary[i] === summary[i - 1];
		}
		if (allEqual) return summary[0];
		return summary.join("");
	}
	function generateCWiseOp(proc, typesig) {
		var dimension = typesig[1].length - Math.abs(proc.arrayBlockIndices[0]) | 0;
		var orders = new Array(proc.arrayArgs.length);
		var dtypes = new Array(proc.arrayArgs.length);
		for (var i = 0; i < proc.arrayArgs.length; ++i) {
			dtypes[i] = typesig[2 * i];
			orders[i] = typesig[2 * i + 1];
		}
		var blockBegin = [], blockEnd = [];
		var loopBegin = [], loopEnd = [];
		var loopOrders = [];
		for (var i = 0; i < proc.arrayArgs.length; ++i) {
			if (proc.arrayBlockIndices[i] < 0) {
				loopBegin.push(0);
				loopEnd.push(dimension);
				blockBegin.push(dimension);
				blockEnd.push(dimension + proc.arrayBlockIndices[i]);
			} else {
				loopBegin.push(proc.arrayBlockIndices[i]);
				loopEnd.push(proc.arrayBlockIndices[i] + dimension);
				blockBegin.push(0);
				blockEnd.push(proc.arrayBlockIndices[i]);
			}
			var newOrder = [];
			for (var j = 0; j < orders[i].length; j++) if (loopBegin[i] <= orders[i][j] && orders[i][j] < loopEnd[i]) newOrder.push(orders[i][j] - loopBegin[i]);
			loopOrders.push(newOrder);
		}
		var arglist = ["SS"];
		var code = ["'use strict'"];
		var vars = [];
		for (var j = 0; j < dimension; ++j) vars.push([
			"s",
			j,
			"=SS[",
			j,
			"]"
		].join(""));
		for (var i = 0; i < proc.arrayArgs.length; ++i) {
			arglist.push("a" + i);
			arglist.push("t" + i);
			arglist.push("p" + i);
			for (var j = 0; j < dimension; ++j) vars.push([
				"t",
				i,
				"p",
				j,
				"=t",
				i,
				"[",
				loopBegin[i] + j,
				"]"
			].join(""));
			for (var j = 0; j < Math.abs(proc.arrayBlockIndices[i]); ++j) vars.push([
				"t",
				i,
				"b",
				j,
				"=t",
				i,
				"[",
				blockBegin[i] + j,
				"]"
			].join(""));
		}
		for (var i = 0; i < proc.scalarArgs.length; ++i) arglist.push("Y" + i);
		if (proc.shapeArgs.length > 0) vars.push("shape=SS.slice(0)");
		if (proc.indexArgs.length > 0) {
			var zeros = new Array(dimension);
			for (var i = 0; i < dimension; ++i) zeros[i] = "0";
			vars.push([
				"index=[",
				zeros.join(","),
				"]"
			].join(""));
		}
		for (var i = 0; i < proc.offsetArgs.length; ++i) {
			var off_arg = proc.offsetArgs[i];
			var init_string = [];
			for (var j = 0; j < off_arg.offset.length; ++j) if (off_arg.offset[j] === 0) continue;
			else if (off_arg.offset[j] === 1) init_string.push([
				"t",
				off_arg.array,
				"p",
				j
			].join(""));
			else init_string.push([
				off_arg.offset[j],
				"*t",
				off_arg.array,
				"p",
				j
			].join(""));
			if (init_string.length === 0) vars.push("q" + i + "=0");
			else vars.push([
				"q",
				i,
				"=",
				init_string.join("+")
			].join(""));
		}
		var thisVars = uniq([].concat(proc.pre.thisVars).concat(proc.body.thisVars).concat(proc.post.thisVars));
		vars = vars.concat(thisVars);
		if (vars.length > 0) code.push("var " + vars.join(","));
		for (var i = 0; i < proc.arrayArgs.length; ++i) code.push("p" + i + "|=0");
		if (proc.pre.body.length > 3) code.push(processBlock(proc.pre, proc, dtypes));
		var body = processBlock(proc.body, proc, dtypes);
		var matched = countMatches(loopOrders);
		if (matched < dimension) code.push(outerFill(matched, loopOrders[0], proc, body));
		else code.push(innerFill(loopOrders[0], proc, body));
		if (proc.post.body.length > 3) code.push(processBlock(proc.post, proc, dtypes));
		if (proc.debug) console.log("-----Generated cwise routine for ", typesig, ":\n" + code.join("\n") + "\n----------");
		var loopName = [
			proc.funcName || "unnamed",
			"_cwise_loop_",
			orders[0].join("s"),
			"m",
			matched,
			typeSummary(dtypes)
		].join("");
		return new Function([
			"function ",
			loopName,
			"(",
			arglist.join(","),
			"){",
			code.join("\n"),
			"} return ",
			loopName
		].join(""))();
	}
	module.exports = generateCWiseOp;
}));
//#endregion
//#region node_modules/.pnpm/cwise-compiler@1.1.3/node_modules/cwise-compiler/lib/thunk.js
var require_thunk = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var compile = require_compile();
	function createThunk(proc) {
		var code = ["'use strict'", "var CACHED={}"];
		var vars = [];
		var thunkName = proc.funcName + "_cwise_thunk";
		code.push([
			"return function ",
			thunkName,
			"(",
			proc.shimArgs.join(","),
			"){"
		].join(""));
		var typesig = [];
		var string_typesig = [];
		var proc_args = [[
			"array",
			proc.arrayArgs[0],
			".shape.slice(",
			Math.max(0, proc.arrayBlockIndices[0]),
			proc.arrayBlockIndices[0] < 0 ? "," + proc.arrayBlockIndices[0] + ")" : ")"
		].join("")];
		var shapeLengthConditions = [], shapeConditions = [];
		for (var i = 0; i < proc.arrayArgs.length; ++i) {
			var j = proc.arrayArgs[i];
			vars.push([
				"t",
				j,
				"=array",
				j,
				".dtype,",
				"r",
				j,
				"=array",
				j,
				".order"
			].join(""));
			typesig.push("t" + j);
			typesig.push("r" + j);
			string_typesig.push("t" + j);
			string_typesig.push("r" + j + ".join()");
			proc_args.push("array" + j + ".data");
			proc_args.push("array" + j + ".stride");
			proc_args.push("array" + j + ".offset|0");
			if (i > 0) {
				shapeLengthConditions.push("array" + proc.arrayArgs[0] + ".shape.length===array" + j + ".shape.length+" + (Math.abs(proc.arrayBlockIndices[0]) - Math.abs(proc.arrayBlockIndices[i])));
				shapeConditions.push("array" + proc.arrayArgs[0] + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[0]) + "]===array" + j + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[i]) + "]");
			}
		}
		if (proc.arrayArgs.length > 1) {
			code.push("if (!(" + shapeLengthConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same dimensionality!')");
			code.push("for(var shapeIndex=array" + proc.arrayArgs[0] + ".shape.length-" + Math.abs(proc.arrayBlockIndices[0]) + "; shapeIndex-->0;) {");
			code.push("if (!(" + shapeConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same shape!')");
			code.push("}");
		}
		for (var i = 0; i < proc.scalarArgs.length; ++i) proc_args.push("scalar" + proc.scalarArgs[i]);
		vars.push([
			"type=[",
			string_typesig.join(","),
			"].join()"
		].join(""));
		vars.push("proc=CACHED[type]");
		code.push("var " + vars.join(","));
		code.push([
			"if(!proc){",
			"CACHED[type]=proc=compile([",
			typesig.join(","),
			"])}",
			"return proc(",
			proc_args.join(","),
			")}"
		].join(""));
		if (proc.debug) console.log("-----Generated thunk:\n" + code.join("\n") + "\n----------");
		return new Function("compile", code.join("\n"))(compile.bind(void 0, proc));
	}
	module.exports = createThunk;
}));
//#endregion
//#region node_modules/.pnpm/cwise-compiler@1.1.3/node_modules/cwise-compiler/compiler.js
var require_compiler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var createThunk = require_thunk();
	function Procedure() {
		this.argTypes = [];
		this.shimArgs = [];
		this.arrayArgs = [];
		this.arrayBlockIndices = [];
		this.scalarArgs = [];
		this.offsetArgs = [];
		this.offsetArgIndex = [];
		this.indexArgs = [];
		this.shapeArgs = [];
		this.funcName = "";
		this.pre = null;
		this.body = null;
		this.post = null;
		this.debug = false;
	}
	function compileCwise(user_args) {
		var proc = new Procedure();
		proc.pre = user_args.pre;
		proc.body = user_args.body;
		proc.post = user_args.post;
		var proc_args = user_args.args.slice(0);
		proc.argTypes = proc_args;
		for (var i = 0; i < proc_args.length; ++i) {
			var arg_type = proc_args[i];
			if (arg_type === "array" || typeof arg_type === "object" && arg_type.blockIndices) {
				proc.argTypes[i] = "array";
				proc.arrayArgs.push(i);
				proc.arrayBlockIndices.push(arg_type.blockIndices ? arg_type.blockIndices : 0);
				proc.shimArgs.push("array" + i);
				if (i < proc.pre.args.length && proc.pre.args[i].count > 0) throw new Error("cwise: pre() block may not reference array args");
				if (i < proc.post.args.length && proc.post.args[i].count > 0) throw new Error("cwise: post() block may not reference array args");
			} else if (arg_type === "scalar") {
				proc.scalarArgs.push(i);
				proc.shimArgs.push("scalar" + i);
			} else if (arg_type === "index") {
				proc.indexArgs.push(i);
				if (i < proc.pre.args.length && proc.pre.args[i].count > 0) throw new Error("cwise: pre() block may not reference array index");
				if (i < proc.body.args.length && proc.body.args[i].lvalue) throw new Error("cwise: body() block may not write to array index");
				if (i < proc.post.args.length && proc.post.args[i].count > 0) throw new Error("cwise: post() block may not reference array index");
			} else if (arg_type === "shape") {
				proc.shapeArgs.push(i);
				if (i < proc.pre.args.length && proc.pre.args[i].lvalue) throw new Error("cwise: pre() block may not write to array shape");
				if (i < proc.body.args.length && proc.body.args[i].lvalue) throw new Error("cwise: body() block may not write to array shape");
				if (i < proc.post.args.length && proc.post.args[i].lvalue) throw new Error("cwise: post() block may not write to array shape");
			} else if (typeof arg_type === "object" && arg_type.offset) {
				proc.argTypes[i] = "offset";
				proc.offsetArgs.push({
					array: arg_type.array,
					offset: arg_type.offset
				});
				proc.offsetArgIndex.push(i);
			} else throw new Error("cwise: Unknown argument type " + proc_args[i]);
		}
		if (proc.arrayArgs.length <= 0) throw new Error("cwise: No array arguments specified");
		if (proc.pre.args.length > proc_args.length) throw new Error("cwise: Too many arguments in pre() block");
		if (proc.body.args.length > proc_args.length) throw new Error("cwise: Too many arguments in body() block");
		if (proc.post.args.length > proc_args.length) throw new Error("cwise: Too many arguments in post() block");
		proc.debug = !!user_args.printCode || !!user_args.debug;
		proc.funcName = user_args.funcName || "cwise";
		proc.blockSize = user_args.blockSize || 64;
		return createThunk(proc);
	}
	module.exports = compileCwise;
}));
//#endregion
//#region node_modules/.pnpm/ndarray-ops@1.2.2/node_modules/ndarray-ops/ndarray-ops.js
var require_ndarray_ops = /* @__PURE__ */ __commonJSMin(((exports) => {
	var compile = require_compiler();
	var EmptyProc = {
		body: "",
		args: [],
		thisVars: [],
		localVars: []
	};
	function fixup(x) {
		if (!x) return EmptyProc;
		for (var i = 0; i < x.args.length; ++i) {
			var a = x.args[i];
			if (i === 0) x.args[i] = {
				name: a,
				lvalue: true,
				rvalue: !!x.rvalue,
				count: x.count || 1
			};
			else x.args[i] = {
				name: a,
				lvalue: false,
				rvalue: true,
				count: 1
			};
		}
		if (!x.thisVars) x.thisVars = [];
		if (!x.localVars) x.localVars = [];
		return x;
	}
	function pcompile(user_args) {
		return compile({
			args: user_args.args,
			pre: fixup(user_args.pre),
			body: fixup(user_args.body),
			post: fixup(user_args.proc),
			funcName: user_args.funcName
		});
	}
	function makeOp(user_args) {
		var args = [];
		for (var i = 0; i < user_args.args.length; ++i) args.push("a" + i);
		return new Function("P", [
			"return function ",
			user_args.funcName,
			"_ndarrayops(",
			args.join(","),
			") {P(",
			args.join(","),
			");return a0}"
		].join(""))(pcompile(user_args));
	}
	var assign_ops = {
		add: "+",
		sub: "-",
		mul: "*",
		div: "/",
		mod: "%",
		band: "&",
		bor: "|",
		bxor: "^",
		lshift: "<<",
		rshift: ">>",
		rrshift: ">>>"
	};
	(function() {
		for (var id in assign_ops) {
			var op = assign_ops[id];
			exports[id] = makeOp({
				args: [
					"array",
					"array",
					"array"
				],
				body: {
					args: [
						"a",
						"b",
						"c"
					],
					body: "a=b" + op + "c"
				},
				funcName: id
			});
			exports[id + "eq"] = makeOp({
				args: ["array", "array"],
				body: {
					args: ["a", "b"],
					body: "a" + op + "=b"
				},
				rvalue: true,
				funcName: id + "eq"
			});
			exports[id + "s"] = makeOp({
				args: [
					"array",
					"array",
					"scalar"
				],
				body: {
					args: [
						"a",
						"b",
						"s"
					],
					body: "a=b" + op + "s"
				},
				funcName: id + "s"
			});
			exports[id + "seq"] = makeOp({
				args: ["array", "scalar"],
				body: {
					args: ["a", "s"],
					body: "a" + op + "=s"
				},
				rvalue: true,
				funcName: id + "seq"
			});
		}
	})();
	var unary_ops = {
		not: "!",
		bnot: "~",
		neg: "-",
		recip: "1.0/"
	};
	(function() {
		for (var id in unary_ops) {
			var op = unary_ops[id];
			exports[id] = makeOp({
				args: ["array", "array"],
				body: {
					args: ["a", "b"],
					body: "a=" + op + "b"
				},
				funcName: id
			});
			exports[id + "eq"] = makeOp({
				args: ["array"],
				body: {
					args: ["a"],
					body: "a=" + op + "a"
				},
				rvalue: true,
				count: 2,
				funcName: id + "eq"
			});
		}
	})();
	var binary_ops = {
		and: "&&",
		or: "||",
		eq: "===",
		neq: "!==",
		lt: "<",
		gt: ">",
		leq: "<=",
		geq: ">="
	};
	(function() {
		for (var id in binary_ops) {
			var op = binary_ops[id];
			exports[id] = makeOp({
				args: [
					"array",
					"array",
					"array"
				],
				body: {
					args: [
						"a",
						"b",
						"c"
					],
					body: "a=b" + op + "c"
				},
				funcName: id
			});
			exports[id + "s"] = makeOp({
				args: [
					"array",
					"array",
					"scalar"
				],
				body: {
					args: [
						"a",
						"b",
						"s"
					],
					body: "a=b" + op + "s"
				},
				funcName: id + "s"
			});
			exports[id + "eq"] = makeOp({
				args: ["array", "array"],
				body: {
					args: ["a", "b"],
					body: "a=a" + op + "b"
				},
				rvalue: true,
				count: 2,
				funcName: id + "eq"
			});
			exports[id + "seq"] = makeOp({
				args: ["array", "scalar"],
				body: {
					args: ["a", "s"],
					body: "a=a" + op + "s"
				},
				rvalue: true,
				count: 2,
				funcName: id + "seq"
			});
		}
	})();
	var math_unary = [
		"abs",
		"acos",
		"asin",
		"atan",
		"ceil",
		"cos",
		"exp",
		"floor",
		"log",
		"round",
		"sin",
		"sqrt",
		"tan"
	];
	(function() {
		for (var i = 0; i < math_unary.length; ++i) {
			var f = math_unary[i];
			exports[f] = makeOp({
				args: ["array", "array"],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: ["a", "b"],
					body: "a=this_f(b)",
					thisVars: ["this_f"]
				},
				funcName: f
			});
			exports[f + "eq"] = makeOp({
				args: ["array"],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: ["a"],
					body: "a=this_f(a)",
					thisVars: ["this_f"]
				},
				rvalue: true,
				count: 2,
				funcName: f + "eq"
			});
		}
	})();
	var math_comm = [
		"max",
		"min",
		"atan2",
		"pow"
	];
	(function() {
		for (var i = 0; i < math_comm.length; ++i) {
			var f = math_comm[i];
			exports[f] = makeOp({
				args: [
					"array",
					"array",
					"array"
				],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: [
						"a",
						"b",
						"c"
					],
					body: "a=this_f(b,c)",
					thisVars: ["this_f"]
				},
				funcName: f
			});
			exports[f + "s"] = makeOp({
				args: [
					"array",
					"array",
					"scalar"
				],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: [
						"a",
						"b",
						"c"
					],
					body: "a=this_f(b,c)",
					thisVars: ["this_f"]
				},
				funcName: f + "s"
			});
			exports[f + "eq"] = makeOp({
				args: ["array", "array"],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: ["a", "b"],
					body: "a=this_f(a,b)",
					thisVars: ["this_f"]
				},
				rvalue: true,
				count: 2,
				funcName: f + "eq"
			});
			exports[f + "seq"] = makeOp({
				args: ["array", "scalar"],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: ["a", "b"],
					body: "a=this_f(a,b)",
					thisVars: ["this_f"]
				},
				rvalue: true,
				count: 2,
				funcName: f + "seq"
			});
		}
	})();
	var math_noncomm = ["atan2", "pow"];
	(function() {
		for (var i = 0; i < math_noncomm.length; ++i) {
			var f = math_noncomm[i];
			exports[f + "op"] = makeOp({
				args: [
					"array",
					"array",
					"array"
				],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: [
						"a",
						"b",
						"c"
					],
					body: "a=this_f(c,b)",
					thisVars: ["this_f"]
				},
				funcName: f + "op"
			});
			exports[f + "ops"] = makeOp({
				args: [
					"array",
					"array",
					"scalar"
				],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: [
						"a",
						"b",
						"c"
					],
					body: "a=this_f(c,b)",
					thisVars: ["this_f"]
				},
				funcName: f + "ops"
			});
			exports[f + "opeq"] = makeOp({
				args: ["array", "array"],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: ["a", "b"],
					body: "a=this_f(b,a)",
					thisVars: ["this_f"]
				},
				rvalue: true,
				count: 2,
				funcName: f + "opeq"
			});
			exports[f + "opseq"] = makeOp({
				args: ["array", "scalar"],
				pre: {
					args: [],
					body: "this_f=Math." + f,
					thisVars: ["this_f"]
				},
				body: {
					args: ["a", "b"],
					body: "a=this_f(b,a)",
					thisVars: ["this_f"]
				},
				rvalue: true,
				count: 2,
				funcName: f + "opseq"
			});
		}
	})();
	exports.any = compile({
		args: ["array"],
		pre: EmptyProc,
		body: {
			args: [{
				name: "a",
				lvalue: false,
				rvalue: true,
				count: 1
			}],
			body: "if(a){return true}",
			localVars: [],
			thisVars: []
		},
		post: {
			args: [],
			localVars: [],
			thisVars: [],
			body: "return false"
		},
		funcName: "any"
	});
	exports.all = compile({
		args: ["array"],
		pre: EmptyProc,
		body: {
			args: [{
				name: "x",
				lvalue: false,
				rvalue: true,
				count: 1
			}],
			body: "if(!x){return false}",
			localVars: [],
			thisVars: []
		},
		post: {
			args: [],
			localVars: [],
			thisVars: [],
			body: "return true"
		},
		funcName: "all"
	});
	exports.sum = compile({
		args: ["array"],
		pre: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "this_s=0"
		},
		body: {
			args: [{
				name: "a",
				lvalue: false,
				rvalue: true,
				count: 1
			}],
			body: "this_s+=a",
			localVars: [],
			thisVars: ["this_s"]
		},
		post: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "return this_s"
		},
		funcName: "sum"
	});
	exports.prod = compile({
		args: ["array"],
		pre: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "this_s=1"
		},
		body: {
			args: [{
				name: "a",
				lvalue: false,
				rvalue: true,
				count: 1
			}],
			body: "this_s*=a",
			localVars: [],
			thisVars: ["this_s"]
		},
		post: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "return this_s"
		},
		funcName: "prod"
	});
	exports.norm2squared = compile({
		args: ["array"],
		pre: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "this_s=0"
		},
		body: {
			args: [{
				name: "a",
				lvalue: false,
				rvalue: true,
				count: 2
			}],
			body: "this_s+=a*a",
			localVars: [],
			thisVars: ["this_s"]
		},
		post: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "return this_s"
		},
		funcName: "norm2squared"
	});
	exports.norm2 = compile({
		args: ["array"],
		pre: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "this_s=0"
		},
		body: {
			args: [{
				name: "a",
				lvalue: false,
				rvalue: true,
				count: 2
			}],
			body: "this_s+=a*a",
			localVars: [],
			thisVars: ["this_s"]
		},
		post: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "return Math.sqrt(this_s)"
		},
		funcName: "norm2"
	});
	exports.norminf = compile({
		args: ["array"],
		pre: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "this_s=0"
		},
		body: {
			args: [{
				name: "a",
				lvalue: false,
				rvalue: true,
				count: 4
			}],
			body: "if(-a>this_s){this_s=-a}else if(a>this_s){this_s=a}",
			localVars: [],
			thisVars: ["this_s"]
		},
		post: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "return this_s"
		},
		funcName: "norminf"
	});
	exports.norm1 = compile({
		args: ["array"],
		pre: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "this_s=0"
		},
		body: {
			args: [{
				name: "a",
				lvalue: false,
				rvalue: true,
				count: 3
			}],
			body: "this_s+=a<0?-a:a",
			localVars: [],
			thisVars: ["this_s"]
		},
		post: {
			args: [],
			localVars: [],
			thisVars: ["this_s"],
			body: "return this_s"
		},
		funcName: "norm1"
	});
	exports.sup = compile({
		args: ["array"],
		pre: {
			body: "this_h=-Infinity",
			args: [],
			thisVars: ["this_h"],
			localVars: []
		},
		body: {
			body: "if(_inline_1_arg0_>this_h)this_h=_inline_1_arg0_",
			args: [{
				"name": "_inline_1_arg0_",
				"lvalue": false,
				"rvalue": true,
				"count": 2
			}],
			thisVars: ["this_h"],
			localVars: []
		},
		post: {
			body: "return this_h",
			args: [],
			thisVars: ["this_h"],
			localVars: []
		}
	});
	exports.inf = compile({
		args: ["array"],
		pre: {
			body: "this_h=Infinity",
			args: [],
			thisVars: ["this_h"],
			localVars: []
		},
		body: {
			body: "if(_inline_1_arg0_<this_h)this_h=_inline_1_arg0_",
			args: [{
				"name": "_inline_1_arg0_",
				"lvalue": false,
				"rvalue": true,
				"count": 2
			}],
			thisVars: ["this_h"],
			localVars: []
		},
		post: {
			body: "return this_h",
			args: [],
			thisVars: ["this_h"],
			localVars: []
		}
	});
	exports.argmin = compile({
		args: [
			"index",
			"array",
			"shape"
		],
		pre: {
			body: "{this_v=Infinity;this_i=_inline_0_arg2_.slice(0)}",
			args: [
				{
					name: "_inline_0_arg0_",
					lvalue: false,
					rvalue: false,
					count: 0
				},
				{
					name: "_inline_0_arg1_",
					lvalue: false,
					rvalue: false,
					count: 0
				},
				{
					name: "_inline_0_arg2_",
					lvalue: false,
					rvalue: true,
					count: 1
				}
			],
			thisVars: ["this_i", "this_v"],
			localVars: []
		},
		body: {
			body: "{if(_inline_1_arg1_<this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
			args: [{
				name: "_inline_1_arg0_",
				lvalue: false,
				rvalue: true,
				count: 2
			}, {
				name: "_inline_1_arg1_",
				lvalue: false,
				rvalue: true,
				count: 2
			}],
			thisVars: ["this_i", "this_v"],
			localVars: ["_inline_1_k"]
		},
		post: {
			body: "{return this_i}",
			args: [],
			thisVars: ["this_i"],
			localVars: []
		}
	});
	exports.argmax = compile({
		args: [
			"index",
			"array",
			"shape"
		],
		pre: {
			body: "{this_v=-Infinity;this_i=_inline_0_arg2_.slice(0)}",
			args: [
				{
					name: "_inline_0_arg0_",
					lvalue: false,
					rvalue: false,
					count: 0
				},
				{
					name: "_inline_0_arg1_",
					lvalue: false,
					rvalue: false,
					count: 0
				},
				{
					name: "_inline_0_arg2_",
					lvalue: false,
					rvalue: true,
					count: 1
				}
			],
			thisVars: ["this_i", "this_v"],
			localVars: []
		},
		body: {
			body: "{if(_inline_1_arg1_>this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
			args: [{
				name: "_inline_1_arg0_",
				lvalue: false,
				rvalue: true,
				count: 2
			}, {
				name: "_inline_1_arg1_",
				lvalue: false,
				rvalue: true,
				count: 2
			}],
			thisVars: ["this_i", "this_v"],
			localVars: ["_inline_1_k"]
		},
		post: {
			body: "{return this_i}",
			args: [],
			thisVars: ["this_i"],
			localVars: []
		}
	});
	exports.random = makeOp({
		args: ["array"],
		pre: {
			args: [],
			body: "this_f=Math.random",
			thisVars: ["this_f"]
		},
		body: {
			args: ["a"],
			body: "a=this_f()",
			thisVars: ["this_f"]
		},
		funcName: "random"
	});
	exports.assign = makeOp({
		args: ["array", "array"],
		body: {
			args: ["a", "b"],
			body: "a=b"
		},
		funcName: "assign"
	});
	exports.assigns = makeOp({
		args: ["array", "scalar"],
		body: {
			args: ["a", "b"],
			body: "a=b"
		},
		funcName: "assigns"
	});
	exports.equals = compile({
		args: ["array", "array"],
		pre: EmptyProc,
		body: {
			args: [{
				name: "x",
				lvalue: false,
				rvalue: true,
				count: 1
			}, {
				name: "y",
				lvalue: false,
				rvalue: true,
				count: 1
			}],
			body: "if(x!==y){return false}",
			localVars: [],
			thisVars: []
		},
		post: {
			args: [],
			localVars: [],
			thisVars: [],
			body: "return true"
		},
		funcName: "equals"
	});
}));
//#endregion
//#region node_modules/.pnpm/ndarray-pixels@5.0.1/node_modules/ndarray-pixels/dist/ndarray-pixels-node.cjs
var require_ndarray_pixels_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	var ndarray = require_ndarray();
	var sharp = __require("sharp");
	var ops = require_ndarray_ops();
	function _interopDefaultLegacy(e) {
		return e && typeof e === "object" && "default" in e ? e : { "default": e };
	}
	var ndarray__default = /*#__PURE__*/ _interopDefaultLegacy(ndarray);
	var sharp__default = /*#__PURE__*/ _interopDefaultLegacy(sharp);
	var ops__default = /*#__PURE__*/ _interopDefaultLegacy(ops);
	async function getPixelsInternal(buffer, _mimeType) {
		if (!(buffer instanceof Uint8Array)) throw new Error("[ndarray-pixels] Input must be Uint8Array or Buffer.");
		const { data, info } = await sharp__default["default"](buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
		return ndarray__default["default"](new Uint8Array(data), [
			info.width,
			info.height,
			4
		], [
			4,
			4 * info.width | 0,
			1
		], 0);
	}
	function putPixelData(array, data, frame = -1) {
		if (array.shape.length === 4) return putPixelData(array.pick(frame), data, 0);
		if (array.shape.length === 3) if (array.shape[2] === 3) {
			ops__default["default"].assign(ndarray__default["default"](data, [
				array.shape[0],
				array.shape[1],
				3
			], [
				4,
				4 * array.shape[0],
				1
			]), array);
			ops__default["default"].assigns(ndarray__default["default"](data, [array.shape[0] * array.shape[1]], [4], 3), 255);
		} else if (array.shape[2] === 4) ops__default["default"].assign(ndarray__default["default"](data, [
			array.shape[0],
			array.shape[1],
			4
		], [
			4,
			array.shape[0] * 4,
			1
		]), array);
		else if (array.shape[2] === 1) {
			ops__default["default"].assign(ndarray__default["default"](data, [
				array.shape[0],
				array.shape[1],
				3
			], [
				4,
				4 * array.shape[0],
				1
			]), ndarray__default["default"](array.data, [
				array.shape[0],
				array.shape[1],
				3
			], [
				array.stride[0],
				array.stride[1],
				0
			], array.offset));
			ops__default["default"].assigns(ndarray__default["default"](data, [array.shape[0] * array.shape[1]], [4], 3), 255);
		} else throw new Error("[ndarray-pixels] Incompatible array shape.");
		else if (array.shape.length === 2) {
			ops__default["default"].assign(ndarray__default["default"](data, [
				array.shape[0],
				array.shape[1],
				3
			], [
				4,
				4 * array.shape[0],
				1
			]), ndarray__default["default"](array.data, [
				array.shape[0],
				array.shape[1],
				3
			], [
				array.stride[0],
				array.stride[1],
				0
			], array.offset));
			ops__default["default"].assigns(ndarray__default["default"](data, [array.shape[0] * array.shape[1]], [4], 3), 255);
		} else throw new Error("[ndarray-pixels] Incompatible array shape.");
		return data;
	}
	async function savePixelsInternal(pixels, options) {
		const [width, height, channels] = pixels.shape;
		const data = putPixelData(pixels, new Uint8Array(width * height * channels));
		const { type, quality } = options;
		const format = (type != null ? type : "image/png").replace("image/", "");
		const sharpOptions = {
			quality: typeof quality === "number" ? Math.round(1 + quality * 99) : void 0,
			lossless: quality === 1,
			palette: false
		};
		return sharp__default["default"](data, { raw: {
			width,
			height,
			channels
		} }).toFormat(format, sharpOptions).toBuffer();
	}
	/**
	* Decodes image data to an `ndarray`.
	*
	* MIME type is optional when given a path or URL, and required when given a Uint8Array.
	*
	* Accepts `image/png` or `image/jpeg` in Node.js, and additional formats on browsers with
	* the necessary support in Canvas 2D.
	*
	* @param data
	* @param mimeType `image/jpeg`, `image/png`, etc.
	* @returns
	*/
	async function getPixels(data, mimeType) {
		return getPixelsInternal(data);
	}
	/**
	* Encodes an `ndarray` as image data in the given format.
	*
	* If the source `ndarray` was constructed manually with default stride, use
	* `ndarray.transpose(1, 0)` to reshape it and ensure an identical result from getPixels(). For an
	* ndarray created by getPixels(), this isn't necessary.
	*
	* Accepts `image/png` or `image/jpeg` in Node.js, and additional formats on browsers with
	* the necessary support in Canvas 2D.
	*
	* @param pixels ndarray of shape W x H x 4.
	* @param typeOrOptions object with encoding options or just the type
	* @param typeOrOptions.type target format (`image/jpeg`, `image/png`, `image/webp`, etc.)
	* @param typeOrOptions.quality quality as a number from 0 to 1, inclusive
	* @returns
	*/
	async function savePixels(pixels, typeOrOptions) {
		let options;
		if (typeof typeOrOptions === "string") options = {
			type: typeOrOptions,
			quality: void 0
		};
		else options = {
			type: typeOrOptions.type,
			quality: typeOrOptions.quality
		};
		return savePixelsInternal(pixels, options);
	}
	exports.getPixels = getPixels;
	exports.savePixels = savePixels;
}));
//#endregion
//#region node_modules/.pnpm/@ericblade+quagga2@1.12.1/node_modules/@ericblade/quagga2/lib/quagga.js
var require_quagga = /* @__PURE__ */ __commonJSMin(((exports) => {
	(function(e, a) {
		for (var i in a) e[i] = a[i];
	})(exports, (function(modules) {
		var installedModules = {};
		function __webpack_require__(moduleId) {
			if (installedModules[moduleId]) return installedModules[moduleId].exports;
			var module$1 = installedModules[moduleId] = {
				i: moduleId,
				l: false,
				exports: {}
			};
			modules[moduleId].call(module$1.exports, module$1, module$1.exports, __webpack_require__);
			module$1.l = true;
			return module$1.exports;
		}
		__webpack_require__.m = modules;
		__webpack_require__.c = installedModules;
		__webpack_require__.d = function(exports$1, name, getter) {
			if (!__webpack_require__.o(exports$1, name)) Object.defineProperty(exports$1, name, {
				enumerable: true,
				get: getter
			});
		};
		__webpack_require__.r = function(exports$2) {
			if (typeof Symbol !== "undefined" && Symbol.toStringTag) Object.defineProperty(exports$2, Symbol.toStringTag, { value: "Module" });
			Object.defineProperty(exports$2, "__esModule", { value: true });
		};
		__webpack_require__.t = function(value, mode) {
			if (mode & 1) value = __webpack_require__(value);
			if (mode & 8) return value;
			if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
			var ns = Object.create(null);
			__webpack_require__.r(ns);
			Object.defineProperty(ns, "default", {
				enumerable: true,
				value
			});
			if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, function(key) {
				return value[key];
			}.bind(null, key));
			return ns;
		};
		__webpack_require__.n = function(module$2) {
			var getter = module$2 && module$2.__esModule ? function getDefault() {
				return module$2["default"];
			} : function getModuleExports() {
				return module$2;
			};
			__webpack_require__.d(getter, "a", getter);
			return getter;
		};
		__webpack_require__.o = function(object, property) {
			return Object.prototype.hasOwnProperty.call(object, property);
		};
		__webpack_require__.p = "/";
		return __webpack_require__(__webpack_require__.s = 99);
	})([
		(function(module$3, exports$3, __webpack_require__) {
			var toPropertyKey = __webpack_require__(73);
			function _defineProperty(e, r, t) {
				return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
					value: t,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : e[r] = t, e;
			}
			module$3.exports = _defineProperty, module$3.exports.__esModule = true, module$3.exports["default"] = module$3.exports;
		}),
		(function(module$4, exports$4) {
			function _getPrototypeOf(t) {
				return module$4.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
					return t.__proto__ || Object.getPrototypeOf(t);
				}, module$4.exports.__esModule = true, module$4.exports["default"] = module$4.exports, _getPrototypeOf(t);
			}
			module$4.exports = _getPrototypeOf, module$4.exports.__esModule = true, module$4.exports["default"] = module$4.exports;
		}),
		(function(module$5, exports$5) {
			function _classCallCheck(a, n) {
				if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
			}
			module$5.exports = _classCallCheck, module$5.exports.__esModule = true, module$5.exports["default"] = module$5.exports;
		}),
		(function(module$6, exports$6, __webpack_require__) {
			var toPropertyKey = __webpack_require__(73);
			function _defineProperties(e, r) {
				for (var t = 0; t < r.length; t++) {
					var o = r[t];
					o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
				}
			}
			function _createClass(e, r, t) {
				return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
			}
			module$6.exports = _createClass, module$6.exports.__esModule = true, module$6.exports["default"] = module$6.exports;
		}),
		(function(module$7, exports$7, __webpack_require__) {
			var _typeof = __webpack_require__(13)["default"];
			var assertThisInitialized = __webpack_require__(162);
			function _possibleConstructorReturn(t, e) {
				if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
				if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
				return assertThisInitialized(t);
			}
			module$7.exports = _possibleConstructorReturn, module$7.exports.__esModule = true, module$7.exports["default"] = module$7.exports;
		}),
		(function(module$8, exports$8, __webpack_require__) {
			var setPrototypeOf = __webpack_require__(43);
			function _inherits(t, e) {
				if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
				t.prototype = Object.create(e && e.prototype, { constructor: {
					value: t,
					writable: !0,
					configurable: !0
				} }), Object.defineProperty(t, "prototype", { writable: !1 }), e && setPrototypeOf(t, e);
			}
			module$8.exports = _inherits, module$8.exports.__esModule = true, module$8.exports["default"] = module$8.exports;
		}),
		(function(module$9, exports$9, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$9, "__esModule", { value: true });
			exports$9.vec4 = exports$9.vec3 = exports$9.vec2 = exports$9.quat2 = exports$9.quat = exports$9.mat4 = exports$9.mat3 = exports$9.mat2d = exports$9.mat2 = exports$9.glMatrix = void 0;
			exports$9.glMatrix = _interopRequireWildcard(__webpack_require__(12));
			exports$9.mat2 = _interopRequireWildcard(__webpack_require__(154));
			exports$9.mat2d = _interopRequireWildcard(__webpack_require__(155));
			exports$9.mat3 = _interopRequireWildcard(__webpack_require__(74));
			exports$9.mat4 = _interopRequireWildcard(__webpack_require__(75));
			exports$9.quat = _interopRequireWildcard(__webpack_require__(76));
			exports$9.quat2 = _interopRequireWildcard(__webpack_require__(156));
			exports$9.vec2 = _interopRequireWildcard(__webpack_require__(157));
			exports$9.vec3 = _interopRequireWildcard(__webpack_require__(77));
			exports$9.vec4 = _interopRequireWildcard(__webpack_require__(78));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
		}),
		(function(module$10, exports$10, __webpack_require__) {
			var runtime = __webpack_require__(158)();
			module$10.exports = runtime;
			try {
				regeneratorRuntime = runtime;
			} catch (accidentalStrictMode) {
				if (typeof globalThis === "object") globalThis.regeneratorRuntime = runtime;
				else Function("r", "regeneratorRuntime = r")(runtime);
			}
		}),
		(function(module$11, __webpack_exports__, __webpack_require__) {
			"use strict";
			__webpack_exports__["a"] = {
				init: function init(arr, val) {
					arr.fill(val);
				},
				/**
				* IN-PLACE Shuffles the content of an array
				*/
				shuffle: function shuffle(arr) {
					for (var i = arr.length - 1; i > 0; i--) {
						var j = Math.floor(Math.random() * (i + 1));
						var _ref = [arr[j], arr[i]];
						arr[i] = _ref[0];
						arr[j] = _ref[1];
					}
					return arr;
				},
				toPointList: function toPointList(arr) {
					var rows = arr.reduce(function(p, n) {
						var row = "[".concat(n.join(","), "]");
						p.push(row);
						return p;
					}, []);
					return "[".concat(rows.join(",\r\n"), "]");
				},
				/**
				* returns the elements which's score is bigger than the threshold
				*/
				threshold: function threshold(arr, _threshold, scoreFunc) {
					return arr.reduce(function(prev, next) {
						if (scoreFunc.apply(arr, [next]) >= _threshold) prev.push(next);
						return prev;
					}, []);
				},
				maxIndex: function maxIndex(arr) {
					var max = 0;
					for (var i = 0; i < arr.length; i++) if (arr[i] > arr[max]) max = i;
					return max;
				},
				max: function max(arr) {
					var max = 0;
					for (var i = 0; i < arr.length; i++) if (arr[i] > max) max = arr[i];
					return max;
				},
				sum: function sum(arr) {
					var length = arr.length;
					var sum = 0;
					while (length--) sum += arr[length];
					return sum;
				}
			};
		}),
		(function(module$12, exports$11) {
			function asyncGeneratorStep(n, t, e, r, o, a, c) {
				try {
					var i = n[a](c), u = i.value;
				} catch (n) {
					e(n);
					return;
				}
				i.done ? t(u) : Promise.resolve(u).then(r, o);
			}
			function _asyncToGenerator(n) {
				return function() {
					var t = this, e = arguments;
					return new Promise(function(r, o) {
						var a = n.apply(t, e);
						function _next(n) {
							asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
						}
						function _throw(n) {
							asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
						}
						_next(void 0);
					});
				};
			}
			module$12.exports = _asyncToGenerator, module$12.exports.__esModule = true, module$12.exports["default"] = module$12.exports;
		}),
		(function(module$13, __webpack_exports__, __webpack_require__) {
			"use strict";
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, "imageRef", function() {
				return imageRef;
			});
			__webpack_require__.d(__webpack_exports__, "computeIntegralImage2", function() {
				return computeIntegralImage2;
			});
			__webpack_require__.d(__webpack_exports__, "computeIntegralImage", function() {
				return computeIntegralImage;
			});
			__webpack_require__.d(__webpack_exports__, "thresholdImage", function() {
				return thresholdImage;
			});
			__webpack_require__.d(__webpack_exports__, "computeHistogram", function() {
				return computeHistogram;
			});
			__webpack_require__.d(__webpack_exports__, "sharpenLine", function() {
				return sharpenLine;
			});
			__webpack_require__.d(__webpack_exports__, "determineOtsuThreshold", function() {
				return determineOtsuThreshold;
			});
			__webpack_require__.d(__webpack_exports__, "otsuThreshold", function() {
				return otsuThreshold;
			});
			__webpack_require__.d(__webpack_exports__, "computeBinaryImage", function() {
				return computeBinaryImage;
			});
			__webpack_require__.d(__webpack_exports__, "cluster", function() {
				return cv_utils_cluster;
			});
			__webpack_require__.d(__webpack_exports__, "Tracer", function() {
				return Tracer;
			});
			__webpack_require__.d(__webpack_exports__, "DILATE", function() {
				return DILATE;
			});
			__webpack_require__.d(__webpack_exports__, "ERODE", function() {
				return ERODE;
			});
			__webpack_require__.d(__webpack_exports__, "dilate", function() {
				return dilate;
			});
			__webpack_require__.d(__webpack_exports__, "erode", function() {
				return erode;
			});
			__webpack_require__.d(__webpack_exports__, "subtract", function() {
				return subtract;
			});
			__webpack_require__.d(__webpack_exports__, "bitwiseOr", function() {
				return bitwiseOr;
			});
			__webpack_require__.d(__webpack_exports__, "countNonZero", function() {
				return countNonZero;
			});
			__webpack_require__.d(__webpack_exports__, "topGeneric", function() {
				return topGeneric;
			});
			__webpack_require__.d(__webpack_exports__, "grayArrayFromImage", function() {
				return grayArrayFromImage;
			});
			__webpack_require__.d(__webpack_exports__, "grayArrayFromContext", function() {
				return grayArrayFromContext;
			});
			__webpack_require__.d(__webpack_exports__, "grayAndHalfSampleFromCanvasData", function() {
				return grayAndHalfSampleFromCanvasData;
			});
			__webpack_require__.d(__webpack_exports__, "computeGray", function() {
				return computeGray;
			});
			__webpack_require__.d(__webpack_exports__, "loadImageArray", function() {
				return loadImageArray;
			});
			__webpack_require__.d(__webpack_exports__, "halfSample", function() {
				return halfSample;
			});
			__webpack_require__.d(__webpack_exports__, "hsv2rgb", function() {
				return hsv2rgb;
			});
			__webpack_require__.d(__webpack_exports__, "_computeDivisors", function() {
				return _computeDivisors;
			});
			__webpack_require__.d(__webpack_exports__, "calculatePatchSize", function() {
				return calculatePatchSize;
			});
			__webpack_require__.d(__webpack_exports__, "_parseCSSDimensionValues", function() {
				return _parseCSSDimensionValues;
			});
			__webpack_require__.d(__webpack_exports__, "_dimensionsConverters", function() {
				return _dimensionsConverters;
			});
			__webpack_require__.d(__webpack_exports__, "computeImageArea", function() {
				return computeImageArea;
			});
			var cjs = __webpack_require__(6);
			var array_helper = __webpack_require__(8);
			/**
			* Creates a cluster for grouping similar orientations of datapoints
			*/
			var cluster = {
				create: function create(point, threshold) {
					var points = [];
					var center = {
						rad: 0,
						vec: cjs["vec2"].clone([0, 0])
					};
					var pointMap = {};
					function _add(pointToAdd) {
						pointMap[pointToAdd.id] = pointToAdd;
						points.push(pointToAdd);
					}
					function updateCenter() {
						var i;
						var sum = 0;
						for (i = 0; i < points.length; i++) sum += points[i].rad;
						center.rad = sum / points.length;
						center.vec = cjs["vec2"].clone([Math.cos(center.rad), Math.sin(center.rad)]);
					}
					function init() {
						_add(point);
						updateCenter();
					}
					init();
					return {
						add: function add(pointToAdd) {
							if (!pointMap[pointToAdd.id]) {
								_add(pointToAdd);
								updateCenter();
							}
						},
						fits: function fits(otherPoint) {
							if (Math.abs(cjs["vec2"].dot(otherPoint.point.vec, center.vec)) > threshold) return true;
							return false;
						},
						getPoints: function getPoints() {
							return points;
						},
						getCenter: function getCenter() {
							return center;
						}
					};
				},
				createPoint: function createPoint(newPoint, id, property) {
					return {
						rad: newPoint[property],
						point: newPoint,
						id
					};
				}
			};
			/**
			* @param x x-coordinate
			* @param y y-coordinate
			* @return ImageReference {x,y} Coordinate
			*/
			function imageRef(x, y) {
				return {
					x,
					y,
					toVec2: function toVec2() {
						return cjs["vec2"].clone([this.x, this.y]);
					},
					toVec3: function toVec3() {
						return cjs["vec3"].clone([
							this.x,
							this.y,
							1
						]);
					},
					round: function round() {
						this.x = this.x > 0 ? Math.floor(this.x + .5) : Math.floor(this.x - .5);
						this.y = this.y > 0 ? Math.floor(this.y + .5) : Math.floor(this.y - .5);
						return this;
					}
				};
			}
			/**
			* Computes an integral image of a given grayscale image.
			* @param imageDataContainer {ImageDataContainer} the image to be integrated
			*/
			function computeIntegralImage2(imageWrapper, integralWrapper) {
				var imageData = imageWrapper.data;
				var width = imageWrapper.size.x;
				var height = imageWrapper.size.y;
				var integralImageData = integralWrapper.data;
				var sum = 0;
				var posA = 0;
				var posB = 0;
				var posC = 0;
				var posD = 0;
				var x;
				var y;
				posB = width;
				sum = 0;
				for (y = 1; y < height; y++) {
					sum += imageData[posA];
					integralImageData[posB] += sum;
					posA += width;
					posB += width;
				}
				posA = 0;
				posB = 1;
				sum = 0;
				for (x = 1; x < width; x++) {
					sum += imageData[posA];
					integralImageData[posB] += sum;
					posA++;
					posB++;
				}
				for (y = 1; y < height; y++) {
					posA = y * width + 1;
					posB = (y - 1) * width + 1;
					posC = y * width;
					posD = (y - 1) * width;
					for (x = 1; x < width; x++) {
						integralImageData[posA] += imageData[posA] + integralImageData[posB] + integralImageData[posC] - integralImageData[posD];
						posA++;
						posB++;
						posC++;
						posD++;
					}
				}
			}
			function computeIntegralImage(imageWrapper, integralWrapper) {
				var imageData = imageWrapper.data;
				var width = imageWrapper.size.x;
				var height = imageWrapper.size.y;
				var integralImageData = integralWrapper.data;
				var sum = 0;
				for (var i = 0; i < width; i++) {
					sum += imageData[i];
					integralImageData[i] = sum;
				}
				for (var v = 1; v < height; v++) {
					sum = 0;
					for (var u = 0; u < width; u++) {
						sum += imageData[v * width + u];
						integralImageData[v * width + u] = sum + integralImageData[(v - 1) * width + u];
					}
				}
			}
			function thresholdImage(imageWrapper, threshold, targetWrapper) {
				if (!targetWrapper) targetWrapper = imageWrapper;
				var imageData = imageWrapper.data;
				var length = imageData.length;
				var targetData = targetWrapper.data;
				while (length--) targetData[length] = imageData[length] < threshold ? 1 : 0;
			}
			function computeHistogram(imageWrapper, bitsPerPixel) {
				if (!bitsPerPixel) bitsPerPixel = 8;
				var imageData = imageWrapper.data;
				var length = imageData.length;
				var bitShift = 8 - bitsPerPixel;
				var bucketCnt = 1 << bitsPerPixel;
				var hist = new Int32Array(bucketCnt);
				while (length--) hist[imageData[length] >> bitShift]++;
				return hist;
			}
			function sharpenLine(line) {
				var i;
				var length = line.length;
				var left = line[0];
				var center = line[1];
				var right;
				for (i = 1; i < length - 1; i++) {
					right = line[i + 1];
					line[i - 1] = center * 2 - left - right & 255;
					left = center;
					center = right;
				}
				return line;
			}
			function determineOtsuThreshold(imageWrapper) {
				var bitsPerPixel = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 8;
				var hist;
				var bitShift = 8 - bitsPerPixel;
				function px(init, end) {
					var sum = 0;
					for (var i = init; i <= end; i++) sum += hist[i];
					return sum;
				}
				function mx(init, end) {
					var sum = 0;
					for (var i = init; i <= end; i++) sum += i * hist[i];
					return sum;
				}
				function determineThreshold() {
					var vet = [0];
					var p1;
					var p2;
					var p12;
					var m1;
					var m2;
					var m12;
					var max = (1 << bitsPerPixel) - 1;
					hist = computeHistogram(imageWrapper, bitsPerPixel);
					for (var k = 1; k < max; k++) {
						p1 = px(0, k);
						p2 = px(k + 1, max);
						p12 = p1 * p2;
						if (p12 === 0) p12 = 1;
						m1 = mx(0, k) * p2;
						m2 = mx(k + 1, max) * p1;
						m12 = m1 - m2;
						vet[k] = m12 * m12 / p12;
					}
					return array_helper["a"].maxIndex(vet);
				}
				return determineThreshold() << bitShift;
			}
			function otsuThreshold(imageWrapper, targetWrapper) {
				var threshold = determineOtsuThreshold(imageWrapper);
				thresholdImage(imageWrapper, threshold, targetWrapper);
				return threshold;
			}
			function computeBinaryImage(imageWrapper, integralWrapper, targetWrapper) {
				computeIntegralImage(imageWrapper, integralWrapper);
				if (!targetWrapper) targetWrapper = imageWrapper;
				var imageData = imageWrapper.data;
				var targetData = targetWrapper.data;
				var width = imageWrapper.size.x;
				var height = imageWrapper.size.y;
				var integralImageData = integralWrapper.data;
				var sum = 0;
				var v;
				var u;
				var kernel = 3;
				var A;
				var B;
				var C;
				var D;
				var avg;
				var size = (kernel * 2 + 1) * (kernel * 2 + 1);
				for (v = 0; v <= kernel; v++) for (u = 0; u < width; u++) {
					targetData[v * width + u] = 0;
					targetData[(height - 1 - v) * width + u] = 0;
				}
				for (v = kernel; v < height - kernel; v++) for (u = 0; u <= kernel; u++) {
					targetData[v * width + u] = 0;
					targetData[v * width + (width - 1 - u)] = 0;
				}
				for (v = kernel + 1; v < height - kernel - 1; v++) for (u = kernel + 1; u < width - kernel; u++) {
					A = integralImageData[(v - kernel - 1) * width + (u - kernel - 1)];
					B = integralImageData[(v - kernel - 1) * width + (u + kernel)];
					C = integralImageData[(v + kernel) * width + (u - kernel - 1)];
					D = integralImageData[(v + kernel) * width + (u + kernel)];
					sum = D - C - B + A;
					avg = sum / size;
					targetData[v * width + u] = imageData[v * width + u] > avg + 5 ? 0 : 1;
				}
			}
			function cv_utils_cluster(points, threshold, property) {
				var i;
				var k;
				var thisCluster;
				var point;
				var clusters = [];
				if (!property) property = "rad";
				function addToCluster(newPoint) {
					var found = false;
					for (k = 0; k < clusters.length; k++) {
						thisCluster = clusters[k];
						if (thisCluster.fits(newPoint)) {
							thisCluster.add(newPoint);
							found = true;
						}
					}
					return found;
				}
				for (i = 0; i < points.length; i++) {
					point = cluster.createPoint(points[i], i, property);
					if (!addToCluster(point)) clusters.push(cluster.create(point, threshold));
				}
				return clusters;
			}
			var Tracer = { trace: function trace(points, vec) {
				var iteration;
				var maxIterations = 10;
				var top = [];
				var result = [];
				var centerPos = 0;
				var currentPos = 0;
				function trace(idx, forward) {
					var to;
					var toIdx;
					var predictedPos;
					var thresholdX = 1;
					var thresholdY = Math.abs(vec[1] / 10);
					var found = false;
					function match(pos, predicted) {
						if (pos.x > predicted.x - thresholdX && pos.x < predicted.x + thresholdX && pos.y > predicted.y - thresholdY && pos.y < predicted.y + thresholdY) return true;
						return false;
					}
					var from = points[idx];
					if (forward) predictedPos = {
						x: from.x + vec[0],
						y: from.y + vec[1]
					};
					else predictedPos = {
						x: from.x - vec[0],
						y: from.y - vec[1]
					};
					toIdx = forward ? idx + 1 : idx - 1;
					to = points[toIdx];
					while (to && (found = match(to, predictedPos)) !== true && Math.abs(to.y - from.y) < vec[1]) {
						toIdx = forward ? toIdx + 1 : toIdx - 1;
						to = points[toIdx];
					}
					return found ? toIdx : null;
				}
				for (iteration = 0; iteration < maxIterations; iteration++) {
					centerPos = Math.floor(Math.random() * points.length);
					top = [];
					currentPos = centerPos;
					top.push(points[currentPos]);
					while ((currentPos = trace(currentPos, true)) !== null) top.push(points[currentPos]);
					if (centerPos > 0) {
						currentPos = centerPos;
						while ((currentPos = trace(currentPos, false)) !== null) top.push(points[currentPos]);
					}
					if (top.length > result.length) result = top;
				}
				return result;
			} };
			var DILATE = 1;
			var ERODE = 2;
			function dilate(inImageWrapper, outImageWrapper) {
				var v;
				var u;
				var inImageData = inImageWrapper.data;
				var outImageData = outImageWrapper.data;
				var height = inImageWrapper.size.y;
				var width = inImageWrapper.size.x;
				var sum;
				var yStart1;
				var yStart2;
				var xStart1;
				var xStart2;
				for (v = 1; v < height - 1; v++) for (u = 1; u < width - 1; u++) {
					yStart1 = v - 1;
					yStart2 = v + 1;
					xStart1 = u - 1;
					xStart2 = u + 1;
					sum = inImageData[yStart1 * width + xStart1] + inImageData[yStart1 * width + xStart2] + inImageData[v * width + u] + inImageData[yStart2 * width + xStart1] + inImageData[yStart2 * width + xStart2];
					outImageData[v * width + u] = sum > 0 ? 1 : 0;
				}
			}
			function erode(inImageWrapper, outImageWrapper) {
				var v;
				var u;
				var inImageData = inImageWrapper.data;
				var outImageData = outImageWrapper.data;
				var height = inImageWrapper.size.y;
				var width = inImageWrapper.size.x;
				var sum;
				var yStart1;
				var yStart2;
				var xStart1;
				var xStart2;
				for (v = 1; v < height - 1; v++) for (u = 1; u < width - 1; u++) {
					yStart1 = v - 1;
					yStart2 = v + 1;
					xStart1 = u - 1;
					xStart2 = u + 1;
					sum = inImageData[yStart1 * width + xStart1] + inImageData[yStart1 * width + xStart2] + inImageData[v * width + u] + inImageData[yStart2 * width + xStart1] + inImageData[yStart2 * width + xStart2];
					outImageData[v * width + u] = sum === 5 ? 1 : 0;
				}
			}
			function subtract(aImageWrapper, bImageWrapper, resultImageWrapper) {
				if (!resultImageWrapper) resultImageWrapper = aImageWrapper;
				var length = aImageWrapper.data.length;
				var aImageData = aImageWrapper.data;
				var bImageData = bImageWrapper.data;
				var cImageData = resultImageWrapper.data;
				while (length--) cImageData[length] = aImageData[length] - bImageData[length];
			}
			function bitwiseOr(aImageWrapper, bImageWrapper, resultImageWrapper) {
				if (!resultImageWrapper) resultImageWrapper = aImageWrapper;
				var length = aImageWrapper.data.length;
				var aImageData = aImageWrapper.data;
				var bImageData = bImageWrapper.data;
				var cImageData = resultImageWrapper.data;
				while (length--) cImageData[length] = aImageData[length] || bImageData[length];
			}
			function countNonZero(imageWrapper) {
				var length = imageWrapper.data.length;
				var data = imageWrapper.data;
				var sum = 0;
				while (length--) sum += data[length];
				return sum;
			}
			function topGeneric(list, top, scoreFunc) {
				var i;
				var minIdx = 0;
				var min = 0;
				var queue = [];
				var score;
				var hit;
				var pos;
				for (i = 0; i < top; i++) queue[i] = {
					score: 0,
					item: null
				};
				for (i = 0; i < list.length; i++) {
					score = scoreFunc.apply(this, [list[i]]);
					if (score > min) {
						hit = queue[minIdx];
						hit.score = score;
						hit.item = list[i];
						min = Number.MAX_VALUE;
						for (pos = 0; pos < top; pos++) if (queue[pos].score < min) {
							min = queue[pos].score;
							minIdx = pos;
						}
					}
				}
				return queue;
			}
			function grayArrayFromImage(htmlImage, offsetX, ctx, array) {
				ctx.drawImage(htmlImage, offsetX, 0, htmlImage.width, htmlImage.height);
				var ctxData = ctx.getImageData(offsetX, 0, htmlImage.width, htmlImage.height).data;
				computeGray(ctxData, array);
			}
			function grayArrayFromContext(ctx, size, offset, array) {
				var ctxData = ctx.getImageData(offset.x, offset.y, size.x, size.y).data;
				computeGray(ctxData, array);
			}
			function grayAndHalfSampleFromCanvasData(canvasData, size, outArray) {
				var topRowIdx = 0;
				var bottomRowIdx = size.x;
				var endIdx = Math.floor(canvasData.length / 4);
				var outWidth = size.x / 2;
				var outImgIdx = 0;
				var inWidth = size.x;
				var i;
				while (bottomRowIdx < endIdx) {
					for (i = 0; i < outWidth; i++) {
						outArray[outImgIdx] = (.299 * canvasData[topRowIdx * 4 + 0] + .587 * canvasData[topRowIdx * 4 + 1] + .114 * canvasData[topRowIdx * 4 + 2] + (.299 * canvasData[(topRowIdx + 1) * 4 + 0] + .587 * canvasData[(topRowIdx + 1) * 4 + 1] + .114 * canvasData[(topRowIdx + 1) * 4 + 2]) + (.299 * canvasData[bottomRowIdx * 4 + 0] + .587 * canvasData[bottomRowIdx * 4 + 1] + .114 * canvasData[bottomRowIdx * 4 + 2]) + (.299 * canvasData[(bottomRowIdx + 1) * 4 + 0] + .587 * canvasData[(bottomRowIdx + 1) * 4 + 1] + .114 * canvasData[(bottomRowIdx + 1) * 4 + 2])) / 4;
						outImgIdx++;
						topRowIdx += 2;
						bottomRowIdx += 2;
					}
					topRowIdx += inWidth;
					bottomRowIdx += inWidth;
				}
			}
			function computeGray(imageData, outArray, config) {
				var l = imageData.length / 4 | 0;
				if (config && config.singleChannel === true) for (var i = 0; i < l; i++) if (imageData[i * 4 + 3] === 0) outArray[i] = 255;
				else outArray[i] = imageData[i * 4 + 0];
				else for (var _i = 0; _i < l; _i++) if (imageData[_i * 4 + 3] === 0) outArray[_i] = 255;
				else outArray[_i] = .299 * imageData[_i * 4 + 0] + .587 * imageData[_i * 4 + 1] + .114 * imageData[_i * 4 + 2];
			}
			function loadImageArray(src, callback) {
				var canvas = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : document && document.createElement("canvas");
				var img = new Image();
				img.callback = callback;
				img.onload = function() {
					canvas.width = this.width;
					canvas.height = this.height;
					console.warn("* loadImageArray getContext 2d");
					var ctx = canvas.getContext("2d");
					ctx.drawImage(this, 0, 0);
					var array = new Uint8Array(this.width * this.height);
					ctx.drawImage(this, 0, 0);
					var data = ctx.getImageData(0, 0, this.width, this.height).data;
					computeGray(data, array);
					this.callback(array, {
						x: this.width,
						y: this.height
					}, this);
				};
				img.src = src;
			}
			/**
			* @param inImg {ImageWrapper} input image to be sampled
			* @param outImg {ImageWrapper} to be stored in
			*/
			function halfSample(inImgWrapper, outImgWrapper) {
				var inImg = inImgWrapper.data;
				var inWidth = inImgWrapper.size.x;
				var outImg = outImgWrapper.data;
				var topRowIdx = 0;
				var bottomRowIdx = inWidth;
				var endIdx = inImg.length;
				var outWidth = inWidth / 2;
				var outImgIdx = 0;
				while (bottomRowIdx < endIdx) {
					for (var i = 0; i < outWidth; i++) {
						outImg[outImgIdx] = Math.floor((inImg[topRowIdx] + inImg[topRowIdx + 1] + inImg[bottomRowIdx] + inImg[bottomRowIdx + 1]) / 4);
						outImgIdx++;
						topRowIdx += 2;
						bottomRowIdx += 2;
					}
					topRowIdx += inWidth;
					bottomRowIdx += inWidth;
				}
			}
			function hsv2rgb(hsv) {
				var rgb = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [
					0,
					0,
					0
				];
				var h = hsv[0];
				var s = hsv[1];
				var v = hsv[2];
				var c = v * s;
				var x = c * (1 - Math.abs(h / 60 % 2 - 1));
				var m = v - c;
				var r = 0;
				var g = 0;
				var b = 0;
				if (h < 60) {
					r = c;
					g = x;
				} else if (h < 120) {
					r = x;
					g = c;
				} else if (h < 180) {
					g = c;
					b = x;
				} else if (h < 240) {
					g = x;
					b = c;
				} else if (h < 300) {
					r = x;
					b = c;
				} else if (h < 360) {
					r = c;
					b = x;
				}
				rgb[0] = (r + m) * 255 | 0;
				rgb[1] = (g + m) * 255 | 0;
				rgb[2] = (b + m) * 255 | 0;
				return rgb;
			}
			function _computeDivisors(n) {
				if (!Number.isFinite(n) || n < 1) return [];
				var largeDivisors = [];
				var divisors = [];
				var sqrtN = Math.sqrt(n);
				for (var i = 1; i <= sqrtN; i++) if (n % i === 0) {
					divisors.push(i);
					if (i !== n / i) largeDivisors.unshift(Math.floor(n / i));
				}
				return divisors.concat(largeDivisors);
			}
			function _computeIntersection(arr1, arr2) {
				var i = 0;
				var j = 0;
				var result = [];
				while (i < arr1.length && j < arr2.length) if (arr1[i] === arr2[j]) {
					result.push(arr1[i]);
					i++;
					j++;
				} else if (arr1[i] > arr2[j]) j++;
				else i++;
				return result;
			}
			function calculatePatchSize(patchSize, imgSize) {
				var divisorsX = _computeDivisors(imgSize.x);
				var divisorsY = _computeDivisors(imgSize.y);
				var wideSide = Math.max(imgSize.x, imgSize.y);
				var common = _computeIntersection(divisorsX, divisorsY);
				var nrOfPatchesList = [
					8,
					10,
					15,
					20,
					32,
					60,
					80
				];
				var nrOfPatchesMap = {
					"x-small": 5,
					small: 4,
					medium: 3,
					large: 2,
					"x-large": 1
				};
				var nrOfPatchesIdx = nrOfPatchesMap[patchSize] || nrOfPatchesMap.medium;
				var nrOfPatches = nrOfPatchesList[nrOfPatchesIdx];
				var desiredPatchSize = Math.floor(wideSide / nrOfPatches);
				var optimalPatchSize;
				function findPatchSizeForDivisors(divisors) {
					var i = 0;
					var found = divisors[Math.floor(divisors.length / 2)];
					while (i < divisors.length - 1 && divisors[i] < desiredPatchSize) i++;
					if (i > 0) if (Math.abs(divisors[i] - desiredPatchSize) > Math.abs(divisors[i - 1] - desiredPatchSize)) found = divisors[i - 1];
					else found = divisors[i];
					if (desiredPatchSize / found < nrOfPatchesList[nrOfPatchesIdx + 1] / nrOfPatchesList[nrOfPatchesIdx] && desiredPatchSize / found > nrOfPatchesList[nrOfPatchesIdx - 1] / nrOfPatchesList[nrOfPatchesIdx]) return {
						x: found,
						y: found
					};
					return null;
				}
				optimalPatchSize = findPatchSizeForDivisors(common);
				if (!optimalPatchSize) {
					optimalPatchSize = findPatchSizeForDivisors(_computeDivisors(wideSide));
					if (!optimalPatchSize) optimalPatchSize = findPatchSizeForDivisors(_computeDivisors(desiredPatchSize * nrOfPatches));
				}
				if (!optimalPatchSize) optimalPatchSize = {
					x: Math.max(1, imgSize.x),
					y: Math.max(1, imgSize.y)
				};
				return optimalPatchSize;
			}
			function _parseCSSDimensionValues(value) {
				return {
					value: parseFloat(value),
					unit: value.indexOf("%") === value.length - 1 ? "%" : "%"
				};
			}
			var _dimensionsConverters = {
				top: function top(dimension, context) {
					return dimension.unit === "%" ? Math.floor(context.height * (dimension.value / 100)) : null;
				},
				right: function right(dimension, context) {
					return dimension.unit === "%" ? Math.floor(context.width - context.width * (dimension.value / 100)) : null;
				},
				bottom: function bottom(dimension, context) {
					return dimension.unit === "%" ? Math.floor(context.height - context.height * (dimension.value / 100)) : null;
				},
				left: function left(dimension, context) {
					return dimension.unit === "%" ? Math.floor(context.width * (dimension.value / 100)) : null;
				}
			};
			function computeImageArea(inputWidth, inputHeight, area) {
				var context = {
					width: inputWidth,
					height: inputHeight
				};
				var parsedArea = Object.keys(area).reduce(function(result, key) {
					if (!_dimensionsConverters[key]) return result;
					var value = area[key];
					var parsed = _parseCSSDimensionValues(value);
					result[key] = _dimensionsConverters[key](parsed, context);
					return result;
				}, {});
				return {
					sx: parsedArea.left,
					sy: parsedArea.top,
					sw: parsedArea.right - parsedArea.left,
					sh: parsedArea.bottom - parsedArea.top
				};
			}
		}),
		(function(module$14, exports$12, __webpack_require__) {
			var freeGlobal = __webpack_require__(51);
			/** Detect free variable `self`. */
			var freeSelf = typeof self == "object" && self && self.Object === Object && self;
			module$14.exports = freeGlobal || freeSelf || Function("return this")();
		}),
		(function(module$15, exports$13, __webpack_require__) {
			"use strict";
			Object.defineProperty(exports$13, "__esModule", { value: true });
			exports$13.RANDOM = exports$13.EPSILON = exports$13.ARRAY_TYPE = exports$13.ANGLE_ORDER = void 0;
			exports$13.equals = equals;
			exports$13.round = round;
			exports$13.setMatrixArrayType = setMatrixArrayType;
			exports$13.toDegree = toDegree;
			exports$13.toRadian = toRadian;
			/**
			* Common utilities
			* @module glMatrix
			*/
			var EPSILON = exports$13.EPSILON = 1e-6;
			exports$13.ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
			exports$13.RANDOM = Math.random;
			exports$13.ANGLE_ORDER = "zyx";
			/**
			* Symmetric round
			* see https://www.npmjs.com/package/round-half-up-symmetric#user-content-detailed-background
			*
			* @param {Number} a value to round
			*/
			function round(a) {
				if (a >= 0) return Math.round(a);
				return a % .5 === 0 ? Math.floor(a) : Math.round(a);
			}
			/**
			* Sets the type of array used when creating new vectors and matrices
			*
			* @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
			*/
			function setMatrixArrayType(type) {
				exports$13.ARRAY_TYPE = type;
			}
			var degree = Math.PI / 180;
			var radian = 180 / Math.PI;
			/**
			* Convert Degree To Radian
			*
			* @param {Number} a Angle in Degrees
			*/
			function toRadian(a) {
				return a * degree;
			}
			/**
			* Convert Radian To Degree
			*
			* @param {Number} a Angle in Radians
			*/
			function toDegree(a) {
				return a * radian;
			}
			/**
			* Tests whether or not the arguments have approximately the same value, within an absolute
			* or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
			* than or equal to 1.0, and a relative tolerance is used for larger values)
			*
			* @param {Number} a          The first number to test.
			* @param {Number} b          The second number to test.
			* @param {Number} tolerance  Absolute or relative tolerance (default glMatrix.EPSILON)
			* @returns {Boolean} True if the numbers are approximately equal, false otherwise.
			*/
			function equals(a, b) {
				var tolerance = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : EPSILON;
				return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
			}
		}),
		(function(module$16, exports$14) {
			function _typeof(o) {
				"@babel/helpers - typeof";
				return module$16.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, module$16.exports.__esModule = true, module$16.exports["default"] = module$16.exports, _typeof(o);
			}
			module$16.exports = _typeof, module$16.exports.__esModule = true, module$16.exports["default"] = module$16.exports;
		}),
		(function(module$17, exports$15) {
			/**
			* Checks if `value` is the
			* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
			* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an object, else `false`.
			* @example
			*
			* _.isObject({});
			* // => true
			*
			* _.isObject([1, 2, 3]);
			* // => true
			*
			* _.isObject(_.noop);
			* // => true
			*
			* _.isObject(null);
			* // => false
			*/
			function isObject(value) {
				var type = typeof value;
				return value != null && (type == "object" || type == "function");
			}
			module$17.exports = isObject;
		}),
		(function(module$18, exports$16) {
			/**
			* Checks if `value` is object-like. A value is object-like if it's not `null`
			* and has a `typeof` result of "object".
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
			* @example
			*
			* _.isObjectLike({});
			* // => true
			*
			* _.isObjectLike([1, 2, 3]);
			* // => true
			*
			* _.isObjectLike(_.noop);
			* // => false
			*
			* _.isObjectLike(null);
			* // => false
			*/
			function isObjectLike(value) {
				return value != null && typeof value == "object";
			}
			module$18.exports = isObjectLike;
		}),
		(function(module$19, exports$17) {
			module$19.exports = Array.isArray;
		}),
		(function(module$20, exports$18, __webpack_require__) {
			var superPropBase = __webpack_require__(163);
			function _get() {
				return module$20.exports = _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e, t, r) {
					var p = superPropBase(e, t);
					if (p) {
						var n = Object.getOwnPropertyDescriptor(p, t);
						return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value;
					}
				}, module$20.exports.__esModule = true, module$20.exports["default"] = module$20.exports, _get.apply(null, arguments);
			}
			module$20.exports = _get, module$20.exports.__esModule = true, module$20.exports["default"] = module$20.exports;
		}),
		(function(module$21, exports$19, __webpack_require__) {
			var baseIsNative = __webpack_require__(111), getValue = __webpack_require__(116);
			/**
			* Gets the native function at `key` of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {string} key The key of the method to get.
			* @returns {*} Returns the function if it's native, else `undefined`.
			*/
			function getNative(object, key) {
				var value = getValue(object, key);
				return baseIsNative(value) ? value : void 0;
			}
			module$21.exports = getNative;
		}),
		(function(module$22, exports$20, __webpack_require__) {
			var baseMerge = __webpack_require__(100);
			module$22.exports = __webpack_require__(142)(function(object, source, srcIndex) {
				baseMerge(object, source, srcIndex);
			});
		}),
		(function(module$23, exports$21, __webpack_require__) {
			var arrayWithoutHoles = __webpack_require__(164);
			var iterableToArray = __webpack_require__(165);
			var unsupportedIterableToArray = __webpack_require__(71);
			var nonIterableSpread = __webpack_require__(166);
			function _toConsumableArray(r) {
				return arrayWithoutHoles(r) || iterableToArray(r) || unsupportedIterableToArray(r) || nonIterableSpread();
			}
			module$23.exports = _toConsumableArray, module$23.exports.__esModule = true, module$23.exports["default"] = module$23.exports;
		}),
		(function(module$24, exports$22, __webpack_require__) {
			var Symbol = __webpack_require__(23), getRawTag = __webpack_require__(112), objectToString = __webpack_require__(113);
			/** `Object#toString` result references. */
			var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
			/** Built-in value references. */
			var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
			/**
			* The base implementation of `getTag` without fallbacks for buggy environments.
			*
			* @private
			* @param {*} value The value to query.
			* @returns {string} Returns the `toStringTag`.
			*/
			function baseGetTag(value) {
				if (value == null) return value === void 0 ? undefinedTag : nullTag;
				return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
			}
			module$24.exports = baseGetTag;
		}),
		(function(module$25, exports$23, __webpack_require__) {
			var assignValue = __webpack_require__(65), baseAssignValue = __webpack_require__(34);
			/**
			* Copies properties of `source` to `object`.
			*
			* @private
			* @param {Object} source The object to copy properties from.
			* @param {Array} props The property identifiers to copy.
			* @param {Object} [object={}] The object to copy properties to.
			* @param {Function} [customizer] The function to customize copied values.
			* @returns {Object} Returns `object`.
			*/
			function copyObject(source, props, object, customizer) {
				var isNew = !object;
				object || (object = {});
				var index = -1, length = props.length;
				while (++index < length) {
					var key = props[index];
					var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
					if (newValue === void 0) newValue = source[key];
					if (isNew) baseAssignValue(object, key, newValue);
					else assignValue(object, key, newValue);
				}
				return object;
			}
			module$25.exports = copyObject;
		}),
		(function(module$26, exports$24, __webpack_require__) {
			module$26.exports = __webpack_require__(11).Symbol;
		}),
		(function(module$27, exports$25, __webpack_require__) {
			var arrayLikeKeys = __webpack_require__(66), baseKeysIn = __webpack_require__(140), isArrayLike = __webpack_require__(30);
			/**
			* Creates an array of the own and inherited enumerable property names of `object`.
			*
			* **Note:** Non-object values are coerced to objects.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Object
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.keysIn(new Foo);
			* // => ['a', 'b', 'c'] (iteration order is not guaranteed)
			*/
			function keysIn(object) {
				return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
			}
			module$27.exports = keysIn;
		}),
		(function(module$28, exports$26, __webpack_require__) {
			var listCacheClear = __webpack_require__(101), listCacheDelete = __webpack_require__(102), listCacheGet = __webpack_require__(103), listCacheHas = __webpack_require__(104), listCacheSet = __webpack_require__(105);
			/**
			* Creates an list cache object.
			*
			* @private
			* @constructor
			* @param {Array} [entries] The key-value pairs to cache.
			*/
			function ListCache(entries) {
				var index = -1, length = entries == null ? 0 : entries.length;
				this.clear();
				while (++index < length) {
					var entry = entries[index];
					this.set(entry[0], entry[1]);
				}
			}
			ListCache.prototype.clear = listCacheClear;
			ListCache.prototype["delete"] = listCacheDelete;
			ListCache.prototype.get = listCacheGet;
			ListCache.prototype.has = listCacheHas;
			ListCache.prototype.set = listCacheSet;
			module$28.exports = ListCache;
		}),
		(function(module$29, exports$27, __webpack_require__) {
			var eq = __webpack_require__(27);
			/**
			* Gets the index at which the `key` is found in `array` of key-value pairs.
			*
			* @private
			* @param {Array} array The array to inspect.
			* @param {*} key The key to search for.
			* @returns {number} Returns the index of the matched value, else `-1`.
			*/
			function assocIndexOf(array, key) {
				var length = array.length;
				while (length--) if (eq(array[length][0], key)) return length;
				return -1;
			}
			module$29.exports = assocIndexOf;
		}),
		(function(module$30, exports$28) {
			/**
			* Performs a
			* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* comparison between two values to determine if they are equivalent.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to compare.
			* @param {*} other The other value to compare.
			* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
			* @example
			*
			* var object = { 'a': 1 };
			* var other = { 'a': 1 };
			*
			* _.eq(object, object);
			* // => true
			*
			* _.eq(object, other);
			* // => false
			*
			* _.eq('a', 'a');
			* // => true
			*
			* _.eq('a', Object('a'));
			* // => false
			*
			* _.eq(NaN, NaN);
			* // => true
			*/
			function eq(value, other) {
				return value === other || value !== value && other !== other;
			}
			module$30.exports = eq;
		}),
		(function(module$31, exports$29, __webpack_require__) {
			module$31.exports = __webpack_require__(18)(Object, "create");
		}),
		(function(module$32, exports$30, __webpack_require__) {
			var isKeyable = __webpack_require__(125);
			/**
			* Gets the data for `map`.
			*
			* @private
			* @param {Object} map The map to query.
			* @param {string} key The reference key.
			* @returns {*} Returns the map data.
			*/
			function getMapData(map, key) {
				var data = map.__data__;
				return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
			}
			module$32.exports = getMapData;
		}),
		(function(module$33, exports$31, __webpack_require__) {
			var isFunction = __webpack_require__(33), isLength = __webpack_require__(61);
			/**
			* Checks if `value` is array-like. A value is considered array-like if it's
			* not a function and has a `value.length` that's an integer greater than or
			* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
			* @example
			*
			* _.isArrayLike([1, 2, 3]);
			* // => true
			*
			* _.isArrayLike(document.body.children);
			* // => true
			*
			* _.isArrayLike('abc');
			* // => true
			*
			* _.isArrayLike(_.noop);
			* // => false
			*/
			function isArrayLike(value) {
				return value != null && isLength(value.length) && !isFunction(value);
			}
			module$33.exports = isArrayLike;
		}),
		(function(module$34, exports$32, __webpack_require__) {
			var arrayWithHoles = __webpack_require__(150);
			var iterableToArrayLimit = __webpack_require__(151);
			var unsupportedIterableToArray = __webpack_require__(71);
			var nonIterableRest = __webpack_require__(152);
			function _slicedToArray(r, e) {
				return arrayWithHoles(r) || iterableToArrayLimit(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
			}
			module$34.exports = _slicedToArray, module$34.exports.__esModule = true, module$34.exports["default"] = module$34.exports;
		}),
		(function(module$35, exports$33, __webpack_require__) {
			module$35.exports = __webpack_require__(18)(__webpack_require__(11), "Map");
		}),
		(function(module$36, exports$34, __webpack_require__) {
			var baseGetTag = __webpack_require__(21), isObject = __webpack_require__(14);
			/** `Object#toString` result references. */
			var asyncTag = "[object AsyncFunction]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
			/**
			* Checks if `value` is classified as a `Function` object.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a function, else `false`.
			* @example
			*
			* _.isFunction(_);
			* // => true
			*
			* _.isFunction(/abc/);
			* // => false
			*/
			function isFunction(value) {
				if (!isObject(value)) return false;
				var tag = baseGetTag(value);
				return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
			}
			module$36.exports = isFunction;
		}),
		(function(module$37, exports$35, __webpack_require__) {
			var defineProperty = __webpack_require__(55);
			/**
			* The base implementation of `assignValue` and `assignMergeValue` without
			* value checks.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {string} key The key of the property to assign.
			* @param {*} value The value to assign.
			*/
			function baseAssignValue(object, key, value) {
				if (key == "__proto__" && defineProperty) defineProperty(object, key, {
					"configurable": true,
					"enumerable": true,
					"value": value,
					"writable": true
				});
				else object[key] = value;
			}
			module$37.exports = baseAssignValue;
		}),
		(function(module$38, exports$36) {
			module$38.exports = function(module$39) {
				if (!module$39.webpackPolyfill) {
					module$39.deprecate = function() {};
					module$39.paths = [];
					if (!module$39.children) module$39.children = [];
					Object.defineProperty(module$39, "loaded", {
						enumerable: true,
						get: function() {
							return module$39.l;
						}
					});
					Object.defineProperty(module$39, "id", {
						enumerable: true,
						get: function() {
							return module$39.i;
						}
					});
					module$39.webpackPolyfill = 1;
				}
				return module$39;
			};
		}),
		(function(module$40, exports$37, __webpack_require__) {
			var Uint8Array = __webpack_require__(132);
			/**
			* Creates a clone of `arrayBuffer`.
			*
			* @private
			* @param {ArrayBuffer} arrayBuffer The array buffer to clone.
			* @returns {ArrayBuffer} Returns the cloned array buffer.
			*/
			function cloneArrayBuffer(arrayBuffer) {
				var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
				new Uint8Array(result).set(new Uint8Array(arrayBuffer));
				return result;
			}
			module$40.exports = cloneArrayBuffer;
		}),
		(function(module$41, exports$38, __webpack_require__) {
			module$41.exports = __webpack_require__(60)(Object.getPrototypeOf, Object);
		}),
		(function(module$42, exports$39) {
			/** Used for built-in method references. */
			var objectProto = Object.prototype;
			/**
			* Checks if `value` is likely a prototype object.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
			*/
			function isPrototype(value) {
				var Ctor = value && value.constructor;
				return value === (typeof Ctor == "function" && Ctor.prototype || objectProto);
			}
			module$42.exports = isPrototype;
		}),
		(function(module$43, exports$40, __webpack_require__) {
			var baseIsArguments = __webpack_require__(134), isObjectLike = __webpack_require__(15);
			/** Used for built-in method references. */
			var objectProto = Object.prototype;
			/** Used to check objects for own properties. */
			var hasOwnProperty = objectProto.hasOwnProperty;
			/** Built-in value references. */
			var propertyIsEnumerable = objectProto.propertyIsEnumerable;
			module$43.exports = baseIsArguments(function() {
				return arguments;
			}()) ? baseIsArguments : function(value) {
				return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
			};
		}),
		(function(module$44, exports$41, __webpack_require__) {
			(function(module$45) {
				var root = __webpack_require__(11), stubFalse = __webpack_require__(136);
				/** Detect free variable `exports`. */
				var freeExports = exports$41 && !exports$41.nodeType && exports$41;
				/** Detect free variable `module`. */
				var freeModule = freeExports && typeof module$45 == "object" && module$45 && !module$45.nodeType && module$45;
				/** Built-in value references. */
				var Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0;
				module$45.exports = (Buffer ? Buffer.isBuffer : void 0) || stubFalse;
			}).call(this, __webpack_require__(35)(module$44));
		}),
		(function(module$46, exports$42) {
			/**
			* The base implementation of `_.unary` without support for storing metadata.
			*
			* @private
			* @param {Function} func The function to cap arguments for.
			* @returns {Function} Returns the new capped function.
			*/
			function baseUnary(func) {
				return function(value) {
					return func(value);
				};
			}
			module$46.exports = baseUnary;
		}),
		(function(module$47, exports$43, __webpack_require__) {
			(function(module$48) {
				var freeGlobal = __webpack_require__(51);
				/** Detect free variable `exports`. */
				var freeExports = exports$43 && !exports$43.nodeType && exports$43;
				/** Detect free variable `module`. */
				var freeModule = freeExports && typeof module$48 == "object" && module$48 && !module$48.nodeType && module$48;
				/** Detect free variable `process` from Node.js. */
				var freeProcess = freeModule && freeModule.exports === freeExports && freeGlobal.process;
				module$48.exports = function() {
					try {
						var types = freeModule && freeModule.require && freeModule.require("util").types;
						if (types) return types;
						return freeProcess && freeProcess.binding && freeProcess.binding("util");
					} catch (e) {}
				}();
			}).call(this, __webpack_require__(35)(module$47));
		}),
		(function(module$49, exports$44) {
			function _setPrototypeOf(t, e) {
				return module$49.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
					return t.__proto__ = e, t;
				}, module$49.exports.__esModule = true, module$49.exports["default"] = module$49.exports, _setPrototypeOf(t, e);
			}
			module$49.exports = _setPrototypeOf, module$49.exports.__esModule = true, module$49.exports["default"] = module$49.exports;
		}),
		(function(module$50, exports$45, __webpack_require__) {
			var arrayLikeKeys = __webpack_require__(66), baseKeys = __webpack_require__(171), isArrayLike = __webpack_require__(30);
			/**
			* Creates an array of the own enumerable property names of `object`.
			*
			* **Note:** Non-object values are coerced to objects. See the
			* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
			* for more details.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Object
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.keys(new Foo);
			* // => ['a', 'b'] (iteration order is not guaranteed)
			*
			* _.keys('hi');
			* // => ['0', '1']
			*/
			function keys(object) {
				return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
			}
			module$50.exports = keys;
		}),
		(function(module$51, exports$46, __webpack_require__) {
			var arrayFilter = __webpack_require__(175), stubArray = __webpack_require__(85);
			/** Built-in value references. */
			var propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
			var nativeGetSymbols = Object.getOwnPropertySymbols;
			module$51.exports = !nativeGetSymbols ? stubArray : function(object) {
				if (object == null) return [];
				object = Object(object);
				return arrayFilter(nativeGetSymbols(object), function(symbol) {
					return propertyIsEnumerable.call(object, symbol);
				});
			};
		}),
		(function(module$52, exports$47) {
			/**
			* Appends the elements of `values` to `array`.
			*
			* @private
			* @param {Array} array The array to modify.
			* @param {Array} values The values to append.
			* @returns {Array} Returns `array`.
			*/
			function arrayPush(array, values) {
				var index = -1, length = values.length, offset = array.length;
				while (++index < length) array[offset + index] = values[index];
				return array;
			}
			module$52.exports = arrayPush;
		}),
		(function(module$53, exports$48, __webpack_require__) {
			var DataView = __webpack_require__(178), Map = __webpack_require__(32), Promise = __webpack_require__(179), Set = __webpack_require__(180), WeakMap = __webpack_require__(181), baseGetTag = __webpack_require__(21), toSource = __webpack_require__(52);
			/** `Object#toString` result references. */
			var mapTag = "[object Map]", objectTag = "[object Object]", promiseTag = "[object Promise]", setTag = "[object Set]", weakMapTag = "[object WeakMap]";
			var dataViewTag = "[object DataView]";
			/** Used to detect maps, sets, and weakmaps. */
			var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
			/**
			* Gets the `toStringTag` of `value`.
			*
			* @private
			* @param {*} value The value to query.
			* @returns {string} Returns the `toStringTag`.
			*/
			var getTag = baseGetTag;
			if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) getTag = function(value) {
				var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
				if (ctorString) switch (ctorString) {
					case dataViewCtorString: return dataViewTag;
					case mapCtorString: return mapTag;
					case promiseCtorString: return promiseTag;
					case setCtorString: return setTag;
					case weakMapCtorString: return weakMapTag;
				}
				return result;
			};
			module$53.exports = getTag;
		}),
		(function(module$54, exports$49, __webpack_require__) {
			var isArray = __webpack_require__(16), isKey = __webpack_require__(192), stringToPath = __webpack_require__(193), toString = __webpack_require__(196);
			/**
			* Casts `value` to a path array if it's not one.
			*
			* @private
			* @param {*} value The value to inspect.
			* @param {Object} [object] The object to query keys on.
			* @returns {Array} Returns the cast property path array.
			*/
			function castPath(value, object) {
				if (isArray(value)) return value;
				return isKey(value, object) ? [value] : stringToPath(toString(value));
			}
			module$54.exports = castPath;
		}),
		(function(module$55, exports$50, __webpack_require__) {
			var baseGetTag = __webpack_require__(21), isObjectLike = __webpack_require__(15);
			/** `Object#toString` result references. */
			var symbolTag = "[object Symbol]";
			/**
			* Checks if `value` is classified as a `Symbol` primitive or object.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
			* @example
			*
			* _.isSymbol(Symbol.iterator);
			* // => true
			*
			* _.isSymbol('abc');
			* // => false
			*/
			function isSymbol(value) {
				return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
			}
			module$55.exports = isSymbol;
		}),
		(function(module$56, exports$51, __webpack_require__) {
			var ListCache = __webpack_require__(25), stackClear = __webpack_require__(106), stackDelete = __webpack_require__(107), stackGet = __webpack_require__(108), stackHas = __webpack_require__(109), stackSet = __webpack_require__(110);
			/**
			* Creates a stack cache object to store key-value pairs.
			*
			* @private
			* @constructor
			* @param {Array} [entries] The key-value pairs to cache.
			*/
			function Stack(entries) {
				var data = this.__data__ = new ListCache(entries);
				this.size = data.size;
			}
			Stack.prototype.clear = stackClear;
			Stack.prototype["delete"] = stackDelete;
			Stack.prototype.get = stackGet;
			Stack.prototype.has = stackHas;
			Stack.prototype.set = stackSet;
			module$56.exports = Stack;
		}),
		(function(module$57, exports$52) {
			module$57.exports = typeof global == "object" && global && global.Object === Object && global;
		}),
		(function(module$58, exports$53) {
			/** Used to resolve the decompiled source of functions. */
			var funcToString = Function.prototype.toString;
			/**
			* Converts `func` to its source code.
			*
			* @private
			* @param {Function} func The function to convert.
			* @returns {string} Returns the source code.
			*/
			function toSource(func) {
				if (func != null) {
					try {
						return funcToString.call(func);
					} catch (e) {}
					try {
						return func + "";
					} catch (e) {}
				}
				return "";
			}
			module$58.exports = toSource;
		}),
		(function(module$59, exports$54, __webpack_require__) {
			var mapCacheClear = __webpack_require__(117), mapCacheDelete = __webpack_require__(124), mapCacheGet = __webpack_require__(126), mapCacheHas = __webpack_require__(127), mapCacheSet = __webpack_require__(128);
			/**
			* Creates a map cache object to store key-value pairs.
			*
			* @private
			* @constructor
			* @param {Array} [entries] The key-value pairs to cache.
			*/
			function MapCache(entries) {
				var index = -1, length = entries == null ? 0 : entries.length;
				this.clear();
				while (++index < length) {
					var entry = entries[index];
					this.set(entry[0], entry[1]);
				}
			}
			MapCache.prototype.clear = mapCacheClear;
			MapCache.prototype["delete"] = mapCacheDelete;
			MapCache.prototype.get = mapCacheGet;
			MapCache.prototype.has = mapCacheHas;
			MapCache.prototype.set = mapCacheSet;
			module$59.exports = MapCache;
		}),
		(function(module$60, exports$55, __webpack_require__) {
			var baseAssignValue = __webpack_require__(34), eq = __webpack_require__(27);
			/**
			* This function is like `assignValue` except that it doesn't assign
			* `undefined` values.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {string} key The key of the property to assign.
			* @param {*} value The value to assign.
			*/
			function assignMergeValue(object, key, value) {
				if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
			}
			module$60.exports = assignMergeValue;
		}),
		(function(module$61, exports$56, __webpack_require__) {
			var getNative = __webpack_require__(18);
			module$61.exports = function() {
				try {
					var func = getNative(Object, "defineProperty");
					func({}, "", {});
					return func;
				} catch (e) {}
			}();
		}),
		(function(module$62, exports$57, __webpack_require__) {
			(function(module$63) {
				var root = __webpack_require__(11);
				/** Detect free variable `exports`. */
				var freeExports = exports$57 && !exports$57.nodeType && exports$57;
				/** Detect free variable `module`. */
				var freeModule = freeExports && typeof module$63 == "object" && module$63 && !module$63.nodeType && module$63;
				/** Built-in value references. */
				var Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0, allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
				/**
				* Creates a clone of  `buffer`.
				*
				* @private
				* @param {Buffer} buffer The buffer to clone.
				* @param {boolean} [isDeep] Specify a deep clone.
				* @returns {Buffer} Returns the cloned buffer.
				*/
				function cloneBuffer(buffer, isDeep) {
					if (isDeep) return buffer.slice();
					var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
					buffer.copy(result);
					return result;
				}
				module$63.exports = cloneBuffer;
			}).call(this, __webpack_require__(35)(module$62));
		}),
		(function(module$64, exports$58, __webpack_require__) {
			var cloneArrayBuffer = __webpack_require__(36);
			/**
			* Creates a clone of `typedArray`.
			*
			* @private
			* @param {Object} typedArray The typed array to clone.
			* @param {boolean} [isDeep] Specify a deep clone.
			* @returns {Object} Returns the cloned typed array.
			*/
			function cloneTypedArray(typedArray, isDeep) {
				var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
				return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
			}
			module$64.exports = cloneTypedArray;
		}),
		(function(module$65, exports$59) {
			/**
			* Copies the values of `source` to `array`.
			*
			* @private
			* @param {Array} source The array to copy values from.
			* @param {Array} [array=[]] The array to copy values to.
			* @returns {Array} Returns `array`.
			*/
			function copyArray(source, array) {
				var index = -1, length = source.length;
				array || (array = Array(length));
				while (++index < length) array[index] = source[index];
				return array;
			}
			module$65.exports = copyArray;
		}),
		(function(module$66, exports$60, __webpack_require__) {
			var baseCreate = __webpack_require__(133), getPrototype = __webpack_require__(37), isPrototype = __webpack_require__(38);
			/**
			* Initializes an object clone.
			*
			* @private
			* @param {Object} object The object to clone.
			* @returns {Object} Returns the initialized clone.
			*/
			function initCloneObject(object) {
				return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
			}
			module$66.exports = initCloneObject;
		}),
		(function(module$67, exports$61) {
			/**
			* Creates a unary function that invokes `func` with its argument transformed.
			*
			* @private
			* @param {Function} func The function to wrap.
			* @param {Function} transform The argument transform.
			* @returns {Function} Returns the new function.
			*/
			function overArg(func, transform) {
				return function(arg) {
					return func(transform(arg));
				};
			}
			module$67.exports = overArg;
		}),
		(function(module$68, exports$62) {
			/** Used as references for various `Number` constants. */
			var MAX_SAFE_INTEGER = 9007199254740991;
			/**
			* Checks if `value` is a valid array-like length.
			*
			* **Note:** This method is loosely based on
			* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
			* @example
			*
			* _.isLength(3);
			* // => true
			*
			* _.isLength(Number.MIN_VALUE);
			* // => false
			*
			* _.isLength(Infinity);
			* // => false
			*
			* _.isLength('3');
			* // => false
			*/
			function isLength(value) {
				return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
			}
			module$68.exports = isLength;
		}),
		(function(module$69, exports$63, __webpack_require__) {
			var baseGetTag = __webpack_require__(21), getPrototype = __webpack_require__(37), isObjectLike = __webpack_require__(15);
			/** `Object#toString` result references. */
			var objectTag = "[object Object]";
			/** Used for built-in method references. */
			var funcProto = Function.prototype, objectProto = Object.prototype;
			/** Used to resolve the decompiled source of functions. */
			var funcToString = funcProto.toString;
			/** Used to check objects for own properties. */
			var hasOwnProperty = objectProto.hasOwnProperty;
			/** Used to infer the `Object` constructor. */
			var objectCtorString = funcToString.call(Object);
			/**
			* Checks if `value` is a plain object, that is, an object created by the
			* `Object` constructor or one with a `[[Prototype]]` of `null`.
			*
			* @static
			* @memberOf _
			* @since 0.8.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
			* @example
			*
			* function Foo() {
			*   this.a = 1;
			* }
			*
			* _.isPlainObject(new Foo);
			* // => false
			*
			* _.isPlainObject([1, 2, 3]);
			* // => false
			*
			* _.isPlainObject({ 'x': 0, 'y': 0 });
			* // => true
			*
			* _.isPlainObject(Object.create(null));
			* // => true
			*/
			function isPlainObject(value) {
				if (!isObjectLike(value) || baseGetTag(value) != objectTag) return false;
				var proto = getPrototype(value);
				if (proto === null) return true;
				var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
				return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
			}
			module$69.exports = isPlainObject;
		}),
		(function(module$70, exports$64, __webpack_require__) {
			var baseIsTypedArray = __webpack_require__(137), baseUnary = __webpack_require__(41), nodeUtil = __webpack_require__(42);
			var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
			module$70.exports = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
		}),
		(function(module$71, exports$65) {
			/**
			* Gets the value at `key`, unless `key` is "__proto__" or "constructor".
			*
			* @private
			* @param {Object} object The object to query.
			* @param {string} key The key of the property to get.
			* @returns {*} Returns the property value.
			*/
			function safeGet(object, key) {
				if (key === "constructor" && typeof object[key] === "function") return;
				if (key == "__proto__") return;
				return object[key];
			}
			module$71.exports = safeGet;
		}),
		(function(module$72, exports$66, __webpack_require__) {
			var baseAssignValue = __webpack_require__(34), eq = __webpack_require__(27);
			/** Used to check objects for own properties. */
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			/**
			* Assigns `value` to `key` of `object` if the existing value is not equivalent
			* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
			* for equality comparisons.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {string} key The key of the property to assign.
			* @param {*} value The value to assign.
			*/
			function assignValue(object, key, value) {
				var objValue = object[key];
				if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
			}
			module$72.exports = assignValue;
		}),
		(function(module$73, exports$67, __webpack_require__) {
			var baseTimes = __webpack_require__(139), isArguments = __webpack_require__(39), isArray = __webpack_require__(16), isBuffer = __webpack_require__(40), isIndex = __webpack_require__(67), isTypedArray = __webpack_require__(63);
			/** Used to check objects for own properties. */
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			/**
			* Creates an array of the enumerable property names of the array-like `value`.
			*
			* @private
			* @param {*} value The value to query.
			* @param {boolean} inherited Specify returning inherited property names.
			* @returns {Array} Returns the array of property names.
			*/
			function arrayLikeKeys(value, inherited) {
				var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
				for (var key in value) if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
				return result;
			}
			module$73.exports = arrayLikeKeys;
		}),
		(function(module$74, exports$68) {
			/** Used as references for various `Number` constants. */
			var MAX_SAFE_INTEGER = 9007199254740991;
			/** Used to detect unsigned integer values. */
			var reIsUint = /^(?:0|[1-9]\d*)$/;
			/**
			* Checks if `value` is a valid array-like index.
			*
			* @private
			* @param {*} value The value to check.
			* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
			* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
			*/
			function isIndex(value, length) {
				var type = typeof value;
				length = length == null ? MAX_SAFE_INTEGER : length;
				return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
			}
			module$74.exports = isIndex;
		}),
		(function(module$75, exports$69) {
			/**
			* This method returns the first argument it receives.
			*
			* @static
			* @since 0.1.0
			* @memberOf _
			* @category Util
			* @param {*} value Any value.
			* @returns {*} Returns `value`.
			* @example
			*
			* var object = { 'a': 1 };
			*
			* console.log(_.identity(object) === object);
			* // => true
			*/
			function identity(value) {
				return value;
			}
			module$75.exports = identity;
		}),
		(function(module$76, exports$70, __webpack_require__) {
			var apply = __webpack_require__(144);
			var nativeMax = Math.max;
			/**
			* A specialized version of `baseRest` which transforms the rest array.
			*
			* @private
			* @param {Function} func The function to apply a rest parameter to.
			* @param {number} [start=func.length-1] The start position of the rest parameter.
			* @param {Function} transform The rest array transform.
			* @returns {Function} Returns the new function.
			*/
			function overRest(func, start, transform) {
				start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
				return function() {
					var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
					while (++index < length) array[index] = args[start + index];
					index = -1;
					var otherArgs = Array(start + 1);
					while (++index < start) otherArgs[index] = args[index];
					otherArgs[start] = transform(array);
					return apply(func, this, otherArgs);
				};
			}
			module$76.exports = overRest;
		}),
		(function(module$77, exports$71, __webpack_require__) {
			var baseSetToString = __webpack_require__(145);
			module$77.exports = __webpack_require__(147)(baseSetToString);
		}),
		(function(module$78, exports$72, __webpack_require__) {
			var arrayLikeToArray = __webpack_require__(72);
			function _unsupportedIterableToArray(r, a) {
				if (r) {
					if ("string" == typeof r) return arrayLikeToArray(r, a);
					var t = {}.toString.call(r).slice(8, -1);
					return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
				}
			}
			module$78.exports = _unsupportedIterableToArray, module$78.exports.__esModule = true, module$78.exports["default"] = module$78.exports;
		}),
		(function(module$79, exports$73) {
			function _arrayLikeToArray(r, a) {
				(null == a || a > r.length) && (a = r.length);
				for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
				return n;
			}
			module$79.exports = _arrayLikeToArray, module$79.exports.__esModule = true, module$79.exports["default"] = module$79.exports;
		}),
		(function(module$80, exports$74, __webpack_require__) {
			var _typeof = __webpack_require__(13)["default"];
			var toPrimitive = __webpack_require__(153);
			function toPropertyKey(t) {
				var i = toPrimitive(t, "string");
				return "symbol" == _typeof(i) ? i : i + "";
			}
			module$80.exports = toPropertyKey, module$80.exports.__esModule = true, module$80.exports["default"] = module$80.exports;
		}),
		(function(module$81, exports$75, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$75, "__esModule", { value: true });
			exports$75.add = add;
			exports$75.adjoint = adjoint;
			exports$75.clone = clone;
			exports$75.copy = copy;
			exports$75.create = create;
			exports$75.determinant = determinant;
			exports$75.equals = equals;
			exports$75.exactEquals = exactEquals;
			exports$75.frob = frob;
			exports$75.fromMat2d = fromMat2d;
			exports$75.fromMat4 = fromMat4;
			exports$75.fromQuat = fromQuat;
			exports$75.fromRotation = fromRotation;
			exports$75.fromScaling = fromScaling;
			exports$75.fromTranslation = fromTranslation;
			exports$75.fromValues = fromValues;
			exports$75.identity = identity;
			exports$75.invert = invert;
			exports$75.mul = void 0;
			exports$75.multiply = multiply;
			exports$75.multiplyScalar = multiplyScalar;
			exports$75.multiplyScalarAndAdd = multiplyScalarAndAdd;
			exports$75.normalFromMat4 = normalFromMat4;
			exports$75.projection = projection;
			exports$75.rotate = rotate;
			exports$75.scale = scale;
			exports$75.set = set;
			exports$75.str = str;
			exports$75.sub = void 0;
			exports$75.subtract = subtract;
			exports$75.translate = translate;
			exports$75.transpose = transpose;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* 3x3 Matrix
			* @module mat3
			*/
			/**
			* Creates a new identity mat3
			*
			* @returns {mat3} a new 3x3 matrix
			*/
			function create() {
				var out = new glMatrix.ARRAY_TYPE(9);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					out[1] = 0;
					out[2] = 0;
					out[3] = 0;
					out[5] = 0;
					out[6] = 0;
					out[7] = 0;
				}
				out[0] = 1;
				out[4] = 1;
				out[8] = 1;
				return out;
			}
			/**
			* Copies the upper-left 3x3 values into the given mat3.
			*
			* @param {mat3} out the receiving 3x3 matrix
			* @param {ReadonlyMat4} a   the source 4x4 matrix
			* @returns {mat3} out
			*/
			function fromMat4(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[4];
				out[4] = a[5];
				out[5] = a[6];
				out[6] = a[8];
				out[7] = a[9];
				out[8] = a[10];
				return out;
			}
			/**
			* Creates a new mat3 initialized with values from an existing matrix
			*
			* @param {ReadonlyMat3} a matrix to clone
			* @returns {mat3} a new 3x3 matrix
			*/
			function clone(a) {
				var out = new glMatrix.ARRAY_TYPE(9);
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				out[4] = a[4];
				out[5] = a[5];
				out[6] = a[6];
				out[7] = a[7];
				out[8] = a[8];
				return out;
			}
			/**
			* Copy the values from one mat3 to another
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the source matrix
			* @returns {mat3} out
			*/
			function copy(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				out[4] = a[4];
				out[5] = a[5];
				out[6] = a[6];
				out[7] = a[7];
				out[8] = a[8];
				return out;
			}
			/**
			* Create a new mat3 with the given values
			*
			* @param {Number} m00 Component in column 0, row 0 position (index 0)
			* @param {Number} m01 Component in column 0, row 1 position (index 1)
			* @param {Number} m02 Component in column 0, row 2 position (index 2)
			* @param {Number} m10 Component in column 1, row 0 position (index 3)
			* @param {Number} m11 Component in column 1, row 1 position (index 4)
			* @param {Number} m12 Component in column 1, row 2 position (index 5)
			* @param {Number} m20 Component in column 2, row 0 position (index 6)
			* @param {Number} m21 Component in column 2, row 1 position (index 7)
			* @param {Number} m22 Component in column 2, row 2 position (index 8)
			* @returns {mat3} A new mat3
			*/
			function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
				var out = new glMatrix.ARRAY_TYPE(9);
				out[0] = m00;
				out[1] = m01;
				out[2] = m02;
				out[3] = m10;
				out[4] = m11;
				out[5] = m12;
				out[6] = m20;
				out[7] = m21;
				out[8] = m22;
				return out;
			}
			/**
			* Set the components of a mat3 to the given values
			*
			* @param {mat3} out the receiving matrix
			* @param {Number} m00 Component in column 0, row 0 position (index 0)
			* @param {Number} m01 Component in column 0, row 1 position (index 1)
			* @param {Number} m02 Component in column 0, row 2 position (index 2)
			* @param {Number} m10 Component in column 1, row 0 position (index 3)
			* @param {Number} m11 Component in column 1, row 1 position (index 4)
			* @param {Number} m12 Component in column 1, row 2 position (index 5)
			* @param {Number} m20 Component in column 2, row 0 position (index 6)
			* @param {Number} m21 Component in column 2, row 1 position (index 7)
			* @param {Number} m22 Component in column 2, row 2 position (index 8)
			* @returns {mat3} out
			*/
			function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
				out[0] = m00;
				out[1] = m01;
				out[2] = m02;
				out[3] = m10;
				out[4] = m11;
				out[5] = m12;
				out[6] = m20;
				out[7] = m21;
				out[8] = m22;
				return out;
			}
			/**
			* Set a mat3 to the identity matrix
			*
			* @param {mat3} out the receiving matrix
			* @returns {mat3} out
			*/
			function identity(out) {
				out[0] = 1;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 1;
				out[5] = 0;
				out[6] = 0;
				out[7] = 0;
				out[8] = 1;
				return out;
			}
			/**
			* Transpose the values of a mat3
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the source matrix
			* @returns {mat3} out
			*/
			function transpose(out, a) {
				if (out === a) {
					var a01 = a[1], a02 = a[2], a12 = a[5];
					out[1] = a[3];
					out[2] = a[6];
					out[3] = a01;
					out[5] = a[7];
					out[6] = a02;
					out[7] = a12;
				} else {
					out[0] = a[0];
					out[1] = a[3];
					out[2] = a[6];
					out[3] = a[1];
					out[4] = a[4];
					out[5] = a[7];
					out[6] = a[2];
					out[7] = a[5];
					out[8] = a[8];
				}
				return out;
			}
			/**
			* Inverts a mat3
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the source matrix
			* @returns {mat3 | null} out, or null if source matrix is not invertible
			*/
			function invert(out, a) {
				var a00 = a[0], a01 = a[1], a02 = a[2];
				var a10 = a[3], a11 = a[4], a12 = a[5];
				var a20 = a[6], a21 = a[7], a22 = a[8];
				var b01 = a22 * a11 - a12 * a21;
				var b11 = -a22 * a10 + a12 * a20;
				var b21 = a21 * a10 - a11 * a20;
				var det = a00 * b01 + a01 * b11 + a02 * b21;
				if (!det) return null;
				det = 1 / det;
				out[0] = b01 * det;
				out[1] = (-a22 * a01 + a02 * a21) * det;
				out[2] = (a12 * a01 - a02 * a11) * det;
				out[3] = b11 * det;
				out[4] = (a22 * a00 - a02 * a20) * det;
				out[5] = (-a12 * a00 + a02 * a10) * det;
				out[6] = b21 * det;
				out[7] = (-a21 * a00 + a01 * a20) * det;
				out[8] = (a11 * a00 - a01 * a10) * det;
				return out;
			}
			/**
			* Calculates the adjugate of a mat3
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the source matrix
			* @returns {mat3} out
			*/
			function adjoint(out, a) {
				var a00 = a[0], a01 = a[1], a02 = a[2];
				var a10 = a[3], a11 = a[4], a12 = a[5];
				var a20 = a[6], a21 = a[7], a22 = a[8];
				out[0] = a11 * a22 - a12 * a21;
				out[1] = a02 * a21 - a01 * a22;
				out[2] = a01 * a12 - a02 * a11;
				out[3] = a12 * a20 - a10 * a22;
				out[4] = a00 * a22 - a02 * a20;
				out[5] = a02 * a10 - a00 * a12;
				out[6] = a10 * a21 - a11 * a20;
				out[7] = a01 * a20 - a00 * a21;
				out[8] = a00 * a11 - a01 * a10;
				return out;
			}
			/**
			* Calculates the determinant of a mat3
			*
			* @param {ReadonlyMat3} a the source matrix
			* @returns {Number} determinant of a
			*/
			function determinant(a) {
				var a00 = a[0], a01 = a[1], a02 = a[2];
				var a10 = a[3], a11 = a[4], a12 = a[5];
				var a20 = a[6], a21 = a[7], a22 = a[8];
				return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
			}
			/**
			* Multiplies two mat3's
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the first operand
			* @param {ReadonlyMat3} b the second operand
			* @returns {mat3} out
			*/
			function multiply(out, a, b) {
				var a00 = a[0], a01 = a[1], a02 = a[2];
				var a10 = a[3], a11 = a[4], a12 = a[5];
				var a20 = a[6], a21 = a[7], a22 = a[8];
				var b00 = b[0], b01 = b[1], b02 = b[2];
				var b10 = b[3], b11 = b[4], b12 = b[5];
				var b20 = b[6], b21 = b[7], b22 = b[8];
				out[0] = b00 * a00 + b01 * a10 + b02 * a20;
				out[1] = b00 * a01 + b01 * a11 + b02 * a21;
				out[2] = b00 * a02 + b01 * a12 + b02 * a22;
				out[3] = b10 * a00 + b11 * a10 + b12 * a20;
				out[4] = b10 * a01 + b11 * a11 + b12 * a21;
				out[5] = b10 * a02 + b11 * a12 + b12 * a22;
				out[6] = b20 * a00 + b21 * a10 + b22 * a20;
				out[7] = b20 * a01 + b21 * a11 + b22 * a21;
				out[8] = b20 * a02 + b21 * a12 + b22 * a22;
				return out;
			}
			/**
			* Translate a mat3 by the given vector
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the matrix to translate
			* @param {ReadonlyVec2} v vector to translate by
			* @returns {mat3} out
			*/
			function translate(out, a, v) {
				var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
				out[0] = a00;
				out[1] = a01;
				out[2] = a02;
				out[3] = a10;
				out[4] = a11;
				out[5] = a12;
				out[6] = x * a00 + y * a10 + a20;
				out[7] = x * a01 + y * a11 + a21;
				out[8] = x * a02 + y * a12 + a22;
				return out;
			}
			/**
			* Rotates a mat3 by the given angle
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the matrix to rotate
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat3} out
			*/
			function rotate(out, a, rad) {
				var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
				out[0] = c * a00 + s * a10;
				out[1] = c * a01 + s * a11;
				out[2] = c * a02 + s * a12;
				out[3] = c * a10 - s * a00;
				out[4] = c * a11 - s * a01;
				out[5] = c * a12 - s * a02;
				out[6] = a20;
				out[7] = a21;
				out[8] = a22;
				return out;
			}
			/**
			* Scales the mat3 by the dimensions in the given vec2
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the matrix to scale
			* @param {ReadonlyVec2} v the vec2 to scale the matrix by
			* @returns {mat3} out
			**/
			function scale(out, a, v) {
				var x = v[0], y = v[1];
				out[0] = x * a[0];
				out[1] = x * a[1];
				out[2] = x * a[2];
				out[3] = y * a[3];
				out[4] = y * a[4];
				out[5] = y * a[5];
				out[6] = a[6];
				out[7] = a[7];
				out[8] = a[8];
				return out;
			}
			/**
			* Creates a matrix from a vector translation
			* This is equivalent to (but much faster than):
			*
			*     mat3.identity(dest);
			*     mat3.translate(dest, dest, vec);
			*
			* @param {mat3} out mat3 receiving operation result
			* @param {ReadonlyVec2} v Translation vector
			* @returns {mat3} out
			*/
			function fromTranslation(out, v) {
				out[0] = 1;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 1;
				out[5] = 0;
				out[6] = v[0];
				out[7] = v[1];
				out[8] = 1;
				return out;
			}
			/**
			* Creates a matrix from a given angle
			* This is equivalent to (but much faster than):
			*
			*     mat3.identity(dest);
			*     mat3.rotate(dest, dest, rad);
			*
			* @param {mat3} out mat3 receiving operation result
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat3} out
			*/
			function fromRotation(out, rad) {
				var s = Math.sin(rad), c = Math.cos(rad);
				out[0] = c;
				out[1] = s;
				out[2] = 0;
				out[3] = -s;
				out[4] = c;
				out[5] = 0;
				out[6] = 0;
				out[7] = 0;
				out[8] = 1;
				return out;
			}
			/**
			* Creates a matrix from a vector scaling
			* This is equivalent to (but much faster than):
			*
			*     mat3.identity(dest);
			*     mat3.scale(dest, dest, vec);
			*
			* @param {mat3} out mat3 receiving operation result
			* @param {ReadonlyVec2} v Scaling vector
			* @returns {mat3} out
			*/
			function fromScaling(out, v) {
				out[0] = v[0];
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = v[1];
				out[5] = 0;
				out[6] = 0;
				out[7] = 0;
				out[8] = 1;
				return out;
			}
			/**
			* Copies the values from a mat2d into a mat3
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat2d} a the matrix to copy
			* @returns {mat3} out
			**/
			function fromMat2d(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = 0;
				out[3] = a[2];
				out[4] = a[3];
				out[5] = 0;
				out[6] = a[4];
				out[7] = a[5];
				out[8] = 1;
				return out;
			}
			/**
			* Calculates a 3x3 matrix from the given quaternion
			*
			* @param {mat3} out mat3 receiving operation result
			* @param {ReadonlyQuat} q Quaternion to create matrix from
			*
			* @returns {mat3} out
			*/
			function fromQuat(out, q) {
				var x = q[0], y = q[1], z = q[2], w = q[3];
				var x2 = x + x;
				var y2 = y + y;
				var z2 = z + z;
				var xx = x * x2;
				var yx = y * x2;
				var yy = y * y2;
				var zx = z * x2;
				var zy = z * y2;
				var zz = z * z2;
				var wx = w * x2;
				var wy = w * y2;
				var wz = w * z2;
				out[0] = 1 - yy - zz;
				out[3] = yx - wz;
				out[6] = zx + wy;
				out[1] = yx + wz;
				out[4] = 1 - xx - zz;
				out[7] = zy - wx;
				out[2] = zx - wy;
				out[5] = zy + wx;
				out[8] = 1 - xx - yy;
				return out;
			}
			/**
			* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
			*
			* @param {mat3} out mat3 receiving operation result
			* @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
			*
			* @returns {mat3} out
			*/
			function normalFromMat4(out, a) {
				var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
				var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
				var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
				var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
				var b00 = a00 * a11 - a01 * a10;
				var b01 = a00 * a12 - a02 * a10;
				var b02 = a00 * a13 - a03 * a10;
				var b03 = a01 * a12 - a02 * a11;
				var b04 = a01 * a13 - a03 * a11;
				var b05 = a02 * a13 - a03 * a12;
				var b06 = a20 * a31 - a21 * a30;
				var b07 = a20 * a32 - a22 * a30;
				var b08 = a20 * a33 - a23 * a30;
				var b09 = a21 * a32 - a22 * a31;
				var b10 = a21 * a33 - a23 * a31;
				var b11 = a22 * a33 - a23 * a32;
				var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
				if (!det) return null;
				det = 1 / det;
				out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
				out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
				out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
				out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
				out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
				out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
				out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
				out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
				out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
				return out;
			}
			/**
			* Generates a 2D projection matrix with the given bounds
			*
			* @param {mat3} out mat3 frustum matrix will be written into
			* @param {number} width Width of your gl context
			* @param {number} height Height of gl context
			* @returns {mat3} out
			*/
			function projection(out, width, height) {
				out[0] = 2 / width;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = -2 / height;
				out[5] = 0;
				out[6] = -1;
				out[7] = 1;
				out[8] = 1;
				return out;
			}
			/**
			* Returns a string representation of a mat3
			*
			* @param {ReadonlyMat3} a matrix to represent as a string
			* @returns {String} string representation of the matrix
			*/
			function str(a) {
				return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
			}
			/**
			* Returns Frobenius norm of a mat3
			*
			* @param {ReadonlyMat3} a the matrix to calculate Frobenius norm of
			* @returns {Number} Frobenius norm
			*/
			function frob(a) {
				return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7] + a[8] * a[8]);
			}
			/**
			* Adds two mat3's
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the first operand
			* @param {ReadonlyMat3} b the second operand
			* @returns {mat3} out
			*/
			function add(out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				out[2] = a[2] + b[2];
				out[3] = a[3] + b[3];
				out[4] = a[4] + b[4];
				out[5] = a[5] + b[5];
				out[6] = a[6] + b[6];
				out[7] = a[7] + b[7];
				out[8] = a[8] + b[8];
				return out;
			}
			/**
			* Subtracts matrix b from matrix a
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the first operand
			* @param {ReadonlyMat3} b the second operand
			* @returns {mat3} out
			*/
			function subtract(out, a, b) {
				out[0] = a[0] - b[0];
				out[1] = a[1] - b[1];
				out[2] = a[2] - b[2];
				out[3] = a[3] - b[3];
				out[4] = a[4] - b[4];
				out[5] = a[5] - b[5];
				out[6] = a[6] - b[6];
				out[7] = a[7] - b[7];
				out[8] = a[8] - b[8];
				return out;
			}
			/**
			* Multiply each element of the matrix by a scalar.
			*
			* @param {mat3} out the receiving matrix
			* @param {ReadonlyMat3} a the matrix to scale
			* @param {Number} b amount to scale the matrix's elements by
			* @returns {mat3} out
			*/
			function multiplyScalar(out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				out[2] = a[2] * b;
				out[3] = a[3] * b;
				out[4] = a[4] * b;
				out[5] = a[5] * b;
				out[6] = a[6] * b;
				out[7] = a[7] * b;
				out[8] = a[8] * b;
				return out;
			}
			/**
			* Adds two mat3's after multiplying each element of the second operand by a scalar value.
			*
			* @param {mat3} out the receiving vector
			* @param {ReadonlyMat3} a the first operand
			* @param {ReadonlyMat3} b the second operand
			* @param {Number} scale the amount to scale b's elements by before adding
			* @returns {mat3} out
			*/
			function multiplyScalarAndAdd(out, a, b, scale) {
				out[0] = a[0] + b[0] * scale;
				out[1] = a[1] + b[1] * scale;
				out[2] = a[2] + b[2] * scale;
				out[3] = a[3] + b[3] * scale;
				out[4] = a[4] + b[4] * scale;
				out[5] = a[5] + b[5] * scale;
				out[6] = a[6] + b[6] * scale;
				out[7] = a[7] + b[7] * scale;
				out[8] = a[8] + b[8] * scale;
				return out;
			}
			/**
			* Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
			*
			* @param {ReadonlyMat3} a The first matrix.
			* @param {ReadonlyMat3} b The second matrix.
			* @returns {Boolean} True if the matrices are equal, false otherwise.
			*/
			function exactEquals(a, b) {
				return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
			}
			/**
			* Returns whether or not the matrices have approximately the same elements in the same position.
			*
			* @param {ReadonlyMat3} a The first matrix.
			* @param {ReadonlyMat3} b The second matrix.
			* @returns {Boolean} True if the matrices are equal, false otherwise.
			*/
			function equals(a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
				return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8));
			}
			exports$75.mul = multiply;
			exports$75.sub = subtract;
		}),
		(function(module$82, exports$76, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$76, "__esModule", { value: true });
			exports$76.add = add;
			exports$76.adjoint = adjoint;
			exports$76.clone = clone;
			exports$76.copy = copy;
			exports$76.create = create;
			exports$76.decompose = decompose;
			exports$76.determinant = determinant;
			exports$76.equals = equals;
			exports$76.exactEquals = exactEquals;
			exports$76.frob = frob;
			exports$76.fromQuat = fromQuat;
			exports$76.fromQuat2 = fromQuat2;
			exports$76.fromRotation = fromRotation;
			exports$76.fromRotationTranslation = fromRotationTranslation;
			exports$76.fromRotationTranslationScale = fromRotationTranslationScale;
			exports$76.fromRotationTranslationScaleOrigin = fromRotationTranslationScaleOrigin;
			exports$76.fromScaling = fromScaling;
			exports$76.fromTranslation = fromTranslation;
			exports$76.fromValues = fromValues;
			exports$76.fromXRotation = fromXRotation;
			exports$76.fromYRotation = fromYRotation;
			exports$76.fromZRotation = fromZRotation;
			exports$76.frustum = frustum;
			exports$76.getRotation = getRotation;
			exports$76.getScaling = getScaling;
			exports$76.getTranslation = getTranslation;
			exports$76.identity = identity;
			exports$76.invert = invert;
			exports$76.lookAt = lookAt;
			exports$76.mul = void 0;
			exports$76.multiply = multiply;
			exports$76.multiplyScalar = multiplyScalar;
			exports$76.multiplyScalarAndAdd = multiplyScalarAndAdd;
			exports$76.ortho = void 0;
			exports$76.orthoNO = orthoNO;
			exports$76.orthoZO = orthoZO;
			exports$76.perspective = void 0;
			exports$76.perspectiveFromFieldOfView = perspectiveFromFieldOfView;
			exports$76.perspectiveNO = perspectiveNO;
			exports$76.perspectiveZO = perspectiveZO;
			exports$76.rotate = rotate;
			exports$76.rotateX = rotateX;
			exports$76.rotateY = rotateY;
			exports$76.rotateZ = rotateZ;
			exports$76.scale = scale;
			exports$76.set = set;
			exports$76.str = str;
			exports$76.sub = void 0;
			exports$76.subtract = subtract;
			exports$76.targetTo = targetTo;
			exports$76.translate = translate;
			exports$76.transpose = transpose;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
			* @module mat4
			*/
			/**
			* Creates a new identity mat4
			*
			* @returns {mat4} a new 4x4 matrix
			*/
			function create() {
				var out = new glMatrix.ARRAY_TYPE(16);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					out[1] = 0;
					out[2] = 0;
					out[3] = 0;
					out[4] = 0;
					out[6] = 0;
					out[7] = 0;
					out[8] = 0;
					out[9] = 0;
					out[11] = 0;
					out[12] = 0;
					out[13] = 0;
					out[14] = 0;
				}
				out[0] = 1;
				out[5] = 1;
				out[10] = 1;
				out[15] = 1;
				return out;
			}
			/**
			* Creates a new mat4 initialized with values from an existing matrix
			*
			* @param {ReadonlyMat4} a matrix to clone
			* @returns {mat4} a new 4x4 matrix
			*/
			function clone(a) {
				var out = new glMatrix.ARRAY_TYPE(16);
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				out[4] = a[4];
				out[5] = a[5];
				out[6] = a[6];
				out[7] = a[7];
				out[8] = a[8];
				out[9] = a[9];
				out[10] = a[10];
				out[11] = a[11];
				out[12] = a[12];
				out[13] = a[13];
				out[14] = a[14];
				out[15] = a[15];
				return out;
			}
			/**
			* Copy the values from one mat4 to another
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the source matrix
			* @returns {mat4} out
			*/
			function copy(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				out[4] = a[4];
				out[5] = a[5];
				out[6] = a[6];
				out[7] = a[7];
				out[8] = a[8];
				out[9] = a[9];
				out[10] = a[10];
				out[11] = a[11];
				out[12] = a[12];
				out[13] = a[13];
				out[14] = a[14];
				out[15] = a[15];
				return out;
			}
			/**
			* Create a new mat4 with the given values
			*
			* @param {Number} m00 Component in column 0, row 0 position (index 0)
			* @param {Number} m01 Component in column 0, row 1 position (index 1)
			* @param {Number} m02 Component in column 0, row 2 position (index 2)
			* @param {Number} m03 Component in column 0, row 3 position (index 3)
			* @param {Number} m10 Component in column 1, row 0 position (index 4)
			* @param {Number} m11 Component in column 1, row 1 position (index 5)
			* @param {Number} m12 Component in column 1, row 2 position (index 6)
			* @param {Number} m13 Component in column 1, row 3 position (index 7)
			* @param {Number} m20 Component in column 2, row 0 position (index 8)
			* @param {Number} m21 Component in column 2, row 1 position (index 9)
			* @param {Number} m22 Component in column 2, row 2 position (index 10)
			* @param {Number} m23 Component in column 2, row 3 position (index 11)
			* @param {Number} m30 Component in column 3, row 0 position (index 12)
			* @param {Number} m31 Component in column 3, row 1 position (index 13)
			* @param {Number} m32 Component in column 3, row 2 position (index 14)
			* @param {Number} m33 Component in column 3, row 3 position (index 15)
			* @returns {mat4} A new mat4
			*/
			function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
				var out = new glMatrix.ARRAY_TYPE(16);
				out[0] = m00;
				out[1] = m01;
				out[2] = m02;
				out[3] = m03;
				out[4] = m10;
				out[5] = m11;
				out[6] = m12;
				out[7] = m13;
				out[8] = m20;
				out[9] = m21;
				out[10] = m22;
				out[11] = m23;
				out[12] = m30;
				out[13] = m31;
				out[14] = m32;
				out[15] = m33;
				return out;
			}
			/**
			* Set the components of a mat4 to the given values
			*
			* @param {mat4} out the receiving matrix
			* @param {Number} m00 Component in column 0, row 0 position (index 0)
			* @param {Number} m01 Component in column 0, row 1 position (index 1)
			* @param {Number} m02 Component in column 0, row 2 position (index 2)
			* @param {Number} m03 Component in column 0, row 3 position (index 3)
			* @param {Number} m10 Component in column 1, row 0 position (index 4)
			* @param {Number} m11 Component in column 1, row 1 position (index 5)
			* @param {Number} m12 Component in column 1, row 2 position (index 6)
			* @param {Number} m13 Component in column 1, row 3 position (index 7)
			* @param {Number} m20 Component in column 2, row 0 position (index 8)
			* @param {Number} m21 Component in column 2, row 1 position (index 9)
			* @param {Number} m22 Component in column 2, row 2 position (index 10)
			* @param {Number} m23 Component in column 2, row 3 position (index 11)
			* @param {Number} m30 Component in column 3, row 0 position (index 12)
			* @param {Number} m31 Component in column 3, row 1 position (index 13)
			* @param {Number} m32 Component in column 3, row 2 position (index 14)
			* @param {Number} m33 Component in column 3, row 3 position (index 15)
			* @returns {mat4} out
			*/
			function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
				out[0] = m00;
				out[1] = m01;
				out[2] = m02;
				out[3] = m03;
				out[4] = m10;
				out[5] = m11;
				out[6] = m12;
				out[7] = m13;
				out[8] = m20;
				out[9] = m21;
				out[10] = m22;
				out[11] = m23;
				out[12] = m30;
				out[13] = m31;
				out[14] = m32;
				out[15] = m33;
				return out;
			}
			/**
			* Set a mat4 to the identity matrix
			*
			* @param {mat4} out the receiving matrix
			* @returns {mat4} out
			*/
			function identity(out) {
				out[0] = 1;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = 1;
				out[6] = 0;
				out[7] = 0;
				out[8] = 0;
				out[9] = 0;
				out[10] = 1;
				out[11] = 0;
				out[12] = 0;
				out[13] = 0;
				out[14] = 0;
				out[15] = 1;
				return out;
			}
			/**
			* Transpose the values of a mat4
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the source matrix
			* @returns {mat4} out
			*/
			function transpose(out, a) {
				if (out === a) {
					var a01 = a[1], a02 = a[2], a03 = a[3];
					var a12 = a[6], a13 = a[7];
					var a23 = a[11];
					out[1] = a[4];
					out[2] = a[8];
					out[3] = a[12];
					out[4] = a01;
					out[6] = a[9];
					out[7] = a[13];
					out[8] = a02;
					out[9] = a12;
					out[11] = a[14];
					out[12] = a03;
					out[13] = a13;
					out[14] = a23;
				} else {
					out[0] = a[0];
					out[1] = a[4];
					out[2] = a[8];
					out[3] = a[12];
					out[4] = a[1];
					out[5] = a[5];
					out[6] = a[9];
					out[7] = a[13];
					out[8] = a[2];
					out[9] = a[6];
					out[10] = a[10];
					out[11] = a[14];
					out[12] = a[3];
					out[13] = a[7];
					out[14] = a[11];
					out[15] = a[15];
				}
				return out;
			}
			/**
			* Inverts a mat4
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the source matrix
			* @returns {mat4 | null} out, or null if source matrix is not invertible
			*/
			function invert(out, a) {
				var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
				var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
				var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
				var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
				var b00 = a00 * a11 - a01 * a10;
				var b01 = a00 * a12 - a02 * a10;
				var b02 = a00 * a13 - a03 * a10;
				var b03 = a01 * a12 - a02 * a11;
				var b04 = a01 * a13 - a03 * a11;
				var b05 = a02 * a13 - a03 * a12;
				var b06 = a20 * a31 - a21 * a30;
				var b07 = a20 * a32 - a22 * a30;
				var b08 = a20 * a33 - a23 * a30;
				var b09 = a21 * a32 - a22 * a31;
				var b10 = a21 * a33 - a23 * a31;
				var b11 = a22 * a33 - a23 * a32;
				var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
				if (!det) return null;
				det = 1 / det;
				out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
				out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
				out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
				out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
				out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
				out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
				out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
				out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
				out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
				out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
				out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
				out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
				out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
				out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
				out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
				out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
				return out;
			}
			/**
			* Calculates the adjugate of a mat4
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the source matrix
			* @returns {mat4} out
			*/
			function adjoint(out, a) {
				var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
				var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
				var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
				var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
				var b00 = a00 * a11 - a01 * a10;
				var b01 = a00 * a12 - a02 * a10;
				var b02 = a00 * a13 - a03 * a10;
				var b03 = a01 * a12 - a02 * a11;
				var b04 = a01 * a13 - a03 * a11;
				var b05 = a02 * a13 - a03 * a12;
				var b06 = a20 * a31 - a21 * a30;
				var b07 = a20 * a32 - a22 * a30;
				var b08 = a20 * a33 - a23 * a30;
				var b09 = a21 * a32 - a22 * a31;
				var b10 = a21 * a33 - a23 * a31;
				var b11 = a22 * a33 - a23 * a32;
				out[0] = a11 * b11 - a12 * b10 + a13 * b09;
				out[1] = a02 * b10 - a01 * b11 - a03 * b09;
				out[2] = a31 * b05 - a32 * b04 + a33 * b03;
				out[3] = a22 * b04 - a21 * b05 - a23 * b03;
				out[4] = a12 * b08 - a10 * b11 - a13 * b07;
				out[5] = a00 * b11 - a02 * b08 + a03 * b07;
				out[6] = a32 * b02 - a30 * b05 - a33 * b01;
				out[7] = a20 * b05 - a22 * b02 + a23 * b01;
				out[8] = a10 * b10 - a11 * b08 + a13 * b06;
				out[9] = a01 * b08 - a00 * b10 - a03 * b06;
				out[10] = a30 * b04 - a31 * b02 + a33 * b00;
				out[11] = a21 * b02 - a20 * b04 - a23 * b00;
				out[12] = a11 * b07 - a10 * b09 - a12 * b06;
				out[13] = a00 * b09 - a01 * b07 + a02 * b06;
				out[14] = a31 * b01 - a30 * b03 - a32 * b00;
				out[15] = a20 * b03 - a21 * b01 + a22 * b00;
				return out;
			}
			/**
			* Calculates the determinant of a mat4
			*
			* @param {ReadonlyMat4} a the source matrix
			* @returns {Number} determinant of a
			*/
			function determinant(a) {
				var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
				var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
				var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
				var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
				var b0 = a00 * a11 - a01 * a10;
				var b1 = a00 * a12 - a02 * a10;
				var b2 = a01 * a12 - a02 * a11;
				var b3 = a20 * a31 - a21 * a30;
				var b4 = a20 * a32 - a22 * a30;
				var b5 = a21 * a32 - a22 * a31;
				var b6 = a00 * b5 - a01 * b4 + a02 * b3;
				var b7 = a10 * b5 - a11 * b4 + a12 * b3;
				var b8 = a20 * b2 - a21 * b1 + a22 * b0;
				var b9 = a30 * b2 - a31 * b1 + a32 * b0;
				return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
			}
			/**
			* Multiplies two mat4s
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the first operand
			* @param {ReadonlyMat4} b the second operand
			* @returns {mat4} out
			*/
			function multiply(out, a, b) {
				var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
				var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
				var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
				var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
				out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
				out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
				out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
				out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
				b0 = b[4];
				b1 = b[5];
				b2 = b[6];
				b3 = b[7];
				out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
				out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
				out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
				out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
				b0 = b[8];
				b1 = b[9];
				b2 = b[10];
				b3 = b[11];
				out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
				out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
				out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
				out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
				b0 = b[12];
				b1 = b[13];
				b2 = b[14];
				b3 = b[15];
				out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
				out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
				out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
				out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
				return out;
			}
			/**
			* Translate a mat4 by the given vector
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the matrix to translate
			* @param {ReadonlyVec3} v vector to translate by
			* @returns {mat4} out
			*/
			function translate(out, a, v) {
				var x = v[0], y = v[1], z = v[2];
				var a00, a01, a02, a03;
				var a10, a11, a12, a13;
				var a20, a21, a22, a23;
				if (a === out) {
					out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
					out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
					out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
					out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
				} else {
					a00 = a[0];
					a01 = a[1];
					a02 = a[2];
					a03 = a[3];
					a10 = a[4];
					a11 = a[5];
					a12 = a[6];
					a13 = a[7];
					a20 = a[8];
					a21 = a[9];
					a22 = a[10];
					a23 = a[11];
					out[0] = a00;
					out[1] = a01;
					out[2] = a02;
					out[3] = a03;
					out[4] = a10;
					out[5] = a11;
					out[6] = a12;
					out[7] = a13;
					out[8] = a20;
					out[9] = a21;
					out[10] = a22;
					out[11] = a23;
					out[12] = a00 * x + a10 * y + a20 * z + a[12];
					out[13] = a01 * x + a11 * y + a21 * z + a[13];
					out[14] = a02 * x + a12 * y + a22 * z + a[14];
					out[15] = a03 * x + a13 * y + a23 * z + a[15];
				}
				return out;
			}
			/**
			* Scales the mat4 by the dimensions in the given vec3 not using vectorization
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the matrix to scale
			* @param {ReadonlyVec3} v the vec3 to scale the matrix by
			* @returns {mat4} out
			**/
			function scale(out, a, v) {
				var x = v[0], y = v[1], z = v[2];
				out[0] = a[0] * x;
				out[1] = a[1] * x;
				out[2] = a[2] * x;
				out[3] = a[3] * x;
				out[4] = a[4] * y;
				out[5] = a[5] * y;
				out[6] = a[6] * y;
				out[7] = a[7] * y;
				out[8] = a[8] * z;
				out[9] = a[9] * z;
				out[10] = a[10] * z;
				out[11] = a[11] * z;
				out[12] = a[12];
				out[13] = a[13];
				out[14] = a[14];
				out[15] = a[15];
				return out;
			}
			/**
			* Rotates a mat4 by the given angle around the given axis
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the matrix to rotate
			* @param {Number} rad the angle to rotate the matrix by
			* @param {ReadonlyVec3} axis the axis to rotate around
			* @returns {mat4} out
			*/
			function rotate(out, a, rad, axis) {
				var x = axis[0], y = axis[1], z = axis[2];
				var len = Math.sqrt(x * x + y * y + z * z);
				var s, c, t;
				var a00, a01, a02, a03;
				var a10, a11, a12, a13;
				var a20, a21, a22, a23;
				var b00, b01, b02;
				var b10, b11, b12;
				var b20, b21, b22;
				if (len < glMatrix.EPSILON) return null;
				len = 1 / len;
				x *= len;
				y *= len;
				z *= len;
				s = Math.sin(rad);
				c = Math.cos(rad);
				t = 1 - c;
				a00 = a[0];
				a01 = a[1];
				a02 = a[2];
				a03 = a[3];
				a10 = a[4];
				a11 = a[5];
				a12 = a[6];
				a13 = a[7];
				a20 = a[8];
				a21 = a[9];
				a22 = a[10];
				a23 = a[11];
				b00 = x * x * t + c;
				b01 = y * x * t + z * s;
				b02 = z * x * t - y * s;
				b10 = x * y * t - z * s;
				b11 = y * y * t + c;
				b12 = z * y * t + x * s;
				b20 = x * z * t + y * s;
				b21 = y * z * t - x * s;
				b22 = z * z * t + c;
				out[0] = a00 * b00 + a10 * b01 + a20 * b02;
				out[1] = a01 * b00 + a11 * b01 + a21 * b02;
				out[2] = a02 * b00 + a12 * b01 + a22 * b02;
				out[3] = a03 * b00 + a13 * b01 + a23 * b02;
				out[4] = a00 * b10 + a10 * b11 + a20 * b12;
				out[5] = a01 * b10 + a11 * b11 + a21 * b12;
				out[6] = a02 * b10 + a12 * b11 + a22 * b12;
				out[7] = a03 * b10 + a13 * b11 + a23 * b12;
				out[8] = a00 * b20 + a10 * b21 + a20 * b22;
				out[9] = a01 * b20 + a11 * b21 + a21 * b22;
				out[10] = a02 * b20 + a12 * b21 + a22 * b22;
				out[11] = a03 * b20 + a13 * b21 + a23 * b22;
				if (a !== out) {
					out[12] = a[12];
					out[13] = a[13];
					out[14] = a[14];
					out[15] = a[15];
				}
				return out;
			}
			/**
			* Rotates a matrix by the given angle around the X axis
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the matrix to rotate
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat4} out
			*/
			function rotateX(out, a, rad) {
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				var a10 = a[4];
				var a11 = a[5];
				var a12 = a[6];
				var a13 = a[7];
				var a20 = a[8];
				var a21 = a[9];
				var a22 = a[10];
				var a23 = a[11];
				if (a !== out) {
					out[0] = a[0];
					out[1] = a[1];
					out[2] = a[2];
					out[3] = a[3];
					out[12] = a[12];
					out[13] = a[13];
					out[14] = a[14];
					out[15] = a[15];
				}
				out[4] = a10 * c + a20 * s;
				out[5] = a11 * c + a21 * s;
				out[6] = a12 * c + a22 * s;
				out[7] = a13 * c + a23 * s;
				out[8] = a20 * c - a10 * s;
				out[9] = a21 * c - a11 * s;
				out[10] = a22 * c - a12 * s;
				out[11] = a23 * c - a13 * s;
				return out;
			}
			/**
			* Rotates a matrix by the given angle around the Y axis
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the matrix to rotate
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat4} out
			*/
			function rotateY(out, a, rad) {
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				var a00 = a[0];
				var a01 = a[1];
				var a02 = a[2];
				var a03 = a[3];
				var a20 = a[8];
				var a21 = a[9];
				var a22 = a[10];
				var a23 = a[11];
				if (a !== out) {
					out[4] = a[4];
					out[5] = a[5];
					out[6] = a[6];
					out[7] = a[7];
					out[12] = a[12];
					out[13] = a[13];
					out[14] = a[14];
					out[15] = a[15];
				}
				out[0] = a00 * c - a20 * s;
				out[1] = a01 * c - a21 * s;
				out[2] = a02 * c - a22 * s;
				out[3] = a03 * c - a23 * s;
				out[8] = a00 * s + a20 * c;
				out[9] = a01 * s + a21 * c;
				out[10] = a02 * s + a22 * c;
				out[11] = a03 * s + a23 * c;
				return out;
			}
			/**
			* Rotates a matrix by the given angle around the Z axis
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the matrix to rotate
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat4} out
			*/
			function rotateZ(out, a, rad) {
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				var a00 = a[0];
				var a01 = a[1];
				var a02 = a[2];
				var a03 = a[3];
				var a10 = a[4];
				var a11 = a[5];
				var a12 = a[6];
				var a13 = a[7];
				if (a !== out) {
					out[8] = a[8];
					out[9] = a[9];
					out[10] = a[10];
					out[11] = a[11];
					out[12] = a[12];
					out[13] = a[13];
					out[14] = a[14];
					out[15] = a[15];
				}
				out[0] = a00 * c + a10 * s;
				out[1] = a01 * c + a11 * s;
				out[2] = a02 * c + a12 * s;
				out[3] = a03 * c + a13 * s;
				out[4] = a10 * c - a00 * s;
				out[5] = a11 * c - a01 * s;
				out[6] = a12 * c - a02 * s;
				out[7] = a13 * c - a03 * s;
				return out;
			}
			/**
			* Creates a matrix from a vector translation
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.translate(dest, dest, vec);
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {ReadonlyVec3} v Translation vector
			* @returns {mat4} out
			*/
			function fromTranslation(out, v) {
				out[0] = 1;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = 1;
				out[6] = 0;
				out[7] = 0;
				out[8] = 0;
				out[9] = 0;
				out[10] = 1;
				out[11] = 0;
				out[12] = v[0];
				out[13] = v[1];
				out[14] = v[2];
				out[15] = 1;
				return out;
			}
			/**
			* Creates a matrix from a vector scaling
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.scale(dest, dest, vec);
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {ReadonlyVec3} v Scaling vector
			* @returns {mat4} out
			*/
			function fromScaling(out, v) {
				out[0] = v[0];
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = v[1];
				out[6] = 0;
				out[7] = 0;
				out[8] = 0;
				out[9] = 0;
				out[10] = v[2];
				out[11] = 0;
				out[12] = 0;
				out[13] = 0;
				out[14] = 0;
				out[15] = 1;
				return out;
			}
			/**
			* Creates a matrix from a given angle around a given axis
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.rotate(dest, dest, rad, axis);
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {Number} rad the angle to rotate the matrix by
			* @param {ReadonlyVec3} axis the axis to rotate around
			* @returns {mat4} out
			*/
			function fromRotation(out, rad, axis) {
				var x = axis[0], y = axis[1], z = axis[2];
				var len = Math.sqrt(x * x + y * y + z * z);
				var s, c, t;
				if (len < glMatrix.EPSILON) return null;
				len = 1 / len;
				x *= len;
				y *= len;
				z *= len;
				s = Math.sin(rad);
				c = Math.cos(rad);
				t = 1 - c;
				out[0] = x * x * t + c;
				out[1] = y * x * t + z * s;
				out[2] = z * x * t - y * s;
				out[3] = 0;
				out[4] = x * y * t - z * s;
				out[5] = y * y * t + c;
				out[6] = z * y * t + x * s;
				out[7] = 0;
				out[8] = x * z * t + y * s;
				out[9] = y * z * t - x * s;
				out[10] = z * z * t + c;
				out[11] = 0;
				out[12] = 0;
				out[13] = 0;
				out[14] = 0;
				out[15] = 1;
				return out;
			}
			/**
			* Creates a matrix from the given angle around the X axis
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.rotateX(dest, dest, rad);
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat4} out
			*/
			function fromXRotation(out, rad) {
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				out[0] = 1;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = c;
				out[6] = s;
				out[7] = 0;
				out[8] = 0;
				out[9] = -s;
				out[10] = c;
				out[11] = 0;
				out[12] = 0;
				out[13] = 0;
				out[14] = 0;
				out[15] = 1;
				return out;
			}
			/**
			* Creates a matrix from the given angle around the Y axis
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.rotateY(dest, dest, rad);
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat4} out
			*/
			function fromYRotation(out, rad) {
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				out[0] = c;
				out[1] = 0;
				out[2] = -s;
				out[3] = 0;
				out[4] = 0;
				out[5] = 1;
				out[6] = 0;
				out[7] = 0;
				out[8] = s;
				out[9] = 0;
				out[10] = c;
				out[11] = 0;
				out[12] = 0;
				out[13] = 0;
				out[14] = 0;
				out[15] = 1;
				return out;
			}
			/**
			* Creates a matrix from the given angle around the Z axis
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.rotateZ(dest, dest, rad);
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat4} out
			*/
			function fromZRotation(out, rad) {
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				out[0] = c;
				out[1] = s;
				out[2] = 0;
				out[3] = 0;
				out[4] = -s;
				out[5] = c;
				out[6] = 0;
				out[7] = 0;
				out[8] = 0;
				out[9] = 0;
				out[10] = 1;
				out[11] = 0;
				out[12] = 0;
				out[13] = 0;
				out[14] = 0;
				out[15] = 1;
				return out;
			}
			/**
			* Creates a matrix from a quaternion rotation and vector translation
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.translate(dest, dest, vec);
			*     let quatMat = mat4.create();
			*     mat4.fromQuat(quatMat, quat);
			*     mat4.multiply(dest, dest, quatMat);
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {quat} q Rotation quaternion
			* @param {ReadonlyVec3} v Translation vector
			* @returns {mat4} out
			*/
			function fromRotationTranslation(out, q, v) {
				var x = q[0], y = q[1], z = q[2], w = q[3];
				var x2 = x + x;
				var y2 = y + y;
				var z2 = z + z;
				var xx = x * x2;
				var xy = x * y2;
				var xz = x * z2;
				var yy = y * y2;
				var yz = y * z2;
				var zz = z * z2;
				var wx = w * x2;
				var wy = w * y2;
				var wz = w * z2;
				out[0] = 1 - (yy + zz);
				out[1] = xy + wz;
				out[2] = xz - wy;
				out[3] = 0;
				out[4] = xy - wz;
				out[5] = 1 - (xx + zz);
				out[6] = yz + wx;
				out[7] = 0;
				out[8] = xz + wy;
				out[9] = yz - wx;
				out[10] = 1 - (xx + yy);
				out[11] = 0;
				out[12] = v[0];
				out[13] = v[1];
				out[14] = v[2];
				out[15] = 1;
				return out;
			}
			/**
			* Creates a new mat4 from a dual quat.
			*
			* @param {mat4} out Matrix
			* @param {ReadonlyQuat2} a Dual Quaternion
			* @returns {mat4} mat4 receiving operation result
			*/
			function fromQuat2(out, a) {
				var translation = new glMatrix.ARRAY_TYPE(3);
				var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
				var magnitude = bx * bx + by * by + bz * bz + bw * bw;
				if (magnitude > 0) {
					translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
					translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
					translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
				} else {
					translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
					translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
					translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
				}
				fromRotationTranslation(out, a, translation);
				return out;
			}
			/**
			* Returns the translation vector component of a transformation
			*  matrix. If a matrix is built with fromRotationTranslation,
			*  the returned vector will be the same as the translation vector
			*  originally supplied.
			* @param  {vec3} out Vector to receive translation component
			* @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
			* @return {vec3} out
			*/
			function getTranslation(out, mat) {
				out[0] = mat[12];
				out[1] = mat[13];
				out[2] = mat[14];
				return out;
			}
			/**
			* Returns the scaling factor component of a transformation
			*  matrix. If a matrix is built with fromRotationTranslationScale
			*  with a normalized Quaternion parameter, the returned vector will be
			*  the same as the scaling vector
			*  originally supplied.
			* @param  {vec3} out Vector to receive scaling factor component
			* @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
			* @return {vec3} out
			*/
			function getScaling(out, mat) {
				var m11 = mat[0];
				var m12 = mat[1];
				var m13 = mat[2];
				var m21 = mat[4];
				var m22 = mat[5];
				var m23 = mat[6];
				var m31 = mat[8];
				var m32 = mat[9];
				var m33 = mat[10];
				out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
				out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
				out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
				return out;
			}
			/**
			* Returns a quaternion representing the rotational component
			*  of a transformation matrix. If a matrix is built with
			*  fromRotationTranslation, the returned quaternion will be the
			*  same as the quaternion originally supplied.
			* @param {quat} out Quaternion to receive the rotation component
			* @param {ReadonlyMat4} mat Matrix to be decomposed (input)
			* @return {quat} out
			*/
			function getRotation(out, mat) {
				var scaling = new glMatrix.ARRAY_TYPE(3);
				getScaling(scaling, mat);
				var is1 = 1 / scaling[0];
				var is2 = 1 / scaling[1];
				var is3 = 1 / scaling[2];
				var sm11 = mat[0] * is1;
				var sm12 = mat[1] * is2;
				var sm13 = mat[2] * is3;
				var sm21 = mat[4] * is1;
				var sm22 = mat[5] * is2;
				var sm23 = mat[6] * is3;
				var sm31 = mat[8] * is1;
				var sm32 = mat[9] * is2;
				var sm33 = mat[10] * is3;
				var trace = sm11 + sm22 + sm33;
				var S = 0;
				if (trace > 0) {
					S = Math.sqrt(trace + 1) * 2;
					out[3] = .25 * S;
					out[0] = (sm23 - sm32) / S;
					out[1] = (sm31 - sm13) / S;
					out[2] = (sm12 - sm21) / S;
				} else if (sm11 > sm22 && sm11 > sm33) {
					S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
					out[3] = (sm23 - sm32) / S;
					out[0] = .25 * S;
					out[1] = (sm12 + sm21) / S;
					out[2] = (sm31 + sm13) / S;
				} else if (sm22 > sm33) {
					S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
					out[3] = (sm31 - sm13) / S;
					out[0] = (sm12 + sm21) / S;
					out[1] = .25 * S;
					out[2] = (sm23 + sm32) / S;
				} else {
					S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
					out[3] = (sm12 - sm21) / S;
					out[0] = (sm31 + sm13) / S;
					out[1] = (sm23 + sm32) / S;
					out[2] = .25 * S;
				}
				return out;
			}
			/**
			* Decomposes a transformation matrix into its rotation, translation
			* and scale components. Returns only the rotation component
			* @param  {quat} out_r Quaternion to receive the rotation component
			* @param  {vec3} out_t Vector to receive the translation vector
			* @param  {vec3} out_s Vector to receive the scaling factor
			* @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
			* @returns {quat} out_r
			*/
			function decompose(out_r, out_t, out_s, mat) {
				out_t[0] = mat[12];
				out_t[1] = mat[13];
				out_t[2] = mat[14];
				var m11 = mat[0];
				var m12 = mat[1];
				var m13 = mat[2];
				var m21 = mat[4];
				var m22 = mat[5];
				var m23 = mat[6];
				var m31 = mat[8];
				var m32 = mat[9];
				var m33 = mat[10];
				out_s[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
				out_s[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
				out_s[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
				var is1 = 1 / out_s[0];
				var is2 = 1 / out_s[1];
				var is3 = 1 / out_s[2];
				var sm11 = m11 * is1;
				var sm12 = m12 * is2;
				var sm13 = m13 * is3;
				var sm21 = m21 * is1;
				var sm22 = m22 * is2;
				var sm23 = m23 * is3;
				var sm31 = m31 * is1;
				var sm32 = m32 * is2;
				var sm33 = m33 * is3;
				var trace = sm11 + sm22 + sm33;
				var S = 0;
				if (trace > 0) {
					S = Math.sqrt(trace + 1) * 2;
					out_r[3] = .25 * S;
					out_r[0] = (sm23 - sm32) / S;
					out_r[1] = (sm31 - sm13) / S;
					out_r[2] = (sm12 - sm21) / S;
				} else if (sm11 > sm22 && sm11 > sm33) {
					S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
					out_r[3] = (sm23 - sm32) / S;
					out_r[0] = .25 * S;
					out_r[1] = (sm12 + sm21) / S;
					out_r[2] = (sm31 + sm13) / S;
				} else if (sm22 > sm33) {
					S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
					out_r[3] = (sm31 - sm13) / S;
					out_r[0] = (sm12 + sm21) / S;
					out_r[1] = .25 * S;
					out_r[2] = (sm23 + sm32) / S;
				} else {
					S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
					out_r[3] = (sm12 - sm21) / S;
					out_r[0] = (sm31 + sm13) / S;
					out_r[1] = (sm23 + sm32) / S;
					out_r[2] = .25 * S;
				}
				return out_r;
			}
			/**
			* Creates a matrix from a quaternion rotation, vector translation and vector scale
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.translate(dest, dest, vec);
			*     let quatMat = mat4.create();
			*     mat4.fromQuat(quatMat, quat);
			*     mat4.multiply(dest, dest, quatMat);
			*     mat4.scale(dest, dest, scale)
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {quat} q Rotation quaternion
			* @param {ReadonlyVec3} v Translation vector
			* @param {ReadonlyVec3} s Scaling vector
			* @returns {mat4} out
			*/
			function fromRotationTranslationScale(out, q, v, s) {
				var x = q[0], y = q[1], z = q[2], w = q[3];
				var x2 = x + x;
				var y2 = y + y;
				var z2 = z + z;
				var xx = x * x2;
				var xy = x * y2;
				var xz = x * z2;
				var yy = y * y2;
				var yz = y * z2;
				var zz = z * z2;
				var wx = w * x2;
				var wy = w * y2;
				var wz = w * z2;
				var sx = s[0];
				var sy = s[1];
				var sz = s[2];
				out[0] = (1 - (yy + zz)) * sx;
				out[1] = (xy + wz) * sx;
				out[2] = (xz - wy) * sx;
				out[3] = 0;
				out[4] = (xy - wz) * sy;
				out[5] = (1 - (xx + zz)) * sy;
				out[6] = (yz + wx) * sy;
				out[7] = 0;
				out[8] = (xz + wy) * sz;
				out[9] = (yz - wx) * sz;
				out[10] = (1 - (xx + yy)) * sz;
				out[11] = 0;
				out[12] = v[0];
				out[13] = v[1];
				out[14] = v[2];
				out[15] = 1;
				return out;
			}
			/**
			* Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
			* This is equivalent to (but much faster than):
			*
			*     mat4.identity(dest);
			*     mat4.translate(dest, dest, vec);
			*     mat4.translate(dest, dest, origin);
			*     let quatMat = mat4.create();
			*     mat4.fromQuat(quatMat, quat);
			*     mat4.multiply(dest, dest, quatMat);
			*     mat4.scale(dest, dest, scale)
			*     mat4.translate(dest, dest, negativeOrigin);
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {quat} q Rotation quaternion
			* @param {ReadonlyVec3} v Translation vector
			* @param {ReadonlyVec3} s Scaling vector
			* @param {ReadonlyVec3} o The origin vector around which to scale and rotate
			* @returns {mat4} out
			*/
			function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
				var x = q[0], y = q[1], z = q[2], w = q[3];
				var x2 = x + x;
				var y2 = y + y;
				var z2 = z + z;
				var xx = x * x2;
				var xy = x * y2;
				var xz = x * z2;
				var yy = y * y2;
				var yz = y * z2;
				var zz = z * z2;
				var wx = w * x2;
				var wy = w * y2;
				var wz = w * z2;
				var sx = s[0];
				var sy = s[1];
				var sz = s[2];
				var ox = o[0];
				var oy = o[1];
				var oz = o[2];
				var out0 = (1 - (yy + zz)) * sx;
				var out1 = (xy + wz) * sx;
				var out2 = (xz - wy) * sx;
				var out4 = (xy - wz) * sy;
				var out5 = (1 - (xx + zz)) * sy;
				var out6 = (yz + wx) * sy;
				var out8 = (xz + wy) * sz;
				var out9 = (yz - wx) * sz;
				var out10 = (1 - (xx + yy)) * sz;
				out[0] = out0;
				out[1] = out1;
				out[2] = out2;
				out[3] = 0;
				out[4] = out4;
				out[5] = out5;
				out[6] = out6;
				out[7] = 0;
				out[8] = out8;
				out[9] = out9;
				out[10] = out10;
				out[11] = 0;
				out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
				out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
				out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
				out[15] = 1;
				return out;
			}
			/**
			* Calculates a 4x4 matrix from the given quaternion
			*
			* @param {mat4} out mat4 receiving operation result
			* @param {ReadonlyQuat} q Quaternion to create matrix from
			*
			* @returns {mat4} out
			*/
			function fromQuat(out, q) {
				var x = q[0], y = q[1], z = q[2], w = q[3];
				var x2 = x + x;
				var y2 = y + y;
				var z2 = z + z;
				var xx = x * x2;
				var yx = y * x2;
				var yy = y * y2;
				var zx = z * x2;
				var zy = z * y2;
				var zz = z * z2;
				var wx = w * x2;
				var wy = w * y2;
				var wz = w * z2;
				out[0] = 1 - yy - zz;
				out[1] = yx + wz;
				out[2] = zx - wy;
				out[3] = 0;
				out[4] = yx - wz;
				out[5] = 1 - xx - zz;
				out[6] = zy + wx;
				out[7] = 0;
				out[8] = zx + wy;
				out[9] = zy - wx;
				out[10] = 1 - xx - yy;
				out[11] = 0;
				out[12] = 0;
				out[13] = 0;
				out[14] = 0;
				out[15] = 1;
				return out;
			}
			/**
			* Generates a frustum matrix with the given bounds
			*
			* @param {mat4} out mat4 frustum matrix will be written into
			* @param {Number} left Left bound of the frustum
			* @param {Number} right Right bound of the frustum
			* @param {Number} bottom Bottom bound of the frustum
			* @param {Number} top Top bound of the frustum
			* @param {Number} near Near bound of the frustum
			* @param {Number} far Far bound of the frustum
			* @returns {mat4} out
			*/
			function frustum(out, left, right, bottom, top, near, far) {
				var rl = 1 / (right - left);
				var tb = 1 / (top - bottom);
				var nf = 1 / (near - far);
				out[0] = near * 2 * rl;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = near * 2 * tb;
				out[6] = 0;
				out[7] = 0;
				out[8] = (right + left) * rl;
				out[9] = (top + bottom) * tb;
				out[10] = (far + near) * nf;
				out[11] = -1;
				out[12] = 0;
				out[13] = 0;
				out[14] = far * near * 2 * nf;
				out[15] = 0;
				return out;
			}
			/**
			* Generates a perspective projection matrix with the given bounds.
			* The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
			* which matches WebGL/OpenGL's clip volume.
			* Passing null/undefined/no value for far will generate infinite projection matrix.
			*
			* @param {mat4} out mat4 frustum matrix will be written into
			* @param {number} fovy Vertical field of view in radians
			* @param {number} aspect Aspect ratio. typically viewport width/height
			* @param {number} near Near bound of the frustum
			* @param {number} far Far bound of the frustum, can be null or Infinity
			* @returns {mat4} out
			*/
			function perspectiveNO(out, fovy, aspect, near, far) {
				var f = 1 / Math.tan(fovy / 2);
				out[0] = f / aspect;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = f;
				out[6] = 0;
				out[7] = 0;
				out[8] = 0;
				out[9] = 0;
				out[11] = -1;
				out[12] = 0;
				out[13] = 0;
				out[15] = 0;
				if (far != null && far !== Infinity) {
					var nf = 1 / (near - far);
					out[10] = (far + near) * nf;
					out[14] = 2 * far * near * nf;
				} else {
					out[10] = -1;
					out[14] = -2 * near;
				}
				return out;
			}
			exports$76.perspective = perspectiveNO;
			/**
			* Generates a perspective projection matrix suitable for WebGPU with the given bounds.
			* The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
			* which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
			* Passing null/undefined/no value for far will generate infinite projection matrix.
			*
			* @param {mat4} out mat4 frustum matrix will be written into
			* @param {number} fovy Vertical field of view in radians
			* @param {number} aspect Aspect ratio. typically viewport width/height
			* @param {number} near Near bound of the frustum
			* @param {number} far Far bound of the frustum, can be null or Infinity
			* @returns {mat4} out
			*/
			function perspectiveZO(out, fovy, aspect, near, far) {
				var f = 1 / Math.tan(fovy / 2);
				out[0] = f / aspect;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = f;
				out[6] = 0;
				out[7] = 0;
				out[8] = 0;
				out[9] = 0;
				out[11] = -1;
				out[12] = 0;
				out[13] = 0;
				out[15] = 0;
				if (far != null && far !== Infinity) {
					var nf = 1 / (near - far);
					out[10] = far * nf;
					out[14] = far * near * nf;
				} else {
					out[10] = -1;
					out[14] = -near;
				}
				return out;
			}
			/**
			* Generates a perspective projection matrix with the given field of view.
			* This is primarily useful for generating projection matrices to be used
			* with the still experiemental WebVR API.
			*
			* @param {mat4} out mat4 frustum matrix will be written into
			* @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
			* @param {number} near Near bound of the frustum
			* @param {number} far Far bound of the frustum
			* @returns {mat4} out
			*/
			function perspectiveFromFieldOfView(out, fov, near, far) {
				var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
				var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
				var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
				var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
				var xScale = 2 / (leftTan + rightTan);
				var yScale = 2 / (upTan + downTan);
				out[0] = xScale;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = yScale;
				out[6] = 0;
				out[7] = 0;
				out[8] = -((leftTan - rightTan) * xScale * .5);
				out[9] = (upTan - downTan) * yScale * .5;
				out[10] = far / (near - far);
				out[11] = -1;
				out[12] = 0;
				out[13] = 0;
				out[14] = far * near / (near - far);
				out[15] = 0;
				return out;
			}
			/**
			* Generates a orthogonal projection matrix with the given bounds.
			* The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
			* which matches WebGL/OpenGL's clip volume.
			*
			* @param {mat4} out mat4 frustum matrix will be written into
			* @param {number} left Left bound of the frustum
			* @param {number} right Right bound of the frustum
			* @param {number} bottom Bottom bound of the frustum
			* @param {number} top Top bound of the frustum
			* @param {number} near Near bound of the frustum
			* @param {number} far Far bound of the frustum
			* @returns {mat4} out
			*/
			function orthoNO(out, left, right, bottom, top, near, far) {
				var lr = 1 / (left - right);
				var bt = 1 / (bottom - top);
				var nf = 1 / (near - far);
				out[0] = -2 * lr;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = -2 * bt;
				out[6] = 0;
				out[7] = 0;
				out[8] = 0;
				out[9] = 0;
				out[10] = 2 * nf;
				out[11] = 0;
				out[12] = (left + right) * lr;
				out[13] = (top + bottom) * bt;
				out[14] = (far + near) * nf;
				out[15] = 1;
				return out;
			}
			exports$76.ortho = orthoNO;
			/**
			* Generates a orthogonal projection matrix with the given bounds.
			* The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
			* which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
			*
			* @param {mat4} out mat4 frustum matrix will be written into
			* @param {number} left Left bound of the frustum
			* @param {number} right Right bound of the frustum
			* @param {number} bottom Bottom bound of the frustum
			* @param {number} top Top bound of the frustum
			* @param {number} near Near bound of the frustum
			* @param {number} far Far bound of the frustum
			* @returns {mat4} out
			*/
			function orthoZO(out, left, right, bottom, top, near, far) {
				var lr = 1 / (left - right);
				var bt = 1 / (bottom - top);
				var nf = 1 / (near - far);
				out[0] = -2 * lr;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				out[4] = 0;
				out[5] = -2 * bt;
				out[6] = 0;
				out[7] = 0;
				out[8] = 0;
				out[9] = 0;
				out[10] = nf;
				out[11] = 0;
				out[12] = (left + right) * lr;
				out[13] = (top + bottom) * bt;
				out[14] = near * nf;
				out[15] = 1;
				return out;
			}
			/**
			* Generates a look-at matrix with the given eye position, focal point, and up axis.
			* If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
			*
			* @param {mat4} out mat4 frustum matrix will be written into
			* @param {ReadonlyVec3} eye Position of the viewer
			* @param {ReadonlyVec3} center Point the viewer is looking at
			* @param {ReadonlyVec3} up vec3 pointing up
			* @returns {mat4} out
			*/
			function lookAt(out, eye, center, up) {
				var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
				var eyex = eye[0];
				var eyey = eye[1];
				var eyez = eye[2];
				var upx = up[0];
				var upy = up[1];
				var upz = up[2];
				var centerx = center[0];
				var centery = center[1];
				var centerz = center[2];
				if (Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON) return identity(out);
				z0 = eyex - centerx;
				z1 = eyey - centery;
				z2 = eyez - centerz;
				len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
				z0 *= len;
				z1 *= len;
				z2 *= len;
				x0 = upy * z2 - upz * z1;
				x1 = upz * z0 - upx * z2;
				x2 = upx * z1 - upy * z0;
				len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
				if (!len) {
					x0 = 0;
					x1 = 0;
					x2 = 0;
				} else {
					len = 1 / len;
					x0 *= len;
					x1 *= len;
					x2 *= len;
				}
				y0 = z1 * x2 - z2 * x1;
				y1 = z2 * x0 - z0 * x2;
				y2 = z0 * x1 - z1 * x0;
				len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
				if (!len) {
					y0 = 0;
					y1 = 0;
					y2 = 0;
				} else {
					len = 1 / len;
					y0 *= len;
					y1 *= len;
					y2 *= len;
				}
				out[0] = x0;
				out[1] = y0;
				out[2] = z0;
				out[3] = 0;
				out[4] = x1;
				out[5] = y1;
				out[6] = z1;
				out[7] = 0;
				out[8] = x2;
				out[9] = y2;
				out[10] = z2;
				out[11] = 0;
				out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
				out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
				out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
				out[15] = 1;
				return out;
			}
			/**
			* Generates a matrix that makes something look at something else.
			*
			* @param {mat4} out mat4 frustum matrix will be written into
			* @param {ReadonlyVec3} eye Position of the viewer
			* @param {ReadonlyVec3} target Point the viewer is looking at
			* @param {ReadonlyVec3} up vec3 pointing up
			* @returns {mat4} out
			*/
			function targetTo(out, eye, target, up) {
				var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
				var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
				var len = z0 * z0 + z1 * z1 + z2 * z2;
				if (len > 0) {
					len = 1 / Math.sqrt(len);
					z0 *= len;
					z1 *= len;
					z2 *= len;
				}
				var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
				len = x0 * x0 + x1 * x1 + x2 * x2;
				if (len > 0) {
					len = 1 / Math.sqrt(len);
					x0 *= len;
					x1 *= len;
					x2 *= len;
				}
				out[0] = x0;
				out[1] = x1;
				out[2] = x2;
				out[3] = 0;
				out[4] = z1 * x2 - z2 * x1;
				out[5] = z2 * x0 - z0 * x2;
				out[6] = z0 * x1 - z1 * x0;
				out[7] = 0;
				out[8] = z0;
				out[9] = z1;
				out[10] = z2;
				out[11] = 0;
				out[12] = eyex;
				out[13] = eyey;
				out[14] = eyez;
				out[15] = 1;
				return out;
			}
			/**
			* Returns a string representation of a mat4
			*
			* @param {ReadonlyMat4} a matrix to represent as a string
			* @returns {String} string representation of the matrix
			*/
			function str(a) {
				return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
			}
			/**
			* Returns Frobenius norm of a mat4
			*
			* @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
			* @returns {Number} Frobenius norm
			*/
			function frob(a) {
				return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + a[6] * a[6] + a[7] * a[7] + a[8] * a[8] + a[9] * a[9] + a[10] * a[10] + a[11] * a[11] + a[12] * a[12] + a[13] * a[13] + a[14] * a[14] + a[15] * a[15]);
			}
			/**
			* Adds two mat4's
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the first operand
			* @param {ReadonlyMat4} b the second operand
			* @returns {mat4} out
			*/
			function add(out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				out[2] = a[2] + b[2];
				out[3] = a[3] + b[3];
				out[4] = a[4] + b[4];
				out[5] = a[5] + b[5];
				out[6] = a[6] + b[6];
				out[7] = a[7] + b[7];
				out[8] = a[8] + b[8];
				out[9] = a[9] + b[9];
				out[10] = a[10] + b[10];
				out[11] = a[11] + b[11];
				out[12] = a[12] + b[12];
				out[13] = a[13] + b[13];
				out[14] = a[14] + b[14];
				out[15] = a[15] + b[15];
				return out;
			}
			/**
			* Subtracts matrix b from matrix a
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the first operand
			* @param {ReadonlyMat4} b the second operand
			* @returns {mat4} out
			*/
			function subtract(out, a, b) {
				out[0] = a[0] - b[0];
				out[1] = a[1] - b[1];
				out[2] = a[2] - b[2];
				out[3] = a[3] - b[3];
				out[4] = a[4] - b[4];
				out[5] = a[5] - b[5];
				out[6] = a[6] - b[6];
				out[7] = a[7] - b[7];
				out[8] = a[8] - b[8];
				out[9] = a[9] - b[9];
				out[10] = a[10] - b[10];
				out[11] = a[11] - b[11];
				out[12] = a[12] - b[12];
				out[13] = a[13] - b[13];
				out[14] = a[14] - b[14];
				out[15] = a[15] - b[15];
				return out;
			}
			/**
			* Multiply each element of the matrix by a scalar.
			*
			* @param {mat4} out the receiving matrix
			* @param {ReadonlyMat4} a the matrix to scale
			* @param {Number} b amount to scale the matrix's elements by
			* @returns {mat4} out
			*/
			function multiplyScalar(out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				out[2] = a[2] * b;
				out[3] = a[3] * b;
				out[4] = a[4] * b;
				out[5] = a[5] * b;
				out[6] = a[6] * b;
				out[7] = a[7] * b;
				out[8] = a[8] * b;
				out[9] = a[9] * b;
				out[10] = a[10] * b;
				out[11] = a[11] * b;
				out[12] = a[12] * b;
				out[13] = a[13] * b;
				out[14] = a[14] * b;
				out[15] = a[15] * b;
				return out;
			}
			/**
			* Adds two mat4's after multiplying each element of the second operand by a scalar value.
			*
			* @param {mat4} out the receiving vector
			* @param {ReadonlyMat4} a the first operand
			* @param {ReadonlyMat4} b the second operand
			* @param {Number} scale the amount to scale b's elements by before adding
			* @returns {mat4} out
			*/
			function multiplyScalarAndAdd(out, a, b, scale) {
				out[0] = a[0] + b[0] * scale;
				out[1] = a[1] + b[1] * scale;
				out[2] = a[2] + b[2] * scale;
				out[3] = a[3] + b[3] * scale;
				out[4] = a[4] + b[4] * scale;
				out[5] = a[5] + b[5] * scale;
				out[6] = a[6] + b[6] * scale;
				out[7] = a[7] + b[7] * scale;
				out[8] = a[8] + b[8] * scale;
				out[9] = a[9] + b[9] * scale;
				out[10] = a[10] + b[10] * scale;
				out[11] = a[11] + b[11] * scale;
				out[12] = a[12] + b[12] * scale;
				out[13] = a[13] + b[13] * scale;
				out[14] = a[14] + b[14] * scale;
				out[15] = a[15] + b[15] * scale;
				return out;
			}
			/**
			* Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
			*
			* @param {ReadonlyMat4} a The first matrix.
			* @param {ReadonlyMat4} b The second matrix.
			* @returns {Boolean} True if the matrices are equal, false otherwise.
			*/
			function exactEquals(a, b) {
				return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
			}
			/**
			* Returns whether or not the matrices have approximately the same elements in the same position.
			*
			* @param {ReadonlyMat4} a The first matrix.
			* @param {ReadonlyMat4} b The second matrix.
			* @returns {Boolean} True if the matrices are equal, false otherwise.
			*/
			function equals(a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
				var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
				var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
				var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
				var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
				var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
				var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
				return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
			}
			exports$76.mul = multiply;
			exports$76.sub = subtract;
		}),
		(function(module$83, exports$77, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$77, "__esModule", { value: true });
			exports$77.add = void 0;
			exports$77.calculateW = calculateW;
			exports$77.clone = void 0;
			exports$77.conjugate = conjugate;
			exports$77.copy = void 0;
			exports$77.create = create;
			exports$77.dot = void 0;
			exports$77.equals = equals;
			exports$77.exactEquals = void 0;
			exports$77.exp = exp;
			exports$77.fromEuler = fromEuler;
			exports$77.fromMat3 = fromMat3;
			exports$77.fromValues = void 0;
			exports$77.getAngle = getAngle;
			exports$77.getAxisAngle = getAxisAngle;
			exports$77.identity = identity;
			exports$77.invert = invert;
			exports$77.lerp = exports$77.length = exports$77.len = void 0;
			exports$77.ln = ln;
			exports$77.mul = void 0;
			exports$77.multiply = multiply;
			exports$77.normalize = void 0;
			exports$77.pow = pow;
			exports$77.random = random;
			exports$77.rotateX = rotateX;
			exports$77.rotateY = rotateY;
			exports$77.rotateZ = rotateZ;
			exports$77.setAxes = exports$77.set = exports$77.scale = exports$77.rotationTo = void 0;
			exports$77.setAxisAngle = setAxisAngle;
			exports$77.slerp = slerp;
			exports$77.squaredLength = exports$77.sqrLen = exports$77.sqlerp = void 0;
			exports$77.str = str;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			var mat3 = _interopRequireWildcard(__webpack_require__(74));
			var vec3 = _interopRequireWildcard(__webpack_require__(77));
			var vec4 = _interopRequireWildcard(__webpack_require__(78));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* Quaternion in the format XYZW
			* @module quat
			*/
			/**
			* Creates a new identity quat
			*
			* @returns {quat} a new quaternion
			*/
			function create() {
				var out = new glMatrix.ARRAY_TYPE(4);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					out[0] = 0;
					out[1] = 0;
					out[2] = 0;
				}
				out[3] = 1;
				return out;
			}
			/**
			* Set a quat to the identity quaternion
			*
			* @param {quat} out the receiving quaternion
			* @returns {quat} out
			*/
			function identity(out) {
				out[0] = 0;
				out[1] = 0;
				out[2] = 0;
				out[3] = 1;
				return out;
			}
			/**
			* Sets a quat from the given angle and rotation axis,
			* then returns it.
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyVec3} axis the axis around which to rotate
			* @param {Number} rad the angle in radians
			* @returns {quat} out
			**/
			function setAxisAngle(out, axis, rad) {
				rad = rad * .5;
				var s = Math.sin(rad);
				out[0] = s * axis[0];
				out[1] = s * axis[1];
				out[2] = s * axis[2];
				out[3] = Math.cos(rad);
				return out;
			}
			/**
			* Gets the rotation axis and angle for a given
			*  quaternion. If a quaternion is created with
			*  setAxisAngle, this method will return the same
			*  values as providied in the original parameter list
			*  OR functionally equivalent values.
			* Example: The quaternion formed by axis [0, 0, 1] and
			*  angle -90 is the same as the quaternion formed by
			*  [0, 0, 1] and 270. This method favors the latter.
			* @param  {vec3} out_axis  Vector receiving the axis of rotation
			* @param  {ReadonlyQuat} q     Quaternion to be decomposed
			* @return {Number}     Angle, in radians, of the rotation
			*/
			function getAxisAngle(out_axis, q) {
				var rad = Math.acos(q[3]) * 2;
				var s = Math.sin(rad / 2);
				if (s > glMatrix.EPSILON) {
					out_axis[0] = q[0] / s;
					out_axis[1] = q[1] / s;
					out_axis[2] = q[2] / s;
				} else {
					out_axis[0] = 1;
					out_axis[1] = 0;
					out_axis[2] = 0;
				}
				return rad;
			}
			/**
			* Gets the angular distance between two unit quaternions
			*
			* @param  {ReadonlyQuat} a     Origin unit quaternion
			* @param  {ReadonlyQuat} b     Destination unit quaternion
			* @return {Number}     Angle, in radians, between the two quaternions
			*/
			function getAngle(a, b) {
				var dotproduct = dot(a, b);
				return Math.acos(2 * dotproduct * dotproduct - 1);
			}
			/**
			* Multiplies two quat's
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a the first operand
			* @param {ReadonlyQuat} b the second operand
			* @returns {quat} out
			*/
			function multiply(out, a, b) {
				var ax = a[0], ay = a[1], az = a[2], aw = a[3];
				var bx = b[0], by = b[1], bz = b[2], bw = b[3];
				out[0] = ax * bw + aw * bx + ay * bz - az * by;
				out[1] = ay * bw + aw * by + az * bx - ax * bz;
				out[2] = az * bw + aw * bz + ax * by - ay * bx;
				out[3] = aw * bw - ax * bx - ay * by - az * bz;
				return out;
			}
			/**
			* Rotates a quaternion by the given angle about the X axis
			*
			* @param {quat} out quat receiving operation result
			* @param {ReadonlyQuat} a quat to rotate
			* @param {number} rad angle (in radians) to rotate
			* @returns {quat} out
			*/
			function rotateX(out, a, rad) {
				rad *= .5;
				var ax = a[0], ay = a[1], az = a[2], aw = a[3];
				var bx = Math.sin(rad), bw = Math.cos(rad);
				out[0] = ax * bw + aw * bx;
				out[1] = ay * bw + az * bx;
				out[2] = az * bw - ay * bx;
				out[3] = aw * bw - ax * bx;
				return out;
			}
			/**
			* Rotates a quaternion by the given angle about the Y axis
			*
			* @param {quat} out quat receiving operation result
			* @param {ReadonlyQuat} a quat to rotate
			* @param {number} rad angle (in radians) to rotate
			* @returns {quat} out
			*/
			function rotateY(out, a, rad) {
				rad *= .5;
				var ax = a[0], ay = a[1], az = a[2], aw = a[3];
				var by = Math.sin(rad), bw = Math.cos(rad);
				out[0] = ax * bw - az * by;
				out[1] = ay * bw + aw * by;
				out[2] = az * bw + ax * by;
				out[3] = aw * bw - ay * by;
				return out;
			}
			/**
			* Rotates a quaternion by the given angle about the Z axis
			*
			* @param {quat} out quat receiving operation result
			* @param {ReadonlyQuat} a quat to rotate
			* @param {number} rad angle (in radians) to rotate
			* @returns {quat} out
			*/
			function rotateZ(out, a, rad) {
				rad *= .5;
				var ax = a[0], ay = a[1], az = a[2], aw = a[3];
				var bz = Math.sin(rad), bw = Math.cos(rad);
				out[0] = ax * bw + ay * bz;
				out[1] = ay * bw - ax * bz;
				out[2] = az * bw + aw * bz;
				out[3] = aw * bw - az * bz;
				return out;
			}
			/**
			* Calculates the W component of a quat from the X, Y, and Z components.
			* Assumes that quaternion is 1 unit in length.
			* Any existing W component will be ignored.
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a quat to calculate W component of
			* @returns {quat} out
			*/
			function calculateW(out, a) {
				var x = a[0], y = a[1], z = a[2];
				out[0] = x;
				out[1] = y;
				out[2] = z;
				out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
				return out;
			}
			/**
			* Calculate the exponential of a unit quaternion.
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a quat to calculate the exponential of
			* @returns {quat} out
			*/
			function exp(out, a) {
				var x = a[0], y = a[1], z = a[2], w = a[3];
				var r = Math.sqrt(x * x + y * y + z * z);
				var et = Math.exp(w);
				var s = r > 0 ? et * Math.sin(r) / r : 0;
				out[0] = x * s;
				out[1] = y * s;
				out[2] = z * s;
				out[3] = et * Math.cos(r);
				return out;
			}
			/**
			* Calculate the natural logarithm of a unit quaternion.
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a quat to calculate the exponential of
			* @returns {quat} out
			*/
			function ln(out, a) {
				var x = a[0], y = a[1], z = a[2], w = a[3];
				var r = Math.sqrt(x * x + y * y + z * z);
				var t = r > 0 ? Math.atan2(r, w) / r : 0;
				out[0] = x * t;
				out[1] = y * t;
				out[2] = z * t;
				out[3] = .5 * Math.log(x * x + y * y + z * z + w * w);
				return out;
			}
			/**
			* Calculate the scalar power of a unit quaternion.
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a quat to calculate the exponential of
			* @param {Number} b amount to scale the quaternion by
			* @returns {quat} out
			*/
			function pow(out, a, b) {
				ln(out, a);
				scale(out, out, b);
				exp(out, out);
				return out;
			}
			/**
			* Performs a spherical linear interpolation between two quat
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a the first operand
			* @param {ReadonlyQuat} b the second operand
			* @param {Number} t interpolation amount, in the range [0-1], between the two inputs
			* @returns {quat} out
			*/
			function slerp(out, a, b, t) {
				var ax = a[0], ay = a[1], az = a[2], aw = a[3];
				var bx = b[0], by = b[1], bz = b[2], bw = b[3];
				var omega, cosom = ax * bx + ay * by + az * bz + aw * bw, sinom, scale0, scale1;
				if (cosom < 0) {
					cosom = -cosom;
					bx = -bx;
					by = -by;
					bz = -bz;
					bw = -bw;
				}
				if (1 - cosom > glMatrix.EPSILON) {
					omega = Math.acos(cosom);
					sinom = Math.sin(omega);
					scale0 = Math.sin((1 - t) * omega) / sinom;
					scale1 = Math.sin(t * omega) / sinom;
				} else {
					scale0 = 1 - t;
					scale1 = t;
				}
				out[0] = scale0 * ax + scale1 * bx;
				out[1] = scale0 * ay + scale1 * by;
				out[2] = scale0 * az + scale1 * bz;
				out[3] = scale0 * aw + scale1 * bw;
				return out;
			}
			/**
			* Generates a random unit quaternion
			*
			* @param {quat} out the receiving quaternion
			* @returns {quat} out
			*/
			function random(out) {
				var u1 = glMatrix.RANDOM();
				var u2 = glMatrix.RANDOM();
				var u3 = glMatrix.RANDOM();
				var sqrt1MinusU1 = Math.sqrt(1 - u1);
				var sqrtU1 = Math.sqrt(u1);
				out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
				out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
				out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
				out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
				return out;
			}
			/**
			* Calculates the inverse of a quat
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a quat to calculate inverse of
			* @returns {quat} out
			*/
			function invert(out, a) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
				var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
				var invDot = dot ? 1 / dot : 0;
				out[0] = -a0 * invDot;
				out[1] = -a1 * invDot;
				out[2] = -a2 * invDot;
				out[3] = a3 * invDot;
				return out;
			}
			/**
			* Calculates the conjugate of a quat
			* If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a quat to calculate conjugate of
			* @returns {quat} out
			*/
			function conjugate(out, a) {
				out[0] = -a[0];
				out[1] = -a[1];
				out[2] = -a[2];
				out[3] = a[3];
				return out;
			}
			/**
			* Creates a quaternion from the given 3x3 rotation matrix.
			*
			* NOTE: The resultant quaternion is not normalized, so you should be sure
			* to renormalize the quaternion yourself where necessary.
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyMat3} m rotation matrix
			* @returns {quat} out
			* @function
			*/
			function fromMat3(out, m) {
				var fTrace = m[0] + m[4] + m[8];
				var fRoot;
				if (fTrace > 0) {
					fRoot = Math.sqrt(fTrace + 1);
					out[3] = .5 * fRoot;
					fRoot = .5 / fRoot;
					out[0] = (m[5] - m[7]) * fRoot;
					out[1] = (m[6] - m[2]) * fRoot;
					out[2] = (m[1] - m[3]) * fRoot;
				} else {
					var i = 0;
					if (m[4] > m[0]) i = 1;
					if (m[8] > m[i * 3 + i]) i = 2;
					var j = (i + 1) % 3;
					var k = (i + 2) % 3;
					fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
					out[i] = .5 * fRoot;
					fRoot = .5 / fRoot;
					out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
					out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
					out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
				}
				return out;
			}
			/**
			* Creates a quaternion from the given euler angle x, y, z using the provided intrinsic order for the conversion.
			*
			* @param {quat} out the receiving quaternion
			* @param {Number} x Angle to rotate around X axis in degrees.
			* @param {Number} y Angle to rotate around Y axis in degrees.
			* @param {Number} z Angle to rotate around Z axis in degrees.
			* @param {'xyz'|'xzy'|'yxz'|'yzx'|'zxy'|'zyx'} order Intrinsic order for conversion, default is zyx.
			* @returns {quat} out
			* @function
			*/
			function fromEuler(out, x, y, z) {
				var order = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : glMatrix.ANGLE_ORDER;
				var halfToRad = Math.PI / 360;
				x *= halfToRad;
				z *= halfToRad;
				y *= halfToRad;
				var sx = Math.sin(x);
				var cx = Math.cos(x);
				var sy = Math.sin(y);
				var cy = Math.cos(y);
				var sz = Math.sin(z);
				var cz = Math.cos(z);
				switch (order) {
					case "xyz":
						out[0] = sx * cy * cz + cx * sy * sz;
						out[1] = cx * sy * cz - sx * cy * sz;
						out[2] = cx * cy * sz + sx * sy * cz;
						out[3] = cx * cy * cz - sx * sy * sz;
						break;
					case "xzy":
						out[0] = sx * cy * cz - cx * sy * sz;
						out[1] = cx * sy * cz - sx * cy * sz;
						out[2] = cx * cy * sz + sx * sy * cz;
						out[3] = cx * cy * cz + sx * sy * sz;
						break;
					case "yxz":
						out[0] = sx * cy * cz + cx * sy * sz;
						out[1] = cx * sy * cz - sx * cy * sz;
						out[2] = cx * cy * sz - sx * sy * cz;
						out[3] = cx * cy * cz + sx * sy * sz;
						break;
					case "yzx":
						out[0] = sx * cy * cz + cx * sy * sz;
						out[1] = cx * sy * cz + sx * cy * sz;
						out[2] = cx * cy * sz - sx * sy * cz;
						out[3] = cx * cy * cz - sx * sy * sz;
						break;
					case "zxy":
						out[0] = sx * cy * cz - cx * sy * sz;
						out[1] = cx * sy * cz + sx * cy * sz;
						out[2] = cx * cy * sz + sx * sy * cz;
						out[3] = cx * cy * cz - sx * sy * sz;
						break;
					case "zyx":
						out[0] = sx * cy * cz - cx * sy * sz;
						out[1] = cx * sy * cz + sx * cy * sz;
						out[2] = cx * cy * sz - sx * sy * cz;
						out[3] = cx * cy * cz + sx * sy * sz;
						break;
					default: throw new Error("Unknown angle order " + order);
				}
				return out;
			}
			/**
			* Returns a string representation of a quaternion
			*
			* @param {ReadonlyQuat} a vector to represent as a string
			* @returns {String} string representation of the vector
			*/
			function str(a) {
				return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
			}
			exports$77.clone = vec4.clone;
			exports$77.fromValues = vec4.fromValues;
			exports$77.copy = vec4.copy;
			exports$77.set = vec4.set;
			exports$77.add = vec4.add;
			exports$77.mul = multiply;
			/**
			* Scales a quat by a scalar number
			*
			* @param {quat} out the receiving vector
			* @param {ReadonlyQuat} a the vector to scale
			* @param {Number} b amount to scale the vector by
			* @returns {quat} out
			* @function
			*/
			var scale = exports$77.scale = vec4.scale;
			/**
			* Calculates the dot product of two quat's
			*
			* @param {ReadonlyQuat} a the first operand
			* @param {ReadonlyQuat} b the second operand
			* @returns {Number} dot product of a and b
			* @function
			*/
			var dot = exports$77.dot = vec4.dot;
			exports$77.lerp = vec4.lerp;
			exports$77.len = exports$77.length = vec4.length;
			exports$77.sqrLen = exports$77.squaredLength = vec4.squaredLength;
			/**
			* Normalize a quat
			*
			* @param {quat} out the receiving quaternion
			* @param {ReadonlyQuat} a quaternion to normalize
			* @returns {quat} out
			* @function
			*/
			var normalize = exports$77.normalize = vec4.normalize;
			exports$77.exactEquals = vec4.exactEquals;
			/**
			* Returns whether or not the quaternions point approximately to the same direction.
			*
			* Both quaternions are assumed to be unit length.
			*
			* @param {ReadonlyQuat} a The first unit quaternion.
			* @param {ReadonlyQuat} b The second unit quaternion.
			* @returns {Boolean} True if the quaternions are equal, false otherwise.
			*/
			function equals(a, b) {
				return Math.abs(vec4.dot(a, b)) >= 1 - glMatrix.EPSILON;
			}
			exports$77.rotationTo = function() {
				var tmpvec3 = vec3.create();
				var xUnitVec3 = vec3.fromValues(1, 0, 0);
				var yUnitVec3 = vec3.fromValues(0, 1, 0);
				return function(out, a, b) {
					var dot = vec3.dot(a, b);
					if (dot < -.999999) {
						vec3.cross(tmpvec3, xUnitVec3, a);
						if (vec3.len(tmpvec3) < 1e-6) vec3.cross(tmpvec3, yUnitVec3, a);
						vec3.normalize(tmpvec3, tmpvec3);
						setAxisAngle(out, tmpvec3, Math.PI);
						return out;
					} else if (dot > .999999) {
						out[0] = 0;
						out[1] = 0;
						out[2] = 0;
						out[3] = 1;
						return out;
					} else {
						vec3.cross(tmpvec3, a, b);
						out[0] = tmpvec3[0];
						out[1] = tmpvec3[1];
						out[2] = tmpvec3[2];
						out[3] = 1 + dot;
						return normalize(out, out);
					}
				};
			}();
			exports$77.sqlerp = function() {
				var temp1 = create();
				var temp2 = create();
				return function(out, a, b, c, d, t) {
					slerp(temp1, a, d, t);
					slerp(temp2, b, c, t);
					slerp(out, temp1, temp2, 2 * t * (1 - t));
					return out;
				};
			}();
			exports$77.setAxes = function() {
				var matr = mat3.create();
				return function(out, view, right, up) {
					matr[0] = right[0];
					matr[3] = right[1];
					matr[6] = right[2];
					matr[1] = up[0];
					matr[4] = up[1];
					matr[7] = up[2];
					matr[2] = -view[0];
					matr[5] = -view[1];
					matr[8] = -view[2];
					return normalize(out, fromMat3(out, matr));
				};
			}();
		}),
		(function(module$84, exports$78, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$78, "__esModule", { value: true });
			exports$78.add = add;
			exports$78.angle = angle;
			exports$78.bezier = bezier;
			exports$78.ceil = ceil;
			exports$78.clone = clone;
			exports$78.copy = copy;
			exports$78.create = create;
			exports$78.cross = cross;
			exports$78.dist = void 0;
			exports$78.distance = distance;
			exports$78.div = void 0;
			exports$78.divide = divide;
			exports$78.dot = dot;
			exports$78.equals = equals;
			exports$78.exactEquals = exactEquals;
			exports$78.floor = floor;
			exports$78.forEach = void 0;
			exports$78.fromValues = fromValues;
			exports$78.hermite = hermite;
			exports$78.inverse = inverse;
			exports$78.len = void 0;
			exports$78.length = length;
			exports$78.lerp = lerp;
			exports$78.max = max;
			exports$78.min = min;
			exports$78.mul = void 0;
			exports$78.multiply = multiply;
			exports$78.negate = negate;
			exports$78.normalize = normalize;
			exports$78.random = random;
			exports$78.rotateX = rotateX;
			exports$78.rotateY = rotateY;
			exports$78.rotateZ = rotateZ;
			exports$78.round = round;
			exports$78.scale = scale;
			exports$78.scaleAndAdd = scaleAndAdd;
			exports$78.set = set;
			exports$78.slerp = slerp;
			exports$78.sqrLen = exports$78.sqrDist = void 0;
			exports$78.squaredDistance = squaredDistance;
			exports$78.squaredLength = squaredLength;
			exports$78.str = str;
			exports$78.sub = void 0;
			exports$78.subtract = subtract;
			exports$78.transformMat3 = transformMat3;
			exports$78.transformMat4 = transformMat4;
			exports$78.transformQuat = transformQuat;
			exports$78.zero = zero;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* 3 Dimensional Vector
			* @module vec3
			*/
			/**
			* Creates a new, empty vec3
			*
			* @returns {vec3} a new 3D vector
			*/
			function create() {
				var out = new glMatrix.ARRAY_TYPE(3);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					out[0] = 0;
					out[1] = 0;
					out[2] = 0;
				}
				return out;
			}
			/**
			* Creates a new vec3 initialized with values from an existing vector
			*
			* @param {ReadonlyVec3} a vector to clone
			* @returns {vec3} a new 3D vector
			*/
			function clone(a) {
				var out = new glMatrix.ARRAY_TYPE(3);
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				return out;
			}
			/**
			* Calculates the length of a vec3
			*
			* @param {ReadonlyVec3} a vector to calculate length of
			* @returns {Number} length of a
			*/
			function length(a) {
				var x = a[0];
				var y = a[1];
				var z = a[2];
				return Math.sqrt(x * x + y * y + z * z);
			}
			/**
			* Creates a new vec3 initialized with the given values
			*
			* @param {Number} x X component
			* @param {Number} y Y component
			* @param {Number} z Z component
			* @returns {vec3} a new 3D vector
			*/
			function fromValues(x, y, z) {
				var out = new glMatrix.ARRAY_TYPE(3);
				out[0] = x;
				out[1] = y;
				out[2] = z;
				return out;
			}
			/**
			* Copy the values from one vec3 to another
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the source vector
			* @returns {vec3} out
			*/
			function copy(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				return out;
			}
			/**
			* Set the components of a vec3 to the given values
			*
			* @param {vec3} out the receiving vector
			* @param {Number} x X component
			* @param {Number} y Y component
			* @param {Number} z Z component
			* @returns {vec3} out
			*/
			function set(out, x, y, z) {
				out[0] = x;
				out[1] = y;
				out[2] = z;
				return out;
			}
			/**
			* Adds two vec3's
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {vec3} out
			*/
			function add(out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				out[2] = a[2] + b[2];
				return out;
			}
			/**
			* Subtracts vector b from vector a
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {vec3} out
			*/
			function subtract(out, a, b) {
				out[0] = a[0] - b[0];
				out[1] = a[1] - b[1];
				out[2] = a[2] - b[2];
				return out;
			}
			/**
			* Multiplies two vec3's
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {vec3} out
			*/
			function multiply(out, a, b) {
				out[0] = a[0] * b[0];
				out[1] = a[1] * b[1];
				out[2] = a[2] * b[2];
				return out;
			}
			/**
			* Divides two vec3's
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {vec3} out
			*/
			function divide(out, a, b) {
				out[0] = a[0] / b[0];
				out[1] = a[1] / b[1];
				out[2] = a[2] / b[2];
				return out;
			}
			/**
			* Math.ceil the components of a vec3
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a vector to ceil
			* @returns {vec3} out
			*/
			function ceil(out, a) {
				out[0] = Math.ceil(a[0]);
				out[1] = Math.ceil(a[1]);
				out[2] = Math.ceil(a[2]);
				return out;
			}
			/**
			* Math.floor the components of a vec3
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a vector to floor
			* @returns {vec3} out
			*/
			function floor(out, a) {
				out[0] = Math.floor(a[0]);
				out[1] = Math.floor(a[1]);
				out[2] = Math.floor(a[2]);
				return out;
			}
			/**
			* Returns the minimum of two vec3's
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {vec3} out
			*/
			function min(out, a, b) {
				out[0] = Math.min(a[0], b[0]);
				out[1] = Math.min(a[1], b[1]);
				out[2] = Math.min(a[2], b[2]);
				return out;
			}
			/**
			* Returns the maximum of two vec3's
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {vec3} out
			*/
			function max(out, a, b) {
				out[0] = Math.max(a[0], b[0]);
				out[1] = Math.max(a[1], b[1]);
				out[2] = Math.max(a[2], b[2]);
				return out;
			}
			/**
			* symmetric round the components of a vec3
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a vector to round
			* @returns {vec3} out
			*/
			function round(out, a) {
				out[0] = glMatrix.round(a[0]);
				out[1] = glMatrix.round(a[1]);
				out[2] = glMatrix.round(a[2]);
				return out;
			}
			/**
			* Scales a vec3 by a scalar number
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the vector to scale
			* @param {Number} b amount to scale the vector by
			* @returns {vec3} out
			*/
			function scale(out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				out[2] = a[2] * b;
				return out;
			}
			/**
			* Adds two vec3's after scaling the second operand by a scalar value
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @param {Number} scale the amount to scale b by before adding
			* @returns {vec3} out
			*/
			function scaleAndAdd(out, a, b, scale) {
				out[0] = a[0] + b[0] * scale;
				out[1] = a[1] + b[1] * scale;
				out[2] = a[2] + b[2] * scale;
				return out;
			}
			/**
			* Calculates the euclidian distance between two vec3's
			*
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {Number} distance between a and b
			*/
			function distance(a, b) {
				var x = b[0] - a[0];
				var y = b[1] - a[1];
				var z = b[2] - a[2];
				return Math.sqrt(x * x + y * y + z * z);
			}
			/**
			* Calculates the squared euclidian distance between two vec3's
			*
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {Number} squared distance between a and b
			*/
			function squaredDistance(a, b) {
				var x = b[0] - a[0];
				var y = b[1] - a[1];
				var z = b[2] - a[2];
				return x * x + y * y + z * z;
			}
			/**
			* Calculates the squared length of a vec3
			*
			* @param {ReadonlyVec3} a vector to calculate squared length of
			* @returns {Number} squared length of a
			*/
			function squaredLength(a) {
				var x = a[0];
				var y = a[1];
				var z = a[2];
				return x * x + y * y + z * z;
			}
			/**
			* Negates the components of a vec3
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a vector to negate
			* @returns {vec3} out
			*/
			function negate(out, a) {
				out[0] = -a[0];
				out[1] = -a[1];
				out[2] = -a[2];
				return out;
			}
			/**
			* Returns the inverse of the components of a vec3
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a vector to invert
			* @returns {vec3} out
			*/
			function inverse(out, a) {
				out[0] = 1 / a[0];
				out[1] = 1 / a[1];
				out[2] = 1 / a[2];
				return out;
			}
			/**
			* Normalize a vec3
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a vector to normalize
			* @returns {vec3} out
			*/
			function normalize(out, a) {
				var x = a[0];
				var y = a[1];
				var z = a[2];
				var len = x * x + y * y + z * z;
				if (len > 0) len = 1 / Math.sqrt(len);
				out[0] = a[0] * len;
				out[1] = a[1] * len;
				out[2] = a[2] * len;
				return out;
			}
			/**
			* Calculates the dot product of two vec3's
			*
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {Number} dot product of a and b
			*/
			function dot(a, b) {
				return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
			}
			/**
			* Computes the cross product of two vec3's
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @returns {vec3} out
			*/
			function cross(out, a, b) {
				var ax = a[0], ay = a[1], az = a[2];
				var bx = b[0], by = b[1], bz = b[2];
				out[0] = ay * bz - az * by;
				out[1] = az * bx - ax * bz;
				out[2] = ax * by - ay * bx;
				return out;
			}
			/**
			* Performs a linear interpolation between two vec3's
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @param {Number} t interpolation amount, in the range [0-1], between the two inputs
			* @returns {vec3} out
			*/
			function lerp(out, a, b, t) {
				var ax = a[0];
				var ay = a[1];
				var az = a[2];
				out[0] = ax + t * (b[0] - ax);
				out[1] = ay + t * (b[1] - ay);
				out[2] = az + t * (b[2] - az);
				return out;
			}
			/**
			* Performs a spherical linear interpolation between two vec3's
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @param {Number} t interpolation amount, in the range [0-1], between the two inputs
			* @returns {vec3} out
			*/
			function slerp(out, a, b, t) {
				var angle = Math.acos(Math.min(Math.max(dot(a, b), -1), 1));
				var sinTotal = Math.sin(angle);
				var ratioA = Math.sin((1 - t) * angle) / sinTotal;
				var ratioB = Math.sin(t * angle) / sinTotal;
				out[0] = ratioA * a[0] + ratioB * b[0];
				out[1] = ratioA * a[1] + ratioB * b[1];
				out[2] = ratioA * a[2] + ratioB * b[2];
				return out;
			}
			/**
			* Performs a hermite interpolation with two control points
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @param {ReadonlyVec3} c the third operand
			* @param {ReadonlyVec3} d the fourth operand
			* @param {Number} t interpolation amount, in the range [0-1], between the two inputs
			* @returns {vec3} out
			*/
			function hermite(out, a, b, c, d, t) {
				var factorTimes2 = t * t;
				var factor1 = factorTimes2 * (2 * t - 3) + 1;
				var factor2 = factorTimes2 * (t - 2) + t;
				var factor3 = factorTimes2 * (t - 1);
				var factor4 = factorTimes2 * (3 - 2 * t);
				out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
				out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
				out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
				return out;
			}
			/**
			* Performs a bezier interpolation with two control points
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the first operand
			* @param {ReadonlyVec3} b the second operand
			* @param {ReadonlyVec3} c the third operand
			* @param {ReadonlyVec3} d the fourth operand
			* @param {Number} t interpolation amount, in the range [0-1], between the two inputs
			* @returns {vec3} out
			*/
			function bezier(out, a, b, c, d, t) {
				var inverseFactor = 1 - t;
				var inverseFactorTimesTwo = inverseFactor * inverseFactor;
				var factorTimes2 = t * t;
				var factor1 = inverseFactorTimesTwo * inverseFactor;
				var factor2 = 3 * t * inverseFactorTimesTwo;
				var factor3 = 3 * factorTimes2 * inverseFactor;
				var factor4 = factorTimes2 * t;
				out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
				out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
				out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
				return out;
			}
			/**
			* Generates a random vector with the given scale
			*
			* @param {vec3} out the receiving vector
			* @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
			* @returns {vec3} out
			*/
			function random(out, scale) {
				scale = scale === void 0 ? 1 : scale;
				var r = glMatrix.RANDOM() * 2 * Math.PI;
				var z = glMatrix.RANDOM() * 2 - 1;
				var zScale = Math.sqrt(1 - z * z) * scale;
				out[0] = Math.cos(r) * zScale;
				out[1] = Math.sin(r) * zScale;
				out[2] = z * scale;
				return out;
			}
			/**
			* Transforms the vec3 with a mat4.
			* 4th vector component is implicitly '1'
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the vector to transform
			* @param {ReadonlyMat4} m matrix to transform with
			* @returns {vec3} out
			*/
			function transformMat4(out, a, m) {
				var x = a[0], y = a[1], z = a[2];
				var w = m[3] * x + m[7] * y + m[11] * z + m[15];
				w = w || 1;
				out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
				out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
				out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
				return out;
			}
			/**
			* Transforms the vec3 with a mat3.
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the vector to transform
			* @param {ReadonlyMat3} m the 3x3 matrix to transform with
			* @returns {vec3} out
			*/
			function transformMat3(out, a, m) {
				var x = a[0], y = a[1], z = a[2];
				out[0] = x * m[0] + y * m[3] + z * m[6];
				out[1] = x * m[1] + y * m[4] + z * m[7];
				out[2] = x * m[2] + y * m[5] + z * m[8];
				return out;
			}
			/**
			* Transforms the vec3 with a quat
			* Can also be used for dual quaternions. (Multiply it with the real part)
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec3} a the vector to transform
			* @param {ReadonlyQuat} q normalized quaternion to transform with
			* @returns {vec3} out
			*/
			function transformQuat(out, a, q) {
				var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
				var vx = a[0], vy = a[1], vz = a[2];
				var tx = qy * vz - qz * vy;
				var ty = qz * vx - qx * vz;
				var tz = qx * vy - qy * vx;
				tx = tx + tx;
				ty = ty + ty;
				tz = tz + tz;
				out[0] = vx + qw * tx + qy * tz - qz * ty;
				out[1] = vy + qw * ty + qz * tx - qx * tz;
				out[2] = vz + qw * tz + qx * ty - qy * tx;
				return out;
			}
			/**
			* Rotate a 3D vector around the x-axis
			* @param {vec3} out The receiving vec3
			* @param {ReadonlyVec3} a The vec3 point to rotate
			* @param {ReadonlyVec3} b The origin of the rotation
			* @param {Number} rad The angle of rotation in radians
			* @returns {vec3} out
			*/
			function rotateX(out, a, b, rad) {
				var p = [], r = [];
				p[0] = a[0] - b[0];
				p[1] = a[1] - b[1];
				p[2] = a[2] - b[2];
				r[0] = p[0];
				r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
				r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
				out[0] = r[0] + b[0];
				out[1] = r[1] + b[1];
				out[2] = r[2] + b[2];
				return out;
			}
			/**
			* Rotate a 3D vector around the y-axis
			* @param {vec3} out The receiving vec3
			* @param {ReadonlyVec3} a The vec3 point to rotate
			* @param {ReadonlyVec3} b The origin of the rotation
			* @param {Number} rad The angle of rotation in radians
			* @returns {vec3} out
			*/
			function rotateY(out, a, b, rad) {
				var p = [], r = [];
				p[0] = a[0] - b[0];
				p[1] = a[1] - b[1];
				p[2] = a[2] - b[2];
				r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
				r[1] = p[1];
				r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
				out[0] = r[0] + b[0];
				out[1] = r[1] + b[1];
				out[2] = r[2] + b[2];
				return out;
			}
			/**
			* Rotate a 3D vector around the z-axis
			* @param {vec3} out The receiving vec3
			* @param {ReadonlyVec3} a The vec3 point to rotate
			* @param {ReadonlyVec3} b The origin of the rotation
			* @param {Number} rad The angle of rotation in radians
			* @returns {vec3} out
			*/
			function rotateZ(out, a, b, rad) {
				var p = [], r = [];
				p[0] = a[0] - b[0];
				p[1] = a[1] - b[1];
				p[2] = a[2] - b[2];
				r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
				r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
				r[2] = p[2];
				out[0] = r[0] + b[0];
				out[1] = r[1] + b[1];
				out[2] = r[2] + b[2];
				return out;
			}
			/**
			* Get the angle between two 3D vectors
			* @param {ReadonlyVec3} a The first operand
			* @param {ReadonlyVec3} b The second operand
			* @returns {Number} The angle in radians
			*/
			function angle(a, b) {
				var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag = Math.sqrt((ax * ax + ay * ay + az * az) * (bx * bx + by * by + bz * bz)), cosine = mag && dot(a, b) / mag;
				return Math.acos(Math.min(Math.max(cosine, -1), 1));
			}
			/**
			* Set the components of a vec3 to zero
			*
			* @param {vec3} out the receiving vector
			* @returns {vec3} out
			*/
			function zero(out) {
				out[0] = 0;
				out[1] = 0;
				out[2] = 0;
				return out;
			}
			/**
			* Returns a string representation of a vector
			*
			* @param {ReadonlyVec3} a vector to represent as a string
			* @returns {String} string representation of the vector
			*/
			function str(a) {
				return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
			}
			/**
			* Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
			*
			* @param {ReadonlyVec3} a The first vector.
			* @param {ReadonlyVec3} b The second vector.
			* @returns {Boolean} True if the vectors are equal, false otherwise.
			*/
			function exactEquals(a, b) {
				return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
			}
			/**
			* Returns whether or not the vectors have approximately the same elements in the same position.
			*
			* @param {ReadonlyVec3} a The first vector.
			* @param {ReadonlyVec3} b The second vector.
			* @returns {Boolean} True if the vectors are equal, false otherwise.
			*/
			function equals(a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2];
				var b0 = b[0], b1 = b[1], b2 = b[2];
				return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
			}
			exports$78.sub = subtract;
			exports$78.mul = multiply;
			exports$78.div = divide;
			exports$78.dist = distance;
			exports$78.sqrDist = squaredDistance;
			exports$78.len = length;
			exports$78.sqrLen = squaredLength;
			exports$78.forEach = function() {
				var vec = create();
				return function(a, stride, offset, count, fn, arg) {
					var i, l;
					if (!stride) stride = 3;
					if (!offset) offset = 0;
					if (count) l = Math.min(count * stride + offset, a.length);
					else l = a.length;
					for (i = offset; i < l; i += stride) {
						vec[0] = a[i];
						vec[1] = a[i + 1];
						vec[2] = a[i + 2];
						fn(vec, vec, arg);
						a[i] = vec[0];
						a[i + 1] = vec[1];
						a[i + 2] = vec[2];
					}
					return a;
				};
			}();
		}),
		(function(module$85, exports$79, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$79, "__esModule", { value: true });
			exports$79.add = add;
			exports$79.ceil = ceil;
			exports$79.clone = clone;
			exports$79.copy = copy;
			exports$79.create = create;
			exports$79.cross = cross;
			exports$79.dist = void 0;
			exports$79.distance = distance;
			exports$79.div = void 0;
			exports$79.divide = divide;
			exports$79.dot = dot;
			exports$79.equals = equals;
			exports$79.exactEquals = exactEquals;
			exports$79.floor = floor;
			exports$79.forEach = void 0;
			exports$79.fromValues = fromValues;
			exports$79.inverse = inverse;
			exports$79.len = void 0;
			exports$79.length = length;
			exports$79.lerp = lerp;
			exports$79.max = max;
			exports$79.min = min;
			exports$79.mul = void 0;
			exports$79.multiply = multiply;
			exports$79.negate = negate;
			exports$79.normalize = normalize;
			exports$79.random = random;
			exports$79.round = round;
			exports$79.scale = scale;
			exports$79.scaleAndAdd = scaleAndAdd;
			exports$79.set = set;
			exports$79.sqrLen = exports$79.sqrDist = void 0;
			exports$79.squaredDistance = squaredDistance;
			exports$79.squaredLength = squaredLength;
			exports$79.str = str;
			exports$79.sub = void 0;
			exports$79.subtract = subtract;
			exports$79.transformMat4 = transformMat4;
			exports$79.transformQuat = transformQuat;
			exports$79.zero = zero;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* 4 Dimensional Vector
			* @module vec4
			*/
			/**
			* Creates a new, empty vec4
			*
			* @returns {vec4} a new 4D vector
			*/
			function create() {
				var out = new glMatrix.ARRAY_TYPE(4);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					out[0] = 0;
					out[1] = 0;
					out[2] = 0;
					out[3] = 0;
				}
				return out;
			}
			/**
			* Creates a new vec4 initialized with values from an existing vector
			*
			* @param {ReadonlyVec4} a vector to clone
			* @returns {vec4} a new 4D vector
			*/
			function clone(a) {
				var out = new glMatrix.ARRAY_TYPE(4);
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				return out;
			}
			/**
			* Creates a new vec4 initialized with the given values
			*
			* @param {Number} x X component
			* @param {Number} y Y component
			* @param {Number} z Z component
			* @param {Number} w W component
			* @returns {vec4} a new 4D vector
			*/
			function fromValues(x, y, z, w) {
				var out = new glMatrix.ARRAY_TYPE(4);
				out[0] = x;
				out[1] = y;
				out[2] = z;
				out[3] = w;
				return out;
			}
			/**
			* Copy the values from one vec4 to another
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the source vector
			* @returns {vec4} out
			*/
			function copy(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				return out;
			}
			/**
			* Set the components of a vec4 to the given values
			*
			* @param {vec4} out the receiving vector
			* @param {Number} x X component
			* @param {Number} y Y component
			* @param {Number} z Z component
			* @param {Number} w W component
			* @returns {vec4} out
			*/
			function set(out, x, y, z, w) {
				out[0] = x;
				out[1] = y;
				out[2] = z;
				out[3] = w;
				return out;
			}
			/**
			* Adds two vec4's
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {vec4} out
			*/
			function add(out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				out[2] = a[2] + b[2];
				out[3] = a[3] + b[3];
				return out;
			}
			/**
			* Subtracts vector b from vector a
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {vec4} out
			*/
			function subtract(out, a, b) {
				out[0] = a[0] - b[0];
				out[1] = a[1] - b[1];
				out[2] = a[2] - b[2];
				out[3] = a[3] - b[3];
				return out;
			}
			/**
			* Multiplies two vec4's
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {vec4} out
			*/
			function multiply(out, a, b) {
				out[0] = a[0] * b[0];
				out[1] = a[1] * b[1];
				out[2] = a[2] * b[2];
				out[3] = a[3] * b[3];
				return out;
			}
			/**
			* Divides two vec4's
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {vec4} out
			*/
			function divide(out, a, b) {
				out[0] = a[0] / b[0];
				out[1] = a[1] / b[1];
				out[2] = a[2] / b[2];
				out[3] = a[3] / b[3];
				return out;
			}
			/**
			* Math.ceil the components of a vec4
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a vector to ceil
			* @returns {vec4} out
			*/
			function ceil(out, a) {
				out[0] = Math.ceil(a[0]);
				out[1] = Math.ceil(a[1]);
				out[2] = Math.ceil(a[2]);
				out[3] = Math.ceil(a[3]);
				return out;
			}
			/**
			* Math.floor the components of a vec4
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a vector to floor
			* @returns {vec4} out
			*/
			function floor(out, a) {
				out[0] = Math.floor(a[0]);
				out[1] = Math.floor(a[1]);
				out[2] = Math.floor(a[2]);
				out[3] = Math.floor(a[3]);
				return out;
			}
			/**
			* Returns the minimum of two vec4's
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {vec4} out
			*/
			function min(out, a, b) {
				out[0] = Math.min(a[0], b[0]);
				out[1] = Math.min(a[1], b[1]);
				out[2] = Math.min(a[2], b[2]);
				out[3] = Math.min(a[3], b[3]);
				return out;
			}
			/**
			* Returns the maximum of two vec4's
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {vec4} out
			*/
			function max(out, a, b) {
				out[0] = Math.max(a[0], b[0]);
				out[1] = Math.max(a[1], b[1]);
				out[2] = Math.max(a[2], b[2]);
				out[3] = Math.max(a[3], b[3]);
				return out;
			}
			/**
			* symmetric round the components of a vec4
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a vector to round
			* @returns {vec4} out
			*/
			function round(out, a) {
				out[0] = glMatrix.round(a[0]);
				out[1] = glMatrix.round(a[1]);
				out[2] = glMatrix.round(a[2]);
				out[3] = glMatrix.round(a[3]);
				return out;
			}
			/**
			* Scales a vec4 by a scalar number
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the vector to scale
			* @param {Number} b amount to scale the vector by
			* @returns {vec4} out
			*/
			function scale(out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				out[2] = a[2] * b;
				out[3] = a[3] * b;
				return out;
			}
			/**
			* Adds two vec4's after scaling the second operand by a scalar value
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @param {Number} scale the amount to scale b by before adding
			* @returns {vec4} out
			*/
			function scaleAndAdd(out, a, b, scale) {
				out[0] = a[0] + b[0] * scale;
				out[1] = a[1] + b[1] * scale;
				out[2] = a[2] + b[2] * scale;
				out[3] = a[3] + b[3] * scale;
				return out;
			}
			/**
			* Calculates the euclidian distance between two vec4's
			*
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {Number} distance between a and b
			*/
			function distance(a, b) {
				var x = b[0] - a[0];
				var y = b[1] - a[1];
				var z = b[2] - a[2];
				var w = b[3] - a[3];
				return Math.sqrt(x * x + y * y + z * z + w * w);
			}
			/**
			* Calculates the squared euclidian distance between two vec4's
			*
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {Number} squared distance between a and b
			*/
			function squaredDistance(a, b) {
				var x = b[0] - a[0];
				var y = b[1] - a[1];
				var z = b[2] - a[2];
				var w = b[3] - a[3];
				return x * x + y * y + z * z + w * w;
			}
			/**
			* Calculates the length of a vec4
			*
			* @param {ReadonlyVec4} a vector to calculate length of
			* @returns {Number} length of a
			*/
			function length(a) {
				var x = a[0];
				var y = a[1];
				var z = a[2];
				var w = a[3];
				return Math.sqrt(x * x + y * y + z * z + w * w);
			}
			/**
			* Calculates the squared length of a vec4
			*
			* @param {ReadonlyVec4} a vector to calculate squared length of
			* @returns {Number} squared length of a
			*/
			function squaredLength(a) {
				var x = a[0];
				var y = a[1];
				var z = a[2];
				var w = a[3];
				return x * x + y * y + z * z + w * w;
			}
			/**
			* Negates the components of a vec4
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a vector to negate
			* @returns {vec4} out
			*/
			function negate(out, a) {
				out[0] = -a[0];
				out[1] = -a[1];
				out[2] = -a[2];
				out[3] = -a[3];
				return out;
			}
			/**
			* Returns the inverse of the components of a vec4
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a vector to invert
			* @returns {vec4} out
			*/
			function inverse(out, a) {
				out[0] = 1 / a[0];
				out[1] = 1 / a[1];
				out[2] = 1 / a[2];
				out[3] = 1 / a[3];
				return out;
			}
			/**
			* Normalize a vec4
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a vector to normalize
			* @returns {vec4} out
			*/
			function normalize(out, a) {
				var x = a[0];
				var y = a[1];
				var z = a[2];
				var w = a[3];
				var len = x * x + y * y + z * z + w * w;
				if (len > 0) len = 1 / Math.sqrt(len);
				out[0] = x * len;
				out[1] = y * len;
				out[2] = z * len;
				out[3] = w * len;
				return out;
			}
			/**
			* Calculates the dot product of two vec4's
			*
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @returns {Number} dot product of a and b
			*/
			function dot(a, b) {
				return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
			}
			/**
			* Returns the cross-product of three vectors in a 4-dimensional space
			*
			* @param {ReadonlyVec4} out the receiving vector
			* @param {ReadonlyVec4} u the first vector
			* @param {ReadonlyVec4} v the second vector
			* @param {ReadonlyVec4} w the third vector
			* @returns {vec4} result
			*/
			function cross(out, u, v, w) {
				var A = v[0] * w[1] - v[1] * w[0], B = v[0] * w[2] - v[2] * w[0], C = v[0] * w[3] - v[3] * w[0], D = v[1] * w[2] - v[2] * w[1], E = v[1] * w[3] - v[3] * w[1], F = v[2] * w[3] - v[3] * w[2];
				var G = u[0];
				var H = u[1];
				var I = u[2];
				var J = u[3];
				out[0] = H * F - I * E + J * D;
				out[1] = -(G * F) + I * C - J * B;
				out[2] = G * E - H * C + J * A;
				out[3] = -(G * D) + H * B - I * A;
				return out;
			}
			/**
			* Performs a linear interpolation between two vec4's
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the first operand
			* @param {ReadonlyVec4} b the second operand
			* @param {Number} t interpolation amount, in the range [0-1], between the two inputs
			* @returns {vec4} out
			*/
			function lerp(out, a, b, t) {
				var ax = a[0];
				var ay = a[1];
				var az = a[2];
				var aw = a[3];
				out[0] = ax + t * (b[0] - ax);
				out[1] = ay + t * (b[1] - ay);
				out[2] = az + t * (b[2] - az);
				out[3] = aw + t * (b[3] - aw);
				return out;
			}
			/**
			* Generates a random vector with the given scale
			*
			* @param {vec4} out the receiving vector
			* @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
			* @returns {vec4} out
			*/
			function random(out, scale) {
				scale = scale === void 0 ? 1 : scale;
				var v1, v2, v3, v4;
				var s1, s2;
				var rand = glMatrix.RANDOM();
				v1 = rand * 2 - 1;
				v2 = (4 * glMatrix.RANDOM() - 2) * Math.sqrt(rand * -rand + rand);
				s1 = v1 * v1 + v2 * v2;
				rand = glMatrix.RANDOM();
				v3 = rand * 2 - 1;
				v4 = (4 * glMatrix.RANDOM() - 2) * Math.sqrt(rand * -rand + rand);
				s2 = v3 * v3 + v4 * v4;
				var d = Math.sqrt((1 - s1) / s2);
				out[0] = scale * v1;
				out[1] = scale * v2;
				out[2] = scale * v3 * d;
				out[3] = scale * v4 * d;
				return out;
			}
			/**
			* Transforms the vec4 with a mat4.
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the vector to transform
			* @param {ReadonlyMat4} m matrix to transform with
			* @returns {vec4} out
			*/
			function transformMat4(out, a, m) {
				var x = a[0], y = a[1], z = a[2], w = a[3];
				out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
				out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
				out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
				out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
				return out;
			}
			/**
			* Transforms the vec4 with a quat
			*
			* @param {vec4} out the receiving vector
			* @param {ReadonlyVec4} a the vector to transform
			* @param {ReadonlyQuat} q normalized quaternion to transform with
			* @returns {vec4} out
			*/
			function transformQuat(out, a, q) {
				var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
				var vx = a[0], vy = a[1], vz = a[2];
				var tx = qy * vz - qz * vy;
				var ty = qz * vx - qx * vz;
				var tz = qx * vy - qy * vx;
				tx = tx + tx;
				ty = ty + ty;
				tz = tz + tz;
				out[0] = vx + qw * tx + qy * tz - qz * ty;
				out[1] = vy + qw * ty + qz * tx - qx * tz;
				out[2] = vz + qw * tz + qx * ty - qy * tx;
				out[3] = a[3];
				return out;
			}
			/**
			* Set the components of a vec4 to zero
			*
			* @param {vec4} out the receiving vector
			* @returns {vec4} out
			*/
			function zero(out) {
				out[0] = 0;
				out[1] = 0;
				out[2] = 0;
				out[3] = 0;
				return out;
			}
			/**
			* Returns a string representation of a vector
			*
			* @param {ReadonlyVec4} a vector to represent as a string
			* @returns {String} string representation of the vector
			*/
			function str(a) {
				return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
			}
			/**
			* Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
			*
			* @param {ReadonlyVec4} a The first vector.
			* @param {ReadonlyVec4} b The second vector.
			* @returns {Boolean} True if the vectors are equal, false otherwise.
			*/
			function exactEquals(a, b) {
				return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
			}
			/**
			* Returns whether or not the vectors have approximately the same elements in the same position.
			*
			* @param {ReadonlyVec4} a The first vector.
			* @param {ReadonlyVec4} b The second vector.
			* @returns {Boolean} True if the vectors are equal, false otherwise.
			*/
			function equals(a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
				return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
			}
			exports$79.sub = subtract;
			exports$79.mul = multiply;
			exports$79.div = divide;
			exports$79.dist = distance;
			exports$79.sqrDist = squaredDistance;
			exports$79.len = length;
			exports$79.sqrLen = squaredLength;
			exports$79.forEach = function() {
				var vec = create();
				return function(a, stride, offset, count, fn, arg) {
					var i, l;
					if (!stride) stride = 4;
					if (!offset) offset = 0;
					if (count) l = Math.min(count * stride + offset, a.length);
					else l = a.length;
					for (i = offset; i < l; i += stride) {
						vec[0] = a[i];
						vec[1] = a[i + 1];
						vec[2] = a[i + 2];
						vec[3] = a[i + 3];
						fn(vec, vec, arg);
						a[i] = vec[0];
						a[i + 1] = vec[1];
						a[i + 2] = vec[2];
						a[i + 3] = vec[3];
					}
					return a;
				};
			}();
		}),
		(function(module$86, exports$80) {
			function _OverloadYield(e, d) {
				this.v = e, this.k = d;
			}
			module$86.exports = _OverloadYield, module$86.exports.__esModule = true, module$86.exports["default"] = module$86.exports;
		}),
		(function(module$87, exports$81, __webpack_require__) {
			var regeneratorDefine = __webpack_require__(81);
			function _regenerator() {
				/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
				var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag";
				function i(r, n, o, i) {
					var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype);
					return regeneratorDefine(u, "_invoke", function(r, n, o) {
						var i, c, u, f = 0, p = o || [], y = !1, G = {
							p: 0,
							n: 0,
							v: e,
							a: d,
							f: d.bind(e, 4),
							d: function d(t, r) {
								return i = t, c = 0, u = e, G.n = r, a;
							}
						};
						function d(r, n) {
							for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
								var o, i = p[t], d = G.p, l = i[2];
								r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
							}
							if (o || r > 1) return a;
							throw y = !0, n;
						}
						return function(o, p, l) {
							if (f > 1) throw TypeError("Generator is already running");
							for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
								i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
								try {
									if (f = 2, i) {
										if (c || (o = "next"), t = i[o]) {
											if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
											if (!t.done) return t;
											u = t.value, c < 2 && (c = 0);
										} else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
										i = e;
									} else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
								} catch (t) {
									i = e, c = 1, u = t;
								} finally {
									f = 1;
								}
							}
							return {
								value: t,
								done: y
							};
						};
					}(r, o, i), !0), u;
				}
				var a = {};
				function Generator() {}
				function GeneratorFunction() {}
				function GeneratorFunctionPrototype() {}
				t = Object.getPrototypeOf;
				var c = [][n] ? t(t([][n]())) : (regeneratorDefine(t = {}, n, function() {
					return this;
				}), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
				function f(e) {
					return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
				}
				return GeneratorFunction.prototype = GeneratorFunctionPrototype, regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), regeneratorDefine(u), regeneratorDefine(u, o, "Generator"), regeneratorDefine(u, n, function() {
					return this;
				}), regeneratorDefine(u, "toString", function() {
					return "[object Generator]";
				}), (module$87.exports = _regenerator = function _regenerator() {
					return {
						w: i,
						m: f
					};
				}, module$87.exports.__esModule = true, module$87.exports["default"] = module$87.exports)();
			}
			module$87.exports = _regenerator, module$87.exports.__esModule = true, module$87.exports["default"] = module$87.exports;
		}),
		(function(module$88, exports$82) {
			function _regeneratorDefine(e, r, n, t) {
				var i = Object.defineProperty;
				try {
					i({}, "", {});
				} catch (e) {
					i = 0;
				}
				module$88.exports = _regeneratorDefine = function regeneratorDefine(e, r, n, t) {
					function o(r, n) {
						_regeneratorDefine(e, r, function(e) {
							return this._invoke(r, n, e);
						});
					}
					r ? i ? i(e, r, {
						value: n,
						enumerable: !t,
						configurable: !t,
						writable: !t
					}) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
				}, module$88.exports.__esModule = true, module$88.exports["default"] = module$88.exports, _regeneratorDefine(e, r, n, t);
			}
			module$88.exports = _regeneratorDefine, module$88.exports.__esModule = true, module$88.exports["default"] = module$88.exports;
		}),
		(function(module$89, exports$83, __webpack_require__) {
			var regenerator = __webpack_require__(80);
			var regeneratorAsyncIterator = __webpack_require__(83);
			function _regeneratorAsyncGen(r, e, t, o, n) {
				return new regeneratorAsyncIterator(regenerator().w(r, e, t, o), n || Promise);
			}
			module$89.exports = _regeneratorAsyncGen, module$89.exports.__esModule = true, module$89.exports["default"] = module$89.exports;
		}),
		(function(module$90, exports$84, __webpack_require__) {
			var OverloadYield = __webpack_require__(79);
			var regeneratorDefine = __webpack_require__(81);
			function AsyncIterator(t, e) {
				function n(r, o, i, f) {
					try {
						var c = t[r](o), u = c.value;
						return u instanceof OverloadYield ? e.resolve(u.v).then(function(t) {
							n("next", t, i, f);
						}, function(t) {
							n("throw", t, i, f);
						}) : e.resolve(u).then(function(t) {
							c.value = t, i(c);
						}, function(t) {
							return n("throw", t, i, f);
						});
					} catch (t) {
						f(t);
					}
				}
				var r;
				this.next || (regeneratorDefine(AsyncIterator.prototype), regeneratorDefine(AsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function() {
					return this;
				})), regeneratorDefine(this, "_invoke", function(t, o, i) {
					function f() {
						return new e(function(e, r) {
							n(t, i, e, r);
						});
					}
					return r = r ? r.then(f, f) : f();
				}, !0);
			}
			module$90.exports = AsyncIterator, module$90.exports.__esModule = true, module$90.exports["default"] = module$90.exports;
		}),
		(function(module$91, exports$85) {
			/**
			* A specialized version of `_.map` for arrays without support for iteratee
			* shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array} Returns the new mapped array.
			*/
			function arrayMap(array, iteratee) {
				var index = -1, length = array == null ? 0 : array.length, result = Array(length);
				while (++index < length) result[index] = iteratee(array[index], index, array);
				return result;
			}
			module$91.exports = arrayMap;
		}),
		(function(module$92, exports$86) {
			/**
			* This method returns a new empty array.
			*
			* @static
			* @memberOf _
			* @since 4.13.0
			* @category Util
			* @returns {Array} Returns the new empty array.
			* @example
			*
			* var arrays = _.times(2, _.stubArray);
			*
			* console.log(arrays);
			* // => [[], []]
			*
			* console.log(arrays[0] === arrays[1]);
			* // => false
			*/
			function stubArray() {
				return [];
			}
			module$92.exports = stubArray;
		}),
		(function(module$93, exports$87, __webpack_require__) {
			var arrayPush = __webpack_require__(46), getPrototype = __webpack_require__(37), getSymbols = __webpack_require__(45), stubArray = __webpack_require__(85);
			module$93.exports = !Object.getOwnPropertySymbols ? stubArray : function(object) {
				var result = [];
				while (object) {
					arrayPush(result, getSymbols(object));
					object = getPrototype(object);
				}
				return result;
			};
		}),
		(function(module$94, exports$88, __webpack_require__) {
			var arrayPush = __webpack_require__(46), isArray = __webpack_require__(16);
			/**
			* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
			* `keysFunc` and `symbolsFunc` to get the enumerable property names and
			* symbols of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Function} keysFunc The function to get the keys of `object`.
			* @param {Function} symbolsFunc The function to get the symbols of `object`.
			* @returns {Array} Returns the array of property names and symbols.
			*/
			function baseGetAllKeys(object, keysFunc, symbolsFunc) {
				var result = keysFunc(object);
				return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
			}
			module$94.exports = baseGetAllKeys;
		}),
		(function(module$95, exports$89, __webpack_require__) {
			var baseGetAllKeys = __webpack_require__(87), getSymbolsIn = __webpack_require__(86), keysIn = __webpack_require__(24);
			/**
			* Creates an array of own and inherited enumerable property names and
			* symbols of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names and symbols.
			*/
			function getAllKeysIn(object) {
				return baseGetAllKeys(object, keysIn, getSymbolsIn);
			}
			module$95.exports = getAllKeysIn;
		}),
		(function(module$96, exports$90, __webpack_require__) {
			var isSymbol = __webpack_require__(49);
			/** Used as references for various `Number` constants. */
			var INFINITY = Infinity;
			/**
			* Converts `value` to a string key if it's not a string or symbol.
			*
			* @private
			* @param {*} value The value to inspect.
			* @returns {string|symbol} Returns the key.
			*/
			function toKey(value) {
				if (typeof value == "string" || isSymbol(value)) return value;
				var result = value + "";
				return result == "0" && 1 / value == -INFINITY ? "-0" : result;
			}
			module$96.exports = toKey;
		}),
		(function(module$97, exports$91, __webpack_require__) {
			var objectWithoutPropertiesLoose = __webpack_require__(167);
			function _objectWithoutProperties(e, t) {
				if (null == e) return {};
				var o, r, i = objectWithoutPropertiesLoose(e, t);
				if (Object.getOwnPropertySymbols) {
					var n = Object.getOwnPropertySymbols(e);
					for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
				}
				return i;
			}
			module$97.exports = _objectWithoutProperties, module$97.exports.__esModule = true, module$97.exports["default"] = module$97.exports;
		}),
		(function(module$98, exports$92, __webpack_require__) {
			var arrayMap = __webpack_require__(84), baseClone = __webpack_require__(168), baseUnset = __webpack_require__(191), castPath = __webpack_require__(48), copyObject = __webpack_require__(22), customOmitClone = __webpack_require__(202), flatRest = __webpack_require__(203), getAllKeysIn = __webpack_require__(88);
			/** Used to compose bitmasks for cloning. */
			var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
			module$98.exports = flatRest(function(object, paths) {
				var result = {};
				if (object == null) return result;
				var isDeep = false;
				paths = arrayMap(paths, function(path) {
					path = castPath(path, object);
					isDeep || (isDeep = path.length > 1);
					return path;
				});
				copyObject(object, getAllKeysIn(object), result);
				if (isDeep) result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
				var length = paths.length;
				while (length--) baseUnset(result, paths[length]);
				return result;
			});
		}),
		(function(module$99, exports$93, __webpack_require__) {
			var getPrototypeOf = __webpack_require__(1);
			var setPrototypeOf = __webpack_require__(43);
			var isNativeFunction = __webpack_require__(207);
			var construct = __webpack_require__(208);
			function _wrapNativeSuper(t) {
				var r = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
				return module$99.exports = _wrapNativeSuper = function _wrapNativeSuper(t) {
					if (null === t || !isNativeFunction(t)) return t;
					if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
					if (void 0 !== r) {
						if (r.has(t)) return r.get(t);
						r.set(t, Wrapper);
					}
					function Wrapper() {
						return construct(t, arguments, getPrototypeOf(this).constructor);
					}
					return Wrapper.prototype = Object.create(t.prototype, { constructor: {
						value: Wrapper,
						enumerable: !1,
						writable: !0,
						configurable: !0
					} }), setPrototypeOf(Wrapper, t);
				}, module$99.exports.__esModule = true, module$99.exports["default"] = module$99.exports, _wrapNativeSuper(t);
			}
			module$99.exports = _wrapNativeSuper, module$99.exports.__esModule = true, module$99.exports["default"] = module$99.exports;
		}),
		(function(module$100, exports$94, __webpack_require__) {
			var CVUtils = __webpack_require__(10);
			var Ndarray = __webpack_require__(210);
			var Interp2D = __webpack_require__(213).d2;
			var FrameGrabber = {};
			FrameGrabber.create = function(inputStream, canvas) {
				var _that = {};
				var _videoSize = CVUtils.imageRef(inputStream.getRealWidth(), inputStream.getRealHeight());
				var _canvasSize = inputStream.getCanvasSize();
				var _size = CVUtils.imageRef(inputStream.getWidth(), inputStream.getHeight());
				var _topRight = inputStream.getTopRight();
				var _data = new Uint8Array(_size.x * _size.y);
				var _grayData = new Uint8Array(_videoSize.x * _videoSize.y);
				var _canvasData = new Uint8Array(_canvasSize.x * _canvasSize.y);
				var _grayImageArray = Ndarray(_grayData, [_videoSize.y, _videoSize.x]).transpose(1, 0);
				var _canvasImageArray = Ndarray(_canvasData, [_canvasSize.y, _canvasSize.x]).transpose(1, 0);
				var _targetImageArray = _canvasImageArray.hi(_topRight.x + _size.x, _topRight.y + _size.y).lo(_topRight.x, _topRight.y);
				var _stepSizeX = _videoSize.x / _canvasSize.x;
				var _stepSizeY = _videoSize.y / _canvasSize.y;
				inputStream.getConfig();
				/**
				* Uses the given array as frame-buffer
				*/
				_that.attachData = function(data) {
					_data = data;
				};
				/**
				* Returns the used frame-buffer
				*/
				_that.getData = function() {
					return _data;
				};
				/**
				* Fetches a frame from the input-stream and puts into the frame-buffer.
				* The image-data is converted to gray-scale and then half-sampled if configured.
				*/
				_that.grab = function() {
					var frame = inputStream.getFrame();
					if (frame) {
						this.scaleAndCrop(frame);
						return true;
					}
					return false;
				};
				_that.scaleAndCrop = function(frame) {
					CVUtils.computeGray(frame.data, _grayData);
					for (var y = 0; y < _canvasSize.y; y++) for (var x = 0; x < _canvasSize.x; x++) _canvasImageArray.set(x, y, Interp2D(_grayImageArray, x * _stepSizeX, y * _stepSizeY) | 0);
					if (_targetImageArray.shape[0] !== _size.x || _targetImageArray.shape[1] !== _size.y) throw new Error("Shapes do not match!");
					for (var _y = 0; _y < _size.y; _y++) for (var _x = 0; _x < _size.x; _x++) _data[_y * _size.x + _x] = _targetImageArray.get(_x, _y);
				};
				_that.getSize = function() {
					return _size;
				};
				return _that;
			};
			module$100.exports = FrameGrabber;
		}),
		(function(module$101, exports$95) {
			module$101.exports = __require("fs");
		}),
		(function(module$102, exports$96) {
			module$102.exports = __require("http");
		}),
		(function(module$103, exports$97) {
			module$103.exports = __require("https");
		}),
		(function(module$104, exports$98) {
			module$104.exports = __require("url");
		}),
		(function(module$105, exports$99) {
			module$105.exports = require_ndarray_pixels_node();
		}),
		(function(module$106, exports$100, __webpack_require__) {
			module$106.exports = __webpack_require__(214);
		}),
		(function(module$107, exports$101, __webpack_require__) {
			var Stack = __webpack_require__(50), assignMergeValue = __webpack_require__(54), baseFor = __webpack_require__(129), baseMergeDeep = __webpack_require__(131), isObject = __webpack_require__(14), keysIn = __webpack_require__(24), safeGet = __webpack_require__(64);
			/**
			* The base implementation of `_.merge` without support for multiple sources.
			*
			* @private
			* @param {Object} object The destination object.
			* @param {Object} source The source object.
			* @param {number} srcIndex The index of `source`.
			* @param {Function} [customizer] The function to customize merged values.
			* @param {Object} [stack] Tracks traversed source values and their merged
			*  counterparts.
			*/
			function baseMerge(object, source, srcIndex, customizer, stack) {
				if (object === source) return;
				baseFor(source, function(srcValue, key) {
					stack || (stack = new Stack());
					if (isObject(srcValue)) baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
					else {
						var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
						if (newValue === void 0) newValue = srcValue;
						assignMergeValue(object, key, newValue);
					}
				}, keysIn);
			}
			module$107.exports = baseMerge;
		}),
		(function(module$108, exports$102) {
			/**
			* Removes all key-value entries from the list cache.
			*
			* @private
			* @name clear
			* @memberOf ListCache
			*/
			function listCacheClear() {
				this.__data__ = [];
				this.size = 0;
			}
			module$108.exports = listCacheClear;
		}),
		(function(module$109, exports$103, __webpack_require__) {
			var assocIndexOf = __webpack_require__(26);
			/** Built-in value references. */
			var splice = Array.prototype.splice;
			/**
			* Removes `key` and its value from the list cache.
			*
			* @private
			* @name delete
			* @memberOf ListCache
			* @param {string} key The key of the value to remove.
			* @returns {boolean} Returns `true` if the entry was removed, else `false`.
			*/
			function listCacheDelete(key) {
				var data = this.__data__, index = assocIndexOf(data, key);
				if (index < 0) return false;
				if (index == data.length - 1) data.pop();
				else splice.call(data, index, 1);
				--this.size;
				return true;
			}
			module$109.exports = listCacheDelete;
		}),
		(function(module$110, exports$104, __webpack_require__) {
			var assocIndexOf = __webpack_require__(26);
			/**
			* Gets the list cache value for `key`.
			*
			* @private
			* @name get
			* @memberOf ListCache
			* @param {string} key The key of the value to get.
			* @returns {*} Returns the entry value.
			*/
			function listCacheGet(key) {
				var data = this.__data__, index = assocIndexOf(data, key);
				return index < 0 ? void 0 : data[index][1];
			}
			module$110.exports = listCacheGet;
		}),
		(function(module$111, exports$105, __webpack_require__) {
			var assocIndexOf = __webpack_require__(26);
			/**
			* Checks if a list cache value for `key` exists.
			*
			* @private
			* @name has
			* @memberOf ListCache
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function listCacheHas(key) {
				return assocIndexOf(this.__data__, key) > -1;
			}
			module$111.exports = listCacheHas;
		}),
		(function(module$112, exports$106, __webpack_require__) {
			var assocIndexOf = __webpack_require__(26);
			/**
			* Sets the list cache `key` to `value`.
			*
			* @private
			* @name set
			* @memberOf ListCache
			* @param {string} key The key of the value to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns the list cache instance.
			*/
			function listCacheSet(key, value) {
				var data = this.__data__, index = assocIndexOf(data, key);
				if (index < 0) {
					++this.size;
					data.push([key, value]);
				} else data[index][1] = value;
				return this;
			}
			module$112.exports = listCacheSet;
		}),
		(function(module$113, exports$107, __webpack_require__) {
			var ListCache = __webpack_require__(25);
			/**
			* Removes all key-value entries from the stack.
			*
			* @private
			* @name clear
			* @memberOf Stack
			*/
			function stackClear() {
				this.__data__ = new ListCache();
				this.size = 0;
			}
			module$113.exports = stackClear;
		}),
		(function(module$114, exports$108) {
			/**
			* Removes `key` and its value from the stack.
			*
			* @private
			* @name delete
			* @memberOf Stack
			* @param {string} key The key of the value to remove.
			* @returns {boolean} Returns `true` if the entry was removed, else `false`.
			*/
			function stackDelete(key) {
				var data = this.__data__, result = data["delete"](key);
				this.size = data.size;
				return result;
			}
			module$114.exports = stackDelete;
		}),
		(function(module$115, exports$109) {
			/**
			* Gets the stack value for `key`.
			*
			* @private
			* @name get
			* @memberOf Stack
			* @param {string} key The key of the value to get.
			* @returns {*} Returns the entry value.
			*/
			function stackGet(key) {
				return this.__data__.get(key);
			}
			module$115.exports = stackGet;
		}),
		(function(module$116, exports$110) {
			/**
			* Checks if a stack value for `key` exists.
			*
			* @private
			* @name has
			* @memberOf Stack
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function stackHas(key) {
				return this.__data__.has(key);
			}
			module$116.exports = stackHas;
		}),
		(function(module$117, exports$111, __webpack_require__) {
			var ListCache = __webpack_require__(25), Map = __webpack_require__(32), MapCache = __webpack_require__(53);
			/** Used as the size to enable large array optimizations. */
			var LARGE_ARRAY_SIZE = 200;
			/**
			* Sets the stack `key` to `value`.
			*
			* @private
			* @name set
			* @memberOf Stack
			* @param {string} key The key of the value to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns the stack cache instance.
			*/
			function stackSet(key, value) {
				var data = this.__data__;
				if (data instanceof ListCache) {
					var pairs = data.__data__;
					if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
						pairs.push([key, value]);
						this.size = ++data.size;
						return this;
					}
					data = this.__data__ = new MapCache(pairs);
				}
				data.set(key, value);
				this.size = data.size;
				return this;
			}
			module$117.exports = stackSet;
		}),
		(function(module$118, exports$112, __webpack_require__) {
			var isFunction = __webpack_require__(33), isMasked = __webpack_require__(114), isObject = __webpack_require__(14), toSource = __webpack_require__(52);
			/**
			* Used to match `RegExp`
			* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
			*/
			var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
			/** Used to detect host constructors (Safari). */
			var reIsHostCtor = /^\[object .+?Constructor\]$/;
			/** Used for built-in method references. */
			var funcProto = Function.prototype, objectProto = Object.prototype;
			/** Used to resolve the decompiled source of functions. */
			var funcToString = funcProto.toString;
			/** Used to check objects for own properties. */
			var hasOwnProperty = objectProto.hasOwnProperty;
			/** Used to detect if a method is native. */
			var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
			/**
			* The base implementation of `_.isNative` without bad shim checks.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a native function,
			*  else `false`.
			*/
			function baseIsNative(value) {
				if (!isObject(value) || isMasked(value)) return false;
				return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
			}
			module$118.exports = baseIsNative;
		}),
		(function(module$119, exports$113, __webpack_require__) {
			var Symbol = __webpack_require__(23);
			/** Used for built-in method references. */
			var objectProto = Object.prototype;
			/** Used to check objects for own properties. */
			var hasOwnProperty = objectProto.hasOwnProperty;
			/**
			* Used to resolve the
			* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
			* of values.
			*/
			var nativeObjectToString = objectProto.toString;
			/** Built-in value references. */
			var symToStringTag = Symbol ? Symbol.toStringTag : void 0;
			/**
			* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
			*
			* @private
			* @param {*} value The value to query.
			* @returns {string} Returns the raw `toStringTag`.
			*/
			function getRawTag(value) {
				var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
				try {
					value[symToStringTag] = void 0;
					var unmasked = true;
				} catch (e) {}
				var result = nativeObjectToString.call(value);
				if (unmasked) if (isOwn) value[symToStringTag] = tag;
				else delete value[symToStringTag];
				return result;
			}
			module$119.exports = getRawTag;
		}),
		(function(module$120, exports$114) {
			/**
			* Used to resolve the
			* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
			* of values.
			*/
			var nativeObjectToString = Object.prototype.toString;
			/**
			* Converts `value` to a string using `Object.prototype.toString`.
			*
			* @private
			* @param {*} value The value to convert.
			* @returns {string} Returns the converted string.
			*/
			function objectToString(value) {
				return nativeObjectToString.call(value);
			}
			module$120.exports = objectToString;
		}),
		(function(module$121, exports$115, __webpack_require__) {
			var coreJsData = __webpack_require__(115);
			/** Used to detect methods masquerading as native. */
			var maskSrcKey = function() {
				var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
				return uid ? "Symbol(src)_1." + uid : "";
			}();
			/**
			* Checks if `func` has its source masked.
			*
			* @private
			* @param {Function} func The function to check.
			* @returns {boolean} Returns `true` if `func` is masked, else `false`.
			*/
			function isMasked(func) {
				return !!maskSrcKey && maskSrcKey in func;
			}
			module$121.exports = isMasked;
		}),
		(function(module$122, exports$116, __webpack_require__) {
			module$122.exports = __webpack_require__(11)["__core-js_shared__"];
		}),
		(function(module$123, exports$117) {
			/**
			* Gets the value at `key` of `object`.
			*
			* @private
			* @param {Object} [object] The object to query.
			* @param {string} key The key of the property to get.
			* @returns {*} Returns the property value.
			*/
			function getValue(object, key) {
				return object == null ? void 0 : object[key];
			}
			module$123.exports = getValue;
		}),
		(function(module$124, exports$118, __webpack_require__) {
			var Hash = __webpack_require__(118), ListCache = __webpack_require__(25), Map = __webpack_require__(32);
			/**
			* Removes all key-value entries from the map.
			*
			* @private
			* @name clear
			* @memberOf MapCache
			*/
			function mapCacheClear() {
				this.size = 0;
				this.__data__ = {
					"hash": new Hash(),
					"map": new (Map || ListCache)(),
					"string": new Hash()
				};
			}
			module$124.exports = mapCacheClear;
		}),
		(function(module$125, exports$119, __webpack_require__) {
			var hashClear = __webpack_require__(119), hashDelete = __webpack_require__(120), hashGet = __webpack_require__(121), hashHas = __webpack_require__(122), hashSet = __webpack_require__(123);
			/**
			* Creates a hash object.
			*
			* @private
			* @constructor
			* @param {Array} [entries] The key-value pairs to cache.
			*/
			function Hash(entries) {
				var index = -1, length = entries == null ? 0 : entries.length;
				this.clear();
				while (++index < length) {
					var entry = entries[index];
					this.set(entry[0], entry[1]);
				}
			}
			Hash.prototype.clear = hashClear;
			Hash.prototype["delete"] = hashDelete;
			Hash.prototype.get = hashGet;
			Hash.prototype.has = hashHas;
			Hash.prototype.set = hashSet;
			module$125.exports = Hash;
		}),
		(function(module$126, exports$120, __webpack_require__) {
			var nativeCreate = __webpack_require__(28);
			/**
			* Removes all key-value entries from the hash.
			*
			* @private
			* @name clear
			* @memberOf Hash
			*/
			function hashClear() {
				this.__data__ = nativeCreate ? nativeCreate(null) : {};
				this.size = 0;
			}
			module$126.exports = hashClear;
		}),
		(function(module$127, exports$121) {
			/**
			* Removes `key` and its value from the hash.
			*
			* @private
			* @name delete
			* @memberOf Hash
			* @param {Object} hash The hash to modify.
			* @param {string} key The key of the value to remove.
			* @returns {boolean} Returns `true` if the entry was removed, else `false`.
			*/
			function hashDelete(key) {
				var result = this.has(key) && delete this.__data__[key];
				this.size -= result ? 1 : 0;
				return result;
			}
			module$127.exports = hashDelete;
		}),
		(function(module$128, exports$122, __webpack_require__) {
			var nativeCreate = __webpack_require__(28);
			/** Used to stand-in for `undefined` hash values. */
			var HASH_UNDEFINED = "__lodash_hash_undefined__";
			/** Used to check objects for own properties. */
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			/**
			* Gets the hash value for `key`.
			*
			* @private
			* @name get
			* @memberOf Hash
			* @param {string} key The key of the value to get.
			* @returns {*} Returns the entry value.
			*/
			function hashGet(key) {
				var data = this.__data__;
				if (nativeCreate) {
					var result = data[key];
					return result === HASH_UNDEFINED ? void 0 : result;
				}
				return hasOwnProperty.call(data, key) ? data[key] : void 0;
			}
			module$128.exports = hashGet;
		}),
		(function(module$129, exports$123, __webpack_require__) {
			var nativeCreate = __webpack_require__(28);
			/** Used to check objects for own properties. */
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			/**
			* Checks if a hash value for `key` exists.
			*
			* @private
			* @name has
			* @memberOf Hash
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function hashHas(key) {
				var data = this.__data__;
				return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
			}
			module$129.exports = hashHas;
		}),
		(function(module$130, exports$124, __webpack_require__) {
			var nativeCreate = __webpack_require__(28);
			/** Used to stand-in for `undefined` hash values. */
			var HASH_UNDEFINED = "__lodash_hash_undefined__";
			/**
			* Sets the hash `key` to `value`.
			*
			* @private
			* @name set
			* @memberOf Hash
			* @param {string} key The key of the value to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns the hash instance.
			*/
			function hashSet(key, value) {
				var data = this.__data__;
				this.size += this.has(key) ? 0 : 1;
				data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
				return this;
			}
			module$130.exports = hashSet;
		}),
		(function(module$131, exports$125, __webpack_require__) {
			var getMapData = __webpack_require__(29);
			/**
			* Removes `key` and its value from the map.
			*
			* @private
			* @name delete
			* @memberOf MapCache
			* @param {string} key The key of the value to remove.
			* @returns {boolean} Returns `true` if the entry was removed, else `false`.
			*/
			function mapCacheDelete(key) {
				var result = getMapData(this, key)["delete"](key);
				this.size -= result ? 1 : 0;
				return result;
			}
			module$131.exports = mapCacheDelete;
		}),
		(function(module$132, exports$126) {
			/**
			* Checks if `value` is suitable for use as unique object key.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
			*/
			function isKeyable(value) {
				var type = typeof value;
				return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
			}
			module$132.exports = isKeyable;
		}),
		(function(module$133, exports$127, __webpack_require__) {
			var getMapData = __webpack_require__(29);
			/**
			* Gets the map value for `key`.
			*
			* @private
			* @name get
			* @memberOf MapCache
			* @param {string} key The key of the value to get.
			* @returns {*} Returns the entry value.
			*/
			function mapCacheGet(key) {
				return getMapData(this, key).get(key);
			}
			module$133.exports = mapCacheGet;
		}),
		(function(module$134, exports$128, __webpack_require__) {
			var getMapData = __webpack_require__(29);
			/**
			* Checks if a map value for `key` exists.
			*
			* @private
			* @name has
			* @memberOf MapCache
			* @param {string} key The key of the entry to check.
			* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
			*/
			function mapCacheHas(key) {
				return getMapData(this, key).has(key);
			}
			module$134.exports = mapCacheHas;
		}),
		(function(module$135, exports$129, __webpack_require__) {
			var getMapData = __webpack_require__(29);
			/**
			* Sets the map `key` to `value`.
			*
			* @private
			* @name set
			* @memberOf MapCache
			* @param {string} key The key of the value to set.
			* @param {*} value The value to set.
			* @returns {Object} Returns the map cache instance.
			*/
			function mapCacheSet(key, value) {
				var data = getMapData(this, key), size = data.size;
				data.set(key, value);
				this.size += data.size == size ? 0 : 1;
				return this;
			}
			module$135.exports = mapCacheSet;
		}),
		(function(module$136, exports$130, __webpack_require__) {
			module$136.exports = __webpack_require__(130)();
		}),
		(function(module$137, exports$131) {
			/**
			* Creates a base function for methods like `_.forIn` and `_.forOwn`.
			*
			* @private
			* @param {boolean} [fromRight] Specify iterating from right to left.
			* @returns {Function} Returns the new base function.
			*/
			function createBaseFor(fromRight) {
				return function(object, iteratee, keysFunc) {
					var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
					while (length--) {
						var key = props[fromRight ? length : ++index];
						if (iteratee(iterable[key], key, iterable) === false) break;
					}
					return object;
				};
			}
			module$137.exports = createBaseFor;
		}),
		(function(module$138, exports$132, __webpack_require__) {
			var assignMergeValue = __webpack_require__(54), cloneBuffer = __webpack_require__(56), cloneTypedArray = __webpack_require__(57), copyArray = __webpack_require__(58), initCloneObject = __webpack_require__(59), isArguments = __webpack_require__(39), isArray = __webpack_require__(16), isArrayLikeObject = __webpack_require__(135), isBuffer = __webpack_require__(40), isFunction = __webpack_require__(33), isObject = __webpack_require__(14), isPlainObject = __webpack_require__(62), isTypedArray = __webpack_require__(63), safeGet = __webpack_require__(64), toPlainObject = __webpack_require__(138);
			/**
			* A specialized version of `baseMerge` for arrays and objects which performs
			* deep merges and tracks traversed objects enabling objects with circular
			* references to be merged.
			*
			* @private
			* @param {Object} object The destination object.
			* @param {Object} source The source object.
			* @param {string} key The key of the value to merge.
			* @param {number} srcIndex The index of `source`.
			* @param {Function} mergeFunc The function to merge values.
			* @param {Function} [customizer] The function to customize assigned values.
			* @param {Object} [stack] Tracks traversed source values and their merged
			*  counterparts.
			*/
			function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
				var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
				if (stacked) {
					assignMergeValue(object, key, stacked);
					return;
				}
				var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
				var isCommon = newValue === void 0;
				if (isCommon) {
					var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
					newValue = srcValue;
					if (isArr || isBuff || isTyped) if (isArray(objValue)) newValue = objValue;
					else if (isArrayLikeObject(objValue)) newValue = copyArray(objValue);
					else if (isBuff) {
						isCommon = false;
						newValue = cloneBuffer(srcValue, true);
					} else if (isTyped) {
						isCommon = false;
						newValue = cloneTypedArray(srcValue, true);
					} else newValue = [];
					else if (isPlainObject(srcValue) || isArguments(srcValue)) {
						newValue = objValue;
						if (isArguments(objValue)) newValue = toPlainObject(objValue);
						else if (!isObject(objValue) || isFunction(objValue)) newValue = initCloneObject(srcValue);
					} else isCommon = false;
				}
				if (isCommon) {
					stack.set(srcValue, newValue);
					mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
					stack["delete"](srcValue);
				}
				assignMergeValue(object, key, newValue);
			}
			module$138.exports = baseMergeDeep;
		}),
		(function(module$139, exports$133, __webpack_require__) {
			module$139.exports = __webpack_require__(11).Uint8Array;
		}),
		(function(module$140, exports$134, __webpack_require__) {
			var isObject = __webpack_require__(14);
			/** Built-in value references. */
			var objectCreate = Object.create;
			module$140.exports = function() {
				function object() {}
				return function(proto) {
					if (!isObject(proto)) return {};
					if (objectCreate) return objectCreate(proto);
					object.prototype = proto;
					var result = new object();
					object.prototype = void 0;
					return result;
				};
			}();
		}),
		(function(module$141, exports$135, __webpack_require__) {
			var baseGetTag = __webpack_require__(21), isObjectLike = __webpack_require__(15);
			/** `Object#toString` result references. */
			var argsTag = "[object Arguments]";
			/**
			* The base implementation of `_.isArguments`.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an `arguments` object,
			*/
			function baseIsArguments(value) {
				return isObjectLike(value) && baseGetTag(value) == argsTag;
			}
			module$141.exports = baseIsArguments;
		}),
		(function(module$142, exports$136, __webpack_require__) {
			var isArrayLike = __webpack_require__(30), isObjectLike = __webpack_require__(15);
			/**
			* This method is like `_.isArrayLike` except that it also checks if `value`
			* is an object.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is an array-like object,
			*  else `false`.
			* @example
			*
			* _.isArrayLikeObject([1, 2, 3]);
			* // => true
			*
			* _.isArrayLikeObject(document.body.children);
			* // => true
			*
			* _.isArrayLikeObject('abc');
			* // => false
			*
			* _.isArrayLikeObject(_.noop);
			* // => false
			*/
			function isArrayLikeObject(value) {
				return isObjectLike(value) && isArrayLike(value);
			}
			module$142.exports = isArrayLikeObject;
		}),
		(function(module$143, exports$137) {
			/**
			* This method returns `false`.
			*
			* @static
			* @memberOf _
			* @since 4.13.0
			* @category Util
			* @returns {boolean} Returns `false`.
			* @example
			*
			* _.times(2, _.stubFalse);
			* // => [false, false]
			*/
			function stubFalse() {
				return false;
			}
			module$143.exports = stubFalse;
		}),
		(function(module$144, exports$138, __webpack_require__) {
			var baseGetTag = __webpack_require__(21), isLength = __webpack_require__(61), isObjectLike = __webpack_require__(15);
			/** `Object#toString` result references. */
			var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", weakMapTag = "[object WeakMap]";
			var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
			/** Used to identify `toStringTag` values of typed arrays. */
			var typedArrayTags = {};
			typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
			typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
			/**
			* The base implementation of `_.isTypedArray` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
			*/
			function baseIsTypedArray(value) {
				return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
			}
			module$144.exports = baseIsTypedArray;
		}),
		(function(module$145, exports$139, __webpack_require__) {
			var copyObject = __webpack_require__(22), keysIn = __webpack_require__(24);
			/**
			* Converts `value` to a plain object flattening inherited enumerable string
			* keyed properties of `value` to own properties of the plain object.
			*
			* @static
			* @memberOf _
			* @since 3.0.0
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {Object} Returns the converted plain object.
			* @example
			*
			* function Foo() {
			*   this.b = 2;
			* }
			*
			* Foo.prototype.c = 3;
			*
			* _.assign({ 'a': 1 }, new Foo);
			* // => { 'a': 1, 'b': 2 }
			*
			* _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
			* // => { 'a': 1, 'b': 2, 'c': 3 }
			*/
			function toPlainObject(value) {
				return copyObject(value, keysIn(value));
			}
			module$145.exports = toPlainObject;
		}),
		(function(module$146, exports$140) {
			/**
			* The base implementation of `_.times` without support for iteratee shorthands
			* or max array length checks.
			*
			* @private
			* @param {number} n The number of times to invoke `iteratee`.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array} Returns the array of results.
			*/
			function baseTimes(n, iteratee) {
				var index = -1, result = Array(n);
				while (++index < n) result[index] = iteratee(index);
				return result;
			}
			module$146.exports = baseTimes;
		}),
		(function(module$147, exports$141, __webpack_require__) {
			var isObject = __webpack_require__(14), isPrototype = __webpack_require__(38), nativeKeysIn = __webpack_require__(141);
			/** Used to check objects for own properties. */
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			/**
			* The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			*/
			function baseKeysIn(object) {
				if (!isObject(object)) return nativeKeysIn(object);
				var isProto = isPrototype(object), result = [];
				for (var key in object) if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) result.push(key);
				return result;
			}
			module$147.exports = baseKeysIn;
		}),
		(function(module$148, exports$142) {
			/**
			* This function is like
			* [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
			* except that it includes inherited enumerable properties.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			*/
			function nativeKeysIn(object) {
				var result = [];
				if (object != null) for (var key in Object(object)) result.push(key);
				return result;
			}
			module$148.exports = nativeKeysIn;
		}),
		(function(module$149, exports$143, __webpack_require__) {
			var baseRest = __webpack_require__(143), isIterateeCall = __webpack_require__(148);
			/**
			* Creates a function like `_.assign`.
			*
			* @private
			* @param {Function} assigner The function to assign values.
			* @returns {Function} Returns the new assigner function.
			*/
			function createAssigner(assigner) {
				return baseRest(function(object, sources) {
					var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
					customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
					if (guard && isIterateeCall(sources[0], sources[1], guard)) {
						customizer = length < 3 ? void 0 : customizer;
						length = 1;
					}
					object = Object(object);
					while (++index < length) {
						var source = sources[index];
						if (source) assigner(object, source, index, customizer);
					}
					return object;
				});
			}
			module$149.exports = createAssigner;
		}),
		(function(module$150, exports$144, __webpack_require__) {
			var identity = __webpack_require__(68), overRest = __webpack_require__(69), setToString = __webpack_require__(70);
			/**
			* The base implementation of `_.rest` which doesn't validate or coerce arguments.
			*
			* @private
			* @param {Function} func The function to apply a rest parameter to.
			* @param {number} [start=func.length-1] The start position of the rest parameter.
			* @returns {Function} Returns the new function.
			*/
			function baseRest(func, start) {
				return setToString(overRest(func, start, identity), func + "");
			}
			module$150.exports = baseRest;
		}),
		(function(module$151, exports$145) {
			/**
			* A faster alternative to `Function#apply`, this function invokes `func`
			* with the `this` binding of `thisArg` and the arguments of `args`.
			*
			* @private
			* @param {Function} func The function to invoke.
			* @param {*} thisArg The `this` binding of `func`.
			* @param {Array} args The arguments to invoke `func` with.
			* @returns {*} Returns the result of `func`.
			*/
			function apply(func, thisArg, args) {
				switch (args.length) {
					case 0: return func.call(thisArg);
					case 1: return func.call(thisArg, args[0]);
					case 2: return func.call(thisArg, args[0], args[1]);
					case 3: return func.call(thisArg, args[0], args[1], args[2]);
				}
				return func.apply(thisArg, args);
			}
			module$151.exports = apply;
		}),
		(function(module$152, exports$146, __webpack_require__) {
			var constant = __webpack_require__(146), defineProperty = __webpack_require__(55), identity = __webpack_require__(68);
			module$152.exports = !defineProperty ? identity : function(func, string) {
				return defineProperty(func, "toString", {
					"configurable": true,
					"enumerable": false,
					"value": constant(string),
					"writable": true
				});
			};
		}),
		(function(module$153, exports$147) {
			/**
			* Creates a function that returns `value`.
			*
			* @static
			* @memberOf _
			* @since 2.4.0
			* @category Util
			* @param {*} value The value to return from the new function.
			* @returns {Function} Returns the new constant function.
			* @example
			*
			* var objects = _.times(2, _.constant({ 'a': 1 }));
			*
			* console.log(objects);
			* // => [{ 'a': 1 }, { 'a': 1 }]
			*
			* console.log(objects[0] === objects[1]);
			* // => true
			*/
			function constant(value) {
				return function() {
					return value;
				};
			}
			module$153.exports = constant;
		}),
		(function(module$154, exports$148) {
			/** Used to detect hot functions by number of calls within a span of milliseconds. */
			var HOT_COUNT = 800, HOT_SPAN = 16;
			var nativeNow = Date.now;
			/**
			* Creates a function that'll short out and invoke `identity` instead
			* of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
			* milliseconds.
			*
			* @private
			* @param {Function} func The function to restrict.
			* @returns {Function} Returns the new shortable function.
			*/
			function shortOut(func) {
				var count = 0, lastCalled = 0;
				return function() {
					var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
					lastCalled = stamp;
					if (remaining > 0) {
						if (++count >= HOT_COUNT) return arguments[0];
					} else count = 0;
					return func.apply(void 0, arguments);
				};
			}
			module$154.exports = shortOut;
		}),
		(function(module$155, exports$149, __webpack_require__) {
			var eq = __webpack_require__(27), isArrayLike = __webpack_require__(30), isIndex = __webpack_require__(67), isObject = __webpack_require__(14);
			/**
			* Checks if the given arguments are from an iteratee call.
			*
			* @private
			* @param {*} value The potential iteratee value argument.
			* @param {*} index The potential iteratee index or key argument.
			* @param {*} object The potential iteratee object argument.
			* @returns {boolean} Returns `true` if the arguments are from an iteratee call,
			*  else `false`.
			*/
			function isIterateeCall(value, index, object) {
				if (!isObject(object)) return false;
				var type = typeof index;
				if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) return eq(object[index], value);
				return false;
			}
			module$155.exports = isIterateeCall;
		}),
		(function(module$156, exports$150) {
			if (typeof window !== "undefined") {
				if (!window.requestAnimationFrame) window.requestAnimationFrame = function() {
					return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
						window.setTimeout(callback, 1e3 / 60);
					};
				}();
			}
			if (typeof Math.imul !== "function") Math.imul = function(a, b) {
				var ah = a >>> 16 & 65535;
				var al = a & 65535;
				var bh = b >>> 16 & 65535;
				var bl = b & 65535;
				return al * bl + (ah * bl + al * bh << 16 >>> 0) | 0;
			};
			if (typeof Object.assign !== "function") Object.assign = function(target) {
				"use strict";
				if (target === null) throw new TypeError("Cannot convert undefined or null to object");
				var to = Object(target);
				for (var index = 1; index < arguments.length; index++) {
					var nextSource = arguments[index];
					if (nextSource !== null) {
						for (var nextKey in nextSource) if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) to[nextKey] = nextSource[nextKey];
					}
				}
				return to;
			};
		}),
		(function(module$157, exports$151) {
			function _arrayWithHoles(r) {
				if (Array.isArray(r)) return r;
			}
			module$157.exports = _arrayWithHoles, module$157.exports.__esModule = true, module$157.exports["default"] = module$157.exports;
		}),
		(function(module$158, exports$152) {
			function _iterableToArrayLimit(r, l) {
				var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
				if (null != t) {
					var e, n, i, u, a = [], f = !0, o = !1;
					try {
						if (i = (t = t.call(r)).next, 0 === l) {
							if (Object(t) !== t) return;
							f = !1;
						} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
					} catch (r) {
						o = !0, n = r;
					} finally {
						try {
							if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
						} finally {
							if (o) throw n;
						}
					}
					return a;
				}
			}
			module$158.exports = _iterableToArrayLimit, module$158.exports.__esModule = true, module$158.exports["default"] = module$158.exports;
		}),
		(function(module$159, exports$153) {
			function _nonIterableRest() {
				throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
			}
			module$159.exports = _nonIterableRest, module$159.exports.__esModule = true, module$159.exports["default"] = module$159.exports;
		}),
		(function(module$160, exports$154, __webpack_require__) {
			var _typeof = __webpack_require__(13)["default"];
			function toPrimitive(t, r) {
				if ("object" != _typeof(t) || !t) return t;
				var e = t[Symbol.toPrimitive];
				if (void 0 !== e) {
					var i = e.call(t, r || "default");
					if ("object" != _typeof(i)) return i;
					throw new TypeError("@@toPrimitive must return a primitive value.");
				}
				return ("string" === r ? String : Number)(t);
			}
			module$160.exports = toPrimitive, module$160.exports.__esModule = true, module$160.exports["default"] = module$160.exports;
		}),
		(function(module$161, exports$155, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$155, "__esModule", { value: true });
			exports$155.LDU = LDU;
			exports$155.add = add;
			exports$155.adjoint = adjoint;
			exports$155.clone = clone;
			exports$155.copy = copy;
			exports$155.create = create;
			exports$155.determinant = determinant;
			exports$155.equals = equals;
			exports$155.exactEquals = exactEquals;
			exports$155.frob = frob;
			exports$155.fromRotation = fromRotation;
			exports$155.fromScaling = fromScaling;
			exports$155.fromValues = fromValues;
			exports$155.identity = identity;
			exports$155.invert = invert;
			exports$155.mul = void 0;
			exports$155.multiply = multiply;
			exports$155.multiplyScalar = multiplyScalar;
			exports$155.multiplyScalarAndAdd = multiplyScalarAndAdd;
			exports$155.rotate = rotate;
			exports$155.scale = scale;
			exports$155.set = set;
			exports$155.str = str;
			exports$155.sub = void 0;
			exports$155.subtract = subtract;
			exports$155.transpose = transpose;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* 2x2 Matrix
			* @module mat2
			*/
			/**
			* Creates a new identity mat2
			*
			* @returns {mat2} a new 2x2 matrix
			*/
			function create() {
				var out = new glMatrix.ARRAY_TYPE(4);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					out[1] = 0;
					out[2] = 0;
				}
				out[0] = 1;
				out[3] = 1;
				return out;
			}
			/**
			* Creates a new mat2 initialized with values from an existing matrix
			*
			* @param {ReadonlyMat2} a matrix to clone
			* @returns {mat2} a new 2x2 matrix
			*/
			function clone(a) {
				var out = new glMatrix.ARRAY_TYPE(4);
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				return out;
			}
			/**
			* Copy the values from one mat2 to another
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the source matrix
			* @returns {mat2} out
			*/
			function copy(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				return out;
			}
			/**
			* Set a mat2 to the identity matrix
			*
			* @param {mat2} out the receiving matrix
			* @returns {mat2} out
			*/
			function identity(out) {
				out[0] = 1;
				out[1] = 0;
				out[2] = 0;
				out[3] = 1;
				return out;
			}
			/**
			* Create a new mat2 with the given values
			*
			* @param {Number} m00 Component in column 0, row 0 position (index 0)
			* @param {Number} m01 Component in column 0, row 1 position (index 1)
			* @param {Number} m10 Component in column 1, row 0 position (index 2)
			* @param {Number} m11 Component in column 1, row 1 position (index 3)
			* @returns {mat2} out A new 2x2 matrix
			*/
			function fromValues(m00, m01, m10, m11) {
				var out = new glMatrix.ARRAY_TYPE(4);
				out[0] = m00;
				out[1] = m01;
				out[2] = m10;
				out[3] = m11;
				return out;
			}
			/**
			* Set the components of a mat2 to the given values
			*
			* @param {mat2} out the receiving matrix
			* @param {Number} m00 Component in column 0, row 0 position (index 0)
			* @param {Number} m01 Component in column 0, row 1 position (index 1)
			* @param {Number} m10 Component in column 1, row 0 position (index 2)
			* @param {Number} m11 Component in column 1, row 1 position (index 3)
			* @returns {mat2} out
			*/
			function set(out, m00, m01, m10, m11) {
				out[0] = m00;
				out[1] = m01;
				out[2] = m10;
				out[3] = m11;
				return out;
			}
			/**
			* Transpose the values of a mat2
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the source matrix
			* @returns {mat2} out
			*/
			function transpose(out, a) {
				if (out === a) {
					var a1 = a[1];
					out[1] = a[2];
					out[2] = a1;
				} else {
					out[0] = a[0];
					out[1] = a[2];
					out[2] = a[1];
					out[3] = a[3];
				}
				return out;
			}
			/**
			* Inverts a mat2
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the source matrix
			* @returns {mat2 | null} out, or null if source matrix is not invertible
			*/
			function invert(out, a) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
				var det = a0 * a3 - a2 * a1;
				if (!det) return null;
				det = 1 / det;
				out[0] = a3 * det;
				out[1] = -a1 * det;
				out[2] = -a2 * det;
				out[3] = a0 * det;
				return out;
			}
			/**
			* Calculates the adjugate of a mat2
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the source matrix
			* @returns {mat2} out
			*/
			function adjoint(out, a) {
				var a0 = a[0];
				out[0] = a[3];
				out[1] = -a[1];
				out[2] = -a[2];
				out[3] = a0;
				return out;
			}
			/**
			* Calculates the determinant of a mat2
			*
			* @param {ReadonlyMat2} a the source matrix
			* @returns {Number} determinant of a
			*/
			function determinant(a) {
				return a[0] * a[3] - a[2] * a[1];
			}
			/**
			* Multiplies two mat2's
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the first operand
			* @param {ReadonlyMat2} b the second operand
			* @returns {mat2} out
			*/
			function multiply(out, a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
				out[0] = a0 * b0 + a2 * b1;
				out[1] = a1 * b0 + a3 * b1;
				out[2] = a0 * b2 + a2 * b3;
				out[3] = a1 * b2 + a3 * b3;
				return out;
			}
			/**
			* Rotates a mat2 by the given angle
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the matrix to rotate
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat2} out
			*/
			function rotate(out, a, rad) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				out[0] = a0 * c + a2 * s;
				out[1] = a1 * c + a3 * s;
				out[2] = a0 * -s + a2 * c;
				out[3] = a1 * -s + a3 * c;
				return out;
			}
			/**
			* Scales the mat2 by the dimensions in the given vec2
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the matrix to rotate
			* @param {ReadonlyVec2} v the vec2 to scale the matrix by
			* @returns {mat2} out
			**/
			function scale(out, a, v) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
				var v0 = v[0], v1 = v[1];
				out[0] = a0 * v0;
				out[1] = a1 * v0;
				out[2] = a2 * v1;
				out[3] = a3 * v1;
				return out;
			}
			/**
			* Creates a matrix from a given angle
			* This is equivalent to (but much faster than):
			*
			*     mat2.identity(dest);
			*     mat2.rotate(dest, dest, rad);
			*
			* @param {mat2} out mat2 receiving operation result
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat2} out
			*/
			function fromRotation(out, rad) {
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				out[0] = c;
				out[1] = s;
				out[2] = -s;
				out[3] = c;
				return out;
			}
			/**
			* Creates a matrix from a vector scaling
			* This is equivalent to (but much faster than):
			*
			*     mat2.identity(dest);
			*     mat2.scale(dest, dest, vec);
			*
			* @param {mat2} out mat2 receiving operation result
			* @param {ReadonlyVec2} v Scaling vector
			* @returns {mat2} out
			*/
			function fromScaling(out, v) {
				out[0] = v[0];
				out[1] = 0;
				out[2] = 0;
				out[3] = v[1];
				return out;
			}
			/**
			* Returns a string representation of a mat2
			*
			* @param {ReadonlyMat2} a matrix to represent as a string
			* @returns {String} string representation of the matrix
			*/
			function str(a) {
				return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
			}
			/**
			* Returns Frobenius norm of a mat2
			*
			* @param {ReadonlyMat2} a the matrix to calculate Frobenius norm of
			* @returns {Number} Frobenius norm
			*/
			function frob(a) {
				return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
			}
			/**
			* Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
			* @param {ReadonlyMat2} L the lower triangular matrix
			* @param {ReadonlyMat2} D the diagonal matrix
			* @param {ReadonlyMat2} U the upper triangular matrix
			* @param {ReadonlyMat2} a the input matrix to factorize
			*/
			function LDU(L, D, U, a) {
				L[2] = a[2] / a[0];
				U[0] = a[0];
				U[1] = a[1];
				U[3] = a[3] - L[2] * U[1];
				return [
					L,
					D,
					U
				];
			}
			/**
			* Adds two mat2's
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the first operand
			* @param {ReadonlyMat2} b the second operand
			* @returns {mat2} out
			*/
			function add(out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				out[2] = a[2] + b[2];
				out[3] = a[3] + b[3];
				return out;
			}
			/**
			* Subtracts matrix b from matrix a
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the first operand
			* @param {ReadonlyMat2} b the second operand
			* @returns {mat2} out
			*/
			function subtract(out, a, b) {
				out[0] = a[0] - b[0];
				out[1] = a[1] - b[1];
				out[2] = a[2] - b[2];
				out[3] = a[3] - b[3];
				return out;
			}
			/**
			* Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
			*
			* @param {ReadonlyMat2} a The first matrix.
			* @param {ReadonlyMat2} b The second matrix.
			* @returns {Boolean} True if the matrices are equal, false otherwise.
			*/
			function exactEquals(a, b) {
				return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
			}
			/**
			* Returns whether or not the matrices have approximately the same elements in the same position.
			*
			* @param {ReadonlyMat2} a The first matrix.
			* @param {ReadonlyMat2} b The second matrix.
			* @returns {Boolean} True if the matrices are equal, false otherwise.
			*/
			function equals(a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
				return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
			}
			/**
			* Multiply each element of the matrix by a scalar.
			*
			* @param {mat2} out the receiving matrix
			* @param {ReadonlyMat2} a the matrix to scale
			* @param {Number} b amount to scale the matrix's elements by
			* @returns {mat2} out
			*/
			function multiplyScalar(out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				out[2] = a[2] * b;
				out[3] = a[3] * b;
				return out;
			}
			/**
			* Adds two mat2's after multiplying each element of the second operand by a scalar value.
			*
			* @param {mat2} out the receiving vector
			* @param {ReadonlyMat2} a the first operand
			* @param {ReadonlyMat2} b the second operand
			* @param {Number} scale the amount to scale b's elements by before adding
			* @returns {mat2} out
			*/
			function multiplyScalarAndAdd(out, a, b, scale) {
				out[0] = a[0] + b[0] * scale;
				out[1] = a[1] + b[1] * scale;
				out[2] = a[2] + b[2] * scale;
				out[3] = a[3] + b[3] * scale;
				return out;
			}
			exports$155.mul = multiply;
			exports$155.sub = subtract;
		}),
		(function(module$162, exports$156, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$156, "__esModule", { value: true });
			exports$156.add = add;
			exports$156.clone = clone;
			exports$156.copy = copy;
			exports$156.create = create;
			exports$156.determinant = determinant;
			exports$156.equals = equals;
			exports$156.exactEquals = exactEquals;
			exports$156.frob = frob;
			exports$156.fromRotation = fromRotation;
			exports$156.fromScaling = fromScaling;
			exports$156.fromTranslation = fromTranslation;
			exports$156.fromValues = fromValues;
			exports$156.identity = identity;
			exports$156.invert = invert;
			exports$156.mul = void 0;
			exports$156.multiply = multiply;
			exports$156.multiplyScalar = multiplyScalar;
			exports$156.multiplyScalarAndAdd = multiplyScalarAndAdd;
			exports$156.rotate = rotate;
			exports$156.scale = scale;
			exports$156.set = set;
			exports$156.str = str;
			exports$156.sub = void 0;
			exports$156.subtract = subtract;
			exports$156.translate = translate;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* 2x3 Matrix
			* @module mat2d
			* @description
			* A mat2d contains six elements defined as:
			* <pre>
			* [a, b,
			*  c, d,
			*  tx, ty]
			* </pre>
			* This is a short form for the 3x3 matrix:
			* <pre>
			* [a, b, 0,
			*  c, d, 0,
			*  tx, ty, 1]
			* </pre>
			* The last column is ignored so the array is shorter and operations are faster.
			*/
			/**
			* Creates a new identity mat2d
			*
			* @returns {mat2d} a new 2x3 matrix
			*/
			function create() {
				var out = new glMatrix.ARRAY_TYPE(6);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					out[1] = 0;
					out[2] = 0;
					out[4] = 0;
					out[5] = 0;
				}
				out[0] = 1;
				out[3] = 1;
				return out;
			}
			/**
			* Creates a new mat2d initialized with values from an existing matrix
			*
			* @param {ReadonlyMat2d} a matrix to clone
			* @returns {mat2d} a new 2x3 matrix
			*/
			function clone(a) {
				var out = new glMatrix.ARRAY_TYPE(6);
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				out[4] = a[4];
				out[5] = a[5];
				return out;
			}
			/**
			* Copy the values from one mat2d to another
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the source matrix
			* @returns {mat2d} out
			*/
			function copy(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				out[4] = a[4];
				out[5] = a[5];
				return out;
			}
			/**
			* Set a mat2d to the identity matrix
			*
			* @param {mat2d} out the receiving matrix
			* @returns {mat2d} out
			*/
			function identity(out) {
				out[0] = 1;
				out[1] = 0;
				out[2] = 0;
				out[3] = 1;
				out[4] = 0;
				out[5] = 0;
				return out;
			}
			/**
			* Create a new mat2d with the given values
			*
			* @param {Number} a Component A (index 0)
			* @param {Number} b Component B (index 1)
			* @param {Number} c Component C (index 2)
			* @param {Number} d Component D (index 3)
			* @param {Number} tx Component TX (index 4)
			* @param {Number} ty Component TY (index 5)
			* @returns {mat2d} A new mat2d
			*/
			function fromValues(a, b, c, d, tx, ty) {
				var out = new glMatrix.ARRAY_TYPE(6);
				out[0] = a;
				out[1] = b;
				out[2] = c;
				out[3] = d;
				out[4] = tx;
				out[5] = ty;
				return out;
			}
			/**
			* Set the components of a mat2d to the given values
			*
			* @param {mat2d} out the receiving matrix
			* @param {Number} a Component A (index 0)
			* @param {Number} b Component B (index 1)
			* @param {Number} c Component C (index 2)
			* @param {Number} d Component D (index 3)
			* @param {Number} tx Component TX (index 4)
			* @param {Number} ty Component TY (index 5)
			* @returns {mat2d} out
			*/
			function set(out, a, b, c, d, tx, ty) {
				out[0] = a;
				out[1] = b;
				out[2] = c;
				out[3] = d;
				out[4] = tx;
				out[5] = ty;
				return out;
			}
			/**
			* Inverts a mat2d
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the source matrix
			* @returns {mat2d | null} out, or null if source matrix is not invertible
			*/
			function invert(out, a) {
				var aa = a[0], ab = a[1], ac = a[2], ad = a[3];
				var atx = a[4], aty = a[5];
				var det = aa * ad - ab * ac;
				if (!det) return null;
				det = 1 / det;
				out[0] = ad * det;
				out[1] = -ab * det;
				out[2] = -ac * det;
				out[3] = aa * det;
				out[4] = (ac * aty - ad * atx) * det;
				out[5] = (ab * atx - aa * aty) * det;
				return out;
			}
			/**
			* Calculates the determinant of a mat2d
			*
			* @param {ReadonlyMat2d} a the source matrix
			* @returns {Number} determinant of a
			*/
			function determinant(a) {
				return a[0] * a[3] - a[1] * a[2];
			}
			/**
			* Multiplies two mat2d's
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the first operand
			* @param {ReadonlyMat2d} b the second operand
			* @returns {mat2d} out
			*/
			function multiply(out, a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
				out[0] = a0 * b0 + a2 * b1;
				out[1] = a1 * b0 + a3 * b1;
				out[2] = a0 * b2 + a2 * b3;
				out[3] = a1 * b2 + a3 * b3;
				out[4] = a0 * b4 + a2 * b5 + a4;
				out[5] = a1 * b4 + a3 * b5 + a5;
				return out;
			}
			/**
			* Rotates a mat2d by the given angle
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the matrix to rotate
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat2d} out
			*/
			function rotate(out, a, rad) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
				var s = Math.sin(rad);
				var c = Math.cos(rad);
				out[0] = a0 * c + a2 * s;
				out[1] = a1 * c + a3 * s;
				out[2] = a0 * -s + a2 * c;
				out[3] = a1 * -s + a3 * c;
				out[4] = a4;
				out[5] = a5;
				return out;
			}
			/**
			* Scales the mat2d by the dimensions in the given vec2
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the matrix to translate
			* @param {ReadonlyVec2} v the vec2 to scale the matrix by
			* @returns {mat2d} out
			**/
			function scale(out, a, v) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
				var v0 = v[0], v1 = v[1];
				out[0] = a0 * v0;
				out[1] = a1 * v0;
				out[2] = a2 * v1;
				out[3] = a3 * v1;
				out[4] = a4;
				out[5] = a5;
				return out;
			}
			/**
			* Translates the mat2d by the dimensions in the given vec2
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the matrix to translate
			* @param {ReadonlyVec2} v the vec2 to translate the matrix by
			* @returns {mat2d} out
			**/
			function translate(out, a, v) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
				var v0 = v[0], v1 = v[1];
				out[0] = a0;
				out[1] = a1;
				out[2] = a2;
				out[3] = a3;
				out[4] = a0 * v0 + a2 * v1 + a4;
				out[5] = a1 * v0 + a3 * v1 + a5;
				return out;
			}
			/**
			* Creates a matrix from a given angle
			* This is equivalent to (but much faster than):
			*
			*     mat2d.identity(dest);
			*     mat2d.rotate(dest, dest, rad);
			*
			* @param {mat2d} out mat2d receiving operation result
			* @param {Number} rad the angle to rotate the matrix by
			* @returns {mat2d} out
			*/
			function fromRotation(out, rad) {
				var s = Math.sin(rad), c = Math.cos(rad);
				out[0] = c;
				out[1] = s;
				out[2] = -s;
				out[3] = c;
				out[4] = 0;
				out[5] = 0;
				return out;
			}
			/**
			* Creates a matrix from a vector scaling
			* This is equivalent to (but much faster than):
			*
			*     mat2d.identity(dest);
			*     mat2d.scale(dest, dest, vec);
			*
			* @param {mat2d} out mat2d receiving operation result
			* @param {ReadonlyVec2} v Scaling vector
			* @returns {mat2d} out
			*/
			function fromScaling(out, v) {
				out[0] = v[0];
				out[1] = 0;
				out[2] = 0;
				out[3] = v[1];
				out[4] = 0;
				out[5] = 0;
				return out;
			}
			/**
			* Creates a matrix from a vector translation
			* This is equivalent to (but much faster than):
			*
			*     mat2d.identity(dest);
			*     mat2d.translate(dest, dest, vec);
			*
			* @param {mat2d} out mat2d receiving operation result
			* @param {ReadonlyVec2} v Translation vector
			* @returns {mat2d} out
			*/
			function fromTranslation(out, v) {
				out[0] = 1;
				out[1] = 0;
				out[2] = 0;
				out[3] = 1;
				out[4] = v[0];
				out[5] = v[1];
				return out;
			}
			/**
			* Returns a string representation of a mat2d
			*
			* @param {ReadonlyMat2d} a matrix to represent as a string
			* @returns {String} string representation of the matrix
			*/
			function str(a) {
				return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
			}
			/**
			* Returns Frobenius norm of a mat2d
			*
			* @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
			* @returns {Number} Frobenius norm
			*/
			function frob(a) {
				return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3] + a[4] * a[4] + a[5] * a[5] + 1);
			}
			/**
			* Adds two mat2d's
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the first operand
			* @param {ReadonlyMat2d} b the second operand
			* @returns {mat2d} out
			*/
			function add(out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				out[2] = a[2] + b[2];
				out[3] = a[3] + b[3];
				out[4] = a[4] + b[4];
				out[5] = a[5] + b[5];
				return out;
			}
			/**
			* Subtracts matrix b from matrix a
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the first operand
			* @param {ReadonlyMat2d} b the second operand
			* @returns {mat2d} out
			*/
			function subtract(out, a, b) {
				out[0] = a[0] - b[0];
				out[1] = a[1] - b[1];
				out[2] = a[2] - b[2];
				out[3] = a[3] - b[3];
				out[4] = a[4] - b[4];
				out[5] = a[5] - b[5];
				return out;
			}
			/**
			* Multiply each element of the matrix by a scalar.
			*
			* @param {mat2d} out the receiving matrix
			* @param {ReadonlyMat2d} a the matrix to scale
			* @param {Number} b amount to scale the matrix's elements by
			* @returns {mat2d} out
			*/
			function multiplyScalar(out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				out[2] = a[2] * b;
				out[3] = a[3] * b;
				out[4] = a[4] * b;
				out[5] = a[5] * b;
				return out;
			}
			/**
			* Adds two mat2d's after multiplying each element of the second operand by a scalar value.
			*
			* @param {mat2d} out the receiving vector
			* @param {ReadonlyMat2d} a the first operand
			* @param {ReadonlyMat2d} b the second operand
			* @param {Number} scale the amount to scale b's elements by before adding
			* @returns {mat2d} out
			*/
			function multiplyScalarAndAdd(out, a, b, scale) {
				out[0] = a[0] + b[0] * scale;
				out[1] = a[1] + b[1] * scale;
				out[2] = a[2] + b[2] * scale;
				out[3] = a[3] + b[3] * scale;
				out[4] = a[4] + b[4] * scale;
				out[5] = a[5] + b[5] * scale;
				return out;
			}
			/**
			* Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
			*
			* @param {ReadonlyMat2d} a The first matrix.
			* @param {ReadonlyMat2d} b The second matrix.
			* @returns {Boolean} True if the matrices are equal, false otherwise.
			*/
			function exactEquals(a, b) {
				return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
			}
			/**
			* Returns whether or not the matrices have approximately the same elements in the same position.
			*
			* @param {ReadonlyMat2d} a The first matrix.
			* @param {ReadonlyMat2d} b The second matrix.
			* @returns {Boolean} True if the matrices are equal, false otherwise.
			*/
			function equals(a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
				return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5));
			}
			exports$156.mul = multiply;
			exports$156.sub = subtract;
		}),
		(function(module$163, exports$157, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$157, "__esModule", { value: true });
			exports$157.add = add;
			exports$157.clone = clone;
			exports$157.conjugate = conjugate;
			exports$157.copy = copy;
			exports$157.create = create;
			exports$157.dot = void 0;
			exports$157.equals = equals;
			exports$157.exactEquals = exactEquals;
			exports$157.fromMat4 = fromMat4;
			exports$157.fromRotation = fromRotation;
			exports$157.fromRotationTranslation = fromRotationTranslation;
			exports$157.fromRotationTranslationValues = fromRotationTranslationValues;
			exports$157.fromTranslation = fromTranslation;
			exports$157.fromValues = fromValues;
			exports$157.getDual = getDual;
			exports$157.getReal = void 0;
			exports$157.getTranslation = getTranslation;
			exports$157.identity = identity;
			exports$157.invert = invert;
			exports$157.length = exports$157.len = void 0;
			exports$157.lerp = lerp;
			exports$157.mul = void 0;
			exports$157.multiply = multiply;
			exports$157.normalize = normalize;
			exports$157.rotateAroundAxis = rotateAroundAxis;
			exports$157.rotateByQuatAppend = rotateByQuatAppend;
			exports$157.rotateByQuatPrepend = rotateByQuatPrepend;
			exports$157.rotateX = rotateX;
			exports$157.rotateY = rotateY;
			exports$157.rotateZ = rotateZ;
			exports$157.scale = scale;
			exports$157.set = set;
			exports$157.setDual = setDual;
			exports$157.squaredLength = exports$157.sqrLen = exports$157.setReal = void 0;
			exports$157.str = str;
			exports$157.translate = translate;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			var quat = _interopRequireWildcard(__webpack_require__(76));
			var mat4 = _interopRequireWildcard(__webpack_require__(75));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* Dual Quaternion<br>
			* Format: [real, dual]<br>
			* Quaternion format: XYZW<br>
			* Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
			* @module quat2
			*/
			/**
			* Creates a new identity dual quat
			*
			* @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]
			*/
			function create() {
				var dq = new glMatrix.ARRAY_TYPE(8);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					dq[0] = 0;
					dq[1] = 0;
					dq[2] = 0;
					dq[4] = 0;
					dq[5] = 0;
					dq[6] = 0;
					dq[7] = 0;
				}
				dq[3] = 1;
				return dq;
			}
			/**
			* Creates a new quat initialized with values from an existing quaternion
			*
			* @param {ReadonlyQuat2} a dual quaternion to clone
			* @returns {quat2} new dual quaternion
			* @function
			*/
			function clone(a) {
				var dq = new glMatrix.ARRAY_TYPE(8);
				dq[0] = a[0];
				dq[1] = a[1];
				dq[2] = a[2];
				dq[3] = a[3];
				dq[4] = a[4];
				dq[5] = a[5];
				dq[6] = a[6];
				dq[7] = a[7];
				return dq;
			}
			/**
			* Creates a new dual quat initialized with the given values
			*
			* @param {Number} x1 X component
			* @param {Number} y1 Y component
			* @param {Number} z1 Z component
			* @param {Number} w1 W component
			* @param {Number} x2 X component
			* @param {Number} y2 Y component
			* @param {Number} z2 Z component
			* @param {Number} w2 W component
			* @returns {quat2} new dual quaternion
			* @function
			*/
			function fromValues(x1, y1, z1, w1, x2, y2, z2, w2) {
				var dq = new glMatrix.ARRAY_TYPE(8);
				dq[0] = x1;
				dq[1] = y1;
				dq[2] = z1;
				dq[3] = w1;
				dq[4] = x2;
				dq[5] = y2;
				dq[6] = z2;
				dq[7] = w2;
				return dq;
			}
			/**
			* Creates a new dual quat from the given values (quat and translation)
			*
			* @param {Number} x1 X component
			* @param {Number} y1 Y component
			* @param {Number} z1 Z component
			* @param {Number} w1 W component
			* @param {Number} x2 X component (translation)
			* @param {Number} y2 Y component (translation)
			* @param {Number} z2 Z component (translation)
			* @returns {quat2} new dual quaternion
			* @function
			*/
			function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
				var dq = new glMatrix.ARRAY_TYPE(8);
				dq[0] = x1;
				dq[1] = y1;
				dq[2] = z1;
				dq[3] = w1;
				var ax = x2 * .5, ay = y2 * .5, az = z2 * .5;
				dq[4] = ax * w1 + ay * z1 - az * y1;
				dq[5] = ay * w1 + az * x1 - ax * z1;
				dq[6] = az * w1 + ax * y1 - ay * x1;
				dq[7] = -ax * x1 - ay * y1 - az * z1;
				return dq;
			}
			/**
			* Creates a dual quat from a quaternion and a translation
			*
			* @param {ReadonlyQuat2} dual quaternion receiving operation result
			* @param {ReadonlyQuat} q a normalized quaternion
			* @param {ReadonlyVec3} t translation vector
			* @returns {quat2} dual quaternion receiving operation result
			* @function
			*/
			function fromRotationTranslation(out, q, t) {
				var ax = t[0] * .5, ay = t[1] * .5, az = t[2] * .5, bx = q[0], by = q[1], bz = q[2], bw = q[3];
				out[0] = bx;
				out[1] = by;
				out[2] = bz;
				out[3] = bw;
				out[4] = ax * bw + ay * bz - az * by;
				out[5] = ay * bw + az * bx - ax * bz;
				out[6] = az * bw + ax * by - ay * bx;
				out[7] = -ax * bx - ay * by - az * bz;
				return out;
			}
			/**
			* Creates a dual quat from a translation
			*
			* @param {ReadonlyQuat2} dual quaternion receiving operation result
			* @param {ReadonlyVec3} t translation vector
			* @returns {quat2} dual quaternion receiving operation result
			* @function
			*/
			function fromTranslation(out, t) {
				out[0] = 0;
				out[1] = 0;
				out[2] = 0;
				out[3] = 1;
				out[4] = t[0] * .5;
				out[5] = t[1] * .5;
				out[6] = t[2] * .5;
				out[7] = 0;
				return out;
			}
			/**
			* Creates a dual quat from a quaternion
			*
			* @param {ReadonlyQuat2} dual quaternion receiving operation result
			* @param {ReadonlyQuat} q the quaternion
			* @returns {quat2} dual quaternion receiving operation result
			* @function
			*/
			function fromRotation(out, q) {
				out[0] = q[0];
				out[1] = q[1];
				out[2] = q[2];
				out[3] = q[3];
				out[4] = 0;
				out[5] = 0;
				out[6] = 0;
				out[7] = 0;
				return out;
			}
			/**
			* Creates a new dual quat from a matrix (4x4)
			*
			* @param {quat2} out the dual quaternion
			* @param {ReadonlyMat4} a the matrix
			* @returns {quat2} dual quat receiving operation result
			* @function
			*/
			function fromMat4(out, a) {
				var outer = quat.create();
				mat4.getRotation(outer, a);
				var t = new glMatrix.ARRAY_TYPE(3);
				mat4.getTranslation(t, a);
				fromRotationTranslation(out, outer, t);
				return out;
			}
			/**
			* Copy the values from one dual quat to another
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the source dual quaternion
			* @returns {quat2} out
			* @function
			*/
			function copy(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				out[2] = a[2];
				out[3] = a[3];
				out[4] = a[4];
				out[5] = a[5];
				out[6] = a[6];
				out[7] = a[7];
				return out;
			}
			/**
			* Set a dual quat to the identity dual quaternion
			*
			* @param {quat2} out the receiving quaternion
			* @returns {quat2} out
			*/
			function identity(out) {
				out[0] = 0;
				out[1] = 0;
				out[2] = 0;
				out[3] = 1;
				out[4] = 0;
				out[5] = 0;
				out[6] = 0;
				out[7] = 0;
				return out;
			}
			/**
			* Set the components of a dual quat to the given values
			*
			* @param {quat2} out the receiving quaternion
			* @param {Number} x1 X component
			* @param {Number} y1 Y component
			* @param {Number} z1 Z component
			* @param {Number} w1 W component
			* @param {Number} x2 X component
			* @param {Number} y2 Y component
			* @param {Number} z2 Z component
			* @param {Number} w2 W component
			* @returns {quat2} out
			* @function
			*/
			function set(out, x1, y1, z1, w1, x2, y2, z2, w2) {
				out[0] = x1;
				out[1] = y1;
				out[2] = z1;
				out[3] = w1;
				out[4] = x2;
				out[5] = y2;
				out[6] = z2;
				out[7] = w2;
				return out;
			}
			exports$157.getReal = quat.copy;
			/**
			* Gets the dual part of a dual quat
			* @param  {quat} out dual part
			* @param  {ReadonlyQuat2} a Dual Quaternion
			* @return {quat} dual part
			*/
			function getDual(out, a) {
				out[0] = a[4];
				out[1] = a[5];
				out[2] = a[6];
				out[3] = a[7];
				return out;
			}
			exports$157.setReal = quat.copy;
			/**
			* Set the dual component of a dual quat to the given quaternion
			*
			* @param {quat2} out the receiving quaternion
			* @param {ReadonlyQuat} q a quaternion representing the dual part
			* @returns {quat2} out
			* @function
			*/
			function setDual(out, q) {
				out[4] = q[0];
				out[5] = q[1];
				out[6] = q[2];
				out[7] = q[3];
				return out;
			}
			/**
			* Gets the translation of a normalized dual quat
			* @param  {vec3} out translation
			* @param  {ReadonlyQuat2} a Dual Quaternion to be decomposed
			* @return {vec3} translation
			*/
			function getTranslation(out, a) {
				var ax = a[4], ay = a[5], az = a[6], aw = a[7], bx = -a[0], by = -a[1], bz = -a[2], bw = a[3];
				out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
				out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
				out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
				return out;
			}
			/**
			* Translates a dual quat by the given vector
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the dual quaternion to translate
			* @param {ReadonlyVec3} v vector to translate by
			* @returns {quat2} out
			*/
			function translate(out, a, v) {
				var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3], bx1 = v[0] * .5, by1 = v[1] * .5, bz1 = v[2] * .5, ax2 = a[4], ay2 = a[5], az2 = a[6], aw2 = a[7];
				out[0] = ax1;
				out[1] = ay1;
				out[2] = az1;
				out[3] = aw1;
				out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
				out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
				out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
				out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
				return out;
			}
			/**
			* Rotates a dual quat around the X axis
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the dual quaternion to rotate
			* @param {number} rad how far should the rotation be
			* @returns {quat2} out
			*/
			function rotateX(out, a, rad) {
				var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
				quat.rotateX(out, a, rad);
				bx = out[0];
				by = out[1];
				bz = out[2];
				bw = out[3];
				out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
				out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
				out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
				out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
				return out;
			}
			/**
			* Rotates a dual quat around the Y axis
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the dual quaternion to rotate
			* @param {number} rad how far should the rotation be
			* @returns {quat2} out
			*/
			function rotateY(out, a, rad) {
				var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
				quat.rotateY(out, a, rad);
				bx = out[0];
				by = out[1];
				bz = out[2];
				bw = out[3];
				out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
				out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
				out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
				out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
				return out;
			}
			/**
			* Rotates a dual quat around the Z axis
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the dual quaternion to rotate
			* @param {number} rad how far should the rotation be
			* @returns {quat2} out
			*/
			function rotateZ(out, a, rad) {
				var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
				quat.rotateZ(out, a, rad);
				bx = out[0];
				by = out[1];
				bz = out[2];
				bw = out[3];
				out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
				out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
				out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
				out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
				return out;
			}
			/**
			* Rotates a dual quat by a given quaternion (a * q)
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the dual quaternion to rotate
			* @param {ReadonlyQuat} q quaternion to rotate by
			* @returns {quat2} out
			*/
			function rotateByQuatAppend(out, a, q) {
				var qx = q[0], qy = q[1], qz = q[2], qw = q[3], ax = a[0], ay = a[1], az = a[2], aw = a[3];
				out[0] = ax * qw + aw * qx + ay * qz - az * qy;
				out[1] = ay * qw + aw * qy + az * qx - ax * qz;
				out[2] = az * qw + aw * qz + ax * qy - ay * qx;
				out[3] = aw * qw - ax * qx - ay * qy - az * qz;
				ax = a[4];
				ay = a[5];
				az = a[6];
				aw = a[7];
				out[4] = ax * qw + aw * qx + ay * qz - az * qy;
				out[5] = ay * qw + aw * qy + az * qx - ax * qz;
				out[6] = az * qw + aw * qz + ax * qy - ay * qx;
				out[7] = aw * qw - ax * qx - ay * qy - az * qz;
				return out;
			}
			/**
			* Rotates a dual quat by a given quaternion (q * a)
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat} q quaternion to rotate by
			* @param {ReadonlyQuat2} a the dual quaternion to rotate
			* @returns {quat2} out
			*/
			function rotateByQuatPrepend(out, q, a) {
				var qx = q[0], qy = q[1], qz = q[2], qw = q[3], bx = a[0], by = a[1], bz = a[2], bw = a[3];
				out[0] = qx * bw + qw * bx + qy * bz - qz * by;
				out[1] = qy * bw + qw * by + qz * bx - qx * bz;
				out[2] = qz * bw + qw * bz + qx * by - qy * bx;
				out[3] = qw * bw - qx * bx - qy * by - qz * bz;
				bx = a[4];
				by = a[5];
				bz = a[6];
				bw = a[7];
				out[4] = qx * bw + qw * bx + qy * bz - qz * by;
				out[5] = qy * bw + qw * by + qz * bx - qx * bz;
				out[6] = qz * bw + qw * bz + qx * by - qy * bx;
				out[7] = qw * bw - qx * bx - qy * by - qz * bz;
				return out;
			}
			/**
			* Rotates a dual quat around a given axis. Does the normalisation automatically
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the dual quaternion to rotate
			* @param {ReadonlyVec3} axis the axis to rotate around
			* @param {Number} rad how far the rotation should be
			* @returns {quat2} out
			*/
			function rotateAroundAxis(out, a, axis, rad) {
				if (Math.abs(rad) < glMatrix.EPSILON) return copy(out, a);
				var axisLength = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
				rad = rad * .5;
				var s = Math.sin(rad);
				var bx = s * axis[0] / axisLength;
				var by = s * axis[1] / axisLength;
				var bz = s * axis[2] / axisLength;
				var bw = Math.cos(rad);
				var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3];
				out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
				out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
				out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
				out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
				var ax = a[4], ay = a[5], az = a[6], aw = a[7];
				out[4] = ax * bw + aw * bx + ay * bz - az * by;
				out[5] = ay * bw + aw * by + az * bx - ax * bz;
				out[6] = az * bw + aw * bz + ax * by - ay * bx;
				out[7] = aw * bw - ax * bx - ay * by - az * bz;
				return out;
			}
			/**
			* Adds two dual quat's
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the first operand
			* @param {ReadonlyQuat2} b the second operand
			* @returns {quat2} out
			* @function
			*/
			function add(out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				out[2] = a[2] + b[2];
				out[3] = a[3] + b[3];
				out[4] = a[4] + b[4];
				out[5] = a[5] + b[5];
				out[6] = a[6] + b[6];
				out[7] = a[7] + b[7];
				return out;
			}
			/**
			* Multiplies two dual quat's
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a the first operand
			* @param {ReadonlyQuat2} b the second operand
			* @returns {quat2} out
			*/
			function multiply(out, a, b) {
				var ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3];
				out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
				out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
				out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
				out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
				out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
				out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
				out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
				out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
				return out;
			}
			exports$157.mul = multiply;
			/**
			* Scales a dual quat by a scalar number
			*
			* @param {quat2} out the receiving dual quat
			* @param {ReadonlyQuat2} a the dual quat to scale
			* @param {Number} b amount to scale the dual quat by
			* @returns {quat2} out
			* @function
			*/
			function scale(out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				out[2] = a[2] * b;
				out[3] = a[3] * b;
				out[4] = a[4] * b;
				out[5] = a[5] * b;
				out[6] = a[6] * b;
				out[7] = a[7] * b;
				return out;
			}
			/**
			* Calculates the dot product of two dual quat's (The dot product of the real parts)
			*
			* @param {ReadonlyQuat2} a the first operand
			* @param {ReadonlyQuat2} b the second operand
			* @returns {Number} dot product of a and b
			* @function
			*/
			var dot = exports$157.dot = quat.dot;
			/**
			* Performs a linear interpolation between two dual quats's
			* NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
			*
			* @param {quat2} out the receiving dual quat
			* @param {ReadonlyQuat2} a the first operand
			* @param {ReadonlyQuat2} b the second operand
			* @param {Number} t interpolation amount, in the range [0-1], between the two inputs
			* @returns {quat2} out
			*/
			function lerp(out, a, b, t) {
				var mt = 1 - t;
				if (dot(a, b) < 0) t = -t;
				out[0] = a[0] * mt + b[0] * t;
				out[1] = a[1] * mt + b[1] * t;
				out[2] = a[2] * mt + b[2] * t;
				out[3] = a[3] * mt + b[3] * t;
				out[4] = a[4] * mt + b[4] * t;
				out[5] = a[5] * mt + b[5] * t;
				out[6] = a[6] * mt + b[6] * t;
				out[7] = a[7] * mt + b[7] * t;
				return out;
			}
			/**
			* Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a dual quat to calculate inverse of
			* @returns {quat2} out
			*/
			function invert(out, a) {
				var sqlen = squaredLength(a);
				out[0] = -a[0] / sqlen;
				out[1] = -a[1] / sqlen;
				out[2] = -a[2] / sqlen;
				out[3] = a[3] / sqlen;
				out[4] = -a[4] / sqlen;
				out[5] = -a[5] / sqlen;
				out[6] = -a[6] / sqlen;
				out[7] = a[7] / sqlen;
				return out;
			}
			/**
			* Calculates the conjugate of a dual quat
			* If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
			*
			* @param {quat2} out the receiving quaternion
			* @param {ReadonlyQuat2} a quat to calculate conjugate of
			* @returns {quat2} out
			*/
			function conjugate(out, a) {
				out[0] = -a[0];
				out[1] = -a[1];
				out[2] = -a[2];
				out[3] = a[3];
				out[4] = -a[4];
				out[5] = -a[5];
				out[6] = -a[6];
				out[7] = a[7];
				return out;
			}
			exports$157.len = exports$157.length = quat.length;
			/**
			* Calculates the squared length of a dual quat
			*
			* @param {ReadonlyQuat2} a dual quat to calculate squared length of
			* @returns {Number} squared length of a
			* @function
			*/
			var squaredLength = exports$157.squaredLength = quat.squaredLength;
			exports$157.sqrLen = squaredLength;
			/**
			* Normalize a dual quat
			*
			* @param {quat2} out the receiving dual quaternion
			* @param {ReadonlyQuat2} a dual quaternion to normalize
			* @returns {quat2} out
			* @function
			*/
			function normalize(out, a) {
				var magnitude = squaredLength(a);
				if (magnitude > 0) {
					magnitude = Math.sqrt(magnitude);
					var a0 = a[0] / magnitude;
					var a1 = a[1] / magnitude;
					var a2 = a[2] / magnitude;
					var a3 = a[3] / magnitude;
					var b0 = a[4];
					var b1 = a[5];
					var b2 = a[6];
					var b3 = a[7];
					var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
					out[0] = a0;
					out[1] = a1;
					out[2] = a2;
					out[3] = a3;
					out[4] = (b0 - a0 * a_dot_b) / magnitude;
					out[5] = (b1 - a1 * a_dot_b) / magnitude;
					out[6] = (b2 - a2 * a_dot_b) / magnitude;
					out[7] = (b3 - a3 * a_dot_b) / magnitude;
				}
				return out;
			}
			/**
			* Returns a string representation of a dual quaternion
			*
			* @param {ReadonlyQuat2} a dual quaternion to represent as a string
			* @returns {String} string representation of the dual quat
			*/
			function str(a) {
				return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
			}
			/**
			* Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
			*
			* @param {ReadonlyQuat2} a the first dual quaternion.
			* @param {ReadonlyQuat2} b the second dual quaternion.
			* @returns {Boolean} true if the dual quaternions are equal, false otherwise.
			*/
			function exactEquals(a, b) {
				return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
			}
			/**
			* Returns whether or not the dual quaternions have approximately the same elements in the same position.
			*
			* @param {ReadonlyQuat2} a the first dual quat.
			* @param {ReadonlyQuat2} b the second dual quat.
			* @returns {Boolean} true if the dual quats are equal, false otherwise.
			*/
			function equals(a, b) {
				var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
				var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
				return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
			}
		}),
		(function(module$164, exports$158, __webpack_require__) {
			"use strict";
			function _typeof(o) {
				"@babel/helpers - typeof";
				return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
					return typeof o;
				} : function(o) {
					return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
				}, _typeof(o);
			}
			Object.defineProperty(exports$158, "__esModule", { value: true });
			exports$158.add = add;
			exports$158.angle = angle;
			exports$158.ceil = ceil;
			exports$158.clone = clone;
			exports$158.copy = copy;
			exports$158.create = create;
			exports$158.cross = cross;
			exports$158.dist = void 0;
			exports$158.distance = distance;
			exports$158.div = void 0;
			exports$158.divide = divide;
			exports$158.dot = dot;
			exports$158.equals = equals;
			exports$158.exactEquals = exactEquals;
			exports$158.floor = floor;
			exports$158.forEach = void 0;
			exports$158.fromValues = fromValues;
			exports$158.inverse = inverse;
			exports$158.len = void 0;
			exports$158.length = length;
			exports$158.lerp = lerp;
			exports$158.max = max;
			exports$158.min = min;
			exports$158.mul = void 0;
			exports$158.multiply = multiply;
			exports$158.negate = negate;
			exports$158.normalize = normalize;
			exports$158.random = random;
			exports$158.rotate = rotate;
			exports$158.round = round;
			exports$158.scale = scale;
			exports$158.scaleAndAdd = scaleAndAdd;
			exports$158.set = set;
			exports$158.signedAngle = signedAngle;
			exports$158.sqrLen = exports$158.sqrDist = void 0;
			exports$158.squaredDistance = squaredDistance;
			exports$158.squaredLength = squaredLength;
			exports$158.str = str;
			exports$158.sub = void 0;
			exports$158.subtract = subtract;
			exports$158.transformMat2 = transformMat2;
			exports$158.transformMat2d = transformMat2d;
			exports$158.transformMat3 = transformMat3;
			exports$158.transformMat4 = transformMat4;
			exports$158.zero = zero;
			var glMatrix = _interopRequireWildcard(__webpack_require__(12));
			function _interopRequireWildcard(e, t) {
				if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
				return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
					if (!t && e && e.__esModule) return e;
					var o, i, f = {
						__proto__: null,
						"default": e
					};
					if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
					if (o = t ? n : r) {
						if (o.has(e)) return o.get(e);
						o.set(e, f);
					}
					for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
					return f;
				})(e, t);
			}
			/**
			* 2 Dimensional Vector
			* @module vec2
			*/
			/**
			* Creates a new, empty vec2
			*
			* @returns {vec2} a new 2D vector
			*/
			function create() {
				var out = new glMatrix.ARRAY_TYPE(2);
				if (glMatrix.ARRAY_TYPE != Float32Array) {
					out[0] = 0;
					out[1] = 0;
				}
				return out;
			}
			/**
			* Creates a new vec2 initialized with values from an existing vector
			*
			* @param {ReadonlyVec2} a vector to clone
			* @returns {vec2} a new 2D vector
			*/
			function clone(a) {
				var out = new glMatrix.ARRAY_TYPE(2);
				out[0] = a[0];
				out[1] = a[1];
				return out;
			}
			/**
			* Creates a new vec2 initialized with the given values
			*
			* @param {Number} x X component
			* @param {Number} y Y component
			* @returns {vec2} a new 2D vector
			*/
			function fromValues(x, y) {
				var out = new glMatrix.ARRAY_TYPE(2);
				out[0] = x;
				out[1] = y;
				return out;
			}
			/**
			* Copy the values from one vec2 to another
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the source vector
			* @returns {vec2} out
			*/
			function copy(out, a) {
				out[0] = a[0];
				out[1] = a[1];
				return out;
			}
			/**
			* Set the components of a vec2 to the given values
			*
			* @param {vec2} out the receiving vector
			* @param {Number} x X component
			* @param {Number} y Y component
			* @returns {vec2} out
			*/
			function set(out, x, y) {
				out[0] = x;
				out[1] = y;
				return out;
			}
			/**
			* Adds two vec2's
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {vec2} out
			*/
			function add(out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				return out;
			}
			/**
			* Subtracts vector b from vector a
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {vec2} out
			*/
			function subtract(out, a, b) {
				out[0] = a[0] - b[0];
				out[1] = a[1] - b[1];
				return out;
			}
			/**
			* Multiplies two vec2's
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {vec2} out
			*/
			function multiply(out, a, b) {
				out[0] = a[0] * b[0];
				out[1] = a[1] * b[1];
				return out;
			}
			/**
			* Divides two vec2's
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {vec2} out
			*/
			function divide(out, a, b) {
				out[0] = a[0] / b[0];
				out[1] = a[1] / b[1];
				return out;
			}
			/**
			* Math.ceil the components of a vec2
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a vector to ceil
			* @returns {vec2} out
			*/
			function ceil(out, a) {
				out[0] = Math.ceil(a[0]);
				out[1] = Math.ceil(a[1]);
				return out;
			}
			/**
			* Math.floor the components of a vec2
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a vector to floor
			* @returns {vec2} out
			*/
			function floor(out, a) {
				out[0] = Math.floor(a[0]);
				out[1] = Math.floor(a[1]);
				return out;
			}
			/**
			* Returns the minimum of two vec2's
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {vec2} out
			*/
			function min(out, a, b) {
				out[0] = Math.min(a[0], b[0]);
				out[1] = Math.min(a[1], b[1]);
				return out;
			}
			/**
			* Returns the maximum of two vec2's
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {vec2} out
			*/
			function max(out, a, b) {
				out[0] = Math.max(a[0], b[0]);
				out[1] = Math.max(a[1], b[1]);
				return out;
			}
			/**
			* symmetric round the components of a vec2
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a vector to round
			* @returns {vec2} out
			*/
			function round(out, a) {
				out[0] = glMatrix.round(a[0]);
				out[1] = glMatrix.round(a[1]);
				return out;
			}
			/**
			* Scales a vec2 by a scalar number
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the vector to scale
			* @param {Number} b amount to scale the vector by
			* @returns {vec2} out
			*/
			function scale(out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				return out;
			}
			/**
			* Adds two vec2's after scaling the second operand by a scalar value
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @param {Number} scale the amount to scale b by before adding
			* @returns {vec2} out
			*/
			function scaleAndAdd(out, a, b, scale) {
				out[0] = a[0] + b[0] * scale;
				out[1] = a[1] + b[1] * scale;
				return out;
			}
			/**
			* Calculates the euclidian distance between two vec2's
			*
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {Number} distance between a and b
			*/
			function distance(a, b) {
				var x = b[0] - a[0], y = b[1] - a[1];
				return Math.sqrt(x * x + y * y);
			}
			/**
			* Calculates the squared euclidian distance between two vec2's
			*
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {Number} squared distance between a and b
			*/
			function squaredDistance(a, b) {
				var x = b[0] - a[0], y = b[1] - a[1];
				return x * x + y * y;
			}
			/**
			* Calculates the length of a vec2
			*
			* @param {ReadonlyVec2} a vector to calculate length of
			* @returns {Number} length of a
			*/
			function length(a) {
				var x = a[0], y = a[1];
				return Math.sqrt(x * x + y * y);
			}
			/**
			* Calculates the squared length of a vec2
			*
			* @param {ReadonlyVec2} a vector to calculate squared length of
			* @returns {Number} squared length of a
			*/
			function squaredLength(a) {
				var x = a[0], y = a[1];
				return x * x + y * y;
			}
			/**
			* Negates the components of a vec2
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a vector to negate
			* @returns {vec2} out
			*/
			function negate(out, a) {
				out[0] = -a[0];
				out[1] = -a[1];
				return out;
			}
			/**
			* Returns the inverse of the components of a vec2
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a vector to invert
			* @returns {vec2} out
			*/
			function inverse(out, a) {
				out[0] = 1 / a[0];
				out[1] = 1 / a[1];
				return out;
			}
			/**
			* Normalize a vec2
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a vector to normalize
			* @returns {vec2} out
			*/
			function normalize(out, a) {
				var x = a[0], y = a[1];
				var len = x * x + y * y;
				if (len > 0) len = 1 / Math.sqrt(len);
				out[0] = a[0] * len;
				out[1] = a[1] * len;
				return out;
			}
			/**
			* Calculates the dot product of two vec2's
			*
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {Number} dot product of a and b
			*/
			function dot(a, b) {
				return a[0] * b[0] + a[1] * b[1];
			}
			/**
			* Computes the cross product of two vec2's
			* Note that the cross product must by definition produce a 3D vector
			*
			* @param {vec3} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @returns {vec3} out
			*/
			function cross(out, a, b) {
				var z = a[0] * b[1] - a[1] * b[0];
				out[0] = out[1] = 0;
				out[2] = z;
				return out;
			}
			/**
			* Performs a linear interpolation between two vec2's
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the first operand
			* @param {ReadonlyVec2} b the second operand
			* @param {Number} t interpolation amount, in the range [0-1], between the two inputs
			* @returns {vec2} out
			*/
			function lerp(out, a, b, t) {
				var ax = a[0], ay = a[1];
				out[0] = ax + t * (b[0] - ax);
				out[1] = ay + t * (b[1] - ay);
				return out;
			}
			/**
			* Generates a random vector with the given scale
			*
			* @param {vec2} out the receiving vector
			* @param {Number} [scale] Length of the resulting vector. If omitted, a unit vector will be returned
			* @returns {vec2} out
			*/
			function random(out, scale) {
				scale = scale === void 0 ? 1 : scale;
				var r = glMatrix.RANDOM() * 2 * Math.PI;
				out[0] = Math.cos(r) * scale;
				out[1] = Math.sin(r) * scale;
				return out;
			}
			/**
			* Transforms the vec2 with a mat2
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the vector to transform
			* @param {ReadonlyMat2} m matrix to transform with
			* @returns {vec2} out
			*/
			function transformMat2(out, a, m) {
				var x = a[0], y = a[1];
				out[0] = m[0] * x + m[2] * y;
				out[1] = m[1] * x + m[3] * y;
				return out;
			}
			/**
			* Transforms the vec2 with a mat2d
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the vector to transform
			* @param {ReadonlyMat2d} m matrix to transform with
			* @returns {vec2} out
			*/
			function transformMat2d(out, a, m) {
				var x = a[0], y = a[1];
				out[0] = m[0] * x + m[2] * y + m[4];
				out[1] = m[1] * x + m[3] * y + m[5];
				return out;
			}
			/**
			* Transforms the vec2 with a mat3
			* 3rd vector component is implicitly '1'
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the vector to transform
			* @param {ReadonlyMat3} m matrix to transform with
			* @returns {vec2} out
			*/
			function transformMat3(out, a, m) {
				var x = a[0], y = a[1];
				out[0] = m[0] * x + m[3] * y + m[6];
				out[1] = m[1] * x + m[4] * y + m[7];
				return out;
			}
			/**
			* Transforms the vec2 with a mat4
			* 3rd vector component is implicitly '0'
			* 4th vector component is implicitly '1'
			*
			* @param {vec2} out the receiving vector
			* @param {ReadonlyVec2} a the vector to transform
			* @param {ReadonlyMat4} m matrix to transform with
			* @returns {vec2} out
			*/
			function transformMat4(out, a, m) {
				var x = a[0];
				var y = a[1];
				out[0] = m[0] * x + m[4] * y + m[12];
				out[1] = m[1] * x + m[5] * y + m[13];
				return out;
			}
			/**
			* Rotate a 2D vector
			* @param {vec2} out The receiving vec2
			* @param {ReadonlyVec2} a The vec2 point to rotate
			* @param {ReadonlyVec2} b The origin of the rotation
			* @param {Number} rad The angle of rotation in radians
			* @returns {vec2} out
			*/
			function rotate(out, a, b, rad) {
				var p0 = a[0] - b[0], p1 = a[1] - b[1], sinC = Math.sin(rad), cosC = Math.cos(rad);
				out[0] = p0 * cosC - p1 * sinC + b[0];
				out[1] = p0 * sinC + p1 * cosC + b[1];
				return out;
			}
			/**
			* Get the smallest angle between two 2D vectors
			* @param {ReadonlyVec2} a The first operand
			* @param {ReadonlyVec2} b The second operand
			* @returns {Number} The angle in radians
			*/
			function angle(a, b) {
				var ax = a[0], ay = a[1], bx = b[0], by = b[1];
				return Math.abs(Math.atan2(ay * bx - ax * by, ax * bx + ay * by));
			}
			/**
			* Get the signed angle in the interval [-pi,pi] between two 2D vectors (positive if `a` is to the right of `b`)
			* 
			* @param {ReadonlyVec2} a The first vector
			* @param {ReadonlyVec2} b The second vector
			* @returns {number} The signed angle in radians
			*/
			function signedAngle(a, b) {
				var ax = a[0], ay = a[1], bx = b[0], by = b[1];
				return Math.atan2(ax * by - ay * bx, ax * bx + ay * by);
			}
			/**
			* Set the components of a vec2 to zero
			*
			* @param {vec2} out the receiving vector
			* @returns {vec2} out
			*/
			function zero(out) {
				out[0] = 0;
				out[1] = 0;
				return out;
			}
			/**
			* Returns a string representation of a vector
			*
			* @param {ReadonlyVec2} a vector to represent as a string
			* @returns {String} string representation of the vector
			*/
			function str(a) {
				return "vec2(" + a[0] + ", " + a[1] + ")";
			}
			/**
			* Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
			*
			* @param {ReadonlyVec2} a The first vector.
			* @param {ReadonlyVec2} b The second vector.
			* @returns {Boolean} True if the vectors are equal, false otherwise.
			*/
			function exactEquals(a, b) {
				return a[0] === b[0] && a[1] === b[1];
			}
			/**
			* Returns whether or not the vectors have approximately the same elements in the same position.
			*
			* @param {ReadonlyVec2} a The first vector.
			* @param {ReadonlyVec2} b The second vector.
			* @returns {Boolean} True if the vectors are equal, false otherwise.
			*/
			function equals(a, b) {
				var a0 = a[0], a1 = a[1];
				var b0 = b[0], b1 = b[1];
				return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
			}
			exports$158.len = length;
			exports$158.sub = subtract;
			exports$158.mul = multiply;
			exports$158.div = divide;
			exports$158.dist = distance;
			exports$158.sqrDist = squaredDistance;
			exports$158.sqrLen = squaredLength;
			exports$158.forEach = function() {
				var vec = create();
				return function(a, stride, offset, count, fn, arg) {
					var i, l;
					if (!stride) stride = 2;
					if (!offset) offset = 0;
					if (count) l = Math.min(count * stride + offset, a.length);
					else l = a.length;
					for (i = offset; i < l; i += stride) {
						vec[0] = a[i];
						vec[1] = a[i + 1];
						fn(vec, vec, arg);
						a[i] = vec[0];
						a[i + 1] = vec[1];
					}
					return a;
				};
			}();
		}),
		(function(module$165, exports$159, __webpack_require__) {
			var OverloadYield = __webpack_require__(79);
			var regenerator = __webpack_require__(80);
			var regeneratorAsync = __webpack_require__(159);
			var regeneratorAsyncGen = __webpack_require__(82);
			var regeneratorAsyncIterator = __webpack_require__(83);
			var regeneratorKeys = __webpack_require__(160);
			var regeneratorValues = __webpack_require__(161);
			function _regeneratorRuntime() {
				"use strict";
				var r = regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor;
				function n(r) {
					var e = "function" == typeof r && r.constructor;
					return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name));
				}
				var o = {
					"throw": 1,
					"return": 2,
					"break": 3,
					"continue": 3
				};
				function a(r) {
					var e, t;
					return function(n) {
						e || (e = {
							stop: function stop() {
								return t(n.a, 2);
							},
							"catch": function _catch() {
								return n.v;
							},
							abrupt: function abrupt(r, e) {
								return t(n.a, o[r], e);
							},
							delegateYield: function delegateYield(r, o, a) {
								return e.resultName = o, t(n.d, regeneratorValues(r), a);
							},
							finish: function finish(r) {
								return t(n.f, r);
							}
						}, t = function t(r, _t, o) {
							n.p = e.prev, n.n = e.next;
							try {
								return r(_t, o);
							} finally {
								e.next = n.n;
							}
						}), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n;
						try {
							return r.call(this, e);
						} finally {
							n.p = e.prev, n.n = e.next;
						}
					};
				}
				return (module$165.exports = _regeneratorRuntime = function _regeneratorRuntime() {
					return {
						wrap: function wrap(e, t, n, o) {
							return r.w(a(e), t, n, o && o.reverse());
						},
						isGeneratorFunction: n,
						mark: r.m,
						awrap: function awrap(r, e) {
							return new OverloadYield(r, e);
						},
						AsyncIterator: regeneratorAsyncIterator,
						async: function async(r, e, t, o, u) {
							return (n(e) ? regeneratorAsyncGen : regeneratorAsync)(a(r), e, t, o, u);
						},
						keys: regeneratorKeys,
						values: regeneratorValues
					};
				}, module$165.exports.__esModule = true, module$165.exports["default"] = module$165.exports)();
			}
			module$165.exports = _regeneratorRuntime, module$165.exports.__esModule = true, module$165.exports["default"] = module$165.exports;
		}),
		(function(module$166, exports$160, __webpack_require__) {
			var regeneratorAsyncGen = __webpack_require__(82);
			function _regeneratorAsync(n, e, r, t, o) {
				var a = regeneratorAsyncGen(n, e, r, t, o);
				return a.next().then(function(n) {
					return n.done ? n.value : a.next();
				});
			}
			module$166.exports = _regeneratorAsync, module$166.exports.__esModule = true, module$166.exports["default"] = module$166.exports;
		}),
		(function(module$167, exports$161) {
			function _regeneratorKeys(e) {
				var n = Object(e), r = [];
				for (var t in n) r.unshift(t);
				return function e() {
					for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e;
					return e.done = !0, e;
				};
			}
			module$167.exports = _regeneratorKeys, module$167.exports.__esModule = true, module$167.exports["default"] = module$167.exports;
		}),
		(function(module$168, exports$162, __webpack_require__) {
			var _typeof = __webpack_require__(13)["default"];
			function _regeneratorValues(e) {
				if (null != e) {
					var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0;
					if (t) return t.call(e);
					if ("function" == typeof e.next) return e;
					if (!isNaN(e.length)) return { next: function next() {
						return e && r >= e.length && (e = void 0), {
							value: e && e[r++],
							done: !e
						};
					} };
				}
				throw new TypeError(_typeof(e) + " is not iterable");
			}
			module$168.exports = _regeneratorValues, module$168.exports.__esModule = true, module$168.exports["default"] = module$168.exports;
		}),
		(function(module$169, exports$163) {
			function _assertThisInitialized(e) {
				if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
				return e;
			}
			module$169.exports = _assertThisInitialized, module$169.exports.__esModule = true, module$169.exports["default"] = module$169.exports;
		}),
		(function(module$170, exports$164, __webpack_require__) {
			var getPrototypeOf = __webpack_require__(1);
			function _superPropBase(t, o) {
				for (; !{}.hasOwnProperty.call(t, o) && null !== (t = getPrototypeOf(t)););
				return t;
			}
			module$170.exports = _superPropBase, module$170.exports.__esModule = true, module$170.exports["default"] = module$170.exports;
		}),
		(function(module$171, exports$165, __webpack_require__) {
			var arrayLikeToArray = __webpack_require__(72);
			function _arrayWithoutHoles(r) {
				if (Array.isArray(r)) return arrayLikeToArray(r);
			}
			module$171.exports = _arrayWithoutHoles, module$171.exports.__esModule = true, module$171.exports["default"] = module$171.exports;
		}),
		(function(module$172, exports$166) {
			function _iterableToArray(r) {
				if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
			}
			module$172.exports = _iterableToArray, module$172.exports.__esModule = true, module$172.exports["default"] = module$172.exports;
		}),
		(function(module$173, exports$167) {
			function _nonIterableSpread() {
				throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
			}
			module$173.exports = _nonIterableSpread, module$173.exports.__esModule = true, module$173.exports["default"] = module$173.exports;
		}),
		(function(module$174, exports$168) {
			function _objectWithoutPropertiesLoose(r, e) {
				if (null == r) return {};
				var t = {};
				for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
					if (-1 !== e.indexOf(n)) continue;
					t[n] = r[n];
				}
				return t;
			}
			module$174.exports = _objectWithoutPropertiesLoose, module$174.exports.__esModule = true, module$174.exports["default"] = module$174.exports;
		}),
		(function(module$175, exports$169, __webpack_require__) {
			var Stack = __webpack_require__(50), arrayEach = __webpack_require__(169), assignValue = __webpack_require__(65), baseAssign = __webpack_require__(170), baseAssignIn = __webpack_require__(173), cloneBuffer = __webpack_require__(56), copyArray = __webpack_require__(58), copySymbols = __webpack_require__(174), copySymbolsIn = __webpack_require__(176), getAllKeys = __webpack_require__(177), getAllKeysIn = __webpack_require__(88), getTag = __webpack_require__(47), initCloneArray = __webpack_require__(182), initCloneByTag = __webpack_require__(183), initCloneObject = __webpack_require__(59), isArray = __webpack_require__(16), isBuffer = __webpack_require__(40), isMap = __webpack_require__(187), isObject = __webpack_require__(14), isSet = __webpack_require__(189), keys = __webpack_require__(44), keysIn = __webpack_require__(24);
			/** Used to compose bitmasks for cloning. */
			var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
			/** `Object#toString` result references. */
			var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
			var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
			/** Used to identify `toStringTag` values supported by `_.clone`. */
			var cloneableTags = {};
			cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
			cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
			/**
			* The base implementation of `_.clone` and `_.cloneDeep` which tracks
			* traversed objects.
			*
			* @private
			* @param {*} value The value to clone.
			* @param {boolean} bitmask The bitmask flags.
			*  1 - Deep clone
			*  2 - Flatten inherited properties
			*  4 - Clone symbols
			* @param {Function} [customizer] The function to customize cloning.
			* @param {string} [key] The key of `value`.
			* @param {Object} [object] The parent object of `value`.
			* @param {Object} [stack] Tracks traversed objects and their clone counterparts.
			* @returns {*} Returns the cloned value.
			*/
			function baseClone(value, bitmask, customizer, key, object, stack) {
				var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
				if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
				if (result !== void 0) return result;
				if (!isObject(value)) return value;
				var isArr = isArray(value);
				if (isArr) {
					result = initCloneArray(value);
					if (!isDeep) return copyArray(value, result);
				} else {
					var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
					if (isBuffer(value)) return cloneBuffer(value, isDeep);
					if (tag == objectTag || tag == argsTag || isFunc && !object) {
						result = isFlat || isFunc ? {} : initCloneObject(value);
						if (!isDeep) return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
					} else {
						if (!cloneableTags[tag]) return object ? value : {};
						result = initCloneByTag(value, tag, isDeep);
					}
				}
				stack || (stack = new Stack());
				var stacked = stack.get(value);
				if (stacked) return stacked;
				stack.set(value, result);
				if (isSet(value)) value.forEach(function(subValue) {
					result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
				});
				else if (isMap(value)) value.forEach(function(subValue, key) {
					result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
				});
				var props = isArr ? void 0 : (isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys)(value);
				arrayEach(props || value, function(subValue, key) {
					if (props) {
						key = subValue;
						subValue = value[key];
					}
					assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
				});
				return result;
			}
			module$175.exports = baseClone;
		}),
		(function(module$176, exports$170) {
			/**
			* A specialized version of `_.forEach` for arrays without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} iteratee The function invoked per iteration.
			* @returns {Array} Returns `array`.
			*/
			function arrayEach(array, iteratee) {
				var index = -1, length = array == null ? 0 : array.length;
				while (++index < length) if (iteratee(array[index], index, array) === false) break;
				return array;
			}
			module$176.exports = arrayEach;
		}),
		(function(module$177, exports$171, __webpack_require__) {
			var copyObject = __webpack_require__(22), keys = __webpack_require__(44);
			/**
			* The base implementation of `_.assign` without support for multiple sources
			* or `customizer` functions.
			*
			* @private
			* @param {Object} object The destination object.
			* @param {Object} source The source object.
			* @returns {Object} Returns `object`.
			*/
			function baseAssign(object, source) {
				return object && copyObject(source, keys(source), object);
			}
			module$177.exports = baseAssign;
		}),
		(function(module$178, exports$172, __webpack_require__) {
			var isPrototype = __webpack_require__(38), nativeKeys = __webpack_require__(172);
			/** Used to check objects for own properties. */
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			/**
			* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names.
			*/
			function baseKeys(object) {
				if (!isPrototype(object)) return nativeKeys(object);
				var result = [];
				for (var key in Object(object)) if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
				return result;
			}
			module$178.exports = baseKeys;
		}),
		(function(module$179, exports$173, __webpack_require__) {
			module$179.exports = __webpack_require__(60)(Object.keys, Object);
		}),
		(function(module$180, exports$174, __webpack_require__) {
			var copyObject = __webpack_require__(22), keysIn = __webpack_require__(24);
			/**
			* The base implementation of `_.assignIn` without support for multiple sources
			* or `customizer` functions.
			*
			* @private
			* @param {Object} object The destination object.
			* @param {Object} source The source object.
			* @returns {Object} Returns `object`.
			*/
			function baseAssignIn(object, source) {
				return object && copyObject(source, keysIn(source), object);
			}
			module$180.exports = baseAssignIn;
		}),
		(function(module$181, exports$175, __webpack_require__) {
			var copyObject = __webpack_require__(22), getSymbols = __webpack_require__(45);
			/**
			* Copies own symbols of `source` to `object`.
			*
			* @private
			* @param {Object} source The object to copy symbols from.
			* @param {Object} [object={}] The object to copy symbols to.
			* @returns {Object} Returns `object`.
			*/
			function copySymbols(source, object) {
				return copyObject(source, getSymbols(source), object);
			}
			module$181.exports = copySymbols;
		}),
		(function(module$182, exports$176) {
			/**
			* A specialized version of `_.filter` for arrays without support for
			* iteratee shorthands.
			*
			* @private
			* @param {Array} [array] The array to iterate over.
			* @param {Function} predicate The function invoked per iteration.
			* @returns {Array} Returns the new filtered array.
			*/
			function arrayFilter(array, predicate) {
				var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
				while (++index < length) {
					var value = array[index];
					if (predicate(value, index, array)) result[resIndex++] = value;
				}
				return result;
			}
			module$182.exports = arrayFilter;
		}),
		(function(module$183, exports$177, __webpack_require__) {
			var copyObject = __webpack_require__(22), getSymbolsIn = __webpack_require__(86);
			/**
			* Copies own and inherited symbols of `source` to `object`.
			*
			* @private
			* @param {Object} source The object to copy symbols from.
			* @param {Object} [object={}] The object to copy symbols to.
			* @returns {Object} Returns `object`.
			*/
			function copySymbolsIn(source, object) {
				return copyObject(source, getSymbolsIn(source), object);
			}
			module$183.exports = copySymbolsIn;
		}),
		(function(module$184, exports$178, __webpack_require__) {
			var baseGetAllKeys = __webpack_require__(87), getSymbols = __webpack_require__(45), keys = __webpack_require__(44);
			/**
			* Creates an array of own enumerable property names and symbols of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @returns {Array} Returns the array of property names and symbols.
			*/
			function getAllKeys(object) {
				return baseGetAllKeys(object, keys, getSymbols);
			}
			module$184.exports = getAllKeys;
		}),
		(function(module$185, exports$179, __webpack_require__) {
			module$185.exports = __webpack_require__(18)(__webpack_require__(11), "DataView");
		}),
		(function(module$186, exports$180, __webpack_require__) {
			module$186.exports = __webpack_require__(18)(__webpack_require__(11), "Promise");
		}),
		(function(module$187, exports$181, __webpack_require__) {
			module$187.exports = __webpack_require__(18)(__webpack_require__(11), "Set");
		}),
		(function(module$188, exports$182, __webpack_require__) {
			module$188.exports = __webpack_require__(18)(__webpack_require__(11), "WeakMap");
		}),
		(function(module$189, exports$183) {
			/** Used to check objects for own properties. */
			var hasOwnProperty = Object.prototype.hasOwnProperty;
			/**
			* Initializes an array clone.
			*
			* @private
			* @param {Array} array The array to clone.
			* @returns {Array} Returns the initialized clone.
			*/
			function initCloneArray(array) {
				var length = array.length, result = new array.constructor(length);
				if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
					result.index = array.index;
					result.input = array.input;
				}
				return result;
			}
			module$189.exports = initCloneArray;
		}),
		(function(module$190, exports$184, __webpack_require__) {
			var cloneArrayBuffer = __webpack_require__(36), cloneDataView = __webpack_require__(184), cloneRegExp = __webpack_require__(185), cloneSymbol = __webpack_require__(186), cloneTypedArray = __webpack_require__(57);
			/** `Object#toString` result references. */
			var boolTag = "[object Boolean]", dateTag = "[object Date]", mapTag = "[object Map]", numberTag = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]";
			var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
			/**
			* Initializes an object clone based on its `toStringTag`.
			*
			* **Note:** This function only supports cloning values with tags of
			* `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
			*
			* @private
			* @param {Object} object The object to clone.
			* @param {string} tag The `toStringTag` of the object to clone.
			* @param {boolean} [isDeep] Specify a deep clone.
			* @returns {Object} Returns the initialized clone.
			*/
			function initCloneByTag(object, tag, isDeep) {
				var Ctor = object.constructor;
				switch (tag) {
					case arrayBufferTag: return cloneArrayBuffer(object);
					case boolTag:
					case dateTag: return new Ctor(+object);
					case dataViewTag: return cloneDataView(object, isDeep);
					case float32Tag:
					case float64Tag:
					case int8Tag:
					case int16Tag:
					case int32Tag:
					case uint8Tag:
					case uint8ClampedTag:
					case uint16Tag:
					case uint32Tag: return cloneTypedArray(object, isDeep);
					case mapTag: return new Ctor();
					case numberTag:
					case stringTag: return new Ctor(object);
					case regexpTag: return cloneRegExp(object);
					case setTag: return new Ctor();
					case symbolTag: return cloneSymbol(object);
				}
			}
			module$190.exports = initCloneByTag;
		}),
		(function(module$191, exports$185, __webpack_require__) {
			var cloneArrayBuffer = __webpack_require__(36);
			/**
			* Creates a clone of `dataView`.
			*
			* @private
			* @param {Object} dataView The data view to clone.
			* @param {boolean} [isDeep] Specify a deep clone.
			* @returns {Object} Returns the cloned data view.
			*/
			function cloneDataView(dataView, isDeep) {
				var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
				return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
			}
			module$191.exports = cloneDataView;
		}),
		(function(module$192, exports$186) {
			/** Used to match `RegExp` flags from their coerced string values. */
			var reFlags = /\w*$/;
			/**
			* Creates a clone of `regexp`.
			*
			* @private
			* @param {Object} regexp The regexp to clone.
			* @returns {Object} Returns the cloned regexp.
			*/
			function cloneRegExp(regexp) {
				var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
				result.lastIndex = regexp.lastIndex;
				return result;
			}
			module$192.exports = cloneRegExp;
		}),
		(function(module$193, exports$187, __webpack_require__) {
			var Symbol = __webpack_require__(23);
			/** Used to convert symbols to primitives and strings. */
			var symbolProto = Symbol ? Symbol.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
			/**
			* Creates a clone of the `symbol` object.
			*
			* @private
			* @param {Object} symbol The symbol object to clone.
			* @returns {Object} Returns the cloned symbol object.
			*/
			function cloneSymbol(symbol) {
				return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
			}
			module$193.exports = cloneSymbol;
		}),
		(function(module$194, exports$188, __webpack_require__) {
			var baseIsMap = __webpack_require__(188), baseUnary = __webpack_require__(41), nodeUtil = __webpack_require__(42);
			var nodeIsMap = nodeUtil && nodeUtil.isMap;
			module$194.exports = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
		}),
		(function(module$195, exports$189, __webpack_require__) {
			var getTag = __webpack_require__(47), isObjectLike = __webpack_require__(15);
			/** `Object#toString` result references. */
			var mapTag = "[object Map]";
			/**
			* The base implementation of `_.isMap` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a map, else `false`.
			*/
			function baseIsMap(value) {
				return isObjectLike(value) && getTag(value) == mapTag;
			}
			module$195.exports = baseIsMap;
		}),
		(function(module$196, exports$190, __webpack_require__) {
			var baseIsSet = __webpack_require__(190), baseUnary = __webpack_require__(41), nodeUtil = __webpack_require__(42);
			var nodeIsSet = nodeUtil && nodeUtil.isSet;
			module$196.exports = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
		}),
		(function(module$197, exports$191, __webpack_require__) {
			var getTag = __webpack_require__(47), isObjectLike = __webpack_require__(15);
			/** `Object#toString` result references. */
			var setTag = "[object Set]";
			/**
			* The base implementation of `_.isSet` without Node.js optimizations.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is a set, else `false`.
			*/
			function baseIsSet(value) {
				return isObjectLike(value) && getTag(value) == setTag;
			}
			module$197.exports = baseIsSet;
		}),
		(function(module$198, exports$192, __webpack_require__) {
			var castPath = __webpack_require__(48), last = __webpack_require__(198), parent = __webpack_require__(199), toKey = __webpack_require__(89);
			/**
			* The base implementation of `_.unset`.
			*
			* @private
			* @param {Object} object The object to modify.
			* @param {Array|string} path The property path to unset.
			* @returns {boolean} Returns `true` if the property is deleted, else `false`.
			*/
			function baseUnset(object, path) {
				path = castPath(path, object);
				object = parent(object, path);
				return object == null || delete object[toKey(last(path))];
			}
			module$198.exports = baseUnset;
		}),
		(function(module$199, exports$193, __webpack_require__) {
			var isArray = __webpack_require__(16), isSymbol = __webpack_require__(49);
			/** Used to match property names within property paths. */
			var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
			/**
			* Checks if `value` is a property name and not a property path.
			*
			* @private
			* @param {*} value The value to check.
			* @param {Object} [object] The object to query keys on.
			* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
			*/
			function isKey(value, object) {
				if (isArray(value)) return false;
				var type = typeof value;
				if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) return true;
				return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
			}
			module$199.exports = isKey;
		}),
		(function(module$200, exports$194, __webpack_require__) {
			var memoizeCapped = __webpack_require__(194);
			/** Used to match property names within property paths. */
			var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
			/** Used to match backslashes in property paths. */
			var reEscapeChar = /\\(\\)?/g;
			module$200.exports = memoizeCapped(function(string) {
				var result = [];
				if (string.charCodeAt(0) === 46) result.push("");
				string.replace(rePropName, function(match, number, quote, subString) {
					result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
				});
				return result;
			});
		}),
		(function(module$201, exports$195, __webpack_require__) {
			var memoize = __webpack_require__(195);
			/** Used as the maximum memoize cache size. */
			var MAX_MEMOIZE_SIZE = 500;
			/**
			* A specialized version of `_.memoize` which clears the memoized function's
			* cache when it exceeds `MAX_MEMOIZE_SIZE`.
			*
			* @private
			* @param {Function} func The function to have its output memoized.
			* @returns {Function} Returns the new memoized function.
			*/
			function memoizeCapped(func) {
				var result = memoize(func, function(key) {
					if (cache.size === MAX_MEMOIZE_SIZE) cache.clear();
					return key;
				});
				var cache = result.cache;
				return result;
			}
			module$201.exports = memoizeCapped;
		}),
		(function(module$202, exports$196, __webpack_require__) {
			var MapCache = __webpack_require__(53);
			/** Error message constants. */
			var FUNC_ERROR_TEXT = "Expected a function";
			/**
			* Creates a function that memoizes the result of `func`. If `resolver` is
			* provided, it determines the cache key for storing the result based on the
			* arguments provided to the memoized function. By default, the first argument
			* provided to the memoized function is used as the map cache key. The `func`
			* is invoked with the `this` binding of the memoized function.
			*
			* **Note:** The cache is exposed as the `cache` property on the memoized
			* function. Its creation may be customized by replacing the `_.memoize.Cache`
			* constructor with one whose instances implement the
			* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
			* method interface of `clear`, `delete`, `get`, `has`, and `set`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Function
			* @param {Function} func The function to have its output memoized.
			* @param {Function} [resolver] The function to resolve the cache key.
			* @returns {Function} Returns the new memoized function.
			* @example
			*
			* var object = { 'a': 1, 'b': 2 };
			* var other = { 'c': 3, 'd': 4 };
			*
			* var values = _.memoize(_.values);
			* values(object);
			* // => [1, 2]
			*
			* values(other);
			* // => [3, 4]
			*
			* object.a = 2;
			* values(object);
			* // => [1, 2]
			*
			* // Modify the result cache.
			* values.cache.set(object, ['a', 'b']);
			* values(object);
			* // => ['a', 'b']
			*
			* // Replace `_.memoize.Cache`.
			* _.memoize.Cache = WeakMap;
			*/
			function memoize(func, resolver) {
				if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT);
				var memoized = function() {
					var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
					if (cache.has(key)) return cache.get(key);
					var result = func.apply(this, args);
					memoized.cache = cache.set(key, result) || cache;
					return result;
				};
				memoized.cache = new (memoize.Cache || MapCache)();
				return memoized;
			}
			memoize.Cache = MapCache;
			module$202.exports = memoize;
		}),
		(function(module$203, exports$197, __webpack_require__) {
			var baseToString = __webpack_require__(197);
			/**
			* Converts `value` to a string. An empty string is returned for `null`
			* and `undefined` values. The sign of `-0` is preserved.
			*
			* @static
			* @memberOf _
			* @since 4.0.0
			* @category Lang
			* @param {*} value The value to convert.
			* @returns {string} Returns the converted string.
			* @example
			*
			* _.toString(null);
			* // => ''
			*
			* _.toString(-0);
			* // => '-0'
			*
			* _.toString([1, 2, 3]);
			* // => '1,2,3'
			*/
			function toString(value) {
				return value == null ? "" : baseToString(value);
			}
			module$203.exports = toString;
		}),
		(function(module$204, exports$198, __webpack_require__) {
			var Symbol = __webpack_require__(23), arrayMap = __webpack_require__(84), isArray = __webpack_require__(16), isSymbol = __webpack_require__(49);
			/** Used as references for various `Number` constants. */
			var INFINITY = Infinity;
			/** Used to convert symbols to primitives and strings. */
			var symbolProto = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
			/**
			* The base implementation of `_.toString` which doesn't convert nullish
			* values to empty strings.
			*
			* @private
			* @param {*} value The value to process.
			* @returns {string} Returns the string.
			*/
			function baseToString(value) {
				if (typeof value == "string") return value;
				if (isArray(value)) return arrayMap(value, baseToString) + "";
				if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
				var result = value + "";
				return result == "0" && 1 / value == -INFINITY ? "-0" : result;
			}
			module$204.exports = baseToString;
		}),
		(function(module$205, exports$199) {
			/**
			* Gets the last element of `array`.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to query.
			* @returns {*} Returns the last element of `array`.
			* @example
			*
			* _.last([1, 2, 3]);
			* // => 3
			*/
			function last(array) {
				var length = array == null ? 0 : array.length;
				return length ? array[length - 1] : void 0;
			}
			module$205.exports = last;
		}),
		(function(module$206, exports$200, __webpack_require__) {
			var baseGet = __webpack_require__(200), baseSlice = __webpack_require__(201);
			/**
			* Gets the parent value at `path` of `object`.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Array} path The path to get the parent value of.
			* @returns {*} Returns the parent value.
			*/
			function parent(object, path) {
				return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
			}
			module$206.exports = parent;
		}),
		(function(module$207, exports$201, __webpack_require__) {
			var castPath = __webpack_require__(48), toKey = __webpack_require__(89);
			/**
			* The base implementation of `_.get` without support for default values.
			*
			* @private
			* @param {Object} object The object to query.
			* @param {Array|string} path The path of the property to get.
			* @returns {*} Returns the resolved value.
			*/
			function baseGet(object, path) {
				path = castPath(path, object);
				var index = 0, length = path.length;
				while (object != null && index < length) object = object[toKey(path[index++])];
				return index && index == length ? object : void 0;
			}
			module$207.exports = baseGet;
		}),
		(function(module$208, exports$202) {
			/**
			* The base implementation of `_.slice` without an iteratee call guard.
			*
			* @private
			* @param {Array} array The array to slice.
			* @param {number} [start=0] The start position.
			* @param {number} [end=array.length] The end position.
			* @returns {Array} Returns the slice of `array`.
			*/
			function baseSlice(array, start, end) {
				var index = -1, length = array.length;
				if (start < 0) start = -start > length ? 0 : length + start;
				end = end > length ? length : end;
				if (end < 0) end += length;
				length = start > end ? 0 : end - start >>> 0;
				start >>>= 0;
				var result = Array(length);
				while (++index < length) result[index] = array[index + start];
				return result;
			}
			module$208.exports = baseSlice;
		}),
		(function(module$209, exports$203, __webpack_require__) {
			var isPlainObject = __webpack_require__(62);
			/**
			* Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
			* objects.
			*
			* @private
			* @param {*} value The value to inspect.
			* @param {string} key The key of the property to inspect.
			* @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
			*/
			function customOmitClone(value) {
				return isPlainObject(value) ? void 0 : value;
			}
			module$209.exports = customOmitClone;
		}),
		(function(module$210, exports$204, __webpack_require__) {
			var flatten = __webpack_require__(204), overRest = __webpack_require__(69), setToString = __webpack_require__(70);
			/**
			* A specialized version of `baseRest` which flattens the rest array.
			*
			* @private
			* @param {Function} func The function to apply a rest parameter to.
			* @returns {Function} Returns the new function.
			*/
			function flatRest(func) {
				return setToString(overRest(func, void 0, flatten), func + "");
			}
			module$210.exports = flatRest;
		}),
		(function(module$211, exports$205, __webpack_require__) {
			var baseFlatten = __webpack_require__(205);
			/**
			* Flattens `array` a single level deep.
			*
			* @static
			* @memberOf _
			* @since 0.1.0
			* @category Array
			* @param {Array} array The array to flatten.
			* @returns {Array} Returns the new flattened array.
			* @example
			*
			* _.flatten([1, [2, [3, [4]], 5]]);
			* // => [1, 2, [3, [4]], 5]
			*/
			function flatten(array) {
				return (array == null ? 0 : array.length) ? baseFlatten(array, 1) : [];
			}
			module$211.exports = flatten;
		}),
		(function(module$212, exports$206, __webpack_require__) {
			var arrayPush = __webpack_require__(46), isFlattenable = __webpack_require__(206);
			/**
			* The base implementation of `_.flatten` with support for restricting flattening.
			*
			* @private
			* @param {Array} array The array to flatten.
			* @param {number} depth The maximum recursion depth.
			* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
			* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
			* @param {Array} [result=[]] The initial result value.
			* @returns {Array} Returns the new flattened array.
			*/
			function baseFlatten(array, depth, predicate, isStrict, result) {
				var index = -1, length = array.length;
				predicate || (predicate = isFlattenable);
				result || (result = []);
				while (++index < length) {
					var value = array[index];
					if (depth > 0 && predicate(value)) if (depth > 1) baseFlatten(value, depth - 1, predicate, isStrict, result);
					else arrayPush(result, value);
					else if (!isStrict) result[result.length] = value;
				}
				return result;
			}
			module$212.exports = baseFlatten;
		}),
		(function(module$213, exports$207, __webpack_require__) {
			var Symbol = __webpack_require__(23), isArguments = __webpack_require__(39), isArray = __webpack_require__(16);
			/** Built-in value references. */
			var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : void 0;
			/**
			* Checks if `value` is a flattenable `arguments` object or array.
			*
			* @private
			* @param {*} value The value to check.
			* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
			*/
			function isFlattenable(value) {
				return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
			}
			module$213.exports = isFlattenable;
		}),
		(function(module$214, exports$208) {
			function _isNativeFunction(t) {
				try {
					return -1 !== Function.toString.call(t).indexOf("[native code]");
				} catch (n) {
					return "function" == typeof t;
				}
			}
			module$214.exports = _isNativeFunction, module$214.exports.__esModule = true, module$214.exports["default"] = module$214.exports;
		}),
		(function(module$215, exports$209, __webpack_require__) {
			var isNativeReflectConstruct = __webpack_require__(209);
			var setPrototypeOf = __webpack_require__(43);
			function _construct(t, e, r) {
				if (isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
				var o = [null];
				o.push.apply(o, e);
				var p = new (t.bind.apply(t, o))();
				return r && setPrototypeOf(p, r.prototype), p;
			}
			module$215.exports = _construct, module$215.exports.__esModule = true, module$215.exports["default"] = module$215.exports;
		}),
		(function(module$216, exports$210) {
			function _isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (module$216.exports = _isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				}, module$216.exports.__esModule = true, module$216.exports["default"] = module$216.exports)();
			}
			module$216.exports = _isNativeReflectConstruct, module$216.exports.__esModule = true, module$216.exports["default"] = module$216.exports;
		}),
		(function(module$217, exports$211, __webpack_require__) {
			var iota = __webpack_require__(211);
			var isBuffer = __webpack_require__(212);
			var hasTypedArrays = typeof Float64Array !== "undefined";
			function compare1st(a, b) {
				return a[0] - b[0];
			}
			function order() {
				var stride = this.stride;
				var terms = new Array(stride.length);
				var i;
				for (i = 0; i < terms.length; ++i) terms[i] = [Math.abs(stride[i]), i];
				terms.sort(compare1st);
				var result = new Array(terms.length);
				for (i = 0; i < result.length; ++i) result[i] = terms[i][1];
				return result;
			}
			function compileConstructor(dtype, dimension) {
				var className = [
					"View",
					dimension,
					"d",
					dtype
				].join("");
				if (dimension < 0) className = "View_Nil" + dtype;
				var useGetters = dtype === "generic";
				if (dimension === -1) {
					var code = "function " + className + "(a){this.data=a;};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return -1};proto.size=0;proto.dimension=-1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function(){return new " + className + "(this.data);};proto.get=proto.set=function(){};proto.pick=function(){return null};return function construct_" + className + "(a){return new " + className + "(a);}";
					var procedure = new Function(code);
					return procedure();
				} else if (dimension === 0) {
					var code = "function " + className + "(a,d) {this.data = a;this.offset = d};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return this.offset};proto.dimension=0;proto.size=1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function " + className + "_copy() {return new " + className + "(this.data,this.offset)};proto.pick=function " + className + "_pick(){return TrivialArray(this.data);};proto.valueOf=proto.get=function " + className + "_get(){return " + (useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]") + "};proto.set=function " + className + "_set(v){return " + (useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v") + "};return function construct_" + className + "(a,b,c,d){return new " + className + "(a,d)}";
					var procedure = new Function("TrivialArray", code);
					return procedure(CACHED_CONSTRUCTORS[dtype][0]);
				}
				var code = ["'use strict'"];
				var indices = iota(dimension);
				var args = indices.map(function(i) {
					return "i" + i;
				});
				var index_str = "this.offset+" + indices.map(function(i) {
					return "this.stride[" + i + "]*i" + i;
				}).join("+");
				var shapeArg = indices.map(function(i) {
					return "b" + i;
				}).join(",");
				var strideArg = indices.map(function(i) {
					return "c" + i;
				}).join(",");
				code.push("function " + className + "(a," + shapeArg + "," + strideArg + ",d){this.data=a", "this.shape=[" + shapeArg + "]", "this.stride=[" + strideArg + "]", "this.offset=d|0}", "var proto=" + className + ".prototype", "proto.dtype='" + dtype + "'", "proto.dimension=" + dimension);
				code.push("Object.defineProperty(proto,'size',{get:function " + className + "_size(){return " + indices.map(function(i) {
					return "this.shape[" + i + "]";
				}).join("*"), "}})");
				if (dimension === 1) code.push("proto.order=[0]");
				else {
					code.push("Object.defineProperty(proto,'order',{get:");
					if (dimension < 4) {
						code.push("function " + className + "_order(){");
						if (dimension === 2) code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})");
						else if (dimension === 3) code.push("var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);if(s0>s1){if(s1>s2){return [2,1,0];}else if(s0>s2){return [1,2,0];}else{return [1,0,2];}}else if(s0>s2){return [2,0,1];}else if(s2>s1){return [0,1,2];}else{return [0,2,1];}}})");
					} else code.push("ORDER})");
				}
				code.push("proto.set=function " + className + "_set(" + args.join(",") + ",v){");
				if (useGetters) code.push("return this.data.set(" + index_str + ",v)}");
				else code.push("return this.data[" + index_str + "]=v}");
				code.push("proto.get=function " + className + "_get(" + args.join(",") + "){");
				if (useGetters) code.push("return this.data.get(" + index_str + ")}");
				else code.push("return this.data[" + index_str + "]}");
				code.push("proto.index=function " + className + "_index(", args.join(), "){return " + index_str + "}");
				code.push("proto.hi=function " + className + "_hi(" + args.join(",") + "){return new " + className + "(this.data," + indices.map(function(i) {
					return [
						"(typeof i",
						i,
						"!=='number'||i",
						i,
						"<0)?this.shape[",
						i,
						"]:i",
						i,
						"|0"
					].join("");
				}).join(",") + "," + indices.map(function(i) {
					return "this.stride[" + i + "]";
				}).join(",") + ",this.offset)}");
				var a_vars = indices.map(function(i) {
					return "a" + i + "=this.shape[" + i + "]";
				});
				var c_vars = indices.map(function(i) {
					return "c" + i + "=this.stride[" + i + "]";
				});
				code.push("proto.lo=function " + className + "_lo(" + args.join(",") + "){var b=this.offset,d=0," + a_vars.join(",") + "," + c_vars.join(","));
				for (var i = 0; i < dimension; ++i) code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){d=i" + i + "|0;b+=c" + i + "*d;a" + i + "-=d}");
				code.push("return new " + className + "(this.data," + indices.map(function(i) {
					return "a" + i;
				}).join(",") + "," + indices.map(function(i) {
					return "c" + i;
				}).join(",") + ",b)}");
				code.push("proto.step=function " + className + "_step(" + args.join(",") + "){var " + indices.map(function(i) {
					return "a" + i + "=this.shape[" + i + "]";
				}).join(",") + "," + indices.map(function(i) {
					return "b" + i + "=this.stride[" + i + "]";
				}).join(",") + ",c=this.offset,d=0,ceil=Math.ceil");
				for (var i = 0; i < dimension; ++i) code.push("if(typeof i" + i + "==='number'){d=i" + i + "|0;if(d<0){c+=b" + i + "*(a" + i + "-1);a" + i + "=ceil(-a" + i + "/d)}else{a" + i + "=ceil(a" + i + "/d)}b" + i + "*=d}");
				code.push("return new " + className + "(this.data," + indices.map(function(i) {
					return "a" + i;
				}).join(",") + "," + indices.map(function(i) {
					return "b" + i;
				}).join(",") + ",c)}");
				var tShape = new Array(dimension);
				var tStride = new Array(dimension);
				for (var i = 0; i < dimension; ++i) {
					tShape[i] = "a[i" + i + "]";
					tStride[i] = "b[i" + i + "]";
				}
				code.push("proto.transpose=function " + className + "_transpose(" + args + "){" + args.map(function(n, idx) {
					return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)";
				}).join(";"), "var a=this.shape,b=this.stride;return new " + className + "(this.data," + tShape.join(",") + "," + tStride.join(",") + ",this.offset)}");
				code.push("proto.pick=function " + className + "_pick(" + args + "){var a=[],b=[],c=this.offset");
				for (var i = 0; i < dimension; ++i) code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){c=(c+this.stride[" + i + "]*i" + i + ")|0}else{a.push(this.shape[" + i + "]);b.push(this.stride[" + i + "])}");
				code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}");
				code.push("return function construct_" + className + "(data,shape,stride,offset){return new " + className + "(data," + indices.map(function(i) {
					return "shape[" + i + "]";
				}).join(",") + "," + indices.map(function(i) {
					return "stride[" + i + "]";
				}).join(",") + ",offset)}");
				var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"));
				return procedure(CACHED_CONSTRUCTORS[dtype], order);
			}
			function arrayDType(data) {
				if (isBuffer(data)) return "buffer";
				if (hasTypedArrays) switch (Object.prototype.toString.call(data)) {
					case "[object Float64Array]": return "float64";
					case "[object Float32Array]": return "float32";
					case "[object Int8Array]": return "int8";
					case "[object Int16Array]": return "int16";
					case "[object Int32Array]": return "int32";
					case "[object Uint8Array]": return "uint8";
					case "[object Uint16Array]": return "uint16";
					case "[object Uint32Array]": return "uint32";
					case "[object Uint8ClampedArray]": return "uint8_clamped";
					case "[object BigInt64Array]": return "bigint64";
					case "[object BigUint64Array]": return "biguint64";
				}
				if (Array.isArray(data)) return "array";
				return "generic";
			}
			var CACHED_CONSTRUCTORS = {
				"float32": [],
				"float64": [],
				"int8": [],
				"int16": [],
				"int32": [],
				"uint8": [],
				"uint16": [],
				"uint32": [],
				"array": [],
				"uint8_clamped": [],
				"bigint64": [],
				"biguint64": [],
				"buffer": [],
				"generic": []
			};
			function wrappedNDArrayCtor(data, shape, stride, offset) {
				if (data === void 0) {
					var ctor = CACHED_CONSTRUCTORS.array[0];
					return ctor([]);
				} else if (typeof data === "number") data = [data];
				if (shape === void 0) shape = [data.length];
				var d = shape.length;
				if (stride === void 0) {
					stride = new Array(d);
					for (var i = d - 1, sz = 1; i >= 0; --i) {
						stride[i] = sz;
						sz *= shape[i];
					}
				}
				if (offset === void 0) {
					offset = 0;
					for (var i = 0; i < d; ++i) if (stride[i] < 0) offset -= (shape[i] - 1) * stride[i];
				}
				var dtype = arrayDType(data);
				var ctor_list = CACHED_CONSTRUCTORS[dtype];
				while (ctor_list.length <= d + 1) ctor_list.push(compileConstructor(dtype, ctor_list.length - 1));
				var ctor = ctor_list[d + 1];
				return ctor(data, shape, stride, offset);
			}
			module$217.exports = wrappedNDArrayCtor;
		}),
		(function(module$218, exports$212, __webpack_require__) {
			"use strict";
			function iota(n) {
				var result = new Array(n);
				for (var i = 0; i < n; ++i) result[i] = i;
				return result;
			}
			module$218.exports = iota;
		}),
		(function(module$219, exports$213) {
			/*!
			* Determine if an object is a Buffer
			*
			* @author   Feross Aboukhadijeh <https://feross.org>
			* @license  MIT
			*/
			module$219.exports = function(obj) {
				return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
			};
			function isBuffer(obj) {
				return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
			}
			function isSlowBuffer(obj) {
				return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
			}
		}),
		(function(module$220, exports$214, __webpack_require__) {
			"use strict";
			function interp1d(arr, x) {
				var ix = Math.floor(x), fx = x - ix, s0 = 0 <= ix && ix < arr.shape[0], s1 = 0 <= ix + 1 && ix + 1 < arr.shape[0], w0 = s0 ? +arr.get(ix) : 0, w1 = s1 ? +arr.get(ix + 1) : 0;
				return (1 - fx) * w0 + fx * w1;
			}
			function interp2d(arr, x, y) {
				var ix = Math.floor(x), fx = x - ix, s0 = 0 <= ix && ix < arr.shape[0], s1 = 0 <= ix + 1 && ix + 1 < arr.shape[0], iy = Math.floor(y), fy = y - iy, t0 = 0 <= iy && iy < arr.shape[1], t1 = 0 <= iy + 1 && iy + 1 < arr.shape[1], w00 = s0 && t0 ? arr.get(ix, iy) : 0, w01 = s0 && t1 ? arr.get(ix, iy + 1) : 0, w10 = s1 && t0 ? arr.get(ix + 1, iy) : 0, w11 = s1 && t1 ? arr.get(ix + 1, iy + 1) : 0;
				return (1 - fy) * ((1 - fx) * w00 + fx * w10) + fy * ((1 - fx) * w01 + fx * w11);
			}
			function interp3d(arr, x, y, z) {
				var ix = Math.floor(x), fx = x - ix, s0 = 0 <= ix && ix < arr.shape[0], s1 = 0 <= ix + 1 && ix + 1 < arr.shape[0], iy = Math.floor(y), fy = y - iy, t0 = 0 <= iy && iy < arr.shape[1], t1 = 0 <= iy + 1 && iy + 1 < arr.shape[1], iz = Math.floor(z), fz = z - iz, u0 = 0 <= iz && iz < arr.shape[2], u1 = 0 <= iz + 1 && iz + 1 < arr.shape[2], w000 = s0 && t0 && u0 ? arr.get(ix, iy, iz) : 0, w010 = s0 && t1 && u0 ? arr.get(ix, iy + 1, iz) : 0, w100 = s1 && t0 && u0 ? arr.get(ix + 1, iy, iz) : 0, w110 = s1 && t1 && u0 ? arr.get(ix + 1, iy + 1, iz) : 0, w001 = s0 && t0 && u1 ? arr.get(ix, iy, iz + 1) : 0, w011 = s0 && t1 && u1 ? arr.get(ix, iy + 1, iz + 1) : 0, w101 = s1 && t0 && u1 ? arr.get(ix + 1, iy, iz + 1) : 0, w111 = s1 && t1 && u1 ? arr.get(ix + 1, iy + 1, iz + 1) : 0;
				return (1 - fz) * ((1 - fy) * ((1 - fx) * w000 + fx * w100) + fy * ((1 - fx) * w010 + fx * w110)) + fz * ((1 - fy) * ((1 - fx) * w001 + fx * w101) + fy * ((1 - fx) * w011 + fx * w111));
			}
			function interpNd(arr) {
				var d = arr.shape.length | 0, ix = new Array(d), fx = new Array(d), s0 = new Array(d), s1 = new Array(d), i, t;
				for (i = 0; i < d; ++i) {
					t = +arguments[i + 1];
					ix[i] = Math.floor(t);
					fx[i] = t - ix[i];
					s0[i] = 0 <= ix[i] && ix[i] < arr.shape[i];
					s1[i] = 0 <= ix[i] + 1 && ix[i] + 1 < arr.shape[i];
				}
				var r = 0, j, w, idx;
				i_loop: for (i = 0; i < 1 << d; ++i) {
					w = 1;
					idx = arr.offset;
					for (j = 0; j < d; ++j) if (i & 1 << j) {
						if (!s1[j]) continue i_loop;
						w *= fx[j];
						idx += arr.stride[j] * (ix[j] + 1);
					} else {
						if (!s0[j]) continue i_loop;
						w *= 1 - fx[j];
						idx += arr.stride[j] * ix[j];
					}
					r += w * arr.data[idx];
				}
				return r;
			}
			function interpolate(arr, x, y, z) {
				switch (arr.shape.length) {
					case 0: return 0;
					case 1: return interp1d(arr, x);
					case 2: return interp2d(arr, x, y);
					case 3: return interp3d(arr, x, y, z);
					default: return interpNd.apply(void 0, arguments);
				}
			}
			module$220.exports = interpolate;
			module$220.exports.d1 = interp1d;
			module$220.exports.d2 = interp2d;
			module$220.exports.d3 = interp3d;
		}),
		(function(module$221, __webpack_exports__, __webpack_require__) {
			"use strict";
			__webpack_require__.r(__webpack_exports__);
			__webpack_require__.d(__webpack_exports__, "BarcodeDecoder", function() {
				return barcode_decoder;
			});
			__webpack_require__.d(__webpack_exports__, "Readers", function() {
				return reader_namespaceObject;
			});
			__webpack_require__.d(__webpack_exports__, "CameraAccess", function() {
				return camera_access;
			});
			__webpack_require__.d(__webpack_exports__, "ImageDebug", function() {
				return image_debug;
			});
			__webpack_require__.d(__webpack_exports__, "ImageWrapper", function() {
				return image_wrapper;
			});
			__webpack_require__.d(__webpack_exports__, "ResultCollector", function() {
				return result_collector;
			});
			var reader_namespaceObject = {};
			__webpack_require__.r(reader_namespaceObject);
			__webpack_require__.d(reader_namespaceObject, "BarcodeReader", function() {
				return barcode_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "TwoOfFiveReader", function() {
				return _2of5_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "NewCodabarReader", function() {
				return codabar_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "Code128Reader", function() {
				return code_128_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "Code32Reader", function() {
				return code_32_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "Code39Reader", function() {
				return code_39_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "Code39VINReader", function() {
				return code_39_vin_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "Code93Reader", function() {
				return code_93_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "EAN2Reader", function() {
				return ean_2_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "EAN5Reader", function() {
				return ean_5_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "EAN8Reader", function() {
				return ean_8_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "EANReader", function() {
				return ean_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "I2of5Reader", function() {
				return i2of5_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "PharmacodeReader", function() {
				return pharmacode_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "UPCEReader", function() {
				return upc_e_reader;
			});
			__webpack_require__.d(reader_namespaceObject, "UPCReader", function() {
				return upc_reader;
			});
			var helpers_typeof = __webpack_require__(13);
			var typeof_default = /*#__PURE__*/ __webpack_require__.n(helpers_typeof);
			var merge = __webpack_require__(19);
			var merge_default = /*#__PURE__*/ __webpack_require__.n(merge);
			__webpack_require__(149);
			var slicedToArray = __webpack_require__(31);
			var slicedToArray_default = /*#__PURE__*/ __webpack_require__.n(slicedToArray);
			var classCallCheck = __webpack_require__(2);
			var classCallCheck_default = /*#__PURE__*/ __webpack_require__.n(classCallCheck);
			var createClass = __webpack_require__(3);
			var createClass_default = /*#__PURE__*/ __webpack_require__.n(createClass);
			var defineProperty = __webpack_require__(0);
			var defineProperty_default = /*#__PURE__*/ __webpack_require__.n(defineProperty);
			var cjs = __webpack_require__(6);
			var array_helper = __webpack_require__(8);
			var cv_utils = __webpack_require__(10);
			function assertNumberPositive(val) {
				if (val < 0) throw new Error("expected positive number, received ".concat(val));
			}
			var image_wrapper = /* @__PURE__ */ function() {
				function ImageWrapper(size, data) {
					var ArrayType = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Uint8Array;
					var initialize = arguments.length > 3 ? arguments[3] : void 0;
					classCallCheck_default()(this, ImageWrapper);
					defineProperty_default()(this, "data", void 0);
					defineProperty_default()(this, "size", void 0);
					defineProperty_default()(this, "indexMapping", void 0);
					if (!data) {
						this.data = new ArrayType(size.x * size.y);
						if (initialize) array_helper["a"].init(this.data, 0);
					} else this.data = data;
					this.size = size;
				}
				return createClass_default()(ImageWrapper, [
					{
						key: "inImageWithBorder",
						value: function inImageWithBorder(imgRef) {
							var border = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
							assertNumberPositive(border);
							return imgRef.x >= 0 && imgRef.y >= 0 && imgRef.x < this.size.x + border * 2 && imgRef.y < this.size.y + border * 2;
						}
					},
					{
						key: "subImageAsCopy",
						value: function subImageAsCopy(imageWrapper, from) {
							assertNumberPositive(from.x);
							assertNumberPositive(from.y);
							var _imageWrapper$size = imageWrapper.size, sizeX = _imageWrapper$size.x, sizeY = _imageWrapper$size.y;
							for (var x = 0; x < sizeX; x++) for (var y = 0; y < sizeY; y++) imageWrapper.data[y * sizeX + x] = this.data[(from.y + y) * this.size.x + from.x + x];
							return imageWrapper;
						}
					},
					{
						key: "get",
						value: function get(x, y) {
							return this.data[y * this.size.x + x];
						}
					},
					{
						key: "getSafe",
						value: function getSafe(x, y) {
							if (!this.indexMapping) {
								this.indexMapping = {
									x: [],
									y: []
								};
								for (var i = 0; i < this.size.x; i++) {
									this.indexMapping.x[i] = i;
									this.indexMapping.x[i + this.size.x] = i;
								}
								for (var _i = 0; _i < this.size.y; _i++) {
									this.indexMapping.y[_i] = _i;
									this.indexMapping.y[_i + this.size.y] = _i;
								}
							}
							return this.data[this.indexMapping.y[y + this.size.y] * this.size.x + this.indexMapping.x[x + this.size.x]];
						}
					},
					{
						key: "set",
						value: function set(x, y, value) {
							this.data[y * this.size.x + x] = value;
							delete this.indexMapping;
							return this;
						}
					},
					{
						key: "zeroBorder",
						value: function zeroBorder() {
							var _this$size = this.size, width = _this$size.x, height = _this$size.y;
							for (var i = 0; i < width; i++) this.data[i] = this.data[(height - 1) * width + i] = 0;
							for (var _i2 = 1; _i2 < height - 1; _i2++) this.data[_i2 * width] = this.data[_i2 * width + (width - 1)] = 0;
							delete this.indexMapping;
							return this;
						}
					},
					{
						key: "moments",
						value: function moments(labelCount) {
							var data = this.data;
							var x;
							var y;
							var height = this.size.y;
							var width = this.size.x;
							var val;
							var ysq;
							var labelSum = [];
							var i;
							var label;
							var mu11;
							var mu02;
							var mu20;
							var x_;
							var y_;
							var tmp;
							var result = [];
							var PI = Math.PI;
							var PI_4 = PI / 4;
							if (labelCount <= 0) return result;
							for (i = 0; i < labelCount; i++) labelSum[i] = {
								m00: 0,
								m01: 0,
								m10: 0,
								m11: 0,
								m02: 0,
								m20: 0,
								theta: 0,
								rad: 0
							};
							for (y = 0; y < height; y++) {
								ysq = y * y;
								for (x = 0; x < width; x++) {
									val = data[y * width + x];
									if (val > 0) {
										label = labelSum[val - 1];
										label.m00 += 1;
										label.m01 += y;
										label.m10 += x;
										label.m11 += x * y;
										label.m02 += ysq;
										label.m20 += x * x;
									}
								}
							}
							for (i = 0; i < labelCount; i++) {
								label = labelSum[i];
								if (!isNaN(label.m00) && label.m00 !== 0) {
									x_ = label.m10 / label.m00;
									y_ = label.m01 / label.m00;
									mu11 = label.m11 / label.m00 - x_ * y_;
									mu02 = label.m02 / label.m00 - y_ * y_;
									mu20 = label.m20 / label.m00 - x_ * x_;
									tmp = (mu02 - mu20) / (2 * mu11);
									tmp = .5 * Math.atan(tmp) + (mu11 >= 0 ? PI_4 : -PI_4) + PI;
									label.theta = (tmp * 180 / PI + 90) % 180 - 90;
									if (label.theta < 0) label.theta += 180;
									label.rad = tmp > PI ? tmp - PI : tmp;
									label.vec = cjs["vec2"].clone([Math.cos(tmp), Math.sin(tmp)]);
									result.push(label);
								}
							}
							return result;
						}
					},
					{
						key: "getAsRGBA",
						value: function getAsRGBA() {
							var scale = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
							var ret = new Uint8ClampedArray(4 * this.size.x * this.size.y);
							for (var y = 0; y < this.size.y; y++) for (var x = 0; x < this.size.x; x++) {
								var pixel = y * this.size.x + x;
								var current = this.get(x, y) * scale;
								ret[pixel * 4 + 0] = current;
								ret[pixel * 4 + 1] = current;
								ret[pixel * 4 + 2] = current;
								ret[pixel * 4 + 3] = 255;
							}
							return ret;
						}
					},
					{
						key: "show",
						value: function show(canvas) {
							var scale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
							console.warn("* imagewrapper show getcontext 2d");
							var ctx = canvas.getContext("2d");
							if (!ctx) throw new Error("Unable to get canvas context");
							var frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
							var data = this.getAsRGBA(scale);
							canvas.width = this.size.x;
							canvas.height = this.size.y;
							var newFrame = new ImageData(data, frame.width, frame.height);
							ctx.putImageData(newFrame, 0, 0);
						}
					},
					{
						key: "overlay",
						value: function overlay(canvas, inScale, from) {
							var adjustedScale = inScale < 0 || inScale > 360 ? 360 : inScale;
							var hsv = [
								0,
								1,
								1
							];
							var rgb = [
								0,
								0,
								0
							];
							var whiteRgb = [
								255,
								255,
								255
							];
							var blackRgb = [
								0,
								0,
								0
							];
							var result = [];
							console.warn("* imagewrapper overlay getcontext 2d");
							var ctx = canvas.getContext("2d");
							if (!ctx) throw new Error("Unable to get canvas context");
							var frame = ctx.getImageData(from.x, from.y, this.size.x, this.size.y);
							var data = frame.data;
							var length = this.data.length;
							while (length--) {
								hsv[0] = this.data[length] * adjustedScale;
								result = hsv[0] <= 0 ? whiteRgb : hsv[0] >= 360 ? blackRgb : Object(cv_utils["hsv2rgb"])(hsv, rgb);
								var pos = length * 4;
								var _result = result;
								var _result2 = slicedToArray_default()(_result, 3);
								data[pos] = _result2[0];
								data[pos + 1] = _result2[1];
								data[pos + 2] = _result2[2];
								data[pos + 3] = 255;
							}
							ctx.putImageData(frame, from.x, from.y);
						}
					}
				]);
			}();
			var asyncToGenerator = __webpack_require__(9);
			var asyncToGenerator_default = /*#__PURE__*/ __webpack_require__.n(asyncToGenerator);
			var regenerator = __webpack_require__(7);
			var regenerator_default = /*#__PURE__*/ __webpack_require__.n(regenerator);
			var image_debug = {
				drawRect: function drawRect(pos, size, ctx, style) {
					ctx.strokeStyle = style.color;
					ctx.fillStyle = style.color;
					ctx.lineWidth = style.lineWidth || 1;
					ctx.beginPath();
					ctx.strokeRect(pos.x, pos.y, size.x, size.y);
				},
				drawPath: function drawPath(path, def, ctx, style) {
					ctx.strokeStyle = style.color;
					ctx.fillStyle = style.color;
					ctx.lineWidth = style.lineWidth;
					ctx.beginPath();
					ctx.moveTo(path[0][def.x], path[0][def.y]);
					for (var j = 1; j < path.length; j++) ctx.lineTo(path[j][def.x], path[j][def.y]);
					ctx.closePath();
					ctx.stroke();
				},
				drawImage: function drawImage(imageData, size, ctx) {
					var canvasData = ctx.getImageData(0, 0, size.x, size.y);
					var data = canvasData.data;
					var canvasDataPos = data.length;
					var imageDataPos = imageData.length;
					if (canvasDataPos / imageDataPos !== 4) return false;
					while (imageDataPos--) {
						var value = imageData[imageDataPos];
						data[--canvasDataPos] = 255;
						data[--canvasDataPos] = value;
						data[--canvasDataPos] = value;
						data[--canvasDataPos] = value;
					}
					ctx.putImageData(canvasData, 0, 0);
					return true;
				}
			};
			var possibleConstructorReturn = __webpack_require__(4);
			var possibleConstructorReturn_default = /*#__PURE__*/ __webpack_require__.n(possibleConstructorReturn);
			var getPrototypeOf = __webpack_require__(1);
			var getPrototypeOf_default = /*#__PURE__*/ __webpack_require__.n(getPrototypeOf);
			var inherits = __webpack_require__(5);
			var inherits_default = /*#__PURE__*/ __webpack_require__.n(inherits);
			var BarcodeDirection = /*#__PURE__*/ function(BarcodeDirection) {
				BarcodeDirection[BarcodeDirection["Forward"] = 1] = "Forward";
				BarcodeDirection[BarcodeDirection["Reverse"] = -1] = "Reverse";
				return BarcodeDirection;
			}({});
			var barcode_reader_BarcodeReader = /*#__PURE__*/ function() {
				function BarcodeReader(config, supplements) {
					classCallCheck_default()(this, BarcodeReader);
					defineProperty_default()(this, "_row", []);
					defineProperty_default()(this, "config", {});
					defineProperty_default()(this, "supplements", []);
					defineProperty_default()(this, "SINGLE_CODE_ERROR", 0);
					defineProperty_default()(this, "FORMAT", "unknown");
					defineProperty_default()(this, "CONFIG_KEYS", {});
					this._row = [];
					this.config = config || {};
					if (supplements) this.supplements = supplements;
				}
				return createClass_default()(BarcodeReader, [
					{
						key: "_nextUnset",
						value: function _nextUnset(line) {
							for (var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0; i < line.length; i++) if (!line[i]) return i;
							return line.length;
						}
					},
					{
						key: "_matchPattern",
						value: function _matchPattern(counter, code) {
							var maxSingleError = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.SINGLE_CODE_ERROR || 1;
							var error = 0;
							var singleError = 0;
							var sum = 0;
							var modulo = 0;
							var barWidth = 0;
							var count = 0;
							var scaled = 0;
							for (var i = 0; i < counter.length; i++) {
								sum += counter[i];
								modulo += code[i];
							}
							if (sum < modulo) return Number.MAX_VALUE;
							barWidth = sum / modulo;
							maxSingleError *= barWidth;
							for (var _i = 0; _i < counter.length; _i++) {
								count = counter[_i];
								scaled = code[_i] * barWidth;
								singleError = Math.abs(count - scaled) / scaled;
								if (singleError > maxSingleError) return Number.MAX_VALUE;
								error += singleError;
							}
							return error / modulo;
						}
					},
					{
						key: "_nextSet",
						value: function _nextSet(line) {
							for (var i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0; i < line.length; i++) if (line[i]) return i;
							return line.length;
						}
					},
					{
						key: "_correctBars",
						value: function _correctBars(counter, correction, indices) {
							var length = indices.length;
							var tmp = 0;
							while (length--) {
								tmp = counter[indices[length]] * (1 - (1 - correction) / 2);
								if (tmp > 1) counter[indices[length]] = tmp;
							}
						}
					},
					{
						key: "decodePattern",
						value: function decodePattern(pattern) {
							this._row = pattern;
							var result = this.decode();
							if (result === null) {
								this._row.reverse();
								result = this.decode();
								if (result) {
									result.direction = BarcodeDirection.Reverse;
									result.start = this._row.length - result.start;
									result.end = this._row.length - result.end;
								}
							} else result.direction = BarcodeDirection.Forward;
							if (result) result.format = this.FORMAT;
							return result;
						}
					},
					{
						key: "_matchRange",
						value: function _matchRange(start, end, value) {
							start = start < 0 ? 0 : start;
							var i;
							for (i = start; i < end; i++) if (this._row[i] !== value) return false;
							return true;
						}
					},
					{
						key: "_fillCounters",
						value: function _fillCounters() {
							var offset = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this._nextUnset(this._row);
							var end = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._row.length;
							var isWhite = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
							var counters = [];
							var counterPos = 0;
							counters[counterPos] = 0;
							for (var i = offset; i < end; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counters[counterPos]++;
							else {
								counterPos++;
								counters[counterPos] = 1;
								isWhite = !isWhite;
							}
							return counters;
						}
					},
					{
						key: "_toCounters",
						value: function _toCounters(start, counters) {
							var numCounters = counters.length;
							var end = this._row.length;
							var isWhite = !this._row[start];
							var counterPos = 0;
							array_helper["a"].init(counters, 0);
							for (var i = start; i < end; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counters[counterPos]++;
							else {
								counterPos++;
								if (counterPos === numCounters) break;
								else {
									counters[counterPos] = 1;
									isWhite = !isWhite;
								}
							}
							return counters;
						}
					},
					{
						key: "decodeImage",
						value: function decodeImage(imageWrapper) {
							return null;
						}
					}
				], [{
					key: "Exception",
					get: function get() {
						return {
							StartNotFoundException: "Start-Info was not found!",
							CodeNotFoundException: "Code could not be found!",
							PatternNotFoundException: "Pattern could not be found!"
						};
					}
				}]);
			}();
			defineProperty_default()(barcode_reader_BarcodeReader, "adjacentLineValidationMatches", 0);
			var barcode_reader = barcode_reader_BarcodeReader;
			function _callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function _isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var N = 1;
			var W = 3;
			var START_PATTERN = [
				W,
				N,
				W,
				N,
				N,
				N
			];
			var STOP_PATTERN = [
				W,
				N,
				N,
				N,
				W
			];
			var CODE_PATTERN = [
				[
					N,
					N,
					W,
					W,
					N
				],
				[
					W,
					N,
					N,
					N,
					W
				],
				[
					N,
					W,
					N,
					N,
					W
				],
				[
					W,
					W,
					N,
					N,
					N
				],
				[
					N,
					N,
					W,
					N,
					W
				],
				[
					W,
					N,
					W,
					N,
					N
				],
				[
					N,
					W,
					W,
					N,
					N
				],
				[
					N,
					N,
					N,
					W,
					W
				],
				[
					W,
					N,
					N,
					W,
					N
				],
				[
					N,
					W,
					N,
					W,
					N
				]
			];
			var START_PATTERN_LENGTH = START_PATTERN.reduce(function(sum, val) {
				return sum + val;
			}, 0);
			var _2of5_reader = /* @__PURE__ */ function(_BarcodeReader) {
				function TwoOfFiveReader() {
					var _this;
					classCallCheck_default()(this, TwoOfFiveReader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = _callSuper(this, TwoOfFiveReader, [].concat(args));
					defineProperty_default()(_this, "barSpaceRatio", [1, 1]);
					defineProperty_default()(_this, "FORMAT", "2of5");
					defineProperty_default()(_this, "SINGLE_CODE_ERROR", .78);
					defineProperty_default()(_this, "AVG_CODE_ERROR", .3);
					return _this;
				}
				inherits_default()(TwoOfFiveReader, _BarcodeReader);
				return createClass_default()(TwoOfFiveReader, [
					{
						key: "_findPattern",
						value: function _findPattern(pattern, offset) {
							var isWhite = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
							var tryHarder = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
							var counter = [];
							var counterPos = 0;
							var bestMatch = {
								error: Number.MAX_VALUE,
								code: -1,
								start: 0,
								end: 0
							};
							var sum = 0;
							var error = 0;
							var epsilon = this.AVG_CODE_ERROR;
							if (!offset) offset = this._nextSet(this._row);
							for (var i = 0; i < pattern.length; i++) counter[i] = 0;
							for (var _i = offset; _i < this._row.length; _i++) if (this._row[_i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
							else {
								if (counterPos === counter.length - 1) {
									sum = 0;
									for (var j = 0; j < counter.length; j++) sum += counter[j];
									error = this._matchPattern(counter, pattern);
									if (error < epsilon) {
										bestMatch.error = error;
										bestMatch.start = _i - sum;
										bestMatch.end = _i;
										return bestMatch;
									}
									if (tryHarder) {
										for (var _j = 0; _j < counter.length - 2; _j++) counter[_j] = counter[_j + 2];
										counter[counter.length - 2] = 0;
										counter[counter.length - 1] = 0;
										counterPos--;
									} else return null;
								} else counterPos++;
								counter[counterPos] = 1;
								isWhite = !isWhite;
							}
							return null;
						}
					},
					{
						key: "_findStart",
						value: function _findStart() {
							var startInfo = null;
							var offset = this._nextSet(this._row);
							var narrowBarWidth = 1;
							var leadingWhitespaceStart = 0;
							while (!startInfo) {
								startInfo = this._findPattern(START_PATTERN, offset, false, true);
								if (!startInfo) return null;
								narrowBarWidth = Math.floor((startInfo.end - startInfo.start) / START_PATTERN_LENGTH);
								leadingWhitespaceStart = startInfo.start - narrowBarWidth * 5;
								if (leadingWhitespaceStart >= 0) {
									if (this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) return startInfo;
								}
								offset = startInfo.end;
								startInfo = null;
							}
							return startInfo;
						}
					},
					{
						key: "_verifyTrailingWhitespace",
						value: function _verifyTrailingWhitespace(endInfo) {
							var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start) / 2;
							if (trailingWhitespaceEnd < this._row.length) {
								if (this._matchRange(endInfo.end, trailingWhitespaceEnd, 0)) return endInfo;
							}
							return null;
						}
					},
					{
						key: "_findEnd",
						value: function _findEnd() {
							this._row.reverse();
							var offset = this._nextSet(this._row);
							var endInfo = this._findPattern(STOP_PATTERN, offset, false, true);
							this._row.reverse();
							if (endInfo === null) return null;
							var tmp = endInfo.start;
							endInfo.start = this._row.length - endInfo.end;
							endInfo.end = this._row.length - tmp;
							return endInfo !== null ? this._verifyTrailingWhitespace(endInfo) : null;
						}
					},
					{
						key: "_verifyCounterLength",
						value: function _verifyCounterLength(counters) {
							return counters.length % 10 === 0;
						}
					},
					{
						key: "_decodeCode",
						value: function _decodeCode(counter) {
							var epsilon = this.AVG_CODE_ERROR;
							var bestMatch = {
								error: Number.MAX_VALUE,
								code: -1,
								start: 0,
								end: 0
							};
							for (var code = 0; code < CODE_PATTERN.length; code++) {
								var error = this._matchPattern(counter, CODE_PATTERN[code]);
								if (error < bestMatch.error) {
									bestMatch.code = code;
									bestMatch.error = error;
								}
							}
							if (bestMatch.error < epsilon) return bestMatch;
							return null;
						}
					},
					{
						key: "_decodePayload",
						value: function _decodePayload(counters, result, decodedCodes) {
							var pos = 0;
							var counterLength = counters.length;
							var counter = [
								0,
								0,
								0,
								0,
								0
							];
							var code = null;
							while (pos < counterLength) {
								for (var i = 0; i < 5; i++) {
									counter[i] = counters[pos] * this.barSpaceRatio[0];
									pos += 2;
								}
								code = this._decodeCode(counter);
								if (!code) return null;
								result.push("".concat(code.code));
								decodedCodes.push(code);
							}
							return code;
						}
					},
					{
						key: "decode",
						value: function decode(row, start) {
							var startInfo = this._findStart();
							if (!startInfo) return null;
							var endInfo = this._findEnd();
							if (!endInfo) return null;
							var counters = this._fillCounters(startInfo.end, endInfo.start, false);
							if (!this._verifyCounterLength(counters)) return null;
							var decodedCodes = [];
							decodedCodes.push(startInfo);
							var result = [];
							if (!this._decodePayload(counters, result, decodedCodes)) return null;
							if (result.length < 5) return null;
							decodedCodes.push(endInfo);
							return {
								code: result.join(""),
								start: startInfo.start,
								end: endInfo.end,
								startInfo,
								decodedCodes,
								format: this.FORMAT
							};
						}
					}
				]);
			}(barcode_reader);
			function codabar_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, codabar_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function codabar_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (codabar_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var ALPHABET = [
				48,
				49,
				50,
				51,
				52,
				53,
				54,
				55,
				56,
				57,
				45,
				36,
				58,
				47,
				46,
				43,
				65,
				66,
				67,
				68
			];
			var CHARACTER_ENCODINGS = [
				3,
				6,
				9,
				96,
				18,
				66,
				33,
				36,
				48,
				72,
				12,
				24,
				69,
				81,
				84,
				21,
				26,
				41,
				11,
				14
			];
			var START_END = [
				26,
				41,
				11,
				14
			];
			var MIN_ENCODED_CHARS = 4;
			var MAX_ACCEPTABLE = 2;
			var PADDING = 1.5;
			var codabar_reader = /* @__PURE__ */ function(_BarcodeReader) {
				function NewCodabarReader() {
					var _this;
					classCallCheck_default()(this, NewCodabarReader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = codabar_reader_callSuper(this, NewCodabarReader, [].concat(args));
					defineProperty_default()(_this, "_counters", []);
					defineProperty_default()(_this, "FORMAT", "codabar");
					return _this;
				}
				inherits_default()(NewCodabarReader, _BarcodeReader);
				return createClass_default()(NewCodabarReader, [
					{
						key: "_computeAlternatingThreshold",
						value: function _computeAlternatingThreshold(offset, end) {
							var min = Number.MAX_VALUE;
							var max = 0;
							var counter = 0;
							for (var i = offset; i < end; i += 2) {
								counter = this._counters[i];
								if (counter > max) max = counter;
								if (counter < min) min = counter;
							}
							return (min + max) / 2 | 0;
						}
					},
					{
						key: "_toPattern",
						value: function _toPattern(offset) {
							var numCounters = 7;
							var end = offset + numCounters;
							if (end > this._counters.length) return -1;
							var barThreshold = this._computeAlternatingThreshold(offset, end);
							var spaceThreshold = this._computeAlternatingThreshold(offset + 1, end);
							var bitmask = 1 << numCounters - 1;
							var threshold = 0;
							var pattern = 0;
							for (var i = 0; i < numCounters; i++) {
								threshold = (i & 1) === 0 ? barThreshold : spaceThreshold;
								if (this._counters[offset + i] > threshold) pattern |= bitmask;
								bitmask >>= 1;
							}
							return pattern;
						}
					},
					{
						key: "_isStartEnd",
						value: function _isStartEnd(pattern) {
							for (var i = 0; i < START_END.length; i++) if (START_END[i] === pattern) return true;
							return false;
						}
					},
					{
						key: "_sumCounters",
						value: function _sumCounters(start, end) {
							var sum = 0;
							for (var i = start; i < end; i++) sum += this._counters[i];
							return sum;
						}
					},
					{
						key: "_findStart",
						value: function _findStart() {
							var start = this._nextUnset(this._row);
							var end = start;
							for (var i = 1; i < this._counters.length; i++) {
								var pattern = this._toPattern(i);
								if (pattern !== -1 && this._isStartEnd(pattern)) {
									start += this._sumCounters(0, i);
									end = start + this._sumCounters(i, i + 8);
									return {
										start,
										end,
										startCounter: i,
										endCounter: i + 8
									};
								}
							}
							return null;
						}
					},
					{
						key: "_patternToChar",
						value: function _patternToChar(pattern) {
							for (var i = 0; i < CHARACTER_ENCODINGS.length; i++) if (CHARACTER_ENCODINGS[i] === pattern) return String.fromCharCode(ALPHABET[i]);
							return null;
						}
					},
					{
						key: "_calculatePatternLength",
						value: function _calculatePatternLength(offset) {
							var sum = 0;
							for (var i = offset; i < offset + 7; i++) sum += this._counters[i];
							return sum;
						}
					},
					{
						key: "_verifyWhitespace",
						value: function _verifyWhitespace(startCounter, endCounter) {
							if (startCounter - 1 <= 0 || this._counters[startCounter - 1] >= this._calculatePatternLength(startCounter) / 2) {
								if (endCounter + 8 >= this._counters.length || this._counters[endCounter + 7] >= this._calculatePatternLength(endCounter) / 2) return true;
							}
							return false;
						}
					},
					{
						key: "_charToPattern",
						value: function _charToPattern(_char) {
							var charCode = _char.charCodeAt(0);
							for (var i = 0; i < ALPHABET.length; i++) if (ALPHABET[i] === charCode) return CHARACTER_ENCODINGS[i];
							return 0;
						}
					},
					{
						key: "_thresholdResultPattern",
						value: function _thresholdResultPattern(result, startCounter) {
							var categorization = {
								space: {
									narrow: {
										size: 0,
										counts: 0,
										min: 0,
										max: Number.MAX_VALUE
									},
									wide: {
										size: 0,
										counts: 0,
										min: 0,
										max: Number.MAX_VALUE
									}
								},
								bar: {
									narrow: {
										size: 0,
										counts: 0,
										min: 0,
										max: Number.MAX_VALUE
									},
									wide: {
										size: 0,
										counts: 0,
										min: 0,
										max: Number.MAX_VALUE
									}
								}
							};
							var pos = startCounter;
							var pattern;
							for (var i = 0; i < result.length; i++) {
								pattern = this._charToPattern(result[i]);
								for (var j = 6; j >= 0; j--) {
									var kind = (j & 1) === 2 ? categorization.bar : categorization.space;
									var cat = (pattern & 1) === 1 ? kind.wide : kind.narrow;
									cat.size += this._counters[pos + j];
									cat.counts++;
									pattern >>= 1;
								}
								pos += 8;
							}
							["space", "bar"].forEach(function(key) {
								var newkind = categorization[key];
								newkind.wide.min = Math.floor((newkind.narrow.size / newkind.narrow.counts + newkind.wide.size / newkind.wide.counts) / 2);
								newkind.narrow.max = Math.ceil(newkind.wide.min);
								newkind.wide.max = Math.ceil((newkind.wide.size * MAX_ACCEPTABLE + PADDING) / newkind.wide.counts);
							});
							return categorization;
						}
					},
					{
						key: "_validateResult",
						value: function _validateResult(result, startCounter) {
							var thresholds = this._thresholdResultPattern(result, startCounter);
							var pos = startCounter;
							var pattern;
							for (var i = 0; i < result.length; i++) {
								pattern = this._charToPattern(result[i]);
								for (var j = 6; j >= 0; j--) {
									var kind = (j & 1) === 0 ? thresholds.bar : thresholds.space;
									var cat = (pattern & 1) === 1 ? kind.wide : kind.narrow;
									var size = this._counters[pos + j];
									if (size < cat.min || size > cat.max) return false;
									pattern >>= 1;
								}
								pos += 8;
							}
							return true;
						}
					},
					{
						key: "decode",
						value: function decode(row, start) {
							this._counters = this._fillCounters();
							start = this._findStart();
							if (!start) return null;
							var nextStart = start.startCounter;
							var result = [];
							var pattern;
							do {
								pattern = this._toPattern(nextStart);
								if (pattern < 0) return null;
								var decodedChar = this._patternToChar(pattern);
								if (decodedChar === null) return null;
								result.push(decodedChar);
								nextStart += 8;
								if (result.length > 1 && this._isStartEnd(pattern)) break;
							} while (nextStart < this._counters.length);
							if (result.length - 2 < MIN_ENCODED_CHARS || !this._isStartEnd(pattern)) return null;
							if (!this._verifyWhitespace(start.startCounter, nextStart - 8)) return null;
							if (!this._validateResult(result, start.startCounter)) return null;
							nextStart = nextStart > this._counters.length ? this._counters.length : nextStart;
							var end = start.start + this._sumCounters(start.startCounter, nextStart - 8);
							return {
								code: result.join(""),
								start: start.start,
								end,
								startInfo: start,
								decodedCodes: result,
								format: this.FORMAT
							};
						}
					}
				]);
			}(barcode_reader);
			function code_128_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, code_128_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function code_128_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (code_128_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var code_128_reader = /* @__PURE__ */ function(_BarcodeReader) {
				function Code128Reader() {
					var _this;
					classCallCheck_default()(this, Code128Reader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = code_128_reader_callSuper(this, Code128Reader, [].concat(args));
					defineProperty_default()(_this, "CODE_SHIFT", 98);
					defineProperty_default()(_this, "CODE_C", 99);
					defineProperty_default()(_this, "CODE_B", 100);
					defineProperty_default()(_this, "CODE_A", 101);
					defineProperty_default()(_this, "FNC1", 102);
					defineProperty_default()(_this, "START_CODE_A", 103);
					defineProperty_default()(_this, "START_CODE_B", 104);
					defineProperty_default()(_this, "START_CODE_C", 105);
					defineProperty_default()(_this, "STOP_CODE", 106);
					defineProperty_default()(_this, "FNC1_CHAR", String.fromCharCode(29));
					defineProperty_default()(_this, "CODE_PATTERN", [
						[
							2,
							1,
							2,
							2,
							2,
							2
						],
						[
							2,
							2,
							2,
							1,
							2,
							2
						],
						[
							2,
							2,
							2,
							2,
							2,
							1
						],
						[
							1,
							2,
							1,
							2,
							2,
							3
						],
						[
							1,
							2,
							1,
							3,
							2,
							2
						],
						[
							1,
							3,
							1,
							2,
							2,
							2
						],
						[
							1,
							2,
							2,
							2,
							1,
							3
						],
						[
							1,
							2,
							2,
							3,
							1,
							2
						],
						[
							1,
							3,
							2,
							2,
							1,
							2
						],
						[
							2,
							2,
							1,
							2,
							1,
							3
						],
						[
							2,
							2,
							1,
							3,
							1,
							2
						],
						[
							2,
							3,
							1,
							2,
							1,
							2
						],
						[
							1,
							1,
							2,
							2,
							3,
							2
						],
						[
							1,
							2,
							2,
							1,
							3,
							2
						],
						[
							1,
							2,
							2,
							2,
							3,
							1
						],
						[
							1,
							1,
							3,
							2,
							2,
							2
						],
						[
							1,
							2,
							3,
							1,
							2,
							2
						],
						[
							1,
							2,
							3,
							2,
							2,
							1
						],
						[
							2,
							2,
							3,
							2,
							1,
							1
						],
						[
							2,
							2,
							1,
							1,
							3,
							2
						],
						[
							2,
							2,
							1,
							2,
							3,
							1
						],
						[
							2,
							1,
							3,
							2,
							1,
							2
						],
						[
							2,
							2,
							3,
							1,
							1,
							2
						],
						[
							3,
							1,
							2,
							1,
							3,
							1
						],
						[
							3,
							1,
							1,
							2,
							2,
							2
						],
						[
							3,
							2,
							1,
							1,
							2,
							2
						],
						[
							3,
							2,
							1,
							2,
							2,
							1
						],
						[
							3,
							1,
							2,
							2,
							1,
							2
						],
						[
							3,
							2,
							2,
							1,
							1,
							2
						],
						[
							3,
							2,
							2,
							2,
							1,
							1
						],
						[
							2,
							1,
							2,
							1,
							2,
							3
						],
						[
							2,
							1,
							2,
							3,
							2,
							1
						],
						[
							2,
							3,
							2,
							1,
							2,
							1
						],
						[
							1,
							1,
							1,
							3,
							2,
							3
						],
						[
							1,
							3,
							1,
							1,
							2,
							3
						],
						[
							1,
							3,
							1,
							3,
							2,
							1
						],
						[
							1,
							1,
							2,
							3,
							1,
							3
						],
						[
							1,
							3,
							2,
							1,
							1,
							3
						],
						[
							1,
							3,
							2,
							3,
							1,
							1
						],
						[
							2,
							1,
							1,
							3,
							1,
							3
						],
						[
							2,
							3,
							1,
							1,
							1,
							3
						],
						[
							2,
							3,
							1,
							3,
							1,
							1
						],
						[
							1,
							1,
							2,
							1,
							3,
							3
						],
						[
							1,
							1,
							2,
							3,
							3,
							1
						],
						[
							1,
							3,
							2,
							1,
							3,
							1
						],
						[
							1,
							1,
							3,
							1,
							2,
							3
						],
						[
							1,
							1,
							3,
							3,
							2,
							1
						],
						[
							1,
							3,
							3,
							1,
							2,
							1
						],
						[
							3,
							1,
							3,
							1,
							2,
							1
						],
						[
							2,
							1,
							1,
							3,
							3,
							1
						],
						[
							2,
							3,
							1,
							1,
							3,
							1
						],
						[
							2,
							1,
							3,
							1,
							1,
							3
						],
						[
							2,
							1,
							3,
							3,
							1,
							1
						],
						[
							2,
							1,
							3,
							1,
							3,
							1
						],
						[
							3,
							1,
							1,
							1,
							2,
							3
						],
						[
							3,
							1,
							1,
							3,
							2,
							1
						],
						[
							3,
							3,
							1,
							1,
							2,
							1
						],
						[
							3,
							1,
							2,
							1,
							1,
							3
						],
						[
							3,
							1,
							2,
							3,
							1,
							1
						],
						[
							3,
							3,
							2,
							1,
							1,
							1
						],
						[
							3,
							1,
							4,
							1,
							1,
							1
						],
						[
							2,
							2,
							1,
							4,
							1,
							1
						],
						[
							4,
							3,
							1,
							1,
							1,
							1
						],
						[
							1,
							1,
							1,
							2,
							2,
							4
						],
						[
							1,
							1,
							1,
							4,
							2,
							2
						],
						[
							1,
							2,
							1,
							1,
							2,
							4
						],
						[
							1,
							2,
							1,
							4,
							2,
							1
						],
						[
							1,
							4,
							1,
							1,
							2,
							2
						],
						[
							1,
							4,
							1,
							2,
							2,
							1
						],
						[
							1,
							1,
							2,
							2,
							1,
							4
						],
						[
							1,
							1,
							2,
							4,
							1,
							2
						],
						[
							1,
							2,
							2,
							1,
							1,
							4
						],
						[
							1,
							2,
							2,
							4,
							1,
							1
						],
						[
							1,
							4,
							2,
							1,
							1,
							2
						],
						[
							1,
							4,
							2,
							2,
							1,
							1
						],
						[
							2,
							4,
							1,
							2,
							1,
							1
						],
						[
							2,
							2,
							1,
							1,
							1,
							4
						],
						[
							4,
							1,
							3,
							1,
							1,
							1
						],
						[
							2,
							4,
							1,
							1,
							1,
							2
						],
						[
							1,
							3,
							4,
							1,
							1,
							1
						],
						[
							1,
							1,
							1,
							2,
							4,
							2
						],
						[
							1,
							2,
							1,
							1,
							4,
							2
						],
						[
							1,
							2,
							1,
							2,
							4,
							1
						],
						[
							1,
							1,
							4,
							2,
							1,
							2
						],
						[
							1,
							2,
							4,
							1,
							1,
							2
						],
						[
							1,
							2,
							4,
							2,
							1,
							1
						],
						[
							4,
							1,
							1,
							2,
							1,
							2
						],
						[
							4,
							2,
							1,
							1,
							1,
							2
						],
						[
							4,
							2,
							1,
							2,
							1,
							1
						],
						[
							2,
							1,
							2,
							1,
							4,
							1
						],
						[
							2,
							1,
							4,
							1,
							2,
							1
						],
						[
							4,
							1,
							2,
							1,
							2,
							1
						],
						[
							1,
							1,
							1,
							1,
							4,
							3
						],
						[
							1,
							1,
							1,
							3,
							4,
							1
						],
						[
							1,
							3,
							1,
							1,
							4,
							1
						],
						[
							1,
							1,
							4,
							1,
							1,
							3
						],
						[
							1,
							1,
							4,
							3,
							1,
							1
						],
						[
							4,
							1,
							1,
							1,
							1,
							3
						],
						[
							4,
							1,
							1,
							3,
							1,
							1
						],
						[
							1,
							1,
							3,
							1,
							4,
							1
						],
						[
							1,
							1,
							4,
							1,
							3,
							1
						],
						[
							3,
							1,
							1,
							1,
							4,
							1
						],
						[
							4,
							1,
							1,
							1,
							3,
							1
						],
						[
							2,
							1,
							1,
							4,
							1,
							2
						],
						[
							2,
							1,
							1,
							2,
							1,
							4
						],
						[
							2,
							1,
							1,
							2,
							3,
							2
						],
						[
							2,
							3,
							3,
							1,
							1,
							1,
							2
						]
					]);
					defineProperty_default()(_this, "SINGLE_CODE_ERROR", .64);
					defineProperty_default()(_this, "AVG_CODE_ERROR", .3);
					defineProperty_default()(_this, "FORMAT", "code_128");
					defineProperty_default()(_this, "MODULE_INDICES", {
						bar: [
							0,
							2,
							4
						],
						space: [
							1,
							3,
							5
						]
					});
					return _this;
				}
				inherits_default()(Code128Reader, _BarcodeReader);
				return createClass_default()(Code128Reader, [
					{
						key: "_decodeCode",
						value: function _decodeCode(start, correction) {
							var bestMatch = {
								error: Number.MAX_VALUE,
								code: -1,
								start,
								end: start,
								correction: {
									bar: 1,
									space: 1
								}
							};
							var counter = [
								0,
								0,
								0,
								0,
								0,
								0
							];
							var offset = start;
							var isWhite = !this._row[offset];
							var counterPos = 0;
							for (var i = offset; i < this._row.length; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
							else {
								if (counterPos === counter.length - 1) {
									if (correction) this._correct(counter, correction);
									for (var code = 0; code < this.CODE_PATTERN.length; code++) {
										var error = this._matchPattern(counter, this.CODE_PATTERN[code]);
										if (error < bestMatch.error) {
											bestMatch.code = code;
											bestMatch.error = error;
										}
									}
									bestMatch.end = i;
									if (bestMatch.code === -1 || bestMatch.error > this.AVG_CODE_ERROR) return null;
									if (this.CODE_PATTERN[bestMatch.code]) {
										bestMatch.correction.bar = this.calculateCorrection(this.CODE_PATTERN[bestMatch.code], counter, this.MODULE_INDICES.bar);
										bestMatch.correction.space = this.calculateCorrection(this.CODE_PATTERN[bestMatch.code], counter, this.MODULE_INDICES.space);
									}
									return bestMatch;
								} else counterPos++;
								counter[counterPos] = 1;
								isWhite = !isWhite;
							}
							return null;
						}
					},
					{
						key: "_correct",
						value: function _correct(counter, correction) {
							this._correctBars(counter, correction.bar, this.MODULE_INDICES.bar);
							this._correctBars(counter, correction.space, this.MODULE_INDICES.space);
						}
					},
					{
						key: "_findStart",
						value: function _findStart() {
							var counter = [
								0,
								0,
								0,
								0,
								0,
								0
							];
							var offset = this._nextSet(this._row);
							var bestMatch = {
								error: Number.MAX_VALUE,
								code: -1,
								start: 0,
								end: 0,
								correction: {
									bar: 1,
									space: 1
								}
							};
							var isWhite = false;
							var counterPos = 0;
							for (var i = offset; i < this._row.length; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
							else {
								if (counterPos === counter.length - 1) {
									var sum = counter.reduce(function(prev, next) {
										return prev + next;
									}, 0);
									for (var code = this.START_CODE_A; code <= this.START_CODE_C; code++) {
										var error = this._matchPattern(counter, this.CODE_PATTERN[code]);
										if (error < bestMatch.error) {
											bestMatch.code = code;
											bestMatch.error = error;
										}
									}
									if (bestMatch.error < this.AVG_CODE_ERROR) {
										bestMatch.start = i - sum;
										bestMatch.end = i;
										bestMatch.correction.bar = this.calculateCorrection(this.CODE_PATTERN[bestMatch.code], counter, this.MODULE_INDICES.bar);
										bestMatch.correction.space = this.calculateCorrection(this.CODE_PATTERN[bestMatch.code], counter, this.MODULE_INDICES.space);
										return bestMatch;
									}
									for (var j = 0; j < 4; j++) counter[j] = counter[j + 2];
									counter[4] = 0;
									counter[5] = 0;
									counterPos--;
								} else counterPos++;
								counter[counterPos] = 1;
								isWhite = !isWhite;
							}
							return null;
						}
					},
					{
						key: "decode",
						value: function decode(row, start) {
							var _this2 = this;
							var startInfo = this._findStart();
							if (startInfo === null) return null;
							var code = {
								code: startInfo.code,
								start: startInfo.start,
								end: startInfo.end,
								correction: {
									bar: startInfo.correction.bar,
									space: startInfo.correction.space
								}
							};
							var decodedCodes = [];
							decodedCodes.push(code);
							var checksum = code.code;
							var codeset = function(c) {
								switch (c) {
									case _this2.START_CODE_A: return _this2.CODE_A;
									case _this2.START_CODE_B: return _this2.CODE_B;
									case _this2.START_CODE_C: return _this2.CODE_C;
									default: return null;
								}
							}(code.code);
							var done = false;
							var shiftNext = false;
							var unshift = shiftNext;
							var removeLastCharacter = true;
							var multiplier = 0;
							var rawResult = [];
							var result = [];
							while (!done) {
								unshift = shiftNext;
								shiftNext = false;
								code = this._decodeCode(code.end, code.correction);
								if (code !== null) {
									if (code.code !== this.STOP_CODE) removeLastCharacter = true;
									if (code.code !== this.STOP_CODE) {
										rawResult.push(code.code);
										multiplier++;
										checksum += multiplier * code.code;
									}
									decodedCodes.push(code);
									switch (codeset) {
										case this.CODE_A:
											if (code.code < 64) result.push(String.fromCharCode(32 + code.code));
											else if (code.code < 96) result.push(String.fromCharCode(code.code - 64));
											else {
												if (code.code !== this.STOP_CODE) removeLastCharacter = false;
												switch (code.code) {
													case this.CODE_SHIFT:
														shiftNext = true;
														codeset = this.CODE_B;
														break;
													case this.CODE_B:
														codeset = this.CODE_B;
														break;
													case this.CODE_C:
														codeset = this.CODE_C;
														break;
													case this.FNC1:
														result.push(this.FNC1_CHAR);
														break;
													case this.STOP_CODE:
														done = true;
														break;
												}
											}
											break;
										case this.CODE_B:
											if (code.code < 96) result.push(String.fromCharCode(32 + code.code));
											else {
												if (code.code !== this.STOP_CODE) removeLastCharacter = false;
												switch (code.code) {
													case this.CODE_SHIFT:
														shiftNext = true;
														codeset = this.CODE_A;
														break;
													case this.CODE_A:
														codeset = this.CODE_A;
														break;
													case this.CODE_C:
														codeset = this.CODE_C;
														break;
													case this.FNC1:
														result.push(this.FNC1_CHAR);
														break;
													case this.STOP_CODE:
														done = true;
														break;
												}
											}
											break;
										case this.CODE_C:
											if (code.code < 100) result.push(code.code < 10 ? "0" + code.code : code.code);
											else {
												if (code.code !== this.STOP_CODE) removeLastCharacter = false;
												switch (code.code) {
													case this.CODE_A:
														codeset = this.CODE_A;
														break;
													case this.CODE_B:
														codeset = this.CODE_B;
														break;
													case this.FNC1:
														result.push(this.FNC1_CHAR);
														break;
													case this.STOP_CODE:
														done = true;
														break;
												}
											}
											break;
									}
								} else done = true;
								if (unshift) codeset = codeset === this.CODE_A ? this.CODE_B : this.CODE_A;
							}
							if (code === null) return null;
							code.end = this._nextUnset(this._row, code.end);
							if (!this._verifyTrailingWhitespace(code)) return null;
							checksum -= multiplier * rawResult[rawResult.length - 1];
							if (checksum % 103 !== rawResult[rawResult.length - 1]) return null;
							if (!result.length) return null;
							if (removeLastCharacter) result.splice(result.length - 1, 1);
							return {
								code: result.join(""),
								start: startInfo.start,
								end: code.end,
								codeset,
								startInfo,
								decodedCodes,
								endInfo: code,
								format: this.FORMAT
							};
						}
					},
					{
						key: "_verifyTrailingWhitespace",
						value: function _verifyTrailingWhitespace(endInfo) {
							var self = this, trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start) / 2;
							if (trailingWhitespaceEnd < self._row.length) {
								if (self._matchRange(endInfo.end, trailingWhitespaceEnd, 0)) return endInfo;
							}
							return null;
						}
					},
					{
						key: "calculateCorrection",
						value: function calculateCorrection(expected, normalized, indices) {
							var length = indices.length, sumNormalized = 0, sumExpected = 0;
							while (length--) {
								sumExpected += expected[indices[length]];
								sumNormalized += normalized[indices[length]];
							}
							return sumExpected / sumNormalized;
						}
					}
				]);
			}(barcode_reader);
			var get = __webpack_require__(17);
			var get_default = /*#__PURE__*/ __webpack_require__.n(get);
			var toConsumableArray = __webpack_require__(20);
			var toConsumableArray_default = /*#__PURE__*/ __webpack_require__.n(toConsumableArray);
			function code_39_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, code_39_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function code_39_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (code_39_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var code_39_reader_ALPHABET = new Uint16Array(toConsumableArray_default()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%").map(function(_char) {
				return _char.charCodeAt(0);
			}));
			var code_39_reader_CHARACTER_ENCODINGS = new Uint16Array([
				52,
				289,
				97,
				352,
				49,
				304,
				112,
				37,
				292,
				100,
				265,
				73,
				328,
				25,
				280,
				88,
				13,
				268,
				76,
				28,
				259,
				67,
				322,
				19,
				274,
				82,
				7,
				262,
				70,
				22,
				385,
				193,
				448,
				145,
				400,
				208,
				133,
				388,
				196,
				148,
				168,
				162,
				138,
				42
			]);
			var ASTERISK = 148;
			var code_39_reader = /* @__PURE__ */ function(_BarcodeReader) {
				function Code39Reader() {
					var _this;
					classCallCheck_default()(this, Code39Reader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = code_39_reader_callSuper(this, Code39Reader, [].concat(args));
					defineProperty_default()(_this, "FORMAT", "code_39");
					return _this;
				}
				inherits_default()(Code39Reader, _BarcodeReader);
				return createClass_default()(Code39Reader, [
					{
						key: "_findStart",
						value: function _findStart() {
							var offset = this._nextSet(this._row);
							var patternStart = offset;
							var counter = new Uint16Array([
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0
							]);
							var counterPos = 0;
							var isWhite = false;
							for (var i = offset; i < this._row.length; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
							else {
								if (counterPos === counter.length - 1) {
									if (this._toPattern(counter) === ASTERISK) {
										var whiteSpaceMustStart = Math.floor(Math.max(0, patternStart - (i - patternStart) / 4));
										if (this._matchRange(whiteSpaceMustStart, patternStart, 0)) return {
											start: patternStart,
											end: i
										};
									}
									patternStart += counter[0] + counter[1];
									for (var j = 0; j < 7; j++) counter[j] = counter[j + 2];
									counter[7] = 0;
									counter[8] = 0;
									counterPos--;
								} else counterPos++;
								counter[counterPos] = 1;
								isWhite = !isWhite;
							}
							return null;
						}
					},
					{
						key: "_toPattern",
						value: function _toPattern(counters) {
							var numCounters = counters.length;
							var maxNarrowWidth = 0;
							var numWideBars = numCounters;
							var wideBarWidth = 0;
							while (numWideBars > 3) {
								maxNarrowWidth = this._findNextWidth(counters, maxNarrowWidth);
								numWideBars = 0;
								var pattern = 0;
								for (var i = 0; i < numCounters; i++) if (counters[i] > maxNarrowWidth) {
									pattern |= 1 << numCounters - 1 - i;
									numWideBars++;
									wideBarWidth += counters[i];
								}
								if (numWideBars === 3) {
									for (var _i = 0; _i < numCounters && numWideBars > 0; _i++) if (counters[_i] > maxNarrowWidth) {
										numWideBars--;
										if (counters[_i] * 2 >= wideBarWidth) return -1;
									}
									return pattern;
								}
							}
							return -1;
						}
					},
					{
						key: "_findNextWidth",
						value: function _findNextWidth(counters, current) {
							var minWidth = Number.MAX_VALUE;
							for (var i = 0; i < counters.length; i++) if (counters[i] < minWidth && counters[i] > current) minWidth = counters[i];
							return minWidth;
						}
					},
					{
						key: "_patternToChar",
						value: function _patternToChar(pattern) {
							for (var i = 0; i < code_39_reader_CHARACTER_ENCODINGS.length; i++) if (code_39_reader_CHARACTER_ENCODINGS[i] === pattern) return String.fromCharCode(code_39_reader_ALPHABET[i]);
							return null;
						}
					},
					{
						key: "_verifyTrailingWhitespace",
						value: function _verifyTrailingWhitespace(lastStart, nextStart, counters) {
							var patternSize = array_helper["a"].sum(counters);
							if ((nextStart - lastStart - patternSize) * 3 >= patternSize) return true;
							return false;
						}
					},
					{
						key: "decode",
						value: function decode() {
							var counters = new Uint16Array([
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0,
								0
							]);
							var result = [];
							var start = this._findStart();
							if (!start) return null;
							var nextStart = this._nextSet(this._row, start.end);
							var decodedChar;
							var lastStart;
							do {
								counters = this._toCounters(nextStart, counters);
								var pattern = this._toPattern(counters);
								if (pattern < 0) return null;
								decodedChar = this._patternToChar(pattern);
								if (decodedChar === null) return null;
								result.push(decodedChar);
								lastStart = nextStart;
								nextStart += array_helper["a"].sum(counters);
								nextStart = this._nextSet(this._row, nextStart);
							} while (decodedChar !== "*");
							result.pop();
							if (!result.length) return null;
							if (!this._verifyTrailingWhitespace(lastStart, nextStart, counters)) return null;
							return {
								code: result.join(""),
								start: start.start,
								end: nextStart,
								startInfo: start,
								decodedCodes: result,
								format: this.FORMAT
							};
						}
					}
				]);
			}(barcode_reader);
			function code_32_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, code_32_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function code_32_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (code_32_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			function _superPropGet(t, o, e, r) {
				var p = get_default()(getPrototypeOf_default()(1 & r ? t.prototype : t), o, e);
				return 2 & r && "function" == typeof p ? function(t) {
					return p.apply(e, t);
				} : p;
			}
			var patterns = {
				AEIO: /[AEIO]/g,
				AZ09: /[A-Z0-9]/
			};
			var code32set = "0123456789BCDFGHJKLMNPQRSTUVWXYZ";
			var code_32_reader = /* @__PURE__ */ function(_Code39Reader) {
				function Code32Reader() {
					var _this;
					classCallCheck_default()(this, Code32Reader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = code_32_reader_callSuper(this, Code32Reader, [].concat(args));
					defineProperty_default()(_this, "FORMAT", "code_32_reader");
					return _this;
				}
				inherits_default()(Code32Reader, _Code39Reader);
				return createClass_default()(Code32Reader, [
					{
						key: "_decodeCode32",
						value: function _decodeCode32(code) {
							if (/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(code)) return null;
							var res = 0;
							for (var i = 0; i < code.length; i++) res = res * 32 + code32set.indexOf(code[i]);
							var code32 = "".concat(res);
							if (code32.length < 9) code32 = ("000000000" + code32).slice(-9);
							return "A" + code32;
						}
					},
					{
						key: "_checkChecksum",
						value: function _checkChecksum(code) {
							return !!code;
						}
					},
					{
						key: "decode",
						value: function decode() {
							var result = _superPropGet(Code32Reader, "decode", this, 3)([]);
							if (!result) return null;
							var code = result.code;
							if (!code) return null;
							code = code.replace(patterns.AEIO, "");
							if (!this._checkChecksum(code)) return null;
							var code32 = this._decodeCode32(code);
							if (!code32) return null;
							result.code = code32;
							return result;
						}
					}
				]);
			}(code_39_reader);
			function code_39_vin_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, code_39_vin_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function code_39_vin_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (code_39_vin_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			function code_39_vin_reader_superPropGet(t, o, e, r) {
				var p = get_default()(getPrototypeOf_default()(1 & r ? t.prototype : t), o, e);
				return 2 & r && "function" == typeof p ? function(t) {
					return p.apply(e, t);
				} : p;
			}
			var code_39_vin_reader_patterns = {
				IOQ: /[IOQ]/g,
				AZ09: /[A-Z0-9]{17}/
			};
			var code_39_vin_reader = /* @__PURE__ */ function(_Code39Reader) {
				function Code39VINReader() {
					var _this;
					classCallCheck_default()(this, Code39VINReader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = code_39_vin_reader_callSuper(this, Code39VINReader, [].concat(args));
					defineProperty_default()(_this, "FORMAT", "code_39_vin");
					return _this;
				}
				inherits_default()(Code39VINReader, _Code39Reader);
				return createClass_default()(Code39VINReader, [{
					key: "_checkChecksum",
					value: function _checkChecksum(code) {
						return !!code;
					}
				}, {
					key: "decode",
					value: function decode() {
						var result = code_39_vin_reader_superPropGet(Code39VINReader, "decode", this, 3)([]);
						if (!result) return null;
						var code = result.code;
						if (!code) return null;
						code = code.replace(code_39_vin_reader_patterns.IOQ, "");
						if (!code.match(code_39_vin_reader_patterns.AZ09)) return null;
						if (!this._checkChecksum(code)) return null;
						result.code = code;
						return result;
					}
				}]);
			}(code_39_reader);
			function code_93_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, code_93_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function code_93_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (code_93_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var code_93_reader_ALPHABET = new Uint16Array(toConsumableArray_default()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*").map(function(_char) {
				return _char.charCodeAt(0);
			}));
			var code_93_reader_CHARACTER_ENCODINGS = new Uint16Array([
				276,
				328,
				324,
				322,
				296,
				292,
				290,
				336,
				274,
				266,
				424,
				420,
				418,
				404,
				402,
				394,
				360,
				356,
				354,
				308,
				282,
				344,
				332,
				326,
				300,
				278,
				436,
				434,
				428,
				422,
				406,
				410,
				364,
				358,
				310,
				314,
				302,
				468,
				466,
				458,
				366,
				374,
				430,
				294,
				474,
				470,
				306,
				350
			]);
			var code_93_reader_ASTERISK = 350;
			var code_93_reader = /* @__PURE__ */ function(_BarcodeReader) {
				function Code93Reader() {
					var _this;
					classCallCheck_default()(this, Code93Reader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = code_93_reader_callSuper(this, Code93Reader, [].concat(args));
					defineProperty_default()(_this, "FORMAT", "code_93");
					return _this;
				}
				inherits_default()(Code93Reader, _BarcodeReader);
				return createClass_default()(Code93Reader, [
					{
						key: "_patternToChar",
						value: function _patternToChar(pattern) {
							for (var i = 0; i < code_93_reader_CHARACTER_ENCODINGS.length; i++) if (code_93_reader_CHARACTER_ENCODINGS[i] === pattern) return String.fromCharCode(code_93_reader_ALPHABET[i]);
							return null;
						}
					},
					{
						key: "_toPattern",
						value: function _toPattern(counters) {
							var numCounters = counters.length;
							var sum = counters.reduce(function(prev, next) {
								return prev + next;
							}, 0);
							var pattern = 0;
							for (var i = 0; i < numCounters; i++) {
								var normalized = Math.round(counters[i] * 9 / sum);
								if (normalized < 1 || normalized > 4) return -1;
								if ((i & 1) === 0) for (var j = 0; j < normalized; j++) pattern = pattern << 1 | 1;
								else pattern <<= normalized;
							}
							return pattern;
						}
					},
					{
						key: "_findStart",
						value: function _findStart() {
							var offset = this._nextSet(this._row);
							var patternStart = offset;
							var counter = new Uint16Array([
								0,
								0,
								0,
								0,
								0,
								0
							]);
							var counterPos = 0;
							var isWhite = false;
							for (var i = offset; i < this._row.length; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
							else {
								if (counterPos === counter.length - 1) {
									if (this._toPattern(counter) === code_93_reader_ASTERISK) {
										var whiteSpaceMustStart = Math.floor(Math.max(0, patternStart - (i - patternStart) / 4));
										if (this._matchRange(whiteSpaceMustStart, patternStart, 0)) return {
											start: patternStart,
											end: i
										};
									}
									patternStart += counter[0] + counter[1];
									for (var j = 0; j < 4; j++) counter[j] = counter[j + 2];
									counter[4] = 0;
									counter[5] = 0;
									counterPos--;
								} else counterPos++;
								counter[counterPos] = 1;
								isWhite = !isWhite;
							}
							return null;
						}
					},
					{
						key: "_verifyEnd",
						value: function _verifyEnd(lastStart, nextStart) {
							if (lastStart === nextStart || !this._row[nextStart]) return false;
							return true;
						}
					},
					{
						key: "_decodeExtended",
						value: function _decodeExtended(charArray) {
							var length = charArray.length;
							var result = [];
							for (var i = 0; i < length; i++) {
								var _char2 = charArray[i];
								if (_char2 >= "a" && _char2 <= "d") {
									if (i > length - 2) return null;
									var nextChar = charArray[++i];
									var nextCharCode = nextChar.charCodeAt(0);
									var decodedChar = void 0;
									switch (_char2) {
										case "a":
											if (nextChar >= "A" && nextChar <= "Z") decodedChar = String.fromCharCode(nextCharCode - 64);
											else return null;
											break;
										case "b":
											if (nextChar >= "A" && nextChar <= "E") decodedChar = String.fromCharCode(nextCharCode - 38);
											else if (nextChar >= "F" && nextChar <= "J") decodedChar = String.fromCharCode(nextCharCode - 11);
											else if (nextChar >= "K" && nextChar <= "O") decodedChar = String.fromCharCode(nextCharCode + 16);
											else if (nextChar >= "P" && nextChar <= "S") decodedChar = String.fromCharCode(nextCharCode + 43);
											else if (nextChar >= "T" && nextChar <= "Z") decodedChar = String.fromCharCode(127);
											else return null;
											break;
										case "c":
											if (nextChar >= "A" && nextChar <= "O") decodedChar = String.fromCharCode(nextCharCode - 32);
											else if (nextChar === "Z") decodedChar = ":";
											else return null;
											break;
										case "d":
											if (nextChar >= "A" && nextChar <= "Z") decodedChar = String.fromCharCode(nextCharCode + 32);
											else return null;
											break;
										default:
											console.warn("* code_93_reader _decodeExtended hit default case, this may be an error", decodedChar);
											return null;
									}
									result.push(decodedChar);
								} else result.push(_char2);
							}
							return result;
						}
					},
					{
						key: "_matchCheckChar",
						value: function _matchCheckChar(charArray, index, maxWeight) {
							var arrayToCheck = charArray.slice(0, index);
							var length = arrayToCheck.length;
							return code_93_reader_ALPHABET[arrayToCheck.reduce(function(sum, _char3, i) {
								return sum + ((i * -1 + (length - 1)) % maxWeight + 1) * code_93_reader_ALPHABET.indexOf(_char3.charCodeAt(0));
							}, 0) % 47] === charArray[index].charCodeAt(0);
						}
					},
					{
						key: "_verifyChecksums",
						value: function _verifyChecksums(charArray) {
							return this._matchCheckChar(charArray, charArray.length - 2, 20) && this._matchCheckChar(charArray, charArray.length - 1, 15);
						}
					},
					{
						key: "decode",
						value: function decode(row, start) {
							start = this._findStart();
							if (!start) return null;
							var counters = new Uint16Array([
								0,
								0,
								0,
								0,
								0,
								0
							]);
							var result = [];
							var nextStart = this._nextSet(this._row, start.end);
							var lastStart;
							var decodedChar;
							do {
								counters = this._toCounters(nextStart, counters);
								var pattern = this._toPattern(counters);
								if (pattern < 0) return null;
								decodedChar = this._patternToChar(pattern);
								if (decodedChar === null) return null;
								result.push(decodedChar);
								lastStart = nextStart;
								nextStart += array_helper["a"].sum(counters);
								nextStart = this._nextSet(this._row, nextStart);
							} while (decodedChar !== "*");
							result.pop();
							if (!result.length) return null;
							if (!this._verifyEnd(lastStart, nextStart)) return null;
							if (!this._verifyChecksums(result)) return null;
							result = result.slice(0, result.length - 2);
							if ((result = this._decodeExtended(result)) === null) return null;
							return {
								code: result.join(""),
								start: start.start,
								end: nextStart,
								startInfo: start,
								decodedCodes: result,
								format: this.FORMAT
							};
						}
					}
				]);
			}(barcode_reader);
			function ownKeys(e, r) {
				var t = Object.keys(e);
				if (Object.getOwnPropertySymbols) {
					var o = Object.getOwnPropertySymbols(e);
					r && (o = o.filter(function(r) {
						return Object.getOwnPropertyDescriptor(e, r).enumerable;
					})), t.push.apply(t, o);
				}
				return t;
			}
			function _objectSpread(e) {
				for (var r = 1; r < arguments.length; r++) {
					var t = null != arguments[r] ? arguments[r] : {};
					r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
						defineProperty_default()(e, r, t[r]);
					}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
						Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
					});
				}
				return e;
			}
			function ean_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, ean_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function ean_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (ean_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var CODE_G_START = 10;
			var ean_reader_START_PATTERN = [
				1,
				1,
				1
			];
			var MIDDLE_PATTERN = [
				1,
				1,
				1,
				1,
				1
			];
			var EXTENSION_START_PATTERN = [
				1,
				1,
				2
			];
			var ean_reader_CODE_PATTERN = [
				[
					3,
					2,
					1,
					1
				],
				[
					2,
					2,
					2,
					1
				],
				[
					2,
					1,
					2,
					2
				],
				[
					1,
					4,
					1,
					1
				],
				[
					1,
					1,
					3,
					2
				],
				[
					1,
					2,
					3,
					1
				],
				[
					1,
					1,
					1,
					4
				],
				[
					1,
					3,
					1,
					2
				],
				[
					1,
					2,
					1,
					3
				],
				[
					3,
					1,
					1,
					2
				],
				[
					1,
					1,
					2,
					3
				],
				[
					1,
					2,
					2,
					2
				],
				[
					2,
					2,
					1,
					2
				],
				[
					1,
					1,
					4,
					1
				],
				[
					2,
					3,
					1,
					1
				],
				[
					1,
					3,
					2,
					1
				],
				[
					4,
					1,
					1,
					1
				],
				[
					2,
					1,
					3,
					1
				],
				[
					3,
					1,
					2,
					1
				],
				[
					2,
					1,
					1,
					3
				]
			];
			var CODE_FREQUENCY = [
				0,
				11,
				13,
				14,
				19,
				25,
				28,
				21,
				22,
				26
			];
			var AVG_CODE_ERROR = .48;
			var ean_reader = /* @__PURE__ */ function(_BarcodeReader) {
				function EANReader(config, supplements) {
					var _this;
					classCallCheck_default()(this, EANReader);
					_this = ean_reader_callSuper(this, EANReader, [merge_default()({ supplements: [] }, config), supplements]);
					defineProperty_default()(_this, "FORMAT", "ean_13");
					defineProperty_default()(_this, "SINGLE_CODE_ERROR", .7);
					defineProperty_default()(_this, "STOP_PATTERN", [
						1,
						1,
						1
					]);
					return _this;
				}
				inherits_default()(EANReader, _BarcodeReader);
				return createClass_default()(EANReader, [
					{
						key: "_findPattern",
						value: function _findPattern(pattern, offset, isWhite, tryHarder) {
							var counter = new Array(pattern.length).fill(0);
							var bestMatch = {
								error: Number.MAX_VALUE,
								start: 0,
								end: 0
							};
							var epsilon = AVG_CODE_ERROR;
							var counterPos = 0;
							if (!offset) offset = this._nextSet(this._row);
							var found = false;
							for (var i = offset; i < this._row.length; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos] += 1;
							else {
								if (counterPos === counter.length - 1) {
									var error = this._matchPattern(counter, pattern);
									if (error < epsilon && bestMatch.error && error < bestMatch.error) {
										found = true;
										bestMatch.error = error;
										bestMatch.start = i - counter.reduce(function(sum, value) {
											return sum + value;
										}, 0);
										bestMatch.end = i;
										return bestMatch;
									}
									if (tryHarder) {
										for (var j = 0; j < counter.length - 2; j++) counter[j] = counter[j + 2];
										counter[counter.length - 2] = 0;
										counter[counter.length - 1] = 0;
										counterPos--;
									}
								} else counterPos++;
								counter[counterPos] = 1;
								isWhite = !isWhite;
							}
							if (found) {}
							return found ? bestMatch : null;
						}
					},
					{
						key: "_decodeCode",
						value: function _decodeCode(start, coderange) {
							var counter = [
								0,
								0,
								0,
								0
							];
							var offset = start;
							var bestMatch = {
								error: Number.MAX_VALUE,
								code: -1,
								start,
								end: start
							};
							var epsilon = AVG_CODE_ERROR;
							var isWhite = !this._row[offset];
							var counterPos = 0;
							if (!coderange) coderange = ean_reader_CODE_PATTERN.length;
							var found = false;
							for (var i = offset; i < this._row.length; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
							else {
								if (counterPos === counter.length - 1) {
									for (var code = 0; code < coderange; code++) {
										var error = this._matchPattern(counter, ean_reader_CODE_PATTERN[code]);
										bestMatch.end = i;
										if (error < bestMatch.error) {
											bestMatch.code = code;
											bestMatch.error = error;
										}
									}
									if (bestMatch.error > epsilon) return null;
									return bestMatch;
								} else counterPos++;
								counter[counterPos] = 1;
								isWhite = !isWhite;
							}
							return found ? bestMatch : null;
						}
					},
					{
						key: "_findStart",
						value: function _findStart() {
							var offset = this._nextSet(this._row);
							var startInfo = null;
							while (!startInfo) {
								startInfo = this._findPattern(ean_reader_START_PATTERN, offset, false, true);
								if (!startInfo) return null;
								var leadingWhitespaceStart = startInfo.start - (startInfo.end - startInfo.start);
								if (leadingWhitespaceStart >= 0) {
									if (this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) return startInfo;
								}
								offset = startInfo.end;
								startInfo = null;
							}
							return null;
						}
					},
					{
						key: "_calculateFirstDigit",
						value: function _calculateFirstDigit(codeFrequency) {
							for (var i = 0; i < CODE_FREQUENCY.length; i++) if (codeFrequency === CODE_FREQUENCY[i]) return i;
							return null;
						}
					},
					{
						key: "_decodePayload",
						value: function _decodePayload(inCode, result, decodedCodes) {
							var outCode = _objectSpread({}, inCode);
							var codeFrequency = 0;
							for (var i = 0; i < 6; i++) {
								outCode = this._decodeCode(outCode.end);
								if (!outCode) return null;
								if (outCode.code >= CODE_G_START) {
									outCode.code -= CODE_G_START;
									codeFrequency |= 1 << 5 - i;
								} else codeFrequency |= 0 << 5 - i;
								result.push(outCode.code);
								decodedCodes.push(outCode);
							}
							var firstDigit = this._calculateFirstDigit(codeFrequency);
							if (firstDigit === null) return null;
							result.unshift(firstDigit);
							var middlePattern = this._findPattern(MIDDLE_PATTERN, outCode.end, true, false);
							if (middlePattern === null || !middlePattern.end) return null;
							decodedCodes.push(middlePattern);
							for (var _i = 0; _i < 6; _i++) {
								middlePattern = this._decodeCode(middlePattern.end, CODE_G_START);
								if (!middlePattern) return null;
								decodedCodes.push(middlePattern);
								result.push(middlePattern.code);
							}
							return middlePattern;
						}
					},
					{
						key: "_verifyTrailingWhitespace",
						value: function _verifyTrailingWhitespace(endInfo) {
							var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start);
							if (trailingWhitespaceEnd < this._row.length) {
								if (this._matchRange(endInfo.end, trailingWhitespaceEnd, 0)) return endInfo;
							}
							return null;
						}
					},
					{
						key: "_findEnd",
						value: function _findEnd(offset, isWhite) {
							var endInfo = this._findPattern(this.STOP_PATTERN, offset, isWhite, false);
							return endInfo !== null ? this._verifyTrailingWhitespace(endInfo) : null;
						}
					},
					{
						key: "_checksum",
						value: function _checksum(result) {
							var sum = 0;
							for (var i = result.length - 2; i >= 0; i -= 2) sum += result[i];
							sum *= 3;
							for (var _i2 = result.length - 1; _i2 >= 0; _i2 -= 2) sum += result[_i2];
							return sum % 10 === 0;
						}
					},
					{
						key: "_decodeExtensions",
						value: function _decodeExtensions(offset) {
							var start = this._nextSet(this._row, offset);
							var startInfo = this._findPattern(EXTENSION_START_PATTERN, start, false, false);
							if (startInfo === null) return null;
							for (var i = 0; i < this.supplements.length; i++) try {
								var result = this.supplements[i].decode(this._row, startInfo.end);
								if (result !== null) return {
									code: result.code,
									start,
									startInfo,
									end: result.end,
									decodedCodes: result.decodedCodes,
									format: this.supplements[i].FORMAT
								};
							} catch (err) {
								console.error("* decodeExtensions error in ", this.supplements[i], ": ", err);
							}
							return null;
						}
					},
					{
						key: "decode",
						value: function decode(row, start) {
							var result = new Array();
							var decodedCodes = new Array();
							var resultInfo = {};
							var startInfo = this._findStart();
							if (!startInfo) return null;
							var code = {
								start: startInfo.start,
								end: startInfo.end
							};
							decodedCodes.push(code);
							code = this._decodePayload(code, result, decodedCodes);
							if (!code) return null;
							code = this._findEnd(code.end, false);
							if (!code) return null;
							decodedCodes.push(code);
							if (!this._checksum(result)) return null;
							if (this.supplements.length > 0) {
								var supplement = this._decodeExtensions(code.end);
								if (!supplement) return null;
								if (!supplement.decodedCodes) return null;
								var lastCode = supplement.decodedCodes[supplement.decodedCodes.length - 1];
								var endInfo = {
									start: lastCode.start + ((lastCode.end - lastCode.start) / 2 | 0),
									end: lastCode.end
								};
								if (!this._verifyTrailingWhitespace(endInfo)) return null;
								resultInfo = {
									supplement,
									code: result.join("") + supplement.code
								};
							}
							return _objectSpread(_objectSpread({
								code: result.join(""),
								start: startInfo.start,
								end: code.end,
								startInfo,
								decodedCodes
							}, resultInfo), {}, { format: this.FORMAT });
						}
					}
				]);
			}(barcode_reader);
			function ean_2_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, ean_2_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function ean_2_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (ean_2_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var ean_2_reader = /* @__PURE__ */ function(_EANReader) {
				function EAN2Reader() {
					var _this;
					classCallCheck_default()(this, EAN2Reader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = ean_2_reader_callSuper(this, EAN2Reader, [].concat(args));
					defineProperty_default()(_this, "FORMAT", "ean_2");
					return _this;
				}
				inherits_default()(EAN2Reader, _EANReader);
				return createClass_default()(EAN2Reader, [{
					key: "decode",
					value: function decode(row, start) {
						if (row) this._row = row;
						var codeFrequency = 0;
						var offset = start;
						var end = this._row.length;
						var result = [];
						var decodedCodes = [];
						var code = null;
						if (offset === void 0) return null;
						for (var i = 0; i < 2 && offset < end; i++) {
							code = this._decodeCode(offset);
							if (!code) return null;
							decodedCodes.push(code);
							result.push(code.code % 10);
							if (code.code >= CODE_G_START) codeFrequency |= 1 << 1 - i;
							if (i !== 1) {
								offset = this._nextSet(this._row, code.end);
								offset = this._nextUnset(this._row, offset);
							}
						}
						if (result.length !== 2 || parseInt(result.join("")) % 4 !== codeFrequency) return null;
						var startInfo = this._findStart();
						return {
							code: result.join(""),
							decodedCodes,
							end: code.end,
							format: this.FORMAT,
							startInfo,
							start: startInfo.start
						};
					}
				}]);
			}(ean_reader);
			function ean_5_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, ean_5_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function ean_5_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (ean_5_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var CHECK_DIGIT_ENCODINGS = [
				24,
				20,
				18,
				17,
				12,
				6,
				3,
				10,
				9,
				5
			];
			function determineCheckDigit(codeFrequency) {
				for (var i = 0; i < 10; i++) if (codeFrequency === CHECK_DIGIT_ENCODINGS[i]) return i;
				return null;
			}
			function extensionChecksum(result) {
				var length = result.length;
				var sum = 0;
				for (var i = length - 2; i >= 0; i -= 2) sum += result[i];
				sum *= 3;
				for (var _i = length - 1; _i >= 0; _i -= 2) sum += result[_i];
				sum *= 3;
				return sum % 10;
			}
			var ean_5_reader = /* @__PURE__ */ function(_EANReader) {
				function EAN5Reader() {
					var _this;
					classCallCheck_default()(this, EAN5Reader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = ean_5_reader_callSuper(this, EAN5Reader, [].concat(args));
					defineProperty_default()(_this, "FORMAT", "ean_5");
					return _this;
				}
				inherits_default()(EAN5Reader, _EANReader);
				return createClass_default()(EAN5Reader, [{
					key: "decode",
					value: function decode(row, start) {
						if (start === void 0) return null;
						if (row) this._row = row;
						var codeFrequency = 0;
						var offset = start;
						var end = this._row.length;
						var code = null;
						var result = [];
						var decodedCodes = [];
						for (var i = 0; i < 5 && offset < end; i++) {
							code = this._decodeCode(offset);
							if (!code) return null;
							decodedCodes.push(code);
							result.push(code.code % 10);
							if (code.code >= CODE_G_START) codeFrequency |= 1 << 4 - i;
							if (i !== 4) {
								offset = this._nextSet(this._row, code.end);
								offset = this._nextUnset(this._row, offset);
							}
						}
						if (result.length !== 5) return null;
						if (extensionChecksum(result) !== determineCheckDigit(codeFrequency)) return null;
						var startInfo = this._findStart();
						return {
							code: result.join(""),
							decodedCodes,
							end: code.end,
							format: this.FORMAT,
							startInfo,
							start: startInfo.start
						};
					}
				}]);
			}(ean_reader);
			function ean_8_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, ean_8_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function ean_8_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (ean_8_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var ean_8_reader = /* @__PURE__ */ function(_EANReader) {
				function EAN8Reader() {
					var _this;
					classCallCheck_default()(this, EAN8Reader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = ean_8_reader_callSuper(this, EAN8Reader, [].concat(args));
					defineProperty_default()(_this, "FORMAT", "ean_8");
					return _this;
				}
				inherits_default()(EAN8Reader, _EANReader);
				return createClass_default()(EAN8Reader, [{
					key: "_decodePayload",
					value: function _decodePayload(inCode, result, decodedCodes) {
						var code = inCode;
						for (var i = 0; i < 4; i++) {
							code = this._decodeCode(code.end, CODE_G_START);
							if (!code) return null;
							result.push(code.code);
							decodedCodes.push(code);
						}
						code = this._findPattern(MIDDLE_PATTERN, code.end, true, false);
						if (code === null) return null;
						decodedCodes.push(code);
						for (var _i = 0; _i < 4; _i++) {
							code = this._decodeCode(code.end, CODE_G_START);
							if (!code) return null;
							decodedCodes.push(code);
							result.push(code.code);
						}
						return code;
					}
				}]);
			}(ean_reader);
			function i2of5_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, i2of5_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function i2of5_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (i2of5_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			function i2of5_reader_superPropGet(t, o, e, r) {
				var p = get_default()(getPrototypeOf_default()(1 & r ? t.prototype : t), o, e);
				return 2 & r && "function" == typeof p ? function(t) {
					return p.apply(e, t);
				} : p;
			}
			var i2of5_reader_N = 1;
			var i2of5_reader_W = 3;
			var i2of5_reader = /* @__PURE__ */ function(_BarcodeReader) {
				function I2of5Reader(opts) {
					var _this;
					classCallCheck_default()(this, I2of5Reader);
					_this = i2of5_reader_callSuper(this, I2of5Reader, [merge_default()({ normalizeBarSpaceWidth: false }, opts)]);
					defineProperty_default()(_this, "barSpaceRatio", [1, 1]);
					defineProperty_default()(_this, "SINGLE_CODE_ERROR", .78);
					defineProperty_default()(_this, "AVG_CODE_ERROR", .38);
					defineProperty_default()(_this, "START_PATTERN", [
						i2of5_reader_N,
						i2of5_reader_N,
						i2of5_reader_N,
						i2of5_reader_N
					]);
					defineProperty_default()(_this, "STOP_PATTERN", [
						i2of5_reader_N,
						i2of5_reader_N,
						i2of5_reader_W
					]);
					defineProperty_default()(_this, "CODE_PATTERN", [
						[
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_W,
							i2of5_reader_N
						],
						[
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_W
						],
						[
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_W
						],
						[
							i2of5_reader_W,
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_N
						],
						[
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_W
						],
						[
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_N
						],
						[
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_N
						],
						[
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_W
						],
						[
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_N
						],
						[
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_N,
							i2of5_reader_W,
							i2of5_reader_N
						]
					]);
					defineProperty_default()(_this, "MAX_CORRECTION_FACTOR", 5);
					defineProperty_default()(_this, "FORMAT", "i2of5");
					if (opts.normalizeBarSpaceWidth) {
						_this.SINGLE_CODE_ERROR = .38;
						_this.AVG_CODE_ERROR = .09;
					}
					_this.config = opts;
					return possibleConstructorReturn_default()(_this, _this);
				}
				inherits_default()(I2of5Reader, _BarcodeReader);
				return createClass_default()(I2of5Reader, [
					{
						key: "_matchPattern",
						value: function _matchPattern(counter, code) {
							if (this.config.normalizeBarSpaceWidth) {
								var counterSum = [0, 0];
								var codeSum = [0, 0];
								var correction = [0, 0];
								var correctionRatio = this.MAX_CORRECTION_FACTOR;
								var correctionRatioInverse = 1 / correctionRatio;
								for (var i = 0; i < counter.length; i++) {
									counterSum[i % 2] += counter[i];
									codeSum[i % 2] += code[i];
								}
								correction[0] = codeSum[0] / counterSum[0];
								correction[1] = codeSum[1] / counterSum[1];
								correction[0] = Math.max(Math.min(correction[0], correctionRatio), correctionRatioInverse);
								correction[1] = Math.max(Math.min(correction[1], correctionRatio), correctionRatioInverse);
								this.barSpaceRatio = correction;
								for (var _i = 0; _i < counter.length; _i++) counter[_i] *= this.barSpaceRatio[_i % 2];
							}
							return i2of5_reader_superPropGet(I2of5Reader, "_matchPattern", this, 3)([counter, code]);
						}
					},
					{
						key: "_findPattern",
						value: function _findPattern(pattern, offset) {
							var isWhite = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
							var tryHarder = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
							var counter = new Array(pattern.length).fill(0);
							var counterPos = 0;
							var bestMatch = {
								error: Number.MAX_VALUE,
								start: 0,
								end: 0
							};
							var epsilon = this.AVG_CODE_ERROR;
							isWhite = isWhite || false;
							tryHarder = tryHarder || false;
							if (!offset) offset = this._nextSet(this._row);
							for (var i = offset; i < this._row.length; i++) if (this._row[i] ^ (isWhite ? 1 : 0)) counter[counterPos]++;
							else {
								if (counterPos === counter.length - 1) {
									var sum = counter.reduce(function(prev, next) {
										return prev + next;
									}, 0);
									var error = this._matchPattern(counter, pattern);
									if (error < epsilon) {
										bestMatch.error = error;
										bestMatch.start = i - sum;
										bestMatch.end = i;
										return bestMatch;
									}
									if (tryHarder) {
										for (var j = 0; j < counter.length - 2; j++) counter[j] = counter[j + 2];
										counter[counter.length - 2] = 0;
										counter[counter.length - 1] = 0;
										counterPos--;
									} else return null;
								} else counterPos++;
								counter[counterPos] = 1;
								isWhite = !isWhite;
							}
							return null;
						}
					},
					{
						key: "_findStart",
						value: function _findStart() {
							var leadingWhitespaceStart = 0;
							var offset = this._nextSet(this._row);
							var startInfo = null;
							var narrowBarWidth = 1;
							while (!startInfo) {
								startInfo = this._findPattern(this.START_PATTERN, offset, false, true);
								if (!startInfo) return null;
								narrowBarWidth = Math.floor((startInfo.end - startInfo.start) / 4);
								leadingWhitespaceStart = startInfo.start - narrowBarWidth * 10;
								if (leadingWhitespaceStart >= 0) {
									if (this._matchRange(leadingWhitespaceStart, startInfo.start, 0)) return startInfo;
								}
								offset = startInfo.end;
								startInfo = null;
							}
							return null;
						}
					},
					{
						key: "_verifyTrailingWhitespace",
						value: function _verifyTrailingWhitespace(endInfo) {
							var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start) / 2;
							if (trailingWhitespaceEnd < this._row.length) {
								if (this._matchRange(endInfo.end, trailingWhitespaceEnd, 0)) return endInfo;
							}
							return null;
						}
					},
					{
						key: "_findEnd",
						value: function _findEnd() {
							this._row.reverse();
							var endInfo = this._findPattern(this.STOP_PATTERN);
							this._row.reverse();
							if (endInfo === null) return null;
							var tmp = endInfo.start;
							endInfo.start = this._row.length - endInfo.end;
							endInfo.end = this._row.length - tmp;
							return endInfo !== null ? this._verifyTrailingWhitespace(endInfo) : null;
						}
					},
					{
						key: "_decodePair",
						value: function _decodePair(counterPair) {
							var codes = [];
							for (var i = 0; i < counterPair.length; i++) {
								var code = this._decodeCode(counterPair[i]);
								if (!code) return null;
								codes.push(code);
							}
							return codes;
						}
					},
					{
						key: "_decodeCode",
						value: function _decodeCode(counter) {
							var epsilon = this.AVG_CODE_ERROR;
							var bestMatch = {
								error: Number.MAX_VALUE,
								code: -1,
								start: 0,
								end: 0
							};
							for (var code = 0; code < this.CODE_PATTERN.length; code++) {
								var error = this._matchPattern(counter, this.CODE_PATTERN[code]);
								if (error < bestMatch.error) {
									bestMatch.code = code;
									bestMatch.error = error;
								}
							}
							if (bestMatch.error < epsilon) return bestMatch;
							return null;
						}
					},
					{
						key: "_decodePayload",
						value: function _decodePayload(counters, result, decodedCodes) {
							var pos = 0;
							var counterLength = counters.length;
							var counterPair = [[
								0,
								0,
								0,
								0,
								0
							], [
								0,
								0,
								0,
								0,
								0
							]];
							var codes = null;
							while (pos < counterLength) {
								for (var i = 0; i < 5; i++) {
									counterPair[0][i] = counters[pos] * this.barSpaceRatio[0];
									counterPair[1][i] = counters[pos + 1] * this.barSpaceRatio[1];
									pos += 2;
								}
								codes = this._decodePair(counterPair);
								if (!codes) return null;
								for (var _i2 = 0; _i2 < codes.length; _i2++) {
									result.push(codes[_i2].code + "");
									decodedCodes.push(codes[_i2]);
								}
							}
							return codes;
						}
					},
					{
						key: "_verifyCounterLength",
						value: function _verifyCounterLength(counters) {
							return counters.length % 10 === 0;
						}
					},
					{
						key: "decode",
						value: function decode(row, start) {
							var result = new Array();
							var decodedCodes = new Array();
							var startInfo = this._findStart();
							if (!startInfo) return null;
							decodedCodes.push(startInfo);
							var endInfo = this._findEnd();
							if (!endInfo) return null;
							var counters = this._fillCounters(startInfo.end, endInfo.start, false);
							if (!this._verifyCounterLength(counters)) return null;
							if (!this._decodePayload(counters, result, decodedCodes)) return null;
							if (result.length % 2 !== 0 || result.length < 6) return null;
							decodedCodes.push(endInfo);
							return {
								code: result.join(""),
								start: startInfo.start,
								end: endInfo.end,
								startInfo,
								decodedCodes,
								format: this.FORMAT
							};
						}
					}
				]);
			}(barcode_reader);
			function _createForOfIteratorHelper(r, e) {
				var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
				if (!t) {
					if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
						t && (r = t);
						var _n = 0, F = function F() {};
						return {
							s: F,
							n: function n() {
								return _n >= r.length ? { done: !0 } : {
									done: !1,
									value: r[_n++]
								};
							},
							e: function e(r) {
								throw r;
							},
							f: F
						};
					}
					throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
				}
				var o, a = !0, u = !1;
				return {
					s: function s() {
						t = t.call(r);
					},
					n: function n() {
						var r = t.next();
						return a = r.done, r;
					},
					e: function e(r) {
						u = !0, o = r;
					},
					f: function f() {
						try {
							a || null == t["return"] || t["return"]();
						} finally {
							if (u) throw o;
						}
					}
				};
			}
			function _unsupportedIterableToArray(r, a) {
				if (r) {
					if ("string" == typeof r) return _arrayLikeToArray(r, a);
					var t = {}.toString.call(r).slice(8, -1);
					return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
				}
			}
			function _arrayLikeToArray(r, a) {
				(null == a || a > r.length) && (a = r.length);
				for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
				return n;
			}
			function pharmacode_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, pharmacode_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function pharmacode_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (pharmacode_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			/**
			* Pharmacode (Pharmaceutical Binary Code) Reader
			*
			* Pharmacode is a binary barcode used in pharmaceutical packaging.
			* It encodes numbers from 3 to 131070 using narrow and wide bars.
			*
			* Encoding rules:
			* - Reading from right to left (least significant first)
			* - Narrow bar at position i adds 2^i to the value
			* - Wide bar at position i adds 2^(i+1) to the value
			* - Bars are separated by uniform-width spaces
			* - Minimum 2 bars, maximum 16 bars
			* - Valid range: 3 to 131070
			*
			* Example: Value 755
			* Binary representation of bars (from left to right in barcode):
			* wide, narrow, wide, narrow, narrow, wide, narrow, wide, narrow
			*
			* Reference: https://en.wikipedia.org/wiki/Pharmacode
			*/
			var MIN_BAR_COUNT = 2;
			var MAX_BAR_COUNT = 16;
			var MIN_VALUE = 3;
			var MAX_VALUE = 131070;
			var WIDE_BAR_THRESHOLD = 1.6;
			var MAX_SPACE_VARIANCE = .35;
			var MIN_QUIET_ZONE_WIDTHS = 1;
			var ALLOWED_WIDE_BAR_RATIOS = [
				2,
				2.5,
				3
			];
			var WIDE_BAR_RATIO_TOLERANCE = .05;
			var pharmacode_reader_PharmacodeReader = /*#__PURE__*/ function(_BarcodeReader) {
				function PharmacodeReader() {
					var _this;
					var config = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
					classCallCheck_default()(this, PharmacodeReader);
					_this = pharmacode_reader_callSuper(this, PharmacodeReader, [config]);
					defineProperty_default()(_this, "FORMAT", "pharmacode");
					defineProperty_default()(_this, "SINGLE_CODE_ERROR", .7);
					defineProperty_default()(_this, "AVG_CODE_ERROR", .48);
					return _this;
				}
				/**
				* Find the start of the barcode (first black bar after leading whitespace)
				* Public so that barcode_decoder can use it for tilted barcode validation
				*/
				inherits_default()(PharmacodeReader, _BarcodeReader);
				return createClass_default()(PharmacodeReader, [
					{
						key: "_findStart",
						value: function _findStart() {
							var minQuietZone = 20;
							var searchPos = 0;
							while (searchPos < this._row.length) {
								var barStart = this._nextSet(this._row, searchPos);
								if (barStart >= this._row.length) return null;
								var barEnd = barStart;
								while (barEnd < this._row.length && this._row[barEnd]) barEnd++;
								var barWidth = barEnd - barStart;
								if (barWidth < 5) {
									searchPos = barEnd + 1;
									continue;
								}
								var quietZoneStart = barStart - Math.max(barWidth * 2, minQuietZone);
								if (quietZoneStart < 0) {
									searchPos = barEnd + 1;
									continue;
								}
								if (!this._matchRange(quietZoneStart, barStart, 0)) {
									searchPos = barEnd + 1;
									continue;
								}
								var maxSpaceToNextBar = Math.max(barWidth * 10, 50);
								var nextBarStart = this._nextSet(this._row, barEnd);
								if (nextBarStart >= this._row.length) {
									searchPos = barEnd + 1;
									continue;
								}
								if (nextBarStart - barEnd > maxSpaceToNextBar) {
									searchPos = barEnd + 1;
									continue;
								}
								return {
									start: barStart,
									end: barEnd
								};
							}
							return null;
						}
					},
					{
						key: "_smoothBarWidths",
						value: function _smoothBarWidths(bars) {
							if (bars.length <= 2) return bars;
							var smoothed = bars.slice();
							for (var i = 1; i < smoothed.length - 1; i++) {
								var prev = smoothed[i - 1];
								var curr = smoothed[i];
								var median = [
									prev,
									curr,
									smoothed[i + 1]
								].sort(function(a, b) {
									return a - b;
								})[1];
								var deviation = Math.abs(curr - median);
								if (deviation > 0 && deviation <= 3) smoothed[i] = median;
							}
							return smoothed;
						}
					},
					{
						key: "_extractBarsAndSpaces",
						value: function _extractBarsAndSpaces(startPos) {
							var bars = [];
							var spaces = [];
							var pos = startPos;
							var currentWidth = 0;
							var foundTrailingQuietZone = false;
							while (pos < this._row.length && this._row[pos]) {
								currentWidth++;
								pos++;
							}
							if (currentWidth === 0) return null;
							bars.push(currentWidth);
							currentWidth = 0;
							while (pos < this._row.length && !this._row[pos]) {
								currentWidth++;
								pos++;
							}
							if (currentWidth === 0 || pos >= this._row.length) return null;
							spaces.push(currentWidth);
							var strictQuietZone = (bars[0] < spaces[0] ? bars[0] : spaces[0] * .8) * 6;
							var adaptiveQuietZone = spaces[0] * 2.5;
							while (pos < this._row.length && bars.length < MAX_BAR_COUNT) {
								currentWidth = 0;
								while (pos < this._row.length && this._row[pos]) {
									currentWidth++;
									pos++;
								}
								if (currentWidth === 0) break;
								bars.push(currentWidth);
								currentWidth = 0;
								var spaceStart = pos;
								while (pos < this._row.length && !this._row[pos]) {
									currentWidth++;
									pos++;
								}
								if (currentWidth === 0) break;
								if (currentWidth >= strictQuietZone) {
									foundTrailingQuietZone = true;
									pos = spaceStart;
									break;
								}
								if (bars.length >= MIN_BAR_COUNT && currentWidth >= adaptiveQuietZone) {
									foundTrailingQuietZone = true;
									pos = spaceStart;
									break;
								}
								if (pos >= this._row.length) {
									foundTrailingQuietZone = true;
									pos = spaceStart;
									break;
								}
								spaces.push(currentWidth);
								if (spaces.length >= 2) adaptiveQuietZone = spaces.reduce(function(a, b) {
									return a + b;
								}, 0) / spaces.length * 2;
							}
							if (!foundTrailingQuietZone) return null;
							if (bars.length < MIN_BAR_COUNT || bars.length > MAX_BAR_COUNT) return null;
							if (spaces.length !== bars.length - 1) return null;
							if (!this._validateSpaces(spaces)) return null;
							if (!this._validateBarSizeCount(bars)) return null;
							return {
								bars: this._smoothBarWidths(bars),
								spaces,
								end: pos
							};
						}
					},
					{
						key: "_validateBarSizeCount",
						value: function _validateBarSizeCount(bars) {
							if (bars.length === 0) return false;
							var tolerance = .35;
							var clusters = [];
							var _iterator = _createForOfIteratorHelper(bars), _step;
							try {
								for (_iterator.s(); !(_step = _iterator.n()).done;) {
									var bar = _step.value;
									var foundCluster = false;
									var _iterator2 = _createForOfIteratorHelper(clusters), _step2;
									try {
										for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
											var cluster = _step2.value;
											var clusterAvg = cluster.reduce(function(a, b) {
												return a + b;
											}, 0) / cluster.length;
											if (Math.abs(bar - clusterAvg) <= clusterAvg * tolerance) {
												cluster.push(bar);
												foundCluster = true;
												break;
											}
										}
									} catch (err) {
										_iterator2.e(err);
									} finally {
										_iterator2.f();
									}
									if (!foundCluster) clusters.push([bar]);
								}
							} catch (err) {
								_iterator.e(err);
							} finally {
								_iterator.f();
							}
							if (clusters.length > 2) return false;
							return true;
						}
					},
					{
						key: "_validateSpaces",
						value: function _validateSpaces(spaces) {
							if (spaces.length === 0) return true;
							var mean = spaces.reduce(function(a, b) {
								return a + b;
							}, 0) / spaces.length;
							if (mean === 0) return false;
							var variance = spaces.reduce(function(sum, s) {
								return sum + Math.pow(s - mean, 2);
							}, 0) / spaces.length;
							return Math.sqrt(variance) / mean <= MAX_SPACE_VARIANCE;
						}
					},
					{
						key: "_validateBarRatios",
						value: function _validateBarRatios(bars, spaces) {
							var avgAll = bars.reduce(function(a, b) {
								return a + b;
							}, 0) / bars.length;
							var varAll = bars.reduce(function(a, b) {
								return a + Math.abs(b - avgAll);
							}, 0) / bars.length;
							if ((avgAll === 0 ? 0 : varAll / avgAll) <= .1) {
								var avgSpace = spaces.length > 0 ? spaces.reduce(function(a, b) {
									return a + b;
								}, 0) / spaces.length : 0;
								if (avgSpace > 0) {
									if (avgSpace / avgAll < .7) return {
										narrowWidth: avgAll / 2.5,
										wideRatio: 2.5
									};
								}
								return {
									narrowWidth: avgAll,
									wideRatio: 2
								};
							}
							var sortedUnique = Array.from(new Set(bars.slice().sort(function(a, b) {
								return a - b;
							})));
							if (sortedUnique.length < 2) return {
								narrowWidth: bars.reduce(function(a, b) {
									return a + b;
								}, 0) / bars.length,
								wideRatio: 2
							};
							var candidates = [];
							for (var i = 0; i < sortedUnique.length - 1; i++) {
								var t = (sortedUnique[i] + sortedUnique[i + 1]) / 2;
								var n = [];
								var w = [];
								var _iterator3 = _createForOfIteratorHelper(bars), _step3;
								try {
									for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
										var b = _step3.value;
										if (b < t) n.push(b);
										else w.push(b);
									}
								} catch (err) {
									_iterator3.e(err);
								} finally {
									_iterator3.f();
								}
								if (n.length === 0 || w.length === 0) continue;
								var avgN = n.reduce(function(a, b) {
									return a + b;
								}, 0) / n.length;
								var avgW = w.reduce(function(a, b) {
									return a + b;
								}, 0) / w.length;
								var ratio = avgW / avgN;
								var bestRatio = ALLOWED_WIDE_BAR_RATIOS[0];
								var bestDiff = Math.abs(ratio - bestRatio);
								for (var _i = 0, _ALLOWED_WIDE_BAR_RAT = ALLOWED_WIDE_BAR_RATIOS; _i < _ALLOWED_WIDE_BAR_RAT.length; _i++) {
									var r = _ALLOWED_WIDE_BAR_RAT[_i];
									var d = Math.abs(ratio - r);
									if (d < bestDiff) {
										bestDiff = d;
										bestRatio = r;
									}
								}
								candidates.push({
									threshold: t,
									narrowBars: n,
									wideBars: w,
									avgN,
									avgW,
									ratio,
									ratioDiff: bestDiff,
									matchedRatio: bestRatio
								});
							}
							candidates.sort(function(a, b) {
								return a.ratioDiff - b.ratioDiff;
							});
							for (var _i2 = 0, _candidates = candidates; _i2 < _candidates.length; _i2++) {
								var c = _candidates[_i2];
								var tolerance = c.matchedRatio * WIDE_BAR_RATIO_TOLERANCE;
								if (Math.abs(c.ratio - c.matchedRatio) > tolerance) continue;
								var narrowTolerance = c.avgN * .15;
								var wideTolerance = c.avgW * .15;
								var ok = true;
								var _iterator4 = _createForOfIteratorHelper(c.narrowBars), _step4;
								try {
									for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
										var _b = _step4.value;
										if (Math.abs(_b - c.avgN) > narrowTolerance) {
											ok = false;
											break;
										}
									}
								} catch (err) {
									_iterator4.e(err);
								} finally {
									_iterator4.f();
								}
								if (!ok) continue;
								var _iterator5 = _createForOfIteratorHelper(c.wideBars), _step5;
								try {
									for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
										var _b2 = _step5.value;
										if (Math.abs(_b2 - c.avgW) > wideTolerance) {
											ok = false;
											break;
										}
									}
								} catch (err) {
									_iterator5.e(err);
								} finally {
									_iterator5.f();
								}
								if (!ok) continue;
								return {
									narrowWidth: c.avgN,
									wideRatio: c.matchedRatio
								};
							}
							return null;
						}
					},
					{
						key: "_validatePeriodicity",
						value: function _validatePeriodicity(bars, spaces) {
							if (bars.length > 0) {
								var barMean = bars.reduce(function(a, b) {
									return a + b;
								}, 0) / bars.length;
								var barVariance = bars.reduce(function(a, b) {
									return a + Math.pow(b - barMean, 2);
								}, 0) / bars.length;
								if ((barMean !== 0 ? Math.sqrt(barVariance) / barMean : 0) > .65) return false;
							}
							if (spaces.length > 0) {
								var spaceMean = spaces.reduce(function(a, b) {
									return a + b;
								}, 0) / spaces.length;
								var spaceVariance = spaces.reduce(function(a, b) {
									return a + Math.pow(b - spaceMean, 2);
								}, 0) / spaces.length;
								if ((spaceMean !== 0 ? Math.sqrt(spaceVariance) / spaceMean : 0) > .55) return false;
							}
							return true;
						}
					},
					{
						key: "_validateQuietZones",
						value: function _validateQuietZones(startInfo, narrowWidth, end) {
							var minQuietZone = narrowWidth * MIN_QUIET_ZONE_WIDTHS;
							if (startInfo.start >= 2 && startInfo.start < minQuietZone) return false;
							var remainingSpace = this._row.length - end;
							if (remainingSpace < 6) return true;
							if (remainingSpace < minQuietZone) return false;
							return true;
						}
					},
					{
						key: "_decodeBars",
						value: function _decodeBars(bars, narrowWidth) {
							var threshold = (narrowWidth !== null && narrowWidth !== void 0 ? narrowWidth : Math.min.apply(Math, toConsumableArray_default()(bars))) * WIDE_BAR_THRESHOLD;
							var value = 0;
							var reversedBars = bars.slice().reverse();
							for (var i = 0; i < reversedBars.length; i++) if (reversedBars[i] > threshold) value += Math.pow(2, i + 1);
							else value += Math.pow(2, i);
							var pattern = "";
							for (var _i3 = reversedBars.length - 1; _i3 >= 0; _i3--) pattern += reversedBars[_i3] > threshold ? "W" : "N";
							return {
								value,
								pattern
							};
						}
					},
					{
						key: "_verifyTrailingWhitespace",
						value: function _verifyTrailingWhitespace(end, barWidth) {
							var trailingWhitespaceEnd = Math.min(end + barWidth * 2, this._row.length);
							return this._matchRange(end, trailingWhitespaceEnd, 0);
						}
					},
					{
						key: "_validatePatternConsistency",
						value: function _validatePatternConsistency(startInfo, bars) {
							var originalStart = startInfo.start;
							var consistentOffsets = 0;
							var totalChecks = 0;
							for (var _i4 = 0, _arr = [
								-2,
								-1,
								1,
								2
							]; _i4 < _arr.length; _i4++) {
								var shiftedStart = originalStart + _arr[_i4];
								if (shiftedStart < 0 || shiftedStart >= this._row.length) continue;
								totalChecks++;
								var shiftedExtracted = this._extractBarsAndSpaces(shiftedStart);
								if (!shiftedExtracted) continue;
								if (shiftedExtracted.bars.length === bars.length) {
									var barsMatch = true;
									for (var i = 0; i < bars.length; i++) if (Math.abs(shiftedExtracted.bars[i] - bars[i]) / Math.max(bars[i], 1) > .25) {
										barsMatch = false;
										break;
									}
									if (barsMatch) consistentOffsets++;
								}
							}
							if (totalChecks > 0 && consistentOffsets >= totalChecks * .5) return true;
							return false;
						}
					},
					{
						key: "decode",
						value: function decode(row, start) {
							var startInfo = this._findStart();
							if (!startInfo) return null;
							if (startInfo.start > this._row.length * .5) return null;
							var extracted = this._extractBarsAndSpaces(startInfo.start);
							if (!extracted) return null;
							var bars = extracted.bars, spaces = extracted.spaces, end = extracted.end;
							if (bars.reduce(function(sum, w) {
								return sum + w;
							}, 0) + spaces.reduce(function(sum, w) {
								return sum + w;
							}, 0) < 20) return null;
							if (this._row.length - end < 0) return null;
							if (!this._validateSpaces(spaces)) return null;
							if (!this._validatePeriodicity(bars, spaces)) return null;
							if (!this._validatePatternConsistency(startInfo, bars)) return null;
							var ratioInfo = this._validateBarRatios(bars, spaces);
							if (!ratioInfo) return null;
							if (!this._validateQuietZones(startInfo, ratioInfo.narrowWidth, end)) return null;
							var decoded = this._decodeBars(bars, ratioInfo.narrowWidth);
							if (!decoded) return null;
							var value = decoded.value;
							if (value < MIN_VALUE || value > MAX_VALUE) return null;
							var avgBarWidth = bars.reduce(function(a, b) {
								return a + b;
							}, 0) / bars.length;
							if (!this._verifyTrailingWhitespace(end, avgBarWidth)) {}
							var decodedCodes = bars.map(function(width, index) {
								return {
									code: width > Math.min.apply(Math, toConsumableArray_default()(bars)) * WIDE_BAR_THRESHOLD ? 1 : 0,
									start: 0,
									end: 0,
									error: 0
								};
							});
							return {
								code: value.toString(),
								start: startInfo.start,
								end,
								startInfo,
								decodedCodes,
								pattern: decoded.pattern,
								format: this.FORMAT
							};
						}
					}
				]);
			}(barcode_reader);
			defineProperty_default()(pharmacode_reader_PharmacodeReader, "adjacentLineValidationMatches", 1);
			var pharmacode_reader = pharmacode_reader_PharmacodeReader;
			function upc_e_reader_ownKeys(e, r) {
				var t = Object.keys(e);
				if (Object.getOwnPropertySymbols) {
					var o = Object.getOwnPropertySymbols(e);
					r && (o = o.filter(function(r) {
						return Object.getOwnPropertyDescriptor(e, r).enumerable;
					})), t.push.apply(t, o);
				}
				return t;
			}
			function upc_e_reader_objectSpread(e) {
				for (var r = 1; r < arguments.length; r++) {
					var t = null != arguments[r] ? arguments[r] : {};
					r % 2 ? upc_e_reader_ownKeys(Object(t), !0).forEach(function(r) {
						defineProperty_default()(e, r, t[r]);
					}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : upc_e_reader_ownKeys(Object(t)).forEach(function(r) {
						Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
					});
				}
				return e;
			}
			function upc_e_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, upc_e_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function upc_e_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (upc_e_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			function upc_e_reader_superPropGet(t, o, e, r) {
				var p = get_default()(getPrototypeOf_default()(1 & r ? t.prototype : t), o, e);
				return 2 & r && "function" == typeof p ? function(t) {
					return p.apply(e, t);
				} : p;
			}
			var upc_e_reader = /* @__PURE__ */ function(_EANReader) {
				function UPCEReader() {
					var _this;
					classCallCheck_default()(this, UPCEReader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = upc_e_reader_callSuper(this, UPCEReader, [].concat(args));
					defineProperty_default()(_this, "CODE_FREQUENCY", [[
						56,
						52,
						50,
						49,
						44,
						38,
						35,
						42,
						41,
						37
					], [
						7,
						11,
						13,
						14,
						19,
						25,
						28,
						21,
						22,
						26
					]]);
					defineProperty_default()(_this, "STOP_PATTERN", [
						1 / 6 * 7,
						1 / 6 * 7,
						1 / 6 * 7,
						1 / 6 * 7,
						1 / 6 * 7,
						1 / 6 * 7
					]);
					defineProperty_default()(_this, "FORMAT", "upc_e");
					return _this;
				}
				inherits_default()(UPCEReader, _EANReader);
				return createClass_default()(UPCEReader, [
					{
						key: "_decodePayload",
						value: function _decodePayload(inCode, result, decodedCodes) {
							var outCode = upc_e_reader_objectSpread({}, inCode);
							var codeFrequency = 0;
							for (var i = 0; i < 6; i++) {
								outCode = this._decodeCode(outCode.end);
								if (!outCode) return null;
								if (outCode.code >= CODE_G_START) {
									outCode.code = outCode.code - CODE_G_START;
									codeFrequency |= 1 << 5 - i;
								}
								result.push(outCode.code);
								decodedCodes.push(outCode);
							}
							if (!this._determineParity(codeFrequency, result)) return null;
							return outCode;
						}
					},
					{
						key: "_determineParity",
						value: function _determineParity(codeFrequency, result) {
							for (var nrSystem = 0; nrSystem < this.CODE_FREQUENCY.length; nrSystem++) for (var i = 0; i < this.CODE_FREQUENCY[nrSystem].length; i++) if (codeFrequency === this.CODE_FREQUENCY[nrSystem][i]) {
								result.unshift(nrSystem);
								result.push(i);
								return true;
							}
							return false;
						}
					},
					{
						key: "_convertToUPCA",
						value: function _convertToUPCA(result) {
							var upca = [result[0]];
							var lastDigit = result[result.length - 2];
							if (lastDigit <= 2) upca = upca.concat(result.slice(1, 3)).concat([
								lastDigit,
								0,
								0,
								0,
								0
							]).concat(result.slice(3, 6));
							else if (lastDigit === 3) upca = upca.concat(result.slice(1, 4)).concat([
								0,
								0,
								0,
								0,
								0
							]).concat(result.slice(4, 6));
							else if (lastDigit === 4) upca = upca.concat(result.slice(1, 5)).concat([
								0,
								0,
								0,
								0,
								0,
								result[5]
							]);
							else upca = upca.concat(result.slice(1, 6)).concat([
								0,
								0,
								0,
								0,
								lastDigit
							]);
							upca.push(result[result.length - 1]);
							return upca;
						}
					},
					{
						key: "_checksum",
						value: function _checksum(result) {
							return upc_e_reader_superPropGet(UPCEReader, "_checksum", this, 3)([this._convertToUPCA(result)]);
						}
					},
					{
						key: "_findEnd",
						value: function _findEnd(offset, isWhite) {
							return upc_e_reader_superPropGet(UPCEReader, "_findEnd", this, 3)([offset, true]);
						}
					},
					{
						key: "_verifyTrailingWhitespace",
						value: function _verifyTrailingWhitespace(endInfo) {
							var trailingWhitespaceEnd = endInfo.end + (endInfo.end - endInfo.start) / 2;
							if (trailingWhitespaceEnd < this._row.length) {
								if (this._matchRange(endInfo.end, trailingWhitespaceEnd, 0)) return endInfo;
							}
							return null;
						}
					}
				]);
			}(ean_reader);
			function upc_reader_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, upc_reader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function upc_reader_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (upc_reader_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var upc_reader = /* @__PURE__ */ function(_EANReader) {
				function UPCReader() {
					var _this;
					classCallCheck_default()(this, UPCReader);
					for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
					_this = upc_reader_callSuper(this, UPCReader, [].concat(args));
					defineProperty_default()(_this, "FORMAT", "upc_a");
					return _this;
				}
				inherits_default()(UPCReader, _EANReader);
				return createClass_default()(UPCReader, [{
					key: "decode",
					value: function decode(row, start) {
						var result = ean_reader.prototype.decode.call(this);
						if (result && result.code && result.code.length === 13 && result.code.charAt(0) === "0") {
							result.code = result.code.substring(1);
							return result;
						}
						return null;
					}
				}]);
			}(ean_reader);
			var Bresenham = {};
			var Slope = { DIR: {
				UP: 1,
				DOWN: -1
			} };
			/**
			* Scans a line of the given image from point p1 to p2 and returns a result object containing
			* gray-scale values (0-255) of the underlying pixels in addition to the min
			* and max values.
			* @param {Object} imageWrapper
			* @param {Object} p1 The start point {x,y}
			* @param {Object} p2 The end point {x,y}
			* @returns {line, min, max}
			*/
			Bresenham.getBarcodeLine = function(imageWrapper, p1, p2) {
				var x0 = p1.x | 0;
				var y0 = p1.y | 0;
				var x1 = p2.x | 0;
				var y1 = p2.y | 0;
				var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
				var error;
				var y;
				var tmp;
				var x;
				var line = [];
				var imageData = imageWrapper.data;
				var width = imageWrapper.size.x;
				var val;
				var min = 255;
				var max = 0;
				function read(a, b) {
					val = imageData[b * width + a];
					min = val < min ? val : min;
					max = val > max ? val : max;
					line.push(val);
				}
				if (steep) {
					tmp = x0;
					x0 = y0;
					y0 = tmp;
					tmp = x1;
					x1 = y1;
					y1 = tmp;
				}
				if (x0 > x1) {
					tmp = x0;
					x0 = x1;
					x1 = tmp;
					tmp = y0;
					y0 = y1;
					y1 = tmp;
				}
				var deltaX = x1 - x0;
				var deltaY = Math.abs(y1 - y0);
				error = deltaX / 2 | 0;
				y = y0;
				var yStep = y0 < y1 ? 1 : -1;
				for (x = x0; x < x1; x++) {
					if (steep) read(y, x);
					else read(x, y);
					error -= deltaY;
					if (error < 0) {
						y += yStep;
						error += deltaX;
					}
				}
				return {
					line,
					min,
					max
				};
			};
			/**
			* Converts the result from getBarcodeLine into a binary representation
			* also considering the frequency and slope of the signal for more robust results
			* @param {Object} result {line, min, max}
			*/
			Bresenham.toBinaryLine = function(result) {
				var min = result.min;
				var max = result.max;
				var line = result.line;
				var slope;
				var slope2;
				var center = min + (max - min) / 2;
				var extrema = [];
				var currentDir;
				var dir;
				var threshold = (max - min) / 12;
				var rThreshold = -threshold;
				var i;
				var j;
				currentDir = line[0] > center ? Slope.DIR.UP : Slope.DIR.DOWN;
				extrema.push({
					pos: 0,
					val: line[0]
				});
				for (i = 0; i < line.length - 2; i++) {
					slope = line[i + 1] - line[i];
					slope2 = line[i + 2] - line[i + 1];
					if (slope + slope2 < rThreshold && line[i + 1] < center * 1.5) dir = Slope.DIR.DOWN;
					else if (slope + slope2 > threshold && line[i + 1] > center * .5) dir = Slope.DIR.UP;
					else dir = currentDir;
					if (currentDir !== dir) {
						extrema.push({
							pos: i,
							val: line[i]
						});
						currentDir = dir;
					}
				}
				extrema.push({
					pos: line.length,
					val: line[line.length - 1]
				});
				for (j = extrema[0].pos; j < extrema[1].pos; j++) line[j] = line[j] > center ? 0 : 1;
				for (i = 1; i < extrema.length - 1; i++) {
					if (extrema[i + 1].val > extrema[i].val) threshold = extrema[i].val + (extrema[i + 1].val - extrema[i].val) / 3 * 2 | 0;
					else threshold = extrema[i + 1].val + (extrema[i].val - extrema[i + 1].val) / 3 | 0;
					for (j = extrema[i].pos; j < extrema[i + 1].pos; j++) line[j] = line[j] > threshold ? 0 : 1;
				}
				return {
					line,
					threshold
				};
			};
			/**
			* Used for development only
			*/
			Bresenham.debug = {
				printFrequency: function printFrequency(line, canvas) {
					var i;
					var ctx = canvas.getContext("2d");
					canvas.width = line.length;
					canvas.height = 256;
					ctx.beginPath();
					ctx.strokeStyle = "blue";
					for (i = 0; i < line.length; i++) {
						ctx.moveTo(i, 255);
						ctx.lineTo(i, 255 - line[i]);
					}
					ctx.stroke();
					ctx.closePath();
				},
				printPattern: function printPattern(line, canvas) {
					var ctx = canvas.getContext("2d");
					var i;
					canvas.width = line.length;
					ctx.fillColor = "black";
					for (i = 0; i < line.length; i++) if (line[i] === 1) ctx.fillRect(i, 0, 1, 100);
				}
			};
			var bresenham = Bresenham;
			function barcode_decoder_createForOfIteratorHelper(r, e) {
				var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
				if (!t) {
					if (Array.isArray(r) || (t = barcode_decoder_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
						t && (r = t);
						var _n = 0, F = function F() {};
						return {
							s: F,
							n: function n() {
								return _n >= r.length ? { done: !0 } : {
									done: !1,
									value: r[_n++]
								};
							},
							e: function e(r) {
								throw r;
							},
							f: F
						};
					}
					throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
				}
				var o, a = !0, u = !1;
				return {
					s: function s() {
						t = t.call(r);
					},
					n: function n() {
						var r = t.next();
						return a = r.done, r;
					},
					e: function e(r) {
						u = !0, o = r;
					},
					f: function f() {
						try {
							a || null == t["return"] || t["return"]();
						} finally {
							if (u) throw o;
						}
					}
				};
			}
			function barcode_decoder_unsupportedIterableToArray(r, a) {
				if (r) {
					if ("string" == typeof r) return barcode_decoder_arrayLikeToArray(r, a);
					var t = {}.toString.call(r).slice(8, -1);
					return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? barcode_decoder_arrayLikeToArray(r, a) : void 0;
				}
			}
			function barcode_decoder_arrayLikeToArray(r, a) {
				(null == a || a > r.length) && (a = r.length);
				for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
				return n;
			}
			/**
			* Barcode Decoder Module
			*
			* This module handles the decoding of barcodes using configured readers.
			*
			* READER ORDER GUARANTEE:
			* Readers are processed in the exact order they are specified in the `readers`
			* config array. The first reader to successfully decode the barcode wins.
			*
			* Example:
			*   readers: ['ean_reader', 'upc_e_reader', 'code_128_reader']
			*
			* Decoding order:
			*   1. ean_reader attempts to decode
			*   2. If ean_reader returns null, upc_e_reader attempts to decode
			*   3. If upc_e_reader returns null, code_128_reader attempts to decode
			*   4. First non-null result is returned
			*
			* EXTERNAL READERS:
			* External readers must be registered via registerReader() before use.
			* Once registered, they follow the same ordering rules as built-in readers.
			* Their position in the `readers` array determines their priority.
			*
			* To prioritize an external reader:
			*   Quagga.registerReader('my_reader', MyReader);
			*   config.decoder.readers = ['my_reader', 'ean_reader']; // my_reader tried first
			*/
			var READERS = {
				code_128_reader,
				ean_reader,
				ean_5_reader,
				ean_2_reader,
				ean_8_reader,
				code_39_reader,
				code_39_vin_reader,
				codabar_reader,
				upc_reader,
				upc_e_reader,
				i2of5_reader,
				"2of5_reader": _2of5_reader,
				code_93_reader,
				code_32_reader,
				pharmacode_reader
			};
			var barcode_decoder = {
				/**
				* Registers an external/custom barcode reader.
				* Once registered, the reader can be used in config.readers array.
				* The reader's position in config.readers determines its decoding priority.
				*
				* @param name - The identifier to use in config.readers (e.g., 'my_custom_reader')
				* @param reader - The reader class (must extend BarcodeReader)
				*
				* @example
				* // Register a custom reader
				* BarcodeDecoder.registerReader('my_reader', MyCustomReader);
				*
				* // Use it with high priority (first in array)
				* config.decoder.readers = ['my_reader', 'ean_reader', 'code_128_reader'];
				*/
				registerReader: function registerReader(name, reader) {
					READERS[name] = reader;
				},
				create: function create(config, inputImageWrapper) {
					var _canvas = {
						ctx: {
							frequency: null,
							pattern: null,
							overlay: null
						},
						dom: {
							frequency: null,
							pattern: null,
							overlay: null
						}
					};
					var _barcodeReaders = [];
					initReaders();
					/**
					* Initializes barcode readers from config.readers array.
					* Readers are instantiated and stored in the order they appear in config,
					* which determines their decoding priority (first in array = highest priority).
					*/
					function initReaders() {
						config.readers.forEach(function(readerConfig) {
							var reader;
							var configuration = {};
							var supplements = [];
							if (typeof_default()(readerConfig) === "object") {
								reader = readerConfig.format;
								configuration = readerConfig.config;
							} else if (typeof readerConfig === "string") reader = readerConfig;
							if (configuration.supplements) supplements = configuration.supplements.map(function(supplement) {
								return new READERS[supplement]();
							});
							try {
								var readerObj = new READERS[reader](configuration, supplements);
								_barcodeReaders.push(readerObj);
							} catch (err) {
								console.error("* Error constructing reader ", reader, err);
								throw err;
							}
						});
					}
					/**
					* extend the line on both ends
					* @param {Array} line
					* @param {Number} angle
					*/
					function getExtendedLine(line, angle, ext) {
						function extendLine(amount) {
							var extension = {
								y: amount * Math.sin(angle),
								x: amount * Math.cos(angle)
							};
							line[0].y -= extension.y;
							line[0].x -= extension.x;
							line[1].y += extension.y;
							line[1].x += extension.x;
						}
						extendLine(ext);
						while (ext > 1 && (!inputImageWrapper.inImageWithBorder(line[0]) || !inputImageWrapper.inImageWithBorder(line[1]))) {
							ext -= Math.ceil(ext / 2);
							extendLine(-ext);
						}
						return line;
					}
					function getLine(box) {
						return [{
							x: (box[1][0] - box[0][0]) / 2 + box[0][0],
							y: (box[1][1] - box[0][1]) / 2 + box[0][1]
						}, {
							x: (box[3][0] - box[2][0]) / 2 + box[2][0],
							y: (box[3][1] - box[2][1]) / 2 + box[2][1]
						}];
					}
					/**
					* Validate that barcode position is stable across adjacent Y-scanlines.
					* Real barcodes have consistent start position; tilted barcodes shift left/right as Y changes.
					* @param {Array} line The original scan line [p1, p2]
					* @param {Object} result The successful decode result with .start position
					* @param {Object} reader The reader instance that succeeded
					* @param {Object} inputImageWrapper The full image data
					* @returns {boolean} true if barcode position is stable (≥1 adjacent Y-line matches)
					*/
					function validateAdjacentYLines(line, result, reader, inputImageWrapper) {
						var originalY = Math.round(line[1].y);
						var originalXStart = result.start;
						var constructorFn = reader.constructor;
						var requiredMatches = constructorFn && constructorFn.adjacentLineValidationMatches || 0;
						if (requiredMatches <= 0) return true;
						var matchCount = 0;
						var done = false;
						for (var _i = 0, _arr = [
							1,
							2,
							3
						]; _i < _arr.length; _i++) {
							var yOffset = _arr[_i];
							if (done) break;
							for (var _i2 = 0, _arr2 = [-1, 1]; _i2 < _arr2.length; _i2++) {
								var direction = _arr2[_i2];
								if (done) break;
								var newY = originalY + yOffset * direction;
								if (newY < 0 || newY >= inputImageWrapper.size.y) continue;
								var newP1 = {
									x: line[0].x,
									y: newY
								};
								var newP2 = {
									x: line[1].x,
									y: newY
								};
								try {
									var newBarcodeLine = bresenham.getBarcodeLine(inputImageWrapper, newP1, newP2);
									bresenham.toBinaryLine(newBarcodeLine);
									reader._row = newBarcodeLine.line;
									var startFound = reader._findStart();
									if (startFound !== null && startFound.start === originalXStart) {
										matchCount++;
										if (matchCount >= requiredMatches) {
											done = true;
											break;
										}
									}
								} catch (e) {}
							}
						}
						return matchCount >= requiredMatches;
					}
					/**
					* Attempts to decode a barcode from a scan line.
					* Readers are tried in order (as specified in config.readers).
					* The first reader to return a non-null result wins.
					* @param {Array} line The scan line to decode
					* @returns {Object|null} Decoded result or null if no reader succeeded
					*/
					function tryDecode(line) {
						var result = null;
						var i;
						var barcodeLine = bresenham.getBarcodeLine(inputImageWrapper, line[0], line[1]);
						bresenham.toBinaryLine(barcodeLine);
						var successfulReaderIndex = -1;
						for (i = 0; i < _barcodeReaders.length && result === null; i++) {
							if (typeof _barcodeReaders[i].setImageWrapper === "function") _barcodeReaders[i].setImageWrapper(inputImageWrapper);
							result = _barcodeReaders[i].decodePattern(barcodeLine.line);
							if (result !== null) successfulReaderIndex = i;
						}
						if (result === null) return null;
						if (successfulReaderIndex >= 0 && _barcodeReaders[successfulReaderIndex] instanceof pharmacode_reader) {
							if (!validateAdjacentYLines(line, result, _barcodeReaders[successfulReaderIndex], inputImageWrapper)) return null;
						}
						return {
							codeResult: result,
							barcodeLine
						};
					}
					/**
					* This method slices the given area apart and tries to detect a barcode-pattern
					* for each slice. It returns the decoded barcode, or null if nothing was found
					* @param {Array} box
					* @param {Array} line
					* @param {Number} lineAngle
					*/
					function tryDecodeBruteForce(box, line, lineAngle) {
						var sideLength = Math.sqrt(Math.pow(box[1][0] - box[0][0], 2) + Math.pow(box[1][1] - box[0][1], 2));
						var i;
						var slices = 16;
						var result = null;
						var dir;
						var extension;
						var xdir = Math.sin(lineAngle);
						var ydir = Math.cos(lineAngle);
						for (i = 1; i < slices && result === null; i++) {
							dir = sideLength / slices * i * (i % 2 === 0 ? -1 : 1);
							extension = {
								y: dir * xdir,
								x: dir * ydir
							};
							line[0].y += extension.x;
							line[0].x -= extension.y;
							line[1].y += extension.x;
							line[1].x -= extension.y;
							result = tryDecode(line);
						}
						return result;
					}
					function getLineLength(line) {
						return Math.sqrt(Math.pow(Math.abs(line[1].y - line[0].y), 2) + Math.pow(Math.abs(line[1].x - line[0].x), 2));
					}
					/**
					* Decodes from a full image using readers that support image-based decoding.
					* Readers are tried in order (as specified in config.readers).
					* @param {Object} imageWrapper The image to decode
					* @returns {Object|null} Decoded result or null
					*/
					function _decodeFromImage2(_x) {
						return _decodeFromImage.apply(this, arguments);
					}
					/**
					* With the help of the configured readers (Code128 or EAN) this function tries to detect a
					* valid barcode pattern within the given area.
					* @param {Object} box The area to search in
					* @returns {Object} the result {codeResult, line, angle, pattern, threshold}
					*/
					function _decodeFromImage() {
						_decodeFromImage = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee2(imageWrapper) {
							var result, _iterator, _step, reader, _t;
							return regenerator_default.a.wrap(function(_context2) {
								while (1) switch (_context2.prev = _context2.next) {
									case 0:
										result = null;
										_iterator = barcode_decoder_createForOfIteratorHelper(_barcodeReaders);
										_context2.prev = 1;
										_iterator.s();
									case 2:
										if ((_step = _iterator.n()).done) {
											_context2.next = 5;
											break;
										}
										reader = _step.value;
										if (!reader.decodeImage) {
											_context2.next = 4;
											break;
										}
										_context2.next = 3;
										return reader.decodeImage(imageWrapper);
									case 3:
										result = _context2.sent;
										if (!result) {
											_context2.next = 4;
											break;
										}
										return _context2.abrupt("continue", 5);
									case 4:
										_context2.next = 2;
										break;
									case 5:
										_context2.next = 7;
										break;
									case 6:
										_context2.prev = 6;
										_t = _context2["catch"](1);
										_iterator.e(_t);
									case 7:
										_context2.prev = 7;
										_iterator.f();
										return _context2.finish(7);
									case 8: return _context2.abrupt("return", result);
									case 9:
									case "end": return _context2.stop();
								}
							}, _callee2, null, [[
								1,
								6,
								7,
								8
							]]);
						}));
						return _decodeFromImage.apply(this, arguments);
					}
					function _decodeFromBoundingBox(box) {
						var line;
						_canvas.ctx.overlay;
						var result;
						line = getLine(box);
						var lineLength = getLineLength(line);
						var lineAngle = Math.atan2(line[1].y - line[0].y, line[1].x - line[0].x);
						line = getExtendedLine(line, lineAngle, Math.floor(lineLength * .1));
						if (line === null) return null;
						result = tryDecode(line);
						if (result === null) result = tryDecodeBruteForce(box, line, lineAngle);
						if (result === null) return null;
						return {
							codeResult: result.codeResult,
							line,
							angle: lineAngle,
							pattern: result.barcodeLine.line,
							threshold: result.barcodeLine.threshold
						};
					}
					return {
						decodeFromBoundingBox: function decodeFromBoundingBox(box) {
							return _decodeFromBoundingBox(box);
						},
						decodeFromBoundingBoxes: function decodeFromBoundingBoxes(boxes) {
							var i;
							var result;
							var barcodes = [];
							var multiple = config.multiple;
							for (i = 0; i < boxes.length; i++) {
								var box = boxes[i];
								result = _decodeFromBoundingBox(box) || {};
								result.box = box;
								if (multiple) barcodes.push(result);
								else if (result.codeResult) return result;
							}
							return { barcodes };
						},
						decodeFromImage: function decodeFromImage(imageWrapperIn) {
							return asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee() {
								var result;
								return regenerator_default.a.wrap(function(_context) {
									while (1) switch (_context.prev = _context.next) {
										case 0:
											_context.next = 1;
											return _decodeFromImage2(imageWrapperIn);
										case 1:
											result = _context.sent;
											return _context.abrupt("return", result);
										case 2:
										case "end": return _context.stop();
									}
								}, _callee);
							}))();
						},
						registerReader: function registerReader(name, reader) {
							if (READERS[name]) throw new Error("cannot register existing reader", name);
							READERS[name] = reader;
						},
						setReaders: function setReaders(readers) {
							config.readers = readers;
							_barcodeReaders.length = 0;
							initReaders();
						}
					};
				}
			};
			var events = (function EventInterface() {
				var events = {};
				function getEvent(eventName) {
					if (!events[eventName]) events[eventName] = { subscribers: [] };
					return events[eventName];
				}
				function clearEvents() {
					events = {};
				}
				function publishSubscription(subscription, data) {
					if (subscription.async) setTimeout(function() {
						subscription.callback(data);
					}, 4);
					else subscription.callback(data);
				}
				function _subscribe(event, callback, async) {
					var subscription;
					if (typeof callback === "function") subscription = {
						callback,
						async
					};
					else {
						subscription = callback;
						if (!subscription.callback) throw new Error("Callback was not specified on options");
					}
					getEvent(event).subscribers.push(subscription);
				}
				return {
					subscribe: function subscribe(event, callback, async) {
						return _subscribe(event, callback, async);
					},
					publish: function publish(eventName, data) {
						var event = getEvent(eventName);
						var subscribers = event.subscribers;
						subscribers.filter(function(subscriber) {
							return !!subscriber.once;
						}).forEach(function(subscriber) {
							publishSubscription(subscriber, data);
						});
						event.subscribers = subscribers.filter(function(subscriber) {
							return !subscriber.once;
						});
						event.subscribers.forEach(function(subscriber) {
							publishSubscription(subscriber, data);
						});
					},
					once: function once(event, callback) {
						_subscribe(event, {
							callback,
							async: arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false,
							once: true
						});
					},
					unsubscribe: function unsubscribe(eventName, callback) {
						if (eventName) {
							var _event = getEvent(eventName);
							if (_event && callback) _event.subscribers = _event.subscribers.filter(function(subscriber) {
								return subscriber.callback !== callback;
							});
							else _event.subscribers = [];
						} else clearEvents();
					}
				};
			})();
			var objectWithoutProperties = __webpack_require__(90);
			var objectWithoutProperties_default = /*#__PURE__*/ __webpack_require__.n(objectWithoutProperties);
			var omit = __webpack_require__(91);
			var omit_default = /*#__PURE__*/ __webpack_require__.n(omit);
			var wrapNativeSuper = __webpack_require__(92);
			var wrapNativeSuper_default = /*#__PURE__*/ __webpack_require__.n(wrapNativeSuper);
			function Exception_callSuper(t, o, e) {
				return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, Exception_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e));
			}
			function Exception_isNativeReflectConstruct() {
				try {
					var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
				} catch (t) {}
				return (Exception_isNativeReflectConstruct = function _isNativeReflectConstruct() {
					return !!t;
				})();
			}
			var Exception_Exception = /*#__PURE__*/ function(_Error) {
				function Exception(m, code) {
					var _this;
					classCallCheck_default()(this, Exception);
					_this = Exception_callSuper(this, Exception, [m]);
					defineProperty_default()(_this, "code", void 0);
					_this.code = code;
					Object.setPrototypeOf(_this, Exception.prototype);
					return _this;
				}
				/**
				* Custom JSON serialization to ensure error message is included.
				* The Error class's message property is non-enumerable by default,
				* so JSON.stringify would only include {code: -1} without this method.
				* This ensures consumers receive meaningful error information.
				*/
				inherits_default()(Exception, _Error);
				return createClass_default()(Exception, [{
					key: "toJSON",
					value: function toJSON() {
						return {
							name: this.name,
							message: this.message,
							code: this.code
						};
					}
				}]);
			}(/*#__PURE__*/ wrapNativeSuper_default()(Error));
			var ERROR_DESC = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
			function enumerateDevices() {
				try {
					return navigator.mediaDevices.enumerateDevices();
				} catch (err) {
					var error = new Exception_Exception("enumerateDevices is not defined. ".concat(ERROR_DESC), -1);
					return Promise.reject(error);
				}
			}
			function getUserMedia(constraints) {
				try {
					return navigator.mediaDevices.getUserMedia(constraints);
				} catch (err) {
					var error = new Exception_Exception("getUserMedia is not defined. ".concat(ERROR_DESC), -1);
					return Promise.reject(error);
				}
			}
			var _excluded = ["deviceId"];
			function camera_access_ownKeys(e, r) {
				var t = Object.keys(e);
				if (Object.getOwnPropertySymbols) {
					var o = Object.getOwnPropertySymbols(e);
					r && (o = o.filter(function(r) {
						return Object.getOwnPropertyDescriptor(e, r).enumerable;
					})), t.push.apply(t, o);
				}
				return t;
			}
			function camera_access_objectSpread(e) {
				for (var r = 1; r < arguments.length; r++) {
					var t = null != arguments[r] ? arguments[r] : {};
					r % 2 ? camera_access_ownKeys(Object(t), !0).forEach(function(r) {
						defineProperty_default()(e, r, t[r]);
					}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : camera_access_ownKeys(Object(t)).forEach(function(r) {
						Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
					});
				}
				return e;
			}
			function camera_access_createForOfIteratorHelper(r, e) {
				var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
				if (!t) {
					if (Array.isArray(r) || (t = camera_access_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
						t && (r = t);
						var _n = 0, F = function F() {};
						return {
							s: F,
							n: function n() {
								return _n >= r.length ? { done: !0 } : {
									done: !1,
									value: r[_n++]
								};
							},
							e: function e(r) {
								throw r;
							},
							f: F
						};
					}
					throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
				}
				var o, a = !0, u = !1;
				return {
					s: function s() {
						t = t.call(r);
					},
					n: function n() {
						var r = t.next();
						return a = r.done, r;
					},
					e: function e(r) {
						u = !0, o = r;
					},
					f: function f() {
						try {
							a || null == t["return"] || t["return"]();
						} finally {
							if (u) throw o;
						}
					}
				};
			}
			function camera_access_unsupportedIterableToArray(r, a) {
				if (r) {
					if ("string" == typeof r) return camera_access_arrayLikeToArray(r, a);
					var t = {}.toString.call(r).slice(8, -1);
					return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? camera_access_arrayLikeToArray(r, a) : void 0;
				}
			}
			function camera_access_arrayLikeToArray(r, a) {
				(null == a || a > r.length) && (a = r.length);
				for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
				return n;
			}
			var streamRef;
			function waitForVideo(video) {
				return new Promise(function(resolve, reject) {
					var attempts = 10;
					function checkVideo() {
						if (attempts > 0) if (video.videoWidth > 10 && video.videoHeight > 10) resolve();
						else window.setTimeout(checkVideo, 500);
						else reject(new Exception_Exception("Unable to play video stream. Is webcam working?", -1));
						attempts--;
					}
					checkVideo();
				});
			}
			/**
			* Tries to attach the camera-stream to a given video-element
			* and calls the callback function when the content is ready
			* @param {Object} constraints
			* @param {Object} video
			*/
			function initCamera(_x, _x2) {
				return _initCamera.apply(this, arguments);
			}
			function _initCamera() {
				_initCamera = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee4(video, constraints) {
					var stream;
					return regenerator_default.a.wrap(function(_context4) {
						while (1) switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 1;
								return getUserMedia(constraints);
							case 1:
								stream = _context4.sent;
								streamRef = stream;
								if (!video) {
									_context4.next = 2;
									break;
								}
								video.setAttribute("autoplay", "true");
								video.setAttribute("muted", "true");
								video.setAttribute("playsinline", "true");
								video.srcObject = stream;
								video.addEventListener("loadedmetadata", function() {
									video.play()["catch"](function(err) {
										console.warn("* Error while trying to play video stream:", err);
									});
								});
								return _context4.abrupt("return", waitForVideo(video));
							case 2: return _context4.abrupt("return", Promise.resolve());
							case 3:
							case "end": return _context4.stop();
						}
					}, _callee4);
				}));
				return _initCamera.apply(this, arguments);
			}
			function deprecatedConstraints(videoConstraints) {
				var normalized = omit_default()(videoConstraints, [
					"facing",
					"minAspectRatio",
					"maxAspectRatio"
				]);
				if (typeof videoConstraints.minAspectRatio !== "undefined" && videoConstraints.minAspectRatio > 0) {
					normalized.aspectRatio = videoConstraints.minAspectRatio;
					console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead");
				}
				if (typeof videoConstraints.facing !== "undefined") {
					normalized.facingMode = videoConstraints.facing;
					console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'");
				}
				return normalized;
			}
			function pickConstraints() {
				var video = deprecatedConstraints(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {});
				if (video && video.deviceId && video.facingMode) delete video.facingMode;
				return Promise.resolve({
					audio: false,
					video
				});
			}
			/**
			* Enumerates video input devices, optionally filtering by constraints.
			* @param videoConstraints Optional constraints to filter devices.
			* When provided, only devices that satisfy the given constraints will be returned.
			* This works by attempting to get a media stream for each device with the constraints
			* and returning only the devices that succeed.
			* @returns Promise resolving to an array of MediaDeviceInfo for video input devices.
			*/
			function enumerateVideoDevices(_x3) {
				return _enumerateVideoDevices.apply(this, arguments);
			}
			function _enumerateVideoDevices() {
				_enumerateVideoDevices = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee5(videoConstraints) {
					var devices, videoDevices, constrainedDevices, processedConstraints, constraintsWithoutDeviceId, _iterator, _step, device, constraints, stream, _t4;
					return regenerator_default.a.wrap(function(_context5) {
						while (1) switch (_context5.prev = _context5.next) {
							case 0:
								_context5.next = 1;
								return enumerateDevices();
							case 1:
								devices = _context5.sent;
								videoDevices = devices.filter(function(device) {
									return device.kind === "videoinput";
								});
								if (videoConstraints) {
									_context5.next = 2;
									break;
								}
								return _context5.abrupt("return", videoDevices);
							case 2:
								constrainedDevices = [];
								processedConstraints = deprecatedConstraints(videoConstraints);
								processedConstraints.deviceId, constraintsWithoutDeviceId = objectWithoutProperties_default()(processedConstraints, _excluded);
								_iterator = camera_access_createForOfIteratorHelper(videoDevices);
								_context5.prev = 3;
								_iterator.s();
							case 4:
								if ((_step = _iterator.n()).done) {
									_context5.next = 9;
									break;
								}
								device = _step.value;
								_context5.prev = 5;
								constraints = {
									audio: false,
									video: camera_access_objectSpread(camera_access_objectSpread({}, constraintsWithoutDeviceId), {}, { deviceId: { exact: device.deviceId } })
								};
								_context5.next = 6;
								return getUserMedia(constraints);
							case 6:
								stream = _context5.sent;
								stream.getTracks().forEach(function(track) {
									return track.stop();
								});
								constrainedDevices.push(device);
								_context5.next = 8;
								break;
							case 7:
								_context5.prev = 7;
								_context5["catch"](5);
							case 8:
								_context5.next = 4;
								break;
							case 9:
								_context5.next = 11;
								break;
							case 10:
								_context5.prev = 10;
								_t4 = _context5["catch"](3);
								_iterator.e(_t4);
							case 11:
								_context5.prev = 11;
								_iterator.f();
								return _context5.finish(11);
							case 12: return _context5.abrupt("return", constrainedDevices);
							case 13:
							case "end": return _context5.stop();
						}
					}, _callee5, null, [[
						3,
						10,
						11,
						12
					], [5, 7]]);
				}));
				return _enumerateVideoDevices.apply(this, arguments);
			}
			function getActiveTrack() {
				if (!streamRef) return null;
				var tracks = streamRef.getVideoTracks();
				return tracks && tracks !== null && tracks !== void 0 && tracks.length ? tracks[0] : null;
			}
			/**
			* Returns the active MediaStream, or null if no stream is active.
			* Use this when you need access to the full stream, for example to pass to WebRTC
			* or to clone the stream. For just the video track, use getActiveTrack() instead.
			* @returns The active MediaStream, or null if no camera is currently active.
			*/
			function getActiveStream() {
				var _streamRef;
				return (_streamRef = streamRef) !== null && _streamRef !== void 0 ? _streamRef : null;
			}
			/**
			* Used for accessing information about the active stream track and available video devices.
			*/
			var QuaggaJSCameraAccess = {
				requestedVideoElement: null,
				request: function request(video, videoConstraints) {
					return asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee() {
						var newConstraints;
						return regenerator_default.a.wrap(function(_context) {
							while (1) switch (_context.prev = _context.next) {
								case 0:
									QuaggaJSCameraAccess.requestedVideoElement = video;
									_context.next = 1;
									return pickConstraints(videoConstraints);
								case 1:
									newConstraints = _context.sent;
									return _context.abrupt("return", initCamera(video, newConstraints));
								case 2:
								case "end": return _context.stop();
							}
						}, _callee);
					}))();
				},
				release: function release() {
					var tracks = streamRef && streamRef.getVideoTracks();
					if (QuaggaJSCameraAccess.requestedVideoElement !== null) QuaggaJSCameraAccess.requestedVideoElement.pause();
					return new Promise(function(resolve) {
						setTimeout(function() {
							if (tracks && tracks.length) tracks.forEach(function(track) {
								return track.stop();
							});
							streamRef = null;
							QuaggaJSCameraAccess.requestedVideoElement = null;
							resolve();
						}, 0);
					});
				},
				enumerateVideoDevices,
				getActiveStream,
				getActiveStreamLabel: function getActiveStreamLabel() {
					var track = getActiveTrack();
					return track ? track.label : "";
				},
				getActiveTrack,
				disableTorch: function disableTorch() {
					return asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee2() {
						var track, _t;
						return regenerator_default.a.wrap(function(_context2) {
							while (1) switch (_context2.prev = _context2.next) {
								case 0:
									track = getActiveTrack();
									if (!track) {
										_context2.next = 4;
										break;
									}
									_context2.prev = 1;
									_context2.next = 2;
									return track.applyConstraints({ advanced: [{ torch: false }] });
								case 2:
									_context2.next = 4;
									break;
								case 3:
									_context2.prev = 3;
									_t = _context2["catch"](1);
									if (_t instanceof OverconstrainedError) console.warn("quagga2/CameraAccess: Torch not supported on this device");
									throw _t;
								case 4:
								case "end": return _context2.stop();
							}
						}, _callee2, null, [[1, 3]]);
					}))();
				},
				enableTorch: function enableTorch() {
					return asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee3() {
						var track, _t2;
						return regenerator_default.a.wrap(function(_context3) {
							while (1) switch (_context3.prev = _context3.next) {
								case 0:
									track = getActiveTrack();
									if (!track) {
										_context3.next = 4;
										break;
									}
									_context3.prev = 1;
									_context3.next = 2;
									return track.applyConstraints({ advanced: [{ torch: true }] });
								case 2:
									_context3.next = 4;
									break;
								case 3:
									_context3.prev = 3;
									_t2 = _context3["catch"](1);
									if (_t2 instanceof OverconstrainedError) console.warn("quagga2/CameraAccess: Torch not supported on this device");
									throw _t2;
								case 4:
								case "end": return _context3.stop();
							}
						}, _callee3, null, [[1, 3]]);
					}))();
				}
			};
			var camera_access = QuaggaJSCameraAccess;
			function contains(codeResult, list) {
				return list && list.some(function(item) {
					return Object.keys(item).every(function(key) {
						return item[key] === codeResult[key];
					});
				});
			}
			function passesFilter(codeResult, filter) {
				return typeof filter === "function" ? filter(codeResult) : true;
			}
			var result_collector = { create: function create(config) {
				var _config$capacity;
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d", { willReadFrequently: !!config.willReadFrequently });
				var results = [];
				var capacity = (_config$capacity = config.capacity) !== null && _config$capacity !== void 0 ? _config$capacity : 20;
				var capture = config.capture === true;
				function matchesConstraints(codeResult) {
					return !!capacity && codeResult && !contains(codeResult, config.blacklist) && passesFilter(codeResult, config.filter);
				}
				return {
					addResult: function addResult(data, imageSize, codeResult) {
						var result = {};
						if (matchesConstraints(codeResult)) {
							capacity--;
							result.codeResult = codeResult;
							if (capture) {
								canvas.width = imageSize.x;
								canvas.height = imageSize.y;
								image_debug.drawImage(data, imageSize, ctx);
								result.frame = canvas.toDataURL();
							}
							results.push(result);
						}
					},
					getResults: function getResults() {
						return results;
					}
				};
			} };
			var config_node = {
				inputStream: {
					type: "ImageStream",
					sequence: false,
					size: 800,
					area: {
						top: "0%",
						right: "0%",
						left: "0%",
						bottom: "0%"
					},
					singleChannel: false
				},
				locate: true,
				canvas: { createOverlay: true },
				decoder: { readers: ["code_128_reader"] },
				locator: {
					halfSample: true,
					patchSize: "medium"
				}
			};
			var config_config = function() {
				return config_node;
			}();
			var frame_grabber = __webpack_require__(93);
			var frame_grabber_default = /*#__PURE__*/ __webpack_require__.n(frame_grabber);
			var external_fs_ = __webpack_require__(94);
			var external_http_ = __webpack_require__(95);
			var external_https_ = __webpack_require__(96);
			var external_url_ = __webpack_require__(97);
			var external_ndarray_pixels_ = __webpack_require__(98);
			var input_stream = {
				createVideoStream: function createVideoStream() {
					throw new Error("createVideoStream not available");
				},
				createLiveStream: function createLiveStream() {
					throw new Error("createLiveStream not available");
				},
				createImageStream: function createImageStream() {
					var _config = null;
					var width = 0;
					var height = 0;
					var loaded = false;
					var frame = null;
					var baseUrl;
					var _ended = false;
					var calculatedWidth;
					var calculatedHeight;
					var _eventNames = ["canrecord", "ended"];
					var _eventHandlers = {};
					var _topRight = {
						x: 0,
						y: 0,
						type: "Point"
					};
					var _canvasSize = {
						x: 0,
						y: 0,
						type: "XYSize"
					};
					function loadImageData(_x) {
						return _loadImageData.apply(this, arguments);
					}
					function _loadImageData() {
						_loadImageData = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee(url) {
							return regenerator_default.a.wrap(function(_context) {
								while (1) switch (_context.prev = _context.next) {
									case 0: return _context.abrupt("return", new Promise(function(resolve, reject) {
										if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("data:")) {
											external_fs_["readFile"](url, function(err, data) {
												if (err) reject(err);
												else resolve(data);
											});
											return;
										}
										if (url.startsWith("data:")) {
											var matches = url.match(/^data:([^;]+);base64,(.+)$/);
											if (!matches) {
												reject(/* @__PURE__ */ new Error("Invalid data URL"));
												return;
											}
											resolve(Buffer.from(matches[2], "base64"));
											return;
										}
										(new external_url_["URL"](url).protocol === "https:" ? external_https_ : external_http_).get(url, function(response) {
											if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
												reject(new Error("Failed to fetch ".concat(url, ": ").concat(response.statusCode || "unknown status")));
												return;
											}
											var chunks = [];
											response.on("data", function(chunk) {
												return chunks.push(chunk);
											});
											response.on("end", function() {
												return resolve(Buffer.concat(chunks));
											});
											response.on("error", reject);
										}).on("error", reject);
									}));
									case 1:
									case "end": return _context.stop();
								}
							}, _callee);
						}));
						return _loadImageData.apply(this, arguments);
					}
					function loadImages() {
						return _loadImages.apply(this, arguments);
					}
					function _loadImages() {
						_loadImages = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee2() {
							var _config3, _config4, _config5, imageData, mimeType, uint8Data, pixels, _message, _pixels$shape, _t, _t2;
							return regenerator_default.a.wrap(function(_context2) {
								while (1) switch (_context2.prev = _context2.next) {
									case 0:
										loaded = false;
										_context2.prev = 1;
										_context2.next = 2;
										return loadImageData(baseUrl);
									case 2:
										imageData = _context2.sent;
										mimeType = "image/jpeg";
										if ((_config3 = _config) !== null && _config3 !== void 0 && _config3.mime) mimeType = _config.mime;
										else if (baseUrl.endsWith(".png")) mimeType = "image/png";
										else if (baseUrl.endsWith(".jpg") || baseUrl.endsWith(".jpeg")) mimeType = "image/jpeg";
										uint8Data = new Uint8Array(imageData.buffer, imageData.byteOffset, imageData.byteLength);
										_context2.prev = 3;
										_context2.next = 4;
										return Object(external_ndarray_pixels_["getPixels"])(uint8Data, mimeType);
									case 4:
										pixels = _context2.sent;
										_context2.next = 7;
										break;
									case 5:
										_context2.prev = 5;
										_t = _context2["catch"](3);
										if (!((_message = _t.message) !== null && _message !== void 0 && _message.includes("Cannot find module"))) {
											_context2.next = 6;
											break;
										}
										throw new Error("missing dependencies: npm install ndarray-pixels sharp");
									case 6: throw _t;
									case 7:
										loaded = true;
										frame = pixels;
										_pixels$shape = slicedToArray_default()(pixels.shape, 2);
										width = _pixels$shape[0];
										height = _pixels$shape[1];
										calculatedWidth = (_config4 = _config) !== null && _config4 !== void 0 && _config4.size ? width / height > 1 ? _config.size : Math.floor(width / height * _config.size) : width;
										calculatedHeight = (_config5 = _config) !== null && _config5 !== void 0 && _config5.size ? width / height > 1 ? Math.floor(height / width * _config.size) : _config.size : height;
										_canvasSize.x = calculatedWidth;
										_canvasSize.y = calculatedHeight;
										setTimeout(function() {
											publishEvent("canrecord", []);
										}, 0);
										_context2.next = 9;
										break;
									case 8:
										_context2.prev = 8;
										_t2 = _context2["catch"](1);
										console.error("**** quagga loadImages error:", _t2);
										throw new Error("error decoding pixels in loadImages");
									case 9:
									case "end": return _context2.stop();
								}
							}, _callee2, null, [[1, 8], [3, 5]]);
						}));
						return _loadImages.apply(this, arguments);
					}
					function publishEvent(eventName, args) {
						var handlers = _eventHandlers[eventName];
						if (handlers && handlers.length > 0) for (var j = 0; j < handlers.length; j++) handlers[j].apply(inputStream, args);
					}
					var inputStream = {
						trigger: publishEvent,
						getWidth: function getWidth() {
							return calculatedWidth;
						},
						getHeight: function getHeight() {
							return calculatedHeight;
						},
						setWidth: function setWidth(w) {
							calculatedWidth = w;
						},
						setHeight: function setHeight(h) {
							calculatedHeight = h;
						},
						getRealWidth: function getRealWidth() {
							return width;
						},
						getRealHeight: function getRealHeight() {
							return height;
						},
						setInputStream: function setInputStream(stream) {
							var _config2;
							_config = stream;
							baseUrl = (_config2 = _config) === null || _config2 === void 0 ? void 0 : _config2.src;
							loadImages()["catch"](function(err) {
								console.error("Failed to load images:", err);
							});
						},
						ended: function ended() {
							return _ended;
						},
						setAttribute: function setAttribute() {},
						getConfig: function getConfig() {
							return _config;
						},
						pause: function pause() {},
						play: function play() {},
						setCurrentTime: function setCurrentTime(time) {},
						addEventListener: function addEventListener(event, f) {
							if (_eventNames.indexOf(event) !== -1) {
								if (!_eventHandlers[event]) _eventHandlers[event] = [];
								_eventHandlers[event].push(f);
							}
						},
						clearEventHandlers: function clearEventHandlers() {
							Object.keys(_eventHandlers).forEach(function(ind) {
								return delete _eventHandlers[ind];
							});
						},
						setTopRight: function setTopRight(topRight) {
							_topRight.x = topRight.x;
							_topRight.y = topRight.y;
						},
						getTopRight: function getTopRight() {
							return _topRight;
						},
						setCanvasSize: function setCanvasSize(sz) {
							_canvasSize.x = sz.x;
							_canvasSize.y = sz.y;
						},
						getCanvasSize: function getCanvasSize() {
							return _canvasSize;
						},
						getFrame: function getFrame() {
							if (!loaded) return null;
							return frame;
						}
					};
					return inputStream;
				}
			};
			var locator_tracer = {
				searchDirections: [
					[0, 1],
					[1, 1],
					[1, 0],
					[1, -1],
					[0, -1],
					[-1, -1],
					[-1, 0],
					[-1, 1]
				],
				create: function create(imageWrapper, labelWrapper) {
					var imageData = imageWrapper.data;
					var labelData = labelWrapper.data;
					var searchDirections = this.searchDirections;
					var width = imageWrapper.size.x;
					var pos;
					function _trace(current, color, label, edgelabel) {
						var i;
						var y;
						var x;
						for (i = 0; i < searchDirections.length; i++) {
							y = current.cy + searchDirections[current.dir][0];
							x = current.cx + searchDirections[current.dir][1];
							pos = y * width + x;
							if (imageData[pos] === color && (labelData[pos] === 0 || labelData[pos] === label)) {
								labelData[pos] = label;
								current.cy = y;
								current.cx = x;
								return true;
							}
							if (labelData[pos] === 0) labelData[pos] = edgelabel;
							current.dir = (current.dir + 1) % 8;
						}
						return false;
					}
					function vertex2D(x, y, dir) {
						return {
							dir,
							x,
							y,
							next: null,
							prev: null
						};
					}
					function _contourTracing(sy, sx, label, color, edgelabel) {
						var Fv = null;
						var Cv;
						var P;
						var ldir;
						var current = {
							cx: sx,
							cy: sy,
							dir: 0
						};
						if (_trace(current, color, label, edgelabel)) {
							Fv = vertex2D(sx, sy, current.dir);
							Cv = Fv;
							ldir = current.dir;
							P = vertex2D(current.cx, current.cy, 0);
							P.prev = Cv;
							Cv.next = P;
							P.next = null;
							Cv = P;
							var totalPixelCount = imageWrapper.size.x * imageWrapper.size.y;
							var pixelCounter = 0;
							do {
								current.dir = (current.dir + 6) % 8;
								_trace(current, color, label, edgelabel);
								if (ldir !== current.dir) {
									Cv.dir = current.dir;
									P = vertex2D(current.cx, current.cy, 0);
									P.prev = Cv;
									Cv.next = P;
									P.next = null;
									Cv = P;
								} else {
									Cv.dir = ldir;
									Cv.x = current.cx;
									Cv.y = current.cy;
								}
								ldir = current.dir;
							} while ((current.cx !== sx || current.cy !== sy) && ++pixelCounter < totalPixelCount);
							Fv.prev = Cv.prev;
							Cv.prev.next = Fv;
						}
						return Fv;
					}
					return {
						trace: function trace(current, color, label, edgelabel) {
							return _trace(current, color, label, edgelabel);
						},
						contourTracing: function contourTracing(sy, sx, label, color, edgelabel) {
							return _contourTracing(sy, sx, label, color, edgelabel);
						}
					};
				}
			};
			/**
			* http://www.codeproject.com/Tips/407172/Connected-Component-Labeling-and-Vectorization
			*/
			var Rasterizer = {
				createContour2D: function createContour2D() {
					return {
						dir: null,
						index: null,
						firstVertex: null,
						insideContours: null,
						nextpeer: null,
						prevpeer: null
					};
				},
				CONTOUR_DIR: {
					CW_DIR: 0,
					CCW_DIR: 1,
					UNKNOWN_DIR: 2
				},
				DIR: {
					OUTSIDE_EDGE: -32767,
					INSIDE_EDGE: -32766
				},
				create: function create(imageWrapper, labelWrapper) {
					var imageData = imageWrapper.data;
					var labelData = labelWrapper.data;
					var width = imageWrapper.size.x;
					var height = imageWrapper.size.y;
					var tracer = locator_tracer.create(imageWrapper, labelWrapper);
					return {
						rasterize: function rasterize(depthlabel) {
							var color;
							var bc;
							var lc;
							var labelindex;
							var cx;
							var cy;
							var colorMap = [];
							var vertex;
							var p;
							var cc;
							var sc;
							var pos;
							var connectedCount = 0;
							var i;
							for (i = 0; i < 400; i++) colorMap[i] = 0;
							colorMap[0] = imageData[0];
							cc = null;
							for (cy = 1; cy < height - 1; cy++) {
								labelindex = 0;
								bc = colorMap[0];
								for (cx = 1; cx < width - 1; cx++) {
									pos = cy * width + cx;
									if (labelData[pos] === 0) {
										color = imageData[pos];
										if (color !== bc) if (labelindex === 0) {
											lc = connectedCount + 1;
											colorMap[lc] = color;
											bc = color;
											vertex = tracer.contourTracing(cy, cx, lc, color, Rasterizer.DIR.OUTSIDE_EDGE);
											if (vertex !== null) {
												connectedCount++;
												labelindex = lc;
												p = Rasterizer.createContour2D();
												p.dir = Rasterizer.CONTOUR_DIR.CW_DIR;
												p.index = labelindex;
												p.firstVertex = vertex;
												p.nextpeer = cc;
												p.insideContours = null;
												if (cc !== null) cc.prevpeer = p;
												cc = p;
											}
										} else {
											vertex = tracer.contourTracing(cy, cx, Rasterizer.DIR.INSIDE_EDGE, color, labelindex);
											if (vertex !== null) {
												p = Rasterizer.createContour2D();
												p.firstVertex = vertex;
												p.insideContours = null;
												if (depthlabel === 0) p.dir = Rasterizer.CONTOUR_DIR.CCW_DIR;
												else p.dir = Rasterizer.CONTOUR_DIR.CW_DIR;
												p.index = depthlabel;
												sc = cc;
												while (sc !== null && sc.index !== labelindex) sc = sc.nextpeer;
												if (sc !== null) {
													p.nextpeer = sc.insideContours;
													if (sc.insideContours !== null) sc.insideContours.prevpeer = p;
													sc.insideContours = p;
												}
											}
										}
										else labelData[pos] = labelindex;
									} else if (labelData[pos] === Rasterizer.DIR.OUTSIDE_EDGE || labelData[pos] === Rasterizer.DIR.INSIDE_EDGE) {
										labelindex = 0;
										if (labelData[pos] === Rasterizer.DIR.INSIDE_EDGE) bc = imageData[pos];
										else bc = colorMap[0];
									} else {
										labelindex = labelData[pos];
										bc = colorMap[labelindex];
									}
								}
							}
							sc = cc;
							while (sc !== null) {
								sc.index = depthlabel;
								sc = sc.nextpeer;
							}
							return {
								cc,
								count: connectedCount
							};
						},
						debug: { drawContour: function drawContour(canvas, firstContour) {
							var ctx = canvas.getContext("2d");
							var pq = firstContour;
							var iq;
							var q;
							var p;
							ctx.strokeStyle = "red";
							ctx.fillStyle = "red";
							ctx.lineWidth = 1;
							if (pq !== null) iq = pq.insideContours;
							else iq = null;
							while (pq !== null) {
								if (iq !== null) {
									q = iq;
									iq = iq.nextpeer;
								} else {
									q = pq;
									pq = pq.nextpeer;
									if (pq !== null) iq = pq.insideContours;
									else iq = null;
								}
								switch (q.dir) {
									case Rasterizer.CONTOUR_DIR.CW_DIR:
										ctx.strokeStyle = "red";
										break;
									case Rasterizer.CONTOUR_DIR.CCW_DIR:
										ctx.strokeStyle = "blue";
										break;
									case Rasterizer.CONTOUR_DIR.UNKNOWN_DIR:
										ctx.strokeStyle = "green";
										break;
								}
								p = q.firstVertex;
								ctx.beginPath();
								ctx.moveTo(p.x, p.y);
								do {
									p = p.next;
									ctx.lineTo(p.x, p.y);
								} while (p !== q.firstVertex);
								ctx.stroke();
							}
						} }
					};
				}
			};
			var locator_rasterizer = Rasterizer;
			/* @preserve ASM BEGIN */
			/**
			* Morphological skeletonization using iterative thinning algorithm.
			* Reduces binary images to single-pixel-wide skeletons while preserving topology.
			*
			* Memory layout in shared ArrayBuffer (4 regions of size²):
			* - Region 0: Working image (subImagePtr = 0)
			* - Region 1: Eroded result (erodedImagePtr = size²)
			* - Region 2: Temp/scratch space (tempImagePtr = 2*size²)
			* - Region 3: Final skeleton output (skelImagePtr = 3*size²)
			*/
			function Skeletonizer(stdlib, foreign, buffer) {
				"use asm";
				var images = new stdlib.Uint8Array(buffer);
				var size = foreign.size | 0;
				var imul = stdlib.Math.imul;
				/**
				* Morphological erosion with 5-pixel cross structuring element.
				* A pixel survives only if all 5 pixels in the cross pattern are set:
				* top-left, top-right, center, bottom-left, bottom-right.
				*/
				function erode(inImagePtr, outImagePtr) {
					inImagePtr = inImagePtr | 0;
					outImagePtr = outImagePtr | 0;
					var v = 0;
					var u = 0;
					var sum = 0;
					var yStart1 = 0;
					var yStart2 = 0;
					var xStart1 = 0;
					var xStart2 = 0;
					var offset = 0;
					for (v = 1; (v | 0) < (size - 1 | 0); v = v + 1 | 0) {
						offset = offset + size | 0;
						for (u = 1; (u | 0) < (size - 1 | 0); u = u + 1 | 0) {
							yStart1 = offset - size | 0;
							yStart2 = offset + size | 0;
							xStart1 = u - 1 | 0;
							xStart2 = u + 1 | 0;
							sum = (images[inImagePtr + yStart1 + xStart1 | 0] | 0) + (images[inImagePtr + yStart1 + xStart2 | 0] | 0) + (images[inImagePtr + offset + u | 0] | 0) + (images[inImagePtr + yStart2 + xStart1 | 0] | 0) + (images[inImagePtr + yStart2 + xStart2 | 0] | 0) | 0;
							if ((sum | 0) == 5) images[outImagePtr + offset + u | 0] = 1;
							else images[outImagePtr + offset + u | 0] = 0;
						}
					}
				}
				function subtract(aImagePtr, bImagePtr, outImagePtr) {
					aImagePtr = aImagePtr | 0;
					bImagePtr = bImagePtr | 0;
					outImagePtr = outImagePtr | 0;
					var length = 0;
					length = imul(size, size) | 0;
					while ((length | 0) > 0) {
						length = length - 1 | 0;
						images[outImagePtr + length | 0] = (images[aImagePtr + length | 0] | 0) - (images[bImagePtr + length | 0] | 0) | 0;
					}
				}
				function bitwiseOr(aImagePtr, bImagePtr, outImagePtr) {
					aImagePtr = aImagePtr | 0;
					bImagePtr = bImagePtr | 0;
					outImagePtr = outImagePtr | 0;
					var length = 0;
					length = imul(size, size) | 0;
					while ((length | 0) > 0) {
						length = length - 1 | 0;
						images[outImagePtr + length | 0] = images[aImagePtr + length | 0] | 0 | (images[bImagePtr + length | 0] | 0) | 0;
					}
				}
				function countNonZero(imagePtr) {
					imagePtr = imagePtr | 0;
					var sum = 0;
					var length = 0;
					length = imul(size, size) | 0;
					while ((length | 0) > 0) {
						length = length - 1 | 0;
						sum = (sum | 0) + (images[imagePtr + length | 0] | 0) | 0;
					}
					return sum | 0;
				}
				function init(imagePtr, value) {
					imagePtr = imagePtr | 0;
					value = value | 0;
					var length = 0;
					length = imul(size, size) | 0;
					while ((length | 0) > 0) {
						length = length - 1 | 0;
						images[imagePtr + length | 0] = value;
					}
				}
				function dilate(inImagePtr, outImagePtr) {
					inImagePtr = inImagePtr | 0;
					outImagePtr = outImagePtr | 0;
					var v = 0;
					var u = 0;
					var sum = 0;
					var yStart1 = 0;
					var yStart2 = 0;
					var xStart1 = 0;
					var xStart2 = 0;
					var offset = 0;
					for (v = 1; (v | 0) < (size - 1 | 0); v = v + 1 | 0) {
						offset = offset + size | 0;
						for (u = 1; (u | 0) < (size - 1 | 0); u = u + 1 | 0) {
							yStart1 = offset - size | 0;
							yStart2 = offset + size | 0;
							xStart1 = u - 1 | 0;
							xStart2 = u + 1 | 0;
							sum = (images[inImagePtr + yStart1 + xStart1 | 0] | 0) + (images[inImagePtr + yStart1 + xStart2 | 0] | 0) + (images[inImagePtr + offset + u | 0] | 0) + (images[inImagePtr + yStart2 + xStart1 | 0] | 0) + (images[inImagePtr + yStart2 + xStart2 | 0] | 0) | 0;
							if ((sum | 0) > 0) images[outImagePtr + offset + u | 0] = 1;
							else images[outImagePtr + offset + u | 0] = 0;
						}
					}
				}
				function memcpy(srcImagePtr, dstImagePtr) {
					srcImagePtr = srcImagePtr | 0;
					dstImagePtr = dstImagePtr | 0;
					var length = 0;
					length = imul(size, size) | 0;
					while ((length | 0) > 0) {
						length = length - 1 | 0;
						images[dstImagePtr + length | 0] = images[srcImagePtr + length | 0] | 0;
					}
				}
				/**
				* Zeros out the border pixels of the image.
				* First loop: handles top, left, and right edges simultaneously
				* Second loop: handles bottom edge
				*/
				function zeroBorder(imagePtr) {
					imagePtr = imagePtr | 0;
					var x = 0;
					var y = 0;
					for (x = 0; (x | 0) < (size - 1 | 0); x = x + 1 | 0) {
						images[imagePtr + x | 0] = 0;
						images[imagePtr + y | 0] = 0;
						y = y + size - 1 | 0;
						images[imagePtr + y | 0] = 0;
						y = y + 1 | 0;
					}
					for (x = 0; (x | 0) < (size | 0); x = x + 1 | 0) {
						images[imagePtr + y | 0] = 0;
						y = y + 1 | 0;
					}
				}
				/**
				* Main skeletonization algorithm using iterative thinning:
				* 1. Erode the working image
				* 2. Dilate the eroded version
				* 3. Subtract dilated from original (extracts "peeled" layer)
				* 4. OR the peeled layer into skeleton accumulator
				* 5. Copy eroded image back to working image
				* 6. Repeat until working image is empty
				*
				* @returns {void} No return value - operates directly on shared buffer.
				*   Input image is read from buffer offset 0 (subImagePtr).
				*   Output skeleton is written to buffer offset 3*size² (skelImagePtr).
				*/
				function skeletonize() {
					var subImagePtr = 0;
					var erodedImagePtr = 0;
					var tempImagePtr = 0;
					var skelImagePtr = 0;
					var sum = 0;
					var done = 0;
					erodedImagePtr = imul(size, size) | 0;
					tempImagePtr = erodedImagePtr + erodedImagePtr | 0;
					skelImagePtr = tempImagePtr + erodedImagePtr | 0;
					init(skelImagePtr, 0);
					zeroBorder(subImagePtr);
					do {
						erode(subImagePtr, erodedImagePtr);
						dilate(erodedImagePtr, tempImagePtr);
						subtract(subImagePtr, tempImagePtr, tempImagePtr);
						bitwiseOr(skelImagePtr, tempImagePtr, skelImagePtr);
						memcpy(erodedImagePtr, subImagePtr);
						sum = countNonZero(subImagePtr) | 0;
						done = (sum | 0) == 0 | 0;
					} while (!done);
				}
				return { skeletonize };
			}
			/* @preserve ASM END */
			var skeletonizer = Skeletonizer;
			var barcode_locator_config;
			var _currentImageWrapper;
			var _skelImageWrapper;
			var _subImageWrapper;
			var _labelImageWrapper;
			var _patchGrid;
			var _patchLabelGrid;
			var _imageToPatchGrid;
			var _binaryImageWrapper;
			var _patchSize;
			var _canvasContainer = {
				ctx: { binary: null },
				dom: { binary: null }
			};
			var _numPatches = {
				x: 0,
				y: 0
			};
			var _inputImageWrapper;
			var _skeletonizer;
			function barcode_locator_initBuffers() {
				if (barcode_locator_config.halfSample) _currentImageWrapper = new image_wrapper({
					x: _inputImageWrapper.size.x / 2 | 0,
					y: _inputImageWrapper.size.y / 2 | 0
				});
				else _currentImageWrapper = _inputImageWrapper;
				_patchSize = Object(cv_utils["calculatePatchSize"])(barcode_locator_config.patchSize, _currentImageWrapper.size);
				_numPatches.x = _currentImageWrapper.size.x / _patchSize.x | 0;
				_numPatches.y = _currentImageWrapper.size.y / _patchSize.y | 0;
				_binaryImageWrapper = new image_wrapper(_currentImageWrapper.size, void 0, Uint8Array, false);
				_labelImageWrapper = new image_wrapper(_patchSize, void 0, Array, true);
				var skeletonImageDataSize = _patchSize.x * _patchSize.y * 4;
				var skeletonImageData = new ArrayBuffer(Math.max(65536, Math.pow(2, Math.ceil(Math.log2(skeletonImageDataSize)))));
				_subImageWrapper = new image_wrapper(_patchSize, new Uint8Array(skeletonImageData, 0, _patchSize.x * _patchSize.y));
				_skelImageWrapper = new image_wrapper(_patchSize, new Uint8Array(skeletonImageData, _patchSize.x * _patchSize.y * 3, _patchSize.x * _patchSize.y), void 0, true);
				_skeletonizer = skeletonizer({
					Math,
					Uint8Array
				}, { size: _patchSize.x }, skeletonImageData);
				_imageToPatchGrid = new image_wrapper({
					x: _currentImageWrapper.size.x / _subImageWrapper.size.x | 0,
					y: _currentImageWrapper.size.y / _subImageWrapper.size.y | 0
				}, void 0, Array, true);
				_patchGrid = new image_wrapper(_imageToPatchGrid.size, void 0, void 0, true);
				_patchLabelGrid = new image_wrapper(_imageToPatchGrid.size, void 0, Int32Array, true);
			}
			function barcode_locator_initCanvas() {
				if (barcode_locator_config.useWorker || typeof document === "undefined") return;
				_canvasContainer.dom.binary = document.createElement("canvas");
				_canvasContainer.dom.binary.className = "binaryBuffer";
				var willReadFrequently = !!barcode_locator_config.willReadFrequently;
				_canvasContainer.ctx.binary = _canvasContainer.dom.binary.getContext("2d", { willReadFrequently });
				_canvasContainer.dom.binary.width = _binaryImageWrapper.size.x;
				_canvasContainer.dom.binary.height = _binaryImageWrapper.size.y;
			}
			/**
			* Creates a bounding box which encloses all the given patches
			* @returns {Array} The minimal bounding box
			*/
			function boxFromPatches(patches) {
				var overAvg;
				var i;
				var j;
				var patch;
				var transMat;
				var minx = _binaryImageWrapper.size.x;
				var miny = _binaryImageWrapper.size.y;
				var maxx = -_binaryImageWrapper.size.x;
				var maxy = -_binaryImageWrapper.size.y;
				var box;
				var scale;
				overAvg = 0;
				for (i = 0; i < patches.length; i++) {
					patch = patches[i];
					overAvg += patch.rad;
				}
				overAvg /= patches.length;
				overAvg = (overAvg * 180 / Math.PI + 90) % 180 - 90;
				if (overAvg < 0) overAvg += 180;
				overAvg = (180 - overAvg) * Math.PI / 180;
				transMat = cjs["mat2"].copy(cjs["mat2"].create(), [
					Math.cos(overAvg),
					Math.sin(overAvg),
					-Math.sin(overAvg),
					Math.cos(overAvg)
				]);
				for (i = 0; i < patches.length; i++) {
					patch = patches[i];
					for (j = 0; j < 4; j++) cjs["vec2"].transformMat2(patch.box[j], patch.box[j], transMat);
				}
				for (i = 0; i < patches.length; i++) {
					patch = patches[i];
					for (j = 0; j < 4; j++) {
						if (patch.box[j][0] < minx) minx = patch.box[j][0];
						if (patch.box[j][0] > maxx) maxx = patch.box[j][0];
						if (patch.box[j][1] < miny) miny = patch.box[j][1];
						if (patch.box[j][1] > maxy) maxy = patch.box[j][1];
					}
				}
				box = [
					[minx, miny],
					[maxx, miny],
					[maxx, maxy],
					[minx, maxy]
				];
				scale = barcode_locator_config.halfSample ? 2 : 1;
				transMat = cjs["mat2"].invert(transMat, transMat);
				for (j = 0; j < 4; j++) cjs["vec2"].transformMat2(box[j], box[j], transMat);
				for (j = 0; j < 4; j++) cjs["vec2"].scale(box[j], box[j], scale);
				return box;
			}
			/**
			* Creates a binary image of the current image
			*/
			function binarizeImage() {
				Object(cv_utils["otsuThreshold"])(_currentImageWrapper, _binaryImageWrapper);
				_binaryImageWrapper.zeroBorder();
			}
			/**
			* Iterate over the entire image
			* extract patches
			*/
			function findPatches() {
				var i;
				var j;
				var x;
				var y;
				var moments;
				var patchesFound = [];
				var rasterizer;
				var rasterResult;
				for (i = 0; i < _numPatches.x; i++) for (j = 0; j < _numPatches.y; j++) {
					x = _subImageWrapper.size.x * i;
					y = _subImageWrapper.size.y * j;
					skeletonize(x, y);
					_skelImageWrapper.zeroBorder();
					array_helper["a"].init(_labelImageWrapper.data, 0);
					rasterizer = locator_rasterizer.create(_skelImageWrapper, _labelImageWrapper);
					rasterResult = rasterizer.rasterize(0);
					moments = _labelImageWrapper.moments(rasterResult.count);
					patchesFound = patchesFound.concat(describePatch(moments, [i, j], x, y));
				}
				return patchesFound;
			}
			/**
			* Finds those connected areas which contain at least 6 patches
			* and returns them ordered DESC by the number of contained patches
			* @param {Number} maxLabel
			*/
			function findBiggestConnectedAreas(maxLabel) {
				var i;
				var sum;
				var labelHist = [];
				var topLabels = [];
				for (i = 0; i < maxLabel; i++) labelHist.push(0);
				sum = _patchLabelGrid.data.length;
				while (sum--) if (_patchLabelGrid.data[sum] > 0) labelHist[_patchLabelGrid.data[sum] - 1]++;
				labelHist = labelHist.map(function(val, idx) {
					return {
						val,
						label: idx + 1
					};
				});
				labelHist.sort(function(a, b) {
					return b.val - a.val;
				});
				topLabels = labelHist.filter(function(el) {
					return el.val >= 5;
				});
				return topLabels;
			}
			/**
			*
			*/
			function findBoxes(topLabels, maxLabel) {
				var i;
				var sum;
				var patches = [];
				var patch;
				var box;
				var boxes = [];
				for (i = 0; i < topLabels.length; i++) {
					sum = _patchLabelGrid.data.length;
					patches.length = 0;
					while (sum--) if (_patchLabelGrid.data[sum] === topLabels[i].label) {
						patch = _imageToPatchGrid.data[sum];
						patches.push(patch);
					}
					box = boxFromPatches(patches);
					if (box) boxes.push(box);
				}
				return boxes;
			}
			/**
			* Find similar moments (via cluster)
			* @param {Object} moments
			*/
			function similarMoments(moments) {
				var clusters = Object(cv_utils["cluster"])(moments, .9);
				var topCluster = Object(cv_utils["topGeneric"])(clusters, 1, function(e) {
					return e.getPoints().length;
				});
				var points = [];
				var result = [];
				if (topCluster.length === 1) {
					points = topCluster[0].item.getPoints();
					for (var i = 0; i < points.length; i++) result.push(points[i].point);
				}
				return result;
			}
			function skeletonize(x, y) {
				_binaryImageWrapper.subImageAsCopy(_subImageWrapper, Object(cv_utils["imageRef"])(x, y));
				_skeletonizer.skeletonize();
			}
			/**
			* Extracts and describes those patches which seem to contain a barcode pattern
			* @param {Array} moments
			* @param {Object} patchPos,
			* @param {Number} x
			* @param {Number} y
			* @returns {Array} list of patches
			*/
			function describePatch(moments, patchPos, x, y) {
				var k;
				var avg;
				var eligibleMoments = [];
				var matchingMoments;
				var patch;
				var patchesFound = [];
				var minComponentWeight = Math.ceil(_patchSize.x / 3);
				if (moments.length >= 2) {
					for (k = 0; k < moments.length; k++) if (moments[k].m00 > minComponentWeight) eligibleMoments.push(moments[k]);
					if (eligibleMoments.length >= 2) {
						matchingMoments = similarMoments(eligibleMoments);
						avg = 0;
						for (k = 0; k < matchingMoments.length; k++) {
							var _matchingMoments$k$ra, _matchingMoments$k;
							avg += (_matchingMoments$k$ra = (_matchingMoments$k = matchingMoments[k]) === null || _matchingMoments$k === void 0 ? void 0 : _matchingMoments$k.rad) !== null && _matchingMoments$k$ra !== void 0 ? _matchingMoments$k$ra : 0;
						}
						if (matchingMoments.length > 1 && matchingMoments.length >= eligibleMoments.length / 4 * 3 && matchingMoments.length > moments.length / 4) {
							avg /= matchingMoments.length;
							patch = {
								index: patchPos[1] * _numPatches.x + patchPos[0],
								pos: {
									x,
									y
								},
								box: [
									cjs["vec2"].clone([x, y]),
									cjs["vec2"].clone([x + _subImageWrapper.size.x, y]),
									cjs["vec2"].clone([x + _subImageWrapper.size.x, y + _subImageWrapper.size.y]),
									cjs["vec2"].clone([x, y + _subImageWrapper.size.y])
								],
								moments: matchingMoments,
								rad: avg,
								vec: cjs["vec2"].clone([Math.cos(avg), Math.sin(avg)])
							};
							patchesFound.push(patch);
						}
					}
				}
				return patchesFound;
			}
			/**
			* finds patches which are connected and share the same orientation
			* @param {Object} patchesFound
			*/
			function rasterizeAngularSimilarity(patchesFound) {
				var label = 0;
				var threshold = .95;
				var currIdx = 0;
				var j;
				var patch;
				function notYetProcessed() {
					var i;
					for (i = 0; i < _patchLabelGrid.data.length; i++) if (_patchLabelGrid.data[i] === 0 && _patchGrid.data[i] === 1) return i;
					return _patchLabelGrid.data.length;
				}
				function trace(currentIdx) {
					var x;
					var y;
					var currentPatch;
					var idx;
					var dir;
					var current = {
						x: currentIdx % _patchLabelGrid.size.x,
						y: currentIdx / _patchLabelGrid.size.x | 0
					};
					var similarity;
					if (currentIdx < _patchLabelGrid.data.length) {
						currentPatch = _imageToPatchGrid.data[currentIdx];
						_patchLabelGrid.data[currentIdx] = label;
						for (dir = 0; dir < locator_tracer.searchDirections.length; dir++) {
							y = current.y + locator_tracer.searchDirections[dir][0];
							x = current.x + locator_tracer.searchDirections[dir][1];
							idx = y * _patchLabelGrid.size.x + x;
							if (_patchGrid.data[idx] === 0) {
								_patchLabelGrid.data[idx] = Number.MAX_VALUE;
								continue;
							}
							if (_patchLabelGrid.data[idx] === 0) {
								similarity = Math.abs(cjs["vec2"].dot(_imageToPatchGrid.data[idx].vec, currentPatch.vec));
								if (similarity > threshold) trace(idx);
							}
						}
					}
				}
				array_helper["a"].init(_patchGrid.data, 0);
				array_helper["a"].init(_patchLabelGrid.data, 0);
				array_helper["a"].init(_imageToPatchGrid.data, null);
				for (j = 0; j < patchesFound.length; j++) {
					patch = patchesFound[j];
					_imageToPatchGrid.data[patch.index] = patch;
					_patchGrid.data[patch.index] = 1;
				}
				_patchGrid.zeroBorder();
				while ((currIdx = notYetProcessed()) < _patchLabelGrid.data.length) {
					label++;
					trace(currIdx);
				}
				return label;
			}
			var barcode_locator = {
				init: function init(inputImageWrapper, config) {
					barcode_locator_config = config;
					_inputImageWrapper = inputImageWrapper;
					barcode_locator_initBuffers();
					barcode_locator_initCanvas();
				},
				locate: function locate() {
					if (barcode_locator_config.halfSample) Object(cv_utils["halfSample"])(_inputImageWrapper, _currentImageWrapper);
					binarizeImage();
					var patchesFound = findPatches();
					if (patchesFound.length < _numPatches.x * _numPatches.y * .05) return null;
					var maxLabel = rasterizeAngularSimilarity(patchesFound);
					if (maxLabel < 1) return null;
					var topLabels = findBiggestConnectedAreas(maxLabel);
					if (topLabels.length === 0) return null;
					return findBoxes(topLabels, maxLabel);
				},
				checkImageConstraints: function checkImageConstraints(inputStream, config) {
					var patchSize;
					var width = inputStream.getWidth();
					var height = inputStream.getHeight();
					var thisHalfSample = config.halfSample ? .5 : 1;
					var area;
					if (inputStream.getConfig().area) {
						area = Object(cv_utils["computeImageArea"])(width, height, inputStream.getConfig().area);
						inputStream.setTopRight({
							x: area.sx,
							y: area.sy
						});
						inputStream.setCanvasSize({
							x: width,
							y: height
						});
						width = area.sw;
						height = area.sh;
					}
					var size = {
						x: Math.floor(width * thisHalfSample),
						y: Math.floor(height * thisHalfSample)
					};
					patchSize = Object(cv_utils["calculatePatchSize"])(config.patchSize, size);
					inputStream.setWidth(Math.max(Math.floor(Math.floor(size.x / patchSize.x) * (1 / thisHalfSample) * patchSize.x), patchSize.x));
					inputStream.setHeight(Math.max(Math.floor(Math.floor(size.y / patchSize.y) * (1 / thisHalfSample) * patchSize.y), patchSize.y));
					if (inputStream.getWidth() % patchSize.x === 0 && inputStream.getHeight() % patchSize.y === 0) return true;
					throw new Error("Image dimensions do not comply with the current settings: Width (".concat(width, " )and height (").concat(height, ") must a multiple of ").concat(patchSize.x));
				}
			};
			var QuaggaContext_QuaggaContext = /*#__PURE__*/ createClass_default()(function QuaggaContext() {
				classCallCheck_default()(this, QuaggaContext);
				defineProperty_default()(this, "config", void 0);
				defineProperty_default()(this, "inputStream", void 0);
				defineProperty_default()(this, "framegrabber", void 0);
				defineProperty_default()(this, "inputImageWrapper", void 0);
				defineProperty_default()(this, "stopped", false);
				/**
				* Flag indicating that stop() was called while init() was still in progress.
				* This is used to handle race conditions in React StrictMode where components
				* are mounted/unmounted rapidly, causing init() to be called, then stop(),
				* then init() again before the first init() completes.
				*/
				defineProperty_default()(this, "initAborted", false);
				defineProperty_default()(this, "boxSize", void 0);
				defineProperty_default()(this, "resultCollector", void 0);
				defineProperty_default()(this, "decoder", void 0);
				defineProperty_default()(this, "workerPool", []);
				defineProperty_default()(this, "onUIThread", true);
				defineProperty_default()(this, "canvasContainer", new QuaggaContext_CanvasContainer());
			});
			var QuaggaContext_CanvasInfo = /*#__PURE__*/ createClass_default()(function CanvasInfo() {
				classCallCheck_default()(this, CanvasInfo);
				defineProperty_default()(this, "image", void 0);
				defineProperty_default()(this, "overlay", void 0);
			});
			var QuaggaContext_CanvasContainer = /*#__PURE__*/ createClass_default()(function CanvasContainer() {
				classCallCheck_default()(this, CanvasContainer);
				defineProperty_default()(this, "ctx", void 0);
				defineProperty_default()(this, "dom", void 0);
				this.ctx = new QuaggaContext_CanvasInfo();
				this.dom = new QuaggaContext_CanvasInfo();
			});
			function getViewPort_getViewPort(target) {
				if (typeof document === "undefined") return null;
				if (target instanceof HTMLElement && target.nodeName && target.nodeType === 1) return target;
				var selector = typeof target === "string" ? target : "#interactive.viewport";
				return document.querySelector(selector);
			}
			function initBuffers_initBuffers(inputStream, imageWrapper, locator) {
				var inputImageWrapper = imageWrapper || new image_wrapper({
					x: inputStream.getWidth(),
					y: inputStream.getHeight(),
					type: "XYSize"
				});
				var boxSize = [
					cjs["vec2"].clone([0, 0]),
					cjs["vec2"].clone([0, inputImageWrapper.size.y]),
					cjs["vec2"].clone([inputImageWrapper.size.x, inputImageWrapper.size.y]),
					cjs["vec2"].clone([inputImageWrapper.size.x, 0])
				];
				barcode_locator.init(inputImageWrapper, locator);
				return {
					inputImageWrapper,
					boxSize
				};
			}
			function findOrCreateCanvas(selector, className) {
				var canvas = document.querySelector(selector);
				if (!canvas) {
					canvas = document.createElement("canvas");
					canvas.className = className;
				}
				return canvas;
			}
			function getCanvasAndContext(selector, className, options) {
				var canvas = findOrCreateCanvas(selector, className);
				return {
					canvas,
					context: canvas.getContext("2d", { willReadFrequently: options.willReadFrequently })
				};
			}
			function initCanvases(canvasSize, _ref) {
				var willReadFrequently = _ref.willReadFrequently, createOverlay = _ref.createOverlay, debug = _ref.debug;
				if (typeof document !== "undefined") {
					var image = getCanvasAndContext("canvas.imgBuffer", "imgBuffer", {
						willReadFrequently,
						debug
					});
					image.canvas.width = canvasSize.x;
					image.canvas.height = canvasSize.y;
					var overlay = {
						canvas: null,
						context: null
					};
					if (createOverlay) {
						var overlayResult = getCanvasAndContext("canvas.drawingBuffer", "drawingBuffer", {
							willReadFrequently,
							debug
						});
						overlayResult.canvas.width = canvasSize.x;
						overlayResult.canvas.height = canvasSize.y;
						overlay = overlayResult;
					}
					return {
						dom: {
							image: image.canvas,
							overlay: overlay.canvas
						},
						ctx: {
							image: image.context,
							overlay: overlay.context
						}
					};
				}
				return null;
			}
			function initCanvas_initCanvas(context) {
				var _context$config, _context$config$input, _context$config2, _context$config2$inpu, _context$config3, _context$config3$canv, _context$config4, _context$config4$inpu, _context$config5, _context$config5$loca;
				var viewport = getViewPort_getViewPort(context === null || context === void 0 ? void 0 : (_context$config = context.config) === null || _context$config === void 0 ? void 0 : (_context$config$input = _context$config.inputStream) === null || _context$config$input === void 0 ? void 0 : _context$config$input.target);
				var type = context === null || context === void 0 ? void 0 : (_context$config2 = context.config) === null || _context$config2 === void 0 ? void 0 : (_context$config2$inpu = _context$config2.inputStream) === null || _context$config2$inpu === void 0 ? void 0 : _context$config2$inpu.type;
				if (!type) return null;
				var createOverlay = (context === null || context === void 0 ? void 0 : (_context$config3 = context.config) === null || _context$config3 === void 0 ? void 0 : (_context$config3$canv = _context$config3.canvas) === null || _context$config3$canv === void 0 ? void 0 : _context$config3$canv.createOverlay) !== false;
				var container = initCanvases(context.inputStream.getCanvasSize(), {
					willReadFrequently: !!(context !== null && context !== void 0 && (_context$config4 = context.config) !== null && _context$config4 !== void 0 && (_context$config4$inpu = _context$config4.inputStream) !== null && _context$config4$inpu !== void 0 && _context$config4$inpu.willReadFrequently),
					createOverlay,
					debug: context === null || context === void 0 ? void 0 : (_context$config5 = context.config) === null || _context$config5 === void 0 ? void 0 : (_context$config5$loca = _context$config5.locator) === null || _context$config5$loca === void 0 ? void 0 : _context$config5$loca.debug
				});
				if (!container) return {
					dom: {
						image: null,
						overlay: null
					},
					ctx: {
						image: null,
						overlay: null
					}
				};
				var dom = container.dom;
				if (typeof document !== "undefined") {
					if (viewport) {
						if (type === "ImageStream" && !viewport.contains(dom.image)) viewport.appendChild(dom.image);
						if (dom.overlay && !viewport.contains(dom.overlay)) viewport.appendChild(dom.overlay);
					}
				}
				return container;
			}
			function qworker_ownKeys(e, r) {
				var t = Object.keys(e);
				if (Object.getOwnPropertySymbols) {
					var o = Object.getOwnPropertySymbols(e);
					r && (o = o.filter(function(r) {
						return Object.getOwnPropertyDescriptor(e, r).enumerable;
					})), t.push.apply(t, o);
				}
				return t;
			}
			function qworker_objectSpread(e) {
				for (var r = 1; r < arguments.length; r++) {
					var t = null != arguments[r] ? arguments[r] : {};
					r % 2 ? qworker_ownKeys(Object(t), !0).forEach(function(r) {
						defineProperty_default()(e, r, t[r]);
					}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : qworker_ownKeys(Object(t)).forEach(function(r) {
						Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
					});
				}
				return e;
			}
			var workerPool = [];
			function updateWorkers(frameGrabber) {
				var availableWorker;
				if (workerPool.length) {
					availableWorker = workerPool.filter(function(workerThread) {
						return !workerThread.busy;
					})[0];
					if (availableWorker) {
						frameGrabber.attachData(availableWorker.imageData);
						if (frameGrabber.grab()) {
							availableWorker.busy = true;
							availableWorker.worker.postMessage({
								cmd: "process",
								imageData: availableWorker.imageData
							}, [availableWorker.imageData.buffer]);
						}
						return true;
					} else return false;
				}
				return null;
			}
			function configForWorker(config) {
				return qworker_objectSpread(qworker_objectSpread({}, config), {}, { inputStream: qworker_objectSpread(qworker_objectSpread({}, config.inputStream), {}, { target: null }) });
			}
			function workerInterface(factory) {
				if (factory) {
					var Quagga = factory()["default"];
					if (!Quagga) {
						self.postMessage({
							"event": "error",
							message: "Quagga could not be created"
						});
						return;
					}
				}
				var imageWrapper;
				function onProcessed(result) {
					self.postMessage({
						"event": "processed",
						imageData: imageWrapper.data,
						result
					}, [imageWrapper.data.buffer]);
				}
				function workerInterfaceReady() {
					self.postMessage({
						"event": "initialized",
						imageData: imageWrapper.data
					}, [imageWrapper.data.buffer]);
				}
				self.onmessage = function(e) {
					if (e.data.cmd === "init") {
						var config = e.data.config;
						config.numOfWorkers = 0;
						imageWrapper = new Quagga.ImageWrapper({
							x: e.data.size.x,
							y: e.data.size.y
						}, new Uint8Array(e.data.imageData));
						Quagga.init(config, workerInterfaceReady, imageWrapper);
						Quagga.onProcessed(onProcessed);
					} else if (e.data.cmd === "process") {
						imageWrapper.data = new Uint8Array(e.data.imageData);
						Quagga.start();
					} else if (e.data.cmd === "setReaders") Quagga.setReaders(e.data.readers);
					else if (e.data.cmd === "registerReader") Quagga.registerReader(e.data.name, e.data.reader);
				};
			}
			function generateWorkerBlob() {
				var blob, factorySource;
				if (typeof __factorySource__ !== "undefined") factorySource = __factorySource__;
				blob = new Blob(["(" + workerInterface.toString() + ")(" + factorySource + ");"], { type: "text/javascript" });
				return window.URL.createObjectURL(blob);
			}
			function initWorker(config, inputStream, cb) {
				var blobURL = generateWorkerBlob();
				var workerThread = {
					worker: new Worker(blobURL),
					imageData: new Uint8Array(inputStream.getWidth() * inputStream.getHeight()),
					busy: true
				};
				workerThread.worker.onmessage = function(e) {
					if (e.data.event === "initialized") {
						URL.revokeObjectURL(blobURL);
						workerThread.busy = false;
						workerThread.imageData = new Uint8Array(e.data.imageData);
						cb(workerThread);
					} else if (e.data.event === "processed") {
						workerThread.imageData = new Uint8Array(e.data.imageData);
						workerThread.busy = false;
						if (typeof publishResult !== "undefined") publishResult(e.data.result, workerThread.imageData);
					} else if (e.data.event === "error") {}
				};
				workerThread.worker.postMessage({
					cmd: "init",
					size: {
						x: inputStream.getWidth(),
						y: inputStream.getHeight()
					},
					imageData: workerThread.imageData,
					config: configForWorker(config)
				}, [workerThread.imageData.buffer]);
			}
			function adjustWorkerPool(capacity, config, inputStream, cb) {
				var increaseBy = capacity - workerPool.length;
				if (increaseBy === 0 && cb) cb();
				else if (increaseBy < 0) {
					workerPool.slice(increaseBy).forEach(function(workerThread) {
						workerThread.worker.terminate();
					});
					workerPool = workerPool.slice(0, increaseBy);
					if (cb) cb();
				} else {
					var workerInitialized = function workerInitialized(workerThread) {
						workerPool.push(workerThread);
						if (workerPool.length >= capacity && cb) cb();
					};
					if (config) for (var i = 0; i < increaseBy; i++) initWorker(config, inputStream, workerInitialized);
				}
			}
			function qworker_setReaders(readers) {
				workerPool.forEach(function(workerThread) {
					return workerThread.worker.postMessage({
						cmd: "setReaders",
						readers
					});
				});
			}
			function qworker_registerReader(name, reader) {
				workerPool.forEach(function(workerThread) {
					return workerThread.worker.postMessage({
						cmd: "registerReader",
						name,
						reader
					});
				});
			}
			function setupInputStream() {
				var type = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "LiveStream";
				var viewport = arguments.length > 1 ? arguments[1] : void 0;
				var inputStreamFactory = arguments.length > 2 ? arguments[2] : void 0;
				switch (type) {
					case "VideoStream":
						var video = document.createElement("video");
						return {
							video,
							inputStream: inputStreamFactory.createVideoStream(video)
						};
					case "ImageStream": return { inputStream: inputStreamFactory.createImageStream() };
					case "LiveStream":
						var _video = null;
						if (viewport) {
							_video = viewport.querySelector("video");
							if (!_video) {
								_video = document.createElement("video");
								viewport.appendChild(_video);
							}
						}
						return {
							video: _video,
							inputStream: inputStreamFactory.createLiveStream(_video)
						};
					default:
						console.error("* setupInputStream invalid type ".concat(type));
						return {
							video: null,
							inputStream: null
						};
				}
			}
			function moveBox(box, xOffset, yOffset) {
				var corner = box.length;
				while (corner--) {
					box[corner][0] += xOffset;
					box[corner][1] += yOffset;
				}
			}
			function moveLine(line, xOffset, yOffset) {
				line[0].x += xOffset;
				line[0].y += yOffset;
				line[1].x += xOffset;
				line[1].y += yOffset;
			}
			var quagga_Quagga = /*#__PURE__*/ function() {
				function Quagga() {
					var _this = this;
					classCallCheck_default()(this, Quagga);
					defineProperty_default()(this, "context", new QuaggaContext_QuaggaContext());
					defineProperty_default()(this, "canRecord", function(callback) {
						var _this$context$config;
						if (_this.context.initAborted) {
							callback(/* @__PURE__ */ new Error("Initialization was aborted"));
							return;
						}
						if (!_this.context.config) {
							callback(/* @__PURE__ */ new Error("Configuration not initialized"));
							return;
						}
						if (!_this.context.inputStream) {
							callback(/* @__PURE__ */ new Error("Input stream not initialized"));
							return;
						}
						barcode_locator.checkImageConstraints(_this.context.inputStream, (_this$context$config = _this.context.config) === null || _this$context$config === void 0 ? void 0 : _this$context$config.locator);
						_this.initCanvas();
						_this.context.framegrabber = frame_grabber_default.a.create(_this.context.inputStream, _this.context.canvasContainer.dom.image);
						if (_this.context.config.numOfWorkers === void 0) _this.context.config.numOfWorkers = 0;
						adjustWorkerPool(_this.context.config.numOfWorkers, _this.context.config, _this.context.inputStream, function() {
							var _this$context$config2;
							if (((_this$context$config2 = _this.context.config) === null || _this$context$config2 === void 0 ? void 0 : _this$context$config2.numOfWorkers) === 0) _this.initializeData();
							_this.ready(callback);
						});
					});
					defineProperty_default()(this, "update", function() {
						if (_this.context.onUIThread) {
							var workersUpdated = updateWorkers(_this.context.framegrabber);
							if (!workersUpdated) {
								var _this$context$inputIm;
								_this.context.framegrabber.attachData((_this$context$inputIm = _this.context.inputImageWrapper) === null || _this$context$inputIm === void 0 ? void 0 : _this$context$inputIm.data);
								if (_this.context.framegrabber.grab()) {
									if (!workersUpdated) _this.locateAndDecode();
								}
							}
						} else {
							var _this$context$inputIm2;
							_this.context.framegrabber.attachData((_this$context$inputIm2 = _this.context.inputImageWrapper) === null || _this$context$inputIm2 === void 0 ? void 0 : _this$context$inputIm2.data);
							_this.context.framegrabber.grab();
							_this.locateAndDecode();
						}
					});
					/**
					* Public method to draw a scanner area overlay using the current Quagga instance's overlay canvas.
					* Draws based on the instance's configured inputStream.area, using the actual adjusted boxSize
					* to match the real scanning area after patch alignment.
					* Only draws when locate is false and an area is configured with styling.
					*/
					defineProperty_default()(this, "_cachedStyleValues", void 0);
					defineProperty_default()(this, "_resolvedStyle", void 0);
				}
				return createClass_default()(Quagga, [
					{
						key: "initBuffers",
						value: function initBuffers(imageWrapper) {
							if (!this.context.config) return;
							var _initBuffers2 = initBuffers_initBuffers(this.context.inputStream, imageWrapper, this.context.config.locator), inputImageWrapper = _initBuffers2.inputImageWrapper, boxSize = _initBuffers2.boxSize;
							this.context.inputImageWrapper = inputImageWrapper;
							this.context.boxSize = boxSize;
						}
					},
					{
						key: "initializeData",
						value: function initializeData(imageWrapper) {
							if (!this.context.config) return;
							this.initBuffers(imageWrapper);
							this.context.decoder = barcode_decoder.create(this.context.config.decoder, this.context.inputImageWrapper);
						}
					},
					{
						key: "getViewPort",
						value: function getViewPort() {
							if (!this.context.config || !this.context.config.inputStream) return null;
							var target = this.context.config.inputStream.target;
							return getViewPort_getViewPort(target);
						}
					},
					{
						key: "ready",
						value: function ready(callback) {
							this.context.inputStream.play();
							callback();
						}
					},
					{
						key: "initCanvas",
						value: function initCanvas() {
							var container = initCanvas_initCanvas(this.context);
							if (!container) return;
							var ctx = container.ctx, dom = container.dom;
							this.context.canvasContainer.dom.image = dom.image;
							this.context.canvasContainer.dom.overlay = dom.overlay;
							this.context.canvasContainer.ctx.image = ctx.image;
							this.context.canvasContainer.ctx.overlay = ctx.overlay;
						}
					},
					{
						key: "initInputStream",
						value: function initInputStream(callback) {
							if (!this.context.config || !this.context.config.inputStream) return;
							var _this$context$config$ = this.context.config.inputStream, inputType = _this$context$config$.type, constraints = _this$context$config$.constraints;
							var _setupInputStream = setupInputStream(inputType, this.getViewPort(), input_stream), video = _setupInputStream.video, inputStream = _setupInputStream.inputStream;
							if (inputType === "LiveStream" && video) camera_access.request(video, constraints).then(function() {
								return inputStream.trigger("canrecord");
							})["catch"](function(err) {
								return callback(err);
							});
							if (inputStream) {
								inputStream.setAttribute("preload", "auto");
								inputStream.setInputStream(this.context.config.inputStream);
								inputStream.addEventListener("canrecord", this.canRecord.bind(void 0, callback));
							}
							this.context.inputStream = inputStream;
						}
					},
					{
						key: "getBoundingBoxes",
						value: function getBoundingBoxes() {
							var _this$context$config3;
							return (_this$context$config3 = this.context.config) !== null && _this$context$config3 !== void 0 && _this$context$config3.locate ? barcode_locator.locate() : [[
								cjs["vec2"].clone(this.context.boxSize[0]),
								cjs["vec2"].clone(this.context.boxSize[1]),
								cjs["vec2"].clone(this.context.boxSize[2]),
								cjs["vec2"].clone(this.context.boxSize[3])
							]];
						}
					},
					{
						key: "transformResult",
						value: function transformResult(result) {
							var _this2 = this;
							var transformedBoxes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : /* @__PURE__ */ new Set();
							var topRight = this.context.inputStream.getTopRight();
							var xOffset = topRight.x;
							var yOffset = topRight.y;
							if (xOffset === 0 && yOffset === 0) return;
							if (result.barcodes) result.barcodes.forEach(function(barcode) {
								return _this2.transformResult(barcode, transformedBoxes);
							});
							if (result.line && result.line.length === 2) moveLine(result.line, xOffset, yOffset);
							if (result.box && !transformedBoxes.has(result.box)) {
								moveBox(result.box, xOffset, yOffset);
								transformedBoxes.add(result.box);
							}
							if (result.boxes && result.boxes.length > 0) {
								for (var i = 0; i < result.boxes.length; i++) if (!transformedBoxes.has(result.boxes[i])) {
									moveBox(result.boxes[i], xOffset, yOffset);
									transformedBoxes.add(result.boxes[i]);
								}
							}
						}
					},
					{
						key: "addResult",
						value: function addResult(result, imageData) {
							var _this3 = this;
							if (!imageData || !this.context.resultCollector) return;
							if (result.barcodes) result.barcodes.filter(function(barcode) {
								return barcode.codeResult;
							}).forEach(function(barcode) {
								return _this3.addResult(barcode, imageData);
							});
							else if (result.codeResult) this.context.resultCollector.addResult(imageData, this.context.inputStream.getCanvasSize(), result.codeResult);
						}
					},
					{
						key: "hasCodeResult",
						value: function hasCodeResult(result) {
							return !!(result && (result.barcodes ? result.barcodes.some(function(barcode) {
								return barcode.codeResult;
							}) : result.codeResult));
						}
					},
					{
						key: "publishResult",
						value: function publishResult() {
							var _cfg$inputStream;
							var result = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
							var imageData = arguments.length > 1 ? arguments[1] : void 0;
							var resultToPublish = result;
							if (result && this.context.onUIThread) {
								var _result$barcodes;
								this.transformResult(result);
								this.addResult(result, imageData);
								resultToPublish = (result === null || result === void 0 ? void 0 : (_result$barcodes = result.barcodes) === null || _result$barcodes === void 0 ? void 0 : _result$barcodes.length) > 0 ? result.barcodes : result;
							}
							events.publish("processed", resultToPublish);
							if (this.hasCodeResult(result)) events.publish("detected", resultToPublish);
							var cfg = this.context.config;
							if (cfg && cfg.locate === false && (_cfg$inputStream = cfg.inputStream) !== null && _cfg$inputStream !== void 0 && _cfg$inputStream.area) this.drawScannerArea();
						}
					},
					{
						key: "locateAndDecode",
						value: function() {
							var _locateAndDecode = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee() {
								var boxes, _this$context$inputIm3, decodeResult, imageResult, _this$context$inputIm4, _t;
								return regenerator_default.a.wrap(function(_context) {
									while (1) switch (_context.prev = _context.next) {
										case 0:
											boxes = this.getBoundingBoxes();
											if (!boxes) {
												_context.next = 3;
												break;
											}
											_context.next = 1;
											return this.context.decoder.decodeFromBoundingBoxes(boxes);
										case 1:
											_t = _context.sent;
											if (_t) {
												_context.next = 2;
												break;
											}
											_t = {};
										case 2:
											decodeResult = _t;
											decodeResult.boxes = boxes;
											this.publishResult(decodeResult, (_this$context$inputIm3 = this.context.inputImageWrapper) === null || _this$context$inputIm3 === void 0 ? void 0 : _this$context$inputIm3.data);
											_context.next = 5;
											break;
										case 3:
											_context.next = 4;
											return this.context.decoder.decodeFromImage(this.context.inputImageWrapper);
										case 4:
											imageResult = _context.sent;
											if (imageResult) this.publishResult(imageResult, (_this$context$inputIm4 = this.context.inputImageWrapper) === null || _this$context$inputIm4 === void 0 ? void 0 : _this$context$inputIm4.data);
											else this.publishResult();
										case 5:
										case "end": return _context.stop();
									}
								}, _callee, this);
							}));
							function locateAndDecode() {
								return _locateAndDecode.apply(this, arguments);
							}
							return locateAndDecode;
						}()
					},
					{
						key: "startContinuousUpdate",
						value: function startContinuousUpdate() {
							var _this$context$config4, _this4 = this;
							var next = null;
							var delay = 1e3 / (((_this$context$config4 = this.context.config) === null || _this$context$config4 === void 0 ? void 0 : _this$context$config4.frequency) || 60);
							this.context.stopped = false;
							var context = this.context;
							var _newFrame = function newFrame(timestamp) {
								next = next || timestamp;
								if (!context.stopped) {
									if (timestamp >= next) {
										next += delay;
										_this4.update();
									}
									window.requestAnimationFrame(_newFrame);
								}
							};
							_newFrame(performance.now());
						}
					},
					{
						key: "start",
						value: function start() {
							var _this$context$config5, _this$context$config6;
							if (this.context.onUIThread && ((_this$context$config5 = this.context.config) === null || _this$context$config5 === void 0 ? void 0 : (_this$context$config6 = _this$context$config5.inputStream) === null || _this$context$config6 === void 0 ? void 0 : _this$context$config6.type) === "LiveStream") this.startContinuousUpdate();
							else this.update();
						}
					},
					{
						key: "stop",
						value: function() {
							var _stop = asyncToGenerator_default()(/*#__PURE__*/ regenerator_default.a.mark(function _callee2() {
								var _this$context$config7;
								var _this$context$inputSt;
								return regenerator_default.a.wrap(function(_context2) {
									while (1) switch (_context2.prev = _context2.next) {
										case 0:
											this.context.stopped = true;
											if (!this.context.framegrabber) this.context.initAborted = true;
											adjustWorkerPool(0);
											if (!((_this$context$config7 = this.context.config) !== null && _this$context$config7 !== void 0 && _this$context$config7.inputStream && this.context.config.inputStream.type === "LiveStream")) {
												_context2.next = 2;
												break;
											}
											_context2.next = 1;
											return camera_access.release();
										case 1: (_this$context$inputSt = this.context.inputStream) === null || _this$context$inputSt === void 0 || _this$context$inputSt.clearEventHandlers();
										case 2:
										case "end": return _context2.stop();
									}
								}, _callee2, this);
							}));
							function stop() {
								return _stop.apply(this, arguments);
							}
							return stop;
						}()
					},
					{
						key: "setReaders",
						value: function setReaders(readers) {
							if (this.context.decoder) this.context.decoder.setReaders(readers);
							qworker_setReaders(readers);
						}
					},
					{
						key: "registerReader",
						value: function registerReader(name, reader) {
							barcode_decoder.registerReader(name, reader);
							if (this.context.decoder) this.context.decoder.registerReader(name, reader);
							qworker_registerReader(name, reader);
						}
					},
					{
						key: "drawScannerArea",
						value: function drawScannerArea() {
							var _this$context$config8, _this$context$config9, _this$context$config0;
							var area = (_this$context$config8 = this.context.config) === null || _this$context$config8 === void 0 ? void 0 : (_this$context$config9 = _this$context$config8.inputStream) === null || _this$context$config9 === void 0 ? void 0 : _this$context$config9.area;
							if (!area) return;
							var overlayCtx = this.context.canvasContainer.ctx.overlay;
							if (!overlayCtx) return;
							if (((_this$context$config0 = this.context.config) === null || _this$context$config0 === void 0 ? void 0 : _this$context$config0.locate) !== false) return;
							if (!(area.borderColor !== void 0 && area.borderColor !== "" || area.borderWidth !== void 0 && area.borderWidth > 0 || area.backgroundColor !== void 0 && area.backgroundColor !== "")) return;
							if (!this.context.boxSize) return;
							var topRightOffset = this.context.inputStream.getTopRight();
							var offsetX = topRightOffset.x;
							var offsetY = topRightOffset.y;
							var box = this.context.boxSize;
							var topLeft = box[0];
							var bottomLeft = box[1];
							var topRight = box[3];
							var x = topLeft[0] + offsetX;
							var y = topLeft[1] + offsetY;
							var width = topRight[0] - topLeft[0];
							var height = bottomLeft[1] - topLeft[1];
							if (!this._cachedStyleValues || this._cachedStyleValues.borderColor !== area.borderColor || this._cachedStyleValues.borderWidth !== area.borderWidth || this._cachedStyleValues.backgroundColor !== area.backgroundColor) {
								var _area$borderColor, _area$borderWidth;
								this._cachedStyleValues = {
									borderColor: area.borderColor,
									borderWidth: area.borderWidth,
									backgroundColor: area.backgroundColor
								};
								var shouldDrawBorder = area.borderColor !== void 0 || area.borderWidth !== void 0;
								var color = (_area$borderColor = area.borderColor) !== null && _area$borderColor !== void 0 ? _area$borderColor : "rgba(0, 255, 0, 0.5)";
								var borderWidth = shouldDrawBorder ? (_area$borderWidth = area.borderWidth) !== null && _area$borderWidth !== void 0 ? _area$borderWidth : 2 : 0;
								var bg = area.backgroundColor;
								this._resolvedStyle = {
									color,
									width: borderWidth,
									bg
								};
							}
							var style = this._resolvedStyle;
							if (style.bg) {
								overlayCtx.fillStyle = style.bg;
								overlayCtx.fillRect(x, y, width, height);
							}
							if (style.width > 0) {
								overlayCtx.strokeStyle = style.color;
								overlayCtx.lineWidth = style.width;
								overlayCtx.strokeRect(x, y, width, height);
							}
						}
					}
				]);
			}();
			var instance = new quagga_Quagga();
			var quagga_context = instance.context;
			var QuaggaJSStaticInterface = {
				init: function init(config, cb, imageWrapper) {
					var quaggaInstance = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : instance;
					var promise;
					if (!cb) promise = new Promise(function(resolve, reject) {
						cb = function cb(err) {
							err ? reject(err) : resolve();
						};
					});
					quaggaInstance.context.initAborted = false;
					quaggaInstance.context.config = merge_default()({}, config_config, config);
					if (quaggaInstance.context.config.numOfWorkers > 0) quaggaInstance.context.config.numOfWorkers = 0;
					if (imageWrapper) {
						quaggaInstance.context.onUIThread = false;
						quaggaInstance.initializeData(imageWrapper);
						if (cb) cb();
					} else quaggaInstance.initInputStream(cb);
					return promise;
				},
				start: function start(config, cb) {
					if (config) {
						var promise;
						if (!cb) promise = new Promise(function(resolve, reject) {
							cb = function cb(err) {
								err ? reject(err) : resolve();
							};
						});
						this.init(config, function(err) {
							if (err) {
								cb(err);
								return;
							}
							try {
								instance.start();
								cb();
							} catch (startErr) {
								cb(startErr);
							}
						});
						return promise;
					}
					if (!quagga_context.framegrabber) throw new Error("start() was called before init() completed. Call init() first, or call start(config) to combine init and start.");
					return instance.start();
				},
				stop: function stop() {
					return instance.stop();
				},
				pause: function pause() {
					quagga_context.stopped = true;
				},
				onDetected: function onDetected(callback) {
					if (!callback || typeof callback !== "function" && (typeof_default()(callback) !== "object" || !callback.callback)) {
						console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");
						return;
					}
					events.subscribe("detected", callback);
				},
				offDetected: function offDetected(callback) {
					events.unsubscribe("detected", callback);
				},
				onProcessed: function onProcessed(callback) {
					if (!callback || typeof callback !== "function" && (typeof_default()(callback) !== "object" || !callback.callback)) {
						console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
						return;
					}
					events.subscribe("processed", callback);
				},
				offProcessed: function offProcessed(callback) {
					events.unsubscribe("processed", callback);
				},
				setReaders: function setReaders(readers) {
					if (!readers) {
						console.trace("* warning: Quagga.setReaders called with no readers, ignoring");
						return;
					}
					instance.setReaders(readers);
				},
				registerReader: function registerReader(name, reader) {
					if (!name) {
						console.trace("* warning: Quagga.registerReader called with no name, ignoring");
						return;
					}
					if (!reader) {
						console.trace("* warning: Quagga.registerReader called with no reader, ignoring");
						return;
					}
					instance.registerReader(name, reader);
				},
				registerResultCollector: function registerResultCollector(resultCollector) {
					if (resultCollector && typeof resultCollector.addResult === "function") quagga_context.resultCollector = resultCollector;
				},
				get canvas() {
					return quagga_context.canvasContainer;
				},
				drawScannerArea: function drawScannerArea() {
					return instance.drawScannerArea();
				},
				decodeSingle: function decodeSingle(config, resultCallback) {
					var _this = this;
					var quaggaInstance = new quagga_Quagga();
					config = merge_default()({
						inputStream: {
							type: "ImageStream",
							sequence: false,
							size: 800,
							src: config.src
						},
						numOfWorkers: 1,
						locator: { halfSample: false }
					}, config);
					if (config.numOfWorkers > 0) config.numOfWorkers = 0;
					if (config.numOfWorkers > 0 && (typeof Blob === "undefined" || typeof Worker === "undefined")) {
						console.warn("* no Worker and/or Blob support - forcing numOfWorkers to 0");
						config.numOfWorkers = 0;
					}
					return new Promise(function(resolve, reject) {
						try {
							_this.init(config, function() {
								quagga_context.canvasContainer = quaggaInstance.context.canvasContainer;
								events.once("processed", function(result) {
									quaggaInstance.stop();
									if (resultCallback) resultCallback.call(null, result);
									resolve(result);
								}, true);
								quaggaInstance.start();
							}, null, quaggaInstance);
						} catch (err) {
							reject(err);
						}
					});
				},
				get default() {
					return QuaggaJSStaticInterface;
				},
				Readers: reader_namespaceObject,
				CameraAccess: camera_access,
				ImageDebug: image_debug,
				ImageWrapper: image_wrapper,
				ResultCollector: result_collector
			};
			__webpack_exports__["default"] = QuaggaJSStaticInterface;
		})
	])["default"]);
}));
//#endregion
export { require_quagga as t };
