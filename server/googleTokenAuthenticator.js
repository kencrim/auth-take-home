const {OAuth2Client} = require('google-auth-library');
const credentials = require('../config/credentials.json');
const CLIENT_ID = credentials.client_id;

const client = new OAuth2Client(CLIENT_ID);

const authenticate = async function verify(token, cb) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  cb(payload);
}

module.exports = authenticate;