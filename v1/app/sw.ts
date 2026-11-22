import { setupPwa } from '@vite-pwa/remix/sw'

import { setupRoutes } from './sw-routes'

declare const self: ServiceWorkerGlobalScope

setupPwa({ manifest: self.__WB_MANIFEST })

setupRoutes()
