<template>
    <!-- 第二个板块-->
    <el-aside width="200px" class="el-containerTwo">
        <div class="inheader">
            <!--<div>-->
            <!--<div class="search-img">-->
            <!--<img src="../assets/search-img.png"/>-->
            <!--</div>-->
            <!--<input class="search-input" placeholder="搜索"></input>-->
            <!--</div>-->
            <!--<div class="search-add" @click="inheaderEac(30)">-->
            <!--<div class="search-add">
                <img src="../../../../static/search-add.png">
            </div>-->
            <!--  点击展开事件 内部判断再次点击关闭-->
            <el-dropdown trigger="click">
                <span class="el-dropdown-link search-add">
                    <img src="../../../../static/search-add.png">
                </span>
                <el-dropdown-menu slot="dropdown" class="dropdown-box">
                    <el-dropdown-item icon="" >
                        <div @click="toProgrammeAdd();">{{$t('newProgram.newProgram')}}</div>
                    </el-dropdown-item>
                    <el-dropdown-item icon="">
                        <el-upload
                                class="upload-demo"
                                action= "#"
                                accept=".ips"
                                :http-request="upload"
                                :show-file-list = "false"
                        >
                            <p>
                                <el-button  type="text" style="width: 132px;;text-align: left;color: #000;font-size: 13px">
                                    {{$t('newProgram.ImportPlan')}}(*.ips)
                                </el-button>
                            </p>
                        </el-upload>
                        <!--<p>{{$t('newProgram.ImportPlan')}}(*.cfr)</p>-->
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <div class="inheader-bor">
            <div v-for="(item,index) in this.navig" :key="index" class="nain" @click="fn(index,item)">
                <div @click="setNavig(index)">
                    {{item.name}}
                    <i class="el-icon-arrow-up nasa" v-show="!item.cla"></i>
                    <i class="el-icon-arrow-down nasa" v-show="item.cla"></i>
                </div>
                <div v-for="(ite,ind) in item.str" :key="ind" class="naon" v-show="!item.cla"
                     @click.stop="jumpAnchor(ind,item)">
                    {{$t(ite)}}
                </div>
            </div>
        </div>

    </el-aside>
</template>

<script>
    import CfrConstants from '../../utils/cfrConstants';
    import ipscsParser from '../../utils/ipscsParser';
    import importSolution from "../../utils/importSolution";
    import Vue from 'vue'; //引入vue
    let vm = new Vue();
    let $db;
    setTimeout(()=>{
        $db = vm.$db; //不是undefined了
    },2000);
    let Base64 = require('js-base64').Base64;
    export default {
        name: 'comrou',
        data() {
            return {
                navig: [],
                num:0,
            };
        },
        methods: {
            upload(data) {
                let  fileTypes = ['ips']
                let file = data.file;
                let filename = data.file.name;
                let fileType = filename.substring( filename.lastIndexOf('.')+1 );
                if(fileTypes.indexOf(fileType) < 0) {
                    this.$message({
                        message: '不支持这种类型的文件！',
                        type: 'warning'
                    })
                    return false;
                }
                let reader = new FileReader();
                reader.onload = async (result)=>{
                    await this.callback(result);
                }
                reader.readAsText(file);
            },
            async callback(result){
                let decode = Base64.decode(result.target.result);
                // let decode = result.target.result;
                // console.log(decode)
                let sucFlag = await importSolution.importSolution(decode);
                if (sucFlag){
                    this.getSolution();
                }
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
            setNavig(index) { // 点击展开方案的方法
                this.navig[index].cla = false;

                this.navig.forEach((item, ind) => {
                    if (index !== ind) {
                        item.cla = true;
                    }
                })
            },

            fn(index, item,flag) {
                console.log(index,item)
                // if(flag == 1){
                //     localStorage.solutionId = item.id;
                // }
                //
                // if(flag == 2){
                //
                // }
                localStorage.solutionId = item.solutionId;
                // console.log(1111);

                // console.log(">>>>>>>>>>>>>>>. 判断点击",localStorage.solutionId);

                this.$router.push({ // 核心语句
                    path: '/Projectpar', // 跳转的路径
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        // id:this.id ,
                        id: localStorage.solutionId,
                    },
                });

                this.$store.commit('getsolutionId', localStorage.solutionId) // 点击后把solutionId存入Vuex
            },
            // 跨组件锚点定位：点击触发vuex方法切换ID
            jumpAnchor: function (ind, item) {
                localStorage.solutionId = item.solutionId;
                switch (ind) {
                    case 0 :
                        this.$store.commit('getIds1');
                        break;
                    case 1 :
                        this.$store.commit('getIds2');
                        break;
                    case 2 :
                        this.$store.commit('getIds3');
                        break;
                }
            },
            inheaderEac(tagre) {
                // 要用定时器，先清除定时器
                // 一个盒子只能有一个定时器，这样儿的话，不会和其他盒子出现定时器冲突
                // 而定时器本身讲成为盒子的一个属性
                const ele = this.$refs.inheaderEac;
                if (tagre === 30 && ele.offsetTop > 1) { // 判断当前是不是打开状态，打开的话再次点击将其关闭
                    tagre = -80;
                }
                clearInterval(ele.timer);
                // 我们要求盒子既能向前又能向后，那么我们的步长就得有正有负
                // 目标值如果大于当前值取正，目标值如果小于当前值取负
                const speed = tagre > ele.offsetTop ? 3 : -3;
                ele.timer = setInterval(function () {
                    // 在执行之前就获取当前值和目标值之差
                    const val = tagre - ele.offsetTop;
                    ele.style.top = ele.offsetTop + speed + 'px';
                    // 目标值和当前值只差如果小于步长，那么就不能在前进了
                    // 因为步长有正有负，所有转换成绝对值来比较
                    if (Math.abs(val) <= Math.abs(speed)) {
                        ele.style.top = tagre + 'px';
                        clearInterval(ele.timer);
                    }
                }, 10);
            },
            toProgrammeAdd() {
                this.$router.push({
                    path: `/ProgrammeAdd/`,
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        id: null,
                    },
                })
            },
            // 获取id最大的一条方案的信息
            async getSolution() {
                let than = this
                const SQL = 'select * from  solution ';
                await new Promise(function (resolve, reject) {
                    than.$db.all(SQL, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: '查询失败',
                                desc: err,
                            });
                        } else {
                            resolve(res)
                        }
                    });
                }).then(res => {
                    this.navig = [];
                    console.log(res)
                    if(res.length<1){
                        localStorage.setItem('solutionId','')
                    }else{
                        let solutionId = res[0].id;

                        localStorage.setItem('solutionId',solutionId);
                        console.log(localStorage.solutionId)
                        res.forEach((item, i, arr) => {
                            const obj = {
                                name: item.solution_name,
                                cla: true,
                                str: ['newProgram.ProjectIntroduction','newProgram.SolutionOverview','newProgram.PriceStatistics'],
                                solutionId: item.id
                            }
                            this.navig.push(obj);
                        })
                        if(this.num){
                            /*添加 或  删除 方案时  调用该方法 */
                            this.setNavig(this.navig.length-1);
                            this.fn(this.navig.length-1,this.navig[this.navig.length-1])
                        }
                        this.num=1
                    }
                })
            }
        },
        async created() {
            await this.getSolution()
        }
    };
