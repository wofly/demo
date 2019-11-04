import CfrConstants from './cfrConstants';
const  ASCIICODETABLE = [ 0x20, 255, 0x23, 67, 0x24, 31, 0x25, 52, 0x26, 28, 0x27, 73, 0x28, 22, 0x29,
    37, 0x2A, 34, 0x2B, 25, 0x2C, 49, 0x2D, 43, 0x2E, 16, 0x2F, 46, 0x30, 157, 0x31, 160, 0x32, 163, 0x33, 166,
    0x34, 169, 0x35, 172, 0x36, 175, 0x37, 178, 0x38, 181, 0x39, 184, 0x3A, 64, 0x3B, 40, 0x3C, 19, 0x3D, 76,
    0x3E, 58, 0x3F, 61, 0x40, 70, 0x41, 79, 0x42, 82, 0x43, 85, 0x44, 88, 0x45, 91, 0x46, 94, 0x47, 97, 0x48,
    100, 0x49, 103, 0x4A, 106, 0x4B, 109, 0x4C, 112, 0x4D, 115, 0x4E, 118, 0x4F, 121, 0x50, 124, 0x51, 127,
    0x52, 130, 0x53, 133, 0x54, 136, 0x55, 139, 0x56, 142, 0x57, 145, 0x58, 148, 0x59, 151, 0x5A, 154, 0x5F,
    55 ];

let m_mapOfRecords = null;
let m_mapOfReferences = null;
let m_sError = null;

const  cfrParser = (listOfLines, isCheckSum, isInstalled, isTarget) => {
    return parseCfr(listOfLines, isCheckSum, isInstalled, isTarget)
}
    /**
     * <p>Transforms the list of records (lines) of a cfr</p>
     * <p>into an in-memory table format mapping a configuration</p>
     * <p>with rows for header, system, and product data</p>
     *
     * <p>If validation failed, see {@code getErrMsg()} for error message</p>
     *
     * @param listOfLines  list of lines as String of a cfr file
     * @param isCheckSum  if false, no checksum and line count validation is performed
     * @param isInstalled  if true, only extracts the Installed (history) configuration
     * @param isTarget  if true, only extracts the Target (proposed) configuration
     * @return  list of array of String (table) mapping the configuration, {@code null} if cfr validation fails
     */
