// const yargs = require('yargs');
const github = require('./github');
const versionManager = require('./versionManager');
// const fileio = require('./tools/fileIO');



exports.githubGet = (argv) => {


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
    
    github.downloadLatestRelease(user, repo)
    .then(() => {
        // if (!result) return;
        // console.log(result);
        return console.log(true);
    })
    .catch(err => console.error(err));


}

exports.githubCheck = (argv) => {

    const simple = argv['simple'];
    const user = argv['user'];
    const repo = argv['repo'];
    const current = argv['current'];


    github.getLatestReleaseVersion(user, repo)
    .then(( latest ) => {

        if (!latest) return reject("Could not find the latest version...");

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
    })
    .catch(err => console.log(err));

}