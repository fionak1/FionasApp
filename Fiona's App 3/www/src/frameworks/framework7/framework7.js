/**
 * Framework7 5.7.14
 * Full featured mobile HTML framework for building iOS & Android apps
 * https://framework7.io/
 *
 * Copyright 2014-2020 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: November 9, 2020
 */

! function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).Framework7 = t()
}(this, (function () {
    "use strict";
    var t7ctx;
    t7ctx = "undefined" != typeof window ? window : "undefined" != typeof global ? global : void 0;
    var Template7Context = t7ctx,
        Template7Utils = {
            quoteSingleRexExp: new RegExp("'", "g"),
            quoteDoubleRexExp: new RegExp('"', "g"),
            isFunction: function (e) {
                return "function" == typeof e
            },
            escape: function (e) {
                return void 0 === e && (e = ""), e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
            },
            helperToSlices: function (e) {
                var t, r, a, n = Template7Utils.quoteDoubleRexExp,
                    o = Template7Utils.quoteSingleRexExp,
                    i = e.replace(/[{}#}]/g, "").trim().split(" "),
                    s = [];
                for (r = 0; r < i.length; r += 1) {
                    var l = i[r],
                        c = void 0,
                        u = void 0;
                    if (0 === r) s.push(l);
                    else if (0 === l.indexOf('"') || 0 === l.indexOf("'"))
                        if (c = 0 === l.indexOf('"') ? n : o, u = 0 === l.indexOf('"') ? '"' : "'", 2 === l.match(c).length) s.push(l);
                        else {
                            for (t = 0, a = r + 1; a < i.length; a += 1)
                                if (l += " " + i[a], i[a].indexOf(u) >= 0) {
                                    t = a, s.push(l);
                                    break
                                } t && (r = t)
                        }
                    else if (l.indexOf("=") > 0) {
                        var p = l.split("="),
                            d = p[0],
                            h = p[1];
                        if (c || (c = 0 === h.indexOf('"') ? n : o, u = 0 === h.indexOf('"') ? '"' : "'"), 2 !== h.match(c).length) {
                            for (t = 0, a = r + 1; a < i.length; a += 1)
                                if (h += " " + i[a], i[a].indexOf(u) >= 0) {
                                    t = a;
                                    break
                                } t && (r = t)
                        }
                        var f = [d, h.replace(c, "")];
                        s.push(f)
                    } else s.push(l)
                }
                return s
            },
            stringToBlocks: function (e) {
                var t, r, a = [];
                if (!e) return [];
                var n = e.split(/({{[^{^}]*}})/);
                for (t = 0; t < n.length; t += 1) {
                    var o = n[t];
                    if ("" !== o)
                        if (o.indexOf("{{") < 0) a.push({
                            type: "plain",
                            content: o
                        });
                        else {
                            if (o.indexOf("{/") >= 0) continue;
                            if ((o = o.replace(/{{([#/])*([ ])*/, "{{$1").replace(/([ ])*}}/, "}}")).indexOf("{#") < 0 && o.indexOf(" ") < 0 && o.indexOf("else") < 0) {
                                a.push({
                                    type: "variable",
                                    contextName: o.replace(/[{}]/g, "")
                                });
                                continue
                            }
                            var i = Template7Utils.helperToSlices(o),
                                s = i[0],
                                l = ">" === s,
                                c = [],
                                u = {};
                            for (r = 1; r < i.length; r += 1) {
                                var p = i[r];
                                Array.isArray(p) ? u[p[0]] = "false" !== p[1] && p[1] : c.push(p)
                            }
                            if (o.indexOf("{#") >= 0) {
                                var d = "",
                                    h = "",
                                    f = 0,
                                    v = void 0,
                                    m = !1,
                                    g = !1,
                                    b = 0;
                                for (r = t + 1; r < n.length; r += 1)
                                    if (n[r].indexOf("{{#") >= 0 && (b += 1), n[r].indexOf("{{/") >= 0 && (b -= 1), n[r].indexOf("{{#" + s) >= 0) d += n[r], g && (h += n[r]), f += 1;
                                    else if (n[r].indexOf("{{/" + s) >= 0) {
                                    if (!(f > 0)) {
                                        v = r, m = !0;
                                        break
                                    }
                                    f -= 1, d += n[r], g && (h += n[r])
                                } else n[r].indexOf("else") >= 0 && 0 === b ? g = !0 : (g || (d += n[r]), g && (h += n[r]));
                                m && (v && (t = v), "raw" === s ? a.push({
                                    type: "plain",
                                    content: d
                                }) : a.push({
                                    type: "helper",
                                    helperName: s,
                                    contextName: c,
                                    content: d,
                                    inverseContent: h,
                                    hash: u
                                }))
                            } else o.indexOf(" ") > 0 && (l && (s = "_partial", c[0] && (0 === c[0].indexOf("[") ? c[0] = c[0].replace(/[[\]]/g, "") : c[0] = '"' + c[0].replace(/"|'/g, "") + '"')), a.push({
                                type: "helper",
                                helperName: s,
                                contextName: c,
                                hash: u
                            }))
                        }
                }
                return a
            },
            parseJsVariable: function (e, t, r) {
                return e.split(/([+ \-*/^()&=|<>!%:?])/g).reduce((function (e, a) {
                    if (!a) return e;
                    if (a.indexOf(t) < 0) return e.push(a), e;
                    if (!r) return e.push(JSON.stringify("")), e;
                    var n = r;
                    return a.indexOf(t + ".") >= 0 && a.split(t + ".")[1].split(".").forEach((function (e) {
                        n = e in n ? n[e] : void 0
                    })), ("string" == typeof n || Array.isArray(n) || n.constructor && n.constructor === Object) && (n = JSON.stringify(n)), void 0 === n && (n = "undefined"), e.push(n), e
                }), []).join("")
            },
            parseJsParents: function (e, t) {
                return e.split(/([+ \-*^()&=|<>!%:?])/g).reduce((function (e, r) {
                    if (!r) return e;
                    if (r.indexOf("../") < 0) return e.push(r), e;
                    if (!t || 0 === t.length) return e.push(JSON.stringify("")), e;
                    var a = r.split("../").length - 1,
                        n = a > t.length ? t[t.length - 1] : t[a - 1];
                    return r.replace(/..\//g, "").split(".").forEach((function (e) {
                        n = void 0 !== n[e] ? n[e] : "undefined"
                    })), !1 === n || !0 === n ? (e.push(JSON.stringify(n)), e) : null === n || "undefined" === n ? (e.push(JSON.stringify("")), e) : (e.push(JSON.stringify(n)), e)
                }), []).join("")
            },
            getCompileVar: function (e, t, r) {
                void 0 === r && (r = "data_1");
                var a, n, o = t,
                    i = 0;
                0 === e.indexOf("../") ? (i = e.split("../").length - 1, n = o.split("_")[1] - i, o = "ctx_" + (n >= 1 ? n : 1), a = e.split("../")[i].split(".")) : 0 === e.indexOf("@global") ? (o = "Template7.global", a = e.split("@global.")[1].split(".")) : 0 === e.indexOf("@root") ? (o = "root", a = e.split("@root.")[1].split(".")) : a = e.split(".");
                for (var s = 0; s < a.length; s += 1) {
                    var l = a[s];
                    if (0 === l.indexOf("@")) {
                        var c = r.split("_")[1];
                        i > 0 && (c = n), s > 0 ? o += "[(data_" + c + " && data_" + c + "." + l.replace("@", "") + ")]" : o = "(data_" + c + " && data_" + c + "." + l.replace("@", "") + ")"
                    } else(Number.isFinite ? Number.isFinite(l) : Template7Context.isFinite(l)) ? o += "[" + l + "]" : "this" === l || l.indexOf("this.") >= 0 || l.indexOf("this[") >= 0 || l.indexOf("this(") >= 0 ? o = l.replace("this", t) : o += "." + l
                }
                return o
            },
            getCompiledArguments: function (e, t, r) {
                for (var a = [], n = 0; n < e.length; n += 1) /^['"]/.test(e[n]) || /^(true|false|\d+)$/.test(e[n]) ? a.push(e[n]) : a.push(Template7Utils.getCompileVar(e[n], t, r));
                return a.join(", ")
            }
        },
        Template7Helpers = {
            _partial: function (e, t) {
                var r = this,
                    a = Template7Class.partials[e];
                return !a || a && !a.template ? "" : (a.compiled || (a.compiled = new Template7Class(a.template).compile()), Object.keys(t.hash).forEach((function (e) {
                    r[e] = t.hash[e]
                })), a.compiled(r, t.data, t.root))
            },
            escape: function (e) {
                if (null == e) return "";
                if ("string" != typeof e) throw new Error('Template7: Passed context to "escape" helper should be a string');
                return Template7Utils.escape(e)
            },
            if: function (e, t) {
                var r = e;
                return Template7Utils.isFunction(r) && (r = r.call(this)), r ? t.fn(this, t.data) : t.inverse(this, t.data)
            },
            unless: function (e, t) {
                var r = e;
                return Template7Utils.isFunction(r) && (r = r.call(this)), r ? t.inverse(this, t.data) : t.fn(this, t.data)
            },
            each: function (e, t) {
                var r = e,
                    a = "",
                    n = 0;
                if (Template7Utils.isFunction(r) && (r = r.call(this)), Array.isArray(r)) {
                    for (t.hash.reverse && (r = r.reverse()), n = 0; n < r.length; n += 1) a += t.fn(r[n], {
                        first: 0 === n,
                        last: n === r.length - 1,
                        index: n
                    });
                    t.hash.reverse && (r = r.reverse())
                } else
                    for (var o in r) n += 1, a += t.fn(r[o], {
                        key: o
                    });
                return n > 0 ? a : t.inverse(this)
            },
            with: function (e, t) {
                var r = e;
                return Template7Utils.isFunction(r) && (r = e.call(this)), t.fn(r)
            },
            join: function (e, t) {
                var r = e;
                return Template7Utils.isFunction(r) && (r = r.call(this)), r.join(t.hash.delimiter || t.hash.delimeter)
            },
            js: function js(expression, options) {
                var data = options.data,
                    func, execute = expression;
                return "index first last key".split(" ").forEach((function (e) {
                    if (void 0 !== data[e]) {
                        var t = new RegExp("this.@" + e, "g"),
                            r = new RegExp("@" + e, "g");
                        execute = execute.replace(t, JSON.stringify(data[e])).replace(r, JSON.stringify(data[e]))
                    }
                })), options.root && execute.indexOf("@root") >= 0 && (execute = Template7Utils.parseJsVariable(execute, "@root", options.root)), execute.indexOf("@global") >= 0 && (execute = Template7Utils.parseJsVariable(execute, "@global", Template7Context.Template7.global)), execute.indexOf("../") >= 0 && (execute = Template7Utils.parseJsParents(execute, options.parents)), func = execute.indexOf("return") >= 0 ? "(function(){" + execute + "})" : "(function(){return (" + execute + ")})", eval(func).call(this)
            },
            js_if: function js_if(expression, options) {
                var data = options.data,
                    func, execute = expression;
                "index first last key".split(" ").forEach((function (e) {
                    if (void 0 !== data[e]) {
                        var t = new RegExp("this.@" + e, "g"),
                            r = new RegExp("@" + e, "g");
                        execute = execute.replace(t, JSON.stringify(data[e])).replace(r, JSON.stringify(data[e]))
                    }
                })), options.root && execute.indexOf("@root") >= 0 && (execute = Template7Utils.parseJsVariable(execute, "@root", options.root)), execute.indexOf("@global") >= 0 && (execute = Template7Utils.parseJsVariable(execute, "@global", Template7Context.Template7.global)), execute.indexOf("../") >= 0 && (execute = Template7Utils.parseJsParents(execute, options.parents)), func = execute.indexOf("return") >= 0 ? "(function(){" + execute + "})" : "(function(){return (" + execute + ")})";
                var condition = eval(func).call(this);
                return condition ? options.fn(this, options.data) : options.inverse(this, options.data)
            }
        };
    Template7Helpers.js_compare = Template7Helpers.js_if;
    var Template7Options = {},
        Template7Partials = {},
        Template7Class = function (e) {
            this.template = e
        },
        staticAccessors = {
            options: {
                configurable: !0
            },
            partials: {
                configurable: !0
            },
            helpers: {
                configurable: !0
            }
        };

    function Template7() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        var r = e[0],
            a = e[1];
        if (2 === e.length) {
            var n = new Template7Class(r),
                o = n.compile()(a);
            return n = null, o
        }
        return new Template7Class(r)
    }

    function isObject(e) {
        return null !== e && "object" == typeof e && "constructor" in e && e.constructor === Object
    }

    function extend(e, t) {
        void 0 === e && (e = {}), void 0 === t && (t = {}), Object.keys(t).forEach((function (r) {
            void 0 === e[r] ? e[r] = t[r] : isObject(t[r]) && isObject(e[r]) && Object.keys(t[r]).length > 0 && extend(e[r], t[r])
        }))
    }
    Template7Class.prototype.compile = function compile(template, depth) {
        void 0 === template && (template = this.template), void 0 === depth && (depth = 1);
        var t = this;
        if (t.compiled) return t.compiled;
        if ("string" != typeof template) throw new Error("Template7: Template must be a string");
        var stringToBlocks = Template7Utils.stringToBlocks,
            getCompileVar = Template7Utils.getCompileVar,
            getCompiledArguments = Template7Utils.getCompiledArguments,
            blocks = stringToBlocks(template),
            ctx = "ctx_" + depth,
            data = "data_" + depth;
        if (0 === blocks.length) return function () {
            return ""
        };

        function getCompileFn(e, r) {
            return e.content ? t.compile(e.content, r) : function () {
                return ""
            }
        }

        function getCompileInverse(e, r) {
            return e.inverseContent ? t.compile(e.inverseContent, r) : function () {
                return ""
            }
        }
        var resultString = "",
            i;
        for (resultString += 1 === depth ? "(function (" + ctx + ", " + data + ", root) {\n" : "(function (" + ctx + ", " + data + ") {\n", 1 === depth && (resultString += "function isArray(arr){return Array.isArray(arr);}\n", resultString += "function isFunction(func){return (typeof func === 'function');}\n", resultString += 'function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n', resultString += "root = root || ctx_1 || {};\n"), resultString += "var r = '';\n", i = 0; i < blocks.length; i += 1) {
            var block = blocks[i];
            if ("plain" !== block.type) {
                var variable = void 0,
                    compiledArguments = void 0;
                if ("variable" === block.type && (variable = getCompileVar(block.contextName, ctx, data), resultString += "r += c(" + variable + ", " + ctx + ");"), "helper" === block.type) {
                    var parents = void 0;
                    if ("ctx_1" !== ctx) {
                        for (var level = ctx.split("_")[1], parentsString = "ctx_" + (level - 1), j = level - 2; j >= 1; j -= 1) parentsString += ", ctx_" + j;
                        parents = "[" + parentsString + "]"
                    } else parents = "[" + ctx + "]";
                    var dynamicHelper = void 0;
                    if (0 === block.helperName.indexOf("[") && (block.helperName = getCompileVar(block.helperName.replace(/[[\]]/g, ""), ctx, data), dynamicHelper = !0), dynamicHelper || block.helperName in Template7Helpers) compiledArguments = getCompiledArguments(block.contextName, ctx, data), resultString += "r += (Template7Helpers" + (dynamicHelper ? "[" + block.helperName + "]" : "." + block.helperName) + ").call(" + ctx + ", " + (compiledArguments && compiledArguments + ", ") + "{hash:" + JSON.stringify(block.hash) + ", data: " + data + " || {}, fn: " + getCompileFn(block, depth + 1) + ", inverse: " + getCompileInverse(block, depth + 1) + ", root: root, parents: " + parents + "});";
                    else {
                        if (block.contextName.length > 0) throw new Error('Template7: Missing helper: "' + block.helperName + '"');
                        variable = getCompileVar(block.helperName, ctx, data), resultString += "if (" + variable + ") {", resultString += "if (isArray(" + variable + ")) {", resultString += "r += (Template7Helpers.each).call(" + ctx + ", " + variable + ", {hash:" + JSON.stringify(block.hash) + ", data: " + data + " || {}, fn: " + getCompileFn(block, depth + 1) + ", inverse: " + getCompileInverse(block, depth + 1) + ", root: root, parents: " + parents + "});", resultString += "}else {", resultString += "r += (Template7Helpers.with).call(" + ctx + ", " + variable + ", {hash:" + JSON.stringify(block.hash) + ", data: " + data + " || {}, fn: " + getCompileFn(block, depth + 1) + ", inverse: " + getCompileInverse(block, depth + 1) + ", root: root, parents: " + parents + "});", resultString += "}}"
                    }
                }
            } else resultString += "r +='" + block.content.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/'/g, "\\'") + "';"
        }
        return resultString += "\nreturn r;})", 1 === depth ? (t.compiled = eval(resultString), t.compiled) : resultString
    }, staticAccessors.options.get = function () {
        return Template7Options
    }, staticAccessors.partials.get = function () {
        return Template7Partials
    }, staticAccessors.helpers.get = function () {
        return Template7Helpers
    }, Object.defineProperties(Template7Class, staticAccessors), Template7.registerHelper = function (e, t) {
        Template7Class.helpers[e] = t
    }, Template7.unregisterHelper = function (e) {
        Template7Class.helpers[e] = void 0, delete Template7Class.helpers[e]
    }, Template7.registerPartial = function (e, t) {
        Template7Class.partials[e] = {
            template: t
        }
    }, Template7.unregisterPartial = function (e) {
        Template7Class.partials[e] && (Template7Class.partials[e] = void 0, delete Template7Class.partials[e])
    }, Template7.compile = function (e, t) {
        return new Template7Class(e, t).compile()
    }, Template7.options = Template7Class.options, Template7.helpers = Template7Class.helpers, Template7.partials = Template7Class.partials;
    var doc = "undefined" != typeof document ? document : {},
        ssrDocument = {
            body: {},
            addEventListener: function () {},
            removeEventListener: function () {},
            activeElement: {
                blur: function () {},
                nodeName: ""
            },
            querySelector: function () {
                return null
            },
            querySelectorAll: function () {
                return []
            },
            getElementById: function () {
                return null
            },
            createEvent: function () {
                return {
                    initEvent: function () {}
                }
            },
            createElement: function () {
                return {
                    children: [],
                    childNodes: [],
                    style: {},
                    setAttribute: function () {},
                    getElementsByTagName: function () {
                        return []
                    }
                }
            },
            createElementNS: function () {
                return {}
            },
            importNode: function () {
                return null
            },
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            }
        };
    extend(doc, ssrDocument);
    var win = "undefined" != typeof window ? window : {},
        ssrWindow = {
            document: ssrDocument,
            navigator: {
                userAgent: ""
            },
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            },
            history: {
                replaceState: function () {},
                pushState: function () {},
                go: function () {},
                back: function () {}
            },
            CustomEvent: function () {
                return this
            },
            addEventListener: function () {},
            removeEventListener: function () {},
            getComputedStyle: function () {
                return {
                    getPropertyValue: function () {
                        return ""
                    }
                }
            },
            Image: function () {},
            Date: function () {},
            screen: {},
            setTimeout: function () {},
            clearTimeout: function () {},
            matchMedia: function () {
                return {}
            }
        };
    extend(win, ssrWindow);
    var Dom7 = function (e) {
        for (var t = 0; t < e.length; t += 1) this[t] = e[t];
        return this.length = e.length, this
    };

    function $(e, t) {
        var r = [],
            a = 0;
        if (e && !t && e instanceof Dom7) return e;
        if (e)
            if ("string" == typeof e) {
                var n, o, i = e.trim();
                if (i.indexOf("<") >= 0 && i.indexOf(">") >= 0) {
                    var s = "div";
                    for (0 === i.indexOf("<li") && (s = "ul"), 0 === i.indexOf("<tr") && (s = "tbody"), 0 !== i.indexOf("<td") && 0 !== i.indexOf("<th") || (s = "tr"), 0 === i.indexOf("<tbody") && (s = "table"), 0 === i.indexOf("<option") && (s = "select"), (o = doc.createElement(s)).innerHTML = i, a = 0; a < o.childNodes.length; a += 1) r.push(o.childNodes[a])
                } else
                    for (n = t || "#" !== e[0] || e.match(/[ .<>:~]/) ? (t || doc).querySelectorAll(e.trim()) : [doc.getElementById(e.trim().split("#")[1])], a = 0; a < n.length; a += 1) n[a] && r.push(n[a])
            } else if (e.nodeType || e === win || e === doc) r.push(e);
        else if (e.length > 0 && e[0].nodeType)
            for (a = 0; a < e.length; a += 1) r.push(e[a]);
        return new Dom7(r)
    }

    function unique(e) {
        for (var t = [], r = 0; r < e.length; r += 1) - 1 === t.indexOf(e[r]) && t.push(e[r]);
        return t
    }

    function toCamelCase(e) {
        return e.toLowerCase().replace(/-(.)/g, (function (e, t) {
            return t.toUpperCase()
        }))
    }

    function requestAnimationFrame(e) {
        return win.requestAnimationFrame ? win.requestAnimationFrame(e) : win.webkitRequestAnimationFrame ? win.webkitRequestAnimationFrame(e) : win.setTimeout(e, 1e3 / 60)
    }

    function cancelAnimationFrame(e) {
        return win.cancelAnimationFrame ? win.cancelAnimationFrame(e) : win.webkitCancelAnimationFrame ? win.webkitCancelAnimationFrame(e) : win.clearTimeout(e)
    }

    function addClass(e) {
        if (void 0 === e) return this;
        for (var t = e.split(" "), r = 0; r < t.length; r += 1)
            for (var a = 0; a < this.length; a += 1) void 0 !== this[a] && void 0 !== this[a].classList && this[a].classList.add(t[r]);
        return this
    }

    function removeClass(e) {
        for (var t = e.split(" "), r = 0; r < t.length; r += 1)
            for (var a = 0; a < this.length; a += 1) void 0 !== this[a] && void 0 !== this[a].classList && this[a].classList.remove(t[r]);
        return this
    }

    function hasClass(e) {
        return !!this[0] && this[0].classList.contains(e)
    }

    function toggleClass(e) {
        for (var t = e.split(" "), r = 0; r < t.length; r += 1)
            for (var a = 0; a < this.length; a += 1) void 0 !== this[a] && void 0 !== this[a].classList && this[a].classList.toggle(t[r]);
        return this
    }

    function attr(e, t) {
        var r = arguments;
        if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;
        for (var a = 0; a < this.length; a += 1)
            if (2 === r.length) this[a].setAttribute(e, t);
            else
                for (var n in e) this[a][n] = e[n], this[a].setAttribute(n, e[n]);
        return this
    }

    function removeAttr(e) {
        for (var t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
        return this
    }

    function prop(e, t) {
        var r = arguments;
        if (1 !== arguments.length || "string" != typeof e) {
            for (var a = 0; a < this.length; a += 1)
                if (2 === r.length) this[a][e] = t;
                else
                    for (var n in e) this[a][n] = e[n];
            return this
        }
        if (this[0]) return this[0][e]
    }

    function data(e, t) {
        var r;
        if (void 0 !== t) {
            for (var a = 0; a < this.length; a += 1)(r = this[a]).dom7ElementDataStorage || (r.dom7ElementDataStorage = {}), r.dom7ElementDataStorage[e] = t;
            return this
        }
        if (r = this[0]) {
            if (r.dom7ElementDataStorage && e in r.dom7ElementDataStorage) return r.dom7ElementDataStorage[e];
            var n = r.getAttribute("data-" + e);
            return n || void 0
        }
    }

    function removeData(e) {
        for (var t = 0; t < this.length; t += 1) {
            var r = this[t];
            r.dom7ElementDataStorage && r.dom7ElementDataStorage[e] && (r.dom7ElementDataStorage[e] = null, delete r.dom7ElementDataStorage[e])
        }
    }

    function dataset() {
        var e = this[0];
        if (e) {
            var t = {};
            if (e.dataset)
                for (var r in e.dataset) t[r] = e.dataset[r];
            else
                for (var a = 0; a < e.attributes.length; a += 1) {
                    var n = e.attributes[a];
                    n.name.indexOf("data-") >= 0 && (t[toCamelCase(n.name.split("data-")[1])] = n.value)
                }
            for (var o in t) "false" === t[o] ? t[o] = !1 : "true" === t[o] ? t[o] = !0 : parseFloat(t[o]) === 1 * t[o] && (t[o] *= 1);
            return t
        }
    }

    function val(e) {
        if (void 0 !== e) {
            for (var t = 0; t < this.length; t += 1) {
                var r = this[t];
                if (Array.isArray(e) && r.multiple && "select" === r.nodeName.toLowerCase())
                    for (var a = 0; a < r.options.length; a += 1) r.options[a].selected = e.indexOf(r.options[a].value) >= 0;
                else r.value = e
            }
            return this
        }
        if (this[0]) {
            if (this[0].multiple && "select" === this[0].nodeName.toLowerCase()) {
                for (var n = [], o = 0; o < this[0].selectedOptions.length; o += 1) n.push(this[0].selectedOptions[o].value);
                return n
            }
            return this[0].value
        }
    }

    function transform(e) {
        for (var t = 0; t < this.length; t += 1) {
            var r = this[t].style;
            r.webkitTransform = e, r.transform = e
        }
        return this
    }

    function transition(e) {
        "string" != typeof e && (e += "ms");
        for (var t = 0; t < this.length; t += 1) {
            var r = this[t].style;
            r.webkitTransitionDuration = e, r.transitionDuration = e
        }
        return this
    }

    function on() {
        for (var e, t = [], r = arguments.length; r--;) t[r] = arguments[r];
        var a = t[0],
            n = t[1],
            o = t[2],
            i = t[3];

        function s(e) {
            var t = e.target;
            if (t) {
                var r = e.target.dom7EventData || [];
                if (r.indexOf(e) < 0 && r.unshift(e), $(t).is(n)) o.apply(t, r);
                else
                    for (var a = $(t).parents(), i = 0; i < a.length; i += 1) $(a[i]).is(n) && o.apply(a[i], r)
            }
        }

        function l(e) {
            var t = e && e.target && e.target.dom7EventData || [];
            t.indexOf(e) < 0 && t.unshift(e), o.apply(this, t)
        }
        "function" == typeof t[1] && (a = (e = t)[0], o = e[1], i = e[2], n = void 0), i || (i = !1);
        for (var c, u = a.split(" "), p = 0; p < this.length; p += 1) {
            var d = this[p];
            if (n)
                for (c = 0; c < u.length; c += 1) {
                    var h = u[c];
                    d.dom7LiveListeners || (d.dom7LiveListeners = {}), d.dom7LiveListeners[h] || (d.dom7LiveListeners[h] = []), d.dom7LiveListeners[h].push({
                        listener: o,
                        proxyListener: s
                    }), d.addEventListener(h, s, i)
                } else
                    for (c = 0; c < u.length; c += 1) {
                        var f = u[c];
                        d.dom7Listeners || (d.dom7Listeners = {}), d.dom7Listeners[f] || (d.dom7Listeners[f] = []), d.dom7Listeners[f].push({
                            listener: o,
                            proxyListener: l
                        }), d.addEventListener(f, l, i)
                    }
        }
        return this
    }

    function off() {
        for (var e, t = [], r = arguments.length; r--;) t[r] = arguments[r];
        var a = t[0],
            n = t[1],
            o = t[2],
            i = t[3];
        "function" == typeof t[1] && (a = (e = t)[0], o = e[1], i = e[2], n = void 0), i || (i = !1);
        for (var s = a.split(" "), l = 0; l < s.length; l += 1)
            for (var c = s[l], u = 0; u < this.length; u += 1) {
                var p = this[u],
                    d = void 0;
                if (!n && p.dom7Listeners ? d = p.dom7Listeners[c] : n && p.dom7LiveListeners && (d = p.dom7LiveListeners[c]), d && d.length)
                    for (var h = d.length - 1; h >= 0; h -= 1) {
                        var f = d[h];
                        o && f.listener === o || o && f.listener && f.listener.dom7proxy && f.listener.dom7proxy === o ? (p.removeEventListener(c, f.proxyListener, i), d.splice(h, 1)) : o || (p.removeEventListener(c, f.proxyListener, i), d.splice(h, 1))
                    }
            }
        return this
    }

    function once() {
        for (var e, t = [], r = arguments.length; r--;) t[r] = arguments[r];
        var a = this,
            n = t[0],
            o = t[1],
            i = t[2],
            s = t[3];

        function l() {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            i.apply(this, e), a.off(n, o, l, s), l.dom7proxy && delete l.dom7proxy
        }
        return "function" == typeof t[1] && (n = (e = t)[0], i = e[1], s = e[2], o = void 0), l.dom7proxy = i, a.on(n, o, l, s)
    }

    function trigger() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        for (var r = e[0].split(" "), a = e[1], n = 0; n < r.length; n += 1)
            for (var o = r[n], i = 0; i < this.length; i += 1) {
                var s = this[i],
                    l = void 0;
                try {
                    l = new win.CustomEvent(o, {
                        detail: a,
                        bubbles: !0,
                        cancelable: !0
                    })
                } catch (e) {
                    (l = doc.createEvent("Event")).initEvent(o, !0, !0), l.detail = a
                }
                s.dom7EventData = e.filter((function (e, t) {
                    return t > 0
                })), s.dispatchEvent(l), s.dom7EventData = [], delete s.dom7EventData
            }
        return this
    }

    function transitionEnd(e) {
        var t, r = ["webkitTransitionEnd", "transitionend"],
            a = this;

        function n(o) {
            if (o.target === this)
                for (e.call(this, o), t = 0; t < r.length; t += 1) a.off(r[t], n)
        }
        if (e)
            for (t = 0; t < r.length; t += 1) a.on(r[t], n);
        return this
    }

    function animationEnd(e) {
        var t, r = ["webkitAnimationEnd", "animationend"],
            a = this;

        function n(o) {
            if (o.target === this)
                for (e.call(this, o), t = 0; t < r.length; t += 1) a.off(r[t], n)
        }
        if (e)
            for (t = 0; t < r.length; t += 1) a.on(r[t], n);
        return this
    }

    function width() {
        return this[0] === win ? win.innerWidth : this.length > 0 ? parseFloat(this.css("width")) : null
    }

    function outerWidth(e) {
        if (this.length > 0) {
            if (e) {
                var t = this.styles();
                return this[0].offsetWidth + parseFloat(t.getPropertyValue("margin-right")) + parseFloat(t.getPropertyValue("margin-left"))
            }
            return this[0].offsetWidth
        }
        return null
    }

    function height() {
        return this[0] === win ? win.innerHeight : this.length > 0 ? parseFloat(this.css("height")) : null
    }

    function outerHeight(e) {
        if (this.length > 0) {
            if (e) {
                var t = this.styles();
                return this[0].offsetHeight + parseFloat(t.getPropertyValue("margin-top")) + parseFloat(t.getPropertyValue("margin-bottom"))
            }
            return this[0].offsetHeight
        }
        return null
    }

    function offset() {
        if (this.length > 0) {
            var e = this[0],
                t = e.getBoundingClientRect(),
                r = doc.body,
                a = e.clientTop || r.clientTop || 0,
                n = e.clientLeft || r.clientLeft || 0,
                o = e === win ? win.scrollY : e.scrollTop,
                i = e === win ? win.scrollX : e.scrollLeft;
            return {
                top: t.top + o - a,
                left: t.left + i - n
            }
        }
        return null
    }

    function hide() {
        for (var e = 0; e < this.length; e += 1) this[e].style.display = "none";
        return this
    }

    function show() {
        for (var e = 0; e < this.length; e += 1) {
            var t = this[e];
            "none" === t.style.display && (t.style.display = ""), "none" === win.getComputedStyle(t, null).getPropertyValue("display") && (t.style.display = "block")
        }
        return this
    }

    function styles() {
        return this[0] ? win.getComputedStyle(this[0], null) : {}
    }

    function css(e, t) {
        var r;
        if (1 === arguments.length) {
            if ("string" != typeof e) {
                for (r = 0; r < this.length; r += 1)
                    for (var a in e) this[r].style[a] = e[a];
                return this
            }
            if (this[0]) return win.getComputedStyle(this[0], null).getPropertyValue(e)
        }
        if (2 === arguments.length && "string" == typeof e) {
            for (r = 0; r < this.length; r += 1) this[r].style[e] = t;
            return this
        }
        return this
    }

    function toArray() {
        for (var e = [], t = 0; t < this.length; t += 1) e.push(this[t]);
        return e
    }

    function each(e) {
        if (!e) return this;
        for (var t = 0; t < this.length; t += 1)
            if (!1 === e.call(this[t], t, this[t])) return this;
        return this
    }

    function forEach(e) {
        if (!e) return this;
        for (var t = 0; t < this.length; t += 1)
            if (!1 === e.call(this[t], this[t], t)) return this;
        return this
    }

    function filter(e) {
        for (var t = [], r = 0; r < this.length; r += 1) e.call(this[r], r, this[r]) && t.push(this[r]);
        return new Dom7(t)
    }

    function map(e) {
        for (var t = [], r = 0; r < this.length; r += 1) t.push(e.call(this[r], r, this[r]));
        return new Dom7(t)
    }

    function html(e) {
        if (void 0 === e) return this[0] ? this[0].innerHTML : void 0;
        for (var t = 0; t < this.length; t += 1) this[t].innerHTML = e;
        return this
    }

    function text(e) {
        if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
        for (var t = 0; t < this.length; t += 1) this[t].textContent = e;
        return this
    }

    function is(e) {
        var t, r, a = this[0];
        if (!a || void 0 === e) return !1;
        if ("string" == typeof e) {
            if (a.matches) return a.matches(e);
            if (a.webkitMatchesSelector) return a.webkitMatchesSelector(e);
            if (a.msMatchesSelector) return a.msMatchesSelector(e);
            for (t = $(e), r = 0; r < t.length; r += 1)
                if (t[r] === a) return !0;
            return !1
        }
        if (e === doc) return a === doc;
        if (e === win) return a === win;
        if (e.nodeType || e instanceof Dom7) {
            for (t = e.nodeType ? [e] : e, r = 0; r < t.length; r += 1)
                if (t[r] === a) return !0;
            return !1
        }
        return !1
    }

    function indexOf(e) {
        for (var t = 0; t < this.length; t += 1)
            if (this[t] === e) return t;
        return -1
    }

    function index() {
        var e, t = this[0];
        if (t) {
            for (e = 0; null !== (t = t.previousSibling);) 1 === t.nodeType && (e += 1);
            return e
        }
    }

    function eq(e) {
        if (void 0 === e) return this;
        var t, r = this.length;
        return new Dom7(e > r - 1 ? [] : e < 0 ? (t = r + e) < 0 ? [] : [this[t]] : [this[e]])
    }

    function append() {
        for (var e, t = [], r = arguments.length; r--;) t[r] = arguments[r];
        for (var a = 0; a < t.length; a += 1) {
            e = t[a];
            for (var n = 0; n < this.length; n += 1)
                if ("string" == typeof e) {
                    var o = doc.createElement("div");
                    for (o.innerHTML = e; o.firstChild;) this[n].appendChild(o.firstChild)
                } else if (e instanceof Dom7)
                for (var i = 0; i < e.length; i += 1) this[n].appendChild(e[i]);
            else this[n].appendChild(e)
        }
        return this
    }

    function appendTo(e) {
        return $(e).append(this), this
    }

    function prepend(e) {
        var t, r;
        for (t = 0; t < this.length; t += 1)
            if ("string" == typeof e) {
                var a = doc.createElement("div");
                for (a.innerHTML = e, r = a.childNodes.length - 1; r >= 0; r -= 1) this[t].insertBefore(a.childNodes[r], this[t].childNodes[0])
            } else if (e instanceof Dom7)
            for (r = 0; r < e.length; r += 1) this[t].insertBefore(e[r], this[t].childNodes[0]);
        else this[t].insertBefore(e, this[t].childNodes[0]);
        return this
    }

    function prependTo(e) {
        return $(e).prepend(this), this
    }

    function insertBefore(e) {
        for (var t = $(e), r = 0; r < this.length; r += 1)
            if (1 === t.length) t[0].parentNode.insertBefore(this[r], t[0]);
            else if (t.length > 1)
            for (var a = 0; a < t.length; a += 1) t[a].parentNode.insertBefore(this[r].cloneNode(!0), t[a])
    }

    function insertAfter(e) {
        for (var t = $(e), r = 0; r < this.length; r += 1)
            if (1 === t.length) t[0].parentNode.insertBefore(this[r], t[0].nextSibling);
            else if (t.length > 1)
            for (var a = 0; a < t.length; a += 1) t[a].parentNode.insertBefore(this[r].cloneNode(!0), t[a].nextSibling)
    }

    function next(e) {
        return this.length > 0 ? e ? this[0].nextElementSibling && $(this[0].nextElementSibling).is(e) ? new Dom7([this[0].nextElementSibling]) : new Dom7([]) : this[0].nextElementSibling ? new Dom7([this[0].nextElementSibling]) : new Dom7([]) : new Dom7([])
    }

    function nextAll(e) {
        var t = [],
            r = this[0];
        if (!r) return new Dom7([]);
        for (; r.nextElementSibling;) {
            var a = r.nextElementSibling;
            e ? $(a).is(e) && t.push(a) : t.push(a), r = a
        }
        return new Dom7(t)
    }

    function prev(e) {
        if (this.length > 0) {
            var t = this[0];
            return e ? t.previousElementSibling && $(t.previousElementSibling).is(e) ? new Dom7([t.previousElementSibling]) : new Dom7([]) : t.previousElementSibling ? new Dom7([t.previousElementSibling]) : new Dom7([])
        }
        return new Dom7([])
    }

    function prevAll(e) {
        var t = [],
            r = this[0];
        if (!r) return new Dom7([]);
        for (; r.previousElementSibling;) {
            var a = r.previousElementSibling;
            e ? $(a).is(e) && t.push(a) : t.push(a), r = a
        }
        return new Dom7(t)
    }

    function siblings(e) {
        return this.nextAll(e).add(this.prevAll(e))
    }

    function parent(e) {
        for (var t = [], r = 0; r < this.length; r += 1) null !== this[r].parentNode && (e ? $(this[r].parentNode).is(e) && t.push(this[r].parentNode) : t.push(this[r].parentNode));
        return $(unique(t))
    }

    function parents(e) {
        for (var t = [], r = 0; r < this.length; r += 1)
            for (var a = this[r].parentNode; a;) e ? $(a).is(e) && t.push(a) : t.push(a), a = a.parentNode;
        return $(unique(t))
    }

    function closest(e) {
        var t = this;
        return void 0 === e ? new Dom7([]) : (t.is(e) || (t = t.parents(e).eq(0)), t)
    }

    function find(e) {
        for (var t = [], r = 0; r < this.length; r += 1)
            for (var a = this[r].querySelectorAll(e), n = 0; n < a.length; n += 1) t.push(a[n]);
        return new Dom7(t)
    }

    function children(e) {
        for (var t = [], r = 0; r < this.length; r += 1)
            for (var a = this[r].childNodes, n = 0; n < a.length; n += 1) e ? 1 === a[n].nodeType && $(a[n]).is(e) && t.push(a[n]) : 1 === a[n].nodeType && t.push(a[n]);
        return new Dom7(unique(t))
    }

    function remove() {
        for (var e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]);
        return this
    }

    function detach() {
        return this.remove()
    }

    function add() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        var r, a, n = this;
        for (r = 0; r < e.length; r += 1) {
            var o = $(e[r]);
            for (a = 0; a < o.length; a += 1) n[n.length] = o[a], n.length += 1
        }
        return n
    }

    function empty() {
        for (var e = 0; e < this.length; e += 1) {
            var t = this[e];
            if (1 === t.nodeType) {
                for (var r = 0; r < t.childNodes.length; r += 1) t.childNodes[r].parentNode && t.childNodes[r].parentNode.removeChild(t.childNodes[r]);
                t.textContent = ""
            }
        }
        return this
    }
    $.fn = Dom7.prototype, $.Class = Dom7, $.Dom7 = Dom7;
    var Methods = Object.freeze({
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        toggleClass: toggleClass,
        attr: attr,
        removeAttr: removeAttr,
        prop: prop,
        data: data,
        removeData: removeData,
        dataset: dataset,
        val: val,
        transform: transform,
        transition: transition,
        on: on,
        off: off,
        once: once,
        trigger: trigger,
        transitionEnd: transitionEnd,
        animationEnd: animationEnd,
        width: width,
        outerWidth: outerWidth,
        height: height,
        outerHeight: outerHeight,
        offset: offset,
        hide: hide,
        show: show,
        styles: styles,
        css: css,
        toArray: toArray,
        each: each,
        forEach: forEach,
        filter: filter,
        map: map,
        html: html,
        text: text,
        is: is,
        indexOf: indexOf,
        index: index,
        eq: eq,
        append: append,
        appendTo: appendTo,
        prepend: prepend,
        prependTo: prependTo,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        next: next,
        nextAll: nextAll,
        prev: prev,
        prevAll: prevAll,
        siblings: siblings,
        parent: parent,
        parents: parents,
        closest: closest,
        find: find,
        children: children,
        remove: remove,
        detach: detach,
        add: add,
        empty: empty
    });

    function scrollTo() {
        for (var e, t = [], r = arguments.length; r--;) t[r] = arguments[r];
        var a = t[0],
            n = t[1],
            o = t[2],
            i = t[3],
            s = t[4];
        return 4 === t.length && "function" == typeof i && (s = i, a = (e = t)[0], n = e[1], o = e[2], s = e[3], i = e[4]), void 0 === i && (i = "swing"), this.each((function () {
            var e, t, r, l, c, u, p, d, h = this,
                f = n > 0 || 0 === n,
                v = a > 0 || 0 === a;
            if (void 0 === i && (i = "swing"), f && (e = h.scrollTop, o || (h.scrollTop = n)), v && (t = h.scrollLeft, o || (h.scrollLeft = a)), o) {
                f && (r = h.scrollHeight - h.offsetHeight, c = Math.max(Math.min(n, r), 0)), v && (l = h.scrollWidth - h.offsetWidth, u = Math.max(Math.min(a, l), 0));
                var m = null;
                f && c === e && (f = !1), v && u === t && (v = !1), requestAnimationFrame((function r(a) {
                    void 0 === a && (a = (new Date).getTime()), null === m && (m = a);
                    var n, l = Math.max(Math.min((a - m) / o, 1), 0),
                        g = "linear" === i ? l : .5 - Math.cos(l * Math.PI) / 2;
                    f && (p = e + g * (c - e)), v && (d = t + g * (u - t)), f && c > e && p >= c && (h.scrollTop = c, n = !0), f && c < e && p <= c && (h.scrollTop = c, n = !0), v && u > t && d >= u && (h.scrollLeft = u, n = !0), v && u < t && d <= u && (h.scrollLeft = u, n = !0), n ? s && s() : (f && (h.scrollTop = p), v && (h.scrollLeft = d), requestAnimationFrame(r))
                }))
            }
        }))
    }

    function scrollTop() {
        for (var e, t = [], r = arguments.length; r--;) t[r] = arguments[r];
        var a = t[0],
            n = t[1],
            o = t[2],
            i = t[3];
        3 === t.length && "function" == typeof o && (a = (e = t)[0], n = e[1], i = e[2], o = e[3]);
        var s = this;
        return void 0 === a ? s.length > 0 ? s[0].scrollTop : null : s.scrollTo(void 0, a, n, o, i)
    }

    function scrollLeft() {
        for (var e, t = [], r = arguments.length; r--;) t[r] = arguments[r];
        var a = t[0],
            n = t[1],
            o = t[2],
            i = t[3];
        3 === t.length && "function" == typeof o && (a = (e = t)[0], n = e[1], i = e[2], o = e[3]);
        var s = this;
        return void 0 === a ? s.length > 0 ? s[0].scrollLeft : null : s.scrollTo(a, void 0, n, o, i)
    }
    var Scroll = Object.freeze({
        scrollTo: scrollTo,
        scrollTop: scrollTop,
        scrollLeft: scrollLeft
    });

    function animate(e, t) {
        var r, a = this,
            n = {
                props: Object.assign({}, e),
                params: Object.assign({
                    duration: 300,
                    easing: "swing"
                }, t),
                elements: a,
                animating: !1,
                que: [],
                easingProgress: function (e, t) {
                    return "swing" === e ? .5 - Math.cos(t * Math.PI) / 2 : "function" == typeof e ? e(t) : t
                },
                stop: function () {
                    n.frameId && cancelAnimationFrame(n.frameId), n.animating = !1, n.elements.each((function (e, t) {
                        delete t.dom7AnimateInstance
                    })), n.que = []
                },
                done: function (e) {
                    if (n.animating = !1, n.elements.each((function (e, t) {
                            delete t.dom7AnimateInstance
                        })), e && e(a), n.que.length > 0) {
                        var t = n.que.shift();
                        n.animate(t[0], t[1])
                    }
                },
                animate: function (e, t) {
                    if (n.animating) return n.que.push([e, t]), n;
                    var r = [];
                    n.elements.each((function (t, a) {
                        var o, i, s, l, c;
                        a.dom7AnimateInstance || (n.elements[t].dom7AnimateInstance = n), r[t] = {
                            container: a
                        }, Object.keys(e).forEach((function (n) {
                            o = win.getComputedStyle(a, null).getPropertyValue(n).replace(",", "."), i = parseFloat(o), s = o.replace(i, ""), l = parseFloat(e[n]), c = e[n] + s, r[t][n] = {
                                initialFullValue: o,
                                initialValue: i,
                                unit: s,
                                finalValue: l,
                                finalFullValue: c,
                                currentValue: i
                            }
                        }))
                    }));
                    var o, i, s = null,
                        l = 0,
                        c = 0,
                        u = !1;
                    return n.animating = !0, n.frameId = requestAnimationFrame((function p() {
                        var d, h;
                        o = (new Date).getTime(), u || (u = !0, t.begin && t.begin(a)), null === s && (s = o), t.progress && t.progress(a, Math.max(Math.min((o - s) / t.duration, 1), 0), s + t.duration - o < 0 ? 0 : s + t.duration - o, s), r.forEach((function (a) {
                            var u = a;
                            i || u.done || Object.keys(e).forEach((function (a) {
                                if (!i && !u.done) {
                                    d = Math.max(Math.min((o - s) / t.duration, 1), 0), h = n.easingProgress(t.easing, d);
                                    var p = u[a],
                                        f = p.initialValue,
                                        v = p.finalValue,
                                        m = p.unit;
                                    u[a].currentValue = f + h * (v - f);
                                    var g = u[a].currentValue;
                                    (v > f && g >= v || v < f && g <= v) && (u.container.style[a] = v + m, (c += 1) === Object.keys(e).length && (u.done = !0, l += 1), l === r.length && (i = !0)), i ? n.done(t.complete) : u.container.style[a] = g + m
                                }
                            }))
                        })), i || (n.frameId = requestAnimationFrame(p))
                    })), n
                }
            };
        if (0 === n.elements.length) return a;
        for (var o = 0; o < n.elements.length; o += 1) n.elements[o].dom7AnimateInstance ? r = n.elements[o].dom7AnimateInstance : n.elements[o].dom7AnimateInstance = n;
        return r || (r = n), "stop" === e ? r.stop() : r.animate(n.props, n.params), a
    }

    function stop() {
        for (var e = 0; e < this.length; e += 1) this[e].dom7AnimateInstance && this[e].dom7AnimateInstance.stop()
    }
    var Animate = Object.freeze({
            animate: animate,
            stop: stop
        }),
        noTrigger = "resize scroll".split(" ");

    function eventShortcut(e) {
        for (var t, r = [], a = arguments.length - 1; a-- > 0;) r[a] = arguments[a + 1];
        if (void 0 === r[0]) {
            for (var n = 0; n < this.length; n += 1) noTrigger.indexOf(e) < 0 && (e in this[n] ? this[n][e]() : $(this[n]).trigger(e));
            return this
        }
        return (t = this).on.apply(t, [e].concat(r))
    }

    function click() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["click"].concat(e))
    }

    function blur() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["blur"].concat(e))
    }

    function focus() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["focus"].concat(e))
    }

    function focusin() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["focusin"].concat(e))
    }

    function focusout() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["focusout"].concat(e))
    }

    function keyup() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["keyup"].concat(e))
    }

    function keydown() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["keydown"].concat(e))
    }

    function keypress() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["keypress"].concat(e))
    }

    function submit() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["submit"].concat(e))
    }

    function change() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["change"].concat(e))
    }

    function mousedown() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["mousedown"].concat(e))
    }

    function mousemove() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["mousemove"].concat(e))
    }

    function mouseup() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["mouseup"].concat(e))
    }

    function mouseenter() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["mouseenter"].concat(e))
    }

    function mouseleave() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["mouseleave"].concat(e))
    }

    function mouseout() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["mouseout"].concat(e))
    }

    function mouseover() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["mouseover"].concat(e))
    }

    function touchstart() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["touchstart"].concat(e))
    }

    function touchend() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["touchend"].concat(e))
    }

    function touchmove() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["touchmove"].concat(e))
    }

    function resize() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["resize"].concat(e))
    }

    function scroll() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return eventShortcut.bind(this).apply(void 0, ["scroll"].concat(e))
    }
    var eventShortcuts = Object.freeze({
        click: click,
        blur: blur,
        focus: focus,
        focusin: focusin,
        focusout: focusout,
        keyup: keyup,
        keydown: keydown,
        keypress: keypress,
        submit: submit,
        change: change,
        mousedown: mousedown,
        mousemove: mousemove,
        mouseup: mouseup,
        mouseenter: mouseenter,
        mouseleave: mouseleave,
        mouseout: mouseout,
        mouseover: mouseover,
        touchstart: touchstart,
        touchend: touchend,
        touchmove: touchmove,
        resize: resize,
        scroll: scroll
    });
    [Methods, Scroll, Animate, eventShortcuts].forEach((function (e) {
        Object.keys(e).forEach((function (t) {
            $.fn[t] = e[t]
        }))
    }));
    for (var defaultDiacriticsRemovalap = [{
            base: "A",
            letters: "AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"
        }, {
            base: "AA",
            letters: "Ꜳ"
        }, {
            base: "AE",
            letters: "ÆǼǢ"
        }, {
            base: "AO",
            letters: "Ꜵ"
        }, {
            base: "AU",
            letters: "Ꜷ"
        }, {
            base: "AV",
            letters: "ꜸꜺ"
        }, {
            base: "AY",
            letters: "Ꜽ"
        }, {
            base: "B",
            letters: "BⒷＢḂḄḆɃƂƁ"
        }, {
            base: "C",
            letters: "CⒸＣĆĈĊČÇḈƇȻꜾ"
        }, {
            base: "D",
            letters: "DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ"
        }, {
            base: "DZ",
            letters: "ǱǄ"
        }, {
            base: "Dz",
            letters: "ǲǅ"
        }, {
            base: "E",
            letters: "EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ"
        }, {
            base: "F",
            letters: "FⒻＦḞƑꝻ"
        }, {
            base: "G",
            letters: "GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ"
        }, {
            base: "H",
            letters: "HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"
        }, {
            base: "I",
            letters: "IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"
        }, {
            base: "J",
            letters: "JⒿＪĴɈ"
        }, {
            base: "K",
            letters: "KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"
        }, {
            base: "L",
            letters: "LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"
        }, {
            base: "LJ",
            letters: "Ǉ"
        }, {
            base: "Lj",
            letters: "ǈ"
        }, {
            base: "M",
            letters: "MⓂＭḾṀṂⱮƜ"
        }, {
            base: "N",
            letters: "NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ"
        }, {
            base: "NJ",
            letters: "Ǌ"
        }, {
            base: "Nj",
            letters: "ǋ"
        }, {
            base: "O",
            letters: "OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"
        }, {
            base: "OI",
            letters: "Ƣ"
        }, {
            base: "OO",
            letters: "Ꝏ"
        }, {
            base: "OU",
            letters: "Ȣ"
        }, {
            base: "OE",
            letters: "Œ"
        }, {
            base: "oe",
            letters: "œ"
        }, {
            base: "P",
            letters: "PⓅＰṔṖƤⱣꝐꝒꝔ"
        }, {
            base: "Q",
            letters: "QⓆＱꝖꝘɊ"
        }, {
            base: "R",
            letters: "RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"
        }, {
            base: "S",
            letters: "SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"
        }, {
            base: "T",
            letters: "TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"
        }, {
            base: "TZ",
            letters: "Ꜩ"
        }, {
            base: "U",
            letters: "UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"
        }, {
            base: "V",
            letters: "VⓋＶṼṾƲꝞɅ"
        }, {
            base: "VY",
            letters: "Ꝡ"
        }, {
            base: "W",
            letters: "WⓌＷẀẂŴẆẄẈⱲ"
        }, {
            base: "X",
            letters: "XⓍＸẊẌ"
        }, {
            base: "Y",
            letters: "YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"
        }, {
            base: "Z",
            letters: "ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"
        }, {
            base: "a",
            letters: "aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ"
        }, {
            base: "aa",
            letters: "ꜳ"
        }, {
            base: "ae",
            letters: "æǽǣ"
        }, {
            base: "ao",
            letters: "ꜵ"
        }, {
            base: "au",
            letters: "ꜷ"
        }, {
            base: "av",
            letters: "ꜹꜻ"
        }, {
            base: "ay",
            letters: "ꜽ"
        }, {
            base: "b",
            letters: "bⓑｂḃḅḇƀƃɓ"
        }, {
            base: "c",
            letters: "cⓒｃćĉċčçḉƈȼꜿↄ"
        }, {
            base: "d",
            letters: "dⓓｄḋďḍḑḓḏđƌɖɗꝺ"
        }, {
            base: "dz",
            letters: "ǳǆ"
        }, {
            base: "e",
            letters: "eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ"
        }, {
            base: "f",
            letters: "fⓕｆḟƒꝼ"
        }, {
            base: "g",
            letters: "gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ"
        }, {
            base: "h",
            letters: "hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"
        }, {
            base: "hv",
            letters: "ƕ"
        }, {
            base: "i",
            letters: "iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"
        }, {
            base: "j",
            letters: "jⓙｊĵǰɉ"
        }, {
            base: "k",
            letters: "kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"
        }, {
            base: "l",
            letters: "lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ"
        }, {
            base: "lj",
            letters: "ǉ"
        }, {
            base: "m",
            letters: "mⓜｍḿṁṃɱɯ"
        }, {
            base: "n",
            letters: "nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ"
        }, {
            base: "nj",
            letters: "ǌ"
        }, {
            base: "o",
            letters: "oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ"
        }, {
            base: "oi",
            letters: "ƣ"
        }, {
            base: "ou",
            letters: "ȣ"
        }, {
            base: "oo",
            letters: "ꝏ"
        }, {
            base: "p",
            letters: "pⓟｐṕṗƥᵽꝑꝓꝕ"
        }, {
            base: "q",
            letters: "qⓠｑɋꝗꝙ"
        }, {
            base: "r",
            letters: "rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"
        }, {
            base: "s",
            letters: "sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ"
        }, {
            base: "t",
            letters: "tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"
        }, {
            base: "tz",
            letters: "ꜩ"
        }, {
            base: "u",
            letters: "uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"
        }, {
            base: "v",
            letters: "vⓥｖṽṿʋꝟʌ"
        }, {
            base: "vy",
            letters: "ꝡ"
        }, {
            base: "w",
            letters: "wⓦｗẁẃŵẇẅẘẉⱳ"
        }, {
            base: "x",
            letters: "xⓧｘẋẍ"
        }, {
            base: "y",
            letters: "yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"
        }, {
            base: "z",
            letters: "zⓩｚźẑżžẓẕƶȥɀⱬꝣ"
        }], diacriticsMap = {}, i = 0; i < defaultDiacriticsRemovalap.length; i += 1)
        for (var letters = defaultDiacriticsRemovalap[i].letters, j = 0; j < letters.length; j += 1) diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
    var uniqueNumber = 1,
        Utils = {
            uniqueNumber: function () {
                return uniqueNumber += 1
            },
            id: function (e, t) {
                void 0 === e && (e = "xxxxxxxxxx"), void 0 === t && (t = "0123456789abcdef");
                var r = t.length;
                return e.replace(/x/g, (function () {
                    return t[Math.floor(Math.random() * r)]
                }))
            },
            mdPreloaderContent: '\n    <span class="preloader-inner">\n      <span class="preloader-inner-gap"></span>\n      <span class="preloader-inner-left">\n          <span class="preloader-inner-half-circle"></span>\n      </span>\n      <span class="preloader-inner-right">\n          <span class="preloader-inner-half-circle"></span>\n      </span>\n    </span>\n  '.trim(),
            iosPreloaderContent: ('\n    <span class="preloader-inner">\n      ' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((function () {
                return '<span class="preloader-inner-line"></span>'
            })).join("") + "\n    </span>\n  ").trim(),
            auroraPreloaderContent: '\n    <span class="preloader-inner">\n      <span class="preloader-inner-circle"></span>\n    </span>\n  ',
            eventNameToColonCase: function (e) {
                var t;
                return e.split("").map((function (e, r) {
                    return e.match(/[A-Z]/) && 0 !== r && !t ? (t = !0, ":" + e.toLowerCase()) : e.toLowerCase()
                })).join("")
            },
            deleteProps: function (e) {
                var t = e;
                Object.keys(t).forEach((function (e) {
                    try {
                        t[e] = null
                    } catch (e) {}
                    try {
                        delete t[e]
                    } catch (e) {}
                }))
            },
            nextTick: function (e, t) {
                return void 0 === t && (t = 0), setTimeout(e, t)
            },
            nextFrame: function (e) {
                return Utils.requestAnimationFrame((function () {
                    Utils.requestAnimationFrame(e)
                }))
            },
            now: function () {
                return Date.now()
            },
            requestAnimationFrame: function (e) {
                return win.requestAnimationFrame(e)
            },
            cancelAnimationFrame: function (e) {
                return win.cancelAnimationFrame(e)
            },
            removeDiacritics: function (e) {
                return e.replace(/[^\u0000-\u007E]/g, (function (e) {
                    return diacriticsMap[e] || e
                }))
            },
            parseUrlQuery: function (e) {
                var t, r, a, n, o = {},
                    i = e || win.location.href;
                if ("string" == typeof i && i.length)
                    for (n = (r = (i = i.indexOf("?") > -1 ? i.replace(/\S*\?/, "") : "").split("&").filter((function (e) {
                            return "" !== e
                        }))).length, t = 0; t < n; t += 1) a = r[t].replace(/#\S+/g, "").split("="), o[decodeURIComponent(a[0])] = void 0 === a[1] ? void 0 : decodeURIComponent(a.slice(1).join("=")) || "";
                return o
            },
            getTranslate: function (e, t) {
                var r, a, n;
                void 0 === t && (t = "x");
                var o = win.getComputedStyle(e, null);
                return win.WebKitCSSMatrix ? ((a = o.transform || o.webkitTransform).split(",").length > 6 && (a = a.split(", ").map((function (e) {
                    return e.replace(",", ".")
                })).join(", ")), n = new win.WebKitCSSMatrix("none" === a ? "" : a)) : r = (n = o.MozTransform || o.OTransform || o.MsTransform || o.msTransform || o.transform || o.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")).toString().split(","), "x" === t && (a = win.WebKitCSSMatrix ? n.m41 : 16 === r.length ? parseFloat(r[12]) : parseFloat(r[4])), "y" === t && (a = win.WebKitCSSMatrix ? n.m42 : 16 === r.length ? parseFloat(r[13]) : parseFloat(r[5])), a || 0
            },
            serializeObject: function (e, t) {
                if (void 0 === t && (t = []), "string" == typeof e) return e;
                var r, a = [];

                function n(e) {
                    if (t.length > 0) {
                        for (var r = "", a = 0; a < t.length; a += 1) r += 0 === a ? t[a] : "[" + encodeURIComponent(t[a]) + "]";
                        return r + "[" + encodeURIComponent(e) + "]"
                    }
                    return encodeURIComponent(e)
                }

                function o(e) {
                    return encodeURIComponent(e)
                }
                return Object.keys(e).forEach((function (i) {
                    var s;
                    if (Array.isArray(e[i])) {
                        s = [];
                        for (var l = 0; l < e[i].length; l += 1) Array.isArray(e[i][l]) || "object" != typeof e[i][l] ? s.push(n(i) + "[]=" + o(e[i][l])) : ((r = t.slice()).push(i), r.push(String(l)), s.push(Utils.serializeObject(e[i][l], r)));
                        s.length > 0 && a.push(s.join("&"))
                    } else null === e[i] || "" === e[i] ? a.push(n(i) + "=") : "object" == typeof e[i] ? ((r = t.slice()).push(i), "" !== (s = Utils.serializeObject(e[i], r)) && a.push(s)) : void 0 !== e[i] && "" !== e[i] ? a.push(n(i) + "=" + o(e[i])) : "" === e[i] && a.push(n(i))
                })), a.join("&")
            },
            isObject: function (e) {
                return "object" == typeof e && null !== e && e.constructor && e.constructor === Object
            },
            merge: function () {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                var r = e[0];
                e.splice(0, 1);
                for (var a = e, n = 0; n < a.length; n += 1) {
                    var o = e[n];
                    if (null != o)
                        for (var i = Object.keys(Object(o)), s = 0, l = i.length; s < l; s += 1) {
                            var c = i[s],
                                u = Object.getOwnPropertyDescriptor(o, c);
                            void 0 !== u && u.enumerable && (r[c] = o[c])
                        }
                }
                return r
            },
            extend: function () {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                var r, a, n = !0;
                "boolean" == typeof e[0] ? (n = e[0], r = e[1], e.splice(0, 2), a = e) : (r = e[0], e.splice(0, 1), a = e);
                for (var o = 0; o < a.length; o += 1) {
                    var i = e[o];
                    if (null != i)
                        for (var s = Object.keys(Object(i)), l = 0, c = s.length; l < c; l += 1) {
                            var u = s[l],
                                p = Object.getOwnPropertyDescriptor(i, u);
                            void 0 !== p && p.enumerable && (n ? Utils.isObject(r[u]) && Utils.isObject(i[u]) ? Utils.extend(r[u], i[u]) : !Utils.isObject(r[u]) && Utils.isObject(i[u]) ? (r[u] = {}, Utils.extend(r[u], i[u])) : r[u] = i[u] : r[u] = i[u])
                        }
                }
                return r
            },
            colorHexToRgb: function (e) {
                var t = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function (e, t, r, a) {
                        return t + t + r + r + a + a
                    })),
                    r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
                return r ? r.slice(1).map((function (e) {
                    return parseInt(e, 16)
                })) : null
            },
            colorRgbToHex: function (e, t, r) {
                return "#" + [e, t, r].map((function (e) {
                    var t = e.toString(16);
                    return 1 === t.length ? "0" + t : t
                })).join("")
            },
            colorRgbToHsl: function (e, t, r) {
                e /= 255, t /= 255, r /= 255;
                var a, n = Math.max(e, t, r),
                    o = Math.min(e, t, r),
                    i = n - o;
                0 === i ? a = 0 : n === e ? a = (t - r) / i % 6 : n === t ? a = (r - e) / i + 2 : n === r && (a = (e - t) / i + 4);
                var s = (o + n) / 2;
                return a < 0 && (a = 6 + a), [60 * a, 0 === i ? 0 : i / (1 - Math.abs(2 * s - 1)), s]
            },
            colorHslToRgb: function (e, t, r) {
                var a, n = (1 - Math.abs(2 * r - 1)) * t,
                    o = e / 60,
                    i = n * (1 - Math.abs(o % 2 - 1));
                Number.isNaN(e) || void 0 === e ? a = [0, 0, 0] : o <= 1 ? a = [n, i, 0] : o <= 2 ? a = [i, n, 0] : o <= 3 ? a = [0, n, i] : o <= 4 ? a = [0, i, n] : o <= 5 ? a = [i, 0, n] : o <= 6 && (a = [n, 0, i]);
                var s = r - n / 2;
                return a.map((function (e) {
                    return Math.max(0, Math.min(255, Math.round(255 * (e + s))))
                }))
            },
            colorHsbToHsl: function (e, t, r) {
                var a = {
                        h: e,
                        s: 0,
                        l: 0
                    },
                    n = t,
                    o = r;
                return a.l = (2 - n) * o / 2, a.s = a.l && a.l < 1 ? n * o / (a.l < .5 ? 2 * a.l : 2 - 2 * a.l) : a.s, [a.h, a.s, a.l]
            },
            colorHslToHsb: function (e, t, r) {
                var a = {
                        h: e,
                        s: 0,
                        b: 0
                    },
                    n = r,
                    o = t * (n < .5 ? n : 1 - n);
                return a.b = n + o, a.s = n > 0 ? 2 * o / a.b : a.s, [a.h, a.s, a.b]
            },
            colorThemeCSSProperties: function () {
                for (var e, t, r = [], a = arguments.length; a--;) r[a] = arguments[a];
                if (1 === r.length ? (e = r[0], t = Utils.colorHexToRgb(e)) : 3 === r.length && (t = r, e = Utils.colorRgbToHex.apply(Utils, t)), !t) return {};
                var n = Utils.colorRgbToHsl.apply(Utils, t),
                    o = [n[0], n[1], Math.max(0, n[2] - .08)],
                    i = [n[0], n[1], Math.max(0, n[2] + .08)],
                    s = Utils.colorRgbToHex.apply(Utils, Utils.colorHslToRgb.apply(Utils, o)),
                    l = Utils.colorRgbToHex.apply(Utils, Utils.colorHslToRgb.apply(Utils, i));
                return {
                    "--f7-theme-color": e,
                    "--f7-theme-color-rgb": t.join(", "),
                    "--f7-theme-color-shade": s,
                    "--f7-theme-color-tint": l
                }
            }
        },
        Support = {
            touch: !!("ontouchstart" in win || win.DocumentTouch && doc instanceof win.DocumentTouch),
            pointerEvents: !!win.PointerEvent && "maxTouchPoints" in win.navigator && win.navigator.maxTouchPoints >= 0,
            observer: "MutationObserver" in win || "WebkitMutationObserver" in win,
            passiveListener: function () {
                var e = !1;
                try {
                    var t = Object.defineProperty({}, "passive", {
                        get: function () {
                            e = !0
                        }
                    });
                    win.addEventListener("testPassiveListener", null, t)
                } catch (e) {}
                return e
            }(),
            gestures: "ongesturestart" in win,
            intersectionObserver: "IntersectionObserver" in win
        },
        Device = function () {
            var e = win.navigator.platform,
                t = win.navigator.userAgent,
                r = {
                    ios: !1,
                    android: !1,
                    androidChrome: !1,
                    desktop: !1,
                    iphone: !1,
                    ipod: !1,
                    ipad: !1,
                    edge: !1,
                    ie: !1,
                    firefox: !1,
                    macos: !1,
                    windows: !1,
                    cordova: !(!win.cordova && !win.phonegap),
                    phonegap: !(!win.cordova && !win.phonegap),
                    electron: !1,
                    nwjs: !1
                },
                a = win.screen.width,
                n = win.screen.height,
                o = t.match(/(Android);?[\s\/]+([\d.]+)?/),
                i = t.match(/(iPad).*OS\s([\d_]+)/),
                s = t.match(/(iPod)(.*OS\s([\d_]+))?/),
                l = !i && t.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
                c = t.indexOf("MSIE ") >= 0 || t.indexOf("Trident/") >= 0,
                u = t.indexOf("Edge/") >= 0,
                p = t.indexOf("Gecko/") >= 0 && t.indexOf("Firefox/") >= 0,
                d = "Win32" === e,
                h = t.toLowerCase().indexOf("electron") >= 0,
                f = "undefined" != typeof nw && "undefined" != typeof process && void 0 !== process.versions && void 0 !== process.versions.nw,
                v = "MacIntel" === e;
            !i && v && Support.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(a + "x" + n) >= 0 && ((i = t.match(/(Version)\/([\d.]+)/)) || (i = [0, 1, "13_0_0"]), v = !1), r.ie = c, r.edge = u, r.firefox = p, o && !d && (r.os = "android", r.osVersion = o[2], r.android = !0, r.androidChrome = t.toLowerCase().indexOf("chrome") >= 0), (i || l || s) && (r.os = "ios", r.ios = !0), l && !s && (r.osVersion = l[2].replace(/_/g, "."), r.iphone = !0), i && (r.osVersion = i[2].replace(/_/g, "."), r.ipad = !0), s && (r.osVersion = s[3] ? s[3].replace(/_/g, ".") : null, r.ipod = !0), r.ios && r.osVersion && t.indexOf("Version/") >= 0 && "10" === r.osVersion.split(".")[0] && (r.osVersion = t.toLowerCase().split("version/")[1].split(" ")[0]), r.webView = !(!(l || i || s) || !t.match(/.*AppleWebKit(?!.*Safari)/i) && !win.navigator.standalone) || win.matchMedia && win.matchMedia("(display-mode: standalone)").matches, r.webview = r.webView, r.standalone = r.webView, r.desktop = !(r.ios || r.android) || h || f, r.desktop && (r.electron = h, r.nwjs = f, r.macos = v, r.windows = d, r.macos && (r.os = "macos"), r.windows && (r.os = "windows")), r.pixelRatio = win.devicePixelRatio || 1;
            return r.prefersColorScheme = function () {
                var e;
                return win.matchMedia && win.matchMedia("(prefers-color-scheme: light)").matches && (e = "light"), win.matchMedia && win.matchMedia("(prefers-color-scheme: dark)").matches && (e = "dark"), e
            }, r
        }(),
        EventsClass = function (e) {
            void 0 === e && (e = []);
            this.eventsParents = e, this.eventsListeners = {}
        };
    EventsClass.prototype.on = function (e, t, r) {
        var a = this;
        if ("function" != typeof t) return a;
        var n = r ? "unshift" : "push";
        return e.split(" ").forEach((function (e) {
            a.eventsListeners[e] || (a.eventsListeners[e] = []), a.eventsListeners[e][n](t)
        })), a
    }, EventsClass.prototype.once = function (e, t, r) {
        var a = this;
        if ("function" != typeof t) return a;

        function n() {
            for (var r = [], o = arguments.length; o--;) r[o] = arguments[o];
            a.off(e, n), n.f7proxy && delete n.f7proxy, t.apply(a, r)
        }
        return n.f7proxy = t, a.on(e, n, r)
    }, EventsClass.prototype.off = function (e, t) {
        var r = this;
        return r.eventsListeners ? (e.split(" ").forEach((function (e) {
            void 0 === t ? r.eventsListeners[e] = [] : r.eventsListeners[e] && r.eventsListeners[e].forEach((function (a, n) {
                (a === t || a.f7proxy && a.f7proxy === t) && r.eventsListeners[e].splice(n, 1)
            }))
        })), r) : r
    }, EventsClass.prototype.emit = function () {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        var r, a, n, o, i = this;
        if (!i.eventsListeners) return i;
        "string" == typeof e[0] || Array.isArray(e[0]) ? (r = e[0], a = e.slice(1, e.length), n = i, o = i.eventsParents) : (r = e[0].events, a = e[0].data, n = e[0].context || i, o = e[0].local ? [] : e[0].parents || i.eventsParents);
        var s = Array.isArray(r) ? r : r.split(" "),
            l = s.map((function (e) {
                return e.replace("local::", "")
            })),
            c = s.filter((function (e) {
                return e.indexOf("local::") < 0
            }));
        return l.forEach((function (e) {
            if (i.eventsListeners && i.eventsListeners[e]) {
                var t = [];
                i.eventsListeners[e].forEach((function (e) {
                    t.push(e)
                })), t.forEach((function (e) {
                    e.apply(n, a)
                }))
            }
        })), o && o.length > 0 && o.forEach((function (e) {
            e.emit.apply(e, [c].concat(a))
        })), i
    };
    var Framework7Class = function (e) {
        function t(t, r) {
            void 0 === t && (t = {}), void 0 === r && (r = []), e.call(this, r);
            var a = this;
            a.params = t, a.params && a.params.on && Object.keys(a.params.on).forEach((function (e) {
                a.on(e, a.params.on[e])
            }))
        }
        e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
        var r = {
            components: {
                configurable: !0
            }
        };
        return t.prototype.useModuleParams = function (e, t) {
            if (e.params) {
                var r = {};
                Object.keys(e.params).forEach((function (e) {
                    void 0 !== t[e] && (r[e] = Utils.extend({}, t[e]))
                })), Utils.extend(t, e.params), Object.keys(r).forEach((function (e) {
                    Utils.extend(t[e], r[e])
                }))
            }
        }, t.prototype.useModulesParams = function (e) {
            var t = this;
            t.modules && Object.keys(t.modules).forEach((function (r) {
                var a = t.modules[r];
                a.params && Utils.extend(e, a.params)
            }))
        }, t.prototype.useModule = function (e, t) {
            void 0 === e && (e = ""), void 0 === t && (t = {});
            var r = this;
            if (r.modules) {
                var a = "string" == typeof e ? r.modules[e] : e;
                a && (a.instance && Object.keys(a.instance).forEach((function (e) {
                    var t = a.instance[e];
                    r[e] = "function" == typeof t ? t.bind(r) : t
                })), a.on && r.on && Object.keys(a.on).forEach((function (e) {
                    r.on(e, a.on[e])
                })), a.vnode && (r.vnodeHooks || (r.vnodeHooks = {}), Object.keys(a.vnode).forEach((function (e) {
                    Object.keys(a.vnode[e]).forEach((function (t) {
                        var n = a.vnode[e][t];
                        r.vnodeHooks[t] || (r.vnodeHooks[t] = {}), r.vnodeHooks[t][e] || (r.vnodeHooks[t][e] = []), r.vnodeHooks[t][e].push(n.bind(r))
                    }))
                }))), a.create && a.create.bind(r)(t))
            }
        }, t.prototype.useModules = function (e) {
            void 0 === e && (e = {});
            var t = this;
            t.modules && Object.keys(t.modules).forEach((function (r) {
                var a = e[r] || {};
                t.useModule(r, a)
            }))
        }, r.components.set = function (e) {
            this.use && this.use(e)
        }, t.installModule = function (e) {
            for (var t = [], r = arguments.length - 1; r-- > 0;) t[r] = arguments[r + 1];
            var a = this;
            a.prototype.modules || (a.prototype.modules = {});
            var n = e.name || Object.keys(a.prototype.modules).length + "_" + Utils.now();
            return a.prototype.modules[n] = e, e.proto && Object.keys(e.proto).forEach((function (t) {
                a.prototype[t] = e.proto[t]
            })), e.static && Object.keys(e.static).forEach((function (t) {
                a[t] = e.static[t]
            })), e.install && e.install.apply(a, t), a
        }, t.use = function (e) {
            for (var t = [], r = arguments.length - 1; r-- > 0;) t[r] = arguments[r + 1];
            var a = this;
            return Array.isArray(e) ? (e.forEach((function (e) {
                return a.installModule(e)
            })), a) : a.installModule.apply(a, [e].concat(t))
        }, Object.defineProperties(t, r), t
    }(EventsClass);

    function ConstructorMethods(e) {
        void 0 === e && (e = {});
        var t = e.defaultSelector,
            r = e.constructor,
            a = e.domProp,
            n = e.app,
            o = e.addMethods,
            i = {
                create: function () {
                    for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                    return n ? new(Function.prototype.bind.apply(r, [null].concat([n], e))) : new(Function.prototype.bind.apply(r, [null].concat(e)))
                },
                get: function (e) {
                    if (void 0 === e && (e = t), e instanceof r) return e;
                    var n = $(e);
                    return 0 !== n.length ? n[0][a] : void 0
                },
                destroy: function (e) {
                    var t = i.get(e);
                    if (t && t.destroy) return t.destroy()
                }
            };
        return o && Array.isArray(o) && o.forEach((function (e) {
            i[e] = function (r) {
                void 0 === r && (r = t);
                for (var a = [], n = arguments.length - 1; n-- > 0;) a[n] = arguments[n + 1];
                var o = i.get(r);
                if (o && o[e]) return o[e].apply(o, a)
            }
        })), i
    }

    function ModalMethods(e) {
        void 0 === e && (e = {});
        var t = e.defaultSelector,
            r = e.constructor,
            a = e.app;
        return Utils.extend(ConstructorMethods({
            defaultSelector: t,
            constructor: r,
            app: a,
            domProp: "f7Modal"
        }), {
            open: function (e, t, n) {
                var o = $(e);
                if (o.length > 1 && n) {
                    var i = $(n).parents(".page");
                    i.length && o.each((function (e, t) {
                        var r = $(t);
                        r.parents(i)[0] === i[0] && (o = r)
                    }))
                }
                if (o.length > 1 && (o = o.eq(o.length - 1)), o.length) {
                    var s = o[0].f7Modal;
                    if (!s) {
                        var l = o.dataset();
                        s = new r(a, Object.assign({}, {
                            el: o
                        }, l))
                    }
                    return s.open(t)
                }
            },
            close: function (e, n, o) {
                void 0 === e && (e = t);
                var i = $(e);
                if (i.length) {
                    if (i.length > 1) {
                        var s;
                        if (o) {
                            var l = $(o);
                            l.length && (s = l.parents(i))
                        }
                        i = s && s.length > 0 ? s : i.eq(i.length - 1)
                    }
                    var c = i[0].f7Modal;
                    if (!c) {
                        var u = i.dataset();
                        c = new r(a, Object.assign({}, {
                            el: i
                        }, u))
                    }
                    return c.close(n)
                }
            }
        })
    }
    var fetchedModules = [];

    function loadModule(e) {
        var t = this;
        return new Promise((function (r, a) {
            var n, o, i, s = t.instance;
            if (e) {
                if ("string" == typeof e) {
                    var l = e.match(/([a-z0-9-]*)/i);
                    if (e.indexOf(".") < 0 && l && l[0].length === e.length) {
                        if (!s || s && !s.params.lazyModulesPath) return void a(new Error('Framework7: "lazyModulesPath" app parameter must be specified to fetch module by name'));
                        n = s.params.lazyModulesPath + "/" + e + ".js"
                    } else n = e
                } else "function" == typeof e ? i = e : o = e;
                if (i) {
                    var c = i(t, !1);
                    if (!c) return void a(new Error("Framework7: Can't find Framework7 component in specified component function"));
                    if (t.prototype.modules && t.prototype.modules[c.name]) return void r();
                    h(c), r()
                }
                if (o) {
                    var u = o;
                    if (!u) return void a(new Error("Framework7: Can't find Framework7 component in specified component"));
                    if (t.prototype.modules && t.prototype.modules[u.name]) return void r();
                    h(u), r()
                }
                if (n) {
                    if (fetchedModules.indexOf(n) >= 0) return void r();
                    fetchedModules.push(n);
                    var p = new Promise((function (e, r) {
                            t.request.get(n, (function (a) {
                                var o = "f7_component_loader_callback_" + Utils.id(),
                                    i = doc.createElement("script");
                                i.innerHTML = "window." + o + " = function (Framework7, Framework7AutoInstallComponent) {return " + a.trim() + "}", $("head").append(i);
                                var s = win[o];
                                delete win[o], $(i).remove();
                                var l = s(t, !1);
                                l ? (t.prototype.modules && t.prototype.modules[l.name] || h(l), e()) : r(new Error("Framework7: Can't find Framework7 component in " + n + " file"))
                            }), (function (e, t) {
                                r(e, t)
                            }))
                        })),
                        d = new Promise((function (e) {
                            t.request.get(n.replace(".js", s.rtl ? ".rtl.css" : ".css"), (function (t) {
                                var r = doc.createElement("style");
                                r.innerHTML = t, $("head").append(r), e()
                            }), (function () {
                                e()
                            }))
                        }));
                    Promise.all([p, d]).then((function () {
                        r()
                    })).catch((function (e) {
                        a(e)
                    }))
                }
            } else a(new Error("Framework7: Lazy module must be specified"));

            function h(e) {
                t.use(e), s && (s.useModuleParams(e, s.params), s.useModule(e))
            }
        }))
    }
    var Framework7 = function (e) {
        function t(r) {
            if (e.call(this, r), t.instance) throw new Error("Framework7 is already initialized and can't be initialized more than once");
            var a = Utils.extend({}, r),
                n = this;
            t.instance = n;
            var o = {
                version: "1.0.0",
                id: "io.framework7.testapp",
                root: "body",
                theme: "auto",
                language: win.navigator.language,
                routes: [],
                name: "Framework7",
                lazyModulesPath: null,
                initOnDeviceReady: !0,
                init: !0,
                autoDarkTheme: !1,
                iosTranslucentBars: !0,
                iosTranslucentModals: !0,
                component: void 0,
                componentUrl: void 0
            };
            n.useModulesParams(o), n.params = Utils.extend(o, r);
            var i = $(n.params.root);
            Utils.extend(n, {
                id: n.params.id,
                name: n.params.name,
                version: n.params.version,
                routes: n.params.routes,
                language: n.params.language,
                root: i,
                rtl: "rtl" === i.css("direction"),
                theme: "auto" === n.params.theme ? Device.ios ? "ios" : Device.desktop && Device.electron ? "aurora" : "md" : n.params.theme,
                passedParams: a,
                online: win.navigator.onLine
            }), n.root && n.root[0] && (n.root[0].f7 = n), n.useModules(), n.initData();
            var s = "(prefers-color-scheme: dark)",
                l = "(prefers-color-scheme: light)";
            return n.mq = {}, win.matchMedia && (n.mq.dark = win.matchMedia(s), n.mq.light = win.matchMedia(l)), n.colorSchemeListener = function (e) {
                var t = e.matches,
                    r = e.media;
                if (t) {
                    var a = doc.querySelector("html");
                    r === s ? (a.classList.add("theme-dark"), n.darkTheme = !0, n.emit("darkThemeChange", !0)) : r === l && (a.classList.remove("theme-dark"), n.darkTheme = !1, n.emit("darkThemeChange", !1))
                }
            }, n.params.init && (Device.cordova && n.params.initOnDeviceReady ? $(doc).on("deviceready", (function () {
                n.init()
            })) : n.init()), n
        }
        e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
        var r = {
                $: {
                    configurable: !0
                },
                t7: {
                    configurable: !0
                }
            },
            a = {
                Dom7: {
                    configurable: !0
                },
                $: {
                    configurable: !0
                },
                Template7: {
                    configurable: !0
                },
                Class: {
                    configurable: !0
                },
                Events: {
                    configurable: !0
                }
            };
        return t.prototype.initData = function () {
            var e = this;
            e.data = {}, e.params.data && "function" == typeof e.params.data ? Utils.extend(e.data, e.params.data.bind(e)()) : e.params.data && Utils.extend(e.data, e.params.data), e.methods = {}, e.params.methods && Object.keys(e.params.methods).forEach((function (t) {
                "function" == typeof e.params.methods[t] ? e.methods[t] = e.params.methods[t].bind(e) : e.methods[t] = e.params.methods[t]
            }))
        }, t.prototype.enableAutoDarkTheme = function () {
            if (win.matchMedia) {
                var e = this,
                    t = doc.querySelector("html");
                e.mq.dark && e.mq.light && (e.mq.dark.addListener(e.colorSchemeListener), e.mq.light.addListener(e.colorSchemeListener)), e.mq.dark && e.mq.dark.matches ? (t.classList.add("theme-dark"), e.darkTheme = !0, e.emit("darkThemeChange", !0)) : e.mq.light && e.mq.light.matches && (t.classList.remove("theme-dark"), e.darkTheme = !1, e.emit("darkThemeChange", !1))
            }
        }, t.prototype.disableAutoDarkTheme = function () {
            if (win.matchMedia) {
                this.mq.dark && this.mq.dark.removeListener(this.colorSchemeListener), this.mq.light && this.mq.light.removeListener(this.colorSchemeListener)
            }
        }, t.prototype.initAppComponent = function (e) {
            var t = this;
            t.router.componentLoader(t.params.component, t.params.componentUrl, {
                componentOptions: {
                    el: t.root[0],
                    root: !0
                }
            }, (function (r) {
                t.root = $(r), t.root[0].f7 = t, t.rootComponent = r.f7Component, e && e()
            }), (function () {}))
        }, t.prototype._init = function () {
            var e = this;
            return e.initialized || (e.root.addClass("framework7-initializing"), e.rtl && $("html").attr("dir", "rtl"), e.params.autoDarkTheme && e.enableAutoDarkTheme(), win.addEventListener("offline", (function () {
                e.online = !1, e.emit("offline"), e.emit("connection", !1)
            })), win.addEventListener("online", (function () {
                e.online = !0, e.emit("online"), e.emit("connection", !0)
            })), e.root.addClass("framework7-root"), $("html").removeClass("ios md aurora").addClass(e.theme), e.params.iosTranslucentBars && "ios" === e.theme && Device.ios && $("html").addClass("ios-translucent-bars"), e.params.iosTranslucentModals && "ios" === e.theme && Device.ios && $("html").addClass("ios-translucent-modals"), Utils.nextFrame((function () {
                e.root.removeClass("framework7-initializing")
            })), e.initialized = !0, e.emit("init")), e
        }, t.prototype.init = function () {
            var e = this;
            e.params.component || e.params.componentUrl ? e.initAppComponent((function () {
                e._init()
            })) : e._init()
        }, t.prototype.loadModule = function () {
            for (var e = [], r = arguments.length; r--;) e[r] = arguments[r];
            return t.loadModule.apply(t, e)
        }, t.prototype.loadModules = function () {
            for (var e = [], r = arguments.length; r--;) e[r] = arguments[r];
            return t.loadModules.apply(t, e)
        }, t.prototype.getVnodeHooks = function (e, t) {
            return this.vnodeHooks && this.vnodeHooks[e] && this.vnodeHooks[e][t] || []
        }, r.$.get = function () {
            return $
        }, r.t7.get = function () {
            return Template7
        }, a.Dom7.get = function () {
            return $
        }, a.$.get = function () {
            return $
        }, a.Template7.get = function () {
            return Template7
        }, a.Class.get = function () {
            return e
        }, a.Events.get = function () {
            return EventsClass
        }, Object.defineProperties(t.prototype, r), Object.defineProperties(t, a), t
    }(Framework7Class);
    Framework7.ModalMethods = ModalMethods, Framework7.ConstructorMethods = ConstructorMethods, Framework7.loadModule = loadModule, Framework7.loadModules = function (e) {
        return Promise.all(e.map((function (e) {
            return Framework7.loadModule(e)
        })))
    };
    var DeviceModule = {
            name: "device",
            proto: {
                device: Device
            },
            static: {
                device: Device
            },
            on: {
                init: function () {
                    var e = [],
                        t = doc.querySelector("html"),
                        r = doc.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
                    t && (Device.standalone && Device.ios && r && "black-translucent" === r.content && e.push("device-full-viewport"), e.push("device-pixel-ratio-" + Math.floor(Device.pixelRatio)), Device.os && !Device.desktop ? e.push("device-" + Device.os) : Device.desktop && (e.push("device-desktop"), Device.os && e.push("device-" + Device.os)), (Device.cordova || Device.phonegap) && e.push("device-cordova"), e.forEach((function (e) {
                        t.classList.add(e)
                    })))
                }
            }
        },
        SupportModule = {
            name: "support",
            proto: {
                support: Support
            },
            static: {
                support: Support
            }
        },
        UtilsModule = {
            name: "utils",
            proto: {
                utils: Utils
            },
            static: {
                utils: Utils
            }
        },
        ResizeModule = {
            name: "resize",
            instance: {
                getSize: function () {
                    if (!this.root[0]) return {
                        width: 0,
                        height: 0,
                        left: 0,
                        top: 0
                    };
                    var e = this.root.offset(),
                        t = [this.root[0].offsetWidth, this.root[0].offsetHeight, e.left, e.top],
                        r = t[0],
                        a = t[1],
                        n = t[2],
                        o = t[3];
                    return this.width = r, this.height = a, this.left = n, this.top = o, {
                        width: r,
                        height: a,
                        left: n,
                        top: o
                    }
                }
            },
            on: {
                init: function () {
                    var e = this;
                    e.getSize(), win.addEventListener("resize", (function () {
                        e.emit("resize")
                    }), !1), win.addEventListener("orientationchange", (function () {
                        e.emit("orientationchange")
                    }))
                },
                orientationchange: function () {
                    this.device.ipad && (doc.body.scrollLeft = 0, setTimeout((function () {
                        doc.body.scrollLeft = 0
                    }), 0))
                },
                resize: function () {
                    this.getSize()
                }
            }
        },
        globals = {},
        jsonpRequests = 0;

    function Request(e) {
        var t = Utils.extend({}, globals);
        "beforeCreate beforeOpen beforeSend error complete success statusCode".split(" ").forEach((function (e) {
            delete t[e]
        }));
        var r = Utils.extend({
                url: win.location.toString(),
                method: "GET",
                data: !1,
                async: !0,
                cache: !0,
                user: "",
                password: "",
                headers: {},
                xhrFields: {},
                statusCode: {},
                processData: !0,
                dataType: "text",
                contentType: "application/x-www-form-urlencoded",
                timeout: 0
            }, t),
            a = Utils.extend({}, r, e);

        function n(e) {
            for (var t, r, n = [], o = arguments.length - 1; o-- > 0;) n[o] = arguments[o + 1];
            return globals[e] && (t = globals[e].apply(globals, n)), a[e] && (r = a[e].apply(a, n)), "boolean" != typeof t && (t = !0), "boolean" != typeof r && (r = !0), t && r
        }
        if (!1 !== n("beforeCreate", a)) {
            a.type && (a.method = a.type);
            var o, i = a.url.indexOf("?") >= 0 ? "&" : "?",
                s = a.method.toUpperCase();
            if (("GET" === s || "HEAD" === s || "OPTIONS" === s || "DELETE" === s) && a.data)(o = "string" == typeof a.data ? a.data.indexOf("?") >= 0 ? a.data.split("?")[1] : a.data : Utils.serializeObject(a.data)).length && (a.url += i + o, "?" === i && (i = "&"));
            if ("json" === a.dataType && a.url.indexOf("callback=") >= 0) {
                var l, c = "f7jsonp_" + (Date.now() + (jsonpRequests += 1)),
                    u = a.url.split("callback="),
                    p = u[0] + "callback=" + c;
                if (u[1].indexOf("&") >= 0) {
                    var d = u[1].split("&").filter((function (e) {
                        return e.indexOf("=") > 0
                    })).join("&");
                    d.length > 0 && (p += "&" + d)
                }
                var h = doc.createElement("script");
                return h.type = "text/javascript", h.onerror = function () {
                    clearTimeout(l), n("error", null, "scripterror", "scripterror"), n("complete", null, "scripterror")
                }, h.src = p, win[c] = function (e) {
                    clearTimeout(l), n("success", e), h.parentNode.removeChild(h), h = null, delete win[c]
                }, doc.querySelector("head").appendChild(h), void(a.timeout > 0 && (l = setTimeout((function () {
                    h.parentNode.removeChild(h), h = null, n("error", null, "timeout", "timeout")
                }), a.timeout)))
            }
            "GET" !== s && "HEAD" !== s && "OPTIONS" !== s && "DELETE" !== s || !1 === a.cache && (a.url += i + "_nocache" + Date.now());
            var f = new XMLHttpRequest;
            if (f.requestUrl = a.url, f.requestParameters = a, !1 === n("beforeOpen", f, a)) return f;
            f.open(s, a.url, a.async, a.user, a.password);
            var v = null;
            if (("POST" === s || "PUT" === s || "PATCH" === s) && a.data)
                if (a.processData)
                    if ([ArrayBuffer, Blob, Document, FormData].indexOf(a.data.constructor) >= 0) v = a.data;
                    else {
                        var m = "---------------------------" + Date.now().toString(16);
                        "multipart/form-data" === a.contentType ? f.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + m) : f.setRequestHeader("Content-Type", a.contentType), v = "";
                        var g = Utils.serializeObject(a.data);
                        if ("multipart/form-data" === a.contentType) {
                            g = g.split("&");
                            for (var b = [], y = 0; y < g.length; y += 1) b.push('Content-Disposition: form-data; name="' + g[y].split("=")[0] + '"\r\n\r\n' + g[y].split("=")[1] + "\r\n");
                            v = "--" + m + "\r\n" + b.join("--" + m + "\r\n") + "--" + m + "--\r\n"
                        } else v = "application/json" === a.contentType ? JSON.stringify(a.data) : g
                    }
            else v = a.data, f.setRequestHeader("Content-Type", a.contentType);
            return "json" !== a.dataType || a.headers && a.headers.Accept || f.setRequestHeader("Accept", "application/json"), a.headers && Object.keys(a.headers).forEach((function (e) {
                void 0 !== a.headers[e] && f.setRequestHeader(e, a.headers[e])
            })), void 0 === a.crossDomain && (a.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(a.url) && RegExp.$2 !== win.location.host), a.crossDomain || f.setRequestHeader("X-Requested-With", "XMLHttpRequest"), a.xhrFields && Utils.extend(f, a.xhrFields), f.onload = function () {
                var e;
                if (f.status >= 200 && f.status < 300 || 0 === f.status)
                    if ("json" === a.dataType) {
                        var t;
                        try {
                            e = JSON.parse(f.responseText)
                        } catch (e) {
                            t = !0
                        }
                        t ? n("error", f, "parseerror", "parseerror") : n("success", e, f.status, f)
                    } else n("success", e = "text" === f.responseType || "" === f.responseType ? f.responseText : f.response, f.status, f);
                else n("error", f, f.status, f.statusText);
                a.statusCode && (globals.statusCode && globals.statusCode[f.status] && globals.statusCode[f.status](f), a.statusCode[f.status] && a.statusCode[f.status](f)), n("complete", f, f.status)
            }, f.onerror = function () {
                n("error", f, f.status, f.status), n("complete", f, "error")
            }, a.timeout > 0 && (f.timeout = a.timeout, f.ontimeout = function () {
                n("error", f, "timeout", "timeout"), n("complete", f, "timeout")
            }), !1 === n("beforeSend", f, a) ? f : (f.send(v), f)
        }
    }

    function RequestShortcut(e) {
        for (var t, r, a = [], n = arguments.length - 1; n-- > 0;) a[n] = arguments[n + 1];
        var o = [],
            i = o[0],
            s = o[1],
            l = o[2],
            c = o[3],
            u = o[4];
        "function" == typeof a[1] ? (i = (t = a)[0], l = t[1], c = t[2], u = t[3]) : (i = (r = a)[0], s = r[1], l = r[2], c = r[3], u = r[4]), [l, c].forEach((function (e) {
            "string" == typeof e && (u = e, e === l ? l = void 0 : c = void 0)
        }));
        var p = {
            url: i,
            method: "post" === e || "postJSON" === e ? "POST" : "GET",
            data: s,
            success: l,
            error: c,
            dataType: u = u || ("json" === e || "postJSON" === e ? "json" : void 0)
        };
        return "postJSON" === e && Utils.extend(p, {
            contentType: "application/json",
            processData: !1,
            crossDomain: !0,
            data: "string" == typeof s ? s : JSON.stringify(s)
        }), Request(p)
    }

    function RequestShortcutPromise(e) {
        for (var t = [], r = arguments.length - 1; r-- > 0;) t[r] = arguments[r + 1];
        var a = t[0],
            n = t[1],
            o = t[2];
        return new Promise((function (t, r) {
            RequestShortcut(e, a, n, (function (e, r, a) {
                t({
                    data: e,
                    status: r,
                    xhr: a
                })
            }), (function (e, t, a) {
                r({
                    xhr: e,
                    status: t,
                    message: a
                })
            }), o)
        }))
    }
    Object.assign(Request, {
        get: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcut.apply(void 0, ["get"].concat(e))
        },
        post: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcut.apply(void 0, ["post"].concat(e))
        },
        json: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcut.apply(void 0, ["json"].concat(e))
        },
        getJSON: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcut.apply(void 0, ["json"].concat(e))
        },
        postJSON: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcut.apply(void 0, ["postJSON"].concat(e))
        }
    }), Request.promise = function (e) {
        return new Promise((function (t, r) {
            Request(Object.assign(e, {
                success: function (e, r, a) {
                    t({
                        data: e,
                        status: r,
                        xhr: a
                    })
                },
                error: function (e, t, a) {
                    r({
                        xhr: e,
                        status: t,
                        message: a
                    })
                }
            }))
        }))
    }, Object.assign(Request.promise, {
        get: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcutPromise.apply(void 0, ["get"].concat(e))
        },
        post: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcutPromise.apply(void 0, ["post"].concat(e))
        },
        json: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcutPromise.apply(void 0, ["json"].concat(e))
        },
        getJSON: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcutPromise.apply(void 0, ["json"].concat(e))
        },
        postJSON: function () {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            return RequestShortcutPromise.apply(void 0, ["postJSON"].concat(e))
        }
    }), Request.setup = function (e) {
        e.type && !e.method && Utils.extend(e, {
            method: e.type
        }), Utils.extend(globals, e)
    };
    var RequestModule = {
        name: "request",
        proto: {
            request: Request
        },
        static: {
            request: Request
        }
    };

    function initTouch() {
        var e, t, r, a, n, o, i, s, l, c, u, p, d = this,
            h = d.params.touch,
            f = h[d.theme + "TouchRipple"];

        function v(e) {
            var t, r = $(e),
                a = r.parents(h.activeStateElements);
            if (r.closest(".no-active-state").length) return null;
            if (r.is(h.activeStateElements) && (t = r), a.length > 0 && (t = t ? t.add(a) : a), t && t.length > 1) {
                for (var n, o = [], i = 0; i < t.length; i += 1) n || (o.push(t[i]), (t.eq(i).hasClass("prevent-active-state-propagation") || t.eq(i).hasClass("no-active-state-propagation")) && (n = !0));
                t = $(o)
            }
            return t || r
        }

        function m(e) {
            return e.parents(".page-content").length > 0
        }

        function g() {
            s && s.addClass("active-state")
        }

        function b() {
            s && (s.removeClass("active-state"), s = null)
        }

        function y(e, t, r) {
            e && (c = d.touchRipple.create(e, t, r))
        }

        function w() {
            c && (c.remove(), c = void 0, u = void 0)
        }

        function C(r) {
            (u = function (e) {
                var t = h.touchRippleElements,
                    r = $(e);
                if (r.is(t)) return !r.hasClass("no-ripple") && r;
                if (r.parents(t).length > 0) {
                    var a = r.parents(t).eq(0);
                    return !a.hasClass("no-ripple") && a
                }
                return !1
            }(r)) && 0 !== u.length ? m(u) ? (clearTimeout(p), p = setTimeout((function () {
                w(), y(u, e, t)
            }), 80)) : (w(), y(u, e, t)) : u = void 0
        }

        function x() {
            clearTimeout(p), w()
        }

        function k() {
            c || !u || a ? w() : (clearTimeout(p), y(u, e, t), setTimeout(w, 0))
        }

        function E() {
            $(".active-state").removeClass("active-state"), f && k()
        }

        function S(e, t) {
            d.emit({
                events: e,
                data: [t]
            })
        }

        function T(e) {
            S("touchstart touchstart:active", e)
        }

        function O(e) {
            S("touchmove touchmove:active", e)
        }

        function P(e) {
            S("touchend touchend:active", e)
        }

        function R(e) {
            S("touchstart:passive", e)
        }

        function N(e) {
            S("touchmove:passive", e)
        }

        function D(e) {
            S("touchend:passive", e)
        }

        function L(e) {
            S(e.type + " " + e.type + ":active", e)
        }

        function M(e) {
            S(e.type + ":passive", e)
        }
        Device.ios && Device.webView && win.addEventListener("touchstart", (function () {}));
        var A = !!Support.passiveListener && {
                passive: !0
            },
            U = !Support.passiveListener || {
                passive: !0,
                capture: !0
            },
            B = !!Support.passiveListener && {
                passive: !1
            },
            H = !Support.passiveListener || {
                passive: !1,
                capture: !0
            };
        doc.addEventListener("click", (function (e) {
            S("click", e)
        }), !0), Support.passiveListener ? (doc.addEventListener(d.touchEvents.start, T, H), doc.addEventListener(d.touchEvents.move, O, B), doc.addEventListener(d.touchEvents.end, P, B), doc.addEventListener(d.touchEvents.start, R, U), doc.addEventListener(d.touchEvents.move, N, A), doc.addEventListener(d.touchEvents.end, D, A), Support.touch && Support.gestures && (doc.addEventListener("gesturestart", L, B), doc.addEventListener("gesturechange", L, B), doc.addEventListener("gestureend", L, B), doc.addEventListener("gesturestart", M, A), doc.addEventListener("gesturechange", M, A), doc.addEventListener("gestureend", M, A))) : (doc.addEventListener(d.touchEvents.start, (function (e) {
            T(e), R(e)
        }), !0), doc.addEventListener(d.touchEvents.move, (function (e) {
            O(e), N(e)
        }), !1), doc.addEventListener(d.touchEvents.end, (function (e) {
            P(e), D(e)
        }), !1), Support.touch && Support.gestures && (doc.addEventListener("gesturestart", (function (e) {
            L(e), M(e)
        }), !1), doc.addEventListener("gesturechange", (function (e) {
            L(e), M(e)
        }), !1), doc.addEventListener("gestureend", (function (e) {
            L(e), M(e)
        }), !1))), Support.touch ? (d.on("click", (function (e) {
            var t = e && e.detail && "f7Overswipe" === e.detail,
                a = i;
            return r && e.target !== r && (a = !t), h.tapHold && h.tapHoldPreventClicks && n && (a = !0), a && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault()), h.tapHold && (o = setTimeout((function () {
                n = !1
            }), Device.ios || Device.androidChrome ? 100 : 400)), i = !1, r = null, !a
        })), d.on("touchstart", (function (c) {
            return a = !1, n = !1, i = !1, c.targetTouches.length > 1 ? (s && b(), !0) : (c.touches.length > 1 && s && b(), h.tapHold && (o && clearTimeout(o), o = setTimeout((function () {
                c && c.touches && c.touches.length > 1 || (n = !0, c.preventDefault(), i = !0, $(c.target).trigger("taphold", c), d.emit("taphold", c))
            }), h.tapHoldDelay)), r = c.target, e = c.targetTouches[0].pageX, t = c.targetTouches[0].pageY, h.activeState && ((s = v(r)) && !m(s) ? g() : s && (l = setTimeout(g, 80))), f && C(r), !0)
        })), d.on("touchmove", (function (r) {
            var n, s;
            if ("touchmove" === r.type && (n = r.targetTouches[0], s = h.touchClicksDistanceThreshold), s && n) {
                var c = n.pageX,
                    u = n.pageY;
                (Math.abs(c - e) > s || Math.abs(u - t) > s) && (a = !0)
            } else a = !0;
            a && (i = !0, h.tapHold && clearTimeout(o), h.activeState && (clearTimeout(l), b()), f && x())
        })), d.on("touchend", (function (e) {
            return clearTimeout(l), clearTimeout(o), doc.activeElement === e.target ? (h.activeState && b(), f && k(), !0) : (h.activeState && (g(), setTimeout(b, 0)), f && k(), !(h.tapHoldPreventClicks && n || i) || (e.cancelable && e.preventDefault(), i = !0, !1))
        })), doc.addEventListener("touchcancel", (function () {
            r = null, clearTimeout(l), clearTimeout(o), h.activeState && b(), f && k()
        }), {
            passive: !0
        })) : h.activeState && (d.on("touchstart", (function (r) {
            var a = v(r.target);
            a && (a.addClass("active-state"), "which" in r && 3 === r.which && setTimeout((function () {
                $(".active-state").removeClass("active-state")
            }), 0)), f && (e = r.pageX, t = r.pageY, C(r.target, r.pageX, r.pageY))
        })), d.on("touchmove", (function () {
            h.activeStateOnMouseMove || $(".active-state").removeClass("active-state"), f && x()
        })), d.on("touchend", E), doc.addEventListener("pointercancel", E, {
            passive: !0
        })), doc.addEventListener("contextmenu", (function (e) {
            h.disableContextMenu && (Device.ios || Device.android || Device.cordova) && e.preventDefault(), f && (s && b(), k())
        }))
    }
    var TouchModule = {
        name: "touch",
        params: {
            touch: {
                touchClicksDistanceThreshold: 5,
                disableContextMenu: !1,
                tapHold: !1,
                tapHoldDelay: 750,
                tapHoldPreventClicks: !0,
                activeState: !0,
                activeStateElements: "a, button, label, span, .actions-button, .stepper-button, .stepper-button-plus, .stepper-button-minus, .card-expandable, .menu-item, .link, .item-link, .accordion-item-toggle",
                activeStateOnMouseMove: !1,
                mdTouchRipple: !0,
                iosTouchRipple: !1,
                auroraTouchRipple: !1,
                touchRippleElements: ".ripple, .link, .item-link, .list-button, .links-list a, .button, button, .input-clear-button, .dialog-button, .tab-link, .item-radio, .item-checkbox, .actions-button, .searchbar-disable-button, .fab a, .checkbox, .radio, .data-table .sortable-cell:not(.input-cell), .notification-close-button, .stepper-button, .stepper-button-minus, .stepper-button-plus, .menu-item-content, .list.accordion-list .accordion-item-toggle"
            }
        },
        instance: {
            touchEvents: {
                start: Support.touch ? "touchstart" : Support.pointerEvents ? "pointerdown" : "mousedown",
                move: Support.touch ? "touchmove" : Support.pointerEvents ? "pointermove" : "mousemove",
                end: Support.touch ? "touchend" : Support.pointerEvents ? "pointerup" : "mouseup"
            }
        },
        on: {
            init: initTouch
        }
    };

    function lexer(e) {
        for (var t = [], r = 0; r < e.length;) {
            var a = e[r];
            if ("*" !== a && "+" !== a && "?" !== a)
                if ("\\" !== a)
                    if ("{" !== a)
                        if ("}" !== a)
                            if (":" !== a)
                                if ("(" !== a) t.push({
                                    type: "CHAR",
                                    index: r,
                                    value: e[r++]
                                });
                                else {
                                    var n = 1,
                                        o = "";
                                    if ("?" === e[s = r + 1]) throw new TypeError('Pattern cannot start with "?" at ' + s);
                                    for (; s < e.length;)
                                        if ("\\" !== e[s]) {
                                            if (")" === e[s]) {
                                                if (0 === --n) {
                                                    s++;
                                                    break
                                                }
                                            } else if ("(" === e[s] && (n++, "?" !== e[s + 1])) throw new TypeError("Capturing groups are not allowed at " + s);
                                            o += e[s++]
                                        } else o += e[s++] + e[s++];
                                    if (n) throw new TypeError("Unbalanced pattern at " + r);
                                    if (!o) throw new TypeError("Missing pattern at " + r);
                                    t.push({
                                        type: "PATTERN",
                                        index: r,
                                        value: o
                                    }), r = s
                                }
            else {
                for (var i = "", s = r + 1; s < e.length;) {
                    var l = e.charCodeAt(s);
                    if (!(l >= 48 && l <= 57 || l >= 65 && l <= 90 || l >= 97 && l <= 122 || 95 === l)) break;
                    i += e[s++]
                }
                if (!i) throw new TypeError("Missing parameter name at " + r);
                t.push({
                    type: "NAME",
                    index: r,
                    value: i
                }), r = s
            } else t.push({
                type: "CLOSE",
                index: r,
                value: e[r++]
            });
            else t.push({
                type: "OPEN",
                index: r,
                value: e[r++]
            });
            else t.push({
                type: "ESCAPED_CHAR",
                index: r++,
                value: e[r++]
            });
            else t.push({
                type: "MODIFIER",
                index: r,
                value: e[r++]
            })
        }
        return t.push({
            type: "END",
            index: r,
            value: ""
        }), t
    }

    function parse(e, t) {
        void 0 === t && (t = {});
        for (var r = lexer(e), a = t.prefixes, n = void 0 === a ? "./" : a, o = "[^" + escapeString(t.delimiter || "/#?") + "]+?", i = [], s = 0, l = 0, c = "", u = function (e) {
                if (l < r.length && r[l].type === e) return r[l++].value
            }, p = function (e) {
                var t = u(e);
                if (void 0 !== t) return t;
                var a = r[l],
                    n = a.type,
                    o = a.index;
                throw new TypeError("Unexpected " + n + " at " + o + ", expected " + e)
            }, d = function () {
                for (var e, t = ""; e = u("CHAR") || u("ESCAPED_CHAR");) t += e;
                return t
            }; l < r.length;) {
            var h = u("CHAR"),
                f = u("NAME"),
                v = u("PATTERN");
            if (f || v) {
                var m = h || ""; - 1 === n.indexOf(m) && (c += m, m = ""), c && (i.push(c), c = ""), i.push({
                    name: f || s++,
                    prefix: m,
                    suffix: "",
                    pattern: v || o,
                    modifier: u("MODIFIER") || ""
                })
            } else {
                var g = h || u("ESCAPED_CHAR");
                if (g) c += g;
                else if (c && (i.push(c), c = ""), u("OPEN")) {
                    m = d();
                    var b = u("NAME") || "",
                        y = u("PATTERN") || "",
                        w = d();
                    p("CLOSE"), i.push({
                        name: b || (y ? s++ : ""),
                        pattern: b && !y ? o : y,
                        prefix: m,
                        suffix: w,
                        modifier: u("MODIFIER") || ""
                    })
                } else p("END")
            }
        }
        return i
    }

    function compile(e, t) {
        return tokensToFunction(parse(e, t), t)
    }

    function tokensToFunction(e, t) {
        void 0 === t && (t = {});
        var r = flags(t),
            a = t.encode,
            n = void 0 === a ? function (e) {
                return e
            } : a,
            o = t.validate,
            i = void 0 === o || o,
            s = e.map((function (e) {
                if ("object" == typeof e) return new RegExp("^(?:" + e.pattern + ")$", r)
            }));
        return function (t) {
            for (var r = "", a = 0; a < e.length; a++) {
                var o = e[a];
                if ("string" != typeof o) {
                    var l = t ? t[o.name] : void 0,
                        c = "?" === o.modifier || "*" === o.modifier,
                        u = "*" === o.modifier || "+" === o.modifier;
                    if (Array.isArray(l)) {
                        if (!u) throw new TypeError('Expected "' + o.name + '" to not repeat, but got an array');
                        if (0 === l.length) {
                            if (c) continue;
                            throw new TypeError('Expected "' + o.name + '" to not be empty')
                        }
                        for (var p = 0; p < l.length; p++) {
                            var d = n(l[p], o);
                            if (i && !s[a].test(d)) throw new TypeError('Expected all "' + o.name + '" to match "' + o.pattern + '", but got "' + d + '"');
                            r += o.prefix + d + o.suffix
                        }
                    } else if ("string" != typeof l && "number" != typeof l) {
                        if (!c) {
                            var h = u ? "an array" : "a string";
                            throw new TypeError('Expected "' + o.name + '" to be ' + h)
                        }
                    } else {
                        d = n(String(l), o);
                        if (i && !s[a].test(d)) throw new TypeError('Expected "' + o.name + '" to match "' + o.pattern + '", but got "' + d + '"');
                        r += o.prefix + d + o.suffix
                    }
                } else r += o
            }
            return r
        }
    }

    function escapeString(e) {
        return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1")
    }

    function flags(e) {
        return e && e.sensitive ? "" : "i"
    }

    function regexpToRegexp(e, t) {
        if (!t) return e;
        var r = e.source.match(/\((?!\?)/g);
        if (r)
            for (var a = 0; a < r.length; a++) t.push({
                name: a,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
        return e
    }

    function arrayToRegexp(e, t, r) {
        var a = e.map((function (e) {
            return pathToRegexp(e, t, r).source
        }));
        return new RegExp("(?:" + a.join("|") + ")", flags(r))
    }

    function stringToRegexp(e, t, r) {
        return tokensToRegexp(parse(e, r), t, r)
    }

    function tokensToRegexp(e, t, r) {
        void 0 === r && (r = {});
        for (var a = r.strict, n = void 0 !== a && a, o = r.start, i = void 0 === o || o, s = r.end, l = void 0 === s || s, c = r.encode, u = void 0 === c ? function (e) {
                return e
            } : c, p = "[" + escapeString(r.endsWith || "") + "]|$", d = "[" + escapeString(r.delimiter || "/#?") + "]", h = i ? "^" : "", f = 0, v = e; f < v.length; f++) {
            var m = v[f];
            if ("string" == typeof m) h += escapeString(u(m));
            else {
                var g = escapeString(u(m.prefix)),
                    b = escapeString(u(m.suffix));
                if (m.pattern)
                    if (t && t.push(m), g || b)
                        if ("+" === m.modifier || "*" === m.modifier) {
                            var y = "*" === m.modifier ? "?" : "";
                            h += "(?:" + g + "((?:" + m.pattern + ")(?:" + b + g + "(?:" + m.pattern + "))*)" + b + ")" + y
                        } else h += "(?:" + g + "(" + m.pattern + ")" + b + ")" + m.modifier;
                else h += "(" + m.pattern + ")" + m.modifier;
                else h += "(?:" + g + b + ")" + m.modifier
            }
        }
        if (l) n || (h += d + "?"), h += r.endsWith ? "(?=" + p + ")" : "$";
        else {
            var w = e[e.length - 1],
                C = "string" == typeof w ? d.indexOf(w[w.length - 1]) > -1 : void 0 === w;
            n || (h += "(?:" + d + "(?=" + p + "))?"), C || (h += "(?=" + d + "|" + p + ")")
        }
        return new RegExp(h, flags(r))
    }

    function pathToRegexp(e, t, r) {
        return e instanceof RegExp ? regexpToRegexp(e, t) : Array.isArray(e) ? arrayToRegexp(e, t, r) : stringToRegexp(e, t, r)
    }
    var History = {
        queue: [],
        clearQueue: function () {
            0 !== History.queue.length && History.queue.shift()()
        },
        routerQueue: [],
        clearRouterQueue: function () {
            if (0 !== History.routerQueue.length) {
                var e = History.routerQueue.pop(),
                    t = e.router,
                    r = e.stateUrl,
                    a = e.action,
                    n = t.params.animate;
                !1 === t.params.pushStateAnimate && (n = !1), "back" === a && t.back({
                    animate: n,
                    pushState: !1
                }), "load" === a && t.navigate(r, {
                    animate: n,
                    pushState: !1
                })
            }
        },
        handle: function (e) {
            if (!History.blockPopstate) {
                var t = e.state;
                History.previousState = History.state, History.state = t, History.allowChange = !0, History.clearQueue(), (t = History.state) || (t = {}), this.views.forEach((function (e) {
                    var r = e.router,
                        a = t[e.id];
                    if (!a && e.params.pushState && (a = {
                            url: e.router.history[0]
                        }), a) {
                        var n = a.url || void 0,
                            o = r.params.animate;
                        !1 === r.params.pushStateAnimate && (o = !1), n !== r.url && (r.history.indexOf(n) >= 0 ? r.allowPageChange ? r.back({
                            animate: o,
                            pushState: !1
                        }) : History.routerQueue.push({
                            action: "back",
                            router: r
                        }) : r.allowPageChange ? r.navigate(n, {
                            animate: o,
                            pushState: !1
                        }) : History.routerQueue.unshift({
                            action: "load",
                            stateUrl: n,
                            router: r
                        }))
                    }
                }))
            }
        },
        initViewState: function (e, t) {
            var r, a = Utils.extend({}, History.state || {}, ((r = {})[e] = t, r));
            History.state = a, win.history.replaceState(a, "")
        },
        push: function (e, t, r) {
            var a;
            if (History.allowChange) {
                History.previousState = History.state;
                var n = Utils.extend({}, History.previousState || {}, ((a = {})[e] = t, a));
                History.state = n, win.history.pushState(n, "", r)
            } else History.queue.push((function () {
                History.push(e, t, r)
            }))
        },
        replace: function (e, t, r) {
            var a;
            if (History.allowChange) {
                History.previousState = History.state;
                var n = Utils.extend({}, History.previousState || {}, ((a = {})[e] = t, a));
                History.state = n, win.history.replaceState(n, "", r)
            } else History.queue.push((function () {
                History.replace(e, t, r)
            }))
        },
        go: function (e) {
            History.allowChange = !1, win.history.go(e)
        },
        back: function () {
            History.allowChange = !1, win.history.back()
        },
        allowChange: !0,
        previousState: {},
        state: win.history.state,
        blockPopstate: !0,
        init: function (e) {
            $(win).on("load", (function () {
                setTimeout((function () {
                    History.blockPopstate = !1
                }), 0)
            })), doc.readyState && "complete" === doc.readyState && (History.blockPopstate = !1), $(win).on("popstate", History.handle.bind(e))
        }
    };

    function SwipeBack(e) {
        var t, r, a, n, o, i, s, l, c, u = e,
            p = u.$el,
            d = u.$navbarsEl,
            h = u.app,
            f = u.params,
            v = !1,
            m = !1,
            g = {},
            b = [],
            y = [],
            w = !0,
            C = [],
            x = [],
            k = f[h.theme + "SwipeBackAnimateShadow"],
            E = f[h.theme + "SwipeBackAnimateOpacity"],
            S = f[h.theme + "SwipeBackActiveArea"],
            T = f[h.theme + "SwipeBackThreshold"],
            O = h.rtl ? "right center" : "left center",
            P = h.rtl ? "calc(100% - var(--f7-navbar-large-title-padding-left) - var(--f7-safe-area-left)) center" : "calc(var(--f7-navbar-large-title-padding-left) + var(--f7-safe-area-left)) center";

        function R(e) {
            void 0 === e && (e = {});
            var t = e.progress,
                r = e.reset,
                a = e.transition,
                n = e.reflow,
                o = ["overflow", "transform", "transform-origin", "opacity"];
            if (!0 === a || !1 === a)
                for (var i = 0; i < l.length; i += 1) {
                    var s = l[i];
                    s && s.el && (!0 === a && s.el.classList.add("navbar-page-transitioning"), !1 === a && s.el.classList.remove("navbar-page-transitioning"))
                }
            n && l.length && l[0] && l[0].el && (l[0].el._clientLeft = l[0].el.clientLeft);
            for (var c = 0; c < l.length; c += 1) {
                var u = l[c];
                if (u && u.el) {
                    !u.className || u.classNameSet || r || (u.el.classList.add(u.className), u.classNameSet = !0), u.className && r && u.el.classList.remove(u.className);
                    for (var p = 0; p < o.length; p += 1) {
                        var d = o[p];
                        u[d] && (r ? u.el.style[d] = "" : "function" == typeof u[d] ? u.el.style[d] = u[d](t) : u.el.style[d] = u[d])
                    }
                }
            }
        }

        function N(e) {
            var r = f[h.theme + "SwipeBack"];
            !w || !r || v || h.swipeout && h.swipeout.el || !u.allowPageChange || $(e.target).closest(".range-slider, .calendar-months").length > 0 || $(e.target).closest(".page-master, .page-master-detail").length > 0 && f.masterDetailBreakpoint > 0 && h.width >= f.masterDetailBreakpoint || (m = !1, v = !0, t = void 0, g.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, g.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY, n = Utils.now(), o = u.dynamicNavbar)
        }

        function D(e) {
            if (v) {
                var n = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX,
                    c = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY;
                if (void 0 === t && (t = !!(t || Math.abs(c - g.y) > Math.abs(n - g.x)) || n < g.x && !h.rtl || n > g.x && h.rtl), t || e.f7PreventSwipeBack || h.preventSwipeBack) v = !1;
                else {
                    if (!m) {
                        var w = !1,
                            N = $(e.target),
                            D = N.closest(".swipeout");
                        D.length > 0 && (!h.rtl && D.find(".swipeout-actions-left").length > 0 && (w = !0), h.rtl && D.find(".swipeout-actions-right").length > 0 && (w = !0)), ((b = N.closest(".page")).hasClass("no-swipeback") || N.closest(".no-swipeback, .card-opened").length > 0) && (w = !0), (y = p.find(".page-previous:not(.stacked)")).length > 1 && (y = y.eq(y.length - 1));
                        g.x, p.offset().left;
                        if (r = p.width(), (h.rtl ? g.x < p.offset().left - p[0].scrollLeft + (r - S) : g.x - p.offset().left > S) && (w = !0), 0 !== y.length && 0 !== b.length || (w = !0), w) return void(v = !1);
                        k && 0 === (i = b.find(".page-shadow-effect")).length && (i = $('<div class="page-shadow-effect"></div>'), b.append(i)), E && 0 === (s = y.find(".page-opacity-effect")).length && (s = $('<div class="page-opacity-effect"></div>'), y.append(s)), o && (C = d.find(".navbar-current:not(.stacked)"), (x = d.find(".navbar-previous:not(.stacked)")).length > 1 && (x = x.eq(x.length - 1)), l = function () {
                            var e, t, r = [],
                                a = h.rtl ? -1 : 1,
                                n = C.hasClass("navbar-transparent") && !C.hasClass("navbar-large") && !C.hasClass("navbar-transparent-visible"),
                                o = C.hasClass("navbar-large"),
                                i = C.hasClass("navbar-large-collapsed"),
                                s = C.hasClass("navbar-large-transparent") || C.hasClass("navbar-large") && C.hasClass("navbar-transparent"),
                                l = x.hasClass("navbar-transparent") && !x.hasClass("navbar-large") && !x.hasClass("navbar-transparent-visible"),
                                c = x.hasClass("navbar-large"),
                                u = x.hasClass("navbar-large-collapsed"),
                                p = x.hasClass("navbar-large-transparent") || x.hasClass("navbar-large") && x.hasClass("navbar-transparent"),
                                d = o && !i,
                                v = c && !u,
                                m = C.find(".left, .title, .right, .subnavbar, .fading, .title-large, .navbar-bg"),
                                g = x.find(".left, .title, .right, .subnavbar, .fading, .title-large, .navbar-bg");
                            return f.iosAnimateNavbarBackIcon && (e = C.hasClass("sliding") || C.find(".navbar-inner.sliding").length ? C.find(".left").find(".back .icon + span").eq(0) : C.find(".left.sliding").find(".back .icon + span").eq(0), t = x.hasClass("sliding") || x.find(".navbar-inner.sliding").length ? x.find(".left").find(".back .icon + span").eq(0) : x.find(".left.sliding").find(".back .icon + span").eq(0), e.length && g.each((function (t, r) {
                                $(r).hasClass("title") && (r.f7NavbarLeftOffset += e.prev(".icon")[0].offsetWidth)
                            }))), m.each((function (t, l) {
                                var c = $(l),
                                    u = c.hasClass("subnavbar"),
                                    p = c.hasClass("left"),
                                    h = c.hasClass("title"),
                                    m = c.hasClass("navbar-bg");
                                if ((!h && !m || !n) && (d || !c.hasClass(".title-large"))) {
                                    var g = {
                                        el: l
                                    };
                                    if (d) {
                                        if (h) return;
                                        if (c.hasClass("title-large")) return r.indexOf(g) < 0 && r.push(g), g.overflow = "visible", void c.find(".title-large-text").each((function (e, t) {
                                            r.push({
                                                el: t,
                                                transform: function (e) {
                                                    return "translateX(" + 100 * e * a + "%)"
                                                }
                                            })
                                        }))
                                    }
                                    if (v && (d || c.hasClass("title-large") && (r.indexOf(g) < 0 && r.push(g), g.opacity = 0), p)) return r.indexOf(g) < 0 && r.push(g), g.opacity = function (e) {
                                        return 1 - Math.pow(e, .33)
                                    }, void c.find(".back span").each((function (e, t) {
                                        r.push({
                                            el: t,
                                            "transform-origin": O,
                                            transform: function (e) {
                                                return "translateX(calc(" + e + " * (var(--f7-navbarTitleLargeOffset) - var(--f7-navbarLeftTextOffset)))) translateY(calc(" + e + " * (var(--f7-navbar-large-title-height) - var(--f7-navbar-large-title-padding-vertical) / 2))) scale(" + (1 + 1 * e) + ")"
                                            }
                                        })
                                    }));
                                    if (m) return r.indexOf(g) < 0 && r.push(g), d || v || (i ? (s && (g.className = "ios-swipeback-navbar-bg-large"), g.transform = function (e) {
                                        return "translateX(" + 100 * e * a + "%) translateY(calc(-1 * var(--f7-navbar-large-title-height)))"
                                    }) : g.transform = function (e) {
                                        return "translateX(" + 100 * e * a + "%)"
                                    }), !d && v && (g.className = "ios-swipeback-navbar-bg-large", g.transform = function (e) {
                                        return "translateX(" + 100 * e * a + "%) translateY(calc(-1 * " + (1 - e) + " * var(--f7-navbar-large-title-height)))"
                                    }), d && v && (g.transform = function (e) {
                                        return "translateX(" + 100 * e * a + "%)"
                                    }), void(d && !v && (g.transform = function (e) {
                                        return "translateX(" + 100 * e * a + "%) translateY(calc(-" + e + " * var(--f7-navbar-large-title-height)))"
                                    }));
                                    if (!c.hasClass("title-large")) {
                                        var b = c.hasClass("sliding") || c.parents(".navbar-inner.sliding").length;
                                        if (r.indexOf(g) < 0 && r.push(g), (!u || u && !b) && (g.opacity = function (e) {
                                                return 1 - Math.pow(e, .33)
                                            }), b) {
                                            var y = g;
                                            if (p && e.length && f.iosAnimateNavbarBackIcon) {
                                                var w = {
                                                    el: e[0]
                                                };
                                                y = w, r.push(w)
                                            }
                                            y.transform = function (e) {
                                                var t = e * y.el.f7NavbarRightOffset;
                                                return 1 === Device.pixelRatio && (t = Math.round(t)), u && o ? "translate3d(" + t + "px, calc(-1 * var(--f7-navbar-large-collapse-progress) * var(--f7-navbar-large-title-height)), 0)" : "translate3d(" + t + "px,0,0)"
                                            }
                                        }
                                    }
                                }
                            })), g.each((function (e, n) {
                                var o = $(n),
                                    i = o.hasClass("subnavbar"),
                                    s = o.hasClass("left"),
                                    h = o.hasClass("title"),
                                    m = o.hasClass("navbar-bg");
                                if (!h && !m || !l) {
                                    var g = {
                                        el: n
                                    };
                                    if (v) {
                                        if (h) return;
                                        if (r.indexOf(g) < 0 && r.push(g), o.hasClass("title-large")) return g.opacity = 1, g.overflow = "visible", void o.find(".title-large-text").each((function (e, t) {
                                            r.push({
                                                el: t,
                                                "transform-origin": P,
                                                opacity: function (e) {
                                                    return Math.pow(e, 3)
                                                },
                                                transform: function (e) {
                                                    return "translateX(calc(" + (1 - e) + " * (var(--f7-navbarLeftTextOffset) - var(--f7-navbarTitleLargeOffset)))) translateY(calc(" + (e - 1) + " * var(--f7-navbar-large-title-height) + " + (1 - e) + " * var(--f7-navbar-large-title-padding-vertical))) scale(" + (.5 + .5 * e) + ")"
                                                }
                                            })
                                        }))
                                    }
                                    if (m) return r.indexOf(g) < 0 && r.push(g), d || v || (u ? (p && (g.className = "ios-swipeback-navbar-bg-large"), g.transform = function (e) {
                                        return "translateX(" + (100 * e - 100) * a + "%) translateY(calc(-1 * var(--f7-navbar-large-title-height)))"
                                    }) : g.transform = function (e) {
                                        return "translateX(" + (100 * e - 100) * a + "%)"
                                    }), !d && v && (g.transform = function (e) {
                                        return "translateX(" + (100 * e - 100) * a + "%) translateY(calc(-1 * " + (1 - e) + " * var(--f7-navbar-large-title-height)))"
                                    }), d && !v && (g.className = "ios-swipeback-navbar-bg-large", g.transform = function (e) {
                                        return "translateX(" + (100 * e - 100) * a + "%) translateY(calc(-" + e + " * var(--f7-navbar-large-title-height)))"
                                    }), void(d && v && (g.transform = function (e) {
                                        return "translateX(" + (100 * e - 100) * a + "%)"
                                    }));
                                    if (!o.hasClass("title-large")) {
                                        var b = o.hasClass("sliding") || x.children(".navbar-inner.sliding").length;
                                        if (r.indexOf(g) < 0 && r.push(g), (!i || i && !b) && (g.opacity = function (e) {
                                                return Math.pow(e, 3)
                                            }), b) {
                                            var y = g;
                                            if (s && t.length && f.iosAnimateNavbarBackIcon) {
                                                var w = {
                                                    el: t[0]
                                                };
                                                y = w, r.push(w)
                                            }
                                            y.transform = function (e) {
                                                var t = y.el.f7NavbarLeftOffset * (1 - e);
                                                return 1 === Device.pixelRatio && (t = Math.round(t)), i && c ? "translate3d(" + t + "px, calc(-1 * var(--f7-navbar-large-collapse-progress) * var(--f7-navbar-large-title-height)), 0)" : "translate3d(" + t + "px,0,0)"
                                            }
                                        }
                                    }
                                }
                            })), r
                        }()), $(".sheet.modal-in").length > 0 && h.sheet && h.sheet.close($(".sheet.modal-in"))
                    }
                    e.f7PreventSwipePanel = !0, m = !0, h.preventSwipePanelBySwipeBack = !0, e.preventDefault();
                    var L = h.rtl ? -1 : 1;
                    (a = (n - g.x - T) * L) < 0 && (a = 0);
                    var M = Math.min(Math.max(a / r, 0), 1),
                        A = {
                            percentage: M,
                            progress: M,
                            currentPageEl: b[0],
                            previousPageEl: y[0],
                            currentNavbarEl: C[0],
                            previousNavbarEl: x[0]
                        };
                    p.trigger("swipeback:move", A), u.emit("swipebackMove", A);
                    var U = a * L,
                        B = (a / 5 - r / 5) * L;
                    h.rtl ? (U = Math.max(U, -r), B = Math.max(B, 0)) : (U = Math.min(U, r), B = Math.min(B, 0)), 1 === Device.pixelRatio && (U = Math.round(U), B = Math.round(B)), u.swipeBackActive = !0, $([b[0], y[0]]).addClass("page-swipeback-active"), b.transform("translate3d(" + U + "px,0,0)"), k && (i[0].style.opacity = 1 - 1 * M), "ios" === h.theme && y.transform("translate3d(" + B + "px,0,0)"), E && (s[0].style.opacity = 1 - 1 * M), o && R({
                        progress: M
                    })
                }
            }
        }

        function L() {
            if (h.preventSwipePanelBySwipeBack = !1, !v || !m) return v = !1, void(m = !1);
            v = !1, m = !1, u.swipeBackActive = !1;
            var e = $([b[0], y[0]]);
            if (e.removeClass("page-swipeback-active"), 0 === a) return e.transform(""), i && i.length > 0 && i.remove(), s && s.length > 0 && s.remove(), void(o && R({
                reset: !0
            }));
            var t = Utils.now() - n,
                l = !1;
            (t < 300 && a > 10 || t >= 300 && a > r / 2) && (b.removeClass("page-current").addClass("page-next" + ("ios" !== h.theme ? " page-next-on-right" : "")), y.removeClass("page-previous").addClass("page-current").removeAttr("aria-hidden"), i && (i[0].style.opacity = ""), s && (s[0].style.opacity = ""), o && (u.setNavbarPosition(C, "next"), u.setNavbarPosition(x, "current", !1)), l = !0), e.addClass("page-transitioning page-transitioning-swipeback"), l || (b[0]._clientLeft = b[0].clientLeft), e.transform(""), o && R({
                progress: l ? 1 : 0,
                transition: !0,
                reflow: !l
            }), w = !1, u.allowPageChange = !1;
            var c = {
                currentPageEl: b[0],
                previousPageEl: y[0],
                currentNavbarEl: C[0],
                previousNavbarEl: x[0]
            };
            l ? (u.currentRoute = y[0].f7Page.route, u.currentPage = y[0], u.pageCallback("beforeOut", b, C, "current", "next", {
                route: b[0].f7Page.route,
                swipeBack: !0
            }), u.pageCallback("beforeIn", y, x, "previous", "current", {
                route: y[0].f7Page.route,
                swipeBack: !0
            }, b[0]), p.trigger("swipeback:beforechange", c), u.emit("swipebackBeforeChange", c)) : (p.trigger("swipeback:beforereset", c), u.emit("swipebackBeforeReset", c)), b.transitionEnd((function () {
                e.removeClass("page-transitioning page-transitioning-swipeback"), o && R({
                    reset: !0,
                    transition: !1
                }), w = !0, u.allowPageChange = !0, l ? (1 === u.history.length && u.history.unshift(u.url), u.history.pop(), u.saveHistory(), f.pushState && History.back(), u.pageCallback("afterOut", b, C, "current", "next", {
                    route: b[0].f7Page.route,
                    swipeBack: !0
                }), u.pageCallback("afterIn", y, x, "previous", "current", {
                    route: y[0].f7Page.route,
                    swipeBack: !0
                }), f.stackPages && u.initialPages.indexOf(b[0]) >= 0 ? (b.addClass("stacked"), o && C.addClass("stacked")) : (u.pageCallback("beforeRemove", b, C, "next", {
                    swipeBack: !0
                }), u.removePage(b), o && u.removeNavbar(C)), p.trigger("swipeback:afterchange", c), u.emit("swipebackAfterChange", c), u.emit("routeChanged", u.currentRoute, u.previousRoute, u), f.preloadPreviousPage && u.back(u.history[u.history.length - 2], {
                    preload: !0
                })) : (p.trigger("swipeback:afterreset", c), u.emit("swipebackAfterReset", c)), i && i.length > 0 && i.remove(), s && s.length > 0 && s.remove()
            }))
        }
        c = !("touchstart" !== h.touchEvents.start || !Support.passiveListener) && {
            passive: !0,
            capture: !1
        }, p.on(h.touchEvents.start, N, c), h.on("touchmove:active", D), h.on("touchend:passive", L), u.on("routerDestroy", (function () {
            var e = !("touchstart" !== h.touchEvents.start || !Support.passiveListener) && {
                passive: !0,
                capture: !1
            };
            p.off(h.touchEvents.start, N, e), h.off("touchmove:active", D), h.off("touchend:passive", L)
        }))
    }

    function redirect(e, t, r) {
        var a = this,
            n = t.route.redirect;
        if (r.initial && a.params.pushState && (r.replaceState = !0, r.history = !0), "function" == typeof n) {
            a.allowPageChange = !1;
            var o = n.call(a, t, (function (t, n) {
                void 0 === n && (n = {}), a.allowPageChange = !0, a[e](t, Utils.extend({}, r, n))
            }), (function () {
                a.allowPageChange = !0
            }));
            return o && "string" == typeof o ? (a.allowPageChange = !0, a[e](o, r)) : a
        }
        return a[e](n, r)
    }

    function processQueue(e, t, r, a, n, o, i) {
        var s = [];
        Array.isArray(r) ? s.push.apply(s, r) : r && "function" == typeof r && s.push(r), t && (Array.isArray(t) ? s.push.apply(s, t) : s.push(t)),
            function t() {
                0 !== s.length ? s.shift().call(e, a, n, (function () {
                    t()
                }), (function () {
                    i()
                })) : o()
            }()
    }

    function processRouteQueue(e, t, r, a) {
        var n = this;

        function o() {
            e && e.route && (n.params.routesBeforeEnter || e.route.beforeEnter) ? (n.allowPageChange = !1, processQueue(n, n.params.routesBeforeEnter, e.route.beforeEnter, e, t, (function () {
                n.allowPageChange = !0, r()
            }), (function () {
                a()
            }))) : r()
        }
        t && t.route && (n.params.routesBeforeLeave || t.route.beforeLeave) ? (n.allowPageChange = !1, processQueue(n, n.params.routesBeforeLeave, t.route.beforeLeave, e, t, (function () {
            n.allowPageChange = !0, o()
        }), (function () {
            a()
        }))) : o()
    }

    function appRouterCheck(e, t) {
        if (!e.view) throw new Error("Framework7: it is not allowed to use router methods on global app router. Use router methods only on related View, e.g. app.views.main.router." + t + "(...)")
    }

    function asyncComponent(e, t, r, a) {
        function n(e) {
            e.then((function (e) {
                r({
                    component: e.default || e._default || e
                })
            })).catch((function (e) {
                throw a(), new Error(e)
            }))
        }
        if (t instanceof Promise) n(t);
        else {
            var o = t.call(e);
            o instanceof Promise ? n(o) : r({
                component: o
            })
        }
    }

    function refreshPage() {
        return appRouterCheck(this, "refreshPage"), this.navigate(this.currentRoute.url, {
            ignoreCache: !0,
            reloadCurrent: !0
        })
    }

    function forward(e, t) {
        void 0 === t && (t = {});
        var r, a, n, o = this,
            i = $(e),
            s = o.app,
            l = o.view,
            c = Utils.extend(!1, {
                animate: o.params.animate,
                pushState: !0,
                replaceState: !1,
                history: !0,
                reloadCurrent: o.params.reloadPages,
                reloadPrevious: !1,
                reloadAll: !1,
                clearPreviousHistory: !1,
                reloadDetail: o.params.reloadDetail,
                on: {}
            }, t),
            u = o.params.masterDetailBreakpoint > 0,
            p = u && c.route && c.route.route && !0 === c.route.route.master,
            d = o.currentRoute.modal;
        if (d || "popup popover sheet loginScreen actions customModal panel".split(" ").forEach((function (e) {
                o.currentRoute && o.currentRoute.route && o.currentRoute.route[e] && (d = !0, n = e)
            })), d) {
            var h = o.currentRoute.modal || o.currentRoute.route.modalInstance || s[n].get(),
                f = o.history[o.history.length - 2],
                v = o.findMatchingRoute(f);
            !v && f && (v = {
                url: f,
                path: f.split("?")[0],
                query: Utils.parseUrlQuery(f),
                route: {
                    path: f.split("?")[0],
                    url: f
                }
            }), o.modalRemove(h)
        }
        var m, g, b, y, w = o.dynamicNavbar,
            C = o.$el,
            x = i,
            k = c.reloadPrevious || c.reloadCurrent || c.reloadAll;
        if (o.allowPageChange = !1, 0 === x.length) return o.allowPageChange = !0, o;
        x.length && o.removeThemeElements(x), w && (b = x.children(".navbar"), g = o.$navbarsEl, 0 === b.length && x[0] && x[0].f7Page && (b = x[0].f7Page.$navbarEl)), c.route && c.route.route && c.route.route.keepAlive && !c.route.route.keepAliveData && (c.route.route.keepAliveData = {
            pageEl: i[0]
        });
        var E, S, T, O, P = C.children(".page:not(.stacked)").filter((function (e, t) {
            return t !== x[0]
        }));
        if (w && (E = g.children(".navbar:not(.stacked)").filter((function (e, t) {
                return t !== b[0]
            }))), c.reloadPrevious && P.length < 2) return o.allowPageChange = !0, o;
        if (u && !c.reloadAll) {
            for (var R = 0; R < P.length; R += 1) r || !P[R].classList.contains("page-master") || (r = P[R]);
            if ((S = !p && r) && r)
                for (var N = 0; N < P.length; N += 1) P[N].classList.contains("page-master-detail") && (a = P[N]);
            T = S && c.reloadDetail && s.width >= o.params.masterDetailBreakpoint && r
        }
        S && (O = !a || T || c.reloadAll || c.reloadCurrent);
        var D = "next";
        if (c.reloadCurrent || c.reloadAll || T ? D = "current" : c.reloadPrevious && (D = "previous"), x.removeClass("page-previous page-current page-next").addClass("page-" + D + (p ? " page-master" : "") + (S ? " page-master-detail" : "") + (O ? " page-master-detail-root" : "")).removeClass("stacked").trigger("page:unstack").trigger("page:position", {
                position: D
            }), o.emit("pageUnstack", x[0]), o.emit("pagePosition", x[0], D), (p || S) && (x.trigger("page:role", {
                role: p ? "master" : "detail",
                root: !!O
            }), o.emit("pageRole", x[0], {
                role: p ? "master" : "detail",
                detailRoot: !!O
            })), w && b.length && (b.removeClass("navbar-previous navbar-current navbar-next").addClass("navbar-" + D + (p ? " navbar-master" : "") + (S ? " navbar-master-detail" : "") + (O ? " navbar-master-detail-root" : "")).removeClass("stacked"), b.trigger("navbar:position", {
                position: D
            }), o.emit("navbarPosition", b[0], D), (p || S) && o.emit("navbarRole", b[0], {
                role: p ? "master" : "detail",
                detailRoot: !!O
            })), c.reloadCurrent || T) m = P.eq(P.length - 1), w && (y = $(s.navbar.getElByPage(m)));
        else if (c.reloadPrevious) m = P.eq(P.length - 2), w && (y = $(s.navbar.getElByPage(m)));
        else if (c.reloadAll) m = P.filter((function (e, t) {
            return t !== x[0]
        })), w && (y = E.filter((function (e, t) {
            return t !== b[0]
        })));
        else {
            var L = [],
                M = [];
            if (P.length > 1) {
                var A = 0;
                for (A = 0; A < P.length - 1; A += 1)
                    if (r && P[A] === r) P.eq(A).addClass("page-master-stacked"), P.eq(A).trigger("page:masterstack"), o.emit("pageMasterStack", P[A]), w && ($(s.navbar.getElByPage(r)).addClass("navbar-master-stacked"), o.emit("navbarMasterStack", s.navbar.getElByPage(r)));
                    else {
                        var U = s.navbar.getElByPage(P.eq(A));
                        o.params.stackPages ? (P.eq(A).addClass("stacked"), P.eq(A).trigger("page:stack"), o.emit("pageStack", P[A]), w && $(U).addClass("stacked")) : (L.push(P[A]), o.pageCallback("beforeRemove", P[A], E && E[A], "previous", void 0, c), o.removePage(P[A]), w && U && (M.push(U), o.removeNavbar(U)))
                    }
            }
            m = C.children(".page:not(.stacked)").filter((function (e, t) {
                return t !== x[0] && L.indexOf(t) < 0
            })), w && (y = g.children(".navbar:not(.stacked)").filter((function (e, t) {
                return t !== b[0] && M.indexOf(M) < 0
            }))), L = [], M = []
        }
        if (S && !c.reloadAll && ((m.length > 1 || T) && (m = m.filter((function (e, t) {
                return !t.classList.contains("page-master")
            }))), y && (y.length > 1 || T) && (y = y.filter((function (e, t) {
                return !t.classList.contains("navbar-master")
            })))), o.params.pushState && (c.pushState || c.replaceState) && !c.reloadPrevious) {
            var B = o.params.pushStateRoot || "";
            History[c.reloadCurrent || T && a || c.reloadAll || c.replaceState ? "replace" : "push"](l.id, {
                url: c.route.url
            }, B + o.params.pushStateSeparator + c.route.url)
        }
        c.reloadPrevious || (o.currentPageEl = x[0], w && b.length ? o.currentNavbarEl = b[0] : delete o.currentNavbarEl, o.currentRoute = c.route);
        var H = c.route.url;
        c.history && (((c.reloadCurrent || T && a) && o.history.length) > 0 || c.replaceState ? o.history[o.history.length - (c.reloadPrevious ? 2 : 1)] = H : c.reloadPrevious ? o.history[o.history.length - 2] = H : c.reloadAll ? o.history = [H] : o.history.push(H)), o.saveHistory();
        var j = x.parents(doc).length > 0,
            q = x[0].f7Component;
        if (c.reloadPrevious ? (q && !j ? q.$mount((function (e) {
                $(e).insertBefore(m)
            })) : x.insertBefore(m), w && b.length && (b.find(".title-large").length && b.addClass("navbar-large"), y.length ? b.insertBefore(y) : (o.$navbarsEl.parents(doc).length || o.$el.prepend(o.$navbarsEl), g.append(b)))) : (m.next(".page")[0] !== x[0] && (q && !j ? q.$mount((function (e) {
                C.append(e)
            })) : C.append(x[0])), w && b.length && (b.find(".title-large").length && b.addClass("navbar-large"), o.$navbarsEl.parents(doc).length || o.$el.prepend(o.$navbarsEl), g.append(b[0]))), j ? c.route && c.route.route && c.route.route.keepAlive && !x[0].f7PageMounted && (x[0].f7PageMounted = !0, o.pageCallback("mounted", x, b, D, k ? D : "current", c, m)) : o.pageCallback("mounted", x, b, D, k ? D : "current", c, m), (c.reloadCurrent || T) && m.length > 0 ? o.params.stackPages && o.initialPages.indexOf(m[0]) >= 0 ? (m.addClass("stacked"), m.trigger("page:stack"), o.emit("pageStack", m[0]), w && y.addClass("stacked")) : (o.pageCallback("beforeOut", m, y, "current", void 0, c), o.pageCallback("afterOut", m, y, "current", void 0, c), o.pageCallback("beforeRemove", m, y, "current", void 0, c), o.removePage(m), w && y && y.length && o.removeNavbar(y)) : c.reloadAll ? m.each((function (e, t) {
                var r = $(t),
                    a = $(s.navbar.getElByPage(r));
                o.params.stackPages && o.initialPages.indexOf(r[0]) >= 0 ? (r.addClass("stacked"), r.trigger("page:stack"), o.emit("pageStack", r[0]), w && a.addClass("stacked")) : (r.hasClass("page-current") && (o.pageCallback("beforeOut", m, y, "current", void 0, c), o.pageCallback("afterOut", m, y, "current", void 0, c)), o.pageCallback("beforeRemove", r, y && y.eq(e), "previous", void 0, c), o.removePage(r), w && a.length && o.removeNavbar(a))
            })) : c.reloadPrevious && (o.params.stackPages && o.initialPages.indexOf(m[0]) >= 0 ? (m.addClass("stacked"), m.trigger("page:stack"), o.emit("pageStack", m[0]), w && y.addClass("stacked")) : (o.pageCallback("beforeRemove", m, y, "previous", void 0, c), o.removePage(m), w && y && y.length && o.removeNavbar(y))), c.route.route.tab && o.tabLoad(c.route.route.tab, Utils.extend({}, c, {
                history: !1,
                pushState: !1
            })), u && l.checkMasterDetailBreakpoint(), o.pageCallback("init", x, b, D, k ? D : "current", c, m), c.reloadCurrent || c.reloadAll || T) return o.allowPageChange = !0, o.pageCallback("beforeIn", x, b, D, "current", c), x.removeAttr("aria-hidden"), w && b && b.removeAttr("aria-hidden"), o.pageCallback("afterIn", x, b, D, "current", c), c.reloadCurrent && c.clearPreviousHistory && o.clearPreviousHistory(), T && (o.setPagePosition($(r), "previous"), r.f7Page && r.f7Page.navbarEl && o.setNavbarPosition($(r.f7Page.navbarEl), "previous")), o;
        if (c.reloadPrevious) return o.allowPageChange = !0, o;

        function _() {
            o.setPagePosition(x, "current", !1), o.setPagePosition(m, "previous", !m.hasClass("page-master")), w && (o.setNavbarPosition(b, "current", !1), o.setNavbarPosition(y, "previous", !y.hasClass("navbar-master"))), o.allowPageChange = !0, o.pageCallback("afterOut", m, y, "current", "previous", c), o.pageCallback("afterIn", x, b, "next", "current", c);
            var e = (o.params.preloadPreviousPage || o.params[s.theme + "SwipeBack"]) && !p;
            e || (x.hasClass("smart-select-page") || x.hasClass("photo-browser-page") || x.hasClass("autocomplete-page") || x.hasClass("color-picker-page")) && (e = !0), e || (o.params.stackPages ? (m.addClass("stacked"), m.trigger("page:stack"), o.emit("pageStack", m[0]), w && y.addClass("stacked")) : x.attr("data-name") && "smart-select-page" === x.attr("data-name") || (o.pageCallback("beforeRemove", m, y, "previous", void 0, c), o.removePage(m), w && y.length && o.removeNavbar(y))), c.clearPreviousHistory && o.clearPreviousHistory(), o.emit("routeChanged", o.currentRoute, o.previousRoute, o), o.params.pushState && History.clearRouterQueue()
        }

        function F() {
            o.setPagePosition(m, "current", !1), o.setPagePosition(x, "next", !1), w && (o.setNavbarPosition(y, "current", !1), o.setNavbarPosition(b, "next", !1))
        }
        if (o.pageCallback("beforeOut", m, y, "current", "previous", c), o.pageCallback("beforeIn", x, b, "next", "current", c), !c.animate || p && s.width >= o.params.masterDetailBreakpoint) _();
        else {
            var V = o.params[o.app.theme + "PageLoadDelay"],
                I = o.params.transition;
            c.transition && (I = c.transition), !I && o.currentRoute && o.currentRoute.route && (I = o.currentRoute.route.transition), !I && o.currentRoute && o.currentRoute.route.options && (I = o.currentRoute.route.options.transition), I && (x[0].f7PageTransition = I), V ? setTimeout((function () {
                F(), o.animate(m, x, y, b, "forward", I, (function () {
                    _()
                }))
            }), V) : (F(), o.animate(m, x, y, b, "forward", I, (function () {
                _()
            })))
        }
        return o
    }

    function load(e, t, r) {
        void 0 === e && (e = {}), void 0 === t && (t = {});
        var a = this;
        if (!a.allowPageChange && !r) return a;
        var n = e,
            o = t,
            i = n.url,
            s = n.content,
            l = n.el,
            c = n.pageName,
            u = n.template,
            p = n.templateUrl,
            d = n.component,
            h = n.componentUrl;
        if (!o.reloadCurrent && o.route && o.route.route && o.route.route.parentPath && a.currentRoute.route && a.currentRoute.route.parentPath === o.route.route.parentPath) {
            if (o.route.url === a.url) return a.allowPageChange = !0, !1;
            var f = Object.keys(o.route.params).length === Object.keys(a.currentRoute.params).length;
            if (f && Object.keys(o.route.params).forEach((function (e) {
                    e in a.currentRoute.params && a.currentRoute.params[e] === o.route.params[e] || (f = !1)
                })), f) return !!o.route.route.tab && a.tabLoad(o.route.route.tab, o);
            if (!f && o.route.route.tab && a.currentRoute.route.tab && a.currentRoute.parentPath === o.route.parentPath) return a.tabLoad(o.route.route.tab, o)
        }
        if (o.route && o.route.url && a.url === o.route.url && !o.reloadCurrent && !o.reloadPrevious && !a.params.allowDuplicateUrls) return a.allowPageChange = !0, !1;

        function v(e, t) {
            return a.forward(e, Utils.extend(o, t))
        }

        function m() {
            return a.allowPageChange = !0, a
        }
        if (!o.route && i && (o.route = a.parseRouteUrl(i), Utils.extend(o.route, {
                route: {
                    url: i,
                    path: i
                }
            })), (i || p || h || d) && (a.allowPageChange = !1), s) a.forward(a.getPageEl(s), o);
        else if (u || p) try {
                a.pageTemplateLoader(u, p, o, v, m)
            } catch (e) {
                throw a.allowPageChange = !0, e
            } else if (l) a.forward(a.getPageEl(l), o);
            else if (c) a.forward(a.$el.children('.page[data-name="' + c + '"]').eq(0), o);
        else if (d || h) try {
            a.pageComponentLoader(a.el, d, h, o, v, m)
        } catch (e) {
            throw a.allowPageChange = !0, e
        } else i && (a.xhr && (a.xhr.abort(), a.xhr = !1), a.xhrRequest(i, o).then((function (e) {
            a.forward(a.getPageEl(e), o)
        })).catch((function () {
            a.allowPageChange = !0
        })));
        return a
    }

    function navigate(e, t) {
        void 0 === t && (t = {});
        var r, a, n, o, i, s, l, c = this;
        if (c.swipeBackActive) return c;
        if ("string" == typeof e ? r = e : (r = e.url, a = e.route, n = e.name, o = e.path, i = e.query, s = e.params), n || o) return (r = c.generateUrl({
            path: o,
            name: n,
            params: s,
            query: i
        })) ? c.navigate(r, t) : c;
        var u = c.app;
        if (appRouterCheck(c, "navigate"), "#" === r || "" === r) return c;
        var p = r.replace("./", "");
        if ("/" !== p[0] && 0 !== p.indexOf("#")) {
            var d = c.currentRoute.parentPath || c.currentRoute.path;
            p = ((d ? d + "/" : "/") + p).replace("///", "/").replace("//", "/")
        }
        if (!(l = a ? Utils.extend(c.parseRouteUrl(p), {
                route: Utils.extend({}, a)
            }) : c.findMatchingRoute(p))) return c;
        if (l.route && l.route.viewName) {
            var h = l.route.viewName,
                f = u.views[h];
            if (!f) throw new Error('Framework7: There is no View with "' + h + '" name that was specified in this route');
            if (f !== c.view) return f.router.navigate(e, t)
        }
        if (l.route.redirect) return redirect.call(c, "navigate", l, t);
        var v = {};

        function m() {
            var e = !1;

            function t(e, t) {
                c.allowPageChange = !1;
                var r = !1;
                t && t.context && (l.context ? l.context = Utils.extend({}, l.context, t.context) : l.context = t.context, v.route.context = l.context), "popup popover sheet loginScreen actions customModal panel".split(" ").forEach((function (a) {
                    if (e[a]) {
                        r = !0;
                        var n = Utils.extend({}, l, {
                            route: e
                        });
                        c.allowPageChange = !0, c.modalLoad(a, n, Utils.extend(v, t))
                    }
                })), r || c.load(e, Utils.extend(v, t), !0)
            }

            function r() {
                c.allowPageChange = !0
            }
            "popup popover sheet loginScreen actions customModal panel".split(" ").forEach((function (t) {
                l.route[t] && !e && (e = !0, c.modalLoad(t, l, v))
            })), l.route.keepAlive && l.route.keepAliveData && (c.load({
                el: l.route.keepAliveData.pageEl
            }, v, !1), e = !0), "url content component pageName el componentUrl template templateUrl".split(" ").forEach((function (t) {
                var r;
                l.route[t] && !e && (e = !0, c.load(((r = {})[t] = l.route[t], r), v, !1))
            })), e || (l.route.async && (c.allowPageChange = !1, l.route.async.call(c, v.route, c.currentRoute, t, r)), l.route.asyncComponent && asyncComponent(c, l.route.asyncComponent, t, r))
        }

        function g() {
            c.allowPageChange = !0
        }
        if (l.route.options ? Utils.extend(v, l.route.options, t) : Utils.extend(v, t), v.route = l, v && v.context && (l.context = v.context, v.route.context = v.context), c.params.masterDetailBreakpoint > 0 && l.route.masterRoute) {
            var b = !0,
                y = !1;
            if (c.currentRoute && c.currentRoute.route && (!c.currentRoute.route.master || c.currentRoute.route !== l.route.masterRoute && c.currentRoute.route.path !== l.route.masterRoute.path || (b = !1), !c.currentRoute.route.masterRoute || c.currentRoute.route.masterRoute !== l.route.masterRoute && c.currentRoute.route.masterRoute.path !== l.route.masterRoute.path || (b = !1, y = !0)), b || y && t.reloadAll) return c.navigate({
                path: l.route.masterRoute.path,
                params: l.params || {}
            }, {
                animate: !1,
                reloadAll: t.reloadAll,
                reloadCurrent: t.reloadCurrent,
                reloadPrevious: t.reloadPrevious,
                pushState: !t.initial,
                history: !t.initial,
                once: {
                    pageAfterIn: function () {
                        c.navigate(e, Utils.extend({}, t, {
                            animate: !1,
                            reloadAll: !1,
                            reloadCurrent: !1,
                            reloadPrevious: !1,
                            history: !t.initial,
                            pushState: !t.initial
                        }))
                    }
                }
            }), c
        }
        return processRouteQueue.call(c, l, c.currentRoute, (function () {
            l.route.modules ? u.loadModules(Array.isArray(l.route.modules) ? l.route.modules : [l.route.modules]).then((function () {
                m()
            })).catch((function () {
                g()
            })) : m()
        }), (function () {
            g()
        })), c
    }

    function tabLoad(e, t) {
        void 0 === t && (t = {});
        var r, a, n = this,
            o = Utils.extend({
                animate: n.params.animate,
                pushState: !0,
                history: !0,
                parentPageEl: null,
                preload: !1,
                on: {}
            }, t);
        o.route && (o.preload || o.route === n.currentRoute || (a = n.previousRoute, n.currentRoute = o.route), o.preload ? (r = o.route, a = n.currentRoute) : (r = n.currentRoute, a || (a = n.previousRoute)), n.params.pushState && o.pushState && !o.reloadPrevious && History.replace(n.view.id, {
            url: o.route.url
        }, (n.params.pushStateRoot || "") + n.params.pushStateSeparator + o.route.url), o.history && (n.history[Math.max(n.history.length - 1, 0)] = o.route.url, n.saveHistory()));
        var i, s = $(o.parentPageEl || n.currentPageEl);
        i = s.length && s.find("#" + e.id).length ? s.find("#" + e.id).eq(0) : n.view.selector ? n.view.selector + " #" + e.id : "#" + e.id;
        var l, c = n.app.tab.show({
                tabEl: i,
                animate: o.animate,
                tabRoute: o.route
            }),
            u = c.$newTabEl,
            p = c.$oldTabEl,
            d = c.animated,
            h = c.onTabsChanged;
        if (u && u.parents(".page").length > 0 && o.route) {
            var f = u.parents(".page")[0].f7Page;
            f && o.route && (f.route = o.route)
        }
        if (u[0].f7RouterTabLoaded) return p && p.length ? (d ? h((function () {
            n.emit("routeChanged", n.currentRoute, n.previousRoute, n)
        })) : n.emit("routeChanged", n.currentRoute, n.previousRoute, n), n) : n;

        function v(t, r) {
            var a = t.url,
                o = t.content,
                i = t.el,
                s = t.template,
                l = t.templateUrl,
                c = t.component,
                f = t.componentUrl;

            function v(t) {
                n.allowPageChange = !0, t && ("string" == typeof t ? u.html(t) : (u.html(""), t.f7Component ? t.f7Component.$mount((function (e) {
                    u.append(e)
                })) : u.append(t)), u[0].f7RouterTabLoaded = !0, function (t) {
                    n.removeThemeElements(u);
                    var r = u;
                    "string" != typeof t && (r = $(t)), r.trigger("tab:init tab:mounted", e), n.emit("tabInit tabMounted", u[0], e), p && p.length && (d ? h((function () {
                        n.emit("routeChanged", n.currentRoute, n.previousRoute, n), n.params.unloadTabContent && n.tabRemove(p, u, e)
                    })) : (n.emit("routeChanged", n.currentRoute, n.previousRoute, n), n.params.unloadTabContent && n.tabRemove(p, u, e)))
                }(t))
            }

            function m() {
                return n.allowPageChange = !0, n
            }
            if (o) v(o);
            else if (s || l) try {
                    n.tabTemplateLoader(s, l, r, v, m)
                } catch (e) {
                    throw n.allowPageChange = !0, e
                } else if (i) v(i);
                else if (c || f) try {
                n.tabComponentLoader(u[0], c, f, r, v, m)
            } catch (e) {
                throw n.allowPageChange = !0, e
            } else a && (n.xhr && (n.xhr.abort(), n.xhr = !1), n.xhrRequest(a, r).then((function (e) {
                v(e)
            })).catch((function () {
                n.allowPageChange = !0
            })))
        }

        function m(e, t) {
            v(e, Utils.extend(o, t))
        }

        function g() {
            n.allowPageChange = !0
        }
        return "url content component el componentUrl template templateUrl".split(" ").forEach((function (t) {
            var r;
            e[t] && (l = !0, v(((r = {})[t] = e[t], r), o))
        })), e.async ? e.async.call(n, r, a, m, g) : e.asyncComponent ? asyncComponent(n, e.asyncComponent, m, g) : l || (n.allowPageChange = !0), n
    }

    function tabRemove(e, t, r) {
        var a;
        e[0] && (e[0].f7RouterTabLoaded = !1, delete e[0].f7RouterTabLoaded), e.children().each((function (e, t) {
            t.f7Component && (a = !0, $(t).trigger("tab:beforeremove", r), t.f7Component.$destroy())
        })), a || e.trigger("tab:beforeremove", r), this.emit("tabBeforeRemove", e[0], t[0], r), this.removeTabContent(e[0], r)
    }

    function modalLoad(e, t, r) {
        void 0 === r && (r = {});
        var a, n = this,
            o = n.app,
            i = "panel" === e,
            s = i ? "panel" : "modal",
            l = Utils.extend({
                animate: n.params.animate,
                pushState: !0,
                history: !0,
                on: {}
            }, r),
            c = Utils.extend({}, t.route[e]),
            u = t.route;

        function p() {
            var r = o[e].create(c);
            u.modalInstance = r;
            var a = r.el;

            function p() {
                r.close()
            }
            r.on(s + "Open", (function () {
                a || (n.removeThemeElements(r.el), r.$el.trigger(e.toLowerCase() + ":init " + e.toLowerCase() + ":mounted", t, r), n.emit((i ? "" : "modalInit") + " " + e + "Init " + e + "Mounted", r.el, t, r)), n.once("swipeBackMove", p)
            })), r.on(s + "Close", (function () {
                n.off("swipeBackMove", p), r.closeByRouter || n.back()
            })), r.on(s + "Closed", (function () {
                r.$el.trigger(e.toLowerCase() + ":beforeremove", t, r), r.emit((i ? "" : "modalBeforeRemove ") + e + "BeforeRemove", r.el, t, r);
                var a = r.el.f7Component;
                a && a.$destroy(), Utils.nextTick((function () {
                    (a || c.component) && n.removeModal(r.el), r.destroy(), delete r.route, delete u.modalInstance
                }))
            })), l.route && (n.params.pushState && l.pushState && History.push(n.view.id, {
                url: l.route.url,
                modal: e
            }, (n.params.pushStateRoot || "") + n.params.pushStateSeparator + l.route.url), l.route !== n.currentRoute && (r.route = Utils.extend(l.route, {
                modal: r
            }), n.currentRoute = r.route), l.history && (n.history.push(l.route.url), n.saveHistory())), a && (n.removeThemeElements(r.el), r.$el.trigger(e.toLowerCase() + ":init " + e.toLowerCase() + ":mounted", t, r), n.emit(s + "Init " + e + "Init " + e + "Mounted", r.el, t, r)), r.open()
        }

        function d(e, t) {
            var r = e.url,
                a = e.content,
                i = e.template,
                s = e.templateUrl,
                l = e.component,
                u = e.componentUrl;

            function d(e) {
                e && ("string" == typeof e ? c.content = e : e.f7Component ? e.f7Component.$mount((function (e) {
                    c.el = e, o.root.append(e)
                })) : c.el = e, p())
            }

            function h() {
                return n.allowPageChange = !0, n
            }
            if (a) d(a);
            else if (i || s) try {
                n.modalTemplateLoader(i, s, t, d, h)
            } catch (e) {
                throw n.allowPageChange = !0, e
            } else if (l || u) try {
                n.modalComponentLoader(o.root[0], l, u, t, d, h)
            } catch (e) {
                throw n.allowPageChange = !0, e
            } else r ? (n.xhr && (n.xhr.abort(), n.xhr = !1), n.xhrRequest(r, t).then((function (e) {
                c.content = e, p()
            })).catch((function () {
                n.allowPageChange = !0
            }))) : p()
        }

        function h(e, t) {
            d(e, Utils.extend(l, t))
        }

        function f() {
            n.allowPageChange = !0
        }
        return "url content component el componentUrl template templateUrl".split(" ").forEach((function (e) {
            var t;
            c[e] && !a && (a = !0, d(((t = {})[e] = c[e], t), l))
        })), a || "actions" !== e || p(), c.async && c.async.call(n, l.route, n.currentRoute, h, f), c.asyncComponent && asyncComponent(n, c.asyncComponent, h, f), n
    }

    function modalRemove(e) {
        Utils.extend(e, {
            closeByRouter: !0
        }), e.close()
    }

    function backward(e, t) {
        var r, a, n, o, i, s, l, c, u = this,
            p = $(e),
            d = u.app,
            h = u.view,
            f = Utils.extend({
                animate: u.params.animate,
                pushState: !0,
                replaceState: !1
            }, t),
            v = u.params.masterDetailBreakpoint > 0,
            m = v && f.route && f.route.route && !0 === f.route.route.master,
            g = u.dynamicNavbar,
            b = p,
            y = u.$el.children(".page-current"),
            w = v && y.hasClass("page-master");
        if (b.length && u.removeThemeElements(b), g && (o = b.children(".navbar"), n = u.$navbarsEl, 0 === o.length && b[0] && b[0].f7Page && (o = b[0].f7Page.$navbarEl), i = n.find(".navbar-current")), u.allowPageChange = !1, 0 === b.length || 0 === y.length) return u.allowPageChange = !0, u;
        if (u.removeThemeElements(b), f.route && f.route.route && f.route.route.keepAlive && !f.route.route.keepAliveData && (f.route.route.keepAliveData = {
                pageEl: p[0]
            }), v) {
            for (var C = u.$el.children(".page:not(.stacked)").filter((function (e, t) {
                    return t !== b[0]
                })), x = 0; x < C.length; x += 1) r || !C[x].classList.contains("page-master") || (r = C[x]);
            !(s = !m && r && u.history.indexOf(f.route.url) > u.history.indexOf(r.f7Page.route.url)) && !m && r && r.f7Page && f.route.route.masterRoute && (s = f.route.route.masterRoute.path === r.f7Page.route.route.path)
        }
        if (s && r && r.f7Page && (l = u.history.indexOf(f.route.url) - u.history.indexOf(r.f7Page.route.url) == 1), b.addClass("page-previous" + (m ? " page-master" : "") + (s ? " page-master-detail" : "") + (l ? " page-master-detail-root" : "")).removeClass("stacked").removeAttr("aria-hidden").trigger("page:unstack").trigger("page:position", {
                position: "previous"
            }), u.emit("pageUnstack", b[0]), u.emit("pagePosition", b[0], "previous"), (m || s) && (b.trigger("page:role", {
                role: m ? "master" : "detail",
                root: !!l
            }), u.emit("pageRole", b[0], {
                role: m ? "master" : "detail",
                detailRoot: !!l
            })), g && o.length > 0 && (o.addClass("navbar-previous" + (m ? " navbar-master" : "") + (s ? " navbar-master-detail" : "") + (l ? " navbar-master-detail-root" : "")).removeClass("stacked").removeAttr("aria-hidden"), o.trigger("navbar:position", {
                position: "previous"
            }), u.emit("navbarPosition", o[0], "previous"), (m || l) && u.emit("navbarRole", o[0], {
                role: m ? "master" : "detail",
                detailRoot: !!l
            })), f.force && (y.prev(".page-previous:not(.stacked)").length > 0 || 0 === y.prev(".page-previous").length))
            if (u.history.indexOf(f.route.url) >= 0 ? (c = u.history.length - u.history.indexOf(f.route.url) - 1, u.history = u.history.slice(0, u.history.indexOf(f.route.url) + 2), h.history = u.history) : u.history[[u.history.length - 2]] ? u.history[u.history.length - 2] = f.route.url : u.history.unshift(u.url), c && u.params.stackPages) y.prevAll(".page-previous").each((function (e, t) {
                var n, o = $(t);
                g && (n = $(d.navbar.getElByPage(o))), o[0] !== b[0] && o.index() > b.index() && (u.initialPages.indexOf(o[0]) >= 0 ? (o.addClass("stacked"), o.trigger("page:stack"), u.emit("pageStack", o[0]), g && n.addClass("stacked")) : (u.pageCallback("beforeRemove", o, n, "previous", void 0, f), o[0] === r && (a = !0), u.removePage(o), g && n.length > 0 && u.removeNavbar(n)))
            }));
            else {
                var k, E = y.prev(".page-previous:not(.stacked)");
                g && (k = $(d.navbar.getElByPage(E))), u.params.stackPages && u.initialPages.indexOf(E[0]) >= 0 ? (E.addClass("stacked"), E.trigger("page:stack"), u.emit("pageStack", E[0]), k.addClass("stacked")) : E.length > 0 && (u.pageCallback("beforeRemove", E, k, "previous", void 0, f), E[0] === r && (a = !0), u.removePage(E), g && k.length && u.removeNavbar(k))
            } var S = b.parents(doc).length > 0,
            T = b[0].f7Component;

        function O() {
            0 === b.next(y).length && (!S && T ? T.$mount((function (e) {
                $(e).insertBefore(y)
            })) : b.insertBefore(y)), g && o.length && (o.find(".title-large").length && o.addClass("navbar-large"), o.insertBefore(i), i.length > 0 ? o.insertBefore(i) : (u.$navbarsEl.parents(doc).length || u.$el.prepend(u.$navbarsEl), n.append(o))), S ? f.route && f.route.route && f.route.route.keepAlive && !b[0].f7PageMounted && (b[0].f7PageMounted = !0, u.pageCallback("mounted", b, o, "previous", "current", f, y)) : u.pageCallback("mounted", b, o, "previous", "current", f, y)
        }
        if (f.preload) {
            O(), f.route.route.tab && u.tabLoad(f.route.route.tab, Utils.extend({}, f, {
                history: !1,
                pushState: !1,
                preload: !0
            })), m && (b.removeClass("page-master-stacked").trigger("page:masterunstack"), u.emit("pageMasterUnstack", b[0]), g && ($(d.navbar.getElByPage(b)).removeClass("navbar-master-stacked"), u.emit("navbarMasterUnstack", d.navbar.getElByPage(b)))), u.pageCallback("init", b, o, "previous", "current", f, y);
            var P = b.prevAll(".page-previous:not(.stacked):not(.page-master)");
            return P.length > 0 && P.each((function (e, t) {
                var r, a = $(t);
                g && (r = $(d.navbar.getElByPage(a))), u.params.stackPages && u.initialPages.indexOf(t) >= 0 ? (a.addClass("stacked"), a.trigger("page:stack"), u.emit("pageStack", a[0]), g && r.addClass("stacked")) : (u.pageCallback("beforeRemove", a, r, "previous", void 0), u.removePage(a), g && r.length && u.removeNavbar(r))
            })), u.allowPageChange = !0, u
        }
        if (!(Device.ie || Device.edge || Device.firefox && !Device.ios) && u.params.pushState && f.pushState)
            if (f.replaceState) {
                var R = u.params.pushStateRoot || "";
                History.replace(h.id, {
                    url: f.route.url
                }, R + u.params.pushStateSeparator + f.route.url)
            } else c ? History.go(-c) : History.back();
        if (f.replaceState ? u.history[u.history.length - 1] = f.route.url : (1 === u.history.length && u.history.unshift(u.url), u.history.pop()), u.saveHistory(), u.currentPageEl = b[0], g && o.length ? u.currentNavbarEl = o[0] : delete u.currentNavbarEl, u.currentRoute = f.route, (Device.ie || Device.edge || Device.firefox && !Device.ios) && u.params.pushState && f.pushState)
            if (f.replaceState) {
                var N = u.params.pushStateRoot || "";
                History.replace(h.id, {
                    url: f.route.url
                }, N + u.params.pushStateSeparator + f.route.url)
            } else c ? History.go(-c) : History.back();

        function D() {
            u.setPagePosition(b, "current", !1), u.setPagePosition(y, "next", !0), g && (u.setNavbarPosition(o, "current", !1), u.setNavbarPosition(i, "next", !0)), u.pageCallback("afterOut", y, i, "current", "next", f), u.pageCallback("afterIn", b, o, "previous", "current", f), u.params.stackPages && u.initialPages.indexOf(y[0]) >= 0 ? (y.addClass("stacked"), y.trigger("page:stack"), u.emit("pageStack", y[0]), g && i.addClass("stacked")) : (u.pageCallback("beforeRemove", y, i, "next", void 0, f), u.removePage(y), g && i.length && u.removeNavbar(i)), u.allowPageChange = !0, u.emit("routeChanged", u.currentRoute, u.previousRoute, u), (u.params.preloadPreviousPage || u.params[d.theme + "SwipeBack"]) && u.history[u.history.length - 2] && !m && u.back(u.history[u.history.length - 2], {
                preload: !0
            }), u.params.pushState && History.clearRouterQueue()
        }
        if (O(), f.route.route.tab && u.tabLoad(f.route.route.tab, Utils.extend({}, f, {
                history: !1,
                pushState: !1
            })), v && (w || a) && h.checkMasterDetailBreakpoint(!1), u.pageCallback("init", b, o, "previous", "current", f, y), u.pageCallback("beforeOut", y, i, "current", "next", f), u.pageCallback("beforeIn", b, o, "previous", "current", f), !f.animate || w && d.width >= u.params.masterDetailBreakpoint) D();
        else {
            var L = u.params.transition;
            y[0] && y[0].f7PageTransition && (L = y[0].f7PageTransition, delete y[0].f7PageTransition), f.transition && (L = f.transition), !L && u.previousRoute && u.previousRoute.route && (L = u.previousRoute.route.transition), !L && u.previousRoute && u.previousRoute.route && u.previousRoute.route.options && (L = u.previousRoute.route.options.transition), u.setPagePosition(y, "current"), u.setPagePosition(b, "previous", !1), g && (u.setNavbarPosition(i, "current"), u.setNavbarPosition(o, "previous", !1)), u.animate(y, b, i, o, "backward", L, (function () {
                D()
            }))
        }
        return u
    }

    function loadBack(e, t, r) {
        var a = this;
        if (!a.allowPageChange && !r) return a;
        var n = e,
            o = t,
            i = n.url,
            s = n.content,
            l = n.el,
            c = n.pageName,
            u = n.template,
            p = n.templateUrl,
            d = n.component,
            h = n.componentUrl;
        if (o.route.url && a.url === o.route.url && !o.reloadCurrent && !o.reloadPrevious && !a.params.allowDuplicateUrls) return !1;

        function f(e, t) {
            return a.backward(e, Utils.extend(o, t))
        }

        function v() {
            return a.allowPageChange = !0, a
        }
        if (!o.route && i && (o.route = a.parseRouteUrl(i)), (i || p || h || d) && (a.allowPageChange = !1), s) a.backward(a.getPageEl(s), o);
        else if (u || p) try {
                a.pageTemplateLoader(u, p, o, f, v)
            } catch (e) {
                throw a.allowPageChange = !0, e
            } else if (l) a.backward(a.getPageEl(l), o);
            else if (c) a.backward(a.$el.children('.page[data-name="' + c + '"]').eq(0), o);
        else if (d || h) try {
            a.pageComponentLoader(a.el, d, h, o, f, v)
        } catch (e) {
            throw a.allowPageChange = !0, e
        } else i && (a.xhr && (a.xhr.abort(), a.xhr = !1), a.xhrRequest(i, o).then((function (e) {
            a.backward(a.getPageEl(e), o)
        })).catch((function () {
            a.allowPageChange = !0
        })));
        return a
    }

    function back() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        var r, a, n, o = this;
        if (o.swipeBackActive) return o;
        "object" == typeof e[0] ? a = e[0] || {} : (r = e[0], a = e[1] || {});
        var i = a.name,
            s = a.params,
            l = a.query;
        if (i) return (r = o.generateUrl({
            name: i,
            params: s,
            query: l
        })) ? o.back(r, Utils.extend({}, a, {
            name: null,
            params: null,
            query: null
        })) : o;
        var c = o.app;
        appRouterCheck(o, "back");
        var u, p = o.currentRoute.modal;
        if (p || "popup popover sheet loginScreen actions customModal panel".split(" ").forEach((function (e) {
                o.currentRoute.route[e] && (p = !0, u = e)
            })), p) {
            var d, h = o.currentRoute.modal || o.currentRoute.route.modalInstance || c[u].get(),
                f = o.history[o.history.length - 2];
            if (h && h.$el) {
                var v = h.$el.prevAll(".modal-in");
                if (v.length && v[0].f7Modal) {
                    var m = v[0];
                    o.$el.parents(m).length || (d = m.f7Modal.route)
                }
            }
            if (d || (d = o.findMatchingRoute(f)), !d && f && (d = {
                    url: f,
                    path: f.split("?")[0],
                    query: Utils.parseUrlQuery(f),
                    route: {
                        path: f.split("?")[0],
                        url: f
                    }
                }), !(r && 0 !== r.replace(/[# ]/g, "").trim().length || d && h)) return o;
            var g = a.force && d && r;
            if (d && h) {
                var b = Device.ie || Device.edge || Device.firefox && !Device.ios,
                    y = o.params.pushState && !1 !== a.pushState,
                    w = o.currentRoute && o.currentRoute.route && o.currentRoute.route.options && !1 === o.currentRoute.route.options.pushState;
                !y || b || w || History.back(), o.currentRoute = d, o.history.pop(), o.saveHistory(), y && b && !w && History.back(), o.modalRemove(h), g && o.navigate(r, {
                    reloadCurrent: !0
                })
            } else h && (o.modalRemove(h), r && o.navigate(r, {
                reloadCurrent: !0
            }));
            return o
        }
        var C, x = o.$el.children(".page-current").prevAll(".page-previous:not(.page-master)").eq(0);
        if (o.params.masterDetailBreakpoint > 0) {
            var k = [];
            o.$el.children(".page").each((function (e, t) {
                k.push(t.className)
            }));
            var E = o.$el.children(".page-current").prevAll(".page-master").eq(0);
            if (E.length) {
                var $ = o.history[o.history.length - 2],
                    S = o.findMatchingRoute($);
                S && E[0].f7Page && S.route === E[0].f7Page.route.route && (x = E, a.preload || (C = c.width >= o.params.masterDetailBreakpoint))
            }
        }
        if (!a.force && x.length && !C) {
            if (o.params.pushState && x[0].f7Page && o.history[o.history.length - 2] !== x[0].f7Page.route.url) return o.back(o.history[o.history.length - 2], Utils.extend(a, {
                force: !0
            })), o;
            var T = x[0].f7Page.route;
            return processRouteQueue.call(o, T, o.currentRoute, (function () {
                o.loadBack({
                    el: x
                }, Utils.extend(a, {
                    route: T
                }))
            }), (function () {})), o
        }
        if ("#" === r && (r = void 0), r && "/" !== r[0] && 0 !== r.indexOf("#") && (r = ((o.path || "/") + r).replace("//", "/")), !r && o.history.length > 1 && (r = o.history[o.history.length - 2]), C && !a.force && o.history[o.history.length - 3]) return o.back(o.history[o.history.length - 3], Utils.extend({}, a || {}, {
            force: !0,
            animate: !1
        }));
        if (C && !a.force) return o;
        if ((n = o.findMatchingRoute(r)) || r && (n = {
                url: r,
                path: r.split("?")[0],
                query: Utils.parseUrlQuery(r),
                route: {
                    path: r.split("?")[0],
                    url: r
                }
            }), !n) return o;
        if (n.route.redirect) return redirect.call(o, "back", n, a);
        var O, P = {};
        if (n.route.options ? Utils.extend(P, n.route.options, a) : Utils.extend(P, a), P.route = n, P && P.context && (n.context = P.context, P.route.context = P.context), P.force && o.params.stackPages && (o.$el.children(".page-previous.stacked").each((function (e, t) {
                t.f7Page && t.f7Page.route && t.f7Page.route.url === n.url && (O = !0, o.loadBack({
                    el: t
                }, P))
            })), O)) return o;

        function R() {
            var e = !1;

            function t(e, t) {
                o.allowPageChange = !1, t && t.context && (n.context ? n.context = Utils.extend({}, n.context, t.context) : n.context = t.context, P.route.context = n.context), o.loadBack(e, Utils.extend(P, t), !0)
            }

            function r() {
                o.allowPageChange = !0
            }
            n.route.keepAlive && n.route.keepAliveData && (o.loadBack({
                el: n.route.keepAliveData.pageEl
            }, P), e = !0), "url content component pageName el componentUrl template templateUrl".split(" ").forEach((function (t) {
                var r;
                n.route[t] && !e && (e = !0, o.loadBack(((r = {})[t] = n.route[t], r), P))
            })), e || (n.route.async && (o.allowPageChange = !1, n.route.async.call(o, n, o.currentRoute, t, r)), n.route.asyncComponent && asyncComponent(o, n.route.asyncComponent, t, r))
        }

        function N() {
            o.allowPageChange = !0
        }
        return P.preload ? R() : processRouteQueue.call(o, n, o.currentRoute, (function () {
            n.route.modules ? c.loadModules(Array.isArray(n.route.modules) ? n.route.modules : [n.route.modules]).then((function () {
                R()
            })).catch((function () {
                N()
            })) : R()
        }), (function () {
            N()
        })), o
    }

    function clearPreviousPages(e) {
        appRouterCheck(e, "clearPreviousPages");
        var t = e.app,
            r = e.dynamicNavbar;
        e.$el.children(".page").filter((function (t, r) {
            return !(!e.currentRoute || !e.currentRoute.modal && !e.currentRoute.panel) || r !== e.currentPageEl
        })).each((function (a, n) {
            var o = $(n),
                i = $(t.navbar.getElByPage(o));
            e.params.stackPages && e.initialPages.indexOf(o[0]) >= 0 ? (o.addClass("stacked"), r && i.addClass("stacked")) : (e.pageCallback("beforeRemove", o, i, "previous", void 0, {}), e.removePage(o), r && i.length && e.removeNavbar(i))
        }))
    }

    function clearPreviousHistory() {
        appRouterCheck(this, "clearPreviousHistory");
        var e = this.history[this.history.length - 1];
        clearPreviousPages(this), this.history = [e], this.view.history = [e], this.saveHistory()
    }
    var Router = function (e) {
        function t(t, r) {
            e.call(this, {}, [void 0 === r ? t : r]);
            var a = this;
            a.isAppRouter = void 0 === r, a.isAppRouter ? Utils.extend(!1, a, {
                app: t,
                params: t.params.view,
                routes: t.routes || [],
                cache: t.cache
            }) : Utils.extend(!1, a, {
                app: t,
                view: r,
                viewId: r.id,
                params: r.params,
                routes: r.routes,
                $el: r.$el,
                el: r.el,
                $navbarsEl: r.$navbarsEl,
                navbarsEl: r.navbarsEl,
                history: r.history,
                scrollHistory: r.scrollHistory,
                cache: t.cache,
                dynamicNavbar: "ios" === t.theme && r.params.iosDynamicNavbar,
                initialPages: [],
                initialNavbars: []
            }), a.useModules(), a.tempDom = doc.createElement("div"), a.allowPageChange = !0;
            var n = {},
                o = {};
            return Object.defineProperty(a, "currentRoute", {
                enumerable: !0,
                configurable: !0,
                set: function (e) {
                    void 0 === e && (e = {}), o = Utils.extend({}, n), (n = e) && (a.url = n.url, a.emit("routeChange", e, o, a))
                },
                get: function () {
                    return n
                }
            }), Object.defineProperty(a, "previousRoute", {
                enumerable: !0,
                configurable: !0,
                get: function () {
                    return o
                },
                set: function (e) {
                    o = e
                }
            }), a
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.animatableNavElements = function (e, t, r, a, n) {
            var o, i, s = this.dynamicNavbar,
                l = this.params.iosAnimateNavbarBackIcon;

            function c(e, t) {
                var r, a = e.hasClass("sliding") || t.hasClass("sliding"),
                    n = e.hasClass("subnavbar"),
                    o = !a || !n,
                    i = e.find(".back .icon");
                return a && l && e.hasClass("left") && i.length > 0 && i.next("span").length && (e = i.next("span"), r = !0), {
                    $el: e,
                    isIconLabel: r,
                    leftOffset: e[0].f7NavbarLeftOffset,
                    rightOffset: e[0].f7NavbarRightOffset,
                    isSliding: a,
                    isSubnavbar: n,
                    needsOpacityTransition: o
                }
            }
            return s && (o = [], i = [], e.children(".navbar-inner").children(".left, .right, .title, .subnavbar").each((function (t, i) {
                var s = $(i);
                s.hasClass("left") && a && "forward" === n || s.hasClass("title") && r || o.push(c(s, e.children(".navbar-inner")))
            })), t.hasClass("navbar-master") && this.params.masterDetailBreakpoint > 0 && this.app.width >= this.params.masterDetailBreakpoint || t.children(".navbar-inner").children(".left, .right, .title, .subnavbar").each((function (e, o) {
                var s = $(o);
                s.hasClass("left") && r && !a && "forward" === n || s.hasClass("left") && r && "backward" === n || s.hasClass("title") && a || i.push(c(s, t.children(".navbar-inner")))
            })), [i, o].forEach((function (e) {
                e.forEach((function (t) {
                    var r = t,
                        a = t.isSliding,
                        n = t.$el,
                        s = e === i ? o : i;
                    a && n.hasClass("title") && s && s.forEach((function (e) {
                        if (e.isIconLabel) {
                            var t = e.$el[0];
                            r.leftOffset += t && t.offsetLeft || 0
                        }
                    }))
                }))
            }))), {
                newNavEls: o,
                oldNavEls: i
            }
        }, t.prototype.animate = function (e, t, r, a, n, o, i) {
            var s = this;
            if (s.params.animateCustom) s.params.animateCustom.apply(s, [e, t, r, a, n, i]);
            else {
                var l = s.dynamicNavbar,
                    c = "ios" === s.app.theme;
                if (o) {
                    var u = "router-transition-custom router-transition-" + o + "-" + n;
                    return ("forward" === n ? t : e).animationEnd((function () {
                        s.$el.removeClass(u), l && s.$navbarsEl.length && (a && s.$navbarsEl.prepend(a), r && s.$navbarsEl.prepend(r)), i && i()
                    })), l && (a && t && (s.setNavbarPosition(a, ""), a.removeClass("navbar-next navbar-previous navbar-current"), t.prepend(a)), r && e && (s.setNavbarPosition(r, ""), r.removeClass("navbar-next navbar-previous navbar-current"), e.prepend(r))), void s.$el.addClass(u)
                }
                var p, d, h, f, v, m, g = "router-transition-" + n + " router-transition";
                if (c && l) {
                    s.params.masterDetailBreakpoint > 0 && s.app.width >= s.params.masterDetailBreakpoint && (r.hasClass("navbar-master") && a.hasClass("navbar-master-detail") || r.hasClass("navbar-master-detail") && a.hasClass("navbar-master")) || (v = r && r.hasClass("navbar-large"), m = a && a.hasClass("navbar-large"), h = v && !r.hasClass("navbar-large-collapsed"), f = m && !a.hasClass("navbar-large-collapsed"));
                    var b = s.animatableNavElements(a, r, f, h, n);
                    p = b.newNavEls, d = b.oldNavEls
                }("forward" === n ? t : e).animationEnd((function () {
                    s.dynamicNavbar && (a && (a.removeClass("router-navbar-transition-to-large router-navbar-transition-from-large"), a.addClass("navbar-no-title-large-transition"), Utils.nextFrame((function () {
                        a.removeClass("navbar-no-title-large-transition")
                    }))), r && r.removeClass("router-navbar-transition-to-large router-navbar-transition-from-large"), a.hasClass("sliding") || a.children(".navbar-inner.sliding").length ? a.find(".title, .left, .right, .left .icon, .subnavbar").transform("") : a.find(".sliding").transform(""), r.hasClass("sliding") || r.children(".navbar-inner.sliding").length ? r.find(".title, .left, .right, .left .icon, .subnavbar").transform("") : r.find(".sliding").transform("")), s.$el.removeClass(g), i && i()
                })), l ? (y(0), Utils.nextFrame((function () {
                    y(1), s.$el.addClass(g)
                }))) : s.$el.addClass(g)
            }

            function y(e) {
                c && l && (1 === e && (f && (a.addClass("router-navbar-transition-to-large"), r.addClass("router-navbar-transition-to-large")), h && (a.addClass("router-navbar-transition-from-large"), r.addClass("router-navbar-transition-from-large"))), p.forEach((function (t) {
                    var r = t.$el,
                        a = "forward" === n ? t.rightOffset : t.leftOffset;
                    t.isSliding && (t.isSubnavbar && m ? r[0].style.setProperty("transform", "translate3d(" + a * (1 - e) + "px, calc(-1 * var(--f7-navbar-large-collapse-progress) * var(--f7-navbar-large-title-height)), 0)", "important") : r.transform("translate3d(" + a * (1 - e) + "px,0,0)"))
                })), d.forEach((function (t) {
                    var r = t.$el,
                        a = "forward" === n ? t.leftOffset : t.rightOffset;
                    t.isSliding && (t.isSubnavbar && v ? r.transform("translate3d(" + a * e + "px, calc(-1 * var(--f7-navbar-large-collapse-progress) * var(--f7-navbar-large-title-height)), 0)") : r.transform("translate3d(" + a * e + "px,0,0)"))
                })))
            }
        }, t.prototype.removeModal = function (e) {
            this.removeEl(e)
        }, t.prototype.removeTabContent = function (e) {
            $(e).html("")
        }, t.prototype.removeNavbar = function (e) {
            this.removeEl(e)
        }, t.prototype.removePage = function (e) {
            var t = $(e),
                r = t && t[0] && t[0].f7Page;
            r && r.route && r.route.route && r.route.route.keepAlive ? t.remove() : this.removeEl(e)
        }, t.prototype.removeEl = function (e) {
            if (e) {
                var t = $(e);
                0 !== t.length && (t.find(".tab").each((function (e, t) {
                    $(t).children().each((function (e, t) {
                        t.f7Component && ($(t).trigger("tab:beforeremove"), t.f7Component.$destroy())
                    }))
                })), t[0].f7Component && t[0].f7Component.$destroy && t[0].f7Component.$destroy(), this.params.removeElements && (this.params.removeElementsWithTimeout ? setTimeout((function () {
                    t.remove()
                }), this.params.removeElementsTimeout) : t.remove()))
            }
        }, t.prototype.getPageEl = function (e) {
            if ("string" == typeof e) this.tempDom.innerHTML = e;
            else {
                if ($(e).hasClass("page")) return e;
                this.tempDom.innerHTML = "", $(this.tempDom).append(e)
            }
            return this.findElement(".page", this.tempDom)
        }, t.prototype.findElement = function (e, t, r) {
            var a = this.view,
                n = this.app,
                o = $(t),
                i = e;
            r && (i += ":not(.stacked)");
            var s = o.find(i).filter((function (e, t) {
                return 0 === $(t).parents(".popup, .dialog, .popover, .actions-modal, .sheet-modal, .login-screen, .page").length
            }));
            return s.length > 1 && ("string" == typeof a.selector && (s = o.find(a.selector + " " + i)), s.length > 1 && (s = o.find("." + n.params.viewMainClass + " " + i))), 1 === s.length ? s : (r || (s = this.findElement(i, o, !0)), s && 1 === s.length ? s : s && s.length > 1 ? $(s[0]) : void 0)
        }, t.prototype.flattenRoutes = function (e) {
            void 0 === e && (e = this.routes);
            var t = this,
                r = [];
            return e.forEach((function (e) {
                var a = !1;
                if ("tabs" in e && e.tabs) {
                    var n = e.tabs.map((function (t) {
                        var r = Utils.extend({}, e, {
                            path: (e.path + "/" + t.path).replace("///", "/").replace("//", "/"),
                            parentPath: e.path,
                            tab: t
                        });
                        return delete r.tabs, delete r.routes, r
                    }));
                    a = !0, r = r.concat(t.flattenRoutes(n))
                }
                if ("detailRoutes" in e) {
                    var o = e.detailRoutes.map((function (t) {
                        var r = Utils.extend({}, t);
                        return r.masterRoute = e, r.masterRoutePath = e.path, r
                    }));
                    r = r.concat(e, t.flattenRoutes(o))
                }
                if ("routes" in e) {
                    var i = e.routes.map((function (t) {
                        var r = Utils.extend({}, t);
                        return r.path = (e.path + "/" + r.path).replace("///", "/").replace("//", "/"), r
                    }));
                    r = a ? r.concat(t.flattenRoutes(i)) : r.concat(e, t.flattenRoutes(i))
                }
                "routes" in e || "tabs" in e && e.tabs || "detailRoutes" in e || r.push(e)
            })), r
        }, t.prototype.parseRouteUrl = function (e) {
            if (!e) return {};
            var t = Utils.parseUrlQuery(e),
                r = e.split("#")[1],
                a = e.split("#")[0].split("?")[0];
            return {
                query: t,
                hash: r,
                params: {},
                url: e,
                path: a
            }
        }, t.prototype.generateUrl = function (e) {
            if (void 0 === e && (e = {}), "string" == typeof e) return e;
            var t = e.name,
                r = e.path,
                a = e.params,
                n = e.query;
            if (!t && !r) throw new Error('Framework7: "name" or "path" parameter is required');
            var o = t ? this.findRouteByKey("name", t) : this.findRouteByKey("path", r);
            if (!o) throw t ? new Error('Framework7: route with name "' + t + '" not found') : new Error('Framework7: route with path "' + r + '" not found');
            var i = this.constructRouteUrl(o, {
                params: a,
                query: n
            });
            if (!i) throw new Error("Framework7: can't construct URL for route with name \"" + t + '"');
            return i
        }, t.prototype.constructRouteUrl = function (e, t) {
            void 0 === t && (t = {});
            var r, a = t.params,
                n = t.query,
                o = e.path,
                i = compile(o);
            try {
                r = i(a || {})
            } catch (e) {
                throw new Error("Framework7: error constructing route URL from passed params:\nRoute: " + o + "\n" + e.toString())
            }
            return n && (r += "string" == typeof n ? "?" + n : "?" + Utils.serializeObject(n)), r
        }, t.prototype.findTabRoute = function (e) {
            var t, r = $(e),
                a = this.currentRoute.route.parentPath,
                n = r.attr("id");
            return this.flattenRoutes(this.routes).forEach((function (e) {
                e.parentPath === a && e.tab && e.tab.id === n && (t = e)
            })), t
        }, t.prototype.findRouteByKey = function (e, t) {
            var r, a = this.routes;
            return this.flattenRoutes(a).forEach((function (a) {
                r || a[e] === t && (r = a)
            })), r
        }, t.prototype.findMatchingRoute = function (e) {
            if (e) {
                var t, r = this.routes,
                    a = this.flattenRoutes(r),
                    n = this.parseRouteUrl(e),
                    o = n.path,
                    i = n.query,
                    s = n.hash,
                    l = n.params;
                return a.forEach((function (r) {
                    if (!t) {
                        var a, n, c = [],
                            u = [r.path];
                        if (r.alias && ("string" == typeof r.alias ? u.push(r.alias) : Array.isArray(r.alias) && r.alias.forEach((function (e) {
                                u.push(e)
                            }))), u.forEach((function (e) {
                                a || (a = pathToRegexp(e, c).exec(o))
                            })), a) c.forEach((function (e, t) {
                            if ("number" != typeof e.name) {
                                var r = a[t + 1];
                                l[e.name] = null == r ? r : decodeURIComponent(r)
                            }
                        })), r.parentPath && (n = o.split("/").slice(0, r.parentPath.split("/").length - 1).join("/")), t = {
                            query: i,
                            hash: s,
                            params: l,
                            url: e,
                            path: o,
                            parentPath: n,
                            route: r,
                            name: r.name
                        }
                    }
                })), t
            }
        }, t.prototype.replaceRequestUrlParams = function (e, t) {
            void 0 === e && (e = ""), void 0 === t && (t = {});
            var r = e;
            return "string" == typeof r && r.indexOf("{{") >= 0 && t && t.route && t.route.params && Object.keys(t.route.params).length && Object.keys(t.route.params).forEach((function (e) {
                var a = new RegExp("{{" + e + "}}", "g");
                r = r.replace(a, t.route.params[e] || "")
            })), r
        }, t.prototype.removeFromXhrCache = function (e) {
            for (var t = this.cache.xhr, r = !1, a = 0; a < t.length; a += 1) t[a].url === e && (r = a);
            !1 !== r && t.splice(r, 1)
        }, t.prototype.xhrRequest = function (e, t) {
            var r = this,
                a = r.params,
                n = t.ignoreCache,
                o = e,
                i = o.indexOf("?") >= 0;
            return a.passRouteQueryToRequest && t && t.route && t.route.query && Object.keys(t.route.query).length && (o += (i ? "&" : "?") + Utils.serializeObject(t.route.query), i = !0), a.passRouteParamsToRequest && t && t.route && t.route.params && Object.keys(t.route.params).length && (o += (i ? "&" : "?") + Utils.serializeObject(t.route.params), i = !0), o.indexOf("{{") >= 0 && (o = r.replaceRequestUrlParams(o, t)), a.xhrCacheIgnoreGetParameters && o.indexOf("?") >= 0 && (o = o.split("?")[0]), new Promise((function (e, i) {
                if (a.xhrCache && !n && o.indexOf("nocache") < 0 && a.xhrCacheIgnore.indexOf(o) < 0)
                    for (var s = 0; s < r.cache.xhr.length; s += 1) {
                        var l = r.cache.xhr[s];
                        if (l.url === o && Utils.now() - l.time < a.xhrCacheDuration) return void e(l.content)
                    }
                r.xhr = r.app.request({
                    url: o,
                    method: "GET",
                    beforeSend: function (e) {
                        r.emit("routerAjaxStart", e, t)
                    },
                    complete: function (n, s) {
                        r.emit("routerAjaxComplete", n), "error" !== s && "timeout" !== s && n.status >= 200 && n.status < 300 || 0 === n.status ? (a.xhrCache && "" !== n.responseText && (r.removeFromXhrCache(o), r.cache.xhr.push({
                            url: o,
                            time: Utils.now(),
                            content: n.responseText
                        })), r.emit("routerAjaxSuccess", n, t), e(n.responseText)) : (r.emit("routerAjaxError", n, t), i(n))
                    },
                    error: function (e) {
                        r.emit("routerAjaxError", e, t), i(e)
                    }
                })
            }))
        }, t.prototype.setNavbarPosition = function (e, t, r) {
            e.removeClass("navbar-previous navbar-current navbar-next"), t && e.addClass("navbar-" + t), !1 === r ? e.removeAttr("aria-hidden") : !0 === r && e.attr("aria-hidden", "true"), e.trigger("navbar:position", {
                position: t
            }), this.emit("navbarPosition", e[0], t)
        }, t.prototype.setPagePosition = function (e, t, r) {
            e.removeClass("page-previous page-current page-next"), e.addClass("page-" + t), !1 === r ? e.removeAttr("aria-hidden") : !0 === r && e.attr("aria-hidden", "true"), e.trigger("page:position", {
                position: t
            }), this.emit("pagePosition", e[0], t)
        }, t.prototype.removeThemeElements = function (e) {
            var t, r = this.app.theme;
            "ios" === r ? t = ".md-only, .aurora-only, .if-md, .if-aurora, .if-not-ios, .not-ios" : "md" === r ? t = ".ios-only, .aurora-only, .if-ios, .if-aurora, .if-not-md, .not-md" : "aurora" === r && (t = ".ios-only, .md-only, .if-ios, .if-md, .if-not-aurora, .not-aurora"), $(e).find(t).remove()
        }, t.prototype.getPageData = function (e, t, r, a, n, o) {
            void 0 === n && (n = {});
            var i, s, l = $(e).eq(0),
                c = $(t).eq(0),
                u = l[0].f7Page || {};
            if (("next" === r && "current" === a || "current" === r && "previous" === a) && (i = "forward"), ("current" === r && "next" === a || "previous" === r && "current" === a) && (i = "backward"), u && !u.fromPage) {
                var p = $(o);
                p.length && (s = p[0].f7Page)
            }(s = u.pageFrom || s) && s.pageFrom && (s.pageFrom = null);
            var d = {
                app: this.app,
                view: this.view,
                router: this,
                $el: l,
                el: l[0],
                $pageEl: l,
                pageEl: l[0],
                $navbarEl: c,
                navbarEl: c[0],
                name: l.attr("data-name"),
                position: r,
                from: r,
                to: a,
                direction: i,
                route: u.route ? u.route : n,
                pageFrom: s
            };
            return l[0].f7Page = d, d
        }, t.prototype.pageCallback = function (e, t, r, a, n, o, i) {
            if (void 0 === o && (o = {}), t) {
                var s = this,
                    l = $(t);
                if (l.length) {
                    var c = $(r),
                        u = o.route,
                        p = s.params.restoreScrollTopOnBack && !(s.params.masterDetailBreakpoint > 0 && l.hasClass("page-master") && s.app.width >= s.params.masterDetailBreakpoint),
                        d = l[0].f7Page && l[0].f7Page.route && l[0].f7Page.route.route && l[0].f7Page.route.route.keepAlive;
                    "beforeRemove" === e && d && (e = "beforeUnmount");
                    var h = "page" + (e[0].toUpperCase() + e.slice(1, e.length)),
                        f = "page:" + e.toLowerCase(),
                        v = {};
                    (v = "beforeRemove" === e && l[0].f7Page ? Utils.extend(l[0].f7Page, {
                        from: a,
                        to: n,
                        position: a
                    }) : s.getPageData(l[0], c[0], a, n, u, i)).swipeBack = !!o.swipeBack;
                    var m = o.route ? o.route.route : {},
                        g = m.on;
                    void 0 === g && (g = {});
                    var b = m.once;
                    if (void 0 === b && (b = {}), o.on && Utils.extend(g, o.on), o.once && Utils.extend(b, o.once), "mounted" === e && C(), "init" === e) {
                        if (p && ("previous" === a || !a) && "current" === n && s.scrollHistory[v.route.url] && !l.hasClass("no-restore-scroll")) {
                            var y = l.find(".page-content");
                            y.length > 0 && (y = y.filter((function (e, t) {
                                return 0 === $(t).parents(".tab:not(.tab-active)").length && !$(t).is(".tab:not(.tab-active)")
                            }))), y.scrollTop(s.scrollHistory[v.route.url])
                        }
                        if (C(), l[0].f7PageInitialized) return l.trigger("page:reinit", v), void s.emit("pageReinit", v);
                        l[0].f7PageInitialized = !0
                    }
                    if (p && "beforeOut" === e && "current" === a && "previous" === n) {
                        var w = l.find(".page-content");
                        w.length > 0 && (w = w.filter((function (e, t) {
                            return 0 === $(t).parents(".tab:not(.tab-active)").length && !$(t).is(".tab:not(.tab-active)")
                        }))), s.scrollHistory[v.route.url] = w.scrollTop()
                    }
                    p && "beforeOut" === e && "current" === a && "next" === n && delete s.scrollHistory[v.route.url], l.trigger(f, v), s.emit(h, v), "beforeRemove" !== e && "beforeUnmount" !== e || (l[0].f7RouteEventsAttached && (l[0].f7RouteEventsOn && Object.keys(l[0].f7RouteEventsOn).forEach((function (e) {
                        l.off(Utils.eventNameToColonCase(e), l[0].f7RouteEventsOn[e])
                    })), l[0].f7RouteEventsOnce && Object.keys(l[0].f7RouteEventsOnce).forEach((function (e) {
                        l.off(Utils.eventNameToColonCase(e), l[0].f7RouteEventsOnce[e])
                    })), l[0].f7RouteEventsAttached = null, l[0].f7RouteEventsOn = null, l[0].f7RouteEventsOnce = null, delete l[0].f7RouteEventsAttached, delete l[0].f7RouteEventsOn, delete l[0].f7RouteEventsOnce), d || (l[0].f7Page && l[0].f7Page.navbarEl && delete l[0].f7Page.navbarEl.f7Page, l[0].f7Page = null))
                }
            }

            function C() {
                l[0].f7RouteEventsAttached || (l[0].f7RouteEventsAttached = !0, g && Object.keys(g).length > 0 && (l[0].f7RouteEventsOn = g, Object.keys(g).forEach((function (e) {
                    g[e] = g[e].bind(s), l.on(Utils.eventNameToColonCase(e), g[e])
                }))), b && Object.keys(b).length > 0 && (l[0].f7RouteEventsOnce = b, Object.keys(b).forEach((function (e) {
                    b[e] = b[e].bind(s), l.once(Utils.eventNameToColonCase(e), b[e])
                }))))
            }
        }, t.prototype.saveHistory = function () {
            this.view.history = this.history, this.params.pushState && (win.localStorage["f7router-" + this.view.id + "-history"] = JSON.stringify(this.history))
        }, t.prototype.restoreHistory = function () {
            this.params.pushState && win.localStorage["f7router-" + this.view.id + "-history"] && (this.history = JSON.parse(win.localStorage["f7router-" + this.view.id + "-history"]), this.view.history = this.history)
        }, t.prototype.clearHistory = function () {
            this.history = [], this.view && (this.view.history = []), this.saveHistory()
        }, t.prototype.updateCurrentUrl = function (e) {
            appRouterCheck(this, "updateCurrentUrl"), this.history.length ? this.history[this.history.length - 1] = e : this.history.push(e);
            var t = this.parseRouteUrl(e),
                r = t.query,
                a = t.hash,
                n = t.params,
                o = t.url,
                i = t.path;
            if (this.currentRoute && Utils.extend(this.currentRoute, {
                    query: r,
                    hash: a,
                    params: n,
                    url: o,
                    path: i
                }), this.params.pushState) {
                var s = this.params.pushStateRoot || "";
                History.replace(this.view.id, {
                    url: e
                }, s + this.params.pushStateSeparator + e)
            }
            this.saveHistory(), this.emit("routeUrlUpdate", this.currentRoute, this)
        }, t.prototype.init = function () {
            var e = this,
                t = e.app,
                r = e.view;
            (r && e.params.iosSwipeBack && "ios" === t.theme || r && e.params.mdSwipeBack && "md" === t.theme || r && e.params.auroraSwipeBack && "aurora" === t.theme) && SwipeBack(e);
            var a, n, o = e.params.url,
                i = doc.location.href.split(doc.location.origin)[1],
                s = e.params,
                l = s.pushState,
                c = s.pushStateOnLoad,
                u = s.pushStateSeparator,
                p = s.pushStateAnimateOnLoad,
                d = e.params.pushStateRoot;
            if (win.cordova && l && !u && !d && doc.location.pathname.indexOf("index.html") && (console.warn("Framework7: wrong or not complete pushState configuration, trying to guess pushStateRoot"), d = doc.location.pathname.split("index.html")[0]), l && c ? (d && i.indexOf(d) >= 0 && "" === (i = i.split(d)[1]) && (i = "/"), o = u.length > 0 && i.indexOf(u) >= 0 ? i.split(u)[1] : i, e.restoreHistory(), e.history.indexOf(o) >= 0 ? e.history = e.history.slice(0, e.history.indexOf(o) + 1) : e.params.url === o ? e.history = [o] : History.state && History.state[r.id] && History.state[r.id].url === e.history[e.history.length - 1] ? o = e.history[e.history.length - 1] : e.history = [i.split(u)[0] || "/", o], e.history.length > 1 ? a = !0 : e.history = [], e.saveHistory()) : (o || (o = i), doc.location.search && o.indexOf("?") < 0 && (o += doc.location.search), doc.location.hash && o.indexOf("#") < 0 && (o += doc.location.hash)), e.history.length > 1 ? (n = e.findMatchingRoute(e.history[0])) || (n = Utils.extend(e.parseRouteUrl(e.history[0]), {
                    route: {
                        url: e.history[0],
                        path: e.history[0].split("?")[0]
                    }
                })) : (n = e.findMatchingRoute(o)) || (n = Utils.extend(e.parseRouteUrl(o), {
                    route: {
                        url: o,
                        path: o.split("?")[0]
                    }
                })), e.params.stackPages && e.$el.children(".page").each((function (t, r) {
                    var a = $(r);
                    e.initialPages.push(a[0]), e.dynamicNavbar && a.children(".navbar").length > 0 && e.initialNavbars.push(a.children(".navbar")[0])
                })), 0 === e.$el.children(".page:not(.stacked)").length && o && e.params.loadInitialPage) e.navigate(o, {
                initial: !0,
                reloadCurrent: !0,
                pushState: !1
            });
            else if (e.$el.children(".page:not(.stacked)").length) {
                var h;
                e.currentRoute = n, e.$el.children(".page:not(.stacked)").each((function (t, a) {
                    var n, o = $(a);
                    e.setPagePosition(o, "current"), e.dynamicNavbar && ((n = o.children(".navbar")).length > 0 ? (e.$navbarsEl.parents(doc).length || e.$el.prepend(e.$navbarsEl), e.setNavbarPosition(n, "current"), e.$navbarsEl.append(n), n.children(".title-large").length && n.addClass("navbar-large"), o.children(".navbar").remove()) : (e.$navbarsEl.addClass("navbar-hidden"), n.children(".title-large").length && e.$navbarsEl.addClass("navbar-hidden navbar-large-hidden"))), e.currentRoute && e.currentRoute.route && e.currentRoute.route.master && e.params.masterDetailBreakpoint > 0 && (o.addClass("page-master"), o.trigger("page:role", {
                        role: "master"
                    }), n && n.length && n.addClass("navbar-master"), r.checkMasterDetailBreakpoint());
                    var i = {
                        route: e.currentRoute
                    };
                    e.currentRoute && e.currentRoute.route && e.currentRoute.route.options && Utils.extend(i, e.currentRoute.route.options), e.currentPageEl = o[0], e.dynamicNavbar && n.length && (e.currentNavbarEl = n[0]), e.removeThemeElements(o), e.dynamicNavbar && n.length && e.removeThemeElements(n), i.route.route.tab && (h = !0, e.tabLoad(i.route.route.tab, Utils.extend({}, i))), e.pageCallback("init", o, n, "current", void 0, i)
                })), a && e.navigate(o, {
                    initial: !0,
                    pushState: !1,
                    history: !1,
                    animate: p,
                    once: {
                        pageAfterIn: function () {
                            (e.params.preloadPreviousPage || e.params[t.theme + "SwipeBack"]) && e.history.length > 2 && e.back({
                                preload: !0
                            })
                        }
                    }
                }), a || h || (e.history.push(o), e.saveHistory())
            }!(o && l && c) || History.state && History.state[r.id] || History.initViewState(r.id, {
                url: o
            }), e.emit("local::init routerInit", e)
        }, t.prototype.destroy = function () {
            var e = this;
            e.emit("local::destroy routerDestroy", e), Object.keys(e).forEach((function (t) {
                e[t] = null, delete e[t]
            })), e = null
        }, t
    }(Framework7Class);
    Router.prototype.forward = forward, Router.prototype.load = load, Router.prototype.navigate = navigate, Router.prototype.refreshPage = refreshPage, Router.prototype.tabLoad = tabLoad, Router.prototype.tabRemove = tabRemove, Router.prototype.modalLoad = modalLoad, Router.prototype.modalRemove = modalRemove, Router.prototype.backward = backward, Router.prototype.loadBack = loadBack, Router.prototype.back = back, Router.prototype.clearPreviousHistory = clearPreviousHistory;
    var RouterModule = {
        name: "router",
        static: {
            Router: Router
        },
        instance: {
            cache: {
                xhr: [],
                templates: [],
                components: []
            }
        },
        create: function () {
            this.app ? this.params.router && (this.router = new Router(this.app, this)) : this.router = new Router(this)
        }
    };

    function resizableView(e) {
        var t = e.app;
        if (!e.resizableInitialized) {
            Utils.extend(e, {
                resizable: !0,
                resizableWidth: null,
                resizableInitialized: !0
            });
            var r = $("html"),
                a = e.$el;
            if (a) {
                var n, o, i, s, l, c, u, p = {};
                (n = e.$el.children(".view-resize-handler")).length || (e.$el.append('<div class="view-resize-handler"></div>'), n = e.$el.children(".view-resize-handler")), e.$resizeHandlerEl = n, a.addClass("view-resizable");
                var d = !!Support.passiveListener && {
                    passive: !0
                };
                e.$el.on(t.touchEvents.start, ".view-resize-handler", f, d), t.on("touchmove:active", v), t.on("touchend:passive", m), t.on("resize", g), e.on("beforeOpen", g), e.once("viewDestroy", (function () {
                    a.removeClass("view-resizable"), e.$resizeHandlerEl.remove(), e.$el.off(t.touchEvents.start, ".view-resize-handler", f, d), t.off("touchmove:active", v), t.off("touchend:passive", m), t.off("resize", g), e.off("beforeOpen", g)
                }))
            }
        }

        function h(e) {
            if (!e) return null;
            if (e.indexOf("%") >= 0 || e.indexOf("vw") >= 0) return parseInt(e, 10) / 100 * t.width;
            var r = parseInt(e, 10);
            return Number.isNaN(r) ? null : r
        }

        function f(t) {
            if (e.resizable && a.hasClass("view-resizable") && a.hasClass("view-master-detail")) {
                p.x = "touchstart" === t.type ? t.targetTouches[0].pageX : t.pageX, p.y = "touchstart" === t.type ? t.targetTouches[0].pageY : t.pageY, i = !1, o = !0;
                var r = a.children(".page-master");
                c = h(r.css("min-width")), u = h(r.css("max-width"))
            }
        }

        function v(d) {
            if (o) {
                d.f7PreventSwipePanel = !0;
                var h = "touchmove" === d.type ? d.targetTouches[0].pageX : d.pageX;
                i || (l = n[0].offsetLeft + n[0].offsetWidth, a.addClass("view-resizing"), r.css("cursor", "col-resize")), i = !0, d.preventDefault(), s = h - p.x;
                var f = l + s;
                c && !Number.isNaN(c) && (f = Math.max(f, c)), u && !Number.isNaN(u) && (f = Math.min(f, u)), f = Math.min(Math.max(f, 0), t.width), e.resizableWidth = f, r[0].style.setProperty("--f7-page-master-width", f + "px"), a.trigger("view:resize", f), e.emit("local::resize viewResize", e, f)
            }
        }

        function m() {
            if ($("html").css("cursor", ""), !o || !i) return o = !1, void(i = !1);
            o = !1, i = !1, r[0].style.setProperty("--f7-page-master-width", e.resizableWidth + "px"), a.removeClass("view-resizing")
        }

        function g() {
            e.resizableWidth && (c = h(n.css("min-width")), u = h(n.css("max-width")), c && !Number.isNaN(c) && e.resizableWidth < c && (e.resizableWidth = Math.max(e.resizableWidth, c)), u && !Number.isNaN(u) && e.resizableWidth > u && (e.resizableWidth = Math.min(e.resizableWidth, u)), e.resizableWidth = Math.min(Math.max(e.resizableWidth, 0), t.width), r[0].style.setProperty("--f7-page-master-width", e.resizableWidth + "px"))
        }
    }
    var View = function (e) {
        function t(t, r, a) {
            void 0 === a && (a = {}), e.call(this, a, [t]);
            var n, o, i, s = t,
                l = $(r),
                c = this;
            if (0 === l.length) {
                var u = "Framework7: can't create a View instance because ";
                throw new Error(u += "string" == typeof r ? 'the selector "' + r + "\" didn't match any element" : "el must be an HTMLElement or Dom7 object")
            }
            return c.params = Utils.extend({
                routes: [],
                routesAdd: []
            }, s.params.view, a), c.params.routes.length > 0 ? c.routes = c.params.routes : c.routes = [].concat(s.routes, c.params.routesAdd), n = "string" == typeof r ? r : (l.attr("id") ? "#" + l.attr("id") : "") + (l.attr("class") ? "." + l.attr("class").replace(/ /g, ".").replace(".active", "") : ""), "ios" === s.theme && c.params.iosDynamicNavbar && 0 === (o = l.children(".navbars").eq(0)).length && (o = $('<div class="navbars"></div>')), Utils.extend(!1, c, {
                app: s,
                $el: l,
                el: l[0],
                name: c.params.name,
                main: c.params.main || l.hasClass("view-main"),
                $navbarsEl: o,
                navbarsEl: o ? o[0] : void 0,
                selector: n,
                history: [],
                scrollHistory: {}
            }), l[0].f7View = c, c.useModules(), s.views.push(c), c.main && (s.views.main = c), c.name && (s.views[c.name] = c), c.index = s.views.indexOf(c), i = c.name ? "view_" + c.name : c.main ? "view_main" : "view_" + c.index, c.id = i, s.initialized ? c.init() : s.on("init", (function () {
                c.init()
            })), c
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.destroy = function () {
            var e = this,
                t = e.app;
            e.$el.trigger("view:beforedestroy"), e.emit("local::beforeDestroy viewBeforeDestroy", e), t.off("resize", e.checkMasterDetailBreakpoint), e.main ? (t.views.main = null, delete t.views.main) : e.name && (t.views[e.name] = null, delete t.views[e.name]), e.$el[0].f7View = null, delete e.$el[0].f7View, t.views.splice(t.views.indexOf(e), 1), e.params.router && e.router && e.router.destroy(), e.emit("local::destroy viewDestroy", e), Object.keys(e).forEach((function (t) {
                e[t] = null, delete e[t]
            })), e = null
        }, t.prototype.checkMasterDetailBreakpoint = function (e) {
            var t = this.app,
                r = this.$el.hasClass("view-master-detail"),
                a = t.width >= this.params.masterDetailBreakpoint && this.$el.children(".page-master").length;
            void 0 === e && a || !0 === e ? (this.$el.addClass("view-master-detail"), r || (this.emit("local::masterDetailBreakpoint viewMasterDetailBreakpoint", this), this.$el.trigger("view:masterDetailBreakpoint"))) : (this.$el.removeClass("view-master-detail"), r && (this.emit("local::masterDetailBreakpoint viewMasterDetailBreakpoint", this), this.$el.trigger("view:masterDetailBreakpoint")))
        }, t.prototype.initMasterDetail = function () {
            var e = this.app;
            this.checkMasterDetailBreakpoint = this.checkMasterDetailBreakpoint.bind(this), this.checkMasterDetailBreakpoint(), this.params.masterDetailResizable && resizableView(this), e.on("resize", this.checkMasterDetailBreakpoint)
        }, t.prototype.init = function () {
            this.params.router && (this.params.masterDetailBreakpoint > 0 && this.initMasterDetail(), this.router.init(), this.$el.trigger("view:init"), this.emit("local::init viewInit", this))
        }, t
    }(Framework7Class);

    function initClicks(e) {
        e.on("click", (function (t) {
            var r = $(t.target),
                a = r.closest("a"),
                n = a.length > 0,
                o = n && a.attr("href");
            if (n && (a.is(e.params.clicks.externalLinks) || o && o.indexOf("javascript:") >= 0)) {
                var i = a.attr("target");
                o && win.cordova && win.cordova.InAppBrowser && ("_system" === i || "_blank" === i) && (t.preventDefault(), win.cordova.InAppBrowser.open(o, i))
            } else {
                Object.keys(e.modules).forEach((function (a) {
                    var n = e.modules[a].clicks;
                    n && (t.preventF7Router || Object.keys(n).forEach((function (a) {
                        var o = r.closest(a).eq(0);
                        o.length > 0 && n[a].call(e, o, o.dataset(), t)
                    })))
                }));
                var s = {};
                if (n && (t.preventDefault(), s = a.dataset()), !t.preventF7Router)
                    if (!a.hasClass("prevent-router") && !a.hasClass("router-prevent"))
                        if (o && o.length > 0 && "#" !== o[0] || a.hasClass("back")) {
                            var l;
                            if (s.view && "current" === s.view ? l = e.views.current : s.view ? l = $(s.view)[0].f7View : (l = r.parents(".view")[0] && r.parents(".view")[0].f7View, !a.hasClass("back") && l && l.params.linksView && ("string" == typeof l.params.linksView ? l = $(l.params.linksView)[0].f7View : l.params.linksView instanceof View && (l = l.params.linksView))), l || e.views.main && (l = e.views.main), !l || !l.router) return;
                            if (s.context && "string" == typeof s.context) try {
                                s.context = JSON.parse(s.context)
                            } catch (e) {}
                            a[0].f7RouteProps && (s.props = a[0].f7RouteProps), a.hasClass("back") ? l.router.back(o, s) : l.router.navigate(o, s)
                        }
            }
        }))
    }
    View.use(RouterModule);
    var ClicksModule = {
            name: "clicks",
            params: {
                clicks: {
                    externalLinks: ".external"
                }
            },
            on: {
                init: function () {
                    initClicks(this)
                }
            }
        },
        RouterTemplateLoaderModule = {
            name: "routerTemplateLoader",
            proto: {
                templateLoader: function (e, t, r, a, n) {
                    var o = this;

                    function i(e) {
                        var t, i;
                        try {
                            if ("function" == typeof (i = r.context || {})) i = i.call(o);
                            else if ("string" == typeof i) try {
                                i = JSON.parse(i)
                            } catch (e) {
                                throw n(), e
                            }
                            t = "function" == typeof e ? e(i) : Template7.compile(e)(Utils.extend({}, i || {}, {
                                $app: o.app,
                                $root: Utils.extend({}, o.app.data, o.app.methods),
                                $route: r.route,
                                $f7route: r.route,
                                $router: o,
                                $f7router: o,
                                $theme: {
                                    ios: "ios" === o.app.theme,
                                    md: "md" === o.app.theme,
                                    aurora: "aurora" === o.app.theme
                                }
                            }))
                        } catch (e) {
                            throw n(), e
                        }
                        a(t, {
                            context: i
                        })
                    }
                    t ? (o.xhr && (o.xhr.abort(), o.xhr = !1), o.xhrRequest(t, r).then((function (e) {
                        i(e)
                    })).catch((function () {
                        n()
                    }))) : i(e)
                },
                modalTemplateLoader: function (e, t, r, a, n) {
                    return this.templateLoader(e, t, r, (function (e) {
                        a(e)
                    }), n)
                },
                tabTemplateLoader: function (e, t, r, a, n) {
                    return this.templateLoader(e, t, r, (function (e) {
                        a(e)
                    }), n)
                },
                pageTemplateLoader: function (e, t, r, a, n) {
                    var o = this;
                    return o.templateLoader(e, t, r, (function (e, t) {
                        void 0 === t && (t = {}), a(o.getPageEl(e), t)
                    }), n)
                }
            }
        },
        RouterComponentLoaderModule = {
            name: "routerComponentLoader",
            proto: {
                componentLoader: function (e, t, r, a, n) {
                    void 0 === r && (r = {});
                    var o, i = this,
                        s = i.app,
                        l = "string" == typeof e ? e : t,
                        c = i.replaceRequestUrlParams(l, r);

                    function u(e) {
                        var t = r.context || {};
                        if ("function" == typeof t) t = t.call(i);
                        else if ("string" == typeof t) try {
                            t = JSON.parse(t)
                        } catch (e) {
                            throw n(e), e
                        }
                        var o = Utils.merge({}, t, {
                            $route: r.route,
                            $f7route: r.route,
                            $router: i,
                            $f7router: i,
                            $theme: {
                                ios: "ios" === s.theme,
                                md: "md" === s.theme,
                                aurora: "aurora" === s.theme
                            }
                        });
                        r.componentOptions && r.componentOptions.el && (e.el = r.componentOptions.el), r.componentOptions && r.componentOptions.root && (e.root = r.componentOptions.root), s.component.create(e, o).then((function (e) {
                            a(e.el)
                        })).catch((function (e) {
                            throw n(e), new Error(e)
                        }))
                    }
                    c && i.params.componentCache && i.cache.components.forEach((function (e) {
                        e.url === c && (o = e.component)
                    })), c && o ? u(o) : c && !o ? (i.xhr && (i.xhr.abort(), i.xhr = !1), i.xhrRequest(l, r).then((function (e) {
                        var t = s.component.parse(e);
                        i.params.componentCache && i.cache.components.push({
                            url: c,
                            component: t
                        }), u(t)
                    })).catch((function (e) {
                        throw n(), e
                    }))) : u(e)
                },
                modalComponentLoader: function (e, t, r, a, n, o) {
                    this.componentLoader(t, r, a, (function (e) {
                        n(e)
                    }), o)
                },
                tabComponentLoader: function (e, t, r, a, n, o) {
                    this.componentLoader(t, r, a, (function (e) {
                        n(e)
                    }), o)
                },
                pageComponentLoader: function (e, t, r, a, n, o) {
                    this.componentLoader(t, r, a, (function (e, t) {
                        void 0 === t && (t = {}), n(e, t)
                    }), o)
                }
            }
        };

    function vnode(e, t, r, a, n) {
        return {
            sel: e,
            data: t,
            children: r,
            text: a,
            elm: n,
            key: void 0 === t ? void 0 : t.key
        }
    }
    var array = Array.isArray;

    function primitive(e) {
        return "string" == typeof e || "number" == typeof e
    }

    function addNS(e, t, r) {
        if (e.ns = "http://www.w3.org/2000/svg", "foreignObject" !== r && void 0 !== t)
            for (var a = 0; a < t.length; ++a) {
                var n = t[a].data;
                void 0 !== n && addNS(n, t[a].children, t[a].sel)
            }
    }

    function h(e, t, r) {
        var a, n, o, i = {};
        if (void 0 !== r ? (i = t, array(r) ? a = r : primitive(r) ? n = r : r && r.sel && (a = [r])) : void 0 !== t && (array(t) ? a = t : primitive(t) ? n = t : t && t.sel ? a = [t] : i = t), array(a))
            for (o = 0; o < a.length; ++o) primitive(a[o]) && (a[o] = vnode(void 0, void 0, void 0, a[o], void 0));
        return "s" !== e[0] || "v" !== e[1] || "g" !== e[2] || 3 !== e.length && "." !== e[3] && "#" !== e[3] || addNS(i, a, e), vnode(e, i, a, n, void 0)
    }
    var customComponents = {},
        selfClosing = "area base br col command embed hr img input keygen link menuitem meta param source track wbr".split(" "),
        propsAttrs = "hidden checked disabled readonly selected autofocus autoplay required multiple value indeterminate".split(" "),
        booleanProps = "hidden checked disabled readonly selected autofocus autoplay required multiple readOnly indeterminate".split(" "),
        tempDomDIV = doc.createElement("div"),
        tempDomTBODY, tempDomTROW;

    function toCamelCase$1(e) {
        return e.split("-").map((function (e, t) {
            return 0 === t ? e.toLowerCase() : e[0].toUpperCase() + e.substr(1)
        })).join("")
    }

    function contextFromAttrs() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        var r = {};
        return e.forEach((function (e) {
            void 0 === e && (e = {}), Object.keys(e).forEach((function (t) {
                r[toCamelCase$1(t)] = e[t]
            }))
        })), r
    }

    function createCustomComponent(e) {
        var t = e.app,
            r = e.vnode,
            a = e.tagName,
            n = e.data;
        t.component.create(Object.assign({
            el: r.elm
        }, customComponents[a]), {
            $props: contextFromAttrs(n.attrs || {}, n.props || {})
        }, r.children).then((function (e) {
            r.data && r.data.on && e && e.$el && Object.keys(r.data.on).forEach((function (t) {
                e.$el.on(t, r.data.on[t])
            })), r.elm.__component__ = e
        }))
    }

    function updateCustomComponent(e) {
        var t = e && e.elm && e.elm.__component__;
        if (t) {
            var r = contextFromAttrs(e.data.attrs || {}, e.data.props || {});
            t.$children = e.children, Object.assign(t.$props, r), t.$update()
        }
    }

    function destroyCustomComponent(e) {
        var t = e && e.elm && e.elm.__component__;
        if (t) {
            var r = t.el,
                a = t.$el;
            e.data && e.data.on && a && Object.keys(e.data.on).forEach((function (t) {
                a.off(t, e.data.on[t])
            })), t.$destroy && t.$destroy(), r && r.parentNode && r.parentNode.removeChild(r), delete e.elm.__component__
        }
    }

    function getHooks(e, t, r, a, n) {
        var o = {},
            i = [],
            s = [],
            l = [],
            c = [],
            u = !1;
        e && e.attrs && e.attrs.component && (n = e.attrs.component, delete e.attrs.component, u = !0);
        var p = n && n.indexOf("-") > 0 && customComponents[n];
        if (p && (i.push((function (r) {
                (r.sel === n || u) && createCustomComponent({
                    app: t,
                    vnode: r,
                    tagName: n,
                    data: e
                })
            })), s.push((function (e) {
                destroyCustomComponent(e)
            })), l.push((function (e, t) {
                updateCustomComponent(t)
            }))), !p) {
            if (!e || !e.attrs || !e.attrs.class) return o;
            e.attrs.class.split(" ").forEach((function (e) {
                r || i.push.apply(i, t.getVnodeHooks("insert", e)), s.push.apply(s, t.getVnodeHooks("destroy", e)), l.push.apply(l, t.getVnodeHooks("update", e)), c.push.apply(c, t.getVnodeHooks("postpatch", e))
            }))
        }
        return a && !r && c.push((function (e, t) {
            var r = t || e;
            r && r.data && r.data.context && r.data.context.$options.updated && r.data.context.$hook("updated")
        })), 0 === i.length && 0 === s.length && 0 === l.length && 0 === c.length || (i.length && (o.insert = function (e) {
            i.forEach((function (t) {
                return t(e)
            }))
        }), s.length && (o.destroy = function (e) {
            s.forEach((function (t) {
                return t(e)
            }))
        }), l.length && (o.update = function (e, t) {
            l.forEach((function (r) {
                return r(e, t)
            }))
        }), c.length && (o.postpatch = function (e, t) {
            c.forEach((function (r) {
                return r(e, t)
            }))
        })), o
    }

    function getEventHandler(e, t, r) {
        void 0 === r && (r = {});
        var a, n, o = r.stop,
            i = r.prevent,
            s = r.once,
            l = !1,
            c = !0;
        if ((a = e.indexOf("(") < 0 ? e : e.split("(")[0]).indexOf(".") >= 0) a.split(".").forEach((function (e, r) {
            if (0 !== r || "this" !== e) {
                if (0 === r && "window" === e) return n = win, void(c = !1);
                if (n || (n = t), !n[e]) throw new Error("Framework7: Component doesn't have method \"" + a.split(".").slice(0, r + 1).join(".") + '"');
                n = n[e]
            }
        }));
        else {
            if (!t[a]) throw new Error("Framework7: Component doesn't have method \"" + a + '"');
            n = t[a]
        }
        return c && (n = n.bind(t)),
            function () {
                for (var r = [], a = arguments.length; a--;) r[a] = arguments[a];
                var c = r[0],
                    u = [];
                if (!s || !l) {
                    if (o && c.stopPropagation(), i && c.preventDefault(), l = !0, e.indexOf("(") < 0) u = r;
                    else {
                        var p = e.split("(")[1].split(")")[0].replace(/'[^']*'|"[^"]*"/g, (function (e) {
                            return e.replace(/,/g, "<_comma_>")
                        })).split(",").map((function (e) {
                            return e.replace(/<_comma_>/g, ",")
                        }));
                        p.forEach((function (e) {
                            var r = e.trim();
                            if (isNaN(r))
                                if ("true" === r) r = !0;
                                else if ("false" === r) r = !1;
                            else if ("null" === r) r = null;
                            else if ("undefined" === r) r = void 0;
                            else if ('"' === r[0]) r = r.replace(/"/g, "");
                            else if ("'" === r[0]) r = r.replace(/'/g, "");
                            else if (r.indexOf(".") > 0) {
                                var a;
                                r.split(".").forEach((function (e) {
                                    a || (a = t), a = a[e]
                                })), r = a
                            } else r = t[r];
                            else r = parseFloat(r);
                            u.push(r)
                        }))
                    }
                    n.apply(void 0, u)
                }
            }
    }

    function getData(e, t, r, a, n, o) {
        var i = {
                context: t
            },
            s = e.attributes;
        Array.prototype.forEach.call(s, (function (e) {
            var r = e.name,
                a = e.value;
            if (propsAttrs.indexOf(r) >= 0) i.props || (i.props = {}), "readonly" === r && (r = "readOnly"), "option" === o && "value" === r && (i.attrs || (i.attrs = {}), i.attrs.value = a), booleanProps.indexOf(r) >= 0 ? i.props[r] = !1 !== a : i.props[r] = a;
            else if ("key" === r) i.key = a;
            else if (0 === r.indexOf("@")) {
                i.on || (i.on = {});
                var s = r.substr(1),
                    l = !1,
                    c = !1,
                    u = !1;
                s.indexOf(".") >= 0 && s.split(".").forEach((function (e, t) {
                    0 === t ? s = e : ("stop" === e && (l = !0), "prevent" === e && (c = !0), "once" === e && (u = !0))
                })), i.on[s] = getEventHandler(a, t, {
                    stop: l,
                    prevent: c,
                    once: u
                })
            } else if ("style" === r)
                if (a.indexOf("{") >= 0 && a.indexOf("}") >= 0) try {
                    i.style = JSON.parse(a)
                } catch (e) {
                    i.attrs || (i.attrs = {}), i.attrs.style = a
                } else i.attrs || (i.attrs = {}), i.attrs.style = a;
                else i.attrs || (i.attrs = {}), i.attrs[r] = a, "id" !== r || i.key || n || (i.key = a)
        })), n && t && t.$id && t.$style && t.$styleScoped && (i.attrs || (i.attrs = {}), i.attrs["data-f7-" + t.$id] = "");
        var l = getHooks(i, r, a, n, o);
        return l.prepatch = function (e, t) {
            e && t && e && e.data && e.data.props && Object.keys(e.data.props).forEach((function (r) {
                booleanProps.indexOf(r) < 0 || (t.data || (t.data = {}), t.data.props || (t.data.props = {}), !0 !== e.data.props[r] || r in t.data.props || (t.data.props[r] = !1))
            }))
        }, l && (i.hook = l), i
    }

    function getChildren(e, t, r, a) {
        for (var n = [], o = e.childNodes, i = 0; i < o.length; i += 1) {
            var s = elementToVNode(o[i], t, r, a);
            Array.isArray(s) ? n.push.apply(n, s) : s && n.push(s)
        }
        return n
    }

    function getSlots(e, t, r, a) {
        var n = e.getAttribute("name") || "default",
            o = (t.$children || []).filter((function (e) {
                var t = "default";
                return e.data && (t = e.data.attrs && e.data.attrs.slot || "default"), t === n
            }));
        return 0 === o.length ? getChildren(e, t, r, a) : o
    }

    function elementToVNode(e, t, r, a, n) {
        if (3 === e.nodeType) return e.textContent;
        if (1 !== e.nodeType) return null;
        var o = e instanceof win.SVGElement ? e.nodeName : e.nodeName.toLowerCase();
        return "slot" === o ? getSlots(e, t, r, a) : h(o, getData(e, t, r, a, n, o), selfClosing.indexOf(o) >= 0 ? [] : getChildren(e, t, r, a))
    }

    function vdom(e, t, r) {
        void 0 === e && (e = "");
        var a, n = e.trim(),
            o = tempDomDIV;
        0 === n.indexOf("<tr") && (tempDomTBODY || (tempDomTBODY = doc.createElement("tbody")), o = tempDomTBODY), 0 !== n.indexOf("<td") && 0 !== n.indexOf("<th") || (tempDomTROW || (tempDomTROW = doc.createElement("tr")), o = tempDomTROW), o.innerHTML = n;
        for (var i = 0; i < o.childNodes.length; i += 1) a || 1 !== o.childNodes[i].nodeType || (a = o.childNodes[i]);
        var s = elementToVNode(a, t, t.$app, r, !0);
        return o.innerHTML = "", s
    }

    function createElement(e) {
        return document.createElement(e)
    }

    function createElementNS(e, t) {
        return document.createElementNS(e, t)
    }

    function createTextNode(e) {
        return document.createTextNode(e)
    }

    function createComment(e) {
        return document.createComment(e)
    }

    function insertBefore$1(e, t, r) {
        r && r.parentNode !== e && r.__component__ && (r = r.__component__.el), e.insertBefore(t, r)
    }

    function removeChild(e, t) {
        e && e.removeChild(t)
    }

    function appendChild(e, t) {
        e.appendChild(t)
    }

    function parentNode(e) {
        return e.parentNode
    }

    function nextSibling(e) {
        return e.nextSibling
    }

    function tagName(e) {
        return e.tagName
    }

    function setTextContent(e, t) {
        e.textContent = t
    }

    function getTextContent(e) {
        return e.textContent
    }

    function isElement(e) {
        return 1 === e.nodeType
    }

    function isText(e) {
        return 3 === e.nodeType
    }

    function isComment(e) {
        return 8 === e.nodeType
    }
    var htmlDomApi = {
        createElement: createElement,
        createElementNS: createElementNS,
        createTextNode: createTextNode,
        createComment: createComment,
        insertBefore: insertBefore$1,
        removeChild: removeChild,
        appendChild: appendChild,
        parentNode: parentNode,
        nextSibling: nextSibling,
        tagName: tagName,
        setTextContent: setTextContent,
        getTextContent: getTextContent,
        isElement: isElement,
        isText: isText,
        isComment: isComment
    };

    function isUndef(e) {
        return void 0 === e
    }

    function isDef(e) {
        return void 0 !== e
    }
    var emptyNode = vnode("", {}, [], void 0, void 0);

    function sameVnode(e, t) {
        return e.key === t.key && e.sel === t.sel
    }

    function isVnode(e) {
        return void 0 !== e.sel
    }

    function createKeyToOldIdx(e, t, r) {
        var a, n, o, i = {};
        for (a = t; a <= r; ++a) null != (o = e[a]) && void 0 !== (n = o.key) && (i[n] = a);
        return i
    }
    var hooks = ["create", "update", "remove", "destroy", "pre", "post"];

    function init(e, t) {
        var r, a, n = {},
            o = void 0 !== t ? t : htmlDomApi;
        for (r = 0; r < hooks.length; ++r)
            for (n[hooks[r]] = [], a = 0; a < e.length; ++a) {
                var i = e[a][hooks[r]];
                void 0 !== i && n[hooks[r]].push(i)
            }

        function s(e) {
            var t = e.id ? "#" + e.id : "",
                r = e.className ? "." + e.className.split(" ").join(".") : "";
            return vnode(o.tagName(e).toLowerCase() + t + r, {}, [], void 0, e)
        }

        function l(e, t) {
            return function () {
                if (0 == --t) {
                    var r = o.parentNode(e);
                    o.removeChild(r, e)
                }
            }
        }

        function c(e, t) {
            var r, a = e.data;
            void 0 !== a && isDef(r = a.hook) && isDef(r = r.init) && (r(e), a = e.data);
            var i = e.children,
                s = e.sel;
            if ("!" === s) isUndef(e.text) && (e.text = ""), e.elm = o.createComment(e.text);
            else if (void 0 !== s) {
                var l = s.indexOf("#"),
                    u = s.indexOf(".", l),
                    p = l > 0 ? l : s.length,
                    d = u > 0 ? u : s.length,
                    h = -1 !== l || -1 !== u ? s.slice(0, Math.min(p, d)) : s,
                    f = e.elm = isDef(a) && isDef(r = a.ns) ? o.createElementNS(r, h) : o.createElement(h);
                for (p < d && f.setAttribute("id", s.slice(p + 1, d)), u > 0 && f.setAttribute("class", s.slice(d + 1).replace(/\./g, " ")), r = 0; r < n.create.length; ++r) n.create[r](emptyNode, e);
                if (array(i))
                    for (r = 0; r < i.length; ++r) {
                        var v = i[r];
                        null != v && o.appendChild(f, c(v, t))
                    } else primitive(e.text) && o.appendChild(f, o.createTextNode(e.text));
                isDef(r = e.data.hook) && (r.create && r.create(emptyNode, e), r.insert && t.push(e))
            } else e.elm = o.createTextNode(e.text);
            return e.elm
        }

        function u(e, t, r, a, n, i) {
            for (; a <= n; ++a) {
                var s = r[a];
                null != s && o.insertBefore(e, c(s, i), t)
            }
        }

        function p(e) {
            var t, r, a = e.data;
            if (void 0 !== a) {
                for (isDef(t = a.hook) && isDef(t = t.destroy) && t(e), t = 0; t < n.destroy.length; ++t) n.destroy[t](e);
                if (void 0 !== e.children)
                    for (r = 0; r < e.children.length; ++r) null != (t = e.children[r]) && "string" != typeof t && p(t)
            }
        }

        function d(e, t, r, a) {
            for (; r <= a; ++r) {
                var i = void 0,
                    s = void 0,
                    c = void 0,
                    u = t[r];
                if (null != u)
                    if (isDef(u.sel)) {
                        for (p(u), s = n.remove.length + 1, c = l(u.elm, s), i = 0; i < n.remove.length; ++i) n.remove[i](u, c);
                        isDef(i = u.data) && isDef(i = i.hook) && isDef(i = i.remove) ? i(u, c) : c()
                    } else o.removeChild(e, u.elm)
            }
        }

        function h(e, t, r) {
            var a, i;
            isDef(a = t.data) && isDef(i = a.hook) && isDef(a = i.prepatch) && a(e, t);
            var s = t.elm = e.elm,
                l = e.children,
                p = t.children;
            if (e !== t) {
                if (void 0 !== t.data) {
                    for (a = 0; a < n.update.length; ++a) n.update[a](e, t);
                    isDef(a = t.data.hook) && isDef(a = a.update) && a(e, t)
                }
                isUndef(t.text) ? isDef(l) && isDef(p) ? l !== p && function (e, t, r, a) {
                    for (var n, i, s, l = 0, p = 0, f = t.length - 1, v = t[0], m = t[f], g = r.length - 1, b = r[0], y = r[g]; l <= f && p <= g;) null == v ? v = t[++l] : null == m ? m = t[--f] : null == b ? b = r[++p] : null == y ? y = r[--g] : sameVnode(v, b) ? (h(v, b, a), v = t[++l], b = r[++p]) : sameVnode(m, y) ? (h(m, y, a), m = t[--f], y = r[--g]) : sameVnode(v, y) ? (h(v, y, a), o.insertBefore(e, v.elm, o.nextSibling(m.elm)), v = t[++l], y = r[--g]) : sameVnode(m, b) ? (h(m, b, a), o.insertBefore(e, m.elm, v.elm), m = t[--f], b = r[++p]) : (void 0 === n && (n = createKeyToOldIdx(t, l, f)), isUndef(i = n[b.key]) ? (o.insertBefore(e, c(b, a), v.elm), b = r[++p]) : ((s = t[i]).sel !== b.sel ? o.insertBefore(e, c(b, a), v.elm) : (h(s, b, a), t[i] = void 0, o.insertBefore(e, s.elm, v.elm)), b = r[++p]));
                    (l <= f || p <= g) && (l > f ? u(e, null == r[g + 1] ? null : r[g + 1].elm, r, p, g, a) : d(e, t, l, f))
                }(s, l, p, r) : isDef(p) ? (isDef(e.text) && o.setTextContent(s, ""), u(s, null, p, 0, p.length - 1, r)) : isDef(l) ? d(s, l, 0, l.length - 1) : isDef(e.text) && o.setTextContent(s, "") : e.text !== t.text && o.setTextContent(s, t.text), isDef(i) && isDef(a = i.postpatch) && a(e, t)
            }
        }
        return function (e, t) {
            var r, a, i, l = [];
            for (r = 0; r < n.pre.length; ++r) n.pre[r]();
            for (isVnode(e) || (e = s(e)), sameVnode(e, t) ? h(e, t, l) : (a = e.elm, i = o.parentNode(a), c(t, l), null !== i && (o.insertBefore(i, t.elm, o.nextSibling(a)), d(i, [e], 0, 0))), r = 0; r < l.length; ++r) l[r].data.hook.insert(l[r]);
            for (r = 0; r < n.post.length; ++r) n.post[r]();
            return t
        }
    }
    var xlinkNS = "http://www.w3.org/1999/xlink",
        xmlNS = "http://www.w3.org/XML/1998/namespace",
        colonChar = 58,
        xChar = 120;

    function updateAttrs(e, t) {
        var r, a = t.elm,
            n = e.data.attrs,
            o = t.data.attrs;
        if ((n || o) && n !== o) {
            for (r in n = n || {}, o = o || {}) {
                var i = o[r];
                n[r] !== i && (!0 === i ? a.setAttribute(r, "") : !1 === i ? a.removeAttribute(r) : r.charCodeAt(0) !== xChar ? a.setAttribute(r, i) : r.charCodeAt(3) === colonChar ? a.setAttributeNS(xmlNS, r, i) : r.charCodeAt(5) === colonChar ? a.setAttributeNS(xlinkNS, r, i) : a.setAttribute(r, i))
            }
            for (r in n) r in o || a.removeAttribute(r)
        }
    }
    var attributesModule = {
        create: updateAttrs,
        update: updateAttrs
    };

    function updateProps(e, t) {
        var r, a, n = t.elm,
            o = e.data.props,
            i = t.data.props;
        if ((o || i) && o !== i) {
            for (r in i = i || {}, o = o || {}) i[r] || delete n[r];
            for (r in i) a = i[r], o[r] === a || "value" === r && n[r] === a || (n[r] = a)
        }
    }
    var propsModule = {
            create: updateProps,
            update: updateProps
        },
        raf = "undefined" != typeof window && window.requestAnimationFrame || setTimeout,
        nextFrame = function (e) {
            raf((function () {
                raf(e)
            }))
        };

    function setNextFrame(e, t, r) {
        nextFrame((function () {
            e[t] = r
        }))
    }

    function updateStyle(e, t) {
        var r, a, n = t.elm,
            o = e.data.style,
            i = t.data.style;
        if ((o || i) && o !== i) {
            i = i || {};
            var s = "delayed" in (o = o || {});
            for (a in o) i[a] || ("-" === a[0] && "-" === a[1] ? n.style.removeProperty(a) : n.style[a] = "");
            for (a in i)
                if (r = i[a], "delayed" === a && i.delayed)
                    for (var l in i.delayed) r = i.delayed[l], s && r === o.delayed[l] || setNextFrame(n.style, l, r);
                else "remove" !== a && r !== o[a] && ("-" === a[0] && "-" === a[1] ? n.style.setProperty(a, r) : n.style[a] = r)
        }
    }

    function applyDestroyStyle(e) {
        var t, r, a = e.elm,
            n = e.data.style;
        if (n && (t = n.destroy))
            for (r in t) a.style[r] = t[r]
    }

    function applyRemoveStyle(e, t) {
        var r = e.data.style;
        if (r && r.remove) {
            var a, n = e.elm,
                o = 0,
                i = r.remove,
                s = 0,
                l = [];
            for (a in i) l.push(a), n.style[a] = i[a];
            for (var c = getComputedStyle(n)["transition-property"].split(", "); o < c.length; ++o) - 1 !== l.indexOf(c[o]) && s++;
            n.addEventListener("transitionend", (function (e) {
                e.target === n && --s, 0 === s && t()
            }))
        } else t()
    }
    var styleModule = {
        create: updateStyle,
        update: updateStyle,
        destroy: applyDestroyStyle,
        remove: applyRemoveStyle
    };

    function invokeHandler(e, t, r) {
        "function" == typeof e && e.apply(void 0, [t].concat(r))
    }

    function handleEvent(e, t, r) {
        var a = e.type,
            n = r.data.on;
        n && n[a] && invokeHandler(n[a], e, t)
    }

    function createListener() {
        return function e(t) {
            for (var r = [], a = arguments.length - 1; a-- > 0;) r[a] = arguments[a + 1];
            handleEvent(t, r, e.vnode)
        }
    }

    function updateEvents(e, t) {
        var r = e.data.on,
            a = e.listener,
            n = e.elm,
            o = t && t.data.on,
            i = t && t.elm;
        if (r !== o && (r && a && (o ? Object.keys(r).forEach((function (e) {
                o[e] || $(n).off(e, a)
            })) : Object.keys(r).forEach((function (e) {
                $(n).off(e, a)
            }))), o)) {
            var s = e.listener || createListener();
            t.listener = s, s.vnode = t, r ? Object.keys(o).forEach((function (e) {
                r[e] || $(i).on(e, s)
            })) : Object.keys(o).forEach((function (e) {
                $(i).on(e, s)
            }))
        }
    }
    var eventListenersModule = {
            create: updateEvents,
            update: updateEvents,
            destroy: updateEvents
        },
        patch = init([attributesModule, propsModule, styleModule, eventListenersModule]),
        componentMixins = {},
        Component = function (e, t, r, a) {
            void 0 === t && (t = {}), void 0 === r && (r = {});
            var n = Utils.id(),
                o = this;
            Utils.merge(o, {
                $props: {}
            }, r, {
                $: $,
                $$: $,
                $dom7: $,
                $app: e,
                $f7: e,
                $options: Utils.extend({
                    id: n
                }, t),
                $id: t.isClassComponent ? o.constructor.id : t.id || n,
                $mixins: t.isClassComponent ? o.constructor.mixins : t.mixins,
                $children: a || [],
                $isRootComponent: !!t.root
            });
            var i = o.$options;
            if (o.$mixins && o.$mixins.length)
                for (var s = o.$mixins.length - 1; s >= 0; s -= 1) {
                    var l = o.$mixins[s];
                    "string" == typeof l && (componentMixins[l] ? o.$mixins[s] = componentMixins[l] : o.$mixins.splice(s, 1))
                }
            Object.defineProperty(o, "$slots", {
                enumerable: !0,
                configurable: !0,
                get: function () {
                    var e = {};
                    return o.$children.forEach((function (t) {
                        var r = "default";
                        t.data && (r = t.data.attrs && t.data.attrs.slot || "default"), e[r] || (e[r] = []), e[r].push(t)
                    })), e
                }
            }), Object.defineProperty(o, "$root", {
                enumerable: !0,
                configurable: !0,
                get: function () {
                    if (o.$isRootComponent) return o;
                    if (e.rootComponent) return o.$onRootUpdated || (o.$onRootUpdated = function () {
                        return o.$update()
                    }, e.on("rootComponentUpdated", o.$onRootUpdated)), e.rootComponent;
                    var t = Utils.merge({}, e.data, e.methods);
                    return win && win.Proxy && (t = new win.Proxy(t, {
                        set: function (t, r, a) {
                            e.data[r] = a
                        },
                        deleteProperty: function (t, r) {
                            delete e.data[r], delete e.methods[r]
                        },
                        has: function (t, r) {
                            return r in e.data || r in e.methods
                        }
                    })), t
                },
                set: function () {}
            }), i.render && (i.render = i.render.bind(o));
            var c = {};
            return o.$mixins && o.$mixins.length && o.$mixins.forEach((function (e) {
                e.methods && Object.assign(c, e.methods)
            })), i.methods && Object.assign(c, i.methods), Object.keys(c).forEach((function (e) {
                o[e] = c[e].bind(o)
            })), i.on && Object.keys(i.on).forEach((function (e) {
                i.on[e] = i.on[e].bind(o)
            })), i.once && Object.keys(i.once).forEach((function (e) {
                i.once[e] = i.once[e].bind(o)
            })), o.$style = i.isClassComponent ? o.constructor.style : i.style, o.$styleScoped = i.isClassComponent ? o.constructor.styleScoped : i.styleScoped, o.__updateQueue = [], new Promise((function (e, t) {
                o.$hook("data", !0).then((function (t) {
                    var r = {};
                    t.forEach((function (e) {
                        Object.assign(r, e || {})
                    })), Utils.extend(o, r), o.$hook("beforeCreate");
                    var a = o.$render();
                    if (o.$options.el) return a = a.trim(), o.$vnode = vdom(a, o, !0), o.$style && (o.$styleEl = doc.createElement("style"), o.$styleEl.innerHTML = o.$style), o.el = o.$options.el, patch(o.el, o.$vnode), o.el = o.$vnode.elm, o.$el = $(o.el), o.$attachEvents(), o.el.f7Component = o, o.$hook("created"), o.$mount(), void e(o);
                    a && "string" == typeof a ? (a = a.trim(), o.$vnode = vdom(a, o, !0), o.el = doc.createElement(o.$vnode.sel || "div"), patch(o.el, o.$vnode), o.$el = $(o.el)) : a && (o.el = a, o.$el = $(o.el)), o.$style && (o.$styleEl = doc.createElement("style"), o.$styleEl.innerHTML = o.$style), o.$attachEvents(), o.el && (o.el.f7Component = o), o.$hook("created"), e(o)
                })).catch((function (e) {
                    t(e)
                }))
            }))
        };

    function parseComponent(e) {
        var t, r = Utils.id(),
            a = "f7_component_create_callback_" + r,
            n = "f7_component_render_callback_" + r,
            o = e.match(/<template([ ]?)([a-z0-9-]*)>/),
            i = o[2] || "t7";
        o && (t = e.split(/<template[ ]?[a-z0-9-]*>/).filter((function (e, t) {
            return t > 0
        })).join("<template>").split("</template>").filter((function (e, t, r) {
            return t < r.length - 1
        })).join("</template>").replace(/{{#raw}}([ \n]*)<template/g, "{{#raw}}<template").replace(/\/template>([ \n]*){{\/raw}}/g, "/template>{{/raw}}").replace(/([ \n])<template/g, "$1{{#raw}}<template").replace(/\/template>([ \n])/g, "/template>{{/raw}}$1"));
        var s, l, c = null,
            u = !1;
        if (e.indexOf("<style>") >= 0 ? c = e.split("<style>")[1].split("</style>")[0] : e.indexOf("<style scoped>") >= 0 && (u = !0, c = (c = e.split("<style scoped>")[1].split("</style>")[0]).replace(/{{this}}/g, "[data-f7-" + r + "]").replace(/[\n]?([^{^}]*){/gi, (function (e, t) {
                return t.indexOf('"') >= 0 || t.indexOf("'") >= 0 ? e : "\n" + (t = t.split(",").map((function (e) {
                    return e.indexOf("@") >= 0 || e.indexOf("[data-f7-" + r + "]") >= 0 ? e : "[data-f7-" + r + "] " + e.trim()
                })).join(", ")) + " {"
            }))), e.indexOf("<script>") >= 0) {
            var p = e.split("<script>");
            s = p[p.length - 1].split("<\/script>")[0].trim()
        } else s = "return {}";
        s && s.trim() || (s = "return {}"), s = "window." + a + " = function () {" + s + "}", (l = doc.createElement("script")).innerHTML = s, $("head").append(l);
        var d = win[a](),
            h = "function" == typeof d;
        if ($(l).remove(), win[a] = null, delete win[a], d.template || d.render || (d.template = t, d.templateType = i), d.template) {
            if ("t7" === d.templateType)
                if (h) {
                    var f = Template7.compile(d.template);
                    d.prototype.render = function () {
                        return f(this)
                    }
                } else d.template = Template7.compile(d.template);
            if ("es" === d.templateType) {
                var v = "window." + n + " = function () {\n        return function render() {\n          return `" + d.template + "`;\n        }\n      }";
                (l = doc.createElement("script")).innerHTML = v, $("head").append(l), h ? d.prototype.render = d.template : d.render = win[n](), $(l).remove(), win[n] = null, delete win[n]
            }
        }
        return h && (delete d.template, delete d.templateType), c && (d.style = c, d.styleScoped = u), d.id = r, d
    }

    function registerComponentMixin(e, t) {
        componentMixins[e] = t
    }

    function registerComponent(e, t) {
        customComponents[e] = t
    }
    Component.prototype.$attachEvents = function () {
        var e = this,
            t = e.$options,
            r = e.$el;
        e.$mixins && e.$mixins.length && (e.$detachEventsHandlers = {}, e.$mixins.forEach((function (t) {
            t.on && Object.keys(t.on).forEach((function (a) {
                var n = t.on[a].bind(e);
                e.$detachEventsHandlers[a] || (e.$detachEventsHandlers[a] = []), e.$detachEventsHandlers[a].push(n), r.on(Utils.eventNameToColonCase(a), n)
            })), t.once && Object.keys(t.once).forEach((function (a) {
                var n = t.once[a].bind(e);
                e.$detachEventsHandlers[a] || (e.$detachEventsHandlers[a] = []), e.$detachEventsHandlers[a].push(n), r.once(Utils.eventNameToColonCase(a), n)
            }))
        }))), t.on && Object.keys(t.on).forEach((function (e) {
            r.on(Utils.eventNameToColonCase(e), t.on[e])
        })), t.once && Object.keys(t.once).forEach((function (e) {
            r.once(Utils.eventNameToColonCase(e), t.once[e])
        }))
    }, Component.prototype.$detachEvents = function () {
        var e = this,
            t = e.$options,
            r = e.$el;
        t.on && Object.keys(t.on).forEach((function (e) {
            r.off(Utils.eventNameToColonCase(e), t.on[e])
        })), t.once && Object.keys(t.once).forEach((function (e) {
            r.off(Utils.eventNameToColonCase(e), t.once[e])
        })), e.$detachEventsHandlers && (Object.keys(e.$detachEventsHandlers).forEach((function (t) {
            e.$detachEventsHandlers[t].forEach((function (e) {
                r.off(Utils.eventNameToColonCase(t), e)
            })), e.$detachEventsHandlers[t] = [], delete e.$detachEventsHandlers[t]
        })), e.$detachEventsHandlers = null, delete e.$detachEventsHandlers)
    }, Component.prototype.$render = function () {
        var e = this.$options,
            t = "";
        return e.render ? t = e.render() : this.render ? t = this.render.call(this) : e.template && (t = "string" == typeof e.template ? Template7.compile(e.template)(this) : e.template(this)), t
    }, Component.prototype.$startUpdateQueue = function () {
        var e = this;
        e.__requestAnimationFrameId || (e.__requestAnimationFrameId = win.requestAnimationFrame((function () {
            e.__updateIsPending && function () {
                var t = e.$render();
                if (t && "string" == typeof t) {
                    var r = vdom(t = t.trim(), e, !1);
                    e.$vnode = patch(e.$vnode, r)
                }
            }();
            var t = [].concat(e.__updateQueue);
            e.__updateQueue = [], e.__updateIsPending = !1, win.cancelAnimationFrame(e.__requestAnimationFrameId), delete e.__requestAnimationFrameId, delete e.__updateIsPending, t.forEach((function (e) {
                return e()
            })), t = []
        })))
    }, Component.prototype.$tick = function (e) {
        var t = this;
        return new Promise((function (r) {
            t.__updateQueue.push((function () {
                r(), e && e()
            })), t.$startUpdateQueue()
        }))
    }, Component.prototype.$update = function (e) {
        var t = this;
        return new Promise((function (r) {
            t.__updateIsPending = !0, t.__updateQueue.push((function () {
                r(), e && e(), t.$isRootComponent && t.$f7.emit("rootComponentUpdated")
            })), t.$startUpdateQueue()
        }))
    }, Component.prototype.$setState = function (e, t) {
        void 0 === e && (e = {});
        return Utils.merge(this, e), this.$update(t)
    }, Component.prototype.$f7ready = function (e) {
        var t = this;
        this.$f7.initialized ? e(this.$f7) : this.$f7.once("init", (function () {
            e(t.$f7)
        }))
    }, Component.prototype.$mount = function (e) {
        this.$hook("beforeMount"), this.$styleEl && $("head").append(this.$styleEl), e && e(this.el), this.$hook("mounted")
    }, Component.prototype.$destroy = function () {
        this.$hook("beforeDestroy"), this.$styleEl && $(this.$styleEl).remove(), this.$onRootUpdated && (this.$f7.off("rootComponentUpdated", this.$onRootUpdated), delete this.$onRootUpdated), this.$detachEvents(), this.$hook("destroyed"), this.el && this.el.f7Component && (this.el.f7Component = null, delete this.el.f7Component), this.$vnode && (this.$vnode = patch(this.$vnode, {
            sel: this.$vnode.sel,
            data: {}
        })), win.cancelAnimationFrame(this.__requestAnimationFrameId), Utils.deleteProps(this)
    }, Component.prototype.$hook = function (e, t) {
        var r = this;
        if (t) {
            var a = [];
            return r.$mixins && r.$mixins.length && r.$mixins.forEach((function (t) {
                t[e] && a.push(t[e].call(r))
            })), r[e] && "function" == typeof r[e] && a.push(r[e].call(r)), r.$options[e] && a.push(r.$options[e].call(r)), Promise.all(a)
        }
        return r.$mixins && r.$mixins.length && r.$mixins.forEach((function (t) {
            t[e] && "function" == typeof t[e] && t[e].call(r)
        })), r.$options[e] ? r.$options[e].call(r) : r[e] ? r[e].call(r) : void 0
    };
    var ComponentModule = {
            name: "component",
            static: {
                Component: Component,
                registerComponentMixin: registerComponentMixin,
                registerComponent: registerComponent
            },
            create: function () {
                var e = this;
                e.component = {
                    registerComponentMixin: registerComponentMixin,
                    registerComponent: registerComponent,
                    parse: function (e) {
                        return parseComponent(e)
                    },
                    create: function (t, r, a) {
                        if ("function" == typeof t) {
                            var n = t.root,
                                o = t.el;
                            return new t(e, {
                                isClassComponent: !0,
                                root: n,
                                el: o
                            }, r, a)
                        }
                        return new Component(e, t, r, a)
                    }
                }
            }
        },
        HistoryModule = {
            name: "history",
            static: {
                history: History
            },
            on: {
                init: function () {
                    History.init(this)
                }
            }
        },
        SW = {
            registrations: [],
            register: function (e, t) {
                var r = this;
                return "serviceWorker" in win.navigator && r.serviceWorker.container ? new Promise((function (a, n) {
                    r.serviceWorker.container.register(e, t ? {
                        scope: t
                    } : {}).then((function (e) {
                        SW.registrations.push(e), r.emit("serviceWorkerRegisterSuccess", e), a(e)
                    })).catch((function (e) {
                        r.emit("serviceWorkerRegisterError", e), n(e)
                    }))
                })) : new Promise((function (e, t) {
                    t(new Error("Service worker is not supported"))
                }))
            },
            unregister: function (e) {
                var t, r = this;
                return "serviceWorker" in win.navigator && r.serviceWorker.container ? (t = e ? Array.isArray(e) ? e : [e] : SW.registrations, Promise.all(t.map((function (e) {
                    return new Promise((function (t, a) {
                        e.unregister().then((function () {
                            SW.registrations.indexOf(e) >= 0 && SW.registrations.splice(SW.registrations.indexOf(e), 1), r.emit("serviceWorkerUnregisterSuccess", e), t()
                        })).catch((function (t) {
                            r.emit("serviceWorkerUnregisterError", e, t), a(t)
                        }))
                    }))
                })))) : new Promise((function (e, t) {
                    t(new Error("Service worker is not supported"))
                }))
            }
        },
        ServiceWorkerModule = {
            name: "sw",
            params: {
                serviceWorker: {
                    path: void 0,
                    scope: void 0
                }
            },
            create: function () {
                Utils.extend(this, {
                    serviceWorker: {
                        container: "serviceWorker" in win.navigator ? win.navigator.serviceWorker : void 0,
                        registrations: SW.registrations,
                        register: SW.register.bind(this),
                        unregister: SW.unregister.bind(this)
                    }
                })
            },
            on: {
                init: function () {
                    if ("serviceWorker" in win.navigator) {
                        var e = this;
                        if (e.serviceWorker.container) {
                            var t = e.params.serviceWorker.path,
                                r = e.params.serviceWorker.scope;
                            if (t && (!Array.isArray(t) || t.length))(Array.isArray(t) ? t : [t]).forEach((function (t) {
                                e.serviceWorker.register(t, r)
                            }))
                        }
                    }
                }
            }
        },
        Statusbar = {
            hide: function () {
                Device.cordova && win.StatusBar && win.StatusBar.hide()
            },
            show: function () {
                Device.cordova && win.StatusBar && win.StatusBar.show()
            },
            onClick: function () {
                var e;
                (e = $(".popup.modal-in").length > 0 ? $(".popup.modal-in").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : $(".panel.panel-in").length > 0 ? $(".panel.panel-in").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : $(".views > .view.tab-active").length > 0 ? $(".views > .view.tab-active").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : $(".views").length > 0 ? $(".views").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content") : this.root.children(".view").find(".page:not(.page-previous):not(.page-next):not(.cached)").find(".page-content")) && e.length > 0 && (e.hasClass("tab") && (e = e.parent(".tabs").children(".page-content.tab-active")), e.length > 0 && e.scrollTop(0, 300))
            },
            setTextColor: function (e) {
                Device.cordova && win.StatusBar && ("white" === e ? win.StatusBar.styleLightContent() : win.StatusBar.styleDefault())
            },
            setBackgroundColor: function (e) {
                Device.cordova && win.StatusBar && win.StatusBar.backgroundColorByHexString(e)
            },
            isVisible: function () {
                return !(!Device.cordova || !win.StatusBar) && win.StatusBar.isVisible
            },
            overlaysWebView: function (e) {
                void 0 === e && (e = !0), Device.cordova && win.StatusBar && win.StatusBar.overlaysWebView(e)
            },
            init: function () {
                var e = this.params.statusbar;
                e.enabled && (Device.cordova && win.StatusBar && (e.scrollTopOnClick && $(win).on("statusTap", Statusbar.onClick.bind(this)), Device.ios && (e.iosOverlaysWebView ? win.StatusBar.overlaysWebView(!0) : win.StatusBar.overlaysWebView(!1), "white" === e.iosTextColor ? win.StatusBar.styleLightContent() : win.StatusBar.styleDefault()), Device.android && (e.androidOverlaysWebView ? win.StatusBar.overlaysWebView(!0) : win.StatusBar.overlaysWebView(!1), "white" === e.androidTextColor ? win.StatusBar.styleLightContent() : win.StatusBar.styleDefault())), e.iosBackgroundColor && Device.ios && Statusbar.setBackgroundColor(e.iosBackgroundColor), e.androidBackgroundColor && Device.android && Statusbar.setBackgroundColor(e.androidBackgroundColor))
            }
        },
        Statusbar$1 = {
            name: "statusbar",
            params: {
                statusbar: {
                    enabled: !0,
                    scrollTopOnClick: !0,
                    iosOverlaysWebView: !0,
                    iosTextColor: "black",
                    iosBackgroundColor: null,
                    androidOverlaysWebView: !1,
                    androidTextColor: "black",
                    androidBackgroundColor: null
                }
            },
            create: function () {
                Utils.extend(this, {
                    statusbar: {
                        hide: Statusbar.hide,
                        show: Statusbar.show,
                        overlaysWebView: Statusbar.overlaysWebView,
                        setTextColor: Statusbar.setTextColor,
                        setBackgroundColor: Statusbar.setBackgroundColor,
                        isVisible: Statusbar.isVisible,
                        init: Statusbar.init.bind(this)
                    }
                })
            },
            on: {
                init: function () {
                    Statusbar.init.call(this)
                }
            }
        };

    function getCurrentView(e) {
        var t = $(".popover.modal-in .view"),
            r = $(".popup.modal-in .view"),
            a = $(".panel.panel-in .view"),
            n = $(".views");
        0 === n.length && (n = e.root);
        var o = n.children(".view");
        if (0 === o.length && (o = n.children(".tabs").children(".view")), o.length > 1 && o.hasClass("tab") && 0 === (o = n.children(".view.tab-active")).length && (o = n.children(".tabs").children(".view.tab-active")), t.length > 0 && t[0].f7View) return t[0].f7View;
        if (r.length > 0 && r[0].f7View) return r[0].f7View;
        if (a.length > 0 && a[0].f7View) return a[0].f7View;
        if (o.length > 0) {
            if (1 === o.length && o[0].f7View) return o[0].f7View;
            if (o.length > 1) return e.views.main
        }
    }
    var View$1 = {
            name: "view",
            params: {
                view: {
                    name: void 0,
                    main: !1,
                    router: !0,
                    linksView: null,
                    stackPages: !1,
                    xhrCache: !0,
                    xhrCacheIgnore: [],
                    xhrCacheIgnoreGetParameters: !1,
                    xhrCacheDuration: 6e5,
                    componentCache: !0,
                    preloadPreviousPage: !0,
                    allowDuplicateUrls: !1,
                    reloadPages: !1,
                    reloadDetail: !1,
                    masterDetailBreakpoint: 0,
                    masterDetailResizable: !1,
                    removeElements: !0,
                    removeElementsWithTimeout: !1,
                    removeElementsTimeout: 0,
                    restoreScrollTopOnBack: !0,
                    unloadTabContent: !0,
                    passRouteQueryToRequest: !0,
                    passRouteParamsToRequest: !1,
                    loadInitialPage: !0,
                    iosSwipeBack: !0,
                    iosSwipeBackAnimateShadow: !0,
                    iosSwipeBackAnimateOpacity: !0,
                    iosSwipeBackActiveArea: 30,
                    iosSwipeBackThreshold: 0,
                    mdSwipeBack: !1,
                    mdSwipeBackAnimateShadow: !0,
                    mdSwipeBackAnimateOpacity: !1,
                    mdSwipeBackActiveArea: 30,
                    mdSwipeBackThreshold: 0,
                    auroraSwipeBack: !1,
                    auroraSwipeBackAnimateShadow: !1,
                    auroraSwipeBackAnimateOpacity: !0,
                    auroraSwipeBackActiveArea: 30,
                    auroraSwipeBackThreshold: 0,
                    pushState: !1,
                    pushStateRoot: void 0,
                    pushStateAnimate: !0,
                    pushStateAnimateOnLoad: !1,
                    pushStateSeparator: "#!",
                    pushStateOnLoad: !0,
                    animate: !0,
                    iosDynamicNavbar: !0,
                    iosAnimateNavbarBackIcon: !0,
                    iosPageLoadDelay: 0,
                    mdPageLoadDelay: 0,
                    auroraPageLoadDelay: 0,
                    routesBeforeEnter: null,
                    routesBeforeLeave: null
                }
            },
            static: {
                View: View
            },
            create: function () {
                var e = this;
                Utils.extend(e, {
                    views: Utils.extend([], {
                        create: function (t, r) {
                            return new View(e, t, r)
                        },
                        get: function (e) {
                            var t = $(e);
                            if (t.length && t[0].f7View) return t[0].f7View
                        }
                    })
                }), Object.defineProperty(e.views, "current", {
                    enumerable: !0,
                    configurable: !0,
                    get: function () {
                        return getCurrentView(e)
                    }
                }), e.view = e.views
            },
            on: {
                init: function () {
                    var e = this;
                    $(".view-init").each((function (t, r) {
                        if (!r.f7View) {
                            var a = $(r).dataset();
                            e.views.create(r, a)
                        }
                    }))
                },
                "modalOpen panelOpen": function (e) {
                    var t = this;
                    e.$el.find(".view-init").each((function (e, r) {
                        if (!r.f7View) {
                            var a = $(r).dataset();
                            t.views.create(r, a)
                        }
                    }))
                },
                "modalBeforeDestroy panelBeforeDestroy": function (e) {
                    e && e.$el && e.$el.find(".view-init").each((function (e, t) {
                        var r = t.f7View;
                        r && r.destroy()
                    }))
                }
            },
            vnode: {
                "view-init": {
                    insert: function (e) {
                        var t = e.elm;
                        if (!t.f7View) {
                            var r = $(t).dataset();
                            this.views.create(t, r)
                        }
                    },
                    destroy: function (e) {
                        var t = e.elm.f7View;
                        t && t.destroy()
                    }
                }
            }
        },
        Navbar = {
            size: function (e) {
                var t = this,
                    r = $(e);
                if (r.hasClass("navbars")) r = r.children(".navbar").each((function (e, r) {
                    t.navbar.size(r)
                }));
                else {
                    var a = r.children(".navbar-inner");
                    if (a.length) {
                        var n = a.hasClass("navbar-inner-centered-title") || t.params.navbar[t.theme + "CenterTitle"],
                            o = "ios" === t.theme && !t.params.navbar[t.theme + "CenterTitle"];
                        if ((n || o) && !(r.hasClass("stacked") || r.parents(".stacked").length > 0 || r.parents(".tab:not(.tab-active)").length > 0 || r.parents(".popup:not(.modal-in)").length > 0)) {
                            "ios" !== t.theme && t.params.navbar[t.theme + "CenterTitle"] && a.addClass("navbar-inner-centered-title"), "ios" !== t.theme || t.params.navbar.iosCenterTitle || a.addClass("navbar-inner-left-title");
                            var i, s, l, c, u = r.parents(".view").eq(0),
                                p = t.rtl ? a.children(".right") : a.children(".left"),
                                d = t.rtl ? a.children(".left") : a.children(".right"),
                                h = a.children(".title"),
                                f = a.children(".subnavbar"),
                                v = 0 === p.length,
                                m = 0 === d.length,
                                g = v ? 0 : p.outerWidth(!0),
                                b = m ? 0 : d.outerWidth(!0),
                                y = h.outerWidth(!0),
                                w = a.styles(),
                                C = a[0].offsetWidth - parseInt(w.paddingLeft, 10) - parseInt(w.paddingRight, 10),
                                x = r.hasClass("navbar-previous"),
                                k = a.hasClass("sliding");
                            u.length > 0 && u[0].f7View && (s = (i = u[0].f7View.router) && i.dynamicNavbar), m && (l = C - y), v && (l = 0), v || m || (l = (C - b - y + g) / 2);
                            var E = (C - y) / 2;
                            C - g - b > y ? (E < g && (E = g), E + y > C - b && (E = C - b - y), c = E - l) : c = 0;
                            var S = t.rtl ? -1 : 1;
                            if (s && "ios" === t.theme) {
                                if (h.hasClass("sliding") || h.length > 0 && k) {
                                    var T = -(l + c) * S,
                                        O = (C - l - c - y) * S;
                                    if (x && i && i.params.iosAnimateNavbarBackIcon) {
                                        var P = r.parent().find(".navbar-current").children(".left.sliding").find(".back .icon ~ span");
                                        P.length > 0 && (T += P[0].offsetLeft)
                                    }
                                    h[0].f7NavbarLeftOffset = T, h[0].f7NavbarRightOffset = O
                                }
                                if (!v && (p.hasClass("sliding") || k))
                                    if (t.rtl) p[0].f7NavbarLeftOffset = -(C - p[0].offsetWidth) / 2 * S, p[0].f7NavbarRightOffset = g * S;
                                    else if (p[0].f7NavbarLeftOffset = -g, p[0].f7NavbarRightOffset = (C - p[0].offsetWidth) / 2, i && i.params.iosAnimateNavbarBackIcon && p.find(".back .icon").length > 0 && p.find(".back .icon ~ span").length) {
                                    var R = p[0].f7NavbarLeftOffset,
                                        N = p[0].f7NavbarRightOffset;
                                    p[0].f7NavbarLeftOffset = 0, p[0].f7NavbarRightOffset = 0, p.find(".back .icon ~ span")[0].f7NavbarLeftOffset = R, p.find(".back .icon ~ span")[0].f7NavbarRightOffset = N - p.find(".back .icon")[0].offsetWidth
                                }
                                m || !d.hasClass("sliding") && !k || (t.rtl ? (d[0].f7NavbarLeftOffset = -b * S, d[0].f7NavbarRightOffset = (C - d[0].offsetWidth) / 2 * S) : (d[0].f7NavbarLeftOffset = -(C - d[0].offsetWidth) / 2, d[0].f7NavbarRightOffset = b)), f.length && (f.hasClass("sliding") || k) && (f[0].f7NavbarLeftOffset = t.rtl ? f[0].offsetWidth : -f[0].offsetWidth, f[0].f7NavbarRightOffset = -f[0].f7NavbarLeftOffset)
                            }
                            if (n) {
                                var D = c;
                                t.rtl && v && m && h.length > 0 && (D = -D), h.css({
                                    left: D + "px"
                                })
                            }
                        }
                    }
                }
            },
            hide: function (e, t, r) {
                void 0 === t && (t = !0), void 0 === r && (r = !1);
                var a = this,
                    n = $(e),
                    o = n.hasClass("navbar") && n.parent(".navbars").length;
                if (o && (n = n.parents(".navbars")), n.length && !n.hasClass("navbar-hidden")) {
                    var i = "navbar-hidden" + (t ? " navbar-transitioning" : "");
                    (o ? n.find(".navbar-current .title-large").length : n.find(".title-large").length) && (i += " navbar-large-hidden"), r && (i += " navbar-hidden-statusbar"), n.transitionEnd((function () {
                        n.removeClass("navbar-transitioning")
                    })), n.addClass(i), o ? n.children(".navbar").each((function (e, t) {
                        $(t).trigger("navbar:hide"), a.emit("navbarHide", t)
                    })) : (n.trigger("navbar:hide"), a.emit("navbarHide", n[0]))
                }
            },
            show: function (e, t) {
                void 0 === e && (e = ".navbar-hidden"), void 0 === t && (t = !0);
                var r = this,
                    a = $(e),
                    n = a.hasClass("navbar") && a.parent(".navbars").length;
                n && (a = a.parents(".navbars")), a.length && a.hasClass("navbar-hidden") && (t && (a.addClass("navbar-transitioning"), a.transitionEnd((function () {
                    a.removeClass("navbar-transitioning")
                }))), a.removeClass("navbar-hidden navbar-large-hidden navbar-hidden-statusbar"), n ? a.children(".navbar").each((function (e, t) {
                    $(t).trigger("navbar:show"), r.emit("navbarShow", t)
                })) : (a.trigger("navbar:show"), r.emit("navbarShow", a[0])))
            },
            getElByPage: function (e) {
                var t, r, a;
                if (e.$navbarEl || e.$el ? (a = e, t = e.$el) : (t = $(e)).length > 0 && (a = t[0].f7Page), a && a.$navbarEl && a.$navbarEl.length > 0 ? r = a.$navbarEl : t && (r = t.children(".navbar")), r && (!r || 0 !== r.length)) return r[0]
            },
            getPageByEl: function (e) {
                var t, r = $(e);
                return r.parents(".page").length ? r.parents(".page")[0] : (r.parents(".view").find(".page").each((function (e, a) {
                    a && a.f7Page && a.f7Page.navbarEl && r[0] === a.f7Page.navbarEl && (t = a)
                })), t)
            },
            collapseLargeTitle: function (e) {
                var t = $(e);
                if (!(t.hasClass("navbars") && ((t = t.find(".navbar")).length > 1 && (t = $(e).find(".navbar-large.navbar-current")), t.length > 1 || !t.length))) {
                    var r = $(this.navbar.getPageByEl(t));
                    t.addClass("navbar-large-collapsed"), r.eq(0).addClass("page-with-navbar-large-collapsed").trigger("page:navbarlargecollapsed"), this.emit("pageNavbarLargeCollapsed", r[0]), t.trigger("navbar:collapse"), this.emit("navbarCollapse", t[0])
                }
            },
            expandLargeTitle: function (e) {
                var t = $(e);
                if (!(t.hasClass("navbars") && ((t = t.find(".navbar-large")).length > 1 && (t = $(e).find(".navbar-large.navbar-current")), t.length > 1 || !t.length))) {
                    var r = $(this.navbar.getPageByEl(t));
                    t.removeClass("navbar-large-collapsed"), r.eq(0).removeClass("page-with-navbar-large-collapsed").trigger("page:navbarlargeexpanded"), this.emit("pageNavbarLargeExpanded", r[0]), t.trigger("navbar:expand"), this.emit("navbarExpand", t[0])
                }
            },
            toggleLargeTitle: function (e) {
                var t = $(e);
                t.hasClass("navbars") && ((t = t.find(".navbar-large")).length > 1 && (t = $(e).find(".navbar-large.navbar-current")), t.length > 1 || !t.length) || (t.hasClass("navbar-large-collapsed") ? this.navbar.expandLargeTitle(t) : this.navbar.collapseLargeTitle(t))
            },
            initNavbarOnScroll: function (e, t, r, a, n) {
                var o, i, s, l, c, u, p, d, h, f, v, m, g, b, y = this,
                    w = $(e),
                    C = $(t),
                    x = C.find(".title-large"),
                    k = x.length || C.hasClass(".navbar-large"),
                    E = 44,
                    S = y.params.navbar.snapPageScrollToLargeTitle,
                    T = y.params.navbar.snapPageScrollToTransparentNavbar;
                (a || r && k) && ((h = C.css("--f7-navbar-large-title-height")) && h.indexOf("px") >= 0 ? (h = parseInt(h, 10), Number.isNaN(h) && x.length ? h = x[0].offsetHeight : Number.isNaN(h) && ("ios" === y.theme ? h = 52 : "md" === y.theme ? h = 48 : "aurora" === y.theme && (h = 38))) : x.length ? h = x[0].offsetHeight : "ios" === y.theme ? h = 52 : "md" === y.theme ? h = 48 : "aurora" === y.theme && (h = 38)), r && k && (E += h);

                function O() {
                    C.hasClass("with-searchbar-expandable-enabled") || !m || i < 0 || (i >= h / 2 && i < h ? $(m).scrollTop(h, 100) : i < h && $(m).scrollTop(0, 200))
                }

                function P() {
                    C.hasClass("with-searchbar-expandable-enabled") || !m || i < 0 || (i >= f / 2 && i < f ? $(m).scrollTop(f, 100) : i < f && $(m).scrollTop(0, 200))
                }
                var R = null,
                    N = null;

                function D(e) {
                    m = this, e && e.target && e.target !== m || (i = m.scrollTop, v = i, a ? function () {
                        if (!(C.hasClass("navbar-hidden") || C.parent(".navbars").hasClass("navbar-hidden"))) {
                            var e = C.hasClass("navbar-large-transparent") || C.hasClass("navbar-large") && C.hasClass("navbar-transparent");
                            R = N, N = Math.min(Math.max(i / h, 0), 1);
                            var t = R > 0 && R < 1;
                            C.hasClass("with-searchbar-expandable-enabled") || (d = C.hasClass("navbar-large-collapsed"), 0 === N && d ? y.navbar.expandLargeTitle(C[0]) : 1 !== N || d || y.navbar.collapseLargeTitle(C[0]), 0 === N && d || 0 === N && t || 1 === N && !d || 1 === N && t ? ("md" === y.theme && C.find(".navbar-inner").css("overflow", ""), C.find(".title").css("opacity", ""), C.find(".title-large-text, .subnavbar").css("transform", ""), e ? C.find(".navbar-bg").css("opacity", "") : C.find(".navbar-bg").css("transform", "")) : N > 0 && N < 1 && ("md" === y.theme && C.find(".navbar-inner").css("overflow", "visible"), C.find(".title").css("opacity", N), C.find(".title-large-text, .subnavbar").css("transform", "translate3d(0px, " + -1 * N * h + "px, 0)"), e ? C.find(".navbar-bg").css("opacity", N) : C.find(".navbar-bg").css("transform", "translate3d(0px, " + -1 * N * h + "px, 0)")), S && (Support.touch ? b && (clearTimeout(b), b = null, b = setTimeout((function () {
                                O(), clearTimeout(b), b = null
                            }), 70)) : (clearTimeout(g), g = setTimeout((function () {
                                O()
                            }), 300))))
                        }
                    }() : n && function () {
                        var e = C.hasClass("navbar-hidden") || C.parent(".navbars").hasClass("navbar-hidden");
                        if (!C.hasClass("with-searchbar-expandable-enabled") && !e) {
                            f || (f = t.offsetHeight);
                            var r = i / f,
                                a = C.hasClass("navbar-transparent-visible");
                            if (r = Math.max(Math.min(r, 1), 0), a && 1 === r || !a && 0 === r) C.find(".navbar-bg, .title").css("opacity", "");
                            else {
                                if (a && 0 === r) return C.trigger("navbar:transparenthide"), y.emit("navbarTransparentHide", C[0]), C.removeClass("navbar-transparent-visible"), void C.find(".navbar-bg, .title").css("opacity", "");
                                if (!a && 1 === r) return C.trigger("navbar:transparentshow"), y.emit("navbarTransparentShow", C[0]), C.addClass("navbar-transparent-visible"), void C.find(".navbar-bg, .title").css("opacity", "");
                                C.find(".navbar-bg, .title").css("opacity", r), T && (Support.touch ? b && (clearTimeout(b), b = null, b = setTimeout((function () {
                                    P(), clearTimeout(b), b = null
                                }), 70)) : (clearTimeout(g), g = setTimeout((function () {
                                    P()
                                }), 300)))
                            }
                        }
                    }(), w.hasClass("page-previous") || r && (w.hasClass("page-with-card-opened") || (s = m.scrollHeight, l = m.offsetHeight, c = i + l >= s, p = C.hasClass("navbar-hidden") || C.parent(".navbars").hasClass("navbar-hidden"), c ? y.params.navbar.showOnPageScrollEnd && (u = "show") : u = o > i ? y.params.navbar.showOnPageScrollTop || i <= E ? "show" : "hide" : i > E ? "hide" : "show", "show" === u && p ? (y.navbar.show(C), p = !1) : "hide" !== u || p || (y.navbar.hide(C), p = !0), o = i)))
                }

                function L() {
                    v = !1
                }

                function M() {
                    clearTimeout(b), b = null, b = setTimeout((function () {
                        !1 !== v && (n && !a ? P() : O(), clearTimeout(b), b = null)
                    }), 70)
                }
                w.on("scroll", ".page-content", D, !0), Support.touch && (a && S || n && T) && (y.on("touchstart:passive", L), y.on("touchend:passive", M)), (a || n) && w.find(".page-content").each((function (e, t) {
                    t.scrollTop > 0 && D.call(t)
                })), w[0].f7DetachNavbarScrollHandlers = function () {
                    delete w[0].f7DetachNavbarScrollHandlers, w.off("scroll", ".page-content", D, !0), Support.touch && (a && S || n && T) && (y.off("touchstart:passive", L), y.off("touchend:passive", M))
                }
            }
        },
        Navbar$1 = {
            name: "navbar",
            create: function () {
                var e = this;
                Utils.extend(e, {
                    navbar: {
                        size: Navbar.size.bind(e),
                        hide: Navbar.hide.bind(e),
                        show: Navbar.show.bind(e),
                        getElByPage: Navbar.getElByPage.bind(e),
                        getPageByEl: Navbar.getPageByEl.bind(e),
                        collapseLargeTitle: Navbar.collapseLargeTitle.bind(e),
                        expandLargeTitle: Navbar.expandLargeTitle.bind(e),
                        toggleLargeTitle: Navbar.toggleLargeTitle.bind(e),
                        initNavbarOnScroll: Navbar.initNavbarOnScroll.bind(e)
                    }
                })
            },
            params: {
                navbar: {
                    scrollTopOnTitleClick: !0,
                    iosCenterTitle: !0,
                    mdCenterTitle: !1,
                    auroraCenterTitle: !0,
                    hideOnPageScroll: !1,
                    showOnPageScrollEnd: !0,
                    showOnPageScrollTop: !0,
                    collapseLargeTitleOnScroll: !0,
                    snapPageScrollToLargeTitle: !0,
                    snapPageScrollToTransparentNavbar: !0
                }
            },
            on: {
                "panelBreakpoint panelCollapsedBreakpoint panelResize viewResize resize viewMasterDetailBreakpoint": function () {
                    var e = this;
                    $(".navbar").each((function (t, r) {
                        e.navbar.size(r)
                    }))
                },
                pageBeforeRemove: function (e) {
                    e.$el[0].f7DetachNavbarScrollHandlers && e.$el[0].f7DetachNavbarScrollHandlers()
                },
                pageBeforeIn: function (e) {
                    if ("ios" === this.theme) {
                        var t, r = e.$el.parents(".view")[0].f7View,
                            a = this.navbar.getElByPage(e);
                        if (t = a ? $(a).parents(".navbars") : e.$el.parents(".view").children(".navbars"), e.$el.hasClass("no-navbar") || r.router.dynamicNavbar && !a) {
                            var n = !!(e.pageFrom && e.router.history.length > 0);
                            this.navbar.hide(t, n)
                        } else this.navbar.show(t)
                    }
                },
                pageReinit: function (e) {
                    var t = $(this.navbar.getElByPage(e));
                    t && 0 !== t.length && this.navbar.size(t)
                },
                pageInit: function (e) {
                    var t, r, a, n = $(this.navbar.getElByPage(e));
                    n && 0 !== n.length && (this.navbar.size(n), n.find(".title-large").length > 0 && n.addClass("navbar-large"), n.hasClass("navbar-large") && (this.params.navbar.collapseLargeTitleOnScroll && (t = !0), e.$el.addClass("page-with-navbar-large")), !t && n.hasClass("navbar-transparent") && (r = !0), (this.params.navbar.hideOnPageScroll || e.$el.find(".hide-navbar-on-scroll").length || e.$el.hasClass("hide-navbar-on-scroll") || e.$el.find(".hide-bars-on-scroll").length || e.$el.hasClass("hide-bars-on-scroll")) && (a = !(e.$el.find(".keep-navbar-on-scroll").length || e.$el.hasClass("keep-navbar-on-scroll") || e.$el.find(".keep-bars-on-scroll").length || e.$el.hasClass("keep-bars-on-scroll"))), (t || a || r) && this.navbar.initNavbarOnScroll(e.el, n[0], a, t, r))
                },
                "panelOpen panelSwipeOpen modalOpen": function (e) {
                    var t = this;
                    e.$el.find(".navbar:not(.navbar-previous):not(.stacked)").each((function (e, r) {
                        t.navbar.size(r)
                    }))
                },
                tabShow: function (e) {
                    var t = this;
                    $(e).find(".navbar:not(.navbar-previous):not(.stacked)").each((function (e, r) {
                        t.navbar.size(r)
                    }))
                }
            },
            clicks: {
                ".navbar .title": function (e) {
                    if (this.params.navbar.scrollTopOnTitleClick && !(e.closest("a").length > 0)) {
                        var t, r = e.parents(".navbar"),
                            a = r.parents(".navbars");
                        0 === (t = r.parents(".page-content")).length && (r.parents(".page").length > 0 && (t = r.parents(".page").find(".page-content")), 0 === t.length && a.length && a.nextAll(".page-current:not(.stacked)").length > 0 && (t = a.nextAll(".page-current:not(.stacked)").find(".page-content")), 0 === t.length && r.nextAll(".page-current:not(.stacked)").length > 0 && (t = r.nextAll(".page-current:not(.stacked)").find(".page-content"))), t && t.length > 0 && (t.hasClass("tab") && (t = t.parent(".tabs").children(".page-content.tab-active")), t.length > 0 && t.scrollTop(0, 300))
                    }
                }
            },
            vnode: {
                navbar: {
                    postpatch: function (e) {
                        this.navbar.size(e.elm)
                    }
                }
            }
        },
        Toolbar = {
            setHighlight: function (e) {
                if ("md" === this.theme) {
                    var t = $(e);
                    if (0 !== t.length && (t.hasClass("tabbar") || t.hasClass("tabbar-labels"))) {
                        var r = t.find(".tab-link-highlight"),
                            a = t.find(".tab-link").length;
                        if (0 !== a) {
                            0 === r.length ? (t.children(".toolbar-inner").append('<span class="tab-link-highlight"></span>'), r = t.find(".tab-link-highlight")) : r.next().length && t.children(".toolbar-inner").append(r);
                            var n, o, i = t.find(".tab-link-active");
                            if (t.hasClass("tabbar-scrollable") && i && i[0]) n = i[0].offsetWidth + "px", o = i[0].offsetLeft + "px";
                            else {
                                var s = i.index();
                                n = 100 / a + "%", o = 100 * (this.rtl ? -s : s) + "%"
                            }
                            Utils.nextFrame((function () {
                                r.css("width", n).transform("translate3d(" + o + ",0,0)")
                            }))
                        } else r.remove()
                    }
                }
            },
            init: function (e) {
                this.toolbar.setHighlight(e)
            },
            hide: function (e, t) {
                void 0 === t && (t = !0);
                var r = $(e);
                if (!r.hasClass("toolbar-hidden")) {
                    var a = "toolbar-hidden" + (t ? " toolbar-transitioning" : "");
                    r.transitionEnd((function () {
                        r.removeClass("toolbar-transitioning")
                    })), r.addClass(a), r.trigger("toolbar:hide"), this.emit("toolbarHide", r[0])
                }
            },
            show: function (e, t) {
                void 0 === t && (t = !0);
                var r = $(e);
                r.hasClass("toolbar-hidden") && (t && (r.addClass("toolbar-transitioning"), r.transitionEnd((function () {
                    r.removeClass("toolbar-transitioning")
                }))), r.removeClass("toolbar-hidden"), r.trigger("toolbar:show"), this.emit("toolbarShow", r[0]))
            },
            initToolbarOnScroll: function (e) {
                var t, r, a, n, o, i, s, l = this,
                    c = $(e),
                    u = c.parents(".view").children(".toolbar");
                (0 === u.length && (u = c.find(".toolbar")), 0 === u.length && (u = c.parents(".views").children(".tabbar, .tabbar-labels")), 0 !== u.length) && (c.on("scroll", ".page-content", p, !0), c[0].f7ScrollToolbarHandler = p);

                function p(e) {
                    if (!c.hasClass("page-with-card-opened") && !c.hasClass("page-previous")) {
                        e && e.target && e.target !== this || (r = this.scrollTop, a = this.scrollHeight, n = this.offsetHeight, o = r + n >= a, s = u.hasClass("toolbar-hidden"), o ? l.params.toolbar.showOnPageScrollEnd && (i = "show") : i = t > r ? l.params.toolbar.showOnPageScrollTop || r <= 44 ? "show" : "hide" : r > 44 ? "hide" : "show", "show" === i && s ? (l.toolbar.show(u), s = !1) : "hide" !== i || s || (l.toolbar.hide(u), s = !0), t = r)
                    }
                }
            }
        },
        Toolbar$1 = {
            name: "toolbar",
            create: function () {
                Utils.extend(this, {
                    toolbar: {
                        hide: Toolbar.hide.bind(this),
                        show: Toolbar.show.bind(this),
                        setHighlight: Toolbar.setHighlight.bind(this),
                        initToolbarOnScroll: Toolbar.initToolbarOnScroll.bind(this),
                        init: Toolbar.init.bind(this)
                    }
                })
            },
            params: {
                toolbar: {
                    hideOnPageScroll: !1,
                    showOnPageScrollEnd: !0,
                    showOnPageScrollTop: !0
                }
            },
            on: {
                pageBeforeRemove: function (e) {
                    e.$el[0].f7ScrollToolbarHandler && e.$el.off("scroll", ".page-content", e.$el[0].f7ScrollToolbarHandler, !0)
                },
                pageBeforeIn: function (e) {
                    var t = e.$el.parents(".view").children(".toolbar");
                    0 === t.length && (t = e.$el.parents(".views").children(".tabbar, .tabbar-labels")), 0 === t.length && (t = e.$el.find(".toolbar")), 0 !== t.length && (e.$el.hasClass("no-toolbar") ? this.toolbar.hide(t) : this.toolbar.show(t))
                },
                pageInit: function (e) {
                    var t = this;
                    if (e.$el.find(".tabbar, .tabbar-labels").each((function (e, r) {
                            t.toolbar.init(r)
                        })), t.params.toolbar.hideOnPageScroll || e.$el.find(".hide-toolbar-on-scroll").length || e.$el.hasClass("hide-toolbar-on-scroll") || e.$el.find(".hide-bars-on-scroll").length || e.$el.hasClass("hide-bars-on-scroll")) {
                        if (e.$el.find(".keep-toolbar-on-scroll").length || e.$el.hasClass("keep-toolbar-on-scroll") || e.$el.find(".keep-bars-on-scroll").length || e.$el.hasClass("keep-bars-on-scroll")) return;
                        t.toolbar.initToolbarOnScroll(e.el)
                    }
                },
                init: function () {
                    var e = this;
                    e.root.find(".tabbar, .tabbar-labels").each((function (t, r) {
                        e.toolbar.init(r)
                    }))
                }
            },
            vnode: {
                tabbar: {
                    insert: function (e) {
                        this.toolbar.init(e.elm)
                    }
                }
            }
        },
        Subnavbar = {
            name: "subnavbar",
            on: {
                pageInit: function (e) {
                    e.$navbarEl && e.$navbarEl.length && e.$navbarEl.find(".subnavbar").length && e.$el.addClass("page-with-subnavbar"), e.$el.find(".subnavbar").length && e.$el.addClass("page-with-subnavbar")
                }
            }
        },
        TouchRipple = function (e, t, r) {
            var a = this;
            if (e) {
                var n = e[0].getBoundingClientRect(),
                    o = t - n.left,
                    i = r - n.top,
                    s = n.width,
                    l = n.height,
                    c = Math.max(Math.pow(Math.pow(l, 2) + Math.pow(s, 2), .5), 48);
                return a.$rippleWaveEl = $('<div class="ripple-wave" style="width: ' + c + "px; height: " + c + "px; margin-top:-" + c / 2 + "px; margin-left:-" + c / 2 + "px; left:" + o + "px; top:" + i + 'px;"></div>'), e.prepend(a.$rippleWaveEl), a.rippleTransform = "translate3d(" + (s / 2 - o) + "px, " + (l / 2 - i) + "px, 0) scale(1)", Utils.nextFrame((function () {
                    a && a.$rippleWaveEl && a.$rippleWaveEl.transform(a.rippleTransform)
                })), a
            }
        };
    TouchRipple.prototype.destroy = function () {
        var e = this;
        e.$rippleWaveEl && e.$rippleWaveEl.remove(), Object.keys(e).forEach((function (t) {
            e[t] = null, delete e[t]
        })), e = null
    }, TouchRipple.prototype.remove = function () {
        var e = this;
        if (!e.removing) {
            var t = this.$rippleWaveEl,
                r = this.rippleTransform,
                a = Utils.nextTick((function () {
                    e.destroy()
                }), 400);
            e.removing = !0, t.addClass("ripple-wave-fill").transform(r.replace("scale(1)", "scale(1.01)")).transitionEnd((function () {
                clearTimeout(a), Utils.nextFrame((function () {
                    t.addClass("ripple-wave-out").transform(r.replace("scale(1)", "scale(1.01)")), a = Utils.nextTick((function () {
                        e.destroy()
                    }), 700), t.transitionEnd((function () {
                        clearTimeout(a), e.destroy()
                    }))
                }))
            }))
        }
    };
    var TouchRipple$1 = {
            name: "touch-ripple",
            static: {
                TouchRipple: TouchRipple
            },
            create: function () {
                this.touchRipple = {
                    create: function () {
                        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
                        return new(Function.prototype.bind.apply(TouchRipple, [null].concat(e)))
                    }
                }
            }
        },
        openedModals = [],
        dialogsQueue = [];

    function clearDialogsQueue() {
        0 !== dialogsQueue.length && dialogsQueue.shift().open()
    }
    var Modal = function (e) {
            function t(t, r) {
                e.call(this, r, [t]);
                var a = {};
                return this.useModulesParams(a), this.params = Utils.extend(a, r), this.opened = !1, this.useModules(), this
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.onOpen = function () {
                this.opened = !0, openedModals.push(this), $("html").addClass("with-modal-" + this.type.toLowerCase()), this.$el.trigger("modal:open " + this.type.toLowerCase() + ":open"), this.emit("local::open modalOpen " + this.type + "Open", this)
            }, t.prototype.onOpened = function () {
                this.$el.trigger("modal:opened " + this.type.toLowerCase() + ":opened"), this.emit("local::opened modalOpened " + this.type + "Opened", this)
            }, t.prototype.onClose = function () {
                this.opened = !1, this.type && this.$el && (openedModals.splice(openedModals.indexOf(this), 1), $("html").removeClass("with-modal-" + this.type.toLowerCase()), this.$el.trigger("modal:close " + this.type.toLowerCase() + ":close"), this.emit("local::close modalClose " + this.type + "Close", this))
            }, t.prototype.onClosed = function () {
                this.type && this.$el && (this.$el.removeClass("modal-out"), this.$el.hide(), this.$el.trigger("modal:closed " + this.type.toLowerCase() + ":closed"), this.emit("local::closed modalClosed " + this.type + "Closed", this))
            }, t.prototype.open = function (e) {
                var t, r = this,
                    a = r.app,
                    n = r.$el,
                    o = r.$backdropEl,
                    i = r.type,
                    s = !0;
                if (void 0 !== e ? s = e : void 0 !== r.params.animate && (s = r.params.animate), !n || n.hasClass("modal-in")) return r;
                if ("dialog" === i && a.params.modal.queueDialogs && ($(".dialog.modal-in").length > 0 ? t = !0 : openedModals.length > 0 && openedModals.forEach((function (e) {
                        "dialog" === e.type && (t = !0)
                    })), t)) return dialogsQueue.push(r), r;
                var l = n.parent(),
                    c = n.parents(doc).length > 0;

                function u() {
                    n.hasClass("modal-out") ? r.onClosed() : n.hasClass("modal-in") && r.onOpened()
                }
                return a.params.modal.moveToRoot && !l.is(a.root) && (a.root.append(n), r.once(i + "Closed", (function () {
                    c ? l.append(n) : n.remove()
                }))), n.show(), r._clientLeft = n[0].clientLeft, s ? (o && (o.removeClass("not-animated"), o.addClass("backdrop-in")), n.animationEnd((function () {
                    u()
                })), n.transitionEnd((function () {
                    u()
                })), n.removeClass("modal-out not-animated").addClass("modal-in"), r.onOpen()) : (o && o.addClass("backdrop-in not-animated"), n.removeClass("modal-out").addClass("modal-in not-animated"), r.onOpen(), r.onOpened()), r
            }, t.prototype.close = function (e) {
                var t = this,
                    r = t.$el,
                    a = t.$backdropEl,
                    n = !0;
                if (void 0 !== e ? n = e : void 0 !== t.params.animate && (n = t.params.animate), !r || !r.hasClass("modal-in")) return dialogsQueue.indexOf(t) >= 0 && dialogsQueue.splice(dialogsQueue.indexOf(t), 1), t;
                if (a) {
                    var o = !0;
                    "popup" === t.type && t.$el.prevAll(".popup.modal-in").each((function (e, r) {
                        var a = r.f7Modal;
                        a && a.params.closeByBackdropClick && a.params.backdrop && a.backdropEl === t.backdropEl && (o = !1)
                    })), o && (a[n ? "removeClass" : "addClass"]("not-animated"), a.removeClass("backdrop-in"))
                }

                function i() {
                    r.hasClass("modal-out") ? t.onClosed() : r.hasClass("modal-in") && t.onOpened()
                }
                return r[n ? "removeClass" : "addClass"]("not-animated"), n ? (r.animationEnd((function () {
                    i()
                })), r.transitionEnd((function () {
                    i()
                })), r.removeClass("modal-in").addClass("modal-out"), t.onClose()) : (r.addClass("not-animated").removeClass("modal-in").addClass("modal-out"), t.onClose(), t.onClosed()), "dialog" === t.type && clearDialogsQueue(), t
            }, t.prototype.destroy = function () {
                this.destroyed || (this.emit("local::beforeDestroy modalBeforeDestroy " + this.type + "BeforeDestroy", this), this.$el && (this.$el.trigger("modal:beforedestroy " + this.type.toLowerCase() + ":beforedestroy"), this.$el.length && this.$el[0].f7Modal && delete this.$el[0].f7Modal), Utils.deleteProps(this), this.destroyed = !0)
            }, t
        }(Framework7Class),
        CustomModal = function (e) {
            function t(t, r) {
                var a = Utils.extend({
                    backdrop: !0,
                    closeByBackdropClick: !0,
                    on: {}
                }, r);
                e.call(this, t, a);
                var n, o, i = this;
                if (i.params = a, (n = i.params.el ? $(i.params.el) : $(i.params.content)) && n.length > 0 && n[0].f7Modal) return n[0].f7Modal;
                if (0 === n.length) return i.destroy();

                function s(e) {
                    i && !i.destroyed && o && e.target === o[0] && i.close()
                }
                return i.params.backdrop && 0 === (o = t.root.children(".custom-modal-backdrop")).length && (o = $('<div class="custom-modal-backdrop"></div>'), t.root.append(o)), i.on("customModalOpened", (function () {
                    i.params.closeByBackdropClick && i.params.backdrop && t.on("click", s)
                })), i.on("customModalClose", (function () {
                    i.params.closeByBackdropClick && i.params.backdrop && t.off("click", s)
                })), Utils.extend(i, {
                    app: t,
                    $el: n,
                    el: n[0],
                    $backdropEl: o,
                    backdropEl: o && o[0],
                    type: "customModal"
                }), n[0].f7Modal = i, i
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
        }(Modal),
        Modal$1 = {
            name: "modal",
            static: {
                Modal: Modal,
                CustomModal: CustomModal
            },
            create: function () {
                var e = this;
                e.customModal = {
                    create: function (t) {
                        return new CustomModal(e, t)
                    }
                }
            },
            params: {
                modal: {
                    moveToRoot: !0,
                    queueDialogs: !0
                }
            }
        };
    return "undefined" != typeof window && (window.Template7 || (window.Template7 = Template7), window.Dom7 || (window.Dom7 = $)), Router.use([RouterTemplateLoaderModule, RouterComponentLoaderModule]), Framework7.use([DeviceModule, SupportModule, UtilsModule, ResizeModule, RequestModule, TouchModule, ClicksModule, RouterModule, HistoryModule, ComponentModule, ServiceWorkerModule, Statusbar$1, View$1, Navbar$1, Toolbar$1, Subnavbar, TouchRipple$1, Modal$1]), Framework7
}));
//# sourceMappingURL=framework7.min.js.map