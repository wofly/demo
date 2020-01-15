<template>
    <!--方案详情-->
    <div id="box">
        <div class="header-pr1">
            <div class="hdr-main">
                <div class="listp">{{ $t('details.lists.scenarioName')}}
                    <p class="name">
                        {{name}}
                    </p>
                </div>

                <div class="pr1-list">
                    <ul>
                        <!--添加机器-->
                        <li @click="addMachien" class="add">
                            <span class="add-padding add-font">{{ $t('details.header.AddTheMachine')}}</span>
                        </li>
                        <!--整体校验-->
                        <li class="check">
                            <router-link to="/OnlineCheck">
                                <span class="add-padding check-font">
                                    {{ $t('details.header.TheOverallValidation')}}
                                </span>
                            </router-link>
                        </li>
                        <!--CFR转换-->
                        <li class="check convert">
                            <router-link to="/ConvertTools">
                                <span class="add-padding check-font">
                                    {{ $t('details.header.ConvertTools')}}
                                </span>
                            </router-link>
                        </li>
                        <!--编辑方案-->
                        <li @click="addSolution" class="edit">
                            <span class="add-padding edit-font">{{ $t('details.header.EditPackages')}}</span>
                        </li>
                        <!--删除方案-->
                        <li @click="deleteSolution" class="delete">
                            <span class="add-padding edit-font">{{ $t('details.header.DeleteProgram')}}</span>
                        </li>
                        <!--导入机器-->
                        <!-- <li class="leading">
                             <input class="importfile" @change="upload($event,callback)" type="file" />
                             <span class="add-padding leading-font">{{ $t('details.header.ImportMachine')}}</span>
                         </li>-->
                        <!---------------------------------------------------------->
                        <!--需求导入机器-->
                        <li class="leading position" > <!--@click="importSolution"-->
                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link add-padding leading-font">
                                    {{ $t('details.header.ImportSolution')}}
                                </span>
                                <el-dropdown-menu slot="dropdown" class="dropdown-box">
                                    <el-dropdown-item icon="">
                                        <el-upload
                                                accept=".ips"
                                                class=""
                                                action= "#"
                                                :http-request="upload"
                                                :show-file-list = "false">
                                            <p>
                                                <el-button  type="text" style="width: 132px;;text-align: left;color: #000;font-size: 14px">
                                                    {{ $t('details.header.ImportSchemeFile')}}(.ips)
                                                </el-button>
                                            </p>
                                        </el-upload>
                                        <!--<p>{{$t('newProgram.ImportPlan')}}(*.cfr)</p>-->
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <!--<span class="add-padding leading-font">{{ $t('details.header.ImportSolution')}}</span>
                            <div class="programme">
                                <el-collapse-transition>
                                    <div v-show ="show2">
                                        <el-upload
                                                accept=".ips"
                                                class="transition-box"
                                                action= "#"
                                                :http-request="upload"
                                                :show-file-list = "false">
                                            <p>
                                                <el-button  type="text" style="width: 132px;;text-align: left;color: #000;font-size: 14px">
                                                    {{ $t('details.header.ImportSchemeFile')}}(.ips)
                                                </el-button>
                                            </p>
                                        </el-upload>
                                    </div>
                                </el-collapse-transition>
                            </div>-->
                        </li>
                        <!--导出方案-->
                        <li  class="leading-out position" @click="exportSolution">
                            <!--加入导出方案 移动选项-->


                            <el-dropdown trigger="click">
                                <span class="el-dropdown-link add-padding leading-out-font">
                                    {{ $t('details.header.ExportPlan')}}
                                </span>
                                <el-dropdown-menu slot="dropdown" class="dropdown-box">
                                    <el-dropdown-item icon="" >
                                        <span @click="buttonStart('ips')">{{ $t('details.header.ExportPlanFile')}}(.ips)</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item icon="" >
                                        <span @click="exportExcel1()">{{ $t('details.header.BatchExportMachineFile')}}(.xls)</span>
                                    </el-dropdown-item>
                                    <el-dropdown-item icon="" >
                                        <span @click="buttonStart('cfr')">{{ $t('details.header.BatchExportMachineFile')}}(.cfr)</span>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <!--<span class="add-padding leading-out-font">{{ $t('details.header.ExportPlan')}}</span>
                            <div class="programme">
                                <el-collapse-transition>
                                    <div v-show ="show3">
                                        <span class="transition-box" @click="buttonStart('ips')">{{ $t('details.header.ExportPlanFile')}}(.ips)</span>
                                        <span class="transition-box transition" @click="exportExcel1()">{{ $t('details.header.BatchExportMachineFile')}}(.xls)</span>
                                        &lt;!&ndash;                                        <span class="transition-box" @click="buttonStart('xlsx')">导出方案文件(.xls)</span>&ndash;&gt;
                                        <span class="transition-box transition" @click="buttonStart('cfr')">{{ $t('details.header.BatchExportMachineFile')}}(.cfr)</span>
                                    </div>
                                </el-collapse-transition>
                            </div>-->
                        </li>

                        <!--                        <li  class="excel"  @click="buttonStart('xlsx')"  @mouseenter="editImage(5)" @mouseleave="editImages(5)">-->
                        <!--                            <img  v-show="leadingOutPictureSwitching" src="../../assets/object/leading-out2.png"/>-->
                        <!--                            <img  v-show="!leadingOutPictureSwitching" src="../../assets/object/leading-out.png"/>-->
                        <!--                            <span>导出EXCEL</span>-->
                        <!--                        </li>-->
                        <!--                        <li @click="buttonStart('csv')"><img src="../../assets/object/leading-out2.png"/><span>导出CSV</span></li>-->
                        <!--                        <li @click="buttonStart('excel')"><img src="../../assets/object/leading-out2.png"/><span>导出EXCEL</span></li>-->
                    </ul>
                </div>
            </div>
        </div>
        <div class="probody">
            <div class="header-pr2">
                <p class="tit-style listp" id="proInt">{{ $t('details.lists.ProjectIntroduction')}}</p>
            </div>
            <Detailhedr  ref="detailhedr" v-if="isRouterAlive"></Detailhedr>
            <div class="header-pr2">
                <p class="tit-style listp" id="proDes">{{ $t('details.lists.ProgramOverview')}}</p>
            </div>
            <Detailscheme ref="detailscheme" v-if="isRouterAlive"></Detailscheme>
            <div class="header-pr2">
                <p class="tit-style listp" id="priSta">{{ $t('details.lists.PriceStatistics')}}</p>
            </div>
            <DetailList ref="detailList" v-if="isRouterAlive"></DetailList>

            <div class="header-pr2">
                <p class="tit-style listp" id="priSta">{{ $t('details.lists.machineConfiguration')}}</p>
            </div>
            <DetailMain ref="detailMain" v-if="isRouterAlive"></DetailMain>
        </div>
    </div>
