// External
import type { TypedUseSelectorHook } from "react-redux"
import { useDispatch, useSelector } from "react-redux"

// Internal
import type { AppDispatch, RootState } from "./store"

export const useAppDispatch: () => AppDispatch = useDispatch
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
