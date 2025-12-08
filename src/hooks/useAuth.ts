"use client"

// External
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import type { Dispatch } from 'redux'

// Internal
import { useAxios, useCookies } from '@/hooks'
import {
    type AppDispatch,
    selectAuthUser,
    setAccessToken,
    setAuthUser,
    setIsLoggedIn,
    setSnackMessage,
    useTypedSelector
} from '@/redux'
import type { apiResponseDTO } from '@/types'

export const useAuth = () => {
    // ---- State ----
    const authUser = useTypedSelector(selectAuthUser)

    // ---- Hooks ----
    const router = useRouter()
    const searchParams = useSearchParams()
    const dispatch = useDispatch<AppDispatch>()
    const { getTheCookie, deleteTheCookie, setTheCookie } = useCookies()
    const { httpGetRequest, httpPostWithData } = useAxios()

    // ---- Methods ----
    const handleRegister = async (formData: any): Promise<boolean> => {
        // Send data to the API for token generation
        try {
            const data = await httpPostWithData("auth/register", formData)

            if (data.success !== true) {
                const errors = data.response?.data?.errors

                if (errors && typeof errors === "object") {
                    const messages = Object.values(errors).flat()
                    const message = messages.join(" ")
                    throw new Error(message)
                }

                throw new Error(data.message || "Registration failed")
            }

            dispatch(setSnackMessage("Your account was created. Activation e-mail is sent."))

            const emailStatus: string = data?.email_status
            const token: string = data?.token
            if (emailStatus.includes("Failed to send email:")) {
                router.push(`/activate-account?token=${token}`)
            } else {
                router.push("/activate-account")
            }
            return true
        } catch (err) {
            console.log("useAuth register error:", err)

            if (err instanceof Error) {
                dispatch(setSnackMessage(err.message))
                throw err
            }

            // fallback (should almost never hit)
            const fallback = "Register-request failed. Try again."
            dispatch(setSnackMessage(fallback))
            throw new Error(fallback)
        }
    }

    const handleActivateAccount = async (token: string): Promise<boolean> => {
        // Send data to the API for token generation
        try {
            const data = await httpPostWithData("auth/activate-account", { token })

            if (data.success !== true) {
                const errors = data.response?.data?.errors

                if (errors && typeof errors === "object") {
                    const messages = Object.values(errors).flat()
                    const message = messages.join(" ")
                    throw new Error(message)
                }

                throw new Error(
                    data.response?.data?.message || data.message || "Activation failed"
                )
            }

            dispatch(setSnackMessage("Your account was activated. You can now sign in."))
            router.push("/sign-in")
            return true
        } catch (err) {
            console.log("useAuth activate account error:", err)

            if (err instanceof Error) {
                dispatch(setSnackMessage(err.message))
                throw err
            }

            // fallback (should almost never hit)
            const fallback = "Activation-request failed. Try again."
            dispatch(setSnackMessage(fallback))
            throw new Error(fallback)
        }
    }

    const handleForgotRequest = async (emailInput: string): Promise<boolean> => {
        const forgotVariables = { User_Email: emailInput };

        try {
            const data = await httpPostWithData("auth/forgot-password", forgotVariables);

            if (data.success !== true) {
                const errors = data.response?.data?.errors;

                if (errors && typeof errors === "object") {
                    const messages = Object.values(errors).flat()
                    const message = messages.join(" ")
                    throw new Error(message)
                }

                throw new Error(data.message || "Registration failed")
            }

            dispatch(setSnackMessage("Reset-mail is sent to you."));

            // Success
            const emailStatus: string = data?.email_status
            const token: string = data?.token
            if (emailStatus.includes("Failed to send email:")) {
                router.push(`/forgot-password/reset?token=${token}`);
            } else {
                router.push("/forgot-password/reset");
            }

            return true;
        } catch (err) {
            console.log("useAuth forgot request error:", err)

            if (err instanceof Error) {
                dispatch(setSnackMessage(err.message))
                throw err
            }

            // fallback (should almost never hit)
            const fallback = "Forgot-request failed. Try again."
            dispatch(setSnackMessage(fallback))
            throw new Error(fallback)
        }
    };

    const handleResetPassword = async (
        token: string,
        password: string,
        passwordConfirm: string
    ): Promise<boolean> => {
        const resetVariables = {
            User_Remember_Token: token,
            New_User_Password: password,
            New_User_Password_confirmation: passwordConfirm
        };

        try {
            const data = await httpPostWithData("auth/reset-password", resetVariables);

            if (data.success !== true) {
                const errors = data.response?.data?.errors;

                if (errors && typeof errors === "object") {
                    const messages = Object.values(errors).flat();
                    const message = messages.join(" ");
                    throw new Error(message);
                }

                throw new Error(data.message || "Password reset failed");
            }

            // Success
            dispatch(setSnackMessage("Your password was reset."));
            router.push("/sign-in");
            return true;

        } catch (err) {
            console.log("useAuth reset request error:", err);

            if (err instanceof Error) {
                dispatch(setSnackMessage(err.message));
                throw err;
            }

            // fallback safety
            const fallback = "Reset-request failed. Try again.";
            dispatch(setSnackMessage(fallback));
            throw new Error(fallback);
        }
    };

    const handleLogoutSubmit = async () => {
        await httpPostWithData("auth/logout", {})
        deleteTheCookie("accessToken")
        window.location.href = "/sign-in"; // Forces a full page reload
    }

    // Fetches the user's logged-in status from the server and updates the Redux store accordingly.
    const fetchIsLoggedInStatus = () => async (dispatch: Dispatch) => {
        try {
            const data = await httpGetRequest("auth/me")
            // console.log("fetchIsLoggedInStatus", data)
            if (
                data &&
                data.userData &&
                data.message === "Is logged in"
            ) {
                // Update the Redux store with the user's logged-in status and details
                // dispatch(setRefreshToken({ "data": jwtData.refreshToken }))
                dispatch(setIsLoggedIn({ "data": true }))
                dispatch(setAuthUser({ "data": data.userData }))
            } else {
                deleteTheCookie("accessToken")
                // Optionally handle the "not logged in" scenario
                dispatch(setIsLoggedIn({ "data": false }))
            }
        } catch (e) {
            console.log("fetchIsLoggedInStatus", e)
        }
    }

    const handleLoginSubmit = async (
        emailInput: string,
        passwordInput: string
    ): Promise<boolean> => {
        // Check for missing input
        if (!emailInput || !passwordInput) {
            throw new Error("Missing necessary credentials")
        }

        const loginVariables = {
            User_Email: emailInput,
            password: passwordInput,
        }

        // Send loginVariables to the API for authentication
        try {
            const data = await httpPostWithData("auth/login", loginVariables)
            const success = processLoginResult("login", data)

            if (!success) {
                const error = data?.response?.data?.error
                // Use data.error first, fallback to data.message
                throw new Error(error || "Login failed. Try again.")
            }

            return true // success
        } catch (err) {
            console.log("useAuth login error:", err)

            // Wrap any caught error in an Error object for useMutation
            if (err instanceof Error) throw err
            throw new Error("Login failed. Try again.")
        }
    }

    const processLoginResult = (fromAction: string, theResult: apiResponseDTO) => {
        if (fromAction !== "login") return false

        if (theResult.success === true) {
            console.log("User logged in:", theResult.data)
            return saveLoginSuccess(theResult.data)
        }

        console.log("Login failed", theResult)
        return false
    }

    const saveLoginSuccess = (loginData: any) => {
        if (typeof window !== "undefined") {
            const newAccessToken = loginData.accessToken
            const newAuthUser = loginData.user

            setTheCookie("accessToken", newAccessToken)

            dispatch(setAccessToken({ "data": newAccessToken }))
            // dispatch(setRefreshToken({ "data": jwtData.refreshToken }))
            dispatch(setIsLoggedIn({ "data": true }))
            dispatch(setAuthUser({ "data": newAuthUser }))

            let ref = searchParams.get("ref")
            router.push(ref ?? "/")
        }

        return true
    }

    const iADMIN = (): boolean => {
        if (authUser && authUser.User_Role === "ROLE_ADMIN") return true

        return false
    }

    // ---- Effects ----
    useEffect(() => {
        if (typeof window !== "undefined" && getTheCookie("accessToken")) {
            const accessToken = getTheCookie("accessToken")

            dispatch(setAccessToken({ "data": accessToken }))
            dispatch(setIsLoggedIn({ "data": true }))
            dispatch(fetchIsLoggedInStatus())
        } else {
            dispatch(setAccessToken({ "data": "" }))
            dispatch(setIsLoggedIn({ "data": false }))
        }
    }, [])

    return {
        handleRegister,
        handleActivateAccount,
        handleForgotRequest,
        handleResetPassword,
        handleLogoutSubmit,
        handleLoginSubmit,
        iADMIN
    }
}
