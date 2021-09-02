import Topic from './topic.interface'
import { UserPublic } from './user.interface'

/* eslint-disable camelcase */
export interface History {
  id: number
  score: number
  created_at: Date
  total_question: number
  total_answered: number
  total_correct: number
  total_time_limit: number
  total_time_used: number
  user?: UserPublic[]
  topics?: Topic[]
  percentCorrect?: number
  percentReactTime?: number
  averageReactTime?: number
}

export default History
