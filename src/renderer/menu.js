
/*--------------------------------------------900942A---------------------------------------------*/
import Goods from './components/900942A/Goods.vue';
/* -------------初始化展示页面----------------*/
import Login from './pages/menu/login.vue';
/* -------------硬件列表清单----------------*/
import Hardware from './components/900942A/Hardware.vue';
/* -------------方案详情----------------*/
import Projectpar from './components/900942A/Projectpar.vue';
/* -------------选择产品----------------*/
import ProductSelection from './components/900942A/ProductSelection.vue';
/* -------------新建方案----------------*/
import ProgrammeAdd from './components/900942A/ProgrammeAdd.vue';
/* -------------选择模板----------------*/
import SelectTemplate from './components/900942A/SelectTemplate.vue';
/* -------------配件-------------------*/
import AccessoriesSelection from './components/900942A/AccessoriesSelection.vue';
/* -------------配件 线缆-------------------*/
import AccessoriesCable from './components/900942A/AccessoriesCable.vue';
/* -------------配件 其他-------------------*/
import AccessoriesOther from './components/900942A/AccessoriesOther.vue';
/* -------------内部硬盘------------------*/
import InsideHardDiskDrive from './components/900942A/InsideHardDiskDrive.vue';
/* -------------外部硬盘（扩展柜）------------------*/
import ExternalHardDisk from './components/900942A/ExternalHardDisk.vue';
/* -------------外部扩展柜------------------*/
import ExternalHardDiskExpansion from './components/900942A/ExternalHardDiskExpansion.vue';
/* -------------CPU------------------*/
import Processor from './components/900942A/Processor.vue';
/* -------------内存------------------*/
import Memory from './components/900942A/Memory.vue';
/* -------------电源------------------*/
import PowerLine from './components/900942A/PowerLine.vue';
/* -------------内部PCle------------------*/
import InteriorPcle from './components/900942A/InteriorPcle.vue';
/* -------------外部PCle------------------*/
import ExternalPcie from './components/900942A/ExternalPcie.vue';
/* -------------软件组件------------------*/
import Downen from './components/900942A/Downen.vue';
/* -------------软件配置子组件逻辑分区------------------*/
import Logic from './components/900942A/Logic.vue';
/* -------------软件配置子组件操作系统------------------*/
import Operation from './components/900942A/Operation.vue';
/* -------------软件配置子组件Y应用程序------------------*/
import ProgramList from './components/900942A/programList.vue';
/* -------------确认组件------------------*/
import Affirm from './components/900942A/Affirm.vue';
/* -------------设置详情------------------*/
import ProBack from './components/900942A/ProBack.vue';
/*---------------前置硬盘--------------------*/
import FrontHardDisk from './components/900942A/FrontHardDisk.vue';
/*---------------中置硬盘--------------------*/
import MiddleHardDisk from './components/900942A/MiddleHardDisk.vue';

/*----------------------------------------9040MR9------------------------------------------------------*/
/* -------------硬件列表清单----------------*/
import Hardware950 from './components/9040MR9/Hardware.vue';
/* -------------CPU------------------*/
 import Processor950 from './components/9040MR9/Processor.vue';
/*---------------------内存页面--------------------------*/
 import Memory950 from './components/9040MR9/Memory.vue';
/* -------------外部扩展柜------------------*/
import ExternalHardDisk950 from './components/9040MR9/ExternalHardDisk.vue';
/* -------------外部PCle------------------*/
import ExternalPcie950 from './components/9040MR9/ExternalPcie.vue';
/* -------------内部硬盘------------------*/
import InsideHardDiskDrive950 from './components/9040MR9/InsideHardDiskDrive.vue';
/*---------------电源--------------------*/
import PowerLine950 from './components/9040MR9/PowerLine.vue';
/*---------------内部PCIe--------------------*/
import InteriorPcle950 from './components/9040MR9/interiorPcle.vue';
/* -------------软件组件------------------*/
import Downen950 from './components/9040MR9/Downen.vue';
/* -------------软件配置子组件逻辑分区------------------*/
import Logic950 from './components/9040MR9/Logic.vue';
/* -------------软件配置子组件操作系统------------------*/
import Operation950 from './components/9040MR9/Operation.vue';
/* -------------软件配置子组件操作系统------------------*/
import ProgramList950 from './components/9040MR9/programList.vue';
/* -------------确认组件------------------*/
import Affirm950 from './components/9040MR9/Affirm.vue';
/* -------------设置详情------------------*/
import ProBack950 from './components/9040MR9/ProBack.vue';
/* -------------配件-------------------*/
import AccessoriesSelection950 from './components/9040MR9/AccessoriesSelection.vue';

/* -------------整体校验-------------------*/
import OnlineCheck from './pages/OnlineCheck.vue';

/* -------------整体校验-------------------*/
import ConvertTools from './pages/ConvertTools.vue';

