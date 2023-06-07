"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const events_1 = require("./events");
const Random_1 = require("./Random");
events_1.Events.LoadMango();
const Seed = Random_1.Random.GetStringSeed(config_1.Config.seed, 16);
function AddDataVersionNumber(string) {
    return string += "#0\n";
}
function AddInfo(string) {
    string += "[info]\n";
    const info = events_1.Events.GetInfo();
    string += `name "${info.name} ${Seed}"\n`;
    string += `desc "${info.desc}"\n`;
    return string;
}
function AddVariants(string) {
    for (let i = 0; i < config_1.Config.variants; i++) {
        string += `{"Variant ${i + 1}", "<Insert Description Here>"${config_1.Config.equalVariantWeight ? "" : `, ${events_1.Events.GetRandomChance()}`}}\n`;
        string = AddEvents(string, false);
        string = AddEvents(string, true);
        string = events_1.Events.General(string);
    }
    return string;
}
function AddEvents(string, initial) {
    string = events_1.Events.Player(string, initial);
    string = events_1.Events.Platform(string, initial);
    string = events_1.Events.Global(string, initial);
    return string;
}
function GetFullPartyFile() {
    let output = "";
    output = AddDataVersionNumber(output);
    output = AddEvents(output, false);
    output = events_1.Events.General(output);
    output = AddInfo(output);
    output = AddVariants(output);
    return output;
}
const output = GetFullPartyFile();
fs_1.default.writeFileSync(config_1.Config.outPath, output);
