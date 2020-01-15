<template>
    <!--配置软件-->
    <div class="hardware">
        <header>
            <b>{{$t('ConfigureSoftware.title')}}</b>
            <el-button type="primary" size="mini" @click="getElen()">{{$t('ConfigureSoftware.buttonNext')}}<i
                    class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="reload">{{$t('ConfigureSoftware.buttonLast')}}</el-button>
        </header>
        <div class="hardware-left">
            <nav v-for="(item, index) in config" :key="index" @mouseover="hardwareOver(index)"
                 @click="hardwareSwi(index)" ref="hardwareSwi" class="hardware-swi" @mouseout="hardwareOut()">
                <div class="hardware-left-bolder">
                    <img src="../../../../static/rectangle-1.png" v-show="!item.boole">
                </div>
                <img :src="item.img" v-show="item.boole"/>
                <img :src="item.img1" v-show="!item.boole"/>
                <div class="hardware-left-name">{{$store.state.info_language?item.nameCN:item.name}}</div>
                <i class="el-icon-arrow-left" v-show="!item.boole"></i>
                <i class="el-icon-arrow-right" v-show="item.boole"></i>
            </nav>
        </div>
        <div class="hardware-right">
            <keep-alive>
                <router-view v-show="hardwareBian" @comup="comup"></router-view>
            </keep-alive>

            <!-- 默认展示配置清单-->
            <el-table :data="addirmTable" style="width: 100%" v-show="!hardwareBian">
                <el-table-column align="center" type="index" :index="indexMethod"
                                 :label="$t('Software.details.list.serialNumber')" width="80">
                </el-table-column>
                <!--<el-table-column align="center" prop="component_id" label="PN" width="180">-->
                <!--</el-table-column>-->
                <el-table-column align="center" prop="template_name" label="FC" width="110">
                </el-table-column>
                <el-table-column align="center" prop="nameCN" :label="$t('Software.details.list.classify')" width="110" v-if="!$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" width="110" v-if="$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="software_desCN" :label="$t('Software.details.list.describingAccessories')" v-if="!$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="template_desc" :label="$t('Software.details.list.describingAccessories')" v-if="$store.state.info_language">
                </el-table-column>
                <el-table-column align="center"  prop="exeInfo_en" :label="$t('Software.details.list.exceptionPrompt')" v-if="$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="exeInfo" :label="$t('Software.details.list.exceptionPrompt')" v-if="!$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="component_count" :label="$t('Software.details.list.Quantity')" width="80">
                </el-table-column>
                <el-table-column align="center"  :label="$t('Software.details.list.price')" width="180">
                    <template slot-scope="scope">
                        <div v-if="!$store.state.currency_type">
                            <span v-show="$store.state.userId !=1">{{scope.row.total_price}}</span>
                            　　　 <span v-show="$store.state.userId ==1">- -</span>
                        </div>
                        　　　
                        <div v-if="$store.state.currency_type">
                            <span v-show="$store.state.userId !=1">{{scope.row.USDtotal_price}}</span>
                            　　　<span v-show="$store.state.userId ==1">- -</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-row :gutter="24" v-show="!hardwareBian">
                <el-col :span="7">
                    <div class="grid-content grid-total">{{$t('Software.details.aggregate')}}：
                        <span v-show="$store.state.userId !=1">
                            {{$store.state.currency_type?'$':'￥'}}
                            {{$store.state.currency_type?totalPriceOff:totalPrice | totalPriceFiltersSoftware}}
                        </span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">{{$t('Software.details.discount')}}：
                        <span v-show="$store.state.userId !=1">
                          <el-input v-model="input" @change="discountData(2)" v-if="!$store.state.currency_type"></el-input>
                            <el-input v-model="inputOff" @change="discountData(2)" v-if="$store.state.currency_type"></el-input>
                            %off
                        </span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </div>
                </el-col>
                <el-col :span="9">
                    <div class="grid-content bg-purple">{{$t('Software.details.discountedPrice')}}：
                        <span v-show="$store.state.userId !=1">
                        {{$store.state.currency_type?'$':'￥'}}
                        <el-input v-model="$store.state.currency_type?input1Off:input1" @change="getDiscountPrice(input1,2)" disabled></el-input>
                        </span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import Logic950 from '../9040MR9/Logic.vue';
    export default {

        name: 'Downen',
        data() {
            return {
                // 用户id
                userId:0,
                bool:false,
                // 折扣输入框
                input: 0,
                input1: '',
                // 总价
                totalPrice: 0,
                // 折扣
                discount: '',
                // 折扣价
                discountPrice: '',
                // 折扣id
                discountId: '',
                //美元的总价
                totalPriceOff:0,
                // 美元的折扣
                inputOff: 0,
                // 美元的折扣价
                input1Off: '',
                // 判断跳进时显示的组件
                hardwareBian: true,
                // 判断有没有点击过，
                hardware: -1,
                // 判断有没有被hover上
                hardwareOv: -1,
                //  默认展示配置清单数据
                addirmTable: [],
                coloBa: 0,
                // config: [
                //   {
                //     name: '逻辑分区',
                //     img: '../../src/renderer/assets/logic-1.png',
                //     img1: '../../src/renderer/assets/logic-2.png',
                //     boole: true,
                //   },
                //   {
                //     name: '操作系统',
                //     img: '../../src/renderer/assets/logic-3.png',
                //     img1: '../../src/renderer/assets/logic-4.png',
                //     boole: true,
                //   },
                //   {
                //     name: '应用程序',
                //     img: '../../src/renderer/assets/logic-5.png',
                //     img1: '../../src/renderer/assets/logic-6.png',
                //     boole: true,
                //   },
                // ],
            };
        },
        computed:{
            config() {
                return [
                    {
                        name: '1',
                        img: __static + '/logic-1.png',
                        img1: __static + '/logic-2.png',
                        boole: true,
                    },
                    {
                        name: 2,
                        img: __static + '/logic-3.png',
                        img1: __static + '/logic-4.png',
                        boole: true,
                    },
                    {
                        name: 3,
                        img: __static + '/logic-5.png',
                        img1: __static + '/logic-6.png',
                        boole: true,
                    },
                ]
            }
        },
        filters:{
            // 列表总价过滤器：加￥符号、保留两位小数四舍五入、使用分位分隔符
            totalPriceFiltersSoftware:function (value) {
                if (value) return  Number(value).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
            }
        },
        methods: {
            /* 输入 折扣 算出 折扣价*/
            discountData(type) {
                if (this.input < 100 && this.input >=0 && this.inputOff < 100 && this.inputOff >= 0 ) {
                    if(this.$store.state.currency_type){
                        this.inputOff=Number(this.inputOff).toFixed(2)
                        this.input = this.inputOff == 0 ? 0 : 100 - this.inputOff
                    } else {
                        this.input=Number(this.input).toFixed(2)
                        this.inputOff = this.input == 0 ? 0 : 100 - this.input
                    }
                    let inpu=this.input
                    if(this.input==0){
                        inpu=100
                    }
                    this.input = Number(this.input).toFixed(2);
                    this.input1 = ((this.totalPrice*inpu / 100).toFixed(2)).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                    this.input1Off = ((this.totalPriceOff*inpu / 100).toFixed(2)).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                    console.log(this.input)
                    this.addDiscountData(type)
                } else {
                    this.$message({
                        message: '请输入正确折扣',
                        type: 'warning',
                    });
                    console.log(this.input,this.inputOff)
                    if(this.$store.state.currency_type){
                        this.inputOff=this.input==0?0:100-this.input
                        this.input=this.inputOff==0?0:100-this.inputOff
                    }else{
                        this.input=this.inputOff==0?0:100-this.inputOff
                        this.inputOff=this.input==0?0:100-this.input
                    }
                }
            },
            /* 输入 折扣价 算出 折扣*/
            getDiscountPrice(num,type) {
                this.input = (100 - num / (this.totalPrice.replace(/,/g, "")) * 100).toFixed(2);
                this.addDiscountData(type)
            },
            /* 往数据库里插入已选数据*/
            addDiscountData(type) {
                let count=100
                if(this.input!=0){
                    count=this.input
                }
                const totalPrice =this.totalPrice.replace(/,/g, "")
                const discount =this.input //parseInt(this.input);
                const discountPrice =totalPrice*count/100;
                let totalPriceOff = this.totalPriceOff;//parseInt(this.totalPriceOff)
                let discountOff = this.inputOff;
                let discountPriceOff =totalPriceOff*count/100;
                console.log(totalPrice, discount, discountPrice, type,totalPriceOff,discountOff);
                if (this.discountId != '') {
                    const updateSql = `update machine_price_detail set product_id='${localStorage.productId}',solution_id='${localStorage.solutionId}',
                    list_price='${totalPrice}',discount='${discount}',discount_price='${discountPrice}',dollar_discount='${discountOff}',list_dollar_price='${totalPriceOff}',discount_dollar_price='${discountPriceOff}' WHERE machine_id='${localStorage.machineId}' AND configure_type ='${this.discountId}'`;
                    console.log(updateSql);
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log('修改失败');
                        } else {
                            console.log('修改成功');
                        }
                    });
                } else {
                    const SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_price,discount,discount_price,configure_type,dollar_discount,list_dollar_price,discount_dollar_price)
                    VALUES('${localStorage.productId}','${localStorage.solutionId}','${localStorage.machineId}',
                    '${totalPrice}','${discount}','${discountPrice}','${type}','${discountOff}','${totalPriceOff}','${discountPriceOff}')`;
                    this.$db.run(SQL, (err, res) => {
                        if (err) {
                            console.log('添加失败');
                        } else {
                            console.log('添加成功');
                            const selectSql = `select * from machine_price_detail where configure_type=${type}`;
                            this.$db.get(selectSql, (err, res) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '系统错误',
                                        desc: err,
                                    });
                                    return;
                                }
                                this.discountId = res.configure_type;
                                console.log(this.discountId);
                            });
                        }
                    });
                }
            },

            comup(index) {
                this.config[index].boole = false;
                this.coloBa = index;
            },

            hardwareSwi(index) {
                // if (this.hardware !== -1) {
                //     this.$refs.hardwareSwi[this.hardware].style.background = '#f5f5f5';
                // }
                // this.hardwareBian = !this.hardwareBian;
                // this.config[index].boole = !this.config[index].boole;
                // /* 更改背景颜色*/
                // this.$refs.hardwareSwi[index].style.background = '#f0f0f0';
                // if (this.hardware !== -1 && index !== this.hardware) {
                //     this.config[this.hardware].boole = true;
                //     this.hardwareBian = false;
                // }
                // if (index !== this.hardware) {
                //
                // }
                // this.hardware = index;
                // eslint-disable-next-line eqeqeq
                if (this.hardware == -1) {
                    this.config[this.coloBa].boole = true;
                    this.$refs.hardwareSwi[index].style.background = '#f1f1f1';
                    // this.config[0].boole = true;
                    this.hardwareBian = !this.hardwareBian;
                }
                if (this.hardware == -1 && index == this.coloBa) {
                    this.config[this.coloBa].boole = !this.config[this.coloBa].boole;
                    this.hardwareBian = !this.hardwareBian;
                }
                this.hardwareBian = !this.hardwareBian;
                this.config[index].boole = !this.config[index].boole;
                /* 更改背景颜色*/
                this.$refs.hardwareSwi[index].style.background = '#f0f0f0';
                if (this.config[index].boole) {
                    this.$refs.hardwareSwi[index].style.background = '#f5f5f5';
                }
                if (this.hardware !== -1 && index !== this.hardware) {
                    this.config[this.hardware].boole = true;
                    this.$refs.hardwareSwi[this.hardware].style.background = '#f5f5f5';
                    this.hardwareBian = true;
                }
                this.hardware = index;
                /* 页面跳转*/
                if (index == 0) {
                    this.$router.push({ path: '/Downen950/Operation', query: { id: 0 } });
                }
                if (index == 2) {
                    this.$router.push({ path: '/Downen950/ProgramList', query: { id: 2 } });
                }
                if (index == 1) {
                    this.$router.push({ path: '/Downen950/Logic', query: { id: 1 } });
                }

            },
            /**
             * 获取csv封装所需的数据源sourceData
             * */
            async getSourceData() {
                const sourceData = await this.getConstureDate();
                // this.$store.commit('getSourceData', sourceData);
                // console.log(sourceData, this.$store.state.sourceData);
            },

            /**
             * 2019年9月18日 13:29:49
             * 功能：将数据库中的数据封装成solutionList对象并返回
             * @return 返回solutionList对象，该文件是根据数据库查询的数据生成的JSON对象
             * */
            async getConstureDate() {

                let logInfo;

                // 最终封装成的对象
                const solutionList = [];

                // 通过SQL语句访问数据库并返回查询的所有结果
                const allDetailDatas = await this.selectBySql('select * from product_programme_detail');

                // 如果detail中没有任何数据直接返回空数组
                if (allDetailDatas == null) {
                    return [];
                }

                // 将当前对象所在的表product_programme_detail和component_category进行联查，并为每一个component添加新属性typeId用来表示软硬件以及其他等的信息
                for (let i = 0; i < allDetailDatas.length; i++) {
                    let selectResult = await this.selectOneObject('select * from product_programme_detail,component_category where product_programme_detail.id=' + allDetailDatas[i].id + ' and  product_programme_detail.category_id=component_category.id');
                    this.setValueAndKeyByArray(allDetailDatas[i], [ 'type_id', selectResult.is_software, 'tableName', selectResult.table_name, 'categoryName', selectResult.name ]);

                    // 硬件执行的数据封装
                    if (allDetailDatas[i].type_id == 0) {
                        // 对组件中硬件所需数据进行封装
                        selectResult = await this.selectOneObject('select component_base_info.* from ' + selectResult.table_name + ' as tn,component_base_info where tn.id=' + allDetailDatas[i].component_id + ' and tn.base_info_id=component_base_info.id');
                        if (selectResult != null) {
                            this.setValueAndKeyByArray(allDetailDatas[i], [ 'name', selectResult.name, 'description', selectResult.description, 'componentPN', selectResult.component_PN, 'FC', selectResult.component_FC, 'listPriceOnShore', selectResult.listprice_onshore, 'listPriceOffShore', selectResult.listprice_offshore, 'slotCnt', selectResult.slot_count, 'occupiedSlotCnt', selectResult.occupy_count, 'GADate', selectResult.GA_date, 'withDrawDate', selectResult.withdraw_date, 'announceDate', selectResult.announce_date, 'status', selectResult.status, 'uiStatus', selectResult.ui_status, 'tittleMsg', selectResult.title_msg, 'watt', selectResult.watt, 'createdDate', selectResult.created_date, 'updateDate', selectResult.update_date ]);
                        }

                        // 对相应的组件信息根据数据库中的表列数据进行封装
                        selectResult = await this.selectOneObject('select * from ' + allDetailDatas[i].tableName + ' where id=' + allDetailDatas[i].component_id);

                        if (selectResult != null) {
                            // 封装的数据时排除数组中的列
                            const customArray = this.transferObjectToArray(selectResult, [ 'id', 'category_id' ]);

                            // 向当前组件对象中添加数据
                            this.setValueAndKeyByArray(allDetailDatas[i], customArray);
                        }
                    } else if (allDetailDatas[i].type_id == 1) {
                        // --mark-- 对组件中软件所需数据进行封装
                        selectResult = await this.selectOneObject('select component_software.* from ' + allDetailDatas[i].tableName + ' as tn,component_software where tn.id=' + allDetailDatas[i].component_id + ' and tn.base_info_id=component_software.id');
                        if (selectResult != null) {
                            this.setValueAndKeyByArray(allDetailDatas[i], [ 'softwareType', selectResult.software_type, 'classify', selectResult.Classify, 'softwarePN', selectResult.software_PN, 'softwareFC', selectResult.software_FC, 'softwareDesc', selectResult.software_des, 'masterOs', selectResult.master_os, 'slaveOs', selectResult.slave_os, 'purchase', selectResult.purchase, 'softwareName', selectResult.software_name, 'application', selectResult.application, 'vm', selectResult.vm ]);
                        }
                        // 对相应的组件信息根据数据库中的表列数据进行封装
                        selectResult = await this.selectOneObject('select * from ' + allDetailDatas[i].tableName + ' where id=' + allDetailDatas[i].component_id);

                        if (selectResult != null) {
                            // 封装的数据排除数组中的列
                            const customArray = this.transferObjectToArray(selectResult, [ 'id', 'category_id' ]);

                            // 向当前组件对象中添加数据
                            this.setValueAndKeyByArray(allDetailDatas[i], customArray);
                        }

                    } else {
                        // 暂时什么都不做，以后可能通过设置回调函数进行功能拓展
                    }
                }

                // 按照solution_id进行数据封装---------------------------------------方案list
                const assemBySolution = this.generateFixedDataConstruction(allDetailDatas, 'solution_id', 'solutionId', 'componentList');

                // 遍历assemBySolution
                for (let i = 0; i < assemBySolution.length; i++) {
                    // 暂存每一次取到的粗封装的solution方案对象-----------------------每一个方案
                    const tempSolution = assemBySolution[i];

                    // 下方的mark标志表示处理数据tempSolution对象的封装
                    // --mark-- 查询当前方案id在数据库中的详细信息
                    const solution = await this.selectOneObject('select * from solution where id=' + tempSolution.solutionId);

                    // 如果取得的结果为null，结束当前循环，避免控制台报错
                    if (solution == null) {
                        break;
                    }

                    // --mark-- 创建一个包含指定信息的方案对象,参数[key1,value1,key2,value2,key3,value3....]
                    // --mark-- 创建一个solution的productList，用于保存一个方案中的所有product
                    const tempSolutionObj = this.createObjByKeysAndValuesArray([ 'solutionId', tempSolution.solutionId, 'solutionName', solution.solution_name, 'customerName', solution.customer_name, 'projectName', solution.project_name, 'salesManager', solution.sales_manager, 'CRAD', solution.ship_date, 'preSalesManager', solution.pre_sales_manager, 'desc', solution.description, 'productList', []]);

                    // 对传入的单个solution的componentList按照productId进行粗封装--产品list
                    const assemByProduct = this.generateFixedDataConstruction(tempSolution.componentList, 'product_id', 'productId', 'componentList');

                    // 遍历assemByProduct
                    for (let j = 0; j < assemByProduct.length; j++) {
                        // 暂存循环中每一次取到的粗封装的product对象------------------每一个产品
                        const tempProduct = assemByProduct[j];
                        // --mark-- 查询当前产品product在数据库中的详细信息
                        const product = await this.selectOneObject('select * from product_info where id=' + tempProduct.productId);

                        // --mark-- 请勿删除
                        if (product == null) {
                            break;
                        }

                        // --mark-- 创建一个product临时对象用来向上面solution的productList填充数据
                        const tempProductObj = this.createObjByKeysAndValuesArray([ 'productId', tempProduct.productId, 'productName', product.product_name, 'desc', product.description, 'systemType', product.machine_model, 'systemModel', product.machine_submodel, 'pictureURL', product.picture_url, 'announceDate', product.announce_date, 'GADate', product.GA_date, 'withdrawDate', product.withdraw_date, 'status', product.status, 'maxComputeNodeCnt', product.computeNode_cnt, 'maxBeforeBackplaneCnt', product.before_backplane_cnt, 'maxMiddleBackplaneCnt', product.middle_backplane_cnt, 'maxBehindBackplaneCnt', product.behind_backplane_cnt, 'maxPCIE4Cnt', product.pcie4, 'maxPCIE8Cnt', product.pcie8, 'maxPCIE16Cnt', product.pcie16, 'PCIEHighType', product.pcie_high_type, 'PCIEWidthType', product.pcie_width_type, 'minPowerCnt', product.power_cnt_min, 'maxPowerCnt', product.power_cnt_max, 'defaultPowerId', product.power_id, 'bareboneId', product.barebone_id, 'cpuDesc', product.cpu_desc, 'powerLineDesc', product.power_line_desc, 'isPCIDecelerate', product.allow_rate, 'minLanCnt', product.lan_min, 'defaultLanId', product.lan_id, 'memoryZip', product.memory_expansion, 'componentTypeList', []]);


                        // 对传入的单个tempProduct的componentList按照type_id进行粗封装--类型list
                        const assemByType = this.generateFixedDataConstruction(tempProduct.componentList, 'type_id', 'typeId', 'componentList');

                        // 向componentList压入数据assemByType
                        this.setValueByKey(tempProductObj, 'componentTypeList', assemByType);

                        // --mark-- 将tempProductObj推入到tempSolutionObj的productList数组里
                        this.pushObjtoArray(tempSolutionObj.productList, tempProductObj);
                    }

                    // --mark-- 将tempSolutionObj推入到solutionList数组里
                    this.pushObjtoArray(solutionList, tempSolutionObj);
                }
                // --mark-- 控制台打印
                // this.consolePrintOrgin('solutionList', solutionList);
                return solutionList;
                // ====================================solutionList对象结果封装完成========================================end
            },

            // ========================方法定义=========================================================================start
            //* *********生成数据源的方法定义**********
            /**
             * sql查询方法封装，只需要一个sql语句即可完成数据返回
             * @param SQL 需要被执行的SQL语句
             * @return 返回list类型查询结果，查询出错则返回null
             * 使用时注意判断是否查询出错，在返回值不为null的情况下再进行数据处理
             * 此方法的使用依赖于异步实现，如有疑问可询问 by 海洋 2019年9月12日 09:03:43
             */
            async selectBySql(SQL) {

                // console.log('当前SQL:  ' + SQL);

                const _this = this.$db;
                let selectResult;
                await new Promise(function(resolve, reject) {
                    // 数据库查询
                    _this.all(SQL, (err, res) => {
                        if (err) {
                            resolve(null);
                        } else {
                            resolve(res);
                        }
                    });
                }).then(data => {
                    selectResult = data;
                });
                return selectResult;
            },
            /**
             * 如果调用者确定通过SQL查询出的结果为一个对象，则调用该方法
             * @param SQL 需要被执行的SQL
             * @return 返回一个对象，如果查询失败或查询不到则返回null
             * */
            async selectOneObject(SQL) {
                const tempValue = await this.selectBySql(SQL);
                if (tempValue instanceof Array && tempValue.length == 1) {
                    return tempValue[0];
                }
                return null;
            },

            /**
             * 从list中得到属性名为valueName的属性值与指定值value相等的对象中所持有的数组
             * @param sourceList    showList数据
             * @param  valueName 属性名
             * @param value 参照值
             * @returns 从list中返回一个属性名为attrName，属性值为attrValue的对象，如果查不到就返回null
             * 此方法有点绕，如有疑问可询问我 By 海洋 2019年9月12日 12:01:00
             */
            getObjByAttributeFromList(sourceList, attrName, attrValue) {
                for (let i = 0; i < sourceList.length; i++) {
                    if (sourceList[i][attrName] == attrValue) {
                        return sourceList[i];
                    }
                }
                return null;
            },

            /**
             * 判断list中是否存在属性名是idName并且属性值为idValue如果有，返回所在list中的位置
             * @param list 被判断的list
             * @param idName 被判断的ID名称
             * @param idValue 被判断的id值
             * @return 判断当前list中是否存在某个对象的属性名为idName，属性值为idValue的对象，如果存在就返回该对象在数组中的位置，如果不存在就返回null
             */
            isInList(list, idName, idValue) {
                let tempSolutionId;
                for (let i = 0; i < list.length; i++) {
                    tempSolutionId = list[i][idName];
                    // 如果取得
                    if (tempSolutionId == idValue) {
                        // 返回该idName所在的位置id
                        return i;
                    }
                }
                return null;
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
                const obj = {};
                obj[idName] = idValue;
                // 深克隆
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
                const destList = [];
                for (let i = 0; i < sourceList.length; i++) {
                    // 判断destList中是否存在idNameInDestList所对应的列表
                    const solutionLocation = this.isInList(destList, idNameInDestList, sourceList[i][idNameInSourceList]);

                    // 如果不存在该产品idNameInDestList所对应的列表
                    if (solutionLocation == null) {
                        // 创建新对象并放入到数组中
                        this.pushIdAndValueToArray(destList, idNameInDestList, sourceList[i][idNameInSourceList], [], subListNameInDestList, sourceList[i]);

                        // 如果存在该产品idNameInDestList所对应的方案列表
                    } else {
                        // 将对象插入已有数组中
                        this.pushObjtoArray(destList[solutionLocation][subListNameInDestList], sourceList[i]);
                    }
                }
                return destList;
            },

            /**
             * 向一个list[]结构中push进一个对象
             * @param list 被压入的集合
             * @param obj 被压入的对象
             * @return push元素之后的list数组
             * */
            pushObjtoArray(list, obj) {
                list.push(obj);
                return list;
            },
            /**
             * 该方法的作用取得给定对象key对应的的值，应用于动态取值
             * @param obj obj的数据源
             * @param key   json数据源中的key
             * @return 返回obj.key的结果
             */
            getValueBykey(obj, key) {
                return obj[key];
            },
            /**
             * 向obj中增加新属性，应用于动态添加属性
             * @param obj 需要添加属性的对象
             * @param key 属性名称
             * @param value 属性值
             * @return 返回操作后的对象
             * */
            setValueByKey(obj, key, value) {
                obj[key] = value;
                return obj;
            },
            /**
             * 根据已有的key和value数组对传入的对象添加新属性
             * 例如key1,value1,key2,value2,key3,value3.....
             * @param keyAndValueArray 对象的属性和值组成的数组
             * @param obj 被操作的对象
             * @return 返回添加新属性之后的对象
             * */
            setValueAndKeyByArray(obj, keyAndValueArray) {
                if (keyAndValueArray.length % 2 == 0) {
                    for (let i = 0; i < keyAndValueArray.length; i += 2) {
                        obj[keyAndValueArray[i]] = (keyAndValueArray[i + 1] == null ? '' : keyAndValueArray[i + 1]);
                    }
                }
                return obj;
            },

            /**
             * 根据已有的key和value创建一个对象，要求两个数组的key和value的对应位置、数量必须一致,否则返回null
             * 例如key1,value1,key2,value2,key3,value3.....
             * @param keyAndValueArray 被创建对象的属性
             * @return 返回一个根据参数动态生成的对象
             * */
            createObjByKeysAndValuesArray(keyAndValueArray) {
                if (keyAndValueArray.length % 2 == 0) {

                    const obj = {};

                    for (let i = 0; i < keyAndValueArray.length; i += 2) {

                        obj[keyAndValueArray[i]] = (keyAndValueArray[i + 1] == null ? '' : keyAndValueArray[i + 1]);
                    }
                    return obj;
                }
                return null;
            },
            /**
             * 功能是将obj(该obj中一定不能有数组)转换成[key1,value1,key2,value2,key3,value3...]的对象形式
             * 以便于方法setValueAndKeyByArray或createObjByKeysAndValuesArray中作为参数传入
             * @param obj 传入的需要被处理的对象
             * @param rejectKeyArray 封装时排除的key
             * @return 返回一个[key1,value1..]的对象
             * */
            transferObjectToArray(obj, rejectKeyArray) {

                // 拼接整理的结果数组字符串
                let resultArray = '';

                let objStr = JSON.stringify(obj);

                objStr = objStr.substring(1, objStr.length - 1);
                objStr = objStr.split(',"');

                let tempStr;
                for (let i = 0; i < objStr.length; i++) {
                    if (i != 0) {
                        resultArray += ',"';
                    }
                    tempStr = objStr[i].replace(':', ',');
                    resultArray += tempStr;
                }
                resultArray = '[' + resultArray + ']';

                let resultArrayObj = JSON.parse(resultArray);

                const backupObj = JSON.parse(JSON.stringify(resultArrayObj));
                try {
                    // 根据排除key的数组进行数据清除
                    for (let i = 0; i < resultArrayObj.length; i += 2) {
                        for (let k = 0; k < rejectKeyArray.length; k++) {
                            // 如果匹配到最终项包含有排除项
                            if (rejectKeyArray[k] == resultArrayObj[i]) {
                                for (let j = i; j < resultArrayObj.length - 2; j += 2) {
                                    resultArrayObj[j] = resultArrayObj[j + 2];
                                    resultArrayObj[j + 1] = resultArrayObj[j + 3];
                                }
                                resultArrayObj = resultArrayObj.slice(0, resultArrayObj.length - 2);
                            }
                        }
                    }

                    // 去除数据的下划线，并将下划线的第一个字母变成大写
                    for (let i = 0; i < resultArrayObj.length; i += 2) {
                        let flag = true;
                        while (flag) {
                            const currLocation = resultArrayObj[i].indexOf('_');
                            if (currLocation < 0) {
                                flag = false;
                            }
                            resultArrayObj[i] = resultArrayObj[i].replace('_' + resultArrayObj[i].charAt(currLocation + 1), resultArrayObj[i].charAt(currLocation + 1).toUpperCase());
                        }
                    }
                    return resultArrayObj;
                } catch (e) {
                    console.log('未排除key');
                    for (let i = 0; i < backupObj.length; i += 2) {
                        // 去除数据的下划线，并将下划线的第一个字母变成大写
                        let flag = true;
                        while (flag) {
                            const currLocation = backupObj[i].indexOf('_');
                            if (currLocation < 0) {
                                flag = false;
                            }
                            backupObj[i] = backupObj[i].replace('_' + backupObj[i].charAt(currLocation + 1), backupObj[i].charAt(currLocation + 1).toUpperCase());
                        }
                    }
                    return backupObj;
                }
            },

            /** 控制台打印指定样式的数据
             * @param msgName 控制台打印的信息名称
             * @param content 控制台打印的内容
             * @return 按照指定格式打印到控制台结果
             * */
            consolePrint(msgName, content) {
                console.log('>>>>>>>>>==============================================================================');
                console.log('.^_^.     ' + JSON.stringify(msgName) + '        *************信息内容如下*************\n\n');
                if (content instanceof Array) {
                    console.log(JSON.stringify(msgName) + '是一个数组: [   ],共 ' + content.length + ' 条数据\n');
                    for (let i = 0; i < content.length; i++) {
                        console.log('第' + (i + 1) + '条：  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ \n' + JSON.stringify(content[i]) + '\n');
                    }
                    console.log('==============================================================================<<<<<<<<<\n');
                } else {
                    console.log(JSON.stringify(msgName) + '是一个对象: {   } \n');
                    console.log('>>>>>>>>>==============================================================================');
                    console.log('.^_^.     ' + JSON.stringify(msgName) + '        *************信息内容如下*************\n\n' + JSON.stringify(content));
                    console.log('==============================================================================<<<<<<<<<\n');
                    console.log('\n');
                    console.log('\n');
                }
            },
            /**
             * 控制台打印指定样式的数据
             * @param msgName 控制台打印的信息名称
             * @param content 控制台打印的内容
             * @return 打印出原始数据内容
             * /
             */
            consolePrintOrgin(msgName, content) {
                console.log('>>>>>>>>>==============================================================================');
                console.log('.^_^.     ' + JSON.stringify(msgName) + '        *************信息内容如下*************\n\n' + JSON.stringify(content));
                console.log('==============================================================================<<<<<<<<<\n');
                console.log('\n');
                console.log('\n');
            },

            /**
             * 产生默认的时间格式
             * */
            getDefaultDateFormate(date) {
                const year = date.getFullYear();
                let month = date.getMonth() + 1;
                month = (month + '').length == 2 ? month : ('0' + month);
                let day = date.getUTCDate();
                day = (day + '').length == 2 ? day : ('0' + day);
                return year + '-' + month + '-' + day;
            },
            getElen() {
                this.addDiscountData(2);
                this.$router.push('/Affirm950');
            },
            /* 更改背景颜色*/
            hardwareOver(index) {
                this.$refs.hardwareSwi[index].style.background = '#f0f0f0';
                this.hardwareOv = index;
            },
            /* 更改背景颜色*/
            hardwareOut() {
                if (this.hardwareOv !== this.hardware) {
                    this.$refs.hardwareSwi[this.hardwareOv].style.background = '#f5f5f5';
                }
            },

            /* 返回上一页*/
            reload() {
                this.$router.push({ path: '/Hardware950/Processor', query: { id: 0,sign:3,signT:11 } });
            },

            /* 获取分离背板数据*/
            async configurationList() {
                //筛选出HPO是否开启导出标识
                let hpoExportFlag = true;
                //获取HPO是否展示标识
                const hpoSQL =`SELECT * FROM product_programme_detail WHERE
                template_id='${localStorage.templateId}' and category_id = 33 and
                solution_id='${localStorage.solutionId}'and
                product_id='${localStorage.productId}' and
                machine_id='${localStorage.machineId}'`;
                await new Promise((resolve, reject)=> {
                    this.$db.all(hpoSQL, (err, res) => {
                        if (err) {
                            resolve(null);
                        } else {
                            resolve(res);
                        }
                    });
                }).then((data) => {
                    if (data.length == 0){
                        hpoExportFlag = false;
                    }
                });
                //-----------------------------------软件----------------------------
                //获取软件数据（维保信息除外）
                const sqlSW =  `SELECT T1.software_category,T1.qty,cs.*,
                   (SELECT machine_model FROM product_info WHERE id = ${localStorage.productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${localStorage.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as logicNum
            FROM component_software cs
            INNER JOIN
            (SELECT
            ss.carry_software_id,ss.software_category,ss.qty FROM product_programme_detail ppd
            INNER JOIN software_software ss ON ppd.component_id = ss.choice_software_id
            WHERE ppd.category_id IN (21,14,15,42) AND ppd.solution_id = ${localStorage.solutionId}
            AND ppd.template_id = ${localStorage.templateId} AND ppd.machine_id = ${localStorage.machineId} AND ppd.product_id = ${localStorage.productId} ORDER BY   ss.carry_software_id
            ) T1
            ON T1.carry_software_id = cs.id
            WHERE cs.software_type != 3`;

                this.$db.all(sqlSW, (err, res) => {
                    console.log(res, err);
                    this.addirmTable=[]
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        let tempData = [];
                        let typeModelList = [];
                        let hpoList = [];
                        //处理分类顺序 操作系统 逻辑分区 虚拟化软件
                        let sysList = [];//操作系统
                        let logicList = [];//逻辑分区
                        let inventList = [];//虚拟化软件
                        sysList = res.filter((c) =>{
                            return c.software_category == 1
                        });
                        logicList = res.filter((o) =>{
                            return o.software_category == 0
                        });
                        inventList = res.filter((v) =>{
                            return v.software_category == 2
                        });
                        res = inventList.concat(logicList).concat(sysList);
                        this.totalPrice = 0;
                        this.totalPriceOff = 0;
                        //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
                        for (let i = 0; i < res.length; i++) {
                            let obj = {
                                component_count: '',
                                template_desc: res[i].software_des,
                                software_desCN:res[i].software_desCN,
                                name: res[i].software_category,
                                nameCN: '',
                                template_name: res[i].software_FC,
                                component_id: res[i].software_PN,
                                Classify: res[i].Classify,
                                total_price:res[i].purchase,
                                USDtotal_price:res[i].USDPurchase,
                                ui_status: res[i].ui_status,
                                withdraw_date: res[i].withdraw_date,
                                qty: res[i].qty
                            };
                            if (obj.qty == 0){
                                obj.component_count = res[i].cpuActiveNum;
                            }else{
                                obj.component_count = res[i].qty;
                            }
                            if (res[i].Classify == res[i].type + '-' + res[i].model) {
                                //逻辑分区
                                if (res[i].category_id == 13) {
                                    obj.component_count = res[i].logicNum;
                                    //操作系统
                                } else if (res[i].category_id == 14) {
                                    obj.component_count = res[i].qty;
                                } else {
                                    obj.component_count = res[i].cpuActiveNum;
                                }
                                typeModelList.push(obj);
                                continue;
                            }
                            //硬件 HPO
                            if (res[i].category_id == 33 || res[i].category_id == 34) {
                                //不需要显示HPO
                                if (!hpoExportFlag){
                                    continue;
                                }
                                obj.component_count = res[i].qty;
                                hpoList.push(obj);
                                continue;
                            }

                            if (res[i].purchase != undefined && res[i].purchase != null
                                && res[i].purchase != '' && res[i].purchase != 'N/C') {
                                /*获取总价格*/
                                this.totalPrice += res[i].purchase*res[i].cpuActiveNum
                                this.totalPriceOff += res[i].USDPurchase*res[i].cpuActiveNum
                                obj.total_price=res[i].purchase*res[i].cpuActiveNum
                                obj.USDtotal_price=res[i].USDPurchase*res[i].cpuActiveNum
                            }
                            tempData.push(obj);
                        }

                        /*总列表价：以货币符号开头。使用千位分隔符。显示小数点后两位*/
                        // var reg = this.totalPrice.toFixed(2).toString().replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                        //

                        //     let reg = this.totalPrice.toFixed(2);
                        //     console.log(reg);
                        //     this.totalPrice = reg;
                        //     this.totalPriceOff=this.totalPriceOff.toFixed(2)
                        //
                        //     /*默认折扣为0，计算默认的折扣价*/
                        //     this.input1 = ((this.totalPrice.replace(/,/g, "")) * ((100 - this.input) / 100)).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                        //     this.input1Off = ((this.totalPriceOff.replace(/,/g, "")) * ((100 - this.input) / 100)).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                        //     //处理hpo列表顺序

                        let headerHpoList = [];
                        for (let k = hpoList.length - 1; k >= 0; k--) {
                            if (hpoList[k].template_name == undefined || hpoList[k].template_name == null || hpoList[k].template_name == '') {
                                headerHpoList.push(hpoList[k]);
                                hpoList.splice(k, 1);
                            }
                        }
                        for (let m = 0; m < headerHpoList.length; m++) {
                            this.addirmTable.push(headerHpoList[m]);
                            for (let j = 0; j < hpoList.length; j++) {
                                if (headerHpoList[m].Classify == hpoList[j].Classify && headerHpoList[m].name == hpoList[j].name) {
                                    this.addirmTable.push(hpoList[j]);
                                }
                            }
                        }
                        //处理列表顺序
                        let headerList = [];
                        for (let k = tempData.length - 1; k >= 0; k--) {
                            if (tempData[k].template_name == undefined || tempData[k].template_name == null || tempData[k].template_name == '') {
                                headerList.push(tempData[k]);
                                tempData.splice(k, 1);
                            }
                        }
                        for (let m = 0; m < headerList.length; m++) {
                            this.addirmTable.push(headerList[m]);
                            for (let j = 0; j < tempData.length; j++) {
                                if (headerList[m].Classify == tempData[j].Classify && headerList[m].name == tempData[j].name) {
                                    this.addirmTable.push(tempData[j]);
                                }
                            }
                        }
                        this.addirmTable = typeModelList.concat(this.addirmTable);
                        //维保
                        const sqlSWMA = ` SELECT  ppd.component_count,ppd.category_id AS software_category,cs.*,
                  (SELECT machine_model FROM product_info WHERE id = ${localStorage.productId}) AS type,
                  (SELECT machine_submodel FROM product_info WHERE id = ${localStorage.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${localStorage.solutionId} AND template_id = ${localStorage.templateId} AND machine_id = ${localStorage.machineId} AND product_id = ${localStorage.productId}) as logicNum
            FROM component_software cs LEFT JOIN product_programme_detail ppd
                    ON cs.id = ppd.component_id
                    WHERE ppd.category_id IN (18,19,20) AND ppd.solution_id = ${localStorage.solutionId} AND ppd.template_id = ${localStorage.templateId}
                    AND ppd.machine_id = ${localStorage.machineId}  AND ppd.product_id = ${localStorage.productId}`;
                        this.$db.all(sqlSWMA, async (err, res) => {
                            console.log(res, err);
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '搜索失败',
                                    desc: err,
                                });
                            } else {
                                //查询9000
                                let swmaList9000 = res.map((c)=>{
                                    return c.id;
                                });
                                if (swmaList9000.length > 0){
                                    let paramStr = '('+swmaList9000.join(',')+')';
                                    const swma9000 = `SELECT ss.qty AS component_count,ss.software_category,cs.*,ss.choice_software_id FROM component_software cs
                        LEFT JOIN software_software ss ON cs.id = ss.carry_software_id
                        WHERE ss.choice_software_id IN ${paramStr}`;
                                    await new Promise((resolve, reject)=> {
                                        this.$db.all(swma9000, (err, ret) => {
                                            if (err) {
                                                resolve(null);
                                            } else {
                                                resolve(ret);
                                            }
                                        });
                                    }).then((data) => {
                                        data.forEach((c)=>{
                                            let filter = res.filter((o)=>{
                                                return o.id == c.choice_software_id;
                                            });
                                            filter.forEach((k)=>{
                                                c.software_category = k.software_category;
                                            })
                                            res.push(c);
                                        })
                                    });
                                }
                                let tempSWMAData = [];
                                res = res.reverse();
                                for (let j = 0; j < res.length; j++) {
                                    let objSWMA = {
                                        component_count: res[j].component_count,
                                        template_desc: res[j].software_des,
                                        software_desCN:res[j].software_desCN,
                                        name: res[j].software_category,
                                        nameCN: '',
                                        template_name: res[j].software_FC,
                                        component_id: res[j].software_PN,
                                        Classify: res[j].Classify,
                                        total_price:res[j].purchase,
                                        USDtotal_price:res[j].USDPurchase,
                                        ui_status: res[j].ui_status,
                                        withdraw_date: res[j].withdraw_date
                                    };

                                    if (res[j].purchase != undefined && res[j].purchase != null
                                        && res[j].purchase != '' && res[j].purchase != 'N/C') {
                                        /*获取总价格*/
                                        this.totalPrice += res[j].purchase*res[j].cpuActiveNum
                                        this.totalPriceOff += res[j].USDPurchase*res[j].cpuActiveNum
                                        objSWMA.total_price=res[j].purchase*res[j].cpuActiveNum
                                        objSWMA.USDtotal_price=res[j].USDPurchase*res[j].cpuActiveNum
                                    }
                                    tempSWMAData.push(objSWMA);
                                }
                                /*总列表价：以货币符号开头。使用千位分隔符。显示小数点后两位*/
                                    let reg = this.totalPrice.toFixed(2);
                                    console.log(reg);
                                    this.totalPrice = reg;
                                    this.totalPriceOff=this.totalPriceOff.toFixed(2)

                                    /*默认折扣为0，计算默认的折扣价*/
                                    let count=100
                                    if(this.input!=0){
                                        count=this.input
                                    }
                                    this.input1 = ((this.totalPrice.replace(/,/g, "")) * (count / 100)).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                                    this.input1Off = ((this.totalPriceOff.replace(/,/g, "")) * (count / 100)).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                                    //处理hpo列表顺序

                                //处理列表顺序
                                let headerSWMAList = [];
                                let swmaList = [];
                                for (let k = tempSWMAData.length - 1; k >= 0; k--) {
                                    if (tempSWMAData[k].template_name == undefined || tempSWMAData[k].template_name == null || tempSWMAData[k].template_name == '') {
                                        headerSWMAList.push(tempSWMAData[k]);
                                        tempSWMAData.splice(k, 1);
                                    }
                                }
                                for (let m = 0; m < headerSWMAList.length; m++) {
                                    swmaList.push(headerSWMAList[m]);
                                    for (let j = tempSWMAData.length-1; j >=0 ; j--) {
                                        if (headerSWMAList[m].Classify == tempSWMAData[j].Classify && headerSWMAList[m].name == tempSWMAData[j].name) {
                                            swmaList.push(tempSWMAData[j]);
                                            tempSWMAData.splice(j, 1);
                                        }
                                    }
                                }
                                tempSWMAData.forEach((c)=>{
                                    swmaList.push(c);
                                });
                                this.addirmTable = this.addirmTable.concat(swmaList);

                            }
                            this.addirmTable.forEach(item => {
                                if (item.withdraw_date != null && item.withdraw_date != '' && item.withdraw_date != undefined){
                                    let calculationDay = this.calculationDay(moment(item.withdraw_date));
                                    item.exeInfo = ' 此部件将于'+moment(item.withdraw_date).format('YYYY-MM-DD HH:mm:ss')+' 停产。距离停产日期还有'+calculationDay+'天;'
                                    item.exeInfo_en = 'This part will be shut down at '+moment(item.withdraw_date).format('YYYY-MM-DD HH:mm:ss')+'。 '+calculationDay +' day before the production stop;';
                                }else{
                                    item.exeInfo = '';
                                    item.exeInfo_en = '';
                                }
                                // //展示异常信息 0: 正常供货; 1: 此部件预计3~5周供货; 2: 此部件预计5~8周供货 3: 此部件预计>8周供货'
                                // if (item.ui_status == 1){
                                //     item.exeInfo += '此部件预计3~5周供货;'
                                //     item.exeInfo_en += "part is expected to be delivered in 3~5 weeks;"
                                // }else if (item.ui_status == 2){
                                //     item.exeInfo += '此部件预计5~8周供货;'
                                //     item.exeInfo_en += "part is expected to be delivered in 5~8 weeks;"
                                // }else if (item.ui_status == 3){
                                //     item.exeInfo += '此部件预计5~8周供货;'
                                //     item.exeInfo_en += "part is expected to be delivered in 5~8 weeks;"
                                // }else{
                                //     item.exeInfo += ''
                                //     item.exeInfo_en += ''
                                // }
                                if (item.name == 0) {
                                    item.nameCN = '逻辑分区';
                                    item.name = 'A logical partition';
                                } else if (item.name == 1) {
                                    item.nameCN = '操作系统';
                                    item.name = 'The operating system';
                                } else if (item.name == 2) {
                                    item.nameCN = '应用程序';
                                    item.name = 'The application';
                                } else if (item.name == 18) {
                                    item.nameCN = '操作系统SWMA';
                                    item.name = 'The application SWMA';
                                } else if (item.name == 19) {
                                    item.nameCN = '逻辑分区SWMA';
                                    item.name = 'A logical partition SWMA';
                                } else if (item.name == 20) {
                                    item.nameCN = '应用程序SWMA';
                                    item.name = 'The application SWMA';
                                }

                            });
                        });
                    }
                });
                //-----------------------------------------------------------------------------
//       // 'detail-软件 ------software_category: 0是逻辑分区，1是操作系统，2应用程序'
//       const getti = `select  distinct cs.id,cs.software_PN,cs.software_FC,ss.software_category,cs.software_des,ss.qty,cs.purchase from (
//          select * from component_software where id in (
//          select  carry_software_id from software_software where choice_software_id in (
//          select id from component_software where id in (
//          select component_id from product_programme_detail where category_id in (13,14,15,21) and product_id=1
//                                                   and solution_id='${localStorage.solutionId}'
//                                                   and template_id='${localStorage.templateId}'
//                                                    AND product_id=${localStorage.productId}
//                                                   and machine_id='${localStorage.machineId}'
//          )
//           )
//          ) and software_type !=3
//          ) cs left join software_software ss on ss.carry_software_id= cs.id
//
// union
// select distinct cs.id,cs.software_PN,cs.software_FC,cs.category_id,cs.software_des,detail.component_count,cs.purchase from (
// select *
// from component_software  where id in(select component_id from product_programme_detail where category_id in(18,19,20) and template_id='${localStorage.templateId}'and solution_id='${localStorage.solutionId}'AND product_id=${localStorage.productId}
//  and machine_id='${localStorage.machineId}'))cs left join product_programme_detail detail on detail.component_id = cs.id `;
//
//
//       this.$db.all(getti, (err, res) => {
//         console.log(res);
//         this.tableData = [];
//         this.totalPrice = 0;
//         const arr = [];
//         if (res == undefined) {
//           return;
//         }
//         res.forEach((item, index) => {
//           const obj = {
//             component_count: item.qty,
//             template_desc: item.software_des,
//             name: item.software_category,
//             template_name: item.software_FC,
//             component_id: item.software_PN,
//             total_price: item.purchase,
//           };
//           if (!isNaN(parseInt(item.purchase))) {
//             this.totalPrice += parseInt(item.purchase);
//           }
//           console.log(this.totalPrice, item.purchase);
//           this.input1 = this.totalPrice * ((100 - this.input) / 100);
//           return arr.push(obj);
//         });
//         this.tableData = arr.filter(item => {
//           if (item.name == 0) {
//             item.name = '逻辑分区';
//             return true;
//           }
//         });
//         arr.forEach(item => {
//           if (item.name == 1) {
//             item.name = '操作系统';
//             return this.tableData.push(item);
//           }
//         });
//         arr.forEach(item => {
//           if (item.name == 2) {
//             item.name = '应用程序';
//             return this.tableData.push(item);
//           }
//         });
//         arr.forEach(item => {
//           if (item.name == 18) {
//             item.name = '操作系统SWMA';
//             return this.tableData.push(item);
//           }
//         });
//         arr.forEach(item => {
//           if (item.name == 19) {
//             item.name = '逻辑分区SWMA';
//             return this.tableData.push(item);
//           }
//         });
//         arr.forEach(item => {
//           if (item.name == 20) {
//             item.name = '应用程序SWMA';
//             return this.tableData.push(item);
//           }
//         });
//       });
            },
            calculationDay(date){
                if (date == null || date == undefined || date == '')
                    return 0;
                //获取当前时间
                let now = moment();
                //计算相差多少天 day可以是second minute
                let days = date.diff(now, 'day');
                return days < 0 ? 0 : days;
            },
            /* 自定义行数*/
            indexMethod(index) {
                return index + 1;
            },
        },
        mounted() {
            let seleSql=`select id,name,name_en,display from component_category where id in(13,14,15)`
            this.$db.all(seleSql, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: '系统错误',
                        desc: err,
                    });
                }else{
                    console.log(res)
                    res.forEach(item=>{
                        if(item.id==13){
                            this.config[1].name=item.name
                            this.$set(this.config[1],'nameCN',item.name_en)
                        }
                        if(item.id==14){
                            this.config[0].name=item.name
                            this.$set(this.config[0],'nameCN',item.name_en)
                        }
                        if(item.id==15){
                            this.config[2].name=item.name
                            this.$set(this.config[2],'nameCN',item.name_en)
                        }
                    })
                }
            });
            this.configurationList();
            let machineId = localStorage.getItem('machineId')
            /*获取 machine_price_detail 里的id*/
            const update = `select id,configure_type,discount,dollar_discount from machine_price_detail where machine_id=${machineId}`
            this.$db.all(update, (err, res) => {
                if (err) {
                    console.log("获取失败")
                } else {
                    if(res.length>1){
                        this.discountId = res[1].configure_type;
                        this.input=res[1].discount;
                        this.input = Number(this.input).toFixed(2)
                        this.inputOff=res[1].dollar_discount;
                        this.inputOff = Number(this.inputOff).toFixed(2)
                        console.log(this.discountId)
                    }
                }
            })
        },
        created(){
            this.userId = localStorage.userId;
            console.log('this.userId',this.userId)
        },

        watch: {
            hardwareBian(newValue, oldValue) {
                if (oldValue) {
                    this.configurationList();
                }
            },
        },

    };
