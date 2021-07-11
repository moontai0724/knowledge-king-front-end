<template>
  <v-data-table
    :headers="headers"
    :items="users"
    :expanded.sync="expanded"
    :search="search"
    item-key="id"
    show-expand
    style="max-width: 1200px; margin: 0 auto"
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
    <template #[`item.percent_answered`]="{ item }">
      <div style="max-height: 100%; height: 40px" class="d-flex align-center">
        <donut-chart height="80%" :percent="item.percent_answered" />
        <span class="mx-2">{{ item.percent_answered }}%</span>
      </div>
    </template>
    <template #[`item.percent_correct`]="{ item }">
      <div style="max-height: 100%; height: 40px" class="d-flex align-center">
        <donut-chart height="80%" :percent="item.percent_correct" />
        <span class="mx-2">{{ item.percent_correct }}%</span>
      </div>
    </template>
    <template #expanded-item="{ item }">
      <td :colspan="headers.length">{{ item }}</td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
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
        { text: '姓名', value: 'name', width: '30%' },
        {
          text: '總答題數 (%)',
          value: 'percent_answered',
          width: '30%',
        },
        {
          text: '正確率 (%)',
          value: 'percent_correct',
          width: '30%',
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
          return {
            ...user,
            percent_answered: isNaN(percentAnswered) ? 0 : percentAnswered,
            percent_correct: isNaN(percentCorrect) ? 0 : percentCorrect,
          }
        })
      )
    },
  },
})
</script>
