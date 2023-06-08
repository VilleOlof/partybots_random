import fs from "fs";
import { Config } from './config';
import { Events } from './events';
import { Random } from './Random';

/**
 * (multiple values are separated by commas)
 * Party gamemode file structure:
 * #{data version}
 * [eventcategory.event chance]
 * eventoption eventvalues...
 * ...
 * [general]
 * generaloption generalvalues... 
 * ...
 * [info]
 * name "name"
 * desc "description"
 * {variantname, variantdesc, variantchance}
 * [eventcategory.event chance]
 * eventoption eventvalues...
 * ...
 * [?eventcategory.event chance] (initial events have ? at start)
 * eventoption eventvalues...
 * ...
 * [general]
 * generaloption generalvalues... 
 * ...
 */

Events.Load();
const Seed = Random.GetStringSeed(Config.seed, 16);

function AddDataVersionNumber(string: string): string {
    return string += "#0\n"; 
}

function AddInfo(string: string): string {
    string += "[info]\n";

    const info = Events.GetInfo();

    string += `name "${info.name}"\n`;
    string += `desc "${info.desc} (${Seed})"\n`;

    return string;
}

function AddVariants(string: string): string {
    for (let i = 0; i < Config.variants; i++) {
        string += `{"Variant ${i+1}", "Seed: ${Seed}"${Config.equalVariantWeight ? "" : `, ${Events.GetRandomChance()}`}}\n`;

        string = AddEvents(string, false);
        string = AddEvents(string, true);
        string = Events.General(string);
    }

    return string;
}

function AddEvents(string: string, initial: boolean): string {
    string = Events.Player(string, initial);
    string = Events.Platform(string, initial);
    string = Events.Global(string, initial);
    return string;
}

function GetFullPartyFile(): string {
    let output = "";
    output = AddDataVersionNumber(output);
    output = AddEvents(output, false);
    output = Events.General(output);
    output = AddInfo(output);
    output = AddVariants(output);

    return output;
}

const output = GetFullPartyFile();
fs.writeFileSync(Config.outPath, output);