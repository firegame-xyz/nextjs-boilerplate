import * as anchor from "@coral-xyz/anchor";
import { SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { supabase } from "@/app/config/supabase";

import {
	findConfigPDA,
	findGamePDA,
	findPeriodPDA,
	findPlayerDataPDA,
} from "@/app/config/pda";

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
import { useAtom } from "jotai";
import { useState } from "react";

export const useFetch = () => {
	const { connection } = useConnection();

	const [provider] = useAtom(providerAtom);
	const [program] = useAtom(programAtom);
	const [config, setConfig] = useAtom(configAtom);
	const [game, setGame] = useAtom(gameAtom);
	const [round, setRound] = useAtom(roundAtom);
	const [, setPeriod] = useAtom(periodAtom);
	const [, setLastPeriod] = useAtom(lastPeriodAtom);
	const [playerData, setPlayerData] = useAtom(playerDataAtom);
	const [, setPlayerPDA] = useAtom(playerPDAAtom);
	const [, setSquad] = useAtom(squadAtom);
	const [, setSquadList] = useAtom(squadListAtom);
	const [, setBalance] = useAtom(balanceAtom);
	const [, setVoucherAccount] = useAtom(voucherAccountAtom);
	const [, setVoucherBalance] = useAtom(voucherBalanceAtom);
	const [, setRegistered] = useAtom(registeredAtom);
	const [, setSquadLoading] = useAtom(squadLoadingAtom);

	const [tokenMintAccountAddress, setTokenMintAccountAddress] =
		useState<anchor.web3.PublicKey | null>(null);
	const [voucherMintAccountAddress, setVoucherMintAccountAddress] =
		useState<anchor.web3.PublicKey | null>(null);

	const getTokenAccountBalance = async () => {
		if (!provider || !connection || !config) {
			setTokenMintAccountAddress(null);
			setBalance(null);
			return;
		}
		try {
			const tokenMint = config?.tokenMint;
			const tokenMintAccountAddress = await getAssociatedTokenAddress(
				tokenMint!,
				provider.publicKey,
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
	};

	const getVoucherAccountBalance = async () => {
		if (!provider || !connection || !config) {
			setVoucherAccount(null);
			setVoucherMintAccountAddress(null);
			setVoucherBalance(null);
			return;
		}
		try {
			const voucherMint = config.voucherMint;
			const voucherMintAccountAddress = await getAssociatedTokenAddress(
				voucherMint,
				provider.publicKey,
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
	};

	const fetchConfig = async () => {
		if (!program) {
			setConfig(null);
			return;
		}
		try {
			const configPDA = findConfigPDA(program.programId);
			const configData = program
				? await program.account.config.fetch(configPDA)
				: null;
			setConfig(configData);
		} catch (error) {
			console.error("Error fetching config:", error);
		}
	};

	const fetchGame = async () => {
		if (!program) {
			setGame(null);
			return;
		}

		try {
			const gamePDA = findGamePDA(program.programId);
			const gameData = await program.account.game.fetch(gamePDA);
			setGame(gameData);
			getVoucherAccountBalance();
			getTokenAccountBalance();
		} catch (error) {
			console.error("Error fetching game:", error);
		}
	};

	const fetchRound = async () => {
		if (!program || !game) {
			setRound(null);
			setGame(null);
			return;
		}

		try {
			const roundData = await program.account.round.fetch(game.currentRound);
			setRound(roundData);
		} catch (error) {
			console.error("Error fetching round:", error);
			setRound(null);
		}
	};

	const fetchTransactions = async (addressArray: string[]) => {
		const query = supabase
			.from("squad")
			.select("*")
			.in("public_key", addressArray);

		const { data, error } = await query;

		if (error) throw error;

		return data;
	};

	const fetchPeriod = async () => {
		if (!program || !round || !game) {
			setPeriod(null);
			setLastPeriod([]);
			return;
		}
		try {
			const periodData = await program.account.period.fetch(
				round.currentPeriod,
			);

			const squadArray = periodData.topSquads.map((s) => s.squad.toString());
			const info = await fetchTransactions(squadArray);

			const accounts = periodData.topSquads.map((item) => {
				const squadInfo = info?.find(
					(i) => i.public_key === item.squad.toString(),
				);
				return {
					...item,
					info: {
						name: squadInfo.name,
						logoUrl: squadInfo.logo_url,
					},
				};
			});

			setPeriod({
				...periodData,
				topSquads: accounts,
			});

			if (periodData.periodNumber > 1) {
				const prevPeriodPromises = Array.from(
					{ length: periodData.periodNumber },
					async (_, i) => {
						try {
							const currentPeriodNumber = periodData.periodNumber - 1 - i;

							const prevPeriodPDA = findPeriodPDA(
								game.currentRound,
								currentPeriodNumber,
								program.programId,
							);
							const prevPeriodData = await program.account.period.fetch(
								prevPeriodPDA,
							);

							const squadArray = periodData.topSquads.map((s) =>
								s.squad.toString(),
							);
							const info = await fetchTransactions(squadArray);

							const accounts = periodData.topSquads.map((item) => {
								const squadInfo = info?.find(
									(i) => i.public_key === item.squad.toString(),
								);
								return {
									...item,
									info: squadInfo || null,
								};
							});

							return {
								...prevPeriodData,
								topSquads: accounts,
							};
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
		} catch (error) {
			console.error("Error fetching period:", error);
		}
	};

	const fetchPlayerData = async () => {
		if (!program || !provider || !provider.publicKey) {
			setPlayerPDA(SystemProgram.programId);
			setPlayerData(null);
			setRegistered(false);
			return;
		}

		try {
			const playerDataPDA = findPlayerDataPDA(
				provider.publicKey,
				program.programId,
			);
			setPlayerPDA(playerDataPDA);
			const playerData = await program.account.playerData.fetch(playerDataPDA);
			setPlayerData(playerData);
			setRegistered(
				playerData.player.toString() === provider.publicKey.toString(),
			);
		} catch (error) {
			console.error("Error fetching player data:", error);
			setRegistered(false);
		}
	};

	const fetchSquad = async () => {
		if (!program || !playerData || !playerData.squad) {
			setSquad(null);
			return;
		}
		setSquadLoading(true);
		try {
			const squadData = await program.account.squad.fetch(playerData.squad);
			setSquad(squadData);
		} catch (err) {
			console.error("Error fetching squad:", err);
		} finally {
			setSquadLoading(false);
		}
	};

	const fetchSquadList = async () => {
		if (!program) {
			setSquadList([]);
			return;
		}
		try {
			const squadListData = await program.account.squad.all();
			setSquadList(squadListData);
		} catch (err) {
			console.error("Error fetching squad list:", err);
		}
	};

	return {
		fetchConfig,
		fetchGame,
		fetchRound,
		fetchPeriod,
		fetchPlayerData,
		fetchSquad,
		fetchSquadList,

		tokenMintAccountAddress,
		voucherMintAccountAddress,
		getTokenAccountBalance,
		getVoucherAccountBalance,
	};
};
