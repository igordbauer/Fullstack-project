import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceItem.css";
import Button from "../../shared/components/FormComponents/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContext } from "../../shared/context/authContext";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const PlaceItem = ({
  id,
  title,
  description,
  address,
  image,
  creatorId,
  coordinates,
  onDelete,
}) => {
  const authContext = useContext(AuthContext);
  const { error, isLoading, clearError, sendRequest } = useHttpClient();

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const showDeleteWarningHandler = () => setShowConfirmModal(true);
  const cancelDeleteHandler = () => setShowConfirmModal(false);
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/api/places/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + authContext.token,
        }
      );
      onDelete(id);
    } catch (err) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          {!isLoading && (
            <>
              <div className="place-item__image">
                <img src={`http://localhost:5000/${image}`} alt={title} />
              </div>
              <div className="place-item__info">
                <h2>{title}</h2>
                <h3>{address}</h3>
                <p>{description}</p>
              </div>
              <div className="place-item__actions">
                <Button inverse onClick={openMapHandler}>
                  See Map
                </Button>
                {authContext.userId === creatorId && (
                  <>
                    <Button to={`/places/${id}`}>Edit</Button>
                    <Button danger onClick={showDeleteWarningHandler}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
