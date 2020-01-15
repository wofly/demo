<template>
    <div>
        <!-------------------------------------硬盘扩展柜-------------------------------------------------------------->
        <div class="config">
            <p class="title content-label">
                <span class="config-title">{{$t('ExternalHardDiskExpansion.HardDiskExpansionCabinet')}}</span>
            </p>
            <div class="disk-expansion modify for-main">
                <div :key="index" v-for="(item,index) in addExpansion">
                    <el-select ref="ev"
                               @change="expansionBtn(null,item.expansionTypeModel,index,item.expansionNumModel,item.modeModel)"
                               @visible-change="expansionChange($event,index,item.expansionTypeModel)"
                               class="expansion expansion-margin"
                               :placeholder="$store.state.info_language?'please choose':'请选择'" size="mini"
                               v-model="item.expansionTypeModel">
                        <el-option :key="ind" :label="$store.state.info_language?ite.description_en:ite.description"
                                   :value="ite.id" class="expansion-input"
                                   v-for="(ite,ind) in item.expansionType">
                        </el-option>
                    </el-select>


                    <el-select @change="modeBtn(item.modeModel,index,item.expansionNumModel,0)"
                               @visible-change="modeBtnChange($event,index,item.modeModel,item.expansionTypeModel)"
                               class="expansion" :placeholder="$store.state.info_language?'please choose':'请选择'"
                               size="mini"
                               v-show="expansionShow == 0" v-model="item.modeModel">
                        <el-option :key="ind" :label="$store.state.info_language?ite.description_en:ite.description_en"
                                   :value="ite.id" class="expansion-input"
                                   v-for="(ite,ind) in item.modeData">
                        </el-option>
                    </el-select>


                    <p class="icon" v-show="expansionShow == 0">*</p>
                    <el-select @change="modeBtn(item.modeModel,index,item.expansionNumModel,1)"
                               @visible-change="getExpansionNum($event,index,item.expansionTypeModel)" class="sel"
                               :placeholder="$store.state.info_language?'please choose':'请选择'"
                               size="mini"
                               v-show="expansionShow == 0"
                               v-model="item.expansionNumModel">
                        <!--;changeNum(item.expansionTypeModel,index,item.expansionNumModel)-->
                        <el-option :key="ind" :label="ite" :value="ite"
                                   v-for="(ite,ind) in item.expansionNum">
                        </el-option>
                    </el-select>
                    <el-button @click="expansionBtn($event,0,index,item.expansionNumModel,item.modeModel)" circle
                               class="dele" icon="el-icon-close" size="mini" v-show="expansionShow == 0"
                               type="info"></el-button>
                    <div v-for="dl in item.expansionType" v-if="item.expansionTypeModel==dl.id" :key="dl.language">
                        <div class="pdiv" v-if="dl.temponTit!=null">
                            {{dl.temponTit}}
                        </div>
                        <div class="pdiv red-a" v-if="dl.uiStatus">
                            {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                        </div>
                        <div class="pdiv" v-if="dl.setTimeMe">
                            此部件将于&lt; {{dl.setTimeMe}}&gt; 停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                        </div>
                    </div>
                    <br>
                    <div v-show="expansionShow == 0">
                        <el-button :disabled="disabled"
                                   @click="addExpansionData(item.expansionTypeModel,item.modeModel,item.expansionNumModel,index)"
                                   icon="el-icon-plus" size="mini" v-if="index ==addExpansion.length-1"></el-button>
                        <span class="add-cables" v-if="index ==addExpansion.length-1">{{$t('ExternalHardDiskExpansion.IncreaseTheHardDiskCabinet')}}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-----------------------------------------硬盘扩展柜 线缆-------------------------------------------------->
        <div class="config" v-show="expansionShow == 0">
            <p class="title content-label">
                <span class="config-title">{{$t('ExternalHardDiskExpansion.HardDiskExtensionCabinetCable')}}</span>
            </p>
            <div class="modify for-main">
                <el-select @change="cableBtn(1,2,cableModel)" class="cable"
                           :placeholder="$store.state.info_language?'please choose':'请选择'" size="mini"
                           v-model="cableModel">
                    <el-option :key="ind" :label="ite.description_en" :value="ite.id"
                               v-for="(ite,ind) in cableData">
                    </el-option>
                </el-select>
                <p class="icon">*</p>
                <el-select @change="cableBtn(1,cableNumModel,cableModel)" class="sel"
                           :placeholder="$store.state.info_language?'please choose':'请选择'" size="mini"
                           v-model="cableNumModel">
                    <el-option :key="ind" :label="ite" :value="ite" v-for="(ite,ind) in cableNum"
                               v-if="ind>=num*2-1">
                    </el-option>
                </el-select>
                <div v-for="dl in cableData" v-if="cableModel==dl.id" :key="dl.language">
                    <div class="pdiv" v-if="dl.temponTit!=null">
                        {{dl.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="dl.uiStatus">
                        {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="dl.setTimeMe">
                        此部件将于&lt; {{dl.setTimeMe}}&gt; 停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                    </div>
                </div>

                <br>
                <div v-show="!cableModel">
                    <el-button icon="el-icon-plus" size="mini"></el-button>
                    <span class="add-cables">{{$t('Power.lists.PowerLine.content1')}}</span>
                </div>
            </div>
        </div>

        <!------------------------------------------------扩展柜硬盘-------------------------------------------------->
        <ExternalHardDiskExpansion :diskCount="diskCount" :diskCountCard="diskCountCard" :addExpansion="addExpansion"
                                   ref="mychild"
                                   v-show="expansionShow == 0"></ExternalHardDiskExpansion>

    </div>
</template>

<script>
    /**
     * 外部硬盘（扩展柜）
     *
     * @date 2019/10/11
     * @author yuwenqiang
     */

    /*引入外部扩展柜*/
    import ExternalHardDiskExpansion from './ExternalHardDiskExpansion.vue';
    import JQ from 'jquery';

    export default {
        name: "ExternalHardDisk",
        components: {
            ExternalHardDiskExpansion,
        },
        data() {
            return {
                /*-------------硬盘扩展柜-----------*/
                // 硬盘扩展柜 外部循环数组
                addExpansion: [],
                // 储存已选中的扩展柜
                array: [],
                // 储存已选中的modeid
                changeId: [],
                // 获取扩展柜 最大数量
                sumExpansionNum: '',
                // 获取 CPU 数量
                cpu: 0,
                // 储存 内部SAS 卡id
                sasId: '',
                // 储存 外部SAS 卡id
                sasIds: '',
                // 储存 内部连接线 id
                connectingLineId: '',
                connectingLine: '',
                // 储存 外部连接线 id
                connectingLineIds: '',
                connectingLines: '',
                // 获取外部io扩展柜 连接卡
                ioCard: 0,
                // 获取 扩展柜 已选的总数量
                num: 0,
                // 储存已选中mode数据
                list: [],
                // 机器内 和机器外 mode数量
                pcieNum: 0,
                pcieNumber: 0,
                // 机器内 和机器外 插槽数
                pcieNumS: 0,
                pcieNumberS: 0,
                // 计算24硬盘最大数量
                diskCount: '',
                // 计算12盘最大数量
                diskCountCard: '',
                // 储存 SAS 卡数量
                sasNum: 0,
                // 内部使用插槽
                numPcie: 0,
                // 外部使用插槽
                sumPcie: 0,
                /*外部 上次选中mode 插槽数*/
                orgExternalNum: 0,
                /*内部 上次选中mode 插槽数*/
                orgInsideNum: 0,
                /*上次 选中的mode 内外部 is_expansion*/
                orgInside: '',
                orgExternal: '',
                orgInsideNums: '',
                orgExternalNums: '',
                externalExpansion: '',
                insideExpansion: '',
                // 获取 内部使用插槽
                sasSum: 0,
                // 获取 外部使用插槽
                sasSumNum: 0,
                // 获取 内部mode使用插槽
                modeSum: 0,
                // 获取 外部mode使用插槽
                modeSumNum: 0,
                // 扩展柜添加按钮 禁用
                disabled: false,
                // 获取 是否渲染硬盘数据 状态
                // acquisitionState:true,
                // 当扩展柜 id为0 index为0 隐藏
                expansionShow: 1,
                // 获取 扩展柜 下拉 数据 判断 隐藏
                selectModeData: [],
                // 存储 扩展柜 1    扩展柜 2 数据
                mode1: [],
                mode2: [],
                /*-------------硬盘扩展柜线缆-----------*/
                // 扩展柜线缆v-model
                cableModel: '',
                // 添加电源线id
                cordId: '',
                // 获取扩展柜线缆数据
                cableData: [],
                // 扩展柜线缆数量v-model
                cableNumModel: '',
                // 获取扩展柜线缆数量
                cableNum: '',
                // 获取已选中的线缆id
                cableId: '',
                // 扩展柜是否被占用标识
                beTakeUp: false,
                // 切换之前的扩展柜
                origExpansion: null,
                /*-------------假数据----------------*/
                // mode 数据
                modeData: [
                    {
                        mode: '请选择',
                        id: 0,
                        description_en: 'please choose'
                    }
                ],
            }
        },
        methods: {

            /*---------------------------------硬盘扩展柜-------------------------------------------------------------*/
            /*插入已选中的扩展柜数据*/
            async expansionBtn(e, id, index, num, modeId) {
                console.log(e, id, index, num, modeId)
                if (index > 0) {
                    /*获取扩展柜数量*/
                    this.getExpansionNum(true, index - 1, id);
                }

                /*当展示页面时  添加数据*/
                if (id != 0) {
                    /*当展示页面时  添加数据*/
                    this.expansionShow = 0;
                    /*添加最低配线缆*/
                    this.cableBtn(id, 2);
                    /*添加电源线*/
                    this.powerCord(1, 1)
                }

                /*通过扩展柜id  获取可以适用的电源线*/
                this.getCableData(id);

                /*获取 mode 内部 外部 使用 数量 */
                await this.getMode(modeId);

                /*硬盘 和扩展柜 拦截*/
                if (this.addExpansion[index].expansionCabinetId != 0) {
                    this.canDeleteDisk(index, 0);
                }

                if (this.addExpansion[index].bool) {
                    this.addExpansion[index].expansionTypeModel = this.addExpansion[index].expansionCabinetId;
                    //console.log('我就是最后一个')扩展柜被占用
                    this.err(this.$t('error.occupied'))
                    return false;
                }

                /* 获取  12盘 24盘 的硬盘值*/
                this.addExpansion.forEach(item => {
                    item.expansionType.forEach(it => {
                        console.log(it)
                        if (item.expansionTypeModel == it.id) {
                            item.diskCount = it.disk_count
                        }

                    })
                })

                /*计算最大背板值*/
                this.getDiskCount();

                /*获取扩展柜mode数据*/
                this.getModeData(id, index);

                /*当 id为0  index 为0 隐藏input*/
                if (id == 0) {
                    localStorage.setItem('externalCapacity', 0);
                    if (index == 0 && this.addExpansion.length == 1) {
                        /*将页面进行隐藏*/
                        this.expansionShow = 1;

                        /*当隐藏页面时  删除数据*/
                        const deleteSQL = `DELETE FROM product_programme_detail WHERE id in('${this.cableId}','${this.cordId}')`
                        await new Promise((resolve, reject) => {
                            this.$db.run(deleteSQL, (err, res) => {
                                console.log('删除方法被调用了')
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '删除失败',
                                        desc: err,
                                    });
                                } else {
                                    console.log('删除成功')
                                    this.addExpansion[0].expansionTypeModel = 0;
                                    this.cableId = '';
                                    this.cordId = '';


                                    /*---------------- 插入已选中的扩展柜数据----------------*/

                                    // 当选中的id为0的 情况下  删除之前已插入的数据
                                    const SQLDel = `DELETE FROM product_programme_detail WHERE id in('${this.addExpansion[index].modeId}','${this.addExpansion[index].modeIds}')`;
                                    new Promise((resolve, reject) => {
                                        this.$db.run(SQLDel, (err, res) => {
                                            if (err) {
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '删除失败',
                                                    desc: err,
                                                });
                                            } else {

                                                /* 有 mode 卡数计算*/
                                                if (this.addExpansion[index].modeNumber) {
                                                    /*计算最大背板值*/
                                                    this.getDiskCount();
                                                    /*通过modeId 获取 对应的连接线*/
                                                    this.getConnectingLine(-this.modeSum * 2, -this.modeSumNum * 2, modeId);
                                                    /*通过modeId 获取 对应的SAS卡*/
                                                    this.getSAS(-this.modeSum * this.addExpansion[index].modeNumber, -this.modeSumNum * this.addExpansion[index].modeNumber, modeId);
                                                    /*添加扩展柜的数量*/
                                                    this.changeNum(-this.modeSum, -this.modeSumNum, modeId);
                                                }
                                                /* 当 id为0 时，删除 当前数据*/
                                                if (this.addExpansion.length > 1) {

                                                    if (id == 0) {
                                                        this.addExpansion.splice(index, 1);
                                                        /*计算最大背板值*/
                                                        this.getDiskCount();
                                                    }

                                                } else {
                                                    this.addExpansion[0].expansionTypeModel = 0;
                                                    this.addExpansion[0].modeModel = '请选择';
                                                    this.addExpansion[0].expansionNumModel = '';
                                                    this.cableNumModel = '';
                                                }
                                                this.changeId.splice(index, 1)

                                            }
                                        })
                                    })
                                }
                            })
                        })
                    }


                    /*---------------- 插入已选中的扩展柜数据----------------*/

                    // 当选中的id为0的 情况下  删除之前已插入的数据
                    const SQLDel = `DELETE FROM product_programme_detail WHERE id in('${this.addExpansion[index].modeId}','${this.addExpansion[index].modeIds}')`;
                    new Promise((resolve, reject) => {
                        this.$db.run(SQLDel, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '删除失败',
                                    desc: err,
                                });
                            } else {

                                /* 有 mode 卡数计算*/
                                if (this.addExpansion[index].modeNumber) {
                                    /*计算最大背板值*/
                                    this.getDiskCount();
                                    /*通过modeId 获取 对应的连接线*/
                                    this.getConnectingLine(-this.modeSum * 2, -this.modeSumNum * 2, modeId);
                                    /*通过modeId 获取 对应的SAS卡*/
                                    this.getSAS(-this.modeSum * this.addExpansion[index].modeNumber, -this.modeSumNum * this.addExpansion[index].modeNumber, modeId);
                                    /*添加扩展柜的数量*/
                                    this.changeNum(-this.modeSum, -this.modeSumNum, modeId);
                                }
                                /* 当 id为0 时，删除 当前数据*/
                                if (this.addExpansion.length > 1) {

                                    if (id == 0) {
                                        this.addExpansion.splice(index, 1);
                                        /*计算最大背板值*/
                                        this.getDiskCount();
                                    }

                                } else {
                                    this.addExpansion[0].expansionTypeModel = 0;
                                    this.addExpansion[0].modeModel = '请选择';
                                    this.addExpansion[0].expansionNumModel = '';
                                    this.cableNumModel = '';
                                }
                                this.changeId.splice(index, 1)

                                /*点击 获取 扩展柜硬盘数据*/
                                this.getDiskData();

                            }
                        })
                    })
                }

                /*---------------- 插入已选中的扩展柜数据----------------*/

                if (id != 0) {

                    // 进入 方法 清空 mode 和数量
                    this.addExpansion[index].modeModel == '请选择';
                    this.addExpansion[index].expansionNumModel = '';
                    this.addExpansion[index].modeModelNum = ''

                    // 当选中的id为0的 情况下  删除之前已插入的数据
                    const SQLDel = `DELETE FROM product_programme_detail WHERE id in('${this.addExpansion[index].modeId}','${this.addExpansion[index].modeIds}')`;
                    await this.$db.run(SQLDel, (err, res) => {
                        if (err) {
                            console.log('删除失败')
                        } else {

                            /*计算最大背板值*/
                            this.getDiskCount();

                            /*删除后 清空 mode 和数量*/
                            this.addExpansion[index].modeId = '';
                            this.addExpansion[index].modeIds = '';

                            if (this.addExpansion[index].modeNumber) {
                                /*通过modeId 获取 对应的连接线*/
                                this.getConnectingLine(-this.modeSum * 2, -this.modeSumNum * 2, modeId);
                                /*通过modeId 获取 对应的SAS卡*/
                                this.getSAS(-this.modeSum * this.addExpansion[index].modeNumber, -this.modeSumNum * this.addExpansion[index].modeNumber, modeId);
                                /*添加扩展柜的数量*/
                                this.changeNum(-this.modeSum, -this.modeSumNum, modeId);
                            }

                            this.changeId.splice(index, 1)
                            console.log(this.changeId)
                            /* 当 id为0 时，删除 当前数据*/
                            if (this.addExpansion.length < 2) {
                                this.addExpansion[0].modeModel = '';
                                this.addExpansion[0].expansionNumModel = ''
                            }

                            /*点击 获取 扩展柜硬盘数据*/
                            this.getDiskData();
                        }
                    })
                }
                /* id 进行赋值*/
                this.addExpansion[index].expansionCabinetId = id;
            },

            /*点击 获取 扩展柜硬盘数据*/
            /* 24盘 和 12 盘 带出的 硬盘 不同  通过DiskCount 来判断是否调用 哪个盘的 硬盘数据 */
            getDiskData() {
                let num = -1;
                let nums = -1;

                this.addExpansion.forEach(item => {
                    if (item.diskCount == 24) {
                        nums = 1
                    }

                    if (item.diskCount == 12) {
                        num = 0
                    }
                })
                /*调用 硬盘 数据*/
                this.$refs.mychild.getDataList(nums);
                /*调用 硬盘 数据*/
                this.$refs.mychild.getDataListCard(num);
            },

            /*不让删除或者是不让减少时展示*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'error'
                });
            },

            // 判断扩展柜是否被占用如果占用不能删除且不能修改
            canDeleteDisk(index, bool) {
                console.log(this.addExpansion[index], this.addExpansion[index].bool)
                let num = 0
                let nun = 0
                this.addExpansion.forEach((item, ind) => {
                    if (index == ind && bool) {
                        return
                    }
                    if (this.addExpansion[index].expansionCabinetId == item.expansionTypeModel) {
                        num += item.expansionNumModel * item.diskCount
                    }
                })
                console.log(this.$refs.mychild.addHardDisk, this.$refs.mychild.addHardDiskCard)
                if (this.addExpansion[index].diskCount == 24) {
                    this.$refs.mychild.addHardDisk.forEach((item, ind) => {
                        nun += item.hardDiskNumModel
                    })
                }
                if (this.addExpansion[index].diskCount == 12) {
                    this.$refs.mychild.addHardDiskCard.forEach((item, ind) => {
                        nun += item.hardDiskNumModelCard
                    })
                }
                if (num >= nun) {
                    this.addExpansion[index].bool = false
                } else {
                    this.addExpansion[index].bool = true
                }
                console.log(num, nun, this.addExpansion[index].bool)
            },

            /*计算 硬盘最大插槽数*/
            getDiskCount() {
                this.diskCount = 0;
                this.diskCountCard = 0;
                let diskCount = 0;
                let diskCountNum = 0;
                console.log(this.addExpansion)
                this.addExpansion.forEach(item => {

                    if (item.diskCount == 24) {
                        diskCount += item.diskCount;
                    }
                    if (item.diskCount == 12) {
                        diskCountNum += item.diskCount;
                    }

                })

                this.diskCount = parseInt(diskCount);
                this.diskCountCard = parseInt(diskCountNum);
                console.log(this.diskCount, this.diskCountCard)
            },

            /*插入已选中的model数据*/
            async modeBtn(modeId, index, num, flag) {
                /*硬盘 和扩展柜 拦截*/
                if (flag != 0) {
                    if (this.addExpansion[index].expansionCabinetId != 0) {
                        this.canDeleteDisk(index, 0);
                    }
                    if (this.addExpansion[index].bool) {
                        this.addExpansion[index].expansionNumModel = this.addExpansion[index].modeModelNum;
                        //console.log('我就是最后一个')
                        this.err(this.$t('error.occupied'))
                        //'扩展柜被占用'
                        return false;
                    }
                    this.diskCount = 0;
                    this.diskCountCard = 0;
                    let diskCount = 0;
                    let diskCountNum = 0;
                    this.addExpansion.forEach(item => {

                        if (item.diskCount == 24) {
                            diskCount += item.diskCount * item.expansionNumModel;
                        }

                        if (item.diskCount == 12) {
                            diskCountNum += item.diskCount * item.expansionNumModel;
                        }
                    })

                    this.diskCount = diskCount;
                    this.diskCountCard = diskCountNum;
                }
                /*当扩展柜是 请选择状态时   return*/
                if (this.addExpansion[0].expansionTypeModel == 0) {
                    this.addExpansion[0].modeModel = '请选择'
                    return false;
                }

                /* 当 扩展柜 或 mode 状态 都为 请选择  return*/
                if (this.addExpansion[0].modeModel == '请选择') {
                    this.addExpansion[0].expansionNumModel = ''
                }

                if (modeId != '请选择') {

                    if (flag == 0) {
                        // if(this.addExpansion[index].expansionCabinetId!=0){
                        //     this.canDeleteDisk(index,1);
                        // }
                        // if(this.addExpansion[index].bool){
                        //     this.addExpansion[index].modeModel = this.addExpansion[index].modeModelId;
                        //     console.log('我就是最后一个')
                        //     this.err('扩展柜被占用')
                        //     return false;
                        // }
                        /*获取 mode 对应的 卡数*/
                        await this.modeCardNumber(modeId, index, num);

                        /*获取 上一次 选中的mode 插槽数*/
                        await this.getSelectMode(this.addExpansion[index].modeModelId, index);

                        /*内部剩余mode 数量*/
                        let orgNum = parseInt((this.pcieNumS + this.orgInsideNum) / this.addExpansion[index].modeNumber);
                        /*外部剩余mode 数量*/
                        let nowNum = parseInt((this.pcieNumberS + this.orgExternalNum) / this.addExpansion[index].modeNumber);
                        /*当前选中的数量*/
                        let selectNum = this.addExpansion[index].expansionNumModel;

                        console.log('内部剩余' + orgNum, '外部剩余' + nowNum, '当前选中数量' + selectNum)

                        if ((orgNum + nowNum) < selectNum) {
                            this.err(this.$t('error.InsufficientSlots'))
                            //'插槽数不够'
                            this.addExpansion[index].modeModel = this.addExpansion[index].modeModelId;
                            this.addExpansion[index].modeNumber = this.addExpansion[index].orgModeNumber;
                            return false
                        }

                        /*修改 mode 更新*/
                        this.changeMode(modeId, index, num, orgNum, nowNum, selectNum);

                    } else {
                        /*num 不可为空*/
                        if (num == '') {
                            return false;
                        }
                        /*获取 已使用的插槽数 */
                        await this.getpcieNei();
                        /*获取 已使用的mode数 */
                        await this.getMode(modeId);
                        /*通过时间戳找id*/
                        let time = new Date().getTime();
                        let insidePcie = 0;
                        let externalPcie = 0;
                        console.log(this.addExpansion[index].modeNumber)
                        if (this.cpu == 1) {
                            /*CPU 1 内部剩余扩展柜数量*/
                            insidePcie = parseInt((8 - this.numPcie) / this.addExpansion[index].modeNumber);
                            externalPcie = parseInt((this.ioCard * 6 - this.sumPcie) / this.addExpansion[index].modeNumber);
                        } else {
                            /*CPU 2 内部剩余扩展柜数量*/
                            insidePcie = parseInt((11 - this.numPcie) / this.addExpansion[index].modeNumber);
                            externalPcie = parseInt((this.ioCard * 6 - this.sumPcie) / this.addExpansion[index].modeNumber);
                        }
                        console.log(insidePcie)
                        console.log(externalPcie)
                        console.log(this.addExpansion[index].expansionNumModel);
                        console.log(this.addExpansion[index].modeModelNum);
                        console.log(this.addExpansion[index]);
                        /* 增加时  优先添加内部  */
                        /*当前数量   和  上次选的 数量相比   */
                        if (this.addExpansion[index].expansionNumModel > this.addExpansion[index].modeModelNum) {
                            /*获取数据库可用 内部扩展柜的数量 跟 num 对比 */
                            /*insidePcie 内部剩余扩展柜    externalPcie 外部剩余扩展柜  */

                            let pciNum = 0;
                            pciNum = this.addExpansion[index].expansionNumModel - this.addExpansion[index].modeModelNum;
                            console.log(this.addExpansion[index].expansionNumModel)
                            console.log(this.addExpansion[index].modeModelNum)
                            /*执行完毕后，数量相等*/
                            this.addExpansion[index].modeModelNum = this.addExpansion[index].expansionNumModel;

                            /*判断 内部id */
                            if (this.addExpansion[index].modeId) {
                                /*内部扩展柜 大*/
                                if (insidePcie >= pciNum) {
                                    const updateSql = `UPDATE product_programme_detail set component_count ='${num}' where category_id = 27 and id='${this.addExpansion[index].modeId}' and is_expansion= 1 and template_id = '${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                                    console.log(updateSql)
                                    this.$db.run(updateSql, (err, res) => {
                                        if (res) {
                                            console.log("修改失败")
                                        } else {
                                            console.log("修改成功")
                                            this.changeId[index] = modeId;
                                            /*通过modeId 获取 对应的连接线*/
                                            this.getConnectingLine(pciNum * 2, 0, modeId);
                                            /*通过modeId 获取 对应的SAS卡*/
                                            console.log()
                                            this.getSAS(pciNum * this.addExpansion[index].modeNumber, 0, modeId);
                                            /*添加扩展柜的数量*/
                                            this.changeNum(num, 0, modeId);
                                            console.log('内进1')
                                        }
                                    })
                                } else {
                                    /*当大于扩展柜内部时，先更改内部的数量*/
                                    const updateSql = `UPDATE product_programme_detail set component_count ='${insidePcie + this.modeSum}' where category_id = 27 and id='${this.addExpansion[index].modeId}' and is_expansion=1 and template_id = '${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                                    console.log(updateSql)
                                    this.$db.run(updateSql, (err, res) => {
                                        if (res) {
                                            console.log("修改失败")
                                        } else {
                                            console.log("修改成功")
                                            this.changeId[index] = modeId;
                                            console.log('内进2')
                                        }
                                    })
                                    /*计算 外部扩展柜 插入数量*/
                                    let nums = pciNum - insidePcie;
                                    /*通过modeId 获取 对应的SAS卡*/
                                    this.getSAS(insidePcie * this.addExpansion[index].modeNumber, nums * this.addExpansion[index].modeNumber, modeId)
                                    /*通过modeId 获取 对应的连接线 */
                                    this.getConnectingLine(insidePcie * 2, nums * 2, modeId);
                                    /*添加扩展柜的数量*/
                                    this.changeNum(insidePcie, nums, modeId);
                                    console.log(this.modeSum, this.modeSumNum);
                                    console.log(nums)
                                    /*判断 是否有外部 id  有修改 没有新增*/
                                    if (this.addExpansion[index].modeIds) {
                                        const update = `UPDATE product_programme_detail set component_count ='${nums + this.modeSumNum}' where id='${this.addExpansion[index].modeIds}'`
                                        this.$db.run(update, (err, res) => {
                                            if (res) {
                                                console.log("修改失败")
                                            } else {
                                                console.log("修改成功")

                                                this.changeId[index] = modeId;
                                                /*通过modeId 获取 对应的连接线 和SAS卡*/
                                                console.log('内进3')
                                            }
                                        })
                                    } else {
                                        /*新增 外部扩展柜 */
                                        const SQLs = `INSERT INTO product_programme_detail
                        (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','is_expansion','component_count')  VALUES('${localStorage.productId}','27',${modeId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',0,'${nums}')`;
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
                                                        this.addExpansion[index].modeIds = res.id;

                                                        this.changeId[index] = modeId;
                                                        console.log('内进4')
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            } else {

                                /*小于内部扩展柜的数量  直接插入内部 */
                                if (insidePcie >= pciNum) {
                                    let nums = pciNum - insidePcie;
                                    const SQL = `INSERT INTO product_programme_detail
                        (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','is_expansion','component_count')
                        VALUES('${localStorage.productId}','27',${modeId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',1,'${pciNum}')`;
                                    this.$db.run(SQL, (err, res) => {
                                        if (err) {
                                            console.log("添加失败")
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
                                                    this.addExpansion[index].modeId = res.id;
                                                    this.changeId[index] = modeId;
                                                    /*通过modeId 获取 对应的连接线 和SAS卡*/
                                                    this.getConnectingLine(pciNum * 2, 0, modeId);
                                                    /*通过modeId 获取 对应的SAS卡*/
                                                    this.getSAS(pciNum * this.addExpansion[index].modeNumber, 0, modeId);
                                                    /*添加扩展柜的数量*/
                                                    this.changeNum(pciNum, 0, modeId);
                                                    console.log('内进5')
                                                })
                                            }
                                        }
                                    })
                                } else {
                                    /*大于 内部扩展柜的数量 */
                                    if (insidePcie) {
                                        const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','is_expansion','component_count')
                    VALUES('${localStorage.productId}','27',${modeId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',1,'${insidePcie}') `;
                                        this.$db.run(SQL, (err, res) => {
                                            if (err) {

                                            } else {
                                                if (res) {
                                                    console.log("添加失败")
                                                } else {
                                                    console.log("添加成功" + JSON.stringify(res));
                                                    let selectSql = `select * from product_programme_detail where seq_Key=${time} and is_expansion=1 and product_id=${localStorage.productId}`
                                                    this.$db.get(selectSql, (err, res) => {
                                                        if (err) {
                                                            this.$logger(err);
                                                            this.$Notice.error({
                                                                title: '系统错误',
                                                                desc: err,
                                                            });
                                                            return
                                                        }
                                                        this.addExpansion[index].modeId = res.id;

                                                        this.changeId[index] = modeId;
                                                        /*通过modeId 获取 对应的连接线 和SAS卡*/
                                                        this.getConnectingLine(insidePcie * 2, 0, modeId);
                                                        /*通过modeId 获取 对应的SAS卡*/
                                                        this.getSAS(insidePcie * this.addExpansion[index].modeNumber, 0, modeId);
                                                        /*添加扩展柜的数量*/
                                                        this.changeNum(insidePcie, 0, modeId);
                                                        console.log('内进6')
                                                    })
                                                }
                                            }
                                        })

                                    }
                                    /*外部扩展柜 插入数量*/
                                    let nums = pciNum - insidePcie;
                                    /* 判断 外部 id 是否存在*/
                                    if (this.addExpansion[index].modeIds) {
                                        const update = `UPDATE product_programme_detail set component_count ='${nums + this.modeSumNum}' where category_id = 27 and id='${this.addExpansion[index].modeIds}' and is_expansion=0 and template_id = '${localStorage.templateId}' and machine_id='${localStorage.machineId}`
                                        this.$db.run(update, (err, res) => {
                                            if (res) {
                                                console.log("修改失败")
                                            } else {
                                                console.log("修改成功")
                                                this.changeId[index] = modeId;
                                                /*通过modeId 获取 对应的连接线 和SAS卡*/
                                                this.getConnectingLine(0, nums * 2, modeId);
                                                /*通过modeId 获取 对应的SAS卡*/
                                                this.getSAS(0, nums * this.addExpansion[index].modeNumber, modeId);
                                                /*添加扩展柜的数量*/
                                                this.changeNum(0, nums, modeId);
                                                console.log('内进7')
                                            }
                                        })
                                    } else {
                                        const SQLs = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','is_expansion','component_count')  VALUES('${localStorage.productId}','27',${modeId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',0,'${nums}')`;

                                        this.$db.run(SQLs, (err, res) => {
                                            if (err) {

                                            } else {
                                                if (res) {
                                                    console.log("添加失败")
                                                } else {
                                                    console.log("添加成功" + JSON.stringify(res));
                                                    let selectSql = `select * from product_programme_detail where seq_Key=${time} and is_expansion=0 and product_id=${localStorage.productId}`
                                                    this.$db.get(selectSql, (err, res) => {
                                                        if (err) {
                                                            this.$logger(err);
                                                            this.$Notice.error({
                                                                title: '系统错误',
                                                                desc: err,
                                                            });
                                                            return
                                                        }
                                                        this.addExpansion[index].modeIds = res.id;
                                                        this.changeId[index] = modeId;
                                                        /*通过modeId 获取 对应的连接线 和SAS卡*/
                                                        this.getConnectingLine(0, nums * 2, modeId);
                                                        /*通过modeId 获取 对应的SAS卡*/
                                                        this.getSAS(0, nums * this.addExpansion[index].modeNumber, modeId);
                                                        /*添加扩展柜的数量*/
                                                        this.changeNum(0, nums, modeId);
                                                        console.log('内进8')
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        } else {
                            /*获取数据库可用  外部扩展柜的数量 跟 num 对比 */
                            /*insidePcie 内部剩余扩展柜    externalPcie 外部剩余扩展柜  */
                            let pciNum = 0;
                            pciNum = this.addExpansion[index].modeModelNum - this.addExpansion[index].expansionNumModel;
                            /*执行完毕后，数量相等*/
                            this.addExpansion[index].modeModelNum = this.addExpansion[index].expansionNumModel;
                            console.log(pciNum, num, this.modeSumNum)
                            /*判断  外部id */
                            if (this.addExpansion[index].modeIds) {
                                /*内部扩展柜 大*/
                                let nums = this.modeSumNum - pciNum;
                                console.log(nums)
                                if (nums > 0) {
                                    const updateSql = `UPDATE product_programme_detail set component_count ='${nums}' where category_id = 27 and id='${this.addExpansion[index].modeIds}' and is_expansion= 0 and template_id = '${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                                    console.log(updateSql)
                                    this.$db.run(updateSql, (err, res) => {
                                        if (res) {
                                            console.log("修改失败")
                                        } else {
                                            console.log("修改成功")
                                            this.changeId[index] = modeId;
                                            /*通过modeId 获取 对应的连接线 和SAS卡*/
                                            this.getConnectingLine(0, pciNum * -2, modeId);
                                            /*通过modeId 获取 对应的SAS卡*/
                                            this.getSAS(0, -(pciNum * this.addExpansion[index].modeNumber), modeId);
                                            /*添加扩展柜的数量*/
                                            this.changeNum(0, -pciNum, modeId);
                                            console.log('外进1')
                                        }
                                    })
                                } else {
                                    const deleteSql = `delete from product_programme_detail where id = '${this.addExpansion[index].modeIds}'`
                                    console.log(deleteSql)
                                    this.$db.run(deleteSql, (err, res) => {
                                        if (res) {
                                            console.log("删除失败")
                                        } else {
                                            this.addExpansion[index].modeIds = ''
                                            console.log("删除成功")

                                            this.changeId.splice(index, 1);
                                            /*通过modeId 获取 对应的连接线 和SAS卡*/
                                            this.getConnectingLine(0, this.modeSumNum * -2, modeId);
                                            /*通过modeId 获取 对应的SAS卡*/
                                            this.getSAS(0, -this.modeSumNum * this.addExpansion[index].modeNumber, modeId);
                                            /*添加扩展柜的数量*/
                                            this.changeNum(0, -this.modeSumNum, modeId);
                                            // this.changeId[index] = modeId;
                                            console.log('外进2')
                                        }
                                    })

                                    /*当大于扩展柜内部时,nums为负数，才执行这个*/
                                    const updateSql = `UPDATE product_programme_detail set component_count ='${this.modeSum + nums}' where id='${this.addExpansion[index].modeId}'`
                                    console.log(updateSql)
                                    this.$db.run(updateSql, (err, res) => {
                                        if (res) {
                                            console.log("修改失败")
                                        } else {
                                            console.log("修改成功")
                                            this.changeId[index] = modeId;
                                            /*通过modeId 获取 对应的连接线 和SAS卡*/
                                            this.getConnectingLine(nums * 2, 0, modeId);
                                            /*通过modeId 获取 对应的SAS卡*/
                                            this.getSAS(nums * this.addExpansion[index].modeNumber, 0, modeId);
                                            /*添加扩展柜的数量*/
                                            this.changeNum(nums, 0, modeId);
                                            // this.changeId[index] = modeId;
                                            console.log('外进3')
                                        }
                                    })
                                }
                            } else {
                                /*insidePcie 外部扩展柜不存在时，直接删，因为不可能改为0  */
                                const updateSql = `UPDATE product_programme_detail set component_count ='${num}' where id='${this.addExpansion[index].modeId}'`
                                console.log(updateSql, num)
                                this.$db.run(updateSql, (err, res) => {
                                    if (res) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                        this.changeId[index] = modeId;
                                        this.getConnectingLine(pciNum * -2, 0, modeId);
                                        /*通过modeId 获取 对应的SAS卡*/
                                        this.getSAS(-pciNum * this.addExpansion[index].modeNumber, 0, modeId);
                                        /*添加扩展柜的数量*/
                                        this.changeNum(-pciNum, 0, modeId);
                                        // this.changeId[index] = modeId;
                                        console.log('外进3')
                                    }
                                })
                            }
                        }
                    }
                }
            },

            /*修改 mode 更新*/
            async changeMode(modeId, index, num, orgNum, nowNum, selectNum) {

                console.log(orgNum, nowNum, selectNum, num, modeId, this.addExpansion[index].modeId, this.addExpansion[index].modeModelId, this.addExpansion[index].modeModel)
                if (!num) {
                    return
                }

                /*通过时间戳找id*/
                let time = new Date().getTime();
                let nun = this.addExpansion[index].modeNumber
                if (orgNum) {

                    if (orgNum >= selectNum) {

                        if (this.addExpansion[index].modeId) {
                            /*mode 替换数据*/
                            const update = `update product_programme_detail set component_id = (select id from component_disk_modeoption where id = ${this.addExpansion[index].modeModel}
),component_count =${selectNum}
where component_id =(
select  id from component_disk_modeoption mode
where mode.id = ${this.addExpansion[index].modeModelId}
) and machine_id= ${localStorage.machineId} and is_expansion=1 and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId} and category_id = 27 `
                            console.log(update)
                            await new Promise((resolve, reject) => {
                                this.$db.run(update, (err, res) => {
                                    if (res) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                        this.changeId[index] = modeId;
                                        return resolve(1111)
                                    }
                                })
                                console.log('9832', '哈哈')
                            }).then(async () => {
                                await this.setSAS(num * nun, 1)
                                /*通过modeId 获取 对应的连接线 和SAS卡*/
                                console.log('mode1')
                                console.log(this.addExpansion[index].modeNumber * num - this.addExpansion[index].orgModeNumber * num)
                                await this.changeConnectionCard(1, index, modeId, num)
                                await this.changeExpansion(num, 1, index, modeId)
                            })
                            console.log('232wse', '哈哈')
                        } else {
                            /*新增 外部扩展柜 */
                            const SQLs = `INSERT INTO product_programme_detail
                        (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','is_expansion','component_count')  VALUES('${localStorage.productId}','27',${modeId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',1,'${selectNum}')`;
                            await new Promise((resolve, reject) => {
                                this.$db.run(SQLs, (err, res) => {
                                    if (err) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功" + JSON.stringify(res));
                                        return resolve()
                                    }
                                })
                            }).then(async () => {
                                let selectSql = `select * from product_programme_detail where seq_Key=${time} and product_id=${localStorage.productId}`
                                await new Promise((resolve, reject) => {
                                    this.$db.get(selectSql, (err, res) => {
                                        if (err) {
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: '系统错误',
                                                desc: err,
                                            });
                                            return
                                        } else {
                                            this.addExpansion[index].modeId = res.id;
                                            console.log('添加后查询id')
                                            return resolve()
                                        }
                                    })
                                })
                                this.changeId[index] = modeId;
                                console.log('mode2')
                                await this.setSAS(num * nun, 1)
                                await this.changeConnectionCard(1, index, modeId, num)
                                await this.changeExpansion(num, 1, index, modeId)
                            })
                        }
                    } else {
                        if (this.addExpansion[index].modeId) {
                            /*mode 替换数据*/
                            const update = `update product_programme_detail set component_id = (select id from component_disk_modeoption where id = ${this.addExpansion[index].modeModel}
),component_count =${orgNum}
where component_id =(
select  id from component_disk_modeoption mode
where mode.id = ${this.addExpansion[index].modeModelId}
) and machine_id= ${localStorage.machineId} and is_expansion=1 and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId} and category_id = 27 `
                            console.log(update)
                            await new Promise((resolve, reject) => {
                                this.$db.run(update, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                        this.changeId[index] = modeId;
                                        return resolve()
                                    }
                                })
                            }).then(async () => {
                                /*通过modeId 获取 对应的连接线 和SAS卡*/
                                console.log('mode3')
                                await this.setSAS(orgNum * nun, 1)
                                await this.changeConnectionCard(1, index, modeId, orgNum)
                                await this.changeExpansion(orgNum, 1, index, modeId)
                            })
                        } else {
                            /*新增 内部展柜 */
                            const SQLs = `INSERT INTO product_programme_detail
                        (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','is_expansion','component_count')  VALUES('${localStorage.productId}','27',${modeId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',1,'${orgNum}')`;
                            await new Promise((resolve, reject) => {
                                this.$db.run(SQLs, (err, res) => {
                                    if (err) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功" + JSON.stringify(res));
                                        return resolve()
                                    }
                                })
                            }).then(async () => {
                                let selectSql = `select * from product_programme_detail where seq_Key=${time} and product_id=${localStorage.productId}`
                                await new Promise((resolve, reject) => {
                                    this.$db.get(selectSql, (err, res) => {
                                        if (err) {
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: '系统错误',
                                                desc: err,
                                            });
                                            return
                                        }
                                        this.addExpansion[index].modeId = res.id;
                                        this.changeId[index] = modeId;
                                        console.log('mode4')
                                        return resolve()
                                    })
                                })
                                await this.setSAS(orgNum * nun, 1)
                                await this.changeConnectionCard(1, index, modeId, orgNum)
                                await this.changeExpansion(orgNum, 1, index, modeId)
                            })
                        }
                        let nums = selectNum - orgNum;
                        console.log(this.addExpansion[index].modeModel, modeId, this.addExpansion[index].modeIds)
                        if (this.addExpansion[index].modeIds) {
                            /*mode 替换数据*/
                            const update = `update product_programme_detail set component_id = (select id from component_disk_modeoption where id = ${this.addExpansion[index].modeModel}
),component_count =${nums}
where component_id =(
select  id from component_disk_modeoption mode
where mode.id = ${this.addExpansion[index].modeModelId}
) and machine_id= ${localStorage.machineId} and is_expansion=0 and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId} and category_id = 27 `
                            console.log(update)
                            await new Promise((resolve, reject) => {
                                this.$db.run(update, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                        this.changeId[index] = modeId;
                                        /*通过modeId 获取 对应的连接线 和SAS卡*/
                                        console.log('mode5')
                                        return resolve()
                                    }
                                })
                            })
                            await this.setSAS(nums * nun, 0)
                            await this.changeConnectionCard(0, index, modeId, nums)
                            await this.changeExpansion(nums, 0, index, modeId)
                        } else {
                            /*新增 内部展柜 */
                            const SQLs = `INSERT INTO product_programme_detail
                        (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','is_expansion','component_count')  VALUES('${localStorage.productId}','27',${modeId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',0,'${nums}')`;
                            await new Promise((resolve, reject) => {
                                this.$db.run(SQLs, (err, res) => {
                                    if (err) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功" + JSON.stringify(res));
                                        return resolve()
                                    }
                                })
                            })
                            let selectSql = `select * from product_programme_detail where seq_Key=${time} and product_id=${localStorage.productId}`
                            await new Promise((resolve, reject) => {
                                this.$db.get(selectSql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '系统错误',
                                            desc: err,
                                        });
                                        return
                                    }
                                    this.addExpansion[index].modeIds = res.id;
                                    this.changeId[index] = modeId;
                                    console.log('mode6')
                                    return resolve()
                                })
                            })
                            await this.setSAS(nums * nun, 0)
                            await this.changeConnectionCard(0, index, modeId, nums)
                            await this.changeExpansion(nums, 0, index, modeId)
                        }
                    }

                } else {

                    if (this.addExpansion[index].modeIds) {
                        /*mode 替换数据*/
                        const update = `update product_programme_detail set component_id = (select id from component_disk_modeoption where id = ${this.addExpansion[index].modeModel}
),component_count =${selectNum}
where component_id =(
select  id from component_disk_modeoption mode
where mode.id = ${this.addExpansion[index].modeModelId}
) and machine_id= ${localStorage.machineId} and is_expansion=0 and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId} and category_id = 27 `
                        console.log(update)
                        await new Promise((resolve, reject) => {
                            this.$db.run(update, (err, res) => {
                                if (res) {
                                    console.log("修改失败")
                                } else {
                                    console.log("修改成功")
                                    this.changeId[index] = modeId;
                                    return resolve(res)
                                }
                            })
                        }).then(async res => {
                            /*通过modeId 获取 对应的连接线 和SAS卡*/
                            console.log('mode7')
                            await this.setSAS(num * nun, 0)
                            await this.changeConnectionCard(0, index, modeId, num)
                            await this.changeExpansion(num, 0, index, modeId)
                        })
                    } else {
                        /*新增 内部展柜 */
                        const SQLs = `INSERT INTO product_programme_detail
                        (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','is_expansion','component_count')  VALUES('${localStorage.productId}','27',${modeId},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',0,'${selectNum}')`;
                        await new Promise((resolve, reject) => {
                            this.$db.run(SQLs, (err, res) => {
                                if (err) {
                                    console.log("添加失败")
                                } else {
                                    console.log("添加成功" + JSON.stringify(res));
                                    this.changeId[index] = modeId;
                                    return resolve()
                                }
                            })
                        }).then(async () => {
                            let selectSql = `select * from product_programme_detail where seq_Key=${time} and product_id=${localStorage.productId}`
                            await new Promise((resolve, reject) => {
                                this.$db.get(selectSql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '系统错误',
                                            desc: err,
                                        });
                                        return
                                    }
                                    this.addExpansion[index].modeIds = res.id;
                                    console.log('mode8')
                                    return resolve()
                                })
                            })
                            await this.setSAS(num * nun, 0)
                            await this.changeConnectionCard(0, index, modeId, num)
                            await this.changeExpansion(num, 0, index, modeId)
                        })
                    }
                }

                console.log('这个数是多少 ！！！！' + this.addExpansion[index].modeModelId)
                // 当选中的id为0的 情况下  删除之前已插入的数据
                const SQLDel = `delete from product_programme_detail where category_id= 27 and component_id = ${this.addExpansion[index].modeModelId} and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId} and  is_expansion=0`;
                const SQLDelte = `delete from product_programme_detail where category_id= 27 and component_id = ${this.addExpansion[index].modeModelId} and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId} and  is_expansion=1`;
                await new Promise((resolve, reject) => {
                    this.$db.run(SQLDel, (err, res) => {
                        if (err) {
                            console.log('删除失败')
                        } else {
                            console.log('删除成功')
                            console.log('这个数是多少 ！！！！' + this.addExpansion[index].modeModelId)
                            this.addExpansion[index].modeIds = 0
                            this.changeId.splice(index, 1)
                        }
                    })
                })
                await new Promise((resolve, reject) => {
                    this.$db.run(SQLDelte, (err, res) => {
                        if (err) {
                            console.log('删除失败')
                        } else {
                            console.log('删除成功')
                            console.log('这个数是多少 ！！！！' + this.addExpansion[index].modeModelId)
                            this.addExpansion[index].modeId = 0
                            this.changeId.splice(index, 1)
                        }
                    })
                })
            },

            /*修改 扩展柜数量*/
            async changeExpansion(num, bool, index, modeId) {

                console.log('上一次modeid' + this.addExpansion[index].modeModelId)
                console.log('外部数量' + this.externalExpansion)
                console.log('内部数量' + this.insideExpansion)
                console.log('外部id' + this.orgExternal, '内部id' + this.orgInside)
                //this.externalExpansion
                if (this.externalExpansion > 0) {
                    let externalExpansion = this.externalExpansion
                    this.externalExpansion = 0

                    let deleSQL = `SELECT id,component_count FROM product_programme_detail WHERE category_id = 26 AND component_id = (SELECT disk_expansioncase_id FROM relation_disk_expansioncase_modeoption WHERE modeoption_id = ${this.addExpansion[index].modeModelId}) AND is_expansion = '${this.orgExternal}' and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                    let resA = {}
                    await new Promise((resolve, reject) => {
                        this.$db.get(deleSQL, (err, res) => {
                            if (err) {
                                console.log("查询失败")
                            } else {
                                console.log(res, this.externalExpansion)
                                console.log(deleSQL)
                                resA = res
                                return resolve(res)
                            }
                        })
                    })
                    await new Promise((resolve, reject) => {
                        if (resA.component_count == externalExpansion) {
                            console.log(11111, '等待执行')
                            let deletepcie = `delete from product_programme_detail where  id=${resA.id}`
                            this.$db.run(deletepcie, (err, res) => {
                                if (err) {
                                    console.log("删除失败")
                                } else {
                                    console.log('删除成功')
                                    this.externalExpansion = 0
                                    return resolve()
                                }
                            })
                        } else {
                            console.log(222222, '等待执行')
                            let updaSQL = `UPDATE product_programme_detail SET component_count = '${resA.component_count - externalExpansion}'  WHERE id='${resA.id}'`
                            this.$db.run(updaSQL, (err, res) => {
                                if (err) {
                                    console.log("修改失败")
                                } else {
                                    console.log('修改成功')
                                    this.externalExpansion = 0
                                    return resolve()
                                }
                            })
                        }
                    })
                }

                //this.insideExpansion
                if (this.insideExpansion > 0) {
                    let insideExpansion = this.insideExpansion
                    this.insideExpansion = 0
                    let deleSQL = `SELECT id,component_count FROM product_programme_detail WHERE category_id = 26 AND component_id = (SELECT disk_expansioncase_id FROM relation_disk_expansioncase_modeoption WHERE modeoption_id = ${this.addExpansion[index].modeModelId}) AND is_expansion = '${this.orgInside}' and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                    let than = this
                    let res = await asas()
                    await bsas()

                    function asas() {
                        return new Promise((resolve, reject) => {
                            console.log('llllll')
                            than.$db.get(deleSQL, (err, res) => {
                                if (err) {
                                    console.log("查询失败")
                                } else {
                                    console.log(res, than.insideExpansion)
                                    console.log(deleSQL, "查询成功")
                                    return resolve(res)
                                }
                            })
                        })
                    }

                    function bsas() {
                        return new Promise((resolve, reject) => {
                            if (res.component_count == insideExpansion) {
                                console.log(33333, '等待执行')
                                let deletepcie = `delete from product_programme_detail where  id=${res.id}`
                                than.$db.run(deletepcie, (err, res) => {
                                    if (err) {
                                        console.log("删除失败")
                                    } else {
                                        console.log('删除成功')
                                        return resolve()
                                    }
                                })
                            } else {
                                console.log(444444, '等待执行')
                                let updaSQL = `UPDATE product_programme_detail SET component_count = '${res.component_count - insideExpansion}'  WHERE id='${res.id}'`
                                than.$db.run(updaSQL, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log('修改成功')
                                        return resolve()
                                    }
                                })
                            }
                        })
                    }
                }

                //参数 num：加上或减去的数量 bool：0/1判断是内部还是外部扩展柜
                //查询库里有没有扩展柜卡
                // ${this.addExpansion[index].modeModelId}
                let sele = `SELECT id FROM product_programme_detail WHERE category_id = 26 AND component_id = (SELECT disk_expansioncase_id FROM relation_disk_expansioncase_modeoption WHERE modeoption_id = ${modeId}) AND is_expansion = '${bool}' and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                //如果有的话就修改
                let updateSQL = `UPDATE product_programme_detail SET component_count = (component_count + '${num}')  WHERE category_id = 26 AND component_id = (SELECT disk_expansioncase_id FROM relation_disk_expansioncase_modeoption WHERE modeoption_id = ${modeId}) AND is_expansion = '${bool}' and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                //如果没有的话就添加
                const SQL = `INSERT INTO product_programme_detail
                (product_id,category_id,component_id,'solution_id','template_id','machine_id','component_count',is_expansion)
                VALUES('${localStorage.productId}','26',(SELECT relation.disk_expansioncase_id FROM relation_disk_expansioncase_modeoption relation
                join component_disk_expansioncase expan on expan.id=relation.disk_expansioncase_id
                join component_base_info info on info.id = expan.base_info_id
                WHERE relation.modeoption_id = ${modeId} and info.productId=${localStorage.productId}),'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${num}','${bool}')`;
                console.log(sele)
                let resB = {}
                await new Promise((resolve, reject) => {
                    this.$db.get(sele, (err, res) => {
                        if (err) {
                            console.log('查询报错')
                        } else {
                            resB = res
                            console.log('查询成功', res)
                            return resolve()
                        }
                    })
                })
                await new Promise((resolve, reject) => {
                    //如果有的话就修改
                    if (resB) {
                        console.log(updateSQL)
                        this.$db.run(updateSQL, (err, res) => {
                            if (err) {
                                console.log('修改报错')
                            } else {
                                console.log('修改成功')
                                return resolve()
                            }
                        })
                    } else {
                        console.log(SQL)
                        //如果没有的话就添加
                        this.$db.run(SQL, (err, res) => {
                            if (err) {
                                console.log('添加报错')
                            } else {
                                console.log('添加成功')
                                return resolve()
                            }
                        })
                    }
                })
            },

            /*更改mode时， 更改连接卡*/
            async changeConnectionCard(bool, index, id, num) {
                let connectinglineId = 0;
                let connectinId = 0;
                console.log(this.addExpansion[index].modeModelId, this.orgExternal, this.orgInside, this.addExpansion[index].modeData)
                this.addExpansion[index].modeData.forEach(item => {
                    if (item.id == id) {
                        connectinglineId = item.connectingline_id;
                    }
                    if (this.addExpansion[index].modeModelId == item.id) {
                        connectinId = item.connectingline_id;
                    }
                })
                let nun = 0
                let bboo = 0
                if (this.orgInsideNums > -1) {
                    bboo = this.orgInside;
                    nun = this.orgInsideNums;
                    this.orgInsideNums = -1
                    let deleSQL = `SELECT id,component_count FROM product_programme_detail WHERE category_id = 25 AND component_id ='${connectinId}'  and machine_id= ${localStorage.machineId} and is_expansion='${bboo}' and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                    await new Promise((resolve, reject) => {
                        this.$db.get(deleSQL, (err, res) => {
                            if (err) {
                                console.log("查询失败", deleSQL)
                            } else {
                                console.log(res, nun, this.orgExternalNum, bboo)
                                console.log(deleSQL)
                                return resolve(res)
                            }
                        })
                    }).then(async res => {
                        if (res.component_count == nun) {
                            new Promise((resolve, reject) => {
                                let deletepcie = `delete from product_programme_detail where  id=${res.id}`
                                this.$db.run(deletepcie, (err, res) => {
                                    if (err) {
                                        console.log("删除失败")
                                    } else {
                                        console.log('删除成功')
                                        return resolve()
                                    }
                                })
                            })
                        } else {
                            new Promise((resolve, reject) => {
                                let updaSQL = `UPDATE product_programme_detail SET component_count = '${res.component_count - nun}'  WHERE id='${res.id}'`
                                this.$db.run(updaSQL, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log('修改成功')
                                        return resolve()
                                    }
                                })
                            })
                        }
                    })
                }
                //
                if (this.orgExternalNums > -1) {
                    bboo = this.orgExternal;
                    nun = this.orgExternalNums;
                    this.orgExternalNums = -1
                    let deleSQL = `SELECT id,component_count FROM product_programme_detail WHERE category_id = 25 AND component_id ='${connectinId}'  and machine_id= ${localStorage.machineId} and is_expansion='${bboo}' and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                    await new Promise((resolve, reject) => {
                        this.$db.get(deleSQL, (err, res) => {
                            if (err) {
                                console.log("查询失败")
                            } else {
                                console.log(res, nun, this.orgExternalNum, bboo)
                                console.log(deleSQL)
                                return resolve(res)
                            }
                        })
                    }).then(res => {
                        if (res.component_count == nun) {
                            new Promise((resolve, reject) => {
                                let deletepcie = `delete from product_programme_detail where  id=${res.id}`
                                this.$db.run(deletepcie, (err, res) => {
                                    if (err) {
                                        console.log("删除失败")
                                    } else {
                                        console.log('删除成功')
                                        return resolve()
                                    }
                                })
                            })
                        } else {
                            new Promise((resolve, reject) => {
                                let updaSQL = `UPDATE product_programme_detail SET component_count = '${res.component_count - nun}'  WHERE id='${res.id}'`
                                this.$db.run(updaSQL, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log('修改成功')
                                        return resolve()
                                    }
                                })
                            })
                        }
                    })
                }

                //添加和修改已选的数据
                let upSQL = `SELECT id FROM product_programme_detail WHERE category_id = 25 AND component_id ='${connectinglineId}'  AND is_expansion = '${bool}' and machine_id= ${localStorage.machineId} and is_expansion=1 and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                //如果没有的话就添加
                const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,'solution_id','template_id','machine_id','component_count',is_expansion)
                    VALUES('${localStorage.productId}','25','${connectinglineId}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${num * 2}','${bool}')`;
                console.log(upSQL)
                let resC = 0
                await new Promise((resolve, reject) => {
                    this.$db.get(upSQL, (err, res) => {
                        if (err) {
                            console.log("查询失败")
                        } else {
                            console.log("查询成功", res)
                            resC = res
                            return resolve()
                        }
                    })
                })
                await new Promise((resolve, reject) => {
                    if (resC) {
                        let updateSQL = `UPDATE product_programme_detail SET component_count = (component_count + '${num * 2}')  WHERE id=${resC.id}`
                        console.log(updateSQL)
                        this.$db.run(updateSQL, (err, res) => {
                            if (err) {
                                console.log('修改报错')
                            } else {
                                console.log('修改成功')
                                return resolve()
                            }
                        })
                    } else {
                        //如果没有的话就添加
                        this.$db.run(SQL, (err, res) => {
                            if (err) {
                                console.log('添加报错')
                            } else {
                                console.log('添加成功')
                                return resolve()
                            }
                        })
                    }
                })
                return
            },

            async setSAS(num, bool) {

                if (this.orgExternalNum > 0) {
                    let orgExternalNum = this.orgExternalNum
                    this.orgExternalNum = 0
                    let deleSQL = `SELECT id,component_count FROM product_programme_detail WHERE category_id = 6 AND component_id = (SELECT iocard_id FROM relation_disk_modeoption_iocard WHERE modeoption_id = 1) AND is_expansion = '${this.orgExternal}' and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                    let resA = {}
                    await new Promise((resolve, reject) => {
                        this.$db.get(deleSQL, (err, res) => {
                            if (err) {
                                console.log("查询失败")
                            } else {
                                console.log(res, this.orgExternalNum)
                                console.log(deleSQL)
                                resA = res
                                return resolve(res)
                            }
                        })
                    })
                    await new Promise((resolve, reject) => {
                        if (resA.component_count == orgExternalNum) {
                            console.log(11111, '等待执行')
                            let deletepcie = `delete from product_programme_detail where  id=${resA.id}`
                            this.$db.run(deletepcie, (err, res) => {
                                if (err) {
                                    console.log("删除失败")
                                } else {
                                    console.log('删除成功')
                                    this.orgExternalNum = 0
                                    return resolve()
                                }
                            })
                        } else {
                            console.log(222222, '等待执行')
                            let updaSQL = `UPDATE product_programme_detail SET component_count = '${resA.component_count - orgExternalNum}'  WHERE id='${resA.id}'`
                            this.$db.run(updaSQL, (err, res) => {
                                if (err) {
                                    console.log("修改失败")
                                } else {
                                    console.log('修改成功')
                                    this.orgExternalNum = 0
                                    return resolve()
                                }
                            })
                        }
                    })
                }

                if (this.orgInsideNum > 0) {
                    let orgInsideNum = this.orgInsideNum
                    this.orgInsideNum = 0
                    let deleSQL = `SELECT id,component_count FROM product_programme_detail WHERE category_id = 6 AND component_id = (SELECT iocard_id FROM relation_disk_modeoption_iocard WHERE modeoption_id = 1) AND is_expansion = '${this.orgInside}' and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                    let than = this
                    let res = await asas()
                    await bsas()

                    function asas() {
                        return new Promise((resolve, reject) => {
                            console.log('llllll')
                            than.$db.get(deleSQL, (err, res) => {
                                if (err) {
                                    console.log("查询失败")
                                } else {
                                    console.log(res, than.orgInsideNum)
                                    console.log(deleSQL, "查询成功")
                                    return resolve(res)
                                }
                            })
                        })
                    }

                    function bsas() {
                        console.log('llllll')
                        return new Promise((resolve, reject) => {
                            if (res.component_count == orgInsideNum) {
                                console.log(33333, '等待执行')
                                let deletepcie = `delete from product_programme_detail where  id=${res.id}`
                                than.$db.run(deletepcie, (err, res) => {
                                    if (err) {
                                        console.log("删除失败")
                                    } else {
                                        console.log('删除成功')
                                        return resolve(res)
                                    }
                                })
                            } else {
                                console.log(444444, '等待执行')
                                let updaSQL = `UPDATE product_programme_detail SET component_count = '${res.component_count - orgInsideNum}'  WHERE id='${res.id}'`
                                than.$db.run(updaSQL, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log('修改成功')
                                        return resolve(res)
                                    }
                                })
                            }
                        })
                    }
                }


                //参数 num：加上或减去的数量 bool：0/1判断是内部还是外部sas卡
                //查询库里有没有sas卡
                let sele = `SELECT id FROM product_programme_detail WHERE category_id = 6 AND component_id = (SELECT iocard_id FROM relation_disk_modeoption_iocard WHERE modeoption_id = 1) AND is_expansion = '${bool}' and machine_id= ${localStorage.machineId} and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                //如果有的话就修改
                let updateSQL = `UPDATE product_programme_detail SET component_count = (component_count + '${num}')  WHERE category_id = 6 AND component_id = (SELECT iocard_id FROM relation_disk_modeoption_iocard WHERE modeoption_id = 1) AND is_expansion = '${bool}' and machine_id= ${localStorage.machineId} and is_expansion=1 and solution_id=${localStorage.solutionId} and product_id=${localStorage.productId} and template_id=${localStorage.templateId}`
                //如果没有的话就添加
                const SQL = `INSERT INTO product_programme_detail
                    (product_id,category_id,component_id,'solution_id','template_id','machine_id','component_count',is_expansion)
                    VALUES('${localStorage.productId}','6',38,'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${num}','${bool}')`;
                console.log(sele)
                let resB = {}
                await new Promise((resolve, reject) => {
                    this.$db.get(sele, (err, res) => {
                        if (err) {
                            console.log('查询报错')
                        } else {
                            resB = res
                            console.log('查询成功', res)
                            return resolve()
                        }
                    })
                })
                await new Promise((resolve, reject) => {
                    //如果有的话就修改
                    if (resB) {
                        console.log(updateSQL)
                        this.$db.run(updateSQL, (err, res) => {
                            if (err) {
                                console.log('修改报错')
                            } else {
                                console.log('修改成功')
                                return resolve()
                            }
                        })
                    } else {
                        //如果没有的话就添加
                        this.$db.run(SQL, (err, res) => {
                            if (err) {
                                console.log('添加报错')
                            } else {
                                console.log('添加成功')
                                return resolve()
                            }
                        })
                    }
                })


            },

            /*更改 扩展柜数量*/
            changeNum(num, numS, modeId) {
                console.log('进入硬盘扩展柜')
                /*---------------- 修改扩展柜数量----------------*/
                const sql = `select detail.id,detail.component_count,detail.is_expansion from product_programme_detail detail
