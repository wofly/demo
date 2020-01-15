<template>
    <div>
        <!--外部PCIe 配置-->
        <div class="interior-hea content-label">{{$t('ExternalPcieChild.PcieConfigure')}}</div>
        <div class="for-main">
            <!--判断没有外部硬盘占用的话，就不展示-->
            <div class="interior-pei for-main" v-for="(ite,ind) in externalPcie" :key="ite.id">
                <el-select v-model="ite.pcie_type" size="mini" class="sel">
                    <el-option
                            v-for="(item,index) in ite.type"
                            :key="index"
                            :label="item.type"
                            :value="index">
                    </el-option>
                </el-select>
                <el-select v-model="ite.description_en" size="mini">
                    <el-option
                            v-for="(item,index) in ite.description"
                            :key="index"
                            :label="item.type"
                            :value="index">
                    </el-option>
                </el-select>
                <p>*</p>
                <el-select v-model="ite.sum" size="mini" class="sel" @visible-change="getExternal($event,ind)"
                           @change="recorExternal(ind,ite.sum)">
                    <el-option
                            v-for="(item,index) in ite.externalSum"
                            :key="index"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                    <div class="pdiv" v-if="ite.temponTit!=null">
                        {{ite.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="ite.uiStatus">
                        {{$store.state.info_language?ite.uiStatusEn:ite.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="ite.setTimeMe">
                        <!--{{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{dl.setTimeMe}}&gt;  {{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}} <{{dl.overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}-->
                        此部件将于&lt; {{ite.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{ite.overdueTime}}&gt; 天
                    </div>

            </div>
            <div class="externalPcie-hea-tw" v-for="(it,ind) in arr">
                <el-select v-model="it.typeId" size="mini" class="sel" @change="getDetails(it.typeId,ind,1)" @visible-change="setshouType($event,ind)">
                    <el-option
                            v-for="(item,index) in ExternalPcieChildType"
                            :key="index"
                            :label="item.pcie_type"
                            :value="item.id"
                            :disabled="item.bool">
                    </el-option>
                </el-select>
                <el-select v-model="it.id" size="mini" :placeholder="$store.state.info_language?'please choose':'请选择'" @change="recor(it.id,ind,1)" @visible-change="setType($event,ind)">
                    <el-option
                            v-for="(item,index) in it.detailsType"
                            :key="index"
                            :label="$store.state.info_language?item.description_en:item.PCI_E_desc_cn"
                            :value="item.id">
                    </el-option>
                </el-select>
                <p>*</p>
                <el-select v-model="it.num" size="mini" class="sel" :placeholder="$store.state.info_language?'please choose':'请选择'" @visible-change="setList($event,ind)"
                           @change="recor(it.id,ind,it.num)">
                    <!--v-el-select-loadmore="{setNum,ind,max:200}"-->
                    <el-option
                            v-for="(item,index) in it.numZ"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-button size="mini" type="info" icon="el-icon-close" circle class="externalPcie-butt"  v-show="arr.length>0" @click="arr.length==1?recor('请选择',ind,1):deletePci(it.upId,ind)"></el-button>

                <div v-for="dl in it.detailsType" v-if="it.id==dl.id" :key="dl.id">
                    <div class="pdiv" v-if="dl.temponTit!=null">
                        {{dl.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="dl.uiStatus">
                        {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="dl.setTimeMe">
                        <!--{{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{dl.setTimeMe}}&gt;  {{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}} <{{dl.overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}-->
                        此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                    </div>
                </div>
            </div>
            <!--增加板块-->
            <div class="externalPcie-hea-tw">
                <el-button icon="el-icon-plus" size="mini" :disabled="externalPcieChildoff"
                           @click="addPcie"></el-button>
                {{$t('InternalPCIE.lists.InternalPCIEsetup.content1')}}
            </div>
            <!--展示插槽数量-->
            <div class="externalPcie-hea-tw">
                {{$t('InternalPCIE.lists.InternalPCIEsetup.content2')}} {{x16_3+x8_3}} / {{externalSum*6}}
            </div>
        </div>
        <div class="interior-hea content-label"> {{$t('InternalPCIE.lists.InternalPCIEsetup.tips')}}</div>
    </div>
</template>

<script>
    export default {
        name: "ExternalPcieChild",
        props: ['externalSum', 'sign','pcieSwitch','childType'],
        /*自定义事件*/
        /* v-el-select-loadmore="{setNum,ind}"*/
        directives: {
            'el-select-loadmore': {
                bind(el, binding) {
                    // 获取element-ui定义好的scroll盒子
                    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
                    SELECTWRAP_DOM.addEventListener('scroll', function () {
                        /**
                         * scrollHeight 获取元素内容高度(只读)
                         * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                         * clientHeight 读取元素的可见高度(只读)
                         * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                         * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                         */
                        const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                        console.log(binding,binding.value.max)
                        if (condition) {
                            binding.value.setNum(binding.value.ind,binding.value.max);
                        }
                    });
                }
            }
        },
        data() {
            return {
                //que:this.$store.state.info_language?'please choose':'请选择',//默认显示时，请选择的中英文切换
                unfine: '',
                arr: [],//最外层的数组
                brr: [],//已经选择过的
                ExternalPcieChildType: [],//pcie的内型
               // childType: [],//默认添加lan的pcie的简介
                x16_3: 0,//x16_3的数量
                x8_3: 0,//x8_4的数量
                externalPcieChildoff: false,//判断增加pcie不
                externalPcie:[],//要不要展示的外部硬盘占用的数组
                hardDiskId:'',//要储存的component_id
                interiorPcie:[],//获取库里内部pcie的使用情况
                cpu:2,//cpu的数量
            }
        },
        methods: {
            /*点击时要展示的数量，有最小值为硬盘占用的数量*/
            getExternal(bool,index){
                if(bool){
                    console.log(this.externalPcie[index])
                    this.externalPcie[index].externalSum=[]
                    for(let i=this.externalPcie[index].max;i<=(this.externalSum*6-this.x16_3-this.x8_3+this.externalPcie[index].sum);i++){
                        this.externalPcie[index].externalSum.push(i)
                    }
                }
            },
            /*点击时直接修改*/
            recorExternal(index, num) {
                console.log(this.externalPcie[index])
                if(this.externalPcie[index].id){
                    let updateExternal=''
                    //如果存在就修改
                    if(num==this.externalPcie[index].max){
                        updateExternal= `delete from product_programme_detail  where id=${this.externalPcie[index].id}`;
                        //如果值一样的话就删除
                    }else{
                        //要不然的话就修改
                         updateExternal = `UPDATE product_programme_detail set 'component_count'='${num-this.externalPcie[index].max}' where id=${this.externalPcie[index].id} `;
                    }

                    this.$db.run(updateExternal, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            if(num==this.externalPcie[index].max){
                                console.log('删除成功', num)
                                this.externalPcie[index].id=''
                            }else{
                                console.log('修改成功', num)
                            }
                            /*重新获取x8_4,x8_3的数据*/
                            if (this.externalPcie[index].PCI_E_size == 1) {
                                this.x8_3 += (num-this.externalPcie[index].num);
                            }
                            if (this.externalPcie[index].PCI_E_size == 2) {
                                this.x16_3 += (num-this.externalPcie[index].num);
                            }
                            console.log(this.x8_3,num,this.externalPcie[index].num)
                            this.externalPcie[index].num=num
                        }
                    })
                }else{
                    //如果不存在就添加
                    const time = new Date().getTime();
                    const insertEj0j = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.externalPcie[index].category_id}','${this.externalPcie[index].component_id}','${num-this.externalPcie[index].max}','${time}','${localStorage.solutionId}','${localStorage.templateId}','0')`;
                    this.$db.run(insertEj0j, (err, res) => {
                        if (err) {
                            console.log('添加失败');
                        } else {
                            console.log('添加成功' + JSON.stringify(res));
                            let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                            this.$db.get(selectSql, (err, res) => {
                                console.log(res, err, selectSql)
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '系统错误',
                                        desc: err,
                                    });
                                    return;
                                } else {
                                    console.log(res,'查询成功')
                                    this.externalPcie[index].id=res.id
                                    if (this.externalPcie[index].PCI_E_size == 1) {
                                        this.x8_3 += (num-this.externalPcie[index].num);
                                    }
                                    if (this.externalPcie[index].PCI_E_size == 2) {
                                        this.x16_3 += (num-this.externalPcie[index].num);
                                    }
                                    console.log(this.x8_3,num,this.externalPcie[index].num)
                                    this.externalPcie[index].num=num
                                }
                            })
                        }
                        })
                }
            },
            setNum(index,max){
                console.log(111111,index,this.arr[index],max)
                /*判断接收是不是数组，数组就push数字就直接加*/
                if(Array.isArray(this.arr[index].numZ)){
                    let num=max-this.arr[index].numZ[this.arr[index].numZ.length]
                    if(num>=20){
                        for(let i=this.arr[index].numZ[this.arr[index].numZ.length];i<=20;i++){
                            this.arr[index].numZ.push(i)
                        }
                    }else{
                        for(let i=this.arr[index].numZ[this.arr[index].numZ.length];i<=num;i++){
                            this.arr[index].numZ.push(i)
                        }
                    }
                }else{
                    console.log('不是数组',num,this.arr[index].numZ)
                    let num=max-this.arr[index].numZ
                    if(num>=20){
                        this.arr[index].numZ+=20
                    }else{
                        this.arr[index].numZ+=num
                    }
                }
            },
            //添加外部pcie
            addPcie(bool) {
                if (this.x16_3 + this.x8_3 >= this.externalSum * 6 || (this.arr.length==0?0:this.arr[this.arr.length - 1].upId == undefined)) {
                    return
                }
                this.arr.push({
                    type: this.childType,//详情的数组备用的
                    detailsType: this.childType,//详情的数组ExternalPcieChildType
                    num: bool?'':1,//数量
                    numZ: '',//要展示的总数量
                    id: '', //所选中的id
                    typeId: 1,//类型的id
                    PCI_E_generation: '',// 库里面所选中的代数
                    PCI_E_size: '',// 库里面的类型 比如x8_3
                    upId:undefined,
                    PCIe_cnt:''
                })
                //this.getDetails(this.arr[this.arr.length - 1].id,this.arr.length - 1,1)
                console.log(this.arr, this.childType, this.x16_3, this.brr,)

            },
            /*删除数据*/
            deletePci(id, ind) {//删除数据
                // this.deletePci(id,ind,1)
                id = (id? id : '');
                console.log(id)
                if (id) {
                    const deleteSQL = `DELETE FROM product_programme_detail WHERE id = ${id}`;
                    this.$logger(deleteSQL);
                    this.$db.run(deleteSQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$db.run('ROLLBACK');
                            this.$Notice.error({
                                title: '删除失败',
                                desc: err,
                            });
                        }else{
                            console.log('删除成功')
                        }
                    });
                }
                        if (this.arr[ind].PCI_E_size == 1) {
                            this.x8_3 -= this.arr[ind].num;
                        }
                        if (this.arr[ind].PCI_E_size == 2) {
                            this.x16_3 -= this.arr[ind].num;
                        }
                // this.arr[index].optionsVal
                // this.brr = this.brr.filter(item => {
                //     if (item == this.arr[ind].id) {
                //         return false;
                //     }
                //     return true;
                // });
                    this.arr.splice(ind, 1);
                    this.brr.splice(ind, 1);
            },
            /*获取库里外部pcie的内容*/
            getPcie() {
                const defaltuPci = `select pp.PCI_E_generation,PCI_E_size,PCI_Catagory_id,info.description PCI_E_desc_cn,info.description_en,ppd.component_count,ppd.id,ppd.seq_Key,ppd.component_id,info.status,info.withdraw_date,relation.cpu_cnt,relation.PCIe_cnt from component_iocard pp
join product_programme_detail ppd on pp.id=ppd.component_id and ppd.category_id=pp.category_id
left join component_base_info info  on info.id=pp.base_info_id
join relation_cpu_PCIe relation on relation.PCIe_id=pp.id
                where ppd.product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}' and is_expansion='0' and relation.cnt_type in (0,2) and relation.cpu_cnt=${this.cpu}`;// 获取库里面的值外部pcie的值、id、代数等..  ，
                this.$db.all(defaltuPci,  (err, res) => {
                    if (err) {
                        console.log(defaltuPci, '报错')
                    } else {
                        this.x16_3 = 0,//x16_3的数量
                            this.x8_3 = 0,//x8_4的数量
                            this.arr = []
                        this.brr = []
                        console.log(2736463,this.externalPcie,res)
                        res.forEach(async (item, index) => {
                            if (item.PCI_E_size == 1||item.PCI_E_size == 0) {
                                // 获取的X8 GEN3数量
                                this.x8_3 += item.component_count;
                            } else if (item.PCI_E_size == 2) {
                                // 获取的X8 GEN3数量
                                this.x16_3 += item.component_count;
                            }
                           // this.brr.push(item.component_id)
                            //选中的id记录在brr中
                            //将库里pcie的数据记录在arr中
                            if(this.externalPcie.length==1&&item.component_id == this.externalPcie[0].component_id){
                                //this.x8_3+=this.externalPcie[0].num
                            }else{
                                this.brr.push(item.component_id)
                                this.arr.push({
                                    type: [],//详情的数组备用的
                                    detailsType: [],//详情的数组
                                    upId: item.id,//库里的id
                                    num: item.component_count,//数量
                                    numZ: item.component_count,//要展示的总数量
                                    id: item.component_id, //所选中的id
                                    typeId: item.PCI_Catagory_id,//类型的id
                                    PCI_E_generation: item.PCI_E_generation,// 库里面所选中的代数
                                    PCI_E_size: item.PCI_E_size,// 库里面的类型 比如x8_3
                                    PCIe_cnt:item.PCIe_cnt,//这个id所能选的最大数
                                })
                                /*根据pcie类型来详情的内容、类型的id以及下标*/
                                console.log(index)
                                await this.getDetails(item.PCI_Catagory_id, this.arr.length-1)
                            }
                           //  this.arr.push({
                           //      type: [],//详情的数组备用的
                           //      detailsType: [],//详情的数组
                           //      upId: item.id,//库里的id
                           //      num: item.component_count,//数量
                           //      numZ: item.component_count,//要展示的总数量
                           //      id: item.component_id, //所选中的id
                           //      typeId: item.PCI_Catagory_id,//类型的id
                           //      PCI_E_generation: item.PCI_E_generation,// 库里面所选中的代数
                           //      PCI_E_size: item.PCI_E_size,// 库里面的类型 比如x8_3
                           //      PCIe_cnt:item.PCIe_cnt,//这个id所能选的最大数
                           //  })
                           //  /*根据pcie类型来详情的内容、类型的id以及下标*/
                           // await this.getDetails(item.PCI_Catagory_id, index)
                        })
                        // if(this.externalPcie.length==1){
                        //     this.arr = this.arr.filter((item,index) => {
                        //         if (item.id == this.externalPcie[0].component_id) {
                        //             this.arrB = item
                        //             this.brr.splice(index,1)
                        //             return false
                        //         } else {
                        //             return true
                        //         }
                        //     })
                        //     this.x8_3+=this.externalPcie[0].num
                        // }
                        console.log(res, this.arr, this.x16_3, this.x8_3,this.externalPcie,this.hardDiskId,defaltuPci)
                        if(this.arr.length==0){
                            this.addPcie(1)
                        }
                    }
                });
            },
            /*根据pcie类型来详情的内容、类型的id以及下标*/
           async getDetails(id, index, bool) {
                console.log(2736463,this.externalPcie,index,this.arr.length)
                let getDetail = `SELECT io.*,info.description PCI_E_desc_cn,info.description_en,info.status,info.withdraw_date,relation.PCIe_cnt FROM component_iocard io
join component_base_info info on info.id=io.base_info_id
join relation_cpu_PCIe relation on relation.PCIe_id=io.id
WHERE io.PCI_Catagory_id ='${id}' and io.PCI_E_generation in (1,2,3) and info.productId='${localStorage.productId}' and relation.cnt_type in (0,2) and relation.cpu_cnt='${this.cpu}' and io.PCIelocal in (0,2)`;
                console.log(getDetail)
               await new Promise((resolve,reject)=>{
                    this.$db.all(getDetail, (err, res) => {
                        if (err) {
                            console.log(getDetail, '报错')
                        } else {
                            console.log(res)
                            res.forEach((item,index)=>{
                                this.$set(item,'temponTit',item.title_msg) //展示的描述
                                this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                                if(item.withdraw_date){
                                    let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                    let time = new Date(thisTime).getTime();//将时间改为时间戳
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
                            // this.$set(this.arr[index],'type',[...res])
                            // this.$set(this.arr[index],'tdetailsTypeype',[...res])
                            this.arr[index].type = [...res]
                            this.arr[index].detailsType = [...res]
                            console.log(this.arr,res,this.brr)
                            if (!bool) {
                                return
                            } else {
                                if (res.length) {
                                    let arr = res.filter((item,ind) => {
                                        let bool = true
                                        for (let i = 0; i < this.brr.length; i++) {
                                            if (item.id == this.brr[i]) {
                                                return bool = false
                                            }
                                        }
                                        for (let i = 0; i < this.interiorPcie.length; i++) {
                                            if (item.id == this.interiorPcie[i].component_id) {
                                                if(this.interiorPcie[i].component_count >= item.PCIe_cnt){
                                                    return bool = false
                                                }else{
                                                    console.log("机器可选的最大数",item.PCIe_cnt, "内部选了的数",this.interiorPcie[i].component_count)
                                                }
                                            }
                                        }
                                        return bool
                                    })
                                    if (this.arr[index].PCI_E_size==2?this.x16_3-this.arr[ind].num:this.x16_3 >= this.externalSum * 2) {
                                        arr = arr.filter(item => {
                                            if (item.PCI_E_size == 2) {
                                                return false
                                            } else {
                                                return true
                                            }
                                        })
                                    }
                                    console.log(arr,this.arr[index].detailsType[0])
                                    if(arr.length){
                                        this.arr[index].id = arr[0].id, //所选中的id
                                            this.arr[index].PCI_E_generation = arr[0].PCI_E_generation,// 库里面所选中的代数
                                            this.arr[index].PCI_E_size = arr[0].PCI_E_size// 库里面的类型 比如x8_3
                                        //this.brr[index] = arr[0].id
                                        this.recor(arr[0].id, index, 1)
                                        console.log(this.arr[index].detailsType[0].id)
                                    }else{
                                        this.arr[index].detailsType = [{id: 0, PCI_E_desc_cn: '没有可以匹配的'}]
                                        this.arr[index].id = 0
                                    }
                                } else {
                                    this.arr[index].detailsType = [{id: 0, PCI_E_desc_cn: '没有可以匹配的'}]
                                    this.arr[index].id = 0
                                }
                            }
                           resolve()
                        }
                    });
                })

            },
            /*点击数量时要展示的数量*/
            setList(bool, index) {
                if (bool) {
                    this.arr[index].numZ = 0
                    console.log(this.arr[index])
                    let num=0,sum=0
                    if(this.arr[index].id==0){
                        return
                    }
                    if (this.arr[index].PCI_E_size == 1) {
                        num = this.externalSum * 6 - this.x8_3 - this.x16_3 + this.arr[index].num
                    } else if (this.arr[index].PCI_E_size == 0) {
                        num = 1
                    } else {
                        num = this.externalSum * 2 - this.x16_3 + this.arr[index].num
                    }
                    this.interiorPcie.forEach(item=>{
                        if(item.component_id==this.arr[index].id){
                            sum=this.arr[index].PCIe_cnt-item.component_count
                        }else{
                            sum=this.arr[index].PCIe_cnt
                        }
                    })
                    if(num>sum){
                        this.arr[index].numZ=sum
                    }else{
                        this.arr[index].numZ=num
                    }

                    console.log(this.arr[index].id,this.arr[index],'机器可选的最大数',sum,'外部可选的数',num)
                }
            },
            setshouType(bool,index){
                if(bool){
                    let num=0
                    this.arr.forEach((item,i)=>{
                        if(i!==index){
                            num+=item.num*1
                        }
                    })
                    this.externalPcie.forEach(item=>{
                        num+=item.sum*1
                    })
                    console.log(num,this.externalSum*6)

                         this.ExternalPcieChildType.forEach(item=>{
                             if(num>=this.externalSum*6){
                                 item.bool=true
                             }else{
                                 item.bool=false
                             }
                         })

                }
            },
            /*点击后要展示的内容*/
            setType(bool,index){
                console.log(this.arr,index)
                if(bool){
                    let gettime= new Date().getTime() //获取现在的时间戳
                    let arr = this.arr[index].type.filter((item,ind) => {
                        let bool = true
                        if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
                            return false //如果时间小于现在时间，也就说过市了，不在显示
                        }
                        for (let i = 0; i < this.brr.length; i++) {
                            if (item.id == this.brr[i]&&index!=i) {
                                return bool = false
                            }
                            if (item.id == this.hardDiskId) {
                                return bool = false
                            }
                        }
                        for (let i = 0; i < this.interiorPcie.length; i++) {
                            if (item.id == this.interiorPcie[i].component_id) {
                                if(this.interiorPcie[i].component_count >= item.PCIe_cnt){
                                    return bool = false
                                }else{
                                    console.log("机器可选的最大数",item.PCIe_cnt, "内部选了的数",this.interiorPcie[i].component_count)
                                }
                            }
                        }
                        return bool
                    })
                    let num=0
                    this.arr.forEach((item,i)=>{
                        if(i!==index){
                            num+=item.num*1
                        }
                    })
                    this.externalPcie.forEach(item=>{
                        num+=item.sum*1
                    })
                    console.log(num,this.externalSum*6)
                    if(num>=this.externalSum*6){
                        return this.arr[index].detailsType=[]
                    }
                    if(this.arr.length==1&&this.externalPcie.length==0){
                        arr.unshift({
                            id:'请选择',
                            PCI_E_desc_cn:'请选择',
                            upId:this.arr[index].upId,
                            description_en:'please choose',
                            time:''
                        })
                    }
                    this.arr[index].detailsType=arr
                    console.log(arr,this.brr)
                }
            },
            /*点击之后更改库里的id*/
           async recor(id, ind, num) {
               let bool=0
               let sum=0
               this.externalPcie.forEach(item=>{
                   sum+=item.sum*1
               })
                if(id==='请选择'||id==='please choose'){
                    if(!this.arr[ind].upId){
                        return
                    }
                        const deletesql = `DELETE FROM product_programme_detail WHERE id = ${this.arr[ind].upId}`;
                        this.$logger(deletesql);
                    await new Promise((resolve,reject)=> {
                        this.$db.run(deletesql, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '删除失败',
                                    desc: err,
                                });
                            } else {
                                console.log(222222, deletesql, this.arr[ind], this)
                                return resolve(res)
                            }
                        })
                        }).then((res) => {
                            console.log('删除成功')
                        this.arr[ind].num=''
                        this.arr[ind].numZ=''
                        this.arr[ind].id=''
                        this.arr[ind].upId=undefined
                            this.x8_3 = 0+sum
                            this.x8_4 = 0
                        this.brr.splice(ind,1)
                            bool=1
                            return
                        })
                }
                if(bool){
                    return
                }
                console.log(11111111)
                if (this.arr[ind].upId) {//如果upid存在说明库里有数据，所以修改
                    console.log(id, ind, num);
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='${id}' where id=${this.arr[ind].upId} `;
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log('修改失败');
                        } else {
                            console.log('修改成功');
                            this.getHBA()
                            this.x8_3 = 0+sum
                            this.x16_3 = 0
                            this.arr[ind].num=num//修改成功的话将数量也更改
                            this.arr[ind].type.forEach(item => {
                                if (item.id == id) {
                                    this.arr[ind].PCIe_cnt=item.PCIe_cnt
                                }
                            })
                            this.arr.forEach(item => {
                                if (item.PCI_E_size == 1||item.PCI_E_size == 0) {
                                    // 获取的X8 GEN3数量
                                    this.x8_3 += item.num;
                                } else if (item.PCI_E_size == 2) {
                                    // 获取的X8 GEN3数量
                                    this.x16_3 += item.num;
                                }
                            })
                            this.brr[ind]=id//修改成功的话将brr里面的id也更改
                            console.log(this.x8_3, this.x16_3,this.arr[ind])
                        }
                    })
                } else {
                    console.log('没记录：：：');
                    this.getHBA()
                    const time = new Date().getTime();
                    const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.$route.query.sign}','${id}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','0')`;
                    this.$db.run(updateSql, (err, res) => {
                        if (err) {
                            console.log('添加失败');
                        } else {
                            console.log('添加成功' + JSON.stringify(res));
                            let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                            this.$db.get(selectSql, (err, res) => {
                                console.log(res, err, selectSql)
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '系统错误',
                                        desc: err,
                                    });
                                    return;
                                } else {
                                    let obj = {
                                        type: this.arr[ind].type,
                                        detailsType: this.arr[ind].detailsType,
                                        upId: res.id,//库里的id
                                        num: res.component_count,//数量
                                        numZ: res.component_count,//要展示的总数量
                                        id: id, //所选中的id
                                        typeId: this.arr[ind].typeId,//类型的id
                                        PCI_E_generation: '',// 库里面所选中的代数
                                        PCI_E_size: '',// 库里面的类型 比如x8_3
                                        PCIe_cnt:'',//所能选择的最大数
                                    }
                                    this.arr[ind].detailsType.forEach(item => {
                                        if (item.id == id) {
                                            obj.PCI_E_generation = item.PCI_E_generation,// 库里面所选中的代数
                                            obj.PCI_E_size = item.PCI_E_size// 库里面的类型 比如x8_3
                                            obj.PCIe_cnt=item.PCIe_cnt
                                        }
                                    })
                                    this.arr.splice(ind, 1, obj)//将原来的参数替代为新获取的参数
                                    this.brr.push(id)//如果添加成功，在brr后面添加一个id
                                    this.x8_3 = 0+sum
                                    this.x16_3 = 0
                                    this.arr.forEach(item => {
                                        if (item.PCI_E_size == 1||item.PCI_E_size == 0) {
                                            // 获取的X8 GEN3数量
                                            this.x8_3 += item.num;
                                        } else if (item.PCI_E_size == 2) {
                                            // 获取的X8 GEN3数量
                                            this.x16_3 += item.num;
                                        }
                                    })
                                    console.log(this.brr, this.arr[ind], res);
                                }
                            });
                        }
                    })
                }
            },
            getHBA(){
                /*查询库里HBA的数量去添加或修改他匹配的连接线*/
                let sQL=`select sum(component_count) detail_sum_count from product_programme_detail detail
 join component_iocard io on detail.category_id=io.category_id and detail.component_id=io.id
 join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id and pcie.id=3 where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                /*查询记录HBA连接线的id*/
                let getSQL=`select  detail.id detail_id,detail.category_id,detail.component_id from product_programme_detail detail join component_other other on detail.category_id=other.category_id and detail.component_id=other.id and other.id=59 where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                /*查询库里HBA的数量去添加或修改他匹配的连接线*/
                this.$db.get(sQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        console.log(res)
                        let num=res.detail_sum_count
                        /*判断不为假时执行下面的*/
                        /*查询记录HBA连接线的id*/
                        this.$db.get(getSQL, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '搜索失败',
                                    desc: err,
                                });
                            } else {
                                console.log(res)
                                /*判断id存在时修改*/
                                if(res){
                                    if(num===null){
                                        let deleteSql = `DELETE FROM product_programme_detail where id=${res.detail_id} `;
                                        this.$db.run(deleteSql, (err, res) => {
                                            if (err) {
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '搜索失败',
                                                    desc: err,
                                                });
                                            } else {
                                                console.log('删除成功')
                                                /*删除成功后添加*/
                                                return
                                            }
                                        })
                                    }
                                    let updateSql = `UPDATE product_programme_detail set 'component_count'='${num}' where id=${res.detail_id} `;
                                    this.$db.run(updateSql, (err, res) => {
                                        if (err) {
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: '搜索失败',
                                                desc: err,
                                            });
                                        } else {
                                            console.log('修改成功,17_5')
                                        }
                                    })
                                }else{
                                    /*如果数量为null的话就直接退出去*/
                                    if(num==null){
                                        return
                                    }
                                    /*判断id不存在时添加*/
                                    const insert = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','39','59','${num}','${localStorage.solutionId}','${localStorage.templateId}','1')`;
                                    this.$db.run(insert, (err, res) => {
                                        if (err) {
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: '搜索失败',
                                                desc: err,
                                            });
                                        } else {
                                            console.log('添加成功,17_5')
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            },
            /*一进人页面就要查询外部硬盘占用外部pcie的插槽数有几个*/
            getEJ20() {
                /*获取外部硬盘的占用多少外部pcie插槽的数量*/
                let hardDiskSQL = `select  detail.id,detail.component_count,detail.category_id,detail.component_id,PCI_E_size,info.description description_en,pcie.pcie_type,info.status,info.withdraw_date,info.title_msg,info.ui_status,detail.expansion_mode_id from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
join component_base_info info on info.id=io.base_info_id
join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id
where detail.component_id in (select distinct io.id from component_iocard io
join relation_disk_modeoption_iocard relation on relation.iocard_id=io.id)
and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.is_expansion=0`//and detail.is_expansion=0暂时不写
                /*ej0j的数量*/
                let ej0jSQL = `select detail.id,detail.component_count,mode.card_base_cnt from product_programme_detail detail
join component_disk_modeoption mode on mode.category_id=detail.category_id and mode.id=detail.component_id
where product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.is_expansion=0`//and detail.is_expansion=0暂时不写
                //这个是获取外部硬盘的数据
                this.$db.all(ej0jSQL, (err, res) => { // 获取库里外部扩展柜内瓤的数
                    if (res.length) {
                        let num=0
                        res.forEach(item=>{
                            num+=item.component_count*item.card_base_cnt//这个是外部硬盘占用的数量
                        })
                        console.log(res,num,ej0jSQL)
                        this.$db.all(hardDiskSQL, (err, res) =>     { // 获取库里ej0j的数
                            console.log(hardDiskSQL, res)
                            if (res.length) {
                                let obj = {
                                    max: num,//要展示的最小数
                                    description_en: 0,//ej0j的具体描述
                                    pcie_type: 0,//ej0j的类型
                                    type:[{type:res[0].pcie_type}],//选择展示的类型
                                    description:[{type:res[0].description_en}],//选择展示的ej0j的类型
                                    id: '',//默认带出ej0j的id
                                    sum: 0,//要展示的数量
                                    num: 0,//记录下要展示的数量，减去x8_3的数量时用
                                    externalSum: [],//ej0j的展开的数量
                                    PCI_E_size:res[0].PCI_E_size,//展示那个类型，比如x8_3
                                    category_id:res[0].category_id,
                                    component_id:res[0].component_id,
                                }
                                res.forEach(item=>{
                                    obj.num+=item.component_count//这个是外部硬盘占用的数量
                                    obj.sum+=item.component_count//这个是外部硬盘占用的数量
                                    if(!item.expansion_mode_id){
                                        obj.id=item.id
                                    }
                                })
                                this.$set(obj,'temponTit',res[0].title_msg) //展示的描述
                                this.$set(obj,'setTimeMe',res[0].withdraw_date)//过期的时间
                                if(res.withdraw_date!=null){
                                    //如果不为null的话,就改为天数
                                    this.$store.commit('setStatusTime',res[0].withdraw_date)
                                    this.$set(obj,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                }
                                this.$store.commit('uiStatusTime',res[0].ui_status)
                                this.$set(obj,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                this.$set(obj,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                this.hardDiskId = res[0].component_id//要储存的component_id
                                this.externalPcie=[]//将数组清空，重新赋值
                                if (num) {
                                    this.externalPcie.push(obj)
                                    console.log(this.externalPcie,this.hardDiskId)
                                    if (this.arr.length > 0) {
                                        this.arr = this.arr.filter((item,index) => {
                                            if (item.id == this.hardDiskId) {
                                                this.arrB = item
                                                this.brr.splice(index,1)
                                                return false
                                            } else {
                                                return true
                                            }
                                        })
                                    }
                                }
                                this.x8_3 =0
                                this.x16_3 = 0
                                this.arr.forEach(item=>{
                                    if(item.PCI_E_size==1){
                                        this.x8_3 +=item.num
                                    }else{
                                        this.x16_3 +=item.num
                                    }
                                })
                                this.x8_3 +=obj.sum
                                console.log(this.arr,obj,obj.sum,this.x8_3,this.x16_3)
                            }
                        })
                    }else{
                         this.externalPcie=[]//有的话删掉数组1下标以后的东西
                         this.hardDiskId=''//让ej0j展示出来
                         //重新获取库里的数据
                        // this.getPcie()
                    }
                })
            },
        },
        created() {
            let pcie_type = 'SELECT id,pcie_type FROM component_pcie_classification ';// 获取类型
            this.$db.all(pcie_type, (err, res) => {
                if (err) {
                    console.log(pcie_type, '报错')
                } else {
                    res.forEach(item=>{
                        this.$set(item,'bool',false)
                    })
                    this.ExternalPcieChildType = [...res];
                    //this.getEJ20()
                }
            });
            /*获取库里外部pcie的内容*/
            //this.getPcie()
        }
    }
</script>

<style scoped>

    .externalPcie-hea-tw {
        margin-top: 20px;
    }

    .externalPcie-butt {
        margin-left: 30px;
    }

</style>
