import { db } from "@/lib/db";
import { currentUser, auth} from "@clerk/nextjs/server";

export const currentUserProfile = async (redirect?: boolean) => {
  const user = await currentUser();

  if (!user) {
    if (redirect) {
      return auth().redirectToSignIn();
    }
    return null;
  }

  const profile = await db.user.findFirst({
    where: {
      clerk_id: user.id,
    }
  });

  if (profile) {
    return profile;
  }

  console.log("Creating user with ID: " + user.id);

  try {
    const newProfile = await db.user.create({
      data: {
        clerk_id: user.id,
        name: `${user.firstName ?? user.username ?? user.emailAddresses[0].emailAddress}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      }
    })
    return newProfile;
  } catch (error){
    return (await db.user.findUnique({
      where: {
        clerk_id: user.id,
      }
    }));
  }


}