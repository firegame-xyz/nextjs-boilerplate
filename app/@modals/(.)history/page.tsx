"use client";

import { useEffect, useMemo, useRef } from "react";
import { Modal, ModalHandles } from "@/app/components/modals/Modal";
import HistoryModalBody from "@/app/components/modals/history/HistoryModalBody";

export default function HistoryModal() {
	const modalRef = useRef<ModalHandles>(null);

	const MemoizedHistoryList = useMemo(() => <HistoryModalBody />, []);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

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
