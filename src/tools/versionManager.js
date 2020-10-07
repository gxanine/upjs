const _compareVersions = require('compare-versions');

exports.comapreVersions = (v1, v2) => {
    let isGreater = undefined;
    
    try
    {
        isGreater = _compareVersions(String(v1), String(v2));

    } catch(error)
    {
        console.log('Error comparing versions... Are you sure you entered the correct version?');
    }

    return isGreater;


}
