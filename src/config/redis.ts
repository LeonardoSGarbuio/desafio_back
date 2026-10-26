import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL?.trim() || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  retryStrategy(times) {
    // Tenta reconectar de forma espaçada se o Redis estiver desligado
    if (times > 3) {
      return null; // Para de tentar reconectar em loop e segue sem cache
    }
    return Math.min(times * 500, 2000);
  },
});

let warnedOffline = false;

redis.on('connect', () => {
  warnedOffline = false;
  console.log('Conectado ao Redis (Cache ativo)');
});

redis.on('error', () => {
  if (!warnedOffline) {
    warnedOffline = true;
    console.warn('Aviso: Redis indisponível. A API continuará funcionando normalmente sem cache.');
  }
});