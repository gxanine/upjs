const yargs = require('yargs');
const github = require('./tools/github');
const versionManager = require('./tools/versionManager');
const fileio = require('./tools/fileIO');




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
    handler: async (argv) => {

        const simple = argv['simple'];
        const user = argv['user'];
        const repo = argv['repo'];

        if (!simple) {
            console.log("github: ");
            console.log("   user: ", user);
            console.log("   repo: ", repo);
            console.log("   link: ", github.getLink(user, repo))
        }

        // Get latest asset links
        //github.getLatestReleaseLink(user, repo);

        // Downlaod the newest version
        let result = await github.downloadLatestRelease(user, repo);
        if (!result) return;
        console.log(result);
        

    }
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
    handler: async (argv) => {
        const simple = argv['simple'];
        const user = argv['user'];
        const repo = argv['repo'];
        const current = argv['current'];
        
        // Get the newest version
        let latest = await github.getLatestReleaseVersion(user, repo);
        
        // If latest doesn't exists because of error or somthing then return nothing!
        if (!latest) return;

        if (!simple) {
            console.log("github: ");
            console.log("   user: ", user);
            console.log("   repo: ", repo);
            console.log("   current: ", repo);
            console.log("   link: ", github.getLink(user, repo))
            console.log(`Current: '${current}' Latest: '${latest}'`);
        } else {
            let comaprisonResult = versionManager.comapreVersions(current, latest)
            if (comaprisonResult < 0) // Current is smaller
                console.log(latest)
            else if (comaprisonResult === undefined)
                return;
            else // if versions are the same or the current one is greater
                console.log(false)
        }

        // Get latest asset links
        //github.getLatestReleaseLink(user, repo);

        
    }
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
        // fileio.removeOldFiles(".");

        // Get latest asset links
        //github.getLatestReleaseLink(user, repo);
        

    }
});


yargs.parse();

// console.log(yargs.argv);