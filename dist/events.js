"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = exports.GetRandomChance = void 0;
const player_json_1 = __importDefault(require("./Data/player.json"));
const platform_json_1 = __importDefault(require("./Data/platform.json"));
const global_json_1 = __importDefault(require("./Data/global.json"));
const general_json_1 = __importDefault(require("./Data/general.json"));
const meta_json_1 = __importDefault(require("./Data/meta.json"));
const config_1 = require("./config");
function RandomizeBetween(min, max, decimal, divide = false) {
    let divideBy = 1;
    if (divide)
        divideBy = config_1.Config.divideMaxValue;
    if (!decimal)
        return Math.floor(Math.random() * ((max / divideBy) - min + 1) + min);
    else
        return Math.random() * ((max / divideBy) - min) + min;
}
function RandomizeBoolean() {
    return RandomizeBetween(0, 1, false) === 1;
}
function RandomizeOptions(optionsData) {
    const randomAmount = RandomizeBetween(0, optionsData.options.length - 1, optionsData.decimal);
    let out = "";
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
function GetRandomChance() {
    return RandomizeBetween(meta_json_1.default.chanceRange[0], meta_json_1.default.chanceRange[1], false);
}
exports.GetRandomChance = GetRandomChance;
var Events;
(function (Events) {
    function PlayerEvents(stringIn, initial = false) {
        for (const [eventName, options] of Object.entries(player_json_1.default)) {
            //Event Title
            stringIn += "[";
            if (!RandomizeBoolean() && !config_1.Config.alwaysEnableEvents) { //Enabled or disabled
                stringIn += "!";
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
    Events.PlayerEvents = PlayerEvents;
    function PlatformEvents(stringIn, initial = false) {
        for (const [eventName, options] of Object.entries(platform_json_1.default)) {
            //Event Title
            stringIn += "[";
            if (!RandomizeBoolean() && !config_1.Config.alwaysEnableEvents) { //Enabled or disabled
                stringIn += "!";
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
    Events.PlatformEvents = PlatformEvents;
    function GlobalEvents(stringIn, initial = false) {
        for (const [eventName, options] of Object.entries(global_json_1.default)) {
            //Event Title
            stringIn += "[";
            if (!RandomizeBoolean() && !config_1.Config.alwaysEnableEvents) { //Enabled or disabled
                stringIn += "!";
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
    Events.GlobalEvents = GlobalEvents;
    function GeneralEvents(stringIn) {
        stringIn += "[general]\n";
        for (const [eventName, options] of Object.entries(general_json_1.default)) {
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
    Events.GeneralEvents = GeneralEvents;
})(Events || (exports.Events = Events = {}));
