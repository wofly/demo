
import Goods from './pages/Programme/Goods.vue';
/* -------------初始化展示页面----------------*/
import Login from './pages/menu/login.vue';
/* -------------硬件列表清单----------------*/
import Hardware from './components/Hardware.vue';
/* -------------方案详情----------------*/
import Projectpar from './pages/Programme/Projectpar.vue';
/* -------------选择产品----------------*/
import ProductSelection from './pages/Programme/ProductSelection.vue';
/* -------------新建方案----------------*/
import ProgrammeAdd from './pages/Programme/ProgrammeAdd.vue';
/* -------------选择模板----------------*/
import SelectTemplate from './pages/Programme/SelectTemplate.vue';
/* -------------配件-------------------*/
import AccessoriesSelection from './pages/Programme/AccessoriesSelection.vue';
/* -------------内部硬盘------------------*/
import InsideHardDiskDrive from './pages/Programme/InsideHardDiskDrive.vue';
/* -------------CPU------------------*/
import Processor from './components/Processor.vue';
/* -------------内存------------------*/
import Memory from './pages/Programme/Memory.vue';
/* -------------电源------------------*/
import PowerLine from './pages/Programme/PowerLine.vue';
/* -------------内部PCle------------------*/
import InteriorPcle from './components/InteriorPcle.vue';
/* -------------软件组件------------------*/
import Downen from './components/Downen.vue';
/* -------------软件配置子组件------------------*/
import Logic from './components/Logic.vue';
/* -------------软件配置子组件------------------*/
import Operation from './components/Operation.vue';
/* -------------软件配置子组件------------------*/
import ProgramList from './components/programList.vue';
/* -------------确认组件------------------*/
import Affirm from './components/Affirm.vue';
/* -------------设置详情------------------*/
import ProBack from './components/ProBack.vue';
/*---------------前置硬盘--------------------*/
import FrontHardDisk from './pages/Programme/FrontHardDisk.vue';
/*---------------前置硬盘--------------------*/
import MiddleHardDisk from './pages/Programme/MiddleHardDisk.vue';

const menu = [
  { // 首页页面默认的路由，右侧的详情
    icon: 'cube',
    title: '物品管理',
    path: '/Login',
    component: Login,
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
  {
    path: '/FrontHardDisk',
    component: FrontHardDisk,
  },
  {
    path: '/MiddleHardDisk',
    component: MiddleHardDisk,
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

      }, {/* -------------硬盘------------------*/
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
        }
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
];
export default menu;
