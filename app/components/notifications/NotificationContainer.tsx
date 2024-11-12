import { Notification as NotificationData } from "@/app/notifications";
import { clx } from "@/app/utils/helpers";

import { Notification } from "./Notification";

interface Props {
	children?: React.ReactNode;
	className?: string;
	notifications?: NotificationData[];
}

export const NotificationContainer: React.FC<Props> = ({
	children,
	className,
	notifications,
}) => {
	return (
		<div
			className={clx(
				"container sticky top-24 z-[9999] mx-auto h-0 px-6",
				className,
			)}
		>
			<div className='absolute -top-3 right-0 flex max-w-max flex-col gap-y-3 overflow-x-hidden pr-6 pt-3'>
				{notifications?.map((notification: NotificationData) => (
					<Notification
						key={notification.id}
						id={notification.id}
						titleArea={notification.title}
						type={notification.type}
						messageArea={notification.message}
					/>
				))}
			</div>
			{children}
		</div>
	);
};
