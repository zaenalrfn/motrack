import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import AnggaranView from '../views/AnggaranView.vue'
import HakAksesView from '../views/HakAksesView.vue'
import BackupRestoreView from '../views/BackupRestoreView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/anggaran',
      name: 'anggaran',
      component: AnggaranView
    },
    {
      path: '/hak-akses',
      name: 'hak-akses',
      component: HakAksesView
    },
    {
      path: '/backup-restore',
      name: 'backup-restore',
      component: BackupRestoreView
    }
  ]
})

export default router
