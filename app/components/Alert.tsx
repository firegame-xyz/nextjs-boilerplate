import React from "react";

export default function Alert() {
	return (
		<>
			{/* <div className="flex justify-center bg-warning p-3 text-xs text-base-black">
        {`WARNING: Doomsday Ark is an experimental WEB3 game project by Fire Game. The project carries significant risks, including the possibility of failure. Please assess carefully and participate with caution!`}
      </div> */}
			<div className='flex justify-center p-2 text-xs text-base-black bg-warning'>
				{`WARNING: Doomsday Ark is an experimental WEB3 game project by Fire Game. The project carries significant risks, including the possibility of failure. Please assess carefully and participate with caution!`}
			</div>
		</>
	);
}
