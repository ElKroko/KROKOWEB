import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth-service';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-change-in-production';

// POST /api/auth/login - Iniciar sesión
export async function POST(request: NextRequest) {
  try {
    console.log('Login API llamada');
    const loginData = await request.json();
    console.log('Datos recibidos:', { email: loginData.email, passwordLength: loginData.password?.length });
    
    if (!loginData.email || !loginData.password) {
      console.log('Email o contraseña faltantes');
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }
    
    const user = await loginUser(loginData);
    console.log('Resultado de loginUser:', user ? 'Usuario encontrado' : 'Usuario no encontrado');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }
    
    // Crear token JWT
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('Token JWT generado correctamente');
    
    // Devolver el token en la respuesta (lo almacenaremos en localStorage en el cliente)
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error detallado de inicio de sesión:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}