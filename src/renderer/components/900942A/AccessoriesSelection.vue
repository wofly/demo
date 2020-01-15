<template>
    <!--配件选择-->
    <div class="accessories">
        <!--线缆-->
        <AccessoriesCable :cableChild="AccessoriesCable" :brr="brr" ref="AccessoriesCable"></AccessoriesCable>
        <!--导轨-->
        <div class="config">
            <p class="title content-label">
                <span class="config-title">{{$t('Accessories.lists.GuideRail.title')}}</span>
            </p>
            <div class="modify for-main">
                <el-select size="mini" v-model="value" placeholder="请选择" disabled="disabled">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <p class="icon">*</p>
                <el-input size="mini" v-model="input" disabled="disabled" class="sel"></el-input>
                <br>
                <el-button size="mini" icon="el-icon-plus" disabled="disabled"></el-button>
                <span class="add-cables">{{$t('Accessories.lists.GuideRail.content1')}}</span>
            </div>
        </div>
        <!--面板样式-->
        <div class="config">
            <p class="title content-label">
                <span class="config-title">{{$t('Accessories.lists.PanelStyle.title')}}</span>
            </p>
            <div class="modify for-main">
                <el-select size="mini" v-model="panel" placeholder="请选择"
                           @change="storagePanelStyleData(panel,1)"
                            @visible-change="storagePanelStyleData(panel,1)">
                    <el-option v-for="item in panelStyleData" :key="item.id" :label="item.value" :value="item.id">
                    </el-option>
                </el-select>
                <div v-for="dl in panelStyleData" v-if="panel==dl.id" :key="dl.language">
                    <div class="pdiv" v-if="dl.temponTit!=null">
                        {{dl.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="dl.uiStatus">
                        {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="dl.setTimeMe">
                        此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                    </div>
                </div>
            </div>
        </div>
        <!--基础语言-->
        <div class="config">
            <p class="title content-label">
                <span class="config-title">{{$t('Accessories.lists.language.title')}}</span>
            </p>
            <div class="modify for-main">
                <el-select size="mini" v-model="language" placeholder="请选择"
                           @change="storageLanguageData(language,1)">
                    <el-option v-for="item in basicLanguage" :key="item.id" :label="$store.state.info_language?item.description_en:item.description"
                               :value="item.id">
                    </el-option>
                </el-select>
                <div v-for="dl in basicLanguage" v-if="language==dl.id" :key="dl.language">
                    <div class="pdiv" v-if="dl.temponTit!=null">
                        {{dl.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="dl.uiStatus">
                        {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="dl.setTimeMe">
                        此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                    </div>
                </div>
            </div>
        </div>
        <!--其他-->
        <AccessoriesOther></AccessoriesOther>
    </div>
</template>

<script>
    /**
     * 配件
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */

    /*引入线缆*/
    import AccessoriesCable from './AccessoriesCable.vue';
    /*引入其他*/
    import AccessoriesOther from './AccessoriesOther.vue';


    export default {
        name: "AccessoriesSelection",
        components: {
            AccessoriesCable,
            AccessoriesOther,
        },
        data() {
            return {
                /*----------语言-----------*/
                // 基础语言下拉
                basicLanguage: [],
                // 基础语言v-model
                language: 1,
                // 基础语言id
                languageId:0,
                /*----------面板-----------*/
                // 面板id
                panelDataId:0,
                // 面板下拉数据
                panelStyleData: [],
                // 面板 v-model
                panel: '',
                /*----------初始值--------------*/
                input: '',
                options: [],
                value: '',
                AccessoriesCable:[],//记录库里获取的线缆的数据
                brr:[],//记录选择过的线缆的id
            }
        },

        methods: {

            /*--------------------------------------------面板-------------------------------------------------------------------*/

            /*返回上一页*/
            reload() {
                this.$router.go(-1);
            },

            /* 面板 存储数据*/
            storagePanelStyleData(id, num) {
                if (this.panelDataId) {
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${id}' ,template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.panelDataId}`
                    console.log(updateSql)
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log("修改失败")
                        } else {
                            console.log("修改成功")
                        }
                    })
                } else {
                    let time = new Date().getTime();
                    const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,component_count,seq_Key,solution_id,'template_id','machine_id')VALUES(1,7,${id},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                    console.log(SQL)
                    this.$db.run(SQL, (err, res) => {
                        console.log(SQL)
                        if (err) {

                        } else {
                            if (res) {
                                console.log("添加失败")
                            } else {
                                console.log("添加成功" + JSON.stringify(res));
                                let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                this.$db.get(selectSql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '系统错误',
                                            desc: err,
                                        });
                                        return
                                    }
                                    this.panelDataId = res.id;
                                })
                            }
                        }
                    })
                }
            },

            /*面板 数据获取*/
            getDataList() {
                console.log('有id')
                this.panelStyleData = [];
                this.panel = '';
                console.log(this.panelStyleData)
                console.log(this.$store.backplaneId)
                const updateSql = `select detail.* from product_programme_detail detail
join component_backplane back on back.category_id=detail.category_id and back.id=detail.component_id
where detail.component_id in (10,11) and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                console.log(updateSql)
                this.$db.all(updateSql, (err, res) => {
                    if (err) {
                        console.log("获取失败")
                    } else {
                        if(res.length>0){
                            this.panelDataId = res[0].id;
                        }
                        if(this.$store.backplaneId != undefined){
                            const updateSql = `select info.description,info.description_en,back.id,info.withdraw_date,info.title_msg,info.ui_status from component_base_info info
join component_backplane back on back.base_info_id=info.id
where back.id in ( select relation.carry_backplane_id from component_backplane back
join relation_backplane_backplane relation on relation.choice_backplane_id = back.id
where back.id =${this.$store.backplaneId})`
                            this.$db.all(updateSql, (err, res) => {
                                if (err) {
                                    console.log("获取失败")
                                } else {
                                    console.log("获取成功")
                                    console.log(res)
                                    let obj = {}
                                    if(this.$store.backplaneId == 1){
                                        res.forEach(item=>{
                                            if(item.id !=8){
                                                obj.value = item.description;
                                                obj.id =  item.id;
                                                this.$set(obj,'temponTit',item.title_msg) //展示的描述
                                                this.$set(obj,'setTimeMe',item.withdraw_date)//过期的时间
                                                if(item.withdraw_date){
                                                    //如果不为null的话,就改为天数
                                                    this.$store.commit('setStatusTime',item.withdraw_date)
                                                    this.$set(obj,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                                }
                                                this.$store.commit('uiStatusTime',item.ui_status)
                                                this.$set(obj,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                                this.$set(obj,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                                this.panelStyleData.push(obj);
                                                console.log( this.panelStyleData)
                                                this.panel = item.id;
                                            }
                                        })
                                        if (this.panelDataId) {
                                            const updateSql = `UPDATE product_programme_detail set 'component_count'='1',component_id='
                                ${this.panel}' ,template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.panelDataId}`
                                            console.log(updateSql)
                                            this.$db.run(updateSql, (err, res) => {
                                                if (res) {
                                                    console.log("修改失败")
                                                } else {
                                                    console.log("修改成功")
                                                }
                                            })
                                        } else {
                                            let time = new Date().getTime();
                                            const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,component_count,seq_Key,solution_id,'template_id','machine_id')VALUES(1,7,${this.panel},${1},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                                            console.log(SQL)
                                            this.$db.run(SQL, (err, res) => {
                                                console.log(SQL)
                                                if (err) {

                                                } else {
                                                    if (res) {
                                                        console.log("添加失败")
                                                    } else {
                                                        console.log("添加成功" + JSON.stringify(res));
                                                        let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                                        this.$db.get(selectSql, (err, res) => {
                                                            if (err) {
                                                                this.$logger(err);
                                                                this.$Notice.error({
                                                                    title: '系统错误',
                                                                    desc: err,
                                                                });
                                                                return
                                                            }
                                                            this.panelDataId = res.id;
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }else{

                                        obj.value = res[0].description;
                                        obj.id = res[0].id;
                                        this.$set(obj,'temponTit',res[0].title_msg) //展示的描述
                                        this.$set(obj,'setTimeMe',res[0].withdraw_date)//过期的时间
                                        if(res[0].withdraw_date!=null){
                                            //如果不为null的话,就改为天数
                                            this.$store.commit('setStatusTime',res[0].withdraw_date)
                                            this.$set(obj,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                        }
                                        this.$store.commit('uiStatusTime',res[0].ui_status)
                                        this.$set(obj,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                        this.$set(obj,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                        this.panelStyleData.push(obj);
                                        this.panel = res[0].id;

                                        if (this.panelDataId) {
                                            const updateSql = `UPDATE product_programme_detail set 'component_count'='1',component_id='
                                ${this.panel}' ,template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.panelDataId}`
                                            console.log(updateSql)
                                            this.$db.run(updateSql, (err, res) => {
                                                if (res) {
                                                    console.log("修改失败")
                                                } else {
                                                    console.log("修改成功")
                                                }
                                            })
                                        } else {
                                            let time = new Date().getTime();
                                            const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,component_count,seq_Key,solution_id,'template_id','machine_id')VALUES(1,7,${this.panel},${1},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                                            console.log(SQL)
                                            this.$db.run(SQL, (err, res) => {
                                                console.log(SQL)
                                                if (err) {

                                                } else {
                                                    if (res) {
                                                        console.log("添加失败")
                                                    } else {
                                                        console.log("添加成功" + JSON.stringify(res));
                                                        let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                                        this.$db.get(selectSql, (err, res) => {
                                                            if (err) {
                                                                this.$logger(err);
                                                                this.$Notice.error({
                                                                    title: '系统错误',
                                                                    desc: err,
                                                                });
                                                                return
                                                            }
                                                            this.panelDataId = res.id;
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                        }else{
                            console.log('没id')
                            this.panelStyleData = [];
                            this.panel = '';
                            console.log(this.panelStyleData)
                            console.log(this.$store.backplaneId)
                            /* 获取 面板数据*/
                            const SQL = ` select * from product_programme_detail where
            category_id=7 and component_id= 10 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                            this.$db.get(SQL, (err, resl) => {
                                console.log(SQL)
                                if (err) {

                                } else {
                                    this.panelDataId = resl.id;

                                    console.log(this.panelDataId)
                                    /*获取所有背板数据*/
                                    const SQL = ` select * from product_programme_detail where
            category_id=7 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                                    this.$db.all(SQL, (err, res) => {
                                        console.log(SQL)
                                        if (err) {

                                        } else {
                                            console.log(res)
                                            if (this.$store.backplaneId == undefined){

                                                for (let i = 0; i < res.length; i++) {

                                                    if(res[i].component_id ==1 ||res[i].component_id ==4 ||res[i].component_id ==7){
                                                        const updateSql = `select info.description,info.description_en,back.id,info.withdraw_date,info.title_msg,info.ui_status from component_base_info info join component_backplane back on back.base_info_id=info.id
where back.id in ( select relation.carry_backplane_id from component_backplane back
join relation_backplane_backplane relation on relation.choice_backplane_id = back.id
where back.id =${res[i].component_id})`
                                                        console.log(updateSql)
                                                        this.$db.all(updateSql, (err, resm) => {
                                                            if (err) {
                                                                console.log("获取失败")
                                                            } else {
                                                                console.log("获取成功")
                                                                console.log(resm)
                                                                resm.forEach((item,index)=>{
                                                                    this.$set(item,'temponTit',resm[index].title_msg) //展示的描述
                                                                    this.$set(item,'setTimeMe',resm[index].withdraw_date)//过期的时间
                                                                    if(item.withdraw_date){
                                                                        let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                                                        let time = new Date(thisTime).getTime();//将时间改为时间戳
                                                                        this.$set(resm[index],'time',time)//将时间戳添加到对象里面
                                                                        //如果不为null的话,就改为天数
                                                                        this.$store.commit('setStatusTime',resm[index].withdraw_date)
                                                                        this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                                                    }else{
                                                                        this.$set(resm[index],'time','不比')//将时间戳添加到对象里面
                                                                    }
                                                                    this.$store.commit('uiStatusTime',resm[index].ui_status)
                                                                    this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                                                    this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                                                });
                                                                let obj = {}
                                                                if(res[i].component_id == 1){

                                                                    for(let i = 0; i<resm.length; i++){

                                                                        if(resm[i].id != 8){
                                                                            obj.value = resm[i].description;
                                                                            obj.id =  resm[i].id;
                                                                            obj.time=resm[i].time;
                                                                            obj.temponTit=resm[i].temponTit;
                                                                            obj.setTimeMe=resm[i].setTimeMe;
                                                                            obj.overdueTime=resm[i].overdueTime;
                                                                            obj.uiStatusEn=resm[i].uiStatusEn;
                                                                            obj.uiStatus=resm[i].uiStatus;
                                                                            this.panel = resm[i].id;
                                                                            this.panelStyleData.push(obj);
                                                                            console.log( this.panelStyleData)
                                                                        }
                                                                    }
                                                                }else{
                                                                    obj.value = resm[0].description;
                                                                    obj.id = resm[0].id;
                                                                    obj.time=resm[0].time;
                                                                    obj.temponTit=resm[i].temponTit;
                                                                    obj.setTimeMe=resm[i].setTimeMe;
                                                                    obj.overdueTime=resm[i].overdueTime;
                                                                    obj.uiStatusEn=resm[i].uiStatusEn;
                                                                    obj.uiStatus=resm[i].uiStatus;
                                                                    this.panelStyleData.push(obj);
                                                                    this.panel = resm[0].id;
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            },

            /*--------------------------------------------语言-------------------------------------------------------------------*/

            /*语言 存储数据*/
            storageLanguageData(id, num) {
                console.log(id,num)
                if (this.languageId) {
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${id}' ,template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.languageId}`
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log("修改失败")
                        } else {
                            console.log("修改成功")
                        }
                    })
                } else {
                    let time = new Date().getTime();
                    const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')VALUES('${localStorage.productId}',28,${id},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                    this.$db.run(SQL, (err, res) => {
                        if (err) {

                        } else {
                            if (res) {
                                console.log("添加失败")
                            } else {
                                console.log("添加成功" + JSON.stringify(res));
                                let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                this.$db.get(selectSql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '系统错误',
                                            desc: err,
                                        });
                                        return
                                    }
                                    this.languageId = res.id;
                                })
                            }
                        }
                    })
                }
            },

            /*获取 语言数据*/
            getLanguage() {
                const SQLData = `select other.id, description,description_en,info.status,info.withdraw_date,info.title_msg,info.ui_status from component_base_info  info
                  left join component_other other on info.id=other.base_info_id
                  where info.category_id=28 and info.productId='${localStorage.productId}'`;
                this.$db.all(SQLData, (err, res) => {
                    if (err) {

                    } else {
                        console.log(res)
                        let gettime= new Date().getTime() //获取现在的时间戳
                        res.forEach((item,index)=>{
                            this.$set(item,'temponTit',item.title_msg) //展示的描述
                            this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                            if(item.withdraw_date){
                                //如果不为null的话,就改为天数
                                let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                let time = new Date(thisTime).getTime();//将时间改为时间戳
                                this.$set(res[index],'time',time)//将时间戳添加到对象里面
                                this.$store.commit('setStatusTime',item.withdraw_date)
                                this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                            }else{
                                this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                            }
                            this.$store.commit('uiStatusTime',item.ui_status)
                            this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                            this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                            if(this.$store.state.showWithdraw==0 && item.time<gettime){
                                return false //如果时间小于现在时间，也就说过市了，不在显示
                            }
                        });
                        for (let i = 0; i < res.length; i++) {
                            this.basicLanguage.push(res[i])
                        }
                    }
                })
            },
          /*线缆子组件里面的内容*/
            getAccessoriesCable(){
                /*获取线缆组件里的数据，id，数量*/
               let getAccessoriesCable= `select detail.id,detail.component_id,detail.component_count,info.description,info.description_en,info.status,info.withdraw_date,info.title_msg,info.ui_status from product_programme_detail detail join component_other other on other.id=detail.component_id and other.category_id=detail.category_id join component_base_info info on info.id=other.base_info_id  where product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}'`
                /*查询要展示的内型*/
                let getAccessories=`select other.id other_id,info.description,info.description_en,info.status,info.withdraw_date,info.title_msg,info.ui_status from component_other other join component_base_info info on info.id=other.base_info_id where other.base_info_id in (90,122)`
                /*查询库里HBA的数量*/
                let num=`select distinct detail.id,detail.component_count from product_programme_detail detail left join component_iocard io on io.category_id=detail.category_id where detail.component_id in (select io.id from component_iocard io  join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id
join component_base_info info on info.id=io.base_info_id
where pcie.id=3 and info.productId='${localStorage.productId}') and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and  machine_id= '${localStorage.machineId}'`
                /*获取线缆组件里的数据，id，数量*/
                this.$db.all(getAccessoriesCable, (err, res) => {
                    if (err) {
                        console.log(err,getAccessoriesCable)
                    } else {
                        /*查询要展示的内型*/
                        this.$db.all(getAccessories, (err, resA) => {
                            if (err) {
                                console.log(err,getAccessories)
                            } else {
                                /*查询库里HBA的数量*/
                                resA.forEach((item,index)=>{
                                    this.$set(item,'temponTit',item.title_msg) //展示的描述
                                    this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                                    if(item.withdraw_date){
                                        let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                        let time = new Date(thisTime).getTime();//将时间改为时间戳
                                        this.$set(resA[index],'time',time)//将时间戳添加到对象里面
                                        //如果不为null的话,就改为天数
                                        this.$store.commit('setStatusTime',item.withdraw_date)
                                        this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                    }else{
                                        this.$set(resA[index],'time','不比')//将时间戳添加到对象里面
                                    }
                                    this.$store.commit('uiStatusTime',item.ui_status)
                                    this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                    this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                });
                                let arr=[]
                                resA.forEach((item,index)=>{
                                    arr.push({...item,bool:false})
                                })
                                console.log(arr,num)
                                this.$db.all(num, (err, resSum) => {
                                    if (err) {
                                        console.log(err,num)
                                    } else {
                                        /*计算出库里HBA的数量，最小要展示的数*/
                                        this.AccessoriesCable=[]
                                        this.brr=[]
                                        let nun=0
                                        resSum.forEach(item=>{
                                            nun+=item.component_count
                                        })
                                        let lent=0
                                        res.forEach((item)=>{
                                            if(item.component_id==5){
                                                lent=1
                                                let bool=false
                                                /*如果为0 的话就可以删除*/
                                                if(nun==0){
                                                    bool=true
                                                }
                                                this.AccessoriesCable.push({...item,ather:arr,arr:arr,numZ:0,bool:bool,num:nun?nun:1})
                                                if(this.AccessoriesCable[this.AccessoriesCable.length-1].component_count<nun){
                                                    this.AccessoriesCable[this.AccessoriesCable.length-1].component_count=nun
                                                    /*如果数小于HBA的和的话，将库里的数据改为HBA的和*/
                                                    console.log(this.AccessoriesCable[this.AccessoriesCable.length-1])
                                                    this.$refs.AccessoriesCable.getNum(this.AccessoriesCable.length-1,nun)
                                                }
                                                this.brr.push(item.component_id)
                                            }
                                            if(item.component_id==3){
                                                this.AccessoriesCable.push({...item,ather:arr,arr:arr,numZ:0,bool:false})
                                                this.brr.push(item.component_id)
                                            }
                                        })
                                        console.log(res,lent,nun)
                                        if(nun>0&&lent==0){
                                            this.$refs.AccessoriesCable.addModel(1)
                                        }
                                        console.log(this.AccessoriesCable)

                                    }
                                })
                            }
                        })
                    }
                })
            },
        },
        mounted(){

            /*获取 语言数据*/
            this.getLanguage();

        },

        created() {

            /* 获取 语言数据*/
            const SQLLanguage = `SELECT * FROM PRODUCT_PROGRAMME_DETAIL WHERE category_ID = 28
               and solution_id = '${localStorage.solutionId}' and template_id = '${localStorage.templateId}' and machine_id = '${localStorage.machineId}'
            and product_id = '${localStorage.productId}'`;
            this.$db.all(SQLLanguage, (err, res) => {
                if (err) {
                    this.$logger(err);

                } else {
                    for (let i = 0; i < res.length; i++) {
                        this.languageId = res[i].id;
                        this.language = res[i].component_id;
                    }
                }
            })
        },

        /* 获取component_category 表中id */
        beforeRouteEnter(from,to,next){
            next(vm=>{
                vm.$emit('comup',from.query.id)
                // 背板id
                vm.sign=from.query.sign;
                // 语言id
                vm.signT=from.query.signT;
                console.log( vm.sign,vm.signT,11111)
                vm.getDataList();
               vm.getAccessoriesCable()
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
    }

    /*----------其他select修改宽度----------------*/
    .other .config .el-select {
        width: 100px;
    }

    .other .config .other-select-two {
        width: 400px;
        margin-left: 30px;
    }

    .cable {
        margin-top: 20px;
    }

    .modify {
        margin: 40px 0;
    }


</style>
