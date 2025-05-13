import { Client, Storage, Databases, Query} from "appwrite";

//const FILE_ID = "68203503003910acff18"
const BUCKET_ID = '682034c0001eeddafdbf'

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('682024a200381473ab57');

const storage = new Storage(client);

const result = await storage.listFiles(
    BUCKET_ID,
    [
        Query.equal('name', '2025-1-醫學4-38.png')
    ]
);

//

const pic = await storage.getFileView(
    BUCKET_ID, // bucketId
    '68205ae20001bfedb33e'
);
//
const databases = new Databases(client);
const DATABASE_ID = '682025120027f355b057'

const COLLECTION_ID_1='6821d0f00033f7c6bc80'

export async function getQuestions() {
  return await databases.listDocuments(
    DATABASE_ID, 
    COLLECTION_ID_1,
    [
        Query.limit(240)
    ]
    );
}

export {result, storage, databases, BUCKET_ID, pic, DATABASE_ID, COLLECTION_ID_1};


