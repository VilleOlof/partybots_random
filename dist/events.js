"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const Mango_1 = require("./Mango");
const Random_1 = require("./Random");
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
        const eventFiles = config_1.Config.dataProfile != "" ? mangoFiles + `/${config_1.Config.dataProfile}` : mangoFiles;
        const playerFile = fs_1.default.readFileSync(`${eventFiles}/player.mango`, "utf8");
        PlayerEvents = Mango_1.Mango.parse(playerFile);
        const platformFile = fs_1.default.readFileSync(`${eventFiles}/platform.mango`, "utf8");
        PlatformEvents = Mango_1.Mango.parse(platformFile);
        const globalFile = fs_1.default.readFileSync(`${eventFiles}/global.mango`, "utf8");
        GlobalEvents = Mango_1.Mango.parse(globalFile);
        const generalFile = fs_1.default.readFileSync(`${eventFiles}/general.mango`, "utf8");
        GeneralEvents = Mango_1.Mango.parse(generalFile);
        const metaFile = fs_1.default.readFileSync(`${mangoFiles}/meta.mango`, "utf8");
        Meta = Mango_1.Mango.parse(metaFile);
        const infoFile = fs_1.default.readFileSync(`${mangoFiles}/info.mango`, "utf8");
        Info = Mango_1.Mango.parse(infoFile);
    }
    Events.LoadMango = LoadMango;
    function GetInfo() {
        return Info;
    }
    Events.GetInfo = GetInfo;
    function Start(str, init, eventCategory) {
        str += "[";
        str += Random_1.Random.RandomizeBoolean() == true && config_1.Config.alwaysEnableEvents ? "" : "!";
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
        const decreased = config_1.Config.decreasedChanceEvents ? 4 : 0;
        return Random_1.Random.RandomizeBetween(Meta.chanceRange[0], Meta.chanceRange[1] - decreased, false);
    }
    Events.GetRandomChance = GetRandomChance;
    function HandleOptions(str, event) {
        str += `${event.param.name} `;
        if (event.param.type == "range") {
            if (event.range == undefined || event.range == undefined || event.decimal == undefined)
                throw new Error("Range option is missing a parameter");
            if (event.single == true) {
                str += `${Random_1.Random.RandomizeBetween(event.range[0], event.range[1], event.decimal)}`;
            }
            else if (event.single == false) {
                let random_one = Random_1.Random.RandomizeBetween(event.range[0], event.range[1], event.decimal);
                let random_two = Random_1.Random.RandomizeBetween(event.range[0], event.range[1], event.decimal);
                if (random_one > random_two) {
                    let temp = random_one;
                    random_one = random_two;
                    random_two = temp;
                }
                str += `${random_one}, ${random_two}`;
            }
        }
        else if (event.param.type == "boolean") {
            str += `${Random_1.Random.RandomizeBoolean()}`;
        }
        else if (event.param.type == "option") {
            if (event.options == undefined || event.nullable == undefined)
                throw new Error("Option event is missing a parameter");
            const randomAmount = Random_1.Random.RandomizeBetween(0, event.options.length - 1, false);
            let gottenAny = false;
            for (let i = 0; i < randomAmount; i++) {
                str += event.options[Random_1.Random.RandomizeBetween(0, event.options.length - 1, false)];
                if (i !== randomAmount - 1) {
                    str += ", ";
                }
                gottenAny = true;
            }
            if (randomAmount == 0 && event.nullable) {
                str += null;
            }
            else if (!gottenAny && !event.nullable) {
                str += event.options[Random_1.Random.RandomizeBetween(0, event.options.length - 1, false)];
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
