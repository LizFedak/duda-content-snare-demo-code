class CreateDudaJSON {
  constructor() {
    this.resBody = {
      "location_data": {
          "label":"",
          "phones": [],
          "emails": [],
          "social_accounts": {
              "facebook": "",
              "linkedin": "",
              "instagram":"",
              "twitter":"",
              "pinterest":"",
              "snapchat":"",
              "youtube":"",
              "vimeo":"",
              "yelp":"",
              "tripadvisor":"",
              "foursquare":""
          },
          "address": {
              "streetAddress": "",
              "country": "US"
          },
      },
      "site_texts": {
          "overview": "",
          "services": "",
          "about_us": "",
          "custom":[]
      },
      "business_data": {
          "name": "",
          "logo_url":""
      }
    }
  }

  addPhones(arr) {
    if (arr.length >= 1) {
      arr.forEach((phone, idx) => {
        const obj = {
          phoneNumber: "",
          label: ""
        }
        obj.phoneNumber = phone;
        obj.label = `phone #${idx}`;
        if (idx === 0) obj.label = "Primary phone";
        this.resBody.location_data.phones.push(obj);
      })
    }
  }



  addEmail(arr) {
    if (this.testForNA(arr[0])) {
      return
    } else {
      if (arr.length >= 1) {
        arr.forEach((email, idx) => {
          const obj = {
            emailAddress: "",
            label: ""
          }
          obj.emailAddress = email;
          obj.label = `email #${idx}`;
          if (idx === 0) obj.label = "Primary Email";
          this.resBody.location_data.emails.push(obj);
        })
      }
    } 
  }

  addSocial(arr, network) {
    let link;
    if (arr.length === 0 || this.testForNA(arr[0])) {
      link = "";
    } else if (arr[0].search(/(?<=(co(m)*\/))[a-z0-9-_/.+]+/i) > -1) { 
      link = arr[0].match(/(?<=(co(m)*\/))[a-z0-9-_/.+]+/i)[0] || "";
    } else if (arr[0].search(/.+/i) > -1) {
    link = arr[0].match(/.+/i)[0].trim() || "";
    } else {
      link = "";
    }
    this.resBody.location_data.social_accounts[network] = link;
  }

  addAddress(arr) {
    if (this.testForNA(arr[0])) {
      this.resBody.location_data.address.streetAddress = "";
    } else {
      this.resBody.location_data.address.streetAddress = arr[0];
    }
  }

  addBusinessText(arr, field) {
    if (this.testForNA(arr[0])) {
      this.resBody.site_texts[field] = "";
    } else {
      this.resBody.site_texts[field] = arr[0];
    }
  }

  addCustomBusinessText(arr, field) {
    if (this.testForNA(arr[0])) { 
      return
    } else {
      let obj =  {
        "label":"",
        "text":""
      }
      obj.label = field;
      obj.text = arr[0];
      this.resBody.site_texts.custom.push(obj);
    }
  }

  addLogo(arr) {
    if (this.testForNA(arr[0])) { 
      this.resBody.business_data.logo_url = "";
    } else {
      this.resBody.business_data.logo_url = arr[0];
    }
  }

  addBusinessName(arr) {
    if (this.testForNA(arr[0])) {
      this.resBody.business_data.name = "";
      this.resBody.location_data.label = "";
    } else {
      this.resBody.business_data.name = arr[0];
      this.resBody.location_data.label = arr[0];
    }
  }

  testForNA(testCase) {
    return (/n{1}[./]*a{1}\.*/gi.test(testCase) && testCase.length < 5) || /(not applicable)/gi.test(testCase);
  }
}

module.exports = CreateDudaJSON;



 