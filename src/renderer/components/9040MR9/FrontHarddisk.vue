<template>
    <div>
        <!--前置硬盘-->
        <p class="title content-label font">
            <span class="config-title">{{$t('backPlane.prepositionInternalDisk.title')}}</span>
        </p>
        <div class="modify for-main" v-for="(ite,ind) in arr" :key="ind">
            <el-select v-model="ite.valueSas" size="mini"
                       class="sel" @change="getDisk(ite.valueSas,ind)" @visible-change="changeDisk($event,ind)">
                <el-option
                        v-for="(item,index) in ite.SAS"
                        :key="index"
                        :label="item.value"
                        :value="item.index"
                        :disabled="item.disabled">
                </el-option>
            </el-select>
            <el-select v-model="(ite.value=='没有可以匹配的'&&$store.state.info_language)?'There s no match':ite.value"
                       size="mini" @change="set(ind,ite.value,1)" @visible-change="beforSet($event,ind)">
                <el-option
                        v-for="(item,index) in ite.domlist"
                        :key="index"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.id">
                </el-option>
            </el-select>
            <p>*</p>
            <el-select v-model="ite.num" size="mini"
                       class="sel" @change="set(ind,ite.value)" @visible-change="beforNum($event,ind)">
                <el-option
                        v-for="(item,index) in ite.numZ"
                        :key="index"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button size="mini" type="info" icon="el-icon-close" circle  @click="dele(ind,ite.valueSas)"
                       v-show="arr.length>1?1:0" class="dele"></el-button>
            <div v-for="dl in ite.domlist" v-if="ite.value==dl.id" :key="dl.id">
                <div class="pdiv" v-if="dl.temponTit!=null">
                    {{dl.temponTit}}
                </div>
                <div class="pdiv red-a" v-if="dl.uiStatus">
                    {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                </div>
                <div class="pdiv" v-if="dl.setTimeMe">
                    {{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{dl.setTimeMe}}&gt;
                    {{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}}
                    <{{dl.overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}
                </div>
            </div>
            <div v-if="arr.length-1 == ind">
                <el-button size="mini" icon="el-icon-plus" @click="add(ind)" class="add"></el-button>
                <span class="add-cables" >{{$t('backPlane.prepositionInternalDisk.InternalDisk.content2')}}</span>
            </div>
        </div>
        <br>
        <span class="tips">{{$t('backPlane.prepositionInternalDisk.InternalDisk.content3')}}：{{numS}} /{{num}} </span>
        <br>
        <!--高级配置-->
        <p class="title content-label font">
            <span class="config-title">
                {{$t('backPlane.prepositionInternalDisk.AdvancedConfiguration')}}
            </span>
        </p>

        <div class="modify-ye for-main">
            <span>{{$t('backPlane.prepositionInternalDisk.PreinstalledSoftware')}}：</span>
            <el-select v-model="preloadO" size="mini" @change="preloadOff(preloadO)">
                <el-option
                        v-for="(item,index) in preload"
                        :key="item.id"
                        :label="$store.state.info_language?item.software_des:item.software_desCN"
                        :value="item.id">
                </el-option>
            </el-select>
        </div>

        <!--<div v-for="dl in preload" v-if="preloadO==dl.id" key="dl.id">-->
            <!--<div class="pdiv" v-if="dl.temponTit!=null">-->
                <!--{{dl.temponTit}}-->
            <!--</div>-->
            <!--<div class="pdiv red-a" v-if="dl.uiStatus">-->
                <!--{{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}-->
            <!--</div>-->
            <!--<div class="pdiv" v-if="dl.setTimeMe">-->
                <!--{{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{dl.setTimeMe}}&gt;-->
                <!--{{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}}-->
                <!--<{{dl.overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}-->
            <!--</div>-->
        <!--</div>-->

        <div class="modify-ye for-main">
            <span>{{$t('backPlane.prepositionInternalDisk.SystemStartRule')}}：</span>
            <el-select v-model="systemStart" size="mini" @change="systemStartOff(systemStart)"
                       @visible-change="getSystem($event,systemStart)">
                <el-option
                        v-for="(item,index) in system"
                        :key="item.other_id"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.other_id"
                        :disabled="item.disable">
                </el-option>
            </el-select>
        </div>

        <!--提示信息-->
        <p class="title content-label font">
            <span class="config-title">{{$t('backPlane.prepositionInternalDisk.tips')}}</span>
        </p>

        <div>
            <span v-if="this.$route.query.showMax" class="tips">{{$t('ExternalHardDiskExpansion.TotalHardDiskCapacity')}}:{{totalCapacity | fullNum}}</span>
            <span v-if="!this.$route.query.showMax" class="tips">{{$t('ExternalHardDiskExpansion.TotalHardDiskCapacity')}}:{{this.$parent.$parent.totalCapacity | fullNum}}</span>
        </div>
    </div>
</template>

<script>

    export default {
        name: "FrontHardDisk",
        props: ['num','cuntS','cuntU', 'sign', 'frontHardDiskData'],

        data() {
            return {
                //预加载软件的数组
                preload: [],
                preloadId: 0,
                preloadO: 0,
                // 硬盘类型v-model
                value: 0,
                // 硬盘类型 下拉数据
                SAS: [],
                // 外层循环数组
                arr: [],
                // 存储 已选中 数据id
                brr: [],
                // 硬盘型号 下拉数据
                arAy: [],
                // 已选中的数据，最大容量
                numN: 0,
                // 已选中的插槽数
                numS: 0,
                // 获取总硬盘容量
                totalCapacity: '',
                // 系统启动规则
                systemStart: 0,
                system: [],
                systemId: 0,
                sasSum:0, //SAS卡 数量总和
                sumNum:0, // U.2 卡 数量选中总和
            }
        },
        filters:{
            fullNum:(num)=>{
                console.log(num)
                if(num>1024){
                    return (num/1024).toFixed(2) +'TB'
                }else{
                    return num + 'GB'
                }
            },
        },
        methods: {

            /*通过背板禁用 不可以使用的硬盘*/
            changeDisk(bool, index) {

                console.log(this.frontHardDiskData)
                if (bool) {
                    if (this.frontHardDiskData == 64) {
                        this.arr[index].SAS[0].disabled = true;
                    } else {
                        this.arr[index].SAS[0].disabled = false;
                    }

                    /*查询 判断 U.2 插槽数 是否已经用完，用完置灰*/
                    let numSum = 0;
                    this.arr.forEach(item=>{
                        console.log(item)
                        if(item.valueSas == 2){
                            numSum += item.num;

                        }
                    })

                    //  判断 置灰 u.2盘
                    if(numSum >= 4 ){
                        this.arr[index].SAS[1].disabled = true;
                    }else{
                        this.arr[index].SAS[1].disabled = false;
                    }
                }
            },

            /*筛选 系统启动规则*/
            getSystem(bool) {
                if (bool) {

                    /*查询库里有没有准备回显*/
                    let getsystem = `select detail.id,other.id other_id,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status from component_base_info info
join component_other other on other.base_info_id=info.id
join product_programme_detail detail on detail.category_id=other.category_id and detail.component_id=other.id
where info.deleted=1 and other.category_id=38 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`

                    this.$db.get(getsystem, (err, resA) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            console.log(resA)
                            if (resA) {
                                this.systemId = resA.id
                                this.systemStart = resA.other_id;
                                console.log(this.systemId)
                            }
                        }
                    });

                    /*查看该机器是否有HAB*/
                    const HAB = `select * from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
join component_pcie_classification cpc on cpc.id=io.PCI_Catagory_id
where  cpc.pcie_type = 'HBA' and detail.solution_id='${localStorage.solutionId}' and  detail.template_id='${localStorage.templateId}' and detail.machine_id='${localStorage.machineId}' and product_id='${localStorage.productId}'`;
                    console.log(HAB)
                    this.$db.all(HAB, (err, res) => {
                        if (err) {
                            console.log('查询失败')
                        } else {
                            console.log("查询成功", res)
                            if (this.system.length > 0) {
                                if (res.length > 0) {
                                    this.system[1].disable = false;
                                } else {
                                    this.system[1].disable = true;
                                }
                            }

                            /*查看该机器是否有12扩展柜*/
                            const sql12 = `select * from product_programme_detail detail
join component_disk_expansioncase expan on expan.category_id=detail.category_id and expan.id=detail.component_id
join component_base_info info on info.id=expan.base_info_id
where  detail.solution_id='${localStorage.solutionId}' and detail.product_id='${localStorage.productId}' and detail.template_id='${localStorage.templateId}' and detail.machine_id='${localStorage.machineId}' and expan.disk_count=12`;
                            console.log(sql12)
                            this.$db.all(sql12, (err, res) => {
                                if (err) {
                                    console.log('查询失败')
                                } else {
                                    console.log("查询成功", res)
                                    if (this.system.length > 0) {
                                        if (res.length > 0) {
                                            this.system[2].disable = false;
                                        } else {
                                            this.system[2].disable = true;
                                        }
                                    }

                                    /*查看该机器是否有24扩展柜*/
                                    const sql24 = `select * from product_programme_detail detail
join component_disk_expansioncase expan on expan.category_id=detail.category_id and expan.id=detail.component_id
join component_base_info info on info.id=expan.base_info_id
where  detail.solution_id='${localStorage.solutionId}' and detail.product_id='${localStorage.productId}' and detail.template_id='${localStorage.templateId}' and detail.machine_id='${localStorage.machineId}' and expan.disk_count=24`;
                                    console.log(sql24)
                                    this.$db.all(sql24, (err, res) => {
                                        if (err) {
                                            console.log('查询失败')
                                        } else {
                                            console.log("查询成功", res)
                                            if (this.system.length > 0) {
                                                if (res.length > 0) {
                                                    this.system[3].disable = false;
                                                } else {
                                                    this.system[3].disable = true;
                                                }
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            },

            /*库里添加和删除预选择软件*/
            preloadOff(id) {
                console.log(id)
                if (this.preloadId) {
                    /*id存在的话就删除*/
                    const deletesql = `DELETE FROM product_programme_detail WHERE id in('${this.preloadId}',(select detail.id from product_programme_detail detail
join component_barebone bare on bare.category_id=detail.category_id and bare.id=detail.component_id
where detail.component_id = (select bare.id from component_barebone bare
join component_base_info info on info.id=bare.base_info_id
where info.component_FC='5000' and info.productId='${localStorage.productId}') and detail.solution_id='${localStorage.solutionId}' and detail.product_id='${localStorage.productId}' and detail.template_id='${localStorage.templateId}' and detail.machine_id='${localStorage.machineId}'))`;
                    console.log(deletesql)
                    this.$db.run(deletesql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            console.log("删除成功")
                            this.preloadId = 0
                        }
                    })
                } else {
                    /*id不存在的话就添加*/
                    const innerSQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','solution_id','template_id')
VALUES('${localStorage.productId}','${localStorage.machineId}','${this.$route.query.nameRu}','${id}','1','${localStorage.solutionId}','${localStorage.templateId}')`

                    const innerSQLRuan = `insert into product_programme_detail
(product_id,machine_id,category_id,component_id,component_count,solution_id,template_id)
values
('${localStorage.productId}','${localStorage.machineId}',(select distinct bare.category_id from component_barebone bare
join component_category cate on cate.id=bare.category_id),(select bare.id from component_barebone bare
join component_base_info info on info.id=bare.base_info_id
where info.component_FC='5000' and info.productId='${localStorage.productId}'),1,'${localStorage.solutionId}','${localStorage.templateId}')`
                    console.log(innerSQLRuan)
                    this.$db.run(innerSQL, (err, res) => {
                        if (err) {
                            console.log('添加失败');
                        } else {
                            console.log('添加成功');
                            /*添加barebone里的5000预安装*/
                            this.$db.run(innerSQLRuan, (err, res) => {
                                if (err) {
                                    console.log('添加失败');
                                } else {
                                    console.log('添加成功');
                                }
                            })
                            /*查询库里有没有准备回显*/
                            let getPreload = `select id from product_programme_detail where category_id='${this.$route.query.nameRu}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                            this.$db.get(getPreload, (err, res) => {
                                if (err) {
                                    console.log('查询失败');
                                } else {
                                    console.log('查询成功');
                                    this.preloadId = res.id
                                }
                            });
                        }
                    });
                }
            },

            /*库里添加和删除 系统启动规则*/
            systemStartOff(id) {

                if (id == 0) {
                    const sql = `DELETE FROM product_programme_detail WHERE id = ${this.systemId}`;
                    this.$db.run(sql, (err, res) => {
                        if (err) {
                            console.log('删除失败')
                        } else {
                            console.log('删除成功')
                            this.systemId = ''
                        }
                    });
                    return false;
                }

                /*通过时间戳找id*/
                let time = new Date().getTime();
                if (this.systemId) {
                    /*id不存在的话就添加*/
                    const UPDATE = `UPDATE product_programme_detail set component_count =1,component_id='${id}' where id='${this.systemId}'`
                    this.$db.run(UPDATE, (err, res) => {
                        if (err) {
                            console.log('修改失败');
                        } else {
                            console.log('修改成功');
                        }
                    });
                } else {
                    /*id不存在的话就添加*/
                    const innerSQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','solution_id','template_id',seq_Key)
VALUES('${localStorage.productId}','${localStorage.machineId}','38','${id}','1','${localStorage.solutionId}','${localStorage.templateId}',${time})`

                    this.$db.run(innerSQL, (err, res) => {
                        if (err) {
                            console.log('添加失败');
                        } else {
                            console.log('添加成功');
                            let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                            this.$db.get(selectSql, (err, resa) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '系统错误',
                                        desc: err,
                                    });
                                    return
                                }
                                this.systemId = resa.id
                            })

                        }
                    });
                }
            },

            /*存储硬盘数据  型号与个数*/
            set(ind, id, num) {

                if (this.arr[ind].value == '没有可以匹配的') {
                    return;
                }

                console.log(ind, this.arr[ind].domlist[0].id, num)
                /*显示隐藏总容量*/
                this.$route.query.showMax = true;
                let time = new Date().getTime()
                if (num) {
                    this.arr[ind].num = 1
                }
                const SQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id')
VALUES('${localStorage.productId}','${localStorage.machineId}','${this.sign}','${id}','${this.arr[ind].num}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`
                const updateSql = `UPDATE product_programme_detail set 'component_count'='${this.arr[ind].num}',component_id='
                ${id}' where id=${this.arr[ind].id}`;
                if (this.arr[ind].id) {
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log('修改失败');
                        } else {
                            console.log('修改成功');
                            this.brr[ind] = id
                            this.getNu()
                            console.log(res, this.brr)
                        }
                    });
                } else {
                    this.$db.run(SQL, (err, res) => {
                        if (err) {
                            console.log('失败')
                        } else {
                            console.log('成功')
                            const selectSql = `select * from product_programme_detail where seq_Key=${time}`;
                            this.$db.get(selectSql, (err, res) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '系统错误',
                                        desc: err,
                                    });
                                    return;
                                } else {
                                    this.arr[ind].id = res.id;
                                    this.brr.push(id)
                                    this.getNu()
                                    console.log(res, this.brr)
                                }
                            });
                        }
                    })
                }
            },

            /*添加已选中数据*/
            add(index) {

                if (this.arr[index].value == '没有可以匹配的') {
                    return;
                }

                if (this.numS >= this.num) {
                    return;
                }

                /*显示隐藏总容量*/
                this.$route.query.showMax = true;
                console.log(this.brr)
                console.log(this.arr)

                /*查询 判断 U.2 插槽数 是否已经用完，用完不可添加*/
                let numSum = 0;
                this.arr.forEach(item=>{
                    console.log(item)
                    if(item.valueSas == 2){
                        numSum += item.num;
                    }
                })

                let lArr = this.arAy.filter(item => { //过滤后的数组
                    let num = true
                    this.brr.forEach(it => {

                        if (item.id == it) {
                            num = false
                            return
                        }
                    })
                    return num
                })

                /*
                 numSum  为 U.2 插槽数
                *  判断 插槽数 小于 4 的时候， 添加u.2硬盘   大于时 添加 SAS硬盘
                * */
                if(numSum < 4){
                    this.arr.push({
                        domlist: [...lArr],
                        value: '',
                        num: 1,
                        id: '',
                        numZ: this.num,
                        SAS: [...this.SAS],
                        valueSas: 2,
                        flag: -1
                    })
                    console.log(this.arr)

                    this.getDisk(2, this.arr.length - 1)
                }else{
                    this.arr.push({
                        domlist: [...lArr],
                        value: '',
                        num: 1,
                        id: '',
                        numZ: this.num,
                        SAS: [...this.SAS],
                        valueSas: 0,
                        flag: -1
                    })
                    console.log(this.arr)

                    this.getDisk(0, this.arr.length - 1)
                }

            },

            /*删除已选中数据*/
            dele(index, discType) {

                /*当背板 为 ejoc 时 必须 保留一个U.2*/
                if (this.frontHardDiskData == 64) {
                    const deleteSQL = `select disc_type from component_disk disk
join component_base_info info on info.id=disk.base_info_id
join product_programme_detail detail on detail.category_id =disk.category_id and detail.component_id=disk.id
 where disk.disc_type=2 and info.deleted=1 and info.productId='2' and solution_id='${localStorage.solutionId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                    console.log(deleteSQL)
                    this.$db.all(deleteSQL, (err, res) => {
                        if (err) {
                            console.log('查询失败')
                        } else {
                            console.log('查询成功', res)

                            if (res[0].disc_type == discType && res.length == 1) {
                                this.err(this.$t('error.FrontHardDisk'))
                                return false;
                            }

                            if (this.arr[index].id) {
                                /*显示隐藏总容量*/
                                this.$route.query.showMax = true;
                                const sql = `DELETE FROM product_programme_detail WHERE id = ${this.arr[index].id}`;
                                this.$db.run(sql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '搜索失败',
                                            desc: err,
                                        });
                                    } else {
                                        this.brr.splice(index, 1)
                                        this.arr.splice(index, 1)
                                        console.log("删除成功", this.brr)
                                        this.getNu()
                                    }
                                })
                            }else{
                                this.arr.splice(index, 1);
                            }
                        }
                    })
                } else {
                    if (this.arr[index].id) {
                        /*显示隐藏总容量*/
                        this.$route.query.showMax = true;
                        const sql = `DELETE FROM product_programme_detail WHERE id = ${this.arr[index].id}`;
                        this.$db.run(sql, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '搜索失败',
                                    desc: err,
                                });
                            } else {
                                this.brr.splice(index, 1)
                                this.arr.splice(index, 1)
                                console.log("删除成功", this.brr)
                                this.getNu()
                            }
                        })
                    }else{
                        this.arr.splice(index, 1);
                    }
                }
            },

            /*提示信息*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'warning'
                });
            },

            /* 选中或删除  计算总容量和已选插槽*/
            getNu() {

                /* 查询到  已存入product_programme_detail 表里的数据*/
                let getSQL = ` SELECT detail.id detail_id,disk.id disk_id,info.description,info.description_en,info.ui_status,info.withdraw_date,detail.component_count,disk.disc_type,disk.capacity FROM product_programme_detail detail
join component_disk disk on disk.category_id=detail.category_id and disk.id=detail.component_id
join component_base_info info on info.id = disk.base_info_id
where detail.product_id='${localStorage.productId}' and info.deleted=1 and solution_id='${localStorage.solutionId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}' and is_expansion = 1`
                console.log(getSQL)
                this.$db.all(getSQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '获取失败',
                            desc: err,
                        });
                    } else {
                        this.numN = 0
                        this.numS = 0
                        console.log(res)
                        console.log('进来没')
                        res.forEach(item => {

                            this.numN += item.capacity * item.component_count;
                            this.numS += item.component_count;

                        })

                        console.log(this.arAy)
                        // this.brr.forEach((item,i)=>{
                        //     this.arAy.forEach(it=>{
                        //         if(item==it.id){
                        //
                        //         }
                        //     })
                        // })
                        console.log(this.numN, this.numS)
                        /* 将内部外部总容量  添加到localStorage 进行计算*/
                        let internalCapacity = this.numN;
                        localStorage.setItem('internalCapacity', internalCapacity);

                        this.totalCapacity = parseInt(localStorage.internalCapacity) + parseInt(localStorage.externalCapacity) + parseInt(localStorage.externalCapacityCard);

                        console.log(this.totalCapacity)
                    }
                })
            },

            /*计算硬盘可选最大值*/
            beforNum(bool, ind) {

                this.sasSum = 0; // SAS 计算除本身 数量
                this.sumNum = 0;// U.2 计算除本身 数量
                if (bool) {

                    /* 除了本身选择的数量*/
                    this.arr.forEach((item,index) => {
                        console.log(item)
                        /*SAS卡数量*/
                        if (item.valueSas == 0 && index != ind) {
                            // 获取sas  选中的数量
                           this.sasSum += item.num;
                            console.log(this.sasSum)
                        }
                        /*U.2数量*/
                        if(item.valueSas == 2 && index != ind){
                            // 获取u.2 选中的数量
                            this.sumNum += item.num;
                            console.log(this.sumNum)
                        }
                    })
                    if(this.arr[ind].valueSas == 0){

                        /*为 SAS卡 时 筛选剩余的数量*/
                        if(this.frontHardDiskData == 65 ||this.frontHardDiskData ==66 ||this.frontHardDiskData == 67){
                            this.arr[ind].numZ = this.cuntS - this.sasSum;
                        }
                    }
                    /*为 U.2卡 时 筛选剩余的数量*/
                    if(this.arr[ind].valueSas == 2){
                        this.arr[ind].numZ = this.cuntU - this.sumNum;
                    }
                }
            },

            /*将 选中数据，存储到 新数组中*/
            beforSet(bool, ind) {
                if (bool) {
                    console.log(this.arr)
                    let gettime = new Date().getTime() //获取现在的时间戳
                    this.arr[ind].domlist = this.arr[ind].arAy.filter(item => {
                        let num = true
                        this.brr.forEach((it, index) => {
                            if (this.$store.state.showWithdraw == 0 && item.time < gettime && ind != index) {
                                return false //如果时间小于现在时间，也就说过市了，不在显示
                            }
                            if (item.id == it && index != ind) {
                                return num = false
                            }
                        })
                        return num
                    })
                    console.log(this.arr[ind].domlist, this.brr)
                }
            },

            /*获取硬盘数据*/
            getDisk(id, index) {

                /*查询 判断 U.2 插槽数 是否已经用完，用完置灰*/
                let numSum = 0;
                let SASNum = 0
                this.arr.forEach((item,ind)=>{
                    console.log(item)
                    if(item.valueSas == 2&& ind !=index){
                        numSum += item.num;
                    }

                    if(item.valueSas == 0&& ind !=index){
                        SASNum += item.num;
                    }
                })

                let diskNum = 0;
                let SASNumSum = 0;
                /*计算 U.2数量 */
                diskNum = this.arr[index].num+numSum;
                /*计算 SAS 数量 */
                SASNumSum = this.arr[index].num+SASNum;
                console.log( this.arr[index].num,numSum)

                /*判断选择 u.2时  查看 已选过的数量，和当前数量总和是否大于 4*/
                if(id == 2 && diskNum >4 ){
                    this.err(this.$t('error.FrontHardDiskU'))
                    this.arr[index].valueSas = 0;
                    return false;
                }

                /*判断选择 u.2时  查看 已选过的数量，和当前数量总和是否大于 4*/
                if(id == 0 && SASNumSum >8){
                    this.err(this.$t('error.FrontHardDiskS'))
                    this.arr[index].valueSas = 2;
                    return false;
                }


                /*当背板 为 ejoc 时 必须 保留一个U.2*/
                if (this.frontHardDiskData == 64) {
                    const deleteSQL = `select disc_type from component_disk disk
join component_base_info info on info.id=disk.base_info_id
join product_programme_detail detail on detail.category_id =disk.category_id and detail.component_id=disk.id
 where disk.disc_type=2 and info.deleted=1 and info.productId='2' and solution_id='${localStorage.solutionId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                    console.log(deleteSQL)
                    this.$db.all(deleteSQL, (err, res) => {
                        if (err) {
                            console.log('查询失败')
                        } else {
                            console.log('查询成功', res)

                            if (res.length > 0) {

                                if (res[0].disc_type == this.arr[index].flag && res.length == 1) {
                                    this.err(this.$t('error.FrontHardDisk'))
                                    this.arr[index].valueSas = res[0].disc_type;
                                    return false;
                                }
                            }

                            let than = this

                            const SQL = `select disk.id, info.description,info.description_en,info.watt,info.ui_status,info.withdraw_date,info.title_msg,disk.capacity from component_base_info info
join component_disk disk on disk.base_info_id =info.id
where info.productId=2 and info.deleted=1 and disk.disc_type=${id} and disk.disc_interface=2`

                            console.log(SQL)
                            new Promise(function (resolve, reject) {
                                than.$db.all(SQL, (err, res) => {
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
                            }).then(res => {
                                console.log(res)
                                res.forEach((item, index) => {
                                    this.$set(item, 'temponTit', item.title_msg) //展示的描述
                                    this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                                    if (item.withdraw_date) {
                                        let thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                        let time = new Date(thisTime).getTime();//将时间改为时间戳
                                        this.$set(item, 'time', time)//将时间戳添加到对象里面
                                        this.$set(res[index], 'time', time)//将时间戳添加到对象里面
                                        //如果不为null的话,就改为天数
                                        this.$store.commit('setStatusTime', item.withdraw_date)
                                        this.$set(item, 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                                    } else {
                                        this.$set(res[index], 'time', '不比')//将时间戳添加到对象里面
                                    }
                                    this.$store.commit('uiStatusTime', item.ui_status)
                                    this.$set(item, 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                                    this.$set(item, 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                                });

                                res = res.filter((item, i) => {//获取到数据后，
                                    for (let j = 0; j < this.brr.length; j++) {//brr里面记录过的，就把他删除掉，因为上面已经选择过了
                                        if (item.id == this.brr[j]) {
                                            return false;
                                        }
                                    }
                                    return true;
                                });
                                this.arAy = [...res]
                                this.arr[index].domlist = [...res];
                                this.arr[index].arAy = [...res]

                                this.arr[index].value = this.arr[index].domlist.length == 0 ? '没有可以匹配的' : this.arr[index].domlist[0].id;// 默认展示第一个值,如果没有值显示没有匹配的

                                if (this.arr[index].domlist.length > 0) {
                                    this.set(index, this.arr[index].domlist[0].id);
                                }
                            });

                            than.arr[index].flag = id;
                        }
                    })
                } else {

                    let than = this

                    const SQL = `select disk.id, info.description,info.description_en,info.watt,info.ui_status,info.withdraw_date,info.title_msg,disk.capacity from component_base_info info
join component_disk disk on disk.base_info_id =info.id
where info.productId=2 and info.deleted=1 and disk.disc_type=${id} and disk.disc_interface=2`

                    console.log(SQL)
                    new Promise(function (resolve, reject) {
                        than.$db.all(SQL, (err, res) => {
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
                    }).then(res => {
                        console.log(res)
                        res.forEach((item, index) => {
                            this.$set(item, 'temponTit', item.title_msg) //展示的描述
                            this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                            if (item.withdraw_date) {
                                let thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                let time = new Date(thisTime).getTime();//将时间改为时间戳
                                this.$set(item, 'time', time)//将时间戳添加到对象里面
                                this.$set(res[index], 'time', time)//将时间戳添加到对象里面
                                //如果不为null的话,就改为天数
                                this.$store.commit('setStatusTime', item.withdraw_date)
                                this.$set(item, 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                            } else {
                                this.$set(res[index], 'time', '不比')//将时间戳添加到对象里面
                            }
                            this.$store.commit('uiStatusTime', item.ui_status)
                            this.$set(item, 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                            this.$set(item, 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                        });

                        res = res.filter((item, i) => {//获取到数据后，
                            for (let j = 0; j < this.brr.length; j++) {//brr里面记录过的，就把他删除掉，因为上面已经选择过了
                                if (item.id == this.brr[j]) {
                                    return false;
                                }
                            }
                            return true;
                        });
                        this.arAy = [...res]
                        this.arr[index].domlist = [...res];
                        this.arr[index].arAy = [...res]

                        this.arr[index].value = this.arr[index].domlist.length == 0 ? '没有可以匹配的' : this.arr[index].domlist[0].id;// 默认展示第一个值,如果没有值显示没有匹配的

                        if (this.arr[index].domlist.length > 0) {
                            this.set(index, this.arr[index].domlist[0].id);
                        }
                    });
                    than.arr[index].flag = id;
                }

            },

            /*获取硬盘类型数据*/
            getSAS() {
                const SQLSAS = `select distinct disc_type from component_disk`

                this.$db.all(SQLSAS, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '获取数据失败',
                            desc: err,
                        });
                    } else {
                        console.log(res);
                        res.forEach(item => {
                            if (item.disc_type === 0) {
                                this.SAS.push({
                                    value: 'SAS',
                                    index: 0,
                                    disabled: false
                                })
                            }
                            if (item.disc_type === 1) {
                                this.SAS.push({
                                    value: 'SATA',
                                    index: 1,
                                    disabled: false
                                })
                            }
                            if (item.disc_type === 2) {
                                this.SAS.push({
                                    value: 'U.2',
                                    index: 2,
                                    disabled: false
                                })
                            }
                            // if (item.disc_type === 3) {
                            //     this.SAS.push( {
                            //         value:'M.2',
                            //         index:3
                            //     })
                            // }
                        })
                    }
                });
            },

        },

        /*进入页面获取数据*/
        created() {
            /*查询出软件预装的数据*/
            console.log(this.$route.query)
            let SQLPreload = `SELECT soft.id,soft.software_des,soft.software_desCN,soft.withdraw_date,soft.ui_status,soft.title_msg,so.ship_date
				FROM component_software soft
				join product_info info on info.id=soft.productId
				join relation_solution_product relation on relation.product_id = info.id
				join solution so on so.id = relation.solution_id
				where soft.category_id='${this.$route.query.nameRu}' and soft.productId='${localStorage.productId}' and so.id='${localStorage.solutionId}'`
            console.log(SQLPreload)
            /*查询库里有没有准备回显*/
            let getPreload = `select id from product_programme_detail where category_id='${this.$route.query.nameRu}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
            this.$db.get(SQLPreload, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: '获取数据失败',
                        desc: err,
                    });
                } else {
                    let obj = {
                        id: 0,
                        software_des: 'no',
                        software_desCN: '否',
                        setTimeMe: null,
                        overdueTime: '',
                        temponTit: null,
                        uiStatusEn: '',
                        uiStatus: ''
                    }
                    this.preload.push(obj)

                    console.log(this.preload)

                    res.software_des = 'yes'
                    res.software_desCN = '是'
                    this.$set(res, 'temponTit', res.title_msg) //展示的描述
                    this.$set(res, 'setTimeMe', res.withdraw_date) //展示的描述
                    //this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                    if (res.withdraw_date != null) {
                        //如果不为null的话,就改为天数
                        this.$store.commit('setStatusTime', res.withdraw_date)
                        this.$set(res, 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                    }
                    this.$store.commit('uiStatusTime', res.ui_status)
                    this.$set(res, 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                    this.$set(res, 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述

                    this.preload.push(res)
                    this.$db.get(getPreload, (err, resA) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            console.log(resA)
                            if (resA) {
                                this.preloadId = resA.id
                                this.preloadO = res.id
                            }
                        }
                    });
                }
            });

            /*查询出系统启动规则的数据*/
            console.log(this.$route.query)
            let SQLsystem = `select other.id other_id,other.category_id,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status from component_base_info info
join component_other other on other.base_info_id=info.id
where info.productId=2 and info.deleted=1 and other.category_id=38`

            this.$db.all(SQLsystem, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: '获取数据失败',
                        desc: err,
                    });
                } else {

                    console.log(res)
                    res.forEach((item, i) => {
                        this.$set(res[i], 'temponTit', res[i].title_msg) //展示的描述
                        this.$set(res[i], 'setTimeMe', res[i].withdraw_date) //展示的描述
                        //this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                        if (res[i].withdraw_date != null) {
                            //如果不为null的话,就改为天数
                            this.$store.commit('setStatusTime', res[i].withdraw_date)
                            this.$set(res[i], 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                        }
                        this.$store.commit('uiStatusTime', res[i].ui_status)
                        this.$set(res[i], 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                        this.$set(res[i], 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                    })


                    for (let i = 0; i < res.length; i++) {
                        res[i].disable = false;
                    }

                    this.system = [...res]
                    this.system.unshift({
                        other_id: 0,
                        description: '从硬盘启动(默认)',
                        description_en: 'default',
                        disable: false
                    })

                    console.log(this.system)

                    /*查询库里有没有准备回显*/
                    let getsystem = `select detail.id,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status from component_base_info info
join component_other other on other.base_info_id=info.id
join product_programme_detail detail on detail.category_id=other.category_id and detail.component_id=other.id
where info.deleted=1 and other.category_id=38 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`

                    this.$db.get(getsystem, (err, resA) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                            console.log(resA)
                            if (resA) {
                                this.systemId = resA.id
                                console.log(this.systemId)
                            }
                        }
                    });
                }
            });

            /* 查询到  已存入product_programme_detail 表里的数据*/
            let getSQL = ` SELECT detail.id detail_id,disk.id disk_id,info.description,info.description_en,info.ui_status,info.withdraw_date,detail.component_count,disk.disc_type,disk.capacity FROM product_programme_detail detail
join component_disk disk on disk.category_id=detail.category_id and disk.id=detail.component_id
join component_base_info info on info.id = disk.base_info_id
where detail.product_id='${localStorage.productId}' and info.deleted=1 and solution_id='${localStorage.solutionId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}' and detail.is_expansion=1`
            console.log(getSQL)
            this.$db.all(getSQL, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: '获取失败',
                        desc: err,
                    });
                } else {
                    console.log(res)
                    if (res.length > 0) {
                        this.arr = []
                        this.brr = []
                        res.forEach(item => {
                            let than = this
                            const SQL = `select disk.id, info.description,info.description_en,info.watt,info.ui_status,info.withdraw_date,info.title_msg,disk.capacity from component_base_info info
join component_disk disk on disk.base_info_id =info.id
where info.productId=2 and info.deleted=1 and disk.disc_type=${item.disc_type}`

                            console.log(SQL)
                            new Promise(function (resolve, reject) {
                                than.$db.all(SQL, (err, ress) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '获取数据失败',
                                            desc: err,
                                        });
                                    } else {
                                        resolve(ress);
                                    }
                                });
                            }).then(ress => {
                                console.log(ress)
                                ress.forEach((ite, index) => {
                                    this.$set(ite, 'temponTit', ite.title_msg) //展示的描述
                                    this.$set(ite, 'setTimeMe', ite.withdraw_date)//过期的时间
                                    if (ite.withdraw_date != null) {
                                        let thisTime = ite.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                        let time = new Date(thisTime).getTime();//将时间改为时间戳
                                        this.$set(ite, 'time', time)//将时间戳添加到对象里面
                                        this.$set(ress[index], 'time', time)//将时间戳添加到对象里面
                                        //如果不为null的话,就改为天数
                                        this.$store.commit('setStatusTime', ite.withdraw_date)
                                        this.$set(ite, 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                                    } else {
                                        this.$set(ress[index], 'time', '不比')//将时间戳添加到对象里面
                                    }
                                    this.$store.commit('uiStatusTime', item.ui_status)
                                    this.$set(ite, 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                                    this.$set(ite, 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                                });

                                const SQLSAS = `select distinct disc_type from component_disk`

                                this.$db.all(SQLSAS, (err, resSAS) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '获取数据失败',
                                            desc: err,
                                        });
                                    } else {
                                        this.SAS = [];
                                        console.log(resSAS);
                                        resSAS.forEach(it => {
                                            if (it.disc_type === 0) {
                                                this.SAS.push({
                                                    value: 'SAS',
                                                    index: 0,
                                                    disabled: false
                                                })
                                            }
                                            if (it.disc_type === 1) {
                                                this.SAS.push({
                                                    value: 'SATA',
                                                    index: 1,
                                                    disabled: false
                                                })
                                            }
                                            if (it.disc_type === 2) {
                                                this.SAS.push({
                                                    value: 'U.2',
                                                    index: 2,
                                                    disabled: false
                                                })
                                            }
                                            // if (it.disc_type === 3) {
                                            //     this.SAS.push( {
                                            //         value:'M.2',
                                            //         index:3
                                            //     })
                                            // }
                                        })
                                        than.arAy = [...ress]
                                        than.brr.push(item.disk_id)
                                        than.arr.push({
                                            domlist: [...ress],
                                            arAy: [...ress],
                                            value: item.disk_id,
                                            num: item.component_count,
                                            id: item.detail_id,
                                            numZ: this.num,
                                            SAS: [...this.SAS],
                                            valueSas: item.disc_type,
                                            flag: item.disc_type,
                                        })
                                        this.getNu()
                                        console.log('获取成功', res, ress, this.arr, this.brr)
                                    }
                                });
                            });
                        })
                    } else {
                        this.getSAS();
                        this.set(this.arr.length - 1, this.arAy[0].id);
                    }
                }
            })
        }

    }
</script>

<style scoped>

    .add {
        margin: 20px 10px;
    }

    .modify {
        margin: 10px 0;
    }

    .modify-ye {
        margin: 10px 0 30px;
    }

    .dele {
        margin-left: 20px;
    }

    .font {
        font-size: 16px;
    }
</style>
