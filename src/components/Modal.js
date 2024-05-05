import React from "react";
import { RxCross1 } from "react-icons/rx";

const Modal = ({ msg, setIsModalOpen, isModalMsgPositive }) => {
  return (
    <div className="w-screen h-screen absolute z-10 flex justify-center">
      <div className="px-2 py-4 w-[20rem] h-[8rem] fixed border border-black mt-[8rem] flex flex-col justify-center items-end rounded-lg">
        <button
          className="border border rounded-[5rem] p-1"
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          <RxCross1 />
        </button>
        <span
          className={
            isModalMsgPositive
              ? "w-full h-[calc(90%)] px-2 font-semibold flex justify-center items-center text-[#3CFF31]"
              : "w-full h-[calc(90%)] px-2 font-semibold flex justify-center items-center text-[#FF0000]"
          }
        >
          {msg}
        </span>
      </div>
    </div>
  );
};

export default Modal;
