<template>
    <!--前置硬盘-->
   <div class="addct">
       <p class="title content-label">
           <span class="config-title">{{$t('backPlane.prepositionInternalDisk.preload')}}</span>
       </p>
       <div class="modify-ye for-main" >
           <el-select v-model="preloadO"  size="mini" @change="preloadOff(preloadO)">
               <el-option
                       v-for="(item,index) in preload"
                       :key="item.id"
                       :label="$store.state.info_language?item.software_des:item.software_desCN"
                       :value="item.id">
               </el-option>
           </el-select>
       </div>

       <div v-for="dl in preload" v-if="preloadO==dl.id" key="dl.id">
           <div class="pdiv" v-if="dl.temponTit!=null">
               {{dl.temponTit}}
           </div>
           <div class="pdiv red-a" v-if="dl.uiStatus">
               {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
           </div>
           <div class="pdiv" v-if="dl.setTimeMe">
               此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
           </div>
       </div>

       <p class="title content-label">
           <span class="config-title">{{$t('backPlane.prepositionInternalDisk.title')}}</span>
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
                       :label="$store.state.info_language?item.description_en:item.disk_des"
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
           <div v-for="dl in ite.domlist" v-if="ite.value==dl.id" :key="dl.id">
               <div class="pdiv" v-if="dl.temponTit!=null">
                   {{dl.temponTit}}
               </div>
               <div class="pdiv red-a" v-if="dl.uiStatus">
                   {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
               </div>
               <div class="pdiv" v-if="dl.setTimeMe">
                   此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
               </div>
           </div>
       </div>

       <br>
       <span v-if="this.$route.query.showMax" class="tips">{{$t('backPlane.prepositionInternalDisk.InternalDisk.content1')}}:{{totalCapacity}}GB</span>
       <span v-if="!this.$route.query.showMax" class="tips">{{$t('backPlane.prepositionInternalDisk.InternalDisk.content1')}}:{{this.$parent.$parent.totalCapacity}}GB</span>
       <br>
       <el-button size="mini" icon="el-icon-plus" @click="add()" class="add"></el-button>
       <span class="add-cables">{{$t('backPlane.prepositionInternalDisk.InternalDisk.content2')}}</span>
       <br>
       <span  class="tips">{{$t('backPlane.prepositionInternalDisk.InternalDisk.content3')}}：{{numS}} /{{num}} </span>
   </div>
</template>

<script>

    export default {
        name: "FrontHardDisk",
        props:['num','sign'],

        data(){
            return {
                //预加载软件的数组
                preload:[],
                preloadId:0,
                preloadO:0,
                // 硬盘类型v-model
                value:0,
                // 硬盘类型 下拉数据
                SAS:[],
                // 外层循环数组
                arr:[],
                // 存储 已选中 数据id
                brr:[],
                // 硬盘型号 下拉数据
                arAy:[],
                // 已选中的数据，最大容量
                numN:0,
                // 已选中的插槽数
                numS:0,
                // 获取总硬盘容量
                totalCapacity:'',
            }
        },

        methods:{
            /*库里添加和删除预选择软件*/
            preloadOff(id){
                if(this.preloadId){
                    /*id存在的话就删除*/
                    const deletesql = `DELETE FROM product_programme_detail WHERE id in('${this.preloadId}',(select detail.id from product_programme_detail detail
join component_barebone bare on bare.category_id=detail.category_id and bare.id=detail.component_id
where detail.component_id = (select bare.id from component_barebone bare
join component_base_info info on info.id=bare.base_info_id
where info.component_FC='5000') and detail.solution_id='${localStorage.solutionId}' and detail.product_id='${localStorage.productId}' and detail.template_id='${localStorage.templateId}' and detail.machine_id='${localStorage.machineId}'))`;
                    this.$db.run(deletesql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            console.log("删除成功")
                            this.preloadId=0
                        }
                    })
                }else{
                    /*id不存在的话就添加*/
                    const innerSQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','solution_id','template_id')
VALUES('${localStorage.productId}','${localStorage.machineId}','${this.$route.query.nameRu}','${id}','1','${localStorage.solutionId}','${localStorage.templateId}')`
                    const innerSQLRuan =`insert into product_programme_detail
(product_id,machine_id,category_id,component_id,component_count,solution_id,template_id)
values
('${localStorage.productId}','${localStorage.machineId}',(select distinct bare.category_id from component_barebone bare
join component_category cate on cate.id=bare.category_id),(select bare.id from component_barebone bare
join component_base_info info on info.id=bare.base_info_id
where info.component_FC='5000'),1,'${localStorage.solutionId}','${localStorage.templateId}')`
                    this.$db.run(innerSQL, (err, res) => {
                        if (err) {
                            console.log('添加失败');
                        } else {
                            console.log('添加成功');
                            /*添加barebone里的5000预安装*/
                            this.$db.run(innerSQLRuan, (err, res) => {
                                if (err) {
                                    console.log('添加失败');
                                } else {
                                    console.log('添加成功');
                                }
                            })
                            /*查询库里有没有准备回显*/
                            let getPreload=`select id from product_programme_detail where category_id='${this.$route.query.nameRu}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                            this.$db.get(getPreload, (err, res) => {
                                if (err) {
                                    console.log('查询失败');
                                } else {
                                    console.log('查询成功');
                                    this.preloadId=res.id
                                }
                            });
                        }
                    });
                }
            },
            /*存储硬盘数据  型号与个数*/
          set(ind,id,num) {
              /*显示隐藏总容量*/
              this.$route.query.showMax = true;
              let time=new Date().getTime()
              if(num){
                  this.arr[ind].num=1
              }
              const SQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id')
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
            /*添加已选中数据*/
          add(){
              if(this.numS>=this.num){
                  return
              }

              /*显示隐藏总容量*/
              this.$route.query.showMax = true;

              console.log(this.arAy)
           let lArr=this.arAy.filter(item=>{ //过滤后的数组
                  let num=true
                  this.brr.forEach(it=>{
                      console.log(this.brr)
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
              console.log(this.arr)
              this.set(this.arr.length-1,lArr[0].id)
          },

            /*删除已选中数据*/
            dele(index){
                if (this.arr[index].id) {
                    /*显示隐藏总容量*/
                    this.$route.query.showMax = true;
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
            /* 选中或删除  计算总容量和已选插槽*/
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
                /* 将内部外部总容量  添加到localStorage 进行计算*/
                let internalCapacity = this.numN;
                localStorage.setItem('internalCapacity', internalCapacity);

                this.totalCapacity = parseInt(localStorage.internalCapacity) + parseInt(localStorage.externalCapacity)+ parseInt(localStorage.externalCapacityCard);

                console.log( this.totalCapacity )
            },

            /*计算硬盘可选最大值*/
            beforNum(bool,ind){
              if(bool){
                  let num=0
                  console.log(this.arr)
                  this.arr.forEach((it,index)=> {
                    if(index!==ind){
                        num+=it.num
                    }
                  })
                  this.arr[ind].numZ=this.num-num
              }
            },
            /*将 选中数据，存储到 新数组中*/
            beforSet(bool,ind){
                if(bool){
                    console.log(this.arr)
                    let gettime= new Date().getTime() //获取现在的时间戳
                    this.arr[ind].domlist=this.arr[ind].domlist.filter(item=>{
                        let num=true
                        this.brr.forEach((it,index)=>{
                            if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
                                return false //如果时间小于现在时间，也就说过市了，不在显示
                            }
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

        /*进入页面获取数据*/
        created() {
            /*查询出软件预装的数据*/
            console.log(this.$route.query)
            let SQLPreload=`SELECT soft.id,soft.software_des,soft.software_desCN,soft.withdraw_date,soft.ui_status,soft.title_msg,so.ship_date
				FROM component_software soft
				join product_info info on info.id=soft.productId
				join relation_solution_product relation on relation.product_id = info.id
				join solution so on so.id = relation.solution_id
				where soft.category_id='${this.$route.query.nameRu}' and info.id='${localStorage.productId}' and so.id='${localStorage.solutionId}'`
            /*查询库里有没有准备回显*/
            let getPreload=`select id from product_programme_detail where category_id='${this.$route.query.nameRu}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
            this.$db.get(SQLPreload, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: '获取数据失败',
                        desc: err,
                    });
                } else {
                    let obj={
                        id:0,
                        software_des:'Not to install',
                        software_desCN:'不安装',
                        setTimeMe:null,
                        overdueTime:'',
                        temponTit:null,
                        uiStatusEn:'',
                        uiStatus:''
                    }
                    this.preload.push(obj)
                    res.software_des='Installation'
                    res.software_desCN='安装'
                    this.$set(res,'temponTit',res.title_msg) //展示的描述
                    this.$set(res,'setTimeMe',res.withdraw_date) //展示的描述
                    //this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                    if(res.withdraw_date!=null){
                        //如果不为null的话,就改为天数
                        this.$store.commit('setStatusTime',res.withdraw_date)
                        this.$set(res,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                    }
                    this.$store.commit('uiStatusTime',res.ui_status)
                    this.$set(res,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                    this.$set(res,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述

                    this.preload.push(res)
                    this.$db.get(getPreload, (err, resA) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            console.log(resA)
                            if(resA){
                                this.preloadId=resA.id
                                this.preloadO=res.id
                            }
                        }
                    });
                }
            });
            let than =this
            const SQL = `select info.description disk_des,disk.disc_interface,info.description_en,info.withdraw_date,disk.id,capacity,info.status,info.ui_status,info.title_msg,so.ship_date from component_disk disk
					join component_base_info info on info.id=disk.base_info_id
					join product_info product on product.id=info.productId
					join relation_solution_product relation on relation.product_id = product.id
					join solution so on so.id = relation.solution_id
					where disc_type in(
SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where bd.id in(select disk_id
from backplane_disk where backplane_id=4) AND disk.disc_interface = 2 group by disc_type having count(disc_type)>=0) and info.productId=${localStorage.productId} and so.id='${localStorage.solutionId}'`
            const SQLSAS=`SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where bd.id in(select disk_id
            from backplane_disk where backplane_id=1)`
            console.log(SQL)
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
                 res.forEach((item,index)=>{
                     this.$set(item,'temponTit',item.title_msg) //展示的描述
                     this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                     if(item.withdraw_date){
                         let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                         let time = new Date(thisTime).getTime();//将时间改为时间戳
                         this.$set(item,'time',time)//将时间戳添加到对象里面
                         this.$set(res[index],'time',time)//将时间戳添加到对象里面
                         //如果不为null的话,就改为天数
                         this.$store.commit('setStatusTime',item.withdraw_date)
                         this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                     }else{
                         this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                     }
                     this.$store.commit('uiStatusTime',item.ui_status)
                     this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                     this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                 });
                 this.arAy=[...res];
                console.log(this.arAy)
                 than.arr.push({
                     domlist:[...res],
                     value:res[0].id,
                     num:1,
                     id:'',
                     numZ:this.num,
                 })
                 console.log(this.arr)
                    /* 查询到  已存入product_programme_detail 表里的数据*/
                 let getSQL= ` select * from product_programme_detail where category_id='${this.sign}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'  and component_id !=25
            and is_expansion = 1`
                 console.log(getSQL)
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
                                    numZ:this.num,
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
    .modify-ye{
        margin: 10px 0 30px;
    }
    .dele{
        margin-left: 20px;
    }
</style>
