// filepath: f:\Codes\KROKOWEB\web\src\pages\api\fonts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Data = {
  fonts?: string[];
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const fontDir = path.join(process.cwd(), 'public', 'fonts');
    // Lee el directorio de forma síncrona (las API routes son server-side)
    const fontFiles = fs.readdirSync(fontDir)
                       .filter(file => file.endsWith('.flf'));
    
    res.status(200).json({ fonts: fontFiles });
  } catch (error) {
    console.error('Error reading font directory in API:', error);
    res.status(500).json({ error: 'Failed to retrieve font list' });
  }
}