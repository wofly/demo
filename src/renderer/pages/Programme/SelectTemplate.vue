<template>
    <div>
        <div class="g-common-table">
            <div class="g-table-top">
                <span class=" g-title-text">选择模板</span>
                <div class="g-table-btn-group ">
                    <el-button size="small" type="primary" @click="reload">返 回</el-button>
                </div>
            </div>
        </div>
        <div class="product-introduction">
            <span class="title">初始配置</span>
            <div class="introduction-content">
                <el-row :gutter="30">
                    <el-col :span="8" class="config" >
                        <el-card shadow="hover" @click.native="jumpModule(0)">
                            <span class="model">{{templateName}}</span>
                            <div class="config">
                                <p>{{templateDesc}}</p>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="product-introduction">
            <span class="title">推荐配置</span>
            <div class="introduction-content">
                <el-row :gutter="30">
                    <el-col :span="8" class="config" v-for="(item,index) in templateData" :key="index">
                        <el-card shadow="hover" @click.native="jumpModule(index+1)">
                            <span class="model">{{item.templateName}}</span>
                            <div class="config">
                                <p>{{item.templateDesc}}</p>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 选择模板
     *
     * @date 2019/08/30
     * @author yuwenqiang
     */
    export default {
        name: "SelectTemplate",
        data() {
            return {
                /*获取推荐配置模板数据*/
                templateData:[],
                /*获取初始配置模板数据*/
                templateName:'',
                templateDesc:''
            }

        },

        methods: {
            /*返回上一页*/
            reload() {
                this.$router.push({path: '/ProductSelection', query: {}});
            },
            /*跳页模板配置*/
            jumpModule(value) {
                /*向 machine_info表中插入 数据*/
                    const SQL = `INSERT into machine_info(product_id,solution_id,templete_id,remark_name,status)
                values('1','${localStorage.solutionId}','${value}',
                '机器${localStorage.machineId}','0')`;
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        } else {
                            /* 查找 以创建的 machineId  添加到localStorage 中*/
                            const SQL = `select id from machine_info where product_id=1 and solution_id='${localStorage.solutionId}' and templete_id='${value}' and  remark_name='机器${localStorage.machineId}' and status=0`;
                            console.log(SQL)
                            this.$db.all(SQL, (err, res) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '数据获取失败',
                                        desc: err,
                                    });
                                } else {
                                    /* 查找 以创建的 machineId  添加到localStorage 中*/
                                    let machineId = res[res.length - 1].id;
                                    localStorage.setItem('machineId', machineId);
                                    console.log(localStorage.machineId)
                                    /* 查询 product_programme_detail 表中数据*/
                                    const SQLdata = `SELECT * FROM product_programme_detail  WHERE product_id = 1
                                    AND solution_id ='${localStorage.solutionId}' AND template_id = '${value}' AND machine_id = '${localStorage.machineId}' `;
                                    console.log(SQLdata)
                                    this.$db.all(SQLdata, (err, res) => {
                                        if (err) {
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: '数据获取失败',
                                                desc: err,
                                            });
                                        } else {
                                            if (res.length == 0) {
                                                /* 往列表 硬件 和软件 列表清单里插入数据*/
                                                const SQL = `INSERT INTO product_programme_detail(component_id,product_id,categroy_id,component_id,component_count,template_id,solution_id,machine_id)
 SELECT product_templete.component_id,product_templete.product_id,product_templete.categroy_id,product_templete.component_id,product_templete.component_count,product_templete.template_id,'${localStorage.solutionId}','${localStorage.machineId}'  from product_templete where template_id='${value}'`;
                                                console.log(SQL);
                                                this.$db.all(SQL, (err, res) => {
                                                    if (err) {
                                                        this.$logger(err);
                                                        this.$Notice.error({
                                                            title: '数据获取失败',
                                                            desc: err,
                                                        });
                                                    }
                                                })
                                                this.getbarebone();
                                            }
                                            /* templateId 添加到localStorage 中*/
                                            let templateId = value;
                                            localStorage.setItem('templateId', templateId);
                                            /* productId 添加到localStorage 中*/
                                            let productId = 1;
                                            localStorage.setItem('productId', productId);
                                            this.$router.push({path: '/Hardware/Processor', query: {id: 0,sign:3,signT:11}});
                                        }
                                    })
                                }
                            })
                        }
                    })
            },


            /*获取 barebone id*/
            getbarebone() {
                const SQL = `SELECT  * FROM product_programme_detail WHERE product_id = 1 AND categroy_id = 16 AND solution_id = '${localStorage.solutionId}' AND template_id ='${localStorage.templateId}' AND machine_id ='${localStorage.machineId}'`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    } else {
                        if (res.length == 0) {
                            const SQLData = `INSERT INTO product_programme_detail('product_id','categroy_id','component_id','component_count',solution_id,template_id,machine_id) VALUES('1','16','1','1','1','${localStorage.templateId}','${localStorage.machineId}'),('1','16','2','1','1','${localStorage.templateId}','${localStorage.machineId}'),('1','16','3','1','1','${localStorage.templateId}','${localStorage.machineId}'),('1','16','4','1','1','${localStorage.templateId}','${localStorage.machineId}'),('1','16','5','1','1','${localStorage.templateId}','${localStorage.machineId}'),('1','16','6','1','1','${localStorage.templateId}','${localStorage.machineId}')`;
                            this.$db.run(SQLData, (err, res) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '数据获取失败',
                                        desc: err,
                                    });
                                } else {
                                    // console.log(res)
                                }
                            })
                        }
                    }
                })
            }
        },
        /*获取数据*/
        created() {

            const SQL = `select distinct template_name,template_desc from product_templete where template_id in(0,1,2)`;
            this.$db.all(SQL, (err, res) => {
                if (err) {

                } else {

                    for(let i =0; i<res.length; i++){
                        let obj = {}
                        obj.templateName = res[i].template_name;
                        obj.templateDesc = res[i].template_desc;
                        this.templateData.push(obj)
                        if(i == 1){
                            return false;
                        }
                        this.templateName = res[2].template_name;
                        this.templateDesc = res[2].template_desc;

                    }
                    console.log(this.templateData)
                }
            })
        }
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
        font-size: 16px;
        font-weight: 700;
        padding-left: 30px;
    }

    /*--------------------- title按钮样式 ---------------------*/
    .g-table-btn-group {
        float: right;
        padding-right: 32px;
        margin-top: 4px;
    }

    /*------------------------初始配置样式------------------------------*/
    .product-introduction {
        width: 95%;
        margin: 16px auto;
        margin-bottom: 60px;

        /deep/ .el-card {
            height: 183px;
        }

        .introduction-content {
            margin-top: 16px;
            padding-top: 20px;
            border-top: 1px solid rgb(235, 235, 235);

            .config {
                margin-top: 8px;
                /*border-top: 1px solid rgb(235, 235, 235);*/
                padding-top: 12px;
            }

            .config p {
                margin-top: 5px;
            }

            .model {
                padding-left: 5px;
                border-left: 5px solid rgb(62, 149, 252);
                font-weight: 600;
                font-size: 15px;
                color: rgb(6, 70, 138);
            }
        }

        .title {
            font-size: 14px;

        }

        .config {
            margin-bottom: 20px;
        }
    }
</style>
