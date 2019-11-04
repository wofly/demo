<template>
    <!--新建方案-->
    <div>
        <div class="g-common-table">
            <div class="g-table-top">
                <span v-if="this.$route.query.id == null" class=" g-title-text">新建方案</span>
                <span v-else class=" g-title-text">{{$t('EditScheme.title')}}</span>
                <div class="g-table-btn-group ">
                    <el-button size="small" type="primary" @click="saveData('ruleForm')">{{$t('EditScheme.save')}}</el-button>
                    <el-button size="small" type="info" plain @click="reload">{{$t('EditScheme.back')}}</el-button>
                </div>
            </div>
        </div>
        <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm new-form">
                <el-form-item :label="$t('EditScheme.abstract.customername')" prop="customerName">
                    <el-input v-model="ruleForm.customerName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('EditScheme.abstract.projectname')" prop="entryName">
                    <el-input v-model="ruleForm.entryName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('EditScheme.abstract.scenarioname')" prop="schemeName">
                    <el-input v-model="ruleForm.schemeName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('EditScheme.abstract.salesmanager')" prop="salesManager">
                    <el-input v-model="ruleForm.salesManager"></el-input>
                </el-form-item>
                <el-form-item :label="$t('EditScheme.abstract.salesbeforeManager')" prop="presalesManager">
                    <el-input v-model="ruleForm.presalesManager"></el-input>
                </el-form-item>
                <el-form-item :label="$t('EditScheme.abstract.deliverydate')" prop="data">
                    <el-date-picker v-model="ruleForm.data" type="date" placeholder="选择日期" >
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('EditScheme.abstract.postscript')" prop="desc">
                    <el-input type="textarea" maxlength="200" @input="descInput" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <span class="total">{{num}}/200</span>
            </el-form>
        </div>
    </div>
</template>

