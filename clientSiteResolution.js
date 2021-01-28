class ClientSiteObject {
  constructor(requestObj) {
    this.reqObj = requestObj;
    this.clientId = this.setClientId();// email address (method) // required
    this.siteId = this.setSiteId();// site ID if available (method) // can be ""
    this.templateId = this.setTemplateId();// template Id if available (method); OR DEFAULT
    this.apiFlowId = this.setAPIFlowID();// ID selected from Content Snare // required 
    this.updateTemplateId();
  }
  setClientId() {
    return this.reqObj.body.client.email;
  }
  setClientName() {
    return this.reqObj.body.client.full_name;
  }
  setSiteId() {
    return this.reqObj.body.pages[2].sections[0].fields[0].values[0] || "";
  }
  setTemplateId() {
    return this.reqObj.body.pages[2].sections[0].fields[1].values[0] || "";
  }
  setAPIFlowID() {
    return this.reqObj.body.pages[2].sections[0].fields[2].values[0];
  }
  updateSiteId(newSiteId) {
    this.siteId = newSiteId;
  }
  updateTemplateId() {
    const TEMPLATES = {
        'DEFAULT': '1031575'
    }
    let template = TEMPLATES[this.templateId];
    this.templateId = template;
  }
}

module.exports = ClientSiteObject;