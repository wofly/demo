<template>
    <!--操作系统-->
    <div class="wrap">
        <div class="font-style"><p>主要操作系统</p></div>
        <ul class="inpList for-main">
            <li>
                <el-select v-model="value"  size="mini" @change="getOperation(false)" >
                    <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.softwareName"
                            :value="index">
                    </el-option>
                </el-select>
            </li>
            <li>激活核心数：</li>
            <li>
                <el-select v-model="numN" placeholder="" class="sel" @change="getOperation" disabled>
                    <el-option
                            v-for="item in numN"
                            :key="item"
                            :value="item">
                    </el-option>
                </el-select>
            </li>
            <li>维保期限：</li>
            <li>
                <el-select v-model="year" placeholder="" class="sel" @change="getOperation(true)"  size="mini">
                    <el-option
                            v-for="(item,index) in options2"
                            :key="index"
                            :label="item.year"
                            :value="index">
                    </el-option>
                </el-select>
            </li>
        </ul>
        <div class="font-style"><p>次要操作系统</p></div>
        <ul class="inpList for-main">
            <li>
                <el-select v-model="value" placeholder="" disabled>
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :value="item.id">
                    </el-option>
                </el-select>
            </li>
            <li>激活核心数：</li>
            <li>
                <el-select v-model="options1" placeholder="" class="sel" disabled>
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :value="item.id">
                    </el-option>
                </el-select>
            </li>
            <li>维保期限：</li>
            <li>
                <el-select v-model="options1" placeholder="" class="sel" disabled>
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :value="item.id">
                    </el-option>
                </el-select>
            </li>
        </ul>
        <ul class="inpList for-main">
            <li>
                <el-select v-model="options1" placeholder="" disabled>
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :value="item.id">
                    </el-option>
                </el-select>
            </li>
            <li>激活核心数：</li>
            <li>
                <el-select v-model="options1" placeholder="" class="sel" disabled>
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :value="item.id">
                    </el-option>
                </el-select>
            </li>
            <li>维保期限：</li>
            <li>
                <el-select v-model="options1" placeholder="" class="sel" disabled>
                    <el-option
                            v-for="item in options"
                            :key="item.id"
                            :value="item.id">
                    </el-option>
                </el-select>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'Logic',
  data() {
    return {
      options: [],
      options1: '',
      options2: [],
      value:0,
      year:'',
      num:1,
      numN:10,
      id:'',
      childId:'',
      fatherId:''
    };
  },
  methods: {
    async setrabbet() {
        let than=this
        const SQL = `   select cs.id,cs.software_name,cs.years from component_software cs  join product_software ps on cs.id=ps.software_id
           where ps.software_id in (128,129,131,132) and ps.product_id=1`;

        const SQLData=`select detail.*,cs.id soft_id,cs.years,cs.software_FC from product_programme_detail detail ,component_software cs
where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.categroy_id=14 and cs.categroy_id=detail.categroy_id and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'
and cs.id=detail.component_id
UNION
select temptable.*,temptable.id soft_id,component_software.years,component_software.software_FC from component_software,(select * from product_programme_detail where component_id in(select tn.id from (select * from component_software where id in (
select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id=(select detail.component_id from product_programme_detail detail ,component_software cs
where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.categroy_id=14 and machine_id='${localStorage.machineId}' and cs.categroy_id=detail.categroy_id and product_id='${localStorage.productId}'
and cs.id=detail.component_id)
)and software_type=3) tn) and  categroy_id=18) temptable
where temptable.component_id=component_software.id`
        const cpieK = ` select component_count from product_programme_detail where categroy_id=11 AND product_id='${localStorage.productId}' AND solution_id=${localStorage.solutionId} and template_id='${localStorage.templateId}'and machine_id='${localStorage.machineId}'`;// 获取cpu的激活数
        const SQLYear= `
select * from component_software where id in (
select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id=128
)and software_type=3`
        await new Promise(function (resolve, reject) {
            // 数据库查询
            than.$db.all(cpieK, (err, res) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(res);
                }
            });
        }).then(res => {
            console.log(res)
                this.numN=res[0].component_count
        });
        await new Promise(function (resolve, reject) {
            // 数据库查询
            than.$db.all(SQL, (err, res) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(res);
                }
            });
        }).then(res => {
            console.log(res)
            res.forEach(item => {
                let obj = {
                    categroyId: item.categroy_id,
                    id: item.id,
                    softwareName: item.software_name,
                }
                this.options.push(obj)
            })
        });
        await new Promise(function (resolve, reject) {
            than.$db.all(SQLYear,(err,res)=>{
                if(res.length>0){
                    resolve(res)
                }
            })
        }).then(res=>{
            console.log(res)
            this.options2 =[]
            res.forEach(item=>{
                if(item.software_FC){
                    this.options2.push({
                        categroy_id:item.categroy_id,
                        childId:item.id,
                        year:item.years
                    })
                }
            })
            this.options2.forEach((item,i)=>{
                res.forEach(it=>{
                    if((it.software_FC==null || it.software_FC==undefined || it.software_FC=="")&&item.year==it.years){
                        console.log(it)
                        this.$set(item,'fatherId',it.id)
                    }
                })
            })
            this.year = this.options2[0].year
            console.log(this.options2,this.options)
        })
        await this.$db.all(SQLData, (err, res) => {
            console.log(res)

            if (res.length<1) {
                //库里面没有数据的话走这个
                // this.$logger(err);
            } else {
                let numA=''
                console.log(res,11111)
                res.forEach((item,index)=>{
                    if(item.categroy_id==14){
                        this.id=item.id
                        this.options.forEach((it,i)=>{
                           if(it.id==item.component_id) {
                               this.value=i
                               console.log(this.value)
                           }
                        })
                        const SQLYe= `
select * from component_software where id in (
select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id='${item.component_id}'
)and software_type=3`
                         new Promise(function (resolve, reject) {
                             console.log(res)
                            than.$db.all(SQLYe,(err,resA)=>{
                                if(resA.length>0){
                                    resolve(resA)
                                }
                            })
                        }).then(res=>{
                            console.log(res)
                            this.options2 =[]
                            res.forEach(ite=>{
                                if(ite.software_FC){
                                    this.options2.push({
                                        categroy_id:ite.categroy_id,
                                        childId:ite.id,
                                        year:ite.years
                                    })
                                }
                            })
                            this.options2.forEach((ite,i)=>{
                                res.forEach(it=>{
                                    if((it.software_FC==null || it.software_FC==undefined || it.software_FC=="")&&ite.year==it.years){
                                        console.log(it)
                                        this.$set(ite,'fatherId',it.id)
                                    }
                                })
                            })
                            console.log(this.options2)
                             this.options2.forEach((it,i)=>{
                                 if(it.childId==numA ||it.fatherId==numA){
                                     this.year=i
                                     console.log(i)
                                 }
                             })
                        })
                    }
                    if(item.categroy_id==18){
                        if(item.software_FC==null || item.software_FC==undefined || item.software_FC==''){
                            numA=item.component_id
                               this.fatherId=item.id
                            console.log(numA)
                        }else{
                            this.childId=item.id
                        }
                    }
                })
            }
        })
    },
    async getOperation(bool){
        console.log(this.options[this.value].id,this.id,this.childId,this.fatherId)
            const SQLYear= `
select * from component_software where id in (
select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id=${this.options[this.value].id}
)and software_type=3`
            await new Promise((resolve, reject)=>{
                this.$db.all(SQLYear,(err,res)=>{
                    if(res){
                        resolve(res)
                    }
                })
            }).then(res=>{
                console.log(res)
                this.options2 =[]
                res.forEach(item=>{
                    if(item.software_FC){
                        this.options2.push({
                            categroy_id:item.categroy_id,
                            childId:item.id,
                            year:item.years
                        })
                    }
                })
                this.options2.forEach((item,i)=>{
                    res.forEach(it=>{
                        if((it.software_FC==null || it.software_FC==undefined || it.software_FC=="")&&item.year==it.years){
                            console.log(it)
                            this.$set(item,'fatherId',it.id)
                        }
                    })
                })
                if(!bool){
                    this.year = 0
                }
                console.log(this.options2)
            })
        if(this.id){
             //const updateSql = `UPDATE product_programme_detail set 'component_count'='${this.num}',component_id='${this.options[this.value].id}','years'='${this.year}' where id=${this.id} `;
            let update=[
                `UPDATE product_programme_detail set 'component_count'='${this.numN}',component_id='${this.options[this.value].id}' where id=${this.id} `,
                `UPDATE product_programme_detail set 'component_count'='${this.num}',component_id='${this.options2[this.year].fatherId}' where id=${this.fatherId} `,
                `UPDATE product_programme_detail set 'component_count'='${this.num}',component_id='${this.options2[this.year].childId}' where id=${this.childId} `
            ]
            console.log(update)
            update.forEach(item=>{
                this.$db.run(item, (err, res) => {
                    console.log(res, err);
                    if (res) {
                        console.log('修改失败');
                    } else {
                        console.log('修改成功');
                    }
                })
            })

        }else{
            const time = new Date().getTime();
            console.log(time)
            const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','categroy_id','component_id','component_count','seq_Key','solution_id','template_id') VALUES
            ('${localStorage.productId}','${localStorage.machineId}','14','${this.options[this.value].id}','${this.numN}','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
            ('${localStorage.productId}','${localStorage.machineId}','${this.options2[this.year].categroy_id}','${this.options2[this.year].fatherId}','${this.num}','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
            ('${localStorage.productId}','${localStorage.machineId}','${this.options2[this.year].categroy_id}','${this.options2[this.year].childId}','${this.num}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
            //添加三条数据
            this.$db.run(updateSql, (err, res) => {
                if (err) {
                    console.log('添加失败');
                } else {
                    console.log('添加成功');
                    const selectSql = `select * from component_software where id in (
                        select component_id from product_programme_detail where seq_Key=${time} and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}')`;
                    this.$db.all(selectSql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '系统错误',
                                desc: err,
                            });
                            return;
                        }
                        res.forEach(item=>{
                            if(item.categroy_id==14){
                                this.id=item.id
                            }
                            if(item.categroy_id==18&&(item.software_FC==null || item.software_FC==undefined || item.software_FC=="")){
                                this.fatherId=item.id
                            }
                            if(item.categroy_id==18&&item.software_FC){
                                this.childId=item.id
                            }
                        })
                        console.log(res,this.fatherId,this.childId,this.id)
                    })
                }
            })
         }
      }
  },
    beforeRouteEnter(from,to,next){
        next(vm=>{
            vm.$emit('comup',from.query.id)
            if(vm.$store.state.cpu_C==1){
                vm.numN=10
            }else{
                vm.numN=20
            }
        })
    },
    beforeRouteLeave(to,from,next){
      if(!this.id){
          this.getOperation();
      }
      next()
    },
  created() {
    this.setrabbet();
  },
};
</script>

<style scoped lang="scss">
    *{
        margin: 0;
        list-style: none;
        box-sizing: border-box;
    }
    .wrap{
        width: 100%;
        height: 100%;
        padding: 20px;
        div{
            margin-top: 16px;
        }
    }
    .font-style{
        width: 100%;
        padding: 8px;
        background: #cccccc;
    }
    .wrap-box{
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        line-height: 80px;
        .inp{
            width: 120px;
            margin-left: 12px;
        }
    }
    .inpList{
        display: flex;
        align-items: center;
        li{
            padding-left: 20px;
        }
    }
</style>
