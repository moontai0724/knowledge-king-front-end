<template>
  <v-row>
    <v-col
      v-for="(history, index) in histories"
      :key="index"
      cols="auto"
      class="flex-grow-1"
    >
      <v-card>
        <v-card-title>
          <v-avatar color="indigo" size="30" class="mx-1">
            <img :src="history.user.profile_photo" alt="avatar" />
          </v-avatar>
          <span
            class="ml-1 font-weight-light"
            v-text="history.user.name"
          ></span>
          <v-spacer></v-spacer>
          <span
            class="mx-1 text-h4 font-weight-medium"
            v-text="Math.round(history.score)"
          ></span>
          <span class="font-weight-light">分</span>
        </v-card-title>
        <v-card-text>
          <div class="font-weight-black">主題</div>
          <div>
            <v-chip
              v-for="topic in history.topics"
              :key="topic.id"
              class="ma-1"
              color="grey lighten-2"
              label
            >
              {{ topic.title }}
              <v-avatar
                right
                class="grey darken-3 white--text"
                v-text="topic.question_amount"
              >
              </v-avatar>
            </v-chip>
          </div>
          <div class="font-weight-black">開始作答時間</div>
          <div v-text="new Date(history.created_at).toLocaleString()"></div>
          <v-row>
            <v-col cols="6" class="text-center">
              <div class="font-weight-black">反應速度</div>
              <v-progress-circular
                :rotate="-90"
                :size="80"
                :width="10"
                :value="(1 - history.percentReactTime) * 100"
                :color="history.percentReactTime > 0.5 ? 'error' : 'success'"
              >
                {{ Math.round(history.averageReactTime) }}s
              </v-progress-circular>
            </v-col>
            <v-col cols="6" class="text-center">
              <div class="font-weight-black">正確率</div>
              <v-progress-circular
                :rotate="-90"
                :size="80"
                :width="10"
                :value="history.percentCorrect"
                :color="history.percentCorrect > 50 ? 'success' : 'error'"
              >
                {{ Math.round(history.percentCorrect) }}%
              </v-progress-circular>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="indigo">查看詳細</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import History from '../../../types/history.interface'
export default Vue.extend({
  middleware: 'role/admin',
  data() {
    return {
      histories: [] as History[],
    }
  },
  head: {
    title: '歷史記錄查詢',
  },
  mounted() {
    this.loadHistories()
  },
  methods: {
    async loadHistories() {
      this.histories = await this.fetchHistories()
    },
    async fetchHistories() {
      return await this.$axios
        .$get(`/admin/histories`)
        .then((response) => response.data as History[])
        .then((histories) =>
          histories.map((history) => ({
            ...history,
            percentCorrect:
              history.total_answered > 0
                ? (history.total_correct / history.total_answered) * 100
                : 0,
            averageReactTime:
              history.total_answered > 0
                ? history.total_time_used / history.total_answered
                : NaN,
            percentReactTime:
              history.total_answered > 0
                ? history.total_time_used /
                  (history.total_answered *
                    (history.total_time_limit / history.total_question))
                : 1,
          }))
        )
    },
  },
})
</script>
