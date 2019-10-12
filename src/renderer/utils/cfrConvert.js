import moment from 'moment';
import CfrConstants from "./cfrConstants";
const ASCIICODETABLE = [ 0x20, 255, 0x23, 67, 0x24, 31, 0x25, 52, 0x26, 28, 0x27, 73, 0x28, 22, 0x29,
    37, 0x2A, 34, 0x2B, 25, 0x2C, 49, 0x2D, 43, 0x2E, 16, 0x2F, 46, 0x30, 157, 0x31, 160, 0x32, 163, 0x33, 166,
    0x34, 169, 0x35, 172, 0x36, 175, 0x37, 178, 0x38, 181, 0x39, 184, 0x3A, 64, 0x3B, 40, 0x3C, 19, 0x3D, 76,
    0x3E, 58, 0x3F, 61, 0x40, 70, 0x41, 79, 0x42, 82, 0x43, 85, 0x44, 88, 0x45, 91, 0x46, 94, 0x47, 97, 0x48,
    100, 0x49, 103, 0x4A, 106, 0x4B, 109, 0x4C, 112, 0x4D, 115, 0x4E, 118, 0x4F, 121, 0x50, 124, 0x51, 127,
    0x52, 130, 0x53, 133, 0x54, 136, 0x55, 139, 0x56, 142, 0x57, 145, 0x58, 148, 0x59, 151, 0x5A, 154, 0x5F,
    55 ];
let m_sError = null;

const cfrConvert = (csvStr,machineName) => {
    return new Promise((resolve, reject) => {
        strConvertCfr(csvStr,machineName);
    });
};

function getErrMsg() {
    return m_sError;
}

function strConvertCfr(csvStr,machineName){
    let listOfRecoders = [];
    let strArray = csvStr.split('\n');
    for (let i = 0; i < strArray.length; i++) {
        let arFields = getCsvFieldArray(strArray[i]);
        if ((arFields != undefined) && (arFields.length > 0)) {
            listOfRecoders.push(arFields);
        }
    }
    //生成CFR
    let sCfr = '';
    let listOfHistory = [];
    let listOfProposedRecoders = [];
    let isSort = true;
    sCfr = createCfr(listOfRecoders, listOfHistory, listOfProposedRecoders,isSort);
    saveAs(sCfr,machineName);
}

function createCfr(listOfRecords,listOfBaseRecords,listOfProposedRecords,isSort){
    let i = 0;
    let cfrList = [];
    let isHeader = false;
    let arFields = listOfRecords[i];
    if(!isEmpty(arFields[0])){
        if(arFields[0] == CfrConstants.CfrConstants.CSV_CFR[0]){
            isHeader = true;
            i++;
            arFields = listOfRecords[i];
        }
    }
    let iLine00 = cfrList.length;
    cfrList.push(createRecord00(arFields));
    cfrList.push(createRecord03(arFields));

    let iLine05 = cfrList.length;

    let arRecords05 = createRecord05('');

    let isNewOrder = false;
    let sOrderType = arFields[CfrConstants.CfrConstants.CFR_CODE];
    if (isEmpty(sOrderType)) {
        sOrderType = "1";
        isNewOrder = true;
    } else if (compare(sOrderType,CfrConstants.CfrConstants.CFR_CODE_NEW)) {
        sOrderType = "1";
        isNewOrder = true;
    } else if (compare(sOrderType,CfrConstants.CfrConstants.CFR_CODE_MES)) {
        sOrderType = "4";
    } else if (compare(sOrderType,CfrConstants.CfrConstants.CFR_CODE_MES_BASE)) {
        sOrderType = "2";
    } else if (compare(sOrderType,CfrConstants.CfrConstants.CFR_CODE_MES_PROPOSED)) {
        sOrderType = "3";
    }
    //处理数据
    let j = 0;
    let isOEM = false;
    let sCRAD = '';
    //systems ---> loop
    i++;
    if (isHeader) i++;
    let iSystemSeq = 0;
    while (i < listOfRecords.length) {
        iSystemSeq++;
        arFields = listOfRecords[i];
        cfrList.push(createRecord07(arFields));
        // base order
        cfrList = createCfrHistory(cfrList, listOfBaseRecords,null, iSystemSeq, isSort);
        // proposed order
        cfrList = createCfrHistory(cfrList, null, listOfProposedRecords, iSystemSeq, isSort);

        cfrList.push(createRecord01(sOrderType));
        let sSystemType = arFields[CfrConstants.CfrConstants.SYS_MAIN_TYPE];
        i++;
        if (isHeader) i++;

        //排序 排序
        // ------ keep Hardware line in same sequence and sort sublines, sort Software lines and sublines, then sort Services lines and sublines
        // ------ lines -> loop
        listOfRecords = isOpenSorted(i,j,arFields,listOfRecords,isSort);
        // ------ sort
        //lines ---> loop
        let isFirstLine = true;
        let isFirstLineHW = false;
        let isLineNEW = false;
        while (i < listOfRecords.length) {
            arFields = listOfRecords[i];
            if (!isNumber(arFields[CfrConstants.CfrConstants.LINE_NO].charAt(0))) {
                i--;
                break;
            }
            if (isFirstLine) {
                if (isEmpty(sSystemType)) {
                    sSystemType = arFields[CfrConstants.CfrConstants.LINE_MTM];
                    if ((!isEmpty(sSystemType)) && (sSystemType.length > 4)) {
                        sSystemType = sSystemType.substring(0, 4);
                    }
                }
            }
            let sProductType = arFields[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE];
            if (isEmpty(sProductType)) {
                sProductType = getProductType(arFields[CfrConstants.CfrConstants.LINE_MTM]);
            }
            if (!isEmpty(arFields[CfrConstants.CfrConstants.LINE_TYPE])) {
                if (compare(CfrConstants.CfrConstants.LINE_TYPE_NEW, arFields[CfrConstants.CfrConstants.LINE_TYPE])) {
                    isLineNEW = true;
                }
            }
            if ((isFirstLine) && (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE ==  sProductType)) {
                isFirstLineHW = true;
            }
            let sBufLine = '';
            let iLine = cfrList.length;
            //------------------------------------------------------------
            if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE == sProductType) {
                if (isNewOrder) {
                    // test arRecords[LINE_TYPE] = LINE_TYPE_NEW; ???
                    sBufLine = createRecord08(arFields);
                } else {
                    sBufLine = createRecord19(arFields);
                }
                cfrList.push(sBufLine);
                cfrList.push(createRecord95(arFields, isNewOrder, isFirstLine, isFirstLineHW, sProductType, sSystemType));
                if (!isNewOrder) {
                    if (!isEmpty(arFields[CfrConstants.CfrConstants.LINE_TOTYPE])) {
                        cfrList.push(createRecord95GroupTo(arFields));
                    }
                }
            } else if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE == sProductType) {
                if (isNewOrder || isLineNEW) {
                    sBufLine = createRecord47(arFields);
                } else {
                    sBufLine = createRecord50(arFields);
                }
                cfrList.push(sBufLine);
                cfrList.push(createRecord95(arFields, isNewOrder, isFirstLine, isFirstLineHW, sProductType, sSystemType));
            }  else if ((CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES == sProductType) || (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICEPAC == sProductType)) {
                sBufLine = createRecord38(arFields);
                cfrList.push(sBufLine);
                cfrList.push(createRecord95(arFields, isNewOrder, isFirstLine, isFirstLineHW, sProductType, sSystemType));
            }

            if (isFirstLine) {
                isFirstLine = !isFirstLine;
                if (isEmpty(sCRAD)) {
                    sCRAD = arFields[CfrConstants.CfrConstants.LINE_CRAD];
                    if (isEmpty(sCRAD)) {
                        sCRAD = getDate(14);
                        sCRAD = sCRAD.substring(0, 4) + "/" + sCRAD.substring(4, 6) + "/" + sCRAD.substring(6, 8);
                    }
                }
            }

            i++;
            //sublines ---> loop
            while (i < listOfRecords.length) {
                arFields = listOfRecords[i];
                if (!isValidLineNo(arFields)) {
                    i--;
                    break;
                }

                if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE == sProductType) {
                    if (isNewOrder) {
                        // test arRecords[LINE_TYPE] = LINE_TYPE_NEW; ???
                        sBufLine = addToRecord08(sBufLine, arFields);
                    } else {
                        sBufLine = addToRecord19(sBufLine, arFields);
                    }
                    if ((arFields[CfrConstants.CfrConstants.LINE_FEATURE].startsWith("777")) || (arFields[CfrConstants.CfrConstants.LINE_FEATURE].startsWith("0006"))) {
                        isOEM = true;
                    }
                } else if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE == sProductType) {
                    if (isNewOrder || isLineNEW) {
                        sBufLine = addToRecord47(sBufLine, arFields);
                    } else {
                        sBufLine = addToRecord50(sBufLine, arFields);
                    }
                } else if ((CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES == sProductType) || (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICEPAC == sProductType)) {
                    sBufLine = addToRecord38(sBufLine, arFields);
                }

                cfrList[iLine] = sBufLine;

                cfrList.push(createRecord96(arFields));

                i++;
            } // subline
            i++;
        } // line
        i++;
        if (isHeader) i++;
    } // system


    if (isOEM) {
        let sBuf00 = cfrList[iLine00];
        //GSA pricing
        sBuf00 = setRecordField(sBuf00, "3", 38, 38, false);
        cfrList[iLine00] =  sBuf00;
        // cfrList.set(iLine00, sBuf00);
    }

    if (!isEmpty(sCRAD)) {
        arRecords05 = createRecord05(sCRAD);
        for (let k = 0; k < arRecords05.length; k++) {
            cfrList.splice(iLine05+ k, 0, arRecords05[k]);
            // cfrList.set(iLine05 + k, arRecords05[k]);
        }
    }


    cfrList.push("98" + rightPad(cfrList.length + 1 + '', 5));
    let lCheckSum = parseInt('0L');
    let sBufCfr = '';
    for (let s=0; s<cfrList.length; s++) {
        lCheckSum = computeChecksum(cfrList[s], lCheckSum);
        sBufCfr += cfrList[s];
        sBufCfr += "\n";
    }
    let sFinalCheckSum = computeChecksum(null, lCheckSum);
    sBufCfr = sBufCfr + "99" + rightPad(sFinalCheckSum, 10);
    sBufCfr += "\n";
    return sBufCfr;
}

