<template>
    <!--内部硬盘-->
    <div class="accessories">
        <div>
            <div class="config cable">
                <p class="title content-label">
                    <span class="config-title">{{$t('backPlane.prepositionBackPlane.title')}}</span>
                </p>
                <!--前置背板-->
                <div class="modify for-main">
                    <el-select size="mini" v-model="frontHardDiskData"
                               placeholder="请选择"
                               @change="backplaneStorageData(frontHardDiskData,1)">
                        <el-option v-for="(item,index) in backplane" :key="item.name"
                                   :label="$store.state.info_language?item.en:item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <div v-for="dl in backplane" v-if="frontHardDiskData==dl.id" :key="dl.id">
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
                    <br>
                    <span class="add-cables">{{frontBackplaneDescription}}</span>

                    <!--前置硬盘-->
                    <FrontHardDisk :num='num' :cuntS='cuntS' :cuntU='cuntU'  :sign='sign' ref="FrontHardDisk"
                                   :frontHardDiskData="frontHardDiskData"></FrontHardDisk>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 内部硬盘
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */

    /*引入前置硬盘*/
    import FrontHardDisk from './FrontHardDisk.vue';

    export default {
        name: "InsideHardDiskDrive",
        components: {
            FrontHardDisk,
        },
        data() {
            return {
                queAS: this.$store.state.info_language ? 'please choose' : '请选择',//默认显示时，请选择的中英文切换
                signT: '',
                sign: '',
                /*---------------前置背板---------------*/
                // 前置背板 v-model
                frontHardDiskData: 64,
                // 前置背板 v-model  备用
                frontHardDiskDataBei: 0,
                // 获取数据库id 判断数据id是否相同
                frontBackplateId: '',
                // 选择前置背板  传入前置硬盘数量
                num: 0,  // SAS卡 插槽数  +  U.2卡 插槽数
                cuntS:0, // SAS卡 插槽数
                cuntU:0,  // U.2卡 插槽数
                numSum:0,
                // 获取前置背板下拉数据
                backplane: [],
                // 前置背板描述
                frontBackplaneDescription: '',
                // 背板带出的  io卡
                ioCardId: '',
                // 背板带出的线缆
                otherId: '',
                ej0c: {},//记录选ej0c为单数时带的EJRL的 category_id 和component_id,
                EJRLId: '',//查看库里id村部存在
                orgBackplaneId:'' // 记录背板上一次id
            }
        },

        methods: {
            /*------------------------------------------------------前置背板------------------------------------------------------------*/

            /*前置背板 选中的数据 存储数据库*/
            async backplaneStorageData(id, num) {

                // 判断前置背板id   可使用硬盘最大值
                let gettime = new Date().getTime() //获取现在的时间戳
                this.backplane.filter((item) => {
                    if (this.$store.state.showWithdraw == 0 && item.time < gettime) {
                        return false //如果时间小于现在时间，也就说过市了，不在显示
                    }
                })

                /*选中的硬盘插槽数，和总数对比，如果 大于总数，不可切换背板*/
                if(this.$refs.FrontHardDisk.numS>this.num){
                    this.err(this.$t('error.FrontBackplane'))
                    /*赋值上一次的ID*/
                    this.frontHardDiskData = this.orgBackplaneId;

                    // 获取插槽数 并赋值
                    this.backplane.forEach((item,index)=>{
                        let num = 0;
                        if(item.id == this.frontHardDiskData){
                            num = item.cuntU + item.cuntS;
                        }
                        if(item.id == this.frontHardDiskData && item.cuntS == null){
                            num = item.cuntU + 8;
                        }
                        this.num = num;
                    })
                    return false;
                }


                /*计算 U.2 盘 占用几个插槽*/
                let sunNum = 0;
                console.log(this.$refs.FrontHardDisk.arr)
                this.$refs.FrontHardDisk.arr.forEach(item => {
                    if(item.valueSas ==0){
                        sunNum++;
                    }
                })

                /* 判断 id为 64背板  以及 是否有SAS盘  有的情况下不让切换 */
                if(id == 64 && sunNum>0){
                    this.err(this.$t('error.BackplaneandHardDisk'))
                    this.frontHardDiskData = this.orgBackplaneId;
                    return false;
                }

                /*计算 选中背板  可以用的硬盘插槽数*/
                console.log(this.backplane)
                this.backplane.forEach((item,index)=>{
                    console.log(item)
                    if(item.id == id){
          /*              if(item.cuntS != null){
                            this.num = item.cuntU + item.cuntS;
                        }else{
                            this.num = item.cuntU;
                        }
*/
                        this.num = item.cuntS + item.cuntU;
                        this.cuntS = item.cuntS;
                        this.cuntU = item.cuntU;
                    }
                })

                /*获取 上一次 id*/
                this.orgBackplaneId = id;

                /*通过vuex 传入选中前置背板id, 从而选择面板*/
                this.$store.backplaneId = this.frontHardDiskData;

                let iokSum = 0 //获取背板带出的io卡
                await new Promise((resolve, reject) => {
                    let iokSQl = `select sum(component_count) sun from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where detail.product_id='${localStorage.productId}' and detail.is_expansion='1' and solution_id='${localStorage.solutionId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                    this.$db.get(iokSQl, (err, res) => {
                        if (err) {
                            console.log('查询失败', iokSQl)
                        } else {
                            console.log('查询成功', res)
                            iokSum = res.sun
                        }
                        resolve()
                    })
                })
                let cpuIokSum = 0//根据cpu的数量算出iok的最大数
                await new Promise((resolve, reject) => {
                    let iokSQl = `select component_count  from product_programme_detail detail
join component_cpu cpu on cpu.category_id=detail.category_id and cpu.id=detail.component_id
where detail.product_id='${localStorage.productId}' and solution_id='${localStorage.solutionId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                    this.$db.get(iokSQl, (err, res) => {
                        if (err) {
                            console.log('查询失败')
                        } else {
                            console.log('查询成功', res)
                            if (res.component_count == 2) {
                                cpuIokSum = 7
                            }
                            if (res.component_count == 3) {
                                cpuIokSum = 9
                            }
                            if (res.component_count == 4) {
                                cpuIokSum = 11
                            }
                        }
                        resolve()
                    })

                })
                let diskSum = 0//硬盘带出iok的数量
                let iokId = 0//硬盘带出iok的id
                let diskSumBei = 0//硬盘带出iok的数量之前的
                let iokIdBei = 0//硬盘带出iok的id之前的
                this.backplane.forEach(item => {
                    if (item.id == id) {
                        diskSum = item.iokSum
                        iokId = item.iokId
                    }
                    if (item.id == this.frontHardDiskDataBei) {
                        diskSumBei = item.iokSum
                        iokIdBei = item.iokId
                    }
                })
                console.log('数量', diskSum, iokId, diskSumBei, iokIdBei, this.frontHardDiskData, this.frontHardDiskDataBei)
                console.log('数量2', cpuIokSum, iokSum, diskSumBei, diskSum)
                if (cpuIokSum >= iokSum - diskSumBei + diskSum) {
                    /*前置背板 选中的数据 存储数据库*/
                    this.addBackplaneData(id, num);
                    /*通过选中的背板将带出来的io卡查出来*/
                    this.getIoCard(iokIdBei, diskSumBei, iokId, diskSum);
                } else {
                    this.err(this.$t('error.FrontBackplaneHardDisk'))
                    this.frontHardDiskData = this.frontHardDiskDataBei
                    return
                }

                if (id == 64) {
                    const SQL = `select disc_type from component_disk disk
join component_base_info info on info.id=disk.base_info_id
join product_programme_detail detail on detail.category_id =disk.category_id and detail.component_id=disk.id
 where disk.disc_type=2 and info.deleted=1 and info.productId='${localStorage.productId}' and solution_id='${localStorage.solutionId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                    console.log(SQL)
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            console.log('查询失败')
                        } else {
                            console.log('查询成功', res)

                            if (res.length < 1) {
                                this.$refs.FrontHardDisk.add();
                            }
                        }
                    })
                }

                /*当隐藏页面时  删除数据*/
                const deleteSQL = `DELETE FROM product_programme_detail WHERE id = '${this.otherId}'`
                this.$db.run(deleteSQL, (err, res) => {
                    if (err) {
                        console.log('删除失败')
                    } else {
                        console.log('删除成功')
                        this.otherId = '';
                        /*通过选中的背板将带出来的线缆查出来*/
                        this.getOther(id);

                    }
                })
            },

            /*通过选中的背板将带出来的io卡查出来*/
            async getIoCard(idBei, sumBei, id, sum) {
                const IoCard = `select detail.id,detail.component_count,detail.component_id,info.component_FC from product_programme_detail detail
						join component_iocard io on io.id=detail.component_id and io.category_id = detail.category_id
						join component_base_info info on info.id=io.base_info_id
						where io.id ='${idBei}' and detail.product_id='${localStorage.productId}' and detail.solution_id='${localStorage.solutionId}' and detail.template_id='${localStorage.templateId}' and detail.machine_id='${localStorage.machineId}'`
                console.log(IoCard)
                let dsikIdBei = [0, 0, 0]  //之前插入的iok的id，数量
                await new Promise((resolve, seject) => {
                    this.$db.all(IoCard, (err, res) => {
                        if (err) {
                            console.log("查询失败")
                        } else {
                            console.log("查询成功1", res)
                            res.forEach(item => {
                                if (item.component_id == idBei) {
                                    dsikIdBei[0] = item.id
                                    dsikIdBei[1] = item.component_count
                                    dsikIdBei[2] = item.component_FC
                                }
                            })
                            resolve()
                        }
                    })
                })
                //如果数量大于的话，就肯定存在，所以直接改,因为他存在一个不添加iok的背板，所以会现在上一次的背板没带iok的现象
                if (dsikIdBei[1] > sumBei) {
                    await new Promise((resolve, reject) => {
                        let updateSQl = `update product_programme_detail set component_count=${dsikIdBei[1] - sumBei} where id=${dsikIdBei[0]}`
                        this.$db.run(updateSQl, (err, res) => {
                            if (err) {
                                console.log('修改失败2')
                            } else {
                                console.log('修改成功2')
                                if (dsikIdBei[2] == 'EJ14' && this.EJRLId) {
                                    let deleteId = `delete from product_programme_detail where id=${this.EJRLId}`
                                    this.$db.run(deleteId, (err, res) => {
                                        if (err) {
                                            console.log('删除失败', deleteId)
                                        } else {
                                            this.EJRLId = ''
                                            console.log('删除成功')
                                            resolve()
                                        }
                                    })
                                } else {
                                    resolve()
                                }

                            }
                        })
                    })

                } else if (dsikIdBei[0]) {
                    //如果id存在的话，就删除，要不然就过
                    await new Promise((resolve, reject) => {
                        let deleteSQl = `delete from product_programme_detail where id=${dsikIdBei[0]}`
                        this.$db.run(deleteSQl, (err, res) => {
                            if (err) {
                                console.log('删除失败3', deleteSQl)
                            } else {
                                console.log('删除成功3')
                                resolve()
                            }
                        })
                    })

                } else {
                    console.log('没有sas卡所删除')
                }
                //因为上一次和这一次的component_id可能一样，会造成数据错误，所以分开查询
                const IoCardNei = `select detail.id,detail.component_count,detail.component_id,info.component_FC from product_programme_detail detail
						join component_iocard io on io.id=detail.component_id and io.category_id = detail.category_id
						join component_base_info info on info.id=io.base_info_id
						where io.id ='${id}' and detail.product_id='${localStorage.productId}' and detail.solution_id='${localStorage.solutionId}' and detail.template_id='${localStorage.templateId}' and detail.machine_id='${localStorage.machineId}'`
                let dsikId = [0, 0, 0]  //现在要插入的iok的id，数量
                await new Promise((resolve, seject) => {
                    this.$db.all(IoCardNei, (err, res) => {
                        if (err) {
                            console.log("查询失败4")
                        } else {
                            console.log("查询成功4", res)
                            res.forEach(item => {
                                if (item.component_id == id) {
                                    dsikId[0] = item.id
                                    dsikId[1] = item.component_count
                                    dsikId[2] = item.component_FC
                                }
                            })
                            resolve()
                        }
                    })
                })
                //如果id存在，则说明库里有这条数据，直接修改，加上数量就行
                if (dsikId[0]) {
                    await new Promise((resolve, reject) => {
                        let updateSQl = `update product_programme_detail set component_count=${dsikId[1] + sum} where id=${dsikId[0]}`
                        this.$db.run(updateSQl, (err, res) => {
                            if (err) {
                                console.log('修改失败5')
                            } else {
                                console.log('修改成功5')
                                if (dsikId[2] == 'EJ14' && dsikId[1] % 2 && !this.EJRLId) {
                                    let time = new Date().getTime();
                                    const updateSql = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.ej0c.categoryId}','${this.ej0c.componentId}','1','${time}','${localStorage.solutionId}','${localStorage.templateId}','1')`;
                                    let inquireId = `select id from product_programme_detail where seq_Key='${time}'`
                                    this.$db.run(updateSql, (err, res) => {
                                        if (err) {
                                            console.log('添加失败');
                                        } else {
                                            console.log('添加成功、查询id')
                                            this.$db.get(inquireId, (err, res) => {
                                                if (err) {
                                                    console.log('查询失败')
                                                } else {
                                                    console.log('查询id成功', res)
                                                    this.EJRLId = res.id
                                                    resolve()
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    resolve()
                                }
                            }
                        })
                    })
                } else if (id) {
                    //如果id不存在，就看所添加的有没有附带的iok的id 有就添加 直接添加，没有就过滤
                    await new Promise((resolve, reject) => {
                        let insertSQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,component_count,'solution_id','template_id','machine_id')
                    VALUES('${localStorage.productId}','6',${id},${sum},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                        this.$db.run(insertSQL, (err, res) => {
                            if (err) {
                                console.log('添加失败6')
                            } else {
                                console.log('添加成功6')
                                resolve()
                            }
                        })
                    })
                } else {
                    console.log('没有sas卡所添加')
                }
            },

            /*通过选中的背板将带出来的线缆查出来*/
            getOther(id) {
                const IoCard = `select other.category_id,other.id,rbo.other_cnt from relation_backplane_other rbo
join component_backplane back on back.id = rbo.backplane_id
join component_other other on other.id=rbo.other_id
join component_base_info info on info.id=other.base_info_id
where info.deleted=1 and info.productId=2 and back.id=${id}`
                console.log(IoCard)
                this.$db.get(IoCard, (err, res) => {
                    if (err) {
                        console.log("查询失败")
                    } else {
                        console.log("查询成功", res)
                        if (res) {

                            if (!this.otherId) {
                                let time = new Date().getTime();
                                const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')
                    VALUES('${localStorage.productId}','${res.category_id}',${res.id},${res.other_cnt},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                                console.log(SQL)
                                this.$db.run(SQL, (err, res) => {
                                    if (err) {

                                    } else {
                                        if (res) {
                                            console.log("添加失败")
                                        } else {
                                            console.log("添加成功" + JSON.stringify(res));
                                            let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                            this.$db.get(selectSql, (err, res) => {
                                                if (err) {

                                                }
                                                this.otherId = res.id;
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    }
                })
            },

            /*前置背板 选中的数据 存储数据库*/
            addBackplaneData(id, num) {
                if (this.frontBackplateId) {
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                                ${id}',template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}',
                                 solution_id = '${localStorage.solutionId}',product_id = '${localStorage.productId}'
                                 where id=${this.frontBackplateId}`
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log("修改失败")
                        } else {
                            console.log("修改成功")
                            this.frontHardDiskDataBei = id
                        }
                    })
                } else {
                    let time = new Date().getTime();
                    const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,component_count,seq_Key,'solution_id','template_id','machine_id')
                    VALUES('${localStorage.productId}','${this.signT}',${id},${num},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                    console.log(SQL)
                    this.$db.run(SQL, (err, res) => {
                        if (err) {

                        } else {
                            if (res) {
                                console.log("添加失败")
                            } else {
                                console.log("添加成功" + JSON.stringify(res));
                                this.frontHardDiskDataBei = id
                                let selectSql = `select * from product_programme_detail where seq_Key=${time}`
                                this.$db.get(selectSql, (err, res) => {
                                    if (err) {

                                    }
                                    this.frontBackplateId = res.id;
                                })
                            }
                        }
                    })
                }
            },

            /*获取所有背板下拉数据*/
            getBackplane() {
                /*获取背板id 下拉*/
                const SQL = `select disctype2.id,disctype2.description,disctype2.description_en,disctype2.watt,disctype2.ui_status,disctype2.withdraw_date,disctype2.title_msg,disctype2.disc_cnt disc_cnt_u,disctype2.component_FC,disctype0.disc_cnt disc_cnt_s from
(select back.id,back.base_info_id,info.description,info.description_en,info.watt,info.ui_status,back.disc_cnt,info.withdraw_date,info.title_msg,info.component_FC FROM component_base_info info
join component_backplane back on back.base_info_id=info.id
where info.productId= '2' and info.deleted=1 and back.disc_type=2) disctype2
left join

(select back.id,back.base_info_id,info.description,info.description_en,info.watt,info.ui_status,back.disc_cnt,info.withdraw_date,info.title_msg FROM component_base_info info
join component_backplane back on back.base_info_id=info.id
where info.productId= '2' and info.deleted=1 and back.disc_type=0) disctype0
on disctype2. base_info_id=disctype0.base_info_id`;

                /*带出IO卡  sql*/
                let iokSQl = `select backplane_id,iocard_id,iocard_cnt from relation_backplane_iocard relation where backplane_id in
(SELECT back.id FROM component_base_info info
join component_backplane back on back.base_info_id=info.id
where info.productId= '${localStorage.productId}' and info.deleted=1)`
                console.log(SQL)
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        console.log('查询失败')
                    } else {
                        console.log('查询成功', res)
                        this.$db.all(iokSQl, (err, resA) => {
                            if (err) {
                                console.log('查询失败')
                            } else {
                                console.log('查询成功', resA)
                                res.forEach((item, index) => {
                                    this.$set(item, 'temponTit', item.title_msg) //展示的描述
                                    this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                                    if (item.withdraw_date) {
                                        let thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                        let time = new Date(thisTime).getTime();//将时间改为时间戳
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

                                /*获取前置背板数据*/
                                this.backplane = [];
                                for (let i = 0; i < res.length; i++) {
                                    let iokId = '', iokSum = 0
                                    resA.forEach(it => {
                                        if (res[i].id == it.backplane_id) {
                                            iokId = it.iocard_id //iok的id
                                            iokSum = it.iocard_cnt //iok的数量
                                        }
                                    })
                                    this.backplane.push({
                                        id: res[i].id,
                                        name: res[i].description,
                                        en: res[i].description_en,
                                        tiem: res[i].time,
                                        setTimeMe: res[i].withdraw_date,
                                        overdueTime: res[i].overdueTime,
                                        temponTit: res[i].temponTit,
                                        uiStatusEn: res[i].uiStatusEn,
                                        uiStatus: res[i].uiStatus,
                                        cuntU: res[i].disc_cnt_u,
                                        cuntS: res[i].disc_cnt_s,
                                        iokId: iokId,
                                        iokSum: iokSum
                                    })


                                    console.log(this.backplane)
                                    this.backplane.forEach((item,index)=>{
                                        console.log(item)

                                        if(item.id == this.frontHardDiskData){

                                    /*        if(item.cuntS != null){

                                            }else{
                                                this.num = item.cuntU;
                                            }
*/
                                            this.num = item.cuntS + item.cuntU;
                                            this.cuntS = item.cuntS;
                                            this.cuntU = item.cuntU;
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
                this.$refs.FrontHardDisk.getSystem(true);
            },

            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'warning'
                });
            },
        },

        /*-------------------------------------进入页面 获取背板数据--------------------------------------------*/

        created() {
            console.log(this.signT)
            /*获取所有背板数据*/
            const SQL = `select detail.id detail_id,back.id back_id,info.description,info.description_en,detail.component_count from product_programme_detail detail
join component_backplane back on back.category_id = detail.category_id and back.id=detail.component_id
join component_base_info info on info.id=back.base_info_id and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
            console.log(SQL)
            this.$db.get(SQL, (err, res) => {
                if (err) {

                } else {

                    console.log(res)
                    this.frontHardDiskData = res.back_id;
                    this.orgBackplaneId = res.back_id;
                    this.frontHardDiskDataBei = res.back_id;
                    this.frontBackplateId = res.detail_id;

                    /*背板带出的线缆*/
                    const Other = `select detail.id from relation_backplane_iocard rbi
join component_backplane back on back.id = rbi.backplane_id
join component_iocard io on io.id=rbi.iocard_id
join component_base_info info on info.id=io.base_info_id
join product_programme_detail detail on detail.category_id=io.category_id and detail.component_id=io.id
where info.deleted=1 and info.productId=2 and back.id=${res.back_id}`

                    console.log(Other)
                    this.$db.get(Other, (err, ress) => {
                        if (err) {

                        } else {
                            console.log(ress)
                            if (ress) {
                                this.ioCardId = ress.id;
                            }
                        }
                    })

                    /*背板带出的IO卡*/
                    const IoCard = `select detail.id from relation_backplane_iocard rbi
join component_backplane back on back.id = rbi.backplane_id
join component_iocard io on io.id=rbi.iocard_id
join component_base_info info on info.id=io.base_info_id
join product_programme_detail detail on detail.category_id=io.category_id and detail.component_id=io.id
where info.deleted=1 and info.productId=2 and back.id=${res.back_id}`

                    console.log(IoCard)
                    this.$db.get(IoCard, (err, res) => {
                        if (err) {

                        } else {
                            console.log(res)
                            if (res) {
                                this.otherId = res.id;
                            }
                        }
                    })
                }
            })
            //查询ejrl的数据 好方便往库里存
            let ej0c = `select other.id,other.category_id from component_other other
		join component_base_info info on info.id=other.base_info_id
		where info.productId='${localStorage.productId}' and info.component_FC='EJRL'`
            this.$db.get(ej0c, (err, res) => {
                if (err) {
                    console.log('获取ej0c数据失败')
                }
                console.log('获取ej0c的数据成功', res)
                this.ej0c = {categoryId: res.category_id, componentId: res.id}
            })
        },

        /* 获取component_category 表中id */
        beforeRouteEnter(from, to, next) {

            next(vm => {
                vm.$emit('comup', from.query.id)
                // 硬盘id
                vm.sign = from.query.sign;
                // 背板id
                vm.signT = from.query.signT;
                console.log(vm.sign, vm.signT)
                vm.getBackplane();
                //查询库里有没有ejrj数据有附上id 没有则为空
                let EJRL = `select detail.id from product_programme_detail detail
		join component_other other on other.id=detail.component_id and other.category_id=detail.category_id
		join component_base_info info on info.id=other.base_info_id
		where detail.product_id='${localStorage.productId}' and info.component_FC='EJRL' and detail.template_id='${localStorage.templateId}' and detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}'`
                vm.$db.get(EJRL, (err, res) => {
                    console.log('ej0c的查询', res)
                    if (res) {
                        vm.EJRLId = res.id
                    } else {
                        vm.EJRLId = ''
                    }
                })
            })
        },
    }
</script>

<style scoped lang="scss">

    /*----------------------表单项--------------------------*/

    .config {
        margin-top: 20px;
        margin-left: 20px;

        .icon {
            font-size: 25px;
            text-align: center;
            height: 50px;
            display: inline-block;
        }

        .el-input {
            width: 80px;
            margin-right: 20px;
        }

        .el-select {
            width: 400px;
        }

        .title {
            width: 98%;
            background: #f2f2f2;
            padding: 5px;
            margin-bottom: 10px;
        }

        .add-cables {
            padding: 10px;
            font-size: 14px;

        }

        .delete-btn {
            margin-left: 20px;
        }

        .tips {
            display: inline-block;
            padding: 10px 0;
        }
    }

    /*----------其他select修改宽度----------------*/
    .other .config .el-select {
        width: 100px;
    }

    .other .config .other-select-two {
        width: 400px;
        margin-left: 30px;
    }

    .config .other-select-one {
        width: 100px;
    }

    .cable {
        margin-top: 20px;
    }

    .modify {
        margin: 40px 0;
    }

    .delete-data {
        margin-left: 20px;
    }
</style>
