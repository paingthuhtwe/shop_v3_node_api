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
    }
}