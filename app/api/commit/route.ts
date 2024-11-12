import { NextResponse } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import { Idl } from "@coral-xyz/anchor";
import * as sb from "@switchboard-xyz/on-demand";
import {
	isMainNet,
	ON_DEMAND_MAINNET_PID,
	ON_DEMAND_DEVNET_PID,
	ON_DEMAND_MAINNET_QUEUE,
	ON_DEMAND_DEVNET_QUEUE,
	ON_DEMAND_MAINNET_RPC,
	ON_DEMAND_DEVNET_RPC,
} from "@/app/utils/helpers";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { wallet, randomnessPubkey } = body;

		const queue = isMainNet ? ON_DEMAND_MAINNET_QUEUE : ON_DEMAND_DEVNET_QUEUE;
		const sbProgramId = isMainNet
			? ON_DEMAND_MAINNET_PID
			: ON_DEMAND_DEVNET_PID;
		const rpc = isMainNet ? ON_DEMAND_MAINNET_RPC : ON_DEMAND_DEVNET_RPC;

		// Create Solana connection
		const connection = new anchor.web3.Connection(rpc, {
			commitment: "confirmed",
			confirmTransactionInitialTimeout: 60000,
		});

		const provider = new anchor.AnchorProvider(connection, wallet, {});
		const sbIdl = await anchor.Program.fetchIdl(sbProgramId, provider);
		const sbProgram = new anchor.Program(sbIdl as Idl, provider);

		// Reconstruct randomness instance
		const randomness = new sb.Randomness(
			sbProgram,
			new anchor.web3.PublicKey(randomnessPubkey),
		);

		// Generate commit instruction
		const commitIx = await randomness.commitIx(queue);

		const response = {
			commitIx,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error generating commit instruction:", error);
		return NextResponse.json(
			{ error: "Failed to generate commit instruction" },
			{ status: 500 },
		);
	}
}
