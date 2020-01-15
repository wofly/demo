import moment from 'moment';
import $ from 'jquery';
import exportExcel from './exportExcel';
import exportSolutionCFR from './exportSolutionCFR.js';
import cfrConvert from './cfrConvert';
import Vue from 'vue'; //引入vue
let vm = new Vue();
let $db;
setTimeout(()=>{
  $db = vm.$db; //不是undefined了
},2000);
//JSON数据源：该数据源后期将被封装后直接提供
const jsonstr = {
  'csvHeadInSource': {},
  'machineInSource': {
    'systemInfo': {},
    'machinePropertiesInfo': []
  }
};
const VERSION_NO = '19091 190919';
export default {
  async exportCfrOrCsv950(machineName, tailName, productId,solutionId, templateId, machineId) {
    await getDataListHWSW(machineName, tailName, productId, solutionId, templateId, machineId);
  }
};

/**
 * 获取所有硬/软件配置集合
 * @param tailName
 * @param solutionId
 */
async function getDataListHWSW(machineName, tailName, productId,solutionId, templateId, machineId) {
  let dataListHW = [];//硬件
  dataListHW = await getDataListHW(productId,solutionId, templateId, machineId);
  let dataListSW = [];//软件
  dataListSW = await getDataListSW(productId,solutionId, templateId, machineId);
  let swmaList = [];//维保
  swmaList = await getDataListSWMA(productId,solutionId, templateId, machineId);
  let solutionList = [];
  if (tailName == 'xlsx') {
    //某個方案信息 -- 後面導出excel使用
    solutionList = await getSolutionList(solutionId);
  } else if (tailName == 'ips') {
    solutionList = await getSolutionList(solutionId);
  }
  jsonToFile(machineName, tailName, dataListHW, dataListSW, swmaList, solutionList);
}


/**
 * 获取某个方案信息
 * @param solutionId
 */
async function getSolutionList(solutionId) {
  let solutionList = [];
  const SQL = `SELECT * FROM solution WHERE id = ${solutionId}`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    solutionList = data;
  });
  return solutionList;
}

/**
 * 获取硬件配置集合
 * @param tailName
 * @param solutionId
 */
async function getDataListHW(productId,solutionId, templateId, machineId) {
  let dataListHW = [];
  // 获取数据
  const SQL = `SELECT
                detail.id,info.component_PN,info.component_FC,info.name, info.description, info.description_en,detail.component_count,detail.category_id,detail.component_id,
                info.listprice_onshore,info.listprice_offshore,so.ship_date,pi.machine_model,pi.machine_submodel,  pi.description AS pdesc,  info.withdraw_date     
                FROM product_programme_detail detail               
                LEFT JOIN component_cpu cpu ON   cpu.id = detail.component_id AND detail.category_id = cpu.category_id               
                LEFT JOIN component_iocard io ON io.id = detail.component_id AND detail.category_id =io.category_id
                LEFT JOIN component_disk disk ON disk.id = detail.component_id AND detail.category_id =disk.category_id
                LEFT JOIN component_power power ON power.id = detail.component_id AND detail.category_id =power.category_id
                LEFT JOIN component_memory mem ON mem.id = detail.component_id AND detail.category_id =mem.category_id
                LEFT JOIN component_backplane back ON back.id = detail.component_id  AND detail.category_id =back.category_id
                LEFT JOIN component_barebone bare ON bare.id = detail.component_id AND detail.category_id =bare.category_id
                LEFT JOIN component_powerline line ON line.id = detail.component_id AND detail.category_id = line.category_id
                LEFT JOIN component_other other ON other.id = detail.component_id AND detail.category_id =other.category_id
                LEFT JOIN component_powerconversion con ON con.id = detail.component_id AND detail.category_id =con.category_id
                LEFT JOIN component_expansioncase expan ON expan.id = detail.component_id AND detail.category_id =expan.category_id
                LEFT JOIN component_expansionflesh flesh ON flesh.id = detail.component_id AND detail.category_id =flesh.category_id
                LEFT JOIN component_connectingline nectline ON nectline.id = detail.component_id AND detail.category_id =nectline.category_id
                LEFT JOIN component_disk_expansioncase diskexpan ON diskexpan.id = detail.component_id AND detail.category_id =diskexpan.category_id
                LEFT JOIN component_disk_modeoption mode ON mode.id = detail.component_id AND detail.category_id =mode.category_id
				LEFT JOIN component_memoryrisercard memcard on memcard.id=detail.component_id and memcard.category_id=detail.category_id
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id
                LEFT JOIN component_base_info info 
				on  info.id=io.base_info_id
               or  info.id=disk.base_info_id
               or  info.id=cpu.base_info_id
               or  info.id=power.base_info_id
               or  info.id=back.base_info_id
               or  info.id=line.base_info_id
               or  info.id=other.base_info_id
               or  info.id=mem.base_info_id
               or  info.id=bare.base_info_id
               or info.id=con.base_info_id
               or info.id=expan.base_info_id
               or info.id=flesh.base_info_id
               or info.id=nectline.base_info_id
               or info.id=diskexpan.base_info_id
               or info.id=mode.base_info_id	
               or info.id=memcard.base_info_id
               WHERE   detail.solution_id=${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND info.productId = ${productId}
               UNION ALL
               SELECT
               detail.id,1 AS component_PN,1 AS component_FC,null, null, null,detail.component_count,detail.category_id,detail.component_id,
               null,null,null,null,null,  null,  null   
               FROM product_programme_detail detail 
               LEFT JOIN component_software soft ON   soft.id = detail.component_id AND detail.category_id = soft.category_id  
               LEFT JOIN solution so ON so.id = detail.solution_id
               LEFT JOIN product_info pi ON pi.id = detail.product_id
               WHERE  detail.category_id = 33 AND  detail.solution_id=${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}`;
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
  //获取用户手动修改的FC数据
  let additionList = [];
  additionList = await getAdditionFeatures(productId,solutionId, templateId, machineId);
  for (let i = dataListHW.length - 1; i >= 0 ; i--) {
    for (let j = additionList.length - 1; j >= 0 ; j--) {
      //存在手动修改的FC
      if (dataListHW[i].id == additionList[j].origin_fc_id) {
        dataListHW[i].component_FC = additionList[j].fc_code;
        dataListHW[i].component_count = additionList[j].fc_cnt;
        dataListHW[i].description = additionList[j].fc_desc;
        dataListHW[i].description_en = additionList[j].fc_desc;
        //category_id 不变
        dataListHW[i].component_PN = '';
        dataListHW[i].listprice_onshore = '';
        dataListHW[i].ship_date = '';
        dataListHW[i].machine_model =  '';
        dataListHW[i].machine_submodel = '';
        dataListHW[i].pdesc = '';
        dataListHW[i].withdraw_date = '';
        additionList.splice(j,1);
      }
    }
  }
  //用户手动输入添加的FC
  for (let k = 0; k < additionList.length; k++) {
    let obj = {
      component_FC : additionList[k].fc_code,
      component_count : additionList[k].fc_cnt,
      description : additionList[k].fc_desc,
      description_en : additionList[k].fc_desc,
      //category_id 不变???
      category_id: '',
      component_PN : '',
      listprice_onshore : '',
      ship_date : '',
      machine_model : '',
      machine_submodel : '',
      pdesc : '',
      withdraw_date : ''
    }
    dataListHW.push(obj);
  }
  return dataListHW;
}

