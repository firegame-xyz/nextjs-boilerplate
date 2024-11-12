import * as anchor from "@coral-xyz/anchor";
import { SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
	useAnchorWallet,
	useConnection,
	useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useAtom } from "jotai";

import {
	programAtom,
	configAtom,
	gameAtom,
	roundAtom,
	periodAtom,
	playerDataAtom,
	// playerRoundAtom,
	squadAtom,
	squadListAtom,
	balanceAtom,
	voucherAccountAtom,
	voucherBalanceAtom,
	registeredAtom,
	squadLoadingAtom,
	playerPDAAtom,
	lastPeriodAtom,
	providerAtom,
} from "@/app/state";

import {
	findConfigPDA,
	findGamePDA,
	findPeriodPDA,
	findPlayerDataPDA,
	// findPeriodPDA,
} from "@/app/config/pda";
import gameIdl from "@/idl/game.json";
import { Game as GameIdl } from "@/idl/game";
/**
 * Custom hook for managing global state and interactions with the Solana blockchain
 * @returns An object containing various functions and state for game interactions
 */
export function useGlobal() {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	const { publicKey, connected, disconnecting } = useWallet();

	const [provider, setProvider] = useAtom(providerAtom);
	const [program, setProgram] = useAtom(programAtom);
	const [game, setGame] = useAtom(gameAtom);
	const [config, setConfig] = useAtom(configAtom);
	const [round, setRound] = useAtom(roundAtom);
	const [period, setPeriod] = useAtom(periodAtom);
	const [lastPeriod, setLastPeriod] = useAtom(lastPeriodAtom);
	const [playerData, setPlayerData] = useAtom(playerDataAtom);
	const [playerPDA, setPlayerPDA] = useAtom(playerPDAAtom);
	// const [playerRound, setPlayerRound] = useAtom(playerRoundAtom);
	const [squad, setSquad] = useAtom(squadAtom);
	const [squadList, setSquadList] = useAtom(squadListAtom);
	const [balance, setBalance] = useAtom(balanceAtom);
	const [voucherAccount, setVoucherAccount] = useAtom(voucherAccountAtom);
	const [voucherBalance, setVoucherBalance] = useAtom(voucherBalanceAtom);
	const [registered, setRegistered] = useAtom(registeredAtom);
	const [squadLoading, setSquadLoading] = useAtom(squadLoadingAtom);

	const [tokenMintAccountAddress, setTokenMintAccountAddress] =
		useState<anchor.web3.PublicKey | null>(null);
	const [voucherMintAccountAddress, setVoucherMintAccountAddress] =
		useState<anchor.web3.PublicKey | null>(null);

	/**
	 * Fetches the current config state
	 */
	const fetchConfig = useCallback(async () => {
		if (!program) return;
		try {
			const configPDA = findConfigPDA(program.programId);
			const configData = await program.account.config.fetch(configPDA);
			setConfig(configData);
		} catch (error) {
			console.error("Error fetching config:", error);
		}
	}, [program, setConfig]);

	/**
	 * Fetches the current game state
	 */
	const fetchGame = useCallback(async () => {
		if (!program) return;
		try {
			const gamePDA = findGamePDA(program.programId);
			const gameData = await program.account.game.fetch(gamePDA);
			setGame(gameData);
		} catch (error) {
			console.error("Error fetching game:", error);
		}
	}, [program, setGame]);

	/**
	 * Fetches the current round state
	 */
	const fetchRound = useCallback(async () => {
		if (!program || !game) return;
		try {
			// const roundPDA = findRoundPDA(game.currentRound, program.programId);
			const roundData = await program.account.round.fetch(game.currentRound);
			setRound(roundData);
		} catch (error) {
			console.error("Error fetching round:", error);
		}
	}, [program, game, setRound]);

	/**
	 * Fetches the period state
	 */
	const fetchPeriod = useCallback(async () => {
		if (!program || !round) return;
		try {
			const periodData = await program.account.period.fetch(
				round.currentPeriod,
			);
			setPeriod(periodData);

			if (periodData.periodNumber > 1) {
				const prevPeriodPromises = Array.from(
					{ length: periodData.periodNumber },
					async (_, i) => {
						try {
							const currentPeriodNumber = periodData.periodNumber - 1 - i;
							const prevPeriodPDA = findPeriodPDA(
								game!.currentRound,
								currentPeriodNumber,
								program.programId,
							);
							const prevPeriodData = await program.account.period.fetch(
								prevPeriodPDA,
							);
							return prevPeriodData;
						} catch (error) {
							return null;
						}
					},
				);
				const allPeriods = await Promise.all(prevPeriodPromises);
				// 获取前两个非null的周期数据
				const previousPeriods = allPeriods
					.filter((period) => period !== null)
					.slice(0, 2);
				setLastPeriod(previousPeriods); // 注意：需要修改 lastPeriod 的类型为数组
			}
		} catch (error) {
			console.error("Error fetching period:", error);
		}
	}, [program, round, game, setPeriod]);

	/**
	 * Fetches the player's data
	 */
	const fetchPlayerData = useCallback(async () => {
		if (!program || !publicKey) return;
		try {
			const playerDataPDA = findPlayerDataPDA(publicKey, program.programId);
			setPlayerPDA(playerDataPDA);
			const playerData = await program.account.playerData.fetch(playerDataPDA);
			setPlayerData(playerData);
			setRegistered(playerData.player.toString() === publicKey.toString());
			getVoucherAccountBalance();
			getTokenAccountBalance();
		} catch (error) {
			console.error("Error fetching player data:", error);
			setRegistered(false);
		}
	}, [program, publicKey, setPlayerData, setRegistered]);

	/**
	 * Fetches the player's squad data
	 */
	const fetchSquad = useCallback(async () => {
		if (!program || !playerData) return;
		setSquadLoading(true);
		try {
			const squadData = await program.account.squad.fetch(playerData.squad);
			setSquad(squadData);
		} catch (err) {
			console.error("Error fetching squad:", err);
		} finally {
			setSquadLoading(false);
		}
	}, [program, playerData, setSquad, setSquadLoading]);

	/**
	 * Fetches the player's squad data
	 */
	const fetchSquadList = useCallback(async () => {
		if (!program) return;
		try {
			const squadListData = await program.account.squad.all();
			setSquadList(squadListData);
		} catch (err) {
			console.error("Error fetching squad list:", err);
		}
	}, [program, setSquadList]);

	/**
	 * Fetches the token account balance
	 */
	const getTokenAccountBalance = useCallback(async () => {
		if (!publicKey || !connection || !config) return;
		try {
			const tokenMint = config?.tokenMint;
			const tokenMintAccountAddress = await getAssociatedTokenAddress(
				tokenMint!,
				publicKey,
			);
			const res = await connection.getTokenAccountBalance(
				tokenMintAccountAddress,
			);
			setTokenMintAccountAddress(tokenMintAccountAddress);
			setBalance({
				valueAmount: new anchor.BN(res.value.amount),
				amount: new anchor.BN(res.value.uiAmount ?? 0),
				decimals: res.value.decimals,
			});
		} catch (error) {
			console.error("Error getting token account balance:", error);
			setBalance({
				valueAmount: new anchor.BN(0),
				amount: new anchor.BN(0),
				decimals: 6,
			});
		}
	}, [publicKey, connection, config, setBalance]);

	/**
	 * Fetches the voucher account balance
	 */
	const getVoucherAccountBalance = useCallback(async () => {
		if (!publicKey || !connection || !config) return;
		try {
			const voucherMint = config?.voucherMint;
			const voucherMintAccountAddress = await getAssociatedTokenAddress(
				voucherMint!,
				publicKey,
			);

			const res = await connection.getTokenAccountBalance(
				voucherMintAccountAddress,
			);

			setVoucherAccount(voucherMintAccountAddress);
			setVoucherMintAccountAddress(voucherMintAccountAddress);
			setVoucherBalance({
				valueAmount: new anchor.BN(res.value.amount),
				amount: new anchor.BN(res.value.uiAmount ?? 0),
				decimals: res.value.decimals,
			});
		} catch (error) {
			console.error("Error getting voucher account balance:", error);
			setVoucherBalance({
				valueAmount: new anchor.BN(0),
				amount: new anchor.BN(0),
				decimals: 6,
			});
		}
	}, [publicKey, connection, config, setVoucherBalance]);

	const fetchAllData = useCallback(async () => {
		if (!program || !connection) return;

		try {
			// Fetch config and store locally
			const configPDA = findConfigPDA(program.programId);
			const configData = await program.account.config.fetch(configPDA);
			setConfig(configData);

			// Fetch game and store locally
			const gamePDA = findGamePDA(program.programId);
			const gameData = await program.account.game.fetch(gamePDA);
			setGame(gameData);

			// Use gameData directly to fetch round
			const roundData = await program.account.round.fetch(
				gameData.currentRound,
			);
			setRound(roundData);

			// Fetch period using roundData directly
			const periodData = await program.account.period.fetch(
				roundData.currentPeriod,
			);
			setPeriod(periodData);

			// Handle previous periods
			if (periodData.periodNumber > 1) {
				const prevPeriodPromises = Array.from(
					{ length: periodData.periodNumber },
					async (_, i) => {
						try {
							const currentPeriodNumber = periodData.periodNumber - 1 - i;
							const prevPeriodPDA = findPeriodPDA(
								gameData.currentRound,
								currentPeriodNumber,
								program.programId,
							);
							const prevPeriodData = await program.account.period.fetch(
								prevPeriodPDA,
							);
							return prevPeriodData;
						} catch (error) {
							return null;
						}
					},
				);
				const allPeriods = await Promise.all(prevPeriodPromises);
				const previousPeriods = allPeriods
					.filter((period) => period !== null)
					.slice(0, 2);
				setLastPeriod(previousPeriods);
			}

			if (!publicKey) return;
			// Fetch player data directly
			const playerDataPDA = findPlayerDataPDA(publicKey, program.programId);
			setPlayerPDA(playerDataPDA);
			let playerDataLocal;
			try {
				playerDataLocal = await program.account.playerData.fetch(playerDataPDA);
				setPlayerData(playerDataLocal);
				setRegistered(
					playerDataLocal.player.toString() === publicKey.toString(),
				);
			} catch (error) {
				console.error("Error fetching player data:", error);
				setRegistered(false);
				playerDataLocal = null;
			}

			// Fetch token balances using configData
			try {
				// Get token balance
				const tokenMintAddress = await getAssociatedTokenAddress(
					configData.tokenMint,
					publicKey,
				);
				const tokenBalance = await connection.getTokenAccountBalance(
					tokenMintAddress,
				);
				setTokenMintAccountAddress(tokenMintAddress);
				setBalance({
					valueAmount: new anchor.BN(tokenBalance.value.amount),
					amount: new anchor.BN(tokenBalance.value.uiAmount ?? 0),
					decimals: tokenBalance.value.decimals,
				});

				// Get voucher balance
				const voucherMintAddress = await getAssociatedTokenAddress(
					configData.voucherMint,
					publicKey,
				);
				const voucherBalance = await connection.getTokenAccountBalance(
					voucherMintAddress,
				);
				setVoucherAccount(voucherMintAddress);
				setVoucherMintAccountAddress(voucherMintAddress);
				setVoucherBalance({
					valueAmount: new anchor.BN(voucherBalance.value.amount),
					amount: new anchor.BN(voucherBalance.value.uiAmount ?? 0),
					decimals: voucherBalance.value.decimals,
				});
			} catch (error) {
				console.error("Error fetching token balances:", error);
				setBalance({
					valueAmount: new anchor.BN(0),
					amount: new anchor.BN(0),
					decimals: 6,
				});
				setVoucherBalance({
					valueAmount: new anchor.BN(0),
					amount: new anchor.BN(0),
					decimals: 6,
				});
			}

			// Fetch squad if we have player data
			if (playerDataLocal) {
				setSquadLoading(true);
				try {
					const squadData = await program.account.squad.fetch(
						playerDataLocal.squad,
					);
					setSquad(squadData);
				} catch (err) {
					console.error("Error fetching squad:", err);
				} finally {
					setSquadLoading(false);
				}
			}

			try {
				const squadListData = await program.account.squad.all();
				setSquadList(squadListData);
			} catch (err) {
				console.error("Error fetching squad list:", err);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [program, connection, publicKey]);

	// Set up config listener
	useEffect(() => {
		const configPDA = findConfigPDA(
			program!.programId ?? SystemProgram.programId,
		);
		const configListener = connection.onAccountChange(configPDA, fetchConfig);

		return () => {
			connection.removeAccountChangeListener(configListener);
		};
	}, [connection, program, fetchConfig]);

	// Set up game listener
	useEffect(() => {
		const gamePDA = findGamePDA(program!.programId ?? SystemProgram.programId);
		const gameListener = connection.onAccountChange(gamePDA, fetchGame);

		return () => {
			connection.removeAccountChangeListener(gameListener);
		};
	}, [connection, program, fetchGame]);

	// Set up player data and balance listeners
	useEffect(() => {
		const playerDataPDA = findPlayerDataPDA(
			publicKey! ?? SystemProgram.programId,
			program!.programId ?? SystemProgram.programId,
		);
		const playerDataListener = connection.onAccountChange(
			playerDataPDA,
			fetchPlayerData,
		);

		return () => {
			connection.removeAccountChangeListener(playerDataListener);
		};
	}, [connection, publicKey, program, fetchPlayerData]);

	// Set up token balance listener
	useEffect(() => {
		const tokenAccountBalanceListener = connection.onAccountChange(
			tokenMintAccountAddress! ?? SystemProgram.programId,
			getTokenAccountBalance,
		);

		return () => {
			connection.removeAccountChangeListener(tokenAccountBalanceListener);
		};
	}, [connection, tokenMintAccountAddress, getTokenAccountBalance]);

	// Set up voucher balance listener
	useEffect(() => {
		const voucherMintAccountListener = connection.onAccountChange(
			voucherMintAccountAddress! ?? SystemProgram.programId,
			getVoucherAccountBalance,
		);

		return () => {
			connection.removeAccountChangeListener(voucherMintAccountListener);
		};
	}, [connection, voucherMintAccountAddress, getVoucherAccountBalance]);

	// Set up round listener
	useEffect(() => {
		const roundListener = connection.onAccountChange(
			game!.currentRound ?? SystemProgram.programId,
			fetchRound,
		);

		return () => {
			connection.removeAccountChangeListener(roundListener);
		};
	}, [connection, program, game, fetchRound]);

	// Set up squad listener
	useEffect(() => {
		const squadListener = connection.onAccountChange(
			playerData!.squad ?? SystemProgram.programId,
			fetchSquad,
		);

		return () => {
			connection.removeAccountChangeListener(squadListener);
		};
	}, [connection, program, playerData, fetchSquad]);

	// Set up squad list listener
	useEffect(() => {
		const squadListListener = program?.addEventListener(
			"transferEvent",
			(event, slot) => {
				if (event.eventType.createSquad) {
					fetchSquadList();
				}
			},
		);

		return () => {
			if (squadListListener)
				program?.removeEventListener(squadListListener).catch(console.error);
		};
	}, [connection, program, fetchSquadList]);

	// Set up period listener
	useEffect(() => {
		const periodListener = connection.onAccountChange(
			round!.currentPeriod ?? SystemProgram.programId,
			fetchPeriod,
		);

		return () => {
			connection.removeAccountChangeListener(periodListener);
		};
	}, [connection, program, round, fetchPeriod]);

	// Fetch player round and squad data when necessary
	// useEffect(() => {
	// 	if (round && game) fetchPlayerRound();
	// }, [round, game, fetchPlayerRound]);

	// useEffect(() => {
	// 	if (playerData) fetchSquad();
	// }, [playerData, fetchSquad]);

	const reset = useCallback(async () => {
		await Promise.resolve().then(() => {
			setConfig(null);
			setGame(null);
			setRound(null);
			setPeriod(null);
			setLastPeriod([]);
			setPlayerData(null);
			setSquad(null);
			setBalance(null);
			setVoucherBalance(null);
			setRegistered(false);
			setSquadLoading(false);
			setSquadList([]);
		});
	}, []);

	// Fetch all data on initial load and when wallet connects
	useEffect(() => {
		if (!connection || !program) return;
		fetchAllData();
	}, [publicKey, connection, program, fetchAllData]);

	// Initialize program and provider when connection is available
	useEffect(() => {
		if (!connection) return;

		const provider = new anchor.AnchorProvider(connection, wallet!, {});
		let gameIdlProgram;

		if (connection.rpcEndpoint.includes("devnet")) {
			gameIdlProgram = new anchor.Program(gameIdl as GameIdl, provider);
		} else {
			gameIdlProgram = null;
		}

		setProvider(provider);
		setProgram(gameIdlProgram);
	}, [connection, wallet]);

	useEffect(() => {
		if (program) return;
		reset();
	}, [program, reset]);

	// Clean up on disconnect
	useEffect(() => {
		if (!disconnecting) return;

		setProgram(null);
		setGame(null);
		setRound(null);
		setPlayerData(null);
		// setPlayerRound(null);
		setSquad(null);
		setBalance(null);
		setVoucherBalance(null);
		setRegistered(false);
		setSquadLoading(false);
	}, [disconnecting]);

	return useMemo(
		() => ({
			fetchPlayerData,
			fetchSquad,
			getTokenAccountBalance,
			getVoucherAccountBalance,
		}),
		[
			fetchPlayerData,
			fetchSquad,
			getTokenAccountBalance,
			getVoucherAccountBalance,
		],
	);
}
