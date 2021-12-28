<template>
    <div class="content" style="height:100%">
        <router-view :websocketClient='websocketClient' :websocketMessage='websocketMessage'></router-view>
    </div>
</template>
<script>
export default {
  name: 'Content',
  props: ['websocketClient', 'websocketMessage'],
}
</script>
