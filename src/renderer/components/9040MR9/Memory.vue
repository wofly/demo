<template>
    <div class="Memory-MR">
        <div class="out-p content-label">
            {{$t('Memory.lists.MemoryAllocation.MemoryBackplane')}}
        </div>
        <div class="for-main">
            <el-select size="mini" v-model="memoryDataId" placeholder="请选择" class="sel-main">
                <!--@blur="changeList($event,index)"-->
                <el-option
                        v-for="(item,index) in memoryData"
                        :key="index"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.component_id"
                        :disabled="false"
                >
                </el-option>
            </el-select>
            <p>*</p>
            <el-select size="mini" v-model="memorysum" placeholder="请选择" class="sel" @change="updateMemorysum(memorysum)">
                <el-option
                        v-for="(item,ind) in memoryDaShu"
                        :key="ind"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <div v-for="dl in memoryData" :key="dl.id">
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
        <div>
            <p class="memory-mr-p">{{$t('Memory.lists.MemoryAllocation.content2')}} <span class="rabbet"><span>{{memorysum}}</span> /{{cpuMemory*2}}</span></p>
        </div>
        <div class="out-p content-label">
            {{$t('Memory.lists.MemoryAllocation.MemoryBar')}}
        </div>
        <div class="for-main" v-for="(item,index) in domList" :key="index">
            <el-select size="mini" v-model="item.defaultIndex" placeholder="请选择" class="sel-main"
                       @visible-change="changeList($event,item.defaultIndex,index)" @change="updateMe(item.defaultIndex,index,item.num)">
                <!--@blur="changeList($event,index)"-->
                <!-- @visible-change="changeList($event,dl.defaultIndex,divIndex)" ref="domMark" @change="getCol(dl.defaultIndex,divIndex)-->
                <el-option
                        v-for="(ite,ind) in item.memoryXu"
                        :key="ind"
                        :label="$store.state.info_language?ite.description_en:ite.description"
                        :value="ite.id"
                        :disabled="false"
                >
                </el-option>
            </el-select>
            <p>*</p>
            <el-select size="mini" v-model="item.num" placeholder="请选择" class="sel" @visible-change="setNum($event,index)"   @change="updateMe(item.defaultIndex,index,item.num)">
                <el-option
                        v-for="(it,ind) in item.memoryallNum"
                        :key="ind"
                        :label="it"
                        :value="it">
                </el-option>
            </el-select>
            <!--删除方法-->
            <el-button size="mini" type="info" icon="el-icon-close" circle class="interior-butt"
                        @click="delList(index)" v-show="domList.length>1?true:false"></el-button>
            <!--展示描述-->
            <div v-for="dl in memoryXu" v-if="item.defaultIndex==dl.id">
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
        <!--添加内存-->
        <div class="addline">
            <el-button size="mini" icon="el-icon-plus" @click="addMem(1)"></el-button>
            <span class="add-cables">{{$t('Memory.lists.MemoryAllocation.content1')}}</span>
        </div>
        <div>
            <p class="memory-mr-p">{{$t('Memory.lists.MemoryAllocation.content2')}} <span class="rabbet"><span>{{memoryallSum}}</span> /{{memorysum*16}}</span></p>
        </div>
        <div class="out-p content-label">
            {{ $t('Processor.lists.ActiveConfiguration.title')}}
        </div>
        <div class="memorya-thr memory-activations" >
            <!--常规激活容量(GB)-->
            <div class="">
                <label>{{$t('Memory.lists.MemoryAllocation.GeneralActivationCapacity')}}(GB)：</label>
                <!--常规激活容量(GB)：-->
                <el-input v-model="value3" :disabled="true">{{value3}}
                </el-input>
                <div class="memorya-thr-slider">
                    <!---->
                    <el-slider v-model="value3" :min="allnum>=256?allnum/2:128" :max="allnum"  @change="setunm" :show-tooltip="false"></el-slider>
                </div>
                <span class="memorya-thr-span">（{{$t('Memory.lists.MemoryAllocation.content3')}}：{{allnum}} GB）</span>
            </div>
            <!-- 弹性激活容量(GB)-->
            <div>
                {{$t('Memory.lists.MemoryAllocation.ElasticActivationCapacity')}}(GB)：
                <el-input v-model="value1" :placeholder="$store.state.info_language?'Please enter (0~99990)':'请输入(0~99990)'"  class="memorya-thr-input" @input="changeNum(value1)" @blur="setBlurs()"></el-input>
            </div>
        </div>
        <div class="out-p content-label">
            <!--高级配置-->
            {{$t('Memory.lists.MemoryAllocation.AdvancedConfiguration')}}
        </div>
        <div class="memorya-thr" >
            <!--EM81-->
            <div>
                {{$store.state.info_language?EM81.description_en:EM81.description}}：
                <el-select v-model="EM81.num" :placeholder="$store.state.info_language?'please choose':'请选择'" @change="updateShu(EM81)">
                    <el-option
                            v-for="item in dataMan"
                            :key="item.id"
                            :label="$store.state.info_language?item.typeY:item.type"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <!--EMAM-->
            <div>
                {{$store.state.info_language?EMAM.description_en:EMAM.description}}：
                <el-select v-model="EMAM.num" :placeholder="$store.state.info_language?'please choose':'请选择'" @change="updateShu(EMAM)">
                    <el-option
                            v-for="item in dataMan"
                            :key="item.id"
                            :label="$store.state.info_language?item.typeY:item.type"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <!--EMEF-->
            <div>
                {{$store.state.info_language?EMEF.description_en:EMEF.description}}（{{$t('Memory.lists.MemoryAllocation.StabilizingPlate')}}）:
                <el-input v-model="EMEF.num" :disabled="true" style="width: 200px; height: 30px"></el-input>
            </div>
        </div>
    </div>


