const bcrypt = require('bcryptjs');


module.exports = {
    encode: payload => bcrypt.hashSync(payload),
    fMsg: (res, message = '', data = []) => {
        return res.status(200).json({ success: 1, message, data })
    }
}