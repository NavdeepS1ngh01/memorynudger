'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // User logged in - redirect to home
        router.push('/home')
      }
    })

    // Cleanup the listener on unmount
    return () => {
      (data as { subscription?: { unsubscribe: () => void } })?.subscription?.unsubscribe()
    }
  }, [router])

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
    </div>
  )
}
