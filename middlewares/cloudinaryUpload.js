const multer = require('multer');
const Datauri = require('datauri');
const path = require('path');

const storage = multer.memoryStorage();
const multerUploads = multer({ storage });
const dUri = new Datauri();
const uri = req => {
    let uriArray = [];
    let a = [];
    for (let index = 0; index < req.files.length; index++) {
        a.push(dUri.format(path.extname(req.files[index].originalname).toString(), req.files[index].buffer).content);
    }
    return a;
};

module.exports = {
    multerUploads,
    uri
};
