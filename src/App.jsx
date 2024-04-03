import "./App.css";
import GameModal from "./components/GameModal";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import WordHunt from "./components/WordHunt";

function App() {
  return (
    <>
      <div>
        <p>This will be the landing page for the application</p>
      </div>
      <GameModal
        id="WordHunt "
        title="Word Hunt"
        gameComponent={<WordHunt />}
      />
      <GameModal
        id="WordHunt"
        title="TicTacToe"
        gameComponent={<TicTacToe />}
      />
    </>
  );
}

export default App;
