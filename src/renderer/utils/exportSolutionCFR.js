import moment from 'moment';
let Base64 = require('js-base64').Base64;
let exportSolutionCFR = {
  async setValue(solution, machineName, resultStr) {
    let s = solution[0].customer_name + '##' + solution[0].project_name + '##' + solution[0].solution_name + '##' + solution[0].sales_manager + '##' + solution[0].pre_sales_manager + '##' + solution[0].ship_date + '##' + solution[0].description;
    let preStr =  resultStr + s;
    // console.log(preStr);

    let encrypt = Base64.encode(preStr);
    // console.log(encrypt);
    // let decode = Base64.decode(encrypt);
    // console.log(decode)

    //加密解密
    // let encrypt = secret.encrypt(preStr);
    // console.log('----->',encrypt);
    // let decrypt = secret.decrypt(encrypt);
    // console.log('----->',decrypt);
    // decrypt = decrypt.replace('"','');
    // decrypt = decrypt.replace('"','');
    // let indexOf = decrypt.indexOf("\\n");
    // decrypt = decrypt.replace("\\n", "\\r\\n");
    // console.log('999999999999>',decrypt);
    // console.log(typeof decrypt);
    saveAs(encrypt, machineName);
  }

};

/**
 * 导出cfr文件
 * @param machineName
 * @param sCfr
 */
function saveAs(sCfr, machineName) {
  let header = 'data:application/octet-stream;charset=utf-8,';
  let name = machineName + '-' + 'IPSConfiguration' + moment()
    .format('YYYYMMDDHHmmss') + '.ips';
  let cfrContent = header + sCfr;
  //如果是IE浏览器
  if (window.navigator.msSaveOrOpenBlob) {
    let blob = new Blob([ decodeURIComponent(encodeURI(cfrContent)) ], {
      type: 'application/octet-stream;charset=utf-8;'
    });
    navigator.msSaveBlob(blob, name);
  } else {
    let encodedUri = encodeURI(cfrContent);
    let link = document.createElement('a');
    // //扩展，访问局域网内共享文件
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  }
}


export default {
  exportSolutionCFR
};

