const DB = require("../models/product");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
  try {
    const products = await DB.find().select("-__v");
    Helper.fMsg(res, "All products", products);
  } catch (error) {
    Helper.sendError(500, `Error fetching products: ${error.message}`, next);
  }
};

const add = async (req, res, next) => {
    try {
    const dbProduct = await DB.findOne({ name: req.body.name });
    if (dbProduct) {
      Helper.sendError(409, "Product name is already in use.", next);
      return;
    }
    const { category, sub_category, child_category, features, deliveries, warranties, colors } = req.body;
    req.body.category = category ? category : null;
    req.body.sub_category = sub_category ? sub_category : null;
    req.body.child_category = child_category ? sub_category : null;
    req.body.features = features.split(',');
    req.body.deliveries = deliveries.split(',');
    req.body.warranties = warranties.split(',');
    req.body.colors = colors.split(',');
    const product = await new DB(req.body).save();
    Helper.fMsg(res, "Product added", product);
  } catch (error) {
    Helper.sendError(500, `Error adding product: ${error.message}`, next);
  }

}

module.exports = { all, add };
