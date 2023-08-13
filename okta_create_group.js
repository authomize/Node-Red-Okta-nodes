module.exports = function(RED) {
    function okta_create_group(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
            const axios = require('axios');

			node.auth = RED.nodes.getNode(config.auth);
            
			if (!node.auth || !node.auth.has_credentials) {
				node.error("auth configuration is missing");
				return
			}
			const {apiKey, oktaDomain} = config.auth;

			const groupName = RED.util.evaluateNodeProperty(
				config.groupName, config.userNameType, node, msg
			)

			const groupDesc = RED.util.evaluateNodeProperty(
				config.groupDesc, config.groupDescType, node, msg
			)
			
			const postData = JSON.stringify({"profile": {"name": groupName,"description": groupDesc}});

            headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'SSWS ' + apiKey
            };

            const url = 'https://' + oktaDomain + '.okta.com/api/v1/groups';

            axios.post(url, postData, {headers}).then(response => {
                const res = response.data;

                const newMsg = {
                  payload: res
                };
		msg.groupID = newMsg.payload.id;
                node.send(msg);
            }).catch(error => {
                if (error.response) {
		      // The request was made and the server responded with a status code
		      // that falls out of the range of 2xx
		      node.warn(error.response.data.errorCauses[0]);
		      node.warn(error.response.status);
		      //node.warn(error.response.headers);
		} else if (error.request) {
		      // The request was made but no response was received
		      node.warn(error.request);
		} else {
		      // Something happened in setting up the request that triggered an Error
		      node.warn('Error2', error.message);
		}
		});
        });
    }
    RED.nodes.registerType("okta_create_group", okta_create_group);
};
