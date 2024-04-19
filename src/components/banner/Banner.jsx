import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import "./banner.css";
import { useState, useEffect } from "react";

const Banner = () => {
  const [username, setUsername] = useState("");
  const [trophy, setTrophies] = useState(0);

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const response = await fetch("http://localhost:5000/username");
        const data = await response.json();
        console.log(data);
        setUsername(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    const checkTrophies = async () => {
      try {
        const response = await fetch("http://localhost:5000/trophy");
        const data = await response.json();
        console.log(data);
        setTrophies(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    checkUsername();
    checkTrophies();
  }, []); // Empty dependency array ensures the effect runs only on mount

  return (
    <div className="banner-container">
      <button className="person banner-button">
        <PersonIcon fontSize="large" />
        <h2 className="username">
          {username.data === "" ? "Click here to log in!" : username.data}
        </h2>
      </button>
      <button className="trophy banner-button">
        <h2 className="trophy-number">{trophy.data}</h2>
        <EmojiEventsIcon fontSize="large" />
      </button>
    </div>
  );
};

export default Banner;
