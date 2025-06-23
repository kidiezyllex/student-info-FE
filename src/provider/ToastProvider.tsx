"use client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => {
	return (
		<ToastContainer
			position="top-right"
			autoClose={4000}
			hideProgressBar={false}
			newestOnTop
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable	
			pauseOnHover
			theme="light"
			toastStyle={{
				overflow: 'hidden',
				borderRadius: '4px',
				fontSize: '14px',
				background: '#fff',
				color: '#5D7186',
				fontWeight: 500,
				boxShadow: '0 4px 24px 0 rgba(60,60,60,0.08)',
				padding: '16px 20px',
				minWidth: 320,
				maxWidth: 400,
				alignItems: 'center',
				display: 'flex',
				gap: '12px',
			}}
			toastClassName={(context) => {
				const type = context?.type || 'default';
				return `relative border-l-4 flex items-center ${
					type === 'success' ? 'border-l-mainSuccessV1' :
					type === 'error' ? 'border-l-mainDangerV1' :
					type === 'warning' ? 'border-l-mainWarningV1' :
					type === 'info' ? 'border-l-mainInfoV1' : 'border-l-mainTextHoverV1'
				}`;
			}}
		/>
	);
};
