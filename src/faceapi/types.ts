import * as faceapi from 'face-api.js'

export type Detection = faceapi.WithFaceExpressions<
    faceapi.WithFaceLandmarks<
        {
            detection: faceapi.FaceDetection
        },
        faceapi.FaceLandmarks68
    >
>
