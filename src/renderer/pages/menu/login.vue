<template>
    <!--欢迎使用的页面、页面，默认展示的-->
    <div class="login">
        <h2>{{ $t('index.Title')}}!</h2>
        <div class="nosan">
            <div class="recen">
                <h6>{{ $t('index.Start')}}</h6>
                <nav @click="toProgrammeAdd()">{{ $t('index.CreatePlan')}}</nav>
                <nav>{{ $t('index.ImportPlan')}}</nav>
            </div>
            <div class="recen">
                <h6>{{ $t('index.TheRecentPlan')}}</h6>
                <nav v-for="(item, index) in this.recen" :key="index">
                    {{item}}
                </nav>
                <nav>{{ $t('index.More')}}......</nav>
            </div>
            <div class="recen">
                <h6>{{ $t('index.Help')}}</h6>
                <nav>{{ $t('index.UpdateLog')}}</nav>
                <nav>{{ $t('index.HelpDocument')}}</nav>
                <nav>{{ $t('index.Updates')}}</nav>
                <nav>{{ $t('index.AboutUs')}}</nav>
            </div>
        </div>
        <div class="conen">
            <img src="../.././assets/img1-1.png" />
            <img src="../.././assets/img1-2.png" />
            <img src="../.././assets/img1-2.png" />
            <img src="../.././assets/img1-4.png" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                conimg: [ // 首页图片的路径
                    '../.././assets/img1-1.png',
                    '../.././assets/img1-2.png',
                    '../.././assets/img1-2.png',
                    '../.././assets/img1-3.png',
                ],
                // recen: [this.$t('index.Alibaba'), this.$t('index.Baidu'), this.$t('index.BankOfChina')], // 最近方案下面的内容
            };
        },
        computed: {
            recen(){
              return [this.$t('index.Alibaba'), this.$t('index.Baidu'), this.$t('index.BankOfChina')] //computed绑定数据
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
</style>
