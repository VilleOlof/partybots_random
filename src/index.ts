import { Config } from './config';
import { Events } from './events';
import { Mango } from './Mango';
import fs from "fs";

Events.LoadMango();

function AddDataVersionNumber(string: string): string {
    return string += "#0\n"; 
}

function AddInfo(string: string): string {
    string += "[info]\n";

    const infoFile = fs.readFileSync("src/Data/info.mango", "utf8");
    const info = Mango.parse(infoFile) as Events.info;

    string += `name "${info.name}"\n`;
    string += `desc "${info.desc}"\n`;

    return string;
}

function AddVariants(string: string): string {
    for (let i = 0; i < Config.variants; i++) {
        string += `{"Variant ${i+1}", "<Insert Description Here>"${Config.equalVariantWeight ? "" : `, ${Events.GetRandomChance()}`}}\n`;

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

let output = "";
output = AddDataVersionNumber(output);
output = AddEvents(output, false);
output = Events.General(output);
output = AddInfo(output);
output = AddVariants(output);


fs.writeFileSync(Config.outPath, output);