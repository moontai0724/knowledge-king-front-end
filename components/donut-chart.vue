<template>
  <svg viewBox="0 0 40 40">
    <circle
      cx="20"
      cy="20"
      r="15.9155"
      fill="transparent"
      stroke="lightgray"
      :stroke-width="strokeWidth"
    ></circle>
    <circle
      cx="20"
      cy="20"
      r="15.91549430918954"
      fill="transparent"
      :stroke="displayedColor"
      :stroke-width="strokeWidth"
      stroke-dashoffset="25"
      :stroke-dasharray="`${percent} ${100 - percent}`"
    ></circle>
    <g>
      <text y="50%" transform="translate(0, 2)">
        <tspan x="50%" text-anchor="middle" v-text="text" />
      </text>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: null,
    },
    strokeWidth: {
      type: Number,
      default: 8,
    },
    text: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      displayedColor:
        this.color ?? (Number(this.percent) > 50 ? '#90EE90' : '#EE9090'),
    }
  },
})
</script>

<style scoped>
tspan {
  font-size: 0.5em;
  line-height: 1;
  transform: translateY(0.5em);
  font-weight: bold;
}
</style>
