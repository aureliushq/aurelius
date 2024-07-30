import { Theme } from 'remix-themes'

const LoadingScreen = ({ theme }: { theme: Theme | null }) => {
	return (
		<div className='w-screen h-screen flex justify-center items-center'>
			{/*{theme && theme === 'dark' ? (*/}
			{/*	<img*/}
			{/*		className='h-32 object-fit object-cover'*/}
			{/*		src='/images/logo_animated_dark.gif'*/}
			{/*	/>*/}
			{/*) : (*/}
			{/*	<img*/}
			{/*		className='h-32 object-fit object-cover'*/}
			{/*		src='/images/logo_animated.gif'*/}
			{/*	/>*/}
			{/*)}*/}
			<span>Loading...</span>
		</div>
	)
}

export default LoadingScreen
