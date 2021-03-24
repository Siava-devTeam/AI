var config = require('../../config');

var userDAO={
    users:null
};

userDAO.injectDB = async function(conn){
    try{
        if (userDAO.users) {
            return
        }

        userDAO.users = await conn.db(config.db.dbName).collection("users");
    }
    catch(e){
        console.log(e.message);
    }
};

/**
 * Finds a user in the `users` collection
 * @param {string} email - The email of the desired user
 * @returns {Object | null} Returns either a single user or nothing
 */
userDAO.getUser =  async function(email) {
    try{
        var userData = await userDAO.users.findOne({ "email": email })
        return({
            'type': 'success',
            'data':userData
        });
    }catch(e){
        return({
            'type': 'error',
            'data':e.message
        });
    }
}


/**
 * Adds a user to the `users` collection
 * @param {UserInfo} userInfo - The information of the user to add
 * @returns {DAOResponse} Returns either a "success" or an "error" Object
 */
 userDAO.addUser = async function(userInfo) {
    try {
        await userDAO.users.insertOne(userInfo);
        return ({ 
            'type': 'success',
            'data': 'Data inserted successfully' 
        });
        
    } catch (e) {
        return({
            'type': 'error',
            'data':e.message
        });
    }
}

/**
 * Given a user's email and an object of new preferences, update that user's data
 * @param {string} email - The email of the user to update.
 * @param {Object} fields - The user's data.
 * @returns {DAOResponse}
 */
 userDAO.updateUser = async function(email, fields) {
    try {

        const updateResponse = await userDAO.users.updateOne(
            { 'email': email },
            { $set: fields },
        );

        if (updateResponse.matchedCount === 0) {
            return({
                'type': 'error',
                'data': 'No user found with that email'
            });
        }

        return({
            'type': 'success',
            'data': updateResponse
        });

    } catch (e) {
        return({
            'type': 'error',
            'data':e.message
        });
    }
};

module.exports = userDAO;