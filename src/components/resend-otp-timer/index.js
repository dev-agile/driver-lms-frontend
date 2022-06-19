import { useEffect, useState } from "react";
import { secondsToHms } from "../../helper-methods";
import styles from "./style.module.css";

const ResendOTPTimer = ({ seconds = 0, resendFn }) => {
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearTimeout(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  const _resendOTP = () => {
    setTimeLeft(seconds);
    resendFn();
  }

  return (
    <div>
      {timeLeft > 0 ? (
        <p className={styles.resend_parra}>
          Resend in <span>{secondsToHms(timeLeft)}</span>
        </p>
      ) : (
        <button style={{border: "none"}} className={styles.resend_parra} onClick={_resendOTP}>Resend OTP</button>
      )}
    </div>
  );
};

export default ResendOTPTimer;
