import React from 'react'
import { getProviders, signIn} from "next-auth/react"
import { NextAuthOptions } from "next-auth"




 const Login = ({providers}: NextAuthOptions) => {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
        <img className='w-40 mb-5' src="https://links.papareact.com/9xl" alt=""/>
        {Object.values(providers).map(provider => (
         <div key={provider.name}>
          <button className='bg-[#18D860] text-white p-5  rounded-full' 
          onClick={() => signIn()}>Login with {provider.name}</button>
         </div>
        ))}
    </div>
  )
}

export default Login


export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers
    }

  };
}