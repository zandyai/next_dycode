// Import required modules
import { NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary';

// Cloudinary configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET,
});

// API route handler
export async function POST(request: Request) {
    // Log the incoming request details
    console.log("Incoming request:", {
        method: request.method,
        url: request.url,
        headers: request.headers,
      });
    
    // Parse the request body to get the 'path' value
    const { path } = await request.json();

    if(!path) {
        return NextResponse.json(
            { message: 'Image path is required' }, 
            { status: 400 }
        )
    };

    // Log the image path to be uploaded
    console.log("Image path:", path);

    try {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            transformation: [{width: 1000, height: 752, crop: 'scale'}],
        };
        
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(path, options);

        // Log the Cloudinary upload result
        console.log("Upload result:", result);

        // Send the response with the Cloudinary upload result
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        // Log any errors that occur during the image upload process
        console.error("Error uploading image:", error);

        // Send an error response
        return NextResponse.json({ message: "Failed to upload image on Cloudinary" }, { status: 500 });
    }
}