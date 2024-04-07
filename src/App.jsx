import "./App.css";
import GameModal from "./components/GameModal";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import WordHunt from "./components/WordHunt";
import Banner from "./components/banner/Banner";

function App() {
  return (
    <div className="container">
      <Banner />
      <div className="title-container">
        <h1 className="title">Hive Arcade</h1>
        <p className="description">
          A decentralized game suite for Georgia Tech students
        </p>
      </div>
      <div className="modal-button">
        <GameModal
          id="WordHunt "
          title="Word Hunt"
          gameComponent={<WordHunt />}
        />
      </div>
      <div className="modal-button">
        <GameModal
          id="WordHunt"
          title="Tic-Tac-Toe"
          gameComponent={<TicTacToe />}
        />
      </div>
    </div>
  );
}

export default App;
