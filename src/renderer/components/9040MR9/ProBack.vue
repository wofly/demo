<template>
  <!--设置详情-->
  <div class="wrap">
    <div class="listtap">
      <!--<div>{{$t('Proback.machinetitle')}}{{this.$route.query.machineId}} - {{$t('Proback.inventory')}}</div>-->
      <div>{{this.$route.query.name}} - {{$t('Proback.inventory')}}</div>
      <button class="el-button el-button--primary el-button--small" @click="goBack">{{$t('Proback.back')}}</button>
    </div>

    <!-- 切换英文 所展示的价钱与数据-->
    <div v-show="$store.state.userId !=1">
      <!--硬件-->
      <div class="tsLists">
        <el-row :gutter="24">
          <el-col :span="3">
            <div class="grid-content">{{$t('Proback.hardware.title')}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content" v-if="$store.state.currency_type">{{$t('Proback.software.list.TotalPrice')}}：${{totalPrice1 | totalPriceFilters}}</div>
            <div class="grid-content" v-if="!$store.state.currency_type">{{$t('Proback.software.list.TotalPrice')}}：￥{{totalPrice1RMB | totalPriceFilters}}</div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.software.list.Discount')}}：
              <el-input v-model="input2" v-if="$store.state.currency_type"  @change="discountData1(totalPrice1,input2,input3,1,0)"  @keyup.native="changeNum(1,0)"></el-input>
              <el-input v-model="input2RMB"  v-if="!$store.state.currency_type"  @change="discountData1(totalPrice1RMB,input2RMB,input3RMB,1,1)"  @keyup.native="changeNum(1,1)"></el-input>
              %off
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple" v-if="$store.state.currency_type">{{$t('Proback.software.list.DiscountedPrice')}}：$
              <el-input v-model="input3"  @change="getDiscountPrice1(totalPrice1,input2,input3,1)" disabled></el-input>
            </div>
            <div class="grid-content bg-purple" v-if="!$store.state.currency_type">{{$t('Proback.software.list.DiscountedPrice')}}：￥
              <el-input v-model="input3RMB"  @change="getDiscountPrice1(totalPrice1RMB,input2RMB,input3RMB,1)" disabled></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--软件-->
      <div class="tsLists">
        <el-row :gutter="24">
          <el-col :span="3">
            <div class="grid-content">{{$t('Proback.software.title')}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content" v-if="$store.state.currency_type">{{$t('Proback.hardware.list.TotalPrice')}}：${{totalPrice | totalPriceFilters}}</div>
            <div class="grid-content" v-if="!$store.state.currency_type">{{$t('Proback.hardware.list.TotalPrice')}}：￥{{totalPriceRMB | totalPriceFilters}}</div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.hardware.list.Discount')}}：
              <el-input v-model="input" v-if="$store.state.currency_type" @change="discountData(totalPrice,input,input1,2,0)"  @keyup.native="changeNum(2,0)"></el-input>
              <el-input v-model="inputRMB" v-if="!$store.state.currency_type" @change="discountData(totalPriceRMB,inputRMB,input1RMB,2,1)"  @keyup.native="changeNum(2,1)"></el-input>
              %off
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple"  v-if="$store.state.currency_type" >{{$t('Proback.hardware.list.DiscountedPrice')}}：$
              <el-input v-model="input1" @change="getDiscountPrice(totalPrice,input,input1,2,0)" disabled></el-input>
            </div>
            <div class="grid-content bg-purple"  v-if="!$store.state.currency_type">{{$t('Proback.hardware.list.DiscountedPrice')}}：￥
              <el-input v-model="input1RMB" @change="getDiscountPrice(totalPriceRMB,inputRMB,input1RMB,2,1)" disabled></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--机器-->
      <div class="tsLists">
        <el-row :gutter="24">
          <el-col :span="3">
            <div class="grid-content">{{$t('Proback.machinename.title')}}</div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content"  v-if="$store.state.currency_type">{{$t('Proback.machinename.list.TotalPrice')}}：${{totalPrice2 | totalPriceFilters}}</div>
            <div class="grid-content"  v-if="!$store.state.currency_type">{{$t('Proback.machinename.list.TotalPrice')}}：￥{{totalPrice2RMB | totalPriceFilters}}</div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.machinename.list.Discount')}}：
              <el-input v-model="input4" v-if="$store.state.currency_type" @change="discountData2(input4)" disabled="disabled"></el-input>
              <el-input v-model="input4RMB" v-if="!$store.state.currency_type" @change="discountData2(input4RMB)" disabled="disabled"></el-input>
              %off
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content" v-if="$store.state.currency_type"> {{$t('Proback.machinename.list.DiscountedPrice')}}：${{input5 | totalPriceFilters}}</div>
            <div class="grid-content" v-if="!$store.state.currency_type"> {{$t('Proback.machinename.list.DiscountedPrice')}}：￥{{input5RMB  | totalPriceFilters}}</div>
          </el-col>
        </el-row>
      </div>
      <!--机器总价-->
      <div class="tsLists">
        <el-row :gutter="24">
          <el-col :span="3">
            <div class="grid-content"></div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content" v-if="$store.state.currency_type">{{$t('Proback.aggregate.TotalMachinePrice')}}:${{totalPrice3  | totalPriceFilters}}</div>
            <div class="grid-content" v-if="!$store.state.currency_type">{{$t('Proback.aggregate.TotalMachinePrice')}}:￥{{totalPrice3RMB  | totalPriceFilters}}</div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content bg-purple">{{$t('Proback.aggregate.quantity')}}：
              <el-input v-model="input6" v-if="$store.state.currency_type" @change="discountData3(input6)"   @keyup.native="changeNum(3,0)"></el-input>
              <el-input v-model="input6RMB" v-if="!$store.state.currency_type" @change="discountData3(input6RMB)"   @keyup.native="changeNum(3,1)"></el-input>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content" v-if="$store.state.currency_type"> {{$t('Proback.aggregate.discountedprice')}}：${{input7 | totalPriceFilters}}</div>
            <div class="grid-content" v-if="!$store.state.currency_type"> {{$t('Proback.aggregate.discountedprice')}}：￥{{input7RMB | totalPriceFilters}}</div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!--table表格-->
    <div class="affs">
      {{$t('CompleteTheConfiguration.lists.hardware.title')}}
    </div>
    <div class="addline">
      <el-table :data="showLists" style="width: 100%">
        <el-table-column align="center" type="index"
                         :label="$t('Software.details.list.serialNumber')" width="80">
        </el-table-column>
        <!--<el-table-column align="center" prop="component_id" label="PN" width="180">-->
        <!--</el-table-column>-->
        <el-table-column align="center" prop="template_name" label="FC" width="110">
        </el-table-column>
        <el-table-column align="center" prop="nameCN" :label="$t('Software.details.list.classify')" width="110" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" width="110" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="template_desc" :label="$t('Software.details.list.describingAccessories')" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="description_en" :label="$t('Software.details.list.describingAccessories')" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center"  prop="exeInfo_en" :label="$t('Software.details.list.exceptionPrompt')" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="exeInfo" :label="$t('Software.details.list.exceptionPrompt')" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="component_count" :label="$t('Software.details.list.Quantity')" width="80">
        </el-table-column>
        <el-table-column align="center"  :label="$t('Software.details.list.price')" width="180">
          　<template slot-scope="scope">
          <div v-if="!$store.state.currency_type">
            　　　<span v-show="$store.state.userId !=1">{{scope.row.total_price | totalPriceFilters}}</span>
            　　　<span v-show="$store.state.userId ==1">- -</span>
          </div>
          <div  v-if="$store.state.currency_type">
            　　　<span v-show="$store.state.userId !=1">{{scope.row.total_offshore | totalPriceFilters}}</span>
            　　　<span v-show="$store.state.userId ==1">- -</span>
          </div>
          　</template>
        </el-table-column>
      </el-table>
    </div>

    <div class="affs">
      {{$t('CompleteTheConfiguration.lists.software.title')}}
    </div>
    <div class="addline">
      <el-table :data="showListsData" style="width: 100%">
        <el-table-column align="center" type="index"
                         :label="$t('Software.details.list.serialNumber')" width="80">
        </el-table-column>
        <!--<el-table-column align="center" prop="component_id" label="PN" width="180">-->
        <!--</el-table-column>-->
        <el-table-column align="center" prop="template_name" label="FC" width="110">
        </el-table-column>
        <el-table-column align="center" prop="nameCN" :label="$t('Software.details.list.classify')" width="110" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" width="110" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="template_desc" :label="$t('Software.details.list.describingAccessories')" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="description_en" :label="$t('Software.details.list.describingAccessories')" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center"  prop="exeInfo_en" :label="$t('Software.details.list.exceptionPrompt')" v-if="$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="exeInfo" :label="$t('Software.details.list.exceptionPrompt')" v-if="!$store.state.info_language">
        </el-table-column>
        <el-table-column align="center" prop="component_count" :label="$t('Software.details.list.Quantity')" width="80">
        </el-table-column>
        <el-table-column align="center"  :label="$t('Software.details.list.price')" width="180">
          　<template slot-scope="scope">
          <div v-if="!$store.state.currency_type">
            　　　<span v-show="$store.state.userId !=1">{{scope.row.total_price | totalPriceFilters}}</span>
            　　　<span v-show="$store.state.userId ==1">- -</span>
          </div>
          <div  v-if="$store.state.currency_type">
            　　　<span v-show="$store.state.userId !=1">{{scope.row.total_offshore | totalPriceFilters}}</span>
            　　　<span v-show="$store.state.userId ==1">- -</span>
          </div>
          　</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  export default {
    name: 'PLlist',
    data() {
      return {
        //用户id
        userId:0,
        ogrDiscount1:0, // 记录软件上一次的折扣   美元
        ogrDiscount1RMB:0, // 记录软件上一次的折扣   人民币
        ogrDiscount:0, // 记录硬件上一次的折扣   美元
        ogrDiscountRMB:0, // 记录硬件上一次的折扣   人民币
        /*------------------- 美元---------------------*/
        // 硬件
        input: 10,
        input1: 0,
        totalPrice: '',

        // 软件
        input2: 10,
        input3: 0,
        totalPrice1: '',

        // 机器
        input4: 0,
        input5: '',
        totalPrice2: '',

        // 机器总价
        input6: 1,
        input7: '',
        totalPrice3: '',
        /*------------------- 人民币---------------------*/
        // 硬件
        inputRMB: 10,
        input1RMB: 0,
        totalPriceRMB: '',

        // 软件
        input2RMB: 10,
        input3RMB: 0,
        totalPrice1RMB: '',

        // 机器
        input4RMB: 0,
        input5RMB: '',
        totalPrice2RMB: '',
        inputVal:this.$store.state.currency_type,
        // 机器总价
        input6RMB: 1,
        input7RMB: '',
        totalPrice3RMB: '',

        // 选择列表
        options: [],
        showLists: [],
        showListsData: [],

        MACadd: 0,
        MACaddDis: 0,
        allNums: 0,
        allNum: 0,
        discount: 0.1,
        machine: 1,
        endNum: 0
      };
    },

    watch:{
      '$store.state.currency_type':function(newFlag, oldFlag){
        this.getDataListnum();
      }
    },
    filters:{
      // 列表总价过滤器：加￥符号、保留两位小数四舍五入、使用分位分隔符
      totalPriceFilters:function (value) {
        if (!isNaN(value)) {
          return  Number(value).toFixed(2).replace(/\d{1,3}(?=(\d{3})+\b)/g, '$&,')
        }else{
          return 'N/C'
        }
      }
    },

    methods: {

      /*限制input 输入 英文*/
      changeNum(flag,type) {

        // flag 区分 是 硬件 软件 机器
        // type 区分  是人民币  还是美元
        // 美元校验 不可输入英文
        if(flag == 1&& type == 0){
          this.input2 = this.input2.replace( /[^\.\d]/g, '');
          //this.input2 = this.input2.replace('.', '');
        }

        if(flag == 2&& type == 0 ){
          this.input = this.input.replace( /[^\.\d]/g, '');
          //this.input = this.input.replace('.', '');
        }

        if(flag == 3&& type == 0){
          this.input6 = this.input6.replace( /[^\.\d]/g, '');
          this.input6 = this.input6.replace('.', '');
        }

        // 人民币校验  不可输入英文
        if(flag == 1&& type == 1){
          this.input2RMB = this.input2RMB.replace( /[^\.\d]/g, '');
          //this.input2RMB = this.input2RMB.replace('.', '');
        }

        if(flag == 2&& type == 1 ){
          this.inputRMB = this.inputRMB.replace( /[^\.\d]/g, '');
          //this.inputRMB = this.inputRMB.replace('.', '');
        }

        if(flag == 3&& type == 1){
          this.input6RMB = this.input6RMB.replace( /[^\.\d]/g, '');
          this.input6RMB = this.input6RMB.replace('.', '');
        }
      },

      /*硬件 输入 折扣价 算出 折扣*/
      getDiscountPrice(total,discount,totalDiscount,num) {

        // num 区分 硬件1 软件2
        this.input = 100 - totalDiscount / this.totalPrice * 100;
        this.mediumHardDiskData(total,discount,totalDiscount,num);

      },

      /*软件 输入 折扣价 算出 折扣*/
      getDiscountPrice1(total,discount,totalDiscount,num) {
        this.input2 = 100 - totalDiscount / this.totalPrice1 * 100;
        this.mediumHardDiskData(total,discount,totalDiscount,num);
      },

      /*软件 输入 折扣 算出 折扣价*/
      discountData(total,discount,totalDiscount,num,type) {
        if (discount < 100 && discount >= 0) {

          /*              ogrDiscount1// 记录软件上一次的折扣   美元
                          ogrDiscount1RMB // 记录软件上一次的折扣   人民币
                          ogrDiscount // 记录硬件上一次的折扣   美元
                          ogrDiscountRMB // 记录硬件上一次的折扣   人民币     */
          // type  0是美元  1是人民币
          if(type == 0){
            this.input = Number(this.input).toFixed(2) // 折扣
            this.input1 = Number(this.totalPrice * ((100 - discount) / 100)).toFixed(2); // 折扣价
            this.mediumHardDiskData(total,discount,totalDiscount,num,type);
            let input1 = parseFloat(this.input1);  // tofixed  是字符串  需要转 number
            let input3 = parseFloat(this.input3);  // tofixed  是字符串  需要转 number
            /* 软件 +硬件 折扣价   赋值  机器折扣总价*/
            this.input5 =input1+input3;
            this.input7 =input1+input3;
            /* 机器 总折扣 */
            this.input4 = Number(100-(this.input5 / this.totalPrice2 *100)).toFixed(2);
            /*记录 上一次 折扣 */
            this.ogrDiscount1 = Number(discount).toFixed(2);
            console.log(this.ogrDiscount,'软件美元')
          }
          // type  0是美元  1是人民币
          if(type == 1){
            /*往库里计算时，0转100*/
            if(discount == 0){
              discount = 100
            }
            this.inputRMB = Number(this.inputRMB).toFixed(2) // 折扣
            this.input1RMB = Number(this.totalPriceRMB *(discount/ 100)).toFixed(2); // 折扣价
            this.mediumHardDiskData(total,discount,totalDiscount,num,type);
            let input1RMB = parseFloat(this.input1RMB); // tofixed  是字符串  需要转 number
            let input3RMB = parseFloat(this.input3RMB); // tofixed  是字符串  需要转 number
            /* 软件 +硬件 折扣价   赋值  机器折扣总价*/
            this.input5RMB = input1RMB+input3RMB;
            this.input7RMB = input1RMB+input3RMB;
            this.input4RMB = Number((this.input5RMB / this.totalPrice2RMB) * 100).toFixed(2);
            /*折扣可以输入 0 所以 需要 100 转 0  */
            if(this.input4RMB=='100.00'){
              this.input4RMB = '0.00'
            }
            if(discount == 100){
              discount = 0
            }
            /*记录 上一次 折扣 */
            this. ogrDiscount1RMB = Number(discount).toFixed(2);
            console.log(this.ogrDiscountRMB,'软件人民币')
          }

        } else {

          if(type == 0){
            this.input = this.ogrDiscount1;
            console.log(this.ogrDiscount1,'软件美元')
          }

          if(type == 1){
            this.inputRMB =  this.ogrDiscount1RMB;
            console.log(this.ogrDiscount1RMB,'软件人民币')
          }


          this.$message({
            message: '请输入正确折扣',
            type: 'warning',
          });
        }
      },

      /*硬件 输入 折扣 算出 折扣价*/
      discountData1(total,discount,totalDiscount,num,type) {
        if (discount < 100 && discount >=0) {

          /*              ogrDiscount1// 记录软件上一次的折扣   美元
                          ogrDiscount1RMB // 记录软件上一次的折扣   人民币
                          ogrDiscount // 记录硬件上一次的折扣   美元
                          ogrDiscountRMB // 记录硬件上一次的折扣   人民币     */
          // type  0是美元  1是人民币
          if(type == 0){
            this.input2 = Number(this.input2).toFixed(2)  // 折扣
            this.input3 = Number(this.totalPrice1 * ((100 - discount) / 100)).toFixed(2) ;  // 折扣价
            this.mediumHardDiskData(total,discount,totalDiscount,num,type);
            let input1 = parseFloat(this.input1); // tofixed  是字符串  需要转 number
            let input3 = parseFloat(this.input3); // tofixed  是字符串  需要转 number
            /* 软件 +硬件 折扣价   赋值  机器折扣总价*/
            this.input5 = input1+input3;
            this.input7 = input1+input3;
            /* 机器 总折扣 */
            this.input4 = Number(100-(this.input5 / this.totalPrice2 *100)).toFixed(2);
            /*记录 上一次 折扣 */
            this.ogrDiscount = Number(discount).toFixed(2);
            console.log(this.ogrDiscount,'硬件美元')
          }
          // type  0是美元  1是人民币
          if(type == 1){
            if(discount == 0){
              discount = 100
            }
            this.input2RMB = Number(this.input2RMB).toFixed(2) // 折扣
            this.input3RMB =Number(this.totalPrice1RMB *((discount)/ 100)).toFixed(2) ; // 折扣价
            this.mediumHardDiskData(total,discount,totalDiscount,num,type);
            let input1RMB = parseFloat(this.input1RMB);  // tofixed  是字符串  需要转 number
            let input3RMB = parseFloat(this.input3RMB);  // tofixed  是字符串  需要转 number
            /* 软件 +硬件 折扣价   赋值  机器折扣总价*/
            this.input5RMB = input1RMB+input3RMB;
            this.input7RMB = input1RMB+input3RMB;
            /* 机器 总折扣 */
            this.input4RMB = Number((this.input5RMB / this.totalPrice2RMB) * 100).toFixed(2);
            /*折扣可以输入 0 所以 需要 100 转 0  */
            if(this.input4RMB=='100.00'){
              this.input4RMB = '0.00'
            }

            if(discount == 0){
              discount = 100
            }
            /*记录 上一次 折扣 */
            this.ogrDiscountRMB = Number(discount).toFixed(2) ;
            console.log(this.ogrDiscountRMB,'硬件人民币')
          }

        } else {

          // type  0是美元  1是人民币
          /*赋值 上一次的折扣*/
          if(type == 0){
            this.input2 = this.ogrDiscount;
            console.log(this.ogrDiscount,'硬件美元')
          }
          /*赋值 上一次的折扣*/
          if(type == 1){
            this.input2RMB =  this.ogrDiscountRMB;
            console.log(this.ogrDiscountRMB,'硬件人民币')
          }

          this.$message({
            message: '请输入正确折扣价',
            type: 'warning',
          });

        }
      },

      /*插入 已输入的折扣数据*/
      mediumHardDiskData(total,discount,totalDiscount,num,type) {
        let discountDollar = 0; // 美元折扣价
        let discountRMB = 0;  // 人民币折扣价
        let discountPriceDollar = 0;  //美元折扣
        let discountPriceRMB = 0;   //人民币折扣
        // type  人民币为1   美元为0
        if(type == 0){

          /*折扣 保留后两位*/
          let dollar = Number(discount).toFixed(2);
          discountPriceDollar =  parseFloat(dollar);  //  美元折扣
          discountPriceRMB = 100 - parseFloat(dollar);  //  人民币折扣
          // num 为 1  是硬件  num为 2  是软件
          if(num ==1){
            discountDollar = parseFloat(this.input3); // 折扣价
            let num = Number(this.totalPrice1RMB * ((discountPriceRMB) / 100)).toFixed(2);
            discountRMB = parseFloat(num) // 折扣保留2位  转number

            console.log(discountDollar,discountRMB)
          }else{
            // 软件
            discountDollar =  parseFloat(this.input1) ; // 折扣价
            let num = Number(this.totalPriceRMB * ((discountPriceRMB) / 100)).toFixed(2);
            discountRMB = parseFloat(num); // 折扣保留2位  转number
            console.log(discountDollar,discountRMB)
          }
          /*当人民币 折扣为 100 时  存  0*/
          if(discountPriceRMB == 100){
            discountPriceRMB = 0
          }
        }

        // type  人民币为1   美元为0
        if(type == 1){
          let dollar = Number(discount).toFixed(2);
          discountPriceDollar =  100 - parseFloat(dollar); //  美元折扣
          discountPriceRMB = parseFloat(dollar);  //  人民币折扣
          // num 为 1  是硬件  num为 2  是软件
          if(num ==1){
            let num = Number(this.totalPrice1 * ((discountPriceRMB) / 100)).toFixed(2)
            discountDollar = parseFloat(num);  // 折扣保留2位  转number
            discountRMB = parseFloat(this.input3RMB) ; // 折扣价
          }else{

            let num = Number(this.totalPrice * ((discountPriceRMB) / 100)).toFixed(2)
            discountDollar =parseFloat(num) ; // 折扣保留2位  转number
            discountRMB = parseFloat( this.input1RMB) ;  // 折扣价
          }
          /*当人民币 折扣为 100 时  存  0*/
          if(discountPriceRMB == 100){
              discountPriceRMB = 0
          }
        }
        // 修改  硬件 软件 数据
        const updateSql = `UPDATE machine_price_detail set 'product_id'='${this.$route.query.productId}',solution_id='${this.$route.query.solutionId}',dollar_discount='${discountPriceDollar}',discount_dollar_price='${discountDollar}',discount='${discountPriceRMB}',discount_price='${discountRMB}' where machine_id = '${this.$route.query.machineId}' and configure_type='${num}'`
        console.log(updateSql)
        this.$db.run(updateSql, (err, res) => {
          if (res) {
            console.log("修改失败")
          } else {
            console.log("修改成功")
          }
        })
      },

      /*机器 输入 折扣价 算出 折扣*/
      getDiscountPrice2(num) {
        this.input4 = 100 - num / this.totalPrice2 * 100;
      },

      /*机器 输入 折扣 算出 折扣价*/
      discountData2(num) {
        if (num < 101 && num > 0) {
          this.input5 = this.totalPrice2 * (100 - num) / 100;
        } else {
          this.$message({
            message: '请输入正确折扣',
            type: 'warning',
          });
        }
      },

      /*机器总价格*/
      discountData3(num) {
        /*美元  计算  机器总价   折扣价*/
        this.totalPrice3 = this.totalPrice2 * num;
        this.input7 = this.input5 * num;
        /*人民币 计算  机器总价   折扣价*/
        this.totalPrice3RMB = this.totalPrice2RMB * num;
        this.input7RMB = this.input5RMB * num;
        this.addDiscountData(num);

      },
      /*往数据库里插入已选数据*/
      addDiscountData(num) {
        const updateSql = `update machine_info set count='${num}'  where id='${this.$route.query.machineId}'`
        this.$db.run(updateSql, (err, res) => {
          if (res) {
            console.log("修改失败")
          } else {
            console.log("修改成功")
          }
        })
      },

      calculationDay(date){
        if (date == null || date == undefined || date == '')
          return 0;
        //获取当前时间
        let now = moment();
        //计算相差多少天 day可以是second minute
        let days = date.diff(now, 'day');
        return days < 0 ? 0 : days;
      },

      // 数据获取
      getDataListnum()  {
        // 获取数据
        const SQL = `			select product.product_name,pp.remark_name,pp.count,pp.list_price
      from machine_info pp  join product_info product on product.id=pp.product_id where product.id=${this.$route.query.productId} and pp.id = ${this.$route.query.machineId} `;
        this.$db.get(SQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            console.log(res);
            this.machine = res.count;

            const SQLData = `SELECT list_price,configure_type,discount,discount_price,dollar_discount,list_dollar_price,discount_dollar_price FROM "machine_price_detail" where
      product_id='${this.$route.query.productId}' and solution_id='${this.$route.query.solutionId}' and machine_id='${this.$route.query.machineId}'`;
            this.$db.all(SQLData, (err, res) => {
              console.log(SQLData,res)
              if (err) {
                this.$logger(err);
                this.$Notice.error({
                  title: '搜索失败',
                  desc: err,
                });
              } else {
                console.log(res)
                res.forEach((item)=>{
                  // 获取硬件价格

                  if(item.configure_type == 1){
                    // 获取美元 折扣 折扣价 总价
                    this.totalPrice1 = item.list_dollar_price;  // 硬件 总价
                    this.input2 = Number(item.dollar_discount).toFixed(2);  // 当前折扣
                    this.ogrDiscount = Number(item.dollar_discount).toFixed(2); // 上一次的折扣
                    this.input3 = Number(item.discount_dollar_price).toFixed(2);  // 折扣价

                    // 获取 人民币 折扣  折扣价  总价
                    this.totalPrice1RMB = item.list_price; // 硬件 总价
                    this.input2RMB = Number(item.discount).toFixed(2); // 当前折扣
                    this.ogrDiscountRMB =  Number(item.discount).toFixed(2); // 上一次的折扣
                    this.input3RMB = Number(item.discount_price).toFixed(2);  // 折扣价
                    console.log(item.discount_price)
                  }
                  // 获取软件价格
                  if(item.configure_type == 2){
                    // 获取美元折扣 折扣价 总价
                    this.totalPrice = item.list_dollar_price; // 硬件 总价
                    this.input = Number(item.dollar_discount).toFixed(2); // 当前折扣
                    this.ogrDiscount1 = Number(item.dollar_discount).toFixed(2); // 上一次的折扣
                    this.input1 = Number(item.discount_dollar_price).toFixed(2);  // 折扣价

                    // 获取 人民币 折扣  折扣价  总价
                    this.totalPriceRMB = item.list_price; // 硬件 总价
                    this.inputRMB = Number(item.discount).toFixed(2); // 当前折扣
                    this.ogrDiscount1RMB = Number(item.discount).toFixed(2); // 上一次的折扣
                    this.input1RMB = Number(item.discount_price).toFixed(2); // 折扣价

                  }
                  console.log(item)
                })
                /*  美元 机器价格 = 硬价价格 + 软件价格*/
                this.totalPrice2 = this.totalPrice1 + this.totalPrice;
                this.totalPrice3 = this.totalPrice1 + this.totalPrice;
                /*  人民币 机器价格 = 硬价价格 + 软件价格*/
                this.totalPrice2RMB = this.totalPrice1RMB + this.totalPriceRMB;
                this.totalPrice3RMB = this.totalPrice1RMB + this.totalPriceRMB;

                /*美元  软件 + 硬件 =机器总折扣价*/
                let dollar = parseFloat(this.input1);
                let dollarNum = parseFloat(this.input3);
                this.input5 = dollar + dollarNum;
                this.input7 = dollar + dollarNum;

                /*人民币  软件 + 硬件 =机器总折扣价*/
                let rmb = parseFloat(this.input1RMB);
                let rmbNum = parseFloat(this.input3RMB);
                this.input5RMB = rmb + rmbNum;
                this.input7RMB = rmb + rmbNum;
                /*机器 总折扣 */
                this.input4 = Number(100-(this.input5 / this.totalPrice2 *100)).toFixed(2); // 美元
                this.input4RMB = Number((this.input5RMB / this.totalPrice2RMB) * 100).toFixed(2); // 人民币

                if(this.input4RMB=='100.00'){
                  this.input4RMB = '0.00'
                }

                /*折扣 数  转字符串*/
                this.input6 = this.machine+'';
                this.input6RMB = this.machine+'';

                /* 美元 总价 和折扣价*/
                this.totalPrice3 = (this.totalPrice2 * this.machine).toFixed(2);
                this.input7 = (this.input5 * this.machine).toFixed(2);
                /* 人民币 总价 和折扣价*/
                this.totalPrice3RMB = (this.totalPrice2RMB * this.machine).toFixed(2);
                this.input7RMB = (this.input5RMB * this.machine).toFixed(2);
              }
            });
          }
        });


        this.setnum();
      },

      goBack() {
        this.$router.push({ // 核心语句
          path: '/Projectpar', // 跳转的路径
          query: { // 路由传参时push和query搭配使用 ，作用时传递参数
            // id: 0,
          },
        });
      },

      setnum() { // 计算折扣方法
        /*
                if (this.machine <= 1) {
                  this.machine = 1;
                  console.log('>>>>>>>>>>', this.discount);
                  this.allNum = (this.allNums * this.machine).toFixed(2); // 计算无折扣
                  this.endNum = (this.discount / 100 * this.allNums * this.machine).toFixed(2); // 计算折扣
                } else {
                  this.allNum = (this.allNums * this.machine).toFixed(2);
                  this.endNum = (this.discount / 100 * this.allNums * this.machine).toFixed(2);
                }*/



        //this.setSQL();
        this.$store.commit('changeMachine', this.machine);
      },

      /* setSQL() { // 利用
         const SQL = `update machine_info  set count='${this.machine}',list_price='${this.allNum}'`;
         console.log(this.machine, this.allNum);
         this.$db.run(SQL, (err, res) => {
           if (err) {
             this.$logger(err);
             this.$Notice.error({
               title: '搜索失败',
               desc: err,
             });
           } else {
             // console.log(this.showdata, allNum);
           }
         });
       },*/

      getDataList() {
        console.log('每次都走这里么')
        // 获取列表全数据
        const rowSQL = `select info.component_PN,info.component_FC,detail.category_id,info.name,info.category_name,info.description,info.description_en,
                 detail.component_count,info.listprice_onshore,info.listprice_offshore,info.ui_status,info.withdraw_date
                 from product_programme_detail detail
                 left join solution           so     on  so.id=detail.solution_id
                 left join component_category cate  on  cate.id =detail.category_id
                 left join component_memory   mem   on  mem.id =detail.component_id and detail.category_id=2
                 left join component_iocard   io    on io.id   =detail.component_id and detail.category_id=6
                 left join component_disk     disk  on disk.id =detail.component_id and detail.category_id=1
                 left join component_cpu      cpu    on  cpu.id  =detail.component_id and detail.category_id=3
                 left join component_power    power  on  power.id=detail.component_id and detail.category_id=5
                 left join component_backplane back  on  back.id =detail.component_id and detail.category_id=7
                 left join component_powerline    line    on line.id=detail.component_id  and detail.category_id=8
                 left join component_cpu_activation ac    on ac.id=detail.component_id  and detail.category_id=11
                 left join component_other    other  on  other.id=detail.component_id and detail.category_id=other.category_id
                 left join component_barebone    bb  on  bb.id=detail.component_id and detail.category_id=16
                 left Join component_powerconversion con on con.id=detail.component_id and detail.category_id=22
                 left Join component_expansioncase exp_case on exp_case.id=detail.component_id and detail.category_id=23
                 left Join component_expansionflesh exp_flesh on exp_flesh.id=detail.component_id and detail.category_id=24
                 left Join component_connectingline exp_line on exp_line.id=detail.component_id and detail.category_id=25
                 left Join component_disk_expansioncase disk_exp_case on disk_exp_case.id=detail.component_id and detail.category_id=26
                 left Join component_disk_modeoption disk_mode on disk_mode.id=detail.component_id and detail.category_id=27
                 left join component_memoryrisercard memcard on memcard.category_id = detail.category_id and memcard.id=detail.component_id
                 left join component_base_info info  on  info.id=mem.base_info_id
                   or  info.id=io.base_info_id
                   or  info.id=disk.base_info_id
                   or  info.id=cpu.base_info_id
                   or  info.id=power.base_info_id
                   or  info.id=back.base_info_id
                   or  info.id=line.base_info_id
                   or  info.id=other.base_info_id
                   or  info.id=ac.base_info_id
				   or  info.id=bb.base_info_id
                     or info.id=exp_case.base_info_id
                     or info.id=exp_flesh.base_info_id
                     or info.id=exp_line.base_info_id
                     or info.id=disk_exp_case.base_info_id
                     or info.id=disk_mode.base_info_id
                     or info.id=con.base_info_id
                     or info.id=memcard.base_info_id
 where detail.template_id='${this.$route.query.templateId}' and detail.category_id in (1,2,3,5,6,7,8,11,16,17,23,24,25,26,27,22,37,12,41,39,28,38,30,31) and  detail.solution_id='${this.$route.query.solutionId}'and detail.product_id='${this.$route.query.productId}' and detail.machine_id='${this.$route.query.machineId}'`;

        //-----------------------------------软件----------------------------
        //获取软件数据（维保信息除外）
        const sqlSW =  `SELECT T1.software_category,T1.qty,cs.*,
                   (SELECT machine_model FROM product_info WHERE id = ${this.$route.query.productId}) AS type,
                   (SELECT machine_submodel FROM product_info WHERE id = ${this.$route.query.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${this.$route.query.solutionId} AND template_id = ${this.$route.query.templateId} AND machine_id = ${this.$route.query.machineId} AND product_id = ${this.$route.query.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${this.$route.query.solutionId} AND template_id = ${this.$route.query.templateId} AND machine_id = ${this.$route.query.machineId} AND product_id = ${this.$route.query.productId}) as logicNum
            FROM component_software cs
            INNER JOIN
            (SELECT
            ss.carry_software_id,ss.software_category,ss.qty FROM product_programme_detail ppd
            INNER JOIN software_software ss ON ppd.component_id = ss.choice_software_id
            WHERE ppd.category_id IN (21,14,15,42) AND ppd.solution_id = ${this.$route.query.solutionId}
            AND ppd.template_id = ${this.$route.query.templateId} AND ppd.machine_id = ${this.$route.query.machineId} AND ppd.product_id = ${this.$route.query.productId} ORDER BY   ss.carry_software_id
            ) T1
            ON T1.carry_software_id = cs.id
            WHERE cs.software_type != 3`;
        this.$db.all(rowSQL, async (err, res)=>{
          console.log(res, err,rowSQL);
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            console.log(res)
            let affirmTable = [];
            res.forEach((item, index) => {
              const obj = {
                component_count: item.component_count,
                template_desc: item.description,
                description_en:item.description_en,
                name: item.name,
                nameCN: item.category_name,
                template_name: item.component_FC,
                component_id: item.component_PN,
                //totalPrice:item.listprice_onshore,
                //total_price: item.listprice_onshore==null?'N/C':item.listprice_onshore,
                total_price: item.listprice_onshore*item.component_count,
                total_offshore: item.listprice_offshore*item.component_count,
                category: item.category_id,
                ui_status: item.ui_status,
                withdraw_date: item.withdraw_date
              };
              affirmTable.push(obj);
            });
            console.log(affirmTable)

            let data = affirmTable;
            /*合并相同 category_id 进行合并*/
            function trans(data) {
              let cache = {} // cache存储的键是eid，值是这个eid在indices数组中的下标
              let indices = [] // 数组中的每一个值是一个数组，数组中的每一个元素是原数组中相同eid的下标
              data.forEach((item, i) => {

                let eid = item.category
                let index = cache[eid]
                if (index !== undefined) {
                  indices[index].push(i)
                } else {
                  cache[eid] = indices.length
                  indices.push([i])
                }
              })

              let result = []
              indices.forEach(item => {
                item.forEach(index => {
                  result.push(data[index]) // 依次把index对应的元素data[index]添加进去即可
                })
              })

              return result
            }
            let result = trans(data)
            /*按照指定顺序 进行排序*/
            let cur = [3,2,7,1,6,5,8,11,16,17,23,24,25,26,27,22,37,12,41,39,28,38,30,31];
            let push = [];
            for(let x in result) {
              if(in_array(result[x].category, cur)) {
                result[x]['sort'] = cur.indexOf(result[x].category);
                push.push(result[x]);
              };
            };
            push = push.sort(function(a, b) {
              if(a.sort < b.sort) {
                return -1;
              } else if(a.sort > b.sort) {
                return 1;
              }
              return 0;
            });
            affirmTable = [];
            for(let x in push) {
              affirmTable.push( push[x])
            };

            function in_array(search, array) {
              for(var i in array) {
                if(array[i] == search) {
                  return true;
                }
              }
              return false;
            }
            let arr=[]
            /*如果fc相同，就将数据和并，数量相加*/
            affirmTable.forEach((item,index)=>{
              if (item.withdraw_date != null && item.withdraw_date != '' && item.withdraw_date != undefined){
                let calculationDay = this.calculationDay(moment(item.withdraw_date));
                item.exeInfo = ' 此部件将于'+moment(item.withdraw_date).format('YYYY-MM-DD HH:mm:ss')+' 停产。距离停产日期还有'+calculationDay+'天;'
                item.exeInfo_en = 'This part will be shut down at '+moment(item.withdraw_date).format('YYYY-MM-DD HH:mm:ss')+'。 '+calculationDay +' day before the production stop;';
              }else{
                item.exeInfo = '';
                item.exeInfo_en = '';
              }
              // //展示异常信息 0: 正常供货; 1: 此部件预计3~5周供货; 2: 此部件预计5~8周供货 3: 此部件预计>8周供货'
              // if (item.ui_status == 1){
              //     item.exeInfo += '此部件预计3~5周供货;'
              //     item.exeInfo_en += "part is expected to be delivered in 3~5 weeks;"
              // }else if (item.ui_status == 2){
              //     item.exeInfo += '此部件预计5~8周供货;'
              //     item.exeInfo_en += "part is expected to be delivered in 5~8 weeks;"
              // }else if (item.ui_status == 3){
              //     item.exeInfo += '此部件预计5~8周供货;'
              //     item.exeInfo_en += "part is expected to be delivered in 5~8 weeks;"
              // }else{
              //     item.exeInfo += ''
              //     item.exeInfo_en += ''
              // }
              if(arr.length==0){
                return arr.push(item)
              }
              for (let i=0;i<=arr.length;i++){
                if(i==arr.length){
                  return arr.push(item)
                }
                if(arr[i].template_name==item.template_name){
                  return arr[i].component_count+=item.component_count
                }
              }
            })
            this.showLists = [...arr];
            console.log(this.showLists)


            console.log(arr,affirmTable)
            //筛选出HPO是否开启导出标识
            let hpoExportFlag = true;
            //获取HPO是否展示标识
            const hpoSQL =`SELECT * FROM product_programme_detail WHERE
                template_id='${this.$route.query.templateId}' and category_id = 33 and
                solution_id='${this.$route.query.solutionId}'and
                product_id='${this.$route.query.productId}' and
                machine_id='${this.$route.query.machineId}'`;
            await new Promise((resolve, reject)=> {
              this.$db.all(hpoSQL, (err, res) => {
                if (err) {
                  resolve(null);
                } else {
                  resolve(res);
                }
              });
            }).then((data) => {
              if (data.length == 0){
                hpoExportFlag = false;
              }
            });
            this.$db.all(sqlSW, (err, res) => {
              console.log(res, err);
              if (err) {
                this.$logger(err);
                this.$Notice.error({
                  title: '搜索失败',
                  desc: err,
                });
              } else {
                console.log(res)

                let tempData = [];
                let typeModelList = [];
                let hpoList = [];
                //处理分类顺序 操作系统 逻辑分区 虚拟化软件
                let sysList = [];//操作系统
                let logicList = [];//逻辑分区
                let inventList = [];//虚拟化软件
                sysList = res.filter((c) =>{
                  return c.software_category == 1
                });
                logicList = res.filter((o) =>{
                  return o.software_category == 0
                });
                inventList = res.filter((v) =>{
                  return v.software_category == 2
                });
                res = inventList.concat(logicList).concat(sysList);

                console.log(res)
                //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
                for (let i = 0; i < res.length; i++) {
                  let obj = {
                    component_count: '',
                    description_en: res[i].software_des,
                    template_desc:res[i].software_desCN,
                    name: res[i].software_category,
                    nameCN: '',
                    template_name: res[i].software_FC,
                    component_id: res[i].software_PN,
                    Classify: res[i].Classify,
                    totalPrice:res[i].purchase,
                    totalOffshore:res[i].USDPurchase,
                    total_price:'',
                    total_offshore:'',
                    ui_status: res[i].ui_status,
                    withdraw_date: res[i].withdraw_date,
                    qty: res[i].qty
                  };
                  if (obj.qty == 0){
                    obj.component_count = res[i].cpuActiveNum;
                  }else{
                    obj.component_count = res[i].qty;
                  }

                  if (res[i].Classify == res[i].type + '-' + res[i].model) {
                    //逻辑分区
                    if (res[i].category_id == 13) {
                      obj.component_count = res[i].logicNum;
                      //操作系统
                    } else if (res[i].category_id == 14) {
                      obj.component_count = res[i].qty;
                    } else {
                      obj.component_count = res[i].cpuActiveNum;
                    }
                    if (obj.withdraw_date != null && obj.withdraw_date != '' && obj.withdraw_date != undefined){
                      let calculationDay = this.calculationDay(moment(obj.withdraw_date));
                      obj.exeInfo = ' 此部件将于'+moment(obj.withdraw_date).format('YYYY-MM-DD HH:mm:ss')+' 停产。距离停产日期还有'+calculationDay+'天;'
                      obj.exeInfo_en = 'This part will be shut down at '+moment(obj.withdraw_date).format('YYYY-MM-DD HH:mm:ss')+'。 '+calculationDay +' day before the production stop;';
                    }else{
                      obj.exeInfo = '';
                      obj.exeInfo_en = '';
                    }
                    //展示异常信息 0: 正常供货; 1: 此部件预计3~5周供货; 2: 此部件预计5~8周供货 3: 此部件预计>8周供货'
                    if (obj.ui_status == 1){
                      obj.exeInfo += '此部件预计3~5周供货;'
                      obj.exeInfo_en += "part is expected to be delivered in 3~5 weeks;"
                    }else if (obj.ui_status == 2){
                      obj.exeInfo += '此部件预计5~8周供货;'
                      obj.exeInfo_en += "part is expected to be delivered in 5~8 weeks;"
                    }else if (obj.ui_status == 3){
                      obj.exeInfo += '此部件预计5~8周供货;'
                      obj.exeInfo_en += "part is expected to be delivered in 5~8 weeks;"
                    }else{
                      obj.exeInfo += ''
                      obj.exeInfo_en += ''
                    }
                    typeModelList.push(obj);

                    continue;
                  }

                  //硬件 HPO
                  if (res[i].category_id == 33 || res[i].category_id == 34) {
                    //不需要显示HPO
                    if (!hpoExportFlag){
                      continue;
                    }
                    obj.component_count = res[i].qty;
                    hpoList.push(obj);
                    continue;
                  }
                  tempData.push(obj);
                }
                let addirmTable=[]
                //处理hpo列表顺序
                let headerHpoList = [];
                for (let k = hpoList.length - 1; k >= 0; k--) {
                  if (hpoList[k].template_name == undefined || hpoList[k].template_name == null || hpoList[k].template_name == '') {
                    headerHpoList.push(hpoList[k]);
                    hpoList.splice(k, 1);
                  }
                }
                for (let m = 0; m < headerHpoList.length; m++) {
                  addirmTable.push(headerHpoList[m]);
                  for (let j = 0; j < hpoList.length; j++) {
                    if (headerHpoList[m].Classify == hpoList[j].Classify && headerHpoList[m].name == hpoList[j].name) {
                      addirmTable.push(hpoList[j]);
                    }
                  }
                }

                //处理列表顺序
                let headerList = [];
                for (let k = tempData.length - 1; k >= 0; k--) {
                  if (tempData[k].template_name == undefined || tempData[k].template_name == null || tempData[k].template_name == '') {
                    headerList.push(tempData[k]);
                    tempData.splice(k, 1);
                  }
                }

                for (let m = 0; m < headerList.length; m++) {
                  addirmTable.push(headerList[m]);
                  for (let j = 0; j < tempData.length; j++) {
                    if (headerList[m].Classify == tempData[j].Classify && headerList[m].name == tempData[j].name) {
                      addirmTable.push(tempData[j]);
                    }
                  }
                }
                addirmTable = typeModelList.concat(addirmTable);

                //维保
                const sqlSWMA = ` SELECT  ppd.component_count,ppd.category_id AS software_category,cs.*,
                  (SELECT machine_model FROM product_info WHERE id = ${this.$route.query.productId}) AS type,
                  (SELECT machine_submodel FROM product_info WHERE id = ${localStorage.productId}) AS model,
                  (SELECT component_count FROM product_programme_detail WHERE category_id = 11
            AND solution_id = ${this.$route.query.solutionId} AND template_id = ${this.$route.query.templateId} AND machine_id = ${this.$route.query.machineId} AND product_id = ${this.$route.query.productId}) as cpuActiveNum,
            (SELECT component_count FROM product_programme_detail WHERE category_id = 13
            AND solution_id = ${this.$route.query.solutionId} AND template_id = ${this.$route.query.templateId} AND machine_id = ${this.$route.query.machineId} AND product_id = ${this.$route.query.productId}) as logicNum
            FROM component_software cs LEFT JOIN product_programme_detail ppd
                    ON cs.id = ppd.component_id
                    WHERE ppd.category_id IN (18,19,20) AND ppd.solution_id = ${this.$route.query.solutionId} AND ppd.template_id = ${this.$route.query.templateId}
                    AND ppd.machine_id = ${this.$route.query.machineId}  AND ppd.product_id = ${this.$route.query.productId}`;
                this.$db.all(sqlSWMA, async (err, res) => {
                  console.log(res, err);
                  if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                      title: '搜索失败',
                      desc: err,
                    });
                  } else {
                    //查询9000
                    let swmaList9000 = res.map((o)=>{
                      return o.id;
                    })
                    if (swmaList9000.length > 0){
                      let paramStr = '('+swmaList9000.join(',')+')';
                      const swma9000 = `SELECT ss.qty AS component_count,ss.software_category,cs.*,ss.choice_software_id FROM component_software cs
                        LEFT JOIN software_software ss ON cs.id = ss.carry_software_id
                        WHERE ss.choice_software_id IN ${paramStr}`;
                      await new Promise((resolve, reject)=> {
                        this.$db.all(swma9000, (err, ret) => {
                          if (err) {
                            resolve(null);
                          } else {
                            resolve(ret);
                          }
                        });
                      }).then((data) => {
                        data.forEach((c)=>{
                          let filter = res.filter((o)=>{
                            return o.id == c.choice_software_id;
                          });
                          filter.forEach((k)=>{
                            c.software_category = k.software_category;
                          })
                          res.push(c);
                        })
                      });
                    }
                    let tempSWMAData = [];
                    res = res.reverse();
                    for (let j = 0; j < res.length; j++) {
                      let objSWMA = {
                        component_count: res[j].component_count,
                        template_desc: res[j].software_desCN,
                        description_en:res[j].software_des,
                        name: res[j].software_category,
                        nameCN: '',
                        template_name: res[j].software_FC,
                        component_id: res[j].software_PN,
                        Classify: res[j].Classify,
                        totalPrice:res[j].purchase,
                        totalOffshore:res[j].USDPurchase,
                        total_price:'',
                        total_offshore:'',
                        ui_status: res[j].ui_status
                      };
                      tempSWMAData.push(objSWMA);
                    }
                    //处理列表顺序
                    let headerSWMAList = [];
                    let swmaList = [];
                    for (let k = tempSWMAData.length - 1; k >= 0; k--) {
                      if (tempSWMAData[k].template_name == undefined || tempSWMAData[k].template_name == null || tempSWMAData[k].template_name == '') {
                        headerSWMAList.push(tempSWMAData[k]);
                        tempSWMAData.splice(k, 1);
                      }
                    }
                    for (let m = 0; m < headerSWMAList.length; m++) {
                      swmaList.push(headerSWMAList[m]);
                      for (let j = tempSWMAData.length-1; j >=0 ; j--) {
                        if (headerSWMAList[m].Classify == tempSWMAData[j].Classify && headerSWMAList[m].name == tempSWMAData[j].name) {
                          swmaList.push(tempSWMAData[j]);
                          tempSWMAData.splice(j, 1);
                        }
                      }
                    }
                    tempSWMAData.forEach((c)=>{
                      swmaList.push(c);
                    });
                    addirmTable = addirmTable.concat(swmaList);
                  }
                  addirmTable.forEach(item => {
                    //展示异常信息 0: 正常供货; 1: 此部件预计3~5周供货; 2: 此部件预计5~8周供货 3: 此部件预计>8周供货'
                    if (item.ui_status == 1){
                      item.ui_status = '此部件预计3~5周供货'
                      item.ui_status_en = "part is expected to be delivered in 3~5 weeks"
                    }else if (item.ui_status == 2){
                      item.ui_status = '此部件预计5~8周供货'
                      item.ui_status_en = "part is expected to be delivered in 5~8 weeks"
                    }else if (item.ui_status == 3){
                      item.ui_status = '此部件预计5~8周供货'
                      item.ui_status_en = "part is expected to be delivered in 5~8 weeks"
                    }else{
                      item.ui_status = ''
                      item.ui_status_en = ''
                    }
                    if (item.name == 0) {
                      item.nameCN = '逻辑分区';
                      item.name = 'A logical partition';
                    } else if (item.name == 1) {
                      item.nameCN = '操作系统';
                      item.name = 'The operating system';
                    } else if (item.name == 2) {
                      item.nameCN = '应用程序';
                      item.name = 'The application';
                    } else if (item.name == 18) {
                      item.nameCN = '操作系统SWMA';
                      item.name = 'The application SWMA';
                    } else if (item.name == 19) {
                      item.nameCN = '逻辑分区SWMA';
                      item.name = 'A logical partition SWMA';
                    } else if (item.name == 20) {
                      item.nameCN = '应用程序SWMA';
                      item.name = 'The application SWMA';
                    }

                    item.total_price = item.totalPrice*item.component_count;
                    item.total_offshore = item.totalOffshore*item.component_count;

                  });
                  this.showLists = [...arr];
                  this.showListsData = [...addirmTable]
                });
                console.log(this.showLists,this.showListsData)
              }
            });
          }
          // const data = this.affirmTable;
          // /* 合并相同 category_id 进行合并*/
          // function trans(data) {
          //   const cache = {}; // cache存储的键是eid，值是这个eid在indices数组中的下标
          //   const indices = []; // 数组中的每一个值是一个数组，数组中的每一个元素是原数组中相同eid的下标
          //   data.forEach((item, i) => {
          //
          //     const eid = item.category;
          //     const index = cache[eid];
          //     if (index !== undefined) {
          //       indices[index].push(i);
          //     } else {
          //       cache[eid] = indices.length;
          //       indices.push([ i ]);
          //     }
          //   });
          //
          //   const result = [];
          //   indices.forEach(item => {
          //     item.forEach(index => {
          //       result.push(data[index]); // 依次把index对应的元素data[index]添加进去即可
          //     });
          //   });
          //
          //   return result;
          // }
          // const result = trans(data);
          // /* 按照指定顺序 进行排序*/
          // const cur = [ 3, 2, 7, 1, 6, 5, 8, 17 ];
          // let push = [];
          // for (const x in result) {
          //   if (in_array(result[x].category, cur)) {
          //     result[x].sort = cur.indexOf(result[x].category);
          //     push.push(result[x]);
          //   }
          // }
          // push = push.sort(function(a, b) {
          //   if (a.sort < b.sort) {
          //     return -1;
          //   } else if (a.sort > b.sort) {
          //     return 1;
          //   }
          //   return 0;
          // });
          // this.affirmTable = [];
          // for (const x in push) {
          //   this.affirmTable.push(push[x]);
          // }
          //
          // function in_array(search, array) {
          //   for (const i in array) {
          //     if (array[i] == search) {
          //       return true;
          //     }
          //   }
          //   return false;
          // }
        });
      },

      getHDWList() {
        // 获取数据
        const SQL = `select detail.component_count,info.listprice_onshore,info.status from component_base_info info
							join component_cpu cpu on info.id = cpu.base_info_id
							join product_programme_detail detail on cpu.id=detail.component_id and  detail.category_id=cpu.category_id
							 join component_category   cate  on  cate .id=cpu.category_id
							 join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
						select detail.component_count,info.listprice_onshore,info.status from component_base_info info
							join component_iocard io on info.id = io.base_info_id
							 join product_programme_detail detail on io.id=detail.component_id
							 and  detail.category_id = io.category_id
							 join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
				select detail.component_count,info.listprice_onshore,info.status from component_base_info info
							join component_disk disk on info.id = disk.base_info_id
							join product_programme_detail detail on disk.id=detail.component_id
							and  detail.category_id=disk.category_id
							left join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
				select detail.component_count,info.listprice_onshore,info.status from component_base_info info
							join component_power power on info.id = power.base_info_id
							join product_programme_detail detail on power.id=detail.component_id
							and  detail.category_id=power.category_id
						 join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
			select detail.component_count,info.listprice_onshore ,info.status from component_base_info info
						 join component_memory mem on info.id = mem.base_info_id
						 join product_programme_detail detail on mem.id=detail.component_id
						 and  detail.category_id=mem.category_id
						 left join solution so            on  so.id = detail.solution_id
						where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
						union
			select detail.component_count,info.listprice_onshore,info.status from component_base_info info
						 join component_backplane back on info.id = back.base_info_id
						 join product_programme_detail detail on back.id=detail.component_id
						 and  detail.category_id=back.category_id
						 join solution so            on  so.id = detail.solution_id
                        where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'`;
        //       const SQL = `select mem_des from component_memory`;
        let numall = 0;
        this.$db.all(SQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            for (let i = 0; i < res.length; i++) {
              numall += (res[i].component_count) * 1 * (res[i].listprice_onshore) * 1;
            }
            this.HDWnum = numall;
            this.HDWnumDis = this.HDWnum * 0.1;
          }
        });
      },

      getSFWList() {
        // 获取数据
        const SQL = `select det.component_count,cs.purchase from component_software cs
                  left join component_category        cate on cate.id=cs.category_id
                  left join product_programme_detail  det  on det.category_id=cate.id and det.component_id=cs.id
                  left join solution                  so   on so.id=det.solution_id
                  where det.category_id in(13,14,15)                and so.id=${localStorage.productId}`;
        //       const SQL = `select mem_des from component_memory`;
        let numall = 0;
        this.$db.all(SQL, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            for (let i = 0; i < res.length; i++) {
              if (isNaN(res[i].component_count) || isNaN(res[i].purchase)) {
                console.log(res[i].component_count, res[i].purchase);
                numall += 0;
              } else {
                numall += (res[i].component_count) * 1 * (res[i].purchase) * 1;
              }

            }
            this.FSWnum = numall;
            this.FSWnumDis = this.FSWnum * 0.1;
            console.log(this.FSWnum, this.FSWnumDis);
          }
        });
        this.setMACList();
      },

      setMACList() { // 总价计算
        const sql = `select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,act.code_activation,detail.id,info.status from component_base_info info
					join component_cpu cpu on info.id = cpu.base_info_id
					join product_programme_detail detail on cpu.id=detail.component_id
					and  detail.category_id=cpu.category_id
				 join solution so            on  so.id = detail.solution_id
				 join component_cpu_activation act on act.id=cpu.cpu_activation_id
			  	where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
						select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status ,detail.id,info.status from component_base_info info
							 join component_iocard io on info.id = io.base_info_id
							 left join product_programme_detail detail on io.id=detail.component_id
							 and  detail.category_id=io.category_id
							 join solution so            on  so.id = detail.solution_id
						where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
				select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status ,detail.id,info.status from component_base_info info
						join component_disk disk on info.id = disk.base_info_id
						join product_programme_detail detail on disk.id=detail.component_id
						and  detail.category_id=disk.category_id
					 join solution so            on  so.id = detail.solution_id
					where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
		select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status ,detail.id,info.status from component_base_info info
					join component_power power on info.id = power.base_info_id
					join product_programme_detail detail on power.id=detail.component_id
					and  detail.category_id=power.category_id
				 join solution so            on  so.id = detail.solution_id
				where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
							union
			select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status ,detail.id,info.status from component_base_info info
						 join component_memory mem on info.id = mem.base_info_id
						 join product_programme_detail detail on mem.id=detail.component_id
						 and  detail.category_id=mem.category_id
						 join solution so            on  so.id = detail.solution_id
							where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'
						union
						select info.component_PN,info.component_FC,info.name,info.description,info.description_en,detail.component_count,info.listprice_onshore,detail.status,detail.id,info.status from component_base_info info
								join component_backplane back on info.id = back.base_info_id
							 join product_programme_detail detail on back.id=detail.component_id
							 and  detail.category_id=back.category_id
							  join solution so            on  so.id = detail.solution_id
								where detail.solution_id='${localStorage.solutionId}' and detail.machine_id='${localStorage.machineId}' and detail.product_id='${localStorage.productId}' and detail.template_id = '${localStorage.templateId}'`;
        let allNum = null;
        this.$db.all(sql, (err, res) => {
          if (err) {
            this.$logger(err);
            this.$Notice.error({
              title: '搜索失败',
              desc: err,
            });
          } else {
            for (let i = 0; i < res.length; i++) {
              const num = res[i].component_count * res[i].listprice_onshore;
              allNum += num;
              // console.log(num);
            }
            this.MACnum = allNum;
            this.MACnumDis = this.MACnum * 0.1;
            // console.log(this.showdata, allNum);
          }
        });
      },

    },

    created() {
      console.log(this.$route.query,this.$route.query.product_id)
      this.userId = localStorage.userId;
      console.log('this.userId',this.userId)
      // 钩子函数渲染数据
      this.getDataList();
      this.getHDWList();
      this.getSFWList();
      this.getDataListnum();
    },
  };
