import {useQuery} from '@tanstack/react-query'

import {ZEPPELIN_APPVIEW_SERVICE} from '#/lib/constants'

interface ServiceConfig {
  checkEmailConfirmed: boolean
}

export function useServiceConfigQuery() {
  return useQuery({
    queryKey: ['service-config'],
    queryFn: async () => {
      const res = await fetch(
        `${ZEPPELIN_APPVIEW_SERVICE}/xrpc/app.bsky.unspecced.getConfig`,
      )
      if (!res.ok) {
        return {
          checkEmailConfirmed: false,
        }
      }

      const json = await res.json()
      return json as ServiceConfig
    },
    staleTime: 5 * 60 * 1000,
  })
}
