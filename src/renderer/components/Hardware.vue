<template>
    <!--配置硬件-->
    <div class="hardware">
        <header>
            <b>{{$t('ConfigureHardware.title')}}</b>
            <el-button type="primary" size="mini" @click="getElen()">{{$t('ConfigureHardware.buttonNext')}}<i
                    class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="reload">{{$t('ConfigureHardware.buttonLast')}}</el-button>
        </header>
        <div class="hardware-left">
            <nav v-for="(item, index) in config" :key="index" @mouseover="hardwareOver(index)"
                 @click="hardwareSwi(index)" ref="hardwareSwi" class="hardware-swi" @mouseout="hardwareOut()" >
                <!--v-show="(index==4||index==3)?aa:!aa"-->
                <div class="hardware-left-bolder">
                    <img src="../assets/rectangle-1.png" v-show="!item.boole">
                </div>

                <img :src="img1[index]" v-show="item.boole"/>
                <img :src="img[index]" v-show="!item.boole"/>
                <div class="hardware-left-name">{{item.name}}</div>
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
                <el-table-column align="center" prop="component_id" label="PN" width="180">
                </el-table-column>
                <el-table-column align="center" prop="template_name" label="FC" width="110">
                </el-table-column>
                <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" width="110">
                </el-table-column>
                <el-table-column align="center" prop="template_desc" :label="$t('Software.details.list.describingAccessories')">
                </el-table-column>
                <el-table-column align="center" prop="component_count" :label="$t('Software.details.list.Quantity')" width="80">
                </el-table-column>
                <el-table-column align="center" prop="total_price" :label="$t('Software.details.list.price')" width="180">
                </el-table-column>
            </el-table>
            <el-row :gutter="24" v-show="!hardwareBian">
                <el-col :span="8">
                    <div class="grid-content">{{$t('Software.details.aggregate')}}：{{totalPrice}}</div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">{{$t('Software.details.discount')}}：
                            <el-input v-model="input" @change="discountData(input,1)"></el-input>
                        %off
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">{{$t('Software.details.discountedPrice')}}：￥
                        <el-input v-model="input1" @change="getDiscountPrice(input1,1)"></el-input>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Hardware',
        data() {
            return {
                // 折扣输入框
                aa:false,
                input: 10,
                input1: '',
                // 总价
                totalPrice: 0,
                // 折扣
                discount: '',
                // 折扣id
                discountId:'',
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
                totalCapacity:'',
                coloBa: 0,
                gettitle:'',
                config: [//硬件配置的初始显示
                    {
                        name: '处理器',
                        img: '../../src/renderer/assets/cpu-1.png',
                        boole: true,
                        erre: false,
                        id:''
                    },
                    {
                        name: '内存',
                        img: '../../src/renderer/assets/internal-1.png',
                        boole: true,
                        erre: false,
                        id:''
                    },
                    {
                        name: '内部硬盘',
                        img: '../../src/renderer/assets/hard-1.png',
                        boole: true,
                        erre: false,
                        id:''
                    },
                    {
                        name: '外部PCle',
                        img: '../../src/renderer/assets/pcie-1.png',
                        boole: true,
                        erre: false,
                        id:''
                    },
                    {
                        name: '外部硬盘',
                        img: '../../src/renderer/assets/pcie-1.png',
                        boole: true,
                        erre: false,
                        id:''
                    },
                    {
                        name: '内部PCle',
                        img: '../../src/renderer/assets/pcie-1.png',
                        boole: true,
                        erre: false,
                        id:''
                    },

                    {
                        name: '电源',
                        img: '../../src/renderer/assets/power-1.png',
                        boole: true,
                        erre: false,
                        id:''
                    },
                    {
                        name: '配件',
                        img: '../../src/renderer/assets/accessories-1.png',
                        boole: true,
                        erre: false,
                        id:5
                    },
                ],
                img: [
                    '../../src/renderer/assets/cpu-2.png',
                    '../../src/renderer/assets/internal-2.png',
                    '../../src/renderer/assets/hard-2.png',
                    '../../src/renderer/assets/external-pcie-2.png',
                    '../../src/renderer/assets/external-hard-2.png',
                    '../../src/renderer/assets/pcie-2.png',
                    '../../src/renderer/assets/power-2.png',
                    '../../src/renderer/assets/accessories-2.png',
                ],
                img1: [
                    '../../src/renderer/assets/cpu-1.png',
                    '../../src/renderer/assets/internal-1.png',
                    '../../src/renderer/assets/hard-1.png',
                    '../../src/renderer/assets/external-pcie-1.png',
                    '../../src/renderer/assets/external-hard-1.png',
                    '../../src/renderer/assets/pcie-1.png',
                    '../../src/renderer/assets/power-1.png',
                    '../../src/renderer/assets/accessories-1.png',
                ],
                getHard:[
                    {
                        boole:false,
                        num:1,
                        title:'内部硬盘没有选择'
                    },
                    {
                        boole:false,
                        num:2,
                        title:'内存没有选择'
                    },
                    {
                        boole:false,
                        num:11,
                        title:'计算节点没有选择'
                    },
                    {
                        boole:false,
                        num:3,
                        title:'cpu没有选择'
                    },
                    {
                        boole:false,
                        num:5,
                        title:'电源没有选择'
                    },
                    {
                        boole:false,
                        num:6,
                        title:'pcie没有选择'
                    },

                ]
            };
        },

        methods: {
            /* 输入 折扣 算出 折扣价*/
            discountData(num,type) {
                if (num < 100 && num > 9) {
                    this.input1 = this.totalPrice * (100 - num) / 100;
                    this.addDiscountData(type)
                } else {
                    this.$message({
                        message: '请输入正确折扣',
                        type: 'warning',
                    });
                }

            },

            /* 输入 折扣价 算出 折扣*/
            getDiscountPrice(num,type) {
                this.input = 100 - num / this.totalPrice * 100;
                this.addDiscountData(type)
            },

            /*往数据库里插入已选数据*/
            addDiscountData(type) {
                let totalPrice = this.totalPrice;
                let discount = parseInt(this.input);
                let discountPrice =parseInt(this.input1);
                console.log(totalPrice,discount,discountPrice,type)
                if (this.discountId !='') {
                    const updateSql = `update machine_price_detail set product_id='${localStorage.productId}',solution_id='${localStorage.solutionId}',
                    list_price='${totalPrice}',discount='${discount}',discount_price='${discountPrice}' WHERE machine_id='${localStorage.machineId}' AND configure_type ='${this.discountId}'`
                    console.log(updateSql)
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log("修改失败")
                        } else {
                            console.log("修改成功")
                        }
                    })
                } else {
                    const SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_price,discount,discount_price,configure_type)
                    VALUES('${localStorage.productId}','${localStorage.solutionId}','${localStorage.machineId}',
                    '${totalPrice}','${discount}','${discountPrice}','${type}')`;
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
                    this.$router.push({path: '/Hardware/Processor', query: {id: 0,sign:this.config[index].id,signT:this.config[index].id1}});
                }
                if (index == 1) {
                    this.$router.push({path: '/Hardware/Memory', query: {id: 1,sign:this.config[index].id,signT:this.config[index].id1}});
                }
                if (index == 7) {
                    this.$router.push({path: '/Hardware/AccessoriesSelection', query: {id: 7,sign:this.config[index].id,signT:this.config[index].id1}});
                }
                if (index == 3) {
                    this.$router.push({path: '/Hardware/ExternalPcie', query: {id: 3,sign:this.config[index].id,signT:this.config[index].id1,idElectricity:this.config[index].idElectricity,idExternalPcie:this.config[index].idExternalPcie,idExternalPcie1:this.config[index].idExternalPcie1,idExternalLine:this.config[index].idExternalLine}});
                }
                if (index == 4) {
                    /*获取 硬盘总容量*/
                    this.totalCapacity = parseInt(localStorage.internalCapacity) + parseInt(localStorage.externalCapacity);
                    /*跳转 添加showMax 来 显示 总容量*/
                    this.$router.push({path: '/Hardware/ExternalHardDisk', query: {id: 4,showMax:false,sign:this.config[index].id,signT:this.config[index].id1}});

                }
                if (index == 5) {
                    this.$router.push({path: '/Hardware/InteriorPcle', query: {id: 5,sign:this.config[index].id,signT:this.config[index].id1}});
                }
                if (index == 6) {
                    this.$router.push({path: '/Hardware/PowerLine', query: {id: 6,sign:this.config[index].id,signT:this.config[index].id1}});
                }
                if (index == 2) {
                    /*获取 硬盘总容量*/
                    this.totalCapacity = parseInt(localStorage.internalCapacity) + parseInt(localStorage.externalCapacity);
                    /*跳转 添加showMax 来 显示 总容量*/
                    this.$router.push({path: '/Hardware/InsideHardDiskDrive', query: {id: 2,showMax:false,sign:this.config[index].id,signT:this.config[index].id1}});

                }
            },
            getElen() {
                let SQL=  `SELECT categroy_id FROM "product_programme_detail" where categroy_id in (1,2,3,5,6,11) and solution_id=${localStorage.solutionId} and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                this.$db.all(SQL,(eer,res)=>{
                    console.log(res,SQL)
                    if(res.length>0){
                        for(let j=0;j<this.getHard.length;j++){
                            for(let i=0;i<res.length;i++){
                                if(this.getHard[j].num==res[i].categroy_id){
                                    this.getHard[j].boole=false
                                    break
                                }else{
                                    this.getHard[j].boole=true
                                }
                            }
                            console.log(this.getHard[j].boole)
                            if(this.getHard[j].boole){
                                this.gettitle=this.getHard[j].title
                                this.open()
                                break
                            }
                            console.log(11111)
                            if(j==this.getHard.length-1&&!this.getHard[j].boole){
                                this.addDiscountData(2);
                                this.$router.push({path:'/Downen/Logic',query:{id:0}});
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
                this.$router.push({path: '/SelectTemplate', query: {}});
                const changeSQL=` update machine_info set status=0 where id =${localStorage.machineId}`
                this.$db.run(changeSQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        // this.$db.run('ROLLBACK');
                        this.$Notice.error({
                            title: '更改失败',
                            desc: err,
                        });
                    }else{
                        console.log('更改成功')
                        const deleteSQL=`delete from product_programme_detail where machine_id=${localStorage.machineId}`
                        this.$db.run(deleteSQL, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$db.run('ROLLBACK');
                                console.log(deleteSQL)
                                this.$Notice.error({
                                    title: '删除失败',
                                    desc: err,
                                });
                            }else{
                                console.log('删除成功')
                            }

                        });
                    }

                });

            },

            /* 获取列表清单数据*/
            configurationList() {
                const getti = ` select info.component_PN,info.component_FC,detail.categroy_id,info.name,info.description,detail.component_count,info.listprice_onshore
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
 where detail.template_id='${localStorage.templateId}' and detail.categroy_id in (1,2,3,5,6,7,8,11,16,17) and  detail.solution_id='${localStorage.solutionId}'and detail.product_id='${localStorage.productId}' and detail.machine_id='${localStorage.machineId}'`;
                this.$db.all(getti, (err, res) => {
                    this.tableData = [];
                    this.totalPrice = 0;
                    res.forEach((item, index) => {
                        const obj = {
                            component_count: item.component_count,
                            template_desc: item.description,
                            name: item.name,
                            template_name: item.component_FC,
                            component_id: item.component_PN,
                            total_price: item.listprice_onshore,
                            categroy: item.categroy_id
                        };

                        this.totalPrice += obj.total_price;
                        this.input1 = this.totalPrice * ((100 - this.input) / 100);
                        /* 获取用户id  判断权限 */
                        if(localStorage.userId == 1){
                            obj.total_price = '';
                            this.totalPrice = '';
                            this.input = '';
                            this.input1 = '';
                        }
                        this.tableData.push(obj);

                    });

                    let data = this.tableData;
                    /*合并相同 categroy_id 进行合并*/
                    function trans(data) {
                        let cache = {} // cache存储的键是eid，值是这个eid在indices数组中的下标
                        let indices = [] // 数组中的每一个值是一个数组，数组中的每一个元素是原数组中相同eid的下标
                        data.forEach((item, i) => {

                            let eid = item.categroy
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
                    let cur = [3,2,7,1,6,5,8,11,16,17];
                    let push = [];
                    for(let x in result) {
                        if(in_array(result[x].categroy, cur)) {
                            result[x]['sort'] = cur.indexOf(result[x].categroy);
                            push.push(result[x]);
                        };
                    };
                    push = push.sort(function(a, b) {
                        if(a.sort < b.sort) {
                            return -1;
                        } else if(a.sort > b.sort) {
                            return 1;
                        }
                        return 0;
                    });
                    this.tableData = [];
                    for(let x in push) {
                        this.tableData.push( push[x])
                    };

                    function in_array(search, array) {
                        for(var i in array) {
                            if(array[i] == search) {
                                return true;
                            }
                        }
                        return false;
                    }
                    let arr=[]
                    // this.tableData.forEach((item,index)=>{
                    //     if(arr.length==0){
                    //        return arr.push(item)
                    //     }
                    //     arr.forEach((it,ind)=>{
                    //         if(it.template_name==item.template_name){
                    //            return arr[ind].component_count+=item.component_count
                    //         }else{
                    //             return arr.push(item)
                    //         }
                    //     })
                    // })
                    console.log(this.tableData,arr)
                });
            },
            /* 清单页序号*/
            indexMethod(index) {
                return index + 1;
            },

            getDatabase(){//刚进入页面获取数据，
                let baseSQL=`select id,name,display from component_categroy `;
                    new Promise((resolve, reject)=>{
                    this.$db.all(baseSQL,(err,res)=>{
                        if(!err){
                            resolve(res)
                        }
                    })
                }).then(res=>{
                    console.log(res)
                    res.filter((item,index)=>{
                        if(item.id==3){ //赋值给cpu的值
                            this.config[0].id=item.id
                            this.config[0].name='处理器'
                        }
                        if(item.id==11){//赋值给内存的值
                            this.$set(this.config[0],'id1',item.id)
                        }
                        if(item.id==2){//赋值给内存的值
                            this.config[1].id=item.id
                            this.config[1].name=item.name
                        }
                        if(item.id==3){//赋值给内存的值
                            //this.config[1].id1=item.id
                            this.$set(this.config[1],'id1',item.id)
                            this.$set(this.config[5],'id1',item.id)
                        }
                        if(item.id==7){//赋值给内部硬盘、配件的值要传给组件里面
                            this.$set(this.config[2],'id1',item.id)
                            this.config[7].id=item.id
                        }
                        if(item.id==17){//赋值给配件的值
                            this.$set(this.config[7],'id1',item.id)
                        }
                        if(item.id==1){//赋值给内部硬盘的值
                            this.config[2].id=item.id
                            this.config[2].name=item.name
                        }
                        if(item.id==5){//赋值给电源的值、外部pcie的值电源的id
                            this.config[6].id=item.id
                            this.config[6].name=item.name
                            this.$set(this.config[3],'idElectricity',item.id)
                        }
                        if(item.id==23){//赋值给外部pcie的值 "扩展柜机壳"id
                            this.$set(this.config[3],'idExternalPcie',item.id)
                        }
                        if(item.id==24){//赋值给外部pcie的值"扩展机瓤"id
                            this.$set(this.config[3],'idExternalPcie1',item.id)
                        }
                        if(item.id==25){//赋值给外部pcie的值""扩展柜连接线"id
                            this.$set(this.config[3],'idExternalLine',item.id)
                        }
                        if(item.id==8){//赋值给电源的值
                            this.$set(this.config[6],'id1',item.id)
                            this.$set(this.config[3],'id1',item.id)
                        }
                        if(item.id==6){
                            this.config[5].id=item.id
                            this.config[5].name='内部PCIe'
                            this.config[3].id=item.id
                            this.config[3].name='外部PCIe'
                        }
                    })
                    console.log(this.config)
                })

            }
        },
         created() {
           this.getDatabase()
            console.log(111111)
            this.configurationList();
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
                //padding-left: 30px;
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
    }
</style>
