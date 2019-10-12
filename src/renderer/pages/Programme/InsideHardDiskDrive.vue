<template>
    <!--内部硬盘-->
    <div class="accessories">
        <div>
            <div class="config cable">
                <p class="title content-label">
                    <span class="config-title">backplane</span>
                </p>

                <!--前置背板-->
                <div class="modify for-main">
                    <el-select size="mini" v-model="frontHardDiskData"
                               placeholder="请选择"
                               @change="backplaneStorageData(frontHardDiskData,1)"
                               @visible-change="backplaneStorageData(frontHardDiskData,backplaneNumber)">
                        <el-option v-for="item in backplane" :key="item.name" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <p class="icon">*</p>
                    <el-select size="mini" v-model="backplaneNumber" placeholder="请选择" class="other-select-one  sel"
                               @change="backplaneStorageData(frontHardDiskData,backplaneNumber)"
                               @visible-change="backplaneStorageData(frontHardDiskData,backplaneNumber)">
                        <el-option v-for="item in backplaneQuantity" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <br>
                    <span class="add-cables">{{frontBackplaneDescription}}</span>
                </div>

                <!-- 分类背板-->
                <div class="modify for-main" v-if="frontHardDiskData === 1">
                    <el-select size="mini" v-model="splitBackplane" placeholder="请选择"
                               @change="storageSplitBackplane(splitBackplane,1)"
                                @visible-change="storageSplitBackplane(splitBackplane,splitBackplaneNumber)">
                        <el-option v-for="item in separationBackplaneData" :key="item.value" :label="item.value"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                    <p class="icon">*</p>
                    <el-select size="mini" v-model="splitBackplaneNumber" placeholder="请选择" class="other-select-one sel"
                               @change="storageSplitBackplane(splitBackplane,splitBackplaneNumber)"
                               @visible-change="storageSplitBackplane(splitBackplane,splitBackplaneNumber)">
                        <el-option v-for="item in splitBackplaneData" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <br>
                    <span class="add-cables">{{splitBackplaneDescription}}</span>
                </div>
            </div>

            <!--前置硬盘-->
            <FrontHardDisk :num ='num' :sign='sign'></FrontHardDisk>

            <div v-if="frontHardDiskData === 1">

                <!--中置背板-->
                <div class="config">
                    <p class="title content-label">
                        <span class="config-title">backplane</span>
                    </p>
                    <div class="modify for-main">
                        <el-select size="mini" v-model="backplaneData" placeholder="请选择" disabled="disabled"
                                   @change="storageBackplaneData(backplaneData,1)">
                            <el-option v-for="item in intermediateBackplane" :key="item.value" :label="item.value"
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
                // 判断前置背板id   可使用硬盘最大值
                if(id == 7){
                    this.num = 18;
                }else{
                    this.num = 12;
                }

                /*通过vuex 传入选中前置背板id, 从而选择面板*/
                this.$store.backplaneId = this.frontHardDiskData;
                /*获取前置背板描述*/
                this.getBackplaneDescribe(id, num)
                /*前置背板 选中的数据 存储数据库*/
                this.addBackplaneData(id, num);
            },

            /*前置背板描述*/
            getBackplaneDescribe(id, num) {
                const SQL = `select * from component_backplane where id =${id}`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        for (let i = 0; i < res.length; i++) {
                            /*前置背板描述*/
                            this.frontBackplaneDescription = res[i].backplane_info;
                        }
                    }
                })
            },

            /*前置背板 选中的数据 存储数据库*/
            addBackplaneData(id, num) {
                if (this.frontBackplateId) {
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${id}',template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}',
                                 solution_id = '${localStorage.solutionId}',product_id = '${localStorage.productId}'
                                 where id=${this.frontBackplateId}`
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
                    (product_id,categroy_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')
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

            /*获取所有背板下拉数据*/
            getBackplane() {
                const SQL = `select * from component_backplane`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        /*获取前置背板数据*/
                        for (let i = 0; i < res.length; i++) {
                            /*获取前置背板数据*/
                            this.backplane.push({id: res[i].id, name: res[i].backplane_des})
                            if (i === 2) {
                                break;
                            }
                        }

                        /*获取分离背板数量*/
                        this.splitBackplaneData = res[3].backplane_num;

                        /*获取中置背板*/
                        this.intermediateBackplane.push({id: 0, value: '请选择'}, {
                            id: res[4].id,
                            value: res[4].backplane_des
                        })
                    }
                })
            },

            /*------------------------------------------------------分离背板------------------------------------------------------------*/

            /*获取分离背板下拉数据*/
            getPanelData() {
                this.separationBackplaneData = [];
                const SQL = `select cb.* from component_backplane cb left join relation_backplane_backplane cbb
                        on cb.id=cbb.choice_backplane_id where cb.id in
                (select s.carry_backplane_id from relation_backplane_backplane s where s.choice_backplane_id=1) AND cb.id=8`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        /*获取分离背板数据*/
                        this.separationBackplaneData.push(
                            {id: 0, value: '请选择'},
                            {id: res[0].id,value: res[0].backplane_des});
                    }
                })
            },

            /*分离背板往数据库里插入已选数据*/
            storageSplitBackplane(id, num) {
                if (id == 0) {
                    this.splitBackplaneNumber = ''
                }
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
                    (product_id,categroy_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')
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
                            }
                        })
                    }
                }
                this.getSplitBackplane(id, num);
            },


            /*分离背板描述*/
            getSplitBackplane(id, num) {
                if(id != 0){
                    const SQL = `select * from component_backplane where id =${id}`;
                    this.$db.all(SQL, (err, res) => {
                        if (err) {

                        } else {
                            for (let i = 0; i < res.length; i++) {
                                /*分离背板描述*/
                                this.splitBackplaneDescription = res[i].backplane_info;
                            }
                        }
                    })
                }else{
                    /*分离背板描述*/
                    this.splitBackplaneDescription = '';
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
                this.getmiddleBackplaneDescribe(id, num);
                this.addBackplaneList(id, num);
            },

            /*获取中置背板描述*/
            getmiddleBackplaneDescribe(id, num) {
                if(id != 0){
                    const SQL = `select * from component_backplane where id =${id}`;
                    this.$db.all(SQL, (err, res) => {
                        if (err) {

                        } else {
                            for (let i = 0; i < res.length; i++) {
                                /*中置背板描述*/
                                this.middleBackplaneDescribe = res[i].backplane_info;
                            }
                        }
                    })
                }else{
                    /*中置背板描述*/
                    this.middleBackplaneDescribe = '';
                }

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
                    (product_id,categroy_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')
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
            categroy_id=7 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
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
            /*获取前置背板描述*/
            this.getBackplaneDescribe(1,1);

        },

        beforeRouteEnter(from,to,next){
            next(vm=>{
                vm.$emit('comup',from.query.id)
                vm.sign=from.query.sign;
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