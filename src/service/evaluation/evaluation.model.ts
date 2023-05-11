import type { UserModel } from '../auth/auth.model'
import type { HelpResourceModel } from '../resource/resource.model'

export interface CreateEvaluationParams {
  briefs: string[]
  description: string
  ratingScore: 1 | 2 | 3 | 4 | 5
  hrId: number
  targetUserId: number
}

export interface EvaluationModel {
  id: number

  briefs: string
  description: string
  ratingScore: 1 | 2 | 3 | 4 | 5
  hr: HelpResourceModel
  user: UserModel
  targetUser: UserModel
}
