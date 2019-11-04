<template>
  <!--配置软件-->
    <div class="hardware">
        <header>
            <b>{{$t('ConfigureSoftware.title')}}</b>
            <el-button type="primary" size="mini" @click="getElen()">{{$t('ConfigureSoftware.buttonNext')}}<i
                    class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button type="primary" icon="el-icon-arrow-left" size="mini" @click="reload">{{$t('ConfigureSoftware.buttonLast')}}</el-button>
        </header>
        <div class="hardware-left">
            <nav v-for="(item, index) in config" :key="index" @mouseover="hardwareOver(index)"
                 @click="hardwareSwi(index)" ref="hardwareSwi" class="hardware-swi" @mouseout="hardwareOut()">
                <img :src="item.img" v-show="item.boole"/>
                <img :src="item.img1" v-show="!item.boole"/>
                <div class="hardware-left-name">{{item.name}}</div>
                <i class="el-icon-arrow-left" v-show="!item.boole"></i>
                <i class="el-icon-arrow-right" v-show="item.boole"></i>
            </nav>
        </div>
        <div class="hardware-right">
            <keep-alive>
                <router-view v-show="hardwareBian" @comup="comup"></router-view>
            </keep-alive>

            <!-- 默认展示配置清单-->
            <el-table :data="tableData" style="width: 100%" v-show="!hardwareBian">
                <el-table-column align="center" type="index" :index="indexMethod"
                                 :label="$t('Software.details.list.serialNumber')" width="80">
                </el-table-column>
                <el-table-column align="center" prop="component_id" label="PN" width="180">
                </el-table-column>
                <el-table-column align="center" prop="template_name" label="FC" width="110">
                </el-table-column>
                <el-table-column align="center" prop="name" :label="$t('Software.details.list.classify')" width="110">
                </el-table-column>
                <el-table-column align="center" prop="template_desc" :label="$t('Software.details.list.describingAccessories')">
                </el-table-column>
                <el-table-column align="center" prop="component_count" :label="$t('Software.details.list.Quantity')" width="80">
                </el-table-column>
                <el-table-column align="center" prop="total_price" :label="$t('Software.details.list.price')" width="180">
                </el-table-column>
            </el-table>
            <el-row :gutter="24" v-show="!hardwareBian">
                <el-col :span="8">
                    <div class="grid-content">{{$t('Software.details.aggregate')}}：{{totalPrice}}</div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">{{$t('Software.details.discount')}}：
                        <el-input v-model="input" @change="discountData(input,2)"></el-input>
                        %off
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">{{$t('Software.details.discountedPrice')}}：￥
                        <el-input v-model="input1" @change="getDiscountPrice(input1,2)"></el-input>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Hardware',
  data() {
    return {
      // 折扣输入框
      input: 10,
      input1: '',
      // 总价
      totalPrice: 0,
      // 折扣
      discount: '',
      // 折扣价
      discountPrice: '',
      // 折扣id
      discountId: '',
      // 判断跳进时显示的组件
      hardwareBian: true,
      // 判断有没有点击过，
      hardware: -1,
      // 判断有没有被hover上
      hardwareOv: -1,
      //  默认展示配置清单数据
      tableData: [],
      coloBa: 0,
      // config: [
      //   {
      //     name: '逻辑分区',
      //     img: '../../src/renderer/assets/logic-1.png',
      //     img1: '../../src/renderer/assets/logic-2.png',
      //     boole: true,
      //   },
      //   {
      //     name: '操作系统',
      //     img: '../../src/renderer/assets/logic-3.png',
      //     img1: '../../src/renderer/assets/logic-4.png',
      //     boole: true,
      //   },
      //   {
      //     name: '应用程序',
      //     img: '../../src/renderer/assets/logic-5.png',
      //     img1: '../../src/renderer/assets/logic-6.png',
      //     boole: true,
      //   },
      // ],
    };
  },
  computed:{
      config() {
          return [
              {
                  name: this.$t('Software.LogicalPartition.title'),
                  img: '../../src/renderer/assets/logic-1.png',
                  img1: '../../src/renderer/assets/logic-2.png',
                  boole: true,
              },
              {
                  name: this.$t('Software.OperatingSystem.title'),
                  img: '../../src/renderer/assets/logic-3.png',
                  img1: '../../src/renderer/assets/logic-4.png',
                  boole: true,
              },
              {
                  name: this.$t('Software.Application.title'),
                  img: '../../src/renderer/assets/logic-5.png',
                  img1: '../../src/renderer/assets/logic-6.png',
                  boole: true,
              },
          ]
      }
  },
  methods: {
      /* 输入 折扣 算出 折扣价*/
    discountData(num, type) {
      if (num < 100 && num > 9) {
        this.input1 = this.totalPrice * (100 - num) / 100;
        this.addDiscountData(type);
      } else {
        this.$message({
          message: '请输入正确折扣',
          type: 'warning',
        });
      }

    },

      /* 输入 折扣价 算出 折扣*/
    getDiscountPrice(num, type) {
      this.input = 100 - num / this.totalPrice * 100;
      this.addDiscountData(type);

    },

    /* 往数据库里插入已选数据*/
    addDiscountData(type) {
      const totalPrice = this.totalPrice;
      const discount = parseInt(this.input);
      const discountPrice = parseInt(this.input1);
      console.log(totalPrice, discount, discountPrice, type);
      if (this.discountId != '') {
        const updateSql = `update machine_price_detail set product_id='${localStorage.productId}',solution_id='${localStorage.solutionId}',
                    list_price='${totalPrice}',discount='${discount}',discount_price='${discountPrice}' WHERE machine_id='${localStorage.machineId}' AND configure_type ='${this.discountId}'`;
        console.log(updateSql);
        this.$db.run(updateSql, (err, res) => {
          if (res) {
            console.log('修改失败');
          } else {
            console.log('修改成功');
          }
        });
      } else {
        const SQL = `insert into machine_price_detail(product_id,solution_id,machine_id,list_price,discount,discount_price,configure_type)
                    VALUES('${localStorage.productId}','${localStorage.solutionId}','${localStorage.machineId}',
                    '${totalPrice}','${discount}','${discountPrice}','${type}')`;
        console.log(SQL);
        this.$db.run(SQL, (err, res) => {
          if (err) {
            console.log('添加失败');
          } else {
            console.log('添加成功');
            const selectSql = `select * from machine_price_detail where configure_type=${type}`;
            console.log(selectSql);
            this.$db.get(selectSql, (err, res) => {
              if (err) {
                this.$logger(err);
                this.$Notice.error({
                  title: '系统错误',
                  desc: err,
                });
                return;
              }
              this.discountId = res.configure_type;
              console.log(this.discountId);
            });
          }
        });
      }
    },

    comup(index) {
      this.config[index].boole = false;
      this.coloBa = index;
    },

    hardwareSwi(index) {
      // if (this.hardware !== -1) {
      //     this.$refs.hardwareSwi[this.hardware].style.background = '#f5f5f5';
      // }
      // this.hardwareBian = !this.hardwareBian;
      // this.config[index].boole = !this.config[index].boole;
      // /* 更改背景颜色*/
      // this.$refs.hardwareSwi[index].style.background = '#f0f0f0';
      // if (this.hardware !== -1 && index !== this.hardware) {
      //     this.config[this.hardware].boole = true;
      //     this.hardwareBian = false;
      // }
      // if (index !== this.hardware) {
      //
      // }
      // this.hardware = index;
      // eslint-disable-next-line eqeqeq
      if (this.hardware == -1) {
        this.config[this.coloBa].boole = true;
        this.$refs.hardwareSwi[index].style.background = '#f1f1f1';
        // this.config[0].boole = true;
        this.hardwareBian = !this.hardwareBian;
      }
      if (this.hardware == -1 && index == this.coloBa) {
        this.config[this.coloBa].boole = !this.config[this.coloBa].boole;
        this.hardwareBian = !this.hardwareBian;
      }
      this.hardwareBian = !this.hardwareBian;
      this.config[index].boole = !this.config[index].boole;
      /* 更改背景颜色*/
      this.$refs.hardwareSwi[index].style.background = '#f0f0f0';
      if (this.config[index].boole) {
        this.$refs.hardwareSwi[index].style.background = '#f5f5f5';
      }
      if (this.hardware !== -1 && index !== this.hardware) {
        this.config[this.hardware].boole = true;
        this.$refs.hardwareSwi[this.hardware].style.background = '#f5f5f5';
        this.hardwareBian = true;
      }
      this.hardware = index;
      /* 页面跳转*/
      if (index == 0) {
        this.$router.push({ path: '/Downen/Logic', query: { id: 0 } });
      }
      if (index == 2) {
        this.$router.push({ path: '/Downen/ProgramList', query: { id: 2 } });
      }
      if (index == 1) {
        this.$router.push({ path: '/Downen/Operation', query: { id: 1 } });
      }

    },
    /**
             * 获取csv封装所需的数据源sourceData
             * */
    async getSourceData() {
      const sourceData = await this.getConstureDate();
      // this.$store.commit('getSourceData', sourceData);
      // console.log(sourceData, this.$store.state.sourceData);
    },

    /**
             * 2019年9月18日 13:29:49
             * 功能：将数据库中的数据封装成solutionList对象并返回
             * @return 返回solutionList对象，该文件是根据数据库查询的数据生成的JSON对象
             * */
    async getConstureDate() {

      let logInfo;

      // 最终封装成的对象
      const solutionList = [];

      // 通过SQL语句访问数据库并返回查询的所有结果
      const allDetailDatas = await this.selectBySql('select * from product_programme_detail');

      // 如果detail中没有任何数据直接返回空数组
      if (allDetailDatas == null) {
        return [];
      }

      // 将当前对象所在的表product_programme_detail和component_categroy进行联查，并为每一个component添加新属性typeId用来表示软硬件以及其他等的信息
      for (let i = 0; i < allDetailDatas.length; i++) {
        let selectResult = await this.selectOneObject('select * from product_programme_detail,component_categroy where product_programme_detail.id=' + allDetailDatas[i].id + ' and  product_programme_detail.categroy_id=component_categroy.id');
        this.setValueAndKeyByArray(allDetailDatas[i], [ 'type_id', selectResult.is_software, 'tableName', selectResult.table_name, 'categoryName', selectResult.name ]);

        // 硬件执行的数据封装
        if (allDetailDatas[i].type_id == 0) {
          // 对组件中硬件所需数据进行封装
          selectResult = await this.selectOneObject('select component_base_info.* from ' + selectResult.table_name + ' as tn,component_base_info where tn.id=' + allDetailDatas[i].component_id + ' and tn.base_info_id=component_base_info.id');
          if (selectResult != null) {
            this.setValueAndKeyByArray(allDetailDatas[i], [ 'name', selectResult.name, 'description', selectResult.description, 'componentPN', selectResult.component_PN, 'FC', selectResult.component_FC, 'listPriceOnShore', selectResult.listprice_onshore, 'listPriceOffShore', selectResult.listprice_offshore, 'slotCnt', selectResult.slot_count, 'occupiedSlotCnt', selectResult.occupy_count, 'GADate', selectResult.GA_date, 'withDrawDate', selectResult.withdraw_date, 'announceDate', selectResult.announce_date, 'status', selectResult.status, 'uiStatus', selectResult.ui_status, 'tittleMsg', selectResult.title_msg, 'watt', selectResult.watt, 'createdDate', selectResult.created_date, 'updateDate', selectResult.update_date ]);
          }

          // 对相应的组件信息根据数据库中的表列数据进行封装
          selectResult = await this.selectOneObject('select * from ' + allDetailDatas[i].tableName + ' where id=' + allDetailDatas[i].component_id);

          if (selectResult != null) {
            // 封装的数据时排除数组中的列
            const customArray = this.transferObjectToArray(selectResult, [ 'id', 'category_id' ]);

            // 向当前组件对象中添加数据
            this.setValueAndKeyByArray(allDetailDatas[i], customArray);
          }
        } else if (allDetailDatas[i].type_id == 1) {
          // --mark-- 对组件中软件所需数据进行封装
          selectResult = await this.selectOneObject('select component_software.* from ' + allDetailDatas[i].tableName + ' as tn,component_software where tn.id=' + allDetailDatas[i].component_id + ' and tn.base_info_id=component_software.id');
          if (selectResult != null) {
            this.setValueAndKeyByArray(allDetailDatas[i], [ 'softwareType', selectResult.software_type, 'classify', selectResult.Classify, 'softwarePN', selectResult.software_PN, 'softwareFC', selectResult.software_FC, 'softwareDesc', selectResult.software_des, 'masterOs', selectResult.master_os, 'slaveOs', selectResult.slave_os, 'purchase', selectResult.purchase, 'softwareName', selectResult.software_name, 'application', selectResult.application, 'vm', selectResult.vm ]);
          }
          // 对相应的组件信息根据数据库中的表列数据进行封装
          selectResult = await this.selectOneObject('select * from ' + allDetailDatas[i].tableName + ' where id=' + allDetailDatas[i].component_id);

          if (selectResult != null) {
            // 封装的数据排除数组中的列
            const customArray = this.transferObjectToArray(selectResult, [ 'id', 'category_id' ]);

            // 向当前组件对象中添加数据
            this.setValueAndKeyByArray(allDetailDatas[i], customArray);
          }

        } else {
          // 暂时什么都不做，以后可能通过设置回调函数进行功能拓展
        }
      }

      // 按照solution_id进行数据封装---------------------------------------方案list
      const assemBySolution = this.generateFixedDataConstruction(allDetailDatas, 'solution_id', 'solutionId', 'componentList');

      // 遍历assemBySolution
      for (let i = 0; i < assemBySolution.length; i++) {
        // 暂存每一次取到的粗封装的solution方案对象-----------------------每一个方案
        const tempSolution = assemBySolution[i];

        // 下方的mark标志表示处理数据tempSolution对象的封装
        // --mark-- 查询当前方案id在数据库中的详细信息
        const solution = await this.selectOneObject('select * from solution where id=' + tempSolution.solutionId);

        // 如果取得的结果为null，结束当前循环，避免控制台报错
        if (solution == null) {
          break;
        }

        // --mark-- 创建一个包含指定信息的方案对象,参数[key1,value1,key2,value2,key3,value3....]
        // --mark-- 创建一个solution的productList，用于保存一个方案中的所有product
        const tempSolutionObj = this.createObjByKeysAndValuesArray([ 'solutionId', tempSolution.solutionId, 'solutionName', solution.solution_name, 'customerName', solution.customer_name, 'projectName', solution.project_name, 'salesManager', solution.sales_manager, 'CRAD', solution.ship_date, 'preSalesManager', solution.pre_sales_manager, 'desc', solution.description, 'productList', []]);

        // 对传入的单个solution的componentList按照productId进行粗封装--产品list
        const assemByProduct = this.generateFixedDataConstruction(tempSolution.componentList, 'product_id', 'productId', 'componentList');

        // 遍历assemByProduct
        for (let j = 0; j < assemByProduct.length; j++) {
          // 暂存循环中每一次取到的粗封装的product对象------------------每一个产品
          const tempProduct = assemByProduct[j];
          // --mark-- 查询当前产品product在数据库中的详细信息
          const product = await this.selectOneObject('select * from product_info where id=' + tempProduct.productId);

          // --mark-- 请勿删除
          if (product == null) {
            break;
          }

          // --mark-- 创建一个product临时对象用来向上面solution的productList填充数据
          const tempProductObj = this.createObjByKeysAndValuesArray([ 'productId', tempProduct.productId, 'productName', product.product_name, 'desc', product.description, 'systemType', product.system_type, 'systemModel', product.system_model, 'pictureURL', product.picture_url, 'announceDate', product.announce_date, 'GADate', product.GA_date, 'withdrawDate', product.withdraw_date, 'status', product.status, 'maxComputeNodeCnt', product.computeNode_cnt, 'maxBeforeBackplaneCnt', product.before_backplane_cnt, 'maxMiddleBackplaneCnt', product.middle_backplane_cnt, 'maxBehindBackplaneCnt', product.behind_backplane_cnt, 'maxPCIE4Cnt', product.pcie4, 'maxPCIE8Cnt', product.pcie8, 'maxPCIE16Cnt', product.pcie16, 'PCIEHighType', product.pcie_high_type, 'PCIEWidthType', product.pcie_width_type, 'minPowerCnt', product.power_cnt_min, 'maxPowerCnt', product.power_cnt_max, 'defaultPowerId', product.power_id, 'bareboneId', product.barebone_id, 'cpuDesc', product.cpu_desc, 'powerLineDesc', product.power_line_desc, 'isPCIDecelerate', product.allow_rate, 'minLanCnt', product.lan_min, 'defaultLanId', product.lan_id, 'memoryZip', product.memory_expansion, 'componentTypeList', []]);


          // 对传入的单个tempProduct的componentList按照type_id进行粗封装--类型list
          const assemByType = this.generateFixedDataConstruction(tempProduct.componentList, 'type_id', 'typeId', 'componentList');

          // 向componentList压入数据assemByType
          this.setValueByKey(tempProductObj, 'componentTypeList', assemByType);

          // --mark-- 将tempProductObj推入到tempSolutionObj的productList数组里
          this.pushObjtoArray(tempSolutionObj.productList, tempProductObj);
        }

        // --mark-- 将tempSolutionObj推入到solutionList数组里
        this.pushObjtoArray(solutionList, tempSolutionObj);
      }
      // --mark-- 控制台打印
      // this.consolePrintOrgin('solutionList', solutionList);
      return solutionList;
      // ====================================solutionList对象结果封装完成========================================end
    },

    // ========================方法定义=========================================================================start
    //* *********生成数据源的方法定义**********
    /**
             * sql查询方法封装，只需要一个sql语句即可完成数据返回
             * @param SQL 需要被执行的SQL语句
             * @return 返回list类型查询结果，查询出错则返回null
             * 使用时注意判断是否查询出错，在返回值不为null的情况下再进行数据处理
             * 此方法的使用依赖于异步实现，如有疑问可询问 by 海洋 2019年9月12日 09:03:43
             */
    async selectBySql(SQL) {

      // console.log('当前SQL:  ' + SQL);

      const _this = this.$db;
      let selectResult;
      await new Promise(function(resolve, reject) {
        // 数据库查询
        _this.all(SQL, (err, res) => {
          if (err) {
            resolve(null);
          } else {
            resolve(res);
          }
        });
      }).then(data => {
        selectResult = data;
      });
      return selectResult;
    },
    /**
             * 如果调用者确定通过SQL查询出的结果为一个对象，则调用该方法
             * @param SQL 需要被执行的SQL
             * @return 返回一个对象，如果查询失败或查询不到则返回null
             * */
    async selectOneObject(SQL) {
      const tempValue = await this.selectBySql(SQL);
      if (tempValue instanceof Array && tempValue.length == 1) {
        return tempValue[0];
      }
      return null;
    },

    /**
             * 从list中得到属性名为valueName的属性值与指定值value相等的对象中所持有的数组
             * @param sourceList    showList数据
             * @param  valueName 属性名
             * @param value 参照值
             * @returns 从list中返回一个属性名为attrName，属性值为attrValue的对象，如果查不到就返回null
             * 此方法有点绕，如有疑问可询问我 By 海洋 2019年9月12日 12:01:00
             */
    getObjByAttributeFromList(sourceList, attrName, attrValue) {
      for (let i = 0; i < sourceList.length; i++) {
        if (sourceList[i][attrName] == attrValue) {
          return sourceList[i];
        }
      }
      return null;
    },

    /**
             * 判断list中是否存在属性名是idName并且属性值为idValue如果有，返回所在list中的位置
             * @param list 被判断的list
             * @param idName 被判断的ID名称
             * @param idValue 被判断的id值
             * @return 判断当前list中是否存在某个对象的属性名为idName，属性值为idValue的对象，如果存在就返回该对象在数组中的位置，如果不存在就返回null
             */
    isInList(list, idName, idValue) {
      let tempSolutionId;
      for (let i = 0; i < list.length; i++) {
        tempSolutionId = list[i][idName];
        // 如果取得
        if (tempSolutionId == idValue) {
          // 返回该idName所在的位置id
          return i;
        }
      }
      return null;
    },
    /**
             * 向array中放入一个对象,对象的属性包括id和value，还有创建新的list
             * @param array 被压入数据的list
             * @param idName 被压入对象的属性名
             * @param idValue 被压入对象idName对应的属性值
             * @param objectList 被创建属性名为objectListName(obj的属性)的值
             * @param objectValue 被押入到objectList中的值
             * @return 返回对已存在数组array封装后的数据数组
             * 调用举例，可以搜索下面所在的位置
             * this.pushIdAndValueToArray(this.solutionList, "solutionId", selectResult[i].solution_id, [], "solutionLists", selectResult[i]);
             * 此方法较为复杂，且依赖于我写的其他方法，如有疑问可询问我 By 海洋 2019年9月12日 12:01:21
             * */
    pushIdAndValueToArray(array, idName, idValue, objectList, objectListName, objectValue) {
      const obj = {};
      obj[idName] = idValue;
      // 深克隆
      obj[objectListName] = JSON.parse(JSON.stringify(objectList));
      obj[objectListName].push(objectValue);
      array.push(obj);
      return array;
    },
    /**
             *从sourceList生成[{idNameInDestList:值,subListNameInDestList:值},{},{}....]的指定样式数据
             * @param sourceList 数据源
             * @param idNameInSourceList 在数据源中的需要取值的id名称
             * @param idNameInDestList 在生成的数据格式中自定义的目标数据的属性id名称
             * @param subListNameInDestList 在生成的数据格式中自定义的目标数据的属性子List名称
             * @param 返回指定样式的数据，样式见注释
             * 使用举例this.solutionList= this.generateFixedDataConstruction(selectResult,"solution_id","solutionId","productList");
             * 此方法较为复杂，且依赖于我写的其他方法，如有疑问可询问我 By 海洋 2019年9月16日 15:26:31
             * */
    generateFixedDataConstruction(sourceList, idNameInSourceList, idNameInDestList, subListNameInDestList) {
      const destList = [];
      for (let i = 0; i < sourceList.length; i++) {
        // 判断destList中是否存在idNameInDestList所对应的列表
        const solutionLocation = this.isInList(destList, idNameInDestList, sourceList[i][idNameInSourceList]);

        // 如果不存在该产品idNameInDestList所对应的列表
        if (solutionLocation == null) {
          // 创建新对象并放入到数组中
          this.pushIdAndValueToArray(destList, idNameInDestList, sourceList[i][idNameInSourceList], [], subListNameInDestList, sourceList[i]);

          // 如果存在该产品idNameInDestList所对应的方案列表
        } else {
          // 将对象插入已有数组中
          this.pushObjtoArray(destList[solutionLocation][subListNameInDestList], sourceList[i]);
        }
      }
      return destList;
    },

    /**
             * 向一个list[]结构中push进一个对象
             * @param list 被压入的集合
             * @param obj 被压入的对象
             * @return push元素之后的list数组
             * */
    pushObjtoArray(list, obj) {
      list.push(obj);
      return list;
    },
    /**
             * 该方法的作用取得给定对象key对应的的值，应用于动态取值
             * @param obj obj的数据源
             * @param key   json数据源中的key
             * @return 返回obj.key的结果
             */
    getValueBykey(obj, key) {
      return obj[key];
    },
    /**
             * 向obj中增加新属性，应用于动态添加属性
             * @param obj 需要添加属性的对象
             * @param key 属性名称
             * @param value 属性值
             * @return 返回操作后的对象
             * */
    setValueByKey(obj, key, value) {
      obj[key] = value;
      return obj;
    },
    /**
             * 根据已有的key和value数组对传入的对象添加新属性
             * 例如key1,value1,key2,value2,key3,value3.....
             * @param keyAndValueArray 对象的属性和值组成的数组
             * @param obj 被操作的对象
             * @return 返回添加新属性之后的对象
             * */
    setValueAndKeyByArray(obj, keyAndValueArray) {
      if (keyAndValueArray.length % 2 == 0) {
        for (let i = 0; i < keyAndValueArray.length; i += 2) {
          obj[keyAndValueArray[i]] = (keyAndValueArray[i + 1] == null ? '' : keyAndValueArray[i + 1]);
        }
      }
      return obj;
    },

    /**
             * 根据已有的key和value创建一个对象，要求两个数组的key和value的对应位置、数量必须一致,否则返回null
             * 例如key1,value1,key2,value2,key3,value3.....
             * @param keyAndValueArray 被创建对象的属性
             * @return 返回一个根据参数动态生成的对象
             * */
    createObjByKeysAndValuesArray(keyAndValueArray) {
      if (keyAndValueArray.length % 2 == 0) {

        const obj = {};

        for (let i = 0; i < keyAndValueArray.length; i += 2) {

          obj[keyAndValueArray[i]] = (keyAndValueArray[i + 1] == null ? '' : keyAndValueArray[i + 1]);
        }
        return obj;
      }
      return null;
    },
    /**
             * 功能是将obj(该obj中一定不能有数组)转换成[key1,value1,key2,value2,key3,value3...]的对象形式
             * 以便于方法setValueAndKeyByArray或createObjByKeysAndValuesArray中作为参数传入
             * @param obj 传入的需要被处理的对象
             * @param rejectKeyArray 封装时排除的key
             * @return 返回一个[key1,value1..]的对象
             * */
    transferObjectToArray(obj, rejectKeyArray) {

      // 拼接整理的结果数组字符串
      let resultArray = '';

      let objStr = JSON.stringify(obj);

      objStr = objStr.substring(1, objStr.length - 1);
      objStr = objStr.split(',"');

      let tempStr;
      for (let i = 0; i < objStr.length; i++) {
        if (i != 0) {
          resultArray += ',"';
        }
        tempStr = objStr[i].replace(':', ',');
        resultArray += tempStr;
      }
      resultArray = '[' + resultArray + ']';

      let resultArrayObj = JSON.parse(resultArray);

      const backupObj = JSON.parse(JSON.stringify(resultArrayObj));
      try {
        // 根据排除key的数组进行数据清除
        for (let i = 0; i < resultArrayObj.length; i += 2) {
          for (let k = 0; k < rejectKeyArray.length; k++) {
            // 如果匹配到最终项包含有排除项
            if (rejectKeyArray[k] == resultArrayObj[i]) {
              for (let j = i; j < resultArrayObj.length - 2; j += 2) {
                resultArrayObj[j] = resultArrayObj[j + 2];
                resultArrayObj[j + 1] = resultArrayObj[j + 3];
              }
              resultArrayObj = resultArrayObj.slice(0, resultArrayObj.length - 2);
            }
          }
        }

        // 去除数据的下划线，并将下划线的第一个字母变成大写
        for (let i = 0; i < resultArrayObj.length; i += 2) {
          let flag = true;
          while (flag) {
            const currLocation = resultArrayObj[i].indexOf('_');
            if (currLocation < 0) {
              flag = false;
            }
            resultArrayObj[i] = resultArrayObj[i].replace('_' + resultArrayObj[i].charAt(currLocation + 1), resultArrayObj[i].charAt(currLocation + 1).toUpperCase());
          }
        }
        return resultArrayObj;
      } catch (e) {
        console.log('未排除key');
        for (let i = 0; i < backupObj.length; i += 2) {
          // 去除数据的下划线，并将下划线的第一个字母变成大写
          let flag = true;
          while (flag) {
            const currLocation = backupObj[i].indexOf('_');
            if (currLocation < 0) {
              flag = false;
            }
            backupObj[i] = backupObj[i].replace('_' + backupObj[i].charAt(currLocation + 1), backupObj[i].charAt(currLocation + 1).toUpperCase());
          }
        }
        return backupObj;
      }
    },

    /** 控制台打印指定样式的数据
             * @param msgName 控制台打印的信息名称
             * @param content 控制台打印的内容
             * @return 按照指定格式打印到控制台结果
             * */
    consolePrint(msgName, content) {
      console.log('>>>>>>>>>==============================================================================');
      console.log('.^_^.     ' + JSON.stringify(msgName) + '        *************信息内容如下*************\n\n');
      if (content instanceof Array) {
        console.log(JSON.stringify(msgName) + '是一个数组: [   ],共 ' + content.length + ' 条数据\n');
        for (let i = 0; i < content.length; i++) {
          console.log('第' + (i + 1) + '条：  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ \n' + JSON.stringify(content[i]) + '\n');
        }
        console.log('==============================================================================<<<<<<<<<\n');
      } else {
        console.log(JSON.stringify(msgName) + '是一个对象: {   } \n');
        console.log('>>>>>>>>>==============================================================================');
        console.log('.^_^.     ' + JSON.stringify(msgName) + '        *************信息内容如下*************\n\n' + JSON.stringify(content));
        console.log('==============================================================================<<<<<<<<<\n');
        console.log('\n');
        console.log('\n');
      }
    },
    /**
             * 控制台打印指定样式的数据
             * @param msgName 控制台打印的信息名称
             * @param content 控制台打印的内容
             * @return 打印出原始数据内容
             * /
             */
    consolePrintOrgin(msgName, content) {
      console.log('>>>>>>>>>==============================================================================');
      console.log('.^_^.     ' + JSON.stringify(msgName) + '        *************信息内容如下*************\n\n' + JSON.stringify(content));
      console.log('==============================================================================<<<<<<<<<\n');
      console.log('\n');
      console.log('\n');
    },

    /**
             * 产生默认的时间格式
             * */
    getDefaultDateFormate(date) {
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = (month + '').length == 2 ? month : ('0' + month);
      let day = date.getUTCDate();
      day = (day + '').length == 2 ? day : ('0' + day);
      return year + '-' + month + '-' + day;
    },
    getElen() {
      this.addDiscountData(1);
      this.$router.push('/Affirm');
    },
    /* 更改背景颜色*/
    hardwareOver(index) {
      this.$refs.hardwareSwi[index].style.background = '#f0f0f0';
      this.hardwareOv = index;
    },
    /* 更改背景颜色*/
    hardwareOut() {
      if (this.hardwareOv !== this.hardware) {
        this.$refs.hardwareSwi[this.hardwareOv].style.background = '#f5f5f5';
      }
    },

    /* 返回上一页*/
    reload() {
      this.$router.push({ path: '/Hardware/Processor', query: { id: 0,sign:3,signT:11 } });
    },

    /* 获取分离背板数据*/
    configurationList() {
      // 'detail-软件 ------software_categroy: 0是逻辑分区，1是操作系统，2应用程序'
      const getti = `select  distinct cs.id,cs.software_PN,cs.software_FC,ss.software_categroy,cs.software_des,ss.qty,cs.purchase from (
         select * from component_software where id in (
         select  carry_software_id from software_software where choice_software_id in (
         select id from component_software where id in (
         select component_id from product_programme_detail where categroy_id in (13,14,15,21) and product_id=1
                                                  and solution_id='${localStorage.solutionId}'
                                                  and template_id='${localStorage.templateId}'
                                                   AND product_id=${localStorage.productId}
                                                  and machine_id='${localStorage.machineId}'
         )
          )
         ) and software_type !=3
         ) cs left join software_software ss on ss.carry_software_id= cs.id

union
select distinct cs.id,cs.software_PN,cs.software_FC,cs.categroy_id,cs.software_des,detail.component_count,cs.purchase from (
select *
from component_software  where id in(select component_id from product_programme_detail where categroy_id in(18,19,20) and template_id='${localStorage.templateId}'and solution_id='${localStorage.solutionId}'AND product_id=${localStorage.productId}
 and machine_id='${localStorage.machineId}'))cs left join product_programme_detail detail on detail.component_id = cs.id `;


      this.$db.all(getti, (err, res) => {
        console.log(res);
        this.tableData = [];
        this.totalPrice = 0;
        const arr = [];
        if (res == undefined) {
          return;
        }
        res.forEach((item, index) => {
          const obj = {
            component_count: item.qty,
            template_desc: item.software_des,
            name: item.software_categroy,
            template_name: item.software_FC,
            component_id: item.software_PN,
            total_price: item.purchase,
          };
          if (!isNaN(parseInt(item.purchase))) {
            this.totalPrice += parseInt(item.purchase);
          }
          console.log(this.totalPrice, item.purchase);
          this.input1 = this.totalPrice * ((100 - this.input) / 100);
            /* 获取用户id  判断权限 */
            if(localStorage.userId == 1){
                obj.total_price = '';
                this.totalPrice = '';
                this.input = '';
                this.input1 = '';
            }
          return arr.push(obj);
        });
        this.tableData = arr.filter(item => {
          if (item.name == 0) {
            item.name = '逻辑分区';
            return true;
          }
        });
        arr.forEach(item => {
          if (item.name == 1) {
            item.name = '操作系统';
            return this.tableData.push(item);
          }
        });
        arr.forEach(item => {
          if (item.name == 2) {
            item.name = '应用程序';
            return this.tableData.push(item);
          }
        });
        arr.forEach(item => {
          if (item.name == 18) {
            item.name = '操作系统SWMA';
            return this.tableData.push(item);
          }
        });
        arr.forEach(item => {
          if (item.name == 19) {
            item.name = '逻辑分区SWMA';
            return this.tableData.push(item);
          }
        });
        arr.forEach(item => {
          if (item.name == 20) {
            item.name = '应用程序SWMA';
            return this.tableData.push(item);
          }
        });
      });
    },

    /* 自定义行数*/
    indexMethod(index) {
      return index + 1;
    },
  },
  mounted() {
    this.configurationList();
  },
  watch: {
    hardwareBian(newValue, oldValue) {
      if (oldValue) {
        this.configurationList();
      }
    },
  },

};
</script>

<style scoped lang="less">
    .hardware {
        height: 100%;

        header {
            min-height: 50px;
            height: 6%;
            font-size: 16px;
            border: 1px solid #ccc;

            b {
                margin-left: 30px;
                line-height: 50px;
            }

            .el-button {
                float: right;
                margin-right: 20px;
                margin-top: 10px;
            }
        }

        .hardware-left {
            float: left;
            width: 300px;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            height: 94%;
            min-height: 500px;

            .hardware-swi {
                height: 60px;
                border-bottom: 1px solid #ebebeb;
                line-height: 60px;
                padding-left: 30px;
                cursor: pointer;

                .hardware-left-name {
                    margin-left: 30px;
                    display: inline-block;
                }

                img {
                    width: 20px;
                }

                i {
                    float: right;
                    margin-right: 40px;
                    margin-top: 24px;
                    font-size: 20px;
                }
            }
        }

        .hardware-right {
            height: 94%;
            overflow: auto;
        }

        .grid-content {
            padding: 20px 40px;
            .el-input {
                width: 40%;
            }
        }
    }
</style>
