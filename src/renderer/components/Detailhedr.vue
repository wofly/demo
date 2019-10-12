<template>
    <div class="wrap">
        <!--方案详情页面title-->
        <div class="intro-list">
            <ul class="list">
                <li>
                    <div><span class="introduce">{{ $t('details.abstract.customername')}}</span><span class="content">：{{showdata.customer_name}}</span></div>
                    <div><span class="introduce">{{ $t('details.abstract.projectname')}}</span><span class="content">：{{showdata.project_name}}</span></div>
                </li>
                <li>
                    <div><span class="introduce">{{ $t('details.abstract.scenarioname')}}</span><span class="content">：{{showdata.solution_name}}</span></div>
                    <div><span class="introduce">{{ $t('details.abstract.salesmanager')}}</span><span class="content">：{{showdata.sales_manager}}</span></div>
                </li>
                <li>
                    <div><span class="introduce">{{ $t('details.abstract.deliverydate')}}</span><span class="content">：{{showdata.ship_date}}</span></div>
                    <div><span class="introduce">{{ $t('details.abstract.salesbeforeManager')}}</span><span class="content">：{{showdata.pre_sales_manager}}</span></div>
                </li>
                <li>
                    <div><span class="introduce">{{ $t('details.abstract.postscript')}}</span><span class="content">：{{showdata.description}}</span></div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Detailhedr',
  data() {
    return {
      showdata: {},
      solutionId: 1,
    };
  },
  methods: {
    getdata() { // 方法渲染
      const sql = `SELECT * FROM solution where id = '${localStorage.solutionId}'`;
      this.$db.all(sql, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          // console.log(res)
          for (let i = 0; i < res.length; i++) {
            // console.log(res[i].component_count);
            this.showdata = res[i];
            // console.log(this.showdata)
          }
        }
      });
    },
    getsolutionId() {
      this.solutionId = this.$store.state.solutionId; // 获取solutionId并赋值
      console.log(">>>>>>> 获取成功")
      this.getdata(); //重新渲染
    }
  },
  created() {
    this.getdata();
    this.getsolutionId();
  },
  watch: {
      '$store.state.solutionId': 'getsolutionId'
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

    .wrap {
        width: 100%;
        padding: 20px;
    }

    .intro-list {
        width: 100%;
        padding: 8px;
        border-bottom: 1px solid #ebebeb;

        .list {
            width: 100%;
            padding: 12px;

            li {
                width: 100%;
                display: flex;
                padding: 12px;
                justify-content: space-between;

                div {
                    flex: 1;
                    width: 100%;

                    .content {
                        font-weight: bolder;
                    }
                }
              .introduce{
                display: inline-block;
                text-align: center;
                /*width: 140px;*/
              }
            }
        }
    }
</style>
