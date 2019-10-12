<template>
    <!--配件选择-->
    <div class="accessories">
        <div>
            <!--线缆-->
            <div class="config cable">
                <p class="title content-label">
                    <span class="config-title">线缆</span>
                </p>
                <div class="modify for-main">
                    <div v-for="(addHardDisk,index) in addHardDisk" :key="index">
                        <el-select size="mini" v-model="addHardDisk.powerValue" placeholder="请选择"
                                   @change="getModel(addHardDisk.powerValue)" disabled="disabled">
                            <el-option v-for="(item,ind) in addHardDisk.powerList" :key="item" :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                        <p class="icon">*</p>
                        <el-input size="mini" v-model="input" disabled="disabled" class="sel"></el-input>
                        <el-button class="icon-close" size="mini" type="info" icon="el-icon-close" circle
                                   disabled="disabled"
                                   @click="deleteCables(index)">
                        </el-button>
                    </div>
                    <br>
                    <!--<el-select size="mini" v-model="value" placeholder="请选择">-->
                    <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                    <!--<span class="icon"><i>&times;</i></span>-->
                    <!--<el-input size="mini" v-model="input"></el-input>-->
                    <!--<el-button size="mini" type="info"  icon="el-icon-close" circle></el-button>-->
                    <!--<br>-->
                    <el-button size="mini" icon="el-icon-plus" disabled="disabled" @click="addCables"></el-button>
                    <span class="add-cables">添加线缆</span>
                </div>
            </div>
            <!--导轨-->
            <div class="config">
                <p class="title content-label">
                    <span class="config-title">导轨</span>
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
                    <span class="add-cables">增加导轨</span>
                </div>
            </div>
            <!--面板样式-->
            <div class="config">
                <p class="title content-label">
                    <span class="config-title">面板样式</span>
                </p>
                <div class="modify for-main">
                    <el-select size="mini" v-model="panel" placeholder="请选择" @change="storagePanelStyleData(panel,1)">
                        <el-option v-for="item in panelStyleData" :key="item.id" :label="item.value" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!--基础语言-->
            <div class="config">
                <p class="title content-label">
                    <span class="config-title">基础语言</span>
                </p>
                <div class="modify for-main">
                    <el-select size="mini" v-model="language" placeholder="请选择"  @change="storageLanguageData(language,1)">
                        <el-option v-for="item in basicLanguage" :key="item.id" :label="item.description"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!--其他-->
            <div class="other">
                <div class="config">
                    <p class="title content-label">
                        <span class="config-title">其他</span>
                    </p>
                    <div class="modify for-main">
                        <el-select size="mini" v-model="value" placeholder="请选择" disabled="disabled" class="sel">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select size="mini" v-model="value" placeholder="请选择" class="other-select-two"
                                   disabled="disabled">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <p class="icon">*</p>
                        <el-select size="mini" v-model="value" placeholder="请选择" disabled="disabled" class="sel">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button class="icon-close" type="info" size="mini" icon="el-icon-close"
                                   circle></el-button>
                        <br>
                        <el-button size="mini" icon="el-icon-plus" disabled="disabled"></el-button>
                        <span class="add-cables">添加配件</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 配件
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */
    export default {
        name: "AccessoriesSelection",
        data() {
            return {
                input: '',
                options: [],
                value: '',
                // 获取电源配置基础信息
                powerData: '',
                // 线缆
                powerValue: '',
                //添加线缆
                addHardDisk: [{
                    // Power 下拉数据
                    powerList: [],
                    // 线缆
                    powerValue: '',
                }],
                // 面板下拉数据
                panelStyleData: [],
                // 获取背板id
                panelStyle: 0,
                // 面板 v-model
                panel: '[EJU4]适用于12-Bay 背板的前OEM挡板',
                // 基础语言下拉
                basicLanguage: [],
                // 基础语言v-model
                language: 1,
                // 基础语言id
                languageId:0,
                // 面板id
                localDataId:0
            }
        },

        methods: {
            /*往表里插入数据*/
            storagePanelStyleData(value, num) {
                console.log(value,num)
                if (this.localDataId) {
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${value}' ,template_id = '${localStorage.templateId}'，machine_id='${localStorage.machineId}' where id=${this.localDataId}`
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
                    (product_id,categroy_id,component_id,component_count,seq_Key,solution_id,'template_id','machine_id')VALUES(1,7,${value},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                    this.$db.run(SQL, (err, res) => {
                        console.log(SQL)
                        if (err) {
                            console.log('我是不是报错了')
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
                                    this.localDataId = res.id;
                                })
                            }
                        }
                    })
                }


            },


            /*返回上一页*/
            reload() {
                this.$router.go(-1);
            },

            /*获取v-model  判断输入是否有值  有值则可以添加*/
            getModel(value) {
                this.powerValue = value;
            },

            /*添加前置硬盘*/
            addCables() {
                for (let i = 0; i < this.addHardDisk.length; i++) {
                    if (this.addHardDisk.length < 3 && this.powerValue !== '') {
                        this.addHardDisk.splice(this.addHardDisk.length, 0, {
                            // Power 下拉数据
                            powerList: this.addHardDisk[i].powerList,
                            // 线缆
                            powerValue: '',
                        })
                        /*每次添加完，都清空一下 v-model*/
                        this.powerValue = '';
                    }
                }
            },

            /*删除线缆*/
            deleteCables(index) {
                if (this.addHardDisk.length > 1) {
                    // splice方法 删除数组从指定下标的X个元素 splice（下标，删除个数）
                    this.addHardDisk.splice(index, 1);
                } else {
                    this.$message({
                        message: '最少一个线缆',
                        type: 'warning'
                    });
                }
            },


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

            /*获取 id*/
            getDetail() {
                const SQLData = `SELECT ID FROM PRODUCT_PROGRAMME_DETAIL WHERE CATEGROY_ID = 7 AND COMPONENT_ID=10`;
                this.$db.all(SQLData, (err, res) => {
                    if (err) {
                        this.$logger(err);

                    } else {
                        for (let i = 0; i < res.length; i++) {
                            this.localDataId = res[i].id;
                        }
                    }
                })

                const SQLLanguage = `SELECT ID FROM PRODUCT_PROGRAMME_DETAIL WHERE CATEGROY_ID = 7 AND COMPONENT_ID=10`;
                this.$db.all(SQLLanguage, (err, res) => {
                    if (err) {
                        this.$logger(err);

                    } else {
                        for (let i = 0; i < res.length; i++) {
                            this.languageId = res[i].id;
                        }
                    }
                })
            },

            /*获取语言*/
            getLanguage() {
                const SQLData = `select other.id, description,description_en from component_base_info  info
                  left join component_other other on info.id=other.base_info_id
                  where other.id in (1,2)`;
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

            /*往表里插入数据*/
            storageLanguageData(value, num) {
                if (this.languageId) {
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${value}' ,template_id = '${localStorage.templateId}'，machine_id='${localStorage.machineId}' where id=${this.languageId}`
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
                    (product_id,categroy_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')VALUES(1,17,${value},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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



        },

        mounted() {
            this.getDetail();
            this.getLanguage();

        },


        beforeRouteEnter(from, to, next) {
            next(vm => {
                vm.$emit('comup', from.query.id)
                console.log(vm.$store.backplaneId);
                vm.getDataList();

                const SQLList = `SELECT ID FROM PRODUCT_PROGRAMME_DETAIL WHERE CATEGROY_ID = 7 AND COMPONENT_ID=10
AND template_id = '${localStorage.templateId}'`;
                vm.$db.all(SQLList, (err, res) => {
                    if (err) {

                    } else {
                        if (res.length ==0) {
                            vm.storagePanelStyleData(10, 1)
                        }
                    }
                })


                const SQLData = `SELECT ID FROM PRODUCT_PROGRAMME_DETAIL WHERE CATEGROY_ID = 17 AND COMPONENT_ID=1
AND template_id = '${localStorage.templateId}'`;
                vm.$db.all(SQLData, (err, res) => {
                    if (err) {

                    } else {
                        if (res.length ==0) {
                            vm.storageLanguageData(1, 1)
                        }
                    }
                })

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

    .icon-close {
        margin-left: 12px;
        font-size: 8px;
        background: #C8C8C8;
        border: none;
    }
</style>