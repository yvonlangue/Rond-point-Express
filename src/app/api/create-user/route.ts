import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clerk_id, name, email, role = 'organizer' } = body

    if (!clerk_id || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create user using regular client
    const { data, error } = await supabase
      .from('users')
      .insert([{
        clerk_id,
        name,
        email,
        role,
        is_premium: false,
        event_count: 0,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ user: data })
  } catch (error) {
    console.error('Error in create-user API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
