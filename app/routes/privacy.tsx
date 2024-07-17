const PrivacyPolicy = () => {
	return (
		<div className='flex min-h-[calc(100vh-10rem)] w-full flex-col'>
			<div className='relative prose dark:prose-invert mx-auto flex w-full max-w-2xl flex-col justify-center gap-12 px-6 py-20 sm:py-32 lg:px-8 lg:py-40'>
				<div className='flex w-full flex-col items-start text-white'>
					<h1 className='mb-4 text-center text-white'>Privacy</h1>
					<div className='flex flex-col gap-2'>
						<span className='text-sm text-gray-500'>
							Last Updated: July 17, 2024
						</span>
						<span className='text-sm text-gray-500'>
							Next Update: Never
						</span>
					</div>
				</div>
				<div className='flex w-full flex-col items-start leading-loose text-white'>
					<span>
						At Aurelius, your privacy isn't just a priority - it's
						the cornerstone of the entire application. As a solo
						developer, I've built Aurelius with your privacy at the
						forefront, ensuring that your personal information and
						writing remain solely yours.
					</span>
					<h2>Local-first data storage</h2>
					<span>
						When you use Aurelius, your data stays right where it
						belongs - on your device. I believe you should have full
						control over your work, so I've designed the app to keep
						your information local. This means you don't have to
						worry about your private thoughts or drafts being stored
						on some distant server.
					</span>
					<h2>End-to-end encryption</h2>
					<span>
						Whenever your data does need to travel, I've got you
						covered. Aurelius uses top-notch encryption to keep your
						information safe as it moves between your device and the
						services. It's like sending your writing in an
						unbreakable lockbox that only you have the key to. Even
						if someone intercepted it, they couldn't peek inside.
					</span>
					<h2>No tracking or analytics</h2>
					<span>
						Aurelius also respects your right to write in peace,
						without feeling watched. That's why Aurelius doesn't use
						any cookies or tracking tools. Your writing habits,
						preferences, and ideas are your business, not mine. I'm
						here to provide a great writing experience, not to
						analyze your every move.
					</span>
					<br />
					<span>
						I'm committed to your privacy down to the smallest
						detail. Even when it comes to external services like
						fonts, I've handpicked options that respect your
						privacy. You can write with peace of mind, knowing that
						every aspect of Aurelius, including these external
						elements, has been chosen to ensure zero tracking. Your
						writing experience remains private and unmonitored, just
						as it should be.
					</span>
					<br />
					<span>
						In short, with Aurelius, what you write stays between
						you and your devices. My role is simply to make the
						writing part easier and more enjoyable.
					</span>
				</div>
			</div>
		</div>
	)
}

export default PrivacyPolicy