function isOpenSorted(i,j,arFields,listOfRecords,isSort) {
    if (isSort) {

        let mapHardware = new Map();
        let mapSoftware = new Map();
        let mapServices = new Map();

        j = i;
        while (j < listOfRecords.length) {

            arFields = listOfRecords[j];
            if (!isNumber(arFields[CfrConstants.CfrConstants.LINE_NO].charAt(0))) {
                j--;
                break;
            }
            let sProductType = arFields[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE];
            if (isEmpty(sProductType)) {
                sProductType = getProductType(arFields[CfrConstants.CfrConstants.LINE_MTM]);
            }
            let sMTM = arFields[CfrConstants.CfrConstants.LINE_MTM] + "_" + prefixInteger(j,5)+ "_";
            if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE == sProductType) {
                sMTM = prefixInteger(j,5)+ "_" + arFields[1] + "_";
                mapHardware.set(sMTM + "A0000", arFields);
            } else if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE == sProductType) {
                mapSoftware.set(sMTM + "A0000", arFields);
            } else if ((CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES == sProductType) || (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICEPAC == sProductType)) {
                mapServices.set(sMTM + "A0000", arFields);
            }
            j++;
            // ------ sublines -> loop
            while (j < listOfRecords.length) {
                arFields = listOfRecords[j];
                if (!isValidLineNo(arFields)) {
                    j--;
                    break;
                }
                let sSign = "B";
                if ((!isEmpty(arFields[CfrConstants.CfrConstants.LINE_QTY])) && (arFields[CfrConstants.CfrConstants.LINE_QTY].startsWith("-"))) {
                    sSign = "A";
                }
                if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE == sProductType) {
                    mapHardware.set(sMTM + sSign + arFields[CfrConstants.CfrConstants.LINE_FEATURE], arFields);
                } else if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE == sProductType) {
                    mapSoftware.set(sMTM + sSign + arFields[CfrConstants.CfrConstants.LINE_FEATURE], arFields);
                } else if ((CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES == sProductType) || (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICEPAC == sProductType)) {
                    mapServices.set(sMTM + sSign + arFields[CfrConstants.CfrConstants.LINE_FEATURE], arFields);
                }
                j++;
            } // ------ subline
            j++;
        } //  ------ line
        //硬件map排序
        let hardwareObj= Array.from(mapHardware);
        hardwareObj.sort(function(a,b){return a[0].localeCompare(b[0])}).map(o => (o[0], o[1]));
        //软件map排序
        let softwareObj= Array.from(mapSoftware);
        softwareObj.sort(function(a,b){return a[0].localeCompare(b[0])});
        //服务map排序
        let servicesObj= Array.from(mapServices);
        servicesObj.sort(function(a,b){return a[0].localeCompare(b[0])});

        j = i;
        for (let k in hardwareObj) {
            let strings = hardwareObj[k][1];
            listOfRecords[j] = strings;
            j++;
        }
        for (let m in softwareObj) {
            let strings = softwareObj[m][1];
            listOfRecords[j] = strings;
            j++;
        }
        for (let n in servicesObj) {
            let strings = servicesObj[n][1];
            listOfRecords[j] = strings;
            j++;
        }
        return listOfRecords;
    }
    return listOfRecords;
}

/**
 * 生成 base order OR propused order
 * @param cfrList
 * @param listOfBaseRecords
 * @param listOfProposedRecords
 * @param iSystemSeq
 * @param isSort
 * @returns {*}
 */
