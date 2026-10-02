import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Base routes that need protection
  const path = request.nextUrl.pathname;
  
  if (user) {
    // Fetch user role and status
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, onboarding_complete, account_status')
      .eq('id', user.id)
      .single()
      
    const role = profile?.role || 'student'
    const accountStatus = profile?.account_status || 'active'
    
    // Check if account is suspended
    if (accountStatus === 'suspended' && !path.startsWith('/suspended') && !path.startsWith('/login') && !path.startsWith('/logout')) {
      return NextResponse.redirect(new URL('/suspended', request.url));
    }
    
    // Redirect active users away from suspended page
    if (accountStatus === 'active' && path.startsWith('/suspended')) {
      if (role === 'administrator') return NextResponse.redirect(new URL('/admin', request.url));
      if (role === 'faculty') return NextResponse.redirect(new URL('/faculty', request.url));
      if (role === 'moderator') return NextResponse.redirect(new URL('/moderation', request.url));
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Do not enforce portal locks if on /suspended
    if (path.startsWith('/suspended')) {
      return supabaseResponse;
    }
    
    // Define portal URLs
    const adminUrl = new URL('/admin', request.url);
    const facultyUrl = new URL('/faculty', request.url);
    const moderatorUrl = new URL('/moderation', request.url);
    const studentUrl = new URL('/dashboard', request.url);
    const onboardingUrl = new URL('/onboarding', request.url);

    // 1. Prevent logged-in users from seeing login/register pages
    if (path.startsWith('/login') || path.startsWith('/register')) {
      if (role === 'administrator') return NextResponse.redirect(adminUrl);
      if (role === 'faculty') return NextResponse.redirect(facultyUrl);
      if (role === 'moderator') return NextResponse.redirect(moderatorUrl);
      return NextResponse.redirect(studentUrl);
    }

    // 2. Strict Portal Enforcement
    // Student trying to access Staff portals
    if (role === 'student' && (path.startsWith('/admin') || path.startsWith('/faculty') || path.startsWith('/moderation'))) {
      return NextResponse.redirect(studentUrl);
    }

    // Faculty trying to access Admin, Moderation or Student portals
    if (role === 'faculty' && (path.startsWith('/admin') || path.startsWith('/moderation') || path.startsWith('/dashboard') || path.startsWith('/my-semester') || path.startsWith('/my-submissions'))) {
      return NextResponse.redirect(facultyUrl);
    }

    // Moderator trying to access Admin, Faculty or Student portals
    if (role === 'moderator' && (path.startsWith('/admin') || path.startsWith('/faculty') || path.startsWith('/dashboard') || path.startsWith('/my-semester') || path.startsWith('/my-submissions'))) {
      return NextResponse.redirect(moderatorUrl);
    }

    // Admin trying to access Faculty, Moderation (optional?), or Student portals
    // Note: Admins usually have access to moderation, but we'll block student and faculty portals.
    if (role === 'administrator' && (path.startsWith('/faculty') || path.startsWith('/dashboard') || path.startsWith('/my-semester') || path.startsWith('/my-submissions'))) {
      return NextResponse.redirect(adminUrl);
    }
  } else {
    // Not logged in: Protect private routes
    const privateRoutes = ['/dashboard', '/admin', '/faculty', '/moderation', '/my-semester', '/my-submissions', '/profile', '/upload'];
    if (privateRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
