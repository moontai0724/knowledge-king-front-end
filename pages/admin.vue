<template>
  <div>
    <nuxt-child />
    <v-snackbar
      top
      :color="$store.state.message.color"
      :value="!!$store.state.message.content"
      timeout="5000"
      @input="timeout"
    >
      {{ $store.state.message.content }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="closeBar">關閉</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'admin',
  head: {
    title: '管理後台',
  },
  methods: {
    timeout() {
      setTimeout(() => {
        this.$store.commit('message/clear')
      }, 5000)
    },
    closeBar() {
      this.$store.commit('message/clear')
    },
  },
})
</script>