function createCfrHistory (cfrList, listOfBaseRecords, listOfProposedRecords, iSystemSeq,isSort){
    let listOfRecords = null;
    let isBase = true;
    if ((listOfBaseRecords != null) && (listOfBaseRecords.length > 0)) {
        listOfRecords = listOfBaseRecords;
        isBase = true;
    } else if ((listOfProposedRecords != null) && (listOfProposedRecords.length > 0)) {
        listOfRecords = listOfProposedRecords;
        isBase = false;
    } else {
        // ??
        return cfrList;
    }

    let iCfrListStartSize = cfrList.length;
    let isHistory = false;
    let i = 0;
    let isHeader = false;
    let arFields = listOfRecords[i];
    if (!isEmpty(arFields[0])) {
        if (CfrConstants.CfrConstants.CSV_CFR[0] == arFields[0]) {
            isHeader = true;
            i++;
            arFields = listOfRecords[i];
        }
    }
    let sOrderType = arFields[CfrConstants.CFR_CODE];
    if (isBase) {
        if (compare(sOrderType,CfrConstants.CfrConstants.CFR_CODE_MES_BASE)) {
            sOrderType = "2";
        } else {
            //not expected...
            return cfrList;
        }
    } else {
        if (compare(sOrderType,CfrConstants.CfrConstants.CFR_CODE_MES_PROPOSED)) {
            sOrderType = "3";
        } else {
            //not expected...
            return cfrList;
        }
    }

    // ????
    //if (iSystemSeq == 1)
    //	cfrList.add(createRecord01(sOrderType));

    //systems ---> move to the one needed for history
    i++;
    if (isHeader) i++;
    let iCfrSystemSeq = 0;
    let sSystemType = '';
    while (i < listOfRecords.length) {
        arFields = listOfRecords[i];
        if ((arFields != undefined) && (arFields != null) && (arFields.length > CfrConstants.CfrConstants.SYS_SEQ)) {
            let sSystemSeq = arFields[CfrConstants.CfrConstants.SYS_SEQ];
            if (!isEmpty(sSystemSeq)) {
                //if (!sSystemSeq.equals(CfrConstants.CfrConstants.CSV_SYSTEM[CfrConstants.CfrConstants.SYS_SEQ])) {
                if (sSystemSeq.startsWith(CfrConstants.CfrConstants.TABLE_SYSTEM)) {
                    iCfrSystemSeq++;
                    if (iCfrSystemSeq == iSystemSeq) {
                        sSystemType = arFields[CfrConstants.CfrConstants.SYS_MAIN_TYPE];
                        break;
                    }
                }
                //}
            }
        }
        i++;
    } // system

    if (iCfrSystemSeq == iSystemSeq) {
        cfrList.push(createRecord01(sOrderType));
    } else {
        //skip
        //i = listOfRecords.size();
        return cfrList;
    }

    i++;
    if (isHeader) i++;

    let j = 0;
    // ------ keep Hardware line in same sequence and sort sublines, sort Software lines and sublines, then sort Services lines and sublines
    // ------ lines -> loop
    listOfRecords = isOpenSorted(i,j,arFields,listOfRecords,isSort);
    // ------ sort

    //lines ---> loop
    let isFirstLine = true;
    let isFirstLineHW = false;
    while (i < listOfRecords.length) {
        arFields = listOfRecords[i];
        if (!isNumber(arFields[CfrConstants.CfrConstants.LINE_NO].charAt(0))) {
            i--;
            break;
        }
        if (isFirstLine) {
            if (isEmpty(sSystemType)) {
                sSystemType = arFields[CfrConstants.CfrConstants.LINE_MTM];
                if ((!isEmpty(sSystemType)) && (sSystemType.length > 4)) {
                    sSystemType = sSystemType.substring(0, 4);
                }
            }
        }
        let sProductType = arFields[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE];
        if (isEmpty(sProductType)) {
            sProductType = getProductType(arFields[CfrConstants.CfrConstants.LINE_MTM]);
        }
        if ((isFirstLine) && (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE == sProductType)) {
            isFirstLineHW = true;
        }

        let sBufLine = '';
        let iLine = cfrList.length;
        if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE== sProductType) {
            sBufLine = createRecord08(arFields);
            if (isBase) {
                insertStr(sBufLine,0,'2');
                insertStr(sBufLine,1,'5');
            } else {
                insertStr(sBufLine,0,'2');
                insertStr(sBufLine,1,'6');
            }
            cfrList.push(sBufLine);
            cfrList.push(createRecord95(arFields, false, isFirstLine, isFirstLineHW, sProductType, sSystemType));
        } else if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE == sProductType) {
            sBufLine = createRecord47(arFields);
            if (isBase) {
                insertStr(sBufLine,0,'4');
                insertStr(sBufLine,1,'9');
            } else {
                insertStr(sBufLine,0,'4');
                insertStr(sBufLine,1,'8');
            }
            cfrList.push(sBufLine);
            cfrList.push(createRecord95(arFields, false, isFirstLine, isFirstLineHW, sProductType, sSystemType));
        }

        isHistory = true;
        if (isFirstLine) {
            isFirstLine = !isFirstLine;
        }

        i++;
        //sublines ---> loop
        while (i < listOfRecords.length) {
            arFields = listOfRecords[i];
            if (!isValidLineNo(arFields)) {
                i--;
                break;
            }

            if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE == sProductType) {
                sBufLine = addToRecord08(sBufLine, arFields);
            } else if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE == sProductType) {
                sBufLine = addToRecord47(sBufLine, arFields);
            }
            cfrList[iLine] = sBufLine;

            cfrList.push(createRecord96(arFields));

            i++;
        } // subline

        i++;
    } // line


    if (!isHistory) {
        while (cfrList.length > iCfrListStartSize) {
            cfrList.splice(cfrList.length - 1, 1);
        }
    }
    return cfrList;

}

function rightPad (text, size){
    let record = createRecord('',size);
    return record.slice(0, record.length - text.length) + text;
}

function createRecord05(sCRAD){
    let arRecords = new Array(5);
    let sBuf = '';
    sBuf = createRecord(sBuf, 76);
    sBuf = setRecordField(sBuf, "05", 1, 2, false);
    sBuf = setRecordField(sBuf, "1", 12, 12, false);
    sBuf = setRecordField(sBuf, "0", 13, 13, false);
    arRecords[0] = sBuf;

    sBuf = '';
    sBuf = createRecord(sBuf, 76);
    sBuf = setRecordField(sBuf, "05", 1, 2, false);
    sBuf = setRecordField(sBuf, "0", 12, 12, false);
    sBuf = setRecordField(sBuf, "0", 13, 13, false);
    sBuf = setRecordField(sBuf, "Created on " + moment().format("MMMM ")+ moment().format("DD")+", "
        +moment().format("YYYY ") +'at'+ moment().format(" hh:mmA") +
        " by IPS configurator", 17, 76, false);
    arRecords[1] = sBuf;

    sBuf = '';
    sBuf = createRecord(sBuf, 76);
    sBuf = setRecordField(sBuf, "05", 1, 2, false);
    sBuf = setRecordField(sBuf, "0", 12, 12, false);
    sBuf = setRecordField(sBuf, "0", 13, 13, false);
    arRecords[2] = sBuf;

    sBuf = '';
    sBuf = createRecord(sBuf, 76);
    sBuf = setRecordField(sBuf, "05", 1, 2, false);
    sBuf = setRecordField(sBuf, "1", 12, 12, false);
    sBuf = setRecordField(sBuf, "0", 13, 13, false);
    sBuf = setRecordField(sBuf, "000", 14, 16, false);
    let sTmp = '';
    if (isEmpty(sCRAD)) {
        sTmp = getDate(14);
        sTmp = sTmp.substring(0, 4) + "/" + sTmp.substring(4, 6) + "/" + sTmp.substring(6, 8);
    } else {
        sTmp = sCRAD.substring(0, 4) + "/" + sCRAD.substring(5, 7) + "/" + sCRAD.substring(8, 10);
    }
    sBuf = setRecordField(sBuf, "Customer Requested Arrival Date: " + sTmp, 17, 76, false);
    arRecords[3] = sBuf;

    sBuf = '';
    sBuf = createRecord(sBuf, 76);
    sBuf = setRecordField(sBuf, "05", 1, 2, false);
    sBuf = setRecordField(sBuf, "0", 12, 12, false);
    sBuf = setRecordField(sBuf, "0", 13, 13, false);
    sBuf = setRecordField(sBuf, "000", 14, 16, false);
    arRecords[4] = sBuf;

    return arRecords;
}

