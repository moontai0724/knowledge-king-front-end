<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8" lg="6">
      <v-form v-model="valid" @submit.prevent="doLogin">
        <v-card ref="form">
          <v-alert v-if="error" type="error" transition="scale-transition">
            {{ error }}
          </v-alert>
          <v-card-title class="justify-center">
            <span class="title">使用者登入</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="login.account"
                    label="帳號"
                    :rules="rules"
                    hide-details="auto"
                    type="text"
                    autocomplete="username"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="login.password"
                    label="密碼"
                    :rules="rules"
                    hide-details="auto"
                    type="password"
                    autocomplete="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" type="submit" :disabled="!valid">登入</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  auth: 'guest',
  data() {
    return {
      login: {
        account: '',
        password: '',
      },
      error: '',
      valid: false,
      rules: [(value: string) => !!value || '此欄位為必填'],
    }
  },
  head: {
    title: '登入',
  },
  methods: {
    async doLogin() {
      try {
        this.error = ''
        await this.$auth.loginWith('local', {
          data: this.login,
        })
        this.$router.push('/')
      } catch (err) {
        this.error = '登入失敗，請檢查您的帳號密碼！'
      }
    },
  },
})
</script>
