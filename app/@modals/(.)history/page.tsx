"use client";

import { useMemo, useRef } from "react";
import HistoryModalBody from "@/app/components/modals/history/HistoryModalBody";
import { Modal, ModalHandles } from "@/app/components/modals/Modal";
import { useQueryData } from "@/app/hooks/useData";
import { useWallet } from "@solana/wallet-adapter-react";

export default function HistoryModal() {
	const { publicKey } = useWallet();
	const modalRef = useRef<ModalHandles>(null);
	const { transactions } = useQueryData(publicKey?.toString());

	const MemoizedHistoryList = useMemo(
		() => <HistoryModalBody data={transactions} />,
		[transactions],
	);

	return (
		<Modal
			className='lg:w-[596px]'
			ref={modalRef}
			show={true}
			redirect={true}
			title={
				<div>
					<h1>History</h1>
				</div>
			}
		>
			{MemoizedHistoryList}
		</Modal>
	);
}
