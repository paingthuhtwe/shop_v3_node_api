const joi = require("joi");

module.exports = {
  PermitSchema: {
    add: joi.object({
      name: joi.string().required(),
    }),
  },
  AllSchema: {
    id: joi.object({
      id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
    image: joi.object({
      image: joi.object().required(),
    }),
  },
  RoleSchema: {
    add: joi.object({
      name: joi.string().required(),
    }),
    addPermit: joi.object({
      role_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      permit_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
  },
  UserSchema: {
    register: joi.object({
      name: joi.string().min(5).required(),
      email: joi.string().email().required(),
      phone: joi.string().min(7).max(18).required(),
      password: joi.string().min(8).max(12).required(),
    }),
    login: joi.object({
      phone: joi.string().min(7).max(18).required(),
      password: joi.string().min(8).max(12).required(),
    }),
    addRole: joi.object({
      user_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      role_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
    removeRole: joi.object({
      user_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      role_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
    addPermit: joi.object({
      user_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      permit_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
    removePermit: joi.object({
      user_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      permit_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
  },
  CategorySchema: {
    add: joi.object({
      name: joi.string().required(),
      image: joi.string().required(),
    }),
    addSub: joi.object({
      category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      sub_category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
    removeSub: joi.object({
      category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      sub_category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
  },
  SubCategorySchema: {
    add: joi.object({
      name: joi.string().required(),
      image: joi.string().required(),
      category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
    addChild: joi.object({
      sub_category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      child_category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
    removeChild: joi.object({
      sub_category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
      child_category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
  },
  ChildCategorySchema: {
    add: joi.object({
      name: joi.string().required(),
      image: joi.string().required(),
      sub_category_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
  },
  TagSchema: {
    add: joi.object({
      name: joi.string().required(),
      image: joi.string().required(),
    }),
  },
  DeliverySchema: {
    add: joi.object({
      name: joi.string().required(),
      price: joi.number().min(0).required(),
      duration: joi.string().required(),
      image: joi.string().required(),
      remark: joi.allow(null),
    }),
  },
  WarrantySchema: {
    add: joi.object({
      name: joi.string().required(),
      image: joi.string().required(),
      remark: joi.allow(null),
    }),
  },
  ProductSchema: {
    add: joi.object({
      name: joi.string().required(),
      price: joi.number().min(0).required(),
      images: joi.array().items(joi.string().required()),
      brand: joi.string().required(),
      category: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(''),
      sub_category: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(''),
      child_category: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(''),
      tag: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(''),
      discount: joi.number().min(0).allow(''),
      features: joi.string().required(),
      description: joi.string().required(),
      detail: joi.string().required(),
      stock: joi.number().min(0).allow(''),
      deliveries: joi.string().required(),
      warranties: joi.string().required(),
      colors: joi.string().required(),
      size: joi.string().required(),
      rating: joi.string().allow(''),
    }),
  },
};
