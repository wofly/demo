<template>
    <el-aside width="60px" class="el-containerOne">  <!-- 第一个板块-->
        <div class="fiex" @click="openthelanding = true">
            <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=601798613,2886563794&fm=26&gp=0.jpg"/>
        </div>
        <!--点击头像打开登陆组件-->
        <el-dialog :visible.sync="openthelanding" center width="600px" z-index="18">
            <!--展开注册组件，在登陆组件内-->
            <el-dialog :visible.sync="opencorelanding" center width="500px" append-to-body>
                <div class="opencorelanding-left">
                    <img src="../assets/logo.png"/>
                </div>
                <div class="opencorelanding-right">
                    <el-input v-model="eml" placeholder="邮箱" size="small"
                              class="opencorelanding-right-set"></el-input>
                    <el-input v-model="emlQ" placeholder="邮箱验证码" size="small"
                              class="opencorelanding-right-set"></el-input>
                    <el-input v-model="password" placeholder="密码" size="small" class="opencorelanding-right-set"
                              show-password></el-input>
                    <el-input v-model="passwordQ" placeholder="再次输入密码" size="small"
                              class="opencorelanding-right-set" show-password></el-input>
                    <el-input v-model="name" placeholder="姓名" size="small"
                              class="opencorelanding-right-set"></el-input>
                    <el-input v-model="phone" placeholder="手机号" size="small"
                              class="opencorelanding-right-set"></el-input>
                    <el-select v-model="companiesType" size="small"
                               class="opencorelanding-right-set" placeholder="所属公司">
                        <el-option
                                v-for="item in companies"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="departmentType" size="small"
                               class="opencorelanding-right-set" placeholder="所属部门">
                        placeholder="所属部门">
                        <el-option
                                v-for="item in department"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="psitionType" size="small"
                               class="opencorelanding-right-set" placeholder="所属z职位">
                        placeholder="职位">
                        <el-option
                                v-for="item in psition"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="opencorelanding = false" class="inp-but">取 消</el-button>
                        <el-button type="primary" @click="opencorelanding = false" class="inp-but">注 册
                        </el-button>
                    </div>
                </div>

            </el-dialog>
            <div slot="title" class="header-title">
                <b>IPS Configurator</b>
            </div>
            <div class="header-left">
                <img src="../assets/logo.png"/>
            </div>
            <div class="header-right">
                <input type="text" class="inp-hea" placeholder="   账号"/>
                <input type="password" class="inp-hea" placeholder="  密码"/>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="opencorelanding = true" class="inp-but">注 册</el-button>
                    <el-button type="primary" @click="openthelanding = false" class="inp-but"  >确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <div class="fiex" @click="localSolutions('/Login')"
             @mouseenter="image(1)" @mouseleave="images(1)"> <!--点击进入本地方案 -->
            <img v-show="scheme" src="../assets/scheme.png"/>
            <img v-show="!scheme" src="../assets/scheme1.png"/>

            <!--<p>本地方案</p>-->
        </div>
        <div class="fiex" @mouseenter="image(2)" @mouseleave="images(2)">
            <img v-show="cloud" src="../assets/cloud.png"/>
            <img v-show="!cloud"  src="../assets/cloud1.png"/>

            <!--<p>云方案</p>-->
        </div>
        <div class="fiex" @mouseenter="image(3)" @mouseleave="images(3)">
            <img v-show="search"  src="../assets/search.png"/>
            <img v-show="!search"  src="../assets/search1.png"/>
            <!--<p>搜索</p>-->
        </div>
        <div class="fiex set-up" @click="opentheSettings= true"
             @mouseenter="image(4)" @mouseleave="images(4)">
            <img  v-show="setUp"  src="../assets/setUp.png"/>
            <img  v-show="!setUp" src="../assets/setUp1.png"/>
            <!--<p>设置</p>-->
        </div>

        <!--点击头像打开设置组件-->
        <el-dialog :visible.sync="opentheSettings" center width="600px" class="opentheSettings" z-index="18"
                   @open="getData()">
            <div slot="title" class="opentheSettings-title">
                设置
            </div>
            <div class="settings-content">
                <div>
                    <p>系统语言 language</p>
                    <el-select v-model="languageType" size="small" style="width: 150px" @change="changeLanguage(languageType)"
                               class="opentheSettings-set">
                        <el-option
                                v-for="item in language"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <p>货币种类 currency Type</p>
                    <el-select v-model="currencyType" size="small" style="width: 150px"
                               class="opentheSettings-set">
                        <el-option
                                v-for="item in currency"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <p>增值税</p>
                    <el-input v-model="addedValue" size="small" style="width: 150px"
                              class="opentheSettings-set">
                    </el-input>
                </div>
                <div>
                    <p>服务税</p>
                    <el-input v-model="service" size="small" style="width: 150px"
                              class="opentheSettings-set">
                    </el-input>
                </div>
                <div>
                    <p>显示停产组件</p>
                    <el-select v-model="conmoType" size="small" style="width: 150px" class="opentheSettings-set">
                        <el-option
                                v-for="item in conmo"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="opentheSettings = false" class="inp-but">取 消</el-button>
                <el-button type="primary" @click="confirm()" class="inp-but">确 定</el-button>
            </div>
        </el-dialog>
    </el-aside>
