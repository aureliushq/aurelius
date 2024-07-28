const SuspenseFallback = () => {
	return (
		<div className='w-screen h-screen flex justify-center items-center'>
			<video src='/images/loading_animation.webm' loop />
		</div>
	)
}

export default SuspenseFallback
