const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const del = require('del');
const extract = require('extract-zip');
const { Console } = require('console');

exports.downloadFile = (url, output) => {
    try {
        const file = fs.createWriteStream(output);
        https.get(url, (response) => {
            response.pipe(file);
        });
        
        return true;
    } catch (error) {
        console.log("Something went wrong downloading the file...");
        return false;
    }
}

exports.renameFile = (from, destination) => {
    fs.rename(from, destination, (err) => {
        if ( err ) console.log('ERROR: ' + err);
    });
}

exports.moveFile = (source, destination) => new Promise((resolve, reject) => {
    if (!fs.existsSync(source)) { return; }
    fs.copyFile(source, destination, async () => {
        fs.unlink(source, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
})


exports.unzip = async (source, destination) => {
    await extract(source, {dir: path.join(process.cwd(), destination)}, () => {
        console.log("Something went wrong during unpacking...");
    })
    // fs.createReadStream(source).pipe(unzip.Extract({ path: destination }));
}
exports.unzipToTemp = async (source) => {
    await this.unzip(source, "temp/");
}
exports.deleteTemp = () => {
    // directory path
    const dir = 'temp/';

    // delete directory recursively
    (async () => {
        try {
            await del(dir);
        } catch (err) {
            console.error(`Error while deleting ${dir}.`);
        }
    })();
}

exports.markFilesInDirectory = (dir, mark) => new Promise((resolve, reject) => {
    console.log("marking files in directory...")
    
    // list all files in the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }

        // files object contains all files names
        // log them on console
        files.forEach(file => {
            console.log(path.join(dir,file));
            // console.log("marking...");
            this.moveFile(path.join(dir,file), path.join(dir,file + mark))
            .then(resolve())
            .catch(err => console.log(err));
        });
    });
});


exports.getListOfFilesToUpgrade = () => {
    const dir = "temp/"
    const files = fs.readdirSync(dir);
    return files;
}

exports.markSpecificFiles = (dir, files, mark) => new Promise((resolve, reject) => {
    console.log('--------------- MARGKING FILES');
    let promises = [];
    // // (async () => {
    //     for (file of files) {
    //         promises.push(this.moveFile(path.join(dir,file), path.join(dir,file + mark)));
    //     }
    // // })();
    files.forEach(file => {
        promises.push(this.moveFile(path.join(dir,file), path.join(dir,file + mark)));
    })
    
    Promise.all(promises).then(() => {
        console.log('RESOLVING ----------------------------');
        resolve();
    });
})

exports.removeMarkedFiles = (dir, mark) => {
    let files = fs.readdirSync(dir);

    // this is very important, otherwise it will remove all of the files!!!
    files = files.filter(file => file.endsWith(mark));

    files.forEach(file => {

        const filePath = path.join(dir,file);

        console.log(filePath);

        // delete directory recursively
        (async () => {
            try {
                // await del(filePath);
            } catch (err) {
                console.error(`Error while deleting ${filePath}.`);
            }
        })();

    })

}
exports.moveMarkedFiles = (dir, mark, destination) => new Promise((resolve, reject) => {
    let files = fs.readdirSync(dir);

    console.log('[before] ', files);
    // this is very important, otherwise it will remove all of the files!!!
    files = files.filter(file => file.endsWith(mark));

    console.log('[after] ',files);

    files.forEach(file => {

        const filePath = path.join(dir,file);

        console.log(filePath);

        this.moveFile(filePath, path.join(destination, file))
        .then(resolve())
        .catch(err => console.log(err));

    })

});
exports.unmarkFiles = (dir, mark) => new Promise((resolve, reject) => {
    let files = fs.readdirSync(dir);

    // this is very important, otherwise it will remove all of the files!!!
    files = files.filter(file => file.endsWith(mark));

    let filesNew = files.map(file => file.replace(mark, ""));


    files.forEach((file, index) => {

        const fileNew = filesNew[index];
        const filePath = path.join(dir,file);
        const fileNewPath = path.join(dir,fileNew);



        this.moveFile(filePath, fileNewPath)
        .then(resolve())
        .catch(err => console.log(err));
    })
});

exports.upgradeFromZip = async (zipPath) => {
    
    console.log("Upgrading...");

    console.log("Unpacking files...");
    await this.unzipToTemp(zipPath);
    
    let files;

    this.unzipToTemp(zipPath)
        .then(() => {
            console.log("----- Getting list of files to upgrade...");
            return this.getListOfFilesToUpgrade();
        })
        .then((_files) => {
            files = _files;
            console.log(files);
        })
        .then(() => {
            console.log('[TEMP] start');
            console.log("----- Marking files for upgrade in temp...");
            this.markFilesInDirectory("temp", ".new")
                .then(() => {console.log("MARKED TMP!")})
                .then(() => {
                    console.log('[MAIN] start');
        
                    console.log("----- Marking files for upgrade in main...");
                    console.log(files);
                    this.markSpecificFiles(".", files, ".old")
                        .then(() => {console.log("-----------------",fs.readdirSync("temp"))})
                        .then(() => {console.log("MARKED MAIN!")})
                        .finally(() => {
                            console.log('[MAIN] end');

                        });
        
                })
                .finally(() => {
                    console.log('[TEMP] end');

                });

        })
        
        // .then(() => {
        //     console.log("Moving new files...");
        //     this.moveMarkedFiles("temp", ".new", ".");
        // })
        // .then(() => {
        //     console.log("Unmarking new files...");
        //     this.unmarkFiles(".", ".new");
        // })
        .catch(err => console.log("There was an error during upgrade...", err));


    // console.log("Getting list of files to upgrade...");
    
    // files = this.getListOfFilesToUpgrade();

    // console.log(files);

    // console.log("Marking files for upgrade in temp...");
    // this.markFilesInDirectory("temp", ".new");
    // console.log("Marking files for upgrade in main...");
    // this.markSpecificFiles(".", files, ".old");


    return

    console.log("Moving new files...");
    this.moveMarkedFiles("temp", ".new", ".");
    this.unmarkFiles(".", ".new");

    console.log("Deleting old files...")

    console.log("Deleting temp directory...");
}