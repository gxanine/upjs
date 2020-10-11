const {Octokit} = require('@octokit/core');
const fileio = require('./fileIO');
const log = require('./log');

const octokit = new Octokit();


const getAssetId = (release) => {

    
    try {
        let assetId = "";

        release['assets'].forEach(element => {
            if (element['name'].includes(".zip"))
            {
                assetId = element['id'];
                return false;
            }
        });;


        return assetId;
        
    } catch (error) {
        log.debug('[getAssetId]');
        log.error("Error getting asset id: ", error);
    }

   
}

const getAssetLink = (release, id) => {
    

    let assetLink = "";

    release['assets'].forEach(element => {
        if (element['id'] === id)
        {
            assetLink = element['browser_download_url'];
            return false;
        } 
    });

    if (assetLink) {
        return assetLink;
    }


   
}

const getAssetName = (release, id) => {


    let assetName = "";

    release['assets'].forEach(element => {
        if (element['id'] === id)
        {
            assetName = element['name'];
            return false;
        }
    });;

    if (assetName) {
        return assetName;
    }
    
}

const getLatestReleaseJson = (user, repo) => new Promise((resolve, reject) => {

    octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: user,
        repo: repo
    })
    .then((response) => {
        if (!response) reject();
        resolve(response['data']);
    })
    .catch(err => {
        log.error('Could not get latest release... ')
        if (err.message.toLowerCase() === "not found")
            reject("Repository or release could not be found!")
        reject(err);
    });


})
    


exports.getLatestReleaseVersion = (user, repo) => new Promise((resolve, reject) => {

        getLatestReleaseJson(user, repo)
        .then((releaseJson) => {
            if (!releaseJson) reject();
            resolve(releaseJson['tag_name'])
        }) 
        .catch(err => {
            log.error('Could not get latest version... ')
            reject(err);
        });
    
})

exports.downloadLatestRelease =  (user, repo) => new Promise((resolve, reject) => {

        getLatestReleaseJson(user, repo)
        .then((releaseJson) => {
            if (!releaseJson) reject();

            let assetID = getAssetId(releaseJson);
            if (assetID == '') return reject("Could not find update package...");
            
            let url = getAssetLink(releaseJson, assetID);
            let path = 'upgrade.upjs';//getAssetName(releaseJson, assetID);
            return fileio.downloadFile(url,path);
        })
        .then(() => {
            resolve();
        })
        .catch(err => {
            log.error('Could not download latest release... ')
            reject(err);
        });

        //return false;

})

exports.getLink = (user, repo) => {
    return `https://github.com/${user}/${repo}`
}