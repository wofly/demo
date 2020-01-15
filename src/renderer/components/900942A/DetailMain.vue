<template>
    <div class="wrap">
        <!--机器配置-->
        <!--方案详情页面机器数据列表 // 版本备用-->
        <!--<div class="outBox">-->
        <!--<ul class="outList">-->
        <!--<li>￥<span>88,888  </span></li>-->
        <!--<li><span>{{discount}}%</span>off</li>-->
        <!--<li><span><input type="number" v-model="machine" class="inp" @change="setnum"></span>Machine</li>-->
        <!--<li>￥<span>{{endNum}}</span></li>-->
        <!--</ul>-->
        <!--</div>-->
        <div class="intro-list" v-for="(item,index) in dataList">
            <div class="logos" v-if="item.machine_model == '9009'" @click="tabRoute(index)"><img
                    src="../../../../static/s924.png"></div>
            <div class="logos" v-if="item.machine_model == '9040'" @click="tabRoute(index)"><img
                    src="../../../../static/E950.png"></div>
            <ul class="list">
                <li class="list-header">
                    <el-input type="text" class="elInp" v-model="item.name" @change="setDataListTit(index)"></el-input>
                    <ul>
                        <li>
                            <span v-show="$store.state.userId !=1">{{$store.state.currency_type?"$  ":"￥  "}}{{$store.state.currency_type?item.greeMe*item.num:item.gree * item.num | allPriceFilters}}</span>
                            <span v-show="$store.state.userId ==1">- -</span>
                        </li>
                        <li>
                            <span v-show="$store.state.userId !=1">{{$store.state.currency_type?100-item.parsffOff:item.parsff | discountFilters}}%  off</span>
                            <span v-show="$store.state.userId ==1">- -</span>
                        </li>
                        <li><span><input type="number" min="1" v-model="item.num" class="inp" ref="inp"
                                         @keyup="upnum(index)"  
                                         @change="num(index)">{{$t('details.machine.machi')}}</span>
                        </li>
                        <li>
                            <span v-show="$store.state.userId !=1"> {{$store.state.currency_type?"$  ":"￥  "}}{{$store.state.currency_type?item.greeMe*item.num*item.parsff/100:item.gree * item.num*item.parsff/100  | allPriceFilters}}</span>
                            <span v-show="$store.state.userId ==1">- -</span>
                        </li>
                    </ul>
                </li>
                <!--数据改变-->
                <div class="showlis"><p>{{$store.state.info_language?item.product_name_en:item.product_name}}</p> -
                    <span>{{$store.state.info_language?item.product_des_en:item.product_des}}</span></div>
                <li class="list-main">
                    <ul class="mian-list">
                        <li class="mainlist-li">
                            <p class="listp">{{ $t('details.machine.hardware')}}</p>
                            <ol v-for="it in cpuMemoHard" v-if="it.machine_id==item.machine_id">
                                <li>{{it.cpuCount}}{{$t('details.machine.wei')}} {{it.frequency}}GHz {{it.core}} {{
                                    $t('details.machine.core')}} {{it.thread}} {{
                                    $t('details.machine.threadProcessors')}}
                                </li>
                                <li>{{it.meCount | fullNum}} {{ $t('details.machine.MemoryCapacity')}}</li>
                                <li>{{it.haedCount | fullNum}} {{ $t('details.machine.HardDriveCapacity')}}</li>
                            </ol>
                        </li>
                        <li class="mainlist-li">
                            <p class="listp">{{ $t('details.machine.software')}}</p>
                            <ol class="ols">
                                <li class="listp">{{ $t('details.machine.operatingSystem')}}：</li>
                                <li>{{hardLists[index]?hardLists[index].name:''}}</li>
                                <li>{{hardLists[index]?hardLists[index].type:''}}</li>
                            </ol>
                            <ol class="ols">
                                <li class="listp">{{ $t('details.machine.rests')}}：</li>
                                <li>{{rmbLists[index]?rmbLists[index].name:''}}</li>
                                <li>{{rmbLists[index]?rmbLists[index].type:''}}</li>
                            </ol>
                        </li>
                        <li class="mainlist-btn">

                            <div class="delete mainlist" @click="deleteConfig(index)">
                                <span class="change-height config-span">{{ $t('details.header.RemoveMachine')}}</span>
                            </div>

                            <div class="config mainlist" @click="clkjump(index)">
                                <span class="change-height config-span">{{ $t('details.buttons.machineConfiguration')}}</span>
                            </div>

                            <div class="export position mainlist" @click="exportScheme(index,$event)">
                                <!--加入导出方案 移动选项-->
                                <span class="change-height export-span">{{ $t('details.buttons.ExportMachine')}}</span>

                                <div class="programme">
                                    <el-collapse-transition>
                                        <div v-show="dataList[index].show">
                                            <!--                      <span class="transition-box" @click="exportIpscs(item.machineList[1].remark_name,'ips',item.machineList[1].product_id,item.machineList[1].solution_id,item.machineList[1].template_id,item.machineList[1].machine_id)">导出方案文件(.ips)</span>-->
                                            <!--                      <span class="transition-box" @click="exportExcel(item.machineList[1].remark_name,'xlsx',item.machineList[1].product_id,item.machineList[1].solution_id,item.machineList[1].template_id,item.machineList[1].machine_id)">导出方案文件(.xls)</span>-->
                                            <span class="transition-box"
                                                  @click.stop="exportMachineConf(item.machine_id)">{{ $t('details.buttons.ExportMachineFiles')}}(.xls)</span>
                                            <span class="transition-box  transition"
                                                  @click.stop="exportCfr(item,'cfr')">{{ $t('details.buttons.ExportMachineFiles')}}(.cfr)</span>
                                            <!--                      <span class="transition-box" @click="exportCfr(item.machineList[1].remark_name,'cfr',item.machineList[1].product_id,item.machineList[1].solution_id,item.machineList[1].template_id,item.machineList[1].machine_id)">导出方案文件(.cfr)</span>-->
                                        </div>
                                    </el-collapse-transition>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
            <!--<div v-for="(item,index) in ListsData" :key="index">-->
            <!--<ul v-for="(ite) in item">-->
            <!--{{ite}}-->
            <!--</ul>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    import exportCfrOrCsv from '../../utils/exportCfrOrCsv';
    import exportCfrOrCsv950 from '../../utils/exportCfrOrCsv950';
    import exportExcel from '../../utils/exportExcelData';
    import exportIpscs from '../../utils/exportIpscs';
    import cfrConvert from '../../utils/cfrConvert';
    import ipscsConvert from '../../utils/ipscsConvert';
    import exportSolutionCFR from '../../utils/exportSolutionCFR';
    import dataFormat from '../../utils/dataFormatUtil';

    export default {
        name: 'DetailMain',
        data() {
            return {
                // 用户id
                userId: 0,
                done: 7.3,
                show: false,
                showdata: [],
                tableData: [], // 机器
                allNums: null, // 1台机器无折扣总价
                discount: 10, // 折扣
                machine: 1, // 机器数量
                allNum: null,
                endNum: null, // 折扣后总价
                dataList: [],

                cpuNum: 0, // CPU 数量
                memNum: 100, // 内存 容量
                hdNum: 100, // 硬盘 容量

                sfwName: '', // 操作系统名称
                sfSynopsis: '', // 操作系统简介
                elseName: '', // 其他软件名称
                elseSynopsis: '', // 其他软件简介
                brrNum: [],
                arrayList: [0, 0, 0, 0, 0],

                ListDatas: [], // 机器数据汇总
                CPULists: [], // CPU个数汇总
                memLists: [], // 内存总容量汇总
                hardLists: [], // 硬盘总容量汇总
                rmbLists: [], // 价格汇总
                machines: [], //初始数量汇总
                numA: 1,
                cpuMemoHard: [],//cpu 和内存 硬盘的展示
            };
        },
        /*调用本页面数据*/
        inject: ["reload"],
        filters: {
            fullNum: (num) => {
                console.log(num)
                if (num > 1024) {
                    return (num / 1024).toFixed(2) + 'TB'
                } else {
                    return num + 'GB'
                }
            },
            discountFilters: function (value) {
                // return  value == 0 ? 0 : value.toFixed(2)
                if (value == 0 || value == 100||isNaN(value)) {
                    return 0.00
                } else {
                    if (value) {
                        return Number(value).toFixed(2)
                    }
                }
            },
            allPriceFilters: function (value) {
                if (value){
                    return value.toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                } else{
                    return (0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                }
            },
        },
        methods: {
            exportMachineConf(machineId) {
                dataFormat.exportMachineConfService(machineId, true, this.$db);
            },
            /*导出方案*/
            exportScheme(index,e) {
                e.stopPropagation();
                this.dataList[index].show = !this.dataList[index].show;
            },

            /*删除机器配置*/
            deleteConfig(index) {
                let del = this.dataList[index].machine_id;
                this.$confirm('删除后无法恢复，请谨慎操作！', '删除机器', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    /*删除detail*/
                    const deleteSQL = `delete from product_programme_detail where id in(select id from product_programme_detail where machine_id = ${del})`
                    this.$db.run(deleteSQL, (err, res) => {
                        if (err) {
                            this.$Notice.error({
                                title: 'detail删除失败',
                                desc: err,
                            });
                        } else {
                            console.log('detail删除成功')
                            this.$router.push('/Projectpar');
                            /*删除机器*/
                            const deleteSQL = `delete from machine_info where id = ${del}`
                            this.$db.run(deleteSQL, (err, res) => {
                                if (err) {
                                    this.$Notice.error({
                                        title: '机器删除失败',
                                        desc: err,
                                    });
                                } else {
                                    console.log('机器删除成功');
                                    /*刷新本页面的数据*/
                                    this.reload();
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });
                                }
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            upnum(index) {
                const reg = /^\+?[1-9]\d*$/; // 判断是否是数字
                let num = this.dataList[index].num + ''; // 转为字符换
                // this.dataList[index].num = 23;
                if (this.dataList[index].num > 0) { // 为数字时赋值
                    this.numA = this.dataList[index].num
                } else {
                    // num=this.dataList[index].num+''
                    this.dataList[index].num = this.numA //不为数字是变为上一次的值
                }
                //console.log("正确",num,this.$refs.inp)
                this.$refs.inp[index].style.width = (32 + num.length * 6) + 'px' //增加判断长度
            },
            num(index) { // 根据机器数量对应计算
                //this.setSQL(index)
                //let num = this.dataList[index].num;
                // num.replace(/[^\d]/g,'');
                let sql = `UPDATE machine_info set count='${this.dataList[index].num}' where id=${this.dataList[index].machine_id}`;
                this.$db.run(sql, (err, ser) => {
                    if (!err) {
                        console.log('res>>>>>>>>', '修改成功', this.dataList)
                    }
                    else {
                        console.log('>>>>', res);
                    }
                })
                console.log(this.dataList[index].num);
                this.$store.commit('changeMachine', this.dataList[index].num); // 使用VUEX判断变化进行组件联系
                this.$store.commit('setdata', [index, this.dataList[index].num]) // 更改联系列表中的值
                this.$store.commit('setdatadiscount', [index, this.dataList[index].num]) // 更改联系列表中的值  有税率的

                console.log(this.$store.state.data)
            },
            setdatas() { // 总价计算
                const sql = ` select info.component_PN,info.component_FC,detail.category_id,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,info.status
from product_programme_detail detail
left join solution           so     on  so.id=detail.solution_id
 left join component_category cate  on  cate.id =detail.category_id
left join component_memory   mem   on  mem.id =detail.component_id and detail.category_id=2
left join component_iocard   io    on io.id   =detail.component_id and detail.category_id=6
left join component_disk     disk  on disk.id =detail.component_id and detail.category_id=1
left join component_cpu      cpu    on  cpu.id  =detail.component_id and detail.category_id=3
left join component_power    power  on  power.id=detail.component_id and detail.category_id=5
left join component_backplane back  on  back.id =detail.component_id and detail.category_id=7
left join component_powerline    line    on line.id=detail.component_id  and detail.category_id=8
left join component_cpu_activation ac    on ac.id=detail.component_id  and detail.category_id=11
left join component_other    other  on  other.id=detail.component_id and detail.category_id=17
left join component_barebone    bb  on  bb.id=detail.component_id and detail.category_id=16
left join component_base_info info  on  info.id=mem.base_info_id
                  or  info.id=io.base_info_id
                  or  info.id=disk.base_info_id
                  or  info.id=cpu.base_info_id
                  or  info.id=power.base_info_id
                  or  info.id=back.base_info_id
                  or  info.id=line.base_info_id
                  or  info.id=other.base_info_id
                  or  info.id=ac.base_info_id
                  or  info.id=bb.base_info_id
where detail.template_id='${localStorage.templateId}' and detail.category_id in (1,2,3,5,6,7,8,11,16,17) and so.id='${localStorage.solutionId}' and detail.product_id='${localStorage.productId}' and detail.machine_id=${localStorage.machineId}`;
                let allNum = null;
                new Promise((resolve, reject) => {
                    this.$db.all(sql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            return resolve(res)
                        }
                    })
                }).then(res => {
                    // console.log(res);
                    for (let i = 0; i < res.length; i++) {
                        const num = res[i].component_count * res[i].listprice_onshore;
                        this.showdata.push(res[i]);
                        allNum += num;
                        this.allNums = allNum;
                    }
                    this.setnum();
                })
            },


            getFrequency() {
                const sql = 'select max(machine_id)  max from product_programme_detail';
                let maxnum = 0;
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        for (let i = 0; i < res.length; i++) {
                            // console.log(res);
                            maxnum = res[i].max;
                        }
                        this.setLists(maxnum);
                    }
                    console.log(maxnum);
                });
            },


            async setLists(Num) {
                const sql = `select distinct info.id machine_id,info.product_id,info.solution_id,info.templete_id,product.product_name,product.product_name_en,product.product_des,product.product_des_en,
info.remark_name,info.count,detail.list_price,detail.discount_price,
detail.list_dollar_price,detail.configure_type,detail.discount_dollar_price,product.machine_model,product.machine_submodel
from machine_info info
join machine_price_detail detail on detail.machine_id=info.id
join product_info product on product.id=info.product_id
join product_programme_detail ppd on ppd.machine_id=detail.machine_id
where info.status=1 and info.solution_id='${localStorage.solutionId}'

UNION all
select machine_info.id,detail.category_id,null,null,software.software_des,null,software.software_name,null,null,null,null,null,null,null,null,product_info.machine_model,product_info.machine_submodel
from product_programme_detail detail
JOIN component_software software ON detail.category_id=software.category_id AND detail.component_id=software.id
JOIN component_category category ON category.id=software.category_id
JOIN machine_info on machine_info.id=detail.machine_id AND machine_info.status=1
JOIN product_info ON product_info.id=detail.product_id
JOIN machine_price_detail on machine_price_detail.machine_id=detail.machine_id AND configure_type=2
where detail.category_id in(13,14) and detail.solution_id='${localStorage.solutionId}'
GROUP BY detail.machine_id,detail.category_id`;
                /*获取cpu 内存 硬盘的容量进行展示*/
                let getCpuCount = `select detail.machine_id machine_id,detail.component_count count,detail.category_id category_id,cpu.core core,cpu.thread thread,cpu.frequency frequency,? capacity from
product_programme_detail detail
JOIN component_cpu cpu ON detail.category_id=cpu.category_id AND detail.component_id=cpu.id
JOIN machine_info  mInfo ON detail.machine_id=mInfo.id AND mInfo.status=1
JOIN component_base_info info
ON info.id=cpu.base_info_id
where detail.solution_id='${localStorage.solutionId}'
UNION
select detail.machine_id machine_id,detail.component_count count,detail.category_id category_id,? a,? b,? c,disk.capacity capacity from
product_programme_detail detail
JOIN component_disk disk ON detail.category_id=disk.category_id AND  detail.component_id=disk.id
JOIN machine_info  mInfo ON detail.machine_id=mInfo.id AND mInfo.status=1
JOIN component_base_info info
ON info.id=disk.base_info_id
where detail.solution_id='${localStorage.solutionId}'
UNION
select detail.machine_id machine_id,detail.component_count count,detail.category_id category_id,? a,? b,? c,memory.capacity capacity from
product_programme_detail detail
JOIN component_memory memory ON detail.category_id=memory.category_id AND  detail.component_id=memory.id
JOIN machine_info  mInfo ON detail.machine_id=mInfo.id AND mInfo.status=1
JOIN component_base_info info
ON info.id=memory.base_info_id
where detail.solution_id='${localStorage.solutionId}'`
                console.log(getCpuCount)
                /*获取cpu 内存 硬盘的容量进行展示*/
                this.$db.all(getCpuCount, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        let result = this.generateFixedDataConstruction(res, "machine_id", "machine_id", "machineList"); // 生成数据
                        this.cpuMemoHard = []//将展示的数据清空，重新赋值
                        result.forEach(item => {
                            let obj = {
                                machine_id: item.machine_id,//category_id
                                haedCount: 0,//硬盘的总容量
                                meCount: 0,//内存的总容量
                                cpuCount: 0,//cpu的数量
                                thread: 0,//线程
                                frequency: 0,//HZ的数
                                core: 0,//内核
                            }
                            item.machineList.forEach(it => {
                                if (it.category_id == 1) {
                                    obj.haedCount += it.count * it.capacity
                                }
                                if (it.category_id == 2) {
                                    obj.meCount += it.count * it.capacity
                                }
                                if (it.category_id == 3) {
                                    obj.cpuCount = it.count//cpu的数量
                                    obj.thread = it.thread//线程
                                    obj.frequency = it.frequency//HZ的数
                                    obj.core = it.core//内核
                                }
                            })
                            this.cpuMemoHard.push(obj)
                        })
                        console.log(res, result, this.cpuMemoHard)
                    }
                })
                await new Promise((resolve, reject) => {
                    this.$db.all(sql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            console.log(res)
                            return resolve(res)
                        }
                    })
                }).then(res => {
                    if (res.length > 0) {
                        // console.log(res)
                        this.dataList = []
                        res.forEach(item => {
                            if (!item.configure_type) {
                                return
                            }
                            if (this.dataList.length == 0) {
                                return this.dataList.push({
                                    num: item.count, //数量
                                    name: item.remark_name, //机器名称
                                    product_name: item.product_name,// 924 950 的展示名字
                                    product_des: item.product_des, //机器的简介
                                    product_name_en: item.product_name_en,// 924 950 的展示名字英文
                                    product_des_en: item.product_des_en, //机器的简介英文
                                    gree: item.list_price,//人民币的价格
                                    greeOff: item.discount_price,//人民币打完折的价格
                                    greeMe: item.list_dollar_price,//美元的价格
                                    greeOffMe: item.discount_dollar_price,//美元打完折的价格
                                    parsff: '',//折扣 。暂时为空 下一次计算
                                    show: false,//
                                    machine_id: item.machine_id,
                                    product_id: item.product_id,
                                    solution_id: item.solution_id,
                                    templete_id: item.templete_id,
                                    machine_model: item.machine_model,
                                    machine_submodel: item.machine_submodel
                                })
                            }
                            for (let i = 0; i <= this.dataList.length; i++) {
                                if (i == this.dataList.length) {
                                    return this.dataList.push({
                                        num: item.count, //数量
                                        name: item.remark_name, //机器名称
                                        product_name: item.product_name,// 924 950 的展示名字
                                        product_des: item.product_des, //机器的简介
                                        product_name_en: item.product_name_en,// 924 950 的展示名字英文
                                        product_des_en: item.product_des_en, //机器的简介英文
                                        gree: item.list_price,//人民币的价格
                                        greeOff: item.discount_price,//人民币打完折的价格
                                        greeMe: item.list_dollar_price,//美元的价格
                                        greeOffMe: item.discount_dollar_price,//美元打完折的价格
                                        parsff: '',//折扣 。暂时为空 下一次计算
                                        show: false,//
                                        machine_id: item.machine_id,
                                        product_id: item.product_id,
                                        solution_id: item.solution_id,
                                        templete_id: item.templete_id,
                                        machine_model: item.machine_model,
                                        machine_submodel: item.machine_submodel
                                    })
                                }
                                if (item.machine_id == this.dataList[i].machine_id) {
                                    this.dataList[i].gree += item.list_price//人民币的价格  这个是总的单价 因为价格分为了软件和硬件的价格
                                    this.dataList[i].greeOff += item.discount_price//人民币打完折的价格  这个是总的单价 因为价格分为了软件和硬件的价格
                                    this.dataList[i].greeMe += item.list_dollar_price//美元的价格  这个是总的单价 因为价格分为了软件和硬件的价格
                                    this.dataList[i].greeOffMe += item.discount_dollar_price//美元打完折的价格  这个是总的单价 因为价格分为了软件和硬件的价格
                                    this.dataList[i].parsff = Number((this.dataList[i].greeOff / this.dataList[i].gree * 100).toFixed(2))//人民币折扣  这个是总的单价 因为价格分为了软件和硬件的价格 所以上面的给了个空
                                    this.dataList[i].parsffOff = Number((this.dataList[i].greeOffMe / this.dataList[i].greeMe * 100).toFixed(2))//美元折扣  这个是总的单价 因为价格分为了软件和硬件的价格 所以上面的给了个空 显示的时候要减掉
                                    console.log(this.dataList[i].parsff, this.dataList[i].greeOff, this.dataList[i].gree)
                                    return
                                }
                            }
                        })


                        // for (let i = 0; i < res.length; i++) {
                        //   // console.log('setLists:::', JSON.stringify(res));
                        //   let result = this.generateFixedDataConstruction(res, "machine_id", "machine_id", "machineList"); // 生成数据
                        //   this.dataList = [...result];
                        //   this.dataList.forEach(item=>{
                        //     let num=0 ,numOff=0
                        //     let sum=0, sumOff=0
                        //     let bool=[0,0]
                        //     console.log(item)
                        //     item.machineList.forEach(ite=>{
                        //       // if(!isNaN(ite.total_price*1)){
                        //       //   num+=(ite.total_price*(100-ite.discount)/100)
                        //       // }
                        //       if(ite.configure_type==1&&bool[0]==0){
                        //         bool[0]=1
                        //         num+=ite.list_price
                        //         sum+=ite.discount_price
                        //       }
                        //       if(ite.configure_type==2&&bool[1]==0){
                        //         bool[1]=1
                        //         num+=ite.list_price
                        //         sum+=ite.discount_price
                        //       }
                        //     })
                        //    // console.log(num,sum)
                        //     this.$set(item,'num',item.machineList[0].countS)
                        //     this.$set(item,'numZ',100)
                        //     this.$set(item,'name',item.machineList[0].remark_name)
                        //     this.$set(item,'product_name',item.machineList[0].product_name)
                        //     this.$set(item,'product_des',item.machineList[0].product_des)
                        //     this.$set(item,'discount',item.machineList[0].discount)
                        //     this.$set(item,'gree',Math.round(num*100)/100)
                        //     this.$set(item,'greeMe',Math.round(num*100/this.done)/100)
                        //     this.$set(item,'greeOff',Math.round(sum*100)/100)
                        //     this.$set(item,'parsff',Math.round(sum/num*10000)/100)
                        //     this.$set(item,'show',false)
                        //    // console.log(item)
                        //     })
                        //
                        // }
                        console.log('dataList:::', this.dataList);
                    } else {
                        /*当删除方案时  没有数据，显示为空*/
                        this.dataList = [];
                    }
                    //console.log(this.dataList,this.rmbLists,this.hardLists)
                    // console.log(this.$store.state.data,this.$store.state.data.length)
                    this.$store.commit('updatedata'); //Vuex清空值
                    this.hardLists = []
                    this.rmbLists = []
                    this.dataList.forEach((item, ii) => {
                        // let num=0
                        // let nun=0
                        // let  seleMach=`SELECT configure_type,discount_price FROM "machine_price_detail" where machine_id='${item.machine_id}' and product_id='${item.product_id}' and solution_id='${item.solution_id}'`
                        //  new Promise((resolve, reject)=>{
                        //   this.$db.all(sql, (err, resA) => {
                        //     if (err) {
                        //       this.$logger(err);
                        //       this.$Notice.error({
                        //         title: '搜索失败',
                        //         desc: err,
                        //       });
                        //     } else {
                        //       console.log( resA)
                        //       return resolve(resA)
                        //     }
                        //   })
                        // }).then(resA=>{
                        //   let sum=0
                        //   resA.forEach((it,ind)=>{
                        //     if(ind<resA.length-2){
                        //       return
                        //     }else{
                        //       sum+=it.discount_price
                        //     }
                        //   })
                        //console.log(sum)
                        // let nuz=0
                        console.log('打印每一项-------', item)
                        let obj = { // 判断更改执行
                            product_name: item.product_name,//'产品'
                            remark_name: item.name, //机器的名称
                            count: item.num,//数量
                            list_price: Number(item.gree).toFixed(2),//相当于单价
                            list_priceOff: Number(item.greeOff).toFixed(2),//相当于单价 打折后的
                            list_priceOffMe: Number(item.greeOffMe).toFixed(2),//Math.round(item.greeOff/this.done * 100) / 100,//相当于单价 打折后的
                            list_priceMe: Number(item.greeMe).toFixed(2),//Math.round(item.gree/this.done * 100) / 100,//相当于美元的单价
                            // list_priceOffMe:Math.round(item.greeOff/this.done * 100) / 100,//相当于单价 打折后的
                            // list_priceMe:Math.round(item.gree/this.done * 100) / 100,//相当于美元的单价
                            // discount:item.parsff,//打折的数  展示为人民币的 9折  90%
                            discount: item.parsff,//打折的数  展示为人民币的 9折  90%
                            discountMe: 100 - item.parsffOff,//打折的数 展示为美元的
                            // discountMe:(((100-item.parsff)*100)/100).toFixed(2),//打折的数 展示为美元的
                            // all_price: Math.round(item.gree * item.num * 100) / 100,//人民币的价格 列表价 保留小数点2位
                            // -----------修改的代码-------下方代码以后没问题可以将上面的去掉.
                            // all_price:((item.gree * item.num * 100) / 100).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,'),
                            all_price: item.gree * item.num.toFixed(2),
                            // all_priceMe:Math.round(item.gree * item.num/this.done * 100) / 100,//美元的价格 列表价
                            all_priceMe: Math.round(item.greeMe * item.num * 100) / 100,  // 美元列表价
                            sale_untaxMe: Math.round(item.greeOffMe * item.num * 100) / 100,//美元的价格 未税
                            sale_taxMe: Math.round(item.greeOffMe * item.num * (100 + this.$store.state.tax)) / 100,//美元的价格 含税
                            sale_untax: Math.round(item.greeOff * item.num * 100) / 100,//人民币的价格 未税
                            sale_tax: Math.round(item.greeOff * item.num * (100 + this.$store.state.tax)) / 100,//人民币的价格 含税
                        }
                        // console.log(obj);
                        this.$store.commit('getdata', obj)
                        console.log(this.$store.state.data)
                        res.forEach((it, i) => {
                            if (it.product_id == 14 && it.machine_id == item.machine_id) {
                                this.hardLists.push({
                                    name: it.product_name,
                                    type: it.product_des
                                })
                            }
                            if (it.product_id == 13 && it.machine_id == item.machine_id) {
                                // console.log(33333,i,ii)
                                this.rmbLists.push({
                                    name: it.product_name,
                                    type: it.product_des
                                })
                            }
                        })
                        //{product_name:'产品',remark_name:'机器',count:'数量',list_price:'列表',discount:'折扣',sale_untax:'销售价',sale_tax:'含税'}
                    })
                    //})
                })
            },
            setDataListTit(index) {
                let sql = `UPDATE machine_info set remark_name='${this.dataList[index].name}' where id=${this.dataList[index].machine_id}`;
                this.$db.run(sql, (err, ser) => {
                    if (!err) {
                        console.log('修改成功');
                    }
                })
                this.$store.commit('changeMachineName', [index, this.dataList[index].name]);
            },
            /**
             * 判断list中是否存在属性名是idName并且属性值为idValue如果有，返回所在list中的位置
             * @param list 被判断的list
             * @param idName 被判断的ID名称
             * @param idValue 被判断的id值
             * @return 判断当前list中是否存在某个对象的属性名为idName，属性值为idValue的对象，如果存在就返回该对象在数组中的位置，如果不存在就返回null
             */
            isInList(list, idName, idValue) {
                try {
                    for (let i = 0; i < list.length; i++) {
                        //如果取得
                        if (list[i][idName] == idValue) {
                            //返回该idName所在的位置id
                            return i;
                        }
                    }
                } catch (e) {
                    return null;
                }
            },
            /**
             * 向array中放入一个对象,对象的属性包括id和value，还有创建新的list
             * @param array 被压入数据的list
             * @param idName 被压入对象的属性名
             * @param idValue 被压入对象idName对应的属性值
             * @param objectList 被创建属性名为objectListName(obj的属性)的值
             * @param objectValue 被押入到objectList中的值
             * @return 返回对已存在数组array封装后的数据数组
             * 调用举例，可以搜索下面所在的位置
             * this.pushIdAndValueToArray(this.solutionList, "solutionId", selectResult[i].solution_id, [], "solutionLists", selectResult[i]);
             * 此方法较为复杂，且依赖于我写的其他方法，如有疑问可询问我 By 海洋 2019年9月12日 12:01:21
             * */
            pushIdAndValueToArray(array, idName, idValue, objectList, objectListName, objectValue) {
                let obj = {};
                obj[idName] = idValue;
                //深克隆
                obj[objectListName] = JSON.parse(JSON.stringify(objectList));
                obj[objectListName].push(objectValue);
                array.push(obj);
                return array;
            },
            /**
             *从sourceList生成[{idNameInDestList:值,subListNameInDestList:值},{},{}....]的指定样式数据
             * @param sourceList 数据源
             * @param idNameInSourceList 在数据源中的需要取值的id名称
             * @param idNameInDestList 在生成的数据格式中自定义的目标数据的属性id名称
             * @param subListNameInDestList 在生成的数据格式中自定义的目标数据的属性子List名称
             * @param 返回指定样式的数据，样式见注释
             * 使用举例this.solutionList= this.generateFixedDataConstruction(selectResult,"solution_id","solutionId","productList");
             * 此方法较为复杂，且依赖于我写的其他方法，如有疑问可询问我 By 海洋 2019年9月16日 15:26:31
             * */
            generateFixedDataConstruction(sourceList, idNameInSourceList, idNameInDestList, subListNameInDestList) {
                let destList = [];
                for (let i = 0; i < sourceList.length; i++) {
                    // 判断destList中是否存在idNameInDestList所对应的列表
                    let solutionLocation = this.isInList(destList, idNameInDestList, sourceList[i][idNameInSourceList]);

                    // 如果不存在该产品idNameInDestList所对应的列表
                    if (solutionLocation == null) {
                        //创建新对象并放入到数组中
                        this.pushIdAndValueToArray(destList, idNameInDestList, sourceList[i][idNameInSourceList], [], subListNameInDestList, sourceList[i]);

                        // 如果存在该产品idNameInDestList所对应的方案列表
                    } else {
                        //将对象插入已有数组中
                        this.pushObjtoArray(destList[solutionLocation][subListNameInDestList], sourceList[i]);
                    }
                }
                return destList;
            }
            ,
            /**
             * 向一个list[]结构中push进一个对象
             * @param list 被压入的集合
             * @param obj 被压入的对象
             * @return push元素之后的list数组
             * */
            pushObjtoArray(list, obj) {
                list.push(obj)
                return list;
            },


            clkjump(index) { // 点击跳转至配置硬件页面
                localStorage.setItem('externalCapacityCard', 0);
                localStorage.setItem('internalCapacity', 300);
                localStorage.setItem('externalCapacity', 0);
                console.log(this.dataList[index])
                localStorage.machineId = this.dataList[index].machine_id
                localStorage.templateId = this.dataList[index].templete_id
                localStorage.solutionId = this.dataList[index].solution_id
                localStorage.productId = this.dataList[index].product_id
                if (localStorage.productId == 1) {
                    this.$router.push({ // 核心语句
                        path: '/Hardware/Processor', // 跳转的路径
                        query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                            id: 0,
                            sign: 3,
                            signT: 11
                        },
                    });
                }
                if (localStorage.productId == 2) {
                    this.$router.push({ // 核心语句
                        path: '/Hardware950/Processor', // 跳转的路径
                        query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                            id: 0,
                            sign: 3,
                            signT: 11
                        },
                    });
                }
            },
            tabRoute(index) {
                this.$router.push({ // 核心语句
                    path: this.dataList[index].product_id == 1 ? '/ProBack' : '/ProBack950', // 跳转的路径
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        id: 0,
                        machineId: this.dataList[index].machine_id,
                        solutionId: this.dataList[index].solution_id,
                        templateId: this.dataList[index].templete_id,
                        productId: this.dataList[index].product_id,
                        name: this.dataList[index].name
                        // count: this.dataList, //  传入参数
                    },
                });
            },
            getDataList() {
                // 获取数据
                const SQL = `select product.product_name,pp.remark_name,pp.count,pp.list_price
      from machine_info pp  join product_info product on product.id=pp.product_id
                             where product.id='${localStorage.productId}'`;
                new Promise((resolve, reject) => {
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            return resolve(res)
                        }
                    })
                }).then(res => {
                    for (let i = 0; i < res.length; i++) {
                        // console.log(res);
                        this.machine = res[i].count; // xuex传入数量
                        this.allNum = res[i].sale_untax;
                        this.endNum = res[i].sale_tax;
                    }
                })
                // this.$db.all(SQL, (err, res) => {
                //     if (err) {
                //         this.$logger(err);
                //         this.$Notice.error({
                //             title: '搜索失败',
                //             desc: err,
                //         });
                //     } else {
                //         for (let i = 0; i < res.length; i++) {
                //             // console.log(res);
                //             this.machine = res[i].count;
                //             this.allNum = res[i].sale_untax;
                //             this.endNum = res[i].sale_tax;
                //         }
                //     }
                // });
            },
            setnum(ind) { // 计算折扣方法
                // console.log(">>>>>>  存储");
            },
            setSQL(index) { // 利用
                const SQL = `update machine_info  set count='${this.dataList[index].num}',list_price='${this.dataList[index].gree}'`;
                // console.log(this.machine, this.allNum);
                this.$db.run(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        // console.log(this.showdata, allNum);
                    }
                });
            },
            getData() { // 机器
                const sql = `select distinct info.product_name,info.product_des from product_info info left join product_programme_detail detail on info.id=detail.product_id

																		left join solution so      on  so.id='${localStorage.solutionId}'`;
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        // console.log(res)
                        for (let i = 0; i < res.length; i++) {
                            this.tableData = res[i];
                            // console.log(this.tableData,res);
                        }
                    }
                });
            },
            getCUPMEMHDnum() { // 获取cpu值，内存容量，硬盘容量
                const cpu = this.$store.state.cpu_C;
                const mem = this.$store.state.allMemory;
                // console.log(cpu, mem);
                this.cpuNum = cpu * 1;
                this.memNum = mem;
            },
            getmemNum() { // 获取内存总容量
                const SQL = `select capacity,component_count from component_memory mem
									left join component_category       cate   on cate.id=mem.category_id
									left join product_programme_detail detail on detail.component_id=mem.id
									where detail.category_id=2 and detail.solution_id = '${localStorage.solutionId}' and detail.product_id='${localStorage.productId}' and detail.machine_id=${localStorage.machineId} and detail.template_id='${localStorage.templateId}'`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        let num = 0;
                        for (let i = 0; i < res.length; i++) {
                            // console.log(res, '内存');
                            num += res[i].capacity * res[i].component_count; // 计算内存存储总数
                        }
                        this.memNum = num;
                        // console.log(this.memNum);
                    }
                });
            },
            gethdmNum() { // 获取硬盘总容量
                const SQL = `select capacity,component_count from component_disk disk
									left join component_category       cate   on cate.id=disk.category_id
									left join product_programme_detail detail on detail.component_id=disk.id
									where detail.category_id=1 and detail.solution_id = '${localStorage.solutionId}' and detail.product_id='${localStorage.productId}' and detail.machine_id=${localStorage.machineId} and detail.template_id='${localStorage.templateId}'`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        let num = 0;
                        for (let i = 0; i < res.length; i++) {
                            // console.log(res[i], '硬盘');
                            num += res[i].capacity * res[i].component_count; // 计算硬盘存储总数
                        }
                        this.hdNum = num;
                        // console.log(this.hdNum);
                    }
                });
            },
            getSfw() { // 获取操作系统
                const SQL = `select software_name,software_des  from component_software where id=(select component_id from product_programme_detail where category_id=13 AND product_id='${localStorage.productId}' AND solution_id='${localStorage.solutionId}'and  machine_id=${localStorage.machineId} and template_id='${localStorage.templateId}')
`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        for (let i = 0; i < res.length; i++) {
                            this.sfwName = res[i].software_name; // 操作系统名称
                            this.sfSynopsis = res[i].software_des;// 操作系统简介
                        }
                    }
                });
            },
            getElse() { // 获取逻辑分区
                const SQL = `select software_name,software_des  from
      component_software where id=(select component_id from product_programme_detail where category_id=14 AND product_id='${localStorage.productId}' AND solution_id='${localStorage.solutionId}' and machine_id=${localStorage.machineId} and template_id='${localStorage.templateId}')
`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        for (let i = 0; i < res.length; i++) {
                            // console.log(res);
                            this.elseName = res[i].software_name; // 其他软件名称
                            this.elseSynopsis = res[i].software_des;// 其他软件简介
                        }
                    }
                });
            },
            //item.machineList[1].remark_name,'cfr',item.machineList[1].product_id,item.machineList[1].solution_id,item.machineList[1].template_id,item.machineList[1].machine_id)">导出方案文件(.cfr)</span>-->
            async exportCfr(machineinfo, tailName) {
                let typeModel = machineinfo.machine_model + '-' + machineinfo.machine_submodel
                if (typeModel == '9009-42A') {
                    await exportCfrOrCsv.exportCfrOrCsv(machineinfo.name, tailName, machineinfo.product_id, machineinfo.solution_id, machineinfo.templete_id, machineinfo.machine_id);
                } else {
                    await exportCfrOrCsv950.exportCfrOrCsv950(machineinfo.name, tailName, machineinfo.product_id, machineinfo.solution_id, machineinfo.templete_id, machineinfo.machine_id);
                }
            },
            async exportIpscs(machineName, tailName, productId, solutionId, templateId, machineId) {
                let tempStr = await exportIpscs.exportIpscs(machineName, productId, solutionId, templateId, machineId, 1);
                let solutionList = await this.getSolutionList(localStorage.getItem("solutionId"));
                exportSolutionCFR.exportSolutionCFR.setValue(solutionList, machineName, ipscsConvert.strConvertCfr(tempStr.resultStr, machineName, false, tempStr.dataList));
            },
            async exportExcel(machineName, tailName, productId, solutionId, templateId, machineId) {
                await exportExcel.exportExcel(machineName, tailName, productId, solutionId, templateId, machineId);
            },
            /**
             * 获取某个方案信息
             * @param solutionId
             */
            async getSolutionList(solutionId) {
                let that = this;
                let solutionList = [];
                const SQL = `SELECT * FROM solution WHERE id = ${solutionId}`;
                await new Promise(function (resolve, reject) {
                    that.$db.all(SQL, (err, res) => {
                        if (err) {
                            resolve(null);
                        } else {
                            resolve(res);
                        }
                    });
                }).then((data) => {
                    solutionList = data;
                });
                return solutionList;
            }
        },
        created() {
            // this.setDataListTit();
            document.getElementById('app').onclick = (e) => {
                this.dataList.forEach((item, index) => {
                    this.dataList[index].show = false;
                })
            };
            if (localStorage.machineId == undefined || localStorage.machineId == '') return;
            this.userId = localStorage.userId;
            console.log('this.userId', this.userId)
            console.log(this)
            // console.log(22222);
            this.getFrequency();
            this.setdatas();
            this.getData();
            this.getCUPMEMHDnum(); // 获取CPU数量
            this.getDataList();
            this.getmemNum();
            this.gethdmNum();
            this.getSfw();
            this.getElse();
        },
        beforeRouterEnter(from, to, next) {
            // console.log(111111);
            next(vm => {
                vm.$emit('comup', from.query.id);
                vm.getCUPMEMHDnum();
            });
        },
        watch: {
            '$store.state.solutionId': function () {
                console.log(this.$store.state.solutionId);
                this.solutionId = this.$store.state.solutionId;
                this.dataList = [];
                this.setLists();
                // console.log(">>>>>>>>>>>>运行成功")
                // this.getDataList();
            },
        },
    };
