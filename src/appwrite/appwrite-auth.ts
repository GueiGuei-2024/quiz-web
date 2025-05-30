import { OAuthProvider, Query, ID } from "appwrite";
import { account, appwriteConfig, database } from "./client";



export const loginWithGoogle= async()=>{
    try{
        account.createOAuth2Session(
            OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
        )
        
    } catch(e){
        console.log('Error during OAuth2 session creation:', e);
    }
}

export const logoutUser= async()=>{
    
    try{
        await account.deleteSession('current');

    } catch(e){
        console.log('Error during logout:', e);
    }
}

export const getUser= async()=>{
    
    try{
        const user = await account.get()

        // if (!user) return router.push('./')

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        )
        console.log(documents)
    } catch(e){
        console.error("Error fetching user:", e);
    return null;
    }
}

export const getGooglePicture= async()=>{
    try{
        const session = await account.getSession('current');
        const oAuthToken = session.providerAccessToken;

        if(!oAuthToken){
            console.log("No Auth TOKEN available!");
            return null
        }

        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            {
                headers:{
                    Authorization:`Bearer ${oAuthToken}`
                },
            }
        );

        if(!response.ok){
            console.log("Failed to fetch profile photo from Google People API")
            return null;
        }

        const data = await response.json()

        const photoUrl = data.photos && data.photos.length >0
            ? data.photo[0].url
            : null

        return photoUrl

    } catch(e){
        console.log("getGooglePicture error:", e);
        return null
    }
}

export const storeUserdata= async()=>{
    try{
        const user = await account.get();
        
        if (!user) return null;

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", user.$id)]
        )

        if (documents.length>0) return documents[0]

        const imageUrl = await getGooglePicture()

        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId : user.$id,
                email : user.email,
                name : user.name,
                imageUrl : imageUrl ||"",
                joinedAt : new Date().toISOString(),
            }
        )

        return newUser

    } catch(e){
        console.log("storeUserdata error:",e);
        return null
    }
}

export const getExstingUser= async()=>{
    try{

    } catch(e){
        console.log(e);
    }
}

