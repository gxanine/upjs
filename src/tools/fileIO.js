const https = require('follow-redirects').https;
const fs = require('fs');

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