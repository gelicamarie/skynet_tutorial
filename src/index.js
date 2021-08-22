import { SkynetClient } from "skynet-js";

const client = new SkynetClient("https://siasky.net");
console.log(client);

window.createMediaPage = function (mainMediaFiles) {
  const files = [];
  for (let i = 0; i < mainMediaFiles.length; i++) {
    files.push(mainMediaFiles[i]);
  }

  const htmlMedia = files.map((file) => `<img src="${file.name}"><br/>`);

  // Establish the page content.
  /* eslint-disable */
  const pageContent = `
  <!doctype html>
  <html>
      <head>
          <meta charset=utf-8>
          <title>Skynet-Generated Webpage</title>
      <style>
        h1 {
          font-size: 48px;
          font-weight: 500;
          margin-top: 40px;
          margin-bottom: 10px;
        }
      </style>
    </head>
      <body>
      <center><h1>Check out your Media!</h1></center>
      ${htmlMedia}
      </body>
  </html>
  `;
  /* eslint-enable */

  const mediaFile = files.reduce((acc, file) => {
    return { ...acc, [file.name]: file };
  }, {});

  // Establish the index file in the directory.
  const mediaFolder = {
    "index.html": new File([pageContent], "index.html", { type: "text/html" }),
    ...mediaFile,
  };

  console.log(mediaFolder);

  // const directory = Object.values(mediaFolder).reduce((accumulator, file) => {
  //   const path = getRelativeFilePath(file);

  //   return { ...accumulator, [path]: file };
  // }, {});

  // console.log(directory);

  // Upload the media tip as a directory.
  try {
    (async () => {
      // Uploading the directory will return a skylink. The skylink is prefix
      // with 'sia:' to UX purposes
      const { skylink } = await client.uploadDirectory(
        mediaFolder,
        "mediaFolder"
      );
      // const a = await client.uploadFile(
      //   mediaFolder["index.html"],
      //   "index.html"
      // );

      console.log(skylink);
      // For the redirect link we want to trim the 'sia:' prefix so that the
      // link is https://siasky.net/<skylink hash>/
      const directLink =
        "https://siasky.net/" + skylink.replace("sia:", "") + "/";
      document.getElementById("mediaLink").href = directLink;
      document.getElementById("mediaLink").text = skylink;
    })();
  } catch (error) {
    alert(error);
  }
};
