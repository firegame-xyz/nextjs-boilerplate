import Image from "next/image";
import Link from "next/link";
import { DiscordIcon, TelegramIcon, TwitterIcon } from "./icons/Icon";

export default function Footer() {
	return (
		<div className='flex justify-between p-5 sm:justify-start bg-base-black'>
			<div className='w-full flex flex-col text-xs justify-center items-center'>
				<span>
					<Link
						href='/legalDisclaimer'
						className='text-warning underline'
					>{`Legal Disclaimer`}</Link>
				</span>
				<div className='flex items-center gap-2 mt-3'>
					<TwitterIcon className='h-4' />
					<TelegramIcon className='h-6' />
					<DiscordIcon className='h-6' />
				</div>

				<div className='flex gap-2 mt-3'>
					<div className='w-16'>
						<Image
							alt='logo'
							src={"/images/logo.png"}
							priority
							width={176}
							height={46}
						/>
					</div>
					<div>{`©2024 Fire Game. All Rights Reserved.`}</div>
				</div>
				<div className='text-base-black mt-3 px-2 bg-warning'>
					{`You must be 18 or older to continue. Exit now if underage!`}
				</div>
			</div>
		</div>
	);
}
