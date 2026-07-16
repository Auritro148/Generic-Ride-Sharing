//imports
const pool = require("../config/dbConfig");
const bcrypt = require('bcryptjs');




async function validateLogin(req, res) {

    try {
        const { email, password } = req.body;

        // any code below this line must be moved to a helper function
        const query_val = {
            text: 'SELECT EMAIL ,HASH_KEY FROM TEST WHERE EMAIL = $1',
            values: [email],
        }

        const user = await pool.query(query_val);

        

        // the promise is resolved

        if (user.rowCount == 0) {
            return res.json({
                message: "invalid credentials"
            })
        }


        const isMatch = await bcrypt.compare(password, user.rows[0].hash_key);

  

        if (!isMatch) {
            return res.json({
                message: "invalid credentials"
            }) 
        }



        return res.json({
            message: "logging in ..."
        })


    } catch (err) {

        console.log(err)
        res.status(312).json({
            message: "unsuccess"
        })

    }

}


module.exports = { validateLogin };