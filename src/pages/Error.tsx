import React from "react";
import { useNavigate } from "react-router-dom";
import BackgroundCompiler from "../components/BackgroundCompiler";
import Button from "../components/Button";

const Error: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <>
      <BackgroundCompiler />
      <div className="min-h-screen w-full flex flex-col items-center text-center justify-center p-4 text-white bg-black/70">
        <h1 className="text-6xl font-bold mb-4">oops!</h1>
        <p className="text-xl mb-8">
          something went wrong. please try again later.
        </p>
        <div onClick={handleGoHome}>
          <Button label="go to home" />
        </div>
      </div>
    </>
  );
};

export default Error;
