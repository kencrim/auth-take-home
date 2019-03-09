const {OAuth2Client} = require('google-auth-library');
const credentials = require('../config/credentials.json');
const CLIENT_ID = credentials.client_id;

const client = new OAuth2Client(CLIENT_ID);

const authenticate = async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  console.log(payload);
}

module.exports = authenticate;