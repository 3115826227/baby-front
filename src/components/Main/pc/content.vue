<template>
    <div class="content" :style="blog_id ? 'height:100%;':'height:auto' ">
        <router-view :websocketClient='websocketClient' :websocketMessage='websocketMessage' :blog_id="blog_id"></router-view>
        <router-view name="blog_content"></router-view>
    </div>
</template>
<script>
export default {
  name: 'Content',
  props: ['websocketClient', 'websocketMessage', 'blog_id'],
}
</script>
