import DefaultLayout from '~/layouts/default'

const About = () => {
	return (
		<DefaultLayout>
			<div className='relative prose dark:prose-invert flex flex-col justify-center gap-12 px-6 lg:px-8'>
				<div className='flex w-full flex-col items-start text-white'>
					<h1 className='mb-4 text-center text-white'>About</h1>
				</div>
				<div className='flex w-full flex-col items-start gap-4 leading-loose text-white'>
					<span>
						Aurelius was born from my personal quest for the perfect
						writing app. After exploring countless options - from
						code editors to note-taking apps - I couldn't find one
						that truly supported a consistent writing habit while
						prioritizing privacy and simplicity.
					</span>
					<span>
						I envisioned an app that would nurture writing habits
						while providing an enjoyable experience and a secure
						environment for user data. Aurelius is designed with a
						local-first approach, meaning your data primarily
						resides on your device, not on remote servers. This
						ensures your writing remains private and under your
						control.
					</span>
					<span>
						I'm committed to keep Aurelius running in the long term,
						but I understand that circumstances beyond my control
						might affect its operations. That's why I've taken extra
						steps to ensure its longevity and accessibility. The
						entire source code is available on GitHub, allowing
						users (with some technical knowledge) to host Aurelius
						wherever they prefer.
					</span>
					<span>
						Additionally, I'm working on making your data portable.
						This means that even if Aurelius were to cease existing,
						you'd still have full access to your writing in a format
						you can use elsewhere. Your words and ideas will always
						remain yours, accessible and transferable, regardless of
						the app's future.
					</span>
					<span>
						This approach ensures that your writing tool and, more
						importantly, your content remains available and under
						your control, no matter what.
					</span>
					<div className='flex w-full flex-col items-start text-white'>
						<h2 className='mb-4 text-center text-white'>Credits</h2>
					</div>
					<div className='flex w-full flex-col items-start gap-4 leading-loose text-white'>
						<span>
							Aurelius wouldn't be possible without the work of
							many talented individuals and open-source projects.
							I'm grateful for the following projects that have
							allowed me to build Aurelius:
						</span>
						<ul>
							<li>
								<a
									href='https://remix.run/'
									target='_blank'
									rel='noreferrer'
									className='text-primary underline'
								>
									Remix
								</a>{' '}
								- Delightful React meta-framework that powers
								Aurelius
							</li>
							<li>
								<a
									href='https://evolu.dev/'
									target='_blank'
									rel='noreferrer'
									className='text-primary underline'
								>
									Evolu
								</a>{' '}
								- Library that powers Aurelius' local-first,
								sync, and end-to-end encryption features
							</li>
							<li>
								<a
									href='https://ui.shadcn.com/'
									target='_blank'
									rel='noreferrer'
									className='text-primary underline'
								>
									Shadcn UI
								</a>{' '}
								- Beautiful UI components that make Aurelius
								beautiful
							</li>
							<li>
								<a
									href='https://popsy.co/'
									target='_blank'
									rel='noreferrer'
									className='text-primary underline'
								>
									Popsy
								</a>{' '}
								- Source of the beautiful illustrations that I
								use throughout the app
							</li>
						</ul>
					</div>
					{/*<div className='flex w-full flex-col items-start gap-4 leading-loose text-white'>*/}
					{/*	<span>*/}
					{/*		And a special thanks to the following people for*/}
					{/*		helping me test Aurelius and providing valuable*/}
					{/*		feedback:*/}
					{/*	</span>*/}
					{/*	<ul>*/}
					{/*		<li>*/}
					{/*			<a*/}
					{/*				href='https://www.instagram.com/reflex__god_/'*/}
					{/*				target='_blank'*/}
					{/*				rel='noreferrer'*/}
					{/*				className='text-primary underline'*/}
					{/*			>*/}
					{/*				Sreenivasan*/}
					{/*			</a>{' '}*/}
					{/*		</li>*/}
					{/*		<li>*/}
					{/*			<a*/}
					{/*				href='https://www.instagram.com/raj.rk98/'*/}
					{/*				target='_blank'*/}
					{/*				rel='noreferrer'*/}
					{/*				className='text-primary underline'*/}
					{/*			>*/}
					{/*				Rajkumar*/}
					{/*			</a>{' '}*/}
					{/*		</li>*/}
					{/*	</ul>*/}
					{/*</div>*/}
				</div>
			</div>
		</DefaultLayout>
	)
}

export default About
