import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes('your-project') || url.includes('your_supabase')) return false;
  if (key.includes('your_') || key.length < 20) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  // If Supabase not configured, allow all requests (localStorage mode)
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  // Check for demo session cookie/localStorage indicator
  // Demo users bypass Supabase auth checks
  const hasDemoSession = request.cookies.get('peraluna_demo_session');
  if (hasDemoSession) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes
    const protectedRoutes = ['/dashboard', '/trip'];
    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    // For protected routes without Supabase user, check localStorage on client
    // Just allow through - client-side auth guard will handle redirect
    if (isProtectedRoute && !user) {
      // Allow through - let client-side handle auth
      return NextResponse.next();
    }

    // Redirect logged-in users away from auth pages
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    if (isAuthRoute && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch {
    // If Supabase fails, allow through
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
