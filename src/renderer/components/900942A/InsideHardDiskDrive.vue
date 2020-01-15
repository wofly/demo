<template>
    <!--内部硬盘-->
    <div class="accessories">
        <div>
            <div class="config cable">
                <p class="title content-label">
                    <span class="config-title">{{$t('backPlane.prepositionBackPlane.title')}}</span>
                </p>

                <!--前置背板-->
                <div class="modify for-main">
                    <el-select size="mini" v-model="frontHardDiskData"
                               placeholder="请选择"
                               @change="backplaneStorageData(frontHardDiskData,1)"
                               @visible-change="backplaneStorageData(frontHardDiskData,backplaneNumber)">
                        <el-option v-for="item in backplane" :key="item.name" :label="$store.state.info_language?item.en:item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <p class="icon">*</p>
                    <el-select size="mini" v-model="backplaneNumber" placeholder="请选择" class="other-select-one  sel"
                               @change="backplaneStorageData(frontHardDiskData,backplaneNumber)"
                               @visible-change="backplaneStorageData(frontHardDiskData,backplaneNumber)">
                        <el-option v-for="item in backplaneQuantity" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>

                    <div v-for="dl in backplane" v-if="frontHardDiskData==dl.id" :key="dl.id">
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
                    <br>
                    <span class="add-cables">{{frontBackplaneDescription}}</span>
                </div>

                <!-- 分类背板-->
                <div class="modify for-main" v-if="frontHardDiskData === 1">
                    <el-select size="mini" v-model="splitBackplane" placeholder="请选择"
                               @change="storageSplitBackplane(splitBackplane,1)"
                                @visible-change="storageSplitBackplane(splitBackplane,splitBackplaneNumber)">
                        <el-option v-for="item in separationBackplaneData" :key="item.value" :label="$store.state.info_language?item.en:item.value"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                    <p class="icon">*</p>
                    <el-select size="mini" v-model="splitBackplaneNumber" :placeholder="queAS" class="other-select-one sel"
                               @change="storageSplitBackplane(splitBackplane,splitBackplaneNumber)"
                               @visible-change="storageSplitBackplane(splitBackplane,splitBackplaneNumber)">
                        <el-option v-for="item in splitBackplaneData" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <div v-for="dl in separationBackplaneData" v-if="splitBackplane==dl.id" :key="dl.id">
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
                    <br>
                    <span class="add-cables">{{splitBackplaneDescription}}</span>
                </div>
            </div>

            <!--前置硬盘-->
            <FrontHardDisk :num ='num' :sign='sign' ref="FrontHardDisk"></FrontHardDisk>

            <div v-if="frontHardDiskData === 1">

                <!--中置背板-->
                <div class="config">
                    <p class="title content-label">
                        <span class="config-title">{{$t('backPlane.infixBackPlane.title')}}</span>
                    </p>
                    <div class="modify for-main">
                        <el-select size="mini" v-model="backplaneData" placeholder="$store.state.info_language?'please choose':'请选择'" disabled="disabled"
                                   @change="storageBackplaneData(backplaneData,1)">
                            <el-option v-for="item in intermediateBackplane" :key="item.value" :label="$store.state.info_language?item.en:item.value"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                        <p class="icon">*</p>
                        <el-select size="mini" v-model="backplaneDataNumber" placeholder="请选择" disabled="disabled"
                                   class="other-select-one sel"
                                   @change="storageBackplaneData(backplaneData,backplaneDataNumber)">
                            <el-option v-for="item in backplanePulldown" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <br>
                        <span class="add-cables">{{middleBackplaneDescribe}}</span>
                    </div>

                <!--中置硬盘-->
                <MiddleHardDisk :backplaneData="backplaneData"></MiddleHardDisk>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 内部硬盘
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */

    /*引入前置硬盘*/
    import FrontHardDisk from './FrontHardDisk.vue';
    /*引入中置硬盘*/
    import MiddleHardDisk from './MiddleHardDisk.vue';

    export default {
        name: "InsideHardDiskDrive",
        components: {
            FrontHardDisk,
            MiddleHardDisk,
        },
        data() {
            return {
                queAS:this.$store.state.info_language?'please choose':'请选择',//默认显示时，请选择的中英文切换
                signT:'',
                sign:'',
                /*---------------前置背板---------------*/
                // 前置背板 v-model
                frontHardDiskData: 1,
                //前置数量 v-model
                backplaneNumber: 1,
                // 获取数据库id 判断数据id是否相同
                frontBackplateId: '',
                // 选择前置背板  传入前置硬盘数量
                num:12,
                // 获取前置背板下拉数据
                backplane: [],
                // 获取前置背板数量下拉
                backplaneQuantity: 1,
                // 前置背板描述
                frontBackplaneDescription: '',
                /*------------------分离背板-----------------*/
                // 分离背板 v-model
                splitBackplane: 0,
                // 分离背板数量
                splitBackplaneNumber: '',
                // 获取分离背板数据
                separationBackplaneData: [],
                // 分离背板数量下拉
                splitBackplaneData: 1,
                // 分离背板id
                splitBackplaneId: '',
                // 分离背板描述
                splitBackplaneDescription:'',
                /*------------------中置背板-----------------*/
                //  中置背板下拉 v-model
                backplaneData: 0,
                // 中置背板数量 v-model
                backplaneDataNumber: '',
                // 获取中置背板数据
                intermediateBackplane: [],
                // 获取中置背板数量下拉
                backplanePulldown: 1,
                // 中置背板id
                middleBackplaneId: '',
                // 删除中置背板id
                intermediateId: '',
                // 中置背板描述
                middleBackplaneDescribe: '',
                iId:0//记录上一次点击的id
            }
        },

        methods: {
            /*------------------------------------------------------前置背板------------------------------------------------------------*/
            /*返回上一页*/
            reload() {
                this.$router.go(-1);
            },

            /*前置背板 选中的数据 存储数据库*/
            backplaneStorageData(id, num) {
                console.log(id,this.backplane)
                // 判断前置背板id   可使用硬盘最大值
                let gettime= new Date().getTime() //获取现在的时间戳
                this.backplane.filter((item)=>{
                    if(this.$store.state.showWithdraw==0 && item.time<gettime){
                        return false //如果时间小于现在时间，也就说过市了，不在显示
                    }
                })
                let sum=0
                this.$refs.FrontHardDisk.arr.forEach(item=>{
                    sum+=item.num
                })
                this.backplane.forEach(item=>{
                    if(item.id==id){
                        if(sum>item.cunt){
                           return  sum=0;
                        }else{
                            return  this.num = item.cunt;
                        }
                    }
                })
                if(!sum){
                    this.frontHardDiskData=this.iId
                    return
                }
                this.iId=this.frontHardDiskData
                // if(id == 7){
                //     this.num = 18;
                // }else{
                //     this.num = 12;
                // }

                if(id != 1){
                    this.storageSplitBackplane(0, 1)
                }

                /*通过vuex 传入选中前置背板id, 从而选择面板*/
                this.$store.backplaneId = this.frontHardDiskData;
                /*前置背板 选中的数据 存储数据库*/
                this.addBackplaneData(id, num);
                this.getDataList(id, num)
            },

            /*前置背板 选中的数据 存储数据库*/
            addBackplaneData(id, num) {
                if (this.frontBackplateId) {
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${id}',template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}',
                                 solution_id = '${localStorage.solutionId}',product_id = '${localStorage.productId}'
                                 where id=${this.frontBackplateId}`
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
                    (product_id,category_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')
                    VALUES('${localStorage.productId}','${this.signT}',${id},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                    console.log(SQL)
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

                                    }
                                    this.frontBackplateId = res.id;
                                })
                            }
                        }
                    })
                }
            },


            /*面板 数据获取*/
            getDataList(id,num) {
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

                        const updateSql = `select info.description,info.description_en,back.id,info.withdraw_date,info.title_msg,info.ui_status from component_base_info info
join component_backplane back on back.base_info_id=info.id
where back.id in ( select relation.carry_backplane_id from component_backplane back
join relation_backplane_backplane relation on relation.choice_backplane_id = back.id
where back.id =${id})`
                        this.$db.all(updateSql, (err, res) => {
                            if (err) {
                                console.log("获取失败")
                            } else {
                                console.log("获取成功")
                                console.log(res)
                                let obj = {}
                                if(id == 1){

                                    if (this.panelDataId) {
                                        const updateSql = `UPDATE product_programme_detail set 'component_count'='1',component_id='${res[1].id}' ,template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.panelDataId}`
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
                (product_id,category_id,component_id,component_count,seq_Key,solution_id,'template_id','machine_id')VALUES(1,7,${res[1].id},${1},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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

                                    if (this.panelDataId) {
                                        const updateSql = `UPDATE product_programme_detail set 'component_count'='1',component_id='${res[0].id}' ,template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.panelDataId}`
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
                (product_id,category_id,component_id,component_count,seq_Key,solution_id,'template_id','machine_id')VALUES(1,7,${res[0].id},${1},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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
                    }
                })
            },

            /*获取所有背板下拉数据*/
            getBackplane() {
                const SQL = `select  cm.*,info.description backplane_des,info.description_en,info.withdraw_date,info.title_msg,info.ui_status,so.ship_date from component_backplane cm
       join component_base_info info on info.id=cm.base_info_id
    join product_info product on product.id = info.productId
    join relation_solution_product relation on relation.product_id=product.id
    join solution so on so.id=relation.solution_id
    where  product.id = ${localStorage.productId} and so.id='${localStorage.solutionId}'`;
                this.$db.all(SQL, (err, res) => {
                    console.log(res)
                    if (err) {

                    } else {
                        res.forEach((item,index)=>{
                            this.$set(item,'temponTit',item.title_msg) //展示的描述
                            this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                            if(item.withdraw_date){
                                let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                let time = new Date(thisTime).getTime();//将时间改为时间戳
                                this.$set(res[index],'time',time)//将时间戳添加到对象里面
                                //如果不为null的话,就改为天数
                                this.$store.commit('setStatusTime',item.withdraw_date)
                                this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                            }else{
                                this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                            }
                            this.$store.commit('uiStatusTime',item.ui_status)
                            this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                            this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                        });
                        /*获取前置背板数据*/
                        this.backplane=[]
                        for (let i = 0; i < res.length; i++) {
                            /*获取前置背板数据*/
                            this.backplane.push({id: res[i].id, name: res[i].backplane_des,en: res[i].description_en,tiem:res[i].time,setTimeMe:res[i].withdraw_date,overdueTime:res[i].overdueTime,temponTit:res[i].temponTit,uiStatusEn:res[i].uiStatusEn,uiStatus:res[i].uiStatus,cunt: res[i].disc_cnt,})
                            if (i === 2) {
                                break;
                            }
                        }

                        /*获取分离背板数量*/
                        this.splitBackplaneData = res[3].backplane_num;

                        /*获取中置背板*/
                        this.intermediateBackplane.push({id: 0, value: '请选择',en:'please choose',setTimeMe:null,overdueTime:'',temponTit:null,uiStatusEn:'',uiStatus:''}, {
                            id: res[4].id,
                            value: res[4].backplane_des,
                            en: res[4].description_en,
                            tiem:res[4].time,
                            setTimeMe:res[4].withdraw_date,
                            overdueTime:res[4].overdueTime,
                            temponTit:res[4].temponTit,
                            uiStatusEn:res[4].uiStatusEn,
                            uiStatus:res[4].uiStatus
                        })
                    }
                })
            },

            /*------------------------------------------------------分离背板------------------------------------------------------------*/

            /*获取分离背板下拉数据*/
            getPanelData() {
                const SQL = `select cb.*,info.description backplane_des,description_en,info.withdraw_date,info.title_msg,info.ui_status,so.ship_date from component_backplane cb left join relation_backplane_backplane cbb on cb.id=cbb.choice_backplane_id left join component_base_info info
                 on info.id=cb.base_info_id
							join product_info product on product.id = info.productId
						join relation_solution_product relation on relation.product_id=product.id
					join solution so on so.id=relation.solution_id
								where cb.id in
                (select s.carry_backplane_id from relation_backplane_backplane s where s.choice_backplane_id=1) AND cb.id=8`;
                this.$db.all(SQL, (err, res) => {
                    console.log(res)
                    if (err) {

                    } else {
                        res.forEach((item,index)=>{
                            this.$set(item,'temponTit',item.title_msg) //展示的描述
                            this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                            if(item.withdraw_date){
                                let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                let time = new Date(thisTime).getTime();//将时间改为时间戳
                                this.$set(res[index],'time',time)//将时间戳添加到对象里面
                                //如果不为null的话,就改为天数
                                this.$store.commit('setStatusTime',item.withdraw_date)
                                this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                            }else{
                                this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                            }
                            this.$store.commit('uiStatusTime',item.ui_status)
                            this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                            this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                        });
                        /*获取分离背板数据*/
                        this.separationBackplaneData = [];
                        this.separationBackplaneData.push(
                            {id: 0, value: '请选择',en:'please choose',setTimeMe:null,overdueTime:'',temponTit:null,uiStatusEn:'',uiStatus:''},
                            {id: res[0].id,value: res[0].backplane_des,en:res[0].description_en,tiem:res[0].time,setTimeMe:res[0].withdraw_date,overdueTime:res[0].overdueTime,temponTit:res[0].temponTit,uiStatusEn:res[0].uiStatusEn,uiStatus:res[0].uiStatus});
                        console.log(this.separationBackplaneData)
                    }
                })
            },

            /*分离背板往数据库里插入已选数据*/
            storageSplitBackplane(id, num) {
                if (id == 0) {
                    this.splitBackplaneNumber = ''
                }
                console.log(this.separationBackplaneData)
                let gettime= new Date().getTime() //获取现在的时间戳
                this.separationBackplaneData.filter(item=>{
                    if(this.$store.state.showWithdraw==0 && item.time<gettime){
                        return false //如果时间小于现在时间，也就说过市了，不在显示
                    }
                })
                if (this.splitBackplane === '') {
                    this.$message({
                        message: '请选择分离背板，在选择数量',
                        type: 'warning'
                    });
                    this.splitBackplaneNumber = '';
                } else {
                    if (id !== 0) {
                        if (this.splitBackplaneId) {
                            const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${id}',template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.splitBackplaneId}`
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
                    (product_id,category_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')
                    VALUES('${localStorage.productId}','${this.signT}',${id},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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
                                            this.splitBackplaneId = res.id;
                                        })
                                    }
                                }
                            })

                        }

                    } else {
                        // 当选中的id为0的 情况下  删除之前已插入的数据
                        const SQLDelete = `DELETE FROM product_programme_detail WHERE id=${this.splitBackplaneId}`;
                        this.$db.run(SQLDelete, (err, res) => {
                            if (err) {

                            } else {
                                this.splitBackplaneId = '';
                                this.splitBackplane = 0;
                            }
                        })
                    }
                }
            },
            /*------------------------------------------------------中置背板------------------------------------------------------------*/

            /*存储中置背板数据*/
            storageBackplaneData(id, num) {
                if(id == 0){
                    this.backplaneDataNumber = '';
                    // 调用 子组件方法，背板id为0时，清空硬盘
                    this.$children[7].checkClear(0,1);
                    // 调用 子组件方法，背板id为0 删除已选硬盘
                    this.$children[7].storageHardDiskData(0,1,0);

                }
                this.addBackplaneList(id, num);
            },

            /*往数据库里插入已选数据*/
            addBackplaneList(id, num) {
                if (id !== 0) {
                    if (this.middleBackplaneId) {
                        const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${id}',template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.middleBackplaneId}`
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
                    (product_id,category_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')
                    VALUES('${localStorage.productId}','${this.signT}',${id},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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
                                        this.middleBackplaneId = res.id;
                                    })
                                }
                            }
                        })
                    }
                }else {
                    // 当选中的id为0的 情况下  删除之前已插入的数据
                    const SQLDel = `DELETE FROM product_programme_detail WHERE id
                    in(${this.middleBackplaneId},'${localStorage.machineId}')`;
                    this.$db.run(SQLDel, (err, res) => {
                        if (err) {

                        } else {
                            this.middleBackplaneId = '';
                        }
                    })
                }
            },
        },

        /*-------------------------------------------------------进入页面 获取背板数据---------------------------------------------------------*/

        created() {
            console.log(this.signT)
            /*获取所有背板数据*/
            const SQL = ` select * from product_programme_detail where
            category_id=7 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
            console.log(SQL)
            this.$db.all(SQL, (err, res) => {
                if (err) {

                } else {
                    for (let i = 0; i < res.length; i++) {
                        /* 判断  id 1 4 7 为前置背板*/
                        if (res[i].component_id === 1 || res[i].component_id === 4 || res[i].component_id === 7) {
                            this.frontHardDiskData = res[i].component_id;
                            this.backplaneNumber = res[i].component_count;
                            this.frontBackplateId = res[i].id;
                            this.iId=res[i].component_id
                        }
                        /* 判断  id 8 为分离背板*/
                        if (res[i].component_id === 8) {
                            this.splitBackplane = res[i].component_id;
                            this.splitBackplaneNumber = res[i].component_count;
                            this.splitBackplaneId = res[i].id;
                        }
                        /* 判断  id 25 为中置背板*/
                        if (res[i].component_id === 9) {
                            this.backplaneData = res[i].component_id;
                            this.backplaneDataNumber = res[i].component_count;
                            this.middleBackplaneId = res[i].id;

                        }
                    }
                }
            })
        },

        mounted() {

            /*通过vuex 传入选中前置背板id, 从而选择面板*/
            this.$store.backplaneId = this.frontHardDiskData;
            /*获取分离背板下拉数据*/
            this.getPanelData();
            /*获取所有背板*/
            this.getBackplane();
        },

        /* 获取component_category 表中id */
        beforeRouteEnter(from,to,next){
            next(vm=>{
                vm.$emit('comup',from.query.id)
                // 硬盘id
                vm.sign=from.query.sign;
                // 背板id
                vm.signT=from.query.signT;
                console.log( vm.sign,vm.signT)
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
            font-size: 14px;

        }

        .delete-btn {
            margin-left: 20px;
        }

        .tips {
            display: inline-block;
            padding: 10px 0;
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

    .config .other-select-one {
        width: 100px;
    }

    .cable {
        margin-top: 20px;
    }

    .modify {
        margin: 40px 0;
    }

    .delete-data {
        margin-left: 20px;
    }
</style>
