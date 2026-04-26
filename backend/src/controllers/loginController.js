
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { updateLastLogin } = require('../services/adminService');


const handleLogin = async (req, res) => {

    const {email, password} = req.body;
    
    if(!email || !password){

        return res.status(400).json({'message':'Username and password required'});

    }
    
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401);

    // isActive only applies to Admin discriminator
    if (foundUser.type === 'Admin' && !foundUser.isActive) {
        return res.status(403).json({ message: 'Account is deactivated' });
    }
    //evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if(!match) return res.sendStatus(401)  //UnAuthorized

    const roles = foundUser.type;
    
    //create jwt
    const accessToken = jwt.sign(
        {
            "UserInfo" : {
                "id" : foundUser._id,
                "email" : foundUser.email,
                "roles" : roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1d'}
    );

    const refreshToken = jwt.sign(
        {"id" : foundUser._id, "email" : foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'5d'}
    );
        // saving the refreshtoken
   foundUser.refreshToken = refreshToken;
   await foundUser.save();

   if (foundUser.type === 'Admin') await updateLastLogin(foundUser._id);

   res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true });
   res.json({ accessToken, user: foundUser, roles });
}

module.exports = {handleLogin}