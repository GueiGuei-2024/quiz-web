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
  userId:string|null,
  createdAt: string,
  test_category: string,
  question_order: string[],
  question_status: string[],
  tag_order: string[],
  number: number,
  correct: number,
  wrong: number,
  unanswered: number,
  time_consumption: number,
  exam_time: string|null,
) {
  try {
    const res = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.recordCollectionId,
      ID.unique(),
      {
        userId: userId,
        createdAt: createdAt,
        test_category: test_category,
        question_order: question_order,
        question_status: question_status,
        tag_order: tag_order,
        total_number: number,
        correct: correct,
        wrong: wrong,
        unanswered: unanswered,
        time_consumption: time_consumption,
        formal_test_type: exam_time
      }
    );
    console.log("success!!");
    console.log(res);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
