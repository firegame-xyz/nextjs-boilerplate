"use client";

import * as anchor from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import {
	ButtonDefault,
	ButtonPrimary,
	ButtonTertiary,
} from "@/app/components/buttons/Button";
import { BackIcon, LeaveIcon } from "@/app/components/icons/Icon";
import { SolanaAvatar } from "@/app/components/widgets/SolanaAvatar";
import {
	clx,
	//   discountRate,
	formatAddress,
	formatAmount,
	//   formatDateTime,
	formatTokenAmount,
} from "@/app/utils/helpers";
import { useAtom } from "jotai";
import {
	//   gameAtom,
	playerDataAtom,
	//   playerPDAAtom,
	programAtom,
	providerAtom,
	registeredAtom,
	roundAtom,
	squadAtom,
} from "@/app/state";
import { useAvatarUrl } from "@/app/hooks/useData";
import useTransaction from "@/app/hooks/useTransaction";

export default function Page() {
	const [provider] = useAtom(providerAtom);
	const [program] = useAtom(programAtom);
	//   const [game] = useAtom(gameAtom);
	const [round] = useAtom(roundAtom);
	const [squad] = useAtom(squadAtom);
	const [playData] = useAtom(playerDataAtom);
	//   const [playerPDA] = useAtom(playerPDAAtom);
	const [registered] = useAtom(registeredAtom);
	const { publicKey } = useWallet();
	const router = useRouter();
	const [tabActive, setTabActive] = useState<number>(0);
	//   const [isLoading, setIsLoading] = useState(true);
	const { executeTransaction } = useTransaction();

	const squadLogoUrl = useAvatarUrl(squad?.logoUrl);

	const memberType = useCallback(
		(publicKey: anchor.web3.PublicKey) => {
			if (!publicKey) return "Member";
			const isCaptain = squad?.captain.toString() === publicKey.toString();
			const isInManagersList = squad?.managers.some(
				(manager) => manager.toString() === publicKey.toString(),
			);

			if (isCaptain) {
				return "Leader";
			}

			return isInManagersList ? "Admin" : "Member";
		},
		[squad],
	);

	const leaveSquadInstruction = async (): Promise<
		anchor.web3.TransactionInstruction[]
	> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods.leaveSquad().instruction();

		return [instruction];
	};

	const handleLeaveSquad = async () => {
		await executeTransaction(leaveSquadInstruction, "Leave squad");
		router.replace("/squad");
	};

	const rejectInstruction = async (
		applicant: anchor.web3.PublicKey,
	): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods
			.rejectSquadApplication(applicant)
			.accounts({})
			.instruction();

		return [instruction];
	};

	const handleReject = async (applicant: anchor.web3.PublicKey) => {
		await executeTransaction(() => rejectInstruction(applicant), "Reject");
	};

	const acceptInstruction = async (
		applicant: anchor.web3.PublicKey,
	): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods
			.acceptSquadApplication(applicant)
			.accounts({})
			.instruction();

		return [instruction];
	};

	const handleAccept = async (applicant: anchor.web3.PublicKey) => {
		await executeTransaction(() => acceptInstruction(applicant), "Review");
	};

	const transferSquadCaptaincyInstruction = async (
		member: anchor.web3.PublicKey,
	): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods
			.transferSquadCaptaincy(member)
			.accounts({})
			.instruction();

		return [instruction];
	};

	const handleChangeSquadCaptain = async (member: anchor.web3.PublicKey) => {
		await executeTransaction(
			() => transferSquadCaptaincyInstruction(member),
			"Change squad captain",
		);
	};

	const grantManagerPrivilegesInstruction = async (
		member: anchor.web3.PublicKey,
	): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods
			.grantManagerPrivileges(member)
			.accounts({})
			.instruction();

		return [instruction];
	};

	const handleGrantAdmin = async (member: anchor.web3.PublicKey) => {
		await executeTransaction(
			() => grantManagerPrivilegesInstruction(member),
			"Grant admin",
		);
	};

	const revokeManagerPrivilegesInstruction = async (
		manager: anchor.web3.PublicKey,
	): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods
			.revokeManagerPrivileges(manager)
			.accounts({})
			.instruction();

		return [instruction];
	};

	const handleRemoveAdmin = async (manager: anchor.web3.PublicKey) => {
		await executeTransaction(
			() => revokeManagerPrivilegesInstruction(manager),
			"Remove admin",
		);
	};

	const removeMemberFromSquadInstruction = async (
		memberToRemove: anchor.web3.PublicKey,
	): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods
			.removeMemberFromSquad(memberToRemove)
			.accounts({})
			.instruction();

		return [instruction];
	};

	const handleRemoveMember = async (memberToRemove: anchor.web3.PublicKey) => {
		await executeTransaction(
			() => removeMemberFromSquadInstruction(memberToRemove),
			"Remove member",
		);
	};

	useEffect(() => {
		if (!publicKey && round) {
			//   setIsLoading(true);
			router.replace("/squad");
		}
	}, [router, publicKey, round]);

	useEffect(() => {
		if (!registered && round) {
			//   setIsLoading(true);
			router.replace("/squad");
		}
	}, [router, registered, round]);

	return (
		<div>
			<div className='flex items-center justify-between'>
				<Link href='/squad'>
					<div className='flex items-center gap-1'>
						<BackIcon />
						{`Back`}
					</div>
				</Link>
				{squad?.captain.toString() !== publicKey?.toString() && (
					<span
						className='flex cursor-pointer items-center text-xs text-warning'
						onClick={handleLeaveSquad}
					>
						<LeaveIcon className='mr-1 size-6' />
						{"Leave Squad"}
					</span>
				)}
			</div>

			<div className='widget-base mt-4 flex flex-col p-4 sm:flex-row sm:p-10'>
				<div className='w-full sm:w-1/2'>
					<div className='flex flex-col gap-8 sm:flex-row'>
						<div className='flex flex-col items-center justify-center'>
							<div className='relative size-32 cursor-pointer overflow-hidden rounded-full border-4 border-gray-300 bg-gray-400'>
								<img src={squadLogoUrl || "/images/default.jpg"} />
							</div>
							{squad?.captain.toString() === publicKey?.toString() && (
								<div className='mt-4 text-center'>
									<Link href='/squad/update'>
										<ButtonPrimary className='rounded-xl'>
											{"Update Squad"}
										</ButtonPrimary>
									</Link>
								</div>
							)}
						</div>
						<div className='flex flex-col gap-2'>
							<div className='flex flex-col gap-1'>
								<span className='text-base-white'>
									{squad?.name ?? playData?.squad.toString()}
								</span>
							</div>

							<div className='flex gap-10'>
								<div className='flex flex-col'>
									<span>{"Member"}</span>
									<span className='text-base-white'>
										{`${squad?.memberList.length}/30`}
									</span>
								</div>
							</div>

							<div className='flex gap-10'>
								<div className='flex flex-col'>
									<span>Address</span>
									<span className='text-xs text-base-white sm:text-sm'>
										{playData?.squad.toString()}
									</span>
								</div>
							</div>

							<div className='flex gap-10'>
								<div className='flex flex-col'>
									<span>Captain</span>
									<span className='text-xs text-base-white sm:text-sm'>
										{squad?.captain.toString()}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{memberType(publicKey!) === "Leader" && (
					<div className='mt-4 sm:mt-0 sm:flex-1'>
						<div className='ml-auto w-full overflow-hidden rounded-lg border border-warning sm:w-32'>
							<div className='bg-warning px-2 py-1 text-base-black'>{`Rewards`}</div>
							<div className='flex flex-col p-4'>
								<div className='text-center text-base-white'>
									{formatTokenAmount(
										formatAmount(
											squad?.collectableSquadRewards || new anchor.BN(0),
										),
										0,
									)}
								</div>
								<ButtonTertiary
									className='mt-2 rounded-lg'
									disabled={squad?.collectableSquadRewards.isZero()}
								>
									Claim
								</ButtonTertiary>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* <div className="flex justify-center">
        <div className="relative size-28 cursor-pointer overflow-hidden rounded-full border-4 border-gray-300 bg-gray-400">
          <img
            src={
              state.mySquad?.squad.image_url
                ? `${process.env.NEXT_PUBLIC_AWS_URL}/${process.env.NEXT_PUBLIC_AWS_PATH}/${state.mySquad?.squad.image_url}`
                : "/images/default.jpg"
            }
          />
        </div>
      </div>

      <div className="mt-4 w-full border-b border-gray-800 pb-8">
        <div className="mx-auto flex w-full flex-col gap-4 sm:w-[350px]">
          <div className="flex flex-col gap-2">
            <div className="text-center">{state.mySquad?.squad.name}</div>
            <div className=" flex justify-center gap-1 text-xs">
              <span className="scale75 flex items-center rounded-md bg-warning px-2 text-base-black">{`${state.mySquad?.my_squad.address_type}`}</span>
              <span className="scale75 flex items-center rounded-md bg-primary-700 px-2">{`Level ${discountRate(squadScore).level}`}</span>
              <span className="scale75 flex items-center rounded-md bg-error-400 px-2">{`${100 - discountRate(squadScore).discount}% off`}</span>
            </div>
          </div>
          {state.mySquad && state.squad && (
            <div className="flex flex-col gap-1">
              <div className="mb-4 overflow-hidden rounded-lg border border-warning">
                <div className="bg-warning px-2 py-1 text-base-black">{`Rewards`}</div>
                <div className="flex items-center justify-between p-4">
                  <span>
                    {formatTokenAmount(
                      formatAmount(
                        state.squad.collectableSquadReward
                      ).toString(),
                      0
                    )}
                  </span>
                  <ButtonTertiary
                    className="rounded-lg"
                    disabled={state.squad.collectableSquadReward.isZero()}
                  >
                    Claim
                  </ButtonTertiary>
                </div>
              </div>
              {state.mySquad.my_squad.status === "admin" && (
                <div className="flex items-center gap-4 text-xs">
                  <span className="w-[80px] rounded-lg bg-base-black px-2 py-1 text-base-white">
                    Squad Permissions
                  </span>
                  <span>{state.mySquad.my_squad.status}</span>
                </div>
              )}
              <div className="flex items-center gap-4 text-xs">
                <span className="w-[80px] rounded-lg bg-base-black px-2 py-1 text-base-white">
                  Squad Score
                </span>
                <span>
                  {formatTokenAmount(
                    formatAmount(state.squad.score).toString(),
                    0
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="w-[80px] rounded-lg bg-base-black px-2 py-1 text-base-white">
                  Squad Address
                </span>
                <span>{state.mySquad?.my_squad.squad}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="w-[80px] rounded-lg bg-base-black px-2 py-1 text-base-white">
                  Squad Captain
                </span>
                <span>{state.squad?.captain.toString()}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="w-[80px] rounded-lg bg-base-black px-2 py-1 text-base-white">
                  Squad Size
                </span>
                <span>{`${state.squad?.totalPlayers.add(new anchor.BN(1)).toString()}/30`}</span>
              </div>
            </div>
          )}

          {state.squad?.captain.toString() === publicKey?.toString() && (
            <div className="mt-4 text-center">
              <Link href="/squad/update">
                <ButtonPrimary className="w-40 rounded-xl">
                  Update Squad
                </ButtonPrimary>
              </Link>
            </div>
          )}
        </div>
      </div> */}

			{/* <div className="mt-4 flex">
        <input className="input-base" placeholder="Search Address" />
        <ButtonPrimary>Search</ButtonPrimary>
      </div> */}

			<div className='mt-4 flex gap-2 px-2'>
				<span
					className={clx(
						"cursor-pointer rounded-t-lg bg-gray-900 px-4 py-2 text-gray-600",
						tabActive === 0 && "bg-base-black text-base-white",
					)}
					onClick={() => setTabActive(0)}
				>
					{`Squad Member`}
				</span>
				{memberType(publicKey!) !== "Member" && (
					<span
						className={clx(
							"cursor-pointer rounded-t-lg bg-gray-900 px-4 py-2 text-gray-600",
							tabActive === 1 && "bg-base-black text-base-white",
						)}
						onClick={() => setTabActive(1)}
					>
						{`Pending review`}
					</span>
				)}
			</div>

			{tabActive === 0 ? (
				<div className='flex flex-col gap-2'>
					<div className='widget-base flex grow flex-col overflow-hidden'>
						{squad && squad?.memberList.length > 0 ? (
							squad?.memberList.map((item, index) => (
								<div
									key={index}
									className={clx(
										"relative flex items-center gap-4 border-b border-gray-800/40 p-4 text-xs",
									)}
								>
									{publicKey?.toString() === item.toString() && (
										<div
											className={
												"absolute left-0 -z-10 h-full w-20 rounded-s-lg bg-gradient-to-r from-warning to-transparent"
											}
										></div>
									)}
									<span className='flex items-center gap-2'>
										<span className='w-[18px]'>
											{index < 9 ? `0${index + 1}` : index + 1}
										</span>
										<span>
											<SolanaAvatar address={item.toString()} />
										</span>
									</span>
									<span className='flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-0'>
										<span className='order-2 w-2/12 sm:order-1'>
											{formatAddress(item.toString(), 12, -12)}
										</span>
										<span className='order-1 flex gap-1 sm:order-2 sm:w-2/12'>
											<span className='scale75 flex h-6 items-center rounded-md bg-warning px-2 text-base-black'>{`${memberType(
												item,
											)}`}</span>
										</span>
										<span className='order-3 mt-2 flex flex-1 items-center gap-2 sm:mt-0 sm:flex-row sm:justify-end'>
											{memberType(publicKey!) !== "Member" && (
												<>
													{squad?.captain.toString() ===
														publicKey?.toString() &&
														squad?.captain.toString() !== item.toString() && (
															<>
																{memberType(item) !== "Admin" && (
																	<ButtonDefault
																		className='h-6 rounded-lg px-2'
																		onClick={() => handleGrantAdmin(item)}
																	>
																		Grant to admin
																	</ButtonDefault>
																)}
																<ButtonDefault
																	className='h-6 rounded-lg px-2'
																	onClick={() => handleChangeSquadCaptain(item)}
																>
																	Grant to captain
																</ButtonDefault>
															</>
														)}

													{squad?.captain.toString() ===
														publicKey?.toString() &&
														memberType(item) === "Admin" && (
															<ButtonDefault
																className='h-6 rounded-lg px-2'
																onClick={() => handleRemoveAdmin(item)}
															>
																Remove admin
															</ButtonDefault>
														)}

													{memberType(item) === "Member" && (
														<ButtonDefault
															className='h-6 rounded-lg'
															onClick={() => handleRemoveMember(item)}
														>
															Remove
														</ButtonDefault>
													)}
												</>
											)}
										</span>
									</span>
								</div>
							))
						) : (
							<div className='flex h-96 w-full items-center justify-center text-center'>
								No Members
							</div>
						)}
					</div>
				</div>
			) : (
				<div className='flex flex-col gap-2'>
					<div className='widget-base flex grow flex-col'>
						{squad && squad.applicationList.length > 0 ? (
							squad.applicationList.map((item, index) => (
								<div
									key={index}
									className={clx(
										"relative flex items-center gap-4 border-b border-gray-800/40 p-4 text-xs",
									)}
								>
									<span className='flex items-center gap-2'>
										<span className='w-[18px]'>
											{index < 9 ? `0${index + 1}` : index + 1}
										</span>
										<SolanaAvatar address={item.toString()} />
										{formatAddress(item.toString(), 12, -12)}
									</span>
									<span className='flex flex-1 flex-col justify-end gap-2 sm:flex-row'>
										<ButtonDefault
											className='h-6 rounded-lg'
											onClick={() => handleAccept(item)}
										>
											Accept
										</ButtonDefault>
										<ButtonDefault
											className='h-6 rounded-lg'
											onClick={() => handleReject(item)}
										>
											Reject
										</ButtonDefault>
									</span>
								</div>
							))
						) : (
							<div className='flex h-96 w-full items-center justify-center text-center'>
								No Applications
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
