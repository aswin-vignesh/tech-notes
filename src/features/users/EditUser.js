import { useParams } from "react-router-dom"
import EditUserForm from "./EditUserForm";

import {  useGetUsersQuery } from "./usersApiSlice"
import PulseLoader from 'react-spinners/PulseLoader'



const EditUser = () => {

  const {id} = useParams();

  // const user = useSelector(state => selectUserById(state,id));  // memoized 

  const {user} = useGetUsersQuery("usersList", {
    selectFromResult: ({data}) => ({
        user: data?.entities[id]
    })
  })

  if(!user) return <PulseLoader color="#fff" />

  const content = <EditUserForm user={user} /> 

  return content;
}

export default EditUser