function createRecord96(arFields) {
    let strBuf = '';
    strBuf = createRecord(strBuf, 50);
    strBuf = setRecordField(strBuf, "96", 1, 2, false);
    strBuf = setRecordField(strBuf, arFields[CfrConstants.CfrConstants.LINE_FEATURE], 3, 9, false);
    let sTmp = arFields[CfrConstants.CfrConstants.LINE_PRICE];
    if ((isEmpty(sTmp)) || (compare(sTmp,"Y"))) {
        sTmp = "";
    } else {
        sTmp = "N";
    }
    strBuf = setRecordField(strBuf, sTmp, 29, 29, false);
    // single-byte length 44 for HW [51, 94], 60 for SW [51, 110]
    let iLen = 94;
    sTmp = arFields[CfrConstants.CfrConstants.LINE_DESCRIPTION];
    if ((!isEmpty(sTmp)) && (sTmp.length > 1)) {
        iLen = 51 + sTmp.length - 1;
        if (iLen > 124) {
            iLen = 124;
        }
    }
    strBuf = setRecordField(strBuf, arFields[CfrConstants.CfrConstants.LINE_DESCRIPTION], 51, iLen, false);

    return strBuf;
}

function addToRecord38(sBuf,arFields) {
    let iStart = sBuf.length + 1;
    sBuf = createRecord(sBuf, sBuf.length + 13);

    sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.LINE_FEATURE], iStart, iStart+6, false);

    let sQty = arFields[CfrConstants.CfrConstants.LINE_QTY];
    if (isEmpty(sQty)) {
        sQty = "1";
    }
    if (sQty.startsWith("-")) {
        sQty = sQty.substring(1);
    }
    sBuf = setRecordField(sBuf, sQty, iStart+7, iStart+11, true);

    let sTmp = '';
    switch (arFields[CfrConstants.CfrConstants.LINE_TYPE]) {
        case CfrConstants.CfrConstants.SUBLINE_TYPE_ADD:
            sTmp = "1";
            break;
        case CfrConstants.CfrConstants.SUBLINE_TYPE_REMOVE:
            sTmp = "2";
            break;
        default:
            sTmp = "1";
            break;
    }
    sBuf = setRecordField(sBuf, sTmp, iStart+12, iStart+12, false);
    return sBuf;
}

function addToRecord50(sBuf,arFields){
    let iStart = sBuf.length + 1;
    sBuf = createRecord(sBuf, sBuf.length + 13);

    let sFrom = arFields[CfrConstants.CfrConstants.LINE_FEATURE];
    let sTo = '';
    if (sFrom.indexOf("_") > -1) {
        sTo = sFrom.substring(sFrom.indexOf("_") + 1);
        sFrom = sFrom.substring(0, sFrom.indexOf("_"));
    }
    sBuf = setRecordField(sBuf, sFrom, iStart, iStart+6, false);

    let sQty = arFields[CfrConstants.CfrConstants.LINE_QTY];
    if (isEmpty(sQty)) {
        sQty = "1";
    }
    if (sQty.startsWith("-")) {
        sQty = sQty.substring(1);
    }
    sBuf = setRecordField(sBuf, sQty, iStart+7, iStart+11, true);

    let sTmp = '';
    switch (arFields[CfrConstants.CfrConstants.LINE_TYPE]) {
        case CfrConstants.CfrConstants.SUBLINE_TYPE_ADD:
            sTmp = "1";
            break;
        case CfrConstants.CfrConstants.SUBLINE_TYPE_REMOVE:
            sTmp = "2";
            break;
        case CfrConstants.CfrConstants.SUBLINE_TYPE_CONVERSION:
            sTmp = "3";
            // from group requires a to group
            sBuf = setRecordField(sBuf, sTo, iStart + 13, iStart+19, false);
            sBuf = setRecordField(sBuf, sQty, iStart+20, iStart+24, true);
            sBuf = setRecordField(sBuf, "4", iStart+25, iStart+25, false);
            break;
        default:
            sTmp = "1";
            break;
    }
    sBuf = setRecordField(sBuf, sTmp, iStart+12, iStart+12, false);
    return sBuf;
}

function addToRecord47(sBufLine,arFields){
    let iStart = sBufLine.length + 1;
    sBufLine = createRecord(sBufLine, sBufLine.length + 12);

    sBufLine = setRecordField(sBufLine, arFields[CfrConstants.CfrConstants.LINE_FEATURE], iStart, iStart+6, false);
    let strTmp = arFields[CfrConstants.CfrConstants.LINE_QTY];
    if (isEmpty(strTmp)) {
        strTmp = "1";
    }
    sBufLine = setRecordField(sBufLine, strTmp, iStart+7, iStart+11, true);
    return sBufLine;
}

function addToRecord19(sBuf, arFields){
    let iStart = sBuf.length + 1;
    sBuf = createRecord(sBuf, sBuf.length + 13);

    let sFrom = arFields[CfrConstants.CfrConstants.LINE_FEATURE];
    let sTo = '';
    if (sFrom.indexOf("_") > -1) {
        sTo = sFrom.substring(sFrom.indexOf("_") + 1);
        sFrom = sFrom.substring(0, sFrom.indexOf("_"));
    }
    sBuf = setRecordField(sBuf, sFrom, iStart, iStart+6, false);

    let sQty = arFields[CfrConstants.CfrConstants.LINE_QTY];
    if (isEmpty(sQty)) {
        sQty = "1";
    }
    if (sQty.startsWith("-")) {
        sQty = sQty.substring(1);
    }
    sBuf = setRecordField(sBuf, sQty, iStart+7, iStart+11, true);

    let sTmp = '';
    switch (arFields[CfrConstants.CfrConstants.LINE_TYPE]) {
        case CfrConstants.CfrConstants.SUBLINE_TYPE_ADD:
            sTmp = "1";
            break;
        case CfrConstants.CfrConstants.SUBLINE_TYPE_REMOVE:
            sTmp = "2";
            break;
        case CfrConstants.CfrConstants.SUBLINE_TYPE_CONVERSION:
            sTmp = "3";
            // from group requires a to group
            sBuf = setRecordField(sBuf, sTo, iStart+13, iStart+19, false);
            sBuf = setRecordField(sBuf, sQty, iStart+20, iStart+24, true);
            sBuf = setRecordField(sBuf, "4", iStart+25, iStart+25, false);
            break;
        case CfrConstants.CfrConstants.SUBLINE_TYPE_EXCHANGEADD:
            sTmp = "6";
            break;
        case CfrConstants.CfrConstants.SUBLINE_TYPE_EXCHANGEREMOVE:
            sTmp = "7";
            break;
        default:
            sTmp = "1";
            break;
    }
    sBuf = setRecordField(sBuf, sTmp, iStart+12, iStart+12, false);
    return sBuf;
}

