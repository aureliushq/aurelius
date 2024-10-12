import { useEffect, useState } from 'react'
import { FIRST_TIME_LOADED_KEY } from '~/lib/constants'

const useFirstVisit = () => {
	const [shouldRedirect, setShouldRedirect] = useState(
		localStorage.getItem(FIRST_TIME_LOADED_KEY) === 'true',
	)

	useEffect(() => {
		if (!shouldRedirect) {
			localStorage.setItem(FIRST_TIME_LOADED_KEY, 'true')
		}
	}, [shouldRedirect])

	return shouldRedirect
}

export default useFirstVisit
