/**
 * 전체 플로우에서 최종적으로 완성되는 데이터
 */
export interface UserData {
  name: string;
  drama: string;
  customDramaName?: string;
  region: string;
  visitingFrom: string;
  travelStyle: string[];
  travelDates: string;
}

/**
 * 작성 중인 데이터 (App에서 사용하는 상태)
 */
export type DraftUserData = Partial<UserData>;

/**
 * 플로우 단계
 */
export type Step =
  | 'hero'
  | 'drama'
  | 'region'
  | 'form'
  | 'preview'
  | 'result';

  export function isCompleteUserData(data: DraftUserData): data is UserData {
  return (
    typeof data.name === 'string' &&
    typeof data.drama === 'string' &&
    typeof data.region === 'string' &&
    typeof data.visitingFrom === 'string' &&
    Array.isArray(data.travelStyle) &&
    typeof data.travelDates === 'string'
  );
}