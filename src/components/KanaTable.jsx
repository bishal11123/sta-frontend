import React from "react";

const KanaTable = ({ title, kanaData, type }) => {
  const playSound = (audioFile) => {
    const audio = new Audio(`/audio/${type}/${audioFile}`);
    audio.play();
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-5 gap-4">
        {kanaData.map((kana, index) => (
          <button
            key={index}
            className="border p-4 rounded text-xl hover:bg-blue-100"
            onClick={() => playSound(kana.audio)}
          >
            <div>{kana.char}</div>
            <div className="text-sm text-gray-500">{kana.romaji}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default KanaTable;
