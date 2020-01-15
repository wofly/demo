<template>
    <!--配置硬件-->
    <div class="hardware">
        <header>
            <b>{{$t('ConfigureHardware.titleE950')}}</b>
            <el-button type="primary" size="mini" @click="getElen()">{{$t('ConfigureHardware.buttonNext')}}<i
                    class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="reload">
                {{$t('ConfigureHardware.buttonLast')}}
            </el-button>
        </header>
        <div class="hardware-left">
            <nav v-for="(item, index) in config" :key="index" @mouseover="hardwareOver(index)"
                 @click="hardwareSwi(index)" ref="hardwareSwi" class="hardware-swi" @mouseout="hardwareOut()">
                <!--v-show="(index==4||index==3)?aa:!aa"-->
                <div class="hardware-left-bolder">
                    <img src="../../../../static/rectangle-1.png" v-show="!item.boole">
                </div>

                <img :src="img1[index]" v-show="item.boole"/>
                <img :src="img[index]" v-show="!item.boole"/>
                <div class="hardware-left-name">{{$store.state.info_language?item.nameCN:item.name}}</div>
                <i class="el-icon-arrow-left" v-show="!item.boole"></i>
                <i class="el-icon-arrow-right" v-show="item.boole"></i>
            </nav>
        </div>
        <div class="hardware-right">
            <keep-alive>
                <router-view v-show="hardwareBian" @comup="comup" @erro="geterro"></router-view>
            </keep-alive>

            <!-- 默认展示配置清单-->
            <el-table :data="tableData" style="width: 100%" v-show="!hardwareBian">
                <el-table-column align="center" type="index" :index="indexMethod"
                                 :label="$t('Software.details.list.serialNumber')" width="80">
                </el-table-column>
                <!--<el-table-column align="center" prop="component_id" label="PN" width="180">-->
                <!--</el-table-column>-->
                <el-table-column align="center" prop="template_name" label="FC" width="110">
                </el-table-column>

                <el-table-column align="center" prop="nameCN" :label="$t('Software.details.list.classify')" width="110"
                                 v-if="!$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" width="110"
                                 v-if="$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="template_desc"
                                 :label="$t('Software.details.list.describingAccessories')"
                                 v-if="!$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="description_en"
                                 :label="$t('Software.details.list.describingAccessories')"
                                 v-if="$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="exeInfo_en" :label="$t('Software.details.list.exceptionPrompt')"
                                 v-if="$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="exeInfo" :label="$t('Software.details.list.exceptionPrompt')"
                                 v-if="!$store.state.info_language">
                </el-table-column>
                <el-table-column align="center" prop="component_count" :label="$t('Software.details.list.Quantity')"
                                 width="80">
                </el-table-column>
                <el-table-column align="center" :label="$t('Software.details.list.price')" width="180">
                    <template slot-scope="scope">
                        <div v-if="!$store.state.currency_type">
                            <span v-show="$store.state.userId !=1">{{scope.row.total_price}}</span>
                            　　　 <span v-show="$store.state.userId ==1">- -</span>
                        </div>
                        　　　
                        <div v-if="$store.state.currency_type">
                            <span v-show="$store.state.userId !=1">{{scope.row.total_priceOff}}</span>
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
                            {{$store.state.currency_type?totalPriceOff:totalPrice | totalPriceFilters}}
                        </span>
                        <span v-show="$store.state.userId ==1">- -</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">{{$t('Software.details.discount')}}：
                        <span v-show="$store.state.userId !=1">
                            <el-input v-model="input" @change="discountData(1)"
                                      v-if="!$store.state.currency_type"></el-input>
                            <el-input v-model="inputOff" @change="discountData(1)"
                                      v-if="$store.state.currency_type"></el-input>
                             %off
                        </span>
                        <span v-show="$store.state.userId ==1">- -</span>

                    </div>
                </el-col>
                <el-col :span="9">
                    <div class="grid-content bg-purple">{{$t('Software.details.discountedPrice')}}：
                        <span v-show="$store.state.userId != 1">
                            {{$store.state.currency_type?'$':'￥'}}
                            <el-input v-model="$store.state.currency_type?input1Off:input1"
                                      @change="getDiscountPrice(input1,1)" disabled></el-input>
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

    export default {
        name: 'Hardware',
        data() {
            return {
                // 用户ID
                userId: 0,
                //人民币的折扣
                input: 0,
                //人民币的折扣后的价
                input1: '',
                // 总价
                totalPrice: '0',
                // 折扣
                discount: '',
                // 折扣id
                discountId: '',
                // 折扣价
                discountPrice: '',
                // 判断跳进时显示的组件
                hardwareBian: true,
                // 判断有没有点击过，
                hardware: -1,
                // 判断有没有被hover上
                hardwareOv: -1,
                //  默认展示配置清单数据
                tableData: [],
                // 内部外部总容量
                totalCapacity: 0,
                coloBa: 0,
                //美元的折扣后的价
                input1Off: 0,
                //美元的总价
                totalPriceOff: 0,
                //美元的折扣
                inputOff: 0,
                gettitle: '',
                config: [//硬件配置的初始显示
                    {
                        name: '处理器',
                        img: '../../static/assets/cpu-1.png',
                        boole: true,
                        erre: false,
                        id: ''
                    },
                    {
                        name: '内存',
                        img: '../../static/assets/internal-1.png',
                        boole: true,
                        erre: false,
                        id: ''
                    },
                    {
                        name: '内部硬盘',
                        img: '../../src/renderer/assets/hard-1.png',
                        boole: true,
                        erre: false,
                        id: ''
                    },
                    {
                        name: '外部PCle',
                        img: '../../src/renderer/assets/pcie-1.png',
                        boole: true,
                        erre: false,
                        id: ''
                    },
                    {
                        name: '外部硬盘',
                        img: '../../src/renderer/assets/pcie-1.png',
                        boole: true,
                        erre: false,
                        id: ''
                    },
                    {
                        name: '内部PCle',
                        img: '../../src/renderer/assets/pcie-1.png',
                        boole: true,
                        erre: false,
                        id: ''
                    },

                    {
                        name: '电源',
                        img: '../../src/renderer/assets/power-1.png',
                        boole: true,
                        erre: false,
                        id: ''
                    },
                    {
                        name: '配件',
                        img: '../../src/renderer/assets/accessories-1.png',
                        boole: true,
                        erre: false,
                        id: 5
                    },
                ],
                img: [
                    __static + '/cpu-2.png',
                    __static + '/internal-2.png',
                    __static + '/hard-2.png',
                    __static + '/external-pcie-2.png',
                    __static + '/external-hard-2.png',
                    __static + '/pcie-2.png',
                    __static + '/power-2.png',
                    __static + '/accessories-2.png',
                ],
                img1: [
                    __static + '/cpu-1.png',
                    __static + '/internal-1.png',
                    __static + '/hard-1.png',
                    __static + '/external-pcie-1.png',
                    __static + '/external-hard-1.png',
                    __static + '/pcie-1.png',
                    __static + '/power-1.png',
                    __static + '/accessories-1.png',
                ],
                getHard: [
                    {
                        boole: false,
                        num: 1,
                        title: '内部硬盘没有选择'
                    },
                    {
                        boole: false,
                        num: 2,
                        title: '内存没有选择'
                    },
                    {
                        boole: false,
                        num: 11,
                        title: '计算节点没有选择'
                    },
                    {
                        boole: false,
                        num: 3,
                        title: 'cpu没有选择'
                    },
                    {
                        boole: false,
                        num: 5,
                        title: '电源没有选择'
                    },
                    {
                        boole: false,
                        num: 6,
                        title: 'pcie没有选择'
                    },

                ]
            };
        },
        filters: {
            // 列表总价过滤器：加￥符号、保留两位小数四舍五入、使用分位分隔符
            totalPriceFilters: function (value) {
                if (value) {
                    return Number(value).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                    //if (value)
                }
            }
        },
        methods: {
            /* 输入 折扣 算出 折扣价*/
            discountData(type) {
                console.log(this.input)
                if (this.input < 100 && this.input >= 0 && this.inputOff < 100 && this.inputOff >= 0 ) {
                    if (this.$store.state.currency_type) {
                        this.inputOff=Number(this.inputOff).toFixed(2)
                        this.input = this.inputOff == 0 ? 0 : 100 - this.inputOff
                    } else {
                        this.input=Number(this.input).toFixed(2)
                        this.inputOff = this.input == 0 ? 0 : 100 - this.input
                    }
                    let inpu = this.input
                    if (this.input == 0) {
                        inpu = 100
                    }
                    this.input = Number(this.input).toFixed(2)
                    this.input1 = ((this.totalPrice * inpu / 100).toFixed(2)).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                    this.input1Off = ((this.totalPriceOff * inpu / 100).toFixed(2)).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                    this.addDiscountData(type)
                } else {
                    this.$message({
                        message: '请输入正确折扣',
                        type: 'warning',
                    });
                    if (this.$store.state.currency_type) {
                        this.inputOff = this.input == 0 ? 0 : 100 - this.input
                        this.input = this.inputOff == 0 ? 0 : 100 - this.inputOff
                    } else {
                        this.input = this.inputOff == 0 ? 0 : 100 - this.inputOff
                        this.inputOff = this.input == 0 ? 0 : 100 - this.input
                    }
                }
            },
            /* 输入 折扣价 算出 折扣*/
            getDiscountPrice(num, type) {
                this.input = (100 - num / (this.totalPrice.replace(/,/g, "")) * 100).toFixed(2);
                this.addDiscountData(type)
            },

            /*往数据库里插入已选数据*/
            addDiscountData(type) {
                let count = 100
                if (this.input != 0) {
                    count = this.input
                }
                let totalPrice = this.totalPrice// parseInt(this.totalPrice);
                let discount = this.input;
                let discountPrice = totalPrice * count / 100 //this.input1.replace(/,/g, "");
                let totalPriceOff = this.totalPriceOff;//parseInt(this.totalPriceOff)
                let discountOff = this.inputOff;
                let discountPriceOff = totalPriceOff * count / 100 //this.input1Off.replace(/,/g, "");
                console.log(totalPrice, discount, discountPrice, type, discountOff)
                if (this.discountId != '') {
                    const updateSql = `update machine_price_detail set product_id='${localStorage.productId}',solution_id='${localStorage.solutionId}',
                    list_price='${totalPrice}',discount='${discount}',discount_price='${discountPrice}',dollar_discount='${discountOff}',list_dollar_price='${totalPriceOff}',discount_dollar_price='${discountPriceOff}' WHERE machine_id='${localStorage.machineId}' AND configure_type ='${this.discountId}'`
                    console.log(updateSql, this.discountId)
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log("修改失败")
                        } else {
                            console.log("修改成功")
                        }
                    })
                } else {
                    const SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_price,discount,discount_price,configure_type,dollar_discount,list_dollar_price,discount_dollar_price)
                    VALUES('${localStorage.productId}','${localStorage.solutionId}','${localStorage.machineId}',
                    '${totalPrice}','${discount}','${discountPrice}','${type}','${discountOff}','${totalPriceOff}','${discountPriceOff}')`;
                    console.log(SQL)
                    this.$db.run(SQL, (err, res) => {
                        if (err) {
                            console.log("添加失败")
                        } else {
                            console.log("添加成功")
                            let selectSql = `select * from machine_price_detail where configure_type=${type}`
                            console.log(selectSql)
                            this.$db.get(selectSql, (err, res) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '系统错误',
                                        desc: err,
                                    });
                                    return
                                }
                                this.discountId = res.configure_type;
                                console.log(this.discountId)
                            })
                        }
                    })
                }
            },

            comup(index) {
                this.config[index].boole = false
                this.coloBa = index
            },
            geterro(index) {
                console.log(index);
                this.config.forEach((item, i) => {
                    if (i > index) {
                        return item.erre = true;
                    }
                    return item.erre = false;
                });
                console.log(this.config, index);
            },

            hardwareSwi(index) {
                const SQL = `select disk.capacity disk_capacity,detail.component_count count  from product_programme_detail detail
