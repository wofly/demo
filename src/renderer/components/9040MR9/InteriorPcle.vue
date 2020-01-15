<template>
    <!--内部PCIe-->
    <div class="interior-pcle">
        <div class="interior-hea content-label">{{$t('InternalPCIE.lists.InternalPCIEsetup.title')}}</div>

        <!--要展示外部pcie与外部硬盘的内容-->
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
                        :label="$store.state.info_language?item.description_en:item.type"
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
            <div class="pdiv" v-if="ite.temponTit">
                {{ite.temponTit}}
            </div>
            <div class="pdiv red-a" v-if="ite.uiStatus">
                {{$store.state.info_language?ite.uiStatusEn:ite.uiStatus}}
            </div>
            <div class="pdiv" v-if="ite.setTimeMe">
                此部件将于&lt; {{ite.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{ite.overdueTime}}&gt; 天
            </div>
        </div>

        <!--内部PCIE-->
        <div class="interior-pei for-main" v-for="(ite,ind) in arr" :key="ind">
            <!--前面的选择框选择类型的-->
            <el-select v-model="ite.interiorVal" size="mini"
                       @change="getPcie(ite.interiorVal,ind)"  @visible-change="setshouType($event,ind,ite.value)" ref="interiorVal" class="sel">
                <el-option
                        v-for="(item,index) in ite"
                        :key="item.pcie_type"
                        :label="item.pcie_type"
                        :value="index"
                        :disabled="ite.bool">
                </el-option>
            </el-select>
            <el-select v-model="(ite.value=='没有可以匹配的'&&$store.state.info_language)?'There s no match':ite.value" :placeholder="$store.state.info_language?'please choose':'请选择'" size="mini"
                       @change="recor(ite.value,ind,1,ite.interiorVal)" @visible-change="getRec($event,ind,ite.value)">
                <el-option
                        v-for="(item,index) in ite.options"
                        :key="item.id"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.id">
                </el-option>
            </el-select>
            <p>*</p>
            <el-select v-model="ite.interiorDow" :placeholder="$store.state.info_language?'please choose':'请选择'" size="mini"
                       @change="recor(ite.value,ind,ite.interiorDow)" @visible-change="getList($event,ind,ite.value)" class="sel">
                <el-option
                        v-for="item in ite.num"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button size="mini" type="info" icon="el-icon-close" circle class="interior-butt"
                       v-show="arr.length>1?1:0" @click="deletePci(ite.value,ind,ite.interiorVal)"></el-button>

            <div v-for="dl in ite.options" v-if="ite.value==dl.id" :key="dl.id">
                <div class="pdiv" v-if="dl.temponTit">
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

        <!--增加板块-->
        <div class="interior-pic">
            <el-button icon="el-icon-plus" size="mini" @click="addCard()"></el-button>
            {{$t('InternalPCIE.lists.InternalPCIEsetup.content1')}}
        </div>

        <!--展示插槽数量-->
        <div class="interior-pic">
            {{$t('InternalPCIE.lists.InternalPCIEsetup.content2')}} {{x8_4+x8_3+x16_4}} / {{cpuNum}}
        </div>
        <div class="interior-hea content-label"> {{$t('InternalPCIE.lists.InternalPCIEsetup.tips')}}</div>
        <div class="interior-bott"></div>
    </div>
</template>

<script>
    export default {
        name: 'InteriorPcle',
        data() {
            return {
                cpuNum: 8,
                cpu: 1, // 暂时写为cpu的数量
                interiorTop: [], // 动态获取卡的值
                pcieS: '', // 动态获取的最大数
                arr: [],//循环渲染的数据
                brr: [],//记录选过的值
                id: 1,
                x16_4: 0, // 默认的值cpu为一时
                x8_4: 0, // 默认的值cpu为一时
                x8_3: 0, // 默认的值cpu为一时
                pciNum: 1,
                name_id: '',
                sign: '',
                arrA: '',//存储数据的没有外部扩展柜时，就添加到arr里面
                externalPcie: [],//展示外部扩展柜的数组
                externalNum: 0,//记录外部扩展柜内瓤的数量
                externalPcieId: 0,//ej20的id
                hardDiskId:0,//ej0j的id
                hardDiskNum:0,//记录外部硬盘扩展柜的数量
                arrB:'',//储存数据没有外部硬盘扩展柜的时候，添加到arr里面
                valueNum:0,//硬盘背板有一条数据为1时 占用2个槽，用这个变量来表示
                ej0c:{}//记录选ej0c为单数时带的EJRL的 category_id 和component_id
            };
        },
        methods: {
            setshouType(bool,index){
                console.log(this.arr,index)
                if(bool) {
                    let num = 0
                    this.arr.forEach((item, i) => {
                        if (i != index) {
                            num += item.interiorDow * 1
                        }
                    })
                    this.externalPcie.forEach(item => {
                        num += item.sum * 1
                    })
                    console.log(num,this.cpuNum)
                    if (num >= this.cpuNum) {
                         this.arr[index].bool = true
                    }else{
                         this.arr[index].bool = false
                    }
                    this.$forceUpdate()
                }
            },
            /*---------------------------------------外部PCIE-------------------------------------------------*/
            /*展开展示外部扩展柜的数量*/
            getExternal(bool, index) {
                if (bool) {
                    /*将要展示的数组数量清空*/
                    this.externalPcie[index].externalSum = []
                    /*最小数为外部pcie的数量，最大数为插槽数-x8_4...+(现在的数量-外部pcie的数量)*/
                    let num=0
                    if(this.externalPcie[index].PCI_E_size==1){
                        num=this.cpuNum-this.x16_4+this.externalPcie[index].sum-this.valueNum
                    }else{
                        if(this.cpu==2){
                            num=4-this.x16_4+this.externalPcie[index].sum-this.valueNum
                        }

                        if(this.cpu==3){
                            num=6-this.x16_4+this.externalPcie[index].sum-this.valueNum
                        }

                        if(this.cpu==4){
                            num=8-this.x16_4+this.externalPcie[index].sum-this.valueNum
                        }
                    }

                    console.log(this.x16_4,this.externalPcie[index].max,num)
                    for (let i = this.externalPcie[index].max; i <= (this.cpuNum - this.x8_4 - this.x8_3 - this.x16_4+this.externalPcie[index].sum)-this.valueNum; i++) {
                        if(i<=num){
                            this.externalPcie[index].externalSum.push(i)
                        }
                    }
                }
            },

            /*修改扩展柜ej20的数量，多余的就添加到内部里面，但是在一块展示*/
            recorExternal(index, num) {
                console.log(this.externalPcie[index])
                let updateExternal = `UPDATE product_programme_detail set 'component_count'='${num}' where id=${this.externalPcie[index].id} `;
                this.$db.run(updateExternal, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        console.log('修改成功', num)
                        /*重新获取x8_4,x8_3的数据*/
                        this.getNum()
                        //修改成功后，查看是不是ej0c 单数时添加一个ejgl 双数时就删掉他呗
                        //是ej0c并且是单数并且ejrl的id不存在 就添加一个
                        if(this.externalPcie[index].EJ0C&&num%2==1&&!this.externalPcie[index].EJRLId){
                            let time = new Date().getTime();
                            const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','${ this.ej0c.categoryId}','${this.ej0c.componentId}','1','${time}','${localStorage.solutionId}','${localStorage.templateId}','1')`;
                            let inquireId =`select id from product_programme_detail where seq_Key='${time}'`
                            this.$db.run(updateSql, (err, res) => {
                                if (err) {
                                    console.log('添加失败');
                                } else {
                                    console.log('添加成功、查询id')
                                    this.$db.get(inquireId,(err,res)=>{
                                        if(err){
                                            console.log('查询失败')
                                        }else{
                                            console.log('查询id成功',res)
                                            this.externalPcie[index].EJRLId=res.id
                                        }
                                    })
                                }
                            })
                        }
                        //是ej0c 并且是双数，而且ejrl的id存在
                        if(this.externalPcie[index].EJ0C&&num%2==0&&this.externalPcie[index].EJRLId){
                            let deleteId=`delete from product_programme_detail where id=${this.externalPcie[index].EJRLId}`
                            this.$db.run(deleteId,(err,res)=>{
                                if(err){
                                    console.log('删除失败',deleteId)
                                }else{
                                    this.externalPcie[index].EJRLId=''
                                    console.log('删除成功')
                                }
                            })
                        }
                    }
                })
            },

            /*---------------------------------------内部PCIE-------------------------------------------------*/
            //获取数据提示
            all(index, fun) {
                const SQL = index;
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        fun(res, err);
                    }
                });
            },

            // 根据前面获取去的数据，动态获取要展示的数据
            async getPcie(index, ind) {

                // 进来查看库里是不是 HBA 启动位置
                let startHBA=true //判断是不是最后一个
                let start=false  //判断是不是最后一个并且用它启动
                this.arr.forEach((item,inde)=>{
                    if(item.interiorVal==this.arr[ind].interior&&inde!=ind){
                        console.log('应该进来的')
                        return  startHBA=false
                    }
                })

                if(startHBA){
                    /*
                    * 获取 已选中 的系统启动位置
                    * */
                    await new Promise((resolve,reject)=>{
                        let SQL=`SELECT info.component_FC,other.id FROM product_programme_detail detail
join component_other other on other.category_id=detail.category_id and other.id=detail.component_id
join component_base_info info on info.id=other.base_info_id
where detail.product_id= '${localStorage.productId}' AND solution_id = '${localStorage.solutionId}' AND template_id ='${localStorage.templateId}' AND machine_id ='${localStorage.machineId}' and other.category_id=38`
                        console.log(SQL)
                        this.$db.get(SQL,(err,res)=>{
                            console.log(res)
                            if(err){
                                console.log('查询失败 HBA启动规则',SQL)
                            }else{
                                console.log('查询成功 HBA启动规则',res)
                                if(res){
                                    if(res.component_FC=='0837'&&this.arr[ind].interior==2){
                                        start = true
                                        console.log(this.arr[ind].interior,'最后一个')
                                    }
                                }
                                return resolve()
                            }
                        })
                    })
                }
                if(start){
                    //console.log('启动为HBA,所以不可以进行删除')
                    this.err(this.$t('error.cannotDelete'))
                    this.arr[ind].interiorVal = this.arr[ind].interior;
                    return
                }

                this.arr[ind].interior = index;
                console.log(index,this.arr[ind].flag)
                const LAN=`select detail.* from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id = detail.component_id
where io.id in (select io.id from component_iocard io
join component_pcie_classification cpc on cpc.id=io.PCI_Catagory_id
join component_base_info info on info.id= io.base_info_id
where cpc.id=1 and info.productId=2)
and solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId} and detail.is_expansion=1`
                console.log(LAN)
                this.$db.all(LAN,(err,res)=>{

                    if(err){
                        console.log('查询失败')
                    }else{
                        console.log(res,'查询成功')
                        console.log(res)

                        if(this.arr[ind].flag == 0 && res.length == 1){
                            this.err(this.$t('error.wholeSystem'))
                            //'整系统内必须有至少一个LAN卡'
                            this.arr[ind].interiorVal = 0;
                            return false;
                        }

                        this.arr[ind].interiorDow = 1;
                        const cpieC = `select info.description,info.description_en,io.PCI_E_generation,io.PCI_E_size,io.id,info.status,info.withdraw_date from component_base_info info
join component_iocard io on io.category_id=info.category_id and io.base_info_id=info.id
join component_pcie_classification pc on pc.id=io.PCI_Catagory_id
where info.productId=2 and io.PCI_Catagory_id=${index + 1} and io.PCIelocal in (0,1)`;
                        console.log(cpieC)
                        this.all(cpieC, res => { // 选卡时的事件
                            // 动态获取配置的选项
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

                            //brr里面记录过的，就把他删除掉，因为上面已经选择过了
                            res = res.filter((item, i) => {//获取到数据后，
                                for (let j = 0; j < this.brr.length; j++) {
                                    if (item.id == this.brr[j]) {
                                        return false;
                                    }
                                }
                                return true;
                            });

                            console.log(res)
                            res = res.filter((item, i) => {
                                if (this.x8_4 + this.x16_4 >= (this.cpu == 1 ? 2 : 5)) {
                                    if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {// 如果数量够了，就不再显示
                                        return false;
                                    } else if (item.PCI_E_size == 2) {// 如果数量够了，就不再显示
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }
                                if (this.x16_4 >= (this.cpu == 1 ? 1 : 3)) {
                                    if (item.PCI_E_size == 2) {// 如果数量够了，就不再显示
                                        return false;
                                    }
                                    return true;
                                }
                                return true
                            })
                            this.arr[ind].options = [...res];//这个是后面具体展示的内容
                            this.arr[ind].optionsAl = [...res];//这个是最原始的内容，操作的时候操作他，再给options赋值
                            //this.getRec(1,ind,this.arr[ind].value)//过滤一遍
                            this.arr[ind].value = this.arr[ind].options.length == 0 ? '没有可以匹配的' : this.arr[ind].options[0].id;// 默认展示第一个值,如果没有值显示没有匹配的
                            this.brr.splice(ind, 1);//点击前面的时候，把brr里面的数据删掉，
                            // this.arr[ind].optionsVal = resValue == 0 ? '没有可以匹配的' : res[0].PCI_E_desc_cn;// 默认展示第一个值,如果没有值显示没有匹配的
                            this.arr[ind].splice(9, 0);// 触发刷新页面
                            console.log(this.x16_4, this.x8_4, this.x8_3, this.arr, res);
                            if (res.length > 0) {
                                this.recor(this.arr[ind].value, ind, 1)//这个是选择类型后，重新往库里提交一条数据
                            }
                        });

                        this.arr[ind].flag = index;
                    }
                })

            },

            //点击选择框时的操作
            getRec(value, ind, index) {
                if (value) {//如果为true的时候为打开选择框，
                    // 动态获取配置的选项
                    let num=0
                    this.arr.forEach((item,i)=>{
                        console.log(item)
                        if(i!=ind){
                            num+=item.interiorDow*1
                        }
                    })
                    this.externalPcie.forEach(item=>{
                        console.log(item)
                        num+=item.sum*1
                    })
                    console.log(num,this.cpuNum)
                    if(num>=this.cpuNum){
                        this.arr[ind].options=[]
                        this.$forceUpdate();
                        return
                    }
                    let gettime= new Date().getTime() //获取现在的时间戳
                    let resValue = this.arr[ind].optionsAl.filter((item,ind) => {//过滤一遍，已经有了的不显示在选择框内
                        if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
                            return false //如果时间小于现在时间，也就说过市了，不在显示
                        }
                        let num = true;
                        if (this.externalPcieId == item.id) {
                            return false
                        }
                        for (let j = 0; j < this.brr.length; j++) {
                            if (this.brr[j] == item.id && item.id != index) {
                                return num = false;
                            }
                        }
                        return num;
                    });
                    let blNum = [0, 0, 0];//这个是如果选择完了，再次回去选择的话就为空，因为都选过了，所以把点击的这个记录下来，
                    if (this.arr[ind].PCI_E_size == 1 && this.arr[ind].PCI_E_generation != 4) {
                        blNum[2] = this.arr[ind].interiorDow
                    }
                    if (this.arr[ind].PCI_E_size == 1 && this.arr[ind].PCI_E_generation == 4) {
                        blNum[1] = this.arr[ind].interiorDow
                    }
                    if (this.arr[ind].PCI_E_size == 2) {
                        blNum[0] = this.arr[ind].interiorDow
                    }
                    console.log(this.x16_4, this.x8_4, this.x8_3, blNum,this.brr,gettime,resValue)
                    if (this.x16_4 - blNum[0] >= (this.cpu == 1 ? 1 : 3)) {//点击自己时把自己去掉
                        resValue = resValue.filter((item, i) => {
                            if (item.PCI_E_size == 2) {// 如果数量够了，就不再显示
                                return false;
                            }
                            return true;

                        });
                    }
                    if (this.x8_4 - blNum[1] - blNum[0] >= (this.cpu == 1 ? 2 : 5)) {//点击自己时把自己去掉
                        resValue = resValue.filter((item, i) => {
                            if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {// 如果数量够了，就不再显示
                                return false;
                            }
                            return true;

                        });
                    }
                    // if(this.x8_4){//这个是判断x8_4有没有值，有的话执行，没有的话else
                    //     if(this.cpu==1&&this.x8_4>=1){
                    //         if (this.x8_3 -blNum[2]-blNum[1] >= 6) {//点击自己时把自己去掉
                    //             resValue = resValue.filter((item, i) => {
                    //                 if (item.PCI_E_size == 1) {
                    //                     // 如果数量够了，就不再显示
                    //                     return false;
                    //                 }
                    //                 return true;
                    //
                    //             });
                    //         }
                    //     }
                    //     if(this.cpu==2&&this.x8_4==1){
                    //         if (this.x8_3 -blNum[2]-blNum[1]>= 7) {
                    //             resValue = resValue.filter((item, i) => {
                    //                 if (item.PCI_E_size == 1) {
                    //                     // 如果数量够了，就不再显示
                    //                     return false;
                    //                 }
                    //                 return true;
                    //
                    //             });
                    //         }
                    //     }
                    //     if(this.cpu==2&&this.x8_4==2){
                    //         if (this.x8_3-blNum[2]-blNum[1] >= 6) {
                    //             resValue = resValue.filter((item, i) => {
                    //                 if (item.PCI_E_size ==1 ) {
                    //                     // 如果数量够了，就不再显示
                    //                     return false;
                    //                 }
                    //                 return true;
                    //
                    //             });
                    //         }
                    //     }
                    // }else{
                    //     if(this.cpu==1){
                    //         if (this.x8_3 -blNum[2]-blNum[1]>= 7) {
                    //             resValue = resValue.filter((item, i) => {
                    //                 if (item.PCI_E_size == 1) {
                    //                     // 如果数量够了，就不再显示
                    //                     return false;
                    //                 }
                    //                 return true;
                    //
                    //             });
                    //         }
                    //     }else{
                    //         if (this.x8_3-blNum[2]-blNum[1]>= 8) {
                    //             resValue = resValue.filter((item, i) => {
                    //                 if (item.PCI_E_size == 1) {
                    //                     // 如果数量够了，就不再显示
                    //                     return false;
                    //                 }
                    //                 return true;
                    //
                    //             });
                    //         }
                    //     }
                    //
                    // }
                    this.arr[ind].options = [...resValue];//过滤后的值
                    console.log(this.arr, resValue, this.brr, index, ind, this.arr[ind].options);
                    this.$forceUpdate();
                }
            },

            //添加或者修改数据
            recor(index, ind, num,value) {
                console.log(value);
                if (this.arr[ind].options.length < 1) {
                    // this.error='您选的参数不存在，请重新选择'
                    // this.open()
                    return
                }
                if (index == 0) {
                    index = this.arr[ind].options[0].id;
                }
                if (this.arr[ind].upid) {//如果upid存在说明库里有数据，所以修改
                    console.log(index, ind, num);
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='${index}' where id=${this.arr[ind].upid} `;

                    this.$db.run(updateSql, (err, res) => {
                        console.log(res, err);
                        if (res) {
                            console.log('修改失败');
                        } else {
                            /*查询库里HBA的数量去添加或修改他匹配的连接线*/
                            this.getHBA()
                            console.log('修改成功');
                            this.arr[ind].interiorDow = num;
                            console.log(this.arr[ind].interiorDow, num)
                            this.brr[ind] = index;
                            this.arr[ind].options.forEach(item => {
                                if (item.id == index) {
                                    this.arr[ind].PCI_E_generation = item.PCI_E_generation
                                    this.arr[ind].PCI_E_size = item.PCI_E_size
                                }
                            })
                        }
                        /*获取product_programme_detail  数据*/
                        const PCI_Catagory_id = `
      select info.name,detail.component_count,detail.category_id,io.PCI_E_generation,io.PCI_E_size,info.status from component_base_info info
                      join component_iocard io on info.id = io.base_info_id
                             join product_programme_detail detail on io.id=detail.component_id and  detail.category_id=${this.$route.query.sign}

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select io.base_info_id from component_iocard io
                            where io.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}'
                            and template_id='${localStorage.templateId}' and detail.product_id='${localStorage.productId}'
                             and machine_id='${localStorage.machineId}' and is_expansion='1'

       union


      select info.name,detail.component_count,detail.category_id,info.description,mem.category_id,info.status from component_base_info info
                            join component_memory mem on info.id = mem.base_info_id
                            join product_programme_detail detail on mem.id=detail.component_id and  detail.category_id=2

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select mem.base_info_id from component_memory mem
                            where mem.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}'
                            and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}'
                            and machine_id='${localStorage.machineId}' and is_expansion='1'`;
                        console.log(PCI_Catagory_id)
                        this.$db.all(PCI_Catagory_id, (err, res) => {
                            console.log(res)
                            const pci = [];// 获取库里pci的值
                            const mem = [];// 获取库里内存的值
                            let memNum = 0;// 默认库内存的值为0 ，
                            let x8_3 = 0; // 默认x8_3的值我0
                            let x8_4 = 0; // 默认x8_3的值我0
                            let x16_4 = 0; // 默认x8_3的值我0
                            res.forEach(item => {
                                if (item.category_id == 6) {
                                    return pci.push(item);
                                }
                                if (item.category_id == 2) {
                                    return mem.push(item);
                                }
                            });
                            mem.forEach(item => {
                                memNum += item.component_count;
                            });
                            pci.forEach(item => {
                                if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {
                                    return x8_4 += item.component_count;
                                }
                                if (item.PCI_E_size == 1 && item.PCI_E_generation != 4) {
                                    return x8_3 += item.component_count;
                                }
                                if (item.PCI_E_size == 2) {
                                    return x16_4 += item.component_count;
                                }
                            });
                            if(value == 0){
                                this.arr[ind].flag = value;
                                console.log('this.arr[ind].flag',this.arr[ind].flag)
                            }

                            console.log(res, err, x16_4, x8_3, x8_4);
                        });
                    });

                } else {//要不然的话添加
                    console.log('没记录：：：');
                    const time = new Date().getTime();
                    const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.$route.query.sign}','${index}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','1')`;
                    this.$db.run(updateSql, (err, res) => {
                        if (err) {
                            console.log('添加失败');
                        } else {
                            /*查询库里HBA的数量去添加或修改他匹配的连接线*/
                            this.getHBA()
                            console.log('添加成功' + JSON.stringify(res));
                            const selectSql = `select * from product_programme_detail where seq_Key=${time} and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='1'`;
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
                                    this.arr[ind].upid = res.id;
                                    this.arr[ind].interiorDow = res.component_count;
                                    this.arr[ind].options.forEach(item => {
                                        if (item.id == this.arr[ind].value) {
                                            console.log(111111, 2, item.PCI_E_size)
                                            this.arr[ind].PCI_E_size = item.PCI_E_size;
                                            this.arr[ind].PCI_E_generation = item.PCI_E_generation;
                                            this.arr[ind].splice(9, 0);
                                        }
                                    });
                                    console.log(this.brr, this.arr[ind]);
                                }
                            });
                        }

                        if(value == 0){
                            this.arr[ind].flag = value;
                            console.log('this.arr[ind].flag',this.arr[ind].flag)
                        }
                        // this.brr[ind]=index;
                        this.$set(this.brr, ind, index);

                    });
                }
                this.getNum();
                console.log(this.arr);
            },

            //点击的时候可选的数量
            getList(event, index,id) {
                console.log(this.cpu, this.x8_4, this.x8_3, this.x16_4, this.arr, index,id);
                if (this.arr[index].interiorDow < 1) {
                    return
                }
                if (event) {
                    let than = this;
                    const cpuNum =`select  relation.*,io.PCI_E_generation,io.PCI_E_size from relation_cpu_PCIe relation  join component_iocard io on io.id=relation.PCIe_id  join component_base_info info on info.id=io.base_info_id  where info.productId=2 and io.id = '${id}' and relation.cnt_type=1`

                    console.log(cpuNum)
                    new Promise(function (resolve, reject) {
                        than.$db.all(cpuNum, (err, res) => {
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
                    }).then(res=>{
                        console.log('获取成功',res)
                        res.forEach(item=>{
                            if(item.cpu_cnt == this.cpu){
                                this.arr[index].sumNum  =  item.PCIe_cnt;
                                this.arr[index].PCI_E_size  =  item.PCI_E_size;
                                this.arr[index].PCI_E_generation  =  item.PCI_E_generation;
                            }
                        })

                        for (let i = 0; i < this.arr.length; i++) {

                            if (this.arr[i].PCI_E_size == 2) {
                                // 获取的X16 GEN4数量
                                this.arr[i].num = (this.cpu == 2 ? 4 : (this.cpu == 3 ? 6 : 8)) - this.x16_4-this.valueNum  ;
                            }
                            if (this.arr[i].PCI_E_size == 1 && this.arr[i].PCI_E_generation == 4) {
                                // 获取的X8 GEN4数量
                                this.arr[i].num = (this.cpu == 2 ? 6 : (this.cpu == 3 ? 8 : 10)) - this.x8_4 - this.x16_4-this.valueNum;
                            }
                            if (this.arr[i].PCI_E_size == 1 && this.arr[i].PCI_E_generation != 4) {
                                // 获取的X8 GEN3数量
                                this.arr[i].num = (this.cpu == 2 ? 7 : (this.cpu == 3 ? 9 : 11)) - this.x8_4 - this.x16_4 - this.x8_3-this.valueNum;
                            }
                        }

                        if(this.arr[index].num >= this.arr[index].sumNum){
                            this.arr[index].num = this.arr[index].sumNum - this.arr[index].interiorDow;
                            console.log(this.arr[index].num)
                        }

                        if (this.arr[index].PCI_E_size == 2) {
                            this.arr[index].num += this.arr[index].interiorDow
                        }
                        if (this.arr[index].PCI_E_size == 1 && this.arr[index].PCI_E_generation == 4) {
                            this.arr[index].num += this.arr[index].interiorDow
                        }
                        if (this.arr[index].PCI_E_size == 1 && this.arr[index].PCI_E_generation != 4) {
                            this.arr[index].num += this.arr[index].interiorDow
                        }

                        let num=(this.cpu == 2 ? 7 : (this.cpu == 3 ? 9 : 11)) - this.x8_4 - this.x16_4 - this.x8_3 + this.arr[index].interiorDow-this.valueNum;
                        if(num<this.arr[index].num){
                            this.arr[index].num=num
                        }

                        this.$forceUpdate();
                    })
                }

            },

            //获取 this.x16_4、this.x8_4、this.x8_3 的值
            getNum(ind, add) {
                this.x16_4 = 0; // 默认的值cpu为一时
                this.x8_4 = 0;// 默认的值cpu为一时
                this.x8_3 = 0;// 默认的值cpu为一时
                // }
                const SQL = `select PCI_E_generation,PCI_E_size ,component_count from component_iocard pp cross join product_programme_detail ppd on pp.id=ppd.component_id and ppd.category_id=${this.$route.query.sign} where ppd.component_id in( select ppd.component_id from product_programme_detail ppd where ppd.product_id='${localStorage.productId}' and ppd.category_id=${this.$route.query.sign} ) and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}' and is_expansion='1' and ppd.product_id='${localStorage.productId}'`;
                console.log(SQL)
                this.all(SQL, (res, err) => {
                    console.log(res)
                    this.x16_4 = 0; // 默认的值cpu为一时
                    this.x8_4 = 0;// 默认的值cpu为一时
                    this.x8_3 = 0;// 默认的值cpu为一时
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].PCI_E_size == 2) {
                            // 获取的X16 GEN4数量
                            this.x16_4 += (1 * res[i].component_count);
                        }
                        if (res[i].PCI_E_size == 1 && res[i].PCI_E_generation == 4) {
                            // 获取的X8 GEN4数量
                            this.x8_4 += (1 * res[i].component_count);
                        }
                        if (res[i].PCI_E_size == 1 && res[i].PCI_E_generation != 4) {
                            // 获取的X8 GEN3数量
                            this.x8_3 += (1 * res[i].component_count);
                        }
                    }
                    if (ind == 1) {
                        add = 1
                    }
                    console.log(this.x16_4,this.x8_3, this.x8_4)
                });
            },

            //删除数据
            async deletePci(id, ind,val, value) {

                // 进来查看库里是不是 HBA 启动位置
                let startHBA=true //判断是不是最后一个
                let start=false  //判断是不是最后一个并且用它启动
                this.arr.forEach((item,index)=>{
                    if(item.interiorVal==this.arr[ind].interiorVal&&index!=ind){
                        console.log('应该进来的')
                        return  startHBA=false
                    }
                })

                if(startHBA){
                    /*
                    * 获取 已选中 的系统启动位置
                    * */
                    await new Promise((resolve,reject)=>{
                        let SQL=`SELECT info.component_FC,other.id FROM product_programme_detail detail
join component_other other on other.category_id=detail.category_id and other.id=detail.component_id
join component_base_info info on info.id=other.base_info_id
where detail.product_id= '${localStorage.productId}' AND solution_id = '${localStorage.solutionId}' AND template_id ='${localStorage.templateId}' AND machine_id ='${localStorage.machineId}' and other.category_id=38`
                        console.log(SQL)
                        this.$db.get(SQL,(err,res)=>{
                            console.log(res)
                            if(err){
                                console.log('查询失败 HBA启动规则',SQL)
                            }else{
                                console.log('查询成功 HBA启动规则',res)
                                if(res){
                                    if(res.component_FC=='0837'&&this.arr[ind].interiorVal==2){
                                        start = true
                                        console.log(this.arr[ind].interiorVal,'最后一个')
                                    }
                                }
                                return resolve()
                            }
                        })
                    })
                }
                if(start){
                    //console.log('启动为HBA,所以不可以进行删除')
                    this.err(this.$t('error.cannotDelete'))
                    return
                }

                const LAN=`select detail.* from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id = detail.component_id
where io.id in (select io.id from component_iocard io
join component_pcie_classification cpc on cpc.id=io.PCI_Catagory_id
join component_base_info info on info.id= io.base_info_id
where cpc.id=1 and info.productId=2)
and solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId} and detail.is_expansion=1`
                this.$db.all(LAN,(err,res)=>{

                    if(err){
                        console.log('查询失败')
                    }else{
                        console.log('查询成功',res)

                        let interiorValNum = 0;
                        this.arr.forEach(item=>{
                            if(item.interiorVal == 0){
                                interiorValNum++;
                            }
                        })

                        if(val == 0 && res.length == 1 && interiorValNum == 1){
                            this.err(this.$t('error.wholeSystem'))
                            //'整系统内必须有至少一个LAN卡'
                            return false;
                        }

                        id = (this.arr[ind].upid ? this.arr[ind].upid : '');

                        if (id) {
                            const deleteSQL = `DELETE FROM product_programme_detail WHERE id = ${this.arr[ind].upid}`;
                            this.$logger(deleteSQL);
                            this.$db.run(deleteSQL, (err, res) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$db.run('ROLLBACK');
                                    this.$Notice.error({
                                        title: '删除失败',
                                        desc: err,
                                    });
                                }
                            });
                        }

                        for (let i = 0; i < this.arr[ind].options.length; i++) {
                            if (this.arr[ind].options[i].id == id) {
                                if (this.arr[ind].options[i].PCI_E_generation == 3 && this.arr[ind].options[i].PCI_E_size == 1) {
                                    this.x8_3 -= this.arr[ind].interiorDow;
                                }
                                if (this.arr[ind].options[i].PCI_E_generation == 4 && this.arr[ind].options[i].PCI_E_size == 1) {
                                    this.x8_4 -= this.arr[ind].interiorDow;
                                }
                            }
                        }
                        // this.arr[index].optionsVal
                        // this.brr = this.brr.filter(item => {
                        //   if (item == id) {
                        //     return false;
                        //   }
                        //   return true;
                        // });
                        this.brr.splice(ind, 1);
                        if (value) {
                            this.arr[ind].splice(9, 1);
                        } else {
                            this.arr.splice(ind, 1);
                        }

                        this.getNum();
                        this.getHBA();
                    }
                })

            },

            addCard() {
                if (this.arr[this.arr.length - 1].value == '没有可以匹配的') {
                    return;
                }
                console.log(this.arr)
                if (this.arr[this.arr.length - 1].value == 0) {
                    return;
                }
                if ((this.x8_4 + this.x8_3 + this.x16_4+this.valueNum) >= this.cpuNum || this.arr.length+this.valueNum >=  this.cpuNum) {
                    return;
                }
                let add = 0
                this.getNum(1, add);
                this.arr.push([...this.interiorTop]);
                const value = this.arr.length - 1;
                this.arr[this.arr.length - 1].options = [...this.pcieS];
                this.arr[this.arr.length - 1].optionsAl = [...this.pcieS];
                this.arr[this.arr.length - 1].value = '';
                this.arr[this.arr.length - 1].interiorVal = 0;
                this.arr[this.arr.length - 1].interior = 0;
                this.arr[this.arr.length - 1].PCI_E_size = -1;
                this.arr[this.arr.length - 1].PCI_E_generation = -1;
                this.arr[this.arr.length - 1].flag = -1;  // 记录上一次的  pcie 类型
                this.arr[this.arr.length - 1].num = 0;
                this.arr[this.arr.length - 1].interiorDow='';
                this.arr[this.arr.length - 1].bool=false;
                this.arr[this.arr.length - 1].sumNum = 0;

                this.$forceUpdate()
                console.log(this.arr, add);
            },

            getsql(index, fun) {
                const SQL = index;
                this.$db.get(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        fun(res);
                    }
                });
            },

            /*查询库里HBA的数量去添加或修改他匹配的连接线*/
            getHBA() {

                let sQL = `select sum(component_count) detail_sum_count from product_programme_detail detail
 join component_iocard io on detail.category_id=io.category_id and detail.component_id=io.id
 join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id and pcie.id=3 where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                console.log(sQL)
                /*查询记录HBA连接线的id*/
                let getSQL = `select  detail.id detail_id,detail.category_id,detail.component_id,detail.component_count from product_programme_detail detail join component_other other on detail.category_id=other.category_id and detail.component_id=other.id and other.category_id=39 join component_base_info info on info.id=other.base_info_id
where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and info.component_FC='ECW0'`
                console.log(getSQL)
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
                        let num = res.detail_sum_count;
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
                                if (res) {
                                    if (num === null) {
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
                                            console.log('修改成功,39_59')
                                        }
                                    })
                                } else {
                                    /*如果数量为null的话就直接退出去*/
                                    if (num == null) {
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
                                            console.log('添加成功,39_59')
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            },

            // 获取库里ej20的数
            getEJ20() {

                let getEj20 = `select detail.id,detail.component_id,detail.component_count,detail.is_expansion,info.description_en,info.description,io.PCI_E_size,
pcie.pcie_type,info.status,info.withdraw_date,info.title_msg,info.ui_status from  product_programme_detail detail
 join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
 join component_base_info info on info.id=io.base_info_id
 join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id
 where  info.component_FC='EJ20' and is_expansion = 1 and product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}'`
                console.log(getEj20)

                // 获取库里外部扩展柜内瓤的数
                let externalPcieSQL = `select detail.category_id,detail.component_id,detail.component_count from product_programme_detail detail
join component_expansionflesh flesh on flesh.category_id=detail.category_id and flesh.id=detail.component_id
where detail.is_expansion=0 and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'`
                console.log(externalPcieSQL)

                /*获取外部硬盘的占用多少内部pcie插槽的数量*/
                let hardDiskSQL=`select  detail.id,detail.component_count,detail.component_id,info.description, info.description_en,pcie.pcie_type,io.PCI_E_size,info.status,info.withdraw_date,info.title_msg,info.ui_status from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
join component_base_info info on info.id=io.base_info_id
join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id
where  product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.is_expansion=1`//and detail.is_expansion=1暂时不写
                console.log(hardDiskSQL)

                /*ej0j的数量*/
                let ej0jSQL=`select detail.id,detail.component_count,mode.card_base_cnt from product_programme_detail detail
join component_disk_modeoption mode on mode.category_id=detail.category_id and mode.id=detail.component_id
where product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.is_expansion=1`//暂时不写
                console.log(ej0jSQL)

                //这个是获取外部pcie的东西
                this.$db.get(externalPcieSQL, (err, res) => { // 获取库里外部扩展柜内瓤的数
                    console.log(res)
                    if (res) {
                        this.externalNum = res.component_count
                        console.log(res,this.externalNum)
                        this.$db.get(getEj20, (err, res) => { // 获取库里ej20的数
                            console.log(getEj20, res)
                            if (res) {
                                let obj = {
                                    max: this.externalNum,//要展示的最小数
                                    description_en: 0,//ej20的具体描述
                                    pcie_type: 0,//ej20的类型
                                    type:[{type:res.pcie_type}],//选择展示的类型
                                    description:[{type:res.description,description_en:res.description_en}],//选择展示的ej20的类型
                                    id: res.id,//默认带出ej20的id
                                    sum: res.component_count,//要展示的数量
                                    externalSum: [],//ej20的展开的数量
                                    PCI_E_size:res.PCI_E_size//类型X8或者X16
                                }
                                this.$set(obj,'temponTit',res.title_msg) //展示的描述
                                this.$set(obj,'setTimeMe',res.withdraw_date)//过期的时间
                                if(res.withdraw_date){
                                    //如果不为null的话,就改为天数
                                    this.$store.commit('setStatusTime',res.withdraw_date)
                                    this.$set(obj,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                }
                                this.$store.commit('uiStatusTime',res.ui_status)
                                this.$set(obj,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                this.$set(obj,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                this.externalPcieId = res.component_id//要储存的component_id
                                this.externalPcie = []//没有的话删掉这个数组有的话重新赋值
                                if (this.externalNum) {
                                    this.externalPcie.push(obj)
                                    console.log(this.externalPcie)
                                    if (this.arr.length > 0) {
                                        this.arr = this.arr.filter(item => {
                                            if (item.value == this.externalPcieId) {
                                                this.arrA = item
                                                return false
                                            } else {
                                                return true
                                            }
                                        })
                                    }
                                }
                                console.log(this.arr)
                            }
                            //这个是获取外部硬盘的数据
                            this.$db.all(ej0jSQL, (err, res) => { // 获取库里外部扩展柜内瓤的数
                                console.log(res)
                                if (res.length) {
                                    let num=0
                                    res.forEach(item=>{
                                        num+=item.component_count*item.card_base_cnt
                                    })
                                    this.hardDiskNum = num//这个是外部硬盘占用的数量
                                    console.log(res,this.hardDiskNum)
                                    this.$db.get(hardDiskSQL, (err, res) => {// 获取库里ej0j的数 hardDiskId:hardDiskNum:arrB
                                        console.log(res)
                                        if (res) {
                                            let obj = {
                                                max: this.hardDiskNum,//要展示的最小数
                                                description_en: 0,//ej0j的具体描述
                                                pcie_type: 0,//ej0j的类型
                                                type:[{type:res.pcie_type}],//选择展示的类型
                                                description:[{type:res.description,description_en:res.description_en}],//选择展示的ej0j的类型
                                                id: res.id,//默认带出ej0j的id
                                                sum: res.component_count,//要展示的数量
                                                externalSum: [],//ej0j的展开的数量
                                                PCI_E_size:res.PCI_E_size//类型X8或者X16
                                            }
                                            this.$set(obj,'temponTit',res.title_msg) //展示的描述
                                            this.$set(obj,'setTimeMe',res.withdraw_date)//过期的时间
                                            if(res.withdraw_date){
                                                //如果不为null的话,就改为天数
                                                this.$store.commit('setStatusTime',res.withdraw_date)
                                                this.$set(obj,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                            }
                                            this.$store.commit('uiStatusTime',res.ui_status)
                                            this.$set(obj,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                            this.$set(obj,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                            this.hardDiskId = res.component_id//要储存的component_id
                                            this.externalPcie.splice(1)//有的话删掉数组1下标以后的东西
                                            if (this.hardDiskNum) {
                                                this.externalPcie.push(obj)
                                                console.log(this.externalPcie)
                                                if (this.arr.length > 0) {
                                                    this.arr = this.arr.filter(item => {
                                                        if (item.value == this.externalPcieId) {
                                                            this.arrB = item
                                                            return false
                                                        } else {
                                                            return true
                                                        }
                                                    })
                                                }
                                                this.getNum()
                                            }
                                            console.log(this.arr)
                                        }
                                    })
                                }else{
                                    this.externalPcie.splice(1)//有的话删掉数组1下标以后的东西
                                    this.hardDiskId=''//让ej0j展示出来
                                    this.$db.get(ej0jSQL, (err, res) => { // 获取库里ej0j的数
                                        console.log(ej0jSQL, res)
                                        if(res){
                                            if (this.arrB.length>0) {
                                                this.arrB.interiorDow=res.component_count
                                                this.arr.push(this.arrB)
                                                this.brr.push(this.arrB.value)
                                                this.arrB=[]
                                            }
                                        }
                                    })
                                    this.getNum()
                                }
                            })
                        })
                    }else{
                        this.externalPcie = []//没有的话删掉这个数组有的话重新赋值
                        this.externalPcieId=''//让ej20展示出来
                        this.$db.get(getEj20, (err, res) => { // 获取库里ej20的数
                            if (res) {
                                if(this.arrA.length>0){
                                    this.arrA.interiorDow=res.component_count
                                    this.arr.push(this.arrA)
                                    this.brr.push(this.arrA.value)
                                    this.arrA=[]
                                    console.log(getEj20, res,this.arr)
                                }
                            }
                        })
                        //这个是获取外部硬盘的数据
                        this.$db.all(ej0jSQL, (err, res) => { // 获取库里外部扩展柜内瓤的数
                            console.log(res)
                            if (res.length>0) {
                                let num=0
                                res.forEach(item=>{
                                    num+=item.component_count*item.card_base_cnt
                                })
                                this.hardDiskNum = num//这个是外部硬盘占用的数量
                                console.log(res,this.hardDiskNum)
                                this.$db.get(hardDiskSQL, (err, res) => { // 获取库里ej20的数 hardDiskId:hardDiskNum:arrB
                                    if (res) {
                                        let obj = {
                                            max: this.hardDiskNum,//要展示的最小数
                                            description_en: 0,//ej0j的具体描述
                                            pcie_type: 0,//ej0j的类型
                                            type:[{type:res.pcie_type}],//选择展示的类型
                                            description:[{type:res.description,description_en:res.description_en}],//选择展示的ej0j的类型
                                            id: res.id,//默认带出ej0j的id
                                            sum: res.component_count,//要展示的数量
                                            externalSum: [],//ej0j的展开的数量
                                            PCI_E_size:res.PCI_E_size//类型X8或者X16
                                        }
                                        this.$set(obj,'temponTit',res.title_msg) //展示的描述
                                        this.$set(obj,'setTimeMe',res.withdraw_date)//过期的时间
                                        if(res.withdraw_date){
                                            //如果不为null的话,就改为天数
                                            this.$store.commit('setStatusTime',res.withdraw_date)
                                            this.$set(obj,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                        }
                                        this.$store.commit('uiStatusTime',res.ui_status)
                                        this.$set(obj,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                        this.$set(obj,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                        this.hardDiskId = res.component_id//要储存的component_id
                                        this.externalPcie = []//没有的话删掉这个数组有的话重新赋值
                                        if (this.hardDiskNum) {
                                            this.externalPcie.push(obj)
                                            console.log(this.externalPcie)
                                            if (this.arr.length > 0) {
                                                this.arr = this.arr.filter(item => {
                                                    if (item.value == this.externalPcieId) {
                                                        this.arrB = item
                                                        return false
                                                    } else {
                                                        return true
                                                    }
                                                })
                                            }
                                            this.getNum()
                                        }
                                        console.log(this.arr)
                                    }
                                })
                            }else{
                                this.externalPcie = []//没有的话删掉这个数组有的话重新赋值
                                this.hardDiskId=''//让ej0j展示出来
                                this.$db.get(ej0jSQL, (err, res) => { // 获取库里ej0j的数
                                    console.log(ej0jSQL, res)
                                    if (res) {
                                        if(this.arrB.length>0){
                                            this.arrB.interiorDow=res.component_count
                                            this.arr.push(this.arrB)
                                            this.brr.push(this.arrB.value)
                                            this.arrB=[]
                                        }
                                    }
                                })
                                this.getNum()
                            }
                        })
                    }
                })
            },

            /*不让删除或者是不让减少时展示*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'error'
                });
            },

           async getIok(){

                //查询库里所有的数据
                const defaltuPci = `select pp.PCI_E_generation,PCI_E_size,PCI_Catagory_id,info.description PCI_E_desc_cn,ppd.component_count,ppd.id,ppd.seq_Key,ppd.component_id,info.status from component_iocard pp
                                    cross join product_programme_detail ppd on pp.id=ppd.component_id and ppd.category_id=pp.category_id
                                    left join component_base_info info  on info.id=pp.base_info_id
                where ppd.product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}' and is_expansion='1'`;

               const cpieK = ' select id,pcie_type from component_pcie_classification';// 获取pcie的配置
               console.log(defaltuPci)
               let than=this;
               await new Promise(function (resolve, reject) {
                   than.all(cpieK, res => {
                       than.interiorTop = [...res];//iok的類型
                       return resolve();
                   })
               })
               let arr= []
               let iokArr =await new Promise((resolve, reject)=> {
                    // 假设已经进行了异步操作，并且获得了数据
                    // 获取类型里面的值
                    than.all(defaltuPci, res => {
                        res.forEach((item,index)=>{
                            arr.push([...this.interiorTop])
                            // arr[index].push([])
                        })
                        console.log(res,arr)
                        resolve(res)
                    });
                });
               console.log(iokArr,arr)
               await new Promise((reso, reject) =>{
                   // 假设已经进行了异步操作，并且获得了数据
                   // 获取类型里面的值
                   this.brr=[]
                iokArr.forEach( async (item,index)=>{
                       //根据component_id 查出 他的类型 和类型下面所有的选项
                       const iokDeSQl=`	select info.description,info.description_en,PCI_E_generation,PCI_E_size,io.id,info.status,info.withdraw_date ,io.PCI_Catagory_id from component_base_info info
						join component_iocard io on io.base_info_id = info.id
						join component_pcie_classification cpc on cpc.id=io.PCI_Catagory_id
						where cpc.id =(select PCI_Catagory_id from component_iocard where id =${item.component_id})
						and info.productId='${localStorage.productId}' and io.PCIelocal in (0,1)`
                       this.brr.push(item.component_id)
                        this.$set(arr[index],'interiorVal',item.PCI_Catagory_id - 1)// 库里面所选中的类型下标
                        this.$set(arr[index],'interior',item.PCI_Catagory_id - 1)// 库里面所选中的类型下标
                        this.$set(arr[index],'upid',item.id)// 库里面选中的id
                        this.$set(arr[index],'PCI_E_generation',item.PCI_E_generation)// 库里面所选中的代数
                        this.$set(arr[index],'PCI_E_size',item.PCI_E_size)// 库里面的类型 比如x8_3
                        this.$set(arr[index],'interiorDow',item.component_count)// 库里面的个数
                        this.$set(arr[index],'value',item.component_id)//库里面选中的id
                        this.$set(arr[index],'component_id',item.component_id)
                        this.$set(arr[index],'flag',item.PCI_Catagory_id - 1)// 记录上一次的  pcie 类型
                        this.$set(arr[index],'seq_Key',item.seq_key)// 这个是时间戳，
                        this.$set(arr[index],'num',0)
                        this.$set(arr[index],'sumNum',0)
                        this.$set(arr[index],'bool',false)
                       console.log(iokDeSQl)
                    await   new Promise((resolve,rej)=>{
                             than.all(iokDeSQl, resA => {
                              resA.forEach((item,index)=>{
                                  than.$set(resA[index],'temponTit',item.title_msg) //展示的描述
                                  than.$set(resA[index],'setTimeMe',item.withdraw_date)//过期的时间
                                  if(resA[index].withdraw_date){
                                      let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                      let time = new Date(thisTime).getTime();//将时间改为时间戳
                                      than.$set(resA[index],'time',time)//将时间戳添加到对象里面
                                      //如果不为null的话,就改为天数
                                      than.$store.commit('setStatusTime',item.withdraw_date)
                                      than.$set(resA[index],'overdueTime',than.$store.state.overdueTime) // 要过期的天数，默认为null
                                  }
                                  than.$store.commit('uiStatusTime',item.ui_status)
                                  than.$set(resA[index],'uiStatusEn',than.$store.state.statusTime.uiStatusEn)//中文的描述
                                  than.$set(resA[index],'uiStatus',than.$store.state.statusTime.uiStatus)//英文的描述
                              })
                              console.log(item, resA)
                              this.$set(arr[index],'options',[...resA])
                              this.$set(arr[index],'optionsAl',[...resA])
                              this.$set(arr[index].options,'upid',item.id)// 库里面选中的id
                                 resolve()
                                 if(index==arr.length-1){
                                     console.log(arr,index)
                                     reso()
                                 }
                          });
                      })
                  })
                   console.log(arr,this.brr)

               });
               this.x8_3=0
               this.x8_4=0
               this.x16_4=0
               than.arr=[]
               than.externalPcie=[]//扩展柜 背板带出的pcie卡
               arr.forEach((item,index)=>{
                   console.log(item.PCI_E_generation,item.PCI_E_size)
                   if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {
                        this.x8_4 += item.interiorDow;
                   }
                   if (item.PCI_E_size == 1 && item.PCI_E_generation != 4) {
                        this.x8_3 += item.interiorDow;
                   }
                   if (item.PCI_E_size == 2) {
                        this.x16_4 += item.interiorDow;
                   }
                   if(this.arr.length==0){
                       return this.arr.push(item)
                   }
                   //如果有重复的id就合并，数量相加
                   for (let i=0;i<=this.arr.length;i++){
                       if(i==this.arr.length){
                           console.log(i,index,arr.length)
                           return this.arr.push(item)
                       }
                       if(this.arr[i].component_id==item.component_id){
                           console.log(i,index,this.arr[i].component_id,item.component_id)
                           return this.arr[i].interiorDow+=item.interiorDow
                       }
                   }
               })
               let brr=[...arr]
               console.log(this.arr,arr,this.x8_3,this.x8_4,this.x16_4,brr)
               //查看外部pcie占用的数
             let nudeO= await new Promise((resolve,reject)=>{//返回res 没有的话就是undefind
                  let iokPice=`select detail.component_count from product_programme_detail detail
		join component_expansionflesh flesh on flesh.category_id=detail.category_id and flesh.id=detail.component_id
		where   product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}'`
                  this.$db.get(iokPice,(err,res)=>{
                      if(err){
                          console.log('查询数据失败pcie扩展柜')
                      }else{
                          console.log('查询pcie扩展柜成功',res)
                          resolve(res)
                      }
                  })
               })
               if(nudeO){ //如果不为加的话就执行 查出ej20的id
                   let ej20=`	select io.id,info.description,info.description_en,cpc.pcie_type from component_iocard io
		join component_base_info info on info.id=io.base_info_id
		join component_pcie_classification cpc on cpc.id=io.PCI_Catagory_id
		where info.productId='${localStorage.productId}' and io.id =(
		select relation.iocard_id from relation_expansioncase_iocard relation
		join component_expansioncase expan on expan.id=relation.expansioncase_id
		join component_base_info info on info.id=expan.base_info_id
		where info.productId='${localStorage.productId}')`
                   await new Promise((resolve,reject)=>{
                       this.$db.get(ej20,(err,res)=>{
                           if(err){
                               console.log('查询ej20的数据失败')
                           }else{
                               console.log('查询ej20的数据成功',res)
                               this.arr=this.arr.filter(item=>{
                                   if(item.value==res.id){
                                       this.externalPcie.push({
                                           max: nudeO.component_count,//要展示的最小数
                                           description_en: 0,//ej20的具体描述
                                           pcie_type: 0,//ej20的类型
                                           type:[{type:res.pcie_type}],//选择展示的类型
                                           description:[{type:res.description,description_en:res.description_en}],//选择展示的ej20的类型
                                           id: item.upid,//默认带出ej20的id
                                           sum: item.interiorDow,//要展示的数量
                                           externalSum: [],//ej20的展开的数量
                                           PCI_E_size:item.PCI_E_size,//类型X8或者X16
                                           iId:res.id,//id
                                           EJ0C:'',//用来区分EJ0C这条数据
                                           EJRLId:''//EJRL的id存不存在，也是回显的数据
                                       })
                                       return false
                                   }else{
                                       return true
                                   }
                               })
                               resolve()
                           }
                       })
                   })
               }
               //查看硬盘扩展柜占用的数
               let nudeT= await new Promise((resolve,reject)=>{//返回res 没有的话就是undefind
                   let dsikPice=`select detail.component_count,mode.card_base_cnt from product_programme_detail detail
		join component_disk_modeoption mode on mode.category_id=detail.category_id and mode.id=detail.component_id
		where   detail.product_id='${localStorage.productId}'
                and detail.template_id='${localStorage.templateId}' and detail.solution_id='${localStorage.solutionId}'
                and detail.machine_id='${localStorage.machineId}' and detail.is_expansion=1`
                   console.log(dsikPice)
                   this.$db.all(dsikPice,(err,res)=>{
                       if(err){
                           console.log('查询数据失败硬盘扩展柜')
                       }else{
                           console.log('查询硬盘扩展柜成功',res)
                           resolve(res)
                       }
                   })
               })
               if(nudeT.length>0){ //如果不为加的话就执行 查出ej20的id
                   let ej0k=`				select io.id,info.description,info.description_en,cpc.pcie_type from component_iocard io
		join component_base_info info on info.id=io.base_info_id
		join component_pcie_classification cpc on cpc.id=io.PCI_Catagory_id
		where info.productId='${localStorage.productId}' and io.id=(
		select distinct relation.iocard_id from relation_disk_modeoption_iocard relation
		join component_disk_modeoption mode on mode.id=relation.modeoption_id
		join component_base_info info on info.id=mode.base_info_id where info.productId='${localStorage.productId}')`
                   console.log(ej0k)
                   await new Promise((resolve,reject)=>{
                       this.$db.get(ej0k,(err,res)=>{
                           if(err){
                               console.log('查询ej0k的数据失败')
                           }else{
                               console.log('查询ej0k的数据成功',res)
                               let num=0
                               nudeT.forEach(item=>{
                                   num+=item.component_count*item.card_base_cnt
                               })
                               this.arr=this.arr.filter(item=>{
                                   if(item.value==res.id){
                                       this.externalPcie.push({
                                           max: num,//要展示的最小数
                                           description_en: 0,//ej0k的具体描述
                                           pcie_type: 0,//ej0k的类型
                                           type:[{type:res.pcie_type}],//选择展示的类型
                                           description:[{type:res.description,description_en:res.description_en}],//选择展示的ej0k的类型
                                           id: item.upid,//默认带出ej0k的id
                                           sum: num,//要展示的数量
                                           externalSum: [],//ej0k的展开的数量
                                           PCI_E_size:item.PCI_E_size,//类型X8或者X16
                                           iId:res.id,//id
                                           EJ0C:'',//用来区分EJ0C这条数据
                                           EJRLId:''//EJRL的id存不存在，也是回显的数据
                                       })
                                       return false
                                   }else{
                                       return true
                                   }
                               })
                               resolve()
                           }
                       })
                   })
               }

               //查看硬盘背板占用的数
               await new Promise((resolve,reject)=>{
                   let probackiok=`select relation.iocard_cnt,io.id,cpc.pcie_type,info.component_FC
						from product_programme_detail detail
						join component_backplane back on back.category_id=detail.category_id and back.id=detail.component_id
						join relation_backplane_iocard relation on relation.backplane_id=back.id
						join component_base_info info on info.id= back.base_info_id
						join component_iocard io on io.id=relation.iocard_id
						JOIN component_pcie_classification cpc on cpc.id=io.PCI_Catagory_id
						where detail.product_id='${localStorage.productId}'
                and detail.template_id='${localStorage.templateId}' and detail.solution_id='${localStorage.solutionId}'
                and detail.machine_id='${localStorage.machineId}'`
                   this.$db.get(probackiok,async (err,res)=>{
                       if(err){
                           console.log('硬盘数据查询失败')
                       }else{
                           console.log('硬盘数据查询成功',res)
                           if(res){
                               /*this.valueNum=0 //这个数默认是0
                               if(res.component_FC=='EJBB'){
                                   this.valueNum=1
                               }*/
                               let EJRLId='' //如果是ej0C的话，就要查看有没有带出的数据
                               if(res.component_FC=='EJ0C'){
                                   let EJRL=`select detail.id from product_programme_detail detail
		join component_other other on other.id=detail.component_id and other.category_id=detail.category_id
		join component_base_info info on info.id=other.base_info_id
		where detail.product_id='${localStorage.productId}' and info.component_FC='EJRL' and detail.template_id='${localStorage.templateId}' and detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}'`
                                  await new Promise((resolve,reject)=>{
                                       this.$db.get(EJRL,(err,res)=>{
                                           if(res){
                                               EJRLId=res.id
                                           }
                                           console.log('ej0c的查询',res)
                                           return resolve(res)
                                       })
                                   })
                               }
                               let bool=false //判断ej0k的
                               if(nudeT){//如果ej0k的数据在硬盘扩展柜用了 在背板里面也带了，就直接更改最小数就行
                                   this.externalPcie.forEach(item=>{
                                       if(item.iId==res.id){
                                           bool=true
                                           console.log(item.max,res.iocard_cnt)
                                           item.sum+=res.iocard_cnt
                                         return  item.max+=res.iocard_cnt
                                       }
                                   })
                               }
                               if(bool){
                                   console.log('return 因为ej0k在硬盘扩展柜和硬盘背板里面都出现了')
                                   return
                               }
                                   this.arr=this.arr.filter(item=>{
                                       let arr=[]
                                       if(item.value==res.id){
                                           item.optionsAl.forEach(it=>{
                                               if(it.id==res.id){
                                                   console.log(it.description,it.description_en)
                                                   return arr.push({type:it.description,description_en:it.description_en})
                                               }
                                           })
                                           this.externalPcie.push({
                                               max: res.iocard_cnt,//要展示的最小数
                                               description_en: 0,//硬盘带出iok的具体描述
                                               pcie_type: 0,//ej2k的类型
                                               type:[{type:res.pcie_type}],//选择展示的类型
                                               description:arr,//选择展示硬盘带出iok的类型
                                               id: item.upid,//默认硬盘带出iok的id
                                               sum: item.interiorDow,//要展示的数量
                                               externalSum: [],//硬盘带出iok的展开的数量
                                               PCI_E_size:item.PCI_E_size,//类型X8或者X16
                                               iId:res.id,//id
                                               EJ0C:res.component_FC=='EJ0C'?'EJ0C':'',//用来区分EJ0C这条数据,为他时，必须添加双数，为单数时要带一条数据
                                               EJRLId:EJRLId//EJRL的id存不存在，也是回显的数据
                                           })
                                           return false
                                       }else{
                                           return true
                                       }
                                   })
                           }
                       resolve()
                       }
                   })
               })
            }
        },

        beforeRouteEnter(form, to, next) {
            next(vm => {//进入页面执行，
                vm.$emit('comup', form.query.id)
                vm.sign = form.query.sign//记录要查询数据的id
                vm.cpu = vm.$store.state.cpu_C;//获取cpu的值
                console.log(vm.cpu)
                //vm.getEJ20();
                vm.getIok()
                if (vm.cpu == 2) {
                    vm.cpuNum = 7;
                } else if (vm.cpu == 3) {
                    vm.cpuNum = 9;
                } else if (vm.cpu == 4) {
                    vm.cpuNum = 11;
                }
            });
        },

       async created() {
            const than = this;

            /*获取CPU个数*/
            const getCpu = `select component_count from product_programme_detail detail
									join component_cpu cpu on cpu.category_id=detail.category_id  and cpu.id=detail.component_id
									where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='1'`;

           const cpie = `select info.description,info.description_en,PCI_E_generation,PCI_E_size,io.id,info.status,info.withdraw_date from component_iocard io left join component_base_info info on info.id=io.base_info_id where PCI_Catagory_id=1 and info.productId='${localStorage.productId}' and io.PCIelocal in (0,1)`;
           let ej0c=`select other.id,other.category_id from component_other other
		join component_base_info info on info.id=other.base_info_id
		where info.productId='${localStorage.productId}' and info.component_FC='EJRL'`
           await new Promise(function (resolve, reject) {
               than.getsql(getCpu, resL => { // 获取cpu的值
                   if (resL) {
                       console.log(resL)
                       than.cpu = resL.component_count;
                       console.log(than.cpu)
                       if (than.cpu == 2) {
                           than.cpuNum = 7;
                       } else if (than.cpu == 3) {
                           than.cpuNum = 9;
                       } else if (than.cpu == 4)  {
                           than.cpuNum = 11;
                       }
                       than.$store.commit('setCPU', than.cpu)
                       console.log(than.cpu, resL.component_count, than.$store.state.cpu_C, than.cpuNum);
                       return resolve();
                   } else {
                       return resolve();
                   }
               });
           });

           await new Promise(function (resolve, reject) {
               than.all(cpie, res => {
                   console.log(res)
                   than.pcieS = [...res];// 获取到添加类型的值，直接点击数量时不会报错
                   return resolve();
               })
           })
           await new Promise((resolve,reject)=>{
               this.$db.get(ej0c,(err,res)=>{
                   if(err){
                       console.log('获取ej0c数据失败')
                   }
                   console.log('获取ej0c的数据成功',res)
                   this.ej0c={categoryId:res.category_id, componentId:res.id}
               })
           })
           console.log('输出内容')

        },

    };
</script>

<style scoped lang="less">
    .interior-pcle {
        padding: 20px;

        .interior-hea {
            background: rgba(242, 242, 242, 1);
            padding: 5px;
            margin: 10px 0;
        }

        .interior-pei {
            margin-bottom: 20px;

            i {
                margin: 0 20px;
                font-size: 30px;
                height: 24px;
                display: inline-block;
                overflow: hidden;
            }

            .interior-butt {
                margin-left: 30px;
            }
        }

        .interior-pic {
            margin-bottom: 20px;
        }

        .interior-bott {
            p {
                margin: 10px 0;
            }
        }
    }
</style>
