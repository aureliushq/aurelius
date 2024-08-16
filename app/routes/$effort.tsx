import { Outlet } from '@remix-run/react'

import ViewLayout from '~/layouts/view'

const EffortRoot = () => {
	return (
		<ViewLayout>
			<Outlet />
		</ViewLayout>
	)
}

export default EffortRoot
