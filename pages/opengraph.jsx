import { useRouter } from 'next/router'

export default function Opengraph() {
  const { query } = useRouter()
  const { title } = query

  return (
    <div className='w-[1200px] h-[630px] bg-slate-700 flex items-center justify-center'>
      <div class='flex flex-col h-[530px] w-[1100px] rounded-3xl bg-white items-center justify-between px-12 py-24'>
        <h1 class='text-7xl grow font-semibold'>{title}</h1>
        <span class='text-3xl'>by Fardeen Ehsan</span>
      </div>
    </div>
  )
}