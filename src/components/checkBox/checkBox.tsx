import { FaCheck } from "react-icons/fa";

import ICheckbox from "../../interfaces/ICheckbox";
import { ChangeEvent } from "react";

export default function Checkbox({
    checked,
    onChange,
    value,
    className
}: ICheckbox) {
    const checkboxClassname =
        "outline-none outline-2 focus:outline-accent-color1-700 text-text-dark w-4 h-4 border border-gray-400 rounded-sm transition duration-100 mx-2 ease-in-out " +
        className;

    const handleCheckboxChange = () => {
        // Toggle the checked state and call the onChange callback
        onChange(!checked as unknown as ChangeEvent<HTMLInputElement>);
    };

    return (
        <div className="cursor-pointer flex items-center">
            <input
                type="checkbox"
                className="hidden"
                //className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid  border-gray-400 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:bg-accent-color1-700 checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-accent-color1-700 dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"        checked={checked}
                onChange={handleCheckboxChange}
                value={value}
            />
            <div
                onClick={handleCheckboxChange}
                className={`${checkboxClassname} ${
                    checked ? "bg-accent-color1-700" : "bg-window-dark-300"
                }`}
            >
                {checked && (
                    <FaCheck
                    data-testid="checkbox-checked-icon"
                        size={14}
                        className="font-bold dark:text-text-dark text-text-light"
                    />
                )}
            </div>
        </div>
    );
}
