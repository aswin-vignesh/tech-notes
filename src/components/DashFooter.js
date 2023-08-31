import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {

  const {username , status } = useAuth(); // kind of used like middleware

  const navigate = useNavigate();
  const { pathname } = useLocation(); // maybe alternative or similar to useParams

  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton = null;

  if (pathname !== "/dash") {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home" // shows up on mouse hover on button
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }

  const content = (
    <footer className="dash-footer">
      {goHomeButton}
      <p>Current User :{username} </p>
      <p>Status : {status}</p>
    </footer>
  );
  return content;
};

export default DashFooter;
