// const yargs = require('yargs');
const github = require('./github');
// const versionManager = require('./tools/versionManager');
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