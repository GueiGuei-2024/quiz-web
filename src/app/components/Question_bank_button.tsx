import { useState } from "react";

type QuestionBankButtonProps = {
  name: string;
  onClick: (name: string) => void;
};

export default function QuestionBankButton({ name, onClick } : QuestionBankButtonProps) {
  const [selected, setSelected] = useState(true);
  const handleSelected = () => {
    setSelected(!selected);
    onClick(name);
  };

  return (
    <button
      id={name}
      key={name}
      onClick={() => handleSelected()}
      className={`px-3 py-1 rounded border  ${
        selected ? "bg-blue-500 text-white" : "bg-white"
      }`}
    >
      {name}
    </button>
  );
}