join component_disk disk on disk.category_id=detail.category_id and disk.id=detail.component_id and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`;
                console.log(SQL)
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        console.log('查询失败')
                    } else {
                        console.log('成功', res)
                        if (res) {
                            this.totalCapacity = 0;
                            res.forEach(item => {
                                this.totalCapacity += item.disk_capacity * item.count;

                            })
                            console.log(this.totalCapacity)
                        }

                        if (this.config[index].erre) {
                            this.$refs.hardwareSwi[index].style.cursor = 'not-allowed';
                            return;
                        }
                        // this.$refs.hardwareSwi[index].style.cursor = 'pointer';
                        if (this.hardware == -1) {
                            this.config[this.coloBa].boole = true
                            this.$refs.hardwareSwi[index].style.background = '#f1f1f1';
                            //this.config[0].boole = true;
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
                            this.$router.push({
                                path: '/Hardware950/Processor',
                                query: {id: 0, sign: this.config[index].id, signT: this.config[index].id1}
                            });
                        }
                        if (index == 1) {
                            this.$router.push({
                                path: '/Hardware950/Memory',
                                query: {
                                    id: 1,
                                    sign: this.config[index].id,
                                    signT: this.config[index].id1,
                                    otheId: this.config[index].otheId
                                }
                            });
                        }
                        if (index == 7) {
                            this.$router.push({
                                path: '/Hardware950/AccessoriesSelection',
                                query: {id: 7, sign: this.config[index].id, signT: this.config[index].id1}
                            });
                        }
                        if (index == 3) {
                            this.$router.push({
                                path: '/Hardware950/ExternalPcie',
                                query: {
                                    id: 3,
                                    sign: this.config[index].id,
                                    signT: this.config[index].id1,
                                    idElectricity: this.config[index].idElectricity,
                                    idExternalPcie: this.config[index].idExternalPcie,
                                    idExternalPcie1: this.config[index].idExternalPcie1,
                                    idExternalLine: this.config[index].idExternalLine
                                }
                            });
                        }

                        if (index == 5) {
                            this.$router.push({
                                path: '/Hardware950/InteriorPcle',
                                query: {id: 5, sign: this.config[index].id, signT: this.config[index].id1}
                            });
                        }
                        if (index == 6) {
                            this.$router.push({
                                path: '/Hardware950/PowerLine',
                                query: {id: 6, sign: this.config[index].id, signT: this.config[index].id1}
                            });
                        }
                        if (index == 2) {
                            /*跳转 添加showMax 来 显示 总容量*/
                            this.$router.push({
                                path: '/Hardware950/InsideHardDiskDrive',
                                query: {
                                    id: 2,
                                    showMax: false,
                                    sign: this.config[index].id,
                                    signT: this.config[index].id1,
                                    nameRu: this.config[index].nameRu
                                }
                            });

                        }

                        if (index == 4) {
                            /*跳转 添加showMax 来 显示 总容量*/
                            this.$router.push({
                                path: '/Hardware950/ExternalHardDisk',
                                query: {
                                    id: 4,
                                    showMax: false,
                                    sign: this.config[index].id,
                                    signT: this.config[index].id1,
                                    xpansionId: this.config[index].xpansionId,
                                    modelId: this.config[index].modelId
                                }
                            });

                        }
                    }
                })
            },
            getElen() {
                let SQL = `SELECT category_id FROM "product_programme_detail" where category_id in (1,2,3,5,6,11) and solution_id=${localStorage.solutionId} and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                this.$db.all(SQL, (eer, res) => {
                    console.log(res, SQL)
                    if (res.length > 0) {
                        for (let j = 0; j < this.getHard.length; j++) {
                            for (let i = 0; i < res.length; i++) {
                                if (this.getHard[j].num == res[i].category_id) {
                                    this.getHard[j].boole = false
                                    break
                                } else {
                                    this.getHard[j].boole = true
                                }
                            }
                            if (this.getHard[j].boole) {
                                this.gettitle = this.getHard[j].title
                                this.open()
                                break
                            }
                            if (j == this.getHard.length - 1 && !this.getHard[j].boole) {
                                this.addDiscountData(1);
                                this.$router.push({path: '/Downen950/Operation', query: {id: 0}});
                            }
                        }
                    }
                })
            },
            open() {
                this.$alert(this.gettitle, {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: `action: ${action}`,
                        });
                    },
                });
            },
            /* 更改背景颜色*/
            hardwareOver(index) {
                this.$refs.hardwareSwi[index].style.background = '#f0f0f0';
                this.hardwareOv = index;
                if (this.config[index].erre) {
                    this.$refs.hardwareSwi[index].style.cursor = 'not-allowed';
                } else {
                    this.$refs.hardwareSwi[index].style.cursor = 'pointer';
                }
            },
            /* 更改背景颜色*/
            hardwareOut() {
                if (this.hardwareOv !== this.hardware) {
                    this.$refs.hardwareSwi[this.hardwareOv].style.background = '#f5f5f5';
                }
            },

            /* 返回上一页*/
            reload() {
                // 返回上一层 获取 容量值
                localStorage.setItem('externalCapacity', 0);
                localStorage.setItem('externalCapacityCard', 0);
                localStorage.setItem('internalCapacity', 300);
                this.$router.push({path: '/SelectTemplate', query: {id: localStorage.productId}});
                // const changeSQL=` update machine_info set status=0 where id =${localStorage.machineId}`
                // this.$db.run(changeSQL, (err, res) => {
                //     if (err) {
                //         this.$logger(err);
                //         // this.$db.run('ROLLBACK');
                //         this.$Notice.error({
                //             title: '更改失败',
                //             desc: err,
                //         });
                //     }else{
                //         console.log('更改成功')
                //         const deleteSQL=`delete from product_programme_detail where machine_id=${localStorage.machineId}`
                //         this.$db.run(deleteSQL, (err, res) => {
                //             if (err) {
                //                 this.$logger(err);
                //                 this.$db.run('ROLLBACK');
                //                 console.log(deleteSQL)
                //                 this.$Notice.error({
                //                     title: '删除失败',
                //                     desc: err,
                //                 });
                //             }else{
                //                 console.log('删除成功')
                //             }
                //
                //         });
                //     }
                //
                // });
            },

            /* 获取列表清单数据*/
            configurationList() {
                const getti = `select info.component_PN,info.component_FC,detail.category_id,info.name,info.category_name,info.description,info.description_en,
                 detail.component_count,info.listprice_onshore,info.listprice_offshore,info.status,info.ui_status,info.withdraw_date
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
                 left join component_other    other  on  other.id=detail.component_id and detail.category_id= other.category_id
                 left join component_barebone    bb  on  bb.id=detail.component_id and detail.category_id=16
                 left Join component_expansioncase exp_case on exp_case.id=detail.component_id and detail.category_id=23
                 left Join component_powerconversion con on con.id=detail.component_id and detail.category_id=22
                 left Join component_expansionflesh exp_flesh on exp_flesh.id=detail.component_id and detail.category_id=24
                 left Join component_connectingline exp_line on exp_line.id=detail.component_id and detail.category_id=25
                 left Join component_disk_expansioncase disk_exp_case on disk_exp_case.id=detail.component_id and detail.category_id=26
                 left Join component_disk_modeoption disk_mode on disk_mode.id=detail.component_id and detail.category_id=27
                 left join component_memoryrisercard memcard on memcard.category_id = detail.category_id and memcard.id=detail.component_id
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
                   or info.id=exp_case.base_info_id
                   or info.id=exp_flesh.base_info_id
                   or info.id=exp_line.base_info_id
                   or info.id=disk_exp_case.base_info_id
                   or info.id=disk_mode.base_info_id
                   or info.id=con.base_info_id
                   or info.id=memcard.base_info_id
                   where detail.template_id='${localStorage.templateId}' and detail.category_id in (1,2,3,5,6,7,8,11,16,17,23,24,25,26,27,22,37,12,41,39,28,38,30,31) and  detail.solution_id='${localStorage.solutionId}'and detail.product_id='${localStorage.productId}' and detail.machine_id='${localStorage.machineId}'`;
                this.$db.all(getti, (err, res) => {
                    console.log(res)
                    this.tableData = [];
                    this.totalPrice = 0;
                    this.totalPriceOff=0
                    res.forEach((item, index) => {
                        const obj = {
                            component_count: item.component_count,
                            template_desc: item.description,
                            description_en: item.description_en,
                            name: item.name,
                            nameCN: item.category_name,
                            template_name: item.component_FC,
                            component_id: item.component_PN,
                            total_price: item.listprice_onshore * item.component_count,
                            total_priceOff: item.listprice_offshore * item.component_count,
                            category: item.category_id,
                            ui_status: item.ui_status,
                            withdraw_date: item.withdraw_date
                        };
                        this.totalPrice += obj.total_price; //人民币的价格
                        this.totalPriceOff += obj.total_priceOff; //美元的价格
                        ;
                        this.tableData.push(obj);
                    });
                    let count = 100
                    if (this.input != 0) {
                        count = this.input
                    }
                    this.input1 = (this.totalPrice * (count / 100)).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,');
                    this.input1Off = (this.totalPriceOff * (count / 100)).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
                    console.log(this.input1, this.input1Off, count, this.input)
                    var reg = this.totalPrice
                    this.totalPrice = reg;

                    let data = this.tableData;

                    /*合并相同 category_id 进行合并*/
                    function trans(data) {
                        let cache = {} // cache存储的键是eid，值是这个eid在indices数组中的下标
                        let indices = [] // 数组中的每一个值是一个数组，数组中的每一个元素是原数组中相同eid的下标
                        data.forEach((item, i) => {

                            let eid = item.category
                            let index = cache[eid]
                            if (index !== undefined) {
                                indices[index].push(i)
                            } else {
                                cache[eid] = indices.length
                                indices.push([i])
                            }
                        })

                        let result = []
                        indices.forEach(item => {
                            item.forEach(index => {
                                result.push(data[index]) // 依次把index对应的元素data[index]添加进去即可
                            })
                        })

                        return result
                    }


                    let result = trans(data)
                    /*按照指定顺序 进行排序*/
                    let cur = [3, 2, 7, 1, 6, 5, 8, 11, 16, 17, 23, 24, 25, 26, 27, 22, 37, 12, 41, 39, 28, 38, 30, 31];
                    let push = [];
                    for (let x in result) {
                        if (in_array(result[x].category, cur)) {
                            result[x]['sort'] = cur.indexOf(result[x].category);
                            push.push(result[x]);
                        }
                        ;
                    }
                    ;
                    push = push.sort(function (a, b) {
                        if (a.sort < b.sort) {
                            return -1;
                        } else if (a.sort > b.sort) {
                            return 1;
                        }
                        return 0;
                    });
                    this.tableData = [];
                    for (let x in push) {
                        this.tableData.push(push[x])
                    }
                    ;

                    function in_array(search, array) {
                        for (var i in array) {
                            if (array[i] == search) {
                                return true;
                            }
                        }
                        return false;
                    }

                    let arr = []
                    /*如果fc相同，就将数据和并，数量相加*/
                    this.tableData.forEach((item, index) => {
                        if (item.withdraw_date != null && item.withdraw_date != '' && item.withdraw_date != undefined) {
                            let calculationDay = this.calculationDay(moment(item.withdraw_date));
                            item.exeInfo = ' 此部件将于' + moment(item.withdraw_date).format('YYYY-MM-DD HH:mm:ss') + ' 停产。距离停产日期还有' + calculationDay + '天;'
                            item.exeInfo_en = 'This part will be shut down at ' + moment(item.withdraw_date).format('YYYY-MM-DD HH:mm:ss') + '。 ' + calculationDay + ' day before the production stop;';
                        } else {
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
                        if (arr.length == 0) {
                            return arr.push(item)
                        }
                        for (let i = 0; i <= arr.length; i++) {
                            if (i == arr.length) {
                                return arr.push(item)
                            }
                            if (arr[i].template_name == item.template_name) {
                                return arr[i].component_count += item.component_count
                            }
                        }
                    })
                    this.tableData = arr
                    console.log(this.tableData)
                });
            },
            /* 清单页序号*/
            indexMethod(index) {
                return index + 1;
            },
            calculationDay(date) {
                if (date == null || date == undefined || date == '')
                    return 0;
                //获取当前时间
                let now = moment();
                //计算相差多少天 day可以是second minute
                let days = date.diff(now, 'day');
                return days < 0 ? 0 : days;
            },
            getDatabase() {//刚进入页面获取数据，
                let baseSQL = `select id,name,name_en,display from component_category `;
                new Promise((resolve, reject) => {
                    this.$db.all(baseSQL, (err, res) => {
                        if (!err) {
                            resolve(res)
                        }
                    })
                }).then(res => {
                    console.log(res)
                    res.filter((item, index) => {
                        if (item.id == 3) { //赋值给cpu的值
                            this.config[0].id = item.id
                            this.config[0].name = item.name
                            this.$set(this.config[0], 'nameCN', item.name_en)
                        }
                        if (item.id == 11) {//赋值给内存的值
                            this.$set(this.config[0], 'id1', item.id)
                        }
                        if (item.id == 2) {//赋值给内存的值
                            this.config[1].id = item.id
                            this.config[1].name = item.name
                            this.$set(this.config[1], 'nameCN', item.name_en)
                        }
                        if (item.id == 12) {//赋值给内存的值
                            this.$set(this.config[1], 'otheId', item.id)
                        }
                        if (item.id == 3) {//赋值给内存的值
                            //this.config[1].id1=item.id
                            this.$set(this.config[1], 'id1', item.id)
                            this.$set(this.config[5], 'id1', item.id)
                        }
                        if (item.id == 7) {//赋值给内部硬盘、配件的值要传给组件里面
                            this.$set(this.config[2], 'id1', item.id)
                            this.config[7].id = item.id
                        }
                        if (item.id == 17) {//赋值给配件的值
                            this.$set(this.config[7], 'id1', item.id)
                        }
                        if (item.id == 1) {//赋值给内部硬盘的值
                            this.config[2].id = item.id
                            this.config[2].name = item.name
                            this.$set(this.config[2], 'nameCN', item.name_en)
                        }
                        if (item.id == 5) {//赋值给电源的值、外部pcie的值电源的id
                            this.config[6].id = item.id
                            this.config[6].name = item.name
                            this.$set(this.config[6], 'nameCN', item.name_en)
                            this.$set(this.config[3], 'idElectricity', item.id)
                        }
                        if (item.id == 23) {//赋值给外部pcie的值 "扩展柜机壳"id
                            this.$set(this.config[3], 'idExternalPcie', item.id)
                        }
                        if (item.id == 24) {//赋值给外部pcie的值"扩展机瓤"id
                            this.$set(this.config[3], 'idExternalPcie1', item.id)
                        }
                        if (item.id == 25) {//赋值给外部pcie的值""扩展柜连接线"id
                            this.$set(this.config[3], 'idExternalLine', item.id)
                        }
                        if (item.id == 26) {//赋值给外部pcie的值""扩展柜连接线"id
                            this.config[4].name = item.name
                            this.$set(this.config[4], 'nameCN', item.name_en)
                            this.$set(this.config[4], 'xpansionId', item.id)
                        }
                        if (item.id == 27) {//赋值给外部pcie的值""扩展柜连接线"id
                            this.$set(this.config[4], 'modelId', item.id)
                        }
                        if (item.id == 8) {//赋值给电源的值
                            this.$set(this.config[6], 'id1', item.id)
                            this.$set(this.config[3], 'id1', item.id)
                        }
                        if (item.id == 6) {
                            this.config[5].id = item.id
                            this.config[5].name = item.name
                            this.$set(this.config[5], 'nameCN', item.name_en)
                            this.config[3].id = item.id
                        }
                        if (item.id == 23) {
                            this.config[3].name = item.name
                            this.$set(this.config[3], 'nameCN', item.name_en)
                        }
                        if (item.id == 33) {
                            this.$set(this.config[2], 'nameRu', item.id)
                        }
                    })
                    this.$set(this.config[7], 'nameCN', 'Accessories')
                    console.log(this.config)
                })

            }
        },
        created() {

            this.userId = localStorage.userId;
            console.log('this.userId', this.userId)

            this.getDatabase()
            this.configurationList();
            let machineId = localStorage.getItem('machineId')
            /*获取 machine_price_detail 里的id*/
            const update = `select id,configure_type,discount,dollar_discount from machine_price_detail where machine_id=${machineId}`
            this.$db.all(update, (err, res) => {
                if (err) {
                    console.log("获取失败")
                } else {
                    console.log("获取成功")
                    if (res.length > 0) {
                        this.discountId = res[0].configure_type;
                        this.input = res[0].discount
                        this.input = Number(this.input).toFixed(2)
                        this.inputOff = res[0].dollar_discount
                        this.inputOff = Number(this.inputOff).toFixed(2)
                        console.log(this.discountId, this.inputOff)
                    }
                }
            })
        },

        watch: {
            hardwareBian(newValue, oldValue) {
                if (oldValue) {
                    this.configurationList();
                }
            },
        },
    }
</script>

<style scoped lang="less">
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
            padding-top: 30px;
        }
    }
</style>