const menu = [
  { // 首页页面默认的路由，右侧的详情
    icon: 'cube',
    title: '物品管理',
    path: '/Login',
    component: Login,
  },
  { // 整体校验
      title: '整体校验',
      path: '/OnlineCheck',
      component: OnlineCheck,
  },
  { // 整体校验
      title: '整体校验',
      path: '/ConvertTools',
      component: ConvertTools,
  },
  { /* -------------选择产品----------------*/
    path: '/ProductSelection',
    component: ProductSelection,
  },
  { /* -------------新建方案----------------*/
    path: '/ProBack',
    component: ProBack,
  },
  { /* -------------设置详情----------------*/
    path: '/ProgrammeAdd',
    component: ProgrammeAdd,
  },
  { /* -------------选择模板----------------*/
    path: '/SelectTemplate',
    component: SelectTemplate,
  },
  { /* -------------选择模板----------------*/
    path: '/Goods',
    component: Goods,
  },

  {
    path: '/Projectpar',
    component: Projectpar,
  },
  /* ------------- 内部硬盘  前置硬盘----------------*/
  {
    path: '/FrontHardDisk',
    component: FrontHardDisk,
  },
  /* ------------- 内部硬盘  中置硬盘----------------*/
  {
    path: '/MiddleHardDisk',
    component: MiddleHardDisk,
  },
  /* ------------- 外部扩展柜----------------*/
  {
    path: '/ExternalHardDiskExpansion',
    component: ExternalHardDiskExpansion,
  },
  /* ------------- 配置  线缆----------------*/
  {
    path: '/AccessoriesCable',
    component: AccessoriesCable,
  },
  /* ------------- 配置  其他----------------*/
  {
    path: '/AccessoriesOther',
    component: AccessoriesOther,
  },
  { // 暂时用一下，后期要换
    path: '/Hardware',
    component: Hardware,
    children: [
      { /* -------------配件-------------------*/
        path: '/Hardware/AccessoriesSelection',
        component: AccessoriesSelection,
      }, {/* -------------内部硬盘------------------*/
        path: '/Hardware/InsideHardDiskDrive',
        component: InsideHardDiskDrive,

      }, {/* -------------外部硬盘（扩展柜）------------------*/
        path: '/Hardware/ExternalHardDisk',
        component: ExternalHardDisk,

      }, {/* -------------cpu------------------*/
        path: '/Hardware/Processor',
        component: Processor,
      }, {/* -------------内存------------------*/
        path: '/Hardware/Memory',
        component: Memory,
      }, {/* -------------电源------------------*/
        path: '/Hardware/PowerLine',
        component: PowerLine,
      },{/* -------------内部PCle------------------*/
        path: '/Hardware/InteriorPcle',
        component: InteriorPcle,
      } ,{/* -------------外部PCle------------------*/
        path: '/Hardware/ExternalPcie',
        component: ExternalPcie,
      },
    ],
  },
  {
    path: '/Downen',
    component: Downen,
    children:[
      {
        path: '/Downen/ProgramList',
        component: ProgramList,
      },
      {
        path: '/Downen/Operation',
        component: Operation,
      },
      {
        path: '/Downen/Logic',
        component: Logic,
      },
    ],
  },
  {
    path: '/Affirm',
    component: Affirm,
  },
  /*-----------------------950的------------------------------*/
  { /* -------------新建方案----------------*/
    path: '/ProBack950',
    component: ProBack950,
  },
  {
    path: '/Hardware950',
    component: Hardware950,
    children: [
      { /* -------------配件-------------------*/
        path: '/Hardware950/AccessoriesSelection',
        component: AccessoriesSelection950,
      }, {/* -------------内部硬盘------------------*/
        path: '/Hardware950/InsideHardDiskDrive',
        component: InsideHardDiskDrive950,

      }, {/* -------------外部硬盘（扩展柜）------------------*/
        path: '/Hardware950/ExternalHardDisk',
        component: ExternalHardDisk950,

      }, {/* -------------cpu------------------*/
        path: '/Hardware950/Processor',
        component: Processor950,
      }, {/* -------------内存------------------*/
        path: '/Hardware950/Memory',
        component: Memory950,
      }, {/* -------------电源------------------*/
        path: '/Hardware950/PowerLine',
        component: PowerLine950,
      },{/* -------------内部PCle------------------*/
        path: '/Hardware950/InteriorPcle',
        component: InteriorPcle950,
      } ,{/* -------------外部PCle------------------*/
        path: '/Hardware950/ExternalPcie',
        component: ExternalPcie950,
      },
    ],
  },
  {
    path: '/Downen950',
    component: Downen950,
    children:[
      {
        path: '/Downen950/ProgramList',
        component: ProgramList950,
      },
      {
        path: '/Downen950/Operation',
        component: Operation950,
      },
      {
        path: '/Downen950/Logic',
        component: Logic950,
      },
    ],
  },
  {
    path: '/Affirm950',
    component: Affirm950,
  },
];
export default menu;

