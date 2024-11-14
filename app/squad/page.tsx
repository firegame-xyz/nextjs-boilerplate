"use client";

import * as anchor from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

import { ButtonPrimary, ButtonTertiary } from "@/app/components/buttons/Button";

import { clx, formatAddress } from "@/app/utils/helpers";

import { SolanaAvatar } from "../components/widgets/SolanaAvatar";
import { useAtom } from "jotai";
import {
	balanceAtom,
	gameAtom,
	playerDataAtom,
	programAtom,
	providerAtom,
	registeredAtom,
	squadListAtom,
	SquadAll,
} from "@/app/state";
import useTransaction from "../hooks/useTransaction";

export default function Page() {
	const [playData] = useAtom(playerDataAtom);
	const [provider] = useAtom(providerAtom);
	const [squadList] = useAtom(squadListAtom);
	const [program] = useAtom(programAtom);
	const [game] = useAtom(gameAtom);
	const [registered] = useAtom(registeredAtom);
	const [balance] = useAtom(balanceAtom);
	const { publicKey } = useWallet();
	const [error, setError] = useState<string | null>(null);
	const [searchValue, setSearchValue] = useState<string>("");
	const [filteredSquadList, setFilteredSquadList] = useState<SquadAll[] | null>(
		squadList,
	);
	// const [squadAll, setSquadAll] = useState<SquadAll[] | null>(null);
	const [pending] = useState<boolean>(false);
	const { executeTransaction } = useTransaction();

	const isCreateSquad = useMemo(() => {
		if (!playData || !game) return;
		return playData.squad.toString() === game.defaultSquad.toString()
			? false
			: true;
	}, [playData]);

	const joinInstruction = async (
		squad: anchor.web3.PublicKey,
	): Promise<anchor.web3.TransactionInstruction[]> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods
			.applyToJoinSquad()
			.accounts({
				squad,
			})
			.instruction();

		return [instruction];
	};

	const handleJoin = async (squad: anchor.web3.PublicKey) => {
		await executeTransaction(() => joinInstruction(squad), "Join");
	};

	const createInstruction = async (): Promise<
		anchor.web3.TransactionInstruction[]
	> => {
		if (!publicKey || !program || !provider) {
			throw new Error("Missing wallet or program");
		}

		const instruction = await program.methods.createSquad().instruction();

		return [instruction];
	};

	const handleCreate = async () => {
		await executeTransaction(createInstruction, "Create");
	};

	// const responseJoin = async (signatureData: SignatureType, squad: string) => {
	//   if (!signatureData) return;

	//   const url = "https://api.wuzong.cloudns.be/api/squad/apply";
	//   const body = {
	//     squad: squad,
	//   };

	//   setPending(true);

	//   try {
	//     const response = await fetch(url, {
	//       method: "POST",
	//       headers: {
	//         "Content-Type": "application/json",
	//         address: signatureData?.address.toString(),
	//         signature: signatureData?.signature,
	//         time: signatureData?.time.toString(),
	//       },
	//       body: JSON.stringify(body),
	//     });

	//     if (!response.ok) {
	//       throw new Error(`HTTP error! Status: ${response.status}`);
	//     }

	//     const data = await response.json();
	//     notification.success("Join Success!");
	//     console.log("Join Response:", data);
	//   } catch (err: any) {
	//     console.error("Join Error:", err);
	//     notification.error("Join Error!", <>{err.message}</>);
	//   } finally {
	//     setPending(false);
	//   }
	// };

	// const fetchSquad = async () => {
	//   try {
	//     const data = await fetch(
	//       `https://api.wuzong.cloudns.be/api/squad/all/list?limit=10&offset=0`
	//     );
	//     const result = await data.json();
	//     console.log(result.data);
	//     setSquadData(result.data);
	//   } catch (err) {
	//     console.log(err);
	//     return [];
	//   }
	// };

	const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;

		if (newValue === "") {
			setSearchValue("");
			setError("");
			return;
		}

		const allowedPattern = /^[a-zA-Z0-9]+$/;

		if (!allowedPattern.test(newValue)) {
			setError("Only letters and numbers are allowed.");
		} else {
			setError("");
			setSearchValue(newValue);
		}
	};

	const handleSearch = () => {
		if (searchValue === "") {
			setFilteredSquadList(squadList);
			return;
		}
		const filtered = squadList.filter((item) =>
			item.account.name?.toLowerCase().includes(searchValue.toLowerCase()),
		);
		setFilteredSquadList(filtered);
	};

	useEffect(() => {
		if (searchValue === "") {
			setFilteredSquadList(squadList);
		}
	}, [squadList, searchValue]);

	return (
		<div>
			<div className='text-center'>
				{`Form a squad and invite your teammates to join.`}
				<br />
				{`Win massive weekly airdrop rewards.`}
			</div>
			<div className='mt-4 flex justify-center gap-4'>
				{isCreateSquad ? (
					<></>
				) : (
					<ButtonPrimary
						disabled={
							pending ||
							isCreateSquad ||
							!registered ||
							balance?.amount.lt(new anchor.BN(10_000))
						}
						className='w-40 rounded-xl'
						onClick={handleCreate}
					>
						Create Squad
					</ButtonPrimary>
				)}

				<Link href='/squad/my'>
					<ButtonPrimary disabled={!isCreateSquad} className='w-40 rounded-xl'>
						My Squad
					</ButtonPrimary>
				</Link>
			</div>

			<div className='mt-4 flex'>
				<input
					className='input-base'
					placeholder='Search Squad Name'
					value={searchValue}
					onChange={changeSearch}
				/>
				<ButtonPrimary
					className='border-l-0 border-gray-600'
					onClick={handleSearch}
				>
					Search
				</ButtonPrimary>
			</div>

			<div className='mt-4 flex flex-col gap-2'>
				<div className={clx("widget-base flex grow flex-col")}>
					<div className='flex items-center gap-4 border-b border-gray-800/40 p-4 text-xs'>
						<span className='w-10'></span>
						<span className='flex flex-1'>
							<span className='w-3/12'>NAME/ADDRESS</span>
							<span className='hidden sm:flex sm:w-3/12'>LEADER</span>
							{!isCreateSquad && <span></span>}
						</span>
					</div>
					{filteredSquadList && filteredSquadList.length > 0 ? (
						filteredSquadList?.map(
							(item, index) =>
								item.account.captain.toString() !==
									"11111111111111111111111111111111" && (
									<div
										key={index}
										className={clx(
											"relative flex items-center gap-4 border-b border-gray-800/40 p-4 text-xs",
										)}
									>
										{playData?.squad.toString() ===
											item.publicKey.toString() && (
											<div
												className={
													"absolute left-0 -z-10 h-full w-20 rounded-s-lg bg-gradient-to-r from-warning to-transparent"
												}
											></div>
										)}
										<div>
											<SolanaAvatar
												address={item.publicKey.toString()}
												imageUrl={item.account.logoUrl!}
											/>
										</div>
										<div className='flex flex-1 flex-col gap-1 sm:flex-row sm:gap-0'>
											<div className='order-2 w-3/12 sm:order-1'>
												{item.account.name ??
													formatAddress(item.publicKey.toString(), 12, -12)}
											</div>
											<div className='order-3 w-3/12 sm:order-2'>
												{formatAddress(
													item.account.captain.toString(),
													12,
													-12,
												)}
											</div>

											{!isCreateSquad && (
												<div className='order-4 mt-2 flex-1 sm:mt-0 sm:text-right'>
													<ButtonTertiary
														className='h-6 rounded-lg'
														disabled={!registered}
														onClick={() => handleJoin(item.publicKey)}
													>
														Join
													</ButtonTertiary>
												</div>
											)}
										</div>
									</div>
								),
						)
					) : (
						<div className='flex h-96 w-full items-center justify-center text-center'>
							No Squad
						</div>
					)}
					{/* {squadData && squadData?.list.length > 0 ? (
            squadData?.list?.map((item, index) => (
              <div
                key={index}
                className={clx(
                  "relative flex items-center gap-4 border-b border-gray-800/40 p-4 text-xs",
                )}
              >
                {state.mySquad?.my_squad?.squad === item.squad.toString() &&
                  state.mySquad?.my_squad.status.trim() === "join" && (
                    <div
                      className={
                        "absolute left-0 -z-10 h-full w-20 rounded-s-lg bg-gradient-to-r from-warning to-transparent"
                      }
                    ></div>
                  )}
                <div className='w-[18px]'>
                  {index < 9 ? `0${index + 1}` : index + 1}
                </div>
                <div>
                  <SolanaAvatar
                    address={item.squad.toString()}
                    imageUrl={item.image_url}
                  />
                </div>
                <div className='flex flex-1 flex-col gap-1 sm:flex-row sm:gap-0'>
                  <div className='order-2 w-3/12 sm:order-1'>
                    <Link key={index} href={`/squad/${item.squad}`}>
                      {item.name === "" ? item.squad : item.name}
                    </Link>
                  </div>
                  <div className='order-3 w-3/12 sm:order-2'>{item.player}</div>
                  <div className='order-1 flex gap-1 sm:order-3 sm:w-2/12'>
                    <span className='scale75 flex items-center rounded-md bg-primary-700 px-2'>{`Level ${discountRate(new anchor.BN(item.score)).level}`}</span>
                    <span className='scale75 flex items-center rounded-md bg-error-400 px-2'>
                      {`${100 - discountRate(new anchor.BN(item.score)).discount}% off`}
                    </span>
                  </div>

                  {!isCreateSquad && (
                    <div className='order-4 mt-2 flex-1 sm:mt-0 sm:text-right'>
                      <ButtonTertiary
                        className='h-6 rounded-lg'
                        disabled={!state.registered}
                        onClick={() => handleJoin(item.squad)}
                      >
                        Join
                      </ButtonTertiary>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='flex h-96 w-full items-center justify-center text-center'>
              No Squad
            </div>
          )} */}
				</div>
			</div>
		</div>
	);
}
