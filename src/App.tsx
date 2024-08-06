import React from 'react'
import FileUploader from '@/FileUploader'
import VideoPlayer from '@/VideoPlayer'

const App: React.FC = () => {
    return (
        <>
            <h1 className="text-center text-[2rem] text-blue-700">
                ID Verification
            </h1>
            <div className="mt-10 flex flex-col items-center justify-center">
                <FileUploader />
                {/* <VideoPlayer /> */}
            </div>
        </>
    )
}

export default App