</script>

<style lang="less">
    .el-containerTwo {
        background: #ddd;
        .el-dropdown-link {
            cursor: pointer;
            /*color: #409EFF;*/
        }
        .el-icon-arrow-down {
            font-size: 12px;
        }
        .demonstration {
            display: block;
            color: #8492a6;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .el-dropdown{
            width: 10%;
            text-align: right;
            margin-left: 90%;
        }
        .inheader { /*第二个板块的上面*/
            padding: 10px 10px;
            padding-bottom: 0;
            overflow: hidden;
            position: relative;
            background: #ddd;
            z-index: 3;
            /*.search-img {*/
            /*background: #ccc;*/
            /*width: 10%;*/
            /*height: 20px;*/
            /*float: left;*/
            /*text-align: center;*/
            /*}*/
            /*.search-input {*/
            /*width: 75%;*/
            /*height: 20px;*/
            /*float: left;*/
            /*background: #ccc;*/
            /*border: none;*/
            /*border-radius: 2px;*/
            /*outline: none;*/
            /*}*/

            .search-add {
                width: 20px;
                height: 20px;
                background: #ccc;
                text-align: center;
                float: right;
                border-radius: 2px;
            }
        }

        .inheaderEac {
            border: 1px solid #ccc;
            font-size: 12px;
            width: 140px;
            left: 50px;
            top: -80px;
            background: #fff;
            position: absolute;
            z-index: 2;

            p {
                height: 36px;
                line-height: 36px;
                padding-left: 6px;
                border-bottom: 1px solid #ccc;
            }

            p:hover {
                background: rgba(242, 242, 242, 1)
            }
        }

        .inheader-bor {
            border-top: 1px solid #ccc;
            padding-top: 20px;
            margin-top: 4px;
        }

        .nain { /*第二个板块的下面*/
            margin-left: 30px;
            cursor: pointer;

            .nasa {
                position: absolute;
                left: 160px;
                z-index: 1;
            }

            .nasa:hover {
                color: #00f;
            }

            .naon {
                margin-left: 20px;
                cursor: pointer
            }
        }
    }
    .dropdown-box {
        li:hover{
            color: #606266 !important;
        }
    }

</style>
