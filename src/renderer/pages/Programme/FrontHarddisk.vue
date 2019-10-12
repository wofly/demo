<template>
   <div class="addct">
       <p class="title content-label">
           <span class="config-title">Internal Disk</span>
       </p>
       <div class="modify for-main" v-for="(ite,ind) in arr" :key="ind">
           <el-select v-model="value"  size="mini"
                      class="sel">
               <el-option
                       v-for="(item,index) in SAS"
                       :key="index"
                       :label="item.value"
                       :value="index">
               </el-option>
           </el-select>
           <el-select v-model="ite.value"  size="mini" @change="set(ind,ite.value,1)"  @visible-change="beforSet($event,ind)">
               <el-option
                       v-for="(item,index) in ite.domlist"
                       :key="index"
                       :label="item.disk_des"
                       :value="item.id">
               </el-option>
           </el-select>
           <p>*</p>
           <el-select v-model="ite.num"  size="mini"
                      class="sel" @change="set(ind,ite.value)" @visible-change="beforNum($event,ind)">
               <el-option
                       v-for="(item,index) in ite.numZ"
                       :key="index"
                       :label="item"
                       :value="item">
               </el-option>
           </el-select>
           <el-button size="mini" type="info" icon="el-icon-close" circle @click="dele(ind)" v-show="arr.length>1?1:0" class="dele"></el-button>
       </div>

       <br>
       <span  class="tips">前置:{{numN}}GB</span>
       <br>
       <el-button size="mini" icon="el-icon-plus" @click="add()" class="add"></el-button>
       <span class="add-cables">添加硬盘</span>
       <br>
       <span  class="tips">已使用插槽：{{numS}} /{{num}} </span>
   </div>
</template>

<script>
    export default {
        name: "FrontHardDisk",
        props:['num','sign'],

        data(){
            return {
                value:0,
                arr:[],
                brr:[],
                arAy:[],
                numN:0,
                numS:0,
                SAS:[]
            }
        },


        methods:{
          set(ind,id,num) {
              let time=new Date().getTime()
              if(num){
                  this.arr[ind].num=1
              }
              const SQL = `INSERT INTO product_programme_detail
('product_id','machine_id','categroy_id','component_id','component_count','seq_Key','solution_id','template_id')
VALUES('${localStorage.productId}','${localStorage.machineId}','${this.sign}','${id}','${this.arr[ind].num}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`
              const updateSql = `UPDATE product_programme_detail set 'component_count'='${this.arr[ind].num}',component_id='
                ${id}' where id=${this.arr[ind].id}`;
              if(this.arr[ind].id){
                  this.$db.run(updateSql, (err, res) => {
                      if (res) {
                          console.log('修改失败');
                      } else {
                          console.log('修改成功');
                          this.brr[ind]=id
                          this.getNu()
                          console.log(res,this.brr)
                      }
                  });
              }else{
                  this.$db.run(SQL, (err, res) => {
                      if(err){
                          console.log('失败')
                      }else{
                          console.log('成功')
                          const selectSql = `select * from product_programme_detail where seq_Key=${time}`;
                          this.$db.get(selectSql, (err, res) => {
                              if (err) {
                                  this.$logger(err);
                                  this.$Notice.error({
                                      title: '系统错误',
                                      desc: err,
                                  });
                                  return;
                              }else{
                                  this.arr[ind].id = res.id;
                                  this.brr.push(id)
                                  this.getNu()
                                  console.log(res,this.brr)
                              }

                          });
                      }
                  })
              }

          },
          add(){
              if(this.numS>=this.num){
                  return
              }
           let lArr=this.arAy.filter(item=>{ //过滤后的数组
                  let num=true
                  this.brr.forEach(it=>{
                      if(item.id==it){
                          num=false
                          return
                      }
                  })
                  return num
              })
              this.arr.push({
                  domlist:[...lArr],
                  value:lArr[0].id,
                  num:1,
                  id:'',
                  numZ:this.num,
              })
              this.set(this.arr.length-1,lArr[0].id)
          },
            dele(index){
                if (this.arr[index].id) {
                    const sql = `DELETE FROM product_programme_detail WHERE id = ${this.arr[index].id}`;
                    this.$db.run(sql, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '搜索失败',
                                    desc: err,
                                });
                            } else {
                                this.brr.splice(index,1)
                                this.arr.splice(index,1)
                                console.log("删除成功",this.brr)
                                this.getNu()
                            }
                    })
                }
            },
            getNu(){
              this.numN=0
              this.numS=0
              this.brr.forEach((item,i)=>{
                  this.arAy.forEach(it=>{
                      if(item==it.id){
                          this.numN+= it.capacity*this.arr[i].num
                          this.numS+=this.arr[i].num
                      }
                  })
              })
                console.log(this.numN)
            },
            beforNum(bool,ind){
              if(bool){
                  let num=0
                  this.arr.forEach((it,index)=> {
                    if(index!==ind){
                        num+=it.num
                    }
                  })
                  this.arr[ind].numZ=this.num-num
              }
            },
            beforSet(bool,ind){
              console.log(bool,ind)
                if(bool){
                    this.arr[ind].domlist=this.arr[ind].domlist.filter(item=>{
                        let num=true
                        this.brr.forEach((it,index)=>{
                            if(item.id==it&&index!=ind){
                                return num=false
                            }
                        })
                   return num
                    })
                    console.log(this.arr[ind].domlist,this.brr)
                }
            }
        },
        created() {
            let than =this
            const SQL = `select disk_des,id,capacity from component_disk where disc_type in(
SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where bd.id in(select disk_id
from backplane_disk where backplane_id=4)group by disc_type having count(disc_type)>=0)`
            const SQLSAS=`SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where bd.id in(select disk_id
            from backplane_disk where backplane_id=1)`
             new Promise(function(resolve, reject) {
                than.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '获取数据失败',
                            desc: err,
                        });
                    } else {
                        resolve(res);
                    }
                });
            }).then(res => {
                console.log(res)
                 this.arAy=[...res]
                 than.arr.push({
                     domlist:[...res],
                     value:res[0].id,
                     num:1,
                     id:'',
                     numZ:this.num
                 })
                 console.log(this.arr)
                 let getSQL= ` select * from product_programme_detail where categroy_id='${this.sign}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'  and component_id !=25`
                 this.$db.all(getSQL, (err, res) => {
                     if (err) {
                         this.$logger(err);
                         this.$Notice.error({
                             title: '获取失败',
                             desc: err,
                         });
                     } else {
                        if(res.length>0){
                            this.arr=[]
                            this.brr=[]
                            res.forEach(item=>{
                                this.brr.push(item.component_id)
                                this.arr.push({
                                    domlist:[...this.arAy],
                                    value:item.component_id,
                                    num:item.component_count,
                                    id:item.id,
                                    numZ:this.num
                                })
                            })
                            this.getNu()
                            console.log('获取成功',res,this.arr,this.brr)
                        }else{
                            this.set(this.arr.length-1,this.arAy[0].id)
                        }
                     }
                 })
            });
            than.$db.all(SQLSAS, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: '获取数据失败',
                        desc: err,
                    });
                } else {
                    console.log(res);
                    res.forEach(item=>{
                        if (item.disc_type === 0) {
                            this.SAS=[{
                                value:'SAS',
                                index:0
                            }]
                        }
                    })
                    console.log(this.SAS)
                }
            });
        }
    }
</script>

<style scoped>
    .addct{
        padding-left:20px ;
    }
    .add{
        margin: 20px 10px;
    }
    .modify{
        margin: 10px 0;
    }
    .dele{
        margin-left: 20px;
    }
</style>