function addToRecord08(sBufLine, arFields){
    let iStart = sBufLine.length + 1;
    sBufLine = createRecord(sBufLine, sBufLine.length + 12);

    sBufLine = setRecordField(sBufLine, arFields[CfrConstants.CfrConstants.LINE_FEATURE], iStart, iStart+6, false);
    let strTmp = arFields[CfrConstants.CfrConstants.LINE_QTY];
    if (isEmpty(strTmp)) {
        strTmp = "1";
    }
    sBufLine = setRecordField(sBufLine, strTmp, iStart+7, iStart+11, true);
    return sBufLine;
}

function isValidLineNo(arFields) {
    if (!isNumber(arFields[0].charAt(0))) {
        return false;
    }
    if ((parseInt(arFields[0]) % 1000 ) == 0) {
        return false;
    }
    return true;
}

function createRecord38(arFields){
    //only ServicePac supported, no repeat of feature...
    let sBuf = '';
    sBuf = createRecord(sBuf, 35);
    sBuf = setRecordField(sBuf, "38", 1, 2, false);
    let sTmp = arFields[CfrConstants.CfrConstants.LINE_MTM];
    if ((!isEmpty(sTmp)) && (sTmp.length>5)) {
        sBuf = setRecordField(sBuf, sTmp.substring(0, 4), 3, 6, false);
        sBuf = setRecordField(sBuf, sTmp.substring(5), 7, 9, false);
    }
    sTmp = '';
    switch (arFields[CfrConstants.CfrConstants.LINE_TYPE]) {
        case CfrConstants.CfrConstants.SUBLINE_TYPE_ADD:
            sTmp = "1";
            break;
        case CfrConstants.CfrConstants.SUBLINE_TYPE_REMOVE:
            sTmp = "2";
            break;
        default:
            sTmp = "1";
            break;
    }
    sBuf = setRecordField(sBuf, sTmp, 10, 10, false);

    sTmp = arFields[CfrConstants.CfrConstants.LINE_QTY];
    if (isEmpty(sTmp)) {
        sTmp = "1";
    }
    sBuf = setRecordField(sBuf, sTmp, 11, 15, true);

    switch (arFields[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE]) {
        case CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICEPAC:
            sTmp = "1";
            break;
        case CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES  + " (GTS)":
            sTmp = "2";
            break;
        case CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES + " (LBS)":
            sTmp = "3";
            break;
        case CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES + " (Bundle)":
            sTmp = "4";
            break;
        default:
            // CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES
            sTmp = " ";
            break;
    }
    sBuf = setRecordField(sBuf, sTmp, 16, 16, false);
    return sBuf;
}

function createRecord50(arFields) {
    let sBuf = '';
    sBuf = createRecord(sBuf, 10);
    sBuf = setRecordField(sBuf, "50", 1, 2, false);

    let sTmp = arFields[CfrConstants.CfrConstants.LINE_MTM];
    if ((!isEmpty(sTmp)) && (sTmp.length>5)) {
        sBuf = setRecordField(sBuf, sTmp.substring(0, 4), 3, 6, false);
        sBuf = setRecordField(sBuf, sTmp.substring(5), 7, 9, false);
    }
    sTmp = null;
    switch (arFields[CfrConstants.CfrConstants.LINE_TYPE]) {
        case CfrConstants.CfrConstants.LINE_TYPE_NEW:
            sTmp = "1";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_DISCONTINUED:
            sTmp = "2";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_CANCELLED:
            sTmp = "3";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_FMOD:
            sTmp = "4";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_ALTERATION:
            sTmp = "5";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_CANCELLED_MES:
            sTmp = "6";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_RPO_ADD:
            sTmp = "A";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_RPO_REMOVE:
            sTmp = "B";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_RPO:
            sTmp = "C";
            break;
        default:
            sTmp = "4";
            break;
    }
    sBuf = setRecordField(sBuf, sTmp, 10, 10, false);
    return sBuf;
}

function createRecord47(arFields) {
    let sBuf = '';
    sBuf = createRecord(sBuf, 14);
    sBuf = setRecordField(sBuf, "47", 1, 2, false);
    let sTmp = arFields[CfrConstants.CfrConstants.LINE_MTM];
    if ((!isEmpty(sTmp)) && (sTmp.length>5)) {
        sBuf = setRecordField(sBuf, sTmp.substring(0, 4), 3, 6, false);
        sBuf = setRecordField(sBuf, sTmp.substring(5), 7, 9, false);
    }
    sTmp = arFields[CfrConstants.CfrConstants.LINE_QTY];
    if (isEmpty(sTmp)) {
        sTmp = "1";
    }
    sBuf = setRecordField(sBuf, sTmp, 10, 14, true);
    return sBuf;
}

function createRecord95GroupTo(arFields){
        let sBuf = '';
        sBuf = createRecord(sBuf, 186);
        sBuf = setRecordField(sBuf, "95", 1, 2, false);
        sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.LINE_TOTYPE], 3, 6, false);
        sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.LINE_TOMODEL], 7, 9, false);
        sBuf = setRecordField(sBuf, leftPadZero(arFields[CfrConstants.CfrConstants.LINE_TOSN], 9), 20, 28, false);
        if (!isEmpty(arFields[CfrConstants.CfrConstants.LINE_TOSYSNBR])) {
            if (!isEmpty(arFields[CfrConstants.CfrConstants.LINE_TOSYSTYPE])) {
                sBuf = setRecordField(sBuf, "S", 50, 50, false);
                sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.LINE_TOSYSTYPE], 51, 54, false);
                sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.LINE_TOSYSNBR], 55, 61, false);
            }
        }

        return sBuf;
}

