import React, { useEffect, useState, useContext } from "react";
import "./PlaceForm.css";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormComponents/Input";
import Button from "../../shared/components/FormComponents/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { AuthContext } from "../../shared/context/authContext";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const { userId, token } = useContext(AuthContext);
  const history = useHistory();
  const { error, sendRequest, isLoading, clearError } = useHttpClient();
  const [place, setPlace] = useState();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const load = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        const place = response.place;
        setPlace(place);
        setFormData(
          {
            title: {
              value: place.title,
              isValid: true,
            },
            description: {
              value: place.description,
              isValid: false,
            },
          },
          true
        );
      } catch (err) {}
    };
    load();
  }, [placeId, sendRequest, setFormData]);

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        { "Content-Type": "application/json", Authorization: "Bearer " + token }
      );
      history.push(`/${userId}/places`);
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && place && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            type="text"
            label="Title"
            element="input"
            onInput={inputHandler}
            initialInputValue={place.title}
            initialInputValidity={true}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
          />
          <Input
            id="description"
            type="text"
            label="Description"
            element="textarea"
            onInput={inputHandler}
            initialInputValue={place.description}
            initialInputValidity={true}
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update
          </Button>
        </form>
      )}
    </>
  );
};
export default UpdatePlace;
