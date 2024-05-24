document.getElementById("fetchInfo").addEventListener("click", async () => {
  const url = document.getElementById("url").value;
  const errorElement = document.getElementById("error");
  errorElement.textContent = "";

  try {
    const response = await fetch("/getInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById("videoDetails").style.display = "block";
      document.getElementById("thumbnail").src = data.thumbnail;
      document.getElementById("title").textContent = data.title;

      const formatsDiv = document.getElementById("formats");
      formatsDiv.innerHTML = "";

      data.formats.forEach((format) => {
        const button = document.createElement("button");
        button.textContent = `Download ${format.quality}`;
        button.onclick = () => {
          downloadVideo(format.url, data.title);
        };
        formatsDiv.appendChild(button);
      });
    } else {
      const data = await response.json();
      errorElement.textContent = data.error;
    }
  } catch (error) {
    console.error(error);
    errorElement.textContent = "An error occurred. Please try again.";
  }
});

const downloadVideo = (url, title) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title}.mp4`;
  a.click();
};
