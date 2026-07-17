import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto mb-6">
        Trailers
      </p>

      <div className="relative">
        <BlurCircle top="-100px" right="-100px" />

        <div className="max-w-[960px] mx-auto">
          <ReactPlayer
            src={currentTrailer.videoUrl}
            controls
            width="100%"
            height="540px"
          />
        </div>
      </div>
      
      <div className="max-w-[960px] mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {dummyTrailers.map((trailer, index) => (
          <img
            key={index}
            src={trailer.image}
            alt="Trailer"
            onClick={() => setCurrentTrailer(trailer)}
            className={`cursor-pointer rounded-lg border-2 transition-all duration-300 ${
              currentTrailer.videoUrl === trailer.videoUrl
                ? "border-red-500"
                : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
