<template>
    <el-aside width="60px" class="el-containerOne">  <!-- 第一个板块-->
        <div class="fiex" @click="openthelanding = true">
            <img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=601798613,2886563794&fm=26&gp=0.jpg"/>
        </div>
        <!--点击头像打开登陆组件-->
        <el-dialog :visible.sync="openthelanding" center width="600px" z-index="18" @close="closeDialog('ruleLogin')">
            <!--展开注册组件，在登陆组件内-->
            <el-dialog :visible.sync="opencorelanding" center width="600px" append-to-body  @close="closeDialog('ruleForm')">
                <div class="opencorelanding-left">
                    <img src="../assets/logo.png"/>
                </div>
                <!--注册-->
                <div class="opencorelanding-right">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                        <!-- 邮箱 -->
                        <el-form-item  prop="email" class = "input-but">
                            <el-row>
                              <el-col :span="13">
                                <el-input v-model="ruleForm.email" :placeholder="$t('Login.lists.mailbox')" class="opencorelanding-right-set inputEmail" clearable></el-input>
                              </el-col>
                              <el-col :span="10" :offset="1">
                                <el-button type="primary" v-show="isCodeGo" @click = "send" class="inp-but">发送验证码
                                </el-button>                                
                                <!-- <span v-show="this.isCodeGo===false">{{sixtySecond}}秒可重新发送</span> -->
                                <el-button type="primary" :disabled="hiddenCode" v-show="this.isCodeGo===false" style="margin-left:-4px;width:112px;text-align:center;"><span style="margin-left:-11px;">{{sixtySecond}}秒后可重发</span>
                                </el-button>
                              </el-col>
                            </el-row>
                            
                        </el-form-item>
                                           
                        <!--邮箱验证码-->
                        <el-form-item  prop="authCode" class = "input-but">
                            <el-input v-model="ruleForm.authCode" :placeholder="$t('Login.lists.EmailVerificationCode')" class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 密码 -->
                        <el-form-item  prop="pass" class = "input-but">
                            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" :placeholder="$t('Login.lists.Password')" class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 再次确认密码 -->
                        <el-form-item  prop="checkPass" class = "input-but">
                            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" :placeholder="$t('Login.lists.confirmPassword')" class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 姓名 -->
                        <el-form-item  prop="name" class = "input-but">
                            <el-input v-model="ruleForm.name" :placeholder="$t('Login.lists.Name')" clearable></el-input>
                        </el-form-item>
                        <!-- 手机号 -->
                        <el-form-item  prop="tel" class = "input-but">
                            <el-input v-model="ruleForm.tel" :placeholder="$t('Login.lists.MobilePhone')" class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 所属公司 -->
                        <el-select v-model="companiesType"  size="small" @change ="switchChange(companiesType)" class="opencorelanding-right-set" placeholder="所属公司"
                        style="width:310px" >
                            <el-option
                                    v-for="(item,index) in companies"
                                    :key="item.value"
                                    :label="item.lable"
                                    :value="item.type"
                            >
                            </el-option>
                        </el-select>
                        <br>
                        <!-- 所属部门 -->
                        <el-form-item v-if='see' prop="departmentTypeData" class = "input-but"
                            :rules="[
                              { required: true, message: '部门不能为空', trigger: 'change'}
                            ]"
                            key="departmentTypeData"
                        >
                            <el-select  v-model="ruleForm.departmentTypeData" size="small" class="opencorelanding-right-set" :placeholder="$t('Login.lists.Department')" clearable style="width:310px">
                                <el-option v-for="item in department"
                                           :key="item.value"
                                           :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--其他公司的部门-->
                        <el-form-item  prop="otherDepartment" v-else
                            :rules="[
                              { required: true, message: '部门不能为空', trigger: 'blur'}
                            ]"
                            key="otherDepartment"
                         >
                            <el-input v-model="ruleForm.otherDepartment" placeholder="部门" class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 所属职位 -->
                        <el-form-item v-if='see' prop="psitionTypeData" class = "input-but"
                            :rules="[
                              { required: true, message: '职位不能为空', trigger: 'change'}
                            ]"
                            key="psitionTypeData"
                        >
                            <el-select  v-model="ruleForm.psitionTypeData" size="small" class="opencorelanding-right-set" placeholder="所属职位" clearable style="width:310px">
                                <el-option
                                        v-for="item in psition"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>                         
                        <!--其他公司的职位-->
                        <el-form-item  prop="otherPosition" v-if = "switcher" 
                            :rules="[
                              { required: true, message: '职位不能为空', trigger: 'blur'}
                            ]"
                            key="otherPosition"
                        >
                            <el-input v-model="ruleForm.otherPosition" placeholder="职位" class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!--设置插槽不显示底注册和取消按钮，暂时先不设置-->
                        <!--<div slot="footer" class="dialog-footer">-->
                        <div class="dialog-footer">
                        <el-button @click="opencorelanding = false" class="inp-but">{{$t('Login.lists.button[0]')}}</el-button>
                <!--<el-button type="primary" @click="opencorelanding = false" class="inp-but">{{$t('Login.lists.button[1]')}}-->
                            <el-button type="primary" @click="submitForm('ruleForm')" class="inp-but">{{$t('Login.lists.button[1]')}}
                            </el-button>
                        </div>
                    </el-form>
                </div>

            </el-dialog>
            <div slot="title" class="header-title">
                <b>IPS Configurator</b>
            </div>
            <div class="header-left">
                <img src="../assets/logo.png"/>
            </div>
            <!--登录-->
            <div class="header-right">
                <el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleLogin">
                    <!-- 用户名 -->
                    <el-form-item  prop="email">
                        <el-input v-model="ruleFormLogin.email" placeholder="用户名" class="inp-hea opencorelanding-right-set inputEmail" clearable></el-input>
                    </el-form-item>
                    <!--密码-->
                    <el-form-item  prop="pass" class = "loginpassword">
                        <el-input type="password" v-model="ruleFormLogin.pass" autocomplete="off" placeholder="密码" class="inp-hea opencorelanding-right-set" clearable></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="opencorelanding = true" class="inp-but" >{{$t('Login.register')}}</el-button>
                    <!-- 登录按钮 -->
                    <el-button type="primary"  class="inp-but" :disabled="forbidden" @click="loginForm('ruleLogin')">{{$t('Login.Login')}}</el-button>
                </div>
            </div>

        </el-dialog>
        <div class="fiex scheme" @click="localSolutions('/Login')"> <!--点击进入本地方案 -->

            <!--<p>本地方案</p>-->
        </div>
        <div class="fiex cloud" >

            <!--<p>云方案</p>-->
        </div>
        <div class="fiex search" >
            <!--<p>搜索</p>-->
        </div>
        <div class="fiex set-up" @click="opentheSettings= true">
            <!--<p>设置</p>-->
        </div>

        <!--点击头像打开设置组件-->
        <el-dialog :visible.sync="opentheSettings" center width="600px" class="opentheSettings" z-index="18"
                   @open="getData()">
            <div slot="title" class="opentheSettings-title">
                {{$t('Setting.title')}}
            </div>
            <div class="settings-content">
                <div>
                    <p>{{$t('Setting.Language')}}</p>
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
                    <p>{{$t('Setting.Currency')}}</p>
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
                    <p>{{$t('Setting.addedValueTax')}}</p>
                    <el-input v-model="addedValue" size="small" style="width: 150px"
                              class="opentheSettings-set" @blur="taxVerify()" >
                    </el-input>
                    <span  v-if="isShow" class="settings-warning">内容有误</span>
                </div>
                <div>
                    <p>{{$t('Setting.ServiceTax')}}</p>
                    <el-input v-model="service" size="small" style="width: 150px"
                              class="opentheSettings-set" @blur="serverVerify()">
                    </el-input>
                    <span  v-if="serverShow" class="settings-warning">内容有误</span>
                </div>
                <div>
                    <p>{{$t('Setting.DisplayDiscontinuedComponent')}}</p>
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
                <el-button @click="opentheSettings = false" class="inp-but">{{$t('Setting.buttons.cancel')}}</el-button>
                <el-button type="primary" @click="confirm()" class="inp-but" :disabled='addedValueData?addedValueData:serviceData'>{{$t('Setting.buttons.confirm')}}</el-button>
            </div>
        </el-dialog>
    </el-aside>
