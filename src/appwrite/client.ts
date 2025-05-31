import { Account, Client, Databases, Storage } from "appwrite"

export const appwriteConfig={
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,

    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,

    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    questionCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
    recordCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_RECORD!,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_USER!,
    contactCollectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID_CONTACT!,
    apiKey:process.env.NEXT_PUBLIC_APPWRITE_APIKEY!,

}

const client =new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)

const account = new Account(client)
const database = new Databases(client)
const storage = new Storage(client)

export {client, account, database, storage}