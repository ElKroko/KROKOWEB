import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - Cerrar sesión
export async function POST(request: NextRequest) {
  try {
    // Crear respuesta y eliminar la cookie
    const response = NextResponse.json({ success: true });
    
    // Eliminar la cookie estableciendo su valor a vacío y una fecha de expiración en el pasado
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      expires: new Date(0), // Fecha en el pasado
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}