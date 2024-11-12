"use client";

import { useRef } from "react";

import { Modal, ModalHandles } from "@/app/components/modals/Modal";
import { RuleModalBody } from "@/app/components/modals/rule/RuleModalBody";

export default function RuleModal() {
	const modalRef = useRef<ModalHandles>(null);

	const handleModalClose = () => {
		modalRef.current?.triggerClose();
	};

	return (
		<Modal
			className='lg:w-[596px]'
			ref={modalRef}
			show={true}
			redirect={true}
			title={
				<div>
					<h1>Game Rule</h1>
				</div>
			}
		>
			<RuleModalBody modalClosed={handleModalClose} />
		</Modal>
	);
}
