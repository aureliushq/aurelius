import { Outlet } from '@remix-run/react'

import EffortLayout from '~/layouts/effort'

const EffortRoot = () => {
	return (
		<EffortLayout>
			<Outlet />
		</EffortLayout>
	)
}

export default EffortRoot
