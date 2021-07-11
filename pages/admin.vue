<template>
  <nuxt-child />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'admin',
  head: {
    title: '管理後台',
  },
})
</script>
