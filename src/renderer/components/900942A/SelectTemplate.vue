<template>
    <!--选择模板-->
    <div>
        <div class="g-common-table">
            <div class="g-table-top">
                <span class=" g-title-text">{{$t('ChooseTemplate.title')}}</span>
                <div class="g-table-btn-group ">
                    <el-button size="small" type="primary" @click="reload">{{$t('ChooseTemplate.button')}}</el-button>
                </div>
            </div>
        </div>
        <div v-if="this.$route.query.id ==1">
            <div class="product-introduction">
                <span class="title">{{$t('ChooseTemplate.lists.InitialConfiguration')}}</span>
                <div class="introduction-content">
                    <el-row :gutter="30">
                        <el-col :span="8" class="config" v-for="(item,index) in templateDataList" :key="index">
                            <el-card shadow="hover" @click.native="jumpModule(item.id)">
                                <span class="model">{{$store.state.info_language?item.templateNameY:item.templateName}}</span>
                                <div class="config">
                                    <p v-html="$store.state.info_language?item.templateDescY:item.templateDesc"></p>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>

                </div>
            </div>
            <div class="product-introduction">
                <span class="title">{{$t('ChooseTemplate.lists.RecommendedConfiguration')}}</span>
                <div class="introduction-content">
                    <el-row :gutter="30">
                        <el-col :span="8" class="config" v-for="(item,index) in templateData" :key="index">
                            <el-card shadow="hover" @click.native="jumpModule(item.id)">
                                <span class="model">{{$store.state.info_language?item.templateNameY:item.templateName}}</span>
                                <div class="config">
                                    <p v-html="$store.state.info_language?item.templateDescY:item.templateDesc"></p>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div v-if="this.$route.query.id ==2">
            <div class="product-introduction">
                <span class="title">{{$t('ChooseTemplate.lists.InitialConfiguration')}}</span>
                <div class="introduction-content">
                    <el-row :gutter="30">
                        <el-col :span="8" class="config" v-for="(item,index) in templateMrList" :key="index">
                            <el-card shadow="hover" @click.native="jumpModule(item.id)">
                                <span class="model">{{$store.state.info_language?item.templateNameY:item.templateName}}</span>
                                <div class="config">
                                    <p v-html="$store.state.info_language?item.templateDescY:item.templateDesc"></p>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <span class="title">{{$t('ChooseTemplate.lists.RecommendedConfiguration')}}</span>
                <div class="introduction-content">
                    <el-row :gutter="30">
                        <el-col :span="8" class="config" v-for="(item,index) in templateMr" :key="index">
                            <el-card shadow="hover" @click.native="jumpModule(item.id)">
                                <span class="model">{{$store.state.info_language?item.templateNameY:item.templateName}}</span>
                                <div class="config">
                                    <p v-html="$store.state.info_language?item.templateDescY:item.templateDesc"></p>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
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
                /*获取924模板数据*/
                templateData:[],
                templateDataList:[],
                /*获取950模板数据*/
                templateMr:[],
                templateMrList:[],
            }

        },

        methods: {
            /*返回上一页*/
            reload() {
                this.$router.push({path: '/ProductSelection', query: {}});
            },
            /*跳页模板配置*/
            jumpModule(value) {
                console.log(value)
                /*向 machine_info表中插入 数据*/
                const SQL = `INSERT into machine_info(product_id,solution_id,templete_id,status,count)
                values('${localStorage.productId}','${localStorage.solutionId}','${value}','0',1)`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    } else {

                        /* 查找 以创建的 machineId  添加到localStorage 中*/
                        const SQL = `select id from machine_info where product_id='${localStorage.productId}' and solution_id='${localStorage.solutionId}' and templete_id='${value}' and status=0`;
                        console.log(SQL)
                        this.$db.all(SQL, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '数据获取失败',
                                    desc: err,
                                });
                            } else {
                                console.log(res[res.length - 1].id)
                                console.log(res)
                                const updateSql = `update machine_info set  remark_name='机器${res[res.length - 1].id}' where id = '${res[res.length - 1].id}'`
                                this.$db.run(updateSql, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                    }
                                })

                                /* 查找 以创建的 machineId  添加到localStorage 中*/
                                let machineId = res[res.length - 1].id;
                                localStorage.setItem('machineId', machineId);
                                localStorage.setItem('externalCapacityCard', 0);
                                localStorage.setItem('internalCapacity', 0);
                                localStorage.setItem('externalCapacity', 0);
                                console.log(localStorage.machineId)
                                /* 查询 product_programme_detail 表中数据*/
                                const SQLdata = `SELECT * FROM product_programme_detail  WHERE product_id = '${localStorage.productId}'  AND solution_id ='${localStorage.solutionId}' AND template_id = '${value}' AND machine_id = '${localStorage.machineId}' and is_expansion=1`;
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
                                            const SQL = ` INSERT INTO product_programme_detail(component_id,product_id,category_id,component_id,component_count,template_id,	solution_id,machine_id,is_expansion)
 select detail.component_id,detail.product_id,detail.category_id,detail.component_id,detail.component_count,detail.		 template_id,'${localStorage.solutionId}','${localStorage.machineId}','1'
			from  product_templete pt
	    join product_templete_detail detail on detail.template_id=pt.id
			where template_id='${value}' and is_expansion=1
 `;
                                            console.log(SQL)
                                            this.$db.all(SQL, (err, res) => {
                                                if (err) {
                                                    this.$logger(err);
                                                    this.$Notice.error({
                                                        title: '数据获取失败',
                                                        desc: err,
                                                    });
                                                }
                                                console.log(SQL,res);
                                            })
                                            // this.getbarebone();
                                        }
                                        /* templateId 添加到localStorage 中*/
                                        let templateId = value;
                                        localStorage.setItem('templateId', templateId);

                                        if(localStorage.productId==1){
                                            this.$router.push({path: '/Hardware/Processor', query: {id: 0,sign:3,signT:11}});
                                        }
                                        if(localStorage.productId==2){
                                            this.$router.push({path: '/Hardware950/Processor', query: {id: 0,sign:3,signT:11}});
                                        }

                                    }
                                })
                            }
                        })
                    }
                })
            },


            /*获取 barebone id*/
            getbarebone() {
                const SQL = `SELECT  * FROM product_programme_detail WHERE product_id = '${localStorage.productId}' AND category_id = 16 AND solution_id = '${localStorage.solutionId}' AND template_id ='${localStorage.templateId}' AND machine_id ='${localStorage.machineId}'and is_expansion=1`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    } else {
                        if (res.length == 0) {
                            const SQLData = `INSERT INTO product_programme_detail('product_id','category_id','component_id','component_count',solution_id,template_id,machine_id) VALUES
         ('${localStorage.productId}','16','1','1','1','${localStorage.templateId}','${localStorage.machineId}'),
         ('${localStorage.productId}','16','2','1','1','${localStorage.templateId}','${localStorage.machineId}'),
         ('${localStorage.productId}','16','3','1','1','${localStorage.templateId}','${localStorage.machineId}'),
         ('${localStorage.productId}','16','4','1','1','${localStorage.templateId}','${localStorage.machineId}'),
         ('${localStorage.productId}','16','5','1','1','${localStorage.templateId}','${localStorage.machineId}'),
         ('${localStorage.productId}','16','6','1','1','${localStorage.templateId}','${localStorage.machineId}')`;
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
                /*获取924 模板数据*/
            const SQL = `select pt.id, pt.template_name_ch template_name, pt.template_name_en template_name_en,pt.template_desc_ch template_desc,pt.template_desc_en template_desc_en,pt.template_type from  product_templete pt join product_info info on info.id=pt.product_id  where info.machine_model='9009' and info.machine_submodel='42A'`;
            console.log(SQL)
            this.$db.all(SQL, (err, res) => {
                if (err) {
                    console.log('获取失败')
                } else {
                    console.log(res)
                    for(let i =0; i<res.length; i++){
                        console.log('模板：：：：：',res)

                        if(res[i].template_type == 1 ||res[i].template_type == 2){
                            let obj = {}
                            //// 描述
                            let td = res[i].template_desc
                            let tdY = res[i].template_desc_en
                            obj.id = res[i].id;
                            // 标题
                            obj.templateName = res[i].template_name;
                            obj.templateNameY = res[i].template_name_en;
                            obj.templateDesc = td.replace(/\|/g, '<br/>');
                            obj.templateDescY = tdY.replace(/\|/g, '<br/>');
                            this.templateData.push(obj)
                        }

                        if(res[i].template_type == 0){
                            let obj = {}
                            //// 描述
                            let td = res[i].template_desc
                            let tdY = res[i].template_desc_en
                            obj.id = res[i].id;
                            // 标题
                            obj.templateName = res[i].template_name;
                            obj.templateNameY = res[i].template_name_en;
                            obj.templateDesc = td.replace(/\|/g, '<br/>');
                            obj.templateDescY = tdY.replace(/\|/g, '<br/>');
                            this.templateDataList.push(obj)
                        }

                    }
                }
            })

            /*获取950 模板数据*/
            const SQLmr = `select pt.id, pt.template_name_ch template_name, pt.template_name_en template_name_en,pt.template_desc_ch template_desc,pt.template_desc_en template_desc_en,pt.template_type from  product_templete pt join product_info info on info.id=pt.product_id  where info.machine_model='9040' and info.machine_submodel='MR9'`;
            console.log(SQLmr)
            this.$db.all(SQLmr, (err, resA) => {
                if (err) {
                    console.log('获取失败')
                } else {
                    console.log(resA)
                    for(let i =0; i<resA.length; i++){

                        if(resA[i].template_type == 0){
                            let obj = {}
                            // 描述
                            let td = resA[i].template_desc
                            let tdY = resA[i].template_desc_en
                            obj.id = resA[i].id;
                            // 标题
                            obj.templateName = resA[i].template_name;
                            obj.templateNameY = resA[i].template_name_en;
                            obj.templateDesc = td.replace(/\|/g, '<br/>');
                            obj.templateDescY = tdY.replace(/\|/g, '<br/>');
                            this.templateMrList.push(obj)
                            console.log(this.templateMrList)
                        }

                        if(resA[i].template_type == 1 ||resA[i].template_type == 2){
                            let obj = {}
                            // 描述
                            let td = resA[i].template_desc
                            let tdY = resA[i].template_desc_en
                            obj.id = resA[i].id;
                            // 标题
                            obj.templateName = resA[i].template_name;
                            obj.templateNameY = resA[i].template_name_en;
                            obj.templateDesc = td.replace(/\|/g, '<br/>');
                            obj.templateDescY = tdY.replace(/\|/g, '<br/>');
                            this.templateMr.push(obj)
                            console.log(this.templateMr)
                        }
                    }
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
