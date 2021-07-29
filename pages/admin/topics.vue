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
        <v-dialog v-model="dialog" max-width="500px">
          <template #activator="{ on, attrs }">
            <v-btn
              color="green"
              class="ml-2 white--text"
              v-bind="attrs"
              v-on="on"
              @click="newTopic = {}"
            >
              新開主題
            </v-btn>
          </template>
          <v-card :loading="submittingCreate">
            <v-card-title>
              <span class="text-h5">新開主題</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-select
                    v-model="newTopic.group_id"
                    item-text="title"
                    item-value="id"
                    :disabled="submittingCreate"
                    :rules="[(value) => !!value || '請選擇組別']"
                    :items="groups"
                    class="mx-2"
                    label="組別"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="newTopic.title"
                    :disabled="submittingCreate"
                    :rules="[(value) => !!value || '請填入主題']"
                    counter
                    maxlength="60"
                    class="mx-2"
                    label="主題"
                    required
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red darken-1"
                text
                :disabled="submittingCreate"
                @click="dialog = false"
              >
                取消
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="submittingCreate"
                @click="createTopic(newTopic)"
              >
                送出
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.topic.group.title`]="{ item }">
      <template v-if="!item.state.editing">
        {{ item.topic.group.title }}
      </template>
      <v-select
        v-else
        v-model="item.topic.group"
        item-text="title"
        item-value="id"
        return-object
        :disabled="item.state.submitting"
        :rules="[(value) => !!value || '請選擇組別']"
        :items="groups"
        class="mx-2"
        label="組別"
        required
      ></v-select>
    </template>
    <template #[`item.topic.title`]="{ item }">
      <template v-if="!item.state.editing">{{ item.topic.title }}</template>
      <v-text-field
        v-else
        v-model="item.topic.title"
        :disabled="item.state.submitting"
        :rules="[(value) => !!value || '請填入主題']"
        counter
        maxlength="60"
        class="mx-2"
        label="主題"
        required
      ></v-text-field>
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
      <v-tooltip v-if="!item.state.editing" bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            small
            class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click="item.state.editing = true"
          >
            mdi-pencil-outline
          </v-icon>
        </template>
        <span>編輯</span>
      </v-tooltip>
      <v-tooltip v-else bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            small
            :disabled="item.state.submitting"
            color="green"
            class="mx-1"
            v-bind="attrs"
            v-on="on"
            @click="editTopic(item)"
          >
            mdi-content-save
          </v-icon>
        </template>
        <span>儲存</span>
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
import Group from '~/types/group.interface'
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
      groups: [] as Group[],
      topics: [] as TopicItem[],
      newTopic: {},
      submittingCreate: false,
    }
  },
  head: {
    title: '題庫管理 - 主題管理',
  },
  async mounted() {
    this.topics = (await this.fetchTopics()).map(
      (topic) => ({ topic, state: { editing: false } } as TopicItem)
    )
    this.groups = await this.fetchGroups()
    this.loading = false
  },
  methods: {
    async fetchTopics() {
      return await this.$axios
        .$get('/admin/topics')
        .then((response) => response.data as Topic[])
    },
    async fetchGroups() {
      return await this.$axios
        .$get('/admin/groups')
        .then((response) => response.data as Group[])
    },
    async createTopic() {
      this.submittingCreate = true
      const created = await this.submitCreate(this.newTopic)
      this.topics.push({
        topic: created,
        state: { editing: false, submitting: false },
      })
      this.$store.commit('message/setColor', 'primary')
      this.$store.commit('message/set', '新增成功！')
      this.dialog = false
      this.submittingCreate = false
    },
    async editTopic(item: TopicItem) {
      const topic = item.topic
      this.loading = true
      item.state.submitting = true
      item.topic = await this.submit(topic)
      this.$store.commit('message/setColor', 'primary')
      this.$store.commit('message/set', '編輯成功！')
      item.state.submitting = false
      item.state.editing = false
      this.loading = false
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
    async submitCreate(topic: any) {
      return await this.$axios
        .$post(`/admin/topics`, topic)
        .then((response) => response.data as Topic)
    },
    async submit(topic: Topic) {
      return await this.$axios
        .$patch(`/admin/topics/${topic.id}`, {
          ...topic,
          group_id: topic.group.id,
        })
        .then((response) => response.data as Topic)
    },
  },
})
</script>
