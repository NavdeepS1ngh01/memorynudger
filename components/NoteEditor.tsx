'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface NoteEditorProps {
  userId: string
  onClose: () => void
  onSaved: () => void
  existingNote?: {
    id: string
    title: string
    content: string
  }
}

export default function NoteEditor({ userId, onClose, onSaved, existingNote }: NoteEditorProps) {
  const [title, setTitle] = useState(existingNote?.title || '')
  const [content, setContent] = useState(existingNote?.content || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter a title and some content')
      return
    }
    setSaving(true)

    if (existingNote) {
      // Update existing
      const { error } = await supabase
        .from('notes')
        .update({
          title: title.trim(),
          content: content.trim()
        })
        .eq('id', existingNote.id)
        .eq('user_id', userId)
      if (error) alert(error.message)
    } else {
      // Insert new
      const { error } = await supabase
        .from('notes')
        .insert([
          { user_id: userId, title: title.trim(), content: content.trim(), media: null }
        ])
      if (error) alert(error.message)
    }

    setSaving(false)
    onSaved()
  }

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (confirm('Discard changes?')) onClose()
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {existingNote ? 'Edit Note' : 'New Note'}
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-xl font-medium border-b border-gray-300 focus:border-[#3ECF8E] outline-none pb-2"
            autoFocus
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your note here..."
            className="w-full h-64 p-3 border border-gray-200 rounded-lg resize-none focus:border-[#3ECF8E] focus:ring focus:ring-[#3ECF8E]/30 outline-none"
          />
          
          {/* Media placeholder */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
            📷 📹 Media upload coming soon...
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 border-t px-6 py-4 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={handleSave}
            className="px-6 py-2 bg-[#3ECF8E] text-white rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
