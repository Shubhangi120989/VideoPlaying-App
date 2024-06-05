import { configureStore,combineReducers} from "@reduxjs/toolkit";
import userReducer from './userSlice'
import videoReducer from './videoSlice'
// import {
//     persistStore,
//     persistReducer,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER,
//   } from 'redux-persist'
//   import storage from 'redux-persist/lib/storage'
// import { PersistGate } from 'redux-persist/integration/react'
//combining the reducers:
const rootReducer=combineReducers({user:userReducer,video:videoReducer})
// const persistConfig = {
//     key: 'root',
//     version: 1,
//     storage,
//   }
  
//   const persistedReducer = persistReducer(persistConfig, rootReducer)
//to keep the user loged in we will have to user redux-persist
export const store=configureStore({
    reducer:{
        user:userReducer,
        video:videoReducer
    }
})