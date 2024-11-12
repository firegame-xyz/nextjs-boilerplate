import * as anchor from "@coral-xyz/anchor";
import { useAtom } from "jotai";
import { gameAtom, roundAtom } from "@/app/state";

import { formatAmount, formatTokenAmount } from "@/app/utils/helpers";

export default function TopArea() {
	const [game] = useAtom(gameAtom);
	const [round] = useAtom(roundAtom);
	return (
		<div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
			<div className='widget-base'>
				<div className='flex flex-col gap-y-1 p-5'>
					<span className='text-2xl'>Grand Prize</span>
					<span className='text-2xl text-base-white xl:text-4xl'>
						{formatTokenAmount(
							formatAmount(round?.grandPrizePoolBalance || new anchor.BN(0)),
							0,
						)}
					</span>
				</div>
			</div>
			<div className='widget-base hidden sm:flex'>
				<div className='flex flex-col gap-y-1 p-5'>
					<span className='text-xl xl:text-2xl'>
						Invitation Rewards Claimed
					</span>
					<span className='text-2xl text-base-white xl:text-4xl'>
						{formatTokenAmount(
							formatAmount(
								game?.totalReferrerRewardsClaimed || new anchor.BN(0),
							),
							0,
						)}
					</span>
				</div>
			</div>
			<div className='widget-base'>
				<div className='flex flex-col gap-y-1 p-5'>
					<span className='text-xl xl:text-2xl'>Special Reward</span>
					<span className='text-2xl text-base-white xl:text-4xl'>
						{formatTokenAmount(
							formatAmount(game?.specialRewardPoolBalance || new anchor.BN(0)),
							0,
						)}
					</span>
				</div>
			</div>
			<div className='widget-base hidden sm:flex'>
				<div className='flex flex-col gap-y-1 p-5'>
					<span className='text-xl xl:text-2xl'>Salary</span>
					<span className='text-2xl text-base-white xl:text-4xl'>
						{formatTokenAmount(
							formatAmount(
								(game?.bonusSalaryPoolBalance || new anchor.BN(0)).add(
									game?.constructionWorkerSalaryPoolBalance || new anchor.BN(0),
								),
							),
							0,
						)}
					</span>
				</div>
			</div>
		</div>
	);
}
