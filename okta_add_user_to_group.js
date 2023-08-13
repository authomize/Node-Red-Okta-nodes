const axios = require('axios');
module.exports = function(RED) {
    function okta_add_user_to_group(config) {
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
			
			const groupID = RED.util.evaluateNodeProperty(
				config.groupID, config.userIDType, node, msg
			)

			const groupName = RED.util.evaluateNodeProperty(
				config.groupName, config.userNameType, node, msg
			)

            headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'SSWS ' + apiKey
            };

            const url = 'https://' + oktaDomain + '.okta.com/api/v1/groups/' + groupID + '/users/' + userID;
			axios.put(url, {}, { headers }).then(response => {
            node.warn(userName + ' (id: ' + userID + ') was added to ' + groupName + ' (id: ' + groupID + ')');
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

  RED.nodes.registerType("okta_add_user_to_group", okta_add_user_to_group);
};
