import path from 'path';
import crypto from 'crypto';
import { supabase, SUPABASE_BUCKET } from '../config/supabase';

function getExtension(originalName: string, mimeType: string): string {
  const ext = path.extname(originalName).toLowerCase();
  if (ext) return ext;

  const mimeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return mimeMap[mimeType] || '.jpg';
}

export async function uploadCourseThumbnail(
  file: Express.Multer.File
): Promise<string> {
  if (!supabase) {
    throw new Error(
      'Upload de arquivos indisponível: configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env ou envie uma URL em texto no campo thumbnail.'
    );
  }

  const ext = getExtension(file.originalname, file.mimetype);
  const fileName = `${Date.now()}-${crypto.randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Falha ao enviar imagem para o Supabase: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}