const yargs = require('yargs');
const github = require('./tools/github');
const versionManager = require('./tools/versionManager');
const fileio = require('./tools/fileIO');
const commands = require('./tools/commands');


// TODO: Fix app.js to use promises with the rest of files

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
    command: 'unzip',
    describe: 'Unzip test',
    handler: async (argv) => {

        // fileio.unzip("test.zip","tmp/");
        fileio.unzipToTemp("test.zip");
        // Get latest asset links
        //github.getLatestReleaseLink(user, repo);
        

    }
});

yargs.command({
    command: 'clear',
    describe: 'Remove temp',
    handler: async (argv) => {

        // fileio.unzip("test.zip","tmp/");
        fileio.deleteTemp();
        // Get latest asset links
        //github.getLatestReleaseLink(user, repo);
        

    }
});

yargs.command({
    command: 'mark',
    describe: 'Mark files',
    handler: async (argv) => {

        // fileio.unzip("test.zip","tmp/");
        fileio.markFilesInDirectory("temp", ".new");

        // Get latest asset links
        //github.getLatestReleaseLink(user, repo);
        

    }
});

yargs.command({
    command: 'rem-old',
    describe: 'Remove old files',
    handler: async (argv) => {

        // fileio.unzip("test.zip","tmp/");
        fileio.removeMarkedFiles(".", ".old");

        // Get latest asset links
        //github.getLatestReleaseLink(user, repo);
        

    }
});

yargs.command({
    command: 'upgrade',
    describe: 'Upgrade from zip',
    handler: (argv) => {

        // fileio.unzip("test.zip","tmp/");
        fileio.deleteTemp()
        .then(() => {
            return fileio.upgradeFromZip("test.zip");
        })
        .then(() => {
            console.log();
            console.log("☑ Files upgraded successfully!");
        })
        .catch(err => console.log(err));

        // Get latest asset links
        //github.getLatestReleaseLink(user, repo);
        

    }
});


yargs.parse();

// fileio.deleteTemp();
// fileio.upgradeFromZip("test.zip");

// console.log(yargs.argv);