function parseCfr(listOfLines, isCheckSum, isInstalled, isTarget){
        // reset global variables
        m_mapOfRecords = new Map();
        m_mapOfReferences = new Map();
        m_sError = null;

        if ((listOfLines == null) || (listOfLines.length == 0) || (listOfLines == undefined))
            return null;

        let isDetails = false;
        let lCheckSum = parseInt('0L');
        let iRecordCount = 0;
        let isEOF = false;

        for (let k in listOfLines) {
            let sRecord = listOfLines[k];
            switch (getElement(sRecord, 1, 2)) {
                case "00":
                    // header
                    parseRecord00(sRecord);
                    if (!containsKey(m_mapOfRecords,CfrConstants.CfrConstants.TABLE_HEADER))
                        return null;
                    break;
                case "06":
                    break;
                case "07":
                    // logical system
                    isDetails = false;
                    parseRecord07(sRecord);
                    break;
                case "01":
                    // section separator for [base / proposed] order
                    isDetails = parseRecord01(sRecord, isInstalled, isTarget);
                    break;
                case "08":
                    // HW
                    if (!(isInstalled || isTarget))
                        parseRecord08(sRecord);
                    break;
                case "19":
                    // HW MES
                    if (!(isInstalled || isTarget))
                        parseRecord19(sRecord);
                    break;
                case "25":
                    // HW BASE
                    if (isInstalled)
                        parseRecord08(sRecord);
                    break;
                case "26":
                    // HW PROPOSED
                    if (isTarget)
                        parseRecord08(sRecord);
                    break;
                case "38":
                    // services
                    if (!(isInstalled || isTarget))
                        parseRecord38(sRecord);
                    break;
                case "47":
                    // SW
                    if (!(isInstalled || isTarget))
                        parseRecord47(sRecord);
                    break;
                case "48":
                    // SW PROPOSED
                    if (isTarget)
                        parseRecord47(sRecord);
                    break;
                case "49":
                    // SW BASE
                    if (isInstalled)
                        parseRecord47(sRecord);
                    break;
                case "50":
                    // SW MES
                    if (!(isInstalled || isTarget))
                        parseRecord50(sRecord);
                    break;
                case "95":
                    if (isDetails) {
                        parseRecord95(sRecord);
                    }
                    break;
                case "96":
                    if (isDetails) {
                        parseRecord96(sRecord);
                    }
                    break;
                case "98":
                    if (isCheckSum) {
                        if (!parseRecord98(sRecord, iRecordCount))
                            return null;
                    }
                    break;
                case "99":
                    if (isCheckSum) {
                        if (!parseRecord99(sRecord, lCheckSum))
                            return null;
                    }
                    isEOF = true;
                    break;
                default:
                    break;
                //TODO 78 & 97 ??
            }
            iRecordCount++;
            if (isCheckSum)
                lCheckSum = computeChecksum(sRecord, lCheckSum);
            if (isEOF)
                break;
        }
        let listOfRecords = [];
        listOfRecords.push(CfrConstants.CfrConstants.CSV_CFR);
        listOfRecords.push(getValue(m_mapOfRecords,CfrConstants.CfrConstants.TABLE_HEADER));
        //int iLastSys = m_mapOfReferences.get(_CFR_SYSTEM);
        let sSysCount = "1";
        listOfRecords.push(CfrConstants.CfrConstants.CSV_SYSTEM);
        listOfRecords.push(getValue(m_mapOfRecords,CfrConstants.CfrConstants.TABLE_SYSTEM + sSysCount));
        listOfRecords.push(CfrConstants.CfrConstants.CSV_LINE);
        let iLastLine = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLastLine = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        for (let l = 1000; l <= iLastLine; l = l + 1000) {
            let arLine = getValue(m_mapOfRecords,l.toString());
            if (arLine == null)
                continue;
            let sSystem = arLine[CfrConstants.CfrConstants.LINE_SYSTEM];
            if ((sSystem != null) && (sSystem != sSysCount)) {
                sSysCount = sSystem;
                listOfRecords.push(CfrConstants.CfrConstants.CSV_SYSTEM);
                listOfRecords.push(getValue(m_mapOfRecords,CfrConstants.TABLE_SYSTEM + sSysCount));
                listOfRecords.push(CfrConstants.CfrConstants.CSV_LINE);
            }
            listOfRecords.push(arLine);
            let iLastSubLine = 0;
            if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE + l.toString())) {
                iLastSubLine = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE + l.toString());
                for (let s = l + 1; s <= iLastSubLine; s++) {
                    let arSubLine = getValue(m_mapOfRecords,s.toString());
                    if (arSubLine == null)
                        continue;
                    listOfRecords.push(arSubLine);
                }
            }

        }

        m_mapOfRecords = null;
        m_mapOfReferences = null;

        return listOfRecords;
    };
function  getElement(sRecord, iBegin, iEnd) {
        let sValue = null;
        try {
            if ((iBegin > 0) && (sRecord != null) && (sRecord.length >= iEnd)) {
                sValue = sRecord.substring(iBegin - 1, iEnd).trim();
            }
        } catch (anyex) {
        }
        if (sValue == null)
            sValue = "";
        return sValue;
    };
function  formatDate(sYYYYMMDD) {
        let sDate = sYYYYMMDD;
        if ((sYYYYMMDD != null) && (sYYYYMMDD.length > 7)) {
            sDate = sYYYYMMDD.substring(0, 4) + "-" + sYYYYMMDD.substring(4, 6) + "-" + sYYYYMMDD.substring(6, 8);
        }
        return sDate;
    };
