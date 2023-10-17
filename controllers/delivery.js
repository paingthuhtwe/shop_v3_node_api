const DB = require("../models/delivery");
const { saveSingleFile, deleteFile } = require("../utils/file");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
    try {
        const deliveries = await DB.find().select("-__v");
        Helper.fMsg(res, "All deliveries", deliveries);
    } catch (error) {
        Helper.sendError(500, `Error fetching deliveries: ${error.message}`, next);
    }
}

const add = async (req, res, next) => {
    try {
        const dbDelivery = await DB.findOne({name: req.body.name});
        if (dbDelivery) {
            Helper.sendError(409, "Delivery name is already in use.", next);
            return;
        }
        saveSingleFile('image', req);
        await new DB(req.body).save();
        const result = await DB.findOne({name: req.body.name});
        Helper.fMsg(res, "Delivery added successfully.", result);
    } catch (error) {
        Helper.sendError(500, `Error adding delivery: ${error.message}`, next);
    }
}

const get = async (req, res, next) => {
    try {
        const delivery = await DB.findById(req.params.id).select("-__v");
        if (!delivery) {
            Helper.sendError(404, 'Delivery does not exist.', next);
            return;
        }
        Helper.fMsg(res, `Delivery for id - ${req.params.id}`, delivery);
    } catch (error) {
        Helper.sendError(500, `Error fetching delivery: ${error.message}`, next);
    }
}

const patch = async (req, res, next) => {
    try {
        const dbDelivery = await DB.findById(req.params.id);
        if (!dbDelivery) {
            Helper.sendError(404, 'Delivery does not exist.', next);
            return;
        }
        const updatedData = {
            updated_at: Helper.currentDate()
        }
        if (req.body.name) updatedData['name'] = req.body.name;
        if (req.body.price) {
            if (req.body.price < 0) {
                Helper.sendError(400, "Price must be greater than or equal to zero.", next);
                return;
            }
            updatedData['price'] = req.body.price;
        }   
        if (req.body.duration) updatedData['duration'] = req.body.duration;
        if (req.files && req.files.image) {
            saveSingleFile('image', req);
            deleteFile(dbDelivery.image);
            updatedData['image'] = req.body.image;   
        }
        if (req.body.remark) updatedData['remark'] = req.body.remark;
        const { name, price, duration, image, remark } = req.body;
        if (!name && !price && !duration && !image && !remark) {
            Helper.fMsg(res, "Provide data to update.");
            return;
        } 
        await DB.findByIdAndUpdate(dbDelivery._id, updatedData);
        const result = await DB.findById(dbDelivery._id).select("-__v");
        Helper.fMsg(res, "Delivery updated successfully.", result); 
    } catch (error) {
        Helper.sendError(500, `Error updating delivery: ${error.message}`, next);
    }  
}

const drop = async (req, res, next) => {
    try {
        const delivery = await DB.findById(req.params.id);
        if (!delivery) {
            Helper.sendError(404, 'Delivery does not exist.', next);
            return;
        }
        await DB.findByIdAndDelete(delivery._id);
        Helper.fMsg(res, "Delivery deleted successfully.");
    } catch (error) {
        Helper.sendError(500, `Error deleting delivery: ${error.message}`, next);
    }
}

module.exports = { all, add, get, drop, patch };