<template>
    <el-aside width="60px" class="el-containerOne">  <!-- 第一个板块-->
        <div class="fiex" @click="open">
            <img src="../../../../static/headPortrait.jpg"/>
        </div>
        <!--点击头像打开登陆组件-->
        <el-dialog :visible.sync="openthelanding" center width="600px" z-index="18" @close="closeDialog('ruleLogin')">
            <!--展开注册组件，在登陆组件内-->
            <el-dialog :visible.sync="opencorelanding" center width="620px" append-to-body
                       @close="closeDialog('ruleForm')">
                <div class="opencorelanding-left">
                    <img src="../../../../static/logo.png"/>
                </div>
                <!--注册-->
                <div class="opencorelanding-right">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                        <!-- 邮箱 -->
                        <el-form-item prop="email" class="input-but">
                            <el-row>
                                <el-col :span="13">
                                    <el-input v-model="ruleForm.email" :placeholder="$t('Login.lists.mailbox')"
                                              class="opencorelanding-right-set inputEmail" clearable></el-input>
                                </el-col>
                                <el-col :span="10" :offset="1">
                                    <el-button type="primary" :disabled="!check" v-show="isCodeGo" @click="send"
                                               class="inp-but_code">
                                        <!--获取验证码 -->
                                        <span>{{$t('Login.GetVerificationCode')}}</span>
                                    </el-button>
                                    <!-- <span v-show="isCodeGo===false">{{sixtySecond}}秒可重新发送</span> -->
                                    <el-button type="primary" :disabled="hiddenCode" v-show="isCodeGo===false"
                                               style="margin-left:-4px;width:154px;text-align:center;">
                                        <span style="margin-left:-11px;">{{sixtySecond}}  {{$t('Login.lists.SecondsToResend')}}</span>
                                    </el-button>
                                </el-col>
                            </el-row>

                        </el-form-item>

                        <!--邮箱验证码-->
                        <el-form-item prop="authCode" class="input-but">
                            <el-input v-model="ruleForm.authCode" :placeholder="$t('Login.lists.EmailVerificationCode')"
                                      class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 密码 -->
                        <el-form-item prop="pass" class="input-but">
                            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"
                                      :placeholder="$t('Login.lists.Password')" class="opencorelanding-right-set"
                                      clearable></el-input>
                        </el-form-item>
                        <!-- 再次确认密码 -->
                        <el-form-item prop="checkPass" class="input-but">
                            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"
                                      :placeholder="$t('Login.lists.confirmPassword')" class="opencorelanding-right-set"
                                      clearable></el-input>
                        </el-form-item>
                        <!-- 姓名 -->
                        <el-form-item prop="name" class="input-but">
                            <el-input v-model="ruleForm.name" :placeholder="$t('Login.lists.Name')"
                                      class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 手机号 -->
                        <el-form-item prop="tel" class="input-but">
                            <el-input v-model="ruleForm.tel" :placeholder="$t('Login.lists.MobilePhone')"
                                      class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 所属公司 -->
                        <el-select v-model="companiesType" size="small" @change="switchChange(companiesType)"
                                   class="opencorelanding-right-set"
                                   :placeholder="$store.state.info_language?'Affiliated company':'所属公司'"
                                   style="width:310px">
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
                        <el-form-item v-if='see' prop="departmentTypeData" class="input-but"
                                      :rules="[
                              { required: true, message:$t('Login.lists.DepartmentCannotBeEmpty'), trigger: 'change'}
                            ]"
                                      key="departmentTypeData"
                        >
                            <el-select v-model="ruleForm.departmentTypeData" size="small"
                                       class="opencorelanding-right-set" :placeholder="$t('Login.lists.Department')"
                                       clearable style="width:310px">
                                <el-option v-for="item in department"
                                           :key="item.value"
                                           :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--其他公司的部门 message: '部门不能为空'-->
                        <el-form-item prop="otherDepartment" v-else
                                      :rules="[
                              { required: true, message:$t('Login.lists.DepartmentCannotBeEmpty'), trigger: 'blur'}
                            ]"
                                      key="otherDepartment"
                        >
                            <el-input v-model="ruleForm.otherDepartment"
                                      :placeholder="$store.state.info_language?'department':'部门'"
                                      class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!-- 所属职位 -->
                        <el-form-item v-if='see' prop="psitionTypeData" class="input-but"
                                      :rules="[
                              { required: true, message:$t('Login.lists.PositionCannotBeEmpty'), trigger: 'change'}
                            ]"
                                      key="psitionTypeData"
                        >
                            <el-select v-model="ruleForm.psitionTypeData" size="small" class="opencorelanding-right-set"
                                       :placeholder="$store.state.info_language?'Subordinate position':'所属职位'"
                                       clearable style="width:310px">
                                <el-option
                                        v-for="item in psition"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--其他公司的职位-->
                        <el-form-item prop="otherPosition" v-if="switcher"
                                      :rules="[
                              { required: true, message:$t('Login.lists.PositionCannotBeEmpty'), trigger: 'blur'}
                            ]"
                                      key="otherPosition"
                        >
                            <el-input v-model="ruleForm.otherPosition"
                                      :placeholder="$store.state.info_language?'position':'职位'"
                                      class="opencorelanding-right-set" clearable></el-input>
                        </el-form-item>
                        <!--设置插槽不显示底注册和取消按钮，暂时先不设置-->
                        <!--<div slot="footer" class="dialog-footer">-->
                        <el-checkbox v-model="checked" class="check"></el-checkbox>
                        <span @click="dialog" class="user">{{$t('Login.UserInstructions')}}</span>
                        <div class="dialog-footer">
                            <el-button @click="opencorelanding = false" class="inp-but">
                                {{$t('Login.lists.button[0]')}}
                            </el-button>
                            <!--<el-button type="primary" @click="opencorelanding = false" class="inp-but">{{$t('Login.lists.button[1]')}}-->
                            <el-button type="primary" @click="submitForm('ruleForm')" :disabled="!checked"
                                       class="inp-but">
                                {{$t('Login.lists.button[1]')}}
                            </el-button>
                        </div>

                    </el-form>
                </div>

            </el-dialog>
            <div slot="title" class="header-title">
                <b>IPS Configurator</b>
            </div>
            <div class="header-left">
                <img src="../../../../static/logo.png"/>
            </div>

            <!--注册须知-->
            <el-dialog width="600px" center title="用户须知" :visible.sync="innerVisible" append-to-body>
                <p v-html="innerVisibleData">{{innerVisibleData}}</p>
            </el-dialog>

            <!--登录-->
            <div class="header-right">
                <el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleLogin">
                    <!-- 用户名 -->
                    <el-form-item prop="email">
                        <el-input v-model="ruleFormLogin.email"
                                  :placeholder="$store.state.info_language?'User name':'用户名'"
                                  class="inp-hea opencorelanding-right-set inputEmail" clearable></el-input>
                    </el-form-item>
                    <!--密码-->
                    <el-form-item prop="pass" class="loginpassword">
                        <el-input type="password" v-model="ruleFormLogin.pass" autocomplete="off"
                                  :placeholder="$store.state.info_language?'Password':'密码'"
                                  class="inp-hea opencorelanding-right-set" clearable></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="opencorelanding = true" class="inp-but">{{$t('Login.register')}}</el-button>
                    <!-- 登录按钮 -->
                    <el-button type="primary" class="inp-but" :disabled="forbidden" @click="loginForm('ruleLogin')">
                        {{$t('Login.Login')}}
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!--当登录成功时，显示此弹框-->
        <el-dialog class="success_login" :close-on-click-modal="false" :visible.sync="loginSuccessOpen"
                   :modal-append-to-body="false" center width="600px" z-index="18">
            <div slot="title" class="header-title" ref="ruleLogin">
                <b>IPS Configurator</b>
            </div>
            <div class="header-left_success">
                <img src="../../../../static/logo.png"/>
            </div>
            <div class="header-right_success">
                <!--<el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleLogin">
                    &lt;!&ndash; 用户名 &ndash;&gt;
                    <el-form-item prop="email">
                        <el-input v-model="ruleFormLogin.email" :placeholder="$store.state.info_language?'User name':'用户名'"
                                  class="inp-hea opencorelanding-right-set inputEmail" clearable></el-input>
                    </el-form-item>
                </el-form>-->
                <div class="user_email">
                    <span>{{ruleFormLogin.email}}</span>
                </div>
                <div slot="footer" class="dialog-footer_success">
                    <!-- 退出登录按钮 -->
                    <el-button type="primary" class="inp-but_success" :disabled="forbidden"
                               @click="LogoutForm('ruleLogin')">
                        <!--退出登录-->
                        {{$t('Login.Logout')}}
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <div class="fiex scheme" @click="localSolutions('/Login')"> <!--点击进入本地方案 -->

            <!--<p>本地方案</p>-->
        </div>
        <!--<div class="fiex cloud">-->

        <!--<p>云方案</p>-->
        <!--</div>-->
        <!--<div class="fiex search">-->
        <!--<p>搜索</p>-->
        <!--</div>-->
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
                    <el-select v-model="languageType" size="small" style="width: 150px"
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
                    <p>{{$t('Setting.HintLanguage')}}</p>
                    <el-select v-model="HintLanguageType" size="small" style="width: 150px"
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
                    <!--增值税-->
                    <p>{{$t('Setting.addedValueTax')}}</p>
                    <el-input v-model="addedValue" size="small" style="width: 150px"
                              class="opentheSettings-set" @blur="taxVerify(addedValue)">
                    </el-input>
                    <span v-if="isShow" class="settings-warning">内容有误</span>
                </div>
                <div>
                    <!--服务税-->
                    <p>{{$t('Setting.ServiceTax')}}</p>
                    <el-input v-model="service" size="small" style="width: 150px"
                              class="opentheSettings-set" @blur="serverVerify(service)">
                    </el-input>
                    <span v-if="serverShow" class="settings-warning">内容有误</span>
                </div>
                <div>
                    <p>{{$t('Setting.DisplayDiscontinuedComponent')}}</p>
                    <el-select v-model="conmoType" size="small" style="width: 150px" class="opentheSettings-set">
                        <el-option
                                v-for="item in conmo"
                                :key="item.value"
                                :label="$store.state.info_language?item.labelY:item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="opentheSettings = false" class="inp-but">{{$t('Setting.buttons.cancel')}}</el-button>
                <el-button type="primary" @click="confirm()" class="inp-but"
                           :disabled='addedValueData?addedValueData:serviceData'>{{$t('Setting.buttons.confirm')}}
                </el-button>
            </div>
        </el-dialog>
    </el-aside>
