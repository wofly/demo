import Home from './pages/Home';
import menus from './menu';
// import Login from './pages/menu/login.vue';
const childrenRoutes = [];

for (const menu of menus) {
  childrenRoutes.push(menu);
}

childrenRoutes.push({
  path: '*',
  redirect: menus[ 0 ].path,
});

const routes = [
  {
    path: '/',
    component: Home,
    children: childrenRoutes,
  },
];

export default routes;
