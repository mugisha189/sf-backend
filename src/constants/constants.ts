export const jwtConstants = {
    secret: process.env.JWT_SECRET
}

export const OTP_CODE_STATUS = {
    AVAILABLE: "AVAILABLE",
    USED: "USED",
} as const