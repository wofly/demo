import moment from 'moment';
import $ from 'jquery';
import exportExcel from './exportExcel';
import exportSolutionCFR from './exportSolutionCFR.js';
import cfrConvert from './cfrConvert';
import dfu from './dataFormatUtil';

import Vue from 'vue'; //引入vue
let vm = new Vue();
let $db;
setTimeout(() => {
  $db = vm.$db; //不是undefined了
}, 2000);

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
  async exportExcel(isOpenPOWER, machineName, tailName, productId, solutionId, templateId, machineId) {
    return await getDataListHWSW(isOpenPOWER, machineName, tailName, productId, solutionId, templateId, machineId);
  }
};

/**
 * 获取所有硬/软件配置集合
 * @param tailName
 * @param solutionId
 */
async function getDataListHWSW(isOpenPOWER, machineName, tailName, productId, solutionId, templateId, machineId) {
  let dataListHW = [];//硬件
  dataListHW = await getDataListHW(productId, solutionId, templateId, machineId);
  let dataListSW = [];//软件
  dataListSW = await getDataListSW(productId, solutionId, templateId, machineId);
  let swmaList = [];//维保
  swmaList = await getDataListSWMA(productId, solutionId, templateId, machineId);
  let solutionList = await getSolutionList(solutionId);
  return await jsonToFile(isOpenPOWER, machineId, machineName, tailName, dataListHW, dataListSW, swmaList, solutionList);
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
async function getDataListHW(productId, solutionId, templateId, machineId) {
  let dataListHW = [];
  // 获取数据
  const SQL = `SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc,
                info.withdraw_date
                FROM
                component_base_info info
                JOIN component_cpu cpu ON info.id = cpu.base_info_id
                JOIN product_programme_detail detail ON cpu.id = detail.component_id 
                AND detail.category_id = 3
                LEFT JOIN component_category cate ON cate.id = cpu.category_id
                
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT cpu.base_info_id FROM component_cpu cpu WHERE cpu.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id = ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId} AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc,
                info.withdraw_date
                FROM
                component_base_info info
                LEFT JOIN component_iocard io ON info.id = io.base_info_id
                LEFT JOIN product_programme_detail detail ON io.id = detail.component_id 
                AND detail.category_id = 6
                
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT io.base_info_id FROM component_iocard io WHERE io.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id = ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc,
                info.withdraw_date 
                FROM
                component_base_info info
                JOIN component_disk disk ON info.id = disk.base_info_id
                JOIN product_programme_detail detail ON disk.id = detail.component_id 
                AND detail.category_id = 1
                
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT disk.base_info_id FROM component_disk disk WHERE disk.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id = ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc,
                 info.withdraw_date
                FROM
                component_base_info info
                JOIN component_power power ON info.id = power.base_info_id
                JOIN product_programme_detail detail ON power.id = detail.component_id 
                AND detail.category_id = 5
                
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT power.base_info_id FROM component_power power WHERE power.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id = ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                 info.withdraw_date
                FROM
                component_base_info info
                JOIN component_memory mem ON info.id = mem.base_info_id
                JOIN product_programme_detail detail ON mem.id = detail.component_id 
                AND detail.category_id = 2
                
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT mem.base_info_id FROM component_memory mem WHERE mem.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id = ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                 info.withdraw_date
                FROM
                component_base_info info
                JOIN component_backplane back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id 
                AND detail.category_id = 7
                
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_backplane back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                 info.withdraw_date
                FROM
                component_base_info info
                JOIN component_barebone back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id 
                AND detail.category_id = 16
                
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_barebone back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                 UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc,
                 info.withdraw_date 
                FROM
                component_base_info info
                JOIN component_cpu_activation back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id 
                AND detail.category_id = 11
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_cpu_activation back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                 UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc,
                 info.withdraw_date 
                FROM
                component_base_info info
                JOIN component_powerline back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id 
                AND detail.category_id = 8
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_powerline back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                 UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                 info.withdraw_date
                FROM
                component_base_info info
                JOIN component_other back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id 
                AND detail.category_id = back.category_id
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id 
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_other back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) ) 
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                info.withdraw_date
                FROM
                component_base_info info
                JOIN component_powerconversion back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id
                AND detail.category_id = 22
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_powerconversion back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) )
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                info.withdraw_date
                FROM
                component_base_info info
                JOIN component_expansioncase back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id
                AND detail.category_id = 23
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_expansioncase back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) )
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                info.withdraw_date
                FROM
                component_base_info info
                JOIN component_expansionflesh back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id
                AND detail.category_id = 24
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_expansionflesh back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) )
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                info.withdraw_date
                FROM
                component_base_info info
                JOIN component_connectingline back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id
                AND detail.category_id = 25
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_connectingline back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) )
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                info.withdraw_date
                FROM
                component_base_info info
                JOIN component_disk_expansioncase back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id
                AND detail.category_id = 26
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_disk_expansioncase back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) )
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                info.component_PN,
                info.component_FC,
                info.name,
                info.description,
                info.description_en,
                detail.component_count,
                detail.category_id,
                info.listprice_onshore,
                info.listprice_offshore,
                info.ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                info.withdraw_date
                FROM
                component_base_info info
                JOIN component_disk_modeoption back ON info.id = back.base_info_id
                JOIN product_programme_detail detail ON back.id = detail.component_id
                AND detail.category_id = 27
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id
                WHERE
                info.id IN ( SELECT back.base_info_id FROM component_disk_modeoption back WHERE back.id IN ( SELECT component_id FROM product_programme_detail ) )
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}
                UNION
                SELECT
                1 AS component_PN,
                1 AS component_FC,
                1 AS name,
                1 AS description,
                1 AS description_en,
                1 AS component_count,
                detail.category_id,
                1 AS listprice_onshore,
                1 as listprice_offshore,
                1 as ui_status,
                so.ship_date,
                pi.machine_model,
                pi.machine_submodel,
                pi.description AS pdesc ,
                1 AS withdraw_date
                FROM
                product_programme_detail detail 
                LEFT JOIN solution so ON so.id = detail.solution_id
                LEFT JOIN product_info pi ON pi.id = detail.product_id
                WHERE  detail.category_id = 33 
                AND so.id =  ${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}`;
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
  return dataListHW;
}

/**
 * 获取软件配置集合
 * @param tailName
 * @param solutionId
 */
async function getDataListSW(productId, solutionId, templateId, machineId) {
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
            WHERE ppd.category_id IN (21,14,15) AND ppd.solution_id = ${solutionId} 
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
  return dataListSW;
}

/**
 * 获取软件配置集合
 * @param tailName
 * @param solutionId
 */
async function getDataListSWMA(productId, solutionId, templateId, machineId) {
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
async function jsonToFile(systemFlag, machineId, machineName, tailName, dataListHW, dataListSW, swmaList, solutionList) {

  //获取当前用户的id用于得到权限信息
  let userId = localStorage.getItem('userId');

  if (userId == null) {
    return;
  }
  //如果当前的id只要不是1即可看价格
  let perm = dfu.numDeal(userId) == 1 ? false : true;

  //最后的对象
  let machineConf = [];

  let isOpenPOWER = systemFlag;
  //清单的停产警告打印标志,默认不打印警告
  let isDateWarn = false;

  let systemSettings = await dfu.selectOne('select * from sys_setting');

  let isRMB = (systemSettings.currency_type == 0 ? true : false);
  //设置人民币和美元的标志
  let currencyTypeStr = isRMB ? 'RMB' : 'USD';

  let machineInfo = await dfu.selectOne('select * from machine_info where id=' + machineId);

  //productInfo当前机器使用的产品
  let machine_productId = dfu.tryGetValue(machineInfo, 'product_id');
  let machine_productInfo = await dfu.selectOne('select * from product_info where id=' + machine_productId);

  //solution当前机器所属的方案
  let machine_solutionId = dfu.tryGetValue(machineInfo, 'solution_id');
  let machine_solution = await dfu.selectOne('select * from solution where id=' + machine_solutionId);
  let machine_ship_date = dfu.tryGetValue(machine_solution, 'ship_date');

  //hardPriceDetail该机器的硬件价格详情，softPriceDetail该机器的软件价格详情
  let machinePriceDetailList = await dfu.select('select * from machine_price_detail where machine_id=' + machineId);
  let hardPriceDetail = dfu.getObjFromArrayByProp(machinePriceDetailList, 'configure_type', 1);
  let softPriceDetail = dfu.getObjFromArrayByProp(machinePriceDetailList, 'configure_type', 2);

  //如果产品供货日期比退市日期晚，则isDateWarn为true，表示生成停产警告，否则不生成
  isDateWarn = new Date(machine_ship_date) - new Date(dfu.tryGetValue(machine_productInfo, 'withdraw_date')) > 0 ? isDateWarn : true;

  //文档存储的参数初始化
  let name = '';
  let resultStr = '';
  //excel导出数据
  let excelJson = {
    solutionList: [],//方案信息
    fixedList: [],//固定头首行
    headList: [],//机器头
    dataList: [], //FEATURE
    allList: []
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
  //Excel row18
  machineConf.push([ '机型', 'Feature code', '数量', '描述', '供货周期', '停产警告', '列表价未税', '自定义折扣率', '自定义折后价(未税）', '执行税率', '自定义折后价（含税）', '币种', 'PN', '软硬件类型' ]);


//line 19------------------------------------------------------------------------------------<
  //TODO Excel row19 待完善 该行显示的是machineIds所使用的产品的信息
  //机型
  let machineModel_19 = dfu.tryGetValue(machine_productInfo, 'machine_model');

  //model
  let machineSubmodel_19 = dfu.tryGetValue(machine_productInfo, 'machine_submodel');

  //机器数量
  let count_19 = dfu.tryGetValue(machineInfo, 'count');

  //描述
  let desc_19 = isOpenPOWER ? dfu.tryGetValue(machine_productInfo, 'product_des') : dfu.tryGetValue(machine_productInfo, 'product_des_en');
  desc_19 = desc_19 == null ? '' : desc_19;

  //供货周期
  let deliverCircle_19 = '';

  //停产警告
  let withdrawWarn = isDateWarn ? dfu.tryGetValue(machine_productInfo, 'withdraw_date') : '';


  //列表价未税
  let listPriceUnTax_19 = 0;
  for (let a = 0; a < dataListHW.length; a++) {
    if (dataListHW[a].category_id == 16) {
      let tempPrice = isRMB ? dataListHW[a].listprice_onshore : dataListHW[a].listprice_offshore;
      let tempCount = dataListHW[a].component_count;
      tempPrice = dfu.numDealUnToFixed(tempPrice) * dfu.numDealUnToFixed(tempCount);
      listPriceUnTax_19 += tempPrice;
    }
  }

  // 自定义折扣率
  let discount_19 = hardPriceDetail.discount;
  discount_19 = dfu.numDealUnToFixed(discount_19);

  //自定义折扣价（未税）
  let cusDiscountPriceUntax_19 = dfu.discountCompute(discount_19, listPriceUnTax_19, isRMB);
  cusDiscountPriceUntax_19 = dfu.numDealUnToFixed(cusDiscountPriceUntax_19);

  let tax_19 = systemSettings.tax;
  tax_19 = dfu.numDealUnToFixed(tax_19);

  //自定义折扣价（已税）
  let cusDiscountPriceAfterTax_19 = (eval(cusDiscountPriceUntax_19 + '*(1+' + tax_19 * 0.01 + ')'));

  machineConf.push([ machineModel_19, machineModel_19 + '-' + machineSubmodel_19, 1, isOpenPOWER ? machineModel_19 + '系列服务器 型号' + machineSubmodel_19 : machineModel_19 + ' Model ' + machineSubmodel_19, deliverCircle_19, withdrawWarn, dfu.priceShowPerm(perm, dfu.numDeal(listPriceUnTax_19)), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount_19)), dfu.priceShowPerm(perm, dfu.numDeal(cusDiscountPriceUntax_19)), dfu.priceShowPerm(perm, (dfu.numDealUnToFixed(systemSettings.tax)).toFixed(2) + '%'), dfu.priceShowPerm(perm, dfu.numDeal(cusDiscountPriceAfterTax_19)), currencyTypeStr, '', 1 ]);

//------------------------------------------------------------------------------------------------------------>


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
  let arr = [];
  dataListHW.forEach((item, index) => {
    if (arr.length == 0) {
      return arr.push(item);
    }
    for (let i = 0; i <= arr.length; i++) {
      if (i == arr.length) {
        return arr.push(item);
      }
      if (arr[i].component_FC == item.component_FC) {
        return arr[i].component_count += item.component_count;
      }
    }
  });
  dataListHW = arr;

  //system type
  let machine_model = dataListHW[0].machine_model;
  let machine_submodel = dataListHW[0].machine_submodel;
  let type_model = machine_model + '-' + machine_submodel;
  let relatedList = [];
  let hpoList = [];

  //筛选出cpu激活核心数
  let cupActive = dataListHW.filter((obj) => {
    return obj.category_id == 11;
  });

  //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
  for (let i = dataListSW.length - 1; i >= 0; i--) {
    if (dataListSW[i].qty == 0) {
      dataListSW[i].component_count = cupActive[0].component_count;
    } else {
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
        'component_FC': dataListSW[i].software_FC,
        software_FC: dataListSW[i].software_FC,
        'component_count': dataListSW[i].component_count,
        'listprice_onshore': dataListSW[i].purchase == 'N/C' ? 'N' : 'Y',
        'listprice_onshore_cpy': dataListSW[i].purchase,
        'ship_date': '',
        'machine_model': '',
        'machine_submodel': '',
        USDPurchase: dataListSW[i].USDPurchase,
        'description': dataListSW[i].software_desCN,
        software_des: dataListSW[i].software_des,
        'description_en': dataListSW[i].software_des,
        software_desCN: dataListSW[i].software_desCN,
        ui_status: dataListSW[i].ui_status,
        withdraw_date: dataListSW[i].withdraw_date,
        purchase: dataListSW[i].purchase,
        'category_id': dataListSW[i].category_id,
        'component_PN': dataListSW[i].software_PN,
        name: dataListSW[i].software_category,
        nameCN: '',
        template_name: dataListSW[i].software_FC,
        component_id: dataListSW[i].software_PN,
        'pdesc': '',
        'Classify': dataListSW[i].Classify
      };
      hpoList.push(obj);
      dataListSW.splice(i, 1);
    }
  }

  //筛选出HPO是否开启导出标识
  let hpoExportFlag = false;
  //筛选出HPO是否开启导出标识
  for (let i = 0; i < dataListHW.length; i++) {
    let obj = dataListHW[i];
    if (obj.category_id == 33) {
      hpoExportFlag = true;
      dataListHW.splice(i, 1);
      break;
    }
  }
  //获取逻辑分区分区数
  for (let j = 0; j < relatedList.length; j++) {
    let obj = {
      'component_FC': relatedList[j].software_FC,
      'component_count': relatedList[j].component_count,
      'listprice_onshore': relatedList[j].purchase == 'N/C' ? 'N' : 'Y',
      'listprice_onshore_cpy': relatedList[j].purchase,
      'ship_date': '',
      'machine_model': '',
      'machine_submodel': '',
      'description': relatedList[j].software_desCN,
      software_des: relatedList[j].software_des,
      'description_en': relatedList[j].software_des,
      USDPurchase: relatedList[j].USDPurchase,
      software_desCN: relatedList[j].software_desCN,
      ui_status: relatedList[j].ui_status,
      withdraw_date: relatedList[j].withdraw_date,
      purchase: relatedList[j].purchase,
      'category_id': relatedList[j].category_id,
      'component_PN': relatedList[j].software_PN,
      name: relatedList[j].software_category,
      nameCN: '',
      template_name: relatedList[j].software_FC,
      component_id: relatedList[j].software_PN,
      'pdesc': '',
      'Classify': relatedList[j].Classify
    };
    //逻辑分区
    if (relatedList[j].category_id == 13) {
      obj.component_count = relatedList[j].logicNum;
      //操作系统
    } else if (relatedList[j].category_id == 14) {
      obj.component_count = relatedList[j].component_count;
    } else {
      obj.component_count = cupActive[0].component_count;
    }
    dataListHW.push(obj);
  }
  ;

  //清空上次生成数据
  machinePropertiesInfoSource = [];
  //区分首行， 硬件中首行
  let flagHW = true;
  //CRAD日期
  let cradDate = moment(dataListHW[0].ship_date)
    .format('YYYY-MM-DD');

  //循环硬件列表数据
  console.log('=================硬件=======================');
  let eachOne;
  for (let i = 0; i < dataListHW.length + 1; i++) {
    let machinePropertyHW = {
      'LINE NO': '', 'MTM': '', 'FEATURE': '', 'PN': '', 'DESCRIPTION': '', 'QUANTITY': '',
      'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
      'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
      'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
    };
    if (flagHW) {
      setValueInJsonByKey(machinePropertyHW, 'LINE NO', getLineNo(1, i));
      setValueInJsonByKey(machinePropertyHW, 'MTM',
        machine_model + '-' + machine_submodel);
      setValueInJsonByKey(machinePropertyHW, 'DESCRIPTION', dataListHW[i].pdesc);
      setValueInJsonByKey(machinePropertyHW, 'QUANTITY', dataListHW[i].component_count);
      setValueInJsonByKey(machinePropertyHW, 'TYPE', 'NEW');
      setValueInJsonByKey(machinePropertyHW, 'PRODUCT', 'Hardware');
      setValueInJsonByKey(machinePropertyHW, 'SYSTEM', appendToString(1));
      setValueInJsonByKey(machinePropertyHW, 'CPUSIU', appendToString(1));
      setValueInJsonByKey(machinePropertyHW, 'CRAD', cradDate);
      setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'Y');
      setValueInJsonByKey(machinePropertyHW, 'FROM TYPE', getValueFromJsonByKey(systemInfoSource, 'SYSTEM TYPE'));
      setValueInJsonByKey(machinePropertyHW, 'FROM MODEL', getValueFromJsonByKey(systemInfoSource, 'SYSTEM MODEL'));
      flagHW = false;
    } else {
      setValueInJsonByKey(machinePropertyHW, 'LINE NO', getLineNo(1, i));
      setValueInJsonByKey(machinePropertyHW, 'FEATURE', dataListHW[i - 1].component_FC);
      //PN
      setValueInJsonByKey(machinePropertyHW, 'PN', dataListHW[i - 1].component_PN);
      setValueInJsonByKey(machinePropertyHW, 'DESCRIPTION', dataListHW[i - 1].description_en);
      setValueInJsonByKey(machinePropertyHW, 'QUANTITY', appendToString(dataListHW[i - 1].component_count));
      setValueInJsonByKey(machinePropertyHW, 'TYPE', 'ADD');
      //价格为0 也是可以定价的
      if (dataListHW[i - 1].listprice_onshore != undefined && dataListHW[i - 1].listprice_onshore != null && dataListHW[i - 1].listprice_onshore != '') {
        setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'Y');
      } else {
        setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'N');
      }

      eachOne = dataListHW[i - 1];

      //机型
      let machineModel = machine_productInfo.machine_model;

      // FeatureCode
      let componentFC = eachOne.component_FC;
      componentFC = componentFC == null ? '' : componentFC;

      // 数量
      let componentCount = eachOne.component_count;

      // 描述
      let description = isOpenPOWER ? eachOne.description : eachOne.description_en;
      description = description == null ? '' : description;

      // 供货周期
      let deliveryCycle = dfu.deliveryCycle(eachOne.ui_status, isOpenPOWER);

      // 停产警告
      let discontinueWarn = (new Date(machine_solution.ship_date) - new Date(eachOne.withdraw_date)) < 0 ? '' : (eachOne.withdraw_date == null ? '' : eachOne.withdraw_date);

      // 列表价未税
      let listPriceUntax;
      if (eachOne.listprice_onshore == 'N' || eachOne.listprice_onshore == 'Y') {
        listPriceUntax = (isRMB ? eachOne.listprice_onshore_cpy : eachOne.listprice_offshore);
        listPriceUntax = dfu.numDeal(listPriceUntax);
      } else {
        listPriceUntax = (isRMB ? eachOne.listprice_onshore : eachOne.listprice_offshore);
        listPriceUntax = dfu.numDeal(listPriceUntax);
      }

      listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

      // 自定义折扣率
      let discount = hardPriceDetail.discount;
      discount = dfu.numDealUnToFixed(discount);

      // 自定义折后价(未税）
      let cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
      cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

      // 执行税率
      let tax = (systemSettings.tax);
      tax = dfu.numDealUnToFixed(tax) * 0.01;


      // 自定义折后价（含税）
      let customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*(1+' + tax + ')'));
      customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

      // 币种---->全局变量 currencyTypeStr

      // PN
      let componentPN = eachOne.component_PN;
      componentPN = componentPN == null ? '' : componentPN;

      // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
      let componentTypeSeri = 1;
      if (eachOne.category_id == 35 || eachOne.category_id == 34 || eachOne.category_id == 33) {
        componentTypeSeri = eachOne.category_id == 35 ? 4 : (eachOne.category_id == 34 ? 2 : 3);
      }

      machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);
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

    console.log('=================HPO=======================');
    //循环HPO集合
    let eachItem;
    let split1 = emptyHPO.Classify.split('-');
    for (let a = 0; a < hpoList.length + 1; a++) {

      let machinePropertyHPO = {
        'LINE NO': '', 'MTM': '', 'FEATURE': '', 'PN': '', 'DESCRIPTION': '', 'QUANTITY': '',
        'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
        'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
        'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
      };

      if (flagHPO) {
        eachItem = emptyHPO;
        setValueInJsonByKey(machinePropertyHPO, 'LINE NO', getLineNo(2, a));
        setValueInJsonByKey(machinePropertyHPO, 'MTM',
          emptyHPO.Classify);
        setValueInJsonByKey(machinePropertyHPO, 'DESCRIPTION', emptyHPO.software_des);
        setValueInJsonByKey(machinePropertyHPO, 'QUANTITY', appendToString(1));
        setValueInJsonByKey(machinePropertyHPO, 'TYPE', 'NEW');
        setValueInJsonByKey(machinePropertyHPO, 'PRODUCT', 'Hardware');
        setValueInJsonByKey(machinePropertyHPO, 'SYSTEM', appendToString(1));
        setValueInJsonByKey(machinePropertyHPO, 'CPUSIU', appendToString(0));
        setValueInJsonByKey(machinePropertyHPO, 'CRAD', cradDate);
        setValueInJsonByKey(machinePropertyHPO, 'CHARGEABLE', emptyHPO.listprice_onshore);
        setValueInJsonByKey(machinePropertyHPO, 'FROM TYPE', emptyHPO.Classify.substring(0, 4));
        setValueInJsonByKey(machinePropertyHPO, 'FROM MODEL', emptyHPO.Classify.substring(5));
        flagHPO = false;

        //机型
        let machineModel = split1[0];

        // FeatureCode
        let componentFC = split1[1];
        componentFC = componentFC == null ? '' : componentFC;

        // 数量
        let componentCount = eachItem.component_count;

        // 描述
        let description = isOpenPOWER ? eachItem.software_desCN : eachItem.software_des;
        description = description == null ? '' : description;

        // 供货周期
        //let deliveryCycle = dfu.deliveryCycle(eachItem.ui_status, isOpenPOWER);
        let deliveryCycle = '';

        // 停产警告
        // let discontinueWarn = (new Date(machine_solution.ship_date) - new Date(eachItem.withdraw_date)) < 0 ? "" : (eachItem.withdraw_date == null ? "" : eachItem.withdraw_date);
        let discontinueWarn = '';

        //列表价未税
        let listPriceUntax = isRMB ? eachItem.purchase : eachItem.USDPurchase;
        listPriceUntax = dfu.numDeal(listPriceUntax);
        listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

        // 自定义折扣率
        let discount = softPriceDetail.discount;
        discount = dfu.numDealUnToFixed(discount);

        // 自定义折后价(未税）
        let cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
        cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

        // 执行税率
        let tax = (systemSettings.tax);
        tax = dfu.numDealUnToFixed(tax) * 0.01;

        // 自定义折后价（含税）
        let customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
        customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

        // 币种---->全局变量 currencyTypeStr

        // PN
        let componentPN = eachItem.componentPN;
        componentPN = componentPN == null ? '' : componentPN;

        // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
        let componentTypeSeri = 2;

        machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);

      } else {
        eachItem = hpoList[a - 1];
        setValueInJsonByKey(machinePropertyHPO, 'LINE NO', getLineNo(2, a));
        setValueInJsonByKey(machinePropertyHPO, 'FEATURE', hpoList[a - 1].component_FC);
        setValueInJsonByKey(machinePropertyHPO, 'PN', hpoList[a - 1].component_PN);
        setValueInJsonByKey(machinePropertyHPO, 'DESCRIPTION', hpoList[a - 1].description_en);
        setValueInJsonByKey(machinePropertyHPO, 'QUANTITY', appendToString(hpoList[a - 1].component_count));
        setValueInJsonByKey(machinePropertyHPO, 'TYPE', 'ADD');
        setValueInJsonByKey(machinePropertyHPO, 'CHARGEABLE', hpoList[a - 1].listprice_onshore);

        // if(eachItem==undefined){continue;}
        //机型
        let machineModel = split1[0];

        // FeatureCode
        let componentFC = eachItem.component_FC;

        // 数量
        let componentCount = eachItem.component_count;

        // 描述
        let description = isOpenPOWER ? eachItem.software_desCN : eachItem.software_des;
        description = description == null ? '' : description;

        // 供货周期
        let deliveryCycle = dfu.deliveryCycle(eachItem.ui_status, isOpenPOWER);

        // 停产警告
        let discontinueWarn = (new Date(machine_solution.ship_date) - new Date(eachItem.withdraw_date)) < 0 ? '' : (eachItem.withdraw_date == null ? '' : eachItem.withdraw_date);

        //列表价未税
        let listPriceUntax = isRMB ? eachItem.purchase : eachItem.USDPurchase;
        // let listPriceUntax = (isRMB ? (eachItem.purchase == null ? 0 : eachItem.purchase) : eachItem.USDPurchase);
        listPriceUntax = dfu.numDeal(listPriceUntax);
        listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

        // 自定义折扣率
        let discount = softPriceDetail.discount;
        discount = dfu.numDealUnToFixed(discount);

        // 自定义折后价(未税）
        let cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
        cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

        // 执行税率
        let tax = (systemSettings.tax);
        tax = dfu.numDealUnToFixed(tax) * 0.01;
        ;

        // 自定义折后价（含税）
        let customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
        customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

        // 币种---->全局变量 currencyTypeStr

        // PN
        let componentPN = eachItem.component_PN;
        componentPN = componentPN == null ? '' : componentPN;

        // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
        let componentTypeSeri = eachItem.category_id == 35 ? 4 : (eachItem.category_id == 34 ? 2 : 3);

        machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);

      }
      machinePropertiesInfoSource.push(machinePropertyHPO);
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
  headerSW = headerSW.reverse();

  for (let m = 0; m < headerSW.length; m++) {
    let tempModel = headerSW[m].Classify.split('-');
    //区分首行， 软件中首行
    let flagSW = true;
    let num = 0;
    for (let j = 0; j < dataListSW.length; j++) {

      let eachItem = dataListSW[j];


      // console.log("#########################"+JSON.stringify(eachItem));

      if (headerSW[m].Classify == dataListSW[j].Classify && headerSW[m].software_category == dataListSW[j].software_category) {
        let machinePropertySW = {
          'LINE NO': '', 'MTM': '', 'FEATURE': '', 'PN': '', 'DESCRIPTION': '', 'QUANTITY': '',
          'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
          'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
          'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
        };
        if (flagSW) {
          if (hpoExportFlag) {
            setValueInJsonByKey(machinePropertySW, 'LINE NO', getLineNo(m + 3, num));
          } else {
            setValueInJsonByKey(machinePropertySW, 'LINE NO', getLineNo(m + 2, num));
          }
          setValueInJsonByKey(machinePropertySW, 'MTM', headerSW[m].Classify);
          setValueInJsonByKey(machinePropertySW, 'DESCRIPTION', headerSW[m].software_des);
          setValueInJsonByKey(machinePropertySW, 'QUANTITY', appendToString(1));
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

          //机型
          let machineModel = tempModel[0];

          // FeatureCode
          let componentFC = tempModel[1];

          // 数量
          let componentCount = headerSW[m].component_count;

          // 描述
          let description = isOpenPOWER ? headerSW[m].software_desCN : headerSW[m].software_des;
          description = description == null ? '' : description;

          // 供货周期
          let deliveryCycle = '';

          // 停产警告
          let discontinueWarn = (new Date(machine_solution.ship_date) - new Date(eachItem.withdraw_date)) < 0 ? '' : (eachItem.withdraw_date == null ? '' : eachItem.withdraw_date);

          //列表价未税
          let listPriceUntax = isRMB ? headerSW[m].purchase : headerSW[m].USDPurchase;
          listPriceUntax = dfu.numDeal(listPriceUntax);
          listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

          // 自定义折扣率
          let discount = softPriceDetail.discount;
          discount = dfu.numDealUnToFixed(discount);

          // 自定义折后价(未税）
          let cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
          cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);


          // 执行税率
          let tax = (systemSettings.tax);
          tax = dfu.numDealUnToFixed(tax) * 0.01;

          // 自定义折后价（含税）
          let customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
          customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

          // 币种---->全局变量 currencyTypeStr

          // PN
          let componentPN = null;
          componentPN = componentPN == null ? '' : componentPN;


          componentTypeSeri = 3;

          machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);


          let machinePropertySW1 = {
            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'PN': '', 'DESCRIPTION': '', 'QUANTITY': '',
            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
          };
          if (hpoExportFlag) {
            setValueInJsonByKey(machinePropertySW1, 'LINE NO', getLineNo(m + 3, num));
          } else {
            setValueInJsonByKey(machinePropertySW1, 'LINE NO', getLineNo(m + 2, num));
          }
          setValueInJsonByKey(machinePropertySW1, 'FEATURE', dataListSW[j].software_FC);
          setValueInJsonByKey(machinePropertySW1, 'PN', dataListSW[j].software_PN);
          setValueInJsonByKey(machinePropertySW1, 'DESCRIPTION', dataListSW[j].software_des);
          setValueInJsonByKey(machinePropertySW1, 'TYPE', 'ADD');
          if (dataListSW[j].purchase != undefined && dataListSW[j].purchase != null
            && dataListSW[j].purchase != '' && dataListSW[j].purchase == 'N/C') {
            componentTypeSeri = 3;
            setValueInJsonByKey(machinePropertySW1, 'CHARGEABLE', 'N');
            setValueInJsonByKey(machinePropertySW1, 'QUANTITY', appendToString(1));
          } else {
            setValueInJsonByKey(machinePropertySW1, 'CHARGEABLE', 'Y');
          }

          setValueInJsonByKey(machinePropertySW1, 'QUANTITY', appendToString(dataListSW[j].component_count));
          componentCount = dataListSW[j].component_count;

          //机型
          machineModel = tempModel[0];

          // FeatureCode
          componentFC = eachItem.software_FC;

          // 描述
          description = isOpenPOWER ? eachItem.software_desCN : eachItem.software_des;
          description = description == null ? '' : description;
          console.log('描述' + JSON.stringify(description));

          // 供货周期
          deliveryCycle = dfu.deliveryCycle(eachItem.ui_status, isOpenPOWER);

          // 停产警告
          discontinueWarn = (new Date(machine_solution.ship_date) - new Date(eachItem.withdraw_date)) < 0 ? '' : (eachItem.withdraw_date == null ? '' : eachItem.withdraw_date);

          //列表价未税
          listPriceUntax = isRMB ? eachItem.purchase : eachItem.USDPurchase;
          listPriceUntax = dfu.numDeal(listPriceUntax);
          listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

          // 自定义折扣率
          discount = softPriceDetail.discount;
          discount = dfu.numDealUnToFixed(discount);

          // 自定义折后价(未税）
          cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
          cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

          // 执行税率
          tax = (systemSettings.tax);
          tax = dfu.numDealUnToFixed(tax) * 0.01;

          // 自定义折后价（含税）
          customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
          customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

          // 币种---->全局变量 currencyTypeStr

          // PN
          componentPN = eachItem.software_PN;
          componentPN = componentPN == null ? '' : componentPN;

          // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
          // let componentTypeSeri = eachItem.category_id == 35 ? 4 : (eachItem.category_id == 34 ? 2 : 3);
          // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
          // let componentTypeSeri = eachItem.category_id == 35 ? 4 : (eachItem.category_id == 34 ? 2 : 3);
          let componentTypeSeri = 31;

          machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);

          machinePropertiesInfoSource.push(machinePropertySW1);
          num++;
        } else {

          // 数量
          let componentCount = 1;

          if (hpoExportFlag) {
            setValueInJsonByKey(machinePropertySW, 'LINE NO', getLineNo(m + 3, num));
          } else {
            setValueInJsonByKey(machinePropertySW, 'LINE NO', getLineNo(m + 2, num));
          }
          setValueInJsonByKey(machinePropertySW, 'FEATURE', dataListSW[j].software_FC);
          setValueInJsonByKey(machinePropertySW, 'PN', dataListSW[j].software_PN);
          setValueInJsonByKey(machinePropertySW, 'DESCRIPTION', dataListSW[j].software_des);
          setValueInJsonByKey(machinePropertySW, 'TYPE', 'ADD');

          if (dataListSW[j].purchase != undefined && dataListSW[j].purchase != null
            && dataListSW[j].purchase != '' && dataListSW[j].purchase == 'N/C') {
            setValueInJsonByKey(machinePropertySW, 'CHARGEABLE', 'N');
            setValueInJsonByKey(machinePropertySW, 'QUANTITY', appendToString(1));
            componentCount = 1;
          } else {
            setValueInJsonByKey(machinePropertySW, 'CHARGEABLE', 'Y');
          }
          setValueInJsonByKey(machinePropertySW, 'QUANTITY', appendToString(dataListSW[j].component_count));
          componentCount = dataListSW[j].component_count;
          num++;

          //机型
          let machineModel = tempModel[0];

          // FeatureCode
          let componentFC = eachItem.software_FC;

          // 描述
          let description = isOpenPOWER ? eachItem.software_desCN : eachItem.software_des;
          description = description == null ? ' ' : description;
          console.log('描述' + JSON.stringify(description));

          // 供货周期
          let deliveryCycle = dfu.deliveryCycle(eachItem.ui_status, isOpenPOWER);

          // 停产警告
          let discontinueWarn = (new Date(machine_solution.ship_date) - new Date(eachItem.withdraw_date)) < 0 ? '' : (eachItem.withdraw_date == null ? '' : eachItem.withdraw_date);

          //列表价未税
          let listPriceUntax = isRMB ? eachItem.purchase : eachItem.USDPurchase;
          listPriceUntax = dfu.numDeal(listPriceUntax);
          listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

          // 自定义折扣率
          let discount = softPriceDetail.discount;
          discount = dfu.numDealUnToFixed(discount);

          // 自定义折后价(未税）
          let cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
          cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

          // 执行税率
          let tax = (systemSettings.tax);
          tax = dfu.numDealUnToFixed(tax) * 0.01;

          // 自定义折后价（含税）
          let customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
          customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

          // 币种---->全局变量 currencyTypeStr

          // PN
          let componentPN = eachItem.software_PN;
          componentPN = componentPN == null ? '' : componentPN;

          // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
          // let componentTypeSeri = eachItem.category_id == 35 ? 4 : (eachItem.category_id == 34 ? 2 : 3);
          let componentTypeSeri = 31;

          machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);

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

    //维保头
    let itemHeaderSWMA = headerSWMA[m];

    //每一个维保
    let itemswma = '';

    //第三层，自动续约
    let itemThird = '';

    // 数量
    let componentCount = 1;

    //区分首行， 软件中首行
    let flagSWMA = true;
    let num = 0;
    let A3 = [];
    let A31 = [];
    let split = headerSWMA[m].Classify.split('-');

    for (let o = 0; o < swmaList.length; o++) {
      itemswma = swmaList[o];


      let machinePropertySWMA = {
        'LINE NO': '', 'MTM': '', 'FEATURE': '', 'PN': '', 'DESCRIPTION': '', 'QUANTITY': '',
        'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
        'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
        'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
      };
      if (headerSWMA[m].Classify == swmaList[o].Classify) {
        if (flagSWMA) {
          if (hpoExportFlag) {
            setValueInJsonByKey(machinePropertySWMA, 'LINE NO', getLineNo(m + headerSW.length + 3, num));
          } else {
            setValueInJsonByKey(machinePropertySWMA, 'LINE NO', getLineNo(m + headerSW.length + 2, num));
          }
          setValueInJsonByKey(machinePropertySWMA, 'MTM', headerSWMA[m].Classify);
          setValueInJsonByKey(machinePropertySWMA, 'DESCRIPTION', headerSWMA[m].software_des);
          setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', appendToString(1));
          componentCount = 1;
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

          //机型
          let machineModel = split[0];

          // FeatureCode
          let componentFC = split[1];

          // 描述
          let description = isOpenPOWER ? itemHeaderSWMA.software_desCN : itemHeaderSWMA.software_des;

          // 供货周期
          let deliveryCycle = '';

          // 停产警告
          let discontinueWarn = (new Date(machine_solution.ship_date) - new Date(itemHeaderSWMA.withdraw_date)) < 0 ? '' : (itemHeaderSWMA.withdraw_date == null ? '' : itemHeaderSWMA.withdraw_date);

          //列表价未税
          let listPriceUntax = isRMB ? itemHeaderSWMA.purchase : itemHeaderSWMA.USDPurchase;
          listPriceUntax = dfu.numDeal(listPriceUntax);
          listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

          // 自定义折扣率
          let discount = softPriceDetail.discount;
          discount = dfu.numDealUnToFixed(discount);

          // 自定义折后价(未税）
          let cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
          cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

          // 执行税率
          let tax = (systemSettings.tax);
          tax = dfu.numDealUnToFixed(tax) * 0.01;

          // 自定义折后价（含税）
          let customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
          customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

          // 币种---->全局变量 currencyTypeStr

          // PN
          let componentPN = '';
          componentPN = componentPN == null ? '' : componentPN;

          // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
          let componentTypeSeri = 3;

          machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);
          A3.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);

          let machinePropertySWMA1 = {
            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'PN': '', 'DESCRIPTION': '', 'QUANTITY': '',
            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
          };
          if (hpoExportFlag) {
            setValueInJsonByKey(machinePropertySWMA1, 'LINE NO', getLineNo(m + headerSW.length + 3, num));
          } else {
            setValueInJsonByKey(machinePropertySWMA1, 'LINE NO', getLineNo(m + headerSW.length + 2, num));
          }
          setValueInJsonByKey(machinePropertySWMA1, 'FEATURE', swmaList[o].software_FC);
          setValueInJsonByKey(machinePropertySWMA1, 'PN', swmaList[o].software_PN);
          setValueInJsonByKey(machinePropertySWMA1, 'DESCRIPTION', swmaList[o].software_des);
          setValueInJsonByKey(machinePropertySWMA1, 'TYPE', 'ADD');

          // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
          componentTypeSeri = 31;

          if (swmaList[o].purchase != undefined && swmaList[o].purchase != null
            && swmaList[o].purchase != '' && swmaList[o].purchase == 'N/C') {
            setValueInJsonByKey(machinePropertySWMA1, 'CHARGEABLE', 'N');
            setValueInJsonByKey(machinePropertySWMA1, 'QUANTITY', appendToString(1));
            // 数量
            // componentCount = 1;
            componentTypeSeri = 3;
          } else {
            setValueInJsonByKey(machinePropertySWMA1, 'CHARGEABLE', 'Y');
          }
          // 数量
          setValueInJsonByKey(machinePropertySWMA1, 'QUANTITY', appendToString(swmaList[o].component_count));
          componentCount = itemswma.component_count;

          //机型
          machineModel = split[0];

          // FeatureCode
          componentFC = itemswma.software_FC;
          componentFC = componentFC == null ? '' : componentFC;

          // 描述
          description = isOpenPOWER ? itemswma.software_desCN : itemswma.software_des;
          description = description == null ? '' : description;

          // 供货周期
          deliveryCycle = dfu.deliveryCycle(itemswma.ui_status, isOpenPOWER);

          // 停产警告
          discontinueWarn = (new Date(machine_solution.ship_date) - new Date(itemswma.withdraw_date)) < 0 ? '' : (itemswma.withdraw_date == null ? '' : itemswma.withdraw_date);

          //列表价未税
          listPriceUntax = isRMB ? itemswma.purchase : itemswma.USDPurchase;
          // listPriceUntax = (isRMB ? (itemswma.purchase == null ? 0 : itemswma.purchase) : itemswma.USDPurchase);
          listPriceUntax = dfu.numDeal(listPriceUntax);
          listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

          // 自定义折扣率
          discount = softPriceDetail.discount;
          discount = dfu.numDealUnToFixed(discount);

          // 自定义折后价(未税）
          cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
          cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

          // 执行税率
          tax = (systemSettings.tax);
          tax = dfu.numDealUnToFixed(tax) * 0.01;

          // 自定义折后价（含税）
          customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
          customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

          // 币种---->全局变量 currencyTypeStr

          // PN
          componentPN = itemswma.software_PN;
          componentPN = componentPN == null ? '' : componentPN;


          machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);
          A31.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);
          machinePropertiesInfoSource.push(machinePropertySWMA1);
          num++;
        } else {
          // 数量
          if (hpoExportFlag) {
            setValueInJsonByKey(machinePropertySWMA, 'LINE NO', getLineNo(m + headerSW.length + 3, num));
          } else {
            setValueInJsonByKey(machinePropertySWMA, 'LINE NO', getLineNo(m + headerSW.length + 2, num));
          }
          setValueInJsonByKey(machinePropertySWMA, 'FEATURE', swmaList[o].software_FC);
          setValueInJsonByKey(machinePropertySWMA, 'PN', swmaList[o].software_PN);
          setValueInJsonByKey(machinePropertySWMA, 'DESCRIPTION', swmaList[o].software_des);
          setValueInJsonByKey(machinePropertySWMA, 'TYPE', 'ADD');

          // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
          let componentTypeSeri = '';

          if (swmaList[o].purchase != undefined && swmaList[o].purchase != null
            && swmaList[o].purchase != '' && swmaList[o].purchase == 'N/C') {
            setValueInJsonByKey(machinePropertySWMA, 'CHARGEABLE', 'N');
            setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', appendToString(1));
            // componentCount = 1;
            componentTypeSeri = 3;
          } else {
            componentTypeSeri = 31;
            setValueInJsonByKey(machinePropertySWMA, 'CHARGEABLE', 'Y');
          }
          setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', appendToString(cupActive[0].component_count));
          componentCount = itemswma.component_count;

          //机型
          let machineModel = split[0];

          // FeatureCode
          let componentFC = itemswma.software_FC;
          componentFC = componentFC == null ? '' : componentFC;

          // 描述
          let description = isOpenPOWER ? itemswma.software_desCN : itemswma.software_des;
          description = description == null ? '' : description;

          // 供货周期
          let deliveryCycle = dfu.deliveryCycle(itemswma.ui_status, isOpenPOWER);

          // 停产警告
          let discontinueWarn = (new Date(machine_solution.ship_date) - new Date(itemswma.withdraw_date)) < 0 ? '' : (itemswma.withdraw_date == null ? '' : itemswma.withdraw_date);

          //列表价未税
          let listPriceUntax = isRMB ? item.purchase : item.USDPurchase;
          // let listPriceUntax = (isRMB ? (itemswma.purchase == null ? 0 : itemswma.purchase) : itemswma.USDPurchase);
          listPriceUntax = dfu.numDeal(listPriceUntax);
          listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

          // 自定义折扣率
          let discount = softPriceDetail.discount;
          discount = dfu.numDealUnToFixed(discount);

          // 自定义折后价(未税）
          let cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
          cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

          // 执行税率
          let tax = (systemSettings.tax);
          tax = dfu.numDealUnToFixed(tax) * 0.01;

          // 自定义折后价（含税）
          let customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
          customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

          // 币种---->全局变量 currencyTypeStr

          // PN
          let componentPN = itemswma.software_PN;
          componentPN = componentPN == null ? '' : componentPN;


          machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);
          A31.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);

          num++;
          machinePropertiesInfoSource.push(machinePropertySWMA);
        }
        for (let k = 0; k < thirdSWMA.length; k++) {

          itemThird = thirdSWMA[k];

          let machinePropertySWMA2 = {
            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'PN': '', 'DESCRIPTION': '', 'QUANTITY': '',
            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': ''
          };
          if (swmaList[o].id == thirdSWMA[k].choice_software_id) {
            if (hpoExportFlag) {
              setValueInJsonByKey(machinePropertySWMA2, 'LINE NO', getLineNo(m + headerSW.length + 3, num));
            } else {
              setValueInJsonByKey(machinePropertySWMA2, 'LINE NO', getLineNo(m + headerSW.length + 2, num));
            }

            // 软硬件类型 1=纯硬件MTM，2=HPO，3=软件，4=服务
            let componentTypeSeri = '';

            setValueInJsonByKey(machinePropertySWMA2, 'FEATURE', thirdSWMA[k].software_FC);
            setValueInJsonByKey(machinePropertySWMA2, 'PN', thirdSWMA[k].software_PN);
            setValueInJsonByKey(machinePropertySWMA2, 'DESCRIPTION', thirdSWMA[k].software_des);
            setValueInJsonByKey(machinePropertySWMA2, 'TYPE', 'ADD');
            if (thirdSWMA[k].purchase != undefined && thirdSWMA[k].purchase != null
              && thirdSWMA[k].purchase != '' && thirdSWMA[k].purchase == 'N/C') {
              setValueInJsonByKey(machinePropertySWMA2, 'CHARGEABLE', 'N');
              componentTypeSeri = 3;
              setValueInJsonByKey(machinePropertySWMA2, 'QUANTITY', appendToString(1));
              // componentCount = 1;
            } else {
              componentTypeSeri = 31;
              setValueInJsonByKey(machinePropertySWMA2, 'CHARGEABLE', 'Y');
              setValueInJsonByKey(machinePropertySWMA2, 'QUANTITY', appendToString(1));
              // componentCount = 1;
            }
            componentCount = thirdSWMA[k].component_count;
            num++;
            machinePropertiesInfoSource.push(machinePropertySWMA2);

            //机型
            let machineModel = split[0];

            // FeatureCode
            let componentFC = itemThird.software_FC;
            componentFC = componentFC == null ? '' : componentFC;

            // 描述
            let description = isOpenPOWER ? itemThird.software_desCN : itemThird.software_des;
            description = description == null ? '' : description;

            // 供货周期
            let deliveryCycle = dfu.deliveryCycle(itemThird.ui_status, isOpenPOWER);

            // 停产警告
            let discontinueWarn = (new Date(machine_solution.ship_date) - new Date(itemThird.withdraw_date)) < 0 ? '' : (itemThird.withdraw_date == null ? '' : itemThird.withdraw_date);

            //列表价未税
            let listPriceUntax = isRMB ? itemThird.purchase : itemThird.USDPurchase;
            // let listPriceUntax = (isRMB ? (itemThird.purchase == null ? 0 : itemThird.purchase) : itemThird.USDPurchase);
            listPriceUntax = dfu.numDeal(listPriceUntax);
            listPriceUntax = dfu.numDeal(eval(listPriceUntax + '*' + componentCount));

            // 自定义折扣率
            let discount = softPriceDetail.discount;
            discount = dfu.numDealUnToFixed(discount);

            // 自定义折后价(未税）
            let cusDiscountPriceUnTax = dfu.discountCompute(discount, listPriceUntax, isRMB);
            cusDiscountPriceUnTax = dfu.numDeal(cusDiscountPriceUnTax);

            // 执行税率
            let tax = (systemSettings.tax);
            tax = dfu.numDealUnToFixed(tax) * 0.01;

            // 自定义折后价（含税）
            let customerdisCountListPriceAfterTax = (eval(cusDiscountPriceUnTax + '*' + '(1+' + tax + ')'));
            customerdisCountListPriceAfterTax = dfu.numDeal(customerdisCountListPriceAfterTax);

            // 币种---->全局变量 currencyTypeStr

            // PN
            let componentPN = itemThird.software_PN;
            componentPN = componentPN == null ? '' : componentPN;

            machineConf.push([ machineModel, componentFC, componentCount, description, deliveryCycle, discontinueWarn, dfu.priceShowPerm(perm, listPriceUntax), dfu.priceShowPerm(perm, dfu.showDiscount(isRMB, discount)), dfu.priceShowPerm(perm, cusDiscountPriceUnTax), dfu.priceShowPerm(perm, ((tax * 100).toFixed(2)) + '%'), dfu.priceShowPerm(perm, customerdisCountListPriceAfterTax), currencyTypeStr, componentPN, componentTypeSeri ]);

          }
        }

      }
    }
  }

  JSON.stringify(machineConf);
  return machineConf;

}

function integrationList(dataListHW, dataListSW, swmaList) {
  let dataList = [];
  let machineNumber = dataListHW[0].machine_model + dataListHW[0].machine_submodel;
  let CRADDate = dataListHW[0].ship_date;
  for (let i = 0; i < dataListHW.length; i++) {
    let obj = {
      machineNumber: machineNumber,
      featureCode: dataListHW[i].component_FC,
      withdrawDate: dataListHW[i].withdraw_date,
      CRADDate: CRADDate
    };
    dataList.push(obj);

  }
  for (let i = 0; i < dataListSW.length; i++) {
    let obj = {
      machineNumber: machineNumber,
      featureCode: dataListSW[i].software_FC,
      withdrawDate: dataListSW[i].withdraw_date,
      CRADDate: CRADDate
    };
    dataList.push(obj);
  }
  for (let i = 0; i < swmaList.length; i++) {
    let obj = {
      machineNumber: machineNumber,
      featureCode: swmaList[i].software_FC,
      withdrawDate: swmaList[i].withdraw_date,
      CRADDate: CRADDate
    };
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
