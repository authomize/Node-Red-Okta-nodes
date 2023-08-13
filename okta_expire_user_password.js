const axios = require('axios');
module.exports = function(RED) {
    function okta_expire_user_password(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {

        try{
 node.auth = RED.nodes.getNode(config.auth);
            
			if (!node.auth || !node.auth.has_credentials) {
				node.error("auth configuration is missing");
				return
			}
			const {apiKey, oktaDomain} = config.auth;

			const userID = RED.util.evaluateNodeProperty(
				config.userID, config.userIDType, node, msg
			)

			const userName = RED.util.evaluateNodeProperty(
				config.userName, config.userNameType, node, msg
			)
			
            headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'SSWS ' + apiKey
            };
            const url = 'https://' + oktaDomain + '.okta.com/api/v1/users/' + userID + '/lifecycle/expire_password';
			axios.post(url, {}, { headers }).then(response => {
            node.warn(userName + ' (id: ' + userID + ') password was expired');
            node.send(msg);
          })
          .catch(error => {
            node.warn(error);
          });
      } catch(error) {
        node.warn(error);
      }
    });
  }

  RED.nodes.registerType("okta_expire_user_password", okta_expire_user_password);
};
