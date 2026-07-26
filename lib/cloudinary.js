// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Helper عام لرفع بافر صورة لـ Cloudinary داخل فولدر معيّن. مستخدم من
// أي route محتاج يرفع صورة (زي social icons) من غير ما يكرر نفس
// upload_stream/Promise wrapper في كل مكان.
export function uploadImage(buffer, folder = "uploads") {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image" }, (err, result) =>
            err ? reject(err) : resolve(result)
        );
        stream.end(buffer);
    });
}

// Helper عام لمسح صورة بالـ publicId بتاعها. بيبتلع أي error (زي لو
// الصورة كانت متمسوحة أصلاً) عشان مينفعش يوقف عملية تانية (زي تعديل
// أو حذف عنصر) بس لأن مسح الصورة القديمة فشل.
export async function deleteImage(publicId) {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId).catch(() => {});
}

export default cloudinary;