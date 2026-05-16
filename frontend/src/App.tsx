import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { getCurrentUser } from "./features/auth/authAPI";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      getCurrentUser()
        .then((res) => {
          localStorage.setItem("role", res.role);
        })
        .catch(() => {
          localStorage.clear();
        });
    }
  }, []);

  return <AppRoutes />;
}

export default App;