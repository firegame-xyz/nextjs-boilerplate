import { ReactNode, createContext, useContext, useReducer } from "react";

import { NotificationContainer } from "@/app/components/notifications/NotificationContainer";

export const NotificationContextProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [state, dispatch] = useReducer(notificationReducer, initialState);

	const add = (type: string, title: ReactNode, message: ReactNode) => {
		const id = Math.floor(Math.random() * 10000000);
		dispatch({
			type: "ADD_NOTIFICATION",
			payload: { id, title, message, type } as Notification,
		});
	};

	const pendingAdd = (
		type: string,
		id: number,
		title: ReactNode,
		message: ReactNode,
	) => {
		dispatch({
			type: "ADD_NOTIFICATION",
			payload: { id, title, message, type } as Notification,
		});
	};

	const remove = (id: number) => {
		dispatch({ type: "DELETE_NOTIFICATION", payload: id });
	};

	const clear = () => {
		dispatch({ type: "CLEAR_NOTIFICATION", payload: null });
	};

	const pending = (id: number, title: ReactNode, message?: ReactNode) => {
		pendingAdd("pending", id, title, message);
	};
	const success = (title: ReactNode, message?: ReactNode) => {
		add("success", title, message);
	};

	const warning = (title: ReactNode, message?: ReactNode) => {
		add("warning", title, message);
	};

	const info = (title: ReactNode, message?: ReactNode) => {
		add("info", title, message);
	};

	const error = (title: ReactNode, message?: ReactNode) => {
		add("error", title, message);
	};

	const value = { success, warning, info, error, remove, clear, pending };

	return (
		<NotificationContext.Provider value={value}>
			<NotificationContainer notifications={state.notifications} />
			{children}
		</NotificationContext.Provider>
	);
};

type NotificationContextType = {
	pending: (id: number, title: ReactNode, message?: ReactNode) => void;
	success: (title: ReactNode, message?: ReactNode) => void;
	warning: (title: ReactNode, message?: ReactNode) => void;
	info: (title: ReactNode, message?: ReactNode) => void;
	error: (title: ReactNode, message?: ReactNode) => void;
	remove: (id: number) => void;
	clear: () => void;
};

const initialState = {
	notifications: [],
};

export interface Notification {
	id: number;
	title: ReactNode;
	message?: ReactNode;
	type: string;
}

export const NotificationContext =
	createContext<NotificationContextType | null>(null);

interface NotificationState {
	notifications: Notification[];
}

type NotificationAction =
	| { type: "ADD_NOTIFICATION"; payload: Notification }
	| { type: "DELETE_NOTIFICATION"; payload: number }
	| { type: "CLEAR_NOTIFICATION"; payload: null };

export const notificationReducer = (
	state: NotificationState,
	action: NotificationAction,
) => {
	switch (action.type) {
		case "ADD_NOTIFICATION":
			return {
				...state,
				notifications: [...state.notifications, action.payload],
			};
		case "DELETE_NOTIFICATION":
			const updatedNotifications = state.notifications.filter(
				(notification: Notification) => notification.id !== action.payload,
			);
			return {
				...state,
				notifications: updatedNotifications,
			};
		case "CLEAR_NOTIFICATION":
			return {
				...state,
				notifications: [],
			};
		default:
			// const _exhaustiveCheck: never = action;
			throw new Error(`Unhandled action type`);
	}
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === null) {
		throw new Error(
			"useNotification must be used within NotificationContextProvider",
		);
	}
	return context;
};
