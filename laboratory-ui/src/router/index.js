import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "table" */ '../views/page/user/index.vue'),
                    meta: {title: '用户信息管理'}
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/initTeach',
                    component: () => import(/* webpackChunkName: "init" */ '../views/page/init/index.vue'),
                    meta: {title: '学院教务处'}
                },
                {
                    path: '/laboratory',
                    component: () => import(/* webpackChunkName: "laboratory" */ '../views/page/laboratory/index.vue'),
                    meta: {title: '实验室'}
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/technician',
            redirect: '/dashboards'
        },
        {
            path: '/technician',
            component: () => import(/* webpackChunkName: "Main" */ '../components/technician/Home.vue'),
            meta: { title: '实验室技术人员' },
            children: [
                {
                    path: '/dashboards',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/recruit',
                    component: () => import(/* webpackChunkName: "recruit" */ '../views/page/recruit/index.vue'),
                    meta: {title: '招聘申请'}
                },
                {
                    path: '/enroll2',
                    component: () => import(/* webpackChunkName: "enroll2" */ '../views/page/enroll/laboratory/index.vue'),
                    meta: {title: '审核学生申请岗位信息' }
                },
                {
                    path: '/enroll3',
                    component: () => import(/* webpackChunkName: "enroll2" */ '../views/page/enroll/person/index.vue'),
                    meta: {title: '通过面试人员信息' }
                },
                {
                    path: '/person',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/page/person/index.vue'),
                    meta: {title: '助研员信息管理' }
                },
                {
                    path: '/work1',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/page/work/technicial/index.vue'),
                    meta: {title: '助研员工作信息' }
                },
                {
                    path: '/equip1',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/page/equip/technicial/index.vue'),
                    meta: {title: '导出报修单' }
                }
            ]
        },
        {
            path: '/offices',
            redirect: '/dashboard1'
        },
        {
            path: '/offices',
            component: () => import(/* webpackChunkName: "Main" */ '../components/office/Home.vue'),
            meta: { title: '学生工作处' },
            children: [
                {
                    path: '/dashboard1',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/recruit1',
                    component: () => import(/* webpackChunkName: "recruit" */ '../views/page/recruit/offices/index.vue'),
                    meta: {title: '招聘申请审核'}
                }
            ]
        },
        {
            path: '/student',
            redirect: '/dashboard2'
        },
        {
            path: '/student',
            component: () => import(/* webpackChunkName: "Main" */ '../components/student/Home.vue'),
            meta: { title: '学生' },
            children: [
                {
                    path: '/dashboard2',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/recruit2',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/page/recruit/student/index.vue'),
                    meta: { title: '实验室助理招聘计划信息' }
                },
                {
                    path: '/enroll',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../views/page/enroll/index.vue'),
                    meta: {title: '个人申请实验室助理信息' }
                }
            ]
        },
        {
            path: '/person1',
            redirect: 'dashboard3'
        },
        {
            path: '/person1',
            component: () => import(/* webpackChunkName: "Main" */ '../components/person/Home.vue'),
            meta: { title: '助研员' },
            children: [
                {
                    path: '/dashboard3',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/work',
                    component: () => import(/* webpackChunkName: "work" */ '../views/page/work/index.vue'),
                    meta: { title: '助研员每日工作计划' }
                },
                {
                    path: '/equip',
                    component: () => import(/* webpackChunkName: "work" */ '../views/page/equip/index.vue'),
                    meta: { title: '设备维护信息管理' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
