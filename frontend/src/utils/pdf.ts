import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import type { WorksheetFont } from '../constants/fonts'
import { PAGE_HEIGHT_MM, PAGE_WIDTH_MM, type TemplateDefinition } from '../constants/templates'
import type { WorksheetSettings } from '../store/useWorksheetStore'
import { mmToPt, TOP_PADDING_EXTRA_MM, type WorksheetLayout } from './layout'

const BORDER_GAP_MM = 2
const DASH_PATTERN = [3, 3]
const HEADER_GAP_MM = 6

interface ExportOptions {
  settings: WorksheetSettings
  template: TemplateDefinition
  layout: WorksheetLayout
  font?: WorksheetFont
}

const hexToRgb = (color: string) => {
  const hex = color.replace('#', '')
  const chunk = hex.length === 3 ? hex.split('').map((value) => value + value) : hex.match(/.{1,2}/g)
  if (!chunk) return { r: 0, g: 0, b: 0 }
  const [r, g, b] = chunk.map((value) => parseInt(value, 16) / 255)
  return { r, g, b }
}

const toPdfY = (valueFromTopMm: number) => mmToPt(PAGE_HEIGHT_MM - valueFromTopMm)

const loadFontBytes = async (url?: string) => {
  if (!url) return undefined
  const response = await fetch(url)
  if (!response.ok) throw new Error('無法載入字型檔，請稍後再試。')
  return response.arrayBuffer()
}

export const exportWorksheetPdf = async ({
  settings,
  template,
  layout,
  font,
}: ExportOptions) => {
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const page = pdfDoc.addPage([mmToPt(PAGE_WIDTH_MM), mmToPt(PAGE_HEIGHT_MM)])

  const gridColor = hexToRgb(settings.gridColor)
  const textColor = hexToRgb(settings.textColor)

  const fontBytes = await loadFontBytes(font?.pdfSource)
  const embeddedFont = fontBytes
    ? await pdfDoc.embedFont(fontBytes, { subset: true })
    : await pdfDoc.embedFont(StandardFonts.Helvetica)

  const cellSizePt = mmToPt(template.cellSizeMm)
  const referenceOpacity = settings.showReference ? settings.referenceOpacity : 0
  const fontSizePt = mmToPt(settings.fontSize * 0.2645833333)

  const drawHeader = () => {
    const gridWidthMm = template.columns * template.cellSizeMm
    const startXMm = template.paddingMm
    const startYMm = template.paddingMm + TOP_PADDING_EXTRA_MM
    const headerY = startYMm - HEADER_GAP_MM
    const nameX = startXMm + 2
    const dateX = startXMm + gridWidthMm - 62
    const labelSize = 14

    page.drawText('姓名：', {
      x: mmToPt(nameX),
      y: toPdfY(headerY),
      size: labelSize,
      font: embeddedFont,
      color: rgb(gridColor.r, gridColor.g, gridColor.b),
    })

    page.drawText('日期：', {
      x: mmToPt(dateX),
      y: toPdfY(headerY),
      size: labelSize,
      font: embeddedFont,
      color: rgb(gridColor.r, gridColor.g, gridColor.b),
    })
  }

  const drawPageBorders = () => {
    const gridWidthMm = template.columns * template.cellSizeMm
    const gridHeightMm = template.rows * template.cellSizeMm
    const startXMm = template.paddingMm
    const startYMm = template.paddingMm + TOP_PADDING_EXTRA_MM
    ;[0, -BORDER_GAP_MM].forEach((offset, index) => {
      const xMm = startXMm + offset
      const yMm = startYMm + offset
      const widthMm = gridWidthMm - offset * 2
      const heightMm = gridHeightMm - offset * 2
      page.drawRectangle({
        x: mmToPt(xMm),
        y: toPdfY(yMm + heightMm),
        width: mmToPt(widthMm),
        height: mmToPt(heightMm),
        borderWidth: index === 0 ? 0.8 : 2.5,
        borderColor: rgb(gridColor.r, gridColor.g, gridColor.b),
      })
    })
  }

  const drawCellGuides = (xMm: number, yMm: number) => {
    const top = yMm
    const bottom = yMm + template.cellSizeMm
    const left = xMm
    const right = xMm + template.cellSizeMm

    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      thickness = 0.4,
      dashed = false,
    ) => {
      page.drawLine({
        start: { x: mmToPt(x1), y: toPdfY(y1) },
        end: { x: mmToPt(x2), y: toPdfY(y2) },
        color: rgb(gridColor.r, gridColor.g, gridColor.b),
        thickness,
        dashArray: dashed ? DASH_PATTERN : undefined,
        dashPhase: dashed ? 0 : undefined,
      })
    }

    switch (settings.gridType) {
      case 'tian':
        drawLine(
          left + template.cellSizeMm / 2,
          top,
          left + template.cellSizeMm / 2,
          bottom,
          0.4,
          true,
        )
        drawLine(left, top + template.cellSizeMm / 2, right, top + template.cellSizeMm / 2, 0.4, true)
        break
      case 'mi':
        drawLine(
          left + template.cellSizeMm / 2,
          top,
          left + template.cellSizeMm / 2,
          bottom,
          0.4,
          true,
        )
        drawLine(left, top + template.cellSizeMm / 2, right, top + template.cellSizeMm / 2, 0.4, true)
        drawLine(left, top, right, bottom, 0.25, true)
        drawLine(left, bottom, right, top, 0.25, true)
        break
      case 'nine':
        drawLine(left + template.cellSizeMm / 3, top, left + template.cellSizeMm / 3, bottom, 0.35, true)
        drawLine(
          left + (2 * template.cellSizeMm) / 3,
          top,
          left + (2 * template.cellSizeMm) / 3,
          bottom,
          0.35,
          true,
        )
        drawLine(left, top + template.cellSizeMm / 3, right, top + template.cellSizeMm / 3, 0.35, true)
        drawLine(left, top + (2 * template.cellSizeMm) / 3, right, top + (2 * template.cellSizeMm) / 3, 0.35, true)
        break
      default:
        break
    }
  }

  drawHeader()
  drawPageBorders()

  layout.cells.forEach((cell) => {
    const rectX = mmToPt(cell.xMm)
    const rectY = toPdfY(cell.yMm + template.cellSizeMm)

    page.drawRectangle({
      x: rectX,
      y: rectY,
      width: cellSizePt,
      height: cellSizePt,
      borderWidth: 0.8,
      borderColor: rgb(gridColor.r, gridColor.g, gridColor.b),
    })

    drawCellGuides(cell.xMm, cell.yMm)

    const glyph = cell.char.trim().length ? cell.char : ''
    if (!glyph || referenceOpacity === 0) return

    const centerX = cell.xMm + template.cellSizeMm / 2
    const centerY = cell.yMm + template.cellSizeMm / 2

    const textWidth = embeddedFont.widthOfTextAtSize(glyph, fontSizePt)
    const xPt = mmToPt(centerX) - textWidth / 2
    const yPt = toPdfY(centerY) - fontSizePt / 3

    page.drawText(glyph, {
      x: xPt,
      y: yPt,
      size: fontSizePt,
      font: embeddedFont,
      color: rgb(textColor.r, textColor.g, textColor.b),
      opacity: referenceOpacity,
      rotate: degrees(0),
    })
  })

  return pdfDoc.save()
}

export const downloadPdf = async (options: ExportOptions) => {
  const bytes = await exportWorksheetPdf(options)
  const normalized = bytes.slice().buffer
  const blob = new Blob([normalized], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `WriteMate-${Date.now()}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}
