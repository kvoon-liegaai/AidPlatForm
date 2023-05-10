import type { Observable } from 'rxjs'
import { http } from '../http'
import type { CreateEvaluationParams, EvaluationModel } from './evaluation.model'

export enum EvaluationApi {
  Base = 'evaluation',
}

export const createEvaluation = (params: CreateEvaluationParams) => {
  return http.post<EvaluationModel>(EvaluationApi.Base, params)
}

export function getAllEvaluation(): Observable<EvaluationModel[]> {
  return http.get<EvaluationModel[]>(EvaluationApi.Base)
}
