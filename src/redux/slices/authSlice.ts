// External
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

// Internal
import type { RootState } from '@/redux'
import type { UserDTO } from '@/types'

type DeleteConfirm = {
    singular: string
    resource: string
    itemId: number
    confirm: boolean | undefined,
    redirect: string | undefined
}

export interface AuthState {
    isLoggedIn: boolean | undefined,
    authUser: UserDTO | undefined,
    snackMessage: string | undefined,
    deleteConfirm: DeleteConfirm | undefined,
    isDeletingItem: boolean | string,
    accessToken: string,
    refreshToken: string,
    loginResponse: Object,
    axiosGet: string,
}

const initialState = {
    isLoggedIn: undefined,
    e2ePublicKey: undefined,
    e2ePrivateKey: undefined,
    adminLoggedIn: '',
    authUser: undefined,
    snackMessage: undefined,
    deleteConfirm: undefined,
    isDeletingItem: false,
    accessToken: '',
    refreshToken: '',
    loginResponse: {},
    axiosGet: '',
} as AuthState

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn: (state: AuthState, action: PayloadAction<any>) => {
            state.isLoggedIn = action.payload.data
        },
        setAuthUser: (state: AuthState, action: PayloadAction<any>) => {
            state.authUser = action.payload.data
        },
        setSnackMessage: (state: AuthState, action: PayloadAction<any>) => {
            state.snackMessage = action.payload
        },
        setDeleteConfirm: (state: AuthState, action: PayloadAction<DeleteConfirm | undefined>) => {
            state.deleteConfirm = action.payload
        },
        setIsDeletingItem: (state: AuthState, action: PayloadAction<boolean | string>) => {
            state.isDeletingItem = action.payload
        },
        setAccessToken: (state: AuthState, action: PayloadAction<any>) => {
            state.accessToken = action.payload.data
        },
        setRefreshToken: (state: AuthState, action: PayloadAction<any>) => {
            state.refreshToken = action.payload.data
        },
        setLoginResponse: (state: AuthState, action: PayloadAction<any>) => {
            state.loginResponse = action.payload.data
        },
        setAxiosGet: (state: AuthState, action: PayloadAction<any>) => {
            state.axiosGet = action.payload.data
        },
    }
})

const { actions } = authSlice
export const {
    setIsLoggedIn,
    setAuthUser,
    setSnackMessage,
    setDeleteConfirm,
    setIsDeletingItem,
    setAccessToken,
    setRefreshToken,
    setLoginResponse,
    setAxiosGet
} = actions

export default authSlice.reducer

export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const selectAuthUser = (state: RootState) => state.auth.authUser
export const selectSnackMessage = (state: RootState) => state.auth.snackMessage
export const selectDeleteConfirm = (state: RootState) => state.auth.deleteConfirm
export const selectIsDeletingItem = (state: RootState) => state.auth.isDeletingItem
export const selectAccessToken = (state: RootState) => state.auth.accessToken
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken
export const selectLoginResponse = (state: RootState) => state.auth.loginResponse
export const selectAxiosGet = (state: RootState) => state.auth.axiosGet
