import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DecoderView from '../views/DecoderView.vue'
import SandboxListView from '../views/SandboxListView.vue'
import SandboxChatView from '../views/SandboxChatView.vue'
import CooldownView from '../views/CooldownView.vue'
import DictView from '../views/DictView.vue'
import ProfileView from '../views/ProfileView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/decode', name: 'decode', component: DecoderView },
    { path: '/sandbox', name: 'sandbox', component: SandboxListView },
    { path: '/sandbox/:id', name: 'sandbox-chat', component: SandboxChatView },
    { path: '/cooldown', name: 'cooldown', component: CooldownView },
    { path: '/dict', name: 'dict', component: DictView },
    { path: '/me', name: 'me', component: ProfileView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

const titles: Record<string, string> = {
  home: 'AI亲子理解助手',
  decode: '解码 · AI亲子理解助手',
  sandbox: '沙盘 · AI亲子理解助手',
  'sandbox-chat': '沙盘 · AI亲子理解助手',
  cooldown: '先停一下 · AI亲子理解助手',
  dict: '词典 · AI亲子理解助手',
  me: '我的 · AI亲子理解助手',
}

router.afterEach((to) => {
  document.title = titles[String(to.name)] ?? 'AI亲子理解助手'
})
