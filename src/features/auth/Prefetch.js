
import { useEffect } from "react"
import {store} from "../../app/store"
import { notesApiSlice } from "../notes/notesApiSlice"
import { usersApiSlice } from "../users/usersApiSlice"
import { Outlet } from "react-router-dom"

const Prefetch = () => {

    useEffect(() => {

        //                                                         endpoint   Subscription Name
        store.dispatch(notesApiSlice.util.prefetch('getUsers',   'usersList'      ,{force:true}))
        store.dispatch(usersApiSlice.util.prefetch('getNotes',   'notesList'      ,{force:true}))

    }, [])

  return <Outlet />
}

export default Prefetch