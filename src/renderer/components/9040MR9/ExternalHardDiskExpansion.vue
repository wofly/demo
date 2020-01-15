<template>
    <!------------------------------------------------扩展柜硬盘-------------------------------------------------->
    <div class="other">
        <div class="config">
            <p class="title content-label" v-if="addHardDisk.length>0">
                <span class="config-title">{{$t('ExternalHardDiskExpansion.ExpansionCabinetHardDisk')}}</span>
            </p>
            <div class="disk modify for-main">
                <!-------------------------------------------24盘 数据---------------------------------------------------->
                <div v-for="(it,i) in addHardDisk"  :key="i" class="disk-on">
                    <div v-for="(ite,ind) in it.typeAll" :key="ind">
                        <el-select size="mini"
                                   v-model="ite.media_type"
                                   :placeholder="$store.state.info_language?'please choose':'请选择'"
                                   class="sel"
                                   @visible-change="hardDiskTypeUpd(i,ind)"
                                   @change="hardDiskTypeBtn(i,ind)">
                            <el-option v-for="(item,index) in diskapli"
                                       :key="index"
                                       :label="item.en"
                                       :value="item.media_type"
                                       :disabled="item.disabled">
                            </el-option>
                        </el-select>

                        <el-select size="mini"
                                   v-model="ite.diskid"
                                   :placeholder="$store.state.info_language?'please choose':'请选择'"
                                   class="other-select-two"
                                   @change="hardDiskModelSet(i,ind,ite.diskid,1)"
                                   @visible-change="hardDiskModelBtn($event,i,ind)">
                            <el-option v-for="(item,index) in ite.DiskAll"
                                       :key="index"
                                       :label="$store.state.info_language?item.description_en:item.description"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                        <p class="icon">*</p>
                        <el-select size="mini" v-model="ite.sum"
                                   :placeholder="$store.state.info_language?'please choose':'请选择'"
                                   class="sel"
                                   @change="hardDiskModelSet(i,ind,ite.diskid,ite.sum)"
                                   @visible-change="optionalValue($event,i,ind)">
                            <el-option v-for="item in ite.sumAll"
                                       :key="item"
                                       :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                        <el-button size="mini" type="info" icon="el-icon-close" circle @click="deleteHardDisk(i,ind)"   class="dele" ></el-button>

                        <div v-for="dl in ite.hardDiskModelData" v-if="ite.hardDiskModel==dl.id" :key="dl.language">
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

                    <div>
                        <el-button size="mini" icon="el-icon-plus" @click="addHardDiskBtn(i)" ></el-button>
                        <span class="add-cables" >{{$t('ExternalHardDiskExpansion.IncreaseTheHardDisk')}}</span>

                    </div>
                    <div>
                        <br>
                        {{$t('Processor.lists.CPUconfiguration.content1')}}:  {{it.numAll}}/{{it.disk_count*it.num}}
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    /**
     * 外部扩展柜
     *
     * @date 2019/10/11
     * @author yuwenqiang
     */

    export default {
        name: "ExternalHardDiskExpansion",
        props:['eh2s','diskapli','DiskAll','getDiskAll','ehs2DeSum'],//eh2s的数据componentId 和category_id  //硬盘的可选类型 // 硬盘的展示数据  获取硬盘的总数量  获取ehs2的总数量

        data(){
            return{
                /*------------------24盘位------------------------------*/
                // 外层循环数组
                addHardDisk:[],
            }
        },

        methods:{
            //更改硬盘之前，要查看硬盘的类型还有没有空，没有的话就给禁用掉
            hardDiskTypeUpd(ind,index){
                let num=0,sum=0 // ssd hdd 的值
                this.addHardDisk[ind].typeAll.forEach((item,i)=>{
                    if(item.media_type==0&&i!=index){
                        num+=item.sum

                    }
                    if(item.media_type==1&&i!=index){
                        sum+=item.sum
                    }
                })
                let  part=this.addHardDisk[ind].disk_count/this.addHardDisk[ind].modeIdType//每份占用的数
                let numA=Math.ceil(num/part) //ssd占用的份数
                let sumB=Math.ceil(sum/part) //hdd占用的份数
                console.log(numA,sumB,this.addHardDisk[ind].modeIdType,this.addHardDisk[ind].num)
                console.log(this.addHardDisk[ind].typeAll[this.addHardDisk[ind].typeAll.length-1].sum,index,this.addHardDisk[ind].typeAll.length-1)
                if(this.addHardDisk[ind].typeAll[this.addHardDisk[ind].typeAll.length-1].sum===''&&index!=this.addHardDisk[ind].typeAll.length-1){
                    this.$emit('getDiskUpa',[0,true])
                    this.$emit('getDiskUpa',[1,true])
                    return
                }
                if(numA+sumB>=this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num){
                    if(num==numA*part&&this.addHardDisk[ind].typeAll.length>1){
                        this.$emit('getDiskUpa',[0,true])
                        console.log('model分为了'+this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num+'份,ssd占用了'+num+'份，hdd占用了'+sum,1)
                    }else{
                        this.$emit('getDiskUpa',[0,false])
                        console.log('model分为了'+this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num+'份,ssd占用了'+num+'份，hdd占用了'+sum,1)
                    }
                    if(sum==sumB*part&&this.addHardDisk[ind].typeAll.length>1){
                        this.$emit('getDiskUpa',[1,true])
                        console.log('model分为了'+this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num+'份,ssd占用了'+num+'份，hdd占用了'+sum,2)
                    }else{
                        this.$emit('getDiskUpa',[1,false])
                        console.log('model分为了'+this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num+'份,ssd占用了'+num+'份,hdd占用了'+sum,2)
                    }
                }else{
                    this.$emit('getDiskUpa',[0,false])
                    this.$emit('getDiskUpa',[1,false])
                    console.log('model分为了'+this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num+'份,ssd占用了'+num+'份,hdd占用了'+sum,3)
                }

            },
            //更改硬盘的类型
            hardDiskTypeBtn(ind,index){
                //console.log('删除失败',this.addHardDisk,ind,index)
                //如果为1的话，数组长度大于一就不可以改，要不然就可以改，删掉库里的数据
                // if(this.addHardDisk[ind].modeIdType==1){
                //     if(this.addHardDisk[ind].typeAll.length>1&&index==0){
                //         this.addHardDisk[ind].typeAll[index].media_type=this.addHardDisk[ind].typeAll[0].media_typeBei
                //         return console.log('model为1，并且不止一个,首页不能改')
                //     }
                //     if(this.addHardDisk[ind].typeAll.length>1&&this.addHardDisk[ind].typeAll[index].media_type!=this.addHardDisk[ind].typeAll[0].media_type){
                //         this.addHardDisk[ind].typeAll[index].media_type=this.addHardDisk[ind].typeAll[0].media_type
                //         this.addHardDisk[ind].typeAll[index].media_typeBei=this.addHardDisk[ind].typeAll[0].media_type
                //         return console.log('model为1，并且不止一个')
                //     }
                // }
                let num=0,sum=0 // ssd hdd 的值
                this.addHardDisk[ind].typeAll.forEach((item,i)=>{
                    if(item.media_type==0&&i!=index){
                        num+=item.sum*1

                    }
                    if(item.media_type==1&&i!=index){
                        sum+=item.sum*1
                    }
                })
               let  part=this.addHardDisk[ind].disk_count/this.addHardDisk[ind].modeIdType//每份占用的数
               let numA=Math.ceil(num/part) //ssd占用的份数
               let sumB=Math.ceil(sum/part) //hdd占用的份数
                console.log(numA,sumB,this.addHardDisk[ind].modeIdType,this.addHardDisk[ind].num)
                if(numA+sumB>=this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num){
                    if(num>=numA*part){
                        this.addHardDisk[ind].typeAll[index].media_type=1
                        return console.log('model分为了'+this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num+'份,ssd占用了'+num+'份，hdd占用了'+sum,1)
                    }
                    if(sum>=sumB*part){
                        this.addHardDisk[ind].typeAll[index].media_type=0
                        return console.log('model分为了'+this.addHardDisk[ind].modeIdType*this.addHardDisk[ind].num+'份,ssd占用了'+num+'份，hdd占用了'+sum,2)
                    }
                }
                //判断数量有没有 有的话就更改或添加
                if(this.addHardDisk[ind].typeAll[index].upId){
                    let deleteSql = `DELETE FROM product_programme_detail WHERE id = ${this.addHardDisk[ind].typeAll[index].upId}`;
                    this.$db.run(deleteSql,(err,res)=>{
                        if(err){
                            console.log('删除失败')
                        }else{
                            console.log('删除成功')
                            this.addHardDisk[ind].typeAll[index].media_typeBei=this.addHardDisk[ind].typeAll[index].media_type//备用的硬盘类型的id

                            this.addHardDisk[ind].typeAll[index].diskid=''//硬盘的id
                            this.addHardDisk[ind].typeAll[index].sum='' //数量
                            this.addHardDisk[ind].typeAll[index].upId='' //id
                            /*计算 已用的插槽数 和容量*/
                            this.getDiskAll()
                            //获取各个硬盘扩展柜里的硬盘的数量
                            this.getDiskAllSum(ind)
                            //获取ehs2的总数
                            this.updateEhs2(ind)
                        }
                    })
                }
            },
            /*将 选中数据，存储到 新数组中*/
            hardDiskModelBtn(bool,ind,index){
                console.log(bool,this.addHardDisk[ind].typeAll[index].DiskAll,this.DiskAll)
                if(bool){
                    if(this.addHardDisk[ind].typeAll[index].media_type===''){
                        this.addHardDisk[ind].typeAll[index].DiskAll=[]
                        return console.log('没有选model')
                    }
                    let num=0
                    this.addHardDisk[ind].typeAll.forEach((item,i)=>{//disk_count
                        if(i!=index){
                            num+=item.sum*1
                        }
                    })
                    console.log(num,this.addHardDisk[ind].disk_count,this.addHardDisk[ind].num)
                    if(num>=this.addHardDisk[ind].disk_count*this.addHardDisk[ind].num){
                        return this.addHardDisk[ind].typeAll[index].DiskAll=[] //如果数量大于或等于就说明占满了，不能在选了。
                    }

                    let gettime= new Date().getTime() //获取现在的时间戳
                    this.addHardDisk[ind].typeAll[index].DiskAll = this.DiskAll.filter(item=>{
                        if(this.$store.state.showWithdraw==0 &&  item.time<gettime){
                            return false
                        }
                        if(item.disc_interface!=this.addHardDisk[ind].disc_interface){
                            console.log(1111,item)
                            return false
                        }
                        if(item.media_type!=this.addHardDisk[ind].typeAll[index].media_type){
                            return false
                        }
                        for(let i=0;i<this.addHardDisk[ind].typeAll.length;i++){
                            if(item.id==this.addHardDisk[ind].typeAll[i].diskid&&index!=i){
                                return false
                            }
                        }
                        return true
                    })
                    console.log(this.addHardDisk[ind].typeAll[index].DiskAll,this.addHardDisk[ind])
                }
            },
            /*存储 选中硬盘型号  和个数*/
            hardDiskModelSet(ind,index,id,num){
                //upId存在的话就修改，不存在就添加
                let updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                ${id}' where id=${this.addHardDisk[ind].typeAll[index].upId}`;
                let time=new Date().getTime();
                let SQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion','expansion_mode_id') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.addHardDisk[ind].modelCategory_id}','${id}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','0','${this.addHardDisk[ind].modelId}')`
                if(this.addHardDisk[ind].typeAll[index].upId){
                   this.$db.run(updateSql, (err, res) => {
                       if (res) {
                           console.log('修改失败');
                       } else {
                           console.log('修改成功');
                           this.addHardDisk[ind].typeAll[index].sum=num
                           /*计算 已用的插槽数 和容量*/
                           this.getDiskAll()
                           //获取各个硬盘扩展柜里的硬盘的数量
                           this.getDiskAllSum(ind)
                           //获取ehs2的总数
                           this.updateEhs2(ind)
                       }
                   });
               }else{
                   this.$db.run(SQL, (err, res) => {
                       if(err){
                           console.log('失败')
                       }else{
                           console.log('成功')
                           this.addHardDisk[ind].typeAll[index].sum=num
                           const selectSql = `select id from product_programme_detail where seq_Key=${time}`;
                           this.$db.get(selectSql, (err, res) => {
                               if (err) {
                                   this.$logger(err);
                                   this.$Notice.error({
                                       title: '系统错误',
                                       desc: err,
                                   });
                                   return;
                               }else{
                                   this.addHardDisk[ind].typeAll[index].upId = res.id;
                                   /*计算 已用的插槽数 和容量*/
                                   this.getDiskAll()
                                   //获取各个硬盘扩展柜里的硬盘的数量
                                   this.getDiskAllSum(ind)
                                   //获取ehs2的总数
                                   this.updateEhs2(ind)
                               }
                           });
                       }
                   })
               }
                // /*显示隐藏总容量*/
                // this.$route.query.showMax = true;
            },
            /*计算硬盘可选最大值*/
            optionalValue(bool,ind,index){
                if(this.addHardDisk[ind].typeAll[index].sum==''){
                    this.addHardDisk[ind].typeAll[index].sumAll=[]
                    return console.log('没有选model')
                }
                if(bool){
                    /*更新硬盘最大数量,先判断是model几，也就是分为了几份*/
                    let num=0//ssd占用的数
                    let sum=0//hdd占用的数
                    let part=this.addHardDisk[ind].disk_count/this.addHardDisk[ind].modeIdType//每份占用的个数
                        this.addHardDisk[ind].typeAll.forEach((item,i)=>{
                            if(i!=index&&item.media_type==0){
                                num+=item.sum
                            }
                            if(i!=index&&item.media_type==1){
                                sum+=item.sum
                            }
                        })
                    let numA=Math.ceil(num/part)*part//ssd占用的数
                    let sumB=Math.ceil(sum/part)*part//hdd占用的数
                    console.log(sum,num)
                    if(this.addHardDisk[ind].typeAll[index].media_type){
                        //看他的类型为什么,为1的话就减去hdd占用的数
                        this.addHardDisk[ind].typeAll[index].sumAll=this.addHardDisk[ind].disk_count*this.addHardDisk[ind].num-sum-numA //总数减去hdd已经占了的数，和ssd占了的数
                    }else{
                        //看他的类型为什么,为0的话就减去ssd占用的数
                        this.addHardDisk[ind].typeAll[index].sumAll=this.addHardDisk[ind].disk_count*this.addHardDisk[ind].num-num-sumB //总数减去ssd已经占了的数，和hdd占了的数
                    }
                }
            },
            /*删除扩展柜硬盘*/
            deleteHardDisk(ind,index){
                if (this.addHardDisk[ind].typeAll[index].upId) {
                    const sql = `DELETE FROM product_programme_detail WHERE id = ${this.addHardDisk[ind].typeAll[index].upId}`;
                    this.$db.run(sql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            console.log("删除成功")
                            if(this.addHardDisk[ind].typeAll.length>1){
                                this.addHardDisk[ind].typeAll.splice(index,1)
                            }else{
                                this.addHardDisk[ind].typeAll[index].sum=''//数量
                                this.addHardDisk[ind].typeAll[index].diskid=''//硬盘的id
                                this.addHardDisk[ind].typeAll[index].upId='' //库里的id

                                // this.addHardDisk[ind].typeAll[index].media_type='',//类型区别 ssd和hdd
                                // this.addHardDisk[ind].typeAll[index].media_typeBei=''
                            }
                            /*计算 已用的插槽数 和容量*/
                            this.getDiskAll()
                            //获取各个硬盘扩展柜里的硬盘的数量
                            this.getDiskAllSum(ind)
                            //获取ehs2的总数
                            this.updateEhs2(ind)
                        }
                    })
                }else{
                    if(this.addHardDisk[ind].typeAll.length>1){
                        this.addHardDisk[ind].typeAll.splice(index,1)
                    }else{
                        this.addHardDisk[ind].typeAll[index].sum=''//数量
                        this.addHardDisk[ind].typeAll[index].diskid=''//硬盘的id

                        // this.addHardDisk[ind].typeAll[index].media_type='',//类型区别 ssd和hdd
                        // this.addHardDisk[ind].typeAll[index].media_typeBei=''
                    }
                }

            },
            //获取各个硬盘扩展柜里的硬盘的数量
            getDiskAllSum(index){
                this.addHardDisk[index].numAll=0
                console.log(this.addHardDisk[index].typeAll)
                this.addHardDisk[index].typeAll.forEach(item=>{
                    this.addHardDisk[index].numAll+=item.sum*1
                })
            },
            /*添加扩展柜硬盘*/
            addHardDiskBtn(index){
                /*更新硬盘最大数量*/
                console.log(this.addHardDisk[index])
                let num=0//ssd占用的数
                let sum=0//hdd占用的数
                this.addHardDisk[index].typeAll.forEach(item=>{
                    sum+= item.sum
                })
                if(sum>=this.addHardDisk[index].disk_count*this.addHardDisk[index].num||this.addHardDisk[index].typeAll[this.addHardDisk[index].typeAll.length-1].sum==''){
                    return
                }
                sum=0
                // let part=this.addHardDisk[index].disk_count/this.addHardDisk[index].modeIdType//每份占用的个数
                // this.addHardDisk[index].typeAll.forEach((item,i)=>{
                //     if(item.media_type==0){
                //         num+=item.sum
                //     }
                //     if(item.media_type==1){
                //         sum+=item.sum
                //     }
                // })
                // let numA=Math.ceil(num/part)//ssd占用的份数
                // let sumB=Math.ceil(sum/part)//hdd占用的份数
                //let residue=2 //默认为2是因为值是0和1，如果有满了的就变为哪一个
                //先比较如果份数没用完，就说明还可以那个都能选
                // if(numA+sumB>=this.addHardDisk[index].modeIdType*this.addHardDisk[index].num){
                //     if(numA*part==num){
                //         residue=0
                //     }
                //     if(sumB*part==sum){
                //         residue=1
                //     }
                // }
                let gettime= new Date().getTime() //获取现在的时间戳
                let arr=this.DiskAll.filter(item=>{
                    if(this.$store.state.showWithdraw==0 &&  item.time<gettime){
                        return false
                    }
                    if(item.disc_interface!=this.addHardDisk[index].disc_interface){
                        return false
                    }
                    for(let i=0;i<this.addHardDisk[index].typeAll.length;i++){
                        if(item.id==this.addHardDisk[index].typeAll[i].diskid){
                            return false
                        }
                    }
                    return true
                })
                if(arr.length>0){
                    this.addHardDisk[index].typeAll.push({
                        DiskAll:this.DiskAll,//硬盘展示的数据
                        media_type:'',//类型区别 ssd和hdd
                        media_typeBei:'',//类型区别 ssd和hdd
                        diskid: '',// 硬盘选项的id
                        sum: '',//数量
                        upId: '',//库里的id
                        sumAll: '',//循环出来展示的数量
                    })
                }
                console.log('还可以添加'+arr.length)
            },
            /*更改ehs2的数据有ssd的话根据规则打印，没有的话就删除，因为默认添加了一条ssd的*/
            updateEhs2(index){
                let num=0 //ssd的总个数
                this.addHardDisk[index].typeAll.forEach(item=>{
                    if(item.media_type==0){
                        num+=item.sum
                    }
                })
                //ssd的总数除以每份的个数  比如 24盘  model1 24/1=24  model2 24/2=12 model4 24/4=6 再向上取整就说明占用了几个位置，添加几个ehs2
                 num=Math.ceil(num/(this.addHardDisk[index].disk_count/this.addHardDisk[index].modeIdType))
                //判断数量有没有 有的话就更改或添加
                if(num){
                    //id存在的话就更改
                    if(this.addHardDisk[index].eh2sId){
                        let updateSql = `UPDATE product_programme_detail set 'component_count'='${num}' where id=${this.addHardDisk[index].eh2sId}`;
                        this.$db.run(updateSql,(err,res)=>{
                            if(err){
                                console.log('修改失败')
                            }else{
                                console.log('修改成功')
                                //修改成功后就查询所有的ehs2的数量
                                this.ehs2DeSum()
                            }
                        })
                    }else{
                        //不存在的话就添加
                        let time=new Date().getTime();
                        let addSQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion','expansion_mode_id') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.eh2s.category_id}','${this.eh2s.id}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','0','${this.addHardDisk[index].modelId}')`
                        this.$db.run(addSQL,(err,res)=>{
                            if(err){
                                console.log('添加失败')
                            }else{
                                console.log('添加成功')
                                //添加成功后就查询所有的ehs2的数量
                                this.ehs2DeSum()
                                let selectSql = `select * from product_programme_detail where seq_Key=${time}`;
                                this.$db.get(selectSql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '系统错误',
                                            desc: err,
                                        });
                                        return;
                                    }else{
                                        console.log(res)
                                        this.addHardDisk[index].eh2sId=res.id
                                    }
                                });
                            }
                        })
                    }
                }else{
                    //没有的话就看id存不存在，存在就删除
                    if(this.addHardDisk[index].eh2sId){
                        let deleteSql = `DELETE FROM product_programme_detail WHERE id = ${this.addHardDisk[index].eh2sId}`;
                        this.$db.run(deleteSql,(err,res)=> {
                            if (err) {
                                console.log('删除失败')
                            } else {
                                console.log('删除成功')
                                this.addHardDisk[index].eh2sId=''
                                //删除成功后就查询所有的ehs2的数量
                                this.ehs2DeSum()
                            }
                        })
                    }

                }
            },
        },
    }
</script>

<style scoped lang="scss">
    /*----------------------表单项--------------------------*/

    .config {
        margin-top: 20px;
        margin-left: 20px;

        .icon {
            font-size: 25px;
            text-align: center;
            height: 50px;
            display: inline-block;
        }

        .el-input {
            width: 80px;
            margin-right: 20px;
        }

        .el-select {
            width: 400px;
        }


        .title {
            width: 98%;
            background: #f2f2f2;
            padding: 5px;
            margin-bottom: 10px;
        }


        .add-cables {
            padding: 10px;
        }
    }

    /*----------其他select修改宽度----------------*/
    .other .config .el-select {
        width: 100px;
    }

    .other .config .other-select-two {
        width: 400px;
        margin-left: 30px;
    }

    .cable {
        margin-top: 20px;
    }

    .modify {
        margin: 40px 0;
    }
    .tips{
        display: inline-block;
        margin-top: 10px;
    }
    .dele{
        margin-left: 20px;
    }
    .disk-on{
        margin-top: 20px;
    }
</style>
