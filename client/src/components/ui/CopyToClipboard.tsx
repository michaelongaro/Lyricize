import { useEffect, useState, useContext } from "react";

import SpotifyContext from "../../context/SpotifyContext";

import classes from "./CopyToClipboard.module.scss";

type Props = {};

let currentURI = import.meta.env.VITE_CURRENT_URL;

const CopyToClipboard = ({}: Props) => {
  const spotifyCtx = useContext(SpotifyContext);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  function CopyToClipboard() {
    if (spotifyCtx) {
      navigator.clipboard.writeText(`${currentURI}/?user=${spotifyCtx.userID}`);
    }
  }

  return (
    <button
      onClick={() => {
        setCopied(true);
        CopyToClipboard();
      }}
      style={{ gap: "0.75em", backgroundColor: "#1db954" }}
      className={`${classes.copyToClipboardButton} baseFlex`}
    >
      <div
        style={{
          position: "relative",
          height: 16,
          width: 16,
        }}
      >
        <Clippy
          style={{
            color: "#FFF",
            position: "absolute",
            top: 0,
            left: 0,
            strokeDasharray: 50,
            strokeDashoffset: copied ? -50 : 0,
            transition: "all 300ms ease-in-out",
          }}
        />

        <Check
          style={{
            color: "#1ddb48",
            position: "absolute",
            top: 0,
            left: 0,
            strokeDasharray: 50,
            strokeDashoffset: copied ? 0 : -50,
            transition: "all 300ms ease-in-out",
          }}
        />
      </div>
    </button>
  );
};

export default CopyToClipboard;

type TClippy = {
  style: Object;
};

const Clippy = (props: TClippy) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5.75 4.75H10.25V1.75H5.75V4.75Z" />
      <path d="M3.25 2.88379C2.9511 3.05669 2.75 3.37987 2.75 3.75001V13.25C2.75 13.8023 3.19772 14.25 3.75 14.25H12.25C12.8023 14.25 13.25 13.8023 13.25 13.25V3.75001C13.25 3.37987 13.0489 3.05669 12.75 2.88379" />
    </svg>
  );
};

type TCheck = {
  style: Object;
};

const Check = (props: TCheck) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M13.25 4.75L6 12L2.75 8.75" />
    </svg>
  );
};
