const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const del = require('del');
const extract = require('extract-zip');
const log = require('./log');

exports.downloadFile = (url, output) => new Promise((resolve, reject) => {

    const file = fs.createWriteStream(output);
    https.get(url, (response) => {

        let len = parseInt(response.headers['content-length'], 10);
        let cur = 0;
        let total = len / 1048576; //1048576 - bytes in  1Megabyte

        response.pipe(file);
        file.on('finish', () => {
            console.log();
            file.close(() => resolve());  // close() is async, call cb after close completes.
        });

        // response.on('data', (data) => {
        //     console.log("ahavavavvwad");
        // });

        response.on("data", function(chunk) {
            cur += chunk.length;
            log.progress("Downloading:",(100.0 * cur / len).toFixed(2));
            // console.log("Downloading " + (100.0 * cur / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb " + "Total size: " + total.toFixed(2) + " mb");
        });
    }).on('error', (err) => { // Handle errors
        fs.unlink(output); // Delete the file async. (But we don't check the result)
        reject(err)
    });

})

exports.renameFile = (from, destination) => {
    fs.rename(from, destination, (err) => {
        if ( err ) log.error('ERROR: ' + err);
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

exports.renameFile = (source, destination) => new Promise((resolve, reject) => {
    if (!fs.existsSync(source)) { return reject(`File '${source}' dose not exist!`); }
    fs.rename(source, destination, (err) => {
        if (err)
        reject(err);
        else
            resolve();
    });
})


exports.unzip = (source, destination) => new Promise((resolve, reject) => {
    extract(source, {dir: path.join(process.cwd(), destination)})
    .then(() => resolve())
    .catch((err) => {
        log.error("Something went wrong during unpacking...");
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
            promises.push(this.renameFile(path.join(dir,file), path.join(dir,file + mark)));
        })

        Promise.all(promises).then(() => {
            resolve();
        })
        .catch(err => log.error(err));

    });
});


exports.getListOfFilesToUpgrade = () => new Promise((resolve, reject) => {
    const dir = "temp/"
    fs.readdir(dir, (err,files) => err != null ? reject(err) : resolve(files));

})

exports.markSpecificFiles = (dir, files, mark) => new Promise((resolve, reject) => {
    
    let promises = [];
    files.forEach(file => {
        promises.push(this.renameFile(path.join(dir,file), path.join(dir,file + mark)));
    })

    Promise.all(promises).then((err) => {
        resolve();
    })
    .catch(err => log.error(err));
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
    .catch(err => log.error(err));

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

        promises.push(this.renameFile(filePath, fileNewPath));
    })

    Promise.all(promises).then(() => {
        resolve();
    })
    .catch(err => log.error(err));

    
});

exports.upgradeFromZip =  (zipPath) => {

    return new Promise((resolve, reject) => {
        
        let files;

        this.unzipToTemp(zipPath)
            .then(() => {
                log.debug("☑ Unzipping...")
                return this.getListOfFilesToUpgrade()
            })
            .then((_files) => {
                files = _files
                log.debug("☑ Getting list of files to upgrade...");
                return this.markFilesInDirectory("temp", ".new")
            })
            .then(() => {
                log.debug("☑ Marking files for upgrade in temp...");
                return this.markSpecificFiles(".", files, ".old")
            })
            .then(() => {
                log.debug("☑ Marking files for upgrade in main...");
                return this.moveMarkedFiles("temp", ".new", ".");
            })
            .then(() => {
                log.debug("☑ Moving new files...");
                return this.unmarkFiles(".", ".new");
            })
            .then(() => {
                log.debug("☑ Unmarking new files...");
                return this.deleteTemp();
            })
            .then(() => {
                log.debug("☑ Temp deleted...");
                resolve();
            })
            .catch(err => reject(`There was an error during upgrade... ${err}`));

            /* NOTE: 
                    *.old files should not be deleted from this process. 
                    They should be delted from within of the process calling updater-js

            */
    })
    
    
}