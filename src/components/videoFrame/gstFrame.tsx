import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import useWindowDimensions from "../../utils/WindowSize";
import ErrorToast from "../toast/errorToast";
import { invoke } from "@tauri-apps/api";

export default function VidPlayer() {
  const { height, width } = useWindowDimensions();
  const [url, seturl] = useState("");
  const [streamUrl, setStreamUrl] = useState(null || "");
  const [isConnected, setIsConnected] = useState(false);

  const prevErrorRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDismissErrorToast = () => {
    setError(null);
  };
  async function get_url() {
    try {
      await fetch(url)
        .then((res) => {
          if (res.status === 200) {
            setIsConnected(true);
            return res;
          }
        })
        .catch(() => {
          setIsConnected(false);

          throw new Error(
            "The provided URL is not valid or the stream is down"
          );
        });
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        throw new Error("Please enter a valid URL");
      }
      setStreamUrl(url);
      setIsConnected(true);
      setError("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setIsConnected(false);
      setError("An error occurred: " + err.message);
      handleDisconnect();
      handlePlayerError(err.message);
    }
  }

  const handlePlayerError = (error: unknown) => {
    setIsConnected(false);
    setError("An error occurred: " + error);
  };

  function HandleUrlChanged(e: React.ChangeEvent<HTMLInputElement>) {
    seturl(e.target.value);
  }

  function handleDisconnect(): void {
    setIsConnected(false);
    setStreamUrl(null);
    if (error && error !== prevErrorRef.current) {
      setError("");
    }
    prevErrorRef.current = error;
  }

  return (
    <>
      <div className="flex h-full w-full justify-center items-center">
        <ReactPlayer
          playing={isConnected}
          className="flex mx-16 mt-16"
          url={streamUrl}
          width={width}
          height={height - 150}
          controls={false}
          onError={handlePlayerError}
        />
      </div>
      <div className="w-full flex justify-center items-center pb-1 mt-6">
        <button
          onClick={handleDisconnect}
          type={"button"}
          className="dark:text-text-dark text-text-light bg-accent-color1-700 hover:bg-accent-color1-800 ml-16 font-bold py-2 px-4 rounded"
        >
          Disconnect
        </button>
        <div className="mx-4 dark:text-text-dark text-text-light flex-1">
          <input
            className="w-full border-2 border-gray-400 rounded items-center mt-1 py-2 mb-2 px-4"
            type="text"
            placeholder="Stream URL"
            onChange={HandleUrlChanged}
          />
        </div>
        <button
          onClick={get_url}
          type={"button"}
          className="bg-accent-color1-700 hover:bg-accent-color1-800 mr-16 font-bold py-2 px-4 rounded"
        >
          Connect to Stream
        </button>
      </div>

      {error && (
        <ErrorToast
          message={error}
          timer={5000}
          onDismiss={handleDismissErrorToast}
        />
      )}
    </>
  );
}