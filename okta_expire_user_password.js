const axios = require('axios');
module.exports = function(RED) {
    function okta_expire_user_password(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {

        try{
            const apiKey = msg.config.OktaKEY;
            const oktaDomain = msg.config.Domain;
			const userID = msg.payload.data.entities[0].originId;
			const user_name = msg.payload.data.entities[0].email;
			
            headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'SSWS ' + apiKey
            };
            const url = 'https://' + oktaDomain + '.okta.com/api/v1/users/' + userID + '/lifecycle/expire_password';
			axios.post(url, {}, { headers }).then(response => {
            node.warn(user_name + ' (id: ' + userID + ') password was expired');
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
