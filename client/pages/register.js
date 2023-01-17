import { useState,useContext,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link"
import { Context } from "../context";
import { useRouter } from "next/router";


const Register = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [user]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    setLoading(true);
    const { data } = await axios.post(`/api/register`, {
      username,
      firstName,
      lastName,
      email,
      password,
      gender
    });
    toast.success("Registration successful. Please login.");
    setLoading(false);
  }catch (err) {
    toast.error(err.response.data);
    setLoading(false);
  }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            className="form-control mb-4 p-4"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            required
          />
          <input
            type="text"
            className="form-control mb-4 p-4"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            required
          />
          <input
            type="text"
            className="form-control mb-4 p-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />

          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <select className="form-control mb-4 p-4" onChange={(e) => setGender(e.target.value)} id="gender" name="Gender">
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <button disabled={!username ||!firstName||!lastName ||!gender || !email || !password || loading} type="submit" className="btn btn-block btn-primary form-control mb-4 p-4">
          {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
        <p className="text-center ">
          Already registered?{" "}
          <Link legacyBehavior href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
