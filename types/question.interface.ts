/* eslint-disable camelcase */
import Topic from './topic.interface'
import User from './user.interface'

export default interface Question {
  id: number
  question: string
  option_1: string
  option_2: string
  option_3: string
  option_4: string
  answer: number
  time_limit: number
  disabled: boolean
  author: User
  topic: Topic
}
