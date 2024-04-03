import "./App.css";
import TicTacToe from "./components/tic-tac-toe/ticTacToe";
import WordHuntModal from "./components/WordHuntModal";

function App() {
  return (
    <>
      <TicTacToe />
      <div>
        <p>This will be the landing page for the application</p>
      </div>
      <button>Game 1</button>
      <WordHuntModal />
    </>
  );
}

export default App;
