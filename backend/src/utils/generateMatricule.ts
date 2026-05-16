/**
 * Génère un matricule unique pour un membre
 * Format: AJL-YYYYMMDD-XXXXX
 * où XXXXX est un nombre aléatoire
 */
export const generateMatricule = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

  return `AJL-${year}${month}${day}-${random}`;
};

/**
 * Génère un numéro de reçu unique
 * Format: RCP-YYYYMMDD-XXXXX
 */
export const generateReceiptNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');

  return `RCP-${year}${month}${day}-${random}`;
};

/**
 * Génère un numéro de référence de transaction
 * Format: TRX-XXXXXXXX-XXXXXXXX
 */
export const generateTransactionRef = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TRX-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
