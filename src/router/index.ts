import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import AnggaranView from '../views/AnggaranView.vue'
import HakAksesView from '../views/HakAksesView.vue'
import BackupRestoreView from '../views/BackupRestoreView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import LoginView from '../views/LoginView.vue'
import { supabase } from '../services/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/anggaran',
      name: 'anggaran',
      component: AnggaranView,
      meta: { requiresAuth: true }
    },
    {
      path: '/hak-akses',
      name: 'hak-akses',
      component: HakAksesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/backup-restore',
      name: 'backup-restore',
      component: BackupRestoreView,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/welcome',
      name: 'welcome',
      component: WelcomeView
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const { data: { session } } = await supabase.auth.getSession()

  if (requiresAuth && !session) {
    next('/login')
  } else if (to.path === '/login' && session) {
    next('/')
  } else {
    next()
  }
})

export default router
