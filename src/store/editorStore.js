import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const DEFAULT_EDITOR_STATE = {
  language: 'python',
  code: '',
}

const useEditorStore = create(
  persist(
    (set, get) => ({
      editorState: {},

      setEditorState: (questionId, state) => {
        set((prev) => ({
          editorState: {
            ...prev.editorState,
            [questionId]: {
              ...DEFAULT_EDITOR_STATE,
              ...state,
            },
          },
        }))
      },

      getEditorState: (questionId) => {
        return get().editorState[questionId] || DEFAULT_EDITOR_STATE
      },

      clearEditorState: (questionId) => {
        set((prev) => {
          const newState = { ...prev.editorState }
          delete newState[questionId]
          return { editorState: newState }
        })
      },
    }),
    {
      name: 'editor-storage',  // sessionStorage key
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default useEditorStore
