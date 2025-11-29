import './App.css'
import TicTacToeGame from "./tic-tac-toe.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
      <QueryClientProvider client={queryClient}>
        <TicTacToeGame/>
      </QueryClientProvider>
  )
}

export default App
