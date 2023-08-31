import NewNoteForm from "./NewNoteForm";

import {  useGetUsersQuery } from '../users/usersApiSlice' 
import PulseLoader from 'react-spinners/PulseLoader'



const NewNote = () => {

  // const users = useSelector(selectAllUsers); // memoized

  
    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        }),
    })

    if (!users?.length) return <PulseLoader color={"#FFF"} />


  const content = <NewNoteForm users={users} /> 

  return content;
}

export default NewNote