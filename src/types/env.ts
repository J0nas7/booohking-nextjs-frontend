const prod = {
    app_name: "Booohking",
    url: {
        APP_URL: "http://localhost:3000",
        API_URL: "http://localhost:8080",
        BACKEND_URL: "http://backend:8080",
    },
    mobilepay: {
        MP_CLIENT_ID: "",
        MP_CLIENT_SECRET: "",
        MP_KEY: "",
        MP_SESSION_API: "",
        MP_MSN: "",
    }
}

const dev = {
    app_name: "Booohking",
    url: {
        APP_URL: "http://localhost:3000",
        API_URL: "http://localhost:8080",
        BACKEND_URL: "http://backend:8080",
    },
    mobilepay: {
        MP_CLIENT_ID: "",
        MP_CLIENT_SECRET: "",
        MP_KEY: "",
        MP_SESSION_API: "",
        MP_MSN: "",
    }
}
export const env = process.env.NODE_ENV === 'development' ? dev : prod

export const paths = {
    API_ROUTE: "/api/"
}
