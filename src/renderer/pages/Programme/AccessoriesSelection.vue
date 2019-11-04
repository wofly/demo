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
                    <el-option v-for="item in basicLanguage" :key="item.id" :label="item.description"
                               :value="item.id">
                    </el-option>
                </el-select>
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
                panel: '[EJU4]适用于12-Bay 背板的前OEM挡板',
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
                                ${id}' ,template_id = '${localStorage.templateId}'，machine_id='${localStorage.machineId}' where id=${this.panelDataId}`
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
                    (product_id,categroy_id,component_id,component_count,seq_Key,solution_id,'template_id','machine_id')VALUES(1,7,${id},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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
                this.panelStyleData = [];
                if (this.$store.backplaneId != undefined) {
                    this.panel = '';
                    console.log(this.$store.backplaneId)
                    if (this.$store.backplaneId == 1 || this.$store.backplaneId == 4) {
                        this.panelStyleData.push({
                            value: '[EJU4]适用于12-Bay 背板的前OEM挡板',
                            id: 10
                        });
                        this.panel = 10;
                        console.log(this.panelStyleData)
                    } else {
                        this.panelStyleData.push(
                            {
                                value: '[EJUH]适用于18-Bay 背板的前OEM挡板',
                                id: 11
                            });
                        this.panel = 11;
                        console.log(this.panelStyleData)
                    }
                }
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
                    (product_id,categroy_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')VALUES(1,17,${id},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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
                const SQLData = `select other.id, description,description_en from component_base_info  info
                  left join component_other other on info.id=other.base_info_id
                  where info.categroy_id=28`;
                this.$db.all(SQLData, (err, res) => {
                    if (err) {

                    } else {
                        console.log(res)
                        for (let i = 0; i < res.length; i++) {
                            this.basicLanguage.push(res[i])
                        }
                    }
                })
            },
          /*线缆子组件里面的内容*/
            getAccessoriesCable(){
                /*获取线缆组件里的数据，id，数量*/
               let getAccessoriesCable= `select detail.id,detail.component_id,detail.component_count,info.description,info.description_en from product_programme_detail detail join component_other other on other.id=detail.component_id and other.categroy_id=detail.categroy_id join component_base_info info on info.id=other.base_info_id  where product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}'`
                /*查询要展示的内型*/
                let getAccessories=`select other.id other_id,info.description,info.description_en from component_other other join component_base_info info on info.id=other.base_info_id where other.base_info_id in (90,122)`
                /*查询库里HBA的数量*/
                let num=`select distinct detail.id,detail.component_count from product_programme_detail detail left join component_iocard io on io.category_id=detail.categroy_id where detail.component_id in ( select io.id from component_iocard io  join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id where pcie.id=3 ) and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and  machine_id= '${localStorage.machineId}'`
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
                                let arr=[]
                                resA.forEach((item,index)=>{
                                    arr.push({...item,bool:false})
                                })
                                console.log(arr)
                                this.$db.all(num, (err, resSum) => {
                                    if (err) {
                                        console.log(err,num)
                                    } else {
                                        /*计算出库里HBA的数量，最小要展示的数*/
                                        console.log(err,num)
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
            /*获取 面板数据*/
            this.getDataList();

        },

        created() {
            /* 获取 面板数据*/
            const SQLData = `SELECT * FROM PRODUCT_PROGRAMME_DETAIL WHERE CATEGROY_ID = 7 AND COMPONENT_ID=10
            and solution_id = '${localStorage.solutionId}' and template_id = '${localStorage.templateId}' and machine_id = '${localStorage.machineId}'
            and product_id = '${localStorage.productId}'`;
            this.$db.all(SQLData, (err, res) => {
                if (err) {
                    this.$logger(err);

                } else {
                    for (let i = 0; i < res.length; i++) {
                        this.panelDataId = res[i].id;
                        this.panel = res[i].component_id;
                    }
                }
            })
            /* 获取 语言数据*/
            const SQLLanguage = `SELECT * FROM PRODUCT_PROGRAMME_DETAIL WHERE CATEGROY_ID = 17 AND COMPONENT_ID=1
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

            /*获取所有背板数据*/
            const SQL = ` select * from product_programme_detail where
            categroy_id=7 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
            this.$db.all(SQL, (err, res) => {
                console.log(SQL)
                if (err) {

                } else {

                    if (this.$store.backplaneId == undefined){

                        for (let i = 0; i < res.length; i++) {

                            /* 判断  id 1 4 7 为前置背板*/
                            if (res[i].component_id === 1 || res[i].component_id === 4 || res[i].component_id === 7) {

                                if (res[i].component_id == 1 || res[i].component_id == 4) {
                                    this.panelStyleData.push({
                                        value: '[EJU4]适用于12-Bay 背板的前OEM挡板',
                                        id: 10
                                    });
                                    this.panel = 10;
                                    console.log(this.panelStyleData)
                                } else {
                                    this.panelStyleData.push(
                                        {
                                            value: '[EJUH]适用于18-Bay 背板的前OEM挡板',
                                            id: 11
                                        });
                                    this.panel = 11;
                                    console.log(this.panelStyleData)
                                }
                            }
                        }
                    }
                }
            })

        },

        /* 获取component_categroy 表中id */
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
