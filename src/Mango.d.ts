export class Mango {
    static none: number;
    static pretty: number;
    static commas: number;
    static quotes: number;
    static useNull: number;
    static json: number;
    static parse(str: any, vars?: {}): any;
    static toString(data: any, flags?: number): string;
    static "__#1@#Value": {
        new (value: any): {
            value: any;
            evaluate(data: any): any;
        };
    };
    static "__#1@#Var": {
        new (name: any): {
            name: any;
            isVar: boolean;
            evaluate(data: any): any;
            value(data: any): any;
        };
    };
    static "__#1@#Unpack": {
        new (value: any): {
            value: any;
            isUnpack: boolean;
            evaluate(data: any, parent: any): any;
        };
    };
    static "__#1@#TemplateDef": {
        new (data: any, args: any, value: any): {
            data: any;
            args: any;
            value: any;
            evaluate(args: any): any;
        };
    };
    static "__#1@#Template": {
        new (name: any, args: any): {
            name: any;
            args: any;
            evaluate(data: any): any;
        };
    };
    static "__#1@#String": {
        new (segments: any): {
            segments: any;
            evaluate(data: any): string;
        };
    };
    static "__#1@#List": {
        new (data: any, list: any): {
            data: any;
            list: any;
            evaluate(data: any): any[];
        };
    };
    static "__#1@#Obj": {
        new (data: any, obj: any, unpack: any): {
            data: any;
            obj: any;
            unpack: any;
            evaluate(data: any): {};
        };
    };
    static "__#1@#Scope": {
        new (): {
            vars: {};
            templates: {};
            copy(): any;
            combine(parent: any): any;
        };
    };
    static "__#1@#Parser": {
        new (str: any): {
            str: any;
            index: number;
            scope: {
                vars: {};
                templates: {};
                copy(): any;
                combine(parent: any): any;
            };
            readonly current: any;
            readonly isDone: boolean;
            peek(text: any): boolean;
            parseRaw(text: any): boolean;
            parseText(text: any): boolean;
            parseToken(pattern: any): any;
            parseRegex(pattern: any): any;
            parseWhitespace(): void;
            parseName(): any;
            parseTaggedValue(): any;
            parseValue(): any;
            parseRawString(): any;
            parseString(simple?: boolean): any;
            parseList(): any;
            parseObject(): {
                data: any;
                obj: any;
                unpack: any;
                evaluate(data: any): {};
            };
            parseKey(): any;
            parseUnpack(): any;
            parseVariable(): any;
            parseVarUnpack(): {
                value: any;
                isUnpack: boolean;
                evaluate(data: any, parent: any): any;
            } | undefined;
            parseVarAssign(): any;
            parseTemplateName(): any;
            parseTemplateValue(): any;
            parseTemplateUnpack(): any;
            parseTemplateAssign(): any;
        };
    };
    static "__#1@#Writer": {
        new (flags: any): {
            flags: any;
            segments: any[];
            toString(): string;
            writeValue(value: any, t?: string): void;
            writeObject(obj: any, t: any): void;
            writeList(list: any, t: any): void;
        };
    };
}
//# sourceMappingURL=Mango.d.ts.map