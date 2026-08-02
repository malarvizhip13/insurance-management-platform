import { useEffect, useState } from "react";
import { supabase } from "../services/config";

function Navbar() {
  const [user, setUser] = useState("");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUser(user.email);
    }
  };

  return (
    <div
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2>Insurance Management Platform</h2>
      </div>

      <div>
        <strong>Welcome :</strong> {user}
      </div>
    </div>
  );
}

export default Navbar;