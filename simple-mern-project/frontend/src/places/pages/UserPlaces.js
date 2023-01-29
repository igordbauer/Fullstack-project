import React from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";

const PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipNVlM5lo7fIJrmvjN4EOrTMiQjDgDyTfw7ATdV6=s680-w680-h510",
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
      "https://lh3.googleusercontent.com/p/AF1QipNVlM5lo7fIJrmvjN4EOrTMiQjDgDyTfw7ATdV6=s680-w680-h510",
    address: "20 W 34th St., New York, NY 10001, EUA",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];
const UserPlaces = () => {
  const { userId } = useParams();
  const loadedPlaces = PLACES.filter((place) => place.creator === userId);

  return <PlaceList items={loadedPlaces} />;
};
export default UserPlaces;
