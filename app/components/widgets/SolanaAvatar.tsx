import { bottts } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useAvatarUrl } from "@/app/hooks/useData";

import { clx } from "@/app/utils/helpers";
import { useEffect, useMemo, useState } from "react";

interface SolanaAvatarProps {
	address: string;
	className?: string;
	imageUrl?: string;
}

export const SolanaAvatar: React.FC<SolanaAvatarProps> = ({
	address,
	className,
	imageUrl,
}) => {
	const avatar = useMemo(
		() =>
			createAvatar(bottts, {
				seed: address,
				size: 100,
			}),
		[address],
	);

	const dataUri = useMemo(() => avatar.toDataUri(), [avatar]);
	const avatarUrl = useAvatarUrl(imageUrl);

	return (
		<div
			className={clx(
				"h-10 w-10",
				"overflow-hidden rounded-full border-2 border-gray-400 bg-gray-300",
				className,
			)}
		>
			<img
				className='size-full'
				src={avatarUrl || dataUri}
				alt='Solana Avatar'
			/>
		</div>
	);
};
