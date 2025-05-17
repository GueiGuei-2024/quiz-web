import { Client, Storage, Databases, Query } from "appwrite";

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const storage = new Storage(client);
const databases = new Databases(client);

export async function getQuestions(examTimes: string[], examTypes: string[]) {
  return await databases.listDocuments(
    DATABASE_ID, 
    COLLECTION_ID,  
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
    return storage.getFileView(BUCKET_ID, fileName);
    // 方法二：若你需要可直接下載的檔案網址，可以改成
    // return storage.getFileView(BUCKET_ID, file.$id).href;
  } catch (err) {
    console.error("圖片查詢錯誤", err);
    return null;
  }
}

export { storage, databases, BUCKET_ID, DATABASE_ID, COLLECTION_ID };