</template>
<script>
    import $db from '../utils/db.js';
    export default {
        data() {
            return {
                LanguageId: 1,
                language: [{ // 设置里面的中英文切换
                    value: 1,
                    label: '中文',
                }, {
                    value: 2,
                    label: 'English',
                }],
                languageType: 1, // 默认中文
                currency: [{// 设置里面货币类型
                    value: 1,
                    label: '人民币 - ￥',
                }, {
                    value: 2,
                    label: 'U.S. dollar - $',
                }],
                currencyType: 1, // 默认人民币
                conmo: [{// 设置里面货币类型
                    value: 1,
                    label: '是',
                }, {
                    value: 2,
                    label: '否',
                }], // 是否显示停产组件
                conmoType: 1, // 是否显示停产组件 默认值为是
                companies: [{ // 注册里面的所属公司
                    value: 1,
                    label: '所属公司1',
                }, {
                    value: 2,
                    label: '所属公司2',
                }, {
                    value: 3,
                    label: '所属公司3',
                }],
                companiesType: '', // 选择的公司
                department: [{ // 注册里面的所属部门
                    value: 1,
                    label: '所属部门1',
                }, {
                    value: 2,
                    label: '所属部门2',
                }, {
                    value: 3,
                    label: '所属部门3',
                }],
                departmentType: '', // 选择的部门
                psition: [{ // 注册里面的所属职位
                    value: 1,
                    label: '职位1',
                }, {
                    value: 2,
                    label: '职位2',
                }, {
                    value: 3,
                    label: '职位3',
                }],
                psitionType: '', // 选择的职位
                addedValue: '',
                service: '',
                eml: '', // 注册时的邮箱
                emlQ: '', // 邮箱验证码
                password: '', // 输入密码
                passwordQ: '', // 确认密码
                name: '', // 姓名
                phone: '', // 手机号
                openthelanding: false, // 判断登陆组件是否展开
                opencorelanding: false, // 判断注册组件师傅展开
                opentheSettings: false, // 判断设置组件是否展开
                frontBackplateId:'',

                /*图片显示隐藏*/
                scheme:true,
                cloud:true,
                search:true,
                setUp:true,
            };
        },
        methods: {
            /*鼠标移入图片切换*/
            image(index){
                switch (index) {
                    case 1:
                        this.scheme = false;
                        break;
                    case 2:
                        this.cloud = false;
                        break;
                    case 3:
                        this.search = false;
                        break;
                    case 4:
                        this.setUp = false;
                        break;
                }
            },

            /*鼠标移出图片切换*/
            images(index){
                switch (index) {
                    case 1:
                        this.scheme = true;
                        break;
                    case 2:
                        this.cloud = true;
                        break;
                    case 3:
                        this.search = true;
                        break;
                    case 4:
                        this.setUp = true;
                        break;
                }
            },

            //点击确定,把数据存到sql数据库中
            confirm(){
                this.opentheSettings = false;
                let language = this.languageType;   //系统语言
                let currencyType = this.currencyType; //货币种类
                let taX =  this.addedValue;  //增值税
                let serviceTax = this.service; //服务税
                let showWithdraw = this.conmoType;  //显示停产组件
                // console.log(language,currencyType,taX,serviceTax,showWithdraw)

                if (this.frontBackplateId) {
                    //存到sql数据库去掉%,数据库只接受数字
                    let texts = parseFloat(taX);    //增值税
                    let service = parseFloat(serviceTax); //服务税

                    const SQL = `UPDATE sys_setting SET language='${language}',currency_type='${currencyType}',
                    TAX='${texts}',service_tax='${service}',show_withdraw='${showWithdraw}',
                    update_date=datetime('now','localtime') WHERE ID='${this.frontBackplateId}'`;
                    // console.log(SQL)
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            console.log("修改失败")
                        } else {
                            console.log("修改成功")
                        }
                    })

                } else {
                    //插入数据
                    const SQL = `INSERT INTO sys_setting (language,currency_type,TAX,service_tax,show_withdraw)
                VALUES('${language}','${currencyType}','${taX}','${serviceTax}','${showWithdraw}')`;
                    this.$db.run(SQL, (err, res) => {
                        if (err) {

                        } else {
                            if (res) {
                                console.log("添加失败")
                            } else {
                                console.log("添加成功");
                                let selectSql = `select * from sys_setting`
                                this.$db.get(selectSql, (err, res) => {
                                    if (err) {

                                    }
                                    this.frontBackplateId = res.id;
                                })
                            }
                        }
                    })


                }
            },

            // 获取数据
            getData(){
                const SQL = `select * from sys_setting`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        res.forEach((item)=>{
                            // console.log(item)
                            this.languageType = item.language;  //系统语言
                            this.currencyType = item.currency_type;  //货币种类
                            let addedValueAdd = (item.tax) + '%'; //增值税
                            this.addedValue = addedValueAdd; //
                                // console.log(addedValueAdd)    //
                            let serviceAdd = ( item.service_tax) + '%';  //服务税
                            this.service = serviceAdd;
                            // console.log(serviceAdd)
                            this.conmoType = item.show_withdraw;   //显示停产组件
                            this.frontBackplateId = item.id;
                        })
                    }
                })
            },

            localSolutions(index){
                this.$router.push(index)
            },
            
            changeLanguage(LangageID){ // 更改国际化ID
              // console.log(LangageID)
              let sql = `update sys_setting set language='${LangageID}'`;
                this.$db.run(sql, (err, res) => {
                    // console.log(res)
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        // console.log(LanguageID);
                        this.getLanguageID();
                    }
                });
            },
            getLanguageID(){ // 语言判断更改
                let sql = `select language from sys_setting where id =3`;
                this.$db.all(sql, (err, res) => {
                    // console.log(res)
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        for (let i = 0; i < res.length; i++){
                            this.LanguageId = res[i].language;
                        }
                        console.log(this.LanguageId);
                        if(this.LanguageId == 1){
                          this.$i18n.locale = "CH";
                        } else if(this.LanguageId == 2){
                          this.$i18n.locale = "EN";
                        }
                    }
                });
            }
        },
        mounted() {

        }
    };
