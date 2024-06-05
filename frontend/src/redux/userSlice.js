import {createSlice} from "@reduxjs/toolkit"

const initialState={
    currentUser:null,
    loading:false,
    error:false,
}

export const userSlice=createSlice({
    name:'user',
    initialState:initialState,
    reducers:{
        loginStart:(state)=>{
            state.loading=true
        },
        loginSuccess:(state,action)=>{
            state.loading=true
            state.currentUser=action.payload
        },
        loginFailure:(state)=>{
            state.loading=false
            state.error=true
        },
        logout:(state)=>{
            state.loading=false;
            state.currentUser=null;
            state.error=false;
        },
        refreshUser:(state,action)=>{
            state.currentUser=action.payload
        }
        
        
    }
})

export const {loginFailure,loginStart,loginSuccess,logout,refreshUser}=userSlice.actions
export default userSlice.reducer