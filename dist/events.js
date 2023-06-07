"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = exports.Random = void 0;
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("./config");
const Mango_1 = require("./Mango");
var Random;
(function (Random) {
    let seed = GetSeed(config_1.Config.seed);
    function RandomizeBetween(min, max, decimal, divide = false) {
        let divideBy = 1;
        if (divide)
            divideBy = config_1.Config.divideMaxValue;
        if (!decimal)
            return Math.floor(GetRandomNumber(seed) * ((max / divideBy) - min + 1) + min);
        else
            return GetRandomNumber(seed) * ((max / divideBy) - min) + min;
    }
    Random.RandomizeBetween = RandomizeBetween;
    function RandomizeBoolean() {
        return RandomizeBetween(0, 1, false) === 1;
    }
    Random.RandomizeBoolean = RandomizeBoolean;
    function GetSeed(string) {
        string = string !== null && string !== void 0 ? string : crypto_1.default.randomBytes(64).toString("hex");
        return xfnv1a(string);
    }
    Random.GetSeed = GetSeed;
    function GetRandomNumber(seed) {
        return sfc32(seed(), seed(), seed(), seed());
    }
    Random.GetRandomNumber = GetRandomNumber;
    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    function xfnv1a(str) {
        for (var i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
            // Math.imul() allows for 32-bit integer multiplication with C-like semantics
            h = Math.imul(h ^ str.charCodeAt(i), 16777619);
        }
        return function () {
            h += h << 13;
            h ^= h >>> 7;
            h += h << 3;
            h ^= h >>> 17;
            return (h += h << 5) >>> 0;
        };
    }
    function sfc32(a, b, c, d) {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
})(Random || (exports.Random = Random = {}));
var Events;
(function (Events) {
    let PlayerEvents = {};
    let PlatformEvents = {};
    let GlobalEvents = {};
    let GeneralEvents = {};
    let Meta = { chanceRange: [0, 0] };
    let Info = { name: "", desc: "" };
    const mangoFiles = "src/Data";
    function LoadMango() {
        const playerFile = fs_1.default.readFileSync(`${mangoFiles}/player.mango`, "utf8");
        PlayerEvents = Mango_1.Mango.parse(playerFile);
        const platformFile = fs_1.default.readFileSync(`${mangoFiles}/platform.mango`, "utf8");
        PlatformEvents = Mango_1.Mango.parse(platformFile);
        const globalFile = fs_1.default.readFileSync(`${mangoFiles}/global.mango`, "utf8");
        GlobalEvents = Mango_1.Mango.parse(globalFile);
        const generalFile = fs_1.default.readFileSync(`${mangoFiles}/general.mango`, "utf8");
        GeneralEvents = Mango_1.Mango.parse(generalFile);
        const metaFile = fs_1.default.readFileSync(`${mangoFiles}/meta.mango`, "utf8");
        Meta = Mango_1.Mango.parse(metaFile);
        const infoFile = fs_1.default.readFileSync(`${mangoFiles}/info.mango`, "utf8");
        Info = Mango_1.Mango.parse(infoFile);
    }
    Events.LoadMango = LoadMango;
    function Start(str, init, eventCategory) {
        str += "[";
        str += Random.RandomizeBoolean() == true && config_1.Config.alwaysEnableEvents ? "" : "!";
        str += init ? "?" : "";
        str += eventCategory;
        str += ".";
        return str;
    }
    function End(str) {
        str += "]\n";
        return str;
    }
    function GetRandomChance() {
        return Random.RandomizeBetween(Meta.chanceRange[0], Meta.chanceRange[1], false);
    }
    Events.GetRandomChance = GetRandomChance;
    function HandleOptions(str, event) {
        str += `${event.param.name} `;
        if (event.param.type == "range") {
            if (event.range == undefined || event.range == undefined || event.decimal == undefined)
                throw new Error("Range option is missing a parameter");
            if (event.single == true) {
                str += `${Random.RandomizeBetween(event.range[0], event.range[1], event.decimal)}`;
            }
            else if (event.single == false) {
                let random_one = Random.RandomizeBetween(event.range[0], event.range[1], event.decimal);
                let random_two = Random.RandomizeBetween(event.range[0], event.range[1], event.decimal);
                if (random_one > random_two) {
                    let temp = random_one;
                    random_one = random_two;
                    random_two = temp;
                }
                str += `${random_one}, ${random_two}`;
            }
        }
        else if (event.param.type == "boolean") {
            str += `${Random.RandomizeBoolean()}`;
        }
        else if (event.param.type == "option") {
            if (event.options == undefined || event.nullable == undefined)
                throw new Error("Option event is missing a parameter");
            const randomAmount = Random.RandomizeBetween(0, event.options.length - 1, false);
            let gottenAny = false;
            for (let i = 0; i < randomAmount; i++) {
                str += event.options[Random.RandomizeBetween(0, event.options.length - 1, false)];
                if (i !== randomAmount - 1) {
                    str += ", ";
                }
                gottenAny = true;
            }
            if (randomAmount == 0 && event.nullable) {
                str += null;
            }
            else if (!gottenAny && !event.nullable) {
                str += event.options[Random.RandomizeBetween(0, event.options.length - 1, false)];
            }
        }
        str += "\n";
        return str;
    }
    function MainHandle(str, init, events, category) {
        for (const [eventName, options] of Object.entries(events)) {
            if (config_1.Config.ignoredEvents.includes(`${category}.${eventName}`))
                continue;
            str = Start(str, init, category);
            str += eventName;
            str += ` ${GetRandomChance()}`;
            str = End(str);
            for (let i = 0; i < options.length; i++) {
                const event = options[i];
                str = HandleOptions(str, event);
            }
        }
        return str;
    }
    function Player(str, init) {
        return MainHandle(str, init, PlayerEvents, "player");
    }
    Events.Player = Player;
    function Platform(str, init) {
        return MainHandle(str, init, PlatformEvents, "platform");
    }
    Events.Platform = Platform;
    function Global(str, init) {
        return MainHandle(str, init, GlobalEvents, "global");
    }
    Events.Global = Global;
    function General(str) {
        str += "[general]\n";
        const general = GeneralEvents["general"];
        for (let i = 0; i < general.length; i++) {
            const event = general[i];
            if (config_1.Config.ignoredEvents.includes(`general.${event.param.name}`))
                continue;
            str = HandleOptions(str, event);
        }
        return str;
    }
    Events.General = General;
})(Events || (exports.Events = Events = {}));