<script>
    /**
     * 添加方案
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */
    import moment from 'moment';

    export default {
        name: "ProgrammeAdd",
        data() {
            return {
                ruleForm: {
                    // 客户名称
                    customerName: '',
                    // 项目名称
                    entryName: '',
                    // 方案名称
                    schemeName: '',
                    // 销售经理
                    salesManager: '',
                    // 售前经理
                    presalesManager: '',
                    // 发货日期
                    data: '',
                    // 备注
                    desc: ''
                },
                //textarea 输入数量
                num: 0,
                solutionId: null,
                // input校验
                rules: {
                    customerName:[
                        { required: true, message: '请输入客户名称', trigger: 'blur' },
                        { max: 50, message: '长度在 50 个字符', trigger: 'blur' }
                    ],
                    entryName: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { max: 50, message: '长度在 50 个字符', trigger: 'blur' }
                    ],
                    schemeName: [
                        { required: true, message: '请输入方案名称', trigger: 'blur' },
                        { max: 50, message: '长度在 50 个字符', trigger: 'blur' }
                    ],
                    salesManager: [
                        { max: 50, message: '长度在 50 个字符', trigger: 'blur' }
                    ],
                    presalesManager: [

                        { max: 50, message: '长度在 50 个字符', trigger: 'blur' }
                    ],
                    data: { type:'date', required: true, message: '请选择日期', trigger: 'blur'},
                    desc: [
                        { max: 200, message: '长度在 200 个字符', trigger: 'blur' }
                    ]

                }
            }
        },

        methods: {
            /* textarea 显示输入字符方法 */
            descInput() {
                this.num = this.ruleForm.desc.length;
            },
            /*返回上一页*/
            reload() {
                if(this.$route.query.path=='login'){
                    this.$router.push({path:'/login',query:{}});
                }else{
                    this.$router.push({path:'/Projectpar',query:{}});
                }
            },

            /*存储数据*/
            saveData(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.ruleForm.data = moment(this.ruleForm.data).format('YYYY-MM-DD');
                        console.log(this.solutionId + "xinzeng")
                        if (this.solutionId == null || this.solutionId == undefined) {
                            const SQL = `insert into solution (customer_name,project_name,solution_name,sales_manager,pre_sales_manager,ship_date,description)
						values ('${this.ruleForm.customerName}','${this.ruleForm.entryName}','${this.ruleForm.schemeName}','${this.ruleForm.salesManager}','${this.ruleForm.presalesManager}','${this.ruleForm.data}','${this.ruleForm.desc}')`;
                            this.$db.run(SQL, (err, res) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '数据获取失败',
                                        desc: err,
                                    });
                                } else {
                                    this.$Message.warning({
                                        content: '数据添加成',
                                    });
                                    this.$router.push('/Projectpar')
                                }
                            })
                        } else {
                            console.log(this.solutionId + "修改")
                            const updateSql = `UPDATE solution set 'customer_name'='${this.ruleForm.customerName}', ` +
                                `'project_name'='${this.ruleForm.entryName}', 'solution_name'='${this.ruleForm.schemeName}', ` +
                                `'sales_manager'='${this.ruleForm.salesManager}', 'pre_sales_manager'='${this.ruleForm.presalesManager}', ` +
                                `'ship_date'='${this.ruleForm.data}', 'description'='${this.ruleForm.desc}' where id=${this.solutionId}`;
                            this.$db.run(updateSql, (err, res) => {
                                if (res) {
                                    this.$Message.warning({
                                        content: '修改失败',
                                    });
                                } else {
                                    this.$Message.warning({
                                        content: '修改成功',
                                    });
                                    this.$router.push('/Projectpar')
                                }
                            })
                        }

                    }
                    /* 每次保存点击  刷新方案列表*/
                    this.$parent.$children[1].getSolution()
                });

            },
        },
        /* 点击获取数据 */
        beforeRouteEnter(from, to, next) {
            next((vm) => {
                // vm.$route.query.id  通过id 判断 新建 修改
                if (vm.$route.query.id != null) {
                    console.log(vm.$route.query.id)
                    const selectSql = `select * from solution where id = (select max(id) from solution )`;
                    vm.$db.get(selectSql, (err, res) => {
                        if (err) {
                            vm.$logger(err);
                            vm.$Notice.error({
                                title: '系统错误',
                                desc: err,
                            });
                            return
                        } else {
                            if (res == undefined || res == null || res == '') return;
                            console.log(res)
                            vm.ruleForm.customerName = res.customer_name
                            vm.ruleForm.entryName = res.project_name
                            vm.ruleForm.schemeName = res.solution_name
                            vm.ruleForm.salesManager = res.sales_manager
                            vm.ruleForm.presalesManager = res.pre_sales_manager
                            vm.ruleForm.data = res.ship_date
                            vm.ruleForm.desc = res.description
                            vm.solutionId = res.id
                        }
                    })
                }
            })
        },
    }
</script>

<style scoped lang="scss">


    /* -------------------- 列表页title ------------------------ */
    .g-common-table {
        margin-top: 2%;
        border-top: 1px solid rgb(231, 231, 231);
        border-bottom: 1px solid rgb(231, 231, 231);
    }

    .g-title-text {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        color: #666666;
        position: relative;
        padding-left: 30px;
    }

    /*--------------------- title按钮样式 ---------------------*/
    .g-table-btn-group {
        float: right;
        padding-right: 32px;
        margin-top: 4px;
    }

    /*----------------------表单项--------------------------*/
    .new-form {
        width: 60%;
        margin: 0 auto;
        .el-date-editor.el-input{
            width: 100%;
        }
    }

    .new-form:first-child {
        margin-top: 20px;
    }

    .total {
        float: right;
    }

    /*------------修改textarea 高度--------------*/
    .el-form-item {
        /deep/ .el-form-item__content {

            .el-textarea__inner {
                height: 200px;
                resize: none;
            }

            .el-switch__core {
                margin-right: 30px;
            }
        }
    }
</style>
