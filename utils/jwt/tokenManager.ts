import { User } from '@/backend/domain/entities/User';
import jwt, { Secret } from 'jsonwebtoken';

const ACCESS_SECRET: Secret = process.env.JWT_SECRET_KEY || '';
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET_KEY || '';

interface AccessTokenPayload {
    userInfo : Omit<User, 'password'>;
}

interface RefreshTokenPayload {
    id: number;
}

// access Token 발급
export function generateAccessToken( payload: AccessTokenPayload) {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: '1h', // 유효 기간
    });
}

// refresh Token 발급
export function generateRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: '7d', // 유효 기간
    });
}

// access Token 검증
export function verifyAccessToken(token: string) {
    try {
        const decoded = jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
        return {
            ok: true,
            payload: decoded,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
        };
    }
}
