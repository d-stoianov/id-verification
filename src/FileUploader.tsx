import { useState } from 'react'

const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null)
    const [imgSrc, setImgSrc] = useState<string>('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])

            const imageSrc = URL.createObjectURL(e.target.files[0])
            setImgSrc(imageSrc)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center gap-6">
            <div>
                <label htmlFor="file" className="cursor-pointer">
                    {file ? file.name : 'Select Image'}
                </label>

                <input
                    id="file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            {imgSrc && <img width={500} src={imgSrc} alt="imgPreview" />}
        </div>
    )
}

export default FileUploader
