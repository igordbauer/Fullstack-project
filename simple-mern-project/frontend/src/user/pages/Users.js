import React, { useState, useEffect } from "react";
import UserList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await sendRequest("http://localhost:5000/api/users");
        setUsers(response.users);
      } catch (err) {}
    };
    load();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && <UserList items={users} />};
    </>
  );
};

export default Users;
