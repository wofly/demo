<template>
    <!--中置硬盘-->
    <div class="other">
        <div class="config">
            <p class="title content-label">
                <span class="config-title">{{$t('backPlane.infixInternalDisk.title')}}</span>
            </p>
            <div class="modify for-main">
                <div v-for="(ite,ind) in addHardDisk" :key="ind">
                    <el-select size="mini" v-model="middleHardDiskType" placeholder="请选择" class="sel" disabled="disabled"
                        @change="checkClear(ind)">
                        <el-option v-for="item in typeHardDisk" :key="item.key" :label="item.value"
                                   :value="item.key" >
                        </el-option>
                    </el-select>
                    <el-select size="mini" v-model="ite.middleHardDisk" placeholder="请选择" class="other-select-two" disabled="disabled"
                                @change="storageHardDiskData(ite.middleHardDisk,1,ind)">
                        <el-option v-for="item in ite.hardDiskSelection" :key="item.id" :label="item.value"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                    <p class="icon">*</p>
                    <el-select size="mini" v-model="ite.middleHardDisknum" placeholder="请选择" class="sel" disabled="disabled"
                               @change="storageHardDiskData(ite.middleHardDisk,ite.middleHardDisknum,ind)"
                               @visible-change="storageHardDiskData(ite.middleHardDisk,ite.middleHardDisknum,ind)">
                        <el-option v-for="item in ite.diskDataQuantity" :key="item" :label="item"
                                   :value="item">
                        </el-option>
                    </el-select>
                </div>
                <br>
                <span v-if="hardDisksVolume!=''" class="tips">{{$t('backPlane.infixInternalDisk.title')}}{{hardDisksVolume}}GB</span>
                <br>
                <el-button size="mini" icon="el-icon-plus" disabled="disabled"></el-button>
                <span class="add-cables" >{{$t('backPlane.infixInternalDisk.title')}}</span>
                <br>
                <span class="tips">{{$t('backPlane.infixInternalDisk.content2')}}：{{num}} / 2</span>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 中置硬盘
     *
     * @date 2019/08/28
     * @author yuwenqiang
     */
    export default {
        name: "MiddleHardDisk",
        props:['backplaneData'],
        data(){
            return{
                addHardDisk:[{
                    // 硬盘型号 v-model
                    middleHardDisk:'',
                    // 硬盘数量 v-model
                    middleHardDisknum:'',
                    // 硬盘型号 获取下拉数据
                    hardDiskSelection:[],
                    // 硬盘数量 获取下拉数据
                    diskDataQuantity:2,
                }],
                // 硬盘类型 v-model
                middleHardDiskType:'',
                // 硬盘类型 获取下拉数据
                typeHardDisk:[],
                // 硬盘容量
                hardDisksVolume:'',
                // 硬盘id
                middleId:'',
                // 已用插槽数
                num:0
            }
        },
        methods:{
            /*校验 如果背板没有选中 不可选硬盘*/
            checkClear(index,flag){
                // flag  从父组件传标识，背板id为0时，清空硬盘
                if(this.backplaneData == 0||flag == 1){
                    this.middleHardDiskType = '';
                    this.addHardDisk[index].middleHardDisk = '';
                    this.addHardDisk[index].middleHardDisknum = '';
                    return false
                }
            },

            /*硬盘类型 下拉获取*/
            getHardDiskType() {
                this.typeHardDisk = [];
                const SQL = `SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id
                where cd.id in(select disk_id from backplane_disk where backplane_id=9)`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        let obj = {}
                        for (let i = 0; i < res.length; i++) {
                            /*硬盘类型*/
                            if (res[i].disc_type === 3) {
                                obj = {value: 'M.2', key: 3};
                            }
                        }
                        this.typeHardDisk.push(obj);
                    }
                })
            },

            /*硬盘型号  下拉获取*/
            getHardDiskModel(index) {
                this.addHardDisk[index].hardDiskSelection = [];
                const SQL = `select info.description disk_des,info.description_en,disk.id,info.status from component_disk disk left join
                component_base_info info on
                info.id=disk.base_info_id where disk.disc_type in(
                SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where cd.id in
                (select disk_id from backplane_disk where backplane_id=9))`;
                console.log(SQL)
                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        for (let i = 0; i < res.length; i++) {
                            this.addHardDisk[index].hardDiskSelection.push({value: res[i].disk_des, id: res[i].id});
                        }
                    }
                })
            },

            /*往数据库里插入已选数据*/
            storageHardDiskData(id, num,ind) {
                console.log(this.backplaneData)
                if(this.backplaneData == 0){
                    this.middleHardDiskType = '';
                    this.addHardDisk[ind].middleHardDisk = '';
                    this.addHardDisk[ind].middleHardDisknum = '';
                    return false;
                }

                if(id == 25){
                    if (this.middleId) {
                        const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                            ${id}',template_id = '${localStorage.templateId}',machine_id='${localStorage.machineId}' where id=${this.middleId}`
                        this.$db.run(updateSql, (err, res) => {
                            if (res) {
                                console.log("修改失败")
                            } else {
                                console.log("修改成功")
                            }
                        })
                    } else {
                        let time = new Date().getTime();
                        const SQL = `INSERT INTO product_programme_detail
                ('product_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','machine_id')
                VALUES(1,1,'${id}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
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
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: '系统错误',
                                                desc: err,
                                            });
                                            return
                                        }
                                        this.middleId = res.id;
                                    })
                                }
                            }
                        })
                    }
                }else{
                    // 当选中的id为0的 情况下  删除之前已插入的数据
                    const SQLDel = `DELETE FROM product_programme_detail WHERE id
                    in(${this.middleId},'${localStorage.machineId}')`;
                    console.log(SQLDel)
                    this.$db.run(SQLDel, (err, res) => {
                        if (err) {

                        } else {
                            this.middleId = '';
                        }
                    })
                }

                /*获取硬盘数量 、硬盘描述*/
                this.getHardDiskData(id, num,ind);
            },

            /*获取硬盘数量 、硬盘描述*/
            getHardDiskData(id, num,ind) {
                const SQL = `select * from component_disk where id=25`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        let num = 0;
                        /*硬盘容量*/
                        this.hardDisksVolume = res[0].capacity * this.addHardDisk[ind].middleHardDisknum;
                        num += this.addHardDisk[ind].middleHardDisknum;
                        this.num = num;
                    }
                })
            },
        },

        created() {
            /*获取所有背板数据*/
            const SQL = ` select * from product_programme_detail where
            category_id=1 and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}' and component_id=25`
            console.log(SQL)
            this.$db.all(SQL, (err, res) => {
                if (err) {

                } else {
                    if(res.length>0){
                        res.forEach((item,index)=>{
                            this.addHardDisk[index].middleHardDisk = item.component_id;
                            this.addHardDisk[index].middleHardDisknum = item.component_count;
                            this.num = item.component_count;
                            this.middleId = item.id;
                            this.middleHardDiskType = 3;
                        })
                    }
                }
            })
        },
        mounted() {
            /*硬盘类型 下拉获取*/
            this.getHardDiskType();
            /*硬盘型号  下拉获取*/
            this.getHardDiskModel(0);
        }
    }


</script>

<style scoped>


</style>
