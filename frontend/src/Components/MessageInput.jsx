import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Send, Image, X } from 'lucide-react'; // Added X icon

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagepreview, setImagepreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage  } = useChatStore();

    const handleImageChange = (e) => { // Fixed spelling of "handle"
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) { // Fixed file validation
            toast.error("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImagepreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagepreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSentMessage = async (e) => { // Fixed spelling of "handle"
        e.preventDefault();
        if (!text.trim() && !imagepreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagepreview,
            });
            setText("");
            setImagepreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message:", error);
        } 
        
    };

    return (
        <div className='p-4 w-full'>
            {imagepreview && (
                <div className='mb-3 flex items-center gap-2'>
                    <div className='relative'>
                        <img src={imagepreview} alt="preview"
                            className='size-20 object-cover rounded-lg border border-zinc-700' />
                        <button
                            onClick={removeImage}
                            className='absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300
                            flex items-center justify-center ' type='button'>
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSentMessage} className='flex items-center gap-2'> {/* Fixed function name */}
                <div className='flex-1 flex gap-2'>
                    <input type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder='Type a Message...'
                        value={text}
                        onChange={(e) => setText(e.target.value)} />

                    <input type="file"
                        accept='image/*'
                        className='hidden'
                        ref={fileInputRef} // Fixed typo (red → ref)
                        onChange={handleImageChange} /> 

                    <button 
                        type='button'
                        className={`hidden sm:flex btn btn-circle
                        ${imagepreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}>
                        <Image size={20} />
                    </button>
                </div>
                <button type='submit'
                    className='btn btn-sm btn-circle'
                    disabled={!text.trim() && !imagepreview}>
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
