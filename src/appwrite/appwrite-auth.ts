import { OAuthProvider, Query, ID, AppwriteException } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { AppUser } from "@/app/types";

export async function signUpWithEmail({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    const res = await account.create(ID.unique(), email, password, name);
    console.log("success!!", res);
    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        name: name,
        email: email,
        accountId: res.$id,
        joinedAt: res.$createdAt,
      }
    );
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AppwriteException) {
      console.log("Appwrite 錯誤: ", error.message);
      return { error: error.message };
    }
    return { error: "未知錯誤" };
  }
}

export async function loginWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await account.createEmailPasswordSession(email, password);
    console.log("成功登入success!!", res);
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AppwriteException) {
      console.log("Appwrite 錯誤: ", error.message);
      return { error: error.message };
    }
    return { error: "未知錯誤" };
  }
}

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/oauth/callback`,
      `${window.location.origin}/login`
    );
  } catch (e) {
    console.log("Error during OAuth2 session creation:", e);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (e) {
    console.log("Error during logout:", e);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) return null;

    const res = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );

    if (res.documents.length === 0) {
      console.warn("No matching user document found for accountId:", user.$id);
      return null;
    }

    const doc = res.documents[0];

    // 手動映射
    const appUser: AppUser = {
      name: doc.name,
      email: doc.email,
      imageUrl: doc.imageUrl,
      joinedAt: doc.joinedAt,
      accountId: doc.accountId,
    };

    return appUser;
  } catch (e) {
    console.error("Error fetching user:", e);
    return null;
  }
};

export const getGooglePicture = async () => {
  try {
    const session = await account.getSession("current");
    const oAuthToken = session.providerAccessToken;

    if (!oAuthToken) {
      console.log("No Auth TOKEN available!");
      return null;
    }

    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      {
        headers: {
          Authorization: `Bearer ${oAuthToken}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch profile photo from Google People API");
      return null;
    }

    const data = await response.json();

    const photoUrl =
      data.photos && data.photos.length > 0 ? data.photos[0].url : null;

    return photoUrl;
  } catch (e) {
    console.log("getGooglePicture error:", e);
    return null;
  }
};

export const storeUserdata = async () => {
  try {
    const user = await account.get();

    if (!user) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", user.$id)]
    );

    if (documents.length > 0) return documents[0];

    const imageUrl = await getGooglePicture();

    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: imageUrl || "",
        joinedAt: new Date().toISOString(),
      }
    );

    return newUser;
  } catch (e) {
    console.log("storeUserdata error:", e);
    return null;
  }
};

export const getExstingUser = async () => {
  try {
  } catch (e) {
    console.log(e);
  }
};
