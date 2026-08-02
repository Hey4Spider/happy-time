export {}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MODE?: string
            NODE_ENV?: string

            LEVEL: string
            INTERNAL_SECRET?: string

            DB_HOST: string
            DB_PORT: string
            DB_USER: string
            DB_PASSWORD: string
            DB_DATABASE: string
            DB_SCHEMA?: string
        }
    }

    interface ImportMetaEnv {
        VITE_SERVER_URL: string
        VITE_DEFAULT_HOME?: string
        VITE_PASSWORD?: string
    }
}
