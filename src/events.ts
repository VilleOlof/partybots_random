import fs from "fs";

import player from "./Data/player.json";
import platform from "./Data/platform.json";
import global from "./Data/global.json";
import general from "./Data/general.json";
import meta from "./Data/meta.json";
import { Config } from "./config";

function RandomizeBetween(min: number, max: number, decimal: boolean, divide: boolean = false): number {
    let divideBy = 1
    if (divide) divideBy = Config.divideMaxValue;
    if (!decimal) return Math.floor(Math.random() * ((max / divideBy) - min + 1) + min);
    else return Math.random() * ((max / divideBy) - min) + min;
}

function RandomizeBoolean(): boolean {
    return RandomizeBetween(0, 1, false) === 1;
}

function RandomizeOptions(optionsData: any): string {
    const randomAmount = RandomizeBetween(0, optionsData.options.length - 1, optionsData.decimal);
    let out: string = "";
    for (let i = 0; i < randomAmount; i++) {
        out += optionsData.options[RandomizeBetween(0, optionsData.options.length - 1, optionsData.decimal)];
        if (i !== randomAmount - 1) {
            out += ", ";
        }
    }

    if (out === "" && optionsData.nullable) {
        out += null;
    }
    else if (out === "" && !optionsData.nullable) {
        out += optionsData.options[RandomizeBetween(0, optionsData.options.length - 1, optionsData.decimal)];
    }

    return out;
}

export function GetRandomChance(): number {
    return RandomizeBetween(meta.chanceRange[0], meta.chanceRange[1], false);
}

export namespace Events {

    export function PlayerEvents(stringIn: string, initial: boolean = false): string {
        for (const [eventName, options] of Object.entries(player)) {

            //Event Title
            stringIn += "[";
            if (!RandomizeBoolean() && !Config.alwaysEnableEvents) { //Enabled or disabled
                stringIn += "!"
            }
            stringIn += initial ? "?" : "";
            stringIn += "player.";
            stringIn += `${eventName} ${GetRandomChance()}]\n`;

            //Options
            for (const [optionName, optionData] of Object.entries(options)) {
                stringIn += optionName;
                if (typeof optionData === "boolean") {
                    stringIn += RandomizeBoolean() ? " true" : " false";
                }
                else if (optionData.single) {
                    const randomValue = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true);
                    stringIn += ` ${randomValue}`;
                }
                else if (!optionData.single) {
                    let random_one = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true);
                    let random_two = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true);

                    if (random_two < random_one) {
                        const temp = random_one;
                        random_one = random_two;
                        random_two = temp;
                    }

                    stringIn += ` ${random_one}, ${random_two}`;
                }

                stringIn += "\n";
            }
        }

        return stringIn;
    }

    export function PlatformEvents(stringIn: string, initial: boolean = false): string {
        for (const [eventName, options] of Object.entries(platform)) {
            //Event Title
            stringIn += "[";
            if (!RandomizeBoolean() && !Config.alwaysEnableEvents) { //Enabled or disabled
                stringIn += "!"
            }
            stringIn += initial ? "?" : "";
            stringIn += "platform.";
            stringIn += `${eventName} ${GetRandomChance()}]\n`;

            //Options
            for (const [optionName, optionData] of Object.entries(options)) {
                stringIn += optionName;
                if (typeof optionData === "boolean") {
                    stringIn += RandomizeBoolean() ? " true" : " false";
                } /* @ts-ignore */
                else if (optionData.multipleChoice) { /* @ts-ignore */
                    stringIn += ` ${RandomizeOptions(optionData)}`;
                } /* @ts-ignore */
                else if (optionData.single) { /* @ts-ignore */
                    const randomValue = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true);
                    stringIn += ` ${randomValue}`;
                } /* @ts-ignore */
                else if (!optionData.single) { /* @ts-ignore */
                    let random_one = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true); /* @ts-ignore */
                    let random_two = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true);

                    if (random_two < random_one) {
                        const temp = random_one;
                        random_one = random_two;
                        random_two = temp;
                    }

                    stringIn += ` ${random_one}, ${random_two}`;
                }

                stringIn += "\n";
            }
        }

        return stringIn;
    }

    export function GlobalEvents(stringIn: string, initial: boolean = false): string {
        for (const [eventName, options] of Object.entries(global)) {

            //Event Title
            stringIn += "[";
            if (!RandomizeBoolean() && !Config.alwaysEnableEvents) { //Enabled or disabled
                stringIn += "!"
            }
            stringIn += initial ? "?" : "";
            stringIn += "global.";
            stringIn += `${eventName} ${GetRandomChance()}]\n`;

            //Options
            for (const [optionName, optionData] of Object.entries(options)) {
                stringIn += optionName;
                if (typeof optionData === "boolean") {
                    stringIn += RandomizeBoolean() ? " true" : " false";
                }
                else if (optionData.multipleChoice) {
                    stringIn += ` ${RandomizeOptions(optionData)}`;
                }
                else if (optionData.single) {
                    const randomValue = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true);
                    stringIn += ` ${randomValue}`;
                }
                else if (!optionData.single) {
                    let random_one = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true);
                    let random_two = RandomizeBetween(optionData.range[0], optionData.range[1], optionData.decimal, true);

                    if (random_two < random_one) {
                        const temp = random_one;
                        random_one = random_two;
                        random_two = temp;
                    }

                    stringIn += ` ${random_one}, ${random_two}`;
                }

                stringIn += "\n";
            }
        }

        return stringIn;
    }

    export function GeneralEvents(stringIn: string): string {
        stringIn += "[general]\n";

        for (const [eventName, options] of Object.entries(general)) {
            stringIn += `${eventName} `;

            if (typeof options === "boolean") {
                stringIn += RandomizeBoolean() ? "true" : "false";
            } /* @ts-ignore */
            else if (options.multipleChoice) {
                stringIn += RandomizeOptions(options);
            }
            else { /* @ts-ignore */
                const randomValue = RandomizeBetween(options.range[0], options.range[1], options.decimal);
                stringIn += `${randomValue}`;
            }

            stringIn += "\n";
        }

        return stringIn;
    }
}