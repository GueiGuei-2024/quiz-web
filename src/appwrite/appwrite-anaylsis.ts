import { database, appwriteConfig, account } from "./client";
import { Query } from "appwrite";

export async function fetchExamData() {
  try {
    const currentUser = await account.get();
    if (!currentUser) return null;

    try {
      const userExamData = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.recordCollectionId,
        [Query.equal("userId", currentUser.$id)]
      );

      return userExamData;
    } catch (error) {
      console.log("No data in the database: ", error);
      return null;
    }
  } catch (error) {
    console.log("failed to fetch userId:", error);
    return null;
  }
}
