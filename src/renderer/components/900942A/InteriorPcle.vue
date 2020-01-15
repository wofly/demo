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
                       @change="recor(ite.value,ind,1)" @visible-change="getRec($event,ind,ite.value)">
                <el-option
                        v-for="(item,index) in ite.options"
                        :key="item.id"
                        :label="$store.state.info_language?item.description_en:item.PCI_E_desc_cn"
                        :value="item.id">
                </el-option>
            </el-select>
            <p>*</p>
            <el-select v-model="ite.interiorDow" :placeholder="$store.state.info_language?'please choose':'请选择'" size="mini"
                       @change="recor(ite.value,ind,ite.interiorDow)" @visible-change="getList($event,ind)" class="sel">
                <el-option
                        v-for="item in ite.num"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button size="mini" type="info" icon="el-icon-close" circle class="interior-butt"
                       v-show="arr.length>1?1:0" @click="deletePci(ite.value,ind)"></el-button>

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
        <div class="interior-bott">
        </div>
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
            all(index, fun) {//获取库里的多条数据
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
            /*展开展示外部扩展柜的数量*/
            getExternal(bool, index) {
                if (bool) {
                    /*将要展示的数组数量清空*/
                    this.externalPcie[index].externalSum = []
                    /*最小数为外部pcie的数量，最大数为插槽数-x8_4...+(现在的数量-外部pcie的数量)*/
                    let num=0
                    if(this.externalPcie[index].PCI_E_size==1){
                        num=this.cpuNum-this.x16_4+this.externalPcie[index].sum
                    }else{
                        if(this.cpu==1){
                            num=1-this.x16_4+this.externalPcie[index].sum
                        }else{
                            num=3-this.x16_4+this.externalPcie[index].sum
                        }
                    }

                    console.log(this.x16_4)
                    for (let i = this.externalPcie[index].max; i <= (this.cpuNum - this.x8_4 - this.x8_3 - this.x16_4+this.externalPcie[index].sum); i++) {
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
                        if(this.externalPcie[index].PCI_E_size==1){
                            if(this.arrA.length>1){
                                this.arrA.interiorDow=num-this.externalNum
                            }
                        }else{
                            if(this.arrB.length>1){
                                this.arrB.interiorDow=num-this.externalNum
                            }

                        }

                        if(num-this.externalNum==0){
                           let index=this.brr.indexOf(this.arrA.value)
                            if(index>0){
                                this.brr.splice(index,1)
                            }
                        }
                        /*重新获取x8_4,x8_3的数据*/
                        this.getNum()
                    }
                })
            },

            getPcie(index, ind) { // 根据前面获取去的数据，动态获取要展示的数据
                this.arr[ind].interiorDow = 1;
                const cpieC = `select info.description PCI_E_desc_cn,info.description_en,io.PCI_E_generation,io.PCI_E_size,io.id,info.status,info.withdraw_date from component_iocard io left join component_base_info info on io.base_info_id=info.id where io.PCI_Catagory_id=${index + 1} and info.productId=${localStorage.productId}`;
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
                    res = res.filter((item, i) => {//获取到数据后，
                        for (let j = 0; j < this.brr.length; j++) {//brr里面记录过的，就把他删除掉，因为上面已经选择过了
                            if (item.id == this.brr[j]) {
                                return false;
                            }
                        }
                        return true;
                    });
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
            },
            getRec(value, ind, index) {//点击选择框时的操作
                if (value) {//如果为true的时候为打开选择框，
                    // 动态获取配置的选项
                    let num=0
                    this.arr.forEach((item,i)=>{
                        if(i!=ind){
                            num+=item.interiorDow*1
                        }
                    })
                    this.externalPcie.forEach(item=>{
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
            recor(index, ind, num) {//添加或者修改数据
                console.log(index, ind, num);
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
                        this.$db.all(PCI_Catagory_id, (err, res) => {
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
                        // this.brr[ind]=index;
                        this.$set(this.brr, ind, index);
                    });
                }
                this.getNum();
                console.log(this.arr);
            },
            getList(event, index) {//点击的时候可选的数量
                console.log(this.cpu, this.x8_4, this.arr, index);
                if (this.arr[index].interiorDow < 1) {
                    return
                }
                if (event) {
                    for (let i = 0; i < this.arr.length; i++) {
                        console.log(i, this.arr.length)
                        if (this.arr[i].PCI_E_size == 2) {
                            // 获取的X16 GEN4数量
                            this.arr[i].num = (this.cpu == 1 ? 1 : 3) - this.x16_4;
                        }
                        if (this.arr[i].PCI_E_size == 1 && this.arr[i].PCI_E_generation == 4) {
                            // 获取的X8 GEN4数量
                            this.arr[i].num = (this.cpu == 1 ? 2 : 5) - this.x8_4 - this.x16_4;
                        }
                        if (this.arr[i].PCI_E_size == 1 && this.arr[i].PCI_E_generation != 4) {
                            // 获取的X8 GEN3数量
                            this.arr[i].num = (this.cpu == 1 ? 8 : 11) - this.x8_4 - this.x16_4 - this.x8_3;
                            //   if(this.cpu==2){
                            //       if(this.x8_4==0){
                            //           this.arr[i].num = 8 - this.x8_3;
                            //       }else if(this.x8_4==1){
                            //           this.arr[i].num = 7 - this.x8_3;
                            //       }else if(this.x8_4==2){
                            //           this.arr[i].num = 6 - this.x8_3;
                            //       }
                            //   }else{
                            //       if(this.x8_4){
                            //           this.arr[i].num = 6 - this.x8_3;
                            //       }else{
                            //           this.arr[i].num = 7 - this.x8_3;
                            //       }
                            //   }
                        }
                    }
                    ;
                    if (this.arr[index].PCI_E_size == 2) {
                        this.arr[index].num += this.arr[index].interiorDow
                    }
                    if (this.arr[index].PCI_E_size == 1 && this.arr[index].PCI_E_generation == 4) {
                        this.arr[index].num += this.arr[index].interiorDow
                    }
                    if (this.arr[index].PCI_E_size == 1 && this.arr[index].PCI_E_generation != 4) {
                        this.arr[index].num += this.arr[index].interiorDow
                    }

                    let num=this.cpu == 1 ? 8 : 11 - this.x8_4 - this.x16_4 - this.x8_3+this.arr[index].interiorDow;
                    if(num<this.arr[index].num){
                        this.arr[index].num=num
                    }

                    this.$forceUpdate();
                }

            },
            getNum(ind, add) {//获取 this.x16_4、this.x8_4、this.x8_3 的值
                this.x16_4 = 0; // 默认的值cpu为一时
                this.x8_4 = 0;// 默认的值cpu为一时
                this.x8_3 = 0;// 默认的值cpu为一时
                // }
                const SQL = `select PCI_E_generation,PCI_E_size ,component_count from component_iocard pp cross join product_programme_detail ppd on pp.id=ppd.component_id and ppd.category_id=${this.$route.query.sign} where ppd.component_id in(
      select ppd.component_id from product_programme_detail ppd where ppd.product_id='${localStorage.productId}'
      and ppd.category_id=${this.$route.query.sign} ) and template_id='${localStorage.templateId}'
      and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'
       and is_expansion='1'`;
                this.all(SQL, (res, err) => {
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
                    console.log(this.x8_3, this.x8_4)
                });
            },
            deletePci(id, ind, value) {//删除数据
                // this.deletePci(id,ind,1)
                id = (this.arr[ind].upid ? this.arr[ind].upid : '');
                console.log(id)
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
                } else {

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
            },
            addCard() {
                if (this.arr[this.arr.length - 1].value == 0) {
                    return;
                }
                if ((this.x8_4 + this.x8_3 + this.x16_4) >= (this.cpu == 1 ? 8 : 11) || this.arr.length >= (this.cpu == 1 ? 8 : 11)) {
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
                this.arr[this.arr.length - 1].PCI_E_size = -1;
                this.arr[this.arr.length - 1].PCI_E_generation = -1;
                this.arr[this.arr.length - 1].interiorDow=''
                this.arr[this.arr.length - 1].bool=false
                this.arr[this.arr.length - 1].num = 0;
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
            open() {
                this.$alert(this.error, {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: `action: ${action}`,
                        });
                    },
                });
            },
            getHBA() {
                /*查询库里HBA的数量去添加或修改他匹配的连接线*/
                let sQL = `select sum(component_count) detail_sum_count from product_programme_detail detail
 join component_iocard io on detail.category_id=io.category_id and detail.component_id=io.id
 join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id and pcie.id=3 where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                /*查询记录HBA连接线的id*/
                let getSQL = `select  detail.id detail_id,detail.category_id,detail.component_id from product_programme_detail detail join component_other other on detail.category_id=other.category_id and detail.component_id=other.id and other.id=5 where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
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
                        let num = res.detail_sum_count
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
                                            console.log('修改成功,17_5')
                                        }
                                    })
                                } else {
                                    /*如果数量为null的话就直接退出去*/
                                    if (num == null) {
                                        return
                                    }
                                    /*判断id不存在时添加*/
                                    const insert = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','17','5','${num}','${localStorage.solutionId}','${localStorage.templateId}','1')`;
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
            getEJ20() {
                // 获取库里ej20的数
                let getEj20 = `select detail.id,detail.component_id,detail.component_count,detail.is_expansion,info.description_en,info.description,io.PCI_E_size,
pcie.pcie_type,info.status,info.withdraw_date,info.title_msg,info.ui_status from  product_programme_detail detail
 join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
 join component_base_info info on info.id=io.base_info_id
 join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id
 where detail.component_id=35 and is_expansion in (1) and product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}'`
                // 获取库里外部扩展柜内瓤的数
                let externalPcieSQL = `select detail.category_id,detail.component_id,detail.component_count from product_programme_detail detail
join component_expansionflesh flesh on flesh.category_id=detail.category_id and flesh.id=detail.component_id
where detail.is_expansion=0 and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'`
                /*获取外部硬盘的占用多少内部pcie插槽的数量*/
                let hardDiskSQL=`select  detail.id,detail.component_count,detail.component_id,info.description, info.description_en,pcie.pcie_type,io.PCI_E_size,info.status,info.withdraw_date,info.title_msg,info.ui_status from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
join component_base_info info on info.id=io.base_info_id
join component_pcie_classification pcie on pcie.id=io.PCI_Catagory_id
where detail.component_id =(select distinct io.id from component_iocard io
join relation_disk_modeoption_iocard relation on relation.iocard_id=io.id)
and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.is_expansion=1`//and detail.is_expansion=1暂时不写
                /*ej0j的数量*/
                let ej0jSQL=`select detail.id,detail.component_count,mode.card_base_cnt from product_programme_detail detail
join component_disk_modeoption mode on mode.category_id=detail.category_id and mode.id=detail.component_id
where product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.is_expansion=1`//暂时不写
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
            }
        },
        beforeRouteEnter(form, to, next) {
            next(vm => {//进入页面执行，
                vm.$emit('comup', form.query.id)
                vm.sign = form.query.sign//记录要查询数据的id
                vm.cpu = vm.$store.state.cpu_C;//获取cpu的值
                vm.getEJ20()
                if (vm.cpu == 1) {
                    vm.cpuNum = 8;
                } else if (vm.cpu == 2) {
                    vm.cpuNum = 11;
                }
            });
        },
        created() {
            const than = this;
            const cpieK = ' select id,pcie_type from component_pcie_classification';// 获取pcie的配置
            const defaltuPci = `select pp.PCI_E_generation,PCI_E_size,PCI_Catagory_id,info.description PCI_E_desc_cn,ppd.component_count,ppd.id,ppd.seq_Key,ppd.component_id,info.status from component_iocard pp
                                    cross join product_programme_detail ppd on pp.id=ppd.component_id and ppd.category_id=pp.category_id
                                    left join component_base_info info  on info.id=pp.base_info_id
                where ppd.product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}' and is_expansion='1'`;// 获取库里面的值  ，传进去的
            const pcie_type = 'SELECT id,pcie_type FROM component_pcie_classification ';// 获取类型
            const getCpu = `select component_count from product_programme_detail detail
									join component_cpu cpu on cpu.category_id=detail.category_id  and cpu.id=detail.component_id
									where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='1'`;

            function run_CPU() {
                return new Promise(function (resolve, reject) {
                    than.getsql(getCpu, resL => { // 获取cpu的值
                        if (resL) {
                            than.cpu = resL.component_count;
                            if (than.cpu == 1) {
                                than.cpuNum = 8;
                            } else if (than.cpu == 2) {
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
            }

            function run_a() {//获取库里的数据，传给下一个
                return new Promise(function (resolve, reject) {
                    // 假设已经进行了异步操作，并且获得了数据
                    // let cpie = ` select PCI_E_generation,PCI_E_size from component_iocard`
                    // 获取类型里面的值
                    const arr = [];
                    const res = [];
                    than.all(defaltuPci, res => {
                        res = [...res];
                        return resolve([res, arr]);
                    });
                });
            }

            function creatA([res, arr]) {// 获取库里面的类型
                return new Promise(function (resolve, reject) {
                    res.forEach((item, index) => {
                        arr.push([]);
                        than.all(pcie_type, resA => {
                            than.interiorTop = [...resA];
                            resA.forEach((it, ind) => {
                                arr[index].push(it);
                            });
                            console.log(arr, res)
                            return resolve([arr, res]);
                        });
                    });
                });
            }

            function creatB([arr, res]) {//获取c库里pcie的数据
                let num = 0;
                return new Promise(function (resolve, reject) {
                    res.forEach((item, index) => {
                        const PCI_Catagory_id = `SELECT io.*,info.description PCI_E_desc_cn,info.description_en,info.status,info.withdraw_date,info.title_msg,info.ui_status FROM COMPONENT_IOCARD io
          left join component_base_info info on info.id=io.base_info_id
          WHERE PCI_Catagory_id =${item.PCI_Catagory_id} and info.productId=${localStorage.productId}`;
                        than.all(PCI_Catagory_id, resA => {// 获取库里面的类型
                            console.log(resA)
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
                            });
                            console.log(item, resA)
                            arr[index].options = [...resA];
                            arr[index].options.upid = item.id;// 库里面选中的id
                            arr[index].PCI_E_generation = item.PCI_E_generation, // 库里面所选中的代数
                                arr[index].PCI_E_size = item.PCI_E_size, // 库里面的类型 比如x8_3
                                arr[index].interiorDow = item.component_count, // 库里面的个数
                                arr[index].value = item.PCI_E_desc_cn, // 库里面选中的id
                                //arr[index].PCI_E_desc_cn =  item.PCI_E_desc_cn,//库里面的中文名
                                arr[index].component_id = item.component_id
                            arr[index].interiorVal = item.PCI_Catagory_id - 1, // 库里面所选中的类型下标
                                arr[index].seq_Key = item.seq_key;// 这个是时间戳，
                            arr[index].upid = item.id;// 库里面选中的id
                            arr[index].bool = false;// 库里面选中的id
                            arr[index].num = 0,
                                num++;
                            if (num == res.length) {
                                /*如果有ej20的话就删除掉显示*/
                                return resolve(arr);
                            }
                        });
                    });
                });
            }

            function run_b(arr) {//brr里面的值 和x8_3、x8_4、x16_4的值、还有展示的选择了多少
                return new Promise(function (resolve, reject) {
                    const brr = [];
                    than.x8_3=0;
                    than.x8_4=0
                    than.x16_4=0
                    for (let i = 0; i < arr.length; i++) {
                        arr[i].optionsAl = [...arr[i].options];
                        for (let j = 0; j < arr[i].options.length; j++) {
                            if (arr[i].options[j].PCI_E_desc_cn == arr[i].value) {
                                arr[i].value = arr[i].options[j].id;
                                brr.push(arr[i].options[j].id);
                            }
                        }
                        console.log(arr[i],than.x8_3, than.x8_4)
                        if (arr[i].PCI_E_size == 2) {
                            // 获取的X16 GEN4数量
                            than.x16_4 += (1 * arr[i].interiorDow);
                        }
                        if (arr[i].PCI_E_size == 1 && arr[i].PCI_E_generation == 4) {
                            // 获取的X8 GEN4数量
                            than.x8_4 += (1 * arr[i].interiorDow);
                        }
                        if (arr[i].PCI_E_size == 1 && arr[i].PCI_E_generation != 4) {
                            // 获取的X8 GEN3数量
                            than.x8_3 += (1 * arr[i].interiorDow);
                        }
                        arr[i].options.filter((item, index) => {
                            for (let j = 0; j < brr.length; j++) {
                                if (item.id === brr[j]) {
                                    return false;
                                }
                                return true;
                            }
                        });
                    }
                    const PCI_Catagory_id = `select info.name,detail.component_count,detail.category_id,io.PCI_E_generation,io.PCI_E_size,info.status from component_base_info info         join component_iocard io on info.id = io.base_info_id
                             join product_programme_detail detail on io.id=detail.component_id and
                              detail.category_id=${than.$route.query.sign}
                            left join solution so
                            on  so.id = detail.solution_id
                            where info.id in ( select io.base_info_id from component_iocard io where io.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}'
                            and template_id='${localStorage.templateId}'  and solution_id='${localStorage.solutionId}'
                            and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='1'
       union


      select info.name,detail.component_count,detail.category_id,info.description,mem.category_id,info.status from component_base_info info
                            join component_memory mem on info.id = mem.base_info_id
                            join product_programme_detail detail on mem.id=detail.component_id and  detail.category_id=mem.category_id

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select mem.base_info_id from component_memory mem
                            where mem.id in (select component_id from product_programme_detail) )
                            and template_id='${localStorage.templateId}'  and solution_id='${localStorage.solutionId}'
                            and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='1'`;
                    than.$db.all(PCI_Catagory_id, (err, res) => {
                        let pci = [];// 获取库里pci的值
                        let mem = [];// 获取库里内存的值
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
                            if (item.PCI_E_size == 1 && item.PCI_E_generation != 4) {
                                return x8_3 += item.component_count;
                            }
                            if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {
                                return x8_4 += item.component_count;
                            }
                            if (item.PCI_E_size == 2) {
                                return x16_4 += item.component_count;
                            }
                        });
                        if (than.cpu == 1) {
                            if (memNum > 16) {
                                than.error = '内存里的选项有误';
                                than.$emit('erro', 1);
                                than.open();
                            }
                                if (x8_3+x8_4+x16_4 > 8) {//如果不等于0的话就是最多x8_3为8个
                                    than.error = 'pcie内的x8_3内型选择过多';
                                    than.$emit('erro', 3);
                                    than.open();
                                }
                            if (x8_4 > 1) {//如果x8_4大于1的话说明x8_4选多了
                                than.error = 'pcie内的x8_4内型选择过多';
                                than.$emit('erro', 3);
                                than.open();
                            }
                            if (x16_4 > 1) {
                                than.error = 'pcie内的x16_4内型选择过多';
                                than.$emit('erro', 3);
                                than.open();
                            }
                            }


                        console.log(pci, mem, memNum, x8_3, x8_4, x16_4);
                        arr = arr.filter((item,index) => {
                            if(brr[index]== than.externalPcieId||brr[index]== than.hardDiskId){
                                brr.splice(index,1)
                            }
                            if (item.component_id == than.externalPcieId) {
                                than.arrA = item
                                return false
                            }else if(item.component_id == than.hardDiskId){
                                than.arrB = item
                                return false
                            } else {
                                return true
                            }
                        })
                        than.arr = arr;
                        than.brr = brr;
                        console.log(arr, brr, than.arr);
                        return resolve(arr);
                    });
                });
            }

            function run_c(data) {
                ;//库里没有数据时执行的,基本不会执行，因为进入页面时会添加数据
                console.log(data);
                return new Promise(function (resolve, reject) {
                    // 假设已经进行了异步操作，并且获得了数据
                    const cpie = ` select info.description PCI_E_desc_cn,info.description_en,PCI_E_generation,PCI_E_size,io.id,info.status,info.withdraw_date from component_iocard io
            left join component_base_info info on info.id=io.base_info_id where PCI_Catagory_id=1`;
                    // let cpie =` select PCI_E_desc_cn,PCI_E_generation,PCI_E_size from component_iocard where PCI_Catagory=0`;
                    than.all(cpie, res => {
                        than.pcieS = [...res];// 获取到添加类型的值，直接点击数量时不会报错
                    });
                    if (!data) {
                        than.all(cpieK, res => {
                            res.forEach((item, index) => {
                                return item.pcie_type;// 给获取出来的类型添加上卡字
                            });// 动态获取配置的选项
                            than.interiorTop = [...res];
                            than.arr.push([...than.interiorTop]);
                            than.arr[0].interiorVal = 0;// 点击后卡的值
                            than.arr[0].num = 6;
                            // this.interiorTop.pcieS=3 // 点击前能选几位
                            than.arr[0].interiorDow = 1; // 点击后的数量
                            than.arr[0].optionsVal = ''; // 点击卡类型之后默认展示的内容
                            console.log(than.arr, than.interiorTop);
                            const cpie = ' select info.description PCI_E_desc_cn,info.description_en,PCI_E_generation,PCI_E_size,io.id,info.status,info.withdraw_date from component_iocard io ' +
                                'left join component_base_info info on info.id=io.base_info_id ' +
                                'where PCI_Catagory_id=1 and PCI_E_generation in (3,4)';
                            // let cpie =` select PCI_E_desc_cn,PCI_E_generation,PCI_E_size from component_iocard where PCI_Catagory=0`;
                            //than.all(cpie, res => { // 选卡时的事件
                            // 动态获取配置的选项
                            than.all(cpie, res => {
                                console.log(res)
                                than.pcieS = [...res];// 获取到添加类型的值，直接点击数量时不会报错
                                than.pcieS = than.pcieS.filter((item, index) => {
                                    if (item.PCI_E_size == 2 && item.PCI_E_generation == 4) {
                                        return item = true;
                                    }
                                    if (item.PCI_E_size == 1 && item.PCI_E_generation == 4) {
                                        return item = true;
                                    }
                                    if (item.PCI_E_size == 1 && item.PCI_E_generation == 3) {
                                        return item = true;
                                    }
                                });
                                //});
                                console.log(than.pcieS)
                                than.arr[0].options = [...than.pcieS];
                                than.arr[0].optionsAl = [...than.pcieS];
                                than.arr[0].value = than.arr[0].options[0].id; // 点击后卡的类型的值
                                than.arr[0].splice(9, 0);
                                than.arr[0].optionsVal = res == 0 ? '没有可以匹配的' : res[0].PCI_E_desc_cn;// 默认展示第一个值,如果没有值显示没有匹配的
                                than.recor(than.arr[0].value, 0, 1)
                            });
                        })
                    }
                    ;
                });
            }

            run_CPU().then(function () {//获取cpu
                return run_a();//获取c库里pcie的数据
            }).then(function (arr) {
                if (arr[0].length > 0) {
                    return creatA(arr);// 获取库里面的类型
                }
                return run_c(false);//库里没有数据时执行的
            })
                .then(function (arr) {
                    return creatB(arr);//获取c库里pcie的数据
                })
                .then(function (data) {
                    return run_b(data);//brr里面的值 和x8_3、x8_4、x16_4的值、还有展示的选择了多少
                })
                .then(function (data) {
                    return run_c(data);//库里没有数据时执行的
                });

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
