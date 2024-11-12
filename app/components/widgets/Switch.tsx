import React from "react";

interface SwitchProps {
	isOn: boolean;
	disabled?: boolean;
	handleToggle: () => void;
}

const Switch: React.FC<SwitchProps> = ({ isOn, disabled, handleToggle }) => {
	return (
		<button
			className={`flex h-4 w-8 cursor-pointer items-center rounded-full p-1 transition-all duration-300 ${
				isOn ? "bg-blue" : "bg-gray-300"
			}`}
			disabled={disabled}
			onClick={handleToggle}
		>
			<div
				className={`size-3 rounded-full shadow-md transition-transform duration-300 ${
					isOn ? "translate-x-3 bg-gray-300" : "bg-gray-600"
				}`}
			/>
		</button>
	);
};

export default Switch;
