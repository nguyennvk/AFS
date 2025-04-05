"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageWidgetProps {
  images: string[];
}

export default function ImageWidget({ images }: ImageWidgetProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div>
      {/* Scrollable Image Container */}
      <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide">
        {images.map((dir, index) => (
          <div key={index} className="flex-shrink-0">
            <Image
              src={dir || "/default/hotel.jpg"}
              alt={`Image ${index + 1}`}
              width={200}
              height={200}
              className="w-48 h-48 object-cover rounded-lg cursor-pointer shadow-lg transition-transform duration-200 hover:scale-105"
              onClick={() => setSelectedImage("/" + dir)}
            />
          </div>
        ))}
      </div>

      {/* Zoomed Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <Image src={selectedImage} alt="Zoomed Image" width={600} height={600} className="w-[500px] h-[500px] object-cover rounded-lg shadow-xl" />
            <button
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded-full shadow-lg hover:bg-gray-200 transition duration-200 cursor-pointer"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