function parseRecord00(sRecord) {
        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        let sValue = getElement(sRecord, 3, 4);
        // only V31. V30 or V41 aren't expected
        if (sValue != "31") {
            m_sError = "Version " + sValue + " isn't supported.";
            return false;
        }

        arRecords[CfrConstants.CfrConstants.CFR_DATE] = formatDate(getElement(sRecord, 5, 12));

        switch (getElement(sRecord, 13, 14)) {
            case "EC":
                arRecords[CfrConstants.CfrConstants.CFR_APPNAME] = "e-Config";
                break;
            case "BH":
                arRecords[CfrConstants.CfrConstants.CFR_APPNAME] = "Blue Horizon";
                break;
            case "SC":
                arRecords[CfrConstants.CfrConstants.CFR_APPNAME] = "SSCT";
                break;
            case "PS":
                arRecords[CfrConstants.CfrConstants.CFR_APPNAME] = "PSAT";
                break;
            case "IP":
                arRecords[CfrConstants.CfrConstants.CFR_APPNAME] = "IPC";
                break;
            default:
                arRecords[CfrConstants.CfrConstants.CFR_APPNAME] = null;
                break;
        }

        if (arRecords[CfrConstants.CfrConstants.CFR_APPNAME] != null) {
            switch (getElement(sRecord, 15, 15)) {
                case "M":
                    arRecords[CfrConstants.CfrConstants.CFR_APPNAME] += " Disconnected";
                    break;
                case "N":
                    arRecords[CfrConstants.CfrConstants.CFR_APPNAME] += " Web";
                    break;
                case "W":
                    arRecords[CfrConstants.CfrConstants.CFR_APPNAME] += " Portal";
                    break;
                default:
                    break;
            }
        }
        if (arRecords[CfrConstants.CfrConstants.CFR_APPNAME] != null) {
            arRecords[CfrConstants.CfrConstants.CFR_APPNAME] += " (" + getElement(sRecord, 21, 32) + ")";
        }

        switch (getElement(sRecord, 16, 20)) {
            case "PWR":
                arRecords[CfrConstants.CfrConstants.CFR_BRAND] = "POWER";
                break;
            case "SSD":
                arRecords[CfrConstants.CfrConstants.CFR_BRAND] = "Storage";
                break;
            case "CFG": // APPNAME=BH
            case "XS":
                arRecords[CfrConstants.CfrConstants.CFR_BRAND] = "System x";
                break;
            case "S390":
                arRecords[CfrConstants.CfrConstants.CFR_BRAND] = "System z";
                break;
            case "AS4":
                arRecords[CfrConstants.CfrConstants.CFR_BRAND] = "System i";
                break;
            case "RS6":
                arRecords[CfrConstants.CfrConstants.CFR_BRAND] = "System p";
                break;
            case "PSC":
                arRecords[CfrConstants.CfrConstants.CFR_BRAND] = "Printers";
                break;
            case "RSS":
                arRecords[CfrConstants.CfrConstants.CFR_BRAND] = "Retail Store Solution";
                break;
            default:
                break;
        }

        arRecords[CfrConstants.CfrConstants.CFR_COUNTRY_IPS] = getElement(sRecord, 35, 37);

        switch (getElement(sRecord, 39, 39)) {
            case "":
            case "0":
                arRecords[CfrConstants.CfrConstants.CFR_LOCKED] = "N";
                break;
            default:
                arRecords[CfrConstants.CfrConstants.CFR_LOCKED] = "Y";
                break;
        }

        switch (getElement(sRecord, 41, 41)) {
            case "1":
                arRecords[CfrConstants.CfrConstants.CFR_TYPE] = "HW";
                break;
            case "2":
                arRecords[CfrConstants.CfrConstants.CFR_TYPE] = "SW";
                break;
            case "3":
                arRecords[CfrConstants.CfrConstants.CFR_TYPE] = "HWSW";
                break;
            default:
                break;
        }

        arRecords[CfrConstants.CfrConstants.CFR_DESCRIPTION] = getElement(sRecord, 42, 81);
        arRecords[CfrConstants.CfrConstants.CFR_EXP_DATE] = formatDate(getElement(sRecord, 94, 101));
        arRecords[CfrConstants.CfrConstants.CFR_COUNTRY] = getElement(sRecord, 141, 142);
        arRecords[CfrConstants.CfrConstants.CFR_LANGUAGE] = getElement(sRecord, 143, 144);

        m_mapOfRecords.set(CfrConstants.CfrConstants.TABLE_HEADER, arRecords);
    };
