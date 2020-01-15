<template>
    <!--外部pcie-->
    <div class="externalPcie">
        <div class="interior-hea content-label">{{$t('ExternalPcieChild.expansionTank')}}</div>
        <div class="for-main externalPcie-hea">
            <!--选择是否要外部pcie-->
            <el-select v-model="pcieOff" size="mini" @change="Off(pcieOff)">
                <el-option
                        v-for="(item,index) in pcieSwitch"
                        :key="index"
                        :label="$store.state.info_language?item.info_language:item.language"
                        :value="index">
                </el-option>
            </el-select>
            <p v-show="pcieOff">*</p>
            <!--外部pcie的数量-->
            <el-select v-model="pcieSum" size="mini" class="sel" v-show="pcieOff" @change="setPcieSum(pcieSum)">
                <el-option
                        v-for="item in Math.ceil(pcieNum/2)"
                        :key="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button size="mini" type="info" icon="el-icon-close" circle class="externalPcie-butt"  v-show="pcieOff" @click="Off(0)"></el-button>

            <div v-for="dl in pcieSwitch" v-if="pcieOff==1" :key="dl.language">
                <div class="pdiv" v-if="dl.temponTit!=null">
                    {{dl.temponTit}}
                </div>
                <div class="pdiv red-a" v-if="dl.uiStatus">
                    {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                </div>
                <div class="pdiv" v-if="dl.setTimeMe">
                    {{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{dl.setTimeMe}}&gt;  {{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}} <{{dl.overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}
                    <!--此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天-->
                </div>
            </div>
            <!--第二个-->
            <div v-show="pcieOff" class="externalPcie-hea-tw">
                <!--外部pcie的内瓤，展示的是ej20-->
                <el-select v-model="$store.state.info_language?unfinEn:unfine" size="mini" disabled>
                    <el-option
                            v-for="(item,index) in pcieExternal"
                            :key="item"
                            :label="item"
                            :value="index">
                    </el-option>
                </el-select>
                <p>*</p>
                <!--外部pcie的内瓤，最小是外部pcie的数量，最大x2-->
                <el-select v-model="externalSum" size="mini" class="sel" @change="updatePcieSum(externalSum)"
                           @visible-change="beforPcieSum($event,pcieNum)">
                    <el-option
                            v-for="(item,index) in externalNum"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <div v-for="dl in externalZhan"  key="dl.id">
                    <div class="pdiv" v-if="dl.temponTit!=null">
                        {{dl.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="dl.uiStatus">
                        {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="dl.setTimeMe">
                        {{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{dl.setTimeMe}}&gt;  {{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}} <{{dl.overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}
                        <!--此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天-->
                    </div>
                </div>
            </div>
        </div>
        <!--下面的内容-->
        <div v-show="pcieOff" class="for-main">
            <div class="interior-hea content-label">{{$t('ExternalPcieChild.extensionCabinetCable')}}</div>
            <!--连接线的数据-->
            <div class="externalPcie-hea-tw" v-for="(it,ind) in cableNum">
                <el-select v-model="it.id" size="mini" @change="updateCable(ind,0)"
                           @visible-change="beforCable($event,ind)">
                    <el-option
                            v-for="(item,index) in it.cable"
                            :key="index"
                            :label="$store.state.info_language?item.description_en:item.description"
                            :value="item.id">
                    </el-option>
                </el-select>
                <p>*</p>
                <el-select v-model="it.num" size="mini" class="sel" @change="updateCable(ind,it.num)"
                           @visible-change="beforCableSum($event,ind)">
                    <el-option
                            v-for="(item,index) in it.numZ"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-button size="mini" type="info" icon="el-icon-close" circle class="externalPcie-butt"
                           v-show="cableNum.length>1?1:0" @click="deleteCable(ind)"></el-button>

                <div v-for="dl in it.cable" v-if="it.id==dl.id" :key="dl.id">
                    <div class="pdiv" v-if="dl.temponTit!=null">
                        {{dl.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="dl.uiStatus">
                        {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="dl.setTimeMe">
                        {{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{dl.setTimeMe}}&gt;  {{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}} <{{dl.overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}
                        <!--此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天-->
                    </div>
                </div>
            </div>
            <!--增加板块-->
            <div class="externalPcie-hea-pic">
                <el-button icon="el-icon-plus" size="mini" :disabled="cableOff" @click="addCable()"></el-button>
                {{$t('ExternalPcieChild.AdditionalCable')}}
            </div>
            <div class="externalPcie-hea-tw" v-for="(it,ind) in thePowerCordNum">
                <el-select v-model="it.id" size="mini" @change="updateThePowerCordNum(ind,0)"
                           @visible-change="beforThePowerCord($event,ind)">
                    <el-option
                            v-for="(item,index) in it.thePowerCord"
                            :key="index"
                            :label="$store.state.info_language?item.description_en:item.description"
                            :value="item.id">
                    </el-option>
                </el-select>
                <p>*</p>
                <el-select v-model="it.num" size="mini" class="sel" @change="updateThePowerCordNum(ind,it.num)"
                           @visible-change="beforThePowerCordSum($event,ind)">
                    <el-option
                            v-for="(item,index) in it.numZ"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-button size="mini" type="info" icon="el-icon-close" circle class="externalPcie-butt"
                           v-show="thePowerCordNum.length>1?1:0" @click="deleteThePowerCordNum(ind)"></el-button>

                <div v-for="dl in it.thePowerCord" v-if="it.id==dl.id" :key="dl.id">
                    <div class="pdiv" v-if="dl.temponTit!=null">
                        {{dl.temponTit}}
                    </div>
                    <div class="pdiv red-a" v-if="dl.uiStatus">
                        {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                    </div>
                    <div class="pdiv" v-if="dl.setTimeMe">
                        {{$t('backPlane.PartsDiscontinued.PartsDiscontinued')}}<{{dl.setTimeMe}}&gt;  {{$t('backPlane.PartsDiscontinued.StopProduction')}}。{{$t('backPlane.PartsDiscontinued.DistanceFromProductionStopDate')}} <{{dl.overdueTime}}&gt; {{$t('backPlane.PartsDiscontinued.day')}}
                        <!--此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天-->
                    </div>
                </div>
            </div>
            <!--电源线描述-->
            <br/>
            <div>
                {{$t('ExternalPcieChild.DescriptionOfPowerCord')}}:
            </div>
            <!--增加板块-->
            <div class="externalPcie-hea-pic">
                <el-button icon="el-icon-plus" size="mini" :disabled="thePowerCordOff"
                           @click="addThePowerCordNum()"></el-button>
                {{$t('Power.lists.PowerLine.content1')}}
            </div>
            <!--外部pcie里面pcie的配置-->
            <External-pcie-child :externalSum="externalSum" :sign="this.$route.query.sign" :cableNum="cableNum[0]"
                                 ref="externalChild" :pcieSwitch="queAS" :childType="childType"/>
        </div>
    </div>
</template>

<script>
    import ExternalPcieChild from './ExternalPcieChild.vue'

    export default {
        name: "ExternalPcie",
        components: {
            ExternalPcieChild
        },
        data() {
            return {
                queAS:this.$store.state.info_language?'please choose':'请选择',//默认显示时，请选择的中英文切换
                cpu: 1,//默认cpu的数量
                pcieSwitch: [{language:'请选择',info_language:'please choose ',setTimeMe:null,overdueTime:'',temponTit:null,uiStatusEn:'',uiStatus:''}],//选择是否添加外部pcie的数组
                pcieOff: 0,//选择时为1  要不为0 v-show的
                pcieExternal: [],//ej20的展示
                unfine: 0,//ej20的展示
                unfinEn:0,//ej20的展示英文
                pcieNum: 1,//最多可选的外部pcie的数量  Math.ceil((8-num)/2)
                pcieSum: 0,//选中的外部pcie的数量
                pcieupId: '',//库里外部pcie扩展柜的id，记录下来好改值
                externalNumId: '',//库里外部pcie内瓤的id，记录下来好改值
                externalNum: [], //外部pcie的内瓤，最小是外部pcie的数量，最大x2
                externalSum: 0, //选中的外部pcie的内瓤的数量
                cable: [],//连接线的内容
                cableNum: [],//连接线最外层的数组
                cableOff: false,//是否禁用添加连接线按钮
                cableId: [],//记录已经选择过的连接线的id
                thePowerCord: [],//电源线的内容
                thePowerCordNum: [],//电源线最外层的数组
                thePowerCordOff: false,//是否禁用添加电源线按钮
                thePowerCordId: [],//记录已经选择过的电源线线的id
                ej20Id: '',//ej20的id。
                externalNUM: 0,//这个是内部pcie里面ej20的数
                bool: false,//布尔值，如果为true的话，就可以删除外部pcie和减少内瓤、外壳数
                pcieSumClone: 0,//记录选中的外部pcie的数量，用来判断，如果不能更改的话，就要回退为这个数
                externalSumClone: 0,//记录选中的内瓤的数量，用来判断，如果不能更改的话，就要回退为这个数
                numNS:0,//默认值，第一次进入页面不执行，第二次在执行
                pcie:1,//内部pcie的x16_4数，只要大于一就可以添加
                diaId:'',//  查询库里电源转换通道的id  记录下来，后面更改数量
                externalZhan:[{}],//ej20下面展示的数据,
                childType:[],//要选的lan卡的数据
            }
        },
        methods: {
            /*点击是否添加外部pcie*/
            async Off(index) {
                /*如果添加的话，就为true，添加数据*/
                console.log(this.pcieOff, index)
                if (index) {
                    if(!this.pcie){//如果内部pcie的数量小于1的话就不能添加
                        this.err(this.$t('error.PCIeExpansion'))
                        this.pcieOff=0
                        return
                    }
                    /*插入到库里的数据*/
                    const SQL = `insert into product_programme_detail (product_id,machine_id,category_id,component_id,solution_id,template_id,component_count,is_expansion,powerline_type)

select '${localStorage.productId}','${localStorage.machineId}',io.category_id,io.id,'${localStorage.solutionId}','${localStorage.templateId}',1,0,0 from component_iocard io
join component_base_info info on info.id=io.base_info_id and info.component_FC='5899' and info.productId='${localStorage.productId}'


union

select '${localStorage.productId}','${localStorage.machineId}',line.category_id,line.id,'${localStorage.solutionId}','${localStorage.templateId}',2,0,1 from component_expansioncase expan
join relation_expansioncase_powerline relation on relation.expansioncase_id=expan.id
join component_powerline line on line.id=relation.powerline_id
join component_base_info info on info.id=expan.base_info_id
where info.productId='${localStorage.productId}'

union

select '${localStorage.productId}','${localStorage.machineId}',con.category_id,con.id,'${localStorage.solutionId}','${localStorage.templateId}',1,0,0 from component_expansioncase expan
join relation_expansioncase_powerconversion relation on relation.expansioncase_id=expan.id
join component_powerconversion con on con.id=relation.powerconversion_id
join component_base_info info on info.id=expan.base_info_id
where info.productId='${localStorage.productId}'

union

select '${localStorage.productId}','${localStorage.machineId}',expan.category_id,expan.id,'${localStorage.solutionId}','${localStorage.templateId}',1,0,0 from component_expansioncase expan
join component_base_info info on info.id=expan.base_info_id
where info.productId='${localStorage.productId}'


union

select '${localStorage.productId}','${localStorage.machineId}',flesh.category_id,flesh.id,'${localStorage.solutionId}','${localStorage.templateId}',1,0,0 from component_expansioncase expan
join relation_expansioncase_expansionflesh relation on relation.expansioncase_id=expan.id
join component_expansionflesh flesh on flesh.id=relation.expansionflesh_id
join component_base_info info on info.id=expan.base_info_id
where info.productId='${localStorage.productId}'

union

select '${localStorage.productId}','${localStorage.machineId}',category_id,id,'${localStorage.solutionId}','${localStorage.templateId}',2,0,0 from component_connectingline where id=
(select line.id from component_connectingline line join component_base_info info on info.id=line.base_info_id and line_type=0 where info.component_FC='ECCS' and info.productId=${localStorage.productId})`;
                    /*添加ej20的sql'*/
                    const SQL1 = `INSERT INTO product_programme_detail(product_id,category_id,component_id,component_count,template_id,solution_id,machine_id,is_expansion)
select distinct '${localStorage.productId}',io.category_id,io.id,1,'${localStorage.templateId}','${localStorage.solutionId}','${localStorage.machineId}',1 from component_iocard io
 join relation_expansionflesh_iocard relation on relation.iocard_id=io.id
 join component_expansionflesh flesh on relation.expansionflesh_id=flesh.id
  join component_base_info info on info.id=io.base_info_id
where info.productId='${localStorage.productId}'
`;
                    /*查询库里ej20存不存在*/
                    let externalPcieSQL = `select detail.id,detail.component_count,detail.is_expansion from product_programme_detail  detail
											join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id

where is_expansion=1 and component_id in (
select distinct io.id from component_iocard io
 join relation_expansionflesh_iocard relation on relation.iocard_id=io.id
 join component_expansionflesh flesh on relation.expansionflesh_id=flesh.id
)
and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'`
                    this.$db.run(SQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        }
                        this.$db.get(externalPcieSQL, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '数据获取失败',
                                    desc: err,
                                });
                            } else {
                                console.log(res,SQL,externalPcieSQL)
                                if (res) {
                                    let updateExternal = `UPDATE product_programme_detail set 'component_count'='${res.component_count + 1}' where id=${res.id} `;
                                    this.$db.run(updateExternal, (err, res) => {
                                        if (err) {
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: '搜索失败',
                                                desc: err,
                                            });
                                        } else {
                                            console.log('修改成功')
                                            const seleSQL = `SELECT * from product_programme_detail where product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and is_expansion in(0)`;
                                            this.$db.all(seleSQL, (err, res) => {
                                                if (err) {
                                                    this.$logger(err);
                                                    this.$Notice.error({
                                                        title: '数据获取失败',
                                                        desc: err,
                                                    });
                                                } else {
                                                    /*查询库里扩展柜,并设置扩展柜的最大值，当前值，内瓤的值与内瓤的最大值*/
                                                    this.seleExterna()
                                                    //外部pcie的方法
                                                    this.$refs.externalChild.getPcie()
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    this.$db.all(SQL1, (err, res) => {
                                        if (err) {
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: '数据获取失败',
                                                desc: err,
                                            });
                                        }
                                        /* 添加完数据后，获取库里的数据 */
                                        const seleSQL = `SELECT * from product_programme_detail where product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and is_expansion in(0)`;
                                        this.$db.all(seleSQL, (err, res) => {
                                            if (err) {
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '数据获取失败',
                                                    desc: err,
                                                });
                                            } else {
                                                console.log(res, seleSQL)
                                                /*查询库里扩展柜,并设置扩展柜的最大值，当前值，内瓤的值与内瓤的最大值*/
                                                this.seleExterna()
                                                //外部pcie的方法
                                                this.$refs.externalChild.getPcie()
                                            }
                                        })
                                    })
                                }
                            }
                        })

                    })
                } else {
                    console.log(11111,this.$refs.externalChild.hardDiskId)
                    await this.getExternalPcie(0)
                    console.log(222222)
                    if(this.$refs.externalChild.hardDiskId){
                        this.err(this.$t('error.IOExpansion'))
                        //您的外部硬盘扩展柜占用外部PCIe的插槽，所以不能删除IO扩展柜
                        this.pcieOff = 1
                        return
                    }
                    if (this.bool) {
                        this.err(this.$t('error.IOExpansionEnclosure'))
                        //'您的外部PCIe卡不为空，所以不能删除IO扩展柜'
                        this.pcieOff = 1
                        return
                    }
                    /*如果选择为false的话，删除完库里的数据,但是不行没有了pcie卡*/
                    // const deleteSQL =  `delete from product_programme_detail where product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and is_expansion in (0)`
                    let arr = []
                    this.cableNum.forEach(item => {
                        arr.push(item.upId)
                    })
                    this.thePowerCordNum.forEach(item => {
                        arr.push(item.upId)
                    })
                    arr.push(this.externalNumId)
                    arr.push(this.pcieupId)
                    arr.push(this.diaId)
                    console.log([...arr], this.cableNum, this.thePowerCordNum)
                    let deleteSQL = `delete from product_programme_detail where id in (${[...arr]})`

                    this.$db.all(deleteSQL, (err, res) => {
                        console.log(deleteSQL, res);
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        } else {
                            console.log('删除成功')
                            this.pcieOff=0
                            if (this.externalNUM) {
                                let updateEj20Sum = `update product_programme_detail set component_count='${this.externalNUM}' where id='${this.ej20Id}'`
                                this.$db.run(updateEj20Sum, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '数据获取失败',
                                            desc: err,
                                        });
                                    } else {
                                        console.log('删除外部PCIe成功，修改ej20成功')
                                    }
                                })
                            } else {
                                let deleteExternal = `delete from product_programme_detail where id='${this.ej20Id}'`
                                this.$db.run(deleteExternal, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '数据获取失败',
                                            desc: err,
                                        });
                                    } else {
                                        console.log('全部删除成功')
                                    }
                                })
                            }
                        }
                    })
                }
            },
            /*更改外部pcie的外瓤数量*/
            async setPcieSum(sum) {
                await this.getExternalPcie(sum * 2 * 6)
                if (this.bool) {
                    this.err(this.$t('error.beReduced'))
                    //console.log('您的外部PCIe卡大于所选的槽数，所以不能减少外部PCIe的数量')
                    this.pcieSum = this.pcieSumClone//如果不符合的话就返回的原来的数
                    return
                }
                let setPcieSum = `update product_programme_detail set component_count='${sum}' where id='${this.pcieupId}'`
                let setdiaSum = `update product_programme_detail set component_count='${sum}' where id='${this.diaId}'`
                console.log(this.externalSum, sum)
                this.$db.run(setPcieSum, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    } else {
                        this.$db.run(setdiaSum, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '数据获取失败',
                                    desc: err,
                                });
                            } else {
                                console.log('修改成功')
                            }
                        })
                        this.pcieSumClone = sum //记录外壳的值
                        if (this.externalSum < sum * 2 - 1) {
                            /*如果小于扩展柜的最小数就改为最小数*/
                            this.updatePcieSum(sum * 2 - 1)
                        } else if (this.externalSum > sum * 2) {
                            /*如果大于扩展柜的最大数就改为最大数,的二个参数仅为判断，看是不是在这执行的*/
                            this.updatePcieSum(sum * 2, sum * 2)
                        }
                    }
                })
            },
            /*获取外部pcie内瓤的数量*/
            getPcieSum() {
                let setPcieSum = `select detail.id,detail.component_count,info.description,info.description_en,info.status,info.withdraw_date,info.ui_status,info.title_msg,so.ship_date
				from product_programme_detail detail
				join component_expansionflesh flesh on flesh.category_id=detail.category_id
				join component_base_info info on flesh.base_info_id=info.id
				join product_info product on product.id=info.productId
				join relation_solution_product relation on relation.product_id = product.id
				join solution so on so.id = relation.solution_id
                 where detail.solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and detail.product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='0'`
                /*查询EJ20的id*/
                let externalPcieSQL = `select detail.id,detail.component_count,detail.is_expansion from product_programme_detail  detail
											join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id

where is_expansion=1 and component_id in (
select distinct io.id from component_iocard io
 join relation_expansionflesh_iocard relation on relation.iocard_id=io.id
 join component_expansionflesh flesh on relation.expansionflesh_id=flesh.id
)
and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'`
                this.$db.get(setPcieSum, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    } else {
                        console.log(res)
                        this.externalSum = res.component_count//内瓤的当前值
                        this.externalSumClone = res.component_count//记录内瓤的当前值
                        this.externalNumId = res.id
                        this.unfine = res.description//ej20的展示
                        this.unfinEn=res.description_en
                        this.$set(this.externalZhan[0],'temponTit',res.title_msg) //展示的描述
                        this.$set(this.externalZhan[0],'setTimeMe',res.withdraw_date)//过期的时间
                        if(res.withdraw_date!=null){
                            //如果不为null的话,就改为天数
                            this.$store.commit('setStatusTime',res.withdraw_date)
                            this.$set(this.externalZhan[0],'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                        }
                        this.$store.commit('uiStatusTime',res.ui_status)
                        this.$set(this.externalZhan[0],'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                        this.$set(this.externalZhan[0],'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                        /*查询EJ20的id*/
                        this.$db.get(externalPcieSQL, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '数据获取失败',
                                    desc: err,
                                });
                            } else {
                                this.ej20Id = res.id//ej20的id。
                                this.externalNUM = res.component_count - this.externalSum
                            }
                        })
                    }
                })
            },
            /*点击ej20的时候的数量变化*/
            beforPcieSum(bool) {
                if (bool) {
                    this.externalNum = []
                    for (let i = this.pcieSum * 2 - 1; i <= this.pcieNum; i++) {
                        if (i <= this.pcieSum * 2) {
                            this.externalNum.push(i)
                        }
                    }
                }
            },
            /*点击连接线时要展示的类型*/
            beforCable(bool, index) {
                if (bool) {
                    let gettime= new Date().getTime() //获取现在的时间戳
                    let arr = this.cable.filter(item => {
                        let num = true
                        if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
                            return false //如果时间小于现在时间，也就说过市了，不在显示
                        }
                        //如果已经有了的就不用再添加了
                        for (let i = 0; i < this.cableId.length; i++) {
                            if (item.id == this.cableId[i] && this.cableId[i] !== this.cableNum[index].id) {
                                return num = false
                            }
                        }
                        return num
                    })
                    this.cableNum[index].cable = arr
                    console.log(arr, this.cableNum[index])
                }
            },
            /*点击连接线时要展示的数量*/
            beforCableSum(bool, index) {
                if (bool) {
                    console.log(bool, this.cableNum[index])
                    let num = 0
                    this.cableNum.forEach((item, i) => {
                        if (i !== index) {
                            num += item.num
                        }
                    })
                    //要展示的数量
                    this.cableNum[index].numZ = []
                    for (let i = 0; i <= (this.externalSum * 2 + 20 - num); i++) {
                        if (i >= this.externalSum * 2 && i % 2 == 0) {
                            this.cableNum[index].numZ.push(i)
                        }
                    }
                    console.log(this.cableNum[index])
                }
            },
            /*点击电源线线时要展示的类型*/
            beforThePowerCord(bool, index) {
                if (bool) {
                    let gettime= new Date().getTime() //获取现在的时间戳
                    let arr = this.thePowerCord.filter(item => {
                        let num = true
                        if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
                            return false //如果时间小于现在时间，也就说过市了，不在显示
                        }
                        //如果已经有了的就不用再添加了
                        for (let i = 0; i < this.thePowerCordId.length; i++) {
                            if (item.id == this.thePowerCordId[i] && i !== index) {
                                return num = false
                            }
                        }
                        return num
                    })
                    this.thePowerCordNum[index].thePowerCord = arr
                    console.log(arr, this.thePowerCordNum[index])
                }
            },
            /*点击电量线时要展示的数量*/
            beforThePowerCordSum(bool, index) {
                if (bool) {
                    let num = 0
                    this.thePowerCordNum.forEach((item, i) => {
                        if (i !== index) {
                            num += item.num
                        }
                    })
                    //要展示的数量
                    this.thePowerCordNum[index].numZ = []
                    for (let i = 0; i <= (this.externalSum * 2 + 20 - num); i++) {
                        if (i >= this.externalSum * 2 && i % 2 == 0) {
                            this.thePowerCordNum[index].numZ.push(i)
                        }
                    }
                    console.log(this.thePowerCordNum[index])
                }
            },
            /*修改外部pcie内瓤的数量*/
            async updatePcieSum(sum, bool) {
                console.log(11111)
                await this.getExternalPcie(sum * 6)
                console.log(222222, this.externalSumClone)
                if (this.bool) {
                    this.err(this.$t('error.externalPCIe'))
                    //console.log('您的外部PCIe卡大于所选的槽数，所以不能减少外部PCIe的内瓤的数量')
                    this.externalSum = this.externalSumClone//如果不符合的话就返回的原来的数
                    return
                }
                let updatePcieSum = `update product_programme_detail set component_count='${sum}' where id='${this.externalNumId}'`
                let updateEj20Sum = `update product_programme_detail set component_count='${sum + this.externalNUM}' where id='${this.ej20Id}'`
                this.$db.run(updatePcieSum, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    } else {
                        console.log('完成', updatePcieSum, res, '未完还有添加')
                        /*修改ej20的数量*/
                        this.$db.run(updateEj20Sum, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '数据获取失败',
                                    desc: err,
                                });
                            } else {
                                /*修改成功就行，不需要改东西*/
                            }
                        })
                        this.getCpc()//修改成功后重新获取可选择的插槽数
                        let nun = 0
                        let nuv = 0
                        this.externalSum = sum
                        this.externalSumClone = sum//记录内瓤的当前值
                        this.cableNum.forEach(item => {
                            nun += item.num //所有连接线的数
                        })
                        this.thePowerCordNum.forEach(item => {
                            nuv += item.num //所有电源线的数
                        })
                        if (nun < sum * 2) {//如果连接线的数量少于最小数时，将它0下标更改为最小数-现有的
                            this.updateCable(0, (sum * 2 - nun + this.cableNum[0].num))//总数减去所有的，在加上第一个的数量
                        }
                        if (nuv < sum * 2) {//如果电源线的数量少于最小数时，将它更改为最小数-现有的
                            this.updateThePowerCordNum(0, (sum * 2 - nuv + this.cableNum[0].num))//总数减去所有的，在加上第一个的数量
                        }
                    }

                })
            },
            /*修改连接线的参数id，数量*/
            updateCable(index, sum) {
                console.log(sum,this.cableNum[index])
                if (sum === 0) {
                    sum = this.pcieSum * 2
                    this.cableNum[index].num = sum
                }
                let updatecable = `update product_programme_detail set  component_id='${this.cableNum[index].id}',component_count='${sum}' where id='${this.cableNum[index].upId}'`
                this.$db.run(updatecable, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    } else {
                        /*获取库里外部pcie的连接线数据*/
                        this.setECable(1)
                    }
                })
            },
            /*修改电源线的参数id，数量*/
            updateThePowerCordNum(index, sum) {
                if (sum === 0) {
                    sum = this.pcieSum * 2
                    this.thePowerCordNum[index].num = sum
                }
                let updatecable = `update product_programme_detail set  component_id='${this.thePowerCordNum[index].id}',component_count='${sum}' where id='${this.thePowerCordNum[index].upId}'`
                this.$db.run(updatecable, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    }
                    /*获取库里外部pcie的连接线数据*/
                    this.setEThePowerCord()
                })
            },
            /*删除连接线的类型*/
            deleteCable(index) {
                const deleteCable = `DELETE FROM product_programme_detail where id='${this.cableNum[index].upId}'`
                this.$db.run(deleteCable, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    }
                    /*获取库里外部pcie的连接线数据*/
                    this.setECable()
                    console.log('删除完成')
                })
            },
            /*删除电源线线的类型*/
            deleteThePowerCordNum(index) {
                let deleteThePowerCordNum = `DELETE FROM product_programme_detail where id='${this.thePowerCordNum[index].upId}'`
                this.$db.run(deleteThePowerCordNum, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    }
                    /*获取库里外部pcie的连接线数据*/
                    this.setEThePowerCord()
                    console.log('删除完成')
                })
            },
            /*添加连接线的类型*/
            addCable() {
                let arr = this.cable.filter(item => {
                    let num = true
                    //如果已经有了的就不用再添加了
                    for (let i = 0; i < this.cableId.length; i++) {
                        if (item.id == this.cableId[i]) {
                            return num = false
                        }
                    }
                    return num
                })
                if (arr.length <= 0) {
                    return
                } else {
                    let addsql = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.$route.query.idExternalLine}','${arr[0].id}','2','${localStorage.solutionId}','${localStorage.templateId}','0')`
                    this.$db.get(addsql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        }
                        /*获取库里外部pcie的连接线数据*/
                        this.setECable()
                    })
                }
            },
            /*添加连接线的类型*/
            addThePowerCordNum() {
                let arr = this.thePowerCord.filter(item => {
                    let num = true
                    //如果已经有了的就不用再添加了
                    for (let i = 0; i < this.thePowerCordId.length; i++) {
                        if (item.id == this.thePowerCordId[i]) {
                            return num = false
                        }
                    }
                    return num
                })
                if (arr.length <= 0) {
                    return
                } else {
                    let addsql = `INSERT INTO product_programme_detail('product_id','machine_id','category_id','component_id','component_count','solution_id','template_id','is_expansion','powerline_type') VALUES('${localStorage.productId}','${localStorage.machineId}','${this.$route.query.signT}','${arr[0].id}','2','${localStorage.solutionId}','${localStorage.templateId}','0',1)`
                    this.$db.get(addsql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        }
                        /*获取库里外部pcie的连接线数据*/
                        this.setEThePowerCord()
                    })
                }
            },
            /*获取扩展柜*/
            getExterna() {
                // let externa = `SELECT detail.id,info.description,info.description_en,detail.component_count,info.status,info.withdraw_date from product_programme_detail detail join component_expansioncase expan on expan.category_id=detail.category_id and expan.id=detail.component_id join component_base_info info on info.id=expan.base_info_id where detail.product_id='${localStorage.productId}' and detail.template_id='${localStorage.templateId}' and detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.is_expansion='0'`
                /*获取扩展柜*/
                let aa = `select info.description,info.description_en,info.status,info.withdraw_date,info.ui_status,info.title_msg,so.ship_date
				from component_expansioncase expan
        join component_base_info info on info.id=expan.base_info_id
				join product_info product on product.id=info.productId
				join relation_solution_product relation on relation.product_id = product.id
				join solution so on so.id = relation.solution_id
				where info.productId='${localStorage.productId}' and so.id='${localStorage.solutionId}'`
                this.$db.get(aa, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    }
                    console.log(res)
                    this.$set(res,'temponTit',res.title_msg) //展示的描述
                    this.$set(res,'setTimeMe',res.withdraw_date)//过期的时间
                    if(res.withdraw_date!=null){
                        //如果不为null的话,就改为天数
                        this.$store.commit('setStatusTime',res.withdraw_date)
                        this.$set(res,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                    }
                    this.$store.commit('uiStatusTime',res.ui_status)
                    this.$set(res,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                    this.$set(res,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                    this.pcieSwitch.push({language:res.description,info_language:res.description_en,setTimeMe:res.withdraw_date,overdueTime:res.overdueTime,temponTit:res.temponTit,uiStatusEn:res.uiStatusEn,uiStatus:res.uiStatus})
                    //this.pcieOff=res.component_count
                })
            },
            /*查询库里扩展柜存不存在*/
            seleExterna() {
                let externa = `select * from product_programme_detail where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='0' and category_id='${this.$route.query.idExternalPcie}'`
                let seleteDi=`select detail.id from product_programme_detail detail
			join component_powerconversion con on con.category_id = detail.category_id and con.id=detail.component_id where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                this.$db.get(externa, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    }
                    if (res) {
                        console.log(res)
                        this.pcieOff = 1//有值，将隐藏的内容展示
                        /*查询库里,并设置扩展柜的最大值，当前值，内瓤的值与内瓤的最大值*/
                        this.pcieSum = res.component_count//设置扩展柜当前值
                        this.pcieSumClone = res.component_count//记录扩展柜当前的值
                        this.pcieupId = res.id  //获取扩展柜库里的id,好更改
                        this.externalNum = []
                        for (let i = res.component_count * 2 - 1; i <= res.component_count * 2; i++) {
                            if (i <= res.component_count) {
                                this.externalNum.push(i)
                            }
                        }
                        /*查询库里电源转换通道的id  记录下来，后面更改*/
                        this.$db.get(seleteDi, (err, res) => {
                            console.log(res)
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '数据获取失败',
                                    desc: err,
                                });
                            }else{
                               this.diaId=res.id
                            }
                        })
                        /*获取外部pcie内瓤的数量*/
                        this.getPcieSum()
                        /*获取库里外部pcie的连接线数据*/
                        this.setECable()
                        /*获取库里外部pcie的电源线数据*/
                        this.setEThePowerCord()
                    }
                })
            },
            /*获取库里外部pcie的iok数据*/
            setEPcie() {
                let setEPcie = `select component_count from product_programme_detail
									where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='0'and category_id='${this.$route.query.sign}'`
            },
            /*获取库里外部pcie的连接线数据*/
            setECable(bool) {
                let setECable = `select detail.id,detail.component_count,detail.component_id  from product_programme_detail detail join component_connectingline line on line.category_id=detail.category_id and line.id=detail.component_id where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='0' and line.line_type=0`
                new Promise((resolve, reject) => {
                    return this.$db.all(setECable, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        } else {
                            return resolve(res)
                        }
                    })
                }).then(res => {
                    console.log(res)
                    this.cableNum = []
                    this.cableId = []
                    let num = 0
                    res.forEach(item => {
                        let numZ = []
                        for (let i = 0; i <= (this.externalSum * 2 + 20); i++) {
                            if (i >= this.externalSum * 2 && i % 2 == 0) {
                                numZ.push(i)
                            }
                        }
                        num += item.component_count
                        let obj = {
                            id: item.component_id,
                            num: item.component_count,
                            numZ: numZ,
                            cable: this.cable,
                            upId: item.id,
                        }
                        //往要展示的连接线里面push数据
                        this.cableNum.push(obj)
                        //记录下来已经选择或展示过的数据
                        this.cableId.push(item.component_id)
                    })
                    if (this.cable.length == this.cableId.length || num >= (this.externalSum * 2 + 20)) {
                        this.cableOff = true
                    } else {
                        this.cableOff = false
                    }
                })
            },
            /*获取库里外部pcie的电源线数据*/
            setEThePowerCord() {
                let setEThePowerCord = `select * from product_programme_detail where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='0' and category_id='${this.$route.query.signT}' and powerline_type='1'`
                new Promise((resolve, reject) => {
                    return this.$db.all(setEThePowerCord, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        } else {
                            return resolve(res)
                        }
                    })
                }).then(res => {
                    console.log(res)
                    this.thePowerCordNum = []
                    this.thePowerCordId = []
                    let num = 0
                    res.forEach(item => {
                        let numZ = []
                        for (let i = 0; i <= (this.externalSum * 2 + 20); i++) {
                            if (i >= this.externalSum * 2 && i % 2 == 0) {
                                numZ.push(i)
                            }
                        }
                        num += item.component_count
                        let obj = {
                            id: item.component_id,
                            num: item.component_count,
                            numZ: numZ,
                            thePowerCord: this.thePowerCord,
                            upId: item.id,
                        }
                        //往要展示的连接线里面push数据
                        this.thePowerCordNum.push(obj)
                        //记录下来已经选择或展示过的数据
                        this.thePowerCordId.push(item.component_id)
                    })
                    if (this.thePowerCord.length == this.thePowerCordId.length || num == (this.externalSum * 2 + 20)) {
                        this.thePowerCordOff = true
                    } else {
                        this.thePowerCordOff = false
                    }
                })
            },
            /*获取连接线的数据*/
            getCable() {
                let cable = `select info.description,info.description_en,info.status ,line.*,info.withdraw_date,info.ui_status,info.title_msg,so.ship_date from component_base_info info
				join component_connectingline line on info.id=line.base_info_id
				join product_info product on product.id=info.productId
				join relation_solution_product relation on relation.product_id = product.id
				join solution so on so.id = relation.solution_id
				WHERE  line.line_type=0 and info.productId='${localStorage.productId}' and so.id='${localStorage.solutionId}'`
                new Promise((resolve, reject) => {
                    return this.$db.all(cable, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        } else {
                            console.log(res)
                            res.forEach((item,index)=>{
                                this.$set(item,'temponTit',item.title_msg) //展示的描述
                                if(item.withdraw_date){
                                    let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                    let time = new Date(thisTime).getTime();//将时间改为时间戳
                                    this.$set(res[index],'time',time)//将时间戳添加到对象里面
                                    this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                                    //如果不为null的话,就改为天数
                                    this.$store.commit('setStatusTime',item.withdraw_date)
                                    this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                }else{
                                    this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                                    this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                                }
                                this.$store.commit('uiStatusTime',item.ui_status)
                                this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                            });
                            return resolve(res)
                        }
                    })
                }).then(res => {
                    this.cable = res
                })
            },
            /*获取电源线的数据*/
            getThePowerCord() {
                let thePowerCord = `select powerline.*,info.description,info.description_en,info.status,info.withdraw_date,info.ui_status,info.title_msg,so.ship_date
				from component_base_info info
				join  component_powerline powerline on info.id=powerline.base_info_id
				join product_info product on product.id=info.productId
				join relation_solution_product relation on relation.product_id = product.id
				join solution so on so.id = relation.solution_id
				where info.productId=${localStorage.productId} and so.id='${localStorage.solutionId}'`
                return new Promise((resolve, reject) => {
                    this.$db.all(thePowerCord, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        } else {
                            return resolve(res)
                        }
                    })
                }).then(res => {
                    res.forEach((item,index)=>{
                        this.$set(item,'temponTit',item.title_msg) //展示的描述
                        if(item.withdraw_date){
                            let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                            let time = new Date(thisTime).getTime();//将时间改为时间戳
                            this.$set(res[index],'time',time)//将时间戳添加到对象里面
                            this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                            //如果不为null的话,就改为天数
                            this.$store.commit('setStatusTime',item.withdraw_date)
                            this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                        }else{
                            this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                            this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                        }
                        this.$store.commit('uiStatusTime',item.ui_status)
                        this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                        this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                    });
                    this.thePowerCord = res
                    console.log(this.thePowerCord, this.cable)
                })
            },
            /*获取cpu的数量,获取内部pcie的槽数，最终得到最多可添加的外部cpu的数量*/
            getCpc() {
                /*获取cpu的数量sql*/
                const cpuSQL = `select flesh.*  from product_programme_detail detail
JOIN component_cpu cpu on detail.category_id=cpu.category_id AND cpu.id=detail.component_id
JOIN relation_cpu_expanflesh flesh ON flesh.cpu_id=cpu.id and detail.component_count=flesh.cpu_count
where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                /*获取内部pcie槽数的sql*/
                let pcie = `select info.description,info.description_en,detail.component_count,info.status,info.withdraw_date from product_programme_detail detail join component_iocard io on io.category_id=detail.category_id join component_base_info info on info.id=io.base_info_id and io.id=detail.component_id where detail.product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'  and is_expansion=1`
                /*获取库里X16_4的数看内部能不能放下*/
                let X16_4Sql=`	SELECT detail.id,detail.component_count,io.PCI_E_size FROM product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where io.PCI_E_size=2 and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'  and is_expansion=1`
                /*获取库里ej20的内瓤的数量*/
                let externalPcieSQL = `select detail.id,detail.component_count,info.description,info.description_en,info.status,info.withdraw_date from product_programme_detail detail
                    join component_expansionflesh flesh on flesh.category_id=detail.category_id
										join component_base_info info on flesh.base_info_id=info.id
                 where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}' and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' and is_expansion='0'`
                /*获取cpu的数量sql 和最大内瓤数*/
                console.log(cpuSQL)
                this.$db.get(cpuSQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    }else {
                        this.cpu = res.cpu_count//cpu的数量
                        let iokSum=0
                        if(this.cpu==2){
                            iokSum=7
                        }
                        if(this.cpu==3){
                            iokSum=9
                        }
                        if(this.cpu==4){
                            iokSum=11
                        }
                        this.$refs.externalChild.cpu=res.cpu_count//cpu的数量
                        let sum = res.expanflesh_max_count//最大的内瓤数
                        //获取库里lan卡的数据，因为用到了cpu的数量
                        this.getLanPcie()
                        this.$refs.externalChild.getPcie()
                        /*获取内部pcie使用的槽数的sql*/
                        this.$db.all(pcie, (err, resA) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '数据获取失败',
                                    desc: err,
                                });
                            } else {
                                /*获取库里占用的数量*/
                                let num = 0
                                resA.forEach(item => {
                                    num += item.component_count
                                })
                                this.$db.all(X16_4Sql, (err, res) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '数据获取失败',
                                            desc: err,
                                        });
                                    } else {
                                        let Sum=0
                                        /*获取库里x16-4的使用情况*/
                                        res.forEach(item => {
                                            Sum += item.component_count
                                        })
                                        this.$db.get(externalPcieSQL,async (err, res) => {
                                            if (err) {
                                                this.$logger(err);
                                                this.$Notice.error({
                                                    title: '数据获取失败',
                                                    desc: err,
                                                });
                                            } else {
                                                let count=0
                                                if(res){
                                                    /*如果有参数就为库里的值，没有就为0*/
                                                    count=res.component_count
                                                }
                //                              let EJBBNum=  await new Promise((resolve,reject)=>{
                //                                     let EJBB =`select detail.id from product_programme_detail detail
				// 		join component_backplane back on back.category_id=detail.category_id and back.id=detail.component_id
				// 		join component_base_info info on info.id=back.base_info_id
				// 		where detail.product_id='${localStorage.productId}' and info.component_FC='EJBB' and detail.template_id='${localStorage.templateId}' and detail.solution_id='${localStorage.solutionId}'
                // and detail.machine_id='${localStorage.machineId}'`
                //                                     this.$db.get(EJBB,(err,res)=>{
                //                                         if(res){
                //                                             resolve(1)
                //                                         }else{
                //                                             resolve(0)
                //                                         }
                //                                     })
                //                                 })
                                                this.pcie = sum-Sum+count //x16能插的数 谁小用谁
                                                let iokNum= iokSum-num+count //总共能插的数 又只占一个槽
                                                //let iokNum= iokSum-num+count-EJBBNum //总共能插的数

                                                console.log(this.pcie, sum,Sum,count,iokNum,num,iokSum)
                                                    if (this.pcie>iokNum) {
                                                        this.pcieNum = iokNum //设置外部pcie外壳的最大值
                                                        this.pcie=iokNum
                                                    } else {
                                                        this.pcieNum = this.pcie //设置外部pcie外壳的最大值
                                                        this.pcie=iokNum
                                                    }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            },
            /*获取库里面的外部pcie卡的数量，验证能不能减少内瓤数，外壳数，和不要外部pcie数*/
            getExternalPcie(num) {
                let getExternalPcie = `select detail.id,detail.component_count from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where detail.is_expansion=0 and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                return new Promise((resolve, reject) => {
                    this.$db.all(getExternalPcie, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        } else {
                            let sum = 0
                            res.forEach(item => {
                                sum += item.component_count
                            })
                            return resolve(sum)
                        }
                    })
                }).then(sum => {
                    console.log(sum, num)
                    if (num >= sum) {
                        return this.bool = false
                    } else {
                        return this.bool = true
                    }
                })
            },
            /*不让删除或者是不让减少时展示*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'error'
                });
            },
            //获取Lan的参数
            getLanPcie(){
                let getDetails = `SELECT io.*,info.description PCI_E_desc_cn,info.description_en,info.status,info.withdraw_date,relation.PCIe_cnt FROM component_iocard io
join component_base_info info on info.id=io.base_info_id
join relation_cpu_PCIe relation on relation.PCIe_id=io.id
WHERE io.PCI_Catagory_id =1 and io.PCI_E_generation in (1,2,3) and info.productId='${localStorage.productId}' and relation.cnt_type in (0,2) and relation.cpu_cnt='${this.cpu}'`; //获取Lan的参数
                console.log(111111)
                this.$db.all(getDetails, (err, res) => {
                    if (err) {
                        console.log(pcie_type, '报错')
                    } else {
                        res.forEach((item,index)=>{
                            this.$set(item,'temponTit',item.title_msg) //展示的描述
                            this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                            if(item.withdraw_date){
                                let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                let time = new Date(thisTime).getTime();//将时间改为时间戳
                                this.$set(res[index],'time',time)//将时间戳添加到对象里面
                                //如果不为null的话,就改为天数
                                this.$store.commit('setStatusTime',item.withdraw_date)
                                this.$set(item,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                            }else{
                                this.$set(res[index],'time','不比')//将时间戳添加到对象里面
                            }
                            this.$store.commit('uiStatusTime',item.ui_status)
                            this.$set(item,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                            this.$set(item,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                        });
                        this.childType = [...res];
                        console.log(res)
                    }
                });
            },
            //查询库里内部pcie的使用情况
            getPciefromdetail(){
                let detail=`select detail.id detail_id,detail.component_count,detail.component_id from product_programme_detail detail
join component_iocard io on io.category_id=detail.category_id and io.id=detail.component_id
where detail.is_expansion=1 and solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and detail.product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                this.$db.all(detail,(err,res)=>{
                    if(err){
                        console.log('查询失败')
                    }else{
                        console.log('查询成功',res)
                        let arr=[]
                        /*如果fc相同，就将数据和并，数量相加*/
                        res.forEach((item,index)=>{
                            if(arr.length==0){
                                return arr.push(item)
                            }
                            for (let i=0;i<=arr.length;i++){
                                if(i==arr.length){
                                    return arr.push(item)
                                }
                                if(arr[i].component_id==item.component_id){
                                    return arr[i].component_count+=item.component_count
                                }
                            }
                        })
                        this.$refs.externalChild.interiorPcie=arr
                        console.log(this.$refs.externalChild.interiorPcie,arr)
                    }
                })
            },

        },
        async created() {
            /*获取连接线的数据*/
            await this.getCable()
            /*获取电源线的数据*/
            await this.getThePowerCord()
            /*获取cpu的数量,获取内部pcie的槽数，最终得到最多可添加的外部cpu的数量*/
            await this.getCpc()
            /*获取扩展柜的信息*/
            await this.getExterna()
            /*查询库里扩展柜存不存在*/
            await this.seleExterna()

        },
        beforeRouteEnter(from, to, next) {
            next(async vm => {//进入页面执行，
                vm.$emit('comup', from.query.id)
                vm.getPciefromdetail()
                if(vm.numNS>=1){
                    console.log(11111)
                    /*获取cpu的数量,获取内部pcie的槽数，最终得到最多可添加的外部cpu的数量*/
                   await vm.getCpc()
                    /*查询库里扩展柜存不存在*/
                   await vm.seleExterna()
                    /*查询外部硬盘占用外部pcie的插槽数有几个*/
                   await vm.$refs.externalChild.getEJ20()
                }
                await vm.$refs.externalChild.getEJ20()
                vm.numNS+=1
                console.log(vm.$route.query)
            });
        },
    }
</script>

<style scoped lang="less">
    .externalPcie {
        padding: 20px;

        .interior-hea {
            background: rgba(242, 242, 242, 1);
            padding: 5px;
            margin: 10px 0;
        }

        .externalPcie-hea-tw {
            margin-top: 20px;
        }

        .externalPcie-hea-pic {
            margin-top: 20px;
        }

        .externalPcie-butt {
            margin-left: 30px;
        }
    }

</style>
