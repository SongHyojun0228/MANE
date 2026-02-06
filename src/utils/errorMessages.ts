// Firebase 에러 메시지를 사용자 친화적으로 변환
export function getFirebaseErrorMessage(error: any): string {
  const errorCode = error?.code || ''
  const errorMessage = error?.message || ''

  // Auth 에러
  if (errorCode.startsWith('auth/')) {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return '이메일 또는 비밀번호가 올바르지 않습니다.'
      case 'auth/email-already-in-use':
        return '이미 사용 중인 이메일입니다.'
      case 'auth/weak-password':
        return '비밀번호는 6자 이상이어야 합니다.'
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 형식입니다.'
      case 'auth/network-request-failed':
        return '네트워크 연결을 확인해주세요.'
      case 'auth/too-many-requests':
        return '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.'
      case 'auth/user-disabled':
        return '비활성화된 계정입니다. 관리자에게 문의하세요.'
      default:
        return '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
    }
  }

  // Firestore 에러
  if (errorCode.startsWith('firestore/') || errorCode.startsWith('permission-denied')) {
    switch (errorCode) {
      case 'firestore/permission-denied':
      case 'permission-denied':
        return '접근 권한이 없습니다. 다시 로그인해주세요.'
      case 'firestore/unavailable':
        return '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.'
      case 'firestore/not-found':
        return '요청한 데이터를 찾을 수 없습니다.'
      default:
        return '데이터 처리 중 오류가 발생했습니다.'
    }
  }

  // Storage 에러
  if (errorCode.startsWith('storage/')) {
    switch (errorCode) {
      case 'storage/unauthorized':
        return '파일 업로드 권한이 없습니다.'
      case 'storage/canceled':
        return '파일 업로드가 취소되었습니다.'
      case 'storage/unknown':
        return '파일 업로드 중 오류가 발생했습니다.'
      case 'storage/quota-exceeded':
        return '저장 공간이 부족합니다.'
      case 'storage/unauthenticated':
        return '로그인이 필요합니다.'
      default:
        return '파일 처리 중 오류가 발생했습니다.'
    }
  }

  // 네트워크 에러
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('Failed to fetch') ||
    errorCode === 'unavailable'
  ) {
    return '네트워크 연결을 확인해주세요.'
  }

  // 기본 에러 메시지
  return '오류가 발생했습니다. 다시 시도해주세요.'
}

// 일반적인 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK: '네트워크 연결을 확인해주세요.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
  IMAGE_UPLOAD: '이미지 업로드에 실패했습니다.',
  IMAGE_SIZE: '이미지 크기는 5MB를 초과할 수 없습니다.',
  REQUIRED_FIELD: '필수 항목을 입력해주세요.',
  INVALID_INPUT: '올바른 형식으로 입력해주세요.',
} as const
