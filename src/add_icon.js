const rcedit = require('rcedit');
const exePath = './bin/upjs.exe';
const icoPath = './res/icon.ico';

console.log("Setting the icon...")
rcedit(exePath, {
    icon: icoPath
})
.then(() => {
    console.log("All done!");
})
.catch(err => console.log(err))