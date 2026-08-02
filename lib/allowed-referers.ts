const ALLOWED_REFERERS = [
  "http://localhost:3000/",
  //
  "https://player.zxcstream.xyz/",
  "https://player.zxcprime.xyz/",

  //BACKUP
  "https://backup-zxcstream-xyz.up.railway.app/",
  "https://backup-zxcprime-xyz.up.railway.app/",
  "https://online-thin-prox-production.up.railway.app/",
];

export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  //
  "https://player.zxcstream.xyz",
  "https://player.zxcprime.xyz",

  //BACKUP
  "https://backup-zxcstream-xyz.up.railway.app",
  "https://backup-zxcprime-xyz.up.railway.app",
  "https://online-thin-prox-production.up.railway.app",
];
export function isValidReferer(referer: string): boolean {
  return ALLOWED_REFERERS.some((allowed) => referer.includes(allowed));
}
