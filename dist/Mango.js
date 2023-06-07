"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Mango_Value, _Mango_Var, _Mango_Unpack, _Mango_TemplateDef, _Mango_Template, _Mango_String, _Mango_List, _Mango_Obj, _Mango_Scope, _Mango_Parser, _Mango_Writer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mango = void 0;
class Mango {
    static parse(str, vars) {
        const parser = new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Parser))(str);
        for (let v in vars) {
            parser.scope.vars[v] = new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(vars[v]);
        }
        const value = parser.parseTaggedValue();
        parser.parseWhitespace();
        if (!parser.isDone) {
            throw 'Invalid mango';
        }
        return value.evaluate(parser.scope);
    }
    static toString(data, flags = Mango.none) {
        const writer = new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Writer))(flags);
        writer.writeValue(data);
        return writer.toString();
    }
}
exports.Mango = Mango;
_a = Mango;
Mango.none = 0;
Mango.pretty = 1;
Mango.commas = 2;
Mango.quotes = 4;
Mango.useNull = 8;
Mango.json = 2 | 4 | 8;
_Mango_Value = { value: class {
        constructor(value) {
            this.value = value;
        }
        evaluate(data) {
            return this.value;
        }
    } };
_Mango_Var = { value: class {
        constructor(name) {
            this.name = name;
            this.isVar = true;
        }
        evaluate(data) {
            var _b, _c;
            return (_c = (_b = data.vars[this.name]) === null || _b === void 0 ? void 0 : _b.evaluate(data)) !== null && _c !== void 0 ? _c : null;
        }
        value(data) {
            var _b;
            return (_b = data.vars[this.name]) !== null && _b !== void 0 ? _b : new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(null);
        }
    } };
_Mango_Unpack = { value: class {
        constructor(value) {
            this.value = value;
            this.isUnpack = true;
        }
        evaluate(data, parent) {
            var _b;
            const value = (_b = this.value.evaluate(data)) !== null && _b !== void 0 ? _b : null;
            if (Array.isArray(value) && Array.isArray(parent)) {
                for (let v of value) {
                    parent.push(v);
                }
            }
            else if (value !== null && parent !== null && typeof (value) == 'object' && typeof (parent) == 'object') {
                for (let key in value) {
                    parent[key] = value[key];
                }
            }
            return parent;
        }
    } };
_Mango_TemplateDef = { value: class {
        constructor(data, args, value) {
            this.data = data;
            this.args = args;
            this.value = value;
        }
        evaluate(args) {
            let scope = this.data.copy();
            for (let i = 0; i < this.args.length; i++) {
                if (i < args.length) {
                    scope.vars[this.args[i]] = args[i];
                }
                else {
                    scope.vars[this.args[i]] = new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(null);
                }
            }
            return this.value.evaluate(scope);
        }
    } };
_Mango_Template = { value: class {
        constructor(name, args) {
            this.name = name;
            this.args = args;
        }
        evaluate(data) {
            var _b, _c;
            let args = [];
            for (let i = 0; i < this.args.length; i++) {
                if (this.args[i].isVar) {
                    args.push(this.args[i].value(data));
                }
                else {
                    args.push(this.args[i]);
                }
            }
            return (_c = (_b = data.templates[this.name]) === null || _b === void 0 ? void 0 : _b.evaluate(args)) !== null && _c !== void 0 ? _c : null;
        }
    } };
_Mango_String = { value: class {
        constructor(segments) {
            this.segments = segments !== null && segments !== void 0 ? segments : [];
        }
        evaluate(data) {
            let str = '';
            for (let seg of this.segments) {
                let v = seg.evaluate(data);
                if (typeof (v) == 'string') {
                    str += v;
                }
                else {
                    str += Mango.toString(seg.evaluate(data));
                }
            }
            return str;
        }
    } };
_Mango_List = { value: class {
        constructor(data, list) {
            this.data = data;
            this.list = list !== null && list !== void 0 ? list : [];
        }
        evaluate(data) {
            let list = [];
            let scope = this.data.combine(data);
            for (let v of this.list) {
                if (v.isUnpack) {
                    v.evaluate(scope, list);
                }
                else {
                    list.push(v.evaluate(scope, list));
                }
            }
            return list;
        }
    } };
