import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './components/content/dashboard/Dashboard.vue'
import Settings from './components/content/settings/Settings.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    linkActiveClass: 'active',
    routes: [{
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard
        }, {
            path: '/settings',
            name: 'settings',
            component: Settings
        }
    ]
})
