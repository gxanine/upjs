// const yargs = require('yargs');
const github = require('./github');
const versionManager = require('./versionManager');
const config = require('../config');
const log = require('./log');
const fileio = require('./fileIO');



exports.githubGet = (argv) => {


    config.simple = argv['simple'];
    const user = argv['user'];
    const repo = argv['repo'];

    log.debug("github: ");
    log.debug("   user: ", user);
    log.debug("   repo: ", repo);
    log.debug("   link: ", github.getLink(user, repo))


    // Get latest asset links
    //github.getLatestReleaseLink(user, repo);

    // Downlaod the newest version
    
    github.downloadLatestRelease(user, repo)
    .then(() => {
        // if (!result) return;
        // log.log(result);
        return log.info(true);
    })
    .catch(err => log.error(err));


}

exports.githubCheck = (argv) => {

    config.simple = argv['simple'];
    const user = argv['user'];
    const repo = argv['repo'];
    const current = argv['current'];


    github.getLatestReleaseVersion(user, repo)
    .then(( latest ) => {

        if (!latest) return reject("Could not find the latest version...");

        if (!config.simple) {
            log.debug("github: ");
            log.debug("   user: ", user);
            log.debug("   repo: ", repo);
            log.debug("   link: ", github.getLink(user, repo))
            log.debug(`Current: '${current}' Latest: '${latest}'`);
        } else {
            let comaprisonResult = versionManager.comapreVersions(current, latest)
            if (comaprisonResult < 0) // Current is smaller
                log.info(latest)
            else if (comaprisonResult === undefined)
                return;
            else // if versions are the same or the current one is greater
                log.info(false)
        }
    })
    .catch(err => log.error(err));

}

exports.githubFull = (argv) => {

    config.simple = argv['simple'];
    const user = argv['user'];
    const repo = argv['repo'];
    const current = argv['current'];


    github.getLatestReleaseVersion(user, repo)
    .then(( latest ) => {

        if (!latest) return reject("Could not find the latest version...");


        let comaprisonResult = versionManager.comapreVersions(current, latest)
        if (comaprisonResult < 0) // Current is smaller
        {

            console.log("true");
            return true;

        }
        else // if versions are the same or the current one is greater
        {
            console.log("false");
            reject(false);

        }
    })
    .then(() => {
        return github.downloadLatestRelease(user, repo)
    })
    .then (() => {
        return fileio.deleteTemp()
    })
    .then(() => {
        return fileio.upgradeFromZip("upgrade.upjs");
    })
    .then(() => {
        log.debug();
        log.debug("☑ Files upgraded successfully!");
    })
    .then(() => {
        return fileio.delete("upgrade.upjs");
    })
    .catch(err => log.error(err));

}

exports.clear = () => {
    fileio.deleteTemp();
}

exports.upgrade = (argv) => {
        
    config.simple = argv['simple'];
        
    fileio.deleteTemp()
    .then(() => {
        return fileio.upgradeFromZip("upgrade.upjs");
    })
    .then(() => {
        log.debug();
        log.debug("☑ Files upgraded successfully!");
    })
    .catch(err => console.log(err));

    

}

exports.remOld = (argv) => {

    fileio.removeMarkedFiles(".", ".old")
        .then(() => log.debug("Old files removed!"))
        .catch(err => {
            if (err === "No files to delete!") return log.debug(err);
            log.error(err)
        });
}