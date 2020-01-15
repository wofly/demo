<template>
    <!--欢迎使用的页面、页面，默认展示的-->
    <div class="login">
        <h2>{{ $t('index.Title')}}!</h2>
        <div class="nosan">
            <div class="recen">
                <h6>{{ $t('index.Start')}}</h6>
                <nav @click="toProgrammeAdd()">{{ $t('index.CreatePlan')}}</nav>
                <!--导入方案文件ips-->
                <nav>
                    <el-upload
                        accept=".ips"
                        class="upload-demo"
                        action= "#"
                        :http-request="upload"
                        :show-file-list = "false">
                        <p>
                            <el-button  type="text" style="width: 132px;;text-align: left;color: #000;font-size: 14px">
                                {{ $t('index.ImportPlan')}}
                            </el-button>
                        </p>
                    </el-upload>
                </nav>

            </div>
            <div class="recen">
                <!--<h6>{{ $t('index.TheRecentPlan')}}</h6>-->
                <nav v-for="(item, index) in this.recen" :key="index">
                    {{item}}
                </nav>
                <!--<nav>{{ $t('index.More')}}......</nav>-->
            </div>
            <div class="recen">
                <h6>{{ $t('index.Help')}}</h6>
                <nav @click="drawer = true">{{ $t('index.UpdateLog')}}</nav>
                <!--<nav>{{ $t('index.HelpDocument')}}</nav>-->
                <nav>{{ $t('index.Updates')}}</nav>
                <!--<nav>{{ $t('index.AboutUs')}}</nav>-->
            </div>
        </div>
        <div class="conen">
            <img src="../../../../static/img1-1.png" />
            <img src="../../../../static/img1-2.png" />
            <img src="../../../../static/img1-2.png" />
            <img src="../../../../static/img1-4.png" />
        </div>
        <el-drawer
                title="更新"
                :visible.sync="drawer"
                :with-header="false"
                label="ltr">
            <div v-for="item in upvalue" class="upvalue">
                <p>{{item.time}}</p>
                <div v-for="it in  item.detail">{{it}}</div>

            </div>
        </el-drawer>
    </div>
</template>

<script>
    import importSolution from "../../utils/importSolution";
    let Base64 = require('js-base64').Base64;
    export default {
        name: 'login',
        data() {
            return {
                conimg: [ // 首页图片的路径
                    '../../../../static/img1-1.png',
                    '../../../../static/img1-2.png',
                    '../../../../static/img1-2.png',
                    '../../../../static/img1-3.png',
                ],
                drawer: false,
                upvalue:[{
                    time:'2019-12-30',
                    detail:['主要是针对硬盘启动规则的验证进行优化','...','...']
                }]
                // recen: [this.$t('index.Alibaba'), this.$t('index.Baidu'), this.$t('index.BankOfChina')], // 最近方案下面的内容
            };
        },
        computed: {
            recen(){
              // return [this.$t('index.Alibaba'), this.$t('index.Baidu'), this.$t('index.BankOfChina')] //computed绑定数据
            }
        },
        methods: {
            toProgrammeAdd(){
                this.$router.push({
                    path: `/ProgrammeAdd/`,
                    query: { // 路由传参时push和query搭配使用 ，作用时传递参数
                        id:null,
                        path:"login"
                    },
                })
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

            }
        },
    };
</script>

<style scoped lang="scss">
    .login {
        margin-top: 100px;
        margin-left: 50px;
        font-size: 14px;
    }

    h2 {
        font-size: 32px;
        background-image: -webkit-linear-gradient(left, #ec02ff, #107dff); /*设置字体渐变色*/
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        width: 400px;
        margin-bottom: 20px;
        /*letter-spacing: 4px; !*设置字体间距*!*/
    }

    .nosan {
        width: 220px;
        float: left;

        .recen {
            margin-bottom: 30px;

            nav {
                width: 200px;
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                padding-left: 16px;
            }

            h6 {
                margin: 0;
                font-size: 14px;
                background: rgba(242, 242, 242, 1);
                width: 200px;
                height: 30px;
                line-height: 30px;
                padding-left: 16px;
            }
        }
    }

    .conen {
        margin-left: 220px;
        min-width: 770px;
        width: 70%;

        img {
            min-width: 310px;
            width: 45%;
            height: 200px;
            float: left;
            margin: 0 10px;
            margin-bottom: 20px;
        }
    }
    .foot-logo {
        margin-left: 800px;
        img{
            width: 220px;
            margin:30px 0px;
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
    .upvalue{
        margin-left: 30px;
        div{
            margin-left: 50px;
        }
    }
</style>
