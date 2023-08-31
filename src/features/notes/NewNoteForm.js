import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const [user, setUser] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [completed, setCompleted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setCompleted(false);
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserChanged = (e) => setUser(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);

  const validUser = (id) => users.filter((user) => user.id === id);

  const canSave =
    user !== "" && !title.length < 5 && text.length && !isLoading;

  const onSaveButtonClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ user, title, text, completed });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUser ? "form__input--incomplete" : "";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const userOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form className="form" onSubmit={onSaveButtonClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <select
          className={`form__select ${validUserClass}`}
          name="user"
          id="user"
          value={user}
          onChange={onUserChanged}
        >
          <option value=""></option>
          {userOptions}
        </select>

        <label className="form__label" htmlFor="title">
          Title : <span className="nowrap"> min 5 chars</span>{" "}
        </label>
        <input
          className={`form__ input ${validTitleClass}`}
          id="title"
          name="title" // by this server gets the right value
          value={title}
          type="text"
          autoComplete="off"
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="text">
          Text Details : <span className="nowrap"> min 5 chars</span>{" "}
        </label>
        <input
          className={`form__ input ${validTextClass}`}
          id="text"
          name="text" // by this server gets the right value
          value={text}
          type="text"
          autoComplete="off"
          onChange={onTextChanged}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="user-active"
        >
          COMPLETED :
        </label>
        <input
          className="form__checkbox"
          id="user-active"
          name="user-active" // by this server gets the right value
          type="checkbox"
          onChange={onCompletedChanged}
        />
      </form>
    </>
  );

  return content;
};

export default NewNoteForm;