function createRecord95(arFields, isNew, isFirstLine, isFirstLineHW, sProductType, sSystemType) {
    let sBuf = '';
    sBuf = createRecord(sBuf, 142); // 186
    sBuf = setRecordField(sBuf, "95", 1, 2, false);

    let sTmp = '';
    let sType = arFields[CfrConstants.CfrConstants.LINE_FROMTYPE];
    let sModel = arFields[CfrConstants.CfrConstants.LINE_FROMMODEL];
    if ((isEmpty(sType)) || (isEmpty(sModel))) {
        sType = arFields[CfrConstants.CfrConstants.LINE_MTM];
        if ((!isEmpty(sType)) && (sType.length>5)) {
            sModel = sType.substring(0, 4);
            sType = sType.substring(5);
        }
    }

    sBuf = setRecordField(sBuf, sType, 3, 6, false);
    sBuf = setRecordField(sBuf, sModel, 7, 9, false);
    sBuf = setRecordField(sBuf, "000000000", 29, 37, false);
    sBuf = setRecordField(sBuf, "0", 62, 62, false); //default no CPUSIU, overwritten by other checks

    if (isNew) {
        // if initial order, all lines have system type of 1st HW line
        sBuf = setRecordField(sBuf, "T", 50, 50, false);
        sBuf = setRecordField(sBuf, sSystemType, 51, 54, false);
        if (isFirstLineHW) {
            sBuf = setRecordField(sBuf, "NEW CPU", 55, 61, false);
            if (isFirstLine) {
                //CPUSIU - 1 if first line and hardware
                sBuf = setRecordField(sBuf, "1", 62, 62, false);
            }
        } else {
            // if initial order is only SW... (and ServicePac ???)
            sBuf = setRecordField(sBuf, "NON-SIU", 55, 61, false);
        }
    } else {
        if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE == sProductType) {
            // if MES only HW lines have system type of 1st HW line
            sBuf = setRecordField(sBuf, "T", 50, 50, false);
            sBuf = setRecordField(sBuf, sSystemType, 51, 54, false);
            sBuf = setRecordField(sBuf, "NEW CPU", 55, 61, false);
        }

        let sSN = arFields[CfrConstants.CfrConstants.LINE_FROMSN];
        if (!isEmpty(sSN)) {
            if (sSN.startsWith("SN")) {
                //dummy MES SN
                sBuf = setRecordField(sBuf, sSN, 20, 28, false);
            } else {
                sBuf = setRecordField(sBuf, leftPadZero(sSN, 9), 20, 28, false);
                // if there is a S/N, assumes the machine for MES is already installed, and data was retrieved from inventory services
                // normally only used for base system ???
                sBuf = setRecordField(sBuf, "I", 99, 99, false);
                sBuf = setRecordField(sBuf, "B", 106, 106, false);
            }
        }
    }


    if (!isEmpty(arFields[CfrConstants.CfrConstants.LINE_FROMSYSNBR])) {
        if (!isEmpty(arFields[CfrConstants.CfrConstants.LINE_FROMSYSTYPE])) {
            sBuf = setRecordField(sBuf, "S", 50, 50, false);
            sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.LINE_FROMSYSTYPE], 51, 54, false);
            sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.LINE_FROMSYSNBR], 55, 61, false);
        }
    }

    sTmp = arFields[CfrConstants.CfrConstants.LINE_CPUSIU];
    if ((isEmpty(sTmp)) && (sTmp.length == 1)) {
        sBuf = setRecordField(sBuf, sTmp, 62, 62, false);
    }



    sTmp = arFields[CfrConstants.CfrConstants.LINE_PRICE];
    if ((isEmpty(sTmp)) || (compare("Y",sTmp))) {
        sTmp = " ";
    } else {
        sTmp = "N";
    }
    sBuf = setRecordField(sBuf, sTmp, 49, 49, false);

    sTmp = arFields[CfrConstants.CfrConstants.LINE_CMR];
    if (!isEmpty(sTmp)) {
        sBuf = setRecordField(sBuf, sTmp, 76, 82, false);
    }
    sTmp = arFields[CfrConstants.CfrConstants.LINE_CRAD];
    if (isEmpty(sTmp)) {
        sTmp = getDate(14);
    } else {
        sTmp = sTmp.substring(0, 4) + sTmp.substring(5, 7) + sTmp.substring(8, 10);
    }
    sBuf = setRecordField(sBuf, sTmp, 83, 90, false);
    sTmp = arFields[CfrConstants.CfrConstants.LINE_INSTALLDATE];
    if (!isEmpty(sTmp)) {
        sTmp = sTmp.substring(0, 4) + sTmp.substring(5, 7) + sTmp.substring(8, 10);
        sBuf = setRecordField(sBuf, sTmp, 91, 98, false);
    }


    //sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.LINE_DESCRIPTION], 143, 186, false);
    let iLen = 142;
    sTmp = arFields[CfrConstants.CfrConstants.LINE_DESCRIPTION];
    if (!isEmpty(sTmp)) {
        sTmp = sTmp.trim();
        iLen += sTmp.length;
        if (CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE == sProductType) {
            if (iLen > 202) iLen = 202;
        } else {
            if (iLen > 186) iLen = 186;
        }
    }
    sBuf = setRecordField(sBuf, sTmp, 143, iLen, false);

    return sBuf;
}

function createRecord19(arFields){
    let sBuf = '';
    sBuf = createRecord(sBuf, 17); // 30-13
    sBuf = setRecordField(sBuf, "19", 1, 2, false);

    let sTmp = arFields[CfrConstants.CfrConstants.LINE_MTM];
    if ((!isEmpty(sTmp)) && (sTmp.length>5)) {
        sBuf = setRecordField(sBuf, sTmp.substring(0, 4), 3, 6, false);
        sBuf = setRecordField(sBuf, sTmp.substring(5), 7, 9, false);
    }
    if ((!isEmpty(sTmp) ) && (sTmp.length>14) && (sTmp.charAt(8) == '_')) {
        sBuf = setRecordField(sBuf, sTmp.substring(9, 13), 10, 13, false);
        sBuf = setRecordField(sBuf, sTmp.substring(14), 14, 16, false);
    }
    sTmp = '';
    switch (arFields[CfrConstants.CfrConstants.LINE_TYPE]) {
        case CfrConstants.CfrConstants.LINE_TYPE_NEW:
            sTmp = "1";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_DISCONTINUED:
            sTmp = "2";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_CANCELLED:
            sTmp = "3";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_FMOD:
            sTmp = "4";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_UPGRADE:
            sTmp = "5";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_ALTERATION:
            sTmp = "6";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_CANCELLED_MES:
            sTmp = "7";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_RPO_ADD:
            sTmp = "A";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_RPO_REMOVE:
            sTmp = "B";
            break;
        case CfrConstants.CfrConstants.LINE_TYPE_RPO:
            sTmp = "C";
            break;
        default:
            sTmp = "4";
            break;
    }
    sBuf = setRecordField(sBuf, sTmp, 17, 17, false);
    return sBuf;
}

function createRecord08(arFields){
        let sBuf = '';
        sBuf = createRecord(sBuf, 15); //27-12
        sBuf = setRecordField(sBuf, "08", 1, 2, false);
        let sTmp = arFields[CfrConstants.CfrConstants.LINE_MTM];
        if ((!isEmpty(sTmp)) && (sTmp.length>5)) {
            sBuf = setRecordField(sBuf, sTmp.substring(0, 4), 3, 6, false);
            sBuf = setRecordField(sBuf, sTmp.substring(5), 8, 10, false);
        }
        sTmp = arFields[CfrConstants.CfrConstants.LINE_QTY];
        if (isEmpty(sTmp)) {
            sTmp = "1";
        }
        sBuf = setRecordField(sBuf, sTmp, 11, 15, true);
        return sBuf;
}

