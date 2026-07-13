//an instance of the express Router class

const router = require("Express").Router() ;
const userControl = require("../controller/userController");

router.get("/",userControl.getUsers);


