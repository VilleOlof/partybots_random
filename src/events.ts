import fs from "fs";
import { Config } from "./config";
import { Mango } from "./Mango";
import { Random } from "./Random";

export namespace Events {

    export type base = {
        name: string,
        type: "range" | "boolean" | "option"
    }

    export type event = {
        range?: [number, number],
        single?: boolean,
        decimal?: boolean,

        options?: string[],
        nullable?: boolean,

        param: base
    }

    export type meta = {
        chanceRange: [number, number]
    }

    export type info = {
        name: string,
        desc: string
    }

    export type eventCategory = "player" | "platform" | "global";

    let PlayerEvents: {[key: string]: event[]} = {};
    let PlatformEvents: {[key: string]: event[]} = {};
    let GlobalEvents: {[key: string]: event[]} = {};
    let GeneralEvents: {[key: string]: event[]} = {};
    
    let Meta: meta = { chanceRange: [0, 0] };
    let Info: info = { name: "", desc: ""};

    const mangoFiles: string = "src/Data";
    export function LoadMango(): void {
        const eventFiles =  Config.dataProfile != "" ? mangoFiles + `/${Config.dataProfile}` : mangoFiles;

        const playerFile = fs.readFileSync(`${eventFiles}/player.mango`, "utf8");
        PlayerEvents = Mango.parse(playerFile);
        
        const platformFile = fs.readFileSync(`${eventFiles}/platform.mango`, "utf8");
        PlatformEvents = Mango.parse(platformFile);

        const globalFile = fs.readFileSync(`${eventFiles}/global.mango`, "utf8");
        GlobalEvents = Mango.parse(globalFile);

        const generalFile = fs.readFileSync(`${eventFiles}/general.mango`, "utf8");
        GeneralEvents = Mango.parse(generalFile);

        const metaFile = fs.readFileSync(`${mangoFiles}/meta.mango`, "utf8");
        Meta = Mango.parse(metaFile);

        const infoFile = fs.readFileSync(`${mangoFiles}/info.mango`, "utf8");
        Info = Mango.parse(infoFile);
    }

    export function GetInfo(): info {
        return Info;
    }

    function Start(str: string, init: boolean, eventCategory: eventCategory): string {
        str += "[";
        str += Random.RandomizeBoolean() == true && Config.alwaysEnableEvents ? "" : "!";
        str += init ? "?" : "";
        str += eventCategory;
        str += ".";
        return str;
    }

    function End(str: string): string {
        str += "]\n";
        return str;
    }

    export function GetRandomChance(): number {
        const decreased: number = Config.decreasedChanceEvents ? 4 : 0;
        return Random.RandomizeBetween(Meta.chanceRange[0], Meta.chanceRange[1] - decreased, false);
    }

    function HandleOptions(str: string, event: event): string {
        str += `${event.param.name} `;

        if (event.param.type == "range") {
            if (event.range == undefined || event.range == undefined || event.decimal == undefined) throw new Error("Range option is missing a parameter");

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
            if (event.options == undefined || event.nullable == undefined) throw new Error("Option event is missing a parameter");

            const randomAmount = Random.RandomizeBetween(0, event.options.length - 1, false);
            let gottenAny: boolean = false;
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

    function MainHandle(str:string, init: boolean, events: {[key: string]: event[]}, category: eventCategory): string {
        for (const [eventName, options] of Object.entries(events)) {
            if (Config.ignoredEvents.includes(`${category}.${eventName}`)) continue;
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

    export function Player(str: string, init: boolean): string {
        return MainHandle(str, init, PlayerEvents, "player");
    }

    export function Platform(str: string, init: boolean): string {
        return MainHandle(str, init, PlatformEvents, "platform");
    }

    export function Global(str: string, init: boolean): string {
        return MainHandle(str, init, GlobalEvents, "global");
    }

    export function General(str: string): string {
        str += "[general]\n";

        const general = GeneralEvents["general"];
        for (let i = 0; i <general.length; i++) {
            const event = general[i];
            if (Config.ignoredEvents.includes(`general.${event.param.name}`)) continue;
            
            str = HandleOptions(str, event);
        }

        return str;
    }
}