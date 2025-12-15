import type { TemplateDefinition } from '../constants/templates'
import { FONT_MAP } from '../constants/fonts'
import type { WorksheetSettings } from '../store/useWorksheetStore'
import { mmToPx, PAGE_SIZE_MM, TOP_PADDING_EXTRA_MM, type WorksheetLayout } from '../utils/layout'

interface WorksheetPreviewProps {
  settings: WorksheetSettings
  template: TemplateDefinition
  layout: WorksheetLayout
  zoom: number
}

const pageWidthPx = mmToPx(PAGE_SIZE_MM.width)
const pageHeightPx = mmToPx(PAGE_SIZE_MM.height)
const BORDER_GAP_MM = 2
const HEADER_GAP_MM = 6
const DASH_PATTERN = '6 6'

export const WorksheetPreview = ({ settings, template, layout, zoom }: WorksheetPreviewProps) => {
  const font = FONT_MAP[settings.fontId]
  const cellSizePx = mmToPx(template.cellSizeMm)
  const scale = zoom / 100
  const textOpacity = settings.showReference ? settings.referenceOpacity : 0

  const gridWidthMm = template.columns * template.cellSizeMm
  const gridHeightMm = template.rows * template.cellSizeMm
  const gridStartXMm = template.paddingMm
  const gridStartYMm = template.paddingMm + TOP_PADDING_EXTRA_MM

  const headerY = mmToPx(gridStartYMm - HEADER_GAP_MM)
  const nameX = mmToPx(gridStartXMm + 2)
  const dateX = mmToPx(gridStartXMm + gridWidthMm - 62)

  const renderHeader = () => (
    <g className="worksheet-header" fontSize={14} fill={settings.gridColor}>
      <text x={nameX} y={headerY} fontWeight={700}>姓名：</text>
      <text x={dateX} y={headerY} fontWeight={700}>日期：</text>
    </g>
  )

  const drawDoubleBorder = () => {
    const offsets = [0, -BORDER_GAP_MM]
    return offsets.map((offset, index) => {
      const xMm = gridStartXMm + offset
      const yMm = gridStartYMm + offset
      const widthMm = gridWidthMm - offset * 2
      const heightMm = gridHeightMm - offset * 2
      return (
        <rect
          key={`border-${index}`}
          x={mmToPx(xMm)}
          y={mmToPx(yMm)}
          width={mmToPx(widthMm)}
          height={mmToPx(heightMm)}
          fill="transparent"
          stroke={settings.gridColor}
          strokeWidth={index === 0 ? 0.8 : 2.5}
        />
      )
    })
  }

  return (
    <div className="preview-shell">
      <div className="preview-canvas" style={{ transform: `scale(${scale})` }}>
        <svg
          width={pageWidthPx}
          height={pageHeightPx}
          viewBox={`0 0 ${pageWidthPx} ${pageHeightPx}`}
          className="worksheet-svg"
        >
          <rect width={pageWidthPx} height={pageHeightPx} fill="#fffef8" rx={8} />
          {renderHeader()}
          {drawDoubleBorder()}
          {layout.cells.map((cell) => {
            const x = mmToPx(cell.xMm)
            const y = mmToPx(cell.yMm)
            return (
              <g key={`${cell.row}-${cell.column}`}>
                <rect
                  x={x}
                  y={y}
                  width={cellSizePx}
                  height={cellSizePx}
                  fill="transparent"
                  stroke={settings.gridColor}
                  strokeWidth={0.8}
                  vectorEffect="non-scaling-stroke"
                />
                {settings.gridType !== 'tian' ? null : (
                  <>
                    <line
                      x1={x + cellSizePx / 2}
                      y1={y}
                      x2={x + cellSizePx / 2}
                      y2={y + cellSizePx}
                      stroke={settings.gridColor}
                      strokeWidth={0.4}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={x}
                      y1={y + cellSizePx / 2}
                      x2={x + cellSizePx}
                      y2={y + cellSizePx / 2}
                      stroke={settings.gridColor}
                      strokeWidth={0.4}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                )}
                {settings.gridType !== 'mi' ? null : (
                  <>
                    <line
                      x1={x + cellSizePx / 2}
                      y1={y}
                      x2={x + cellSizePx / 2}
                      y2={y + cellSizePx}
                      stroke={settings.gridColor}
                      strokeWidth={0.4}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={x}
                      y1={y + cellSizePx / 2}
                      x2={x + cellSizePx}
                      y2={y + cellSizePx / 2}
                      stroke={settings.gridColor}
                      strokeWidth={0.4}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={x}
                      y1={y}
                      x2={x + cellSizePx}
                      y2={y + cellSizePx}
                      stroke={settings.gridColor}
                      strokeWidth={0.3}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={x}
                      y1={y + cellSizePx}
                      x2={x + cellSizePx}
                      y2={y}
                      stroke={settings.gridColor}
                      strokeWidth={0.3}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                )}
                {settings.gridType !== 'nine' ? null : (
                  <>
                    <line
                      x1={x + cellSizePx / 3}
                      y1={y}
                      x2={x + cellSizePx / 3}
                      y2={y + cellSizePx}
                      stroke={settings.gridColor}
                      strokeWidth={0.35}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={x + (2 * cellSizePx) / 3}
                      y1={y}
                      x2={x + (2 * cellSizePx) / 3}
                      y2={y + cellSizePx}
                      stroke={settings.gridColor}
                      strokeWidth={0.35}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={x}
                      y1={y + cellSizePx / 3}
                      x2={x + cellSizePx}
                      y2={y + cellSizePx / 3}
                      stroke={settings.gridColor}
                      strokeWidth={0.35}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                    <line
                      x1={x}
                      y1={y + (2 * cellSizePx) / 3}
                      x2={x + cellSizePx}
                      y2={y + (2 * cellSizePx) / 3}
                      stroke={settings.gridColor}
                      strokeWidth={0.35}
                      strokeDasharray={DASH_PATTERN}
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                )}
                {textOpacity === 0 || !cell.char.trim() ? null : (
                  <text
                    x={x + cellSizePx / 2}
                    y={y + cellSizePx / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: font?.cssStack,
                      fontSize: `${settings.fontSize}px`,
                      fill: settings.textColor,
                      opacity: textOpacity,
                      writingMode: template.orientation === 'vertical' ? 'vertical-rl' : 'horizontal-tb',
                    }}
                  >
                    {cell.char}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <div className="preview-messages">
        {layout.overflow > 0 && (
          <p className="preview-warning">超出 {layout.overflow} 字，匯出時僅包含第一頁。</p>
        )}
        {layout.charCount === 0 && (
          <p className="preview-hint">輸入任何文字即可即時生成字帖預覽。</p>
        )}
      </div>
    </div>
  )
}
