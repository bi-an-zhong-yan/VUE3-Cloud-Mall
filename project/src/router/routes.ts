//常量路由
export const constantRoute = [
  {
    //登录路由
    path: '/login',
    component: () => import('@/view/login/index.vue'),
    name: 'login',//命名路由
    meta: {
      title: '登录',
      hidden: true,//路由标题在菜单中是否隐藏，true:隐藏
      icon: "Promotion"//菜单左侧的图标(支持element-plus的全部图标)
    }
  },
  {
    //登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',//命名路由
    meta: {
      title: 'layout',
      hidden: false,
      icon: "User"
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/view/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: "HomeFilled"
        },
      },
    ]
  },
  {
    //404路由
    path: '/404',
    component: () => import('@/view/404/index.vue'),
    name: '404',//命名路由
    meta: {
      title: '错误页面',
      hidden: true,
      icon: "DocumentDelete"
    }
  },
  {
    path: '/screen',
    component: () => import('@/view/screen/index.vue'),
    name: 'Screen',
    meta: {
      hidden: false,
      title: '数据大屏',
      icon: "Monitor"
    }
  },
]
//异步路由
export const asnycRoute = [
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    meta: {
      hidden: false,
      title: '权限管理',
      icon: "Lock"
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/view/acl/user/index.vue'),
        name: 'Acl',
        meta: {
          hidden: false,
          title: '用户管理',
          icon: "user"
        }
      },
      {
        path: '/acl/role',
        component: () => import('@/view/acl/role/index.vue'),
        name: 'Role',
        meta: {
          hidden: false,
          title: '角色管理',
          icon: "UserFilled"
        }
      },
      {
        path: '/acl/permission',
        component: () => import('@/view/acl/permission/index.vue'),
        name: 'Permission',
        meta: {
          hidden: false,
          title: '菜单管理',
          icon: "Grid"
        }
      },
    ]
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'Product',
    meta: {
      hidden: false,
      title: '商品管理',
      icon: "Goods"
    },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/view/product/trademark/index.vue'),
        name: 'Trademark',
        meta: {
          hidden: false,
          title: '品牌管理',
          icon: "ShoppingCart"
        }
      },
      {
        path: '/product/spu',
        component: () => import('@/view/product/spu/index.vue'),
        name: 'Spu',
        meta: {
          hidden: false,
          title: 'spu管理',
          icon: "Calendar"
        }
      },
      {
        path: '/product/sku',
        component: () => import('@/view/product/sku/index.vue'),
        name: 'Sku',
        meta: {
          hidden: false,
          title: 'Sku管理',
          icon: "Orange"
        }
      },
      {
        path: '/product/attr',
        component: () => import('@/view/product/attr/index.vue'),
        name: 'Attr',
        meta: {
          hidden: false,
          title: '属性管理',
          icon: "ChromeFilled"
        }
      },
    ]
  },
]
//任意路由
export const anyRoute = {
  //任意路由
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  name: 'Any',//命名路由
  meta: {
    title: '任意路由',
    hidden: true,
    icon: "DataLine"
  }
}