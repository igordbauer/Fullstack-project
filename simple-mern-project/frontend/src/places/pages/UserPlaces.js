import React, { useEffect, useState } from "react";
import PlaceList from "../components/PlaceList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const { userId } = useParams();
  const [places, setPlaces] = useState([]);
  const { sendRequest, error, isLoading, clearError } = useHttpClient();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setPlaces(response.userPlaces.places);
      } catch (err) {}
    };
    load();
  }, [sendRequest, userId]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && <PlaceList items={places} />}
    </>
  );
};
export default UserPlaces;