/**
 * 获取用户手动修改FC的数据(硬件)
 * @param productId
 * @param solutionId
 * @param templateId
 * @param machineId
 * @returns {Promise<Array>}
 */
async function getAdditionFeatures(productId,solutionId, templateId, machineId) {
  let additionDataList = [];
  // 获取数据
  const SQL = `SELECT maf.* FROM manual_addition_feature AS maf
     LEFT JOIN product_programme_detail AS ppd ON ppd.id = maf.origin_fc_id
     WHERE maf.product_id = ${productId} 
     AND maf.machine_id = ${machineId} AND maf.solution_id = ${solutionId} AND maf.template_id = ${templateId}
     AND maf.fc_type = 0`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    additionDataList = data;
  });
  return additionDataList;
}

/**
 * 获取用户手动修改FC的数据(软件/HPO)
 * @param productId
 * @param solutionId
 * @param templateId
 * @param machineId
 * @returns {Promise<Array>}
 */
async function getAdditionFeaturesSW(productId,solutionId, templateId, machineId) {
  let additionDataList = [];
  // 获取数据
  const SQL = `SELECT maf.*,cs.software_type FROM manual_addition_feature AS maf
     LEFT JOIN component_software AS cs ON cs.id = maf.origin_fc_id
     WHERE maf.product_id = ${productId} 
     AND maf.machine_id = ${machineId} AND maf.solution_id = ${solutionId} AND maf.template_id = ${templateId}
     AND maf.fc_type = 1 `;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    additionDataList = data;
  });
  return additionDataList;
}

/**
 * 获取软件配置集合
 * @param tailName
 * @param solutionId
 */
async function getDataListSW(productId,solutionId, templateId, machineId) {
  let dataListSW = [];
  // 获取数据
  const SQL = `SELECT T1.software_category,T1.qty,cs.*,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13 
            AND solution_id = ${solutionId} AND template_id = ${templateId} AND machine_id = ${machineId} AND product_id = ${productId}) as logicNum
            FROM component_software cs 
            INNER JOIN 
            (SELECT  
            ss.carry_software_id,ss.software_category,ss.qty FROM product_programme_detail ppd
            INNER JOIN software_software ss ON ppd.component_id = ss.choice_software_id
            WHERE ppd.category_id IN (21,15,14,42) AND ppd.solution_id = ${solutionId} 
            AND ppd.template_id = ${templateId} AND ppd.machine_id = ${machineId} AND ppd.product_id = ${productId} ORDER BY   ss.carry_software_id
            ) T1
            ON T1.carry_software_id = cs.id 
            WHERE cs.software_type != 3`;
  await new Promise(function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    dataListSW = data;
  });
  //获取用户手动修改的FC数据
  let additionList = [];
  additionList = await getAdditionFeaturesSW(productId,solutionId, templateId, machineId);
  additionList = additionList.filter((c)=>{
    return c.software_type != 3
  });
  for (let i = dataListSW.length - 1; i >= 0 ; i--) {
    dataListSW[i].addition_flag = '0';
    for (let j = additionList.length - 1; j >= 0 ; j--) {
      //存在手动修改的FC
      if (dataListSW[i].id == additionList[j].origin_fc_id) {
        dataListSW[i].software_FC = additionList[j].fc_code,
            dataListSW[i].software_des = additionList[j].fc_desc,
            dataListSW[i].software_desCN = additionList[j].fc_desc,
            dataListSW[i].qty = additionList[j].fc_cnt,
            //category_id 不变 Classify 不变
            dataListSW[i].software_PN = '',
            dataListSW[i].purchase = 'N/C',
            dataListSW[i].withdraw_date = '';
        dataListSW[i].addition_flag = '1';
        additionList.splice(j,1);
      }
    }
  }
  //用户手动输入添加的FC
  for (let k = 0; k < additionList.length; k++) {
    let obj = {
      software_FC : additionList[k].fc_code,
      qty : additionList[k].fc_cnt,
      software_desCN : additionList[k].fc_desc,
      software_des : additionList[k].fc_desc,
      //category_id 不变???
      category_id: '',
      Classify : '',
      software_PN : '',
      purchase : 'N/C',
      withdraw_date : '',
      addition_flag: '2'
    }
    dataListSW.push(obj);
  }
  return dataListSW;
}

/**
 * 获取软件配置集合
 * @param tailName
 * @param solutionId
 */
