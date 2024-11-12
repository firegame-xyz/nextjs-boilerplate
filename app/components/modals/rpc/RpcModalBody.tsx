import { Connection } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useCallback } from "react";
import { useAtom } from "jotai";

import { rpcEndpointAtom } from "@/app/state";
import { ButtonPrimary } from "../../buttons/Button";

interface ModalProps {
	modalClosed: () => void;
}

export const RpcModalBody: React.FC<ModalProps> = ({ modalClosed }) => {
	const { connection } = useConnection();
	const wallet = useWallet();
	const [rpcEndpoint, setRpcEndpoint] = useAtom(rpcEndpointAtom);
	const [tempRpc, setTempRpc] = useState(rpcEndpoint);

	const [rpcStatus, setRpcStatus] = useState<
		"idle" | "checking" | "success" | "error"
	>("idle");
	const [rpcError, setRpcError] = useState<string>("");

	const validateRpc = useCallback((input: string) => {
		if (!input) {
			setRpcError("RPC endpoint cannot be empty");
			setRpcStatus("error");
			return false;
		}
		try {
			new URL(input);
			setRpcError("");
			return true;
		} catch (error) {
			setRpcError("Invalid RPC URL");
			setRpcStatus("error");
			return false;
		}
	}, []);

	const handleRpcUpdate = useCallback(async () => {
		if (!validateRpc(tempRpc)) {
			return;
		}

		setRpcStatus("checking");
		try {
			const testConnection = new Connection(tempRpc, connection.commitment);
			const version = await testConnection.getVersion();
			// console.log("Connected to Solana node version:", version);

			setRpcEndpoint(tempRpc);
			// localStorage.setItem("rpcEndpoint", tempRpc);

			setRpcStatus("success");

			modalClosed();
		} catch (err) {
			console.error("RPC connection failed:", err);
			setRpcStatus("error");
			setRpcError(
				err instanceof Error ? err.message : "Failed to connect to RPC",
			);
		}
	}, [connection, wallet, tempRpc, validateRpc, setRpcEndpoint, modalClosed]);

	const handleRpcChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target.value;
			setTempRpc(input);
			validateRpc(input);
		},
		[validateRpc],
	);

	const devRpcEndpoints = [
		{
			name: "Devnet",
			url: "https://api.devnet.solana.com",
		},
		{
			name: "Testnet",
			url: "https://api.testnet.solana.com",
		},
		{
			name: "Mainnet Beta",
			url: "https://api.mainnet-beta.solana.com",
		},
	];

	return (
		<div>
			<div className='mb-4'>
				<div className='mb-2 text-sm text-gray-400'>Select Network:</div>
				<div className='flex flex-wrap gap-2'>
					{devRpcEndpoints.map((endpoint) => (
						<ButtonPrimary
							key={endpoint.name}
							className='text-sm'
							onClick={() => {
								setTempRpc(endpoint.url);
								validateRpc(endpoint.url);
							}}
						>
							{endpoint.name}
						</ButtonPrimary>
					))}
				</div>
			</div>
			<div className='flex w-full gap-2'>
				<input
					type='text'
					value={tempRpc}
					onChange={handleRpcChange}
					className='input-base flex-1 rounded-md'
					placeholder='Enter RPC URL'
					autoComplete='off'
					spellCheck='false'
				/>
				<ButtonPrimary
					className='min-w-[80px] rounded-md'
					onClick={handleRpcUpdate}
					disabled={rpcStatus === "checking"}
				>
					{rpcStatus === "checking" ? "Checking..." : "Save"}
				</ButtonPrimary>
			</div>
			{rpcError && <div className='mt-2 text-sm text-red-500'>{rpcError}</div>}
			{rpcStatus === "success" && (
				<div className='mt-2 text-sm text-green-500'>Connection successful</div>
			)}
		</div>
	);
};
