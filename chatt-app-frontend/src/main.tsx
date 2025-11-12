import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ChatRoom from "./components/chatRoom/chatRoom.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path={"/"} element={<ChatRoom/>}/>
        </Routes>
    </BrowserRouter>
)
