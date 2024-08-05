import React from 'react'
import VideoPlayer from '@/VideoPlayer'

const App: React.FC = () => {
    return (
        <>
            <h1 className="text-center text-[2rem] text-blue-700">
                ID Verification
            </h1>
            <div className="flex justify-center">
                <VideoPlayer />
            </div>
        </>
    )
}

export default App
