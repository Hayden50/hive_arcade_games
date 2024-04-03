import "./App.css";
import GameModal from "./components/GameModal";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import WordHunt from "./components/WordHunt";

function App() {
  return (
    <div className="container">
      <div>
        <h1 className="title">Hive Arcade</h1>
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
