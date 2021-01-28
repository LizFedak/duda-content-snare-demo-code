class ReadFromContentSnare {
  constructor(requestObject) {
    this.requestObject = requestObject;
  }
  getFields() {
    let responseObj = {};
    if (this.requestObject.body.pages) {

      const obj = this.requestObject.body.pages;

      let pages = obj.map(page => page.sections);
      let responseArr = [];
    
      pages.map(arr => {
        return arr.map(obj => {
          responseArr.push(obj.fields);
        });
      });
      responseArr.forEach(arr => {
        arr.forEach(obj => {
          if (responseObj.hasOwnProperty(obj.name)) {
            let temp = responseObj[obj.name];
            responseObj[obj.name] = [];
            responseObj[obj.name].push(temp, obj.values)
          } else {
            responseObj[obj.name] = obj.values;
          }
        });
      });
    } 
    return responseObj;
  }
}
  
module.exports = ReadFromContentSnare;