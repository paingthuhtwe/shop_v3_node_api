const fs = require("fs");

const saveSingleFile = (name, req) => {
  let filename = req.files[name].name;
  filename = new Date().valueOf() + "_" + filename;
  req.files[name].mv(`./uploads/${filename}`);
  req.body[name] = filename;
};

const saveMultipleFile = (name, req) => {
  let filenames = [];
  req.files.images.forEach((image) => {
    const filename = new Date().valueOf() + "_" + image.name;
    filenames.push(filename);
    image.mv(`./uploads/${filename}`);
  });
  req.body[name] = filenames;
};

const deleteFile = (filename) => {
  const filepath = `./uploads/${filename}`;
  fs.existsSync(filepath) && fs.unlinkSync(filepath);
};

const deleteMultipleFile = (filenames) => {
  filenames.forEach((filename) => deleteFile(filename));
};

module.exports = {
  saveSingleFile,
  saveMultipleFile,
  deleteFile,
  deleteMultipleFile,
};
