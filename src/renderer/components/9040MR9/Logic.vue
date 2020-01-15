<template>
    <!--逻辑分区-->
    <div class="wrap">
        <div class="font-style content-label">{{$t('LogicalPartition.lists.LogicalPartition.title')}}</div>
        <div class="wrap-box">
            <div class="wrap-slider">
                <span>{{$t('LogicalPartition.lists.LogicalPartition.content1')}}：</span>
                <el-input class="sel marSel" v-model="valueCount"  maxlength="3" @change="selectSlider(valueCount)"    @keyup.native="changeNum()" :placeholder="$store.state.info_language?'please input(1~250)':'请输入(1~250)'"></el-input>
            </div>
        </div>

        <!--虚拟化软件-->
        <div class="font-style content-label">{{$t('LogicalPartition.lists.VirtualizationSoftware.title')}} - PowerVM</div>
        <!--{{$t('LogicalPartition.lists.VirtualizationSoftware.title')}}-->
        <ul class="inpList for-main">
            <li>
                <el-select class="selStyle"  v-model="value" placeholder="请选择"size="mini" @change="selectNameAdd(value)">
                    <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="$store.state.info_language?item.software_des:item.software_desCN"
                            :value="index">
                    </el-option>
                </el-select>
            </li>
            <p>*</p>
            <li>
                <el-input class="sel" size="mini" v-model="optionCount" disabled="disabled"    placeholder=""></el-input>
                <span style="margin-left: 50px">{{$t('LogicalPartition.lists.VirtualizationSoftware.content1')}}：</span>
                <el-select  class="other-select-one  sel"  placeholder="请选择" v-model="valueSele" size="mini" @change="selectNameAdd(valueSele)">
                    <el-option
                            v-for="(it,ind) in yearsDate"
                            :key="ind"
                            :label="it.year"
                            :value="ind">
                    </el-option>
                </el-select>
            </li>
        </ul>

        <!--主要操作系统-->
        <div class="font-style content-label">{{$t('OperatingSystem.lists.MainOperatingSystem.title')}} - PowerVC</div>
        <!--{{$t('OperatingSystem.lists.MainOperatingSystem.title')}}-->
        <!--PowerVC -->
        <ul class="inpList for-main">
            <li>
                <el-select v-model="valueVM"  size="mini" @change="getOperation(false)" :disabled="disab">
                    <el-option
                            v-for="(item,index) in optionsVM"
                            :key="index"
                            :label="$store.state.info_language?item.softwareName:item.softwareNameCN"
                            :value="index">
                    </el-option>
                </el-select>
            </li>
            <li v-show="valueVM != 0" class="wdI">{{$t('OperatingSystem.lists.MainOperatingSystem.content1')}}：</li>
            <li v-show="valueVM != 0">
                <el-select v-model="numN" placeholder="" class="sel" @change="getOperation" disabled >
                    <el-option
                            v-for="item in numN"
                            :key="item"
                            :value="item">
                    </el-option>
                </el-select>
            </li>
            <li v-show="valueVM != 0" class="wdI">{{$t('OperatingSystem.lists.MainOperatingSystem.content2')}}：</li>
            <li v-show="valueVM != 0">
                <el-select v-model="year" placeholder="" class="sel" @change="getOperation(true)"  size="mini" >
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

