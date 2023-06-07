import { Config } from "./config";
import crypto from "crypto";

export namespace Random {

    let seed: () => number = GetSeed(Config.seed);

    export function RandomizeBetween(min: number, max: number, decimal: boolean, divide: boolean = false): number {
        let divideBy = 1
        if (divide) divideBy = Config.divideMaxValue;
        if (!decimal) return Math.floor(GetRandomNumber(seed)* ((max / divideBy) - min + 1) + min);
        else return GetRandomNumber(seed) * ((max / divideBy) - min) + min;
    }
    
    export function RandomizeBoolean(): boolean {
        return RandomizeBetween(0, 1, false) === 1;
    }
    
    export function GetSeed(string?: string | undefined): () => number {
        string = string ?? crypto.randomBytes(64).toString("hex");
        return xfnv1a(string);
    }

    export function GetStringSeed(string?: string | undefined, byteAmount: number = 64): string {
        return string ?? crypto.randomBytes(byteAmount).toString("hex");
    }
    
    export function GetRandomNumber(seed: () => number): number {
        return sfc32(seed(), seed(), seed(), seed());
    }
    
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    function xfnv1a(str: string): () => number {
        for (var i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
            // Math.imul() allows for 32-bit integer multiplication with C-like semantics
            h = Math.imul(h ^ str.charCodeAt(i), 16777619);
        }
        return function() {
            h += h << 13;
            h ^= h >>> 7;
            h += h << 3;
            h ^= h >>> 17;
            return (h += h << 5) >>> 0;
        };
    }
    
    function sfc32(a: number, b: number, c: number, d:number): number {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
        var t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;  
    }
}