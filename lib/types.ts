export type ReportStatus =
  | 'uploaded'
  | 'queued_extraction'
  | 'extracting'
  | 'queued_analysis'
  | 'analyzing'
  | 'completed'
  | 'extraction_failed'
  | 'analysis_failed'

export interface ReportSummary {
  id: string
  collected_at: string
  status: ReportStatus
  abnormal_count: number | null
  source: string | null
}

export interface ReportDetailMetric {
  canonical_key: string
  display_name: string
  category: string
  value: number | null
  unit: string
  flag: 'low' | 'normal' | 'high' | 'unknown'
  confidence: number | null
  ref_low: number | null
  ref_high: number | null
  original_value_text: string | null
}

export interface ReportDetail {
  id: string
  collected_at: string
  status: ReportStatus
  file_url: string | null
  metrics: ReportDetailMetric[]
  ai_summary: {
    summary: string
    risks: string[]
    recommendations: string[]
  } | null
}

export interface TrendPoint {
  date: string
  value: number | null
  flag: 'low' | 'normal' | 'high' | 'unknown'
}

export type TrendSeries = Record<string, TrendPoint[]>
