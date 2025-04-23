import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const IMAGES_DIR = path.join(process.cwd(), 'public/images/blog');

// POST /api/blog/images - Subir una imagen
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se ha proporcionado ningún archivo' },
        { status: 400 }
      );
    }
    
    // Procesar el archivo
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(IMAGES_DIR, fileName);
    
    // Escribir el archivo en el sistema de archivos
    await writeFile(filePath, buffer);
    
    // Crear una URL relativa para el archivo
    const imageUrl = `/images/blog/${fileName}`;
    
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/images?imageUrl=XXX - Eliminar una imagen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('imageUrl');
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'El parámetro imageUrl es requerido' },
        { status: 400 }
      );
    }
    
    // Extraer el nombre del archivo de la URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) {
      return NextResponse.json(
        { error: 'URL de imagen inválida' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(IMAGES_DIR, fileName);
    
    // Eliminar el archivo del sistema de archivos
    await unlink(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la imagen' },
      { status: 500 }
    );
  }
}