function parseRecord08(sRecord) {
        //same structure as Record 25 - Hardware Installed
        let iSys = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Hardware line
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_NEW;
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = getElement(sRecord, 3, 6) + "-" + getElement(sRecord, 8, 10);
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = getElement(sRecord, 11, 15);

        m_mapOfReferences = remove(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 16; i < sRecord.length; i = i + 12) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = getElement(sRecord, i, i + 6);

            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = getElement(sRecord, i + 7, i + 11);

            arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_ADD;
            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);
    };
function parseRecord19(sRecord) {
        let iSys = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array[CfrConstants.CfrConstants.ARRAY_SIZE];
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Hardware MES/Upgrade
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = getElement(sRecord, 3, 6) + "-" + getElement(sRecord, 7, 9);
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = "1";

        if (getElement(sRecord, 10, 13).length > 0) {
            arRecords[CfrConstants.CfrConstants.LINE_MTM] = arRecords[CfrConstants.CfrConstants.LINE_MTM] + "_" + getElement(sRecord, 10, 13) + "-"
                + getElement(sRecord, 14, 16);
        }

        switch (getElement(sRecord, 17, 17)) {
            case "1":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_NEW;
                break;
            case "2":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_DISCONTINUED;
                break;
            case "3":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_CANCELLED;
                break;
            case "4":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_FMOD;
                break;
            case "5":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_UPGRADE;
                break;
            case "6":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_ALTERATION;
                break;
            case "7":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_CANCELLED_MES;
                break;
            case "A":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_RPO_ADD;
                break;
            case "B":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_RPO_REMOVE;
                break;
            case "C":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_RPO;
                break;
            default:
                break;
        }
        m_mapOfReferences = remove(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 18; i < sRecord.length; i = i + 13) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = getElement(sRecord, i, i + 6); // feature, RPQ or PartNumber

            let sQtySign = "";
            switch (getElement(sRecord, i + 12, i + 12)) {
                case "1":
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_ADD;
                    break;
                case "2":
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_REMOVE;
                    sQtySign = "-";
                    break;
                case "3": // from
                    //case "4": // to
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_CONVERSION;
                    arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = getElement(sRecord, i, i + 6) + "_" + getElement(sRecord, i + 13, i + 19);
                    i = i + 13;
                    break;
                case "6":
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_EXCHANGEADD;
                    break;
                case "7":
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_EXCHANGEREMOVE;
                    sQtySign = "-";
                    break;
                default:
                    break;
            }

            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = sQtySign + getElement(sRecord, i + 7, i + 11);

            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);
    };
function parseRecord07(sRecord) {
        let iSys = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }
        iSys++;
        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.SYS_SEQ] = CfrConstants.CfrConstants.TABLE_SYSTEM + " " + iSys.toString();
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_DESC] = getElement(sRecord, 6, 45);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_TYPE] = getElement(sRecord, 54, 57);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_MODEL] = getElement(sRecord, 58, 60);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_SN] = getElement(sRecord, 61, 69);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_SN] = removeZeroPadding(arRecords[CfrConstants.CfrConstants.SYS_MAIN_SN]);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_SEO] = getElement(sRecord, 71, 77); //?
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_SYSTEM, iSys);
        m_mapOfRecords.set(CfrConstants.CfrConstants.TABLE_SYSTEM + iSys.toString(), arRecords);
    };
function parseRecord01(sRecord, isInstalled, isTarget) {
        if (!containsKey(m_mapOfRecords,CfrConstants.CfrConstants.TABLE_HEADER))
            return false;
        let isOk = false;
        let arRecords = getValue(m_mapOfRecords,CfrConstants.CfrConstants.TABLE_HEADER);
        switch (getElement(sRecord, 3, 3)) {
            case "1":
                if (!(isInstalled || isTarget)) {
                    arRecords[CfrConstants.CfrConstants.CFR_CODE] = CfrConstants.CfrConstants.CFR_CODE_NEW;
                    isOk = true;
                }
                break;
            case "2":
                if (isInstalled) {
                    arRecords[CfrConstants.CfrConstants.CFR_CODE] = CfrConstants.CfrConstants.CFR_CODE_MES_BASE;
                    isOk = true;
                }
                break;
            case "3":
                if (isTarget) {
                    arRecords[CfrConstants.CfrConstants.CFR_CODE] = CfrConstants.CfrConstants.CFR_CODE_MES_PROPOSED;
                    isOk = true;
                }
                break;
            case "4":
                if (!(isInstalled || isTarget)) {
                    arRecords[CfrConstants.CfrConstants.CFR_CODE] = CfrConstants.CfrConstants.CFR_CODE_MES;
                    isOk = true;
                    break;
                }
            default:
                break;
        }
        return isOk;
    };
