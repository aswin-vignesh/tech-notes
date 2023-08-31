import  { useEffect, useState } from 'react'

const usePersist = () => {

    const [persist , setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false); // string to Object


    useEffect(()=>{
        localStorage.setItem("persist",JSON.stringify(persist)) // object to string
    },[persist])

    return [persist,setPersist]
}

export default usePersist