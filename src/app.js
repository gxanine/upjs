const yargs = require('yargs');
const github = require('./tools/github');
const versionManager = require('./tools/versionManager');
const fileio = require('./tools/fileIO');
const commands = require('./tools/commands');


yargs.command({
    command: 'github-get',
    describe: 'Update the provided software',
    builder: {
        user: {
            alias: 'u',
            describe: "Github Username",
            demandOption: true,
            type: 'string',
        },
        repo: {
            alias: 'r',
            describe: "Github repository link (https)",
            demandOption: true,
            type: 'string',

        },
        name: {
            alias: 'n',
            describe: "Release name (e.g. 'windows.zip')",
            demandOption: false,
            type: 'string'
        },
        simple: {
            alias: 's',
            describe: "Simple output",
            demandOption: false,
            type: 'boolean',

        }
    },
    handler: commands.githubGet
});

yargs.command({
    command: 'github-check',
    describe: 'Check for the latest version',
    builder: {
        user: {
            alias: 'u',
            describe: "Github Username",
            demandOption: true,
            type: 'string',
        },
        repo: {
            alias: 'r',
            describe: "Github repository link (https)",
            demandOption: true,
            type: 'string',

        },
        current: {
            alias: 'c',
            describe: "Current version",
            demandOption: true,
            type: 'string',

        },
        simple: {
            alias: 's',
            describe: "Simple output",
            demandOption: false,
            type: 'boolean',

        }
    },
    handler: commands.githubCheck
});

yargs.command({
    command: 'clear',
    describe: 'Remove temp',
    builder: {
        simple: {
            alias: 's',
            describe: "Simple output",
            demandOption: false,
            type: 'boolean',

        }
    },
    handler: commands.clear
});

yargs.command({
    command: 'rem-old',
    describe: 'Remove old files',
    builder: {
        simple: {
            alias: 's',
            describe: "Simple output",
            demandOption: false,
            type: 'boolean',

        }
    },
    handler: commands.remOld
});

yargs.command({
    command: 'upgrade',
    describe: 'Upgrade from zip',
    builder: {
        simple: {
            alias: 's',
            describe: "Simple output",
            demandOption: false,
            type: 'boolean',

        }
    },
    handler: commands.upgrade
});

yargs.command({
    command: 'github-full',
    describe: 'Check for the latest version',
    builder: {
        user: {
            alias: 'u',
            describe: "Github Username",
            demandOption: true,
            type: 'string',
        },
        repo: {
            alias: 'r',
            describe: "Github repository link (https)",
            demandOption: true,
            type: 'string',

        },
        current: {
            alias: 'c',
            describe: "Current version",
            demandOption: true,
            type: 'string',

        },
        name: {
            alias: 'n',
            describe: "Release name (e.g. 'windows.zip')",
            demandOption: false,
            type: 'string'
        },
        simple: {
            alias: 's',
            describe: "Simple output",
            demandOption: false,
            type: 'boolean',

        }
    },
    handler: commands.githubFull
});


yargs.parse();