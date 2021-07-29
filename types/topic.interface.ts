/* eslint-disable camelcase */
import Group from './group.interface'

export interface Topic {
  id: number
  title: string
  group: Group
  opened_from: Date | null
  question_amount: number
}

export interface TopicItem {
  topic: Topic
  state: {
    editing: boolean
    submitting: boolean
  }
}

export default Topic
