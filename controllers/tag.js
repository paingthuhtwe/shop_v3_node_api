const DB = require("../models/tag");
const { saveSingleFile, deleteFile } = require("../utils/file");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
    try {
        const tags = await DB.find().select('-__v');
        Helper.fMsg(res, "All Tags", tags);
    } catch (error) {
        Helper.sendError(500, `Error fetching tags: ${error.message}`, next);
    }
}

const add = async (req, res, next) => {
    try {
        const dbTag = await DB.findOne({ name: req.body.name });
        if (dbTag) {
            Helper.sendError(409, "Tag name is already in use.", next);
            return;
        }
        saveSingleFile('image', req);
        const { name, image } = req.body;
        await new DB({name, image}).save();
        const result = await DB.findOne({ name: req.body.name });
        Helper.fMsg(res, "Tag added successfully.", result);
    } catch (error) {
        Helper.sendError(500, `Error adding tags: ${error.message}`, next);
    }
}

const get = async (req, res, next) => {
    try {
        const tag = await DB.findById(req.params.id).select('-__v');
        Helper.fMsg(res, "Tag", tag);
    } catch (error) {
        Helper.sendError(500, `Error fetching tag: ${error.message}`, next);
    }
}

const drop = async (req, res, next) => {
    try {
        const tag = await DB.findById(req.params.id);
        if (!tag) {
            Helper.sendError(404, "Tag does not exist.", next);
            return;
        }
        await DB.findByIdAndDelete(tag._id);
        deleteFile(tag.image);
        Helper.fMsg(res, "Tag deleted successfully");
    } catch (error) {
        Helper.sendError(500, `Error deleting tag: ${error.message}`, next);
    }
}

const patch = async (req, res, next) => {
    try {
        const tag = await DB.findById(req.params.id);
        if (!tag) {
            Helper.sendError(404, "Tag does not exist.", next);
            return;
        }
        if (
            req.body.name &&
            req.files &&
            req.body.name === tag.name &&
            req.files.image &&
            req.files.image.name === tag.image
          ) {
            Helper.sendError(400, "Sub category is up to date.", next);
            return;
          }
        const updateData = { updated_at: Helper.currentDate() };
        if (req.body.name) {
            updateData['name'] = req.body.name;
        }
        if (req.files && req.files.image) {
            deleteFile(tag.image);
            saveSingleFile('image', req);
            updateData['image'] = req.body.image;
        }
        await DB.findByIdAndUpdate(tag._id, updateData);
        const result = await DB.findById(tag._id);
        Helper.fMsg(res, "Tag updated successfully.", result);
    } catch (error) {
        Helper.sendError(500, `Error updating tag: ${error.message}`, next);
    }
}

module.exports = { all, add, get, drop, patch };