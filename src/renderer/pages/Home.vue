<template>
    <div class="home-background theme-color1">
        <div class="update-msg" v-show="loading">
            <label>更新信息展示：</label>
            <!--<el-progress :percentage="percent" class="load-progress" status="success"></el-progress>-->
            <el-progress :text-inside="true" class="load-progress" :stroke-width="24" :percentage="percent"
                         status="success"></el-progress>
            <el-button type="success" class="load-btn" @click="backgroundOperation">后台运行</el-button>
        </div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <span>应用已下载，是否关闭客户端安装更新？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false;">取 消</el-button>
                <el-button type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
        <!--<Header class="header"></Header>-->
        <Aside class="aside"></Aside>
        <Comrou class="comrou" ref="comrou"></Comrou>
        <div class="container">
            <router-view class="clearfix"></router-view>
        </div>
    </div>
</template>
<script>
    import Aside from './menu/Aside.vue';
    // import Header from '../components/Header.vue';
    import Comrou from '../components/900942A/Comrou.vue';
    import packageJson from '../../../package.json';

    export default {
        data() {
            return {
                dialogVisible: false,
                loading: false,
                testMsg: '',
                updateNow: false,
                currentVersion: packageJson.version,
                updateURI: packageJson.uri,
                updateText: '',
                percent: 0,
                downloadProgress: null,
                downloadInfo: {
                    percent: null,
                    totalMB: 0,
                    KBPerSecond: 0,
                },
                updateModalShow: false,
                updateInfo: {
                    releaseName: '',
                    releaseNotes: '',
                    releaseDate: '',
                    version: '',
                },
            };
        },
        components: {
            Aside,
            // Header,
            Comrou,
        },
        methods: {
            /*-------------------自动更新处理begin------------------------*/
            checkUpdate() {
                this.$electron.ipcRenderer.send('system', 'check-for-update', this.updateURI);
                // this.loading = true;
            },
            close() {
                this.$electron.remote.getCurrentWindow().hide();
            },
            backgroundOperation() {
                this.loading = false;
            },
            doUpdate(){
                this.dialogVisible = false;
                this.updateNow = true;
                this.$electron.ipcRenderer.send('system', 'update');
            },
            update() {
                this.$electron.ipcRenderer.on('check-for-update', (event, message) => {
                    console.log('调用更新方法：：', message)
                    this.message = message;
                    if (message === '检测到新版本，正在下载……') {
                        this.loading = true;
                    }
                    if (message === '检查更新出错, 请联系开发人员') {
                        this.loading = false;
                        if (this.updateText !== message) {
                            this.$Notice.error({
                                title: this.$t('index.UpdateError'),
                                desc: '',
                            });
                        }
                    }
                    if (message === '现在使用的就是最新版本，不用更新') {
                        this.loading = false;
                        if (this.updateText !== message) {
                            this.updateText = message;
                            this.$Notice.info({
                                title: this.$t('index.IsNewVersion'),
                                desc: '',
                            });
                        }
                    }
                    if (message === '最新版本已下载，点击安装进行更新') {
                        this.updateText = '安装';
                        this.loading = false;
                        this.percent = 100;
                        // this.checkUpdate=()=>{
                        // }
                        this.dialogVisible = true;
                        /*if (this.updateNow){
                            this.$electron.ipcRenderer.send('system', 'update');
                        }*/
                    }
                });
                this.$electron.ipcRenderer.on('update-down-success', (event, message) => {
                    this.NewVersion = 'New ' + message.version;
                });
                this.$electron.ipcRenderer.on('download-progress', (event, message) => {
                    this.$nextTick(() => {
                        this.percent = parseInt(message.percent);
                        console.log('下载进度更新了：：：：', message)
                        if (this.percent === 100) {
                            this.updateText = '安装';
                            this.loading = false;
                            this.dialogVisible = true;
                            /*this.checkUpdate = () => {
                                this.$electron.ipcRenderer.send('system', 'update');
                            }*/
                        }
                    });
                });
                window.onbeforeunload = () => {
                    if (this.percent > 0 && this.percent !== 100) {
                        return false
                    }
                };
            },
            /*---------------------------自动更新end-----------------------------------------*/
        },
        created() {
            // this.update();
            // this.checkUpdate();
        },

    };
</script>
<style lang="less">
    @import "../assets/less/global.less";

    .update-msg {
        position: fixed;
        width: 100%;
        height: 100%;
        background: #1c2438;
        opacity: 0.9;
        z-index: 999;
        .load-progress {
            width: 60%;
            height: 30px;
            margin: 15% auto 0 auto;
        }
        .load-btn {
            display: block;
            width: 100px;
            margin: 50px auto;
        }
    }

    .home-background {
        position: relative;
        /*background-color: #fff;*/

        .header {
            position: absolute;
            top: 2px;
            left: @view-left;
            right: 0;
            height: @view-top;
            line-height: @view-top;
            min-width: 1250px;
        }

        .aside {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 19;
        }

        .comrou {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 60px;
            width: @view-left;
            z-index: 17;
        }

        .container {
            position: absolute;
            top: 0;
            right: 0;
            left: 260px;
            bottom: 0;
            overflow: auto;
            min-width: 1000px;
        }
    }
</style>
