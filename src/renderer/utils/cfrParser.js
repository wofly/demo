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

const  cfrParser = {
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
    parseCfr(listOfLines, isCheckSum, isInstalled, isTarget){
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
            switch (this.getElement(sRecord, 1, 2)) {
                case "00":
                    // header
                    this.parseRecord00(sRecord);
                    if (!this.containsKey(m_mapOfRecords,CfrConstants.CfrConstants.TABLE_HEADER))
                        return null;
                    break;
                case "06":
                    break;
                case "07":
                    // logical system
                    isDetails = false;
                    this.parseRecord07(sRecord);
                    break;
                case "01":
                    // section separator for [base / proposed] order
                    isDetails = this.parseRecord01(sRecord, isInstalled, isTarget);
                    break;
                case "08":
                    // HW
                    if (!(isInstalled || isTarget))
                        this.parseRecord08(sRecord);
                    break;
                case "19":
                    // HW MES
                    if (!(isInstalled || isTarget))
                        this.parseRecord19(sRecord);
                    break;
                case "25":
                    // HW BASE
                    if (isInstalled)
                        this.parseRecord08(sRecord);
                    break;
                case "26":
                    // HW PROPOSED
                    if (isTarget)
                        this.parseRecord08(sRecord);
                    break;
                case "38":
                    // services
                    if (!(isInstalled || isTarget))
                        this.parseRecord38(sRecord);
                    break;
                case "47":
                    // SW
                    if (!(isInstalled || isTarget))
                        this.parseRecord47(sRecord);
                    break;
                case "48":
                    // SW PROPOSED
                    if (isTarget)
                        this.parseRecord47(sRecord);
                    break;
                case "49":
                    // SW BASE
                    if (isInstalled)
                        this.parseRecord47(sRecord);
                    break;
                case "50":
                    // SW MES
                    if (!(isInstalled || isTarget))
                        this.parseRecord50(sRecord);
                    break;
                case "95":
                    if (isDetails) {
                        this.parseRecord95(sRecord);
                    }
                    break;
                case "96":
                    if (isDetails) {
                        this.parseRecord96(sRecord);
                    }
                    break;
                case "98":
                    if (isCheckSum) {
                        if (!this.parseRecord98(sRecord, iRecordCount))
                            return null;
                    }
                    break;
                case "99":
                    if (isCheckSum) {
                        if (!this.parseRecord99(sRecord, lCheckSum))
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
                lCheckSum = this.computeChecksum(sRecord, lCheckSum);
            if (isEOF)
                break;
        }
    },
    getElement(sRecord, iBegin, iEnd) {
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
    },
    formatDate(sYYYYMMDD) {
        let sDate = sYYYYMMDD;
        if ((sYYYYMMDD != null) && (sYYYYMMDD.length > 7)) {
            sDate = sYYYYMMDD.substring(0, 4) + "-" + sYYYYMMDD.substring(4, 6) + "-" + sYYYYMMDD.substring(6, 8);
        }
        return sDate;
    },
    parseRecord00(sRecord) {
        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        let sValue = this.getElement(sRecord, 3, 4);
        // only V31. V30 or V41 aren't expected
        if (sValue != "31") {
            m_sError = "Version " + sValue + " isn't supported.";
            return false;
        }

        arRecords[CfrConstants.CfrConstants.CFR_DATE] = this.formatDate(this.getElement(sRecord, 5, 12));

        switch (this.getElement(sRecord, 13, 14)) {
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
            switch (this.getElement(sRecord, 15, 15)) {
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
            arRecords[CfrConstants.CfrConstants.CFR_APPNAME] += " (" + this.getElement(sRecord, 21, 32) + ")";
        }

        switch (this.getElement(sRecord, 16, 20)) {
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

        switch (this.getElement(sRecord, 39, 39)) {
            case "":
            case "0":
                arRecords[CfrConstants.CfrConstants.CFR_LOCKED] = "N";
                break;
            default:
                arRecords[CfrConstants.CfrConstants.CFR_LOCKED] = "Y";
                break;
        }

        switch (this.getElement(sRecord, 41, 41)) {
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

        arRecords[CfrConstants.CfrConstants.CFR_DESCRIPTION] = this.getElement(sRecord, 42, 81);
        arRecords[CfrConstants.CfrConstants.CFR_EXP_DATE] = this.formatDate(getElement(sRecord, 94, 101));
        arRecords[CfrConstants.CfrConstants.CFR_COUNTRY] = this.getElement(sRecord, 141, 142);
        arRecords[CfrConstants.CfrConstants.CFR_LANGUAGE] = this.getElement(sRecord, 143, 144);

        m_mapOfRecords.set(CfrConstants.CfrConstants.TABLE_HEADER, arRecords);
    },
    parseRecord08(sRecord) {
        //same structure as Record 25 - Hardware Installed
        let iSys = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Hardware line
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        arRecords[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.LINE_TYPE_NEW;
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = this.getElement(sRecord, 3, 6) + "-" + this.getElement(sRecord, 8, 10);
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = this.getElement(sRecord, 11, 15);

        m_mapOfReferences = this.remove(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 16; i < sRecord.length; i = i + 12) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = this.getElement(sRecord, i, i + 6);

            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = this.getElement(sRecord, i + 7, i + 11);

            arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_ADD;
            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);
    },
    parseRecord19(sRecord) {
        let iSys = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array[CfrConstants.CfrConstants.ARRAY_SIZE];
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Hardware MES/Upgrade
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_HARDWARE;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = this.getElement(sRecord, 3, 6) + "-" + this.getElement(sRecord, 7, 9);
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = "1";

        if (this.getElement(sRecord, 10, 13).length > 0) {
            arRecords[CfrConstants.CfrConstants.LINE_MTM] = arRecords[CfrConstants.CfrConstants.LINE_MTM] + "_" + this.getElement(sRecord, 10, 13) + "-"
                + this.getElement(sRecord, 14, 16);
        }

        switch (this.getElement(sRecord, 17, 17)) {
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
        m_mapOfReferences = this.remove(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 18; i < sRecord.length; i = i + 13) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = this.getElement(sRecord, i, i + 6); // feature, RPQ or PartNumber

            let sQtySign = "";
            switch (this.getElement(sRecord, i + 12, i + 12)) {
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
                    arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = this.getElement(sRecord, i, i + 6) + "_" + this.getElement(sRecord, i + 13, i + 19);
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

            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = sQtySign + this.getElement(sRecord, i + 7, i + 11);

            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);
    },
    parseRecord07(sRecord) {
        let iSys = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }
        iSys++;
        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.SYS_SEQ] = CfrConstants.CfrConstants.TABLE_SYSTEM + " " + iSys.toString();
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_DESC] = this.getElement(sRecord, 6, 45);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_TYPE] = this.getElement(sRecord, 54, 57);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_MODEL] = this.getElement(sRecord, 58, 60);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_SN] = this.getElement(sRecord, 61, 69);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_SN] = this.removeZeroPadding(arRecords[CfrConstants.CfrConstants.SYS_MAIN_SN]);
        arRecords[CfrConstants.CfrConstants.SYS_MAIN_SEO] = this.getElement(sRecord, 71, 77); //?
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_SYSTEM, iSys);
        m_mapOfRecords.set(CfrConstants.CfrConstants.TABLE_SYSTEM + iSys.toString(), arRecords);
    },
    parseRecord01(sRecord, isInstalled, isTarget) {
        if (!this.containsKey(m_mapOfRecords,CfrConstants.CfrConstants.TABLE_HEADER))
            return false;
        let isOk = false;
        let arRecords = this.getValue(m_mapOfRecords,CfrConstants.CfrConstants.TABLE_HEADER);
        switch (this.getElement(sRecord, 3, 3)) {
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
    },
    parseRecord38(sRecord) {
        let iSys = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Services line
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SERVICES;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = this.getElement(sRecord, 3, 6) + "-" + this.getElement(sRecord, 7, 9);

        let sQtySign = "";
        switch (this.getElement(sRecord, 10, 10)) {
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
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = sQtySign + this.getElement(sRecord, 11, 15);

        switch (this.getElement(sRecord, 16, 16)) {
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

        m_mapOfReferences = this.remove(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 36; i < sRecord.length; i = i + 13) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = this.getElement(sRecord, i, i + 6);
            sQtySign = "";

            switch (this.getElement(sRecord, i + 12, i + 12)) {
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
            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = sQtySign + this.getElement(sRecord, i + 7, i + 11);
            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);
    },
    parseRecord47(sRecord) {
        //same structure as Record 49 - Software Installed Record
        let iSys = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
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
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = this.getElement(sRecord, 3, 6) + "-" + this.getElement(sRecord, 7, 9);
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = this.getElement(sRecord, 10, 14);

        m_mapOfReferences = this.remove(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 15; i < sRecord.length; i = i + 12) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = this.getElement(sRecord, i, i + 6);

            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = this.getElement(sRecord, i + 7, i + 11);

            arSubLine[CfrConstants.CfrConstants.LINE_TYPE] = CfrConstants.CfrConstants.SUBLINE_TYPE_ADD;
            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);

    },
    parseRecord50(sRecord) {
        let iSys = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM)) {
            iSys = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_SYSTEM);
        }

        let iLineNbr = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLineNbr = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
        }
        iLineNbr = iLineNbr + 1000;

        let arRecords = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
        arRecords[CfrConstants.CfrConstants.LINE_SYSTEM] = iSys.toString();

        // Software MES/Upgrade
        arRecords[CfrConstants.CfrConstants.LINE_NO] = iLineNbr.toString();
        arRecords[CfrConstants.CfrConstants.LINE_PRODUCT_TYPE] = CfrConstants.CfrConstants.LINE_PRODUCT_TYPE_SOFTWARE;
        // arRecords[_LINE_GROUPID] = String.valueOf(iLineNbr);
        arRecords[CfrConstants.CfrConstants.LINE_MTM] = this.getElement(sRecord, 3, 6) + "-" + this.getElement(sRecord, 7, 9);
        arRecords[CfrConstants.CfrConstants.LINE_QTY] = "1";

        switch (this.getElement(sRecord, 10, 10)) {
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

        m_mapOfReferences = this.remove(m_mapOfReferences,"96" + CfrConstants.TABLE_LINE);
        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE, iLineNbr);
        m_mapOfRecords.set(iLineNbr.toString(), arRecords);

        let iSubLineNbr = 0;
        for (let i = 11; i < sRecord.length; i = i + 13) {
            let arSubLine = new Array(CfrConstants.CfrConstants.ARRAY_SIZE);
            iSubLineNbr++;
            arSubLine[CfrConstants.CfrConstants.LINE_NO] = (iLineNbr + iSubLineNbr).toString();
            arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = this.getElement(sRecord, i, i + 6); // feature, RPQ or PartNumber

            let sQtySign = "";
            switch (this.getElement(sRecord, i + 12, i + 12)) {
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
                    arSubLine[CfrConstants.CfrConstants.LINE_FEATURE] = this.getElement(sRecord, i, i + 6) + "_" + this.getElement(sRecord, i + 13, i + 19);
                    i = i + 13;
                    break;
                default:
                    break;
            }
            arSubLine[CfrConstants.CfrConstants.LINE_QTY] = sQtySign + this.getElement(sRecord, i + 7, i + 11);

            m_mapOfRecords.set((iLineNbr + iSubLineNbr).toString(), arSubLine);
        }

        m_mapOfReferences.set(CfrConstants.CfrConstants.TABLE_LINE + iLineNbr.toString(), iLineNbr + iSubLineNbr);

    },
    parseRecord95(sRecord) {
        let arRecords = null;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            arRecords = this.getValue(m_mapOfRecords,this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE));
        }
        if (arRecords == null)
            return false;

        // in case of HW/MES, there are two 95 records (FROM + TO)
        if (arRecords[CfrConstants.CfrConstants.LINE_CPUSIU] == null) {

            arRecords[CfrConstants.CfrConstants.LINE_FROMTYPE] = this.getElement(sRecord, 3, 6);
            if (arRecords[CfrConstants.CfrConstants.LINE_FROMTYPE].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_FROMTYPE] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_FROMMODEL] = this.getElement(sRecord, 7, 9);
            if (arRecords[CfrConstants.CfrConstants.LINE_FROMMODEL].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_FROMMODEL] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_FROMSN] = this.getElement(sRecord, 20, 28);
            arRecords[CfrConstants.CfrConstants.LINE_FROMSN] = this.removeZeroPadding(arRecords[CfrConstants.CfrConstants.LINE_FROMSN]);
            if (arRecords[CfrConstants.CfrConstants.LINE_FROMSN].length == 0) { // || (arRecords[ConstantsCfr.LINE_FROMSN].equals("000000000"))) {
                arRecords[CfrConstants.CfrConstants.LINE_FROMSN] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_PRICE] = this.getElement(sRecord, 49, 49);
            if (arRecords[CfrConstants.CfrConstants.LINE_PRICE].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_PRICE] = "Y";
            }
            if (this.getElement(sRecord, 50, 50) == "S") {
                // 50, 50 : system number flag: T: temporary, S: actual, blank: none
                arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE] = this.getElement(sRecord, 51, 54);
                arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE] = this.removeZeroPadding(arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE]);
                if (arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE].length == 0) {
                    arRecords[CfrConstants.CfrConstants.LINE_FROMSYSTYPE] = null;
                }
                arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR] = this.getElement(sRecord, 55, 61);
                if ((arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR].length == 0)
                    || (arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR] == "NON-SIU")
                    || (arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR] == "NEW CPU")) {
                    arRecords[CfrConstants.CfrConstants.LINE_FROMSYSNBR] = null;
                }
            }
            arRecords[CfrConstants.CfrConstants.LINE_CPUSIU] = this.getElement(sRecord, 62, 62);
            arRecords[CfrConstants.CfrConstants.LINE_CMR] = this.getElement(sRecord, 76, 82);
            if (arRecords[CfrConstants.CfrConstants.LINE_CMR].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_CMR] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_CRAD] = this.formatDate(this.getElement(sRecord, 83, 90));
            arRecords[CfrConstants.CfrConstants.LINE_INSTALLDATE] = this.formatDate(this.getElement(sRecord, 91, 98));
            arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = this.getElement(sRecord, 143, sRecord.length);
            if (arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = null;
            }

        } else {
            arRecords[CfrConstants.CfrConstants.LINE_TOTYPE] = this.getElement(sRecord, 3, 6);
            if (arRecords[CfrConstants.CfrConstants.LINE_TOTYPE].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_TOTYPE] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_TOMODEL] = this.getElement(sRecord, 7, 9);
            if (arRecords[CfrConstants.CfrConstants.LINE_TOMODEL].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_TOMODEL] = null;
            }
            arRecords[CfrConstants.CfrConstants.LINE_TOSN] = this.getElement(sRecord, 20, 28);
            arRecords[CfrConstants.CfrConstants.LINE_TOSN] = this.removeZeroPadding(arRecords[CfrConstants.CfrConstants.LINE_FROMSN]);
            if (arRecords[CfrConstants.CfrConstants.LINE_TOSN].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_TOSN] = null;
            }
            if (this.getElement(sRecord, 50, 50) == "S") {
                arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE] = this.getElement(sRecord, 51, 54);
                arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE] = this.removeZeroPadding(arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE]);
                if (arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE].length == 0) {
                    arRecords[CfrConstants.CfrConstants.LINE_TOSYSTYPE] = null;
                }
                arRecords[CfrConstants.CfrConstants.LINE_TOSYSNBR] = this.getElement(sRecord, 55, 61);
                if (arRecords[CfrConstants.CfrConstants.LINE_TOSYSNBR].length == 0) {
                    arRecords[CfrConstants.CfrConstants.LINE_TOSYSNBR] = null;
                }
            }

            arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = this.getElement(sRecord, 143, sRecord.length);
            if (arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION].length == 0) {
                arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = null;
            }

        }
    },
    parseRecord96(sRecord) {
        let iLastLine = 0;
        let iLastSubLine = 0;
        if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE)) {
            iLastLine = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE);
            if (this.containsKey(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE + iLastLine.toString())) {
                iLastSubLine = this.getValue(m_mapOfReferences,CfrConstants.CfrConstants.TABLE_LINE + iLastLine.toString());
            }
        }
        if (iLastSubLine == 0)
            return;

        let iSubLine = iLastLine + 1;
        if (this.containsKey(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE)) {
            iSubLine = this.getValue(m_mapOfReferences,"96" + CfrConstants.CfrConstants.TABLE_LINE);
            iSubLine++;
        }
        m_mapOfReferences.set("96" + CfrConstants.CfrConstants.TABLE_LINE, iSubLine);

        if (iSubLine > iLastSubLine)
            return false;

        let arRecords = this.getValue(m_mapOfRecords,iSubLine.toString());
        if (arRecords == null)
            return false;

        let sFeature = this.getElement(sRecord, 3, 9);
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

        arRecords[CfrConstants.CfrConstants.LINE_PRICE] = this.getElement(sRecord, 29, 29);
        if (arRecords[CfrConstants.CfrConstants.LINE_PRICE].length == 0) {
            arRecords[CfrConstants.CfrConstants.LINE_PRICE] = "Y";
        }
        arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = this.getElement(sRecord, 51, sRecord.length);
        if (arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION].length == 0) {
            arRecords[CfrConstants.CfrConstants.LINE_DESCRIPTION] = null;
        }

    },
    parseRecord98(sRecord, iRecordCount) {
        let sCount = (iRecordCount + 1).toString();
        let s98 = this.getElement(sRecord, 3, 7);
        if (s98 != sCount) {
            m_sError = "Line count " + sCount + " isn't the same as the one in cfr (" + s98 + ")";
            return false;
        }
        return true;
    },
    parseRecord99(sRecord,lCheckSum) {
        let sCheck = this.computeChecksum(null, lCheckSum).toString();
        if (sCheck == null)
            return false;
        let s99 = this.getElement(sRecord, 3, 12);
        if (s99 != sCheck) {
            m_sError = "Checksum is incorrect";
            return false;
        }
        return true;
    },
    computeChecksum(sRecord, lCheckSum) {

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
    },
    containsKey (map,key){
        if (map == null || map == undefined)
            return false;

        let mapObj= Array.from(map);
        for (let k in mapObj) {
            if (mapObj[k][0] == key)
                return true;
        }
        return false
    },
    getValue(map,key){
        if (map == null || key == null || key == '' || key == undefined)
            return null;
        let mapObj= Array.from(map);
        for (let k in mapObj) {
            if ( mapObj[k][0] == key){
               return mapObj[k][1];
            }
        }
        return null;
    },
    removeZeroPadding(sText){
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
    },
    remove(map,key){
        let mapObj= Array.from(map);
        for (let k in mapObj) {
            if (mapObj[k][0] == key){
                mapObj.splice(k,1);
            }
        }
        return new Map(mapObj);
    }
}

export default {
    cfrParser
};