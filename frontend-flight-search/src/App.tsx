import { Toaster } from "react-hot-toast";
import { SearchFlightForm } from "./components/SearchFlightForm.tsx";


function App() {

    return (
        <div className="">
            <SearchFlightForm />
            <Toaster />
        </div>
    )
}

export default App
