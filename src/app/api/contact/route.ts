import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  return NextResponse.json({ 
    message: 'Contact API route is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  console.log('Contact API route called');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { name, email, phone, subject, category, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !category || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Attempting to insert into contact_messages table...');

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name,
        email,
        phone: phone || null,
        subject,
        category,
        message,
        status: 'unread'
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Successfully inserted contact message:', data);

    return NextResponse.json({ 
      success: true, 
      data: data[0] 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}