</script>

<style  lang="less">
    .hardware {
        height: 100%;

        header {
            min-height: 50px;
            height: 6%;
            font-size: 16px;
            border: 1px solid #ccc;

            b {
                margin-left: 30px;
                line-height: 50px;
            }

            .el-button {
                float: right;
                margin-right: 20px;
                margin-top: 10px;
            }
        }

        .hardware-left {
            float: left;
            width: 300px;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            height: 94%;
            min-height: 500px;

            .hardware-swi {
                height: 60px;
                //border-bottom: 1px solid #ebebeb;
                line-height: 60px;
                margin-left: 1px;
                cursor: pointer;

                .hardware-left-name {
                    margin-left: 30px;
                    display: inline-block;
                }
                .hardware-left-bolder {
                    width: 30px;
                    display: inline-block;

                    img {
                        width: 4px;
                        height: 30px;
                    }
                }

                img {
                    width: 20px;
                    vertical-align: middle;
                }

                i {
                    float: right;
                    margin-right: 40px;
                    margin-top: 24px;
                    font-size: 20px;
                }
            }
        }

        .hardware-right {
            height: 94%;
            overflow: auto;
        }

        .grid-content {
            padding: 20px 40px;
            .el-input {
                width: 40%;
            }
        }
        .grid-total {
            padding-top:30px;
        }
    }
    .el-input__inner {
        padding:0 8px;
    }
</style>
