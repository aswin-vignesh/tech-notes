import { useEffect, useRef, useState } from 'react'
import {Outlet, Link} from 'react-router-dom'
import {useRefreshMutation} from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'
import PulseLoader from 'react-spinners/PulseLoader'


const PersistLogin = () => {

    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false)
    const [trueSuccess , setTrueSuccess] = useState(false)

    const [refresh , {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect( ()=> {

        //runs 2nd or when not in development, since it has to run only once
        if(effectRan.current === true || process.env.NODE_ENV !== 'development'){ // react 18 strict mode

            const verifyRefreshToken = async ()=> {

                console.log('Verifying Refresh Token');

                try{
                    await refresh(); // is done in authApiSlice and store the res in token state in authApi
                    setTrueSuccess(true); // if no err
                }catch(err){
                    console.log(err);
                }
            }

            if(!token && persist ) verifyRefreshToken(); // if no token (AND) user trusted source -> we get token new accessToken
        }


        // runs 1st
        return ()=> effectRan.current = true; // clean up func thats run during dismount 

        //eslint-disable-next-line
    },[])


    let content ; 

    if(!persist){
        console.log('no persist');
        content = <Outlet />
    }
    else if(isLoading){ // persist:yes  token:no 
        content = <PulseLoader color={"#FFF"} />
    }
    else if(isError) { // persist:yes token:no
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `} 
                <Link to='/login' >Please Login Again</Link>
            </p>
        )
    }
    else if(isSuccess && trueSuccess){
        console.log('success');
        content = <Outlet />
    }
    else if(token && isUninitialized){
        console.log('success')
        content = <Outlet />
    }


  return content
}

export default PersistLogin