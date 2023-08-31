
import {createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {setCredentials} from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl : 'http://localhost:3500',
    credentials : 'include',
    prepareHeaders : (headers, {getState}) => {
        const token = getState().auth.token

        if(token){
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers;
    }
})

const baseQueryWithReauth = async (args , api , extraOptions)=>{
    console.log("args :" +args);        // req url , method , body
    console.log("api :" +api);              // signal , dispatch , getState()
    console.log("extraOpt :" +extraOptions); // custom like {shout:true} usually undefined since its our input area

    let result = await baseQuery(args,api,extraOptions);


    // to handle 403 forbidden // token expire
    if(result?.error?.status === 403){
        console.log("Sending Refresh Token");
        
        // get new access token by sending refreshToken
        const refreshResult = await baseQuery("/auth/refresh",api,extraOptions); // since only "GET" we replace args

        if(refreshResult?.data){
            
            // store the new token
            api.dispatch(setCredentials({...refreshResult?.data}))

            //retry original with new token
            result = await baseQuery(args,api,extraOptions);

        }else{

            if(refreshResult?.error?.status === 403){
                refreshResult.error.data.message = "Your Login Expired.";
            }
            
            return refreshResult // return the error
        }
    }
    return result // any success or retried success result

}

export const apiSlice = createApi({
    reducerPath : 'api', // default
    baseQuery : baseQueryWithReauth,
    tagTypes:['Note','User'],
    endpoints : (builder)=> ({})
});