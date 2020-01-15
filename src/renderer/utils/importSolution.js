import Vue from 'vue'; //引入vue
import CfrConstants from './cfrConstants';
import ipscsParser from './ipscsParser';
import $store from '../store';
let vm = new Vue();
let $db;
setTimeout(()=>{
  $db = vm.$db; //不是undefined了
},1000);
export default {
  async importSolution(result) {
    return await importData(result);
  }
};
async function importData(resultStr){
  let sucFlag = false;
  let solutionId;
  try {
  let dataList = {
    headerData: [],
    systemData: [],
    lineData: []
  }
  let iocategoryList = [22, 23, 24, 25];//存放外部组件中IO扩展柜类型集合
  let diskcategoryList = [26, 27];//存放外部组件中硬盘扩展柜类型集合
  let listOfLines = resultStr.split('\n');
  //去除掉开头的solution信息
  let solutionInfo = listOfLines[listOfLines.length - 1];
  listOfLines.splice(listOfLines.length - 1, 1);
  //------------------------新增方案，获取插入solutionId-------------------------
  solutionId = await addSolutions(solutionInfo);
  if (solutionId == 0) {
    alert("新建方案失败！")
    return false;
  }
  //------------------------新增方案，获取插入solutionId-------------------------
  let headList = [];
  //拆分数组将 00,03,05从数组中剔除放到公共数组中
  let seqNum = 0;
  for (let i = 0; i < listOfLines.length; i++) {
    let listOfLine1 = listOfLines[i];
    if (listOfLine1.startsWith("07")) {
      seqNum = i;
      break;//跳出循环
    }
    headList.push(listOfLine1);
  }
  //存放文件中包含的多个机器配置数据
  let parentList = [];
  //存放某个机器数据
  let childList = [];
  for (let i = seqNum; i < listOfLines.length; i++) {
    if (listOfLines[i].startsWith('07')) {
      if (childList.length > 0) {
        parentList.push(childList);
      }
      childList = [];
      childList.push(listOfLines[i]);
    } else {
      childList.push(listOfLines[i]);
    }
  }
  if (childList.length > 0) {
    parentList.push(childList);
  }

  console.log(parentList);
  //循环最外层数组  将头部信息headList拼接到每一个机器前
  for (let i = 0; i < parentList.length; i++) {
    dataList.lineData = [];
    let tempArr = parentList[i];
    for (let j = headList.length - 1; j >= 0; j--) {
      tempArr.unshift(headList[j]);
    }
    let list = ipscsParser.cfrParser(tempArr, false, false, false);
    // console.log('list-----------'+list);
    let systemSeq = '';
    for (let i = 0; i < list.length; i++) {
      let listOfLine = list[i];
      console.log('list-----------' + listOfLine);
      if (listOfLine[0] == CfrConstants.CfrConstants.CSV_CFR[0]) {
        i++;
        listOfLine = list[i];
        dataList.headerData = listOfLine;
        continue;
      }
      ;
      if (listOfLine[0] == CfrConstants.CfrConstants.CSV_SYSTEM[0]) {
        i++;
        if (list[i] == undefined) {
          alert("文件导入数据解析失败！");
          return false;
        }
        listOfLine = list[i];
        systemSeq = listOfLine[0];
        dataList.systemData.push(listOfLine);
        continue;
      }
      let lineMap = new Map();
      dataList.lineData.push(lineMap.set(systemSeq, listOfLine));
    }
    console.log('dataList1 -------' + dataList.headerData);
    console.log('dataList2 -------' + dataList.systemData);
    //-----------获取产品id  productId----------------------
    let productId = await getProductId(dataList.systemData[i][2], dataList.systemData[i][3]);
    //如果产品ID不存在  则不允许导入
    if (productId == 0) {
      alert("此商品不存在！请先新建该产品！");
      return false;
    }
    //-----------获取产品id  productId----------------------
    //-----------获取模板id --------------------------------
    let templateId = parseInt(dataList.systemData[i][6]);
    //校验当前的模板id 数据库中是否删除
    // let flag = await checkTemplateId(templateId);
    // if (!flag){
    //     alert("此模板已不存在！请重新创建模板！");
    //     return false;
    // }
    //-----------获取模板id --------------------------------
    let resultArr = [];
    for (let i = 0; i < dataList.lineData.length; i++) {
      let obj = Array.from(dataList.lineData[i]);
      for (let k in obj) {
        if (!isNumber(obj[k][1][0].charAt(0)))
          continue;
        // console.log('dataList3 -------' + obj[k][0]);
        // console.log('dataList3 -------' + obj[k][1]);
        resultArr.push(obj[k][1]);
      }
    }
    console.log("resultArr----" + resultArr);
    //-----------新增机器    machineId----------------------
    let machineId = await getMachineId(solutionId, productId, 1, parseInt(resultArr[1][26]), templateId);
    if (machineId == 0) {
      alert("新增机器失败！");
      return false;
    }
    //-----------新增机器    machineId----------------------
    //---------------------硬件数据插入开始 ---------------------
    //获取产品下所有硬件集合，比对FC 获取component_id
    let typeModel = dataList.systemData[i][2] + '-' + dataList.systemData[i][3];
    let dataListHW;
    if (typeModel == '9009-42A') {
      dataListHW = await getDataListHW(productId);
    } else {
      dataListHW = await getDataListHW950(productId);
    }
    console.log('dataListHW---->', dataListHW);

    //存放组装后数据，用于插入
    let hardwareList = [];

    //记录cpu激活数
    let cpuAct = 0;
    //存放用户手动修改/添加FC的数据
    let additionArr = [];
    //循环比对FC 组装数据
    for (let n = resultArr.length - 1; n >= 0; n--) {
      if (!isNumber(resultArr[n][0].charAt(0))) {
        return false;
      }
      //只读取硬件部分
      let number = Number(resultArr[n][0]);
      let no = parseInt(number / 1000);
      let flag = false;
      if (no == 1) {
        //当前行为硬件中首行，跳过只读FC不为空的硬件
        if ((number % 1000) == 0) {
          continue;
        }
        for (let m = dataListHW.length - 1; m >= 0; m--) {
          const listElement = dataListHW[m];
          if (resultArr[n][2] == listElement.component_FC) {
            let obj = {
              solutionId: solutionId,
              productId: productId,
              templateId: templateId,//默认初始模板
              componentId: listElement.id,
              machineId: machineId,
              categoryId: listElement.category_id,
              componentCount: resultArr[n][4],
              isExpansion: resultArr[n][23],
              powerlineType: resultArr[n][24],
              FC: listElement.component_FC,
              expansionModeId: resultArr[n][28]
            }

            // //外部组件中IO扩展柜  is_expansion = 0  其他默认为 1 powerline_type 电源线类型,0内部，1：io扩展柜，2：硬盘扩展柜 默认为0
            // if(iocategoryList.indexOf(listElement.category_id) > -1){
            //     obj.isExpansion = 0;
            //     obj.powerlineType = 1;
            // }
            // //外部组件中IO扩展柜  is_expansion = 0  其他默认为 1 powerline_type 电源线类型,0内部，1：io扩展柜，2：硬盘扩展柜 默认为0
            // if(diskcategoryList.indexOf(listElement.category_id) > -1){
            //     obj.isExpansion = 0;
            //     obj.powerlineType = 2;
            // }
            hardwareList.push(obj);
            flag = true;
          }
        }
        //手动修改/添加的FC
        if (resultArr[n][27] != '0') {
          additionArr.push(resultArr[n][2]);
          resultArr.splice(n, 1);
        }
        if (flag) {
          resultArr.splice(n, 1);
        }
      }
    }

    if (additionArr.length > 0) {
      //将刚导入的方案删除
      await delSolutionById(solutionId);
      alert("以下硬件数组[" + additionArr + "]中FC不匹配！");
      return false;
    }

    //---------------------软件数据插入开始 ---------------------
    console.log(resultArr)
    let additionListSW = resultArr.filter((o) => {
      return !isEmpty(o[27]) && o[27] != '0';
    });
    if (additionListSW.length > 0) {
      //取FC
      additionListSW = additionListSW.map((i) => {
        return i[2];
      });
      //将刚导入的方案删除
      await delSolutionById(solutionId);
      alert("以下软件数组[" + additionListSW + "]中FC不匹配！");
      return false;
    }
    let addListSW = [];
    //--------------判断是否插入导入HPO标识类型 =>33---------------
    let hpoFlag = false;//hpo标识
    //--------------判断是否插入导入HPO标识类型 =>33---------------
    //逻辑分区标识
    let logicObj = {
      solutionId: solutionId,
      productId: productId,
      templateId: templateId,//默认初始模板
      machineId: machineId,
      expansionModeId: ''
    }
    let dataListSW = await getDataListSW(productId);
    for (let p = 0; p < dataListSW.length; p++) {
      let objSW = {
        solutionId: solutionId,
        productId: productId,
        templateId: templateId,//默认初始模板
        machineId: machineId
      }
      let flag = false;
      let item = dataListSW[p];
      //过滤出所有FC不为null的数据
      let fcList = item.list.filter((c) => !isEmpty(c.software_FC));
      //去重cf数组
      let removeList = [];
      for (let k = 0; k < fcList.length; k++) {
        let fcFlag = false;
        for (let l = 0; l < resultArr.length; l++) {
          if (resultArr[l][2] == fcList[k].software_FC) {
            //逻辑分区 0265
            if (fcList[k].category_id == 13) {
              logicObj.componentCount = resultArr[l][4];
              logicObj.isExpansion = resultArr[l][23];
              logicObj.powerlineType = resultArr[l][24];
              logicObj.componentId = fcList[k].id;
              logicObj.categoryId = fcList[k].category_id;
            }
            //HPO
            if (fcList[k].category_id == 33 && !hpoFlag) {
              hpoFlag = true;
              let obj = {
                solutionId: solutionId,
                productId: productId,
                templateId: templateId,//默认初始模板
                componentId: fcList[k].id,
                machineId: machineId,
                categoryId: 33,
                componentCount: 1,
                isExpansion: 1,
                powerlineType: 0,
                FC: '',
                expansionModeId: ''
              }
              hardwareList.push(obj);
            }
            if (removeList.indexOf(fcList[k].software_FC) > -1) {
              continue;
            } else {
              objSW.componentCount = resultArr[l][4];
              objSW.isExpansion = resultArr[l][23];
              objSW.powerlineType = resultArr[l][24];
              objSW.expansionModeId = resultArr[l][28];
              fcFlag = true;
            }
          }
        }
        if (fcFlag) {
          removeList.push(fcList[k].software_FC);
        }
      }
      let count = 0;
      //过滤出HPO数量
      if (!hpoFlag) {
        count = fcList.filter((c) => c.category_id != 33 && c.category_id != 34).length;
      } else {
        count = fcList.length;
      }
      if (removeList.length == count) {
        objSW.componentId = dataListSW[p].id;
        objSW.categoryId = dataListSW[p].category_id;
        addListSW.push(objSW);
      }

    }
    if (logicObj.categoryId != undefined) {
      addListSW.push(logicObj);
    }
    //---------------------维保数据插入开始---------------------
    let listSWMA = await getDataListSWMA(productId);
    let addListSWMA = [];//存放组装的维保数据集合
    // let removeListSWMA = [];
    //过滤FC不为空的维保
    let dataListSWMA = listSWMA.filter((e) => !isEmpty(e.software_FC));
    //过滤FC为空的维保
    let emptyListSWMA = listSWMA.filter((t) => isEmpty(t.software_FC));
    for (let l = 0; l < resultArr.length; l++) {
      let objSWMA = {
        solutionId: solutionId,
        productId: productId,
        templateId: templateId,//默认初始模板
        machineId: machineId,
        expansionModeId: ''
      }
      let flagSWMA = false;
      for (let v = 0; v < dataListSWMA.length; v++) {
        if (resultArr[l][2] == dataListSWMA[v].software_FC) {
          if (addListSWMA.indexOf(dataListSWMA[v].software_FC) > -1) {
            continue;
          } else {
            objSWMA.componentCount = resultArr[l][4];
            objSWMA.isExpansion = resultArr[l][23];
            objSWMA.powerlineType = resultArr[l][24];
            objSWMA.componentId = dataListSWMA[v].id;
            objSWMA.categoryId = dataListSWMA[v].category_id;
            objSWMA.Classify = dataListSWMA[v].Classify;
            flagSWMA = true;
          }
        }
      }
      if (flagSWMA) {
        addListSWMA.push(objSWMA);
      }
    }
    //存放classify不为空 但是FC为空的数据
    let classifyList = [];
    for (let z = 0; z < resultArr.length; z++) {
      let objSWMA1 = {
        solutionId: solutionId,
        productId: productId,
        templateId: templateId,//默认初始模板
        machineId: machineId,
        expansionModeId: ''
      }
      let flagSWMA1 = false;
      for (let v = 0; v < emptyListSWMA.length; v++) {
        if (resultArr[z][1] == emptyListSWMA[v].Classify) {
          objSWMA1.componentCount =  resultArr[z][4];
          objSWMA1.isExpansion = '1';
          objSWMA1.powerlineType = '0';
          objSWMA1.componentId = emptyListSWMA[v].id;
          objSWMA1.categoryId = emptyListSWMA[v].category_id;
          objSWMA1.Classify = emptyListSWMA[v].Classify;
          flagSWMA1 = true;
        }
      }
      if (flagSWMA1) {
        classifyList.push(objSWMA1);
      }
    }

    //将维保数据合并
    let swmaList = classifyList.concat(addListSWMA);
    //---------------------硬件数据插入开始 ---------------------
    await addHardwareList(hardwareList);
    //---------------------硬件数据插入结束 ---------------------
    //---------------------插入机器价格表(硬件)-------------------------
    let result;
    if (typeModel == '9009-42A') {
      result = await calculationPrice(solutionId, productId, machineId, templateId);
    } else {
      result = await calculationPrice950(solutionId, productId, machineId, templateId);
    }

    let obj = {
      productId: productId,
      solutionId: solutionId,
      machineId: machineId,
      discount: 0,
      dollarDiscount: 0,
      configureType: 1
    }
    let priceType = $store.state.currency_type;
    obj.totalPrice = result.total_price_cn;
    obj.discountPrice = obj.discount == 0 ? result.total_price_cn.toFixed(2) : (result.total_price_cn * (obj.discount / 100)).toFixed(2);
    obj.totalPrice_en = result.total_price_en;
    obj.discountPrice_en = obj.dollarDiscount == 0 ? result.total_price_en.toFixed(2) : (result.total_price_en * ((100 - obj.dollarDiscount) / 100)).toFixed(2);
    // if (priceType == 0){ //人民币
    //     obj.totalPrice = result.total_price_cn;
    //     obj.discountPrice = (result.total_price_cn * (obj.discount/100)).toFixed(2);
    // }else{//美元
    //     obj.totalPrice = result.total_price_en;
    //     obj.discountPrice = (result.total_price_en * ((100-obj.discount)/100)).toFixed(2);
    // }
    await addMachinePriceHW(0, obj);//插入价格数据
    //---------------------插入机器价格表-------------------------
    //---------------------插入detail表中软件部分数据------------
    await addHardwareList(addListSW)
    //---------------------插入detail表中软件部分数据------------
    //---------------------维保数据插入开始---------------------
    await addHardwareList(swmaList);
    //---------------------维保数据插入结束---------------------
    //---------------------将机器的软件价格插入机器价格表中---------
    let resultSW = await calculationPriceSW(solutionId, productId, machineId, templateId, hpoFlag);
    let objSW = {
      productId: productId,
      solutionId: solutionId,
      machineId: machineId,
      discount: 0,
      dollarDiscount: 0,
      configureType: 2
    }
    //----------------软件暂时只有一个字段  当做人民币来算-----------
    objSW.totalPrice = resultSW.total_price_cn;
    objSW.discountPrice = objSW.discount == 0 ? resultSW.total_price_cn.toFixed(2) : (resultSW.total_price_cn * (objSW.discount / 100)).toFixed(2);
    objSW.totalPrice_en = resultSW.total_price_en;
    objSW.discountPrice_en = objSW.dollarDiscount == 0 ? resultSW.total_price_en.toFixed(2) : (resultSW.total_price_en * ((100 - objSW.dollarDiscount) / 100)).toFixed(2);
    // if (priceType == 0){ //人民币
    //     objSW.totalPrice = resultSW.total_price_cn;
    //     objSW.discountPrice = (resultSW.total_price_cn * (objSW.discount/100)).toFixed(2);
    // }else{//美元
    //     objSW.totalPrice = resultSW.total_price_en;
    //     objSW.discountPrice = (resultSW.total_price_en * ((100-objSW.discount)/100)).toFixed(2);
    // }
    await addMachinePriceHW(0, objSW);//插入价格数据---人民币
    //---------------------将机器的软件价格插入机器价格表中---------
  }
  sucFlag = true;
  return sucFlag;
  }catch (e) {
      await delSolutionById(solutionId);
      return sucFlag;
  }
}
//获取产品下维保集合
async function getDataListSWMA(productId){
  let dataListSWMA = [];
  const SQL = `select soft.id,soft.software_FC,soft.category_id ,soft.Classify from component_software soft
                        where soft.software_type=3 and soft.productId=${productId}`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data)  {
    for (let i = 0; i < data.length; i++) {
      dataListSWMA.push(data[i]);
      if (data[i].software_FC != undefined && data[i].software_FC != null && data[i].software_FC != '') {
        const renewalSQL = `SELECT cs.id,cs.software_FC,cs.category_id,cs.Classify FROM component_software cs
                        LEFT JOIN software_software ss ON cs.id = ss.carry_software_id
                        WHERE ss.choice_software_id = ${data[i].id}`;
        await new Promise(function(resolve, reject) {
          $db.all(renewalSQL, (err, res) => {
            if (err) {
              resolve(null);
            } else {
              resolve(res);
            }
          });
        }).then((result) => {
          for (let i = 0; i < result.length; i++) {
            dataListSWMA.push(result[i]);
          }
        });
        return dataListSWMA;
      }
    }
    dataListSWMA = data;
  });
  return  dataListSWMA;
}
//获取产品下软件集合(不包含维保)
async function getDataListSW(productId){
  let dataListSW = [];
  const SQL = `SELECT cs.id,cs.category_id FROM component_software AS cs
                LEFT JOIN product_software AS ps ON cs.id = ps.software_id
                WHERE ps.product_id = ${productId} AND cs.deleted = 1`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data)  {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let obj = {
        id:item.id,
        category_id:item.category_id
      }
      //获取所有携带的子组件
      let sql = `select id,software_FC,software_type,Classify,category_id from component_software cs
                            where cs.id in(
                            select carry_software_id from software_software where choice_software_id= ${item.id}
                            ) and cs.software_type != 3 and productId= ${productId}`;
      await new Promise(function(resolve, reject) {
        $db.all(sql, (err, res) => {
          if (err) {
            resolve(null);
          } else {
            resolve(res);
          }
        });
      }).then((result) => {
        obj.list = result
      });
      dataListSW.push(obj);
    }
  });
  return  dataListSW;
}