function getProductType(sMTM) {
    if (!isEmpty(sMTM)) {
        if ((sMTM.startsWith("56")) || (sMTM.startsWith("57"))) {
            //catalog category CS, M1, SI
            //SWMA is also included which is services, but initial SWMA is set as Software in eConfig
            //SW: 5600 - 5799
            return CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE;
        } else if ((sMTM.startsWith("69SA")) || (sMTM.startsWith("69SW"))) {
            //Services: 69SA, 69SW
            return CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES;
        } else if ((sMTM.startsWith("6760")) || (sMTM.startsWith("6661")) || (sMTM.startsWith("6662")) || (sMTM.startsWith("6664"))) {
            //catalog category SP
            //?? 46Y0, 46Y1, 60Y1, 69Y0, 00Y3  (PN, not real MTM)
            return CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICEPAC;
        } else if ((sMTM.length == 8) && (sMTM.endsWith("HPO"))) {
            //catalog category HI
            //HW: model HPO
            return CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE;
        }
    }
    //default
    return CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE;
}

function isNumber(c) {
    let reg = /^\+?[1-9][0-9]*$/;　　//正整数
    if (isEmpty(c)){
        return false;
    }
    if (reg.test(c)){
        return true;
    }
    return false;
}

function  createRecord01(sOrderType) {
    let sBuf = '';
    sBuf = createRecord(sBuf, 85);
    sBuf = setRecordField(sBuf, "01", 1, 2, false);
    sBuf = setRecordField(sBuf, sOrderType, 3, 3, false);
    switch (sOrderType) {
        case "1":
            sBuf = setRecordField(sBuf, CfrConstants.CfrConstants.CFR_CODE_NEW, 4, 43, false);
            break;
        case "2":
            sBuf = setRecordField(sBuf, CfrConstants.CfrConstants.CFR_CODE_MES_BASE, 4, 43, false);
            break;
        case "3":
            sBuf = setRecordField(sBuf, CfrConstants.CfrConstants.CFR_CODE_MES_PROPOSED, 4, 43, false);
            break;
        case "4":
            sBuf = setRecordField(sBuf, CfrConstants.CfrConstants.CFR_CODE_MES, 4, 43, false);
            break;
    }
    return sBuf;
}

function createRecord07(arFields){
        let sBuf = '';
        sBuf = createRecord(sBuf, 85);
        sBuf = setRecordField(sBuf, "07", 1, 2, false);
        sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.SYS_MAIN_DESC], 6, 45, false);
        sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.SYS_MAIN_TYPE], 54, 57, false);
        sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.SYS_MAIN_MODEL], 58, 60, false);
        if (!isEmpty(arFields[CfrConstants.CfrConstants.SYS_MAIN_SN])) {
            if (arFields[CfrConstants.CfrConstants.SYS_MAIN_SN].startsWith("SN")) {
                //dummy MES SN
                sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.SYS_MAIN_SN], 61, 69, false);
            } else {
                sBuf = setRecordField(sBuf, leftPadZero(arFields[CfrConstants.CfrConstants.SYS_MAIN_SN], 9), 61, 69, false);
            }
        }
        sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.SYS_MAIN_SEO], 71, 77, false);
        return sBuf;
}

function createRecord00(arFields) {
    let sBuf = '';
    let sTmp = '';
    sBuf = createRecord(sBuf, 311);
    sBuf = setRecordField(sBuf, "00", 1, 2, false);
    sBuf = setRecordField(sBuf, "31", 3, 4, false);
    sTmp = arFields[CfrConstants.CfrConstants.CFR_DATE];
    if (isEmpty(sTmp)) {
        sTmp = getDate(0);
    }else {
        sTmp = sTmp.substring(0, 4) + sTmp.substring(5, 7) + sTmp.substring(8, 10);
    }
    sBuf = setRecordField(sBuf, sTmp, 5, 12, false);
    // EC: e-config
    // M: Mobile or disconnected
    // PWR: Power (brand)
    sBuf = setRecordField(sBuf, "ECMPWR", 13, 20, false);
    sTmp = arFields[CfrConstants.CfrConstants.CFR_APPNAME];
    if ((!isEmpty(sTmp)) & (sTmp.endsWith(")"))) {
        let iStart = sTmp.indexOf("(");
        if (iStart > 0) {
            sTmp = sTmp.substring(iStart + 1, sTmp.length - 1);
        } else {
            sTmp = "";
        }
    } else {
        sTmp = "";
    }
    sBuf = setRecordField(sBuf, sTmp, 21, 32, false);
    sBuf = setRecordField(sBuf, CfrConstants.CfrConstants.GEO_AP, 33, 34, false);
    sTmp = arFields[CfrConstants.CfrConstants.CFR_COUNTRY_IPS];
    if (isEmpty(sTmp)){
        sTmp = CfrConstants.CfrConstants.CHINA_COUNTRY_CODE;
    }
    sBuf = setRecordField(sBuf, sTmp, 35, 37, false);
    // commercial pricing
    sBuf = setRecordField(sBuf, "0", 38, 38, false);
    // CFR not locked
    sBuf = setRecordField(sBuf, " ", 39, 39, false);
    // Use descriptions directly from CFR
    sBuf = setRecordField(sBuf, "2", 40, 40, false);
    sTmp = arFields[CfrConstants.CfrConstants.CFR_TYPE];
    if (isEmpty(sTmp)) {
        sTmp = "3";
    } else {
        switch (sTmp) {
            case "HW":
                sTmp = "1";
                break;
            case "SW":
                sTmp = "2";
                break;
            case "HWSW":
                sTmp = "3";
                break;
            default:
                sTmp = " ";
                break;
        }
    }
    sBuf = setRecordField(sBuf, sTmp, 41, 41, false);
    sBuf = setRecordField(sBuf, arFields[CfrConstants.CfrConstants.CFR_DESCRIPTION], 42, 81, false);
    // The date this configuration is considered to no longer be valid.
    sBuf = setRecordField(sBuf, getDate(20), 94, 101, false);
    // blank indicates CFR is based on Type Model Feature (vs SEO)
    sBuf = setRecordField(sBuf, "", 102, 102, false);
    // TODO: 104: RPQ Place holder present in configuration: Blank – No place holder; 1- One or more RPQ place holder exists
    sTmp = arFields[CfrConstants.CfrConstants.CFR_COUNTRY];
    if (isEmpty(sTmp)) {
        sTmp = CfrConstants.CfrConstants.CHINA_COUNTRY_ISO;
    }
    sBuf = setRecordField(sBuf, sTmp.toUpperCase(), 141, 142, false);
    sTmp = arFields[CfrConstants.CfrConstants.CFR_LANGUAGE];
    if (isEmpty(sTmp)) {
        sTmp = CfrConstants.CfrConstants.CHINA_LANGUAGE;
    }
    sBuf = setRecordField(sBuf, sTmp.toLowerCase(), 143, 144, false);
    // For World Trade users only, 0 - CFIN did not create the CFREPORT (default).
    sBuf = setRecordField(sBuf, "0", 166, 166, false);
    // For World Trade users only, 0 - CFOUT did not create the CFREPORT (default).
    sBuf = setRecordField(sBuf, "0", 167, 167, false);
    return sBuf;
}


function createRecord03(arFields) {
    let sBuf = '';
    sBuf = createRecord(sBuf,25);
    sBuf = setRecordField(sBuf, "03", 1, 2, false);
    sBuf = setRecordField(sBuf, "0", 3, 3, false);
    sBuf = setRecordField(sBuf, "Unclassified", 4, 25, false);

    return sBuf;
}
/**
 * 设置记录值
 * @param sBuf
 * @param value
 * @param beginPos
 * @param endPos
 * @param isRightAligned
 */
