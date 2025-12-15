export type TemplateId = 'article-horizontal' | 'article-vertical'

export type TemplateOrientation = 'horizontal' | 'vertical'

export interface TemplateDefinition {
  id: TemplateId
  label: string
  description: string
  rows: number
  columns: number
  orientation: TemplateOrientation
  minChars?: number
  maxChars: number
  cellSizeMm: number
  paddingMm: number
  group: '文章'
}

const CELL_SIZE_MM = 15
const PADDING_MM = 15

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    id: 'article-horizontal',
    label: '文章 · 橫式',
    description: '204 格，左至右書寫',
    rows: 17,
    columns: 12,
    orientation: 'horizontal',
    minChars: 24,
    maxChars: 204,
    cellSizeMm: CELL_SIZE_MM,
    paddingMm: PADDING_MM,
    group: '文章',
  },
  {
    id: 'article-vertical',
    label: '文章 · 直式',
    description: '204 格，右至左直排',
    rows: 17,
    columns: 12,
    orientation: 'vertical',
    minChars: 24,
    maxChars: 204,
    cellSizeMm: CELL_SIZE_MM,
    paddingMm: PADDING_MM,
    group: '文章',
  },
]

export const TEMPLATE_MAP = Object.fromEntries(
  TEMPLATE_DEFINITIONS.map((definition) => [definition.id, definition]),
) as Record<TemplateId, TemplateDefinition>

export const DEFAULT_TEMPLATE_ID: TemplateId = 'article-horizontal'

export const PAGE_WIDTH_MM = 210
export const PAGE_HEIGHT_MM = 297
