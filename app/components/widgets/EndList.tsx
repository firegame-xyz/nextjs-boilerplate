"use client";

import { useAtom } from "jotai";
import { roundAtom } from "@/app/state";

import { formatAddress } from "@/app/utils/helpers";

import { SolanaAvatar } from "./SolanaAvatar";

export default function EndList() {
	const [round] = useAtom(roundAtom);

	return (
		<div className='widget-base flex grow flex-col'>
			<div className='flex flex-col overflow-auto p-5'>
				<div className='h-0 max-h-full min-h-[300px]'>
					{round && round?.lastActiveParticipants.length > 0 ? (
						round?.lastActiveParticipants.map((item, index) => (
							<div
								key={index}
								className='flex items-center gap-8 border-b border-gray-800/40 py-2.5 text-xs'
							>
								<span>{index < 9 ? `0${index + 1}` : index + 1}</span>
								<span>
									<SolanaAvatar address={item.toString()} />
								</span>
								<span>{formatAddress(item.toString(), 12, -12)}</span>
								{/* <span className="text-right">1,600</span> */}
							</div>
						))
					) : (
						<div className='absolute inset-y-0 m-auto h-6 w-full text-center'>
							No Data
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