async function getDataListSWMA(productId,solutionId, templateId, machineId) {
  let dataListSWMA = [];
  //维保中FEATURE不为空
  let SWMA = [];
  // 获取数据
  const SQL = `SELECT  ppd.component_count,cs.*,ppd.category_id AS software_category FROM component_software cs LEFT JOIN product_programme_detail ppd
                    ON cs.id = ppd.component_id
                    WHERE ppd.category_id IN (18,19,20) AND ppd.solution_id = ${solutionId} AND ppd.template_id = ${templateId} 
                    AND ppd.machine_id = ${machineId}  AND ppd.product_id = ${productId}`;
  await new Promise(async function(resolve, reject) {
    $db.all(SQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then(async function(data) {
    for (let i = 0; i < data.length; i++) {
      dataListSWMA.push(data[i]);
      if (data[i].software_FC != undefined && data[i].software_FC != null && data[i].software_FC != '') {
        dataListSWMA = await getRenewalList(dataListSWMA, data[i]);
      }
    }
  });
  //获取用户手动修改的FC数据
  let additionList = [];
  additionList = await getAdditionFeaturesSW(productId,solutionId, templateId, machineId);
  //过滤出维保数据
  additionList = additionList.filter((k)=>{
    return k.software_type == 3 || isEmpty(k.software_type)
  });
  for (let i = dataListSWMA.length - 1; i >= 0 ; i--) {
    dataListSWMA[i].addition_flag = '0';
    for (let j = additionList.length - 1; j >= 0 ; j--) {
      //存在手动修改的FC
      if (dataListSWMA[i].id == additionList[j].origin_fc_id) {
        dataListSWMA[i].software_FC = additionList[j].fc_code,
            dataListSWMA[i].software_des = additionList[j].fc_desc,
            dataListSWMA[i].software_desCN = additionList[j].fc_desc,
            dataListSWMA[i].component_count = additionList[j].fc_cnt,
            //category_id 不变 Classify 不变
            dataListSWMA[i].software_PN = '',
            dataListSWMA[i].purchase = 'N/C',
            dataListSWMA[i].withdraw_date = '';
        dataListSWMA[i].addition_flag = '1';
        additionList.splice(j,1);
      }
    }
  }
  //用户手动输入添加的FC
  for (let k = 0; k < additionList.length; k++) {
    let obj = {
      software_FC: additionList[k].fc_code,
      component_count: additionList[k].fc_cnt,
      software_desCN: additionList[k].fc_desc,
      software_des: additionList[k].fc_desc,
      //category_id 不变???
      category_id: '',
      Classify: '',
      software_PN: '',
      purchase: 'N/C',
      withdraw_date: '',
      addition_flag: '2'
    }
    dataListSWMA.push(obj);
  }
  return dataListSWMA;
}

/**
 * 获取维保续期
 * @param dataListSWMA
 * @param v
 * @returns {Promise<*>}
 */
async function getRenewalList(dataListSWMA, v) {
  let renewalObj = {};
  const renewalSQL = `SELECT ss.qty AS component_count,cs.*,ss.choice_software_id FROM component_software cs 
                        LEFT JOIN software_software ss ON cs.id = ss.carry_software_id
                        WHERE ss.choice_software_id = ${v.id}`;
  await new Promise(function(resolve, reject) {
    $db.all(renewalSQL, (err, res) => {
      if (err) {
        resolve(null);
      } else {
        resolve(res);
      }
    });
  }).then((data) => {
    for (let i = 0; i < data.length; i++) {
      data[i].software_category = v.software_category;
      dataListSWMA.push(data[i]);
    }
  });
  return dataListSWMA;
}

/**
 * 导出数据组装
 * @param tailName
 * @param dataListHW
 * @param dataListSW
 * @param swmaList
 */
function jsonToFile(machineName, tailName, dataListHW, dataListSW, swmaList, solutionList) {
  //文档存储的参数初始化
  let name = '';
  let resultStr = '';
  //excel导出数据
  let excelJson = {
    solutionList: [],//方案信息
    fixedList: [],//固定头首行
    headList: [],//机器头
    dataList: [], //FEATURE
    allList:[]
  };
  if (tailName === 'csv') {
    name = machineName + '-' + 'IPSConfiguration' + moment()
        .format('YYYYMMDDHHmmss') + '.' + tailName;
    resultStr = 'data:text/csv;charset=utf-8,';
  }
//================================固定列头定义：json数据源的列信息=====================================================start
  //数据源的key信息
  let jsonstrSource = [ 'csvHeadInSource', 'machineInSource' ];

  //csv头部标题
  let csvHead = [ 'CFR DATE', 'CFR APPLICATION', 'BRAND', 'TYPE', 'USER DESCRIPTION', 'COUNTRY CODE', 'COUNTRY', 'LANGUAGE', 'LOCKED', 'EXPIRATION DATE', 'CODE', '', '', '', '', '', '', '', '', '', '', '' ];

  //机器系统信息
  let systemInfo = [ 'SYSTEM SEQ', 'SYSTEM DESC', 'SYSTEM TYPE', 'SYSTEM MODEL', 'SYSTEM SN', 'SYSTEM SEO', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ];

  //机器属性信息
  let machinePropertiesInfo = [ 'LINE NO', 'MTM', 'FEATURE', 'DESCRIPTION', 'QUANTITY', 'TYPE', 'PRODUCT', 'SYSTEM', 'CPUSIU', 'CHARGEABLE', 'CRAD', 'FROM TYPE', 'FROM MODEL', 'FROM SN', 'FROM SYSTEM TYPE', 'FROM SYSTEM NO', 'INSTALL DATE', 'CUSTNO', 'TO TYPE', 'TO MODEL', 'TO SN', 'TO SYSTEM TYPE', 'TO SYSTEM NO' ];
//====================================================================================================================end
//==========================================数据源准备：从json数据源中获取的数据========================================start

  //依次取出json源数据中的value
  let csvHeadResource = getValueFromJsonByKey(jsonstr, jsonstrSource[0]);
  let machineInSource = getValueFromJsonByKey(jsonstr, jsonstrSource[1]);

  //修改csv文档的创建时间
  setValueInJsonByKey(csvHeadResource, 'CFR DATE', moment()
      .format('YYYY-MM-DD'));
  setValueInJsonByKey(csvHeadResource, 'CFR APPLICATION', 'e-Config Disconnected (' + VERSION_NO + ')');
  setValueInJsonByKey(csvHeadResource, 'BRAND', 'POWER');
  setValueInJsonByKey(csvHeadResource, 'TYPE', 'HWSW');
  setValueInJsonByKey(csvHeadResource, 'COUNTRY CODE', '672');
  setValueInJsonByKey(csvHeadResource, 'LANGUAGE', 'zh');
  setValueInJsonByKey(csvHeadResource, 'LOCKED', 'N');
  setValueInJsonByKey(csvHeadResource, 'CODE', 'INITIAL ORDER CONFIGURATION');
  //修改csv文档的过期时间
  setValueInJsonByKey(csvHeadResource, 'EXPIRATION DATE', moment()
      .add(20, 'days')
      .format('YYYY-MM-DD'));

  //取出源数据中的机器系统数据
  let systemInfoSource = getValueFromJsonByKey(machineInSource, 'systemInfo');
  let machinePropertiesInfoSource = getValueFromJsonByKey(machineInSource, 'machinePropertiesInfo');

  setValueInJsonByKey(systemInfoSource, 'SYSTEM SEQ', 'SYSTEM 1');
  setValueInJsonByKey(systemInfoSource, 'SYSTEM DESC', 'Server 1');
  //修改产品类型-型号
  setValueInJsonByKey(systemInfoSource, 'SYSTEM TYPE', dataListHW[0].machine_model);
  setValueInJsonByKey(systemInfoSource, 'SYSTEM MODEL', dataListHW[0].machine_submodel);
  setValueInJsonByKey(systemInfoSource, 'SYSTEM SN', '');
  setValueInJsonByKey(systemInfoSource, 'SYSTEM SEO', '');
  //excel导出
  excelJson.fixedList.push(csvHeadResource);
  excelJson.headList.push(systemInfoSource);

  /*如果fc相同，就将数据和并，数量相加*/
  let arr=[]
  dataListHW.forEach((item,index)=>{
    if(arr.length==0){
      return arr.push(item)
    }
    for (let i=0;i<=arr.length;i++){
      if(i==arr.length){
        return arr.push(item)
      }
      if(arr[i].component_FC == item.component_FC){
        return arr[i].component_count += item.component_count
      }

    }
  })
  dataListHW = arr;
  //system type
  let machine_model = dataListHW[0].machine_model;
  let machine_submodel = dataListHW[0].machine_submodel;
  let type_model = machine_model + '-' + machine_submodel;
  let relatedList = [];
  let hpoList = [];

  let lookPrice = localStorage.getItem("userId") == null?'1': localStorage.getItem("userId");
  //筛选出cpu激活核心数
  let cupActive = dataListHW.filter((obj) => {
    return obj.category_id == 11;
  });

  //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
  for (let i = dataListSW.length - 1; i >= 0; i--) {
    if (lookPrice == '1'){
      dataListSW[i].purchase = 'N/C';
      dataListSW[i].USDPurchase = 'N/C';
    }
    if (dataListSW[i].qty == 0){
      dataListSW[i].component_count = cupActive[0].component_count;
    }else{
      dataListSW[i].component_count = dataListSW[i].qty;
    }
    if (dataListSW[i].Classify == type_model) {
      relatedList.push(dataListSW[i]);
      dataListSW.splice(i, 1);
      continue;
    }
    //硬件 HPO
    if (dataListSW[i].category_id == 33 || dataListSW[i].category_id == 34) {
      let obj = {
        'component_PN': dataListSW[i].software_PN,
        'component_FC': dataListSW[i].software_FC,
        'description': '',
        'description_en': dataListSW[i].software_des,
        'component_count': dataListSW[i].component_count,
        'category_id': dataListSW[i].category_id,
        'listprice_onshore': dataListSW[i].purchase == 'N/C' ? 'N' : 'Y',
        'ship_date': '',
        'machine_model': '',
        'machine_submodel': '',
        'pdesc': '',
        'Classify': dataListSW[i].Classify
      };
      hpoList.push(obj);
      dataListSW.splice(i, 1);
      continue;
    }
  }

  //筛选出HPO是否开启导出标识
  let hpoExportFlag = false;
  //筛选出HPO是否开启导出标识
  for (let i = 0; i < dataListHW.length; i++) {
    let obj = dataListHW[i];
    if (obj.category_id == 33){
      hpoExportFlag = true;
      dataListHW.splice(i,1);
      break;
    }
  }
  //获取逻辑分区分区数
  for (let j = 0; j < relatedList.length; j++) {
    let obj = {
      'component_PN': relatedList[j].software_PN,
      'component_FC': relatedList[j].software_FC,
      'description': '',
      'description_en': relatedList[j].software_des,
      'component_count': relatedList[j].component_count,
      'category_id': relatedList[j].category_id,
      'listprice_onshore': '',
      'ship_date': '',
      'machine_model': '',
      'machine_submodel': '',
      'pdesc': ''
    };
    //逻辑分区
    if (relatedList[j].category_id == 13) {
      obj.component_count = relatedList[j].logicNum;
      //操作系统
    } else if (relatedList[j].category_id == 14) {
      obj.component_count = relatedList[j].component_count;
    } else if (relatedList[j].category_id == 15){
      obj.component_count = cupActive[0].component_count;
    }
    dataListHW.push(obj);
  };

  //清空上次生成数据
  machinePropertiesInfoSource = [];
  //区分首行， 硬件中首行
  let flagHW = true;
  //CRAD日期
  let cradDate = moment(dataListHW[0].ship_date)
      .format('YYYY-MM-DD');
  //循环硬件列表数据
  for (let i = 0; i < dataListHW.length + 1; i++) {
    let machinePropertyHW = {
      'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
      'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
      'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
      'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
    };
    if (flagHW) {

      setValueInJsonByKey(machinePropertyHW, 'LINE NO', getLineNo(1, i));
      setValueInJsonByKey(machinePropertyHW, 'MTM',
          machine_model + '-' + machine_submodel);
      setValueInJsonByKey(machinePropertyHW, 'DESCRIPTION', dataListHW[i].pdesc);
      setValueInJsonByKey(machinePropertyHW, 'QUANTITY', appendToString(1));
      setValueInJsonByKey(machinePropertyHW, 'TYPE', 'NEW');
      setValueInJsonByKey(machinePropertyHW, 'PRODUCT', 'Hardware');
      setValueInJsonByKey(machinePropertyHW, 'SYSTEM', appendToString(1));
      setValueInJsonByKey(machinePropertyHW, 'CPUSIU', appendToString(1));
      setValueInJsonByKey(machinePropertyHW, 'CRAD', cradDate);
      if (lookPrice == '1') {
        setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'Y');
      }else{
        setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'N');
      }
      setValueInJsonByKey(machinePropertyHW, 'FROM TYPE', getValueFromJsonByKey(systemInfoSource, 'SYSTEM TYPE'));
      setValueInJsonByKey(machinePropertyHW, 'FROM MODEL', getValueFromJsonByKey(systemInfoSource, 'SYSTEM MODEL'));
      flagHW = false;
    } else {
      setValueInJsonByKey(machinePropertyHW, 'LINE NO', getLineNo(1, i));
      setValueInJsonByKey(machinePropertyHW, 'FEATURE', dataListHW[i - 1].component_FC);
      setValueInJsonByKey(machinePropertyHW, 'DESCRIPTION', dataListHW[i - 1].description_en);
      setValueInJsonByKey(machinePropertyHW, 'QUANTITY', appendToString(dataListHW[i - 1].component_count));
      setValueInJsonByKey(machinePropertyHW, 'TYPE', 'ADD');
      //价格为0 也是可以定价的
      if (lookPrice == '1'){
        setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'N');
      }else{
        if (dataListHW[i - 1].listprice_onshore != undefined && dataListHW[i - 1].listprice_onshore != null && dataListHW[i - 1].listprice_onshore != '') {
          setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'Y');
        } else {
          setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'N');
        }
      }

    }
    machinePropertiesInfoSource.push(machinePropertyHW);
  }

  if (hpoExportFlag) {
    //循环HPO
    let flagHPO = true;
    //筛选出HPO中FC为空
    let emptyHPO = {};
    for (let k = hpoList.length - 1; k >= 0; k--) {
      if (hpoList[k].component_FC == undefined || hpoList[k].component_FC == null || hpoList[k].component_FC == '') {
        emptyHPO = hpoList[k];
        hpoList.splice(k, 1);
      }
    }
    //循环HPO集合
    for (let i = 0; i < hpoList.length + 1; i++) {
      let machinePropertyHPO = {
        'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
        'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
        'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
        'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
      };
      if (flagHPO) {
        setValueInJsonByKey(machinePropertyHPO, 'LINE NO', getLineNo(2, i));
        setValueInJsonByKey(machinePropertyHPO, 'MTM',
            emptyHPO.Classify);
        setValueInJsonByKey(machinePropertyHPO, 'DESCRIPTION', emptyHPO.software_des);
        setValueInJsonByKey(machinePropertyHPO, 'QUANTITY', appendToString(emptyHPO.component_count));
        setValueInJsonByKey(machinePropertyHPO, 'TYPE', 'NEW');
        setValueInJsonByKey(machinePropertyHPO, 'PRODUCT', 'Hardware');
        setValueInJsonByKey(machinePropertyHPO, 'SYSTEM', appendToString(1));
        setValueInJsonByKey(machinePropertyHPO, 'CPUSIU', appendToString(0));
        setValueInJsonByKey(machinePropertyHPO, 'CRAD', cradDate);
        setValueInJsonByKey(machinePropertyHPO, 'CHARGEABLE', emptyHPO.listprice_onshore);
        setValueInJsonByKey(machinePropertyHPO, 'FROM TYPE', emptyHPO.Classify.substring(0, 4));
        setValueInJsonByKey(machinePropertyHPO, 'FROM MODEL', emptyHPO.Classify.substring(5));
        flagHPO = false;
      } else {
        setValueInJsonByKey(machinePropertyHPO, 'LINE NO', getLineNo(2, i));
        setValueInJsonByKey(machinePropertyHPO, 'FEATURE', hpoList[i - 1].component_FC);
        setValueInJsonByKey(machinePropertyHPO, 'DESCRIPTION', hpoList[i - 1].description_en);
        if (hpoList[i - 1].component_count == undefined){
          setValueInJsonByKey(machinePropertyHPO, 'QUANTITY', appendToString(1));
        }else{
          setValueInJsonByKey(machinePropertyHPO, 'QUANTITY', appendToString(hpoList[i - 1].component_count));
        }
        setValueInJsonByKey(machinePropertyHPO, 'TYPE', 'ADD');
        setValueInJsonByKey(machinePropertyHPO, 'CHARGEABLE', hpoList[i - 1].listprice_onshore);
      }
      machinePropertiesInfoSource.push(machinePropertyHPO);
    }

    //导出手动添加FC数据
    let additionListSW = dataListSW.filter((c)=>{
      return c.addition_flag == '2';
    });
    for (let o = 0; o < additionListSW.length; o++) {
      let machinePropertySW2 = {
        'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
        'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
        'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
        'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
      };
      setValueInJsonByKey(machinePropertySW2, 'LINE NO',
          (parseInt(getValueFromJsonByKey(machinePropertiesInfoSource[machinePropertiesInfoSource.length-1],'LINE NO'))+1)+'');
      setValueInJsonByKey(machinePropertySW2, 'FEATURE', additionListSW[o].software_FC);
      setValueInJsonByKey(machinePropertySW2, 'DESCRIPTION', additionListSW[o].software_des);
      setValueInJsonByKey(machinePropertySW2, 'TYPE', 'ADD');
      setValueInJsonByKey(machinePropertySW2, 'CHARGEABLE', 'N');
      setValueInJsonByKey(machinePropertySW2, 'QUANTITY', appendToString(additionListSW[o].component_count));
      machinePropertiesInfoSource.push(machinePropertySW2);
    }
  }
  //将维保集合里元素添加到软件集合中
  // swmaList.forEach(v=>{
  //     dataListSW.push(v);
  // });
  //判断软件集合中有多少分组
  // dataListSW = [];
  let headerSW = [];
  //讲软件中首行全部取出
  for (let n = dataListSW.length - 1; n >= 0; n--) {
    if (dataListSW[n].software_FC === undefined || dataListSW[n].software_FC === null || dataListSW[n].software_FC === '') {
      headerSW.push(dataListSW[n]);
      dataListSW.splice(n, 1);
    }
  }
  // headerSW = headerSW.reverse();
  //过滤出A6P光盘数据(操作系统)
  let operList = [];
  //过滤出A6P光盘数据(逻辑分区)
  let logicList = [];
  //过滤出A6P光盘数据(应用程序)
  let applicationList = [];
  for (let o = headerSW.length-1; o >= 0 ; o--) {
    if (headerSW[o].Classify.substring(5).toUpperCase() == 'A6P'&& headerSW[o].software_category == 1){
      operList.push(headerSW[o]);
      headerSW.splice(o,1);
      continue;
    }
    if (headerSW[o].Classify.substring(5).toUpperCase() == 'A6P'&& headerSW[o].software_category == 0){
      logicList.push(headerSW[o]);
      headerSW.splice(o,1);
      continue;
    }
    if (headerSW[o].Classify.substring(5).toUpperCase() == 'A6P'&& headerSW[o].software_category == 2){
      applicationList.push(headerSW[o]);
      headerSW.splice(o,1);
      continue;
    }
  }
  headerSW = operList.concat(logicList).concat(applicationList).concat(headerSW);
  for (let m = 0; m < headerSW.length; m++) {
    //区分首行， 软件中首行
    let flagSW = true;
    let num = 0;
    for (let j = 0; j < dataListSW.length; j++) {
      if (headerSW[m].Classify == dataListSW[j].Classify && headerSW[m].software_category == dataListSW[j].software_category) {
        let machinePropertySW = {
          'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
          'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
          'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
          'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
        };
        if (flagSW) {
          if (hpoExportFlag){
            setValueInJsonByKey(machinePropertySW, 'LINE NO', getLineNo(m + 3, num));
          }else{
            setValueInJsonByKey(machinePropertySW, 'LINE NO', getLineNo(m + 2, num));
          }
          setValueInJsonByKey(machinePropertySW, 'MTM', headerSW[m].Classify);
          setValueInJsonByKey(machinePropertySW, 'DESCRIPTION', headerSW[m].software_des);
          setValueInJsonByKey(machinePropertySW, 'QUANTITY', appendToString(headerSW[m].component_count));
          setValueInJsonByKey(machinePropertySW, 'TYPE', 'NEW');
          setValueInJsonByKey(machinePropertySW, 'PRODUCT', 'Software');
          setValueInJsonByKey(machinePropertySW, 'SYSTEM', appendToString(1));
          setValueInJsonByKey(machinePropertySW, 'CPUSIU', 0 + '');
          setValueInJsonByKey(machinePropertySW, 'CRAD', cradDate);
          setValueInJsonByKey(machinePropertySW, 'CHARGEABLE', 'N');
          setValueInJsonByKey(machinePropertySW, 'FROM TYPE', headerSW[m].Classify.substring(0, 4));
          setValueInJsonByKey(machinePropertySW, 'FROM MODEL', headerSW[m].Classify.substring(5));
          flagSW = false;
          machinePropertiesInfoSource.push(machinePropertySW);
          num++;

          let machinePropertySW1 = {
            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
          };
          if (hpoExportFlag){
            setValueInJsonByKey(machinePropertySW1, 'LINE NO', getLineNo(m + 3, num));
          }else{
            setValueInJsonByKey(machinePropertySW1, 'LINE NO', getLineNo(m + 2, num));
          }
          setValueInJsonByKey(machinePropertySW1, 'FEATURE', dataListSW[j].software_FC);
          setValueInJsonByKey(machinePropertySW1, 'DESCRIPTION', dataListSW[j].software_des);
          setValueInJsonByKey(machinePropertySW1, 'TYPE', 'ADD');
          if (dataListSW[j].purchase != undefined && dataListSW[j].purchase != null
              && dataListSW[j].purchase != '' && dataListSW[j].purchase == 'N/C') {
            setValueInJsonByKey(machinePropertySW1, 'CHARGEABLE', 'N');
          } else {
            setValueInJsonByKey(machinePropertySW1, 'CHARGEABLE', 'Y');
          }
          setValueInJsonByKey(machinePropertySW1, 'QUANTITY', appendToString(dataListSW[j].component_count));
          machinePropertiesInfoSource.push(machinePropertySW1);
          num++;
        } else {
          if (hpoExportFlag){
            setValueInJsonByKey(machinePropertySW, 'LINE NO', getLineNo(m + 3, num));
          }else{
            setValueInJsonByKey(machinePropertySW, 'LINE NO', getLineNo(m + 2, num));
          }
          setValueInJsonByKey(machinePropertySW, 'FEATURE', dataListSW[j].software_FC);
          setValueInJsonByKey(machinePropertySW, 'DESCRIPTION', dataListSW[j].software_des);
          setValueInJsonByKey(machinePropertySW, 'TYPE', 'ADD');
          if (dataListSW[j].purchase != undefined && dataListSW[j].purchase != null
              && dataListSW[j].purchase != '' && dataListSW[j].purchase == 'N/C') {
            setValueInJsonByKey(machinePropertySW, 'CHARGEABLE', 'N');
          } else {
            setValueInJsonByKey(machinePropertySW, 'CHARGEABLE', 'Y');
          }
          setValueInJsonByKey(machinePropertySW, 'QUANTITY', appendToString(dataListSW[j].component_count));
          num++;
          machinePropertiesInfoSource.push(machinePropertySW);
        }
      }
    }
  }
  //维保续订  (一级)
  let headerSWMA = [];
  // 维保续订 （三级）
  let thirdSWMA = [];
  //讲软件中首行全部取出
  for (let n = swmaList.length - 1; n >= 0; n--) {
    if (lookPrice == '1'){
      swmaList[n].purchase = 'N/C';
    }
    if (swmaList[n].software_FC === undefined || swmaList[n].software_FC === null || swmaList[n].software_FC === '') {
      headerSWMA.push(swmaList[n]);
      swmaList.splice(n, 1);
      continue;
    }
    if (swmaList[n].Classify === undefined || swmaList[n].Classify === null || swmaList[n].Classify === '') {
      thirdSWMA.push(swmaList[n]);
      swmaList.splice(n, 1);
      continue;
    }
  }
  // headerSWMA = headerSWMA.reverse();
  for (let m = 0; m < headerSWMA.length; m++) {
    //区分首行， 软件中首行
    let flagSWMA = true;
    let num = 0;
    for (let o = 0; o < swmaList.length; o++) {
      let machinePropertySWMA = {
        'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
        'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
        'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
        'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
      };
      if (headerSWMA[m].Classify == swmaList[o].Classify) {
        if (flagSWMA) {
          if (hpoExportFlag){
            setValueInJsonByKey(machinePropertySWMA, 'LINE NO', getLineNo(m + headerSW.length + 3, num));
          }else{
            setValueInJsonByKey(machinePropertySWMA, 'LINE NO', getLineNo(m + headerSW.length + 2, num));
          }
          setValueInJsonByKey(machinePropertySWMA, 'MTM', headerSWMA[m].Classify);
          setValueInJsonByKey(machinePropertySWMA, 'DESCRIPTION', headerSWMA[m].software_des);
          setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', appendToString(headerSWMA[m].component_count));
          setValueInJsonByKey(machinePropertySWMA, 'TYPE', 'NEW');
          setValueInJsonByKey(machinePropertySWMA, 'PRODUCT', 'Software');
          setValueInJsonByKey(machinePropertySWMA, 'SYSTEM', appendToString(1));
          setValueInJsonByKey(machinePropertySWMA, 'CPUSIU', 0 + '');
          setValueInJsonByKey(machinePropertySWMA, 'CRAD', cradDate);
          setValueInJsonByKey(machinePropertySWMA, 'CHARGEABLE', 'N');
          setValueInJsonByKey(machinePropertySWMA, 'FROM TYPE', headerSWMA[m].Classify.substring(0, 4));
          setValueInJsonByKey(machinePropertySWMA, 'FROM MODEL', headerSWMA[m].Classify.substring(5));
          flagSWMA = false;
          machinePropertiesInfoSource.push(machinePropertySWMA);
          num++;

          let machinePropertySWMA1 = {
            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
          };
          if (hpoExportFlag){
            setValueInJsonByKey(machinePropertySWMA1, 'LINE NO', getLineNo(m + headerSW.length + 3, num));
          }else{
            setValueInJsonByKey(machinePropertySWMA1, 'LINE NO', getLineNo(m + headerSW.length + 2, num));
          }
          setValueInJsonByKey(machinePropertySWMA1, 'FEATURE', swmaList[o].software_FC);
          setValueInJsonByKey(machinePropertySWMA1, 'DESCRIPTION', swmaList[o].software_des);
          setValueInJsonByKey(machinePropertySWMA1, 'TYPE', 'ADD');
          if (swmaList[o].purchase != undefined && swmaList[o].purchase != null
              && swmaList[o].purchase != '' && swmaList[o].purchase == 'N/C') {
            setValueInJsonByKey(machinePropertySWMA1, 'CHARGEABLE', 'N');
          } else {
            setValueInJsonByKey(machinePropertySWMA1, 'CHARGEABLE', 'Y');
          }
          setValueInJsonByKey(machinePropertySWMA1, 'QUANTITY', appendToString(swmaList[o].component_count));
          machinePropertiesInfoSource.push(machinePropertySWMA1);
          num++;
        } else {
          if (hpoExportFlag){
            setValueInJsonByKey(machinePropertySWMA, 'LINE NO', getLineNo(m + headerSW.length + 3, num));
          }else{
            setValueInJsonByKey(machinePropertySWMA, 'LINE NO', getLineNo(m + headerSW.length + 2, num));
          }
          setValueInJsonByKey(machinePropertySWMA, 'FEATURE', swmaList[o].software_FC);
          setValueInJsonByKey(machinePropertySWMA, 'DESCRIPTION', swmaList[o].software_des);
          setValueInJsonByKey(machinePropertySWMA, 'TYPE', 'ADD');
          if (swmaList[o].purchase != undefined && swmaList[o].purchase != null
              && swmaList[o].purchase != '' && swmaList[o].purchase == 'N/C') {
            setValueInJsonByKey(machinePropertySWMA, 'CHARGEABLE', 'N');
          } else {
            setValueInJsonByKey(machinePropertySWMA, 'CHARGEABLE', 'Y');
          }
          setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', appendToString(swmaList[o].component_count));

          num++;
          machinePropertiesInfoSource.push(machinePropertySWMA);
        }
        for (let k = 0; k < thirdSWMA.length; k++) {
          let machinePropertySWMA2 = {
            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
          };
          if (swmaList[o].id == thirdSWMA[k].choice_software_id) {
            if (hpoExportFlag){
              setValueInJsonByKey(machinePropertySWMA2, 'LINE NO', getLineNo(m + headerSW.length + 3, num));
            }else{
              setValueInJsonByKey(machinePropertySWMA2, 'LINE NO', getLineNo(m + headerSW.length + 2, num));
            }
            setValueInJsonByKey(machinePropertySWMA2, 'FEATURE', thirdSWMA[k].software_FC);
            setValueInJsonByKey(machinePropertySWMA2, 'DESCRIPTION', thirdSWMA[k].software_des);
            setValueInJsonByKey(machinePropertySWMA2, 'TYPE', 'ADD');
            if (thirdSWMA[k].purchase != undefined && thirdSWMA[k].purchase != null
                && thirdSWMA[k].purchase != '' && thirdSWMA[k].purchase == 'N/C') {
              setValueInJsonByKey(machinePropertySWMA2, 'CHARGEABLE', 'N');
            } else {
              setValueInJsonByKey(machinePropertySWMA2, 'CHARGEABLE', 'Y');
            }
            setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', appendToString(thirdSWMA[k].component_count));
            num++;
            machinePropertiesInfoSource.push(machinePropertySWMA2);

          }
        }

      }
    }
  }

  //excel导出数据
  excelJson.dataList = machinePropertiesInfoSource;
