'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface NoteListProps {
  userId: string
  onEdit: (note: Note) => void
}

export default function NoteList({ userId, onEdit }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at'>('created_at')
  const [loading, setLoading] = useState(true)

  const fetchNotes = async () => {
    setLoading(true)

    let query = supabase
      .from('notes')
      .select('id, user_id, title, content, created_at, updated_at')
      .eq('user_id', userId)
      .order(sortBy, { ascending: false })

    if (search.trim()) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data, error } = await query
    setNotes(!error && data ? (data as Note[]) : [])
    setLoading(false)
  }

  useEffect(() => {
    fetchNotes()
  }, [userId, sortBy, search])

  const getPreview = (text: string) =>
    text.length > 50 ? text.slice(0, 50) + '…' : text

  if (loading) return <p className="text-gray-500 text-center py-10">Loading notes…</p>
  if (notes.length === 0) return <p className="text-gray-500 text-center py-12">No notes found.</p>

  return (
    <div className="w-full">
      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        />
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'created_at' | 'updated_at')
            }
            className="border rounded px-2 py-1"
          >
            <option value="created_at">Created</option>
            <option value="updated_at">Updated</option>
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onEdit(note)}
            className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md cursor-pointer transition"
          >
            <h3 className="text-lg font-semibold mb-1">{note.title}</h3>
            <div className="text-xs text-gray-400 mb-2">
              {sortBy === 'created_at'
                ? `Created: ${new Date(note.created_at).toLocaleString()}`
                : `Updated: ${new Date(note.updated_at).toLocaleString()}`}
            </div>
            <p className="text-gray-700">{getPreview(note.content)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
