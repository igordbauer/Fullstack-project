import React from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/components/FormComponents/Input";
import "./PlaceForm.css";
import Button from "../../shared/components/FormComponents/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

const PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St., New York, NY 10001, EUA",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St., New York, NY 10001, EUA",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  console.log(placeId);

  const identifiedPlace = PLACES.filter((place) => place.id === placeId)[0];
  console.log(identifiedPlace);
  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find any place!</h2>
      </div>
    );
  }

  return (
    <form className="place-form">
      <Input
        id="title"
        type="text"
        label="Title"
        element="input"
        onInput={() => {}}
        value={identifiedPlace.title}
        valid={true}
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
      />
      <Input
        id="description"
        type="text"
        label="Description"
        element="textarea"
        onInput={() => {}}
        value={identifiedPlace.description}
        valid={true}
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
      />
      <Button type="submit" disabled={true}>
        Update
      </Button>
    </form>
  );
};
export default UpdatePlace;
