<template>
    <div>
        <div class="g-common-table">
            <div class="g-table-top">
                <span class=" g-title-text">{{$t('productSelect.title')}}</span>
                <div class="g-table-btn-group ">
                    <el-button size="small" type="primary" @click="reload">{{$t('productSelect.button')}}</el-button>
                </div>
            </div>
        </div>
        <div class="demo-image__placeholder">
            <div class="product-introduction">
                <span class="title">{{$t('productSelect.transverse')}}</span>
                <div class="introduction-content">
                    <el-row :gutter="30" v-if="product[0] != undefined">
                        <el-col :span="8" @click.native="jumpModule(product[0].id)" >
                            <el-card shadow="hover">
                                <span class="product-type-name">{{product[0].product_name}}</span>
                                <br>
                                <span class="product-type-synopsis" >
                                    {{$store.state.info_language?product[0].product_des_en:product[0].product_des}}
                                    <!--{{product[0].product_des}}-->
                                </span>
                                <div class="config">
                                    <img src="../../../../static/s924.png"
                                         class="image">
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="product-introduction">
                <span class="title">{{$t('productSelect.portrait')}}</span>
                <div class="introduction-content">
                    <el-row :gutter="30" v-if="productMr[0] != undefined">
                        <el-col :span="8" @click.native="jumpModule(productMr[0].id)" >
                            <el-card shadow="hover">
                                <span class="product-type-name">{{productMr[0].product_name}}</span>
                                <br>
                                <span class="product-type-synopsis" >
                                    {{$store.state.info_language?productMr[0].product_des_en:productMr[0].product_des}}
                                    <!--{{productMr[0].product_des}}-->
                                </span>
                                <div class="config">
                                    <img src="../../../../static/E950.png"
                                         class="image">
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </div>
           <!-- <div class="product-introduction">
                <span class="title">配件</span>
                <div class="introduction-content">

                </div>
            </div>-->
        </div>
    </div>
</template>

<script>
    /**
     * 选择产品
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */

    export default {
        name: "ProductSelection",
        data() {
            return {
                // 选择924产品数据
                product: [],
                // 选择950产品数据
                productMr:[],
            }
        },

        methods: {
            /*返回上一页*/
            reload() {
                this.$router.push({path:'/Projectpar',query:{}});
            },
            /*跳页选择模板*/
            jumpModule(id) {
                console.log(id);
                /*将 productId 添加到  localStorage*/
                let productId = id;
                localStorage.setItem('productId',productId)
                /*跳转 选择 模块页面*/
                this.$router.push({path:'/SelectTemplate',query:{id:productId}});
            },
        },

        created() {
            /*获取 924产品数据*/
            const SQL = `select id,product_name,product_des,product_des_en,picture_url from product_info where machine_model='9009' and machine_submodel='42A'`;
            this.$db.all(SQL, (err, res) => {
                if (err) {
                    console.log('获取失败')
                } else {
                    /*获取 产品数据*/
                    this.product = res;
                }
            })

            /*获取 950产品数据*/
            const SQL950 = `select id,product_name,product_des,product_des_en,picture_url from product_info where machine_model='9040' and machine_submodel='MR9'`;
            this.$db.all(SQL950, (err, res) => {
                if (err) {
                    console.log('获取失败')
                } else {
                    /*获取 产品数据*/
                    console.log('res........',res)
                    this.productMr = res;

                }
            })


        }
    }
</script>

<style scoped lang="scss">


    /* -------------------- 列表页title ------------------------ */
    .g-title-text {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        color: #666666;
        font-size: 16px;
        font-weight: 700;
        position: relative;
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
            height: 380px;
        }

        .introduction-content {
            margin-top: 16px;
            padding-top: 20px;
            border-top: 1px solid #ebebeb;
            .config {
                margin-top: 10px;
                border-top: 1px solid rgb(235, 235, 235);
                padding-top: 12px;
            }

            .config p {
                margin-top: 5px;
            }

            .model {
                font-weight: 600;
                font-size: 15px;
                color: rgb(6, 70, 138);
            }

            .product-type-name {
                font-weight: 600;
                color: cornflowerblue;
            }

            .product-type-synopsis {
                font-weight: 500;
            }

            .image {
                display: block;
                width: 82%;
            }
            .title {
                font-size: 14px;

            }

        }
    }
</style>
