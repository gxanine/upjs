const {Octokit} = require('@octokit/core');
const fileio = require('./fileIO');

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
        console.log('[getAssetId]');
        console.log("ooops... Error: ", error);
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
        console.log('Could not get latest release... ')
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
            console.log('Could not get latest version... ')
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
            let path = getAssetName(releaseJson, assetID);
            return fileio.downloadFile(url,path);
        })
        .then(() => {
            resolve();
        })
        .catch(err => {
            console.log('Could not download latest release... ')
            reject(err);
        });

        //return false;

})

exports.getLink = (user, repo) => {
    return `https://github.com/${user}/${repo}`
}