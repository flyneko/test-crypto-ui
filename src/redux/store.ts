import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'

import authReducer from './slices/auth'
import optionsReducer from './slices/options'

export default configureStore({
    reducer: {
        auth: authReducer,
        games: optionsReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false
    }),
})