import axios from "axios";
import React, { useState } from "react";
import { api } from "../API/api";

export const TestImage = () => {
  const [file, setFile] = useState("");

  console.log(`${process.env.REACT_APP_API_BASE_URL}`);

  const btnHandler = async () => {
    // await axios.post("http://localhost:2000/upload", {});
    await api.post(`/upload`, {});
  };

  const handleChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);

    let preview = document.getElementById("imagepreview");
    preview.src = URL.createObjectURL(e.target.files[0]);
  };
  return (
    <div style={{ height: "900vh", paddingTop: "80px" }}>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos
        molestias placeat libero ad corporis. Doloremque quam aliquam provident
        quod dolores voluptatem molestias quas. Neque assumenda ea quia eum
        veritatis dolorem!
      </p>

      <div>
        <img id="imagepreview" alt="img" />
      </div>

      <input
        type="file"
        id="file"
        placeholder="Masukan gambar"
        onChange={(e) => handleChange(e)}
      />
      <img
        src="http://localhost:2000//Head Banner Soon Onn_1685690490922.png"
        alt="aerox"
      />
    </div>
  );
};
