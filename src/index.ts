import { Config } from './config';
import { Events, GetRandomChance } from './events';
import info from './Data/info.json';
import { Mango } from './Mango'
import fs from "fs";

const playerTestMango = fs.readFileSync("src/Data/meta.mango", "utf8");
const mango = Mango.parse(playerTestMango);
console.log(JSON.stringify(mango, null, 4))

function AddDataVersionNumber(string: string): string {
    return string += "#0\n"; 
}

function AddInfo(string: string): string {
    string += "[info]\n";

    string += `name "${info.name}"\n`;
    string += `desc "${info.desc}"\n`;

    return string;
}

function AddVariants(string: string): string {
    for (let i = 0; i < Config.variants; i++) {
        string += `{"Variant ${i+1}", "<Insert Description Here>"${Config.equalVariantWeight ? "" : `, ${GetRandomChance()}`}}\n`;

        string = AddEvents(string, false);
        string = AddEvents(string, true);
        string = Events.GeneralEvents(string);
    }

    return string;
}

function AddEvents(string: string, initial: boolean): string {
    string = Events.PlayerEvents(string, initial);
    string = Events.PlatformEvents(string, initial);
    string = Events.GlobalEvents(string, initial);
    return string;
}

let output = "";
output = AddDataVersionNumber(output);
output = AddEvents(output, false);
output = Events.GeneralEvents(output);
output = AddInfo(output);
output = AddVariants(output);


fs.writeFileSync(Config.outPath, output);