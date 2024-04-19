import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import "./banner.css";
import { useState, useEffect } from "react";

const Banner = () => {
  const [username, setUsername] = useState("");
  const [trophies, setTrophies] = useState(0);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/getUserData");
        const data = await response.json();
        console.log(data);
        setUsername(data.username);
        setTrophies(data.trophies);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    getUserData();
  }, []); // Empty dependency array ensures the effect runs only on mount

  return (
    <div className="banner-container">
      <button className="person banner-button">
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
  );
};

export default Banner;
