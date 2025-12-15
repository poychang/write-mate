import { PAGE_HEIGHT_MM, PAGE_WIDTH_MM, type TemplateDefinition } from '../constants/templates'

export const MM_TO_PX = 3.779527559055118
export const PX_TO_MM = 0.2645833333

export const mmToPx = (mm: number) => mm * MM_TO_PX
export const pxToMm = (px: number) => px * PX_TO_MM
export const mmToPt = (mm: number) => (mm / 25.4) * 72
export const TOP_PADDING_EXTRA_MM = 6

export interface WorksheetCell {
  row: number
  column: number
  xMm: number
  yMm: number
  char: string
}

export interface WorksheetLayout {
  cells: WorksheetCell[]
  overflow: number
  charCount: number
  maxChars: number
  minChars?: number
}

const tokenize = (text: string) =>
  Array.from(text.replace(/\r/g, '')).map((char) => (char === '\n' ? '\u3000' : char))

export const buildWorksheetLayout = (
  template: TemplateDefinition,
  text: string,
): WorksheetLayout => {
  const characters = tokenize(text)
  const totalCells = template.rows * template.columns

  const cells: WorksheetCell[] = []
  for (let row = 0; row < template.rows; row += 1) {
    for (let column = 0; column < template.columns; column += 1) {
      cells.push({
        row,
        column,
        xMm: template.paddingMm + column * template.cellSizeMm,
        yMm: template.paddingMm + TOP_PADDING_EXTRA_MM + row * template.cellSizeMm,
        char: '',
      })
    }
  }

  if (template.orientation === 'vertical') {
    let pointer = 0
    for (let column = template.columns - 1; column >= 0; column -= 1) {
      for (let row = 0; row < template.rows; row += 1) {
        const targetIndex = row * template.columns + column
        cells[targetIndex].char = characters[pointer] ?? ''
        pointer += 1
      }
    }
  } else {
    cells.forEach((cell, index) => {
      cell.char = characters[index] ?? ''
    })
  }

  return {
    cells,
    overflow: Math.max(characters.length - totalCells, 0),
    charCount: characters.length,
    maxChars: template.maxChars,
    minChars: template.minChars,
  }
}

export const PAGE_SIZE_MM = {
  width: PAGE_WIDTH_MM,
  height: PAGE_HEIGHT_MM,
}
