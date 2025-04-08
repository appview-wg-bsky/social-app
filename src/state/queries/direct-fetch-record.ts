import {type AppBskyEmbedRecord, AppBskyFeedPost, AtUri} from '@atproto/api'
import {type ProfileViewBasic} from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import {useQuery} from '@tanstack/react-query'

import {retry} from '#/lib/async/retry'
import {STALE} from '#/state/queries'
import {useAgent} from '#/state/session'
import * as bsky from '#/types/bsky'

const RQKEY_ROOT = 'direct-fetch-record'
export const RQKEY = (uri: string) => [RQKEY_ROOT, uri]

export function useDirectFetchRecord({
  uri,
  enabled,
}: {
  uri: string
  enabled?: boolean
}) {
  const agent = useAgent()
  return useQuery<AppBskyEmbedRecord.ViewRecord | undefined>({
    staleTime: STALE.HOURS.ONE,
    queryKey: RQKEY(uri || ''),
    async queryFn() {
      const urip = new AtUri(uri)

      if (!urip.host.startsWith('did:')) {
        const res = await agent.resolveHandle({
          handle: urip.host,
        })
        urip.host = res.data.did
      }

      try {
        // TODO: parallel, series fetch sucks there isn't a dependency
        const profile = (await agent.getProfile({actor: urip.host})).data
        const {data} = await retry(
          2,
          e => {
            if (e.message.includes(`Could not locate record:`)) {
              return false
            }
            return true
          },
          () =>
            agent.api.com.atproto.repo.getRecord({
              repo: urip.host,
              collection: 'app.bsky.feed.post',
              rkey: urip.rkey,
            }),
        )
        if (
          data.value &&
          bsky.validate(data.value, AppBskyFeedPost.validateRecord)
        ) {
          const record = data.value
          return {
            $type: 'app.bsky.embed.record#viewRecord',
            uri,
            author: profile as ProfileViewBasic,
            cid: '',
            value: record,
            indexedAt: record.createdAt,
          } satisfies AppBskyEmbedRecord.ViewRecord
        } else {
          return undefined
        }
      } catch (e) {
        console.error(e)
        return undefined
      }
    },
    enabled: enabled && !!uri,
  })
}
