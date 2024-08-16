import { Outlet } from '@remix-run/react'

import ViewLayout from '~/layouts/view'

const WritingSessionsRoot = () => {
	return (
		<ViewLayout>
			<Outlet />
		</ViewLayout>
	)
}

export default WritingSessionsRoot
