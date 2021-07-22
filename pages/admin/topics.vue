<template>
  <v-data-table
    :headers="headers"
    :loading="loading"
    :search="search"
    :items="topics"
    item-key="id"
    style="max-width: 1200px; margin: 0 auto"
    class="elevation-1"
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
    <template #[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            small
            class="mx-1"
            disabled
            v-bind="attrs"
            v-on="on"
            @click="findQuestions(item)"
          >
            mdi-text-box-search-outline
          </v-icon>
        </template>
        <span>查看題目</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            small
            class="mx-1"
            disabled
            v-bind="attrs"
            v-on="on"
            @click="editItem(item)"
          >
            mdi-pencil-outline
          </v-icon>
        </template>
        <span>編輯</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            small
            class="mx-1"
            disabled
            v-bind="attrs"
            v-on="on"
            @click="lockItem(item)"
          >
            mdi-lock-outline
          </v-icon>
        </template>
        <span>關閉作答</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import Topic from '~/types/topic.interface'
export default Vue.extend({
  middleware: 'role/admin',
  data() {
    return {
      loading: true,
      search: '',
      headers: [
        {
          text: '組別',
          align: 'center',
          value: 'group.title',
          width: '10%',
        },
        { text: '主題', value: 'title', width: '60%' },
        {
          text: '題目數量',
          value: 'question_amount',
          width: '10%',
          align: 'center',
        },
        {
          text: '操作',
          value: 'actions',
          width: '20%',
          align: 'center',
        },
      ],
      topics: [] as Topic[],
    }
  },
  head: {
    title: '題庫管理 - 主題管理',
  },
  async mounted() {
    this.topics = await this.fetchTopics()
    this.loading = false
  },
  methods: {
    async fetchTopics() {
      return await this.$axios
        .$get('/admin/topics')
        .then((response) => response.data as Topic[])
    },
  },
})
</script>
