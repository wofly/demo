<template>
    <div class="wrap">
        <!--方案详情定制列表-->
        <div class="intro-list">
            <p>{{ $t('details.buttons.Thisplanis')}}  {{description}}  {{ $t('details.buttons.Customizationschemefor')}}</p>
            <p>{{ $t('details.buttons.Including')}} {{len}}{{ $t('details.buttons.product')}}：</p>
            <ul class="list" v-for="item in tableData">
              <li><p>{{item.count}}{{$store.state.info_language?'':'台'}}  {{$store.state.info_language?item.product_name_en:item.product_name}}</p> - <span>{{$store.state.info_language?item.product_des_en:item.product_des}}</span></li>
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
    async getDataList() {
      // 获取数据
      const SQL = `select distinct so.customer_name,info.product_name,info.product_name_en,info.product_des,info.product_des_en,detail.product_id from product_info info
																																	 join product_programme_detail detail on info.id=detail.product_id
																																	 join solution so      on  so.id=detail.solution_id
																																	 join machine_info machine on machine.id=detail.machine_id

																																	where  so.id='${localStorage.solutionId}' and  machine.id in (select distinct machine_id from product_programme_detail detail join machine_info info on info.id=detail.machine_id and info.status=1)`;
      //  and detail.product_id='${localStorage.productId}' and detail.template_id='${localStorage.templateId}'  为什么加
      let queriesNumSQL=`select info.product_id,sum(count) count from machine_info info
where info.id in (select machine_id from product_programme_detail where solution_id='${localStorage.solutionId}')
 AND info.status=1 GROUP BY info.product_id`
    let name = ` select  customer_name from solution where id='${localStorage.solutionId}'`
        this.$db.get(name,(err,res)=>{
            if(err){
                console.log('获取失败',queriesNumSQL)
            }else{
                if(res){
                    this.description=res.customer_name
                    console.log(this.description,res.customer_name,res)
                }else{
                    this.description=''
                }

            }
        })
   let arr= await new Promise((resolve,reject)=>{
        this.$db.all(queriesNumSQL,(err,res)=>{
            if(err){
                console.log('获取失败',queriesNumSQL)
            }else{
                console.log('获取成功',res)
                return resolve(res)
            }
        })
    })
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
          if(res.length>0){
              for (let i = 0; i < res.length; i++) {
                  this.tableData = res;
                  this.len = this.tableData.length;
                  arr.forEach(item=>{
                      if(item.product_id==res[i].product_id){
                          this.$set(this.tableData[i],'count',item.count)
                      }
                  })
                  // console.log(res);
              }
          }else{
              /*当删除方案时  没有数据，显示为空*/
              this.tableData = [];
              this.len = 0;
          }
        }
      });
    },
  },
  created() {
    this.getDataList();
  },
    watch: {
        // '$store.state.solutionId': function() {
        //     console.log("此页面运行");
        //     // console.log(">>>>>>>>>>>>运行成功")
        //     // this.getDataList();
        //     this.description = '';
        //     this.tableData = [];
        //     this.getDataList();
        // },
        // '$store.state.data': function() {
        //     console.log("此页面运行");
        //     // console.log(">>>>>>>>>>>>运行成功")
        //     // this.getDataList();
        //     this.description = '';
        //     this.tableData = [];
        //     this.getDataList();
        // },

        '$store.state.data':{
            handler(){
                this.getDataList()  //注意此处就是handler
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
