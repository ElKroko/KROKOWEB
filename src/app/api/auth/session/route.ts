import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getUserById } from '@/lib/auth-service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-in-production';

// POST /api/auth/session - Verificar token JWT enviado desde el cliente
export async function POST(request: NextRequest) {
  try {
    // Obtener el token del body
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    try {
      // Verificar y decodificar el token
      const decoded = verify(token, JWT_SECRET) as { id: string };
      
      // Obtener el usuario desde la base de datos
      const user = getUserById(decoded.id);
      
      if (!user) {
        return NextResponse.json(
          { authenticated: false },
          { status: 401 }
        );
      }
      
      return NextResponse.json({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      // Error al verificar el token (expirado, inválido, etc.)
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    return NextResponse.json(
      { error: 'Error al verificar la sesión' },
      { status: 500 }
    );
  }
}

// Función auxiliar para parsear las cookies del header
function parseCookies(cookieHeader: string) {
  const cookies: { [key: string]: string } = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name) cookies[name] = value || '';
  });
  return cookies;
}