import genericState from '@/app/states/genericState';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'

const UserSession = () => {
    const { data: session }:any = useSession({
        required:true
      });

      const {setUserId,userObj,setUserObj} = genericState()

      useEffect(() => {
        if(!userObj?.userId){
            const sessionUserId = session?.user?.id;
            const sessionUserImage = session?.user?.image
            const sessionUserName = session?.user?.name
            if (sessionUserId) {
              setUserId(sessionUserId);
              setUserObj({userId:sessionUserId,userName:sessionUserName,userImage:sessionUserImage})
            }
        }
      }, [session]);
  return (
    <></>
  )
}

export default UserSession