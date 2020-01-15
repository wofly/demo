<template>
    <div>
        <!-------------------------------------硬盘扩展柜-------------------------------------------------------------->
        <div class="config">
            <p class="title content-label">
                <span class="config-title">{{$t('ExternalHardDiskExpansion.HardDiskExpansionCabinet')}}</span>
            </p>
            <div class="disk-expansion modify for-main">
                <div :key="index" v-for="(item,index) in addExpansion">
                    <el-select ref="ev"
                               @change="expansionBtn(index,item.expansionTypeModel)"
                               @visible-change="expansionChange($event,index)"
                               class="expansion expansion-margin"
                               :placeholder="$store.state.info_language?'please choose':'请选择'" size="mini"
                               v-model="item.expansionTypeModel">
                        <el-option :key="ind" :label="$store.state.info_language?ite.description_en:ite.description"
                                   :value="ite.id" class="expansion-input"
                                   v-for="(ite,ind) in item.expansionType">
                        </el-option>
                    </el-select>


                    <el-select @change="modeBtn(item.modeModel,index,item.expansionNumModel)"
                               @visible-change="modeBtnChange($event,index)"
                               class="expansion"
                               :placeholder="$store.state.info_language?'please choose':'请选择'"
                               size="mini"
                               v-show="expansionShow == 0"
                               v-model="item.modeModel">
                        <el-option :key="ind"
                                   :label="$store.state.info_language?ite.description_en:ite.description"
                                   :value="ite.id" class="expansion-input"
                                   v-for="(ite,ind) in item.modeData">
                        </el-option>
                    </el-select>


                    <p class="icon" v-show="expansionShow == 0">*</p>
                    <el-select @change="changeNumBtn(item.modeModel,index,item.expansionNumModel)"
                               @visible-change="changeExpansionNum($event,index)"
                               class="sel"
                               :placeholder="$store.state.info_language?'please choose':'请选择'"
                               size="mini"
                               v-show="expansionShow == 0"
                               v-model="item.expansionNumModel">
                        <!--;changeNum(item.expansionTypeModel,index,item.expansionNumModel)-->
                        <el-option :key="ind" :label="ite" :value="ite"
                                   v-for="(ite,ind) in item.expansionNum">
                        </el-option>
                    </el-select>
                    <el-button @click="expansionBtn(index,0)" circle
                               class="dele" icon="el-icon-close" size="mini" v-show="expansionShow == 0"
                               type="info"></el-button>
                    <div v-for="dl in item.expansionType" v-if="item.expansionTypeModel==dl.id" :key="dl.language">
                        <div class="pdiv" v-if="dl.temponTit!=null">
                            {{dl.temponTit}}
                        </div>
                        <div class="pdiv red-a" v-if="dl.uiStatus">
                            {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                        </div>
                        <div class="pdiv" v-if="dl.setTimeMe">
                            此部件将于&lt; {{dl.setTimeMe}}&gt; 停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                        </div>
                    </div>
                    <br>
                    <div v-show="expansionShow == 0">
                        <!--:disabled="disabled"-->
                        <el-button
                                   @click="addExpansionData()"
                                   icon="el-icon-plus" size="mini" v-if="index ==addExpansion.length-1"></el-button>
                        <span class="add-cables" v-if="index ==addExpansion.length-1">{{$t('ExternalHardDiskExpansion.AddExpansionEnclosure')}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-----------------------------------------硬盘扩展柜 线缆-------------------------------------------------->
        <div class="config" v-show="expansionShow == 0">
            <p class="title content-label">
                <span class="config-title">{{$t('ExternalHardDiskExpansion.HardDiskExtensionCabinetCable')}}</span>
            </p>
            <div class="modify for-main">
                <el-select @change="cableBtn(1,2,cableModel)" class="cable"
                           :placeholder="$store.state.info_language?'please choose':'请选择'" size="mini"
                           v-model="cableModel">
                    <el-option :key="ind" :label="ite.description_en"
                               :value="ite.id"
                               v-for="(ite,ind) in cableData">
                    </el-option>
                </el-select>
                <p class="icon">*</p>
                <el-select class="sel"
                           :placeholder="$store.state.info_language?'please choose':'请选择'"
                           size="mini"
                           v-model="cableNumModel">
                    <el-option :key="ind"
                               :label="ite"
                               :value="ite"
                               v-for="(ite,ind) in cableNum"
                               v-if="ite==cableNumModel">
                    </el-option>
                </el-select>
                <div v-for="dl in cableData" v-if="cableModel==dl.id" :key="dl.language">
                    <div class="pdiv" v-if="dl.temponTit!=null">
                        {{dl.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="dl.uiStatus">
                        {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="dl.setTimeMe">
                        此部件将于&lt; {{dl.setTimeMe}}&gt; 停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                    </div>
                </div>

                <br>
                <div v-show="!cableModel">
                    <el-button icon="el-icon-plus" size="mini"></el-button>
                    <span class="add-cables">{{$t('Power.lists.PowerLine.content1')}}</span>
                </div>
            </div>
        </div>

        <!------------------------------------------------扩展柜硬盘-------------------------------------------------->
        <ExternalHardDiskExpansion :eh2s="eh2s" :DiskAll="DiskAll" :diskapli="diskapli" :ehs2DeSum="ehs2DeSum" ref="mychild" v-show="expansionShow == 0" :getDiskAll="getDiskAll" @getDiskUpa="getDiskUpa"></ExternalHardDiskExpansion>

        <div class="config" v-show="expansionShow == 0">
            <p class="title content-label">
                <span class="config-title">{{$t('ExternalHardDiskExpansion.AdvancedConfiguration')}}</span>
            </p>
            <div class="tips">
                {{$t('ExternalHardDiskExpansion.Number')}}
                <!--[EHS2]扩展柜SSD分区数量：-->
                <el-input
                    v-model="ehs2Sum"
                    :disabled="true">
            </el-input>
            </div>

            <p class="title content-label">
                <span class="config-title">{{$t('ExternalHardDiskExpansion.tips')}}</span>
            </p>
            <span class="tips">{{$t('ExternalHardDiskExpansion.TotalHardDiskCapacity')}}:{{hardDriveCapacity | fullNum}}</span>
            <!--<span v-if="!this.$route.query.showMax" class="tips">{{$t('ExternalHardDiskExpansion.TotalHardDiskCapacity')}}:111GB</span>-->
        </div>
    </div>
</template>

<script>
    /**
     * 外部硬盘（扩展柜）
     *
     * @date 2019/10/11
     * @author yuwenqiang
     */

    /*引入外部扩展柜*/
    import ExternalHardDiskExpansion from './ExternalHardDiskExpansion.vue';

    export default {
        name: "ExternalHardDisk",
        components: {
            ExternalHardDiskExpansion,
        },
        data() {
            return {
                /*-------------硬盘扩展柜-----------*/
                //存储model的数据  8条
                expansioncaseModel: [],
                // 扩展柜的下拉数据
                array: [],
                // 硬盘扩展柜 外部循环数组
                addExpansion: [],
                //记录已经选过的id，不在出现
                brr: [],
                //硬盘数据的展示
                DiskAll: [],
                //硬盘的可选类型
                diskapli: [],
                // 获取扩展柜线缆数据
                cableData: [],
                //eh2s的数据componentId 和category_id
                eh2s: {},
                // 扩展柜线缆v-model
                cableModel: 0,
                //硬盘的总容量
                hardDriveCapacity:0,
                //ehs2的总数
                ehs2Sum:0,
                // 获取扩展柜线缆数量
                cableNum: '',
                // 扩展柜线缆数量v-model
                cableNumModel: '',
                // 当扩展柜 id为0 index为0 隐藏
                expansionShow: 1
            }
        },
        filters:{
            fullNum:(num)=>{
                console.log(num)
                if(num>1024){
                    return (num/1024).toFixed(2) +'TB'
                }else{
                    return num + 'GB'
                }
            },
        },
        methods: {
            //this.$emit改变父组件的参数
            getDiskUpa([index,value]){
                console.log(index,value)
                this.diskapli[index].disabled=value
            },
            /*获取扩展柜型号数据*/
            getExpansioncase() {
                const SQL = `SELECT info.description,info.description_en,diskcase.id,info.status,info.ui_status,info.title_msg,info.withdraw_date,diskcase.disk_count FROM component_disk_expansioncase diskcase
join component_category cate on cate.id=diskcase.category_id
join component_base_info info on info.id=diskcase.base_info_id
where info.deleted=1 and info.productId='${localStorage.productId}'`
                return new Promise((resolve, reject) => {
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            resolve(res);
                        }
                    });
                }).then(res => {
                    res.unshift({
                        description_en: 'please choose',
                        description: '请选择',
                        id: 0,
                        withdraw_date: null,
                        title_msg: '',
                        ui_status: 0
                    })
                    res.forEach((item, index) => {
                        this.$set(item, 'temponTit', item.title_msg) //展示的描述
                        if (item.withdraw_date) {
                            let thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                            let time = new Date(thisTime).getTime();//将时间改为时间戳
                            this.$set(res[index], 'time', time)//将时间戳添加到对象里面
                            this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                            //如果不为null的话,就改为天数
                            this.$store.commit('setStatusTime', item.withdraw_date)
                            this.$set(item, 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                        } else {
                            this.$set(res[index], 'time', '不比')//将时间戳添加到对象里面
                            this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                        }
                        this.$store.commit('uiStatusTime', item.ui_status)
                        this.$set(item, 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                        this.$set(item, 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                    });
                    this.array = [...res];
                    console.log(this.array)
                })
            },
            /*获取model的数据*/
            getModel() {
                let SQL = `select info.description,info.description_en,diskcase.id expansioncase_id,modeoption.id,modeoption.card_base_cnt
														from component_disk_modeoption modeoption
                            join relation_disk_expansioncase_modeoption casemode on casemode.modeoption_id=modeoption.id
                            join component_disk_expansioncase diskcase on diskcase.id=casemode.disk_expansioncase_id
                            join component_base_info  info on info.id=modeoption.base_info_id
														where info.deleted=1 and info.productId='${localStorage.productId}'`
                return new Promise((resolve, reject) => {
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            resolve(res);
                        }
                    });
                }).then(res => {
                    res.forEach(item => {
                        let num = item.description.indexOf('-')
                        this.$set(item, 'modeIdType', item.description.substr(num + 1, 1))
                    })
                    this.expansioncaseModel = res
                    console.log(this.expansioncaseModel)
                })
            },
            //获取库里ehs2的总数
            ehs2DeSum(){
                let ehs2SQL=`select id,component_count,expansion_mode_id from product_programme_detail detail
where component_id =(select other.id from component_other other
join component_base_info info on info.id=other.base_info_id
where info.productId='${localStorage.productId}' and info.component_FC='EHS2') and detail.product_id='${localStorage.productId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
              return  new Promise((resolve,reject)=>{
                    this.$db.all(ehs2SQL, (err, res) => {
                        if (err) {
                            console.log('查询失败',ehs2SQL)
                        } else {
                            // console.log('查询成功',res)
                            this.ehs2Sum=0
                            res.forEach(item=>{
                                this.ehs2Sum+=item.component_count
                            })
                            resolve(res)
                        }
                    })
                })
            },
            /*获取库里model的数据，柜的数量和model一样*/
            async setExpansioncase() {
                const SQLs = `select detail.id, detail.component_id ,detail.component_count ,detail.is_expansion,detail.expansion_mode_id from product_programme_detail detail
 join component_disk_modeoption mode on mode.category_id=detail.category_id and detail.component_id=mode.id
             where solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
// join component_disk_modeoption mode on mode.category_id=detail.category_id and detail.component_id=mode.id
                //查询库里的硬盘的数据
                let diskSQL=`select detail.id,detail.component_id,detail.category_id,detail.component_count,detail.expansion_mode_id,disk.disc_interface,disk.media_type,relation.disk_expansioncase_id
from product_programme_detail detail
join component_disk disk on disk.category_id=detail.category_id and disk.id=detail.component_id
join component_base_info info on info.id=disk.base_info_id
join relation_disk_expansioncase_modeoption relation on relation.modeoption_id=detail.expansion_mode_id
where info.productId='${localStorage.productId}' and detail.is_expansion=0 and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                let diskArr=[]//硬盘的数据
                //ehs2 的总数 和数据
                let ehs2=await this.ehs2DeSum()
                console.log(ehs2)
                await new Promise((resolve,reject)=>{
                        this.$db.all(diskSQL, (err, res) => {
                            if (err) {
                                console.log('查询失败',diskSQL)
                            } else {
                                console.log('查询成功',res,this.array)
                                diskArr=res
                                resolve()
                            }
                        })
                })
               await new Promise((resolve,reject) =>{
                   this.$db.all(SQLs, (err, res) => {
                       if (err) {
                           console.log('查询失败')
                       } else {
                           console.log(res,SQLs)
                           if (res.length > 0) {
                               /*当有数据 展示页面*/
                               this.expansionShow = 0;
                               let arr = []
                               res.forEach((item, index) => {
                                   //如果第一次进入就给arr。push值
                                   if (index == 0) {
                                       if (item.is_expansion == 0) {
                                           arr.push({...item, externalId: item.id})
                                           return
                                       }
                                       if (item.is_expansion == 1) {
                                           return arr.push({...item, interiorId: item.id})
                                       }
                                   }
                                   arr.forEach((it, ind) => {
                                       //不让就循环arr 如果component_id相同，就说明是内外部，然后给内外部赋id 数量相加
                                       if (it.component_id == item.component_id) {
                                           if (item.is_expansion == 0) {

                                               this.$set(arr[ind], 'externalId', item.id)
                                               arr[ind].component_count += item.component_count
                                               return
                                           }
                                           if (item.is_expansion == 1) {
                                               this.$set(arr[ind], 'interiorId', item.id)
                                               arr[ind].component_count += item.component_count
                                               return
                                           }
                                       }
                                       if (arr.length == ind + 1) {
                                           if (item.is_expansion == 0) {
                                               arr.push({...item, externalId: item.id})
                                               return
                                           }
                                           if (item.is_expansion == 1) {
                                               return arr.push({...item, interiorId: item.id})
                                           }
                                       }
                                   })
                               })
                               this.addExpansion = []
                               console.log(arr, res)
                               arr.forEach((item, index) => {
                                   let obj = {
                                       expansionType: [...this.array], //扩展柜下拉数据
                                       modeData: [], // mode下拉原始数据
                                       modeModel: item.component_id,//component的id
                                       modeModelId: item.component_id,//component的id，上一次的
                                       modeId: item.interiorId,//内部的id
                                       modeIds: item.externalId,//外部的id
                                       expansionNum: '', // 下拉数量的数组
                                       expansionNumModel: item.component_count,//当前的数量
                                       modeModelNum: item.component_count,//记录的数量，用来更改
                                       modeNumber: 0,//当前的卡数
                                       orgModeNumber: 0,//上一次的卡数
                                       expansionCabinetId: '',//上一次扩展柜的id
                                       expansionTypeModel: 0//当前柜的id，绑定的v-mode
                                   }
                                   this.expansioncaseModel.forEach(it => {
                                       if (item.component_id == it.id) {
                                           obj.expansionTypeModel = it.expansioncase_id //当前柜的id，绑定的v-mode
                                           obj.expansionCabinetId=it.expansioncase_id
                                           obj.modeNumber = it.card_base_cnt//当前的卡数
                                           obj.orgModeNumber = it.card_base_cnt//上一次的卡数
                                       }
                                       if (obj.expansionTypeModel == it.expansioncase_id) {
                                           obj.modeData.push(it)
                                       }
                                       return
                                   })
                                   this.$refs.mychild.addHardDisk.push({
                                        disk_count: '',//12或者24
                                        modeIdType: '',//分类  model或者mode2，model4
                                        eh2sId: '',//eh2sId的id
                                       disc_interface: '',//type 是用来匹配是mode12 还是mode24的
                                       modelId:'',//model 的id
                                       modelCategory_id:'',//category_id的id
                                       num:obj.expansionNumModel,
                                       typeAll: [],
                                       numAll:0
                                   })
                                   this.array.forEach(i=>{
                                       if(obj.expansionTypeModel==i.id){
                                           this.$refs.mychild.addHardDisk[index].disk_count=i.disk_count
                                           this.$refs.mychild.addHardDisk[index].disc_interface=i.disk_count==12?0:1
                                       }
                                   })
                                   this.expansioncaseModel.forEach(i => {
                                       if(obj.modeModel==i.id){
                                           console.log(i.modeIdType,i)
                                           this.$refs.mychild.addHardDisk[index].modeIdType=i.modeIdType
                                       }
                                   })
                                   ehs2.forEach(i => {
                                       if(obj.modeModel==i.expansion_mode_id){
                                           this.$refs.mychild.addHardDisk[index].eh2sId=i.id
                                       }
                                   })
                                   this.DiskAll.forEach(i => {
                                       if(obj.modeModel==i.expansion_mode_id){
                                           this.$refs.mychild.addHardDisk[index].eh2sId=i.id
                                       }
                                   })
                                   diskArr.forEach((it,i)=>{
                                       if(item.expansion_mode_id==it.expansion_mode_id){
                                           this.$refs.mychild.addHardDisk[index].numAll+=it.component_count
                                           this.$refs.mychild.addHardDisk[index].modelCategory_id=it.category_id
                                           this.$refs.mychild.addHardDisk[index].modelId=it.expansion_mode_id
                                           this.$refs.mychild.addHardDisk[index].typeAll.push({
                                               DiskAll:this.DiskAll,//硬盘展示的数据
                                               media_type:it.media_type,//类型区别 ssd和hdd
                                               media_typeBei:it.media_type,//类型区别 ssd和hdd
                                               diskid: it.component_id,// 硬盘选项的id
                                               sum: it.component_count,//数量
                                               upId: it.id,//库里的id
                                               sumAll: 0,//循环出来展示的数量
                                           })
                                       }
                                       // if(i==diskArr.length-1&&this.$refs.mychild.addHardDisk[index].numAll==0){
                                       //     this.$refs.mychild.addHardDisk[index].modelCategory_id=1
                                       //     this.$refs.mychild.addHardDisk[index].modelId=item.component_id
                                       //     this.$refs.mychild.addHardDisk[index].typeAll.push({
                                       //         DiskAll:this.DiskAll,//硬盘展示的数据
                                       //         media_type:'',//类型区别 ssd和hdd
                                       //         media_typeBei:'',//类型区别 ssd和hdd
                                       //         diskid: '',// 硬盘选项的id
                                       //         sum: '',//数量
                                       //         upId: '',//库里的id
                                       //         sumAll: 0,//循环出来展示的数量
                                       //     })
                                       // }
                                   })
                                   this.$refs.mychild.addHardDisk.forEach(it=>{
                                       if(it.typeAll.length==0){
                                           this.$refs.mychild.addHardDisk[index].modelCategory_id=1
                                           this.$refs.mychild.addHardDisk[index].modelId=item.component_id
                                           this.$refs.mychild.addHardDisk[index].typeAll.push({
                                               DiskAll:this.DiskAll,//硬盘展示的数据
                                               media_type:'',//类型区别 ssd和hdd
                                               media_typeBei:'',//类型区别 ssd和hdd
                                               diskid: '',// 硬盘选项的id
                                               sum: '',//数量
                                               upId: '',//库里的id
                                               sumAll: 0,//循环出来展示的数量
                                           })
                                       }
                                   })
                                   this.addExpansion.push(obj)
                                   this.brr.push(obj.modeModel)
                                   console.log(obj.modeId, obj.modeIds, this.addExpansion,this.$refs.mychild.addHardDisk)
                                   if (obj.modeId) {
                                       this.addExpansion[index].modeId = []
                                       this.seleExpansionId(obj.modeModel, 1, index)
                                   } else {
                                       this.addExpansion[index].modeId = []
                                   }
                                   if (obj.modeIds) {
                                       this.addExpansion[index].modeIds = []
                                       this.seleExpansionId(obj.modeModel, 0, index)
                                   } else {
                                       this.addExpansion[index].modeIds = []
                                   }
                               })

                               // console.log(this.addExpansion)
                           } else {
                               this.addExpansion.push({
                                   expansionType: [...this.array], //扩展柜下拉数据
                                   modeData: [], // mode下拉原始数据
                                   modeDataList: [],  // mode 下拉数据
                                   modeModel: '', // component的id
                                   modeModelId: '',//component的id，上一次的
                                   expansionNum: '', // 下拉数量的数组
                                   bool: false,//用来拦截，不让更改的
                                   diskCount: '',//记录能使用的硬盘数
                                   modeId: [],//内部id
                                   modeIds: [],//外部id
                                   modeNumber: 0,//当前的卡数
                                   orgModeNumber: 0,//上一次的卡数
                                   expansionNumModel: '',//当前的数量
                                   modeModelNum: '',//记录的数量，用来更改
                                   expansionCabinetId: '',//上一次扩展柜的id
                                   expansionTypeModel: 0//当前柜的id，绑定的v-mode
                               })
                           }
                           console.log(this.addExpansion)
                       }
                       resolve()
                   })
               })


            },
            /*查询电源线的数量*/
            seletePowerline() {
                let SQL = `select detail.component_count from product_programme_detail detail
join component_powerline powerline on powerline.category_id=detail.category_id and powerline.id=detail.component_id
join component_base_info info on info.id=powerline.base_info_id
where info.deleted=1 and detail.powerline_type=2 and product_id = '${localStorage.productId}' AND solution_id = '${localStorage.solutionId}' AND template_id ='${localStorage.templateId}' AND machine_id ='${localStorage.machineId}'`
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        // console.log('查询失败')
                    } else {
                        // console.log('查询成功', res)
                        this.cableNumModel = 0
                        this.cableNum = 0
                        res.forEach(item => {
                            this.cableNum += item.component_count
                            this.cableNumModel += item.component_count
                        })
                    }
                })
            },

            /*点击扩展柜 插入已选中的扩展柜数据*/
            async expansionBtn(index, bool) {
                //进来之后先看一下是不是最后一个12或24盘 是的话在看一下库里是不是用他启动的如果是就不能删
                let startDisk=true //判断是不是最后一个
                let startDiskdis=false  //判断是不是最后一个并且用它启动
                this.addExpansion.forEach((item,ind)=>{
                    if(item.expansionTypeModel==this.addExpansion[index].expansionTypeModel&&index!=ind){
                      return  startDisk=false
                    }
                })
                console.log(this.addExpansion[index],startDisk)
                if(startDisk){
                    await new Promise((resolve,reject)=>{
                        let SQL=`SELECT info.component_FC,other.id FROM product_programme_detail detail
join component_other other on other.category_id=detail.category_id and other.id=detail.component_id
join component_base_info info on info.id=other.base_info_id
where detail.product_id= '${localStorage.productId}' AND solution_id = '${localStorage.solutionId}' AND template_id ='${localStorage.templateId}' AND machine_id ='${localStorage.machineId}' and other.category_id=38`
                        this.$db.get(SQL,(err,res)=>{
                            if(err){
                                // console.log('查询失败 硬盘的启动信息',SQL)
                            }else{
                                // console.log('查询成功 硬盘的启动信息',res)
                                if(res){
                                    if(res.component_FC=='EHR1'&&this.addExpansion[index].expansionCabinetId==9){
                                        startDiskdis=true
                                        console.log(this.addExpansion[index].expansionTypeModel,'最后一个')
                                    }
                                    if(res.component_FC=='EHR2'&&this.addExpansion[index].expansionCabinetId==8){
                                        startDiskdis=true
                                        console.log(this.addExpansion[index].expansionTypeModel,'最后一个')
                                    }
                                }
                               return resolve()
                            }
                        })
                    })
                }
                if(startDiskdis){
                    // console.log('硬盘扩展柜被占用,用被删除的硬盘扩展柜启动')
                    // this.open('硬盘扩展柜被占用,用被删除的硬盘扩展柜启动')
                    this.open(this.$t('ExternalHardDiskExpansion.Occupied'))
                    this.addExpansion[index].expansionTypeModel=this.addExpansion[index].expansionCabinetId
                    return
                }

                //进来就肯定就会删除库里的数据,如果有数量就说明有数据，没有就库里没有 下标，0就删不为0就清空重新选
                if (this.addExpansion[index].expansionNumModel) {
                    if(this.$refs.mychild.addHardDisk[index].typeAll.length>1|| this.$refs.mychild.addHardDisk[index].typeAll[0].sum>0){
                        // this.open('硬盘扩展柜被占用')
                        this.open(this.$t('ExternalHardDiskExpansion.HardDiskExpansionEnclosureOccupied'))
                        this.addExpansion[index].expansionTypeModel=this.addExpansion[index].expansionCabinetId//当前柜的id，绑定的v-mode
                        return
                    }
                    //删除
                    await this.deleteExpansion(index)
                    //查询电源线的数量
                    this.seletePowerline()
                    //删除成功后就去查询ehs2的总数
                    this.ehs2DeSum()
                    this.$refs.mychild.addHardDisk.splice(index,1)
                }
                if (bool) {
                    if (this.addExpansion.length == 1) {
                        this.expansionShow = 0
                    }
                    this.addExpansion[index].modeModel = '', // component的id
                    this.addExpansion[index].expansionNumModel = ''
                    this.addExpansion[index].expansionCabinetId=this.addExpansion[index].expansionTypeModel//当前柜的id，绑定的v-mode
                    this.addExpansion[index].modeData = this.expansioncaseModel.filter(item => {
                        if (item.expansioncase_id == bool) {
                            return true
                        }
                    })
                } else {
                    //如果为0的话就删掉
                    this.brr.splice(index, 1)
                    if (this.addExpansion.length == 1) {
                        this.expansionShow = 1
                        this.addExpansion[index].expansionTypeModel = bool
                        this.addExpansion[index].expansionNumModel = ''
                    } else {
                        this.addExpansion.splice(index, 1)
                    }
                }
            },
            /*点击model 插入已选中的model数据*/
            async modeBtn(modeId, index, num) {
                this.expansioncaseModel.forEach(it => {
                    if (modeId == it.id) {
                        return this.addExpansion[index].modeNumber = it.card_base_cnt
                    }
                })
                //获取库里的插槽数
                await this.getExpansionNum(this.addExpansion[index].modeNumber, this.addExpansion[index].modeModelId)
                //内外部都没有就报错退出
                if (this.pcieNum + this.pcieNumber < 1) {
                    // this.err('插槽数不够')
                    this.err(this.$t('ExternalHardDiskExpansion.InsufficientSlots'))
                    this.addExpansion[index].modeModel = this.addExpansion[index].modeModelId ? this.addExpansion[index].modeModelId : '' //model 的id
                    this.addExpansion[index].modeNumber = this.addExpansion[index].orgModeNumber //数量
                    return
                }
                console.log(this.$refs.mychild.addHardDisk)
                if(this.addExpansion[index].expansionNumModel){
                    if(this.$refs.mychild.addHardDisk[index].typeAll.length>1||this.$refs.mychild.addHardDisk[index].typeAll[0].sum>0){
                        // this.err('硬盘占用扩展柜')
                        this.err(this.$t('ExternalHardDiskExpansion.HardDiskOccupiedExpansionEnclosure'))
                        this.addExpansion[index].modeModel = this.addExpansion[index].modeModelId ? this.addExpansion[index].modeModelId : ''
                        this.addExpansion[index].modeNumber = this.addExpansion[index].orgModeNumber
                        return

                    }
                }

                console.log(1111111, this.addExpansion[index].modeNumber)
                //如果有数量就可以删除
                if (num) {
                    console.log('删除')
                    await this.deleteExpansion(index)
                    //也要删除硬盘的数据

                }
                //内部有就先插内部
                if (this.pcieNum) {
                    await this.addExpansionHard(modeId, 1, index, this.addExpansion[index].modeNumber, 1)
                    //  mode的id、内外部、下标、sas卡的数量、添加的数量、点击model时执行，更改数量时不执行   下面取反
                    await this.seleExpansionId(modeId, 1, index)
                } else {
                    //内部没有就查外部
                    await this.addExpansionHard(modeId, 0, index, this.addExpansion[index].modeNumber, 1)
                    //  mode的id、内外部、下标、sas卡的数量、添加的数量、点击model时执行，更改数量时不执行   下面取反
                    await this.seleExpansionId(modeId, 0, index)
                }
                //库里存一条硬盘的数据
                await this.FirstHardDrive(this.addExpansion[index].expansionTypeModel, this.addExpansion[index].modeModel, index)
                //查询电源线的数量
                this.seletePowerline()
            },
            /*点击修改扩展柜的数量*/
            async changeNumBtn(modeId, index, num) {
                //一进来删掉所有的数据
                let sum=0
                this.$refs.mychild.addHardDisk[index].typeAll.forEach(item=>{
                    sum+=item.sum
                })
                console.log(sum,num,this.$refs.mychild.addHardDisk[index].disk_count)
                if(num*this.$refs.mychild.addHardDisk[index].disk_count<sum){
                    //如果小于就不能改，把数字变为备用的数字
                    this.addExpansion[index].expansionNumModel=this.addExpansion[index].modeModelNum
                    this.err(this.$t('ExternalHardDiskExpansion.HardDiskOccupiedExpansionEnclosure'))
                    return
                }
                //备用的数量
                this.addExpansion[index].modeModelNum=this.addExpansion[index].expansionNumModel
                this.deleteExpansion(index)
                //判断内部能不能放下
                if (this.pcieNum - num >= 0) {
                    // 内部能放并且能全部放下
                    await this.addExpansionHard(modeId, 1, index, this.addExpansion[index].modeNumber, num, 1)
                    //  mode的id、内外部、下标、sas卡的数量、添加的数量、点击model时执行，更改数量时不执行   下面取反
                    // 获取插入数据的id，内部的
                    await this.seleExpansionId(modeId, 1, index)
                } else {
                    //如果内部不能放下，就内部放满
                    await this.addExpansionHard(modeId, 1, index, this.addExpansion[index].modeNumber, this.pcieNum, 1)
                    //  mode的id、内外部、下标、sas卡的数量、添加的数量、点击model时执行，更改数量时不执行   下面取反
                    // 获取插入数据的id，内部的
                    await this.seleExpansionId(modeId, 1, index)
                    //然后剩多少，就都放到外部
                    await this.addExpansionHard(modeId, 0, index, this.addExpansion[index].modeNumber, num - this.pcieNum, 1)
                    //  mode的id、内外部、下标、sas卡的数量、添加的数量、点击model时执行，更改数量时不执行   下面取反
                    // 获取插入数据的id，外部的
                    await this.seleExpansionId(modeId, 0, index)
                }
                this.$refs.mychild.addHardDisk[index].num=num
                console.log(this.$refs.mychild.addHardDisk)
                //查询电源线的数量
                this.seletePowerline()
                // if(this.pcieNum){
                //     let sum=this.pcieNum
                //     // 内部能放并且能全部放下数量就是内部能放的减去数量
                //     if(this.pcieNum-num>=0){
                //         sum=this.pcieNum-num
                //     }
                //         await this.addExpansionHard(modeId,1,index,this.addExpansion[index].modeNumber,sum,1)
                //     //  mode的id、内外部、下标、sas卡的数量、添加的数量、点击model时执行，更改数量时不执行   下面取反
                // }
                //内部放不下的话，外部就放外部-内部能放的数量，就是总数了
                // if(this.pcieNum-num<0){
                //     //减去就是外部放的数量
                //     let sum=this.pcieNumber-this.pcieNum
                //     await this.addExpansionHard(modeId,1,index,this.addExpansion[index].modeNumber,sum,1)
                //
                // }
            },
            /*点击扩展柜前 通过mode id 隐藏扩展柜*/
            expansionChange(bool, index, id) {
                if (bool) {
                    let arr = this.expansioncaseModel.filter(item => {
                        let boo = true
                        for (let i = 0; i < this.brr.length; i++) {
                            if (item.id == this.brr[i] && index != i) {
                                return boo = false
                            }
                        }
                        return boo
                    })
                    console.log(arr)
                    this.addExpansion[index].expansionType = this.array.filter((item, ind) => {
                        if (ind == 0) {
                            return true
                        }
                        let boo = false
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].expansioncase_id == item.id) {
                                return boo = true
                            }
                        }
                        return boo
                    })
                }
            },
            /*点击model前 过滤已选mode不显示在选择框内*/
            modeBtnChange(boo, index) {
                if (boo) {
                    console.log(this.brr)
                    this.addExpansion[index].modeData = this.expansioncaseModel.filter(item => {
                        let bool = true
                        if (item.expansioncase_id != this.addExpansion[index].expansionTypeModel) {
                            return false
                        }
                        for (let i = 0; i < this.brr.length; i++) {
                            if (item.id == this.brr[i] && index != i) {
                                console.log(bool)
                                return bool = false
                            }
                        }
                        console.log(bool)
                        return bool
                    })
                    console.log(this.addExpansion[index].modeData, this.expansioncaseModel)
                }
            },
            /*点击数量之前 获取库里能最大插几个*/
            async changeExpansionNum(bool, index) {
                await this.getExpansionNum(this.addExpansion[index].modeNumber, this.addExpansion[index].modeModelId)
                this.addExpansion[index].expansionNum = this.sumExpansionNum
            },
            /*点击mode添加扩展柜时默认添加的第一条数据*/
            async FirstHardDrive(onId, teId, index) {
                let obj = {}
                console.log(this.expansioncaseModel, this.array, obj)
                this.expansioncaseModel.forEach(item => {
                    if (item.id == teId) {
                        //mode分几块1,2,4
                        obj.modeIdType = item.modeIdType
                        console.log(item.modeIdType)
                    }
                })
                this.array.forEach(item => {
                    if (item.id == onId) {
                        //各个硬盘占的数量 、12或24
                        obj.disk_count = item.disk_count
                        console.log(item.disk_count)
                    }
                })
                //type 是用来匹配是mode12 还是mode24的
                let type = 0
                if (obj.disk_count == 24) {
                    type = 1
                }
                for (let i = 0; i < this.DiskAll.length; i++) {
                    if (this.DiskAll[i].media_type == 0 && this.DiskAll[i].disc_interface == type) {
                        obj.diskid = this.DiskAll[i].id//component的id
                        obj.category_id = this.DiskAll[i].category_id//category_id
                        break;
                    }
                }
                let time = new Date().getTime();//将时间改为时间戳
                //添加的sql
                let addSQL = `INSERT INTO product_programme_detail
                ('product_id','category_id','component_id','solution_id','template_id','machine_id','component_count','expansion_mode_id','is_expansion','seq_Key')
                VALUES ('${localStorage.productId}','${this.eh2s.category_id}','${this.eh2s.id}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','1','${teId}',0,'${time}'), ('${localStorage.productId}','${obj.category_id}','${obj.diskid}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','1','${teId}',0,'${time}')`
                let selectSql = `select id,category_id from product_programme_detail where seq_Key=${time}`;
                await new Promise((resolve, reject) => {
                    this.$db.run(addSQL, (err, res) => {
                        if (!err) {
                            console.log('添加成功', res, err)
                            //根据时间戳去查id
                        } else {
                            console.log('添加成功', res, err)
                        }
                        resolve()
                    })
                })
                //添加成功后就去查询ehs2的总数
                await this.ehs2DeSum()
                //添加完成后就忘页面上push数据
                await new Promise((resolve, reject) => {
                    this.$db.all(selectSql, (err, res) => {
                        if (err) {
                            console.log('查询失败', addSQL, err)
                        } else {
                            console.log('查询成功', res)
                            res.forEach(item => {
                                if (item.category_id == this.eh2s.category_id) {
                                    obj.eh2sId = item.id
                                } else {
                                    obj.upId = item.id
                                }
                            })
                            //判断数组有没有这个，有改，没有添加
                            if (this.$refs.mychild.addHardDisk.length > index) {
                                // this.$refs.mychild.addHardDisk[index].typeAll[0].disc_interface = type//type 是用来匹配是mode12 还是mode24的 类型的id相当
                                // this.$refs.mychild.addHardDisk[index].typeAll[0].diskid = obj.diskid// 硬盘选项的id
                                // sum: 1,//数量
                                //     upId: obj.upId,//库里的id
                                // this.$refs.mychild.addHardDisk[index].disk_count = obj.disk_count//12或者24
                                // this.$refs.mychild.addHardDisk[index].modeIdType = obj.modeIdType//分类  model或者mode2，model4
                                // this.$refs.mychild.addHardDisk[index].eh2sId = obj.eh2sId
                                // this.$refs.mychild.addHardDisk[index].modelId = teId
                                // this.$refs.mychild.addHardDisk[index].modeIdType = obj.modeIdType
                                this.$refs.mychild.addHardDisk.splice(index,1,{
                                    disk_count: obj.disk_count,//12或者24
                                    modeIdType: obj.modeIdType,//分类  model或者mode2，model4
                                    eh2sId: obj.eh2sId,//eh2sId的id
                                    disc_interface: type,//type 是用来匹配是mode12 还是mode24的
                                    modelId:teId,//model 的id
                                    modelCategory_id:obj.category_id,//category_id的id
                                    num:1,//添加的个数
                                    numAll:1,//默认展示的个数
                                    typeAll: [
                                        {
                                            DiskAll:this.DiskAll,//硬盘展示的数据
                                            media_type:0,//类型区别 ssd和hdd
                                            media_typeBei:0,//类型区别 ssd和hdd
                                            diskid: obj.diskid,// 硬盘选项的id
                                            sum: 1,//数量
                                            upId: obj.upId,//库里的id
                                            sumAll: obj.disk_count,//循环出来展示的数量
                                        }
                                    ]
                                })
                            } else {
                                this.$refs.mychild.addHardDisk.push({
                                    disk_count: obj.disk_count,//12或者24
                                    modeIdType: obj.modeIdType,//分类  model或者mode2，model4
                                    eh2sId: obj.eh2sId,//eh2sId的id
                                    disc_interface: type,//type 是用来匹配是mode12 还是mode24的
                                    modelId:teId,//model 的id
                                    modelCategory_id:obj.category_id,//category_id的id
                                    num:1,//添加的个数
                                    numAll:1,//默认展示的个数
                                    typeAll: [
                                        {
                                            DiskAll:this.DiskAll,//硬盘展示的数据
                                            media_type:0,//类型区别 ssd和hdd
                                            media_typeBei:0,//类型区别 ssd和hdd
                                            diskid: obj.diskid,// 硬盘选项的id
                                            sum: 1,//数量
                                            upId: obj.upId,//库里的id
                                            sumAll: obj.disk_count,//循环出来展示的数量
                                        }
                                    ]
                                })
                            }
                        }
                        console.log(this.$refs.mychild.addHardDisk)
                        resolve()
                    })
                })
                //添加成功后就去查询硬盘的总数
                this.getDiskAll()
            },

            /*硬盘扩展柜  添加方法*/
            async addExpansionData() {
                console.log(this.sumExpansionNum)
                /* 通过数据  限制长度*/
                if (this.addExpansion.length == this.expansioncaseModel.length) {
                    this.disabled = true;
                    return false;
                }
                let arr=this.expansioncaseModel.filter(item=>{
                    let bool=true
                    for(let i=0;i<this.brr.length;i++){
                        if(item.id==this.brr[i]){
                            console.log(bool)
                            return bool=false
                        }
                    }
                    console.log(bool)
                    return bool
                })
                console.log(arr)
                //第一个为sas卡的数量，因为最小为2  第二个为id也为过滤，所以肯定没有
                  await this.getExpansionNum(2,arr[0].id)
                //内外部都没有就报错退出
                if (this.pcieNum + this.pcieNumber < 1) {
                    //this.err('插槽数不够')
                    return

                }
                /*当扩展柜的数量不为0的时候 可添加*/
                if (this.addExpansion[this.addExpansion.length - 1].expansionNumModel) {
                    /*获取扩展柜型号数据*/
                    this.addExpansion.push({
                        expansionType: [...this.array], //扩展柜下拉数据
                        modeData: [], // mode下拉原始数据
                        modeDataList: [],  // mode 下拉数据
                        modeModel: '', // component的id
                        description_en:'please choose',
                        modeModelId: '',//component的id，上一次的
                        expansionNum: '', // 下拉数量的数组
                        bool: false,//用来拦截，不让更改的
                        diskCount: '',//记录能使用的硬盘数
                        modeId: [],//内部id
                        modeIds: [],//外部id
                        modeNumber: 0,//当前的卡数
                        orgModeNumber: 0,//上一次的卡数
                        expansionNumModel: '',//当前的数量
                        modeModelNum: '',//记录的数量，用来更改
                        expansionCabinetId: '',//上一次扩展柜的id
                        expansionTypeModel: 0//当前柜的id，绑定的v-mode
                    })
                }
            },
            //添加扩展柜
            addExpansionHard(modeId, neiW, index, sasNum, num, bool) {
                //  mode的id、内外部、下标、sas卡的数量、添加的数量、点击model时执行，更改数量时不执行   下面取反
                /*添加数据 扩展柜，model，sas卡，连接线,电源，电源线*/
                let SQL = `INSERT INTO product_programme_detail
                ('product_id','category_id','component_id','solution_id','template_id','machine_id','component_count','expansion_mode_id',is_expansion,powerline_type)
                select '${localStorage.productId}','${this.$route.query.xpansionId}','${this.addExpansion[index].expansionTypeModel}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${num}','${modeId}','${neiW}',0
                union all
                select '${localStorage.productId}','${this.$route.query.modelId}','${modeId}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${num}','${modeId}','${neiW}',0
                union all
                select '${localStorage.productId}',io.category_id,io.id,'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${sasNum * num}','${modeId}','${neiW}',0 from relation_disk_modeoption_iocard relation
join component_iocard io on io.id=relation.iocard_id
where  relation.modeoption_id='${modeId}'  and io.PCIelocal='${neiW?1:2}'
                union all
                select '${localStorage.productId}',connect.category_id,connect.id,'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${num * 2}','${modeId}','${neiW}',0  from relation_disk_modeoption_connectingline relation
join component_connectingline connect on connect.id=relation.connectingline_id
where relation.modeoption_id='${modeId}'
                union all
                select '${localStorage.productId}',power.category_id,power.id,'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${num}','${modeId}','${neiW}',0 from relation_disk_expansioncase_power relation
join component_power power on power.id=relation.power_id
where relation.disk_expansioncase_id='${this.addExpansion[index].expansionTypeModel}'
union all
                select '${localStorage.productId}',line.category_id,line.id,'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${num * 2}','${modeId}','${neiW}',2 from relation_disk_expansioncase_powerline relation
join component_powerline line on line.id= relation.powerline_id
where relation.disk_expansioncase_id='${this.addExpansion[index].expansionTypeModel}'`
                console.log(SQL)
                return new Promise((resolve, reject) => {
                    this.$db.run(SQL, (err, res) => {
                        if (err) {
                            console.log('插入失败', SQL)
                        } else {
                            console.log('插入成功')
                            return resolve()
                        }
                    })
                }).then(res => {
                    if (!bool) {
                        this.addExpansion[index].expansionNumModel = 1//数量为1个
                        this.addExpansion[index].modeModelId = modeId//记录下来要变回去的上一次的modelId
                        this.addExpansion[index].orgModeNumber = this.addExpansion[index].modeNumber//sas卡的算法前面是上一次的
                        if (this.brr.length < index + 1) {
                            this.brr.push(modeId)
                        } else {
                            this.brr[index] = modeId
                        }
                        console.log('插入成功qqqqqq')
                    }
                })
            },
            //根据扩展柜查询所有的id
            seleExpansionId(modeId, neiW, index) {
                //查询刚才添加的数据 model的id 判断内外 下标
                let seleteSQL = `select id,category_id from product_programme_detail where product_id = '${localStorage.productId}' AND solution_id = '${localStorage.solutionId}' AND template_id ='${localStorage.templateId}' AND machine_id ='${localStorage.machineId}' and is_expansion=${neiW} and expansion_mode_id='${modeId}'`
                //查询刚才添加数据的id,
                return new Promise((resolve, reject) => {
                    this.$db.all(seleteSQL, (err, res) => {
                        if (err) {
                            console.log('查询失败', seleteSQL)
                        } else {
                            console.log('查询成功', seleteSQL)
                            return resolve(res)
                        }
                    })
                }).then(res => {
                    let id = ''
                    if (neiW) {
                        id = 'modeId'
                    } else {
                        id = 'modeIds'
                    }
                    res.forEach(item => {
                        if (item.category_id == this.$route.query.xpansionId) {
                            //扩展柜的id
                            return this.$set(this.addExpansion[index][id], 0, item.id)
                        }
                        if (item.category_id == this.$route.query.modelId) {
                            //model的id
                            return this.$set(this.addExpansion[index][id], 1, item.id)
                        }
                        if (item.category_id == 6) {
                            //sas卡的id
                            return this.$set(this.addExpansion[index][id], 2, item.id)
                        }
                        if (item.category_id == 5) {
                            //电源的id
                            return this.$set(this.addExpansion[index][id], 3, item.id)
                        }
                        if (item.category_id == 8) {
                            //电源线的id
                            return this.$set(this.addExpansion[index][id], 4, item.id)
                        }
                        if (item.category_id == 25) {
                            //连接线的id
                            this.$set(this.addExpansion[index][id], 5, item.id)
                        }
                        //连接线的id
                        //this.$set(this.addExpansion[index][id],5,item.id)
                    })
                    console.log(this.addExpansion[index][id], this.addExpansion[index])
                })
            },
            /*删除库里的数据*/
            deleteExpansion(index) {
                let deleteSQL= `DELETE FROM product_programme_detail WHERE expansion_mode_id ='${this.addExpansion[index].modeModelId}' and  product_id = '${localStorage.productId}' AND solution_id = '${localStorage.solutionId}' AND template_id ='${localStorage.templateId}' AND machine_id ='${localStorage.machineId}' AND category_id not in(select distinct disk.category_id from component_category cate
join component_disk disk on disk.category_id=cate.id union select 39)`;
                console.log(deleteSQL)
                return new Promise((resolve, reject) => {
                    this.$db.run(deleteSQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$db.run('ROLLBACK');
                            this.$Notice.error({
                                title: '删除失败',
                                desc: err,
                            });
                        } else {
                            console.log('删除成功')
                            this.addExpansion[index].modeIds = []
                            this.addExpansion[index].modeId = []
                            return resolve()
                        }
                    });
                })
            },
            /*获取扩展柜数量*/
            async getExpansionNum(num, modelId) {
                //点击过后的sas卡数的关系，点击前的id，判断pcie插槽数占用的情况，不包括这个的
                /* CPU个数 */
                const CPUSQL = `select component_count cpu_sum_count from product_programme_detail detail  join component_cpu cpu on detail.category_id=cpu.category_id and detail.component_id=cpu.id where  solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                /* 外部PCIE扩展柜的使用情况，内瓤的数量 */
                const SQLpci = `select detail.component_count from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where detail.is_expansion=1 and detail.component_id =(select distinct io.id from component_iocard io
join relation_expansionflesh_iocard flesh on flesh.iocard_id=io.id
join component_base_info info on info.id=io.base_info_id where info.productId='${localStorage.productId}'
)and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                /* 内部、外部PCIE的使用情况 */
                const SQLpc = `select component_count,is_expansion,expansion_mode_id  from product_programme_detail detail
               join component_iocard io  on detail.category_id=io.category_id and detail.component_id=io.id where  solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                let than = this;
                console.log(num)
                // let numPcie = 0
                /* CPU个数 */

                await new Promise(function (resolve, reject) {
                    than.$db.get(CPUSQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            resolve(res);
                        }
                    });
                }).then((res) => {
                    /* CPU个数 */
                    this.cpu = res.cpu_sum_count;
                    console.log(res, this.cpu)
                })
                await new Promise(function (resolve, reject) {
                    than.$db.get(SQLpci, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            resolve(res);
                        }
                    });
                }).then((res) => {
                    if (res) {
                        this.ioCard = res.component_count
                    } else {
                        this.ioCard = 0;
                    }
                    console.log(this.ioCard)
                })
                let EJBBNum=  await new Promise((resolve,reject)=>{
                    let EJBB =`select detail.id from product_programme_detail detail
						join component_backplane back on back.category_id=detail.category_id and back.id=detail.component_id
						join component_base_info info on info.id=back.base_info_id
						where detail.product_id='${localStorage.productId}' and info.component_FC='EJBB' and detail.template_id='${localStorage.templateId}' and detail.solution_id='${localStorage.solutionId}'
                and detail.machine_id='${localStorage.machineId}'`
                    this.$db.get(EJBB,(err,res)=>{
                        if(res){
                            resolve(1)
                        }else{
                            resolve(0)
                        }
                    })
                })
                let pcie = 0+EJBBNum;
                let externalPcie = 0;
                await new Promise(function (resolve, reject) {
                    than.$db.all(SQLpc, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            resolve(res);
                        }
                    });
                }).then((res) => {
                    res.forEach(item => {
                        if (modelId == item.expansion_mode_id) {
                            return
                        }
                        if (item.is_expansion == 0) {
                            externalPcie += item.component_count; //外部卡数
                        } else {
                            pcie += item.component_count;//内部卡数
                        }
                    })
                    console.log(this.cpu, this.ioCard, pcie, externalPcie);
                    //this.addExpansion[index].modeNumber = 2
                    this.pcieNum = 0 /*计算内部插槽数*/
                    this.pcieNumber = 0; /*计算外部插槽数*/
                    if (this.cpu == 2) {
                        this.pcieNum = parseInt((7 - pcie) / num);
                    } else if (this.cpu == 3) {
                        this.pcieNum = parseInt((9 - pcie) / num);
                    } else if (this.cpu == 4) {
                        this.pcieNum = parseInt((11 - pcie) / num);
                    }
                    if (this.ioCard > 0) {
                        this.pcieNumber = parseInt((this.ioCard * 6 - externalPcie) / num);
                    }
                    this.sumExpansionNum = this.pcieNum + this.pcieNumber;
                    console.log(this.sumExpansionNum, this.pcieNum, this.pcieNumber);

                })
            },
            async getDisk() {
                //查询硬盘的SQl
                let SQL = `select disk.id,disk.capacity,disk.media_type,disk.disc_interface,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status,info.category_id from component_disk disk
join component_base_info info on info.id=disk.base_info_id
where info.deleted=1 and info.productId='${localStorage.productId}' and disk.disc_interface in (0,1)`
                let diskSQL = `select distinct media_type from component_disk`
                await new Promise((resolve, reject) => {
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            console.log('查询失败')
                        } else {
                            console.log('查询成功', res)
                            res.forEach((item, index) => {
                                this.$set(res[index], 'temponTit', item.title_msg) //展示的描述
                                this.$set(res[index], 'setTimeMe', item.withdraw_date)//过期的时间
                                if (res[index].withdraw_date) {
                                    let thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                    let time = new Date(thisTime).getTime();//将时间改为时间戳
                                    this.$set(res[index], 'time', time)//将时间戳添加到对象里面
                                    //如果不为null的话,就改为天数
                                    this.$store.commit('setStatusTime', item.withdraw_date)
                                    this.$set(res[index], 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                                }
                                this.$store.commit('uiStatusTime', item.ui_status)
                                this.$set(res[index], 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                                this.$set(res[index], 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                            });
                            this.DiskAll = res
                            return resolve()
                        }
                    })
                })
                await new Promise((resolve, reject) => {
                    this.$db.all(diskSQL, (err, res) => {
                        if (err) {
                            console.log('查询失败')
                        } else {
                            res.forEach(item => {
                                if (item.media_type == 1) {
                                    this.diskapli.push({media_type: item.media_type, en: 'HDD',disabled:false})
                                }
                                if (item.media_type == 0) {
                                    this.diskapli.push({media_type: item.media_type, en: 'SSD',disabled:false})
                                }

                            })
                            console.log('查询成功', res, this.diskapli, this.DiskAll)
                            return resolve()
                        }
                    })
                })
            },
            //查询电源线6672的展示数据   /*获取EHS2的id*/
            getpowerline() {
                let powerlineSQl = `select distinct line.id,info.description,info.description_en from component_powerline line
            join relation_disk_expansioncase_powerline relation on relation.powerline_id=line.id
            join component_base_info info on info.id=line.base_info_id
            where info.deleted=1 and info.productId='${localStorage.productId}'`
                let SQL = `
 select other.id,info.category_id from component_other other
 join component_base_info info on info.id=other.base_info_id
 where info.deleted=1 and info.productId='${localStorage.productId}' and component_FC = 'EHS2'`
                this.$db.get(powerlineSQl, (err, res) => {
                    if (err) {
                        console.log('查询失败')
                    } else {
                        console.log('查询成功', res)
                        this.cableData.push(res)
                        this.cableModel = res.id
                    }
                })
                this.$db.get(SQL, (err, res) => {
                    if (err) {
                        console.log('查询失败')
                    } else {
                        console.log('查询成功', res)
                        this.eh2s = res
                    }
                })
            },
            //报错的
            open(error) {
                this.$alert(error, {
                    confirmButtonText: this.$store.state.info_language?'confirm':'确定',
                    callback: action => {
                    },
                });
            },
            /*不让删除mode或者是不让减少时展示*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'error'
                });
            },

            //获取库里硬盘的总容量
            getDiskAll(){
                let getDisk=` select disk.capacity,detail.component_count from product_programme_detail detail
 join component_disk disk on disk.category_id=detail.category_id and disk.id=detail.component_id where solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                this.$db.all(getDisk, (err, res) => {
                    if (err) {
                        console.log('查询失败',getDisk)
                    } else {
                        console.log('查询成功',res)
                        this.hardDriveCapacity=0
                        res.forEach(item=>{
                            this.hardDriveCapacity+=item.capacity*item.component_count
                        })
                    }
                })
            },
        },

        /*进入页面获取数据*/
        async created() {
            /*---------------------------------硬盘扩展柜-------------------------------------------------------------*/
            /*获取扩展柜型号数据*/
            await this.getExpansioncase()
            /*获取扩展柜model的数据*/
            await this.getModel()
            /*获取硬盘的数据*/
            await this.getDisk()

            /*获取库里的model数量。扩展柜数量一样*/
            await this.setExpansioncase()
            //查询电源线6672的展示数据   /*获取EHS2的id*/
            this.getpowerline()
            //查询电源线的数量
            this.seletePowerline()

        },


        /* 获取component_category 表中id */
        beforeRouteEnter(from, to, next) {
            next(vm => {
                console.log(vm.$route.query)
                vm.$emit('comup', from.query.id);
                vm.getDiskAll()
                if (vm.addExpansion.length > 0) {
                    vm.getExpansionNum(true, 0);
                }
            })
        },
    }
</script>

<style scoped lang="scss">
    /*----------------------表单项--------------------------*/

    .config {
        margin-top: 20px;
        margin-left: 20px;

        .icon {
            font-size: 25px;
            text-align: center;
            height: 50px;
            display: inline-block;
        }

        .el-input {
            width: 80px;
            margin-right: 20px;
        }

        .el-select {
            width: 400px;
        }


        .title {
            width: 98%;
            background: #f2f2f2;
            padding: 5px;
            margin-bottom: 10px;
        }


        .add-cables {
            padding: 10px;
        }

        .cable {
            width: 523px;
        }
    }

    .config .expansion {
        width: 250px;

        .expansion-input {
            width: 250px;
        }

    }

    .expansion-margin {
        margin-right: 17px;
    }

    /*----------其他select修改宽度----------------*/
    .other .config .el-select {
        width: 100px;
    }

    .other .config .other-select-two {
        width: 400px;
        margin-left: 30px;
    }

    .modify {
        margin: 40px 0;
    }

    .dele {
        margin-left: 20px;
    }
    .tips{
        margin-left: 10px;
    }

</style>
