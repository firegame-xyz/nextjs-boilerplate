"use client";

import { useRef } from "react";

import { Modal, ModalHandles } from "@/app/components/modals/Modal";
import { LegalDisclaimerModalBody } from "@/app/components/modals/legalDisclaimer/LegalDisclaimerModalBody";

export default function LegalDisclaimerModal() {
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
					<h1>Legal Disclaimer</h1>
				</div>
			}
		>
			<LegalDisclaimerModalBody modalClosed={handleModalClose} />
		</Modal>
	);
}
