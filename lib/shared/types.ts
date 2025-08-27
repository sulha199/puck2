import type { EventSettings } from "@azavista/advanced-search/lib/search-types"

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

export type Event = {
  external_id?: string;
  name: string;
  start: string;
  end: string;
  timezone: string;
  settings: EventSettings;
  series_id?: string;
}