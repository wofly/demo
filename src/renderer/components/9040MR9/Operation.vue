<template>
    <!--操作系统-->
    <div class="wrap">
        <!--主要操作系统-->
        <div class="font-style content-label">{{$t('OperatingSystem.lists.MainOperatingSystem.title')}}</div>
        <ul class="inpList for-main">
            <li>
                <el-select v-model="value"  size="mini" @change="getOperation(false)" >
                    <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="$store.state.info_language?item.softwareName:item.softwareNameCN"
                            :value="index">
                    </el-option>
                </el-select>
            </li>
            <li class="wdI">{{$t('OperatingSystem.lists.MainOperatingSystem.content1')}}：</li>
            <li>
                <el-select v-model="numN" placeholder="" class="sel" @change="getOperation" disabled>
                    <el-option
                            v-for="item in numN"
                            :key="item"
                            :value="item">
                    </el-option>
                </el-select>
            </li>
            <li class="wdI">{{$t('OperatingSystem.lists.MainOperatingSystem.content2')}}：</li>
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
    </div>
</template>

<script>
    export default {
        name: 'Logic',
        data() {
            return {
                options: [],
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

            /*进入页面获取数据*/
            async setrabbet() {
                console.log('进来没')
                let than=this
                /*获取操作系统下拉数据*/
                const SQL = `select cs.id,cs.software_desCN,cs.software_des,cs.years from component_software cs
join product_software ps on cs.id=ps.software_id
join product_info info on info.id=cs.productId
where info.machine_model='9040' and info.machine_submodel='MR9' and category_id=14`;
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
                    console.log('res>>>>>',res)
                    res.forEach(item => {
                        let obj = {
                            categoryId: item.category_id,
                            id: item.id,
                            softwareNameCN: item.software_desCN,
                            softwareName: item.software_des,
                        }
                        this.options.push(obj)
                    })
                });
                // 获取cpu的激活数
                const cpieK = `select component_count from product_programme_detail detail
                 join component_other other on other.category_id = detail.category_id and other.id=detail.component_id
                 join component_base_info info on info.id=other.base_info_id
                 join relation_cpu_activation relation on relation.base_info_id=info.id
                 where detail.category_id=11 AND detail.product_id='${localStorage.productId}' AND detail.solution_id=${localStorage.solutionId} and detail.template_id='${localStorage.templateId}'and detail.machine_id='${localStorage.machineId}' and relation.activation_type=0 and relation.activation_unit=0`;
                console.log(cpieK)
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

                /*获取年份数据*/
                const SQLYear= `select distinct id,category_id,years,software_FC from component_software where id in (
select cs.id from software_software ss
join component_software cs on cs.id=ss.carry_software_id
where cs.productId=2 and ss.choice_software_id in (153,154,155,156) and years !='Null'  and years !=''
)`
                await new Promise(function (resolve, reject) {
                    than.$db.all(SQLYear,(err,res)=>{
                        if(res.length>0){
                            resolve(res)
                        }
                    })
                }).then(res=>{
                    this.options2 =[]
                    res.forEach(item=>{
                        if(item.software_FC){
                            this.options2.push({
                                category_id:item.category_id,
                                childId:item.id,
                                year:item.years
                            })
                        }
                    })
                    console.log(this.options2)
                    console.log(res)
                    this.options2.forEach((item,i)=>{
                        res.forEach(it=>{
                            if((it.software_FC==null || it.software_FC==undefined || it.software_FC=="")&&item.year==it.years){
                                this.$set(item,'fatherId',it.id)
                            }
                        })
                    })
                    this.year = this.options2[0].year
                })

                /*获取 product_programme_detail  里的数据*/
                const SQLData=`select detail.*,cs.id soft_id,cs.years,cs.software_FC from product_programme_detail detail ,component_software cs
where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.category_id=14 and cs.category_id=detail.category_id and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'
and cs.id=detail.component_id
UNION
select temptable.*,temptable.id soft_id,component_software.years,component_software.software_FC from component_software,(select * from product_programme_detail where component_id in(select tn.id from (select * from component_software where id in (
select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id=(select detail.component_id from product_programme_detail detail ,component_software cs
where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.category_id=14 and machine_id='${localStorage.machineId}' and cs.category_id=detail.category_id and product_id='${localStorage.productId}'
and cs.id=detail.component_id)
)and software_type=3) tn) and  category_id=18) temptable
where temptable.component_id=component_software.id`
                console.log(SQLData)
                await this.$db.all(SQLData, (err, res) => {

                    if (res.length<1) {
                        //库里面没有数据的话走这个
                        // this.$logger(err);
                    } else {
                        let numA=''
                        res.forEach((item,index)=>{
                            if(item.category_id==14){
                                this.id=item.id
                                this.options.forEach((it,i)=>{
                                    if(it.id==item.component_id) {
                                        this.value=i
                                        console.log(this.value)
                                    }
                                })

                                /*带出年份*/
                                const SQLYe= `
select * from component_software where id in (
select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id='${item.component_id}'
)and software_type=3`
                                console.log(SQLYe)
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
                                                category_id:ite.category_id,
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

                            if(item.category_id==18){
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

            /*插入已选中的也页面数据*/
            async getOperation(bool){

                if(this.options[this.value].id == 155 || this.options[this.value].id == 156){

                    const sql=`delete from product_programme_detail where  id in (
select id from product_programme_detail where component_id in (select ss.carry_software_id from component_software cs
join software_software ss on cs.id = ss.choice_software_id  where cs.id=158  union
select 158) and category_id in (42,20)  and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}')`
                    this.$db.run(sql,(err,res)=>{
                        if(err){
                            console.log('删除失败')
                        }else{
                            console.log('删除成功')
                        }
                    })

                    const sqldel=`delete from product_programme_detail where  id in (
select id from product_programme_detail where component_id in (select ss.carry_software_id from component_software cs
join software_software ss on cs.id = ss.choice_software_id where cs.id=159 union
select 159) and category_id in (42,20)  and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}')`
                    this.$db.run(sqldel,(err,res)=>{
                        if(err){
                            console.log('删除失败')
                        }else{
                            console.log('删除成功')
                        }
                    })

                }

                console.log('调用他没')
                console.log(this.value,this.options[this.value].id,this.id,this.childId,this.fatherId)
                const SQLYear= `select distinct id,category_id,years,software_FC from component_software where id in (
select cs.id from software_software ss
join component_software cs on cs.id=ss.carry_software_id
where cs.productId=2 and ss.choice_software_id=${this.options[this.value].id}) and software_type=3`

                console.log(SQLYear)
                console.log(this.options[this.value].id)
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
                                category_id:item.category_id,
                                childId:item.id,
                                year:item.years
                            })
                        }
                    })

                    console.log(this.options2)

                    this.options2.forEach((item,i)=>{
                        res.forEach(it=>{
                            if((it.software_FC==null || it.software_FC==undefined || it.software_FC=="")&&item.year==it.years){
                                console.log(it)
                                this.$set(item,'fatherId',it.id)
                            }
                        })
                    })

                    if(!bool){
                        this.year = 1
                    }

                    console.log(this.options2)

                })
                /*有id  走修改   没有id 走添加*/

                console.log(this.numN,this.id,this.childId,this.fatherId)
                console.log(this.options2,this.options2[this.year].fatherId)

                if(this.id){
                    let update=[
                        `UPDATE product_programme_detail set 'component_count'='${this.num}',component_id='${this.options[this.value].id}' where id=${this.id} `,
                        `UPDATE product_programme_detail set 'component_count'='${this.num}',component_id='${this.options2[this.year].fatherId}' where id=${this.fatherId} `,
                        `UPDATE product_programme_detail set 'component_count'='${this.numN}',component_id='${this.options2[this.year].childId}' where id=${this.childId} `
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
                    const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id') VALUES
            ('${localStorage.productId}','${localStorage.machineId}','14','${this.options[this.value].id}','${this.num}','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
            ('${localStorage.productId}','${localStorage.machineId}','${this.options2[this.year].category_id}','${this.options2[this.year].fatherId}','${this.num}','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
            ('${localStorage.productId}','${localStorage.machineId}','${this.options2[this.year].category_id}','${this.options2[this.year].childId}','${this.numN}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
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
                                    if(item.category_id==14){
                                        this.id=item.id
                                    }
                                    if(item.category_id==18&&(item.software_FC==null || item.software_FC==undefined || item.software_FC=="")){
                                        this.fatherId=item.id
                                    }
                                    if(item.category_id==18&&item.software_FC){
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

                // 获取cpu的激活数
                const cpieK = ` select component_count from product_programme_detail detail
                 join component_other other on other.category_id = detail.category_id and other.id=detail.component_id
                 join component_base_info info on info.id=other.base_info_id
                 join relation_cpu_activation relation on relation.base_info_id=info.id
                 where detail.category_id=11 AND detail.product_id='${localStorage.productId}' AND detail.solution_id=${localStorage.solutionId} and detail.template_id='${localStorage.templateId}'and detail.machine_id='${localStorage.machineId}' and relation.activation_type=0 and relation.activation_unit=0`;
                console.log(cpieK)
                new Promise(function (resolve, reject) {
                    // 数据库查询
                    vm.$db.all(cpieK, (err, res) => {
                        if (err) {
                            resolve(null);
                        } else {
                            resolve(res);
                        }
                    });
                }).then(res => {
                    console.log(res)
                    vm.numN=res[0].component_count;
                });
            })
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
        padding: 20px;
        /*background: #cccccc;*/
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
        .wdI{
            width: 106px;

        }
        li{
            padding-left: 20px;
        }
    }
</style>
