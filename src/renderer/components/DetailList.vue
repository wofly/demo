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
            <el-table-column
            prop="all_price"
            :label="$t('details.detailList.ListPrice')">
            </el-table-column>
            <el-table-column
            prop="discount"
            :label="$t('details.detailList.discount')">
            </el-table-column>
            <el-table-column
            prop="sale_untax"
            :label="$t('details.detailList.salesPriceNoTax')">
            </el-table-column>
            <el-table-column
            prop="sale_tax"
            :label="$t('details.detailList.salesPricePlusDuty')">
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
  methods: {
    /* 数据获取*/
    getDataList() {
      // 获取数据
      const SQL = `select product.product_name,pp.remark_name,pp.count,pp.list_price
      from machine_info pp  join product_info product on product.id=pp.product_id
        where product_id=1 and solution_id='${localStorage.solutionId}' `;
      console.log('localStorage.solutionId::',localStorage.solutionId);
      this.$db.all(SQL, (err, res) => {
          // console.log(res)
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
         // this.tableData = []; // 清空
          for (let i = 0; i < res.length; i++) {
            // console.log(res);
            this.tableData = res;
            // console.log(res);
            this.tableData[i].nums = i + 1;
            this.$forceUpdate();
            // console.log(res[i])
          }
          // console.log(this.tableData);
        }
      });
      this.setPrice();
    },
      getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
              if (index === 0) {
                  sums[index] = '总价';
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
                  sums[2] = ' N/A';
                  sums[5] = ' N/A';
              } else {
                  sums[index] = 'N/A';
              }
          });

          return sums;
      },
    setPrice() {
      const len = this.tableData.length;
      for (let i = 0; i < len; i++) {
        this.$store.commit('changeMachine',this.tableData[i].count) // 机器数保留到Vuex
      }
    },
    changeLanguage() {
      console.log(this.value);
      if(this.value == 1){
        // console.log("CN");
        this.lange = "CH";
        this.$i18n.locale = "CH";
      } else if(this.value == 2){
        // console.log("EN");
          this.lange = "EN";
          this.$i18n.locale = "EN";
      }
    }
  },
  created() {
    this.getDataList();
  },
    // beforeRouteEnter(from, to, next) {
    //     next(vm => {
    //         // vm.$emit('comup', from.query.id);
    //         // vm.$router.go(0);
    //         location.reload();
    //     });
    // },
  watch: {
    '$store.state.solutionId': function() {
      console.log(this.$store.state.solutionId);
      this.solutionId = this.$store.state.solutionId;
      this.tableData = [];
      this.getDataList();
    },
    '$store.state.data':{
      handler(){   //注意此处就是handler
          // console.log(this.$store.state.data);
          this.tableData=this.$store.state.data;
          let len = this.$store.state.data;
          // for (let i = 0;i<len;i++){
          //   this.tableData[i].list_price = this.tableData[i].count * 1 * this.tableData[i].list_price;
          // }
          // console.log(this.tableData)
      },
      deep:true,
      immediate: true // watch 的一个特点是，最初绑定的时候是不会执行的，要等到 serviceList 改变时才执行监听计算。加上改字段让他最初绑定的时候就执行
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
    .intro-list{
      height: auto;
    }
    .el-table{
      overflow:visible !important;
    }
    .wrap {
        padding: 20px;
    }
    element.style{
      background: #f5f5f5 !important;
    }
    .el-table--border{
      background: #f5f5f5 !important;
    }
    .el-table .el-table__header-wrapper{
      background: red;
    }
    .el-table__footer-wrapper tbody td{
      background-color: none;
    }
</style>
