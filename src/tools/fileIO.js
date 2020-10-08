const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');
const del = require('del');
const extract = require('extract-zip');

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

exports.moveFile = (source, destination) => {
    fs.copyFile(source, destination, () => {
        fs.unlink(source, () => {});
    });
}

exports.unzip = (source, destination) => {
    extract(source, {dir: path.join(process.cwd(), destination)}, () => {
        console.log("Something went wrong during unpacking...");
    })
    // fs.createReadStream(source).pipe(unzip.Extract({ path: destination }));
}
exports.unzipToTemp = (source) => {
    this.unzip(source, "temp/");
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

exports.markFilesInDirectory = (dir, mark) => {
    
    // list all files in the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }

        // files object contains all files names
        // log them on console
        files.forEach(file => {
            console.log(path.join(dir,file));
            this.moveFile(path.join(dir,file), path.join(dir,file + mark));
        });
    });
}

const getListOfFilesToUpgrade = () => {
    const dir = "temp/"
    const files = fs.readdirSync(dir);
    return files;
}

exports.markSpecificFiles = (dir, files, mark) => {
    files.forEach(file => {
        this.moveFile(path.join(dir,file), path.join(dir,file + mark));
    })
}
exports.removeOldFiles = (dir) => {
    const files = fs.readdirSync(dir);

    files.forEach(file => {

        const filePath = path.join(dir,file);

        console.log(filePath);

        // delete directory recursively
        (async () => {
            try {
                await del(filePath);
            } catch (err) {
                console.error(`Error while deleting ${filePath}.`);
            }
        })();

    })

}