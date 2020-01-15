<template>
    <!--应用程序-->
    <div class="wrap">
        <div class="font-style"><p>{{$t('Application.lists.SelectApplication.title')}}</p></div>
        <ul class="main-list" v-for='(item,index) in optionsDate' :key="index">
            <li style="height: 70px;">
                <div class="checksele">
                    <el-checkbox style="width:50px;margin-top: 10px"
                         :label="$store.state.info_language?item.name:item.nameCN"
                         v-model="item.checked"
                        @change="selectNameAdd(index,0);item.amountinp=!item.amountinp">

                    </el-checkbox>
                </div>
                <div class="showSele sel" v-show="item.amountinp">
                    <span style="margin-left: 400px">*</span>

                    <el-input class="el-mount"  size="mini" v-model="input" disabled="disabled"></el-input>

                    <span style="margin-left: 50px;width: 80px;display: inline-block; vertical-align: middle ">{{$t('Application.lists.SelectApplication.content1')}}：</span>
                     <el-select  class="select-year" placeholder="请选择" v-model="item.value2" size="mini" @change="selectNameAdd(index,item.value2) ">
                        <el-option
                                v-for="(ite,int) in item.yearsDate"
                                :key="int"
                                :label="ite.year"
                                :value="int">
                        </el-option>
                    </el-select>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'programList',
  data() {
    return {
        optionsDate:[],
        yearsDate: [],
        fatherId: 0,
        childId: 0,
        input:'10'
    };
  },
  methods: {
   async getDetailDatas() {
       /*获取数据库更新*/
      const SQL_UP = `select detail.*,cs.id soft_id,cs.years,cs.software_FC from product_programme_detail detail ,component_software cs
        where solution_id='${localStorage.solutionId}'
        and template_id='${localStorage.templateId}'
        and product_id='${localStorage.productId}'
        and machine_id='${localStorage.machineId}'
        and detail.category_id=15
        and cs.category_id=detail.category_id
        and cs.id=detail.component_id
        UNION
        select temptable.*,temptable.id soft_id,component_software.years,component_software.software_FC from component_software,(select * from product_programme_detail where component_id in(select tn.id from (select * from component_software where id in (
        select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id in(select detail.component_id from product_programme_detail detail ,component_software cs
        where solution_id= ${localStorage.solutionId}
        and template_id=${localStorage.templateId}
        and product_id='${localStorage.productId}'
        and machine_id='${localStorage.machineId}'
        and detail.category_id=15
        and cs.category_id=detail.category_id
        and cs.id=detail.component_id)
        )and software_type=3) tn) and  category_id=20) temptable
        where temptable.component_id=component_software.id`
       /*原始数据获取*/
       const SQL_FIRST = `select distinct cs.id, software_des,software_desCN,years from component_software cs left join software_software ss on cs.id=ss.choice_software_id where cs.id in (134,135)`;

       await new Promise((resolve,reject)=>{
           this.$db.all(SQL_FIRST, (err, res) => {
               if(res.length>0){
                   resolve([res,err])
               }
           })
       }).then(([res,err])=>{
           if (err) {
               this.$logger(err);
               this.$Notice.error({
                   title: '数据获取失败',
                   desc: err
               });
           } else {
               console.log('res:::11111',res);
               res.forEach((item,i)=>{
                   this.getSWWA(item.id,res,item.software_des,item.software_desCN)
               });
               console.log("optionsDate",this.optionsDate);
           }
       })
       await new Promise((resolve,reject)=>{
               this.$db.all(SQL_UP, (err, res) => {
                   if(res.length>0){
                       resolve(res)
                   }
               })
       }).then(res=>{
           console.log('optionsDate',this.optionsDate)
           this.optionsDate.forEach((item,index)=>{
               res.forEach((ite,it)=>{
                   if(item.softwareId==ite.component_id){
                       item.id=ite.id
                       item.checked=true,
                       item.amountinp=true
                   }
                   item.yearsDate.forEach((i,index)=>{
                       if(i.childId==ite.component_id){
                           item.childId=ite.id
                           item.value2=index
                       }
                       if(i.fatherId==ite.component_id){
                           item.falId=ite.id
                       }
                   })
               })
           })
       })
      },
      getSWWA(softwareId,resA,name,nameCN){
          const SQL_WB = `select * from component_software software where id in(select carry_software_id from software_software
          where choice_software_id=${softwareId}) and software_type=3
          UNION
          select * from component_software where id in(
          select carry_software_id from software_software where choice_software_id in
           ( select id from component_software software where id in(select carry_software_id from
           software_software where choice_software_id=${softwareId}) and software_type=3))`
          this.$db.all(SQL_WB, (err, res) => {
              if (err) {
                  this.$logger(err);
                  this.$Notice.error({
                      title: '数据获取失败',
                      desc: err
                  });
              } else {
                  console.log("维保res",res,resA);
                  let yearsDate=[]
                  res.reverse().forEach(ite=>{
                      if(ite.software_FC){
                          // 展示的维保添加到yearsDate
                          yearsDate.push({
                              category_id:ite.category_id,
                              childId:ite.id,
                              year:ite.years
                          })
                      }
                  });
                  // 全部维保添加到yearsDate
                  yearsDate.forEach((ite,i)=>{
                      res.forEach(it=>{
                          if((it.software_FC==null || it.software_FC==undefined || it.software_FC=="")&&ite.year==it.years){
                              this.$set(ite,'fatherId',it.id)
                          }
                      })
                  });
                  console.log('yearsDate',yearsDate)
                  let obj={
                      checked:false,
                      amountinp:false,
                      value2:1,
                      name : name,
                      nameCN:nameCN,
                      softwareId:softwareId,
                      frontHarddiskId:'',
                      yearsDate: [...yearsDate]
                  };
                  this.optionsDate.push(obj);
                  this.optionsDate.forEach((item,index)=>{
                      item.value2 = yearsDate[0].year;
                  })
              }
          });
      },
      // 选择checkbox
      selectNameAdd(index,ind){
        console.log(index);
          if (this.optionsDate[index].checked) {
              if(!this.optionsDate[index].id){
                  const time = new Date().getTime();
                  const SQL = `INSERT INTO product_programme_detail
                ('product_id','machine_id','category_id','component_id','seq_Key','solution_id','component_count','template_id')VALUES
                ('${localStorage.productId}','${localStorage.machineId}','15','${this.optionsDate[index].softwareId}','${time}','${localStorage.solutionId}','1','${localStorage.templateId}'),
                ('${localStorage.productId}','${localStorage.machineId}','${this.optionsDate[index].yearsDate[0].category_id}','${this.optionsDate[index].yearsDate[0].fatherId}','${time}','${localStorage.solutionId}','1','${localStorage.templateId}'),
                ('${localStorage.productId}','${localStorage.machineId}','${this.optionsDate[index].yearsDate[0].category_id}','${this.optionsDate[index].yearsDate[0].childId}','${time}','${localStorage.solutionId}','${this.input}','${localStorage.templateId}')`
                  this.$db.run(SQL, (err, res) => {
                      if (err) {
                          this.$logger(err);
                          this.$Notice.error({
                              title: '数据获取失败',
                              desc: err,
                          });
                      } else {
                          if (res) {
                              console.log('添加失败');
                          } else {
                              console.log('添加成功' + JSON.stringify(res));
                              const selectSql = `select * from product_programme_detail where seq_Key=${time}
                                                  and template_id='${localStorage.templateId}'
                                                  and solution_id='${localStorage.solutionId}'
                                                  and product_id='${localStorage.productId}'
                                                  and machine_id='${localStorage.machineId}'`;
                              this.$db.all(selectSql, (err, res) => {
                                  if (err) {
                                      this.$logger(err);
                                      this.$Notice.error({
                                          title: '系统错误',
                                          desc: err,
                                      });
                                      return;
                                  }
                                  this.optionsDate[index].id = res[0].id;
                                  this.optionsDate[index].falId = res[1].id;
                                  this.optionsDate[index].childId = res[2].id;
                              });
                          }
                      }
                  });
              }else{
                  let updateSql=[
                      `UPDATE product_programme_detail set 'component_count'='1',component_id='${this.optionsDate[index].softwareId}' where id=${this.optionsDate[index].id} `,
                      `UPDATE product_programme_detail set 'component_count'='1',component_id='${this.optionsDate[index].yearsDate[ind].fatherId}' where id=${this.optionsDate[index].falId} `,
                      `UPDATE product_programme_detail set 'component_count'='${this.input}',component_id='${this.optionsDate[index].yearsDate[ind].childId}' where id=${this.optionsDate[index].childId} `,

                  ]
                  updateSql.forEach(item=>{
                      this.$db.run(item, (err, res) => {
                          if (res) {
                              console.log('修改失败');
                          } else {
                              console.log('修改成功',updateSql);
                          }
                      });
                  })
              }
          }else {
              let SQLDelete = [
                  `DELETE FROM product_programme_detail WHERE id=${this.optionsDate[index].id}`,
                  `DELETE FROM product_programme_detail WHERE id=${this.optionsDate[index].falId}`,
                  `DELETE FROM product_programme_detail WHERE id=${this.optionsDate[index].childId}`
                  ]
              SQLDelete.forEach(item=>{
                  this.$db.run(item, (err, res) => {
                      if (err) {
                          this.$logger(err);
                          this.$Notice.error({
                              title: '数据获取失败',
                              desc: err,
                          });
                      } else {
                          console.log("取消成功")
                          this.optionsDate[index].id=''
                          this.optionsDate[index].falId=''
                          this.optionsDate[index].childId=''
                      }
                  })
              })
          }
      },
  },
    beforeRouteEnter(from,to,next){
        /*cpu激活数获取*/
        const SQL_COUNT = `select component_count from product_programme_detail where category_id=11
        and solution_id= ${localStorage.solutionId}
        and template_id=${localStorage.templateId}
        and product_id='${localStorage.productId}'
        and machine_id='${localStorage.machineId}'`
        next(vm=>{
            vm.$emit('comup',from.query.id)
            //获取数量
             vm.$db.all(SQL_COUNT, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: '数据获取失败',
                        desc: err
                    });
                } else {
                    console.log('resmount',res)
                    vm.input=res[0].component_count
                }
            });
        })
    },
    beforeRouteLeave(to,from,next){
        if(this.optionsDate.length==1&&this.optionsDate[0].id==undefined ){
            this.selectOptionsAdd(index);
        }
        next()
    },
    created() {
       this.getDetailDatas();
    }
};
</script>

<style scoped lang="scss">
    *{
        list-style: none;
        box-sizing: border-box;
    }

    .wrap{
        width: 100%;
        height: 100%;
        padding: 20px;
        ul li {
            padding: 8px;
            .checksele {
                float: left;
            }
        }
        ul li .el-mount{
            margin-left: 20px;
            width: 90px;
        }
        ul li .select-year {
            width: 100px;
            text-align: center;
            span{
                display: block;
                height: 50px;
            }
        }
    }
    .font-style{
        width: 100%;
        padding: 8px;
        background: #cccccc;
    }


</style>
