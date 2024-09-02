import { FlightsList } from "./pages/FlightsList.tsx";
import { SearchFlightForm } from "./pages/SearchFlightForm.tsx";
import { NotFound } from "./pages/NotFound.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {

    return (
        <BrowserRouter>
            <div className="container mx-auto">
                <Routes>
                    <Route path="*" element={<NotFound />}/>
                    <Route path="/" element={<SearchFlightForm />}/>
                    <Route path="/flight-offers" element={<FlightsList />}/>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
