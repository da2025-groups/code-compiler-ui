import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Editor Store - Persist code editor state per question
 * Uses sessionStorage (cleared on tab close, not on page refresh)
 */
const useEditorStore = create(
  persist(
    (set, get) => ({
      // State: { [questionId]: { language, code } }
      editorState: {},

      /**
       * Set editor state for a specific question
       * @param {string|number} questionId - Question ID
       * @param {object} state - { language, code }
       */
      setEditorState: (questionId, state) =>
        set((currentState) => ({
          editorState: {
            ...currentState.editorState,
            [questionId]: state,
          },
        })),

      /**
       * Get editor state for a specific question
       * @param {string|number} questionId - Question ID
       * @returns {object} { language, code } or default
       */
      getEditorState: (questionId) => {
        const state = get().editorState[questionId]
        return state || { language: 'python', code: '' }
      },

      /**
       * Clear editor state for a specific question
       * @param {string|number} questionId - Question ID
       */
      clearEditorState: (questionId) =>
        set((currentState) => {
          const newState = { ...currentState.editorState }
          delete newState[questionId]
          return { editorState: newState }
        }),
    }),
    {
      name: 'editor-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default useEditorStore
