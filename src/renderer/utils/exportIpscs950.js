import moment from 'moment';
import Vue from 'vue'; //引入vue
let vm = new Vue();
let $db;
setTimeout(()=>{
    $db = vm.$db; //不是undefined了
},2000);
import exportSolutionCFR from './exportSolutionCFR';
import {isEmpty} from "element-ui/src/utils/util";
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
    async exportIpscs950(machineName, productId,solutionId, templateId, machineId,machineNo,count){
        let dataListHWSW = await this.getDataListHWSW(machineName,  productId,solutionId, templateId, machineId,machineNo,count);
        return dataListHWSW;
    },
    /**
     * 获取所有硬/软件配置集合
     * @param solutionId
     */
    async getDataListHWSW(machineName, productId,solutionId, templateId, machineId,machineNo,count) {
        let dataListHW = [];//硬件
        dataListHW = await this.getDataListHW(productId,solutionId, templateId, machineId);
        let dataListSW = [];//软件
        dataListSW = await this.getDataListSW(productId,solutionId, templateId, machineId);
        let swmaList = [];//维保
        swmaList = await this.getDataListSWMA(productId,solutionId, templateId, machineId);
        let solutionList = await this.getSolutionList(solutionId);
        let ipscsStr = await this.jsonToFile(machineName, dataListHW, dataListSW, swmaList, solutionList,machineNo,count,templateId);
        return ipscsStr;
    },
    /**
     * 获取某个方案信息
     * @param solutionId
     */
    async getSolutionList(solutionId) {
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
    },

    /**
     * 获取硬件配置集合
     * @param solutionId
     */
    async getDataListHW(productId,solutionId, templateId, machineId) {
        let dataListHW = [];
        // 获取数据
        const SQL = `SELECT
                detail.id,info.component_PN,info.component_FC,info.name, info.description, info.description_en,detail.component_count,detail.category_id,detail.component_id,
                info.listprice_onshore,info.listprice_offshore,so.ship_date,pi.machine_model,pi.machine_submodel,  pi.description AS pdesc,  info.withdraw_date ,
                 detail.is_expansion,detail.powerline_type, detail.expansion_mode_id   
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
               detail.id,soft.software_PN,soft.software_FC,null, soft.software_desCN, soft.software_des,detail.component_count,detail.category_id,detail.component_id,
               soft.purchase,null,null,null,null,  null,  null  , detail.is_expansion,detail.powerline_type , detail.expansion_mode_id
               FROM product_programme_detail detail 
               LEFT JOIN component_software soft ON   soft.id = detail.component_id AND detail.category_id = soft.category_id  
               WHERE  detail.category_id = 33 AND  detail.solution_id=${solutionId} AND detail.template_id = ${templateId} AND detail.machine_id = ${machineId}  AND detail.product_id = ${productId}` ;
        await new Promise((resolve, reject) => {
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
        additionList = await this.getAdditionFeatures(productId,solutionId, templateId, machineId);
        for (let i = dataListHW.length - 1; i >= 0 ; i--) {
            //手动添加/修改标识  用于导入时区分 1:代表修改/添加 0:代表未修改
            dataListHW[i].addition_flag = '0';
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
                    //手动添加/修改标识  用于导入时区分 1:代表修改/添加 0:代表未修改
                    dataListHW[i].addition_flag = '1';
                    dataListHW[i].expansion_mode_id = '';
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
                withdraw_date : '',
                is_expansion: '1',
                powerline_type: '0',
                addition_flag:'2',
                expansion_mode_id:''
            }
            dataListHW.push(obj);
        }
        return dataListHW;
    },

    /**
     * 获取用户手动修改FC的数据(硬件)
     * @param productId
     * @param solutionId
     * @param templateId
     * @param machineId
     * @returns {Promise<Array>}
     */
    async getAdditionFeatures(productId,solutionId, templateId, machineId) {
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
    },

    /**
     * 获取用户手动修改FC的数据(软件/HPO)
     * @param productId
     * @param solutionId
     * @param templateId
     * @param machineId
     * @returns {Promise<Array>}
     */
    async getAdditionFeaturesSW(productId,solutionId, templateId, machineId) {
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
    },
    /**
     * 获取软件配置集合
     * @param solutionId
     */
    async getDataListSW(productId,solutionId, templateId, machineId) {
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
            WHERE ppd.category_id IN (21,14,15,42) AND ppd.solution_id = ${solutionId} 
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
        additionList = await this.getAdditionFeaturesSW(productId,solutionId, templateId, machineId);
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
                        dataListSW[i].component_count = additionList[j].fc_cnt,
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
                component_count : additionList[k].fc_cnt,
                software_desCN : additionList[k].fc_desc,
                software_des : additionList[k].fc_desc,
                //category_id 不变???
                category_id: '',
                Classify : '',
                software_PN : '',
                purchase : 'N/C',
                withdraw_date : '',
                addition_flag : '2'
            }
            dataListSW.push(obj);
        }
        return dataListSW;
    },

    /**
     * 获取软件配置集合
     * @param solutionId
     */
    async getDataListSWMA(productId,solutionId, templateId, machineId) {
        let dataListSWMA = [];
        //维保中FEATURE不为空
        let SWMA = [];
        let that = this;
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
                    dataListSWMA = await that.getRenewalList(dataListSWMA, data[i]);
                }
            }
        });
        //获取用户手动修改的FC数据
        let additionList = [];
        additionList = await this.getAdditionFeaturesSW(productId,solutionId, templateId, machineId);
        additionList = additionList.filter((c)=>{
            return c.software_type == 3 || this.isEmpty(c.software_type);
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
                software_FC : additionList[k].fc_code,
                component_count : additionList[k].fc_cnt,
                software_desCN : additionList[k].fc_desc,
                software_des : additionList[k].fc_desc,
                //category_id 不变???
                category_id: '',
                Classify : '',
                software_PN : '',
                purchase : 'N/C',
                withdraw_date : '',
                addition_flag : '2'
            }
            dataListSWMA.push(obj);
        }
        return dataListSWMA;
    },

    /**
     * 获取维保续期
     * @param dataListSWMA
     * @param v
     * @returns {Promise<*>}
     */
    async getRenewalList(dataListSWMA, v) {
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
    },
    /**
     * 导出数据组装
     * @param dataListHW
     * @param dataListSW
     * @param swmaList
     */
    async jsonToFile(machineName,  dataListHW, dataListSW, swmaList, solutionList,machineNo,count,templateId) {
        //文档存储的参数初始化
        let name = '';
        let resultStr = '';
//================================固定列头定义：json数据源的列信息=====================================================start
        //数据源的key信息
        let jsonstrSource = [ 'csvHeadInSource', 'machineInSource' ];

        //csv头部标题
        let csvHead = [ 'CFR DATE', 'CFR APPLICATION', 'BRAND', 'TYPE', 'USER DESCRIPTION', 'COUNTRY CODE', 'COUNTRY', 'LANGUAGE', 'LOCKED', 'EXPIRATION DATE', 'CODE', '', '', '', '', '', '', '', '', '', '', '' ];

        //机器系统信息
        let systemInfo = [ 'SYSTEM SEQ', 'SYSTEM DESC', 'SYSTEM TYPE', 'SYSTEM MODEL', 'SYSTEM SN', 'SYSTEM SEO', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','SYSTEM TEMPLATEID' ];

        //机器属性信息
        let machinePropertiesInfo = [ 'LINE NO', 'MTM', 'FEATURE', 'DESCRIPTION', 'QUANTITY', 'TYPE', 'PRODUCT', 'SYSTEM', 'CPUSIU', 'CHARGEABLE', 'CRAD', 'FROM TYPE', 'FROM MODEL', 'FROM SN', 'FROM SYSTEM TYPE', 'FROM SYSTEM NO', 'INSTALL DATE', 'CUSTNO', 'TO TYPE', 'TO MODEL', 'TO SN', 'TO SYSTEM TYPE', 'TO SYSTEM NO','IS EXPANSION','POWERLINE TYPE','hpoFlag','count','ADDITION FLAG','EXPANSION MODE ID'  ];
//====================================================================================================================end
//==========================================数据源准备：从json数据源中获取的数据========================================start

        //依次取出json源数据中的value
        let csvHeadResource = this.getValueFromJsonByKey(jsonstr, jsonstrSource[0]);
        let machineInSource = this.getValueFromJsonByKey(jsonstr, jsonstrSource[1]);
        if (machineNo == 1) {
            //修改csv文档的创建时间
            this.setValueInJsonByKey(csvHeadResource, 'CFR DATE', moment()
                .format('YYYY-MM-DD'));
            this.setValueInJsonByKey(csvHeadResource, 'CFR APPLICATION', 'e-Config Disconnected (' + VERSION_NO + ')');
            this.setValueInJsonByKey(csvHeadResource, 'BRAND', 'POWER');
            this.setValueInJsonByKey(csvHeadResource, 'TYPE', 'HWSW');
            this.setValueInJsonByKey(csvHeadResource, 'COUNTRY CODE', '672');
            this.setValueInJsonByKey(csvHeadResource, 'LANGUAGE', 'zh');
            this.setValueInJsonByKey(csvHeadResource, 'LOCKED', 'N');
            this.setValueInJsonByKey(csvHeadResource, 'CODE', 'INITIAL ORDER CONFIGURATION');
            //修改csv文档的过期时间
            this.setValueInJsonByKey(csvHeadResource, 'EXPIRATION DATE', moment()
                .add(20, 'days')
                .format('YYYY-MM-DD'));
        }
        //取出源数据中的机器系统数据
        let systemInfoSource = this.getValueFromJsonByKey(machineInSource, 'systemInfo');
        let machinePropertiesInfoSource = this.getValueFromJsonByKey(machineInSource, 'machinePropertiesInfo');
        this.setValueInJsonByKey(systemInfoSource, 'SYSTEM SEQ', 'SYSTEM '+ this.appendToString(machineNo));
        this.setValueInJsonByKey(systemInfoSource, 'SYSTEM DESC', 'Server '+this.appendToString(machineNo));
        //修改产品类型-型号
        this.setValueInJsonByKey(systemInfoSource, 'SYSTEM TYPE', dataListHW[0].machine_model);
        this.setValueInJsonByKey(systemInfoSource, 'SYSTEM MODEL', dataListHW[0].machine_submodel);
        this.setValueInJsonByKey(systemInfoSource, 'SYSTEM SN', '');
        this.setValueInJsonByKey(systemInfoSource, 'SYSTEM SEO', '');
        //设置templateId
        this.setValueInJsonByKey(systemInfoSource, 'SYSTEM TEMPLATEID', this.appendToString(templateId));

        /*如果fc相同，就将数据和并，数量相加*/
        // let arr=[]
        // dataListHW.forEach((item,index)=>{
        //     if(arr.length==0){
        //         return arr.push(item)
        //     }
        //     for (let i=0;i<=arr.length;i++){
        //         if(i==arr.length){
        //             return arr.push(item)
        //         }
        //         if(arr[i].component_FC == item.component_FC){
        //             return arr[i].component_count += item.component_count
        //         }
        //     }
        // })
        // dataListHW = arr;
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

        //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
        for (let i = dataListSW.length - 1; i >= 0; i--) {
            //IO 硬盘拓展柜标识
            dataListSW[i].is_expansion = 1;
            dataListSW[i].powerline_type = '0';
            dataListSW[i].hpoFlag = hpoExportFlag?'1':'0';
            dataListSW[i].count = count;
            dataListSW[i].expansion_mode_id = '';

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
                    'Classify': dataListSW[i].Classify,
                    'is_expansion':dataListSW[i].is_expansion,
                    'powerline_type':dataListSW[i].powerline_type,
                    'hpoFlag': dataListSW[i].hpoFlag,
                    'count': count,
                    'addition_flag':dataListSW[i].addition_flag,
                    'expansion_mode_id': ''
                };
                hpoList.push(obj);
                dataListSW.splice(i, 1);
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
                'pdesc': '',
                'is_expansion': relatedList[j].is_expansion,
                'powerline_type': relatedList[j].powerline_type,
                'hpoFlag': relatedList[j].hpoFlag,
                'count': count,
                'addition_flag':relatedList[j].addition_flag,
                'expansion_mode_id': ''
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
        let hpoFlag = hpoExportFlag?'1':'0';
        for (let i = 0; i < dataListHW.length + 1; i++) {

            let machinePropertyHW = {
                'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
                'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
                'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
                'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': '','IS EXPANSION':'','POWERLINE TYPE':'','hpoFlag':'',
                'count': '','ADDITION FLAG':'','EXPANSION MODE ID':''};
            if (flagHW) {
                this.setValueInJsonByKey(machinePropertyHW, 'LINE NO', this.getLineNo(1, i));
                this.setValueInJsonByKey(machinePropertyHW, 'MTM',
                    machine_model + '-' + machine_submodel);
                this.setValueInJsonByKey(machinePropertyHW, 'DESCRIPTION', dataListHW[i].pdesc);
                this.setValueInJsonByKey(machinePropertyHW, 'QUANTITY', this.appendToString(1));
                this.setValueInJsonByKey(machinePropertyHW, 'TYPE', 'NEW');
                this.setValueInJsonByKey(machinePropertyHW, 'PRODUCT', 'Hardware');
                this.setValueInJsonByKey(machinePropertyHW, 'SYSTEM', this.appendToString(1));
                this.setValueInJsonByKey(machinePropertyHW, 'CPUSIU', this.appendToString(1));
                this.setValueInJsonByKey(machinePropertyHW, 'CRAD', cradDate);
                this.setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'Y');
                this.setValueInJsonByKey(machinePropertyHW, 'FROM TYPE', this.getValueFromJsonByKey(systemInfoSource, 'SYSTEM TYPE'));
                this.setValueInJsonByKey(machinePropertyHW, 'FROM MODEL', this.getValueFromJsonByKey(systemInfoSource, 'SYSTEM MODEL'));
                flagHW = false;
            } else {
                this.setValueInJsonByKey(machinePropertyHW, 'LINE NO', this.getLineNo(1, i));
                this.setValueInJsonByKey(machinePropertyHW, 'FEATURE', dataListHW[i - 1].component_FC);
                this.setValueInJsonByKey(machinePropertyHW, 'DESCRIPTION', dataListHW[i - 1].description_en);
                this.setValueInJsonByKey(machinePropertyHW, 'QUANTITY', this.appendToString(dataListHW[i - 1].component_count));
                this.setValueInJsonByKey(machinePropertyHW, 'TYPE', 'ADD');
                //价格为0 也是可以定价的
                if (dataListHW[i - 1].listprice_onshore != undefined && dataListHW[i - 1].listprice_onshore != null && dataListHW[i - 1].listprice_onshore != '') {
                    this.setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'Y');
                } else {
                    this.setValueInJsonByKey(machinePropertyHW, 'CHARGEABLE', 'N');
                }
                //IO 硬盘拓展柜标识

                this.setValueInJsonByKey(machinePropertyHW, 'IS EXPANSION', this.appendToString(dataListHW[i - 1].is_expansion));
                this.setValueInJsonByKey(machinePropertyHW, 'POWERLINE TYPE', this.appendToString(dataListHW[i - 1].powerline_type));
                this.setValueInJsonByKey(machinePropertyHW, 'hpoFlag', hpoFlag);
                this.setValueInJsonByKey(machinePropertyHW, 'count', this.appendToString(count));
                this.setValueInJsonByKey(machinePropertyHW, 'ADDITION FLAG', dataListHW[i - 1].addition_flag);
                this.setValueInJsonByKey(machinePropertyHW, 'EXPANSION MODE ID',this.appendToString( dataListHW[i - 1].expansion_mode_id));
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
                let machinePropertyHPO = { 'LINE NO': '','MTM': '','FEATURE': '','DESCRIPTION': '','QUANTITY': '','TYPE': '','PRODUCT': '',
                    'SYSTEM': '','CPUSIU': '','CHARGEABLE': '','CRAD': '','FROM TYPE': '', 'FROM MODEL': '','FROM SN': '','FROM SYSTEM TYPE': '',
                    'FROM SYSTEM NO': '','INSTALL DATE': '','CUSTNO': '','TO TYPE': '','TO MODEL': '','TO SN': '','TO SYSTEM TYPE': '',
                    'TO SYSTEM NO': '','IS EXPANSION': '','POWERLINE TYPE': '','hpoFlag':'','count':'','ADDITION FLAG':'','EXPANSION MODE ID':''
                };
                if (flagHPO) {
                    this.setValueInJsonByKey(machinePropertyHPO, 'LINE NO', this.getLineNo(2, i));
                    this.setValueInJsonByKey(machinePropertyHPO, 'MTM',
                        emptyHPO.Classify);
                    this.setValueInJsonByKey(machinePropertyHPO, 'DESCRIPTION', emptyHPO.software_des);
                    this.setValueInJsonByKey(machinePropertyHPO, 'QUANTITY', this.appendToString(emptyHPO.component_count));
                    this.setValueInJsonByKey(machinePropertyHPO, 'TYPE', 'NEW');
                    this.setValueInJsonByKey(machinePropertyHPO, 'PRODUCT', 'Hardware');
                    this.setValueInJsonByKey(machinePropertyHPO, 'SYSTEM', this.appendToString(1));
                    this.setValueInJsonByKey(machinePropertyHPO, 'CPUSIU', this.appendToString(0));
                    this.setValueInJsonByKey(machinePropertyHPO, 'CRAD', cradDate);
                    this.setValueInJsonByKey(machinePropertyHPO, 'CHARGEABLE', emptyHPO.listprice_onshore);
                    this.setValueInJsonByKey(machinePropertyHPO, 'FROM TYPE', emptyHPO.Classify.substring(0, 4));
                    this.setValueInJsonByKey(machinePropertyHPO, 'FROM MODEL', emptyHPO.Classify.substring(5));
                    flagHPO = false;
                } else {
                    this.setValueInJsonByKey(machinePropertyHPO, 'LINE NO', this.getLineNo(2, i));
                    this.setValueInJsonByKey(machinePropertyHPO, 'FEATURE', hpoList[i - 1].component_FC);
                    this.setValueInJsonByKey(machinePropertyHPO, 'DESCRIPTION', hpoList[i - 1].description_en);
                    this.setValueInJsonByKey(machinePropertyHPO, 'QUANTITY', this.appendToString(hpoList[i - 1].component_count));
                    this.setValueInJsonByKey(machinePropertyHPO, 'TYPE', 'ADD');
                    this.setValueInJsonByKey(machinePropertyHPO, 'CHARGEABLE', hpoList[i - 1].listprice_onshore);
                    this.setValueInJsonByKey(machinePropertyHPO, 'IS EXPANSION', this.appendToString(hpoList[i - 1].is_expansion));
                    this.setValueInJsonByKey(machinePropertyHPO, 'POWERLINE TYPE', hpoList[i - 1].powerline_type);
                    this.setValueInJsonByKey(machinePropertyHPO, 'hpoFlag', hpoFlag);
                    this.setValueInJsonByKey(machinePropertyHPO, 'count', this.appendToString(count));
                    this.setValueInJsonByKey(machinePropertyHPO, 'ADDITION FLAG', hpoList[i - 1].addition_flag);
                    this.setValueInJsonByKey(machinePropertyHPO, 'EXPANSION MODE ID', this.appendToString(hpoList[i - 1].expansion_mode_id));
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
                    'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': '',
                    'IS EXPANSION': '','POWERLINE TYPE': '','hpoFlag':'','count':'','ADDITION FLAG':'','EXPANSION MODE ID':'' };
                this.setValueInJsonByKey(machinePropertySW2, 'LINE NO',
                    (parseInt(this.getValueFromJsonByKey(machinePropertiesInfoSource[machinePropertiesInfoSource.length-1],'LINE NO'))+1)+'');
                this.setValueInJsonByKey(machinePropertySW2, 'FEATURE', additionListSW[o].software_FC);
                this.setValueInJsonByKey(machinePropertySW2, 'DESCRIPTION', additionListSW[o].software_des);
                this.setValueInJsonByKey(machinePropertySW2, 'TYPE', 'ADD');
                this.setValueInJsonByKey(machinePropertySW2, 'CHARGEABLE', 'N');
                this.setValueInJsonByKey(machinePropertySW2, 'QUANTITY', this.appendToString(additionListSW[o].component_count));
                this.setValueInJsonByKey(machinePropertySW2, 'IS EXPANSION', this.appendToString(additionListSW[o].is_expansion));
                this.setValueInJsonByKey(machinePropertySW2, 'POWERLINE TYPE', additionListSW[o].powerline_type);
                this.setValueInJsonByKey(machinePropertySW2, 'hpoFlag', hpoFlag);
                this.setValueInJsonByKey(machinePropertySW2, 'count', this.appendToString(count));
                this.setValueInJsonByKey(machinePropertySW2, 'ADDITION FLAG', additionListSW[o].addition_flag);
                this.setValueInJsonByKey(machinePropertySW2, 'EXPANSION MODE ID', this.appendToString(additionListSW[o].expansion_mode_id));
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
        headerSW = headerSW.reverse();
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
                        'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': '','IS EXPANSION':'',
                        'POWERLINE TYPE':'','hpoFlag':'','count':'','ADDITION FLAG':'', 'EXPANSION MODE ID':''
                    };
                    if (flagSW) {
                        if (hpoExportFlag){
                            this.setValueInJsonByKey(machinePropertySW, 'LINE NO', this.getLineNo(m + 3, num));
                        }else{
                            this.setValueInJsonByKey(machinePropertySW, 'LINE NO', this.getLineNo(m + 2, num));
                        }
                        this.setValueInJsonByKey(machinePropertySW, 'MTM', headerSW[m].Classify);
                        this.setValueInJsonByKey(machinePropertySW, 'DESCRIPTION', headerSW[m].software_des);
                        this.setValueInJsonByKey(machinePropertySW, 'QUANTITY', this.appendToString(headerSW[m].component_count));
                        this.setValueInJsonByKey(machinePropertySW, 'TYPE', 'NEW');
                        this.setValueInJsonByKey(machinePropertySW, 'PRODUCT', 'Software');
                        this.setValueInJsonByKey(machinePropertySW, 'SYSTEM', this.appendToString(1));
                        this.setValueInJsonByKey(machinePropertySW, 'CPUSIU', 0 + '');
                        this.setValueInJsonByKey(machinePropertySW, 'CRAD', cradDate);
                        this.setValueInJsonByKey(machinePropertySW, 'CHARGEABLE', 'N');
                        this.setValueInJsonByKey(machinePropertySW, 'FROM TYPE', headerSW[m].Classify.substring(0, 4));
                        this.setValueInJsonByKey(machinePropertySW, 'FROM MODEL', headerSW[m].Classify.substring(5));
                        flagSW = false;
                        machinePropertiesInfoSource.push(machinePropertySW);
                        num++;

                        let machinePropertySW1 = {
                            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
                            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
                            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
                            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': '','IS EXPANSION':'',
                            'POWERLINE TYPE':'','hpoFlag':'','count':'','ADDITION FLAG':'', 'EXPANSION MODE ID':''
                        };
                        if (hpoExportFlag){
                            this.setValueInJsonByKey(machinePropertySW1, 'LINE NO', this.getLineNo(m + 3, num));
                        }else{
                            this.setValueInJsonByKey(machinePropertySW1, 'LINE NO', this.getLineNo(m + 2, num));
                        }
                        this.setValueInJsonByKey(machinePropertySW1, 'FEATURE', dataListSW[j].software_FC);
                        this.setValueInJsonByKey(machinePropertySW1, 'DESCRIPTION', dataListSW[j].software_des);
                        this.setValueInJsonByKey(machinePropertySW1, 'TYPE', 'ADD');
                        if (dataListSW[j].purchase != undefined && dataListSW[j].purchase != null
                            && dataListSW[j].purchase != '' && dataListSW[j].purchase == 'N/C') {
                            this.setValueInJsonByKey(machinePropertySW1, 'CHARGEABLE', 'N');
                        } else {
                            this.setValueInJsonByKey(machinePropertySW1, 'CHARGEABLE', 'Y');
                        }
                        this.setValueInJsonByKey(machinePropertySW1, 'QUANTITY', this.appendToString(dataListSW[j].component_count));
                        this.setValueInJsonByKey(machinePropertySW1, 'IS EXPANSION', this.appendToString(dataListSW[j].is_expansion));
                        this.setValueInJsonByKey(machinePropertySW1, 'POWERLINE TYPE', dataListSW[j].powerline_type);
                        this.setValueInJsonByKey(machinePropertySW1, 'hpoFlag', dataListSW[j].hpoFlag);
                        this.setValueInJsonByKey(machinePropertySW1, 'count', this.appendToString(dataListSW[j].count));
                        this.setValueInJsonByKey(machinePropertySW1, 'ADDITION FLAG', dataListSW[j].addition_flag);
                        this.setValueInJsonByKey(machinePropertySW1, 'EXPANSION MODE ID', this.appendToString(dataListSW[j].expansion_mode_id));
                        machinePropertiesInfoSource.push(machinePropertySW1);
                        num++;
                    } else {
                        if (hpoExportFlag){
                            this.setValueInJsonByKey(machinePropertySW, 'LINE NO', this.getLineNo(m + 3, num));
                        }else{
                            this.setValueInJsonByKey(machinePropertySW, 'LINE NO', this.getLineNo(m + 2, num));
                        }
                        this.setValueInJsonByKey(machinePropertySW, 'FEATURE', dataListSW[j].software_FC);
                        this.setValueInJsonByKey(machinePropertySW, 'DESCRIPTION', dataListSW[j].software_des);
                        this.setValueInJsonByKey(machinePropertySW, 'TYPE', 'ADD');
                        if (dataListSW[j].purchase != undefined && dataListSW[j].purchase != null
                            && dataListSW[j].purchase != '' && dataListSW[j].purchase == 'N/C') {
                            this.setValueInJsonByKey(machinePropertySW, 'CHARGEABLE', 'N');
                        } else {
                            this.setValueInJsonByKey(machinePropertySW, 'CHARGEABLE', 'Y');
                        }
                        this.setValueInJsonByKey(machinePropertySW, 'QUANTITY', this.appendToString(dataListSW[j].component_count));
                        this.setValueInJsonByKey(machinePropertySW, 'IS EXPANSION', this.appendToString(dataListSW[j].is_expansion));
                        this.setValueInJsonByKey(machinePropertySW, 'POWERLINE TYPE', dataListSW[j].powerline_type);
                        this.setValueInJsonByKey(machinePropertySW, 'hpoFlag', dataListSW[j].hpoFlag);
                        this.setValueInJsonByKey(machinePropertySW, 'count', this.appendToString(dataListSW[j].count));
                        this.setValueInJsonByKey(machinePropertySW, 'ADDITION FLAG', dataListSW[j].addition_flag);
                        this.setValueInJsonByKey(machinePropertySW, 'EXPANSION MODE ID', this.appendToString(dataListSW[j].expansion_mode_id));
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
            //IO 硬盘拓展柜标识
            swmaList[n].is_expansion = 1
            swmaList[n].powerline_type = '0'
            swmaList[n].hpoFlag = hpoExportFlag?'1':'0'
            swmaList[n].count = count
            swmaList[n].expansion_mode_id = ''

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
                    'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': '','IS EXPANSION':'',
                    'POWERLINE TYPE':'','hpoFlag':'','count':'','ADDITION FLAG':'','EXPANSION MODE ID':''
                };
                if (headerSWMA[m].Classify == swmaList[o].Classify) {
                    if (flagSWMA) {
                        if (hpoExportFlag){
                            this.setValueInJsonByKey(machinePropertySWMA, 'LINE NO', this.getLineNo(m + headerSW.length + 3, num));
                        }else{
                            this.setValueInJsonByKey(machinePropertySWMA, 'LINE NO', this.getLineNo(m + headerSW.length + 2, num));
                        }
                        this.setValueInJsonByKey(machinePropertySWMA, 'MTM', headerSWMA[m].Classify);
                        this.setValueInJsonByKey(machinePropertySWMA, 'DESCRIPTION', headerSWMA[m].software_des);
                        this.setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', this.appendToString(headerSWMA[m].component_count));
                        this.setValueInJsonByKey(machinePropertySWMA, 'TYPE', 'NEW');
                        this.setValueInJsonByKey(machinePropertySWMA, 'PRODUCT', 'Software');
                        this.setValueInJsonByKey(machinePropertySWMA, 'SYSTEM', this.appendToString(1));
                        this.setValueInJsonByKey(machinePropertySWMA, 'CPUSIU', 0 + '');
                        this.setValueInJsonByKey(machinePropertySWMA, 'CRAD', cradDate);
                        this.setValueInJsonByKey(machinePropertySWMA, 'CHARGEABLE', 'N');
                        this.setValueInJsonByKey(machinePropertySWMA, 'FROM TYPE', headerSWMA[m].Classify.substring(0, 4));
                        this.setValueInJsonByKey(machinePropertySWMA, 'FROM MODEL', headerSWMA[m].Classify.substring(5));
                        flagSWMA = false;
                        machinePropertiesInfoSource.push(machinePropertySWMA);
                        num++;

                        let machinePropertySWMA1 = {
                            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
                            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
                            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
                            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': '',
                            'IS EXPANSION':'','POWERLINE TYPE':'','hpoFlag':'','count':'','ADDITION FLAG':'','EXPANSION MODE ID':''
                        };
                        if (hpoExportFlag){
                            this.setValueInJsonByKey(machinePropertySWMA1, 'LINE NO', this.getLineNo(m + headerSW.length + 3, num));
                        }else{
                            this.setValueInJsonByKey(machinePropertySWMA1, 'LINE NO', this.getLineNo(m + headerSW.length + 2, num));
                        }
                        this.setValueInJsonByKey(machinePropertySWMA1, 'FEATURE', swmaList[o].software_FC);
                        this.setValueInJsonByKey(machinePropertySWMA1, 'DESCRIPTION', swmaList[o].software_des);
                        this.setValueInJsonByKey(machinePropertySWMA1, 'TYPE', 'ADD');
                        if (swmaList[o].purchase != undefined && swmaList[o].purchase != null
                            && swmaList[o].purchase != '' && swmaList[o].purchase == 'N/C') {
                            this.setValueInJsonByKey(machinePropertySWMA1, 'CHARGEABLE', 'N');
                        } else {
                            this.setValueInJsonByKey(machinePropertySWMA1, 'CHARGEABLE', 'Y');
                        }
                        this.setValueInJsonByKey(machinePropertySWMA1, 'QUANTITY', this.appendToString(swmaList[o].component_count));
                        this.setValueInJsonByKey(machinePropertySWMA1, 'IS EXPANSION', this.appendToString(swmaList[o].is_expansion));
                        this.setValueInJsonByKey(machinePropertySWMA1, 'POWERLINE TYPE',swmaList[o].powerline_type);
                        this.setValueInJsonByKey(machinePropertySWMA1, 'hpoFlag',swmaList[o].hpoFlag);
                        this.setValueInJsonByKey(machinePropertySWMA1, 'count',this.appendToString(swmaList[o].count));
                        this.setValueInJsonByKey(machinePropertySWMA1, 'ADDITION FLAG',swmaList[o].addition_flag);
                        this.setValueInJsonByKey(machinePropertySWMA1, 'EXPANSION MODE ID',this.appendToString(swmaList[o].expansion_mode_id));
                        machinePropertiesInfoSource.push(machinePropertySWMA1);
                        num++;
                    } else {
                        if (hpoExportFlag){
                            this.setValueInJsonByKey(machinePropertySWMA, 'LINE NO', this.getLineNo(m + headerSW.length + 3, num));
                        }else{
                            this.setValueInJsonByKey(machinePropertySWMA, 'LINE NO', this.getLineNo(m + headerSW.length + 2, num));
                        }
                        this.setValueInJsonByKey(machinePropertySWMA, 'FEATURE', swmaList[o].software_FC);
                        this.setValueInJsonByKey(machinePropertySWMA, 'DESCRIPTION', swmaList[o].software_des);
                        this.setValueInJsonByKey(machinePropertySWMA, 'TYPE', 'ADD');
                        if (swmaList[o].purchase != undefined && swmaList[o].purchase != null
                            && swmaList[o].purchase != '' && swmaList[o].purchase == 'N/C') {
                            this.setValueInJsonByKey(machinePropertySWMA, 'CHARGEABLE', 'N');
                        } else {
                            this.setValueInJsonByKey(machinePropertySWMA, 'CHARGEABLE', 'Y');
                        }
                        this.setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', this.appendToString(swmaList[o].component_count));
                        this.setValueInJsonByKey(machinePropertySWMA, 'IS EXPANSION', this.appendToString(swmaList[o].is_expansion));
                        this.setValueInJsonByKey(machinePropertySWMA, 'POWERLINE TYPE',swmaList[o].powerline_type);
                        this.setValueInJsonByKey(machinePropertySWMA, 'hpoFlag',swmaList[o].hpoFlag);
                        this.setValueInJsonByKey(machinePropertySWMA, 'count',this.appendToString(swmaList[o].count));
                        this.setValueInJsonByKey(machinePropertySWMA, 'ADDITION FLAG',swmaList[o].addition_flag);
                        this.setValueInJsonByKey(machinePropertySWMA, 'EXPANSION MODE ID',this.appendToString(swmaList[o].expansion_mode_id));
                        num++;
                        machinePropertiesInfoSource.push(machinePropertySWMA);
                    }
                    for (let k = 0; k < thirdSWMA.length; k++) {
                        let machinePropertySWMA2 = {
                            'LINE NO': '', 'MTM': '', 'FEATURE': '', 'DESCRIPTION': '', 'QUANTITY': '',
                            'TYPE': '', 'PRODUCT': '', 'SYSTEM': '', 'CPUSIU': '', 'CHARGEABLE': '', 'CRAD': '', 'FROM TYPE': '',
                            'FROM MODEL': '', 'FROM SN': '', 'FROM SYSTEM TYPE': '', 'FROM SYSTEM NO': '', 'INSTALL DATE': '',
                            'CUSTNO': '', 'TO TYPE': '', 'TO MODEL': '', 'TO SN': '', 'TO SYSTEM TYPE': '', 'TO SYSTEM NO': '',
                            'IS EXPANSION':'','POWERLINE TYPE':'','hpoFlag':'','count':'','ADDITION FLAG':'','EXPANSION MODE ID':''
                        };
                        if (swmaList[o].id == thirdSWMA[k].choice_software_id) {
                            if (hpoExportFlag){
                                this.setValueInJsonByKey(machinePropertySWMA2, 'LINE NO', this.getLineNo(m + headerSW.length + 3, num));
                            }else{
                                this.setValueInJsonByKey(machinePropertySWMA2, 'LINE NO', this.getLineNo(m + headerSW.length + 2, num));
                            }
                            this.setValueInJsonByKey(machinePropertySWMA2, 'FEATURE', thirdSWMA[k].software_FC);
                            this.setValueInJsonByKey(machinePropertySWMA2, 'DESCRIPTION', thirdSWMA[k].software_des);
                            this.setValueInJsonByKey(machinePropertySWMA2, 'TYPE', 'ADD');
                            if (thirdSWMA[k].purchase != undefined && thirdSWMA[k].purchase != null
                                && thirdSWMA[k].purchase != '' && thirdSWMA[k].purchase == 'N/C') {
                                this.setValueInJsonByKey(machinePropertySWMA2, 'CHARGEABLE', 'N');
                            } else {
                                this.setValueInJsonByKey(machinePropertySWMA2, 'CHARGEABLE', 'Y');
                            }
                            this.setValueInJsonByKey(machinePropertySWMA, 'QUANTITY', this.appendToString(thirdSWMA[k].component_count));
                            this.setValueInJsonByKey(machinePropertySWMA2, 'IS EXPANSION', this.appendToString(thirdSWMA[k].is_expansion));
                            this.setValueInJsonByKey(machinePropertySWMA2, 'POWERLINE TYPE',thirdSWMA[k].powerline_type);
                            this.setValueInJsonByKey(machinePropertySWMA2, 'hpoFlag',swmaList[o].hpoFlag);
                            this.setValueInJsonByKey(machinePropertySWMA2, 'count',this.appendToString(swmaList[o].count));
                            this.setValueInJsonByKey(machinePropertySWMA2, 'ADDITION FLAG',thirdSWMA[k].addition_flag);
                            this.setValueInJsonByKey(machinePropertySWMA2, 'EXPANSION MODE ID',this.appendToString(swmaList[o].expansion_mode_id));
                            num++;
                            machinePropertiesInfoSource.push(machinePropertySWMA2);

                        }
                    }

                }
            }
        }

