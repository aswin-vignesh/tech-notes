import { apiSlice } from "../../app/api/apiSlice";
import { logout, setCredentials } from "./authSlice"; // logiut is called action creator since it is exported from authSlice.actions


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        login: builder.mutation({
            query: credentials => ({
                url : '/auth',
                method: 'POST',
                body: {...credentials} // username and password
            })
        }),

        sendLogout : builder.mutation({
            query: ()=>({
                url : '/auth/logout',
                method : 'POST'
            }),
            async onQueryStarted(arg , {dispatch , queryFulfilled}){
                try{
                    const {data} = await queryFulfilled // provides data -> says cookie cleared  
                    console.log(data);
                    // await queryFulfilled
                    dispatch(logout()) // set token to null on local state 
                    // the apiSlice is also need to be cleared so its reseted to initial state so users and notes data is cleared
                    // dispatch(apiSlice.util.resetApiState())  

                    // since the usersList kept fetching after expiry (not for us tho)
                    setTimeout(()=>{
                        dispatch(apiSlice.util.resetApiState()) 
                    },1000) 
                    
                }catch(err){
                    console.log(err);
                }
            }
        }),

        refresh : builder.mutation({ // in mutation way
            query : ()=> ({
                url : '/auth/refresh',
                method:'GET',
            }),
            async onQueryStarted(arg , {dispatch , queryFulfilled}){
                try {
                    const {data} = await queryFulfilled;
                    const {accessToken} = data;
                    console.log(data);

                    dispatch(setCredentials({accessToken}))

                } catch (err) {
                    console.log(err);
                }
            }
        })
        // refresh : builder.query({
        //     query : ()=> '/auth/refresh'
        // })
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation
    // useRefreshQuery
} = authApiSlice
