import fs from 'fs';
import path from 'path';
import { compare, hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Ruta al archivo que almacenará los usuarios
const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');

// Asegurar que el archivo de usuarios exista
if (!fs.existsSync(USERS_FILE)) {
  // Si no existe, crear un archivo con un usuario administrador por defecto
  const defaultAdmin = {
    id: uuidv4(),
    email: 'admin@example.com',
    passwordHash: '$2b$10$8dWWM4YLdZRX.X0R5KR3eeVwZVeOxGQdo8MZ9q0LQG/vnkOAYjQCq', // 'admin123'
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date().toISOString()
  };
  
  fs.writeFileSync(USERS_FILE, JSON.stringify([defaultAdmin], null, 2), 'utf8');
}

// Interfaz para representar un usuario
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  passwordHash?: string; // No incluir en respuestas al cliente
}

// Interfaz para crear un nuevo usuario
export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

// Interfaz para iniciar sesión
export interface LoginData {
  email: string;
  password: string;
}

// Funciones auxiliares
const readUsers = (): User[] => {
  const fileContents = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(fileContents) as User[];
};

const writeUsers = (users: User[]): void => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

const getUserByEmail = (email: string): User | undefined => {
  const users = readUsers();
  return users.find(user => user.email === email);
};

// Crear un nuevo usuario
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const users = readUsers();
  
  // Verificar si el email ya está en uso
  if (users.some(user => user.email === userData.email)) {
    throw new Error('El email ya está en uso');
  }
  
  // Hashear la contraseña
  const passwordHash = await hash(userData.password, 10);
  
  // Crear el nuevo usuario
  const newUser: User = {
    id: uuidv4(),
    email: userData.email,
    passwordHash,
    name: userData.name,
    role: userData.role || 'user',
    createdAt: new Date().toISOString()
  };
  
  // Añadir a la lista de usuarios y guardar
  users.push(newUser);
  writeUsers(users);
  
  // Retornar sin el hash de la contraseña
  const { passwordHash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Verificar credenciales e iniciar sesión
export const loginUser = async (loginData: LoginData): Promise<User | null> => {
  console.log('loginUser llamado con email:', loginData.email);
  const user = getUserByEmail(loginData.email);
  
  if (!user || !user.passwordHash) {
    console.log('Usuario no encontrado o sin passwordHash');
    return null;
  }
  
  console.log('Usuario encontrado, verificando contraseña');
  // Verificar la contraseña
  try {
    const isPasswordValid = await compare(loginData.password, user.passwordHash);
    console.log('Resultado de verificación de contraseña:', isPasswordValid);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Retornar sin el hash de la contraseña
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return null;
  }
};

// Obtener un usuario por su ID
export const getUserById = (id: string): User | null => {
  const users = readUsers();
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return null;
  }
  
  // Retornar sin el hash de la contraseña
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};