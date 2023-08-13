const axios = require('axios');
module.exports = function(RED) {
    function okta_suspend_user(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {

		node.auth = RED.nodes.getNode(config.auth);
            
		if (!node.auth || !node.auth.has_credentials) {
			node.error("auth configuration is missing");
			return
		}

		const userID = RED.util.evaluateNodeProperty(
			config.userID, config.userIDType, node, msg
		)

		const userName = RED.util.evaluateNodeProperty(
			config.userName, config.userNameType, node, msg
		)
		
		const {apiKey, oktaDomain} = config.auth;
		
        try{
			const userID = msg.payload.data.entities[0].originId;
			const userName = msg.payload.data.entities[0].email;

            headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'SSWS ' + apiKey
            };
            const url = 'https://' + oktaDomain + '.okta.com/api/v1/users/' + userID + '/lifecycle/suspend';
			axios.post(url, {}, { headers }).then(response => {
            node.warn(userName + ' (id: ' + userID + ') was suspended');
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

  RED.nodes.registerType("okta_suspend_user", okta_suspend_user);
};
