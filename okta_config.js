const axios = require("axios");

module.exports = function (RED) {
  function OktaConfigNode(config) {
    RED.nodes.createNode(this, config);

    // Validate if the required JSON field is present
    if (!this.credentials || !this.credentials.apiKey) {
      this.error("API key Id is missing");
      return;
    }

    if (!this.credentials || !this.credentials.domain) {
      this.error("Domain is missing");
      return;
    }

    this.name = config.name;
    this.apiKey = this.credentials.apiKey;
    this.domain = this.credentials.domain;
    this.has_credentials = this.apiKey && this.domain;

    };

  RED.nodes.registerType("okta_config", OktaConfigNode, {
    credentials: {
      apiKey: { type: "text" },
      domain: { type: "text" },
    },
  });
}



