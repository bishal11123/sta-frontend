import React from "react";
import { hiragana, katakana } from "../data/kanaData";
import KanaTable from "../components/KanaTable";

const KanaPractice = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Kana Practice</h1>
      <KanaTable title="Hiragana" kanaData={hiragana} type="hiragana" />
      <KanaTable title="Katakana" kanaData={katakana} type="katakana" />
    </div>
  );
};

export default KanaPractice;
