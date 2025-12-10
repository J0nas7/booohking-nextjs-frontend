"use client"

import { deleteCookie, getCookie, setCookie } from "cookies-next"

export const getClientCookie = (name: string) => getCookie(name)
export const setClientCookie = (name: string, value: string) =>
    setCookie(name, value, { path: "/", httpOnly: false, secure: true })
export const deleteClientCookie = (name: string) => deleteCookie(name)
