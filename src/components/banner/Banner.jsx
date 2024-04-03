import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import "./banner.css";

const Banner = () => {
  return (
    <div className="banner-container">
      <button className="person banner-button">
        <PersonIcon fontSize="large" />
      </button>
      <button className="trophy banner-button">
        <EmojiEventsIcon fontSize="large" />
      </button>
    </div>
  );
};

export default Banner;