async function addHardwareList(hardwareList){
  if (hardwareList.length == 0){
    return false;
  }
  let SQL = `INSERT INTO product_programme_detail(product_id,machine_id,category_id,component_id,solution_id,
                                template_id,component_count,is_expansion,powerline_type) values`;
  for (let i = 0; i < hardwareList.length; i++) {
    if (i == hardwareList.length -1){
      SQL = SQL + `('${hardwareList[i].productId}','${hardwareList[i].machineId}','${hardwareList[i].categoryId}',
                                    '${hardwareList[i].componentId}','${hardwareList[i].solutionId}','${hardwareList[i].templateId}',
                                    '${hardwareList[i].componentCount}','${hardwareList[i].isExpansion}','${hardwareList[i].powerlineType}')`;
    }else {
      SQL = SQL + `('${hardwareList[i].productId}','${hardwareList[i].machineId}','${hardwareList[i].categoryId}',
                                    '${hardwareList[i].componentId}','${hardwareList[i].solutionId}','${hardwareList[i].templateId}',
                                    '${hardwareList[i].componentCount}','${hardwareList[i].isExpansion}','${hardwareList[i].powerlineType}'),`;
    }
  }
  await new Promise(function(resolve, reject) {
    $db.run(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data){

  });

}

async function addMachinePriceHW (priceType,obj){
  let SQL;
  if (priceType == 0){
    SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_price,discount,discount_price,configure_type)
                    VALUES('${obj.productId}','${obj.solutionId}','${obj.machineId}',
                    '${obj.totalPrice}','${obj.discount}','${obj.discountPrice}','${obj.configureType}')`;
  }else{
    SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_dollar_price,discount,discount_dollar_price,configure_type)
                    VALUES('${obj.productId}','${obj.solutionId}','${obj.machineId}',
                    '${obj.totalPrice}','${obj.discount}','${obj.discountPrice}','${obj.configureType}')`;
  }
  console.log(SQL)
  $db.run(SQL, (err, res) => {
    if (err) {
      console.log("添加失败")
    } else {
      console.log("添加成功")
    }
  })
}
async function getTemplateId(productId,templateType){
  const SQL = `SELECT id FROM product_templete WHERE product_id = ${productId} AND template_type = ${templateType} AND deleted=1`;
  let templateId = 0;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    if (data.length > 0){
      templateId = data[0].id;
    }
  });
  return templateId;
}
async function calculationPriceSW(solutionId,productId,machineId,templateId,hpoFlag){
  let total_price_cn = 0;
  let total_price_en = 0;
  let resultSW = {};
  const sql = `SELECT T1.software_category,T1.qty,cs.*,
                   (SELECT machine_model FROM product_info WHERE id = ${productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${solutionId} AND template_id = ${templateId} AND machine_id = ${machineId} AND product_id = ${productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${solutionId} AND template_id = ${templateId} AND machine_id = ${machineId} AND product_id = ${productId}) as logicNum
            FROM component_software cs
            INNER JOIN
            (SELECT
            ss.carry_software_id,ss.software_category,ss.qty FROM product_programme_detail ppd
            INNER JOIN software_software ss ON ppd.component_id = ss.choice_software_id
            WHERE ppd.category_id IN (21,14,15,42) AND ppd.solution_id = ${solutionId}
            AND ppd.template_id = ${templateId} AND ppd.machine_id = ${machineId} AND ppd.product_id = ${productId} ORDER BY   ss.carry_software_id
            ) T1
            ON T1.carry_software_id = cs.id
            WHERE cs.software_type != 3`;
  await new Promise(function(resolve, reject) {
    $db.all(sql, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data) {
    let tempData = [];
    let typeModelList = [];
    //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
    for (let i = 0; i < data.length; i++) {
      let obj = {
        component_count: '',
        template_desc: data[i].software_des,
        software_desCN:data[i].software_desCN,
        name: data[i].software_category,
        nameCN: '',
        template_name: data[i].software_FC,
        component_id: data[i].software_PN,
        Classify: data[i].Classify,
        purchase : data[i].purchase,
        USDPurchase: data[i].USDPurchase,
        qty : data[i].qty
      };
      if (obj.qty == 0){
        obj.component_count = data[i].cpuActiveNum;
      }else{
        obj.component_count = data[i].qty;
      }
      if (data[i].Classify == data[i].type + '-' + data[i].model) {
        //逻辑分区
        if (data[i].category_id == 13) {
          obj.component_count = data[i].logicNum;
          //操作系统
        } else if (data[i].category_id == 14) {
          obj.component_count = data[i].component_count;
        } else {
          obj.component_count = data[i].cpuActiveNum;
        }
        typeModelList.push(obj);
        continue;
      }
      //硬件 HPO
      if (data[i].category_id == 33 || data[i].category_id == 34) {
        //不需要显示HPO
        if (!hpoFlag){
          continue;
        }
        obj.component_count = data[i].component_count;
        tempData.push(obj);
        continue;
      }
      tempData.push(obj);
    }
    for (let o = 0; o < tempData.length; o++) {
      let item = tempData[o];
      let objSW = {
        component_count: parseInt(item.component_count),
        total_price_cn: (item.purchase != undefined && item.purchase != null
            && item.purchase != ''&& item.purchase == 'N/C')? 0.00:parseFloat(item.purchase),
        total_price_en: (item.USDPurchase != undefined && item.USDPurchase != null
            && item.USDPurchase != ''&& item.USDPurchase == 'N/C')? 0.00:parseFloat(item.USDPurchase)
      };
      total_price_cn += objSW.component_count * objSW.total_price_cn;
      total_price_en += objSW.component_count * objSW.total_price_en;
    }
    resultSW.total_price_cn = total_price_cn;
    resultSW.total_price_en = total_price_en;
  });
  return resultSW;
}
async function calculationPrice(solutionId,productId,machineId,templateId){
  let total_price_cn = 0;
  let total_price_en = 0;
  let result = {};
  const sql = ` select info.component_PN,info.component_FC,detail.category_id,info.name,info.category_name,info.description,info.description_en,
                detail.component_count,info.listprice_onshore,info.listprice_offshore,info.status
                         from product_programme_detail detail
                         left join solution           so     on  so.id=detail.solution_id
                         left join component_memory   mem   on  mem.id =detail.component_id and detail.category_id=mem.category_id
                         left join component_iocard   io    on io.id   =detail.component_id and detail.category_id=io.category_id
                         left join component_disk     disk  on disk.id =detail.component_id and detail.category_id=disk.category_id
                         left join component_cpu      cpu    on  cpu.id  =detail.component_id and detail.category_id=cpu.category_id
                         left join component_power    power  on  power.id=detail.component_id and detail.category_id=power.category_id
                         left join component_backplane back  on  back.id =detail.component_id and detail.category_id=back.category_id
                         left join component_powerline    line    on line.id=detail.component_id  and detail.category_id=line.category_id
                         left join component_cpu_activation ac    on ac.id=detail.component_id  and detail.category_id=ac.category_id
                         left join component_other    other  on  other.id=detail.component_id and detail.category_id=other.category_id
                         left join component_barebone    bb  on  bb.id=detail.component_id and detail.category_id=bb.category_id
                         left Join component_expansioncase exp_case on exp_case.id=detail.component_id and detail.category_id=exp_case.category_id
                         left Join component_powerconversion con on con.id=detail.component_id and detail.category_id=con.category_id
                         left Join component_expansionflesh exp_flesh on exp_flesh.id=detail.component_id and detail.category_id=exp_flesh.category_id
                         left Join component_connectingline exp_line on exp_line.id=detail.component_id and detail.category_id=exp_line.category_id
                         left Join component_disk_expansioncase disk_exp_case on disk_exp_case.id=detail.component_id and detail.category_id=disk_exp_case.category_id
                         left Join component_disk_modeoption disk_mode on disk_mode.id=detail.component_id and detail.category_id=disk_mode.category_id
                         left join component_base_info info  on  info.id=mem.base_info_id
                           or  info.id=io.base_info_id
                           or  info.id=disk.base_info_id
                           or  info.id=cpu.base_info_id
                           or  info.id=power.base_info_id
                           or  info.id=back.base_info_id
                           or  info.id=line.base_info_id
                           or  info.id=other.base_info_id
                           or  info.id=ac.base_info_id
                        or  info.id=bb.base_info_id
                        or info.id=exp_case.base_info_id
                        or info.id=exp_flesh.base_info_id
                        or info.id=exp_line.base_info_id
                        or info.id=disk_exp_case.base_info_id
                        or info.id=disk_mode.base_info_id
                        or info.id=con.base_info_id
                         where detail.template_id='${templateId}'  and  detail.solution_id='${solutionId}'and detail.product_id='${productId}' and detail.machine_id='${machineId}'`;
  await new Promise(function(resolve, reject) {
    $db.all(sql, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data) {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let obj = {
        component_count: item.component_count,
        template_desc: item.description,
        description_en: item.description_en,
        name: item.name,
        nameCN: item.category_name,
        template_name: item.component_FC,
        component_id: item.component_PN,
        total_price_cn: item.listprice_onshore,
        total_price_en: item.listprice_offshore,
        category: item.category_id
      };
      total_price_cn += (obj.total_price_cn == null || obj.total_price_cn == undefined
          || obj.total_price_cn == '')?0.00:parseFloat(obj.total_price_cn)*obj.component_count;
      total_price_en += (obj.total_price_en == null || obj.total_price_en == undefined
          || obj.total_price_en == '')?0.00:parseFloat(obj.total_price_en)*obj.component_count;
    }
    result.total_price_cn = total_price_cn;
    result.total_price_en = total_price_en;
  });
  return result;
}
async function getProductId(systemType,systemModel){
  const SQL = `SELECT id FROM product_info WHERE machine_model = '${systemType}' AND machine_submodel= '${systemModel}'`;
  let productId = 0;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    if (data.length > 0){
      productId = data[0].id;
    }
  });
  return productId;
}
async function getProductId(systemType,systemModel){
  const SQL = `SELECT id FROM product_info WHERE machine_model = '${systemType}' AND machine_submodel= '${systemModel}'`;
  let productId = 0;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    if (data.length > 0){
      productId = data[0].id;
    }
  });
  return productId;
}
async function delMachineById(machineId){
  const SQL = `UPDATE machine_info SET status = 0  WHERE id = ${machineId}`;
  await new Promise(function(resolve, reject) {
    $db.run(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data)  {
  });
}
function isNumber(c) {
  let reg = /^\+?[1-9][0-9]*$/;　　//正整数
  if (c == null || c == undefined || c == ''){
    return false;
  }
  if (reg.test(c)){
    return true;
  }
  return false;
}
async function getMachineId(solutionId,productId,status,count,templateId){
  let maxMachineId = 0;
  let machineId = 0;
  try {
    const sql = `SELECT id FROM machine_info ORDER BY id DESC LIMIT 1`;
    await new Promise(function (resolve, reject) {
      $db.get(sql, (err, res) => {
        if (err) {
          resolve(null);
        } else {
          resolve(res);
        }
      });
    }).then(async function (result) {
      if (result) {
        maxMachineId = result.id;
        let machineName = '机器' + (maxMachineId + 1);
        /*向 machine_info表中插入 数据*/
        const SQL = `INSERT into machine_info(product_id,solution_id,templete_id,remark_name,status,count)
                    values('${productId}','${solutionId}','${templateId}',
                    '${machineName}','${status}','${count}')`;
        await new Promise(function (resolve, reject) {
          $db.run(SQL, (err, res) => {
            if (err) {
              resolve(null);
            } else {
              resolve(res);
            }
          });
        }).then(async function (data) {
          //获取刚插入的machineId
          machineId = maxMachineId + 1;
        });
      } else {
        //当前数据库中没有机器，先将机器一些信息入库，返回id拼接机器名称，执行修改
        const insertSQL = `INSERT into machine_info(product_id,solution_id,templete_id,status,count)
                        values('${productId}','${solutionId}','${templateId}','${status}','${count}')`;
        await new Promise(function (resolve, reject) {
          $db.run(insertSQL, (err, res) => {
            if (err) {
              resolve(null);
            } else {
              resolve(res);
            }
          });
        }).then(async function (data) {
          const getMaxSql = `SELECT id FROM machine_info ORDER BY id DESC LIMIT 1`;
          await new Promise(function (resolve, reject) {
            $db.get(getMaxSql, (err, res) => {
              if (err) {
                resolve(null);
              } else {
                resolve(res);
              }
            });
          }).then(async function (result) {
            if (result) {
              let name = '机器'+ result.id;
              const updateSQL = `UPDATE machine_info SET remark_name = '${name}' WHERE id = '${result.id}' `;
              await new Promise(function (resolve, reject) {
                $db.run(updateSQL, (err, res) => {
                  if (err) {
                    resolve(null);
                  } else {
                    resolve(res);
                  }
                });
              }).then(async function (data) {
                machineId = result.id;
              })
            }
          });
        });

      }
    })
  }catch (e) {

  }
  return machineId;
}
//获取产品下硬件集合
async function getDataListHW(productId){
  let dataListHW = [];
  const SQL = `
                            select disk.id,disk.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk disk on  info.id=disk.base_info_id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select mem.id,mem.category_id,info.component_FC,info.productId from component_base_info info
                            join component_memory mem on  mem.base_info_id = info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select cpu.id,cpu.category_id,info.component_FC,info.productId from component_base_info info
                            join component_cpu cpu on  cpu.base_info_id = info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select power.id,power.category_id,info.component_FC,info.productId from component_base_info info
                            join component_power power on  power.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select io.id,io.category_id,info.component_FC,info.productId from component_base_info info
                            join component_iocard io on  io.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select back.id,back.category_id,info.component_FC,info.productId from component_base_info info
                            join component_backplane back on  back.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select line.id,line.category_id,info.component_FC,info.productId from component_base_info info
                            join component_powerline line on  line.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select cpuact.id,cpuact.category_id,info.component_FC,info.productId from component_base_info info
                            join component_cpu_activation cpuact on  cpuact.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select bare.id,bare.category_id,info.component_FC,info.productId from component_base_info info
                            join component_barebone bare on  bare.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select other.id, other.category_id,info.component_FC,info.productId from component_base_info info
                            join component_other other on  other.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1 and other.category_id !=11
                            union
                            select con.id,con.category_id,info.component_FC,info.productId from component_base_info info
                            join component_powerconversion con on  con.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select iocase.id,iocase.category_id,info.component_FC,info.productId from component_base_info info
                            join component_expansioncase iocase on iocase.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select flesh.id,flesh.category_id,info.component_FC,info.productId from component_base_info info
                            join component_expansionflesh flesh on  flesh.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select connect.id,connect.category_id,info.component_FC,info.productId from component_base_info info
                            join component_connectingline connect on  connect.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select diskcase.id,diskcase.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk_expansioncase diskcase on  diskcase.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select diskmode.id,diskmode.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk_modeoption diskmode on  diskmode.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    dataListHW = data;
  });
  return  dataListHW;
}
//获取E950产品下硬件集合
async function getDataListHW950(productId){
  let dataListHW = [];
  const SQL = `
                            select disk.id,disk.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk disk on  info.id=disk.base_info_id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select mem.id,mem.category_id,info.component_FC,info.productId from component_base_info info
                            join component_memory mem on  mem.base_info_id = info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select cpu.id,cpu.category_id,info.component_FC,info.productId from component_base_info info
                            join component_cpu cpu on  cpu.base_info_id = info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select power.id,power.category_id,info.component_FC,info.productId from component_base_info info
                            join component_power power on  power.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select io.id,io.category_id,info.component_FC,info.productId from component_base_info info
                            join component_iocard io on  io.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select back.id,back.category_id,info.component_FC,info.productId from component_base_info info
                            join component_backplane back on  back.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select line.id,line.category_id,info.component_FC,info.productId from component_base_info info
                            join component_powerline line on  line.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select bare.id,bare.category_id,info.component_FC,info.productId from component_base_info info
                            join component_barebone bare on  bare.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select other.id, other.category_id,info.component_FC,info.productId from component_base_info info
                            join component_other other on  other.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select con.id,con.category_id,info.component_FC,info.productId from component_base_info info
                            join component_powerconversion con on  con.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select iocase.id,iocase.category_id,info.component_FC,info.productId from component_base_info info
                            join component_expansioncase iocase on iocase.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select flesh.id,flesh.category_id,info.component_FC,info.productId from component_base_info info
                            join component_expansionflesh flesh on  flesh.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select connect.id,connect.category_id,info.component_FC,info.productId from component_base_info info
                            join component_connectingline connect on  connect.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select diskcase.id,diskcase.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk_expansioncase diskcase on  diskcase.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select diskmode.id,diskmode.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk_modeoption diskmode on  diskmode.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select mc.id,mc.category_id,info.component_FC,info.productId from component_base_info info
                            join component_memoryrisercard mc on  mc.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    dataListHW = data;
  });
  return  dataListHW;
}
/**
 * 判断是否为空
 * @param sText
 * @returns {boolean}
 */
