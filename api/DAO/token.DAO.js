var config = require('../../config');

var tokenDAO={
    tokens:null
};

tokenDAO.injectDB = async function(conn){
    try{
        if (tokenDAO.tokens) {
            return
        }
        
        tokenDAO.tokens = await conn.db(config.db.dbName).collection("tokens");
    }
    catch(e){
        console.log(e.message);
    }
};

/**
 * Finds a token in the `tokens` collection
 * @param {string} email - The email of the desired token
 * @returns {Object | null} Returns either a single token or nothing
 */
tokenDAO.getTokenByEmail =  async function(email) {
    try{
        var tokenData = await tokenDAO.tokens.findOne({ "email": email });
        return({
            'type': 'success',
            'data':tokenData
        });
    }catch(e){
        return({
            'type': 'error',
            'data':e.message
        });
    }
}

/**
 * Finds a token in the `tokens` collection
 * @param {string} token - The token of the desired token
 * @returns {Object | null} Returns either a single token or nothing
 */
 tokenDAO.getTokenByToken =  async function(token) {
    try{
        var tokenData = await tokenDAO.tokens.findOne({ "token": token });
        return({
            'type': 'success',
            'data':tokenData
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
 * @param {TokenInfo} userInfo - The information of the user to add
 * @returns {DAOResponse} Returns either a "success" or an "error" Object
 */
 tokenDAO.addToken = async function(tokenInfo) {
    try {
        await tokenDAO.tokens.insertOne(tokenInfo);
        return ({ 
            'type': 'success',
            'data': 'Token inserted successfully' 
        });
        
    } catch (e) {
        return({
            'type': 'error',
            'data':e.message
        });
    }
}


/**
   * Removes a token from token collection
   * @param {string} email - The email of the user to for deleting tokens
   * @returns {DAOResponse} Returns either a "success" or an "error" Object
   */
tokenDAO.deleteToken = async function(token) {
    try {

      await tokenDAO.tokens.deleteOne({ "token": token })
      return ({ 
            'type': 'success',
            'data': 'Token deleted successfully' 
        })
    } catch (e) {
        return({
            'type': 'error',
            'data':e.message
        });
    }
  }

module.exports = tokenDAO;