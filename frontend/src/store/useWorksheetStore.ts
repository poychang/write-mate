import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEFAULT_FONT_ID } from '../constants/fonts'
import { DEFAULT_TEMPLATE_ID, type TemplateId } from '../constants/templates'

export type GridType = 'tian' | 'mi' | 'nine'

export interface WorksheetSettings {
  templateId: TemplateId
  text: string
  fontId: string
  fontSize: number
  textColor: string
  gridColor: string
  gridType: GridType
  showReference: boolean
  referenceOpacity: number
}

export interface SettingsPreset {
  id: string
  label: string
  savedAt: number
  snapshot: WorksheetSettings
}

interface WorksheetState {
  settings: WorksheetSettings
  history: SettingsPreset[]
  setTemplate: (templateId: TemplateId) => void
  updateSettings: (partial: Partial<WorksheetSettings>) => void
  savePreset: () => void
  applyPreset: (presetId: string) => void
  clearPresets: () => void
}

const SAMPLE_TEXT = '永和九年，歲在癸丑。暮春之初，會於會稽山陰之蘭亭。'

const HISTORY_LIMIT = 3

const defaultSettings: WorksheetSettings = {
  templateId: DEFAULT_TEMPLATE_ID,
  text: SAMPLE_TEXT,
  fontId: DEFAULT_FONT_ID,
  fontSize: 46,
  textColor: '#1b1b1f',
  gridColor: '#5b6045',
  gridType: 'tian',
  showReference: true,
  referenceOpacity: 0.35,
}

export const useWorksheetStore = create<WorksheetState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      history: [],
      setTemplate: (templateId) => set((state) => ({
        settings: { ...state.settings, templateId },
      })),
      updateSettings: (partial) => set((state) => ({
        settings: { ...state.settings, ...partial },
      })),
      savePreset: () =>
        set((state) => {
          const preset: SettingsPreset = {
            id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            label: `設定 ${new Date().toLocaleTimeString('zh-TW', {
              hour: '2-digit',
              minute: '2-digit',
            })}`,
            savedAt: Date.now(),
            snapshot: { ...state.settings },
          }
          const nextHistory = [preset, ...state.history].slice(0, HISTORY_LIMIT)
          return { history: nextHistory }
        }),
      applyPreset: (presetId) => {
        const preset = get().history.find((entry) => entry.id === presetId)
        if (!preset) return
        set({ settings: preset.snapshot })
      },
      clearPresets: () => set({ history: [] }),
    }),
    {
      name: 'write-mate-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings, history: state.history }),
    },
  ),
)
