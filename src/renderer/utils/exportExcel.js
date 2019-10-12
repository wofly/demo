import XLSX from "xlsx";
// 配置文件类型
const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true };
const exportExcel = (machineName,json, type) => {
    let convertJson1 = convertJson(json);
    let outputPos = convertJson1.outputPos;
    let convertData = convertJson1.convertData;
    execute(machineName,outputPos,convertData,type);
}

/**
 * 分别组装excel中三部分
 * @param dataList
 * @param num  可选值：1,3,5
 * @returns {[]}
 */
function assembleData(dataList,num){
    let tmpdata = dataList[0];
    dataList.unshift({});//空出标题等行
    let keyMap = []; //获取keys
    for (let k in tmpdata) {
        keyMap.push(k);
        dataList[0][k] = k;
    }
    let convertData = [];//用来保存转换好的json
    dataList.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + num)
    }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => convertData[v.position] = {
        v: v.v
    });
    return convertData;
}

function convertJson(json){
    //-------------------------------solutionList----------------------------
    let solutionList = json.solutionList;
    let convertData = assembleData(solutionList,1);
    //-------------------------------fixedList-------------------------------
    let fixedList = json.fixedList;
    let convertData0 = assembleData(fixedList,3);
    //-------------------------------headList--------------------------------
    let headList = json.headList;
    let convertData1 = assembleData(headList,5);
    //-------------dataList ----------------------
    let dataList = json.dataList;
    let convertData2 = assembleData(dataList,7);
    //---------------------------------------------------
    for(let obj0 in convertData0){
        convertData[obj0] = convertData0[obj0];
    }
    for(let obj1 in convertData1){
        convertData[obj1] = convertData1[obj1];
    }
    for(let obj2 in convertData2){
        convertData[obj2] = convertData2[obj2];
    }
    let outputPos = Object.keys(convertData); //设置区域,比如表格从A1到D10
    return {outputPos:outputPos,convertData:convertData};
}
function execute(machineName,outputPos,tmpdata,type){
    let tmpWB = {
        SheetNames: ['mySheet'], //保存的表标题
        Sheets: {
            'mySheet': Object.assign({},
                tmpdata, //内容
                {
                    '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                })
        }
    };

    let tmpDown = new Blob([s2ab(XLSX.write(tmpWB,
        { bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
    ))], {
        type: ""
    });
    let timestamp = (new Date()).getTime();
    saveAs(tmpDown, machineName+'-'+"IPSConfiguration" +timestamp+ '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
}

// 下载功能
function saveAs(obj, fileName) {
    let tmpa = document.createElement("a");
    let timestamp = (new Date()).getTime();
    tmpa.download = fileName || "未命名";
    // 兼容ie
    if ("msSaveOrOpenBlob" in navigator) {
        window.navigator.msSaveOrOpenBlob(obj, "ips-excel"+ timestamp + ".xlsx");
    } else {
        tmpa.href = URL.createObjectURL(obj);
    }
    tmpa.click();
    setTimeout(function() {
        URL.revokeObjectURL(obj);
    }, 100);
}

// 获取26个英文字母用来表示excel的列
function getCharCol(n) {
    let temCol = '',
        s = '',
        m = 0
    while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
    }
    return s
}
function s2ab(s) {
    if (typeof ArrayBuffer !== 'undefined') {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    } else {
        let buf = new Array(s.length);
        for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}

export default {
    exportExcel
};