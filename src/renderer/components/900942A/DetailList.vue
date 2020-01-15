<template>
    <div class="wrap">
        <!--方案详情table-->
        <div class="intro-list">
            <el-table
                    :data="tableData"
                    border
                    :summary-method="getSummaries"
                    show-summary
                    style="width: 100%; margin-top: 20px;">
                <el-table-column
                        type="index"
                        :label="$t('details.detailList.serialNumber')"
                        width="120px">
                </el-table-column>
                <el-table-column
                        prop="product_name"
                        :label="$t('details.detailList.productName')">
                </el-table-column>
                <el-table-column
                        prop="remark_name"
                        :label="$t('details.detailList.remarks')">
                </el-table-column>
                <el-table-column
                        prop="count"
                        :label="$t('details.detailList.quantity')">
                </el-table-column>
                <!--美元列表价-->
                <el-table-column prop="all_priceMe" :label="$t('details.detailList.ListPrice')"
                                 v-if="$store.state.currency_type">
                    <template slot-scope="scope">
                        <span v-show="$store.state.userId !=1">{{scope.row.all_priceMe | allPriceMeFilters}}</span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </template>
                </el-table-column>
                <!--折扣价:美元-->
                <el-table-column prop="discountMe" :label="$t('details.detailList.discount')"
                                 v-if="$store.state.currency_type">
                    <template slot-scope="scope">
                        <span v-show="$store.state.userId !=1">{{scope.row.discountMe | discountFilters}}</span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </template>
                </el-table-column>

                <el-table-column prop="sale_untaxMe" :label="$t('details.detailList.salesPriceNoTax')"
                                 v-if="$store.state.currency_type">
                    <template slot-scope="scope">
                        <span v-show="$store.state.userId !=1">  {{scope.row.sale_untaxMe | allPriceMeFilters}}</span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </template>
                </el-table-column>
                <!--列表价：人民币-->
                <el-table-column prop="all_price" :label="$t('details.detailList.ListPriceRen')"
                                 v-if="!$store.state.currency_type">
                    <template slot-scope="scope">
                        <span v-show="$store.state.userId !=1">{{scope.row.all_price | allPriceMeFilters}}</span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </template>
                </el-table-column>
                <!--折扣价格：人民币-->
                <el-table-column prop="discount" :label="$t('details.detailList.discount')"
                                 v-if="!$store.state.currency_type">
                    <template slot-scope="scope">
                        <span v-show="$store.state.userId !=1">{{scope.row.discount | discountFilters}}</span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </template>
                </el-table-column>

                <el-table-column prop="sale_untax" :label="$t('details.detailList.salesPriceNoTax')"
                                 v-if="!$store.state.currency_type">
                    <template slot-scope="scope">
                        <span v-show="$store.state.userId !=1">{{scope.row.sale_untax | allPriceMeFilters}}</span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </template>
                </el-table-column>

                <el-table-column prop="sale_tax" :label="$t('details.detailList.salesPricePlusDuty')"
                                 v-if="!$store.state.currency_type">
                    <template slot-scope="scope">
                        <span v-show="$store.state.userId !=1">{{scope.row.sale_tax | allPriceMeFilters}}</span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </template>
                </el-table-column>

                <el-table-column prop="sale_taxMe" :label="$t('details.detailList.salesPricePlusDuty')"
                                 v-if="$store.state.currency_type">
                    <template slot-scope="scope">
                        <span v-show="$store.state.userId !=1"> {{scope.row.sale_taxMe | allPriceMeFilters}}</span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--<el-select v-model="value" placeholder="请选择" @change="changeLanguage">-->
        <!--<el-option-->
        <!--v-for="item in options"-->
        <!--:key="item.value"-->
        <!--::label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--<span>测试{{ $t('index.one')}}</span>-->
    </div>
</template>