</script>
<style lang="less">
    @import "../assets/less/global.less";

    .el-containerOne { /*第一个板块*/
        background: #282c31;
        color: #eee;
        overflow: hidden;
        .header-title {
            color: #333;
            font-size: 26px;
        }
        .header-left { /*登陆页面的样式*/
            float: left;
            height: 150px;
            margin-left: 20px;
            img {
                width: 200px;
                height: 130px;
            }
        }

        .header-right {
            margin-left: 260px;
        }

        .dialog-footer {
            .inp-but {
                width: 100px;
                height: 40px;
            }
        }

        .inp-hea {
            display: block;
            width: 200px;
            height: 25px;
            margin-bottom: 10px;
        }

        .fiex { /*几个固定按钮的样式*/
            height: 40px;
            width: 50px;
            margin: 15px auto;
            cursor: pointer;
            text-align: center;
            font-size: 12px;
            img {
                width: 30px;
                margin-top: 5px;
                margin-left: -3px;
            }

            i {
                font-size: 24px;
            }
        }
        .el-icon-setting {
            bottom:40px;
            position: fixed;
            left: 20px
        }

        .opentheSettings {
            .el-dialog--header { /*取消elementui弹框顶部的样式，必须是全局*/
                padding: 0;
            }

            .el-dialog--headerbtn {
                top: 10px;
                right: 10px;
            }

            .opentheSettings-title {
                font-size: 20px;
                border-bottom: 1px solid #ccc;
                color: #666;
                padding-bottom: 10px;
            }

            .opentheSettings-set {
                margin-left: 106px;
            }
            .settings-content{
                div{
                    line-height: 56px;
                }
            }
            p {
                margin-left: 70px;
                display: inline-block;
                width: 28%;
            }
        }
    }

    .opencorelanding-left { /*注册页面的样式*/
        width: 200px;
        float: left;
        margin-top: 150px;

        img {
            width: 200px;
        }
    }

    .opencorelanding-right {
        margin-left: 240px;
        width: 200px;

        .opencorelanding-right-set {
            margin-bottom: 15px;
        }

    }
    .set-up{
        position: absolute;
        bottom: 50px;
        left: 5px;
    }
</style>
