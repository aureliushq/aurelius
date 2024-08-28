import { renderToString } from 'react-dom/server'

const GettingStarted = () => {
	return (
		<>
			<p>Here is a short guide to get you started.</p>
			<h3>Navigating the app</h3>
			<ul>
				<li>
					<p>
						<strong>Main menu</strong> (<code>m</code>): You can
						access everything this app has to offer through the main
						menu.
					</p>
				</li>
				<li>
					<p>
						<strong>Keyboard shortcuts</strong>: Most actions in
						Aurelius can be performed by using keyboard shortcuts.
						You can see a list of shortcuts in the help dialog (
						<code>?</code>).
					</p>
				</li>
			</ul>
			<hr />
			<h3>Editor</h3>
			<p>
				Aurelius focuses on providing an excellent, distraction-free
				writing experience. The editor offers rich-text editing with
				essential formatting options accessible through a toolbar and
				familiar keyboard shortcuts. For added convenience, Markdown
				shortcuts are also supported. If you're unfamiliar with
				Markdown, here's a{' '}
				<a
					target='_blank'
					rel='noopener noreferrer nofollow'
					href='https://www.markdownguide.org/basic-syntax/'
				>
					great primer
				</a>
				.
			</p>
			<p>
				I hope the simplicity allows you to concentrate on your content
				rather than getting bogged down in complex formatting,
				potentially leading to more efficient and enjoyable writing
				sessions. I'm always looking for ways to improve the writing
				experience, so if you have feedback reach out to me via{' '}
				<a
					target='_blank'
					rel='noopener noreferrer nofollow'
					href='https://twitter.com/aurelius_ink'
				>
					X
				</a>
				.
			</p>
			<p>You can start editing this text to see how the editor works.</p>
			<p>
				<em>
					Important: Changes you make here are not saved. To save your
					work, create a new post (<code>p</code>).
				</em>
			</p>
			<hr />
			<h3>Saving your data</h3>
			<p>
				Aurelius automatically saves your work as you write. This helps
				you focus on your writing without worrying about losing your
				progress. If you're paranoid (like I sometimes am), you can save
				your work manually by pressing <code>ctrl-s</code>.
			</p>
			<p>
				<em>
					Important: Aurelius doesn't have user accounts, a server, or
					a database. All your data is stored on your device. To use
					Aurelius across multiple devices, you'll need to sync your
					data first. To sync your data, go to Preferences
				</em>
				(<code>p</code>)
				<em>
					, select 'Sync', then 'View Code', and follow the provided
					instructions. This ensures your writing is accessible
					wherever you need it.
				</em>
			</p>
			<hr />
			{/*<h3>Writing Efforts</h3>*/}
			{/*<p>*/}
			{/*	Writing Efforts are organizational tools for categorizing and*/}
			{/*	monitoring your writing projects. They function like folders for*/}
			{/*	similar content types. At the moment, there are four effort*/}
			{/*	types: journals, posts, essays, and books. A "Posts" effort is*/}
			{/*	created by default. You can add as many custom efforts as needed*/}
			{/*	to suit your writing goals and habits.*/}
			{/*</p>*/}
			{/*<ul>*/}
			{/*	<li>*/}
			{/*		<p>*/}
			{/*			To create a new writing effort: open the main menu{' '}*/}
			{/*			<code>ctrl/cmd-shift-m</code>, select New &gt; Writing*/}
			{/*			Effort (or press <code>w</code>)*/}
			{/*		</p>*/}
			{/*	</li>*/}
			{/*	<li>*/}
			{/*		<p>*/}
			{/*			To create a new post: open the main menu, select New*/}
			{/*			&gt; Post (or press <code>n</code>)*/}
			{/*		</p>*/}
			{/*	</li>*/}
			{/*</ul>*/}
			{/*<hr />*/}
			<h3>Writing Sessions</h3>
			<p>
				When you're ready to write, Writing Sessions help you focus by
				creating timed windows in your day. As you start each session,
				you'll set a goal - either a specific amount of time to write or
				a word count to reach. These structured sessions are designed to
				help you make the most of your writing time and stay on track
				with your projects.
			</p>
			<ul>
				<li>
					<p>
						To begin a new writing session: open the main menu,
						select 'Writing Sessions', then 'New Writing Session'.
						Alternatively, simply press the <code>w</code> key for a
						quick start.
					</p>
				</li>
			</ul>
			<hr />
			<h3>Focus Mode</h3>
			<p>
				Need to concentrate? Activate Focus Mode to hide all UI
				elements, leaving just you and your words. This distraction-free
				environment helps you immerse fully in your writing. It's
				perfect for when you need to dive deep into your work, whether
				you're brainstorming ideas or polishing a final draft. To toggle
				the Focus Mode, go to the main menu -&gt; Focus Mode or use the{' '}
				<code>f</code> shortcut.
			</p>
			<hr />
			<h3>Preferences</h3>
			<p>
				You can customize your experience in Aurelius, using the
				Preferences dialog (<code>,</code>).
			</p>
			<hr />
			<h3>Join the conversation</h3>
			<p>
				Follow us on{' '}
				<a
					target='_blank'
					rel='noopener noreferrer nofollow'
					href='https://www.instagram.com/aurelius_ink'
				>
					Instagram
				</a>{' '}
				and{' '}
				<a
					target='_blank'
					rel='noopener noreferrer nofollow'
					href='https://x.com/aurelius_ink'
				>
					X
				</a>{' '}
				for tips, inspiration, and updates.
			</p>
		</>
	)
}

export const content = renderToString(<GettingStarted />)
