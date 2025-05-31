import { Query, ID } from "appwrite";
import { database, storage, appwriteConfig } from "./client";

export async function getQuestions(examTimes: string[], examTypes: string[]) {
  return await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.questionCollectionId,
    [
      Query.contains("exam_time", examTimes),
      Query.contains("exam_type", examTypes),
      Query.limit(3200),
    ]
  );
}

export async function fetchPictureURL(
  fileName: string
): Promise<string | null> {
  try {
    return storage.getFileView(appwriteConfig.bucketId, fileName);
    // 方法二：若你需要可直接下載的檔案網址，可以改成
    // return storage.getFileView(BUCKET_ID, file.$id).href;
  } catch (err) {
    console.error("圖片查詢錯誤", err);
    return null;
  }
}


export async function createNewCollection(
  time: string,
  exam_time: string,
  exam_type: string,
  number: number,
  correct: number,
  wrong: number,
  unanswered: number
) {
  try {
    const res = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.recordCollectionId,
      ID.unique(),
      {
        test_time: time,
        exam_time: exam_time,
        exam_type: exam_type,
        total_number: number,
        correct: correct,
        wrong: wrong,
        unanswered: unanswered,
      }
    );
    console.log("success!!");
    console.log(res);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
