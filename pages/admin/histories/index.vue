<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  middleware: 'role/admin',
  head: {
    title: '歷史記錄查詢',
  },
})
</script>
