<template>
    <!--cpu处理器-->
    <div class="processor">

        <!--计算节点-->
        <div class="processor-hea content-label">{{$t('Processor.lists.computationalNode.title')}}</div>
        <div class="for-main">
            {{$t('Processor.lists.computationalNode.content1')}}：
            <el-select v-model="value" placeholder="1" size="mini" disabled class="sel">
                <el-option
                        v-for="item in tempon"
                        :key="item"
                        :label="item"
                        :value="item"
                >
                </el-option>
            </el-select>
        </div>

        <!--Cpu 配置-->
        <div class="processor-hea content-label">{{$t('Processor.lists.CPUconfiguration.title')}}</div>
        <div class="processor-conte for-main">
            <el-select v-model="valueDown" size="mini" @change="update(valueDown,1)">
                <el-option
                        v-for="(item,index) in this.$store.state.info_language?optionsN:options"
                        :key="item"
                        :label="item"
                        :value="index">
                </el-option>
            </el-select>
            <p>*</p>
            <el-select v-model="valueNum" placeholder="1" size="mini" @change="update(valueDown,1)" class="sel">
                <el-option
                        v-for="item in optionsNum"
                        :key="item"
                        :label="item"
                        :value="item"
                        v-if="item>1">
                </el-option>
            </el-select>
            <div class="pdiv" v-if="cpuTit!=null">
                {{cpuTit}}
            </div>
            <div class="pdiv red-a" v-if="uiStatus">
                {{$store.state.info_language?uiStatusEn:uiStatus}}
            </div>
            <div class="pdiv" v-if="setTimeMe">
                {{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{setTimeMe}}&gt;  {{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}} <{{overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}
                <!--此部件将于&lt; {{setTimeMe}}&gt; 停产。距离停产日期还有&lt; {{overdueTime}}&gt; 天-->
            </div>
            <div class="pdiv">
                {{$t('Processor.lists.CPUconfiguration.content1')}} {{valueNum}} / {{optionsNum}}
            </div>
        </div>

        <!--激活配置-->
        <div class="processor-hea content-label">{{ $t('Processor.lists.ActiveConfiguration.title')}}</div>
        <div class="processor-activations">
            <!--常规激活核心数-->
            <div class="processor-one">
                <label>{{ $t('Processor.lists.ActiveConfiguration.NumberOfRegularActivationCores')}}: {{value1}}</label>
                <div class="processor-slider">
                    <el-slider v-model="value1"
                               :max="core*valueNum"
                               :min="core"
                               :show-tooltip="false"
                               @change="updateCore()"></el-slider>
                </div>
                <span class="core-num">({{ $t('Processor.lists.ActiveConfiguration.TotalCoreNumber')}}：{{core*valueNum}})</span>
            </div>
            <!-- 1CPU核天激活数-->
            <div class="processor-two">
                {{ $t('Processor.lists.ActiveConfiguration.NumberOfNuclearDayDctivationOf')}}:
                <el-input v-model="input1" class="core-num-input" :placeholder="$store.state.info_language?'Please input':'请输入(0~9999)'" @keyup.native="changeNum()"
                          @change="updateCoreNum()" maxlength="4">
                </el-input>
            </div>
        </div>
        <!--提示信息-->
        <div class="processor-hea content-label">{{ $t('Processor.lists.promptMessage.title')}}</div>
        <!--<div class="processor-butt">-->
            <!--<p>-->
                <!--{{$t('Processor.lists.promptMessage.content1')}}<br/>-->
                <!--{{$t('Processor.lists.promptMessage.content2')}}-->
            <!--</p>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: 'Processor',
        data() {
            return {
                elasticityId: '', // 弹性激活码 1 detail表里id
                elasticityCodeId: '', // 弹性激活码 100 detail表里id
                sign: 0, // cpu 本身id
                core: 0, // cpu 核数
                input1: '',
                cpuId: '', // cpu detail表里id
                codeId: '', // 常规码 detail表里id
                value1: 10, // 滑块的值
                value: '', // 点击之后的结算节点的数量
                valueNum: 2, // 点击之后的插槽数量，默认为2
                valueDown: 0, // 点击之后的cpu的配置
                options: [], // cpu的配置，动态获取的  展示的中文
                optionsN: [],// cpu的配置，动态获取的  展示的英文
                optionN: [],// cpu的配置原始数据
                optionsNum: 4, // 动态获取插槽的数量，现在写的死数据
                tempon: 1, // 计算节点的数量，动态获取的
                temponTit: [], // cpu的提示信息，动态获取的
                cpuTit:'',
                name_id: '', // 产品的id
                cpu: 3, // 父组件传进的cpu
                vaule_id: '',
                error: '不可选',
                component_id: 0,//cpu的激活码id
                time: 0,//记录时间戳cpu的过期时间
                uiStatusEn: '',//英文的描述
                uiStatus: '',//中文的描述
                setTimeMe: '',//展示的时间
                overdueTime: '',//展示的过期时间
                backplane:0,
                orgValueNum:0,
            };
        },
        methods: {

            //插入 已选中的cpu和数量
            update(index,flag) {

                /*获取  CPU  提示信息*/
                this.temponTit.forEach((item,ind)=>{
                    if(index == ind){
                        this.cpuTit = item;
                    }
                })

                /*获取内存背板数  查看是否小于CPU数量   进行限制*/
                let sql=`select detail.id,detail.component_count,component_id,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status from component_base_info info
join component_memoryrisercard card on card.base_info_id=info.id
join product_programme_detail detail on detail.category_id=card.category_id and detail.component_id=card.id
where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                console.log(sql)
                this.$db.get(sql, (err, res) => {
                    if (err) {
                        console.log('查询失败')
                    } else {
                        console.log('查询成功',res)
                        this.backplane = res.id;
                        if(this.valueNum>=res.component_count){
                            let num = this.valueNum;
                            let updateNum = `UPDATE product_programme_detail set 'component_count'='${num}' where id=${this.backplane} `;
                            this.$db.run(updateNum, (err, res) => {
                                console.log(res, err);
                                if (res) {
                                    console.log('修改失败');
                                } else {
                                    console.log('修改成功');
                                }
                            })
                        }

                        console.log(this.valueNum)
                        console.log(res.component_count)
                        if(this.valueNum < 4 && res.component_count > 6){
                            this.err(this.$t('error.CpuAndMemory'))
                            this.valueNum = this.orgValueNum;
                            this.value1 = this.core*this.valueNum;
                            return false
                        }

                        if(this.valueNum < 3 && res.component_count > 4){
                            this.err(this.$t('error.CpuAndMemory'))
                            this.valueNum = this.orgValueNum;
                            this.value1 = this.core*this.valueNum;
                            return false
                        }

                        /*查看 内存条  看总数是否小于  cpu 数量*8  如果小于 赋值*/
                        let updateNum = `select detail.id,detail.component_count from product_programme_detail detail
join component_memory mem on mem.category_id=detail.category_id and mem.id=detail.component_id
where detail.product_id='${localStorage.productId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`;
                        this.$db.all(updateNum, (err, res) => {
                            console.log(res, err);
                            if (err) {
                                console.log('查询失败');
                            } else {
                                console.log('查询成功');

                                let sum = 0; // 相差的数
                                let num = 0; // 库里获取的数
                                let sumNum = this.valueNum * 8; // 内存条最小数
                                let component = 0;
                                let detailId = ''; // 获取数组中第一个id , 之后进行赋值
                                detailId = res[0].id;
                                res.forEach(item=>{
                                    console.log(item)
                                    num += item.component_count;
                                    if(sumNum > num){
                                        sum = sumNum - num;
                                        component = res[0].component_count;
                                        res[0].component_count = sum + component;

                                        let update = `update product_programme_detail set component_count =${res[0].component_count}  where id=${detailId}`;
                                        this.$db.run(update,(err,res)=>{
                                            if(err){
                                                console.log('操作失败')
                                            }else{
                                                console.log('操作成功')
                                            }
                                        })
                                    }
                                })
                                    console.log(sumNum,num,sum,component)
                            }
                        })


                        /*限制 内部PCIE 插槽数是否够，如果不够 不可以 减少 CPU 的数量*/

                        let pcie=`SELECT detail.* FROM product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where   detail.is_expansion=1 and detail.product_id='${localStorage.productId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                        console.log(pcie)
                        this.$db.all(pcie, (err, res) => {
                            if (err) {
                                console.log('查询失败')
                            } else {
                                console.log('查询成功',res)
                                let sumNum = 0;
                                res.forEach(item=>{
                                    console.log(item.component_count)
                                    sumNum += item.component_count;
                                })
                                console.log(sumNum)

                                if(this.valueNum < 4 && sumNum>9){
                                    this.valueNum = this.orgValueNum;
                                    this.value1 = this.core*this.valueNum;
                                    this.err(this.$t('error.CpuAndPcie'))
                                    return false
                                }

                                if(this.valueNum < 3 && sumNum>7){
                                    this.valueNum = this.orgValueNum;
                                    this.value1 = this.core*this.valueNum;
                                    this.err(this.$t('error.CpuAndPcie'))
                                    return false
                                }

                                this.optionN.forEach((ite, ind) => {
                                    if (index == ind) {
                                        this.core = ite.core;
                                        this.sign = ite.id;
                                    }
                                })

                                console.log(this.core, this.valueNum)

                                /*通过时间戳找id*/
                                let time = new Date().getTime();
                                console.log(this.cpuId)
                                if (this.cpuId) {
                                    const update = `UPDATE product_programme_detail set component_count ='${this.valueNum}',category_id = 3,component_id ='${this.sign}' where id ='${this.cpuId}'`
                                    this.$db.run(update, (err, res) => {
                                        if (res) {
                                            console.log("修改失败")
                                        } else {
                                            console.log("修改成功")
                                            this.$store.commit('setCPU', this.valueNum);
                                            /*常规激活吗 */   // 加flag  是因为  选择CPU数量时 ， 常规激活码 插入最大数量
                                            this.updateCore(flag)
                                            /*弹性激活码  */
                                            this.updateCoreNum()
                                        }
                                    })
                                } else {
                                    const SQLs = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','component_count')  VALUES('${localStorage.productId}','3',${this.sign},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${this.valueNum}')`;

                                    this.$db.run(SQLs, (err, res) => {
                                        if (err) {

                                        } else {
                                            if (res) {
                                                console.log("添加失败")
                                            } else {
                                                console.log("添加成功" + JSON.stringify(res));
                                                let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                                this.$db.get(selectSql, (err, res) => {
                                                    if (err) {
                                                        this.$logger(err);
                                                        this.$Notice.error({
                                                            title: '系统错误',
                                                            desc: err,
                                                        });
                                                        return
                                                    }
                                                    this.cpuId = res.id;
                                                })
                                                /*常规激活吗 */    // 加flag  是因为  选择CPU数量时 ， 常规激活码 插入最大数量
                                                this.updateCore(flag)
                                                /*弹性激活码  */
                                                this.updateCoreNum()
                                            }
                                        }
                                    });
                                }

                                /*选择 更换VRM 板*/
                                let VRMNum = 0;

                                if(this.valueNum == 2){
                                    VRMNum = 2
                                }
                                if(this.valueNum == 3 || this.valueNum == 4){
                                    VRMNum = 4
                                }

                                const updateVRM = `update product_programme_detail set component_count = ${VRMNum}
where id =(select id from product_programme_detail detail
     where component_id in (
     select id from component_other where base_info_id=
     (select id from component_base_info where component_FC='EMEF' and productId=2)
     )  and product_id='${localStorage.productId}' and template_id =11 and  solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'
)`
                                this.$db.run(updateVRM, (err, res) => {
                                    if (res) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                    }
                                })
                                console.log(this.valueNum)

                                this.orgValueNum = this.valueNum;
                            }
                        });
                    }
                });
            },

            // 插入 已选中的cpu 常规激活码
            updateCore(flag) {
                /*通过时间戳找id*/
                let time = new Date().getTime();


                /*查询 CPU 查询对应 常规激活码 */
                const update = `select id,category_id,s.activation_type,s.activation_unit from 	component_other   other
	join (select relation.base_info_id,relation.activation_type,relation.activation_unit from relation_cpu_activation relation
	join component_cpu cpu on cpu.id=relation.cpu_id where cpu.id =${this.sign} )	s  on s.base_info_id=other.base_info_id`
                console.log(update)
                this.$db.all(update, (err, res) => {
                    if (err) {
                        console.log("查询失败")
                    } else {
                        console.log("查询成功")
                        let categoryId = 0
                        let componentId = 0

                        console.log(res)
                        res.forEach(item => {

                            /*常规激活码*/
                            if (item.activation_type == 0) {
                                categoryId = item.category_id;
                                componentId = item.id;
                            }

                        })

                        let num = 0;
                        console.log(flag)
                        if (flag == 1) {
                            num = this.core * this.valueNum;
                            this.value1 = num;

                        } else {
                            num = this.value1;
                        }
                        console.log(num)

                        /*修改 操作系统 激活核心数*/
                        const updateData = `update product_programme_detail set component_count = ${num}
where category_id=18 and component_count!=1 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and template_id = '${localStorage.templateId}'`
                        this.$db.run(updateData, (err, res) => {

                            if(err){
                                console.log('修改失败')
                            }else{
                                console.log('修改成功')
                            }
                        })


                        /*修改 逻辑分区 激活核心数 */
                        const update = `update product_programme_detail set component_count = ${num}
where category_id=19 and component_count!=1 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and template_id = '${localStorage.templateId}'`
                        this.$db.run(update, (err, res) => {

                            if(err){
                                console.log('修改失败')
                            }else{
                                console.log('修改成功')
                            }
                        })



                        /*查找 应用程序 激活核心数 */
                        const updateList = `select * from product_programme_detail where  category_id=20  and component_count !=1 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and template_id = '${localStorage.templateId}'`
                        this.$db.all(updateList, (err, res) => {
                            if(err){
                                console.log('获取失败')
                            }else{
                                console.log('获取成功',res)

                                if(res.length>0){
                                    /*修改 应用程序 激活核心数 */
                                    const update = `update product_programme_detail set component_count = ${num}
where category_id=20 and component_count!=1 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and template_id = '${localStorage.templateId}'`
                                    this.$db.run(update, (err, res) => {
                                        if(err){
                                            console.log('修改失败')
                                        }else{
                                            console.log('修改成功')
                                        }
                                    })
                                }
                            }
                        })

                        if (this.codeId) {
                            const update = `UPDATE product_programme_detail set component_count ='${num}',category_id = ${categoryId},component_id ='${componentId}' where id ='${this.codeId}'`
                            console.log(update)
                            this.$db.run(update, (err, res) => {
                                if (res) {
                                    console.log("修改失败")
                                } else {
                                    console.log("修改成功")
                                }
                            })
                        } else {
                            const SQLs = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','component_count')  VALUES('${localStorage.productId}',${categoryId},${componentId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${this.core * this.valueNum}')`;

                            this.$db.run(SQLs, (err, res) => {
                                if (err) {

                                } else {
                                    if (res) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功" + JSON.stringify(res));
                                        let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                        this.$db.get(selectSql, (err, res) => {
                                            if (err) {
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '系统错误',
                                                    desc: err,
                                                });
                                                return
                                            }
                                            this.codeId = res.id;
                                        })
                                    }
                                }
                            });
                        }
                    }
                })
            },

            //获取单个数据的简单封装
            getsql(index, fun) {
                const SQL = index;
                this.$db.all(SQL, (err, res) => {
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

            /*获取库里的过期时间。。*/
            getcpuTime() {
                const cpu = `SELECT cc.id, cbi.productId, cbi.description_en, cbi.description, cbi.withdraw_date, cc.cpu_internal_code, cc.core,cbi.title_msg
FROM component_base_info AS cbi LEFT JOIN component_cpu AS cc ON cbi.id = cc.base_info_id
WHERE cbi.category_id = 3 AND cbi.productId = 2`; // 获取cpu的配置、cpu的提示信息，库里的链接
                this.getsql(cpu, res => { // 获取cpu的配置是个对象，后增到数组里面
                    this.options = []
                    this.optionsN = []
                    console.log(res)
                    res.forEach(item => {
                        this.options.push(item.description);
                        this.optionsN.push(item.description_en);
                        this.temponTit.push(item.title_msg); // cpu的提示信息更改为获取的

                        //将过期时间赋值给他
                        this.setTimeMe = item.withdraw_date
                        if (item.withdraw_date) {
                            //如果不为null的话,就改为天数
                            this.$store.commit('setStatusTime', item.withdraw_date)
                            this.overdueTime = this.$store.state.overdueTime
                        }

                        //展示的提示信息
                        this.$store.commit('uiStatusTime', item.ui_status)
                        this.uiStatus = this.$store.state.statusTime.uiStatus
                        this.uiStatusEn = this.$store.state.statusTime.uiStatusEn
                    })
                    // let  thisTime = res.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                    // this.time = new Date(thisTime).getTime();//将时间改为时间戳


                });
            },

            /*输入弹性激活容量时进行的数量校验*/
            changeNum() {

                this.input1 = this.input1.replace( /[^\.\d]/g, '');
                this.input1 = this.input1.replace('.', '');

            },

            /*插入 已选中的cpu 弹性激活码*/
            updateCoreNum() {

                if(isNaN(this.input1*1)){
                    console.log('不是一个数')
                    return false
                }

                console.log(typeof  this.input1 ,parseInt(this.input1))

                if(parseInt(this.input1)>0){
                    const SQLDel = `DELETE FROM product_programme_detail WHERE id in('${this.elasticityId}','${this.elasticityCodeId}')`;
                    console.log(SQLDel)
                    new Promise((resolve, reject) => {
                        this.$db.run(SQLDel, (err, res) => {
                            if (err) {
                                console.log('删除失败')
                            } else {
                                console.log('删除成功')
                                this.elasticityId = '';
                                this.elasticityCodeId = '';

                                const update = `select id,category_id,s.activation_type,s.activation_unit from 	component_other   other
	join (select relation.base_info_id,relation.activation_type,relation.activation_unit from relation_cpu_activation relation
	join component_cpu cpu on cpu.id=relation.cpu_id where cpu.id =${this.sign} )	s  on s.base_info_id=other.base_info_id`
                                console.log(update)
                                this.$db.all(update, (err, res) => {
                                    if (err) {
                                        console.log("查询失败")
                                    } else {
                                        console.log("查询成功")
                                        /* 弹性激活码  1 的*/
                                        let categoryId = 0;
                                        let componentId = 0;
                                        /* 弹性激活码  100 的*/
                                        let categoryIdCode = 0;
                                        let componentIdCode = 0;
                                        console.log(res)

                                        res.forEach(item => {

                                            /*弹性激活码  1的*/
                                            if (item.activation_unit == 0 && item.activation_type ==1) {
                                                categoryId = item.category_id;
                                                componentId = item.id;
                                            }

                                            /*弹性激活码  100的*/
                                            if (item.activation_unit == 1) {
                                                categoryIdCode = item.category_id;
                                                componentIdCode = item.id;
                                            }
                                        })

                                        if (this.input1 < 100) {
                                            if (!this.elasticityId) {
                                                /*通过时间戳找id*/
                                                let time = new Date().getTime();
                                                const SQLs = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','component_count')  VALUES('${localStorage.productId}',${categoryId},${componentId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${this.input1}')`;

                                                this.$db.run(SQLs, (err, res) => {
                                                    if (err) {

                                                    } else {
                                                        if (res) {
                                                            console.log("添加失败")
                                                        } else {
                                                            console.log("添加成功" + JSON.stringify(res));
                                                            let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                                            this.$db.get(selectSql, (err, res) => {
                                                                if (err) {
                                                                    this.$logger(err);
                                                                    this.$Notice.error({
                                                                        title: '系统错误',
                                                                        desc: err,
                                                                    });
                                                                    return
                                                                }
                                                                this.elasticityId = res.id;
                                                            })
                                                        }
                                                    }
                                                });
                                            }
                                        } else {

                                            if (this.input1 % 100 != 0) {
                                                if (!this.elasticityId) {
                                                    /*通过时间戳找id*/
                                                    let time = new Date().getTime();
                                                    const SQLs = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','component_count')  VALUES('${localStorage.productId}',${categoryId},${componentId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${this.input1 % 100}')`;

                                                    this.$db.run(SQLs, (err, res) => {
                                                        if (err) {

                                                        } else {
                                                            if (res) {
                                                                console.log("添加失败")
                                                            } else {
                                                                console.log("添加成功" + JSON.stringify(res));
                                                                let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                                                this.$db.get(selectSql, (err, res) => {
                                                                    if (err) {
                                                                        this.$logger(err);
                                                                        this.$Notice.error({
                                                                            title: '系统错误',
                                                                            desc: err,
                                                                        });
                                                                        return
                                                                    }
                                                                    this.elasticityId = res.id;
                                                                })


                                                                let str = this.input1.substr(0, this.input1.length - 2)

                                                                if (!this.elasticityCodeId) {
                                                                    /*通过时间戳找id*/
                                                                    let time = new Date().getTime();
                                                                    const SQLs = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','component_count')  VALUES('${localStorage.productId}',${categoryIdCode},${componentIdCode},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${str}')`;

                                                                    console.log(SQLs)
                                                                    this.$db.run(SQLs, (err, res) => {
                                                                        if (err) {

                                                                        } else {
                                                                            if (res) {
                                                                                console.log("添加失败")
                                                                            } else {
                                                                                console.log("添加成功" + JSON.stringify(res));
                                                                                let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                                                                this.$db.get(selectSql, (err, res) => {
                                                                                    if (err) {
                                                                                        this.$logger(err);
                                                                                        this.$Notice.error({
                                                                                            title: '系统错误',
                                                                                            desc: err,
                                                                                        });
                                                                                        return
                                                                                    }
                                                                                    this.elasticityCodeId = res.id;
                                                                                    console.log(this.elasticityCodeId)
                                                                                })
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        }
                                                    });
                                                }

                                            } else {

                                                let str = this.input1.substr(0, this.input1.length - 2)

                                                if (!this.elasticityCodeId) {
                                                    /*通过时间戳找id*/
                                                    let time = new Date().getTime();
                                                    const SQLs = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','component_count')  VALUES('${localStorage.productId}',${categoryIdCode},${componentIdCode},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${str}')`;

                                                    console.log(SQLs)
                                                    this.$db.run(SQLs, (err, res) => {
                                                        if (err) {

                                                        } else {
                                                            if (res) {
                                                                console.log("添加失败")
                                                            } else {
                                                                console.log("添加成功" + JSON.stringify(res));
                                                                let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                                                this.$db.get(selectSql, (err, res) => {
                                                                    if (err) {
                                                                        this.$logger(err);
                                                                        this.$Notice.error({
                                                                            title: '系统错误',
                                                                            desc: err,
                                                                        });
                                                                        return
                                                                    }
                                                                    this.elasticityCodeId = res.id;
                                                                    console.log(this.elasticityCodeId)
                                                                })
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    })
                }
            },

            /*不让删除或者是不让减少时展示*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'warning'
                });
            },
        },

        beforeRouteEnter(from, to, next) {//进入页面时执行获取参数
            next(vm => {
                vm.$emit('comup', from.query.id)
                vm.sign = from.query.sign
                /*获取库里的过期时间。。*/
                vm.getcpuTime()
                console.log(from, vm.$route, vm.sign)
            })
        },

        created() {

            let than = this
            const cpu = `SELECT cc.id, cbi.productId, cbi.description_en, cbi.description, cbi.withdraw_date, cc.cpu_internal_code, cc.core
FROM component_base_info AS cbi LEFT JOIN component_cpu AS cc ON cbi.id = cc.base_info_id
WHERE cbi.category_id = 3 AND cbi.productId = 2`; // 获取cpu的配置、cpu的提示信息，库里的链接
            new Promise(function (resolve, reject) {
                than.$db.all(cpu, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '删除失败',
                            desc: err,
                        });
                    } else {
                        return resolve(res)
                    }
                })
            }).then(res => {
                console.log(res)
                this.optionN = res;
                const cpuDetail = `select detail.component_count,detail.component_id,detail.id from product_programme_detail detail
	join component_cpu cpu on cpu.category_id = detail.category_id and cpu.id=detail.component_id   where detail.product_id = '${localStorage.productId}' and  solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`; // 获取cpu的配置、cpu的提示信息，库里的链接
                console.log(cpuDetail)
                new Promise(function (resolve, reject) {
                    than.$db.get(cpuDetail, (err, ress) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '删除失败',
                                desc: err,
                            });
                        } else {
                            return resolve(ress)
                        }
                    })
                }).then(ress => {
                    console.log(ress)
                    this.optionN.forEach((ite, ind) => {
                        if (ite.id == ress.component_id) {
                            this.valueDown = ind;
                            this.core = ite.core;
                            this.sign = ress.component_id;
                            this.valueNum = ress.component_count;
                            this.orgValueNum = ress.component_count;
                            // this.cpuId = ress.id;
                        }
                    })
                    this.cpuId = ress.id;
                    console.log(this.cpuId)
                    console.log(this.temponTit)
                    console.log(this.valueDown)
                    /*获取CPU提示信息*/
                    this.temponTit.forEach((item,ind)=>{

                        if(this.valueDown == ind){
                            this.cpuTit = item;
                        }
                    })
                    const codeDetail = `	select relation.activation_type,relation.activation_unit,detail.id,detail.component_count from relation_cpu_activation relation
	join component_other other on other.base_info_id=relation.base_info_id
	join product_programme_detail detail on detail.category_id=other.category_id and detail.component_id=other.id
	where detail.product_id='${localStorage.productId}'  and  solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`; // 获取cpu的配置、cpu的提示信息，库里的链接
                    new Promise(function (resolve, reject) {
                        than.$db.all(codeDetail, (err, rescode) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '删除失败',
                                    desc: err,
                                });
                            } else {
                                return resolve(rescode)
                            }
                        })
                    }).then(rescode => {
                        let elasticityNum = 0;
                        let elasticityCodeNum = 0;
                        console.log(rescode)
                        rescode.forEach(ite => {
                            /*常规激活码*/
                            if (ite.activation_type == 0) {
                                this.codeId = ite.id;
                                this.value1 = ite.component_count;
                            }

                            /*弹性激活码  1的*/
                            if (ite.activation_unit == 0 && ite.activation_type == 1) {
                                this.elasticityId = ite.id;
                                elasticityNum = ite.component_count;
                            }

                            /*弹性激活码  100的*/
                            if (ite.activation_unit == 1) {
                                this.elasticityCodeId = ite.id;
                                elasticityCodeNum = ite.component_count;
                            }
                        })
                        console.log(elasticityCodeNum,elasticityNum)

                        if(elasticityNum !== 0){
                            this.input1 = elasticityNum +'';
                        }

                        if(elasticityCodeNum !== 0){
                            this.input1 = elasticityCodeNum +'00';
                        }

                        if(elasticityCodeNum !== 0 && elasticityNum !== 0){
                            this.input1 = elasticityCodeNum +''+elasticityNum;
                        }

                    })
                })
            })
        },
    };
</script>

<style scoped lang="less">
    .processor {
        padding: 20px;

        .processor-hea {
            background: rgba(242, 242, 242, 1);
            padding: 5px;
        }

        .for-main {
            padding: 20px 0;
        }

        .processor-conte {
            margin: 30px 0;

            i {
                margin: 0 20px;
                font-size: 30px;
                height: 20px;
                display: inline-block;
                overflow: hidden;
            }
        }

        .scroll {
            margin: 50px;
            width: 500px;
            height: 5px;
            background: #ccc;
            position: relative;
            cursor: pointer;
        }

        p {
            /*margin-left: 20px;*/
        }

        .bar {
            width: 10px;
            height: 20px;
            background: #369;
            position: absolute;
            top: -7px;
            left: 0;
            cursor: pointer;
        }

        .mask {
            position: absolute;
            left: 0;
            top: 0;
            background: #369;
            width: 0;
            height: 5px;
        }
        .processor-butt {
            p {
                padding: 20px 0 0 10px;
            }

        }
    }


    .processor-activations{
        width: 100%;
        .processor-one{
            width: 100%;
            height: 60px;
            line-height: 60px;
            label{
                display: inline-block;
                overflow: hidden;
            }
            .processor-slider{
                width: 40%;
                position: relative;
                display: inline-block;
                padding: 10px 0;
                margin-left: 20px;
            }
            .core-num{
                margin-left: 20px;
                display: inline-block;
                overflow: hidden;
            }
        }
        .processor-two{
            width: 100%;
            .core-num-input{
                width: 200px;
            }
        }
    }
</style>
