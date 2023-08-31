import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, error: delError }
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onRolesChanged = e => {
    const values = Array.from(
        e.target.selectedOptions, //HTMLCollection 
        (option) => option.value
    )
    setRoles(values)
}

  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  let canSave;

  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }


  const options = Object.values(ROLES).map(role => {
    return(
      <option
      key={role}
      value={role}
      >
      {role}
      </option>
    )
  })

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = password && !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !Boolean(roles.length)
    ? "form__input--incomplete"
    : "";

  const errContent = (error?.data?.message || delError?.data.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="icon-button">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
              onClick={onSaveUserClicked}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
          <div className="icon-button">
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="username">
          Username : <span className="nowrap">[3-20 letters]</span>{" "}
        </label>
        <input
          className={`form__ input ${validUserClass}`}
          id="username"
          name="username" // by this server gets the right value
          value={username}
          type="text"
          autoComplete="off"
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password : <span className="nowrap">[3-12 chars incl[!@#$%]]</span>{" "}
        </label>
        <input
          className={`form__ input ${validPwdClass}`}
          id="password"
          name="password" // by this server gets the right value
          value={password}
          type="text"
          autoComplete="off"
          onChange={onPasswordChanged}
        />

        <label className="form__label form__checkbox-container" htmlFor="user-active">
          ACTIVE :
        </label>
        <input
          className='form__checkbox'
          id="user-active"
          name="user-active" // by this server gets the right value
          type="checkbox"
          onChange={onActiveChanged}
        />

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:{" "}
        </label>
        <select
          className={`form__select ${validRolesClass}`}
          name="roles"
          id="roles"
          multiple={true}
          size="3"
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );

  return content;
};

export default EditUserForm;
