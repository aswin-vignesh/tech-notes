import { createSelector , createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
    sortComparer: (a,b) => ( (a.completed === b.completed) ? 0 : a.completed ? 1 : -1) 
}) 



const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) =>({

        // these will update the state in entityAdapter and those is used to retrive
        getNotes : builder.query({

            query: ()=> ({
                url : '/notes',
                
                validateStatus : ( response , result ) => { // checking the fetch
                    return response.status === 200 && !result.isError
                } 
            }),  // fetching here

            
            // keepUnusedDataFor : 5, // default 60s , it gets data every 60s //problem : reloads in 5s on edit page

            transformResponse : responseData => {
                const loadednotes = responseData.map(note => {
                    note.id = note._id;
                    return note;
                })
                return notesAdapter.setAll(initialState , loadednotes);
            },

            providesTags:(result, error , arg) =>{   
                if(result?.ids){
                    return [
                        {type : 'Note' , id : 'LIST'},
                        result.ids.map( id =>  ( {type: 'Note' , id }))
                    ]
                }else{
                    return [{type : 'Note' , id : 'LIST'}]
                }
            }
        }),
        addNewNote: builder.mutation({
            query : initialNoteData => ({
                url : '/notes',
                method :'POST',
                body: { // the data we provide or args
                    ...initialNoteData
                }
            }),
            invalidatesTags:[{type:'Note',id:'LIST'}]
        }),
        updateNote: builder.mutation({
            query : initialNoteData => ({
                url : '/notes',
                method :'PATCH',
                body: { // the data we provide or args
                    ...initialNoteData,
                }
            }),
            invalidatesTags:(result,error, args) => [{type:'Note',id:args.id}]
        }),
        deleteNote: builder.mutation({
            query : ({id}) => ({
                url : '/notes',
                method :'DELETE',
                body: { id}
            }),
            invalidatesTags:(result,error, args) => [{type:'Note',id:args.id}]
        }),
    })
})


export const { 
    useGetNotesQuery,
    useAddNewNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesApiSlice

// selectors

export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// Memoize the data only not other flags
 const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data  
)

// These selectors are used to efficiently retrieve specific slices of data from the Redux store -> MEMOIZED,
export const {
    selectAll : selectAllNotes,
    selectById : selectNoteById,
    selectIds : selectNoteIds
} = notesAdapter.getSelectors( state => selectNotesData(state) ?? initialState);