//====================================================================================================================end
//==========================================csv数据组装：开始生成csv的文件流信息组装====================================start
        if (machineNo == 1) {
            //拼接csv文件的第一行固定行信息
            resultStr = this.setTittleByArray(csvHead, resultStr);

            //为csv根据固定航设置第二行数据
            resultStr = this.createDataBySourceJSON(csvHead, csvHeadResource, resultStr);
        }
        //设置第三行的固定表头
        resultStr = this.setTittleByArray(systemInfo, resultStr);

        //以第三行的固定表头设置第四行的数据
        resultStr = this.createDataBySourceJSON(systemInfo, systemInfoSource, resultStr);

        //生成第五行固定行数据
        resultStr = this.setTittleByArray(machinePropertiesInfo, resultStr);
        //控制台打印最终结果

        //生成组件列表
        resultStr = this.createComponentByComponentsJSONData(machinePropertiesInfo, machinePropertiesInfoSource, resultStr);
//====================================================================================================================end
//===========================================文件数据导出=============================================================start
        //将硬件/软件/维保集合整合在一个List用于生成cfr是05注释使用

        let dataList = this.integrationList(dataListHW,dataListSW,swmaList);

        return {resultStr:resultStr,dataList:dataList};

    },
    integrationList(dataListHW,dataListSW,swmaList){
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
        dataList = dataList.filter((c) => !this.isEmpty(c.withdrawDate) && c.CRADDate > c.withdrawDate);
        return dataList;
    },
    /**
     * 判断是否为空
     * @param sText
     * @returns {boolean}
     */
    isEmpty(sText) {
        if (sText == null || sText == undefined || sText == '') {
            return true;
        } else if (sText.trim().length == 0) {
            return true;
        }
        return false;
    },
    getLineNo(first, num) {
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
    },

    /**
     * 该方法的作用是取得json串（即jsonSeq）中key对应的的值
     * @param jsonSeq json的数据源
     * @param key   json数据源中的key
     */
    getValueFromJsonByKey(jsonSeq, key) {
        return jsonSeq[key];
    },

    /**
     *该方法的作用是对json串（即jsonSeq）中key设置成指定的值
     * @param jsonSeq
     * @param key
     * @param value
     */
    setValueInJsonByKey(jsonSeq, key, value) {
        jsonSeq[key] = value;
    },

    /**
     * 根据固定的头数据拼接固定行数据
     * @param csvFixedTittleArray 固定的头数据，如["CFR DATE", "CFR APPLICATIO.......
     * @param resultStr  被拼接的串
     * */
    setTittleByArray(csvFixedTittleArray, resultStr) {
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
    },

    /**
     *根据给定的列数据和其对应的数据JSON生成该行数组指定的下一行数据
     * @param csvFixedTittleArray 固定的头数据，如["CFR DATE", "CFR APPLICATIO.......
     * @param fixedJSONData 上面的头对应的JSON数据源，如{"CFR DATE": "2019-03-05","CFR APPLICATION": 'ip.......
     * @param resultStr 被拼接的串
     */
    createDataBySourceJSON(csvFixedTittleArray, fixedJSONData, resultStr) {
        //用于暂时存储每次从json中取得的字段值
        let tempValue = '';
        for (let csvFixedTittleElement of csvFixedTittleArray) {
            tempValue = this.getValueFromJsonByKey(fixedJSONData, csvFixedTittleElement);

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
    },

    /**
     * 组装组件的每一行数据
     * @param csvFixedTittleArray 固定的头数据，此处只处理组件部分的表头
     * @param fixedJSONData 上面的头对应的JSON数据源，此处只处理组件的数据源
     * @param resultStr 被拼接的串
     */
    createComponentByComponentsJSONData(csvFixedTittleArray, fixedJSONData, resultStr) {
        let tempValue = '';
        //外城循环为所有的行数，也是所有的组件数据
        for (let i = 0; i < fixedJSONData.length; i++) {

            //内层循环循环取本行数据的在表头数据名称对应的值
            for (let j = 0; j < csvFixedTittleArray.length; j++) {
                tempValue = this.getValueFromJsonByKey(fixedJSONData[i], csvFixedTittleArray[j]);

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
    },
    /**
     * 非字符串类型拼接""  转换成字符串返回
     */
    appendToString(param) {
        if (param === '' || param === undefined || param === null) {
            return param;
        }
        if (typeof param === 'string') {
            return param;
        }

        return param += '';
    }
};
