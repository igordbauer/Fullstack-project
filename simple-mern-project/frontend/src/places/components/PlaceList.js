import React from "react";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = ({ items, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="place-list center">
        <Card className="place-list">
          <h2>No Places found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};
export default PlaceList;