_Mango_Obj = { value: class {
        constructor(data, obj, unpack) {
            this.data = data;
            this.obj = obj !== null && obj !== void 0 ? obj : {};
            this.unpack = unpack !== null && unpack !== void 0 ? unpack : [];
        }
        evaluate(data) {
            let obj = {};
            let scope = this.data.combine(data);
            for (let u of this.unpack) {
                u.evaluate(scope, obj);
            }
            for (let key in this.obj) {
                obj[key] = this.obj[key].evaluate(scope);
            }
            return obj;
        }
    } };
_Mango_Scope = { value: class {
        constructor() {
            this.vars = {};
            this.templates = {};
        }
        copy() {
            let scope = new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Scope))();
            for (let v in this.vars) {
                scope.vars[v] = this.vars[v];
            }
            for (let v in this.templates) {
                scope.templates[v] = this.templates[v];
            }
            return scope;
        }
        combine(parent) {
            let scope = parent.copy();
            for (let v in this.vars) {
                scope.vars[v] = this.vars[v];
            }
            for (let v in this.templates) {
                scope.templates[v] = this.templates[v];
            }
            return scope;
        }
    } };
_Mango_Parser = { value: class {
        constructor(str) {
            this.str = str;
            this.index = 0;
            this.scope = new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Scope))();
            this.parseWhitespace();
        }
        get current() {
            return this.str.charAt(this.index);
        }
        get isDone() {
            return this.index >= this.str.length;
        }
        peek(text) {
            for (let i = 0; i < text.length; i++) {
                if (this.str.charAt(this.index + i) !== text.charAt(i))
                    return false;
            }
            return true;
        }
        parseRaw(text) {
            if (this.peek(text)) {
                this.index += text.length;
                return true;
            }
            return false;
        }
        parseText(text) {
            if (this.parseRaw(text)) {
                this.parseWhitespace();
                return true;
            }
            return false;
        }
        parseToken(pattern) {
            let token = this.parseRegex(pattern);
            if (token) {
                this.parseWhitespace();
                return token;
            }
        }
        parseRegex(pattern) {
            pattern.lastIndex = this.index;
            const match = pattern.exec(this.str);
            if (match) {
                this.index += match[0].length;
                return match.length > 1 ? match[1] : match[0];
            }
        }
        parseWhitespace() {
            this.parseRegex(/[\s\r\n]+/y);
            while (true) {
                let start = this.parseRegex(/\-\-(\/*)/y);
                if (start == undefined)
                    break;
                let block = start.length;
                if (block == 0) {
                    while (this.current != '\r' && this.current != '\n' && !this.isDone) {
                        this.index++;
                    }
                }
                else {
                    while (true) {
                        while (this.current != '/') {
                            this.index++;
                            if (this.isDone)
                                throw 'Invalid comment';
                        }
                        let count = 0;
                        while (this.current == '/') {
                            count++;
                            this.index++;
                        }
                        if (count >= block && this.parseRaw('--')) {
                            break;
                        }
                        this.index++;
                    }
                }
                this.parseRegex(/[\s\r\n]+/y);
            }
        }
        parseName() {
            let i = this.index;
            let name = this.parseToken(/[a-zA-Z0-9_]+\b/y);
            if (!name || name == 'true' || name == 'false' || name == 'null' || name == 'nil' || /^[0-9]+$/.test(name)) {
                this.index = i;
                return;
            }
            return name;
        }
        parseTaggedValue() {
            let tags = [];
            const index = this.index;
            while (!this.isDone) {
                let tag = this.parseKey();
                if (tag == undefined)
                    break;
                tags.push(tag);
            }
            if (tags.length > 0) {
                if (!this.parseText(':')) {
                    this.index = index;
                    return this.parseValue();
                }
            }
            return this.parseValue();
        }
        /// Parses a value.
        parseValue() {
            switch (this.current) {
                case 'n': {
                    if (this.parseToken(/(nil|null)\b/y))
                        return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(null);
                }
                case 't':
                case 'f': {
                    let t = this.parseToken(/(true|false)\b/y);
                    if (t)
                        return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(t == 'true');
                    break;
                }
                case '"': {
                    return this.parseString();
                }
                case '[': {
                    return this.parseList();
                }
                case '{': {
                    return this.parseObject();
                }
                case '$': {
                    let v = this.parseVariable();
                    return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Var))(v);
                }
                case '#': {
                    return this.parseTemplateValue();
                }
            }
            let t = this.parseToken(/\d*\.?\d+\b/y);
            if (t)
                return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(parseFloat(t));
            throw 'Invalid mango value';
        }
        parseRawString() {
            return this.parseString(true).value;
        }
        parseString(simple = false) {
            if (!this.parseRaw('"'))
                throw 'Invalid string';
            const start = this.index;
            let str = '';
            let segments = [];
            while (!this.isDone) {
                switch (this.current) {
                    case '"': {
                        this.index++;
                        this.parseWhitespace();
                        if (!simple && segments.length > 0) {
                            segments.push(new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(str));
                            return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_String))(segments);
                        }
                        return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(str);
                    }
                    case '\r':
                    case '\n': {
                        throw 'Invalid string';
                    }
                    case '\\': {
                        switch (this.str.charAt(this.index + 1)) {
                            case 't':
                                str += '\t';
                                break;
                            case 'r':
                                str += '\r';
                                break;
                            case 'n':
                                str += '\n';
                                break;
                            case '{': {
                                if (simple)
                                    break;
                                this.index += 2;
                                this.parseWhitespace();
                                segments.push(new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Value))(str));
                                str = '';
                                segments.push(this.parseTaggedValue());
                                if (!this.parseRaw('}'))
                                    throw 'Invalid string';
                                this.index -= 2;
                                break;
                            }
                            default: {
                                str += this.str.charAt(this.index + 1);
                            }
                        }
                        this.index += 2;
                        continue;
                    }
                }
                str += this.current;
                this.index++;
            }
            throw 'Invalid string';
        }
        /// Parses a list.
        parseList() {
            if (!this.parseText('['))
                throw 'Invalid list';
            let array = [];
            let scope = this.scope.copy();
            while (true) {
                if (this.parseVarAssign())
                    continue;
                if (this.parseTemplateAssign())
                    continue;
                break;
            }
            if (this.parseText(']')) {
                const s = this.scope.copy();
                this.scope = scope;
                return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_List))(s, array);
            }
            while (!this.isDone) {
                let v = this.parseUnpack();
                if (v !== undefined) {
                    array.push(v);
                }
                else {
                    array.push(this.parseTaggedValue());
                }
                if (this.parseText(']')) {
                    const s = this.scope.copy();
                    this.scope = scope;
                    return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_List))(s, array);
                }
                this.parseText(',');
            }
            throw 'Invalid list';
        }
        parseObject() {
            if (!this.parseText('{'))
                throw 'Invalid object';
            let obj = {};
            let unpack = [];
            let scope = this.scope.copy();
            while (true) {
                if (this.parseVarAssign())
                    continue;
                if (this.parseTemplateAssign())
                    continue;
                break;
            }
            if (this.parseText('}')) {
                const s = this.scope.copy();
                this.scope = scope;
                return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Obj))(s, obj, unpack);
            }
            while (!this.isDone) {
                let v = this.parseUnpack();
                if (v !== undefined) {
                    unpack.push(v);
                }
                else {
                    let key = this.parseKey();
                    if (key == undefined)
                        throw 'Invalid object';
                    let tags = [];
                    while (!this.isDone) {
                        let tag = this.parseKey();
                        if (tag == undefined)
                            break;
                        tags.push(tag);
                    }
                    if (!this.parseText(':'))
                        throw 'Invalid object';
                    let val = this.parseValue();
                    obj[key] = val;
                }
                if (this.parseText('}')) {
                    const s = this.scope.copy();
                    this.scope = scope;
                    return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Obj))(s, obj, unpack);
                }
                this.parseText(',');
            }
            throw 'Invalid object';
        }
        /// Parses a key.
        parseKey() {
            if (this.current == '"')
                return this.parseRawString();
            return this.parseName();
        }
        parseUnpack() {
            let u = this.parseVarUnpack();
            if (u)
                return u;
            u = this.parseTemplateUnpack();
            if (u)
                return u;
        }
        /// Parses a variable.
        parseVariable() {
            return this.parseToken(/\$([a-zA-Z0-9_]+)\b/y);
        }
        /// Parses a variable unpack.
        parseVarUnpack() {
            let v = this.parseToken(/\$\$([a-zA-Z0-9_]+)\b/y);
            if (v == undefined)
                return;
            return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Unpack))(new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Var))(v));
        }
        /// Parses a variable assignment.
        parseVarAssign() {
            const index = this.index;
            if (this.peek('$$'))
                return;
            let v = this.parseVariable();
            if (!this.parseText('=')) {
                this.index = index;
                return;
            }
            let val = this.parseValue();
            this.scope.vars[v] = val;
            return v;
        }
        /// Parses a template name.
        parseTemplateName() {
            return this.parseToken(/\#([a-zA-Z0-9_]+)\b/y);
        }
        /// Parses a template.
        parseTemplateValue() {
            let name = this.parseTemplateName();
            if (!name)
                throw 'Invalid template';
            let args = [];
            if (!this.parseText('['))
                throw 'Invalid template';
            if (this.parseText(']')) {
                return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Template))(name, args);
            }
            while (!this.isDone) {
                let v = this.parseValue();
                if (v) {
                    args.push(v);
                }
                if (this.parseText(']')) {
                    return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Template))(name, args);
                }
                this.parseText(',');
            }
            throw 'Invalid template';
        }
        /// Parses a template unpack.
        parseTemplateUnpack() {
            if (!this.peek('##'))
                return;
            this.index++;
            let v = this.parseTemplateValue();
            return new (__classPrivateFieldGet(Mango, _a, "f", _Mango_Unpack))(v);
        }
        /// Parses a template assignment.
        parseTemplateAssign() {
            const index = this.index;
            if (this.peek('##'))
                return;
            let name = this.parseTemplateName();
            let args = [];
            let scope = this.scope.copy();
            if (!this.parseText('[')) {
                return;
            }
            if (!this.parseText(']')) {
                while (!this.isDone) {
                    let v = this.parseVariable();
                    if (v == undefined) {
                        this.index = index;
                        return;
                    }
                    args.push(v);
                    if (this.parseText(']')) {
                        break;
                    }
                    this.parseText(',');
                }
            }
            if (!this.parseText('=')) {
                this.index = index;
                return;
            }
            let val = this.parseValue();
            this.scope = scope;
            this.scope.templates[name] = new (__classPrivateFieldGet(Mango, _a, "f", _Mango_TemplateDef))(this.scope.copy(), args, val);
            return name;
        }
    } };
_Mango_Writer = { value: class {
        constructor(flags) {
            this.flags = flags;
            this.segments = [];
        }
        toString() {
            return this.segments.join('');
        }
        writeValue(value, t = '') {
            if (value == null) {
                this.segments.push(this.flags & Mango.useNull ? 'null' : 'nil');
            }
            else if (value === true) {
                this.segments.push('true');
            }
            else if (value === false) {
                this.segments.push('false');
            }
            else if (Array.isArray(value)) {
                this.writeList(value, t);
            }
            else if (typeof (value) == 'object') {
                this.writeObject(value, t);
            }
            else {
                this.segments.push(JSON.stringify(value));
            }
        }
        writeObject(obj, t) {
            const pretty = this.flags & Mango.pretty;
            const nt = t + '\t';
            if (pretty) {
                this.segments.push('{\n' + nt);
            }
            else {
                this.segments.push('{');
            }
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
                if (i > 0) {
                    if (this.flags & Mango.commas) {
                        this.segments.push(pretty ? ',\n' + nt : ',');
                    }
                    else {
                        this.segments.push(pretty ? '\n' + nt : ' ');
                    }
                }
                if (this.flags & Mango.quotes || !((/^[a-zA-Z0-9_]+$/).test(keys[i]) && (/[a-zA-Z_]/).test(keys[i]))) {
                    this.segments.push(JSON.stringify(keys[i]));
                }
                else {
                    this.segments.push(keys[i]);
                }
                this.segments.push(pretty ? ': ' : ':');
                this.writeValue(obj[keys[i]], nt);
            }
            if (pretty) {
                this.segments.push('\n' + t + '}');
            }
            else {
                this.segments.push('}');
            }
        }
        writeList(list, t) {
            const nt = t + '\t';
            const pretty = this.flags & Mango.pretty;
            if (pretty) {
                this.segments.push('[\n' + nt);
            }
            else {
                this.segments.push('[');
            }
            for (let i = 0; i < list.length; i++) {
                if (i > 0) {
                    if (this.flags & Mango.commas) {
                        this.segments.push(pretty ? ',\n' + nt : ',');
                    }
                    else {
                        this.segments.push(pretty ? '\n' + nt : ' ');
                    }
                }
                this.writeValue(list[i], nt);
            }
            if (pretty) {
                this.segments.push('\n' + t + ']');
            }
            else {
                this.segments.push(']');
            }
        }
    } };
