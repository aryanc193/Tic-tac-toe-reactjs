import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./WinnerAnimation.css";

const WinnerAnimation = ({ winner, onReset, onResetScore }) => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAnimation(false);
      onResetScore();
      onReset();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [winner, onReset, onResetScore]);

  return (
    showAnimation && (
      <div className="winner-animation">
        <div className="winner-popup">
          <img className="winimg" src="/winimg.png" alt="partypop"></img>
          <h2>{`WINNER is ${winner}!!!`}</h2>
        </div>
      </div>
    )
  );
};
WinnerAnimation.propTypes = {
  winner: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  onResetScore: PropTypes.func.isRequired,
};

export default WinnerAnimation;
