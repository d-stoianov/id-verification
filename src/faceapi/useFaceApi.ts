import { useEffect, useState, useRef } from 'react'
import * as faceapi from 'face-api.js'
import { Detection } from '@/faceapi/types'

const useFaceApi = (
    video: HTMLVideoElement | null,
    showDetections: boolean
) => {
    const [modelsLoaded, setModelsLoaded] = useState(false)
    const [detections, setDetections] = useState<Detection[]>([])
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models'

                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                ])

                setModelsLoaded(true)
            } catch (error) {
                console.error('Error loading FaceAPI models:', error)
                setModelsLoaded(false)
            }
        }

        loadModels()
    }, [])

    useEffect(() => {
        if (!modelsLoaded || !video) return

        const startDetection = () => {
            intervalRef.current = setInterval(async () => {
                const capturedDetections = await captureDetections(video)
                setDetections(capturedDetections)
                if (showDetections) {
                    drawDetections(video, capturedDetections)
                }
            }, 100)
        }

        startDetection()

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [modelsLoaded, video, showDetections])

    return { modelsLoaded, detections }
}

function drawDetections(video: HTMLVideoElement, detections: Detection[]) {
    const existingCanvas = document.querySelector('canvas')
    if (existingCanvas) {
        existingCanvas.remove()
    }

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

    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d')?.clearRect(0, 0, video.width, video.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
}

async function captureDetections(video: HTMLVideoElement) {
    return await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
}

export default useFaceApi
