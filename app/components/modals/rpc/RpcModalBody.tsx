import { Connection } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { rpcEndpointAtom } from "@/app/state";
import { ButtonPrimary } from "../../buttons/Button";

import { isMainNet } from "@/app/utils/helpers";

interface ModalProps {
	modalClosed: () => void;
}

interface RpcEndpoint {
	name: string;
	url: string;
	network: "mainnet" | "devnet" | "testnet";
}

export const RpcModalBody: React.FC<ModalProps> = ({ modalClosed }) => {
	const { connection } = useConnection();
	const [rpcEndpoint, setRpcEndpoint] = useAtom(rpcEndpointAtom);
	const [tempRpc, setTempRpc] = useState(rpcEndpoint);
	const [isCustomRpc, setIsCustomRpc] = useState(false);

	const [rpcStatus, setRpcStatus] = useState<
		"idle" | "checking" | "success" | "error"
	>("idle");
	const [rpcError, setRpcError] = useState<string>("");

	const rpcArray: RpcEndpoint[] = useMemo(() => {
		return isMainNet
			? [
					{
						name: "Mainnet (Default)",
						url: "https://api.mainnet-beta.solana.com",
						network: "mainnet",
					},
			  ]
			: [
					{
						name: "Devnet",
						url: "https://api.devnet.solana.com",
						network: "devnet",
					},
			  ];
	}, []);

	useEffect(() => {
		const isCustom = !rpcArray.some((endpoint) => endpoint.url === rpcEndpoint);
		setIsCustomRpc(isCustom);
	}, [rpcEndpoint]);

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

			setRpcEndpoint(tempRpc);
			localStorage.setItem("rpcEndpoint", tempRpc);
			setRpcStatus("success");

			setTimeout(() => {
				modalClosed();
			}, 1000);
		} catch (err) {
			console.error("RPC connection failed:", err);
			setRpcStatus("error");
			setRpcError(
				err instanceof Error ? err.message : "Failed to connect to RPC",
			);
		}
	}, [connection, tempRpc, validateRpc, setRpcEndpoint, modalClosed]);

	const handleRpcChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const input = event.target.value;
			setTempRpc(input);
			if (input) {
				validateRpc(input);
			} else {
				setRpcError("");
				setRpcStatus("idle");
			}
		},
		[validateRpc],
	);

	const handleRadioChange = useCallback(
		(url: string, isCustom: boolean = false) => {
			setIsCustomRpc(isCustom);
			setRpcStatus("idle");
			setRpcError("");

			if (isCustom) {
				setTempRpc("");
			} else {
				setTempRpc(url);
			}
		},
		[],
	);

	return (
		<>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<label className='block text-sm font-medium text-gray-400'>
						RPC Endpoint
					</label>

					<div className='space-y-3'>
						{rpcArray.map((endpoint) => (
							<div
								key={endpoint.url}
								className='flex items-center space-x-3 cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg transition-colors'
								onClick={() => handleRadioChange(endpoint.url)}
							>
								<input
									type='radio'
									name='rpc-endpoint'
									className='cursor-pointer'
									checked={!isCustomRpc && tempRpc === endpoint.url}
									onChange={() => handleRadioChange(endpoint.url)}
								/>
								<div>
									<div className='text-sm font-medium'>{endpoint.name}</div>
									<div className='text-xs text-gray-400'>{endpoint.url}</div>
								</div>
							</div>
						))}

						<div
							className='flex items-center space-x-3 cursor-pointer hover:bg-gray-700/30 p-2 rounded-lg transition-colors'
							onClick={() => handleRadioChange("", true)}
						>
							<input
								type='radio'
								name='rpc-endpoint'
								className='cursor-pointer'
								checked={isCustomRpc}
								onChange={() => handleRadioChange("", true)}
							/>
							<span className='text-sm font-medium'>Custom RPC</span>
						</div>
					</div>
				</div>

				<div className='space-y-2'>
					<input
						type='text'
						value={tempRpc}
						onChange={handleRpcChange}
						className={`w-full px-4 py-2 bg-gray-800 border text-xs ${
							rpcError ? "border-red-500" : "border-gray-600"
						} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
							!isCustomRpc ? "opacity-50 cursor-not-allowed" : ""
						}`}
						placeholder='Enter custom RPC URL'
						disabled={!isCustomRpc}
					/>

					{rpcError && (
						<p className='text-sm text-red-500' role='alert'>
							{rpcError}
						</p>
					)}
				</div>

				<ButtonPrimary
					className='w-full py-2 rounded-lg relative'
					onClick={handleRpcUpdate}
					disabled={rpcStatus === "checking" || !tempRpc}
				>
					{rpcStatus === "checking" ? (
						<span className='flex items-center justify-center space-x-2'>
							<svg
								className='animate-spin h-5 w-5'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
							>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
								></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
								></path>
							</svg>
							<span>Connecting...</span>
						</span>
					) : (
						"Update RPC"
					)}
				</ButtonPrimary>

				{rpcStatus === "success" && (
					<div className='text-sm text-green-500 text-center' role='alert'>
						Successfully connected to RPC endpoint!
					</div>
				)}
			</div>
		</>
	);
};