</script>

<style scoped lang="scss">
    * {
        padding: 0;
        margin: 0;
        list-style: none;
        box-sizing: border-box;
    }

    .wrap {
        width: 100%;
        padding: 20px;
    }

    .elInp {
        style: none;
        background: none;
        border: none;
        width: 80px;
    }

    .logos {
        width: 130px;
        height: 130px;
        cursor: pointer;

        img {
            width: 130px;
        }
    }

    .outBox {
        .outList {
            display: flex;

            li {
                margin-left: 12px;
            }
        }
    }

    .listp {
        margin-top: 12px;
        padding-bottom: 12px;
        font-weight: bolder;
    }

    .intro-list {
        width: 100%;
        padding-bottom: 20px;
        display: flex;
        border-bottom: 1px solid #ebebeb;

        .list {
            flex: 1;
            width: 100%;
            padding-left: 20px;

            .list-header {
                width: 100%;
                padding: 12px;
                display: flex;
                justify-content: space-between;

                p {
                    padding: 12px;
                    font-weight: bolder;
                }

                ul {
                    display: flex;
                    padding: 20px;

                    li {
                        padding-left: 12px;
                    }
                }
            }

            .list-main {
                width: 100%;
                display: flex;

                .mian-list {
                    width: 100%;
                    padding-top: 10px;
                    display: flex;
                    justify-content: space-between;

                    mainlist-li {
                        padding: 12px;

                        .ols {
                            padding-top: 20px;
                        }
                    }
                }
            }
        }
    }

    .mainlist-btn {
        display: flex;

        .mainlist {
            cursor: pointer;
            height: 60px;
            padding: 12px;
            text-align: center;

            img {
                height: 20px;
            }

            span {
                display: block;
            }
        }
    }

    .inp {
        width: 32px;
        border-style: none;
        outline: none;
        border-bottom: 1px solid #333333;
    }

    .showlis {
        display: flex;

        p {
            margin-right: 12px;
        }

        span {
            padding-left: 12px;

        }

    }

    /*.export{*/
    /*padding-bottom: 6px;*/
    /*}*/
    .config {
        background-image: url("../../../../static/config20.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .delete {
        background-image: url("../../../../static/object/delete1.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .export {
        background-image: url("../../../../static/export20.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .change-height {
        padding-top: 15px;
    }

    .config-span:hover {
        color: #007fff;
    }

    .delete-span:hover {
        color: #007fff;
    }

    .export-span:hover {
        color: #007fff;
    }

    .config:hover {
        background-image: url("../../../../static/config.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .delete:hover {
        background-image: url("../../../../static/object/delete2.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .export:hover {
        background-image: url("../../../../static/export.png");
        background-repeat: no-repeat;
        background-position: top;

    }

    .position {
        position: relative;
    }

    .programme {
        position: absolute;
        top: 55px;
        right: 0;
    }

    /*导出方案文件  样式*/
    .transition-box {
        width: 175px;
        height: 45px;
        line-height: 45px;
        background: #fff;
        border: 1px solid #fff;
        border-radius: 4px;
        text-align: center;
        box-sizing: border-box;
    }

    .transition-box:last-child{
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-top: none;
    }
    .transition-box:first-child{
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: none;
    }
    .transition-box:hover{
        background-color: #ecf5ff;
    }
    .transition {
        border-top: none;
    }

</style>
