const express = require("express");
const ytdl = require("ytdl-core");
const app = express();
const PORT = process.env.PORT || 5173;

app.use(express.static("public"));
app.use(express.json());

app.post("/getinfo", async (req, res) =>{
  const{url} = req.body;
  try{
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({error: "Invalid URL"});
    }
    const info = await ytdl.getInfo(url);
    const formats = ytdl.filterFormats(info.formats, "audioandvideo");
    console.log(formats);

    const videoDetails = {
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbails[0].url,
      formats: formats.map((format) => ({
        quality: format.qualityLabel,
        url: format.url,
      })),
    };

    res.json(videoDetails);
  }catch(err){
    console.log(err);
    res.status(500).json({error: err.message});
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
