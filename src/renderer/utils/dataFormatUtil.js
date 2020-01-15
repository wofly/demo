import Excel from 'xlsx';
import cpy from './exportExcelDatacpy';
import cpy950 from './exportExcelDatacpy950';
import Vue from 'vue'; //引入vue
let vm = new Vue();
let db;
setTimeout(() => {
  db = vm.$db; //不是undefined了
}, 2000);


export default {
  //向一个对象中创建一个新属性
  /**
   * 向obj中创建新属性，应用于动态创建属性
   * @param obj 需要被创建属性的对象
   * @param key 属性名称
   * @param value 属性值
   * @return 返回操作后的对象
   * */
  createNewProp(obj, key, value) {
    obj[key] = value;
    return obj;
  },

  //向一个对象中批量创建新属性

  /**
   * 根据已有的key和value数组对传入的对象创建新属性
   * 数据格式：[key1,value1,key2,value2,key3,value3.....]，其中key和value必须是成对的，元素总个数必须是偶数
   * @param keyValueArray 键和值组成的数组
   * @param obj 被操作的对象
   * @return 返回添加新属性之后的对象
   * */
  createNewPropsInObjByArray(obj, keyValueArray) {
    if (keyValueArray.length % 2 == 0) {
      for (let i = 0; i < keyValueArray.length; i += 2) {
        obj[keyValueArray[i]] = (keyValueArray[i + 1] == null ? '' : keyValueArray[i + 1]);
      }
    }
    return obj;
  },
  //尝试获取对象obj中属性为key的值，如果该属性不存在则返回null
  /**
   * @param obj 被操作的对象
   * @param key 字符串，obj可能存在的key
   * @return 返回obj对应key的结果，如果对象中不存则返回null
   */
  tryGetValue(obj, key) {
    try {
      return obj[key];
    } catch (e) {
      this.proxyConsole('Exception', e);
      return null;
    }
  },
  //从一个数组array中匹配并返回一个属性名为key且属性值为value的对象
  /**
   * @param array
   * @param  key 属性名
   * @param value 属性值
   * @return 返回首次匹配到的对象，如果没有匹配到返回null
   */
  getObjFromArrayByProp(array, key, value) {
    try {
      for (let i = 0; i < array.length; i++) {
        if (JSON.stringify(array[i][key]) == JSON.stringify(value)) {
          return array[i];
        }
      }
    } catch (e) {

    }
    return null;
  },
  //从一个数组array中匹配所有属性名为key并且属性值为value的对象并返回一个所有满足条件的对象数组
  //从一个数组array中匹配一个属性名为key并且属性值为value的对象，并返回该对象在数组中的下标
  /**
   * @param array
   * @param  key 属性名
   * @param value 属性值
   * @returns 返回首次匹配到的对象的index，如果没有匹配到返回null
   */
  objIndexInArray(array, key, value) {
    try {
      for (let i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
          return i;
        }
      }
    } catch (e) {

    }
    return null;
  },
  //从一个数组array中匹配所有属性名为key并且属性值为value的对象并返回一个所有满足条件的对象在数组红的角标
  //将给定数组Array按照每个对象的key进行分类
  //说明：依赖方法 objIndexInArray、createObjInTargetArrayInArray 实现
  /**
   * @param sourceArray 需要被分类的Array
   * @param sortKeyNameInSourceArray 对array中对象的分类依据
   * @param sortKeyNameInDestArray 意义见return的数据格式说明
   * @param subArrayNameInDestArray 意义见return的数据格式说明
   * @param return 返回分类后的数据，数据样式[{sortKeyNameInDestArray:值,subArrayNameInDestArray:[值1,值2....]},{},{}....]
   * */
  sortArray(sourceArray, sortKeyNameInSourceArray, sortKeyNameInDestArray, subArrayNameInDestArray) {

    let destList = [];

    for (let i = 0; i < sourceArray.length; i++) {

      // 判断destList中对象中当前对象sourceArray[i]是否已存在sortKeyNameInDestArray所对应的值，如果有就返回相应的数组下标
      let tempObjIndex = objIndexInArray(destList, sortKeyNameInDestArray, sourceArray[i][sortKeyNameInSourceArray]);

      // 如果不存在
      if (tempObjIndex == null) {
        //创建新对象并放入到数组中
        createObjInTargetArrayInArray(destList, sortKeyNameInDestArray, sourceArray[i][sortKeyNameInSourceArray], [], subArrayNameInDestArray, sourceArray[i]);

        //如果存在
      } else {
        //将当前对象插入已有数组中
        (destList[tempObjIndex][subArrayNameInDestArray]).push(sourceArray[i]);
      }
    }
    return destList;
  },
  //向array中添加一个对象，该对象包含两个属性key，targetArrayName，值分别为value和targetArray，在targetArray中又添加了一个元素obj

  /**
   * @param array
   * @param key
   * @param value
   * @param targetArray
   * @param targetArrayName
   * @param obj
   * @return 返回操
   * */
  createObjInTargetArrayInArray(array, key, value, targetArray, targetArrayName, obj) {
    let tempObj = {};
    tempObj[key] = value;
    //深克隆
    tempObj[targetArrayName] = JSON.parse(JSON.stringify(targetArray));
    tempObj[targetArrayName].push(obj);
    array.push(tempObj);
    return array;
  },
  //根据已有键值对数组创建一个对象
  /**
   * 根据已有的key和value创建一个对象，要求key和value的对应位置、数量必须一致,否则返回null
   * 例如key1,value1,key2,value2,key3,value3.....
   * @param keyAndValueArray 被创建对象的属性
   * @return 返回一个根据参数动态生成的对象
   * */
  createObjByKeyAndValueArray(keyAndValueArray) {
    if (keyAndValueArray.length % 2 == 0) {

      let obj = {};

      for (let i = 0; i < keyAndValueArray.length; i += 2) {

        obj[keyAndValueArray[i]] = (keyAndValueArray[i + 1] == null ? '' : keyAndValueArray[i + 1]);
      }
      return obj;
    }
    return null;
  },
  //对象深克隆
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  //按钮回调方法，鸡肋的方法，在按钮事件响应上调用该方法，传入将被回调的方法
  buttonStart(callback) {
    if (!args == null) {
      callback(arguments);
    } else {
      callback();
    }
  },
  //以数组的方式返回一个对象的所有属性
  getObjKeys() {
    let key;
    let keys = [];
    for (key in obj) {
      keys.push(key);
    }

    return keys;
  },
  //将对象转成key-value数组，将obj{key:value,key:value}(该obj中一定不能有数组)转换成[key1,value1,key2,value2,key3,value3...]的对象形式
  /**
   * @param obj 传入的需要被处理的对象，必须是{}
   * @param rejectKeyArray 封装时排除的key,一定是原对象中存在的key，否则不生效
   * @param renameKeyArray 封装时需要重命名的key，形式时[key1,value1,key2,value2...],其中key一定是原对象中存在的key，否则不生效，Value是被替换后的名称
   * @return 返回一个array[key1,value1..]的对象
   * */
  transferObjectToArray(obj, rejectKeyArray, renameKeyArray, autoToCamelFlag) {
    if (autoToCamelFlag) {
      autoToCamelFlag = true;
    } else {
      autoToCamelFlag = false;
    }

    //传入的对象不存在时
    if (obj == null || obj instanceof Array) {
      return [];
    }

    try {
      rejectKeyArray.length;
    } catch (e) {
      rejectKeyArray = [];
    }

    //拼接整理的结果数组字符串
    let resultArray = '';

    //获取对象的所有属性key并执行结果拼接
    for (let objKey in obj) {
      //执行属性剔除操作
      //如果剔除数组rejectKeyArray中不包含对象当前的key
      if (rejectKeyArray.indexOf(objKey) < 0) {
        resultArray = resultArray + '"' + objKey + '","' + obj[objKey] + '",';
      }
    }

    resultArray = '[' + resultArray.substring(0, resultArray.length - 1) + ']';

    //被处理的对象
    let resultArrayObj = JSON.parse(resultArray);

    try {
      //属性重命名处理
      for (let i = 0; i < renameKeyArray.length; i += 2) {

        // 用重命名数组中的原key逐步去匹配对象待替换的key
        for (let j = 0; j < resultArrayObj.length; j += 2) {
          //一旦适配到key，将原数组中的key替换成指定的key名称
          if (resultArrayObj[j] == renameKeyArray[i]) {
            resultArrayObj[j] = renameKeyArray[i + 1];
            break;
          }
        }
      }
    } catch (e) {
      // console.log("不存在需要重命名的属性.....");
    }
    //如果对象中的属性名有下划线将自动转成符合驼峰命名规则,默认不开启
    if (autoToCamelFlag) {
      // 去除数据的下划线，并将下划线的第一个字母变成大写
      // console.log("开始驼峰命名规则转换.....")
      for (let i = 0; i < resultArrayObj.length; i += 2) {
        let flag = true;
        while (flag) {
          let currLocation = resultArrayObj[i].indexOf('_');
          if (currLocation < 0) {
            flag = false;
          }
          resultArrayObj[i] = resultArrayObj[i].replace('_' + resultArrayObj[i].charAt(currLocation + 1), resultArrayObj[i].charAt(currLocation + 1)
            .toUpperCase());
        }
      }
    }
    return resultArrayObj;
  },
  //将对象转成key-value数组
  //本功能依赖方法 transferObjectToArray 、createObjByKeyAndValueArray
  /**
   * 将array[{key:value,key:value}]转换成[[key1,value1,key2,value2,key3,value3...].......]的对象形式
   * 将数组中的对象中的属性全部转换成驼峰命名规则然后返回
   * @param ObjectArray 传入的需要被处理的对象数组，必须是[{}...]
   * @param rejectKeyArray 封装时排除的key,一定是原对象中存在的key，否则不生效
   * @param renameByArray 封装时需要重命名的key，形式时[key1,value1,key2,value2...],其中key一定是每个原对象中存在的key，否则不生效，Value是被替换后的名称
   * @return 返回一个array[[key1,value1..]]的对象
   * */
  transferObjectsArrayToHumpObjectsArray(ObjectArray, rejectKeyArray, renameByArray, autoToCamelFlag) {
    //深克隆，避免影响到原对象的数据，根据条件转换成驼峰命名格式
    let tempArray = JSON.parse(JSON.stringify(ObjectArray));

    autoToCamelFlag = false;
    for (let i = 0; i < tempArray.length; i++) {
      if (autoToCamelFlag) {
        tempArray[i] = transferObjectToArray(tempArray[i], rejectKeyArray, renameByArray, autoToCamelFlag);
      }
      tempArray[i] = createObjByKeyAndValueArray(tempArray[i]);
    }
    return tempArray;
  },
  /**
   * sql查询方法封装，只需要一个sql语句即可完成数据返回
   * @param SQL 需要被执行的SQL语句
   * @return 返回list类型查询结果
   */
  async select(SQL) {
    console.log('----------------------------------------------------------------------------------------> Executing SQL');
    console.log('※※※※※※※※ Statement ---->  ' + SQL);
    let selectResult;
    try {
      await new Promise(function(resolve, reject) {
        //数据库查询
        db.all(SQL, (err, res) => {
          if (err) {
            resolve([]);
          } else {
            resolve(res);
          }
        });
      }).then((data) => {
        selectResult = data;
      });
      // 数据库查询
    } catch (e) {
      selectResult = [];
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      console.log('SQL 异常: SQL---->  ' + '[  ' + SQL + '  ]');
      console.log(e);
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

    }
    console.log('----------------------------------------------------------------------------------------< SQL Done');
    return selectResult;
  },
  /**
   * 如果调用者确定通过SQL查询出的结果为一个对象，则调用该方法
   * @param SQL 需要被执行的SQL
   * @return 返回一个对象，如果查询失败或查询不到则返回null
   * */
  async selectOne(SQL) {
    const tempValue = await this.select(SQL);
    if (tempValue != null && tempValue instanceof Array && tempValue.length == 1) {
      return tempValue[0];
    }
    return null;
  },
  async update(SQL) {
    console.log('----------------------------------------------------------------------------------------> Executing SQL');
    console.log('※※※※※※※※ Statement ---->  ' + SQL);
    let selectResult;
    try {
      await new Promise((resolve, reject) => {
        // 数据库查询
        db.all(SQL, (err, res) => {
          if (err) {
            resolve(-1);
          } else {
            resolve(res);
          }
        });
      }).then(data => {
        selectResult = data;
      });
    } catch (e) {
      selectResult = -1;
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      console.log('SQL 异常: SQL---->  ' + '[  ' + SQL + '  ]');
      console.log(e);
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    }
    console.log('----------------------------------------------------------------------------------------< SQL Done');
    return selectResult;
  },
  async insert(SQL) {
    return await this.update(SQL);
  },
  async delete(SQL) {
    return await this.update(SQL);
  },
  //console打印
  proxyConsole(objName, obj) {
    console.log('@@@@@@@@ Console Start >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('[ ' + objName + ' ]  ' + new Date());
    console.log(JSON.stringify(obj));
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Console End');
  },
  //###########################    DetailService    ################################
  /**
   * 根据数组生成一个workboot工作表格
   * @param array
   */
  generatorExcelWookbook(array, fileName) {
    this.downloadExl(array, 'xlsx', fileName);
  },
  // 下载功能
  saveAs(obj, fileName) {
    var tmpa = document.createElement('a');
    tmpa.download = fileName || '未命名';
    // 兼容ie
    if ('msSaveOrOpenBlob' in navigator) {
      window.navigator.msSaveOrOpenBlob(obj, '下载的文件名' + '.xlsx');
    } else {
      tmpa.href = URL.createObjectURL(obj);
    }
    tmpa.click();
    setTimeout(function() {
      URL.revokeObjectURL(obj);
    }, 100);
  },

  // 配置文件类型
  wopts: { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true },

  downloadExl(json, type, fileName) {

    let userId = localStorage.getItem('userId');
    let permFlag = true;
    if (userId == '1') {
      permFlag = false;
    }

    var tmpdata = {};
    // json.unshift({});
    // var keyMap = []; //获取keys
    // for (var k in tmpdata) {
    //     keyMap.push(k);
    //     json[0][k] = k;
    // }
    // var tmpdata = [{"A1":{"v":"测试文本"}}];//用来保存转换好的json
    // json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
    //     v: v[k],
    //     position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    // }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
    //     v: v.v
    // });

    //row
    for (let i = 0; i < json.length; i++) {
      //column
      for (let j = 0; j < json[i].length; j++) {

        //需要移除的列放这里
        if (i > 16 && j == 4) {
          continue;//去除供货周期
        }

        //需要控制权限的代码放这里
        //excel第2列的7到14行无权限时
        if(i>=6 && i<=13 && j==1 && !permFlag){
          this.createNewProp(tmpdata, this.generatorColumn(j) + (i + 1), { 'v': '--' });
        }else{
          this.createNewProp(tmpdata, this.generatorColumn(j) + (i + 1), { 'v': json[i][j] });
        }
      }
    }

    var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
    // //设置xlsx单元格样式
    // tmpdata["B1"].s = {
    //     font: {sz: 14, bold: true, color: {rgb: "FFFFAA00"}},
    //     fill: {bgColor: {indexed: 64}, fgColor: {rgb: "FFFF00"}}
    // };
    //合并单元格
    // tmpdata["!merges"] = [{
    //     s: {c: 1, r: 0},
    //     e: {c: 4, r: 0}
    // }];

    //创建工作簿对象tempWB
    var tmpWB = {
      //保存的表标题
      SheetNames: [ 'mySheet' ],
      Sheets: {
        'mySheet': Object.assign({},
          tmpdata,
          //内容
          {
            //设置填充区域
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1]
          })
      }
    };
    let tmpDown = new Blob([ this.s2ab(Excel.write(tmpWB,
      { bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
    )) ], {
      type: ''
    });
    this.saveAs(tmpDown, fileName + '.' + (this.wopts.bookType == 'biff2' ? 'xls' : this.wopts.bookType));
  },
  // 获取26个英文字母用来表示excel的列
  getCharCol(n) {
    let temCol = '',
      s = '',
      m = 0;
    while (n > 0) {
      m = n % 26 + 1;
      s = String.fromCharCode(m + 64) + s;
      n = (n - m) / 26;
    }
    return s;
  },
  s2ab(s) {
    if (typeof ArrayBuffer !== 'undefined') {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    } else {
      var buf = new Array(s.length);
      for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }
  },
  //列数应该不会超过26列
  generatorColumn(columnNo) {
    let alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
    return alphabet[columnNo];
  },
  //获取供货周期
  deliveryCycle(num, isOpenPOWER) {
    if (num == 0) {
      return '';
    } else if (num == 1) {
      return (isOpenPOWER ? '此部件预计3~5周供货' : ' part is expected to be delivered in 3~5 weeks');
    } else if (num == 2) {
      return (isOpenPOWER ? '此部件预计5~8周供货' : ' part is expected to be delivered in 5~8 weeks');
    } else if (num == 3) {
      return (isOpenPOWER ? '此部件预计>8周供货' : ' part is expected to be delivered within >8 weeks');
    }
  },
  async exportMachineConfService(machineId, isOpenPOWER) {

    let numAccur = 2;

    let systemSettings = await this.selectOne('select * from sys_setting');

    if (systemSettings.language == 0) {
      isOpenPOWER = true;
    } else {
      isOpenPOWER = false;
    }


    //当前系统设置的货币类型,isRMB表示货币标志，true人民币，false美元
    //货币种类0是人民币，1为美元

    let isRMB = (systemSettings.currency_type == 0 ? true : false);

    //设置人民币和美元的标志
    let currencyTypeStr = isRMB ? 'RMB' : 'USD';

    //清单的停产警告打印标志,默认不打印警告,该值在下面会根据数据库中的值进行修改
    let isDateWarn = false;

    //Excel表创建时间
    let now = new Date();

    //保存到Excel中的文档数据，这是一个二维数组，最外层的数组是excel的一张表，内侧的数组表示每一行的数据
    let machineConf = [];

    //machineId对应的机器
    let machineInfo = await this.selectOne('select * from machine_info where id=' + machineId);
    let templateId = this.tryGetValue(machineInfo, 'templete_id');

    //productInfo当前机器使用的产品
    let productId = this.tryGetValue(machineInfo, 'product_id');
    let productInfo = await this.selectOne('select * from product_info where id=' + productId);

    //solution当前机器所属的方案
    let solutionId = this.tryGetValue(machineInfo, 'solution_id');
    let solution = await this.selectOne('select * from solution where id=' + solutionId);
    let ship_date = this.tryGetValue(solution, 'ship_date');

    //如果产品供货日期比退市日期晚，则isDateWarn为true，表示生成停产警告，否则不生成
    isDateWarn = new Date(ship_date) - new Date(this.tryGetValue(productInfo, 'withdraw_date')) > 0 ? isDateWarn : true;

    //hardPriceDetail该机器的硬件价格详情，softPriceDetail该机器的软件价格详情
    let machinePriceDetailList = await this.select('select * from machine_price_detail where machine_id=' + machineId);
    let hardPriceDetail = this.getObjFromArrayByProp(machinePriceDetailList, 'configure_type', 1);
    let softPriceDetail = this.getObjFromArrayByProp(machinePriceDetailList, 'configure_type', 2);

    //当前机器的所有硬件
    let hardList = await this.select('' +
      ' select info.*,detail.component_count' +
      ' from product_programme_detail detail' +
      ' left join solution so                                on  so.id=detail.solution_id' +
      ' left join component_category cate                    on  cate.id =detail.category_id' +
      ' left join component_memory mem                       on  mem.id =detail.component_id         and detail.category_id=2' +
      ' left join component_iocard io                        on io.id   =detail.component_id         and detail.category_id=6' +
      ' left join component_disk disk                        on disk.id =detail.component_id         and detail.category_id=1' +
      ' left join component_cpu cpu                          on  cpu.id  =detail.component_id        and detail.category_id=3' +
      ' left join component_power power                      on  power.id=detail.component_id        and detail.category_id=5' +
      ' left join component_backplane back                   on  back.id =detail.component_id        and detail.category_id=7' +
      ' left join component_powerline line                   on line.id=detail.component_id          and detail.category_id=8' +
      ' left join component_cpu_activation ac                on ac.id=detail.component_id            and detail.category_id=11' +
      ' left join component_other other                      on  other.id=detail.component_id        and detail.category_id=17' +
      ' left join component_barebone bb                      on  bb.id=detail.component_id           and detail.category_id=16' +
      ' left Join component_powerconversion con              on con.id=detail.component_id           and detail.category_id=22' +
      ' left Join component_expansioncase exp_case           on exp_case.id=detail.component_id      and detail.category_id=23' +
      ' left Join component_expansionflesh exp_flesh         on exp_flesh.id=detail.component_id     and detail.category_id=24' +
      ' left Join component_connectingline exp_line          on exp_line.id=detail.component_id      and detail.category_id=25' +
      ' left Join component_disk_expansioncase disk_exp_case on disk_exp_case.id=detail.component_id and detail.category_id=26' +
      ' left Join component_disk_modeoption disk_mode        on disk_mode.id=detail.component_id     and detail.category_id=27' +
      ' left join component_base_info info                   on  info.id=mem.base_info_id' +
      '                   or  info.id=io.base_info_id' +
      '                   or  info.id=disk.base_info_id' +
      '                   or  info.id=cpu.base_info_id' +
      '                   or  info.id=power.base_info_id' +
      '                   or  info.id=back.base_info_id' +
      '                   or  info.id=line.base_info_id' +
      '                   or  info.id=other.base_info_id' +
      '                   or  info.id=ac.base_info_id' +
      '                   or  info.id=bb.base_info_id' +
      '                   or info.id=exp_case.base_info_id' +
      '                   or info.id=exp_flesh.base_info_id' +
      '                   or info.id=exp_line.base_info_id' +
      '                   or info.id=disk_exp_case.base_info_id' +
      '                   or info.id=disk_mode.base_info_id' +
      '                   or info.id=con.base_info_id' +
      ' where detail.template_id=\'' + templateId + '\'' +
      ' and   detail.category_id in (1,2,3,5,6,7,8,11,16,17,23,24,25,26,27,22)' +
      ' and   detail.solution_id=\'' + solutionId + '\'' +
      ' and   detail.product_id=\'' + productId + '\'' +
      ' and   detail.machine_id=\'' + machineId + '\'');

    //当前机器的所有软件
    let softwareList = await this.select('SELECT T1.software_category,cs.*,' +
      ' (SELECT machine_model FROM product_info WHERE id =' + productId + ') AS type,(SELECT machine_submodel FROM product_info WHERE id =' + productId + ') AS model,' +
      ' (SELECT component_count FROM product_programme_detail WHERE category_id = 11 AND solution_id = ' + solutionId + ' AND template_id = ' + templateId + ' AND machine_id =' + machineId + ' AND product_id = ' + productId + ' ) as cpuActiveNum,' +
      ' (SELECT component_count FROM product_programme_detail WHERE category_id = 13 AND solution_id = ' + solutionId + ' AND template_id = ' + templateId + ' AND machine_id =' + machineId + ' AND product_id = ' + productId + ' ) as logicNum' +
      ' FROM component_software cs' +
      ' INNER JOIN' +
      ' (SELECT ss.carry_software_id,ss.software_category,ss.qty FROM product_programme_detail ppd' +
      '       INNER JOIN software_software ss ON ppd.component_id = ss.choice_software_id' +
      '       WHERE ppd.category_id IN (21,14,15,42) AND ppd.solution_id =' + solutionId + ' ' +
      '       AND ppd.template_id = ' + templateId + ' AND ppd.machine_id =' + machineId + ' AND ppd.product_id =' + productId + ' ORDER BY  ss.carry_software_id' +
      ') T1 ON T1.carry_software_id = cs.id' +
      ' WHERE cs.software_type != 3' +
      ' UNION' +
      ' SELECT  ppd.category_id AS software_category,cs.*,' +
      '            (SELECT machine_model FROM product_info WHERE id =' + productId + ') AS type,' +
      '            (SELECT machine_submodel FROM product_info WHERE id =' + productId + ' ) AS model,' +
      '            (SELECT component_count FROM product_programme_detail WHERE category_id = 11' +
      '       AND solution_id =' + solutionId + ' AND template_id =' + templateId + ' AND machine_id =' + machineId + ' AND product_id =' + productId + ' ) as cpuActiveNum,' +
      '      (SELECT component_count FROM product_programme_detail WHERE category_id = 13' +
      '      AND solution_id =' + solutionId + ' AND template_id =' + templateId + ' AND machine_id =' + machineId + '  AND product_id =' + productId + ' ) as logicNum' +
      ' FROM component_software cs LEFT JOIN product_programme_detail ppd' +
      ' ON cs.id = ppd.component_id' +
      ' WHERE ppd.category_id IN (18,19,20) AND ppd.solution_id =' + solutionId + ' AND ppd.template_id = ' + templateId +
      ' AND ppd.machine_id = ' + machineId + ' AND ppd.product_id =' + productId);

    let softwareListData = this.dealSoftwareData(softwareList);

    //Excel row1 info
    machineConf.push([ '浪潮商用机器有限公司产品报价单' ]);

    //Excel row2 info
    machineConf.push([ '产品名称', this.tryGetValue(productInfo, 'product_name') ]);

    //Excel row3 info
    machineConf.push([ '表单生成日期', now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() ]);

    //Excel row4 待完善，暂时为空
    machineConf.push([ 'CRM特价单号', '' ]);

    //Excel row5 空行
    machineConf.push([]);

    //Excel row6 info
    machineConf.push([ '本产品售价', '合计金额', '币种' ]);

    //Excel row7
    let hardListPrice = isRMB ? this.tryGetValue(hardPriceDetail, 'list_price') : this.tryGetValue(hardPriceDetail, 'list_dollar_price');
    hardListPrice = this.numDeal(hardListPrice);
    machineConf.push([ '硬件列表价', hardListPrice, currencyTypeStr ]);


    //Excel row8
    let hardListPriceDiscount = isRMB ? this.tryGetValue(hardPriceDetail, 'discount_price') : this.tryGetValue(hardPriceDetail, 'discount_dollar_price');
    hardListPriceDiscount = this.numDeal(hardListPriceDiscount);
    machineConf.push([ '硬件折后价（未税）', hardListPriceDiscount, currencyTypeStr ]);


    //Excel row9
    let softListPrice = isRMB ? this.tryGetValue(softPriceDetail, 'list_price') : this.tryGetValue(softPriceDetail, 'list_dollar_price');
    softListPrice = this.numDeal(softListPrice);
    machineConf.push([ '软件列表价', softListPrice, currencyTypeStr ]);

    //Excel row10
    let softListPriceDiscount = isRMB ? this.tryGetValue(softPriceDetail, 'discount_price') : this.tryGetValue(softPriceDetail, 'discount_dollar_price');
    softListPriceDiscount = this.numDeal(softListPriceDiscount);
    machineConf.push([ '软件折后价（未税）', softListPriceDiscount, currencyTypeStr ]);

    //TODO Excel row11 待完善，分类4的价格总和，暂时没有，留空
    let serviceListPrice = 0;
    serviceListPrice = this.numDeal(serviceListPrice);
    machineConf.push([ '服务列表价', serviceListPrice, currencyTypeStr ]);

    //TODO Excel row12 待完善，分类4的自定义折后价总和，暂时没有，留空
    let serviceListPriceDiscount = 0;
    serviceListPriceDiscount = this.numDeal(serviceListPriceDiscount);
    machineConf.push([ '服务折后价（未税）', serviceListPriceDiscount, currencyTypeStr ]);

    //TODO Excel row13 待完善，分类1+2+3+4的价格总和
    machineConf.push([ '列表价总计', ((hardListPrice * 1) + (softListPrice * 1) + (serviceListPrice * 1)).toFixed(2), currencyTypeStr ]);

    //TODO Excel row14 待完善，分类1+2+3+4的自定义折后价总和
    machineConf.push([ '折后价总计（未税）', ((hardListPriceDiscount * 1) + (softListPriceDiscount * 1) + (serviceListPriceDiscount * 1)).toFixed(2), currencyTypeStr ]);

    //Excel row15 空行
    machineConf.push([]);

    if (isOpenPOWER) {
      //Excel row16
      machineConf.push([ '配置单' ]);
    } else {
      //Excel row16
      machineConf.push([ '配置单' ]);
    }

    //Excel row17 空行
    machineConf.push([]);

    let dataListResult;

    //924机器
    if ((productInfo.machine_model + '-' + productInfo.machine_submodel).toUpperCase() == '9009-42A') {
      dataListResult = await cpy.exportExcel(isOpenPOWER, machineInfo.remark_name, '', productId, solutionId, templateId, machineId);
      //950机器
    } else if ((productInfo.machine_model + '-' + productInfo.machine_submodel).toUpperCase() == '9040-MR9') {
      dataListResult = await cpy950.exportExcel(isOpenPOWER, machineInfo.remark_name, '', productId, solutionId, templateId, machineId);
      //如果既不是924也不是950尝试使用这两种方案进行导出，如果导出不成功则需要进行特定修改
    } else {
      //尝试使用924的
      try {
        dataListResult = await cpy.exportExcel(isOpenPOWER, machineInfo.remark_name, '', productId, solutionId, templateId, machineId);
      } catch (e) {
        try {
          dataListResult = await cpy950.exportExcel(isOpenPOWER, machineInfo.remark_name, '', productId, solutionId, templateId, machineId);
        } catch (e) {
          console.log('---------导出失败------------');
        }
      }

    }

    for (let i = 0; i < dataListResult.length; i++) {
      machineConf.push(dataListResult[i]);
    }

    //调用文档生成方法
    console.log(JSON.stringify(machineConf));
    let workboot = this.generatorExcelWookbook(machineConf, machineInfo.remark_name);
  },
  //处理查询到的软件数据
  dealSoftwareData(res) {
    let tempData = [];
    let typeModelList = [];
    let hpo = [];
    let data = [ hpo, tempData, typeModelList ];
    //处理选择AIX操作系统，带0265，2146（AIX）或2147（Linux），9440，5228
    for (let i = 0; i < res.length; i++) {
      let obj = {
        software_FC: res[i].software_FC,
        component_count: '',
        software_des: res[i].software_des,
        software_desCN: res[i].software_desCN,
        ui_status: res[i].ui_status,
        withdraw_date: res[i].withdraw_date,
        purchase: res[i].purchase,
        category_id: res[i].category_id,
        software_PN: res[i].software_PN,
        name: res[i].software_category,
        nameCN: '',
        template_name: res[i].software_FC,
        component_id: res[i].software_PN,
        Classify: res[i].Classify
      };
      if (res[i].Classify == res[i].type + '-' + res[i].model) {
        //逻辑分区
        if (res[i].category_id == 13) {
          obj.component_count = res[i].logicNum;
          //操作系统
        } else if (res[i].category_id == 14) {
          obj.component_count = 1;
        } else {
          obj.component_count = res[i].cpuActiveNum;
        }
        typeModelList.push(obj);
        continue;
      }
      //硬件 HPO
      if (res[i].category_id == 33 || res[i].category_id == 34) {
        //执行则不需要显示HPO
        // if (!hpoExportFlag) {
        //     continue;
        // }
        obj.component_count = 1;
        hpo.push(obj);
        continue;
      }
      if (res[i].purchase != undefined && res[i].purchase != null
        && res[i].purchase != '' && res[i].purchase == 'N/C') {
        obj.component_count = 1;
      } else {
        obj.component_count = res[i].cpuActiveNum;
      }
      tempData.push(obj);
    }
    return data;
  },
  //将传入的数据处理为数值结果，会将source保留两位小数
  numDeal(source) {
    if (source == null || source == 'NaN' || source == 'N/C' || source == undefined || source == 0) {
      return 0.00;
    }

    if (isNaN(source)) {
      source = eval(source + '*1');

      if (isNaN(source)) {
        return 0.00;
      } else {
        return (source * 1).toFixed(2);
      }
    }
    return parseFloat(source + '')
      .toFixed(2);
  },
//将传入的数据处理为数值结果
  numDealUnToFixed(source) {
    if (source == null || source == 'NaN' || source == 'N/C' || source == undefined || source == 0) {
      return 0;
    }

    if (isNaN(source)) {
      source = eval(source + '*1');

      if (isNaN(source)) {
        return 0;
      } else {
        return (source * 1);
      }
    }
    return source;
  },
  //折扣计算
  discountCompute(discount, orginPrice, isRMB) {
    discount = eval(discount + '* 0.01');
    //折扣为0或为1都是原价！
    if (discount == 0 || discount == 1) {
      return orginPrice;
    } else {
      return (discount * orginPrice).toFixed(2);
    }
  },
  //折扣显示处理
  showDiscount(isRMB, discount) {
    discount = this.numDealUnToFixed(discount) * 1.0;
    if (isRMB) {
      return discount.toFixed(2) + '%';
    } else {
      if (discount == 0) {
        return 0.00.toFixed(2) + '%';
      } else {
        return ((1 - (discount * 0.01)) * 100.0).toFixed(2) + '%';
      }
    }
  },
  //excel价格显示权限
  priceShowPerm(perm, data) {
    if (perm) {
      return data;
    }
    return '--';
  }
};

