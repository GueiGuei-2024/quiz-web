// // src/lib/server/appwrite.js
// "use server";
// import {
//   Client,
//   Account,
//   Databases,
//   Users,
//   ID,
// } from "node-appwrite";
// import { cookies } from "next/headers";
// import { appwriteConfig } from "./client";

// export async function createSessionClient() {
//   const client = new Client()
//     .setEndpoint(appwriteConfig.endpointUrl)
//     .setProject(appwriteConfig.projectId);

//   const session = (await cookies()).get("appwrite-session");
//   if (!session || !session.value) {
//     return null;
//   }

//   client.setSession(session.value);

//   return {
//     get account() {
//       return new Account(client);
//     },
//   };
// }

// export async function createAdminClient() {
//   const client = new Client()
//     .setEndpoint(appwriteConfig.endpointUrl)
//     .setProject(appwriteConfig.projectId)
//     .setKey(appwriteConfig.apiKey);

//   return {
//     get account() {
//       return new Account(client);
//     },
//     get database() {
//       return new Databases(client);
//     },
//     get user() {
//       return new Users(client);
//     },
//   };
// }

// export async function getLoggedInUser() {
//   try {
//     const { account } = await createSessionClient();
//     return await account.get();
//   } catch (error) {
//     return null;
//   }
// }

// export async function signUpWithEmail(formData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const name = formData.get("name") as string;

//   try {
//     const { account, database } = await createAdminClient();
//     const newUserAccount = await account.create(
//       ID.unique(),
//       email,
//       password,
//       name
//     );
//     if (!newUserAccount) throw new Error("error for create new account!!");

//     const newUser = await database.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       ID.unique(),
//       {
//         name: name,
//         email: email,
//         accountId: newUserAccount.$id,
//         joinedAt: newUserAccount.$createdAt,
//       }

//       // console.log("新創立的database : ", newUser)
//     );

//     if (!newUser) throw new Error ("Error for Create user in database!");

//     //同時登入!!
//     const session = await account.createEmailPasswordSession(email, password);

//     cookies().set("appwrite-session", session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//     });

//     return{success: true};
//   } catch (error:any) {
//     return {
//         error: error.message
//     }
//   } 

// }
