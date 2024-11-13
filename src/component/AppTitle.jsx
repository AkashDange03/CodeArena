import React from 'react'

function AppTitle({setMenu}) {
    return (
        <>
            <div className='flex justify-start w-full gap-2'>
                <img className='w-[60px]' src="/logoCode.png" alt="" />
                <h1 className='text-xl font-bold my-auto text-white '>CodeArena</h1>
            </div>
        </>
    )
}

export default AppTitle