"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const events_1 = require("./events");
const info_json_1 = __importDefault(require("./Data/info.json"));
const Mango_1 = require("./Mango");
const fs_1 = __importDefault(require("fs"));
const playerTestMango = fs_1.default.readFileSync("src/Data/meta.mango", "utf8");
const mango = Mango_1.Mango.parse(playerTestMango);
console.log(JSON.stringify(mango, null, 4));
function AddDataVersionNumber(string) {
    return string += "#0\n";
}
function AddInfo(string) {
    string += "[info]\n";
    string += `name "${info_json_1.default.name}"\n`;
    string += `desc "${info_json_1.default.desc}"\n`;
    return string;
}
function AddVariants(string) {
    for (let i = 0; i < config_1.Config.variants; i++) {
        string += `{"Variant ${i + 1}", "<Insert Description Here>"${config_1.Config.equalVariantWeight ? "" : `, ${(0, events_1.GetRandomChance)()}`}}\n`;
        string = AddEvents(string, false);
        string = AddEvents(string, true);
        string = events_1.Events.GeneralEvents(string);
    }
    return string;
}
function AddEvents(string, initial) {
    string = events_1.Events.PlayerEvents(string, initial);
    string = events_1.Events.PlatformEvents(string, initial);
    string = events_1.Events.GlobalEvents(string, initial);
    return string;
}
let output = "";
output = AddDataVersionNumber(output);
output = AddEvents(output, false);
output = events_1.Events.GeneralEvents(output);
output = AddInfo(output);
output = AddVariants(output);
fs_1.default.writeFileSync(config_1.Config.outPath, output);
