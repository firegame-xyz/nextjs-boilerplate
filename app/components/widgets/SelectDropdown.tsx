// import { useWallet } from "@solana/wallet-adapter-react";
// import { useWalletModal } from "@solana/wallet-adapter-react-ui";
// import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

// import { copyToClipboard } from "@/app/utils/helpers";

// import { ButtonPrimary } from "../buttons/Button";
import { SelectIcon } from "../icons/Icon";

interface SelectProps {
	round: number;
	handleCallBack?: (round: number) => void;
}

// interface Props {
// 	address: string;
// }

// const CopyComponent: React.FC<Props> = ({ address }) => {
// 	const [isCopied, setIsCopied] = useState(false);

// 	const handleClick = async () => {
// 		const result = await copyToClipboard(address);
// 		setIsCopied(result);

// 		let timer: NodeJS.Timeout;
// 		timer = setTimeout(() => {
// 			clearTimeout(timer);
// 			setIsCopied(false);
// 		}, 3000);
// 	};

// 	return (
// 		<div onClick={handleClick}>{isCopied ? "Copied" : "Copy Address"}</div>
// 	);
// };

const SelectDropdown: React.FC<SelectProps> = ({ round, handleCallBack }) => {
	// const { setVisible } = useWalletModal();
	// const { connected, publicKey, disconnect } = useWallet();
	const [isOpen, setIsOpen] = useState(false);
	const [selectValue, setSelectValue] = useState<number>(round);
	const ref = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	const handleItem = (round: number) => {
		setSelectValue(round);
		setIsOpen(false);
		if (handleCallBack) {
			handleCallBack(round);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});

	return (
		<div ref={ref} className='relative z-50 inline-block text-left'>
			<div
				className='flex w-28 cursor-pointer justify-between rounded-md border border-gray-600 py-1 pl-2 text-xs text-base-white'
				id='options-menu'
				aria-haspopup='true'
				aria-expanded='true'
				onClick={() => setIsOpen(!isOpen)}
			>
				{`Round ${selectValue}`}
				<SelectIcon />
			</div>
			{isOpen && (
				<div
					className='absolute right-0 mt-2 w-full origin-top-right overflow-hidden rounded-md border border-gray-700 bg-gray-800 text-xs shadow-lg'
					role='menu'
					aria-orientation='vertical'
					aria-labelledby='options-menu'
				>
					{Array.from({ length: round }, (_, index) => (
						<div
							key={index}
							className='block cursor-pointer px-2 py-1 text-gray-200 hover:bg-gray-200 hover:text-gray-900'
							role='menuitem'
							onClick={() => handleItem(round - index)}
						>
							{`Round ${round - index}`}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SelectDropdown;
