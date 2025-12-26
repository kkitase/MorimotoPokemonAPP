import React, { useRef } from 'react';

interface ImagePickerProps {
    onImageSelected: (uri: string) => void;
    selectedImage: string | null;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelected, selectedImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageSelected(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>AIカメラ分析</span>
            </h2>

            <div className="space-y-4">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-red-400 transition-colors"
                >
                    {selectedImage ? (
                        <>
                            <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full">写真を撮り直す</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-8">
                            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-900 font-bold text-lg mb-1">画面を撮影する</p>
                            <p className="text-gray-500 text-sm">クリックしてカメラを起動</p>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                    />
                </div>

                <div className="text-xs text-center text-gray-400">
                    <p>※ バトル画面やステータス画面を撮影してください</p>
                </div>
            </div>
        </div>
    );
};

export default ImagePicker;