</script>

<style scoped lang="scss">
  * {
    list-style: none;
    box-sizing: border-box;
  }
  .el-table th, .el-table tr{
    background: transparent;
  }
  .listtap{
    width: 100%;
    display: flex;
    justify-content: space-between;
    .goBack{
      display: inline-block;
    }
  }
  .wrap {
    width: 100%;
    padding: 20px;
    ul {
      width: 100%;
      display: flex;

      li {
        padding-right: 12px;
      }
    }
  }
  .LISTmain{
    padding-bottom: 20px;
    li{
      padding-left: 12px;
    }
  }
  .tsLists{
    width: 90%;
    border-bottom: 1px solid #e7e7e7;
    line-height: 45px;
    .numLIST{
      width: 100%;
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      li{
        flex: 1;
        width: 100%;
      }
    }
    /deep/.el-input__inner{
      background:rgb(245,245,245);
      border:none;
      border-bottom:1px solid #DCDFE6;
      border-radius:0px;
    }
  }
  .el-table__body-wrapper{
    background: #f5f5f5 !important;
  }
  element .style{
    background: #f5f5f5 !important;
  }
  .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td{
    background-color: inherit !important;
  }
  .intro-list{
    background-color: inherit !important;
  }
  .intro-list .el-table th, .el-table tr{
    background: #f5f5f5 !important;
  }

  .grid-content {
    padding: 20px 20px;
    .el-input {
      width: 40%;
    }
  }

  .affs {
    font-size: 17px;
    height: 60px;
    border-bottom: 1px solid #ccc;
    line-height: 60px;
    padding-left: 20px;
    //margin-left: 20px;
  }
</style>
