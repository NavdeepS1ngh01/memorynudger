'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import NoteList, { Note } from '../../components/NoteList'
import NoteEditor from '../../components/NoteEditor'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [showEditor, setShowEditor] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | undefined>()

  useEffect(() => {
    const getUser = async () => {
      const res = await supabase.auth.getSession()
      const session: Session | null = res.data.session
      if (!session?.user) {
        router.push('/auth')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center border-b border-gray-200 pb-4 mb-8">
        <div className="text-2xl font-bold text-[#3ECF8E]">MemoryNudger</div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">
            Welcome,&nbsp;
            <span className="font-semibold">{user?.email}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-[#3ECF8E] text-white px-4 py-1 rounded hover:bg-green-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Notes Dashboard</h2>
          <button
            onClick={() => {
              setSelectedNote(undefined) // new note mode
              setShowEditor(true)
            }}
            className="bg-[#3ECF8E] text-white px-4 py-2 rounded hover:bg-green-600 transition font-medium"
          >
            New
          </button>
        </div>

        {user ? (
          <NoteList
            userId={user.id}
            onEdit={(note) => {
              setSelectedNote(note) // edit mode
              setShowEditor(true)
            }}
          />
        ) : (
          <h4>No Notes</h4>
        )}
      </section>

      {/* Editor Modal */}
      {showEditor && (
        <NoteEditor
          userId={user?.id || ''}
          existingNote={selectedNote}
          onClose={() => setShowEditor(false)}
          onSaved={() => {
            setShowEditor(false)
          }}
        />
      )}
    </main>
  )
}
