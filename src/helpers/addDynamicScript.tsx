const addScript = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;

    script.onload = () => {
      console.log("Script loaded successfully");
      resolve(true);
    };

    script.onerror = () => {
      console.log("Script failed to load");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export default addScript;
