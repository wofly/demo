<template>
    <!--方案详情-->
    <div id="box">
        <div class="header-pr1">
            <div class="hdr-main">
                <p class="listp">{{ $t('details.lists.scenarioName')}}</p>
                <div class="pr1-list">
                    <ul>
                        <li @click="addSolution" class="edit">
                            <span class="add-padding edit-font">{{ $t('details.header.EditPackages')}}</span>
                        </li>

                        <li @click="addMachien" class="add">
                            <span class="add-padding add-font">{{ $t('details.header.AddTheMachine')}}</span>
                        </li>
                        <li class="check">
                            <span class="add-padding check-font">{{ $t('details.header.TheOverallValidation')}}</span>
                        </li>
                        <li class="leading">
                            <input class="importfile" @change="upload($event,callback)" type="file" />
                            <span class="add-padding leading-font">{{ $t('details.header.ImportMachine')}}</span>


                        </li>
                        <li  class="leading-out position" @click="show3=!show3" @mouseleave="onMouseOut">
                            <!--加入导出方案 移动选项-->
                            <span class="add-padding leading-out-font">{{ $t('details.header.ExportPlan')}}</span>
                            <div class="programme">
                                <el-collapse-transition>
                                    <div v-show ="show3">
                                        <span class="transition-box" @click="buttonStart('exportSolutionCFR')">导出方案文件(.ipscs)</span>
                                        <span class="transition-box" @click="buttonStart('xlsx')">导出方案文件(.xls)</span>
                                        <span class="transition-box" @click="buttonStart('cfr')">导出方案文件(.cfr)</span>
                                    </div>
                                </el-collapse-transition>
                            </div>
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
            <Detailhedr></Detailhedr>
            <div class="header-pr2">
                <p class="tit-style listp" id="proDes">{{ $t('details.lists.ProgramOverview')}}</p>
            </div>
            <Detailscheme></Detailscheme>
            <div class="header-pr2">
                <p class="tit-style listp" id="priSta">{{ $t('details.lists.PriceStatistics')}}</p>
            </div>
            <DetailList></DetailList>

            <div class="header-pr2">
                <p class="tit-style listp" id="priSta">{{ $t('details.lists.machineConfiguration')}}</p>
            </div>
            <DetailMain></DetailMain>
        </div>
    </div>
</template>

<script>
    // 拆分引入数据模块
    import Detailhedr from '@/components/Detailhedr.vue';
    import Detailscheme from '@/components/Detailscheme';
    import DetailList from '@/components/DetailList';
    import DetailMain from '@/components/DetailMain';
    import exportCfrOrCsv from "../../utils/exportCfrOrCsv";
    import CfrConstants from '../../utils/cfrConstants';
    import cfrParser from '../../utils/cfrParser';
    export default {
        name: 'Projectpar',
        components: {
            Detailhedr,
            Detailscheme,
            DetailList,
            DetailMain,
        },
        data() {
            return {
                /*导出方案  判断隐藏*/
                show3: false,
                Projump: '',
            };
        },
        mounted() {
        },
        methods: {

            /*导出方案 移出隐藏*/
            onMouseOut(){
                this.show3 = false;
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
                this.$router.push({ // 核心语句
                    path: '/ProductSelection', // 跳转的路径
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        // id:this.id ,
                    },
                });
            },
            buttonStart(tailName) {
                //获取配置完成的机器列表
                const machineSQL = `SELECT * FROM machine_info WHERE status = 1 AND product_id = 1 AND solution_id = ${localStorage.solutionId}`;
                this.$db.all(machineSQL, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        for (let i = 0; i < res.length; i++) {
                            this.exportCfr(res[i].remark_name,tailName,res[i].product_id,res[i].solution_id,res[i].templete_id,res[i].id);
                        }
                    }
                });
            },
            exportCfr(machineName,tailName,productId,solutionId,templateId,machineId) {
                exportCfrOrCsv.exportCfrOrCsv(machineName,tailName,productId,solutionId,templateId,machineId);
            },
            //导入機器
            upload(event,callback) {
                let file = event.target.files[0];
                let reader = new FileReader();
                reader.onload = function() {
                    callback(this.result);
                }
                reader.readAsText(file);
            },
            callback(result){
                // console.log(result);
                let dataList = {
                    headerData:[],
                    systemData:[],
                    lineData:[]
                }
                let listOfLines = result.split('\n');
                let list = cfrParser.cfrParser(listOfLines, true, false, false);
                let systemSeq = '';
                for (let i = 0; i < list.length; i++) {
                    let listOfLine = list[i];
                    console.log('list-----------' + listOfLine);
                    if (listOfLine[0] == CfrConstants.CfrConstants.CSV_CFR[0]){
                        i++;
                        listOfLine = list[i];
                        dataList.headerData = listOfLine;
                        continue;
                    };
                    if (listOfLine[0] == CfrConstants.CfrConstants.CSV_SYSTEM[0]) {
                        i++;
                        listOfLine = list[i];
                        systemSeq = listOfLine[0];
                        dataList.systemData.push(listOfLine);
                        continue;
                    }
                    let lineMap = new Map();
                    dataList.lineData.push(lineMap.set(systemSeq,listOfLine));
                }
                console.log('dataList1 -------' + dataList.headerData);
                console.log('dataList2 -------' + dataList.systemData);
                for (let i = 0; i < dataList.lineData.length; i++) {
                    let obj= Array.from(dataList.lineData[i]);
                    for(let k in obj){
                        if (!this.isNumber(obj[k][1][0].charAt(0)))
                            continue;
                        console.log('dataList3 -------' + obj[k][0]);
                        console.log('dataList3 -------' + obj[k][1]);
                    }
                }
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
            }
        },

        /* 监听vuex数据变化触发锚点方法 */
        watch: {
            '$store.state.ProAnchor': 'getlocal',
        },
    };
</script>
<style scoped lang="scss">
    #app {
        color: #2c3e50;
    }

    * {
        padding: 0;
        margin: 0;
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
                padding: 12px;
                margin-left: 9px;
                text-align: center;
                /*border: 1px solid #333333;*/
                position: relative;
                span {
                    display: block;
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

    .add-padding{
        padding-top:15px;
    }

    .upload{
        width: 65px;
        visibility: hidden;
    }

    .edit{
        background-image:url("../../assets/object/edit2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .edit:hover{
        background-image:url("../../assets/object/edit.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .edit-font:hover{
        color: rgb(42,115,204);
    }
    .add{
        background-image:url("../../assets/object/add2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .add:hover{
        background-image:url("../../assets/object/add.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }
    .add-font:hover{
        color: rgb(42,115,204);
    }
    .check{
        background-image:url("../../assets/object/check2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .check:hover{
        background-image:url("../../assets/object/check.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }
    .check-font:hover{
        color: rgb(42,115,204);
    }
    .leading{
        background-image:url("../../assets/object/leading2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .leading:hover{
        background-image:url("../../assets/object/leading.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }
    .leading-font:hover{
        color: rgb(42,115,204);
    }
    .leading-out{
        background-image:url("../../assets/object/leading-out2.png") ;
        background-repeat: no-repeat;
        background-position: top;
    }

    .leading-out:hover{
        background-image:url("../../assets/object/leading-out.png") ;
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
        border: 1px solid #ccc;
        text-align: center;
        box-sizing: border-box;
    }
</style>
