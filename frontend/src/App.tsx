import { useMemo, useState } from 'react'
import './App.css'
import { ControlPanel } from './components/ControlPanel'
import { WorksheetPreview } from './components/WorksheetPreview'
import { FONT_MAP } from './constants/fonts'
import { TEMPLATE_MAP } from './constants/templates'
import { downloadPdf } from './utils/pdf'
import { buildWorksheetLayout } from './utils/layout'
import { useWorksheetStore } from './store/useWorksheetStore'

function App() {
  const settings = useWorksheetStore((state) => state.settings)
  const history = useWorksheetStore((state) => state.history)
  const setTemplate = useWorksheetStore((state) => state.setTemplate)
  const updateSettings = useWorksheetStore((state) => state.updateSettings)
  const savePreset = useWorksheetStore((state) => state.savePreset)
  const applyPreset = useWorksheetStore((state) => state.applyPreset)
  const clearPresets = useWorksheetStore((state) => state.clearPresets)

  const template = TEMPLATE_MAP[settings.templateId]
  const layout = useMemo(() => buildWorksheetLayout(template, settings.text), [template, settings.text])

  const [zoom, setZoom] = useState(90)
  const [exportState, setExportState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const [exportMessage, setExportMessage] = useState('')

  const handleExport = async () => {
    setExportState('busy')
    setExportMessage('正在準備 PDF...')
    try {
      await downloadPdf({ settings, template, layout, font: FONT_MAP[settings.fontId] })
      setExportState('done')
      setExportMessage('PDF 已下載')
    } catch (error) {
      setExportState('error')
      setExportMessage(error instanceof Error ? error.message : '匯出失敗，請再試一次')
    } finally {
      setTimeout(() => {
        setExportState('idle')
        setExportMessage('')
      }, 2600)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-hero">
        <h1>Write Mate - 字帖產生器</h1>
        <p className="hero-copy">選模板、填文字、立即預覽，再也不需要手動排版。</p>
      </header>

      <main className="workspace">
        <ControlPanel
          settings={settings}
          template={template}
          layout={layout}
          history={history}
          setTemplate={setTemplate}
          updateSettings={updateSettings}
          savePreset={savePreset}
          applyPreset={applyPreset}
          clearPresets={clearPresets}
        />

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div>
              <p className="section-title">預覽與下載</p>
              <div className="zoom-control">
                <label htmlFor="zoom">縮放 {zoom}%</label>
                <input
                  id="zoom"
                  type="range"
                  min={60}
                  max={140}
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                />
              </div>
            </div>
            <button
              type="button"
              className={`primary-btn${exportState === 'busy' ? ' is-loading' : ''}`}
              onClick={handleExport}
              disabled={exportState === 'busy'}
            >
              {exportState === 'busy' ? '匯出中...' : '下載 PDF'}
            </button>
          </div>

          <WorksheetPreview settings={settings} template={template} layout={layout} zoom={zoom} />

          <div className="preview-status">
            <span>目前模板：{template.label} · {template.rows}×{template.columns}</span>
            {exportState !== 'idle' && exportMessage ? (
              <span className={`status-badge ${exportState}`}>{exportMessage}</span>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