</template>

<script>
    export default {
        name: "MemoryMR",
        data(){
            return {
                memorysum:1,//内存板的选中数量
                memoryClonsum:1,//记录内存板的选中数量，更改时用
                cpuMemory:2,//cpu的数量
                memoryXu:{},//下拉的内存数据
                value:0,//内存占用的数量，插槽数
                brr:[],//已经选过的内存展示的id
                allnum :128,//内存的容量
                domList:[],//内存循环的外层数组
                memoryDaShu:[],//内存背板的展示数量的数组
                memoryData:[],//内存背板的展示描述
                memoryDataId:0,//内存背板选择绑定的id
                upId:0,//记录库里内存背板的id，进行更改
                memoryallSum:0,//使用内存条的总数
                value2:128,//默认激活的最小值为128
                value3:128,//默认激活的数
                value1:'',//默认弹性激活的值
                dataMan:[
                    {
                        id:0,
                        type:'是',
                        typeY:'Yes'
                    },
                    {
                        id:1,
                        type:'否',
                        typeY:'No'
                    },
                ],//高级配置里面的下拉选
                dataManSun:0,//动态内存镜像的默认值
                dataManShun:0,//Power动态内存扩展的默认值
                EM81:{},//EM81里的数据
                EMAM:{},//EMAM里的数据
                EMEF:{},//EMEF里的数据
                otherArr:[],//存储激活数据
                time:0,//记录时间，节流
                filstnum:0,
            }
        },
        methods: {
            /*滑块调动的事件*/
            setunm(){
                if(this.value2==this.allnum){
                    this.value3=this.allnum
                }
                console.log(this.otherArr)
            },
            //添加激活内存的数据
            addOther(categoryId,id,num,upId,ind=0){
                let time = new Date().getTime()+ind;
                const SQL = `INSERT INTO product_programme_detail
    ('product_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','machine_id')VALUES('${localStorage.productId}','${categoryId}','${id}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                this.$db.run(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '数据获取失败',
                            desc: err,
                        });
                    } else {
                        console.log('添加成功' + res);
                        const selectSql = `select id from product_programme_detail where seq_Key=${time}`;
                        this.$db.get(selectSql, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '系统错误',
                                    desc: err,
                                });
                                return;
                            }else{
                                this.otherArr[ind].upId=res.id
                                console.log(categoryId,id,num,upId,this.otherArr)
                            }
                        })
                    }
                })
            },
            /*修改数据，高级配置里面的值选还是不选*/
            updateShu(obj){
                if(obj.num){
                    const sql = `DELETE FROM product_programme_detail WHERE id = ${obj.upId}`;
                    this.$db.run(sql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            obj.upId=''
                            console.log('删除成功',res,obj,this.EM81,this.EMAM,this.EMEF)
                        }
                    });
                }else{
                    const time = new Date().getTime();
                    const SQL = `INSERT INTO product_programme_detail
    ('product_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','machine_id')VALUES('${localStorage.productId}','${obj.category_id}','${obj.id}','1','${time}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                    this.$db.run(SQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '数据获取失败',
                                desc: err,
                            });
                        } else {
                            console.log('添加成功' + res);
                            const selectSql = `select id from product_programme_detail where seq_Key=${time}`;
                            this.$db.get(selectSql, (err, res) => {
                                if (err) {
                                    this.$logger(err);
                                    this.$Notice.error({
                                        title: '系统错误',
                                        desc: err,
                                    });
                                    return;
                                }else{
                                    obj.upId=res.id
                                    console.log('获取成功',res,obj,this.EM81,this.EMAM,this.EMEF)
                                }
                            })
                        }
                    })
                }
            },
            /*输入弹性激活容量时进行的数量校验*/
            changeNum(num){
                console.log(num,parseFloat(num*1))
                this.value1 = num.replace( /[^\d]/g, '');
                if(num>99990){
                    return this.value1=99990
                }
                if(num<=0){
                    return this.value1=''
                }
            },
            /*失焦时改变参数*/
            setBlurs(){
                console.log(num,1111111)
                    let num= (this.value1%this.otherArr[3].gb)/this.otherArr[2].gb
                    let sum= Math.floor(this.value1/this.otherArr[3].gb)
                    console.log(1111,sum,num)
                    //进来后直接删除所有的id在从新添加
                    if(this.otherArr[2].upId){
                        this.deleteOther(this.otherArr[2].upId,2)
                    }
                    if(this.otherArr[3].upId){
                        this.deleteOther(this.otherArr[3].upId,3)
                    }
                    if(num){
                        //添加数据
                        this.addOther(this.otherArr[2].category_id,this.otherArr[2].id,num,this.otherArr[2].upId,2)
                    }
                    if(sum){
                        this.addOther(this.otherArr[3].category_id,this.otherArr[3].id,sum,this.otherArr[3].upId,3)
                    }
                    console.log()
            },
            //根据id删除激活的值
            deleteOther(id,index){
                const sql = `DELETE FROM product_programme_detail WHERE id = ${id}`;
                this.$db.run(sql, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        this.otherArr[index].upId=''
                        console.log(res, '删除成功',this.otherArr,id);
                    }
                });
            },
            delList(index) { // 点击删除
                    const sql = `DELETE FROM product_programme_detail WHERE id = ${this.domList[index].id}`;
                    this.$db.run(sql, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '搜索失败',
                                desc: err,
                            });
                        } else {
                            this.allnum = 0;
                            this.memoryallSum=0;
                            console.log(res, '删除成功');
                            this.domList.splice(index, 1);
                            this.brr.splice(index, 1);
                            this.domList.forEach(item => {
                                this.memoryallSum += item.num;
                                this.allnum += item.num * item.capacity;
                            });
                            this.value3=this.allnum
                            // this.$emit('erro', 1);
                            let sum=this.memorysum*8-this.memoryallSum
                            if(sum>0){
                                this.updateMe(this.domList[0].defaultIndex,0,this.domList[0].num+sum)
                                this.domList[0].num+=sum
                            }
                        }
                    });
            },
            /*展示数量下拉的数据*/
            setNum(bool,index){
                if(bool){
                    let num=0,sum=0
                    this.domList.forEach((item,ind)=>{
                        if(index==ind){
                            return
                        }
                        num+= Math.ceil(item.num/8)
                        sum+=Math.ceil(item.num/16)
                    })
                    console.log(11111,this.memorysum,num)
                    this.domList[index].memoryallNum=[]
                    for(let i=1;i<=(this.memorysum*16-num*8);i++){
                        if(i%8==0 && (this.memorysum-num)*8<=i && i<=(this.memorysum-sum)*16){
                            //console.log(i)
                            this.domList[index].memoryallNum.push(i)
                        }
                    }
                    console.log(this.domList[index].memoryallNum)
                }
            },
            /*修改内存的数量和id*/
            updateMe(id,index,num){
                const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}',component_id='
                ${id}' where id=${this.domList[index].id}`;
                this.$db.run(updateSql, (err, res) => {
                    if (res) {
                        console.log('修改失败');
                    } else {
                        console.log('修改成功');
                        this.brr[index]=id
                        this.memoryXu.forEach(ite => {
                            if (ite.id == id) {
                                this.domList[index].capacity = ite.capacity;
                            }
                        });
                        this.memoryallSum=0
                        this.allnum=0
                        let num=0
                        this.domList.forEach(item=>{
                            this.memoryallSum += item.num
                            this.allnum +=item.num*item.capacity
                            num+= item.num
                        })
                        this.value3=this.allnum
                        if(num<=this.memorysum*16&&num>=this.memorysum*8){
                            this.$emit('erro',33);
                        }else{
                            this.$emit('erro',1);
                        }
                    }
                })
            },
            /*如果过期了就不再展示*/
            changeList(e, id, index) {
                if (e) {
                    let gettime= new Date().getTime() //获取现在的时间戳
                    const resValue = this.memoryXu.filter((item,ind) => {
                        let num = true;
                        console.log(gettime,item.time)
                        if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
                            return false //如果时间小于现在时间，也就说过市了，不在显示
                        }
                        // for (let j = 0; j < this.brr.length; j++) {
                        //     if (this.brr[j] == item.id && j != index) {
                        //         return num = false;
                        //     }
                        // }
                        return num;
                    });
                    this.domList[index].memoryXu = [ ...resValue ];
                    // this.domList[index].defaultIndex=resValue[0].id
                }
            },
            /*添加内存条*/
            addMem(index){
                let num=0
                this.domList.forEach((item,ind)=>{
                    num+= Math.ceil(item.num/16)
                })
                if(this.domList.length>=this.memorysum||num>=this.memorysum){
                    return
                }
                let arr=this.memoryXu
                let obj = {
                    showList: false,
                    id: '',//id
                    num: 8,//展示的数量
                    defaultIndex: arr[0].id,//存库的component_id
                    capacity: arr[0].capacity,//内存的大小。8、16、32。。
                    memoryXu:arr,//展示的数据的下拉
                    memoryallNum:[]//展示的数量的下拉
                }
                const time = new Date().getTime()+index;
                const addSQL = `INSERT INTO product_programme_detail
    ('product_id','category_id','component_id','component_count','seq_Key','solution_id','template_id','machine_id')VALUES('${localStorage.productId}','${this.$route.query.sign}','${arr[0].id}','8','${time}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}')`;
                this.$db.run(addSQL, (err, res) => {
                    if (err) {
                        console.log('添加失败');
                    } else {
                        console.log('添加成功' +time);
                        const selectSql = `select id from product_programme_detail where seq_Key=${time}`;
                        this.$db.get(selectSql, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '系统错误',
                                    desc: err,
                                });
                                return;
                            }else{
                                obj.id=res.id
                                this.domList.push(obj);
                                this.memoryallSum += obj.num;
                                this.brr.push(arr[0].id);
                                this.allnum += obj.num * obj.capacity;
                                this.value3=this.allnum
                                num=0
                                this.domList.forEach((item,ind)=>{
                                    num+= item.num
                                })
                                if(num<=this.memorysum*16&&num>=this.memorysum*8){
                                    this.$emit('erro',33);
                                }
                            }
                        })
                    }
                })
            },
            /*更改内存背板的数量*/
            updateMemorysum(sum){
                let num=this.domList.length
                let numS=0
                this.domList.forEach((item,ind)=>{
                    numS+= Math.ceil(item.num/16)
                })
                if(num>sum ||numS>sum){
                    this.err(this.$t('error.MemoryBackplane'))
                    this.memorysum=this.memoryClonsum
                    return
                }
                const updateSql = `UPDATE product_programme_detail set 'component_count'='${sum}' where id=${this.upId}`;
                this.$db.run(updateSql, (err, res) => {
                    if (err) {
                        console.log('修改失败');
                    } else {
                        console.log('修改成功');
                        numS=0
                        this.domList.forEach((item,ind)=>{
                            numS+= Math.ceil(item.num/8)
                        })
                        for(let i=this.memoryClonsum;i<=sum;i++){
                            if(num<i&&numS<i){
                                this.addMem(i)
                            }
                        }
                        num=0
                        this.domList.forEach((item,ind)=>{
                            num+= item.num
                        })
                        if(num<=sum*16&&num>=sum*8){
                            this.$emit('erro',33);
                        }else{
                            this.$emit('erro',1);
                        }
                        this.memoryClonsum=this.memorysum
                    }
                })
            },
            /*获取内存要的展示数据*/
            getkuS() {
                const SQL = `select  cm.*,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status,so.ship_date from component_memory cm
       join component_base_info info on info.id=cm.base_info_id
    join product_info product on product.id = info.productId
    join relation_solution_product relation on relation.product_id=product.id
    join solution so on so.id=relation.solution_id where productId='${localStorage.productId}' and so.id='${localStorage.solutionId}'`;
              return  new Promise((resolve,reject)=>{
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '获取数据失败',
                                desc: err,
                            });
                        } else {
                           return resolve(res)
                        }
                    });
                }).then(res=>{
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
                    this.memoryXu = [...res]
                    console.log(res, this.memoryXu)
                })

            },
            /*数据库取出渲染*/
            getList() {
                const SQL = `select detail.id,detail.component_count,detail.component_id,mem.capacity,info.status from component_base_info info
                            join component_memory mem on info.id = mem.base_info_id
                            join product_programme_detail detail on mem.id=detail.component_id and  detail.category_id=2

                            left join solution so            on  so.id = detail.solution_id
                            where info.id in (select mem.base_info_id from component_memory mem
                            where mem.id in (select component_id from product_programme_detail) ) and so.id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}'`;
                // console.log('sad');
                this.$db.all(SQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        this.memoryallSum=0
                        this.brr = [];
                        this.domList=[]
                        this.allnum=0
                        console.log(res);
                        res.forEach((item, index) => {
                            let obj = {
                                id: item.id,//id
                                num: item.component_count,//展示的数量
                                defaultIndex: item.component_id,//存库的component_id
                                capacity: item.capacity,//内存的大小。8、16、32。。
                                memoryXu:this.memoryXu,//展示的数据的下拉
                                memoryallNum:[]//展示的数量的下拉
                            }
                            this.domList.push(obj);
                            this.memoryallSum += item.component_count;
                            this.brr.push(item.component_id);
                            this.allnum += item.component_count * item.capacity;
                        });
                        this.value3=this.allnum
                        console.log(this.domList, res, this.selectableMemories);
                    }
                });
            },
            /*获取cpu的数量，得到扩展版的最大数*/
            getcpu() {
                let getCpu = `select component_count from product_programme_detail detail
									join component_cpu cpu on cpu.category_id=detail.category_id  and cpu.id=detail.component_id
									where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                this.$db.get(getCpu, (err,res) => { // 获取cpu的值
                    if (!err) {
                        this.cpuMemory = res.component_count;
                        this.memoryDaShu=[];
                       // let kongZhi=res.component_count==2?2:3
                        for (let i=0;i<=res.component_count*2;i++) {
                            if(i<res.component_count){
                                continue
                            }else{
                                this.memoryDaShu.push(i)
                            }
                        }
                        console.log(this.cpuMemory,this.memoryDaShu)
                        /*查询完cpu后，=2时EMEF为2要不然为三*/
                        let updatenum=`select component_count from product_programme_detail
where category_id =(
select other.category_id from component_other other
join component_base_info info on info.id=other.base_info_id
where info.component_FC='EMEF'
)
and component_id =(
select other.id from component_other other
join component_base_info info on info.id=other.base_info_id
where info.component_FC='EMEF'
) and  solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}' `
                        console.log('更改成功',updatenum)
                        this.$db.get(updatenum,(err,res)=>{
                            if(err){
                                console.log('更改失败')
                            }else{
                                console.log('更改成功',res)
                                       // this.$set(this.EMEF,'upId',item.id)
                                        this.$set(this.EMEF,'num',res.component_count)
                            }
                        })
                    }
                })
            },
            //获取库里内存背板的数据
            selememoryDa(){
                let sql=`select detail.id,detail.component_count,component_id,info.description,info.description_en,info.withdraw_date,info.title_msg,info.ui_status from component_base_info info
join component_memoryrisercard card on card.base_info_id=info.id
join product_programme_detail detail on detail.category_id=card.category_id and detail.component_id=card.id
where solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                this.$db.get(sql, (err,res) => {//获取库里内存背板的数据
                    if (res) {
                        this.memorysum=res.component_count
                        this.memoryClonsum=res.component_count
                        this.$set(res, 'temponTit', res.title_msg) //展示的描述
                        this.$set(res, 'setTimeMe', res.withdraw_date)//过期的时间
                        if (res.withdraw_date) {
                            let thisTime = res.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                            let time = new Date(thisTime).getTime();//将时间改为时间戳
                            this.$set(res, 'time', time)//将时间戳添加到对象里面
                            //如果不为null的话,就改为天数
                            this.$store.commit('setStatusTime', res.withdraw_date)
                            this.$set(res, 'overdueTime', this.$store.state.overdueTime) // 要过期的天数，默认为null
                        } else {
                            this.$set(res, 'time', '不比')//将时间戳添加到对象里面
                        }
                        this.memoryData=[]
                        this.$store.commit('uiStatusTime', res.ui_status)
                        this.$set(res, 'uiStatusEn', this.$store.state.statusTime.uiStatusEn)//中文的描述
                        this.$set(res, 'uiStatus', this.$store.state.statusTime.uiStatus)//英文的描述
                        this.memoryData.push(res)
                        this.memoryDataId=res.component_id
                        this.upId=res.id//记录库里内存背板的id，进行更改
                        console.log(res,this.memoryData)
                    }
                })
            },
            getAdvanced(){
                return new Promise((resolve,reject)=>{
                    let SQL=`SELECT other.id,other.category_id,info.description,info.description_en,info.component_FC FROM component_base_info info
join component_other other on other.base_info_id=info.id
where info.component_FC in ('EM81','EMAM','EMEF') and info.productId='2'`
                    this.$db.all(SQL,(err,res)=>{
                        if(err){
                            console.log('查询失败')
                        }else{
                            console.log('查询成功',res,SQL)
                          return  resolve(res)
                        }
                    })
                }).then(res=>{
                    res.forEach(item=>{
                        if(item.component_FC=="EM81"){
                            this.EM81=item
                            this.$set(this.EM81,'num',1)
                            this.$set(this.EM81,'upId','')
                        }
                        if(item.component_FC=="EMAM"){
                            this.EMAM=item
                            this.$set(this.EMAM,'num',1)
                            this.$set(this.EMAM,'upId','')
                        }
                        if(item.component_FC=="EMEF"){
                            this.EMEF={...item,...this.EMEF}
                        }
                    })
                    console.log(this.EMAM,this.EMEF,this.EM81)
                })
            },
            getAdvancedLibrary(){
                let SQL=`select detail.id,detail.component_count,detail.category_id,detail.component_id from product_programme_detail detail
join component_other other on detail.category_id=other.category_id and detail.component_id = other.id
where detail.category_id in (${this.EMAM.category_id},${this.EMEF.category_id}) and detail.component_id in (${this.EMAM.id},${this.EMEF.id},${this.EM81.id}) and  solution_id='${localStorage.solutionId}' and template_id='${localStorage.templateId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                return new Promise((resolve,reject)=>{
                    this.$db.all(SQL,(err,res)=>{
                        if(err){
                            console.log('查询失败')
                        }else{
                            console.log('查询成功',res,SQL)
                            return  resolve(res)
                        }
                    })
                }).then(res=>{
                    res.forEach(item=>{
                        if(item.category_id==this.EMAM.category_id&&item.component_id==this.EMAM.id){
                            this.$set(this.EMAM,'upId',item.id)
                            this.$set(this.EMAM,'num',0)
                        }
                        // if(item.category_id==this.EMEF.category_id&&item.component_id==this.EMEF.id){
                        //     this.$set(this.EMEF,'upId',item.id)
                        //     this.$set(this.EMEF,'num',item.component_count)
                        // }
                        if(item.category_id==this.EM81.category_id&&item.component_id==this.EM81.id){
                            this.$set(this.EM81,'upId',item.id)
                            this.$set(this.EM81,'num',0)
                        }
                    })
                })
            },

            /*不让删除或者是不让减少时展示*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'warning'
                });
            },
            //查询库里激活码的id，数量。。
            otherShu(){
                //获取激活码的id，和区分他们，为添加做准备
                let getSQl=`select other.id,act.activation_type,act.activation_unit,other.category_id from component_other other join component_base_info info on info.id=other.base_info_id join relation_memory_activation act on act.base_info_id=info.id where info.category_id='12' and info.productId=2`  // and template_id='${localStorage.templateId}'
                //查询库里的激活码，id，为更改做准备
                let SQL=`SELECT detail.id,detail.component_id,detail.component_count FROM product_programme_detail detail
join component_other other on other.category_id=detail.category_id and other.id=detail.component_id
where detail.category_id='${this.$route.query.otheId}' and detail.template_id='${localStorage.templateId}' and  solution_id='${localStorage.solutionId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
                // and template_id='${localStorage.templateId}'
                console.log(this.$route.query.otheId,getSQl)
                this.$db.all(getSQl,(err,res)=>{
                    if(err){
                        console.log('查询失败')
                    }else{
                        res.forEach(item=>{
                            if(item.activation_type==0&&item.activation_unit==2){
                                this.$set(this.otherArr,0,{...item,gb:1,upId:''})
                            }
                            if(item.activation_type==0&&item.activation_unit==3){
                                this.$set(this.otherArr,1,{...item,gb:100,upId:''})
                            }
                            if(item.activation_type==1&&item.activation_unit==0){
                                this.$set(this.otherArr,2,{...item,gb:8,upId:''})
                            }
                            if(item.activation_type==1&&item.activation_unit==1){
                                this.$set(this.otherArr,3,{...item,gb:800,upId:''})
                            }
                        })
                        console.log('查询成功',this.otherArr,res)
                        this.$db.all(SQL,(err,res)=>{
                            if(err){
                                console.log('查询失败')
                            }else{
                                this.value3=0
                                this.value1=0
                                res.forEach(item=>{
                                    this.otherArr.forEach((it,ind)=>{
                                        if(item.component_id==it.id){
                                            this.otherArr[ind].upId=item.id//附上id
                                            if(it.activation_type==0){
                                                this.value3+=item.component_count*it.gb
                                            }
                                            if(it.activation_type==1){
                                                this.value1+=item.component_count*it.gb
                                            }
                                        }
                                    })
                                })
                                console.log(this.value3)
                                if(this.value1<=0){
                                    return this.value1=''
                                }
                                console.log('查询成功',this.otherArr,res)
                            }
                        })
                    }
                })
            }
        },
        watch:{
            value3(){
                console.log(223233)
                if(this.value3==0){
                    return
                }
                clearTimeout(this.time)
                this.time= setTimeout(()=>{
                    let num= this.value3%this.otherArr[1].gb
                    let sum= Math.floor(this.value3/this.otherArr[1].gb)
                    console.log(1111,sum,num)
                    //进来后直接删除所有的id在从新添加
                    if(this.otherArr[0].upId){
                        this.deleteOther(this.otherArr[0].upId,0)
                    }
                    if(this.otherArr[1].upId){
                        this.deleteOther(this.otherArr[1].upId,1)
                    }
                    if(sum){
                        //添加数据
                        this.addOther(this.otherArr[0].category_id,this.otherArr[0].id,num,this.otherArr[0].upId,0)
                    }
                    if(sum){
                        this.addOther(this.otherArr[1].category_id,this.otherArr[1].id,sum,this.otherArr[1].upId,1)
                    }
               },500)
            }
        },
       async created() {
            //获取下拉的内存数据
           await this.getkuS()
           //高级配置里的数据
           await this.getAdvanced()
           //查询高级配置的库里的数据
           await this.getAdvancedLibrary()
           this.getcpu()
            //获取库里的数据
            this.getList()
            //获取库里内存背板的数据
            this.selememoryDa()
           //查询库里激活码的id，数量。。
           this.otherShu()
        },
        beforeRouteEnter(form,to,next){
            next(vm=>{
                console.log(111,vm.$route.query.sign)
                if(vm.filstnum){
                    vm.getcpu()
                    //获取库里内存背板的数据
                    vm.selememoryDa()
                    //获取库里的数据
                    vm.getList()
                }
                vm.filstnum=1
                vm.$emit('comup', form.query.id);
            })
        },
    // beforeRouteLeave(to,form,next){
    //     let num=0
    //     this.domList.forEach((item,ind)=>{
    //         num+= Math.ceil(item.num/16)
    //     })
    //     if(num==this.memorysum||this.otherArr.length==this.memorysum){
    //         next()
    //     }else{
    //         this.$emit('erro', 1);
    //     }
    // }
    }
</script>

<style scoped lang="less">
    .Memory-MR{
        margin-left: 30px;
    }
    .memory-mr-p{
        margin-top: 12px;
    }
    .interior-butt{
        margin-left: 30px;
    }
    .memorya-thr{
        margin-left: 10px;
        position: relative;
        div{
            height: 60px;
            line-height: 60px;
        }
        .memorya-thr-span{
            margin-left: 20px;
            display: inline-block;
            overflow: hidden;
        }
        .memorya-thr-input{
            width: 200px;
        }
    }
    .memory-activations{
        label{
            display: inline-block;
            overflow: hidden;
        }
        >div:nth-child(1){
            display: inline-block;
            width: 100%;
            overflow: hidden;
            .memorya-thr-slider{
                width: 40%;
                position: relative;
                display: inline-block;
                padding: 10px 0;
                margin-left: 20px;
            }
            .is-disabled{
                width: 80px;
                overflow: hidden;
                display: inline-block;
                position: relative;
                overflow: hidden;
            }
        }
    }
</style>
