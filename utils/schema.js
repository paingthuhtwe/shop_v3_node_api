const joi = require('joi');

module.exports = {
    PermitSchema: {
        add: joi.object({
            name: joi.string().required()
        })
    },
    AllSchema: {
        id: joi.object({
            id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    RoleSchema: {
        add: joi.object({
            name: joi.string().required()
        }),
        addPermit: joi.object({
            role_id: joi.string().regex(/^[0-9a-fA-F]{24}$/),
            permit_id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    UserSchema: {
        register: joi.object({
            name: joi.string().min(5).required(),
            email: joi.string().email().required(),
            phone: joi.string().min(7).max(18).required(),
            password: joi.string().min(8).max(12).required(),
        })
    },
}