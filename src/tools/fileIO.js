const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const del = require('del');
const extract = require('extract-zip');

exports.downloadFile = (url, output) => new Promise((resolve, reject) => {

    try {
        const file = fs.createWriteStream(output);
        https.get(url, (response) => {
            response.pipe(file);
            resolve();
        });
        
    } catch (error) {
        console.log("Something went wrong downloading the file...");
        reject();
    }

})

exports.renameFile = (from, destination) => {
    fs.rename(from, destination, (err) => {
        if ( err ) console.log('ERROR: ' + err);
    });
}

exports.moveFile = (source, destination) => new Promise((resolve, reject) => {
    if (!fs.existsSync(source)) { return reject(`File '${source}' dose not exist!`); }
    fs.copyFile(source, destination, async () => {
        fs.unlink(source, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
})


exports.unzip = (source, destination) => new Promise((resolve, reject) => {
    extract(source, {dir: path.join(process.cwd(), destination)})
    .then(() => resolve())
    .catch((err) => {
        console.log("Something went wrong during unpacking...");
        reject(err);
    });
})
exports.unzipToTemp = (source) => new Promise((resolve, reject) => {
    this.unzip(source, "temp/")
    .then(() => resolve())
    .catch(err => reject(err));
})
exports.deleteTemp = () => new Promise((resolve, reject) => {
    // directory path
    const dir = 'temp/';

    try {
        del.sync(dir);
        resolve();

    } catch (error) {
        reject(error);
    }

})


exports.markFilesInDirectory = (dir, mark) => new Promise((resolve, reject) => {
    
    // list all files in the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }

        let promises = [];
        files.forEach(file => {
            promises.push(this.moveFile(path.join(dir,file), path.join(dir,file + mark)));
        })

        Promise.all(promises).then(() => {
            resolve();
        })
        .catch(err => console.log(err));

    });
});


exports.getListOfFilesToUpgrade = () => new Promise((resolve, reject) => {
    const dir = "temp/"
    fs.readdir(dir, (err,files) => err != null ? reject(err) : resolve(files));

})

exports.markSpecificFiles = (dir, files, mark) => new Promise((resolve, reject) => {
    
    let promises = [];
    files.forEach(file => {
        promises.push(this.moveFile(path.join(dir,file), path.join(dir,file + mark)));
    })

    Promise.all(promises).then((err) => {
        resolve();
    })
    .catch(err => console.log(err));
})

exports.moveMarkedFiles = (dir, mark, destination) => new Promise((resolve, reject) => {
    let files = fs.readdirSync(dir);

    // this is very important, otherwise it will remove all of the files!!!
    files = files.filter(file => file.endsWith(mark));

    let promises = [];
    files.forEach(file => {
        const filePath = path.join(dir,file);
        promises.push(this.moveFile(filePath, path.join(destination, file)));
    })

    Promise.all(promises).then(() => {
        resolve();
    })
    .catch(err => console.log(err));

});
exports.unmarkFiles = (dir, mark) => new Promise((resolve, reject) => {
    let files = fs.readdirSync(dir);

    // this is very important, otherwise it will remove all of the files!!!
    files = files.filter(file => file.endsWith(mark));

    let filesNew = files.map(file => file.replace(mark, ""));

    let promises = [];
    files.forEach((file, index) => {
        const fileNew = filesNew[index];
        const filePath = path.join(dir,file);
        const fileNewPath = path.join(dir,fileNew);

        promises.push(this.moveFile(filePath, fileNewPath));
    })

    Promise.all(promises).then(() => {
        resolve();
    })
    .catch(err => console.log(err));

    
});

exports.upgradeFromZip =  (zipPath) => {

    return new Promise((resolve, reject) => {
        
        let files;

        this.unzipToTemp(zipPath)
            .then(() => {
                console.log("☑ Unzipping...")
                return this.getListOfFilesToUpgrade()
            })
            .then((_files) => {
                files = _files
                console.log("☑ Getting list of files to upgrade...");
                return this.markFilesInDirectory("temp", ".new")
            })
            .then(() => {
                console.log("☑ Marking files for upgrade in temp...");
                return this.markSpecificFiles(".", files, ".old")
            })
            .then(() => {
                console.log("☑ Marking files for upgrade in main...");
                return this.moveMarkedFiles("temp", ".new", ".");
            })
            .then(() => {
                console.log("☑ Moving new files...");
                return this.unmarkFiles(".", ".new");
            })
            .then(() => {
                console.log("☑ Unmarking new files...");
                return this.deleteTemp();
            })
            .then(() => {
                console.log("☑ Temp deleted...");
                resolve();
            })
            .catch(err => reject(`There was an error during upgrade... ${err}`));

            /* NOTE: 
                    *.old files should not be deleted from this process. 
                    They should be delted from within of the process calling updater-js

            */
    })
    
    
}