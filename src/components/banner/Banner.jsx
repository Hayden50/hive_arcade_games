import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import "./banner.css";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const Banner = ({ updateTrophies }) => {
  const [username, setUsername] = useState("");
  const [trophies, setTrophies] = useState(0);
  const [textFieldValue, setTextFieldValue] = useState("");

  const [createOpen, createSetOpen] = useState(false);
  const [deleteOpen, deleteSetOpen] = useState(false);

  const handleOpen = () => {
    if (username === "") createSetOpen(true);
    else deleteSetOpen(true);
  };

  const handleClose = () => {
    createSetOpen(false);
    deleteSetOpen(false);
  };

  const handleTextFieldChange = (event) => {
    setTextFieldValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const postData = {
      username: textFieldValue,
    };

    fetch("http://localhost:8000/createUsername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username === textFieldValue) {
          setUsername(data.username);
        } else {
          setUsername("ERROR!");
        }
      });

    handleClose();
    setTextFieldValue("");
  };

  const handleLogout = () => {
    fetch("http://localhost:8000/deleteUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setUsername("");
          handleClose();
        }
      })
      .catch((error) => console.log(error));

    setTrophies(0);
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/getUserData");
        const data = await response.json();
        setUsername(data.username);
        setTrophies(data.trophies);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    getUserData();
  }, [updateTrophies]); // Empty dependency array ensures the effect runs only on mount

  return (
    <>
      <Modal
        open={createOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={textFieldValue}
            onChange={handleTextFieldChange}
          />
          <Button
            variant="contained"
            size="medium"
            onClick={handleSubmit}
            sx={{ marginTop: "10px" }}
          >
            Login / Create User
          </Button>
        </Box>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="greeting-container">
            <h1 className="greeting">Hello {username}</h1>
          </div>
          <Button variant="contained" size="medium" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Modal>

      <div className="banner-container">
        <button className="person banner-button" onClick={handleOpen}>
          <PersonIcon fontSize="large" />
          <h2 className="username">
            {username === "" ? "Click here to log in!" : username}
          </h2>
        </button>
        <button className="trophy banner-button">
          <h2 className="trophy-number">{trophies}</h2>
          <EmojiEventsIcon fontSize="large" />
        </button>
      </div>
    </>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
};

export default Banner;
