import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import { ROLES } from "./config/roles";
import RequireAuth from "./features/auth/RequireAuth";

import useTitle from './hooks/useTitle'

function App() {

  useTitle('AV Notes')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />


        {/* Protected paths */}

        {/* Prefetch paths */}
        <Route element={<PersistLogin />} >
        <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />} >
        <Route element={<Prefetch />} >
          <Route path="dash" element={<DashLayout />}>

            {/* Note index cannot have path */}
            <Route index element={<Welcome />} />

            {/* Users Path */}
            <Route element={<RequireAuth allowedRoles={[ROLES.Manager,ROLES.Admin]} />} >
              <Route path="users">
                <Route index element={<UsersList />} />
                  <Route path=":id" element={<EditUser />} />
                  <Route path="new" element={<NewUserForm />} />
              </Route>
            </Route>

            {/* Notes Path */}
            <Route path="notes">
              <Route index element={<NotesList />} />
              <Route path=":id" element={<EditNote />} />
              <Route path="new" element={<NewNote />} />
            </Route>

          </Route>{/* End Dash */}
        </Route>{/* End Prefetch */}
        </Route>{/* End RequireAuth */}
        </Route>{/* End Persist */}
        
      </Route>{/* End / Root */}
      
    </Routes>
  );
}

export default App;
