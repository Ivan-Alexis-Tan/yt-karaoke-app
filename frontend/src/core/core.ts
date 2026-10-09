type AppEnvironmentType = "DEVELOPMENT" | "PRODUCTION"
type RecordToHistoryType = "TRUE" | "FALSE"

export const APP_ENVIRONMENT = process.env.APP_ENVIRONMENT as AppEnvironmentType

export const BASE_URL = (
    APP_ENVIRONMENT === "DEVELOPMENT"
        ? process.env.LOCAL_BACKEND_URL
        : process.env.PRODUCTION_BACKEND_URL
)

export const RECORD_TO_HISTORY = process.env.RECORD_TO_HISTORY as RecordToHistoryType