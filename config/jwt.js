import jwt from 'jsonwebtoken';
export const JWT_SECRET = process.env.JWT_SECRET || 'mykart_secret_key';
export { jwt };