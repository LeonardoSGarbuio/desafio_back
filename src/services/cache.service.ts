import { redis } from '../config/redis';

const DEFAULT_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS) || 300; // 5 minutos

function isRedisReady(): boolean {
  return redis.status === 'ready';
}

// Busca um valor do cache (retorna null se não existir ou se o Redis estiver offline)
export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisReady()) return null;

  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
}

// Salva um valor no cache com tempo de expiração (TTL)
export async function setCache(
  key: string,
  data: unknown,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> {
  if (!isRedisReady()) return;

  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch {
    // Falha silenciosa para nunca interromper a requisição principal
  }
}

// Invalida o cache de cursos, módulos e aulas após qualquer alteração (POST/PUT/PATCH/DELETE)
export async function invalidateCache(patterns: string[] = ['courses:*', 'modules:*', 'lessons:*']): Promise<void> {
  if (!isRedisReady()) return;

  try {
    for (const pattern of patterns) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
  } catch {
    // Falha silenciosa
  }
}