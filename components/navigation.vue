<template>
  <div>
    <v-app-bar color="primary" dark app dense>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title style="overflow: visible" v-text="title" />
      <v-spacer />
      <v-menu bottom offset-y>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
          <span class="text-truncate" v-text="$auth.user.name" />
          <v-avatar color="indigo" size="36" class="mx-1">
            <img :src="avatarUrl" alt="avatar" />
          </v-avatar>
        </template>
        <v-list dense>
          <v-list-item disabled>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>個人資料</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>登出</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
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
import md5 from 'md5'
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
  computed: {
    avatarUrl() {
      const base = 'https://www.gravatar.com/avatar/'
      const email: string = String(this.$auth.user?.email)
      const emailHash = md5(email)
      return base + emailHash
    },
  },
  mounted() {
    this.title = String(this.$meta().refresh().metaInfo.titleChunk)
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    },
  },
})
</script>
