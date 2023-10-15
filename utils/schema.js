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
    })
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

};
