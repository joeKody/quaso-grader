import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const user = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const path = req.nextUrl.pathname

  if (
    !user &&
    (path.startsWith('/tasks') ||
      path.startsWith('/submissions') ||
      path.startsWith('/scoreboard') ||
      path.startsWith('/profile'))
  ) {
    return NextResponse.redirect(new URL('/login', req.url))
  } else if (
    user &&
    (path === '/' || path === '/login' || path === '/register')
  ) {
    return NextResponse.redirect(new URL('/tasks', req.url))
  }
  return NextResponse.next()
}
