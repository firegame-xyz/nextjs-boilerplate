import { NextResponse } from "next/server";
import * as anchor from "@coral-xyz/anchor";
import { web3, Idl } from "@coral-xyz/anchor";
import * as sb from "@switchboard-xyz/on-demand";
import {
	isMainNet,
	ON_DEMAND_MAINNET_PID,
	ON_DEMAND_DEVNET_PID,
	ON_DEMAND_MAINNET_QUEUE,
	ON_DEMAND_DEVNET_QUEUE,
} from "@/app/utils/helpers";

export async function POST(req: Request) {
	try {
		// console.log("Starting random number generation...");

		// Get appropriate network configuration based on environment
		const queue = isMainNet ? ON_DEMAND_MAINNET_QUEUE : ON_DEMAND_DEVNET_QUEUE;
		const sbProgramId = isMainNet
			? ON_DEMAND_MAINNET_PID
			: ON_DEMAND_DEVNET_PID;
		// const rpc = isMainNet ? ON_DEMAND_MAINNET_RPC : ON_DEMAND_DEVNET_RPC;

		// Extract wallet from request body
		const body = await req.json();
		const { wallet, publicKey, rpc } = body;

		// Initialize Solana connection with timeout
		const connection = new web3.Connection(decodeURIComponent(rpc), {
			commitment: "confirmed",
			confirmTransactionInitialTimeout: 60000, // 60 seconds timeout
		});
		// console.log("Created Solana connection");

		// Create Anchor provider with wallet
		const provider = new anchor.AnchorProvider(connection, wallet!, {});
		// console.log("Provider initialized");

		// Fetch Switchboard program IDL and create program instance
		const sbIdl = await anchor.Program.fetchIdl(sbProgramId, provider);
		const sbProgram = new anchor.Program(sbIdl as Idl, provider);
		// console.log("Switchboard program instance created");

		// Generate keypair for random number request
		const rngKp = anchor.web3.Keypair.generate();
		// console.log("Generated randomness keypair:", rngKp.publicKey.toString());

		// Create randomness request using Switchboard
		// console.log("Creating randomness request...");
		const [randomness, ix] = await sb.Randomness.create(
			sbProgram,
			rngKp,
			queue,
		);
		// console.log("Randomness request created successfully");

		const { blockhash } = await connection.getLatestBlockhash("finalized");

		const tx = new anchor.web3.Transaction().add(ix);
		tx.recentBlockhash = blockhash;
		tx.feePayer = new anchor.web3.PublicKey(publicKey);
		tx.partialSign(rngKp);

		const serializedTx = tx.serialize({ requireAllSignatures: false });

		// Prepare response with necessary data
		const response = {
			randomnessPubkey: randomness.pubkey.toBase58(),
			tx: serializedTx.toString("base64"),
			rngPublicKey: rngKp.publicKey.toBase58(),
			// rngKp: {
			// 	publicKey: rngKp.publicKey.toBase58(),
			// 	secretKey: Array.from(rngKp.secretKey),
			// },
		};

		return NextResponse.json(response);
	} catch (error) {
		// Enhanced error logging
		console.error("Error generating random number:", error);
		console.error(
			"Error stack trace:",
			error instanceof Error ? error.stack : "No stack trace available",
		);
		return NextResponse.json(
			{ error: "Failed to generate random number" },
			{ status: 500 },
		);
	}
}
