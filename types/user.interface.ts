/* eslint-disable camelcase */
export interface User {
  id: number
  name: string
  email: string
  account: string
  password: string
  registered_at: Date
  profile_photo: string | null
  permission: number
  total_question_distincted: number
  total_answered_distincted: number
  total_question: number
  total_answered: number
  total_correct: number
  total_time_limit: number
  total_time_used: number
}

export interface UserItem {
  user: User
  stats: {
    percentAnswered: number
    percentCorrect: number
    averageReactTime: number
  }
  states?: {
    isFormValid: boolean
    isLoading: boolean
    isEditing: boolean
  }
}
