import Topic from './topic.interface'

/* eslint-disable camelcase */
export interface Group {
  id: number
  title: string
  image_path: string
  topics?: Topic[]
}

export interface GroupItem {
  group: Group
  state: {
    active?: boolean
  }
}

export default Group
