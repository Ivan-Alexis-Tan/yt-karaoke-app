type AppEnvironmentType = "DEVELOPMENT" | "PRODUCTION"

export const APP_ENVIRONMENT = process.env.APP_ENVIRONMENT as AppEnvironmentType

export const BASE_URL = (
    APP_ENVIRONMENT === "DEVELOPMENT"
        ? process.env.LOCAL_BACKEND_URL
        : process.env.PRODUCTION_BACKEND_URL
)