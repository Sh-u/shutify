import type { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'



const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">

    <main className='flex'>
      <Sidebar />
      <Center/>
    </main>

<div >
  <Player />
</div>

    </div>
  )
}


export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session
    }
  }
}

export default Home