<script>
    export default {
        name: 'DetailList',
        data() {
            return {
                // 用户id
                userId: 0,
                // 详情table数据
                tableData: [],
                solutionId: 1,
                options: [{
                    value: '1',
                    label: '黄金糕'
                }, {
                    value: '2',
                    label: '双皮奶'
                }],
                value: '',
                lange: 'CN',
            };
        },
        // beforeRouteEnter(to,from,next){
        //   next(vm=>{
        //       vm.tableData=vm.$store.state.data
        //       console.log( vm.tableData,vm.$store.state.data)
        //   })
        // },
        filters: {
            // 人民币列表价过滤器：加￥符号、保留两位小数四舍五入、使用分位分隔符
            allPriceFilters: function (value) {
                if (value) return value.toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
            },
            // 美元列表价
            allPriceMeFilters: function (value) {
                console.log(value)
                if (value) {
                    return value.toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                } else {
                    return (0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                }
            },
            // 美元折扣价
            discountMeFilters: function (value) {
                // return  value == 0 ? 0 : value.toFixed(2)
                if (value == 0) {
                    return '0.00'
                } else {
                    if (value) {
                        return value.toFixed(2)
                    }

                }
            },
            // 人民币折扣价
            discountFilters: function (value) {
                console.log(value, 111)
                if (value == 0 || value == 100 || isNaN(value)) {
                    return '0.00'
                } else {
                    if (value) {
                        return value.toFixed(2)
                    }
                }
            }
        },
        methods: {
            /* 数据获取*/
            getDataList() {
                // 获取数据
                const SQL = `select product.product_name,pp.remark_name,pp.count,pp.list_price
                    from machine_info pp  join product_info product on product.id=pp.product_id
                    where product_id=${localStorage.productId} and solution_id='${localStorage.solutionId}' `;
                console.log('localStorage.solutionId::', localStorage.solutionId);
                this.$db.all(SQL, (err, res) => {
                    // console.log(res)
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        if (res.length > 0) {
                            // this.tableData = []; // 清空
                            for (let i = 0; i < res.length; i++) {
                                // console.log(res);
                                this.tableData = res;
                                // console.log(res);
                                this.tableData[i].nums = i + 1;
                                this.$forceUpdate();
                                // console.log(res[i])
                            }
                            console.log(this.tableData, res);
                        } else {
                            /*当删除方案时  没有数据，显示为空*/
                            this.tableData = [];
                        }

                    }
                });
                this.setPrice();
            },
            getSummaries(param) {

                console.log(param)
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        if (this.$store.state.language) {
                            sums[index] = 'Total price';
                        } else {
                            sums[index] = '总价';
                        }

                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[2] = '';
                    } else {
                        sums[index] = '';
                    }
                });
                if (this.$store.state.userId != 1) {
                    if (this.$store.state.currency_type) {
                        sums[5] = (100 - sums[6] / sums[4] * 100).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                    } else {
                        sums[5] = (sums[6] / sums[4] * 100).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                    }
                    if (sums[5] == 100 || isNaN(sums[5])) {
                        sums[5] = (0).toFixed(2)
                    }
                    sums[4] = (Math.round(sums[4] * 100) / 100).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                    sums[6] = (Math.round(sums[6] * 100) / 100).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                    sums[7] = (Math.round(sums[7] * 100) / 100).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                } else {
                    sums[5] = '- -';
                    sums[4] = '- -';
                    sums[6] = '- -';
                    sums[7] = '- -'
                }
                return sums;
            },
            setPrice() {
                const len = this.tableData.length;
                for (let i = 0; i < len; i++) {
                    this.$store.commit('changeMachine', this.tableData[i].count) // 机器数保留到Vuex
                }
            },
            changeLanguage() {
                console.log(this.value);
                if (this.value == 1) {
                    // console.log("CN");
                    this.lange = "CH";
                    this.$i18n.locale = "CH";
                } else if (this.value == 2) {
                    // console.log("EN");
                    this.lange = "EN";
                    this.$i18n.locale = "EN";
                }
            }
        },
        created() {
            if (localStorage.productId == undefined || localStorage.productId == '') localStorage.setItem('productId',0);
            this.getDataList();
            this.userId = localStorage.userId;
            console.log('this.userId', this.userId)
        },
        // beforeRouteEnter(from, to, next) {
        //     next(vm => {
        //         // vm.$emit('comup', from.query.id);
        //         // vm.$router.go(0);
        //         location.reload();
        //     });
        // },
        watch: {
            // '$store.state.solutionId': function() {
            //   console.log(this.$store.state.solutionId);
            //   this.solutionId = this.$store.state.solutionId;
            //   this.tableData = [];
            //   this.getDataList();
            // },
            '$store.state.data': {
                handler() {   //注意此处就是handler
                    // console.log(this.$store.state.data);
                    this.tableData = this.$store.state.data;
                    let len = this.$store.state.data;
                    // for (let i = 0;i<len;i++){
                    //   this.tableData[i].list_price = this.tableData[i].count * 1 * this.tableData[i].list_price;
                    // }
                    // console.log(this.tableData)
                },
                deep: true,
                immediate: true // watch 的一个特点是，最初绑定的时候是不会执行的，要等到 serviceList 改变时才执行监听计算。加上改字段让他最初绑定的时候就执行
            },
        },
    };
</script>

<style scoped lang="scss">
    * {
        padding: 0;
        margin: 0;
        list-style: none;
        box-sizing: border-box;
    }

    .intro-list {
        height: auto;
    }

    .el-table {
        overflow: visible !important;
    }

    .wrap {
        padding: 20px;
    }

    element.style {
        background: #f5f5f5 !important;
    }

    .el-table--border {
        background: #f5f5f5 !important;
    }

    .el-table .el-table__header-wrapper {
        background: red;
    }

    .el-table__footer-wrapper tbody td {
        background-color: none;
    }
</style>
