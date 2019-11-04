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
                <div class="introduction-content">
                    <el-row :gutter="30">
                        <el-col :span="8" @click.native="jumpModule">
                            <el-card shadow="hover">
                                <span class="product-type-name">K1 Power S924</span>
                                <br>
                                <span class="product-type-synopsis" >面向任务关键型数据的适应未来需求的基础设备</span>
                                <div class="border-line"/>
                                <div class="config">
                                    <img src="../../assets/s924.png"
                                         class="image">
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
     * 选择产品
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */

    export default {
        name: "ProductSelection",
        data() {
            return {
                // 选择产品假数据
                product: [
                    {
                        name: 'K1 Power S924',
                        synopsis: '面向任务关键型数据的适应未来需求的基础设备',
                        src: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2950836865,1556261639&fm=26&gp=0.jpg'
                    }, {
                        name: 'K1 Power S924',
                        synopsis: '面向任务关键型数据的适应未来需求的基础设备',
                        src: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2950836865,1556261639&fm=26&gp=0.jpg'
                    }, {
                        name: 'K1 Power S924',
                        synopsis: '面向任务关键型数据的适应未来需求的基础设备',
                        src: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2950836865,1556261639&fm=26&gp=0.jpg'
                    }
                ],
            }
        },

        methods: {
            /*返回上一页*/
            reload() {
                this.$router.push({path:'/Projectpar',query:{}});
            },
            /*跳页选择模板*/
            jumpModule() {
                this.$router.push('/SelectTemplate');
            },
        },

        mounted() {

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
        width: 98%;
        margin: 25px auto;
        margin-top: 0px !important;

        /deep/ .el-card {
            height: 380px;
        }

        .introduction-content {
            margin-top: 0px;
            padding-top: 20px;

            .config {
                margin-top: 10px;
                /*border-top: 1px solid rgb(235, 235, 235);*/
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
            .border-line{
                margin: 15px 0 0 -20px;
                width: 108%;
                color: #d1d1d1;
                border: thin solid #d1d1d1;
                border-top: 0px;
            }

        }
    }
</style>
