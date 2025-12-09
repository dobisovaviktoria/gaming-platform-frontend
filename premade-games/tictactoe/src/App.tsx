import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TicTacToeGame from "./original/TicTacToeGame.tsx";

const queryClient = new QueryClient();

function App() {

  return (
      <QueryClientProvider client={queryClient}>
        <TicTacToeGame/>
      </QueryClientProvider>
  )
}

export default App
