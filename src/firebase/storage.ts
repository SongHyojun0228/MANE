import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

/** 시술 사진 업로드 (고객별 폴더에 저장) */
export async function uploadServicePhoto(
  userId: string,
  customerId: string,
  file: File
): Promise<string> {
  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name}`
  const storageRef = ref(storage, `users/${userId}/customers/${customerId}/${fileName}`)

  await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(storageRef)
  return downloadURL
}

/** 사진 삭제 (URL에서 경로 추출하여 삭제) */
export async function deleteServicePhoto(photoUrl: string): Promise<void> {
  // Firebase Storage URL에서 경로 추출
  const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/'
  if (!photoUrl.startsWith(baseUrl)) return

  try {
    const pathStart = photoUrl.indexOf('/o/') + 3
    const pathEnd = photoUrl.indexOf('?')
    const encodedPath = photoUrl.substring(pathStart, pathEnd)
    const path = decodeURIComponent(encodedPath)

    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Failed to delete photo:', error)
  }
}
