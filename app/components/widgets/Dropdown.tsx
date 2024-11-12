import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

import { formatAddress } from "@/app/utils/helpers";

import { ButtonPrimary } from "../buttons/Button";
import { MenuIcon } from "../icons/Icon";

import ConstructionWorkerSalariesBalance from "./ConstructionWorkerSalariesBalance";
import CopyComponent from "./Copy";

// interface Props {
//   address: string;
//   startText: string;
//   endText: string;
// }

// const CopyComponent: React.FC<Props> = ({ address, startText, endText }) => {
//   const [isCopied, setIsCopied] = useState(false);

//   const handleClick = async () => {
//     const result = await copyToClipboard(address);
//     setIsCopied(result);

//     let timer: NodeJS.Timeout;
//     timer = setTimeout(() => {
//       clearTimeout(timer);
//       setIsCopied(false);
//     }, 3000);
//   };

//   return <div onClick={handleClick}>{isCopied ? endText : startText}</div>;
// };

const Dropdown: React.FC = () => {
	const { setVisible } = useWalletModal();
	const { connected, publicKey, disconnect } = useWallet();
	const [isOpen, setIsOpen] = useState(false);
	const [baseUrl, setBaseUrl] = useState("");
	const ref = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});

	useEffect(() => {
		setBaseUrl(`${window.location.protocol}//${window.location.host}`);
	}, []);

	return (
		<div ref={ref} className='relative z-50 inline-block text-left'>
			<div className='hidden sm:block'>
				<ButtonPrimary
					className='rounded-lg'
					id='options-menu'
					aria-haspopup='true'
					aria-expanded='true'
					onClick={() => (connected ? setIsOpen(!isOpen) : setVisible(true))}
				>
					{connected ? formatAddress(publicKey?.toBase58()!) : "Connect"}
				</ButtonPrimary>
			</div>

			<div className='block sm:hidden'>
				<span
					id='options-menu'
					aria-haspopup='true'
					aria-expanded='true'
					onClick={() => (connected ? setIsOpen(!isOpen) : setVisible(true))}
				>
					<MenuIcon />
				</span>
			</div>

			{isOpen && (
				<div
					className='absolute right-0 mt-2 w-full min-w-[110px] origin-top-right overflow-hidden rounded-md border border-gray-700 bg-gray-800 text-xs shadow-lg'
					role='menu'
					aria-orientation='vertical'
					aria-labelledby='options-menu'
				>
					<div
						className='block cursor-pointer px-4 py-2 text-gray-200 sm:hidden'
						role='menuitem'
					>
						{formatAddress(publicKey?.toBase58()!)}
					</div>
					{/* <div
            className='block cursor-pointer px-4 py-2 text-gray-200'
            role='menuitem'
          >
            <div>{`Construction Worker Salaries`}</div>
            <ConstructionWorkerSalariesBalance />
          </div> */}
					{/* <div
            className='block cursor-pointer px-4 py-2 text-gray-200 hover:bg-gray-200 hover:text-gray-900'
            role='menuitem'
          >
            <CopyComponent
              address={`${baseUrl}?link_code=${publicKey?.toBase58()!}`}
              startText='Copy Invitation URL'
              endText='Copied'
            />
          </div> */}
					<div
						className='block cursor-pointer px-4 py-2 text-gray-200 hover:bg-gray-200 hover:text-gray-900'
						role='menuitem'
					>
						<CopyComponent
							address={publicKey?.toBase58()!}
							endText='Copied'
							startText='Copy Address'
						/>
					</div>
					<Link href={"/rpc"} onClick={() => setIsOpen(false)}>
						<div
							className='block cursor-pointer px-4 py-2 text-gray-200 hover:bg-gray-200 hover:text-gray-900'
							role='menuitem'
						>
							Change RPC
						</div>
					</Link>
					<Link href={"/profile"} onClick={() => setIsOpen(false)}>
						<div
							className='block cursor-pointer px-4 py-2 text-gray-200 hover:bg-gray-200 hover:text-gray-900'
							role='menuitem'
						>
							Profile
						</div>
					</Link>
					<Link href={"/history"} onClick={() => setIsOpen(false)}>
						<div
							className='block cursor-pointer px-4 py-2 text-gray-200 hover:bg-gray-200 hover:text-gray-900'
							role='menuitem'
						>
							History
						</div>
					</Link>
					<div
						className='block cursor-pointer px-4 py-2 text-gray-200 hover:bg-gray-200 hover:text-gray-900'
						role='menuitem'
						onClick={() => {
							setIsOpen(false);
							disconnect();
						}}
					>
						Disconnect
					</div>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
