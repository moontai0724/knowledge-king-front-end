<template>
  <v-row>
    <v-col>
      <v-list dense>
        <v-list-group
          v-for="item in groupAndTopics"
          :key="item.group.title"
          v-model="item.state.active"
          no-action
        >
          <template #activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.group.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="topic in item.group.topics"
            :key="`topic-${topic.id}`"
            no-action
            link
            @click="loadQuestions(topic.id)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="topic.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-col>
    <v-col cols="9">
      <v-row class="justify-space-around">
        <v-col
          v-for="question in questions"
          :key="question.id"
          class="flex-grow-1"
          cols="auto"
        >
          <v-card
            elevation="2"
            outlined
            class="text-left"
            style="min-width: 300px"
          >
            <v-card-subtitle class="secondary py-1">
              <span class="subtitle-1">問題</span>
              <span class="grey--text">
                - 由 <a v-text="question.author.name"></a> 提供
              </span>
            </v-card-subtitle>
            <v-card-title
              class="secondary pt-0 pb-1 font-weight-bold"
              v-text="question.question"
            ></v-card-title>
            <v-card-text class="pt-1">
              <div class="my-1">
                <div class="font-weight-bold">
                  選項一
                  <v-icon v-if="question.answer == 1" x-small>
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                </div>
                <div class="font-weight-light" v-text="question.option_1" />
              </div>
              <div class="my-1">
                <div class="font-weight-bold">
                  選項二
                  <v-icon v-if="question.answer == 2" x-small>
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                </div>
                <div class="font-weight-light" v-text="question.option_2" />
              </div>
              <div class="my-1">
                <div class="font-weight-bold">
                  選項三
                  <v-icon v-if="question.answer == 3" x-small>
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                </div>
                <div class="font-weight-light" v-text="question.option_3" />
              </div>
              <div class="my-1">
                <div class="font-weight-bold">
                  選項四
                  <v-icon v-if="question.answer == 4" x-small>
                    mdi-checkbox-marked-circle-outline
                  </v-icon>
                </div>
                <div class="font-weight-light" v-text="question.option_4" />
              </div>
              <div class="my-1">
                <div class="font-weight-bold">時間限制</div>
                <div class="font-weight-light" v-text="question.time_limit" />
              </div>
              <div class="my-1">
                <div class="font-weight-bold">開放作答</div>
                <div class="font-weight-light">
                  <template v-if="question.disabled">
                    <v-icon small>mdi-lock-outline</v-icon>
                    否
                  </template>
                  <template v-else>
                    <v-icon small>mdi-lock-open-variant-outline</v-icon>
                    是
                  </template>
                </div>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                v-if="!question.disabled"
                color="error"
                small
                @click="toggleState(question)"
              >
                <v-icon left>mdi-lock-outline</v-icon>
                關閉作答
              </v-btn>
              <v-btn
                v-else
                color="success"
                small
                @click="toggleState(question)"
              >
                <v-icon left>mdi-lock-open-variant-outline</v-icon>
                開放作答
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <add-question></add-question>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Group, { GroupItem } from '~/types/group.interface'
import Question from '~/types/question.interface'
export default Vue.extend({
  middleware: 'role/admin',
  data() {
    return {
      groupAndTopics: [] as GroupItem[],
      questions: [] as Question[],
    }
  },
  head: {
    title: '題庫管理 - 題目管理',
  },
  async mounted() {
    this.groupAndTopics = (await this.fetchGroupAndTopics()).map((group) => ({
      group,
      state: { active: false },
    }))
  },
  methods: {
    async loadQuestions(topic: number) {
      this.questions = await this.fetchQuestions(topic)
    },
    async fetchGroupAndTopics() {
      return await this.$axios
        .$get('/admin/groups?withTopics=true')
        .then((response) => response.data as Group[])
    },
    async fetchQuestions(topic: number) {
      return await this.$axios
        .$get(`/admin/questions?topics[]=${topic}`)
        .then((response) => response.data as Question[])
    },
    async toggleState(question: Question) {
      question.disabled = !question.disabled
      return await this.submit(question)
    },
    async submit(question: Question) {
      return await this.$axios
        .$patch(`/admin/questions/${question.id}`, question)
        .then((response) => response.data as Question)
    },
  },
})
</script>
