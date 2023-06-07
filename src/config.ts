import fs from "fs";

export let Config: config = LoadConfig();

export function LoadConfig(): config {
    const path = "config.json";
    const configFile = fs.readFileSync(path, "utf8");
    return JSON.parse(configFile) as config;
}

export type config = {
    variants: number,
    alwaysEnableEvents: boolean,
    equalVariantWeight: boolean,
    divideMaxValue: number,
    outPath: string,
    ignoredEvents: string[],
    decreasedChanceEvents: string[]
    dataProfile: string,
    seed?: string
}
export const defaultConfig: config = {
    variants: 2,
    alwaysEnableEvents: false,
    equalVariantWeight: false,
    divideMaxValue: 1,
    outPath: "./auto-generated_gamemode.party",
    ignoredEvents: [],
    decreasedChanceEvents: [],
    dataProfile: "",
    seed: undefined
}