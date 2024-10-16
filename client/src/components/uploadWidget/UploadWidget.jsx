import { createContext, useEffect, useState } from "react";

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext();

function UploadWidget({ uwConfig, setPublicId ,setState }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Function to load the script
    const loadScript = () => {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        setLoaded(true);
      }
    };

    // Load script on mount
    loadScript();

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.getElementById("uw");
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      const myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            setState(prev=>[...prev,result.info.secure_url])

        }
    }
      );

      const widgetButton = document.getElementById("upload_widget");
      const handleClick = () => {
        myWidget.open();
      };

      widgetButton.addEventListener("click", handleClick);

      // Cleanup the event listener on unmount
      return () => {
        widgetButton.removeEventListener("click", handleClick);
      };
    }
  }, [loaded, uwConfig, setPublicId]);

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button id="upload_widget" className="cloudinary-button">
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
