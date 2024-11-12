"use client";

import * as anchor from "@coral-xyz/anchor";
import React, { useEffect, useMemo, useState } from "react";

import {
	clx,
	formatAddress,
	formatAmount,
	formatTokenAmount,
} from "@/app/utils/helpers";

import SelectDropdown from "../components/widgets/SelectDropdown";
import { SolanaAvatar } from "../components/widgets/SolanaAvatar";
import { useAtom } from "jotai";
import {
	roundAtom,
	periodAtom,
	gameAtom,
	programAtom,
	Squad,
} from "@/app/state";
import { TriangleIcon } from "../components/icons/Icon";

export default function Page() {
	const [round] = useAtom(roundAtom);
	const [period] = useAtom(periodAtom);
	const [game] = useAtom(gameAtom);
	const [program] = useAtom(programAtom);
	const [tabActive, setTabActive] = useState<number>(1);

	const [squadAccounts, setSquadAccounts] = useState<
		{
			squad: anchor.web3.PublicKey;
			purchaseQuantity: anchor.BN;
			info: Squad;
		}[]
	>([]);

	useEffect(() => {
		const fetchSquadAccounts = async () => {
			if (!program || !period?.topSquads) return;
			const accounts = await Promise.all(
				period?.topSquads.map(async (item) => {
					const squadInfo = await program.account.squad.fetch(item.squad);
					return {
						...item,
						info: squadInfo,
					};
				}),
			);
			setSquadAccounts(accounts);
		};

		fetchSquadAccounts();
	}, [program, period?.topSquads]);

	const handleSetRound = (round: number) => {
		console.log(round);
	};

	return (
		<div>
			<div className='flex flex-col gap-4 sm:flex-row'>
				<div className='widget-base banner-base w-full p-5 sm:w-2/3'>
					<div className='flex flex-col'>
						<div className='flex justify-between'>
							<span className='text-2xl'>Squad Reward</span>
							<span className='text-2xl text-base-white'>
								{formatTokenAmount(
									formatAmount(period?.squadRewardAmount || new anchor.BN(0)),
									0,
								)}
							</span>
						</div>
						<div className='mt-2 flex flex-col sm:flex-row gap-2'>
							<div className='flex flex-1 flex-col rounded-md bg-gray-800 px-4 py-2'>
								<span className='text-sm'>First</span>
								<span className='text-xl text-base-white'>
									{formatTokenAmount(
										formatAmount(
											period?.squadFirstPlaceRewardAmount || new anchor.BN(0),
										),
										0,
									)}
								</span>
							</div>
							<div className='flex flex-1 flex-col rounded-md bg-gray-800 px-4 py-2'>
								<span className='text-sm'>Second</span>
								<span className='text-xl text-base-white'>
									{formatTokenAmount(
										formatAmount(
											period?.squadSecondPlaceRewardAmount || new anchor.BN(0),
										),
										0,
									)}
								</span>
							</div>
							<div className='flex flex-1 flex-col rounded-md bg-gray-800 px-4 py-2'>
								<span className='text-sm'>Third</span>
								<span className='text-xl text-base-white'>
									{formatTokenAmount(
										formatAmount(
											period?.squadThirdPlaceRewardAmount || new anchor.BN(0),
										),
										0,
									)}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className='widget-base banner-base w-full sm:w-1/3'>
					<div className='flex flex-col items-center justify-center gap-y-1 p-5'>
						<span className='text-2xl'>Purchase The Most</span>
						<span className='text-2xl text-base-white xl:text-4xl'>
							{formatTokenAmount(
								formatAmount(
									period?.individualRewardAmount || new anchor.BN(0),
								),
								0,
							)}
						</span>
					</div>
				</div>
			</div>

			<div className='mt-6 flex items-center justify-between'>
				<div className='flex rounded-lg bg-gray-800'>
					<span
						className={clx(
							"cursor-pointer rounded-lg bg-gray-800 px-4 py-2 text-gray-600",
							tabActive === 1 && "bg-base-black text-base-white",
						)}
						onClick={() => setTabActive(1)}
					>
						{`Purchase Rank`}
					</span>
					<span
						className={clx(
							"cursor-pointer rounded-lg bg-gray-800 px-4 py-2 text-gray-600",
							tabActive === 0 && "bg-base-black text-base-white",
						)}
						onClick={() => setTabActive(0)}
					>
						{`Squad Rank`}
					</span>
				</div>
				{/* {round?.roundNumber && (
					<SelectDropdown
						round={round?.roundNumber}
						handleCallBack={handleSetRound}
					/>
				)} */}
			</div>

			{tabActive === 1 ? (
				<>
					<div className='mt-4 flex flex-col gap-4 sm:flex-row'>
						{period?.topPlayers.map(
							(item, index) =>
								index < 3 && (
									<div
										key={index}
										className='flex flex-1 justify-between rounded-lg bg-base-black p-5'
									>
										<div className='flex items-center gap-4'>
											<div>
												<SolanaAvatar
													className='h-12 w-12'
													address={item.player.toString()}
												/>
											</div>
											<div className='flex flex-col gap-1'>
												<div>
													{formatAddress(item.player.toString(), 12, -12)}
												</div>
												<div className='flex items-end gap-1.5'>
													<span className='text-sm text-gray-600'>
														Purchase quantity
													</span>
													<span className='text-xs text-base-white'>
														{item.purchaseQuantity.toString()}
													</span>
												</div>
											</div>
										</div>
										{index === 0 && (
											<div className='text-center'>
												<TriangleIcon className='glow1' />
												<span className='text-xs'>1st</span>
											</div>
										)}
										{index === 1 && (
											<div className='text-center'>
												<TriangleIcon
													className='glow2'
													color1='#D6D6D6'
													color2='#737373'
												/>
												<span className='text-xs'>2nd</span>
											</div>
										)}
										{index === 2 && (
											<div className='text-center'>
												<TriangleIcon
													className='glow3'
													color1='#f48a50'
													color2='#bf6534'
												/>
												<span className='text-xs'>3rd</span>
											</div>
										)}
									</div>
								),
						)}
					</div>

					<div className='widget-base mt-2 flex grow flex-col min-h-80'>
						<div className='flex flex-col p-5'>
							{period?.topPlayers.map(
								(item, index) =>
									index > 2 && (
										<div
											key={index}
											className={clx(
												"flex items-center gap-4 border-b border-gray-800/40 py-4 text-xs",
											)}
										>
											<span>
												<SolanaAvatar address={item.player.toString()} />
											</span>
											<span className='flex-1'>
												{formatAddress(item.player.toString(), 12, -12)}
											</span>
											<span>{item.purchaseQuantity.toString()}</span>
										</div>
									),
							)}
						</div>
					</div>
				</>
			) : (
				<>
					<div className='mt-4 flex flex-col gap-4 sm:flex-row'>
						{squadAccounts.map(
							(item, index) =>
								index < 3 && (
									<div
										key={index}
										className='flex flex-1 justify-between rounded-lg bg-base-black p-5'
									>
										<div className='flex items-center gap-4'>
											<div>
												<SolanaAvatar
													className='h-12 w-12'
													address={item.squad.toString()}
													imageUrl={item.info.logoUrl!}
												/>
											</div>
											<div className='flex flex-col gap-1'>
												<div>
													{formatAddress(item.squad.toString(), 12, -12)}
												</div>
												<div className='flex items-end gap-1.5'>
													<span className='text-sm text-gray-600'>
														Purchase quantity
													</span>
													<span className='text-xs text-base-white'>
														{item.purchaseQuantity.toString()}
													</span>
												</div>
											</div>
										</div>
										{index === 0 && (
											<div className='text-center'>
												<TriangleIcon className='glow1' />
												<span className='text-xs'>1st</span>
											</div>
										)}
										{index === 1 && (
											<div className='text-center'>
												<TriangleIcon
													className='glow2'
													color1='#D6D6D6'
													color2='#737373'
												/>
												<span className='text-xs'>2nd</span>
											</div>
										)}
										{index === 2 && (
											<div className='text-center'>
												<TriangleIcon
													className='glow3'
													color1='#f48a50'
													color2='#bf6534'
												/>
												<span className='text-xs'>3rd</span>
											</div>
										)}
									</div>
								),
						)}
					</div>

					<div className='widget-base mt-2 flex grow flex-col min-h-80'>
						<div className='flex flex-col p-5'>
							{squadAccounts.map(
								(item, index) =>
									index > 2 && (
										<div
											key={index}
											className={clx(
												"flex items-center gap-4 border-b border-gray-800/40 py-4 text-xs",
											)}
										>
											<span>
												<SolanaAvatar
													address={item.squad.toString()}
													imageUrl={item.info.logoUrl!}
												/>
											</span>
											<span className='flex-1'>
												{formatAddress(item.squad.toString(), 12, -12)}
											</span>
											<span>{item.purchaseQuantity.toString()}</span>
										</div>
									),
							)}
						</div>
					</div>
				</>
			)}

			{/* {tabActive === 0 ? (
        <div className="widget-base mt-2 flex grow flex-col">
          <div className="flex flex-col p-5">
            {squadRankData && squadRankData?.list.length > 0 ? (
              squadRankData?.list.map((item, index) => (
                <div
                  key={index}
                  className={clx(
                    "flex items-center gap-4 border-b border-gray-800/40 py-4 text-xs"
                  )}
                >
                  <span className="w-[18px]">
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </span>
                  <span>
                    <SolanaAvatar
                      imageUrl={item.squad_data.image_url}
                      address={item.squad.toString()}
                    />
                  </span>
                  <span className="flex-1">
                    {item.squad_data.name ??
                      formatAddress(item.squad.toString(), 12, -12)}
                  </span>
                  <span className="flex items-center justify-end gap-2">
                    {formatTokenAmount(
                      formatAmount(new anchor.BN(item.score.toString() || "0"))
                    )}
                    <img
                      alt="fgc"
                      src={"/images/fgc.png"}
                      width={18}
                      height={18}
                    />
                  </span>
                </div>
              ))
            ) : (
              <div className="flex h-96 w-full items-center justify-center text-center">
                No Data
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="widget-base mt-2 flex grow flex-col">
          <div className="flex flex-col p-5">
            {purchaseRankData && purchaseRankData?.list.length > 0 ? (
              purchaseRankData?.list.map((item, index) => (
                <div
                  key={index}
                  className={clx(
                    "flex items-center gap-4 border-b border-gray-800/40 py-4 text-xs"
                  )}
                >
                  <span className="w-[18px]">
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </span>
                  <span>
                    <SolanaAvatar address={item.player} />
                  </span>
                  <span className="flex-1">
                    {formatAddress(item.player.toString(), 12, -12)}
                  </span>
                  <span className="flex items-center justify-end gap-2">
                    {formatTokenAmount(new anchor.BN(item.ore_amount), 0)}
                    <img
                      alt="ore"
                      src={"/images/ore.png"}
                      width={18}
                      height={18}
                    />
                  </span>
                </div>
              ))
            ) : (
              <div className="flex h-96 w-full items-center justify-center text-center">
                No Data
              </div>
            )}
          </div>
        </div>
      )} */}
		</div>
	);
}
