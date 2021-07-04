<template>
  <div>
    <v-app-bar color="primary" dark app dense>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group>
          <template v-for="item in items">
            <v-list-item
              v-if="item.childs.length == 0"
              :key="item.title"
              :to="item.to"
              :disabled="!item.to"
              @click="title = item.title"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />
            </v-list-item>
            <v-list-group
              v-else
              :key="item.title"
              :prepend-icon="item.icon"
              no-action
              color
            >
              <template #activator>
                <v-list-item-title v-text="item.title" />
              </template>
              <v-list-item
                v-for="child in item.childs"
                :key="child.title"
                :to="child.to"
                :disabled="!child.to"
                @click="title = `${item.title} - ${child.title}`"
              >
                <v-list-item-icon>
                  <v-icon v-text="child.icon" />
                </v-list-item-icon>
                <v-list-item-title v-text="child.title" />
              </v-list-item>
            </v-list-group>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      drawer: false,
      title: '',
      items: [
        {
          icon: 'mdi-account',
          title: '使用者管理',
          to: '',
          childs: [],
        },
        {
          icon: 'mdi-database',
          title: '題庫管理',
          childs: [
            {
              icon: 'mdi-folder-multiple',
              title: '主題管理',
              to: '',
            },
            {
              icon: 'mdi-file-document-multiple-outline',
              title: '題目管理',
              to: '',
            },
          ],
        },
        {
          icon: 'mdi-text-box-search-outline',
          title: '歷史紀錄查詢',
          to: '',
          childs: [],
        },
      ],
    }
  },
  mounted() {
    this.title = String(this.$meta().refresh().metaInfo.titleChunk)
  },
})
</script>
