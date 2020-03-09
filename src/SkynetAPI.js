const axios = require('axios');
const FormData = require('form-data')

const DefaultUploadOptions = {
    portalUrl: "https://siasky.net",
    portalUploadPath: "/skynet/skyfile",
    portalFileFieldname: "file",
    customFilename: "file.txt",
}
function generateUUID() {
    let uuid = ''
    const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        uuid += cs.charAt(Math.floor(Math.random() * cs.length));
    }
    return uuid;
}
function trimSiaPrefix(str) {
    return str.replace("sia://", "")
}

function trimTrailingSlash(str) {
    return str.replace(/\/$/, "");
}

class SkynetAPI {
    constructor(url) {
        this.url = url
    }
    upload(data) {
        const formData = new FormData();
        formData.append("file", data.toString("base64"), {
            filename: "file.txt"
        });
        const uuid = generateUUID();
        const url = `${trimTrailingSlash(this.url)}${trimTrailingSlash(DefaultUploadOptions.portalUploadPath)}/${uuid}`

        return new Promise((resolve, reject) => {
            axios.post(url, formData, { headers: formData.getHeaders() })
                .then(resp => {
                    resolve(`sia://${resp.data.skylink}`)
                }).catch(error => {
                    reject(error)
                })
        })
    }
    download(skylink) {
        const url = `${trimTrailingSlash(this.url)}/${trimSiaPrefix(skylink)}`

        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(response => {
                    resolve(new Buffer(response.data, "base64"))
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}
module.exports = SkynetAPI;