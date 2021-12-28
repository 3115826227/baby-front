import Vue from 'vue'
import router from './router'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import hljs from 'highlight.js'

Vue.use(ElementUI)
// Vue.use(hljs)
// Vue.directive('highlight',function (el) {
//   let blocks = el.querySelectorAll('pre code');
//   blocks.forEach((block)=>{
//     hljs.highlightElement(block)
//   })
// })

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
