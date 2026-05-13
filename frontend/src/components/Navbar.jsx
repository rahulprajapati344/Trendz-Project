import { setUser } from "@/redux/userSlice";
import { Button } from "@base-ui/react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const {user}= useSelector(store=>store.user)
  const accessToken = localStorage.getItem("accessToken");
  const dispatch= useDispatch()
  const navigate= useNavigate() 

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setUser(null))
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="bg-white fixed w-full z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        <div>
          <img src="/Ekart.png" alt="" className="w-[100px]" />
        </div>
        <nav className="flex gap-10 justify-between items-center">
          <ul className="flex gap-7 items-center text-xl font-semibold">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/products"}>
              <li>Products</li>
            </Link>
            {user && (
              <Link to={`/profile/${user._id}`}>
                <li>Hello, {user.firstName}</li>
              </Link>
            )}
          </ul>
          <Link to={"/cart"} className="relative">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2">
              0
            </span>
          </Link>
          {user ? (
            <Button onClick={logoutHandler} className="bg-pink-500 text-white cursor-pointer  px-4 py-1.5 rounded-md hover:bg-pink-700 transition">
              Logout
            </Button>
          ) : (
            <Button onClick={()=>navigate("/login")} className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer px-4 py-1.5 rounded-md hover:opacity-90 transition">
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
