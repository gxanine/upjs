const {Octokit} = require('@octokit/core');
const fileio = require('./fileIO');

const octokit = new Octokit();


const getAssetId = (release) => {

    
    try {
        let assetId = "";

        release['assets'].forEach(element => {
            if (element['name'].includes(".msi"))
            {
                assetId = element['id'];
                return false;
            }
        });;



        if (assetId) {
            return assetId;
        }
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

const getLatestReleaseJson = async (user, repo) => {
    const response = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: user,
        repo: repo
    }).catch(error => console.log('Something went wrong... Did you use the correct user and repo?'));
    
    //console.log(response);
    if (!response) return;
    return response['data'];
}

exports.getLatestReleaseVersion = async (user, repo) => {
    try {
        let releaseJson = await getLatestReleaseJson(user, repo); 
        if (!releaseJson) return;

        return releaseJson['tag_name'];
    } catch (error) {
        console.log('[getLatestReleaseVersion]');
        console.log(error);
    }
}

exports.downloadLatestRelease = async (user, repo) => {
    try {
        let releaseJson = await getLatestReleaseJson(user, repo);
        if (!releaseJson) return;

        let assetID = getAssetId(releaseJson);
        let url = getAssetLink(releaseJson, assetID);
        let path = getAssetName(releaseJson, assetID);
    
    
        // console.log(`ID: '${assetID}', Url: '${url}', Path: '${path}'`);
        
        return fileio.downloadFile(url, path);
    } catch (error) {
        console.log('[downloadLatestRelease]');
        console.log(error);
        return false;
    }
}

exports.getLink = (user, repo) => {
    return `https://github.com/${user}/${repo}`
}