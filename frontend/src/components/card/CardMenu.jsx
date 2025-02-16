import React from "react";
import Dropdown from "components/dropdown";
import { AiFillEdit } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";

function CardMenu({ onEdit, onDelete, transparent }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dropdown
      button={
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center text-xl hover:cursor-pointer ${
            transparent
              ? "bg-none text-white hover:bg-none active:bg-none"
              : "bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100"
          } linear justify-center rounded-lg font-bold transition duration-200`}
        >
          <BsThreeDots className="h-6 w-6" />
        </button>
      }
      animation={"origin-top-right transition-all duration-300 ease-in-out"}
      classNames={`${transparent ? "top-8" : "top-11"} right-0 w-max`}
      children={
        <div className="z-50 w-max rounded-xl bg-white py-3 px-4 text-sm shadow-xl">
          <p onClick={onEdit} className="flex cursor-pointer items-center gap-2 text-gray-600 hover:font-medium">
            <AiFillEdit />
            Edit
          </p>
          <p onClick={onDelete} className="mt-2 flex cursor-pointer items-center gap-2 pt-1 text-gray-600 hover:font-medium">
            <AiFillDelete />
            Delete
          </p>
        </div>
      }
    />
  );
}

export default CardMenu;
