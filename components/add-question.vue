<template>
  <v-dialog v-model="dialog" persistent scrollable>
    <template #activator="{ on, attrs }">
      <v-btn
        color="green"
        fab
        large
        dark
        fixed
        right
        bottom
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-form v-model="valid" @submit.prevent="submitQuestions">
      <v-card>
        <v-card-title class="text-h5 justify-center pb-2">
          新增題目
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-5">
          <v-row justify="center">
            <div v-if="questions.length == 0" class="text-center">
              <h2>目前尚未有任何題目＞＜！</h2>
              <h3>趕快點擊右下角進行新增！</h3>
            </div>
            <v-col
              v-for="(question, index) in questions"
              :key="index"
              cols="auto"
              class="flex-grow-1"
            >
              <v-card>
                <v-card-subtitle>第 {{ index + 1 }} 題</v-card-subtitle>
                <v-card-title>
                  <v-text-field
                    v-model="question.question"
                    counter="150"
                    maxlength="150"
                    label="題目"
                    required
                    :rules="[rules.required, rules.max150]"
                  ></v-text-field>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="question.option_1"
                    counter="40"
                    maxlength="40"
                    label="選項一"
                    required
                    :rules="[rules.required, rules.max40]"
                  ></v-text-field>
                  <v-text-field
                    v-model="question.option_2"
                    counter="40"
                    maxlength="40"
                    label="選項二"
                    required
                    :rules="[rules.required, rules.max40]"
                  ></v-text-field>
                  <v-text-field
                    v-model="question.option_3"
                    counter="40"
                    maxlength="40"
                    label="選項三"
                    required
                    :rules="[rules.required, rules.max40]"
                  ></v-text-field>
                  <v-text-field
                    v-model="question.option_4"
                    counter="40"
                    maxlength="40"
                    label="選項四"
                    required
                    :rules="[rules.required, rules.max40]"
                  ></v-text-field>
                  <v-row>
                    <v-col>
                      <v-select
                        v-model="question.answer"
                        :items="correctAnswers"
                        item-value="index"
                        item-text="text"
                        label="正確答案"
                        required
                        :rules="[rules.required]"
                      ></v-select>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="question.time_limit"
                        label="答題時間限制"
                        suffix="秒"
                        type="number"
                        min="1"
                        max="99999"
                        required
                        :rules="[rules.required, rules.min1, rules.timeTooLong]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" @click="removeQuestion(index)">
                    <v-icon left>mdi-delete</v-icon>
                    刪除
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                small
                class="mx-2"
                color="red"
                fab
                dark
                right
                bottom
                v-bind="attrs"
                v-on="on"
                @click.prevent="close"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>捨棄草稿</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                small
                class="mx-2"
                color="green"
                fab
                dark
                right
                bottom
                v-bind="attrs"
                v-on="on"
                @click.prevent="addQuestion"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>增加題目</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                small
                type="submit"
                :disabled="!valid"
                class="mx-2"
                color="primary"
                fab
                dark
                right
                bottom
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-send</v-icon>
              </v-btn>
            </template>
            <span>送出</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Question from '~/types/question.interface'
export default Vue.extend({
  props: {
    topicId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dialog: false,
      valid: false,
      rules: {
        required: (value: any) => !!value || '此欄位為必填',
        max40: (value: string | any[]) => value.length <= 40 || '最長 40 字！',
        max150: (value: string | any[]) =>
          value.length <= 40 || '最長 150 字！',
        min1: (value: number) => value >= 1 || '最少不可小於一！',
        timeTooLong: (value: string | any[]) =>
          value.length < 5 || '長度過長，請不要設置不合理的時間。',
      },
      questions: [] as Question[],
      correctAnswers: [
        { index: 1, text: '選項一' },
        { index: 2, text: '選項二' },
        { index: 3, text: '選項三' },
        { index: 4, text: '選項四' },
      ],
    }
  },
  watch: {
    valid() {
      if (this.questions.length === 0) this.valid = false
    },
    questions() {
      if (this.questions.length === 0) this.valid = false
    },
  },
  methods: {
    close(reload: boolean = false) {
      this.questions = []
      this.dialog = false
      if (reload) this.$emit('reload')
    },
    addQuestion() {
      this.questions.push({
        question: '',
        option_1: '',
        option_2: '',
        option_3: '',
        option_4: '',
        answer: 0,
        time_limit: 0,
        disabled: false,
      })
    },
    removeQuestion(index: string | number) {
      this.$delete(this.questions, index)
    },
    async submitQuestions() {
      return await this.$axios
        .$post(`/admin/topics/${this.topicId}/questions`, {
          questions: this.questions,
        })
        .then((response) => {
          if (!response.success) throw new Error('未知的錯誤')
          this.close(true)
        })
        .catch((error) => {
          this.$store.commit('message/set', error)
        })
    },
  },
})
</script>
