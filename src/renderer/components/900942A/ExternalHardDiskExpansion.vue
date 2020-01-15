<template>
    <!------------------------------------------------扩展柜硬盘-------------------------------------------------->
    <div class="other">
        <div class="config">
            <p class="title content-label">
                <span class="config-title">{{$t('ExternalHardDiskExpansion.ExpansionCabinetHardDisk')}}</span>
            </p>
            <div class="disk modify for-main">
                <!-------------------------------------------24盘 数据---------------------------------------------------->
                <div v-show="discInterfaceNum !=-1">
                    <div v-for="(ite,ind) in addHardDisk" :key="ind">
                        <el-select size="mini" v-model="hardDiskTypeModel" :placeholder="$store.state.info_language?'please choose':'请选择'" class="sel">
                            <el-option v-for="(item,index) in hardDiskType" :key="index" :label="item.value"
                                       :value="item.index" >
                            </el-option>
                        </el-select>
                        <el-select size="mini" v-model="ite.hardDiskModel" :placeholder="$store.state.info_language?'please choose':'请选择'" class="other-select-two"
                                   @change="hardDiskModelSet(ind,ite.hardDiskModel,1)"
                                   @visible-change="hardDiskModelBtn($event,ind)">
                            <el-option v-for="(item,index) in ite.hardDiskModelData" :key="index" :label="$store.state.info_language?item.description_en:item.disk_des"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                        <p class="icon">*</p>
                        <el-select size="mini" v-model="ite.hardDiskNumModel" :placeholder="$store.state.info_language?'please choose':'请选择'" class="sel"
                                   @change="hardDiskModelSet(ind,ite.hardDiskModel,ite.hardDiskNumModel)"
                                   @visible-change="optionalValue($event,ind)">
                            <el-option v-for="item in ite.hardDiskNum" :key="item" :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                        <el-button size="mini" type="info" icon="el-icon-close" circle @click="deleteHardDisk(ind)"   class="dele" ></el-button>

                        <div v-for="dl in ite.hardDiskModelData" v-if="ite.hardDiskModel==dl.id" :key="dl.language">
                            <div class="pdiv" v-if="dl.temponTit!=null">
                                {{dl.temponTit}}
                            </div>
                            <div class="pdiv red-a" v-if="dl.uiStatus">
                                {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                            </div>
                            <div class="pdiv" v-if="dl.setTimeMe">
                                此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                            </div>
                        </div>
                    </div>

                    <div>
                        <el-button size="mini" icon="el-icon-plus" @click="addHardDiskBtn()" ></el-button>
                        <span class="add-cables" >{{$t('ExternalHardDiskExpansion.IncreaseTheHardDisk')}}</span>
                    </div>

                </div>




                <!--------------------------------------------------12盘 数据------------------------------------>
                <div v-show="discInterface !=-1">
                    <div v-for="(ite,ind) in addHardDiskCard" :key="ind">
                        <el-select size="mini" v-model="hardDiskTypeModelCard" :placeholder="$store.state.info_language?'please choose':'请选择'" class="sel">
                            <el-option v-for="(item,index) in hardDiskTypeCard" :key="index" :label="item.value"
                                       :value="item.index" >
                            </el-option>
                        </el-select>
                        <el-select size="mini" v-model="ite.hardDiskModelCard" :placeholder="$store.state.info_language?'please choose':'请选择'" class="other-select-two"
                                   @change="hardDiskModelSetCard(ind,ite.hardDiskModelCard,1)"
                                   @visible-change="hardDiskModelBtnCard($event,ind)">
                            <el-option v-for="(item,index) in ite.hardDiskModelDataCard" :key="index" :label="$store.state.info_language?item.description_en:item.disk_des"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                        <p class="icon">*</p>
                        <el-select size="mini" v-model="ite.hardDiskNumModelCard" :placeholder="$store.state.info_language?'please choose':'请选择'" class="sel"
                                   @change="hardDiskModelSetCard(ind,ite.hardDiskModelCard,ite.hardDiskNumModelCard)"
                                   @visible-change="optionalValueCard($event,ind)">
                            <el-option v-for="item in ite.hardDiskNumCard" :key="item" :label="item"
                                       :value="item">
                            </el-option>
                        </el-select>
                        <el-button size="mini" type="info" icon="el-icon-close" circle @click="deleteHardDiskCard(ind)"   class="dele" ></el-button>

                        <div v-for="dl in ite.hardDiskModelDataCard" v-if="ite.hardDiskModelCard==dl.id" :key="dl.language">
                            <div class="pdiv" v-if="dl.temponTit!=null">
                                {{dl.temponTit}}
                            </div>
                            <div class="pdiv red-a" v-if="dl.uiStatus">
                                {{$store.state.info_language?dl.uiStatusEn:dl.uiStatus}}
                            </div>
                            <div class="pdiv" v-if="dl.setTimeMe">
                                此部件将于&lt; {{dl.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{dl.overdueTime}}&gt; 天
                            </div>
                        </div>
                    </div>

                    <div>
                        <el-button size="mini" icon="el-icon-plus" @click="addHardDiskBtnCard()" ></el-button>
                        <span class="add-cables" >{{$t('ExternalHardDiskExpansion.IncreaseTheHardDisk')}}</span>
                    </div>

                </div>
                <!--------------------------------------------------------------------------------------------->

                <span class="tips">{{$t('InternalPCIE.lists.InternalPCIEsetup.content2')}}：{{selectedNumberCard+selectedNumber}}/ {{diskCount+diskCountCard}}</span>
                <br>
                <span v-if="this.$route.query.showMax" class="tips">{{$t('ExternalHardDiskExpansion.TotalHardDiskCapacity')}}:{{totalCapacity}}GB</span>
                <span v-if="!this.$route.query.showMax" class="tips">{{$t('ExternalHardDiskExpansion.TotalHardDiskCapacity')}}:{{this.$parent.$parent.totalCapacity}}GB</span>
            </div>
        </div>
    </div>

</template>

<script>
    /**
     * 外部扩展柜
     *
     * @date 2019/10/11
     * @author yuwenqiang
     */

    export default {
        name: "ExternalHardDiskExpansion",
        props:['diskCount','diskCountCard'],

        data(){
            return{
                /*------------------24盘位------------------------------*/
                // 硬盘类型v-model
                hardDiskTypeModel:1,
                // 硬盘类型 下拉数据
                hardDiskType:[],
                // 外层循环数组
                addHardDisk:[],
                // 存储 已选中 数据id
                changeId:[],
                // 硬盘型号 下拉数据
                hardDiskModelData:[],
                // 已选中的数据，最大容量
                maxCapacity:0,
                // 已选中的插槽数
                selectedNumber:0,
                // 存储数量最大值
                num:0,
                // 隐藏添加按钮
                addShow:false,
                // 获取总硬盘容量
                totalCapacity:0,
                // 获取 24扩展柜 id 判断显示隐藏
                discInterfaceNum:0,
                /*------------------12盘位------------------------------*/
                // 硬盘类型v-model
                hardDiskTypeModelCard:1,
                // 硬盘类型 下拉数据
                hardDiskTypeCard:[],
                // 外层循环数组
                addHardDiskCard:[],
                // 存储 已选中 数据id
                changeIdCard:[],
                // 硬盘型号 下拉数据
                hardDiskModelDataCard:[],
                // 已选中的数据，最大容量
                maxCapacityCard:0,
                // 存储数量最大值
                numCard:0,
                // 已选中的插槽数
                selectedNumberCard:0,
                // 隐藏添加按钮
                addShowCard:false,
                // 获取总硬盘容量
                totalCapacityCard:0,
                // 获取 12扩展柜 id 判断显示隐藏
                discInterface:0,
            }
        },

        methods:{
            /*-------------------------------------------24盘数据------------------------------------------------------*/
            /*存储 选中硬盘型号  和个数*/
            hardDiskModelSet(index,id,num){

                if(!num){
                    num = 1
                }
                /*显示隐藏总容量*/
                this.$route.query.showMax = true;
                let time=new Date().getTime();
                const SQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','1','${id}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','0')`
                const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                ${id}' where id=${this.addHardDisk[index].hardDiskId}`;
                if(this.addHardDisk[index].hardDiskId){
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log('修改失败');
                        } else {
                            console.log('修改成功');
                            // 获取已存id
                            this.changeId[index]=id;
                            /*计算 已用的插槽数 和容量*/
                            this.totalSum();
                        }
                    });
                }else{
                    this.$db.run(SQL, (err, res) => {
                        if(err){
                            console.log('失败')
                        }else{
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
                                }else{
                                    this.addHardDisk[index].hardDiskId = res.id;
                                    //获取已存id
                                    this.changeId.push(id);
                                    /*计算 已用的插槽数 和容量*/
                                    this.totalSum();
                                }

                            });
                        }
                    })
                }
            },

            /*添加扩展柜硬盘*/
            addHardDiskBtn(){
                /*更新硬盘最大数量*/
                this.num = this.diskCount;
                /*已选中数量， 大于等于 总数 return*/
                if(this.selectedNumber>=this.num){
                    return false;
                }

                /*当 硬盘 和数量 为空时 不可添加*/
                if(this.addHardDisk[0].hardDiskModel == ''||
                    this.addHardDisk[0].hardDiskNumModel ==''){
                    return false;
                }

                if(this.addHardDisk[this.addHardDisk.length-1].hardDiskModelData.length ==1){
                    return false;
                }

                /*显示隐藏总容量*/
                this.$route.query.showMax = true;
                let list=this.hardDiskModelData.filter(item=>{ //过滤后的数组
                    let bool=true

                    this.changeId.forEach(it=>{

                        if(item.id==it){
                            bool=false
                            return
                        }
                    })

                    return bool
                })

                if(list.length<1){
                    return false
                }

                this.addHardDisk.push({
                    hardDiskModel:list[0].id,
                    hardDiskModelData:[...list],
                    hardDiskNumModel:1,
                    hardDiskNum:this.num,
                    hardDiskId:''
                })

                this.hardDiskModelSet(this.addHardDisk.length-1,list[0].id)
            },

            /*计算 已用的插槽数 和容量*/
            totalSum(){
                /*更新硬盘最大数量*/
                this.num = this.diskCount;
                this.maxCapacity=0;
                this.selectedNumber=0;

                console.log(this.changeId)
                console.log(this.hardDiskModelData)
                this.changeId.forEach((item,i)=>{

                    this.hardDiskModelData.forEach(it=>{
                        if(item==it.id){
                            this.maxCapacity += it.capacity*this.addHardDisk[i].hardDiskNumModel;
                            this.selectedNumber += this.addHardDisk[i].hardDiskNumModel;
                        }
                    })
                })

                // if(this.selectedNumber>= this.diskCount){
                //     this.addShow = true;
                // }else{
                //     this.addShow = false;
                // }

                /* 将内部外部总容量  添加到localStorage 进行计算*/
                let externalCapacity = this.maxCapacity;
                localStorage.setItem('externalCapacity', externalCapacity);
                this.totalCapacity = parseInt(localStorage.internalCapacity) + parseInt(localStorage.externalCapacity) + parseInt(localStorage.externalCapacityCard)

                console.log( this.totalCapacity )
            },

            /*删除扩展柜硬盘*/
            deleteHardDisk(index){
                if (this.addHardDisk[index].hardDiskId) {
                    /*显示隐藏总容量*/
                    this.$route.query.showMax = true;
                    const sql = `DELETE FROM product_programme_detail WHERE id = ${this.addHardDisk[index].hardDiskId}`;
                    this.$db.run(sql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {

                            this.changeId.splice(index,1);
                            /*计算 已用的插槽数 和容量*/
                            this.totalSum();

                            /*删除  当index 为0时，清空 硬盘类型和数量*/
                            if(index == 0&&this.addHardDisk.length ==1){
                                this.addHardDisk[index].hardDiskModel = '';
                                this.addHardDisk[index].hardDiskNumModel = '';
                                this.addHardDisk[index].hardDiskId = ''
                                // localStorage.setItem('externalCapacity', 0);
                            }

                            if( this.addHardDisk.length>1){
                                this.addHardDisk.splice(index,1)
                            }
                            console.log("删除成功")

                        }
                    })
                }
            },

            /*计算硬盘可选最大值*/
            optionalValue(bool,ind){
                if(bool){
                    /*更新硬盘最大数量*/
                    this.num = this.diskCount;
                    let num=0;
                    this.addHardDisk.forEach((it,index)=> {
                        if(index!==ind){
                            num+=it.hardDiskNumModel
                        }
                    })

                    this.addHardDisk[ind].hardDiskNum=this.num-num;
                }
            },

            /*将 选中数据，存储到 新数组中*/
            hardDiskModelBtn(bool,ind){
                console.log(bool,this.addHardDisk[ind].hardDiskModelData,this.hardDiskModelData)
                if(bool){
                    let gettime= new Date().getTime() //获取现在的时间戳
                    this.addHardDisk[ind].hardDiskModelData = this.hardDiskModelData.filter(item=>{
                        if(this.$store.state.showWithdraw==0 &&  item.time<gettime){
                            return false
                        }
                        let num=true

                        this.changeId.forEach((it,index)=>{

                            if(item.id==it&&index!=ind){

                                return num=false
                            }
                        })
                        return num
                    })
                }
            },

            /*进入页面获取数据*/
            getDataList(nums){
              this.discInterfaceNum = nums;
                console.log(this.discInterfaceNum)
                let than =this
                /*获取硬盘型号数据*/
                const SQL = `select info.description disk_des,info.description_en,disk.id,info.title_msg,info.withdraw_date,info.ui_status,capacity,info.status,disk.disc_interface from component_disk disk
            left join component_base_info info on info.id=disk.base_info_id where disc_type in(
SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where bd.id in(select disk_id
from backplane_disk where backplane_id=4)group by disc_type having count(disc_type)>=0)
and disk.disc_interface in (${nums}) and info.productId=${localStorage.productId}`

                const SQLSAS=`SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where bd.id in(select disk_id
            from backplane_disk where backplane_id=1)`
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
                }).then((res)=>{

                    if(res.length>1){
                        this.addHardDisk = [];
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
                        this.hardDiskModelData = [...res];

                        this.addHardDisk.push({
                            hardDiskModel:res[0].id,
                            hardDiskModelData:[...res],
                            hardDiskNumModel:1,
                            hardDiskNum:this.num,
                            hardDiskId:'',
                            discInterface:0

                        })
                        /* 查询到  已存入product_programme_detail 表里的数据*/
                        let getSQL= ` select detail.*,disk.disc_interface from product_programme_detail detail
 join component_disk disk on disk.category_id = detail.category_id and disk.id=detail.component_id
 where  solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'  and component_id !=25 and is_expansion = 0 and disc_interface = 1`
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
                                if(res.length>0){

                                    this.addHardDisk = [];
                                    this.changeId = [];
                                    res.forEach(item=>{
                                        this.changeId.push(item.component_id)
                                        this.addHardDisk.push({
                                            hardDiskModel:item.component_id,
                                            hardDiskModelData:[...this.hardDiskModelData],
                                            hardDiskNumModel:item.component_count,
                                            hardDiskNum:this.num,
                                            hardDiskId:item.id,
                                            discInterface:0
                                        })
                                        this.hardDiskTypeModel = 1
                                    })
                                    /*计算 已用的插槽数 和容量*/
                                    this.totalSum()
                                }else{
                                    this.hardDiskModelSet(this.addHardDisk.length-1,this.hardDiskModelData[0].id)
                                }
                            }
                        })
                    }


                })

                /*获取 硬盘类型*/
                than.$db.all(SQLSAS, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '获取数据失败',
                            desc: err,
                        });
                    } else {

                        if(res.length>1){
                            res.forEach(item=>{
                                if (item.disc_type === 0) {
                                    this.hardDiskType=[
                                        // {
                                        //     value:'全部',
                                        //     index:0
                                        // },
                                        {
                                            value:'SAS',
                                            index:1
                                        },
                                    ]
                                }
                            })
                        }
                    }
                });
            },

            /*-------------------------------------------12盘数据------------------------------------------------------*/
            /*存储 选中硬盘型号  和个数*/
            hardDiskModelSetCard(index,id,num){

                if(!num){
                    num = 1
                }
                /*显示隐藏总容量*/
                this.$route.query.showMax = true;
                let time=new Date().getTime();
                const SQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','is_expansion') VALUES('${localStorage.productId}','${localStorage.machineId}','1','${id}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','0')`
                const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                ${id}' where id=${this.addHardDiskCard[index].hardDiskIdCard}`;
                if(this.addHardDiskCard[index].hardDiskIdCard){
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log('修改失败');
                        } else {
                            console.log('修改成功');
                            // 获取已存id
                            this.changeIdCard[index]=id;
                            /*计算 已用的插槽数 和容量*/
                            this.totalSumCard();
                        }
                    });
                }else{
                    this.$db.run(SQL, (err, res) => {
                        if(err){
                            console.log('失败')
                        }else{
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
                                }else{
                                    this.addHardDiskCard[index].hardDiskIdCard = res.id;
                                    //获取已存id
                                    this.changeIdCard.push(id);
                                    /*计算 已用的插槽数 和容量*/
                                    this.totalSumCard();
                                }
                            });
                        }
                    })
                }
            },

            /*添加扩展柜硬盘*/
            addHardDiskBtnCard(){
                /*更新硬盘最大数量*/
                this.numCard = this.diskCountCard;
                /*已选中数量， 大于等于 总数 return*/
                if(this.selectedNumberCard>=this.numCard){
                    return false;
                }

                /*当 硬盘 和数量 为空时 不可添加*/
                if(this.addHardDiskCard[0].hardDiskModelCard == ''||
                    this.addHardDiskCard[0].hardDiskNumModelCard ==''){
                    return false;
                }
                console.log(this.addHardDiskCard)
                console.log( this.changeIdCard)
                console.log(this.hardDiskModelDataCard)
                if(this.addHardDiskCard[this.addHardDiskCard.length-1].hardDiskModelDataCard.length ==1){
                    return false;
                }

                /*显示隐藏总容量*/
                this.$route.query.showMax = true;
                let list=this.hardDiskModelDataCard.filter(item=>{ //过滤后的数组
                    let bool=true

                    this.changeIdCard.forEach(it=>{

                        if(item.id==it){
                            bool=false
                            return
                        }
                    })

                    return bool
                })

                if(list.length<1){
                    return false
                }

                this.addHardDiskCard.push({
                    hardDiskModelCard:list[0].id,
                    hardDiskModelDataCard:[...list],
                    hardDiskNumModelCard:1,
                    hardDiskNumCard:this.numCard,
                    hardDiskIdCard:''
                })

                this.hardDiskModelSetCard(this.addHardDiskCard.length-1,list[0].id)

            },

            /*计算 已用的插槽数 和容量*/
            totalSumCard(){
                /*更新硬盘最大数量*/

                this.numCard = this.diskCountCard;
                this.maxCapacityCard=0;
                this.selectedNumberCard=0;

                console.log(this.changeIdCard)
                console.log(this.hardDiskModelDataCard)
                console.log(this.addHardDiskCard)
                this.changeIdCard.forEach((item,i)=>{

                    this.hardDiskModelDataCard.forEach(it=>{
                        if(item==it.id){
                            this.maxCapacityCard += it.capacity*this.addHardDiskCard[i].hardDiskNumModelCard;
                            this.selectedNumberCard += this.addHardDiskCard[i].hardDiskNumModelCard;
                        }
                    })
                })

                // if(this.selectedNumber>= this.diskCount){
                //     this.addShow = true;
                // }else{
                //     this.addShow = false;
                // }

                /* 将内部外部总容量  添加到localStorage 进行计算*/
                let externalCapacityCard = this.maxCapacityCard;
                localStorage.setItem('externalCapacityCard', externalCapacityCard);
                this.totalCapacity = parseInt(localStorage.internalCapacity) + parseInt(localStorage.externalCapacity) + parseInt(localStorage.externalCapacityCard)

                console.log( this.totalCapacity )
            },

            /*删除扩展柜硬盘*/
            deleteHardDiskCard(index){
                if (this.addHardDiskCard[index].hardDiskIdCard) {
                    /*显示隐藏总容量*/
                    this.$route.query.showMax = true;
                    const sql = `DELETE FROM product_programme_detail WHERE id = ${this.addHardDiskCard[index].hardDiskIdCard}`;
                    this.$db.run(sql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {

                            this.changeIdCard.splice(index,1);
                            /*计算 已用的插槽数 和容量*/
                            this.totalSumCard();

                            /*删除  当index 为0时，清空 硬盘类型和数量*/
                            if(index == 0&&this.addHardDiskCard.length ==1){
                                this.addHardDiskCard[index].hardDiskModelCard = '';
                                this.addHardDiskCard[index].hardDiskNumModelCard = '';
                                this.addHardDiskCard[index].hardDiskIdCard = ''
                                // localStorage.setItem('externalCapacity', 0);
                            }

                            if( this.addHardDiskCard.length>1){
                                this.addHardDiskCard.splice(index,1)
                            }
                            console.log("删除成功")

                        }
                    })
                }
            },

            /*计算硬盘可选最大值*/
            optionalValueCard(bool,ind){
                if(bool){
                    /*更新硬盘最大数量*/
                    this.numCard = this.diskCountCard;
                    let num=0;
                    this.addHardDiskCard.forEach((it,index)=> {
                        if(index!==ind){
                            num+=it.hardDiskNumModelCard
                        }
                    })
                    console.log(this.numCard);
                    console.log(num)
                    this.addHardDiskCard[ind].hardDiskNumCard=this.numCard-num;

                }
            },

            /*将 选中数据，存储到 新数组中*/
            hardDiskModelBtnCard(bool,ind){
                console.log(bool, this.addHardDiskCard[ind].hardDiskModelDataCard ,this.hardDiskModelDataCard)
                if(bool){
                    let gettime= new Date().getTime() //获取现在的时间戳
                    this.addHardDiskCard[ind].hardDiskModelDataCard = this.hardDiskModelDataCard.filter(item=>{
                        if(this.$store.state.showWithdraw==0 &&  item.time<gettime){
                            return false
                        }
                        let num=true

                        this.changeIdCard.forEach((it,index)=>{

                            if(item.id==it&&index!=ind){

                                return num=false
                            }
                        })
                        return num
                    })
                }
            },

            /*进入页面获取数据*/
            getDataListCard(num){
                this.discInterface = num;

                let than =this
                /*获取硬盘型号数据*/
                const SQL = `select info.description disk_des,info.description_en,info.title_msg,info.ui_status,info.withdraw_date,disk.id,capacity,info.status,disk.disc_interface from component_disk disk
            left join component_base_info info on info.id=disk.base_info_id where disc_type in(
SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where bd.id in(select disk_id
from backplane_disk where backplane_id=4)group by disc_type having count(disc_type)>=0)
and disk.disc_interface in (${num}) and info.productId=${localStorage.productId}`

                const SQLSAS=`SELECT disc_type FROM "component_disk" cd left join backplane_disk bd on cd.id=bd.disk_id where bd.id in(select disk_id
            from backplane_disk where backplane_id=1)`
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
                }).then((res)=>{
                    console.log(res)
                    if(res.length>1){
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
                        this.addHardDiskCard = [];
                        this.hardDiskModelDataCard = [...res];
                        this.addHardDiskCard.push({
                            hardDiskModelCard:res[0].id,
                            hardDiskModelDataCard:[...res],
                            hardDiskNumModelCard:1,
                            hardDiskNumCard:this.numCard,
                            hardDiskIdCard:'',
                            discInterfaceCard:0

                        })
                        console.log()
                        /* 查询到  已存入product_programme_detail 表里的数据*/
                        let getSQL= ` select detail.*,disk.disc_interface from product_programme_detail detail
 join component_disk disk on disk.category_id = detail.category_id and disk.id=detail.component_id
 where  solution_id='${localStorage.solutionId}' and product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}'  and component_id !=25 and is_expansion = 0 and disc_interface = 0`
                        console.log(getSQL)
                        this.$db.all(getSQL, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '获取失败',
                                    desc: err,
                                });
                            } else {
                                if(res.length>0){

                                    this.addHardDiskCard = [];
                                    this.changeIdCard = [];
                                    res.forEach(item=>{
                                        this.changeIdCard.push(item.component_id)
                                        this.addHardDiskCard.push({
                                            hardDiskModelCard:item.component_id,
                                            hardDiskModelDataCard:[...this.hardDiskModelDataCard],
                                            hardDiskNumModelCard:item.component_count,
                                            hardDiskNumCard:this.numCard,
                                            hardDiskIdCard:item.id,
                                            discInterfaceCard:0
                                        })
                                        this.hardDiskTypeModelCard = 1
                                    })
                                    /*计算 已用的插槽数 和容量*/
                                    this.totalSumCard()
                                }else{
                                    this.hardDiskModelSetCard(this.addHardDiskCard.length-1,this.hardDiskModelDataCard[0].id)
                                }
                            }
                        })
                    }
                })

                /*获取 硬盘类型*/
                than.$db.all(SQLSAS, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '获取数据失败',
                            desc: err,
                        });
                    } else {
                        if(res.length>1){
                            res.forEach(item=>{
                                if (item.disc_type === 0) {
                                    this.hardDiskTypeCard=[
                                        // {
                                        //     value:'全部',
                                        //     index:0
                                        // },
                                        {
                                            value:'SAS',
                                            index:1
                                        },
                                    ]
                                }
                            })
                        }
                    }
                });
            },

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
    }

    /*----------其他select修改宽度----------------*/
    .other .config .el-select {
        width: 100px;
    }

    .other .config .other-select-two {
        width: 400px;
        margin-left: 30px;
    }

    .cable {
        margin-top: 20px;
    }

    .modify {
        margin: 40px 0;
    }
    .tips{
        display: inline-block;
        margin-top: 10px;
    }
    .dele{
        margin-left: 20px;
    }
</style>
