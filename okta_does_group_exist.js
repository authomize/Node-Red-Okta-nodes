const https = require('https');

module.exports = function(RED) {
    function okta_does_group_exist_node(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        node.on('input', function(msg) {
			
			node.auth = RED.nodes.getNode(config.auth);
            
			if (!node.auth || !node.auth.has_credentials) {
				node.error("auth configuration is missing");
				return
			}
			const {apiKey, oktaDomain} = config.auth;
            
			const groupName = RED.util.evaluateNodeProperty(
				config.groupName, config.userNameType, node, msg
			)

            const url = 'https://' + oktaDomain + '.okta.com/api/v1/groups?search=profile.name+eq+%22' + groupName + '%22';
            const options = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'SSWS ' + apiKey
                }
            };

            const req = https.get(url, options, (res) => {
                let rawData = '';

                res.on('data', (chunk) => {
                    rawData += chunk;
             });

                res.on('end', () => {
                    try {
			const parsedData = JSON.parse(rawData);
			
			if (parsedData.length > 0) { // Okta doesn't allow 2 groups with the same name so this case isn't taken care of
				msg.groupID = parsedData[0].id;
				node.send([msg, null]);
			}else{
				node.send([null, msg]);
			}
                    } catch (error) {
                        node.error(error);
                        node.send([null, error]);
                    }
                });
            });

            req.on('error', (error) => {
                node.warn(error);
                node.send([null, error]);
            });


            req.end();
        });
    }

    RED.nodes.registerType("okta_does_group_exist", okta_does_group_exist_node);
};
