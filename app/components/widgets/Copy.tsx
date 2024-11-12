import { copyToClipboard } from "@/app/utils/helpers";
import { useState } from "react";
import { CopyIcon } from "../icons/Icon";

interface Props {
	address: string;
	startText?: string;
	endText: string;
}

const CopyComponent: React.FC<Props> = ({ address, startText, endText }) => {
	const [isCopied, setIsCopied] = useState(false);

	const handleClick = async () => {
		const result = await copyToClipboard(address);
		setIsCopied(result);

		let timer: NodeJS.Timeout;
		timer = setTimeout(() => {
			clearTimeout(timer);
			setIsCopied(false);
		}, 3000);
	};

	return (
		<div onClick={handleClick}>
			{isCopied
				? endText
				: (startText ?? <CopyIcon className='w-4 cursor-pointer' />)}
		</div>
	);
};

export default CopyComponent;
