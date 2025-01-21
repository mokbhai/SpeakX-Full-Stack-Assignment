import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loading.json";

function LoadingAnimation({ className = "" }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        style={{ width: 240, height: 240 }}
      />
    </div>
  );
}

export default LoadingAnimation;
