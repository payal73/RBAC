
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from 'axios'
import { BASE_URI } from "../../utils/common";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default function Signup() {
 const navigate =  useNavigate()
 const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [confirmPassword, setConfirmPassword] = useState('')
const [error, setError] = useState('')
const [success, setSuccess] = useState('')
const [formErrors, setFormErrors] = useState({
    name:'',email:'',password:'',confirmPassword:''
})
const [loading, setLoading] = useState(false)
const validateForm = (key, value) =>{
    let error = {[key]:''}
    if(key === 'name' && !value){
        error.name = 'Please enter your name!'
    }
   else if( key === 'name' && value.length < 3){
        console.log("111111111")
        error.name = 'name should greater than 3 character!'
    }

   else if(key === 'email' && !value){
        error.email='Please enter your email!'
    }
    else  if(key === 'email' && !emailRegex.test(value)){
        error.email="This is not a valid email!"
    }
    else if(key === 'password' &&!value){
        error.password='Please enter your email!'
    }
     else if(key === 'password' && value.length <4){
        error.password="Password must be at least 4 characters long!"
    }
    
   else if(key === 'confirmPassword' && !value){
        error.confirmPassword='Please enter your confirm password'
    }
  else  if(key === 'confirmPassword' && value !== password){
        error.confirmPassword="Passwords don't match!"
    }
    
        setFormErrors({...formErrors,[key]:error[key]})
        
    
}
const handleSubmit  = async (e) => {
    e.preventDefault()
    
    console.log(formErrors,name.length)
    
    
    // setLoading(true)
// return false
const formData = {name,email,password}

const isFormValidate = !Object.keys(formErrors).some(key => formErrors[key]);
if (isFormValidate){
  setLoading(true)
    try{
      await axios.post(`${BASE_URI}/signup`,
formData,{  headers: {
  'Content-Type': 'application/json'},withCredentials:true}
      ).then(res=>{
        setLoading(false)
        setSuccess(res.message)
        navigate('/login')
      })
    }catch(err){
      setLoading(false)
      const serverMessage = err.response?.data?.message || err.message;
     setError(serverMessage);
      console.log(serverMessage)
    }
    
}

}

  return (
    <main className="my-8 flex justify-center items-center">
      {
        loading ? <div>Loading............</div>:
      
        <form
          onSubmit={handleSubmit}
          className="min-w-96 bg-gray-100 flex flex-col justify-center items-center gap-5 py-12 px-10 shadow-xl"
        >
          {error && (
            <p className="w-full bg-red-800 text-white p-2 text-center text-xs my-1">
              {error}
            </p>
          )} 
           {success && (
            <p className="w-full bg-green-700 text-white p-2 text-center text-xs my-1">
              {success}
            </p>
          )}
          <div className="w-full">
            <input
              className="w-full py-3 px-5 text-gray-500 border-none"
              type="text"
              name="name"
              id="name"
              placeholder="name"
              value={name}
              onChange={(e) => {setName(e.target.value); validateForm('name',e.target.value)}}
            />
            {formErrors.name && (
              <p className="w-full bg-red-800 text-white p-2 text-center text-xs mb-1">
                {formErrors.name}
              </p>
            )}
          </div>
          <div className="w-full">
            <input
              className="w-full py-3 px-5 text-gray-500 border-none"
              type="email"
              name="email"
              id="email"
              placeholder="email"
              value={email}
              onChange={(e) => {setEmail(e.target.value);validateForm('email',e.target.value)}}
            />
            {formErrors.email && (
              <p className="w-full bg-red-800 text-white p-2 text-center text-xs mb-1">
                {formErrors.email}
              </p>
            )}
          </div>
          
          <div className="w-full">
            <input
              className="w-full py-3 px-5 text-gray-500 border-none"
              type="password"
              name="password"
              id="password"
              placeholder="password"
              value={password}
              onChange={(e) => {setPassword(e.target.value);validateForm('password',e.target.value)}}
            />
            {formErrors.password && (
              <p className="w-full bg-red-800 text-white p-2 text-center text-xs mb-1">
                {formErrors.password}
              </p>
            )}
          </div>
          <div className="w-full">
            <input
              className="w-full py-3 px-5 text-gray-500 border-none"
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="confirm Password"
              value={confirmPassword}
              onChange={(e) => {setConfirmPassword(e.target.value);validateForm('confirmPassword',e.target.value)}}
            />
            {formErrors.confirmPassword && (
              <p className="w-full bg-red-800 text-white p-2 text-center text-xs mb-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
          <div className="w-full">
            <button
              type="submit"
              className="w-full py-3 px-5 bg-blue-900 hover:bg-blue-700 text-white"
            >
              SIGN UP
            </button>
          </div>
          <p>
            Already have An Account?{" "}
            <Link to="/login" className="text-blue-900 hover:text-blue-700">
              Log In now!
            </Link>
          </p>
        </form>
}
    </main>
  );
}