join component_disk_expansioncase expan on expan.category_id=detail.category_id and expan.id=detail.component_id
join relation_disk_expansioncase_modeoption relation on relation.disk_expansioncase_id=expan.id
join component_disk_modeoption mode on mode.id=relation.modeoption_id
where mode.id ='${modeId}' and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                console.log(sql)
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        console.log("查询失败")
                    } else {
                        console.log("查询成功", res)
                        console.log(res)
                        let sasSum = 0//内部连接卡数量
                        let sasId = 0//内部连接卡的id
                        let sasSumNum = 0//外部连接卡数量
                        let sasSumNumId = 0//外部连接卡的id
                        res.forEach(item => {
                            if (item.is_expansion == 1) {
                                sasSum = item.component_count;
                                sasId = item.id
                            }
                            if (item.is_expansion == 0) {
                                sasSumNum = item.component_count;
                                sasSumNumId = item.id
                            }
                        })
                        if (num) {
                            if (sasId) {
                                const updateSql = `update product_programme_detail set component_count='${num + sasSum}' where id = '${sasId}'`
                                this.$db.run(updateSql, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                        let deletepcie = `delete from product_programme_detail where  component_count=0`
                                        console.log(deletepcie)
                                        this.$db.run(deletepcie, (err, res) => {
                                            if (err) {
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '删除失败',
                                                    desc: err,
                                                });
                                            } else {

                                            }
                                        })
                                    }
                                })
                            } else {
                                const SQL = `insert into product_programme_detail (
                                    product_id,machine_id,category_id,component_id,solution_id,template_id,component_count,is_expansion
                                )
                                select  ${localStorage.productId},${localStorage.machineId},expan.category_id,expan.id,${localStorage.solutionId},${localStorage.templateId},'${num}',1 from  component_disk_expansioncase expan
                                join relation_disk_expansioncase_modeoption relation on relation.disk_expansioncase_id=expan.id
                                join component_disk_modeoption mode on mode.id=relation.modeoption_id
                                join component_base_info info on info.id= expan.base_info_id
                                where mode.id='${modeId}' and info.productId='${localStorage.productId}'`
                                this.$db.run(SQL, (err, res) => {
                                    if (err) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功", '进入硬盘扩展柜 2')
                                    }
                                })
                            }
                        }
                        if (numS) {
                            if (sasSumNumId) {
                                if (numS + sasSumNum > 0) {
                                    let sasSumNumSql = `update product_programme_detail set component_count='${numS + sasSumNum}' where id = '${sasSumNumId}'`
                                    this.$db.run(sasSumNumSql, (err, res) => {
                                        if (err) {
                                            console.log("修改失败")
                                        } else {
                                            console.log("修改成功", '进入硬盘扩展柜 3')
                                        }
                                    })
                                } else {
                                    let sasSumNumSql = `delete from product_programme_detail where id = '${sasSumNumId}'`
                                    this.$db.run(sasSumNumSql, (err, res) => {
                                        if (err) {
                                            console.log("删除失败")
                                        } else {
                                            console.log("删除成功", '进入硬盘扩展柜 5')
                                        }
                                    })
                                }
                            } else {
                                const sasSumNumSQL = `insert into product_programme_detail (
                                    product_id,machine_id,category_id,component_id,solution_id,template_id,component_count,is_expansion
                                )
                                select  ${localStorage.productId},${localStorage.machineId},expan.category_id,expan.id,${localStorage.solutionId},${localStorage.templateId},'${numS}',0 from  component_disk_expansioncase expan
                                join relation_disk_expansioncase_modeoption relation on relation.disk_expansioncase_id=expan.id
                                join component_disk_modeoption mode on mode.id=relation.modeoption_id
                                join component_base_info info on info.id = expan.base_info_id
                                where mode.id='${modeId}' and info.productId = '${localStorage.productId}'`;
                                this.$db.run(sasSumNumSQL, (err, res) => {
                                    if (err) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功", '进入硬盘扩展柜 4')
                                    }
                                })
                            }
                        }
                    }
                })
            },

            /*通过modeId 获取 对应的连接线  存入product_programme_detail 以及修改*/
            getConnectingLine(num, numS, modeId) {

                console.log('进入连接卡')
                const sql = `select detail.id detail_id,detail.category_id,detail.component_id,detail.component_count,detail.is_expansion from product_programme_detail  detail  join component_connectingline line on detail.category_id=line.category_id and line.id=detail.component_id
join relation_disk_modeoption_connectingline relation on relation.connectingline_id=line.id
join component_disk_modeoption mode on mode.id=relation.modeoption_id where mode.id=${modeId} and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}' `
                console.log(sql)
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        console.log("查询失败")
                    } else {
                        console.log("查询成功", res)
                        let sasSum = 0//内部连接卡数量
                        let sasId = 0//内部连接卡的id
                        let sasSumNum = 0//外部连接卡数量
                        let sasSumNumId = 0//外部连接卡的id
                        res.forEach(item => {
                            if (item.is_expansion == 1) {
                                sasSum = item.component_count;
                                sasId = item.detail_id
                            }
                            if (item.is_expansion == 0) {
                                sasSumNum = item.component_count;
                                sasSumNumId = item.detail_id
                            }
                        })
                        if (num) {
                            if (sasId) {
                                let updateSql = `update product_programme_detail set component_count='${num + sasSum}' where id = '${sasId}'`
                                this.$db.run(updateSql, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                        let deletepcie = `delete from product_programme_detail where  component_count=0`
                                        console.log(deletepcie)
                                        this.$db.run(deletepcie, (err, res) => {
                                            if (err) {
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '删除失败',
                                                    desc: err,
                                                });
                                            } else {

                                            }
                                        })
                                    }
                                })
                            } else {
                                const SQL = `insert into product_programme_detail (
                                    product_id,machine_id,category_id,component_id,solution_id,template_id,component_count,is_expansion
                                )
                                select  ${localStorage.productId},${localStorage.machineId},line.category_id,line.id,${localStorage.solutionId},${localStorage.templateId},'${num}',1 from  component_connectingline line
                                join relation_disk_modeoption_connectingline relation on relation.connectingline_id=line.id
                                join component_disk_modeoption mode on mode.id=relation.modeoption_id
                                join component_base_info info on info.id=line.base_info_id
                                where mode.id='${modeId}' and info.productId = '${localStorage.productId}'`
                                this.$db.run(SQL, (err, res) => {
                                    if (err) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功", '连接线 2')
                                    }
                                })
                            }
                        }
                        if (numS) {
                            if (sasSumNumId) {
                                if (numS + sasSumNum > 0) {
                                    let sasSumNumSql = `update product_programme_detail set component_count='${numS + sasSumNum}' where id = '${sasSumNumId}'`
                                    this.$db.run(sasSumNumSql, (err, res) => {
                                        if (err) {
                                            console.log("修改失败")
                                        } else {
                                            console.log("修改成功", '连接线 3')
                                        }
                                    })
                                } else {
                                    let sasSumNumSql = `delete from product_programme_detail where id = '${sasSumNumId}'`
                                    this.$db.run(sasSumNumSql, (err, res) => {
                                        if (err) {
                                            console.log("删除失败")
                                        } else {
                                            console.log("删除成功", '连接线 5')
                                        }
                                    })
                                }
                            } else {
                                const sasSumNumSQL = `insert into product_programme_detail (
                                    product_id,machine_id,category_id,component_id,solution_id,template_id,component_count,is_expansion
                                )
                                select  ${localStorage.productId},${localStorage.machineId},line.category_id,line.id,${localStorage.solutionId},${localStorage.templateId},'${numS}',0 from  component_connectingline line
                                join relation_disk_modeoption_connectingline relation on relation.connectingline_id=line.id
                                join component_disk_modeoption mode on mode.id=relation.modeoption_id
                                join component_base_info info on info.id = line.base_info_id
                                where mode.id='${modeId}' and info.productId = '${localStorage.productId}'`;
                                this.$db.run(sasSumNumSQL, (err, res) => {
                                    if (err) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功", '连接线 4')
                                    }
                                })
                            }
                        }
                    }
                })
            },

            /*通过modeId 获取 对应的SAS卡  存入product_programme_detail 以及修改*/
            async getSAS(num, numS, modeId) {
                console.log(num)
                console.log('进入SAS卡')
                /*查询库里内部，外部sas的数量，和id*/
                let sql = `select detail.id,detail.component_count,detail.is_expansion from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where detail.component_id = (select distinct io.id from component_iocard io
join relation_disk_modeoption_iocard relation on io.id=relation.iocard_id and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}')`
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        console.log("查询失败", sql)
                    } else {
                        console.log("查询成功", res)
                        let sasSum = 0//内部sas数量
                        let sasId = 0//内部sas的id
                        let sasSumNum = 0//外部sas数量
                        let sasSumNumId = 0//外部sas的id
                        res.forEach(item => {
                            if (item.is_expansion == 1) {
                                sasSum = item.component_count;
                                sasId = item.id
                            }

                            if (item.is_expansion == 0) {
                                sasSumNum = item.component_count;
                                sasSumNumId = item.id
                            }
                        })
                        console.log(this.sasSum);
                        console.log(this.sasSumNum)
                        console.log(num);
                        console.log(sasSum)
                        console.log(sasId)
                        if (num) {
                            if (sasId) {
                                let updateSql = `update product_programme_detail set component_count='${num + sasSum}' where id = '${sasId}'`
                                this.$db.run(updateSql, (err, res) => {
                                    if (err) {
                                        console.log("修改失败")
                                    } else {
                                        console.log("修改成功")
                                        console.log('SAS 1')
                                        let deletepcie = `delete from product_programme_detail where  component_count=0`
                                        console.log(deletepcie)
                                        this.$db.run(deletepcie, (err, res) => {
                                            if (err) {
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '删除失败',
                                                    desc: err,
                                                });
                                            } else {

                                            }
                                        })
                                    }
                                })
                            } else {
                                const SQL = `insert into product_programme_detail (product_id,machine_id,category_id,component_id,solution_id,template_id,component_count,is_expansion)
				select ${localStorage.productId},${localStorage.machineId},io.category_id,io.id,${localStorage.solutionId},${localStorage.templateId},'${num}',1 from component_iocard io
					   join relation_disk_modeoption_iocard relation on relation.iocard_id=io.id
					   join component_base_info info on info.id = io.base_info_id
					where relation.modeoption_id=${modeId}	and info.productId = ${localStorage.productId}`;
                                this.$db.run(SQL, (err, res) => {
                                    if (res) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功", 'SAS 2')
                                    }
                                })
                            }
                        }
                        if (numS) {
                            if (sasSumNumId) {
                                if (numS + sasSumNum > 0) {
                                    let sasSumNumSql = `update product_programme_detail set component_count='${numS + sasSumNum}' where id = '${sasSumNumId}'`
                                    this.$db.run(sasSumNumSql, (err, res) => {
                                        if (err) {
                                            console.log("修改失败")
                                        } else {
                                            console.log("修改成功", 'SAS 3')
                                        }
                                    })
                                } else {
                                    let sasSumNumSql = `delete from product_programme_detail where id = '${sasSumNumId}'`
                                    this.$db.run(sasSumNumSql, (err, res) => {
                                        if (err) {
                                            console.log("删除失败")
                                        } else {
                                            console.log("删除成功", 'SAS 5')
                                        }
                                    })
                                }
                            } else {
                                const sasSumNumSQL = `insert into product_programme_detail (product_id,machine_id,category_id,component_id,solution_id,template_id,component_count,is_expansion)
				select ${localStorage.productId},${localStorage.machineId},io.category_id,io.id,${localStorage.solutionId},${localStorage.templateId},'${numS}',0 from component_iocard io
					   join relation_disk_modeoption_iocard relation on relation.iocard_id=io.id
					   join component_base_info info on info.id = io.base_info_id
					where relation.modeoption_id=${modeId}	and info.productId = ${localStorage.productId}`;
                                this.$db.run(sasSumNumSQL, (err, res) => {
                                    if (err) {
                                        console.log("添加失败")
                                    } else {
                                        console.log("添加成功", 'SAS 4')
                                    }
                                })
                            }
                        }
                    }
                })
            },

            /*通过 mode id 获取  对应的  卡数*/
            async modeCardNumber(modeId, index) {
                const Sql = `	SELECT card_base_cnt FROM component_disk_modeoption where id ='${modeId}'`
                return new Promise((resolve, reject) => {
                    this.$db.get(Sql, (err, res) => {
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
                    if (res) {
                        this.addExpansion[index].modeNumber = res.card_base_cnt;
                    } else {
                        this.addExpansion[index].modeNumber = 0;
                    }
                })
            },

            /*过滤已选mode不显示在选择框内*/
            async modeBtnChange(bool, index, modeId, id) {

                if (bool) {

                    /*现在的modeid 赋给  modeModelId 上  下次使用*/
                    this.addExpansion[index].modeModelId = this.addExpansion[index].modeModel;
                    /*现在的mode 卡数 赋给  orgModeNumber 上  下次使用*/
                    this.addExpansion[index].orgModeNumber = this.addExpansion[index].modeNumber;

                    /*获取 可用的插槽数*/
                    this.getExpansionNum(bool, index, id);

                    if (this.addExpansion[index].modeData) {

                        this.addExpansion[index].modeData = this.addExpansion[index].modeDataList.filter(item => {

                            let mode = true;

                            this.changeId.forEach((it, ind) => {

                                if (item.id == it && item.id != this.addExpansion[index].modeModel) {
                                    return mode = false
                                }
                            })
                            return mode;
                        })
                    }
                    console.log(this.changeId);
                    console.log(this.addExpansion[index].modeData);
                }
            },

            /*硬盘扩展柜  添加方法*/
            addExpansionData(type, mode, num, index) {

                console.log(this.sumExpansionNum)
                /* 通过已选插槽限制添加*/
                if (this.sumExpansionNum == 0) {
                    // return false;
                }
                /* 通过数据  限制长度*/
                if (this.addExpansion.length == 6) {
                    this.disabled = true;
                    return false;
                }


                /*当扩展柜 id 和mode id 不为0  可添加*/
                if (type != 0 && mode != '请选择' && num != '') {

                    /*获取扩展柜型号数据*/
                    this.getExpansionData()

                }

            },

            /*获取扩展柜型号数据*/
            getExpansionData() {
                /*获取扩展柜型号数据*/
                const SQL = `SELECT info.description,info.description_en,diskcase.id,info.status,info.withdraw_date  FROM component_disk_expansioncase diskcase
join component_category cate on cate.id=diskcase.category_id
join component_base_info info on info.id=diskcase.base_info_id `

                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        console.log(res)
                        /*添加默认请选择*/
                        res.unshift({
                            description_en: '请选择',
                            id: 0
                        })

                        if (this.array.length < 1) {
                            this.array = [...res];
                        }
                        this.addExpansion.push({
                            expansionType: [...this.array],
                            modeData: [],
                            modeDataList: [],
                            modeModel: '请选择',
                            modeModelId: '',
                            expansionNum: '',
                            modeNumber: 0,
                            orgModeNumber: 0,
                            modeModelNum: '',
                            bool: false,
                            diskCount: '',
                            expansionCabinetId: '',
                            modeId: '',
                            modeIds: '',
                            expansionNumModel: '',
                            expansionTypeModel: 0
                        })

                    }
                })
            },

            /*获取扩展柜mode数据*/
            getModeData(id, index) {

                /* id 为0跳出*/
                if (id != 0) {
                    console.log(id)
                    /*获取扩展柜mode数据*/
                    const SQLData = `select modeoption.mode,info.description_en,modeoption.id,info.withdraw_date,rc.connectingline_id from component_disk_modeoption modeoption
                            join relation_disk_expansioncase_modeoption casemode on casemode.modeoption_id=modeoption.id
                            join component_disk_expansioncase diskcase on diskcase.id=casemode.disk_expansioncase_id
                            join component_base_info  info on info.id=modeoption.base_info_id
														JOIN relation_disk_modeoption_connectingline rc ON rc.modeoption_id = modeoption.id
                            where diskcase.id=${id}`

                    console.log(SQLData)
                    this.$db.all(SQLData, (err, res) => {
                        if (err) {

                        } else {
                            this.list = res.filter((itme) => {
                                /*标识为true*/
                                let num = true;
                                this.changeId.forEach((it) => {
                                    if (itme.id == it) {
                                        num = false;
                                        return
                                    }
                                })
                                return num;
                            })
                            this.addExpansion[index].modeData = [...this.list];
                            this.addExpansion[index].modeDataList = [...res];
                            // 切换时 给mode 默认值
                            this.addExpansion[index].modeModel = '请选择';
                            /* 插入 mode 已选数据*/
                            this.modeBtn(this.addExpansion[index].modeModel, index);
                        }
                    })
                }
            },

            /*获取扩展柜数量*/
            getExpansionNum(bool, index, expansionid) {
                console.log(bool, index, expansionid)
                this.sumExpansionNum = 0;
                /* 当 扩展柜 或 mode 状态 都为 请选择  return*/
                if (this.addExpansion[0].modeModel == '请选择') {
                    this.addExpansion[0].expansionNumModel = ''
                }

                // if(bool){
                /*
                * 获取扩展柜的数量  1个cpu 8 个槽数  2个 11个槽数
                * 扩展柜的数量   = CPU插槽数 - （内部PCIE）
                * */
                let than = this;
                let pcie = 0;
                let externalPcie = 0;
                let numPcie = 0
                /* CPU个数 */
                const CPUSQL = `select sum(component_count) cpu_sum_count from product_programme_detail detail  join component_cpu cpu on detail.category_id=cpu.category_id and detail.component_id=cpu.id where  solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                new Promise(function (resolve, reject) {
                    than.$db.all(CPUSQL, (err, res) => {
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
                }).then((res) => {
                    than.$db.get(CPUSQL, (err, res) => {
                        if (err) {

                        } else {
                            /* CPU个数 */
                            this.cpu = res.cpu_sum_count;

                            /* 获取 IO扩展柜 连接卡*/
                            const SQLpci = `select detail.component_count from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where detail.is_expansion=1 and detail.component_id =(select distinct io.id from component_iocard io
join relation_expansionflesh_iocard flesh on flesh.iocard_id=io.id and solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}')`
                            console.log(SQLpci)
                            new Promise(function (resolve, reject) {
                                than.$db.all(SQLpci, (err, res) => {
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
                            }).then((res) => {
                                if (res.length > 0) {
                                    this.ioCard = res[0].component_count
                                } else {
                                    this.ioCard = 0;
                                }

                                /* 外部PCIE */
                                const SQLpc = `select sum(component_count) iocard_sum_count from product_programme_detail detail
               join component_iocard io  on detail.category_id=io.category_id and detail.component_id=io.id where  solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}' and is_expansion = 0`
                                console.log(SQLpc)
                                new Promise(function (resolve, reject) {
                                    than.$db.all(SQLpc, (err, res) => {
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
                                }).then((res) => {
                                    than.$db.get(SQLpc, (err, res) => {
                                        if (err) {

                                        } else {
                                            externalPcie = res.iocard_sum_count;

                                            /* 内部PCIE */
                                            const SQLexternal = `select sum(component_count) iocard_sum_count from product_programme_detail detail
               join component_iocard io  on detail.category_id=io.category_id and detail.component_id=io.id where  solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
            and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}' and is_expansion = 1`
                                            console.log(SQLexternal)
                                            new Promise(function (resolve, reject) {
                                                than.$db.all(SQLexternal, (err, res) => {
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
                                            }).then((res) => {
                                                than.$db.get(SQLexternal, (err, res) => {
                                                    if (err) {

                                                    } else {
                                                        /* 获取 内部PCIE */
                                                        pcie = res.iocard_sum_count;
                                                        console.log(this.cpu);
                                                        console.log(externalPcie);
                                                        console.log(pcie);
                                                        console.log(this.ioCard)
                                                        if (this.addExpansion[index].modeNumber) {
                                                            if (this.cpu == 1) {   // 一个cpu 8个插槽
                                                                /*计算内部插槽数*/
                                                                this.pcieNum = 0
                                                                this.pcieNum = parseInt((8 - pcie) / this.addExpansion[index].modeNumber);
                                                                this.pcieNumS = 8 - pcie;
                                                                if (this.pcieNum < 0) {
                                                                    this.pcieNum = 0
                                                                }
                                                                console.log('内部插槽数' + this.pcieNumS)
                                                                console.log('内部的' + this.pcieNum);

                                                                /*计算外部插槽数*/
                                                                this.pcieNumber = 0;
                                                                if (this.ioCard > 0) {
                                                                    this.pcieNumber = parseInt((this.ioCard * 6 - externalPcie) / this.addExpansion[index].modeNumber);
                                                                    this.pcieNumberS = this.ioCard * 6 - externalPcie;
                                                                } else {
                                                                    this.pcieNumber = 0;
                                                                    ;
                                                                    this.pcieNumbers = 0;
                                                                }

                                                                console.log('外部插槽数' + this.pcieNumbers)
                                                                console.log('外部的' + this.pcieNumber)

                                                                numPcie = this.pcieNum + this.pcieNumber;

                                                                this.sumExpansionNum = numPcie;

                                                                /*计算扩展柜可选最大值*/
                                                                this.num = 0;
                                                                this.addExpansion.forEach((item, ind) => {
                                                                    /*计算 已选的数量*/
                                                                    this.num += item.expansionNumModel;
                                                                })
                                                                this.addExpansion[index].expansionNum = 0;

                                                                if (this.addExpansion[index].modeModel != '请选择') {
                                                                    this.addExpansion[index].expansionNum = parseInt(this.sumExpansionNum + this.addExpansion[index].expansionNumModel);
                                                                }

                                                                /*判断 扩展柜添加按钮 禁用*/
                                                                if (this.sumExpansionNum == 0) {
                                                                    this.disabled = true;
                                                                } else {
                                                                    this.disabled = false;
                                                                }

                                                                /*如果2卡 都被选中  剩余插槽无法被4卡整除  禁用 添加按钮*/
                                                                let mode = this.changeId.indexOf(1, 0);
                                                                let modeId = this.changeId.indexOf(4, 0);

                                                                /*计算 线缆的数量*/
                                                                this.cableNum = this.num * 2;
                                                                if (this.cableNum == 0) {
                                                                    this.cableNumModel = ''
                                                                } else {
                                                                    this.cableNumModel = this.cableNum;

                                                                    /*添加最低配线缆*/
                                                                    this.cableBtn(1, this.cableNumModel);

                                                                    /*添加电源线*/
                                                                    this.powerCord(1, this.num)
                                                                }


                                                            } else {   // 两个 cpu 11  个插槽
                                                                /*计算内部插槽数*/
                                                                this.pcieNum = 0
                                                                this.pcieNum = parseInt((11 - pcie) / this.addExpansion[index].modeNumber);
                                                                this.pcieNumS = 11 - pcie;
                                                                if (this.pcieNum < 0) {
                                                                    this.pcieNum = 0
                                                                }
                                                                console.log('内部插槽数' + this.pcieNumS)
                                                                console.log('内部的' + this.pcieNum);

                                                                /*计算外部插槽数*/
                                                                this.pcieNumber = 0;
                                                                if (this.ioCard > 0) {
                                                                    this.pcieNumber = parseInt((this.ioCard * 6 - externalPcie) / this.addExpansion[index].modeNumber);
                                                                    this.pcieNumberS = this.ioCard * 6 - externalPcie;
                                                                } else {
                                                                    this.pcieNumber = 0;
                                                                    this.pcieNumberS = 0;
                                                                }

                                                                console.log('外部插槽数' + this.pcieNumberS)
                                                                console.log('外部的' + this.pcieNumber)

                                                                numPcie = this.pcieNum + this.pcieNumber;

                                                                this.sumExpansionNum = numPcie;

                                                                /*计算扩展柜可选最大值*/
                                                                this.num = 0;
                                                                this.addExpansion.forEach((item, ind) => {
                                                                    this.num += item.expansionNumModel;
                                                                })

                                                                if (this.addExpansion[index].modeModel != '请选择') {
                                                                    this.addExpansion[index].expansionNum = parseInt(this.sumExpansionNum + this.addExpansion[index].expansionNumModel);
                                                                }

                                                                /*判断 扩展柜添加按钮 禁用*/
                                                                if (this.sumExpansionNum == 0) {
                                                                    this.disabled = true;
                                                                } else {
                                                                    this.disabled = false;
                                                                }

                                                                /*如果2卡 都被选中  剩余插槽无法被4卡整除  禁用 添加按钮*/
                                                                let mode = this.changeId.indexOf(1, 0);
                                                                let modeId = this.changeId.indexOf(4, 0);

                                                                /*计算 线缆的数量*/
                                                                this.cableNum = this.num * 2;
                                                                if (this.cableNum == 0) {
                                                                    this.cableNumModel = ''
                                                                } else {
                                                                    this.cableNumModel = this.cableNum;

                                                                    /*添加最低配线缆*/
                                                                    this.cableBtn(1, this.cableNumModel);

                                                                    /*添加电源线*/
                                                                    this.powerCord(1, this.num)
                                                                }

                                                            }
                                                        }
                                                    }
                                                })
                                            })
                                        }
                                    })

                                })
                            })
                        }
                    })
                })
                // }

            },

            /*内部  外部  pcie  使用插槽数*/
            getpcieNei() {
                let getpcie = `select id,component_count,is_expansion from product_programme_detail where category_id in(select DISTINCT category_id from component_iocard) and  product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'`
                return new Promise((resolve, reject) => {
                    this.$db.all(getpcie, (err, res) => {
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
                }).then((res) => {
                    console.log(res)
                    // 外部插槽数
                    this.sumPcie = 0;
                    // 内部插槽数
                    this.numPcie = 0;

                    res.forEach(item => {
                        if (item.is_expansion == 0) {
                            this.sumPcie += item.component_count
                        }
                        if (item.is_expansion == 1) {
                            this.numPcie += item.component_count
                        }
                    })
                    console.log(this.sumPcie, this.numPcie)
                })
            },

            /*通过mode id 隐藏扩展柜*/
            expansionChange(bool, index, id) {

                if (bool) {

                    this.addExpansion[index].expansionType.forEach(item => {
                        if (item.id == id) {
                            this.origExpansion = item.description;
                        }
                        ;
                    })

                    /* id 为  1   24盘数据*/
                    this.mode1 = [
                        {
                            "mode": "24盘mode1",
                            "id": 1
                        },
                        {
                            "mode": "24盘mode2",
                            "id": 2
                        },
                        {
                            "mode": "24盘mode4",
                            "id": 3
                        }
                    ];
                    /* id 为  2   12盘数据*/
                    this.mode2 = [
                        {
                            "mode": "12盘mode1",
                            "id": 4
                        },
                        {
                            "mode": "12盘mode2",
                            "id": 5
                        },
                        {
                            "mode": "12盘mode4",
                            "id": 6
                        }
                    ];

                    /*  mode 数据 跟 选中的 数组id对比*/
                    let mode1 = this.mode1.filter(item => {
                        let mode = true
                        this.changeId.forEach((it, ind) => {

                            if (item.id == it && ind != index) {
                                return mode = false
                            }
                        })
                        return mode;
                    })

                    /* mode 数据 跟 选中的 数组id对比*/
                    let mode2 = this.mode2.filter(item => {
                        let mode = true
                        this.changeId.forEach((it, ind) => {

                            if (item.id == it && ind != index) {
                                return mode = false
                            }
                        })
                        return mode;
                    })

                    /* 获取 扩展柜下拉 数据，删除 赋值*/
                    let arr = [...this.selectModeData]
                    /* 当筛选数据为空  删除 扩展柜 id 1*/
                    if (mode1.length == 0) {
                        this.addExpansion[index].expansionType = [];
                        arr.splice(1, 1)
                    }
                    /* 当筛选数据为空  删除 扩展柜 id 2*/
                    if (mode2.length == 0) {
                        this.addExpansion[index].expansionType = [];
                        arr.splice(2, 1)
                    }
                    /*删除后 赋值 对应的 扩展柜 数据中*/
                    this.addExpansion[index].expansionType = arr;

                }
            },

            /*获取 数据  内部 外部 SAS 插槽数*/
            getSasPcie() {
                let getpcie = `select detail.id,detail.component_count,detail.is_expansion from product_programme_detail detail   join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where detail.category_id = 6 and detail.component_id = 38 and  product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'`
                console.log(getpcie)
                return new Promise((resolve, reject) => {
                    this.$db.all(getpcie, (err, res) => {
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
                }).then((res) => {
                    console.log(res)
                    this.sasSum = 0;
                    this.sasSumNum = 0;
                    res.forEach(item => {
                        if (item.is_expansion == 1) {
                            this.sasSum += item.component_count;
                        }

                        if (item.is_expansion == 0) {
                            this.sasSumNum += item.component_count;
                        }
                        console.log(this.sasSum);
                        console.log(this.sasSumNum)

                    })

                })
            },

            /*获取 mode 内部 外部  插槽数*/
            getMode(modeId) {
                let getpcie = `select detail.component_count,detail.is_expansion from product_programme_detail detail
join component_disk_modeoption mode on mode.category_id=detail.category_id and mode.id=detail.component_id
where  product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and component_id='${modeId}'`
                console.log(getpcie)
                return new Promise((resolve, reject) => {
                    this.$db.all(getpcie, (err, res) => {
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
                }).then((res) => {
                    console.log(res)
                    this.modeSum = 0;
                    this.modeSumNum = 0;
                    res.forEach(item => {
                        if (item.is_expansion == 1) {
                            this.modeSum = item.component_count;
                        }

                        if (item.is_expansion == 0) {
                            this.modeSumNum = item.component_count;
                        }
                        console.log(this.modeSum);
                        console.log(this.modeSumNum)
                    })

                })
            },

            /*获取  选中mode 的数量 和is_expansion*/
            getSelectMode(modeId, index) {
                let getpcie = `select detail.* from product_programme_detail detail
join component_disk_modeoption mode on mode.category_id=detail.category_id and mode.id=detail.component_id
where  product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and component_id='${modeId}'`
                console.log(getpcie)
                return new Promise((resolve, reject) => {
                    this.$db.all(getpcie, (err, res) => {
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
                }).then((res) => {
                    /*上次选中的内部mode 数量*/
                    this.orgInsideNum = 0;
                    /*上次选中的外部mode 数量*/
                    this.orgExternalNum = 0;
                    this.externalExpansion = 0;
                    this.insideExpansion = 0;
                    this.orgInside = -1;
                    this.orgExternal = -1;
                    this.orgInsideNums = -1;

                    this.orgExternalNums = -1;
                    console.log('之前的mode卡数' + this.addExpansion[index].orgModeNumber)
                    console.log(res)
                    res.forEach(item => {
                        if (item.is_expansion == 1) {
                            this.orgInside = item.is_expansion;
                            this.orgInsideNum = item.component_count * this.addExpansion[index].orgModeNumber;
                            this.orgInsideNums = item.component_count * 2;
                            this.insideExpansion = item.component_count;
                        }

                        if (item.is_expansion == 0) {
                            this.orgExternal = item.is_expansion;
                            this.orgExternalNum = item.component_count * this.addExpansion[index].orgModeNumber;
                            this.orgExternalNums = item.component_count * 2;
                            this.externalExpansion = item.component_count;
                        }
                    })
                })

            },

            /*-----------------------------硬盘扩展柜 线缆----------------------------------------------------------*/

            /*插入已选中的 扩展柜线缆数据*/
            cableBtn(ids, num, cableId) {
                let id = 0;
                const cable = `SELECT relation.powerline_id FROM relation_disk_expansioncase_powerline relation
join component_disk_expansioncase expan on expan.id=relation.disk_expansioncase_id
where expan.id='${ids}'`
                console.log(cable)
                this.$db.all(cable, (err, res) => {
                    if (err) {
                        console.log("查询失败")
                    } else {
                        console.log("查询成功", res)
                        if (cableId) {
                            id = cableId;
                        } else {
                            id = res[0].powerline_id;
                        }

                        /*---------------- 插入已选中的 扩展柜线缆数据----------------*/
                        if (this.cableId) {
                            const updateSql = `UPDATE product_programme_detail set component_count ='${num}'  where id=${this.cableId} and powerline_type=2`
                            console.log(updateSql)
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
                (product_id,category_id,component_id,seq_Key,'solution_id','template_id','machine_id','powerline_type','component_count')
                VALUES('${localStorage.productId}','8',${id},${time},'${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}',2,'${num}')`;
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
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '系统错误',
                                                    desc: err,
                                                });
                                                return
                                            }
                                            this.cableId = res.id;
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            },

            /*获取硬盘扩展柜线缆数据*/
            getCableData(id) {
                if (id != 0) {
                    const SQL = `select distinct powerline.id,info.description,info.description_en,info.status,info.withdraw_date from component_disk_expansioncase expan
                    left join relation_disk_expansioncase_powerline relation on relation.disk_expansioncase_id=expan.id
                  join component_powerline powerline  on relation.powerline_id=powerline.id
                  join component_base_info info on info.id=powerline.base_info_id
                  where expan.id ='${id}' and info.productId=${localStorage.productId}`;
                    this.$db.all(SQL, (err, res) => {
                        if (err) {

                        } else {
                            this.cableData = [...res];
                            this.cableModel = res[0].id;
                        }
                    })
                }

            },

            /*插入 扩展柜电源线*/
            powerCord(id, num) {
                /*---------------- 插入扩展柜电源线----------------*/
                if (this.cordId) {
                    const updateSql = `	 update product_programme_detail set component_id=(
  select power.id from component_power power
   join relation_disk_expansioncase_power relation on relation.power_id=power.id
   join component_disk_expansioncase expan on expan.id=relation.disk_expansioncase_id
   where  expan.id=${id}) ,component_count=${num} where id=${this.cordId}`
                    console.log(updateSql)
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log("修改失败")
                        } else {
                            console.log("修改成功")
                        }
                    })
                } else {
                    let time = new Date().getTime();
                    const SQL = `insert into product_programme_detail (product_id,machine_id,category_id,component_id,solution_id,template_id,component_count,is_expansion,seq_Key)

select distinct '${localStorage.productId}','${localStorage.machineId}',power.category_id,power.id,'${localStorage.solutionId}','${localStorage.templateId}',${num},0,${time} from component_disk_expansioncase expan
join relation_disk_expansioncase_power relation on relation.disk_expansioncase_id = expan.id
join component_power power on power.id=power_id
join component_base_info info on info.id = power.base_info_id
where expan.id= ${id} and info.productId = ${localStorage.productId}`;
                    console.log(SQL)
                    this.$db.run(SQL, (err, res) => {
                        if (err) {

                        } else {
                            if (res) {
                                console.log("添加失败")
                            } else {
                                console.log("添加成功" + JSON.stringify(res));
                                let selectSql = `select * from product_programme_detail where seq_Key=${time} and product_id=${localStorage.productId}`
                                this.$db.get(selectSql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '系统错误',
                                            desc: err,
                                        });
                                        return
                                    }
                                    this.cordId = res.id;
                                })
                            }
                        }
                    })
                }
            },
        },

        /*进入页面获取数据*/
        created() {
            /*---------------------------------硬盘扩展柜-------------------------------------------------------------*/

            /*获取扩展柜型号数据*/
            let than = this
            const SQL = `SELECT info.description,info.description_en,diskcase.id,info.status,info.ui_status,info.title_msg,info.withdraw_date,diskcase.disk_count FROM component_disk_expansioncase diskcase
join component_category cate on cate.id=diskcase.category_id
join component_base_info info on info.id=diskcase.base_info_id
where  info.productId=${localStorage.productId}`
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
                than.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {

                        /*添加默认请选择*/
                        res.unshift({
                            description_en: 'please choose',
                            description: '请选择',
                            id: 0,
                            withdraw_date: null,
                            title_msg: '',
                            ui_status: 0
                        })
                        res.forEach((item, index) => {
                            this.$set(item, 'temponTit', item.title_msg) //展示的描述
                            if (item.withdraw_date) {
                                let thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                let time = new Date(thisTime).getTime();//将时间改为时间戳
                                this.$set(res[index], 'time', time)//将时间戳添加到对象里面
                                this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                                //如果不为null的话,就改为天数
                                this.$store.commit('setStatusTime', item.withdraw_date)
                                this.$set(item, 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                            } else {
                                this.$set(res[index], 'time', '不比')//将时间戳添加到对象里面
                                this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                            }
                            this.$store.commit('uiStatusTime', item.ui_status)
                            this.$set(item, 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                            this.$set(item, 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                        });
                        if (this.array.length < 1) {
                            this.array = [...res];
                        }
                        this.selectModeData = [...res];
                        console.log(res)
                        /*获取扩展柜  product_programme_detail 数据*/
                        const SQLs = `select expan.id,info.description,info.description_en,mode.id mode_id,info.status,info.withdraw_date,detail.component_count from product_programme_detail detail
join component_disk_modeoption mode on mode.category_id=detail.category_id and mode.id=detail.component_id
join relation_disk_expansioncase_modeoption relation on relation.modeoption_id=mode.id
join component_disk_expansioncase expan on expan.id=relation.disk_expansioncase_id
join component_base_info info on expan.base_info_id=info.id
            where solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                        console.log(SQLs)
                        than.$db.all(SQLs, (err, res) => {
                            if (err) {

                            } else {
                                console.log(res)
                                this.diskCount = 0;
                                this.diskCountCard = 0;
                                let num = -1;
                                let nums = -1;
                                let diskCount = 0;
                                let diskCountNum = 0
                                if (res.length > 0) {
                                    /*当有数据 展示页面*/
                                    this.expansionShow = 0;

                                    res.forEach((item) => {
                                        /* 24盘 和 12 盘 带出的 硬盘 不同  通过diskCount 来判断是否调用 哪个盘的 硬盘数据 */
                                        if (item.id == 1) {
                                            nums = 1;
                                            diskCount += 24 * item.component_count;

                                        }

                                        if (item.id == 2) {
                                            num = 0
                                            diskCountNum += 12 * item.component_count;
                                        }

                                        this.diskCount = diskCount;
                                        this.diskCountCard = diskCountNum;
                                        console.log(num, nums)
                                        console.log(this.diskCount)

                                        /*获取扩展柜mode数据*/
                                        const SQLData = `select modeoption.mode,info.description_en,modeoption.id,info.withdraw_date,rc.connectingline_id from component_disk_modeoption modeoption
                            join relation_disk_expansioncase_modeoption casemode on casemode.modeoption_id=modeoption.id
                            join component_disk_expansioncase diskcase on diskcase.id=casemode.disk_expansioncase_id
                            join component_base_info  info on info.id=modeoption.base_info_id
														JOIN relation_disk_modeoption_connectingline rc ON rc.modeoption_id = modeoption.id
                            where diskcase.id=${item.id} and info.productId=${localStorage.productId}`

                                        than.$db.all(SQLData, (err, res) => {
                                            if (err) {

                                            } else {
                                                console.log(res)
                                                this.list = res.filter((itme) => {
                                                    /*标识为true*/
                                                    let num = true;
                                                    this.changeId.forEach((it) => {
                                                        if (itme.id == it) {
                                                            num = false;
                                                            return
                                                        }
                                                    })
                                                    return num;
                                                })
                                                let modeData = [...this.list];
                                                let modeDataList = [...res];

                                                this.addExpansion.push({
                                                    expansionType: [...this.array],
                                                    expansionTypeModel: item.id,
                                                    modeData: [...modeData],
                                                    modeDataList: [...modeDataList],
                                                    modeModel: '',
                                                    modeModelId: '',
                                                    modeNumber: 0,
                                                    modeModelNum: '',
                                                    orgModeNumber: 0,
                                                    modeId: '',
                                                    bool: false,
                                                    modeIds: '',
                                                    expansionCabinetId: item.id,
                                                    diskCount: '',
                                                    expansionNum: '',
                                                    expansionNumModel: '',
                                                })
                                            }
                                        })
                                    })

                                    this.$refs.mychild.getDataList(nums);
                                    console.log('bbbbbb')
                                    this.$refs.mychild.getDataListCard(num);
                                    console.log(nums, num)
                                    /*获取扩展柜mode  product_programme_detail 数据*/
                                    const SQLList = ` select detail.id detail_id, detail.component_id ,detail.component_count ,detail.is_expansion,mode.mode from product_programme_detail detail
join component_disk_modeoption mode on mode.category_id=detail.category_id and detail.component_id=mode.id
 where solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`

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
                                        than.$db.all(SQLList, (err, res) => {
                                            if (err) {

                                            } else {
                                                console.log(res)

                                                let changeId = [];
                                                let modeId = '';
                                                let modeIds = '';
                                                for (let i = 0; i < res.length; i++) {
                                                    if (res[i].is_expansion == 1) {
                                                        modeId = res[i].detail_id
                                                        console.log(modeId)
                                                    }
                                                    if (res[i].is_expansion == 0) {
                                                        modeIds = res[i].detail_id
                                                        console.log(modeIds)
                                                    }
                                                    changeId.push({
                                                        id: res[i].component_id,
                                                        modeNum: res[i].component_count,
                                                        isExpansion: res[i].is_expansion,
                                                        modeId: modeId,
                                                        modeIds: modeIds,
                                                    });
                                                }
                                                console.log(changeId)

                                                this.addExpansion.forEach((item, index) => {
                                                    /*
                                                    * mode数据是通过 扩展柜获取的数据 传id 产生，同而有异步获取的问题
                                                    * 所以 要通过扩展柜id 和 获取的id 比较  1 对应 123  2 对应456
                                                    * */
                                                    for (let i = 0; i < changeId.length; i++) {
                                                        /*  1 对应 123*/
                                                        console.log(changeId[i])
                                                        if (item.expansionTypeModel == 1 && changeId[i].id <= 3) {
                                                            item.modeModel = changeId[i].id;
                                                            item.modeModelId = changeId[i].id;
                                                            item.modeId = changeId[i].modeId;
                                                            item.isExpansion = changeId[i].isExpansion;
                                                            item.modeIds = changeId[i].modeIds;
                                                            item.expansionNumModel = changeId[i].modeNum;
                                                            item.modeModelNum = changeId[i].modeNum;
                                                            /*全局获取 已选中 id*/
                                                            this.changeId.push(changeId[i].id);
                                                            /*选中后 删除*/
                                                            return changeId.splice(i, 1)
                                                            /*  2 对应456 */
                                                        } else if (item.expansionTypeModel == 2 && changeId[i].id > 3) {
                                                            item.modeModel = changeId[i].id;
                                                            item.modeModelId = changeId[i].id;
                                                            item.modeId = changeId[i].modeId;
                                                            item.isExpansion = changeId[i].isExpansion;
                                                            item.modeIds = changeId[i].modeIds;
                                                            item.expansionNumModel = changeId[i].modeNum;
                                                            item.modeModelNum = changeId[i].modeNum;
                                                            /*全局获取 已选中 id*/
                                                            this.changeId.push(changeId[i].id);
                                                            /*选中后 删除*/
                                                            return changeId.splice(i, 1)
                                                        }
                                                    }
                                                })

                                                console.log(this.addExpansion)

                                                /* 获取  12盘 24盘 的值*/
                                                this.addExpansion.forEach((item, index) => {
                                                    item.expansionType.forEach(it => {
                                                        console.log(it)
                                                        if (item.expansionTypeModel == it.id) {
                                                            this.addExpansion[index].diskCount = it.disk_count
                                                        }
                                                    })
                                                })

                                                console.log(this.addExpansion)
                                                this.addExpansion = this.addExpansion.filter((item, index) => {
                                                    let num = true
                                                    this.addExpansion.forEach((it, ind) => {
                                                        if (index <= ind) {
                                                            return
                                                        }
                                                        if (item.modeModel == it.modeModel) {
                                                            if (it.isExpansion == 0) {
                                                                this.addExpansion[ind].modeId = it.modeId
                                                                // this.$set(this.addExpansion[index],'modeIds',it.modeIds)
                                                                this.addExpansion[ind].expansionNumModel += item.expansionNumModel
                                                                this.addExpansion[ind].modeModelNum = this.addExpansion[ind].expansionNumModel
                                                            }
                                                            if (it.isExpansion == 1) {
                                                                this.addExpansion[ind].modeIds = it.modeIds
                                                                this.addExpansion[ind].expansionNumModel += item.expansionNumModel
                                                                this.addExpansion[ind].modeModelNum = this.addExpansion[ind].expansionNumModel
                                                            }
                                                            num = false
                                                            return
                                                        }
                                                    })
                                                    return num
                                                })

                                                console.log(this.addExpansion)

                                                this.addExpansion.forEach((item, index) => {
                                                    /*获取 mode 硬盘卡数*/
                                                    const Sql = `SELECT card_base_cnt FROM component_disk_modeoption where id ='${item.modeModel}'`
                                                    console.log(Sql)
                                                    this.$db.get(Sql, (er, res) => {
                                                        if (er) {

                                                        } else {
                                                            if (res) {
                                                                this.addExpansion[index].modeNumber = res.card_base_cnt;
                                                            } else {
                                                                this.addExpansion[index].modeNumber = 0;
                                                            }

                                                        }
                                                    })
                                                })

                                                /*点击 获取 扩展柜硬盘数据*/
                                                this.getDiskData();

                                                /*获取扩展柜数量*/
                                                this.getExpansionNum(true, 0);
                                            }
                                        })
                                    })
                                } else {
                                    /*获取扩展柜型号数据*/
                                    this.getExpansionData();
                                }
                            }
                        })
                    }

                })
            })

            /*---------------------------------硬盘扩展柜 线缆----------------------------------------------------------*/


            /*从 product_programme_detail 获取扩展柜线缆*/
            const SQLl = ` select distinct powerline.id,info.description,info.description_en,info.status,info.ui_status,info.title_msg,info.withdraw_date  from component_disk_expansioncase expan
                    left join relation_disk_expansioncase_powerline relation on relation.disk_expansioncase_id=expan.id
                  join component_powerline powerline  on relation.powerline_id=powerline.id
                  join component_base_info info on info.id=powerline.base_info_id
                  where expan.id = 2 and info.productId=${localStorage.productId}`
            console.log(SQLl)
            new Promise(function (resolve, reject) {
                than.$db.all(SQLl, (err, res) => {
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
            }).then((res) => {
                console.log(res)
                res.forEach((item, index) => {
                    this.$set(item, 'temponTit', item.title_msg) //展示的描述
                    if (item.withdraw_date) {
                        let thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                        let time = new Date(thisTime).getTime();//将时间改为时间戳
                        this.$set(res[index], 'time', time)//将时间戳添加到对象里面
                        this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                        //如果不为null的话,就改为天数
                        this.$store.commit('setStatusTime', item.withdraw_date)
                        this.$set(item, 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                    } else {
                        this.$set(res[index], 'time', '不比')//将时间戳添加到对象里面
                        this.$set(item, 'setTimeMe', item.withdraw_date)//过期的时间
                    }
                    this.$store.commit('uiStatusTime', item.ui_status)
                    this.$set(item, 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                    this.$set(item, 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                });
                this.cableData = [...res];
                this.cableModel = res[0].id;

                /*从 product_programme_detail 获取扩展柜线缆*/
                const SQLCable = ` 	select detail.* from product_programme_detail detail
	join component_powerline line on detail.category_id=line.category_id and detail.component_id = line.id
	where detail.powerline_type=2 and detail.component_id=5 and
	 solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
                console.log(SQLCable)
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
                }).then((res) => {
                    than.$db.all(SQLCable, (err, res) => {
                        if (err) {

                        } else {
                            console.log(res)
                            if (res.length > 0) {
                                res.forEach((item) => {
                                    if (item.component_id == 5) {
                                        // console.log(this.cableData.length)
                                        if (this.cableData.length > 0) {

                                            this.cableModel = item.component_id;
                                            this.cableId = item.id;
                                            this.cableNumModel = item.component_count;

                                        }
                                    }
                                })
                            }
                        }
                    })
                })
            })

            /*从 product_programme_detail 获取扩展柜线缆*/
            const SQLCable = ` 	SELECT detail.id,component_id FROM product_programme_detail detail
join component_power power on detail.category_id=power.category_id and detail.component_id =power.id
where power.id=2 and  solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}'
                and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'`
            console.log(SQLCable)
            new Promise(function (resolve, reject) {
                than.$db.all(SQLCable, (err, res) => {
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
            }).then((res) => {
                if (res.length > 0) {
                    this.cordId = res[0].component_id;
                }
            })
        },


        /* 获取component_category 表中id */
        beforeRouteEnter(from, to, next) {
            next(vm => {
                vm.$emit('comup', from.query.id);
                if (vm.addExpansion.length > 0) {
                    vm.getExpansionNum(true, 0);
                }
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
        }

        .cable {
            width: 523px;
        }
    }

    .config .expansion {
        width: 250px;

        .expansion-input {
            width: 250px;
        }

    }

    .expansion-margin {
        margin-right: 17px;
    }

    /*----------其他select修改宽度----------------*/
    .other .config .el-select {
        width: 100px;
    }

    .other .config .other-select-two {
        width: 400px;
        margin-left: 30px;
    }

    .modify {
        margin: 40px 0;
    }

    .dele {
        margin-left: 20px;
    }
</style>
