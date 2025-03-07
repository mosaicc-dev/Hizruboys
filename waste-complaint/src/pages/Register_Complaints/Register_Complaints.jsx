import "./Register_Complaints.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  StyledFormControl,
  StyledInputLabel,
  StyledTextField,
  StyledMenuItem,
  StyledSelect,
} from "../../components/StyledComponents/StyledComponents.js";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import CustomDropdown from "../../components/CustomDropDown/CustomDropDown.jsx";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../library/helper.js";
import BarSide from "../../components/SideBarNavi/BarSide.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { css } from "@emotion/react";
import { PulseLoader } from "react-spinners";
import Lottie from "react-lottie-player";
import successAnimation from "../../assets/animation/success-animation.json";

import successSound from "../../assets/audio/sucessful-AUDIO.mp3";
import errorSound from "../../assets/audio/error-4-audio.mp3";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function Register_Complaints() {
  const [visitorExists, setVisitorExists] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [wasteType, setWasteTypes] = useState("");
  const [reasonforID, setReasonforID] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const [shouldReset, setShouldReset] = useState(false);

  const [currentDateTime, setCurrentDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [selectedCamera, setSelectedCamera] = useState("");
  const [availableCameras, setAvailableCameras] = useState([]);
  const [isCameraON, setIsCameraON] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  const visitorPhoto = useRef(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const streamRef = useRef(null); // Reference to hold the media stream
  const NameInputRef = useRef(null);
  const [options, setOptions] = useState([
    { value: "Confiscated", label: "Confiscated" },
    { value: "Lost", label: "Lost" },
    { value: "Forgot", label: "Forgot" },
  ]); // Initial options
  const [filteredOptions, setFilteredOptions] = useState(options); // Define filteredOptions state
  // const [idCards, setIdCards] = useState();
  const [filteredICards, setFilteredICards] = useState([]);
  const API_URL = API_BASE_URL;
  const isSmallScreen = useMediaQuery("(max-width: 2000px)");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Register TempID`;
  }, []);

  useEffect(() => {
    const updateCurrentDateTime = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      // Convert hours to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight (0 hours)

      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
      setCurrentDateTime(formattedDateTime);
    };

    // Update the date and time immediately on mount
    updateCurrentDateTime();

    // Update the date and time every second
    const intervalId = setInterval(updateCurrentDateTime, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const notifyExists = (phone_number, name) => {
    toast.info(`Visitor '${name}' with ${phone_number} exists`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const notifyErr = (err) => {
    const audio = new Audio(errorSound);
    audio.play();

    toast.error(`${err}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const notifySuccess = (text) => {
    toast.success(`${text}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Generate a preview URL for the selected file
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);

      // Convert the file to Base64 and reduce its quality
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Create a canvas to resize and compress the image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas dimensions
          const maxWidth = 600; // Adjust as needed
          const maxHeight = 600; // Adjust as needed
          let width = img.width;
          let height = img.height;

          // Resize logic to maintain aspect ratio
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert the canvas to a Base64 string with reduced quality
          const reducedQualityDataUrl = canvas.toDataURL("image/jpeg", 0.2); // Adjust quality (0.1 to 1)
          setPhotoDataUrl(reducedQualityDataUrl);
        };

        // Load the image from the file's Base64
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWasteTypeChange = (event) => {
    setWasteTypes(event.target.value);
  };

  const handleDescriptionChange = async (event) => {
    setDescription(event.target.value);
  };

  // Function to get available cameras
  useEffect(() => {
    const getAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setAvailableCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId); // Set first camera as default
        }
      } catch (error) {
        console.error("Error accessing cameras", error);
      }
    };

    if (!isSmallScreen) {
      getAvailableCameras();
    }
  }, [isSmallScreen]);

  // Get the video stream from the selected camera
  const getVideo = (cameraId) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: cameraId ? { exact: cameraId } : undefined,
            width: 1920,
            height: 1080,
          },
        })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
          streamRef.current = stream; // Store the stream reference
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    } else {
      console.error("getUserMedia is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (isCameraON && videoRef.current && selectedCamera) {
      getVideo(selectedCamera);
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraON, selectedCamera]);

  // Function to turn camera on
  const onCamera = async () => {
    if (!isCameraON) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraON(true);
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    } else {
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsCameraON(false);
  };

  const capturePhoto = (event) => {
    const width = 165;
    const height = 165;
    let video = videoRef.current;
    let photo = photoRef.current;
    photo.width = width;
    photo.height = height;
    const context = photo.getContext("2d");
    context.drawImage(video, 0, 0, width, height);

    // Save the captured image as a data URL
    const dataUrl = photo.toDataURL("image/jpeg", 0.2);
    setPhotoDataUrl(dataUrl);
    console.log(dataUrl);
    setHasPhoto(true); // Set the photo state to true once a photo is captured
  };

  const clearPhoto = (event) => {
    const context = photoRef.current.getContext("2d");
    context.clearRect(0, 0, photoRef.current.width, photoRef.current.height);
    setHasPhoto(false);
    setPhotoDataUrl("");
    setPhotoPreview("");
  };

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  const handleSubmit = async (event) => {

    if (!wasteType) {
      notifyErr("Please provide the type of Waste");
      return;
    }

    if (!description) {
      notifyErr("Please provide a Description");
      return;
    }

    if (!location) {
      notifyErr("Please provide a Class");
      return;
    }

    if (!currentDateTime) {
      notifyErr("Please provide the current date and time");
      return;
    }

    if (!photoDataUrl) {
      notifyErr("Please provide a photo");
      return;
    }

    setLoading(true);

    // const idArrayFilled = await checkArrayFilled();
    // const accessibleVisitor = await checkVisitorAccessibility();

    // if (!idArrayFilled || !accessibleVisitor) {
    //   setLoading(false); // Stop loading if any validation fails
    //   return;
    // }

    const finalData = {
      Description: description,
      Location: location,
      timeIssued: new Date(),
      Photo: photoDataUrl,
    };

    console.log({ ...finalData });

    try {


      const response = await axios.post(
        `${API_URL}/posting-complaint`,
        { ComplaintInfo: finalData },
      );

      if (response.data.checking) {
        notifySuccess(response.data.msg);

        const audio = new Audio(successSound);
        audio.play();

        handleClear();
        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        notifyErr(response.data.msg);
      }
    } catch (error) {
      console.error("Error Register Complaint:", error);
      notifyErr("Error Register Complaint");
      return false;
    }
  };

  const handleClear = (event) => {
    const finalData = {
      StudentName: name,
      Description: description,
      Location: location,

      timeIssued: new Date(),
      Photo: photoDataUrl,
    };

    // console.log(finalData);

    setVisitorExists(false);
    setPhoneNumber("");
    setName("");
    setReasonforID("");
    setWasteTypes("");
    setLocation(""); // Default entry gate
    setDescription(""); // New state variable to hold the vehicle number
    setRollNo("");
    setIdNumber("");

    // const [currentDateTime, setCurrentDateTime] = useState('');
    setHasPhoto(false);
    setIsCameraON(false);
    setPhotoDataUrl(""); // New state variable to hold the photo data URL
    setPhotoPreview("");
    setOptions([
      { value: "Campus Tour", label: "Campus Tour" },
      { value: "Meeting", label: "Meeting" },
      { value: "Event", label: "Event" },
    ]); // Initial options
    setFilteredOptions(options); // Define filteredOptions state
    // setIdCards(["", "", "", "", ""]);
    // setFilteredICards([]);
    clearPhoto();
    stopCamera();
    setSelectedCamera(availableCameras[0]?.deviceId || "");
    setShouldReset(true);
    setTimeout(() => setShouldReset(false), 0);
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Import other necessary components and hooks

  return (
    <div className="body-content">
      <div className="main-content">
        <aside>
          <BarSide activePage="registerComplaint" />
        </aside>
        <main className="content pt-4 flex">
          <div className="register-form">
            {/* <Box
                  component="main"
                  flex="1"
                  display="flex"
                  flexDirection="column"
                > */}
            <Box
              sx={{
                p: 1,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                overflow: "auto",
              }}
            >
              <h2
                style={{
                  width: "100%",
                  height: "fit-content",
                  fontFamily: "unset",
                  fontSize: "16px",
                  fontWeight: 500,
                  borderBottom: "1px solid rgb(183, 183, 183)",
                  marginBottom: 10,
                }}
              >
                Register Complaint
              </h2>
              <form>
                <Box
                  display="flex"
                  flexDirection={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  mb={2}
                >
                  {/* Left Section */}
                  <Box
                    sx={{
                      flexBasis: "65%",
                      "& > :not(style)": {
                        m: 1,
                        pl: 2,
                        width: { xs: "85%", sm: "260px" },
                      },
                      height: "auto",
                    }}
                  >
                    <StyledFormControl>
                      <StyledInputLabel id="entry">
                        Type of Waste
                      </StyledInputLabel>
                      <StyledSelect
                        name="wasteType"
                        id="wasteType"
                        value={wasteType}
                        onChange={handleWasteTypeChange}
                      >
                        <StyledMenuItem value="Wet Waste">
                          Wet Waste
                        </StyledMenuItem>
                        <StyledMenuItem value="Plastic Waste">
                          Dry Waste
                        </StyledMenuItem>
                        <StyledMenuItem value="Paper Waste">
                          Paper Waste
                        </StyledMenuItem>
                        <StyledMenuItem value="Mixed Waste">
                          Mixed Waste
                        </StyledMenuItem>
                      </StyledSelect>
                    </StyledFormControl>

                    <StyledFormControl>
                      <StyledInputLabel>Description</StyledInputLabel>
                      <StyledTextField
                        type="text"
                        variant="outlined"
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                      />
                    </StyledFormControl>
                  
                  <Button
                      variant="contained"
                      onClick={getLocation}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        pt: isSmallScreen ? 1 : 2,
                      }}
                    >
                      <label>Get Current Location</label>
                    </Button>

                    
                    <StyledFormControl>
                      <StyledInputLabel>Location:</StyledInputLabel>
                      <StyledTextField
                        type="text"
                        variant="outlined"
                        id="location"
                        value={location}
                        slotProps={{ htmlInput: { maxLength: 1 } }}
                      />
                    </StyledFormControl>
                  </Box>


                    {latitude && longitude && location && (
                      <div style={{ height: "300px", width: "100%", marginTop: "10px", zIndex:10 }}>
                      <MapContainer 
                          center={[latitude, longitude]} 
                          zoom={15} 
                          style={{ height: "100%", width: "100%" }}
                      >
                          <TileLayer 
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                          />
                          <Marker position={[latitude, longitude]} />
                      </MapContainer>
                  </div>
                    )}

                  {/* Right Section */}
                  <Box
                    sx={{
                      flexBasis: "35%",
                      minWidth: "310px",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    {/* Camera Selection Dropdown */}
                    <span style={{ display: isSmallScreen ? "none" : "block" }}>
                      <FormControl
                        sx={{
                          marginBottom: 2,
                          mt: 2,
                          fontSize: 10,
                          width: "130px",
                        }}
                      >
                        <InputLabel
                          sx={{ fontSize: 13 }}
                          id="camera-select-label"
                        >
                          Select Camera
                        </InputLabel>
                        <Select
                          labelId="camera-select-label"
                          id="camera-select"
                          value={selectedCamera}
                          label="Select Camera"
                          onChange={handleCameraChange}
                          sx={{ height: "50px" }}
                        >
                          {availableCameras.map((camera) => (
                            <MenuItem
                              key={camera.deviceId}
                              value={camera.deviceId}
                            >
                              {camera.label || `Camera ${camera.deviceId}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </span>

                    <Box
                      className="photo-frame"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: "100%",
                        width: "90%",
                        height: "fit-content",
                        pt: isSmallScreen ? 2 : "auto",
                      }}
                    >
                      <img
                        className="live-videos"
                        style={{
                          width: "165px",
                          height: "165px",
                          border: "1px solid #000",
                          borderRadius: "5px",
                          backgroundColor: "#282828",
                          backgroundImage: photoPreview
                            ? `url(${photoPreview})`
                            : "none", // Use the preview URL,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></img>

                      <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
                        {!isCameraON && (
                          <>
                            {isSmallScreen ? (
                              <Button
                                variant="contained"
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                  pt: isSmallScreen ? 1 : 2,
                                }}
                              >
                                <label htmlFor="photo-visitor">
                                  Take Photo
                                </label>
                                <input
                                  type="file"
                                  name="photo-visitor"
                                  id="photo-visitor"
                                  accept="image/*"
                                  ref={visitorPhoto}
                                  onChange={handleFileChange}
                                  capture="environment"
                                  style={{
                                    width: "0px",
                                    border: "none",
                                    opacity: 0,
                                  }}
                                />
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={onCamera}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                }}
                              >
                                Turn on Camera
                              </Button>
                            )}
                          </>
                        )}
                        {isCameraON && (
                          <Button
                            variant="contained"
                            onClick={onCamera}
                            color="error"
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                            }}
                          >
                            Turn Camera Off
                          </Button>
                        )}
                        {isCameraON && (
                          <Button
                            variant="contained"
                            onClick={capturePhoto}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              backgroundColor: "#239700",
                            }}
                          >
                            Capture Photo
                          </Button>
                        )}
                      </Stack>
                    </Box>

                    <span
                      style={
                        isSmallScreen || photoPreview
                          ? { display: "none" }
                          : { display: "block" }
                      }
                    >
                      <Box
                        className="resulter"
                        sx={{
                          mt: 2,
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "start",
                            mr: -4,
                            width: "165px",
                            height: "165px",
                          }}
                          className={"result " + (hasPhoto ? "hasPhoto" : "")}
                        >
                          <canvas
                            ref={photoRef}
                            style={{
                              display: "none",
                            }}
                          />
                          {photoDataUrl && (
                            <img src={photoDataUrl} alt="Captured" />
                          )}
                          {hasPhoto && (
                            <IconButton
                              type="button"
                              onClick={clearPhoto}
                              sx={{ mt: -1.5, ml: -1 }}
                            >
                              <CancelOutlinedIcon color="error" />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </span>
                  </Box>
                </Box>
              </form>

              {/* Footer Buttons */}
              <Box
                sx={{
                  mt: "auto",
                  display: "flex",
                  justifyContent: "flex-end",
                  borderTop: "1px solid rgb(183, 183, 183)",
                  pt: 2,
                  backgroundColor: "#fff",
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      borderRadius: 1,
                    }}
                    onClick={() => {
                      handleClear();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      color: "white",
                      textTransform: "none",
                      borderRadius: 1,
                    }}
                    onClick={() => handleClear()}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    variant="outlined"
                    endIcon={<SendIcon />}
                    sx={{
                      color: "white",
                      backgroundColor: "#239700",
                      textTransform: "none",
                      borderRadius: 1,
                    }}
                    onClick={() => handleSubmit()}
                    disabled={loading}
                  >
                    {loading ? (
                      <PulseLoader
                        color={"#ffffff"}
                        loading={loading}
                        size={15}
                      />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Stack>
              </Box>
            </Box>
            {/* </Box> */}
          </div>
          {success && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <Lottie
                loop={false}
                animationData={successAnimation} // Lottie JSON animation file
                play
                style={{ width: 150, height: 150, zIndex: 999 }}
              />
            </div>
          )}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <span className="w-fit h-fit" style={{ zIndex: 99 }}>
                <PulseLoader color={"#ffffff"} loading={loading} size={35} />
              </span>
            </div>
          )}
        </main>
      </div>
      <div className="footer-style">
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
}

export default Register_Complaints;
