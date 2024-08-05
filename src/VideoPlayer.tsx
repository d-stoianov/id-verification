import React, { useEffect, useRef, useState } from 'react'
import useFaceApi from '@/faceapi/useFaceApi'

const VideoPlayer: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const { modelsLoaded, detections } = useFaceApi(videoRef.current, true)
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false)

    console.log('detections', detections)

    useEffect(() => {
        if (modelsLoaded && videoRef.current && !isVideoPlaying) {
            startVideo()
        }
    }, [modelsLoaded, isVideoPlaying])

    const startVideo = async () => {
        const video = videoRef.current
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            })
            if (video) {
                video.srcObject = stream
                video.onloadedmetadata = () => {
                    videoRef.current?.play()
                    setIsVideoPlaying(true)
                }
            }
        } catch (error) {
            console.error('Error accessing the camera:', error)
        }
    }

    return <video ref={videoRef} width={720} height={560} autoPlay muted />
}

export default VideoPlayer
