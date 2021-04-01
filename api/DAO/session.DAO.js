var config = require('../../config');

var sessionDAO={
    sessions:null
};

sessionDAO.injectDB = async function(conn){
    try{
        if (sessionDAO.sessions) {
            return
        }
        
        sessionDAO.sessions = await conn.db(config.db.dbName).collection("sessions");
    }
    catch(e){
        console.log(e.message);
    }
};

/**
 * Finds a session in the `sessions` collection
 * @param {string} email - The email of the desired session
 * @returns {Object | null} Returns either a single session or nothing
 */
sessionDAO.getSessionByEmail =  async function(email) {
    try{
        var sessionData = await sessionDAO.sessions.findOne({ "email": email });
        return({
            'type': 'success',
            'data':sessionData
        });
    }catch(e){
        return({
            'type': 'error',
            'data':e.message
        });
    }
}

/**
 * Finds a session in the `sessions` collection
 * @param {string} session - The session of the desired session
 * @returns {Object | null} Returns either a single session or nothing
 */
 sessionDAO.getSessionBySession =  async function(session) {
    try{
        var sessionData = await sessionDAO.sessions.findOne({ "session": session });
        return({
            'type': 'success',
            'data':sessionData
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
 * @param {SessionInfo} userInfo - The information of the user to add
 * @returns {DAOResponse} Returns either a "success" or an "error" Object
 */
 sessionDAO.addSession = async function(sessionInfo) {
    try {
        await sessionDAO.sessions.insertOne(sessionInfo);
        return ({ 
            'type': 'success',
            'data': 'Session inserted successfully' 
        });
        
    } catch (e) {
        return({
            'type': 'error',
            'data':e.message
        });
    }
}


/**
 * Removes a session from session collection
 * @param {string} session - The session of the user to for deleting sessions
 * @returns {DAOResponse} Returns either a "success" or an "error" Object
 */
sessionDAO.deleteSessionBySession = async function(session) {
    try {

      await sessionDAO.sessions.deleteOne({ "session": session })
      return ({ 
            'type': 'success',
            'data': 'Session deleted successfully' 
        })
    } catch (e) {
        return({
            'type': 'error',
            'data':e.message
        });
    }
  }

/**
 * Removes a session from session collection
 * @param {string} email - The email of the user to for deleting sessions
 * @returns {DAOResponse} Returns either a "success" or an "error" Object
 */
sessionDAO.deleteSessionByEmail = async function(email) {
    try {

      await sessionDAO.sessions.deleteOne({ "email": email })
      return ({ 
            'type': 'success',
            'data': 'Session deleted successfully' 
        })
    } catch (e) {
        return({
            'type': 'error',
            'data':e.message
        });
    }
  }


module.exports = sessionDAO;