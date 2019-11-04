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
    <div class="intro-list"  v-for="(item,index) in dataList">
      <div class="logos" @click="tabRoute"><img src="../assets/s924.png"></div>
      <ul class="list">
        <li class="list-header">
          <el-input type="text" class="elInp" v-model="item.name" @change="setDataListTit(index)"></el-input>
          <ul>
            <li>￥<span>{{item.gree}}</span></li>
            <li><span>{{discount}}</span>%off</li>
            <li><span><input type="number" min="1" v-model="item.num" class="inp" ref="inp" @keyup="upnum(index)"  @change="num(index)"></span>Machine
            </li>
            <li>￥<span>{{item.gree * item.num}}</span></li>
          </ul>
        </li>
        <div class="showlis"><p>{{item.product_name}}</p> - <span>{{item.product_des}}</span></div>
        <li class="list-main">
          <ul class="mian-list">
            <li class="mainlist-li">
              <p class="listp">{{ $t('details.machine.hardware')}}</p>
              <ol>
                <li>{{item.machineList[2].sum_component_count}}个 3.2GHz {{item.machineList[2].sum_total_core_or_disk_count}} 核 32线程处理器</li>
                <li>{{item.machineList[1].sum_total_core_or_disk_count}}GB 内存容量</li>
                <li>{{item.machineList[0].sum_total_core_or_disk_count}}TB 硬盘容量</li>
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
              <div class="config" @click="clkjump(index)">
                <span class="change-height config-span">{{ $t('details.buttons.machineConfiguration')}}</span>
              </div>

              <div class="export position" @click="exportScheme(index)"  @mouseleave="onMouseOut(index)">
                <!--加入导出方案 移动选项-->
                <span class="change-height export-span">{{ $t('details.buttons.ExportMachine')}}</span>

                <div class="programme">
                  <el-collapse-transition>
                    <div v-show ="dataList[index].show">
                      <span class="transition-box" @click="exportCfr(item.machineList[1].remark_name,'exportSolutionCFR',item.machineList[1].product_id,item.machineList[1].solution_id,item.machineList[1].template_id,item.machineList[1].machine_id)">导出方案文件(.ipscs)</span>
                      <span class="transition-box" @click="exportCfr(item.machineList[1].remark_name,'xlsx',item.machineList[1].product_id,item.machineList[1].solution_id,item.machineList[1].template_id,item.machineList[1].machine_id)">导出方案文件(.xls)</span>
                      <span class="transition-box" @click="exportCfr(item.machineList[1].remark_name,'cfr',item.machineList[1].product_id,item.machineList[1].solution_id,item.machineList[1].template_id,item.machineList[1].machine_id)">导出方案文件(.cfr)</span>
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
    import exportCfrOrCsv from '../utils/exportCfrOrCsv';
    export default {
        name: 'DetailMain',
        data() {
            return {
                show: false,
                showdata: [],
                tableData: [], // 机器
                allNums: null, // 1台机器无折扣总价
                discount: 10, // 折扣
                machine: 1, // 机器数量
                allNum: null,
                endNum: null, // 折扣后总价
                dataList:[],

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
                numA:1
            };
        },
        methods: {

          /*导出方案*/
          exportScheme(index){
            this.dataList[index].show = !this.dataList[index].show
          },

          /*导出方案 移出隐藏*/
          onMouseOut(index){
            //console.log(index)
            this.dataList[index].show = false;

          },

            upnum(index){
                const reg = /^\+?[1-9]\d*$/; // 判断是否是数字
                let num = this.dataList[index].num+''; // 转为字符换
                // this.dataList[index].num = 23;
                if(this.dataList[index].num>0){ // 为数字时赋值
                    this.numA=this.dataList[index].num
                }else{
                   // num=this.dataList[index].num+''
                    this.dataList[index].num=this.numA //不为数字是变为上一次的值
                }
                //console.log("正确",num,this.$refs.inp)
                this.$refs.inp[index].style.width=(32+num.length*6)+'px' //增加判断长度
            },
            num(index){ // 根据机器数量对应计算
                //this.setSQL(index)
                //let num = this.dataList[index].num;
               // num.replace(/[^\d]/g,'');
                let sql = `UPDATE machine_info set count='${this.dataList[index].num}' where id=${this.dataList[index].machine_id}`;
                this.$db.run(sql,(err,ser)=>{
                    if(!err){
                        console.log('res>>>>>>>>','修改成功')
                    }
                    else{
                      console.log('>>>>',res);
                    }
                })
                console.log(this.dataList[index].num);
               // this.$store.commit('changeMachine', this.dataList[index].num); // 使用VUEX判断变化进行组件联系
                this.$store.commit('setdata',[index,this.dataList[index].num]) // 更改联系列表中的值
                console.log(this.$store.state.data)
            },
            setdatas() { // 总价计算
                const sql = ` select info.component_PN,info.component_FC,detail.categroy_id,info.name,info.description,detail.component_count,info.listprice_onshore
from product_programme_detail detail
left join solution           so     on  so.id=detail.solution_id
 left join component_categroy cate  on  cate.id =detail.categroy_id
left join component_memory   mem   on  mem.id =detail.component_id and detail.categroy_id=2
left join component_iocard   io    on io.id   =detail.component_id and detail.categroy_id=6
left join component_disk     disk  on disk.id =detail.component_id and detail.categroy_id=1
left join component_cpu      cpu    on  cpu.id  =detail.component_id and detail.categroy_id=3
left join component_power    power  on  power.id=detail.component_id and detail.categroy_id=5
left join component_backplane back  on  back.id =detail.component_id and detail.categroy_id=7
left join component_powerline    line    on line.id=detail.component_id  and detail.categroy_id=8
left join component_cpu_activation ac    on ac.id=detail.component_id  and detail.categroy_id=11
left join component_other    other  on  other.id=detail.component_id and detail.categroy_id=17
left join component_barebone    bb  on  bb.id=detail.component_id and detail.categroy_id=16
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
where detail.template_id='${localStorage.templateId}' and detail.categroy_id in (1,2,3,5,6,7,8,11,16,17) and so.id='${localStorage.solutionId}'`;
                let allNum = null;
                new Promise((resolve, reject)=>{
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
                }).then(res=>{
                    // console.log(res);
                    for (let i = 0; i < res.length; i++) {
                        const num = res[i].component_count * res[i].listprice_onshore;
                        this.showdata.push(res[i]);
                        allNum += num;
                        this.allNums = allNum;
                    }
                    this.setnum();
                })
                // this.$db.all(sql, (err, res) => {
                //     if (err) {
                //         this.$logger(err);
                //         this.$Notice.error({
                //             title: '搜索失败',
                //             desc: err,
                //         });
                //     } else {
                //         for (let i = 0; i < res.length; i++) {
                //             // console.log(res);
                //             const num = res[i].component_count * res[i].listprice_onshore;
                //             this.showdata.push(res[i]);
                //             allNum += num;
                //             this.allNums = allNum;
                //             // console.log(num);
                //         }
                //         // console.log(this.showdata, allNum);
                //     }
                //     this.setnum();
                // });
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
                    // console.log(maxnum);
                });
            },


            setLists(Num) {
                const sql = ` select product_info.product_name,product_info.product_des,machine_info.remark_name,detail.categroy_id,info.categroy_name,detail.machine_id,detail.solution_id,detail.template_id,detail.product_id,SUM(detail.component_count) sum_component_count,SUM(detail.component_count*cpu.core) sum_total_core_or_disk_count ,SUM(info.listprice_offshore*detail.component_count) total_price ,? software_des,? software_name,machine_price_detail.discount,machine_price_detail.list_price,machine_price_detail.discount_price,machine_price_detail.configure_type
 from product_programme_detail detail
JOIN component_cpu cpu ON detail.categroy_id=cpu.category_id
JOIN component_base_info info on cpu.base_info_id=info.id
JOIN machine_info on machine_info.id=detail.machine_id AND machine_info.status=1
JOIN product_info ON product_info.id=detail.product_id
JOIN machine_price_detail on machine_price_detail.machine_id=detail.machine_id AND configure_type=1
where detail.product_id='${localStorage.productId}' and detail.solution_id='${localStorage.solutionId}'
GROUP BY detail.machine_id
UNION
select product_info.product_name,product_info.product_des,machine_info.remark_name,detail.categroy_id,info.categroy_name,detail.machine_id,detail.solution_id,detail.template_id,detail.product_id,SUM(detail.component_count) sum_component_count,SUM(detail.component_count*memory.capacity) sum_total_core_or_disk_count,SUM(info.listprice_offshore*detail.component_count) total_price,? software_des,? software_name,machine_price_detail.discount,machine_price_detail.list_price,machine_price_detail.discount_price,machine_price_detail.configure_type
from product_programme_detail detail
JOIN component_memory memory ON detail.categroy_id=memory.category_id
JOIN component_base_info info on memory.base_info_id=info.id
JOIN machine_info on machine_info.id=detail.machine_id AND machine_info.status=1
JOIN product_info ON product_info.id=detail.product_id
JOIN machine_price_detail on machine_price_detail.machine_id=detail.machine_id AND configure_type=1
where detail.product_id='${localStorage.productId}' and detail.solution_id='${localStorage.solutionId}'
GROUP BY detail.machine_id
UNION
select product_info.product_name,product_info.product_des,machine_info.remark_name,detail.categroy_id,info.categroy_name,detail.machine_id,detail.solution_id,detail.template_id,detail.product_id,SUM(detail.component_count) sum_component_count,SUM(detail.component_count*disk.capacity) sum_total_core_or_disk_count,SUM(info.listprice_offshore*detail.component_count) total_price,? software_des,? software_name,machine_price_detail.discount,machine_price_detail.list_price,machine_price_detail.discount_price,machine_price_detail.configure_type
from product_programme_detail detail
JOIN component_disk disk ON detail.categroy_id=disk.category_id
JOIN component_base_info info on disk.base_info_id=info.id
JOIN machine_info on machine_info.id=detail.machine_id AND machine_info.status=1
JOIN product_info ON product_info.id=detail.product_id
JOIN machine_price_detail on machine_price_detail.machine_id=detail.machine_id AND configure_type=1
where detail.product_id='${localStorage.productId}' and detail.solution_id='${localStorage.solutionId}'
GROUP BY detail.machine_id
UNION
select product_info.product_name,product_info.product_des,machine_info.remark_name,detail.categroy_id,category.name category_name,detail.machine_id,detail.solution_id,detail.template_id,detail.product_id,SUM(component_count) sum_component_count,? a,SUM(detail.component_count*purchase) sum_purchase, software.software_des,software.software_name,machine_price_detail.discount,machine_price_detail.list_price,machine_price_detail.discount_price,machine_price_detail.configure_type
from product_programme_detail detail
JOIN component_software software ON detail.categroy_id=software.categroy_id AND detail.component_id=software.id
JOIN component_categroy category ON category.id=software.categroy_id
JOIN machine_info on machine_info.id=detail.machine_id AND machine_info.status=1
JOIN product_info ON product_info.id=detail.product_id
JOIN machine_price_detail on machine_price_detail.machine_id=detail.machine_id AND configure_type=2
where detail.categroy_id in(13,14) and detail.solution_id='${localStorage.solutionId}' AND detail.product_id='${localStorage.productId}'
GROUP BY detail.machine_id,detail.categroy_id`;
                // console.log(sql)
                new Promise((resolve, reject)=>{
                    this.$db.all(sql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                          console.log( res)
                          return resolve(res)
                        }
                    })
                }).then(res=>{
                    for (let i = 0; i < res.length; i++) {
                        // console.log('setLists:::', JSON.stringify(res));
                        let result = this.generateFixedDataConstruction(res, "machine_id", "machine_id", "machineList"); // 生成数据
                        this.dataList = [...result];
                        this.dataList.forEach(item=>{
                          let num=0
                            item.machineList.forEach(ite=>{
                                if(!isNaN(ite.total_price*1)){
                                    num+=(ite.total_price*(100-ite.discount)/100)
                                }
                                // console.log(num,ite.total_price*(100-ite.discount))
                            })

                            this.$set(item,'num',1)
                            this.$set(item,'numZ',100)
                            this.$set(item,'name',item.machineList[0].remark_name)
                            this.$set(item,'product_name',item.machineList[0].product_name)
                            this.$set(item,'product_des',item.machineList[0].product_des)
                            this.$set(item,'discount',item.machineList[0].discount)
                            this.$set(item,'gree',num)
                            this.$set(item,'show',false)
                        })

                        // console.log('dataList:::', JSON.stringify(this.dataList));
                    }
                     //console.log(this.dataList,this.rmbLists,this.hardLists)
                  // console.log(this.$store.state.data,this.$store.state.data.length)
                  this.$store.commit('updatedata'); //Vuex清空值

                    this.dataList.forEach((item,ii)=>{
                        let num=0
                        let nun=0
                        // let nuz=0
                      console.log( item)
                        let obj=  { // 判断更改执行
                            product_name: item.machineList[0].product_name,//'产品'
                            remark_name:item.machineList[0].remark_name,
                            count:item.num,
                            list_price:item.gree,
                            all_price: item.gree * item.num,
                            discount:this.discount,
                            sale_untax:item.gree - (item.gree - ((100 - this.discount)/100*item.gree)),
                            sale_tax:item.gree - (item.gree - ((100 - this.discount)/100*item.gree)),
                        }
                        // console.log(obj);
                        this.$store.commit('getdata',obj)
                        // console.log(this.$store.state.data)
                        item.machineList.forEach((it,i)=>{
                            if(it.categroy_id==14&&num==0){
                                // console.log(1111,i,ii)
                                this.hardLists.push({
                                    name:it.software_name,
                                    type:it.software_des
                                })
                                num=1
                            }
                            if(it.categroy_id==13&&nun==0){
                                // console.log(33333,i,ii)
                                this.rmbLists.push({
                                    name:it.software_name,
                                    type:it.software_des
                                })
                                nun=1
                            }
                        })
                        //{product_name:'产品',remark_name:'机器',count:'数量',list_price:'列表',discount:'折扣',sale_untax:'销售价',sale_tax:'含税'}
                    })
                })
                // this.$db.all(sql, (err, res) => {
                //     if (err) {
                //         this.$logger(err);
                //         this.$Notice.error({
                //             title: '搜索失败',
                //             desc: err,
                //         });
                //     } else {
                //         console.log('setLists:::', JSON.stringify(res));
                //         let result = this.generateFixedDataConstruction(res, "machine_id", "machine_id", "machineList");
                //         this.dataList = [...result];
                //         console.log('dataList:::', JSON.stringify(this.dataList));
                //
                //     }
                // });
            },
            setDataListTit(index){
                let sql = `UPDATE machine_info set remark_name='${this.dataList[index].name}' where id=${this.dataList[index].machine_id}`;
                this.$db.run(sql,(err,ser)=>{
                    if(!err){
                        console.log('修改成功');
                    }
                })
                this.$store.commit('changeMachineName',[index,this.dataList[index].name]);
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
                console.log(this.dataList[index].machineList[0])
              localStorage.machineId=this.dataList[index].machine_id
              localStorage.templateId=this.dataList[index].machineList[0].template_id
              localStorage.solutionId=this.dataList[index].machineList[0].solution_id
              localStorage.productId=this.dataList[index].machineList[0].product_id
                this.$router.push({ // 核心语句
                    path: '/Hardware/Processor', // 跳转的路径
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        id: 0,
                        sign:3,
                        signT:11
                    },
                });
            },
            tabRoute() {
                this.$router.push({ // 核心语句
                    path: '/ProBack', // 跳转的路径
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        id: 0,
                        // count: this.dataList, //  传入参数
                    },
                });
                // console.log(this.dataList)
            },
            getDataList() {
                // 获取数据
                const SQL = `select product.product_name,pp.remark_name,pp.count,pp.list_price
      from machine_info pp  join product_info product on product.id=pp.product_id
                             where product.id='${localStorage.productId}'`;
                new Promise((resolve, reject)=>{
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
                }).then(res=>{
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

																		left join solution so      on  so.id=1`;
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
									left join component_categroy       cate   on cate.id=mem.category_id
									left join product_programme_detail detail on detail.component_id=mem.id
									where detail.categroy_id=2`;
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
									left join component_categroy       cate   on cate.id=disk.category_id
									left join product_programme_detail detail on detail.component_id=disk.id
									where detail.categroy_id=1 `;
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
                const SQL = `select software_name,software_des  from component_software where id=(select component_id from product_programme_detail where categroy_id=13 AND product_id=1 AND solution_id=1)
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
      component_software where id=(select component_id from product_programme_detail where categroy_id=14 AND product_id=1 AND solution_id=1)
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
            exportCfr(machineName,tailName, productId,solutionId,templateId,machineId) {
                exportCfrOrCsv.exportCfrOrCsv(machineName,tailName, productId,solutionId,templateId,machineId);
            },
        },
        created() {
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
           // this.setDataListTit();
        },
        beforeRouterEnter(from, to, next) {
            // console.log(111111);
            next(vm => {
                vm.$emit('comup', from.query.id);
                vm.getCUPMEMHDnum();
            });
        },
        watch: {
            '$store.state.solutionId': function() {
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
  .elInp{
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
      height: 130px;
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

    div {
      cursor: pointer;
      height: 138px;
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
  .config{
    background-image:url("../assets/config20.png") ;
    background-repeat: no-repeat;
    background-position: top;
  }

  .export{
    background-image:url("../assets/export20.png") ;
    background-repeat: no-repeat;
    background-position: top;
  }

  .change-height{
    padding-top:15px;
  }

  .config-span:hover{
    color: #007fff;
  }

  .export-span:hover{
    color: #007fff;
  }

  .config:hover{
    background-image:url("../assets/config.png") ;
    background-repeat: no-repeat;
    background-position: top;
  }

  .export:hover{
    background-image:url("../assets/export.png") ;
    background-repeat: no-repeat;
    background-position: top;

  }

  .position{
    position: relative;
  }

  .programme{
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
    border: 1px solid #ccc;
    text-align: center;
    box-sizing: border-box;

  }

</style>
