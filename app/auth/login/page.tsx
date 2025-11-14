import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

export default async function LoginPage() {
  const supabase = createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If already logged in, redirect to board
  if (user) {
    redirect('/board')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            TSR Tracking Application
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the application
          </p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  )
}
