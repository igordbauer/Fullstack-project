import React from "react";
import "./UsersList.css";
import UserItem from "./UserItem";

const UserList = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="center">
        <h2>No items found.</h2>
      </div>
    );
  }
  return (
    <ul>
      {items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  );
};
export default UserList;
