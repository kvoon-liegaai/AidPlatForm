import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/auth/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage/LoginPage.vue') },
    ],
  },
  {
    path: '/home',
    children: [
      {
        path: '',
        component: () => import('src/layouts/FirstLevelLayout.vue'),
        children: [
          { path: '', component: () => import('pages/HomePage/HomePage.vue') },
        ],
      },
      {
        path: 'tag-list',
        component: () => import('src/layouts/ReturnableLayout.vue'),
        children: [{
          path: '',
          component: () => import('pages/HomePage/components/TagList/TagList.vue'),
        }],
      },
    ],
  },
  {
    path: '/appointment',
    component: () => import('src/layouts/FirstLevelLayout.vue'),
    children: [
      {
        path: 'receiver',
        component: () => import('src/pages/AppointmentPage/ReceiverAppointPage.vue'),
      },
      {
        path: 'provider',
        component: () => import('src/pages/AppointmentPage/ProviderAppointPage.vue'),
      },
    ],
  },
  {
    path: '/inbox',
    component: () => import('src/layouts/FirstLevelLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/InboxPage/InboxPage.vue'),
      },
    ],
  },
  {
    path: '/chat/:userId',
    component: () => import('src/layouts/EmptyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ChatPage/ChatPage.vue'),
      },
    ],
  },
  {
    path: '/profile',
    component: () => import('src/layouts/FirstLevelLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ProfilePage/ProfilePage.vue'),
      },
    ],
  },
  {
    path: '/setting',
    component: () => import('src/layouts/EmptyLayout.vue'),
    children: [
      {
        path: 'quick-match',
        component: () => import('pages/SettingPage/QuickMatch.vue'),
      },
      {
        path: 'provide-service',
        component: () => import('pages/SettingPage/ProvideService.vue'),
      },
    ],
  },
  {
    path: '/map',
    component: () => import('src/layouts/EmptyLayout.vue'),
    children: [
      {
        path: 'geo-pick',
        component: () => import('pages/MapPage/GeoPick.vue'),
      },
    ],
  },
  {
    path: '/quick-match-detail',
    component: () => import('src/layouts/ReturnableLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/QuickMatchDetail/QuickMatchDetail.vue'),
      },
    ],
  },
  {
    path: '/test',
    component: () => import('src/pages/TestTest.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
