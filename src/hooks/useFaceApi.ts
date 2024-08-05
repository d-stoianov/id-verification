import { useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'

const useFaceApi = () => {
    const [modelsLoaded, setModelsLoaded] = useState(false)

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

    return modelsLoaded
}

export default useFaceApi
