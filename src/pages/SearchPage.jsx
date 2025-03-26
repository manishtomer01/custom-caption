import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${searchQuery}`,
        {
          headers: {
            Authorization:
              "qIQitygDSximKzfvzEiA46Nyq5UBRzVLGYD57VhN95pxxWmKuy4YFhXP",
          },
        }
      );
      setImages(response.data.photos);
    } catch (error) {
      console.error("Error fetching images", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Image Search</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={fetchImages}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative">
            <img
              src={img.src.medium}
              alt="preview"
              className="cursor-pointer rounded-lg shadow-lg"
            />
            <button
              className="absolute bottom-2 left-2 bg-white p-1 rounded shadow"
              onClick={() =>
                navigate("/edit", { state: { imageUrl: img.src.large } })
              }
            >
              Add Captions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
