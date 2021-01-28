const ReadFromContentSnare = require('./readfromContentSnare');
const CreateDudaJSON = require('./createDudaJSON');
const ClientSiteObject = require('./clientSiteResolution');
const https = require('https');

module.exports = async (req,res) => {
  const reqObj = new ReadFromContentSnare(req);
  const resObj = new CreateDudaJSON();
  const clientSiteResolution = new ClientSiteObject(req);

  try {
    const fields = reqObj.getFields();
    const imageObj = makeImageArray(fields['Provide images to be used on the site']);   
    const APIFLOW = clientSiteResolution.apiFlowId;

    if (APIFLOW === "1") {
      if (clientSiteResolution.siteId === "") {
        let clientEmail = clientSiteResolution.clientId;
        let getSiteId = await getExistingSiteid(clientEmail);
        let cleanedUp = getSiteId.match(/[0-9a-z]{6,}/)[0];
        clientSiteResolution.updateSiteId(cleanedUp);
        
      }
    } else if (APIFLOW === "2") {
      const obj = {
        'template_id':""
      };

      obj['template_id'] = clientSiteResolution.templateId;
      let newSiteId = await makeASite(JSON.stringify(obj));
      let cleanedUp = newSiteId.match(/[0-9a-z]{6,}/gi)[0];
      clientSiteResolution.updateSiteId(cleanedUp);
    }
    
    if (fields['What is your business phone number?'][0] !== '') resObj.addPhones(fields['What is your business phone number?']);
    if (fields['Upload your logo'][0] !== '') resObj.addLogo(fields['Upload your logo']);
    if (fields['What is your business address?'][0] !== '') resObj.addAddress(fields['What is your business address?']);
    if (fields['Facebook'][0] !== '') resObj.addSocial(fields['Facebook'], 'facebook');
    if (fields["LinkedIn"][0] !== '') resObj.addSocial(fields['LinkedIn'], "linkedin");
    if (fields['Instagram'][0] !== '') resObj.addSocial(fields['Instagram'], 'instagram');
    if (fields['Twitter'][0] !== '') resObj.addSocial(fields['Twitter'], 'twitter');
    if (fields['Pinterest'][0] !== '') resObj.addSocial(fields['Pinterest'], 'pinterest');
    if (fields['Snapchat'][0] !== '') resObj.addSocial(fields['Snapchat'], 'snapchat');
    if (fields['YouTube'][0] !== '') resObj.addSocial(fields['YouTube'], 'youtube');
    if (fields['Vimeo'][0] !== '') resObj.addSocial(fields['Vimeo'], 'vimeo');
    if (fields['Yelp'][0] !== '') resObj.addSocial(fields['Yelp'], 'yelp');
    if (fields['Trip Advisor'][0] !== '') resObj.addSocial(fields['Trip Advisor'], 'tripadvisor');
    if (fields['Foursquare'][0] !== '') resObj.addSocial(fields['Foursquare'], 'foursquare');
    if (fields['What email address(es) would you like your website inquiries to go to?'][0] !== '') resObj.addEmail(fields['What email address(es) would you like your website inquiries to go to?']);
    if (fields['Company Name'][0] !== "") resObj.addBusinessName(fields['Company Name']);
    // if (fields['About Us'][0] !== "") resObj.addBusinessText(fields['About Us'], "about_us");
    // if (fields['Site Overview'][0] !== "") resObj.addBusinessText(fields['Site Overview'], "overview");
    // if (fields['Your Services'][0] !== "") resObj.addBusinessText(fields['Your Services'], "services");
    if (fields['Tagline (optional)'][0] !== "") resObj.addCustomBusinessText(fields['Tagline (optional)'], "Tagline");


    let siteId = clientSiteResolution.siteId;

    for (const arr of imageObj) {
      await uploadImages(JSON.stringify(arr), siteId);
    }
    await sendContentToDuda(JSON.stringify(resObj.resBody), siteId); 
    res.writeHead(200);
    res.end();
  } catch (err) {
    console.log(err);
    res.writeHead(500);
    res.end();
  }
}

async function uploadImages(data, siteID) {
  let authorization = process.env.DUDA_API;
  let path = `/api/sites/multiscreen/resources/${encodeURIComponent(siteID)}/upload`;
  const options = {
    hostname: 'api.duda.co',
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': authorization,
    },
    body: {
      data
    }
  }

  res = await new Promise((resolve, reject) => {
    req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`);
      resolve();
    })
    req.on('error', error => {
      console.error(error);
      reject();
    })
    req.write(data);
    req.end()
  }).then(function() {
    return true;
  });
}

async function sendContentToDuda(data, siteID) {
  let authorization = process.env.DUDA_API;
  let path = `/api/sites/multiscreen/${encodeURIComponent(siteID)}/content`;
  const options = {
    hostname: 'api.duda.co',
    port: 443,
    method: 'POST',
    path: path,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': authorization
    }
  }

  res = await new Promise((resolve, reject) => {
    req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`);
      resolve();
    })
    req.on('error', error => {
      console.error(error);
      reject();
    })
    req.write(data);
    req.end()
  }).then(function() {
    return true;
  });
}
function makeImageArray(array) {
  let body = [];
  array.forEach(image => {
    let tmpObj = {
      resource_type: "IMAGE",
      src: ""
    }
    tmpObj.src = image;
    body.push(tmpObj);
  });

  let buffer = [];
  let tmpArray = [];
  for (let index = 0; index < body.length; index++) {
    if (index % 5 === 0 && index !== 0) {
      buffer.push(tmpArray);
      tmpArray = [];
      tmpArray.push(body[index]);
    } else {
      tmpArray.push(body[index]);
    }
  }
  if (tmpArray.length !== 0) {
    buffer.push(tmpArray);
  }
  return buffer;
}

async function makeASite(templateID) {
  let authorization = process.env.DUDA_API;
  const options = {
    hostname: 'api.duda.co',
    port: 443,
    path: '/api/sites/multiscreen/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': templateID.length,
      'Authorization': authorization
    },
    body: {
      templateID
    }
  }

  let resultObject = await new Promise((resolve, reject) => {
    req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`);
      res.on('data', function(chunk) {
        let resolver = String(chunk);
        return resolve(resolver);
      });
      
    })
    req.on('error', error => {
      console.error(error);
      reject();
    })
    req.write(templateID);
    req.end()
  })
  return resultObject;
}

async function getExistingSiteid(emailAddress) {
  let path = `/api/accounts/grant-access/${encodeURIComponent(emailAddress)}/sites/multiscreen`;
  let authorization = process.env.DUDA_API;
  const options = {
    hostname: 'api.duda.co',
    port: 443,
    path: path,
    method: 'GET',
    headers: {
      'Authorization': authorization
    }
  }

  let resultObject = await new Promise((resolve, reject) => {
    let req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`);
      res.on('data', function(chunk) {
        let resolver = String(chunk);
        console.log(resolver, "RESULT");
        return resolve(resolver);
      });
    })
    req.on('error', error => {
      console.error(error);
      reject();
    })
    req.end()
  })
  return resultObject;
}