function parseRecord38(sRecord) {
        let iSys = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Services line
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = getElement(sRecord, 3, 6) + "-" + getElement(sRecord, 7, 9);

        let sQtySign = "";
        switch (getElement(sRecord, 10, 10)) {
            case "1":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_ADD;
                break;
            case "2":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_REMOVE;
                sQtySign = "-";
                break;
            default:
                break;
        }
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = sQtySign + getElement(sRecord, 11, 15);

        switch (getElement(sRecord, 16, 16)) {
            case "1":
                arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICEPAC;
                break;
            case "2":
                arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES + " (GTS)";
                break;
            case "3":
                arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES + " (LBS)";
                break;
            case "4":
                arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES + " (Bundle)";
                break;
            default:
                break;
        }

        m_mapOfReferences = remove(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 36; i < sRecord.length; i = i + 13) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = getElement(sRecord, i, i + 6);
            sQtySign = "";

            switch (getElement(sRecord, i + 12, i + 12)) {
                case "1":
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_ADD;
                    break;
                case "2":
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_REMOVE;
                    sQtySign = "-";
                    break;
                default:
                    break;
            }
            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = sQtySign + getElement(sRecord, i + 7, i + 11);
            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);
    };
function parseRecord47(sRecord) {
        //same structure as Record 49 - Software Installed Record
        let iSys = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Software line
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        // if (m_mapOfReferences.containsKey(_LINE)) {
        // String sSystem =
        // m_mapOfRecords.get(String.valueOf(m_mapOfReferences.get(_LINE)))[_LINE_SYSTEM];
        // if ((sSystem != null) && (sSystem.equals(arRecords[_LINE_SYSTEM]))) {
        // String sGroupId =
        // m_mapOfRecords.get(String.valueOf(m_mapOfReferences.get(_LINE)))[_LINE_GROUPID];
        // if (sGroupId != null) {
        // arRecords[_LINE_GROUPID] = new String(sGroupId);
        // }
        // }
        // }
        arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_NEW;
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = getElement(sRecord, 3, 6) + "-" + getElement(sRecord, 7, 9);
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = getElement(sRecord, 10, 14);

        m_mapOfReferences = remove(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 15; i < sRecord.length; i = i + 12) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = getElement(sRecord, i, i + 6);

            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = getElement(sRecord, i + 7, i + 11);

            arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_ADD;
            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);

    };
function parseRecord50(sRecord) {
        let iSys = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Software MES/Upgrade
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = getElement(sRecord, 3, 6) + "-" + getElement(sRecord, 7, 9);
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = "1";

        switch (getElement(sRecord, 10, 10)) {
            case "1":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_NEW;
                break;
            case "2":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_DISCONTINUED;
                break;
            case "3":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_CANCELLED;
                break;
            case "4":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_FMOD;
                break;
            case "5":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_ALTERATION;
                break;
            case "6":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_CANCELLED_MES;
                break;
            case "A":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_RPO_ADD;
                break;
            case "B":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_RPO_REMOVE;
                break;
            case "C":
                arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_RPO;
                break;
            default:
                break;
        }

        m_mapOfReferences = remove(m_mapOfReferences,"96" + CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 11; i < sRecord.length; i = i + 13) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = getElement(sRecord, i, i + 6); // feature, RPQ or PartNumber

            let sQtySign = "";
            switch (getElement(sRecord, i + 12, i + 12)) {
                case "1":
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_ADD;
                    break;
                case "2":
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_REMOVE;
                    sQtySign = "-";
                    break;
                case "3": //from
                    //case "4": //to
                    arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_CONVERSION;
                    arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = getElement(sRecord, i, i + 6) + "_" + getElement(sRecord, i + 13, i + 19);
                    i = i + 13;
                    break;
                default:
                    break;
            }
            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = sQtySign + getElement(sRecord, i + 7, i + 11);

            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);

    };
