import Home from "./Pages/Home";
import User from "./Pages/User";
import { Routes, Route } from "react-router-dom";
import UserContext from "./context/UserContext";
import { useState } from "react";

function App() {
  const [value, setValue] = useState({ id: 1 });
  return (
    <div className="App">
      <UserContext.Provider value={{ value, setValue }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
