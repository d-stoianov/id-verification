import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import useFaceApi from '@/hooks/useFaceApi'

const App: React.FC = () => {
    const modelsLoaded: boolean = useFaceApi()
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false)

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

                    // canvas
                    const canvas = faceapi.createCanvasFromMedia(video)
                    canvas.style.position = 'absolute'
                    canvas.style.top = `${video.offsetTop}px`
                    canvas.style.left = `${video.offsetLeft}px`
                    document.body.append(canvas)

                    const displaySize = {
                        width: video.width,
                        height: video.height,
                    }

                    faceapi.matchDimensions(canvas, displaySize)

                    setInterval(async () => {
                        captureDetections(canvas, video, displaySize)
                    }, 100)
                }
            }
        } catch (error) {
            console.error('Error accessing the camera:', error)
        }
    }

    const captureDetections = async (
        canvas: HTMLCanvasElement,
        video: HTMLVideoElement,
        displaySize: faceapi.IDimensions
    ) => {
        const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()

        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d')?.clearRect(0, 0, video.width, video.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
    }

    return (
        <>
            <h1 className="text-center text-[2rem] text-blue-700">
                ID Verification
            </h1>
            <div className="flex justify-center">
                <video
                    ref={videoRef}
                    width={720}
                    height={560}
                    autoPlay
                    muted
                ></video>
            </div>
        </>
    )
}

export default App
