<template>
    <!-- <ol :index="router.path" v-if="router.hasOwnProperty('children')">
      <span slot="title">{{router.name}}</span>
        <asideBarItem v-for="child in router.children" :key="child.path" :router="child">
        </asideBarItem>
    </ol> -->
    <el-submenu :index="router.path" v-if="router.hasOwnProperty('children')">
      <span slot="title">{{router.name}}</span>
        <asideBarItem v-for="child in router.children" :key="child.path" :router="child">
        </asideBarItem>
    </el-submenu>
    <el-menu-item v-else :index="router.path" :key="router.path" style="margin-left:0.82%;">
      <div v-if="mobile">
        <i :class="router.icon" style="text-align:center"></i>
      </div>
      <div v-else="">
        <span>{{router.name}}</span>
      </div>
    </el-menu-item>
</template>
<script>
export default {
  name: 'asideBarItem',
  props: {
    router: {
      type: Object
    },
    mobile: {
      type: Boolean
    }
  }
}
</script>
<style scoped>
@font-face {
  font-family: 'iconfont';  /* project id 1306051 */
  src: url('//at.alicdn.com/t/font_1306051_svucwz6pwna.eot');
  src: url('//at.alicdn.com/t/font_1306051_svucwz6pwna.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.woff') format('woff'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1306051_svucwz6pwna.svg#iconfont') format('svg');
}
.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
</style>
