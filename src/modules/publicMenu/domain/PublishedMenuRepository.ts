import type { PublishedMenu } from './types'

export interface PublishedMenuRepository {
  get(): Promise<PublishedMenu>
}
