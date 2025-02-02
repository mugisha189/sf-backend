export const jwtConstants = {
    secret: process.env.JWT_SECRET
}

export const OTP_CODE_STATUS = {
    AVAILABLE: "AVAILABLE",
    USED: "USED",
} as const

export enum CHARGE_TYPE {
    PERCENTAGE= "PERCENTAGE",
    FIXED ="FIXED",
} 

export enum COMPANY_TYPE  {
    TELECOM= "TELECOM",
    PETROL_STATIONS= "PETROL_STATIONS",
    SUPER_MARKET= "SUPER_MARKET"
}

