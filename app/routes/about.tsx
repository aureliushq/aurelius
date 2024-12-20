import DefaultLayout from '~/layouts/default'

const About = () => {
	return (
		<DefaultLayout>
			<div className='relative mx-auto prose dark:prose-invert flex flex-col justify-center gap-12 px-6 lg:px-8'>
				<div className='flex w-full flex-col items-start'>
					<h1 className='mb-4 text-center'>About</h1>
				</div>
				<div className='flex w-full flex-col items-start gap-4 leading-loose'>
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
						entire source code is available on{' '}
						<a
							className='text-primary underline'
							href='https://github.com/aureliushq/aurelius'
							rel='noreferrer'
							target='_blank'
						>
							GitHub
						</a>
						, allowing users (with some technical knowledge) to host
						Aurelius wherever they prefer.
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
					<div className='flex w-full flex-col items-start'>
						<h2 className='mb-4 text-center'>Credits</h2>
					</div>
					<div className='flex w-full flex-col items-start gap-4 leading-loose'>
						<span>
							Aurelius wouldn't be possible without the work of
							many talented individuals and open-source projects.
							I'm grateful for the following projects that have
							allowed me to build Aurelius:
						</span>
						<ul>
							<li>
								<a
									className='text-primary underline'
									href='https://remix.run/'
									rel='noreferrer'
									target='_blank'
								>
									Remix
								</a>{' '}
								- Delightful React meta-framework that powers
								Aurelius
							</li>
							<li>
								<a
									className='text-primary underline'
									href='https://vite.dev/'
									rel='noreferrer'
									target='_blank'
								>
									Vite
								</a>{' '}
								- Blazing-fast build tool with excellent
								developer experience
							</li>
							<li>
								<a
									className='text-primary underline'
									href='https://vite-pwa-org.netlify.app/'
									rel='noreferrer'
									target='_blank'
								>
									PWA Vite Plugin
								</a>{' '}
								- PWA plugin for Vite that makes Aurelius a PWA
								and provides offline support
							</li>
							<li>
								<a
									className='text-primary underline'
									href='https://tiptap.dev/'
									rel='noreferrer'
									target='_blank'
								>
									Tiptap
								</a>{' '}
								- Headless editor framework that powers
								Aurelius' editor
							</li>
							<li>
								<a
									className='text-primary underline'
									href='https://evolu.dev/'
									rel='noreferrer'
									target='_blank'
								>
									Evolu
								</a>{' '}
								- Library that powers Aurelius' local-first,
								sync, and end-to-end encryption features
							</li>
							<li>
								<a
									className='text-primary underline'
									href='https://ui.shadcn.com/'
									rel='noreferrer'
									target='_blank'
								>
									Shadcn UI
								</a>{' '}
								- Beautiful UI components that make Aurelius
								beautiful
							</li>
							<li>
								<a
									className='text-primary underline'
									href='https://popsy.co/'
									rel='noreferrer'
									target='_blank'
								>
									Popsy
								</a>{' '}
								- Source of the beautiful illustrations that I
								use throughout the app
							</li>
						</ul>
					</div>
					<div className='flex w-full flex-col items-start gap-4 leading-loose'>
						<span>
							And a special thanks to the following people for
							helping me test Aurelius, fixing issues, and
							providing valuable feedback:
						</span>
						<ul>
							<li>
								{/*<a*/}
								{/*	href='https://www.instagram.com/reflex__god_/'*/}
								{/*	target='_blank'*/}
								{/*	rel='noreferrer'*/}
								{/*	className='text-primary underline'*/}
								{/*>*/}
								Sreenivasan
								{/*</a>{' '}*/}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</DefaultLayout>
	)
}

export default About
