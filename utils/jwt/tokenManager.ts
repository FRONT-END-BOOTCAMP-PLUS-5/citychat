import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET_KEY || '';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY || '';

interface AccessTokenPayload {
    id: number; 
    nickname: string;
}

// access Token 발급
export function generateAccessToken(userInfo: AccessTokenPayload) {
    return jwt.sign(userInfo, ACCESS_SECRET, {
        expiresIn: '1h', // 유효 기간
    });
}

// refresh Token 발급
export function generateRefreshToken(id: number) {
    return jwt.sign({ id }, REFRESH_SECRET, {
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
