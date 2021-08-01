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
          >
            <v-list-item-content>
              <v-list-item-title v-text="topic.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-col>
    <v-col cols="9" class="text-center"></v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Group, { GroupItem } from '~/types/group.interface'
export default Vue.extend({
  middleware: 'role/admin',
  data() {
    return {
      loading: true,
      groupAndTopics: [] as GroupItem[],
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
    this.loading = false
  },
  methods: {
    async fetchGroupAndTopics() {
      return await this.$axios
        .$get('/admin/groups?withTopics=true')
        .then((response) => response.data as Group[])
    },
  },
})
</script>
