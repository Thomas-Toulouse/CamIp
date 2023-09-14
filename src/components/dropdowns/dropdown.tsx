import { useState } from "react";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import { IDropdown } from "../../interfaces/IDropdown";

function Dropdown({ options, value, onChange, className }: IDropdown) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Define the default class and allow it to be overridden by the parent
  const dropdownClass =
    "appearance-none py-2 pl-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 " +
    className;

  return (
    <div className="relative mx-2  inline-block">
      <select className={dropdownClass} value={value} onChange={onChange}>
        {options.map((option, index) => (
          <option
            onClick={toggleDropdown}
            key={index}
            value={option.toString()}
          >
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        {isOpen ? <RxCaretUp color="white" /> : <RxCaretDown color="white" />}
      </div>
    </div>
  );
}

export default Dropdown;
