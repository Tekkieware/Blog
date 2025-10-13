
import { NextResponse } from 'next/server'
import { setCookie } from 'cookies-next'

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password === process.env.ADMIN_PASSWORD) {
    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
    setCookie('auth-token', 'authenticated', {
      req: request as any,
      res: response as any,
      maxAge: 86400, // 24 hours in seconds
      path: '/',
    })
    return response
  } else {
    return new NextResponse(JSON.stringify({ success: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