//====================================================================================================================end
//==========================================csv数据组装：开始生成csv的文件流信息组装====================================start

  //拼接csv文件的第一行固定行信息
  resultStr = setTittleByArray(csvHead, resultStr);

  //为csv根据固定航设置第二行数据
  resultStr = createDataBySourceJSON(csvHead, csvHeadResource, resultStr);

  //设置第三行的固定表头
  resultStr = setTittleByArray(systemInfo, resultStr);

  //以第三行的固定表头设置第四行的数据
  resultStr = createDataBySourceJSON(systemInfo, systemInfoSource, resultStr);

  //生成第五行固定行数据
  resultStr = setTittleByArray(machinePropertiesInfo, resultStr);
  //控制台打印最终结果
  //生成组件列表
  resultStr = createComponentByComponentsJSONData(machinePropertiesInfo, machinePropertiesInfoSource, resultStr);

  // console.log(resultStr);
//====================================================================================================================end
//===========================================文件数据导出=============================================================start
  //导出的文件
  if (tailName === 'csv') {
    generateCSV(name, resultStr);
  } else if (tailName === 'cfr') {
    //将硬件/软件/维保集合整合在一个List用于生成cfr是05注释使用
    let dataList = integrationList(dataListHW, dataListSW, swmaList);
    // generateCFR(machineName,resultStr);
    cfrConvert.cfrConvert(resultStr, machineName, dataList);
  } else if (tailName == 'ips') {
    let dataList = integrationList(dataListHW, dataListSW, swmaList);
    exportSolutionCFR.exportSolutionCFR.setValue(solutionList, machineName, cfrConvert.strConvertCfr(resultStr, machineName, false,dataList));
  } else {
    let solutionObj = {
      'CUSTOMER NAME': solutionList[0].customer_name,
      'PROJECT NAME': solutionList[0].project_name,
      'SOLUTION NAME': solutionList[0].solution_name,
      'SALES MANAGER': solutionList[0].sales_manager,
      'PRE SALES MANAGER': solutionList[0].pre_sales_manager,
      'SHIP DATE': solutionList[0].ship_date,
      'DESCRIPTION': solutionList[0].description
    };
    excelJson.solutionList.push(solutionObj);
    excelJson.allList = integrationList(dataListHW,dataListSW,swmaList);
    generateEXCEL(machineName, excelJson);
  }

}
function integrationList(dataListHW,dataListSW,swmaList){
  let dataList = [];
  let machineNumber = dataListHW[0].machine_model+dataListHW[0].machine_submodel;
  let CRADDate = dataListHW[0].ship_date;
  for (let i = 0; i < dataListHW.length; i++) {
    let obj = {
      machineNumber:machineNumber,
      featureCode:dataListHW[i].component_FC,
      withdrawDate:dataListHW[i].withdraw_date,
      CRADDate:CRADDate
    }
    dataList.push(obj);

  }
  for (let i = 0; i < dataListSW.length; i++) {
    let obj = {
      machineNumber:machineNumber,
      featureCode:dataListSW[i].software_FC,
      withdrawDate:dataListSW[i].withdraw_date,
      CRADDate:CRADDate
    }
    dataList.push(obj);
  }
  for (let i = 0; i < swmaList.length; i++) {
    let obj = {
      machineNumber:machineNumber,
      featureCode:swmaList[i].software_FC,
      withdrawDate:swmaList[i].withdraw_date,
      CRADDate:CRADDate
    }
    dataList.push(obj);
  }
  //过滤退市日期大于用户要求的供货日期 即 未即将过期的
  dataList = dataList.filter((c) => !isEmpty(c.withdrawDate) && c.CRADDate > c.withdrawDate);
  return dataList;
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
function getLineNo(first, num) {
  if (first > 0) {
    if (num > 9) {
      return first + '0' + num;
    } else if (num > 99) {
      return first + num + '';
    } else {
      return first + '00' + num;
    }
  }
  return null;
}

/**
 * 该方法的作用是取得json串（即jsonSeq）中key对应的的值
 * @param jsonSeq json的数据源
 * @param key   json数据源中的key
 */
function getValueFromJsonByKey(jsonSeq, key) {
  return jsonSeq[key];
}

/**
 *该方法的作用是对json串（即jsonSeq）中key设置成指定的值
 * @param jsonSeq
 * @param key
 * @param value
 */
function setValueInJsonByKey(jsonSeq, key, value) {
  jsonSeq[key] = value;
}

/**
 * 根据固定的头数据拼接固定行数据
 * @param csvFixedTittleArray 固定的头数据，如["CFR DATE", "CFR APPLICATIO.......
 * @param resultStr  被拼接的串
 * */
function setTittleByArray(csvFixedTittleArray, resultStr) {
  for (let csvTittleElement of csvFixedTittleArray) {

    //如果字符串不为空则拼接内容并添加逗号
    if (!csvTittleElement == '') {
      resultStr += csvTittleElement;
    }
    resultStr += ',';
  }
  resultStr = resultStr.substring(0, resultStr.length - 1);
  resultStr += '\n';
  return resultStr;
}

/**
 *根据给定的列数据和其对应的数据JSON生成该行数组指定的下一行数据
 * @param csvFixedTittleArray 固定的头数据，如["CFR DATE", "CFR APPLICATIO.......
 * @param fixedJSONData 上面的头对应的JSON数据源，如{"CFR DATE": "2019-03-05","CFR APPLICATION": 'ip.......
 * @param resultStr 被拼接的串
 */
function createDataBySourceJSON(csvFixedTittleArray, fixedJSONData, resultStr) {
  //用于暂时存储每次从json中取得的字段值
  let tempValue = '';
  for (let csvFixedTittleElement of csvFixedTittleArray) {
    tempValue = getValueFromJsonByKey(fixedJSONData, csvFixedTittleElement);

    //如果取得的值为存在且非空
    if (typeof tempValue !== undefined
        && tempValue
        && typeof tempValue.valueOf() === 'string') {
      resultStr += tempValue;
    }
    resultStr += ',';
  }
  resultStr += '\n';
  return resultStr;
}

/**
 * 组装组件的每一行数据
 * @param csvFixedTittleArray 固定的头数据，此处只处理组件部分的表头
 * @param fixedJSONData 上面的头对应的JSON数据源，此处只处理组件的数据源
 * @param resultStr 被拼接的串
 */
function createComponentByComponentsJSONData(csvFixedTittleArray, fixedJSONData, resultStr) {
  let tempValue = '';
  //外城循环为所有的行数，也是所有的组件数据
  for (let i = 0; i < fixedJSONData.length; i++) {

    //内层循环循环取本行数据的在表头数据名称对应的值
    for (let j = 0; j < csvFixedTittleArray.length; j++) {
      tempValue = getValueFromJsonByKey(fixedJSONData[i], csvFixedTittleArray[j]);

      //如果取得的值为存在且非空
      if (typeof tempValue !== undefined
          && tempValue
          && typeof tempValue.valueOf() === 'string') {

        //处理取出的字符串是否包含英文逗点，如果包含就在字符串两端添加双引号
        tempValue = tempValue.replace(/\"/g, '');
        if (tempValue.indexOf(',') !== -1) {
          resultStr = resultStr + '"' + tempValue + '"';
        } else {
          resultStr += tempValue;
        }
      }
      resultStr += ',';
    }
    resultStr = resultStr.substring(0, resultStr.length - 1);
    resultStr += '\n';
  }
  return resultStr;
}

/**
 * 文档存储到本地硬盘方法
 * @param name 文件名称
 * @param content 文档内容
 */
function generateCSV(name, csvContent) {
  //如果是IE浏览器
  if (window.navigator.msSaveOrOpenBlob) {
    let blob = new Blob([ decodeURIComponent(encodeURI(csvContent)) ], {
      type: 'text/csv;charset=utf-8;'
    });
    navigator.msSaveBlob(blob, name);
  } else {
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  }
}

/**
 * 创建sendPost方法用于发送ajax请求参数为字符串生成cfr文件
 * @param varJson
 */
function generateCFR(machineName, csvStr) {
  $.ajax({
    type: 'POST',//请求方式有post，get请求方式，这里是post请求
    url: 'http://172.31.2.182:8080/rest/uploadcsvstr',//请求的方法的路径
    data: { 'csvStr': csvStr },//这里的data是传往后台的参数
    success: function(result) {
      let name = machineName + '-' + 'IPSConfiguration' + moment()
          .format('YYYYMMDDHHmmss') + '.cfr';
      let header = 'data:application/octet-stream;charset=utf-8,';
      let cfrContent = header + result;
      //如果是IE浏览器
      if (window.navigator.msSaveOrOpenBlob) {
        let blob = new Blob([ decodeURIComponent(encodeURI(cfrContent)) ], {
          type: 'application/octet-stream;charset=utf-8;'
        });
        navigator.msSaveBlob(blob, name);
      } else {
        let encodedUri = encodeURI(cfrContent);
        let link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
      }
    }
  });
}

/**
 * excel导出
 */
function generateEXCEL(machineName, json) {
  exportExcel.exportExcel(machineName, json, 'xlsx');
}

/**
 * 非字符串类型拼接""  转换成字符串返回
 */
function appendToString(param) {
  if (param === '' || param === undefined || param === null) {
    return param;
  }
  if (typeof param === 'string') {
    return param;
  }

  return param += '';
}
