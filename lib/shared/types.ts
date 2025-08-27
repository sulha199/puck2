
export type Asset = {
  id: string
  name: string
  content_type: string
  file_url: string
  thumbnail_url: string
  file_size: number
  length: number
  filename: string
  participant_id?: string
  ['metadata.created_at']?: string
  ['metadata.mime_type']?: string
  ['metadata.name']?: string
  ['metadata.updated_at']?: string
  type?: string
  created_at?: string
  updated_at?: string
  team_ids?: number[]
}

export type CssSelection = Array<string>
