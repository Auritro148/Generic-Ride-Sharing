
const jwt =  require("jsonwebtoken");
const pool = require("../config/dbConfig");

async function profileData(req, res) {

    const Header = req.headers.authorization || '';
    const token = Header.split(" ").at(1);

    const payload = jwt.decode(token);
    
    

    const query_val = {
        text: 'SELECT EMAIL,NAME ,AGE FROM TEST WHERE EMAIL = $1',
        values: [payload.id]
    }

    const user = await pool.query(query_val);


    return res.json({
        email: user.rows[0].email,
        name: user.rows[0].name,
        age: user.rows[0].age
    })

}


module.exports = { profileData };