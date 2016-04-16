# Save Transfer Tool for Hyper Light Drifter

This is a quick command line tool I put together so I could transfer my save game for [Hyper Light Drifter](http://www.heart-machine.com/) between computers.

Normally you can just move save files between computers. Unfortunately, the game uses an encoding scheme prevents copying files by adding a header to the save that is unique to the machine on which it was created.

This is a simple tool that extracts the save data out of a save file and creates a new save file with the unique header from the machine to be transferred to. This leaves the target save file's unique header intact and therefore allows the save to be used on the other machine.

## Usage

You need two save files; one from the computer that you want to transfer from (source save), and one from the computer you want to transfer to (target save).

If you don't have a save on the machine you want to transfer to yet, you can simply start a new game and watch the intro. Once the intro is complete the game should auto-save.

Next, you'll need NodeJS installed. I'm using 4.2.2, but any 4.x version should work.

The save game locations are:

* Windows: `%AppData%\TODO`
* Mac: `/Library/Application Support/com.HeartMachine.HyperLightDrifter/`
* Linux: ???

Once you have both save files on the same machine, open a terminal/command window, install this tool, and use it to create your new save.

````
$ npm install https://github.com/Justin-Credible/hld-save-transfer
$ cd hld-save-transfer
$ node ./bin/hld-save-transfer <source> <target> <output>
````

Three parameters are required, all are file paths. The **source** is the save from the machine that contains the data you want to transfer. **Target** is the save from the machine that you want to transfer to. And **output** is the path to where the newly built save file will be written.

Once you've created your new save you can copy it to the save location on your target machine and start the game. If everything worked you'll save your save data in the Load Game menu.

## Supported Platforms

The tool should work on Windows, Mac, and Linux. My specific use case was moving my save from my Windows machine to my Mac laptop.

## Save Format

The save file format is JSON prepended with a unique header and then Base-64 encoded.

The tool works like this:

1. Open save with the data to be transferred (source save)
2. Base-64 Decode the file
3. Extract the JSON data
4. Open the save from the machine to be transferred to (target save)
5. Read the header from the target save
6. Combine the header and save data to write a new save file (output save)
