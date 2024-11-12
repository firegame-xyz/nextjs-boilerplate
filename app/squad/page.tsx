"use client";

import * as anchor from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
	ButtonDefault,
	ButtonPrimary,
	ButtonTertiary,
} from "@/app/components/buttons/Button";

import {
	clx,
	discountRate,
	formatAddress,
	formatAmount,
	formatTokenAmount,
	isValidSolanaAddress,
	u32ToToLEBuffer,
} from "@/app/utils/helpers";

import { SolanaAvatar } from "../components/widgets/SolanaAvatar";
import { useAtom } from "jotai";
import {
	balanceAtom,
	gameAtom,
	playerDataAtom,
	programAtom,
	providerAtom,
	registeredAtom,
} from "@/app/state";
import { SquadAll } from "@/app/state";
import useTransaction from "../hooks/useTransaction";
import { findPlayerDataPDA } from "../config/pda";

export default function Page() {
	const [playData] = useAtom(playerDataAtom);
	const [provider] = useAtom(providerAtom);
	const [program] = useAtom(programAtom);
	const [game] = useAtom(gameAtom);
	const [registered] = useAtom(registeredAtom);
	const [balance] = useAtom(balanceAtom);
	const { connected, publicKey } = useWallet();
	const [error, setError] = useState<string | null>(null);
	const [searchValue, setSearchValue] = useState<string>("");
	const [squadAll, setSquadAll] = useState<SquadAll[] | null>(null);
	const [pending, setPending] = useState<boolean>(false);
	const { executeTransaction, isTransactionInProgress } = useTransaction();

	const isCreateSquad = useMemo(() => {
		if (!playData || !game) return;
		return playData.squad.toString() === game.defaultSquad.toString()
			? false
			: true;
	}, [playData]);

	// const handleCreateSquad = async () => {
	//   if (!publicKey || !program || !provider || !game) return;

	//   const createSquad = await program.methods.createSquad().instruction();

	//   let tx = new anchor.web3.Transaction();
	//   tx.add(createSquad);

	//   const { blockhash } = await connection.getLatestBlockhash("finalized");
	//   tx.recentBlockhash = blockhash;
	//   tx.feePayer = provider.wallet.publicKey;

	//   setPending(true);

	//   try {
	//     let signedTransaction = await provider.wallet.signTransaction(tx);
	//     let txid = await connection.sendRawTransaction(
	//       signedTransaction.serialize(),
	//       { skipPreflight: false, preflightCommitment: "confirmed" },
	//     );

	//     const latestBlockhash = await connection.getLatestBlockhash();
	//     const confirmation = await connection.confirmTransaction({
	//       signature: txid,
	//       blockhash: latestBlockhash.blockhash,
	//       lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
	//     });

	//     if (confirmation.value.err) {
	//       console.error("Transaction failed:", confirmation.value.err);
	//       notification.error(
	//         "Create Squad Error!",
	//         <>{confirmation.value.err}</>,
	//       );
	//     } else {
	//       const transactionResult = await connection.getParsedTransaction(txid, {
	//         commitment: "confirmed",
	//       });

	//       if (
	//         transactionResult &&
	//         transactionResult.meta &&
	//         !transactionResult.meta.err
	//       ) {
	//         console.log("Transaction confirmed:", transactionResult);
	//         notification.success("Create Squad Success!");
	//         router.push("/squad/my");
	//       } else {
	//         console.error("Transaction error details:", transactionResult);
	//         notification.error("Create Squad Error!", <>{transactionResult}</>);
	//       }
	//     }

	//     setPending(false);
	//   } catch (err: any) {
	//     setPending(false);
	//     console.log(err);
	//     notification.error("Create Squad Error!", <>{err.message}</>);
	//   }
	// };

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

	const createInstruction = async (): Promise<anchor.web3.TransactionInstruction[]> => {
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
		}

		const maxLength = 20;
		const allowedPattern = /^[a-zA-Z0-9]+$/;

		if (!allowedPattern.test(newValue)) {
			setError(`Only letters And numbers are allowed.`);
		} else {
			setError(null);
			setSearchValue(newValue);
		}
	};

	const handleSearch = () => {
		if (!searchValue) return;
		// getSquadSearch(searchValue).then((result) => {
		//   console.log("getSquadSearch", result);
		//   setSquadData(result);
		// });
	};

	const fetchSquadAll = useCallback(async () => {
		if (!program) return;
		try {
			const data = await program.account.squad.all();
			setSquadAll(data);
		} catch (err) {
			console.error("Error fetching squad all:", err);
		} finally {
		}
	}, [program]);

	useEffect(() => {
		if (!program) return;
		fetchSquadAll();
		const listener = program.addEventListener(
			"transferEvent",
			(event, slot) => {
				if (event.eventType.createSquad) {
					fetchSquadAll();
				}
				console.log("New event:", event, "at slot:", slot);
			},
		);

		return () => {
			program.removeEventListener(listener).catch(console.error);
		};
	}, [program, playData, fetchSquadAll]);

	// useEffect(() => {
	//   if (searchValue) return;
	//   getSquadAll(30, 0).then((result) => {
	//     setSquadData(result);
	//   });
	// }, [state.mySquad, searchValue]);

	return (
		<div>
			<div className='text-center'>
				{`Form a squad and invite your teammates to join.`}
				<br />
				{`Win massive weekly airdrop rewards and enjoy team discounts.`}
				{!isCreateSquad && (
					<>
						<br />
						<span className='text-xs'>{`Creating a squad will cost ${formatTokenAmount(
							10000,
						)} FGC`}</span>
					</>
				)}
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
					{squadAll && squadAll.length > 0 ? (
						squadAll?.map(
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
