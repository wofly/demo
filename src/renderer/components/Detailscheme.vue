<template>
    <div class="wrap">
        <!--方案详情定制列表-->
        <div class="intro-list">
            <p>{{description}}</p>
            <p>其中共包含 {{len}} 款产品：</p>
            <ul class="list" v-for="item in tableData">
              <li><p>{{item.product_name}}</p> - <span>{{item.product_des}}</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Detailscheme',
  data() {
    return {
      // 详情table数据
      tableData: [],
      len: 0,
      description:''
    };
  },
  // mounted() {
  //   /* 数据获取*/
  //   this.getDataList();
  // },
  methods: {
    /* 数据获取*/
    getDataList() {
      // 获取数据
      const SQL = `select distinct so.description,info.product_name,info.product_des from product_info info
																																	left join product_programme_detail detail on info.id=detail.product_id
																																	left join solution so      on  so.id=detail.solution_id
																																	where info.id='${localStorage.productId}' and so.id='${localStorage.solutionId}'
																																	`;
      this.$db.all(SQL, (err, res) => {
        if (err) {
          this.$logger(err);
          this.$Notice.error({
            title: '搜索失败',
            desc: err,
          });
        } else {
          // console.log(res);
          if(res.length == 0) {
              this.len = 0;
          }
          for (let i = 0; i < res.length; i++) {
            this.tableData = res;
            this.len = this.tableData.length;
            this.description=res[0].description
            // console.log(res);
          }
        }
      });
    },
  },
  created() {
    this.getDataList();
  },
    watch: {
        '$store.state.solutionId': function() {
            console.log("此页面运行");
            // console.log(">>>>>>>>>>>>运行成功")
            // this.getDataList();
            this.description = '';
            this.tableData = [];
            this.getDataList();
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
                display: flex;
              p{
                margin-right: 12px;
              }
                span{
                  padding-left: 12px;
                }
            }
        }
    }
</style>
