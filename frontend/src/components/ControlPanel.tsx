import type { ChangeEvent, ReactNode } from 'react'
import { WORKSHEET_FONTS, FONT_MAP } from '../constants/fonts'
import {
  TEMPLATE_DEFINITIONS,
  type TemplateDefinition,
  type TemplateId,
} from '../constants/templates'
import type { SettingsPreset, WorksheetSettings } from '../store/useWorksheetStore'
import type { WorksheetLayout } from '../utils/layout'

const TEXT_SWATCHES = ['#1b1b1f', '#78350f', '#0f4c5c', '#4b3f72', '#6f2dbd']
const GRID_SWATCHES = ['#5b6045', '#2f3f4f', '#b26e63', '#7c4f2f', '#3a3d3e']

interface ControlPanelProps {
  settings: WorksheetSettings
  template: TemplateDefinition
  layout: WorksheetLayout
  history: SettingsPreset[]
  setTemplate: (templateId: TemplateId) => void
  updateSettings: (partial: Partial<WorksheetSettings>) => void
  savePreset: () => void
  applyPreset: (presetId: string) => void
  clearPresets: () => void
}

const Section = ({ title, description, children }: {
  title: string
  description?: string
  children: ReactNode
}) => (
  <section className="panel-section">
    <header>
      <p className="section-title">{title}</p>
      {description ? <p className="section-desc">{description}</p> : null}
    </header>
    {children}
  </section>
)

export const ControlPanel = ({
  settings,
  template,
  layout,
  history,
  setTemplate,
  updateSettings,
  savePreset,
  applyPreset,
  clearPresets,
}: ControlPanelProps) => {
  const charAlert: string[] = []
  if (template.minChars && layout.charCount < template.minChars) {
    charAlert.push(`至少需要 ${template.minChars} 字`)
  }
  if (layout.overflow > 0) {
    charAlert.push(`已超出 ${layout.overflow} 字，MVP 僅提供單頁`)
  }

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateSettings({ text: event.target.value })
  }

  const handleFontSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateSettings({ fontSize: Number(event.target.value) })
  }

  return (
    <aside className="control-panel" aria-label="控制面板">
      <Section title="模板">
        <div className="template-grid">
          {TEMPLATE_DEFINITIONS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`template-card${settings.templateId === item.id ? ' is-active' : ''}`}
              onClick={() => setTemplate(item.id)}
            >
              <div>
                <p className="template-label">{item.label}</p>
                <p className="template-desc">{item.description}</p>
              </div>
              <span className="template-meta">{item.rows}×{item.columns}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="文字內容" description="輸入欲練習的單字或文章，支援 24 ~ 1020 字">
        <textarea
          className="text-input"
          rows={6}
          value={settings.text}
          onChange={handleTextChange}
          aria-label="輸入練習文字"
        />
        <div className="text-meta">
          <span>{layout.charCount} / {template.maxChars} 字</span>
          {charAlert.length ? <span className="text-warning">{charAlert.join(' · ')}</span> : null}
        </div>
      </Section>

      <Section title="字型與大小">
        <label className="field-label" htmlFor="font-select">字型</label>
        <select
          id="font-select"
          value={settings.fontId}
          onChange={(event) => updateSettings({ fontId: event.target.value })}
        >
          {WORKSHEET_FONTS.map((font) => (
            <option key={font.id} value={font.id}>{font.label}</option>
          ))}
        </select>
        <p className="option-note">{FONT_MAP[settings.fontId]?.description}</p>

        <label className="field-label" htmlFor="font-size">字型大小</label>
        <input
          id="font-size"
          type="range"
          min={32}
          max={78}
          step={2}
          value={settings.fontSize}
          onChange={handleFontSizeChange}
        />
        <div className="text-meta">
          <span>{settings.fontSize}px</span>
        </div>
      </Section>

      <Section title="色彩設定">
        <div className="swatch-group">
          <p className="field-label">參考字顏色</p>
          <div className="swatch-row">
            {TEXT_SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                className={`swatch${settings.textColor === color ? ' is-active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => updateSettings({ textColor: color })}
                aria-label={`選擇文字顏色 ${color}`}
              />
            ))}
            <input
              type="color"
              value={settings.textColor}
              onChange={(event) => updateSettings({ textColor: event.target.value })}
              aria-label="自訂文字顏色"
            />
          </div>
        </div>

        <div className="swatch-group">
          <p className="field-label">格線顏色</p>
          <div className="swatch-row">
            {GRID_SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                className={`swatch${settings.gridColor === color ? ' is-active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => updateSettings({ gridColor: color })}
                aria-label={`選擇格線顏色 ${color}`}
              />
            ))}
            <input
              type="color"
              value={settings.gridColor}
              onChange={(event) => updateSettings({ gridColor: event.target.value })}
              aria-label="自訂格線顏色"
            />
          </div>
        </div>
      </Section>

      <Section title="格線與參考字">
        <div className="grid-type-row">
          {(['tian', 'mi', 'nine'] as const).map((type) => (
            <label key={type} className={`grid-chip${settings.gridType === type ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="grid-type"
                value={type}
                checked={settings.gridType === type}
                onChange={() => updateSettings({ gridType: type })}
              />
              <span>{type === 'tian' ? '田字格' : type === 'mi' ? '米字格' : '九宮格'}</span>
            </label>
          ))}
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={settings.showReference}
            onChange={(event) => updateSettings({ showReference: event.target.checked })}
          />
          顯示淡色參考字
        </label>

        <label className="field-label" htmlFor="reference-opacity">參考字濃度</label>
        <input
          id="reference-opacity"
          type="range"
          min={0.1}
          max={0.9}
          step={0.05}
          value={settings.referenceOpacity}
          onChange={(event) => updateSettings({ referenceOpacity: Number(event.target.value) })}
          disabled={!settings.showReference}
        />
      </Section>

      <Section title="常用設定" description="WriteMate 會記住最近 3 組設定，方便快速切換">
        <div className="preset-actions">
          <button type="button" onClick={savePreset}>儲存目前設定</button>
          <button type="button" onClick={clearPresets} disabled={!history.length}>清除</button>
        </div>
        <div className="preset-list">
          {history.length === 0 && <p className="section-desc">尚未儲存設定</p>}
          {history.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-chip"
              onClick={() => applyPreset(preset.id)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Section>
    </aside>
  )
}
