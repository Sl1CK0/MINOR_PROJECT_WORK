import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { StyledSignup } from "./style";
import { registerFace } from "../../api/faceRecogonitionAPI";
import Header from "../Header";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // Capture image from webcam
  const captureImage = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const blob = await fetch(imageSrc).then((res) => res.blob());
      return new File([blob], "capture.jpg", { type: "image/jpeg" });
    }
    return null;
  };

  // Handle registration and face capture
  const handleRegister = async (event) => {
    event.preventDefault();
    if (!name || !rollNo || !role || !username || !password) {
      setError("Please fill in all details.");
      return;
    }
    setError(null);
    setIsWebcamActive(true);
  };

  // Submit registration with captured image
  const submitRegistration = async () => {
    setLoading(true);
    const imageFile = await captureImage();

    if (imageFile) {
      const result = await registerFace(imageFile, name, rollNo, role, username, password);
      if (result.error) {
        setError(result.error);
      } else {
        alert(result.message || "Registration successful!");
        navigate("/login"); // Redirect to login page after successful signup
      }
    } else {
      setError("Failed to capture image.");
    }
    setLoading(false);
    setIsWebcamActive(false);
  };

  return (
    <StyledSignup>
      <Header />
      <div className="container">
        <h2>Signup</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rollNo">Roll No:</label>
            <input
              type="text"
              id="rollNo"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register Face</button>
        </form>

        {isWebcamActive && (
          <div>
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
            <button onClick={submitRegistration} disabled={loading}>
              {loading ? "Registering..." : "Capture & Register"}
            </button>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </StyledSignup>
  );
};

export default SignupPage;
