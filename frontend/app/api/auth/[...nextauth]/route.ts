import GitHubProvider from "next-auth/providers/github"
import axios from "axios";
import NextAuth from "next-auth";
import { User as NextAuthUser, Account as NextAuthAccount, Profile as NextAuthProfile } from "next-auth";

interface signInArgs{user:NextAuthUser,account:NextAuthAccount,profile:NextAuthProfile}

export const authOptions = {
    providers:[
        GitHubProvider({
            clientId:process.env.GITHUB_ID!,
            clientSecret:process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks:{
        async signIn({user ,account,profile}:signInArgs) {
            if (account.provider === 'github') {
              const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/loginUser`,
                {
                    userId: user.id,
                    provider: account.provider,
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
              )
              console.log(response.data)
            }
            return true; // Return true to continue the sign-in process
        },
        async session({ session, user, token }:any) {
            session.user.id = token.sub;
            return session;
          }
    }
};

export const handler = NextAuth(authOptions)

export {handler as GET,handler as POST};