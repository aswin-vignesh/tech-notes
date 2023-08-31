import { useEffect, useRef, useState } from "react"
import {useNavigate , Link } from "react-router-dom"

import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"

import usePersist from "../../hooks/usePersist"
import PulseLoader from "react-spinners/PulseLoader"

const Login = () => {

  const userRef = useRef() // does not cause rerender
  const errRef = useRef()
  const [username , setUsername] = useState('')
  const [password , setPassword] = useState('')
  const [errMsg , setErrMsg] = useState('')

  const [persist,setPersist] = usePersist();

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login , {isLoading}] = useLoginMutation(); // we r not using other isError or isSuccess here


  useEffect( ()=> { // initially focus the user
    userRef.current.focus(); // here we cant use useState which will cause reRender it no dependency is given 
  },[])

  useEffect(()=> {
    setErrMsg(''); // clear errors
  },[username,password])

  const handleUserInput = e => setUsername(e.target.value);
  const handlePwdInput = e => setPassword(e.target.value);
  const handleToggle = e => setPersist(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {accessToken} = await login({username , password }).unwrap() // unwrap throws error if there is error
      dispatch(setCredentials({accessToken}));
      setUsername('')
      setPassword('')
      navigate('/dash')
    } catch (err) {

      if(!err.status) {
        setErrMsg('No Server Response');
      }
      else if(err.status === 400){
        setErrMsg('Missing Username or Password');
      }
      else if(err.status === 401){
        setErrMsg('Unauthorized');
      }
      else{
        setErrMsg(err?.data?.message);
      }
      errRef.current.focus();
    }
  }

  const errClass = errMsg ? 'errmsg' : 'offscreen';

  if(isLoading) return <PulseLoader color={"#FFF"} />


  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">

        <p ref={errRef} className={errClass} aria-live='assertive'>{errMsg}</p>
         {/*when this gets focused aria live will read errMsg like string reader */}

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input 
            className="form__input"
            id="username"
            type="text" 
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />
          <label htmlFor="password">Password:</label>
          <input 
            className="form__input"
            id="password"
            type="password" 
            value={password}
            onChange={handlePwdInput}
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox" 
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
              />
              Trust This Device
          </label>

        </form>

      </main>
      <footer>
        <Link to='/'>Back to Home</Link>
      </footer>

    </section>    
  )



  return content
}

export default Login