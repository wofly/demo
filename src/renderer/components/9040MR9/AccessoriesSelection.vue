<template>
    <div class="accessories">
        <!--配件-->
        <p class="title content-label font">
            <span class="config-title">{{$t('ConfigureHardware.parts')}}</span>
        </p>

        <!--获取到的配件-->
        <div class="modify for-main" v-for="(ite,ind) in otherData" :key="ite.id">

            <el-select v-model="ite.pcie_type" size="mini" class="selle">
                <el-option
                        v-for="(item,index) in ite.type"
                        :key="index"
                        :label="$store.state.info_language?item.typeName:item.type"
                        :value="index">
                </el-option>
            </el-select>
            <el-select v-model="ite.description_en" size="mini" @change="recorOther(ind,ite.description_en)">
                <el-option
                        v-for="(item,index) in ite.description"
                        :key="index"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.id">
                </el-option>
            </el-select>
            <p>*</p>
            <el-input v-model="ite.sum"  class="sel" placeholder="请输入内容" disabled="disabled"></el-input>
            <div class="pdiv" v-if="ite.temponTit">
                {{ite.temponTit}}
            </div>
            <div class="pdiv red-a" v-if="ite.uiStatus">
                {{$store.state.info_language?ite.uiStatusEn:ite.uiStatus}}
            </div>
            <div class="pdiv" v-if="ite.setTimeMe">
                此部件将于&lt; {{ite.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{ite.overdueTime}}&gt; 天
            </div>
        </div>

        <!-- 带出的EPTH-->
        <div class="modify for-main" v-for="(ite,ind) in otherDataList" :key="ite.id">

            <el-select v-model="ite.pcie_type" size="mini" class="selle">
                <el-option
                        v-for="(item,index) in ite.type"
                        :key="index"
                        :label="$store.state.info_language?item.typeName:item.type"
                        :value="index">
                </el-option>
            </el-select>
            <el-select v-model="ite.description_en" size="mini" @change="recorOther(ind,ite.description_en)">
                <el-option
                        v-for="(item,index) in ite.description"
                        :key="index"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.id">
                </el-option>
            </el-select>
            <p>*</p>
            <el-input v-model="ite.sum"  class="sel" placeholder="请输入内容" disabled="disabled"></el-input>
            <div class="pdiv" v-if="ite.temponTit">
                {{ite.temponTit}}
            </div>
            <div class="pdiv red-a" v-if="ite.uiStatus">
                {{$store.state.info_language?ite.uiStatusEn:ite.uiStatus}}
            </div>
            <div class="pdiv" v-if="ite.setTimeMe">
                此部件将于&lt; {{ite.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{ite.overdueTime}}&gt; 天
            </div>
        </div>

        <!--获取HBA 卡带出的 ECW0-->
        <div class="modify for-main" v-for="(ite,ind) in hbaData" :key="ite.id">

            <el-select v-model="ite.pcie_type" size="mini" class="selle">
                <el-option
                        v-for="(item,index) in ite.type"
                        :key="index"
                        :label="$store.state.info_language?item.typeName:item.type"
                        :value="index">
                </el-option>
            </el-select>
            <el-select v-model="ite.description_en" size="mini">
                <el-option
                        v-for="(item,index) in ite.description"
                        :key="index"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.id">
                </el-option>
            </el-select>
            <p>*</p>
            <el-input v-model="ite.num"  class="sel" placeholder="请输入内容" maxlength="3"  @keyup.native="changeNum(ite.num,ind,ite.value,1)" @change="changeData(ite.num)"></el-input>
            <div class="pdiv" v-if="ite.temponTit">
                {{ite.temponTit}}
            </div>
            <div class="pdiv red-a" v-if="ite.uiStatus">
                {{$store.state.info_language?ite.uiStatusEn:ite.uiStatus}}
            </div>
            <div class="pdiv" v-if="ite.setTimeMe">
                此部件将于&lt; {{ite.setTimeMe}}&gt;  停产。距离停产日期还有&lt; {{ite.overdueTime}}&gt; 天
            </div>
        </div>

        <!--配件-->
        <div class="modify for-main" v-for="(ite,ind) in arr" :key="ind">
            <el-select v-model="ite.valueSas"  size="mini"
                       class="selle" @change="getDisk(ite.valueSas,ind)">
                <el-option
                        v-for="(item,index) in ite.SAS"
                        :key="index"
                        :label="$store.state.info_language?item.name_en:item.name"
                        :value="item.category_id"
                        :disabled="item.category_id ==30">
                </el-option>
            </el-select>
            <el-select v-model="(ite.value=='没有可以匹配的'&&$store.state.info_language)?'There s no match':ite.value"   size="mini" @change="set(ind,ite.value,ite.num)"  @visible-change="beforSet($event,ind)">
                <el-option
                        v-for="(item,index) in ite.domlist"
                        :key="index"
                        :label="$store.state.info_language?item.description_en:item.description"
                        :value="item.other_id">
                </el-option>
            </el-select>

            <p>*</p>

            <el-input class="sel" v-model="ite.num"  @keyup.native="changeNum(ite.num,ind,ite.value,2)"  @change="set(ind,ite.value,ite.num)" maxlength="3" ></el-input>

            <el-button size="mini" type="info" icon="el-icon-close" circle @click="dele(ind,ite.value)" v-show="arr.length>1?1:0" class="dele"></el-button>

            <br>
            <div v-if="ind == arr.length -1"  class="but">
                <el-button size="mini" icon="el-icon-plus" @click="add(ind)" class="add"></el-button>
                <span class="add-cables">{{$t('ConfigureHardware.AddAccessories')}}</span>
            </div>
        </div>

        <!--手动添加组件-->
        <p class="title content-label font">
            <span class="config-title">{{$t('ConfigureHardware.AddComponentsManually')}}</span>
        </p>
        <div class="modify for-main" v-for="(item,index) in options">
            <el-select v-model="item.value" placeholder="请选择" size="mini" class="selle">
                <el-option
                        v-for="it in item.arr"
                        :key="it.value"
                        :label="$store.state.info_language?it.labelY:it.label"
                        :value="it.value">
                </el-option>
            </el-select>
            <el-input v-model="item.inputFeature" :placeholder="$store.state.info_language?'Please input feature':'请输入Feature' " class="selle"></el-input>
            <el-input v-model="item.inputFdes" :placeholder="$store.state.info_language?'Please enter a description':'请输入描述'" style="width: 450px"></el-input>
            <el-input v-model="item.inputNum" :placeholder="$store.state.info_language?'Input quantity':'输入数量'" class="sel" @input="changeSum(index,item.inputNum)"></el-input>
            <el-button type="success" icon="el-icon-check" circle class="externalPcie-butt" v-show="item.bool"></el-button>
            <el-button size="mini" type="info" icon="el-icon-check" circle class="externalPcie-butt" v-show="!item.bool" @click="insePei(index)"></el-button>
            <el-button size="mini" type="info" icon="el-icon-close" circle class="externalPcie-butt" @click="deletePei(index)"></el-button>
        </div>
        <el-button size="mini" icon="el-icon-plus" @click="addPei()" class="add"></el-button>
        <span class="add-cables">{{$t('ConfigureHardware.AddComponents')}}</span>
    </div>
</template>

<script>

    export default {
        name: "AccessoriesSelection",

        data(){
            return {
                arrOptions:[{
                value: 0,
                label: '硬件',
                labelY:'Hardware'
            }, {
                value: 1,
                label: 'HPO',
                labelY:'HPO'
            }],
                options:[],
                // 外层循环数组
                arr:[],
                // 存储 已选中 数据id
                brr:[],
                // 配件型号 下拉数据
                arAy:[],
                // 配件带出数据
                otherData: [],
                // hba 带出的ECWO  因为带出数据可操作，需要单独展示
                hbaData:[],
                // 获取ECWO 数据库里的id
                hbaDataId:'',
                // 带出的EPTH
                otherDataList:[],
                // 导线id
                epthId:'',
            }
        },

        methods:{

            // 更改HBA 带出的 ECWO  数量
            changeData(num){
                console.log(num)
                console.log(this.hbaDataId)
                if(isNaN(num*1)){
                    console.log('不是一个数')
                    return false
                }

                let update = `UPDATE product_programme_detail set 'component_count'='${num}' where id=${this.hbaDataId} `;
                this.$db.run(update, (err, res) => {
                    if (err) {
                        console.log('修改失败')
                    } else {
                        console.log('修改成功')
                    }
                })
            },

            //添加组件时
            addPei(){
                if(this.options[this.options.length-1].id){
                    this.options.push({
                        arr:this.arrOptions,
                        value:0,
                        inputFeature:'',
                        inputFdes:'',
                        inputNum:'',
                        bool:false,
                        id:''
                    })
                }else{
                    console.log('上面的没有填写')
                    return
                }
            },

            //点击对号的时候，如果数量 fc 描述都有值得话就添加
            insePei(index){
                if(!this.options[index].inputFeature){
                   return this.open(this.$t('ConfigureHardware.PleaseAddTheContentOfFC'),'warning')
                }
                if(!this.options[index].inputFdes){
                    return this.open(this.$t('ConfigureHardware.PleaseAddTheDescriptionOfFC'),'warning')
                }
                if(!this.options[index].inputNum){
                    return this.open(this.$t('ConfigureHardware.PleaseAddTheNumberOfFC'),'warning')
                }
                if(this.options[index].id){
                    let updateSQl=`update manual_addition_feature set fc_cnt = '${this.options[index].inputNum}',fc_code='${this.options[index].inputFeature}',fc_desc='${this.options[index].inputFdes}',fc_type='${this.options[index].value}' where id='${this.options[index].id}'`
                    this.$db.run(updateSQl,(err,res)=>{
                        if(err){
                            console.log('修改失败')
                        }else{
                            console.log('修改成功')
                            this.open(this.$t('ConfigureHardware.ModifiedSuccess'),'success')
                        }
                    })
                }else{
                    let time= new Date().getTime()
                    let insetcSQL=`INSERT INTO manual_addition_feature
                ('product_id','fc_type','solution_id','template_id','machine_id','fc_cnt','fc_code','fc_desc','seq_Key')
                VALUES ('${localStorage.productId}','${this.options[index].value}','${localStorage.solutionId}','${localStorage.templateId}','${localStorage.machineId}','${this.options[index].inputNum}','${this.options[index].inputFeature}','${this.options[index].inputFdes}','${time}')`
                    this.$db.run(insetcSQL,(err,res)=>{
                        if(err){
                            console.log('添加失败',insetcSQL)
                        }else{
                            console.log('添加成功')
                            this.open(this.$t('ConfigureHardware.AddSuccess'),'success')
                           let inquireSQl=`select id from manual_addition_feature where seq_Key='${time}'`
                            this.$db.get(inquireSQl,(err,res)=>{
                                if(err){
                                    console.log('查询失败')
                                }else{
                                    console.log('查询成功',res)
                                    if(res){
                                        this.options[index].id=res.id
                                    }
                                }
                            })
                        }
                    })
                }
            },

            //在输入数量的时候只能输入数字
            changeSum(index,num){
                console.log(111111)
                this.options[index].inputNum = num.replace( /[^\d]/g, '');
            },

            deletePei(index){
                if(this.options[index].id){
                    let dele=`delete from manual_addition_feature where id='${this.options[index].id}'`
                    this.$db.run(dele,(err,res)=>{
                        if(err){
                            console.log('删除失败',dele)
                        }else{
                            console.log('删除成功',res)
                            this.open(this.$t('ConfigureHardware.DeleteSuccessful'),'success')
                            if(this.options.length==1){
                                this.options[0].value=0
                                this.options[0].inputFeature='',
                                this.options[0].inputFdes='',
                                this.options[0].inputNum='',
                                this.options[0].bool=false,
                                this.options[0].id=''
                            }else{
                                this.options.splice(index,1)
                            }
                        }
                    })
                }else{
                    if(this.options.length==1){
                        this.options[0].value=0
                        this.options[0].inputFeature='',
                        this.options[0].inputFdes='',
                        this.options[0].inputNum='',
                        this.options[0].bool=false,
                        this.options[0].id=''
                    }else{
                        this.options.splice(index,1)
                    }
                }
            },

            //警告的弹出
            open(value,type) {
                this.$message({
                    message: value,
                    type: type
                });
            },

            /*输入弹性激活容量时进行的数量校验*/
            changeNum(num,ind,value,flag) {

                // 配件正则校验 正则校验
                if(flag == 2){
                    let reg = /^\+?[1-9][0-9]*$/;　　//正整数
                    if (!reg.test(num)) {
                        this.arr[ind].num = 1;
                        return false;
                    }
                }

              // 获取HBA 卡带出的 ECW0  正则校验
                if(flag == 1){
                    let reg = /^\+?[1-9][0-9]*$/;　　//正整数
                    if (!reg.test(num)) {
                        this.hbaData[ind].num = 1;
                        return false;
                    }
                }
            },

            /*修改扩展柜ej20的数量，多余的就添加到内部里面，但是在一块展示*/
            recorOther(index, id) {
                console.log(this.otherData[index])
                let updateExternal = `UPDATE product_programme_detail set 'component_id'='${id}' where id=${this.otherData[index].id} `;
                this.$db.run(updateExternal, (err, res) => {
                    if (err) {
                        console.log('修改失败')
                    } else {
                        console.log('修改成功', id)
                    }
                })
            },

            /*存储硬盘数据  型号与个数*/
            set(ind,id,num){
                console.log(this.epthId)

                let time=new Date().getTime()
                if(isNaN(num*1)){
                    console.log('不是一个数')
                    return false
                }

                if (this.arr[this.arr.length - 1].value == '没有可以匹配的') {
                    return;
                }

                if(!num){
                    this.arr[ind].num=1
                }

                this.setEPTH(ind,id,num);

                console.log(ind,this.arr[ind].domlist[0].id,num)
                /*显示隐藏总容量*/
                this.$route.query.showMax = true;

                const SQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id')
VALUES('${localStorage.productId}','${localStorage.machineId}','${this.arr[ind].valueSas}','${id}','${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}')`

                const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}' ,'category_id' = '${this.arr[ind].valueSas}',component_id='${id}' where id=${this.arr[ind].id}`;
                if(this.arr[ind].id){
                    this.$db.run(updateSql, (err, res) => {
                        if (res) {
                            console.log('修改失败');
                        } else {
                            console.log('修改成功');
                            this.brr[ind]=id
                            console.log(res,this.brr)
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
                                    this.arr[ind].id = res.id;
                                    this.brr.push(id)
                                    console.log(res,this.brr)
                                }
                            });
                        }
                    })
                }
            },

            /*选择EPTJ  添加导轨*/
            setEPTH(ind,id,num){
                console.log(ind,id,num)
                if(id == 61){
                    let time=new Date().getTime()
                    const updateSql = `UPDATE product_programme_detail set 'component_count'='${num}'  where id=${this.epthId}`;
                    const SQL = `INSERT INTO product_programme_detail
('product_id','machine_id','category_id','component_id','component_count','seq_Key','solution_id','template_id')
select '${localStorage.productId}','${localStorage.machineId}',other.category_id,other.id,'${num}','${time}','${localStorage.solutionId}','${localStorage.templateId}'from component_other other
join component_base_info info on info.id=other.base_info_id
where other.category_id=29`

                    if(this.epthId){
                        this.$db.run(updateSql, (err, res) => {
                            if (res) {
                                console.log('修改失败');
                            } else {
                                console.log('修改成功');
                                this.showEPTH()

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
                                        console.log('获取失败')
                                    }else{
                                        this.epthId = res.id;
                                        this.showEPTH()
                                    }
                                });
                            }
                        })
                    }
                }

                if( this.arr[ind].orgId == 61 && id != 61){
                    let deleteExternal = `delete from product_programme_detail where id='${this.epthId}'`
                    this.$db.run(deleteExternal, (err, res) => {
                        if (err) {
                           console.log('删除失败')
                        } else {
                            console.log('删除成功')
                            this.epthId = ''
                            this.showEPTH()
                        }
                    })
                }
                this.arr[ind].orgId = id;
            },

            /*显示导轨EPTH*/
            showEPTH(){
                this.otherDataList = [];
                /*--------------------PDU横向支架（导轨），根据EPTJ自动带出，数量等于EPTJ数量-------------------------------*/
                let EPTJ=`select  info.description,info.description_en,cate.name,cate.name_en,detail.* from product_programme_detail detail join component_other other on detail.category_id=other.category_id and detail.component_id=other.id and other.category_id=29 join component_base_info info on info.id=other.base_info_id
join component_category cate on cate.id=other.category_id
where  product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'  and machine_id='${localStorage.machineId}' and info.component_FC='EPTH'`
                this.$db.get(EPTJ, (err, res) => { // LAN 带出的线缆
                    console.log(EPTJ, res)
                    if (res) {
                        let obj = {
                            description_en: res.component_id,//选中的数据id
                            pcie_type: 0,//带出线缆的类型
                            type:[{type:res.name,typeName:res.name_en}],//选择展示的类型
                            description:[{description:res.description,description_en:res.description_en,id:res.component_id}],// 选择展示数据
                            id: res.id,// 库里的id
                            sum: res.component_count,//要展示的数量
                        }
                        this.epthId = res.id
                        let lanId = res.component_id//要储存的component_id
                        this.otherDataList.push(obj)

                    }
                })

            },

            /*添加已选中数据*/
            add(index){

              if(this.arr[index].domlist.length  == 1){
                  return false;
              }
                /*显示隐藏总容量*/
                // this.$route.query.showMax = true;
                console.log(this.brr)
                    console.log(this.arAy)
                let lArr=this.arAy.filter(item=>{ //过滤后的数组
                    let num=true
                    this.brr.forEach(it=>{

                        if(item.other_id==it){
                            num=false
                            return
                        }
                    })
                    return num
                })
                this.arr.push({
                    domlist:[...lArr],
                    value:'',
                    num:1,
                    id:'',
                    numZ:1,
                    SAS:[...this.SAS],
                    valueSas:this.SAS[0].category_id,
                    flag:this.SAS[0].category_id

                })
                console.log('this.arr111111111111',this.arr)
                this.getDisk(39,this.arr.length-1)

            },

            /*删除已选中数据*/
            dele(index,id){

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
                            this.brr.splice(index,1)
                            this.arr.splice(index,1)
                            console.log("删除成功",this.brr)
                        }
                    })
                }

                if(id == 61){

                    const deleteSQL = `DELETE FROM product_programme_detail WHERE id = ${this.epthId}`;
                    this.$logger(deleteSQL);
                    this.$db.run(deleteSQL, (err, res) => {
                        if (err) {
                            console.log('删除失败')
                        }else{
                            console.log('删除成功')
                            this.epthId = ''
                            this.showEPTH()
                        }
                    });

                }
            },

            /*提示信息*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'error'
                });
            },

            /*将 选中数据，存储到 新数组中*/
            beforSet(bool,ind){
                if(bool){
                    console.log(this.arr)
                    console.log(this.brr)
                    console.log(this.arr[ind].arAy)
                    let gettime= new Date().getTime() //获取现在的时间戳
                    this.arr[ind].domlist = this.arr[ind].arAy.filter(item=>{
                        let num=true
                        this.brr.forEach((it,index)=>{

                            if(this.$store.state.showWithdraw==0 && item.time<gettime && ind != index){
                                return false //如果时间小于现在时间，也就说过市了，不在显示
                            }

                            if(item.other_id==it&&index!=ind){
                                return  num=false
                            }

                        })
                        return num
                    })
                    console.log(this.arr[ind].domlist,this.brr)
                }
            },

            /*获取 配件数据*/
            getDisk(id,index){
                console.log(id, this.arr[index].flag)

                let than = this

                const SQL = `select info.*,other.id other_id from component_base_info info
join component_other other on other.base_info_id=info.id and other.category_id=info.category_id
where info.productId=2 and other.category_id = ${id} and info.component_FC not in ('EJRL','ECW0') `
                console.log(SQL)
                new Promise(function(resolve, reject) {
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
                    res.forEach((item,index)=>{
                        this.$set(item,'temponTit',item.title_msg) //展示的描述
                        this.$set(item,'setTimeMe',item.withdraw_date)//过期的时间
                        if(item.withdraw_date){
                            let  thisTime = item.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                            let time = new Date(thisTime).getTime();//将时间改为时间戳
                            this.$set(item,'time',time)//将时间戳添加到对象里面
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

                    this.arr[index].arAy = [...res]
                    res = res.filter((item, i) => {//获取到数据后，
                        for (let j = 0; j < this.brr.length; j++) {//brr里面记录过的，就把他删除掉，因为上面已经选择过了
                            if (item.other_id == this.brr[j]) {
                                return false;
                            }
                        }
                        return true;
                    });
                    console.log(res)
                    this.arAy = [...res]
                    this.arr[index].domlist=[...res];

                    this.arr[index].value = this.arr[index].domlist.length == 0 ? '没有可以匹配的' : this.arr[index].domlist[0].other_id;// 默认展示第一个值,如果没有值显示没有匹配的

                    if(this.arr[index].domlist.length>0){
                        this.set(index,this.arr[index].domlist[0].other_id,1);
                    }
                });
                than.arr[index].flag = id;
            },

            /*获取硬盘类型数据*/
            getSAS(){
                const SQLSAS=`select distinct cate.name,cate.name_en,other.category_id from component_other other
join component_category cate on cate.id=other.category_id
join component_base_info info on info.id=other.base_info_id
where info.productId='${localStorage.productId}' and cate.id = 39`

                this.$db.all(SQLSAS, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '获取数据失败',
                            desc: err,
                        });
                    } else {
                        console.log(res);
                        this.SAS = [...res];
                    }
                });
            },

            // 获取库里带出的配件
            getOther() {
                this.otherData = [];
                console.log('是否重新获取')

                /*-----------------------------------------获取CPU 激活码------------------------------------------*/
                let CPUCode=` select info.description,info.description_en,relation.activation_type,relation.activation_unit,cate.name,cate.name_en,detail.* from product_programme_detail detail
  join component_other other on detail.category_id=other.category_id and detail.component_id=other.id
 join component_base_info info on info.id=other.base_info_id
 join relation_cpu_activation relation on relation.base_info_id=other.base_info_id
 join component_category cate on cate.id=other.category_id
 where detail.product_id='${localStorage.productId}' and detail.category_id=11 and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'`
                this.$db.all(CPUCode, (err, res) => { // LAN 带出的线缆
                    console.log(CPUCode, res)
                    if (res) {

                        res.forEach(item=>{
                            console.log(item)
                            let obj = {
                                description_en: item.component_id,//选中的数据id
                                pcie_type: 0,//带出线缆的类型
                                type:[{type:item.name,typeName:item.name_en}],//选择展示的类型
                                description:[{description:item.description,description_en:item.description_en,id:item.component_id}],// 选择展示数据
                                id: item.id,// 库里的id
                                sum: item.component_count,//要展示的数量
                            }
                            let activation = res.component_id//要储存的component_id
                            this.otherData.push(obj)
                        })
                    }
                })


                /*-----------------------------------------线缆------------------------------------------*/
                let power=` select info.description,info.description_en,cate.name,cate.name_en,sum(component_count),detail.* from product_programme_detail detail
join component_ other on other.category_id=detail.category_id and other.id=detail.component_id
join component_base_info info on info.id=other.base_info_id
join component_category cate on cate.id=other.category_id
where detail.product_id='${localStorage.productId}' and detail.category_id=30 and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'`
                this.$db.all(power, (err, res) => { // LAN 带出的线缆
                    console.log(power, res)
                    if (res) {

                        res.forEach(item=>{
                            console.log(item)
                            let obj = {
                                description_en: item.component_id,//选中的数据id
                                pcie_type: 0,//带出线缆的类型
                                type:[{type:item.name,typeName:item.name_en}],//选择展示的类型
                                description:[{description:item.description,description_en:item.description_en,id:item.component_id}],// 选择展示数据
                                id: item.id,// 库里的id
                                sum: item.component_count,//要展示的数量
                            }
                            let activation = res.component_id//要储存的component_id
                            this.otherData.push(obj)
                        })
                    }
                })

                /*-----------------------------------------内存激活码------------------------------------------*/
                let internal=` select info.description,info.description_en,relation.activation_type,relation.activation_unit,cate.name,cate.name_en,detail.* from product_programme_detail detail
 join component_other other on detail.category_id=other.category_id and detail.component_id=other.id
join component_base_info info on info.id=other.base_info_id
join relation_memory_activation relation on relation.base_info_id=other.base_info_id
join component_category cate on cate.id=other.category_id
where detail.product_id='${localStorage.productId}' and detail.category_id=12 and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'`
                this.$db.all(internal, (err, res) => { // LAN 带出的线缆
                    console.log(internal, res)
                    if (res) {

                        res.forEach(item=>{
                            console.log(item)

                            let obj = {
                                description_en: item.component_id,//选中的数据id
                                pcie_type: 0,//带出线缆的类型
                                type:[{type:item.name,typeName:item.name_en}],//选择展示的类型
                                description:[{description:item.description,description_en:item.description_en,id:item.component_id}],// 选择展示数据
                                id: item.id,// 库里的id
                                sum: item.component_count,//要展示的数量
                            }
                            let activation = res.component_id//要储存的component_id
                            this.otherData.push(obj)
                        })
                    }
                })

                /*------------------------------硬盘启动位置--------------------------------------*/
                let EHR1=`select info.description,info.description_en,cate.name,cate.name_en,detail.* from product_programme_detail detail
join component_other other on other.category_id=detail.category_id and other.id=detail.component_id
join component_base_info info on info.id=other.base_info_id
join component_category cate on cate.id=other.category_id
where detail.product_id='${localStorage.productId}' and other.category_id=38 and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'`
                this.$db.get(EHR1, (err, res) => { // LAN 带出的线缆
                    console.log(EHR1, res)
                    if (res) {
                        let obj = {
                            description_en: res.component_id,//选中的数据id
                            pcie_type: 0,//带出线缆的类型
                            type:[{type:res.name,typeName:res.name_en}],//选择展示的类型
                            description:[{description:res.description,description_en:res.description_en,id:res.component_id}],// 选择展示数据
                            id: res.id,// 库里的id
                            sum: res.component_count,//要展示的数量
                        }
                        let activation = res.component_id//要储存的component_id

                        this.otherData.push(obj)
                    }
                })

                /*---------------------------------------获取 语言-----------------------------------------------*/
                let lang=`select info.description,info.description_en,cate.name,cate.name_en,detail.* from product_programme_detail detail
 join component_other other on other.category_id=detail.category_id and other.id=detail.component_id
 join component_base_info info on info.id=other.base_info_id
 join component_category cate on cate.id=info.category_id
 where detail.id in (select id from product_programme_detail where category_id=28 and  product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}')`
                this.$db.get(lang, (err, res) => { // 获取库里已选中的语言
                    console.log(lang, res)
                    if (res) {
                        /*获取 语言下拉数据*/
                        let langData=`	select other.id ,info.description,info.description_en,cate.name,cate.name_en from  component_other other
		join component_base_info info on info.id=other.base_info_id
		join component_category cate on cate.id=info.category_id
		where info.productId=2 and cate.id=28 `

                        let langDataList = []
                        this.$db.all(langData,(err,resA) =>{

                            if(err){
                                console.log('获取失败')
                            }else{
                                console.log('获取成功',resA)
                                langDataList = [...resA];

                                let obj = {
                                    description_en: res.component_id,//选中的数据id
                                    pcie_type: 0,//语言的类型
                                    type:[{type:res.name,typeName:res.name_en}],//选择展示的类型
                                    description:[...langDataList],// 语言下拉数据
                                    id: res.id,// 库里的id
                                    sum: res.component_count,//要展示的数量
                                }
                                this.otherData.push(obj)

                            }
                        })
                    }
                })

                /*---------------------------------被存储背板EJ0C带出，不可被删除----------------------------------------*/
                let LAN=`select  info.description,info.description_en,cate.name,cate.name_en,detail.* from product_programme_detail detail join component_other other on detail.category_id=other.category_id and detail.component_id=other.id and other.category_id=30 join component_base_info info on info.id=other.base_info_id
join component_category cate on cate.id=other.category_id
where  product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}' and info.component_FC='ECE3'`
                this.$db.get(LAN, (err, res) => { // LAN 带出的线缆
                    console.log(LAN, res)
                    if (res) {
                        let obj = {
                            description_en: res.component_id,//选中的数据id
                            pcie_type: 0,//带出线缆的类型
                            type:[{type:res.name,typeName:res.name_en}],//选择展示的类型
                            description:[{description:res.description,description_en:res.description_en,id:res.component_id}],// 选择展示数据
                            id: res.id,// 库里的id
                            sum: res.component_count,//要展示的数量
                        }
                        let lanId = res.component_id//要储存的component_id

                        this.otherData.push(obj)

                    }
                })

                /*---------------------------------被存储背板EJ0C带出，不可被删除----------------------------------------*/
                let EHS2=`select  info.description,info.description_en,cate.name,cate.name_en,detail.* from product_programme_detail detail join component_other other on detail.category_id=other.category_id and detail.component_id=other.id and other.category_id=39 join component_base_info info on info.id=other.base_info_id
join component_category cate on cate.id=other.category_id
where  product_id='${localStorage.productId}' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}'
                and machine_id='${localStorage.machineId}' and info.component_FC='EHS2'`
                this.$db.get(EHS2, (err, res) => { // LAN 带出的线缆
                    console.log(EHS2, res)
                    if (res) {
                        let obj = {
                            description_en: res.component_id,//选中的数据id
                            pcie_type: 0,//带出线缆的类型
                            type:[{type:res.name,typeName:res.name_en}],//选择展示的类型
                            description:[{description:res.description,description_en:res.description_en,id:res.component_id}],// 选择展示数据
                            id: res.id,// 库里的id
                            sum: res.component_count,//要展示的数量
                        }
                        let lanId = res.component_id//要储存的component_id

                        this.otherData.push(obj)

                    }
                })


                /*--------------------若SAS卡EJ14总数为奇数，则出现此fc，数量为1，不可更改数量 的为EJ14+EJRL总为偶数------------*/
                let EJRL=`select  info.description,info.description_en,cate.name,cate.name_en,detail.* from product_programme_detail detail
 join component_other other on detail.category_id=other.category_id and detail.component_id=other.id
 join component_base_info info on info.id=other.base_info_id
 join component_category cate on cate.id=other.category_id
where detail.product_id='${localStorage.productId}'  and info.component_FC='EJRL' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'`
                this.$db.get(EJRL, (err, res) => { // LAN 带出的线缆
                    console.log(EJRL, res)
                    if (res) {
                        let obj = {
                            description_en: res.component_id,//选中的数据id
                            pcie_type: 0,//带出线缆的类型
                            type:[{type:res.name,typeName:res.name_en}],//选择展示的类型
                            description:[{description:res.description,description_en:res.description_en,id:res.component_id}],// 选择展示数据
                            id: res.id,// 库里的id
                            sum: res.component_count,//要展示的数量
                        }
                        let activation = res.component_id//要储存的component_id

                        this.otherData.push(obj)

                    }
                })


                /*--------------------每个HBA卡配1个，可手动调整到上限999，可以被删到0    ECW0------------*/
                let ECW0=`select  info.description,info.description_en,cate.name,cate.name_en,detail.* from product_programme_detail detail
 join component_other other on detail.category_id=other.category_id and detail.component_id=other.id
 join component_base_info info on info.id=other.base_info_id
 join component_category cate on cate.id=other.category_id
where detail.product_id='${localStorage.productId}'  and info.component_FC='ECW0' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'`
                this.hbaData = [];
                this.$db.get(ECW0, (err, res) => { // LAN 带出的线缆
                    console.log(ECW0, res)
                    if (res) {
                        let obj = {
                            description_en: res.component_id,//选中的数据id
                            pcie_type: 0,//带出线缆的类型
                            type:[{type:res.name,typeName:res.name_en}],//选择展示的类型
                            description:[{description:res.description,description_en:res.description_en,id:res.component_id}],// 选择展示数据
                            id: res.id,// 库里的id
                            num: res.component_count,//要展示的数量
                        }
                        let activation = res.component_id//要储存的component_id
                        this.hbaDataId = res.id;
                        this.hbaData.push(obj)

                    }
                })

                /*---------------------------获取内存VRM办板-------------------------------*/
                let VRM=`select  info.description,info.description_en,cate.name,cate.name_en,detail.* from product_programme_detail detail
 join component_other other on detail.category_id=other.category_id and detail.component_id=other.id
 join component_base_info info on info.id=other.base_info_id
 join component_category cate on cate.id=other.category_id
where detail.product_id='${localStorage.productId}'  and info.component_FC='EMEF' and template_id='${localStorage.templateId}' and solution_id='${localStorage.solutionId}' and machine_id='${localStorage.machineId}'`
                this.$db.get(VRM, (err, res) => { // LAN 带出的线缆
                    console.log(VRM, res)
                    if (res) {
                        let obj = {
                            description_en: res.component_id,//选中的数据id
                            pcie_type: 0,//带出线缆的类型
                            type:[{type:res.name,typeName:res.name_en}],//选择展示的类型
                            description:[{description:res.description,description_en:res.description_en,id:res.component_id}],// 选择展示数据
                            id: res.id,// 库里的id
                            sum: res.component_count,//要展示的数量
                        }
                        let activation = res.component_id//要储存的component_id

                        this.otherData.push(obj)

                    }
                })
                this.showEPTH()
            },

        },

        mounted() {

            /* 查询到  已存入product_programme_detail 表里的数据*/
            let getSQL= `select detail.id detail_id,other.id other_id,other.category_id,cate.name,cate.name_en,info.description,info.description_en,info.ui_status,info.withdraw_date,detail.component_count from product_programme_detail detail
        join component_other other on other.category_id=detail.category_id and other.id=detail.component_id
    join component_base_info info on info.id=other.base_info_id
    join component_category cate on cate.id=info.category_id
        where detail.product_id='${localStorage.productId}' and  solution_id='${localStorage.solutionId}' and
            template_id='${localStorage.templateId}' and machine_id='${localStorage.machineId}' and detail.category_id =39 and info.component_FC !='ECW0' `
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
                        this.arr=[]
                        this.brr=[]
                        res.forEach(item=>{
                            let than = this
                            const SQL = `select info.*,other.id other_id from component_base_info info
join component_other other on other.base_info_id=info.id and other.category_id=info.category_id
where info.productId=2 and other.category_id = ${item.category_id}  and info.component_FC not in ('EJRL','ECW0')  `

                            console.log(SQL)
                            new Promise(function(resolve, reject) {
                                than.$db.all(SQL, (err, ress) => {
                                    if (err) {
                                        console.log('获取失败')
                                    } else {
                                        resolve(ress);
                                    }
                                });
                            }).then(ress => {
                                console.log(ress)
                                ress.forEach((ite,index)=>{
                                    this.$set(ite,'temponTit',ite.title_msg) //展示的描述
                                    this.$set(ite,'setTimeMe',ite.withdraw_date)//过期的时间
                                    if(ite.withdraw_date!=null){
                                        let  thisTime = ite.withdraw_date.replace(/-/g, '/');//将-中文-格式时间改为/英文/ 格式
                                        let time = new Date(thisTime).getTime();//将时间改为时间戳
                                        this.$set(ite,'time',time)//将时间戳添加到对象里面
                                        this.$set(ress[index],'time',time)//将时间戳添加到对象里面
                                        //如果不为null的话,就改为天数
                                        this.$store.commit('setStatusTime',ite.withdraw_date)
                                        this.$set(ite,'overdueTime',this.$store.state.overdueTime) // 要过期的天数，默认为null
                                    }else{
                                        this.$set(ress[index],'time','不比')//将时间戳添加到对象里面
                                    }
                                    this.$store.commit('uiStatusTime',item.ui_status)
                                    this.$set(ite,'uiStatusEn',this.$store.state.statusTime.uiStatusEn)//中文的描述
                                    this.$set(ite,'uiStatus',this.$store.state.statusTime.uiStatus)//英文的描述
                                });

                                const SQLSAS=`select distinct cate.name,cate.name_en,other.category_id from component_other other
join component_category cate on cate.id=other.category_id
join component_base_info info on info.id=other.base_info_id  where info.productId='${localStorage.productId}' and  cate.id = 39`
                                console.log(SQLSAS)
                                this.$db.all(SQLSAS, (err, resSAS) => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: '获取数据失败',
                                            desc: err,
                                        });
                                    } else {
                                        console.log(item)
                                        this.SAS = [...resSAS];
                                        console.log(this.SAS)
                                        than.arAy = [...ress]
                                        than.brr.push(item.other_id)
                                        than.arr.push({
                                            domlist:[...ress],
                                            arAy:[...ress],
                                            value:item.other_id,
                                            orgId:item.other_id,
                                            num:item.component_count,
                                            id:item.detail_id,
                                            // numZ:this.num,
                                            SAS:[...this.SAS],
                                            valueSas:item.category_id,
                                            flag:item.category_id,
                                        })
                                        console.log('获取成功',res,ress,this.arr,this.brr)
                                    }
                                });
                            });
                        })
                    }else{
                        this.getSAS();
                        this.set(this.arr.length-1,this.arAy[0].id);
                    }
                }
            })

            //获取配件里面加的hpo和硬件
            let selectSQL=`select * from manual_addition_feature where  template_id='${localStorage.templateId}'and solution_id='${localStorage.solutionId}'and product_id='${localStorage.productId}' and machine_id='${localStorage.machineId}'`
            this.$db.all(selectSQL,(err,res)=>{
                if(err){
                    console.log('查询失败')
                }else{
                    console.log('查询成功',res)
                    if(res.length>0){
                        res.forEach(item=>{
                            if(!item.origin_fc_id){
                                let obj={
                                    arr:this.arrOptions,
                                    value:item.fc_type,
                                    inputFeature:item.fc_code,
                                    inputFdes:item.fc_desc,
                                    inputNum:item.fc_cnt,
                                    bool:false,
                                    id:item.id
                                }
                                this.options.push(obj)
                            }
                        })
                        if(this.options.length==0){
                            this.options.push({
                                arr:this.arrOptions,
                                value:0,
                                inputFeature:'',
                                inputFdes:'',
                                inputNum:'',
                                bool:false,
                                id:''
                            })
                        }
                    }else{
                        this.options.push({
                            arr:this.arrOptions,
                            value:0,
                            inputFeature:'',
                            inputFdes:'',
                            inputNum:'',
                            bool:false,
                            id:''
                        })
                    }

                    console.log(this.options)
                }
            })
        },

        /* 获取component_category 表中id */
        beforeRouteEnter(from,to,next){
            next(vm=>{
                vm.$emit('comup',from.query.id)
                vm.getOther();
            })
        },

    }
</script>

<style scoped>

    .accessories{
        margin: 20px;
    }

    .add{
        margin: 0 10px;
    }
    .modify{
        margin: 10px 0;
    }
    .dele{
        margin-left: 20px;
    }
    .other{
        width: 145px;
    }
    .font{
        font-size: 16px;
    }
    .but{
        margin-top: 15px;
        margin-bottom: 30px;
    }
</style>