function isEmpty(sText) {
  if (sText == null || sText == undefined || sText == '') {
    return true;
  } else if (sText.trim().length == 0) {
    return true;
  }
  return false;
}

/**
 * 添加方案
 * @param solutionInfo
 * @returns {Promise<number>}
 */
async function addSolutions(solutionInfo){
  let splits = solutionInfo.split("##");
  splits[2] = splits[2] + rand(1000,9999);
  const SQL = `INSERT INTO solution (customer_name,project_name,solution_name,sales_manager,pre_sales_manager,
                            ship_date,description) VALUES('${splits[0]}','${splits[1]}','${splits[2]}','${splits[3]}',
                            '${splits[4]}','${splits[5]}','${splits[6]}')`;
  let solutionId = 0;
  await new Promise(function(resolve, reject) {
    $db.run(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data){
    //获取刚插入的solutionId
    const sql = `SELECT id FROM solution ORDER BY id DESC LIMIT 1`;
    await new Promise(function(resolve, reject) {
      $db.get(sql, (err, res) => {
        if (err) {
          resolve(null);
        } else {
          resolve(res);
        }
      });
    }).then(async (result) => {
      const relationSQL = `insert into relation_solution_product(solution_id,product_id)
        select (select max(id) from solution),id from product_info group by id `;
      //插入 relation_solution_product
      await new Promise(function(resolve, reject) {
        $db.run(relationSQL, (err, res) => {
          if (err) {
            resolve(null);
          } else {
            resolve(res);
          }
        });
      })
      solutionId = result.id;
    })
  });
  return solutionId;
}

async function delSolutionById(solutionId){
  const SQL = `DELETE FROM solution WHERE id = ${solutionId}`;
  await new Promise(function(resolve, reject) {
    $db.run(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data)  {
  });
}
async function checkTemplateId(templateId){
  const SQL = `SELECT * FROM product_templete AS pt
                    LEFT JOIN product_templete_detail AS ptd ON ptd.template_id = pt.id
                    WHERE pt.id = '${templateId}'`;
  let flag = false;
  await new Promise((resolve, reject) =>{
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data)  {
    if (data.length > 0){
      flag = true;
    }
  });
  return flag;
}
//获取产品下维保集合
//获取产品下软件集合(不包含维保)
async function getDataListSWMA(productId){
  let dataListSWMA = [];
  const SQL = `select soft.id,soft.software_FC,soft.category_id ,soft.Classify from component_software soft
                        where soft.software_type=3 and soft.productId=${productId}`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data)  {
    dataListSWMA = data;
  });
  return  dataListSWMA;
}
//获取产品下软件集合(不包含维保)
async function getDataListSW(productId){
  let dataListSW = [];
  const SQL = `SELECT cs.id,cs.category_id FROM component_software AS cs
                LEFT JOIN product_software AS ps ON cs.id = ps.software_id
                WHERE ps.product_id = ${productId} AND cs.deleted = 1`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data)  {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let obj = {
        id:item.id,
        category_id:item.category_id
      }
      //获取所有携带的子组件
      let sql = `select id,software_FC,software_type,Classify,category_id from component_software cs
                            where cs.id in(
                            select carry_software_id from software_software where choice_software_id= ${item.id}
                            ) and cs.software_type != 3 and productId= ${productId}`;
      await new Promise(function(resolve, reject) {
        $db.all(sql, (err, res) => {
          if (err) {
            resolve(null);
          } else {
            resolve(res);
          }
        });
      }).then((result) => {
        obj.list = result
      });
      dataListSW.push(obj);
    }
  });
  return  dataListSW;
}
async function addMachinePriceHW (priceType,obj){
  let SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_price,discount,discount_price,configure_type,list_dollar_price,dollar_discount,discount_dollar_price)
                     VALUES('${obj.productId}','${obj.solutionId}','${obj.machineId}',
                    '${obj.totalPrice}','${obj.discount}','${obj.discountPrice}','${obj.configureType}','${obj.totalPrice_en}','${obj.dollarDiscount}','${obj.discountPrice_en}')`;
  // if (priceType == 0){
  //     SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_price,discount,discount_price,configure_type)
  //     VALUES('${obj.productId}','${obj.solutionId}','${obj.machineId}',
  //     '${obj.totalPrice}','${obj.discount}','${obj.discountPrice}','${obj.configureType}')`;
  // }else{
  //     SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_dollar_price,discount,discount_dollar_price,configure_type)
  //     VALUES('${obj.productId}','${obj.solutionId}','${obj.machineId}',
  //     '${obj.totalPrice}','${obj.discount}','${obj.discountPrice}','${obj.configureType}')`;
  // }
  $db.run(SQL, (err, res) => {
    if (err) {
      console.log("添加失败")
    } else {
      console.log("添加成功")
    }
  })
}
async function calculationPriceSW(solutionId,productId,machineId,templateId,hpoFlag){
  let total_price_cn = 0;
  let total_price_en = 0;
  let resultSW = {};
  const sql = `SELECT T1.software_category,cs.*,
                   (SELECT machine_model FROM product_info WHERE id = ${productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${solutionId} AND template_id = ${templateId} AND machine_id = ${machineId} AND product_id = ${productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${solutionId} AND template_id = ${templateId} AND machine_id = ${machineId} AND product_id = ${productId}) as logicNum
            FROM component_software cs
            INNER JOIN
            (SELECT
            ss.carry_software_id,ss.software_category,ss.qty FROM product_programme_detail ppd
            INNER JOIN software_software ss ON ppd.component_id = ss.choice_software_id
            WHERE ppd.category_id IN (21,14,15,42) AND ppd.solution_id = ${solutionId}
            AND ppd.template_id = ${templateId} AND ppd.machine_id = ${machineId} AND ppd.product_id = ${productId} ORDER BY   ss.carry_software_id
            ) T1
            ON T1.carry_software_id = cs.id
            WHERE cs.software_type != 3
            UNION
            SELECT  ppd.category_id AS software_category,cs.*,
                               (SELECT machine_model FROM product_info WHERE id = ${productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${solutionId} AND template_id = ${templateId} AND machine_id = ${machineId} AND product_id = ${productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${solutionId} AND template_id = ${templateId} AND machine_id = ${machineId} AND product_id = ${productId}) as logicNum
            FROM component_software cs LEFT JOIN product_programme_detail ppd
                    ON cs.id = ppd.component_id
                    WHERE ppd.category_id IN (18,19,20) AND ppd.solution_id = ${solutionId} AND ppd.template_id = ${templateId}
                    AND ppd.machine_id = ${machineId}  AND ppd.product_id = ${productId}`;
  await new Promise(function(resolve, reject) {
    $db.all(sql, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data) {
    let tempData = [];
    let typeModelList = [];
    //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
    for (let i = 0; i < data.length; i++) {
      let obj = {
        component_count: '',
        template_desc: data[i].software_des,
        software_desCN:data[i].software_desCN,
        name: data[i].software_category,
        nameCN: '',
        template_name: data[i].software_FC,
        component_id: data[i].software_PN,
        Classify: data[i].Classify
      };
      if (data[i].purchase != undefined && data[i].purchase != null
          && data[i].purchase != '' && data[i].purchase == 'N/C') {
        obj.component_count = 1;
        obj.purchase = 0;
        obj.USDPurchase= 0;
      } else {
        obj.component_count = data[i].cpuActiveNum;
        obj.purchase = data[i].purchase;
        obj.USDPurchase= data[i].USDPurchase;
      }
      if (data[i].Classify == data[i].type + '-' + data[i].model) {
        //逻辑分区
        if (data[i].category_id == 13) {
          obj.component_count = data[i].logicNum;
          //操作系统
        } else if (data[i].category_id == 14) {
          obj.component_count = 1;
        } else {
          obj.component_count = data[i].cpuActiveNum;
        }
        typeModelList.push(obj);
        continue;
      }
      //硬件 HPO
      if (data[i].category_id == 33 || data[i].category_id == 34) {
        //不需要显示HPO
        if (!hpoFlag){
          continue;
        }
        obj.component_count = 1;
        tempData.push(obj);
        continue;
      }

      tempData.push(obj);
    }
    for (let o = 0; o < tempData.length; o++) {
      let item = tempData[o];
      let objSW = {
        component_count: parseInt(item.component_count),
        total_price_cn: (item.purchase != undefined && item.purchase != null
            && item.purchase != ''&& item.purchase == 'N/C')? 0.00:parseFloat(item.purchase),
        total_price_en: (item.USDPurchase != undefined && item.USDPurchase != null
            && item.USDPurchase != ''&& item.USDPurchase == 'N/C')? 0.00:parseFloat(item.USDPurchase)
      };
      total_price_cn += objSW.component_count * objSW.total_price_cn;
      total_price_en += objSW.component_count * objSW.total_price_en;
    }
    resultSW.total_price_cn = total_price_cn;
    resultSW.total_price_en = total_price_en;
  });
  return resultSW;
}
async function calculationPrice(solutionId,productId,machineId,templateId){
  let total_price_cn = 0;
  let total_price_en = 0;
  let result = {};
  const sql = ` select info.component_PN,info.component_FC,detail.category_id,info.name,info.category_name,info.description,info.description_en,
                detail.component_count,info.listprice_onshore,info.listprice_offshore,info.status
                         from product_programme_detail detail
                         left join solution           so     on  so.id=detail.solution_id
                         left join component_memory   mem   on  mem.id =detail.component_id and detail.category_id=mem.category_id
                         left join component_iocard   io    on io.id   =detail.component_id and detail.category_id=io.category_id
                         left join component_disk     disk  on disk.id =detail.component_id and detail.category_id=disk.category_id
                         left join component_cpu      cpu    on  cpu.id  =detail.component_id and detail.category_id=cpu.category_id
                         left join component_power    power  on  power.id=detail.component_id and detail.category_id=power.category_id
                         left join component_backplane back  on  back.id =detail.component_id and detail.category_id=back.category_id
                         left join component_powerline    line    on line.id=detail.component_id  and detail.category_id=line.category_id
                         left join component_cpu_activation ac    on ac.id=detail.component_id  and detail.category_id=ac.category_id
                         left join component_other    other  on  other.id=detail.component_id and detail.category_id=other.category_id
                         left join component_barebone    bb  on  bb.id=detail.component_id and detail.category_id=bb.category_id
                         left Join component_expansioncase exp_case on exp_case.id=detail.component_id and detail.category_id=exp_case.category_id
                         left Join component_powerconversion con on con.id=detail.component_id and detail.category_id=con.category_id
                         left Join component_expansionflesh exp_flesh on exp_flesh.id=detail.component_id and detail.category_id=exp_flesh.category_id
                         left Join component_connectingline exp_line on exp_line.id=detail.component_id and detail.category_id=exp_line.category_id
                         left Join component_disk_expansioncase disk_exp_case on disk_exp_case.id=detail.component_id and detail.category_id=disk_exp_case.category_id
                         left Join component_disk_modeoption disk_mode on disk_mode.id=detail.component_id and detail.category_id=disk_mode.category_id
                         left join component_base_info info  on  info.id=mem.base_info_id
                           or  info.id=io.base_info_id
                           or  info.id=disk.base_info_id
                           or  info.id=cpu.base_info_id
                           or  info.id=power.base_info_id
                           or  info.id=back.base_info_id
                           or  info.id=line.base_info_id
                           or  info.id=other.base_info_id
                           or  info.id=ac.base_info_id
                        or  info.id=bb.base_info_id
                        or info.id=exp_case.base_info_id
                        or info.id=exp_flesh.base_info_id
                        or info.id=exp_line.base_info_id
                        or info.id=disk_exp_case.base_info_id
                        or info.id=disk_mode.base_info_id
                        or info.id=con.base_info_id
                         where detail.template_id='${templateId}'  and  detail.solution_id='${solutionId}'and detail.product_id='${productId}' and detail.machine_id='${machineId}'`;
  await new Promise(function(resolve, reject) {
    $db.all(sql, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data) {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let obj = {
        component_count: item.component_count,
        template_desc: item.description,
        description_en: item.description_en,
        name: item.name,
        nameCN: item.category_name,
        template_name: item.component_FC,
        component_id: item.component_PN,
        total_price_cn: item.listprice_onshore,
        total_price_en: item.listprice_offshore,
        category: item.category_id
      };
      total_price_cn += (obj.total_price_cn == null || obj.total_price_cn == undefined
          || obj.total_price_cn == '')?0.00:parseFloat(obj.total_price_cn)*obj.component_count;
      total_price_en += (obj.total_price_en == null || obj.total_price_en == undefined
          || obj.total_price_en == '')?0.00:parseFloat(obj.total_price_en)*obj.component_count;
    }
    result.total_price_cn = total_price_cn;
    result.total_price_en = total_price_en;
  });
  return result;
}
async function calculationPrice950(solutionId,productId,machineId,templateId){
  let total_price_cn = 0;
  let total_price_en = 0;
  let result = {};
  const sql = ` select info.component_PN,info.component_FC,detail.category_id,info.name,info.category_name,info.description,info.description_en,
                detail.component_count,info.listprice_onshore,info.listprice_offshore,info.status
                         from product_programme_detail detail
                         left join solution           so     on  so.id=detail.solution_id
                         left join component_memory   mem   on  mem.id =detail.component_id and detail.category_id=mem.category_id
                         left join component_iocard   io    on io.id   =detail.component_id and detail.category_id=io.category_id
                         left join component_disk     disk  on disk.id =detail.component_id and detail.category_id=disk.category_id
                         left join component_cpu      cpu    on  cpu.id  =detail.component_id and detail.category_id=cpu.category_id
                         left join component_power    power  on  power.id=detail.component_id and detail.category_id=power.category_id
                         left join component_backplane back  on  back.id =detail.component_id and detail.category_id=back.category_id
                         left join component_powerline    line    on line.id=detail.component_id  and detail.category_id=line.category_id
                         left join component_cpu_activation ac    on ac.id=detail.component_id  and detail.category_id=ac.category_id
                         left join component_other    other  on  other.id=detail.component_id and detail.category_id=other.category_id
                         left join component_barebone    bb  on  bb.id=detail.component_id and detail.category_id=bb.category_id
                         left Join component_expansioncase exp_case on exp_case.id=detail.component_id and detail.category_id=exp_case.category_id
                         left Join component_powerconversion con on con.id=detail.component_id and detail.category_id=con.category_id
                         left Join component_expansionflesh exp_flesh on exp_flesh.id=detail.component_id and detail.category_id=exp_flesh.category_id
                         left Join component_connectingline exp_line on exp_line.id=detail.component_id and detail.category_id=exp_line.category_id
                         left Join component_disk_expansioncase disk_exp_case on disk_exp_case.id=detail.component_id and detail.category_id=disk_exp_case.category_id
                         left Join component_disk_modeoption disk_mode on disk_mode.id=detail.component_id and detail.category_id=disk_mode.category_id
                         left join component_memoryrisercard memcard on memcard.category_id=detail.category_id and memcard.id=detail.component_id
                         left join component_base_info info  on  info.id=mem.base_info_id
                           or  info.id=io.base_info_id
                           or  info.id=disk.base_info_id
                           or  info.id=cpu.base_info_id
                           or  info.id=power.base_info_id
                           or  info.id=back.base_info_id
                           or  info.id=line.base_info_id
                           or  info.id=other.base_info_id
                           or  info.id=ac.base_info_id
                        or  info.id=bb.base_info_id
                        or info.id=exp_case.base_info_id
                        or info.id=exp_flesh.base_info_id
                        or info.id=exp_line.base_info_id
                        or info.id=disk_exp_case.base_info_id
                        or info.id=disk_mode.base_info_id
                        or info.id=con.base_info_id
                        or info.id=memcard.base_info_id
                         where detail.template_id='${templateId}'  and  detail.solution_id='${solutionId}'and detail.product_id='${productId}' and detail.machine_id='${machineId}'`;
  await new Promise(function(resolve, reject) {
    $db.all(sql, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data) {
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let obj = {
        component_count: item.component_count,
        template_desc: item.description,
        description_en: item.description_en,
        name: item.name,
        nameCN: item.category_name,
        template_name: item.component_FC,
        component_id: item.component_PN,
        total_price_cn: item.listprice_onshore,
        total_price_en: item.listprice_offshore,
        category: item.category_id
      };
      total_price_cn += (obj.total_price_cn == null || obj.total_price_cn == undefined
          || obj.total_price_cn == '')?0.00:parseFloat(obj.total_price_cn)*obj.component_count;
      total_price_en += (obj.total_price_en == null || obj.total_price_en == undefined
          || obj.total_price_en == '')?0.00:parseFloat(obj.total_price_en)*obj.component_count;
    }
    result.total_price_cn = total_price_cn;
    result.total_price_en = total_price_en;
  });
  return result;
}
async function addHardwareList(hardwareList){
  if (hardwareList.length == 0){
    return false;
  }
  let SQL = `INSERT INTO product_programme_detail(product_id,machine_id,category_id,component_id,solution_id,
                                template_id,component_count,is_expansion,powerline_type,expansion_mode_id) values`;
  for (let i = 0; i < hardwareList.length; i++) {
    if (i == hardwareList.length -1){
      SQL = SQL + `('${hardwareList[i].productId}','${hardwareList[i].machineId}','${hardwareList[i].categoryId}',
                                    '${hardwareList[i].componentId}','${hardwareList[i].solutionId}','${hardwareList[i].templateId}',
                                    '${hardwareList[i].componentCount}','${hardwareList[i].isExpansion}','${hardwareList[i].powerlineType}','${hardwareList[i].expansionModeId}')`;
    }else {
      SQL = SQL + `('${hardwareList[i].productId}','${hardwareList[i].machineId}','${hardwareList[i].categoryId}',
                                    '${hardwareList[i].componentId}','${hardwareList[i].solutionId}','${hardwareList[i].templateId}',
                                    '${hardwareList[i].componentCount}','${hardwareList[i].isExpansion}','${hardwareList[i].powerlineType}','${hardwareList[i].expansionModeId}'),`;
    }
  }
  await new Promise(function(resolve, reject) {
    $db.run(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function (data){

  });

}
//获取产品下硬件集合
async function getDataListHW(productId){
  let dataListHW = [];
  const SQL = `
                            select disk.id,disk.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk disk on  info.id=disk.base_info_id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select mem.id,mem.category_id,info.component_FC,info.productId from component_base_info info
                            join component_memory mem on  mem.base_info_id = info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select cpu.id,cpu.category_id,info.component_FC,info.productId from component_base_info info
                            join component_cpu cpu on  cpu.base_info_id = info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select power.id,power.category_id,info.component_FC,info.productId from component_base_info info
                            join component_power power on  power.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select io.id,io.category_id,info.component_FC,info.productId from component_base_info info
                            join component_iocard io on  io.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select back.id,back.category_id,info.component_FC,info.productId from component_base_info info
                            join component_backplane back on  back.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select line.id,line.category_id,info.component_FC,info.productId from component_base_info info
                            join component_powerline line on  line.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select cpuact.id,cpuact.category_id,info.component_FC,info.productId from component_base_info info
                            join component_cpu_activation cpuact on  cpuact.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select bare.id,bare.category_id,info.component_FC,info.productId from component_base_info info
                            join component_barebone bare on  bare.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select other.id, other.category_id,info.component_FC,info.productId from component_base_info info
                            join component_other other on  other.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1 and other.category_id !=11
                            union
                            select con.id,con.category_id,info.component_FC,info.productId from component_base_info info
                            join component_powerconversion con on  con.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select iocase.id,iocase.category_id,info.component_FC,info.productId from component_base_info info
                            join component_expansioncase iocase on iocase.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select flesh.id,flesh.category_id,info.component_FC,info.productId from component_base_info info
                            join component_expansionflesh flesh on  flesh.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select connect.id,connect.category_id,info.component_FC,info.productId from component_base_info info
                            join component_connectingline connect on  connect.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select diskcase.id,diskcase.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk_expansioncase diskcase on  diskcase.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select diskmode.id,diskmode.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk_modeoption diskmode on  diskmode.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    dataListHW = data;
  });
  return  dataListHW;
}
//获取E950产品下硬件集合
async function getDataListHW950(productId){
  let dataListHW = [];
  const SQL = `
                            select disk.id,disk.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk disk on  info.id=disk.base_info_id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select mem.id,mem.category_id,info.component_FC,info.productId from component_base_info info
                            join component_memory mem on  mem.base_info_id = info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select cpu.id,cpu.category_id,info.component_FC,info.productId from component_base_info info
                            join component_cpu cpu on  cpu.base_info_id = info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select power.id,power.category_id,info.component_FC,info.productId from component_base_info info
                            join component_power power on  power.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select io.id,io.category_id,info.component_FC,info.productId from component_base_info info
                            join component_iocard io on  io.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select back.id,back.category_id,info.component_FC,info.productId from component_base_info info
                            join component_backplane back on  back.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select line.id,line.category_id,info.component_FC,info.productId from component_base_info info
                            join component_powerline line on  line.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select bare.id,bare.category_id,info.component_FC,info.productId from component_base_info info
                            join component_barebone bare on  bare.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select other.id, other.category_id,info.component_FC,info.productId from component_base_info info
                            join component_other other on  other.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select con.id,con.category_id,info.component_FC,info.productId from component_base_info info
                            join component_powerconversion con on  con.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select iocase.id,iocase.category_id,info.component_FC,info.productId from component_base_info info
                            join component_expansioncase iocase on iocase.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select flesh.id,flesh.category_id,info.component_FC,info.productId from component_base_info info
                            join component_expansionflesh flesh on  flesh.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select connect.id,connect.category_id,info.component_FC,info.productId from component_base_info info
                            join component_connectingline connect on  connect.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select diskcase.id,diskcase.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk_expansioncase diskcase on  diskcase.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select diskmode.id,diskmode.category_id,info.component_FC,info.productId from component_base_info info
                            join component_disk_modeoption diskmode on  diskmode.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1
                            union
                            select mc.id,mc.category_id,info.component_FC,info.productId from component_base_info info
                            join component_memoryrisercard mc on  mc.base_info_id=info.id
                            where info.productId=${productId} and info.deleted=1`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    dataListHW = data;
  });
  return  dataListHW;
}
async function getProductId(systemType,systemModel){
  const SQL = `SELECT id FROM product_info WHERE machine_model = '${systemType}' AND machine_submodel= '${systemModel}'`;
  let productId = 0;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    if (data.length > 0){
      productId = data[0].id;
    }
  });
  return productId;
}
function isNumber(c) {
  let reg = /^\+?[1-9][0-9]*$/;　　//正整数
  if (c == null || c == undefined || c == ''){
    return false;
  }
  if (reg.test(c)){
    return true;
  }
  return false;
}
/**
 * 判断是否为空
 * @param sText
 * @returns {boolean}
 */
function isEmpty(sText) {
  if (sText == null || sText == undefined || sText == '') {
    return true;
  } else if (sText.trim().length == 0) {
    return true;
  }
  return false;
}
function rand(min,max) {
  return Math.floor(Math.random()*(max-min))+min;
}

