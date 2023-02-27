import React, { useRef, useState, useEffect } from "react";
import "./ImageUpload.css";
import Button from "./Button";
const ImageUpload = ({ id, center, onInput, errorText }) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewurl] = useState();
  const [isValid, setIsvalid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewurl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (e.target.files && e.target.files.length !== 0) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsvalid(true);
      fileIsValid = true;
    } else {
      setIsvalid(false);
      fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid);
  };
  const pickImagehandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImagehandler}>
          Pick Image
        </Button>
      </div>

      {!isValid && <p>{errorText}</p>}
    </div>
  );
};
export default ImageUpload;
