import * as anchor from "@coral-xyz/anchor";
import { SystemProgram } from "@solana/web3.js";
import {
	useAnchorWallet,
	useConnection,
	useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useCallback, useRef } from "react";
import { useAtom } from "jotai";

import {
	programAtom,
	configAtom,
	gameAtom,
	roundAtom,
	periodAtom,
	playerDataAtom,
	squadAtom,
	squadListAtom,
	balanceAtom,
	voucherBalanceAtom,
	registeredAtom,
	squadLoadingAtom,
	lastPeriodAtom,
	providerAtom,
	RPCPendingAtom,
	rpcEndpointAtom,
} from "@/app/state";

import {
	findConfigPDA,
	findGamePDA,
	findPlayerDataPDA,
} from "@/app/config/pda";
import gameIdl from "@/idl/game.json";
import { Game as GameIdl } from "@/idl/game";
import { useFetch } from "./useFetch";
/**
 * Custom hook for managing global state and interactions with the Solana blockchain
 * @returns An object containing various functions and state for game interactions
 */
export function useGlobal() {
	const { connection } = useConnection();
	const wallet = useAnchorWallet();
	const { publicKey } = useWallet();
	const {
		fetchConfig,
		fetchGame,
		fetchPeriod,
		fetchPlayerData,
		fetchRound,
		fetchSquad,
		fetchSquadList,

		tokenMintAccountAddress,
		voucherMintAccountAddress,

		getTokenAccountBalance,
		getVoucherAccountBalance,
	} = useFetch();

	const [RPCPending, setRPCPending] = useAtom(RPCPendingAtom);
	const [rpcEndpoint] = useAtom(rpcEndpointAtom);
	const prevRpcEndpointRef = useRef(rpcEndpoint);
	const [, setProvider] = useAtom(providerAtom);
	const [program, setProgram] = useAtom(programAtom);
	const [game, setGame] = useAtom(gameAtom);
	const [config, setConfig] = useAtom(configAtom);
	const [round, setRound] = useAtom(roundAtom);
	const [, setPeriod] = useAtom(periodAtom);
	const [, setLastPeriod] = useAtom(lastPeriodAtom);
	const [playerData, setPlayerData] = useAtom(playerDataAtom);
	const [, setSquad] = useAtom(squadAtom);
	const [, setSquadList] = useAtom(squadListAtom);
	const [, setBalance] = useAtom(balanceAtom);
	const [, setVoucherBalance] = useAtom(voucherBalanceAtom);
	const [, setRegistered] = useAtom(registeredAtom);
	const [, setSquadLoading] = useAtom(squadLoadingAtom);

	// Set up config listener
	useEffect(() => {
		const programId = program ? program.programId : SystemProgram.programId;
		const configPDA = findConfigPDA(programId);
		const configListener = connection.onAccountChange(configPDA, fetchConfig);

		return () => {
			connection.removeAccountChangeListener(configListener);
		};
	}, [connection, program, fetchConfig]);

	// Set up game listener
	useEffect(() => {
		const programId = program ? program.programId : SystemProgram.programId;
		const gamePDA = findGamePDA(programId);
		const gameListener = connection.onAccountChange(gamePDA, fetchGame);

		return () => {
			connection.removeAccountChangeListener(gameListener);
		};
	}, [connection, program, fetchGame]);

	// Set up player data and balance listeners
	useEffect(() => {
		const _publicKey = publicKey ? publicKey : SystemProgram.programId;
		const programId = program ? program.programId : SystemProgram.programId;

		const playerDataPDA = findPlayerDataPDA(_publicKey, programId);
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
		const _tokenMintAccountAddress = tokenMintAccountAddress
			? tokenMintAccountAddress
			: SystemProgram.programId;
		const tokenAccountBalanceListener = connection.onAccountChange(
			_tokenMintAccountAddress,
			getTokenAccountBalance,
		);

		return () => {
			connection.removeAccountChangeListener(tokenAccountBalanceListener);
		};
	}, [connection, tokenMintAccountAddress, getTokenAccountBalance]);

	// Set up voucher balance listener
	useEffect(() => {
		const _voucherMintAccountAddress = voucherMintAccountAddress
			? voucherMintAccountAddress
			: SystemProgram.programId;
		const voucherMintAccountListener = connection.onAccountChange(
			_voucherMintAccountAddress,
			getVoucherAccountBalance,
		);

		return () => {
			connection.removeAccountChangeListener(voucherMintAccountListener);
		};
	}, [connection, voucherMintAccountAddress, getVoucherAccountBalance]);

	// Set up round listener
	useEffect(() => {
		const currentRound = game ? game.currentRound : SystemProgram.programId;
		const roundListener = connection.onAccountChange(currentRound, fetchRound);

		return () => {
			connection.removeAccountChangeListener(roundListener);
		};
	}, [connection, program, game, fetchRound]);

	// Set up squad listener
	useEffect(() => {
		const squad = playerData ? playerData.squad : SystemProgram.programId;
		const squadListener = connection.onAccountChange(squad, fetchSquad);

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
		const currentPeriod = round ? round.currentPeriod : SystemProgram.programId;

		const periodListener = connection.onAccountChange(
			currentPeriod,
			fetchPeriod,
		);

		return () => {
			connection.removeAccountChangeListener(periodListener);
		};
	}, [connection, program, round, fetchPeriod]);

	useEffect(() => {
		if (RPCPending) return;
		fetchConfig();
	}, [RPCPending, program]);

	useEffect(() => {
		if (RPCPending) return;
		fetchGame();
		fetchSquadList();
	}, [RPCPending, config]);

	useEffect(() => {
		if (RPCPending) return;
		fetchRound();
		fetchPlayerData();
	}, [RPCPending, game]);

	useEffect(() => {
		if (RPCPending) return;
		fetchPeriod();
	}, [RPCPending, game, round]);

	useEffect(() => {
		if (RPCPending) return;
		fetchSquad();
	}, [RPCPending, playerData]);

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
			setRPCPending(false);
		});
	}, []);

	// Fetch all data on initial load and when wallet connects
	// useEffect(() => {
	// 	if (!connection || !program) return;
	// 	fetchAllData();
	// }, [publicKey, connection, program, fetchAllData]);

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

	// useEffect(() => {
	// 	if (connection || provider || program) return;
	// 	reset();
	// }, [connection, provider, program, reset]);

	useEffect(() => {
		if (prevRpcEndpointRef.current !== rpcEndpoint) {
			setRPCPending(true);
			reset();
			prevRpcEndpointRef.current = rpcEndpoint;
		}
	}, [rpcEndpoint, reset]);

	// Clean up on disconnect
	// useEffect(() => {
	// 	if (!disconnecting) return;

	// 	setProgram(null);
	// 	setGame(null);
	// 	setRound(null);
	// 	setPlayerData(null);
	// 	// setPlayerRound(null);
	// 	setSquad(null);
	// 	setBalance(null);
	// 	setVoucherBalance(null);
	// 	setRegistered(false);
	// 	setSquadLoading(false);
	// }, [disconnecting]);

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
