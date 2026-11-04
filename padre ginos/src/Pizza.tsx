import React from "react";

interface Props {
  name: string;
  description: string;
  image?: string;
}
const Pizza = (props: Props) => {
  return (
    <div className="my-2.5 flex flex-col items-center justify-center leading-normal">
      <h1 className="text-[25px] font-normal text-secondary">{props.name}</h1>
      <p className="mb-1.25">{props.description}</p>
      <img
        className="max-w-50 rounded-[5px] border border-border"
        src={props.image ? props.image : "https://picsum.photos/200"}
        alt={props.name}
      />
    </div>
  );
};

export default Pizza;


// px ÷ 4 = angka Tailwind, jadi 5px → mb-1.25 dan 200px → max-w-50.
// text-[25px] memakai arbitrary value karena 25px tidak ada di skala.
// Di flex-col, justify-center mengatur arah vertikal dan items-center mengatur horizontal.