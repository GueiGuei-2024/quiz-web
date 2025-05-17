import { Client, Storage, Databases, Query} from "appwrite";

// // local端使用
// const BUCKET_ID = '68249b790020878861c8'
// const DATABASE_ID = '682451bc00308cc3ece2'
// const COLLECTION_ID_1='682451c80028611d9cac'

// const client = new Client()
//   .setEndpoint('http://localhost/v1')
//   .setProject('682450de0018800056e8')

// web端使用
const BUCKET_ID = '682034c0001eeddafdbf'
const DATABASE_ID = '682025120027f355b057'
const COLLECTION_ID_1='6828076f001a2f07a8f8'

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('682024a200381473ab57')


const storage = new Storage(client);
const databases = new Databases(client);


export async function getQuestions() {
  return await databases.listDocuments(
    DATABASE_ID, 
    COLLECTION_ID_1,
    [
        Query.limit(3200)
    ]
    );
}


export async function fetchPictureURL (fileName: string): Promise<string | null> {
    try {
      return storage.getFileView(BUCKET_ID, fileName);
      // 方法二：若你需要可直接下載的檔案網址，可以改成
      // return storage.getFileView(BUCKET_ID, file.$id).href;
    } catch (err) {
      console.error("圖片查詢錯誤", err);
      return null;
    }
  };

export {storage, databases, BUCKET_ID,  DATABASE_ID, COLLECTION_ID_1};


