import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDeleteNoteMutation, useUpdateNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const EditNoteForm = ({ note, users }) => {

  const {isManager , isAdmin } = useAuth()

  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delError,
    },
  ] = useDeleteNoteMutation();

  const [user, setUser] = useState(note.user);
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [completed, setCompleted] = useState(note.completed);

  const navigate = useNavigate();

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  // we are not doing input checks for now

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUser("");
      setTitle("");
      setText("");
      setCompleted(false);

      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUserChanged = (e) => setUser(e.target.value);
  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);

  const canSave =
    user !== "" &&
    !title.length < 5 &&
    text.length &&
    !isLoading &&
    !isDelLoading;

  const onSaveNoteClicked = async () => {
    await updateNote({ id: note.id, user, title, text, completed });
  };

  const onDeleteNoteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const userOptions = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  let deleteButton = null;

  if(isManager || isAdmin ){
    
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteNoteClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }


  let content = (
    <>
      <p className={errClass}>
        {error?.data?.message ?? delError?.data?.message}
      </p>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
              onClick={onSaveNoteClicked}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
          <div className="icon-button">
            {deleteButton}
          </div>
        </div>

        <select
          className={`form__select `}
          name="user"
          id="user"
          value={user}
          onChange={onUserChanged}
        >
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
          defaultChecked={completed}
          onChange={onCompletedChanged}
        />
        <div className="form__divider">
          <p className="form__created">
            Created:
            <br />
            {created}
          </p>
          <p className="form__updated">
            Updated:
            <br />
            {updated}
          </p>
        </div>
      </form>
    </>
  );
  return content;
};

export default EditNoteForm;
