
const CfrConstants = {
    /**
     * Identifies a HEADER row
     */
    TABLE_HEADER : "HEADER",
    /**
     * Header description row
     */
    CSV_CFR : [ "CFR DATE", "CFR APPLICATION", "BRAND", "TYPE", "USER DESCRIPTION",
                "COUNTRY CODE", "COUNTRY", "LANGUAGE", "LOCKED", "EXPIRATION DATE", "CODE", "", "", "", "", "", "", "", "",
                "", "", "" ],
    /**
     * Identifies the column indices in HEADER row for the CFR action code like new order or MES
     */
    CFR_CODE : 10,
    /**
     * CFR type for NEW order: INITIAL ORDER CONFIGURATION
     */
    CFR_CODE_NEW : "INITIAL ORDER CONFIGURATION",
    /**
     * CFR type for MES order: ORDER TRANSACTIONS
     */
    CFR_CODE_MES : "ORDER TRANSACTIONS",
    /**
     * CFR type for MES order installed system: BASE CONFIGURATION
     */
    CFR_CODE_MES_BASE : "BASE CONFIGURATION",
    /**
     * CFR type for MES order target system: PROPOSED CONFIGURATION
     */
     CFR_CODE_MES_PROPOSED : "PROPOSED CONFIGURATION",

    /**
     * Identifies the column indices in SYSTEM row for the system name description.
     */
    SYS_MAIN_DESC : 1,

    /**
     * Identifies the column indices in SYSTEM row for system type.
     */
    SYS_MAIN_TYPE : 2,

    /**
     * Identifies the column indices in SYSTEM row for system model.
     */
    SYS_MAIN_MODEL : 3,

    /**
     * Identifies the column indices in SYSTEM row for system serial number (for example in case of upgrade).
     */
    SYS_MAIN_SN : 4,

    /**
     * Identifies the column indices in SYSTEM row for system SEO (preconfigured model, not expected).
     */
    SYS_MAIN_SEO : 5,

    /**
     * Identifies the column indices in LINE or SUBLINE row for line number
     */
    LINE_NO : 0,
    /**
     * Identifies the column indices in LINE row for MachineType-Model
     */
    LINE_MTM : 1,
    /**
     * <p>Identifies the column indices in LINE or SUBLINE row for material type:</p>
     * <ul>
     * <li>Hardware</li>
     * <li>Software</li>
     * <li>Services</li>
     * <li>ServicePac</li>
     * </ul>
     */
    LINE_PRODUCT_TYPE : 6,
    /**
     * <p>Identifies the column indices in LINE or SUBLINE row for material action:</p>
     * <ul>
     * <li>NEW</li>
     * <li>FMOD</li>
     * <li>UPGRADE</li>
     * <li>ALTERATION</li>
     * <li>DISCONTINUED</li>
     * <li>CANCELLED</li>
     * <li>RPO</li>
     * <li>RPO ADD</li>
     * <li>RPO REMOVE</li>
     * </ul>
     */
    LINE_TYPE : 5,
    /**
     * <p>NEW line (MTM) material action</p>
     */
    LINE_TYPE_NEW : "NEW",
    /**
     * <p>DISCONTINUED (remove from inventory) line (MTM) material action</p>
     */
    LINE_TYPE_DISCONTINUED : "DISCO",
    /**
     * <p>CANCELLED order line (MTM) material action</p>
     */
    LINE_TYPE_CANCELLED : "CANCELLED",
    /**
     * <p>CANCELLED MES line (MTM) material action</p>
     */
    LINE_TYPE_CANCELLED_MES : "CANCELLED MES",
    /**
     * <p>FMOD: Feature Upgrade line (MTM) material action</p>
     */
    LINE_TYPE_FMOD : "FMOD",
    /**
     * <p>UPGRADE: Model Upgrade line (MTM) material action; MTM are separated with an underscore like fromtype-frommodel_totype-tomodel</p>
     */
    LINE_TYPE_UPGRADE : "UPGRADE",
    /**
     * <p>ALTERATION line (MTM) material action</p>
     */
    LINE_TYPE_ALTERATION : "ALTERATION",
    /**
     * <p>RPO line (MTM) material action</p>
     */
    LINE_TYPE_RPO : "RPO",
    /**
     * <p>RPO ADD line (MTM) material action</p>
     */
    LINE_TYPE_RPO_ADD : "RPO ADD",
    /**
     * <p>RPO REMOVE line (MTM) material action</p>
     */
    LINE_TYPE_RPO_REMOVE : "RPO REMOVE",
    /**
     * <p>ADD subline (feature) material action</p>
     */
    SUBLINE_TYPE_ADD : "ADD",
    /**
     * <p>REMOVE subline (feature) material action; quantity is set as negative value</p>
     */
    SUBLINE_TYPE_REMOVE : "REMOVE",
    /**
     * <p>CONVERSION subline (feature) material action; features are separated with an underscore like from_to</p>
     */
    SUBLINE_TYPE_CONVERSION : "CONVERSION",
    /**
     * <p>EXCHANGEADD subline (feature) material action</p>
     */
    SUBLINE_TYPE_EXCHANGEADD : "EXCHANGEADD",
    /**
     * <p>EXCHANGEREMOVE subline (feature) material action; quantity is set as negative value</p>
     */
    SUBLINE_TYPE_EXCHANGEREMOVE : "EXCHANGEREMOVE",
    /**
     * <p>Hardware line (MTM) material type</p>
     */
    LINE_PRODUCT_TYPE_HARDWARE : "Hardware",
    /**
     * <p>Software line (MTM) material type</p>
     */
    LINE_PRODUCT_TYPE_SOFTWARE : "Software",
    /**
     * <p>Services line (MTM) material type</p>
     */
    LINE_PRODUCT_TYPE_SERVICES : "Services",
    /**
     * <p>ServicePac line (MTM) material type</p>
     */
    LINE_PRODUCT_TYPE_SERVICEPAC : "ServicePac",
    /**
     * Identifies the column indices in LINE or SUBLINE row for Customer Requested Arrival Date
     */
    LINE_CRAD : 10,
    /**
     * Identifies the column indices in SUBLINE row for Feature code
     */
    LINE_FEATURE : 2,
    /**
     * Identifies the column indices in HEADER row for the CFR date
     */
    CFR_DATE : 0,
    /**
     * Identifies the column indices in HEADER row for the CFR application which created the CFR, and the configurator version, release and model number
     */
    CFR_APPNAME : 1,
    /**
     * Geo Asia Pacific: AP
     */
    GEO_AP : "AP",
    /**
     * IPS OnShore China country code: 672
     */
    CHINA_COUNTRY_CODE : "672",
    /**
     * Identifies the column indices in HEADER row for the CFR type (HW, SW, HWSW)
     */
    CFR_TYPE : 3,
    /**
     * Identifies the column indices in HEADER row for the CFR user description
     */
    CFR_DESCRIPTION : 4,
    /**
     * Identifies the column indices in HEADER row for the ISO Country code (2 characters)
     */
    CFR_COUNTRY : 6,
    /**
     * IPS OnShore China country iso: CN
     */
    CHINA_COUNTRY_ISO : "CN",
    /**
     * Identifies the column indices in HEADER row for the user language code (2 characters)
     */
    CFR_LANGUAGE : 7,
    /**
     * Identifies the column indices in HEADER row for the CFR locked status flag (Y/N, Y means CFR not valid for order)
     */
    CFR_LOCKED : 8,
    /**
     * Identifies the column indices in HEADER row for the CFR expiration date
     */
    CFR_EXP_DATE : 9,
    /**
     * IPS OnShore China language: zh
     */
    CHINA_LANGUAGE : "zh",
    /**
     * Identifies the column indices in LINE or SUBLINE row for material quantity (at row level)
     */
    LINE_QTY : 4,
    /**
     * Identifies the column indices in LINE row for SIU (System Identification Unit) or CPU
     * 0: not SIU (component)
     * 1: SIU and CPU (computer)
     * 2: SIU and not CPU (terminal)
     */
    LINE_CPUSIU : 8,
    /**
     * Identifies the column indices in LINE row for material chargeable flag (Y/N)
     */
    LINE_PRICE : 9,
    /**
     * Identifies the column indices in LINE row for Inventory system MachineType
     */
    LINE_FROMTYPE : 11,
    /**
     * Identifies the column indices in LINE row for Inventory system Model
     */
    LINE_FROMMODEL : 12,
    /**
     * Identifies the column indices in LINE row for Inventory system Serial Number
     */
    LINE_FROMSN : 13,
    /**
     * Identifies the column indices in LINE row for Inventory system Type
     */
        LINE_FROMSYSTYPE : 14,
    /**
     * Identifies the column indices in LINE row for Inventory system Number
     */
    LINE_FROMSYSNBR : 15,
    /**
     * Identifies the column indices in LINE row for Install Date
     */
    LINE_INSTALLDATE : 16,
    /**
     * Identifies the column indices in LINE row for the customer number for whom the order has been placed.
     */
    LINE_CMR : 17,
    /**
     * Identifies the column indices in LINE row for New system MachineType
     */
    LINE_TOTYPE : 18,
    /**
     * Identifies the column indices in LINE row for New system Model
     */
    LINE_TOMODEL : 19,
    /**
     * Identifies the column indices in LINE row for New system Serial Number
     */
    LINE_TOSN : 20,
    /**
     * Identifies the column indices in LINE row for New system Type
     */
    LINE_TOSYSTYPE : 21,
    /**
     * Identifies the column indices in LINE row for New system Number
     */
    LINE_TOSYSNBR : 22,
    /**
     * Identifies the column indices in LINE or SUBLINE (optional) row for material description
     */
    LINE_DESCRIPTION : 3,
    /**
     * <p>Identifies the column indices in SYSTEM row for the SYSTEM sequence id.</p>
     * <p>In case of multiple quantity, each order has its own system number</p>
     */
    SYS_SEQ : 0,
    /**
     * Identifies a SYSTEM row
     */
    TABLE_SYSTEM : "SYSTEM",
    /**
     * Identifies a LINE row (MTM)
     */
    TABLE_LINE : "LINE",
    /**
     * Identifies the column indices in HEADER row for the IPS country code (3 digits format to help differentiate between on or off shore model)
     */
    CFR_COUNTRY_IPS : 5,
    /**
     * Identifies the column indices in LINE row for system sequence identifier
     */
    LINE_SYSTEM : 7,
    /**
     * Maximum number of columns in the row
     */
    ARRAY_SIZE : 23,
};


export default {
    CfrConstants
};