</template>
<script>
    import $db from '../../utils/db.js';
    import md5 from 'md5'
    import $ from 'jquery';
    import moment from 'moment';
    // import {_back_public} from '../utils/axios.js';
    import axios from 'axios'
    // console.log(_back_public);
    export default {
        data() {
            // 邮箱
            const validateNameZh = (rule, value, callback) => {
                if (value.trim() === '') {
                    // return callback(new Error('请输入邮箱'))
                    this.check = false;
                    return callback(new Error(this.$t('Login.lists.PleaseEnterEmail')))

                } else if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
                    this.check = false;
                    // return callback(new Error('请输入合法邮箱'))
                    return callback(new Error(this.$t('Login.lists.PleaseEnterALegalEmail')))
                } else {
                    this.check = true;
                    callback()
                }
            }
            // 邮箱验证码
            const authcode = (rule, value, callback) => {
                if (value.trim() === '') {
                    // return callback(new Error('请输入邮箱验证码'))
                    return callback(new Error(this.$t('Login.lists.VerificationCode')))
                } else if (!/^\d{6}$/.test(value)) {
                    // return callback(new Error('请输入6位邮箱验证码'))
                    return callback(new Error(this.$t('Login.lists.DigitEmailVerificationCode')))
                } else {
                    callback()
                }
            }

            // 密码验证--规则：6-32位字母和数字组合
            const validatePass = (rule, value, callback) => {
                if (value.trim() === '') {
                    // return callback(new Error('请输入密码'))
                    return callback(new Error(this.$t('Login.lists.PleaseInputAPassword')))
                } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,32}$/.test(value)) {
                    // return callback(new Error('密码为字母数字结合，6-32位密码'))
                    return callback(new Error(this.$t('Login.lists.BitPassword')))
                } else {
                    callback()
                }
            }

            // 再次输入密码验证--规则：6-16位字母和数字组合
            const validatePass2 = (rule, value, callback) => {
                if (value.trim() === '') {
                    // return callback(new Error('请再次输入密码'))
                    return callback(new Error(this.$t('Login.lists.ThePasswordAgain')))
                } else if (value !== this.ruleForm.pass) {
                    // return callback(new Error('两次输入密码不一致!'))
                    return callback(new Error(this.$t('Login.lists.TheTwoPasswordsAreInconsistent')))
                } else {
                    callback()
                }
            }
            // 姓名验证--规则：只支持中文和英文
            const verifyName = (rule, value, callback) => {
                if (value.trim() === '') {
                    // return callback(new Error('请输入姓名'))
                    return callback(new Error(this.$t('Login.lists.PleaseEnterAName')))
                } else if (!/^[\u0391-\uFFE5A-Za-z]+$/.test(value)) {
                    // return callback(new Error('只支持中文和英文'))
                    return callback(new Error(this.$t('Login.lists.OnlyChineseAndEnglishAreSupported')))
                } else {
                    callback()
                }
            }
            // 手机号验证
            const verifyTel = (rule, value, callback) => {
                if (value.trim() === '') {
                    // return callback(new Error('请输入手机号'))
                    return callback(new Error(this.$t('Login.lists.YourMobileNumber')))
                } else if (!/^1[3456789]\d{9}$/.test(value)) {
                    // return callback(new Error('请输入正确的手机号'))
                    return callback(new Error(this.$t('Login.lists.TheCorrectMobileNumber')))
                } else {
                    callback()
                }
            }
            // 登录--用户名（邮箱）
            const loginEmail = (rule, value, callback) => {
                if (value.trim() === '') {
                    this.forbidden = true;
                    // return callback(new Error('请输入邮箱'))
                    return callback(new Error(this.$t('Login.lists.PleaseEnterEmail')))
                } else if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value)) {
                    this.forbidden = true;
                    // return callback(new Error('请输入合法邮箱'))
                    return callback(new Error(this.$t('Login.lists.PleaseEnterALegalEmail')))
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
                    // return callback(new Error('请输入密码'))
                    return callback(new Error(this.$t('Login.lists.PleaseInputAPassword')))
                } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,32}$/.test(value)) {
                    this.forbidden = true;
                    // return callback(new Error('请输入6-32位的密码'))
                    return callback(new Error(this.$t('Login.lists.BitPassword')))
                } else {
                    callback()
                    this.forbidden = false;
                    console.log("密码对了")
                }
            }
            return {
                check: false,  // 邮箱校验成功时，才可以获取验证码
                requestURL: 'http://172.31.2.182:8009',
                innerVisibleData: '第二条 用户的权利与义务</br>' +
                    '1.用户需凭本系统电子密钥登录和使用本系统。中爆网视该电子密钥项下的一切活动均为该用户行为。用户如遇本系统的电子密钥遗失或被盗，应将相关信息如实、及时通知中爆网。通知中爆网前发生的风险和损失由用户承担。</br>' +
                    '2.用户可以使用湖北省危险化学品管理信息系统对系统账户内的信息进行修改。</br>' +
                    '3.用户保证本系统账号注册时所提供的资料真实无误，如因用户提供虚假信息而给自己造成损失由其自行承担。</br>' +
                    '4.在本需知期限内，中爆网授权给用户的本系统的电子密钥的使用权仅属于该用户，禁止用户转让或售卖该电子密钥的使用权。用户因违反此要求导致的任何损失由用户自行承担。</br>' +
                    '5.用户保证不得利用本系统从事违反国家相关法律法规的一切活动：包括但不限于（1） 使用服务或该客户端软件上载、传送或以其它方法散布任何非法的、诽谤的、骚扰性的、侮辱性的、欺诈的、淫秽的或含有病毒的、或其它违法的、不妥当的内容；（2） 上载、传送或散布侵犯其他方知识产权或其它所有权、合同或信托权利或义务的内容；（3） 阻止他人使用该软件；（4） 为任何欺诈或不当目的使用服务；（5）用户不得通过本系统软件从事误导或欺骗他人的活动；（6）不得发布、传播违反国家法律、扰乱国家社会稳定的内容；（7）不得发布、传播侵犯他人知识产权、商业秘密等合法权利的内容；（8）用户不得进行危害计算机网络安全的行为。若一经发现，中爆网有权不经通知用户情况下，予以删除上述非法内容。</br>' +
                    '6.用户承诺对湖北省危险化学品管理信息系统仅用于危险化学品登记、管理、购买等使用，不用于其他目的或用途。除非得到中爆网的书面授权，任何用户不得对本系统复制、翻译、修改、反汇编、出售、转租等形式进行破坏。如用户将系统用于其他目的，一经中爆网发现，中爆网有权取消该用户的权限，并不予任何补偿。</br>' +
                    '7.用户不得破坏本系统的知识产权。</br>' +
                    '8.费用支付问题，中爆网会与注册企业另行签订《技术服务合同》。</br>' +
                    '9.用户理解并同意中爆网将尽努力保护用户计算机通讯的隐私性和完整性。</br>' +
                    '第三条 中爆网的权利和义务</br>' +
                    '1.经湖北省公安厅及中爆网确认后，中爆网负责为用户提供本系统的使用电子密钥，用户点击“接受”同意本需知全部条款后可获得进入本系统的资格和权限。</br>' +
                    '2.本系统不含有任何破坏用户计算机数据和获取用户隐私信息的恶意代码，不含有任何跟踪、监视用户计算机或操作行为的功能代码，不会监控用户网上、网下行为或泄露用户隐私。</br>' +
                    '3.中爆网负责本系统的建设、运行和管理，并有权制定或修改相关管理规则、考核条款等标准和文件，以作为本需知的附件。</br>' +
                    '4.若用户遇到本系统不稳定、系统缺陷等问题，应及时通知中爆网，中爆网有义务及时与用户沟通，通过协商途径解决。</br>' +
                    '5.中爆网将采取合理的措施保护用户的信息，保证不得向任何第三方公开、泄露，以下信息除外： （1）非由于中爆网的原因已经为公众所知的；（2）由于中爆网以外其他渠道被他人获知的信息，这些渠道并不受保密义务的限制；（3）由于法律的适用、法院或其他国家有权机关的要求而披露的信息；（4）用户在使用本软件时，同意将其自身的信息公开。</br>' +
                    '6.中爆网会建立安全体系，最大限度保护用户的利益，但中爆网也无法杜绝非安全的其他因素存在。用户在此了解并同意中爆网对此所作出的一切努力，并同意不向中爆网追究因此所造成的一切损失。</br>' +
                    '7.中爆网为了保障自身业务发展和调整的自主权，中爆网拥有自行修改或中断本系统使用授权的权利，如有必要，修改或中断会通知到用户。中爆网无须为此向任何第三方承担任何责任。</br>' +
                    '8.用户应规范、合法地使用本系统提供的服务，不得利用本系统进行违反国家法律的活动。如有发现，中爆网有义务配合公安部门全力协助调查工作。',
                innerVisible: false,  // 注册须知 文字提示
                checked: false,    // 注册须知多选框
                sixtySecond: 60,
                isCodeGo: true, // 是否可重新发送验证码
                timer: null, // 定时器
                hiddenCode: false,
                code: 0,
                // 登录
                forbidden: false,

                ruleFormLogin: {
                    email: "",  // 登录用户名（邮箱）
                    pass: "",   // 登录密码
                    mdPass: "", // 加密的登录密码
                },
                // mdloginPass:"",     // 加密的密码
                rulesLogin: {
                    // 登录验证用户名(邮箱)
                    email: [
                        {required: true, validator: loginEmail, trigger: 'blur'},
                    ],
                    // 输入密码(数字加字母)
                    pass: [
                        {required: true, validator: loginPass, trigger: 'blur'}
                    ]
                },
                see: true,          // 切换所属职位及所属职位的开关
                switcher: false,    // 其他公司的部门及职位开关
                language: [{ // 设置里面的中英文切换
                    value: 0,
                    label: '中文',
                }, {
                    value: 1,
                    label: 'English',
                }],
                languageType: 0, // 系统语言的默认中文
                HintLanguageType: 0, // 提示语言的默认中文
                currency: [{// 设置里面货币类型
                    value: 0,
                    label: '人民币 - ￥',
                }, {
                    value: 1,
                    label: 'U.S. dollar - $',
                }],
                currencyType: 0, // 默认人民币
                conmo: [{// 设置里面货币类型
                    value: 0,
                    label: '是',
                    labelY: 'Yes'
                }, {
                    value: 1,
                    label: '否',
                    labelY: 'No'
                }], // 是否显示停产组件
                conmoType: 0, // 是否显示停产组件 默认值为是
                addedValue: '14%',
                service: '14%',
                loginSuccessOpen: false,//登录成功的组件是否展开
                openthelanding: false, // 判断登陆组件是否展开
                opencorelanding: false, // 判断注册组件师傅展开
                opentheSettings: false, // 判断设置组件是否展开
                frontBackplateId: '',

                //增值税 服务税校验
                isShow: false, //增值税的后面的警告的隐藏
                serverShow: false,

                addedValueData: false,//增值税输入错误时禁用
                serviceData: false,  //服务税输入错误时禁用
                // 注册
                ruleForm: {
                    email: '',    // 邮箱
                    authCode: "",  // 邮箱验证码
                    pass: '',     // 输入密码
                    checkPass: '', // 再次输入密码
                    regPwd: "",      // 注册密码md5加密
                    name: "",      // 姓名
                    tel: "",        // 手机号
                    // 部门下拉
                    departmentTypeData: 1,
                    // 职位下拉
                    psitionTypeData: 2,
                    otherDepartment: "",    // 其他公司的部门
                    otherPosition: ""    // 其他公司的职务
                },
                // 注册验证
                rules: {
                    // 验证邮箱
                    email: [
                        {required: true, validator: validateNameZh, trigger: 'blur'},
                    ],
                    // 验证邮箱验证码
                    authCode: [
                        {required: true, validator: authcode, trigger: 'blur'},
                    ],
                    // 输入密码
                    pass: [
                        {required: true, validator: validatePass, trigger: 'blur'}
                    ],
                    // 再次输入密码
                    checkPass: [
                        {required: true, validator: validatePass2, trigger: 'blur'}
                    ],
                    // 验证姓名
                    name: [
                        {required: true, validator: verifyName, trigger: 'blur'}
                    ],
                    // 验证电话
                    tel: [
                        {required: true, validator: verifyTel, trigger: 'blur'}
                    ],
                    // 其他公司的部门
                    otherDepartment: [
                        {required: false, message: this.$t('error.department'), trigger: 'blur'},
                        //'请输入所属部门'
                        {min: 2, max: 10, message: this.$t('error.charactersLength'), trigger: 'blur'}
                        //'长度在2到10个字符'
                    ],
                    // 其他公司的职位
                    otherPosition: [
                        {required: false, message: this.$t('error.department'), trigger: 'blur'},
                        //'请输入所属职位'
                        {min: 2, max: 10, message: this.$t('error.charactersLength'), trigger: 'blur'}
                        //'长度在2到10个字符'
                    ]
                },
                companiesType: '0',  // 选择的公司
                companies: [{       // 注册里面的所属公司
                    value: "",
                    label: "",
                    type: ""         // 根据type值得不同来判断是否显示下方的两个下拉菜单，为0时显示
                }],
                typeid: 0,
                departmentType: '',  // 选择的部门
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
            //  判断如果已登录
            open() {
                // 判断 localStorage user 用户信息
                if (localStorage.getItem('user')) {
                    let user = JSON.parse(localStorage.getItem('user'));
                    /* 判断 email  有值的情况下 展示 已登录 弹框*/
                    if (user.email != '') {
                        this.loginSuccessOpen = true;
                        console.log(user.email)
                        this.ruleFormLogin.email = user.email;
                        this.openthelanding = false;
                    } else {
                        /*如果没有值  展示 登录弹框*/
                        this.openthelanding = true;
                        this.ruleFormLogin.email = '';
                    }
                } else {
                    /*如果没有值  展示 登录弹框*/
                    this.openthelanding = true;
                    this.ruleFormLogin.email = ''
                }
            },
            //点击退出登录，将token和用户名清除
            LogoutForm() {
                localStorage.removeItem('user');
                localStorage.setItem('userId', 1);
                this.$store.commit('updateLanguage', ['userId', 1])
                console.log(this.$store.state.userId)
                this.loginSuccessOpen = false;
            },

            // 点击打开 用户须知
            dialog() {
                this.innerVisible = true;
            },

            // 点击 打开登录弹框
            openLanding() {
                let user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    console.log(user)
                    if (user.token == '') {

                        this.$message({
                            message: this.$t('error.loginAgain'),
                            //'登录超时,请重新登录'
                            type: 'warning'
                        });

                        this.openthelanding = true;
                    }
                }
            },

            //增值税校验
            taxVerify(num) {
                if (num >= 0 && num <= 100) {
                    this.addedValue = Number(num).toFixed(2) + '%'
                    this.addedValueData = false; //警用关闭，确定按钮不被禁用
                    this.isShow = false;  //隐藏
                } else {
                    if (num.indexOf('%') != -1) {
                        let addValue = Number(num.replace("%", "")).toFixed(2) + '%'
                        this.addedValue = addValue
                        this.addedValueData = false; //警用关闭，确定按钮不被禁用
                        this.isShow = false;  //隐藏
                    } else {
                        if (num > 100) {
                            this.isShow = true;   //显示
                            this.addedValueData = true;//警用开启，确定按钮被禁用
                            this.addedValue = 0
                        } else {
                            this.isShow = true;   //显示
                            this.addedValueData = true;//警用开启，确定按钮被禁用
                            this.addedValue = 0
                        }
                    }
                }


                // let taxServerformat=/^\d{1,2}(\.\d{1,2})?%$/
                // let taxServerformat=/^\d{1,2}(\.\d{1,2})?%$/
                // this.addedValueData=this.addedValue.match(taxServerformat)
                // if(this.addedValueData===null){
                //     this.addedValue = 0
                //     this.addedValueData=true;//警用开启，确定按钮被禁用
                //     this.isShow=true;   //显示
                // }else{
                //     this.addedValueData=false; //警用关闭，确定按钮不被禁用
                //     this.isShow=false;  //隐藏
                // }
            },

            //服务税校验
            serverVerify(num) {
                if (num >= 0 && num <= 100) {
                    this.service = Number(num).toFixed(2) + '%'
                    this.serviceData = false; //警用关闭，确定按钮不被禁用
                    this.serverShow = false;  //隐藏
                } else {
                    if (num.indexOf('%') != -1) {
                        let addValue = Number(num.replace("%", "")).toFixed(2) + '%'
                        this.service = addValue
                        this.serviceData = false; //警用关闭，确定按钮不被禁用
                        this.serverShow = false;  //隐藏
                    } else {
                        if (num > 100) {
                            this.serverShow = true;   //显示
                            this.serviceData = true;//警用开启，确定按钮被禁用
                            this.service = 0
                        } else {
                            this.serverShow = true;   //显示
                            this.serviceData = true;//警用开启，确定按钮被禁用
                            this.service = 0
                        }
                    }
                }
                //校验服务税输入框中只能输入数字和百分号
                // let taxServerformat=/^\d{1,2}(\.\d{1,2})?%$/
                // this.serviceData=this.service.match(taxServerformat);
                // if(this.serviceData===null){
                //     this.serviceData=true;//警用开启，确定按钮被禁用
                //     this.serverShow=true;//显示警告
                //
                // }else{
                //     this.serviceData=false;//警用关闭，确定按钮不被禁用
                //     this.serverShow=false;  //隐藏警告
                // }
            },

            //点击确定,把数据存到sql数据库中
            confirm() {
                this.opentheSettings = false;
                let language = this.languageType;   //系统语言
                let currencyType = this.currencyType; //货币种类
                let taX = this.addedValue.replace("%", "");  //增值税
                let serviceTax = this.service.replace("%", ""); //服务税
                let showWithdraw = this.conmoType;  //显示停产组件
                let texts = parseFloat(taX).toFixed(2);    //增值税
                let service = parseFloat(serviceTax).toFixed(2); //服务税
                console.log(language, currencyType, taX, serviceTax, showWithdraw, this.frontBackplateId, this.HintLanguageType)
                if (this.frontBackplateId) {
                    //存到sql数据库去掉%,数据库只接受数字
                    console.log(texts, service)
                    const SQL = `UPDATE sys_setting SET language='${language}',info_language='${this.HintLanguageType}',currency_type='${currencyType}',
                    TAX='${texts}',service_tax='${service}',show_withdraw='${showWithdraw}',
                    update_date=datetime('now','localtime') WHERE ID='${this.frontBackplateId}'`;
                    console.log(SQL)
                    this.$db.all(SQL, (err, res) => {
                        if (err) {
                            console.log("修改失败")
                        } else {
                            console.log("修改成功")
                            this.getLanguageID();
                        }
                    })

                } else {
                    //插入数据
                    const SQL = `INSERT INTO sys_setting (language,HintLanguageType,currency_type,TAX,service_tax,show_withdraw)
                VALUES('${language}','${this.HintLanguageType}','${currencyType}','${texts}','${service}','${showWithdraw}')`;
                    this.$db.run(SQL, (err, res) => {
                        if (err) {

                        } else {
                            if (res) {
                                console.log("添加失败")
                            } else {
                                this.getLanguageID();
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
            getData() {
                this.addedValueData = false;//增值税不禁用
                this.serviceData = false;  //服务税不禁用
                this.isShow = false;    //增值税的输入框后面警告不显示
                this.serverShow = false;  //服务税输入框后面的警告不显示
                const SQL = `select * from sys_setting`;
                this.$db.get(SQL, (err, res) => {
                    if (err) {

                    } else {
                        if (res) {
                            // console.log(item)item.language
                            this.languageType = res.language;  //系统语言
                            console.log(res.language);
                            this.currencyType = res.currency_type;  //货币种类
                            let addedValueAdd = (res.tax).toFixed(2) + '%'; //增值税
                            this.addedValue = addedValueAdd; //
                            // console.log(addedValueAdd)    //
                            let serviceAdd = (res.service_tax).toFixed(2) + '%';  //服务税
                            this.service = serviceAdd;
                            console.log(res)
                            this.HintLanguageType = res.info_language//提示语言
                            this.conmoType = res.show_withdraw;   //显示停产组件
                            this.frontBackplateId = res.id;
                        }
                    }
                })
            },

            localSolutions(index) {
                this.$router.push(index)
            },

            // changeLanguage(LangageID){ // 更改国际化ID
            //    console.log(LangageID)
            //   let sql = `update sys_setting set language='${LangageID}'`;
            //     this.$db.run(sql, (err, res) => {
            //         // console.log(res)
            //         if (err) {
            //             this.$logger(err);
            //             this.$Notice.error({
            //                 title: '搜索失败',
            //                 desc: err,
            //             });
            //         } else {
            //             // console.log(LanguageID);
            //             this.getLanguageID();
            //         }
            //     });
            // },

            getLanguageID() { // 语言判断更改
                let sql = `select * from sys_setting`;
                this.$db.get(sql, (err, res) => {
                    console.log(res)
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '搜索失败',
                            desc: err,
                        });
                    } else {
                        if (res) {
                            /*vuex里面的this.$store.state.language为本地中英文切换0为中文1为英文*/
                            this.$store.commit('updateLanguage', ['language', res.language])
                            /*vuex里面的this.$store.state.info_language为库里获取的中英文切换0为中文1为英文*/
                            this.$store.commit('updateLanguage', ['info_language', res.info_language])
                            //用来控制本地的数据是否展示过期组件，0为是，1为否
                            this.$store.commit('updateLanguage', ['showWithdraw', res.show_withdraw])
                            //增值税，
                            this.$store.commit('updateLanguage', ['tax', res.tax])
                            //货币种类0是人民币，1为美元
                            this.$store.commit('updateLanguage', ['currency_type', res.currency_type])
                            this.$store.state.data.forEach((item, index) => {
                                this.$store.commit('setdatadiscount', [index, res.tax])
                            })
                            if (this.$store.state.language == 0) {
                                this.$i18n.locale = "CH";
                            } else if (this.$store.state.language == 1) {
                                this.$i18n.locale = "EN";
                            }
                        }
                    }
                });
            },

            // 获取所属公司列表
            getList() {
                let sql = `SELECT id,company_name,company_type FROM us_company_info`;
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '查询失败',
                        });
                    } else {
                        this.companies = []
                        console.log(res)
                        res.forEach(item => {
                            let obj = {
                                value: item.id,
                                lable: item.company_name,
                                type: item.company_type,
                            }
                            this.companies.push(obj);
                            console.log(this.companies)
                            console.log(typeof item.id)
                        })

                        // console.log(res[0].company_type,this.companies);
                    }
                })
            },

            // 发送邮箱地址，接受验证码
            send() {

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
                // console.log(_back_public)
                let params = {'email': this.ruleForm.email}
                /*           console.log(params);
                           console.log(this.ruleForm.email);*/
                //
                // if(this.forbidden){
                //     return false
                // }

                this.$axios.post(this.requestURL + '/client/verificationCode', params,
                    {'Content-Type': 'application/json'})
                    .then((res) => {

                        /*status  为 1时  是 200 */
                        if (res.data.status == 1) {

                            this.code = res.data.data;
                            console.log(this.code)
                            this.$message({
                                message: this.$store.state.language ? res.data.msgEn : res.data.msg,
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: this.$store.state.language ? res.data.msgEn : res.data.msg,
                                type: 'warning'
                            });
                            /*用户注册过之后，重置等待时间*/
                            if (res.data.status == 5001) {
                                this.sixtySecond = 1;
                            }
                        }

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
            getSection() {
                let sql = `select * from us_dept_info`;
                this.$db.all(sql, (err, res) => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: '查询失败',
                        });
                    } else {
                        // console.log(res);
                        this.department = []
                        res.forEach(item => {
                            let obj = {
                                value: item.dept_name,
                                id: item.id,
                                type: item.company_id,
                            }
                            this.department.push(obj);
                            console.log(this.department)
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
                        this.psition = []
                        res.forEach(item => {
                            let obj = {
                                value: item.position_name,
                                id: item.id,
                                type: item.company_type,
                            }
                            this.psition.push(obj);
                            console.log(this.psition)
                        })
                    }
                })
            },

            // 当所属公司为浪潮时，显示所属部门和所属职位的下拉菜单；否则显示文本输入框，每次改变切换的时候清空手动输入的文本框
            switchChange(index) {
                console.log(this.companiesType, index);
                if (this.companiesType == 0) {
                    this.switcher = false;
                    this.see = true;
                    this.ruleForm.otherDepartment = "",
                        this.ruleForm.otherPosition = ""
                    console.log(this.see, index);
                    console.log(this.switcher, index);
                } else {
                    this.switcher = true;
                    this.see = false;
                    this.ruleForm.otherDepartment = "",
                        this.ruleForm.otherPosition = ""
                }
            },

            // 注册提交数据
            submitForm(formName) {
                // console.log(this.departmentTypeData,this.psitionTypeData,this.companiesType,this.departmentType,this.psitionType, this.ruleForm);

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 利用MD5对注册的密码进行加密并一起提交数据
                        // let md5 = require("md5");
                        // let passMd5 = this.ruleForm.checkPass;
                        // this.ruleForm.regPwd = md5(passMd5);
                        // console.log("对密码进行加密处理");
                        // console.log(this.ruleForm.regPwd);
                        // 提交数据分两种情况：
                        // 1.当用户所选公司为浪潮时
                        if (this.companiesType == 0) {

                            /*查询 选中的 所属职位*/
                            let positionNum = '';
                            console.log(this.ruleForm.psitionTypeData)
                            this.psition.forEach(item => {
                                if (item.id == this.ruleForm.psitionTypeData) {
                                    positionNum = item.value;
                                }
                            })

                            /*查询 选中的 所属部门*/
                            let department = '';
                            console.log(this.ruleForm.departmentTypeData)
                            this.department.forEach(item => {
                                console.log(item)
                                if (item.id == this.ruleForm.departmentTypeData) {
                                    department = item.value;
                                }
                            })

                            /*查询 选中的公司*/
                            let companies = 0;
                            this.companies.forEach(item => {
                                if (this.companiesType == item.type) {
                                    companies = item.value;
                                }
                            })

                            let params = {
                                "username": this.ruleForm.name,
                                "password": this.ruleForm.checkPass,
                                "position": positionNum,
                                "positionId": this.ruleForm.psitionTypeData,
                                "phone": this.ruleForm.tel,
                                "companyId": companies,
                                "email": this.ruleForm.email,
                                "dept": department,
                                "deptId": this.ruleForm.departmentTypeData,
                                "uuid": this.code,
                                "code": this.ruleForm.authCode
                            }

                            this.$axios.post(this.requestURL + '/client/register', params,
                                {'Content-Type': 'application/json'})
                                .then((res) => {
                                    if (res.data.status == 1) {
                                        this.$message({
                                            message: this.$store.state.language ? res.data.msgEn : res.data.msg,
                                            type: 'success'
                                        });

                                        console.log(res)

                                        /*每次登录时  更新用户的token 和 时间*/
                                        const Other = `insert into us_user_info
(username,position,position_id,phone,company_id,email,status,dept,dept_id)
select '${params.username}','${params.position}','${params.positionId}','${params.phone}','${params.companyId}','${params.email}',0,'${params.dept}','${params.deptId}'`
                                        console.log(Other)
                                        this.$db.run(Other, (err, ress) => {
                                            if (err) {
                                                console.log('操作失败')
                                            } else {
                                                console.log('操作成功')

                                                /*注册成功后 关闭弹框*/
                                                this.opencorelanding = false
                                            }
                                        })

                                    } else {
                                        this.$message({
                                            message: this.$store.state.language ? res.data.msgEn : res.data.msg,
                                            type: 'warning'
                                        });
                                    }
                                }).catch((error) => {
                                console.log(error);
                            })

                        } else {

                            /*查询 选中的公司*/
                            let companies = 0;
                            this.companies.forEach(item => {

                                if (this.companiesType == item.type) {
                                    companies = item.value;
                                }
                            })
                            let params = {
                                "username": this.ruleForm.name,
                                "password": this.ruleForm.checkPass,
                                "position": this.ruleForm.otherPosition,
                                "phone": this.ruleForm.tel,
                                "companyId": companies,
                                "email": this.ruleForm.email,
                                "dept": this.ruleForm.otherDepartment,
                                "uuid": this.code,
                                "code": this.ruleForm.authCode
                            }

                            this.$axios.post(this.requestURL + '/client/register', params,
                                {'Content-Type': 'application/json'})
                                .then((res) => {
                                    if (res.data.status == 1) {
                                        this.$message({
                                            message: this.$store.state.language ? res.data.msgEn : res.data.msg,
                                            type: 'success'
                                        });

                                        /*每次登录时  更新用户的token 和 时间*/
                                        const Other = `insert into us_user_info
(username,position,phone,company_id,email,status,dept)
select' ${params.username}','${params.position}','${params.phone}','${params.companyId}','${params.email}',0,'${params.dept}'`
                                        console.log(Other)
                                        this.$db.run(Other, (err, ress) => {
                                            if (err) {
                                                console.log('操作失败')
                                            } else {
                                                console.log('操作成功')

                                                /*注册成功后 关闭弹框*/
                                                this.opencorelanding = false
                                            }
                                        })

                                    } else {
                                        this.$message({
                                            message: this.$store.state.language ? res.data.msgEn : res.data.msg,
                                            type: 'error'
                                        });
                                    }
                                }).catch((error) => {
                                console.log(error);
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
                        let params = {
                            "email": this.ruleFormLogin.email,
                            "password": this.ruleFormLogin.pass,
                        }

                        this.$axios.post(this.requestURL + '/client/login', params,
                            {'Content-Type': 'application/json'})
                            .then((res) => {
                                /* 当 status返回1  证明登录成功*/
                                if (res.data.status == 1) {
                                    this.$message({
                                        message: this.$store.state.language ? res.data.msgEn : res.data.msg,
                                        type: 'success'
                                    });

                                    let time = new Date()
                                    time = moment(time).format('YYYY-MM-DD HH:mm:ss');
                                    let userId = res.data.data.roleInfo.lookPrice;

                                    /*将 权限存储到 vuex里*/
                                    this.$store.commit('updateLanguage', ['userId', res.data.data.roleInfo.lookPrice])

                                    let user = {
                                        email: res.data.data.email,
                                        date: time,
                                        token: res.data.data.token,
                                    }

                                    localStorage.setItem('userId', userId);
                                    localStorage.setItem('user', JSON.stringify(user));

                                    /*每次登录时  更新用户的token 和 时间*/
                                    const Other = `update us_user_info set token='${res.data.data.token}',last_login_time='${time}'  where email='${res.data.data.email}'`

                                    console.log(Other)
                                    this.$db.run(Other, (err, ress) => {
                                        if (err) {
                                            console.log('操作失败')
                                        } else {
                                            console.log('操作成功')

                                            this.openthelanding = false;
                                        }
                                    })
                                } else {
                                    this.$message({
                                        message: this.$store.state.language ? res.data.msgEn : res.data.msg,
                                        type: 'error'
                                    });
                                }

                            }).catch((error) => {
                            console.log(error);
                        })
                    }
                });
            },

            // 关闭弹框时清空注册以及登录表单中的数据
            closeDialog(formRule) {
                console.log(formRule)
                // this.$refs[formRule].resetFields();
                this.$refs[formRule].resetFields();
                this.$refs[formRule].resetFields();
                this.checked = false;
                this.check = false,
                    this.companiesType = '0'; // 选择的公司
                this.ruleForm.departmentTypeData = 1;
                this.ruleForm.psitionTypeData = 2;
                this.see = true;
                this.switcher = false;
            },

            getPath() {
                console.log(this.$route.path);
                if (this.$route.path == '/Login') {
                    this.openLanding() // 初始化的方法
                }
            }
        },

        watch: {
            '$route': 'getPath'
        },
        // 监听路由，每次进入页面调用方法，放在method里
        mounted() {
            this.getPath();

        },
        created() {
            this.getList();     // 获取所属公司数据
            this.getSection();  // 获取所属部门数据
            this.getPosition(); // 获取所属职位数据


            /*
            * 项目启动时查看localStorage  是否有userId  没有证明没登录过  筛入默认值1
            * */
            let user = localStorage.userId;

            if (user == undefined || user == null) {

                localStorage.setItem('userId', 1)
                this.$store.commit('updateLanguage', ['userId', 1])
                console.log(this.$store.state.userId)
            }

            console.log(user, 'user');
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/less/global.less";

    element.style {
        margin-top: 15vh;
        width: 629px;
    }

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

            .opencorelanding-right-set {
                margin-bottom: 23px !important;
            }

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
            bottom: 40px;
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

            .settings-content {
                div {
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
            margin-bottom: 22px;
        }
    }

    .tax-pentheSettings {
        display: flex;
    }

    .settings-warning {
        color: red;
        font-size: 10px;
    }

    .el-form-item__error {
        color: #F56C6C;
        font-size: 12px;
        line-height: 1;
        padding-top: 13px;
        position: absolute;
        top: 36px;
        left: 0;
    }

    .el-form-item__content {
        height: 40px;

        .el-row {
            .el-col-13 {
                height: 100%;
            }

            .el-col-10 .inp-but_code {
                /*padding: 12px 8px;*/
            }

            height: 49px;
        }

        .opencorelanding-right-set {
            margin-bottom: 5px;
        }
    }

    .scheme {
        background-image: url("../../../../static/scheme.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .scheme:hover {
        background-image: url("../../../../static/scheme1.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .cloud {
        background-image: url("../../../../static/cloud.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .cloud:hover {
        background-image: url("../../../../static/cloud1.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .search {
        background-image: url("../../../../static/search.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .search:hover {
        background-image: url("../../../../static/search1.png");
        background-repeat: no-repeat;
        background-position: top;
    }

    .set-up {
        background-image: url("../../../../static/setUp.png");
        background-repeat: no-repeat;
        background-position: top;
        position: absolute;
        bottom: 50px;
        left: 5px;
    }

    .set-up:hover {
        background-image: url("../../../../static/setUp1.png");
        background-repeat: no-repeat;
        background-position: top;
        position: absolute;
        bottom: 50px;
        left: 5px;
    }

    .el-form-item {
        height: 45px;
    }

    .el-icon-close:before {
        color: #F56C6C;
    }

    /deep/ .el-form-item__content {
        height: 45px;
    }

    /deep/ .el-icon-close:before {
        color: #409EFF;
    }

    .check {
        margin-bottom: 20px;
    }

    .user {
        padding: 10px;
        cursor: pointer;
    }

    /*.el-button + .el-button[data-v-7a253da2] {
    margin-left: -4px;
    width: 129px;
    text-algin:center;
}*/
    .header-right_success {
        margin-left: 260px;
    }

    .header-left_success {
        float: left;
        height: 300px;
        margin-left: 20px;

        img {
            width: 200px;
            height: 130px;
        }
    }

    .user_email {
        width: 260px;
        height: 50px;
        padding: 10px;
        margin-bottom: 48px;
        text-align: center;

        span {
            font-size: 18px;
            text-align: center;
        }
    }

    .dialog-footer_success {
        text-align: center;

        .inp-but_success {
            height: 40px;
            text-align: center;
        }
    }
</style>
