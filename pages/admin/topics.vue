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
        <v-dialog v-model="dialog">
          <template #activator="{ on, attrs }">
            <v-btn
              disabled
              color="green"
              class="ml-2 white--text"
              v-bind="attrs"
              v-on="on"
            >
              新開主題
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">新開主題</span>
            </v-card-title>

            <v-card-text></v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
      <v-tooltip v-if="item.topic.opened_from" bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            small
            color="red"
            class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click="lockItem(item)"
          >
            mdi-lock-outline
          </v-icon>
        </template>
        <span>關閉作答</span>
      </v-tooltip>
      <v-tooltip v-else bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            small
            color="green"
            class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click="unlockItem(item)"
          >
            mdi-lock-open-variant-outline
          </v-icon>
        </template>
        <span>開放作答</span>
      </v-tooltip>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import Topic, { TopicItem } from '~/types/topic.interface'
export default Vue.extend({
  middleware: 'role/admin',
  data() {
    return {
      dialog: false,
      loading: true,
      search: '',
      headers: [
        {
          text: '組別',
          align: 'center',
          value: 'topic.group.title',
          width: '10%',
        },
        { text: '主題', value: 'topic.title', width: '60%' },
        {
          text: '題目數量',
          value: 'topic.question_amount',
          width: '10%',
          align: 'center',
        },
        {
          text: '操作',
          value: 'actions',
          width: '20%',
          align: 'center',
          sortable: false,
        },
      ],
      topics: [] as TopicItem[],
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
        .then((topics) => topics.map((topic) => ({ topic } as TopicItem)))
    },
    async unlockItem(item: TopicItem) {
      const topic = item.topic
      topic.opened_from = new Date()
      return await this.submit(topic)
    },
    async lockItem(item: TopicItem) {
      const topic = item.topic
      topic.opened_from = null
      return await this.submit(topic)
    },
    async submit(topic: Topic) {
      return await this.$axios
        .$patch(`/admin/topics/${topic.id}`, topic)
        .then((response) => response.data as Topic)
    },
  },
})
</script>