function parseRecord95(sRecord) {
        let arRecords = null;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            arRecords = getValue(m_mapOfRecords,getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE));
        }
        if (arRecords == null)
            return false;

        // in case of HW/MES, there are two 95 records (FROM + TO)
        if (arRecords[CfrConstants.CfrConstants.LINE_CPUSIU] == null) {

            arRecords[CfrConstants.CfrConstants.LINE_FROMTYPE] = getElement(sRecord, 3, 6);
            if (arRecords[CfrConstants.CfrConstants.LINE_FROMTYPE].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_FROMTYPE] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_FROMMODEL] = getElement(sRecord, 7, 9);
            if (arRecords[CfrConstants.CfrConstants.LINE_FROMMODEL].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_FROMMODEL] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_FROMSN] = getElement(sRecord, 20, 28);
            arRecords[CfrConstants.CfrConstants.LINE_FROMSN] = removeZeroPadding(arRecords[CfrConstants.CfrConstants.LINE_FROMSN]);
            if (arRecords[CfrConstants.CfrConstants.LINE_FROMSN].length == 0) { // || (arRecords[ConstantsCfr.LINE_FROMSN].equals("000000000"))) {
                arRecords[CfrConstants.CfrConstants.LINE_FROMSN] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_PRICE] = getElement(sRecord, 49, 49);
            if (arRecords[CfrConstants.CfrConstants.LINE_PRICE].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_PRICE] = "Y";
            }
            if (getElement(sRecord, 50, 50) == "S") {
                // 50, 50 : system number flag: T: temporary, S: actual, blank: none
                arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE] = getElement(sRecord, 51, 54);
                arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE] = removeZeroPadding(arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE]);
                if (arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE].length == 0) {
                    arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE] = null;
                }
                arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR] = getElement(sRecord, 55, 61);
                if ((arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR].length == 0)
                    || (arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR] == "NON-SIU")
                    || (arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR] == "NEW CPU")) {
                    arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR] = null;
                }
            }
            arRecords[CfrConstants.CfrConstants.LINE_CPUSIU] = getElement(sRecord, 62, 62);
            arRecords[CfrConstants.CfrConstants.LINE_CMR] = getElement(sRecord, 76, 82);
            if (arRecords[CfrConstants.CfrConstants.LINE_CMR].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_CMR] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_CRAD] = formatDate(getElement(sRecord, 83, 90));
            arRecords[CfrConstants.CfrConstants.LINE_INSTALLDATE] = formatDate(getElement(sRecord, 91, 98));
            arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = getElement(sRecord, 143, sRecord.length);
            if (arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = null;
            }

        } else {
            arRecords[CfrConstants.CfrConstants.LINE_TOTYPE] = getElement(sRecord, 3, 6);
            if (arRecords[CfrConstants.CfrConstants.LINE_TOTYPE].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_TOTYPE] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_TOMODEL] = getElement(sRecord, 7, 9);
            if (arRecords[CfrConstants.CfrConstants.LINE_TOMODEL].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_TOMODEL] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_TOSN] = getElement(sRecord, 20, 28);
            arRecords[CfrConstants.CfrConstants.LINE_TOSN] = removeZeroPadding(arRecords[CfrConstants.CfrConstants.LINE_FROMSN]);
            if (arRecords[CfrConstants.CfrConstants.LINE_TOSN].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_TOSN] = null;
            }
            if (getElement(sRecord, 50, 50) == "S") {
                arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE] = getElement(sRecord, 51, 54);
                arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE] = removeZeroPadding(arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE]);
                if (arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE].length == 0) {
                    arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE] = null;
                }
                arRecords[CfrConstants.CfrConstants.LINE_TOSYSNBR] = getElement(sRecord, 55, 61);
                if (arRecords[CfrConstants.CfrConstants.LINE_TOSYSNBR].length == 0) {
                    arRecords[CfrConstants.CfrConstants.LINE_TOSYSNBR] = null;
                }
            }

            arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = getElement(sRecord, 143, sRecord.length);
            if (arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = null;
            }

        }
    };