function setRecordField(sBuf, value, beginPos, endPos, isRightAligned) {
    if ((isEmpty(value)) || (beginPos > endPos)) {
        return sBuf;
    }
    // sBuf = createRecord(sBuf, endPos);
    // if (isRightAligned) {
    //     beginPos = endPos - value.length + 1;
    // }
    // let valueIdx = 0;
    // for (let index=(beginPos); index<endPos+1; index++) {
    //     if (valueIdx == value.length) {
    //         break;
    //     }
    //     console.log(sBuf.charAt(index));
    //     console.log(index)
    //     console.log(value.charAt(valueIdx));
    //     console.log(valueIdx);
    //     console.log('qian' + sBuf);
    //     sBuf = sBuf.replace(sBuf.charAt(index),value.charAt(valueIdx));
    //     console.log('hou' + sBuf);
    //     valueIdx++;
    // }
    if (isRightAligned) {
        beginPos = endPos - value.length + 1;
    }
    sBuf = insertStr(sBuf,beginPos, value);
    return sBuf;
}

/**
 * 初始化字符串长度
 * @param sBuf
 * @param len
 * @returns {*}
 */
function  createRecord (sBuf,len) {
    for (let l = sBuf.length; l < len; l++) {
        sBuf += ' ';
    }
    return sBuf;
}

    /**
     * 左对齐填充0
     * @param sText
     * @param iLen
     * @returns {string|*}
     */
    function leftPadZero(sText, iLen) {
        let sZPad = prefixInteger(0,iLen);
        if (isEmpty(sText)) {
            return sZPad;
        }
        sZPad = (sZPad + sText).substring(sText.length);
        return sZPad;
    }

    /**
     * 生成指定长度的0 例如：0000000000000
     * @param num
     * @param length
     * @returns {string}
     * @constructor
     */
    function prefixInteger(num, length) {
        return (Array(length).join('0') + num).slice(-length);
    }

/**
 * 判断是否为空
 * @param sText
 * @returns {boolean}
 */
function isEmpty(sText) {
    if (sText == null || sText == undefined || sText == '') {
        return true;
    } else if (sText.trim().length == 0) {
        return true;
    }
    return false;
}

/**
 * 生成文件校验
 * @param sRecord
 * @param lCheckSum
 * @returns {number|*}
 */
function computeChecksum(sRecord,lCheckSum){
    if (isEmpty(sRecord)) {
        let result;
        let str = lCheckSum.toString(2);
        if (str.length < 32){
            let s = prefixInteger(str,64);
            result= parseInt(s,2);
        }else{
            let s1 = str.substring(str.length-32,str.length);
            let s2=prefixInteger(s1,64);
            result=parseInt(s2,2);
        }
        console.log(result);
        console.log(lCheckSum >>> 0);
        // return (lCheckSum >>> 0);
        return result;
    }

    let len = sRecord.length;
    let modulo = len % 4;
    if (modulo != 0)
        modulo = 4 - modulo;
    let lineRecordByte = new Array(len + modulo);
    for (let i = 0; i < len; i++) {
        lineRecordByte[i] = sRecord.charAt(i).charCodeAt(0);
    }

    for (; modulo > 0; modulo--) {
        lineRecordByte[len++] = 0x01;
    }

    let offset = 0;
    let lenTable = ASCIICODETABLE.length;
    while (offset < len) {
        let mask = parseInt('16777216L'); // 0X100000
        for (let index = 0; index < 4; index++) {
            let curCarac = lineRecordByte[offset++];
            let indexTable = 0;
            let bContinu = true;
            while (bContinu) {
                if (indexTable >= lenTable) {
                    curCarac = 0;
                    bContinu = false;
                } else if (curCarac < ASCIICODETABLE[indexTable]) {
                    curCarac = 0;
                    bContinu = false;
                } else if (curCarac == ASCIICODETABLE[indexTable]) {
                    curCarac = ASCIICODETABLE[indexTable + 1];
                    bContinu = false;
                } else
                    indexTable += 2;
            }
            lCheckSum += mask * curCarac;
            mask /= 256;
        }
    }
    return lCheckSum;
};

/**
 * 获取当前时间相隔天数之后的日期
 * @param iExtraDays  相隔天数
 */
function getDate(iExtraDays){
    if (iExtraDays != 0){
        return  moment().add(iExtraDays, 'days').format("YYYYMMDD")
    }
    return moment().format("YYYYMMDD");
}

/**
 * 修改字符串中某个位置的值
 * @param soure
 * @param start
 * @param newStr
 * @returns {*}
 */
function insertStr(soure, start, newStr){
    return soure.slice(0, start-1) + newStr + soure.slice(start+newStr.length-1,soure.length);
}

/**
 * 将数据转化成字符串数组格式
 * @param lineCSV
 * @returns {any[]}
 */
function getCsvFieldArray(lineCSV){
    let sBufField = '';
    let isQuote = false;
    let isComma = false;
    let listOfFields = [];
    for (let m = 0; m < lineCSV.length; m++) {
        let c = lineCSV.charAt(m);

        switch (c) {
            case '\n':
            case '\r':
            case '\t':
                sBufField += ' ';
                break;
            case ',':
                if (isQuote) {
                    sBufField += c;
                } else {
                    isComma = true;
                }
                break;
            case '\"':
                isQuote = !isQuote;
                if ((m > 0) && (lineCSV.charAt(m - 1) == '\"')) {
                    sBufField += c;
                    isQuote = !isQuote;
                }
                break;
            default:
                sBufField += c;
                break;
        }
        if (lineCSV.length == m + 1) {
            isComma = true;
        }
        if (isComma) {
            listOfFields.push(sBufField);
            isQuote = false;
            isComma = false;
            sBufField = '';
        }
    };
    let arFields = new Array(listOfFields.length);
    for (let i = 0; i < listOfFields.length; i++) {
        arFields[i] = listOfFields[i];
    }
    return arFields;

}

/**
 * 导出cfr文件
 * @param machineName
 * @param sCfr
 */
function saveAs(sCfr,machineName){
    let header = "data:application/octet-stream;charset=utf-8,";
    let name = machineName +'-'+'IPSConfiguration' + moment().format("YYYYMMDDHHmmss") + '.cfr';
    let cfrContent = header + sCfr;
    //如果是IE浏览器
    if (window.navigator.msSaveOrOpenBlob) {
        let blob = new Blob([decodeURIComponent(encodeURI(cfrContent))], {
            type: "application/octet-stream;charset=utf-8;"
        });
        navigator.msSaveBlob(blob, name);
    } else {
        let encodedUri = encodeURI(cfrContent);
        let link = document.createElement("a");
        // //扩展，访问局域网内共享文件
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
    }
}

/**
 * 比较两个字符串是否相等（不区分大小写）
 * @param oldStr
 * @param newStr
 * @returns {boolean}
 */
function compare (oldStr,newStr){
    if (isEmpty(oldStr) || isEmpty(newStr)){
        return false;
    }
    //不区分大小写
    if(oldStr.toLowerCase() == newStr.toLowerCase()){
        return true; // 正确
    }else{
        return false; // 错误
    }
}

export default {
    cfrConvert,createCfr,getErrMsg
};