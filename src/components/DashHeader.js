import { useEffect } from "react";
import { Link, useNavigate , useLocation } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";



const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {

    const {isManager , isAdmin } = useAuth();

    const navigate = useNavigate();
    const {pathname} = useLocation();

    const [sendLogout , {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation();

    useEffect(()=>{
        if(isSuccess){
            navigate('/');
        }
    },[isSuccess,navigate])


    // nav navigation
    const onNewNoteClicked = ()=> navigate('/dash/notes/new');
    const onNewUserClicked = ()=> navigate('/dash/users/new');
    const onNotesClicked = ()=> navigate('/dash/notes');
    const onUsersClicked = ()=> navigate('/dash/users');



    
    let dashClass = null;

    if(!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)){
        dashClass = "dash-header__container--small"
    }

    // new note
    let newNoteButton = null
    if(NOTES_REGEX.test(pathname)){
        newNoteButton = (
            <button
                className="icon-button"
                title="New Note"
                onClick={onNewNoteClicked}
            >
                <FontAwesomeIcon icon={faFileCirclePlus} />
            </button>
        )
    }

    // new User         // no need to check manager || admin since they cant get that path there if they arent
    let newUserButton = null
    if(USERS_REGEX.test(pathname)){
        newUserButton = (
            <button
                className="icon-button"
                title="New User"
                onClick={onNewUserClicked}
            >
                <FontAwesomeIcon icon={faUserPlus} />
            </button>
        )
    }

    // Users
    let usersButton = null
    if( isManager || isAdmin){
        if(!USERS_REGEX.test(pathname) && pathname.includes('/dash')){
            usersButton = (
                <button
                    className="icon-button"
                    title="Users"
                    onClick={onUsersClicked}
                >
                    <FontAwesomeIcon icon={faUserGear} />
                </button>
            )
        }
    }

    // Notes
    let notesButton = null
    if(!NOTES_REGEX.test(pathname) && pathname.includes('/dash')){
        notesButton = (
            <button
                className="icon-button"
                title="Notes"
                onClick={onNotesClicked}
            >
                <FontAwesomeIcon icon={faFilePen} />
            </button>
        )
    }


    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    let buttonContent
    
    if(isLoading){
        buttonContent = <p>Logging Out ...</p>
    }else{
        buttonContent = (
            <>
                {newNoteButton}
                {newUserButton}
                {notesButton}
                {usersButton}
                {logoutButton}
            </>
        )
    }


    const errClass = isError ? 'errmsg' : 'offscreen' 

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>
            
            <header className="dash-header">
                <div className={`dash-header__container ${dashClass}`}>
                    <Link to={'/dash'}>
                        <h1 className="dash-header__title" >TECH NOTE </h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>

            </header>
        </>
    )

  return content;
};

export default DashHeader;