</template>
<script>
    import $db from '../utils/db.js';
    import md5 from 'md5'
    import $ from 'jquery';    
    // import {_back_public} from '../utils/axios.js';
    import axios from 'axios'
    // console.log(_back_public);
    export default {
        data() {
             // 邮箱
            const validateNameZh = (rule, value, callback) => {
                if (value.trim() === '') {
                    return callback(new Error('请输入邮箱'))
                } else if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
                    return callback(new Error('请输入合法邮箱'))
                } else {
                    callback()
                }
            }
            // 邮箱验证码
            const authcode = (rule, value, callback) => {
                if (value.trim() === '') {
                    return callback(new Error('请输入邮箱验证码'))
                } else if (!/^\d{6}$/.test(value)) {
                    return callback(new Error('请输入6位邮箱验证码'))
                } else {
                    callback()
                }
            }

            // 密码验证--规则：6-32位字母和数字组合
            const validatePass = (rule, value, callback) => {
                if (value.trim() === '') {
                    return callback(new Error('请输入密码'))
                } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,32}$/.test(value)) {
                    return callback(new Error('请输入6-32位的密码'))
                } else {
                    callback()
                }
            }
            // 再次输入密码验证--规则：6-16位字母和数字组合
            const validatePass2 = (rule, value, callback) => {
                if (value.trim() === '') {
                    return callback(new Error('请再次输入密码'))
                } else if (value !== this.ruleForm.pass) {
                    return callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            // 姓名验证--规则：只支持中文和英文
            const verifyName = (rule, value, callback) => {
                if (value.trim() === '') {
                    return callback(new Error('请输入姓名'))
                } else if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
                    return callback(new Error('只支持中文和英文'))
                } else {
                    callback()
                }
            }
            // 手机号验证
            const verifyTel = (rule, value, callback) => {
                if (value.trim() === '') {
                    return callback(new Error('请输入手机号'))
                } else if (!/^1[3456789]\d{9}$/.test(value)) {
                    return callback(new Error('请输入正确的手机号'))
                } else {
                    callback()
                }
            }
            // 登录--用户名（邮箱）
            const loginEmail = (rule, value, callback) => {
                if (value.trim() === '') {
                    this.forbidden = true;
                    return callback(new Error('请输入邮箱'))
                } else if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
                    this.forbidden = true;
                    return callback(new Error('请输入合法邮箱'))
                } else {
                    callback()
                    this.forbidden = false;
                    console.log("用户名对了")
                }

            } 

            // 密码验证--规则：6-16位字母和数字组合
            const loginPass = (rule, value, callback) => {
                if (value.trim() === '') {
                    this.forbidden = true;
                    return callback(new Error('请输入密码'))
                } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,32}$/.test(value)) {
                     this.forbidden = true;
                    return callback(new Error('请输入6-32位的密码'))
                } else {
                    callback()
                    this.forbidden = false;
                    console.log("密码对了")
                }
            }
            return {
                sixtySecond: 60,
                isCodeGo: true, // 是否可重新发送验证码
                timer: null, // 定时器
                hiddenCode:false,
                // 登录
                 forbidden:false,  
                 
                ruleFormLogin:{
                    email:"",  // 登录用户名（邮箱）
                    pass:"",   // 登录密码
                    mdPass:"", // 加密的登录密码
                },
                // mdloginPass:"",     // 加密的密码
                rulesLogin:{
                    // 登录验证用户名(邮箱)
                    email: [
                        { required: true, validator: loginEmail, trigger: 'blur' },
                    ],
                    // 输入密码(数字加字母)
                    pass: [
                        { required: true, validator: loginPass, trigger: 'blur' }
                    ]
                },
                see:true,          // 切换所属职位及所属职位的开关
                switcher:false,    // 其他公司的部门及职位开关
                LanguageId: 1,
                language: [{ // 设置里面的中英文切换
                    value: 1,
                    label: '中文',
                },{
                    value: 2,
                    label: 'English',
                } ],
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
                addedValue: '14%',
                service: '14%',
                openthelanding: false, // 判断登陆组件是否展开
                opencorelanding: false, // 判断注册组件师傅展开
                opentheSettings: false, // 判断设置组件是否展开
                frontBackplateId:'',

                //增值税 服务税校验
                isShow:false, //增值税的后面的警告的隐藏
                serverShow:false,

                addedValueData:false,//增值税输入错误时禁用
                serviceData:false,  //服务税输入错误时禁用
                // 注册
                ruleForm: {
                    email: '',    // 邮箱
                    authCode:"",  // 邮箱验证码
                    pass: '',     // 输入密码
                    checkPass: '', // 再次输入密码
                    regPwd:"",      // 注册密码md5加密
                    name:"",      // 姓名
                    tel:"",        // 手机号
                    // 部门下拉
                    departmentTypeData:'',
                    // 职位下拉
                    psitionTypeData:'',
                    otherDepartment:"",    // 其他公司的部门
                    otherPosition:""    // 其他公司的职务
                },
                // 注册验证
                rules: {
                    // 验证邮箱
                    email: [
                        { required: true, validator: validateNameZh, trigger: 'blur' },
                    ],
                    // 验证邮箱验证码
                    authCode: [
                        { required: true, validator: authcode, trigger: 'blur' },
                    ],
                    // 输入密码
                    pass: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    // 再次输入密码
                    checkPass: [
                        { required: true, validator: validatePass2, trigger: 'blur' }
                    ],
                    // 验证姓名
                    name: [
                        { required: true,  validator: verifyName,trigger: 'blur' }
                    ],
                    // 验证电话
                    tel: [
                        { required: true,  validator: verifyTel,trigger: 'blur' }
                    ],
                    // 其他公司的部门
                    otherDepartment: [
                        { required: false, message: '请输入所属部门', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
                    ],
                    // 其他公司的职位
                    otherPosition: [
                        { required: false, message: '请输入所属职位', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
                    ]
                },
                companiesType: '',  // 选择的公司
                companies: [{       // 注册里面的所属公司
                    value: "",
                    label: "",
                    type:""         // 根据type值得不同来判断是否显示下方的两个下拉菜单，为0时显示
                }],
                typeid:0,
                departmentType:'',  // 选择的部门
                department: [{      // 注册里面的所属部门
                    value: "",
                    label: '',
                }],

                psitionType: '',    // 选择的职位
                psition: [{         // 注册里面的所属职位
                    value: "",
                    label: '',
                }],
            };
        },
        methods: {
           //增值税校验
            taxVerify(){
                let taxServerformat=/^\d{1,2}(\.\d{1,2})?%$/
                this.addedValueData=this.addedValue.match(taxServerformat)
                if(this.addedValueData===null){
                    this.addedValueData=true;//警用开启，确定按钮被禁用
                    this.isShow=true;   //显示
                }else{
                    this.addedValueData=false; //警用关闭，确定按钮不被禁用
                    this.isShow=false;  //隐藏
                }
           },
            //服务税校验
            serverVerify(){
                //校验服务税输入框中只能输入数字和百分号
                let taxServerformat=/^\d{1,2}(\.\d{1,2})?%$/
                this.serviceData=this.service.match(taxServerformat);
                if(this.serviceData===null){
                    this.serviceData=true;//警用开启，确定按钮被禁用
                    this.serverShow=true;//显示警告

                }else{
                    this.serviceData=false;//警用关闭，确定按钮不被禁用
                    this.serverShow=false;  //隐藏警告
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

                let texts = parseFloat(taX);    //增值税
                let service = parseFloat(serviceTax); //服务税
                if (this.frontBackplateId) {
                    //存到sql数据库去掉%,数据库只接受数字
                    console.log(texts,service)
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
                VALUES('${language}','${currencyType}','${texts}','${service}','${showWithdraw}')`;
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
                this.addedValueData=false;//增值税不禁用
                this.serviceData=false;  //服务税不禁用
                this.isShow=false;    //增值税的输入框后面警告不显示
                this.serverShow=false;  //服务税输入框后面的警告不显示
                const SQL = `select * from sys_setting`;
                this.$db.all(SQL, (err, res) => {
                    if (err) {

                    } else {
                        res.forEach((item)=>{
                            // console.log(item)item.language
                            //this.languageType = 2;  //系统语言
                            console.log(item.language);
                            this.currencyType = item.currency_type;  //货币种类
                            let addedValueAdd = (item.tax)+'%'; //增值税
                            this.addedValue = addedValueAdd; //
                                // console.log(addedValueAdd)    //
                            let serviceAdd = ( item.service_tax)+'%' ;  //服务税
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
            },
            // 获取所属公司列表
            getList () {
                let sql = `SELECT id,company_name,company_type FROM us_company_info`;
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '查询失败',
                        });
                    } else {
                        // console.log(res);
                        this.companies=[]
                        res.forEach(item=>{
                            let obj={
                                value:item.id,
                                lable:item.company_name,
                                type:item.company_type,
                            }
                            this.companies.push(obj);
                        })
                        // console.log(res[0].company_type,this.companies);
                    }
                })
            },

            // 发送邮箱地址，接受验证码
            send () {

                if (!this.timer) {                   
                   this.isCodeGo = false;
                   this.timer = setInterval(() => {
                        if (this.sixtySecond > 0 && this.sixtySecond <= 60) {
                            this.sixtySecond--;
                            this.hiddenCode = true;
                        } else {
                             this.isCodeGo = true;
                             clearInterval(this.timer);
                             this.timer = null;
                             this.sixtySecond = 60
                        }
                   }, 1000)
                }                
                console.log(this.$axios);
                // console.log(_back_public)
                let params = { 'email': this.ruleForm.email }
                console.log(params);
                console.log(this.ruleForm.email);
              this.$axios.post('http://10.165.11.31:8000/terminal/getVerificationCode', params)
                    .then((res) => {
                        console.log(res);
                    }).catch((error) => {
                        console.log(error);
                })
                
                // _back_public({
                //         method: "post",
                //         url: "http://10.165.11.31:8000/terminal/getVerificationCode",
                //         headers:{'Content-type': 'application/x-www-form-urlencoded'},
                //         data: {
                //             'email':this.ruleForm.email,
                //         }
                //     }).then((res) => {
                //         console.log(res.data);
                //     }).catch((error) =>{
                //         console.log(error)
                //     })

                    // console.log(this.$axios)
                    // let params = { 'email':this.ruleForm.emai }
                    // let postData = this.$qs.stringify(params);
                    // this.$axios.post('http://10.165.11.31:8000/terminal/getVerificationCode', params)
                    //     .then((res) => {
                    //         console.log(res);
                    //     }).catch((error) => {
                    //         console.log(error);
                    //     })

                // $.ajax({
                //     type: 'POST',
                //     url: 'http://10.165.11.31:8000/client/getVerificationCode',
                //     data: { 'email': this.ruleForm.email},
                //     success: function(result) {
                //         // debugger
                //       console.log(result)
                //     }
                // });
            },
            // 获取所属部门数据
            getSection () {
                let sql = `select * from us_dept_info`;
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '查询失败',
                        });
                    } else {
                        // console.log(res);
                        this.department=[]
                        res.forEach(item=>{
                            let obj={
                                value:item.dept_name,
                                id:item.id,
                                type:item.company_id,
                            }
                            this.department.push(obj);
                        })
                        // console.log(res[0].company_name,this.department);
                    }
                })
            },
            // 获取所属职位数据
            getPosition() {
                let sql = `select * from us_position_info`;
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '查询失败',
                        });
                    } else {
                        // console.log(res);
                        this.psition=[]
                        res.forEach(item=>{
                            let obj={
                                value:item.position_name,
                                id:item.id,
                                type:item.company_type,
                            }
                            this.psition.push(obj);
                        })
                    }
                })
            },
            // 当所属公司为浪潮时，显示所属部门和所属职位的下拉菜单；否则显示文本输入框，每次改变切换的时候清空手动输入的文本框
            switchChange (index) {
                // console.log(this.companiesType,index);
                if (this.companiesType === 0 ) {
                    this.switcher = false;
                    this.see = true;
                    this.ruleForm.otherDepartment="",
                    this.ruleForm.otherPosition=""
                } else {
                    this.switcher = true;
                    this.see = false;
                    this.ruleForm.otherDepartment="",
                    this.ruleForm.otherPosition=""
                }
            },
            // 注册提交数据
            submitForm (formName) {
                // console.log(this.departmentTypeData,this.psitionTypeData,this.companiesType,this.departmentType,this.psitionType, this.ruleForm);

                this.$refs[formName].validate((valid) =>{
                    if (valid) {
                        // 利用MD5对注册的密码进行加密并一起提交数据
                        let md5 = require("md5");
                        let passMd5 = this.ruleForm.checkPass;
                        this.ruleForm.regPwd = md5(passMd5);
                        // console.log("对密码进行加密处理");
                        // console.log(this.ruleForm.regPwd);
                        // 提交数据分两种情况：
                        // 1.当用户所选公司为浪潮时
                        if (this.companiesType  == 0) {
                            // console.log(this.companiesType)
                            // console.log(this.ruleForm.email);
                            // console.log(this.ruleForm.regPwd);
                            // console.log(this.ruleForm.name);
                            // console.log(this.ruleForm.tel);
                            // console.log(this.companiesType);
                            // console.log(this.departmentTypeData);
                            // console.log(this.psitionTypeData);
                            const updateSql = `insert into us_user_info(email,password,username,phone,company_id,dept_id,position_id)values ('${this.ruleForm.email}','${this.ruleForm.regPwd}','${this.ruleForm.name}','${this.ruleForm.tel}','${this.companiesType}','${this.ruleForm.departmentTypeData}','${this.ruleForm.psitionTypeData}') `
                            console.log(updateSql);
                            this.$db.run(updateSql, (err, res) => {
                                if (err) {
                                    this.$message.error('注册失败！');
                                } else {
                                   this.$message({
                                      message: '注册成功！',
                                      type: 'success'
                                    });
                                    this.opencorelanding = false;
                                    return false;
                                }
                            })
                        }else{
                            // 2.当用户所选公司为非浪潮时
                            // console.log(this.ruleForm.email);
                            // console.log(this.ruleForm.regPwd);
                            // console.log(this.ruleForm.name);
                            // console.log(this.ruleForm.tel);
                            // console.log(this.companiesType);
                            // console.log(this.ruleForm.otherDepartment);
                            // console.log(this.ruleForm.otherPosition);
                            const otherSql = `insert into us_user_info(email,password,username,phone,company_id,dept,position)values ('${this.ruleForm.email}','${this.ruleForm.regPwd}','${this.ruleForm.name}','${this.ruleForm.tel}','${this.companiesType}','${this.ruleForm.otherDepartment}','${this.ruleForm.otherPosition}') `
                            console.log(otherSql);
                            this.$db.run(otherSql, (err, res) => {
                                if (err) {
                                    this.$Message.warning({
                                        content: '注册失败!',
                                    });
                                } else {
                                    this.$message({
                                      message: '注册成功！',
                                      type: 'success'
                                    });
                                    this.opencorelanding = false;
                                }
                            })
                        }
                    }
                })
            },

            // 登录功能--密码加密功能
            loginForm(formName) {
                console.log("准备登录！")
                this.$refs[formName].validate((valid) => {
                    console.log('valid', valid)
                    if (valid) {
                        // console.log("准备登录了！！！")
                        const sql = `SELECT email,password FROM us_user_info where email = '${this.ruleFormLogin.email}'`;
                        // console.log(sql)
                        this.$db.get(sql, (err, res) => {
                            var md5 = require("md5");
                            let mdpwd = this.ruleFormLogin.pass;
                            this.ruleFormLogin.mdPass = md5(mdpwd);
                            // console.log(this.ruleFormLogin.email);
                            // console.log(this.ruleFormLogin.pass);
                            // console.log(this.ruleFormLogin.mdPass);
                            // console.log(res)
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: '查询失败',
                                });
                            } else {
                                if (res){
                                    if (this.ruleFormLogin.mdPass == res.password){

                                        this.$message({
                                              message: '登录成功！',
                                              type: 'success'
                                            });
                                        this.forbieen = true;
                                        // 登录成功后把用户ID传到数据库，返回用户身份和权限信息
                                        const powerSql = `select role.*,user.* from us_role_info role
       left join us_users_roles user_role on role.id=user_role.role_id
       left join us_user_info user        on user.id=user_role.user_id
       where user.id=1`
                                        this.$db.get(powerSql, (err, res) => {
                                            if (err) {

                                            } else {
                                                // console.log(res.role_type);
                                              localStorage.setItem('userId',res.role_type)
                                            }
                                        });
                                        this.ruleFormLogin.email = '',
                                            this.ruleFormLogin.pass = '',
                                        this.openthelanding = false;
                                    }else{
                                        this.$message.error('密码错误！');
                                        this.ruleFormLogin.mdPass = '';
                                        this.ruleFormLogin.pass = ''
                                    }
                                }else{
                                    this.$message.error('用户名不存在！');
                                    this.ruleFormLogin.email = '';
                                    this.ruleFormLogin.pass = '';
                                }
                            }
                        })
                    }
                });
            },
            // 关闭弹框时清空注册以及登录表单中的数据
            closeDialog(formRule){
                // this.$refs[formRule].resetFields();
                this.$refs['ruleLogin'].resetFields();
                this.$refs['ruleForm'].resetFields();
                
            },
        },
        mounted() {
            this.getList();     // 获取所属公司数据
            this.getSection();  // 获取所属部门数据
            this.getPosition(); // 获取所属职位数据
        }
    };
</script>
<style lang="less" scoped>
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
                margin-left: 37px;
                display: inline-block;
                width: 37%;
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
        width: 310px;

        .opencorelanding-right-set {
            margin-bottom: 15px;
        }

    }
    .tax-pentheSettings{
        display: flex;
    }
    .settings-warning{
        color:red;
        font-size: 10px;
     }
    .el-form-item__error {
          color: #F56C6C;
          font-size: 12px;
          line-height: 1;
          padding-top: 13px;
          position: absolute;
          top: 100%;
          left: 0;
      }
    .el-form-item__content {
        height:40px;
    }

    .scheme{
        background-image:url("../assets/scheme.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .scheme:hover{
        background-image:url("../assets/scheme1.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .cloud{
        background-image:url("../assets/cloud.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .cloud:hover{
        background-image:url("../assets/cloud1.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .search{
        background-image:url("../assets/search.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .search:hover{
        background-image:url("../assets/search1.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .set-up{
        background-image:url("../assets/setUp.png");
        background-repeat: no-repeat;
        background-position: top;
        position: absolute;
        bottom: 50px;
        left: 5px;
    }

    .set-up:hover{
        background-image:url("../assets/setUp1.png");
        background-repeat: no-repeat;
        background-position: top;
        position: absolute;
        bottom: 50px;
        left: 5px;
    }
    .el-form-item{
    height: 45px;
    }
    .el-icon-close:before {
        color: #F56C6C;
    }
    /deep/.el-form-item__content{
        height: 45px;
    }
    /deep/.el-icon-close:before {
        color: #409EFF;
    }
    /*.el-button + .el-button[data-v-7a253da2] {
    margin-left: -4px;
    width: 129px;
    text-algin:center;
}*/
</style>
