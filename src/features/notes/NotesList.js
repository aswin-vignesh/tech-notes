import React from 'react'
import { useGetNotesQuery } from './notesApiSlice'
import Note from './Note';
import useAuth from '../../hooks/useAuth';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';

const NotesList = () => {

  useTitle('AV NotesList')

  const {username , isManager , isAdmin } = useAuth()

  const {
    data:notes,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetNotesQuery('notesList',{
    pollingInterval:15000,
    refetchOnFocus:true,
    refetchOnMountOrArgChange:true
  });

  let content ;

  if(isLoading) content = <PulseLoader color={"#FFF"} />
  if(isError) content = <p className='errmsg'>  {error?.data?.message} </p>

  if(isSuccess){
    const {ids, entities} = notes;
    
    let filterIds;
    if(isManager || isAdmin ){
      filterIds= [...ids]
    } else{
      filterIds = ids.filter( noteId => entities[noteId].username === username) // if the id username === current user 
    }

    const tableContent = ids?.length && filterIds.map(noteId => <Note key={noteId} noteId={noteId}/>)

    content = (
        <table className='table table--notes'>
          <thead className='table__thead' >
            <tr>
              <th scope='col' className='table__th note__status'>Status</th>
              <th scope='col' className='table__th note__created'>Created</th>
              <th scope='col' className='table__th note__updated'>Updated</th>
              <th scope='col' className='table__th note__title'>Title</th>
              <th scope='col' className='table__th note__username'>Owner</th>
              <th scope='col' className='table__th note__edit'>Edit</th>
            </tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>
    )
  }

  return content;
}

export default NotesList