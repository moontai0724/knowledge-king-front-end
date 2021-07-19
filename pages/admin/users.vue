<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :expanded.sync="expanded"
    :search="search"
    item-key="user.id"
    show-expand
    style="max-width: 1200px; margin: 0 auto"
    class="elevation-1"
    :loading="loading"
  >
    <template #top>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>
    <template #[`item.user.profile_photo`]="{ item }">
      <v-avatar color="primary" size="36" class="mx-1">
        <img
          v-if="item.user.profile_photo"
          :src="item.user.profile_photo"
          alt="avatar"
        />
        <span
          v-else
          class="white--text"
          style="user-select: none"
          v-text="item.user.name"
        ></span>
      </v-avatar>
    </template>
    <template #[`item.user.permission`]="{ item }">
      <span
        :style="{
          color: ['red', 'black', 'green', 'blue'][item.user.permission],
        }"
        v-text="roles[item.user.permission].text"
      ></span>
    </template>
    <template #[`item.stats.percentAnswered`]="{ item }">
      <div
        style="max-height: 100%; height: 40px"
        class="d-flex align-center justify-center"
      >
        <donut-chart height="80%" :percent="item.stats.percentAnswered" />
        <span class="mx-2">{{ item.stats.percentAnswered }}%</span>
      </div>
    </template>
    <template #[`item.stats.percentCorrect`]="{ item }">
      <div
        style="max-height: 100%; height: 40px"
        class="d-flex align-center justify-center"
      >
        <donut-chart height="80%" :percent="item.stats.percentCorrect" />
        <span class="mx-2">{{ item.stats.percentCorrect }}%</span>
      </div>
    </template>
    <template #expanded-item="{ item }">
      <td :colspan="headers.length">
        <v-form
          ref="form"
          v-model="item.states.isFormValid"
          @submit.prevent="saveUser(item)"
        >
          <v-progress-linear
            v-if="item.states.isLoading"
            indeterminate
            color="primary"
          />
          <v-row class="mt-2">
            <v-col>
              <v-alert
                :value="!!error"
                type="error"
                transition="slide-y-transition"
                v-text="error"
              ></v-alert>
            </v-col>
          </v-row>
          <v-row class="ma-2">
            <v-col>
              <v-simple-table class="detail-table">
                <template #default>
                  <thead>
                    <tr>
                      <th colspan="2">
                        <span class="ms-2 text-decoration-underline text-h6">
                          詳細資訊
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <v-icon>mdi-account-outline</v-icon>
                        <span class="ms-2">姓名</span>
                      </td>
                      <td
                        v-if="!item.states.isEditing"
                        v-text="item.user.name"
                      />
                      <td v-else>
                        <v-text-field
                          v-model="item.user.name"
                          :rules="[rules.required]"
                          counter="40"
                          required
                          maxlength="40"
                          spellcheck="true"
                          autocomplete="name"
                          dense
                        ></v-text-field>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon>mdi-card-account-details-outline</v-icon>
                        <span class="ms-2">帳號</span>
                      </td>
                      <td
                        v-if="!item.states.isEditing"
                        v-text="item.user.account"
                      />
                      <td v-else>
                        <v-text-field
                          v-model="item.user.account"
                          :rules="[rules.required, rules.account]"
                          hint="可使用小寫英文字母、數字及下底線"
                          counter="20"
                          required
                          maxlength="20"
                          autocomplete="username"
                          dense
                        ></v-text-field>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <v-icon>mdi-email-outline</v-icon>
                        <span class="ms-2">電子信箱</span>
                      </td>
                      <td v-if="!item.states.isEditing">
                        <a
                          :href="`mailto:${item.user.email}`"
                          v-text="item.user.email"
                        ></a>
                      </td>
                      <td v-else>
                        <v-text-field
                          v-model="item.user.email"
                          :rules="[rules.required, rules.email]"
                          required
                          autocomplete="email"
                          dense
                        ></v-text-field>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <v-icon>mdi-shield-account-outline</v-icon>
                        <span class="ms-2">身份</span>
                      </td>
                      <td v-if="!item.states.isEditing">
                        <span
                          :style="{
                            color: ['red', 'black', 'green', 'blue'][
                              item.user.permission
                            ],
                          }"
                          v-text="roles[item.user.permission].text"
                        ></span>
                      </td>
                      <td v-else>
                        <v-select
                          v-model="item.user.permission"
                          :items="roles"
                          dense
                          required
                        ></v-select>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <v-icon>mdi-clock-outline</v-icon>
                        <span class="ms-2">註冊時間</span>
                      </td>
                      <td
                        :title="
                          new Date(item.user.registered_at).toLocaleString(
                            {},
                            {
                              hour12: false,
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            }
                          )
                        "
                      >
                        {{ new Date(item.user.registered_at) }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col>
              <v-simple-table class="detail-table">
                <template #default>
                  <thead>
                    <tr>
                      <th colspan="2">
                        <span class="ms-2 text-decoration-underline text-h6">
                          統計資料
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <v-icon>mdi-head-question-outline</v-icon>
                        <span class="ms-2">總答題數</span>
                      </td>
                      <td>
                        {{ item.user.total_answered }}/{{
                          item.user.total_question
                        }}
                        ({{ item.stats.percentAnswered }}%)
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon>mdi-file-check-outline</v-icon>
                        <span class="ms-2">正確率</span>
                      </td>
                      <td>
                        {{ item.user.total_correct }}/{{
                          item.user.total_answered
                        }}
                        ({{ item.stats.percentCorrect }}%)
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <v-icon>mdi-email-outline</v-icon>
                        <span class="ms-2">平均反應時間</span>
                      </td>
                      <td>{{ item.stats.averageReactTime }} 秒</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-row class="ma-1 pb-5" align="center" justify="end">
            <v-btn
              v-show="!item.states.isEditing"
              type="button"
              color="warning"
              class="elevation-2 black--text"
              @click="item.states.isEditing = true"
            >
              <v-icon left>mdi-pencil</v-icon>
              編輯
            </v-btn>
            <v-btn
              v-show="item.states.isEditing"
              :disabled="!item.states.isFormValid"
              type="submit"
              color="success"
              class="elevation-2 black--text"
            >
              <v-icon left>mdi-content-save</v-icon>
              儲存
            </v-btn>
          </v-row>
        </v-form>
      </td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { User, UserItem } from '~/types/user.interface'
export default Vue.extend({
  middleware: 'role/admin',
  data() {
    return {
      error: undefined,
      roles: [
        {
          text: '停用',
          value: 0,
        },
        {
          text: '普通使用者',
          value: 1,
        },
        {
          text: '題目審核員',
          value: 2,
        },
        {
          text: '管理員',
          value: 3,
        },
      ],
      rules: {
        required: (value: any) => !!value || '此欄位必填',
        account: (value: string) =>
          /^[a-z0-9_]*$/.test(value) || '僅能使用小寫英文字母、數字及下底線',
        email: (value: string) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || '信箱格式不正確'
        },
      },
      loading: true,
      search: '',
      expanded: [],
      headers: [
        {
          text: '',
          align: 'center',
          sortable: false,
          value: 'user.profile_photo',
          width: '5%',
        },
        { text: '姓名', value: 'user.name', width: '40%' },
        {
          text: '身份',
          value: 'user.permission',
          width: '10%',
          align: 'center',
        },
        {
          text: '總答題數 (%)',
          value: 'stats.percentAnswered',
          width: '20%',
          align: 'center',
        },
        {
          text: '正確率 (%)',
          value: 'stats.percentCorrect',
          width: '20%',
          align: 'center',
        },
        { value: 'data-table-expand', width: '5%' },
      ],
      users: [],
    }
  },
  head: {
    title: '使用者管理',
  },
  watch: {
    error() {
      setTimeout(() => (this.error = undefined), 5000)
    },
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.users = await this.$axios.$get('/admin/users').then((response) =>
        response.data.map((user: User) => {
          const percentAnswered =
            (user.total_answered / user.total_question) * 100
          const percentCorrect =
            (user.total_correct / user.total_answered) * 100
          const averageReactTime = user.total_time_used / user.total_answered
          const response: UserItem = {
            user,
            stats: {
              percentAnswered: isNaN(percentAnswered)
                ? 0
                : Math.round(percentAnswered * 100) / 100,
              percentCorrect: isNaN(percentCorrect)
                ? 0
                : Math.round(percentCorrect * 100) / 100,
              averageReactTime: isNaN(averageReactTime)
                ? 0
                : Math.round(averageReactTime * 100) / 100,
            },
            states: {
              isFormValid: true,
              isLoading: false,
              isEditing: false,
            },
          }
          return response
        })
      )
      this.loading = false
    },
    async fetchUser(id: number) {
      return await this.$axios.$get(`/admin/users/${id}`).then((response) => {
        const user = response.data
        const percentAnswered =
          (user.total_answered / user.total_question) * 100
        const percentCorrect = (user.total_correct / user.total_answered) * 100
        const averageReactTime = user.total_time_used / user.total_answered
        const userItem: UserItem = {
          user,
          stats: {
            percentAnswered: isNaN(percentAnswered)
              ? 0
              : Math.round(percentAnswered * 100) / 100,
            percentCorrect: isNaN(percentCorrect)
              ? 0
              : Math.round(percentCorrect * 100) / 100,
            averageReactTime: isNaN(averageReactTime)
              ? 0
              : Math.round(averageReactTime * 100) / 100,
          },
          states: {
            isFormValid: true,
            isLoading: false,
            isEditing: false,
          },
        }
        return userItem
      })
    },
    async saveUser(item: UserItem) {
      item.states!.isLoading = true
      const response = await this.submitUser(item.user)
        .then((v) => v.data)
        .catch(async (err) => {
          this.error = err.response.data.data.join(' ')
          if (err.response.status === 400)
            return (await this.fetchUser(item.user.id)).user
          return null
        })
      Object.assign(item.user, response)
      item.states!.isLoading = false
      item.states!.isEditing = false
    },
    submitUser(user: User) {
      return this.$axios.$patch(`/admin/users/${user.id}`, user)
    },
  },
})
</script>

<style lang="scss" scoped>
.detail-table {
  tbody {
    display: table !important;
    width: 100%;
  }
  td:nth-child(1) {
    white-space: nowrap;
  }
}
</style>
