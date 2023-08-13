module.exports = function(RED) {
    function okta_list_group_Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
            const https = require('https');

			node.auth = RED.nodes.getNode(config.auth);
            
			if (!node.auth || !node.auth.has_credentials) {
				node.error("auth configuration is missing");
				return
			}
			const {apiKey, oktaDomain} = config.auth;

			const groupID = RED.util.evaluateNodeProperty(
				config.groupID, config.userIDType, node, msg
			)

            const options = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'SSWS ' + apiKey
                }
            };

            const url = 'https://' + oktaDomain + '.okta.com/api/v1/groups/' + groupID + '/users';
            const req = https.get(url, options, (res) => {

            let rawData = '';
			users = [];
            res.on('data', (chunk) => {
                rawData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
		    const ids = parsedData.map(item => item.id);
		    msg.okta_group_ids = ids;
		    node.send(msg);
                } catch (error) {
                    node.error(error);
                }
            });

            req.on('error', (error) => {
                node.warn(error);
            });

                req.end();
            });

        });
    }

    RED.nodes.registerType("okta_list_group", okta_list_group_Node);
};
