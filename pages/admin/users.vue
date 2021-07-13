<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :expanded.sync="expanded"
    :search="search"
    item-key="id"
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
    <template #[`item.avatar`]="{ item }">
      <v-avatar color="primary" size="36" class="mx-1">
        <img v-if="item.profile_photo" :src="item.profile_photo" alt="avatar" />
        <span
          v-else
          class="white--text"
          style="user-select: none"
          v-text="item.name"
        ></span>
      </v-avatar>
    </template>
    <template #[`item.permission`]="{ item }">
      <span
        :style="{
          color: ['red', 'black', 'green', 'blue'][item.permission],
        }"
        v-text="roles[item.permission].text"
      ></span>
    </template>
    <template #[`item.percent_answered`]="{ item }">
      <div
        style="max-height: 100%; height: 40px"
        class="d-flex align-center justify-center"
      >
        <donut-chart height="80%" :percent="item.percent_answered" />
        <span class="mx-2">{{ item.percent_answered }}%</span>
      </div>
    </template>
    <template #[`item.percent_correct`]="{ item }">
      <div
        style="max-height: 100%; height: 40px"
        class="d-flex align-center justify-center"
      >
        <donut-chart height="80%" :percent="item.percent_correct" />
        <span class="mx-2">{{ item.percent_correct }}%</span>
      </div>
    </template>
    <template #expanded-item="{ item }">
      <td :colspan="headers.length">
        <v-row class="ma-2">
          <v-col>
            <v-simple-table>
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
                    <td style="white-space: nowrap">
                      <v-icon>mdi-account-outline</v-icon>
                      <span class="ms-2">姓名</span>
                    </td>
                    <td v-text="item.name" />
                  </tr>
                  <tr>
                    <td style="white-space: nowrap">
                      <v-icon>mdi-card-account-details-outline</v-icon>
                      <span class="ms-2">帳號</span>
                    </td>
                    <td v-text="item.account" />
                  </tr>

                  <tr>
                    <td style="white-space: nowrap">
                      <v-icon>mdi-email-outline</v-icon>
                      <span class="ms-2">電子信箱</span>
                    </td>
                    <td>
                      <a :href="`mailto:${item.email}`" v-text="item.email"></a>
                    </td>
                  </tr>

                  <tr>
                    <td style="white-space: nowrap">
                      <v-icon>mdi-shield-account-outline</v-icon>
                      <span class="ms-2">身份</span>
                    </td>
                    <td>
                      <span
                        :style="{
                          color: ['red', 'black', 'green', 'blue'][
                            item.permission
                          ],
                        }"
                        v-text="roles[item.permission].text"
                      ></span>
                    </td>
                  </tr>

                  <tr>
                    <td style="white-space: nowrap">
                      <v-icon>mdi-clock-outline</v-icon>
                      <span class="ms-2">註冊時間</span>
                    </td>
                    <td
                      :title="
                        new Date(item.registered_at).toLocaleString(
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
                      {{ new Date(item.registered_at) }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col>
            <v-simple-table>
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
                    <td style="white-space: nowrap">
                      <v-icon>mdi-head-question-outline</v-icon>
                      <span class="ms-2">總答題數</span>
                    </td>
                    <td>
                      {{ item.total_answered }}/{{ item.total_question }} ({{
                        item.percent_answered
                      }}%)
                    </td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap">
                      <v-icon>mdi-file-check-outline</v-icon>
                      <span class="ms-2">正確率</span>
                    </td>
                    <td>
                      {{ item.total_correct }}/{{ item.total_answered }} ({{
                        item.percent_correct
                      }}%)
                    </td>
                  </tr>
                  <tr>
                    <td style="white-space: nowrap">
                      <v-icon>mdi-email-outline</v-icon>
                      <span class="ms-2">平均反應時間</span>
                    </td>
                    <td>{{ item.average_react }} 秒</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row class="ma-1 pb-5" align="center" justify="end">
          <v-btn
            v-if="!item.editing"
            color="warning"
            class="elevation-2 black--text"
            disabled
            @click="item.editing = true"
          >
            <v-icon left>mdi-pencil</v-icon>
            編輯
          </v-btn>
          <v-btn
            v-if="item.editing"
            color="success"
            class="elevation-2 black--text"
            @click="item.editing = false"
          >
            <v-icon left>mdi-content-save</v-icon>
            儲存
          </v-btn>
        </v-row>
      </td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
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
      loading: true,
      search: '',
      expanded: [],
      headers: [
        {
          text: '',
          align: 'center',
          sortable: false,
          value: 'avatar',
          width: '5%',
        },
        { text: '姓名', value: 'name', width: '40%' },
        { text: '身份', value: 'permission', width: '10%', align: 'center' },
        {
          text: '總答題數 (%)',
          value: 'percent_answered',
          width: '20%',
          align: 'center',
        },
        {
          text: '正確率 (%)',
          value: 'percent_correct',
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
  mounted() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      this.users = await this.$axios.$get('/admin/users').then((response) =>
        response.data.map((user: any) => {
          const percentAnswered =
            (user.total_answered / user.total_question) * 100
          const percentCorrect =
            (user.total_correct / user.total_answered) * 100
          const averageReactTime = user.total_time_used / user.total_answered
          return {
            ...user,
            percent_answered: isNaN(percentAnswered)
              ? 0
              : Math.round(percentAnswered * 100) / 100,
            percent_correct: isNaN(percentCorrect)
              ? 0
              : Math.round(percentCorrect * 100) / 100,
            average_react: isNaN(averageReactTime)
              ? 0
              : Math.round(averageReactTime * 100) / 100,
            editing: false,
          }
        })
      )
      this.loading = false
    },
  },
})
</script>
