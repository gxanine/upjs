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


exports.unzip = async (source, destination) => {
    await extract(source, {dir: path.join(process.cwd(), destination)}, () => {
        console.log("Something went wrong during unpacking...");
    })
    // fs.createReadStream(source).pipe(unzip.Extract({ path: destination }));
}
exports.unzipToTemp = async (source) => {
    await this.unzip(source, "temp/");
}
exports.deleteTemp = () => new Promise((resolve, reject) =>{
    // directory path
    const dir = 'temp/';

    // delete directory recursively
    del(dir)
    .then(() => resolve())
    .catch(err => reject(`Error while deleting '${dir}'... ${err}`));
})


exports.markFilesInDirectory = (dir, mark) => new Promise((resolve, reject) => {
    // console.log("marking files in directory...")
    
    // list all files in the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }

        // // files object contains all files names
        // // log them on console
        // files.forEach(file => {
        //     // console.log("marking...");
        //     this.moveFile(path.join(dir,file), path.join(dir,file + mark))
        //     .then(resolve())
        //     .catch(err => console.log(err));
        // });

        let promises = [];
        files.forEach(file => {
            promises.push(this.moveFile(path.join(dir,file), path.join(dir,file + mark)));
        })

        Promise.all(promises).then(() => {
            // console.log('RESOLVING ----------------------------');
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
    // console.log('--------------- MARGKING FILES');
    let promises = [];
    // // (async () => {
    //     for (file of files) {
    //         promises.push(this.moveFile(path.join(dir,file), path.join(dir,file + mark)));
    //     }
    // // })();
    files.forEach(file => {
        promises.push(this.moveFile(path.join(dir,file), path.join(dir,file + mark)));
    })

    Promise.all(promises).then((err) => {
        // console.log('RESOLVING ----------------------------');
        resolve();
    })
    .catch(err => console.log(err));
})

exports.moveMarkedFiles = (dir, mark, destination) => new Promise((resolve, reject) => {
    let files = fs.readdirSync(dir);

    // console.log('[before] ', files);
    // this is very important, otherwise it will remove all of the files!!!
    files = files.filter(file => file.endsWith(mark));

    // console.log('[after] ',files);

    // files.forEach(file => {

    //     const filePath = path.join(dir,file);

    //     console.log(filePath);

    //     this.moveFile(filePath, path.join(destination, file))
    //     .then(resolve())
    //     .catch(err => console.log(err));

    // })

    let promises = [];
    files.forEach(file => {
        const filePath = path.join(dir,file);
        promises.push(this.moveFile(filePath, path.join(destination, file)));
    })

    Promise.all(promises).then(() => {
        // console.log('RESOLVING ----------------------------');
        resolve();
    })
    .catch(err => console.log(err));

});
exports.unmarkFiles = (dir, mark) => new Promise((resolve, reject) => {
    let files = fs.readdirSync(dir);

    // this is very important, otherwise it will remove all of the files!!!
    files = files.filter(file => file.endsWith(mark));

    let filesNew = files.map(file => file.replace(mark, ""));


    // files.forEach((file, index) => {

    //     const fileNew = filesNew[index];
    //     const filePath = path.join(dir,file);
    //     const fileNewPath = path.join(dir,fileNew);



    //     this.moveFile(filePath, fileNewPath)
    //     .then(resolve())
    //     .catch(err => console.log(err));
    // })

    let promises = [];
    files.forEach((file, index) => {
        const fileNew = filesNew[index];
        const filePath = path.join(dir,file);
        const fileNewPath = path.join(dir,fileNew);

        promises.push(this.moveFile(filePath, fileNewPath));
    })

    Promise.all(promises).then(() => {
        // console.log('RESOLVING ----------------------------');
        resolve();
    })
    .catch(err => console.log(err));

    
});
function updatePreviousLogLineTaskStatusLog(msg){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg);
}
exports.upgradeFromZip =  (zipPath) => {

    return new Promise((resolve, reject) => {
        // console.log("Upgrading...");

        // console.log("Unpacking files...");
        // await this.unzipToTemp(zipPath);
        
        let files;

        // console.log("☐ Unzipping...")
        this.unzipToTemp(zipPath)
            .then(() => {
                console.log("☑ Unzipping...")
                // console.log("☐ Getting list of files to upgrade...");
                return this.getListOfFilesToUpgrade()
            })
            .then((_files) => {
                files = _files
                console.log("☑ Getting list of files to upgrade...");

            })
            .then(() => {
                // console.log("☐ Marking files for upgrade in temp...");
                return this.markFilesInDirectory("temp", ".new")
                
            })
            .then(() => {
                console.log("☑ Marking files for upgrade in temp...");
            })
            .then(() => {
                // console.log("----- Marking files for upgrade in main...");
                // console.log(files);
                return this.markSpecificFiles(".", files, ".old")
                
            })
            // .then(() => {console.log("-----------------",fs.readdirSync("temp"))})
            .then(() => {
                // console.log("MARKED MAIN!")
                console.log("☑ Marking files for upgrade in main...");
                // console.log('   ☑ [MAIN]');
                // console.log('   ☑ [TEMP]');
            })
            .then(() => {
                // console.log("Moving new files...");
                return this.moveMarkedFiles("temp", ".new", ".");
            })
            .then(() => {
                console.log("☑ Moving new files...");
            })
            .then(() => {
                // console.log("Unmarking new files...");
                return this.unmarkFiles(".", ".new");
            })
            .then(() => {
                console.log("☑ Unmarking new files...");
            })
            .then(() => {
                return this.deleteTemp();
            })
            .then(() => {
                console.log("☑ Temp deleted...");
            })
            .then(() => {
                resolve();
            })
            .catch(err => reject(`There was an error during upgrade... ${err}`));
            


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
    })
    
    
}