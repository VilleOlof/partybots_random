"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = exports.LoadConfig = exports.Config = void 0;
const fs_1 = __importDefault(require("fs"));
exports.Config = LoadConfig();
function LoadConfig() {
    const path = "config.json";
    const configFile = fs_1.default.readFileSync(path, "utf8");
    return JSON.parse(configFile);
}
exports.LoadConfig = LoadConfig;
exports.defaultConfig = {
    variants: 2,
    alwaysEnableEvents: false,
    equalVariantWeight: false,
    divideMaxValue: 1,
    outPath: "./auto-generated_gamemode.party"
};