</template>

<script>
    // 拆分引入数据模块
    import Detailhedr from '@/components/900942A/Detailhedr.vue';
    import Detailscheme from '@/components/900942A/Detailscheme';
    import DetailList from '@/components/900942A/DetailList';
    import DetailMain from '@/components/900942A/DetailMain';
    import exportCfrOrCsv from "../../utils/exportCfrOrCsv";
    import exportCfrOrCsv950 from "../../utils/exportCfrOrCsv950";
    import exportIpscs1 from '../../utils/exportIpscs';
    import exportIpscs1950 from '../../utils/exportIpscs950';
    import exportSolutionCFR from '../../utils/exportSolutionCFR';
    import ipscsConvert from '../../utils/ipscsConvert';
    import dfu from '../../utils/dataFormatUtil'
    import exportExcel from '../../utils/exportExcelData';
    import importSolution  from "../../utils/importSolution";
    import Vue from 'vue'; //引入vue
    let vm = new Vue();
    let $db;
    setTimeout(()=>{
        $db = vm.$db; //不是undefined了
    },2000);
    let Base64 = require('js-base64').Base64;
    export default {
        name: 'Projectpar',
        components: {
            Detailhedr,
            Detailscheme,
            DetailList,
            DetailMain,
        },
        /*刷新本页面的数据*/
        provide :function() {
            return {
                reload:this.reload
            }
        },
        data() {
            return {
                name:'',
                /*导入方案  判断隐藏*/
                show2:false,
                /*导出方案  判断隐藏*/
                show3: false,
                Projump: '',
                /*刷新本页面的数据*/
                isRouterAlive:true,
            };
        },
        methods: {
            exportSolution(e){
                e.stopPropagation();
                this.show3=!this.show3
            },
            importSolution(e){
                e.stopPropagation();
                this.show2=!this.show2
            },
            //导入机器
            upload(data) {
                let  fileTypes = ['ips']
                let file = data.file;
                let filename = data.file.name;
                let fileType = filename.substring( filename.lastIndexOf('.')+1 );
                if(fileTypes.indexOf(fileType) < 0) {
                    alert('不支持这种类型的文件');
                    return false;
                }
                let reader = new FileReader();
                reader.onload = async (result)=>{
                    await this.callback(result);
                }
                reader.readAsText(file);
            },
            async callback(result){
                result = Base64.decode(result.target.result);
                // result = result.target.result;
                let sucFlag = await importSolution.importSolution(result);
                if (sucFlag){
                    this.$parent.$children[4].getSolution();
                }

            },
            async exportExcel1(){
                let solutionId= localStorage.solutionId;

                let ids=await dfu.select("select DISTINCT info.id from machine_info info  JOIN product_programme_detail detail on detail.machine_id=info.id and info.status=1 where info.solution_id="+solutionId)
                if(ids.length<1){
                    alert("没有可导出的机器！")
                    return ;
                }
                for (let i=0;i<ids.length;i++) {
                    let id=ids[i].id;
                    console.log("###############################"+id);
                    dfu.exportMachineConfService(id,true);
                }

            },
            /*刷新本页面的数据*/
            reload:function(){
                this.isRouterAlive=false;
                this.$nextTick(function(){
                    this.isRouterAlive=true
                })
            },

            getsolution(){
                const sql = `SELECT * FROM solution where id = '${localStorage.solutionId}'`;
                this.$db.all(sql, (err, res) => {
                    if (err) {

                        console.log('获取失败')
                    } else {

                        console.log('获取成功',res)
                        if(res.length>0){
                            this.name = res[0].solution_name;
                        }else{
                            this.name =''
                        }

                    }
                });
            },


            /* 获取ID锚点跳转*/
            getlocal() {
                const select = this.$store.state.ProAnchor; // 获取vuex数据
                const anchorElement = document.getElementById(select); // 获取指定标签
                if (select) {
                    anchorElement.scrollIntoView(); // 方法跳转
                }
                this.Projump = select;
            },
            /*删除方案*/
            deleteSolution(){
                let del = localStorage.getItem('solutionId');
                this.$confirm('删除后无法恢复，请谨慎操作！', '删除方案', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    /*删除detail*/
                    const deleteSQL=`delete from product_programme_detail  where id in( select detail.id from product_programme_detail detail join solution so on so.id=detail.solution_id where so.id= ${del})`
                    this.$db.run(deleteSQL, (err, res) => {
                        if (err) {
                            this.$Notice.error({
                                title: 'detail删除失败',
                                desc: err,
                            });
                        }else{
                            console.log('detail删除成功')
                            /*删除机器*/
                            const deleteSQL=`delete from machine_info  where id in ( select machine.id from machine_info machine join solution so on so.id = machine.solution_id where so.id= ${del})`
                            this.$db.run(deleteSQL, (err, res) => {
                                if (err) {
                                    this.$Notice.error({
                                        title: '机器删除失败',
                                        desc: err,
                                    });
                                }else{
                                    console.log('机器删除成功')
                                    /*删除方案*/
                                    const deleteSQL=`delete from solution where id = ${del}`
                                    this.$db.run(deleteSQL, (err, res) => {
                                        if (err) {
                                            this.$Notice.error({
                                                title: '方案删除失败',
                                                desc: err,
                                            });
                                        }else{
                                            console.log('方案删除成功')

                                            const delSQL=`delete from relation_solution_product where solution_id= ${del}`
                                            this.$db.run(delSQL, (err, res) => {
                                                if (err) {
                                                    this.$Notice.error({
                                                        title: '方案删除失败',
                                                        desc: err,
                                                    });
                                                }else{
                                                    console.log('删除成功')
                                                }
                                            })

                                            /*刷新方案列表*/
                                            this.$parent.$refs.comrou.getSolution()
                                            /*刷新方案简介*/
                                            this.$refs.detailhedr.getdata();
                                            /*刷新方案概述*/
                                            this.$refs.detailscheme.getDataList();
                                            /*刷新价格统计*/
                                            this.$refs.detailList.getDataList();
                                            /*刷新机器配置*/
                                            this.$refs.detailMain.setLists();

                                            this.getsolution();
                                            this.$message({
                                                type: 'success',
                                                message: '删除成功!'
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            /* 添加方案*/
            addSolution() {
                this.$router.push({ // 核心语句
                    path: '/ProgrammeAdd', // 跳转的路径
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        id: 1,
                    },
                });
            },
            /* 添加机器*/
            addMachien() {

                if(localStorage.solutionId == ''|| localStorage.solutionId == null ||localStorage.solutionId == undefined ){
                    this.err(this.$t('error.Machien'))
                    return false;
                }

                this.$router.push({ // 核心语句
                    path: '/ProductSelection', // 跳转的路径
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        // id:this.id ,
                    },
                });
            },
            async buttonStart(tailName) {
                let that = this;
                //获取配置完成的机器列表
                const machineSQL = `
                        select DISTINCT info.*,pi.machine_model,pi.machine_submodel from machine_info info
                        JOIN product_programme_detail detail on detail.machine_id=info.id and info.status=1
                        JOIN product_info AS pi ON info.product_id = pi.id
                         where info.solution_id= ${localStorage.solutionId}
                         AND pi.deleted = 1`;
                this.$db.all(machineSQL, async function (err, res) {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        let ipscsStr = '';
                        let allDataList = [];
                        let resultArr = [];
                        let ipsFlag = true;
                        if (res.length == 0){
                            alert("没有可导出的机器！");
                            return false;
                        }
                        for (let i = 0; i < res.length; i++) {
                            if (tailName == 'cfr') {
                                ipsFlag = false;
                                let typeModel = res[i].machine_model +'-'+ res[i].machine_submodel
                                if (typeModel == '9009-42A'){
                                    await that.exportCfr(res[i].remark_name, tailName, res[i].product_id, res[i].solution_id, res[i].templete_id, res[i].id);
                                }else{
                                    await that.exportCfr950(res[i].remark_name, tailName, res[i].product_id, res[i].solution_id, res[i].templete_id, res[i].id);
                                }
                            }else if (tailName == 'ips'){
                                let typeModelIps = res[i].machine_model +'-'+ res[i].machine_submodel
                                if (typeModelIps == '9009-42A'){
                                    let tempStr = await that.exportIpscs(res[i].remark_name,  res[i].product_id, res[i].solution_id, res[i].templete_id, res[i].id,i+1,res[i].count);
                                    ipscsStr += tempStr.resultStr;
                                    allDataList = allDataList.concat(tempStr.dataList);
                                }else{
                                    let tempStr950 = await that.exportIpscs950(res[i].remark_name,  res[i].product_id, res[i].solution_id, res[i].templete_id, res[i].id,i+1,res[i].count);
                                    ipscsStr += tempStr950.resultStr;
                                    allDataList = allDataList.concat(tempStr950.dataList);
                                }

                            }else if (tailName == 'xlsx') {
                                ipsFlag = false
                                await that.exportExcel(res[i].remark_name, tailName, res[i].product_id, res[i].solution_id, res[i].templete_id, res[i].id);
                            }
                        }
                        if (ipsFlag) {
                            //过滤掉相同featureCode
                            let flag;
                            for (let i = 0; i < allDataList.length; i++) {
                                flag = true;
                                for (let j = 0; j < resultArr.length; j++) {
                                    if (resultArr[j].featureCode == allDataList[i].featureCode) {
                                        flag = false;
                                        break;
                                    }
                                }
                                if (flag) {
                                    resultArr[resultArr.length] = allDataList[i];
                                }
                            }
                            let solutionList = await that.getSolutionList(localStorage.getItem("solutionId"));
                            let strConvertIps = ipscsConvert.strConvertCfr(ipscsStr, solutionList[0].solution_name, false, allDataList);
                            exportSolutionCFR.exportSolutionCFR.setValue(solutionList, solutionList[0].solution_name, strConvertIps);
                        }
                    }
                });
            },
            async exportIpscs(machineName,productId,solutionId,templateId,machineId,machineNo,count){
                let exportIpscs = await exportIpscs1.exportIpscs(machineName,productId,solutionId,templateId,machineId,machineNo,count);
                return exportIpscs;
            },
            async exportIpscs950(machineName,productId,solutionId,templateId,machineId,machineNo,count){
                let exportIpscs = await exportIpscs1950.exportIpscs950(machineName,productId,solutionId,templateId,machineId,machineNo,count);
                return exportIpscs;
            },
            async exportCfr(machineName,tailName,productId,solutionId,templateId,machineId) {
                await exportCfrOrCsv.exportCfrOrCsv(machineName,tailName,productId,solutionId,templateId,machineId);
            },
            async exportCfr950(machineName,tailName,productId,solutionId,templateId,machineId) {
                await exportCfrOrCsv950.exportCfrOrCsv950(machineName,tailName,productId,solutionId,templateId,machineId);
            },
            async exportExcel(machineName,tailName,productId,solutionId,templateId,machineId){
                await exportExcel.exportExcel(machineName,tailName,productId,solutionId,templateId,machineId);
            },
            isNumber(c) {
                let reg = /^\+?[1-9][0-9]*$/;　　//正整数
                if (c == null || c == undefined || c == ''){
                    return false;
                }
                if (reg.test(c)){
                    return true;
                }
                return false;
            },
            rand(min,max) {
                return Math.floor(Math.random()*(max-min))+min;
            },
            /**
             * 获取某个方案信息
             * @param solutionId
             */
            async getSolutionList(solutionId) {
                let solutionList = [];
                const SQL = `SELECT * FROM solution WHERE id = ${solutionId}`;
                await new Promise(function(resolve, reject) {
                    $db.all(SQL, (err, res) => {
                        if (err) {
                            resolve(null);
                        } else {
                            resolve(res);
                        }
                    });
                }).then((data) => {
                    solutionList = data;
                });
                return solutionList;
            },
            /**
             * 判断是否为空
             * @param sText
             * @returns {boolean}
             */
            isEmpty(sText) {
                if (sText == null || sText == undefined || sText == '') {
                    return true;
                } else if (sText.trim().length == 0) {
                    return true;
                }
                return false;
            },


            /*不让删除或者是不让减少时展示*/
            err(err) {
                this.$message({
                    showClose: true,
                    message: err,
                    type: 'warning'
                });
            },
        },

        mounted(){
            const sql = `SELECT * FROM solution where id = '${localStorage.solutionId}'`;
            this.$db.all(sql, (err, res) => {
                if (err) {

                    console.log('获取失败')
                } else {

                    if(res.length>0){
                        console.log('获取成功',res)
                        if(res.length>0){
                            this.name = res[0].solution_name;
                        }else{
                            this.name =''
                        }
                    }
                }
            });
        },
        created(){
            document.getElementsByTagName('body')[0].onclick = (e)=>{
                this.show2 = this.show3 = false;
            }
        },
        /* 监听vuex数据变化触发锚点方法 */
        watch: {
            '$store.state.ProAnchor': 'getlocal',
            '$store.state.solutionId': function() {
                this.getsolution();
            },
        },
    };
</script>
<style scoped lang="scss">
    #app {
        color: #2c3e50;
    }

    * {
        /*padding: 0;
        margin: 0;*/
        list-style: none;
        box-sizing: border-box;
    }
    .listp{
        font-weight: bolder;
    }
    .box {
        min-width: 700px;
        width: 100%;
        height: 100%;
    }

    .probody {
        width: 100%;
    }

    .header-pr2 {
        width: 100%;
        padding: 20px;
    }

    .tit-style {
        width: 100%;
        padding-bottom: 20px;
        border-bottom: 1px solid #ebebeb;
    }

    .header-pr1 {
        width: 100%;
        padding: 20px;

        .hdr-main {
            width: 100%;
            padding-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ebebeb;
        }

        .pr1-list ul {
            display: flex;
            margin-top: 15px;

            li {
                cursor: pointer;
                margin-left: 28px;
                text-align: center;
                position: relative;
                span {
                    display: block;
                    padding-top: 24px;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .importfile{
        position: absolute;
        cursor: pointer;
        left: 0;
        top: 0;
        width: 65px;
        height: 45px;
        opacity: 0;
        z-index: 99999;
    }

    .upload{
        width: 65px;
        visibility: hidden;
    }

    .edit{
        background-image:url("../../../../static/object/edit2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .edit:hover{
        background-image:url("../../../../static/object/edit.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .edit-font:hover{
        color: rgb(42,115,204);
    }
    .delete{
        background-image:url("../../../../static/object/delete1.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .delete:hover{
        background-image:url("../../../../static/object/delete2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .delete-font:hover{
        color: rgb(42,115,204);
    }

    .add{
        background-image:url("../../../../static/object/add2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .add:hover{
        background-image:url("../../../../static/object/add.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }
    .add-font:hover{
        color: rgb(42,115,204);
    }
    .check{
        background-image:url("../../../../static/object/check2.png") ;
        background-repeat: no-repeat;
        background-position: top;
        a{
            color: #2c3e50 !important;
        }
    }

    .check:hover{
        background-image:url("../../../../static/object/check.png") ;
        background-repeat: no-repeat;
        background-position: top;
        color: rgb(42,115,204);
    }
    .convert{
        background-image:url("../../../../static/object/cfr-convert.png") ;
    }
    .convert:hover{
        background-image:url("../../../../static/object/cfr-convert1.png") ;
    }
    .check-font:hover{
        color: rgb(42,115,204);
    }
    .leading{
        background-image:url("../../../../static/object/leading2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .leading:hover{
        background-image:url("../../../../static/object/leading.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }
    .leading-font:hover{
        color: rgb(42,115,204);
    }
    .leading-out{
        background-image:url("../../../../static/object/leading-out2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .leading-out:hover{
        background-image:url("../../../../static/object/leading-out.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }
    .leading-out-font:hover{
        color: rgb(42,115,204);
    }

    .position{
        position: relative;
    }

    .programme{
        position: absolute;
        top: 55px;
        right: 0;
    }
    /*导出方案文件  样式*/
    .transition-box {
        width: 175px;
        height: 45px;
        line-height: 45px;
        background: #fff;
        border-radius: 4px;
        text-align: center;
        box-sizing: border-box;
    }

    .transition{
        border-top: none;
    }

    .check span a {
        color: #000;
        text-decoration: none;
    }
    .check span a:hover {
        color: rgb(42,115,204);
        text-decoration: none;
    }

    .name{
        margin-top: 10px;
        font-weight: 400;
    }
</style>
