# Party Bots Gamemode Randomizer

Randomizes every setting and event (including variants) in a gamemode.  
Gamemode Example: [100 Random Variants](https://steamcommunity.com/sharedfiles/filedetails/?id=2987145105)  

## Install

*Requires Node.JS*  
- Clone Repo  
- Run `install.bat`  

And to generate a new random gamemode, run `generate.bat`  
By default, generated files will be at `auto-generated_gamemode.party`

## Creating Data Profiles

These are a folder with the following files:  
`general.mango`, `global.mango`, `platform.mango`, `player.mango`  
These files control what events exist and their lower and upper bounds.  
See `src/Data/tweaked` for an example.

To create a new profile:
- Create a new subfolder in `src/Data/`  
- Copy the event files from `src/Data/`  
- Edit the files to your liking
- Change the dataProfile in config.mango to the subfolder name

## Config

- Variants: number  
    - The number of variants to generate for the gamemode  
- alwaysEnableEvents: boolean  
    - Whether or not to always enable all events  
    - If disabled, any event will have a 50% chance of being enabled  
- equalVariantWeight: boolean  
    - Whether or not to give all variants an equal chance of being selected  
- divideMaxValue: number  
    - The number to divide the max value by when generating a random number for an event option  
- outPath: string  
    - The path to output the generated gamemode to  
- ignoredEvents: string[]  
    - The events to ignore when generating a gamemode (e.g. `["player.petrify" "general.fluid_height"]`)  
    - If empty, all events will be used  
- decreasedChanceEvents: string[]  
    - The events to decrease the chance of being enabled when generating a gamemode  
- dataProfile: string  
    - The path to the dataprofile to use when generating a gamemode  
    - This is a subfolder in `src/Data/` (see `src/Data/tweaked`)  
- seed: string
    - The seed to use when generating a gamemode  
    - If empty, a random seed will be used