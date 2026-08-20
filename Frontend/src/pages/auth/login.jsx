import axios from "axios";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BASE_URI } from "../../utils/common";
import { useAuth } from "../../context/AuthContext";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const validateForm = () => {
    let error = {};
    if (!email) {
      error.email = "Please enter your email!";
    } else if (!emailRegex.test(email)) {
      error.email = "This is not a valid email!";
    }
    if (!password) {
      error.password = "Please enter your email!";
    } else if (password.length < 4) {
      error.password = "Password must be at least 4 characters long!";
    }

    setError(error);
    return !Object.keys(error).length;
  };
  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    if (validateForm) {
      try {
        await axios
          .post(
            `${BASE_URI}/login`,
            { email, password },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          )
          .then(async (res) => {
            console.log("res,", res);
            login(res.data.token, res.data.user);
            setSuccess(res.message);
            const order = await axios.post(
              `${BASE_URI}/create-order`,
              {
                amount: 100,
                currency: "INR",
                receipt: "receicpt_1",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${res.data.token}`,
                },
                withCredentials: true,
              }
            );
            const { data } = order;
            // Open Razorpay Checkout
            console.log(data);
            const options = {
              key: data.key_id, // Replace with your Razorpay key_id
              amount: data.order.amount, // Amount is in currency subunits.
              currency: "INR",
              name: "Acme Corp",
              description: "Test Transaction",
              order_id: data.order.id, // This is the order_id created in the backend
              prefill: {
                name: "Gaurav Kumar",
                email: "gaurav.kumar@example.com",
                contact: "9999999999",
              },
              theme: {
                color: "#F37254",
              },
            };

            const rzp = new Razorpay(options);
            rzp.open();

            // navigate("/profile");
          });
      } catch (err) {
        const serverMessage = err.response?.data?.message || err.message;
        setError(serverMessage);
        console.log(serverMessage);
      }
    }
  };

  return (
    <main className="h-4/5 flex justify-center items-center">
      <form
        className="min-w-96 bg-gray-100 flex flex-col justify-center items-center gap-5 py-12 px-10 shadow-xl"
        onSubmit={handleSubmit}
      >
        {error && (
          <p className="w-full bg-red-800 text-white p-2 text-center text-xs my-1">
            {error}
          </p>
        )}{" "}
        {success && (
          <p className="w-full bg-green-700 text-white p-2 text-center text-xs my-1">
            {success}
          </p>
        )}
        <div className="w-full">
          <input
            className="w-full py-3 px-5 text-gray-500 border-none"
            type="email"
            name="email"
            id="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full">
          <input
            className="w-full py-3 px-5 text-gray-500 border-none"
            type="password"
            name="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="w-full">
          <button
            type="submit"
            className="w-full py-3 px-5 bg-blue-900 hover:bg-blue-700 text-white"
          >
            LOGIN
          </button>
        </div>
        <p>
          Not registered?{" "}
          <Link to="/signup" className="text-blue-900 hover:text-blue-700">
            Create An Account
          </Link>
        </p>
      </form>
    </main>
  );
}
