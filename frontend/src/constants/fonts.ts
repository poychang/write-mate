export interface WorksheetFont {
  id: string
  label: string
  cssStack: string
  description: string
  sample: string
  pdfSource?: string
}

const CHENYULOYAN_FONT_URL =
  'https://raw.githubusercontent.com/Chenyu-otf/chenyuluoyan_thin/main/ChenYuluoyan-2.0-Thin.ttf'

export const WORKSHEET_FONTS: WorksheetFont[] = [
  {
    id: 'chenyuluoyan-thin',
    label: '辰宇落雁體 Thin',
    description: '細緻的楷書筆觸，適合作為示範字型。',
    sample: '辰宇落雁體',
    cssStack: '"ChenYuluoyan", "Klee One", "Noto Serif TC", serif',
    pdfSource: CHENYULOYAN_FONT_URL,
  },
  {
    id: 'cwtex-kai',
    label: 'cwTeX 楷體',
    description: '教科書常見的端正楷書。',
    sample: '正楷示範字',
    cssStack: '"cwTeXKai", "Noto Serif TC", serif',
  },
  {
    id: 'klee-one',
    label: 'Klee One',
    description: '日系手寫風格，線條較為活潑。',
    sample: '和風練字',
    cssStack: '"Klee One", "Noto Serif TC", cursive',
  },
  {
    id: 'source-han-serif',
    label: 'Source Han Serif',
    description: '跨語系的高辨識宋體，適合文章練習。',
    sample: '思源宋體',
    cssStack: '"Source Han Serif", "Noto Serif TC", serif',
  },
  {
    id: 'mini-kai',
    label: '迷你繁楷',
    description: '筆畫較粗、對比明顯，適合初學者。',
    sample: '迷你繁楷',
    cssStack: '"MiniKai", "Noto Serif TC", serif',
  },
]

export const FONT_MAP = Object.fromEntries(
  WORKSHEET_FONTS.map((font) => [font.id, font]),
) as Record<string, WorksheetFont>

export const DEFAULT_FONT_ID = WORKSHEET_FONTS[0].id
