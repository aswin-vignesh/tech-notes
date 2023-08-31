import { createSelector , createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({}) 
    // to Normalize Data automatically  // it has ids and Entities // ids is iterable , we will use ids to get data from entities



const initialState = usersAdapter.getInitialState(); // if initial state exists
console.log("userAdapter : "+usersAdapter);
console.log("initialState : "+initialState);

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      // fetching here
      query: () => ({
        url: "/users",
        validateStatus: (response, result) => {
          // checking the fetch
          console.log("response : " + response + "   result " + result);
          return response.status === 200 && !result.isError;
        },
      }),

      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },

      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
      // so  tags should be inside array always  ,
      // we give tag cache for whole list and also individual item too so we can invalidate cache based on the necessity
      // so that they can be fetched seperately
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: {
          // the data we provide
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }], // updating entire user Cache
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }], // invalidating only the correct user cache (1 item only)
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "/users",
        method: "DELETE",
        body: { id }, // this is how server is setup to just get id for delete operation
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
  }),
});


export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation
} = usersApiSlice

// selectors

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector // no export
 const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data  // only returns Normalized state object with ids and entities  leaving other errors and status flags
)

// These selectors are used to efficiently retrieve specific slices of data from the Redux store,
// which is managed using Redux Toolkit's entity adapter. 
//-> Normalized data can be retrived seperately by entity adapter function getSelector
export const {
    //getSelectors creates these selectors and we rename with aliases
    selectAll : selectAllUsers,
    selectById : selectUserById,
    selectIds : selectUserIds
} = usersAdapter.getSelectors( state => selectUsersData(state) ?? initialState);

/* 
This is a function call that retrieves the normalized data from the Redux store using the selectUsersData selector.
 If the data is not available (for example, when the app is initializing), it falls back to the initialState.
*/
