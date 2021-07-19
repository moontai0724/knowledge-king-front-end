import { Module, Mutation, VuexModule } from 'vuex-module-decorators'

@Module({
  name: 'message',
  stateFactory: true,
  namespaced: true,
})
export default class MessageStoreModule extends VuexModule {
  color: string = 'error'
  content?: string = undefined

  @Mutation
  setColor(color: string) {
    this.color = color
  }

  @Mutation
  set(message: string) {
    this.content = message
  }

  @Mutation
  clear() {
    this.content = undefined
  }
}
