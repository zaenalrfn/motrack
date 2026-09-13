import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import AnggaranView from '../views/AnggaranView.vue'
import HakAksesView from '../views/HakAksesView.vue'
import BackupRestoreView from '../views/BackupRestoreView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import LoginView from '../views/LoginView.vue'
import AuthCallbackView from '../views/AuthCallbackView.vue'
import { supabase } from '../services/supabaseClient'
import { useAuthStore } from '../stores/useAuthStore'

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
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: AuthCallbackView
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const { data: { session } } = await supabase.auth.getSession()

  const authStore = useAuthStore()
  if (session && !authStore.initialized) {
    await authStore.initAuth()
  }

  if (requiresAuth && !session) {
    next('/login')
  } else if (to.path === '/login' && session) {
    next('/')
  } else if (session && authStore.currentMember) {
    const isAdmin = authStore.currentMember.role === 'admin'
    const adminRoutes = ['anggaran', 'hak-akses', 'backup-restore']
    
    if (!isAdmin && adminRoutes.includes(to.name as string)) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
