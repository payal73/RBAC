import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { BASE_URI } from "../../utils/common";

export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState({});
  console.log("token", token);
  const fetchUser = async () => {
    try {
      await axios
        .get(`${BASE_URI}/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data.user);
        });
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;

      console.log(serverMessage);
    }
  };
  useEffect(() => {
    if (token) fetchUser();
  }, [token]);

  return (
    <main className="flex flex-col gap-3 my-4 md:ml-6 max-w-2xl md:mr-auto mx-2">
      <h2 className="text-gray-600 font-bold text-2xl">
        User's Profile (Owners only)
      </h2>
      {user && (
        <div className="bg-gray-100 p-8 flex items-center gap-4 shadow-sm rounded-md">
          <div className="grow flex flex-col gap-2 text-gray-500">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl pl-2">{user.name}</h2>
            </div>

            <p>
              <span className="font-semibold">Email</span> : {user.email}
            </p>
            <p>
              <span className="font-semibold">Role</span> : {user.role}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