<script scoped>
    export default {
        name: 'Logic',
        data() {
            return {
                options: [],
                yearsDate: [],
                valueCount: 1,
                valueSele: '',
                value: 0,
                frontHarddiskId:'',
                childId:'',
                fatherId:'',
                optionCount:10,
                compomemtId:'',
                comId:'',
                disab:false,

                optionsVM: [],
                options2: [],
                valueVM:0,
                year:'',
                num:1,
                numN:10,
                id:'',
                childIdVM:'',
                fatherIdVM:'',
            };
        },

        methods: {

            /*输入弹性激活容量时进行的数量校验*/
            changeNum() {

                this.valueCount = this.valueCount.replace( /[^\.\d]/g, '');
                this.valueCount = this.valueCount.replace('.', '');

            },

            async  getDatas() {
                console.log('到底啥时候调用1111111111')
                /*逻辑分区数据获取*/
                const SQL_LJ = `select cs.* from component_software cs where id in (
select ss.carry_software_id from software_software ss
join component_software cs on cs.id=ss.choice_software_id where cs.category_id=14
) and cs.category_id=13 and productId=2`
                await new  Promise((resolve,reject) => {
                    this.$db.all(SQL_LJ, (err, res) => {
                        if(res.length>0){
                            resolve([res,err])
                        }
                    })
                }).then(([res,err])=> {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err
                        });
                    } else {
                        console.log('逻辑获取',res);
                        res.forEach((item,i)=>{
                            if(item.category_id==13){
                                this.compomemtId=item.id
                            }
                        })
                    }
                })

                /*原始数据获取*/
                const SQL_FIRST = `select  cs.id,software_des , years,software_desCN  from component_software cs
join product_software ps on cs.id=ps.software_id  where cs.category_id=21 and product_id=${localStorage.productId}`
                await new Promise((resolve, reject) => {
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
                        this.options = res;
                        console.log("options",this.options);
                    }
                })

                /*维保数据获取*/
                const SQL_WB = `select * from component_software software where id in(select carry_software_id from software_software where choice_software_id in (select
id from component_software where category_id=21 and productId=2)) and software_type=3
    UNION
    select * from component_software where id in(
    select carry_software_id from software_software where choice_software_id in (select
id from component_software where category_id=21 and productId=2) and software_type=3)`

                await new Promise((resolve,reject)=>{
                    this.$db.all(SQL_WB, (err, res) => {
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
                        console.log("维保res",res);
                        res.forEach(item=>{
                            if(item.software_FC){
                                this.yearsDate.push({
                                    category_id:item.category_id,
                                    childId:item.id,
                                    year:item.years
                                })
                            }
                        });
                        this.yearsDate.forEach((item,i)=>{
                            res.forEach(it=>{
                                if((it.software_FC==null || it.software_FC==undefined || it.software_FC=="")&&item.year==it.years){
                                    this.$set(item,'fatherId',it.id)
                                }
                            })
                        });
                        console.log('yearsDate',this.yearsDate)
                        this.valueSele = this.yearsDate[0].year;
                    }
                })

                /*获取数据库更新*/
                const SQL_UP = `select detail.*,cs.id soft_id,cs.years,cs.software_FC from product_programme_detail detail ,component_software cs
                    where solution_id='${localStorage.solutionId}'
                    and template_id='${localStorage.templateId}'
                    and  product_id='${localStorage.productId}'
                    and machine_id='${localStorage.machineId}'
                    and detail.category_id IN (13,21) and cs.category_id=detail.category_id
                    and cs.id=detail.component_id
                    UNION
                    select temptable.*,temptable.id soft_id,component_software.years,component_software.software_FC from component_software,(select * from product_programme_detail where component_id in(select tn.id from (select * from component_software where id in (
                    select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id in(select detail.component_id from product_programme_detail detail ,component_software cs
                    where solution_id= '${localStorage.solutionId}'
                    and template_id='${localStorage.templateId}'
                    and detail.category_id=21
                    and product_id='${localStorage.productId}'
                    and cs.category_id=detail.category_id
                    and machine_id='${localStorage.machineId}'
                    and cs.id=detail.component_id)
                    )and software_type=3) tn) and  category_id=19) temptable
                    where temptable.component_id=component_software.id`

                console.log(SQL_UP)
                await this.$db.all(SQL_UP, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err
                        });
                    } else {
                        console.log("up_res",res,this.yearsDate);
                        res.forEach((item,i)=>{
                            this.yearsDate.forEach((em,index)=>{
                                if(em.childId==item.component_id){
                                    this.childId=item.id;
                                    this.valueSele=index;
                                }
                                if(item.category_id ==21) {
                                    this.optionCount = item.component_count;
                                    this.frontHarddiskId=item.id
                                }
                                if(item.category_id==19&&(item.software_FC==null || item.software_FC==undefined || item.software_FC=="")){
                                    this.fatherId=item.id
                                }
                                if(item.category_id==19&&item.software_FC){
                                    this.childId=item.id
                                }
                                if(item.category_id ==13){
                                    this.comId = item.id
                                    this.valueCount = item.component_count;
                                    console.log('comId',this.comId)
                                }
                            })
                        });
                    }
                });

                /*cpu激活数获取*/
                const SQL_COUNT = ` select component_count from product_programme_detail detail
                 join component_other other on other.category_id = detail.category_id and other.id=detail.component_id
                 join component_base_info info on info.id=other.base_info_id
                 join relation_cpu_activation relation on relation.base_info_id=info.id
                 where detail.category_id=11 AND detail.product_id='${localStorage.productId}' AND detail.solution_id=${localStorage.solutionId} and detail.template_id='${localStorage.templateId}'and detail.machine_id='${localStorage.machineId}' and relation.activation_type=0 and relation.activation_unit=0`
                await  this.$db.all(SQL_COUNT, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err
                        });
                    } else {
                    console.log(res)

                    this.optionCount = res[0].component_count;

                    }
                    console.log(this.frontHarddiskId)
                    if(!this.frontHarddiskId){
                        this.selectNameAdd(0);
                    }

                    if(!this.comId){
                        this.selectSlider(0);
                    }
                });

            },

            //逻辑分区
            selectSlider(index) {

                if(index>250){
                    this.valueCount = 250;
                }

                if(index<1){
                    this.valueCount = 1;
                }

                console.log(this.valueCount);

                if (this.comId) {
                    console.log('ewewewe',this.comId)
                    let updateSql= `UPDATE product_programme_detail set 'component_count'='${this.valueCount}',component_id='${this.compomemtId}' where id=${this.comId}`
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log('修改失败');
                        } else {
                            console.log('修改成功');
                        }
                    });
                } else {
                    const time = new Date().getTime();
                    const SQL = `INSERT INTO product_programme_detail
                                 ('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id')VALUES
                                 ('${localStorage.productId}','${localStorage.machineId}','13','${this.compomemtId}','${this.valueCount}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
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
                                                    and product_id='${localStorage.productId}'
                                                    and machine_id='${localStorage.machineId}'
                                                    and solution_id='${localStorage.solutionId}'`;
                                this.$db.all(selectSql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '系统错误',
                                            desc: err,
                                        });
                                        return;
                                    }
                                    console.log('res)))',res)
                                    this.comId = res[0].id;
                                    console.log('sdsdsd',res, this.comId)
                                });
                            }
                        }
                    });
                }
            },

            //虚拟化软件
            selectNameAdd(index) {
                console.log(this.optionCount)
                if (this.frontHarddiskId) {
                    let updateSql=[
                        `UPDATE product_programme_detail set 'component_count'='1',component_id='${this.options[this.value].id}' where id=${this.frontHarddiskId} `,
                        `UPDATE product_programme_detail set 'component_count'='1',component_id='${this.yearsDate[index].fatherId}' where id=${this.fatherId} `,
                        `UPDATE product_programme_detail set 'component_count'='${this.optionCount}',component_id='${this.yearsDate[index].childId}' where id=${this.childId}`
                    ]
                    updateSql.forEach(item=>{
                        this.$db.run(item, (err, res) => {
                            if (res) {
                                console.log('修改失败');
                            } else {
                                console.log('修改成功');
                            }
                        });
                    })
                } else {
                    const time = new Date().getTime();
                    const SQL = `INSERT INTO product_programme_detail
                                 ('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id')VALUES
                                 ('${localStorage.productId}','${localStorage.machineId}','21','${this.options[this.value].id}','${this.optionCount}','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
                                 ('${localStorage.productId}','${localStorage.machineId}','${this.yearsDate[index].category_id}','${this.yearsDate[index].fatherId}','1','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
                                 ('${localStorage.productId}','${localStorage.machineId}','${this.yearsDate[index].category_id}','${this.yearsDate[index].childId}','1','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
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
                                                    and product_id='${localStorage.productId}'
                                                    and machine_id='${localStorage.machineId}'
                                                    and solution_id='${localStorage.solutionId}'`;
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
                                        if(item.category_id==21){
                                            this.frontHarddiskId = res[0].id;
                                        }else if(item.category_id==19) {
                                            this.fatherId = res[1].id;
                                            this.childId = res[2].id;
                                        }
                                    })

                                });
                            }
                        }
                    });
                }
            },

            /*PowerVC 获取数据*/
            async setrabbet() {
                let than=this
                /*获取操作系统下拉数据*/
                const SQL = `SELECT * FROM component_software where id in(158,159)`;
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
                    res.unshift({
                        id:0,
                        software_desCN:'请选择',
                        software_des:'please choice'
                    })
                    let arr =[...res];
                    console.log(arr)
                    for(let i =0; i<arr.length;i++){
                        let obj = {
                            categoryId: arr[i].category_id,
                            id: arr[i].id,
                            softwareNameCN: arr[i].software_desCN,
                            softwareName: arr[i].software_des,
                        }

                        this.optionsVM.push(obj);
                        console.log(this.optionsVM)
                    }
                    console.log(this.optionsVM)
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
                const SQLYear= `select  id,category_id,years,software_FC from component_software where id in (
select cs.id from software_software ss
join component_software cs on cs.id=ss.carry_software_id
where cs.productId=2 and ss.choice_software_id in(158,159) and years !='Null'  and years !=''
)   and category_id=20`

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
                                console.log(it)
                                this.$set(item,'fatherId',it.id)
                            }
                        })
                    })
                    this.year = this.options2[0].year
                    console.log(this.options2,this.optionsVM,this.year)
                })

                /*获取 product_programme_detail  里的数据*/
                const SQLData=`select detail.*,cs.id soft_id,cs.years,cs.software_FC from product_programme_detail detail ,component_software cs
        where solution_id='${localStorage.solutionId}'
        and template_id='${localStorage.templateId}'
        and product_id='${localStorage.productId}'
        and machine_id='${localStorage.machineId}'
        and detail.category_id=42
        and cs.category_id=detail.category_id
        and cs.id=detail.component_id
        UNION
        select temptable.*,temptable.id soft_id,component_software.years,component_software.software_FC from component_software,(select * from product_programme_detail where component_id in(select tn.id from (select * from component_software where id in (
        select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id in(select detail.component_id from product_programme_detail detail ,component_software cs
        where solution_id= ${localStorage.solutionId}
        and template_id=${localStorage.templateId}
        and product_id='${localStorage.productId}'
        and machine_id='${localStorage.machineId}'
        and detail.category_id=42
        and cs.category_id=detail.category_id
        and cs.id=detail.component_id)
        )and software_type=3) tn) and  category_id=20) temptable
        where temptable.component_id=component_software.id`
                /*原始数据获取*/
                const SQL_FIRST = `select distinct cs.id, software_des,software_desCN,years from component_software cs left join software_software ss on cs.id=ss.choice_software_id where cs.id in (134,135)`
                console.log(SQLData)
                await this.$db.all(SQLData, (err, res) => {
                    console.log(res)

                    if (res.length<1) {
                        //库里面没有数据的话走这个
                        // this.$logger(err);
                    } else {
                        let numA=''
                        console.log(res,11111)
                        res.forEach((item,index)=>{
                            if(item.category_id==42){
                                this.id=item.id
                                this.optionsVM.forEach((it,i)=>{
                                    if(it.id==item.component_id) {
                                        this.valueVM=i
                                        console.log(this.valueVM)
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

                            if(item.category_id==20){
                                if(item.software_FC==null || item.software_FC==undefined || item.software_FC==''){
                                    numA=item.component_id
                                    this.fatherIdVM=item.id
                                    console.log(numA)
                                }else{
                                    this.childIdVM=item.id
                                }
                            }
                        })
                    }
                })
            },

            /*PowerVC 插入数据*/
            async getOperation(bool){
                if(this.valueVM != 0){
                    console.log(this.valueVM,this.optionsVM[this.valueVM].id,this.id,this.childIdVM,this.fatherIdVM)
                    const SQLYear= `select distinct id,category_id,years,software_FC from component_software where id in (
    select cs.id from software_software ss
    join component_software cs on cs.id=ss.carry_software_id
    where cs.productId=2 and ss.choice_software_id=${this.optionsVM[this.valueVM].id}) and software_type=3`

                    console.log(SQLYear)
                    console.log(this.optionsVM[this.valueVM].id)
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
                            this.year = 0
                        }

                        console.log(this.options2)

                    })
                    /*有id  走修改   没有id 走添加*/

                    console.log(this.optionsVM)
                    console.log(this.options2,this.options2[this.year].fatherId)

                    if(this.id){
                        let update=[
                            `UPDATE product_programme_detail set 'component_count'='${this.num}',component_id='${this.optionsVM[this.valueVM].id}' where id=${this.id} `,
                            `UPDATE product_programme_detail set 'component_count'='${this.num}',component_id='${this.options2[this.year].fatherId}' where id=${this.fatherIdVM} `,
                            `UPDATE product_programme_detail set 'component_count'='${this.numN}',component_id='${this.options2[this.year].childId}' where id=${this.childIdVM} `
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
                ('${localStorage.productId}','${localStorage.machineId}','42','${this.optionsVM[this.valueVM].id}','${this.num}','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
                ('${localStorage.productId}','${localStorage.machineId}','${this.options2[this.year].category_id}','${this.options2[this.year].fatherId}','${this.num}','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
                ('${localStorage.productId}','${localStorage.machineId}','${this.options2[this.year].category_id}','${this.options2[this.year].childId}','${this.numN}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
                        //添加三条数据
                        this.$db.run(updateSql, (err, res) => {
                            if (err) {
                                console.log('添加失败');
                            } else {
                                console.log('添加成功');
                                const selectSql = `select cs.*,detail.id detail_id from component_software cs
JOIN product_programme_detail detail on detail.component_id=cs.id and detail.category_id=cs.category_id
where cs.id in ( select component_id from product_programme_detail where seq_Key=${time} and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}')`;
                                console.log(selectSql)
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
                                        if(item.category_id==42){
                                            this.id=item.detail_id
                                        }
                                        if(item.category_id==20&&(item.software_FC==null || item.software_FC==undefined || item.software_FC=="")){
                                            this.fatherIdVM=item.detail_id
                                        }
                                        if(item.category_id==20&&item.software_FC){
                                            this.childIdVM=item.detail_id
                                        }
                                    })
                                    console.log(res,this.fatherIdVM,this.childIdVM,this.id)
                                })
                            }
                        })
                    }
                }else{
                    const del= `delete from product_programme_detail where id in(${this.id},${this.fatherIdVM},${this.childIdVM})`
                    console.log(del)
                    this.$db.run(del,(err,res)=>{
                        if(err){
                            console.log('删除失败')
                        }else{
                            console.log('删除成功')
                            this.id = '';
                            this.fatherIdVM = '';
                            this.childIdVM = '';
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


                const Operation=`select * from product_programme_detail where category_id=14 and component_id in (155,156) and product_id='${localStorage.productId}' AND solution_id=${localStorage.solutionId} and template_id='${localStorage.templateId}'and machine_id='${localStorage.machineId}' `
                console.log(Operation)
                // 数据库查询
                vm.$db.all(Operation, (err, res) => {
                    if (err) {
                        console.log('查询失败')
                    } else {
                        console.log('查询成功')
                        console.log(res.length)
                        if(res.length>0){
                            const del= `delete from product_programme_detail where id in(${vm.id},${vm.fatherIdVM},${vm.childIdVM})`
                            console.log(del)
                            vm.$db.run(del,(err,res)=>{
                                if(err){
                                    console.log('删除失败')
                                    vm.disab = true;
                                }else{
                                    console.log('删除成功')
                                    vm.id = '';
                                    vm.fatherIdVM = '';
                                    vm.childIdVM = '';
                                    vm.valueVM = 0;
                                    vm.disab = true;
                                }
                            })
                        }else{
                            vm.disab = false;
                        }
                    }
                });
            })
        },

        beforeRouteLeave(to,from,next){
            if(this.options.length==1&&this.options[0].id==undefined ){
                this.selectNameAdd(value);
            }
            next()
        },

        created() {
            this.getDatas();
            this.setrabbet();
        }
    };
</script>

<style scoped lang="scss">
    * {
        list-style: none;
        box-sizing: border-box;
    }

    .wrap {
        width: 100%;
        height: 100%;
        padding: 20px;

        div {
            margin-top: 16px;
        }
    }

    .font-style {
        width: 100%;
        padding: 20px;
        /*background: #cccccc;*/
    }

    .wrap-box {
        width: 100%;
        line-height: 50px;
        margin-left: 16px;

        .inp {
            width: 120px;
            margin-left: 12px;
        }
    }
    .el-input-number__decrease{
        display: none !important;
    }
    .sel{
        width: 151px;
    }
    .marSel{
        margin-left: 20px;
    }
    .selStyle{
        width: 400px;
    }

    .inpList{
        display: flex;
        align-items: center;
        margin: 20px 0px;
        .wdI{
            width: 106px;
        }
        li{
            padding-left: 20px;
        }
    }
</style>
