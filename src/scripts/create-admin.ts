// Crear nuevo usuario con contraseña sencilla
import fs from 'fs';
import path from 'path';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function createNewAdmin() {
  // Ruta al archivo de usuarios
  const USERS_FILE = path.join(process.cwd(), 'src/data/users.json');
  
  // Clave sencilla
  const password = '123456';
  
  // Generar hash
  const passwordHash = await hash(password, 10);
  
  // Crear usuario admin
  const adminUser = {
    id: uuidv4(),
    email: 'admin123@ejemplo.com',
    passwordHash,
    name: 'Admin Test',
    role: 'admin',
    createdAt: new Date().toISOString()
  };
  
  // Leer usuarios existentes
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    const fileContent = fs.readFileSync(USERS_FILE, 'utf8');
    users = JSON.parse(fileContent);
  }
  
  // Añadir nuevo usuario
  users.push(adminUser);
  
  // Guardar usuarios actualizados
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  
  console.log('Nuevo usuario admin creado:');
  console.log('Email:', adminUser.email);
  console.log('Contraseña:', password);
  console.log('Hash generado:', passwordHash);
}

createNewAdmin().catch(console.error);