function parseRecord96(sRecord) {
        let iLastLine = 0;
        let iLastSubLine = 0;
        if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLastLine = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
            if (containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE + iLastLine.toString())) {
                iLastSubLine = getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE + iLastLine.toString());
            }
        }
        if (iLastSubLine == 0)
            return;

        let iSubLine = iLastLine + 1;
        if (containsKey(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE)) {
            iSubLine = getValue(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
            iSubLine++;
        }
        m_mapOfReferences.set("96" + CfrConstants.CfrConstants.TABLE_LINE, iSubLine);

        if (iSubLine > iLastSubLine)
            return false;

        let arRecords = getValue(m_mapOfRecords,iSubLine.toString());
        if (arRecords == null)
            return false;

        let sFeature = getElement(sRecord, 3, 9);
        if ((arRecords[CfrConstants.CfrConstants.LINE_FEATURE] == null) || (sFeature != arRecords[CfrConstants.CfrConstants.LINE_FEATURE])) {
            if ((arRecords[CfrConstants.CfrConstants.LINE_TYPE] == null) || (arRecords[CfrConstants.CfrConstants.LINE_TYPE] != CfrConstants.CfrConstants.SUBLINE_TYPE_CONVERSION)) {
                return false;
            } else {
                if (arRecords[CfrConstants.CfrConstants.LINE_FEATURE].startsWith(sFeature + "_")) {
                    iSubLine--;
                    m_mapOfReferences.set("96" + CfrConstants.TABLE_LINE, iSubLine);
                    return false;
                }
                if (!arRecords[CfrConstants.CfrConstants.LINE_FEATURE].endsWith("_" + sFeature)) {
                    return false;
                }
            }
        }

        arRecords[CfrConstants.CfrConstants.LINE_PRICE] = getElement(sRecord, 29, 29);
        if (arRecords[CfrConstants.CfrConstants.LINE_PRICE].length == 0) {
            arRecords[CfrConstants.CfrConstants.LINE_PRICE] = "Y";
        }
        arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = getElement(sRecord, 51, sRecord.length);
        if (arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION].length == 0) {
            arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = null;
        }

    };
function parseRecord98(sRecord, iRecordCount) {
        let sCount = (iRecordCount + 1).toString();
        let s98 = getElement(sRecord, 3, 7);
        if (s98 != sCount) {
            m_sError = "Line count " + sCount + " isn't the same as the one in cfr (" + s98 + ")";
            return false;
        }
        return true;
    };
function parseRecord99(sRecord,lCheckSum) {
        let sCheck = computeChecksum(null, lCheckSum).toString();
        if (sCheck == null)
            return false;
        let s99 = getElement(sRecord, 3, 12);
        if (s99 != sCheck) {
            m_sError = "Checksum is incorrect";
            return false;
        }
        return true;
    };
function computeChecksum(sRecord, lCheckSum) {

        if (sRecord == null) {
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
function containsKey (map,key){
        if (map == null || map == undefined)
            return false;

        let mapObj= Array.from(map);
        for (let k in mapObj) {
            if (mapObj[k][0] == key)
                return true;
        }
        return false
    };
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
function getValue(map,key){
        if (map == null || key == null || key == '' || key == undefined)
            return null;
        let mapObj= Array.from(map);
        for (let k in mapObj) {
            if ( mapObj[k][0] == key){
               return mapObj[k][1];
            }
        }
        return null;
    };
function removeZeroPadding(sText){
        if (sText == null) return "";
        let z = 0;
        while (z < sText.length) {
            if (sText.charAt(z) != '0') {
                break;
            }
            z++;
        }
        if (z > 0) {
            sText = sText.substring(z);
        }
        return sText;
};
function remove(map,key){
        let mapObj= Array.from(map);
        for (let k in mapObj) {
            if (mapObj[k][0] == key){
                mapObj.splice(k,1);
            }
        }
        return new Map(mapObj);
}

export default {
    cfrParser
};