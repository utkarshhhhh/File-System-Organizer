const fs = require("fs");
const path = require("path");

let types = {
    media: ["mp4", "mkv", "mp3", "jpg"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "csv", "xlsx", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "ps", "tex",],
    app: ["exe", "dmg", "pkg", "deb"]
};


function organizeFn(dirPath) {

    let destPath;

    if (dirPath == undefined) {
        console.log("Please Enter a Valid Directory Path");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        // console.log(doesExist);

        if (doesExist == true) {
            destPath = path.join(dirPath, "organized_files")

            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            } else {
                console.log("This Folder already Exists");
            }
        } else {
            console.log("Please Enter a Valid Path");
        }
    }
    organizeHealper(dirPath, destPath)
}

function organizeHealper(src, dest) {
    let childNames = fs.readdirSync(src)
    // console.log(childNames);

    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i])
        let isFile = fs.lstatSync(childAddress).isFile()
        // console.log(childAddress + " " + isFile);

        if (isFile == true) {
            let fileCategory = getCategory(childNames[i])
            console.log(childNames[i] + " belongs to " + fileCategory);

            sendFiles(childAddress, dest, fileCategory)
        }
    }
}


function getCategory(name) {
    let ext = path.extname(name)
    ext = ext.slice(1)
    //console.log(ext);

    for (const type in types) {
        const cTypeArr = types[type];

        for (let i = 0; i < cTypeArr.length; i++) {
            if (ext == cTypeArr[i])
                return type;
        }
    }
    return 'others'
}

function sendFiles(srcFilePath, dest, fileCategory) {
    let catPath = path.join(dest, fileCategory); // category path

    if (fs.existsSync(catPath) == false) {
        fs.mkdirSync(catPath)
    }

    let fileName = path.basename(srcFilePath)
    let destFilePath = path.join(catPath, fileName)

    fs.copyFileSync(srcFilePath, destFilePath)
    fs.unlinkSync(srcFilePath)

    console.log(fileName + " is copied to " + fileCategory);
}


module.exports = {
    organizeKey : organizeFn
}