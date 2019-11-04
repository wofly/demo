<template>
    <!--逻辑分区-->
    <div class="wrap">
        <div class="font-style"><p>{{$t('LogicalPartition.lists.LogicalPartition.title')}}</p></div>
        <div class="wrap-box"><span>{{$t('LogicalPartition.lists.LogicalPartition.content1')}}：</span>
            <div class="wrap-slider">
                <el-slider v-model="valueCount"
                         :show-tooltip="false"
                         style="width: 500px"
                         :max="250"
                         :min="1"
                         @change="selectSlider(value)"
                ></el-slider>
                <el-input class="sel marSel" v-model="valueCount" disabled="disabled"   placeholder=""></el-input>
            </div>
        </div>
        <div class="font-style"><p>{{$t('LogicalPartition.lists.VirtualizationSoftware.title')}}</p></div>
        <ul class="inpList for-main">
            <li>
                <el-select class="selStyle"  v-model="value" placeholder="请选择"size="mini" @change="selectNameAdd(value)">
                    <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.software_des"
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
                comId:''
            };
        },

        methods: {
          async  getDatas() {
                /*逻辑分区数据获取*/
                const SQL_LJ = `SELECT*FROM component_software where id in(select carry_software_id from software_software where choice_software_id in(128,129,131,132)) and categroy_id =13`
                /*原始数据获取*/
                const SQL_FIRST = `select  cs.id,software_des , years       from component_software cs  join product_software ps on cs.id=ps.software_id

                where ps.software_id=133 and product_id=1 `

                /*cpu激活数获取*/
                const SQL_COUNT = `select component_count from product_programme_detail where categroy_id=11
                 AND product_id='${localStorage.productId}'
                 and template_id='${localStorage.templateId}'
                 and machine_id='${localStorage.machineId}'
                 and solution_id='${localStorage.solutionId}'`
              /*获取数据库更新*/
                const SQL_UP = `select detail.*,cs.id soft_id,cs.years,cs.software_FC from product_programme_detail detail ,component_software cs
                    where solution_id='${localStorage.solutionId}'
                    and template_id='${localStorage.templateId}'
                    and  product_id='${localStorage.productId}'
                    and machine_id='${localStorage.machineId}'
                    and detail.categroy_id IN (13,21)
                    and product_id=1 and cs.categroy_id=detail.categroy_id
                    and cs.id=detail.component_id
                    UNION
                    select temptable.*,temptable.id soft_id,component_software.years,component_software.software_FC from component_software,(select * from product_programme_detail where component_id in(select tn.id from (select * from component_software where id in (
                    select carry_software_id from software_software ss left join component_software cs on cs.id=ss.choice_software_id where choice_software_id in(select detail.component_id from product_programme_detail detail ,component_software cs
                    where solution_id= '${localStorage.solutionId}'
                    and template_id='${localStorage.templateId}'
                    and detail.categroy_id=21
                    and product_id='${localStorage.productId}'
                    and cs.categroy_id=detail.categroy_id
                    and machine_id='${localStorage.machineId}'
                    and cs.id=detail.component_id)
                    )and software_type=3) tn) and  categroy_id=19) temptable
                    where temptable.component_id=component_software.id`
                /*维保数据获取*/
                const SQL_WB = `select * from component_software software where id in(select carry_software_id from software_software where choice_software_id=133) and software_type=3
                    UNION
                    select * from component_software where id in(
                    select carry_software_id from software_software where choice_software_id in ( select id from component_software software where id in(select carry_software_id from software_software where choice_software_id=133) and software_type=3))`
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
                            if(item.categroy_id==13){
                                this.compomemtId=item.id
                            }
                        })
                    }
                })
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
                                    categroy_id:item.categroy_id,
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
                                if(item.categroy_id ==21) {
                                    this.optionCount = item.component_count;
                                    this.frontHarddiskId=item.id
                                }
                                if(item.categroy_id==19&&(item.software_FC==null || item.software_FC==undefined || item.software_FC=="")){
                                    this.fatherId=item.id
                                }
                                if(item.categroy_id==19&&item.software_FC){
                                    this.childId=item.id
                                }
                                if(item.categroy_id ==13){
                                    this.comId = item.id
                                    this.valueCount = item.component_count;
                                    console.log('comId',this.comId)
                                }
                            })
                        });
                    }
                });
              await  this.$db.all(SQL_COUNT, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err
                        });
                    } else {
                        for (let i = 0; i < res.length; i++) {
                            this.optionCount = res[i].component_count;
                        }
                    }
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
                                 ('product_id','machine_id','categroy_id','component_id','component_count','seq_Key','solution_id','template_id')VALUES
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
                                 ('product_id','machine_id','categroy_id','component_id','component_count','seq_Key','solution_id','template_id')VALUES
                                 ('${localStorage.productId}','${localStorage.machineId}','21','${this.options[this.value].id}','${this.optionCount}','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
                                 ('${localStorage.productId}','${localStorage.machineId}','${this.yearsDate[index].categroy_id}','${this.yearsDate[index].fatherId}','1','${time}','${localStorage.solutionId}','${localStorage.templateId}'),
                                 ('${localStorage.productId}','${localStorage.machineId}','${this.yearsDate[index].categroy_id}','${this.yearsDate[index].childId}','1','${time}','${localStorage.solutionId}','${localStorage.templateId}')`;
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
                                        if(item.categroy_id==21){
                                            this.frontHarddiskId = res[0].id;
                                        }else if(item.categroy_id==19) {
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
        },
        beforeRouteEnter(from,to,next){
            next(vm=>{
                vm.$emit('comup',from.query.id)
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
        padding: 8px;
        background: #cccccc;
    }

    .wrap-box {
        width: 100%;
        height: 200px;
        line-height: 50px;
        .wrap-slider {
            margin-left: 100px;
            display: flex;
            align-items: center;

        }
        .inp {
            width: 120px;
            margin-left: 12px;
        }
    }
    .el-input-number__decrease{
        display: none !important;
    }
    .sel{
        width: 95px;
    }
    .marSel{
        margin-left: 20px;
    }
    .selStyle{
        width: 400px;
    }
    .inpList {
        display: flex;
        p{
            margin-top: 20px;
        }
        li {
            .sel{
                width: 100px;
            }
        }
    }
</style>
